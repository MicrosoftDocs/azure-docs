---
title: Create a custom account with minimal metadata for discovery and assessment.
description: Describes how to create a custom account with minimal metadata for discovery and assessment.
author: ajaypartha95
ms.author: ajaypar
ms.manager: roopesh.nair
ms.topic: how-to
ms.service: azure-migrate
ms.date: 08/02/2023
ms.custom: engagement-fy23
---

# Provision custom logins with least privileges for SQL Discovery and Assessment

This article describes how to create a custom account with minimal permissions for Discovery and assessment.

In preparation for discovery, the Azure Migrate appliance needs to be configured with the accounts for establishing connections with the SQL Server instances. If you prefer not to use an account with sysadmin privileges on the SQL instance for this purpose, the least privileged account provisioning utility can help create a custom account with the [minimal set of permissions](migrate-support-matrix-vmware.md#configure-the-custom-login-for-sql-server-discovery) required to obtain the necessary metadata for discovery and assessment. Once the custom account has been provisioned, add this account in the Appliance configuration for SQL Discovery and Assessment.

## Prerequisites
- A prepared CSV with the list of SQL Server instances. Ensure all SQL Servers listed have [TCP/IP protocol enabled](https://learn.microsoft.com/sql/database-engine/configure-windows/enable-or-disable-a-server-network-protocol?view=sql-server-ver16). 
- An account with sysadmin permissions on all the SQL Server instances listed in the CSV. 

   > [!Note]
   > - This account is used only to provision the least privileged account. Once the least privileged account is created, it can be provided in the Appliance configuration for the actual discovery and assessment. 
   > - If there are multiple admin-level accounts that you wish to use, the utility can be run any number of times with the same input values by changing only the admin-level credential. 

## Prepare the list of SQL Server instances
The utility requires the SQL Server instances list to be created as a CSV with the following columns in the stated order:
1.	FqdnOrIpAddress (Mandatory): This field should contain the Fully Qualified Domain Name or IP Address of the server where the SQL Server instance is running.
2.	InstanceName (Mandatory): This field should contain the instance name for a named instance or MSSQLSERVER for a default instance.
3.	Port (Mandatory): The port that the SQL Server is listening on. 
4.	Status (Optional/Output): This field is to be left blank initially. Any value here other than Success will allow the utility to attempt to provision the least privileged account against the corresponding instance. Success or failure is then updated in this field at the end of execution. 
5.	ErrorSummary (Optional/Output): This field is updated by the utility to provide details of the errors (if any) that were encountered while provisioning the least privileged account.
6.	ErrorGuidance (Optional/Output): This field is used by the utility to provide details of the errors (if any) that were encountered while provisioning the least privileged account.

## Provision the custom accounts

1.	Open a command prompt and navigate to the %ProgramFiles%\Microsoft Azure Appliance Configuration Manager\Tools folder.
2.	Launch the Least Privileged Account Provisioning utility using the command:
    `SQLMinPrivilege.exe`
3.	Provide the path to the CSV list of SQL Server instances. 
4.	Provide the credentials of the account with admin-level permissions.
    1. Select the credential type by entering 1 for SQL Account or 2 for Windows/Domain Account.
    2. Provide the username and password for the admin-level account
5.	Now provide the credentials for the least privileged account that needs to be created.
    1. Select the credential type by entering 1 for SQL Account or 2 for Windows/Domain Account.
    2. If you chose to create a SQL Account in the previous step, you'll be notified that if an SQL Server instance in the list doesn't have SQL Authentication enabled, the script can optionally provision the account anyway and enable SQL Authentication. However, the instance needs to be restarted for the newly provisioned SQL Account to be used. If you don't want to proceed with SQL Account provisioning, enter *N* or *n* to go back to the previous step and choose the credential type again.
    3. Provide the username and password for the least privileged account to be provisioned.
6.	If there are additional admin-level credentials to be used, start again at Step 2 with the same CSV file. The utility ignores instances, which have already been successfully configured. 

> [!Note]
> We recommend using the same least privileged account credentials to simplify the configuration of the Azure Migrate Appliance.

### Use custom login for discovery and assessment
Now that the custom login has been provisioned, provide this credential in the Appliance configuration.

## Next steps

Learn how to [assess servers running SQL Server to migrate to Azure SQL](tutorial-assess-sql.md).
