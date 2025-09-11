// CarbonTrace Android Data Models
package com.carbontrace.models

import com.google.gson.annotations.SerializedName
import java.util.Date

// Submission Model
data class Submission(
    @SerializedName("id") val id: String,
    @SerializedName("userId") val userId: String,
    @SerializedName("type") val type: String, // mangrove, seagrass, coral
    @SerializedName("location") val location: Location,
    @SerializedName("area") val area: Double,
    @SerializedName("description") val description: String,
    @SerializedName("images") val images: List<Image>,
    @SerializedName("estimatedCredits") val estimatedCredits: Int,
    @SerializedName("status") val status: String, // pending, approved, rejected
    @SerializedName("deviceInfo") val deviceInfo: DeviceInfo,
    @SerializedName("aiVerification") val aiVerification: AIVerification,
    @SerializedName("createdAt") val createdAt: String,
    @SerializedName("updatedAt") val updatedAt: String
)

data class Location(
    @SerializedName("lat") val latitude: Double,
    @SerializedName("lng") val longitude: Double,
    @SerializedName("address") val address: String
)

data class Image(
    @SerializedName("id") val id: String,
    @SerializedName("url") val url: String,
    @SerializedName("thumbnail") val thumbnail: String,
    @SerializedName("originalName") val originalName: String,
    @SerializedName("size") val size: Long
)

data class DeviceInfo(
    @SerializedName("platform") val platform: String,
    @SerializedName("version") val version: String,
    @SerializedName("device") val device: String
)

data class AIVerification(
    @SerializedName("result") val result: String,
    @SerializedName("confidence") val confidence: Double,
    @SerializedName("processingTime") val processingTime: Double,
    @SerializedName("timestamp") val timestamp: String?
)

// User Profile Model
data class UserProfile(
    @SerializedName("userId") val userId: String,
    @SerializedName("name") val name: String,
    @SerializedName("email") val email: String,
    @SerializedName("totalCredits") val totalCredits: Int,
    @SerializedName("totalSubmissions") val totalSubmissions: Int,
    @SerializedName("verifiedSubmissions") val verifiedSubmissions: Int,
    @SerializedName("joinDate") val joinDate: String,
    @SerializedName("status") val status: String,
    @SerializedName("walletAddress") val walletAddress: String
)

// Carbon Credit Model
data class CarbonCredit(
    @SerializedName("id") val id: String,
    @SerializedName("amount") val amount: Int,
    @SerializedName("type") val type: String,
    @SerializedName("status") val status: String,
    @SerializedName("createdAt") val createdAt: String,
    @SerializedName("blockchainTx") val blockchainTx: String
)

// API Response Models
data class ApiResponse<T>(
    @SerializedName("success") val success: Boolean,
    @SerializedName("data") val data: T?,
    @SerializedName("error") val error: String?,
    @SerializedName("message") val message: String?
)

data class PaginatedResponse<T>(
    @SerializedName("success") val success: Boolean,
    @SerializedName("data") val data: List<T>,
    @SerializedName("pagination") val pagination: Pagination
)

data class Pagination(
    @SerializedName("page") val page: Int,
    @SerializedName("limit") val limit: Int,
    @SerializedName("total") val total: Int,
    @SerializedName("pages") val pages: Int
)

// Submission Request Model
data class SubmissionRequest(
    @SerializedName("userId") val userId: String,
    @SerializedName("type") val type: String,
    @SerializedName("latitude") val latitude: Double,
    @SerializedName("longitude") val longitude: Double,
    @SerializedName("area") val area: Double,
    @SerializedName("description") val description: String,
    @SerializedName("deviceInfo") val deviceInfo: String,
    @SerializedName("appVersion") val appVersion: String
)


