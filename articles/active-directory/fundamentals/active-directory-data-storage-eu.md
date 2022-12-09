---
title: Customer data storage for European customers in Azure Active Directory
description: Learn about where Azure Active Directory stores identity-related data for its European customers.
services: active-directory
author: barclayn
manager: rkarlin
ms.author: barclayn

ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 07/20/2022
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Customer data storage for European customers in Azure Active Directory

Azure Active Directory (Azure AD) stores customer data in a geographic location based on how a tenant was created and provisioned. The following list provides information about how the location is defined:

* **Azure portal or Azure AD API** - A customer selects a location from the pre-defined list.
* **Microsoft 365** - The location is based on a customer provided billing address.
* **Dynamics 365 and Power Platform** - A customer provisions their tenant in a pre-defined location.
* **EU Customer Data Residency** - For customers who provided a location in Europe, Azure AD stores most of the customer data in Europe, except where noted later in this article.
* **EU Customer Data Boundary** - For customers who provided a location that is part of the EU Data Boundary list of countries, Azure AD stores and processes most of the customer data in Europe.

The following sections provide information about customer data that doesn't meet the EU Customer Data Residency or EU Customer Data Boundary commitments.

## Services permanently excluded from the EU Customer Data Boundary

* **Reason for customer data egress** - Some forms of communication rely on a network that is operated by global providers, such as phone calls and SMS. Device vendor-specific services such Apple Push Notifications, may be outside of Europe.
* **Types of customer data being egressed** - User account data, such as phone number.
* **Customer data location at rest** - In EU Customer Data Boundary.
* **Customer data processing** - Some processing may occur globally.
* **Services** - Multi-Factor Authentication

## Services temporarily excluded from the EU Customer Data Residency and EU Customer Data Boundary

Some services have work in progress to be EU Customer Data Residency and EU Customer Data Boundary compliant, but this work is delayed beyond January 1, 2023. The services listed will become compliant over the coming months. The following details explain the customer data that these features currently transfer out of the EU as part of their service operations:

* **Reason for customer data egress** - To provide reliable and scalable service, Microsoft performs regular analytics that involve transfers of data outside the region.
* **Types of customer data being egressed** - User and device account and usage data, service configuration, such as application, policy, and group.  
* **Customer data location at rest** - US
* **Customer data processing** - US
* **Services** - Azure Active Directory Connect, Azure Active Directory Connect Health, Device Registration, Directory Core Store, Dynamic Groups Service, Self-Service Group Management

Some services incorrectly stored data out of the region. The following details explain the customer data that these features currently transfer out of the EU as part of their service operations:

* **Reason for customer data egress** - A small number of tenants [63] created in the EU region prior to March 2019 were incorrectly stored out of the region due to an issue that is now fixed. Microsoft is in the process of migrating tenants to the correct region.  
* **Types of customer data being egressed** - User and device account data, service configuration (such as application, policy, group).
* **Customer data location at rest** -  13 in AS (Asia/Pacific {Seoul, Singapore, Busan}), 50 in US.
* **Customer data processing** - The same as the location at rest.
* **Services** - Directory Core Store

## Services temporarily excluded from the EU Customer Data Boundary

Some services have work in progress to be EU Customer Data Boundary compliant, but this work is delayed beyond January 1, 2023. The services listed will become compliant over the coming months. The following details explain the customer data that these features currently transfer out of the EU Customer Data Boundary as part of their service operations:

* **Reason for customer data egress** - These features haven't completed changes to fully process user or admin transactions, such as sign-in or object and application configuration actions within the EU Data Boundary.
* **Types of customer data being egressed** - User and device account and usage data, service configuration, such as application, policy, group, and terms of use configuration.
* **Customer data location at rest** - In the EU Customer Data Boundary.
* **Customer data processing** - Some processing may occur globally.  
* **Services** - Azure Active Directory Connect, Azure Active Directory Connect Health, Enterprise Application Management, Dynamic Groups Service, MyAccount, MyApps, MySign-Ins, Reporting and Audit Insights, Self-Service Credentials Management, Self-Service Group Management, Sign-In, Terms of Use

Some services have email specific data that will become compliant in the coming months. The following details explain the customer data that these features currently transfer out of the EU Customer Data Boundary as part of their service operations:

* **Reason for customer data egress** - To provide email notifications, some data is processed outside of the region.  
* **Types of customer data being egressed** - User account data, such as email address.  
* **Customer data location at rest** - In EU Customer Data Boundary.
* **Customer data processing**- Some processing may occur globally.
* **Services** - Azure Active Directory Sync Fabric, Azure Certificate Service, Enterprise App Management, Identity Governance, JIT

## Other considerations

Services and applications that integrate with Azure AD have access to customer data. Review how each service and application stores and processes customer data, and verify that they meet your company's data handling requirements.

## Next steps

For more information about Microsoft services' data residency, see the **Where your data is located** section of the [Microsoft Trust Center](https://www.microsoft.com/en-us/trust-center/privacy/data-location?rtc=1).
