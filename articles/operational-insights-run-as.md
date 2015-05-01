<properties 
   pageTitle="Operations Manager run-as accounts for Operational Insights"
   description="Learn about how to configure Operations Manager run-as accounts that you use with Operational Insights"
   services="operational-insights"
   documentationCenter=""
   authors="bandersmsft"
   manager="jwhit"
   editor="tysonn" />
<tags 
   ms.service="operational-insights"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/30/2015"
   ms.author="banders" />

# Operations Manager run-as accounts for Operational Insights

[AZURE.INCLUDE [operational-insights-note-moms](../includes/operational-insights-note-moms.md)]

Microsoft Azure Operational Insights uses the Operations Manager agent and management group to collect and send data to the Operational Insights service. Operational Insights builds upon management packs for workloads to provide value-add services. Each workload requires workload-specific privileges to run management packs in a different security context, such as a domain account. You need to provide credential information by configuring an Operations Manager Run As account.

The following sections describe how to set Operations Manager run-as accounts for the following workloads:

- SQL Assessment
- Virtual Machine Manager
- Lync Server
- SharePoint

## Set the Run As account for SQL assessment

 If you are already using the SQL Server management pack, you should use that Run As account.

### To configure the SQL Run As account in the Operations console

1. In Operations Manager, open the Operations console, and then click **Administration**.

2. Under **Run As Configuration**, click **Profiles**, and open **Operational Insights SQL Assessment Run As Profile**.

3. On the **Run As Accounts** page, click **Add**.

4. Select a Windows Run As account that contains the credentials needed for SQL Server, or click **New** to create one.
	>[AZURE.NOTE] The Run As account type must be Windows. The Run As account must also be part of Local Administrators group on all Windows Servers hosting SQL Server Instances.

5. Click **Save**.

6. Modify and then execute the following T-SQL sample on each SQL Server Instance to grant minimum permissions required to Run As Account to perform SQL Assessment. However, you don’t need to do this if a Run As Account is already part of the sysadmin server role on SQL Server Instances.

---
    -- Replace <UserName> with the actual user name being used as Run As Account.
    USE master
    
    -- Create login for the user, comment this line if login is already created.
    CREATE LOGIN [<UserName>] FROM WINDOWS
    
    -- Grant permissions to user.
    GRANT VIEW SERVER STATE TO [<UserName>]
    GRANT VIEW ANY DEFINITION TO [<UserName>]
    GRANT VIEW ANY DATABASE TO [<UserName>]
    
    -- Add database user for all the databases on SQL Server Instance, this is required for connecting to individual databases.
    -- NOTE: This command must be run anytime new databases are added to SQL Server instances.
    EXEC sp_msforeachdb N'USE [?]; CREATE USER [<UserName>] FOR LOGIN [<UserName>];'

### To configure the SQL Run As account using Windows PowerShell

Open a PowerShell window and run the following script after you’ve updated it with your information:

    
    import-module OperationsManager
    New-SCOMManagementGroupConnection "<your management group name>"
     
    $profile = Get-SCOMRunAsProfile -DisplayName "Operational Insights SQL Assessment Run As Profile"
    $account = Get-SCOMrunAsAccount | Where-Object {$_.Name -eq "<your run as account name>"}
    Set-SCOMRunAsProfile -Action "Add" -Profile $Profile -Account $Account

## Set the Run As account for Virtual Machine Manager

Ensure that the Run As account has privileges for the following actions:

- To use the VMM Windows PowerShell module

- To query the VMM database

- To remotely administer the VMM agents running on virtualization hosts

Use the following steps to set the account when you connect Operational Insights to Operations Manager.

### To set credentials for VMM

1. In Operations Manager, open the Operations console, and then click **Administration**.

2. Under **Run As Configuration**, click **Profiles**, and open **Operational Insights VMM Run As Account**.

3. On the **Run As Accounts** page, click **Add**.

4. Select a Windows Run As account that contains the credentials needed for VMM, or click **New** to create one.
	>[AZURE.NOTE] The Run As account type must be Windows.

5. Click **Save**.


## Set the Run As account for Lync Server

 The Run As account needs to be a member of both the local Administrators and the Lync RTCUniversalUserAdmins security groups.

### To set credentials for a Lync account

1. In Operations Manager, open the Operations console, and then click **Administration**.

2. Under **Run As Configuration**, click **Profiles**, and open **Operational Insights Lync Run As Account**.

3. On the **Run As Accounts** page, click **Add**.

4. Select a Windows Run As account that is a member of both the Local Administrators and the Lync RTCUniversalUserAdmins security groups. 
	>[AZURE.NOTE] The Run As account type must be Windows.

5. Click **Save**.


## Set the Run As account for SharePoint


### To set credentials for a SharePoint account

1. In Operations Manager, open the Operations console, and then click **Administration**.

2. Under **Run As Configuration**, click **Profiles**, and open **Operational Insights SharePoint Run As Account**.

3. On the **Run As Accounts** page, click **Add**.

4. Select a Windows Run As account that contains the credentials needed for SharePoint, or click **New** to create one. 
	>[AZURE.NOTE] The Run As account type must be Windows.

5. Click **Save**.

