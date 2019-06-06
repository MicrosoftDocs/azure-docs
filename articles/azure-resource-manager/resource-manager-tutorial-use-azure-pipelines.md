---
title: Continuous integration with Azure Pipelines | Microsoft Docs
description: Learn how to continuously build, test, and deploy Azure Resource Manager templates.
services: azure-resource-manager
documentationcenter: ''
author: mumian
manager: carmonm
editor:

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.date: 06/06/2019
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Continous integration of Azure Resource Manager templates with Azure Pipelines

Learn how to utilize Azure Pipelines to continuously build and deploy Azure Resource Manager template projects.

Azure DevOps provides developer services to support teams to plan work, collaborate on code development, and build and deploy applications. Developers can work in the cloud using Azure DevOps Services or on-premises using Azure DevOps Server, formerly named Visual Studio Team Foundation Server (TFS).

Azure DevOps provides an integrated set of features that you can access through your web browser or IDE client. Azure Pipeline is one of these features. Azure Pipelines is a fully featured continuous integration (CI) and continuous delivery (CD) service. It works with your preferred Git provider and can deploy to most major cloud services. Then you can automate the build, testing, and deployment of your code to Microsoft Azure, Google Cloud Platform, or Amazon Web Services.

This tutorial is designed for Azure Resource Manager template developers who are new Azure DevOps Services and Azure Pipelines. If you are already familiar with GitHub and DevOps, you can skip to ...

> [!NOTE]
> Pick a project name. When you go through the tutorial, replace any of the **AzureRMPipeline** with your project name.

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Prepare a GitHub repository
> * Create a DevOps project
> * Import the repository
> *  Create a pipeline
> * Create/update the pipeline
> * Run the pipeline
> * Verify the deployment
> * Clean up resources

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To complete this article, you need:

* **A Github account**, where you use it to create a repository for your templates. If you don’t have one, you can [create one for free](https://github.com). For more information about using Github repositories, see [Build GitHub respositories](/azure/devops/pipelines/repos/github).
* **Install Git**. This tutorial uses Git Bash or Git Shell to sync the content. For instructions, see [Install Git]( https://www.atlassian.com/git/tutorials/install-git).
* **An Azure DevOps organization**. If you don't have one, you can create one for free. See [Create an organization or project collection]( https://docs.microsoft.com/azure/devops/organizations/accounts/create-organization?view=azure-devops).
* [Visual Studio Code](https://code.visualstudio.com/) with the Resource Manager Tools extension. See [Install the extension
](./resource-manager-quickstart-create-templates-use-visual-studio-code.md#prerequisites).

## Prepare a GitHub repository

There are a number of [repositories supported by Azure DevOps](/azure/devops/pipelines/repos/?view=azure-devops#supported-repository-types). GitHub is used in this tutorial to store your Resource Manager templates.

### Create a GitHub repository

If you don’t have a GitHub account, see [Prerequisites](#prerequisites).

1. Sign in to [GitHub](https://github.com).
2. Select your account image on the upper right corner, and then select **Your repositories**.
3. Select **New**.
4. In **Repository name**, enter **AzureRMPipeline-repo**. Remember to replace any of **AzureRmPipeline** with your project name. You can select either **Public** or **private** for going through this tutorial. And then select **Create repository**.
5. Write down the URL. The repository URL shall be:

    ```url
    **https://github.com/[YourAccountName]/[YourRepositoryName]**
    ```

### Clone the repository

You need to clone a local repository so you can work on the files.

1. Open Git Shell or Git Bash.  See [Prerequisites](#prerequisites).
1. Verify your current folder is **github**.
1. Run the following command:

    ```bash
    git clone https://github.com/[YourAccountName]/[YourRepositoryName]
    cd [YourRepositoryName]
    mkdir CreateAzureStorage
    cd CreateAzureStorage
    pwd
    ```

    Replace **[YourAccountName]** with your actually GitHub account name, and repace **[YourRepositoryName] with your actually repository name you created in the previous procedure.

The **CreateAzureStorage** folder is the folder where the template is storedThe **pwd** command shows the folder path. This is the path where you save the template to in the following procedure.

### Download a Quickstart template

Instead of creating a template, you can download a [Quickstart template]( https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json). This template creates an Azure Storage account.

1. Open Visual Studio code. See [Prerequisites](#prerequisites).
2. Open the template with the following URL:

    ```URL
    https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json
    ```

3. Save the file as **azuredeploy.json** to the **CreateAzureStorage** folder . Both the folder name and the file name are used as they are in the pipeline.  If you change these names, you must update the pipeline accordingly.

### Push the template to the repository

The azuredeploy.json has been added to the local repository. Next, you upload the template to the remote repository.

1. Open Git Shell or Git Bash, if it is not opened.
1. Change directory to your local repository.
1. Run the following command:

    ```bash
    git add .
    git commit -m “Add a new create storage account template.”
    git push origin master
    ```

    You might get a warning about LF. You can ignore the warning. **master** is the master branch.  You typically create a branch for each major update.  To simplify the tutorial, you use the master branch.
1. Browse to your GitHub repository from a browser.  The URL is **https://github.com/[YourAccountName]/[YourRepositoryName]]**. You shall see the **CreateAzureStorage** folder and **Azuredeploy.json** inside the folder.

So far, you have created a GitHub repository, and uploaded a template to the repository.

## Create a DevOps project

A DevOps organization is needed before you can proceed.  If you don’t have one, see [Prerequisties](#prerequisites).

1. Sign in to [Azure DevOps](https://dev.azure.com).
1. Select a DevOps organization from the left.
1. Select **Create project**.
1. Enter the following values:

    * **Project name**
    * **Description**
    * **Version control**: Select **Git**.

    Use the default value for the other properties.
1. Select **Create**.

## Import the GitHub repository

In this section, you connect the GitHub repository to this DevOp project.

1. Sign in to [Azure DevOps](https://dev.azure.com).
1. Select the organization
1. Select the newly created DevOps project.
1. Select **Repos** from the left menu. If you don’t see the menu item, select **Project settings** from the left pane, and the turn on **Repos** under **Azure DevOps services**.
1. Select **Import**.
1. Enter the **Clone URL**.  See [Create a GitHub repository](#create-a-github-repository).
1. Once imported, verify that you can see the **CreateAzureStorage** folder and the *azuredeploy.json* template file.

## Create an Azure pipeline

1. Sign in to [Azure DevOps](https://dev.azure.com).
2. Select the organization
3. Select the newly created DevOps project.
4. Select **Pipelines** from the left menu.
5. Select **New pipeline**.
6. From the **Connect** tab, select **Github**
7. From the **Select** tab, select your repository.  The default name is **[YourAccountName]/AzureRmPipeline-repo**.
8. Enter your GitHub credentials.
9. From the **Azure Pipelines** page, very the GitHub repository is the onlyone in the **Only select repository** list, and then select **Approve and install**.
10. Enter your Azure credentials.
11. From the **Configure** tag, select **Starter pipeline**.
12. Select **Save and run**.

13. Select **Save and run**. It takes a few seconds to build and run the pipeline.
14. Verify that the pipeline is executed successfully.

## Edit the pipeline

1. Sign in to [Azure DevOps](https://dev.azure.com).
2. Select the organization
3. Select the newly created DevOps project.
4. Select **Pipelines** from the left menu. You shall see one pipeline that is already created.
5. Select **Edit**. You shall see the content of azure-pipelines.yml.
6. From the yml file, update the **vmImage** line with the following:

    ```yml
    vmImage: vs2017-win2016
    ```

    Using a Microsoft-hosted pool agent is necessary for the **Azure file copy ** task.
7. From the yml file, deleted the lines after **Steps:**.
8. Place the cursor after the line **Steps:**.
9. From the **Tasks** pane on the right, select **Azure file copy**. You can use the search function to find the task.
10. Enter the following values:

    * Source: enter **CreateAzureStorage**.  This is folder which contains the azuredeploy.json file.
    * **Azure Subscription**: Select your Azure subscription, and the select **Authorize**.
    * **Destination Type **: Select **Azure Blob**.
    * **RM Storage Account**: select an existing Azure storage account**.
    * **Container Name**: enter an existing or new storage account**.
    * **Storage Container URI**: enter **artifactsLocation**.
    * **Storage Container SAS Token** enter **artifactsLocationSasToken**.
    * **SAS Token Expiration Period In Minutes**: ????

11. Select **Add**. The yml files is updated with the new task.
12. Move the cursor to the end of the yml file – where you want to add a new task.
13. Follow the same procedure to add an **Azure Resource Group Deployment** task with the following configurations:


Create/update the pipeline

1. From the left pane, select **Pipelines**. You shall see only one pipeline there called “Set up CI with Azure Pipelines”.
2. Select **Edit**.
3. From the **Task** pane on the right, select **Azure Resource Group Deployment**.
4. Configure the task:
a. **Azure subscription**: select your subscription. Select **Authorize** and following the instructions.
b. **Action**: select **Create or update resource group**.
c. *Resource group**: select a resource group.
d. **Location**: enter a location.

## Verify the deployment

In the portal, select the SQL database from the newly deployed resource group. Select **Query editor (preview)**, and then enter the administrator credentials. You shall see two tables imported into the database:

![Azure Resource Manager deploy sql extensions BACPAC](./media/resource-manager-tutorial-deploy-sql-extensions-bacpac/resource-manager-tutorial-deploy-sql-extensions-bacpac-query-editor.png)

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.  You shall see a total of six resources in the resource group.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you deployed a SQL Server, a SQL Database, and imported a BACPAC file using SAS token. To learn how to deploy Azure resources across multiple regions, and how to use safe deployment practices, see

> [!div class="nextstepaction"]
> [Use Azure Deployment Manager](./resource-manager-tutorial-deploy-vm-extensions.md)
