---
title: Manage sql server using Azure Automation
description: This article tells how to use Azure SQL server using a system assinged managed identity
services: automation
ms.date: 06/26/2023
ms.topic: conceptual
---

# Manage Azure SQL server using an identity account

This article describes the process to manage the SQL server using the Azure Automation account.

## Scenario: Manage SQL server using Azure Automation

### Issue

Connect to Azure SQL using an identity account

### Resolution

1. When a SQL server is running behind a firewall, the Azure Automation Runbook must run from a Hybrid Runbook Worker that is in your own network so that the IP address or network isn't blocked by the firewall. For more information, see [create hybrid worker group](extension-based-hybrid-runbook-worker-install.md#create-hybrid-worker-group).
1. When you use a hybrid worker group (node), the modules that your runbook/Powershell uses, must be installed locally from an elevated PowerShell prompt. For example - `Install-module Az.Accounts` and `Install-module SqlServer`. To find the required module names, run a command on each cmdlet and then check the source for `Connect-AzAccounts` which is part of Az.Account module - `get-command Connect-AzAccount`
1. To allow access from the Automation system managed identity to the Azure SQL database, follow these steps:
    - If the Automation System Managed Identity is **OFF**:
      - Go to Azure portal home page, select your Automation Account. 
      - In the Automation account page, under **Account Settings**, select **Identity**.
      - Under the **System assigned** tab, select the status as **ON**.
    - After the System Managed Identity is **ON**, you must provide the account the required access by following these steps:
      - In the Automation account | Identity page, System assigned tab, under permissions, select **Azure role assignments**.
      - In the Azure role assignments page, select **+Add role assignment (Preview)**.
      - In the **Add role assignment (Preview)**, select the **Scope** as *SQL*, select the **Subscription**, **Resource** from the drop-down and **Role** as *Owner*. Select **Save**.
    - You must configure the SQL server for AD authentication
      - *Home > SQL Servers > azuresqlserverxyz | Azure Active Directory* `set Admin` to confirm that the AD admin is configured.
    - You must add authentication on the SQL side:
      - Go to Azure portal home page, select SQL Servers.
      - In the SQL server page, under **Settings**, select **SQL Databases**.
      - In MyDBxyz| SQL databases page (azuresqlserverxyz/MyDBxyz) `CREATE USER "AutomationAccountXZY" FROM EXTERNAL PROVIDER WITH OBJECT_ID='########-####-####-####-############' EXEC sp_addrolemember 'db_owner', "AutomationAccountXZY"` 
        - OBJECT_ID is from (Home > Automation Accounts > AutomationAccountXYZ | Identity) 
        - System Assigned" "Object (principal) ID"
        - AutomationAccountXYZ - replace with your Automation account name.
        - azuresqlserverxyz - replace with your Azure SQL server
        - MyDBxyz - replace with your Database table name
        - ########-####-####-####-############  - replace with object ID for your system managed identity principal (Home > automation Accounts > automationaccountxyz | identity).
    - See the sample code provided to connect to Azure SQL Server:
    
      ```sql
      if ($($env:computerName) -eq "Client") {"Runbook running on Azure Client sandbox"} else {"Runbook running on " + $env:computerName}
      Disable-AzContextAutosave -Scope Process
      Connect-AzAccount -Identity
      $Token = (Get-AZAccessToken -ResourceUrl https://database.windows.net).Token
      Invoke-Sqlcmd -ServerInstance azuresqlserverxyz.database.windows.net -Database MyDBxyz -AccessToken $token -query 'select * from TableXYZ' 
      ```
    - Check permissions on the SQL side
      - Display account permission
      ```sql
      SELECT roles.[name] as role_name, members.name as [user_name]
      from sys.database_role_members
      Join sys.database_principals roles on database_role_members.role_principal_id= roles.principal_id
      join sys.database_principals members on database_role_members.member_principal_id=members.principal_id
      Order By
      roles.[name], members.[name]
      ```
    > [!NOTE]
    > We recommend that you add the following code at the top of any runbook that’s intended to run on a Hybrid worker:`if ($($env:computerName) -eq "CLIENT") {"Runbook running on Azure CLIENT"} else {"Runbook running on " + $env:computerName}` This code allows you to see the node it’s running on. And if you accidentally run it on Azure Cloud instead of the Hybrid worker, then it helps you determine why the runbook didn’t work.



## Next steps

* For details of credential use, see [Manage credentials in Azure Automation](shared-resources/credentials.md).
* For information about modules, see [Manage modules in Azure Automation](shared-resources/modules.md).
* If you need to start a runbook, see [Start a runbook in Azure Automation](start-runbooks.md).
* For PowerShell details, see [PowerShell Docs](/powershell/scripting/overview).