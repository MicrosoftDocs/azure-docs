---
title: Provision a pool with Auto OS Upgrade
description: Learn how to create a Batch pool with Auto OS Upgrade so that customers can have control over their OS upgrade strategy to ensure safe, workload-aware OS upgrade deployments.
ms.topic: how-to
ms.date: 04/02/2024
ms.custom: 
---

# Create an Azure Batch pool with Automatic Operating System (OS) Upgrade

When you create an Azure Batch pool, you can provision the pool with nodes that have Auto OS Upgrade enabled. This article explains how to set up a Batch pool with Auto OS Upgrade.

## Why use Auto OS Upgrade?

Auto OS Upgrade is used to implement an automatic operating system upgrade strategy and control within Azure Batch Pools. Here are some reasons for using Auto OS Upgrade:

- **Security.** Auto OS Upgrade ensures timely patching of vulnerabilities and security issues within the operating system image, to enhance the security of compute resources. It helps prevent potential security vulnerabilities from posing a threat to applications and data.
- **Minimized Availability Disruption.** Auto OS Upgrade is used to minimize the availability disruption of compute nodes during OS upgrades. It is achieved through task-scheduling-aware upgrade deferral and support for rolling upgrades, ensuring that workloads experience minimal disruption.
- **Flexibility.** Auto OS Upgrade allows you to configure your automatic operating system upgrade strategy, including percentage-based upgrade coordination and rollback support. It means you can customize your upgrade strategy to meet your specific performance and availability requirements.
- **Control.** Auto OS Upgrade provides you with control over your operating system upgrade strategy to ensure secure, workload-aware upgrade deployments. You can tailor your policy configurations to meet the specific needs of your organization.

In summary, the use of Auto OS Upgrade helps improve security, minimize availability disruptions, and provide both greater control and flexibility for your workloads.

## How does Auto OS Upgrade work?

When upgrading images, VMs in Azure Batch Pool will follow roughly the same work flow as VirtualMachineScaleSets. To learn more about the detailed steps involved in the Auto OS Upgrade process for VirtualMachineScaleSets, you can refer to [VirtualMachineScaleSet page](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md#how-does-automatic-os-image-upgrade-work).

However, if *automaticOSUpgradePolicy.osRollingUpgradeDeferral* is set to 'true' and an upgrade becomes available when a batch node is actively running tasks, the upgrade will be delayed until all tasks have been completed on the node.

> [!Note]
> If a pool has enabled *osRollingUpgradeDeferral*, its nodes will be displayed as *upgradingos* state during the upgrade process. Please note that the *upgradingos* state will only be shown when you are using the the API version of 2024-02-01 or later. If you're using an old API version to call *GetTVM/ListTVM*, the node will be in a *rebooting* state when upgrading.

## Supported OS images
Only certain OS platform images are currently supported for automatic upgrade. For detailed images list, you can get from [VirtualMachineScaleSet page](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md#supported-os-images).

## Requirements

* The version property of the image must be set to **latest**. 
* For Batch Management API, use API version 2024-02-01 or higher. For Batch Service API, use API version 2024-02-01.19.0 or higher.
* Ensure that external resources specified in the pool are available and updated. Examples include SAS URI for bootstrapping payload in VM extension properties, payload in storage account, reference to secrets in the model, and more. 
* If you are using the property *virtualMachineConfiguration.windowsConfiguration.enableAutomaticUpdates*, this property must set to 'false' in the pool definition. The enableAutomaticUpdates property enables in-VM patching where "Windows Update" applies operating system patches without replacing the OS disk. With automatic OS image upgrades enabled, an extra patching process through Windows Update isn't required.

### Additional requirements for custom images

* When a new version of the image is published and replicated to the region of that pool, the VMs will be upgraded to the latest version of the Azure Compute Gallery image. If the new image isn't replicated to the region where the pool is deployed, the VM instances won't be upgraded to the latest version. Regional image replication allows you to control the rollout of the new image for your VMs.
* The new image version shouldn't be excluded from the latest version for that gallery image. Image versions excluded from the gallery image's latest version won't be rolled out through automatic OS image upgrade.

## Configure Auto OS Upgrade

If you intend to implement Auto OS Upgrades within a pool, it's essential to configure the **UpgradePolicy** field during the pool creation process. To configure automatic OS image upgrades, make sure that the *automaticOSUpgradePolicy.enableAutomaticOSUpgrade* property is set to 'true' in the pool definition.

> [!Note]
> **Upgrade Policy mode** and **Automatic OS Upgrade Policy** are separate settings and control different aspects of the provisioned scale set by Azure Batch. The Upgrade Policy mode will determine what happens to existing instances in scale set. However, Automatic OS Upgrade Policy enableAutomaticOSUpgrade is specific to the OS image and tracks changes the image publisher has made and determines what happens when there is an update to the image.

> [!IMPORTANT]
> If you are using [user subscription](batch-account-create-portal.md#additional-configuration-for-user-subscription-mode), it's essential to note that a subscription feature **Microsoft.Compute/RollingUpgradeDeferral** is required for your subscription to be registered. You cannot use *osRollingUpgradeDeferral* unless this feature is registered. To enable this feature, please [manually register](../azure-resource-manager/management/preview-features.md) it on your subscription.

### REST API
The following example describes how to create a pool with Auto OS Upgrade via REST API:

```http
PUT https://management.azure.com/subscriptions/<subscriptionid>/resourceGroups/<resourcegroupName>/providers/Microsoft.Batch/batchAccounts/<batchaccountname>/pools/<poolname>?api-version=2024-02-01
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
The following code snippet shows an example of how to use the [Batch .NET](https://www.nuget.org/packages/Microsoft.Azure.Batch/) client library to create a pool of Auto OS Upgrade via C# codes. For more details about Batch .NET, view the [reference documentation](/dotnet/api/microsoft.azure.batch).

```csharp
public async Task CreateUpgradePolicyPool()
{
     // Authenticate
     var clientId = Environment.GetEnvironmentVariable("CLIENT_ID");
     var clientSecret = Environment.GetEnvironmentVariable("CLIENT_SECRET");
     var tenantId = Environment.GetEnvironmentVariable("TENANT_ID");
     var subscriptionId = Environment.GetEnvironmentVariable("SUBSCRIPTION_ID");
     ClientSecretCredential credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
     ArmClient client = new ArmClient(credential, subscriptionId);
 
     // Get an existing Batch account
     string resourceGroupName = "testrg";
     string accountName = "testaccount";
     ResourceIdentifier batchAccountResourceId = BatchAccountResource.CreateResourceIdentifier(subscriptionId, resourceGroupName, accountName);
     BatchAccountResource batchAccount = client.GetBatchAccountResource(batchAccountResourceId);
 
     // get the collection of this BatchAccountPoolResource
     BatchAccountPoolCollection collection = batchAccount.GetBatchAccountPools();
 
     // Define the pool
     string poolName = "testpool";
     BatchAccountPoolData data = new BatchAccountPoolData()
     {
         VmSize = "Standard_d4s_v3",
         DeploymentConfiguration = new BatchDeploymentConfiguration()
         {
             VmConfiguration = new BatchVmConfiguration(new BatchImageReference()
             {
                 Publisher = "MicrosoftWindowsServer",
                 Offer = "WindowsServer",
                 Sku = "2019-datacenter-smalldisk",
                 Version = "latest",
             },
             nodeAgentSkuId: "batch.node.windows amd64")
             {
                 NodePlacementPolicy = BatchNodePlacementPolicyType.Zonal,
                 IsAutomaticUpdateEnabled = false
             },
         },
         ScaleSettings = new BatchAccountPoolScaleSettings()
         {
             FixedScale = new BatchAccountFixedScaleSettings()
             {
                 TargetDedicatedNodes = 2,
                 TargetLowPriorityNodes = 0,
             },
         },
         UpgradePolicy = new UpgradePolicy()
         {
             Mode = UpgradeMode.Automatic,
             AutomaticOSUpgradePolicy = new AutomaticOSUpgradePolicy()
             {
                 DisableAutomaticRollback = true,
                 EnableAutomaticOSUpgrade = true,
                 UseRollingUpgradePolicy = true,
                 OSRollingUpgradeDeferral = true
             },
             RollingUpgradePolicy = new RollingUpgradePolicy()
             {
                 EnableCrossZoneUpgrade = true,
                 MaxBatchInstancePercent = 20,
                 MaxUnhealthyInstancePercent = 20,
                 MaxUnhealthyUpgradedInstancePercent = 20,
                 PauseTimeBetweenBatches = "PT0S",
                 PrioritizeUnhealthyInstances = false,
                 RollbackFailedInstancesOnPolicyBreach = false,
             }
         }
     };
 
     ArmOperation<BatchAccountPoolResource> lro = await collection.CreateOrUpdateAsync(WaitUntil.Completed, poolName, data);
     BatchAccountPoolResource result = lro.Value;
 
     // the variable result is a resource, you could call other operations on this instance as well
     // but just for demo, we get its data from this resource instance
     BatchAccountPoolData resourceData = result.Data;
     // for demo we just print out the id
     Console.WriteLine($"Succeeded on id: {resourceData.Id}");
}
```

## FAQs

- Will my tasks be disrupted if I enabled Auto OS Upgrade?

  Tasks won't be disrupted when *automaticOSUpgradePolicy.osRollingUpgradeDeferral* is set to 'true'. In that case, the upgrade will be postponed until node becomes idle. Otherwise, node will upgrade when it receives a new OS version, regardless of whether it is currently running a task or not. So we strongly advise enabling *automaticOSUpgradePolicy.osRollingUpgradeDeferral*.

## Next steps

- Learn how to use a [managed image](batch-custom-images.md) to create a pool.
- Learn how to use the [Azure Compute Gallery](batch-sig-images.md) to create a pool.
