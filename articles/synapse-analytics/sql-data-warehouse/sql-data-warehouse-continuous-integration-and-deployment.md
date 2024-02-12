---
title: Continuous integration and deployment for dedicated SQL pool
description: Enterprise-class Database DevOps experience for dedicated SQL pool in Azure Synapse Analytics with built-in support for continuous integration and deployment using Azure Pipelines.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 02/04/2020
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: how-to
ms.custom: azure-synapse
---
# Continuous integration and deployment for dedicated SQL pool in Azure Synapse Analytics

This simple tutorial outlines how to integrate your SQL Server Data tools (SSDT) database project with Azure DevOps and leverage Azure Pipelines to set up continuous integration and deployment. This tutorial is the second step in building your continuous integration and deployment pipeline for data warehousing.

## Before you begin

- Go through the [source control integration tutorial](sql-data-warehouse-source-control-integration.md)

- Set up and connect to Azure DevOps

## Continuous integration with Visual Studio build

1. Navigate to Azure Pipelines and create a new build pipeline.

      ![New Pipeline](./media/sql-data-warehouse-continuous-integration-and-deployment/1-new-build-pipeline.png "New Pipeline")

2. Select your source code repository (Azure Repos Git) and select the .NET Desktop app template.

      ![Pipeline Setup](./media/sql-data-warehouse-continuous-integration-and-deployment/2-pipeline-setup.png "Pipeline Setup")

3. Edit your YAML file to use the proper pool of your agent. Your YAML file should look something like this:

      ![YAML](./media/sql-data-warehouse-continuous-integration-and-deployment/3-yaml-file.png "YAML")

At this point, you have a simple environment where any check-in to your source control repository main branch should automatically trigger a successful Visual Studio build of your database project. Validate the automation is working end to end by making a change in your local database project and checking in that change to your main branch.

## Continuous deployment with the Azure Synapse Analytics (or Database) deployment task

1. Add a new task using the [Azure SQL Database deployment task](/azure/devops/pipelines/targets/azure-sqldb) and fill in the required fields to connect to your target data warehouse. When this task runs, the DACPAC generated from the previous build process is deployed to the target data warehouse. You can also use the [Azure Synapse Analytics deployment task](https://marketplace.visualstudio.com/items?itemName=ms-sql-dw.SQLDWDeployment).

      ![Deployment Task](./media/sql-data-warehouse-continuous-integration-and-deployment/4-deployment-task.png "Deployment Task")

2. If you are using a self-hosted agent, make sure you set your environment variable to use the correct SqlPackage.exe for Azure Synapse Analytics. The path should look something like this:

      ![Environment Variable](./media/sql-data-warehouse-continuous-integration-and-deployment/5-environment-variable-preview.png "Environment Variable")

   C:\Program Files (x86)\Microsoft Visual Studio\2019\Preview\Common7\IDE\Extensions\Microsoft\SQLDB\DAC\150  

   Run and validate your pipeline. You can make changes locally and check in changes to your source control that should generate an automatic build and deployment.

## Next steps

- Explore [Dedicated SQL pool (formerly SQL DW) architecture](massively-parallel-processing-mpp-architecture.md)
- Quickly [create a dedicated SQL pool (formerly SQL DW)](create-data-warehouse-portal.md)
- [Load sample data](./load-data-from-azure-blob-storage-using-copy.md)
- Explore [Videos](sql-data-warehouse-videos.md)
