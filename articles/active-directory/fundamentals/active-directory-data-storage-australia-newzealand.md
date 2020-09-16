---
title: Customer data storage for Australian and New Zealand customers - Azure AD
description: Learn about where Azure Active Directory stores customer-related data for its Australian and New Zealand customers.
services: active-directory
author: ajburnle
manager: daveba
ms.author: ajburnle

ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 7/21/2020
ms.custom: "it-pro, seodec18, references_regions"
ms.collection: M365-identity-device-management
---

# Customer Data storage for Australian and New Zealand customers in Azure Active Directory

Azure Active Directory (Azure AD) stores its Customer Data in a geographical location based on the country you provided when you signed up for a Microsoft Online service. Microsoft Online services include Microsoft 365 and Azure. 

For information about where Azure AD and other Microsoft services' data is located, see the [Where is your data located?](https://www.microsoft.com/trustcenter/privacy/where-your-data-is-located) section of the Microsoft Trust Center.

From February 26, 2020, Microsoft began storing Azure AD’s Customer Data for new tenants with an Australian or New Zealand billing address within the Australian datacenters. Between May 1, 2020 and October 31, 2020, Microsoft will migrate existing tenants who have an Australian or New Zealand billing address to the Australian datacenters without requiring any customer action. The migration process doesn’t involve any downtime for customers and won’t impact any functionality of a tenant during the migration.

Additionally, certain Azure AD features do not yet support storage of Customer Data in Australia. Please go to the [Azure AD data map](https://msit.powerbi.com/view?r=eyJrIjoiYzEyZTc5OTgtNTdlZS00ZTVkLWExN2ItOTM0OWU4NjljOGVjIiwidCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsImMiOjV9), for specific feature information. For example, Microsoft Azure Multi-Factor Authentication stores Customer Data in the US and processes it globally. See [Data residency and customer data for Azure Multi-Factor Authentication](../authentication/concept-mfa-data-residency.md).

> [!NOTE]
> Microsoft products, services, and third-party applications that integrate with Azure AD have access to Customer Data. Evaluate each product, service, and application you use to determine how Customer Data is processed by that specific product, service, and application, and whether they meet your company's data storage requirements. For more information about Microsoft services' data residency, see the [Where is your data located?](https://www.microsoft.com/trustcenter/privacy/where-your-data-is-located) section of the Microsoft Trust Center.