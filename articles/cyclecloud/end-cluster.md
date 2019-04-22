---
title: Terminate Clusters in Azure CycleCloud | Microsoft Docs
description: Free up resources after completing jobs in Azure CycleCloud.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Terminate a Cluster

When all submitted jobs are complete, you no longer need the cluster. To clean up resources and free them for other jobs, click **Terminate** in the CycleCloud GUI to shut down all of the infrastructure. All underlying Azure resources will be cleaned up as part of the cluster termination, which may take several minutes.

## Delete a Resource Group

To remove the resources no longer needed, you can simply delete the resource group. Everything within that group will be cleaned up as part of the process:

```azurecli-interactive
az group delete --name "{RESOURCE GROUP}"
```

## Delete the Service Principal

Run the following command to delete the service principal created at the start of the lab, substituting the name used if other than the example name:

```azurecli-interactive
az ad sp delete --id "http://CycleCloudApp"
```
