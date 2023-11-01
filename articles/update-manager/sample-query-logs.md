---
title: Sample query logs and results from Azure Update Manager
description: The article provides details of sample query logs from Azure Update Manager in Azure using Azure Resource Graph
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 09/18/2023
ms.topic: conceptual
---

# Sample queries

The following are some sample queries to help you get started querying the update assessment and deployment information collected from your managed machines. For more information on logs created from operations such as update assessments and installations, see [overview of query logs](query-logs.md).
 
## List available updates for all your machines grouped by update category

The following query returns a list of pending updates for your machine with the time when the assessment was performed, the resource ID for the assessment, OS type on the machine, and the OS updates available based on update classification.

```kusto
patchassessmentresources
| where type !has "softwarepatches"
| extend prop = parse_json(properties)
| extend lastTime = properties.lastModifiedDateTime
| extend updateRollupCount = prop.availablePatchCountByClassification.updateRollup, featurePackCount = prop.availablePatchCountByClassification.featurePack, servicePackCount = prop.availablePatchCountByClassification.servicePack, definitionCount = prop.availablePatchCountByClassification.definition, securityCount = prop.availablePatchCountByClassification.security, criticalCount = prop.availablePatchCountByClassification.critical, updatesCount = prop.availablePatchCountByClassification.updates, toolsCount = prop.availablePatchCountByClassification.tools, otherCount = prop.availablePatchCountByClassification.other, OS = prop.osType
| project lastTime, id, OS, updateRollupCount, featurePackCount, servicePackCount, definitionCount, securityCount, criticalCount, updatesCount, toolsCount, otherCount
```

## Count of update installations 

The following query returns a list of update installations with their status for your machines from the last seven days. Results include the time when the update deployment was run, the resource ID of the installation, machine details, and the count of OS updates installed based on their status and your selection.

```kusto
patchinstallationresources
| where type !has "softwarepatches"
| extend machineName = tostring(split(id, "/", 8)), resourceType = tostring(split(type, "/", 0)), tostring(rgName = split(id, "/", 4))
| extend prop = parse_json(properties)
| extend lTime = todatetime(prop.lastModifiedDateTime), OS = tostring(prop.osType), installedPatchCount = tostring(prop.installedPatchCount), failedPatchCount = tostring(prop.failedPatchCount), pendingPatchCount = tostring(prop.pendingPatchCount), excludedPatchCount = tostring(prop.excludedPatchCount), notSelectedPatchCount = tostring(prop.notSelectedPatchCount)
| where lTime > ago(7d)
| project lTime, RunID=name,machineName, rgName, resourceType, OS, installedPatchCount, failedPatchCount, pendingPatchCount, excludedPatchCount, notSelectedPatchCount
```

## List of Windows Server OS update installations 

The following query returns a list of update installations for Windows Server with their status for your machines from the last seven days. Results include the time when the update deployment was run, the resource ID of the installation, machine details, and other related deployment details.

```kusto
patchinstallationresources
| where type has "softwarepatches" and properties !has "version"
| extend machineName = tostring(split(id, "/", 8)), resourceType = tostring(split(type, "/", 0)), tostring(rgName = split(id, "/", 4)), tostring(RunID = split(id, "/", 10))
| extend prop = parse_json(properties)
| extend lTime = todatetime(prop.lastModifiedDateTime), patchName = tostring(prop.patchName), kbId = tostring(prop.kbId), installationState = tostring(prop.installationState), classifications = tostring(prop.classifications)
| where lTime > ago(7d)
| project lTime, RunID, machineName, rgName, resourceType, patchName, kbId, classifications, installationState
| sort by RunID
```

## List of Linux OS update installations

The following query returns a list of update installations for Linux with their status for your machines from the last seven days. Results include the time when the update deployment was run, the resource ID of the installation, machine details, and other related deployment details.

```kusto
patchinstallationresources
| where type has "softwarepatches" and properties has "version"
| extend machineName = tostring(split(id, "/", 8)), resourceType = tostring(split(type, "/", 0)), tostring(rgName = split(id, "/", 4)), tostring(RunID = split(id, "/", 10))
| extend prop = parse_json(properties)
| extend lTime = todatetime(prop.lastModifiedDateTime), patchName = tostring(prop.patchName), version = tostring(prop.version), installationState = tostring(prop.installationState), classifications = tostring(prop.classifications)
| where lTime > ago(7d)
| project lTime, RunID, machineName, rgName, resourceType, patchName, version, classifications, installationState
| sort by RunID
```

## List of maintenance run record at VM level
The following query returns a list of all the maintenance run records for a VM

```kusto
maintenanceresources 
| where ['id'] contains "/subscriptions/<subscription-id>/resourcegroups/<resource-group>/providers/microsoft.compute/virtualmachines/<vm-name>" //VM Id here
| where ['type'] == "microsoft.maintenance/applyupdates" 
| where properties.maintenanceScope == "InGuestPatch"
```

## Next steps
- Review logs and search results from Update Manager in Azure using [Azure Resource Graph](query-logs.md).
- Troubleshoot issues in Update Manager, see the [Troubleshoot](troubleshoot.md).
