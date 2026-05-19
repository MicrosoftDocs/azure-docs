---
title: Attestation Document
description: This article provides the attestation document for Business Process Solutions.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: overview
ms.custom: compliance, security
ms.date: 11/07/2025
ms.author: momakhij
---

# Attestation document

This article provides details on how the Business Process Solutions workload complies with the requirements for publishing in the Microsoft Fabric workload hub. The information outlined here is kept up to date and links to the workload metadata manifest.

## Business requirements

This section outlines the business requirements for the Business Process Solutions workload.

### Value to customers

Business Process Solutions delivers a unified data foundation for business applications that accelerates AI adoption, simplifies automation, and reduces risk. Businesses can use it to access the full potential of unified data analytics and agentic intelligence. Business Process Solutions includes prebuilt data models in Fabric, data mapping and transformations, and prebuilt Power BI dashboards and data agents. With Business Process Solutions, you can interact with data in a reliable and highly effective way, no matter if you work with massive volumes or complex data structures.

### Trial

We offer a trial experience that's easy and fast. Customers can quickly start the free trial and use it to explore the workload for a limited time by following Microsoft guidelines for trials.

[] Yes

[✔] No

### Monetization

The workload is available on Microsoft Marketplace for customers to procure with or without a trial in accordance with the monetization guidelines.

[] Yes

[✔] No

## Technical requirements

This section outlines the technical requirements for the Business Process Solutions workload.

### Microsoft Entra access

The workloads use Microsoft Entra authentication and authorization.

[✔] No other authentication and authorization mechanisms are used.

[] Different authentication and authorization mechanisms are used for stored data in Fabric.

### Microsoft OneLake

Workloads integrate with Microsoft OneLake to store data in the standard formats that the Fabric platform supports so that other services can take advantage of it.

[] All data and metadata is stored in OneLake or Fabric data stores.

[✔] Not all data and metadata is stored in OneLake or Fabric data stores.

### Microsoft Entra Conditional Access

Enterprise customers require centralized control and management of the identities and credentials that are used to access their resources and data. Customers must further secure their environments via Microsoft Entra Conditional Access.

[✔] The service works in its entirety if customers enable this functionality.

[] The service works within limitations if customers enable this functionality.

[] The service doesn't work with Conditional Access.

### Admin REST API

Admin REST APIs are an integral part of Fabric admin and governance process. These APIs help Fabric admins to discover workspaces and items and enforce governance, such as performing access reviews. Basic functionality is supported as part of the Microsoft Fabric Workload Development Kit and doesn't need any work from partners.

[] Fabric admin APIs are used (/admin/*).

[✔] No Fabric admin APIs are used.

### Customer-facing monitoring and diagnostics

Health and telemetry data must be stored for a minimum for 30 days, including activity IDs for customer support purposes, including trials.

[✔] Minimum 30-day requirement is adhered to.

[] Vendor stores the data for __ days beyond the minimum requirement.

### Performance

The workload implementation takes measures to test and track performance of their items.

[] Performance metrics on workload performance are available via the monitoring hub.

[] The workload includes a separate monitoring UI to test and track performance.

[✔] Performance tracking isn't currently available to users. Vendor support personnel can monitor, test, and track performance via their internal instrumentation and monitoring systems.

### Presence

To ensure that customer expectations independent of their home or capacity region are met, vendors must align with Fabric regions and clouds. Availability in certain restrictions also affects your data residency commitments.

[✔] Service availability and colocation/alignment in the Fabric regions.

[] All or part of the service doesn't reside in Azure.

## Design/UX requirements

- **Common user experience (UX)**: Business Process Solutions complies with the Fabric UX guidelines.
- **Item creation experience**: The item creation experience is in accordance with the Fabric UX system.
- **Monitoring hub**: All long-running operations must integrate with the Fabric monitoring hub.
- **Trial experience**: The workload doesn't provide a trial experience for users.
- **Accessibility**: The UX is in compliance with the Fabric UX design guidelines for accessibility.
- **World readiness/Internationalization**: English is supported as the default language.
- **Item settings**: Item settings are implemented as a part of the ribbon as outlined in the UX guidelines.
- **Samples**: No sample datasets are provided for preconfiguring items of their type to help customers get started more easily.
- **Custom actions**: Custom actions aren't implemented.
- **Workspace settings**: Workspace settings provide a way that workloads can be configured on a workspace level. Workspace settings aren't currently implemented for our workload.
- **Global search**: Searching for items in Fabric is supported through the top search bar. This capability isn't currently implemented for our workload.

## Security/Compliance requirements

Protection of customer data and metadata is of paramount importance. Comprehensive security reviews and assessments are performed periodically. Any identified security issues that could affect customers are addressed with priority. Partners who build workloads also have a responsibility to protect that data when they access it. For our workload, the following security and compliance requirements are met:

- Business Process Solutions workload uses essential HTTP-only cookies only after positively authenticating the user.
- Our workload doesn't rely on non-Microsoft cookies.
- Our workload obtains a Microsoft Entra token by using the JavaScript APIs that are provided by the Fabric workload client SDK.

## Data residency

Fabric makes an enterprise promise around data not leaving the geography of the tenant. Our service is deployed in a single region within each geographic area. Service metadata is maintained in accordance with the workspace's designated capacity region.

## Compliance

Business Process Solutions is committed to ensuring that customers can trust our products and practices and meet their compliance obligations.

## Support

### Live site

Partner workloads are an integral part of Fabric. They require that Microsoft support teams must be aware of how to contact you in case customers reach out directly.

#### Microsoft direct vendor outreach

- **Contact name/team**: Azure workloads platform as service: Business Process Solutions
- **Email alias**: `sapmonitoridcdev@microsoft.com`

### Supportability

Vendors are responsible for defining and documenting their support parameters, like service-level agreements and contact methods. This information must be linked from the workload page and should always be accessible to customers.

[✔] Vendor attests that support information is published and available to users/customers directly via the workload.

## Fabric features

### Application lifecycle management

Fabric lifecycle management tools enable efficient product development, continuous updates, fast releases, and ongoing feature enhancements.

[] Supported.

[✔] Not supported.

### Private links

With Fabric, you can configure and use an endpoint that allows your organization to access Fabric privately.

[] Supported.

[✔] Not supported.

### Data hub

The OneLake data hub makes it easy to find, explore, and use the Fabric data items in your organization to which you have access. It provides information about the items and entry points for working with them. If you're implementing a data item, they show up in the data hub too.

[] Supported.

[✔] Not supported.

### Data lineage

In modern business intelligence projects, understanding the flow of data from the data source to its destination can be a challenge. The challenge is even bigger if you built advanced analytical projects that span multiple data sources, data items, and dependencies. Questions like "What happens if I change this data?" or "Why isn't this report up to date?" can be hard to answer.

[] Supported.

[✔] Not supported.

### Sensitivity labels

Sensitivity labels from Microsoft Purview Information Protection on items can guard your sensitive content against unauthorized data access and leakage. They're a key component in helping your organization meet its governance and compliance requirements. Labeling your data correctly with sensitivity labels ensures that only authorized people can access your data.

Extra requirement: Partners who use export functionality within their item need to follow the guidelines.

[] Supported.

[✔] Not supported.

## Summary

This article outlines the attestation for a Business Process Solutions workload in Fabric. This attestation includes business, technical, design, security, and compliance requirements that are met to ensure a reliable and secure experience for our customers. This attestation is maintained and updated as needed to reflect any changes or improvements to the workload.
