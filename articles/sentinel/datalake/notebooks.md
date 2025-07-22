---  
title: Running notebooks on the Microsoft Sentinel data lake (preview)
titleSuffix: Microsoft Security  
description: This article describes how to explore and interact wit data lake data using Jupyter notebooks in Visual Studio Code.
author: EdB-MSFT  
ms.author: edbaynash 
ms.topic: how-to  
ms.service: microsoft-sentinel
ms.subservice: sentinel-graph
ms.date: 07/16/2025
 

# Customer intent: As a security engineer or data scientist, I want to explore and analyze security data in the Microsoft Sentinel data lake using Jupyter notebooks, so that I can gain insights and build advanced analytics solutions.
---

# Run notebooks on the Microsoft Sentinel data lake (preview)
 
Jupyter notebooks provide an interactive environment for exploring, analyzing, and visualizing data in the Microsoft Sentinel data lake. With notebooks, you can write and execute code, document your workflow, and view results—all in one place. This makes it easy to perform data exploration, build advanced analytics solutions, and share insights with others. By leveraging Python and Apache Spark within Visual Studio Code, notebooks help you transform raw security data into actionable intelligence.

This article shows you how to explore and interact with data lake data using Jupyter notebooks in Visual Studio Code. 

> [!NOTE]  
> The Microsoft Sentinel extension is currently in preview. Some functionality and performance limits may change as new releases are made available.  
 
## Prerequisites

### Onboard to the Microsoft Sentinel data lake

To use notebooks in the Microsoft Sentinel data lake, you must first onboard to the data lake. If you haven't onboarded to the Microsoft Sentinel data lake, see [Onboarding to Microsoft Sentinel data lake](./sentinel-lake-onboarding.md). If you have recently onboarded to the data lake, it may take some time until sufficient volume of data is ingested before you can create meaningful analyses using notebooks.

### Permissions

Microsoft Entra ID roles provide broad access across all workspaces in the data lake. Alternatively you can grant access to individual workspaces using Azure RBAC roles. Users with Azure RBAC permissions to Microsoft Sentinel workspaces can run notebooks against those workspaces in the data lake tier. For more information, see [Roles and permissions in Microsoft Sentinel](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake-preview).

To create new custom tables in the analytics tier, the data lake managed identity must be assigned the **Log Analytics Contributor** role in the Log Analytics workspace.

To assign the role, follow the steps below:

1. In the Azure portal, navigate to the Log Analytics workspace that you want to assign the role to.
1. Select **Access control (IAM)** in the left navigation pane.
1. Select **Add role assignment**.
1. In the **Role** table, select **Log Analytics Contributor**, then select **Next**
1. Select **Managed identity**, then select **Select members**.
1. Your data lake managed identity is a system assigned managed identity named `msg-resources-<guid>`. Select the managed identity, then select **Select**. 
1. Select **Review and assign**.

For more information on assigning roles to managed identities, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

### Install Visual Studio Code and the Microsoft Sentinel extension

If you don't already have Visual Studio Code, download and install Visual Studio Code for [Mac](https://code.visualstudio.com/docs/?dv=osx), [Linux](https://code.visualstudio.com/docs/?dv=linux), or [Windows](https://code.visualstudio.com/docs/?dv=win).  

The Microsoft Sentinel extension for Visual Studio Code (VS Code) is installed from the extensions marketplace. To install the extension, follow these steps:

1. Select the Extensions Marketplace in the left toolbar.
1. Search for *Sentinel*.
1. Select the **Microsoft Sentinel** extension and select **Install**.
1. After the extension is installed,  the Microsoft Sentinel shield icon appears in the left toolbar.

  :::image type="content" source="./media/notebooks/install-Sentinel-extension.png" lightbox="./media/notebooks/install-sentinel-extension.png" alt-text="A screenshot showing the extension market place.":::  

Install the GitHub Copilot extension for Visual Studio Code to enable code completion and suggestions in notebooks. 

1. Search for *GitHub Copilot* in the Extensions Marketplace and install it.
1. After installation, sign in to GitHub Copilot using your GitHub account.
   
## Explore data lake tier tables

After installing the Microsoft Sentinel extension, you can start exploring data lake tier tables and creating Jupyter notebooks to analyze the data.

### Sign in to the Microsoft Sentinel extension
 
1. Select the Microsoft Sentinel shield icon in the left toolbar.

1. A dialog appears with the following text **The extension "Microsoft Sentinel" wants to sign in using Microsoft**. Select **Allow**.

   :::image type="content" source="./media/notebooks/sign-in.png" lightbox="./media/notebooks/sign-in.png" alt-text="A screenshot showing the sign in dialog."::: 

1. Select your account name to complete the sign in.
 
   :::image type="content" source="./media/notebooks/select-account.png" lightbox="./media/notebooks/select-account.png" alt-text="A screenshot showing the account selection list at the top of the page."::: 

### View data lake tables and jobs

Once you sign in, the Microsoft Sentinel extension displays a list of **Lake tables** and **Jobs** in the left pane. Select a table to see the column definitions.

For information on Jobs, see [Jobs and Scheduling](#jobs-and-scheduling).

:::image type="content" source="./media/notebooks/tables-and-jobs.png" lightbox="./media/notebooks/tables-and-jobs.png" alt-text="A screenshot showing the list of tables, jobs, and the selected table's metadata."::: 

## Create a new notebook
 
1. To create a new notebook, use one of the following methods.

  1. Enter *>* in the search box or press **Ctrl+Shift+P** and then enter *Create New Jupyter Notebook*.
  :::image type="content" source="./media/notebooks/create-new-notebook.png" lightbox="./media/notebooks/create-new-notebook.png" alt-text="A screenshot showing how to create a new notebook from the search bar.":::

  1. Select File > New File, then select **Jupyter Notebook** from the dropdown.  
  :::image type="content" source="./media/notebooks/new-file-notebook.png" lightbox="./media/notebooks/new-file-notebook.png" alt-text="A screenshot showing how to create a new notebook form the file menu.":::


1. In the new notebook, paste the following code into the first cell.

   ```python  
   from sentinel_lake.providers import MicrosoftSentinelProvider
   data_provider = MicrosoftSentinelProvider(spark)

   table_name = "EntraGroups"  
   df = data_provider.read_table(table_name)  
   df.select("displayName", "groupTypes", "mail", "mailNickname", "description", "tenantId").show(100,   truncate=False)  
   ```  

1. Select the **Run** triangle to execute the code in the notebook. The results are displayed in the output pane below the code cell.  
  :::image type="content" source="./media/notebooks/run-notebook.png" lightbox="./media/notebooks/run-notebook.png" alt-text="A screenshot showing how to run a notebook cell.":::

1. Select **Microsoft Sentinel** from the list for a list of runtime pools.
  :::image type="content" source="./media/notebooks/select-runtime.png" lightbox="./media/notebooks/select-runtime.png" alt-text="A screenshot showing the runtime picker.":::  

1. Select **Medium** to run the notebook in the medium sized runtime pool. For more information on the different runtimes, see [Selecting the appropriate Microsoft Sentinel runtime](#select-the-appropriate-runtime-pool).
  :::image type="content" source="./media/notebooks/select-kernel-size.png" lightbox="./media/notebooks/select-kernel-size.png" alt-text="A screenshot showing the run pool size picker.":::  


> [!NOTE]
> Selecting the kernel starts the Spark session and runs the code in the notebook. After selecting the pool, it can take 3-5 mins for the session to start. Subsequent runs a faster as the session is already active.

When the session is started, the code in the notebook runs and the results are displayed in the output pane below the code cell, for example:
    :::image type="content" source="media/notebooks/results.png" lightbox="media/notebooks/results.png" alt-text="A screenshot showing the results from running a notebook cell.":::


For sample notebooks that demonstrate how to interact with the Microsoft Sentinel data lake, see [Sample notebooks for Microsoft Sentinel data lake](./notebook-examples.md).

## Use GitHub Copilot in notebooks

Use GitHub Copilot to help you write code in notebooks. GitHub Copilot provides code suggestions and autocompletion based on the context of your code. To use GitHub Copilot, ensure that you have the [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) installed in Visual Studio Code.

Copy code from the [Sample notebooks for Microsoft Sentinel data lake](./notebook-examples.md) and save it in your notebooks folder to provide context for GitHub Copilot. GitHub Copilot will then be able to suggest code completions based on the context of your notebook.

The following example shows GitHub Copilot generating a code review.

:::image type="content" source="./media/notebooks/copilot.png" lightbox="./media/notebooks/copilot.png" alt-text="A screenshot showing GitHub Copilot generating a code review.":::



## Microsoft Sentinel Provider class

To connect to the Microsoft Sentinel data lake, use the `SentinelLakeProvider` class.
This class is part of the `access_module.data_loader` module and provides methods to interact with the data lake. To use this class, import it and create an instance of the class using a `spark` session.

```python
from sentinel_lake.providers import MicrosoftSentinelProvider
data_provider = MicrosoftSentinelProvider(spark)
```

For more information on the available methods, see [Microsoft Sentinel Provider class reference](./sentinel-provider-class-reference.md).

 
### Select the appropriate runtime pool 
 
There are three runtime pools available to run your Jupyter notebooks in the Microsoft Sentinel extension. Each pool is designed for different workloads and performance requirements. The choice of runtime pool affects the performance, cost, and execution time of your Spark jobs.  
 
| Runtime Pool | Recommended Use Cases |Characteristics |
|--------------|-----------------------|----------------|
| **Small**  | Development, testing, and lightweight exploratory analysis. <br>Small workloads with simple transformations. <br>Cost efficiency prioritized. | Suitable for small workloads <br> Simple transformations. <br>Lower cost, longer execution time.  |
| **Medium** | ETL jobs with joins, aggregations, and ML model training. <br>Moderate workloads with complex transformations. | Improved performance over Small. <br>Handles parallelism and moderate memory-intensive operations.  |
| **Large**  |  Deep learning and ML workloads. <br> Extensive data shuffling, large joins, or real-time processing.<br> Critical execution time. | High memory and compute power. <br>Minimal delays. <br> Best for large, complex, or time-sensitive workloads.  |

> [!NOTE]
> When first accessed, kernel options may take about 30 seconds to load.  
> After selecting a runtime pool, it can take 3–5 minutes for the session to start.  
 
## View Logs 
 
Logs can be viewed in the **Output** pane of Visual Studio Code.  

1. In the **Output** pane, select **Microsoft Sentinel** from the drop-down.  
1. Select **Debug** to include detailed log entries.  

:::image type="content" source="media/notebooks/output-pane.png" lightbox="media/notebooks/output-pane.png" alt-text="A screenshot showing the output pane.":::

   
## Jobs and scheduling

You can schedule jobs to run at specific times or intervals using the Microsoft Sentinel extension for Visual Studio Code. Jobs allow you to automate data processing tasks to summarize, transform, or analyze data in the Microsoft Sentinel data lake. Jobs are also used to process data and write results to custom tables in the data lake tier or analytics tier. For more information on creating and managing jobs, see [Create and manage Jupyter notebook jobs](./notebook-jobs.md).

[!INCLUDE [Considerations and limitations for notebooks](../includes/service-limits-notebooks.md)]

## Troubleshooting 

The following table lists common errors you may encounter when working with notebooks, their root causes and suggested actions to resolve them.

### Spark compute

| Error message| Display surface | Message description  | Root cause | Suggested action |
|-------------------|-----------------|----------------------|------------|------------------|
| **LIVY_JOB_TIMED_OUT: Livy session has failed. Session state: Dead. Error code: LIVY_JOB_TIMED_OUT. Job failed during run time with state=[dead]. Source: Unknown.**  | In-Line. | Session timed out or user stopped the session. | Session timed out or user stopped the session.  | Execute the cell again.  |
| **Not enough capacity is available. User requested for X vCores but only {number-of-cores} vCores are available.** | Output channel – “Window”. | Spark compute pool not available. | Compute pool hasn't started or is being used by other users or jobs. | Retry with a smaller pool, stop any active Notebooks locally, or stop any active Notebook Job Runs. |
| **Unable to access Spark Pool – 403 Forbidden.** | Output channel – “Window”. | Spark pools aren't displayed. | User doesn't have the required roles to run interactive notebook or schedule job. | Check if you have the required role for interactive notebooks or notebook jobs. |
| **Spark Pool – \<name\> – is being upgraded.** | Toast alert. | One of the Spark pools is Not available. | Spark pool is being upgraded to the latest version of Microsoft Sentinel Provider. | Wait for ~20-30 mins for the Pool to be available. |
| **An error occurred while calling z:org.apache.spark.api.python.PythonRDD.collectAndServe. : org.apache.spark.SparkException: Job aborted due to stage failure: Total size of serialized results (4.0 GB) is bigger than spark.driver.maxResultSize (4.0 GB)** | Inline. | Driver memory exceeded or executor failure. | Job ran out of driver memory, or one or more executors failed. | View job run logs or optimize your query. Avoid using toPandas() on large datasets. Consider setting `spark.conf.set("spark.sql.execution.arrow.pyspark.enabled", "true")` if needed. |
| **Failed to connect to the remote Jupyter Server 'https://api.securityplatform.microsoft.com/spark-notebook/interactive'. Verify the server is running and reachable.**|	Toast alert |	User stopped the session, and failed to connect to server. |	User stopped the session.	| Run the cell again to reconnect the session.|

### VS Code Runtime

| Error message | Display surface | Message description  | Root cause | Suggested action |
|-------------------|-----------------|----------------------|------------|------------------|
| **Kernel with id – k1 - has been disposed.** | Output channel – “Jupyter”. | Kernel not connected. | VS Code lost connection to the compute kernel. | Reselect the Spark pool and execute a cell. |
| **ModuleNotFoundError: No module named 'MicrosoftSentinelProvider'.** | Inline. | Module not found. | Missing import for example, Microsoft Sentinel Library library | Run the setup/init cell again. |
| **Cell In[{cell number}], line 1 if: ^ SyntaxError: invalid syntax.** | Inline. | Invalid syntax. | Python or PySpark syntax error. | Review code syntax; check for missing colons, parentheses, or quotes. |
| **NameError Traceback (most recent call last) Cell In[{cell number}], line 1 ----> 1 data_loader12 NameError: name 'data_loader' is not defined.** | Inline. | Unbound variable. | Variable used before assignment. | Ensure all required setup cells were run in order. |

### Interactive notebooks

| Error message | Display surface | Message description  | Root cause | Suggested action |
|-------------------|-----------------|----------------------|------------|------------------|
| **{"level": "ERROR", "run_id": "...", "message": "Error loading table {table-name}: No container of kind 'DeltaParquet' found for table '...\|{table-name}'."}.** | Inline. | The specified source table doesn't exist.  | One or more source tables don't exist in the given workspaces. The table may have been recently deleted from your workspace | Verify if source tables exist in the workspace. |
| **{"level": "ERROR", "run_id": "...", "message": "Database Name {table-name} doesnt exist."}.** | Inline. | The workspace or database name provided in the query is invalid or inaccessible.  | The referenced database doesn't exist. | Confirm the database name is correct. |
| **401 Unauthorized.** | Output channel – “Window”. | Gateway 401 error. | Gateway has a 1 hour timeout that was reached. | Run a cell again to establish a new connection. |

### Library

| Error message| Display surface | Message description  | Root cause | Suggested action |
|-------------------|-----------------|----------------------|------------|------------------|
| **403 Forbidden.** | Inline. | Access denied. | User doesn’t have permission to read/write/delete the specified table. | Verify user has the role required. |
| **TableOperationException: Error saving DataFrame to table {table-name}_SPRK: 'schema'.** | Inline. | Schema mismatch on write. | save_as_table() is writing data that doesn’t match the existing schema. | Check the dataframe schema and align it with the destination table. |
| **{"level": "ERROR", "run_id": "...", "message": "Error saving DataFrame to table {table-name}: Tables created in MSG database must have suffix '_SPRK'"}**. | Inline. | Missing suffix _SPRK for writing table to data lake. | save_as_table() is writing data to a table that requires _SPRK. | Add _SPRK as suffix for writing to a custom table in the data lake. |
| **{"level": "ERROR", "run_id": "...", "message": "Error saving DataFrame to table siva_test_0624_1: Tables created in LA database must have suffix '_SPRK_CL'"}**. | Inline. | Missing suffix _SPRK_CL for writing table to analytics tier | save_as_table() is writing data to a table that requires _SPRK_CL. | Add _SPRK_CL as suffix for writing to custom table in analytics tier. |
| **{"level": "ERROR", "run_id": "...", "message": "Error saving DataFrame to table EntraUsers: Tables created in MSG database must have suffix '_SPRK'"}**. | Inline. | Invalid write. | Attempted to write to system table, this action isn't permitted.  | Specify a custom table to write to. |
| **TypeError: DataProviderImpl.save_as_table() missing 1 required positional argument: 'table_name'.** | Inline. | Invalid notebook. | Incorrect arguments passed to a library method (for example, missing ‘mode’ in save_as_table). | Validate parameter names and values. Refer to method documentation. |

### Jobs

| Error message | Display surface | Message description  | Root cause | Suggested action |
|-------------------|-----------------|----------------------|------------|------------------|
| **Job Run status shows the Status as Failed.** | Inline. | Job Run failure. | The notebook is corrupted or contains unsupported syntax for scheduled execution. | Open the Notebook Run Snapshot and validate that all cells run sequentially without manual input. |




## Related content

- [Create and manage notebook jobs](./notebook-jobs.md)
- [Sample notebooks for Microsoft Sentinel data lake](./notebook-examples.md)
- [Microsoft Sentinel Provider class reference](./sentinel-provider-class-reference.md)
- [Microsoft Sentinel data lake overview](./sentinel-lake-overview.md)
- [Microsoft Sentinel data lake roles and permissions](../roles.md#roles-and-permissions-for-the-microsoft-sentinel-data-lake-preview).