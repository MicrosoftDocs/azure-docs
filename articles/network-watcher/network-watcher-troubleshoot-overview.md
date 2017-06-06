---
title: Introduction to resource troubleshooting in Azure Network Watcher | Microsoft Docs
description: This page provides an overview of the Network Watcher resource troubleshooting capabilities
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.assetid: c1145cd6-d1cf-4770-b1cc-eaf0464cc315
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 02/22/2017
ms.author: gwallace
---

# Introduction to resource troubleshooting in Azure Network Watcher

Virtual Network Gateways provide connectivity between on-premises resources and other virtual networks within Azure. Monitoring these gateways and their Connections is critical to ensuring communication is not broken. Network Watcher provides the capability to troubleshoot Virtual Network Gateways and Connections. This can be called by PowerShell, CLI, or REST API. When called, Network Watcher diagnoses the health of the virtual network gateway or connection and return the appropriate results. This request is a long running transaction, the results are returned once the diagnosis is complete.

## Results

The preliminary results returned give an overall picture of the health of the resource. Deeper information can be provided for resources as shown in the following section:

The following list is the values returned with the troubleshoot API:

* **startTime** - This value is the time the troubleshoot API call started.
* **endTime** - This value is the time when the troubleshooting ended.
* **code** - This value is UnHealthy, if there is a single diagnosis failure.
* **results** - Results is a collection of results returned on the Connection or the virtual network gateway.
    * **id** - This value is the fault type.
    * **summary** - This value is a summary of the fault.
    * **detailed** - This value provides a detailed description of the fault.
    * **recommendedActions** - This property is a collection of recommended actions to take.
      * **actionText** - This value contains the text describing what action to take.
      * **actionUri** - This value provides the URI to documentation on how to act.
      * **actionUriText** - This value is a short description of the action text.

The following tables show the different fault types (id under results from the preceding list) that are available and if the fault creates logs.

### Gateway

| Fault Type | Reason | Log|
|---|---|---|
| NoFault | When no error is detected. |Yes|
| GatewayNotFound | Cannot find Gateway or Gateway is not provisioned. |No|
| PlannedMaintenance |  Gateway instance is under maintenance.  |No|
| UserDrivenUpdate | When a user update is in progress. This could be a resize operation. | No |
| VipUnResponsive | Cannot reach the primary instance of the Gateway. This happens when the health probe fails. | No |
| PlatformInActive | There is an issue with the platform. | No|
| ServiceNotRunning | The underlying service is not running. | No|
| NoConnectionsFoundForGateway | No Connections exists on the gateway. This is only a warning.| No|
| ConnectionsNotConnected | Connections are not connected. This is only a warning.| Yes|
| GatewayCPUUsageExceeded | The current Gateway CPU usage is > 95%. | Yes |

### Connection

| Fault Type | Reason | Log|
|---|---|---|
| NoFault | When no error is detected. |Yes|
| GatewayNotFound | Cannot find Gateway or Gateway is not provisioned. |No|
| PlannedMaintenance | Gateway instance is under maintenance.  |No|
| UserDrivenUpdate | When a user update is in progress. This could be a resize operation.  | No |
| VipUnResponsive | Cannot reach the primary instance of the Gateway. It happens when the health probe fails. | No |
| ConnectionEntityNotFound | Connection configuration is missing. | No |
| ConnectionIsMarkedDisconnected | The Connection is marked "disconnected". |No|
| ConnectionNotConfiguredOnGateway | The underlying service does not have the Connection configured. | Yes |
| ConnectionMarkedStandy | The underlying service is marked as standby.| Yes|
| Authentication | Preshared Key mismatch. | Yes|
| PeerReachability | The peer gateway is not reachable. | Yes|
| IkePolicyMismatch | The peer gateway has IKE policies that are not supported by Azure. | Yes|
| WfpParse Error | An error occurred parsing the WFP log. |Yes|

## Supported Gateway types

The following list shows the support shows which gateways and connections are supported with Network Watcher troubleshooting.
|  |  |
|---------|---------|
|**Gateway types**   |         |
|VPN      | Supported        |
|ExpressRoute | Not Supported |
|Hypernet | Not Supported|
|**VPN types** | |
|Route Based | Supported|
|Policy Based | Not Supported|
|**Connection types**||
|IPSec| Supported|
|VNet2Vnet| Supported|
|ExpressRoute| Not Supported|
|Hypernet| Not Supported|
|VPNClient| Not Supported|

## Log files

The resource troubleshooting log files are stored in a storage account after resource troubleshooting is finished. The following image shows the example contents of a call that resulted in an error.

![zip file][1]

> [!NOTE]
> In some cases, only a subset of the logs files is written to storage.

For instructions on downloading files from azure storage accounts, refer to [Get started with Azure Blob storage using .NET](../storage/storage-dotnet-how-to-use-blobs.md). Another tool that can be used is Storage Explorer. More information about Storage Explorer can be found here at the following link: [Storage Explorer](http://storageexplorer.com/)

### ConnectionStats.txt

The **ConnectionStats.txt** file contains overall stats of the Connection, including ingress and egress bytes, Connection status, and the time the Connection was established.

> [!NOTE]
> If the call to the troubleshooting API returns healthy, the only thing returned in the zip file is a **ConnectionStats.txt** file.

The contents of this file are similar to the following example:

```
Connectivity State : Connected
Remote Tunnel Endpoint :
Ingress Bytes (since last connected) : 288 B
Egress Bytes (Since last connected) : 288 B
Connected Since : 2/1/2017 8:22:06 PM
```

### CPUStats.txt

The **CPUStats.txt** file contains CPU usage and memory available at the time of testing.  The contents of this file is similar to the following example:

```
Current CPU Usage : 0 % Current Memory Available : 641 MBs
```

### IKEErrors.txt

The **IKEErrors.txt** file contains any IKE errors that were found during monitoring.

The following example shows the contents of an IKEErrors.txt file. Your errors may be different depending on the issue.

```
Error: Authentication failed. Check shared key. Check crypto. Check lifetimes. 
	 based on log : Peer failed with Windows error 13801(ERROR_IPSEC_IKE_AUTH_FAIL)
Error: On-prem device sent invalid payload. 
	 based on log : IkeFindPayloadInPacket failed with Windows error 13843(ERROR_IPSEC_IKE_INVALID_PAYLOAD)
```

### Scrubbed-wfpdiag.txt

The **Scrubbed-wfpdiag.txt** log file contains the wfp log. This log contains logging of packet drop and IKE/AuthIP failures.

The following example shows the contents of the Scrubbed-wfpdiag.txt file. In this example, the shared key of a Connection was not correct as can be seen from the 3rd line from the bottom. The following example is just a snippet of the entire log, as the log can be lengthy depending on the issue.

```
...
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|Deleted ICookie from the high priority thread pool list
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|IKE diagnostic event:
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|Event Header:
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|  Timestamp: 1601-01-01T00:00:00.000Z
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|  Flags: 0x00000106
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|    Local address field set
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|    Remote address field set
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|    IP version field set
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|  IP version: IPv4
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|  IP protocol: 0
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|  Local address: 13.78.238.92
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|  Remote address: 52.161.24.36
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|  Local Port: 0
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|  Remote Port: 0
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|  Application ID:
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|  User SID: <invalid>
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|Failure type: IKE/Authip Main Mode Failure
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|Type specific info:
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|  Failure error code:0x000035e9
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|    IKE authentication credentials are unacceptable
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|
[0]0368.03A4::02/02/2017-17:36:01.496 [ikeext] 3038|52.161.24.36|  Failure point: Remote
...
```

### wfpdiag.txt.sum

The **wfpdiag.txt.sum** file is a log showing the buffers and events processed.

The following example is the contents of a wfpdiag.txt.sum file.
```
Files Processed:
	C:\Resources\directory\924336c47dd045d5a246c349b8ae57f2.GatewayTenantWorker.DiagnosticsStorage\2017-02-02T17-34-23\wfpdiag.etl
Total Buffers Processed 8
Total Events  Processed 2169
Total Events  Lost      0
Total Format  Errors    0
Total Formats Unknown   486
Elapsed Time            330 sec
+-----------------------------------------------------------------------------------+
|EventCount    EventName            EventType   TMF                                 |
+-----------------------------------------------------------------------------------+
|        36    ikeext               ike_addr_utils_c844  a0c064ca-d954-350a-8b2f-1a7464eef8b6|
|        12    ikeext               ike_addr_utils_c857  a0c064ca-d954-350a-8b2f-1a7464eef8b6|
|        96    ikeext               ike_addr_utils_c832  a0c064ca-d954-350a-8b2f-1a7464eef8b6|
|         6    ikeext               ike_bfe_callbacks_c133  1dc2d67f-8381-6303-e314-6c1452eeb529|
|         6    ikeext               ike_bfe_callbacks_c61  1dc2d67f-8381-6303-e314-6c1452eeb529|
|        12    ikeext               ike_sa_management_c5698  7857a320-42ee-6e90-d5d9-3f414e3ea2d3|
|         6    ikeext               ike_sa_management_c8447  7857a320-42ee-6e90-d5d9-3f414e3ea2d3|
|        12    ikeext               ike_sa_management_c494  7857a320-42ee-6e90-d5d9-3f414e3ea2d3|
|        12    ikeext               ike_sa_management_c642  7857a320-42ee-6e90-d5d9-3f414e3ea2d3|
|         6    ikeext               ike_sa_management_c3162  7857a320-42ee-6e90-d5d9-3f414e3ea2d3|
|        12    ikeext               ike_sa_management_c3307  7857a320-42ee-6e90-d5d9-3f414e3ea2d3|
```

## Next steps

Learn how to diagnose VPN Gateways and Connections with PowerShell by visiting [Gateway troubleshooting - PowerShell](network-watcher-troubleshoot-manage-powershell.md).
<!--Image references-->

[1]: ./media/network-watcher-troubleshoot-overview/GatewayTenantWorkerLogs.png
