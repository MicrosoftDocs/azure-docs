---
title: Azure Communication Services Call Client Operations Log Schema
titleSuffix: An Azure Communication Services concept article
description: Learn about the Voice and Video Call Client Operations Logs.
author:  amagginetti
services: azure-communication-services

ms.author: amagginetti
ms.date: 02/04/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Call Client Operations Log Schema

The **call client operations** log provides client-side information about the calling endpoints and participants involved in a call. These logs are currently in preview and show client events that occurred in a call and which actions a customer takes during a call.  

This log provides detailed information on actions taken during a call and can be used to visualize and investigate call issues by using Call Diagnostics for your Azure Communication Services Resource. [Learn more about Call Diagnostics](../../voice-video-calling/call-diagnostics.md)

| Property | Description |
|--- |--- |
|     `CallClientTimeStamp`         |     The timestamp for when on operation occurred on the SDK in UTC.   |
|     `OperationName`         |    The name of the operation triggered on the calling SDK.   |
|     `CallId`    |              The unique ID for a call. It identifies correlated events from all of the participants and endpoints that connect during a single call, and you can use it to join data from different logs. It's similar to the correlationId in call summary log and call diagnostic log.               |
|     `ParticipantId`    |            The unique identifier for each call leg (in Group calls) or call participant (in Peer to Peer calls). This ID is the main correlation point between CallSummary, CallDiagnostic, CallClientOperations, and CallClientMediaStats logs.             |
|     `OperationType`    |              Call Client Operation.               |
|     `OperationId`    |             A unique GGUID identifying an SDK operation.                 |
|     `DurationMs`    |              The time took by a Calling SDK operation to fail or succeed.                |
|     `ResultType`    |               Field describing success or failure of an operation.               |
|     `ResultSignature`    |         HTTP-like failure or success code (200, 500).                    |
|     `SdkVersion`    |                   The version of Calling SDK being used.           |
|     `UserAgent`    |          The standard user agent string based on the browser or the platform Calling SDK is used.        |
|     `ClientInstanceId`    |            A unique GGUID identifying the CallClient object.                  |
|     `EndpointId`    |             The unique ID that represents each endpoint connected to the call, where endpointType defines the endpoint type. When the value is null, the connected entity is the Communication Services server (endpointType = "Server").  <BR><BR> The endpointId value can sometimes persist for the same user across multiple calls (correlationId) for native clients. The number of endpointId values determines the number of call summary logs. A distinct summary log is created for each endpointId value.                |
|     `OperationPayload`    |     A dynamic payload that varies based on the operation providing more operation specific details.       |
