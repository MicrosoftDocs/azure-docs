---
title: Subscription prerequisites for Azure HDInsight on AKS.
description: Prerequisite steps to complete on your subscription before working with Azure HDInsight on AKS.
ms.topic: how-to
ms.service: hdinsight-aks
ms.date: 08/10/2023
---

# Subscription prerequisites

If you're using Azure subscription first time for HDInsight on AKS, the following features might need to be enabled.

## Enable features 

1. Sign in to [Azure portal](https://portal.azure.com).
   
1. Click the Cloud Shell icon at the top right, and select **PowerShell** or **Bash** as your environment depending on the command you use.

At the next command prompt, enter each of the following commands:

1. **Register the 'Microsoft.ContainerService' provider:**
   
   ```azurecli
   az provider register -n Microsoft.ContainerService --subscription <Your Subscription>
   ```
    
    ```powershell
    Register-AzResourceProvider -ProviderNamespace Microsoft.ContainerService
    ```
    
    **Output:** No response means the feature registration propagated and you can proceed. If you receive a response that the registration is still on-going, wait a few minutes, and run the command again until you receive no response.
   
1. **Register the 'AKS-AzureKeyVaultSecretsProvider' feature:** 

    ```azurecli
    az feature register --name AKS-AzureKeyVaultSecretsProvider --namespace "Microsoft.ContainerService" --subscription <Your Subscription>
    ```
    
    ```powershell
    Register-AzProviderFeature -FeatureName AKS-AzureKeyVaultSecretsProvider -ProviderNamespace Microsoft.ContainerService
    ```

    **Output:** All requests for this feature should be automatically approved. The state should respond as Registered.

1. **Register the 'EnablePodIdentityPreview' feature:** 

   ```azurecli
    az feature register --name EnablePodIdentityPreview --namespace "Microsoft.ContainerService" --subscription <Your Subscription>
    ```
    
    ```powershell
    Register-AzProviderFeature -FeatureName EnablePodIdentityPreview -ProviderNamespace Microsoft.ContainerService
    ```
    **Output:** The response indicates the registration is in progress. 

1. **Register the 'KubeletDisk' feature:** 
    ```azurecli
    az feature register --name KubeletDisk --namespace "Microsoft.ContainerService" --subscription <Your Subscription>
    ```
    
    ```powershell
    Register-AzProviderFeature -FeatureName KubeletDisk -ProviderNamespace Microsoft.ContainerService
    ```
    
    **Output:** The response indicates the registration is in progress. 

## Next steps
* [One-click deployment](./getting-started.md)
