---
title: Quickstart for Azure App Configuration with Azure Kubernetes Service | Microsoft Docs
description: "In this quickstart, make an Azure Kubernetes Service with an ASP.NET core web app workload. Create an AzureAppConfigurationProvider to connect App Configuration store, the app can load the configurations from App Configuration store. "
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
# Quickstart: Create an AKS workload with configuration settings from Azure App Configuration (Preview)
In this quickstart, you'll incorporate the Azure App Configuration service into a workload in Azure Kubernetes Service to centralize storage and management of all your application settings separate from your code.

## Prerequisites

* Azure subscription - [create one for free](https://azure.microsoft.com/free/dotnet)
* [.NET Core SDK](https://dotnet.microsoft.com/download)
* [helm](https://helm.sh/docs/intro/install/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/)

> [!TIP]
> The Azure Cloud Shell is a free, interactive shell that you can use to run the command line instructions in this article. It has common Azure tools preinstalled, including the .NET Core SDK. If you're logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com. You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md)

## Create an Azure App Configuration store
[!INCLUDE[Azure App Configuration resource creation steps](../../includes/azure-app-configuration-create.md)]

9. Select **Operations** > **Configuration explorer** > **Create** > **Key-value** to add the following key-value pairs:
    |**Key**|**Value**|
    |---|---|
    |TestApp__Settings__BackgroundColor|*white*|
    |TestApp__Settings__FontColor|*black*|
    |TestApp__Settings__FontSize|*24*|
    |TestApp__Settings__Message|*Data from Azure App Configuration*|
Leave **Label** and **Content type** empty for now. Select **Apply**.

## Create a Container Registry and AKS cluster

Create an Azure Container Registry (ACR) by following this [doc](/azure/aks/tutorial-kubernetes-prepare-acr?tabs=azure-cli#create-an-azure-container-registry)

Create an Azure Kubernetes Service (AKS) cluster, which integrates with the ACR you created by following this [doc](/azure/aks/tutorial-kubernetes-deploy-cluster?tabs=azure-cli#create-a-kubernetes-cluster)

Run the following command to set environment variables, set **ACR_Name** with the name of ACR you created, **AKS_Name** with the name of AKS you created, **AKS_Resource_Group** with the resource group of AKS you created:

```bash
export ACR_Name='name-of-acr-you-just-created'
export AKS_Name='name-of-aks-you-just-created'
export AKS_Resource_Group='resource-group-of-aks-you-just-created'
```

Restart the command prompt to allow the change to take effect. Print the value of the environment variable to validate that it's set properly.

## Enable System Assigned Managed Identity of AKS NodePool

Go to the corresponding Virtual Machine Scale Sets resource of AKS, and enable system-assigned managed identity on the Virtual Machine Scale Sets by following this [doc](/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vmss#enable-system-assigned-managed-identity-on-an-existing-virtual-machine-scale-set)

## System Assigned Managed Identity role assignment

Once the system-assigned managed identity has been enabled, you need to grant it read access to Azure AppConfiguration. You can do it by following the instructions in this [doc](/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity?tabs=core5x&pivots=framework-dotnet#grant-access-to-app-configuration)

## Install App Configuration Kubernetes Provider to your AKS cluster

Install the Azure App Configuration Kubernetes Provider to your AKS cluster, which was created in the previous step.
1. Get the credential to manage your AKS cluster
    ```bash
    az aks get-credentials --name $AKS_Name --resource-group $AKS_Resource_Group
    ```
2. Install Azure App Configuration Kubernetes Provider to your AKS cluster by `helm`
    ``` bash
    helm install azureappconfiguration.kubernetesprovider oci://mcr.microsoft.com/azure-app-configuration/helmchart/kubernetes-provider --version 1.0.0-alpha --namespace azappconfig-system --create-namespace
    ```

## Create a sample ASP.NET Core web app.

Use the .NET Core command-line interface (CLI) to create a new ASP.NET Core web app project. The Azure Cloud Shell provides these tools for you. They're also available across the Windows, macOS, and Linux platforms.

Run the following command to create an ASP.NET Core web app in a new TestAppConfig folder:

``` dotnetcli
dotnet new webapp --output TestAppConfig --framework net6.0
```
Do several updates to the web app project you created.
1. Add a *Settings.cs* file at the root of your project directory. It defines a strongly typed Settings class for the configuration you're going to use. Replace the namespace with the name of your project.
    ``` csharp
    namespace TestAppConfig
    {
        public class Settings
        {
            public string BackgroundColor { get; set; }
            public long FontSize { get; set; }
            public string FontColor { get; set; }
            public string Message { get; set; }
        }
    }
    ```
2. Bind the `TestApp:Settings` section in configuration to the `Settings` object.

    Update *Program.cs* with the following code and add the `TestAppConfig` namespace at the beginning of the file.

    ```csharp
    using TestAppConfig;

    // Existing code in Program.cs
    // ... ...

    builder.Services.AddRazorPages();

    // Bind configuration "TestApp:Settings" section to the Settings object
    builder.Services.Configure<Settings>(builder.Configuration.GetSection("TestApp:Settings"));

    var app = builder.Build();

    // The rest of existing code in program.cs
    // ... ...
    ```
3. Open *Index.cshtml.cs* in the Pages directory, and update the `IndexModel` class with the following code. Add the `using Microsoft.Extensions.Options` namespace at the beginning of the file, if it's not already there.
    ``` csharp
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        public Settings Settings { get; }

        public IndexModel(IOptionsSnapshot<Settings> options, ILogger<IndexModel> logger)
        {
            Settings = options.Value;
            _logger = logger;
        }
    }
    ```
4. Open *Index.cshtml* in the Pages directory, and update the content with the following code.
    ``` html
    @page
    @model IndexModel
    @{
        ViewData["Title"] = "Home page";
    }

    <style>
        body {
            background-color: @Model.Settings.BackgroundColor;
        }

        h1 {
            color: @Model.Settings.FontColor;
            font-size: @Model.Settings.FontSize;
        }
    </style>

    <h1>@Model.Settings.Message</h1>
    ```

## Containerize the web app and push to ACR

1. Create a *Dockerfile* at the root of your project directory, and put the following content into the file.
    ``` dockerfile
    FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
    WORKDIR /app
    EXPOSE 80
    EXPOSE 443

    FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
    WORKDIR /src
    COPY ["TestAppConfig.csproj", "TestAppConfig/"]
    RUN dotnet restore "TestAppConfig/TestAppConfig.csproj"
    WORKDIR "/src/TestAppConfig"
    COPY . .
    RUN dotnet build "TestAppConfig.csproj" -c Release -o /app/build

    FROM build AS publish
    RUN dotnet publish "TestAppConfig.csproj" -c Release -o /app/publish /p:UseAppHost=false

    FROM base AS final
    WORKDIR /app
    COPY --from=publish /app/publish .
    ENTRYPOINT ["dotnet", "TestAppConfig.dll"]
    ```

2. Sign in Azure Container Registry to have permission to push image.
    ```bash
    az acr login -n $ACR_Name
    ```

3. Run the following command to build the docker image under the directory of your project root, and push it to the Azure Container Registry that created in the previous step
    ```bash
    docker build . -t $ACR_Name.azurecr.io/testappconfig
    docker push $ACR_Name.azurecr.io/testappconfig
    ```

## Create Kubernetes resources

1. Create a *AKS-AppConfiguration-Demo* directory in the root directory of your project.
2. Create *appConfigurationProvider.yaml* in *AKS-AppConfiguration-Demo* directory with following yaml content. Replace the value of `endpoint` field with the endpoint of Azure AppConfiguration store you created in the previous step.
    ``` yaml
    apiVersion: azconfig.io/v1beta1
    kind: AzureAppConfigurationProvider
    metadata:
      name: appconfigurationprovider-sample
    spec:
      endpoint: https://<your_app_config>.azconfig.io
      target:
        configMapName: demo-configmap
    ```
3. Create *deployment.yaml* in *AKS-AppConfiguration-Demo* directory with the following yaml content. Replace the value of `template.containers.image` with the image you created in the previous step.
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
            image: <your_acr_name>.azurecr.io/testappconfig
            ports:
            - containerPort: 80
            envFrom:
            - configMapRef:
                name: demo-configmap
    ```
4. Create *service.yaml* in *AKS-AppConfiguration-Demo* with the following yaml content. 
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

## Apply the yaml files to AKS cluster and validate it works

Apply the resources to AKS cluster by running：
``` bash
kubectl create namespace quickstart-appconfig
kubectl apply -f ./AKS-AppConfiguration-Demo -n quickstart-appconfig
```

To check the synchronization status of AppConfigurationProvider, run the following command in your terminal, if the `phase` property in the `status` section of the output is `COMPLETE` , means the key-value pairs have been successfully synced from Azure App Configuration. 
``` bash
kubectl get AppConfigurationProvider appconfigurationprovider-sample -n quickstart-appconfig -o yaml
```
> [!TIP]
> If you see other status in `phase`, you are presumably confronting some issue, you can run the following command to check what really happened in the provider.
> ``` bash    
> kubectl logs deployment/az-appconfig-k8s-provider -n azappconfig-system
> ```   
>
 
There's a configMap *demo-configmap* being created in *quickstart-appconfig* namespace
``` bash
kubectl get configmap demo-configmap -n quickstart-appconfig
```
Run the following command, you get the External IP that exposed by the LoadBalancer service, use it to visit the web app, you'll see the configuration settings in Azure AppConfiguration are taking effect on page.
``` bash
kubectl get service configmap-demo-service -n quickstart-appconfig
```

> [!TIP]
> Note:
> 
> Currently, the provider doesn't support real-time configuration updating, if you update the configuration in Azure App Configuration, the setting in ConfigMap would not be updated automatically, you have three options to update the ConfigMap accordingly.
> 
> Option 1: Delete and re-deploy that AzureAppConfigurationProvider.
> 
> Option 2: Delete the ConfigMap, it will automatically generate a new one.
> 
> Option 3: Set a dedicated annotation in the AzureAppConfigurationProvider, trigger settings update in ConfigMap via updating the value of that annotation
>
> For example, set an annotation dynamic/timestamp with a time stamp, just need to refresh the time to trigger a setting update in ConfigMap
> ``` yaml
> apiVersion: azconfig.io/v1beta1
> kind: AzureAppConfigurationProvider
> metadata:
>   name: appconfigurationprovider-sample
>   annotations:
>     dynamic/timestamp: 2023-01-01T00:00:00.000
> spec:
>   endpoint: https://<yourappconfig>.azconfig.io
>   target:
>     configMapName: demo-configmap
> ```
> Caution! In spite of the data in ConfigMap being updated, if the ConfigMap change is not watched by your workload (Deployment, Pod, etc.), your workload will not be able to apply the updated key-values in ConfigMap. We recommend using 3rd-party tools like [stakater/Reloader](https://github.com/stakater/Reloader) to watch the changes in ConfigMap, perform automatic rolling update of correlated workloads.



## Clean up resources

[!INCLUDE[Azure App Configuration cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you:

* Provisioned a new App Configuration store.
* Connected to your App Configuration store in Kubernetes using the App Configuration Kubernetes Provider Operator.
* Sync your App Configuration store's key-values to a ConfigMap.
* Displayed a web page in Kubernetes using the settings you configured in your App Configuration store.