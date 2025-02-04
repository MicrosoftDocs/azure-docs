---
title: Azure Communication Services Call Summary Log Schema
titleSuffix: An Azure Communication Services concept article
description: Learn about the Voice and Video Call Summary Logs.
author:  amagginetti
services: azure-communication-services

ms.author: amagginetti
ms.date: 02/04/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Call Summary Log Schema

The call summary log contains data to help you identify key properties of all calls. A different call summary log is created for each `participantId` (or `endpointId` for peer-to-peer [P2P] calls) value in the call.

> [!IMPORTANT]
> Participant information in the call summary log varies based on the participant tenant. The SDK version and OS version are redacted if the participant is not within the same tenant (also called *cross-tenant*) as the Communication Services resource. Cross-tenant participants are classified as external users invited by a resource tenant to join and collaborate during a call.

| Property | Description |
|--- |--- |
| `time` | The time stamp (UTC) when the log was generated. |
| `operationName` | The operation associated with the log record. |
| `operationVersion` | The `api-version` value associated with the operation, if the `operationName` operation was performed through an API. If no API corresponds to this operation, the version represents the version of the operation, in case the properties associated with the operation change in the future. |
| `category` | The log category of the event. This property is the granularity at which you can enable or disable logs on a resource. The properties that appear within the `properties` blob of an event are the same within a log category and resource type. |
| `correlationId` | The unique ID for a call. It identifies correlated events from all of the participants and endpoints that connect during a single call, and you can use it to join data from different logs. If you ever need to open a support case with Microsoft, you can use the `correlationId` value to easily identify the call that you're troubleshooting. |
| `identifier` | The unique ID for the user. The identity can be an Azure Communication Services user, a Microsoft Entra user ID, a Teams anonymous user ID, or a Teams bot ID. You can use this ID to correlate user events across logs. |
| `callStartTime` | A time stamp for the start of the call, based on the first attempted connection from any endpoint. |
| `callDuration` | The duration of the call, expressed in seconds, based on the first attempted connection and the end of the last connection between two endpoints. |
| `callType` | The type of the call. It contains either `"P2P"` or `"Group"`. A `"P2P"` call is a direct 1:1 connection between only two, nonserver endpoints. A `"Group"` call is a call that has more than two endpoints or is created as `"Group"` call before the connection. |
| `teamsThreadId` | The Teams thread ID. This ID is relevant only when the call is organized as a Teams meeting. It then represents the use case of interoperability between Microsoft Teams and Azure Communication Services. <br><br>This ID is exposed in operational logs. You can also get this ID through the Chat APIs. |
| `participantId` | The ID generated to represent the two-way connection between a `"Participant"` endpoint (`endpointType` = `"Server"`) and the server. When `callType` = `"P2P"`, there's a direct connection between two endpoints, and no `participantId` value is generated. |
| `participantStartTime` | The time stamp for the beginning of the participant's first connection attempt. |
| `participantDuration` | The duration of each participant connection in seconds, from `participantStartTime` to the time stamp when the connection ended. |
| `participantEndReason` | The reason for the end of a participant connection. It contains Calling SDK error codes that the SDK emits (when relevant) for each `participantId` value. |
| `endpointId` | The unique ID that represents each endpoint connected to the call, where `endpointType` defines the endpoint type. When the value is `null`, the connected entity is the Communication Services server (`endpointType` = `"Server"`). <br><br>The `endpointId` value can sometimes persist for the same user across multiple calls (`correlationId`) for native clients. The number of `endpointId` values determines the number of call summary logs. A distinct summary log is created for each `endpointId` value. |
| `endpointType` | This value describes the properties of each endpoint connected to the call. It can contain `"Server"`, `"VOIP"`, `"PSTN"`, `"BOT"`, or `"Unknown"`. |
| `sdkVersion` | The version string for the Communication Services Calling SDK version that each relevant endpoint uses (for example, `"1.1.00.20212500"`). |
| `osVersion` | A string representing the operating system and version of each endpoint device. |
| `participantTenantId` | The ID of the Microsoft tenant associated with the identity of the participant. The tenant can either be the Azure tenant that owns the Azure Communication Services resource or the Microsoft tenant of a Microsoft 365 identity. This field is used to guide cross-tenant redaction. |
| `participantType` | Description of the participant as a combination of its client (Azure Communication Services or Teams), and its identity (Azure Communication Services or Microsoft 365). Possible values include: Azure Communication Services (Azure Communication Services identity and Azure Communication Services SDK), Teams (Teams identity and Teams client), Azure Communication Services as Teams external user (Azure Communication Services identity and Azure Communication Services SDK in Teams call or meeting), Azure Communication Services as Microsoft 365 user (Microsoft 365 identity and Azure Communication Services client), and Teams Voice Apps. |
| `pstnParticipantCallType` | Represents the type and direction of PSTN participants including Emergency calling, direct routing, transfer, forwarding, and so on. | 
| `ParticipantEndSubCode `| Represents the Calling SDK error subcode that the SDK emits (when relevant) for each `participantId` value. | 
| `ResultCategory `| Represents the category of the participant ending the call. It can be one of these 4 values: Success, ExpectedError, UnexpectedClientError, UnexpectedServerError. |
| `DiagnosticOptions `| This value allows developers to attach custom tags to their client telemetry, which can then be viewed in the Call Diagnostics section. This helps in identifying and troubleshooting issues more effectively. To learn how to add custom tags to this value, refer to [Tutorial on adding custom tags to your client telemetry](../../../tutorials/voice-video-calling/diagnostic-options-tag.md) |