---
title: How to Enable Multitenant Applications with Azure Digital Twins
description: Understanding how to register your customers' AAD tenants with Azure Digital Twins
author: mavoge
manager: bertvanhoof
ms.service: digital-twins
services: digital-twins
ms.topic: conceptual
ms.date: 09/20/2018
ms.author: mavoge
---

# How to Enable Multitenant Applications with Azure Digital Twins

As a developer using the Azure Digital Twins service, you will likely want to build one application that you will then provide to multiple customers.  This document details how you can set up your application to authenticate will multiple customers across various Azure Active Directory (AAD) tenants.

## Scenario Summary

In this scenario, consider Developer D and Customer C:
- Developer D has an Azure Subscription with an AAD tenant.
- Developer D has provisioned a Digital Twins instance into their Azure subscription.
- Users within Developer D's AAD tenant are able to get tokens against the Digital Twins service since AAD has provisioned a service principal into Developer D's AAD tenant.
- Developer D now creates a mobile app that directly integrates with Digital Twins' Management API.
- Developer D then allows Customer C the use of the mobile application.
- Now, Customer C will need to be authorized to use the Digital Twins' Management API within Developer D's application.
  - Note: otherwise, when Customer C logs into Developer D's application, the app will not be able to acquire tokens for Customer C's users to talk to the Digital Twins' Management API.  AAD will then throw an error indicating that Digital Twins is not recognized within Customer C's directory.

## Solution

In order to solve the scenario above, the following actions are needed to provision a Digital Twins service principal within Customer C's AAD tenant:
- If Customer C does not already have an Azure subscription with AAD tenant:
  - Customer C's AAD Tenant Admin will need to acquire a [pay-as-you-go Azure subscription](https://azure.microsoft.com/en-us/offers/ms-azr-0003p/).
  - Customer C's AAD Tenant Admin will then have to [link their AAD tenant with the new subscription](https://docs.microsoft.com/en-us/azure/active-directory/connect/active-directory-aadconnect). 
- From the [Azure Portal](https://portal.azure.com), Customer C's AAD Tenant Admin should then:
  - Open Subscriptions
  - Select the Subscription which has the AAD tenant to be used in Developer D's application
  - Select Resource Providers
  - Search for Microsoft.IoTSpaces
  - Click Register
