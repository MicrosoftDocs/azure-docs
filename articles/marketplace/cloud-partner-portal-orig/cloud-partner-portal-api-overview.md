---
title: Cloud Partner Portal API Reference | Azure Marketplace
description: Description of, prerequisites to use, and list of marketplace API operations.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/08/2020
ms.author: dsindona
---


# Cloud Partner Portal API Reference

> [!NOTE]
> The Cloud Partner Portal APIs are integrated with Partner Center and will continue to work after your offers are migrated to Partner Center. The integration introduces small changes. Review the [Changes to CPP APIs](#changes-to-cpp-apis-after-the-migration-to-partner-center) listed in this document to ensure your code continues to work after the migration to Partner Center.

The Cloud Partner Portal REST APIs allow the programmatic retrieval and
manipulation of workloads, offers, and publisher profiles. The APIs use
role-based access control (RBAC) to enforce correct permissions at processing time.

This reference provides the technical details for the Cloud Partner
Portal REST APIs. The payload samples in this document are for reference
only and are subject to change as new functionality is added.

## Prerequisites and considerations

Before using the APIs, you should review:

- The [Prerequisites](./cloud-partner-portal-api-prerequisites.md) article to
learn how to add a service principal to your account, and get an
Azure Active Directory (Azure AD) access token for authentication.
- The two [concurrency control](./cloud-partner-portal-api-concurrency-control.md) strategies available for calling these APIs.
- Additional API [considerations](./cloud-partner-portal-api-considerations.md), such as versioning and error handling.

## Changes to CPP APIs after the migration to Partner Center

| **API** | **Change description** | **Impact** |
| ------- | ---------------------- | ---------- |
| POST Publish, GoLive, Cancel | For migrated offers, the response header will have a different format but will continue to work in the same way, denoting a relative path to retrieve the operation status. | When sending any of the corresponding POST requests for an offer, the Location header will have one of two format depending on the migration status of the offer:<ul><li>Non-migrated offers<br>`/api/operations/{PublisherId}${offerId}$2$preview?api-version=2017-10-31`</li><li>Migrated offers<br>`/api/publishers/{PublisherId}/offers/{offereId}/operations/408a4835-0000-1000-0000-000000000000?api-version=2017-10-31`</li> |
| GET Operation | For offer types that previously supported 'notification-email' field in the response, this field will be deprecated and no longer returned for migrated offers. | For migrated offers, we'll no longer send notifications to the list of emails specified in the requests. Instead, the API service will align with the notification email process in Partner Center to send emails. Specifically, notifications will be sent to the email address set in the Seller contact info section of your Account settings in Partner Center, to notify you of operation progress.<br><br>Please review the email address set in the Seller contact info section of your [Account settings](https://partner.microsoft.com/dashboard/account/management) in Partner Center to ensure the correct email is provided for notifications.  |

## Common tasks

This reference details APIs to perform the following common tasks.

### Offers

- [Retrieve all offers](./cloud-partner-portal-api-retrieve-offers.md)
- [Retrieve a specific offer](./cloud-partner-portal-api-retrieve-specific-offer.md)
- [Retrieve offer status](./cloud-partner-portal-api-retrieve-offer-status.md)
- [Create an offer](./cloud-partner-portal-api-creating-offer.md)
- [Publish an offer](./cloud-partner-portal-api-publish-offer.md)

### Operations

- [Retrieve operations](./cloud-partner-portal-api-retrieve-operations.md)
- [Cancel operations](./cloud-partner-portal-api-cancel-operations.md)

### Publish an app

- [Go live](./cloud-partner-portal-api-go-live.md)

### Other tasks

- [Set pricing for virtual machine offers](./cloud-partner-portal-api-setting-price.md)

### Troubleshooting

- [Troubleshooting authentication errors](./cloud-partner-portal-api-troubleshooting-authentication-errors.md)
