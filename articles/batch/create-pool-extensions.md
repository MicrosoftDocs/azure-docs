---
title: Use extensions with Batch pools
description: Extensions are small applications that facilitate post-provisioning configuration and setup on Batch compute nodes.
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 12/05/2023
---

# Use extensions with Batch pools

Extensions are small applications that facilitate post-provisioning configuration and setup on Batch compute nodes. You can select any of the extensions that are allowed by Azure Batch and install them on the compute nodes as they're provisioned. After that, the extension can perform its intended operation.

You can check the live status of the extensions you use and retrieve the information they return in order to pursue any detection, correction, or diagnostics capabilities.

## Prerequisites

- Pools with extensions must use [Virtual Machine Configuration](nodes-and-pools.md#virtual-machine-configuration).
- The CustomScript extension type is reserved for the Azure Batch service and can't be overridden.
- Some extensions may need pool-level Managed Identity accessible in the context of a compute node in order to function properly. See [configuring managed identities in Batch pools](managed-identity-pools.md) if applicable for the extensions.

> [!TIP]
> Extensions cannot be added to an existing pool. Pools must be recreated to add, remove, or update extensions.

## Supported extensions

The following extensions can currently be installed when creating a Batch pool:

- [Azure Key Vault extension for Linux](../virtual-machines/extensions/key-vault-linux.md)
- [Azure Key Vault extension for Windows](../virtual-machines/extensions/key-vault-windows.md)
- [Azure Monitor Logs analytics and monitoring extension for Linux](../virtual-machines/extensions/oms-linux.md)
- [Azure Monitor Logs analytics and monitoring extension for Windows](../virtual-machines/extensions/oms-windows.md)
- [Azure Desired State Configuration (DSC) extension](../virtual-machines/extensions/dsc-overview.md)
- [Azure Diagnostics extension for Windows VMs](../virtual-machines/windows/extensions-diagnostics.md)
- [HPC GPU driver extension for Windows on AMD](../virtual-machines/extensions/hpccompute-amd-gpu-windows.md)
- [HPC GPU driver extension for Windows on NVIDIA](../virtual-machines/extensions/hpccompute-gpu-windows.md)
- [HPC GPU driver extension for Linux on NVIDIA](../virtual-machines/extensions/hpccompute-gpu-linux.md)
- [Microsoft Antimalware extension for Windows](../virtual-machines/extensions/iaas-antimalware-windows.md)
- [Azure Monitor agent for Linux](../azure-monitor/agents/azure-monitor-agent-manage.md)
- [Azure Monitor agent for Windows](../azure-monitor/agents/azure-monitor-agent-manage.md)

You can request support for other publishers and/or extension types by opening a support request.

## Create a pool with extensions

The following example creates a Batch pool of Linux/Windows nodes that uses the Azure Key Vault extension.

REST API URI

```http
 PUT https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Batch/batchAccounts/<batchaccountName>/pools/<batchpoolName>?api-version=2021-01-01
```

Request Body for Linux node

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
            "typeHandlerVersion": "3.0",
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
            "protectedSettings": {}
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
  },
  "identity": {
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "/subscriptions/042998e4-36dc-4b7d-8ce3-a7a2c4877d33/resourceGroups/ACR/providers/Microsoft.ManagedIdentity/userAssignedIdentities/testumaforpools": {}
    }
  }
}
```

Request Body for Windows node

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
                    "publisher": "microsoftwindowsserver",
                    "offer": "windowsserver",
                    "sku": "2022-datacenter",
                    "version": "latest"
                },
                "nodeAgentSkuId": "batch.node.windows amd64",
                "extensions": [
                    {
                        "name": "secretext",
                        "type": "KeyVaultForWindows",
                        "publisher": "Microsoft.Azure.KeyVault",
                        "typeHandlerVersion": "3.0",
                        "autoUpgradeMinorVersion": true,
                        "settings": {
                            "secretsManagementSettings": {
                                "pollingIntervalInS": "300",
                                "requireInitialSync": true,
                                "observedCertificates": [
                                    {
                                        "https://testkvwestus2.vault.azure.net/secrets/authsecreat"
                                        "certificateStoreLocation": "LocalMachine",
                                        "keyExportable": true
                                    }
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
    },
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "/subscriptions/042998e4-36dc-4b7d-8ce3-a7a2c4877d33/resourceGroups/ACR/providers/Microsoft.ManagedIdentity/userAssignedIdentities/testumaforpools": {}
        }
    }
}
```

## Get extension data from a pool

The following example retrieves data from the Azure Key Vault extension.

REST API URI

```http
 GET https://<accountName>.<region>.batch.azure.com/pools/<poolName>/nodes/<tvmNodeName>/extensions/secretext?api-version=2010-01-01
```

Response Body

```json
{
  "odata.metadata": "https://testwestus2batch.westus2.batch.azure.com/$metadata#extensions/@Element",
  "instanceView": {
    "name": "secretext",
    "statuses": [
      {
        "code": "ProvisioningState/succeeded",
        "level": 0,
        "displayStatus": "Provisioning succeeded",
        "message": "Successfully started Key Vault extension service. 2021-02-08T19:49:39Z"
      }
    ]
  },
  "vmExtension": {
    "name": "KVExtensions",
    "publisher": "Microsoft.Azure.KeyVault",
    "type": "KeyVaultForLinux",
    "typeHandlerVersion": "1.0",
    "autoUpgradeMinorVersion": true,
    "settings": "{\r\n  \"secretsManagementSettings\": {\r\n    \"pollingIntervalInS\": \"300\",\r\n    \"certificateStoreLocation\": \"/var/lib/waagent/Microsoft.Azure.KeyVault\",\r\n    \"requireInitialSync\": true,\r\n    \"observedCertificates\": [\r\n      \"https://testkvwestus2.vault.azure.net/secrets/testumi\"\r\n    ]\r\n  },\r\n  \"authenticationSettings\": {\r\n    \"msiEndpoint\": \"http://169.254.169.254/metadata/identity\",\r\n    \"msiClientId\": \"885b1a3d-f13c-4030-afcf-922f05044d78dc\"\r\n  }\r\n}"
  }
}
```

## Troubleshooting Key Vault Extension

If Key Vault extension is configured incorrectly, the compute node might be in a usable state. To troubleshoot Key Vault extension failure, you can temporarily set requireInitialSync to false and redeploy your pool, then the compute node is in idle state, you can log in to the compute node to check KeyVault extension logs for errors and fix the configuration issues. Visit following Key Vault extension doc link for more information.

- [Azure Key Vault extension for Linux](../virtual-machines/extensions/key-vault-linux.md)
- [Azure Key Vault extension for Windows](../virtual-machines/extensions/key-vault-windows.md)

## Next steps

- Learn about various ways to [copy applications and data to pool nodes](batch-applications-to-pool-nodes.md).
- Learn more about working with [nodes and pools](nodes-and-pools.md).
