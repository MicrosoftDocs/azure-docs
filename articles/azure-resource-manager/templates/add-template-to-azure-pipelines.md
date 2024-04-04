---
title: CI/CD with Azure Pipelines and templates
description: Describes how to configure continuous integration in Azure Pipelines by using Azure Resource Manager templates. It shows how to use a PowerShell script, or copy files to a staging location and deploy from there.
ms.topic: conceptual
ms.custom: devx-track-azurepowershell, devx-track-arm-template
ms.date: 03/20/2024
---

# Integrate ARM templates with Azure Pipelines

You can integrate Azure Resource Manager templates (ARM templates) with Azure Pipelines for continuous integration and continuous deployment (CI/CD). In this article, you learn two more advanced ways to deploy templates with Azure Pipelines.

## Select your option

Before proceeding with this article, let's consider the different options for deploying an ARM template from a pipeline.

* **Use ARM template deployment task**. This option is the easiest option. This approach works when you want to deploy a template directly from a repository. This option isn't covered in this article but instead is covered in the tutorial [Continuous integration of ARM templates with Azure Pipelines](deployment-tutorial-pipeline.md). It shows how to use the [ARM template deployment task](https://github.com/microsoft/azure-pipelines-tasks/blob/master/Tasks/AzureResourceManagerTemplateDeploymentV3/README.md) to deploy a template from your GitHub repo.

* **Add task that runs an Azure PowerShell script**. This option has the advantage of providing consistency throughout the development life cycle because you can use the same script that you used when running local tests. Your script deploys the template but can also perform other operations such as getting values to use as parameters. This option is shown in this article. See [Azure PowerShell task](#azure-powershell-task).

   Visual Studio provides the [Azure Resource Group project](create-visual-studio-deployment-project.md) that includes a PowerShell script. The script stages artifacts from your project to a storage account that Resource Manager can access. Artifacts are items in your project such as linked templates, scripts, and application binaries. If you want to continue using the script from the project, use the PowerShell script task shown in this article.

* **Add tasks to copy and deploy tasks**. This option offers a convenient alternative to the project script. You configure two tasks in the pipeline. One task stages the artifacts to an accessible location. The other task deploys the template from that location. This option is shown in this article. See [Copy and deploy tasks](#copy-and-deploy-tasks).

## Prepare your project

This article assumes your ARM template and Azure DevOps organization are ready for creating the pipeline. The following steps show how to make sure you're ready:

* You have an Azure DevOps organization. If you don't have one, [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up). If your team already has an Azure DevOps organization, make sure you're an administrator of the Azure DevOps project that you want to use.

* You've configured a [service connection](/azure/devops/pipelines/library/connect-to-azure) to your Azure subscription. The tasks in the pipeline execute under the identity of the service principal. For steps to create the connection, see [Create a DevOps project](deployment-tutorial-pipeline.md#create-a-devops-project).

* You have an [ARM template](quickstart-create-templates-use-visual-studio-code.md) that defines the infrastructure for your project.

## Create pipeline

1. If you haven't added a pipeline previously, you need to create a new pipeline. From your Azure DevOps organization, select **Pipelines** and **New pipeline**.

   :::image type="content" source="./media/add-template-to-azure-pipelines/new-pipeline.png" alt-text="Screenshot of the Add new pipeline button":::

1. Specify where your code is stored. The following image shows selecting **Azure Repos Git**.

   :::image type="content" source="./media/add-template-to-azure-pipelines/select-source.png" alt-text="Screenshot of selecting the code source in Azure DevOps":::

1. From that source, select the repository that has the code for your project.

   :::image type="content" source="./media/add-template-to-azure-pipelines/select-repo.png" alt-text="Screenshot of selecting the repository for the project in Azure DevOps":::

1. Select the type of pipeline to create. You can select **Starter pipeline**.

   :::image type="content" source="./media/add-template-to-azure-pipelines/select-pipeline.png" alt-text="Screenshot of selecting the type of pipeline to create in Azure DevOps":::

You're ready to either add an Azure PowerShell task or the copy file and deploy tasks.

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

When you set the task to `AzurePowerShell@5`, the pipeline uses the [Az module](/powershell/azure/new-azureps-module-az). If you're using the AzureRM module in your script, set the task to `AzurePowerShell@3`.

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

:::image type="content" source="./media/add-template-to-azure-pipelines/view-results.png" alt-text="Screenshot of the pipeline results view in Azure DevOps":::

You can select the currently running pipeline to see details about the tasks. When it finishes, you see the results for each step.

## Copy and deploy tasks

This section shows how to configure continuous deployment by using two tasks. The first task stages the artifacts to a storage account and the second task deploys the template.

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

* `deploymentScope`: Select the scope of deployment from the options: `Management Group`, `Subscription`, and `Resource Group`. To learn more about the scopes, see [Deployment scopes](deploy-rest.md#deployment-scope).

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

When you select **Save**, the build pipeline is automatically run. Under the **Jobs** frame, select **Job** to see the job status.

## Next steps

* To use the what-if operation in a pipeline, see [Test ARM templates with What-If in a pipeline](https://4bes.nl/2021/03/06/test-arm-templates-with-what-if/).
* To learn about using ARM templates with GitHub Actions, see [Deploy Azure Resource Manager templates by using GitHub Actions](deploy-github-actions.md).
