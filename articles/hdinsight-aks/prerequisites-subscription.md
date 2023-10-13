---
title: Subscription prerequisites for Azure HDInsight on AKS.
description: Prerequisite steps to complete on your subscription before working with Azure HDInsight on AKS.
ms.topic: how-to
ms.service: hdinsight-aks
ms.date: 08/29/2023
---

# Subscription prerequisites

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

If you're using Azure subscription first time for HDInsight on AKS, the following features might need to be enabled.

## Tenant registration

If you're trying to onboard a new tenant to HDInsight on AKS, you need to provide consent to first party App of HDInsight on AKS to Access API. This app will try to provision the application used to authenticate cluster users and groups.

> [!NOTE]
> Tenant admin would be able to run the command to provision the first party service principal on the given tenant.

**Commands**: 

```azurecli
az ad sp create --id d3d1a4fe-edb2-4b09-bc39-e41d342323d6
```

```azurepowershell
New-AzureADServicePrincipal -AppId d3d1a4fe-edb2-4b09-bc39-e41d342323d6
```

## Enable features 

1. Sign in to [Azure portal](https://portal.azure.com).
   
1. Click the Cloud Shell icon (:::image type="icon" source="./media/prerequisites-subscription/cloud-shell.png" alt-text="Screenshot screenshot showing Cloud Shell icon.":::) at the top right, and select **PowerShell** or **Bash** as your environment depending on the command you use.

At the next command prompt, enter each of the following commands:
 
1. **Register your subscription for 'AKS-AzureKeyVaultSecretsProvider' feature.** 

    ```azurecli
    az feature register --name AKS-AzureKeyVaultSecretsProvider --namespace "Microsoft.ContainerService" --subscription <Your Subscription>
    ```
    
    ```powershell
    Register-AzProviderFeature -FeatureName AKS-AzureKeyVaultSecretsProvider -ProviderNamespace Microsoft.ContainerService
    ```

    **Output:** All requests for this feature should be automatically approved. The state in the response should show as **Registered**. 
                <br>If you receive a response that the registration is still on-going (state in the response shows as "Registering"), wait for a few minutes. <br>Run the command again in few minutes and the state changes to "Registered" once feature registration is completed.

1. **Register your subscription for 'EnablePodIdentityPreview' feature.** 

   ```azurecli
    az feature register --name EnablePodIdentityPreview --namespace "Microsoft.ContainerService" --subscription <Your Subscription>
    ```
    
    ```powershell
    Register-AzProviderFeature -FeatureName EnablePodIdentityPreview -ProviderNamespace Microsoft.ContainerService
    ```
    **Output:** The response indicates the registration is in progress (state in the response shows as "Registering"). It might take a few minutes to register the feature.
      <br>Run the command again in few minutes and the state changes to "Registered" once feature registration is completed.

1. **Register your subscription for 'KubeletDisk' feature.**
   
    ```azurecli
    az feature register --name KubeletDisk --namespace "Microsoft.ContainerService" --subscription <Your Subscription>
    ```
    
    ```powershell
    Register-AzProviderFeature -FeatureName KubeletDisk -ProviderNamespace Microsoft.ContainerService
    ```
    
    **Output:** The response indicates the registration is in progress (state in the response shows as "Registering"). It might take a few minutes to register the feature.
      <br>Run the command again in few minutes and the state changes to "Registered" once feature registration is completed.

1. **Register with 'Microsoft.ContainerService' provider to propagate the features registered in the previous steps.**  
   
   ```azurecli
   az provider register -n Microsoft.ContainerService --subscription <Your Subscription>
   ```
    
    ```powershell
    Register-AzResourceProvider -ProviderNamespace Microsoft.ContainerService
    ```
    
    **Output:** No response means the feature registration propagated and you can proceed. If you receive a response that the registration is still on-going, wait for a few minutes, and run the command again until you receive no response.

## Next steps
* [One-click deployment](./get-started.md)
