---
title: Deploy SSIS packages 
description: Learn how to deploy and run SSIS packages in Azure Data Factory with the Azure-SSIS integrated runtime.
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 01/20/2023
author: chugugrace
ms.author: chugu 
ms.custom:
---
# Deploy SSIS packages

After configuration of your Azure-SSIS integration runtime, you can deploy and run packages in Azure directly.

## Using SSISDB

If you use SSISDB, you can deploy your packages into it and run them on your Azure-SSIS IR by using the Azure-enabled SSDT or SSMS tools. These tools connect to your database server via its server endpoint: 

- For an Azure SQL Database server, the server endpoint format is `<server name>.database.windows.net`.
- For a managed instance with private endpoint, the server endpoint format is `<server name>.<dns prefix>.database.windows.net`.
- For a managed instance with public endpoint, the server endpoint format is `<server name>.public.<dns prefix>.database.windows.net,3342`. 

## Using file system, Azure files, or MSDB

If you don't use SSISDB, you can deploy your packages into file system, Azure Files, or MSDB hosted by your Azure SQL Managed Instance and run them on your Azure-SSIS IR by using [dtutil](/sql/integration-services/dtutil-utility) and [AzureDTExec](./how-to-invoke-ssis-package-azure-enabled-dtexec.md) command-line utilities. 

For more information, see [Deploy SSIS projects/packages](/sql/integration-services/packages/deploy-integration-services-ssis-projects-and-packages).

In both cases, you can also run your deployed packages on Azure-SSIS IR by using the Execute SSIS Package activity in Data Factory pipelines. For more information, see [Invoke SSIS package execution as a first-class Data Factory activity](./how-to-invoke-ssis-package-ssis-activity.md).

## Next steps

- [Learn how to provision an Azure-SSIS IR using the Azure portal](create-azure-ssis-integration-runtime-portal.md).
- [Learn how to provision an Azure-SSIS IR using Azure PowerShell](create-azure-ssis-integration-runtime-powershell.md).
- [Learn how to provision an Azure-SSIS IR using an Azure Resource Manager template](create-azure-ssis-integration-runtime-resource-manager-template.md).

See other Azure-SSIS IR topics in this documentation:

- [Azure-SSIS integration runtime](concepts-integration-runtime.md#azure-ssis-integration-runtime). This article provides information about integration runtimes in general, including Azure-SSIS IR.
- [Monitor an Azure-SSIS IR](monitor-integration-runtime.md#azure-ssis-integration-runtime). This article shows you how to retrieve and understand information about your Azure-SSIS IR.
- [Manage an Azure-SSIS IR](manage-azure-ssis-integration-runtime.md). This article shows you how to stop, start, or delete your Azure-SSIS IR. It also shows you how to scale out your Azure-SSIS IR by adding more nodes.
- [Deploy, run, and monitor SSIS packages in Azure](/sql/integration-services/lift-shift/ssis-azure-deploy-run-monitor-tutorial)   
- [Connect to SSISDB in Azure](/sql/integration-services/lift-shift/ssis-azure-connect-to-catalog-database)
- [Connect to on-premises data sources with Windows authentication](/sql/integration-services/lift-shift/ssis-azure-connect-with-windows-auth) 
- [Schedule package executions in Azure](/sql/integration-services/lift-shift/ssis-azure-schedule-packages)
