---
title: Delete resources from Azure
description: Delete resources from Azure
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Delete resources from Azure

The Arc data resources in Azure portal can be deleted as follows:

- Browse to the Resource Group in Azure portal where the Arc resources have been projected
- Select all the resources that need to be deleted while in the Resource Group view
- Click on the Delete button
- Confirm the deletion


Alternatively, to delete Azure resources from Azure you can also use the Azure CLI by following this guide.

> [!NOTE]
>  Since the only connectivity mode that is offered right now is the indirect mode, deleting an instance from Kubernetes will not remove it from Azure and deleting an instance from Azure will not remove it from Kubernetes.  For now, it needs to be a two step process and this will be improved in the future.  Going forward, Kubernetes will be the source of truth and Azure will be updated to reflect it on each upload.

## Delete SQL managed instances

To delete SQL managed instances from Azure using the Azure CLI replace the placeholder values in the command below and run it.

```terminal
az resource delete -n <sql instance name> --resource-type Microsoft.AzureData/sqlManagedInstances -g <resource group name>

#Example
#az resource delete -n sqltest1 --resource-type Microsoft.AzureData/sqlManagedInstances -g user-arc-demo
```

## Delete PostgreSQL instances

To delete PostgreSQL  instances from Azure using the Azure CLI replace the placeholder values in the command below and run it.

```terminal
az resource delete -n <postgresql instance name> --resource-type Microsoft.AzureData/postgresInstances -g <resource group name>

#Example
#az resource delete -n pgtest1 --resource-type Microsoft.AzureData/postgresInstances -g user-arc-demo
```

## Delete Azure Arc data controllers

To delete Azure Arc data controllers from Azure using the Azure CLI replace the placeholder values in the command below and run it.

```terminal
az resource delete -n <data controller name> --resource-type Microsoft.AzureData/dataControllers -g <resource group name>

#Example
#az resource delete -n arc-cp1 --resource-type Microsoft.AzureData/dataControllers -g user-arc-demo
```
