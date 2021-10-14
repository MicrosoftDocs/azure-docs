---
title: Create Azure SQL Managed Instance using Azure Data Studio
description: Create Azure SQL Managed Instance using Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/30/2021
ms.topic: how-to
---

# Create SQL Managed Instance - Azure Arc using Azure Data Studio

This document walks you through the steps for installing Azure SQL Managed Instance - Azure Arc using Azure Data Studio

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]

[!INCLUDE [use-insider-azure-data-studio](includes/use-insider-azure-data-studio.md)]

## Create Azure SQL Managed Instance on Azure Arc

- Launch Azure Data Studio
- On the Connections tab, Click on the three dots on the top left and choose "New Deployment"
- From the deployment options, select **Azure SQL Managed Instance - Azure Arc** 
  > [!NOTE]
  > You may be prompted to install the appropriate CLI here if it is not currently installed.
- Accept the Privacy and license terms and click **Select** at the bottom

- In the Deploy Azure SQL Managed Instance - Azure Arc blade, enter the following information:
  - Enter a name for the SQL Server instance
  - Enter and confirm a password for the SQL Server instance
  - Select the storage class as appropriate for data
  - Select the storage class as appropriate for logs

- Click the **Deploy** button

- This should initiate the creation of the Azure SQL Managed Instance - Azure Arc on the data controller.

- In a few minutes, your creation should successfully complete

## Connect to Azure SQL Managed Instance - Azure Arc from Azure Data Studio

- View all the Azure SQL Managed Instances provisioned, using the following commands:

```azurecli
az sql mi-arc list --k8s-namespace <namespace> --use-k8s
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
- Select **Connect** to connect to the Azure SQL Managed Instance - Azure Arc

## Next Steps

Now try to [monitor your SQL instance](monitor-grafana-kibana.md)
