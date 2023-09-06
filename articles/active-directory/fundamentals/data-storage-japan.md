---
title: Customer data storage for Japan customers
description: Learn about where Azure Active Directory stores customer-related data for its Japan customers.
services: active-directory
author: justinha
manager: amycolannino
ms.author: justinha

ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 08/08/2022
ms.custom: "it-pro, seodec18, references_regions"
ms.collection: M365-identity-device-management
---

# Customer data storage for Japan customers in Azure Active Directory 

Azure Active Directory (Azure AD) stores its Customer Data in a geographical location based on the country/region you provided when you signed up for a Microsoft Online service. Microsoft Online services include Microsoft 365 and Azure. 

For information about where Azure AD and other Microsoft services' data is located, see the [Where your data is located](https://www.microsoft.com/trust-center/privacy/data-location) section of the Microsoft Trust Center.

Additionally, certain Azure AD features do not yet support storage of Customer Data in Japan. Please go to the [Azure AD data map](https://aka.ms/aaddatamap), for specific feature information. For example, Microsoft Azure AD Multi-Factor Authentication stores Customer Data in the US and processes it globally. See [Data residency and customer data for Azure AD Multi-Factor Authentication](../authentication/concept-mfa-data-residency.md).

> [!NOTE]
> Microsoft products, services, and third-party applications that integrate with Azure AD have access to Customer Data. Evaluate each product, service, and application you use to determine how Customer Data is processed by that specific product, service, and application, and whether they meet your company's data storage requirements. For more information about Microsoft services' data residency, see the [Where your data is located](https://www.microsoft.com/trust-center/privacy/data-location) section of the Microsoft Trust Center.

## Azure role-based access control (Azure RBAC)

Role definitions, role assignments, and deny assignments are stored globally to ensure that you have access to your resources regardless of the region you created the resource. For more information, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md#where-is-azure-rbac-data-stored).
