---
ms.assetid: 
title: Dashboards on Azure Managed Grafana
description: This article describes how to create a SCOM Managed Instance dashboard on Azure Managed Grafana.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Dashboards on Azure Managed Grafana

Azure Managed Grafana (AMG) is a data visualization platform, built on top of the Grafana software by Grafana Labs. Grafana helps you bring together metrics, logs, and traces into a single user interface.

Azure Managed Grafana is optimized for the Azure environment and works seamlessly, providing the following integration features:

- Built-in support for [Azure Monitor](/azure/azure-monitor/) and [Azure Data Explorer](/azure/data-explorer/).
- User authentication and access control using Microsoft Entra identities.
- Direct import of existing charts from the Azure portal.

This article describes how to create a SCOM Managed Instance dashboard on Azure Managed Grafana.

## Steps to create a SCOM Managed Instance dashboard on Azure Managed Grafana

To create a SCOM Managed Instance dashboard on Azure Managed Grafana, follow these steps:

### Get started with Azure Managed Grafana (AMG)

1. Create or reuse an Azure Managed Grafana (AMG) with a version 10 on the Azure portal. To create an AMG instance, follow [these steps](/azure/managed-grafana/quickstart-managed-grafana-portal).
2. Enable System assigned managed identity on the AMG instance.

     :::image type="Permissions" source="media/dashboards-on-azure-managed-grafana/grafana-permissions.png" alt-text="Screenshot of grafana permissions.":::
3. Browse to SQL managed instance where SCOM Managed Instance databases are created. Note the SQL managed instance public endpoints and the Database name.

### Assign Permissions

1. On the AMG instance, provide **Grafana Admin** permissions to the users who need access to create dashboards.
      >[!NOTE]
      >After you set up a dashboard, assign **Grafana Editor** user permission to view, edit and create additional dashboards.
1. Grant permissions to the System managed identity of the Grafana instance on the SQL managed instance database by downloading and running the [PowerShell script](https://go.microsoft.com/fwlink/?linkid=2252607). This script creates a SQL user for Azure Managed Grafana identity.
1. The script accepts details of **Azure Managed Grafana Instance name**, **SCOM MI instance name**, SQL managed instance **Public endpoint** and **Server admin login** credentials of SQL managed instance.

### Configure Data source on AMG

1. Browse to the AMG portal by selecting the AMG instance endpoint.
2. Navigate to **Connections** > **Data sources** and add a data source of type **Microsoft SQL Server**.
3. On the **Settings** page, enter the Database endpoint URL in the **Host** field.
4. Enter the Database name (noted above) in **Database** field.
5. Use **Azure Managed Identity** as the authentication method.
6. Select **Save and test**.

### Import SCOM Managed Instance dashboards in AMG instance

1. Navigate to AMG instance endpoint > **Dashboards** > **New** > **Import** > **Import via grafana.com** > **Enter 19919** and select **Import**.
2. Browse to the imported dashboards.
3. On the top of the dashboard, choose the created Data source and the respective database in the dashboard settings.