---
title: How to enable multitenant applications with Azure Digital Twins | Microsoft Docs
description: Understanding how to register your customers' Azure Active Directory tenants with Azure Digital Twins
author: mavoge
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 10/08/2018
ms.author: mavoge
---

# How to enable multitenant applications with Azure Digital Twins

Developers using the Azure Digital Twins platform will likely want to build multitenant applications. A *multitenant application* is a single provisioned instance used to support multiple customers each with their own independent data and privileges.

This document details how to create an Azure Digital Twins multitenant app supporting several Azure Active Directory (AD) tenants and customers.

## Scenario summary

In this scenario, consider Developer D and Customer C:

- Developer D has an Azure Subscription with an Azure AD tenant.
- Developer D has deployed a Digital Twins instance into their Azure subscription.
- Users within Developer D's Azure AD tenant can get tokens against the Digital Twins service since Azure AD has created a service principal in Developer D's Azure AD tenant.
- Developer D now creates a mobile app that directly integrates with Digital Twins' Management API.
- Developer D then allows Customer C the use of the mobile application.
- Now, Customer C will need to be authorized to use the Digital Twins' Management API within Developer D's application.

  > [!IMPORTANT]
  > - When Customer C logs into Developer D's application, the app won't be able to acquire tokens for Customer C's users to talk to the Management API.
  > - Azure AD will then throw an error indicating that Digital Twins isn't recognized within Customer C's directory.

## Solution

To solve the scenario above, the following actions are needed to create a Digital Twins service principal within Customer C's Azure AD tenant:

- If Customer C doesn't already have an Azure subscription with Azure AD tenant:

  - Customer C's Azure AD Tenant Admin will need to acquire a [pay-as-you-go Azure subscription](https://azure.microsoft.com/offers/ms-azr-0003p/).
  - Customer C's Azure AD Tenant Admin will then have to [link their tenant with the new subscription](https://docs.microsoft.com/azure/active-directory/connect/active-directory-aadconnect).

- From the [Azure Portal](https://portal.azure.com), Customer C's Azure AD Tenant Admin should then:
  1. Open **Subscriptions**.
  1. Select the Subscription that has the Azure AD tenant to be used in Developer D's application.
  1. Select **Resource Providers**.
  1. Search for **Microsoft.IoTSpaces**.
  1. Click **Register**.
  
## Next steps

To learn more about using user-defined functions with Azure Digital Twins, read [Azure Digital Twins UDFs](how-to-user-defined-functions.md).

To learn how to use role-based access control to further secure the application with role assignments, read [Digital Twins role-based access control](security-create-manage-role-assignments.md).
