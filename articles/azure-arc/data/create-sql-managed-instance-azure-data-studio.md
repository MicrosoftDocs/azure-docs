---
title: Create Azure SQL Managed Instance using Azure Data Studio
description: Create Azure SQL Managed Instance using Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 06/16/2021
ms.topic: how-to
---

# Create SQL Managed Instance - Azure Arc using Azure Data Studio

This document walks you through the steps for installing Azure SQL Managed Instance - Azure Arc using Azure Data Studio

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]

## Create Azure SQL Managed Instance on Azure Arc

1. Launch Azure Data Studio
2. On the Connections tab, Click on the three dots on the top left and choose **New Deployment...**.
3. From the deployment options, select **Azure SQL managed instance**.
  > [!NOTE]
  > You may be prompted to install the appropriate CLI here if it is not currently installed.
4. Click **Select**.

   Azure Data Studio opens **Azure SQL managed instance**. 

5. For **Resource Type**, choose **Azure SQL managed instance - Azure Arc**. 
6. Accept the privacy statement and license terms
1. Review the required tools. Follow instructions to update tools before you proceed.
1. Select **Next**.

   Azure Data Studio allows you to set your specifications for the managed instance.

   - For **Service Tier** set either **Business Critical** or **General Purpose**.
   - For a development or test environment, select **For development use only**.
   - For high availability, select the appropriate number of replicas. 
   - For **Storage Class (Backups)** specify a ReadWriteMany (RWX) capable storage class. 
     
     > [!WARNING]
     > You need to specify a ReadWriteMany (RWX) capable storage class needs to be specified for backups. Learn more about [access modes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes).
     >
     > If you don't specify a storage class is specified for backups, the deployment uses the default storage class in Kubernetes. If this storage class is not RWX capable, the deployment may not succeed.

   - Specify the retention period in days for point-in-time backups.

   - Complete the other fields as required for your managed instance.

1. Click the **Deploy** button.

After you click the deploy button, the Azure Arc data controller initiates the deployment. The deployment will take a few minutes to create the data controller.

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
