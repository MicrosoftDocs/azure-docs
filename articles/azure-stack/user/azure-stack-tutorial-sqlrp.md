---
title: Add SQL Resource Provider and Databases| Microsoft Docs
description: Learn how to create a SQL Server resource provider host computer and create SQL databases with Azure Stack.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 09/12/2018
ms.author: jeffgilb
ms.reviewer: jeffgo
ms.custom: mvc

---

# Tutorial: create a SQL resource provider host and create SQL databases

As an Azure Stack tenant user, you can configure server VMs to host SQL Server databases. After a SQL Hosting Server is correctly created and managed by Azure Stack, users can then easily create SQL databases.

This tutorial shows how to use an Azure Stack quickstart template to create a SQL Server AlwaysOn two VM availablity group, add it as an Azure Stack SQL Hosting Server, and then create a highly available SQL database.

What you will learn:

> [!div class="checklist"]
> * Create a SQL Server AlwaysOn availability group from a template
> * Create an Azure Stack SQL Hosting Server
> * Create a highly available SQL database

In this tutorial, a SQL Server AlwaysOn availablity group will be created and configured using availabe Azure Stack marketplace items. Before starting the steps in this tutorial, ensure that the Azure Stack operator has made the following items are available in the Azure Stack marketplace:

- [Windows Server 2016 Datacenter](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.WindowsServer) marketplace image.
- SQL Server 2016 SP1 or SP2 (Enterprise, Standard, or Developer) on Windows Server 2016 server image. This tutorial uses the [SQL Server 2016 SP2 Enterprise on Windows Server 2016](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft.sqlserver2016sp2enterprisewindowsserver2016) marketplace image.
- [SQL Server IaaS Extension](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-agent-extension) version 1.2.30 or higher. The SQL IaaS Extension installs necessary components that are required by the Marketplace SQL Server items (all Windows versions). It enables SQL-specific settings to be configured on SQL virtual machines. If the extension is not installed in the local Marketplace, provisioning of SQL will fail.
- [Custom script extension for Windows](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.CustomScriptExtension) version 1.9.1 or higher. Custom Script Extension is a tool that can be used to automatically launch and execute VM customization tasks post configuration. This is required for the Azure Stack quickstart template to be used.
- [PowerShell Desired State Configuration (DSC)](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.DSC-arm) version 2.76.0.0 or higher. DSC is a management platform in Windows PowerShell that enables deploying and managing configuration data for software services and managing the environment in which these services run. This is reqired for the Azure Stack quickstart template to be used.

  > [!TIP]
  > You won't be able to see the SQL Server IaaS extension, custom script extension, or PowerSHell DSC marketplace items when creating a VM from the user portal. Contact your Azure Stack Operator to ensure these items have been downloaded from Azure before beginning the steps in this tutorial.

To learn more about adding items to the Azure Stack marketplace, see [the Azure Stack Marketplace overview](././azure-stack-marketplace.md).

## Create a SQL Server AlwaysOn availability group from a template
Use the steps in this section to deploy the SQL Server AlwaysOn availability group using the [sql-2016-alwayson Azure Stack quickstart template](https://github.com/Azure/AzureStack-QuickStart-Templates/tree/master/sql-2016-alwayson). This template deploys two SQL Server Enterprise, Standard or Developer instances in an Always On Availability Group. It creates the following resources:

- A network security group
- A virtual network
- Four storage accounts (One for AD, One for SQL, One for File Share witness and One for VM diagnostic)
- Four public IP address (One for AD, Two for each SQL VM and One for Public LB bound to SQL Always On Listener)
- One external load balancer for SQL VMs with Public IP bound to the SQL Always On listener
-One VM (WS2016) configured as Domain Controller for a new forest with a single domain
- Two VM (WS2016) configured as SQL Server 2016 SP1 or SP2 
- Enterprise/Standard/Developer and clustered (must use the marketplace images)
- One VM (WS2016) configured as File Share Witness for the cluster
- One Availability Set containing the SQL and FSW 2016 VMs  

> [!NOTE]
> Run these steps from the Azure Stack user portal as a tenant user with a subscription providing IaaS capabilities (compute, network, storage services).

1. Sign in to the user portal:
    - For an integrated system deployment, the URL varies based on your solution's region and external domain name, and will be in the format https://portal.&lt;*region*&gt;.&lt;*FQDN*&gt;.
    - If you’re using the Azure Stack Development Kit (ASDK), the portal address is [https://portal.local.azurestack.external](https://portal.local.azurestack.external).

2. Select **\+** **Create a resource** > **Custom**, and then **Template deployment**.

     ![Custom template deployment](media/azure-stack-tutorial-sqlrp/custom-deployment.md)


3. On the **Custom deployment** blade, select **Edit template** > **Quickstart template** and then use the drop-down list of available custom templates to select the **sql-2016-alwayson** template, click **OK**, and then **Save**.

     ![Select quickstart template](media/azure-stack-tutorial-sqlrp/quickstart-template.md)

4. On the **Custom deployment** blade, select **Edit parameters**. Review the default values and modify as necessary and provide all required parameter information and then click **OK** At a minimum:

    - Provide complex passwords for the ADMINPASSWORD, SQLSERVERSERVICEACCOUNTPASSWORD, and SQLAUTHPASSWORD parameters.
    - Enter the DNS Suffix for reverse lookup in all lowercase letters for the DNSSUFFIX parameter. 
    > [!TIP]
    > The DNS suffix for ASDK installations is **azurestack.external**.

5. On the **Custom deployment** blade, create a new resource group or select an existing resource group for the custom deployment, select the resource group location (**local** for ASDK installations), and then select **Create**.

6. In the user portal, select **Resource groups** and then the name of the resource group you created for the custom deployment (simply **resource-group** for this example). View the status of the deployment to ensure all deployments have completed successfully.<br><br>Next, review the resource group items and select the **SQLPIPsql-ao** Public IP address item. Record the public IP address and full FQDN of the load balancer public IP as an Azure Stack Operator will need that information to create a SQL hosting server leveraging SQL AlwaysOn later.

### Enable automatic seeding
After the template has successfully deployed and configured the SQL AlwaysON Availability Group, you must enable [Automatic Seeding](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/automatically-initialize-always-on-availability-group) on each availability group for each instance of SQL Server. 

When you create an availability group with automatic seeding, SQL Server automatically creates the secondary replicas for every database in the group without any other manual intervention necessary to ensure high availablity of AlwaysOn databases.

Use these SQL commands to configure automatic seeding for the AlwaysOn availability group.

On the primary SQL instance (replace <InstanceName> with the primary instance SQL Server name):

  ```sql
  ALTER AVAILABILITY GROUP [<availability_group_name>]
      MODIFY REPLICA ON '<InstanceName>'
      WITH (SEEDING_MODE = AUTOMATIC)
  GO
  ```

On secondary SQL instances (replace <availability_group_name> with the AlwaysOn availability group name):

  ```sql
  ALTER AVAILABILITY GROUP [<availability_group_name>] GRANT CREATE ANY DATABASE
  GO
  ```

### Configure contained database authentication
Before adding a contained database to an availability group, ensure that the contained database authentication server option is set to 1 on every server instance that hosts an availability replica for the availability group. For more information, see contained database authentication Server Configuration Option.

Use these commands to set the contained database authentication server option for each instance:

  ```sql
  EXEC sp_configure 'contained database authentication', 1
  GO
  RECONFIGURE
  GO
  ```

## Create an Azure Stack SQL Hosting Server
After the AlwayOn availability group has been created and properly configured, an Azure Stack Operator must create an Azure Stack SQL Hosting Server to make the additional capacity available for users to create databases. 

Be sure to provide the Azure Stack Operator the public IP or full FQDN for the public IP of the SQL load balancer that was recorded previously when the SQL AlwaysOn availablity group's resource group was created. In addition, the operator will need to know the SQL authentication credentials to access the AlwaysOn availabliity group.

> [!NOTE]
> Run this step from the Azure Stack administration portal as an Azure Stack Operator.

With the IP and login information provided by the tenant user, an Azure Stack Operator can now [create a SQL Hosting Server using the SQL AlwaysOn availablity group](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-sql-resource-provider-hosting-servers#provide-high-availability-using-sql-always-on-availability-groups). 

## Create a highly available SQL database
After the SQL AlwaysOn availablity group has been created, configured, and added as an Azure Stack SQL Hosting Server, a tenant user with a subscription including SQL Server database capablities can create SQL databases supporting AlwaysOn functionality by following the setps in this section. 

> [!NOTE]
> Run these steps from the Azure Stack user portal as a tenant user with a subscription providing SQL Server capabilities (Microsoft.SQLAdapter service).

1. Sign in to the user portal:
    - For an integrated system deployment, the URL varies based on your solution's region and external domain name, and will be in the format https://portal.&lt;*region*&gt;.&lt;*FQDN*&gt;.
    - If you’re using the Azure Stack Development Kit (ASDK), the portal address is [https://portal.local.azurestack.external](https://portal.local.azurestack.external).

2. Select **\+** **Create a resource** > **Data \+ Storage**, and then **SQL Database**.

     ![Custom template deployment](media/azure-stack-tutorial-sqlrp/custom-deployment.md)

3. Provide the required SQL database information: 





































## Next steps

In this tutorial you learned how to:

> [!div class="checklist"]
> * Create a SQL Server AlwaysOn availability group from a template
> * Create an Azure Stack SQL Hosting Server
> * Create a highly available SQL database

Advance to the next tutorial to learn how to:
> [!div class="nextstepaction"]
> [Make SQL databases available to your Azure Stack users](azure-stack-tutorial-sql-server.md)