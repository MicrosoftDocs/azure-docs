---
title: Cilium Enterprise on Azure Marketplace (Preview)
titleSuffix: Azure Kubernetes Service (AKS)
description: Learn about Cillium Enterprise on Azure Marketplace and how to deploy it on Azure. 
author: asudbring
ms.author: allensu
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
ms.topic: how-to
ms.date: 04/06/2023
ms.custom: template-how-to
---

# Cilium Enterprise on Azure Marketplace (Preview)

Cilium Enterprise on Azure Marketplace is a powerful tool for securing and managing Kubernetes’ workloads on Azure. Cilium Enterprise's range of features and easy deployment make it an ideal solution for organizations of all sizes looking to secure their cloud-native applications. 

Cilium Enterprise is a network security platform for modern cloud-native workloads that provides visibility, security, and compliance across Kubernetes clusters. It uses eBPF technology to deliver network and application-layer security, while also providing observability and tracing for Kubernetes workloads. Azure Marketplace is an online store for buying and selling cloud computing solutions that allows you to deploy Cilium Enterprise to Azure with ease. 

### Features

Cilium Enterprise on Azure Marketplace provides a range of features that help secure and manage Kubernetes’ workloads, including:

* **Network and Application Security**: Cilium Enterprise uses eBPF technology to provide network and application-layer security for Kubernetes workloads. It allows you to enforce policies at the network and application layers, and also provides visibility into the network traffic and application behavior. 

* **Compliance and Auditing**: Cilium Enterprise on Azure Marketplace provides compliance and auditing features that help ensure that your Kubernetes workloads are secure and compliant with industry and organizational standards.

* **Observability and Tracing**: Cilium Enterprise on Azure Marketplace provides observability and tracing features that help you monitor and troubleshoot your Kubernetes workloads. It allows you to trace network traffic and application behavior, and also provides real-time visibility into the performance of your workloads.

* **Integration with other services**: Cilium Enterprise integrates with Azure services such as Azure Kubernetes Service (AKS) and Azure Container Instances (ACI), allowing you to secure and manage your Kubernetes workloads on Azure. Cilium Enterprise also provides seamless integration with popular Kubernetes platforms and tools, including Istio, Helm, and more, thereby making it a trusted offering among organizations.

* **Multi-cluster support**: With Cilium Enterprise, you can easily manage and secure multiple Kubernetes clusters across your organization. This includes support for hybrid and multi-cloud environments.

* **Enterprise-grade support**: Cilium Enterprise includes enterprise-grade support from the Cilium team, including 24/7 support and access to patches and updates.

### Benefits

The benefits of using Cilium Enterprise on Azure Marketplace include:

* **Easy deployment**: You can deploy Cilium Enterprise on Azure with just a few clicks from the Azure Marketplace, making it easy to get started with Kubernetes security. You can either create a new AKS cluster or upgrade an existing AKS cluster running Azure CNI powered by Cilium with Cilium Enterprise package.

* **Scalability**: Cilium Enterprise is designed to scale with your Kubernetes workloads, providing security and observability for large scale Kubernetes clusters.

* **Enhanced security**: Cilium Enterprise provides enhanced security features that help protect your Kubernetes workloads from network and application-layer attacks.

* **Compliance and auditing**: Cilium Enterprise provides compliance and auditing features that help ensure that your Kubernetes workloads are secure and compliant with industry and organizational standards.

* Azure Marketplace provides a unified billing and integrated experience for your Cilium Enterprise usage. In addition, customers can benefit from limited management overhead while driving productivity for enterprise at scale.

* Configurable auto upgrades of the enterprise package version updates. Integrated upgrade from Cilium OSS -> Isovalent Enterprise images with no downtime. 

## Prerequisites

# [**Portal**](#tab/cilium-enterprise-portal)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing Azure Kubernetes Service (AKS) cluster running Azure CNI powered by Cilium. If you don't have an existing AKS cluster, you can create one from the Azure portal. For more information, see [Configure Azure CNI Powered by Cilium in Azure Kubernetes Service (AKS) (Preview)](azure-cni-powered-by-cilium.md).

# [**Powershell**](#tab/cilium-enterprise-powershell)

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing Azure Kubernetes Service (AKS) cluster running Azure CNI powered by Cilium. If you don't have an existing AKS cluster, you can create one from the Azure portal. For more information, see [Configure Azure CNI Powered by Cilium in Azure Kubernetes Service (AKS) (Preview)](azure-cni-powered-by-cilium.md).

- Azure PowerShell installed locally or Azure Cloud Shell.

- Sign in to Azure PowerShell and ensure you've selected the subscription with which you want to use this feature.  For more information, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

- Ensure your `Az.Network` module is 4.3.0 or later. To verify the installed module, use the command `Get-InstalledModule -Name Az.Network`. If the module requires an update, use the command `Update-Module -Name Az.Network` if necessary.

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

# [**CLI**](#tab/cilium-enterprise-cli)

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing Azure Kubernetes Service (AKS) cluster running Azure CNI powered by Cilium. If you don't have an existing AKS cluster, you can create one from the Azure portal. For more information, see [Configure Azure CNI Powered by Cilium in Azure Kubernetes Service (AKS) (Preview)](azure-cni-powered-by-cilium.md).

- This tutorial requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

## Deploy Cilium Enterprise on Azure Marketplace

Cilium Enterprise on Azure Marketplace can be deployed in the Azure portal, using Azure PowerShell, or using the Azure CLI.

# [**Portal**](#tab/cilium-enterprise-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the search box at the top of the portal, enter **Cilium Enterprise** and select **Isovalent Cilium Enterprise** from the results.

1. In the **Basics** tab of **Create Isovalent Cilium Enterprise**, enter or select the following information:

| Setting | Value |
| --- | --- |
| **Project details** | |
| Subscription | Select your subscription |
| Resource group | Select **Create new** </br> Enter **test-rg** in **Name**. </br> Select **OK**. </br> Or, select an existing resource group that contains your AKS cluster. |
| **Instance details** | |
| Supported Regions | Select **West US 2**. |
| Create new dev cluster? | Leave the default of **No**. |

1. Select **Next: Cluster Details**.

1. Select your AKS cluster from the **AKS Cluster Name** dropdown.

1. Select **Review + create**.

1. Select **Create**.

# [**Powershell**](#tab/cilium-enterprise-powershell)



# [**CLI**](#tab/cilium-enterprise-cli)

---




## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->