---
title: Outbound firewall rules (preview)
description: Overview of the outbound firewall rules feature.
author: rohitnayakmsft
ms.author: rohitna
titleSuffix: Azure SQL Database and Azure Synapse Analytics
ms.service: sql-database
ms.subservice: security
ms.topic: conceptual
ms.reviewer: vanto
ms.date: 11/10/2021
---

# Outbound firewall rules for Azure SQL Database and Azure Synapse Analytics (preview)
[!INCLUDE[appliesto-sqldb-asa](../includes/appliesto-sqldb-asa-formerly-sqldw.md)] 

Outbound firewall rules limit network traffic from the Azure SQL logical server to a customer defined list of Azure Storage accounts and Azure SQL logical servers. Any attempt to access storage accounts or SQL Databases not in this list is denied. The following Azure SQL Database features support this feature:

- [Auditing](auditing-overview.md)
- [Vulnerability assessment](sql-vulnerability-assessment.md)
- [I/E service](database-import-export-azure-services-off.md)
- OPENROWSET
- Bulk Insert
- [Elastic query](elastic-query-overview.md)

> [!IMPORTANT]
> This article applies to both Azure SQL Database and [dedicated SQL pool (formerly SQL DW)](../../synapse-analytics\sql-data-warehouse\sql-data-warehouse-overview-what-is.md) in Azure Synapse Analytics. These settings apply to all SQL Database and dedicated SQL pool (formerly SQL DW) databases associated with the server. For simplicity, the term 'database' refers to both databases in Azure SQL Database and Azure Synapse Analytics. Likewise, any references to 'server' is referring to the [logical SQL server](logical-servers.md) that hosts Azure SQL Database and dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics. This article does *not* apply to Azure SQL Managed Instance or dedicated SQL pools in Azure Synapse Analytics workspaces.

## Set outbound firewall rules in the Azure portal

1. Browse to the **Outbound networking** section in the **Firewalls and virtual networks** blade for your Azure SQL Database and select **Configure outbound networking restrictions**.

   ![Screenshot of Outbound Networking section][1]  

   This will open up the following blade on the right-hand side:

   ![Screenshot of Outbound Networking blade with nothing selected][2]  

1. Select the check box titled **Restrict outbound networking** and then add the FQDN for the Storage accounts (or SQL Databases) using the **Add domain** button.

   ![Screenshot of Outbound Networking blade showing how to add FQDN][3]  

1. After you're done, you should see a screen similar to the one below. Select **OK** to apply these settings.

   ![Screenshot of of Outbound Networking blade after FQDNs are added][4]  

## Set outbound firewall rules using PowerShell

> [!IMPORTANT]
> Azure SQL Database still supports the PowerShell Azure Resource Manager module, but all future development is for the Az.Sql module. For these cmdlets, see [AzureRM.Sql](/powershell/module/AzureRM.Sql/). The arguments for the commands in the Az module and in the AzureRm modules are substantially identical. The following script requires the [Azure PowerShell module](/powershell/azure/install-az-ps).

The following PowerShell script shows how to change the outbound networking setting (using the **RestrictOutboundNetworkAccess** property):

```powershell
# Get current settings for Outbound Networking
(Get-AzSqlServer -ServerName <SqlServerName> -ResourceGroupName <ResourceGroupName>).RestrictOutboundNetworkAccess

# Update setting for Outbound Networking
$SecureString = ConvertTo-SecureString "<ServerAdminPassword>" -AsPlainText -Force

Set-AzSqlServer -ServerName <SqlServerName> -ResourceGroupName <ResourceGroupName> -SqlAdministratorPassword $SecureString  -RestrictOutboundNetworkAccess "Enabled"
```

Use these PowerShell cmdlets to configure outbound firewall rules

```powershell
# List all Outbound Firewall Rules
Get-AzSqlServerOutboundFirewallRule -ServerName <SqlServerName> -ResourceGroupName <ResourceGroupName>

# Add an Outbound Firewall Rule
New-AzSqlServerOutboundFirewallRule -ServerName <SqlServerName> -ResourceGroupName <ResourceGroupName> -AllowedFQDN testOBFR1

# List a specific Outbound Firewall Rule
Get-AzSqlServerOutboundFirewallRule -ServerName <SqlServerName> -ResourceGroupName <ResourceGroupName> -AllowedFQDN <StorageAccountFQDN>

#Delete an Outbound Firewall Rule
Remove-AzSqlServerOutboundFirewallRule -ServerName <SqlServerName> -ResourceGroupName <ResourceGroupName> -AllowedFQDN <StorageAccountFQDN>
```

## Set outbound firewall rules using the Azure CLI

> [!IMPORTANT]
> All scripts in this section require the [Azure CLI](/cli/azure/install-azure-cli).

### Azure CLI in a bash shell

The following CLI script shows how to change the outbound networking setting (using the **RestrictOutboundNetworkAccess** property) in a bash shell:

```azurecli-interactive
# Get current setting for Outbound Networking 
az sql server show -n sql-server-name -g sql-server-group --query "RestrictOutboundNetworkAccess"

# Update setting for Outbound Networking
az sql server update -n sql-server-name -g sql-server-group --set RestrictOutboundNetworkAccess="Enabled"
```

Use these CLI commands to configure outbound firewall rules

```azurecli-interactive
# List a server's outbound firewall rules.
az sql server outbound-firewall-rule list -g sql-server-group -s sql-server-name

# Create a new outbound firewall rule
az sql server outbound-firewall-rule create -g sql-server-group -s sql-server-name --outbound-rule-fqdn allowedFQDN

# Show the details for an outbound firewall rule.
az sql server outbound-firewall-rule show -g sql-server-group -s sql-server-name --outbound-rule-fqdn allowedFQDN

# Delete the outbound firewall rule.
az sql server outbound-firewall-rule delete -g sql-server-group -s sql-server-name --outbound-rule-fqdn allowedFQDN
```

## Next steps

- For an overview of Azure SQL Database security, see [Securing your database](security-overview.md)
- For an overview of Azure SQL Database connectivity, see [Azure SQL Connectivity Architecture](connectivity-architecture.md)

<!--Image references-->
[1]: media/outbound-firewall-rules/Step1.jpg
[2]: media/outbound-firewall-rules/Step2.jpg
[3]: media/outbound-firewall-rules/Step3.jpg
[4]: media/outbound-firewall-rules/Step4.jpg
