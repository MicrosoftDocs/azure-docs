<properties
   pageTitle="Delete a cluster and its’ resources | Microsoft Azure"
   description="Learn how to completely delete a Service Fabric cluster either deleting the resource group containing the cluster or by selectively deleting resources."
   services="service-fabric"
   documentationCenter=".net"
   authors="ChackDan"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/04/2016"
   ms.author="chackdan"/>

# Delete a Service Fabric cluster and the resources it uses

A Service Fabric cluster is made up of many other Azure resources in addition to the cluster resource itself. So in order to completely delete a Service Fabric cluster you also need to delete all the resources it is made of. You have two options to do this: either delete the resource group that the cluster is in (which deletes the cluster resource and any other resources in the resource group) or specifically delete the cluster resource and it's associated resources (but not other resources in the resource group).

>[AZURE.NOTE] Deleting the cluster resource **does not** delete all the other resources that your Service Fabric cluster is composed of.

## Delete the entire resource group (RG) that the Service Fabric cluster is in

This is the easiest way to ensure that you delete all the resources associated with your cluster, including the resource group. You can delete the resource group using PowerShell or through the Azure portal. If your resource group has resources that are not related to Service fabric cluster, then you can delete specific resources.

### Delete the resource group using Azure PowerShell

You can also delete the resource group by running the following Azure PowerShell cmdlets. Make sure Azure PowerShell 1.0 or greater is installed on your computer. If you have not done this before, follow the steps outlined in [How to install and Configure Azure PowerShell.](../powershell-install-configure.md)

Open a PowerShell window and run the following PS cmdlets:

```powershell
Login-AzureRmAccount

Remove-AzureRmResourceGroup -Name <name of ResouceGroup> -Force
```

You will get a prompt to confirm the deletion if you did not use the *-Force* option. On confirmation the RG and all the resources it contains will be deleted.

### Delete a resource group in the Azure portal  

1. Login to the [Azure portal](https://portal.azure.com).
2. Navigate to the Service Fabric cluster you want to delete.
3. Click on the Resource Group name on the cluster essentials page.
4. This will bring up the **Resource Group Essentials** page.
5. Click **Delete**.
6. Follow the instructions on that page to complete the deletion of the resource group.

![Resource Group Delete][ResourceGroupDelete]


## Delete the cluster resource and the resources it uses, but not other resources in the resource group

If your resource group has only resources that are related to the Service Fabric cluster you want to delete, then it is easier to delete the entire resource group. If you want to selectively delete the resources one-by-one in your resource group, then follow these steps.

If you deployed your cluster using the portal or using one of the Service Fabric ARM templates from the template gallery, then all the resources that the cluster uses are tagged with the following two tags. You can use them to decide which resources you want to delete.

***Tag#1 :*** Key = clusterName , Value = 'name of the cluster'

***Tag#2 :*** Key = resourceName , Value = ServiceFabric

### Delete specific resources in the Azure Portal

1. Login to the [Azure portal](https://portal.azure.com).
2. Navigate to the Service Fabric cluster you want to delete.
3. Go to **All settings** on the essentials blade.
4. Click on **Tags** under **Resource Management** in the settings blade.
5. Click on one of the **Tags** in the tags blade to get a list of all the resources with that tag.

    ![Resource Tags][ResourceTags]

6. Once you have the list of tagged resources, click on each of the resources and delete them.

    ![Tagged Resources][TaggedResources]

### Delete the resources using Azure PowerShell

You can delete the resources one-by-one by running the following Azure PowerShell cmdlets. Make sure Azure PowerShell 1.0 or greater is installed on your computer. If you have not done this before, follow the steps outlined in [How to install and Configure Azure PowerShell.](../powershell-install-configure.md)

Open a PowerShell window and run the following PS cmdlets:

```powershell
Login-AzureRmAccount
```
For each of the resources you want to delete, run the following:

```powershell
Remove-AzureRmResource -ResourceName "<name of the Resource>" -ResourceType "<Resource Type>" -ResourceGroupName "<name of the resource group>" -Force
```

To delete the cluster resource, run the following:

```powershell
Remove-AzureRmResource -ResourceName "<name of the Resource>" -ResourceType "Microsoft.ServiceFabric/clusters" -ResourceGroupName "<name of the resource group>" -Force
```

## Next steps
Read the following to also learn about upgrading a cluster and partitioning services:

- [Learn about cluster upgrades](service-fabric-cluster-upgrade.md)
- [Learn about partitioning stateful services for maximum scale](service-fabric-concepts-partitioning.md)


<!--Image references-->
[ResourceGroupDelete]: ./media/service-fabric-cluster-delete/ResourceGroupDelete.PNG

[ResourceTags]: ./media/service-fabric-cluster-delete/ResourceTags.png

[TaggedResources]: ./media/service-fabric-cluster-delete/TaggedResources.PNG
