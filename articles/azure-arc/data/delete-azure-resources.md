---
title: Delete resources from Azure
description: Delete resources from Azure
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Delete resources from Azure

> [!NOTE]
>  The options to delete resources in this article are irreversible!

> [!NOTE]
>  Since the only connectivity mode that is offered for Azure Arc enabled data services currently is the Indirect Connected mode, deleting an instance from Kubernetes will not remove it from Azure and deleting an instance from Azure will not remove it from Kubernetes.  For now deleting a resource is a two step process and this will be improved in the future.  Going forward, Kubernetes will be the source of truth and Azure will be updated to reflect it.

In some cases, you may need to manually delete Azure Arc enabled data services resources in Azure Resource Manager (ARM).  You can delete these resources using any of the following options.

- [Delete resources from Azure](#delete-resources-from-azure)
  - [Delete an entire resource group](#delete-an-entire-resource-group)
  - [Delete specific resources in the resource group](#delete-specific-resources-in-the-resource-group)
  - [Delete resources using the Azure CLI](#delete-resources-using-the-azure-cli)
    - [Delete SQL managed instance resources using the Azure CLI](#delete-sql-managed-instance-resources-using-the-azure-cli)
    - [Delete PostgreSQL Hyperscale server group resources using the Azure CLI](#delete-postgresql-hyperscale-server-group-resources-using-the-azure-cli)
    - [Delete Azure Arc data controller resources using the Azure CLI](#delete-azure-arc-data-controller-resources-using-the-azure-cli)
    - [Delete a resource group using the Azure CLI](#delete-a-resource-group-using-the-azure-cli)

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Delete an entire resource group
If you have been using a specific and dedicated resource group for Azure Arc enabled data services and you want to delete *everything* inside of the resource group you can delete the resource group which will delete everything inside of it.  

You can delete a resource group in the Azure portal by doing the following:

- Browse to the Resource Group in the Azure portal where the Azure Arc enabled data services resources have been created.
- Click the **Delete resource group** button.
- Confirm the deletion by entering the resource group name and click **Delete**.

## Delete specific resources in the resource group

You can delete specific Azure Arc enabled data services resources in a resource group in the Azure portal by doing the following:

- Browse to the Resource Group in the Azure portal where the Azure Arc enabled data services resources have been created.
- Select all the resources to be deleted.
- Click on the Delete button.
- Confirm the deletion by typing 'yes' and click **Delete**.

## Delete resources using the Azure CLI

You can delete specific Azure Arc enabled data services resources using the Azure CLI.

### Delete SQL managed instance resources using the Azure CLI

To delete SQL managed instance resources from Azure using the Azure CLI replace the placeholder values in the command below and run it.

```console
az resource delete --name <sql instance name> --resource-type Microsoft.AzureData/sqlManagedInstances --resource-group <resource group name>

#Example
#az resource delete --name sql1 --resource-type Microsoft.AzureData/sqlManagedInstances --resource-group rg1
```

### Delete PostgreSQL Hyperscale server group resources using the Azure CLI

To delete a PostgreSQL Hyperscale server group resource from Azure using the Azure CLI replace the placeholder values in the command below and run it.

```console
az resource delete --name <postgresql instance name> --resource-type Microsoft.AzureData/postgresInstances --resource-group <resource group name>

#Example
#az resource delete --name pg1 --resource-type Microsoft.AzureData/postgresInstances --resource-group rg1
```

### Delete Azure Arc data controller resources using the Azure CLI

> [!NOTE]
> Before deleting an Azure Arc data controller, you should delete all of the database instance resources that it is managing.

To delete an Azure Arc data controller from Azure using the Azure CLI replace the placeholder values in the command below and run it.

```console
az resource delete --name <data controller name> --resource-type Microsoft.AzureData/dataControllers --resource-group <resource group name>

#Example
#az resource delete --name dc1 --resource-type Microsoft.AzureData/dataControllers --resource-group rg1
```

### Delete a resource group using the Azure CLI

You can also use the Azure CLI to [delete a resource group](../../azure-resource-manager/management/delete-resource-group.md).