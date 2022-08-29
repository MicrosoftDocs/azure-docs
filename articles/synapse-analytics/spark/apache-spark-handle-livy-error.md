---
title: Handle Livy errors on Apache Spark in Synapse
description: Guide on how to handle and interpret job failures on Apache Spark in Synapse Analytics.
author: Niharikadutta
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: spark
ms.date: 08/29/2022
ms.author: nidutta
---

# Interpreting error codes in Synapse

There are many factors that can play into why a spark application fails in Azure Synapse Analytics today, for instance, it can be due to a system error or even a user related error. Previously, all errors in failing jobs on
Synapse were surfaced with a generic error code displaying LIVY_JOB_STATE_DEAD. This error code gave no further insight into why the job has failed and requires significant effort to identify the root cause by digging into the driver, executor, Spark Event and Livy logs and find a resolution for it.

![Screenshot of old error codes.](./media/apache-spark-error-classification/apache-spark-old-error-view.png)

To make this process easier, we have introduced a more precise list of error codes, to replace the previous generic one, that describes the cause of failure. Now whenever a job fails on Azure Synapse Analytics, the error handling feature parses and checks the logs on the backend to identify the root cause and display it to the user on the monitoring pane along with the steps to take to resolve the issue.

![Screenshot of New error codes.](./media/apache-spark-error-classification/apache-spark-new-error-view.png)

## Enable error classification in Synapse

This error classification feature can be enabled or disabled by setting the following Spark config to `true` or `false` at the job or pool level - `livy.rsc.synapse.error-classification.enabled` .

Please find below the list of a few error types we support today. Please note, we are continuously refining and adding to these error codes by improving our model.

## Few supported error codes and what they mean

Each error code falls under one of the following four buckets:

1. **User** - Indicating a user error
2. **System** - Indicating a system error
3. **Ambiguous** - Could be either user or system error
4. **Unknown** - No classification yet, most probably because the error type isn't included in the model

1. **Spark_Ambiguous_ABFS_StorageAccountDoesNotExist**
    
    Referenced storage account does not exist. Debugging steps:

    Validate that the storage account name was entered correctly. For example, was the name copy/pasted incorrectly?
    Go to the Azure Portal (https://portal.azure.com/ ) and validate that the storage account still exists and was not deleted.

2. **Spark_Ambiguous_ClassLoader_NoClassDefFound**

    A class required by the code could not be found during runtime of the script.

    Please refer to the following pages for package management documentation:

    For Notebook scenarios: [Apache Spark manage packages for interactive jobs](./apache-spark-manage-scala-packages.md) 

    For Spark batch scenarios (see section 6): [Apache Spark manage packages for batch jobs](./apache-spark-job-definitions.md#create-an-apache-spark-job-definition-for-apache-sparkscala )

    Ensure all code dependencies are included in the JARs Synapse runs. If you do not or cannot include third party JARs with your own code, ensure that all dependencies are included in the workspace packages for the Spark pool you are executing code on or included in the "Reference files" listing for the Spark batch submission. See attached documentation.

3. **Spark_Ambiguous_Executor_MaxExecutorFailures**

    Application failed because too many executors failed. The number of acceptable executor failures is controlled by the config spark.yarn.max.executor.failures.

    To investigate this failure, look at the executor logs and error codes.

4. **Spark_Ambiguous_JDBC_ConnectionFailed**

    Connection to the SQL server has failed.

    Ensure the hostname is correct in your SQL server database connection string.
    Ensure the port is properly specified for the database connection.
    Ensure the firewall settings configured on your SQL Server allow connections from your Synapse workspace.

5. **Spark_Ambiguous_JDBC_SQLServerException**

    An error occurred during the execution of SQL statement.

    Ensure that any SQL statements you are issuing have valid syntax.
    Ensure that any SQL tables or functions that you are calling exist and your user as proper permissions for the actions your code is attempting to make. This applies to both standard SQL tables as well as external SQL tables.
    Ensure that the columns referenced in your code exist in the target tables.
    Check the logs for this Spark application by clicking the Monitor tab in left side of the Synapse Studio UI, select "Apache Spark Applications" from the "Activities" section, and find your Spark job from this list. Inspect the logs available in the "Logs" tab in the bottom part of this page.

6. **Spark_Ambiguous_UserApp_JobAborted**

    Job was aborted due to user runtime error.

    This can be be for many reasons, a common cause is:

    Ensure the files you are loading are of the format. If you're loading data via read.parquet, ensure the format of the data that is being read is indeed parquet. Consider gating wildcard loads with the file type suffix you intend to load to avoid. For example, instead of using a load string like

    `/path/to/my/parquet/files/*`

    Change this to:

    `/path/to/my/parquet/files/*.parquet`

    To avoid loading JSON files that might exist in the directory.

7. **Spark_Ambiguous_UserApp_NullPointer**

    The code tried to dereference a null value.

    At some point the code attempted to call a method or access a property on a null value. To avoid de-referencing null add null check guards around method calls or property accesses on values that can potentially be null.

    Check the logs for this Spark application by clicking the Monitor tab in left side of the Synapse Studio UI, select "Apache Spark Applications" from the "Activities" section, and find your Spark job from this list. Inspect the logs available in the "Logs" tab in the bottom part of this page for a clearer indication of what was de-referenced.

8. **Spark_Ambiguous_UserApp_SparkContextShutDown**

    Spark Context was shut down.

    While there are many causes for this error, one common cause is when the Spark driver or executor tasks use up too much memory.

    Try running your computation again with a bigger SKU with more memory and with additional nodes.
    Ensure tasks are being parallelized appropriately. Look for foreach statements in your main driver code and convert these foreach loops into parallel tasks executed via Spark API functions.
    Check the executor logs for this Spark application by clicking the Monitor tab in left side of the Synapse Studio UI, select "Apache Spark Applications" from the "Activities" section, and find your Spark job from this list. Click on the "Spark UI" link in the top tab. Once this new page loads click on "Executors" in the top tab. Here you can see all the executors that ran. Inspect the logs for these executors to find the underlying cause of failure.

9. **Spark_Ambiguous_YARN_AllNodesDisallowed**

    Cannot run job because all available nodes are disallowed (Spark internals refer to this as "blacklisted").

    Nodes and executors become disallowed when the configuration `spark.blacklist.enabled` is set to true and too many tasks have failed.

    To investigate this failure, look at task failures section below.

10. **Spark_System_ABFS_OperationFailed**

    An operation with ADLS Gen2 has failed.

    This is typically due to a permissions issue.

    Please ensure that for all ADLS Gen2 resources referenced in the Spark job, that the user running the code has RBAC roles "Storage Blob Data Contributor" on storage accounts the job is expected to read and write from.
    Check the logs for this Spark application by clicking the Monitor tab in left side of the Synapse Studio UI, select "Apache Spark Applications" from the "Activities" section, and find your Spark job from this list. Inspect the logs available in the "Logs" tab in the bottom part of this page for the ADLS Gen2 storage account name that is experiencing this issue.

The error codes (including and beyond the list shown above) along with the TSGs on how to resolve the issue will show up on the Synapse Studio application error pane if this feature is enabled.

> [!NOTE]
> If you have built any tooling around Synapse job monitoring that checks for a failing job by checking against the error code `LIVY_JOB_STATE_DEAD`, that would no longer work as the returned error codes would be different as mentioned above. Please modify any scripts accordingly in order to utilize this feature, or disable the feature if not needed.
