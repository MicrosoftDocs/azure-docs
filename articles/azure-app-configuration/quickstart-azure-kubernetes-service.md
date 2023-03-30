---
title: Quickstart for using Azure App Configuration in Azure Kubernetes Service (preview) | Microsoft Docs
description: "In this quickstart, create an Azure Kubernetes Service with an ASP.NET core web app workload and use the Azure App Configuration Kubernetes Provider to load key-values from App Configuration store."
services: azure-app-configuration
author: junbchen
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-other
ms.topic: quickstart
ms.date: 03/08/2023
ms.author: junbchen
#Customer intent: As an Azure Kubernetes Service user, I want to manage all my app settings in one place using Azure App Configuration.
---
# Quickstart: Use Azure App Configuration in Azure Kubernetes Service (preview)
In Kubernetes, you set up pods to consume ConfigMaps for configuration. It lets you decouple configuration from your container images, making your applications easily portable. Azure App Configuration Kubernetes Provider can construct ConfigMaps based on your data in Azure App Configuration. It enables you to take advantage of Azure App Configuration for the centralized storage and management of your configuration without any changes to your application code.

In this quickstart, you will incorporate Azure App Configuration Kubernetes Provider in an Azure Kubernetes Service workload where you run a simple ASP.NET Core app consuming configuration from environment variables.

## Prerequisites

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
* An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
* An Azure Container Registry. [Create a registry](/azure/aks/tutorial-kubernetes-prepare-acr?tabs=azure-cli#create-an-azure-container-registry).
* An Azure Kubernetes Service (AKS) cluster that integrates with the Azure Container Registry you created. [Create an AKS cluster](/azure/aks/tutorial-kubernetes-deploy-cluster?tabs=azure-cli#create-a-kubernetes-cluster).
* [.NET Core SDK](https://dotnet.microsoft.com/download)
* [Azure CLI](/cli/azure/install-azure-cli)
* [helm](https://helm.sh/docs/intro/install/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/)

> [!TIP]
> The Azure Cloud Shell is a free, interactive shell that you can use to run the command line instructions in this article. It has common Azure tools preinstalled, including the .NET Core SDK. If you're logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com. You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md)
>

## Create an application consumes environment variables
If you already have an application that is consuming environment variables as configuration, you can just skip this step. We just create an ASP.NET Core Web App `MyWebApp` as an example.

1. Use the .NET Core command-line interface (CLI) to create a new ASP.NET Core web app project. Run the following command to create an ASP.NET Core web app in a new TestAppConfig folder:
    ``` dotnetcli
    dotnet new webapp --output MyWebApp --framework net6.0
    ```

1. Open *Index.cshtml.cs* in the Pages directory, and update the `IndexModel` class with the following code.
    ``` csharp
    public class IndexModel : PageModel
    {
        private readonly IConfiguration _configuration;

        public IndexModel(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public void OnGet()
        {
            ViewData["Message"] = _configuration.GetSection("Settings")["Message"];
            ViewData["FontColor"] = _configuration.GetSection("Settings")["FontColor"];
        }
    }
    ```
1. Open *Index.cshtml* in the Pages directory, and update the content with the following code.
    ``` html
    @page
    @model IndexModel
    @{
        ViewData["Title"] = "Home page";
    }

    <style>
        h1 {
            color: @ViewData["FontColor"];
        }
    </style>
    <div class="text-center">
        <h1 class="display-4">@ViewData["Message"]</h1>
    </div>
    ```

## Containerize the application 
If you already have an application, you can containerize it in a way that depends on your application. We just show you how to build the `MyWebApp` project to an image.
1. Run the (dotnet publish)[/dotnet/core/tools/dotnet-publish] command to build the app in release mode and create the assets in the published folder.
    ``` dotnetcli
    dotnet publish -c Release -o published
    ```
1. Create a file named *Dockerfile* in the directory containing your .csproj file, open it in a text editor, and enter the following content. A Dockerfile is a text file that doesn't have an extension and that is used to create a container image.
    ``` dockerfile
    FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
    WORKDIR /app
    COPY published/ ./
    ENTRYPOINT ["dotnet", "MyWebApp.dll"]
    ```
1. Build the container by running the following command.
   ``` docker
   docker build --tag aspnetapp .
   ```

## Push the image to Azure Container Registry
1. Run the [az acr login](/cli/azure/acr#az-acr-login) command to log in to the registry.

    ```azurecli
    az acr login --name myregistry
    ```

    The command returns `Login Succeeded` once login is successful.

1. Use [docker tag](https://docs.docker.com/engine/reference/commandline/tag/) to tag the image appropriate details.

    ```docker
    docker tag aspnetapp myregistry.azurecr.io/aspnetapp:v1
    ```

    > [!TIP]
    > To review the list of your existing docker images and tags, run `docker image ls`. In this scenario, you should see at least two images: `aspnetapp` and `myregistry.azurecr.io/aspnetapp`.

1. Use [docker push](https://docs.docker.com/engine/reference/commandline/push/) to push the image to the container registry. This example creates the *aspnetapp* repository in ACR containing the `aspnetapp` image. In the example below, replace the placeholders `<login-server`, `<image-name>` and `<tag>` by the ACR's log-in server value, the image name and the image tag.

    Method:

    ```docker
    docker push <login-server>/<image-name>:<tag>
    ```

    Example:

    ```docker
    docker push myregistry.azurecr.io/aspnetapp:v1
    ```

## Configure the Azure App Configuration store
1. Add the key-values to your Azure App Configuration that should be consumed as environment variables by your application. We're just using key-values that be consumed by `MyWebApp` as an example, add following key-values to the App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).
    
    |**Key**|**Value**|
    |---|---|
    |Settings__FontColor|*Red*|
    |Settings__Message|*Hello from Azure App Configuration*|
    
2. Enable System Assigned Managed Identity of AKS NodePool
   
    Go to the corresponding Virtual Machine Scale Sets resource of AKS, and enable system-assigned managed identity on the Virtual Machine Scale Sets by following this [doc](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vmss#enable-system-assigned-managed-identity-on-an-existing-virtual-machine-scale-set).

3. Assign Data Reader role to the System Assigned Managed Identity 
   
    Once the system-assigned managed identity has been enabled, you need to grant it read access to Azure AppConfiguration. You can do it by following the instructions in this [doc](/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity?tabs=core5x&pivots=framework-dotnet#grant-access-to-app-configuration).

## Install App Configuration Kubernetes Provider to your AKS cluster

1. Get the credential to manage your AKS cluster, replace the `name` and `resource-group` parameters with yours:
    ```bash
    az aks get-credentials --name my_aks --resource-group my_aks_resource_group
    ```
2. Install Azure App Configuration Kubernetes Provider to your AKS cluster using `helm`:
    ``` bash
    helm install azureappconfiguration.kubernetesprovider oci://mcr.microsoft.com/azure-app-configuration/helmchart/kubernetes-provider --version 1.0.0-alpha --namespace azappconfig-system --create-namespace
    ```

## Create and deploy Kubernetes resources

1. Create a *AKS-AppConfiguration-Demo* directory in the root directory of your project.
2. Create *appConfigurationProvider.yaml* in the *AKS-AppConfiguration-Demo* directory with the following YAML content. Replace the value of the `endpoint` field with the endpoint of your Azure AppConfiguration store.
    ``` yaml
    apiVersion: azconfig.io/v1beta1
    kind: AzureAppConfigurationProvider
    metadata:
      name: appconfigurationprovider-sample
    spec:
      endpoint: https://myappconfig.azconfig.io
      target:
        configMapName: demo-configmap
    ```
3. Create *deployment.yaml* in the *AKS-AppConfiguration-Demo* directory with the following YAML content. Replace the value of `template.containers.image` with the image you created in the previous step.
    ``` yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: demo-deployment
      labels:
        app: configmap-demo-app
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: configmap-demo-app
      template:
        metadata:
          labels:
            app: configmap-demo-app
        spec:
          containers:
          - name: configmap-demo-app
            image: myregistry.azurecr.io/aspnetapp:v1
            ports:
            - containerPort: 80
            envFrom:
            - configMapRef:
                name: demo-configmap
    ```
4. Create *service.yaml* in the *AKS-AppConfiguration-Demo* with the following YAML content. 
    ``` yaml
    apiVersion: v1
    kind: Service
    metadata:
      name: configmap-demo-service
    spec:
      type: LoadBalancer
      ports:
      - port: 80
      selector:
        app: configmap-demo-app
    ```
5. Apply the YAML files to the AKS cluster
    ``` bash
    kubectl create namespace quickstart-appconfig
    kubectl apply -f ./AKS-AppConfiguration-Demo -n quickstart-appconfig
    ```

## Validate ConfigMap creation

To check the synchronization status of AppConfigurationProvider, run the following command in your terminal. If the `phase` property in the `status` section of the output is `COMPLETE` , it means that the key-values have been successfully synced from Azure App Configuration. 
``` bash
kubectl get AppConfigurationProvider appconfigurationprovider-sample -n quickstart-appconfig -o yaml
```
> [!TIP]
> If you see another status is displayed for `phase`, you are presumably confronting some issue. You can run the following command to check what happened with the provider.
> ``` bash    
> kubectl logs deployment/az-appconfig-k8s-provider -n azappconfig-system
> ```   
>
 
A configMap *demo-configmap* is being created in the *quickstart-appconfig* namespace
``` bash
kubectl get configmap demo-configmap -n quickstart-appconfig
```

## Validate key-values from Azure App Configuration are affecting the app.
Run the following command and get the External IP that exposed by the LoadBalancer service. Use it to visit the web app, you'll see that the configuration settings from the Azure App Configuration store are affecting the page.
``` bash
kubectl get service configmap-demo-service -n quickstart-appconfig
```

## Clean up resources

[!INCLUDE[Azure App Configuration cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you:

* Provisioned a new App Configuration store.
* Connected to your App Configuration store in Kubernetes using the App Configuration Kubernetes Provider Operator.
* Sync your App Configuration store's key-values to a ConfigMap.
* Displayed a web page in Kubernetes using the settings you configured in your App Configuration store.