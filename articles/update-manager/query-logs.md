---
title: Query logs and results from Update Manager
description: This article provides details on how you can review logs and search results from Azure Update Manager by using Azure Resource Graph.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 11/21/2023
ms.topic: conceptual
---

# Overview of query logs in Azure Update Manager

Logs created from operations like update assessments and installations are stored by Azure Update Manager in [Azure Resource Graph](../governance/resource-graph/overview.md). Resource Graph is a service in Azure designed to be the store for Azure service details without any cost or deployment requirements. Update Manager uses Resource Graph to store its results. You can view the update history of the last 30 days from the resources.

This article describes the structure of the logs from Update Manager and how you can use [Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md) to analyze them in support of your reporting, visualizing, and export needs.

## Log structure

Update Manager sends the results of all its operations into Azure Resource Graph as logs, which are available for 30 days. Listed here are the structure of logs being sent to Azure Resource Graph.

### Patch assessment results

The table `patchassessmentresources` includes resources related to machine patch assessment. The following table describes its properties.

| Property | Description |
|----------|-------------|
| `ID` | The Azure Resource Manager ID forwarding the result. It's similar to the [REST API](manage-vms-programmatically.md) path for Guest OS assessment. Typically, `<resourcePath>/patchAssessmentResults/latest` or `<resourcePath>/patchAssessmentResults/latest/softwarePatches/<update>`. |
| `NAME` | If the ID is of type `<resourcePath>/patchAssessmentResults/latest`, then the record contains the unique GUID for the assessment operation finished. If `<resourcePath>/patchAssessmentResults/latest/softwarePatches/<update>`, then the record contains the update name or label. |
| `TYPE` |Specifies the type of log for assessment. If the type is `patchassessmentresults`, then the record provides a summary of OS assessment with numerical aggregate statistics. If the type is `patchassessmentresults/softwarepatches`, then the record describes a specific OS update available for the resource. |
| `TENANTID` | Azure tenant ID for the Azure VM or Azure Arc-enabled server resource.|
| `KIND`	| Intentionally left blank for future use. |
| `LOCATION` | Azure cloud region where the Azure VM or Azure Arc-enabled server resource exists.|
| `RESOURCEGROUP` | Azure resource group hosting the Azure VM or Azure Arc-enabled server resource.|
| `SUBSCRIPTIONID` | Azure subscription ID for the Azure VM or Azure Arc-enabled server resource. |
| `MANAGEDBY` | Intentionally left blank for future use. |
| `SKU` | Intentionally left blank for future use. |
| `PLAN` | Intentionally left blank for future use. |
| `PROPERTIES` | Captures details of operation in JSON format. More information follows this table.|
| `TAGS` | Azure tags defined for the Azure VM or Azure Arc-enabled servers resource. |
| `IDENTITY` | Intentionally left blank for future use. |
| `ZONES` | Intentionally left blank for future use. |
| `EXTENDEDLOCATION` | Intentionally left blank for future use. |

### Description of the patchassessmentresources property

If the property for the resource type is `patchassessmentresources`, it includes the information in the following table.

|Value |Description |
|------|------------|
| `rebootPending` |Flag to specify if the specific update requires the OS to reboot to finish installation. As provided by machine's OS update service or package manager. If your OS package manager or update service doesn't require a reboot, the value of the field is set to `false`.|
|`patchServiceUsed` |OS service used on the machine to install updates. `WU-WSUS` for Windows Update service or Windows Server Update Service. For Linux, it's the OS package manager like `YUM`, `APT`, or `Zypper`.|
|`osType` |Represents the type of operating system: `Windows` or `Linux`.|
|`startDateTime` |Timestamp (UTC) representing when the OS update assessment task started execution on the machine.|
|`lastModifiedDateTime` |Timestamp (UTC) representing when the record was last updated.|
|`startedBy` |Identifies if a user or an Azure service triggered the OS update installation. For more information on the operation, see [Azure activity log](/azure/azure-resource-manager/management/view-activity-logs).|
|`errorDetails` |First five error messages generated while executing update installation from the machine's OS package manager or update service.|
|`availablePatchCountByClassification` |Number of OS updates by the category that the specific updates belong to based on the OS vendor. The machine's OS update service or package manager generates the information. If the OS package manager or update service doesn't provide the detail of category, the value is `Others` (for Linux) or `Updates` (for Windows Server).|
|

If the property for the resource type is `patchassessmentresults/softwarepatches`, it includes the information in the following table.

|Value |Description |
|------|------------|
|`lastModifiedDateTime` |Timestamp (UTC) representing when the record was last updated.|
|`publishedDateTime` |Timestamp representing when the specific update was made available by the OS vendor. The machine's OS update service or package manager generates the information. If your OS package manager or update service doesn't provide the detail of when an update was provided by OS vendor, the value is null.|
|`classifications` |Category that the specific update belongs to according to the OS vendor. The machine's OS update service or package manager generates the information. If your OS package manager or update service doesn't provide the detail of category, the value is `Others` (for Linux) or `Updates` (for Windows Server). |
|`rebootRequired` |Value indicates if the specific update requires the OS to reboot to finish the installation. The machine's OS update service or package manager generates the information. If your OS package manager or update service doesn't require a reboot, the value is `false`.|
|`rebootBehavior` |Behavior set in the OS update installation runs the job when configuring the update deployment if Update Manager can reboot the target machine. |
|`patchName` |Name or label for the specific update generated by the machine's OS package manager or update service.|
|`Kbid` |If the machine's OS is Windows Server, the value includes the unique KB ID for the update provided by the Windows Update service.|
|`version` |If the machine's OS is Linux, the value includes the version details for the update as provided by the Linux package manager. For example, `1.0.1.el7.3`.|

### Patch installation results

The table `patchinstallationresources` includes resources related to machine patch assessment. The following table describes its properties.

| Property | Description |
|----------|-------------|
| `ID` | The Azure Resource Manager ID forwarding the result. It's similar to the [REST API](manage-vms-programmatically.md) path for Guest OS assessment. Typically, `<resourcePath>/patchInstallationResults/<GUID>` or `<resourcePath>/patchAssessmentResults/latest/softwarePatches/<update>`. |
| `NAME` | If the ID is of type `<resourcePath>/patchInstallationResults`, then the record contains unique GUID for the update operation finished. If `<resourcePath>/patchInstallationResults/softwarePatches/<update>`, then the record contains the update name or label being installed on the machine. |
| `TYPE` |Specifies the type of log for assessment. If type is `patchinstallationresults`, then the record provides a summary of OS installation with numerical aggregate statistics. If type is `patchinstallationresults/softwarepatches`, then the record describes a specific OS update installed for the resource. |
| `TENANTID` | Azure tenant ID for the Azure VM or Azure Arc-enabled server resource. |
| `KIND`	| Intentionally left blank for future use. |
| `LOCATION` | Azure cloud region where the Azure VM or Azure Arc-enabled server resource exists.|
| `RESOURCEGROUP` | Azure resource group hosting the Azure VM or Azure Arc-enabled server resource.|
| `SUBSCRIPTIONID` | Azure subscription ID for the Azure VM or Azure Arc-enabled server resource.|
| `MANAGEDBY` | Intentionally left blank for future use. |
| `SKU` | Intentionally left blank for future use. |
| `PLAN` | Intentionally left blank for future use. |
| `PROPERTIES` | Captures details of operation in JSON format. More information follows this table.|
| `TAGS` | Azure tags defined for the Azure VM or Azure Arc-enabled servers resource.	|
| `IDENTITY` | Intentionally left blank for future use. |
| `ZONES` | Intentionally left blank for future use. |
| `EXTENDEDLOCATION` | Intentionally left blank for future use. |

### Description of the patchinstallationresults property

If the property for the resource type is `patchinstallationresults`, it includes the information in the following table.

|Value |Description |
|------|------------|
|`installationActivityId` | Unique GUID for the OS update installation run. |
|`maintenanceWindowExceeded` | Values are `True` or `False` if the update installation run exceeded the defined maintenance window. |
|`lastModifiedDateTime` |Timestamp (UTC) representing when the record was last updated. |
|`notSelectedPatchCount` |Number of OS updates available on the machine not selected for installation in an update deployment. |
|`installedPatchCount` |Number of OS updates that were successfully installed that were specified in an update deployment. |
|`excludedPatchCount` |Number of OS updates available on the machine and excluded for installation in an update deployment.|
|`pendingPatchCount` |Number of OS updates still awaiting to be installed that were specified in an update deployment. |
|`patchServiceUsed` |OS service used on the machine to install updates. `WU-WSUS` for Windows Update service or Windows Server Update Service. For Linux, it's the OS package manager like `YUM`, `APT`, or `Zypper`. |
|`failedPatchCount` |Number of OS updates that failed to successfully get installed that were specified in an update deployment. |
|`startDateTime` |Timestamp (UTC) representing when the OS update installation task started execution on the machine. |
|`rebootStatus` |Information from the OS update service or package manager if the OS needs to be restarted to finish the update installation. Status values are `NotNeeded` (no restart is needed), `Required` (OS restart is needed for completion), `Started` (restart was initiated), `Failed` (OS couldn't be restarted), and `Completed` (restart was done successfully). |
|`startedBy` |Identifies if a user or an Azure service triggered the OS update installation. For more information on the operation, see [Azure activity log](/azure/azure-resource-manager/management/view-activity-logs). |
|`status` |Status of the OS update installation run. Values can be `NotStarted`, `InProgress`, `Failed`, `Succeeded`, and `CompletedWithWarnings`. The update installation run is deemed `Failed` status if one or more OS update installations is unsuccessful. |
|`osType` |Represents the type of operating system: `Windows` or `Linux`. |
|`errorDetails` |Includes the first five error messages generated while running update installation from the machine's OS package manager or update service. |
|`maintenanceRunId` | This value is used as a maintenance run identifier for Auto VM Guest Patching or schedule run ID instead of recurring updates. |

If the property for the resource type is `patchinstallationresults/softwarepatches`, it includes the information in the following table.

|Value |Description |
|------|------------|
|`installationState` |Installation status for the specific OS update. Values are `Installed`, `Failed`, `Pending`, `NotSelected`, and `Excluded`. |
|`lastModifiedDateTime` |Timestamp (UTC) representing when the record was last updated. |
|`publishedDateTime` |Timestamp representing when the specific update was made available by the OS vendor. The machine's OS update service or package manager generates the information. If your OS package manager or update service doesn't provide the detail of when an update was provided by the OS vendor, the value is null. |
|`classifications` |Category that the specific update belongs to according to the OS vendor as provided by the machine's OS update service or package manager. If your OS package manager or update service doesn't provide the detail of category, the value of the field is `Others` (for Linux) and `Updates` (for Windows Server). |
|`rebootRequired` |Flag to specify if the specific update requires the OS to reboot to finish the installation, as provided by the machine's OS update service or package manager. If your OS package manager or update service doesn't provide information regarding need of OS reboot, the value of the field is set to `false`. |
|`rebootBehavior` |Behavior set in the OS update installation runs the job by user, regarding allowing Update Manager to reboot the OS. |
|`patchName` |Name or label for the specific update as provided by the machine's OS package manager or update service. |
|`Kbid` |If the machine's OS is Windows Server, the value includes the unique KB ID for the update provided by the Windows Update service. |
|`version` |If the machine's OS is Linux, the value includes the version details for the update as provided by the Linux package manager. For example, `1.0.1.el7.3`. |

### Maintenance resources

The table `maintenanceresources` includes resources related to maintenance configuration. The following table describes its properties.

| Property | Description |
|----------|-------------|
| `ID` | The Azure Resource Manager ID forwarding the result. It's similar to the [REST API](manage-vms-programmatically.md) path for creating a maintenance configuration. |
| `NAME` | If the ID is of type `<resourcePath>/applyupdates`, then the record contains a unique GUID for the maintenance run. If `<resourcePath>/configurationassignments`, then the record contains the assignment of maintenance configuration to an Azure or Azure Arc VM. |
| `TYPE` |Specifies the type of log for assessment. If type is `applyupdates`, then the record provides details of the maintenance run record at machine level. If type is `configurationassignments`, then the record describes the link between an Azure VM or Azure Arc VM and a maintenance configuration. |
| `TENANTID` | Azure tenant ID for the Azure VM or Azure Arc-enabled server resource. |	
| `KIND`	| Intentionally left blank for future use. |
| `LOCATION` | Pure cloud region where the Azure VM or Azure Arc-enabled server resource exists.|
| `RESOURCEGROUP` | Azure resource group hosting the Azure VM or Azure Arc-enabled server resource.|
| `SUBSCRIPTIONID` | Azure subscription ID for the Azure VM or Azure Arc-enabled server resource.|
| `MANAGEDBY` | Intentionally left blank for future use. |
| `SKU` | Intentionally left blank for future use. |
| `PLAN` | Intentionally left blank for future use. |
| `PROPERTIES` | Captures details of operation in JSON format. More information follows this table.|
| `TAGS` | Azure tags defined for the Azure VM or Azure Arc-enabled servers resource.	|
| `IDENTITY` | Intentionally left blank for future use. |
| `ZONES` | Intentionally left blank for future use. |
| `EXTENDEDLOCATION` | Intentionally left blank for future use. |

### Description of the applyupdates property

If the property for the resource type is `applyupdates`, it includes the information in the following table.

|Value |Description |
|------|------------|
|`maintenanceConfigurationId` | Azure Resource Manager ID of applied maintenance configuration. |
|`maintenanceScope` | Maintenance scope of applied maintenance configuration. |
|`resourceId` | Azure Resource Manager template resource ID of ARC/Azure VM. |
|`correlationId` | Schedule run ID of maintenance/schedule run. This information can be used to find all the VMs that were part of the same schedule. |
|`startDateTime` | Start date and time of a schedule. |
|`endDateTime` | End date and time of a schedule. |

If the property for the resource type is `configurationassignments`, it includes the information in the following table.

|Value |Description |
|------|------------|
|`resourceId` | Azure Resource Manager resource ID of ARC/Azure VM |
|`maintenanceConfigurationId` | Azure Resource Manager ID of the applied maintenance configuration |

## Next steps

- For details of sample queries, see [Sample query logs](sample-query-logs.md).
- To troubleshoot issues, see [Troubleshoot Update Manager](troubleshoot.md).
