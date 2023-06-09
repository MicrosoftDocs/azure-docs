---
title: Enable TLS 1.2 or later 
description: Learn about secure communication with TLS 1.2 or later in Azure Monitor for SAP solutions.
author: sameeksha91
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: how-to
ms.date: 12/14/2022
ms.author: sakhare
#Customer intent: As an SAP Basis or cloud infrastructure team member, I want to deploy Azure Monitor for SAP solutions with secure communication.
---

# Enable TLS 1.2 or later in Azure Monitor for SAP solutions

In this article, learn about secure communication with TLS 1.2 or later in Azure Monitor for SAP solutions.

Azure Monitor for SAP solutions resources and their associated managed resource group components are deployed within a virtual network in a subscription. Azure Functions is one component in a managed resource group. Azure Functions connects to an appropriate SAP system by using connection properties that you provide, pulls required telemetry data, and pushes that data to Log Analytics.  

Azure Monitor for SAP solutions provides encryption of monitoring telemetry data in transit by using approved cryptographic protocols and algorithms. Traffic between Azure Functions and SAP systems is encrypted with TLS 1.2 or later. By choosing this option, you can enable secure communication.
  
Enabling TLS 1.2 or later for telemetry data in transit is an optional feature. You can choose to enable or disable this feature according to your requirements.

## Supported certificates

To enable secure communication in Azure Monitor for SAP solutions, you can choose to use either a *root* certificate or a *server* certificate.

We highly recommend that you use root certificates. For root certificates, Azure Monitor for SAP solutions supports only certificates from [certificate authorities (CAs) that participate in the Microsoft Trusted Root Program](/security/trusted-root/participants-list).

Certificates must be signed by a trusted root authority. Self-signed certificates are not supported.

## How does it work?

When you deploy an Azure Monitor for SAP solutions resource, a managed resource group and its components are automatically deployed. Managed resource group components include Azure Functions, Log Analytics, Azure Key Vault, and a storage account. This storage account holds certificates that are needed to enable secure communication with TLS 1.2 or later.

During the creation of providers in Azure Monitor for SAP solutions, you choose to enable or disable secure communication. If you enable it, you can then choose which type of certificate you want to use.

If you select a root certificate, you need to [verify that it comes from a Microsoft-supported CA](/security/trusted-root/participants-list). You can then continue to create the provider instance. Subsequent data in transit is encrypted through this root certificate.

If you select a server certificate, make sure that it's signed by a trusted CA. After you upload the certificate, it's stored in a storage account within the managed resource group in the Azure Monitor for SAP solutions resource. Subsequent data in transit is encrypted through this certificate.

> [!NOTE]
> Each provider type might have prerequisites that you must fulfill to enable secure communication.

## Next steps

- [Configure Azure Monitor for SAP solutions providers](provider-netweaver.md)
