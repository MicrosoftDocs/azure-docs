---
title: Call setup issues - The call ends due to network issues
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot when the call ends with 410/3112
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 09/22/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# The call ends with 410/3112
The reason why call ends with 410/3112 error is the client isn't able to reach out to the other endpoint and no relay candidates are gathered.
This 410/3112 error code can happen when the media path can't be established due to network issues, firewall restrictions, or incorrect configuration settings.
Therefore, the peers were unable to establish a direct or relay connection.

The relay candidates aren't necessary if the client is able to establish a direct connection to the other peer.
However, when WebRTC fails to gather relay candidates, it often indicates an issue with TURN (Traversal Using Relays around NAT) server configuration or network restrictions.
Relay candidates are crucial for establishing connections in restrictive network environments.

## How to detect using the SDK
You can learn the reason for the call ending using the following code snippet.
```javascript
call.on('stateChanged', () => {
    if (call.state === 'Disconnected') {
      if (call.callEndReason.code === 410 && call.callEndReason.subCode === 3112) {
          // show error message
      }
    }
});

```
To understand the codes and subcodes, see [Understanding calling codes and subcodes errors](../general-troubleshooting-strategies/understanding-error-codes.md).

When the media path can't be established, the call terminates with code 410 and subcode 3112.
The SDK also triggers [networkRelaysNotReachable UFD](../references/ufd/network-relays-not-reachable.md) event.
Here's a code snippet showing how to capture the `networkRelaysNotReachable UFD` event.

```javascript
call.feature(Features.UserFacingDiagnostics).network.on('diagnosticChanged', (diagnosticInfo) => {
    if (diagnosticInfo.diagnostic === 'networkRelaysNotReachable') {
       if (diagnosticInfo.value === true) {
           // show a warning message on UI
       } else {
           // The networkRelaysNotReachable UFD recovered, notify the user
       }
    }
});
```
## How to analyze the issue with Log Analytics or Call Diagnostics tool
When a user reports that they're unable to make a call, you can use the [Call Diagnostics](../../../../concepts/voice-video-calling/call-diagnostics.md) tool to analyze the reason for the failure.
To debug user calls, you need the [call ID](../references/how-to-collect-call-info.md).
If the user's call failed because the firewall blocked the relay connection, you can find the end code and subcode to be 410 and 3112 on the overview page of the call.

:::image type="content" source="./media/call-diagnostics-call-overview-subcode-3112.png" alt-text="Screenshot of call diagnostics which has subcode 3112 on the overview page of the call." lightbox="./media/call-diagnostics-call-overview-subcode-3112.png":::

Additionally, you can also find [networkRelaysNotReachable UFD](../references/ufd/network-relays-not-reachable.md) event on the call issues page.

:::image type="content" source="./media/call-diagnostics-call-issues-network-relay-not-reachable-ufd.png" alt-text="Screenshot of call diagnostics which has networkRelaysNotReachable UFD on call issues page." lightbox="./media/call-diagnostics-call-issues-network-relay-not-reachable-ufd.png":::

To understand the timing of user actions or events, you can check the details on the timeline page.
In this example, the user got `networkRelaysNotReachable UFD` event at 16:41:47 and call state change event at 16:41:49.

:::image type="content" source="./media/call-diagnostics-call-timeline-events.png" alt-text="Screenshot of call diagnostics which shows the timing of events call timeline page." lightbox="./media/call-diagnostics-call-timeline-events.png":::

The [Call Diagnostics](../../../../concepts/voice-video-calling/call-diagnostics.md) tool gives you an overview and the necessary information for debugging a single call.
If you want to understand how many users encounter this issue, or how often users experience the problem, you can use the [Log Analytics](../../../../concepts/analytics/logs/voice-and-video-logs.md) tool to gain the insights on this issue.

For example, if you want to get the call ID that were disconnected with subcode 3112 in the last seven days, you can execute this query:
```kusto
ACSCallSummary
| where ParticipantEndSubCode == 3112
| project TimeGenerated, CorrelationId, ParticipantId, Identifier, CallType
```
:::image type="content" source="./media/log-query-result-for-calls-with-subcode-3112.png" alt-text="Screenshot of log query result for calls with subcode 3112." lightbox="./media/log-query-result-for-calls-with-subcode-3112.png":::

You can also render a timechart to understand the daily number of calls ending with subcode 3112
```kusto
ACSCallSummary
| where ParticipantEndSubCode == 3112
| summarize count() by bin(TimeGenerated, 1d)
| render timechart
```

:::image type="content" source="./media/timechart-displaying-the-calls-ending-with-subcode-3112.png" alt-text="Screenshot of a timechart displaying the daily number of calls ending with subcode 3112." lightbox="./media/timechart-displaying-the-calls-ending-with-subcode-3112.png":::

The time chart only provides an overview of the users under the same ACS resource ID.
By running more specific queries, you can identify patterns or anomalies that aren't immediately apparent from the time chart alone, helping you pinpoint the root cause of any issues more accurately.

For example, if you see a spike in the number of calls ending with subcode 3112, it could be due to the high volume of calls while the occurrence ratio of the problem remained the same. Alternatively, the spike might be attributed to a particular user who retried many times and all attempts were failed with subcode 3112.

In this query, we analyze the data based on the user identifiers, assuming that the app maintains the same user identifier for each individual.
```kusto
ACSCallSummary
| summarize Total = count(), SuccessCount = countif(ParticipantEndSubCode == 0), SubCode3112Count = countif(ParticipantEndSubCode == 3112) by Identifier
| where SubCode3112Count > 0
| order by SubCode3112Count desc
```

:::image type="content" source="./media/log-query-results-3112-for-each-user-identifer.png" alt-text="Screenshot of log query results showing the number of calls ending with subcode 3112 for each user identifier." lightbox="./media/log-query-results-3112-for-each-user-identifer.png":::

In this example, one user had a total of 180 calls, of which 160 calls were successful and only two calls failed with subcode 3112.
This pattern suggests a transient network issue, which may be resolved by retrying.
On the other hand, another user had a total of six calls, all of which failed with subcode 3112.
This consistency in subcode value indicates a likely network configuration issue for that user, where retrying is unlikely to help.

## How to mitigate or resolve
If you find a user consistently experiences 410/3112 error, you should recommend that they check their firewall settings.
Users should follow the *Firewall Configuration* guideline mentioned in the [Network recommendations](../../../../concepts/voice-video-calling/network-requirements.md) document.
Ensure that the user or administrator checks their Network Address Translation (NAT) settings and verifies whether their firewall policy blocks User Datagram Protocol (UDP) packets.
The firewall settings aren't limited to the user's computer; if the user is in a corporate environment, the company's firewall may also need to be configured.

Furthermore, if the application uses [custom TURN servers](../../../../tutorials/proxy-calling-support-tutorial.md),
ensure that specified IP, port, and protocol aren't blocked by any firewall.

For application, it's important to handle events from the [User Facing Diagnostics Feature](../../../../concepts/voice-video-calling/user-facing-diagnostics.md) and notify the users accordingly.
By doing so, the user is aware of the issue and can troubleshoot their network environment.

In rare cases, this error code appears randomly even if the user's firewall settings are correct.
If the same user was previously able to connect and call successfully, this problem could be due to changes in network conditions.
It may be a temporary issue. Try to start or join the call again.

## References
* [Network recommendations](../../../../concepts/voice-video-calling/network-requirements.md)
* [networkRelaysNotReachable UFD](../references/ufd/network-relays-not-reachable.md)
* [Force calling traffic to be proxied across your own server](../../../../tutorials/proxy-calling-support-tutorial.md)

