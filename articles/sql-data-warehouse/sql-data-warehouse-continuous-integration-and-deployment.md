---
title: Continuous integration and deployment | Microsoft Docs
description: Enterprise-class Database DevOps experience for SQL Data Warehouse with built-in support for continuous integration and deployment using Azure Pipelines.
services: sql-data-warehouse
author: kevinvngo 
manager: craigg
ms.service: sql-data-warehouse
ms.topic: overview
ms.subservice: integration
ms.date: 08/28/2019
ms.author: kevin
ms.reviewer: igorstan
---
# Continuous integration and deployment for Azure SQL Data Warehouse

This simple tutorial outlines how to integrate your SQL Server Data tools (SSDT) database project with Azure DevOps and leverage Azure Pipelines to set up continuous integration and deployment. This tutorial is the second step in building your continuous integration and deployment pipeline with SQL Data Warehouse. 

## Before you begin

- Go through the [source control integration tutorial](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-source-control-integration)

- Create a [self-hosted agent](https://docs.microsoft.com/azure/devops/pipelines/agents/agents?view=azure-devops#install) that has the SSDT Preview Bits (16.3 preview 2 and higher) installed for SQL Data Warehouse (preview)

- Set up and connect to Azure DevOps

  > [!NOTE]
  > SSDT is currently in preview where you will need to leverage a self-hosted agent. The
  > Microsoft-hosted agents will be updated in the next few months.

## Continuous integration with Visual Studio build

1. Navigate to Azure Pipelines and create a new build pipeline

      ![New Pipeline](media/sql-data-warehouse-continuous-integration-and-deployment/1-new-build-pipeline.png "New Pipeline")

2. Select your source code repository (Azure Repos Git) and select the .NET Desktop app template

      ![Pipeline Setup](media/sql-data-warehouse-continuous-integration-and-deployment/2-pipeline-setup.png "Pipeline Setup") 

3. Edit your YAML file to use the proper pool of your agent. Your YAML file should look something like this:

      ![YAML](media/sql-data-warehouse-continuous-integration-and-deployment/3-yaml-file.png "YAML")

At this point, you have a simple environment where any check-in to your source control repository master branch should automatically trigger a successful Visual Studio build of your database project. Validate the automation is working end to end by making a change in your local database project and checking in that change to your master branch.


## Continuous deployment with the Azure SQL Database deployment task

1. Add a new task using the [Azure SQL Database deployment task](https://docs.microsoft.com/azure/devops/pipelines/tasks/deploy/sql-azure-dacpac-deployment?view=azure-devops) and fill in the required fields to connect to your target data warehouse. When this task runs, the DACPAC generated from the previous build process is deployed to the target data warehouse.

      ![Deployment Task](media/sql-data-warehouse-continuous-integration-and-deployment/4-deployment-task.png "Deployment Task")

2. When using a self-hosted agent, make sure you set your environment variable to use the correct SqlPackage.exe for SQL Data Warehouse. The path should look something like this:

      ![Environment Variable](media/sql-data-warehouse-continuous-integration-and-deployment/5-environment-variable-preview.png "Environment Variable")

   C:\Program Files (x86)\Microsoft Visual Studio\2019\Preview\Common7\IDE\Extensions\Microsoft\SQLDB\DAC\150  

   Run and validate your pipeline. You can make changes locally and check in changes to your source control that should generate an automatic build and deployment.

## Next steps

- Explore [Azure SQL Data Warehouse architecture](/azure/sql-data-warehouse/massively-parallel-processing-mpp-architecture)
- Quickly [create a SQL Data Warehouse][create a SQL Data Warehouse]
- [Load sample data][load sample data].
- Explore [Videos](/azure/sql-data-warehouse/sql-data-warehouse-videos)



<!--Image references-->

[1]: ./media/sql-data-warehouse-overview-what-is/dwarchitecture.png

<!--Article references-->
[Create a support ticket]: ./sql-data-warehouse-get-started-create-support-ticket.md
[load sample data]: ./sql-data-warehouse-load-sample-databases.md
[create a SQL Data Warehouse]: ./sql-data-warehouse-get-started-provision.md
[Migration documentation]: ./sql-data-warehouse-overview-migrate.md
[SQL Data Warehouse solution partners]: ./sql-data-warehouse-partner-business-intelligence.md
[Integrated tools overview]: ./sql-data-warehouse-overview-integrate.md
[Backup and restore overview]: ./sql-data-warehouse-restore-database-overview.md
[Azure glossary]: ../azure-glossary-cloud-terminology.md

<!--MSDN references-->

<!--Other Web references-->
[Blogs]: https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/
[Customer Advisory Team blogs]: https://blogs.msdn.microsoft.com/sqlcat/tag/sql-dw/
[Feature requests]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[MSDN forum]: https://social.msdn.microsoft.com/Forums/azure/home?forum=AzureSQLDataWarehouse
[Stack Overflow forum]: https://stackoverflow.com/questions/tagged/azure-sqldw
[Twitter]: https://twitter.com/hashtag/SQLDW
[Videos]: https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse
[SLA for SQL Data Warehouse]: https://azure.microsoft.com/support/legal/sla/sql-data-warehouse/v1_0/
[Volume Licensing]: https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=37
[Service Level Agreements]: https://azure.microsoft.com/support/legal/sla/
