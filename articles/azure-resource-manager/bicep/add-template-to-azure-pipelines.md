---
title: CI/CD with Azure Pipelines and Bicep files
description: Describes how to configure continuous integration in Azure Pipelines by using Bicep files. It shows how to use a PowerShell script, or copy files to a staging location and deploy from there.
author: mumian
ms.topic: conceptual
ms.author: jgao
ms.date: 06/01/2021
---
# Integrate Bicep with Azure Pipelines

You can integrate Bicep files with Azure Pipelines for continuous integration and continuous deployment (CI/CD). In this article, you learn how to build a Bicep file into an Azure Resource Manager template (ARM template) and then use two advanced ways to deploy templates with Azure Pipelines.

## Select your option

Before proceeding with this article, let's consider the different options for deploying an ARM template from a pipeline.

* **Use Azure CLI task**. Use this task to run `az bicep build` to build your Bicep files before deploying the ARM templates.

* **Use ARM template deployment task**. This option is the easiest option. This approach works when you want to deploy an ARM template directly from a repository. This option isn't covered in this article but instead is covered in the tutorial [Continuous integration of ARM templates with Azure Pipelines](../templates/deployment-tutorial-pipeline.md). It shows how to use the [ARM template deployment task](https://github.com/microsoft/azure-pipelines-tasks/blob/master/Tasks/AzureResourceManagerTemplateDeploymentV3/README.md) to deploy a template from your GitHub repository.

* **Add task that runs an Azure PowerShell script**. This option has the advantage of providing consistency throughout the development life cycle because you can use the same script that you used when running local tests. Your script deploys the template but can also perform other operations such as getting values to use as parameters. This option is shown in this article. See [Azure PowerShell task](#azure-powershell-task).

   Visual Studio provides the [Azure Resource Group project](../templates/create-visual-studio-deployment-project.md) that includes a PowerShell script. The script stages artifacts from your project to a storage account that Resource Manager can access. Artifacts are items in your project such as linked templates, scripts, and application binaries. If you want to continue using the script from the project, use the PowerShell script task shown in this article.

* **Add tasks to copy and deploy tasks**. This option offers a convenient alternative to the project script. You configure two tasks in the pipeline. One task stages the artifacts to an accessible location. The other task deploys the template from that location. This option is shown in this article. See [Copy and deploy tasks](#copy-and-deploy-tasks).

## Prepare your project

This article assumes your ARM template and Azure DevOps organization are ready for creating the pipeline. The following steps show how to make sure you're ready:

* You have an Azure DevOps organization. If you don't have one, [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up). If your team already has an Azure DevOps organization, make sure you're an administrator of the Azure DevOps project that you want to use.

* You've configured a [service connection](/azure/devops/pipelines/library/connect-to-azure) to your Azure subscription. The tasks in the pipeline execute under the identity of the service principal. For steps to create the connection, see [Create a DevOps project](../templates/deployment-tutorial-pipeline.md#create-a-devops-project).

* You have an [ARM template](../templates/quickstart-create-templates-use-visual-studio-code.md) that defines the infrastructure for your project.

## Create pipeline

1. If you haven't added a pipeline previously, you need to create a new pipeline. From your Azure DevOps organization, select **Pipelines** and **New pipeline**.

   ![Add new pipeline](./media/add-template-to-azure-pipelines/new-pipeline.png)

1. Specify where your code is stored. The following image shows selecting **Azure Repos Git**.

   ![Select code source](./media/add-template-to-azure-pipelines/select-source.png)

1. From that source, select the repository that has the code for your project.

   ![Select repository](./media/add-template-to-azure-pipelines/select-repo.png)

1. Select the type of pipeline to create. You can select **Starter pipeline**.

   ![Select pipeline](./media/add-template-to-azure-pipelines/select-pipeline.png)

You're ready to either add an Azure PowerShell task or the copy file and deploy tasks.

## Azure CLI task

This section shows how to build a Bicep file into an ARM template before the template is deployed.

The following YAML file builds a Bicep file by using an [Azure CLI task](/azure/devops/pipelines/tasks/deploy/azure-cli):

```yml
trigger:
- master

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: AzureCLI@2
  inputs:
    azureSubscription: 'script-connection'
    scriptType: bash
    scriptLocation: inlineScript
    inlineScript: |
      az --version
      az bicep build --file ./azuredeploy.bicep
```

For `azureSubscription`, provide the name of the service connection you created.

For `scriptType`, use **bash**.

For `scriptLocation`, use **inlineScript**, or **scriptPath**. If you specify **scriptPath**, you will also need to specify a `scriptPath` parameter.

In `inlineScript`, specify your script lines.  The script provided in the sample builds a bicep file called *azuredeploy.bicep* and exists in the root of the repository.

## Azure PowerShell task

This section shows how to configure continuous deployment by using a single task that runs the PowerShell script in your project. If you need a PowerShell script that deploys a template, see [Deploy-AzTemplate.ps1](https://github.com/Azure/azure-quickstart-templates/blob/master/Deploy-AzTemplate.ps1) or [Deploy-AzureResourceGroup.ps1](https://github.com/Azure/azure-quickstart-templates/blob/master/Deploy-AzureResourceGroup.ps1).

The following YAML file creates an [Azure PowerShell task](/azure/devops/pipelines/tasks/deploy/azure-powershell):

```yml
trigger:
- master

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: AzurePowerShell@5
  inputs:
    azureSubscription: 'script-connection'
    ScriptType: 'FilePath'
    ScriptPath: './Deploy-AzTemplate.ps1'
    ScriptArguments: -Location 'centralus' -ResourceGroupName 'demogroup' -TemplateFile templates\mainTemplate.json
    azurePowerShellVersion: 'LatestVersion'
```

When you set the task to `AzurePowerShell@5`, the pipeline uses the [Az module](/powershell/azure/new-azureps-module-az).

```yaml
steps:
- task: AzurePowerShell@3
```

For `azureSubscription`, provide the name of the service connection you created.

```yaml
inputs:
    azureSubscription: '<your-connection-name>'
```

For `scriptPath`, provide the relative path from the pipeline file to your script. You can look in your repository to see the path.

```yaml
ScriptPath: '<your-relative-path>/<script-file-name>.ps1'
```

In `ScriptArguments`, provide any parameters needed by your script. The following example shows some parameters for a script, but you'll need to customize the parameters for your script.

```yaml
ScriptArguments: -Location 'centralus' -ResourceGroupName 'demogroup' -TemplateFile templates\mainTemplate.json
```

When you select **Save**, the build pipeline is automatically run. Go back to the summary for your build pipeline, and watch the status.

![View results](./media/add-template-to-azure-pipelines/view-results.png)

You can select the currently running pipeline to see details about the tasks. When it finishes, you see the results for each step.

## Copy and deploy tasks

This section shows how to configure continuous deployment by using a two tasks. The first task stages the artifacts to a storage account and the second task deploy the template.

To copy files to a storage account, the service principal for the service connection must be assigned the Storage Blob Data Contributor or Storage Blob Data Owner role. For more information, see [Get started with AzCopy](../../storage/common/storage-use-azcopy-v10.md).

The following YAML shows the [Azure file copy task](/azure/devops/pipelines/tasks/deploy/azure-file-copy).

```yml
trigger:
- master

pool:
  vmImage: 'windows-latest'

steps:
- task: AzureFileCopy@4
  inputs:
    SourcePath: 'templates'
    azureSubscription: 'copy-connection'
    Destination: 'AzureBlob'
    storage: 'demostorage'
    ContainerName: 'projecttemplates'
  name: AzureFileCopy
```

There are several parts of this task to revise for your environment. The `SourcePath` indicates the location of the artifacts relative to the pipeline file.

```yaml
SourcePath: '<path-to-artifacts>'
```

For `azureSubscription`, provide the name of the service connection you created.

```yaml
azureSubscription: '<your-connection-name>'
```

For storage and container name, provide the names of the storage account and container you want to use for storing the artifacts. The storage account must exist.

```yaml
storage: '<your-storage-account-name>'
ContainerName: '<container-name>'
```

After creating the copy file task, you're ready to add the task to deploy the staged template.

The following YAML shows the [Azure Resource Manager template deployment task](https://github.com/microsoft/azure-pipelines-tasks/blob/master/Tasks/AzureResourceManagerTemplateDeploymentV3/README.md):

```yaml
- task: AzureResourceManagerTemplateDeployment@3
  inputs:
    deploymentScope: 'Resource Group'
    azureResourceManagerConnection: 'copy-connection'
    subscriptionId: '00000000-0000-0000-0000-000000000000'
    action: 'Create Or Update Resource Group'
    resourceGroupName: 'demogroup'
    location: 'West US'
    templateLocation: 'URL of the file'
    csmFileLink: '$(AzureFileCopy.StorageContainerUri)templates/mainTemplate.json$(AzureFileCopy.StorageContainerSasToken)'
    csmParametersFileLink: '$(AzureFileCopy.StorageContainerUri)templates/mainTemplate.parameters.json$(AzureFileCopy.StorageContainerSasToken)'
    deploymentMode: 'Incremental'
    deploymentName: 'deploy1'
```

There are several parts of this task to review in greater detail.

* `deploymentScope`: Select the scope of deployment from the options: `Management Group`, `Subscription`, and `Resource Group`.

* `azureResourceManagerConnection`: Provide the name of the service connection you created.

* `subscriptionId`: Provide the target subscription ID. This property only applies to the Resource Group deployment scope and the subscription deployment scope.

* `resourceGroupName` and `location`: provide the name and location of the resource group you want to deploy to. The task creates the resource group if it doesn't exist.

   ```yml
   resourceGroupName: '<resource-group-name>'
   location: '<location>'
   ```

* `csmFileLink`: Provide the link for the staged template. When setting the value, use variables returned from the file copy task. The following example links to a template named mainTemplate.json. The folder named **templates** is included because that where the file copy task copied the file to. In your pipeline, provide the path to your template and the name of your template.

   ```yml
   csmFileLink: '$(AzureFileCopy.StorageContainerUri)templates/mainTemplate.json$(AzureFileCopy.StorageContainerSasToken)'
   ```

Your pipeline look like:

```yml
trigger:
- master

pool:
  vmImage: 'windows-latest'

steps:
- task: AzureFileCopy@4
  inputs:
    SourcePath: 'templates'
    azureSubscription: 'copy-connection'
    Destination: 'AzureBlob'
    storage: 'demostorage'
    ContainerName: 'projecttemplates'
  name: AzureFileCopy
- task: AzureResourceManagerTemplateDeployment@3
  inputs:
    deploymentScope: 'Resource Group'
    azureResourceManagerConnection: 'copy-connection'
    subscriptionId: '00000000-0000-0000-0000-000000000000'
    action: 'Create Or Update Resource Group'
    resourceGroupName: 'demogroup'
    location: 'West US'
    templateLocation: 'URL of the file'
    csmFileLink: '$(AzureFileCopy.StorageContainerUri)templates/mainTemplate.json$(AzureFileCopy.StorageContainerSasToken)'
    csmParametersFileLink: '$(AzureFileCopy.StorageContainerUri)templates/mainTemplate.parameters.json$(AzureFileCopy.StorageContainerSasToken)'
    deploymentMode: 'Incremental'
    deploymentName: 'deploy1'
```

When you select **Save**, the build pipeline is automatically run. Go back to the summary for your build pipeline, and watch the status.

## Example

The following pipeline shows how to build a Bicep file and how to deploy the compiled template:

:::code language="yml" source="~/resourcemanager-templates/bicep/azure-pipeline/deploy-bicep.yml":::

## Next steps

* To use the what-if operation in a pipeline, see [Test ARM templates with What-If in a pipeline](https://4bes.nl/2021/03/06/test-arm-templates-with-what-if/).
* To learn about using Bicep file with GitHub Actions, see [Deploy Bicep files by using GitHub Actions](./deploy-github-actions.md).
