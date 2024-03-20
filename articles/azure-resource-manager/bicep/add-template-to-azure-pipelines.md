---
title: CI/CD with Azure Pipelines, Bicep, and bicepparam files
description: In this quickstart, you learn how to configure continuous integration in Azure Pipelines by using Bicep and bicepparam files. It shows how to use an Azure CLI task to deploy a bicepparam file.
ms.topic: quickstart
ms.custom: devx-track-bicep, devx-track-azurecli
ms.date: 02/29/2024
---

# Quickstart: Integrate Bicep with Azure Pipelines

This quickstart shows you how to integrate Bicep files with Azure Pipelines for continuous integration and continuous deployment (CI/CD).

It provides a short introduction to the pipeline task you need for deploying a Bicep file. If you want more detailed steps on setting up the pipeline and project, see [Deploy Azure resources by using Bicep and Azure Pipelines](/training/paths/bicep-azure-pipelines/).

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

You need an Azure DevOps organization. If you don't have one, [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up). If your team already has an Azure DevOps organization, make sure you're an administrator of the Azure DevOps project that you want to use.

You need to have configured a [service connection](/azure/devops/pipelines/library/connect-to-azure) to your Azure subscription. The tasks in the pipeline execute under the identity of the service principal. For steps to create the connection, see [Create a DevOps project](../templates/deployment-tutorial-pipeline.md#create-a-devops-project).

You need a [Bicep file](./quickstart-create-bicep-use-visual-studio-code.md) that defines the infrastructure for your project. This file is in a repository.

You need a [bicepparam file](/azure/azure-resource-manager/bicep/parameter-files) that defines the parameters used by your bicep file. This file is in a repository.

## Create pipeline

1. From your Azure DevOps organization, select **Pipelines** and **Create pipeline**.

    :::image type="content" source="./media/add-template-to-azure-pipelines/new-pipeline.png" alt-text="Screenshot of creating new pipeline.":::

1. Specify where your code is stored. This quickstart uses Azure Repos Git.

    :::image type="content" source="./media/add-template-to-azure-pipelines/select-source.png" alt-text="Screenshot of selecting code source.":::

1. Select the repository that has the code for your project.

    :::image type="content" source="./media/add-template-to-azure-pipelines/select-repo.png" alt-text="Screenshot of selecting repository.":::

1. Select **Starter pipeline** for the type of pipeline to create.

    :::image type="content" source="./media/add-template-to-azure-pipelines/select-pipeline.png" alt-text="Screenshot of selecting pipeline.":::

## Deploy Bicep files

You can use Azure Resource Group Deployment task or Azure CLI task to deploy a Bicep file.

### Use Azure Resource Manager Template Deployment task

> [!NOTE]
> As of version 3.235.0 of the [Azure Resource Manager Template Deployment task](/azure/devops/pipelines/tasks/reference/azure-resource-manager-template-deployment-v3), usage of [bicepparam](/azure/azure-resource-manager/bicep/parameter-files) files is supported.

> [!NOTE]
> The `AzureResourceManagerTemplateDeployment@3` task requires both Bicep and bicepparam files be provided when using bicepparam. The Bicep file can reference all supported locations for module references. The bicepparam file must reference the local Bicep file in the `using` statement.

1. Replace your starter pipeline with the following YAML. It creates a resource group and deploys a Bicep and bicepparam file by using the Azure Resource Manager Template Deployment task.

    ```yml
    trigger:
    - main

    name: Deploy Bicep files

    parameters:
      azureServiceConnection: '<your-connection-name>'

    variables:
      vmImageName: 'ubuntu-latest'
      resourceGroupName: 'exampleRG'
      location: '<your-resource-group-location>'
      templateFile: './main.bicep'
      csmParametersFile: './main.bicepparam'

    pool:
      vmImage: $(vmImageName)

    steps:
    - task: AzureResourceManagerTemplateDeployment@3
      inputs:
        deploymentScope: 'Resource Group'
        azureSubscription: '${{ parameters.azureServiceConnection }}'
        action: 'Create Or Update Resource Group'
        resourceGroupName: '$(resourceGroupName)'
        location: '$(location)'
        templateLocation: 'Linked artifact'
        csmFile: '$(templateFile)'
        csmParametersFile: '$(csmParametersFile)'
        overrideParameters: '-storageAccountType Standard_LRS'
        deploymentMode: 'Incremental'
        deploymentName: 'DeployPipelineTemplate'
    ```

1. Update the values of `azureServiceConnection` and `location`.
1. Verify you have a valid `main.bicep` file in your repo.
1. Verify you have a valid `main.bicepparam` file in your repo that contains a [using](/azure/azure-resource-manager/bicep/bicep-using) statement.
1. Select **Save**. The build pipeline automatically runs. Go back to the summary for your build pipeline, and watch the status.

### Use Azure CLI task

> [!NOTE]
> The [az deployment group create](/cli/azure/deployment/group?view=azure-cli-latest#az-deployment-group-create&preserve-view=true) command requires only a bicepparam file. The `using` statement in the bicepparam file can target any supported location to reference the Bicep file. A Bicep file is only required in your repository when `using` from a local disk path with Azure CLI.

> [!NOTE]
> When you use a *[bicepparam](/azure/azure-resource-manager/bicep/parameter-files)* file with the [az deployment group create](/cli/azure/deployment/group?view=azure-cli-latest#az-deployment-group-create&preserve-view=true) command, you can't override parameters.

1. Replace your starter pipeline with the following YAML. It creates a resource group and deploys a [bicepparam](/azure/azure-resource-manager/bicep/parameter-files) file by using an [Azure CLI task](/azure/devops/pipelines/tasks/reference/azure-cli-v2):

    ```yml
    trigger:
    - main

    name: Deploy Bicep files

    parameters:
      azureServiceConnection: '<your-connection-name>'

    variables:
      vmImageName: 'ubuntu-latest'
      resourceGroupName: 'exampleRG'
      location: '<your-resource-group-location>'
      bicepParamFile: './main.bicepparam'

    pool:
      vmImage: $(vmImageName)

    steps:
    - task: AzureCLI@2
      inputs:
        azureSubscription: '${{ parameters.azureServiceConnection }}'
        scriptType: bash
        scriptLocation: inlineScript
        useGlobalConfig: false
        inlineScript: |
          az --version
          az group create --name $(resourceGroupName) --location $(location)
          az deployment group create `
            --resource-group $(resourceGroupName) `
            --parameters $(bicepParamFile) `
            --name DeployPipelineTemplate
    ```

    For the descriptions of the task inputs, see [Azure CLI task](/azure/devops/pipelines/tasks/reference/azure-cli-v2). When using the task on air-gapped cloud, you must set the `useGlobalConfig` property of the task to `true`. The default value is `false`.

1. Update the values of `azureServiceConnection` and `location`.
1. Verify you have a valid `main.bicepparam` file in your repo that contains a [using](/azure/azure-resource-manager/bicep/bicep-using) statement.
1. Select **Save**. The build pipeline automatically runs. Go back to the summary for your build pipeline, and watch the status.

## Clean up resources

When the Azure resources are no longer needed, use the Azure CLI or Azure PowerShell to delete the quickstart resource group.

# [CLI](#tab/CLI)

```azurecli
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

> [!div class="nextstepaction"]
> [Deploy Bicep files by using GitHub Actions](deploy-github-actions.md)
