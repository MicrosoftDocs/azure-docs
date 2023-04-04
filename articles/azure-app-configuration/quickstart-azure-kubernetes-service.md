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

## Create an application running in AKS
In this section, it creates an ASP.NET Core web application that consumes environment variables as configuration and run it in Azure Kubernetes Service. This section has nothing to do with Azure App Configuration or Azure App Configuration Kubernetes Provider, it just for demonstrating the end-to-end usage scenario of Azure App Configuration Kubernetes Provider later. If you already have an application that is consuming environment variables in Kubernetes, you can just skip it and go to [Use App Configuration Kubernetes Provider](#use-app-configuration-kubernetes-provider). 
### Create an application
1. Use the .NET Core command-line interface (CLI) to create a new ASP.NET Core web app project. Run the following command to create an ASP.NET Core web app in a new MyWebApp folder:
    ``` dotnetcli
    dotnet new webapp --output MyWebApp --framework net6.0
    ```

1. Open *Index.cshtml* in the Pages directory, and update the content with the following code.
    ``` html
    @page
    @model IndexModel
    @using Microsoft.Extensions.Configuration
    @inject IConfiguration Configuration
    @{
        ViewData["Title"] = "Home page";
    }

    <style>
        h1 {
            color: @Configuration.GetSection("Settings")["FontColor"];
        }
    </style>

    <div class="text-center">
        <h1 class="display-4">@Configuration.GetSection("Settings")["Message"]</h1>
    </div>
    ```
### Containerize the application 
1. Run the [dotnet publish](/dotnet/core/tools/dotnet-publish) command to build the app in release mode and create the assets in the published folder.
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

### Push the image to the registry
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

### Deploy the application and browser it
1.  Create an *AKS-AppConfiguration-Demo* directory in the root directory of your project.

1. Create *deployment.yaml* in the *AKS-AppConfiguration-Demo* directory with the following YAML content. Replace the value of `template.spec.containers.image` with the image you created in the previous step.
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
            env:
            - name: Settings__Message
              value: "Hello from the environment variable"
            - name: Settings__FontColor
              value: "Orange"
    ```
1. Create *service.yaml* in the *AKS-AppConfiguration-Demo* with the following YAML content. 
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

1. Apply the YAML files to the AKS cluster
    ``` bash
    kubectl create namespace quickstart-appconfig
    kubectl apply -f ./AKS-AppConfiguration-Demo -n quickstart-appconfig
    ```

1. Run the following command and get the External IP that exposed by the LoadBalancer service.
    ``` bash
    kubectl get service configmap-demo-service -n quickstart-appconfig
    ```

1. Open a browser window, use the External IP of the service you get in previous step to visit the app. Your browser should display a page similar to the image below.

    ![Kubernetes Provider before using configMap ](./media/quickstarts/kubernetes-provider-app-launch-before.png)

## Use App Configuration Kubernetes Provider
### Configure the Azure App Configuration store
1. Add following key-values to the App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

    |**Key**|**Value**|
    |---|---|
    |Settings__FontColor|*Green*|
    |Settings__Message|*Hello from Azure App Configuration*|

    > [!TIP]
    > This step adds the key-values to Azure App Configuration that is supposed to be consumed by the application. We're just using application `MyWebApp` as an example. If you are using your own application, you can add the key-values that are required by your application accordingly. 
    
1. Enable System Assigned Managed Identity of AKS NodePool
   
    Go to the corresponding Virtual Machine Scale Sets resource of AKS, and enable system-assigned managed identity on the Virtual Machine Scale Sets by following this [doc](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vmss#enable-system-assigned-managed-identity-on-an-existing-virtual-machine-scale-set).

1. Assign Data Reader role to the System Assigned Managed Identity 
   
    Once the system-assigned managed identity has been enabled, you need to grant it read access to Azure AppConfiguration. You can do it by following the instructions in this [doc](/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity?tabs=core5x&pivots=framework-dotnet#grant-access-to-app-configuration).

### Install App Configuration Kubernetes Provider to AKS cluster
1. Get the credential to manage your AKS cluster, replace the `name` and `resource-group` parameters with yours:
    ```bash
    az aks get-credentials --name my_aks --resource-group my_aks_resource_group
    ```

1. Install Azure App Configuration Kubernetes Provider to your AKS cluster using `helm`:
    ``` bash
    helm install azureappconfiguration.kubernetesprovider \
    oci://mcr.microsoft.com/azure-app-configuration/helmchart/kubernetes-provider \
    --version 1.0.0-preview --namespace azappconfig-system --create-namespace
    ```

1. Create *appConfigurationProvider.yaml* with the following YAML content. Replace the value of the `endpoint` field with the endpoint of your Azure AppConfiguration store.
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

1.  Apply *appConfigurationProvider.yaml* to the AKS cluster.
    ``` bash
    kubectl apply -f ./AKS-AppConfiguration-Demo -n quickstart-appconfig
    ```
    If namespace does not exists, run the following command to create it first.
    ``` bash
    kubectl create namespace quickstart-appconfig
    ```

### Update application deployment
1. Update the *deployment.yaml* to use the configMap `demo-configmap` as environment variable.
   
   Replace the whole `env` section 
    ``` yaml
    env:
    - name: Settings__Message
      value: "Hello from the environment variable"
    - name: Settings__FontColor
      value: "Orange"
    ```
    with:
    ``` yaml
    envFrom:
    - configMapRef:
        name: demo-configmap
    ```

1. Apply the updated *deployment.yaml* to the AKS cluster.
    ``` bash
    kubectl apply -f ./deployment.yaml -n quickstart-appconfig
    ```

1. Refresh the browser, can see the page has been updated based on the configuration from App Configuration.

    ![Kubernetes Provider after using configMap ](./media/quickstarts/kubernetes-provider-app-launch-after.png)

### Validation and troubleshooting
A configMap *demo-configmap* is supposed to be created in the *quickstart-appconfig* namespace by the Azure App Configuration Kubernetes Provider.
``` bash
kubectl get configmap demo-configmap -n quickstart-appconfig
```

In addition to check the existence of target configMap, you can also check the synchronization status of AppConfigurationProvider, run the following command in your terminal. If the `phase` property in the `status` section of the output is `COMPLETE` , it means that the key-values have been successfully synced from Azure App Configuration. 
``` bash
kubectl get AppConfigurationProvider appconfigurationprovider-sample -n quickstart-appconfig -o yaml
```
> [!TIP]
> If you see another status is displayed for `phase`, you are presumably confronting some issue. You can run the following command to check what happened with the provider.
> ``` bash    
> kubectl logs deployment/az-appconfig-k8s-provider -n azappconfig-system
> ```   
>

If you see the error message in log with information *RESPONSE 403: 403 Forbidden*, it means that the system-assigned managed identity of AKS node pool does not have the permission to access the App Configuration store. You need to grant the permission to the managed identity by following the instructions in this [doc](/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity?tabs=core5x&pivots=framework-dotnet#grant-access-to-app-configuration). If you have assigned the permission, you can wait for up to 15 minutes for the permission to take effect.

## Clean up resources
1. Remove the resources that have been deployed to AKS.
    ``` bash
    kubectl delete -f ./AKS-AppConfiguration-Demo -n quickstart-appconfig
    kubectl delete namespace quickstart-appconfig
    ```
1. Uninstall the Azure App Configuration Kubernetes Provider.
   ``` bash
   helm uninstall azureappconfiguration.kubernetesprovider --namespace azappconfig-system
   ```

## Next steps

In this quickstart, you:

* Provisioned a new App Configuration store.
* Connected to your App Configuration store in Kubernetes using the App Configuration Kubernetes Provider Operator.
* Sync your App Configuration store's key-values to a ConfigMap.
* Displayed a web page in Kubernetes using the settings you configured in your App Configuration store.