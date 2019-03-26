---
# This basic template provides core metadata fields for Markdown articles on docs.microsoft.com.

# Mandatory fields.
title: Building a CI/CD Strategy for High Performance Compute using Azure Batch
description: This document discussed the approach of deploying a build/release pipeline for a HPC application running on top of Azure Batch.
author: christianreddington
ms.author: christianreddington, mikewarr # Microsoft employees only
ms.date: 01/08/2018
ms.topic: quickstart
services: batch
ms.custom: fasttrack-new
---
# Building a CI/CD Strategy for High Performance Compute using Azure Batch

DevOps is a concept that we commonly hear from a development team when building a custom application. Those concepts could translate into a High Performance Compute Scenario.

In this article, we will discuss an approach to setting up a Continuous Integration (CI) and Continuous Deployment (CD) pipeline for your HPC solution deployed on Azure Batch.

There are a range of benefits when adopting a modern CI/CD process for builds, deployments, testing and monitoring of your software. Tools such as Azure DevOps can help you to accelerate your software delivery, and focus on your software rather than the supporting infrastructure and operations.

In this example, we will be creating a Build and Release pipeline to deploy our Azure Batch infrastructure and release an application package. Assuming that we are developing the code locally, then the deployment flow would look similar to this:

![Diagram showing the flow of deployment in our Pipeline](media/batch-ci-cd/DeploymentFlow.png)

## Initial Setup

To walk through this sample, you will first need an Azure DevOps organization, and a team project.

* [Create an Azure DevOps Organization](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/create-organization?view=vsts)
* [Create a project in Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/organizations/projects/create-project?view=vsts&tabs=new-nav)

## Source Controlling your environment

Source control is commonly used when developing software. This helps development teams track changes made by users, allowing them to track changes made to the codebase and inspect older versions of the code.

Typically, source control is thought of hand-in-hand with software code. How about the underlying infrastructure? This brings us onto the topic of Infrastructure as Code, where we can use a technology such as Azure Resource Manager (ARM) Templates or other open source alternatives to declaratively define our underlying infrastructure.

> This sample heavily relies on a number of ARM Templates (JSON Documents) and existing binaries. You can copy these examples into your repository and push it to Azure DevOps.
>
> The codebase structure used in the sample resembles the following;
>
> * A folder called arm-templates, containing a number of ARM templates. These templates are shown in this article.
> * A folder called client-application, which is a copy of the [Azure Batch .NET File Processing with ffmpeg](https://github.com/Azure-Samples/batch-dotnet-ffmpeg-tutorial) sample. This is not needed for the walkthrough.
> * A folder called hpc-application, which is the Windows 64-bit version of [ffmpeg 3.4](https://ffmpeg.zeranoe.com/builds/win64/static/ffmpeg-3.4-win64-static.zip).
> * A folder called pipelines. This contains a yaml file outlining our build process. This is discussed in the article.

In this section, we will assume that you have familiarized yourself with version control and designing ARM templates.

* [What is source control?](https://docs.microsoft.com/en-us/azure/devops/user-guide/source-control?view=vsts)
* [Understand the structure and syntax of Azure Resource Manager Templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authoring-templates)

### ARM Templates

In this example, we will leverage multiple ARM Templates to deploy our solution. In this approach, we use a number of **capability templates** (similar to units or modules) that implement a specific piece of functionality, and an **end-to-end solution template** which is responsible for bringing those underlying capabilities together. There are a couple of benefits to this approach:

* The underlying capability templates can be individually unit tested.
* The underlying capability templates could be defined as a standard inside of an organisation, and be re-used in multiple solutions.

For this example, there is an end-to-end solution template (deployment.json) that deploys three templates. The underlying templates are capability templates, responsible for deploying a specific aspect of the solution.

![Example of Linked Template Structure using Azure Resource Manager (ARM) Templates](media/batch-ci-cd/ARMTemplateHierarchy.png)

The first template that we will look at is for a Storage Account. Our solution requires a storage account to deploy the application to our Batch Account. It is worth being aware of the [ARM Template reference guide for Microsoft.Storage resource types](https://docs.microsoft.com/en-us/azure/templates/microsoft.storage/allversions) when building ARM templates for Storage Accounts.

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

Next, we will look at the Azure Batch Account template. The Azure Batch Account acts as a platform to run numerous applications across pools (groupings of machines). It is worth being aware of the [ARM Template reference guide for Microsoft.Batch resource types](https://docs.microsoft.com/en-us/azure/templates/microsoft.batch/allversions) when building ARM templates for Batch Accounts.

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

The next template shows an example creating an Azure Batch Pool (the backend machines to process our applications). It is worth being aware of the [ARM Template reference guide for Microsoft.Batch resource types](https://docs.microsoft.com/en-us/azure/templates/microsoft.batch/allversions) when building ARM templates for Batch Account Pools.

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

Finally, we have a template that acts similar to an orchestrator. This template is responsible for deploying the capability templates.

You can also find out more about [creating linked Azure Resource Manager templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-tutorial-create-linked-templates) in a separate article.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "templateContainerUri": {
           "type": "string",
           "metadata": {
                "description": "URI of the Blob Storage Container containing the ARM Templates"
            }
        },
        "templateContainerSasToken": {
           "type": "string",
           "metadata": {
                "description": "The SAS token of the container containing the ARM Templates"
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

### The HPC Solution

The infrastructure and software can be defined as code and co-located in the same repository.

For this solution, the ffmpeg is used as the application package. It can be downloaded from [here](https://ffmpeg.zeranoe.com/builds/win64/static/ffmpeg-3.4-win64-static.zip).

![Example Git Repository Structure](media/batch-ci-cd/git-repository.jpg)

For this  example, there are four main sections to our repository:

* The **arm-templates** folder which stores our Infrastructure as Code
* The **hpc-application** folder which contains the binaries for ffmpeg
* The **pipelines** folder which contains the definition for our build pipeline.
* **Optional**  - The **client-application** folder which would store code for .NET  Application. We do not use this in the sample, but in your own project, you may wish to execute runs of the HPC Batch Application via a client application.

> This is just one example of a structure to a codebase. This approach is used simply to demonstrate that we have application, infrastructure and pipeline code all stored in the same repository.

Now that the source code is set up, we can begin the first build.

## Continuous Integration

[Azure Pipelines](https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started/index?view=vsts) is the service inside of Azure DevOps that helps you implement a build, test, and deployment pipeline for your applications.

In this stage of your pipeline, tests are typically run to validate the code is functioning as expected, and build the appropriate pieces of the software. The number and types of tests, and any additional tasks that you run will depend on your wider build and release strategy.

## Preparing the HPC Application

In this example, we will focus on the **hpc-application** folder. This is the software to be run inside the Azure Batch account. For this scenario, ffmpeg.

1. Navigate to the Builds section of Azure Pipelines in your Azure DevOps organization.
2. Create a New Build Pipeline.

    ![Create a New Build Pipeline](media/batch-ci-cd/new-build-pipeline.jpg)

3. You have two options to create your Build pipeline;

    a. [Using the Visual Designer](https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started-designer?view=vsts&tabs=new-nav). To use this approach click "Use the visual designer" on the New pipeline page.

    b. [Using YAML Builds](https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started-yaml?view=vsts). You can create a new YAML pipeline by clicking the Azure Repos or GitHub option on the New pipeline page. Alternatively, you can store the example below in your source control and reference an existing yaml file by clicking on Visual Designer, and then using the YAML template.

    ```yaml
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

4. Once you are happy that the build is configured as needed, you can go ahead and click **Save & Queue**. Alternatively, if you have Continuous Integration enabled (in the Triggers section), the build will automatically trigger when a new commit to our repository is made, meeting the conditions set in the build.

    ![Example of an existing Build Pipeline](media/batch-ci-cd/existing-build-pipeline.jpg)

5. You can view live updates on the progress of your build in Azure DevOps. Navigate to the Build section of Azure Pipelines. Select the appropriate Build from your build definition.

    ![View live outputs from your build](media/batch-ci-cd/Build-1.jpg)

> If you decide to use a client application to execute your HPC Batch Application, then you would create a separate build definition for that application. You can find a number of walkthroughs in the [Azure Pipelines Build your app documentation](https://docs.microsoft.com/en-us/azure/devops/pipelines/?view=vsts).

## Continuous Delivery

[Azure Pipelines](https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started/index?view=vsts) is used to also deploy your application and underlying infrastructure. [Release pipelines](https://docs.microsoft.com/en-us/azure/devops/pipelines/release/what-is-release-management?view=vsts) is the component that enables Continuous Delivery and automate your release process.

### Deploying your application and underlying infrastructure

There are a number of steps involved in deploying the infrastructure. As we have used [linked templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-linked-templates), those templates will need to be accessible from a public endpoint (HTTPS or HTTPS). This could be a repository on GitHub, or an Azure Blob Storage Account. The uploaded template artifacts can remain secure, as they can be held in a private mode but accessed using some form of SAS token. We will show hos this works for a Blob Storage Account in the following example.

1. Firstly, we create a **New Release Definition**, and select an empty definition. We then need to rename the newly created environment, to something meaningful for our pipeline.

    ![Initial Release Pipeline](media/batch-ci-cd/Release-0.jpg)

2. Next, we need to create a dependency on the Build Pipeline where we perform the necessary actions to get the output for our HPC application.

    > Take note of the Source Alias, as this will be needed when the tasks are created inside of the Release Definition.

    ![Create an artifact link to the HPCApplicationPackage in the approrpiate build pipeline](media/batch-ci-cd/Release-1.jpg)

3. Create a link to another artifact, this time, an Azure Repo. This is required to access the ARM templates that are stored in your repository. As ARM templates do not require compilation, we do not need to push them through a build pipeline.

    > Take note of the Source Alias, as this will be needed when the tasks are created inside of the Release Definition.

    ![Create an artifact link to the Azure Repos](media/batch-ci-cd/Release-2.jpg)

4. Navigate to the **variables** section. You should create a number of variables in your pipeline, so that you are not inputting the same information into multiple tasks. These are the variables used in this example, and how they impact the deployment.

    * **applicationStorageAccountName**: Name of the Storage Account to hold HPC application binaries
    * **batchAccountApplicationName**: Name of the application in the Azure Batch Account
    * **batchAccountName**: Name of the Azure Batch Account
    * **batchAccountPoolName**: Name of the pool of VMs doing the processing
    * **batchApplicationId**: Unique ID for the Azure Batch application
    * **batchApplicationVersion**: Semantic version of your batch application (i.e. the ffmpeg binaries)
    * **location**: Location for the Azure Resources to be deployed
    * **resourceGroupName**: Name of the Resource Group to be created, and where your resources will be deployed
    * **storageAccountName**: Name of the Storage Account to hold linked ARM templates

    ![Example of variables set for the Azure Pipelines release](media/batch-ci-cd/Release-4.jpg)

5. The next step is to navigate to the tasks for our Dev environment. In the below snapshot, you can see six tasks. These tasks download the zipped ffmpeg files, deploy a storage account to host the nested ARM templates, copy those ARM templates to the storage account, deploy the batch account and required dependencies, create an application in the Azure Batch Account and upload the application package to the Azure Batch Account.

    ![Example of the tasks used to release the HPC Application to Azure Batch](media/batch-ci-cd/Release-3.jpg)

6. Add the **Download Pipeline Artifact (Preview)** task and set the following properties:
    * **Display Name:** Download ApplicationPackage to Agent
    * **The name of the artifact to download:** hpc-application
    * **Path to download to**: $(System.DefaultWorkingDirectory)

7. First, create a Storage Account to store your artifacts. An existing storage account from the solution could be used, but for the self-contained sample and isolation of content, we are making a dedicated storage account for our artifacts (specifically the ARM templates).

    Add the **Azure Resource Group Deployment** task and set the following properties:
    * **Display Name:** Deploy Storage Account for ARM Templates
    * **Azure Subscription:** Select the appropriate Azure Subscription
    * **Action**: Create or update resource group
    * **Resource Group**: $(resourceGroupName)
    * **Location**: $(location)
    * **Template**: $(System.ArtifactsDirectory)/**{YourAzureRepoArtifactSourceAlias}**/arm-templates/storageAccount.json
    * **Override template parameters**: -accountName $(storageAccountName)

8. Next, upload the artifacts from the Source Control into the Storage Account. There is an Azure Pipeline task to perform this. As part of this task, the Storage Account Container URL and the SAS Token can be outputted to a variable in Azure Pipelines. This means it can be reused throughout this agent phase.

    Add the **Azure File Copy** task and set the following properties:
    * **Source:** $(System.ArtifactsDirectory)/**{YourAzureRepoArtifactSourceAlias}**/arm-templates/
    * **Azure Connection Type**: Azure Resource Manager
    * **Azure Subscription:** Select the appropriate Azure Subscription
    * **Destination Type**: Azure Blob
    * **RM Storage Account**: $(storageAccountName)
    * **Container Name**: templates
    * **Storage Container URI**: templateContainerUri
    * **Storage Container SAS Token**: templateContainerSasToken

9. The next step is to deploy the orchestrator template. Recall the orchestrator template from earlier, you will notice that there were parameters for the Storage Account Container URL, in addition to the SAS token. You should notice that the variables required in the ARM template are either held in the variables section of the release definition, or were set from another Azure Pipelines task (e.g. part of the Azure Blob Copy task).

    Add the **Azure Resource Group Deployment** task and set the following properties:
    * **Display Name:** Deploy Azure Batch
    * **Azure Subscription:** Select the appropriate Azure Subscription
    * **Action**: Create or update resource group
    * **Resource Group**: $(resourceGroupName)
    * **Location**: $(location)
    * **Template**: $(System.ArtifactsDirectory)/**{YourAzureRepoArtifactSourceAlias}**/arm-templates/deployment.json
    * **Override template parameters**: ```-templateContainerUri $(templateContainerUri) -templateContainerSasToken $(templateContainerSasToken) -batchAccountName $(batchAccountName) -batchAccountPoolName $(batchAccountPoolName) -applicationStorageAccountName $(applicationStorageAccountName)```

    > A common practice is to use the Azure KeyVault task. If the Service Principal (connection to your Azure Subscription) has an appropriate access policies set, it can download secrets from an Azure KeyVault and be used as variables in your pipeline. The name of the secret will be set with the associated value. For example, a secret of sshPassword could be referenced with $(sshPassword) in the release definition.

10. The next set of steps call the Azure CLI. The first is used to create an application in Azure Batch. and upload associated packages.

    Add the **Azure CLI** task and set the following properties:
    * **Display Name:** Create application in Azure Batch Account
    * **Azure Subscription:** Select the appropriate Azure Subscription
    * **Script Location**: Inline Script
    * **Inline Script**: ```az batch application create --application-id $(batchApplicationId) --name $(batchAccountName) --resource-group $(resourceGroupName)```

11. The second step is used to upload associated packages to the application. In our case, the ffmpeg files.

    Add the **Azure CLI** task and set the following properties:
    * **Display Name:** Upload package to Azure Batch Account
    * **Azure Subscription:** Select the appropriate Azure Subscription
    * **Script Location**: Inline Script
    * **Inline Script**: ```az batch application package create --application-id $(batchApplicationId)  --name $(batchAccountName)  --resource-group $(resourceGroupName) --version $(batchApplicationVersion) --package-file=$(System.DefaultWorkingDirectory)/$(Release.Artifacts.{YourBuildArtifactSourceAlias}.BuildId).zip```

    > Notice that the version number of the application package is set to a variable. This works well if you are happy to overwrite previous versions of the package, and want to manually control the version number of the package pushed to Azure Batch.
    >
    > As an additional exercise, consider how you could adopt semantic versioning of your package in an automated way using Azure Pipelines.

12. Create a new Release by clicking on Release, then Create a new release. Once triggered, click on the link to your new release to view the status.

13. You can view the live output from the agent by clicking on the **Logs** button underneath your environment.

    ![View the status of your release](media/batch-ci-cd/Release-5.jpg)

### Testing your environment

Once the environment has been setup, confirm the following tests can be completed successfully:

* Connect to the new Azure Batch Account, using the AZ Cli from a PowerShell command prompt
  * First login to your Azure account with "az login", follow the on screen instructions to authenticate
  * Now authenticate to the Batch account: "az batch account login -g <resourceGroup> -n <batchAccount>

* List the applications available:

```azurecli-interactive
az batch application list -g <resourcegroup> -n <batchaccountname>
```

* Check the pool is valid, and take note of the currentDedicatedNodes property

```azurecli-interactive
az batch pool list
```

* Resize the pool so there are compute nodes available for job and task testing, check with the pool list command to see the current status until the resizing has completed and there are available nodes

```azurecli-interactive
az batch pool resize --pool-id <poolname> --target-dedicated-nodes 4
```

There are two tutorials which can utilise the ffmpeg application uploaded, using .NET and Python, please run through these to understand how to interact with the Batch account via a simple application

* [Tutorial: Run a parallel workload with Azure Batch using the Python API](tutorial-parallel-python)

* [Tutorial: Run a parallel workload with Azure Batch using the .NET API](tutorial-parallel-dotnet)