---
title: Azure Data Catalog prerequisites
description: Learn about the prerequisites you need to get started with Azure Data Catalog.
services: data-catalog
author: markingmyname
ms.author: maghan
ms.assetid: ef497a54-dc4d-4820-b5bf-c361b64b964d
ms.service: data-catalog
ms.topic: conceptual
ms.date: 01/18/2018
---
# Azure Data Catalog prerequisites

You need to take care of a few things before you can set up Azure Data Catalog. Don’t worry, this process does not take long.

## Azure subscription
To set up Data Catalog, you must be the owner or co-owner of an Azure subscription.

Azure subscriptions help you organize access to cloud-service resources such as Data Catalog. Subscriptions also help you control how resource usage is reported, billed, and paid for. Each subscription can have a separate billing and payment setup, so you can have subscriptions and plans that vary by department, project, regional office, and so on. Every cloud service belongs to a subscription, and you need to have a subscription before you set up Data Catalog. To learn more, see [Manage accounts, subscriptions, and administrative roles](../active-directory/users-groups-roles/directory-assign-admin-roles.md).

## Azure Active Directory
To set up Data Catalog, you must be signed in with an Azure Active Directory (Azure AD) user account.

Azure AD provides an easy way for your business to manage identity and access, both in the cloud and on-premises. Users can use a single work or school account for single sign-in to any cloud and on-premises web application. Data Catalog uses Azure AD to authenticate sign-in. To learn more, see [What is Azure Active Directory?](../active-directory/fundamentals/active-directory-whatis.md).

> [!NOTE]
> By using the [Azure portal](http://portal.azure.com/), you can sign in with either a personal Microsoft account or an Azure Active Directory work or school account. To set up Data Catalog by using either the Azure portal or the [Data Catalog portal](http://www.azuredatacatalog.com), you must sign in with an Azure Active Directory account, not a personal account.
>
>

## Active Directory policy configuration
You might encounter a situation where you can sign in to the Data Catalog portal, but when you attempt to sign in to the data source registration tool, you encounter an error message that prevents you from signing in. This problem behavior might occur only when you're on the company network, or it might occur only when you're connecting from outside the company network.

The data source registration tool uses Forms Authentication to validate your user credentials against Active Directory. To help you sign in successfully, an Active Directory administrator must enable Forms Authentication in the Global Authentication Policy.

In the Global Authentication Policy, authentication methods can be enabled separately for intranet and extranet connections, as shown in the following screenshot. Sign-in errors might occur if Forms Authentication is not enabled for the network from which you're connecting.

 ![Active Directory Global Authentication Policy](./media/data-catalog-prerequisites/global-auth-policy.png)

## Next steps
For more information, see [Configuring Authentication Policies](https://technet.microsoft.com/library/dn486781.aspx).
