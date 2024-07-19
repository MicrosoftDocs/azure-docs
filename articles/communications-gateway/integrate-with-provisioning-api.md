---
title: Get ready to use Azure Communications Gateway's Provisioning API
description: Learn how to integrate with the Provisioning API for Azure Communications Gateway. The Provisioning API allows you to configure customers and associated numbers.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 03/29/2024
---

# Integrate with Azure Communications Gateway's Provisioning API (preview)

This article explains when you need to integrate with Azure Communications Gateway's Provisioning API (preview) and provides a high-level overview of getting started. It's for software developers working for telecommunications operators.

The Provisioning API allows you to configure Azure Communications Gateway with the details of your customers and the numbers that you have assigned to them. If you use the Provisioning API for *backend service sync*, you can also provision the Operator Connect and Teams Phone Mobile environments with the details of your enterprise customers and the numbers that you allocate to them. This flow-through provisioning allows you to meet the Operator Connect and Teams Phone Mobile requirement to use APIs to manage your customers and numbers after you launch your service.

 The Provisioning API is a REST API.

Whether you integrate with the Provisioning API depends on your chosen communications service.

|Communications service  |Provisioning API integration  |Purpose  |
|---------|---------|---------|
|Microsoft Teams Direct Routing |Supported (as alternative to the Number Management Portal) |- Configuring the subdomain associated with each Direct Routing customer.<br>- Generating DNS records specific to each customer (as required by the Microsoft 365 environment).<br>- Indicating that numbers are enabled for Direct Routing.<br>- (Optional) Configuring a custom header for messages to your network.|
|Operator Connect|Recommended|- (Recommended) Flow-through provisioning of Operator Connect customers through interoperation with Operator Connect APIs  (using backend service sync). <br>- (Optional) Configuring a custom header for messages to your network. |
|Teams Phone Mobile|Recommended|- (Recommended) Flow-through provisioning of Teams Phone Mobile customers through interoperation with Operator Connect APIs (using backend service sync). |
|Zoom Phone Cloud Peering |Supported (as alternative to the Number Management Portal) |- Indicating that numbers are enabled for Zoom. <br>- (Optional) Configuring a custom header for messages to your network.|
| Azure Operator Call Protection Preview |Supported (as alternative to the Number Management Portal) |-  Indicating that numbers are enabled for Azure Operator Call Protection.<br> - Automatic provisioning of Azure Operator Call Protection. |

> [!TIP]
> Azure Communications Gateway's Number Management Portal provides equivalent function for manual provisioning. However, you can't use the Number Management Portal for flow-thorough provisioning of Operator Connect and Teams Phone Mobile after you launch your service.

## Prerequisites

You must have completed [Deploy Azure Communications Gateway](deploy.md).

You must have access to a machine with an IP address that is permitted to access the Provisioning API (preview). This allowlist of IP addresses (or ranges) was configured as part of [deploying Azure Communications Gateway](deploy.md#create-an-azure-communications-gateway-resource).

## Learn about the Provisioning API (preview) and plan your BSS client changes

To integrate with the API, you need to create (or update) a BSS client that can contact the Provisioning API. The Provisioning API supports a machine-to-machine [OAuth 2.0](/azure/active-directory/develop/v2-protocols) client credentials authentication flow. Your client authenticates and makes authorized API calls as itself, without the interaction of users.

Use the *Key concepts* and *Examples* information in the [API Reference](/rest/api/voiceservices) to learn about the resources available over the API and the requests that your organization needs to make.

- *Account* resources are descriptions of operator customers (typically, an enterprise), and per-customer settings for service provisioning.
- *Number* resources belong to an account. They describe numbers, the services that the numbers make use of (for example, Microsoft Teams Direct Routing), and any extra per-number configuration.
- *Request for Information (RFI)* resources are descriptions of operator customers (typically an enterprise) who have expressed interest in receiving service from the operator through Operator Connect and Teams Phone Mobile.

[!INCLUDE [limits on the Provisioning API](includes/communications-gateway-provisioning-api-restrictions.md)]

## Configure your BSS client to connect to Azure Communications Gateway

The Provisioning API (preview) is available on port 443 of `provapi.<base-domain>`, where `<base-domain>` is the base domain of the Azure Communications Gateway resource.

> [!TIP]
> To find the base domain:
> 1. Sign in to the Azure portal.
> 1. Navigate to the **Overview** of your Azure Communications Gateway resource and select **Properties**.
> 1. Find the field named **Domain**.

The DNS record has a time-to-live (TTL) of 60 seconds. When a region fails, Azure updates the DNS record to refer to another region, so clients making a new DNS lookup receive the details of the new region. We recommend ensuring that clients can make a new DNS lookup and retry a request 60 seconds after a timeout or a 5xx response.

Use the *Getting started* section of the [API Reference](/rest/api/voiceservices#getting-started) to configure Azure and your BSS client to allow the BSS client to access the Provisioning API.

The following steps summarize the Azure configuration you need. See the *Getting started* section of the [API Reference](/rest/api/voiceservices) for full details, including required configuration values.

1. Register your BSS client in the same Azure tenant as your Azure Communications Gateway deployment. This process creates an app registration.
1. Assign yourself as an owner for the app registration.
1. Configure the app registration with the scopes defined in the API Reference. This configuration indicates to Azure that your application is permitted to access the Provisioning API.
1. As an administrator for the tenant, allow the application to use the app roles that you assigned.

## Next steps

- [Connect to Operator Connect or Teams Phone Mobile](connect-operator-connect.md)
- [Connect to Microsoft Teams Direct Routing](connect-teams-direct-routing.md)
- [Connect to Zoom Phone Cloud Peering](connect-zoom.md)
