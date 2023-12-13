---
title: Prerequisites for Azure Database Migration Service
description: Learn about an overview of the prerequisites for using the Azure Database Migration Service to perform database migrations.
author: abhims14
ms.author: abhishekum
ms.reviewer: randolphwest
ms.date: 02/25/2020
ms.service: dms
ms.topic: conceptual
ms.custom:
  - seo-lt-2019
  - sql-migration-content
---

# Overview of prerequisites for using the Azure Database Migration Service

There are several prerequisites required to ensure Azure Database Migration Service runs smoothly when performing database migrations. Some of the prerequisites apply across all scenarios (source-target pairs) supported by the service, while other prerequisites are unique to a specific scenario.

Prerequisites associated with using the Azure Database Migration Service are listed in the following sections.

## Prerequisites common across migration scenarios

Azure Database Migration Service prerequisites that are common across all supported migration scenarios include the need to:

* Create a Microsoft Azure Virtual Network for Azure Database Migration Service by using the Azure Resource Manager deployment model, which provides site-to-site connectivity to your on-premises source servers by using either [ExpressRoute](../expressroute/expressroute-introduction.md) or [VPN](../vpn-gateway/vpn-gateway-about-vpngateways.md).
* Ensure that your virtual network Network Security Group (NSG) rules don't block the outbound port 443 of ServiceTag for ServiceBus, Storage and AzureMonitor. For more detail on virtual network NSG traffic filtering, see the article [Filter network traffic with network security groups](../virtual-network/virtual-network-vnet-plan-design-arm.md).
* When using a firewall appliance in front of your source database(s), you may need to add firewall rules to allow Azure Database Migration Service to access the source database(s) for migration.
* Configure your [Windows Firewall for database engine access](/sql/database-engine/configure-windows/configure-a-windows-firewall-for-database-engine-access).
* Enable the TCP/IP protocol, which is disabled by default during SQL Server Express installation, by following the instructions in the article [Enable or Disable a Server Network Protocol](/sql/database-engine/configure-windows/enable-or-disable-a-server-network-protocol#SSMSProcedure).

    > [!IMPORTANT]
    > Creating an instance of Azure Database Migration Service requires access to virtual network settings that are normally not within the same resource group. As a result, the user creating an instance of DMS requires permission at subscription level. To create the required roles, which you can assign as needed, run the following script:
    >
    > ```
    >
    > $readerActions = `
    > "Microsoft.Network/networkInterfaces/ipConfigurations/read", `
    > "Microsoft.DataMigration/*/read", `
    > "Microsoft.Resources/subscriptions/resourceGroups/read"
    >
    > $writerActions = `
    > "Microsoft.DataMigration/*/write", `
    > "Microsoft.DataMigration/*/delete", `
    > "Microsoft.DataMigration/*/action", `
    > "Microsoft.Network/virtualNetworks/subnets/join/action", `
    > "Microsoft.Network/virtualNetworks/write", `
    > "Microsoft.Network/virtualNetworks/read", `
    > "Microsoft.Resources/deployments/validate/action", `
    > "Microsoft.Resources/deployments/*/read", `
    > "Microsoft.Resources/deployments/*/write"
    >
    > $writerActions += $readerActions
    >
    > # TODO: replace with actual subscription IDs
    > $subScopes = ,"/subscriptions/00000000-0000-0000-0000-000000000000/","/subscriptions/11111111-1111-1111-1111-111111111111/"
    >
    > function New-DmsReaderRole() {
    > $aRole = [Microsoft.Azure.Commands.Resources.Models.Authorization.PSRoleDefinition]::new()
    > $aRole.Name = "Azure Database Migration Reader"
    > $aRole.Description = "Lets you perform read only actions on DMS service/project/tasks."
    > $aRole.IsCustom = $true
    > $aRole.Actions = $readerActions
    > $aRole.NotActions = @()
    >
    > $aRole.AssignableScopes = $subScopes
    > #Create the role
    > New-AzRoleDefinition -Role $aRole
    > }
    >
    > function New-DmsContributorRole() {
    > $aRole = [Microsoft.Azure.Commands.Resources.Models.Authorization.PSRoleDefinition]::new()
    > $aRole.Name = "Azure Database Migration Contributor"
    > $aRole.Description = "Lets you perform CRUD actions on DMS service/project/tasks."
    > $aRole.IsCustom = $true
    > $aRole.Actions = $writerActions
    > $aRole.NotActions = @()
    >
    >   $aRole.AssignableScopes = $subScopes
    > #Create the role
    > New-AzRoleDefinition -Role $aRole
    > }
    > 
    > function Update-DmsReaderRole() {
    > $aRole = Get-AzRoleDefinition "Azure Database Migration Reader"
    > $aRole.Actions = $readerActions
    > $aRole.NotActions = @()
    > Set-AzRoleDefinition -Role $aRole
    > }
    >
    > function Update-DmsConributorRole() {
    > $aRole = Get-AzRoleDefinition "Azure Database Migration Contributor"
    > $aRole.Actions = $writerActions
    > $aRole.NotActions = @()
    > Set-AzRoleDefinition -Role $aRole
    > }
    >
    > # Invoke above functions
    > New-DmsReaderRole
    > New-DmsContributorRole
    > Update-DmsReaderRole
    > Update-DmsConributorRole
    > ```

## Prerequisites for migrating SQL Server to Azure SQL Database

In addition to Azure Database Migration Service prerequisites that are common to all migration scenarios, there are also prerequisites that apply specifically to one scenario or another.

When using the Azure Database Migration Service to perform SQL Server to Azure SQL Database migrations, in addition to the prerequisites that are common to all migration scenarios, be sure to address the following additional prerequisites:

* Create an instance of Azure SQL Database, which you do by following the detail in the article [Create a database in Azure SQL Database in the Azure portal](/azure/azure-sql/database/single-database-create-quickstart).
* Download and install the [Data Migration Assistant](https://www.microsoft.com/download/details.aspx?id=53595) v3.3 or later.
* Open your Windows Firewall to allow the Azure Database Migration Service to access the source SQL Server, which by default is TCP port 1433.
* If you are running multiple named SQL Server instances using dynamic ports, you may wish to enable the SQL Browser Service and allow access to UDP port 1434 through your firewalls so that the Azure Database Migration Service can connect to a named instance on your source server.
* Create a server-level [firewall rule](/azure/azure-sql/database/firewall-configure) for SQL Database to allow the Azure Database Migration Service access to the target databases. Provide the subnet range of the virtual network used for the Azure Database Migration Service.
* Ensure that the credentials used to connect to source SQL Server instance have [CONTROL SERVER](/sql/t-sql/statements/grant-server-permissions-transact-sql) permissions.
* Ensure that the credentials used to connect to target database have CONTROL DATABASE permission on the target database.

   > [!NOTE]
   > For a complete listing of the prerequisites required to use the Azure Database Migration Service to perform migrations from SQL Server to Azure SQL Database, see the tutorial [Migrate SQL Server to Azure SQL Database](./tutorial-sql-server-to-azure-sql.md).
   >

## Prerequisites for migrating SQL Server to Azure SQL Managed Instance

* Create a SQL Managed Instance by following the detail in the article [Create a Azure SQL Managed Instance in the Azure portal](/azure/azure-sql/managed-instance/instance-create-quickstart).
* Open your firewalls to allow SMB traffic on port 445 for the Azure Database Migration Service IP address or subnet range.
* Open your Windows Firewall to allow the Azure Database Migration Service to access the source SQL Server, which by default is TCP port 1433.
* If you are running multiple named SQL Server instances using dynamic ports, you may wish to enable the SQL Browser Service and allow access to UDP port 1434 through your firewalls so that the Azure Database Migration Service can connect to a named instance on your source server.
* Ensure that the logins used to connect the source SQL Server and target Managed Instance are members of the sysadmin server role.
* Create a network share that the Azure Database Migration Service can use to back up the source database.
* Ensure that the service account running the source SQL Server instance has write privileges on the network share that you created and that the computer account for the source server has read/write access to the same share.
* Make a note of a Windows user (and password) that has full control privilege on the network share that you previously created. The Azure Database Migration Service impersonates the user credential to upload the backup files to Azure Storage container for restore operation.
* Create a blob container and retrieve its SAS URI by using the steps in the article [Manage Azure Blob Storage resources with Storage Explorer](../vs-azure-tools-storage-explorer-blobs.md#get-the-sas-for-a-blob-container). Be sure to select all permissions (Read, Write, Delete, List) on the policy window while creating the SAS URI.
* Ensure both Azure Database Migration Service IP address and Azure SQL Managed Instance subnet can communicate with blob container.

   > [!NOTE]
   > For a complete listing of the prerequisites required to use the Azure Database Migration Service to perform migrations from SQL Server to SQL Managed Instance, see the tutorial [Migrate SQL Server to SQL Managed Instance](./tutorial-sql-server-to-managed-instance.md).

## Next steps

For an overview of the Azure Database Migration Service and regional availability, see the article [What is the Azure Database Migration Service](dms-overview.md).
