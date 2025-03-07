---
ms.author: rahulva
title: Azure Communication Services Call Recording Bring Your Own Storage
titleSuffix: An Azure Communication Services document
description: Quickstart for Bring your own storage
author: dbasantes
services: azure-communication-services
ms.date: 03/17/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
zone_pivot_groups: acs-csharp-java
ms.custom: mode-api, devx-track-extended-java
---
# Call recording: Bring your own Azure storage quickstart

This quickstart gets you started with Bring your own Azure storage for Call Recording. To start using Bring your own Azure Storage functionality, make sure you're familiar with the [Call Recording APIs](../../voice-video-calling/get-started-call-recording.md).

## Prerequisite: Setting up Managed Identity and Role Based Access Controls(RBAC) role assignments

### 1. Enable system assigned managed identity for Azure Communication Services

![Diagram showing a communication service resource with managed identity disabled](../media/byos-managed-identity-1.png)

1. Open your Azure Communication Services resource. Navigate to *Identity* on the left.
2. Enabled System Assigned Managed Identity and click on *Save*.
3. Once completed, you're able to see the Object principal ID of the newly created identity.

![Diagram showing a communication service resource with managed identity enabled](../media/byos-managed-identity-2.png)

4. Once the identity is successfully created, click on *Azure role assignments* to start adding role assignments.

### 2. Add role assignment

1. Click on *"Add role assignment"*

![Diagram showing a communication service resource managed identity adding role assignment](../media/role-assignment-1.png)

2. On the *"Add role assignment"* panel, select the following values
     1. Scope: **Storage**
     2. Subscription: **Choose your subscription**
     3. Resource: **Choose your storage account**
     4. Role: **Azure Communication Services needs *"Storage Blob Data Contributor"* to be able to write to your storage account.**
    
![Diagram showing a communication service resource managed identity adding role assignment details](../media/role-assignment-2.png)

3. Click on *Save*.
4. Once completed, you see the newly added role assignment in the *"Azure role assignment"* window.

![Diagram showing a communication service resource managed identity role assignment success](../media/role-assignment-3.png)

## Start recording session with external storage specified

Use the server call ID received during initiation of the call.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Test Call Recording BYOS with C#](../includes/recording-byos-private-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Test Call Recording BYOS with Java](../includes/recording-byos-private-java.md)]
::: zone-end

### Notification on successful export

To notify your services when the recorded media is ready and exported to the external storage location, use an [Azure Event Grid](../../../../event-grid/overview.md) web hook, or other triggered action.

Refer to this example of the event schema.

```JSON
{
    "id": "string", // Unique guid for event
    "topic": "string", // /subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}
    "subject": "string", // /recording/call/{call-id}/serverCallId/{serverCallId}
    "data": {
        "storageType": "string", // AzureBlob etc.
        "recordingId": "string", // unique ID for recording
        "recordingStorageInfo": {
            "recordingChunks": [
                {
                    "documentId": "string", // Document ID for the recording chunk
                    "contentLocation": "string", //Azure Communication Services URL where the content is located
                    "metadataLocation": "string", // Azure Communication Services URL where the metadata for this chunk is located
                    "deleteLocation": "string", // Azure Communication Services URL to use to delete all content, including recording and metadata.
                    "index": "int", // Index providing ordering for this chunk in the entire recording
                    "endReason": "string", // Reason for chunk ending: "SessionEnded", "ChunkMaximumSizeExceeded”, etc.
                }
            ]
        },
        "recordingStartTime": "string", // ISO 8601 date time for the start of the recording
        "recordingDurationMs": "int", // Duration of recording in milliseconds
        "sessionEndReason": "string" // Reason for call ending: "CallEnded", "InitiatorLeft”, etc.
    },
    "eventType": "string", // "Microsoft.Communication.RecordingFileStatusUpdated"
    "dataVersion": "string", // "1.0"
    "metadataVersion": "string", // "1"
    "eventTime": "string" // ISO 8601 date time for when the event was created
}
```
### Notification and Action for recording export failure.

Failure to export recording file can occur due to incorrect configuration settings or service outages.
In both cases, the failure notification includes the download url to obtain recordings. 
Download recordings from the location in failure notification within 24 hours.

### Folder Structure for Call Recording

Recordings are stored in the following format as shown in the diagram.
-   /YYYYMMDD/callId/first_8_of_recordingId + '-' + unique guid/[chunk-id]-acsmetadata.documentId.json
-   /YYYYMMDD/callId/first_8_of_recordingId + '-' + unique guid/[chunk-id]-audiomp3.documentId.mp3

![Diagram showing a Call Recording Folder structure](../media/call-recording-folder.png)

## Next steps

For more information, see the following articles:

- Download our [Java](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/ServerRecording) call recording sample app
- Learn more about [Call Recording](../../../concepts/voice-video-calling/call-recording.md)
- Learn more about [Call Automation](../../../concepts/call-automation/call-automation.md)
