---
title: How to add technical details for your Azure Application offer
description: Learn how to add technical details for your Azure application offer in Partner Center.
author: aarathin
ms.author: aarathin
ms.reviewer: dannyevers
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 11/06/2020
---

# How to add technical details for your Azure Application offer

This article describes how to enter technical details that help the Microsoft commercial marketplace connect to your solution. This connection enables us to provision your offer for the customer if they choose to acquire and manage it.

Complete this section only if your offer includes a managed application that will emit metering events using the [Marketplace metered billing APIs](partner-center-portal/marketplace-metering-service-apis.md) and have a service which will be authenticating with an Azure AD security token. For more information, see [Marketplace metering service authentication strategies](partner-center-portal/marketplace-metering-service-authentication.md) on the different authentication options.

## Technical configuration (Offer-level)

The **Technical configuration** tab applies to you only if you will create a managed application that emits metering events using the [Marketplace metered billing APIs](partner-center-portal/marketplace-metering-service-apis.md). If so, then complete the following steps. Otherwise, go to [Next steps](#next-steps). 

For more information about these fields, see [Plan an Azure Application offer for the commercial marketplace](plan-azure-application-offer.md#technical-configuration).

1. On the **Technical configuration** tab, provide the **Azure Active Directory tenant ID** and **Azure Active Directory application ID** used to validate the connection between our two services is behind an authenticated communication.

1. Select **Save draft** before continuing to the next tab: Plan overview.

## Next steps

- [How to create plans for your Azure Application offer](create-new-azure-apps-offer-plans.md)
