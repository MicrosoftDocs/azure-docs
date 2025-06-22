---
title: Azure Communication Services call summary updates log schema
titleSuffix: An Azure Communication Services concept article
description: Learn about the voice and video call summary updates logs.
author:  amagginetti
services: azure-communication-services

ms.author: amagginetti
ms.date: 02/04/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: calling
---

# Call summary updates log schema

The only difference in properties between the call summary updates log schema and the [call summary log schema](call-summary-log-schema.md) is the additional `CallUpdatesVersion` property. The `CallUpdatesVersion` property indicates how recent the log is. The call summary updates log schema has lower latency than the [call summary log schema](call-summary-log-schema.md), it achieves this low latency by sending schema properties as soon as they can be sent. In contrast, the [call summary log schema](call-summary-log-schema.md) does not send you a log schema until the entire log schema has completed internal Microsoft creation. 

The call summary updates log contains data to help you identify key properties of all calls. A different call summary updates log is created for each `participantId` (or `endpointId` for peer-to-peer [P2P] calls) value in the call.

For each participant within a call, Communication Services creates a distinct call summary updates log. If someone rejoins a call, that participant has the same `EndpointId` value but a different `ParticipantId` value. That endpoint can then have two call summary updates logs.

## How to use call logs
We recommend you collect all available call logs in a log analytics resource so you can monitor your call usage and improve your call quality and receive new logs from Azure Communication Services as we release them.  

There are two main tools you can use to monitor your calls and improve call quality. 
- [Voice and video insights dashboard](../insights/voice-and-video-insights.md)
- [Call diagnostics](../../voice-video-calling/call-diagnostics.md)

We recommend using the **[voice and video insights dashboard](../insights/voice-and-video-insights.md)** dashboards to start 
any quality investigations, and using **[call diagnostics](../../voice-video-calling/call-diagnostics.md)** as needed to explore individual calls when you need granular detail.


## Data concepts

> [!IMPORTANT]
>You must collect logs if you want to analyze them. To learn more, see: **[How do I store logs?](#how-do-i-store-logs)**
>
>Azure doesn't store your call log data unless you enable these specific Diagnostic Settings. Your call data isn't retroactively available. You accumulate data once you create the Diagnostic Settings.


When using the call summary updates log schema, always refer to the highest `CallUpdatesVersion` number to ensure you have the most up-to-date information. Whenever call data is updated, a new version of the log is created containing the most up-to-date information. For example, the higher the `CallUpdatesVersion` number, the more recent the update. This means that version 3 is newer and includes more recent changes compared to version 1.

### More about log versions and data latency

The call summary updates log schema may require approximately 60 minutes following the end of a call to propagate data, most logs may be available within 40 minutes. 

After a call ends, an initial version (version 1) of the log is sent to the CallSummaryUpdates and CallDiagnosticUpdates tables. Initial versions may contain `null` values, if more information becomes available updated versions of the logs are created with more complete information. For example, client data can be delayed because of network connectivity issues between the client computer and our servers, or something as simple as a user closing the lid on their laptop post-call before their client data was sent and re-opening it hours (or days) later. 


Because of to such collection variations, you might see incremental versions arrive hours or even days later. You can use versions for a faster understanding of your calling resource than waiting until all calling SDK client data is received. The best case scenario is for all call participants to end their calls and for the calling SDK to be able to send data to the server.

## Data definitions

### Call summary updates log schema

> [!IMPORTANT]
> Participant information in the call summary updates log varies based on the participant tenant. The SDK version and OS version are redacted if the participant is not within the same tenant (also called *cross-tenant*) as the Communication Services resource. Cross-tenant participants are classified as external users invited by a resource tenant to join and collaborate during a call.

This table describes each property.

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
| `ParticipantEndSubCode`| Represents the Calling SDK error subcode that the SDK emits (when relevant) for each `participantId` value. | 
| `ResultCategory`| Represents the category of the participant ending the call. It can be one of these 4 values: Success, ExpectedError, UnexpectedClientError, UnexpectedServerError. |
| `DiagnosticOptions`| This value allows developers to attach custom tags to their client telemetry, which can then be viewed in the Call Diagnostics section. This helps in identifying and troubleshooting issues more effectively. To learn how to add custom tags to this value, refer to [Tutorial on adding custom tags to your client telemetry](../../../tutorials/voice-video-calling/diagnostic-options-tag.md) |
| `CallUpdatesVersion`| Represents the log version, with higher numbers indicating the most recently published version. |
| `callDebuggingInfo`| This value contains json object with key-value pairs that represent internal properties of the call used for Microsoft debugging purposes.|
| `TPE`| This value indicates that the call is associated with a Teams Phone extensibility scenario.|

### Error codes 

The `participantEndReason` property contains a value from the set of Calling SDK error codes. You can refer to these codes to troubleshoot issues that were detected during the call, for each endpoint. See [Troubleshooting call end response codes for Calling SDK, Call Automation SDK, PSTN, Chat SDK, and SMS SDK](../../../resources/troubleshooting/voice-video-calling/troubleshooting-codes.md).

## Sample data for various call types

> [!NOTE]
> In this article, P2P and group calls are within the same tenant by default. All call scenarios that are cross-tenant are specified accordingly throughout the article.

### P2P call 

Here are shared fields for all logs in a P2P call:

```json
"time":                     "2021-07-19T18:46:50.188Z",
"resourceId":               "SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/ACS-TEST-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-PROD-CCTS-TESTS",
"correlationId":            "aaaa0000-bb11-2222-33cc-444444dddddd",
```

#### Call summary updates logs 

Call summary updates logs share operation and category information:

```json
"operationName":            "CallSummary",
"operationVersion":         "1.0",
"category":                 "CallSummary",

```

Here's a call summary for VoIP user 1:

```json
"properties": {
    "identifier":               "acs:61fddbe3-0003-4066-97bc-6aaf143bbb84_0000000b-4fee-66cf-ac00-343a0d003158",
    "callStartTime":            "2021-07-19T17:54:05.113Z",
    "callDuration":             6,
    "callType":                 "P2P",
    "teamsThreadId":            "null",
    "participantId":            "null",    
    "participantStartTime":     "2021-07-19T17:54:06.758Z",
    "participantDuration":      "5",
    "participantEndReason":     "0",
    "endpointId":               "570ea078-74e9-4430-9c67-464ba1fa5859",
    "endpointType":             "VoIP",
    "sdkVersion":               "1.0.1.0",
    "osVersion":                "Windows 10.0.17763 Arch: x64"
    "callupdatesversion":   "2"
}
```

Here's a call summary for VoIP user 2:

```json
"properties": {
    "identifier":               "acs:7af14122-9ac7-4b81-80a8-4bf3582b42d0_06f9276d-8efe-4bdd-8c22-ebc5434903f0",
    "callStartTime":            "2021-07-19T17:54:05.335Z",
    "callDuration":             6,
    "callType":                 "P2P",
    "teamsThreadId":            "null",
    "participantId":            "null",
    "participantStartTime":     "2021-07-19T17:54:06.335Z",
    "participantDuration":      "5",
    "participantEndReason":     "0",
    "endpointId":               "a5bd82f9-ac38-4f4a-a0fa-bb3467cdcc64",
    "endpointType":             "VoIP",
    "sdkVersion":               "1.1.0.0",
    "osVersion":                "null"
    "callupdatesversion":   "2"
}
```

Here's a cross-tenant call summary updates log for VoIP user 1:

```json
"properties": {
    "identifier":               "1e4c59e1-r1rr-49bc-893d-990dsds8f9f5",
    "callStartTime":            "2022-08-14T06:18:27.010Z",
    "callDuration":             520,
    "callType":                 "P2P",
    "teamsThreadId":            "null",
    "participantId":            "null",
    "participantTenantId":      "02cbdb3c-155a-4b95-b829-6d56a45787ca",
    "participantStartTime":     "2022-08-14T06:18:27.010Z",
    "participantDuration":      "520",
    "participantEndReason":     "0",
    "endpointId":               "02cbdb3c-155a-4d98-b829-aaaaa61d44ea",
    "endpointType":             "VoIP",
    "sdkVersion":               "Redacted",
    "osVersion":                "Redacted"
    "callupdatesversion":   "2"
}
```

Here's a call summary for a PSTN call:

> [!NOTE]
> P2P or group call logs have OS and SDK versions redacted regardless of whether it's the participant's tenant or the bot's tenant.

```json
"properties": {
    "identifier": "b1999c3e-bbbb-4650-9b23-9999bdabab47",
    "callStartTime": "2022-08-07T13:53:12Z",
    "callDuration": 1470,
    "callType": "Group",
    "teamsThreadId": "19:36ec5177126fff000aaa521670c804a3@thread.v2",
    "participantId": " b25cf111-73df-4e0a-a888-640000abe34d",
    "participantStartTime": "2022-08-07T13:56:45Z",
    "participantDuration": 960,
    "participantEndReason": "0",
    "endpointId": "8731d003-6c1e-4808-8159-effff000aaa2",
    "endpointType": "PSTN",
    "sdkVersion": "Redacted",
    "osVersion": "Redacted"
    "callupdatesversion":   "2"
}
```
### Group calls 

Data for a group call is generated in three call summary updates logs and six call diagnostics logs. Here are shared fields for all logs in the call:

```json
"time":                     "2021-07-05T06:30:06.402Z",
"resourceId":               "SUBSCRIPTIONS/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/RESOURCEGROUPS/ACS-TEST-RG/PROVIDERS/MICROSOFT.COMMUNICATION/COMMUNICATIONSERVICES/ACS-PROD-CCTS-TESTS",
"correlationId":            "bbbb1111-cc22-3333-44dd-555555eeeeee",
```



#### Call summary updates logs

Call summary updates logs share operation and category information:

```json
"operationName":            "CallSummary",
"operationVersion":         "1.0",
"category":                 "CallSummary",
```

Here's a call summary for VoIP endpoint 1:

```json
"properties": {
    "identifier":               "acs:1797dbb3-f982-47b0-b98e-6a76084454f1_0000000b-1531-729f-ac00-343a0d00d975",
    "callStartTime":            "2021-07-05T06:16:40.240Z",
    "callDuration":             87,
    "callType":                 "Group",
    "teamsThreadId":            "19:meeting_MjZiOTAyN2YtZWU1Yi00ZTZiLT77777OOOOO99999jgxOTkw@thread.v2",
    "participantId":            "04cc26f5-a86d-481c-b9f9-7a40be4d6fba",
    "participantStartTime":     "2021-07-05T06:16:44.235Z",
    "participantDuration":      "82",
    "participantEndReason":     "0",
    "endpointId":               "5ebd55df-ffff-ffff-89e6-4f3f0453b1a6",
    "endpointType":             "VoIP",
    "sdkVersion":               "1.0.0.3",
    "osVersion":                "Darwin Kernel Version 18.7.0: Mon Nov 9 15:07:15 PST 2020; root:xnu-4903.272.3~3/RELEASE_ARM64_S5L8960X"
    "callupdatesversion":   "2"
}
```

Here's a call summary for VoIP endpoint 3:

```json
"properties": {
    "identifier":               "acs:1797dbb3-f982-47b0-b98e-6a76084454f1_0000000b-1531-57c6-ac00-343a0d00d972",
    "callStartTime":            "2021-07-05T06:16:40.240Z",
    "callDuration":             87,
    "callType":                 "Group",
    "teamsThreadId":            "19:meeting_MjZiOTAyN2YtZWU1Yi00ZTZiLTk2ZDUtYTZlM2I2ZjgxOTkw@thread.v2",
    "participantId":            "1a9cb3d1-7898-4063-b3d2-26c1630ecf03",
    "participantStartTime":     "2021-07-05T06:16:40.240Z",
    "participantDuration":      "87",
    "participantEndReason":     "0",
    "endpointId":               "5ebd55df-ffff-ffff-ab89-19ff584890b7",
    "endpointType":             "VoIP",
    "sdkVersion":               "1.0.0.3",
    "osVersion":                "Android 11.0; Manufacturer: Google; Product: redfin; Model: Pixel 5; Hardware: redfin"
    "callupdatesversion":   "2"
}
```

Here's a call summary for PSTN endpoint 2:

```json
"properties": {
    "identifier":               "null",
    "callStartTime":            "2021-07-05T06:16:40.240Z",
    "callDuration":             87,
    "callType":                 "Group",
    "teamsThreadId":            "19:meeting_MjZiOTAyN2YtZWU1Yi00ZTZiLT77777OOOOO99999jgxOTkw@thread.v2",
    "participantId":            "515650f7-8204-4079-ac9d-d8f4bf07b04c",
    "participantStartTime":     "2021-07-05T06:17:10.447Z",
    "participantDuration":      "52",
    "participantEndReason":     "0",
    "endpointId":               "46387150-692a-47be-8c9d-1237efe6c48b",
    "endpointType":             "PSTN",
    "sdkVersion":               "null",
    "osVersion":                "null"
    "callupdatesversion":   "2"
}
```

Here's a cross-tenant call summary updates log:

```json
"properties": {
    "identifier":               "1e4c59e1-r1rr-49bc-893d-990dsds8f9f5",
    "callStartTime":            "2022-08-14T06:18:27.010Z",
    "callDuration":             912,
    "callType":                 "Group",
    "teamsThreadId":            "19:meeting_MjZiOTAyN2YtZWU1Yi00ZTZiLT77777OOOOO99999jgxOTkw@thread.v2",
    "participantId":            "aa1dd7da-5922-4bb1-a4fa-e350a111fd9c",
    "participantTenantId":      "02cbdb3c-155a-4b95-b829-6d56a45787ca",
    "participantStartTime":     "2022-08-14T06:18:27.010Z",
    "participantDuration":      "902",
    "participantEndReason":     "0",
    "endpointId":               "02cbdb3c-155a-4d98-b829-aaaaa61d44ea",
    "endpointType":             "VoIP",
    "sdkVersion":               "Redacted",
    "osVersion":                "Redacted"
    "callupdatesversion":   "2"
}
```

Here's a cross-tenant call summary updates log with a bot as a participant:

```json

"properties": {
    "identifier":             "b1902c3e-b9f7-4650-9b23-9999bdabab47",
    "callStartTime":          "2022-08-09T16:00:32Z",
    "callDuration":            1470,
    "callType":               "Group",
    "teamsThreadId":         "19:meeting_MmQwZDcwYTQtZ000HWE6NzI4LTg1YTAtNXXXXX99999ZZZZZ@thread.v2",
    "participantId":           "66e9d9a7-a434-4663-d91d-fb1ea73ff31e",
    "participantStartTime":    "2022-08-09T16:14:18Z",
    "participantDuration":      644,
    "participantEndReason":    "0",
    "endpointId":             "69680ec2-5ac0-4a3c-9574-eaaa77720b82",
    "endpointType":           "Bot",
    "sdkVersion":             "Redacted",
    "osVersion":              "Redacted"
    "callupdatesversion":   "2"
}
```

## Frequently asked questions

### How do I store logs?
The following section explains this requirement.

Azure Communication Services logs aren't stored in your Azure account by default so you need to begin storing them in order for tools like [voice and video insights dashboard](../insights/voice-and-video-insights.md) and [call diagnostics](../../voice-video-calling/call-diagnostics.md) to work. To collect these call logs, you need to enable a diagnostic setting that directs the call data to a Log Analytics workspace. 

**Data isn’t stored retroactively, so you begin capturing call logs only after configuring the diagnostic setting.**

Follow instructions to add diagnostic settings for your resource in [Enable logs via Diagnostic Settings in Azure Monitor](../enable-logging.md). We recommend that you initially **collect all logs**. After you understand the capabilities in Azure Monitor, determine which logs you want to retain and for how long. When you add your diagnostic setting, you're prompted to [select logs](../enable-logging.md#adding-a-diagnostic-setting). To collect **all logs**, select **allLogs**.

Your data volume, retention, and usage in Log Analytics within Azure Monitor is billed through existing Azure data meters. We recommend that you monitor your data usage and retention policies for cost considerations as needed. For more information, see [Controlling costs](/azure/azure-monitor/essentials/diagnostic-settings#controlling-costs).

If you have multiple Azure Communications Services resource IDs, you must enable these settings for each resource ID.  

## Next steps

- Review the overview of all voice and video logs, see: [Overview of Azure Communication Services call logs](voice-and-video-logs.md)

- Learn best practices to manage your call quality and reliability, see: [Improve and manage call quality](../../voice-video-calling/manage-call-quality.md)

- Learn about the [insights dashboard to monitor Voice Calling and Video Calling logs](/azure/communication-services/concepts/analytics/insights/voice-and-video-insights).

- Learn how to use call logs to diagnose call quality and reliability
  issues with Call Diagnostics, see: [Call Diagnostics](../../voice-video-calling/call-diagnostics.md)
