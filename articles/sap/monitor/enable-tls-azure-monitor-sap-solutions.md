---
title: TLS 1.2 secure communication in Azure Monitor for SAP solutions
description: Learn about secure communication with TLS 1.2 or later in Azure Monitor for SAP solutions, including supported certificate types and how encryption works.
author: sameeksha91
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: concept-article
ms.date: 03/30/2026
ms.author: sakhare
#Customer intent: As an SAP Basis or cloud infrastructure team member, I want to enable TLS 1.2 or later for Azure Monitor for SAP solutions so that I can ensure secure communication and protect telemetry data during transit.
---

# TLS 1.2 secure communication in Azure Monitor for SAP solutions

TLS 1.2 secure communication is an optional encryption feature in Azure Monitor for SAP solutions that encrypts monitoring telemetry data in transit between Azure Functions and SAP systems. This article explains how the feature works and which certificate types are supported.

Azure Monitor for SAP solutions resources and their associated managed resource group components deploy within a virtual network in your subscription. Azure Functions connects to an SAP system by using the connection properties that you provide, pulls required telemetry data, and pushes that data to Log Analytics.

Azure Monitor for SAP solutions encrypts monitoring telemetry data in transit by using approved cryptographic protocols and algorithms. Traffic between Azure Functions and SAP systems is encrypted with TLS 1.2 or later. You can enable or disable this feature based on your needs.

## Supported certificates

To enable secure communication in Azure Monitor for SAP solutions, you can use either a *root* certificate or a *server* certificate.

We recommend root certificates. For root certificates, Azure Monitor for SAP solutions supports only certificates from [certificate authorities (CAs) that participate in the Microsoft Trusted Root Program](/security/trusted-root/participants-list).

A trusted root authority must sign the certificates. Self-signed certificates **aren't** supported.

## How it works

When you deploy an Azure Monitor for SAP solutions resource, a managed resource group and its components deploy automatically. Managed resource group components include Azure Functions, Log Analytics, Azure Key Vault, and a storage account. This storage account holds certificates needed to enable secure communication with TLS 1.2 or later.

During provider creation in Azure Monitor for SAP solutions, you can enable or disable secure communication. When you enable this feature, the certificate type determines how encryption works.

With a root certificate, the certificate must come from a [Microsoft-supported CA](/security/trusted-root/participants-list). After validation, the provider instance uses the root certificate to encrypt subsequent data in transit.

With a server certificate, a trusted CA must sign the certificate. After you upload the certificate, Azure Monitor for SAP solutions stores it in a storage account within the managed resource group. This certificate encrypts subsequent data in transit.

> [!NOTE]
> Each provider type might have prerequisites that you must meet to enable secure communication.

## Related content

- [Azure Monitor for SAP solutions provider types](providers.md)
- [Configure SAP NetWeaver provider for Azure Monitor for SAP solutions](provider-netweaver.md)
