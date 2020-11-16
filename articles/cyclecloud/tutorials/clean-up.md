---
title: Tutorial - Clean-up your CycleCloud cluster
description: Learn how clean up your CycleCloud cluster
author: adriankjohnson
ms.date: 04/01/2020
ms.author: adjohnso
---

# Azure CycleCloud Tutorial 3: Clean Up Resources

> [!NOTE]
> If you want to continue to use this Azure CycleCloud installation for additional Tutorials, you do not need to follow this tutorial. Be aware that you are charged for usage while the nodes are running, even if no jobs are scheduled. Follow the steps below to free up resources.

## Terminate the Cluster

When all submitted jobs are complete, you no longer need the cluster. To clean up resources and free them for other jobs, click **Terminate** in the CycleCloud GUI to shut down all of the infrastructure. All underlying Azure resources will be cleaned up as part of the cluster termination, which may take several minutes.

::: moniker range="=cyclecloud-7"
:::image type="content" source="~/images/version-7/terminate-cluster.png" alt-text="terminate cluster dialog":::
::: moniker-end

::: moniker range=">=cyclecloud-8"
:::image type="content" source="~/images/version-8/terminate-cluster.png" alt-text="terminate cluster dialog":::
::: moniker-end

## Delete the Resource Group

To remove the resources you created for the tutorials, you can simply delete the resource group. Everything within that group will be cleaned up as part of the process. Using the example created in the first tutorial:

```azurecli-interactive
az group delete --name "MyQuickstart"
```

## Delete the Service Principal

Run the following command to delete the service principal created at the start of the lab, substituting the name used if other than the example name:

```azurecli-interactive
az ad sp delete --id "http://CycleCloudApp"
```

## Next Steps

If you've gone through all three tutorials, you've covered the installation, setup, and configuration of Azure CycleCloud, created and ran a simple HPC cluster, added a cost usage alert, submitted 100 jobs, witnessed the auto scaling, and cleaned up after yourself. You've only begun to scratch the surface of what Azure CycleCloud offers - check out the product and documentation pages to learn more!

## Further Reading

* Learn more about [clusters and nodes](../concepts/clusters.md)
* Explore [cluster templates](../how-to/cluster-templates.md)
* [Install CycleCloud manually](../how-to/install-manual.md)
* Build a [project](~/how-to/projects.md)
