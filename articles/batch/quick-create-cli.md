---
title: Azure Quickstart - Run Batch job - CLI | Microsoft Docs
description: Quickly learn to run a Batch job with the Azure CLI.
services: batch
documentationcenter: 
author: dlepow
manager: timlt
editor: 
tags: 

ms.assetid: 
ms.service: batch
ms.devlang: azurecli
ms.topic: quickstart
ms.tgt_pltfrm: 
ms.workload: 
ms.date: 10/23/2017
ms.author: danlep
ms.custom: mvc
---

# Run a sample Batch job with the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This guide details using the Azure CLI to .

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.?? or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az_group_create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

## Create Batch account

Create a Batch account with the [az batch account create](/cli/azure/batch/account#az_batch_account_create) command. 

The following example creates a Batch account named *myBatchAccount* in *myResourceGroup* .  

```azurecli-interactive 
az batch account create --name myBatchAccount --resource-group myResourceGroup --location eastus
```

Log in to the account with the [az batch account login](/cli/azure/batch/account#az_batch_account_login) command. This example uses shared key authentication, based on the Batch account key.

```azurecli-interactive 
az batch account login --name myBatchAccount --resource-group myResourceGroup --shared-key-auth
```

## Create a Batch pool 

Create a pool of VMs for Batch using the [az batch pool create](/cli/azure/batch/pool#az_batch_pool_create) command. The following example creates a pool named *mypool-linux* of 4 size A1_V2 nodes running Ubuntu 16.04 LTS.
 
```azurecli-interactive
az batch pool create --id mypool-linux --vm-size standard_a1_v2 --target-dedicated-nodes 4 --image canonical:ubuntuserver:16.04.0-LTS    --node-agent-sku-id "batch.node.ubuntu 16.04" 
```

The following example creates a pool named *mypool-windows* of 4 size A1_V2 nodes running Windows Server 2016 Datacenter.

```azurecli-interactive
az batch pool create --id mypool-windows --vm-size standard_a1_v2 --target-dedicated-nodes 4 --image MicrosoftWindowsServer:WindowsServer:2016-Datacenter    --node-agent-sku-id "batch.node.windows amd64" 
```

It can take a few minutes to provision the pool resources. To see the status of the pool, run the [az batch pool show](/cli/azure/batch/pool#az_batch_pool_show) command. For example, the following command shows the *mypool-linux* pool:

```azurecli-interactive
az batch pool show --pool-id mypool-linux -o table
```

Output is similar to the following:

```JSON
{
  "allocationState": "steady",
  "allocationStateTransitionTime": "2017-10-26T22:37:42.162124+00:00",
  "applicationLicenses": null,
  "applicationPackageReferences": null,
  "autoScaleEvaluationInterval": null,
  "autoScaleFormula": null,
  "autoScaleRun": null,
  "certificateReferences": null,
  "cloudServiceConfiguration": null,
  "creationTime": "2017-10-26T22:35:56.500992+00:00",
  "currentDedicatedNodes": 4,
  "currentLowPriorityNodes": 0,
  "displayName": null,
  "eTag": "0x8D51CC1EC822005",
  "enableAutoScale": false,
  "enableInterNodeCommunication": false,
  "id": "mypool-linux",
  "lastModified": "2017-10-26T22:35:56.500992+00:00",
  "maxTasksPerNode": 1,
  "metadata": null,
  "networkConfiguration": null,
  "resizeErrors": null,
  "resizeTimeout": "0:15:00",
  "startTask": null,
  "state": "active",
  "stateTransitionTime": "2017-10-26T22:35:56.500992+00:00",
  "stats": null,
  "targetDedicatedNodes": 4,
  "targetLowPriorityNodes": 0,
  "taskSchedulingPolicy": {
    "nodeFillType": "spread"
  },
  "url": "https://danlep1026b.eastus.batch.azure.com/pools/mypool-linux",
  "userAccounts": null,
  "virtualMachineConfiguration": {
    "containerConfiguration": null,
    "dataDisks": null,
    "imageReference": {
      "offer": "ubuntuserver",
      "publisher": "canonical",
      "sku": "16.04.0-LTS",
      "version": "latest",
      "virtualMachineImageId": null
    },
    "licenseType": null,
    "nodeAgentSkuId": "batch.node.ubuntu 16.04",
    "osDisk": null,
    "windowsConfiguration": null
  },
  "vmSize": "standard_a1_v2"
```

The pool is completely provisioned when the `allocationState` is `Steady`.

## Create a Batch job

Create a Batch job by using the [az batch job create](/cli/azure/batch/pool#az_batch_job_create) command. A job specifies a pool to run tasks on and optionally a priority and schedule for the work. The following example creates a job *myjob-linux* to run on the pool *mypool-linux*.

```azurecli-interactive 
az batch job create --id myjob-linux --pool-id mypool-linux
```

The following example creates a job *myjob-windows* to run on the pool *mypool-windows*.

```azurecli-interactive 
az batch job create --id myjob-windows --pool-id mypool-windows
```


## Create sample tasks

Use the following command to create Batch tasks.

```azurecli-interactive 
```

## View task status

Use the following command to view the status of the Batch tasks.

```azurecli-interactive 
```

## View task output

Use the following command to view the output of one of the Batch tasks.

```azurecli-interactive 
```



## Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#delete) command to remove the resource group, VM, and all related resources. Exit the SSH session to your VM, then delete the resources as follows:

```azurecli-interactive 
az group delete --name myResourceGroup
```

## Next steps

In this quick start, you’ve .... To learn more about Azure Batch, continue to the tutorial for Batch.


> [!div class="nextstepaction"]
> [Azure Batch tutorials](./tutorial-.....md)
