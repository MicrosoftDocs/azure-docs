<properties
   pageTitle="Deleting a Service Fabric cluster | Microsoft Azure"
   description="Deleting a Service Fabric cluster or deleting all the resources that the cluster uses including the cluster resource"
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
   ms.date="05/02/2016"
   ms.author="chackdan"/>

# Deleting a Service Fabric cluster or deleting all the resources that the cluster uses including the cluster resource.

A Service Fabric cluster is made up of many other azure resources in addition to the cluster resource itself. So in order to delete a service fabric cluster you have to make sure that you delete all the resources it is made of. You have two ways to do it.

>[AZURE.NOTE] deleting only the cluster resource, **does not** delete all the resources that your service fabric cluster was made of. 

## Option 1. Delete the entire Resource Group (RG) that the Service Fabric cluster is in.

This is the easiest way to ensure that all the resources that cluster is made up of, including the Resource Group. If your Resource Group has resources that are not related to Service fabric cluster, then you must choose Option 2 below.

**Option 1a : Deleting the RG Using Azure Powershell** 

You can delete the Resource Group by running the following Azure Powershell. Make sure  Azure PS 1.0+ installed on your machine. If you have not done this before, I strongly suggest you follow steps outlined in [How to install and Configure Azure PowerShell.](https://azure.microsoft.com/documentation/articles/powershell-install-configure/)

If you have Azure PS 1.0+ installed on your machine, Open a Powershell window and run the following PS commands

```
Login-AzureRmAccount
```

```
Remove-AzureRmResourceGroup -Name <name of ResouceGroup> -Force
```

You will get a prompt to confirm the deletion if you did not use the -Force option. On confirmation the RG and all the resources it contains gets deleted.

**Option 1b : Deleting a Resource Group via the Azure portal ** 

1. login to the Azure portal
2. Navigate to the Service Fabric Cluster you want to delete
3. Click on the Resource Group name on the cluster essentials page
4. This will bring up the Resource Group Essentials Page
5. Click on the Delete button on the page
6. Follow the instructions on that page to complete the deletion of the Resource Group. 

![ResourceGroupDelete][ResourceGroupDelete]


## Option 2. Delete the cluster resources and the resources it uses but not the all the other resources in the Resource Group.

If your Resource Group has only resources that are related to the Service fabric cluster you want to delete, then it is easier if you followed Option 1. If you want to selectively delete the resources one-by-one in your Resource Group, then follow the steps below.

If you have deployed your cluster using the portal or using one of the Service Fabric ARM templates from the template gallery, then all the resources that the cluster uses is tagged by the following two tags. You can use them to decide on the resources you want to delete.


***Tag#1 :*** Key = clusterName , Value = 'name of the cluster'

***Tag#2 :*** Key = resourceName , Value = ServiceFabric
   
**Option 2a : Deleting the specific Resources Using Azure Portal** 

1. login to the Azure portal
2. Navigate to the Service Fabric Cluster you want to delete
3. Go to "all Settings" on the essentials blade part
4. Click on Tags under the RESOURCE MANAGEMENT in the settings blade
5. Click on one of the Tags, in the Tags blade to get a list of all the resources with that tag.

![ResourceTags][ResourceTags]

6. once you have the list of tagged resources, click on each of the resources and delete them.

![TaggedResources][TaggedResources]

**Option 2b : Deleting the Resources Using Azure Powershell** 

You can delete the resources one-by-one by running the following Azure Powershell. Make sure  Azure PS 1.0+ installed on your machine. If you have not done this before, I strongly suggest you follow steps outlined in [How to install and Configure Azure PowerShell.](https://azure.microsoft.com/documentation/articles/powershell-install-configure/)

If you have Azure PS 1.0+ installed on your machine, Open a Powershell window and run the following PS commands

```
Login-AzureRmAccount
```
For each of the resources you want to delete, run the following.

```
Remove-AzureRmResource -ResourceName "<name of the Resource>" -ResourceType "<Resource Type>" -ResourceGroupName "<name of the Resource Group>" -Force
```

To delete the cluster resource, run the following. 

>[AZURE.NOTE] deleting only the cluster resource, **does not** delete all the resources that your service fabric cluster was made of. 

```
Remove-AzureRmResource -ResourceName "<name of the Resource>" -ResourceType "Microsoft.ServiceFabric/clusters" -ResourceGroupName "<name of the Resource Group>" -Force
````




## Next steps

- [Learn about cluster upgrades](service-fabric-cluster-upgrade.md)
- [Learn about partitioning stateful services for maximum scale](service-fabric-concepts-partitioning.md)


<!--Image references-->
[ResourceGroupDelete]: ./media/service-fabric-cluster-delete/ResourceGroupDelete.png
[ResourceTags]: ./media/service-fabric-cluster-delete/ResourceTags.png
[TaggedResources]: ./media/service-fabric-cluster-delete/TaggedResources.png

