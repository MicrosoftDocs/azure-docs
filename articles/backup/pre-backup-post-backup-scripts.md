---
title: Using Pre-Backup and Post-Backup Scripts
description: This article contains the procedure to specify pre-backup and post-backup scripts. Azure Backup Server (MABS).
ms.topic: conceptual
ms.date: 07/06/2021
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Using pre-backup and post-backup scripts

Applies to: Microsoft Azure Backup Server (MABS)

A _pre-backup script_ is a script that resides on the protected computer, is executed before each MABS backup job, and prepares the protected data source for backup.

A _post-backup script_ is a script that runs after a MABS backup job to do any post-backup processing, such as bringing a virtual machine back online.

When you install a protection agent on a computer, a ScriptingConfig.xml file is added to the _install path_ \Microsoft Data Protection Manager\DPM\Scripting folder on the protected computer. For each protected data source on the computer, you can specify a pre-backup script and a post-backup script in ScriptingConfig.xml.

>[!Note]
>The pre-backup and post-backup scripts can’t be VBScripts. Instead, you must use a wrapper command around your script containing **cscript myscript.vbs**.

When MABS runs a protection job, ScriptingConfig.xml on the protected computer is checked. If a pre-backup script is specified, MABS runs the script and then completes the job. If a post-backup script is specified, MABS completes the job and then runs the script.

>[!Note]
>Protection jobs include replica creation, express full backup, synchronization, and consistency check.

MABS runs the pre-backup and post-backup scripts by using the local system account. As a best practice, you should ensure that the scripts have Read and Execute permissions for the administrator and local system accounts only. This level of permissions prevents unauthorized users to modify the scripts.

**ScriptingConfig.xml**

```
<?xml version="1.0" encoding="utf-8"?>
<ScriptConfiguration xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
xmlns="http://schemas.microsoft.com/2003/dls/ScriptingConfig.xsd">
   <DatasourceScriptConfig DataSourceName="Data source">
     <PreBackupScript>”Path\Script Parameters” </PreBackupScript>
     <PostBackupScript>"Path\Script Parameters” </PostBackupScript>
     <TimeOut>30</TimeOut>
   </DatasourceScriptConfig>
</ScriptConfiguration>
```

To specify pre-backup and post-backup scripts

1. On the protected computer, open the ScriptingConfig.xml file with an XML or text editor.

   >[!Note]
   >The DataSourceName attribute must be provided as **Drive:** (for example, D: if the data source is on the D drive).

1. For each data source, complete the DatasourceScriptConfig element as follows:


   1. For the DataSourceName attribute, enter the data source volume (for file data sources) or name (for all other data sources). The data source name for application data should be in the form of _Instance\Database_ for SQL, _Storage group name_ for Exchange, _Logical Path\Component Name_ for Virtual Server, and _SharePoint Farm\SQL Server Name\SQL Instance Name\SharePoint Config DB_ for Windows SharePoint Services.
   1. In the _PreBackupScript_ tag, enter the path and script name.
   1. In the _PreBackupCommandLine_ tag, enter command-line parameters to be passed to the scripts, separated by spaces.
   1. In the _PostBackupScript_ tag, enter the path and script name.
   1. In the _PostBackupCommandLine_ tag, enter command-line parameters to be passed to the scripts, separated by spaces.
   1. In the _TimeOut_ tag, enter the amount of time in minutes that MABS should wait after invoking a script before timing out and marking the script as failed.

1. Save the ScriptingConfig.xml file.

>[!Note]
>MABS will suffix an additional Boolean (true/false) parameter to the post-backup script command, indicating the status of the MABS backup job.
