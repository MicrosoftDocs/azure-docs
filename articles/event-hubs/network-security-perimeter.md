---
title: Network Security Perimeter 
titleSuffix: Azure Event Hubs
description: Learn how Network Security Perimeter (NSP) enhances security for Azure Event Hubs by controlling network access between PaaS services.
ms.reviewer: spelluru
ms.date: 01/31/2026
ms.topic: conceptual
ms.custom:
---


# Network Security Perimeter for Azure Event Hubs

Network Security Perimeter (NSP) is a network isolation feature that enables you to define a logical network boundary for Platform as a Service (PaaS) resources, including Azure Event Hubs. It restricts public network access to resources within the perimeter while allowing secure communication between associated PaaS services.

## Overview

Network Security Perimeter provides an extra layer of security for your Azure Event Hubs namespace by:

- **Restricting public access**: By default, resources within the perimeter are protected from unauthorized external access.
- **Enabling secure PaaS-to-PaaS communication**: Event Hubs can securely communicate with other Azure services like Azure Storage and Azure Key Vault within the same perimeter.
- **Simplifying network security management**: Instead of managing individual service firewalls, you can define access rules at the perimeter level.
- **Supporting compliance requirements**: NSP helps meet regulatory requirements by providing clear network boundaries for your data.

Operating as a service under Azure Private Link, Network Security Perimeter facilitates secure communication for PaaS services deployed outside the virtual network. It supports:

- Seamless interaction among PaaS services within the perimeter
- Communication with external resources through carefully configured access rules
- Outbound access to services such as Azure Key Vault for Bring Your Own Key (BYOK) encryption and Azure Storage for Event Hubs Capture

## Key capabilities

When you associate an Event Hubs namespace with a Network Security Perimeter, you gain the following capabilities:

| Capability | Description |
| --- | --- |
| **Inbound access rules** | Control which external resources, IP addresses, or subscriptions can send data to your Event Hubs namespace. |
| **Outbound access rules** | Define which external resources your Event Hubs namespace can communicate with (for example, storage accounts for Capture). |
| **Profile-based management** | Apply different access rule sets to different resources using NSP profiles. |
| **Diagnostic logging** | Monitor network access attempts and audit security events through NSP diagnostic logs. |

## Supported scenarios

Network Security Perimeter for Event Hubs supports the following scenarios:

- **Event ingestion from Azure services**: Allow other Azure services within the same perimeter to send events to your Event Hubs namespace.
- **Kafka workloads**: Integrating Event Hubs with Kafka within the NSP framework enhances data streaming capabilities while maintaining robust security.
- **Data capture**: Configure outbound rules to allow Event Hubs to write captured data to Azure Storage or Azure Data Lake Storage.
- **Customer-managed keys**: Enable outbound access to Azure Key Vault for encryption with customer-managed keys (BYOK).

## Limitations

Be aware of the following limitations when using Network Security Perimeter with Event Hubs:

- Network Security Perimeter doesn't support [Azure Event Hubs - Geo-disaster recovery](./event-hubs-geo-dr.md).
- Certain Network Security Perimeter features, such as same perimeter access, cross perimeter access, and subscription access rules, don't work with Shared Access Signature (SAS) authentication. Use Microsoft Entra ID authentication for full NSP functionality.

## Associate Event Hubs with a Network Security Perimeter

To learn how to associate a Network Security Perimeter with your Event Hubs namespace, see [Associate Network Security Perimeter with Event Hubs](associate-network-security-perimeter.md).

## Related content

- [Network security perimeter concepts](/azure/private-link/network-security-perimeter-concepts)
- [Create a network security perimeter](/azure/private-link/create-network-security-perimeter-portal)
- [Diagnostic logs in network security perimeter](/azure/private-link/network-security-perimeter-diagnostic-logs)
- [Network security for Azure Event Hubs](./network-security.md)
- [Use private endpoints with Event Hubs](./private-link-service.md)
- [Configure IP firewall rules](./event-hubs-ip-filtering.md)
