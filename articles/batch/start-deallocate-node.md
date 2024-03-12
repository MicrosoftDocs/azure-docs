---
title: Start/Deallocate Batch nodes
description: Extensions are small applications that facilitate post-provisioning configuration and setup on Batch compute nodes.
ms.topic: how-to
ms.custom: TODO benjaminli fill in
ms.date: 03/08/2024
---

# Use Start/Deallocate operation with Batch nodes

As of the {API_VERRSION} API version, users can now deallocate their Batch nodes. Deallocated nodes retain their memory contents nad the nodes do not contribute to the user's billing account. This operation is the same as the one listed here: https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume?tabs=osLimitsLinux%2CenablehiberPortal%2CcheckhiberPortal%2CenableWithPortal%2CcliLHE%2CUbuntu18HST%2CPortalDoHiber%2CPortalStatCheck%2CPortalStartHiber%2CPortalImageGallery

After a node has been deallocated, it can be started to resume activity.

## Prerequisites

- Start/Deallocate operations must be specified with a minimum request version of {API_VERSION}
- Note that only nodes created with a Virtual Machine Configuration can be deallocated and started. Moreover, only a node that is in a stable state can be deallocated, and only a node that is in the deallocated state can be started.

> [!TIP]
> Extensions cannot be added to an existing pool. Pools must be recreated to add, remove, or update extensions.

## Node states and workflow

The following extensions can currently be installed when creating a Batch pool:

When a node receives a deallocation request, it's state will change to `deallocating` while the node undergoes deallocation. Once it has been deallocated, the state will be `deallocated`. In this state, the node will be unreachable until it receives a Start request. After this, the node
	state will change to `Starting`, and then finally `Idle` once it has finished. Note that this is only the case when the node state is retrieved using the minimal API version of {API_VERSION}. For previous versions, `deallocating` will appear as the node's previous state, and `deallocated`
	will show as `offline`.

## Create a pool with extensions

The example below creates a Batch pool of Linux nodes that uses the Azure Key Vault extension.

REST API URI

```http
 PUT https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Batch/batchAccounts/<batchaccountName>/pools/<batchpoolName>?api-version=2021-01-01
```

Request Body

```json
{
    "name": "test1",
    "type": "Microsoft.Batch/batchAccounts/pools",
    "properties": {
        "vmSize": "STANDARD_DS2_V2",
        "taskSchedulingPolicy": {
            "nodeFillType": "Pack"
        },
        "deploymentConfiguration": {
            "virtualMachineConfiguration": {
                "imageReference": {
                    "publisher": "microsoftcblmariner",
                    "offer": "cbl-mariner",
                    "sku": "cbl-mariner-2",
                    "version": "latest"
                },
                "nodeAgentSkuId": "batch.node.mariner 2.0",
                "extensions": [
                    {
                        "name": "secretext",
                        "type": "KeyVaultForLinux",
                        "publisher": "Microsoft.Azure.KeyVault",
                        "typeHandlerVersion": "1.0",
                        "autoUpgradeMinorVersion": true,
                        "settings": {
                            "secretsManagementSettings": {
                                "pollingIntervalInS": "300",
                                "certificateStoreLocation": "/var/lib/waagent/Microsoft.Azure.KeyVault",
                                "requireInitialSync": true,
                                "observedCertificates": [
                                    "https://testkvwestus2.vault.azure.net/secrets/authsecreat"
                                ]
                            },
                            "authenticationSettings": {
                                "msiEndpoint": "http://169.254.169.254/metadata/identity",
                                "msiClientId": "885b1a3d-f13c-4030-afcf-9f05044d78dc"
                            }
                        },
                        "protectedSettings":{}
                    }
                ]
            }
        },
        "scaleSettings": {
            "fixedScale": {
                "targetDedicatedNodes": 1,
                "targetLowPriorityNodes": 0,
                "resizeTimeout": "PT15M"
            }
        }
    }
}
```

## Get extension data from a pool

The example below retrieves data from the Azure Key Vault extension.

REST API URI

```http
 GET https://<accountName>.<region>.batch.azure.com/pools/<poolName>/nodes/<tvmNodeName>/extensions/secretext?api-version=2010-01-01
```

Response Body

```json
{
  "odata.metadata":"https://testwestus2batch.westus2.batch.azure.com/$metadata#extensions/@Element","instanceView":{
    "name":"secretext","statuses":[
      {
        "code":"ProvisioningState/succeeded","level":0,"displayStatus":"Provisioning succeeded","message":"Successfully started Key Vault extension service. 2021-02-08T19:49:39Z"
      }
    ]
  },"vmExtension":{
    "name":"KVExtensions","publisher":"Microsoft.Azure.KeyVault","type":"KeyVaultForLinux","typeHandlerVersion":"1.0","autoUpgradeMinorVersion":true,"settings":"{\r\n  \"secretsManagementSettings\": {\r\n    \"pollingIntervalInS\": \"300\",\r\n    \"certificateStoreLocation\": \"/var/lib/waagent/Microsoft.Azure.KeyVault\",\r\n    \"requireInitialSync\": true,\r\n    \"observedCertificates\": [\r\n      \"https://testkvwestus2.vault.azure.net/secrets/testumi\"\r\n    ]\r\n  },\r\n  \"authenticationSettings\": {\r\n    \"msiEndpoint\": \"http://169.254.169.254/metadata/identity\",\r\n    \"msiClientId\": \"885b1a3d-f13c-4030-afcf-922f05044d78dc\"\r\n  }\r\n}"
  }
}

```

## Next steps

Next Steps
- Learn more about working with [nodes and pools](nodes-and-pools.md).
- Learn about [deallocating virtual machines](https://learn.microsoft.com/en-us/azure/virtual-machines/hibernate-resume?tabs=osLimitsLinux%2CenablehiberPortal%2CcheckhiberPortal%2CenableWithPortal%2CcliLHE%2CUbuntu18HST%2CPortalDoHiber%2CPortalStatCheck%2CPortalStartHiber%2CPortalImageGallery).
