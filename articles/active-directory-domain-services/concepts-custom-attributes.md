---
title: Create and manage custom attributes for Azure AD Domain Services | Microsoft Docs
description: Learn how to create and manage custom attributes in an Azure AD DS managed domain.
services: active-directory-ds
author: AlexCesarini
manager: amycolannino

ms.assetid: 1a14637e-b3d0-4fd9-ba7a-576b8df62ff2
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 03/07/2023
ms.author: justinha

---
# Custom attributes for Azure Active Directory Domain Services

For various reasons, companies often can’t modify code for legacy apps. For example, apps may use a custom attribute, such as a custom employee ID, and rely on that attribute for LDAP operations. 

Azure AD supports adding custom data to resources using [extensions](/graph/extensibility-overview). Azure Active Directory Domain Services (Azure AD DS) can synchronize the following types of extensions from Azure AD, so you can also use apps that depend on custom attributes with Azure AD DS:  

- [onPremisesExtensionAttributes](/graph/extensibility-overview?tabs=http#extension-attributes) are a set of 15 attributes that can store extended user string attributes. 
- [Directory extensions](/graph/extensibility-overview?tabs=http#directory-azure-ad-extensions) allow the schema extension of specific directory objects, such as users and groups, with strongly typed attributes through registration with an application in the tenant. 

Both types of extensions can be configured by using Azure AD Connect for users who are managed on-premises, or Microsoft Graph APIs for cloud-only users. 

>[!Note] 
>The following types of extensions aren't supported for synchronization:  
>- Custom security attributes in Azure AD (Preview)
>- Microsoft Graph schema extensions
>- Microsoft Graph open extensions


## Requirements 

The minimum SKU supported for custom attributes is the Enterprise SKU. If you use Standard, you need to [upgrade](change-sku.md) the managed domain to Enterprise or Premium. For more information, see [Azure Active Directory Domain Pricing](https://azure.microsoft.com/pricing/details/active-directory-ds/). 

## How Custom Attributes work 

After you create a managed domain, click **Custom Attributes (Preview)** under **Settings** to enable attribute synchronization. Click **Save** to confirm the change. 

:::image type="content" border="true" source="./media/concepts-custom-attributes/enable.png" alt-text="Screenshot of how to enable custom attributes.":::

## Enable predefined attribute synchronization 

Click **OnPremisesExtensionAttributes** to synchronize the attributes extensionAttribute1-15, also known as [Exchange custom attributes](/graph/api/resources/onpremisesextensionattributes).

## Synchronize Azure AD directory extension attributes 

These are the extended user or group attributes defined in your Azure AD tenant. 

Select **+ Add** to choose which custom attributes to synchronize. The list shows the available extension properties in your tenant. You can filter the list by using the search bar. 

:::image type="content" border="true" source="./media/concepts-custom-attributes/add.png" alt-text="Screenshot of how to add directory extension attributes.":::


If you don't see the directory extension you are looking for, enter the extension’s associated application appId and click **Search** to load only that application’s defined extension properties. This search helps when multiple applications define many extensions in your tenant.  

>[!NOTE]
>If you would like to see directory extensions synchronized by Azure AD Connect, click **Enterprise App** and look for the Application ID of the **Tenant Schema Extension App**. For more information, see [Azure AD Connect sync: Directory extensions](../active-directory/hybrid/how-to-connect-sync-feature-directory-extensions.md#configuration-changes-in-azure-ad-made-by-the-wizard).  

Click **Select**, and then **Save** to confirm the change. 

:::image type="content" border="true" source="./media/concepts-custom-attributes/select.png" alt-text="Screenshot of how to save directory extension attributes.":::

Azure AD DS back fills all synchronized users and groups with the onboarded custom attribute values. The custom attribute values gradually populate for objects that contain the directory extension in Azure AD. During the backfill synchronization process, incremental changes in Azure AD are paused, and the sync time depends on the size of the tenant. 

To check the backfilling status, click **Azure AD DS Health** and verify the **Synchronization with Azure AD** monitor has an updated timestamp within an hour since onboarding. Once updated, the backfill is complete. 

## Next steps 

To configure onPremisesExtensionAttributes or directory extensions for cloud-only users in Azure AD, see [Custom data options in Microsoft Graph](/graph/extensibility-overview?tabs=http#custom-data-options-in-microsoft-graph). 

To sync onPremisesExtensionAttributes or directory extensions from on-premises to Azure AD, [configure Azure AD Connect](../active-directory/hybrid/how-to-connect-sync-feature-directory-extensions.md). 
