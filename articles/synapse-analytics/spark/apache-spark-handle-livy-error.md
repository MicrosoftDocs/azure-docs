---
title: Handle Livy errors on Apache Spark in Synapse
description: Learn how to handle and interpret job failures on Apache Spark in Synapse Analytics.
author: Niharikadutta
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: spark
ms.date: 08/29/2022
ms.author: nidutta
---

# Interpret error codes in Synapse Analytics

There are many factors that can play into why a spark application fails in Azure Synapse Analytics today. For instance, it can be due to a system error or even a user related error. Previously, all errors corresponding to failing jobs on
Synapse Analytics were surfaced with a generic error code displaying *LIVY_JOB_STATE_DEAD*. This error code gave no further insight into why the job has failed. It requires significant effort to identify the root cause by digging into the driver, executor, Spark Event, Livy logs, and find a resolution.

:::image type="content" source="./media/apache-spark-error-classification/apache-spark-old-error-view.png" alt-text="Screenshot of Apache Spark error code without detailed message." lightbox="./media/apache-spark-error-classification/apache-spark-old-error-view.png" border="true":::

We have introduced a more precise list of error codes that replaces the previous generic message. The new message describes the cause of failure. Whenever a job fails on Azure Synapse Analytics, the error handling feature parses and checks the logs on the backend to identify the root cause. It then displays a message to the user on the monitoring pane along with the steps to resolve the issue.

:::image type="content" source="./media/apache-spark-error-classification/apache-spark-new-error-view.png" alt-text="Screenshot of Apache Spark error code with detailed message."  lightbox="./media/apache-spark-error-classification/apache-spark-new-error-view.png" border="true":::

## Enable error classification in Synapse

The error classification feature can be enabled or disabled by setting the following Spark configuration to `true` or `false` at the job or pool level:

`livy.rsc.synapse.error-classification.enabled`

The following section lists some error types that are currently supported. We are continuously refining and adding more to these error codes by improving our model.

## Error code categories

Each error code falls under one of the following four buckets:

1. **User** - Indicating a user error
2. **System** - Indicating a system error
3. **Ambiguous** - Could be either user or system error
4. **Unknown** - No classification yet, most probably because the error type isn't included in the model

## Error code examples for each classification type

### Spark_User_TypeError_TypeNotIterable

In Python, the error `TypeError: argument of type 'insert type' is not iterable` occurs when the membership operator (in, not in) is used to validate the membership of a value in non iterable objects such as list, tuple, dictionary. This is usually due to the search of value in a non-iterable object. Possible solutions:

* Check if the value is present in the iterable object.
* If you want to check one value to another, use logical operator instead of Membership Operator.
* If the membership operator contains "None" value, it won't be able to iterate, and a null check or assigned default must be done.
* Check if the type of the value used can actually be checked and the typing is correct.

### Spark_System_ABFS_OperationFailed

An operation with ADLS Gen2 has failed.

This error occurs typically due to a permissions issue.

Ensure that for all ADLS Gen2 resources referenced in the Spark job, has "Storage Blob Data Contributor" RBAC role on the storage accounts the job is expected to read and write from.
Check the logs for this Spark application. Navigate to your Synapse Studio, select the **Monitor** tab from the left pane. From the **Activities** section, select **Apache Spark Applications** and find your Spark job from the list. For the ADLS Gen2 storage account name that is experiencing this issue, inspect the logs available in the **Logs** tab at the bottom part of this page.

### Spark_Ambiguous_ClassLoader_NoClassDefFound

A class required by the code could not be found when the script was run.

Please refer to the following pages for package management documentation:

For Notebook scenarios: [Apache Spark manage packages for interactive jobs](./apache-spark-manage-scala-packages.md) 

For Spark batch scenarios (see section 6): [Apache Spark manage packages for batch jobs](./apache-spark-job-definitions.md#create-an-apache-spark-job-definition-for-apache-sparkscala)

Ensure that all the code dependencies are included in the JARs Synapse runs. If you do not or cannot include third party JARs with your own code, ensure that all dependencies are included in the workspace packages for the Spark pool you are executing code on, or they are included in the "Reference files" listing for the Spark batch submission. See the above documentation for more information.

### Spark_Unknown_Unknown_java.lang.Exception

An unknown failure, the model wasn't able to classify.


The error codes (including and beyond the list shown above) along with the troubleshooting instructions on how to resolve the issue will show up on the Synapse Studio application error pane if this feature is enabled.

> [!NOTE]
> If you built any tooling around the Synapse monitoring job that checks for a failing job by filtering the `LIVY_JOB_STATE_DEAD` error code, your app would no longer work. Because the returned error codes would be different as mentioned above. Modify any scripts accordingly in order to utilize this feature or disable the feature if it's not needed.
