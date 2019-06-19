---
 title: include file
 description: include file
 services: bastion
 author: cherylmc
 ms.service: bastion
 ms.topic: include
 ms.date: 05/28/2019
 ms.author: cherylmc
 ms.custom: include file
---

1. Make sure that you are signed into your Azure account and are using the subscription that you want to onboard for this preview. Use the following example to enroll:

    ```azurepowershell-interactive
    Register-AzureRmProviderFeature -FeatureName AllowBastionHost -ProviderNamespace Microsoft.Network
    ```
2.  Reregister your subscription once again with the *Microsoft.Network* provider namespace.

    ```azurepowershell-interactive
    Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network
    ````
3. Use the following command to verify that the *AllowBastionHost* feature is registered with your subscription:

    ```azurepowershell-interactive
    Get-AzureRmProviderFeature -ProviderNamespace Microsoft.Network
    ````

    It may take a few minutes for registration to complete.