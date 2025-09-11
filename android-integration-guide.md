# CarbonTrace Android Integration Guide

## 🚀 Complete Integration for Kotlin Android App

### Prerequisites
- Android Studio
- Kotlin
- Retrofit2
- OkHttp
- Gson
- Coroutines
- Location Services

## 📱 Android Dependencies

Add these to your `build.gradle` (Module: app):

```gradle
dependencies {
    // Networking
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:okhttp:4.11.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.11.0'
    
    // Coroutines
    implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3'
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0'
    
    // Location Services
    implementation 'com.google.android.gms:play-services-location:21.0.1'
    
    // Image Loading
    implementation 'com.github.bumptech.glide:glide:4.15.1'
    
    // Permissions
    implementation 'androidx.activity:activity-ktx:1.8.0'
    implementation 'androidx.fragment:fragment-ktx:1.6.1'
}
```

## 🔧 Setup Instructions

### 1. Copy the Integration Files

Copy these files to your Android project:
- `DataModels.kt` → `app/src/main/java/com/yourpackage/models/`
- `ApiService.kt` → `app/src/main/java/com/yourpackage/network/`
- `UsageExample.kt` → `app/src/main/java/com/yourpackage/` (for reference)

### 2. Update API Base URL

In `ApiService.kt`, update the BASE_URL:
```kotlin
private const val BASE_URL = "https://your-domain.com/api/" // Replace with your server URL
```

### 3. Add Network Security Config

Create `res/xml/network_security_config.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">your-domain.com</domain>
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>
```

Update `AndroidManifest.xml`:
```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ... >
```

### 4. Add Permissions

In `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## 📱 Implementation Examples

### 1. Submit Plantation Activity

```kotlin
class SubmitPlantationActivity : AppCompatActivity() {
    
    private lateinit var viewModel: CarbonTraceViewModel
    private lateinit var locationManager: LocationManager
    private var currentLocation: Location? = null
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_submit_plantation)
        
        viewModel = ViewModelProvider(this)[CarbonTraceViewModel::class.java]
        locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
        
        setupUI()
        observeViewModel()
    }
    
    private fun setupUI() {
        // Setup your UI components
        findViewById<Button>(R.id.btnSubmit).setOnClickListener {
            submitPlantation()
        }
        
        findViewById<Button>(R.id.btnSelectImages).setOnClickListener {
            selectImages()
        }
    }
    
    private fun observeViewModel() {
        viewModel.isLoading.observe(this) { isLoading ->
            // Show/hide loading indicator
            findViewById<ProgressBar>(R.id.progressBar).visibility = 
                if (isLoading) View.VISIBLE else View.GONE
        }
        
        viewModel.error.observe(this) { error ->
            Toast.makeText(this, error, Toast.LENGTH_LONG).show()
        }
    }
    
    private fun submitPlantation() {
        val userId = getCurrentUserId() // Implement this
        val type = getSelectedType() // Implement this
        val area = getAreaInput() // Implement this
        val description = getDescriptionInput() // Implement this
        val images = getSelectedImages() // Implement this
        
        currentLocation?.let { location ->
            val imageParts = images.map { file ->
                createImagePart(file)
            }
            
            viewModel.submitPlantation(
                userId = userId,
                type = type,
                latitude = location.latitude,
                longitude = location.longitude,
                area = area,
                description = description,
                deviceInfo = android.os.Build.MODEL,
                appVersion = getAppVersion(),
                imageFiles = imageParts
            )
        } ?: run {
            Toast.makeText(this, "Location not available", Toast.LENGTH_SHORT).show()
        }
    }
    
    private fun selectImages() {
        val intent = Intent(Intent.ACTION_GET_CONTENT)
        intent.type = "image/*"
        intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
        startActivityForResult(intent, REQUEST_IMAGE_SELECT)
    }
    
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == REQUEST_IMAGE_SELECT && resultCode == RESULT_OK) {
            // Handle selected images
            val selectedImages = data?.clipData?.let { clipData ->
                (0 until clipData.itemCount).map { i ->
                    clipData.getItemAt(i).uri
                }
            } ?: listOf(data?.data)
            
            // Convert URIs to Files and update UI
            updateSelectedImages(selectedImages)
        }
    }
    
    companion object {
        private const val REQUEST_IMAGE_SELECT = 1001
    }
}
```

### 2. Submissions List Activity

```kotlin
class SubmissionsListActivity : AppCompatActivity() {
    
    private lateinit var viewModel: CarbonTraceViewModel
    private lateinit var adapter: SubmissionsAdapter
    private lateinit var recyclerView: RecyclerView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_submissions_list)
        
        viewModel = ViewModelProvider(this)[CarbonTraceViewModel::class.java]
        setupRecyclerView()
        observeViewModel()
        
        // Load submissions
        val userId = getCurrentUserId()
        viewModel.loadUserSubmissions(userId)
    }
    
    private fun setupRecyclerView() {
        recyclerView = findViewById(R.id.recyclerView)
        adapter = SubmissionsAdapter { submission ->
            // Handle submission click
            openSubmissionDetails(submission)
        }
        recyclerView.adapter = adapter
        recyclerView.layoutManager = LinearLayoutManager(this)
    }
    
    private fun observeViewModel() {
        viewModel.submissions.observe(this) { submissions ->
            adapter.submitList(submissions)
        }
        
        viewModel.isLoading.observe(this) { isLoading ->
            // Show/hide loading indicator
        }
        
        viewModel.error.observe(this) { error ->
            Toast.makeText(this, error, Toast.LENGTH_LONG).show()
        }
    }
    
    private fun openSubmissionDetails(submission: Submission) {
        val intent = Intent(this, SubmissionDetailsActivity::class.java)
        intent.putExtra("submission_id", submission.id)
        startActivity(intent)
    }
}

// RecyclerView Adapter
class SubmissionsAdapter(
    private val onItemClick: (Submission) -> Unit
) : ListAdapter<Submission, SubmissionsAdapter.ViewHolder>(DiffCallback()) {
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_submission, parent, false)
        return ViewHolder(view)
    }
    
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
    
    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        fun bind(submission: Submission) {
            itemView.findViewById<TextView>(R.id.tvType).text = submission.type
            itemView.findViewById<TextView>(R.id.tvArea).text = "${submission.area} acres"
            itemView.findViewById<TextView>(R.id.tvStatus).text = submission.status
            itemView.findViewById<TextView>(R.id.tvCredits).text = "${submission.estimatedCredits} credits"
            
            // Load first image if available
            submission.images.firstOrNull()?.let { image ->
                Glide.with(itemView.context)
                    .load(image.thumbnail)
                    .into(itemView.findViewById(R.id.ivImage))
            }
            
            itemView.setOnClickListener {
                onItemClick(submission)
            }
        }
    }
    
    class DiffCallback : DiffUtil.ItemCallback<Submission>() {
        override fun areItemsTheSame(oldItem: Submission, newItem: Submission): Boolean {
            return oldItem.id == newItem.id
        }
        
        override fun areContentsTheSame(oldItem: Submission, newItem: Submission): Boolean {
            return oldItem == newItem
        }
    }
}
```

### 3. User Profile Activity

```kotlin
class UserProfileActivity : AppCompatActivity() {
    
    private lateinit var viewModel: CarbonTraceViewModel
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_profile)
        
        viewModel = ViewModelProvider(this)[CarbonTraceViewModel::class.java]
        observeViewModel()
        
        // Load user profile
        val userId = getCurrentUserId()
        viewModel.loadUserProfile(userId)
    }
    
    private fun observeViewModel() {
        viewModel.userProfile.observe(this) { profile ->
            updateUI(profile)
        }
        
        viewModel.isLoading.observe(this) { isLoading ->
            // Show/hide loading indicator
        }
        
        viewModel.error.observe(this) { error ->
            Toast.makeText(this, error, Toast.LENGTH_LONG).show()
        }
    }
    
    private fun updateUI(profile: UserProfile) {
        findViewById<TextView>(R.id.tvUserName).text = profile.name
        findViewById<TextView>(R.id.tvUserEmail).text = profile.email
        findViewById<TextView>(R.id.tvTotalCredits).text = "${profile.totalCredits} credits"
        findViewById<TextView>(R.id.tvTotalSubmissions).text = "${profile.totalSubmissions} submissions"
        findViewById<TextView>(R.id.tvVerifiedSubmissions).text = "${profile.verifiedSubmissions} verified"
    }
}
```

## 🔄 API Endpoints for Android

Your Android app can use these endpoints:

### Mobile-Specific Endpoints
- `POST /api/mobile/submit` - Submit new plantation
- `GET /api/mobile/user/{userId}/submissions` - Get user's submissions
- `GET /api/mobile/user/{userId}/profile` - Get user profile
- `GET /api/mobile/user/{userId}/credits` - Get user's carbon credits

### General Endpoints
- `GET /api/health` - Health check
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/submissions` - All submissions (admin)

## 🚀 Testing the Integration

### 1. Test API Connection
```kotlin
// Test health check
CoroutineScope(Dispatchers.IO).launch {
    try {
        val result = repository.healthCheck()
        withContext(Dispatchers.Main) {
            result.fold(
                onSuccess = { response ->
                    Log.d("API", "Health check successful: ${response.status}")
                },
                onFailure = { error ->
                    Log.e("API", "Health check failed: ${error.message}")
                }
            )
        }
    } catch (e: Exception) {
        Log.e("API", "Exception: ${e.message}")
    }
}
```

### 2. Test Submission
```kotlin
// Test submission with mock data
val mockImages = listOf(/* your test images */)
val imageParts = mockImages.map { createImagePart(it) }

repository.submitPlantation(
    userId = "test_user",
    type = "mangrove",
    latitude = 12.9716,
    longitude = 77.5946,
    area = 2.5,
    description = "Test submission",
    deviceInfo = "Test Device",
    appVersion = "1.0.0",
    imageFiles = imageParts
)
```

## 📱 UI Layout Examples

### activity_submit_plantation.xml
```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Submit Plantation"
        android:textSize="24sp"
        android:textStyle="bold" />

    <Spinner
        android:id="@+id/spinnerType"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp" />

    <EditText
        android:id="@+id/etArea"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:hint="Area (acres)"
        android:inputType="numberDecimal" />

    <EditText
        android:id="@+id/etDescription"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:hint="Description"
        android:inputType="textMultiLine" />

    <Button
        android:id="@+id/btnSelectImages"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:text="Select Images" />

    <RecyclerView
        android:id="@+id/rvSelectedImages"
        android:layout_width="match_parent"
        android:layout_height="120dp"
        android:layout_marginTop="16dp" />

    <Button
        android:id="@+id/btnSubmit"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:text="Submit" />

    <ProgressBar
        android:id="@+id/progressBar"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="center"
        android:visibility="gone" />

</LinearLayout>
```

## 🔧 Troubleshooting

### Common Issues

1. **Network Security Policy**
   - Add network security config for HTTP traffic
   - Check if your server supports HTTPS

2. **Image Upload Issues**
   - Ensure proper file permissions
   - Check image size limits
   - Verify multipart form data format

3. **Location Permission**
   - Request location permissions at runtime
   - Handle permission denied cases

4. **API Connection**
   - Check server URL and port
   - Verify network connectivity
   - Check server logs for errors

### Debug Tips

1. Enable OkHttp logging:
```kotlin
val logging = HttpLoggingInterceptor().apply {
    level = HttpLoggingInterceptor.Level.BODY
}
```

2. Check API responses:
```kotlin
// Log API responses
Log.d("API", "Response: $response")
```

3. Test with Postman first:
```bash
# Test health endpoint
curl http://your-server.com/api/health
```

## 🎯 Next Steps

1. **Integrate with your existing app structure**
2. **Add proper error handling and user feedback**
3. **Implement offline data caching**
4. **Add push notifications for status updates**
5. **Test with real data and images**

Your Kotlin Android app is now ready to integrate with the CarbonTrace backend! 🚀





