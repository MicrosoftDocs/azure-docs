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

Before you can create a Microsoft Azure Red Hat OpenShift cluster, you need an Azure tenant in which to create the cluster. If you don't already have an Azure tenant, follow these instructions to create one.

A tenant is a dedicated instance of Azure Active Directory (AD) that an organization or app developer receives when they create a relationship with Microsoft by signing up for Azure, Microsoft Intune, or Microsoft 365. Each Azure AD tenant is distinct and separate from other Azure AD tenants and has its own work and school identities and app registrations.

## Create a new tenant

To create a tenant:

1. Sign in to the [Azure portal](https://portal.azure.com/) using the account you want to use to create your Azure Red Hat OpenShift cluster.
2. Go to the [Azure Active Directory blade](https://portal.azure.com/#create/Microsoft.AzureActiveDirectory) to create a tenant, or as it is also called, an Azure Active Directory.
3. Provide an **Organization name**.
4. Provide an **Initial domain name**. What you put here will have *onmicrosoft.com* appended to it. You can use what you put for **Organization name** here.
5. Choose a country or region where the tenant will be created.
6. At the bottom of the page, click **Create**.
7. After your tenant (Azure AD) is created, click **Click here to manage your new directory**. Your new tenant name should be displayed in the upper right of the Azure portal:
![Screenshot of the portal showing the tenant name in the upper-right][tenantcallout]
8. We need to get the tenant ID to specify where to create the cluster later. On the portal, you should now see the Azure Active Directory overview blade for your new tenant. In the **Manage** section to the left, click **Properties**. Copy the value for **Directory ID**. We will refer to this value as the `tenant id` in the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial so make a copy of the value for later.

Refer to [Set up a dev environment](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant) if you need more detailed instructions about setting up an Azure tenant.

## Resources

[Create a tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant) 

[tenantcallout]: ./media/howto-create-tenant/tenant-callout.png

## Next steps

[Create a new app registration and Azure Active Directory user for your cluster](howto-aad-app-configuration.md)