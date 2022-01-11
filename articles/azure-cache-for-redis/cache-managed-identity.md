---
title: Managed Identity
titleSuffix: Azure Cache for Redis
description: Learn to Azure Cache for Redis
author: flang-msft
ms.service: cache
ms.topic: conceptual
ms.date: 01/21/2022
ms.author: franlanglois
---


[Managed identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) are a common tool used in Azure to help developers minimize the burden of managing secrets and login information. This is particularly useful when Azure services connect to each other. Instead of managing authorization between each service, [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis) (Azure AD) can be used to provide a managed identity that makes the authentication process more streamlined and secure.

# Managed identity with Azure Cache for Redis

Azure Cache for Redis can use managed identity to connect with a storage account. This is useful in two scenarios:

- [**Data Persistence**](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-how-to-premium-persistence) -- scheduled backups of data in your cache through a RDB or AOF file.

- **[Import or Export](https://docs.microsoft.com/en-us/azure/azure-cache-for-redis/cache-how-to-import-export-data) --** saving snapshots of cache data or importing data from a saved file.

By using managed identity functionality, the process of securely connecting to your chosen storage account for these tasks can be simplified.

NOTE: This functionality does not yet support authentication for connecting to a cache instance.

Azure Cache for Redis supports [both types of managed identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types):

-   **System-assigned identity** is specific to the resource. (In this case, the cache.) When the cache is deleted, the identity is deleted.

-   **User-assigned identity** is specific to a user, not the resource. It can be assigned to any resource which supports managed identity and will remain even if the cache is deleted.

Each type of managed identity has advantages, but the end functionality in Azure Cache for Redis is the same.

## Prerequisites & Limitations

To use managed identity, you must be using a premium-tier cache.

## Enable managed identity

Managed identity can be enabled either during the creation of a cache instance or after the cache has already been created. During the creation of a cache, only a system-assigned identity can be assigned. Either identity type can be added to an existing cache.

### Create a new cache with managed identity using the portal

1.  Sign into the [Azure portal](https://portal.azure.com/)

2.  Create a new Azure Cache for Redis instance and fill out the basic information.

![](media/image1.png){width="5.4375in" height="3.8555555555555556in"}

NOTE: managed identity functionality is only available in the Premium tier.

3.  In the **advanced** tab, scroll down to the section titled **(PREVIEW) System assigned managed identity** and select **On**.

![Text Description automatically generated](media/image3.png){width="5.239583333333333in" height="1.3580369641294838in"}

4.  Complete the creation process. Once the cache has been created, open it, and select the **(PREVIEW) Identity** tab under the **Settings** section on the left.

![](media/image4.png){width="1.8298611111111112in" height="4.09375in"}

5.  You will see that a **system-assigned** **identity** has been assigned to the cache instance.

![Graphical user interface, text, application, email Description automatically generated](media/image6.png){width="6.5in" height="2.3090277777777777in"}

## 

### Update an existing cache to use managed identity using the portal

1.  Sign into the [Azure portal](https://portal.azure.com/)

2.  Navigate to your Azure Cache for Redis account. Open the **(PREVIEW) Identity** tab under the **Settings** section on the left.

![](media/image4.png){width="1.8298611111111112in" height="4.09375in"}

NOTE: managed identity functionality is only available in the Premium tier.

#### System Assigned Identity

1.  To enable **system-assigned identity**, select the **System assigned (preview)** tab, and select **On** under **Status**. Click **Save** to confirm. A dialog will pop up saying that your cache will be registered with Azure Active Directory and that it can be granted permissions to access resources protected by Azure AD. Select **Yes**.

![](media/image7.png){width="6.5in" height="1.2604166666666667in"}

2.  You will now see an Object (principal) ID, indicating that the identity has been assigned.

![Graphical user interface, text, application, email Description automatically generated](media/image9.png){width="6.5in" height="2.285416666666667in"}

#### User assigned identity

1.  To enable **user-assigned identity**, select the **User assigned (preview)** tab and click **Add**.

![](media/image10.png){width="6.5in" height="1.4361111111111111in"}

2.  A sidebar will pop up to allow you to select a user-assigned identity available to your subscription. Select your chosen user-assigned identity and select **Add**

![](media/image12.png){width="2.7729166666666667in" height="4.364583333333333in"}

Note: You will need to [create a user assigned identity](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp) in advance of this step.

3.  You will see the user-assigned identity listed in the **User assigned (preview)** tab.

![Graphical user interface, text, application, email Description automatically generated](media/image14.png){width="6.5in" height="1.4215277777777777in"}

## 

### Enable managed identity using the Azure CLI

Use the Azure CLI for creating a new cache with managed identity or updating an existing cache to use managed identity. For more information, see [az redis create](https://docs.microsoft.com/cli/azure/redis?view=azure-cli-latest#az-redis-create) or [az redis identity](https://docs.microsoft.com/en-us/cli/azure/redis/identity?view=azure-cli-latest).

For example, to update a cache to use system-managed identity use the following CLI command:

!CODE: az redis identity assign \--mi-system-assigned \--name MyCacheName \--resource-group MyResource Group

### Enable managed identity using Azure PowerShell

Use Azure PowerShell for creating a new cache with managed identity or updating an existing cache to use managed identity. For more information, see [New-AzRedisCache](https://docs.microsoft.com/powershell/module/az.rediscache/new-azrediscache?view=azps-7.1.0) or [Set-AzRedisCache](https://docs.microsoft.com/powershell/module/az.rediscache/set-azrediscache?view=azps-7.1.0).

For example, to update a cache to use system-managed identity use the following PowerShell command:

!CODE: Set-AzRedisCache -ResourceGroupName \"MyGroup\" -Name \"MyCache\" -IdentityType "SystemAssigned"

## Configure storage account to use managed identity

IMPORTANT: managed identity must be configured in the storage account before Azure Cache for Redis can access the account for persistence or import/export functionality. If this step is not done correctly, you will see errors or no data written.

1. Create a new storage account or open an existing storage account that you would like to connect to your cache instance.

1. Open the **Access control (IAM)** tab, click on **Add**, and select **Add role assignment**.

![](media/image15.png){width="6.5in" height="3.4in"}

1. Search for the **Storage Blob Data Contributor** role, select it, and click **Next**.

![](media/image17.png){width="6.5in" height="3.0104166666666665in"}

1. Under **Assign access to** select **Managed Identity**, and click on **Select members**. A sidebar will pop up on the right.

> ![](media/image19.png){width="6.5in" height="2.8256944444444443in"}

1.  Use the drop down under **Managed Identity** to choose either a **User-assigned managed identity** or a **System-assigned managed identity**. If you have many managed identities, you can search by name. Select the managed identities of your choice and click **Select**, and then **Review + assign** to confirm.

![](media/image21.png){width="6.500001093613299in" height="2.8916666666666666in"}

1.  You can confirm if the identity has been assigned successfully by checking your storage account's role assignments under "Storage Blob Data Contributor"

![](media/image23.png){width="6.5in" height="0.7611111111111111in"}

NOTE: Adding an Azure Cache for Redis instance as a storage blog data contributor through system-assigned identity will conveniently add the cache instance to the [trusted services list](https://docs.microsoft.com/en-us/azure/storage/common/storage-network-security?tabs=azure-portal#exceptions), making firewall exceptions easier to implement.

## Use Managed Identity to access a storage account

### Use managed identity with data persistence

1. Open your Azure Cache for Redis instance which has been assigned the Storage Blob Data Contributor role and go to the **Data persistence** tab under **Settings**.

1. Change the **Authentication Method** to **(PREVIEW) Managed Identity** and select the storage account you configured above. Click **Save**.

![Graphical user interface, text, application, email Description automatically generated](media/image24.png){width="6.5in" height="4.0159722222222225in"}

> IMPORTANT: The identity used will default to system-assigned identity if it is enabled. Otherwise, the first listed user-assigned identity will be used.

1. Data persistence backups can now be saved to the storage account using managed identity authentication.

![Graphical user interface, text, application, email Description automatically generated](media/image25.png){width="6.5in" height="2.0118055555555556in"}

### Use Managed identity to import and export cache data

1. Open your Azure Cache for Redis instance which has been assigned the Storage Blob Data Contributor role and go to the **Import** or **Export** tab under **Administration**.

1. If importing data, choose the blob storage location that holds your chosen RDB file. If exporting data, enter your desired blob name prefix and storage container. In both situations, you must use the storage account you've configured for managed identity access.

![Graphical user interface, application Description automatically generated](media/image26.png){width="6.5in" height="2.716666666666667in"}

1. Under **Authentication Method**, choose **(PREVIEW) Managed Identity** and select **Import** or **Export**, respectively.

> NOTE: It will take a few minutes to import or export the data.
>
> IMPORTANT: If you see an export or import failure, double check that your storage account has been configured with your cache's system-assigned or user-assigned identity. The identity used will default to system-assigned identity if it is enabled. Otherwise, the first listed user-assigned identity will be used.

# Next Steps

[Learn more](https://docs.microsoft.com/azure/azure-cache-for-redis/cache-overview#service-tiers) about Azure Cache for Redis features
