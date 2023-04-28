---
title: Plan for network isolation
titleSuffix: Azure Machine Learning
description: Demystify Azure Machine Learning network isolation with recommendations and automation templates
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.reviewer: larryfr
ms.author: jhirono
author: jhirono
ms.date: 02/14/2023
ms.topic: how-to
ms.custom: 
---

# Plan for network isolation

In this article, you learn how to plan your network isolation for Azure Machine Learning and our recommendations. This is a document for IT administrators who want to design network architecture.

## Key considerations

### Azure Machine Learning has both IaaS and PaaS resources

Azure Machine Learning's network isolation involves both Platform as a Service (PaaS) and Infrastructure as a Service (IaaS) components. PaaS services, such as the Azure Machine Learning workspace, storage, key vault, container registry, and monitor, can be isolated using Private Link. IaaS computing services, such as compute instances/clusters for AI model training, and Azure Kubernetes Service (AKS) or managed online endpoints for AI model scoring, can be injected into your virtual network and communicate with PaaS services using Private Link. The following diagram is an example of this architecture.

:::image type="content" source="media/how-to-network-isolation-planning/iaas-paas-network-diagram.png" alt-text="Diagram of IaaS and PaaS components.":::

In this diagram, the compute instances, compute clusters, and AKS Clusters are located within your virtual network. They can access the Azure Machine Learning workspace or storage using a private endpoint. Instead of a private endpoint, you can use a service endpoint for Azure Storage and Azure Key Vault. The other services don't support service endpoint.

### Required inbound and outbound configurations

Azure Machine Learning has [several required inbound and outbound configurations](how-to-access-azureml-behind-firewall.md) with your virtual network. If you have a standalone virtual network, the configuration is straightforward using network security group. However, you may have a hub-spoke or mesh network architecture, firewall, network virtual appliance, proxy, and user defined routing. In either case, make sure to allow inbound and outbound with your network security components.

:::image type="content" source="media/how-to-network-isolation-planning/hub-spoke-network-diagram.png" alt-text="Diagram of hub-spoke network with outbound through firewall.":::

In this diagram, you have a hub and spoke network architecture. The spoke VNet has resources for Azure Machine Learning. The hub VNet has a firewall that control internet outbound from your virtual networks. In this case, your firewall must allow outbound to required resources and your compute resources in spoke VNet must be able to reach your firewall.

> [!TIP]
> In the diagram, the compute instance and compute cluster are configured for no public IP. If you instead use a compute instance or cluster __with public IP__, you need to allow inbound from the Azure Machine Learning service tag using a Network Security Group (NSG) and user defined routing to skip your firewall. This inbound traffic would be from a Microsoft service (Azure Machine Learning). However, we recommend using the no public IP option to remove this inbound requirement.

### DNS resolution of private link resources and application on compute instance

If you have your own DNS server hosted in Azure or on-premises, you need to create a conditional forwarder in your DNS server. The conditional forwarder sends DNS requests to the Azure DNS for all private link enabled PaaS services. For more information, see the [DNS configuration scenarios](/azure/private-link/private-endpoint-dns#dns-configuration-scenarios) and [Azure Machine Learning specific DNS configuration](how-to-custom-dns.md) articles.

### Data exfiltration protection

We have two types of outbound; read only and read/write. Read only outbound can't be exploited by malicious actors but read/write outbound can be. Azure Storage and Azure Frontdoor (the `frontdoor.frontend` service tag) are read/write outbound in our case. 

You can mitigate this data exfiltration risk using [our data exfiltration prevention solution](how-to-prevent-data-loss-exfiltration.md). We use a service endpoint policy with an Azure Machine Learning alias to allow outbound to only Azure Machine Learning managed storage accounts. You don't need to open outbound to Storage on your firewall.

:::image type="content" source="media/how-to-network-isolation-planning/data-exfiltration-protection-diagram.png" alt-text="Diagram of network with exfiltration protection configuration.":::

In this diagram, the compute instance and cluster need to access Azure Machine Learning managed storage accounts to get set-up scripts. Instead of opening the outbound to storage, you can use service endpoint policy with Azure Machine Learning alias to allow the storage access only to Azure Machine Learning storage accounts.

The following tables list the required outbound [Azure Service Tags](/azure/virtual-network/service-tags-overview) and fully qualified domain names (FQDN) with data exfiltration protection setting:

| Outbound service tag | Protocol | Port |
| ---- | ---- | ---- |
| `AzureActiveDirectory` | TCP | 80, 443 |
| `AzureResourceManager` | TCP | 443 |
| `AzureMachineLearning` | UDP | 5831 |
| `BatchNodeManagement` | TCP | 443 |

| Outbound FQDN | Protocol | Port |
| ---- | ---- | ---- |
| `mcr.microsoft.com` | TCP | 443 |
| `*.data.mcr.microsoft.com` | TCP | 443 |
| `ml.azure.com` | TCP | 443 |
| `automlresources-prod.azureedge.net` | TCP | 443 |

### Managed online endpoint

Azure Machine Learning managed online endpoint uses Azure Machine Learning managed VNet, instead of using your VNet. If you want to disallow public access to your endpoint, set the `public_network_access` flag to disabled. When this flag is disabled, your endpoint can be accessed via the private endpoint of your workspace, and it can't be reached from public networks. If you want to use a private storage account for your deployment, set the `egress_public_network_access` flag disabled. It automatically creates private endpoints to access your private resources. 

> [!TIP]
> The workspace default storage account is the only private storage account supported by managed online endpoint. 

:::image type="content" source="media/how-to-secure-online-endpoint/endpoint-network-isolation-ingress-egress.png" alt-text="Diagram of managed online endpoint configuration in a VNet.":::

For more information, see the [Network isolation of managed online endpoints](how-to-secure-online-endpoint.md) article.

### Private IP address shortage in your main network

Azure Machine Learning requires private IPs; one IP per compute instance, compute cluster node, and private endpoint. You also need many IPs if you use AKS. Your hub-spoke network connected with your on-premises network might not have a large enough private IP address space. In this scenario, you can use isolated, not-peered VNets for your Azure Machine Learning resources.

:::image type="content" source="media/how-to-network-isolation-planning/isolated-not-peered-network-diagram.png" alt-text="Diagram of networks connected by private endpoints instead of peering.":::

In this diagram, your main VNet requires the IPs for private endpoints. You can have hub-spoke VNets for multiple Azure Machine Learning workspaces with large address spaces. A downside of this architecture is to double the number of private endpoints.

### Network policy enforcement
You can use [built-in policies](how-to-integrate-azure-policy.md) if you want to control network isolation parameters with self-service workspace and computing resources creation.

### Other considerations

#### Image build compute setting for ACR behind VNet

If you put your Azure container registry (ACR) behind your private endpoint, your ACR can't build your docker images. You need to use compute instance or compute cluster to build images. For more information, see the [how to set image build compute](how-to-secure-workspace-vnet.md#enable-azure-container-registry-acr) article.

#### Enablement of studio UI with private link enabled workspace

If you plan on using the Azure Machine Learning studio, there are extra configuration steps that are needed. These steps are to preventing any data exfiltration scenarios. For more information, see the [how to use Azure Machine Learning studio in an Azure virtual network](how-to-enable-studio-virtual-network.md) article.

<!-- ### Registry -->

## Recommended architecture

The following diagram is our recommended architecture to make all resources private but allow outbound internet access from your VNet. This diagram describes the following architecture:
* Put all resources in the same region.
* A hub VNet, which contains your firewall.
* A spoke VNet, which contains the following resources:
    * A training subnet contains compute instances and clusters used for training ML models. These resources are configured for no public IP.
    * A scoring subnet contains an AKS cluster.
    * A 'pe' subnet contains private endpoints that connect to the workspace and private resources used by the workspace (storage, key vault, container registry, etc.)
* Managed online endpoints use the private endpoint of the workspace to process incoming requests. A private endpoint is also used to allow managed online endpoint deployments to access private storage.

This architecture balances your network security and your ML engineers' productivity.

:::image type="content" source="media/how-to-network-isolation-planning/recommended-network-diagram.png" alt-text="Diagram of the recommended network architecture.":::

You can automate this environments creation using [a template](tutorial-create-secure-workspace-template.md) without managed online endpoint or AKS. Managed online endpoint is the solution if you don't have an existing AKS cluster for your AI model scoring. See [how to secure online endpoint](how-to-secure-online-endpoint.md) documentation for more info. AKS with Azure Machine Learning extension is the solution if you have an existing AKS cluster for your AI model scoring. See [how to attach kubernetes](how-to-attach-kubernetes-anywhere.md) documentation for more info.

### Removing firewall requirement

If you want to remove the firewall requirement, you can use network security groups and [Azure virtual network NAT](/azure/virtual-network/nat-gateway/nat-overview) to allow internet outbound from your private computing resources.

:::image type="content" source="media/how-to-network-isolation-planning/recommended-network-diagram-no-firewall.png" alt-text="Diagram of the recommended network architecture without a firewall.":::

### Using public workspace

You can use a public workspace if you're OK with Azure AD authentication and authorization with conditional access. A public workspace has some features to show data in your private storage account and we recommend using private workspace.

## Recommended architecture with data exfiltration prevention

This diagram shows the recommended architecture to make all resources private and control outbound destinations to prevent data exfiltration. We recommend this architecture when using Azure Machine Learning with your sensitive data in production. This diagram describes the following architecture:
* Put all resources in the same region.
* A hub VNet, which contains your firewall.
    * In addition to service tags, the firewall uses FQDNs to prevent data exfiltration.
* A spoke VNet, which contains the following resources:
    * A training subnet contains compute instances and clusters used for training ML models. These resources are configured for no public IP. Additionally, a service endpoint and service endpoint policy are in place to prevent data exfiltration.
    * A scoring subnet contains an AKS cluster.
    * A 'pe' subnet contains private endpoints that connect to the workspace and private resources used by the workspace (storage, key vault, container registry, etc.)
* Managed online endpoints use the private endpoint of the workspace to process incoming requests. A private endpoint is also used to allow managed online endpoint deployments to access private storage.

:::image type="content" source="media/how-to-network-isolation-planning/recommended-network-data-exfiltration.png" alt-text="Diagram of recommended network with data exfiltration protection configuration.":::

The following tables list the required outbound [Azure Service Tags](/azure/virtual-network/service-tags-overview) and fully qualified domain names (FQDN) with data exfiltration protection setting:

| Outbound service tag | Protocol | Port |
| ---- | ----- | ---- |
| `AzureActiveDirectory` | TCP | 80, 443 |
| `AzureResourceManager` | TCP | 443 |
| `AzureMachineLearning` | UDP | 5831 |
| `BatchNodeManagement` | TCP | 443 |

| Outbound FQDN | Protocol | Port |
| ---- | ---- | ---- |
| `mcr.microsoft.com` | TCP | 443 |
| `*.data.mcr.microsoft.com` | TCP | 443 |
| `ml.azure.com` | TCP | 443 |
| `automlresources-prod.azureedge.net` | TCP | 443 |

### Using public workspace

You can use the public workspace if you're OK with Azure AD authentication and authorization with conditional access. A public workspace has some features to show data in your private storage account and we recommend using private workspace.

## Next steps

* [Virtual network overview](how-to-network-security-overview.md)
* [Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Secure the training environment](how-to-secure-training-vnet.md)
* [Secure the inference environment](how-to-secure-inferencing-vnet.md)
* [Enable studio functionality](how-to-enable-studio-virtual-network.md)
* [Configure inbound and outbound network traffic](how-to-access-azureml-behind-firewall.md)
* [Use custom DNS](how-to-custom-dns.md)
