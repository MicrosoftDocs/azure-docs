---
title: "Tutorial: Use dynamic configuration in Azure App Configuration Kubernetes Provider | Microsoft Docs"
description: "In this quickstart, use the Azure App Configuration Kubernetes Provider to dynamically load updated key-values from App Configuration store."
services: azure-app-configuration
author: junbchen, linglingye
ms.service: azure-app-configuration
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-other
ms.topic: quickstart
ms.date: 10/17/2023
ms.author: junbchen, linglingye
#Customer intent: As an Azure Kubernetes Service user, I want to manage all my app settings in one place using Azure App Configuration.
---

# Tutorial: Use dynamic configuration in Azure App Configuration Kubernetes Provider (preview)

This tutorial shows how you can enable dynamic configuration updates in Azure App Configuration Kubernetes Provider. It builds on the web app introduced in the quickstart. Your app in Azure Kubernetes Service can use this tutorial to get updated data from Azure App Configuration automatically. Before you continue, finish [Use Azure App Configuration in Azure Kubernetes Service](./quickstart-azure-kubernetes-service.md) first.


## Prerequisites

Finish the quickstart: [Use Azure App Configuration in Azure Kubernetes Service](./quickstart-azure-kubernetes-service.md).

> [!TIP]
> The Azure Cloud Shell is a free, interactive shell that you can use to run the command line instructions in this article. It has common Azure tools preinstalled, including the .NET Core SDK. If you're logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com. You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md)
>
## Add a sentinel key

A *sentinel key* is a key that you update after you complete the change of all other keys. Your app monitors the sentinel key. When a change is detected, your app refreshes all configuration values. This approach helps to ensure the consistency of configuration in your app and reduces the overall number of requests made to your App Configuration store, compared to monitoring all keys for changes.

1. In the Azure portal, open your App Configuration store and select **Configuration Explorer > Create > Key-value**.
1. For **Key**, enter *Settings:Sentinel*. For **Value**, enter 1. Leave **Label** and **Content type** blank.
1. Select **Apply**.

## Reload data from App Configuration

1. Update the *appConfigurationProvider.yaml* in *Deployment* directory with the following content to enable the dynamic data refresh. Replace the value of the `endpoint` field with the endpoint of your Azure App Configuration store, and the value of the `spec.auth.workloadIdentity.managedIdentityClientId` field with the client ID of the user-assigned managed identity you created before.

    ```yaml
    apiVersion: azconfig.io/v1beta1
    kind: AzureAppConfigurationProvider
    metadata:
      name: appconfigurationprovider-sample
    spec:
      endpoint: <your-app-configuration-store-endpoint>
      target:
        configMapName: configmap-created-by-appconfig-provider
        configMapData: 
          type: json
          key: demosettings.json
      auth:
        workloadIdentity:
          managedIdentityClientId: <your-managed-identity-client-id>
      keyValues:
        refresh:
          monitoring:
            keyValues:
            - key: Settings:Sentinel
    ```
1. Modify the *deployment.yaml* file in the *Deployment* directory to include `DOTNET_USE_POLLING_FILE_WATCHER` which monitors changes to mounted ConfigMap.

    Add `env` section with the following content in `spec.containers` section.
    ```yaml
    env:
    - name: DOTNET_USE_POLLING_FILE_WATCHER
      value: "true"
    ```

1. Run the following command to deploy the change. Replace the namespace if you are using your existing AKS application.
   
   ```console
   kubectl apply -f ./Deployment -n appconfig-demo
   ```

1. Select **Configuration explorer**, and update the values of the following keys. Remember to update the sentinel key at last.

    | Key | Value |
    |---|---|
    | Settings:FontColor | lightGray |
    | Settings:Message | Hello from Azure App Configuration - now with live updates! |
    | Settings:Sentinel | 2 |

1. Refresh the browser, you should see the updated values.

    ![Screenshot of the web app with updated values](./media/quickstarts/kubernetes-provider-app-launch-dynamic.png)

    > [!TIP]
    > You can set `refresh.interval` field to specify the minimum time between configuration refreshes. In this example, you use the default value of 30 seconds. Adjust to a higher value if you need to reduce the number of requests to your App Configuration store.

    > [!IMPORTANT]
    > Azure App Configuration Kubernetes provider updates the data in ConfigMap dynamically, when ConfigMap is used as mounted file, the kubelet checks whether the mounted ConfigMap is fresh on every periodic sync, therefore it will receive ConfigMap updates automatically without restart. Use Azure App Configuration Kubernetes Provider to generate a [file-style configMap](#placeholder-of-file-style-configmap-refrence-doc) would be helpful to consume the key-values as a file to avoid workloads restart.
    >
    > When ConfigMap's data is used as container environment variables, restarting the deployment is required to pick up the changes in the ConfigMap. That's because environment variables are injected into the pods just at the start-up-time. There're third party solutions (for example [stakater/Reloader](https://github.com/stakater/Reloader)) which can be leveraged to automatically restart the workloads by watching the configMap update. 

## Next steps

To learn more about the Azure App Configuration Kubernetes Provider, see [Azure App Configuration Kubernetes Provider reference](./reference-kubernetes-provider.md).