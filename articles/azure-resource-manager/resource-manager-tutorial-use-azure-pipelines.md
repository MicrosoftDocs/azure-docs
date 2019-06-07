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
1. Select **Create project**. If you don't have any project, the create project page is opened automatically.
1. Enter the following values:

    * **Project name**: enter a project name.
    * **Version control**: Select **Git**. You might need to expand **Advanced** to see **Version control**.

    Use the default value for the other properties.
1. Select **Create project**.

Create a service connection that is used to deploy projects to Azure.

1. Select **Project settings** from the bottom of the left menu.
1. Select **Service connections** under **Pipelines**.
1. Select **New Service connection**, and then select **AzureResourceManager**.
1. Enter the following values:

    * **Connection name**: enter a connection name.  You need this connection name when you develop your pipeline.
    * **Scope level**: select **Subscription**.
    * **Subscription**: select your subscription.
    * **Resource Group**: Leave it blank.
    * **Allow all pipelines to use this connection**. (selected)
1. Select **OK**.

## Create an Azure pipeline

1. Select **Pipelines** from the left menu.
1. Select **New pipeline**.
1. From the **Connect** tab, select **Github**
1. From the **Select** tab, select your repository.  The default name is **[YourAccountName]/AzureRmPipeline-repo**.

    The following steps might be optional:

    1. Enter your GitHub credentials if asked.
    1. From the **Azure Pipelines** page, very the GitHub repository is the only one in the **Only select repository** list, and then select **Approve and install**.
    1. Enter your Azure credentials if asked.
1. From the **Configure** tab, select **Starter pipeline**. It shows the **azure-pipelines.yml** pipeline file with two steps.
1. Replace the **steps** section with the following yml:

    ```yml
    steps:
    - task: AzureResourceGroupDeployment@2
      inputs:
        azureSubscription: '[EnterYourServiceConnection]'
        action: 'Create Or Update Resource Group'
        resourceGroupName: '[EnterANewResourceGroupName]'
        location: 'Central US'
        templateLocation: 'Linked artifact'
        csmFile: 'CreateAzureStorage/azuredeploy.json'
        deploymentMode: 'Incremental'
    ```

    It shall look like:

    ![Azure Resource Manager DevOps pipelines yml](./media/resource-manager-tutorial-use-azure-pipelines/azure-resource-manager-devops-pipelines-yml.png)
    Update **azureSubscription** with the service connection created in the previous procedure, update **resourceGroupName**, and update the location.

    **csmFile** is the path to the template file.

1. From the **Review** tab, select **Save and run**, and then select **Save and run** again. It takes a few moments to build and run the pipeline.
1. Verify that the pipeline is executed successfully.

    ![Azure Resource Manager DevOps pipelines yml](./media/resource-manager-tutorial-use-azure-pipelines/azure-resource-manager-devops-pipelines-status.png)

## Verify the deployment

Sign into the [Azure portal](https://portal.azure.com), verify the resource group and the storage account is created successfully.

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you create an Azure DevOps pipeline to deploy an Azure Resource Manager template. To learn how to deploy Azure resources across multiple regions, and how to use safe deployment practices, see

> [!div class="nextstepaction"]
> [Use Azure Deployment Manager](./resource-manager-tutorial-deploy-vm-extensions.md)
