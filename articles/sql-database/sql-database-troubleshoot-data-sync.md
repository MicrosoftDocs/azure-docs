---
title: "Troubleshoot Azure SQL Data Sync | Microsoft Docs"
description: "Learn to troubleshoot common issues with Azure SQL Data Sync"
services: sql-database
ms.date: "11/2/2017"
ms.topic: "article"
ms.service: "sql-database"
author: "douglaslMS"
ms.author: "douglasl"
manager: "craigg"
---
# Troubleshoot issues with SQL Data Sync (Preview)

This article describes how to troubleshoot current issues that are known to the SQL Data Sync (Preview) team. If there is a workaround for an issue, it is provided here.

For an overview of SQL Data Sync, see [Sync data across multiple cloud and on-premises databases with Azure SQL Data Sync (Preview)](sql-database-sync-data.md).
                                                           
## My client agent doesn't work

### Description and symptoms

You get the following error messages when you attempt to use the client agent.

"Sync failed with exception There was an error while trying to deserialize parameter www.microsoft.com/.../05:GetBatchInfoResult. See InnerException for more details.

"Inner exception message: Type 'Microsoft.Synchronization.ChangeBatch' is an invalid collection type since it does not have a default constructor."


### Cause

This error is an issue with the SQL Data Sync (Preview).

The most likely cause of this issue is:

-   You are running Windows 8 Developer Preview, or

-   You have .NET 4.5 installed.

### Solution or workaround

Make sure that you install the client agent on a computer that is not running Windows 8 Developer Preview and that the .NET Framework 4.5 is not installed.

## My client agent doesn't work after I cancel the uninstall

### Description and symptoms

The client agent does not work even though you canceled its uninstallation.

### Cause

This issue occurs because SQL Data Sync (Preview) client agent does not store credentials.

### Solution or workaround

There are two solutions to try:

-   First, use services.msc to reenter your credentials for the client agent.

-   Second, uninstall this client agent and install a new one. Download and install the latest client agent from [Download Center](http://go.microsoft.com/fwlink/?linkid=221479).

## My database isn't listed in the agent dropdown

### Description and symptoms

When you attempt to add an existing SQL Server database to a sync group, the database is not listed in the dropdown.

### Cause

There are several possible causes for this issue:

-   The client agent and sync group are in different data centers.

-   The client agent's list of databases is not current.

### Solution

The solution depends upon the cause.

#### The client agent and sync group are in different data centers

You must have both the client agent and the sync group in the same data center. You can set up this configuration by doing one of the following things:

-   Create a new agent in the same data center as the sync group. Then register the database with that agent. See [How To: Install a SQL Data Sync (Preview) Client Agent](#install-a-sql-data-sync-client-agent) for more information.

-   Delete the current sync group. Then recreate it in the same data center as the agent.

#### The client agent's list of databases is not current

Stop and then restart the client agent service.
The local agent downloads the list of associated databases only on the first submission of the agent key, not on subsequent agent key submissions. Thus, databases registered during an agent move do not show up on the original agent instance.

## Client agent doesn't start (Error 1069)

### Description and symptoms

You discover that the agent isn't running on a computer hosting SQL Server. When you attempt to start the agent manually, you get an error dialog with the error message, "Error 1069: The service did not start due to a logon failure."

![Data Sync error 1069 dialog box](media/sql-database-troubleshoot-data-sync/sync-error-1069.png)

### Cause

A likely cause of this error is that the password on the local server has changed since you created the agent and gave it a login password.

### Solution or workaround

Update the agent's password to your current server password.

1. Locate the SQL Data Sync (Preview) client agent Preview service.

    a. Click **Start**.

    b. Type "services.msc" in the search box.

    c. In the search results, click "Services."

    d. In the **Services** window, scroll to the entry for **SQL Data Sync (Preview) Agent Preview**.

2. Right-click the entry and select **Stop**.

3. Right-click the entry and then click **Properties**.

4. In the **SQL Data Sync (Preview) Agent Preview Properties** window, click the **Log in** tab.

5. Enter your password in the Password textbox.

6. Confirm your password in the Confirm Password textbox.

7. Click **Apply** and then click **OK**.

8. In the **Services** window, right-click the **SQL Data Sync (Preview) Agent Preview** service, then click **Start**.

9. Close the **Services** window.

## I get a "disk out of space" message

### Cause

The "disk out of space" message can appear when files that should be deleted remain behind. This condition may occur due to antivirus software, or because files are open when the delete operations are attempted.

### Solution

The solution is to manually delete the sync files under `%temp%` (`del \*sync\* /s`), and then remove the subdirectories as well.

> [!IMPORTANT]
> Wait until the synchronization completes before you delete any files.

## I cannot delete my sync group

### Description and symptoms

You fail in your attempt to delete a sync group.

### Causes

Any of the following things can result in a failure to delete a sync group.

-   The client agent is offline.

-   The client agent is uninstalled or missing. 

-   A database is offline. 

-   The sync group is provisioning or synchronizing. 

### Solutions

To resolve the failure to delete a sync group, check the following things:

-   Be sure that the client agent is online then try again.

-   If the client agent is uninstalled or otherwise missing:

    a. Remove agent XML file from the SQL Data Sync (Preview) installation folder if the file exists.

    b. Install the agent on same/another on-premises computer, submit the agent key from the portal generated for the agent that's showing offline.

-   **The SQL Data Sync (Preview) service is stopped.**

    a. In the **Start** menu, search for Services.

    b. Click Services in the search results.

    c. Find the **SQL Data Sync (Preview) Preview** service.

    d. If the service status is **Stopped**, right-click the service name and select **Start** from the dropdown menu.

-   Check your SQL Databases and SQL Server databases to be sure they are all online.

-   Wait until the provisioning or synchronizing process finishes. Then retry deleting the sync group.

## Sync fails in the portal UI for on-premises databases associated with the client agent

### Description and symptoms

Sync fails on the SQL Data Sync (Preview) portal UI for on-premises databases associated with the agent. On the local computer running the agent, you see System.IO.IOException errors in the Event Log, stating that the disk has insufficient space.

### Solution or workaround

Create more space on the drive on which the %TEMP% directory resides.

## I can't unregister an on-premises SQL Server database

### Cause

Most likely you are trying to unregister a database that has already been deleted.

### Solution or workaround

To unregister an on-premises SQL Server database, select the database and click **Force Delete**.

If this operation fails to remove the database from the sync group, do the following things:

1. Stop and then restart the client agent host service.

    a. Click the Start menu.

    b. Enter *services.msc* in the search box.

    c. In the Programs section of the results pane double-click **Services**.

    d. Find and right-click the service **SQL Data Sync (Preview)**.

    e. If the service is running, stop it.

    f. Right-click and select **Start**.

    g. Check whether the database is no longer registered. If it is no longer registered, you're done. Otherwise proceed with the next step.

2. Open the client agent app (SqlAzureDataSyncAgent).

3. Click **Edit Credentials** and supply the credentials for the database so it is reachable.

4. Proceed with unregistration.

## I cannot submit the Agent Key

### Description and symptoms

After you create or recreate a key for an agent, you try to submit that key through the SqlAzureDataSyncAgent application, but the submission fails to complete.

![Sync Error dialog box - Can't submit agent key](media/sql-database-troubleshoot-data-sync/sync-error-cant-submit-agent-key.png)

Before proceeding, make sure a failure of one of the following conditions is not the cause of your issue.

-   The SQL Data Sync (Preview) Windows service is running.

-   The service account for SQL Data Sync (Preview) Preview Windows service has network access.

-   The client agent is able to contact the Locator Service. Check that the following registry key has the value "https://locator.sync.azure.com/LocatorServiceApi.svc"

    -   On an x86 computer: `HKEY\_LOCAL\_MACHINE\\SOFTWARE\\Microsoft\\SQL Azure Data Sync\\LOCATORSVCURI`

    -   On an x64 computer: `HKEY\_LOCAL\_MACHINE\\SOFTWARE\\Wow6432Node\\Microsoft\\SQL Azure Data Sync\\LOCATORSVCURI`

### Cause

The agent key uniquely identifies each local agent. The key must meet two conditions for it to work:

-   The client agent key on the SQL Data Sync (Preview) server and the local computer must be identical.

-   The client agent key can be used only once.

### Solution or workaround

If your agent is not working, it is because one or both of these conditions are not met. To get your agent to work again:

1. Generate a new key.

2. Apply the new key to the agent.

To apply the new key to the agent, do the following things:

1. Use File Explorer to navigate to your agent installation directory. The default installation directory is `c:\\program files (x86)\\microsoft sql data sync`.

2. Double-click the `bin` subdirectory.

3. Launch the `SqlAzureDataSyncAgent` application.

4. Click **Submit Agent Key**.

5. Paste the key from your clipboard in the space provided.

6. Click **OK**.

7. Close the program.

## I do not have sufficient privileges to start system services

### Cause

This error occurs in two situations:

-   The user name and/or the password are incorrect.

-   The specified user account does not have sufficient privileges to log on as a service.

### Solution or workaround

Grant log-on-as-a-service credentials to the user account.

1. Navigate to **Start | Control Panel | Administrative Tools|  Local Security Policy | Local Policy | User Rights Management**.

2. Find and click the **Log on as a service** entry.

3. Add the user account in the **Log on as a service Properties** dialog.

4. Click **Apply** then **OK**.

5. Close the windows.

## Local Sync Agent app is unable to connect to the local sync service

### Solution or workaround

Try the following steps:

1. Exit the app.

2. Open the Component Services Panel.

    a. In the search box on the taskbar, type "services.msc."

    b. Double-click "Services" in the search results.

3. Stop and then restart the "SQL Data Sync (Preview) Preview" service.

4. Restart the app.

## Install, uninstall, or repair fails

### Cause

There are many possible causes for the failure. To determine the specific cause for this failure, you need to look at the logs.

### Solution or workaround

To find the specific cause for the failure you experienced, you need to generate and look at the Windows Installer logs. You can turn on logging from the command line. For example, assume that the downloaded AgentServiceSetup.msi file is LocalAgentHost.msi. Generate and examine log files using the following command lines:

-   For installs: `msiexec.exe /i SQLDataSyncAgent-Preview-ENU.msi /l\*v LocalAgentSetup.InstallLog`

-   For uninstalls: `msiexec.exe /x SQLDataSyncAgent-se-ENU.msi /l\*v LocalAgentSetup.InstallLog`

You can also enable logging for all installations performed by Windows Installer. The Microsoft Knowledge Base article [How to enable Windows Installer logging](https://support.microsoft.com/help/223300/how-to-enable-windows-installer-logging) provides a one-click solution to turn on logging for Windows Installer. It also provides the location of these logs.

## A database has an "Out-of-Date" status

### Cause

SQL Data Sync (Preview) removes databases that have been offline for 45 days or more (as counted from the time the database went offline) from the service. If a database is offline for 45 days or more and then comes back online, its status is set to "Out-of-Date."

### Solution or workaround

You can avoid an "Out-of-Date" status by making sure that none of your databases go off line for 45 days or more.

If a database's status is "Out-of-Date", you need to do the following things:

1. Remove the "Out-of-Date" database from the sync group.

2. Add the database back in to the sync group.

> [!WARNING]
> You lose all changes made to this database while it was offline.

## A sync group has an "Out-of-Date" status

### Cause

If one or more changes fail to apply for the whole retention period of 45 days, a sync group can become outdated.

### Solution or workaround

To avoid an "Out-of-Date" status, examine the results of your sync jobs in the history viewer on a regular basis, and investigate and resolve any changes that fail to apply.

If a sync group's status is "Out-of-Date", you need to delete the sync group and recreate it.

## I see erroneous data in my tables

### Description and symptoms

If tables with the same name but from different schemas in a database are involved in sync, you see erroneous data in these tables after sync.

### Cause and Fix

The SQL Data Sync (Preview) provisioning process uses the same tracking tables for tables with the same name but in different schemas. As a result, changes from both tables are reflected in the same tracking table, and this behavior causing erroneous data changes during sync.

### Resolution or Workaround

Ensure that the names of tables involved in sync are different even if they belong to different schemas.

## I see inconsistent primary key data after a successful synchronization

### Description and symptoms

After a synchronization that is reported as successful, and the log shows no failed or skipped rows, you observe that primary key data is inconsistent among the databases in the sync group.

### Cause

This behavior is by design. Changes in any primary key column result in inconsistent data in the rows where the primary key was changed.

### Resolution or Workaround

To prevent this issue, ensure that no data in a primary key column is changed.

To fix this issue after it has occurred, you must drop the affected row from all endpoints in the sync group and then reinsert the row.

## I see a significant degradation in performance

### Description and symptoms

Your performance degrades significantly, possibly to the point where you cannot even launch the Data Sync UI.

### Cause

The most likely cause is a synchronization loop. A synchronization loop occurs when a synchronization by sync group A triggers a synchronization by sync group B, which in turn triggers a synchronization by sync group A. The actual situation may be more complex, involving more than two sync groups in the loop, but the significant factor is that there is a circular triggering of synchronizations caused by sync groups overlapping one another.

### Resolution or Workaround

The best fix is prevention. Ensure that you do not have circular references in your sync groups. Any row that is synchronized by one sync group cannot be synchronized by another sync group.

## Client agent cannot be deleted from the portal if its associated on-premises database is unreachable

### Description and symptoms

If a local end point (that is, a database) that is registered with a SQL Data Sync (Preview) client agent becomes unreachable, the client agent cannot be deleted.

### Cause

The local agent cannot be deleted because the unreachable database is still registered with the agent. When you try to delete the agent, the deletion process tries to reach the database, which fails.

### Resolution or Workaround

Use "force delete" to delete the unreachable database.

> [!NOTE]
> If after a "force delete" sync metadata tables remain use deprovisioningutil.exe to clean them up.

## A sync group cannot be deleted within three minutes of uninstalling/stopping the Agent

### Description and symptoms

You are not able to delete a sync group within three minutes of uninstalling/stopping the associated SQL Data Sync (Preview) client agent.

### Resolution or Workaround

1. Remove a sync group while the associated sync agents are online (recommended).

2. If the agent is offline but installed, bring it online on the on-premises computer. Then wait for the status of the agent to appear as online in SQL Data Sync (Preview) portal, and remove the sync group.

3. If the agent is offline because it was uninstalled, do the following things. Then try deleting the sync group.

    a.  Remove the agent XML file from the SQL Data Sync (Preview) installation folder if the file exists.

    b.  Install the agent on same or another on-premises computer, submit the agent key from the portal generated for the agent that's showing offline.

## My sync group is stuck in the processing state

### Description and symptoms

A sync group in SQL Data Sync (Preview) has been in the processing state for a long period of time, does not respond to the stop command, and the logs show no new entries.

### Causes

Any of the following conditions can result in a sync group being stuck in the processing state.

-   **The client agent is offline.** Be sure that the client agent is online then try again.

-   **The client agent is uninstalled or missing.** If the client agent is uninstalled or otherwise missing:

    1. Remove agent XML file from the SQL Data Sync (Preview) installation folder if the file exists.

    2. Install the agent on same/another on-premises computer. Then submit the agent key from the portal generated for the agent that's showing as offline.

-   **The SQL Data Sync (Preview) service is stopped.**

    1. In the **Start** menu, search for Services.

    2. Click Services in the search results.

    3. Find the **SQL Data Sync (Preview)** service.

    4. If the service status is **Stopped**, right-click the service name and select **Start** from the dropdown menu.

### Solution or workaround

If you are unable to fix the problem, the status of your sync group can be reset by Microsoft support. In order to have your status reset, create a forum post on the [Azure SQL Database forum](https://social.msdn.microsoft.com/Forums/azure/home?forum=ssdsgetstarted), and include your subscription ID and the sync group ID for the group that needs to be reset. A Microsoft support engineer will respond to your post and let you know when the status has been reset.

## Next steps
For more info about SQL Data Sync, see:

-   [Sync data across multiple cloud and on-premises databases with Azure SQL Data Sync](sql-database-sync-data.md)
-   [Set up Azure SQL Data Sync](sql-database-get-started-sql-data-sync.md)
-   [Best practices for Azure SQL Data Sync](sql-database-best-practices-data-sync.md)
-   [Monitor Azure SQL Data Sync with OMS Log Analytics](sql-database-sync-monitor-oms.md)

-   Complete PowerShell examples that show how to configure SQL Data Sync:
    -   [Use PowerShell to sync between multiple Azure SQL databases](scripts/sql-database-sync-data-between-sql-databases.md)
    -   [Use PowerShell to sync between an Azure SQL Database and a SQL Server on-premises database](scripts/sql-database-sync-data-between-azure-onprem.md)

-   [Download the SQL Data Sync REST API documentation](https://github.com/Microsoft/sql-server-samples/raw/master/samples/features/sql-data-sync/Data_Sync_Preview_REST_API.pdf?raw=true)

For more info about SQL Database, see:

-   [SQL Database Overview](sql-database-technical-overview.md)
-   [Database Lifecycle Management](https://msdn.microsoft.com/library/jj907294.aspx)
