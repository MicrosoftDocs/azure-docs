---
title: Query logs and results from Update management center (preview)
description: The article provides details on how you can review logs and search results from update management center (preview) in Azure using Azure Resource Graph
ms.service: update-management-center
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 04/21/2022
ms.topic: conceptual
---

# Overview of query logs in update management center (Preview)

Logs created from operations like update assessments and installations are stored by Update management center (preview) in an [Azure Resource Graph](../governance/resource-graph/overview.md). The Azure Resource Graph is a service in Azure designed to be the store for Azure service details without any cost or deployment requirements. Update management center (preview) uses the Azure Resource Graph to store its results, and you can view the update history of the last 30 days from the resources.

Azure Resource Graph's query language is based on the [Kusto query language](../governance/resource-graph/concepts/query-language.md) used by Azure Data Explorer. 

The article describes the structure of the logs from Update management center (Preview) and how you can use [Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md) to analyze them in support of your reporting, visualizing, and export needs.

## Log structure

Update management center (preview) sends the results of all its operation into Azure Resource Graph as logs, which are available for 30 days. Listed below are the structure of logs being sent to Azure Resource Graph.

### Patch assessment results

The table `patchassessmentresources` includes resources related to machine patch assessment. The following table describes its properties. 

| Property | Description |
|----------|-------------|
| `ID` | The Azure Resource Manager ID forwarding the result. It will be the similar to the [REST API](manage-vms-programmatically.md) path for Guest OS assessment. Typically, *`<resourcePath>/patchAssessmentResults/latest`* or *`<resourcePath>/patchAssessmentResults/latest/softwarePatches/<update>`* |
| `NAME` | If the ID is of type *`<resourcePath>/patchAssessmentResults/latest`* - then the record contains unique GUID for the assessment operation completed. If *`<resourcePath>/patchAssessmentResults/latest/softwarePatches/<update>`* - then the record contains update name or label. |
| `TYPE` |Specifies the type of log for assessment. If type is `patchassessmentresults` , then the record provides a summary of OS assessment with numerical aggregate statistics. If type is `patchassessmentresults/softwarepatches`, then the record describes a specific OS update available for the resource. |
| `TENANTID` | Azure tenant ID for the Azure VM or Azure Arc-enabled server resource|	
| `KIND`	| Intentionally left blank for future use. |
| `LOCATION` | Azure cloud region where the Azure VM or Azure Arc-enabled server resource exists|
| `RESOURCEGROUP` | Azure resource group hosting the Azure VM or Azure Arc-enabled server resource|
| `SUBSCRIPTIONID` | Azure subscription ID for the Azure VM or Azure Arc-enabled server resource |
| `MANAGEDBY` |  Intentionally left blank for future use. |
| `SKU` |  Intentionally left blank for future use. |
| `PLAN` |	Intentionally left blank for future use. |
| `PROPERTIES` | Captures details of operation in JSON format. Additional information follows this table.|
| `TAGS` | Azure tags defined for the Azure VM or Azure Arc-enabled server(s) resource |
| `IDENTITY` |	Intentionally left blank for future use. |
| `ZONES` | Intentionally left blank for future use. |
| `EXTENDEDLOCATION` | Intentionally left blank for future use. |


### Description of the **PROPERTIES** property 

If the `PROPERTIES` property for the resource type is `patchassessmentresources`, it includes the following information: 

|Value |Description |
|------|------------|
| `rebootPending` |Flag to specify if the specific update requires the OS to reboot to complete installation. As provided by machine's OS update service or package manager. If your OS package manager or update service doesn't require a reboot, the value of the field is set to `false`.|
|`patchServiceUsed` |OS service used on the machine to install updates. `WU-WSUS` for Windows Update service and/or Windows Server Update Service. For Linux, it's the OS package manager like `YUM`, `APT`, or `Zypper`.|
|`osType` |Represents the type of operating system `Windows` or `Linux`.|
|`startDateTime` |Timestamp (UTC) representing when the OS update assessment task started execution on the machine.|
|`lastModifiedDateTime` |Timestamp (UTC) representing when the record was last updated.|
|`startedBy` |Identifies if the OS update installation run was triggered by a user or Azure service. Further details of the operation can be found in [Azure Activity Log](/azure/azure-resource-manager/management/view-activity-logs).|
|`errorDetails` |First five error messages generated while executing update installation from the machine's OS package manager or update service.|
|`availablePatchCountByClassification` |Number of OS updates by the category that the specific updates belong based on the OS vendor. Information is generated by the machine's OS update service or package manager. If the OS package manager or update service, doesn't provide the detail of category, then the value is `Others` (for Linux) or `Updates` (for Windows Server).|
|

If the `PROPERTIES` property for the resource type is `patchassessmentresults/softwarepatches`, it includes the following information: 

|Value |Description |
|------|------------|
|`lastModifiedDateTime` |Timestamp (UTC) representing when the record was last updated.|
|`publishedDateTime` |Timestamp representing when the specific update was made available by the OS vendor. Information is generated by the machine's OS update service or package manager. If your OS package manager or update service doesn't provide the detail of when an update was provided by OS vendor, then the value is null.|
|`classifications` |Category of which the specific update belongs to as per the OS vendor. Information is generated by the machine's OS update service or package manager. If your OS package manager or update service doesn't provide the detail of category, then the value  is `Others` (for Linux) or `Updates` (for Windows Server). |
|`rebootRequired` |Value indicates if the specific update requires the OS to reboot to complete the installation. Information is generated by the machine's OS update service or package manager. If your OS package manager or update service doesn't require a reboot, then the value is `false`.|
|`rebootBehavior` |Behavior set in the OS update installation runs job when configuring the update deployment if update management center (preview) can reboot the target machine. |
|`patchName` |Name or label for the specific update generated by the machine's OS package manager or update service.|
|`Kbid` |If the machine's OS is Windows Server, the value includes the unique KB ID for the update provided by the Windows Update service.|
|`version` |If the machine's OS is Linux, the value includes the version details for the update as provided by Linux package manager. For example, `1.0.1.el7.3`.|

### Patch installation results

The table `patchinstallationresources` includes resources related to machine patch assessment. The following table describes its properties. 

| Property | Description |
|----------|-------------|
| `ID` | The Azure Resource Manager ID forwarding the result. It will be the similar to the [REST API](manage-vms-programmatically.md) path for Guest OS assessment. Typically, *`<resourcePath>/patchInstallationResults/<GUID>`* or *`<resourcePath>/patchAssessmentResults/latest/softwarePatches/<update>`* |
| `NAME` | If the ID is of type *`<resourcePath>/patchInstallationResults`* - then the record contains unique GUID for the update operation completed. If *`<resourcePath>/patchInstallationResults/softwarePatches/<update>`* - then the record contains update name or label being installed on the machine. |
| `TYPE` |Specifies the type of log for assessment. If type is `patchinstallationresults` , then the record provides a summary of OS installation with numerical aggregate statistics. If type is `patchinstallationresults/softwarepatches`, then the record describes a specific OS update installed for the resource. |
| `TENANTID` | Azure tenant ID for the Azure VM or Azure Arc-enabled server resource |	
| `KIND`	| Intentionally left blank for future use. |
| `LOCATION` | Azure cloud region where the Azure VM or Azure Arc-enabled server resource exists|
| `RESOURCEGROUP` | Azure resource group hosting the Azure VM or Azure Arc-enabled server resource|
| `SUBSCRIPTIONID` | Azure subscription ID for the Azure VM or Azure Arc-enabled server resource|
| `MANAGEDBY` |  Intentionally left blank for future use. |
| `SKU` |  Intentionally left blank for future use. |
| `PLAN` |	Intentionally left blank for future use. |
| `PROPERTIES` | Captures details of operation in JSON format. Additional information follows this table.|
| `TAGS` | Azure tags defined for the Azure VM or Azure Arc-enabled server(s) resource	|
| `IDENTITY` |	Intentionally left blank for future use. |
| `ZONES` | Intentionally left blank for future use. |
| `EXTENDEDLOCATION` | Intentionally left blank for future use. |

### Description of the **PROPERTIES** property 

If the `PROPERTIES` property for the resource type is `patchinstallationresults`, it includes the following information: 

|Value |Description |
|------|------------|
|`installationActivityId` | Unique GUID for the OS update installation run. |
|`maintenanceWindowExceeded` | Values are `True` or `False` if the update installation run exceeded the defined maintenance window. |
|`lastModifiedDateTime` |Timestamp (UTC) representing when the record was last updated |
|`notSelectedPatchCount` |Number of OS updates available on the machine not selected for installation in an update deployment. |
|`installedPatchCount` |Number of OS updates that were successfully installed that were specified in an update deployment. |
|`excludedPatchCount` |Number of OS updates available on the machine and excluded for installation in an update deployment.|
|`pendingPatchCount` |Number of OS updates still awaiting to be installed that were specified in an update deployment. |
|`patchServiceUsed` |OS service used on the machine to install updates. `WU-WSUS` for Windows Update service and/or Windows Server Update Service. For Linux, it's the OS package manager like `YUM`, `APT`, or `Zypper`. |
|`failedPatchCount` |Number of OS updates that failed to successfully get installed that were specified in an update deployment. |
|`startDateTime` |Timestamp (UTC) representing when the OS update installation task started execution on the machine. |
|`rebootStatus` |Information from the OS update service or package manager, if the OS needs to be restarted to complete the update installation. Status values are `NotNeeded` (No restart is needed), `Required` (OS restart is needed for completion), `Started` (Restart was initiated), `Failed` (OS couldn't be restarted), and `Completed` (Restart was done successfully). |
|`startedBy` |Identifies if the OS update installation run was triggered by a user or an Azure service. Further details of the operation can be found in [Azure Activity Log](/azure/azure-resource-manager/management/view-activity-logs). |
|`status` |Status of the OS update installation run. Values can be - NotStarted, InProgress, Failed, Succeeded and CompletedWithWarnings. The update installation run is deemed 'Failed' status, if one or more OS update installations is unsuccessful. |
|`osType` |Represents the type of operating system `Windows` or `Linux`. |
|`errorDetails` |Includes the first five error messages generated while executing update installation from the machine's OS package manager or update service. |
|`maintenanceRunId ` | This value is used as a maintenance run identifier for Auto VM Guest Patching or schedule run Id instead of recurring updates |

If the `PROPERTIES` property for the resource type is `patchinstallationresults/softwarepatches`, it includes the following information: 

|Value |Description |
|------|------------|
|`installationState` |Installation status for the specific OS update. Values are `Installed`, `Failed`, `Pending`, `NotSelected`, and `Excluded`. |
|`lastModifiedDateTime` |Timestamp (UTC) representing when the record was last updated. |
|`publishedDateTime` |Timestamp representing when the specific update was made available by the OS vendor. Information is generated by the machine's OS update service or package manager. If your OS package manager or update service doesn't provide the detail of when an update was provided by OS vendor, then the value is null. |
|`classifications` |Category that the specific update belongs to as per the OS vendor.  As provided by machine's OS update service or package manager. If your OS package manager or update service, doesn't provide the detail of category, then the value of the field will be Others (for Linux) and Updates (for Windows Server). |
|`rebootRequired` |Flag to specify if the specific update requires the OS to reboot to complete installation. As provided by machine's OS update service or package manager. If your OS package manager or update service doesn't provide information regarding need of OS reboot, then the value of the field will be set to 'false'. |
|`rebootBehavior` |Behavior set in the OS update installation runs job by user, regarding allowing update management center (preview) to reboot the OS. |
|`patchName` |Name or Label for the specific update as provided by the machine's OS package manager or update service. |
|`Kbid` |If the machine's OS is Windows Server, the value includes the unique KB ID for the update provided by the Windows Update service. |
|`version` |If the machine's OS is Linux, the value includes the version details for the update as provided by Linux package manager. For example, `1.0.1.el7.3`. |

### Maintenance resources

The table `maintenanceresources` includes resources related to maintenance configuration. The following table describes its properties. 

| Property | Description |
|----------|-------------|
| `ID` | The Azure Resource Manager ID forwarding the result. It is similar to the [REST API](manage-vms-programmatically.md) path for create a maintenance configuration. |
| `NAME` | If the ID is of type *`<resourcePath>/applyupdates`* - then the record contains a unique GUID for the maintenance run. If *`<resourcePath>/configurationassignments`* - then the record contains the assignment of maintenance configuration to an Azure or Arc VM. |
| `TYPE` |Specifies the type of log for assessment. If type is `applyupdates` , then the record provides details of maintenance run record at machine level. If type is `configurationassignments`, then the record describes the link between Azure or Arc VM and a maintenance configuration. |
| `TENANTID` | Azure tenant ID for the Azure VM or Azure Arc-enabled server resource |	
| `KIND`	| Intentionally left blank for future use. |
| `LOCATION` | Pure cloud region where the Azure VM or Azure Arc-enabled server resource exists|
| `RESOURCEGROUP` | Azure resource group hosting the Azure VM or Azure Arc-enabled server resource|
| `SUBSCRIPTIONID` | Azure subscription ID for the Azure VM or Azure Arc-enabled server resource|
| `MANAGEDBY` |  Intentionally left blank for future use. |
| `SKU` |  Intentionally left blank for future use. |
| `PLAN` |	Intentionally left blank for future use. |
| `PROPERTIES` | Captures details of operation in JSON format. Additional information follows this table.|
| `TAGS` | Azure tags defined for the Azure VM or Azure Arc-enabled servers resource	|
| `IDENTITY` |	Intentionally left blank for future use. |
| `ZONES` | Intentionally left blank for future use. |
| `EXTENDEDLOCATION` | Intentionally left blank for future use. |

### Description of the **PROPERTIES** property 

If the `PROPERTIES` property for the resource type is `applyupdates`, it includes the following information: 

|Value |Description |
|------|------------|
|`maintenanceConfigurationId` | Azure Resource Manager (ARM) ID of applied maintenance configuration |
|`maintenanceScope` | Maintenance scope of applied maintenance configuration |
|`resourceId` | ARM template resource Id of ARC/Azure VM |
|`correlationId` | Schedule run Id of maintenance/schedule run. This can be used to find all the VMs that were part of the same schedule. |
|`startDateTime` | Start date and time of a schedule |
|`endDateTime` | End date and time of a schedule |

If the `PROPERTIES` property for the resource type is `configurationassignments`, it includes the following information: 

|Value |Description |
|------|------------|
|`resourceId` | ARM resource Id of ARC/Azure VM |
|`maintenanceConfigurationId` | ARM ID of the applied maintenance configuration |



## Next steps
- For details of sample queries, see [Sample query logs](sample-query-logs.md).
- To troubleshoot issues, see [Troubleshoot](troubleshoot.md) update management center (preview).