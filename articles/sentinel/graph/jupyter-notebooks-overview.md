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

The Microsoft Sentinel extension with Jupyter notebooks provides a powerful environment for exploring and analyzing lake data with the following benefits:

- **Interactive data exploration**: Jupyter notebooks provide an interactive environment for exploring and analyzing data. You can run code snippets, visualize results, and document your findings all in one place.
- **Integration with Python libraries**: The Microsoft Sentinel extension includes a wide range of Python libraries, enabling you to use existing tools and frameworks for data analysis, machine learning, and visualization.
- **Powerful data analysis**: With the integration of Apache Spark, you can use the power of distributed computing to analyze large datasets efficiently. This allows you to perform complex transformations and aggregations on your security data.  
-	**Low-and-slow attacks**: Powerful way to analyze large scale, complex, interconnected data related to security events, alerts, and incidents, enabling detection of sophisticated threats and patterns, such as lateral movement or low-and-slow attacks, evading traditional rule-based systems. 
-	**AI and ML integration**: Integrate with AI and machine learning to enhance anomaly detection, threat prediction, and behavioral analysis, empowering security teams to build agents to automate their investigations. 
-	**Scalability**: Notebooks provide the scalability to process vast amounts of data cost efficiently and enable deep batch processing for uncovering trends, patterns, and anomalies. 
- **Visualization capabilities**: Jupyter notebooks support various visualization libraries, enabling you to create charts, graphs, and other visual representations of your data. This helps you gain insights and communicate findings effectively.
- **Collaboration and sharing**: Jupyter notebooks can be easily shared with colleagues, allowing for collaboration on data analysis projects. You can export notebooks in various formats, including HTML and PDF, for easy sharing and presentation.
- **Documentation and reproducibility**: Jupyter notebooks allow you to document your code, analysis, and findings in a single file. This makes it easier to reproduce results and share your work with others.  

## Exploration scenatios for notebooks

The following scenarios illustrate how Jupyter notebooks in the Microsoft Sentinel Lake can be used to enhance security operations:

| Scenario | Description |
|----------|-------------|
| User behavior from failed logins  | Establish a baseline of normal user behavior by analyzing patterns of failed login attempts. Investigate operations attempted before and after the failed logins to detect potential compromise or brute-force activity.                                                                                                                |
| Sensitive data paths                    | Identify users and devices that have access to sensitive data assets. Combine access logs with organizational context to assess risk exposure, map access paths, and prioritize areas for security review.                                                                                                                               |
| Anomaly threat analysis                 | Analyze threats by identifying deviations from established baselines—such as logins from unusual locations, devices, or times. Overlay user behavior with asset data to surface high-risk activity, including potential insider threats.                                                           |
| Risk-scoring prioritization             | Apply custom risk scoring models to security events in the data lake. Enrich events with contextual signals (e.g., asset criticality, user role) to quantify risk, assess blast radius, and prioritize incidents for investigation.                                                               |
| Exploratory analysis and visualization  | Perform exploratory data analysis across multiple log sources to reconstruct attack timelines, determine root causes, and build custom visualizations that help communicate findings to stakeholders.                                                                                              |

This article shows you how to explore and interact with lake data using Jupyter notebooks in Visual Studio Code. 

> [!NOTE]  
> The Microsoft Sentinel extension is currently in Public Preview. Some functionality and performance limits may change as new releases are made available.  
 
## Prerequisites

Before you can use the Microsoft Sentinel extension for Visual Studio Code, you must have the following prerequisites in place:
+ Visual Studio Code   
+ Microsoft Sentinel extension for Visual Studio Code 


   


## Jobs and Scheduling

You can schedule jobs to run at specific times or intervals using the Microsoft Sentinel extension for Visual Studio Code. Jobs allow you to automate data processing tasks to summarize, transform, or analyze data in the Microsoft Sentinel data lake. Jobs are also used to process data and write results to custom tables in the lake tier or analytics tier.  


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

- [Sample notebooks for Microsoft Sentinel data lake](./notebook-examples.md)
- [Microsoft Sentinel Provider class reference](./sentinel-provider-class-reference.md)
- [Microsoft Sentinel data lake overview](./sentinel-lake-overview.md)