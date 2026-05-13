---
title: Automate VMware to Azure migration using Azure Site Recovery REST API
description: Learn how to automate VMware virtual machine migration to Azure using Azure Site Recovery REST API with the InMageRcm replication provider.
author: prsadhu-ms-idc
ms.author: prsadhu
ms.service: azure-migrate
ms.topic: concept-article
ms.reviewer: v-uhabiba
ms.date: 12/02/2025
ms.update-cycle: 365-days
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
      "name": "fabric-name-1",
      "type": "Microsoft.RecoveryServices/vaults/replicationFabrics",
      "id": "/Subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.RecoveryServices/vaults/vault-name/replicationFabrics/fabric-name-1",
      "properties": {
        "friendlyName": "fabric-name-1",
        "encryptionDetails": {
          "kekState": "None",
          "kekCertThumbprint": null
        },
        "rolloverEncryptionDetails": {
          "kekState": "None",
          "kekCertThumbprint": null
        },
        "internalIdentifier": "internal-guid-1",
        "bcdrState": "Valid",
        "customDetails": {
          "instanceType": "HyperVSite",
          "hyperVHosts": []
        },
        "healthErrorDetails": [],
        "health": "Normal"
      }
    },
    {
      "name": "fabric-name-2",
      "type": "Microsoft.RecoveryServices/vaults/replicationFabrics",
      "id": "/Subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.RecoveryServices/vaults/vault-name/replicationFabrics/fabric-name-2",
      "properties": {
        "friendlyName": "fabric-name-2",
        "encryptionDetails": {
          "kekState": "None",
          "kekCertThumbprint": null
        },
        "rolloverEncryptionDetails": {
          "kekState": "None",
          "kekCertThumbprint": null
        },
        "internalIdentifier": "internal-guid-2",
        "bcdrState": "Valid",
        "customDetails": {
          "instanceType": "InMageRcm",
          "vmwareSiteId": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.OffAzure/VMwareSites/vmware-site-name",
          "physicalSiteId": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.OffAzure/ServerSites/physical-site-name",
          "serviceEndpoint": "https://stamp-endpoint.hypervrecoverymanager.windowsazure.com",
          "serviceResourceId": "redacted",
          "serviceContainerId": "redacted",
          "dataPlaneUri": "https://stamp-endpoint.backup.windowsazure.com",
          "controlPlaneUri": "https://stamp-endpoint.hypervrecoverymanager.windowsazure.com",
          "sourceAgentIdentityDetails": null,
          "processServers": [],
          "rcmProxies": [],
          "pushInstallers": [],
          "replicationAgents": [],
          "reprotectAgents": [],
          "marsAgents": [],
          "dras": [],
          "agentDetails": []
        },
        "healthErrorDetails": [],
        "health": "Normal"
      }
    }
  ],
  "nextLink": null
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
  "name": "fabric-name",
  "type": "Microsoft.RecoveryServices/vaults/replicationFabrics",
  "id": "/Subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/resource-group-name/providers/Microsoft.RecoveryServices/vaults/vault-name/replicationFabrics/fabric-name",
  "properties": {
    "friendlyName": "fabric-name",
    "encryptionDetails": {
      "kekState": "None",
      "kekCertThumbprint": null
    },
    "rolloverEncryptionDetails": {
      "kekState": "None",
      "kekCertThumbprint": null
    },
    "internalIdentifier": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "bcdrState": "Valid",
    "customDetails": {
      "instanceType": "InMageRcm",
      "vmwareSiteId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/resource-group-name/providers/Microsoft.OffAzure/VMwareSites/vmware-site-name",
      "physicalSiteId": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/resource-group-name/providers/Microsoft.OffAzure/ServerSites/physical-site-name",
      "serviceEndpoint": "https://region-endpoint.hypervrecoverymanager.windowsazure.com",
      "serviceResourceId": "redacted",
      "serviceContainerId": "redacted",
      "dataPlaneUri": "https://region-endpoint.backup.windowsazure.com",
      "controlPlaneUri": "https://region-endpoint.hypervrecoverymanager.windowsazure.com",
      "sourceAgentIdentityDetails": {
        "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "applicationId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "objectId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "audience": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "aadAuthority": "https://login.microsoftonline.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      },
      "processServers": [
        {
          "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "name": "appliance-name",
          "biosId": "XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "fabricObjectId": null,
          "fqdn": "appliance-fqdn",
          "ipAddresses": [
            "x.x.x.x"
          ],
          "version": "9.66.7614.1",
          "lastHeartbeatUtc": "2026-04-21T04:24:56.3135603Z",
          "totalMemoryInBytes": 39727841280,
          "availableMemoryInBytes": 14194757689,
          "usedMemoryInBytes": 25533083591,
          "memoryUsagePercentage": 64.27,
          "totalSpaceInBytes": 665717829632,
          "availableSpaceInBytes": 660404075520,
          "usedSpaceInBytes": 5313754112,
          "freeSpacePercentage": 99.20,
          "throughputUploadPendingDataInBytes": 0,
          "throughputInBytes": 0,
          "processorUsagePercentage": 0.0,
          "throughputStatus": "Healthy",
          "systemLoad": 0,
          "systemLoadStatus": "Healthy",
          "diskUsageStatus": "Healthy",
          "memoryUsageStatus": "Healthy",
          "processorUsageStatus": "Healthy",
          "health": "Normal",
          "healthErrors": [],
          "historicHealth": "Normal"
        }
      ],
      "rcmProxies": [
        {
          "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "name": "appliance-name",
          "biosId": "XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "fabricObjectId": null,
          "fqdn": "appliance-fqdn",
          "clientAuthenticationType": "Certificate",
          "version": "1.44.9645.8268",
          "lastHeartbeatUtc": "2026-04-21T04:25:34.6896754Z",
          "health": "Normal",
          "healthErrors": []
        }
      ],
      "pushInstallers": [
        {
          "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "name": "appliance-name",
          "biosId": "XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "fabricObjectId": null,
          "fqdn": "appliance-fqdn",
          "version": "1.47.9649.18387",
          "lastHeartbeatUtc": "2026-04-21T04:25:11.2351003Z",
          "health": "Normal",
          "healthErrors": []
        }
      ],
      "replicationAgents": [
        {
          "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "name": "appliance-name",
          "biosId": "XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "fabricObjectId": null,
          "fqdn": "appliance-fqdn",
          "version": "1.45.9649.18472",
          "lastHeartbeatUtc": "2026-04-21T04:24:53.5000477Z",
          "health": "Normal",
          "healthErrors": []
        }
      ],
      "reprotectAgents": [
        {
          "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "name": "appliance-name",
          "biosId": "XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "fabricObjectId": null,
          "fqdn": "appliance-fqdn",
          "version": "1.48.9649.18457",
          "lastHeartbeatUtc": "2026-04-21T04:25:21.4453717Z",
          "health": "Normal",
          "healthErrors": [],
          "accessibleDatastores": [],
          "vcenterId": null
        }
      ],
      "marsAgents": [
        {
          "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "name": "appliance-name",
          "biosId": "XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "fabricObjectId": null,
          "fqdn": "appliance-fqdn",
          "version": "2.0.9955.0",
          "lastHeartbeatUtc": "2026-04-21T04:24:29.8514455Z",
          "health": "Normal",
          "healthErrors": []
        }
      ],
      "dras": [
        {
          "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "name": "appliance-name",
          "biosId": "XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          "version": "5.25.904.11",
          "lastHeartbeatUtc": "2026-04-21T04:30:31.8387555Z",
          "health": "Normal",
          "healthErrors": []
        }
      ],
      "agentDetails": []
    },
    "healthErrorDetails": [],
    "health": "Normal"
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

**Sample Response (Discovered machine details)**

```json
[
  {
    "id": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.OffAzure/serversites/server-site-name/machines/machine-id",
    "name": "machine-id",
    "type": "Microsoft.OffAzure/serversites/machines",
    "properties": {
      "totalDiskSizeInGB": 60.0,
      "appliancePropertiesCollection": [
        {
          "runAsAccountId": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.OffAzure/serversites/server-site-name/runasaccounts/run-as-account-id",
          "applianceName": "appliance-name",
          "status": "Registered"
        }
      ],
      "displayName": "machine-hostname",
      "provisioningState": "Succeeded",
      "errors": [],
      "arcDiscovery": {
        "status": "Unknown",
        "machineResourceId": null
      },
      "numberOfSecurityRisks": -1,
      "numberOfSoftware": -1,
      "hypervisor": null,
      "discoverySource": "Appliance",
      "processorInfo": null,
      "autoEnableDependencyMapping": "ValidationInProgress",
      "disks": [
        {
          "diskId": "disk-guid-1",
          "usedSpaceInBytesV2": null,
          "id": "\\\\.\\PHYSICALDRIVE0",
          "generatedId": "disk-guid-1",
          "maxSizeInBytes": 53687091200,
          "usedSpaceInBytes": 0,
          "name": "disk-guid-1",
          "diskType": "Basic",
          "lun": 0,
          "path": "\\\\.\\PHYSICALDRIVE0",
          "logicalSectorSizeInBytes": 0
        },
        {
          "diskId": "disk-guid-2",
          "usedSpaceInBytesV2": null,
          "id": "\\\\.\\PHYSICALDRIVE1",
          "generatedId": "disk-guid-2",
          "maxSizeInBytes": 10737418240,
          "usedSpaceInBytes": 0,
          "name": "disk-guid-2",
          "diskType": "Basic",
          "lun": 0,
          "path": "\\\\.\\PHYSICALDRIVE1",
          "logicalSectorSizeInBytes": 0
        }
      ],
      "totalFreeSpaceOfAllDisksInGB": 0.0,
      "fqdn": "machine-hostname",
      "networkAdapters": [
        {
          "nicId": "Intel(R) 82574L Gigabit Network Connection",
          "macAddress": "XX:XX:XX:XX:XX:XX",
          "ipAddressList": [],
          "networkName": "Intel(R) 82574L Gigabit Network Connection",
          "ipAddressType": "Dynamic"
        }
      ],
      "hydratedFqdn": "machine-hostname",
      "validationRequired": null,
      "firmware": "UEFI",
      "guestOSDetails": {
        "osType": null,
        "osName": null,
        "osVersion": null,
        "osArchitecture": null
      },
      "numberOfApplications": -1,
      "guestDetailsDiscoveryTimestamp": null,
      "isFileServerSupported": null,
      "isGuestDetailsDiscoveryInProgress": true,
      "dependencyMapping": "Disabled",
      "dependencyMappingStartTime": null,
      "dependencyMappingEndTime": null,
      "runAsAccountId": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.OffAzure/serversites/server-site-name/runasaccounts/run-as-account-id",
      "applianceNames": [
        "appliance-name"
      ],
      "distinctErrorCount": 0,
      "applicationDiscovery": {
        "discoveryScopeStatus": "DiscoveryInProgress",
        "errors": [],
        "hydratedRunAsAccountId": null
      },
      "dependencyMapDiscovery": {
        "discoveryScopeStatus": "DiscoveryInProgress",
        "errors": [],
        "hydratedRunAsAccountId": null
      },
      "staticDiscovery": {
        "discoveryScopeStatus": "DiscoverySucceeded",
        "errors": [],
        "hydratedRunAsAccountId": null
      },
      "sqlDiscovery": {
        "successfullyDiscoveredServerCount": -1,
        "totalServerCount": -1,
        "sqlMetadataHydratedRunAsAccountId": null,
        "sqlMetadataDiscoveryPipe": "Unknown",
        "discoveryScopeStatus": "DiscoveryInProgress"
      },
      "webAppDiscovery": {
        "totalWebServerCount": 0,
        "totalWebApplicationCount": 0,
        "discoveryScopeStatus": "DiscoverySucceeded"
      },
      "oracleDiscovery": {
        "totalInstanceCount": 0,
        "totalDatabaseCount": 0,
        "shallowDiscoveryStatus": "Disabled",
        "discoveryScopeStatus": "DiscoverySucceeded"
      },
      "springBootDiscovery": {
        "totalInstanceCount": 0,
        "totalApplicationCount": 0,
        "shallowDiscoveryStatus": "Disabled",
        "discoveryScopeStatus": "DiscoverySucceeded"
      },
      "mySQLDiscovery": {
        "totalInstanceCount": 0,
        "totalDatabaseCount": 0,
        "shallowDiscoveryStatus": "Disabled",
        "discoveryScopeStatus": "DiscoverySucceeded"
      },
      "pgSQLDiscovery": {
        "totalInstanceCount": 0,
        "totalDatabaseCount": 0,
        "shallowDiscoveryStatus": "Disabled",
        "discoveryScopeStatus": "DiscoverySucceeded"
      },
      "fileShareDiscovery": {
        "totalFileShareCount": 0,
        "shallowDiscoveryStatus": "Disabled",
        "discoveryScopeStatus": "DiscoverySucceeded"
      },
      "iisDiscovery": {
        "totalWebServerCount": 0,
        "totalWebApplicationCount": 0,
        "discoveryScopeStatus": "DiscoverySucceeded"
      },
      "tomcatDiscovery": {
        "totalWebServerCount": 0,
        "totalWebApplicationCount": 0,
        "discoveryScopeStatus": "DiscoverySucceeded"
      },
      "appsAndRoles": null,
      "totalApplicationCount": 0,
      "totalInstanceCount": -1,
      "ipAddresses": "",
      "productSupportStatus": {
        "currentVersion": "6.2.9200",
        "esuStatus": "Unknown",
        "supportStatus": "Unknown",
        "supportEndDate": "0001-01-01T00:00:00",
        "esuYear": "Unknown"
      },
      "discoveredWorkloads": [],
      "eTag": "redacted",
      "numberOfProcessorCore": 2,
      "allocatedMemoryInMB": 4095.0,
      "operatingSystemDetails": {
        "osType": "WindowsGuest",
        "osName": "Windows NT 6.2Build 9200 ",
        "osVersion": "6.2.9200",
        "osArchitecture": "x64"
      },
      "biosSerialNumber": null,
      "biosGuid": "bios-guid",
      "isDeleted": false,
      "createdTimestamp": "2026-03-30T12:50:24.3488832Z",
      "tags": {},
      "updatedTimestamp": "2026-03-30T14:34:17.2385399Z"
    },
    "tags": {}
  }
]
```
### Get the Run-As Account ID (Optional)

To push-install the Mobility agent, you must specify credentials:

```http
(for VMware VMs) GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.OffAzure/VMwareSites/{siteName}/runasaccounts?api-version=2023-06-06
```
For physical machines, use runasaccounts from `properties.runAsAccountId` from machine details.

**Sample Response (Run as account details)**

```json
[
  {
    "id": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.OffAzure/serversites/server-site-name/runasaccounts/run-as-account-id-1",
    "name": "run-as-account-id-1",
    "type": "Microsoft.OffAzure/serversites/runasaccounts",
    "properties": {
      "displayName": "Admin",
      "credentialType": "WindowsServer",
      "createdTimestamp": "2026-03-27T09:55:26.2199115Z",
      "updatedTimestamp": "2026-03-27T10:03:36.9959594Z",
      "applianceName": "appliance-name"
    }
  },
  {
    "id": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.OffAzure/serversites/server-site-name/runasaccounts/run-as-account-id-2",
    "name": "run-as-account-id-2",
    "type": "Microsoft.OffAzure/serversites/runasaccounts",
    "properties": {
      "displayName": "credentialLessRunAsAccount",
      "credentialType": "CredentialLessAccount",
      "createdTimestamp": "2026-03-27T09:55:26.3762304Z",
      "updatedTimestamp": "2026-03-27T10:03:37.2459485Z",
      "applianceName": "appliance-name"
    }
  }
]
```
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
    "policyId": "/Subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.RecoveryServices/vaults/vault-name/replicationPolicies/24-hour-replication-policy",
    "providerSpecificDetails": {
        "instanceType": "InMageRcm",
        "fabricDiscoveryMachineId": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.OffAzure/VMwareSites/vmware-site-name/machines/machine-id",
        "licenseType": "NoLicenseType",
        "disksToInclude": [
            {
                "diskId": "disk-id-1",
                "logStorageAccountId": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.Storage/storageAccounts/storage-account-name",
                "diskType": "Standard_LRS",
                "isFabricDiscoveryDiskId": "true",
                "sectorSizeInBytes": 0,
                "diskSizeInGB": 50
            },
            {
                "diskId": "disk-id-2",
                "logStorageAccountId": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.Storage/storageAccounts/storage-account-name",
                "diskType": "Standard_LRS",
                "isFabricDiscoveryDiskId": "true",
                "sectorSizeInBytes": 0,
                "diskSizeInGB": 10
            }
        ],
        "processServerId": "process-server-id",
        "runAsAccountId": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.OffAzure/VMwareSites/vmware-site-name/runasaccounts/run-as-account-id",
        "targetNetworkId": "/subscriptions/subscription-id/resourceGroups/target-resource-group/providers/Microsoft.Network/virtualNetworks/vnet-name",
        "targetSubnetName": "default",
        "targetResourceGroupId": "/subscriptions/subscription-id/resourceGroups/target-resource-group",
        "targetVmSecurityProfile": {
            "targetVmConfidentialEncryption": "Disabled",
            "targetVmTpm": "Enabled",
            "targetVmSecureBoot": "Enabled",
            "targetVmSecurityType": "TrustedLaunch"
        },
        "targetBootDiagnosticsStorageAccountId": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.Storage/storageAccounts/storage-account-name",
        "linuxLicenseType": "NoLicenseType",
        "targetVmName": "target-vm-name"
    },
    "protectableItemId": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.OffAzure/VMwareSites/vmware-site-name/machines/machine-id"
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
                        "id": "/Subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.RecoveryServices/vaults/vault-name/replicationFabrics/fabric-name/replicationProtectionContainers/replication-container/replicationProtectedItems/machine-id",
                        "name": "machine-id",
                        "type": "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems",
                        "properties": {
                            "friendlyName": "target-vm-name",
                            "protectedItemType": "",
                            "protectableItemId": null,
                            "recoveryServicesProviderId": "/Subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.RecoveryServices/vaults/vault-name/replicationFabrics/fabric-name/replicationRecoveryServicesProviders/process-server-id",
                            "primaryFabricFriendlyName": "fabric-name",
                            "primaryFabricProvider": "InMageRcmFabric",
                            "recoveryFabricFriendlyName": "Microsoft Azure",
                            "recoveryFabricId": "Microsoft Azure",
                            "primaryProtectionContainerFriendlyName": "replication-container",
                            "recoveryProtectionContainerFriendlyName": "Microsoft Azure",
                            "protectionState": "UnplannedFailoverFailed",
                            "protectionStateDescription": "Failover failed",
                            "activeLocation": "Primary",
                            "testFailoverState": "MarkedForDeletion",
                            "testFailoverStateDescription": "Cleaning up test environment",
                            "switchProviderState": "None",
                            "switchProviderStateDescription": null,
                            "allowedOperations": [
                                "UnplannedFailover",
                                "DisableProtection",
                                "TestFailover"
                            ],
                            "replicationHealth": "Critical",
                            "failoverHealth": "Warning",
                            "healthErrors": [
                                {
                                    "innerHealthErrors": [],
                                    "errorSource": "ReplicationUnitFailoverValidatorError",
                                    "errorType": "15",
                                    "errorLevel": "Warning",
                                    "errorCategory": "TestFailover",
                                    "errorCode": "161011",
                                    "summaryMessage": "",
                                    "errorMessage": "No successful test failover has been done on the virtual machine 'target-vm-name'.",
                                    "possibleCauses": "No successful test failover has been done on the virtual machine after it was replicated.",
                                    "recommendedAction": "Do a test failover on the virtual machine.",
                                    "creationTimeUtc": "2026-04-20T20:53:29.879895Z",
                                    "recoveryProviderErrorMessage": null,
                                    "entityId": "internal-id",
                                    "errorId": "6:15",
                                    "customerResolvability": "NotAllowed"
                                }
                            ],
                            "policyId": "/Subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.RecoveryServices/vaults/vault-name/replicationPolicies/24-hour-replication-policy",
                            "policyFriendlyName": "24-hour-replication-policy",
                            "currentScenario": {
                                "scenarioName": "None",
                                "jobId": "/Subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.RecoveryServices/vaults/vault-name/replicationJobs/None",
                                "startTime": "1753-01-01T01:01:01Z"
                            },
                            "failoverRecoveryPointId": null,
                            "providerSpecificDetails": {
                                "instanceType": "InMageRcm",
                                "internalIdentifier": "internal-id",
                                "fabricDiscoveryMachineId": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.OffAzure/VMwareSites/vmware-site-name/machines/machine-id",
                                "multiVmGroupName": null,
                                "discoveryType": "VCenter",
                                "processServerId": "process-server-id",
                                "processorCoreCount": 2,
                                "allocatedMemoryInMB": 4095.0,
                                "processServerName": "appliance-name",
                                "runAsAccountId": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.OffAzure/VMwareSites/vmware-site-name/runasaccounts/run-as-account-id",
                                "osType": "Windows",
                                "firmwareType": "UEFI",
                                "primaryNicIpAddress": "ip-address",
                                "targetGeneration": "V2",
                                "licenseType": "NoLicenseType",
                                "storageAccountId": null,
                                "targetVmName": "target-vm-name",
                                "targetVmSize": "Standard_F2s_v2",
                                "targetResourceGroupId": "/subscriptions/subscription-id/resourceGroups/target-resource-group",
                                "targetLocation": "eastus2euap",
                                "targetAvailabilitySetId": "",
                                "targetAvailabilityZone": "",
                                "targetProximityPlacementGroupId": "",
                                "targetBootDiagnosticsStorageAccountId": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.Storage/storageAccounts/storage-account",
                                "targetNetworkId": "/subscriptions/subscription-id/resourceGroups/target-network-rg/providers/Microsoft.Network/virtualNetworks/vnet-name",
                                "testNetworkId": "/subscriptions/subscription-id/resourceGroups/target-network-rg/providers/Microsoft.Network/virtualNetworks/vnet-name",
                                "failoverRecoveryPointId": null,
                                "lastRecoveryPointReceived": "2026-04-19T13:41:58.1335596Z",
                                "lastRpoInSeconds": 3399,
                                "lastRpoCalculatedTime": "2026-04-19T14:38:36.6808164Z",
                                "lastRecoveryPointId": "/Subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.RecoveryServices/vaults/vault-name/replicationFabrics/fabric-name/replicationProtectionContainers/cloud_cloud-id/replicationProtectedItems/machine-id/recoveryPoints/recovery-point-id",
                                "initialReplicationProgressPercentage": null,
                                "initialReplicationProcessedBytes": null,
                                "initialReplicationTransferredBytes": null,
                                "initialReplicationProgressHealth": "None",
                                "resyncProgressPercentage": null,
                                "resyncProcessedBytes": null,
                                "resyncTransferredBytes": null,
                                "resyncProgressHealth": "None",
                                "resyncRequired": "false",
                                "resyncState": "None",
                                "agentUpgradeState": "None",
                                "lastAgentUpgradeType": null,
                                "agentUpgradeJobId": null,
                                "agentUpgradeAttemptToVersion": null,
                                "protectedDisks": [],
                                "unprotectedDisks": [],
                                "isLastUpgradeSuccessful": "false",
                                "isAgentRegistrationSuccessfulAfterFailover": null,
                                "mobilityAgentDetails": {
                                    "version": "9.66.7643.1",
                                    "latestVersion": null,
                                    "latestAgentReleaseDate": null,
                                    "driverVersion": "9.66.7611.1",
                                    "latestUpgradableVersionWithoutReboot": null,
                                    "lastHeartbeatUtc": "2026-04-19T13:47:24.8791557Z",
                                    "reasonsBlockingUpgrade": [
                                        "AlreadyOnLatestVersion"
                                    ],
                                    "isUpgradeable": "false"
                                },
                                "lastAgentUpgradeErrorDetails": [],
                                "agentUpgradeBlockingErrorDetails": [],
                                "vmNics": [],
                                "discoveredVmDetails": {
                                    "vCenterId": "/subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.OffAzure/VMwareSites/vmware-site-name/vcenters/vcenter-name",
                                    "vCenterFqdn": "",
                                    "datastores": [
                                        "datastore-name"
                                    ],
                                    "ipAddresses": [],
                                    "vmwareToolsStatus": "NotRunning",
                                    "powerStatus": "OFF",
                                    "vmFqdn": "",
                                    "osName": "Windows Server 2019",
                                    "createdTimestamp": "2026-04-12T17:30:44.93064+00:00",
                                    "updatedTimestamp": "2026-04-19T13:58:29.1016242+00:00",
                                    "isDeleted": false,
                                    "lastDiscoveryTimeInUtc": "2026-04-19T14:48:39.4886738Z"
                                },
                                "targetVmTags": [],
                                "seedManagedDiskTags": null,
                                "targetManagedDiskTags": null,
                                "targetNicTags": null,
                                "sqlServerLicenseType": "NotSpecified",
                                "supportedOSVersions": null,
                                "osName": "Microsoft Windows Server 2022 Datacenter",
                                "targetVmSecurityProfile": {
                                    "targetVmSecurityType": "None",
                                    "targetVmSecureBoot": "Disabled",
                                    "targetVmTpm": "Disabled",
                                    "targetVmMonitoring": "Disabled",
                                    "targetVmConfidentialEncryption": "Disabled"
                                }
                            },
                            "recoveryContainerId": "/Subscriptions/subscription-id/resourceGroups/resource-group/providers/Microsoft.RecoveryServices/vaults/vault-name/replicationFabrics/recovery-fabric-id/replicationProtectionContainers/recovery-container-id",
                            "eventCorrelationId": "event-correlation-id"
                        }
                    }
                ],
                "nextLink": null
            },
            "contentLength": 12791
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

[Azure PowerShell](https://github.com/Azure-Samples/azure-docs-powershell-samples/tree/main/azure-migrate/migrate-at-scale-with-simplified-agent-based-setup) samples include scripts for enabling migration, running test migrations, cleaning up test migrations, performing migrations, and disabling migration. These scripts take input from a CSV file. Use these samples as a reference for integration.

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
