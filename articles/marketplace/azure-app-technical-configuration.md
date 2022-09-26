---
title: Add technical details for an Azure application offer
description: Add technical details for an Azure application offer in Partner Center (Azure Marketplace).
author: macerru
ms.author: macerr
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 04/29/2022
---

# Add technical details for an Azure application offer

This article describes how to enter technical details that help the Microsoft commercial marketplace connect to your solution. This connection enables us to provision your offer for the customer if they choose to acquire and manage it.

Complete this section only if your offer includes a managed application that will emit metering events using the [Marketplace metered billing APIs](marketplace-metering-service-apis.md) and have a service which will be authenticating with an Azure AD security token. For more information, see [Marketplace metering service authentication strategies](marketplace-metering-service-authentication.md) on the different authentication options.

## Technical configuration (offer-level)

The **Technical configuration** tab applies to you only if you will create a managed application that emits metering events using the [Marketplace metered billing APIs](marketplace-metering-service-apis.md). If so, then complete the following steps. Otherwise, go to [Next steps](#next-steps). 

For more information about these fields, see [Plan an Azure Application offer for the commercial marketplace](plan-azure-application-offer.md#technical-configuration).

1. On the **Technical configuration** tab, provide the **Azure Active Directory tenant ID** and **Azure Active Directory application ID** used to validate the connection between our two services is behind an authenticated communication.

1. Select **Save draft** before continuing to the next tab: Plan overview.

## Next steps

- [Create plans for this offer](azure-app-plans.md)
