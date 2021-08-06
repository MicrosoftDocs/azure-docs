---
title: Data residency
description: Data residency and information about Azure Arc—enabled servers.
ms.topic: reference
ms.date: 08/05/2021
ms.custom: references_regions
---

# Azure Arc—enabled servers: Data residency

This article explains the concept of data residency and how it applies to Azure Arc—enabled servers.

Azure Arc—enabled servers is **[available](https://azure.microsoft.com/global-infrastructure/services/?products=azure-arc)** in the **United States, Europe, United Kingdom, Australia, and Asia Pacific**.

## Data residency

Azure Arc—enabled servers store [Azure VM extension](manage-vm-extensions.md) configuration settings (that is, property values) the extension requires specifying before attempting to enable on the connected machine. For example, when you enable the Log Analytics VM extension, it asks for the Log Analytics **workspace ID** and **primary key**.

Metadata information about the connected machine is also collected. Specifically:

* Operating system name, type, and version
* Computer name
* Computer fully qualified domain name (FQDN)
* Connected Machine agent version
* Active Directory and DNS fully qualified domain name (FQDN)
* UUID (BIOS ID)
* Connected Machine agent heartbeat
* Connected Machine agent version
* Public key for managed identity
* Policy compliance status and details (if using Azure Policy Guest Configuration policies)

Azure Arc—enabled servers allow you to specify the region where your data is stored. Microsoft may replicate to other regions for data resiliency, but Microsoft does not replicate or move data outside the geography. This data is stored in the region where the Azure Arc machine resource is configured. For example, if the machine is registered with Arc in the East US region, this data is stored in the US region.

> [!NOTE] 
> For South East Asia, your data is not replicated outside of this region. 

For more information about our regional resiliency and compliance support, see [Azure geography](https://azure.microsoft.com/global-infrastructure/geographies/).

## Next steps

Learn more about designing for [Azure resiliency](/azure/architecture/reliability/architect).
