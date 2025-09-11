// CarbonTrace Android Usage Example
package com.carbontrace.example

import android.Manifest
import android.content.pm.PackageManager
import android.location.Location
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.carbontrace.network.CarbonTraceApiService
import com.carbontrace.network.CarbonTraceRepository
import com.carbontrace.models.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File

class MainActivity : AppCompatActivity() {
    
    private lateinit var repository: CarbonTraceRepository
    private val LOCATION_PERMISSION_REQUEST = 1001
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        // Initialize API service
        val api = CarbonTraceApiService.create()
        repository = CarbonTraceRepository(api)
        
        // Check permissions
        checkLocationPermission()
        
        // Example usage
        setupExampleUsage()
    }
    
    private fun checkLocationPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) 
            != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                LOCATION_PERMISSION_REQUEST
            )
        }
    }
    
    private fun setupExampleUsage() {
        // Example 1: Submit a plantation
        submitPlantationExample()
        
        // Example 2: Get user submissions
        getUserSubmissionsExample()
        
        // Example 3: Get user profile
        getUserProfileExample()
    }
    
    private fun submitPlantationExample() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Get current location (you'll need to implement this)
                val location = getCurrentLocation()
                
                // Prepare image files (you'll need to implement this)
                val imageFiles = getSelectedImages()
                val imageParts = imageFiles.map { file ->
                    createImagePart(file)
                }
                
                val result = repository.submitPlantation(
                    userId = "user_123",
                    type = "mangrove",
                    latitude = location.latitude,
                    longitude = location.longitude,
                    area = 2.5,
                    description = "Mangrove plantation in coastal area",
                    deviceInfo = android.os.Build.MODEL,
                    appVersion = "1.0.0",
                    imageFiles = imageParts
                )
                
                withContext(Dispatchers.Main) {
                    result.fold(
                        onSuccess = { response ->
                            Toast.makeText(
                                this@MainActivity,
                                "Submission successful! Credits: ${response.estimatedCredits}",
                                Toast.LENGTH_LONG
                            ).show()
                        },
                        onFailure = { error ->
                            Toast.makeText(
                                this@MainActivity,
                                "Submission failed: ${error.message}",
                                Toast.LENGTH_LONG
                            ).show()
                        }
                    )
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(
                        this@MainActivity,
                        "Error: ${e.message}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
        }
    }
    
    private fun getUserSubmissionsExample() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val result = repository.getUserSubmissions(
                    userId = "user_123",
                    page = 1,
                    limit = 20
                )
                
                withContext(Dispatchers.Main) {
                    result.fold(
                        onSuccess = { response ->
                            // Handle submissions data
                            val submissions = response.data
                            val pagination = response.pagination
                            
                            // Update UI with submissions
                            updateSubmissionsList(submissions)
                        },
                        onFailure = { error ->
                            Toast.makeText(
                                this@MainActivity,
                                "Failed to load submissions: ${error.message}",
                                Toast.LENGTH_LONG
                            ).show()
                        }
                    )
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(
                        this@MainActivity,
                        "Error: ${e.message}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
        }
    }
    
    private fun getUserProfileExample() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val result = repository.getUserProfile("user_123")
                
                withContext(Dispatchers.Main) {
                    result.fold(
                        onSuccess = { profile ->
                            // Update UI with profile data
                            updateUserProfile(profile)
                        },
                        onFailure = { error ->
                            Toast.makeText(
                                this@MainActivity,
                                "Failed to load profile: ${error.message}",
                                Toast.LENGTH_LONG
                            ).show()
                        }
                    )
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(
                        this@MainActivity,
                        "Error: ${e.message}",
                        Toast.LENGTH_LONG
                    ).show()
                }
            }
        }
    }
    
    // Helper methods (implement these based on your app's needs)
    private fun getCurrentLocation(): Location {
        // Implement location retrieval
        // This is a placeholder
        val location = Location("")
        location.latitude = 12.9716
        location.longitude = 77.5946
        return location
    }
    
    private fun getSelectedImages(): List<File> {
        // Implement image selection
        // This is a placeholder
        return emptyList()
    }
    
    private fun updateSubmissionsList(submissions: List<Submission>) {
        // Update your RecyclerView or ListView with submissions
        // This is a placeholder
    }
    
    private fun updateUserProfile(profile: UserProfile) {
        // Update UI with user profile data
        // This is a placeholder
    }
}

// ViewModel for better architecture
class CarbonTraceViewModel : ViewModel() {
    
    private val repository = CarbonTraceRepository(CarbonTraceApiService.create())
    private val _submissions = MutableLiveData<List<Submission>>()
    private val _userProfile = MutableLiveData<UserProfile>()
    private val _isLoading = MutableLiveData<Boolean>()
    private val _error = MutableLiveData<String>()
    
    val submissions: LiveData<List<Submission>> = _submissions
    val userProfile: LiveData<UserProfile> = _userProfile
    val isLoading: LiveData<Boolean> = _isLoading
    val error: LiveData<String> = _error
    
    fun submitPlantation(
        userId: String,
        type: String,
        latitude: Double,
        longitude: Double,
        area: Double,
        description: String,
        deviceInfo: String,
        appVersion: String,
        imageFiles: List<MultipartBody.Part>
    ) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val result = repository.submitPlantation(
                    userId, type, latitude, longitude, area,
                    description, deviceInfo, appVersion, imageFiles
                )
                result.fold(
                    onSuccess = { response ->
                        _isLoading.value = false
                        // Refresh submissions after successful submission
                        loadUserSubmissions(userId)
                    },
                    onFailure = { error ->
                        _isLoading.value = false
                        _error.value = error.message
                    }
                )
            } catch (e: Exception) {
                _isLoading.value = false
                _error.value = e.message
            }
        }
    }
    
    fun loadUserSubmissions(userId: String) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val result = repository.getUserSubmissions(userId)
                result.fold(
                    onSuccess = { response ->
                        _isLoading.value = false
                        _submissions.value = response.data
                    },
                    onFailure = { error ->
                        _isLoading.value = false
                        _error.value = error.message
                    }
                )
            } catch (e: Exception) {
                _isLoading.value = false
                _error.value = e.message
            }
        }
    }
    
    fun loadUserProfile(userId: String) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val result = repository.getUserProfile(userId)
                result.fold(
                    onSuccess = { profile ->
                        _isLoading.value = false
                        _userProfile.value = profile
                    },
                    onFailure = { error ->
                        _isLoading.value = false
                        _error.value = error.message
                    }
                )
            } catch (e: Exception) {
                _isLoading.value = false
                _error.value = e.message
            }
        }
    }
}





