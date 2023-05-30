---
author: jifems
ms.author: jife
ms.service: purview
ms.subservice: purview-data-share
ms.topic: include
ms.date: 02/16/2023
---

## Prerequisites

### Microsoft Purview prerequisites

* [A Microsoft Purview account](../create-catalog-portal.md). You can also use two Microsoft Purview accounts, one for data provider and one for data consumer to test both scenarios.
* Your recipient's Azure sign-in email address that you can use to send the invitation to. The recipient's email alias won't work.

### Azure Storage account prerequisites

* Your Azure subscription must be registered for the **AllowDataSharing** preview feature. Follow the below steps using Azure portal or PowerShell. 

    # [Portal](#tab/azure-portal)
    1. In Azure portal, select your Azure subscription that you'll use to create the source and target storage account.
    1. From the left menu, select **Preview features** under *Settings*.
    1. Select **AllowDataSharing** and *Register*. 
    1. Refresh the *Preview features* screen to verify the *State* is **Registered**. It could take 15 minutes to 1 hour for registration to complete. 
    1. In addition, to use data share for storage accounts in East US, East US2, North Europe, Southcentral US, West Central US, West Europe, West US, West US2: Select AllowDataSharingInHeroRegion and Register
    
    For more information, see [Register preview feature](../../azure-resource-manager/management/preview-features.md?tabs=azure-portal#register-preview-feature).

    # [PowerShell](#tab/powershell)
    ```azurepowershell
    Set-AzContext -SubscriptionId [Your Azure subscription ID]
    ```
    ```azurepowershell
    Register-AzProviderFeature -FeatureName "AllowDataSharing" -ProviderNamespace "Microsoft.Storage"​
    ```
    ```azurepowershell
    Get-AzProviderFeature -FeatureName "AllowDataSharing" -ProviderNamespace "Microsoft.Storage"   
    ```
     In addition, to use data share for storage accounts in East US, East US2, North Europe, Southcentral US, West Central US, West Europe, West US, West US2: 

    ```azurepowershell
    Register-AzProviderFeature -FeatureName "AllowDataSharingInHeroRegion" -ProviderNamespace "Microsoft.Storage"
    ```
    ```azurepowershell
    Get-AzProviderFeature -FeatureName "AllowDataSharingInHeroRegion" -ProviderNamespace "Microsoft.Storage"   
    ```
The *RegistrationState* should be **Registered**. It could take 15 minutes to 1 hour for registration to complete. For more information, see [Register preview feature](../../azure-resource-manager/management/preview-features.md?tabs=azure-portal#register-preview-feature).

[!INCLUDE [share-storage-configuration](share-storage-configuration.md)]

* Source and target storage accounts **created after** the registration step is completed. **Both storage accounts must be in the same Azure region as each other**. Both storage accounts need to be ADLS Gen2 or Blob Storage accounts. Your storage accounts can be in a different Azure region from your Microsoft Purview account.
* Latest version of the storage SDK, PowerShell, CLI and Azure Storage Explorer. Storage REST API version must be February 2020 or later.
* The storage accounts need to be registered in the collections where you'll send or receive the share. If you're using one Microsoft Purview account, this can be two different collections, or the same collection. For instructions to register, see the [ADLS Gen2](../register-scan-adls-gen2.md) or [Blob storage](../register-scan-azure-blob-storage-source.md) data source pages.
* If the source or target storage accounts are in a different Azure subscription than the one for Microsoft Purview account, the Microsoft.Purview resource provider is automatically registered in the Azure subscription where the data store is located at the time of share provider adding an asset or share consumer mapping an asset and **ONLY** if the user has permission to do the /register/action operation for the resource provider. The permission is included in the Contributor and Owner roles.
    >[!NOTE]
    > This registration is only needed the first time when sharing or receiving data into a storage account in the Azure subscription.

### Required roles

Below are required roles for sharing data and receiving shares.

| | Azure Storage Account Roles | Microsoft Purview Collection Roles |
|:--- |:--- |:--- |
| **Data Provider** |Owner OR Storage Blob Data Owner|Data Reader|
| **Data Consumer** |Contributor OR Owner OR Storage Blob Data Contributor OR Storage Blob Data Owner|Data Reader|

> [!NOTE]
> If you created the Microsoft Purview account, you're automatically assigned all the roles to the root collection. Refer to [Microsoft Purview permissions](../catalog-permissions.md) to learn more about the Microsoft Purview collection and roles.
