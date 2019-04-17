---
title: Azure CycleCloud Quickstart | Microsoft Docs
description: In this quickstart, you will clean up your resources acquired in the previous quickstarts
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Azure CycleCloud Quickstart 4: Clean Up Resources

> [!NOTE]
> If you want to continue with this Azure CycleCloud installation for the [CycleCloud Tutorials](/tutorials/modify-cluster-template.md), you do not need to follow quickstart 4. Be aware that you are charged for usage while the nodes are running, even if no jobs are scheduled. Follow the steps below to free up resources.

## Terminate the Cluster

When all submitted jobs are complete, you no longer need the cluster. To clean up resources and free them for other jobs, click **Terminate** in the CycleCloud GUI to shut down all of the infrastructure. All underlying Azure resources will be cleaned up as part of the cluster termination, which may take several minutes.

![Terminate Cluster](~/images/terminate-cluster.png)

## Delete the Resource Group

To remove the resources you created for the quickstart, you can simply delete the resource group. Everything within that group will be cleaned up as part of the process. Using the example created in the first quickstart:

```azurecli-interactive
az group delete --name "MyQuickstart"
```

## Delete the Service Principal

Run the following command to delete the service principal created at the start of the lab, substituting the name used if other than the example name:

```azurecli-interactive
az ad sp delete --id "http://CycleCloudApp"
```

## Next Steps

If you've gone through all four quickstarts, you've covered the installation, setup, and configuration of Azure CycleCloud, created and ran a simple HPC cluster, added a cost usage alert, submitted 100 jobs, witnessed the auto scaling, and cleaned up after yourself. You've only begun to scratch the surface of what Azure CycleCloud offers - check out the product and documentation pages to learn more!

## Further Reading

* Learn more about [clusters and nodes](clusters.md)
* Explore [cluster templates](cluster-templates.md)
* [Install CycleCloud manually](installation.md)
* Build a [project](projects.md)
