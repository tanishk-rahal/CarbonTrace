// CarbonTrace Android API Service
package com.carbontrace.network

import com.carbontrace.models.*
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*
import java.util.concurrent.TimeUnit

// API Interface
interface CarbonTraceApi {
    
    // Submit new plantation
    @Multipart
    @POST("mobile/submit")
    suspend fun submitPlantation(
        @Part("userId") userId: String,
        @Part("type") type: String,
        @Part("latitude") latitude: Double,
        @Part("longitude") longitude: Double,
        @Part("area") area: Double,
        @Part("description") description: String,
        @Part("deviceInfo") deviceInfo: String,
        @Part("appVersion") appVersion: String,
        @Part images: List<MultipartBody.Part>
    ): ApiResponse<SubmissionResponse>
    
    // Get user's submissions
    @GET("mobile/user/{userId}/submissions")
    suspend fun getUserSubmissions(
        @Path("userId") userId: String,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("status") status: String? = null
    ): PaginatedResponse<Submission>
    
    // Get user profile
    @GET("mobile/user/{userId}/profile")
    suspend fun getUserProfile(@Path("userId") userId: String): ApiResponse<UserProfile>
    
    // Get user's carbon credits
    @GET("mobile/user/{userId}/credits")
    suspend fun getUserCredits(
        @Path("userId") userId: String,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): PaginatedResponse<CarbonCredit>
    
    // Health check
    @GET("health")
    suspend fun healthCheck(): ApiResponse<HealthResponse>
}

// Response Models
data class SubmissionResponse(
    @SerializedName("submissionId") val submissionId: String,
    @SerializedName("status") val status: String,
    @SerializedName("estimatedCredits") val estimatedCredits: Int,
    @SerializedName("message") val message: String
)

data class HealthResponse(
    @SerializedName("status") val status: String,
    @SerializedName("timestamp") val timestamp: String,
    @SerializedName("version") val version: String
)

// API Service Class
class CarbonTraceApiService {
    
    companion object {
        private const val BASE_URL = "http://your-server.com/api/" // Replace with your server URL
        private const val TIMEOUT_SECONDS = 30L
        
        fun create(): CarbonTraceApi {
            val logging = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            }
            
            val client = OkHttpClient.Builder()
                .addInterceptor(logging)
                .connectTimeout(TIMEOUT_SECONDS, TimeUnit.SECONDS)
                .readTimeout(TIMEOUT_SECONDS, TimeUnit.SECONDS)
                .writeTimeout(TIMEOUT_SECONDS, TimeUnit.SECONDS)
                .build()
            
            return Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(CarbonTraceApi::class.java)
        }
    }
}

// Repository Class for easy data access
class CarbonTraceRepository(private val api: CarbonTraceApi) {
    
    suspend fun submitPlantation(
        userId: String,
        type: String,
        latitude: Double,
        longitude: Double,
        area: Double,
        description: String,
        deviceInfo: String,
        appVersion: String,
        imageFiles: List<MultipartBody.Part>
    ): Result<SubmissionResponse> {
        return try {
            val response = api.submitPlantation(
                userId, type, latitude, longitude, area,
                description, deviceInfo, appVersion, imageFiles
            )
            if (response.success) {
                Result.success(response.data!!)
            } else {
                Result.failure(Exception(response.error ?: "Unknown error"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getUserSubmissions(
        userId: String,
        page: Int = 1,
        limit: Int = 20,
        status: String? = null
    ): Result<PaginatedResponse<Submission>> {
        return try {
            val response = api.getUserSubmissions(userId, page, limit, status)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getUserProfile(userId: String): Result<UserProfile> {
        return try {
            val response = api.getUserProfile(userId)
            if (response.success) {
                Result.success(response.data!!)
            } else {
                Result.failure(Exception(response.error ?: "Unknown error"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun getUserCredits(
        userId: String,
        page: Int = 1,
        limit: Int = 20
    ): Result<PaginatedResponse<CarbonCredit>> {
        return try {
            val response = api.getUserCredits(userId, page, limit)
            Result.success(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    suspend fun healthCheck(): Result<HealthResponse> {
        return try {
            val response = api.healthCheck()
            if (response.success) {
                Result.success(response.data!!)
            } else {
                Result.failure(Exception(response.error ?: "Unknown error"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

// Extension function to create MultipartBody.Part from file
fun createImagePart(file: File, fieldName: String = "images"): MultipartBody.Part {
    val requestFile = file.asRequestBody("image/*".toMediaTypeOrNull())
    return MultipartBody.Part.createFormData(fieldName, file.name, requestFile)
}





