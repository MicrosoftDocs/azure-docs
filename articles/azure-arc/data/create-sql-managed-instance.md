---
title: Create an Azure SQL managed instance on Azure Arc
description: Create an Azure SQL managed instance on Azure Arc
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: vin-yu
ms.author: vinsonyu
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Create an Azure SQL managed instance on Azure Arc

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Login to the Azure Arc data controller

Before you can create an instance, log in to the Azure Arc data controller if you are not already logged in.

```console
azdata login
```

You will then be prompted for the username, password, and the system namespace.  

```console
Username: arcadmin
Password:
Namespace: arc
Logged in successfully to `https://10.0.0.4:30080` in namespace `arc`. Setting active context to `arc`
```

## Create an Azure SQL Managed Instance

To view available create options forSQL Managed Instance, use the following command:
```console
azdata arc sql mi create --help
```

To create an SQL Managed Instance, use the following command:

```console
azdata arc sql mi create -n <instanceName> --storage-class-data <storage class> --storage-class-logs <storage class>
```

Example:

```console
azdata arc sql mi create -n sqldemo --storage-class-data managed-premium --storage-class-logs managed-premium
```
> [!NOTE]
>  Names must be less than 13 characters in length and conform to [DNS naming conventions](https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#dns-label-names)
>
>  When specifying memory allocation and vCore allocation use this formula to ensure your creation is successful - for each 1 vCore you need at least 4GB of RAM of capacity available on the Kubernetes node where the SQL managed instance pod will run.
>
>  When creating a SQL instance do not use upper case in the name if you are provisioning in Azure
>
>  To list available storage classes in your Kubernetes cluster run `kubectl get storageclass` 


> [!NOTE]
> If you want to automate the creation of SQL instances and avoid the interactive prompt for the admin password, you can set the `AZDATA_USERNAME` and `AZDATA_PASSWORD` environment variables to the desired username and password prior to running the `azdata arc sql mi create` command.
> 
>  If you created the data controller using AZDATA_USERNAME and AZDATA_PASSWORD in the same terminal session, then the values for AZDATA_USERNAME and AZDATA_PASSWORD will be used to create the SQL managed instance too.

> [!NOTE]
> Creating Azure SQL Managed Instance will not register the resources in Azure. Steps to register the resource are in the following articles: 
> - [View logs and metrics using Kibana and Grafana](monitor-grafana-kibana.md)
> - [Upload billing data to Azure and view it in the Azure portal](view-billing-data-in-azure.md) 


## View instance on Azure Arc

To view the instance, use the following command:

```console
azdata arc sql mi list
```

Output should look like this:

```console
Name    Replicas    ServerEndpoint    State
------  ----------  ----------------  -------
sqldemo 1/1         10.240.0.4:32023  Ready
```

If you are using AKS or `kubeadm` or OpenShift etc., you can copy the external IP and port number from here and connect to it using your favorite tool for connecting to a SQL Sever/Azure SQL instance such as Azure Data Studio or SQL Server Management Studio. However, if you are using the quickstart VM, see the [Connect to Azure Arc enabled SQL Managed Instance](connect-managed-instance.md) article for special instructions.


## Next steps
- [Connect to Azure Arc enabled SQL Managed Instance](connect-managed-instance.md)
- [Register your instance with Azure and upload metrics and logs about your instance](upload-metrics-and-logs-to-azure-monitor.md)
- [Deploy Azure SQL managed instance using Azure Data Studio](create-sql-managed-instance-azure-data-studio.md)
