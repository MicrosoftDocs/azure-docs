---
title: Connect DocumentDB to data visualization software | Microsoft Docs
description: Learn how to use the Azure DocumentDB ODBC driver to create schemas and views so that normalized data can be viewed in BI data visualization software.
keywords: odbc, odbc driver
services: documentdb
author: mimig1
manager: jhubbard
editor: ''
documentationcenter: ''

ms.assetid: 9967f4e5-4b71-4cd7-8324-221a8c789e6b
ms.service: documentdb
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: rest-api
ms.topic: article
ms.date: 01/20/2016
ms.author: mimig

---

# Connect DocumentDB to data visualization software with the ODBC Driver

The DocumentDB ODBC driver enables you to connect to data visualization services such as Power BI Desktop and Tableau so that you can create visualizations of your DocumentDB data in those solutions. 

Using the ODBC driver, you can create schemas for an entire collection, or you can limit your results to display the columns, and even the values that you want to view in your BI solution. 

The ODBC driver works with any NC-92 compliant service.

## Why do I need to normalize my data to visualize it?
DocumentDB is a non-relational, NoSQL database, so it enables rapid development of apps by enabling them to iterate their data model on the fly and not confine them to to a strict schema. So a single DocumentDB database can contain JSON documents that don't adhere to a single (or even multiple schemas). This is great for rapid development, but when you want to take a closer look at your data using BI solutions, you're required to present normalized data - data adhering to a specific schema. 

This is where the ODBC driver comes in. By using the ODBC driver, you can create schemas and views of specific portions of your DocumentDB data so that only the data of interest to you is displayed in your BI solutions. The schemas have no impact on the underlying data and do not confine developers to adhere to them, they simply enable you to customize your views of the data. So now your DocumentDB database will not only be a favorite for your dev team, but your data analysts will love it too.

Now lets get started with the ODBC driver, so you can visualize your data using your favorite BI service.

## <a id="install"></a>Step 1: Install the DocumentDB ODBC driver
1. Download either the Microsoft Azure DocumentDB ODBC 64-bit.msi or Microsoft Azure DocumentDB ODBC 32-bit.msi file depending on your operating system. 
2. Run the msi file locally, which starts the **Microsoft Azure DocumentDB ODBC Driver Wizard**. 
3. Complete the wizard using the default input to install the ODBC driver.
4. Open the **ODBC Data sources** app on your computer, you can do this by typing **ODBC Data sources** in the Windows search box. 
    You can confirm the driver was installed by clicking the **Drivers** tab and ensuring **Microsoft DocumentDB ODBC Driver** is listed.

    ![DocumentDB ODBC Data Source Administrator](./media/documentdb-odbc-driver/documentdb-odbc-driver.png)

## <a id="connect"></a>Step 2: Connect to your DocumentDB database

1. After [Intalling the DocumentDB ODBC driver](#install), in the **ODBC Data Source Administrator** window, click **Add**.
2. In the **Create New Data Source** window, select **Microsoft DocumentDB ODBC Driver**, and then click **Finish**.
3. In the **DocumentDB ODBC Driver SDN Setup** window, fill in the following: 

    ![DocumentDB ODBC Driver DSN Setup window](./media/documentdb-odbc-driver/documentdb-odbc-driver-dsn-setup.png)
    - **Data Source Name**: Your own friendly name for the ODBC DSN. This name is unique to your DocumentDB account, so name it appropriately if you have multiple accounts.
    - **Description**: A brief description of the data source.
    - **Host**: URI for your DocumentDB account. You can retrieve this from the DocumentDB Keys blade in the Azure portal, as shown in the following screenshot. 
    - **Access Key**: The primary or secondary, read-write or read-only key from the DocumentDB Keys blade in the Azure portal as shown in the following screenshot.
    ![DocumentDB Keys blade](./media/documentdb-odbc-driver/documentdb-odbc-driver-keys.png)
    - **Encrypt Access Key for**: Select the best choice based on the users of this machine. 
4. Click the **Test** button to make sure you can connect to you DocumentDB account. 
5. Click **Advanced Options** and set the following:
    - **Query Consistency**: Select the [consistency level](documentdb-consistency-levels.md) for your queries. 
    - **Number of Retries**: Enter the number of times to retry the query if the initial request does not complete.
    - **Schema File**: You have a number of options here. 
        - If you already have a schema file (possibly one you created using the [Schema Editor](#schema-editor) but want to apply to a different account), you can click **Browse**, navigate to your file, click **Save**, and then click **OK**.
        - If you want to create a schema that represents a whole collection (known as collection mapping) leave this entry as is, click **OK**, and then click **OK** again.
        - If you want to create a new schema for only some of the columns and values in your collection, click **OK**, and then click **Schema Editor**. Then proceed to the [Schema Editor](#schema-editor) information.

6. Once you complete and close the **DocumentDB ODBC Driver DSN Setup** window, the new User DSN is added to the User DSN tab.
    ![New DocumentDB ODBC DSN on the User DSN tab](./media/documentdb-odbc-driver/documentdb-odbc-driver-user-dsn.png)

## <a id="#collection-mapping"></a>Step 3: (Optional) Create a normalized schema definition for all the data in one or more collections

This step is optional and should only be used if you want to create a schema definition for all the data in one or more collections. If you want to create a customized schema or view for only some of the data in your database, skip to [Step 4](#table-mapping).

1. After completing steps 1-4 in [Connect to your DocumentDB database](#connect), click **Schema Editor** in the **DocumentDB ODBC Driver DSN Setup** window.
    ![Schema editor button in the DocumentDB ODBC Driver DSN Setup window](./media/documentdb-odbc-driver/documentdb-odbc-driver-schema-editor.png)
2. In the **Schema Editor** window, click **Create New**.
    The **Generate Schema** window displays all of the collections in the DocumentDB account. 
3. Select one or more collections to sample, and then click **Sample**. This will limit the results to the values in that collection. 
4. In the **Design View** tab, the database, schema, and table are represented. In the table view, the scan displays the set of properties associated with the column names (SQL Name, Source Name, etc.).
    For each column number (Column #1, etc) you modify any of the values with the arrow drop down. For example:
   - You can set **Hide Column** to **true** if you want to exclude that column from query results. Columns marked Hide Column = true are not returned for selection and projection, although they are still part of the schema. 
   - The **id** column is the only field that cannot be hidden as it is used as the primary key in the normalized schema. 
5. Once you have modified the table to contain the information you want, click **File** | **Save**, navigate to the directory to save the schema, and then click **Save**.

    If in the future you want to use this schema with a DSN, open the DocumentDB ODBC Driver DSN Setup window, click Advanced Options, and then in the Schema File box, navigate to the saved schema. Saving the schema to a User DSN modifies the connection so that only the information contained in the schema is displayed.

## <a id="table-mapping"></a>Step 4: (Optional) Create a new schema definition or view for some data in a collection using the Schema Editor

Using the Schema Editor you can create custom schemas and views for your DocumentDB data. 

This step is optional, and should only be used if you want to create schema or views for some of the data in your database. If you want to create a schema for all the data in your collection, see [Step 3](#collection-mapping).

1. After completing steps 1-4 in [Connect to your DocumentDB database](#connect), click **Schema Editor** in the DocumentDB ODBC Driver DSN Setup window.
2. In the **Schema Editor** window, click **Create New**.
    The **Generate Schema** window displays all of the collections in the DocumentDB account. 
3. Select one or more collections on the **Sample View** tab, then you can either create schemas or views for that collection or set of collections.
4. If you want to create custom schemas for your data, in the **Mapping Definition** column for the collection, click **Edit**. Then in the **Mapping Definition** window, define your table delimiters. 
    - Select **Collection Mapping** if you want to include all properties from the DocumentDB collection in the new schema.
    or
    - Select **Table Delimiters** if you want to include only specific columns or values in the new schema. Then do the following:
        1. In the **Attributes** box, type the name of a delimiter property and press enter. 
        2. If you only want to include certain values for the attribute you just entered, select the attribute, then enter a value in the **Value** box and press enter. You can continue to add multiple values for attributes. Just ensure that the correct attribute is selected when you're entering values.
        
        For example, if you include an **Attributes** value of City, and you want to limit your table to only include rows with a city value of New York and Dubai, you would enter City in the Attributes box, and New York and then Dubai in the **Values** box.
        Click **OK**. 
6. If you want to create a view for your data, in the **Schema Editor** window, in the **View Definitions** column, click **Add**. Then in the **View Definitions** window, do the following:
    1. Click **New**, enter a name for the view, and then click **OK**.
    2. In the **Edit view** window, enter a DocumentDB query, such as `SELECT * FROM all`, and then click **OK**.
6. In the **Schema Editor** window, click **Sample** to see the results of the table mapping. 
7. In the **Design View** tab, the database, schema, and table are represented. In the table view, the scan displays the set of properties associated with the column names (SQL Name, Source Name, etc.).
    For each column number (Column #1, etc) you modify any of the values with the arrow drop down. For example:
   - You can set **Hide Column** to **true** if you want to exclude that column from query results. Columns marked Hide Column = true are not returned for selection and projection, although they are still part of the schema. 
   - The **id** column is the only field that cannot be hidden as it is used as the primary key in the normalized schema. 
8. Once your data appears the way you want it, click **File** | **Save** to save your schema map.
9. Back in the **DocumentDB ODBC Driver DSN Setup** window, click **OK**. This will save the schema and view you created to the User DSN, and BI solutions will only display the data you've selected here. 

## Step 5: View your data in BI solution such as Power BI Desktop

You can use your new User DSN, schemas, and views to connect to any NC-92 compliant service - this step simply shows you how to connect to Power BI Desktop and create a visualization.

1. Open Power BI Desktop.
2. Click **Get Data**.
3. In the **Get Data** window, click **Other** | **ODBC** | **Connect**.
4. In the **From ODBC** window, select the data source name you created, and then click **OK**. You can leave the **Advanced Options** entries blank.
5. In the **Access a data source using an ODBC driver** window, select **Default or Custom** and then click **Connect**. You do not need to include the **Credential connection string properties**.
6. In the **Navigator** window, in the left pane, epand the database, the schema, and then select the table. The results pane includes the data using the schema you created.
7. To visualize the data in Power BI desktop, check the box in front of the table name, and then click **Load**.
8. In Power BI Desktop, on the far left, select the Data tab ![Data tab in Power BI Desktop](./media/documentdb-odbc-driver/documentdb-odbc-driver-data-tab.png) to confirm your data was imported.
9. You can now create visuals using Power BI by clicking on the Report tab ![Report tab in Power BI Desktop](./media/documentdb-odbc-driver/documentdb-odbc-driver-report-tab.png), clicking **New Visual**, and then customizing your tile. For more information about creating visualizations in Power BI Desktop, see [Visualization types in Power BI](https://powerbi.microsoft.com/documentation/powerbi-service-visualization-types-for-reports-and-q-and-a/).

## Troubleshooting

If you receive the following error, ensure the **Host** and **Access Key** values you copied the Azure portal in [Step 2](#connect) are correct and then retry. Use the copy buttons to the right of the **Host** and **Access Key** values in the Azure portal to copy the values error free.

    [HY000]: [Microsoft][DocumentDB] (401) HTTP 401 Authentication Error: {"code":"Unauthorized","message":"The input authorization token can't serve the request. Please check that the expected payload is built as per the protocol, and check the key being used. Server used the following payload to sign: 'get\ndbs\n\nfri, 20 jan 2017 03:43:55 gmt\n\n'\r\nActivityId: 9acb3c0d-cb31-4b78-ac0a-413c8d33e373"}`  