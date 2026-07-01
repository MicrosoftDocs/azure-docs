---
title: Handle Livy Errors on Apache Spark in Synapse
description: Learn how to handle and interpret job failures on Apache Spark in Synapse Analytics.
author: midesa
ms.author: midesa
ms.date: 03/30/2026
ms.service: azure-synapse-analytics
ms.subservice: spark
ms.topic: error-reference
---

# Interpret error codes in Azure Synapse Analytics

Many factors can cause a Spark application to fail in Synapse Analytics. For example, the failure can stem from a system error or a user error. Previously, all errors that correspond to failing jobs on Synapse Analytics surfaced a generic error code that displayed *LIVY_JOB_STATE_DEAD*. This error code gave no further insight into why the job failed. You had to put in significant effort to identify the root cause by digging into the driver, executor, Spark Event, and Livy logs to find a resolution.

The new error codes provide a more precise list that replaces the previous generic message. The new message describes the cause of failure. Whenever a job fails on Synapse Analytics, the error handling feature parses and checks the logs on the backend to identify the root cause. It then displays a message to the user on the monitoring pane along with the steps to resolve the issue.

## Enable error classification in Synapse

Set the following Spark configuration to `true` or `false` at the job or pool level to enable or disable the error classification feature:

`livy.rsc.synapse.error-classification.enabled`

The following section lists some error types that are currently supported. The product team is continuously refining and adding more error codes by improving the model.

## Error code categories

Each error code falls under one of the following four categories:

- **User** - Indicates a user error
- **System** - Indicates a system error
- **Ambiguous** - Could be either user or system error
- **Unknown** - No classification yet, most probably because the error type isn't included in the model

## Error code examples for each classification type

### Spark_User_TypeError_TypeNotIterable

In Python, the error `TypeError: argument of type 'insert type' is not iterable` occurs when you use the membership operator (`in`, `not in`) to check if a value is in non-iterable objects such as list, tuple, or dictionary. This error usually happens because you try to search for a value in a non-iterable object. To fix this error, try the following solutions:

- Check if the value is present in the iterable object.
- If you want to check one value against another, use a logical operator instead of the membership operator.
- If the membership operator contains a `None` value, it can't iterate. Add a null check or assign a default value.
- Check if the type of the value you're using can actually be checked and if the typing is correct.

### Spark_System_ABFS_OperationFailed

An operation with Azure Data Lake Storage (ADLS) Gen2 failed.

This error typically happens because of a permissions problem.

Make sure that all ADLS Gen2 resources referenced in the Spark job have the **Storage Blob Data Contributor** RBAC role on the storage accounts that the job needs to read and write from.
Check the logs for this Spark application. Go to your Synapse Studio, select the **Monitor** tab from the left pane. From the **Activities** section, select **Apache Spark Applications** and find your Spark job from the list. For the ADLS Gen2 storage account name that is experiencing this problem, check the logs available in the **Logs** tab at the bottom part of this page.

### Spark_Ambiguous_ClassLoader_NoClassDefFound

A class required by the code couldn't be found when the script ran. For more information, see:

- For Notebook scenarios: [Apache Spark manage packages for interactive jobs](./apache-spark-manage-scala-packages.md)
- For Spark batch scenarios (see section 6): [Apache Spark manage packages for batch jobs](./apache-spark-job-definitions.md#create-an-apache-spark-job-definition-for-apache-sparkscala)

Make sure that all the code dependencies are included in the JARs that Synapse runs. If you don't or can't include third party JARs with your own code, make sure that all dependencies are included in the workspace packages for the Spark pool you're executing code on, or they're included in the **Reference files** listing for the Spark batch submission.

### Spark_Unknown_Unknown_java.lang.Exception

An unknown failure. The model can't classify the error.

If you enable this feature, Synapse Studio shows the error codes (including and beyond the previous list) along with troubleshooting instructions in the application error pane.

> [!NOTE]  
> If you built any tooling around the Synapse monitoring job that checks for a failing job by filtering the `LIVY_JOB_STATE_DEAD` error code, your app no longer works because the returned error codes are different. Modify any scripts accordingly to use this feature or disable the feature if it's not needed.
