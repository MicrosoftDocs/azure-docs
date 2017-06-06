---
title: Use MySQL databases as PaaS on Azure Stack | Microsoft Docs
description: Learn how you can deploy the MySQL Resource Provider and provide MySQL databases as a service on Azure Stack
services: azure-stack
documentationCenter: ''
author: JeffGoldner
manager: byronr
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 4/6/2017
ms.author: JeffGo

---

# Use MySQL databases as PaaS on Azure Stack

> [!NOTE]
> The following information only applies to Azure Stack TP3 Refresh deployments. TP3 Refresh now uses the current release of MySQL 5.7.
>
>

You can deploy a MySQL resource provider on Azure Stack. After you deploy the resource provider, you can create MySQL servers and databases through Azure Resource Manager deployment templates and provide MySQL databases as a service. MySQL databases, which are common on web sites, support many website platforms. As an example, after you deploy the resource provider, you can create WordPress websites from the Azure Web Apps platform as a service (PaaS) add-on for Azure Stack.

To deploy the MySQL provider on a system that does not have internet access, you can copy the files  [mysql-5.7.17-winx64.zip](https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.17-winx64.zip) and [mysql-connector-net-6.9.9.msi](https://dev.mysql.com/get/Downloads/Connector-Net/mysql-connector-net-6.9.9.msi) to a local share and provide that share name when prompted (see below).

> [!NOTE]
> The deployment script will perform retries, if necessary, to accommodate less reliable network connections or if an operation exceeds a timeout.
>
>

## Steps to deploy the resource provider

1. If you have not already done so, create a [Windows Server 2016 image with the .NET 3.5 runtime](https://docs.microsoft.com/azure/azure-stack/azure-stack-add-default-image) installed.

    > [!NOTE]
    > The .NET 3.5 runtime is not required for this RP, but will be used for the SQL Resource Provider, so you can save space by using the same image.
    >
    >

2. If you have installed any version of the AzureRm PowerShell module other than 1.2.9, you will need to remove it or the install will block.

3. [Download the MySQL resource provider binaries file](https://aka.ms/azurestackmysqlrptp3) and extract it on the Console VM in your Azure Stack.

4. Open a **new** elevated PowerShell console and change to the directory where you extracted the files. Use a new window to avoid problems that may arise from incorrect PowerShell modules already loaded on the system.

5. Run DeployMySqlProvider.ps1.

This script will do all of the following:

* If necessary, download a compatible version of Azure PowerShell (only AzureRm version 1.2.9 is supported).
* Create a wildcard certificate to secure communication between the resource provider and Azure Resource Manager.
* Download the MySQL binaries.
* Upload the certificate and all other artifacts to an Azure Stack storage account.
* Publish gallery packages so that you can deploy MySQL resources through the gallery.
* Deploy a virtual machine (VM) that will host both your resource provider, and a MySQL 5.7 server.
* Register a local DNS record that will map to your resource provider VM.
* Register your resource provider with the local Azure Resource Manager.

Either specify at least the required parameters on the command line, or, if you run without any parameters, you will be prompted to enter them. 

Here's an example you can run from the PowerShell prompt (but change the account information and portal endpoints as needed):

```
$vmLocalAdminPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force
$vmLocalAdminCreds = New-Object System.Management.Automation.PSCredential ("mysqlrpadmin", $vmLocalAdminPass)

$AdminPass = ConvertTo-SecureString "P@ssw0rd1" -AsPlainText -Force
$AdminCreds = New-Object System.Management.Automation.PSCredential ("admin@mydomain.onmicrosoft.com", $AdminPass)

.\DeployMySQLProvider.ps1 -DirectoryTenantID "51377b64-4a17-46b1-83ff-902d97c50b22" -AzCredential $AdminCreds -VMLocalCredential $vmLocalAdminCreds -ResourceGroupName "System.MySql" -VmName "SystemMySqlRP" -ArmEndpoint "https://adminmanagement.local.azurestack.external" -TenantArmEndpoint "https://management.local.azurestack.external"
 ```

### Parameters


| Parameter Name | Description | Comment or Default Value |
| --- | --- | --- |
| **DirectoryTenantID** | The Azure or ADFS Directory ID (guid) | _required_ |
| **ArmEndpoint** | The Azure Stack Administrative ARM Endpoint | _required_ |
| **TenantArmEndpoint** | The Azure Stack Tenant ARM Endpoint | _required_ |
| **AzCredential** | Azure Stack Service Admin account credential (use the same account as you used for deploying Azure Stack) | _required_ |
| **VMLocalCredential** | The local administrator account of the MySQL resource provider VM | _required_ |
| **ResourceGroupName** | Resource Group for the items created by this script | Default: Microsoft-MySQL-RP1 |
| **VmName** | Name of the VM holding the resource provider | mysqlvm |
| **AcceptLicense** | Prompts to accept the GPL License Accept the terms of the GPL License (http://www.gnu.org/licenses/old-licenses/gpl-2.0.html) | Yes |
| **DependencyFilesLocalPath** | Path to a local share containing the MySQL files [mysql-5.7.17-winx64.zip](https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.17-winx64.zip) and [mysql-connector-net-6.9.9.msi](https://dev.mysql.com/get/Downloads/Connector-Net/mysql-connector-net-6.9.9.msi) | _leave blank to download from the internet_ |
| **MaxRetryCount** | Each operation will be retried if there is a failure | 2 |
| **RetryDuration** | Timeout between retries, in seconds | 120 |
| **Uninstall** | Clean up the resource provider | No |
| **DebugMode** | Prevents automatic clean up on failure | No |


Depending on the system performance and download speeds, installation may take as little as 20 minutes or as long as several hours. You may need to refresh the admin portal if the MySQLAdapter blade is not available.

> [!NOTE]
> If the installation takes more than 90 minutes, it may fail and you will see a failure message on the screen and in the log file, but the deployment will be retried from the failing step. Systems that do not meet the minimum required memory and core specifications may not be able to deploy the MySQL RP.
>
>

## Provide capacity by connecting it to a MySQL hosting server

1. Sign in to the Azure Stack POC portal as a service admin

2. Click **Resource Providers** &gt; **MySQLAdapter** &gt; **Hosting Servers** &gt; **+Add**.

	The **MySQL Hosting Servers** blade is where you can connect the MySQL Server Resource Provider to actual instances of MySQL Server that serve as the resource provider’s backend.

	![Hosting Servers](./media/azure-stack-mysql-rp-deploy/mysql-add-hosting-server-2.png)

3. Fill the form with the connection details of your MySQL Server instance. You must provide the fully-qualified domain name (FQDN) or a valid IPv4 address, and not the short VM name. By default, a preconfigured MySQL 5.7 Server called “mysqlvm.local.cloudapp.azurestack.external” with the administrator user name and the password you provided in the "LocalCredential" parameter is running on the VM.


The size provided helps the resource provider manage the database capacity. It should be close to the physical capacity of the database server.


## Create your first MySQL database to test your deployment

> [!NOTE]
> After the installation script completes, it can take up to 60 minutes for all of the virtual machines to finish configuration. If you attempt the next steps before this completes, you will see failures.
>
>

1. Sign in to the Azure Stack POC portal as service admin.

2. Click the **+ New** button &gt; **Data + Storage** &gt; **MySQL Database (preview)**.

3. Fill in the form with the database details.

![Create a test MySQL database](./media/azure-stack-mysql-rp-deploy/mysql-create-db.png)


**New.** The connections string will include the real database server name. Copy it from the portal.

![Get the connection string for the MySQL database](./media/azure-stack-mysql-rp-deploy/mysql-db-created.png)

> The combined length of the user and server names cannot exceed 31 characters with MySQL 5.7 or 15 characters in earlier editions, in addition to the '@' sign. This is a limitation of the MySQL implementations.
>

## Add Capacity

Add Capacity by adding additional MySQL servers in the Azure Stack portal. If you wish to use another instance of MySQL, click **Resource Providers** &gt; **MySQLAdapter** &gt; **MySQL Hosting Servers** &gt; **+Add**.


## Making SQL databases available to tenants ##
Create plans and offers to make MySQL databases available for tenants. You will need to add the Microsoft.MySqlAdapter service, add a new quota, and accept the default values.

![Create plans and offers to include databases](./media/azure-stack-mysql-rp-deploy/mysql-new-plan.png)


## Next steps


Try other [PaaS services](azure-stack-tools-paas-services.md) like the [SQL Server resource provider](azure-stack-sql-resource-provider-deploy.md) and the [App Services resource provider](azure-stack-app-service-overview.md).
