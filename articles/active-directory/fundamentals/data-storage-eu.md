---
title: Customer data storage and processing for European customers in Microsoft Entra ID
description: Learn about where Microsoft Entra ID stores identity-related data for its European customers.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.author: davidmu

ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 08/17/2023
ms.custom: 'it-pro, seodec18, references-regions'
ms.collection: M365-identity-device-management
---

# Customer data storage and processing for European customers in Microsoft Entra ID

Microsoft Entra ID stores customer data in a geographic location based on how a tenant was created and provisioned. The following list provides information about how the location is defined:

* **Microsoft Entra admin center or Microsoft Entra API** - A customer selects a location from the pre-defined list.
* **Dynamics 365 and Power Platform** - A customer provisions their tenant in a pre-defined location.
* **EU Data Residency** - For customers who provided a location in Europe, Microsoft Entra ID stores most of the customer data in Europe, except where noted later in this article.
* **EU Data Boundary** - For customers who provided a location that is within the [EU Data Boundary](/privacy/eudb/eu-data-boundary-learn#eu-data-boundary-countries-and-datacenter-locations) (members of the EU and EFTA), Microsoft Entra ID stores and processes most of the customer data in the EU Data Boundary, except where noted later in this article.
* **Microsoft 365** - The location is based on a customer provided billing address.

The following sections provide information about customer data that doesn't meet the EU Data Residency or EU Data Boundary commitments.

## Services that will temporarily transfer a subset of customer data out of the EU Data Residency and EU Data Boundary 

For some components of a service, work is in progress to be included in the EU Data Residency and EU Data Boundary, but completion of this work is delayed. The following sections in this article explain the customer data that these services currently transfer out of Europe as part of their service operations.

**EU Data Residency:**

- **Reason for customer data egress** - A few of the tenants are stored outside of the EU location due one of the following reasons: 

   - The tenants were initially created with a country code that is NOT in Europe and later the tenant country code was changed to the one in Europe. The Microsoft Entra directory data location is decided during the tenant creation time and not changed when the country code for the tenant is updated. Starting March 2019 Microsoft has blocked updating the country code on a tenant to avoid such confusion. 
   - There are 13 country codes (Countries include: Azerbaijan, Bahrain, Israel, Jordan, Kazakhstan, Kuwait, Lebanon, Oman, Pakistan, Qatar, Saudi Arabia, Turkey, UAE) that were mapped to Asia region until 2013 and later mapped to Europe. Tenants that were created before July 2013 from this country code are provisioned in Asia instead of Europe. 
   - There are seven country codes (Countries include: Armenia, Georgia, Iraq, Kyrgyzstan, Tajikistan, Turkmenistan, Uzbekistan) that were mapped to Asia region until 2017 and later mapped to Europe. Tenants that were created before February 2017 from this country code are provisioned in Asia instead of Europe. 
* **Types of customer data being egressed** - User and device account data, and service configuration (application, policy, and group).  
* **Customer data location at rest** - US and Asia/Pacific.
* **Customer data processing** - The same as the location at rest.
* **Services** - Directory Core Store

**EU Data Boundary:**

See more information on Microsoft Entra temporary partial customer data transfers from the EU Data Boundary [Services that temporarily transfer a subset of customer data out of the EU Data Boundary](/privacy/eudb/eu-data-boundary-temporary-partial-transfers#security-services). 

## Services that will permanently transfer a subset of customer data out of the EU Data Residency and EU Data Boundary 

Some components of a service will continue to transfer a limited amount of customer data out of the EU Data Residency and EU Data Boundary because this transfer is by design to facilitate the function of the services.  

**EU Data Residency:** 

[Microsoft Entra ID](./whatis.md): When an IP Address or phone number is determined to be used in fraudulent activities, they are published globally to block access from any workloads using them. 

**EU Data Boundary:**

See more information on Microsoft Entra permanent partial customer data transfers from the EU Data Boundary [Services that will permanently transfer a subset of customer data out of the EU Data Boundary](/privacy/eudb/eu-data-boundary-permanent-partial-transfers#security-services).

## Other considerations

### Optional service capabilities that transfer data out of the EU Data Residency and EU Data Boundary

**EU Data Residency:**

Some services include capabilities that are optional (in some cases requiring a customer subscription), and where customer administrators can choose to enable or disable these capabilities for their service tenancies. If made available and used by a customer's users, these capabilities will result in data transfers out of Europe as described in the following sections in this article. 

- [Mulitenant administration](../multi-tenant-organizations/overview.md): An organization may choose to create a multitenant organization within Microsoft Entra ID. For example, a customer can invite users to their tenant in a B2B context. A customer can create a multitenant SaaS application that allows other third-party tenants to provision the application in the third-party tenant. A customer can make two or more tenants affiliated with one another and act as a single tenant in certain scenarios, such as multitenant organization (MTO) formation, tenant to tenant sync, and shared e-mail domain sharing. Administrator configuration and use of multitenant collaboration may occur with tenants outside of the EU Data Residency and EU Data Boundary resulting in some customer data, such as user and device account data, usage data, and service configuration (application, policy, and group) being stored and processed in the location of the collaborating tenant. 
- [Application Proxy](../app-proxy/application-proxy.md): Application proxy allows customers to access both cloud and on-premises applications through an external URL or an internal application portal. Customers may choose advanced routing configurations that would cause Customer Data to egress outside of the EU Data Residency and EU Data Boundary, including user account data, usage data, and application configuration data. 

**EU Data  Boundary:**

See more information on optional service capabilities that transfer customer data out of the EU Data Boundary [Optional service capabilities that transfer customer data out of the EU Data Boundary](/privacy/eudb/eu-data-boundary-transfers-for-optional-capabilities#microsoft-entra-id).

### Other EU Data Boundary online services

Services and applications that integrate with Microsoft Entra ID have access to customer data. Review how each service and application stores and processes customer data, and verify that they meet your company's data handling requirements.

## Next steps

For more information about Microsoft services' data residency, see the **Where your data is located** section of the [Microsoft Trust Center](https://www.microsoft.com/en-us/trust-center/privacy/data-location?rtc=1).
