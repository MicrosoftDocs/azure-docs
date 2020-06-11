---
title: Source Control Integration
description: Enterprise-class Database DevOps experience for SQL pool with native source control integration using Azure Repos (Git and GitHub).
services: synapse-analytics
author: kevinvngo 
manager: craigg
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: 
ms.date: 08/23/2019
ms.author: kevin
ms.reviewer: igorstan
---
# Source Control Integration for SQL pool

This tutorial outlines how to integrate your SQL Server Data tools (SSDT) database project with source control.  Source control integration is the first step in building your continuous integration and deployment pipeline with the SQL pool resource in Azure Synapse Analytics.

## Before you begin

- Sign up for an [Azure DevOps organization](https://azure.microsoft.com/services/devops/)
- Go through the [Create and Connect](create-data-warehouse-portal.md) tutorial
- [Install Visual Studio 2019](https://visualstudio.microsoft.com/vs/older-downloads/)

## Set up and connect to Azure DevOps

1. In your Azure DevOps Organization, create a project that will host your SSDT database project via an Azure Repo repository

   ![Create Project](./media/sql-data-warehouse-source-control-integration/1-create-project-azure-devops.png "Create Project")

2. Open Visual Studio and connect to your Azure DevOps organization and project from step 1 by selecting "Manage Connections"

   ![Manage Connections](./media/sql-data-warehouse-source-control-integration/2-manage-connections.png "Manage Connections")

   ![Connect](./media/sql-data-warehouse-source-control-integration/3-connect.png "Connect")

3. Clone your Azure Repo repository from your project to your local machine

   ![Clone repo](./media/sql-data-warehouse-source-control-integration/4-clone-repo.png "Clone repo")

## Create and connect your project

1. In Visual Studio, create a new SQL Server Database Project with both a directory and local Git repository in your **local cloned repository**

   ![Create new project](./media/sql-data-warehouse-source-control-integration/5-create-new-project.png "Create new project")  

2. Right-click on your empty sqlproject and import your data warehouse into the database project

   ![Import Project](./media/sql-data-warehouse-source-control-integration/6-import-new-project.png "Import Project")  

3. In team explorer in Visual Studio, commit your all changes to your local Git repository

   ![Commit](./media/sql-data-warehouse-source-control-integration/6.5-commit-push-changes.png "Commit")  

4. Now that you have the changes committed locally in the cloned repository, sync and push your changes to your Azure Repo repository in your Azure DevOps project.

   ![Sync and Push - staging](./media/sql-data-warehouse-source-control-integration/7-commit-push-changes.png "Sync and push - staging")

   ![Sync and Push](./media/sql-data-warehouse-source-control-integration/7.5-commit-push-changes.png "Sync and push")  

## Validation

1. Verify changes have been pushed to your Azure Repo by updating a  table column in your database project from Visual Studio SQL Server Data Tools (SSDT)

   ![Validate update column](./media/sql-data-warehouse-source-control-integration/8-validation-update-column.png "Validate update column")

2. Commit and push the change from your local repository to your Azure Repo

   ![Push changes](./media/sql-data-warehouse-source-control-integration/9-push-column-change.png "Push changes")

3. Verify the change has been pushed in your Azure Repo repository

   ![Verify](./media/sql-data-warehouse-source-control-integration/10-verify-column-change-pushed.png "Verify changes")

4. (**Optional**) Use Schema Compare and update the changes to your target data warehouse using SSDT to ensure the object definitions in your Azure Repo repository and local repository reflect your data warehouse

## Next steps

- [Developing for SQL pool](sql-data-warehouse-overview-develop.md)
