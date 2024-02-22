---
title: Collecting User Feedback in the ACS UI Library
description: Enabling the Support Form and tooling, and handling support requests
author:      ahammer # GitHub alias
ms.author:   adamhammer # Microsoft alias
ms.service: azure-communication-services
ms.topic: conceptual
ms.date:     01/08/2024
ms.subservice: calling
zone_pivot_groups: acs-programming-languages-support-kotlin-swift
---

# Collecting User Feedback

## Introduction

This comprehensive guide is designed to assist developers in integrating enhanced support into the ACS UI Library, leveraging Azure services for backend processing. The guide is divided into client-side and server-side steps for clarity and ease of implementation.

## Prerequisites

Before diving into the integration of user feedback mechanisms within the Azure Communication Services (ACS) UI Library, it's crucial to ensure the following prerequisites are met:

- **Azure Subscription:** You need an active Azure subscription. If you don't have one, you can create a free account at [Azure Free Account](https://azure.microsoft.com/en-us/free/).
- **Azure Communication Services Resource:** An ACS resource is required to leverage calling and chat functionalities. You can create one in the Azure portal.
- **Development Environment Setup:** Ensure that your development environment is set up for the target platform(s) – Android, iOS, or web. This includes having the necessary SDKs and tools for Android Studio, Xcode, or your preferred web development IDE.
- **Azure Storage Account:** For storing user feedback and related data securely, an Azure Storage account is necessary. This will be used for blob storage in the server-side implementation.
- **Node.js and Express.js:** Basic knowledge of Node.js and Express.js is helpful for setting up the server-side application to receive and process support requests.
- **Knowledge of RESTful APIs:** Understanding how to create and consume RESTful APIs is essential, as you will need to implement API endpoints for submitting feedback and retrieving ticket details.
- **Client Development Skills:** Proficiency in the development of Android or iOS applications

Having these prerequisites in place ensures a smooth start to integrating a comprehensive user feedback system using Azure Communication Services and other Azure resources.

## What You'll Learn

In this guide, you'll gain comprehensive insights into integrating user feedback mechanisms within your Azure Communication Services (ACS) applications. The focus is on enhancing customer support through the ACS UI Library, leveraging Azure backend services for efficient processing. By following this guide, developers will learn to:

- **Implement Client-Side Feedback Capture:** Learn how to capture user feedback, error logs, and support requests directly from Android and iOS applications using the ACS UI Library.
- **Set Up a Server-Side Application:** Step-by-step instructions on setting up a Node.js application using Express.js to receive, process, and store support requests in Azure Blob Storage. This includes handling multipart/form-data for file uploads and securely managing user data.
- **Handle Support Tickets:** Understand how to generate unique support ticket numbers, store user feedback alongside relevant application data, and provide endpoints for accessing detailed support ticket information and downloading log files.
- **Utilize Azure Blob Storage:** Dive into how to use Azure Blob Storage for storing feedback and support request data, ensuring secure and structured data management that supports efficient retrieval and analysis.
- **Enhance Application Reliability and User Satisfaction:** By implementing the strategies outlined in this guide, developers will be able to quickly address and resolve user issues, leading to improved application reliability and user satisfaction.
    

## Server-Side Setup

### Setting Up a Node.js Application to Handle Support Requests

**Section Objective:** The goal is to create a Node.js application using Express.js that serves as a backend to receive support requests from users. These requests may include textual feedback, error logs, screenshots, and other relevant information that can help in diagnosing and resolving user issues. The application will store this data in Azure Blob Storage for organized and secure access.

#### Framework & Tools 

- **Express.js:** A Node.js framework for building web applications and APIs. It serves as the foundation for our server setup and request handling.
- **Formidable:** A library for parsing form data, especially designed for handling multipart/form-data which is often used for file uploads.
- **Azure Blob Storage:** A Microsoft Azure service for the storage of large amounts of unstructured data. It's utilized here for securely storing support request data and associated files.

#### Step 1: Environment Setup

Before you begin, ensure your development environment is ready with Node.js installed. You'll also need access to an Azure Storage account to store the submitted data.

1. **Install Node.js:** Make sure Node.js is installed on your system. You can download it from [Node.js](https://nodejs.org/).

2. **Create an Azure Blob Storage Account:** If you haven't already, create an Azure Storage account through the Azure Portal. This account will be used to store the support request data.

3. **Gather Necessary Credentials:** Ensure you have the connection string for your Azure Blob Storage account. It is required for the application to authenticate and store data in the cloud.

#### Step 2: Application Setup

1. **Initialize a New Node.js Project:**
   - Create a new directory for your project and initialize it with `npm init` to create a `package.json` file.
   - Install Express.js, Formidable, the Azure Storage Blob SDK, and other necessary libraries using npm. For example:
     ```bash
     npm install express formidable @azure/storage-blob uuid
     ```

2. **Server Implementation:**
   - Use Express.js to set up a basic web server that listens for POST requests on a specific endpoint (e.g., `/receiveEvent`).
   - Use Formidable for parsing incoming form data, handling multipart/form-data content types which may include files.
   - Generate a unique ticket number for each support request, which can be used to organize data in Azure Blob Storage and provide a reference for users.
   - Store structured data, such as user messages and log file metadata, in a JSON file within the Blob Storage. Store actual log files and any screenshots or attachments in separate blobs within the same ticket's directory.
   - Provide an endpoint to retrieve support ticket details, which involves fetching and displaying data from Azure Blob Storage.

3. **Security Considerations:**
   - Ensure that your application validates the incoming data to protect against malicious payloads.
   - Use environment variables to securely store sensitive information such as your Azure Storage connection string.

#### Step 3: Running and Testing the Application

1. **Environment Variables:**
   - Set up environment variables for your Azure Blob Storage connection string and any other sensitive information. For example, you can use a `.env` file (and the `dotenv` npm package for loading these variables).

2. **Running the Server:**
   - Start your Node.js application by running `node <filename>.js`, where `<filename>` is the name of your main server file.
   - Use tools like Postman or write client-side code (as provided in the Android and iOS samples) to test the server's functionality. Ensure that the server correctly receives data, stores it in Azure Blob Storage, and can retrieve and display support ticket details.

#### Server Code:
Below is a working implementation to start with. This is a basic implementation tailored to demonstrate ticket creation from the ACS UI Sample applications. 

```javascript
const express = require('express');
const formidable = require('formidable');
const fs = require('fs').promises
const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');
const app = express();
const connectionString = process.env.SupportTicketStorageConnectionString
const port = process.env.PORT || 3000;
const portPostfix = (!process.env.PORT || port === 3000 || port === 80 || port === 443) ? '' : `:${port}`;

app.use(express.json());

app.all('/receiveEvent', async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).send("Error processing request: " + err.message);
            }
            // Generate a unique ticket number
            const ticketNumber = uuidv4();
            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient('supporttickets');
            await containerClient.createIfNotExists();

            // Prepare and upload support data
            const supportData = {
                userMessage: fields.user_message,
                uiVersion: fields.ui_version,
                sdkVersion: fields.sdk_version,
                callHistory: fields.call_history
            };
            const supportDataBlobClient = containerClient.getBlockBlobClient(`${ticketNumber}/supportdata.json`);
            await supportDataBlobClient.upload(JSON.stringify(supportData), Buffer.byteLength(JSON.stringify(supportData)));

            // Upload log files
            Object.values(files).forEach(async (fileOrFiles) => {
                // Check if the fileOrFiles is an array (multiple files) or a single file object
                const fileList = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
            
                for (let file of fileList) {
                    const blobClient = containerClient.getBlockBlobClient(`${ticketNumber}/logs/${file.originalFilename}`);
                    
                    // Read the file content into a buffer
                    const fileContent = await fs.readFile(file.filepath);
                    
                    // Now upload the buffer
                    await blobClient.uploadData(fileContent); // Upload the buffer instead of the file path
                }
            });
            // Return the ticket URL
            const endpointUrl = `${req.protocol}://${req.headers.host}${portPostfix}/ticketDetails?id=${ticketNumber}`;
            res.send(endpointUrl);
        });
    } catch (err) {
        res.status(500).send("Error processing request: " + err.message);
    }
});

// ticketDetails endpoint to serve details page
app.get('/ticketDetails', async (req, res) => {
    const ticketNumber = req.query.id;
    if (!ticketNumber) {
        return res.status(400).send("Ticket number is required");
    }

    // Fetch the support data JSON blob to display its contents
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient('supporttickets');
        const blobClient = containerClient.getBlobClient(`${ticketNumber}/supportdata.json`);
        const downloadBlockBlobResponse = await blobClient.download(0);
        const downloadedContent = (await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)).toString();
        const supportData = JSON.parse(downloadedContent);

        // Generate links for log files
        let logFileLinks = `<h3>Log Files:</h3>`;
        const listBlobs = containerClient.listBlobsFlat({ prefix: `${ticketNumber}/logs/` });
        for await (const blob of listBlobs) {
            logFileLinks += `<a href="/getLogFile?id=${ticketNumber}&file=${encodeURIComponent(blob.name.split('/')[2])}">${blob.name.split('/')[2]}</a><br>`;
        }

        // Send a simple HTML page with support data and links to log files
        res.send(`
            <h1>Ticket Details</h1>
            <p><strong>User Message:</strong> ${supportData.userMessage}</p>
            <p><strong>UI Version:</strong> ${supportData.uiVersion}</p>
            <p><strong>SDK Version:</strong> ${supportData.sdkVersion}</p>
            <p><strong>Call History:</strong> </p> <pre>${supportData.callHistory}</pre>
            ${logFileLinks}
        `);
    } catch (err) {
        res.status(500).send("Error fetching ticket details: " + err.message);
    }
});

// getLogFile endpoint to allow downloading of log files
app.get('/getLogFile', async (req, res) => {
    const { id: ticketNumber, file } = req.query;
    if (!ticketNumber || !file) {
        return res.status(400).send("Ticket number and file name are required");
    }

    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient('supporttickets');
        const blobClient = containerClient.getBlobClient(`${ticketNumber}/logs/${file}`);

        // Stream the blob to the response
        const downloadBlockBlobResponse = await blobClient.download(0);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename=${file}`);
        downloadBlockBlobResponse.readableStreamBody.pipe(res);
    } catch (err) {
        res.status(500).send("Error downloading file: " + err.message);
    }
});

// Helper function to stream blob content to a buffer
async function streamToBuffer(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

::: zone pivot="programming-language-kotlin"
## Client-Side Steps - Android

Integrating user feedback within an Android application, particularly through the Azure Communication Services (ACS) UI Library, involves specific steps to ensure a seamless experience for both developers and users. By incorporating an `onUserReportedIssueEventHandler`, developers can enable a support form within their application, allowing users to report issues directly. This section will guide you through setting up the client-side feedback capture mechanism, maintaining consistency with the document's structure and focus.

### Implementing Client-Side Feedback Capture in Android

#### Enabling the Support Form

1. **Event Handler Registration:**
   - To activate the support form within your Android application, register the `onUserReportedIssueEventHandler` at an appropriate point in your application's lifecycle. This registration not only enables the form but also ensures that it becomes visible and accessible to the users.

2. **Form Visibility and Accessibility:**
   - The presence of the registered `onUserReportedIssueEventHandler` directly affects the support form's visibility. Without this handler, the form remains hidden from the user interface, rendering it inaccessible for issue reporting.

#### Capturing and Handling Support Events

1. **Event Emission Upon Issue Reporting:**
   - When users report issues through the enabled support form, the `onUserReportedIssueEventHandler` captures emitted events. These events encapsulate all necessary details related to the user-reported issue, such as descriptions, error logs, and potentially screenshots.

2. **Data Preparation for Submission:**
   - After capturing an event, the next step involves preparing the reported issue data for server submission. This preparation includes structuring the captured information into a format suitable for HTTP transmission, adhering to server expectations.

#### Submitting Issue Data to the Server

1. **Asynchronous Data Transmission:**
   - Utilize asynchronous mechanisms to transmit the prepared data to the designated server endpoint. This approach ensures that the application remains responsive, providing a smooth user experience while the data is being sent in the background.

2. **Server Response Handling:**
   - Upon data submission, it is crucial to handle server responses adeptly. This handling might involve parsing server feedback to confirm successful data transmission and possibly extracting a reference to the submitted issue (like a ticket number or URL) that can be communicated back to the user.

#### Providing User Feedback and Notifications

1. **Immediate User Feedback:**
   - Notify users immediately about the status of their issue report submission through the application's user interface. For successful submissions, consider providing a reference to the submitted issue that allows users to track the progress of their report.

2. **Notification Strategy for Android O and Above:**
   - For devices running Android O (API level 26) and above, ensure the implementation of a notification channel specific to report submissions. This setup is essential for delivering notifications effectively and is a requirement on these Android versions.

By adhering to these steps, developers can integrate a robust user feedback mechanism into their Android applications, leveraging the `onUserReportedIssueEventHandler` for efficient issue reporting and tracking. This process not only facilitates the timely resolution of user issues but also significantly contributes to enhancing the overall user experience and satisfaction with the application.

### Android Code Sample

The Kotlin code snippet below demonstrates the process of integrating a system for handling user-reported issues within an Android application using Azure Communication Services. This integration aims to streamline the support process by enabling direct communication between users and support teams. Here's an overview of the steps involved:

1. **Event Capture**: The system listens for user-reported issues through the ACS UI Library. It utilizes the `onUserReportedIssueEventHandler` to capture feedback from the application's UI, including errors and user concerns.

2. **Data Transmission to Server**: After an issue is reported, the system packages the captured data, including user messages, error logs, application versions, and any additional diagnostic information, into a structured format. This data is then sent to a server endpoint using an asynchronous POST request, ensuring the process does not hinder the app's performance.

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

Once you have a Handler for your event, you can register it when creating your call composite

```
            callComposite.addOnUserReportedEventHandler(userReportedIssueEventHandler)
```
::: zone-end

::: zone pivot="programming-language-swift"
## Client-Side Steps - iOS

To integrate user feedback collection within iOS applications using the Azure Communication Services (ACS) UI Library, developers need to follow a structured approach. This process involves capturing user feedback, including error logs and support requests, directly within iOS applications and submitting this data to a server for processing. Below, we detail the steps necessary to accomplish this, maintaining consistency in format and tone with the Android section.

### Enabling Support Form Submission in iOS

#### Implementing the Support Form

1. **Event Handler Registration**: Begin by registering an event handler that listens for user-reported issues. This handler is crucial for capturing feedback directly from your iOS application's interface, leveraging the ACS UI Library's capabilities.

2. **Visibility and Accessibility of the Form**: Ensure that the support form is readily accessible and visible to users within the application. The activation of the form is directly linked to the implementation of the event handler, which triggers its appearance within the UI, allowing users to report issues.

#### Capturing and Processing Support Requests

1. **Event Emission on User Action**: When a user reports an issue through the support form, the event handler captures this action, including all relevant information such as the user's description of the problem, error logs, and any screenshots or additional inputs provided.

2. **Data Structuring for Submission**: Organize the captured information into a structured format suitable for transmission. This involves preparing the data in a way that aligns with the expected format of the server endpoint that will receive and process the support request.

#### Submitting Data to the Server

1. **Asynchronous Submission**: Utilize asynchronous network calls to send the structured data to the server. This approach ensures that the application remains responsive, providing a seamless experience for the user while the data is transmitted in the background.

2. **Handling Server Responses**: Upon submission, efficiently process server responses. This includes parsing the response to confirm successful receipt of the data and extracting any references or ticket numbers provided by the server, which can be communicated back to the user for follow-up.

#### Feedback and Notifications to Users

1. **Immediate Acknowledgment**: Immediately acknowledge the submission of a support request within the application, providing users with confirmation that their report has been received.

2. **Notification Strategy**: Implement a strategy for delivering notifications to users, especially on devices running iOS versions that support specific notification frameworks. This could involve the use of local notifications to inform users about the status of their report or providing updates as their issue is addressed.

### iOS Code Sample

The Swift code sample below outlines a basic implementation for capturing user-reported issues and submitting them to a server for processing. This example demonstrates how to construct a support event, including user feedback and application diagnostic information, and send it asynchronously to a predefined server endpoint. The code also includes error handling and user notification strategies to ensure a smooth user experience.


```swift
import Foundation
import UIKit
import Combine
import AzureCommunicationUICalling
import Alamofire

/// Sends a support event to a server with details from a `CallCompositeUserReportedIssue`.
/// - Parameters:
///   - server: The URL of the server where the event will be sent.
///   - event: The `CallCompositeUserReportedIssue` containing details about the issue reported by the user.
///   - callback: A closure that is called when the operation is complete.
///               It provides a `Bool` indicating success or failure, and a `String`
///               containing the server's response or an error message.
func sendSupportEventToServer(server: String,
                              event: CallCompositeUserReportedIssue,
                              callback: @escaping (Bool, String) -> Void) {
    // Construct the URL for the endpoint.
    let url = "\(server)/receiveEvent" // Ensure this is replaced with the actual server URL.

    // Extract debugging information from the event.
    let debugInfo = event.debugInfo

    // Prepare the data to be sent as key-value pairs.
    let parameters: [String: String] = [
        "user_message": event.userMessage, // User's message about the issue.
        "ui_version": debugInfo.versions.callingUIVersion, // Version of the calling UI.
        "call_history": debugInfo.callHistoryRecords
            .map { $0.callIds.joined(separator: ",") }
            .joined(separator: "\n") // Call history, formatted.
    ]

    // Define the headers for the HTTP request.
    let headers: HTTPHeaders = [
        .contentType("multipart/form-data")
    ]

    // Perform the multipart/form-data upload.
    AF.upload(multipartFormData: { multipartFormData in
        // Append each parameter as a part of the form data.
        for (key, value) in parameters {
            if let data = value.data(using: .utf8) {
                multipartFormData.append(data, withName: key)
            }
        }

        // Append log files.
        debugInfo.logFiles.forEach { fileURL in
            do {
                let fileData = try Data(contentsOf: fileURL)
                multipartFormData.append(fileData,
                                         withName: "log_files",
                                         fileName: fileURL.lastPathComponent,
                                         mimeType: "application/octet-stream")
            } catch {
                print("Error reading file data: \(error)")
            }
        }
    }, to: url, method: .post, headers: headers).response { response in
        // Handle the response from the server.
        switch response.result {
        case .success(let responseData):
            // Attempt to decode the response.
            if let data = responseData, let responseString = String(data: data, encoding: .utf8) {
                callback(true, responseString) // Success case.
            } else {
                callback(false, "Failed to decode response.") // Failed to decode.
            }
        case .failure(let error):
            // Handle any errors that occurred during the request.
            print("Error sending support event: \(error)")
            callback(false, "Error sending support event: \(error.localizedDescription)")
        }
    }
}
```

This Swift code demonstrates the process of submitting user-reported issues from an iOS application using Azure Communication Services. It handles the collection of user feedback, packaging of diagnostic information, and asynchronous submission to a server endpoint. Additionally, it provides the foundation for implementing feedback mechanisms, ensuring users are informed about the status of their reports and enhancing overall application reliability and user satisfaction.
::: zone-end


## Conclusion


Integrating user feedback mechanisms into applications using Azure Communication Services (ACS) is crucial for developing responsive and user-focused apps. This guide has provided a clear pathway for setting up both server-side processing with Node.js and client-side feedback capture for Android and iOS applications. Through such integration, developers can enhance application reliability and user satisfaction while leveraging Azure's cloud services for efficient data management.

The guide outlines practical steps for capturing user feedback, error logs, and support requests directly from applications and processing this data with Azure backend services. This approach ensures a secure and organized way to handle feedback, allowing developers to quickly address and resolve user issues, leading to an improved overall user experience.

By following the instructions detailed in this guide, developers can improve the responsiveness of their applications and better meet user needs. This not only helps in understanding user feedback more effectively but also utilizes cloud services to ensure a smooth and effective feedback collection and processing mechanism. Ultimately, integrating user feedback mechanisms is essential for creating engaging and reliable applications that prioritize user satisfaction.