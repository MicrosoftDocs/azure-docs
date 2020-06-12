---
title: Query Azure Automation Update Management logs
description: This article tells how to query the logs for Update Management in your Log Analytics workspace.
services: automation
ms.subservice: update-management
ms.date: 04/06/2020
ms.topic: conceptual
---
# Query Update Management logs

In addition to the details that are provided during Update Management deployment, you can search the logs stored in your Log Analytics workspace. To search the logs from your Automation account, select **Update management** and open the Log Analytics workspace associated with your deployment.

You can also customize the log queries or use them from different clients. See [Log Analytics search API documentation](https://dev.loganalytics.io/).

## Query update records

Update Management collects records for Windows and Linux VMs and the data types that appear in log search results. The following sections describe those records.

### Query required updates

A record with a type of `RequiredUpdate` is created that represents updates required by a machine. These records have the properties in the following table:

| Property | Description | 
|----------|-------------|
| Computer | Fully-qualified domain name of reporting machine. |
| KBID | Knowledge base article ID for the Windows update. |
| ManagementGroupName | Name of the Operations Manager management group or Log Analytics workspace. | 
| Product | The products for which the update is applicable for. | 
| PublishDate | The date the update is ready to be downloaded and installed from Windows Update. |
| Server | | 
| SourceHealthServiceId | Unique identifier representing the Log Analytics Windows agent ID. |
| SourceSystem | *OperationsManager* | 
| TenantId | Unique identifier representing your organizations instance of Azure Active Directory. | 
| TimeGenerated | Date and time that the record was created. | 
| Type | *Update* | 
| UpdateClassification | Indicates the type of updates that can be applied. For Windows:<br> *Critical updates*<br> *Security updates*<br> *Update rollups*<br> *Feature packs*<br> *Service packs*<br> *Definition updates*<br> *Tools*<br> *Updates*. For Linux:<br> *Critical and security updates*<br> *Other* |
| UpdateSeverity | Severity rating for the vulnerability. Values are:<br> *Critical*<br> *Important*<br> *Moderate*<br> *Low* |
| UpdateTitle | The title of the update.|

### Query Update record

A record with a type of `Update` is created that represents updates available and their installation status for a machine. These records have the properties in the following table:

| Property | Description | 
|----------|-------------|
| ApprovalSource | Applies to Windows operating system only. Source of approval for the record. The value is Microsoft Update. |
| Approved | True if the record is approved, or False otherwise. |
| Classification | Approval classification. The value is Updates. |
| Computer | Fully-qualified domain name of reporting machine. |
| ComputerEnvironment | Environment. Possible values are Azure or Non-Azure. |
| MSRCBulletinID | Security bulletin ID number. | 
| MSRCSeverity | Severity rating for the vulnerability. Values are:<br> Critical<br> Important<br> Moderate<br> Low |  
| KBID | Knowledge base article ID for the Windows update. |
| ManagementGroupName | Name of the Operations Manager management group or the Log Analytics workspace. |
| UpdateID | Unique identifier of the software update. |
| RevisionNumber | The revision number of a specific revision of an update. |
| Optional | True if the record is optional, or False otherwise. | 
| RebootBehavior | The reboot behavior after installing/uninstalling an update. |
| _ResourceId | Unique identifier for the resource associated with the record. |
| Type | Record type. The value is Update. |
| VMUUID | Unique identifier for the virtual machine. |
| MG | Unique identifier for the management group or Log Analytics workspace. | 
| TenantId | Unique identifier representing your organization's instance of Azure Active Directory. | 
| SourceSystem | The source system for the record. The value is `OperationsManager`. | 
| TimeGenerated | Date and time of record creation. | 
| SourceComputerId | Unique identifier representing the source computer. | 
| Title | The title of the update. |
| PublishedDate (UTC) | The date when the update is ready to be downloaded and installed from Windows Update.  |
| UpdateState | The current state of the update. | 
| Product | The products for which the update is applicable. |
| SubscriptionId | Unique identifier for the Azure subscription. | 
| ResourceGroup | Name of the resource group to which the resource belongs. | 
| ResourceProvider | The resource provider. | 
| Resource | Name of the resource. | 
| ResourceType | The resource type. | 

### Query Update Agent record

A record with a type of `UpdateAgent` is created that provides details of the update agent on the machine. These records have the properties in the following table:

| Property | Description | 
|----------|-------------|
| AgeofOldestMissingRequiredUpdate | | 
| AutomaticUpdateEnabled | | 
| Computer | Fully-qualified domain name of reporting machine. |
| DaySinceLastUpdateBucket | | 
| ManagementGroupName | Name of the Operations Manager management group or Log Analytics workspace. |
| OSVersion | The version of the operating system. |
| Server | |
| SourceHealthServiceId | Unique identifier representing the Log Analytics Windows agent ID. |
| SourceSystem | The source system for the record. The value is `OperationsManager`. | 
| TenantId | Unique identifier representing your organization's instance of Azure Active Directory. |
| TimeGenerated | Date and time of record creation. |
| Type | Record type. The value is Update. | 
| WindowsUpdateAgentVersion | Version of the Windows Update agent. |
| WSUSServer | Errors if the Windows Update agent has a problem, to assist with troubleshooting. |

### Query Update Deployment Status record

A record with a type of `UpdateRunProgress` is created that provides update deployment status of a scheduled deployment by machine. These records have the properties in the following table:

| Property | Description | 
|----------|-------------|
| Computer | Fully-qualified domain name of reporting machine. |
| ComputerEnvironment | Environment. Values are Azure or Non-Azure. | 
| CorrelationId | Unique identifier of the runbook job run for the update. |
| EndTime | The time when the synchronization process ended. | 
| ErrorResult | Windows Update error code generated if an update fails to install. | 
| InstallationStatus | The possible installation states of an update on the client computer,<br> `NotStarted` - job not triggered yet.<br> `FailedToStart` - unable to start the job on machine.<br> `Failed` - job started but failed with an exception.<br> `InProgress` - job in progress.<br> `MaintenanceWindowExceeded` - if execution was remaining but maintenance window interval reached.<br> `Succeeded` - job succeeded.<br> `InstallFailed` - update failed to install successfully.<br> `NotIncluded`<br> `Excluded` |
| KBID | Knowledge base article ID for the Windows update. | 
| ManagementGroupName | Name of the Operations Manager management group or Log Analytics workspace. |
| OSType | Type of operating system. Values are Windows or Linux. | 
| Product | The products for which the update is applicable. |
| Resource | Name of the resource. | 
| ResourceId | Unique identifier for the resource associated with the record. |
| ResourceProvider | The resource provider. | 
| ResourceType | Resource type. | 
| SourceComputerId | Unique identifier representing the source computer. | 
| SourceSystem | Source system for the record. The value is `OperationsManager`. |
| StartTime | Time when the update is scheduled to be installed. |
| SubscriptionId | Unique identifier for the Azure subscription. | 
| SucceededOnRetry | Value indicating if the update execution failed on the first attempt and the current operation is a retry attempt. |
| TimeGenerated | Date and time of record creation. |
| Title | The title of the update. |
| Type | The type of update. The value is `UpdateRunProgress`. |
| UpdateId | Unique identifier of the software update. |
| VMUUID | Unique identifier for the virtual machine. |
| ResourceId | Unique identifier for the resource associated with the record. |

### Query Update Summary record

A record with a type of `UpdateSummary` is created that provides update summary by machine. These records have the properties in the following table:

| Property | Description | 
|----------|-------------|
| Computer | Fully-qualified domain name of reporting machine. |
| ComputerEnvironment | Environment. Values are Azure or Non-Azure. | 
| CriticalUpdatesMissing | Number of applicable critical updates that are missing. | 
| ManagementGroupName | Name of the Operations Manager management group or Log Analytics workspace. |
| NETRuntimeVersion | Version of .NET Framework installed on the Windows computer. |
| OldestMissingSecurityUpdateBucket | Specifier of the oldest missing security bucket. Values are:<br> Recent if value is less than 30 days<br> 30 days ago<br> 60 days ago<br> 90 days ago<br> 120 days ago<br> 150 days ago<br> 180 days ago<br> Older when value is greater than 180 days. | 
| OldestMissingSecurityUpdateInDays | Total number of days for the oldest update detected as applicable that has not been installed. |
| OsVersion | The version of the operating system. |
| OtherUpdatesMissing | Count of detected updates missing. |
| Resource | Name of the resource for the record. | 
| ResourceGroup | Name of the resource group containing the resource. |
| ResourceId | Unique identifier for the resource associated with the record. |
| ResourceProvider | The resource provider. |
| ResourceType | Resource type. |
| RestartPending | True if a restart is pending, or False otherwise. |
| SecurityUpdatesMissing | Count of missing security updates that are applicable.| 
| SourceComputerId | Unique identifier for the virtual machine. |
| SourceSystem | Source system for the record. The value is `OpsManager`. | 
| SubscriptionId | Unique identifier for the Azure subscription. |
| TimeGenerated | Date and time of record creation. |
| TotalUpdatesMissing | Total number of missing updates that are applicable. | 
| Type | Record type. The value is `UpdateSummary`. |
| VMUUID | Unique identifier for the virtual machine. |
| WindowsUpdateAgentVersion | Version of the Windows Update agent. |
| WindowsUpdateSetting | Status of the Windows Update agent. Possible values are:<br> `Scheduled installation`<br> `Notify before installation`<br> `Error returned from unhealthy WUA agent` | 
| WSUSServer | Errors if the Windows Update agent has a problem, to assist with troubleshooting. |
| _ResourceId | Unique identifier for the resource associated with the record. |

## Sample queries

The following sections provide sample log queries for update records that are collected for Update Management.

### Confirm that non-Azure machines are enabled for Update Management

To confirm that directly connected machines are communicating with Azure Monitor logs, run one of the following log searches.

#### Linux

```loganalytics
Heartbeat
| where OSType == "Linux" | summarize arg_max(TimeGenerated, *) by SourceComputerId | top 500000 by Computer asc | render table
```

#### Windows

```loganalytics
Heartbeat
| where OSType == "Windows" | summarize arg_max(TimeGenerated, *) by SourceComputerId | top 500000 by Computer asc | render table
```

On a Windows computer, you can review the following information to verify agent connectivity with Azure Monitor logs:

1. In Control Panel, open **Microsoft Monitoring Agent**. On the **Azure Log Analytics** tab, the agent displays the following message: **The Microsoft Monitoring Agent has successfully connected to Log Analytics**.
2. Open the Windows Event Log. Go to **Application and Services Logs\Operations Manager** and search for Event ID 3000 and Event ID 5002 from the source **Service Connector**. These events indicate that the computer has registered with the Log Analytics workspace and is receiving configuration.

If the agent can't communicate with Azure Monitor logs and the agent is configured to communicate with the internet through a firewall or proxy server, confirm the firewall or proxy server is properly configured. To learn how to verify the firewall or proxy server is properly configured, see [Network configuration for Windows agent](../azure-monitor/platform/agent-windows.md) or [Network configuration for Linux agent](../log-analytics/log-analytics-agent-linux.md).

> [!NOTE]
> If your Linux systems are configured to communicate with a proxy or Log Analytics Gateway and you're enabling Update Management, update the `proxy.conf` permissions to grant the omiuser group read permission on the file by using the following commands:
>
> `sudo chown omsagent:omiusers /etc/opt/microsoft/omsagent/proxy.conf`
> `sudo chmod 644 /etc/opt/microsoft/omsagent/proxy.conf`

Newly added Linux agents show a status of **Updated** after an assessment has been performed. This process can take up to 6 hours.

To confirm that an Operations Manager management group is communicating with Azure Monitor logs, see [Validate Operations Manager integration with Azure Monitor logs](../azure-monitor/platform/om-agents.md#validate-operations-manager-integration-with-azure-monitor).

### Single Azure VM Assessment queries (Windows)

Replace the VMUUID value with the VM GUID of the virtual machine you're querying. You can find the VMUUID that should be used by running the following query in Azure Monitor logs: `Update | where Computer == "<machine name>" | summarize by Computer, VMUUID`

#### Missing updates summary

```loganalytics
Update
| where TimeGenerated>ago(14h) and OSType!="Linux" and (Optional==false or Classification has "Critical" or Classification has "Security") and VMUUID=~"b08d5afa-1471-4b52-bd95-a44fea6e4ca8"
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, Approved) by Computer, SourceComputerId, UpdateID
| where UpdateState=~"Needed" and Approved!=false
| summarize by UpdateID, Classification
| summarize allUpdatesCount=count(), criticalUpdatesCount=countif(Classification has "Critical"), securityUpdatesCount=countif(Classification has "Security"), otherUpdatesCount=countif(Classification !has "Critical" and Classification !has "Security")
```

#### Missing updates list

```loganalytics
Update
| where TimeGenerated>ago(14h) and OSType!="Linux" and (Optional==false or Classification has "Critical" or Classification has "Security") and VMUUID=~"8bf1ccc6-b6d3-4a0b-a643-23f346dfdf82"
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, Title, KBID, PublishedDate, Approved) by Computer, SourceComputerId, UpdateID
| where UpdateState=~"Needed" and Approved!=false
| project-away UpdateState, Approved, TimeGenerated
| summarize computersCount=dcount(SourceComputerId, 2), displayName=any(Title), publishedDate=min(PublishedDate), ClassificationWeight=max(iff(Classification has "Critical", 4, iff(Classification has "Security", 2, 1))) by id=strcat(UpdateID, "_", KBID), classification=Classification, InformationId=strcat("KB", KBID), InformationUrl=iff(isnotempty(KBID), strcat("https://support.microsoft.com/kb/", KBID), ""), osType=2
| sort by ClassificationWeight desc, computersCount desc, displayName asc
| extend informationLink=(iff(isnotempty(InformationId) and isnotempty(InformationUrl), toobject(strcat('{ "uri": "', InformationUrl, '", "text": "', InformationId, '", "target": "blank" }')), toobject('')))
| project-away ClassificationWeight, InformationId, InformationUrl
```

### Single Azure VM assessment queries (Linux)

For some Linux distros, there is an [endianness](https://en.wikipedia.org/wiki/Endianness) mismatch with the VMUUID value that comes from Azure Resource Manager and what is stored in Azure Monitor logs. The following query checks for a match on either endianness. Replace the VMUUID values with the big-endian and little-endian format of the GUID to properly return the results. You can find the VMUUID that should be used by running the following query in Azure Monitor logs: `Update | where Computer == "<machine name>"
| summarize by Computer, VMUUID`

#### Missing updates summary

```loganalytics
Update
| where TimeGenerated>ago(5h) and OSType=="Linux" and (VMUUID=~"625686a0-6d08-4810-aae9-a089e68d4911" or VMUUID=~"a0865662-086d-1048-aae9-a089e68d4911")
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification) by Computer, SourceComputerId, Product, ProductArch
| where UpdateState=~"Needed"
| summarize by Product, ProductArch, Classification
| summarize allUpdatesCount=count(), criticalUpdatesCount=countif(Classification has "Critical"), securityUpdatesCount=countif(Classification has "Security"), otherUpdatesCount=countif(Classification !has "Critical" and Classification !has "Security")
```

#### Missing updates list

```loganalytics
Update
| where TimeGenerated>ago(5h) and OSType=="Linux" and (VMUUID=~"625686a0-6d08-4810-aae9-a089e68d4911" or VMUUID=~"a0865662-086d-1048-aae9-a089e68d4911")
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, BulletinUrl, BulletinID) by Computer, SourceComputerId, Product, ProductArch
| where UpdateState=~"Needed"
| project-away UpdateState, TimeGenerated
| summarize computersCount=dcount(SourceComputerId, 2), ClassificationWeight=max(iff(Classification has "Critical", 4, iff(Classification has "Security", 2, 1))) by id=strcat(Product, "_", ProductArch), displayName=Product, productArch=ProductArch, classification=Classification, InformationId=BulletinID, InformationUrl=tostring(split(BulletinUrl, ";", 0)[0]), osType=1
| sort by ClassificationWeight desc, computersCount desc, displayName asc
| extend informationLink=(iff(isnotempty(InformationId) and isnotempty(InformationUrl), toobject(strcat('{ "uri": "', InformationUrl, '", "text": "', InformationId, '", "target": "blank" }')), toobject('')))
| project-away ClassificationWeight, InformationId, InformationUrl

```

### Multi-VM assessment queries

#### Computers summary

```loganalytics
Heartbeat
| where TimeGenerated>ago(12h) and OSType=~"Windows" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
| where Solutions has "updates"
| distinct SourceComputerId
| join kind=leftouter
(
    Update
    | where TimeGenerated>ago(14h) and OSType!="Linux"
    | summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Approved, Optional, Classification) by SourceComputerId, UpdateID
    | distinct SourceComputerId, Classification, UpdateState, Approved, Optional
    | summarize WorstMissingUpdateSeverity=max(iff(UpdateState=~"Needed" and (Optional==false or Classification has "Critical" or Classification has "Security") and Approved!=false, iff(Classification has "Critical", 4, iff(Classification has "Security", 2, 1)), 0)) by SourceComputerId
)
on SourceComputerId
| extend WorstMissingUpdateSeverity=coalesce(WorstMissingUpdateSeverity, -1)
| summarize computersBySeverity=count() by WorstMissingUpdateSeverity
| union (Heartbeat
| where TimeGenerated>ago(12h) and OSType=="Linux" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
| where Solutions has "updates"
| distinct SourceComputerId
| join kind=leftouter
(
    Update
    | where TimeGenerated>ago(5h) and OSType=="Linux"
    | summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification) by SourceComputerId, Product, ProductArch
    | distinct SourceComputerId, Classification, UpdateState
    | summarize WorstMissingUpdateSeverity=max(iff(UpdateState=~"Needed", iff(Classification has "Critical", 4, iff(Classification has "Security", 2, 1)), 0)) by SourceComputerId
)
on SourceComputerId
| extend WorstMissingUpdateSeverity=coalesce(WorstMissingUpdateSeverity, -1)
| summarize computersBySeverity=count() by WorstMissingUpdateSeverity)
| summarize assessedComputersCount=sumif(computersBySeverity, WorstMissingUpdateSeverity>-1), notAssessedComputersCount=sumif(computersBySeverity, WorstMissingUpdateSeverity==-1), computersNeedCriticalUpdatesCount=sumif(computersBySeverity, WorstMissingUpdateSeverity==4), computersNeedSecurityUpdatesCount=sumif(computersBySeverity, WorstMissingUpdateSeverity==2), computersNeedOtherUpdatesCount=sumif(computersBySeverity, WorstMissingUpdateSeverity==1), upToDateComputersCount=sumif(computersBySeverity, WorstMissingUpdateSeverity==0)
| summarize assessedComputersCount=sum(assessedComputersCount), computersNeedCriticalUpdatesCount=sum(computersNeedCriticalUpdatesCount),  computersNeedSecurityUpdatesCount=sum(computersNeedSecurityUpdatesCount), computersNeedOtherUpdatesCount=sum(computersNeedOtherUpdatesCount), upToDateComputersCount=sum(upToDateComputersCount), notAssessedComputersCount=sum(notAssessedComputersCount)
| extend allComputersCount=assessedComputersCount+notAssessedComputersCount
```

#### Missing updates summary

```loganalytics
Update
| where TimeGenerated>ago(5h) and OSType=="Linux" and SourceComputerId in ((Heartbeat
| where TimeGenerated>ago(12h) and OSType=="Linux" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
| where Solutions has "updates"
| distinct SourceComputerId))
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification) by Computer, SourceComputerId, Product, ProductArch
| where UpdateState=~"Needed"
| summarize by Product, ProductArch, Classification
| union (Update
| where TimeGenerated>ago(14h) and OSType!="Linux" and (Optional==false or Classification has "Critical" or Classification has "Security") and SourceComputerId in ((Heartbeat
| where TimeGenerated>ago(12h) and OSType=~"Windows" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
| where Solutions has "updates"
| distinct SourceComputerId))
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, Approved) by Computer, SourceComputerId, UpdateID
| where UpdateState=~"Needed" and Approved!=false
| summarize by UpdateID, Classification )
| summarize allUpdatesCount=count(), criticalUpdatesCount=countif(Classification has "Critical"), securityUpdatesCount=countif(Classification has "Security"), otherUpdatesCount=countif(Classification !has "Critical" and Classification !has "Security")
```

#### Computers list

```loganalytics
Heartbeat
| where TimeGenerated>ago(12h) and OSType=="Linux" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions, Computer, ResourceId, ComputerEnvironment, VMUUID) by SourceComputerId
| where Solutions has "updates"
| extend vmuuId=VMUUID, azureResourceId=ResourceId, osType=1, environment=iff(ComputerEnvironment=~"Azure", 1, 2), scopedToUpdatesSolution=true, lastUpdateAgentSeenTime=""
| join kind=leftouter
(
    Update
    | where TimeGenerated>ago(5h) and OSType=="Linux" and SourceComputerId in ((Heartbeat
    | where TimeGenerated>ago(12h) and OSType=="Linux" and notempty(Computer)
    | summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
    | where Solutions has "updates"
    | distinct SourceComputerId))
    | summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, Product, Computer, ComputerEnvironment) by SourceComputerId, Product, ProductArch
    | summarize Computer=any(Computer), ComputerEnvironment=any(ComputerEnvironment), missingCriticalUpdatesCount=countif(Classification has "Critical" and UpdateState=~"Needed"), missingSecurityUpdatesCount=countif(Classification has "Security" and UpdateState=~"Needed"), missingOtherUpdatesCount=countif(Classification !has "Critical" and Classification !has "Security" and UpdateState=~"Needed"), lastAssessedTime=max(TimeGenerated), lastUpdateAgentSeenTime="" by SourceComputerId
    | extend compliance=iff(missingCriticalUpdatesCount > 0 or missingSecurityUpdatesCount > 0, 2, 1)
    | extend ComplianceOrder=iff(missingCriticalUpdatesCount > 0 or missingSecurityUpdatesCount > 0 or missingOtherUpdatesCount > 0, 1, 3)
)
on SourceComputerId
| project id=SourceComputerId, displayName=Computer, sourceComputerId=SourceComputerId, scopedToUpdatesSolution=true, missingCriticalUpdatesCount=coalesce(missingCriticalUpdatesCount, -1), missingSecurityUpdatesCount=coalesce(missingSecurityUpdatesCount, -1), missingOtherUpdatesCount=coalesce(missingOtherUpdatesCount, -1), compliance=coalesce(compliance, 4), lastAssessedTime, lastUpdateAgentSeenTime, osType=1, environment=iff(ComputerEnvironment=~"Azure", 1, 2), ComplianceOrder=coalesce(ComplianceOrder, 2)
| union(Heartbeat
| where TimeGenerated>ago(12h) and OSType=~"Windows" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions, Computer, ResourceId, ComputerEnvironment, VMUUID) by SourceComputerId
| where Solutions has "updates"
| extend vmuuId=VMUUID, azureResourceId=ResourceId, osType=2, environment=iff(ComputerEnvironment=~"Azure", 1, 2), scopedToUpdatesSolution=true, lastUpdateAgentSeenTime=""
| join kind=leftouter
(
    Update
    | where TimeGenerated>ago(14h) and OSType!="Linux" and SourceComputerId in ((Heartbeat
    | where TimeGenerated>ago(12h) and OSType=~"Windows" and notempty(Computer)
    | summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
    | where Solutions has "updates"
    | distinct SourceComputerId))
    | summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, Title, Optional, Approved, Computer, ComputerEnvironment) by Computer, SourceComputerId, UpdateID
    | summarize Computer=any(Computer), ComputerEnvironment=any(ComputerEnvironment), missingCriticalUpdatesCount=countif(Classification has "Critical" and UpdateState=~"Needed" and Approved!=false), missingSecurityUpdatesCount=countif(Classification has "Security" and UpdateState=~"Needed" and Approved!=false), missingOtherUpdatesCount=countif(Classification !has "Critical" and Classification !has "Security" and UpdateState=~"Needed" and Optional==false and Approved!=false), lastAssessedTime=max(TimeGenerated), lastUpdateAgentSeenTime="" by SourceComputerId
    | extend compliance=iff(missingCriticalUpdatesCount > 0 or missingSecurityUpdatesCount > 0, 2, 1)
    | extend ComplianceOrder=iff(missingCriticalUpdatesCount > 0 or missingSecurityUpdatesCount > 0 or missingOtherUpdatesCount > 0, 1, 3)
)
on SourceComputerId
| project id=SourceComputerId, displayName=Computer, sourceComputerId=SourceComputerId, scopedToUpdatesSolution=true, missingCriticalUpdatesCount=coalesce(missingCriticalUpdatesCount, -1), missingSecurityUpdatesCount=coalesce(missingSecurityUpdatesCount, -1), missingOtherUpdatesCount=coalesce(missingOtherUpdatesCount, -1), compliance=coalesce(compliance, 4), lastAssessedTime, lastUpdateAgentSeenTime, osType=2, environment=iff(ComputerEnvironment=~"Azure", 1, 2), ComplianceOrder=coalesce(ComplianceOrder, 2) )
| order by ComplianceOrder asc, missingCriticalUpdatesCount desc, missingSecurityUpdatesCount desc, missingOtherUpdatesCount desc, displayName asc
| project-away ComplianceOrder
```

#### Missing updates list

```loganalytics
Update
| where TimeGenerated>ago(5h) and OSType=="Linux" and SourceComputerId in ((Heartbeat
| where TimeGenerated>ago(12h) and OSType=="Linux" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
| where Solutions has "updates"
| distinct SourceComputerId))
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, BulletinUrl, BulletinID) by SourceComputerId, Product, ProductArch
| where UpdateState=~"Needed"
| project-away UpdateState, TimeGenerated
| summarize computersCount=dcount(SourceComputerId, 2), ClassificationWeight=max(iff(Classification has "Critical", 4, iff(Classification has "Security", 2, 1))) by id=strcat(Product, "_", ProductArch), displayName=Product, productArch=ProductArch, classification=Classification, InformationId=BulletinID, InformationUrl=tostring(split(BulletinUrl, ";", 0)[0]), osType=1
| union(Update
| where TimeGenerated>ago(14h) and OSType!="Linux" and (Optional==false or Classification has "Critical" or Classification has "Security") and SourceComputerId in ((Heartbeat
| where TimeGenerated>ago(12h) and OSType=~"Windows" and notempty(Computer)
| summarize arg_max(TimeGenerated, Solutions) by SourceComputerId
| where Solutions has "updates"
| distinct SourceComputerId))
| summarize hint.strategy=partitioned arg_max(TimeGenerated, UpdateState, Classification, Title, KBID, PublishedDate, Approved) by Computer, SourceComputerId, UpdateID
| where UpdateState=~"Needed" and Approved!=false
| project-away UpdateState, Approved, TimeGenerated
| summarize computersCount=dcount(SourceComputerId, 2), displayName=any(Title), publishedDate=min(PublishedDate), ClassificationWeight=max(iff(Classification has "Critical", 4, iff(Classification has "Security", 2, 1))) by id=strcat(UpdateID, "_", KBID), classification=Classification, InformationId=strcat("KB", KBID), InformationUrl=iff(isnotempty(KBID), strcat("https://support.microsoft.com/kb/", KBID), ""), osType=2)
| sort by ClassificationWeight desc, computersCount desc, displayName asc
| extend informationLink=(iff(isnotempty(InformationId) and isnotempty(InformationUrl), toobject(strcat('{ "uri": "', InformationUrl, '", "text": "', InformationId, '", "target": "blank" }')), toobject('')))
| project-away ClassificationWeight, InformationId, InformationUrl
```

## Next steps

* For details of Azure Monitor logs, see [Azure Monitor logs](../log-analytics/log-analytics-log-searches.md).
* For help with alerts, see [Configure alerts](automation-tutorial-update-management.md#configure-alerts).
