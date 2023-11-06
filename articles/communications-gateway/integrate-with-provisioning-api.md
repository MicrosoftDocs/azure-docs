---
title: Get ready to use Azure Communications Gateway's Provisioning API (preview)
description: Learn how to integrate with the Provisioning API (preview) for Azure Communications Gateway. The Provisioning API allows you to configure customers and associated numbers.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 10/09/2023
---

# Integrate with Azure Communications Gateway's Provisioning API (preview)

This article explains when you need to integrate with Azure Communications Gateway's Provisioning API (preview) and provides a high-level overview of getting started. It's aimed at software developers working for telecommunications providers.

The Provisioning API allows you to configure Azure Communications Gateway with the details of your customers and the numbers that you have assigned to them. It's a REST API.

Whether you need to integrate with the REST API depends on your chosen communications service.

|Communications service  |Provisioning API integration  |Purpose  |
|---------|---------|---------|
|Microsoft Teams Direct Routing |Required |- Configure the subdomain associated with each Direct Routing customer<br>- Generate DNS records specific to each customer (as required by the Microsoft 365 environment)<br>- Indicate that numbers are enabled for Direct Routing.<br>- (Optional) Configure a custom header for messages to your network|
|Operator Connect|Optional|(Optional) Configure a custom header for messages to your network|
|Teams Phone Mobile|Not supported|N/A|
|Zoom Phone Cloud Peering |Required |- Indicate that numbers are enabled for Zoom<br>- (Optional) Configure a custom header for messages to your network|

## Prerequisites

You must have completed [Deploy Azure Communications Gateway](deploy.md).

You must have access to a machine with an IP address that is permitted to access the Provisioning API (preview). This allowlist of IP addresses (or ranges) was configured as part of [deploying Azure Communications Gateway](deploy.md#collect-configuration-values-for-each-communications-service).

## Learn about the API and plan your BSS client changes

To integrate with the Provisioning API (preview), you need to create (or update) a BSS client that can contact it. The Provisioning API supports a machine-to-machine [OAuth 2.0](/azure/active-directory/develop/v2-protocols) client credentials authentication flow. Your client authenticates and makes authorized API calls as itself, without the interaction of users.

## Configure your BSS client to connect to Azure Communications Gateway

The Provisioning API (preview) is available on port 443 of your Azure Communications Gateway's base domain.

> [!TIP]
> To find the base domain:
> 1. Sign in to the Azure portal.
> 1. Navigate to the **Overview** of your Azure Communications Gateway resource and select **Properties**.
> 1. Find the field named **Domain**.

The following steps summarize the Azure configuration you need.

1. Register your BSS client in the same Azure tenant as your Azure Communications Gateway deployment. This process creates an app registration.
1. Assign yourself as an owner for the app registration.
1. Configure the app registration with the scopes for the API. This configuration indicates to Azure that your application is permitted to access the Provisioning API.
1. As an administrator for the tenant, allow the application to use the app roles that you assigned.

> [!NOTE]
> For more information about the resources in the Provisioning API and the Azure configuration required, [make a support request](request-changes.md).

## Next steps

- [Connect to Operator Connect or Teams Phone Mobile](connect-operator-connect.md)
- [Connect to Microsoft Teams Direct Routing](connect-teams-direct-routing.md)
- [Connect to Zoom Phone Cloud Peering](connect-zoom.md)
