---
author: Adam Hammer
ms.author: adamhammer
ms.date: 2/22/2024
ms.topic: include
ms.service: azure-communication-services
---

Enabling user feedback within the Azure Communication Services (ACS) UI Library requires action on the developers' part. By utilizing the `onUserReportedIssueEventHandler` in the integration of the library, developers can enable the built-in support form, allowing users to report issues directly. This section guides you through setting up the client-side feedback form.

### Implementing Client-Side Feedback Capture in Android

#### Enabling the Support Form

1. **Event Handler Registration:**
   - To activate the support form within your Android application, register the `onUserReportedIssueEventHandler` at an appropriate point in your application's lifecycle. This registration not only enables the form but also ensures that it becomes visible and accessible to the users.

2. **Form Visibility and Accessibility:**
   - The presence of the registered `onUserReportedIssueEventHandler` directly affects the support form's visibility. Without this handler, the form remains hidden from the user interface, rendering it inaccessible for issue reporting.

#### Capturing and Processing Support Events

1. **Event Emission Upon Issue Reporting:**
   - When users report issues through the enabled support form, the `onUserReportedIssueEventHandler` captures emitted events. These events encapsulate all necessary details related to the user-reported issue, such as descriptions, error logs, and potentially screenshots.

2. **Data Preparation for Submission:**
   - Once a user reports an issue, the next step involves preparing the reported issue data for server submission. This preparation includes structuring the captured information into a format suitable for HTTP transmission, adhering to server expectations.

#### Submitting Issue Data to the Server

1. **Asynchronous Data Transmission:**
   - Utilize asynchronous mechanisms to transmit the prepared data to the designated server endpoint. This approach ensures that the application remains responsive, providing a smooth user experience while the data is being sent in the background.

2. **Server Response Handling:**
   - Upon data submission, it's crucial to handle server responses adeptly. This handling might involve parsing server feedback to confirm successful data transmission and possibly extracting a reference to the submitted issue (like a ticket number or URL) that can be communicated back to the user.

#### Providing User Feedback and Notifications

1. **Immediate User Feedback:**
   - Notify users immediately about the status of their issue report submission through the application's user interface. For successful submissions, consider providing a reference to the submitted issue that allows users to track the progress of their report.

2. **Notification Strategy for Android O and newer:**
   - For devices running Android O (API level 26) and newer, ensure the implementation of a notification channel specific to report submissions. This setup is essential for delivering notifications effectively and is a requirement on these Android versions.

By following these steps, developers can integrate a robust user feedback mechanism into their Android applications, using the `onUserReportedIssueEventHandler` for efficient issue reporting and tracking. This process not only facilitates the timely resolution of user issues but also significantly contributes to enhancing the overall user experience and satisfaction with the application.

### Android Code Sample

The Kotlin code snippet demonstrates the process of integrating a system for handling user-reported issues within an Android application using Azure Communication Services. This integration aims to streamline the support process by enabling direct communication between users and support teams. Here's an overview of the steps involved:

1. **Event Capture**: The system listens for user-reported issues through the ACS UI Library. It utilizes the `onUserReportedIssueEventHandler` to capture feedback from the application's UI, including errors and user concerns.

2. **Data Transmission to Server**: When an issue is reported, the system packages the relevant data, including user messages, error logs, versions, and diagnostic information. This data is then sent to a server endpoint using an asynchronous POST request, ensuring the process doesn't hinder the app's performance.

3. **User Feedback and Notification**: Following the submission, users are immediately informed about the status of their report through in-app notifications. For successful submissions, a notification includes a link or reference to the submitted ticket, allowing users to track the resolution progress.

This setup not only aids in swiftly addressing user issues but also significantly contributes to enhancing user satisfaction and app reliability by providing a clear channel for support and feedback.

```kotlin
package com.azure.android.communication.ui.callingcompositedemoapp

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Intent
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.azure.android.communication.ui.calling.CallCompositeEventHandler
import com.azure.android.communication.ui.calling.models.CallCompositeCallHistoryRecord
import com.azure.android.communication.ui.calling.models.CallCompositeUserReportedIssueEvent
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.asRequestBody
import org.threeten.bp.format.DateTimeFormatter
import java.io.File
import java.io.IOException

/**
 * This class is responsible for handling user-reported issues within the Azure Communication Services Calling UI composite.
 * It implements the CallCompositeEventHandler interface to listen for CallCompositeUserReportedIssueEvents.
 * The class demonstrates how to send diagnostic information to a server endpoint for support purposes and
 * how to provide user feedback through notifications.
 */
class UserReportedIssueHandler : CallCompositeEventHandler<CallCompositeUserReportedIssueEvent> {
    // Flow to observe user reported issues.
    val userIssuesFlow = MutableStateFlow<CallCompositeUserReportedIssueEvent?>(null)

    // Reference to the application context, used to display notifications.
    lateinit var context: Application

    // Lazy initialization of the NotificationManagerCompat for managing notifications.
    private val notificationManager by lazy { NotificationManagerCompat.from(context) }

    /**
     * Handles the event when a user reports an issue.
     * - Creates a notification channel for Android O and above.
     * - Updates the userIssuesFlow with the new event data.
     * - Sends the event data including user message, app and SDK versions, call history, and log files to a server.
     */
    override fun handle(eventData: CallCompositeUserReportedIssueEvent?) {
        createNotificationChannel()
        userIssuesFlow.value = eventData
        eventData?.apply {
            sendToServer(
                userMessage,
                debugInfo.versions.azureCallingUILibrary,
                debugInfo.versions.azureCallingLibrary,
                debugInfo.callHistoryRecords,
                debugInfo.logFiles
            )
        }
    }

    /**
     * Prepares and sends a POST request to a server with the user-reported issue data.
     * Constructs a multipart request body containing the user message, app versions, call history, and log files.
     */
    private fun sendToServer(
        userMessage: String?,
        callingUIVersion: String?,
        callingSDKVersion: String?,
        callHistoryRecords: List<CallCompositeCallHistoryRecord>,
        logFiles: List<File>
    ) {
        if (SERVER_URL.isBlank()) { // Check if the server URL is configured.
            return
        }
        showProgressNotification()
        CoroutineScope(Dispatchers.IO).launch {
            val client = OkHttpClient()
            val requestBody = MultipartBody.Builder().setType(MultipartBody.FORM).apply {
                userMessage?.let { addFormDataPart("user_message", it) }
                callingUIVersion?.let { addFormDataPart("ui_version", it) }
                callingSDKVersion?.let { addFormDataPart("sdk_version", it) }
                addFormDataPart(
                    "call_history",
                    callHistoryRecords.map { "\n\n${it.callStartedOn.format(DateTimeFormatter.BASIC_ISO_DATE)}\n${it.callIds.joinToString("\n")}" }
                        .joinToString("\n"))
                logFiles.filter { it.length() > 0 }.forEach { file ->
                    val mediaType = "application/octet-stream".toMediaTypeOrNull()
                    addFormDataPart("log_files", file.name, file.asRequestBody(mediaType))
                }
            }.build()

            val request = Request.Builder()
                .url("$SERVER_URL/receiveEvent")
                .post(requestBody)
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    CoroutineScope(Dispatchers.Main).launch {
                        onTicketFailed(e.message ?: "Unknown error")
                    }
                }

                override fun onResponse(call: Call, response: Response) {
                    CoroutineScope(Dispatchers.Main).launch {
                        if (response.isSuccessful) {
                            onTicketCreated(response.body?.string() ?: "No URL provided")
                        } else {
                            onTicketFailed("Server error: ${response.message}")
                        }
                    }
                }
            })
        }
    }

    /**
     * Displays a notification indicating that the issue ticket has been created successfully.
     * The notification includes a URL to view the ticket status, provided by the server response.
     */
    private fun onTicketCreated(url: String) {
        showCompletionNotification(url)
    }

    /**
     * Displays a notification indicating that the submission of the issue ticket failed.
     * The notification includes the error reason.
     */
    private fun onTicketFailed(error: String) {
        showErrorNotification(error)
    }

    companion object {
        // The server URL to which the user-reported issues will be sent. Must be configured.
        private const val SERVER_URL = "${INSERT_YOUR_SERVER_ENDPOINT_HERE}"
    }

    /**
     * Creates a notification channel for Android O and above.
     * This is necessary to display notifications on these versions of Android.
     */
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Report Submission"
            val descriptionText = "Notifications for report submission status"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel("report_submission_channel", name, importance).apply {
                description = descriptionText
            }
            notificationManager.createNotificationChannel(channel)
        }
    }

    /**
     * Shows a notification indicating that the report submission is in progress.
     * This uses an indeterminate progress indicator to signify ongoing activity.
     */
    private fun showProgressNotification() {
        val notification = NotificationCompat.Builder(context, "report_submission_channel")
            .setContentTitle("Submitting Report")
            .setContentText("Your report is being submitted...")
            .setSmallIcon(R.drawable.image_monkey) // Replace with an appropriate icon for your app
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setProgress(0, 0, true) // Indeterminate progress
            .build()

        notificationManager.notify(1, notification)
    }

    /**
     * Shows a notification indicating that the report has been successfully submitted.
     * The notification includes an action to view the report status via a provided URL.
     */
    private fun showCompletionNotification(url: String) {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, "report_submission_channel")
            .setContentTitle("Report Submitted")
            .setContentText("Tap to view")
            .setSmallIcon(R.drawable.image_monkey) // Replace with an appropriate icon for your app
            .setContentIntent(pendingIntent)
            .setAutoCancel(true) // Removes notification after tap
            .build()

        notificationManager.notify(1, notification)
    }

    /**
     * Shows a notification indicating an error in submitting the report.
     * The notification includes the reason for the submission failure.
     */
    private fun showErrorNotification(error: String) {
        val notification = NotificationCompat.Builder(context, "report_submission_channel")
            .setContentTitle("Submission Error")
            .setContentText("Error submitting report\nReason: $error")
            .setSmallIcon(R.drawable.image_monkey) // Replace with an appropriate icon for your app
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .build()

        notificationManager.notify(1, notification)
    }
}

```

Once you have a Handler for your event, you can register it when creating your call composite.

```
            callComposite.addOnUserReportedEventHandler(userReportedIssueEventHandler)
```
