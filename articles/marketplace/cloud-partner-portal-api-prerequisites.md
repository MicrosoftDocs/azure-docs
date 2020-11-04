---
title: API Prerequisites - Azure Marketplace
description: Prerequisites for using the Cloud Partner Portal APIs.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
author: mingshen-ms
ms.author: mingshen
ms.date: 09/23/2020
---

# API Prerequisites

> [!NOTE]
> The Cloud Partner Portal APIs are integrated with and will continue working in Partner Center. The transition introduces small changes. Review the changes listed in [Cloud Partner Portal API Reference](cloud-partner-portal-api-overview.md) to ensure your code continues working after transitioning to Partner Center. Only use CPP APIs for existing products that were already integrated before transition to Partner Center; new products should use Partner Center submission APIs.

You need two required programmatic assets to use Cloud Partner Portal APIs: a service principal and an Azure Active Directory (Azure AD) access token.

## Create service principal in Azure Active Directory tenant

First, you need to create a service principal in your Azure AD tenant. This tenant will be assigned its own set of permissions in the Cloud Partner Portal. Your code will call APIs using this tenant instead of your personal credentials. For a full explanation of creating a service principal, see [How to: Use the portal to create an Azure AD application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md).

## Add service principal to your account

Now that you've created the service principal in your tenant, you can add it as a user to your Partner Center Portal account. Just like a user, the service principal can be an owner or a contributor to the portal. For details, see **Next steps** below.

## Next steps

See [Manage Azure AD applications](partner-center-portal/manage-account.md#manage-azure-ad-applications).
