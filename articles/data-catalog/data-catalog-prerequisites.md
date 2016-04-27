<properties
   pageTitle="Azure Data Catalog prerequisites | Microsoft Azure"
   description="Azure Data Catalog prerequisites - what you need to get started with Azure Data Catalog."
   services="data-catalog"
   documentationCenter=""
   authors="steelanddata"
   manager="NA"
   editor=""
   tags=""/>
<tags
   ms.service="data-catalog"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-catalog"
   ms.date="04/25/2016"
   ms.author="maroche"/>

# Azure Data Catalog prerequisites

## What do I need to get started with Azure Data Catalog?

There are a few things you’ll need to take care of before you can set up **Azure Data Catalog**. Don’t worry – they won’t take long!


## Azure Subscription
To set up Azure Data Catalog, you must be the owner or co-owner of an Azure subscription.

Azure subscriptions help you organize access to cloud service resources like Azure Data Catalog. They also help you control how resource usage is reported, billed, and paid for. Each subscription can have a different billing and payment setup, so you can have different subscriptions and different plans by department, project, regional office, and so on. Every cloud service belongs to a subscription, and you need to have a subscription before setting up Azure Data Catalog. To learn more, see [Manage Accounts, Subscriptions, and Administrative Roles](../active-directory/active-directory-assign-admin-roles.md).

## Azure Active Directory
To set up Azure Data Catalog, you must be logged in using an Azure Active Directory user account.

Azure Active Directory (Azure AD) provides an easy way for your business to manage identity and access, both in the cloud and on-premises. Users can use a single work or school account for single sign-on to any cloud and on-premises web application. Azure Data Catalog uses Azure AD to authenticate sign-on. To learn more, see [What is Azure Active Directory](../active-directory/active-directory-whatis.md).

## Active Directory policy configuration

In some situations, users may encounter a situation where they can log on to the Azure Data Catalog portal, but when they attempt to log on to the data source registration tool they encounter an error message that prevents them from logging on. This problem behavior may occur only when the user is on the company network, or may occur only when the user is connecting from outside the company network.

The data source registration tool uses Forms Authentication to validate user logons against Active Directory. For successful logon, Forms Authentication must be enabled in the Global Authentication Policy by an Active Directory administrator.

The Global Authentication Policy allows authentication methods to be enabled separately for intranet and extranet connections, as illustrated below. Logon errors may occur if Forms Authentication is not enabled for the network from which the user is connecting.

 ![Active Directory Global Authentication Policy](./media/data-catalog-prerequisites/global-auth-policy.png)

For more information, see [Configuring Authentication Policies](https://technet.microsoft.com/library/dn486781.aspx).
