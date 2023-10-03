---
title: Azure HDInsight configuration settings reference
description: Introduce the configuration of Azure HDInsight extension.
ms.service: hdinsight
ms.topic: how-to
ms.date: 09/19/2023
ms.custom:
---

# Azure HDInsight configuration settings reference

The Spark & Hive tools Extension for Visual Studio Code is highly configurable. This page describes the key settings you can work with.  

For general information about working with settings in VS Code, refer to [User and workspace settings](https://code.visualstudio.com/docs/getstarted/settings), and the [Variables reference](https://code.visualstudio.com/docs/editor/variables-reference) for information about predefined variable support.

## Open the Azure HDInsight configuration

1. Open a folder first to create workspace settings.
2. Press **Ctrl + Shift + P**, or navigate to **View** -> **Command  Palette...** to show all commands.
3. Search **Set Configuration**.
4. Expand **Extensions** in the left directory, and select **HDInsight configuration**.

 ![hdi config image](./media/HDInsight-config-for-vscode/HDInsight-config-for-vscode.png)

## General settings   

|  Property   | Default | Description   |
| ----- | ----- |----- |
| HDInsight: Azure Environment | Azure | Azure environment |
| HDInsight: Disable Open Survey Link | Checked | Enable/Disable opening HDInsight survey |
| HDInsight: Enable Skip Pyspark Installation | Unchecked | Enable/Disable skipping pyspark installation |
| HDInsight: Login Tips Enable | Unchecked | When this option is checked, there is a prompt when logging in to Azure |
| HDInsight: Previous Extension Version | Display the version number of the current extension | Show the previous extension version|
| HDInsight: Results Font Family | -apple-system,BlinkMacSystemFont,Segoe WPC,Segoe UI,HelveticaNeue-Light,Ubuntu,Droid Sans,sans-serif | Set the font family for the results grid; set to blank to use the editor font |
| HDInsight: Results Font Size | 13 |Set the font size for the results gird; set to blank to use the editor size |
| HDInsight Cluster: Linked Cluster | -- | Linked clusters urls. Also can edit the JSON file to set |
| HDInsight Hive: Apply Localization | Unchecked | [Optional] Configuration options for localizing into Visual Studio Code's configured locale (must restart Visual Studio Code for settings to take effect)|
| HDInsight Hive: Copy Include Headers | Unchecked | [Optional] Configuration option for copying results from the Results View |
| HDInsight Hive: Copy Remove New Line | Checked | [Optional] Configuration options for copying multi-line results from the Results View |
| HDInsight Hive › Format: Align Column Definitions In Columns | Unchecked | Should column definition be aligned |
| HDInsight Hive › Format: Datatype Casing | none | Should data types be formatted as UPPERCASE, lowercase, or none (not formatted) |
| HDInsight Hive › Format: Keyword Casing | none | Should keywords be formatted as UPPERCASE, lowercase, or none (not formatted) |
| HDInsight Hive › Format: Place Commas Before Next Statement | Unchecked | Should commas be placed at the beginning of each statement in a list for example ', mycolumn2' instead of at the end 'mycolumn1,'|
| HDInsight Hive › Format: Place Select Statement References On New Line | Unchecked | Should references to objects in a SELECT statement be split into separate lines? For example, for 'SELECT C1, C2 FROM T1' both C1 and C2 is on separate lines
| HDInsight Hive: Log Debug Info | Unchecked | [Optional] Log debug output to the VS Code console (Help -> Toggle Developer Tools) 
| HDInsight Hive: Messages Default Open | Checked | True for the messages pane to be open by default; false for closed|
| HDInsight Hive: Results Font Family | -apple-system, BlinkMacSystemFont, Segoe WPC,Segoe UI, HelveticaNeue-Light, Ubuntu, Droid Sans, sans-serif | Set the font family for the results grid; set to blank to use the editor font |
| HDInsight Hive: Results Font Size | 13 | Set the font size for the results grid; set to blank to use the editor size |
| HDInsight Hive › Save as `csv`: Include Headers | Checked | [Optional] When true, column headers are included when saving results as CSV |
| HDInsight Hive: Shortcuts | -- | Shortcuts related to the results window |
| HDInsight Hive: Show Batch Time| Unchecked | [Optional] Should execution time is shown for individual batches |
| HDInsight Hive: Split Pane Selection | next | [Optional] Configuration options for which column new result panes should open in |
| HDInsight Job Submission: Cluster `Conf` | -- | Cluster Configuration |
| HDInsight Job Submission: Livy `Conf` | -- | Livy Configuration. POST/batches |
| HDInsight Jupyter: Append Results| Checked | Whether to append the results to the results window or to clear and display them. |
| HDInsight Jupyter: Languages | -- | Default settings per language. |
| HDInsight Jupyter › Log: Verbose | Unchecked | If enable verbose logging. |
| HDInsight Jupyter › Notebook: Startup Args | Can add item | `jupyter notebook` command-line arguments. Each argument is a separate item in the array. For a full list type `jupyter notebook--help` in a terminal window. |
| HDInsight Jupyter › Notebook: Startup Folder | ${workspaceRoot} |-- |
| HDInsight Jupyter: Python Extension Enabled | Checked | Use Python-Interactive-Window of ms-python extension when submitting pySpark Interactive jobs. Otherwise, use our own `jupyter` window. |
| HDInsight Spark.NET: 7z | C:\Program Files\7-Zip | <Path to 7z.exe> |
| HDInsight Spark.NET: HADOOP_HOME | D:\winutils | <Path to bin\winutils.exe> windows OS only |
| HDInsight Spark.NET: JAVA_HOME | C:\Program Files\Java\jdk1.8.0_201\ | Path to Java Home|
| HDInsight Spark.NET: SCALA_HOME | C:\Program Files (x86)\scala\ | Path to Scala Home |
| HDInsight Spark.NET: SPARK_HOME | D:\spark-2.3.3-bin-hadoop2.7\ | Path to Spark Home |
| Hive: Persist Query Result Tabs | Unchecked | Hive PersistQueryResultTabs |
| Hive: Split Pane Selection | next | [Optional] Configuration options for which column new result panes should open in |
| Hive Interactive: Copy Executable Folder | Unchecked | If copy the hive interactive service runtime folder to user's tmp folder. |
| Hql Interactive Server: Wrapper Port | 13424 | Hive interactive service port |
| Hql Language Server: Language Wrapper Port | 12342 | Hive language service port servers listen to. |
| Hql Language Server: Max Number Of Problems | 100 | Controls the maximum number of problems produced by the server. |
| Synapse Spark Compute: Synapse Spark Compute Azure Environment | blank | synapse Spark Compute Azure environment |
| Synapse Spark pool Job Submission: `Livy Conf` | -- | Livy Configuration. POST/batches
| Synapse Spark pool Job Submission: `Synapse Spark Pool Cluster Conf` | -- | Synapse Spark Pool Configuration |


## Next steps

- For information about Azure HDInsight for Visual Studio Code, see [Spark & Hive for Visual Studio Code Tools](/sql/big-data-cluster/spark-hive-tools-vscode).
- For a video that demonstrates using Spark & Hive for Visual Studio Code, see [Spark & Hive for Visual Studio Code](https://go.microsoft.com/fwlink/?linkid=858706).
