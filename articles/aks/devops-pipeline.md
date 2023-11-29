---
title: Deploy to Azure Kubernetes Service with Azure Pipelines
description: Build and push images to Azure Container Registry; Deploy to Azure Kubernetes Service with Azure Pipelines
ms.topic: article
ms.author: jukullam
author: juliakm
ms.date: 10/11/2023
ms.custom: devops-pipelines-deploy, devx-track-azurepowershell
zone_pivot_groups: pipelines-version
---

# Build and deploy to Azure Kubernetes Service with Azure Pipelines

::: zone pivot="pipelines-yaml"

**Azure DevOps Services**

Use [Azure Pipelines](/azure/devops/pipelines/) to automatically deploy to Azure Kubernetes Service (AKS). Azure Pipelines lets you build, test, and deploy with continuous integration (CI) and continuous delivery (CD) using [Azure DevOps](/azure/devops/). 

In this article, you'll learn how to create a pipeline that continuously builds and deploys your app. Every time you change your code in a repository that contains a Dockerfile, the images are pushed to your Azure Container Registry, and the manifests are then deployed to your AKS cluster.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Resource Manager service connection. [Create an Azure Resource Manager service connection](/azure/devops/pipelines/library/connect-to-azure#create-an-azure-resource-manager-service-connection-using-automated-security).     
* A GitHub account. Create a free [GitHub account](https://github.com/join) if you don't have one already.

## Get the code

Fork the following repository containing a sample application and a Dockerfile:

```
https://github.com/MicrosoftDocs/pipelines-javascript-docker
```

## Create the Azure resources

Sign in to the [Azure portal](https://portal.azure.com/), and then select the [Cloud Shell](../cloud-shell/overview.md) button in the upper-right corner. Use Azure CLI or PowerShell to create an AKS cluster. 

### Create a container registry

#### [Azure CLI](#tab/cli)

```azurecli-interactive
# Create a resource group
az group create --name myapp-rg --location eastus

# Create a container registry
az acr create --resource-group myapp-rg --name mycontainerregistry --sku Basic

# Create a Kubernetes cluster
az aks create \
    --resource-group myapp-rg \
    --name myapp \
    --node-count 1 \
    --enable-addons monitoring \
    --generate-ssh-keys
```

#### [PowerShell](#tab/powershell)

```powershell
# Install Azure PowerShell
Install-Module -Name Az -Repository PSGallery -Force

# The Microsoft.OperationsManagement resource provider must be registered. This is a one-time activity per subscription.
Register-AzResourceProvider -ProviderNamespace Microsoft.OperationsManagement

# Create a resource group
New-AzResourceGroup -Name myapp-rg -Location eastus

# Create a container registry
New-AzContainerRegistry -ResourceGroupName myapp-rg -Name myContainerRegistry -Sku Basic -Location eastus

# Create a log analytics workspace (or use an existing one)
New-AzOperationalInsightsWorkspace -ResourceGroupName myapp-rg -Name myWorkspace -Location eastus

# Create an AKS cluster with monitoring add-on enabled
$aksParameters = @{ 
  ResourceGroupName = 'myapp-rg'
  Name = 'myapp'
  NodeCount = 1
  AddOnNameToBeEnabled = 'Monitoring'
  GenerateSshKey = $true
  WorkspaceResourceId = '/subscriptions/<subscription-id>/resourceGroups/myapp-rg/providers/Microsoft.OperationalInsights/workspaces/myWorkspace'
}

New-AzAksCluster @aksParameters
```

--- 


## Sign in to Azure Pipelines

Sign in to [Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines). After you sign in, your browser goes to `https://dev.azure.com/my-organization-name` and displays your Azure DevOps dashboard.

Within your selected organization, create a _project_. If you don't have any projects in your organization, you see a **Create a project to get started** screen. Otherwise, select the **Create Project** button in the upper-right corner of the dashboard.

## Create the pipeline

### Connect and select your repository

1. Sign in to your Azure DevOps organization and go to your project.

1. Go to **Pipelines**, and then select **New pipeline**.

1. Do the steps of the wizard by first selecting **GitHub** as the location of your source code.

1. You might be redirected to GitHub to sign in. If so, enter your GitHub credentials.

1. When you see the list of repositories, select your repository.

1. You might be redirected to GitHub to install the Azure Pipelines app. If so, select **Approve & install**.

1. Select **Deploy to Azure Kubernetes Service**. 

1. If you're prompted, select the subscription in which you created your registry and cluster.

1. Select the `myapp` cluster.

1. For **Namespace**, select **Existing**, and then select **default**.

1. Select the name of your container registry.

1. You can leave the image name set to the default.

1. Set the service port to 8080.

1. Set the **Enable Review App for Pull Requests** checkbox for [review app](/azure/devops/pipelines/process/environments-kubernetes) related configuration to be included in the pipeline YAML autogenerated in subsequent steps.

1. Select **Validate and configure**.

   As Azure Pipelines creates your pipeline, the process will:

   * Create a _Docker registry service connection_ to enable your pipeline to push images into your container registry.

   * Create an _environment_ and a Kubernetes resource within the environment. For an RBAC-enabled cluster, the created Kubernetes resource implicitly creates ServiceAccount and RoleBinding objects in the cluster so that the created ServiceAccount can't perform operations outside the chosen namespace.

   * Generate an *azure-pipelines.yml* file, which defines your pipeline.

   * Generate Kubernetes manifest files. These files are generated by hydrating the [deployment.yml](https://github.com/Microsoft/azure-pipelines-yaml/blob/master/templates/resources/k8s/deployment.yml) and [service.yml](https://github.com/Microsoft/azure-pipelines-yaml/blob/master/templates/resources/k8s/service.yml) templates based on selections you made. When you're ready, select **Save and run**.

1. Select **Save and run**.

1. You can change the **Commit message** to something like _Add pipeline to our repository_. When you're ready, select **Save and run** to commit the new pipeline into your repo, and then begin the first run of your new pipeline!

## See your app deploy

As your pipeline runs, watch as your build stage, and then your deployment stage, go from blue (running) to green (completed). You can select the stages and jobs to watch your pipeline in action.

> [!NOTE]
> If you're using a Microsoft-hosted agent, you must add the IP range of the Microsoft-hosted agent to your firewall. Get the weekly list of IP ranges from the [weekly JSON file](https://www.microsoft.com/download/details.aspx?id=56519), which is published every Wednesday. The new IP ranges become effective the following Monday. For more information, see [Microsoft-hosted agents](/azure/devops/pipelines/agents/hosted?tabs=yaml&view=azure-devops&preserve-view=true#networking).
> To find the IP ranges that are required for your Azure DevOps organization, learn how to [identify the possible IP ranges for Microsoft-hosted agents](/azure/devops/pipelines/agents/hosted?tabs=yaml&view=azure-devops&preserve-view=true#to-identify-the-possible-ip-ranges-for-microsoft-hosted-agents).
    
After the pipeline run is finished, explore what happened and then go see your app deployed. From the pipeline summary:

1. Select the **Environments** tab.

1. Select **View environment**.

1. Select the instance of your app for the namespace you deployed to. If you used the defaults, then it is the **myapp** app in the **default** namespace.

1. Select the **Services** tab.

1. Select and copy the external IP address to your clipboard.

1. Open a new browser tab or window and enter &lt;IP address&gt;:8080.

If you're building our sample app, then _Hello world_ appears in your browser.

<a name="how"></a>

## How the pipeline builds

When you finished selecting options and then proceeded to validate and configure the pipeline Azure Pipelines created a pipeline for you, using the _Deploy to Azure Kubernetes Service_ template.

The build stage uses the [Docker task](/azure/devops/pipelines/tasks/build/docker) to build and push the image to the Azure Container Registry.

```YAML
- stage: Build
  displayName: Build stage
  jobs:  
  - job: Build
    displayName: Build job
    pool:
      vmImage: $(vmImageName)
    steps:
    - task: Docker@2
      displayName: Build and push an image to container registry
      inputs:
        command: buildAndPush
        repository: $(imageRepository)
        dockerfile: $(dockerfilePath)
        containerRegistry: $(dockerRegistryServiceConnection)
        tags: |
          $(tag)
          
    - task: PublishPipelineArtifact@1
      inputs:
        artifactName: 'manifests'
        path: 'manifests'
```

The deployment job uses the _Kubernetes manifest task_ to create the `imagePullSecret` required by Kubernetes cluster nodes to pull from the Azure Container Registry resource. Manifest files are then used by the Kubernetes manifest task to deploy to the Kubernetes cluster. The manifest files, `service.yml` and `deployment.yml`, were generated when you used the **Deploy to Azure Kubernetes Service** template. 

```YAML
- stage: Deploy
  displayName: Deploy stage
  dependsOn: Build
  jobs:
  - deployment: Deploy
    displayName: Deploy job
    pool:
      vmImage: $(vmImageName)
    environment: 'myenv.aksnamespace' #customize with your environment
    strategy:
      runOnce:
        deploy:
          steps:
          - task: DownloadPipelineArtifact@2
            inputs:
              artifactName: 'manifests'
              downloadPath: '$(System.ArtifactsDirectory)/manifests'

          - task: KubernetesManifest@0
            displayName: Create imagePullSecret
            inputs:
              action: createSecret
              secretName: $(imagePullSecret)
              namespace: $(k8sNamespace)
              dockerRegistryEndpoint: $(dockerRegistryServiceConnection)
              
          - task: KubernetesManifest@0
            displayName: Deploy to Kubernetes cluster
            inputs:
              action: deploy
              namespace: $(k8sNamespace)
              manifests: |
                $(System.ArtifactsDirectory)/manifests/deployment.yml
                $(System.ArtifactsDirectory)/manifests/service.yml
              imagePullSecrets: |
                $(imagePullSecret)
              containers: |
                $(containerRegistry)/$(imageRepository):$(tag)
```

## Clean up resources

Whenever you're done with the resources you created, you can use the following command to delete them:

```azurecli
az group delete --name myapp-rg
```

Enter `y` when you're prompted.

::: zone-end

::: zone pivot="pipelines-classic"

**Azure DevOps Services | Azure DevOps Server 2020 | Azure DevOps Server 2019**  

Use [Azure Pipelines](/azure/devops/pipelines/) to automatically deploy to Azure Kubernetes Service (AKS). Azure Pipelines lets you build, test, and deploy with continuous integration (CI) and continuous delivery (CD) using [Azure DevOps](/azure/devops/). 

In this article, you'll learn how to create a pipeline that continuously builds and deploys your app. Every time you change your code in a repository that contains a Dockerfile, the images are pushed to your Azure Container Registry, and the manifests are then deployed to your AKS cluster.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Resource Manager service connection. [Create an Azure Resource Manager service connection](/azure/devops/pipelines/library/connect-to-azure#create-an-azure-resource-manager-service-connection-using-automated-security).     
* A GitHub account. Create a free [GitHub account](https://github.com/join) if you don't have one already.

## Get the code


Fork the following repository containing a sample application and a Dockerfile:

```
https://github.com/MicrosoftDocs/pipelines-javascript-docker
```

## Create the Azure resources

Sign in to the [Azure portal](https://portal.azure.com/), and then select the [Cloud Shell](../cloud-shell/overview.md) button in the upper-right corner. Use Azure CLI or PowerShell to create an AKS cluster. 

### Create a container registry

#### [Azure CLI](#tab/cli)

```azurecli-interactive
# Create a resource group
az group create --name myapp-rg --location eastus

# Create a container registry
az acr create --resource-group myapp-rg --name mycontainerregistry --sku Basic

# Create a Kubernetes cluster
az aks create \
    --resource-group myapp-rg \
    --name myapp \
    --node-count 1 \
    --enable-addons monitoring \
    --generate-ssh-keys 
```

#### [PowerShell](#tab/powershell)

```powershell
# Install Azure PowerShell
Install-Module -Name Az -Repository PSGallery -Force

# The Microsoft.OperationsManagement resource provider must be registered. This is a one-time activity per subscription.
Register-AzResourceProvider -ProviderNamespace Microsoft.OperationsManagement

# Create a resource group
New-AzResourceGroup -Name myapp-rg -Location eastus

# Create a container registry
New-AzContainerRegistry -ResourceGroupName myapp-rg -Name myContainerRegistry -Sku Basic -Location eastus

# Create a log analytics workspace (or use an existing one)
New-AzOperationalInsightsWorkspace -ResourceGroupName myapp-rg -Name myWorkspace -Location eastus

# Create an AKS cluster with monitoring add-on enabled
$aksParameters = @{ 
  ResourceGroupName = 'myapp-rg'
  Name = 'myapp'
  NodeCount = 1
  AddOnNameToBeEnabled = 'Monitoring'
  GenerateSshKey = $true
  WorkspaceResourceId = '/subscriptions/<subscription-id>/resourceGroups/myapp-rg/providers/Microsoft.OperationalInsights/workspaces/myWorkspace'
}

New-AzAksCluster @aksParameters
```

---


## Configure authentication

When you use Azure Container Registry (ACR) with Azure Kubernetes Service (AKS),
you must establish an authentication mechanism. This can be achieved in two ways:

1. Grant AKS access to ACR. See [Authenticate with Azure Container Registry from Azure Kubernetes Service](/azure/container-registry/container-registry-auth-aks).

1. Use a [Kubernetes image pull secret](/azure/container-registry/container-registry-auth-aks).
   An image pull secret can be created by using the [Kubernetes deployment task](/azure/devops/pipelines/tasks/deploy/kubernetes).

## Create a release pipeline

The build pipeline used to set up CI has already built a Docker image and pushed it to an Azure Container Registry.
It also packaged and published a Helm chart as an artifact. In the release pipeline, we'll deploy the container image as a Helm application to the AKS cluster.

1. In **Azure Pipelines** open the summary for your build.

1. In the build summary, choose the **Release** icon to start a new release pipeline.

   If you've previously created a release pipeline that uses these build artifacts, you are prompted to create a new release instead. In that case, go to the **Releases** page and
   start a new release pipeline from there by choosing the **+** icon.

1. Select the **Empty job** template.

1. Open the **Tasks** page and select **Agent job**.

1. Choose **+** to add a new task and add a **Helm tool installer** task.
   This ensures the agent that runs the subsequent tasks has Helm and Kubectl installed on it.

1. Choose **+** again and add a **Package and deploy Helm charts** task.
   Configure the settings for this task as follows:

   - **Connection Type**: Select **Azure Resource Manager** to connect to an AKS cluster by using
     an Azure service connection. Alternatively, if you want to connect to any Kubernetes
     cluster by using kubeconfig or a service account, you can select **Kubernetes Service Connection**.
     In this case, you'll need to create and select a Kubernetes service connection instead of
     an Azure subscription for the following setting.
 
   - **Azure subscription**: Select a connection from the list under **Available Azure Service Connections** or create a more restricted permissions connection to your Azure subscription.
     If you see an **Authorize** button next to the input, use it to authorize the connection to your Azure subscription.
     If you don't see the required Azure subscription in the list of subscriptions, see [Create an Azure service connection](/azure/devops/pipelines/library/connect-to-azure) to manually set up the connection.

   - **Resource group**: Enter or select the resource group containing your AKS cluster.  
   
   - **Kubernetes cluster**: Enter or select the AKS cluster you created.  
   
   - **Command**: Select **init** as the Helm command. This installs Tiller to your running Kubernetes cluster.
     It will also set up any necessary local configuration.
     Tick **Use canary image version** to install the latest prerelease version of Tiller.
     You could also choose to upgrade Tiller if it's preinstalled by ticking **Upgrade Tiller**.
     If these options are enabled, the task runs `helm init --canary-image --upgrade`
   
1. Choose **+** in the **Agent job** and add another **Package and deploy Helm charts** task.
   Configure the settings for this task as follows:
   
   - **Kubernetes cluster**: Enter or select the AKS cluster you created.  
   
   - **Namespace**: Enter your Kubernetes cluster namespace where you want to deploy your application.
     Kubernetes supports multiple virtual clusters backed by the same physical cluster.
     These virtual clusters are called _namespaces_.
     You can use namespaces to create different environments such as dev, test, and staging in the same cluster. 

   - **Command**: Select **upgrade** as the Helm command.
     You can run any Helm command using this task and pass in command options as arguments.
     When you select the **upgrade**, the task shows some more fields:

     * **Chart Type**: Select **File Path**. Alternatively, you can specify **Chart Name** if you want to
       specify a URL or a chart name. For example, if the chart name is `stable/mysql`, the task executes
       `helm upgrade stable/mysql` 
   
     * **Chart Path**: This can be a path to a packaged chart or a path to an unpacked chart directory.
       In this example, you're publishing the chart using a CI build, so select the file package using file picker
       or enter `$(System.DefaultWorkingDirectory)/**/*.tgz`
   
     * **Release Name**: Enter a name for your release; for example, `azuredevops`
   
     * **Recreate Pods**: Tick this checkbox if there's a configuration change during the release and you want to replace a running pod with the new configuration.

     * **Reset Values**: Tick this checkbox if you want the values built into the chart to override all values provided by the task.

     * **Force**: Tick this checkbox if, should conflicts occur, you want to upgrade and rollback to delete, recreate the resource, and reinstall the full release.
       This is useful in scenarios where applying patches can fail (for example, for services because the cluster IP address is immutable). 

     * **Arguments**: Enter the Helm command arguments and their values; for this example
       `--set image.repository=$(imageRepoName) --set image.tag=$(Build.BuildId)` 
       See [this section](#argument-details) for a description of why we're using these arguments. 
   
     * **Enable TLS**: Tick this checkbox to enable strong TLS-based connections between Helm and Tiller.

     * **CA certificate**: Specify a CA certificate to be uploaded and used to issue certificates for Tiller and Helm client.
 
     * **Certificate**: Specify the Tiller certificate or Helm client certificate

     * **Key**: Specify the Tiller Key or Helm client key

1. In the **Variables** page of the pipeline, add a variable named **imageRepoName** and set the value
   to the name of your Helm image repository. Typically, this is in the format `example.azurecr.io/coderepository`

1. Save the release pipeline.

<a name="argument-details"></a>

### Arguments used in the Helm upgrade task

In the build pipeline, the container image is tagged with `$(Build.BuildId)` and this is pushed to an Azure Container Registry. 
In a Helm chart, you can parameterize the container image details such as the name and tag
because the same chart can be used to deploy to different environments.
These values can also be specified in the **values.yaml** file or be overridden by a user-supplied values file,
which can in turn be overridden by `--set` parameters during the Helm install or upgrade.
   
In this example, we pass the following arguments:   

`--set image.repository=$(imageRepoName) --set image.tag=$(Build.BuildId)` 
   
The value of `$(imageRepoName)` was set in the **Variables** page (or the **variables** section of your YAML file).
Alternatively, you can directly replace it with your image repository name in the `--set` arguments value or **values.yaml** file.
For example:

```
  image:
    repository: VALUE_TO_BE_OVERRIDDEN
    tag: latest
```

Another alternative is to set the **Set Values** option of the task to specify the argument values as comma-separated key-value pairs.

## Create a release to deploy your app

You're now ready to create a release, which means to start the process of running the release pipeline with the artifacts produced by a specific build. This results in deploying the build:

1. Choose **+ Release** and select **Create a release**.

1. In the **Create a new release** panel, check that the artifact version you want to use is selected and choose **Create**.

1. Choose the release link in the information bar message. For example: "Release **Release-1** has been created".

1. In the pipeline view, choose the status link in the stages of the pipeline to see the logs and agent output.

::: zone-end
