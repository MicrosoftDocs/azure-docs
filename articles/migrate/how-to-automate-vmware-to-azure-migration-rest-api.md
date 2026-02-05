---
title: Automate VMware to Azure migration (simplified) using Azure Site Recovery REST API
description: Learn how to automate VMware virtual machine migration to Azure using Azure Site Recovery REST API with the InMageRcm replication provider.
author: Microsoft
ms.service: azure-migrate
ms.topic: how-to
ms.date: 2024-01-15
ms.author: Microsoft
---

# Automate VMware to Azure agent-based migration (simplified) using Azure Site Recovery REST API

This article describes how to automate agent-based virtual machine migration to Azure using the Azure Site Recovery REST API. You can use these APIs to build custom automation solutions for large-scale migrations using the **InMageRcm** replication provider.

## Prerequisites

Before you begin, ensure you have:

- An Azure subscription with the required permissions to create and manage Azure Migrate resources.
- A Migrate project configured for agent-based migration.
- A replication appliance deployed and registered with the vault.
- VMware or physical virtual machines discovered by the appliance.
- An enable replication already done from Azure Portal to create the first set of resources needed for replication.

## Gathering Required Resource IDs

Before calling the APIs, you need to gather several resource identifiers. This section explains how to obtain each one.

### Get the Azure Site Recovery Vault Id

Go to the Azure Portal, navigate to your **Migrate project ->Execute ->Migrations ->Replications summary ->Properties**, and copy its vault ID from the **Linked Recovery Services vaults** section with **Replication type** set to "Other". Alternatively, it's available via the resource group where migrate project is created. The resource ID format is:

```
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{migrateProjectName-MigrateVault-numbers}
```

### Get the Process server Id and Site Ids

The `processServerId` is the machine ID of the replication appliance that handles VM replication. To retrieve it:

**Step 1: List the Fabrics**
```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/replicationFabrics?api-version=2025-08-01
```
Pick fabric with `properties.customDetails.instanceType` equal to `InMageRcm`.
**Sample Response (Fabrics List)**
```json
{
  "value": [
    {
      "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/replicationFabrics/{fabricName}",
      "name": "{fabricName}",
      "type": "Microsoft.RecoveryServices/vaults/replicationFabrics",
      "properties": {
        "friendlyName": "InMageRcmFabric",
        "customDetails": {
          "instanceType": "InMageRcm"
        }
      }
    }
  ]
}
```

**Step 2: Query the Fabric Details**

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/replicationFabrics/{fabricName}?api-version=2025-08-01
```

In the response, the process server ID is found in `properties.customDetails.processServers[].id`.
The site information is present in `properties.customDetails.vmwareSiteId` and `properties.customDetails.physicalSiteId`.

**Sample Response (Fabric Details)**

```json
{
  "properties": {
    "customDetails": {
      "instanceType": "InMageRcm",
      "vmwareSiteId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OffAzure/VMwareSites/{siteName}",
      "physicalSiteId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OffAzure/ServerSites/{siteName}",
      "processServers": [
        {
          "id": "12345678-1234-1234-1234-123456789012",
          "name": "yourappliancename",
          "biosId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "fqdn": "yourappliancename.domain.com",
          "health": "Normal",
          "healthErrors": []
        }
      ]
    }
  }
}
```

Use the `id` value from the process server entry as your `processServerId` that corresponds to the replication appliance from where the machine is discovered.

### Get the Fabric Discovery Machine ID

The `fabricDiscoveryMachineId` is the ARM ID of the discovered VM from Azure Migrate. To find it:

```http
(for VMware VMs) GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OffAzure/VMwareSites/{siteName}/machines?api-version=2023-06-06
(for physical machines) GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OffAzure//ServerSites/{siteName}/machines?api-version=2023-06-06
```

The response contains a list of discovered machines with their full ARM IDs. The content will have machine friendly name to identify a particular VM.

### Get the Run-As Account ID (Optional)

Since you need to specify credentials for mobility agent push installation:

```http
(for VMware VMs) GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OffAzure/VMwareSites/{siteName}/runasaccounts?api-version=2023-06-06
```
For physical machines, use runasaccounts from `properties.runAsAccountId` from machine details.

## Overview

The migration workflow using Azure Site Recovery REST API consists of the following steps:

1. **Enable replication** - Start replicating VMware VMs to Azure
2. **Update replication settings** - Modify target VM properties as needed
3. **Test migration** - Validate the migration without impacting production
4. **Perform migration** - Execute the actual migration (failover) to Azure

## Authentication

All REST API calls require authentication using Azure Active Directory (Azure AD). Obtain a bearer token using the following methods:

- Azure CLI: `az account get-access-token`
- Azure PowerShell: `Get-AzAccessToken`
- Azure SDK authentication libraries

Include the token in the `Authorization` header:

```http
Authorization: Bearer <access-token>
```

Alternatively you can use armclient or Invoke-AzRestMethod in PowerShell.

## API version

This documentation uses the **2025-08-01** API version for Azure Site Recovery resource provider. Specify this in the `api-version` query parameter for all requests.

## Step 1: Enable replication

To start replicating a VM to Azure, use the [Create Replication Protected Item](https://learn.microsoft.com/en-us/rest/api/site-recovery/replication-protected-items/create?view=rest-site-recovery-2025-08-01&tabs=HTTP) API.

### Request

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/replicationFabrics/{fabricName}/replicationProtectionContainers/{protectionContainerName}/replicationProtectedItems/{replicatedItemName}?api-version={api_version}
```

### Request body

```json
{
  "properties": {
    "policyId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/replicationPolicies/{policyName}",
    "protectableItemId": "",
    "providerSpecificDetails": {
      "instanceType": "InMageRcm",
      "fabricDiscoveryMachineId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OffAzure/VMwareSites/{siteName}/machines/{machineId}",
      "processServerId": "{processServerId}",
      "targetResourceGroupId": "/subscriptions/{subscriptionId}/resourceGroups/{targetResourceGroupName}",
      "targetNetworkId": "/subscriptions/{subscriptionId}/resourceGroups/{networkResourceGroupName}/providers/Microsoft.Network/virtualNetworks/{vnetName}",
      "targetSubnetName": "{subnetName}",
      "targetVmName": "{targetVmName}",
      "targetVmSize": "Standard_D2s_v3",
      "licenseType": "NoLicenseType",
      "disksToInclude": [
        {
          "diskId": "{diskUuid}",
          "diskType": "Standard_LRS",
          "logStorageAccountId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{cacheStorageAccountName}"
        }
      ],
      "runAsAccountId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OffAzure/VMwareSites/{siteName}/runasaccounts/{runAsAccountId}",
      "multiVmGroupName": "{multiVmGroupName}",
      "targetAvailabilitySetId": "",
      "targetAvailabilityZone": "1",
      "targetProximityPlacementGroupId": "",
      "targetBootDiagnosticsStorageAccountId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{bootDiagStorageAccountName}",
      "testNetworkId": "/subscriptions/{subscriptionId}/resourceGroups/{networkResourceGroupName}/providers/Microsoft.Network/virtualNetworks/{testVnetName}",
      "testSubnetName": "{testSubnetName}"
    }
  }
}
```

### InMageRcm enable protection input parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instanceType` | Yes | Must be `InMageRcm` |
| `fabricDiscoveryMachineId` | Yes | ARM ID of the discovered VMware machine from Azure Migrate |
| `processServerId` | Yes | ID of the process server to use for replication |
| `targetResourceGroupId` | Yes | ARM ID of the target resource group in Azure |
| `disksToInclude` | Yes* | List of disks to replicate with their configuration |
| `disksDefault` | Yes* | Default disk configuration (use either `disksToInclude` or `disksDefault`, not both) |
| `targetNetworkId` | No | ARM ID of the target virtual network |
| `testNetworkId` | No | ARM ID of the test virtual network |
| `targetSubnetName` | No | Name of the target subnet |
| `testSubnetName` | No | Name of the test subnet |
| `targetVmName` | No | Name for the target Azure VM |
| `targetVmSize` | No | Azure VM size (e.g., `Standard_D2s_v3`) |
| `licenseType` | No | License type: `NoLicenseType`, `WindowsServer` |
| `sqlServerLicenseType` | No | SQL Server license: `NotSpecified`, `NoLicenseType`, `PAYG`, `AHUB` |
| `linuxLicenseType` | No | Linux license: `NotSpecified`, `NoLicenseType`, `RHEL_BYOS`, `SLES_BYOS` |
| `targetAvailabilitySetId` | No | ARM ID of target availability set |
| `targetAvailabilityZone` | No | Target availability zone (1, 2, or 3) |
| `targetProximityPlacementGroupId` | No | ARM ID of target proximity placement group |
| `targetBootDiagnosticsStorageAccountId` | No | ARM ID of boot diagnostics storage account |
| `runAsAccountId` | No | ARM ID of the run-as account for mobility agent installation |
| `multiVmGroupName` | No | Multi-VM consistency group name |
| `targetVmTags` | No | Tags to apply to the target VM |
| `seedManagedDiskTags` | No | Tags for seed managed disks |
| `targetManagedDiskTags` | No | Tags for target managed disks |
| `targetNicTags` | No | Tags for target NICs |

### Disk input parameters

When using `disksToInclude`, each disk object requires:

| Parameter | Required | Description |
|-----------|----------|-------------|
| `diskId` | Yes | UUID of the disk to replicate |
| `diskType` | Yes | Target disk type: `Standard_LRS`, `Premium_LRS`, `StandardSSD_LRS`, `Premium_ZRS`, `StandardSSD_ZRS` |
| `logStorageAccountId` | Yes | ARM ID of the cache storage account for replication |
| `diskEncryptionSetId` | No | ARM ID of disk encryption set for server-side encryption |

When using `disksDefault`:

| Parameter | Required | Description |
|-----------|----------|-------------|
| `diskType` | Yes | Default disk type for all disks |
| `logStorageAccountId` | Yes | ARM ID of the cache storage account |
| `diskEncryptionSetId` | No | ARM ID of default disk encryption set |

### Response

A successful request returns HTTP 200 (OK) or 202 (Accepted) with the replication protected item details and tracks the enable replication job.

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/replicationFabrics/{fabricName}/replicationProtectionContainers/{containerName}/replicationProtectedItems/{itemName}",
  "name": "{itemName}",
  "type": "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems",
  "properties": {
    "friendlyName": "{vmName}",
    "protectedItemType": "InMageRcm",
    "protectionState": "EnablingProtection",
    "protectionStateDescription": "Enabling protection"
  }
}
```

## Step 2: Update replication settings

After enabling replication, you can modify the target VM properties using the [Update Replication Protected Item](https://learn.microsoft.com/en-us/rest/api/site-recovery/replication-protected-items/update?view=rest-site-recovery-2025-08-01&tabs=HTTP) API.

### Request

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/replicationFabrics/{fabricName}/replicationProtectionContainers/{protectionContainerName}/replicationProtectedItems/{replicatedItemName}?api-version={api_version}
```

### Request body

```json
{
  "properties": {
    "providerSpecificDetails": {
      "instanceType": "InMageRcm",
      "targetVmName": "{newTargetVmName}",
      "targetVmSize": "Standard_D4s_v3",
      "targetResourceGroupId": "/subscriptions/{subscriptionId}/resourceGroups/{newTargetResourceGroupName}",
      "targetNetworkId": "/subscriptions/{subscriptionId}/resourceGroups/{networkResourceGroupName}/providers/Microsoft.Network/virtualNetworks/{newVnetName}",
      "testNetworkId": "/subscriptions/{subscriptionId}/resourceGroups/{networkResourceGroupName}/providers/Microsoft.Network/virtualNetworks/{newTestVnetName}",
      "targetAvailabilitySetId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/availabilitySets/{availabilitySetName}",
      "targetAvailabilityZone": "",
      "targetProximityPlacementGroupId": "",
      "targetBootDiagnosticsStorageAccountId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}",
      "licenseType": "WindowsServer",
      "sqlServerLicenseType": "AHUB",
      "linuxLicenseType": "NoLicenseType",
      "vmNics": [
        {
          "nicId": "{sourceNicId}",
          "isPrimaryNic": true,
          "targetSubnetName": "{subnetName}",
          "targetStaticIPAddress": "10.0.0.10",
          "testSubnetName": "{testSubnetName}",
          "testStaticIPAddress": "10.1.0.10",
          "isSelectedForMigration": true
        }
      ],
      "targetVmTags": [
        {
          "tagName": "Environment",
          "tagValue": "Production"
        }
      ],
      "targetManagedDiskTags": [
        {
          "tagName": "Project",
          "tagValue": "Migration"
        }
      ],
      "vmDisks": [
        {
          "diskId": "{diskUuid}",
          "targetDiskName": "{customDiskName}"
        }
      ]
    }
  }
}
```

### InMageRcm update protection input parameters

| Parameter | Description |
|-----------|-------------|
| `instanceType` | Must be `InMageRcm` |
| `targetVmName` | Updated name for the target Azure VM |
| `targetVmSize` | Updated Azure VM size |
| `targetResourceGroupId` | Updated target resource group ARM ID |
| `targetNetworkId` | Updated target virtual network ARM ID |
| `testNetworkId` | Updated test virtual network ARM ID |
| `targetAvailabilitySetId` | Updated availability set ARM ID (set to empty string to remove) |
| `targetAvailabilityZone` | Updated availability zone (set to empty string to remove) |
| `targetProximityPlacementGroupId` | Updated proximity placement group ARM ID |
| `targetBootDiagnosticsStorageAccountId` | Updated boot diagnostics storage account ARM ID |
| `licenseType` | Updated license type |
| `sqlServerLicenseType` | Updated SQL Server license type |
| `linuxLicenseType` | Updated Linux license type |
| `vmNics` | List of NIC configurations |
| `targetVmTags` | Tags to apply to target VM |
| `targetManagedDiskTags` | Tags to apply to target disks |
| `targetNicTags` | Tags to apply to target NICs |
| `vmDisks` | List of disk configurations with custom names |

### NIC input parameters

| Parameter | Description |
|-----------|-------------|
| `nicId` | Source NIC identifier |
| `isPrimaryNic` | Whether this is the primary NIC |
| `targetSubnetName` | Target subnet name for migration |
| `targetStaticIPAddress` | Static IP address for migration |
| `testSubnetName` | Subnet name for test migration |
| `testStaticIPAddress` | Static IP for test migration |
| `isSelectedForMigration` | Whether to include this NIC in migration |

## Step 3: Test migration

Before performing the actual migration, validate your configuration using test migration (test failover). Use the [Test Failover](https://learn.microsoft.com/en-us/rest/api/site-recovery/replication-protected-items/test-failover?view=rest-site-recovery-2025-08-01&tabs=HTTP) API.

### Request

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/replicationFabrics/{fabricName}/replicationProtectionContainers/{protectionContainerName}/replicationProtectedItems/{replicatedItemName}/testFailover?api-version={api_version}
```

### Request body

```json
{
  "properties": {
    "failoverDirection": "PrimaryToRecovery",
    "networkType": "VmNetworkAsInput",
    "networkId": "/subscriptions/{subscriptionId}/resourceGroups/{networkResourceGroupName}/providers/Microsoft.Network/virtualNetworks/{testVnetName}",
    "providerSpecificDetails": {
      "instanceType": "InMageRcm",
      "networkId": "/subscriptions/{subscriptionId}/resourceGroups/{networkResourceGroupName}/providers/Microsoft.Network/virtualNetworks/{testVnetName}",
      "recoveryPointId": ""
    }
  }
}
```

Take recovery point from latest processed recovery point for minimal data loss, from properties.providerspecificDetails.lastRecoveryPointId of Get Replication Protected Item API.

### InMageRcm test failover input parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instanceType` | Yes | Must be `InMageRcm` |
| `networkId` | No | ARM ID of the test network. If not specified, uses the configured test network. |
| `recoveryPointId` | No | ARM ID of a specific recovery point. Leave empty for the latest recovery point. |
| `osUpgradeVersion` | No | Target OS version for in-place OS upgrade during test migration |

### Response

The API returns a job that tracks the test migration progress:

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/replicationJobs/{jobId}",
  "name": "{jobId}",
  "type": "Microsoft.RecoveryServices/vaults/replicationJobs",
  "properties": {
    "activityId": "{activityId}",
    "scenarioName": "TestFailover",
    "friendlyName": "Test failover",
    "state": "InProgress"
  }
}
```

### Test failover cleanup

After validating the test migration, clean up the test resources using the [Test Failover Cleanup](https://learn.microsoft.com/en-us/rest/api/site-recovery/replication-protected-items/test-failover-cleanup?view=rest-site-recovery-2025-08-01) API.

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/replicationFabrics/{fabricName}/replicationProtectionContainers/{protectionContainerName}/replicationProtectedItems/{replicatedItemName}/testFailoverCleanup?api-version={api_version}
```

```json
{
  "properties": {
    "comments": "Test migration validation completed successfully"
  }
}
```

## Step 4: Perform migration (failover)

When you're ready to migrate the VM to Azure, use the [Unplanned Failover](https://learn.microsoft.com/en-us/rest/api/site-recovery/replication-protected-items/unplanned-failover?view=rest-site-recovery-2025-08-01&tabs=HTTP) API.

### Request

```http
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/replicationFabrics/{fabricName}/replicationProtectionContainers/{protectionContainerName}/replicationProtectedItems/{replicatedItemName}/unplannedFailover?api-version={api_version}
```

### Request body

```json
{
  "properties": {
    "failoverDirection": "PrimaryToRecovery",
    "sourceSiteOperations": "NotRequired",
    "providerSpecificDetails": {
      "instanceType": "InMageRcm",
      "recoveryPointId": "",
      "performShutdown": false
    }
  }
}
```

### InMageRcm failover input parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instanceType` | Yes | Must be `InMageRcm` |
| `recoveryPointId` | No | ARM ID of recovery point to fail over to. Leave empty for latest. |
| `performShutdown` | No | Whether to shut down the source VM before failover (recommended for minimal data loss) |
| `osUpgradeVersion` | No | Target OS version for in-place OS upgrade during migration |
| `targetCapacityReservationGroupId` | No | ARM ID of target capacity reservation group |

### Response

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/replicationJobs/{jobId}",
  "name": "{jobId}",
  "type": "Microsoft.RecoveryServices/vaults/replicationJobs",
  "properties": {
    "activityId": "{activityId}",
    "scenarioName": "UnplannedFailover",
    "friendlyName": "Unplanned failover",
    "state": "InProgress"
  }
}
```

## Step 5: Complete/Disable migration

After a successful failover,  disable replication to clean up resources using the [Delete](https://learn.microsoft.com/en-us/rest/api/site-recovery/replication-protected-items/delete?view=rest-site-recovery-2025-08-01&tabs=HTTP) API:

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/replicationFabrics/{fabricName}/replicationProtectionContainers/{protectionContainerName}/replicationProtectedItems/{replicatedItemName}?api-version={api_version}
```

## Monitoring jobs

Track the status of migration operations using the [Get Job](https://learn.microsoft.com/en-us/rest/api/site-recovery/replication-jobs/get?view=rest-site-recovery-2025-08-01&tabs=HTTP) API:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/replicationJobs/{jobId}?api-version={api_version}
```

Job states include:
- `NotStarted`
- `InProgress`
- `Succeeded`
- `Failed`
- `Cancelled`

## Error handling

Common error scenarios and resolutions:

| Error | Resolution |
|-------|------------|
| `InvalidParameter` | Verify all required parameters are provided with valid values |
| `ResourceNotFound` | Ensure all ARM resource IDs are correct and resources exist |
| `ReplicationNotHealthy` | Check replication health before test/actual migration |
| `RecoveryPointNotFound` | Use the latest recovery point or verify the specified recovery point exists |

## PowerShell automation example

Here's a sample PowerShell script that automates the enable replication workflow:

```powershell
# Variables
$subscriptionId = "<subscription-id>"
$resourceGroupName = "<resource-group-name>"
$vaultName = "<vault-name>"
$fabricName = "<fabric-name>"
$containerName = "<container-name>"
$itemName = "<replicated-item-name>"
$apiVersion = "{api_version}"

# Get access token
$token = (Get-AzAccessToken -ResourceUrl "https://management.azure.com").Token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Base URI
$baseUri = "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.RecoveryServices/vaults/$vaultName/replicationFabrics/$fabricName/replicationProtectionContainers/$containerName/replicationProtectedItems/$itemName"

# Enable replication
$enableBody = @{
    properties = @{
        policyId = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.RecoveryServices/vaults/$vaultName/replicationPolicies/<policy-name>"
        protectableItemId = ""
        providerSpecificDetails = @{
            instanceType = "InMageRcm"
            fabricDiscoveryMachineId = "<fabric-discovery-machine-id>"
            processServerId = "<process-server-id>"
            targetResourceGroupId = "<target-resource-group-id>"
            disksDefault = @{
                diskType = "Standard_LRS"
                logStorageAccountId = "<cache-storage-account-id>"
            }
        }
    }
} | ConvertTo-Json -Depth 10

$enableUri = "$baseUri`?api-version=$apiVersion"
$enableResponse = Invoke-RestMethod -Uri $enableUri -Method Put -Headers $headers -Body $enableBody
```

## Best practices

1. **Test migration first** - Always perform a test migration before the actual migration to validate configuration
2. **Use recovery points** - For minimal data loss, use the latest processed recovery point
3. **Monitor replication health** - Ensure replication is healthy before initiating migration
4. **Plan maintenance windows** - Schedule migrations during maintenance windows to minimize impact
5. **Batch migrations** - Group VMs in multi-VM consistency groups for application-consistent migration
6. **Retain recovery points** - Keep recovery points until migration is validated in production

## Related content

- [Azure Site Recovery REST API reference](/https://learn.microsoft.com/en-us/rest/api/site-recovery/?view=rest-site-recovery-2025-08-01)
- [VMware VM migration to Azure overview](https://learn.microsoft.com/en-us/azure/site-recovery/vmware-azure-architecture-modernized)
- [Azure Site Recovery replication appliance](https://learn.microsoft.com/en-us/azure/site-recovery/replication-appliance-support-matrix)
