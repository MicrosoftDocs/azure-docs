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

### Step 1: Capturing Support Events
Implement functionality in your Android and iOS apps to capture and handle user-reported issues.

#### Android Code Sample
```kotlin
// Kotlin example for Android
yourCallingInstance.onUserReportedIssueEvent = { event ->
    val serializedEvent = serializeEvent(event)
    sendEventToServer(serializedEvent)
}
```

#### iOS Code Sample
```swift
// Swift example for iOS
yourCallingInstance.onUserReportedIssueEvent = { event in
    let serializedEvent = serializeEvent(event)
    sendEventToServer(serializedEvent)
}
```

### Step 2: Communicating with the Server
Send the serialized event data to your server, and handle the response to provide feedback to the user.

#### Example Communication Function
```javascript
// JavaScript example for sending data to the server and handling the response
function sendEventToServer(serializedEvent) {
    // Code to send data to the server
    // On response, call notifyUser with the response data
    notifyUser(responseData);
}
```

### Step 3: User Feedback
Inform the user about the status of their support request, enhancing communication and trust.

#### Example User Feedback
```javascript
// Example code for notifying the user
function notifyUser(responseData) {
    if (responseData.success) {
        displayMessage(`Ticket created: ${responseData.ticketId}`);
    } else {
        displayMessage("Unable to submit your request. Please try again.");
    }
}
```

---

## Server-Side Steps

### Step 1: Setting Up Azure Cloud Functions
Develop a function to receive and process the event data sent from the client application.

#### Azure Function Pseudocode
```pseudocode
function processSupportEvent(request):
    eventData = deserializeRequest(request)
    attachmentUrls = storeAttachmentsInAzureStorage(eventData.attachments)
    ticketId = createTicketInAzureDevOps(eventData, attachmentUrls)
    return { success: true, ticketId: ticketId }
```

### Step 2: Storing Attachments in Azure Storage
Securely store any attachments or logs received with the support event.

### Step 3: Creating Tickets in Azure DevOps
Use the processed data to create a ticket in Azure DevOps for tracking and resolution.

---

## Conclusion

By following these client-side and server-side steps, you will integrate a comprehensive and efficient support system into your ACS UI Library application. This system not only enhances user experience through effective communication but also leverages the power of Azure services for seamless back-end processing and issue resolution.