---  
title: Exploring and interacting with lake data using Jupyter Notebooks (Preview)
titleSuffix: Microsoft Security  
description: This article describes how to explore and interact with lake data using Spark notebooks in Visual Studio Code.
author: EdB-MSFT  
ms.topic: how-to  
ms.date: 06/04/2025
ms.author: edbayansh  

# Customer intent: As a security engineer or data scientist, I want to explore and analyze security data in the Microsoft Sentinel data lake using Jupyter notebooks, so that I can gain insights and build advanced analytics solutions.
---

# Jupyter notebooks and the Microsoft Sentinel data lake (Preview)
 
## Overview  

Microsoft Sentinel data lake is a next-generation, cloud-native security data lake that extends the capabilities of Microsoft Sentinel by providing a highly scalable, cost-effective platform for long-term storage and data retention, advanced analytics, and AI-driven security operations.

Jupyter notebooks are an integral part of the Microsoft Sentinel data lake ecosystem, offering powerful tools for data analysis and visualization. The notebooks are provided by a Visual Studio Code extension that allows you to interact with the data lake using Python and Apache Spark. Notebooks enable you to perform complex data transformations, run machine learning models, and create visualizations directly within the notebook environment. 



This article shows you how to explore and interact with lake data using Jupyter notebooks in Visual Studio Code. 

> [!NOTE]  
> The Microsoft Sentinel extension is currently in Public Preview. Some functionality and performance limits may change as new releases are made available.  
 
## Prerequisites

Before you can use the Microsoft Sentinel extension for Visual Studio Code, you must have the following prerequisites in place:
+ Visual Studio Code   
+ Microsoft Sentinel extension for Visual Studio Code 
+ GitHub co-pilot extension for Visual Studio Code.

### Permissions

[!INCLUDE[sentinel-data-lake-read-permissions](../includes/sentinel-data-lake-read-permissions.md)]

[!INCLUDE[sentinel-data-lake-write-permissions](../includes/sentinel-data-lake-notebook-write-permissions.md)]

[!INCLUDE[sentinel-data-lake-job-permissions](../includes/sentinel-data-lake-job-permissions.md)]


For more information on roles and permissions, see [Microsoft Sentinel lake roles and permissions](./roles-permissions.md).

### Install Visual Studio Code  
  
- Visual Studio Code for Desktop. Download and install VS Code for [Mac](https://code.visualstudio.com/docs/?dv=osx), [Linux](https://code.visualstudio.com/docs/?dv=linux), or [Windows](https://code.visualstudio.com/docs/?dv=win).

 
###  Microsoft Sentinel extension for Visual Studio Code  
 
The Microsoft Sentinel extension for Visual Studio Code (VS Code) is installed from the extensions marketplace in VS Code. To install the extension, follow these steps:

1. Select the Extensions Marketplace in the left toolbar
1. Search for *Sentinel*
1. Select the **Microsoft Sentinel** extension and select **Install**

  :::image type="content" source="./media/spark-notebooks/install-Sentinel-extension.png" lightbox="./media/spark-notebooks/install-sentinel-extension.png" alt-text="A screenshot showing the extension market place.":::  

### Onboarding to the Microsoft Sentinel data lake

If you have not already onboarded to the Microsoft Sentinel data lake, see [Onboarding to Microsoft Sentinel data lake](./sentinel-lake-onboarding.md). If you have recently onboarded to the data lake, it may take some time until you have ingested a sufficient volume of data before you can create meaningful analyses using notebooks.
 
 
## Explore lake-tier tables

After installing the Microsoft Sentinel extension, you can start exploring lake-tier tables and creating Jupyter notebooks to analyze the data.

### Sign in to the Microsoft Sentinel extension
 
1. Select the Microsoft Sentinel shield icon in the left toolbar.
1. A dialog appears with the following text **The extension "Microsoft Sentinel" wants to sign in using Microsoft**. Select **Allow**.

:::image type="content" source="./media/spark-notebooks/sign-in.png" lightbox="./media/spark-notebooks/sign-in.png" alt-text="A screenshot showing the sign in dialog."::: 

1. Select your account name to complete the sign in.
 
:::image type="content" source="./media/spark-notebooks/select-account.png" lightbox="./media/spark-notebooks/select-account.png" alt-text="A screenshot showing the account selection list at the top of the page."::: 

### View lake tables and jobs

Once you have signed in, the Microsoft Sentinel extension displays a list of **Lake tables** and **Jobs** in the left pane. Select a table to see the column definitions.

For information on Jobs, see [Jobs and Scheduling](#jobs-and-scheduling).

:::image type="content" source="./media/spark-notebooks/tables-and-jobs.png" lightbox="./media/spark-notebooks/tables-and-jobs.png" alt-text="A screenshot showing the list of tables, jobs, and the selected table's metadata."::: 

## Create a new notebook
 
1. To create a new notebook, use one of the following methods

  1. Enter *>* in the search box or press **Ctrl+Shift+P** and then enter *Create New Jupyter Notebook*  
  :::image type="content" source="./media/spark-notebooks/create-new-notebook.png" lightbox="./media/spark-notebooks/create-new-notebook.png" alt-text="A screenshot showing how to create a new notebook from the search bar.":::

  1. Select File > New File, then select **Jupyter Notebook** from the dropdown.  
  :::image type="content" source="./media/spark-notebooks/new-file-notebook.png" lightbox="./media/spark-notebooks/new-file-notebook.png" alt-text="A screenshot showing how to create a new notebook form the file menu.":::


1. In the new notebook, paste the following code into the first cell.

   ```python  
   from sentinel_lake.providers import MicrosoftSentinelProvider
   data_provider = MicrosoftSentinelProvider(spark)

   table_name = "microsoft.entra.id.group"  
   df = data_provider.read_table(table_name)  
   df.select("displayName", "groupTypes", "mail", "mailNickname", "description", "tenantId").show(100,   truncate=False)  
   ```  

1. Select the **Run** triangle to execute the code in the notebook. The results are displayed in the output pane below the code cell.  
  :::image type="content" source="./media/spark-notebooks/run-notebook.png" lightbox="./media/spark-notebooks/run-notebook.png" alt-text="A screenshot showing how to run a notebook cell.":::

1. Select **MSG Runtime** from the list for a list of runtime pools.
  :::image type="content" source="./media/spark-notebooks/select-msg-runtime.png" lightbox="./media/spark-notebooks/select-msg-runtime.png" alt-text="A screenshot showing the runtime picker.":::  

1. Select **Microsoft Sentinel Medium** to run the notebook in the medium sized runtime pool. For more information on the different runtimes, see [Selecting the appropriate MSG runtime](#selecting-the-appropriate-runtime-pool).
  :::image type="content" source="./media/spark-notebooks/select-kernel-size.png" lightbox="./media/spark-notebooks/select-kernel-size.png" alt-text="A screenshot showing the run pool size picker.":::  


> [!NOTE]
> Selecting the kernel starts the Spark session and runs the code in the notebook. After selecting the pool, it can take 3-5 mins for the session to start. Subsequent runs a faster as the session is already active.

When the session is started, the code in the notebook runs and the results are displayed in the output pane below the code cell, for example:
    :::image type="content" source="media/spark-notebooks/results.png" lightbox="media/spark-notebooks/results.png" alt-text="A screenshot showing the results from running a notebook cell.":::


For sample notebooks that demonstrate how to interact with the Microsoft Sentinel data lake, see [Sample notebooks for Microsoft Sentinel data lake](./notebook-examples.md).


## Microsoft Sentinel Provider class 

To connect to the Microsoft Sentinel data lake,  use the `SentinelLakeProvider` class.
This class is part of the `access_module.data_loader` module and provides methods to interact with the data lake. To use this class, import it and create an instance of the class using a `spark` session.

```python
from sentinel_lake.providers import MicrosoftSentinelProvider
data_provider = MicrosoftSentinelProvider(spark)
```

For more information on the available methods, see [Microsoft Sentinel Provider class reference](./sentinel-provider-class-reference.md).

 
### Selecting the appropriate runtime pool 
 
There are three runtime pools available to run your Jupyter notebooks in the Microsoft Sentinel extension. Each pool is designed for different workloads and performance requirements. The choice of runtime pool affects the performance, cost, and execution time of your Spark jobs.  
 
| Runtime Pool | Recommended Use Cases |Characteristics |
|--------------|-----------------------|----------------|
| **Microsoft Sentinel Small**  | Development, testing, and lightweight exploratory analysis <br>Small workloads with simple transformations <br>Cost efficiency prioritized | Suitable for small workloads <br> Simple transformations <br>Lower cost, longer execution time               |
| **Microsoft Sentinel Medium** | ETL jobs with joins, aggregations, and ML model training <br>Moderate workloads with complex transformations | Improved performance over Small <br>Handles parallelism and moderate memory-intensive operations             |
| **Microsoft Sentinel Large**  |  Deep learning and ML workloads<br> Extensive data shuffling, large joins, or real-time processing<br> Critical execution time | High memory and compute power <br>Minimal delays <br> Best for large, complex, or time-sensitive workloads   |

> [!NOTE]
> When first accessed, kernel options may take about 30 seconds to load.  
> After selecting a runtime pool, it can take 3–5 minutes for the session to start.  
 
## Viewing Logs 
 
Logs can be viewed in the **Output** pane of Visual Studio Code.  

1. In the **Output** pane, select **Microsoft Sentinel** from the drop-down.  
1. Select **Debug** to include detailed log entries.  

:::image type="content" source="media/spark-notebooks/output-pane.png" lightbox="media/spark-notebooks/output-pane.png" alt-text="A screenshot showing the output pane.":::

   
## Jobs and Scheduling

You can schedule jobs to run at specific times or intervals using the Microsoft Sentinel extension for Visual Studio Code. Jobs allow you to automate data processing tasks to summarize, transform, or analyze data in the Microsoft Sentinel data lake. Jobs are also used to process data and write results to custom tables in the lake tier or analytics tier.  For more information on creating and managing jobs, see [Create and manage Jupyter notebook jobs](./jupyter-notebook-jobs.md).


## Limitations 
 
+ Spark session takes about 5-6 minutes to start. You can view the status of the session at the bottom of your VS Code Notebook.
+ Only [Azure Synapse libraries](https://github.com/microsoft/synapse-spark-runtime/blob/main/Synapse/spark3.4/Official-Spark3.4-Rel-2025-04-16.0-rc.1.md) and the Microsoft Sentinel Provider library for abstracted functions are supported for querying lake. Pip installs or custom libraries aren't supported.


| Feature | Limitation | value |
|---------|-------------|-------|
|Interactive queries| Spark session inactivity timeout| 20 minutes|
|Interactive queries| interactive query timeout | 2 hours |
|Interactive queries| Gateway web socket timeout | 2 hours |
|Interactive queries| Maximum rows displayed| 10,000 rows |
|Jobs  | Job timeout| X hours <<<<<<>>>>>> |
| Compute resources| vCores are allocated per customer account|  1000|
| Compute resources| Maximum vCores allocated to interactive sessions | 760 vCores |
| Compute resources| Maximum vCores allocated to jobs | 240 vCores|
| Compute resources| Max concurrent users in interactive sessions| 10 users|
| Compute resources| Max concurrent running jobs| 3 jobs. The fourth and subsequent jobs are queued.|


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
| Library | Invalid notebook | Incorrect arguments passed to a library method (for example, missing ‘mode’ in save_as_table) | Validate parameter names and values. Refer to method documentation or use autocomplete in VS Code |
| Job | Job quota exceeded | The notebook is corrupted or contains unsupported syntax for scheduled execution | Open the notebook and validate that all cells run sequentially without manual input. |
| Job | Job quota exceeded | User or workspace has hit the limit for concurrent or scheduled jobs | Reduce the number of active jobs, or wait for some to finish. |
| Job | Expired credentials | The user’s token or session used for scheduling is no longer valid | Reauthenticate before scheduling the job. |


## Related content

- [Create and manage Jupyter notebook jobs](./jupyter-notebook-jobs.md)
- [Sample notebooks for Microsoft Sentinel data lake](./notebook-examples.md)
- [Microsoft Sentinel Provider class reference](./sentinel-provider-class-reference.md)
- [Microsoft Sentinel data lake overview](./sentinel-lake-overview.md)