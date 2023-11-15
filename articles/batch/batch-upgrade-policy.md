---
title: Provision a pool with Auto OS Upgrade
description: Learn how to create a Batch pool with Auto OS Upgrade so that customers can have control over their OS upgrade strategy to ensure safe, workload-aware OS upgrade deployments.
ms.topic: how-to
ms.date: 10/30/2023
ms.custom: 
---

# Create an Azure Batch pool with Auto OS Upgrade

> [!IMPORTANT]
> - Support for pools with Auto OS Upgrade in Azure Batch is currently in public preview, and is currently controlled by an account-level feature flag. If you want to use this feature, please start a [support request](../azure-portal/supportability/how-to-create-azure-support-request.md) and provide your batch account to request its activation.
> - This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> - For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When you create an Azure Batch pool, you can provision the pool with nodes that have Auto OS Upgrade enabled. This article explains how to set up a Batch pool with Auto OS Upgrade.

## Why use Auto OS Upgrade?

Auto OS Upgrade is used to implement an automatic operating system upgrade strategy and control within Azure Batch Pools. Here are some reasons for using Auto OS Upgrade:

- **Security.** Auto OS Upgrade ensures timely patching of vulnerabilities and security issues within the operating system image, thereby enhancing the security of compute resources. This helps prevent potential security vulnerabilities from posing a threat to applications and data.
- **Minimized Availability Disruption.** Auto OS Upgrade is used to minimize the availability disruption of compute nodes during OS upgrades. This is achieved through task-scheduling-aware upgrade deferral and support for rolling upgrades, ensuring that workloads experience minimal disruption.
- **Flexibility.** Auto OS Upgrade allows you to configure your automatic operating system upgrade strategy, including percentage-based upgrade coordination and rollback support. This means you can customize your upgrade strategy to meet your specific performance and availability requirements.
- **Control.** Auto OS Upgrade provides you with control over your operating system upgrade strategy to ensure secure, workload-aware upgrade deployments. You can tailor your policy configurations to meet the specific needs of your organization.

In summary, the use of Auto OS Upgrade helps you achieve automatic operating system upgrades, leading to improved security, minimized availability disruptions, and greater control and flexibility for your workloads. This is crucial for maintaining the health and security of compute resources.

## How does Auto OS Upgrade work?

When upgrading images, VMs in Azure Batch Pool will follow roughly the same work flow as VirtualMachineScaleSets. To learn more about the detailed steps involved in the Auto OS Upgrade process for VirtualMachineScaleSets, you can refer to [VMSS page](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md#how-does-automatic-os-image-upgrade-work).

However, there will be a difference for Batch to handle upgrades if *automaticOSUpgradePolicy.osRollingUpgradeDeferral* is set to 'true'. When an upgrade becomes available while a batch node is actively running a task, this property will postpone OS upgrades on the node. Once the node transitions to an idle state, Batch will issue a callback and initiate the upgrade process. Thus, We strongly advise enabling the *automaticOSUpgradePolicy.osRollingUpgradeDeferral* feature.

> [!Note]
> If a pool has enabled *osRollingUpgradeDeferral*, its nodes will be displayed as *upgradingos* state during the upgrade process. Please note that the *upgradingos* state will only be shown when you are using the the API version of 2023-11-01 or later. If you are using an old API version to call *GetTVM/ListTVM*, the node will be in a *rebooting* state when upgrading.

## Supported OS images
Only certain OS platform images are currently supported for automatic upgrade. For detailed images list, you can get from [VMSS page](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md#supported-os-images).

## Requirements

* The version property of the image must be set to **latest**. 
* Use Batch API version 2023-11-01 or higher. 
* Ensure that external resources specified in the pool are available and updated. Examples include SAS URI for bootstrapping payload in VM extension properties, payload in storage account, reference to secrets in the model, and more. 
* If you are using the property *virtualMachineConfiguration.windowsConfiguration.enableAutomaticUpdates*, this property must set to 'false' in the pool definition. The enableAutomaticUpdates property enables in-VM patching where "Windows Update" applies operating system patches without replacing the OS disk. With automatic OS image upgrades enabled, an extra patching process through Windows Update is not required.

### Additional requirements for custom images

* The VMs will be upgraded to the latest version of the Azure Compute Gallery image when a new version of the image is published and replicated to the region of that pool. If the new image is not replicated to the region where the pool is deployed, the VM instances will not be upgraded to the latest version. Regional image replication allows you to control the rollout of the new image for your VMs.
* The new image version should not be excluded from the latest version for that gallery image. Image versions excluded from the gallery image's latest version will not be rolled out through automatic OS image upgrade.

## Configure Auto OS Upgrade

If you intend to implement Auto OS Upgrades within a pool, it's essential to configure the **UpgradePolicy** field during the pool creation process. To configure automatic OS image upgrades, make sure that the *automaticOSUpgradePolicy.enableAutomaticOSUpgrade* property is set to 'true' in the pool definition.

> [!Note]
> **Upgrade Policy mode** and **Automatic OS Upgrade Policy** are separate settings and control different aspects of the provisioned scale set by Azure Batch. The Upgrade Policy mode will determine what happens to existing instances in scale set. However, Automatic OS Upgrade Policy enableAutomaticOSUpgrade is specific to the OS image and tracks changes the image publisher has made and determines what happens when there is an update to the image.

> [!Note]
> If you are using [user subscription](batch-account-create-portal.md#additional-configuration-for-user-subscription-mode), it's essential to note that a subscription feature **Microsoft.Compute/RollingUpgradeDeferral** is required for your subscription to be registered. You cannot use *osRollingUpgradeDeferral* unless this feature is registered. To enable this feature, please [manually register](../azure-resource-manager/management/preview-features.md) it on your subscription.

### REST API
The following example describes how to create a pool with Auto OS Upgrade via REST API:

```http
PUT https://management.azure.com/subscriptions/<subscriptionid>/resourceGroups/<resourcegroupName>/providers/Microsoft.Batch/batchAccounts/<batchaccountname>/pools/<poolname>?api-version=2023-11-01
```

Request Body

```json
{
    "name": "test1",
    "type": "Microsoft.Batch/batchAccounts/pools",
    "parameters": {
        "properties": {
            "vmSize": "Standard_d4s_v3",
            "deploymentConfiguration": {
                "virtualMachineConfiguration": {
                    "imageReference": {
                        "publisher": "MicrosoftWindowsServer",
                        "offer": "WindowsServer",
                        "sku": "2019-datacenter-smalldisk",
                        "version": "latest"
                    },
                    "nodePlacementConfiguration": {
                        "policy": "Zonal"
                    },
                    "nodeAgentSKUId": "batch.node.windows amd64",
                    "windowsConfiguration": {
                        "enableAutomaticUpdates": false
                    }
                }
            },
            "scaleSettings": {
                "fixedScale": {
                    "targetDedicatedNodes": 2,
                    "targetLowPriorityNodes": 0
                }
            },
            "upgradePolicy": {
                "mode": "Automatic",
                "automaticOSUpgradePolicy": {
                    "disableAutomaticRollback": true,
                    "enableAutomaticOSUpgrade": true,
                    "useRollingUpgradePolicy": true,
                    "osRollingUpgradeDeferral": true
                },
                "rollingUpgradePolicy": {
                    "enableCrossZoneUpgrade": true,
                    "maxBatchInstancePercent": 20,
                    "maxUnhealthyInstancePercent": 20,
                    "maxUnhealthyUpgradedInstancePercent": 20,
                    "pauseTimeBetweenBatches": "PT0S",
                    "prioritizeUnhealthyInstances": false,
                    "rollbackFailedInstancesOnPolicyBreach": false
                }
            }
        }
    }
}
```

### SDK (C#)
The following example describes how to create a pool with Auto OS Upgrade via C# codes:


## Next steps

