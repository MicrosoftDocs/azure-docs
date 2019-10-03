---
title: Cloud Partner Portal API Reference | Azure Marketplace
description: Description of, prerequisites to use, and list of marketplace API operations.
services: Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: conceptual
ms.date: 09/13/2018
ms.author: pabutler
---


Cloud Partner Portal API Reference
==================================

The Cloud Partner Portal REST APIs allow the programmatic retrieval and
manipulation of workloads, offers, and publisher profiles. The APIs use
role-based access control (RBAC) to enforce correct permissions at processing time.

This reference provides the technical details for the Cloud Partner
Portal REST APIs. The payload samples in this document are for reference
only and are subject to change as new functionality is added.


Prerequisites and considerations
-------------------------------

Before using the APIs, you should review:

- The [Prerequisites](./cloud-partner-portal-api-prerequisites.md) article to
learn how to add a service principal to your account, and get an
Azure Active Directory (Azure AD) access token for authentication. 
- The two [concurrency control](./cloud-partner-portal-api-concurrency-control.md).
strategies available for calling these APIs.
- Additional API [considerations](./cloud-partner-portal-api-considerations.md), such as 
versioning and error handling.


Common tasks
------------
This reference details APIs to perform the following common tasks.


### Offers

-   [Retrieve all offers](./cloud-partner-portal-api-retrieve-offers.md)
-   [Retrieve a specific offer](./cloud-partner-portal-api-retrieve-specific-offer.md)
-   [Retrieve offer status](./cloud-partner-portal-api-retrieve-offer-status.md)
-   [Create an offer](./cloud-partner-portal-api-creating-offer.md)
-   [Publish an offer](./cloud-partner-portal-api-publish-offer.md)

### Operations

-   [Retrieve operations](./cloud-partner-portal-api-retrieve-operations.md)
-   [Cancel operations](./cloud-partner-portal-api-cancel-operations.md)

### Publish an app

-   [Go live](./cloud-partner-portal-api-go-live.md)

### Other tasks

-   [Set pricing for virtual machine offers](./cloud-partner-portal-api-setting-price.md)

### Troubleshooting

-   [Troubleshooting authentication errors](./cloud-partner-portal-api-troubleshooting-authentication-errors.md)
