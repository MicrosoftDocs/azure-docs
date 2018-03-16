---
title: Azure AD Connect Health - Alert Catalog | Microsoft Docs
description: This document shows the catalog of all alerts in Azure AD Connect Health.
services: active-directory
documentationcenter: ''
author: zhiweiw
manager: maheshu
editor: ''
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/15/2018
ms.author: zhiweiw
---

# Azure Active Directory Connect Health Alert Catalog 


## Connect Health for Sync

| Alert Name | Description | Remediation |
| --- | --- | ----- |
| Azure AD Connect Sync Service is not running | Microsoft Azure AD Sync Windows service is not running or could not start. As a result, objects will not synchronize with Azure Active Directory. | Start Microsoft Azure Active Directory Sync Services</b> <ol> <li>Click <b>Start</b>, click <b>Run</b>, type <b>Services.msc</b>, and then click <b>OK</b>.</li> <li>Locate the <b>Microsoft Azure AD Sync service</b>, and then check whether the service is started. If the service isn't started, right-click it, and then click <b>Start</b>. | 
| Import from Azure Active Directory failed | The import operation from Azure Active Directory Connector has failed. |  Please investigate the event log errors of import operation for further details.  |
| Connection to Azure Active Directory failed due to authentication failure | Connection to Azure Active Directory failed due to authentication failure. As a result objects will not be synchronized with Azure Active Directory.	| Please investigate the event log errors for further details. If problem persists, please contact Microsoft Support for further assistance. |
| Export to Active Directory failed | The export operation to Active Directory Connector has failed. | Please investigate the event log errors of export operation for further details. | 
| Import from Active Directory failed | Import from Active Directory failed. As a result, objects from some domains from this forest may not be imported. | <li>Verify DC connectivity</li> <li>Re-run import manually</li> <li>Investigate event log errors of the import operation for further details. | 
| Export to Azure Active Directory failed |	The export operation to Azure Active Directory Connector has failed. As a result, some objects may not be exported successfully to Azure Active Directory. | Please investigate the event log errors of export operation for further details. |
| Password Synchronization heartbeat was skipped in last 120 minutes | Password Synchronization has not connected with Azure Active Directory in the last 120 minutes. As a result, passwords will not be synchronized with Azure Active Directory. | Restart Microsoft Azure Active Directory Sync Services:</b><br> Please note that any synchronization operations that are currently running will be interrupted. You can chose to perform below steps when no synchronization operation is in progress.<br> 1. Click <b>Start</b>, click <b>Run</b>, type <b>Services.msc</b>, and then click <b>OK</b>.<br> 2. Locate <b>Microsoft Azure AD Sync</b>, right-click it, and then click <b>Restart</b>. | 
| High CPU Usage detected | The percentage of CPU consumption crossed the recommended threshold on this server. | <li>This could be a temporary spike in CPU consumption. Please check the CPU usage trend from the Monitoring section.</li><li>Inspect the top processes consuming the highest CPU usage on the server.<ol type="a"><li>You may use the Task Manager or execute the following PowerShell Command: <i>get-process \|Sort-Object -Descending CPU \| Select-Object -First 10</i></li><li>If there are unexpected processes consuming high CPU usage, stop the processes using the following PowerShell command:<i>stop-process -ProcessName [name of the process]</i></li></li></ol><li>If the processes seen in the above list are the intended processes running on the server and the CPU consumption is continuously near the threshold please consider re-evaluating the deployment requirements of this server.</li><li>As a fail-safe option you may consider restarting the server. |
| High Memory Consumption Detected | The percentage of memory consumption of the server is beyond the recommended threshold on this server. | Inspect the top processes consuming the highest memory on the server. You may use the Task Manager or execute the following PowerShell Command:<br> <i>get-process \| Sort-Object -Descending WS \| Select-Object -First 10</i> </br> If there are unexpected processes consuming high memory, stop the processes using the following PowerShell command:<br><i>stop-process -ProcessName [name of the process] </i></li><li> If the processes seen in the above list are the intended processes running on the server, please consider re-evaluating the deployment requirements of this server.</li><li>As a failsafe option, you may consider restarting the server. | 
| Password Synchronization has stopped working | The Password Synchronization has stopped. As a result passwords will not be synchronized with Azure Active Directory. | Restart Microsoft Azure Active Directory Sync Services: <br /> Please note that any synchronization operations that are currently running will be interrupted. You can chose to perform below steps when no synchronization operation is in progress. <br /> <ol> <li>Click <b>Start</b>, click <b>Run</b>, type <b>Services.msc</b>, and then click <b>OK</b>.</li> <li>Locate the <b>Microsoft Azure AD Sync</b>, right-click it, and then click <b>Restart</b>.</li> </ol> </p>  | 
| Export to Azure Active Directory was Stopped. Accidental delete threshold was reached | The export operation to Azure Active Directory has failed. There were more objects to be deleted than the configured threshold. As a result, no objects were exported. | <li> The number of objects are marked for deletion are greater than the set threshold. Ensure this outcome is desired.</li> <li> To allow the export to continue, please perform the following steps: <ol type="a"> <li>Disable Threshold by running Disable-ADSyncExportDeletionThreshold</li> <li>Start Sychronization Service Manager</li> <li>Run Export on Connector with type = Azure Active Directory</li> <li>After successfully exporting the objects, enable Threshold by running : Enable-ADSyncExportDeletionThreshold</li> </ol> </li> |







## Next steps
* [Azure AD Connect Health FAQ](active-directory-aadconnect-health-faq.md)
