---
title: Azure Health Data Services Availability Zones
description: Overview of Availability Zones for Azure Health Data Services
services: healthcare-apis
author: expekesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.custom: devx-track-python
ms.topic: conceptual
ms.date: 10/15/2024
ms.author: kesheth
---

# Availability Zones for Azure Health Data Services

The goal of high availability in Azure Health Data Services is to minimize impact on customer workloads from service maintenance operations and outages. Azure Health Data Services provides zone redundant availability using availability zones (AZs) for high availability and business continuity. To understand more about availability zones, visit [What are Azure availability zones?](/azure/reliability/availability-zones-overview?tabs=azure-cli).

Zone redundant availability provides resiliency by protecting against outages within a region. This is achieved using zone-redundant storage (ZRS), which replicates your data across three availability zones in the primary region. Each availability zone is a separate physical location with independent power, cooling, and networking. Zone redundant availability minimizes the risk of data loss if there are zone failures within the primary region.<br>
For information on regions, see [Products availability by region](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

> [!NOTE]
> Currently the availability zone feature is being provided to customers at no additional charge. In the future, charges will be incurred with the availability zone feature.

## Region availability

Here's a list of the availability zones for Azure Health Data Services.

- Australia East
- Cental India
- Japan East
- Korea Central
- Southeast Asia
- France Central
- North Europe
- West Europe
- UK South
- Sweden Central
- Germany West Central*
- East US*
- East US 2
- South Central US*
- West US 2*
- West US 3*
- Canada Central

Regions marked with a star ("*") have quota issues due to high demand. Enabling AZ features in these regions may take longer.

### Limitations

Consider the following limitations when configuring an availability zone.

- Azure Health Data Service FHIR&reg; service instances allow customers to set AZ settings only once and can't be modified.
- FHIR service with data volume support beyond 4 TB needs to specify the AZ configuration during the service instance creation.
- When this feature is available as self-serve, any FHIR service instance created in Azure Health Data Services needs to specify the AZ configuration during the service instance creation.

## Recovery Time Objective and Recovery Point Objective

The time required for an application to fully recover is known as the Recovery Time Objective (RTO). It's also the maximum period (time interval) of recent data updates the application can tolerate losing when recovering from an unplanned disruptive event.<br>
The potential data loss is known as Recovery Point Objective (RPO).
With zone redundant availability, Azure Health Data Services FHIR service provides an RTO of less than 10 minutes, and RPO of 0.

## Impact during zone-wide outages

During a zone-wide outage, no action is needed from the customer during zone recovery. Customers should be prepared to experience a brief interruption of communication to provisioned resources. Impact to regions due to a zone outage is communicated on [Azure status history](https://azure.status.microsoft/status/history/).

## Enabling an availability zone

To enable the availability zone on a specific instance, customers need to submit a support ticket with following details.

- Name of the subscription
- Name of the FHIR service instance
- Name of the resource group

More information can be found at [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

[!INCLUDE [FHIR trademark statement](includes/healthcare-apis-fhir-trademark.md)]
