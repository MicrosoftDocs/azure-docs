---
title: How to troubleshoot issues with the Log Analytics agent for Windows | Microsoft Docs
description: Describe the symptoms, causes, and resolution for the most common issues with the Log Analytics agent for Windows in Azure Monitor.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn
ms.assetid: 
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/27/2019
ms.author: magoedte
---

# How to troubleshoot issues with the Log Analytics agent for Windows 

This article provides help troubleshooting errors you might experience with the Log Analytics agent for Windows in Azure Monitor and suggests possible solutions to resolve them.

If none of these steps work for you, the following support channels are also available:

* Customers with Premier support benefits can open a support request with [Premier](https://premier.microsoft.com/).
* Customers with Azure support agreements can open a support request [in the Azure portal](https://manage.windowsazure.com/?getsupport=true).
* Diagnose OMI Problems with the [OMI troubleshooting guide](https://github.com/Microsoft/omi/blob/master/Unix/doc/diagnose-omi-problems.md).
* File a [GitHub Issue](https://github.com/Microsoft/OMS-Agent-for-Linux/issues).
* Visit the Log Analytics Feedback page to review submitted ideas and bugs [https://aka.ms/opinsightsfeedback](https://aka.ms/opinsightsfeedback) or file a new one. 

## Important troubleshooting sources

 To assist with troubleshooting issues related to Log Analytics agent for Windows, the agent logs events to the Windows Event Log, specifically under *Application and Services\Operations Manager*.  

## Connectivity issues

If the agent is communicating through a proxy server or firewall, there may be restrictions in place preventing communication from the source computer and the Azure Monitor service. If communications is blocked, misconfiguration, registration with a workspace may fail while attempting to install the agent, configure the agent post-setup to report to an additional workspace, or agent communication fails after successful registration. This section describes the methods to troubleshoot this type of issue with the Windows agent. 

Double check that the firewall or proxy is configured to allow the following ports and URLs described in the following table.

|Agent Resource|Ports |Direction |Bypass HTTPS inspection|
|------|---------|--------|--------|   
|*.ods.opinsights.azure.com |Port 443 |Outbound|Yes |  
|*.oms.opinsights.azure.com |Port 443 |Outbound|Yes |  
|*.blob.core.windows.net |Port 443 |Outbound|Yes |  
|*.azure-automation.net |Port 443 |Outbound|Yes |  

For firewall information required for Azure Government, see [Azure Government management](../../azure-government/documentation-government-services-monitoringandmanagement.md#azure-monitor-logs). 

There are two ways you can verify if the agent is successfully communicating with Azure Monitor.

1. Run the following query to confirm the agent is sending a heartbeat to the workspace it is configured to report to. Replace <ComputerName> with the actual name of the machine.

    ```
    Heartbeat 
    | where Computer like "<ComputerName>"
    | summarize arg_max(TimeGenerated, * ) by Computer 

    If the computer is successfully communicating with the service, the query should return a result. If the query did not return a result, first verify the agent is configured to report to the correct workspace. If it is configured correctly, proceed to step 2 and search the Windows Event Log to identify if the agent is logging what issue might be preventing it from communicating with Azure Monitor.

2. Filter the *Operations Manager* event log by **Event sources** - *Health Service Modules*, *HealthService*, and *Service Connector* and filter by **Event Level** *Warning* and *Error* to confirm events from the following table are not written. If they are, review the resolution steps included for each possible event.

    |Event ID |Source |Description |Resolution |
    |---------|-------|------------|-----------|
    |2138 |Health Service Modules |Proxy requires authentication |Configure the agent's proxy settings and specify the username/password required to authenticate with the proxy server. |
    |2129 |Health Service Modules |Failed connection / Failed SSL negotiation |Check your network adapter TCP/IP settings and agent proxy settings.|
    |2127 |Health Service Modules |Failure sending data received error code |If it only happens periodically during the day, this could just be a random anomaly that can be ignored. Monitor to understand how often it happens. If it happens often throughout the day, first check your network configuration and proxy settings. If the description includes HTTP error code 404 and this is the first time that the agent tries to send data to the service, it will include a 500 error with an inner 404 error code. 404 means not found, which indicates that the storage area for the new workspace is still being provisioned. On next retry, data will successfully write to the workspace as expected. A HTTP error 403 might indicate a permission or credentials issue. There is more information included with the 403 error to help troubleshoot the issue.|
    |2128 |Health Service Modules |DNS name resolution failed |The machine could not resolve the Internet address used when sending data to the service. This might be DNS resolver settings on your machine, incorrect proxy settings, or maybe a temporary DNS issue with your provider. If this happens periodically, it could be caused by a transient network-related issue.|
    |2130 |Health Service Modules |Time out |Like the previous events, this symptom depends on whether it happens constantly or periodically.|
    |4002 |Service Connector |The service returned HTTP status code 403 in response to a query. Please check with the service administrator for the health of the service. The query will be retried later. |This error is written during the agent’s initial registration phase and you’ll see a URL similar to the following: *https://<workspaceID>.oms.opinsights.azure.com/AgentService.svc/AgentTopologyRequest*. An error code 403 means forbidden and can be caused by a mistyped Workspace ID or key, or the data and time is incorrect on the computer.|If the time is +/- 15 minutes from current time, then onboarding fails. To correct this update the date and/or timezone of your Windows computer.

## Resource utilization issues

## Data collection issues

 If 

that have had or never had either Heart beats reporting to the workspace or any other data that the agent is supposed to collect such as performance counters, custom logs, etc.

## 