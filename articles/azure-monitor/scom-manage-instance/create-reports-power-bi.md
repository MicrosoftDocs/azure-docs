---
ms.assetid: 
title: Create reports on Power BI
description: This article describes how to create reports on Power BI for Azure Monitor SCOM Managed Instance.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/24/2024
ms.custom: UpdateFrequency.5, engagement-fy24
ms.service: system-center
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Create reports on Power BI

This article describes how to create reports on Power BI for Azure Monitor SCOM Managed Instance.

> [!VIDEO https://www.youtube.com/embed/MG5kGoe1zj0?start=215]

## Prerequisites

- Azure Active Directory based authentication: 

    1. [Create an Azure Active Directory group](/azure/active-directory/roles/groups-create-eligible) for the users to whom you want to provide permissions to read data from the SQL Managed Instance through this Power BI report. 

    2. Create login credentials for the Azure Active Directory group in the SQL Managed Instance, which adds the user principal of the group in the SQL Managed Instance. To create a login, see [Create Login (Transact-SQL)](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current&preserve-view=true).
            :::image type="Create login" source="media/operations-manager-managed-instance-create-reports-on-power-bi/create-login.png" alt-text="Screenshot showing create login option.":::
    3. Provide **db_datareader** permission to the Login on Data warehouse database.
            :::image type="Login properties" source="media/operations-manager-managed-instance-create-reports-on-power-bi/login-properties.png" alt-text="Screenshot showing login properties.":::
    4. [Download the supported SSMS](/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16&preserve-view=true) and add login to SSMS.
    5. In the network security group of the subnet where the Azure SQL Managed Instance is hosted, create an NSG rule to allow public endpoint traffic on port number 3342. For more information about how to configure public endpoint, see [Configure public endpoint](/azure/azure-sql/managed-instance/public-endpoint-configure?view=azuresql&preserve-view=true).
            :::image type="Destination port range" source="media/operations-manager-managed-instance-create-reports-on-power-bi/destination-port-range.png" alt-text="Screenshot showing destination port range.":::
- SQL based authentication: 

    - You need the username and password of the SQL Managed Instance.

## Create reports through public endpoint of SQL MI

1. Sign in to the [Azure portal](https://portal.azure.com/) and search for SCOM Managed Instance.
1. On the **Overview** page, under **Reports**, select **Power BI**. You have three options on the Power BI page.
    1. **Prerequisite**: Allows you to manage endpoints.
    1. **Configure and install Power BI**: Allows you to install and configure the SCOM Managed Instance dashboard in Power BI.
    1. **View Power BI dashboard**: Allows you to visualize the SCOM Managed Instance dashboard in Power BI after the configuration.
1. Review the **Prerequisites** to ensure Public endpoint of SQL MI is enabled. You'll notice the Database Host URL and Database name are displayed.
     :::image type="Public endpoints" source="media/operations-manager-managed-instance-create-reports-on-power-bi/public-endpoints.png" alt-text="Screenshot showing public endpoints.":::
1. Select **Configure Dashboard**, **Powerbi.com** opens in a new browser. Select **Get it now** to install **Microsoft SCOM managed instance reports** Power BI app in your workspace. 
     :::image type="Power BI app" source="media/operations-manager-managed-instance-create-reports-on-power-bi/power-bi-app.png" alt-text="Screenshot showing Power BI app.":::
1. The app displays sample data. You can edit the parameter values **Data-Warehouse DB host URL** and **Data-Warehouse Name**.
     >[!Note]
     >To update the parameters, go to **Settings** of the dataset, and edit the parameters or select **Connect your data** in the banner.
         :::image type="Connect your data" source="media/operations-manager-managed-instance-create-reports-on-power-bi/connect-your-data.png" alt-text="Screenshot showing Connect your data option.":::
1. After you enter the parameters, select any one of the following authentication methods: 
    - SQL username and password-based method 
    - Azure Active Directory-based method 
    
    The dataset and reports will be refreshed. 

     >[!Note]
     >To view Power BI reports of multiple SCOM Managed Instances, **Microsoft SCOM managed instance reports** app must be installed individually in a different Power BI workspace.

## Next steps

[Connect the Azure Monitor SCOM Managed Instance to Ops console](connect-managed-instance-ops-console.md).