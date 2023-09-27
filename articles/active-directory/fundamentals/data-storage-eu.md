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
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Customer data storage and processing for European customers in Microsoft Entra ID

Microsoft Entra ID stores customer data in a geographic location based on how a tenant was created and provisioned. The following list provides information about how the location is defined:

* **Azure portal or Microsoft Entra API** - A customer selects a location from the pre-defined list.
* **Dynamics 365 and Power Platform** - A customer provisions their tenant in a pre-defined location.
* **EU Data Residency** - For customers who provided a location in Europe, Microsoft Entra ID stores most of the customer data in Europe, except where noted later in this article.
* **EU Data Boundary** - For customers who provided a location that is within the EU Data Boundary (members of the EU and EFTA), Microsoft Entra ID stores and processes most of the customer data in the EU Data Boundary, except where noted later in this article.
* **Microsoft 365** - The location is based on a customer provided billing address.

The following sections provide information about customer data that doesn't meet the EU Data Residency or EU Data Boundary commitments.

## Services permanently excluded from the EU Data Residency and EU Data Boundary

* **Reason for customer data egress** - Some forms of communication, such as phone calls or text messaging platforms like SMS, RCS, or WhatsApp, rely on a network that is operated by global providers. Device vendor-specific services, such as push notifications from Apple or Google, may be outside of Europe.
* **Types of customer data being egressed** - User account data (phone number).
* **Customer data location at rest** - In EU Data Boundary.
* **Customer data processing** - Some processing may occur globally.
* **Services** - multifactor Authentication

## Services temporarily excluded from the EU Data Residency and EU Data Boundary

Some services have work in progress to be EU Data Residency and EU Data Boundary compliant, but this work is delayed beyond January 1, 2023. The following details explain the customer data that these features currently transfer out of the EU as part of their service operations:

* **Reason for customer data egress** - To provide reliable and scalable service, Microsoft performs regular analytics that involve transfers of data outside the EU location.
* **Types of customer data being egressed** - User and device account data, usage data, and service configuration (application, policy, and group).  
* **Customer data location at rest** - US
* **Customer data processing** - US
* **Services** - Microsoft Entra Connect, Microsoft Entra Connect Health, Device Registration, Directory Core Store, Dynamic Groups Service, Self-Service Group Management

Some services incorrectly stored data out of the EU Data Boundary. The following details explain the customer data that these features currently transfer out of the EU as part of their service operations:

* **Reason for customer data egress** - A small number of tenants created in the EU location prior to March 2019 were incorrectly stored out of the EU Data Boundary due to an issue that is now fixed. Microsoft is in the process of migrating tenants to the correct location.  
* **Types of customer data being egressed** - User and device account data, and service configuration (application, policy, and group).
* **Customer data location at rest** -  US and Asia/Pacific.
* **Customer data processing** - The same as the location at rest.
* **Services** - Directory Core Store

## Services temporarily excluded from the EU Data Boundary

Some services have work in progress to be EU Data Boundary compliant. This work is delayed beyond January 1, 2023. The following details explain the customer data that these features currently transfer out of the EU Data Boundary as part of their service operations:

* **Reason for customer data egress** - These features haven't completed changes to fully process user or admin transactions, such as sign-in or object and application configuration actions within the EU Data Boundary.
* **Types of customer data being egressed** - User and device account data, usage data, and service configuration (application, policy, group, and terms of use).
* **Customer data location at rest** - In the EU Data Boundary.
* **Customer data processing** - Some processing may occur globally.  
* **Services** - Microsoft Entra Connect, Microsoft Entra Connect Health, Enterprise Application Management, Dynamic Groups Service, MyAccount, MyApps, MySign-Ins, Reporting and Audit Insights, Self-Service Credentials Management, Self-Service Group Management, Sign-In, Terms of Use

Some services have email specific data that will become compliant in the coming months. The following details explain the customer data that these features currently transfer out of the EU Data Boundary as part of their service operations:

* **Reason for customer data egress** - To provide email notifications, some data is processed outside of the EU location.  
* **Types of customer data being egressed** - User account data (email address).  
* **Customer data location at rest** - In EU Data Boundary.
* **Customer data processing**- Some processing may occur globally.
* **Services** - Azure Active Directory Sync Fabric, Azure Certificate Service, Enterprise App Management, Identity Governance, Azure Customer Lockbox

## Other considerations

### Optional service capabilities that transfer data out of the EU Data Residency and EU Data Boundary

Administrators can choose to enable or disable certain Microsoft Entra features. If the following features are enabled and used by the customer, they will result in data transfers out of the EU Data Residency and EU Data Boundary as described:

* **Microsoft Entra Multi Tenant Collaboration** - With multi tenant collaboration scenarios enabled, customers can configure their tenant to collaborate with users from a different tenant. For example, a customer can invite users to their tenant in a B2B context. A customer can create a multi-tenant SaaS application that allows other third party tenants to provision the application in the third party tenant. Or, the customer can make two or more tenants affiliated with one another and act as a single tenant in certain scenarios, such as multi-tenant organization (MTO) formation, tenant to tenant sync, and shared e-mail domain sharing. Customer configuration and use of multi tenant collaboration may occur with tenants outside of the EU Data Residency and EU Data Boundary resulting in some customer data, such as user and device account data, usage data, and service configuration (application, policy, and group) stored and processed in the location of the collaborating tenant.
* **Application Proxy** - Allows customers to access their on-premises web applications externally. Customers may choose advanced routing configurations that allow customer data to egress outside of the EU Data Residency and EU Data Boundary, including user account data, usage data, and application configuration data.
* **Microsoft 365 Multi Geo** - Microsoft 365 Multi-Geo provides customers with the ability to expand their Microsoft 365 presence to multiple geographic countries/regions within a single existing Microsoft 365 tenant. Microsoft Entra ID will egress customer data to perform backup authentication to the locations configured by the customer. Types of customer data include user and device account data, branding data, and service configuration data (application, policy, and group).

### Other EU Data Boundary online services

Services and applications that integrate with Microsoft Entra ID have access to customer data. Review how each service and application stores and processes customer data, and verify that they meet your company's data handling requirements.

## Next steps

For more information about Microsoft services' data residency, see the **Where your data is located** section of the [Microsoft Trust Center](https://www.microsoft.com/en-us/trust-center/privacy/data-location?rtc=1).
