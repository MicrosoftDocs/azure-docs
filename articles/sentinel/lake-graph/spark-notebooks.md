---  
title: Exploring and interacting with lake data using Spark Notebooks  
titleSuffix: Microsoft Security  
description: This article describes how to explore and interact with lake data using Spark notebooks in Visual Studio Code. You will learn how to install the Microsoft Security Sentinel extension, create and run Spark notebooks, and review sample code for interacting with security data in your modern data lake.  
author: yourname  
ms.topic: how-to  
ms.date: 01/15/2025  
ms.author: yourmsftid  
appliesTo:  
  - Sentinel extension in Visual Studio Code  
ms.collection: ms-security  
---  
 
# Using Jupyter notebooks and the Microsoft Sentinel data lake  
 
## Overview  

Microsoft Sentinel Lake is a next-generation, cloud-native security data lake that extends the capabilities of Microsoft Sentinel by providing a highly scalable, cost-effective platform for long-term storage and data retention, advanced analytics, and AI-driven security operations.

Jupyter notebooks are an integral part of the Microsoft Sentinel data lake ecosystem, offering powerful tools for data analysis and visualization. The notebooks are provided by a Visual Studio Code extension that allows you to interact with the data lake using Python and Apache Spark. This enables you to perform complex data transformations, run machine learning models, and create visualizations directly within the notebook environment.

The Microsoft Sentinel extension with Jupyter notebooks provides a powerful environment for exploring and analyzing lake data with the following benefits:

- **Interactive data exploration**: Jupyter notebooks provide an interactive environment for exploring and analyzing data. You can run code snippets, visualize results, and document your findings all in one place.
- **Integration with Python libraries**: The Microsoft Sentinel extension includes a wide range of Python libraries, enabling you to leverage existing tools and frameworks for data analysis, machine learning, and visualization.
- **Powerful data analysis**: With the integration of Apache Spark, you can leverage the power of distributed computing to analyze large datasets efficiently. This allows you to perform complex transformations and aggregations on your security data.  
- **Visualization capabilities**: Jupyter notebooks support various visualization libraries, enabling you to create charts, graphs, and other visual representations of your data. This helps you gain insights and communicate findings effectively.
- **Collaboration and sharing**: Jupyter notebooks can be easily shared with colleagues, allowing for collaboration on data analysis projects. You can export notebooks in various formats, including HTML and PDF, for easy sharing and presentation.
- **Documentation and reproducibility**: Jupyter notebooks allow you to document your code, analysis, and findings in a single file. This makes it easier to reproduce results and share your work with others.  





This article shows you how to explore and interact with lake data using Jupyter notebooks in Visual Studio Code. The Microsoft Sentinel extension for Visual Studio Code (VSCode) provides a powerful environment for exploring and analyzing the lake data using Jupyter notebooks and Python. The extension allows you to run interactive queries, visualize data, and gain insights from your security data stored in the data lake with the flexibility and power of Python libraries. 
> [!NOTE]  
> The Microsoft Sentinel extension is currently in Public Preview. Some functionality and performance limits may change as new releases are made available.  
 
## Onboarding to the Microsoft Sentinel data lake

If you have not already onboaded to the Microsoft Sentinel data lake, see [Onboarding to Microsoft Sentinel data lake](./sentinel-lake-onboarding.md). If you have recently onboarded to the data lake, it may take some time until you have ingested a sufficient volume of data before you can create meaningful analyses using notebooks.

## Permissions and Roles

You can query data in the data lake based on your roles and permissions.
 
To run interactive notebook queries, you need one of the following roles:

+	Global reader 
+	Security reader
+	Security operator 
+	Security administrator
+	Global administrator

To schedule a job, you need one of the following roles:

+	Security operator 
+	Security administrator
+	Global administrator


## Install Visual Studio Code  
  
- Visual Studio Code for Desktop. Download and install VS Code for [Mac](https://code.visualstudio.com/docs/?dv=osx), [Linux](https://code.visualstudio.com/docs/?dv=linux), or [Windows](https://code.visualstudio.com/docs/?dv=win).



 
##  Microsoft Sentinel extension for Visual Studio Code  
 
The Sentinel extension for Visual Studio Code (VSCode) is installed from the extensions marketplace in VS Code. To install the extension, follow these steps:

1. Select the Extensions Marketplace in the left toolbar
1. Search for *Sentinel*
1. Select the **Microsoft Sentinel** extension and select **Install**

  :::image type="content" source="./media/spark-notebooks/install-Sentinel-extension.png" lightbox="./media/spark-notebooks/install-sentinel-extension.png" alt-text="A screenshot showing the extension market place.":::  

 
## Activate and sign in to the Sentinel extension
 
1. In Visual Studio Code, select the shield icon in the left navigation to activate the Sentinel extension.  
1. Select **Accounts & Tenants**, then select **Sign in to Microsoft Security**.  
1. Authenticate using your Sentinel credentials.

 
## Explore lake-tier tables
 
After signing in, start exploring your lake data and create Spark notebooks to analyze the data.  
 
1. Under **Accounts & Tenants**, select the tenant associated with your account.
1. Select the **Raw Tables** dropdown to view lake tier tables.  
1. To explore a table’s metadata, select a table name.  

:::image type="content" source="./media/spark-notebooks/show-raw-tables.png" lightbox="./media/spark-notebooks/show-raw-tables.png" alt-text="A screenshot showing a list of raw tables and one table's metadata."::: 

## Create a new notebook
 
1. To create a new notebook, use one of the following methods

  1. Enter *>* in the search box or press **Ctrl+Shift+P** and then enter *Create New Jupyter Notebook*  
  :::image type="content" source="./media/spark-notebooks/create-new-notebook.png" lightbox="./media/spark-notebooks/create-new-notebook.png" alt-text="A screenshot showing how to create a new notebook from the search bar.":::

  1. Select File > New File, then select **Jupyter Notebook** from the dropdown.  
  :::image type="content" source="./media/spark-notebooks/create-new-notebook.png" lightbox="./media/spark-notebooks/create-new-notebook.png"alt-text="A screenshot showing how to create a new notebook form the file menu.":::


1. In the new notebook, paste the following your code into the first cell.
>>>>>>from access_module.data_loader import SecurityLakeDataLoader # contains the functions to load and save data from Security Lake
  ```python  
  from access_module.data_loader import SecurityLakeDataLoader  
  data_loader = SecurityLakeDataLoader(spark)  
 
  table_name = "microsoft.entra.id.group"  
  df = data_loader.load_table(table_name)  
  df.select("displayName", "groupTypes", "mail", "mailNickname", "description", "tenantId").show(100, truncate=False)  
 ```  

1. Select **Select Kernel** at the top right of the notebook.  
  :::image type="content" source="./media/spark-notebooks/select-kernel.png" alt-text="{alt-text}":::
 
1. Select **MSG Runtime** from the list.


  :::image type="content" source="./media/spark-notebooks/select-msg-runtime.png" alt-text="{alt-text}":::  

1. Select **Microsoft Sentinel Medium** to run the notebook in the medium sized runtime pool. For more information on the different runtimes, see [Selecting the appropriate MSG runtime](#selecting-the-appropriate-msg-runtime).
  :::image type="content" source="./media/spark-notebooks/select-kernel-size.png" alt-text="{alt-text}":::  

1. Select the **Run** triagle button to execute the code in the notebook. The results are displayed in the output pane below the code cell.  
  :::image type="content" source="./media/spark-notebooks/run-notebook.png" alt-text="{alt-text}":::

> [!NOTE]
> Selecting the kernel starts the Spark session and runs the code in the notebook. After selecting the pool, it can take 3-5 mins for the session to start. Subsequent runs will be faster as the session is already active.


## Microsoft Sentinel Provider class 

To connect to the Microsoft Sentinel data lake,  use the `SentinelLakeProvider` class.
This class is part of the `access_module.data_loader` module and provides methods to interact with the data lake. To use this class, you need to import it and create an instance of the class using the `spark` session.

```python
from access_module.data_loader import SentinelLakeProvider
lake_provider = SentinelLakeProvider(spark)    
```

The `SentinelLakeProvider` class provides methods to interact with the data lake, including listing databases, reading tables, and saving data. Below is a summary of the available methods:

| Method | Arguments | Type | Return | Example |
|--------|-----------|------|--------|---------|
| `list_databases` <p>List all available databases / Sentinel workspaces | none | None | list[str] | `SentinelLakeProvider.list_databases()` |
| `list_tables` <p>List all tables in a given database | `database`<br><br>`id` (optional) | str<br><br> str | list[str] | 1. List lake tables:<br>`SentinelLakeProvider.list_tables("workspace1")`<br><br>2. If your workspace names are not unique, use the table GUID:<br>`SentinelLakeProvider.list_tables("workspace1", id="ab1111112222ab333333")` |
| `read_table` <p>Load a DataFrame from a table in Lake | `table_name`<br><br>`database`<br><br>`id` (optional) | str<br><br> str<br><br>str | DataFrame | 1. Native tables, custom tables:<br>`SentinelLakeProvider.read_table("user", "default")`<br><br>2. Aux tables:<br>`SentinelLakeProvider.read_table("SignInLogs", "workspace1")`<br><br>3.  If your workspace names are not unique, use the table GUID:<br>`SentinelLakeProvider.read_table("SignInLogs", "workspace1", id="ab1111112222ab333333")` |
| `save_as_table` <p>Write a DataFrame as a managed table | `DataFrame`<br><br>`table_name`<br><br>`database: `<br><br>`id` (optional)<br><br>`WriteOptions {mode: Append, Overwrite}` (optional) | DataFrame<br><br>str<br><br>str<br><br>str<br><br>dict| str (runId) | 1. Create new custom table:<br>`SentinelLakeProvider.save_as_table(dataframe, "CustomTable1_SPRK", "msgworkspace1")`<br><br>`SentinelLakeProvider.save_as_table(dataframe, "CustomTable1_CL", "workspace1")`<br><br>2. Append/Overwrite to existing custom table:<br>`SentinelLakeProvider.save_as_table(dataframe, "CustomTable1_CL", "workspace1", mode="Append")`<br><br>3. If your workspace names are not unique, use GUID:<br>`SentinelLakeProvider.save_as_table(dataframe, "CustomTable1_CL", "workspace1", id="ab1111112222ab333333", mode="Append")` |
| `delete_table` <p>Deletes the table from the schema | `table_name`<br><br>`database`<br><br>`id` (optional) | str<br><br>str<br><br>str| dict | 1. Delete a custom table:<br>`SentinelLakeProvider.delete_table("customtable_SPRK", "msgworkspace")`<br><br>2.  If your workspace names are not unique, use the table  GUID:<br>`SentinelLakeProvider.delete_table("SignInLogs", "workspace1", id="ab1111112222ab333333")` |
| `get_status` <p>Check status of a save/write to table | `run_id`<br><br>`plan: lake/analytics` | str<br><br>str | dict (run_id, status, message_col) | 1. Get write status for lake table:<br>`SentinelLakeProvider.get_status("123456", plan="lake")`<br><br>2. Get write status for analytics table:<br>`SentinelLakeProvider.get_status("123456", plan="analytics")` |
| `get_metadata` <p>Retrieve metadata about a table | `table_name`, `schema` | str<br><br> str | dict | |


 
### Selecting the appropriate runtime pool 
 
You have three runtime pools available to run your Spark notebooks in the Microsoft Sentinel extension. Each pool is designed for different workloads and performance requirements. The choice of runtime pool affects the performance, cost, and execution time of your Spark jobs.  
 
| Runtime Pool | Recommended Use Cases |Characteristics |
|--------------|-----------------------|----------------|
| **Microsoft Sentinel Small**  | - Development, testing, and lightweight exploratory analysis<br>- Small workloads with simple transformations<br>- Cost efficiency prioritized | - Suitable for small workloads<br>- Simple transformations<br>- Lower cost, longer execution time               |
| **Microsoft Sentinel Medium** | - ETL jobs with joins, aggregations, and ML model training<br>- Moderate workloads with complex transformations | - Improved performance over Small<br>- Handles parallelism and moderate memory-intensive operations             |
| **Microsoft Sentinel Large**  | - Deep learning and ML workloads<br>- Extensive data shuffling, large joins, or real-time processing<br>- Critical execution time | - High memory and compute power<br>- Minimal delays<br>- Best for large, complex, or time-sensitive workloads   |

> [!NOTE]
> For the first time, kernel options may take about 30 seconds to load.  
> After selecting a runtime pool, it can take 3–5 minutes for the session to start.  
 
## Viewing Logs and Job Results  
 
- Logs can be viewed in the **Output** pane of Visual Studio Code.  
- In the **Output** pane, select **Fabric Data Engineering – Remote** from the drop down.  
- Select **Debug** to include detailed log entries.  
- The results of your Spark job executions appear in the notebook output.  
  Note: After the first execution, subsequent runs may execute faster depending on input datasets and query conditions.  



 
## Sample Notebook Code Examples  
 
Below are some sample code snippets that demonstrate how to interact with lake data using Spark notebooks.  
 
### Access Lake Tier Entra ID Group Table  

The following code sample demonstrates how to access the Entra ID `Group` table in the Microsoft Sentinel data lake. It retrieves various fields such as displayName, groupTypes, mail, mailNickname, description, and tenantId. 

```python  
from sentinel_lake.providers import MicrosoftSentinelProvider
data_provider = MicrosoftSentinelProvider(spark)
 
table_name = "microsoft.entra.id.group"  
df = data_provider.read_table(table_name)  
df.select("displayName", "groupTypes", "mail", "mailNickname", "description", "tenantId").show(100, truncate=False)   
```  
The following screenshot shows a sample of the output of the code above, displaying the Entra ID group information in a dataframe format.

:::image type="content" source="media/spark-notebooks/sample-1-output.png" alt-text="A screenshot showing sample output for the first code example.":::

### Access Entra ID SignInLogs for a Specific User  
The following code sample demonstrates how to access the Entra ID `SignInLogs` table and filter the results for a specific user. It retrieves various fields such as UserDisplayName, UserPrincipalName, UserId, and more.

```python  
from sentinel_lake.providers import MicrosoftSentinelProvider
data_provider = MicrosoftSentinelProvider(spark)
 
table_name = "microsoft.entra.id.SignInLogs"  
df = data_provider.read_table(table_name)  
df.select("UserDisplayName", "UserPrincipalName", "UserId", "CorrelationId", "UserType", 
 "ResourceTenantId", "RiskLevel", "ResourceProvider", "IPAddress", "AppId", "AADTenantId")\
    .filter(df.UserPrincipalName == "benploni@contoso.com")\
    .show(100, truncate=False) 
```  
 
### Examine SignIn Locations  

The following code sample demonstrates how to extract and display sign-in locations from the Entra ID SignInLogs table. It uses the `from_json` function to parse the JSON structure of the `LocationDetails` field, allowing you to access specific location attributes such as city, state, and country or region.

```python  
from sentinel_lake.providers import MicrosoftSentinelProvider
from pyspark.sql.functions import from_json, col  
from pyspark.sql.types import StructType, StructField, StringType  
 
data_provider = MicrosoftSentinelProvider(spark)  
table_name = "microsoft.entra.id.signinlogs"  
df = data_provider.read_table(table_name)  
 
location_schema = StructType([  
  StructField("city", StringType(), True),  
  StructField("state", StringType(), True),  
  StructField("countryOrRegion", StringType(), True)  
])  
 
# Extract location details from JSON  
df = df.withColumn("LocationDetails", from_json(col("LocationDetails"), location_schema))  
df = df.select("UserPrincipalName", "CreatedDateTime", "IPAddress", 
 "LocationDetails.city", "LocationDetails.state", "LocationDetails.countryOrRegion")  
 
sign_in_locations_df = df.orderBy("CreatedDateTime", ascending=False)  
sign_in_locations_df.show(100, truncate=False) 
```  
 
## Usage Limits  
 
Microsoft Sentinel Graph leverages ingest, storage, and compute resources to deliver core data lake capabilities, build graph experiences, and power agentic AI scenarios. During this preview, these resources may be limited and some operations may cease once limits are reached. Most limits are applied within a rolling 30‑day window. If you hit these limits, please contact your Microsoft representative to discuss options.  
 
Specific limits include:  
 
- Ingest volume: 100 TB  
- Spark jobs & Notebook execution: 200 vcore‑hours  
- ADX queries: 200 vcore‑hours  
 - Graph queries: 400 vcore‑hours 
 
## Troubleshooting 

The following table lists common errors you may encounter when working with notebooks in the Microsoft Sentinel extension for Visual Studio Code, along with their root causes and suggested actions to resolve them.

| Component | Error Message | Root Cause | Suggested Action |
|-------|---------------|------------|------------------|
| Spark compute | Spark compute session timeout | Spark session has been idle for too long and auto-terminated | Restart the session and rerun the cell |
|  Spark compute  | LIVY_JOB_TIMED_OUT: Livy session has failed. Session state: Dead. Error code: LIVY_JOB_TIMED_OUT. Job failed during run time with state=[dead]. Source: Unknown. | Session timed out or user stopped the session | Run the cell again. |
| Spark compute | Spark compute pool not available | Compute pool is not started or is being used by other users or jobs | Start the pool if stopped |
| Spark compute | Spark pools are not displayed | User does not have the required roles to run interactive notebook or schedule job | Check if you have required role for interactive notebook or notebook job |
| Spark compute | Driver memory exceeded or executor failure | Job ran out of drive memory, or one or more executors failed | View job run logs or optimize your query |
| VS Code Runtime | Kernel not connected | VS Code lost connection to the compute kernel | Reconnect or restart the kernel via the VS Code UI |
| VS Code Runtime | Module not found | Missing import (e.g., Microsoft Sentinel Library library) | Run the setup/init cell again |
| VS Code Runtime | Invalid syntax | Python or PySpark syntax error | Review code syntax; check for missing colons, parentheses, or quotes |
| VS Code Runtime | Unbound variable | Variable used before assignment | Ensure all required setup cells have been run in order |
| Interactive notebook | The specified source table does not exist. | One or more source tables do not exist in the given workspaces or were recently deleted from your workspace. | Verify if source tables exist in the workspace. |
| Interactive notebook | The workspace or database name provided in the query is invalid or inaccessible. | The referenced database does not exist | Confirm the database name is correct |
|   | Gateway 401 error | Gateway has a 1 hour timeout that was reached |   |
| Library | Table not found | Incorrect table name or database name used | Verify table name used is correct |
| Library | Access denied | User doesn’t have permission to read/write/delete the specified table | Verify user has the role required |
| Library | Schema mismatch on write | save_as_table() is writing data that doesn’t match the existing schema | Check the dataframe schema and align it with the destination table. |
| Library | Missing suffix _SPRK for writing table to lake | save_as_table() is writing data to a table that requires _SPRK | Add _SPRK as suffix for writing to custom table in Lake |
| Library | Missing suffix _SPRK_CL for writing table to analytics tier | save_as_table() is writing data to a table that requires _SPRK_CL | Add _SPRK as suffix for writing to custom table in analytics tier |
| Library | Invalid write | Attempted to write to system table, this action is not permitted. | Specify a custom table to write to |
| Library | Invalid notebook | Incorrect arguments passed to a library method (e.g., missing ‘mode’ in save_as_table) | Validate parameter names and values. Refer to method documentation or use auto-complete in VS Code |
| Job | Job quota exceeded | The notebook is corrupted or contains unsupported syntax for scheduled execution | Open the notebook and validate that all cells run sequentially without manual input. |
| Job | Job quota exceeded | User or workspace has hit the limit for concurrent or scheduled jobs | Reduce the number of active jobs, or wait for some to finish. |
| Job | Expired credentials | The user’s token or session used for scheduling is no longer valid | Re-authenticate before scheduling the job. |



## Related content  
 
- [Create and run Jupyter Notebooks in Visual Studio Code](https://code.visualstudio.com/docs/datascience/jupyter-notebooks)  
- [Introduction to Apache Spark](https://spark.apache.org/docs/latest/)  
- [Getting started with the Microsoft Security Sentinel extension](#)  
 
Feel free to explore these resources to enhance your development experience with lake data and Spark notebooks.  