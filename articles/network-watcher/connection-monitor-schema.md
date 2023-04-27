---
title: Connection monitor schemas
titleSuffix: Azure Network Watcher
description: Understand the tests data schema and the path data schema of Azure Network Watcher connection monitor.
services: network-watcher
author: halkazwini
ms.service: network-watcher
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 08/14/2021
ms.author: halkazwini
ms.custom: engagement-fy23
---

# Azure Network Watcher Connection Monitor schemas

Connection Monitor provides unified end-to-end connection monitoring in Azure Network Watcher. The Connection Monitor feature supports hybrid and Azure cloud deployments. Network Watcher provides tools to monitor, diagnose, and view connectivity-related metrics for your Azure deployments.

Here are some use cases for Connection Monitor:

- Your front-end web server virtual machine (VM) communicates with a database server VM in a multiple-tier application. You want to check network connectivity between the two VMs.
- You want VMs in the East US region to ping VMs in the Central US region, and you want to compare cross-region network latencies.
- You have multiple on-premises office sites in Seattle, Washington, and in Ashburn, Virginia. Your office sites connect to Microsoft 365 URLs. For your users of Microsoft 365 URLs, compare the latencies between Seattle and Ashburn.
- Your hybrid application needs connectivity to an Azure Storage endpoint. Your on-premises site and your Azure application connect to the same Azure Storage endpoint. You want to compare the latencies of the on-premises site to the latencies of the Azure application.
- You want to check the connectivity between your on-premises setups and the Azure VMs that host your cloud application.

Here are some benefits of Connection Monitor:

* Unified, intuitive experience for Azure and hybrid monitoring needs
* Cross-region, cross-workspace connectivity monitoring
* Higher probing frequencies and better visibility into network performance
* Faster alerting for your hybrid deployments
* Support for connectivity checks that are based on HTTP, TCP, and ICMP 
* Metrics and Log Analytics support for both Azure and non-Azure test setups

There are two types of logs or data ingested into Log Analytics. The test data (NWConnectionMonitorTestResult query) is updated based on the monitoring frequency of a particular test group. The path data (NWConnectionMonitorPathResult query) is updated when there is a significant change in loss percentage or round-trip time. For some time durations, test data might keep getting updated while path data is not frequently updated because both are independent.

## Connection Monitor Tests schema

The following table lists the fields in the Connection Monitor Tests data schema and what they signify. 

| Field  |    Description   |
|---|---|
| TimeGenerated	| The timestamp (UTC) of when the log was generated |
| RecordId	| The record ID for unique identification of the test result record |
| ConnectionMonitorResourceId	| The Connection Monitor resource ID of the test |
| TestGroupName	| The test group name to which the test belongs |
| TestConfigurationName	| The test configuration name to which the test belongs |
| SourceType	| The type of the source machine configured for the test |
| SourceResourceId	| The resource ID of the source machine |
| SourceAddress	| The address of the source configured for the test |
| SourceSubnet	| The subnet of the source |
| SourceIP	| The IP address of the source |
| SourceName	| The source endpoint name |
| SourceAgentId	| The source agent ID |
| DestinationPort	| The destination port configured for the test |
| DestinationType	| The type of the destination machine configured for the test |
| DestinationResourceId	| The resource ID of the destination machine |
| DestinationAddress	| The address of the destination configured for the test |
| DestinationSubnet	| If applicable, the subnet of the destination |
| DestinationIP	| The IP address of the destination |
| DestinationName	| The destination endpoint name |
| DestinationAgentId	| The destination agent ID |
| Protocol	| The protocol of the test |
| ChecksTotal	| The total number of checks done under the test |
| ChecksFailed	| The total number of checks failed under the test |
| TestResult	| The result of the test |
| TestResultCriterion	| The result criterion of the test |
| ChecksFailedPercentThreshold	| The checks failed percent threshold set for the test |
| RoundTripTimeMsThreshold	| The round-trip threshold (in milliseconds) set for the test |
| MinRoundTripTimeMs	| The minimum round-trip time (in milliseconds) for the test |
| MaxRoundTripTimeMs	| The maximum round-trip time for the test |
| AvgRoundTripTimeMs	| The average round-trip time for the test |
| JitterMs	| The mean deviation round-trip time for the test |
| AdditionalData	| The additional data for the test |


## Connection Monitor Path schema

The following table lists the fields in the Connection Monitor Path data schema and what they signify. 

| Field  |    Description   |
|---|---|
| TimeGenerated	 | The timestamp (UTC) of when the log was generated |
| RecordId	| The record ID for unique identification of the test result record |
| TopologyId	| The topology ID of the path record |
| ConnectionMonitorResourceId	| The Connection Monitor resource ID of the test |
| TestGroupName	| The test group name to which the test belongs |
| TestConfigurationName	| The test configuration name to which the test belongs |
| SourceType	| The type of the source machine configured for the test |
| SourceResourceId	| The resource ID of the source machine |
| SourceAddress	| The address of the source configured for the test |
| SourceSubnet	| The subnet of the source |
| SourceIP	| The IP address of the source | 
| SourceName	| The source endpoint name |
| SourceAgentId	| The source agent ID |
| DestinationPort	| The destination port configured for the test |
| DestinationType	| The type of the destination machine configured for the test |
| DestinationResourceId	| The resource ID of the destination machine |
| DestinationAddress	| The address of the destination configured for the test |
| DestinationSubnet	| If applicable, the subnet of the destination |
| DestinationIP	| The IP address of the destination |
| DestinationName	| The destination endpoint name |
| DestinationAgentId	| The destination agent ID |
| Protocol	| The protocol of the test |
| ChecksTotal	| The total number of checks done under the test |
| ChecksFailed	| The total number of checks failed under the test |
| PathTestResult	| The result of the test |
| PathResultCriterion	| The result criterion of the test | 
| ChecksFailedPercentThreshold	| The checks failed percent threshold set for the test |
| RoundTripTimeMsThreshold	| The round-trip threshold (in milliseconds) set for the test |
| MinRoundTripTimeMs	| The minimum round-trip time (in milliseconds) for the test |
| MaxRoundTripTimeMs	| The maximum round-trip time for the test |
| AvgRoundTripTimeMs	| The average round-trip time for the test |
| JitterMs	| The mean deviation round-trip time for the test |
| HopAddresses | The hop addresses identified for the test |
| HopTypes	| The hop types identified for the test |
| HopLinkTypes	| The hop link types identified for the test |
| HopResourceIds	| The hop resource IDs identified for the test |
| Issues	| The issues identified for the test |
| Hops	| The hops identified for the test |
| AdditionalData | The additional data for the test |
