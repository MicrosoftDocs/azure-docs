---
title: 'Azure AD Connect sync: Directory extensions | Microsoft Docs'
description: This topic describes the directory extensions feature in Azure AD Connect.
services: active-directory
documentationcenter: ''
author: billmath
manager: mtillman
editor: ''

ms.assetid: 995ee876-4415-4bb0-a258-cca3cbb02193
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 10/05/2018
ms.component: hybrid
ms.author: billmath

---
# Azure AD Connect sync: Directory extensions
You can use directory extensions to extend the schema in Azure Active Directory (Azure AD) with your own attributes from on-premises Active Directory. This feature enables you to build LOB apps by consuming attributes that you continue to manage on-premises. These attributes can be consumed through [Azure AD Graph API directory extensions](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-directory-schema-extensions) or [Microsoft Graph](https://graph.microsoft.io/). You can see the available attributes by using [Azure AD Graph Explorer](https://graphexplorer.azurewebsites.net/) and [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer), respectively.

At present, no Office 365 workload consumes these attributes.

You configure which additional attributes you want to synchronize in the custom settings path in the installation wizard.

>[!NOTE]
>The Available Attributes box is case-sensitive.

![Schema extension wizard](./media/how-to-connect-sync-feature-directory-extensions/extension2.png)  

The installation shows the following attributes, which are valid candidates:

* User and Group object types
* Single-valued attributes: String, Boolean, Integer, Binary
* Multi-valued attributes: String, Binary


>[!NOTE]
> Azure AD Connect supports synchronizing multi-valued Active Directory attributes to Azure AD as multi-valued directory extensions. But no features in Azure AD currently support the use of multi-valued directory extensions.

The list of attributes is read from the schema cache that's created during installation of Azure AD Connect. If you have extended the Active Directory schema with additional attributes, you must [refresh the schema](how-to-connect-installation-wizard.md#refresh-directory-schema) before these new attributes are visible.

An object in Azure AD can have up to 100 attributes for directory extensions. The maximum length is 250 characters. If an attribute value is longer, the sync engine truncates it.

During installation of Azure AD Connect, an application is registered where these attributes are available. You can see this application in the Azure portal.

![Schema extension app](./media/how-to-connect-sync-feature-directory-extensions/extension3new.png)

The attributes are prefixed with the extension \_{AppClientId}\_. AppClientId has the same value for all attributes in your Azure AD tenant.

These attributes are now available through the Azure AD Graph API. You can query them by using [Azure AD Graph Explorer](https://graphexplorer.azurewebsites.net/).

![Azure AD Graph Explorer](./media/how-to-connect-sync-feature-directory-extensions/extension4.png)

Or you can query the attributes through the Microsoft Graph API, by using [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer#).

>[!NOTE]
> You need to ask for the attributes to be returned. Explicitly select the attributes like this: https://graph.microsoft.com/beta/users/abbie.spencer@fabrikamonline.com?$select=extension_9d98ed114c4840d298fad781915f27e4_employeeID,extension_9d98ed114c4840d298fad781915f27e4_division. 
>
> For more information, see [Microsoft Graph: Use query parameters](https://developer.microsoft.com/graph/docs/concepts/query_parameters#select-parameter).

## Next steps
Learn more about the [Azure AD Connect sync](how-to-connect-sync-whatis.md) configuration.

Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
