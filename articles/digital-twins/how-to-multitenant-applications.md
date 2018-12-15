---
title: Enable multitenant applications with Azure Digital Twins | Microsoft Docs
description: Understanding how to register your customers' Azure Active Directory tenants with Azure Digital Twins
author: mavoge
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/08/2018
ms.author: mavoge
---

# Enable multitenant applications with Azure Digital Twins

Developers who use Azure Digital Twins typically want to build multitenant applications. A *multitenant application* is a single provisioned instance that supports multiple customers. Each customer has their own independent data and privileges.

This document details how to create an Azure Digital Twins multitenant app that supports several Azure Active Directory (Azure AD) tenants and customers.

## Scenario summary

In this scenario, consider Developer D and Customer C:

- Developer D has an Azure subscription with an Azure AD tenant.
- Developer D deploys an Azure Digital Twins instance into their Azure subscription.
- Users within Developer D's Azure AD tenant can get tokens against the Azure Digital Twins service because Azure AD created a service principal in Developer D's Azure AD tenant.
- Developer D now creates a mobile app that directly integrates with the Azure Digital Twins Management API.
- Developer D allows Customer C the use of the mobile application.
- Customer C must be authorized to use the Azure Digital Twins Management API within Developer D's application.

  > [!IMPORTANT]
  > - When Customer C logs into Developer D's application, the app can't acquire tokens for Customer C's users to talk to the Management API.
  > - Azure AD throws an error, which indicates that Azure Digital Twins isn't recognized within Customer C's directory.

## Solution

To solve the previous scenario, the following actions are needed to create an Azure Digital Twins service principal within Customer C's Azure AD tenant:

- If Customer C doesn't already have an Azure subscription with an Azure AD tenant:

  - Customer C's Azure AD tenant admin must acquire a [pay-as-you-go Azure subscription](https://azure.microsoft.com/offers/ms-azr-0003p/).
  - Customer C's Azure AD tenant admin then must [link their tenant with the new subscription](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect).

- On the [Azure portal](https://portal.azure.com), Customer C's Azure AD tenant admin takes the following steps:

  1. Open **Subscriptions**.
  1. Select the subscription that has the Azure AD tenant to be used in Developer D's application.
  1. Select **Resource Providers**.
  1. Search for **Microsoft.IoTSpaces**.
  1. Select **Register**.
  
## Next steps

To learn more about how to use user-defined functions with Azure Digital Twins, read [Azure Digital Twins UDFs](how-to-user-defined-functions.md).

To learn how to use role-based access control to further secure the application with role assignments, read [Azure Digital Twins role-based access control](security-create-manage-role-assignments.md).
