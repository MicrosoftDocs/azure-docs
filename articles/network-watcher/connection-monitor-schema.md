---
title: Connection monitor schemas
titleSuffix: Azure Network Watcher
description: Learn about the available tests data and path data schemas in Azure Network Watcher connection monitor.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: concept-article
ms.date: 02/23/2024

#CustomerIntent: As an Azure administrator, I want to learn about the available fields in connection monitor schemas so that I can understand the output of Log Analytics queries.
---

# Connection monitor schemas

Connection monitor stores the data it collects in a Log Analytics workspace. There are two types of logs or data ingested into Log Analytics from connection monitor:

- The test data (`NWConnectionMonitorTestResult` query), which is updated based on the monitoring frequency of a particular test group.
- The path data (`NWConnectionMonitorPathResult` query), which is updated when there's a significant change in loss percentage or round-trip time.

For some time durations, test data might keep getting updated while path data isn't frequently updated because both are independent.

In this article, you learn about the available fields in the connection monitor tests data and path data schemas.

## Connection monitor tests schema

The following table lists the fields in the connection monitor tests data schema and what they signify:

| Field | Description |
| ----- | ----------- |
| TimeGenerated	| The timestamp (UTC) of when the log was generated. |
| RecordId | The record ID for unique identification of the test result record. |
| ConnectionMonitorResourceId | The connection monitor resource ID of the test. |
| TestGroupName | The test group name to which the test belongs. |
| TestConfigurationName	| The test configuration name to which the test belongs. |
| SourceType | The type of the source machine configured for the test. |
| SourceResourceId	| The resource ID of the source machine. |
| SourceAddress	| The address of the source configured for the test. |
| SourceSubnet | The subnet of the source. |
| SourceIP | The IP address of the source. |
| SourceName | The source endpoint name. |
| SourceAgentId | The source agent ID. |
| DestinationPort | The destination port configured for the test. |
| DestinationType | The type of the destination machine configured for the test. |
| DestinationResourceId	| The resource ID of the destination machine. |
| DestinationAddress | The address of the destination configured for the test. |
| DestinationSubnet | If applicable, the subnet of the destination. |
| DestinationIP	| The IP address of the destination. |
| DestinationName | The destination endpoint name. |
| DestinationAgentId | The destination agent ID. |
| Protocol | The protocol of the test. |
| ChecksTotal | The total number of checks done under the test. |
| ChecksFailed | The total number of checks failed under the test. |
| TestResult | The result of the test. |
| TestResultCriterion | The result criterion of the test. |
| ChecksFailedPercentThreshold | The checks failed percent threshold set for the test. |
| RoundTripTimeMsThreshold | The round-trip threshold (in milliseconds) set for the test. |
| MinRoundTripTimeMs | The minimum round-trip time (in milliseconds) for the test. |
| MaxRoundTripTimeMs | The maximum round-trip time for the test. |
| AvgRoundTripTimeMs | The average round-trip time for the test. |
| JitterMs | The mean deviation round-trip time for the test. |
| AdditionalData | Other data for the test. |

## Connection monitor path schema

The following table lists the fields in the connection monitor path data schema and what they signify:

| Field | Description |
| ----- | ----------- |
| TimeGenerated | The timestamp (UTC) of when the log was generated. |
| RecordId | The record ID for unique identification of the test result record. |
| TopologyId | The topology ID of the path record. |
| ConnectionMonitorResourceId | The connection monitor resource ID of the test. |
| TestGroupName | The test group name to which the test belongs. |
| TestConfigurationName | The test configuration name to which the test belongs. |
| SourceType | The type of the source machine configured for the test. |
| SourceResourceId | The resource ID of the source machine. |
| SourceAddress | The address of the source configured for the test. |
| SourceSubnet | The subnet of the source. |
| SourceIP | The IP address of the source. | 
| SourceName | The source endpoint name. |
| SourceAgentId	| The source agent ID. |
| DestinationPort | The destination port configured for the test. |
| DestinationType | The type of the destination machine configured for the test. |
| DestinationResourceId	| The resource ID of the destination machine. |
| DestinationAddress | The address of the destination configured for the test. |
| DestinationSubnet	| If applicable, the subnet of the destination. |
| DestinationIP | The IP address of the destination. |
| DestinationName | The destination endpoint name. |
| DestinationAgentId | The destination agent ID. |
| Protocol | The protocol of the test. |
| ChecksTotal | The total number of checks done under the test. |
| ChecksFailed | The total number of checks failed under the test. |
| PathTestResult | The result of the test. |
| PathResultCriterion | The result criterion of the test. | 
| ChecksFailedPercentThreshold | The checks failed percent threshold set for the test. |
| RoundTripTimeMsThreshold | The round-trip threshold (in milliseconds) set for the test. |
| MinRoundTripTimeMs | The minimum round-trip time (in milliseconds) for the test. |
| MaxRoundTripTimeMs | The maximum round-trip time for the test. |
| AvgRoundTripTimeMs | The average round-trip time for the test. |
| JitterMs | The mean deviation round-trip time for the test. |
| HopAddresses | The hop addresses identified for the test. |
| HopTypes | The hop types identified for the test. |
| HopLinkTypes | The hop link types identified for the test. |
| HopResourceIds | The hop resource IDs identified for the test. |
| Issues | The issues identified for the test. |
| Hops | The hops identified for the test. |
| AdditionalData | Other data for the test. |
