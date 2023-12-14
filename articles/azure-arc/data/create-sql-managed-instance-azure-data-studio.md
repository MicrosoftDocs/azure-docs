---
title: Create SQL Managed Instance enabled by Azure Arc using Azure Data Studio
description: Create SQL Managed Instance enabled by Azure Arc using Azure Data Studio
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 06/16/2021
ms.topic: how-to
---

# Create SQL Managed Instance enabled by Azure Arc using Azure Data Studio

This document demonstrates how to install Azure SQL Managed Instance - Azure Arc using Azure Data Studio.

[!INCLUDE [azure-arc-common-prerequisites](../../../includes/azure-arc-common-prerequisites.md)]

## Steps

1. Launch Azure Data Studio
2. On the Connections tab, select on the three dots on the top left and choose **New Deployment...**.
3. From the deployment options, select **Azure SQL managed instance**.
  > [!NOTE]
  > You may be prompted to install the appropriate CLI here if it is not currently installed.
  
4. Select **Select**.

   Azure Data Studio opens **Azure SQL managed instance**. 

5. For **Resource Type**, choose **Azure SQL managed instance - Azure Arc**. 
6. Accept the privacy statement and license terms
1. Review the required tools. Follow instructions to update tools before you proceed.
1. Select **Next**.

   Azure Data Studio allows you to set your specifications for the managed instance. The following table describes the fields:

    |Setting    | Description | Required or optional
    |-------|-------|-------|
    |**Target Azure Controller** | Name of the Azure Arc data controller. | Required |
    |**Instance name** | Managed instance name. | Required |
    |**Username** | System administrator user name. | Required |
    |**System administrator password** | SQL authentication password for the managed instance. The passwords must be at least eight characters long and contain characters from three of the following four categories: Latin uppercase letters, Latin lowercase letters, numbers, and non-alphanumeric characters.<br/></br> Confirm the password. | Required |
    |**Service tier** | Specify the appropriate service tier: Business Critical or General Purpose. | Required |
    |**I already have a SQL Server License** | Select if this managed instance will use a license from your organization.  | Optional |
    |**Storage Class (Data)** | Select from the list. | Required |
    |**Volume Size in Gi (Data)** | The amount of space in gibibytes to allocate for data. | Required |
    |**Storage Class (Database logs)** | Select from the list. | Required |
    |**Volume Size in Gi (Database logs)** | The amount of space in gibibytes to allocate for database transaction logs. | Required |
    |**Storage Class (Logs)** | Select from the list. | Required |
    |**Volume Size in Gi (Logs)** | The amount of space in gibibytes to allocate for logs. | Required |
    |**Storage Class (Backups)** | Select from the list. Specify a ReadWriteMany (RWX) capable storage class for backups. Learn more about [access modes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes). If this storage class isn't RWX capable, the deployment may not succeed. | Required |
    |**Volume Size in Gi (Backups)** | The size of the storage volume to be used for database backups in gibibytes. | Required |
    |**Cores Request** | The number of cores to request for the managed instance. Integer. | Optional |
    |**Cores Limit** | The request for the capacity for the managed instance in gigabytes. Integer. | Optional |
    |**Memory Request** | Select from the list. | Required |
    |**Point in time retention (days)** | The number of days to keep your point in time backups. | Optional |

   After you've set all of the required values, Azure Data Studio enables the **Deploy** button. If this control is disabled, verify that you have all required settings configured.

1. Select the **Deploy** button to create the managed instance.

After you select the deploy button, the Azure Arc data controller initiates the deployment. The deployment creates the managed instance. The deployment process takes a few minutes to create the data controller.

## Connect from Azure Data Studio

View all the SQL Managed Instances provisioned to this data controller. Use the following command:

  ```azurecli
  az sql mi-arc list --k8s-namespace <namespace> --use-k8s
  ```

  Output should look like this, copy the ServerEndpoint (including the port number) from here.

  ```console
  Name          Replicas    ServerEndpoint     State
  ------------  ----------  -----------------  -------
  sqlinstance1  1/1         25.51.65.109:1433  Ready
  ```

1. In Azure Data Studio, under **Connections** tab, select the **New Connection** on the **Servers** view
1. Under **Connection**>**Server**, paste the ServerEndpoint 
1. Select **SQL Login** as the Authentication type
1. Enter *sa* as the user name
1. Enter the password for the `sa` account
1. Optionally, enter the specific database name to connect to
1. Optionally, select/Add New Server Group as appropriate
1. Select **Connect** to connect to the Azure SQL Managed Instance - Azure Arc

## Related information

Now try to [monitor your SQL instance](monitor-grafana-kibana.md)
