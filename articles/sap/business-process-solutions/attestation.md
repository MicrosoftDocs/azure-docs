---
title: Attestation Document
description: This article provides attestation document for Business Process Solutions.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: overview
ms.custom: compliance, security
ms.date: 11/07/2025
ms.author: momakhij
---

# Attestation Document

This document provides details on how our Business Process Solutions workload complies with the requirements for publishing in the Microsoft Fabric Workload Hub. The information outlined here stays up-to-date and links to the Workload metadata manifest.

## Business Requirements

This section outlines the business requirements for the Business Process Solutions workload.

### Value To Customers

The workload provides the following value to customers -

Business Process Solutions delivers a unified data foundation for business applications that accelerates AI adoption, simplifies automation, and reduces risk – empowering businesses to unlock the full potential of unified data analytics and agentic intelligence. It includes prebuilt data models in Microsoft Fabric, data mapping and transformations, as well as prebuilt Power BI dashboards and data agents. With Business Process Solutions, we ensure data can be interacted with in a reliable and high-performant way, whether working with massive volumes or complex data structures.

### Trial

We offer a trial experience that's easy and fast. Customers can start the trial in less than 5 seconds. The trial is free and allows users to explore the workload for a limited time, following Microsoft guidelines for Trials.

[] Yes

[✔] No

### Monetization

The workload is available on the marketplace for the customer to procure with or without a trial in accordance with the monetization guidelines

[] Yes

[✔] No

## Technical Requirements

This section outlines the technical requirements for the Business Process Solutions workload.

### Microsoft Entra Access

The workloads use Microsoft Entra authentication and authorization.

[✔] No other authentication and authorization mechanisms are used

[] Different authentication and authorization mechanisms are used for stored data In Fabric

### One Lake

Workloads integrate with One Lake to store data in the standard formats supported by the Fabric platform so that other services can take advantage of it.

[] All data and metadata is stored in One Lake or Fabric Data Stores

[✔] Not all data and metadata is stored in One Lake or Fabric Data Stores

### Microsoft Entra Conditional Access

Enterprise customers require centralized control and management of the identities and credentials used to access their resources and data and via Microsoft Entra to further secure their environment via conditional access.

[✔] The service works in its entirety with even if customers enable this functionality

[] The service works in with limitations if customers enable this functionality

[] The service doesn't work Microsoft Entra Conditional Access

### Admin REST API

Admin REST APIs are an integral part of Fabric admin and governance process. These APIs help Fabric admins in discovering workspaces and items, and enforcing governance such as performing access reviews, etc. Basic functionality is supported as part of the Workload Development Kit and doesn't need any work from Partners.

[] Microsoft Fabric Admin APIs are being used (/admin/*)

[✔] No Microsoft Fabric Admin APIs are being used

### Customer Facing Monitoring & Diagnostic

Health and telemetry data needs to be stored for a minimum for 30 days including activity ID for customer support purposes, including Trials.

[✔] Minimum 30 days requirement is adhered to

[] Vendor stores the data for __ days beyond the minimum requirement

### Performance

The Workload implementation takes measures to test and track performance of their Items

[] Performance Metrics on workload performance are available via the monitoring hub

[] Workload includes a separate monitoring UI to test and track performance

[✔] Performance tracking isn't currently available to the end user however vendor support personnel can monitor, test, track performance via their internal instrumentation and monitoring systems

### Presence

To ensure that customer expectations independent of their home or capacity region are met, vendors need to align with fabric regions and clouds. Availability in certain restrictions also impacts your Data Residency commitments.

[✔] Service availability and colocation/alignment in the fabric regions.

[] All or part of the service doesn't reside in Azure

## Design / UX Requirements

- **Common UX**: Business Process Solutions complies with the Fabric UX guidelines.
- **Item Creation Experience**: The item creation experience is in accordance with the Fabric UX System.
- **Monitoring Hub**: All Long running operations need to integrate with Fabric Monitoring Hub.
- **Trial Experience**: The workload doesn't provide a trial experience for users.
- **Accessibility**: The user experience is in compliance with the Fabric UX design guidelines for Accessibility.
- **World Readiness / Internationalization**: English is supported as the default language.
- **Item Settings**: Item settings are implemented as a part of the ribbon as outlined in the UX guidelines
- **Samples**: No sample datasets are provided for preconfigure of items of their type to help customers get started more easily.
- **Custom Actions**: Custom actions aren't implemented.
- **Workspace settings**: Workspace settings provide a way that workloads can be configured on a workspace level. Workspace settings are currently not implemented for our workload.
- **Global Search**: Searching for items in Fabric is supported through the top search bar. This is currently not implemented for our workload.

## Security / Compliance Requirements

Protection of customer data and metadata is of paramount importance. Our process includes comprehensive security reviews and assessments, which are periodically performed. Any identified security issues that could impact customers are addressed with priority. Partners that build workloads also have a responsibility to protect that data when they access it.
For our workload, the following security and compliance requirements are met:

- Business Process Solutions workload uses only essential HTTP-only cookies only after positively authenticating the user.
- Our workload doesn't rely on third-party cookies.
- Our workload obtains Microsoft Entra token using the JavaScript APIs provided by the Fabric Workload Client SDK.

## Data Residency

Microsoft Fabric is making an Enterprise Promise around data not leaving the geography of the tenant.
Our service is deployed in a single region within each geographic area, and service metadata is maintained in accordance with the workspace's designated capacity region.

## Compliance

Business Process Solutions is committed to ensuring Customers can trust our products and practices and meet their compliance obligations.

## Support

### Live site

Partner workloads are an integral part of Fabric that requires that the Microsoft support teams are aware of how to contact you in case customers are reaching out to us directly.

#### Microsoft direct vendor outreach:

- **Contact Name/Team**: Azure Workloads Platform as Service - Business Process Solutions
- **Email alias**: sapmonitoridcdev@microsoft.com 


### Supportability

Vendors are responsible for defining and documenting their support parameters (Service level agreement, contact methods, ...). This information needs to be linked from the Workload page and should always be accessible to customers.

[✔] Vendor attests that support information is published and available to user/customers directly via the workload.

## Fabric Features

### Application Life Cycle Management (ALM)

Microsoft Fabric's lifecycle management tools enable efficient product development, continuous updates, fast releases, and ongoing feature enhancements.

[] Supported

[✔] Not Supported

### Private Links

In Fabric, you can configure and use an endpoint that allows your organization to access Fabric privately.

[] Supported

[✔] Not Supported

### Data Hub

The OneLake data hub makes it easy to find, explore, and use the Fabric data items in your organization that you have access to. It provides information about the items and entry points for working with them. If you're implementing a Data Item, show up in the Data Hub as well.

[] Supported

[✔] Not Supported

### Data Lineage

In modern business intelligence (BI) projects, understanding the flow of data from the data source to its destination can be a challenge. The challenge is even bigger if you built advanced analytical projects spanning multiple data sources, data items, and dependencies. Questions like "What happens if I change this data?" or "Why isn't this report up to date?" can be hard to answer.

[] Supported

[✔] Not Supported

### Sensitivity labels

Sensitivity labels from Microsoft Purview Information Protection on items can guard your sensitive content against unauthorized data access and leakage. They're a key component in helping your organization meet its governance and compliance requirements. Labeling your data correctly with sensitivity labels ensures that only authorized people can access your data.

Extra requirements:

For partners that are using Export functionality within their Item they need to follow the guidelines.

[] Supported

[✔] Not Supported

## Summary

In this document, we outline the attestation for Business Process Solutions workload in Microsoft Fabric. This includes business, technical, design, security, and compliance requirements that are met to ensure a reliable and secure experience for our customers. We maintain and update this attestation as needed to reflect any changes or improvements to the workload.
