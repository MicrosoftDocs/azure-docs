---
title: Continuous integration with Azure Pipelines
description: Learn how to continuously build, test, and deploy Azure Resource Manager templates (ARM templates).
ms.date: 06/30/2023
ms.topic: tutorial
ms.custom: devx-track-arm-template
---

# Tutorial: Continuous integration of ARM templates with Azure Pipelines

In the [previous tutorial](./deployment-tutorial-linked-template.md), you deploy a linked template.  In this tutorial, you learn how to use Azure Pipelines to continuously build and deploy Azure Resource Manager template (ARM template) projects.

Azure DevOps provides developer services to support teams to plan work, collaborate on code development, and build and deploy applications. Developers can work in the cloud using Azure DevOps Services. Azure DevOps provides an integrated set of features that you can access through your web browser or IDE client. Azure Pipelines is one of these features. Azure Pipelines is a fully featured continuous integration (CI) and continuous delivery (CD) service. It works with your preferred Git provider and can deploy to most major cloud services. Then you can automate the build, testing, and deployment of your code to Microsoft Azure, Google Cloud Platform, or Amazon Web Services.

> [!NOTE]
> Pick a project name. When you go through the tutorial, replace any of the **ARMPipelineProj** with your project name.
> This project name is used to generate resource names.  One of the resources is a storage account. Storage account names must be between 3 and 24 characters in length and use numbers and lower-case letters only. The name must be unique. In the template, the storage account name is the project name with **store** appended, and the project name must be between 3 and 11 characters. So the project name must meet the storage account name requirements and has less than 11 characters.

This tutorial covers the following tasks:

> [!div class="checklist"]
> * Prepare a GitHub repository
> * Create an Azure DevOps project
> * Create an Azure pipeline
> * Verify the pipeline deployment
> * Update the template and redeploy
> * Clean up resources

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To complete this article, you need:

* **A GitHub account**, where you use it to create a repository for your templates. If you don't have one, you can [create one for free](https://github.com). For more information about using GitHub repositories, see [Build GitHub repositories](/azure/devops/pipelines/repos/github).
* **Install Git**. This tutorial instruction uses *Git Bash* or *Git Shell*. For instructions, see [Install Git](https://www.atlassian.com/git/tutorials/install-git).
* **An Azure DevOps organization**. If you don't have one, you can create one for free. See [Create an organization or project collection](/azure/devops/organizations/accounts/create-organization).
* (optional) **Visual Studio Code with Resource Manager Tools extension**. See [Quickstart: Create ARM templates with Visual Studio Code](quickstart-create-templates-use-visual-studio-code.md).

## Prepare a GitHub repository

GitHub is used to store your project source code including Resource Manager templates. For other supported repositories, see [repositories supported by Azure DevOps](/azure/devops/pipelines/repos/).

### Create a GitHub repository

If you don't have a GitHub account, see [Prerequisites](#prerequisites).

1. Sign in to [GitHub](https://github.com).
1. Select your account image on the upper right corner, and then select **Your repositories**.

    :::image type="content" source="./media/deployment-tutorial-pipeline/azure-resource-manager-devops-pipelines-github-repository.png" alt-text="Screenshot of creating a GitHub repository for Azure Resource Manager Azure DevOps Azure Pipelines.":::

1. Select **New**, a green button.
1. In **Repository name**, enter a repository name.  For example, **ARMPipeline-repo**. Remember to replace any of **ARMPipeline** with your project name. You can select either **Public** or **private** for going through this tutorial. And then select **Create repository**.
1. Write down the URL. The repository URL is the following format - `https://github.com/[YourAccountName]/[YourRepositoryName]`.

This repository is referred to as a *remote repository*. Each of the developers of the same project can clone their own *local repository*, and merge the changes to the remote repository.

### Clone the remote repository

1. Open Git Shell or Git Bash. See [Prerequisites](#prerequisites).
1. Verify your current folder is **GitHub**.
1. Run the following command:

    ```bash
    git clone https://github.com/[YourAccountName]/[YourGitHubRepositoryName]
    cd [YourGitHubRepositoryName]
    mkdir create_web_app
    cd create_web_app
    pwd
    ```

    Replace `[YourAccountName]` with your GitHub account name, and replace `[YourGitHubRepositoryName]` with your repository name you created in the previous procedure.

The _create_web_app_ folder is the folder where the template is stored. The `pwd` command shows the folder path. The path is where you save the template to in the following procedure.

### Download a Quickstart template

Instead of creating the templates, you can download the templates and save them to the _create_web_app_ folder.

* The main template: https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/get-started-deployment/linked-template/azuredeploy.json
* The linked template: https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/get-started-deployment/linked-template/linkedStorageAccount.json

Both the folder name and the file names are used as they are in the pipeline. If you change these names, you must update the names used in the pipeline.

### Push the template to the remote repository

The _azuredeploy.json_ has been added to the local repository. Next, you upload the template to the remote repository.

1. Open *Git Shell* or *Git Bash*, if it is not opened.
1. Change directory to the _create_web_app_ folder in your local repository.
1. Verify the _azuredeploy.json_ file is in the folder.
1. Run the following command:

    ```bash
    git add .
    git commit -m "Add web app templates."
    git push origin main
    ```

    You might get a warning about LF. You can ignore the warning. **main** is the main branch.  You typically create a branch for each update. To simplify the tutorial, you use the main branch directly.

1. Browse to your GitHub repository from a browser. The URL is `https://github.com/[YourAccountName]/[YourGitHubRepository]`. You shall see the _create_web_app_ folder and the two files inside the folder.
1. Select _azuredeploy.json_ to open the template.
1. Select the **Raw** button. The URL begins with `https://raw.githubusercontent.com`.
1. Make a copy of the URL. You need to provide this value when you configure the pipeline later in the tutorial.

So far, you have created a GitHub repository, and uploaded the templates to the repository.

## Create a DevOps project

A DevOps organization is needed before you can proceed to the next procedure. If you don't have one, see [Prerequisites](#prerequisites).

1. Sign in to [Azure DevOps](https://go.microsoft.com/fwlink/?LinkId=307137).
1. Select a DevOps organization from the left, and then select **New project**. If you don't have any projects, the create project page is opened automatically.
1. Enter the following values:

    :::image type="content" source="./media/deployment-tutorial-pipeline/azure-resource-manager-devops-pipelines-create-devops-project.png" alt-text="Screenshot of creating an Azure DevOps project for Azure Resource Manager Azure DevOps Azure Pipelines.":::

    * **Project name**: Enter a project name. You can use the project name you picked at the very beginning of the tutorial.
    * **Visibility**: Select **Private**.

    Use the default value for the other properties.
1. Select **Create**.

Create a service connection that is used to deploy projects to Azure.

1. Select **Project settings** from the bottom of the left menu.
1. Select **Service connections** under **Pipelines**.
1. Select **Create Service connection**, select **Azure Resource Manager**, and then select **Next**.
1. Select **Service principal (automatic)**, and then select **Next**.
1. Enter the following values:

    * **Scope level**: select **Subscription**.
    * **Subscription**: select your subscription.
    * **Resource Group**: Leave it blank.
    * **Connection name**: enter a connection name. For example, **ARMPipeline-conn**. Write down this name, you need the name when you create your pipeline.
    * **Grant access permission to all pipelines**. (selected)
1. Select **Save**.

## Create a pipeline

Until now, you have completed the following tasks.  If you skip the previous sections because you are familiar with GitHub and DevOps, you must complete the tasks before you continue.

* Create a GitHub repository, and save the templates to the _create_web_app_ folder in the repository.
* Create a DevOps project, and create an Azure Resource Manager service connection.

To create a pipeline with a step to deploy a template:

1. Select **Pipelines** from the left menu.
1. Select **Create pipeline**.
1. From the **Connect** tab, select **GitHub**. If asked, enter your GitHub credentials, and then follow the instructions. If you see the following screen, select **Only select repositories**, and verify your repository is in the list before you select **Approve & Install**.

    :::image type="content" source="./media/deployment-tutorial-pipeline/azure-resource-manager-devops-pipelines-only-select-repositories.png" alt-text="Screenshot of selecting repositories for Azure Resource Manager Azure DevOps Azure Pipelines.":::

1. From the **Select** tab, select your repository. The default name is `[YourAccountName]/[YourGitHubRepositoryName]`.
1. From the **Configure** tab, select **Starter pipeline**. It shows the _azure-pipelines.yml_ pipeline file with two script steps.
1. Delete the two script steps from the _.yml_ file.
1. Move the cursor to the line after **steps:**.
1. Select **Show assistant** on the right of the screen to open **Tasks** pane.
1. Select **ARM template deployment**.
1. Enter the following values:

    * **deploymentScope**: Select **Resource Group**. To learn more about the scopes, see [Deployment scopes](deploy-rest.md#deployment-scope).
    * **Azure Resource Manager connection**: Select the service connection name that you created earlier.
    * **Subscription**:  Specify the target subscription ID.
    * **Action**: Select the **Create Or Update Resource Group** action does 2 actions - 1. create a resource group if a new resource group name is provided; 2. deploy the template specified.
    * **Resource group**: Enter a new resource group name. For example, **ARMPipeline-rg**.
    * **Location**: Select a location for the resource group, for example, **Central US**.
    * **Template location**: Select **URL of the file**, which means the task looks for the template file by using the URL. Because _relativePath_ is used in the main template and _relativePath_ is only supported on URI-based deployments, you must use URL here.
    * **Template link**: Enter the URL that you got at the end of the [Prepare a GitHub repository](#prepare-a-github-repository) section. It starts with `https://raw.githubusercontent.com`.
    * **Template parameters link**: Leave this field blank. You will specify the parameter values in the **Override template parameters**.
    * **Override template parameters**: Enter `-projectName [EnterAProjectName]`.
    * **Deployment mode**: Select **Incremental**.
    * **Deployment name**: Enter **DeployPipelineTemplate**. Select **Advanced** before you can see **Deployment name**.

    :::image type="content" source="./media/deployment-tutorial-pipeline/resource-manager-template-pipeline-configure.png" alt-text="Screenshot of the ARM template deployment page with required values entered for Azure DevOps Azure Pipelines.":::

1. Select **Add**.

    For more information about the task, see [Azure Resource Group Deployment task](/azure/devops/pipelines/tasks/deploy/azure-resource-group-deployment), and [Azure Resource Manager template deployment task](https://github.com/microsoft/azure-pipelines-tasks/blob/master/Tasks/AzureResourceManagerTemplateDeploymentV3/README.md)

    The _.yml_ file shall be similar to:

    :::image type="content" source="./media/deployment-tutorial-pipeline/azure-resource-manager-devops-pipelines-yml.png" alt-text="Screenshot of the Review page with the new pipeline titled Review your pipeline YAML for Azure DevOps Azure Pipelines.":::

1. Select **Save and run**.
1. From the **Save and run** pane, select **Save and run** again. A copy of the YAML file is saved into the connected repository. You can see the YAML file by browse to your repository.
1. Verify that the pipeline is executed successfully.

    :::image type="content" source="./media/deployment-tutorial-pipeline/azure-resource-manager-devops-pipelines-status.png" alt-text="Screenshot of Azure Resource Manager Azure DevOps Azure Pipelines YAML file.":::

## Verify the deployment

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open the resource group. The name is what you specified in the pipeline YAML file. You shall see one storage account created. The storage account name starts with **store**.
1. Select the storage account name to open it.
1. Select **Properties**. Notice the **Replication** is **Locally-redundant storage (LRS)**.

## Update and redeploy

When you update the template and push the changes to the remote repository, the pipeline automatically updates the resources, the storage account in this case.

1. Open _linkedStorageAccount.json_ from your local repository in Visual Studio Code or any text editor.
1. Update the **defaultValue** of **storageAccountType** to **Standard_GRS**. See the following screenshot:

    :::image type="content" source="./media/deployment-tutorial-pipeline/azure-resource-manager-devops-pipelines-update-yml.png" alt-text="Screenshot of updating the YAML file for Azure Resource Manager Azure DevOps Azure Pipelines.":::

1. Save the changes.
1. Push the changes to the remote repository by running the following commands from Git Bash/Shell.

    ```bash
    git pull origin main
    git add .
    git commit -m "Update the storage account type."
    git push origin main
    ```

    The first command (`pull`) syncs the local repository with the remote repository. The pipeline YAML file was only added to the remote repository. Running the `pull` command downloads a copy of the YAML file to the local branch.

    The fourth command (`push`) uploads the revised _linkedStorageAccount.json_ file to the remote repository. With the main branch of the remote repository updated, the pipeline is fired again.

To verify the changes, you can check the Replication property of the storage account. See [Verify the deployment](#verify-the-deployment).

## Clean up resources

When the Azure resources are no longer needed, clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

You might also want to delete the GitHub repository and the Azure DevOps project.

## Next steps

Congratulations, you've finished this Resource Manager template deployment tutorial. Let us know if you have any comments and suggestions in the feedback section. Thanks!
You're ready to jump into more advanced concepts about templates. The next tutorial goes into more detail about using template reference documentation to help with defining resources to deploy.

> [!div class="nextstepaction"]
> [Utilize template reference](./template-tutorial-use-template-reference.md)
