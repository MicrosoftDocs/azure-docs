---
title: Network Security Perimeter
titleSuffix: Azure Service Bus
description: Learn how to associate an Azure Service Bus namespace with a network security perimeter
ms.reviewer: spelluru
ms.date: 01/15/2026
author: EldertGrootenboer
ms.author: egrootenboer
ms.topic: conceptual
ms.custom:
---


# Network security perimeter for Azure Service Bus (public preview)

[Azure Service Bus](./service-bus-messaging-overview.md) supports integration with [network security perimeter](../private-link/network-security-perimeter-concepts.md).

Network security perimeter safeguards network traffic between Azure Service Bus and other Platform as a Service (PaaS) offerings like Azure Key Vault. By confining communication solely to Azure resources within its boundaries, it blocks unauthorized attempts to access resources beyond its secure perimeter.

With a network security perimeter:

- PaaS resources associated with a specific perimeter can, by default, only communicate with other PaaS resources within the same perimeter.
- You can actively permit external inbound and outbound communication by setting explicit access rules.
- [Diagnostic logs](../private-link/network-security-perimeter-diagnostic-logs.md) are enabled for PaaS resources within perimeter for audit and compliance.

Integrating Service Bus within this framework enhances messaging capabilities while ensuring robust security measures. This integration not only provides a reliable and scalable platform but also strengthens data protection strategies, mitigating risks associated with unauthorized access or data breaches.

Operating as a service under Azure Private Link, network security perimeter facilitates secure communication for PaaS services deployed outside the virtual network. It enables seamless interaction among PaaS services within the perimeter and facilitates communication with external resources through carefully configured access rules. Additionally, it supports outbound resources such as Azure Key Vault for customer-managed keys (CMK), further enhancing its versatility and utility in diverse cloud environments.

## Network security perimeter scenarios in Service Bus

Azure Service Bus supports scenarios that require access to other PaaS resources:

- **Customer-managed keys (CMK)** require communication with Azure Key Vault. For more information, see [Configure customer-managed keys for encrypting Azure Service Bus data at rest](configure-customer-managed-key.md).

> [!NOTE]
> - Network security perimeter is currently in public preview.
> - Network security perimeter doesn't support [Azure Service Bus Geo-Disaster Recovery](./service-bus-geo-dr.md).
> - Network security perimeter currently doesn't support [Azure Service Bus Geo-Replication](./service-bus-geo-replication.md).
> - Network security perimeter rules don't govern private link traffic through [private endpoints](../private-link/private-endpoint-overview.md).

## Create a network security perimeter

Create your own network security perimeter resource using [Azure portal](../private-link/create-network-security-perimeter-portal.md), [PowerShell](../private-link/create-network-security-perimeter-powershell.md), or [Azure CLI](../private-link/create-network-security-perimeter-cli.md).

## Associate Service Bus with a network security perimeter in the Azure portal

1. Go to your network security perimeter resource in the Azure portal.
1. Select **Resources** from the left menu.
1. Select **Associate** to add a new resource association.
1. Search for and select the Service Bus namespace you want to add.
1. Select a profile to associate with the namespace and select **Associate**.

## Related content

- [Network security perimeter concepts](../private-link/network-security-perimeter-concepts.md)
- [Diagnostic logs in network security perimeter](../private-link/network-security-perimeter-diagnostic-logs.md)
- [Network security for Azure Service Bus](./network-security.md)
- [Allow access to Azure Service Bus namespaces via private endpoints](./private-link-service.md)
- [Configure customer-managed keys for Azure Service Bus](configure-customer-managed-key.md)
