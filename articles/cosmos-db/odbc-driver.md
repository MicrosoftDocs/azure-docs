---
title: Connect to Azure Cosmos DB using BI analytics tools | Microsoft Docs
description: Learn how to use the Azure Cosmos DB ODBC driver to create tables and views so that normalized data can be viewed in BI and data analytics software.
keywords: odbc, odbc driver
services: cosmos-db
author: mimig1
manager: jhubbard
editor: ''
documentationcenter: ''

ms.assetid: 9967f4e5-4b71-4cd7-8324-221a8c789e6b
ms.service: cosmos-db
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: rest-api
ms.topic: article
ms.date: 05/24/2017
ms.author: mimig

---

# Connect to Azure Cosmos DB using BI analytics tools with the ODBC driver

The Azure Cosmos DB ODBC driver enables you to connect to Azure Cosmos DB using BI analytics tools such as SQL Server Integration Services, Power BI Desktop, and Tableau so that you can analyze and create visualizations of your Azure Cosmos DB data in those solutions.

The Azure Cosmos DB ODBC driver is ODBC 3.8 compliant and supports ANSI SQL-92 syntax. The driver offers rich features to help you renormalize data in Azure Cosmos DB. Using the driver, you can represent data in Azure Cosmos DB as tables and views. The driver enables you to perform SQL operations against the tables and views including group by queries, inserts, updates, and deletes.

## Why do I need to normalize my data?
Azure Cosmos DB is a schemaless database, so it enables rapid development of apps by enabling applications to iterate their data model on the fly and not confine them to a strict schema. A single Azure Cosmos DB database can contain JSON documents of various structures. This is great for rapid application development, but when you want to analyze and create reports of your data using data analytics and BI tools, the data often needs to be flattened and adhere to a specific schema.

This is where the ODBC driver comes in. By using the ODBC driver, you can now renormalized data in Azure Cosmos DB into tables and views fitting to your data analytic and reporting needs. The renormalized schemas have no impact on the underlying data and do not confine developers to adhere to them, they simply enable you to leverage ODBC-compliant tools to access the data. So now your Azure Cosmos DB database will not only be a favorite for your development team, but your data analysts will love it too.

Now lets get started with the ODBC driver.

## <a id="install"></a>Step 1: Install the Azure Cosmos DB ODBC driver

1. Download the drivers for your environment:

    * [Microsoft Azure Cosmos DB ODBC 64-bit.msi](https://aka.ms/documentdb-odbc-64x64) for 64-bit Windows
    * [Microsoft Azure Cosmos DB ODBC 32x64-bit.msi](https://aka.ms/documentdb-odbc-32x64) for 32-bit on 64-bit Windows
    * [Microsoft Azure Cosmos DB ODBC 32-bit.msi](https://aka.ms/documentdb-odbc-32x32) for 32-bit Windows

    Run the msi file locally, which starts the **Microsoft Azure Cosmos DB ODBC Driver Installation Wizard**. 
2. Complete the installation wizard using the default input to install the ODBC driver.
3. Open the **ODBC Data source Administrator** app on your computer, you can do this by typing **ODBC Data sources** in the Windows search box. 
    You can confirm the driver was installed by clicking the **Drivers** tab and ensuring **Microsoft Azure Cosmos DB ODBC Driver** is listed.

    ![Azure Cosmos DB ODBC Data Source Administrator](./media/odbc-driver/odbc-driver.png)

## <a id="connect"></a>Step 2: Connect to your Azure Cosmos DB database

1. After [Installing the Azure Cosmos DB ODBC driver](#install), in the **ODBC Data Source Administrator** window, click **Add**. You can create a User or System DSN. In this example, we are creating a User DSN.
2. In the **Create New Data Source** window, select **Microsoft Azure Cosmos DB ODBC Driver**, and then click **Finish**.
3. In the **Azure Cosmos DB ODBC Driver SDN Setup** window, fill in the following: 

    ![Azure Cosmos DB ODBC Driver DSN Setup window](./media/odbc-driver/odbc-driver-dsn-setup.png)
    - **Data Source Name**: Your own friendly name for the ODBC DSN. This name is unique to your Azure Cosmos DB account, so name it appropriately if you have multiple accounts.
    - **Description**: A brief description of the data source.
    - **Host**: URI for your Azure Cosmos DB account. You can retrieve this from the Azure Cosmos DB Keys blade in the Azure portal, as shown in the following screenshot. 
    - **Access Key**: The primary or secondary, read-write or read-only key from the Azure Cosmos DB Keys blade in the Azure portal as shown in the following screenshot. We recommend you use the read-only key if the DSN is used for read-only data processing and reporting.
    ![Azure Cosmos DB Keys blade](./media/odbc-driver/odbc-driver-keys.png)
    - **Encrypt Access Key for**: Select the best choice based on the users of this machine. 
4. Click the **Test** button to make sure you can connect to your Azure Cosmos DB account. 
5. Click **Advanced Options** and set the following values:
    - **Query Consistency**: Select the [consistency level](consistency-levels.md) for your operations. The default is Session.
    - **Number of Retries**: Enter the number of times to retry an operation if the initial request does not complete due to service throttling.
    - **Schema File**: You have a number of options here.
        - By default, leaving this entry as is (blank), the driver scans the first page data for all collections to determine the schema of each collection. This is known as Collection Mapping. Without a schema file defined, the driver has to perform the scan for each driver session and could result in a higher start up time of an application using the DSN. We recommend that you always associate a schema file for a DSN.
        - If you already have a schema file (possibly one that you created using the [Schema Editor](#schema-editor)), you can click **Browse**, navigate to your file, click **Save**, and then click **OK**.
        - If you want to create a new schema, click **OK**, and then click **Schema Editor** in the main window. Then proceed to the [Schema Editor](#schema-editor) information. Upon creating the new schema file, please remember to go back to the **Advanced Options** window to include the newly created schema file.

6. Once you complete and close the **Azure Cosmos DB ODBC Driver DSN Setup** window, the new User DSN is added to the User DSN tab.

    ![New Azure Cosmos DB ODBC DSN on the User DSN tab](./media/odbc-driver/odbc-driver-user-dsn.png)

## <a id="#collection-mapping"></a>Step 3: Create a schema definition using the collection mapping method

There are two types of sampling methods that you can use: **collection mapping** or **table-delimiters**. A sampling session can utilize both sampling methods, but each collection can only use a specific sampling method. The steps below create a schema for the data in one or more collections using the collection mapping method. This sampling method retrieves the data in the page of a collection to determine the structure of the data. It transposes a collection to a table on the ODBC side. This sampling method is efficient and fast when the data in a collection is homogenous. If a collection contains heterogenous type of data, we recommend you use the [table-delimiters mapping method](#table-mapping) as it provides a more robust sampling method to determine the data structures in the collection. 

1. After completing steps 1-4 in [Connect to your Azure Cosmos DB database](#connect), click **Schema Editor** in the **Azure Cosmos DB ODBC Driver DSN Setup** window.

    ![Schema editor button in the Azure Cosmos DB ODBC Driver DSN Setup window](./media/odbc-driver/odbc-driver-schema-editor.png)
2. In the **Schema Editor** window, click **Create New**.
    The **Generate Schema** window displays all the collections in the Azure Cosmos DB account. 
3. Select one or more collections to sample, and then click **Sample**. 
4. In the **Design View** tab, the database, schema, and table are represented. In the table view, the scan displays the set of properties associated with the column names (SQL Name, Source Name, etc.).
    For each column, you can modify the column SQL name, the SQL type, SQL length (if applicable), Scale (if applicable), Precision (if applicable) and Nullable.
    - You can set **Hide Column** to **true** if you want to exclude that column from query results. Columns marked Hide Column = true are not returned for selection and projection, although they are still part of the schema. For example, you can hide all of the Azure Cosmos DB system required properties starting with “_”.
    - The **id** column is the only field that cannot be hidden as it is used as the primary key in the normalized schema. 
5. Once you have finished defining the schema, click **File** | **Save**, navigate to the directory to save the schema, and then click **Save**.

    If in the future you want to use this schema with a DSN, open the Azure Cosmos DB ODBC Driver DSN Setup window (via the ODBC Data Source Administrator), click Advanced Options, and then in the Schema File box, navigate to the saved schema. Saving a schema file to an existing DSN modifies the DSN connection to scope to the data and structure defined by schema.

## <a id="table-mapping"></a>Step 4: Create a schema definition using the table-delimiters mapping method

There are two types of sampling methods that you can use: **collection mapping** or **table-delimiters**. A sampling session can utilize both sampling methods, but each collection can only use a specific sampling method. 

The following steps create a schema for the data in one or more collections using the **table-delimiters** mapping method. We recommend that you use this sampling method when your collections contain heterogeneous type of data. You can use this method to scope the sampling to a set of attributes and its corresponding values. For example, if a document contains a “Type” property, you can scope the sampling to the values of this property. The end result of the sampling would be a set of tables for each of the values for Type you have specified. For example, Type = Car will produce a Car table while Type = Plane would produce a Plane table.

1. After completing steps 1-4 in [Connect to your Azure Cosmos DB database](#connect), click **Schema Editor** in the Azure Cosmos DB ODBC Driver DSN Setup window.
2. In the **Schema Editor** window, click **Create New**.
    The **Generate Schema** window displays all the collections in the Azure Cosmos DB account. 
3. Select a collection on the **Sample View** tab, in the **Mapping Definition** column for the collection, click **Edit**. Then in the **Mapping Definition** window, select **Table Delimiters** method. Then do the following:

    a. In the **Attributes** box, type the name of a delimiter property. This is a property in your document that you want to scope the sampling to, for instance, City and press enter. 

    b. If you only want to scope the sampling to certain values for the attribute you just entered, select the attribute in the selection box, then enter a value in the **Value** box, for example, Seattle and press enter. You can continue to add multiple values for attributes. Just ensure that the correct attribute is selected when you're entering values.

    For example, if you include an **Attributes** value of City, and you want to limit your table to only include rows with a city value of New York and Dubai, you would enter City in the Attributes box, and New York and then Dubai in the **Values** box.
4. Click **OK**. 
5. After completing the mapping definitions for the collections you want to sample, in the **Schema Editor** window, click **Sample**.
     For each column, you can modify the column SQL name, the SQL type, SQL length (if applicable), Scale (if applicable), Precision (if applicable) and Nullable.
    - You can set **Hide Column** to **true** if you want to exclude that column from query results. Columns marked Hide Column = true are not returned for selection and projection, although they are still part of the schema. For example, you can hide all the Azure Cosmos DB system required properties starting with “_”.
    - The **id** column is the only field that cannot be hidden as it is used as the primary key in the normalized schema. 
6. Once you have finished defining the schema, click **File** | **Save**, navigate to the directory to save the schema, and then click **Save**.
7. Back in the **Azure Cosmos DB ODBC Driver DSN Setup** window, click ** Advanced Options**. Then, in the **Schema File** box, navigate to the saved schema file and click **OK**. Click **OK** again to save the DSN. This saves the schema you created to the DSN. 

## (Optional) Creating views
You can define and create views as part of the sampling process. These views are equivalent to SQL views. They are read-only and are scope the selections and projections of the Azure Cosmos DB SQL defined. 

To create a view for your data, in the **Schema Editor** window, in the **View Definitions** column, click **Add** on the row of the collection to sample. Then in the **View Definitions** window, do the following:
1. Click **New**, enter a name for the view, for example, EmployeesfromSeattleView and then click **OK**.
2. In the **Edit view** window, enter an Azure Cosmos DB query. This must be an Azure Cosmos DB SQL query, for example`SELECT c.City, c.EmployeeName, c.Level, c.Age, c.Gender, c.Manager FROM c WHERE c.City = “Seattle”`, and then click **OK**.

You can create a many views as you like. Once you are done defining the views, you can then sample the data. 

## Step 5: View your data in BI tools such as Power BI Desktop

You can use your new DSN to connect DocumentADB with any ODBC-compliant tools - this step simply shows you how to connect to Power BI Desktop and create a Power BI visualization.

1. Open Power BI Desktop.
2. Click **Get Data**.
3. In the **Get Data** window, click **Other** | **ODBC** | **Connect**.
4. In the **From ODBC** window, select the data source name you created, and then click **OK**. You can leave the **Advanced Options** entries blank.
5. In the **Access a data source using an ODBC driver** window, select **Default or Custom** and then click **Connect**. You do not need to include the **Credential connection string properties**.
6. In the **Navigator** window, in the left pane, expand the database, the schema, and then select the table. The results pane includes the data using the schema you created.
7. To visualize the data in Power BI desktop, check the box in front of the table name, and then click **Load**.
8. In Power BI Desktop, on the far left, select the Data tab ![Data tab in Power BI Desktop](./media/odbc-driver/odbc-driver-data-tab.png) to confirm your data was imported.
9. You can now create visuals using Power BI by clicking on the Report tab ![Report tab in Power BI Desktop](./media/odbc-driver/odbc-driver-report-tab.png), clicking **New Visual**, and then customizing your tile. For more information about creating visualizations in Power BI Desktop, see [Visualization types in Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-visualization-types-for-reports-and-q-and-a/).

## Troubleshooting

If you receive the following error, ensure the **Host** and **Access Key** values you copied the Azure portal in [Step 2](#connect) are correct and then retry. Use the copy buttons to the right of the **Host** and **Access Key** values in the Azure portal to copy the values error free.

    [HY000]: [Microsoft][Azure Cosmos DB] (401) HTTP 401 Authentication Error: {"code":"Unauthorized","message":"The input authorization token can't serve the request. Please check that the expected payload is built as per the protocol, and check the key being used. Server used the following payload to sign: 'get\ndbs\n\nfri, 20 jan 2017 03:43:55 gmt\n\n'\r\nActivityId: 9acb3c0d-cb31-4b78-ac0a-413c8d33e373"}`

## Next steps

To learn more about Azure Cosmos DB, see [What is Azure Cosmos DB?](introduction.md).
