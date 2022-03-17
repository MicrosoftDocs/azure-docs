---
title: Free SQL Database with Azure free account
description: Guidance on how to deploy an Azure SQL Database for free using an Azure free account.
author: rajeshsetlem 
ms.author: rsetlem 
ms.service: sql-database
ms.subservice: service-overview
ms.topic: how-to 
ms.date: 02/25/2022
ms.custom: template-how-to 
---


# Try Azure SQL Database free with Azure free account

Azure SQL Database is an intelligent, scalable, relational database service built for the cloud. SQL Database is a fully managed platform as a service (PaaS) database engine that handles most database management functions such as upgrading, patching, backups, and monitoring without user involvement. 

Using an Azure free account, you can try Azure SQL Database for **free for 12 months** with the following **monthly limit**:
- **1 S0 database with 10 database transaction units and 250 GB storage**

This article shows you how to create and use an Azure SQL Database for free using an [Azure free account](https://azure.microsoft.com/free/). 


## Prerequisites

To try Azure SQL Database for free, you need:

- An Azure free account. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin. 


## Create a database

This article uses the Azure portal to create a SQL Database with public access. Alternatively, you can create a SQL Database using [PowerShell, the Azure CLI](./single-database-create-quickstart.md) or an [ARM template](./single-database-create-arm-template-quickstart.md).

To create your database, follow these steps: 

1. Sign in to the [Azure portal](https://portal.azure.com/) with your Azure free account.
1. Search for and select **SQL databases**: 
    
    :::image type="content" source="./media/free-sql-db-free-account-how-to-deploy/search-sql-database.png" alt-text="Screenshot that shows how to search and select SQL database.":::

    Alternatively, you can search for and navigate to **Free Services**, and then select the **Azure SQL Database** tile from the list:
    
    :::image type="content" source="media/free-sql-db-free-account-how-to-deploy/free-services-sql-database.png" alt-text="Screenshot that shows a list of all free services on the Azure portal.":::

1. Select **Create**.
1. On the **Basics** tab of the **Create SQL Database** form, under **Project details**, select the free trial Azure **Subscription**.
1. For **Resource group**, select **Create new**, enter *myResourceGroup*, and select **OK**.
1. For **Database name**, enter *mySampleDatabase*.
1. For **Server**, select **Create new**, and fill out the **New server** form with the following values:
   - **Server name**: Enter *mysqlserver*, and add some characters for uniqueness. We can't provide an exact server name to use because server names must be globally unique for all servers in Azure, not just unique within a subscription. So enter something like mysqlserver12345, and the portal lets you know if it's available or not.
   - **Server admin login**: Enter *azureuser*.
   - **Password**: Enter a password that meets complexity requirements, and enter it again in the **Confirm password** field.
   - **Location**: Select a location from the dropdown list.

   Select **OK**.

1. Leave **Want to use SQL elastic pool** set to **No**.
1. Under **Compute + storage**, select **Configure database**.
1. For the free trial, under **Service Tier** select **Standard (For workloads with typical performance requirements)**. Set **DTUs** to **10** and **Data max size (GB)** to **250**, and then select **Apply**.

    :::image type="content" source="media/free-sql-db-free-account-how-to-deploy/configure-database.png" alt-text="Screenshot that shows selecting database service tier.":::

1. Leave **Backup storage redundancy** set to **Geo-redundant backup storage**
1. Select **Next: Networking** at the bottom of the page.

   :::image type="content" source="./media/free-sql-db-free-account-how-to-deploy/create-database-basics-tab.png" alt-text="New SQL database - Basic tab":::

1. On the **Networking** tab, for **Connectivity method**, select **Public endpoint**.
1. For **Firewall rules**, set **Allow Azure services and resources to access this server** set to **Yes** and set **Add current client IP address** to **Yes**.
1. Leave **Connection policy** set to **Default**.
1. For **Encrypted Connections**, leave **Minimum TLS version** set to **TLS 1.2**.
1. Select **Next: Security** at the bottom of the page.

    :::image type="content" source="./media/free-sql-db-free-account-how-to-deploy/create-database-networking-tab.png" alt-text="Networking tab":::

1. Leave the values unchanged on **Security** tab. 


   :::image type="content" source="./media/free-sql-db-free-account-how-to-deploy/create-database-security-tab.png" alt-text="Security tab":::

1. Select **Next: Additional settings** at the bottom of the page.  
1. On the **Additional settings** tab, in the **Data source** section, for **Use existing data**, select **Sample**. This creates an AdventureWorksLT sample database so there are some tables and data to query and experiment with, as opposed to an empty blank database.
1. Select **Review + create** at the bottom of the page.

    :::image type="content" source="./media/free-sql-db-free-account-how-to-deploy/create-database-additional-settings-tab.png" alt-text="Additional settings":::

1. On the **Review + create** page, after reviewing, select **Create**.
 
    > [!IMPORTANT]
    > While creating the SQL Database from your Azure free account, you will still see an **Estimated cost per month** in the **Compute + Storage : Cost Summary** blade and **Review + Create** tab. But, as long as you are using your Azure free account, and your free service usage is within monthly limits, you won't be charged for the service. To view usage information, review [**Monitor and track free services usage**](#monitor-and-track-service-usage) later in this article. 
    
## Query the database

Once your database is created, you can use the **Query editor (preview)** in the Azure portal to connect to the database and query data.

1. In the portal, search for and select **SQL databases**, and then select your database from the list.
1. On the page for your database, select **Query editor (preview)** in the navigation menu. 
1. Enter your server admin login information, and select **OK**.

   :::image type="content" source="./media/single-database-create-quickstart/query-editor-login.png" alt-text="Sign in to Query editor":::

1. Enter the following query in the **Query editor** pane.

   ```sql
   SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName
   FROM SalesLT.ProductCategory pc
   JOIN SalesLT.Product p
   ON pc.productcategoryid = p.productcategoryid;
   ```

1. Select **Run**, and then review the query results in the **Results** pane.

   :::image type="content" source="./media/single-database-create-quickstart/query-editor-results.png" alt-text="Query editor results":::

1. Close the **Query editor** page, and select **OK** when prompted to discard your unsaved edits.

## Monitor and track service usage

You are not charged for the Azure SQL Database included with your Azure free account unless you exceed the free service limit. To remain within the limit, use the Azure portal to track and monitor your free services usage.


To track usage, follow these steps: 

1. In the Azure portal, search for **Subscriptions** and select the free trial subscription. 

1. On the **Overview** page, scroll down to see the tile **Top free services by usage**, and then select **View all free services**.

    :::image type="content" source="media/free-sql-db-free-account-how-to-deploy/free-services-usage-overview.png" alt-text="Screenshot that shows the Free Trial subscription overview page and highlights View all free services.":::

1. Locate the meters related to **Azure SQL Database** to track usage.

    :::image type="content" source="media/free-sql-db-free-account-how-to-deploy/free-services-tracking.png" alt-text="Screenshot that shows the View and track usage information blade on Azure portal for all free services.":::

The following table describes the values on the track usage page: 

| **Value**| **Description**|
| ----     | ---------- | 
|**Meter** | Identifies the unit of measure for the service being consumed. For example, the meter for Azure SQL Database is *SQL Database, Single Standard, S0 DTUs*, which tracks the number of S0 databases used per day, and has a monthly limit of 1. | 
| **Usage/limit** | The usage of the meter for the current month, and the limit for the meter.
| **Status**| The current status of your usage of the service defined by the meter. The possible values for status are: </br> **Not in use**: You haven't used the meter or the usage for the meter hasn't reached the billing system. </br> **Exceeded on \<Date\>**: You've exceeded the limit for the meter on \<Date\>. </br> **Unlikely to Exceed**: You're unlikely to exceed the limit for the meter. </br>**Exceeds on \<Date\>**: You're likely to exceed the limit for the meter on \<Date\>. | 


>[!IMPORTANT]
> - With an Azure free account, you also get $200 in credit to use in 30 days. During this time, any usage of the service beyond the free monthly amount is deducted from this credit.
> - At the end of your first 30 days or after you spend your $200 credit (whichever comes first), you'll only pay for what you use beyond the free monthly amount of services. To keep getting free services after 30 days, move to pay-as-you-go pricing. If you don't move to pay as you go, you can't purchase Azure services beyond your $200 credit and eventually your account and services will be disabled.
> - For more information, see [**Azure free account FAQ**](https://azure.microsoft.com/free/free-account-faq/).

## Clean up resources

When you're finished using these resources, you can delete the resource group you created, which will also delete the server and single database within it.

To delete **myResourceGroup** and all its resources using the Azure portal:

1. In the portal, search for and select **Resource groups**, and then select **myResourceGroup** from the list.
1. On the resource group page, select **Delete resource group**.
1. Under **Type the resource group name**, enter *myResourceGroup*, and then select **Delete**.


## Next steps

[Connect and query](connect-query-content-reference-guide.md) your database using different tools and languages:
> [!div class="nextstepaction"]
> [Connect and query using SQL Server Management Studio](connect-query-ssms.md)
>
> [Connect and query using Azure Data Studio](/sql/azure-data-studio/quickstart-sql-database?toc=/azure/sql-database/toc.json)

