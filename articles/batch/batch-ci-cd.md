---
title: Use Azure Pipelines to build and deploy HPC solutions
description: Use Azure Pipelines CI/CD build and release pipelines to deploy Azure Resource Manager templates for an Azure Batch high performance computing (HPC) solution.
author: chrisreddington
ms.author: chredd
ms.date: 04/04/2023
ms.topic: how-to
---

# Use Azure Pipelines to build and deploy HPC solutions

Azure DevOps tools can automate building and testing Azure Batch high performance computing (HPC) solutions. [Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines) provides modern continuous integration (CI) and continuous deployment (CD) processes for building, deploying, testing, and monitoring software. These processes accelerate your software delivery, allowing you to focus on your code rather than support infrastructure and operations.

This article shows how to set up CI/CD processes by using [Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines) with Azure Resource Manager templates (ARM templates) to deploy HPC solutions on Azure Batch.

## Prerequisites

To follow the steps in this article, you need:

- An [Azure DevOps organization](/azure/devops/organizations/accounts/create-organization) and an [Azure DevOps project](/azure/devops/organizations/projects/create-project) created in the organization.

- A basic understanding of [source control](/azure/devops/user-guide/source-control) and [ARM template syntax](/azure/azure-resource-manager/templates/syntax).

## Set up the solution

This example creates a build and release pipeline to deploy an Azure Batch infrastructure and release an application package. The following diagram shows the general deployment flow, assuming the code is developed locally:

![Diagram showing the flow of deployment in the pipeline.](media/batch-ci-cd/DeploymentFlow.png)

The example uses several ARM templates and existing binaries to deploy the solution. You can copy or download these examples and push them to an Azure DevOps repository.

>[!IMPORTANT]
>This article deploys Windows software on Windows-based Batch node pools. Azure Pipelines, ARM templates, and Batch also fully support Linux and macOS software and nodes.

### Understand the ARM templates

Three capability templates, similar to units or modules, implement specific pieces of functionality. An end-to-end solution template then deploys the underlying capability templates. This [linked template structure](/azure/azure-resource-manager/templates/deployment-tutorial-linked-template) allows each capability template to be individually tested and reused across solutions.

![Diagram showing a linked template structure using ARM templates.](media/batch-ci-cd/ARMTemplateHierarchy.png)

For detailed information about the templates, see the [Resource Manager template reference guide for Microsoft.Batch resource types](/azure/templates/microsoft.batch/allversions).

#### Storage account template

The following *storageAccount.json* template defines an Azure Storage account, which is required to deploy the application to the Batch account.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "accountName": {
            "type": "string",
            "metadata": {
                 "description": "Name of the Azure storage account"
             }
         }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Storage/storageAccounts",
            "name": "[parameters('accountName')]",
            "sku": {
                "name": "Standard_LRS"
            },
            "apiVersion": "2018-02-01",
            "location": "[resourceGroup().location]",
            "properties": {}
        }
    ],
    "outputs": {
        "blobEndpoint": {
          "type": "string",
          "value": "[reference(resourceId('Microsoft.Storage/storageAccounts', parameters('accountName'))).primaryEndpoints.blob]"
        },
        "resourceId": {
          "type": "string",
          "value": "[resourceId('Microsoft.Storage/storageAccounts', parameters('accountName'))]"
        }
    }
}
```

#### Batch account template

The next *batchAccount.json* template defines an [Azure Batch account](accounts.md). The Batch account acts as a platform to run several applications across [pools](nodes-and-pools.md#pools).

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "batchAccountName": {
           "type": "string",
           "metadata": {
                "description": "Name of the Azure Batch Account"
            }
        },
        "storageAccountId": {
           "type": "string",
           "metadata": {
                "description": "ID of the Azure Storage Account"
            }
        }
    },
    "variables": {},
    "resources": [
        {
            "name": "[parameters('batchAccountName')]",
            "type": "Microsoft.Batch/batchAccounts",
            "apiVersion": "2017-09-01",
            "location": "[resourceGroup().location]",
            "properties": {
              "poolAllocationMode": "BatchService",
              "autoStorage": {
                  "storageAccountId": "[parameters('storageAccountId')]"
              }
            }
          }
    ],
    "outputs": {}
}
```

#### Batch pool template

The next *batchAccountPool.json* template creates a Batch pool in the Batch account.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "batchAccountName": {
           "type": "string",
           "metadata": {
                "description": "Name of the Azure Batch Account"
           }
        },
        "batchAccountPoolName": {
            "type": "string",
            "metadata": {
                 "description": "Name of the Azure Batch Account Pool"
             }
         }
    },
    "variables": {},
    "resources": [
        {
            "name": "[concat(parameters('batchAccountName'),'/', parameters('batchAccountPoolName'))]",
            "type": "Microsoft.Batch/batchAccounts/pools",
            "apiVersion": "2017-09-01",
            "properties": {
                "deploymentConfiguration": {
                    "virtualMachineConfiguration": {
                        "imageReference": {
                            "publisher": "MicrosoftWindowsServer",
                            "offer": "WindowsServer",
                            "sku": "2022-datacenter",
                            "version": "latest"
                        },
                        "nodeAgentSkuId": "batch.node.windows amd64"
                    }
                },
                "vmSize": "Standard_D2s_v3"
            }
          }
    ],
    "outputs": {}
}
```

#### Orchestrator template

The final *deployment.json* template acts as an orchestrator, deploying the three underlying capability templates.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "templateContainerUri": {
           "type": "string",
           "metadata": {
                "description": "URI of the Blob Storage Container containing the Azure Resource Manager templates"
            }
        },
        "templateContainerSasToken": {
           "type": "string",
           "metadata": {
                "description": "The SAS token of the container containing the Azure Resource Manager templates"
            }
        },
        "applicationStorageAccountName": {
            "type": "string",
            "metadata": {
                 "description": "Name of the Azure Storage Account"
            }
         },
        "batchAccountName": {
            "type": "string",
            "metadata": {
                 "description": "Name of the Azure Batch Account"
            }
         },
         "batchAccountPoolName": {
             "type": "string",
             "metadata": {
                  "description": "Name of the Azure Batch Account Pool"
              }
          }
    },
    "variables": {},
    "resources": [
        {
            "apiVersion": "2017-05-10",
            "name": "storageAccountDeployment",
            "type": "Microsoft.Resources/deployments",
            "properties": {
                "mode": "Incremental",
                "templateLink": {
                  "uri": "[concat(parameters('templateContainerUri'), '/storageAccount.json', parameters('templateContainerSasToken'))]",
                  "contentVersion": "1.0.0.0"
                },
                "parameters": {
                    "accountName": {"value": "[parameters('applicationStorageAccountName')]"}
                }
            }
        },  
        {
            "apiVersion": "2017-05-10",
            "name": "batchAccountDeployment",
            "type": "Microsoft.Resources/deployments",
            "dependsOn": [
                "storageAccountDeployment"
            ],
            "properties": {
                "mode": "Incremental",
                "templateLink": {
                  "uri": "[concat(parameters('templateContainerUri'), '/batchAccount.json', parameters('templateContainerSasToken'))]",
                  "contentVersion": "1.0.0.0"
                },
                "parameters": {
                    "batchAccountName": {"value": "[parameters('batchAccountName')]"},
                    "storageAccountId": {"value": "[reference('storageAccountDeployment').outputs.resourceId.value]"}
                }
            }
        },
        {
            "apiVersion": "2017-05-10",
            "name": "poolDeployment",
            "type": "Microsoft.Resources/deployments",
            "dependsOn": [
                "batchAccountDeployment"
            ],
            "properties": {
                "mode": "Incremental",
                "templateLink": {
                  "uri": "[concat(parameters('templateContainerUri'), '/batchAccountPool.json', parameters('templateContainerSasToken'))]",
                  "contentVersion": "1.0.0.0"
                },
                "parameters": {
                    "batchAccountName": {"value": "[parameters('batchAccountName')]"},
                    "batchAccountPoolName": {"value": "[parameters('batchAccountPoolName')]"}
                }
            }
        }
    ],
    "outputs": {}
}
```

### Set up your repository

Upload the ARM templates, existing binaries, and YAML build definition file into an Azure Repos repository.

1. Set up a folder structure for your repository with four main sections:

   - An *arm-templates* folder to contain the ARM templates.
   - A *hpc-application* folder to contain ffmpeg.
   - A *pipelines* folder to contain the YAML build definition file for the Build pipeline.
   - Optionally, a *client-application* folder, with a copy of the [Azure Batch .NET File Processing with ffmpeg](https://github.com/Azure-Samples/batch-dotnet-ffmpeg-tutorial) sample. The current article doesn't use this sample.

   ![Screenshot of the repository structure.](media/batch-ci-cd/git-repository.png)

   > [!NOTE]
   > This example codebase structure demonstrates that you can store application, infrastructure, and pipeline code in the same repository.

1. Upload the four ARM templates to the *arm-templates* folder of your repository.

1. This solution uses ffmpeg as the application package. [Download the Windows 64-bit version of ffmpeg 4.3.1](https://github.com/GyanD/codexffmpeg/releases/tag/4.3.1-2020-11-08) if you don't have it, and upload it to the *hpc-application* folder of your repository.

1. Upload the following build definition in a file named *hpc-app.build.yml* to the *pipelines* folder of your repository.

   ```yml
   # To publish an application into Batch, you need to
   # first zip the file, and then publish an artifact, so
   # you can take the necessary steps in your release pipeline.
   steps:
   # First, zip up the files required in the Batch account.
   # For this instance, those are the ffmpeg files.
   - task: ArchiveFiles@2
     displayName: 'Archive applications'
     inputs:
       rootFolderOrFile: hpc-application
       includeRootFolder: false
       archiveFile: '$(Build.ArtifactStagingDirectory)/package/$(Build.BuildId).zip'
   # Publish the zip file, so you can use it as part
   # of your Release Pipeline later.
   - task: PublishPipelineArtifact@0
     inputs:
       artifactName: 'hpc-application'
       targetPath: '$(Build.ArtifactStagingDirectory)/package'
   ```

## Create the Azure pipeline

After you set up the source code repository, use [Azure Pipelines](/azure/devops/pipelines/get-started/) to implement a build, test, and deployment pipeline for your application. In this stage of a pipeline, you typically run tests to validate code and build pieces of the software. The number and types of tests, and any other tasks that you run, depend on your overall build and release strategy.

### Create the Build pipeline

In this section, you create a [YAML build pipeline](/azure/devops/pipelines/get-started-yaml) to work with the ffmpeg software that runs in the Batch account.

1. In your Azure DevOps project, select **Pipelines** from the left navigation, and then select **New pipeline**.

1. On the **Where is your code** screen, select **Azure Repos Git**.

   ![Screenshot of the New pipeline screen.](media/batch-ci-cd/new-build-pipeline.png)

1. On the **Select a repository** screen, select your repository.

   >[!NOTE]
   >You can also create a build pipeline by using a visual designer. On the **New pipeline** page, select **Use the classic editor**. You can also use a YAML template in the visual designer. For more information, see [Define your Classic pipeline](/azure/devops/pipelines/release/define-multistage-release-process).

1. On the **Configure your pipeline** screen, select **Existing Azure Pipelines YAML file**.

1. On the **Select an existing YAML file** screen, select the *hpc-app.build.yml* file from your repository, and then select **Continue**.

1. On the **Review your pipeline YAML** screen, review the build configuration, and then select **Run**, or select the dropdown caret next to **Run** and select **Save**. This template enables continuous integration, so the build automatically triggers when a new commit to the repository meets the conditions set in the build.

   ![Screenshot of an existing Build pipeline.](media/batch-ci-cd/review-pipeline.png)

1. You can view live build progress updates. To see build outcomes, select the appropriate run from your build definition in Azure Pipelines.

   ![Screenshot of live outputs from build in Azure Pipelines.](media/batch-ci-cd/first-build.png)

> [!NOTE]
> If you use a client application to run your HPC solution, you need to create a separate build definition for that application. For how-to guides, see the [Azure Pipelines](/azure/devops/pipelines/get-started/index) documentation.

### Create the Release pipeline

You also use Azure Pipelines to deploy your application and underlying infrastructure. [Release pipelines](/azure/devops/pipelines/release) enable CD and automate your release process. There are several steps to deploy your application and underlying infrastructure.

The [linked templates](/azure/azure-resource-manager/templates/linked-templates) for this solution must be accessible from a public HTTP or HTTPS endpoint. This endpoint could be a GitHub repository, an Azure Blob Storage account, or another storage location. To ensure that the uploaded template artifacts remain secure, hold them in a private mode, but access them by using some form of shared access signature (SAS) token.

The following example demonstrates how to deploy an infrastructure with templates from an Azure Storage blob.

#### Set up the pipeline

1. In your Azure DevOps project, select **Pipelines** > **Releases** in the left navigation.

1. On the next screen, select **New** > **New release pipeline**.

1. On the **Select a template** screen, select **Empty job**, and then close the **Stage** screen.

1. Select **New release pipeline** at the top of the page and rename the pipeline to something relevant for your pipeline, such as *Deploy Azure Batch + Pool*.

   ![Screenshot of the initial release pipeline.](media/batch-ci-cd/rename.png)

1. In the **Artifacts** section, select **Add**.

1. On the **Add an artifact** screen, select **Build** and then select your Build pipeline to get the output for the HPC application.

   > [!NOTE]
   > You can create a **Source alias** or accept the default. Take note of the **Source alias** value, as you need it to create tasks in the release definition.

   ![Screenshot showing an artifact link to the hpc-application package in the build pipeline.](media/batch-ci-cd/build-artifact.png)

1. Select **Add**.

1. On the pipeline page, select **Add** next to **Artifacts** to create a link to another artifact, your Azure Repos repository. This link is required to access the ARM templates in your repository. ARM templates don't need compilation, so you don't need to push them through a build pipeline.

   > [!NOTE]
   > Again note the **Source alias** value to use later.

    ![Screenshot showing an artifact link to the Azure Repos repository.](media/batch-ci-cd/repo-artifact.png)

1. Select the **Variables** tab. Create the following variables in your pipeline so you don't have to reenter the same information into multiple tasks.

   - **applicationStorageAccountName**: Name of the storage account that holds the HPC application binaries
   - **batchAccountApplicationName**: Name of the application in the Batch account
   - **batchAccountName**: Name of the Batch account
   - **batchAccountPoolName**: Name of the pool of VMs doing the processing
   - **batchApplicationId**: Unique ID for the Batch application
   - **batchApplicationVersion**: Semantic version of your Batch application, the ffmpeg binaries
   - **location**: Location for the Azure resources to be deployed
   - **resourceGroupName**: Name of the resource group where your resources are deployed
   - **storageAccountName**: Name of the storage account that holds the linked ARM templates

   ![Screenshot showing variables set for the Azure Pipelines release.](media/batch-ci-cd/variables.png)

#### Add tasks

1. Select the **Tasks** tab, and then select **Agent job**.

1. On the **Agent job** screen, under **Agent pool**, select **Azure Pipelines**.

1. Under **Agent Specification**, select **windows-latest**.

1. Create six tasks to:

   - Download the zipped ffmpeg files.
   - Deploy a storage account to host the nested ARM templates.
   - Copy the ARM templates to the Storage account.
   - Deploy the Batch account and required dependencies.
   - Create an application in the Batch account.
   - Upload the application package to the Batch account.

   For each new task:

   1. Select the **+** symbol next to **Agent job** in the left pane.
   1. Search for and select the task in the right pane.
   1. Configure the task.
   1. Select **Add**.

   ![Screenshot showing the tasks used to release the HPC Application to Azure Batch.](media/batch-ci-cd/release-pipeline.png)

1. Add the **Download Pipeline Artifacts** task and set the following properties:
   - **Display name:** *Download ApplicationPackage to Agent*
   - **Artifact name:** *hpc-application*
   - **Destination directory**: *$(System.DefaultWorkingDirectory)*

1. Create a Storage account to store your ARM templates. You could use an existing storage account from the solution, but to support this self-contained sample and isolation of content, make a dedicated storage account.

   Add the **ARM Template deployment: Resource Group scope** task and set the following properties:
   - **Display name:** *Deploy storage account for ARM templates*
   - **Azure Resource Manager connection**: Select the service connection to use.
   - **Subscription:** Select the appropriate Azure subscription.
   - **Action**: Select **Create or update resource group**.
   - **Resource group**: *$(resourceGroupName)*
   - **Location**: *$(location)*
   - **Template**: *$(System.ArtifactsDirectory)/\<AzureRepoArtifactSourceAlias>/arm-templates/storageAccount.json*
   - **Override template parameters**: `-accountName $(storageAccountName)`

1. Upload the artifacts from source control into the storage account. As part of this Azure Pipelines task, the storage account container URI and SAS Token can be output to a variable in Azure Pipelines, so they can be reused throughout this agent phase.

   Add the **Azure File Copy** task and set the following properties:
   - **Source:** *$(System.ArtifactsDirectory)/\<AzureRepoArtifactSourceAlias>/arm-templates/*
   - **Azure Subscription:** Select the appropriate Azure subscription.
   - **Destination Type**: *Azure Blob*
   - **RM Storage Account**: *$(storageAccountName)*
   - **Container Name**: *templates*

1. Deploy the orchestrator template to create the Batch account and pool. This template includes parameters for the Storage account container URI and SAS token. The variables required in the ARM template are either held in the variables section of the release definition, or were set from another Azure Pipelines task, for example the AzureBlob File Copy task.

   Add the **ARM Template deployment: Resource Group scope** task and set the following properties:
   - **Display name:** *Deploy Azure Batch*
   - **Subscription:** Select the appropriate Azure subscription.
   - **Action**: Create or update resource group
   - **Resource group**: *$(resourceGroupName)*
   - **Location**: *$(location)*
   - **Template**: *$(System.ArtifactsDirectory)/\<AzureRepoArtifactSourceAlias>/arm-templates/deployment.json*
   - **Override template parameters**: `-templateContainerUri $(templateContainerUri) -templateContainerSasToken $(templateContainerSasToken) -batchAccountName $(batchAccountName) -batchAccountPoolName $(batchAccountPoolName) -applicationStorageAccountName $(applicationStorageAccountName)`

   A common practice is to use Azure Key Vault tasks. If the service principal connected to your Azure subscription has an appropriate access policy set, it can download secrets from Key Vault and be used as a variable in your pipeline. The name of the secret is set with the associated value. For example, you could reference a secret of **sshPassword** with *$(sshPassword)* in the release definition.

1. Call Azure CLI to create an application in Azure Batch and upload associated packages.

   Add the **Azure CLI** task and set the following properties:
   - **Display name:** *Create application in Azure Batch account*
   - **Azure Resource Manager connection:** Select the appropriate Azure subscription
   - **Script Location**: Select **Inline script**.
   - **Inline Script**: `az batch application create --application-id $(batchApplicationId) --name $(batchAccountName) --resource-group $(resourceGroupName)`

1. Call Azure CLI to upload associated packages to the application, in this case the ffmpeg files.

   Add the **Azure CLI** task and set the following properties:
   - **Display name:** *Upload package to Azure Batch account*
   - **Azure Subscription:** Select the appropriate Azure subscription
   - **Script Location**: Select **Inline script**.
   - **Inline Script**: `az batch application package create --application-id $(batchApplicationId)  --name $(batchAccountName)  --resource-group $(resourceGroupName) --version $(batchApplicationVersion) --package-file=$(System.DefaultWorkingDirectory)/$(Release.Artifacts.{YourBuildArtifactSourceAlias}.BuildId).zip`

   > [!NOTE]
   > The version number of the application package is set to a variable. The variable allows overwriting previous versions of the package and lets you manually control the package version pushed to Azure Batch.

#### Create and run the release

1. When you finish creating all the steps, select **Save** at the top of the pipeline page, and then select **OK**.

1. Select **Create release** at the top of the page.

1. To view the release status, select the link to the new release.

1. To view the live output from the agent, select the **Logs** button underneath your environment.

   ![Screenshot showing status of the release.](media/batch-ci-cd/release.png)

## Test the environment

Once the environment is set up, confirm that the following tests run successfully.

#### Connect to the Batch account

Connect to the new Batch account by using Azure CLI from a command prompt.

1. Sign in to your Azure account with `az login` and follow the instructions to authenticate.
1. Authenticate the Batch account with `az batch account login -g <resourceGroup> -n <batchAccount>`.

#### List the available applications

```azurecli
az batch application list -g <resourceGroup> -n <batchAccount>
```

#### Check that the pool is valid

```azurecli
az batch pool list
```

In the command output, note the value of `currentDedicatedNodes` to adjust in the next test.

#### Resize the pool

Resize the pool so there are compute nodes available for job and task testing. Check status by running the `pool list` command until the resizing completes and there are available nodes.

```azurecli
az batch pool resize --pool-id <poolname> --target-dedicated-nodes 4
```

## Next steps

See these tutorials to learn how to interact with a Batch account via a simple application.

- [Run a parallel workload with Azure Batch by using the Python API](tutorial-parallel-python.md)
- [Run a parallel workload with Azure Batch by using the .NET API](tutorial-parallel-dotnet.md)