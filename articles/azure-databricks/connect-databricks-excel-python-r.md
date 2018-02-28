---
title: 'Connect to Azure Databricks from Excel, Python, and R | Microsoft Docs'
description: Learn how to use the Simba driver to connect Azure Databricks to Excel, Python, and R.
services: azure-databricks
documentationcenter: ''
author: nitinme
manager: cgronlun
editor: cgronlun

ms.service: azure-databricks
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/01/2018
ms.author: nitinme

---

# Connect to Azure Databricks from Excel, Python, and R

In this article, you learn how to use the Databricks ODBC driver to connect Azure Databricks with Microsoft Excel, Python, and R language.

## Prerequisites

* You must have an Azure Databricks workspace, a Spark cluster, and sample data associated with your cluster. If you do not already have these, complete the quickstart at [Run a Spark job on Azure Databricks using the Azure portal](quickstart-create-databricks-workspace-portal.md).

* Download the Databricks ODBC driver from [here](https://databricks.com/spark/odbc-driver-download). Install the 32-bit or 64-bit version depending on the application from where you want to connect to Azure Databricks. For example, to connect from Excel, you must install the 32-bit version of the driver. To connect from R and Python, you must install the 64-bit version of the driver.

* Set up a personal access token in Databricks. For instructions, see [Token management](https://docs.azuredatabricks.net/api/latest/authentication.html#token-management).

## Set up a DSN

A data source name (DSN) contains the information about a specific data source. An ODBC driver needs this DSN in order to connect to a data source. In this section, set up a DSN that can be used with the Databricks ODBC driver to connect to Azure Databricks from clients like Microsoft Excel, Python, etc.

1. From the Azure Databricks workspace, navigate to the Databricks cluster.

    ![Open Databricks cluster](./media/connect-databricks-excel-python-r/open-databricks-cluster.png "Open Databricks cluster")

2. Under the **Configuration** tab, click the **JDBC/ODBC** tab and copy the values for **Server Hostname** and **HTTP Path**. You need these values to complete the steps in this article.

    ![Get Databricks configuration](./media/connect-databricks-excel-python-r/get-databricks-jdbc-configuration.png "Get Databricks configuration")

3. On your computer, start **ODBC Data Sources** application (32-bit or 64-bit) depending on the application. To connect from Excel, you must use the 32-bit version. To connect from R and Python, you must use the 64-bit version.

    ![Launch ODBC](./media/connect-databricks-excel-python-r/launch-odbc-app.png "Launch ODBC app")

4. Under the **User DSN** tab, click **Add**. In the **Create New Data Source** dialog box, select the **Simba Spark ODBC Driver**, and then click **Finish**.

    ![Launch ODBC](./media/connect-databricks-excel-python-r/add-new-user-dsn.png "Launch ODBC app")

5. In the **Simba Spark ODBC Driver** dialog box, provide the following values:

    ![Configure DSN](./media/connect-databricks-excel-python-r/odbc-dsn-setup.png "Configure DSN")

    * **Data Source Name** - Provide a name for the data source.
    * **Host(s)** - Provide the value that you copied from the Databricks workspace for *Server hostname*.
    * **Port** - Enter *443*.
    * Under **Authentication**, for **Mechanism**, select *User name and password*.
    * For **User name**, enter *token*.
    * For **Password**, enter the token value that you copied from the Databricks workspace.
    * Click **HTTP Options**. In the dialog box that opens up, paste the value for *HTTP Path* that you copied from Databricks workspace. Click **OK**.
    * Click **SSL Options**. In the dialog box that opens up, select the **Enable SSL** check box. Click **OK**.
    * If you want, you can click **Test** to test the connection to Azure Databricks. Click **OK** to save the configuration.
    * In the **ODBC Data Source Administrator** dialog box, click **OK**.


## Connect from Microsoft Excel

In this section, you pull data from Azure Databricks into Microsoft Excel using the DSN you created earlier.

1. Open a blank workbook in Microsoft Excel. From the **Data** ribbon, click **Get Data**. Click **From Other Sources** and then click **From ODBC**.

    ![Launch ODBC from Excel](./media/connect-databricks-excel-python-r/launch-odbc-from-excel.png "Launch ODBC from Excel")

2. In the **From ODBC** dialog box, select the DSN that you created earlier and then click **OK**.

    ![Select DSN](./media/connect-databricks-excel-python-r/excel-select-dsn.png "Select DSN")

3. If you are prompted for credentials, for user name enter **token**. For password, provide the token value that you retrieved from the Databricks workspace.

4. From the navigator window, select the table in Databricks that you want to load to Excel, and then click **Load**. 

    ![Load dta into Excel](./media/connect-databricks-excel-python-r/excel-load-data.png "Load dta into Excel")

## Connect from R

In this section, you use an R language IDE (such as RStudio) to reference data available in Azure Databricks. Before you begin, you must have the following installed on the computer.

* RStudio for Desktop. You can install it from [here](https://www.rstudio.com/products/rstudio/download/).
* Microsoft R Client. You can install it from [http://aka.ms/rclient/](http://aka.ms/rclient/).

Open RStudio and perform the following steps:

1. To connect to Azure Databricks using the DSN you created earlier, you must use the `RODBC` package. Use the following command to reference the package:

       require(RODBC)

2. Establish a connection using the DSN you created earlier.

       conn <- odbcConnect("<ENTER DSN NAME HERE>")

3. Run a SQL query on the data in Azure Databricks using the connection you created. In the following snippet, *radio_sample_data* is a table that already exists in Azure Databricks.

       res <- sqlQuery(conn, "SELECT * FROM radio_sample_data")

4. You can now perform operations as shown in the following snippet:

       # print out the column names
       names(res) 
       
       # print out the number of rows
       nrow (res)

## Connect from Python

In this section, you use Python IDE (such as IDLE) to reference data available in Azure Databricks. Before you begin, you must complete the following prerequisites:

* Install Python from [here](https://www.python.org/downloads/). Installing Python from this link also installs IDLE.

* From a command prompt on the computer, install the `pyodbc` package. Run the following command:

      pip install pyodbc

Open IDLE and perform the following steps:

1. Run the following command to import the `pyodbc` package:

       import pyodbc

2. Establish a connection using the DSN you created earlier.

       conn = pyodbc.connect("DSN=<ENTER DSN NAME HERE>", autocommit = True)

3. Run a SQL query using the connection you created. In the following snippet, *radio_sample_data* is a table that already exists in Azure Databricks.

       cursor = conn.cursor()
       cursor.execute("SELECT * FROM radio_sample_data")

4. You can now print the rows retrieved by the query.

       for row in cursor.fetchall():
          print(row)


## See also

* [Data sources for Azure Databricks](https://docs.azuredatabricks.net/spark/latest/data-sources/index.html#)


