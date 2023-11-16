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

# Provision custom accounts with least privileges for SQL Discovery and Assessment

This article describes how to create a custom account with minimal permissions for Discovery and assessment.

In preparation for discovery, the Azure Migrate appliance needs to be configured with the accounts for establishing connections with the SQL Server instances. If you prefer to avoid using accounts with sysadmin privileges, a custom account with [minimal set of permissions](migrate-support-matrix-vmware.md#configure-the-custom-login-for-sql-server-discovery) required to obtain the necessary metadata for discovery and assessment can be created. Add this custom account in the Appliance configuration for SQL Discovery and Assessment. The least privileged account provisioning utility can help provision these custom accounts.

## Prerequisites
- A prepared CSV with the list of SQL Server instances. Ensure all SQL Servers listed have [TCP/IP protocol enabled](/sql/database-engine/configure-windows/enable-or-disable-a-server-network-protocol). 
- Accounts with sysadmin permissions on all the SQL Server instances listed in the CSV.

   > [!Note]
   > - The admin-level account is used only to provision the least privileged account. Once the least privileged account is created, it can be provided in the Appliance configuration for the actual discovery and assessment. 
   > - If multiple admin-level accounts will be required, use the same CSV file to run the utility again with the next admin-level credential. The instances that have already been successfully updated will be skipped. Repeat this with different admin-level credentials until all sql instances have the *Status* field set to *Success*. 

## Prepare the list of SQL Server instances
The utility requires the SQL Server instances list to be created as a CSV with the following columns in the stated order:
1.	FqdnOrIpAddress (Mandatory): This field should contain the Fully Qualified Domain Name (or optionally the IP Address for SQL Server authentication) of the server where the SQL Server instance is running.
2.	InstanceName (Mandatory): This field should contain the instance name for a named instance or MSSQLSERVER for a default instance.
3.	Port (Mandatory): The port that the SQL Server is listening on. 
4.	Status (Optional/Output): This field is to be left blank initially. Any value here other than Success allows the utility to attempt to provision the least privileged account against the corresponding instance. Success or failure is then updated in this field at the end of execution. 
5.	ErrorSummary (Optional/Output): Leave blank. The utility updates this field with summary of the errors (if any) that were encountered while provisioning the least privileged account.
6.	ErrorGuidance (Optional/Output): Leave blank. The utility updates this field with detailed error messages (if any) that were encountered while provisioning the least privileged account.

## Provision the custom accounts

1.	Open a command prompt and navigate to the %ProgramFiles%\Microsoft Azure Appliance Configuration Manager\Tools folder.
1.	Launch the Least Privileged Account Provisioning utility using the command:
    `SQLMinPrivilege.exe`
1.	Provide the path to the CSV list of SQL Server instances. 
1.  Provide a unique identifier(GUID) for creation of a custom security identifier(SID) for the custom account. We recommend that you use the same well known GUID for all executions of the utility. For example, you can use the Azure Subscription ID.
1.	Provide the credentials of the account with admin-level permissions.
    1. Select the credential type by entering 1 for *SQL Account* or 2 for *Windows/Domain Account*.
    1. Provide the username and password for the admin-level account
1.	Now provide the credentials for the least privileged account that needs to be created.
    1. Select the credential type by entering 1 for *SQL Account* or 2 for *Windows/Domain Account*.
    1. If you chose *SQL Account* in the previous step, the SQL Server instances in the list should have SQL Server authentication (Mixed Mode) enabled. If a SQL Server instance in the list doesn't have SQL Authentication enabled, the script can optionally provision the account anyway and enable SQL Authentication. However, the instance needs to be restarted before the new SQL Account can be used. If you don't want to proceed with SQL Account provisioning, enter *N* or *n* to go back to the previous step and choose the credential type again.
    1. Provide the username and password for the least privileged account to be provisioned.
1.	If there are more admin-level credentials to be used, start again with the same CSV file. The utility skips instances that are successfully configured. 

> [!Note]
> We recommend using the same least privileged account credentials to simplify the configuration of the Azure Migrate Appliance.

### Use custom account for discovery and assessment
Now that the custom account is provisioned, provide this credential in the Appliance configuration.

## Next steps

Learn how to [assess servers running SQL Server to migrate to Azure SQL](tutorial-assess-sql.md).
