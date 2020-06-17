---
title: Troubleshoot Apache Oozie in Azure HDInsight
description: Troubleshoot certain Apache Oozie errors in Azure HDInsight.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 04/27/2020
---

# Troubleshoot Apache Oozie in Azure HDInsight

With the Apache Oozie UI, you can view Oozie logs. The Oozie UI also contains links to the JobTracker logs for the MapReduce tasks that were started by the workflow. The pattern for troubleshooting should be:

1. View the job in Oozie web UI.

2. If there's an error or failure for a specific action, select the action to see if the **Error Message** field provides more information on the failure.

3. If available, use the URL from the action to view more details, such as the JobTracker logs, for the action.

The following are specific errors you might come across and how to resolve them.

## JA009: Can't initialize cluster

### Issue

The job status changes to **SUSPENDED**. Details for the job show the `RunHiveScript` status as **START_MANUAL**. Selecting the action displays the following error message:

    JA009: Cannot initialize Cluster. Please check your configuration for map

### Cause

The Azure Blob storage addresses used in the **job.xml** file doesn't contain the storage container or storage account name. The Blob storage address format must be `wasbs://containername@storageaccountname.blob.core.windows.net`.

### Resolution

Change the Blob storage addresses that the job uses.

---

## JA002: Oozie isn't allowed to impersonate &lt;USER&gt;

### Issue

The job status changes to **SUSPENDED**. Details for the job show the `RunHiveScript` status as **START_MANUAL**. If you select the action, it shows the following error message:

    JA002: User: oozie is not allowed to impersonate <USER>

### Cause

The current permission settings don't allow Oozie to impersonate the specified user account.

### Resolution

Oozie can impersonate users in the **`users`** group. Use the `groups USERNAME` to see the groups that the user account is a member of. If the user isn't a member of the **`users`** group, use the following command to add the user to the group:

    sudo adduser USERNAME users

> [!NOTE]  
> It can take several minutes before HDInsight recognizes that the user has been added to the group.

---

## Launcher ERROR (Sqoop)

### Issue

The job status changes to **KILLED**. Details for the job show the `RunSqoopExport` status as **ERROR**. If you select the action, it shows the following error message:

    Launcher ERROR, reason: Main class [org.apache.oozie.action.hadoop.SqoopMain], exit code [1]

### Cause

Sqoop is unable to load the database driver required to access the database.

### Resolution

When you use Sqoop from an Oozie job, you must include the database driver with the other resources, such as the workflow.xml, the job uses. Also, reference the archive that contains the database driver from the `<sqoop>...</sqoop>` section of the workflow.xml.

For example, for the job example from [Use Hadoop Oozie workflows](hdinsight-use-oozie-linux-mac.md), you would use the following steps:

1. Copy the `mssql-jdbc-7.0.0.jre8.jar` file to the **/tutorials/useoozie** directory:

    ```bash
    hdfs dfs -put /usr/share/java/sqljdbc_7.0/enu/mssql-jdbc-7.0.0.jre8.jar /tutorials/useoozie/mssql-jdbc-7.0.0.jre8.jar
    ```

2. Modify the `workflow.xml` to add the following XML on a new line above `</sqoop>`:

    ```xml
    <archive>mssql-jdbc-7.0.0.jre8.jar</archive>
    ```

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following channels for more support:

* Get answers from Azure experts through [Azure Community Support](https://azure.microsoft.com/support/community/).

* Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure account for improving customer experience. Connecting the Azure community to the right resources: answers, support, and experts.

* If you need more help, you can submit a support request from the [Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade/). Select **Support** from the menu bar or open the **Help + support** hub. For more detailed information, review [How to create an Azure support request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). Access to Subscription Management and billing support is included with your Microsoft Azure subscription, and Technical Support is provided through one of the [Azure Support Plans](https://azure.microsoft.com/support/plans/).
