---
title: Azure HDInsight for Visual Studio Code
description: Learn how to use the Spark & Hive Tools (Azure HDInsight) for Visual Studio Code. Use the tools to create and submit queries and scripts.
ms.service: azure-hdinsight
ms.topic: how-to
ms.date: 06/13/2024
author: apurbasroy
ms.author: apsinhar
ms.reviewer: hgowrisankar
ms.custom:
  - devx-track-python
  - sfi-image-nochange
---

# Use Spark & Hive Tools for Visual Studio Code

Learn how to use Apache Spark & Hive Tools for Visual Studio Code. Use the tools to create and submit Apache Hive batch jobs, interactive Hive queries, and PySpark scripts for Apache Spark. First we'll describe how to install Spark & Hive Tools in Visual Studio Code. Then we'll walk through how to submit jobs to Spark & Hive Tools.  

Spark & Hive Tools can be installed on platforms that are supported by Visual Studio Code. Note the following prerequisites for different platforms.

## Prerequisites

The following items are required for completing the steps in this article:

- An Azure HDInsight cluster. To create a cluster, see [Get started with HDInsight](hadoop/apache-hadoop-linux-create-cluster-get-started-portal.md). Or use a Spark and Hive cluster that supports an Apache Livy endpoint.
- [Visual Studio Code](https://code.visualstudio.com/).
- [Mono](https://www.mono-project.com/docs/getting-started/install/). Mono is required only for Linux and macOS.
- [A PySpark interactive environment for Visual Studio Code](set-up-pyspark-interactive-environment.md).
- A local directory. This article uses  `C:\HD\HDexample`.

## Install Spark & Hive Tools

After you meet the prerequisites, you can install Spark & Hive Tools for Visual Studio Code by following these steps:

1. Open Visual Studio Code.

2. From the menu bar, navigate to **View** > **Extensions**.

3. In the search box, enter **Spark & Hive**.

4. Select **Spark & Hive Tools** from the search results, and then select **Install**:

   :::image type="content" source="./media/hdinsight-for-vscode/install-hdInsight-plugin.png" alt-text="Spark & Hive for Visual Studio Code Python install.":::

5. Select **Reload** when necessary.

## Open a work folder

To open a work folder and to create a file in Visual Studio Code, follow these steps:

1. From the menu bar, navigate to **File** > **Open Folder...** > `C:\HD\HDexample`, and then select the **Select Folder** button. The folder appears in the **Explorer** view on the left.

2. In **Explorer** view, select the **`HDexample`** folder, and then select the **New File** icon next to the work folder:

   :::image type="content" source="./media/hdinsight-for-vscode/visual-studio-code-new-file.png" alt-text="visual studio code new file icon.":::

3. Name the new file by using either the `.hql` (Hive queries) or the `.py` (Spark script) file extension. This example uses **HelloWorld.hql**.

## Set the Azure environment

For a national cloud user, follow these steps to set the Azure environment first, and then use the **Azure: Sign In** command to sign in to Azure:

1. Navigate to  **File** > **Preferences** > **Settings**.
2. Search on the following string: **Azure: Cloud**.
3. Select the national cloud from the list:

   :::image type="content" source="./media/hdinsight-for-vscode/set-default-login-entry-configuration.png" alt-text="Set default login entry configuration.":::

## Connect to an Azure account

Before you can submit scripts to your clusters from Visual Studio Code, user can either sign in to Azure subscription, or [link a HDInsight cluster](#link-a-cluster). Use the Ambari username/password or domain joined credential for ESP cluster to connect to your HDInsight cluster. Follow these steps to connect to Azure:

1. From the menu bar, navigate to **View** > **Command Palette...**, and enter **Azure: Sign In**:

   :::image type="content" source="./media/hdinsight-for-vscode/hdinsight-for-vscode-extension-login.png" alt-text="Spark & Hive Tools for Visual Studio Code login.":::

2. Follow the sign-in instructions to sign in to Azure. After you're connected, your Azure account name shows on the status bar at the bottom of the Visual Studio Code window.  

## Link a cluster

### Link: Azure HDInsight

You can link a normal cluster by using an [Apache Ambari](https://ambari.apache.org/)-managed username, or you can link an Enterprise Security Pack secure Hadoop cluster by using a domain username (such as: `user1@contoso.com`).

1. From the menu bar, navigate to **View** > **Command Palette...**, and enter **Spark / Hive: Link a Cluster**.

   :::image type="content" source="./media/hdinsight-for-vscode/link-cluster-command.png" alt-text="Command Palette link cluster command.":::

2. Select linked cluster type **Azure HDInsight**.

3. Enter the HDInsight cluster URL.

4. Enter your Ambari username; the default is **admin**.

5. Enter your Ambari password.

6. Select the cluster type.

7. Set the display name of the cluster (optional).

8. Review **OUTPUT** view for verification.

   > [!NOTE]  
   > The linked username and password are used if the cluster both logged in to the Azure subscription and linked a cluster.  

### Link: Generic Livy endpoint

1. From the menu bar, navigate to **View** > **Command Palette...**, and enter **Spark / Hive: Link a Cluster**.

2. Select linked cluster type **Generic Livy Endpoint**.

3. Enter the generic Livy endpoint. For example: http\://10.172.41.42:18080.

4. Select authorization type **Basic** or **None**.  If you select **Basic**:  
   
   1. Enter your Ambari username; the default is **admin**.  

   2. Enter your Ambari password.

5. Review **OUTPUT** view for verification.

## List clusters

1. From the menu bar, navigate to **View** > **Command Palette...**, and enter **Spark / Hive: List Cluster**.

2. Select the subscription that you want.

3. Review the **OUTPUT** view. This view shows your linked cluster (or clusters) and all the clusters under your Azure subscription:

   :::image type="content" source="./media/hdinsight-for-vscode/list-cluster-result1.png" alt-text="Set a default cluster configuration.":::

## Set the default cluster

1. Reopen the **`HDexample`** folder that was discussed [earlier](#open-a-work-folder), if closed.  

2. Select the **HelloWorld.hql** file that was created [earlier](#open-a-work-folder). It opens in the script editor.

3. Right-click the script editor, and then select **Spark / Hive: Set Default Cluster**.  

4. [Connect](#connect-to-an-azure-account) to your Azure account, or link a cluster if you haven't yet done so.

5. Select a cluster as the default cluster for the current script file. The tools automatically update the **.VSCode\settings.json** configuration file:

   :::image type="content" source="./media/hdinsight-for-vscode/set-default-cluster-configuration.png" alt-text="Set default cluster configuration.":::

## Submit interactive Hive queries and Hive batch scripts

With Spark & Hive Tools for Visual Studio Code, you can submit interactive Hive queries and Hive batch scripts to your clusters.

1. Reopen the **`HDexample`** folder that was discussed [earlier](#open-a-work-folder), if closed.  

2. Select the **HelloWorld.hql** file that was created [earlier](#open-a-work-folder). It opens in the script editor.

3. Copy and paste the following code into your Hive file, and then save it:

   ```hiveql
   SELECT * FROM hivesampletable;
   ```

4. [Connect](#connect-to-an-azure-account) to your Azure account, or link a cluster if you haven't yet done so.

5. Right-click the script editor and select **Hive: Interactive** to submit the query, or use the Ctrl+Alt+I keyboard shortcut.  Select **Hive: Batch** to submit the script, or use the Ctrl+Alt+H keyboard shortcut.  

6. If you haven't specified a default cluster, select a cluster. The tools also let you submit a block of code instead of the whole script file by using the context menu. After a few moments, the query results appear in a new tab:

   :::image type="content" source="./media/hdinsight-for-vscode/interactive-hive-result.png" alt-text="Interactive Apache Hive query result.":::

   - **RESULTS** panel: You can save the whole result as a CSV, JSON, or Excel file to a local path or just select multiple lines.

   - **MESSAGES** panel: When you select a **Line** number, it jumps to the first line of the running script.

## Submit interactive PySpark queries 

### Prerequisite for Pyspark interactive

Note here that Jupyter Extension version (ms-jupyter): v2022.1.1001614873 and Python Extension version (ms-python): v2021.12.1559732655, Python 3.6.x and 3.7.x are required for HDInsight interactive PySpark queries.

Users can perform PySpark interactive in the following ways.

### Using the PySpark interactive command in PY file
Using the PySpark interactive command to submit the queries, follow these steps:

1. Reopen the **`HDexample`** folder that was discussed [earlier](#open-a-work-folder), if closed.  

2. Create a new **HelloWorld.py** file, following the [earlier](#open-a-work-folder) steps.

3. Copy and paste the following code into the script file:

   ```python
   from operator import add
   from pyspark.sql import SparkSession 
   spark = SparkSession.builder \ 
         .appName('hdisample') \ 
         .getOrCreate() 
   lines = spark.read.text("/HdiSamples/HdiSamples/FoodInspectionData/README").rdd.map(lambda r: r[0])
   counters = lines.flatMap(lambda x: x.split(' ')) \
                .map(lambda x: (x, 1)) \
                .reduceByKey(add)

   coll = counters.collect()
   sortedCollection = sorted(coll, key = lambda r: r[1], reverse = True)

   for i in range(0, 5):
        print(sortedCollection[i])
   ```

4. The prompt to install PySpark/Synapse Pyspark kernel is displayed in the lower right corner of the window. You can click on **Install** button to proceed for the PySpark/Synapse Pyspark installations; or click on **Skip** button to skip this step.

   :::image type="content" source="./media/hdinsight-for-vscode/install-the-pyspark-kernel.png" alt-text="Screenshot shows an option to skip the PySpark installation.":::

5. If you need to install it later, you can navigate to **File** > **Preference** > **Settings**, then uncheck **HDInsight: Enable Skip Pyspark Installation** in the settings. 
    
    :::image type="content" source="./media/hdinsight-for-vscode/enable-skip-pyspark-installation.png" alt-text="Screenshot shows the option to Enable Skip Pyspark Installation.":::

6. If the installation is successful in step 4, the "PySpark installed successfully" message box is displayed in the lower right corner of the window. Click on **Reload** button to reload the window.

   :::image type="content" source="./media/hdinsight-for-vscode/pyspark-kernel-installed-successfully.png" alt-text="pyspark installed successfully.":::


7. From the menu bar, navigate to **View** > **Command Palette...** or use the **Shift + Ctrl + P** keyboard shortcut, and enter **Python: Select Interpreter to start Jupyter Server**.

   :::image type="content" source="./media/hdinsight-for-vscode/select-interpreter-to-start-jupyter-server.png" alt-text="select interpreter to start Jupyter server.":::

8. Select the Python option below.

   :::image type="content" source="./media/hdinsight-for-vscode/choose-the-below-option.png" alt-text="choose the below option.":::
    
9. From the menu bar, navigate to **View** > **Command Palette...** or use the **Shift + Ctrl + P** keyboard shortcut, and enter **Developer: Reload Window**.

    :::image type="content" source="./media/hdinsight-for-vscode/reload-window.png" alt-text="reload window.":::

10. [Connect](#connect-to-an-azure-account) to your Azure account, or link a cluster if you haven't yet done so.

11. Select all the code, right-click the script editor, and select **Spark: PySpark Interactive / Synapse: Pyspark Interactive** to submit the query. 

    :::image type="content" source="./media/hdinsight-for-vscode/pyspark-interactive-right-click.png" alt-text="pyspark interactive context menu.":::

12. Select the cluster, if you haven't specified a default cluster. After a few moments, the **Python Interactive** results appear in a new tab. Click on PySpark to switch the kernel to **PySpark / Synapse Pyspark**, and the code will run successfully. If you want to switch to Synapse Pyspark kernel, disabling auto-settings in Azure portal is encouraged. Otherwise it may take a long while to wake up the cluster and set synapse kernel for the first time use. If The tools also let you submit a block of code instead of the whole script file by using the context menu:

    :::image type="content" source="./media/hdinsight-for-vscode/pyspark-interactive-python-interactive-window.png" alt-text="pyspark interactive python interactive window.":::

13. Enter **%%info**, and then press Shift+Enter to view the job information (optional):

    :::image type="content" source="./media/hdinsight-for-vscode/pyspark-interactive-view-job-information.png" alt-text="pyspark interactive view job information.":::

The tool also supports the **Spark SQL** query:

  :::image type="content" source="./media/hdinsight-for-vscode/pyspark-ineteractive-select-result.png" alt-text="pyspark interactive view result.":::


### Perform interactive query in PY file using a #%% comment

1. Add **#%%** before the Py code to get notebook experience.

   :::image type="content" source="./media/hdinsight-for-vscode/run-cell.png" alt-text="add #%%.":::

2. Click on **Run Cell**. After a few moments, the Python Interactive results appear in a new tab. Click on PySpark to switch the kernel to PySpark/Synapse PySpark, then click on **Run Cell** again, and the code will run successfully.

   :::image type="content" source="./media/hdinsight-for-vscode/run-cell-get-results.png" alt-text="run cell results.":::

## Leverage IPYNB support from Python extension

1. You can create a Jupyter Notebook by command from the Command Palette or by creating a new`.ipynb` file in your workspace. For more information, see [Working with Jupyter Notebooks in Visual Studio Code](https://code.visualstudio.com/docs/python/jupyter-support)

2. Click on **Run cell** button, follow the prompts to **set the default spark pool** (we suggest you to set default cluster/pool every time before opening a notebook) and then, **Reload** window.

   :::image type="content" source="./media/hdinsight-for-vscode/set-the-default-spark-pool-and-reload.png" alt-text="set the default spark pool and reload.":::

3. Click on PySpark to switch kernel to **PySpark / Synapse Pyspark**, and then click on **Run Cell**, after a while, the result will be displayed.

   :::image type="content" source="./media/hdinsight-for-vscode/run-ipynb-file-results.png" alt-text="run ipynb results.":::


> [!NOTE]
>
> [For Synapse PySpark installation error](#known-issues), since its dependency will not be maintained anymore by other team, this will not be maintained anymore as well. If you try to use Synapse Pyspark interactive, please switch to use [Azure Synapse Analytics](https://ms.web.azuresynapse.net/en-us/) instead. And it's a long term change.
>

## Submit PySpark batch job

1. Reopen the **`HDexample`** folder that you discussed [earlier](#open-a-work-folder), if closed.  

2. Create a new **BatchFile.py** file by following the [earlier](#open-a-work-folder) steps.

3. Copy and paste the following code into the script file:

   ```python
   from __future__ import print_function
   import sys
   from operator import add
   from pyspark.sql import SparkSession
   if __name__ == "__main__":
       spark = SparkSession\
           .builder\
           .appName("PythonWordCount")\
           .getOrCreate()
   
       lines = spark.read.text('/HdiSamples/HdiSamples/SensorSampleData/hvac/HVAC.csv').rdd.map(lambda r: r[0])
       counts = lines.flatMap(lambda x: x.split(' '))\
                  .map(lambda x: (x, 1))\
                   .reduceByKey(add)
       output = counts.collect()
       for (word, count) in output:
           print("%s: %i" % (word, count))
       spark.stop()
   ```

4. [Connect](#connect-to-an-azure-account) to your Azure account, or link a cluster if you haven't yet done so.

5. Right-click the script editor, and then select **Spark: PySpark Batch**, or **Synapse: PySpark Batch***.

6. Select a cluster/spark pool to submit your PySpark job to:

   :::image type="content" source="./media/hdinsight-for-vscode/submit-pythonjob-result.png" alt-text="Submit Python job result output.":::

After you submit a Python job, submission logs appear in the **OUTPUT** window in Visual Studio Code. The Spark UI URL and Yarn UI URL are also shown. If you submit the batch job to an Apache Spark pool, the Spark history UI URL and the Spark Job Application UI URL are also shown. You can open the URL in a web browser to track the job status.

## Integrate with HDInsight Identity Broker (HIB)

### Connect to your HDInsight ESP cluster with ID Broker (HIB)

You can follow the normal steps to sign in to Azure subscription to connect to your HDInsight ESP cluster with ID Broker (HIB). After sign-in, you'll see the cluster list in Azure Explorer. For more instructions, see [Connect to your HDInsight cluster](#connect-to-an-azure-account).

### Run a Hive/PySpark job on an HDInsight ESP cluster with ID Broker (HIB)

For run a hive job, you can follow the normal steps to submit job to HDInsight ESP cluster with ID Broker (HIB). Refer to [Submit interactive Hive queries and Hive batch scripts](#submit-interactive-hive-queries-and-hive-batch-scripts) for more instructions.

For run an interactive PySpark job, you can follow the normal steps to submit job to HDInsight ESP cluster with ID Broker (HIB). Refer to Submit interactive PySpark queries.

For run a PySpark batch job, you can follow the normal steps to submit job to HDInsight ESP cluster with ID Broker (HIB). Refer to [Submit PySpark batch job](#submit-pyspark-batch-job) for more instructions.

## Apache Livy configuration

[Apache Livy](https://livy.incubator.apache.org/) configuration is supported. You can configure it in the **.VSCode\settings.json** file in the workspace folder. Currently, Livy configuration only supports Python script. For more information, see [Livy README](https://github.com/cloudera/livy/blob/master/README.rst).

<a id="triggerlivyconf"></a>**How to trigger Livy configuration**

### Method 1  

1. From the menu bar, navigate to **File** > **Preferences** > **Settings**.
2. In the **Search settings** box, enter **HDInsight Job Submission: Livy Conf**.  
3. Select **Edit in settings.json** for the relevant search result.

### Method 2

Submit a file, and notice that the `.vscode` folder is automatically added to the work folder. You can see the Livy configuration by selecting **.vscode\settings.json**.

- The project settings:

  :::image type="content" source="./media/hdinsight-for-vscode/hdi-apache-livy-config.png" alt-text="HDInsight Apache Livy configuration.":::

  >[!NOTE]
  >For the **driverMemory** and **executorMemory** settings, set the value and unit. For example: 1g or 1024m.

- Supported Livy configurations:

  **POST /batches**
  
  **Request body**

  | name | description | type |
  | --- | --- | --- |
  | file | File containing the application to execute | Path (required) |
  | proxyUser | User to impersonate when running the job | String |
  | className | Application Java/Spark main class | String |
  | args | Command-line arguments for the application | List of strings |
  | jars | Jars to be used in this session | List of strings | 
  | pyFiles | Python files to be used in this session | List of strings |
  | files | Files to be used in this session | List of strings |
  | driverMemory | Amount of memory to use for the driver process | String |
  | driverCores | Number of cores to use for the driver process | Int |
  | executorMemory | Amount of memory to use per executor process | String |
  | executorCores | Number of cores to use for each executor | Int |
  | numExecutors | Number of executors to launch for this session | Int |
  | archives | Archives to be used in this session | List of strings |
  | queue | Name of the YARN queue to be submitted to| String |
  | name | Name of this session | String |
  | conf | Spark configuration properties | Map of key=val |

  **Response body**
  The created Batch object.

  | name | description | type |
  | --- | ---| --- |
  | ID | Session ID | Int |
  | appId | Application ID of this session | String |
  | appInfo | Detailed application info | Map of key=val |
  | log | Log lines | List of strings |
  | state |Batch state | String |

  > [!NOTE]
  > The assigned Livy config is displayed in the output pane when you submit the script.

## Integrate with Azure HDInsight from Explorer

You can preview Hive Table in your clusters directly through the **Azure HDInsight** explorer:

1. [Connect](#connect-to-an-azure-account) to your Azure account if you haven't yet done so.

2. Select the **Azure** icon from leftmost column.

3. From the left pane, expand **AZURE: HDINSIGHT**. The available subscriptions and clusters are listed.

4. Expand the cluster to view the Hive metadata database and table schema.

5. Right-click the Hive table. For example: **hivesampletable**. Select **Preview**.

   :::image type="content" source="./media/hdinsight-for-vscode/hdinsight-for-vscode-preview-hive-table.png" alt-text="Spark & Hive for Visual Studio Code preview hive table.":::

6. The **Preview Results** window opens:

   :::image type="content" source="./media/hdinsight-for-vscode/hdinsight-for-vscode-preview-results-window.png" alt-text="Spark & Hive for Visual Studio Code preview results window.":::

- RESULTS panel

   You can save the whole result as a CSV, JSON, or Excel file to a local path, or just select multiple lines.

- MESSAGES panel

  1. When the number of rows in the table is greater than 100, you see the following message: "The first 100 rows are displayed for Hive table."
  2. When the number of rows in the table is less than or equal to 100, you see the following message: "60 rows are displayed for Hive table."
  3. When there's no content in the table, you see the following message: "`0 rows are displayed for Hive table.`"

     >[!NOTE]
     >
     >In Linux, install xclip to enable copy-table data.
     >
     >:::image type="content" source="./media/hdinsight-for-vscode/hdinsight-for-vscode-preview-linux-install-xclip.png" alt-text="Spark & Hive for Visual Studio code in Linux.":::

## Additional features

Spark & Hive for Visual Studio Code also supports the following features:

- **IntelliSense autocomplete**. Suggestions pop up for keywords, methods, variables, and other programming elements. Different icons represent different types of objects:

    :::image type="content" source="./media/hdinsight-for-vscode/hdinsight-for-vscode-auto-complete-objects.png" alt-text="Spark & Hive Tools for Visual Studio Code IntelliSense objects.":::

- **IntelliSense error marker**. The language service underlines editing errors in the Hive script.     
- **Syntax highlights**. The language service uses different colors to differentiate variables, keywords, data type, functions, and other programming elements:

    :::image type="content" source="./media/hdinsight-for-vscode/hdinsight-for-vscode-syntax-highlights.png" alt-text="Spark & Hive Tools for Visual Studio Code syntax highlights.":::

## Reader-only role

Users who are assigned the reader-only role for the cluster can't submit jobs to the HDInsight cluster, nor view the Hive database. Contact the cluster administrator to upgrade your role to [**HDInsight Cluster Operator**](./hdinsight-migrate-granular-access-cluster-configurations.md#add-the-hdinsight-cluster-operator-role-assignment-to-a-user) in the [Azure portal](https://portal.azure.com/). If you have valid Ambari credentials, you can manually link the cluster by using the following guidance.

### Browse the HDInsight cluster  

When you select the Azure HDInsight explorer to expand an HDInsight cluster, you're prompted to link the cluster if you have the reader-only role for the cluster. Use the following method to link to the cluster by using your Ambari credentials.

### Submit the job to the HDInsight cluster

When submitting job to an HDInsight cluster, you're prompted to link the cluster if you're in the reader-only role for the cluster. Use the following steps to link to the cluster by using Ambari credentials.

### Link to the cluster

1. Enter a valid Ambari username.
2. Enter a valid password.

   :::image type="content" source="./media/hdinsight-for-vscode/hdi-azure-hdinsight-azure-username.png" alt-text="Spark & Hive Tools for Visual Studio Code Username.":::

   :::image type="content" source="./media/hdinsight-for-vscode/hdi-azure-hdinsight-azure-password.png" alt-text="Spark & Hive Tools for Visual Studio Code Password.":::

   > [!NOTE]
   >
   >You can use `Spark / Hive: List Cluster` to check the linked cluster:
   >
   >:::image type="content" source="./media/hdinsight-for-vscode/list-cluster-result1.png" alt-text="Spark & Hive Tools for Visual Studio Code Reader Linked.":::

## Azure Data Lake Storage Gen2

### Browse a Data Lake Storage Gen2 account

Select the Azure HDInsight explorer to expand a Data Lake Storage Gen2 account. You're prompted to enter the storage access key if your Azure account has no access to Gen2 storage. After the access key is validated, the Data Lake Storage Gen2 account is auto-expanded.

### Submit jobs to an HDInsight cluster with Data Lake Storage Gen2

Submit a job to an HDInsight cluster using Data Lake Storage Gen2. You're prompted to enter the storage access key if your Azure account has no write access to Gen2 storage. After the access key is validated, the job will be successfully submitted.

:::image type="content" source="./media/hdinsight-for-vscode/hdi-azure-hdinsight-azure-accesskey.png" alt-text="Spark & Hive Tools for Visual Studio Code AccessKey.":::

> [!NOTE]
>
> You can get the access key for the storage account from the Azure portal. For more information, see [Manage storage account access keys](../storage/common/storage-account-keys-manage.md).

## Unlink cluster

1. From the menu bar, go to **View** > **Command Palette**, and then enter **Spark / Hive: Unlink a Cluster**.  

2. Select a cluster to unlink.  

3. See the **OUTPUT** view for verification.  

## Sign out  

From the menu bar, go to **View** > **Command Palette**, and then enter **Azure: Sign Out**.

## Known Issues 

### Synapse PySpark installation error.

 For Synapse PySpark installation error, since its dependency will not be maintained anymore by other team, it will not be maintained anymore. If you try to use Synapse Pyspark interactive, please use [Azure Synapse Analytics](https://ms.web.azuresynapse.net/) instead. And it's a long term change.

   :::image type="content" border="true" source="./media/hdinsight-for-vscode/known-issue.png" alt-text="synapse pyspark installation error.":::


## Next steps

For a video that demonstrates using Spark & Hive for Visual Studio Code, see [Spark & Hive for Visual Studio Code](https://go.microsoft.com/fwlink/?linkid=858706).
