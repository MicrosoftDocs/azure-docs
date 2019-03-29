---
title: Azure AD Connect Health - Health service data is not up to date alert | Microsoft Docs
description: This document describes the cause of "Health service data is not up to date" alert and how to troubleshoot it.
services: active-directory
documentationcenter: ''
author: zhiweiwangmsft
manager: SamuelD
editor: ''
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 02/26/2018
ms.author: zhiweiw
ms.collection: M365-identity-device-management
---

# Health service data is not up to date alert

## Overview
The Agents on the on-premise machines that Azure AD Connect Health monitors periodically uploads data to Azure AD Connect Health Service. If the service does not receive data from an agent, the information presented in portal will be stale. To highlight the issue, the service will raise **Health service data is not up to date** alert. This is generated when the service has not received data in the last two hours.  

* The **Warning** status alert fires if Connect Health does not receive partial data elements sent from server for two hours. Warning status alert does not trigger email notifications to the tenant admin.
* The **Error** status alert fires if Connect Health does not receive any data elements sent from server for two hours. Error status alert triggers email notifications to the tenant admin.


## Troubleshooting steps 

> [!IMPORTANT] 
> This alert follows Connect Health [data retention policy](reference-connect-health-user-privacy.md#data-retention-policy)

* Make sure that Azure AD Connect Health Agents services are running on the machine. For example, Connect Health for AD FS should have three services.  
  ![Verify Azure AD Connect Health](./media/how-to-connect-health-agent-install/install5.png)

* Make sure to go over and meet the [requirements section](how-to-connect-health-agent-install.md#requirements).
* Use [test connectivity tool](how-to-connect-health-agent-install.md#test-connectivity-to-azure-ad-connect-health-service) to discover connectivity issues.
* If you have an HTTP Proxy, follow these [configuration steps](how-to-connect-health-agent-install.md#configure-azure-ad-connect-health-agents-to-use-http-proxy). 

The alert detail blade lists out missing data element(s) from a server. The following table will help narrow down the problem further. 
### Connect Health for Sync

| Data elements | Troubleshooting steps |
| --- | --- | 
| PerfCounter | - [Outbound connectivity to the Azure service endpoint](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections) <br />- [SSL Inspection for outbound traffic is filtered or disabled](https://technet.microsoft.com/library/ee796230.aspx) <br /> - [Firewall ports on the server running the agent](https://technet.microsoft.com/library/ms345310(v=sql.100).aspx) |
| AadSyncService-SynchronizationRules, <br /> AadSyncService-Connectors, <br /> AadSyncService-GlobalConfigurations, <br /> AadSyncService-RunProfileResults, <br /> AadSyncService-ServiceConfigurations, <br /> AadSyncService-ServiceStatus | - [Outbound connectivity to the Azure service endpoint](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections) <br /> -  [Firewall ports on the server running the agent](https://technet.microsoft.com/library/ms345310(v=sql.100).aspx) | 

### Connect Health for ADFS

Extra steps to validate for AD FS and follow the workflow in [AD FS Help](https://adfshelp.microsoft.com/TroubleshootingGuides/Workflow/3ef51c1f-499e-4e07-b3c4-60271640e282).

| Data elements | Troubleshooting steps |
| --- | --- | 
| PerfCounter, TestResult | - [Outbound connectivity to the Azure service endpoint](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections) <br />- [SSL Inspection for outbound traffic is filtered or disabled](https://technet.microsoft.com/library/ee796230.aspx) <br />-  [Firewall ports on the server running the agent](https://technet.microsoft.com/library/ms345310(v=sql.100).aspx) |
|  Adfs-UsageMetrics | Outbound connectivity based on IP Addresses, refer to [Azure IP Ranges](https://www.microsoft.com/download/details.aspx?id=41653) | 

### Connect Health for ADDS

| Data elements | Troubleshooting steps |
| --- | --- | 
| PerfCounter, Adds-TopologyInfo-Json, Common-TestData-Json | - [Outbound connectivity to the Azure service endpoint](https://docs.microsoft.com/azure/load-balancer/load-balancer-outbound-connections) <br /> -  [Firewall ports on the server running the agent](https://technet.microsoft.com/library/ms345310(v=sql.100).aspx) |


## Next steps
* [Azure AD Connect Health FAQ](reference-connect-health-faq.md)
