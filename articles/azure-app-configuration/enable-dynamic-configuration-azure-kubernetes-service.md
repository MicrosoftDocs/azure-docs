---
title: "Tutorial: Use dynamic configuration in Azure App Configuration Kubernetes Provider"
description: "In this quickstart, use the Azure App Configuration Kubernetes Provider to dynamically load updated key-values from App Configuration store."
services: azure-app-configuration
author: junbchen
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp
ms.topic: tutorial
ms.date: 02/16/2024
ms.author: linglingye
#Customer intent: As an Azure Kubernetes Service user, I want to manage all my app settings in one place using Azure App Configuration.
---

# Tutorial: Use dynamic configuration in Azure Kubernetes Service

If you use Azure Kubernetes Service (AKS), this tutorial shows you how to enable dynamic configuration for your workloads in AKS by leveraging Azure App Configuration and its Kubernetes Provider. The tutorial assumes that you work through the quickstart and have an App Configuration Kubernetes Provider set up, so before proceeding, make sure you complete the [Use Azure App Configuration in Azure Kubernetes Service](./quickstart-azure-kubernetes-service.md) quickstart.

> [!TIP]
> See [options](./howto-best-practices.md#azure-kubernetes-service-access-to-app-configuration) for workloads hosted in Kubernetes to access Azure App Configuration.

## Prerequisites

Finish the quickstart: [Use Azure App Configuration in Azure Kubernetes Service](./quickstart-azure-kubernetes-service.md).

## Reload data from App Configuration

1. Open the *appConfigurationProvider.yaml* file located in the *Deployment* directory. Then, add the `refresh` section under the `configuration` property. It enables the Kubernetes provider to reload the entire configuration whenever it detects a change in any of the selected key-values (those starting with *Settings:* and having no label). For more information about monitoring configuration changes, see [Best practices for configuration refresh](./howto-best-practices.md#configuration-refresh).

    ```yaml
    apiVersion: azconfig.io/v1
    kind: AzureAppConfigurationProvider
    metadata:
      name: appconfigurationprovider-sample
    spec:
      endpoint: <your-app-configuration-store-endpoint>
      target:
        configMapName: configmap-created-by-appconfig-provider
        configMapData: 
          type: json
          key: mysettings.json
      auth:
        workloadIdentity:
          managedIdentityClientId: <your-managed-identity-client-id>
      configuration:
        refresh:
          enabled: true
    ```

    > [!TIP]
    > You can set the `interval` property of the `refresh` to specify the minimum time between configuration refreshes. In this example, you use the default value of 30 seconds. Adjust to a higher value if you need to reduce the number of requests made to your App Configuration store.

1. Open the *deployment.yaml* file in the *Deployment* directory and add the following content to the `spec.containers` section. Your application loads configuration from a volume-mounted file the App Configuration Kubernetes provider generates. By setting this environment variable, your application can [use polling to monitor changes in mounted files](/dotnet/api/microsoft.extensions.fileproviders.physicalfileprovider.usepollingfilewatcher).

    ```yaml
    env:
    - name: DOTNET_USE_POLLING_FILE_WATCHER
      value: "true"
    ```

1. Run the following command to deploy the change. Replace the namespace if you're using your existing AKS application.
   
   ```console
   kubectl apply -f ./Deployment -n appconfig-demo
   ```

1. Open a browser window, and navigate to the IP address obtained in the [previous step](./quickstart-azure-kubernetes-service.md#deploy-the-application). The web page looks like this:

    ![Screenshot of the web app with old values.](./media/quickstarts/kubernetes-provider-app-launch-after.png)


1. Update the following key-values in your App Configuration store, ensuring to update the sentinel key last.

    | Key | Value |
    |---|---|
    | Settings:Message | Hello from Azure App Configuration - now with live updates! |

1. After refreshing the browser a few times, you'll see the updated content once the ConfigMap is updated in 30 seconds.

    ![Screenshot of the web app with updated values.](./media/quickstarts/kubernetes-provider-app-launch-dynamic-after.png)

## Reload ConfigMap and Secret

App Configuration Kubernetes provider generates ConfigMaps or Secrets that can be used as environment variables or volume-mounted files. This tutorial demonstrated how to load configuration from a JSON file using the [.NET JSON configuration provider](/dotnet/core/extensions/configuration-providers#json-configuration-provider), which automatically reloads the configuration whenever a change is detected in the mounted file. As a result, your application gets the updated configuration automatically whenever the App Configuration Kubernetes provider updates the ConfigMap.

If your application is dependent on environment variables for configuration, it may require a restart to pick up any updated values. In Kubernetes, the application restart can be orchestrated using rolling updates on the corresponding pods or containers. To automate configuration updates, you may leverage third-party tools like [stakater/Reloader](https://github.com/stakater/Reloader), which can automatically trigger rolling updates upon any changes made to ConfigMaps or Secrets.

## Next steps

To learn more about the Azure App Configuration Kubernetes Provider, see [Azure App Configuration Kubernetes Provider reference](./reference-kubernetes-provider.md).