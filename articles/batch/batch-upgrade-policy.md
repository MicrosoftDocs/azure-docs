---
title: Provision a pool with Auto OS Upgrade
description: Learn how to create a Batch pool with Auto OS Upgrade so that customers can have control over their OS upgrade strategy to ensure safe, workload-aware OS upgrade deployments.
ms.topic: how-to
ms.date: 10/30/2023
ms.custom: 
---

# Create an Azure Batch pool with Auto OS Upgrade

When you create an Azure Batch pool, you can provision the pool with nodes that have Auto OS Upgrade enabled. This article explains how to set up a Batch pool with Auto OS Upgrade.

## Why use Auto OS Upgrade?

Auto OS Upgrade is used to implement an automatic operating system upgrade strategy and control within Azure Batch Pools. Here are some reasons for using Auto OS Upgrade:

- **Security.** Auto OS Upgrade ensures timely patching of vulnerabilities and security issues within the operating system image, thereby enhancing the security of compute resources. This helps prevent potential security vulnerabilities from posing a threat to applications and data.
- **Minimized Availability Disruption.** Auto OS Upgrade is used to minimize the availability disruption of compute nodes during OS upgrades. This is achieved through task-scheduling-aware upgrade deferral and support for rolling upgrades, ensuring that workloads experience minimal disruption.
- **Flexibility.** Auto OS Upgrade allows you to configure your automatic operating system upgrade strategy, including percentage-based upgrade coordination and rollback support. This means you can customize your upgrade strategy to meet your specific performance and availability requirements.
- **Control.** Auto OS Upgrade provides you with control over your operating system upgrade strategy to ensure secure, workload-aware upgrade deployments. You can tailor your policy configurations to meet the specific needs of your organization.

In summary, the use of Auto OS Upgrade helps you achieve automatic operating system upgrades, leading to improved security, minimized availability disruptions, and greater control and flexibility for your workloads. This is crucial for maintaining the health and security of compute resources.

## How does Auto OS Upgrade work?

When upgrading images, VMs in Azure Batch Pool will follow the same work flow as VirtualMachineScaleSets. An upgrade works by **replacing the OS disk of a VM with a new disk created using the latest image version**. Any configured extensions and custom data scripts are run on the OS disk, while data disks are retained. 

By default, upgrades take place in batches, with no more than 20% of the scale set upgrading at any time. The upgrades take place during off-peak hours of a region by default, generally between 10 PM to 6 AM local time.

The eligibility for image upgrades in a region with a scale set can occur either through the availablity-first process for platform images or custom images:

* For platform images, the upgrade process follows a monthly schedule to roll out supported OS platform image upgrades.
* For custom images, the upgrade takes place when a new image is published and replicated to the specific region of that scale set.

The image upgrade is then applied to an individual scale set in a batched manner as follows:

1. Before commencing the upgrade, the orchestrator ensures that no more than 20% of instances in the entire scale set are in an unhealthy state, regardless of the reason for their health status.
2. The upgrade orchestrator identifies a batch of VM instances to be upgraded. Each batch contains a maximum of 20% of the total instance count, with a minimum batch size of one virtual machine. There is no minimum scale set size requirement, and scale sets with 5 or fewer instances will have 1 VM per upgrade batch as the minimum batch size.
3. The OS disk of each VM within the selected upgrade batch is replaced with a new OS disk created from the latest image version. All specified extensions and configurations in the scale set model are applied to the upgraded instance.
4. The upgrade process includes a waiting period of up to 5 minutes for an instance to regain a healthy state before proceeding to upgrade the next batch. If an instance fails to recover its health within this 5-minute window after an upgrade, the previous OS disk for that instance is automatically restored by default.
5. The upgrade orchestrator also monitors the percentage of instances that become unhealthy after an upgrade. If more than 20% of the upgraded instances become unhealthy during the upgrade process, the upgrade will be halted.
6. This entire process continues until all instances within the scale set have undergone the upgrade, ensuring that all instances are running the latest OS image while minimizing disruptions and ensuring overall system health.

## Supported OS images
Only certain OS platform images are currently supported. Custom images are supported if the pool uses custom images through [Azure Compute Gallery](../virtual-machines/shared-image-galleries.md).

The following platform SKUs are currently supported (and more are added periodically):

| Publisher              | OS Offer                     | Sku                                               |
| ---------------------- | ---------------------------- | ------------------------------------------------- |
| Canonical              | UbuntuServer                 | 18.04-LTS                                         |
| Canonical              | UbuntuServer                 | 18_04-LTS-Gen2                                    |
| Canonical              | 0001-com-ubuntu-server-focal | 20_04-LTS                                         |
| Canonical              | 0001-com-ubuntu-server-focal | 20_04-LTS-Gen2                                    |
| Canonical              | 0001-com-ubuntu-server-jammy | 22_04-LTS                                         |
| MicrosoftCblMariner    | Cbl-Mariner                  | cbl-mariner-1                                     |
| MicrosoftCblMariner    | Cbl-Mariner                  | 1-Gen2                                            |
| MicrosoftCblMariner    | Cbl-Mariner                  | cbl-mariner-2                                     |
| MicrosoftCblMariner    | Cbl-Mariner                  | cbl-mariner-2-Gen2                                |
| MicrosoftSqlServer     | Sql2017-ws2019               | enterprise                                        |
| MicrosoftWindowsServer | WindowsServer                | 2012-R2-Datacenter                                |
| MicrosoftWindowsServer | WindowsServer                | 2016-Datacenter                                   |
| MicrosoftWindowsServer | WindowsServer                | 2016-Datacenter-gensecond                         |
| MicrosoftWindowsServer | WindowsServer                | 2016-Datacenter-gs                                |
| MicrosoftWindowsServer | WindowsServer                | 2016-Datacenter-smalldisk                         |
| MicrosoftWindowsServer | WindowsServer                | 2016-Datacenter-with-Containers                   |
| MicrosoftWindowsServer | WindowsServer                | 2016-Datacenter-with-containers-gs                |
| MicrosoftWindowsServer | WindowsServer                | 2019-Datacenter                                   |
| MicrosoftWindowsServer | WindowsServer                | 2019-Datacenter-Core                              |
| MicrosoftWindowsServer | WindowsServer                | 2019-Datacenter-Core-with-Containers              |
| MicrosoftWindowsServer | WindowsServer                | 2019-Datacenter-gensecond                         |
| MicrosoftWindowsServer | WindowsServer                | 2019-Datacenter-gs                                |
| MicrosoftWindowsServer | WindowsServer                | 2019-Datacenter-smalldisk                         |
| MicrosoftWindowsServer | WindowsServer                | 2019-Datacenter-with-Containers                   |
| MicrosoftWindowsServer | WindowsServer                | 2019-Datacenter-with-Containers-gs                |
| MicrosoftWindowsServer | WindowsServer                | 2022-Datacenter                                   |
| MicrosoftWindowsServer | WindowsServer                | 2022-Datacenter-smalldisk                         |
| MicrosoftWindowsServer | WindowsServer                | 2022-Datacenter-smalldisk-g2                      |
| MicrosoftWindowsServer | WindowsServer                | 2022-Datacenter-core                              |
| MicrosoftWindowsServer | WindowsServer                | 2022-Datacenter-core-smalldisk                    |
| MicrosoftWindowsServer | WindowsServer                | 2022-Datacenter-g2                                |
| MicrosoftWindowsServer | WindowsServer                | Datacenter-core-20h2-with-containers-smalldisk-gs |
| MicrosoftWindowsServer | WindowsServer                | 2022-Datacenter-azure-edition                     |
| MicrosoftWindowsServer | WindowsServer                | 2022-Datacenter-azure-edition-smalldisk           |

## Prerequisites

- **Enablement**. This feature is still in preview, so you need to submit a [support request](../azure-portal/supportability/how-to-create-azure-support-request.md) to enable this feature.

## Requirements

* The version property of the image must be set to **latest**. 
* Use Batch API version 2023-11-01 or higher. 
* Ensure that external resources specified in the pool are available and updated. Examples include SAS URI for bootstrapping payload in VM extension properties, payload in storage account, reference to secrets in the model, and more. 
* If you are using the property *virtualMachineConfiguration.windowsConfiguration.enableAutomaticUpdates*, this property must set to false in the pool definition. The enableAutomaticUpdates property enables in-VM patching where "Windows Update" applies operating system patches without replacing the OS disk. With automatic OS image upgrades enabled, an extra patching process through Windows Update is not required.

### Additional requirements for custom images

* The VMs will be upgraded to the latest version of the Azure Compute Gallery image when a new version of the image is published and replicated to the region of that pool. If the new image is not replicated to the region where the pool is deployed, the VM instances will not be upgraded to the latest version. Regional image replication allows you to control the rollout of the new image for your VMs.
* The new image version should not be excluded from the latest version for that gallery image. Image versions excluded from the gallery image's latest version will not be rolled out through automatic OS image upgrade.

## Configure Auto OS Upgrade

If you intend to implement Auto OS Upgrades within a pool, it's essential to configure the **UpgradePolicy** field during the pool creation process. To configure automatic OS image upgrades, make sure that the *automaticOSUpgradePolicy.enableAutomaticOSUpgrade* property is set to 'true' in the pool definition.

> [!Note]
> **Upgrade Policy mode** and **Automatic OS Upgrade Policy** are separate settings and control different aspects of the provisioned scale set by Azure Batch. The Upgrade Policy mode will determine what happens to existing instances in scale set. However, Automatic OS Upgrade Policy enableAutomaticOSUpgrade is specific to the OS image and tracks changes the image publisher has made and determines what happens when there is an update to the image.

> [!Note]
> We strongly advise enabling the *automaticOSUpgradePolicy.osRollingUpgradeDeferral* property by setting it to 'true.' When an upgrade becomes available while a batch node is actively running a task, this property will postpone OS upgrades on the node. Once the node transitions to an idle state, Batch will issue a callback and initiate the upgrade process.

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

