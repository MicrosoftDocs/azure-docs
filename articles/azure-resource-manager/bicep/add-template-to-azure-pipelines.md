---
title: 'Quickstart: Integrate Bicep with Azure Pipelines'
description: This quickstart explains how to use Bicep and `.bicepparam` files to configure continuous integration and continuous deployments in Azure Pipelines, plus how to use an Azure CLI task to deploy a `.bicepparam` file.
ms.topic: quickstart
ms.custom: devx-track-bicep, devx-track-azurecli
ms.date: 03/25/2025
---

# Quickstart: Integrate Bicep with Azure Pipelines

This quickstart shows you how to integrate Bicep files with Azure Pipelines for continuous integration and continuous deployment.

It provides a short introduction to the pipeline task you need for deploying a Bicep file. For more detailed steps on setting up the pipeline and project, see the [Deploy Azure resources by using Bicep and Azure Pipelines](/training/paths/bicep-azure-pipelines/) Microsoft Learn module.

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

You also need an Azure DevOps organization. If you don't have one, [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up). If your team already has an Azure DevOps organization, make sure you're an administrator of the Azure DevOps project that you want to use.

You need to have configured a [service connection](/azure/devops/pipelines/library/connect-to-azure) to your Azure subscription. The tasks in the pipeline execute under the identity of the service principal. For steps to create the connection, see [Create a DevOps project](../templates/deployment-tutorial-pipeline.md#create-a-devops-project).

You need a [Bicep file](./quickstart-create-bicep-use-visual-studio-code.md) that defines the infrastructure for your project. This file is in a repository.

You need a ['.bicepparam' file](/azure/azure-resource-manager/bicep/parameter-files) that defines the parameters that your Bicep file uses. This file is in a repository.

## Create pipeline

1. From your Azure DevOps organization, select **Pipelines** and **Create pipeline**.

    :::image type="content" source="./media/add-template-to-azure-pipelines/new-pipeline.png" alt-text="Screenshot of creating new pipeline.":::

1. Specify where your code is stored. This quickstart uses Azure Repos Git repos.

    :::image type="content" source="./media/add-template-to-azure-pipelines/select-source.png" alt-text="Screenshot of selecting code source.":::

1. Select the repository that has the code for your project.

    :::image type="content" source="./media/add-template-to-azure-pipelines/select-repo.png" alt-text="Screenshot of selecting repository.":::

1. Select **Starter pipeline** for the type of pipeline to create.

    :::image type="content" source="./media/add-template-to-azure-pipelines/select-pipeline.png" alt-text="Screenshot of selecting pipeline.":::

## Deploy Bicep files

You can use an Azure Resource Group deployment task or an Azure CLI task to deploy a Bicep file.

### Use Azure Resource Manager template deployment task

> [!NOTE]
> As of [Azure Resource Manager template deployment task](/azure/devops/pipelines/tasks/reference/azure-resource-manager-template-deployment-v3) version 3.235.0, usage of ['.bicepparam'](/azure/azure-resource-manager/bicep/parameter-files) files is supported.

> [!NOTE]
> The `AzureResourceManagerTemplateDeployment@3` task requires both Bicep and `.bicepparam` files to be provided when using `.bicepparam`. The Bicep file can reference all supported locations for module references. The `.bicepparam` file must reference the local Bicep file in the `using` statement.

1. Replace your starter pipeline with the following YAML. It uses the Azure Resource Manager template deployment task to create a resource group and deploy a Bicep and `.bicepparam` file.

    ```yml
    trigger:
    - main

    name: Deploy Bicep files

    parameters:
    - name: azureServiceConnection
      type: string
      default: '<your-connection-name>'

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
        action: 'Create Or Update Resource Group'
        resourceGroupName: '$(resourceGroupName)'
        location: '$(location)'
        templateLocation: 'Linked artifact'
        csmFile: '$(templateFile)'
        csmParametersFile: '$(csmParametersFile)'
        overrideParameters: '-storageAccountType Standard_LRS'
        deploymentMode: 'Incremental'
        deploymentName: 'DeployPipelineTemplate'
        connectedServiceName: '${{ parameters.azureServiceConnection }}'
    ```

1. Update the values of `azureServiceConnection` and `location`.
1. Verify you have a valid `main.bicep` file in your repo.
1. Verify you have a valid `main.bicepparam` file in your repo that contains a [`using`](/azure/azure-resource-manager/bicep/bicep-using) statement.
1. Select **Save**. The build pipeline runs automatically. Go back to the summary for your build pipeline, and watch the status.

### Use Azure CLI task

> [!NOTE]
> The [`az deployment group create`](/cli/azure/deployment/group?view=azure-cli-latest#az-deployment-group-create&preserve-view=true) command requires only a `bicepparam.` file. The `using` statement in the `.bicepparam` file can target any supported location to reference the Bicep file. A Bicep file is only required in your repository when `using` from a local disk path with the Azure CLI.

> [!NOTE]
> When you use a [`.bicepparam`](/azure/azure-resource-manager/bicep/parameter-files) file with the [`az deployment group create`](/cli/azure/deployment/group?view=azure-cli-latest#az-deployment-group-create&preserve-view=true) command, you can't override parameters.

1. Replace your starter pipeline with the following YAML. It creates a resource group and deploys a [`.bicepparam`](/azure/azure-resource-manager/bicep/parameter-files) file by using an [Azure CLI task](/azure/devops/pipelines/tasks/reference/azure-cli-v2):

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

    For the descriptions of the task inputs, see [Azure CLI v2 task](/azure/devops/pipelines/tasks/reference/azure-cli-v2). When using the task on air-gapped cloud, you must set the `useGlobalConfig` property of the task to `true`. The default value is `false`.

1. Update the values of `azureServiceConnection` and `location`.
1. Verify you have a valid `main.bicepparam` file in your repo that contains a [`using`](/azure/azure-resource-manager/bicep/bicep-using) statement.
1. Select **Save**. The build pipeline runs automatically. Go back to the summary for your build pipeline, and watch the status.

## Clean up resources

When the Azure resources are no longer needed, use the Azure CLI or Azure PowerShell to delete the quickstart resource group.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group delete --name exampleRG
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

> [!div class="nextstepaction"]
> [Deploy Bicep files by using GitHub Actions](deploy-github-actions.md)
