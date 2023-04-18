---
title: Isovalent Cilium Enterprise on Azure Marketplace (Preview)
titleSuffix: Azure Kubernetes Service (AKS)
description: Learn about Isovalent Cillium Enterprise on Azure Marketplace and how to deploy it on Azure. 
author: asudbring
ms.author: allensu
ms.service: azure-kubernetes-service
ms.subservice: aks-networking
ms.topic: how-to
ms.date: 04/18/2023
ms.custom: template-how-to
---

# Isovalent Cilium Enterprise on Azure Marketplace (Preview)

Isovalent Cilium Enterprise on Azure Marketplace is a powerful tool for securing and managing Kubernetes’ workloads on Azure. Cilium Enterprise's range of features and easy deployment make it an ideal solution for organizations of all sizes looking to secure their cloud-native applications. 

Isovalent Cilium Enterprise is a network security platform for modern cloud-native workloads that provides visibility, security, and compliance across Kubernetes clusters. It uses eBPF technology to deliver network and application-layer security, while also providing observability and tracing for Kubernetes workloads. Azure Marketplace is an online store for buying and selling cloud computing solutions that allows you to deploy Isovalent Cilium Enterprise to Azure with ease. 

:::image type="content" source="./media/cilium-enterprise-marketplace/cilium-enterprise-diagram.png" alt-text="Diagram of Isovalent Cilium Enterprise.":::

> [!IMPORTANT]
> Isovalent Cilium Enterprise is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Designed for platform teams and using the power of eBPF, Isovalent Cilium Enterprise:

* Combines network and runtime behavior with Kubernetes identity to provide a single source of data for cloud native forensics, audit, compliance monitoring, and threat detection. Isovalent Cilium Enterprise is integrated into your SIEM/Log aggregation platform of choice.

* Scales effortlessly for any deployment size. With capabilities such as traffic management, load balancing, and infrastructure monitoring.

* Fully back-ported and tested. Available with 24x7 support.

* Enables self-service for monitoring, troubleshooting, and security workflows in Kubernetes. Teams can access current and historical views of flow data, metrics, and visualizations for their specific namespaces.

> [!NOTE]
> If you are upgrading an existing AKS cluster, then it must be created with Azure CNI powered by Cilium. For more information, see [Configure Azure CNI Powered by Cilium in Azure Kubernetes Service (AKS) (Preview)](azure-cni-powered-by-cilium.md).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An existing Azure Kubernetes Service (AKS) cluster running Azure CNI powered by Cilium. If you don't have an existing AKS cluster, you can create one from the Azure portal. For more information, see [Configure Azure CNI Powered by Cilium in Azure Kubernetes Service (AKS) (Preview)](azure-cni-powered-by-cilium.md).

## Deploy Isovalent Cilium Enterprise on Azure Marketplace

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

Azure deploys Isovalent Cilium Enterprise to your selected subscription and resource group. This process may take some time and must be completed. 

> [!IMPORTANT]
> Note that Marketplace applications are deployed as AKS extensions onto AKS clusters. If you are upgrading the existing AKS cluster, AKS replaces the Cilium OSS images with Isovalent Cilium Enterprise images seamlessly without any downtime. 

When the deployment is complete, you can access the Isovalent Cilium Enterprise by navigating to the resource group that contains the **Cilium Enterprise** resource in the Azure portal.

Cilium can be reconfigured after deployment by updating the Helm values with Azure CLI:

```azurecli
az k8s-extension update -c <cluster> -t managedClusters -g <region> -n cilium --configuration-settings debug.enabled=true
```

You can uninstall an Isovalent Cilium Enterprise offer using the AKS extension delete command. Uninstall flow per AKS Cluster isn't added in Marketplace yet until ISV’s stop sell the whole offer. For more information about AKS extension delete, see [az k8s-extension delete](/cli/azure/k8s-extension#az-k8s-extension-delete).

## Next steps

- [Configure Azure CNI Powered by Cilium in Azure Kubernetes Service (AKS) (Preview)](azure-cni-powered-by-cilium.md)

- [What is Azure Kubernetes Service?](intro-kubernetes.md)