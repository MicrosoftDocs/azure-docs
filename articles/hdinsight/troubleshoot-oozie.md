---
title: Troubleshoot Apache Oozie in Azure HDInsight
description: Troubleshoot certain Apache Oozie errors in Azure HDInsight.
ms.service: azure-hdinsight
ms.topic: troubleshooting
author: hareshg
ms.author: hgowrisankar
ms.reviewer: nijelsf
ms.date: 02/03/2025
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

```output
JA009: Cannot initialize Cluster. Please check your configuration for map
```

### Cause

The Azure Blob storage addresses used in the **job.xml** file doesn't contain the storage container or storage account name. The Blob storage address format must be `wasbs://containername@storageaccountname.blob.core.windows.net`.

### Resolution

Change the Blob storage addresses that the job uses.

---

## JA002: Oozie isn't allowed to impersonate &lt;USER&gt;

### Issue

The job status changes to **SUSPENDED**. Details for the job show the `RunHiveScript` status as **START_MANUAL**. If you select the action, it shows the following error message:

```output
JA002: User: oozie is not allowed to impersonate <USER>
```

### Cause

The current permission settings don't allow Oozie to impersonate the specified user account.

### Resolution

Oozie can impersonate users in the **`users`** group. Use the `groups USERNAME` to see the groups that the user account is a member of. If the user isn't a member of the **`users`** group, use the following command to add the user to the group:

```bash
sudo adduser USERNAME users
```

> [!NOTE]  
> It can take several minutes before HDInsight recognizes that the user has been added to the group.

---

## Launcher ERROR (Sqoop)

### Issue

The job status changes to **KILLED**. Details for the job show the `RunSqoopExport` status as **ERROR**. If you select the action, it shows the following error message:

```output
Launcher ERROR, reason: Main class [org.apache.oozie.action.hadoop.SqoopMain], exit code [1]
```

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
## Oozie UI – Default user access rights 

### Issue

For the created HDInsight Oozie clusters, users by default would have read access to all jobs, write access to their own jobs, and can write to jobs based on ACLs. Admin users have broader permissions, including write access to all jobs and operations. In Oozie clusters, if security configuration is disabled, all users are treated as admins and HDInsight Oozie clusters have security configuration disabled by default. 

### Cause

If security is disabled, all users are treated as admin users which is a standard behavior in Oozie and not specific to HDInsight platform. Reference to the same available in the following Oozie page - [Oozie - User Authentication Public Doc](https://oozie.apache.org/docs/4.2.0/AG_Install.html#:~:text=If%20security%20is,in%20oozie.service)

### Resolution

Admin users can be defined through specific property. ACLs are set during job submission and can include both usernames and groups. The system checks if the user belongs to the necessary groups to perform actions. 

Set this property oozie.service.AuthorizationService.security.enabled=true in ambari 

Ambari UI -> Services -> Oozie -> Configs -> Advanced ->  Search and Set to True -> Restart All Affected 

Admin users are determined from the list of admin groups, specified in oozie.service.AuthorizationService.admin.groups property. Use commas to separate multiple groups, spaces, tabs and ENTER characters are trimmed. 

## Next steps

[!INCLUDE [troubleshooting next steps](includes/hdinsight-troubleshooting-next-steps.md)]

### Oozie WebUI disablement and command line options as alternative

### Issue

Apache Oozie has been retired since February 2025, refer to the [link](https://attic.apache.org/projects/oozie.html). There are known vulnerabilities related to Oozie WebUI.

### Cause

To disable the Oozie WebUI, please follow the below steps:

1. Stop Oozie services from Ambari portal.

2. Edit /var/lib/ambari-server/resources/stacks/HDInsight/\<version\>/services/OOZIE/quicklinks/quicklinks.json and remove the value for **`<url>`** parameter and replace with "".

Before:
```xml
  "name": "default",
  "description": "default quick links configuration",
  "configuration": {
    "links": [
  .....
        "url":"%@://%@:%@/oozie?user.name=%@",
  .....
```

After:
```xml
  "name": "default",
  "description": "default quick links configuration",
  "configuration": {
    "links": [
  .....
        "url":"",
  .....
```

3. Restart Ambari services
```bash
sudo ambari-services restart
```

4. Start Oozie services from Ambari

### Workaround

Use Oozie command line options, refer to the [link](https://oozie.apache.org/docs/4.1.0/DG_CommandLineTool.html#Common_CLI_Options).
