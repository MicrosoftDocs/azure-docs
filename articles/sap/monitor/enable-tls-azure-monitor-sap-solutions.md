---
title: Enable TLS 1.2 or higher 
description: Learn what is secure communication with TLS 1.2 or higher in Azure Monitor for SAP solutions.
author: sameeksha91
ms.service: sap-on-azure
ms.subservice: sap-monitor
ms.topic: how-to
ms.date: 12/14/2022
ms.author: sakhare
#Customer intent: I am a SAP BASIS or cloud infrastructure team memever, i want to deploy Azure Monitor for SAP solutions with secure communication.
---

# Enable TLS 1.2 or higher in Azure Monitor for SAP solutions (preview)

[!INCLUDE [Azure Monitor for SAP solutions public preview notice](./includes/preview-azure-monitor.md)]

In this document, learn about secure communication with TLS 1.2 or higher in Azure Monitor for SAP solutions.

> [!NOTE]
> This section applies to only Azure Monitor for SAP solutions.

## Introduction
Azure Monitor for SAP solution resource and associated manager resource group components are deployed within Virtual Network in customers’ subscription. Azure Functions is one specific component in managed resource group. Azure Functions connects to appropriate SAP system using connection properties provided by customers, pulls required telemetry data and pushes it into Log Analytics.  

To ensure security, Azure Monitor for SAP solutions provides encryption of monitoring telemetry data in transit using approved cryptographic protocol and algorithms. This means traffic between Azure Functions and SAP systems are encrypted with TLS 1.2 or higher. By choosing this option the customer can enable secure communication.  
> [!NOTE]
> Enabling TLS 1.2 or higher for telemetry data in transit is an optional feature. Customer can choose to enable/disable this feature per their requirements. This option can be selected during creation of providers in Azure Monitor for SAP solutions.   

## Supported certificates
To enable secure communication in Azure Monitor for SAP solutions, customers can choose to use either **Root** certificate or upload **Server** certificate. 

> [!Important]
> Use of Root certificate is highly recommended. For root certificates, only Microsoft included CA certificates are supported. Please see list [here](/security/trusted-root/participants-list).

> [!Note]
> Certificates must be signed by a trusted root authority. Self-signed certificates are not supported.

## How does it work?
During deployment of Azure Monitor for SAP solutions resource, a managed resource group and its components are automatically deployed. Managed resource group components include Azure Functions. Log Analytics, Key Vault, and Storage account. This storage account is the place holder for certificates that are needed to enable secure communication with TLS 1.2 or higher.

During ‘create’ experience of provider instances in Azure Monitor for SAP Solutions, customers choose to enable or disable secure communication. If enable is selected, customers can then choose which type of certificate they want to use. The options are root certificate or server certificate.

If root certificate is selected, customers need to verify that CA authority is supported by Microsoft. See full list [here](/security/trusted-root/participants-list).  Once verified, customers can continue with provider instance creation. Subsequent data in transit is encrypted using this root certificate.

If server certificate is selected, customers need to upload the certificate signed by a trusted authority. Once uploaded, this certificate is stored in storage account within the managed resource group in Azure Monitor for SAP solutions resource. Subsequent data in transit is encrypted using this certificate. 

> [!Note]
> Enabling secure communication is highly recommended.

> [!Note]
> Please refer to the Provider configuration pages to learn about pre-requisites for each provider type, as needed. Pre-requisites must be fulfilled to enable secure communication.

## Next steps
> [Configure Azure Monitor for SAP solutions provider](provider-netweaver.md)
