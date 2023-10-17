---
title: CI/CD with Azure Pipelines and Bicep files
description: In this quickstart, you learn how to configure continuous integration in Azure Pipelines by using Bicep files. It shows how to use an Azure CLI task to deploy a Bicep file.
ms.topic: quickstart
ms.custom: devx-track-bicep, devx-track-azurecli
ms.date: 06/21/2023
---

# Quickstart: Integrate Bicep with Azure Pipelines

This quickstart shows you how to integrate Bicep files with Azure Pipelines for continuous integration and continuous deployment (CI/CD).

It provides a short introduction to the pipeline task you need for deploying a Bicep file. If you want more detailed steps on setting up the pipeline and project, see [Deploy Azure resources by using Bicep and Azure Pipelines](/training/paths/bicep-azure-pipelines/).

## Prerequisites

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

You need an Azure DevOps organization. If you don't have one, [create one for free](/azure/devops/pipelines/get-started/pipelines-sign-up). If your team already has an Azure DevOps organization, make sure you're an administrator of the Azure DevOps project that you want to use.

You need to have configured a [service connection](/azure/devops/pipelines/library/connect-to-azure) to your Azure subscription. The tasks in the pipeline execute under the identity of the service principal. For steps to create the connection, see [Create a DevOps project](../templates/deployment-tutorial-pipeline.md#create-a-devops-project).

You need a [Bicep file](./quickstart-create-bicep-use-visual-studio-code.md) that defines the infrastructure for your project. This file is in a repository.

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
> *AzureResourceManagerTemplateDeployment@3* task won't work if you have a *bicepparam* file.

1. Replace your starter pipeline with the following YAML. It creates a resource group and deploys a Bicep file by using an [Azure Resource Manager Template Deployment task](/azure/devops/pipelines/tasks/reference/azure-resource-manager-template-deployment-v3).

    ```yml
    trigger:
    - main

    name: Deploy Bicep files

    variables:
      vmImageName: 'ubuntu-latest'

      azureServiceConnection: '<your-connection-name>'
      resourceGroupName: 'exampleRG'
      location: '<your-resource-group-location>'
      templateFile: './main.bicep'
    pool:
      vmImage: $(vmImageName)

    steps:
    - task: AzureResourceManagerTemplateDeployment@3
      inputs:
        deploymentScope: 'Resource Group'
        azureResourceManagerConnection: '$(azureServiceConnection)'
        action: 'Create Or Update Resource Group'
        resourceGroupName: '$(resourceGroupName)'
        location: '$(location)'
        templateLocation: 'Linked artifact'
        csmFile: '$(templateFile)'
        overrideParameters: '-storageAccountType Standard_LRS'
        deploymentMode: 'Incremental'
        deploymentName: 'DeployPipelineTemplate'
    ```

1. Update the values of `azureServiceConnection` and `location`.
1. Verify you have a `main.bicep` in your repo, and the content of the Bicep file.
1. Select **Save**. The build pipeline automatically runs. Go back to the summary for your build pipeline, and watch the status.

### Use Azure CLI task

1. Replace your starter pipeline with the following YAML. It creates a resource group and deploys a Bicep file by using an [Azure CLI task](/azure/devops/pipelines/tasks/reference/azure-cli-v2):

    ```yml
    trigger:
    - main

    name: Deploy Bicep files

    variables:
      vmImageName: 'ubuntu-latest'

      azureServiceConnection: '<your-connection-name>'
      resourceGroupName: 'exampleRG'
      location: '<your-resource-group-location>'
      templateFile: 'main.bicep'
    pool:
      vmImage: $(vmImageName)

    steps:
    - task: AzureCLI@2
      inputs:
        azureSubscription: $(azureServiceConnection)
        scriptType: bash
        scriptLocation: inlineScript
        useGlobalConfig: false
        inlineScript: |
          az --version
          az group create --name $(resourceGroupName) --location $(location)
          az deployment group create --resource-group $(resourceGroupName) --template-file $(templateFile)
    ```

    To override the parameters, update the last line of `inlineScript` to:

    ```bicep
    az deployment group create --resource-group $(resourceGroupName) --template-file $(templateFile) --parameters storageAccountType='Standard_GRS' location='eastus'
    ```

    For the descriptions of the task inputs, see [Azure CLI task](/azure/devops/pipelines/tasks/reference/azure-cli-v2). When using the task on air-gapped cloud, you must set the `useGlobalConfig` property of the task to `true`. The default value is `false`.

1. Update the values of `azureServiceConnection` and `location`.
1. Verify you have a `main.bicep` in your repo, and the content of the Bicep file.
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
