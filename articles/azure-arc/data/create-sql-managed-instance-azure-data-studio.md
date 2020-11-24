---
title: Create Azure SQL managed instance using Azure Data Studio
description: Create Azure SQL managed instance using Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: vin-yu
ms.author: vinsonyu
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Create SQL managed instance - Azure Arc using Azure Data Studio

This document walks you through the steps for installing Azure SQL managed instance - Azure Arc using Azure Data Studio

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Log in to the Azure Arc data controller

Before you can create an instance, log in to the Azure Arc data controller if you are not already logged in.

```console
azdata login
```

You will then be prompted for the namespace where the data controller is created, the username and password to log in to the controller.  

> If you need to validate the namespace, you can run ```kubectl get pods -A``` to get a list of all the namespaces on the cluster.

```console
Username: arcadmin
Password:
Namespace: arc
Logged in successfully to `https://10.0.0.4:30080` in namespace `arc`. Setting active context to `arc`
```

## Create Azure SQL managed instance on Azure Arc

- Launch Azure Data Studio
- On the Connections tab, Click on the three dots on the top left and choose "New Deployment"
- From the deployment options, select **Azure SQL managed instance - Azure Arc** 
  > [!NOTE]
  > You may be prompted to install the [!INCLUDE [azure-data-cli-azdata](../../../includes/azure-data-cli-azdata.md)] here if it is not currently installed.
- Accept the Privacy and license terms and click **Select** at the bottom



- In the Deploy Azure SQL managed instance - Azure Arc blade, enter the following information:
  - Enter a name for the SQL Server instance
  - Enter and confirm a password for the SQL Server instance
  - Select the storage class as appropriate for data
  - Select the storage class as appropriate for logs

- Click the **Deploy** button

- This should initiate the creation of the Azure SQL managed instance - Azure Arc on the data controller.

- In a few minutes, your creation should successfully complete

## Connect to Azure SQL managed instance - Azure Arc from Azure Data Studio

- Log in to the Azure Arc data controller, by providing the namespace, username and password for the data controller: 
```console
azdata login
```

- View all the Azure SQL managed instances provisioned, using the following commands:

```console
azdata arc sql mi list
```

Output should look like this, copy the ServerEndpoint (including the port number) from here.

```console

Name          Replicas    ServerEndpoint     State
------------  ----------  -----------------  -------
sqlinstance1  1/1         25.51.65.109:1433  Ready
```

- In Azure Data Studio, under **Connections** tab, click on the **New Connection** on the **Servers** view
- In the **Connection** blade, paste the ServerEndpoint into the Server textbox
- Select **SQL Login** as the Authentication type
- Enter *sa* as the user name
- Enter the password for the `sa` account
- Optionally, enter the specific database name to connect to
- Optionally, select/Add New Server Group as appropriate
- Select **Connect** to connect to the Azure SQL managed instance - Azure Arc




## Next Steps

Now try to [monitor your SQL instance](monitor-grafana-kibana.md)
