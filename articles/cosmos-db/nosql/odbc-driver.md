---
title: ODBC driver for BI and analytics
titleSuffix: Azure Cosmos DB
description: Use the ODBC driver for Azure Cosmos DB to create normalized data tables and views for SQL queries, analytics, BI, and visualizations.
author: seesharprun
ms.author: sidandrews
ms.reviewer: mjbrown
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: conceptual
ms.date: 03/16/2023
ms.custom: kr2b-contr-experiment
---

# Use the Azure Cosmos DB ODBC driver to connect to BI and data analytics tools

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article walks you through installing and using the Azure Cosmos DB ODBC driver to create normalized tables and views for your Azure Cosmos DB data. You can query the normalized data with SQL queries, or import the data into Power BI or other BI and analytics software to create reports and visualizations.

Azure Cosmos DB is a schemaless database, which enables rapid application development and lets you iterate on data models without being confined to a strict schema. A single Azure Cosmos DB database can contain JSON documents of various structures. To analyze or report on this data, you might need to flatten the data to fit into a schema.

The ODBC driver normalizes Azure Cosmos DB data into tables and views that fit your data analytics and reporting needs. The normalized schemas let you use ODBC-compliant tools to access the data. The schemas have no effect on the underlying data, and don't require developers to adhere to them. The ODBC driver helps make Azure Cosmos DB databases useful for data analysts and development teams.

You can do SQL operations against the normalized tables and views, including group by queries, inserts, updates, and deletes. The driver is ODBC 3.8 compliant and supports ANSI SQL-92 syntax.

> [!IMPORTANT]
> Consider using [Azure Synapse Link for Azure Cosmos DB](../synapse-link.md) to create tables and views for your data. Synapse Link has distinct performance benefits for large datasets over the ODBC driver. You can also connect the normalized Azure Cosmos DB data to other software solutions, such as SQL Server Integration Services (SSIS), QlikSense, Tableau and other analytics software, BI, and data integration tools. You can use those solutions to analyze, move, transform, and create visualizations with your Azure Cosmos DB data.

> [!IMPORTANT]
>
> - Connecting to Azure Cosmos DB with the ODBC driver is currently supported for Azure Cosmos DB for NoSQL only.
> - The current ODBC driver doesn't support aggregate pushdowns, and has known issues with some analytics tools. Until a new version is released, you can use one of the following alternatives:
>   - [Azure Synapse Link](../synapse-link.md) is the preferred analytics solution for Azure Cosmos DB. With Azure Synapse Link and Azure Synapse SQL serverless pools, you can use any BI tool to extract near real-time insights from Azure Cosmos DB SQL or API for MongoDB data.
>   - For Power BI, you can use the [Azure Cosmos DB connector for Power BI](powerbi-visualize.md).
>   - For Qlik Sense, see [Connect Qlik Sense to Azure Cosmos DB](../visualize-qlik-sense.md).
>

## Install the ODBC driver and connect to your database

1. Download the drivers for your environment:

    | Installer | Supported operating systems |
    | --- | --- |
    | [Microsoft Azure Cosmos DB ODBC 64-bit.msi](https://aka.ms/cosmos-odbc-64x64) for 64-bit Windows | 64-bit versions of Windows 8.1 or later, Windows 8, Windows 7. 64-bit versions of  Windows Server 2012 R2, Windows Server 2012, and Windows Server 2008 R2. |
    | [Microsoft Azure Cosmos DB ODBC 32x64-bit.msi](https://aka.ms/cosmos-odbc-32x64) for 32-bit on 64-bit Windows | 64-bit versions of Windows 8.1 or later, Windows 8, Windows 7, Windows XP, Windows Vista. 64-bit versions of Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2, and Windows Server 2003. |
    | [Microsoft Azure Cosmos DB ODBC 32-bit.msi](https://aka.ms/cosmos-odbc-32x32) for 32-bit Windows | 32-bit versions of Windows 8.1 or later, Windows 8, Windows 7, Windows XP, and Windows Vista. |

1. Run the *.msi* file locally, which starts the **Microsoft Azure Cosmos DB ODBC Driver Installation Wizard**.

1. Complete the installation wizard using the default input.

1. After the driver installs, type *ODBC Data sources* in the Windows search box, and open the **ODBC Data Source Administrator**.

1. Make sure that the **Microsoft Azure DocumentDB ODBC Driver** is listed on the **Drivers** tab.

    :::image type="content" source="./media/odbc-driver/odbc-driver.png" alt-text="Screenshot of the ODBC Data Source Administrator window.":::

1. Select the **User DSN** tab, and then select **Add** to create a new data source name (DSN). You can also create a System DSN.

1. In the **Create New Data Source** window, select **Microsoft Azure DocumentDB ODBC Driver**, and then select **Finish**.

1. In the **DocumentDB ODBC Driver DSN Setup** window, fill in the following information:

    :::image type="content" source="./media/odbc-driver/odbc-driver-dsn-setup.png" alt-text="Screenshot of the domain name server (DNS) setup window.":::

    - **Data Source Name**: A friendly name for the ODBC DSN. This name is unique to this Azure Cosmos DB account.
    - **Description**: A brief description of the data source.
    - **Host**: The URI for your Azure Cosmos DB account. You can get this information from the **Keys** page in your Azure Cosmos DB account in the Azure portal.
    - **Access Key**: The primary or secondary, read-write or read-only key from the Azure Cosmos DB **Keys** page in the Azure portal. It's best to use the read-only keys, if you use the DSN for read-only data processing and reporting.

    To avoid an authentication error, use the copy buttons to copy the URI and key from the Azure portal.

    :::image type="content" source="./media/odbc-driver/odbc-cosmos-account-keys.png" alt-text="Screenshot of the Azure Cosmos DB Keys page.":::

    - **Encrypt Access Key for**: Select the best choice, based on who uses the machine.

1. Select **Test** to make sure you can connect to your Azure Cosmos DB account.

1. Select **Advanced Options** and set the following values:

    - **REST API Version**: Select the [REST API version](/rest/api/cosmos-db) for your operations. The default is **2015-12-16**.

        If you have containers with [large partition keys](../large-partition-keys.md) that need REST API version `2018-12-31`, type `2018-12-31`, and then [follow the steps at the end of this procedure](#edit-the-windows-registry-to-support-rest-api-version-2018-12-31).

    - **Query Consistency**: Select the [consistency level](../consistency-levels.md) for your operations. The default is **Session**.

    - **Number of Retries**: Enter the number of times to retry an operation if the initial request doesn't complete due to service rate limiting.

    - **Schema File**: If you don't select a schema file, the driver scans the first page of data for each container to determine its schema, called container mapping, for each session. This process can cause long startup time for applications that use the DSN. It's best to associate a schema file to the DSN.

        - If you already have a schema file, select **Browse**, navigate to the file, select **Save**, and then select **OK**.

        - If you don't have a schema file yet, select **OK**, and then follow the steps in the next section to [create a schema definition](#create-a-schema-definition). After you create the schema, come back to this **Advanced Options** window to add the schema file.

After you select **OK** to complete and close the **DocumentDB ODBC Driver DSN Setup** window, the new User DSN appears on the **User DSN** tab of the **ODBC Data Source Administrator** window.

:::image type="content" source="./media/odbc-driver/odbc-driver-user-dsn.png" alt-text="Screenshot that shows the new User D S N on the User D S N tab.":::

### Edit the Windows registry to support REST API version 2018-12-31

If you have containers with [large partition keys](../large-partition-keys.md) that need REST API version 2018-12-31, follow these steps to update the Windows registry to support this version.

1. In the Windows **Start** menu, type *regedit* to find and open the **Registry Editor**.

1. In the Registry Editor, navigate to the path **Computer\HKEY_LOCAL_MACHINE\SOFTWARE\ODBC\ODBC.INI**.

1. Create a new subkey with the same name as your DSN, such as *Contoso Account ODBC DSN*.

1. Navigate to the new **Contoso Account ODBC DSN** subkey, and right-click to add a new **String** value:

    - Value Name: **IgnoreSessionToken**

    - Value data: **1**

    :::image type="content" source="./media/odbc-driver/cosmos-odbc-edit-registry.png" alt-text="Screenshot that shows the Windows Registry Editor settings.":::

## Create a schema definition

There are two types of sampling methods you can use to create a schema: *container mapping* or *table-delimiter mapping*. A sampling session can use both sampling methods, but each container can use only one of the sampling methods. Which method to use depends on your data's characteristics.

- **Container mapping** retrieves the data on a container page to determine the data structure, and transposes the container to a table on the ODBC side. This sampling method is efficient and fast when the data in a container is homogenous.

- **Table-delimiter mapping** provides more robust sampling for heterogeneous data. This method scopes the sampling to a set of attributes and corresponding values.

    For example, if a document contains a **Type** property, you can scope the sampling to the values of this property. The end result of the sampling is a set of tables for each of the **Type** values you specified. **Type = Car** produces a **Car** table, while **Type = Plane** produces a **Plane** table.

To define a schema, follow these steps. For the table-delimiter mapping method, you take extra steps to define attributes and values for the schema.

1. On the **User DSN** tab of the **ODBC Data Source Administrator** window, select your Azure Cosmos DB User DSN Name, and then select **Configure**.

1. In the **DocumentDB ODBC Driver DSN Setup** window, select **Schema Editor**.

    :::image type="content" source="./media/odbc-driver/odbc-driver-schema-editor.png" alt-text="Screenshot that shows the Schema Editor button in the D S N Setup window.":::

1. In the **Schema Editor** window, select **Create New**.

1. The **Generate Schema** window displays all the collections in the Azure Cosmos DB account. Select the checkboxes next to the containers you want to sample.

1. To use the *container mapping* method, select **Sample**.

    Or, to use *table-delimiter* mapping, take the following steps to define attributes and values for scoping the sample.

    1. Select **Edit** in the **Mapping Definition** column for your DSN.

    1. In the **Mapping Definition** window, under **Mapping Method**, select **Table Delimiters**.

    1. In the **Attributes** box, type the name of a delimiter property in your document that you want to scope the sampling to, for instance, *City*. Press Enter.

    1. If you want to scope the sampling to certain values for the attribute you entered, select the attribute, and then enter a value in the **Value** box, such as *Seattle*, and press Enter. You can add multiple values for attributes. Just make sure that the correct attribute is selected when you enter values.

    1. When you're done entering attributes and values, select **OK**.

    1. In the **Generate Schema** window, select **Sample**.

1. In the **Design View** tab, refine your schema. The **Design View** represents the database, schema, and table. The table view displays the set of properties associated with the column names, such as **SQL Name** and **Source Name**.

    For each column, you can modify the **SQL name**, the **SQL type**, **SQL length**, **Scale**, **Precision**, and **Nullable** as applicable.

    You can set **Hide Column** to **true** if you want to exclude that column from query results. Columns marked **Hide Column = true** aren't returned for selection and projection, although they're still part of the schema. For example, you can hide all of the Azure Cosmos DB system required properties that start with **_**. The **id** column is the only field you can't hide, because it's the primary key in the normalized schema.

1. Once you finish defining the schema, select **File** > **Save**, navigate to the directory to save in, and select **Save**.

1. To use this schema with a DSN, in the **DocumentDB ODBC Driver DSN Setup** window, select **Advanced Options**. Select the **Schema File** box, navigate to the saved schema, select **OK** and then select **OK** again. Saving the schema file modifies the DSN connection to scope to the schema-defined data and structure.

### Create views

Optionally, you can define and create views in the **Schema Editor** as part of the sampling process. These views are equivalent to SQL views. The views are read-only, and scope to the selections and projections of the defined Azure Cosmos DB SQL query.

Follow these steps to create a view for your data:

1. On the **Sample View** tab of the **Schema Editor** window, select the containers you want to sample, and then select **Add** in the **View Definition** column.

   :::image type="content" source="./media/odbc-driver/odbc-driver-create-view.png" alt-text="Screenshot of creating a view within the driver.":::

1. In the **View Definitions** window, select **New**. Enter a name for the view, for example *EmployeesfromSeattleView*, and then select **OK**.

1. In the **Edit view** window, enter an [Azure Cosmos DB query](query/getting-started.md), for example:

   `SELECT c.City, c.EmployeeName, c.Level, c.Age, c.Manager FROM c WHERE c.City = "Seattle"`

1. Select **OK**.

   :::image type="content" source="./media/odbc-driver/odbc-driver-create-view-2.png" alt-text="Screenshot of adding a query when creating a view.":::

You can create as many views as you like. Once you're done defining the views, select **Sample** to sample the data.

> [!IMPORTANT]
> The query text in the view definition should not contain line breaks. Otherwise, we will get a generic error when previewing the view.

## Query with SQL Server Management Studio

Once you set up an Azure Cosmos DB ODBC Driver User DSN, you can query Azure Cosmos DB from SQL Server Management Studio (SSMS) by setting up a linked server connection.

1. [Install SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) and connect to the server.

1. In the SSMS query editor, create a linked server object for the data source by running the following commands. Replace `DEMOCOSMOS` with the name for your linked server, and `SDS Name` with your data source name.

    ```sql
    USE [master]
    GO
    
    EXEC master.dbo.sp_addlinkedserver @server = N'DEMOCOSMOS', @srvproduct=N'', @provider=N'MSDASQL', @datasrc=N'SDS Name'
    
    EXEC master.dbo.sp_addlinkedsrvlogin @rmtsrvname=N'DEMOCOSMOS', @useself=N'False', @locallogin=NULL, @rmtuser=NULL, @rmtpassword=NULL
    
    GO
    ```

To see the new linked server name, refresh the linked servers list.

:::image type="content" source="./media/odbc-driver/odbc-driver-linked-server-ssms.png" alt-text="Screenshot showing a linked server in S S M S.":::

To query the linked database, enter an SSMS query. In this example, the query selects from the table in the container named `customers`:

```sql
SELECT * FROM OPENQUERY(DEMOCOSMOS, 'SELECT *  FROM [customers].[customers]')
```

Execute the query. The results should look similar to the following output:

```output
attachments/  1507476156    521 Bassett Avenue, Wikieup, Missouri, 5422   "2602bc56-0000-0000-0000-59da42bc0000"   2015-02-06T05:32:32 +05:00 f1ca3044f17149f3bc61f7b9c78a26df
attachments/  1507476156    167 Nassau Street, Tuskahoma, Illinois, 5998   "2602bd56-0000-0000-0000-59da42bc0000"   2015-06-16T08:54:17 +04:00 f75f949ea8de466a9ef2bdb7ce065ac8
attachments/  1507476156    885 Strong Place, Cassel, Montana, 2069       "2602be56-0000-0000-0000-59da42bc0000"   2015-03-20T07:21:47 +04:00 ef0365fb40c04bb6a3ffc4bc77c905fd
attachments/  1507476156    515 Barwell Terrace, Defiance, Tennessee, 6439     "2602c056-0000-0000-0000-59da42bc0000"   2014-10-16T06:49:04 +04:00      e913fe543490432f871bc42019663518
attachments/  1507476156    570 Ruby Street, Spokane, Idaho, 9025       "2602c156-0000-0000-0000-59da42bc0000"   2014-10-30T05:49:33 +04:00 e53072057d314bc9b36c89a8350048f3
```

## View your data in Power BI Desktop

You can use your DSN to connect to Azure Cosmos DB with any ODBC-compliant tools. This procedure shows you how to connect to Power BI Desktop to create a Power BI visualization.

1. In Power BI Desktop, select **Get Data**.

    :::image type="content" source="./media/odbc-driver/odbc-driver-power-bi-get-data.png" alt-text="Screenshot showing Get Data in Power B I Desktop.":::

1. In the **Get Data** window, select **Other** > **ODBC**, and then select **Connect**.

    :::image type="content" source="./media/odbc-driver/odbc-driver-power-bi-get-data-2.png" alt-text="Screenshot that shows choosing ODBC data source in Power B I Get Data.":::

1. In the **From ODBC** window, select the DSN you created, and then select **OK**.

    :::image type="content" source="./media/odbc-driver/odbc-driver-power-bi-get-data-3.png" alt-text="Screenshot that shows choosing the D S N in Power B I Get Data.":::

1. In the **Access a data source using an ODBC driver** window, select **Default or Custom** and then select **Connect**.

1. In the **Navigator** window, in the left pane, expand the database and schema, and select the table. The results pane includes the data that uses the schema you created.

    :::image type="content" source="./media/odbc-driver/odbc-driver-power-bi-get-data-4.png" alt-text="Screenshot of selecting the table in Power B I Get Data.":::

1. To visualize the data in Power BI desktop, select the checkbox next to the table name, and then select **Load**.

1. In Power BI Desktop, select the **Data** tab on the left of the screen to confirm your data was imported.

1. Select the **Report** tab on the left of the screen, select **New visual** from the ribbon, and then customize the visual.

## Troubleshooting

- **Problem**: You get the following error when trying to connect:

    ```output
    [HY000]: [Microsoft][Azure Cosmos DB] (401) HTTP 401 Authentication Error: {"code":"Unauthorized","message":"The input authorization token can't serve the request. Please check that the expected payload is built as per the protocol, and check the key being used. Server used the following payload to sign: 'get\ndbs\n\nfri, 20 jan 2017 03:43:55 gmt\n\n'\r\nActivityId: 9acb3c0d-cb31-4b78-ac0a-413c8d33e373"}
    ```

    **Solution:** Make sure the **Host** and **Access Key** values you copied from the Azure portal are correct, and retry.

- **Problem**: You get the following error in SSMS when trying to create a linked Azure Cosmos DB server:

    ```output
    Msg 7312, Level 16, State 1, Line 44
    
    Invalid use of schema or catalog for OLE DB provider "MSDASQL" for linked server "DEMOCOSMOS". A four-part name was supplied, but the provider does not expose the necessary interfaces to use a catalog or schema.
    ```

    **Solution**: A linked Azure Cosmos DB server doesn't support four-part naming.

## Next steps

- To learn more about Azure Cosmos DB, see [Welcome to Azure Cosmos DB](../introduction.md).
- For more information about creating visualizations in Power BI Desktop, see [Visualization types in Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-visualization-types-for-reports-and-q-and-a/).
