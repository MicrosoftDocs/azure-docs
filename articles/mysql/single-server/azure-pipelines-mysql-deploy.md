---
title: Azure Pipelines task for Azure Database for MySQL single server 
description: Enable Azure Database for MySQL Single Server CLI  task for using with Azure Pipelines
ms.topic: how-to
ms.service: mysql
ms.subservice: single-server
ms.custom: seodec18, devops-pipelines-deploy
ms.author: jukullam
author: juliakm
ms.date: 09/14/2022
---

# Azure Pipelines for Azure Database for MySQL - Single Server

[!INCLUDE [applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

Get started with Azure Database for MySQL by deploying a database update with Azure Pipelines. Azure Pipelines lets you build, test, and deploy with continuous integration (CI) and continuous delivery (CD) using [Azure DevOps](/azure/devops/). 

You'll use the [Azure Database for MySQL Deployment task](/azure/devops/pipelines/tasks/deploy/azure-mysql-deployment). The Azure Database for MySQL Deployment task only works with Azure Database for MySQL single server.

## Prerequisites

Before you begin, you need:
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Azure DevOps organization. [Sign up for Azure Pipelines](/azure/devops/pipelines/get-started/pipelines-sign-up).
- A GitHub repository that you can use for your pipeline. If you don’t have an existing repository, see [Create your first pipeline](/azure/devops/pipelines/create-first-pipeline). 

This quickstart uses the resources created in either of these guides as a starting point:
- [Create an Azure Database for MySQL server using Azure portal](/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal)
- [Create an Azure Database for MySQL server using Azure CLI](/azure/mysql/quickstart-create-mysql-server-database-using-azure-cli)


## Create your pipeline

You'll use the basic starter pipeline as a basis for your pipeline. 

1. Sign in to your Azure DevOps organization and go to your project.

2. In your project, navigate to the **Pipelines** page. Then choose the action to create a new pipeline.

3. Walk through the steps of the wizard by first selecting GitHub as the location of your source code.

4. You might be redirected to GitHub to sign in. If so, enter your GitHub credentials.

5. When the list of repositories appears, select your desired repository.

6. Azure Pipelines will analyze your repository and offer configuration options. Select **Starter pipeline**.

    :::image type="content" source="media/azure-pipelines-mysql-task/configure-pipeline-option.png" alt-text="Screenshot of Select Starter pipeline.":::
    
## Create a secret

You'll need to know your database server name, SQL username, and SQL password to use with the [Azure Database for MySQL Deployment task](/azure/devops/pipelines/tasks/deploy/azure-mysql-deployment). 

For security, you'll want to save your SQL password as a secret variable in the pipeline settings UI for your pipeline.

1. Go to the **Pipelines** page, select the appropriate pipeline, and then select **Edit**.
1. Select **Variables**. 
1. Add a new variable named `SQLpass` and select **Keep this value secret** to encrypt and save the variable.

    :::image type="content" source="media/azure-pipelines-mysql-task/save-secret-variable.png" alt-text="Screenshot of adding a secret variable.":::  
 
1. Select **Ok** and **Save** to add the variable. 

## Verify permissions for your database

To access your MySQL database with Azure Pipelines, you need to set your database to accept connections from all Azure resources. 

1. In the Azure portal, open your database resource. 
1. Select **Connection security**.
1. Toggle **Allow access to Azure services** to **Yes**. 

    :::image type="content" source="media/azure-pipelines-mysql-task/allow-azure-access-mysql.png" alt-text="Screenshot of setting MySQL to allow Azure connections.":::    

## Add the Azure Database for MySQL Deployment task

In this example, we'll create a new databases named `quickstartdb` and add an inventory table. The inline SQL script will:

- Delete `quickstartdb` if it exists and create a new `quickstartdb` database.
- Delete the table `inventory` if it exists and creates a new `inventory` table.
- Insert three rows into `inventory`.
- Show all the rows.
- Update the value of the first row in `inventory`.
- Delete the second row in `inventory`.

You'll need to replace the following values in your deployment task.

|Input  |Description  |Example  |
|---------|---------|---------|
|`azureSubscription`     |   Authenticate with your Azure Subscription with a [service connection](/azure/devops/pipelines/library/connect-to-azure).     |   `My Subscription`      |
|`ServerName`     |    The name of your Azure Database for MySQL server.     |   `fabrikam.mysql.database.azure.com`      |
|`SqlUsername`     |    The user name of your Azure Database for MySQL.   |    `mysqladmin@fabrikam`     |
|`SqlPassword`     |   The password for the username. This should be defined as a secret variable.     |  `$(SQLpass)`       |

```yaml

trigger:
- main

pool:
  vmImage: ubuntu-latest

steps:
- task: AzureMysqlDeployment@1
  inputs:
    azureSubscription: '<your-subscription>
    ServerName: '<db>.mysql.database.azure.com'
    SqlUsername: '<username>@<db>'
    SqlPassword: '$(SQLpass)'
    TaskNameSelector: 'InlineSqlTask'
    SqlInline: |
      DROP DATABASE IF EXISTS quickstartdb;
      CREATE DATABASE quickstartdb;
      USE quickstartdb;
      
      -- Create a table and insert rows
      DROP TABLE IF EXISTS inventory;
      CREATE TABLE inventory (id serial PRIMARY KEY, name VARCHAR(50), quantity INTEGER);
      INSERT INTO inventory (name, quantity) VALUES ('banana', 150);
      INSERT INTO inventory (name, quantity) VALUES ('orange', 154);
      INSERT INTO inventory (name, quantity) VALUES ('apple', 100);
      
      -- Read
      SELECT * FROM inventory;
      
      -- Update
      UPDATE inventory SET quantity = 200 WHERE id = 1;
      SELECT * FROM inventory;
      
      -- Delete
      DELETE FROM inventory WHERE id = 2;
      SELECT * FROM inventory;
    IpDetectionMethod: 'AutoDetect'
```

## Deploy and verify resources

Select **Save and run** to deploy your pipeline. The pipeline job will be launched and after few minutes, the job status should indicate `Success`.

You can verify that your pipeline ran successfully within the `AzureMysqlDeployment` task in the pipeline run. 

Open the task and verify that the last two entries show two rows in `inventory`. There are two rows because the second row has been deleted. 

:::image type="content" source="media/azure-pipelines-mysql-task/database-update-results.png" alt-text="Screenshot to show reviewing final table results.":::


## Clean up resources

When you’re done working with your pipeline, delete `quickstartdb` in your Azure Database for MySQL. You can also delete the deployment pipeline you created. 

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Build an ASP.NET Core and Azure SQL Database app in Azure App Service](../../app-service/tutorial-dotnetcore-sqldb-app.md)