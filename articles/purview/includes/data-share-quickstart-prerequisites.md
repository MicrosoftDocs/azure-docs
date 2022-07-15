---
author: jifems
ms.author: jife
ms.service: purview
ms.subservice: purview-data-share
ms.topic: include
ms.date: 07/15/2022
---

## Prerequisites

### Microsoft Purview prerequisites

* [A Microsoft Purview account](create-catalog-portal.md). You can also use two Microsoft Purview accounts, one for data provider and one for data consumer to test both workflows.
* Your recipient's Azure sign-in email address that you can use to send the invitation to. The recipient's email alias won't work.

### Azure Storage account prerequisites

* Your Azure subscription must be registered for the **AllowDataSharing** preview feature. Follow the below steps using Azure portal or PowerShell. 

    # [Portal](#tab/azure-portal)
    1. In Azure portal, select your Azure subscription that you'll use to create the source and target storage account.
    1. From the left menu, select **Preview features** under *Settings*.
    1. Select **AllowDataSharing** and *Register*. 
    1. Refresh the *Preview features* screen to verify the *State* is **Registered**. It could take 15 minutes to 1 hour for registration to complete. 

    For more information, see [Register preview feature](../azure-resource-manager/management/preview-features.md?tabs=azure-portal#register-preview-feature).

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
    The *RegistrationState* should be **Registered**. It could take 15 minutes to 1 hour for registration to complete. For more information, see [Register preview feature](../azure-resource-manager/management/preview-features.md?tabs=azure-portal#register-preview-feature).

* Source and target storage accounts **created after** the registration step is completed. **Both storage accounts must be in the same Azure region as each other**. Both storage accounts need to be ADLS Gen2 or Blob Storage accounts. Your storage accounts can be in a different Azure region from your Microsoft Purview account.

    > [!NOTE]
    > The following are supported storage account configurations:
    >
    > - Azure regions: Canada Central, Canada East, UK South, UK West, Australia East, Japan East, Korea South, and South Africa North 
    > - Performance: Standard
    > - Redundancy options: LRS, GRS, RA-GRS

* If the storage accounts are in an Azure subscription different than Microsoft Purview account, [register the Microsoft.Purview resource provider](../azure-resource-manager/management/resource-providers-and-types.md) in the Azure subscription where the storage accounts are located.
* Latest version of the storage SDK, PowerShell, CLI and Azure Storage Explorer. Storage REST API version must be February 2020 or later.
* The storage accounts need to be registered in the collections where you'll send or receive the share. If you're using one Microsoft Purview account, this can be two different collections, or the same collection. For instructions to register, see the [ADLS Gen2](register-scan-adls-gen2.md) or [Blob storage](register-scan-azure-blob-storage-source.md) data source pages.

### Required roles
Below are required roles for sharing data and receiving shares.

| | Azure Storage Account Roles | Microsoft Purview Collection Roles |
|:--- |:--- |:--- |
| **Data Provider** |Owner OR Storage Blob Data Owner|Data Share Contributor|
| **Data Consumer** |Contributor OR Owner OR Storage Blob Data Contributor OR Storage Blob Data Owner|Data Share Contributor|

Note: If you created the Microsoft Purview account, you're automatically assigned all the roles to the root collection. Refer to [Microsoft Purview permissions](catalog-permissions.md) to learn more about the Microsoft Purview collection and roles.