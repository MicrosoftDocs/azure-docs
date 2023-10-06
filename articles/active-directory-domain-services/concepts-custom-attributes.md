---
title: Create and manage custom attributes for Microsoft Entra Domain Services | Microsoft Docs
description: Learn how to create and manage custom attributes in a Domain Services managed domain.
services: active-directory-ds
author: AlexCesarini
manager: amycolannino

ms.assetid: 1a14637e-b3d0-4fd9-ba7a-576b8df62ff2
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 09/21/2023
ms.author: justinha

---
# Custom attributes for Microsoft Entra Domain Services

For various reasons, companies often can’t modify code for legacy apps. For example, apps may use a custom attribute, such as a custom employee ID, and rely on that attribute for LDAP operations. 

Microsoft Entra ID supports adding custom data to resources using [extensions](/graph/extensibility-overview). Microsoft Entra Domain Services can synchronize the following types of extensions from Microsoft Entra ID, so you can also use apps that depend on custom attributes with Domain Services:  

- [onPremisesExtensionAttributes](/graph/extensibility-overview?tabs=http#extension-attributes) are a set of 15 attributes that can store extended user string attributes. 
- [Directory extensions](/graph/extensibility-overview?tabs=http#directory-azure-ad-extensions) allow the schema extension of specific directory objects, such as users and groups, with strongly typed attributes through registration with an application in the tenant. 

Both types of extensions can be configured by using Microsoft Entra Connect for users who are managed on-premises, or Microsoft Graph APIs for cloud-only users. 

>[!Note] 
>The following types of extensions aren't supported for synchronization:  
>- Custom security attributes in Microsoft Entra ID (Preview)
>- Microsoft Graph schema extensions
>- Microsoft Graph open extensions


## Requirements 

The minimum SKU supported for custom attributes is the Enterprise SKU. If you use Standard, you need to [upgrade](change-sku.md) the managed domain to Enterprise or Premium. For more information, see [Microsoft Entra Domain Pricing](https://azure.microsoft.com/pricing/details/active-directory-ds/). 

## How Custom Attributes work 

After you create a managed domain, click **Custom Attributes (Preview)** under **Settings** to enable attribute synchronization. Click **Save** to confirm the change. 

:::image type="content" border="true" source="./media/concepts-custom-attributes/enable.png" alt-text="Screenshot of how to enable custom attributes.":::

## Enable predefined attribute synchronization 

Click **OnPremisesExtensionAttributes** to synchronize the attributes extensionAttribute1-15, also known as [Exchange custom attributes](/graph/api/resources/onpremisesextensionattributes).

<a name='synchronize-azure-ad-directory-extension-attributes-'></a>

## Synchronize Microsoft Entra directory extension attributes 

These are the extended user or group attributes defined in your Microsoft Entra tenant. 

Select **+ Add** to choose which custom attributes to synchronize. The list shows the available extension properties in your tenant. You can filter the list by using the search bar. 

:::image type="content" border="true" source="./media/concepts-custom-attributes/add.png" alt-text="Screenshot of how to add directory extension attributes.":::


If you don't see the directory extension you are looking for, enter the extension’s associated application appId and click **Search** to load only that application’s defined extension properties. This search helps when multiple applications define many extensions in your tenant.  

>[!NOTE]
>If you would like to see directory extensions synchronized by Microsoft Entra Connect, click **Enterprise App** and look for the Application ID of the **Tenant Schema Extension App**. For more information, see [Microsoft Entra Connect Sync: Directory extensions](/azure/active-directory/hybrid/connect/how-to-connect-sync-feature-directory-extensions#configuration-changes-in-azure-ad-made-by-the-wizard).

Click **Select**, and then **Save** to confirm the change. 

:::image type="content" border="true" source="./media/concepts-custom-attributes/select.png" alt-text="Screenshot of how to save directory extension attributes.":::

Domain Services back fills all synchronized users and groups with the onboarded custom attribute values. The custom attribute values gradually populate for objects that contain the directory extension in Microsoft Entra ID. During the backfill synchronization process, incremental changes in Microsoft Entra ID are paused, and the sync time depends on the size of the tenant. 

To check the backfilling status, click **Domain Services Health** and verify the **Synchronization with Microsoft Entra ID** monitor has an updated timestamp within an hour since onboarding. Once updated, the backfill is complete. 

## Next steps 

To configure onPremisesExtensionAttributes or directory extensions for cloud-only users in Microsoft Entra ID, see [Custom data options in Microsoft Graph](/graph/extensibility-overview?tabs=http#custom-data-options-in-microsoft-graph).

To sync onPremisesExtensionAttributes or directory extensions from on-premises to Microsoft Entra ID, [configure Microsoft Entra Connect](/azure/active-directory/hybrid/connect/how-to-connect-sync-feature-directory-extensions).
