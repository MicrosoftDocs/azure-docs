---
title: Use Azure Pipelines to build & deploy HPC solutions
description: Learn how to deploy a build/release pipeline for an HPC application running on Azure Batch.
author: chrisreddington
ms.author: chredd
ms.date: 03/04/2021
ms.topic: how-to
---

# Use Azure Pipelines to build and deploy HPC solutions

Tools provided by Azure DevOps can translate into automated building and testing of high performance computing (HPC) solutions. [Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines) provides a range of modern continuous integration (CI) and continuous deployment (CD) processes for building, deploying, testing, and monitoring software. These processes accelerate your software delivery, allowing you to focus on your code rather than support infrastructure and operations.

This article explains how to set up CI/CD processes using [Azure Pipelines](/azure/devops/pipelines/get-started/what-is-azure-pipelines) for HPC solutions deployed on Azure Batch.

## Prerequisites

To follow the steps in this article, you need an [Azure DevOps organization](/azure/devops/organizations/accounts/create-organization). You'll also need to [create a project in Azure DevOps](/azure/devops/organizations/projects/create-project).

It's helpful to have a basic understanding of [Source control](/azure/devops/user-guide/source-control) and [Azure Resource Manager template syntax](../azure-resource-manager/templates/syntax.md) before you start.

## Create an Azure Pipeline

In this example, you'll create a build and release pipeline to deploy an Azure Batch infrastructure and release an application package. Assuming that the code is developed locally, this is the general deployment flow:

![Diagram showing the flow of deployment in the Pipeline,](media/batch-ci-cd/DeploymentFlow.png)

This sample uses several Azure Resource Manager templates and existing binaries. You can copy these examples into your repository and push them to Azure DevOps.

### Understand the Azure Resource Manager templates

This example uses several Azure Resource Manager templates to deploy the solution. Three capability templates (similar to units or modules) are used to implement a specific piece of functionality. An end-to-end solution template (deployment.json) is then used to deploy those underlying capability templates. This [linked template structure ](../azure-resource-manager/templates/deployment-tutorial-linked-template.md) allows each capability template to be individually tested and reused across solutions.

![Diagram showing a linked template structure using Azure Resource Manager templates.](media/batch-ci-cd/ARMTemplateHierarchy.png)

This template defines an Azure storage account, which is required in order to deploy the application to the Batch account. For detailed information, see the [Resource Manager template reference guide for Microsoft.Storage resource types](/azure/templates/microsoft.storage/allversions).

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "accountName": {
            "type": "string",
            "metadata": {
                 "description": "Name of the Azure Storage Account"
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

The next template defines an [Azure Batch account](accounts.md). The Batch account acts as a platform to run numerous applications across [pools](nodes-and-pools.md#pools). For detailed information, see the [Resource Manager template reference guide for Microsoft.Batch resource types](/azure/templates/microsoft.batch/allversions).

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

The next template creates a Batch pool in the Batch account. For detailed information, see the [Resource Manager template reference guide for Microsoft.Batch resource types](/azure/templates/microsoft.batch/allversions).

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
                            "publisher": "Canonical",
                            "offer": "UbuntuServer",
                            "sku": "18.04-LTS",
                            "version": "latest"
                        },
                        "nodeAgentSkuId": "batch.node.ubuntu 18.04"
                    }
                },
                "vmSize": "Standard_D1_v2"
            }
          }
    ],
    "outputs": {}
}
```

The final template acts as an orchestrator, deploying the three underlying capability templates.

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

### Understand the HPC solution

As noted earlier, this sample uses several Azure Resource Manager templates and existing binaries. You can copy these examples into your repository and push them to Azure DevOps.

For this solution, ffmpeg is used as the application package. You can [download the ffmpeg package](https://github.com/GyanD/codexffmpeg/releases/tag/4.3.1-2020-11-08) if you don't have it already.

![Screenshot of the repository structure.](media/batch-ci-cd/git-repository.jpg)

There are four main sections to this repository:

- An **arm-templates** folder, containing the Azure Resource Manager templates
- An **hpc-application** folder, containing the Windows 64-bit version of [ffmpeg 4.3.1](https://github.com/GyanD/codexffmpeg/releases/tag/4.3.1-2020-11-08).
- A **pipelines** folder, containing a YAML file that defines the build pipeline process.
- Optional: A **client-application** folder, which is a copy of the [Azure Batch .NET File Processing with ffmpeg](https://github.com/Azure-Samples/batch-dotnet-ffmpeg-tutorial) sample. This application is not needed for this article.


> [!NOTE]
> This is just one example of a structure to a codebase. This approach is used for the purposes of demonstrating that application, infrastructure, and pipeline code are stored in the same repository.

Now that the source code is set up, you can begin the first build.

## Continuous integration

[Azure Pipelines](/azure/devops/pipelines/get-started/), within Azure DevOps Services, helps you implement a build, test, and deployment pipeline for your applications.

In this stage of your pipeline, tests are typically run to validate code and build the appropriate pieces of the software. The number and types of tests, and any additional tasks that you run will depend on your wider build and release strategy.

## Prepare the HPC application

In this section, you'll work with the **hpc-application** folder. This folder contains the software (ffmpeg) that will run within the Azure Batch account.

1. Navigate to the Builds section of Azure Pipelines in your Azure DevOps organization. Create a **New pipeline**.

    ![Screenshot of the New pipeline screen.](media/batch-ci-cd/new-build-pipeline.jpg)

1. You have two options to create a Build pipeline:

    a. [Use the Visual Designer](/azure/devops/pipelines/get-started-designer). To do so, select "Use the visual designer" on the **New pipeline** page.

    b. [Use YAML Builds](/azure/devops/pipelines/get-started-yaml). You can create a new YAML pipeline by clicking the Azure Repos or GitHub option on the **New pipeline** page. Alternatively, you can store the example below in your source control and reference an existing YAML file by selecting Visual Designer, then using the YAML template.

    ```yml
    # To publish an application into Azure Batch, we need to
    # first zip the file, and then publish an artifact, so that
    # we can take the necessary steps in our release pipeline.
    steps:
    # First, we Zip up the files required in the Batch Account
    # For this instance, those are the ffmpeg files
    - task: ArchiveFiles@2
      displayName: 'Archive applications'
      inputs:
        rootFolderOrFile: hpc-application
        includeRootFolder: false
        archiveFile: '$(Build.ArtifactStagingDirectory)/package/$(Build.BuildId).zip'
    # Publish that zip file, so that we can use it as part
    # of our Release Pipeline later
    - task: PublishPipelineArtifact@0
      inputs:
        artifactName: 'hpc-application'
        targetPath: '$(Build.ArtifactStagingDirectory)/package'
    ```

1. Once the build is configured as needed, select **Save & Queue**. If you have continuous integration enabled (in the **Triggers** section), the build will automatically trigger when a new commit to the repository is made, meeting the conditions set in the build.

    ![Screenshot of an existing Build Pipeline.](media/batch-ci-cd/existing-build-pipeline.jpg)

1. View live updates on the progress of your build in Azure DevOps by navigating to the **Build** section of Azure Pipelines. Select the appropriate build from your build definition.

    ![Screenshot of live outputs from build in Azure DevOps.](media/batch-ci-cd/Build-1.jpg)

> [!NOTE]
> If you use a client application to execute your HPC solution, you need to create a separate build definition for that application. You can find a number of how-to guides in the [Azure Pipelines](/azure/devops/pipelines/get-started/index) documentation.

## Continuous deployment

Azure Pipelines is also used to deploy your application and underlying infrastructure. [Release pipelines](/azure/devops/pipelines/release) enable continuous deployment and automates your release process.

### Deploy your application and underlying infrastructure

There are a number of steps involved in deploying the infrastructure. Because this solution uses [linked templates](../azure-resource-manager/templates/linked-templates.md), those templates will need to be accessible from a public endpoint (HTTP or HTTPS). This could be a repository on GitHub, or an Azure Blob Storage Account, or another storage location. The uploaded template artifacts can remain secure, as they can be held in a private mode but accessed using some form of shared access signature (SAS) token.

The following example demonstrates how to deploy an infrastructure with templates from an Azure Storage blob.

1. Create a **New Release Definition**, then select an empty definition. Rename the newly created environment to something relevant for your pipeline.

    ![Screenshot of the initial release pipeline.](media/batch-ci-cd/Release-0.jpg)

1. Create a dependency on the Build Pipeline to get the output for the HPC application.

    > [!NOTE]
    > Take note of the **Source Alias**, as this will be needed when tasks are created inside of the Release Definition.

    ![Screenshot showing an artifact link to the HPCApplicationPackage in the appropriate build pipeline.](media/batch-ci-cd/Release-1.jpg)

1. Create a link to another artifact, this time, an Azure Repo. This is required to access the Resource Manager templates stored in your repository. As Resource Manager templates do not require compilation, you don't need to push them through a build pipeline.

    > [!NOTE]
    > Once again, note the **Source Alias**, as this will be needed later.

    ![Screenshot showing an artifact link to the Azure Repos.](media/batch-ci-cd/Release-2.jpg)

1. Navigate to the **variables** section. You'll want to create a number of variables in your pipeline so that you don't have to re-enter the same information into multiple tasks. This example uses the following variables:

   - **applicationStorageAccountName**: Name of the storage account that holds the HPC application binaries
   - **batchAccountApplicationName**: Name of the application in the Batch account
   - **batchAccountName**: Name of the Batch account
   - **batchAccountPoolName**: Name of the pool of VMs doing the processing
   - **batchApplicationId**: Unique ID for the Batch application
   - **batchApplicationVersion**: Semantic version of your Batch application (that is, the ffmpeg binaries)
   - **location**: Location for the Azure resources to be deployed
   - **resourceGroupName**: Name of the resource group to be created, and where your resources will be deployed
   - **storageAccountName**: Name of the storage account that holds the linked Resource Manager templates

   ![Screenshot showing variables set for the Azure Pipelines release.](media/batch-ci-cd/Release-4.jpg)

1. Navigate to the tasks for the Dev environment. In the below snapshot, you can see six tasks. These tasks will: download the zipped ffmpeg files, deploy a storage account to host the nested Resource Manager templates, copy those Resource Manager templates to the storage account, deploy the batch account and required dependencies, create an application in the Azure Batch Account and upload the application package to the Azure Batch Account.

    ![Screenshot showing the tasks used to release the HPC Application to Azure Batch.](media/batch-ci-cd/Release-3.jpg)

1. Add the **Download Pipeline Artifact (Preview)** task and set the following properties:
    - **Display Name:** Download ApplicationPackage to Agent
    - **The name of the artifact to download:** hpc-application
    - **Path to download to**: $(System.DefaultWorkingDirectory)

1. Create a Storage Account to store your Azure Resource Manager templates. An existing storage account from the solution could be used, but to support this self-contained sample and isolation of content, you'll make a dedicated storage account.

    Add the **Azure Resource Group Deployment** task and set the following properties:
    - **Display Name:** Deploy storage account for Resource Manager templates
    - **Azure Subscription:** Select the appropriate Azure subscription
    - **Action**: Create or update resource group
    - **Resource Group**: $(resourceGroupName)
    - **Location**: $(location)
    - **Template**: $(System.ArtifactsDirectory)/**{YourAzureRepoArtifactSourceAlias}**/arm-templates/storageAccount.json
    - **Override template parameters**: -accountName $(storageAccountName)

1. Upload the artifacts from source control into the storage account by using Azure Pipelines. As part of this Azure Pipelines task, the storage account container URI and SAS Token can be outputted to a variable in Azure Pipelines, allowing them to be reused throughout this agent phase.

    Add the **Azure File Copy** task and set the following properties:
    - **Source:** $(System.ArtifactsDirectory)/**{YourAzureRepoArtifactSourceAlias}**/arm-templates/
    - **Azure Connection Type**: Azure Resource Manager
    - **Azure Subscription:** Select the appropriate Azure subscription
    - **Destination Type**: Azure Blob
    - **RM Storage Account**: $(storageAccountName)
    - **Container Name**: templates
    - **Storage Container URI**: templateContainerUri
    - **Storage Container SAS Token**: templateContainerSasToken

1. Deploy the orchestrator template. This template includes parameters for the storage account container URI and SAS token. The variables required in the Resource Manager template are either held in the variables section of the release definition, or were set from another Azure Pipelines task (for example, part of the Azure Blob Copy task).

    Add the **Azure Resource Group Deployment** task and set the following properties:
    - **Display Name:** Deploy Azure Batch
    - **Azure Subscription:** Select the appropriate Azure subscription
    - **Action**: Create or update resource group
    - **Resource Group**: $(resourceGroupName)
    - **Location**: $(location)
    - **Template**: $(System.ArtifactsDirectory)/**{YourAzureRepoArtifactSourceAlias}**/arm-templates/deployment.json
    - **Override template parameters**: `-templateContainerUri $(templateContainerUri) -templateContainerSasToken $(templateContainerSasToken) -batchAccountName $(batchAccountName) -batchAccountPoolName $(batchAccountPoolName) -applicationStorageAccountName $(applicationStorageAccountName)`

   A common practice is to use Azure Key Vault tasks. If the service principal connected to your Azure subscription has an appropriate access policies set, it can download secrets from an Azure Key Vault and be used as variables in your pipeline. The name of the secret will be set with the associated value. For example, a secret of sshPassword could be referenced with $(sshPassword) in the release definition.

1. The next steps call the Azure CLI. The first is used to create an application in Azure Batch and upload associated packages.

    Add the **Azure CLI** task and set the following properties:
    - **Display Name:** Create application in Azure Batch account
    - **Azure Subscription:** Select the appropriate Azure subscription
    - **Script Location**: Inline Script
    - **Inline Script**: `az batch application create --application-id $(batchApplicationId) --name $(batchAccountName) --resource-group $(resourceGroupName)`

1. The second step is used to upload associated packages to the application (in this case, the ffmpeg files).

    Add the **Azure CLI** task and set the following properties:
    - **Display Name:** Upload package to Azure Batch account
    - **Azure Subscription:** Select the appropriate Azure subscription
    - **Script Location**: Inline Script
    - **Inline Script**: `az batch application package create --application-id $(batchApplicationId)  --name $(batchAccountName)  --resource-group $(resourceGroupName) --version $(batchApplicationVersion) --package-file=$(System.DefaultWorkingDirectory)/$(Release.Artifacts.{YourBuildArtifactSourceAlias}.BuildId).zip`

    > [!NOTE]
    > The version number of the application package is set to a variable. This allows overwriting previous versions of the package and lets you manually control the version number of the package pushed to Azure Batch.

1. Create a new release by selecting **Release > Create a new release**. Once triggered, select the link to your new release to view the status.

1. View the live output from the agent by selecting the **Logs** button underneath your environment.

    ![Screenshot showing status of the release.](media/batch-ci-cd/Release-5.jpg)

## Test the environment

Once the environment is set up, confirm the following tests can be completed successfully.

Connect to the new Azure Batch Account, using the Azure CLI from a PowerShell command prompt.

- Sign in to your Azure account with `az login` and follow the instructions to authenticate.
- Now authenticate the Batch account: `az batch account login -g <resourceGroup> -n <batchAccount>`

#### List the available applications

```azurecli
az batch application list -g <resourcegroup> -n <batchaccountname>
```

#### Check the pool is valid

```azurecli
az batch pool list
```

Note the value of `currentDedicatedNodes` from the output of this command. This value is adjusted in the next test.

#### Resize the pool

Resize the pool so there are compute nodes available for job and task testing, check with the pool list command to see the current status until the resizing has completed and there are available nodes

```azurecli
az batch pool resize --pool-id <poolname> --target-dedicated-nodes 4
```

## Next steps

See these tutorials to learn how to interact with a Batch account via a simple application.

- [Run a parallel workload with Azure Batch using the Python API](tutorial-parallel-python.md)
- [Run a parallel workload with Azure Batch using the .NET API](tutorial-parallel-dotnet.md)