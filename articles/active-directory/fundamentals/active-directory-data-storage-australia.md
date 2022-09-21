---
title: Identity data storage for Australian and New Zealand customers - Azure AD
description: Learn about where Azure Active Directory stores identity-related data for its Australian and New Zealand customers.
services: active-directory
author: barclayn
manager: amycolannino
ms.author: barclayn

ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 08/17/2022
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Identity data storage for Australian and New Zealand customers in Azure Active Directory

Azure AD stores identity data in a location chosen based on the address provided by your organization when subscribing to a Microsoft service like Microsoft 365 or Azure. For information on where your Identity Customer Data is stored, you can use the [Where is your data located?](https://www.microsoft.com/trustcenter/privacy/where-your-data-is-located) section of the Microsoft Trust Center.

> [!NOTE]
> Services and applications that integrate with Azure AD have access to Identity Customer Data. Evaluate each service and application you use to determine how Identity Customer Data is processed by that specific service and application, and whether they meet your company's data storage requirements. For more information about Microsoft services' data residency, see the Where is your data located? section of the Microsoft Trust Center.

For customers who provided an address in Australia or New Zealand, Azure AD keeps identity data for these services within Australian datacenters: 
- Azure AD Directory Management 
- Authentication

All other Azure AD services store customer data in global datacenters. To locate the datacenter for a service, see [Azure Active Directory – Where is your data located?](https://aka.ms/AADDataMap)

## Microsoft Azure AD Multi-Factor Authentication (MFA)

MFA stores Identity Customer Data in global datacenters. To learn more about the user information collected and stored by cloud-based Azure AD MFA and Azure AD Multi-Factor Authentication Server, see [Azure Active Directory Multi-Factor Authentication user data collection](../authentication/concept-mfa-data-residency.md).

## Next steps

For more information about any of the features and functionality described above, see these articles:
- [What is Multi-Factor Authentication?](../authentication/concept-mfa-howitworks.md)
