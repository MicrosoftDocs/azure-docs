---
title: Manage network access security in Azure Health Data Services
description: Learn about network access security and outbound connections for the FHIR, DICOM, and MedTech services in Azure Health Data Services.
services: healthcare-apis
author: timritzer
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 05/06/2024
ms.author: jasteppe
---

# Manage network access security in Azure Health Data Services

Azure Health Data Services provides multiple options for securing network access to its features and for managing outbound connections made by the FHIR&reg;, DICOM&reg;, or MedTech services.

## Private Link

[Private Link](../private-link/index.yml) is a network isolation technique that allows access to Azure services, including Azure Health Data Services. Private Link allows data to flow over private Microsoft networks instead of the public internet. By using Private Link, you can allow access only to specified virtual networks, and lock down access to provisioned services. For more information, see [Configure Private Link](healthcare-apis-configure-private-link.md).

## Microsoft Trusted Services

Although most interactions with Azure Health Data Services are inbound requests, there are a few features of the services that need to make outbound connections to other resources. To control access from outbound connections, we recommend that you use the [Microsoft Trusted Service](../storage/common/storage-network-security.md) connections in the network settings of the target resource. Each outbound feature can have slightly different setup steps and intended target resources.

Here's a list of features that can make outbound connections from Azure Health Data Services:

### FHIR service

- **Export**: [Allow FHIR service export as a Microsoft Trusted Service](fhir/configure-export-data.md)
- **Import**: [Allow FHIR service import as a Microsoft Trusted Service](fhir/configure-import-data.md)
- **Convert**: [Allow trusted services access to Azure Container Registry](../container-registry/allow-access-trusted-services.md)
- **Events**: [Allow trusted services access to Azure Event Hubs](../event-hubs/event-hubs-service-endpoints.md)
- **Customer-managed keys**: [Allow trusted services access to Azure Key Vault](../key-vault/general/overview-vnet-service-endpoints.md)

### DICOM service

- **Import, export, and analytical support**: [Allow trusted services access to Azure Storage accounts](../storage/common/storage-network-security.md)
- **Events**: [Allow trusted services access to Azure Event Hubs](../event-hubs/event-hubs-service-endpoints.md)
- **Customer-managed keys**: [Allow trusted services access to Azure Key Vault](../key-vault/general/overview-vnet-service-endpoints.md)

### MedTech service

- **Events**: [Allow trusted services access to Azure Event Hubs](../event-hubs/event-hubs-service-endpoints.md)

## Service tags

[Service tags](../virtual-network/service-tags-overview.md) are sets of IP addresses that correspond to an Azure Service, for example Azure Health Data Services. You can use tags to control access on several Azure networking offerings such as Network Security Groups, Azure Firewall, and more.

Azure Health Data Services offers a [service tag](../virtual-network/service-tags-overview.md) `AzureHealthcareAPIs` that you can use to control access to and from the services. However, there are a few caveats that come with using service tags for network isolation, and we don't recommend relying on them. Instead, use the approaches described in this article for more granular controls. Service tags are shared across all users of a service, and all provisioned instances. Tags provide no isolation between customers within Azure Health Data Services, between separate instances of the workspaces, nor between the different service offerings.

If you use service tags, keep in mind that they're a convenient way of keeping track of sets of IP addresses. However, tags aren't a substitute for proper network security measures.

[!INCLUDE [FHIR and DICOM trademark statement](includes/healthcare-apis-fhir-dicom-trademark.md)]