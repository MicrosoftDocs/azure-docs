---
title: Attestation Document
description: This article provides attestation document for Business Process Solutions.
author: mohitmakhija1
ms.service: sap-on-azure
ms.subservice:
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

### Monetization

The workload is available on the marketplace for the customer to procure with or without a trial in accordance with the monetization guidelines

## Technical Requirements

This section outlines the technical requirements for the Business Process Solutions workload.

### Microsoft Entra Access

To begin using the workload, Business Process Solutions for Microsoft Fabric no other  authentication and authorization mechanisms are needed.

### One Lake

Workloads integrate with One Lake to store data in the standard formats supported by the Fabric platform so that other services can take advantage of it. In our workload, metadata is stored in One Lake.

### Microsoft Entra Conditional Access

Enterprise customers require centralized control and management of the identities and credentials used to access their resources and data and via Microsoft Entra to further secure their environment via conditional access. The service works in its entirety even if customers enable this functionality

### Admin REST API

Admin REST APIs are an integral part of Fabric admin and governance process. For our workload, no Microsoft Fabric Admin APIs are being used.

### Customer Facing Monitoring & Diagnostic

Health and telemetry data needs to be stored for a minimum for 30 days including activity ID for customer support purposes. We store the data for a minimum of 180 days.

### Performance

The Workload implementation takes measures to test and track performance of their items. Performance tracking isn't currently available to the end user however workload team support can monitor, test, track performance via their internal instrumentation and monitoring systems.

## Design / UX Requirements

- **Common UX**: Business Process Solutions complies with the Fabric UX guidelines.
- **Item Creation Experience**: The item creation experience is in accordance with the Fabric UX System.
- **Monitoring Hub**¹¹: All Long running operations need to integrate with Fabric Monitoring Hub.
- **Trial Experience**: The workload doesn't provide a trial experience for users.
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

## Summary

In this document, we outline the attestation for Business Process Solutions workload in Microsoft Fabric. This includes business, technical, design, security, and compliance requirements that are met to ensure a reliable and secure experience for our customers. We maintain and update this attestation as needed to reflect any changes or improvements to the workload.
