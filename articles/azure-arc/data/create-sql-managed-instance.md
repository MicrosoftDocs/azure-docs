---
title: Create an Azure SQL managed instance on Azure Arc
description: Create an Azure SQL managed instance on Azure Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Create an Azure SQL managed instance on Azure Arc

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]


## Create an Azure SQL Managed Instance

To view available options for create command for SQL Managed Instance, use the following command:
```azurecli
az sql mi-arc create --help
```

To create an SQL Managed Instance, use the following command:

```azurecli
az sql mi-arc create -n <instanceName> --k8s-namespace <namespace> --use-k8s
```

Example:

```azurecli
az sql mi-arc create -n sqldemo --k8s-namespace my-namespace --use-k8s
```
> [!NOTE]
>  Names must be less than 13 characters in length and conform to [DNS naming conventions](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names)
>
>  When specifying memory allocation and vCore allocation use this formula to ensure your performance is acceptable: for each 1 vCore you should have at least 4GB of RAM of capacity available on the Kubernetes node where the SQL managed instance pod will run.
>
>  If you want to automate the creation of SQL instances and avoid the interactive prompt for the admin password, you can set the `AZDATA_USERNAME` and `AZDATA_PASSWORD` environment variables to the desired username and password prior to running the `az sql mi-arc create` command.
> 
>  If you created the data controller using AZDATA_USERNAME and AZDATA_PASSWORD in the same terminal session, then the values for AZDATA_USERNAME and AZDATA_PASSWORD will be used to create the SQL managed instance too.

> [!NOTE]
> If you are using the indirect connectivity mode, creating Azure SQL Managed Instance in Kubernetes will not automatically register the resources in Azure. Steps to register the resource are in the following articles: 
> - [Upload billing data to Azure and view it in the Azure portal](view-billing-data-in-azure.md) 


## View instance on Azure Arc

To view the instance, use the following command:

```azurecli
az sql mi-arc list --k8s-namespace <namespace> --use-k8s
```

You can copy the external IP and port number from here and connect to it using your favorite tool for connecting to a SQL Sever/Azure SQL instance such as Azure Data Studio or SQL Server Management Studio.

[!INCLUDE [use-insider-azure-data-studio](includes/use-insider-azure-data-studio.md)]

## Next steps
- [Connect to Azure Arc—enabled SQL Managed Instance](connect-managed-instance.md)
- [Register your instance with Azure and upload metrics and logs about your instance](upload-metrics-and-logs-to-azure-monitor.md)
- [Deploy Azure SQL managed instance using Azure Data Studio](create-sql-managed-instance-azure-data-studio.md)
