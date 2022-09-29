---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: storage
 ms.topic: include
 ms.date: 06/21/2022
 ms.author: rogarana
 ms.custom: include file
---
- Install the latest [Azure PowerShell module](/powershell/azure/install-az-ps).
- You must enable the preview on your subscription, use the following command to enable the preview:
    ```azurepowershell
    Register-AzProviderFeature -FeatureName "AllowAADAuthForDataAccess" -ProviderNamespace "Microsoft.Compute"
    ```

    It may take some time for the feature registration to complete, you can confirm if it has with the following command:
    
    ```azurepowershell
    Get-AzProviderFeature -FeatureName "AllowAADAuthForDataAccess" -ProviderNamespace "Microsoft.Compute"
    ```