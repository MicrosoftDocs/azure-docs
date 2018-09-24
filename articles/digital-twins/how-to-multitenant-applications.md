---
title: How to Enable Multitenant Applications with Azure Digital Twins
description: Understanding how to register your customers' AAD tenants with Azure Digital Twins
author: mavoge
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: mavoge
---

# How to Enable Multitenant Applications with Azure Digital Twins

As a developer using the Azure Digital Twins service, you'll likely want to build one application that you'll then provide to your customers.  This document details how you can set up your application to authenticate with numerous customers across various Azure Active Directory (AAD) tenants.

## Scenario Summary

In this scenario, consider Developer D and Customer C:
- Developer D has an Azure Subscription with an AAD tenant.
- Developer D has deployed a Digital Twins instance into their Azure subscription.
- Users within Developer D's AAD tenant can get tokens against the Digital Twins service since AAD has created a service principal in Developer D's AAD tenant.
- Developer D now creates a mobile app that directly integrates with Digital Twins' Management API.
- Developer D then allows Customer C the use of the mobile application.
- Now, Customer C will need to be authorized to use the Digital Twins' Management API within Developer D's application.
  - Note: otherwise, when Customer C logs into Developer D's application, the app won't be able to acquire tokens for Customer C's users to talk to the Digital Twins' Management API.  AAD will then throw an error indicating that Digital Twins isn't recognized within Customer C's directory.

## Solution

To solve the scenario above, the following actions are needed to create a Digital Twins service principal within Customer C's AAD tenant:
- If Customer C doesn't already have an Azure subscription with AAD tenant:
  - Customer C's AAD Tenant Admin will need to acquire a [pay-as-you-go Azure subscription](https://azure.microsoft.com/en-us/offers/ms-azr-0003p/).
  - Customer C's AAD Tenant Admin will then have to [link their AAD tenant with the new subscription](https://docs.microsoft.com/en-us/azure/active-directory/connect/active-directory-aadconnect). 
- From the [Azure Portal](https://portal.azure.com), Customer C's AAD Tenant Admin should then:
  - Open Subscriptions
  - Select the Subscription that has the AAD tenant to be used in Developer D's application
  - Select Resource Providers
  - Search for Microsoft.IoTSpaces
  - Click Register
- Once Customer C's AAD Tenant has been added to Developer D's application, Developer D should then use [Digital Twins' RBAC APIs](security-create-manage-role-assignments.md) to further secure the application with role assignments.
