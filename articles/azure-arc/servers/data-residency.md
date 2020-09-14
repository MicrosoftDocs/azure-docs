---
title: Data residency
description: Data residency and information about Azure Arc enabled servers (preview).
ms.topic: reference
ms.date: 08/25/2020
ms.custom: references_regions
---

# Azure Arc enabled servers (preview): Data residency

This article explains the concept of data residency and how it applies to Azure Arc enabled servers (preview).

Azure Arc enabled servers (preview) is **[available in preview](https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc)** in the **United States, Europe, or Asia Pacific**.

## Data residency

Azure Arc enabled servers (preview) store [Azure VM extension](manage-vm-extensions.md) configuration settings (that is, property values) the extension requires specifying before attempting to enable on the connected machine. For example, when you enable the Log Analytics VM extension, it asks for the Log Analytics **workspace ID** and **primary key**.

Metadata information about the connected machine is also collected. Specifically:

* Operating system name and version
* Computer name
* Computer fully qualified domain name (FQDN)
* Connected Machine agent version

Arc enabled servers (preview) allow you to specify the region where your data will be stored. Microsoft may replicate to other regions for data resiliency, but Microsoft does not replicate or move data outside the geography. This data is stored in the region where the Azure Arc machine resource is configured. For example, if the machine is registered with Arc in the East US region, this data is stored in the US region.

For more information about our regional resiliency and compliance support, see [Azure geography](https://azure.microsoft.com/global-infrastructure/geographies/).

## Next steps

Learn more about designing for [Azure resiliency](/azure/architecture/reliability/architect).