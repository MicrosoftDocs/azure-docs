---
title: Azure service layer threat detection - Azure Security Center
description: This topic presents the Azure service layer alerts available in Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 33c45447-3181-4b75-aa8e-c517e76cd50d
ms.service: security-center
ms.topic: conceptual
ms.date: 08/25/2019
ms.author: memildin
---

# Threat detection for the Azure service layer in Azure Security Center

This topic presents the Azure Security Center alerts available when monitoring the following Azure service layers:

* [Azure network layer](#network-layer)
* [Azure management layer (Azure Resource Manager) (Preview)](#management-layer)
* [Azure Key Vault](#azure-keyvault)

## Azure network layer<a name="network-layer"></a>

Security Center network-layer analytics are based on sample [IPFIX data](https://en.wikipedia.org/wiki/IP_Flow_Information_Export), which are packet headers collected by Azure core routers. Based on this data feed, Security Center uses machine learning models to identify and flag malicious traffic activities. Security Center also uses the Microsoft Threat Intelligence database to enrich IP addresses.

Some network configurations may restrict Security Center from generating alerts on suspicious network activity. For Security Center to generate network alerts, ensure that:

- Your virtual machine has a public IP address (or is on a load balancer with a public IP address).

- Your virtual machine's network egress traffic isn't blocked by an external IDS solution.

- Your virtual machine has been assigned the same IP address for the entire hour during which the suspicious communication occurred. This also applies to VMs created as part of a managed service (e.g. AKS, Databricks).

For a list of the Azure network layer alerts, see the [Reference table of alerts](alerts-reference.md#alerts-azurenetlayer).

For details of how Security Center can use network-related signals to apply threat protection, see [Heuristic DNS detections in  Security Center](https://azure.microsoft.com/blog/heuristic-dns-detections-in-azure-security-center/).


## Azure management layer (Azure Resource Manager) (Preview)<a name ="management-layer"></a>

Security Center's protection layer based on Azure Resource Manager is currently in preview.

Security Center offers an additional layer of protection by using Azure Resource Manager events, which is considered to be the control plane for Azure. By analyzing the Azure Resource Manager records, Security Center detects unusual or potentially harmful operations in the Azure subscription environment.

For a list of the Azure Resource Manager (Preview) alerts, see the [Reference table of alerts](alerts-reference.md#alerts-azureresourceman).



>[!NOTE]
> Several of the preceding analytics are powered by Microsoft Cloud App Security. To benefit from these analytics, you must activate a Cloud App Security license. If you have a Cloud App Security license, then these alerts are enabled by default. To disable them:
>
> 1. In the **Security Center** blade, select **Security policy**. For the subscription you want to change, select **Edit settings**.
> 2. Select **Threat detection**.
> 3. Under **Enable integrations**, clear **Allow Microsoft Cloud App Security to access my data**, and select **Save**.

>[!NOTE]
>Security Center stores security-related customer data in the same geo as its resource. If Microsoft hasn't yet deployed Security Center in the resource's geo, then it stores the data in the United States. When Cloud App Security is enabled, this information is stored in accordance with the geo location rules of Cloud App Security. For more information, see [Data storage for non-regional services](https://azuredatacentermap.azurewebsites.net/).

## Azure Key Vault (Preview)<a name="azure-keyvault"></a>

Azure Key Vault is a cloud service that safeguards encryption keys and secrets like certificates, connection strings, and passwords. 

Azure Security Center includes Azure-native, advanced threat protection for Azure Key Vault, providing an additional layer of security intelligence. Security Center detects unusual and potentially harmful attempts to access or exploit Key Vault accounts. This layer of protection allows you to address threats without being a security expert, and without the need to manage third-party security monitoring systems.  

When anomalous activities occur, Security Center shows alerts and optionally sends them via email to subscription administrators. These alerts include the details of the suspicious activity and recommendations on how to investigate and remediate threats. 

> [!NOTE]
> This service is not currently available in Azure government and sovereign cloud regions.

For a list of the Azure Key Vault alerts, see the [Reference table of alerts](alerts-reference.md#alerts-azurekv).
