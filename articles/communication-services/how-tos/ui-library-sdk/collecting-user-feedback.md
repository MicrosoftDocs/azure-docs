---
# Required metadata
# For more information, see https://review.learn.microsoft.com/en-us/help/platform/learn-editor-add-metadata?branch=main
# For valid values of ms.service, ms.prod, and ms.topic, see https://review.learn.microsoft.com/en-us/help/platform/metadata-taxonomies?branch=main

title: Collecting User Feedback
description: How to engage with customers in regards to call support
author:      ahammer # GitHub alias
ms.author:   adamhammer # Microsoft alias
ms.service: azure-communication-services
ms.topic: conceptual
ms.date:     01/08/2024
ms.subservice: calling
---

# Collecting User Feedback

## Introduction

This comprehensive guide is designed to assist developers in integrating enhanced support into the ACS UI Library, leveraging Azure services for backend processing. The guide is divided into client-side and server-side steps for clarity and ease of implementation.

## Prerequisites
- Call Composite Integration
- **Android**
  - OkHTTP for Http Requests
- **iOS**

## What You'll Learn
- **Client-Side:**
  - Enabling the UI Library Support Form
  - Capturing user-initiated support events in mobile applications (Android/iOS).
  - Serializing and sending these events to a server.
  - Providing user feedback post ticket creation.
- **Server-Side:**
  - Setting up Azure Cloud Functions for handling support events.
  - Using Azure Storage for secure data management.
  - Integrating Azure DevOps for ticket creation and tracking.
  - Ensuring secure and efficient communication between the server and the client.
    
  ---

## Client-Side Steps

### Step 1: Capturing Support Events and Submitting to the Server
Implement functionality in your Android and iOS apps to capture and handle user-reported issues.

#### Android Code Sample

```kotlin
// Create a Handler class to handle the event
package com.azure.android.communication.ui.callingcompositedemoapp

import com.azure.android.communication.ui.calling.CallCompositeEventHandler
import com.azure.android.communication.ui.calling.models.CallCompositeCallHistoryRecord
import com.azure.android.communication.ui.calling.models.CallCompositeUserReportedIssueEvent
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.asRequestBody
import java.io.File
import java.io.IOException

/**
 * This class is used to handle user reported issues.
 *
 * It offers a flow that can be used to observe user reported issues.
 */
class UserReportedIssueHandler : CallCompositeEventHandler<CallCompositeUserReportedIssueEvent> {
    val userIssuesFlow = MutableStateFlow<CallCompositeUserReportedIssueEvent?>(null)

    override fun handle(eventData: CallCompositeUserReportedIssueEvent?) {
        userIssuesFlow.value = eventData
        eventData?.apply {
            sendToServer(
                userMessage,
                screenshot,
                debugInfo.callingUIVersion,
                debugInfo.callingSDKVersion,
                debugInfo.callHistoryRecords,
                debugInfo.logFiles
            )
        }
    }

    private fun sendToServer(
        userMessage: String?,
        screenshot: File?,
        callingUIVersion: String?,
        callingSDKVersion: String?,
        callHistoryRecords: List<CallCompositeCallHistoryRecord>,
        logFiles: List<File>
    ) {
        CoroutineScope(Dispatchers.IO).launch {
            val client = OkHttpClient()
            val requestBody = MultipartBody.Builder().setType(MultipartBody.FORM)

            userMessage?.let {
                requestBody.addFormDataPart("user_message", it)
            }

            screenshot?.let {
                val mediaType = "image/png".toMediaTypeOrNull()
                requestBody.addFormDataPart(
                    "screenshot",
                    it.name,
                    it.asRequestBody(mediaType)
                )
            }

            callingUIVersion?.let {
                requestBody.addFormDataPart("ui_version", it)
            }

            callingSDKVersion?.let {
                requestBody.addFormDataPart("sdk_version", it)
            }

            val callIds = callHistoryRecords.joinToString("\n\n")
            requestBody.addFormDataPart("call_history", callIds)

            logFiles.forEach { file ->
                val mediaType = "text/plain".toMediaTypeOrNull()
                requestBody.addFormDataPart(
                    "log_files",
                    file.name,
                    file.asRequestBody(mediaType)
                )
            }

            val request = Request.Builder()
                .url(SERVER_URL)
                .post(requestBody.build())
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

    private fun onTicketCreated(url: String) {
        // Handle successful ticket creation
    }

    private fun onTicketFailed(error: String) {
        // Handle failed ticket creation
    }

    companion object {
        private const val SERVER_URL = "https://yourwebservice"
    }
}

// ... 
// Closer to your CallComposite, create a field which will be used with the registration
val userReportedIssueEventHandler: UserReportedIssueHandler = UserReportedIssueHandler()

// And when initializing/disposing your callComposite

// Add
callComposite?.addUserReportedIssueEventHandler(userReportedIssueEventHandler);
// Remove
callComposite?.removeUserReportedIssueEventHandler(userReportedIssueEventHandler);


```


#### iOS Code Sample
```swift
let SERVER_URL = "https://yourwebservice"

func onUserReportedIssueHandler(userIssue: CallCompositeUserReportedIssue) {
    guard let screenshotURL = userIssue.screenshot else { return }
    var request = URLRequest(url: URL(string: SERVER_URL)!)
    request.httpMethod = "POST"

    let boundary = "Boundary-\(UUID().uuidString)"
    request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")

    var data = Data()
    
    // User Message
    if let userMessageData = "--\(boundary)\r\nContent-Disposition: form-data; name=\"user_message\"\r\n\r\n\(userIssue.userMessage)\r\n".data(using: .utf8) {
        data.append(userMessageData)
    }

    // Screenshot
    do {
        let screenshotData = try Data(contentsOf: screenshotURL)
        data.append("--\(boundary)\r\nContent-Disposition: form-data; name=\"screenshot\"; filename=\"screenshot.png\"\r\nContent-Type: image/png\r\n\r\n".data(using: .utf8)!)
        data.append(screenshotData)
        data.append("\r\n".data(using: .utf8)!)
    } catch {
        print("Error: Could not load screenshot data")
        return
    }

    // Call History Records and Log Files (you will need to implement the logic to append these based on your app's needs)

    data.append("--\(boundary)--\r\n".data(using: .utf8)!)

    let task = URLSession.shared.uploadTask(with: request, from: data) { data, response, error in
        guard let data = data, error == nil else {
            print("Error: \(error?.localizedDescription ?? "Unknown error")")
            return
        }
        if let responseString = String(data: data, encoding: .utf8) {
            // Handle the response here
            print("Response: \(responseString)")
        }
    }
    task.resume()
}

```

## Server-Side Steps

### Step 1: Setting Up Azure Cloud Functions
Develop a function to receive and process the event data sent from the client application.

#### Azure Function
```javascript
const { BlobServiceClient } = require('@azure/storage-blob');
const busboy = require('busboy');
const fetch = require('node-fetch');

const AZURE_STORAGE_CONNECTION_STRING = process.env["AZURE_STORAGE_CONNECTION_STRING"];
const AZURE_DEVOPS_PAT = process.env["AZURE_DEVOPS_PAT"];
const AZURE_DEVOPS_ORGANIZATION = process.env["AZURE_DEVOPS_ORGANIZATION"];
const AZURE_DEVOPS_PROJECT = process.env["AZURE_DEVOPS_PROJECT"];
const AZURE_DEVOPS_WORKITEM_TYPE = "Task"; // or any other type

module.exports = async function (context, req) {
    try {
        const parsedData = await parseMultipartFormData(req);
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient('user-reports');
        await containerClient.createIfNotExists();

        let blobNames = [];

        for (const file of parsedData.files) {
            const blockBlobClient = containerClient.getBlockBlobClient(file.filename);
            await blockBlobClient.uploadData(file.data);
            blobNames.push(blockBlobClient.url);
        }

        // Create a summary text file
        const summaryText = `User Message: ${parsedData.fields.userMessage}\nFile URLs: ${blobNames.join('\n')}`;
        const summaryBlobClient = containerClient.getBlockBlobClient('summary.txt');
        await summaryBlobClient.uploadData(summaryText);

        // Create ADO Work Item
        await createWorkItem(parsedData.fields.userMessage, blobNames);

        context.res = { body: "Report processed successfully." };
    } catch (error) {
        context.log.error(error);
        context.res = { status: 500, body: "An error occurred processing the report." };
    }
};

async function parseMultipartFormData(req) {
    return new Promise((resolve, reject) => {
        const bb = busboy({ headers: req.headers });
        const fields = {};
        const files = [];

        bb.on('file', (name, file, info) => {
            const { filename, mimeType } = info;
            const chunks = [];
            file.on('data', chunk => chunks.push(chunk));
            file.on('end', () => files.push({ filename, data: Buffer.concat(chunks) }));
        });

        bb.on('field', (name, val) => fields[name] = val);

        bb.on('close', () => resolve({ fields, files }));

        req.pipe(bb);
    });
}

async function createWorkItem(userMessage, blobUrls) {
    const workItemData = {
        op: "add",
        path: "/fields/System.Title",
        value: "User Reported Issue"
    };

    const response = await fetch(`https://dev.azure.com/${AZURE_DEVOPS_ORGANIZATION}/${AZURE_DEVOPS_PROJECT}/_apis/wit/workitems/$${AZURE_DEVOPS_WORKITEM_TYPE}?api-version=6.0`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json-patch+json',
            'Authorization': `Basic ${Buffer.from(':' + AZURE_DEVOPS_PAT).toString('base64')}`
        },
        body: JSON.stringify([workItemData])
    });

    const responseData = await response.json();
    // Handle response, link blob URLs, etc.

```

### Step 2: Storing Attachments in Azure Storage
Securely store any attachments or logs received with the support event.

### Step 3: Creating Tickets in Azure DevOps
Use the processed data to create a ticket in Azure DevOps for tracking and resolution.

---

## Conclusion

By following these client-side and server-side steps, you will integrate a comprehensive and efficient support system into your ACS UI Library application. This system not only enhances user experience through effective communication but also leverages the power of Azure services for seamless back-end processing and issue resolution.