---
title: Connection Monitor Schema | Microsoft Docs
description: Understand Schema of Conenction Monitor.
services: network-watcher
documentationcenter: na
author: mjha
manager: vinigam
editor:

ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 01/07/2021
ms.author: mjha
---

# Fields used in Connection Monitor Schema

### Connection Monitor Tests

Listed below are the fields in the schema and what they signify in Connection Monitor Tests

| Field  |    Description   |
|---|---|
| TimeGenerated	| The timestamp (UTC) of when the log was generated |
| RecordId	| The record id for unique identification of test result record |
| ConnectionMonitorResourceId	| The connection monitor resource id of the test |
| TestGroupName	| The test group name to which the test belongs to |
| TestConfigurationName	| The test configuration name to which the test belongs to |
| SourceType	| The type of the source machine configured for the test |
| SourceResourceId	| The resource id of the source machine |
| SourceAddress	| The address of the source configured for the test |
| SourceSubnet	| The subnet of the source |
| SourceIP	| The IP address of the source |
| SourceName	| The source end point name |
| SourceAgentId	| The source agent id |
| DestinationPort	| The destination port configured for the test |
| DestinationType	| The type of the destination machine configured for the test |
| DestinationResourceId	| The resource id of the Destination machine |
| DestinationAddress	| The address of the destination configured for the test |
| DestinationSubnet	| If applicable, the subnet of the destination |
| DestinationIP	| The IP address of the destination |
| DestinationName	| The destination end point name |
| DestinationAgentId	| The destination agent id |
| Protocol	| The protocol of the test |
| ChecksTotal	| The total number of checks done under the test |
| ChecksFailed	| The total number of checks failed under the test |
| TestResult	| The result of the test |
| TestResultCriterion	| The result criterion of the test |
| ChecksFailedPercentThreshold	| The checks failed percent threshold set for the test |
| RoundTripTimeMsThreshold	| The round trip threshold (ms) set for the test |
| MinRoundTripTimeMs	| The minimum round trip time (ms) for the test |
| MaxRoundTripTimeMs	| The maximum round trip time for the test |
| AvgRoundTripTimeMs	| The average round trip time for the test |
| JitterMs	| The mean deviation round trip time for the test |
| AdditionalData	| The additional data for the test |


### Connection Monitor Path

Listed below are the fields in the schema and what they signify in Connection Monitor Path

| Field  |    Description   |
|---|---|
| TimeGenerated	 | The timestamp (UTC) of when the log was generated |
| RecordId	| The record id for unique identification of test result record |
| TopologyId	| The topology id of the path record |
| ConnectionMonitorResourceId	| The connection monitor resource id of the test |
| TestGroupName	| The test group name to which the test belongs to |
| TestConfigurationName	| The test configuration name to which the test belongs to |
| SourceType	| The type of the source machine configured for the test |
| SourceResourceId	| The resource id of the source machine |
| SourceAddress	| The address of the source configured for the test |
| SourceSubnet	| The subnet of the source |
| SourceIP	| The IP address of the source | 
| SourceName	| The source end point name |
| SourceAgentId	| The source agent id |
| DestinationPort	| The destination port configured for the test |
| DestinationType	| The type of the destination machine configured for the test |
| DestinationResourceId	| The resource id of the Destination machine |
| DestinationAddress	| The address of the destination configured for the test |
| DestinationSubnet	| If applicable, the subnet of the destination |
| DestinationIP	| The IP address of the destination |
| DestinationName	| The destination end point name |
| DestinationAgentId	| The destination agent id |
| Protocol	| The protocol of the test |
| ChecksTotal	| The total number of checks done under the test |
| ChecksFailed	| The total number of checks failed under the test |
| PathTestResult	| The result of the test |
| PathResultCriterion	| The result criterion of the test | 
| ChecksFailedPercentThreshold	| The checks failed percent threshold set for the test |
| RoundTripTimeMsThreshold	| The round trip threshold (ms) set for the test |
| MinRoundTripTimeMs	| The minimum round trip time (ms) for the test |
| MaxRoundTripTimeMs	| The maximum round trip time for the test |
| AvgRoundTripTimeMs	| The average round trip time for the test |
| JitterMs	| The mean deviation round trip time for the test |
| HopAddresses	The hop addresses identified for the test |
| HopTypes	| The hop types identified for the test |
| HopLinkTypes	| The hop link types identified for the test |
| HopResourceIds	| The hop resource ids identified for the test |
| Issues	| The issues identified for the test |
| Hops	| The hops identified for the test |
| AdditionalData | The additional data for the test |
