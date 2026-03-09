---
title: Automate VMware to Azure migration using Azure Site Recovery REST API
description: Learn how to automate VMware virtual machine migration to Azure using Azure Site Recovery REST API with the InMageRcm replication provider.
author: prsadhu-ms-idc
ms.author: prsadhu
ms.service: azure-migrate
ms.topic: concept-article
ms.reviewer: v-uhabiba
ms.date: 12/02/2025
# Customer intent: As a migration owner, I want to automate the migration of my VMware virtual machines to Azure using Azure Site Recovery REST API, so that I can efficiently manage large-scale migrations with custom automation solutions.
---

# Automate VMware to Azure agent-based migration using Azure Site Recovery REST API

This article describes how to automate **simplified** agent-based virtual machine migration to Azure using the Azure Site Recovery REST API. You can use these APIs to build custom automation solutions for large-scale migrations using the **InMageRcm** replication provider.
Use this article if you want to:
- Automate simplified VMware/Physical to Azure agent-based migrations at scale.
- Integrate migration process into your existing tools or pipelines.
- Programmatically control replication, test migration, and failover operations.

## Prerequisites

Before you begin, make sure you have the following:

- An Azure subscription with Azure Migrate Owner role to create and manage Azure Migrate resources. [Azure Migrate built-in roles](/azure/migrate/prepare-azure-accounts).

> [!IMPORTANT]
> Insufficient permissions can cause API calls to fail with authorization or resource access errors.

- A Migrate project configured for agent-based migration.
- A replication appliance deployed and registered with the vault.
- VMware or physical virtual machines discovered by the appliance.
- First replication enabled from the Azure portal to create the initial resources required for replication.

## Gather required resource IDs

Before you call the APIs, gather the required resource identifiers. This section describes how to obtain each identifier.

### Get the Azure Site Recovery Vault ID

In the Azure portal, go to your **Azure Migrate project > Execute > Migrations > Replications summary > Properties**.
Under Linked Recovery Services vaults, identify the vault where Replication type is set to Other, and copy the Vault ID.
Alternatively, you can find the vault ID in the resource group where the Azure Migrate project is created.
The resource ID format is:
```
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{migrateProjectName-MigrateVault-numbers}
```

### Get the Process server ID and Site IDs

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
          "id": "00001111-aaaa-2222-bbbb-3333cccc4444",
          "name": "yourappliancename",
          "biosId": "00001111-aaaa-2222-bbbb-3333cccc4444",
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

The `fabricDiscoveryMachineId` is the Azure Resource Manager ID of the discovered VM from Azure Migrate. To find it:

```http
(for VMware VMs) GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OffAzure/VMwareSites/{siteName}/machines?api-version=2023-06-06
(for physical machines) GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OffAzure//ServerSites/{siteName}/machines?api-version=2023-06-06
```

The response returns a list of discovered machines, including their full Azure Resource Manager (ARM) IDs. Each machine entry also includes a friendly name to help identify the corresponding virtual machine.

### Get the Run-As Account ID (Optional)

To push-install the Mobility agent, you must specify credentials:

```http
(for VMware VMs) GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OffAzure/VMwareSites/{siteName}/runasaccounts?api-version=2023-06-06
```
For physical machines, use runasaccounts from `properties.runAsAccountId` from machine details.

## Migration workflow overview

The Azure Site Recovery REST API–based migration workflow includes the following steps:
1. **Enable replication** - Start replicating VMware VMs to Azure.
2. **Update replication settings** - Modify target VM properties as needed.
3. **Test migration** - Validate the migration without impacting production.
4. **Perform migration** - Execute the actual migration (failover) to Azure.

## Authentication

All REST API calls require authentication with Microsoft Entra ID. To authenticate, obtain a bearer access token using one of the supported methods.

- Azure CLI: `az account get-access-token`
- Azure PowerShell: `Get-AzAccessToken`
- Azure SDK authentication libraries

Include the token in the `Authorization` header:

```http
Authorization: Bearer <access-token>
```

Alternatively you can use armclient or Invoke-AzRestMethod in PowerShell.

> [!NOTE]
> All examples in this article use the **2025‑08‑01** API version for the Azure Site Recovery resource provider. Ensure that the same API version is specified for all REST requests.

## Step 1: Enable replication

To start replicating a VM to Azure, use the [Create Replication Protected Item](/rest/api/site-recovery/replication-protected-items/create) API.

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
| `fabricDiscoveryMachineId` | Yes | Azure Resource Manager ID of the discovered VMware machine from Azure Migrate |
| `processServerId` | Yes | ID of the process server to use for replication |
| `targetResourceGroupId` | Yes | Azure Resource Manager ID of the target resource group in Azure |
| `disksToInclude` | Yes* | List of disks to replicate with their configuration |
| `disksDefault` | Yes* | Default disk configuration (use either `disksToInclude` or `disksDefault`, not both) |
| `targetNetworkId` | No | Azure Resource Manager ID of the target virtual network |
| `testNetworkId` | No | Azure Resource Manager ID of the test virtual network |
| `targetSubnetName` | No | Name of the target subnet |
| `testSubnetName` | No | Name of the test subnet |
| `targetVmName` | No | Name for the target Azure VM |
| `targetVmSize` | No | Azure VM size (e.g., `Standard_D2s_v3`) |
| `licenseType` | No | License type: `NoLicenseType`, `WindowsServer` |
| `sqlServerLicenseType` | No | SQL Server license: `NotSpecified`, `NoLicenseType`, `PAYG`, `AHUB` |
| `linuxLicenseType` | No | Linux license: `NotSpecified`, `NoLicenseType`, `RHEL_BYOS`, `SLES_BYOS` |
| `targetAvailabilitySetId` | No | Azure Resource Manager ID of target availability set |
| `targetAvailabilityZone` | No | Target availability zone (1, 2, or 3) |
| `targetProximityPlacementGroupId` | No | Azure Resource Manager ID of target proximity placement group |
| `targetBootDiagnosticsStorageAccountId` | No | Azure Resource Manager ID of boot diagnostics storage account |
| `runAsAccountId` | No | Azure Resource Manager ID of the run-as account for mobility agent installation |
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
| `logStorageAccountId` | Yes | Azure Resource Manager ID of the cache storage account for replication |
| `diskEncryptionSetId` | No | Azure Resource Manager ID of disk encryption set for server-side encryption |

When using `disksDefault`:

| Parameter | Required | Description |
|-----------|----------|-------------|
| `diskType` | Yes | Default disk type for all disks |
| `logStorageAccountId` | Yes | Azure Resource Manager ID of the cache storage account |
| `diskEncryptionSetId` | No | Azure Resource Manager ID of default disk encryption set |

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

After enabling replication, you can modify the target VM properties using the [Update Replication Protected Item](/rest/api/site-recovery/replication-protected-items/update) API.

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
| `targetResourceGroupId` | Updated target resource group Azure Resource Manager ID |
| `targetNetworkId` | Updated target virtual network Azure Resource Manager ID |
| `testNetworkId` | Updated test virtual network Azure Resource Manager ID |
| `targetAvailabilitySetId` | Updated availability set Azure Resource Manager ID (set to empty string to remove) |
| `targetAvailabilityZone` | Updated availability zone (set to empty string to remove) |
| `targetProximityPlacementGroupId` | Updated proximity placement group Azure Resource Manager ID |
| `targetBootDiagnosticsStorageAccountId` | Updated boot diagnostics storage account Azure Resource Manager ID |
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

> [!IMPORTANT]
> Always perform a test migration (test failover) before initiating an actual migration to validate configuration.

Use the [Test Failover](/rest/api/site-recovery/replication-protected-items/test-failover) API.

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

Take a recovery point from the latest processed recovery point to minimize data loss. Use the value from `properties.providerSpecificDetails.lastRecoveryPointId` returned by the **Get Replication Protected Item API**.

### InMageRcm test failover input parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instanceType` | Yes | Must be `InMageRcm` |
| `networkId` | No | Azure Resource Manager ID of the test network. If not specified, uses the configured test network. |
| `recoveryPointId` | No | Azure Resource Manager ID of a specific recovery point. Leave empty for the latest recovery point. |
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

After validating the test migration, clean up the test resources using the [Test Failover Cleanup](/rest/api/site-recovery/replication-protected-items/test-failover-cleanup) API.

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

When you're ready to migrate the VM to Azure, use the [Unplanned Failover](/rest/api/site-recovery/replication-protected-items/unplanned-failover) API.

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
| `recoveryPointId` | No | Azure Resource Manager ID of recovery point to fail over to. Leave empty for latest. |
| `performShutdown` | No | Whether to shut down the source VM before failover (recommended for minimal data loss) |
| `osUpgradeVersion` | No | Target OS version for in-place OS upgrade during migration |
| `targetCapacityReservationGroupId` | No | Azure Resource Manager ID of target capacity reservation group |

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

After a successful failover,  disable replication to clean up resources using the [Delete](/rest/api/site-recovery/replication-protected-items/delete) API:

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/{vaultName}/replicationFabrics/{fabricName}/replicationProtectionContainers/{protectionContainerName}/replicationProtectedItems/{replicatedItemName}?api-version={api_version}
```

## Monitoring jobs

Track the status of migration operations using the [Get Job](/rest/api/site-recovery/replication-jobs/get) API:

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
| `ResourceNotFound` | Ensure all Azure Resource Manager resource IDs are correct and resources exist |
| `ReplicationNotHealthy` | Check replication health before test/actual migration |
| `RecoveryPointNotFound` | Use the latest recovery point or verify the specified recovery point exists |

See [Troubleshoot](/azure/site-recovery/vmware-azure-troubleshoot-replication) for more details.

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

- **Run a test migration first**: Always perform a test migration to validate the configuration before starting the actual migration.
- **Use appropriate recovery points**: To minimize data loss, select the latest processed recovery point.
- **Monitor replication health**: Verify that replication is healthy before you initiate migration.
- **Plan maintenance windows**: Schedule migrations during planned maintenance windows.
- **Migrate in batches**: Group virtual machines into multi-VM consistency groups to enable application-consistent migrations.
- **Retain recovery points until validation**: Keep recovery points until the migration is validated in the production environment.

## Next steps
Write a script to automate the above step. If you face any issues, please reach out to Microsoft support for same.

## Related content

- [Azure Site Recovery REST API reference](/rest/api/site-recovery/)
- [VMware VM migration to Azure overview](/azure/site-recovery/vmware-azure-architecture-modernized)
- [Azure Site Recovery replication appliance](/azure/site-recovery/replication-appliance-support-matrix)
