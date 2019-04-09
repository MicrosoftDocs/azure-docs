---
title: Create a tenant for your Azure OpenShift cluster | Microsoft Docs
description: Shows you how to create a tenant and Azure application object so that you can use OpenShift on Azure
documentationcenter: .net
author: tylermsft
ms.author: twhitney
ms.service: container-service
manager: jeconnoc
editor: ''
ms.topic: conceptual
ms.date: 05/06/2019
---

# How to create a tenant for your Azure Red Hat OpenShift cluster

Before you can create a Microsoft Azure Red Hat OpenShift cluster, you need a tenant in which to create the cluster. Follow these instructions to create an Azure tenant if you don't already have one.

A tenant is a dedicated instance of Azure Active Directory (AD) that an organization or app developer receives when they create a relationship with Microsoft by signing up for Azure, Microsoft Intune, or Microsoft 365. Each Azure AD tenant is distinct and separate from other Azure AD tenants and has its own work and school identities and app registrations.

## Create a new tenant

To create a tenant:

1. Sign in to the [Azure portal](https://portal.azure.com/) using the account you want to use to create your Azure Red Hat OpenShift cluster.
2. Click this [link](https://portal.azure.com/#create/Microsoft.AzureActiveDirectory) to go to the Azure Active Directory blade to create a tenant, or as it is otherwise referred to, an Azure Active Directory.
3. Provide an **Organization name**.
4. Provide an **Initial domain name**. What you put here will have *onmicrosoft.com* appended to it. You can use what you put for **Organization name** here.
5. At the bottom of the page click **Create**.
6. After your tenant (Azure Active Directory) is created, click on **Click here to manage your new directory**. Your tenant will be displayed in the upper right of the Azure portal:
![Screenshot of the portal showing the tenant name in the upper-right][tenantcallout]
7. We need to get the tenant ID to specify where to create the cluster later. On the portal, you should now see the Azure Active Directory blade for your new tenant. In the **Manage** section of the **Azure Active Directory** blade, click **Properties**. Copy the value for **Directory ID**. We will refer to this value as the `TENANT` later in the docs.

Refer to [Set up a dev environment](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant) for more detailed instructions about setting up an Azure tenant.

## Resources

[Create a tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant) 

[tenantcallout]: ./media/howto-create-tenant/tenant-callout.png

## Next steps

[Create a new app registration and Azure Active Directory user for your cluster](howto-aad-app-configuration.md)