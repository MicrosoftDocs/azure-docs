---
ms.service: sql-database
ms.subservice: deployment-configuration
ms.topic: include
ms.date: 12/17/2020
author: MashaMSFT
ms.author: mathoma
---

  You can use one of these quickstarts to create and then configure a database:

  | Action | SQL Database | SQL Managed Instance | SQL Server on Azure VM | Azure Synapse Analytics |
  |:--- |:--- |:---|:---|:---|
  | Create| [Portal](../database/single-database-create-quickstart.md) | [Portal](../managed-instance/instance-create-quickstart.md) | [Portal](../virtual-machines/windows/sql-vm-create-portal-quickstart.md) | [Portal](../../synapse-analytics/quickstart-create-workspace.md) |
  || [CLI](../database/scripts/create-and-configure-database-cli.md) | | | [CLI](../../synapse-analytics/quickstart-create-workspace-cli.md) |
  || [PowerShell](../database/scripts/create-and-configure-database-powershell.md) | [PowerShell](../managed-instance/scripts/create-configure-managed-instance-powershell.md) | [PowerShell](../virtual-machines/windows/sql-vm-create-powershell-quickstart.md) | [PowerShell](../../synapse-analytics/quickstart-create-workspace-powershell.md) |
  || | | [Deployment template](../virtual-machines/windows/create-sql-vm-resource-manager-template.md) | [Deployment template](../../synapse-analytics/quickstart-deployment-template-workspaces.md) | 
  | Configure | [Server-level IP firewall rule](../database/firewall-create-server-level-portal-quickstart.md)| [Connectivity from a VM](../managed-instance/connect-vm-instance-configure.md)| |
  |||[Connectivity from on-premises](../managed-instance/point-to-site-p2s-configure.md) | [Connect to a SQL Server instance](../virtual-machines/windows/sql-vm-create-portal-quickstart.md) |
  | Get connection information | [Azure SQL](../database/connect-query-content-reference-guide.md#get-server-connection-information)|[Azure SQL](../database/connect-query-content-reference-guide.md#get-server-connection-information)| [SQL VM](../virtual-machines/windows/sql-vm-create-portal-quickstart.md?#connect-to-sql-server)| [Synapse SQL](../../synapse-analytics/sql/connect-overview.md#find-your-server-name)|
  |||||
