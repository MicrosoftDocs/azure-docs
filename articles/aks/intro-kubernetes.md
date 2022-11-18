---
title: Introduction to Azure Kubernetes Service
description: Learn the features and benefits of Azure Kubernetes Service to deploy and manage container-based applications in Azure.
services: container-service
ms.topic: overview
ms.date: 02/24/2021
ms.custom: mvc, ignite-2022
---

# Azure Kubernetes Service

Azure Kubernetes Service (AKS) simplifies deploying a managed Kubernetes cluster in Azure by offloading the operational overhead to Azure. As a hosted Kubernetes service, Azure handles critical tasks, like health monitoring and maintenance. Since Kubernetes masters are managed by Azure, you only manage and maintain the agent nodes. Thus, AKS is free; you only pay for the agent nodes within your clusters, not for the masters.  

You can create an AKS cluster using:
* [The Azure CLI][aks-quickstart-cli]
* [The Azure portal][aks-quickstart-portal]
* [Azure PowerShell][aks-quickstart-powershell]
* Using template-driven deployment options, like [Azure Resource Manager templates][aks-quickstart-template], [Bicep](../azure-resource-manager/bicep/overview.md) and Terraform.

When you deploy an AKS cluster, the Kubernetes master and all nodes are deployed and configured for you. Advanced networking, Azure Active Directory (Azure AD) integration, monitoring, and other features can be configured during the deployment process.

For more information on Kubernetes basics, see [Kubernetes core concepts for AKS][concepts-clusters-workloads].

[!INCLUDE [azure-lighthouse-supported-service](../../includes/azure-lighthouse-supported-service.md)]
> AKS also supports Windows Server containers.

## Access, security, and monitoring

For improved security and management, AKS lets you integrate with Azure AD to:
* Use Kubernetes role-based access control (Kubernetes RBAC). 
* Monitor the health of your cluster and resources.

### Identity and security management

#### Kubernetes RBAC

To limit access to cluster resources, AKS supports [Kubernetes RBAC][kubernetes-rbac]. Kubernetes RBAC controls access and permissions to Kubernetes resources and namespaces.  

#### Azure AD

You can configure an AKS cluster to integrate with Azure AD. With Azure AD integration, you can set up Kubernetes access based on existing identity and group membership. Your existing Azure AD users and groups can be provided with an integrated sign-on experience and access to AKS resources.  

For more information on identity, see [Access and identity options for AKS][concepts-identity].

To secure your AKS clusters, see [Integrate Azure Active Directory with AKS][aks-aad].

### Integrated logging and monitoring

Azure Monitor for Container Health collects memory and processor performance metrics from containers, nodes, and controllers within your AKS cluster and deployed applications. You can review both container logs and [the Kubernetes master logs][aks-master-logs], which are:
* Stored in an Azure Log Analytics workspace.
* Available through the Azure portal, Azure CLI, or a REST endpoint.

For more information, see [Monitor Azure Kubernetes Service container health][container-health].

## Clusters and nodes

AKS nodes run on Azure virtual machines (VMs). With AKS nodes, you can connect storage to nodes and pods, upgrade cluster components, and use GPUs. AKS supports Kubernetes clusters that run multiple node pools to support mixed operating systems and Windows Server containers.  

For more information about Kubernetes cluster, node, and node pool capabilities, see [Kubernetes core concepts for AKS][concepts-clusters-workloads].

### Cluster node and pod scaling

As demand for resources change, the number of cluster nodes or pods that run your services automatically scales up or down. You can adjust both the horizontal pod autoscaler or the cluster autoscaler to adjust to demands and only run necessary resources.

For more information, see [Scale an Azure Kubernetes Service (AKS) cluster][aks-scale].

### Cluster node upgrades

AKS offers multiple Kubernetes versions. As new versions become available in AKS, you can upgrade your cluster using the Azure portal or Azure CLI. During the upgrade process, nodes are carefully cordoned and drained to minimize disruption to running applications.  

To learn more about lifecycle versions, see [Supported Kubernetes versions in AKS][aks-supported versions]. For steps on how to upgrade, see [Upgrade an Azure Kubernetes Service (AKS) cluster][aks-upgrade].

### GPU-enabled nodes

AKS supports the creation of GPU-enabled node pools. Azure currently provides single or multiple GPU-enabled VMs. GPU-enabled VMs are designed for compute-intensive, graphics-intensive, and visualization workloads.

For more information, see [Using GPUs on AKS][aks-gpu].

### Confidential computing nodes (public preview)

AKS supports the creation of Intel SGX-based, confidential computing node pools (DCSv2 VMs). Confidential computing nodes allow containers to run in a hardware-based, trusted execution environment (enclaves). Isolation between containers, combined with code integrity through attestation, can help with your defense-in-depth container security strategy. Confidential computing nodes support both confidential containers (existing Docker apps) and enclave-aware containers.

For more information, see [Confidential computing nodes on AKS][conf-com-node].

### Mariner nodes

Mariner is an open-source Linux distribution created by Microsoft, and it’s now available for preview as a container host on Azure Kubernetes Service (AKS). The Mariner container host provides reliability and consistency from cloud to edge across the AKS, AKS-HCI, and Arc products. You can deploy Mariner node pools in a new cluster, add Mariner node pools to your existing Ubuntu clusters, or migrate your Ubuntu nodes to Mariner nodes.

For more information, see [Use the Mariner container host on Azure Kubernetes Service (AKS)](use-mariner.md)

### Storage volume support

To support application workloads, you can mount static or dynamic storage volumes for persistent data. Depending on the number of connected pods expected to share the storage volumes, you can use storage backed by either:
* Azure Disks for single pod access, or 
* Azure Files for multiple, concurrent pod access.

For more information, see [Storage options for applications in AKS][concepts-storage].

Get started with dynamic persistent volumes using [Azure Disks][azure-disk] or [Azure Files][azure-files].

## Virtual networks and ingress

An AKS cluster can be deployed into an existing virtual network. In this configuration, every pod in the cluster is assigned an IP address in the virtual network, and can directly communicate with:
* Other pods in the cluster 
* Other nodes in the virtual network. 

Pods can also connect to other services in a peered virtual network and to on-premises networks over ExpressRoute or site-to-site (S2S) VPN connections.  

For more information, see the [Network concepts for applications in AKS][aks-networking].

### Ingress with HTTP application routing

The HTTP application routing add-on helps you easily access applications deployed to your AKS cluster. When enabled, the HTTP application routing solution configures an ingress controller in your AKS cluster.  

As applications are deployed, publicly accessible DNS names are autoconfigured. The HTTP application routing sets up a DNS zone and integrates it with the AKS cluster. You can then deploy Kubernetes ingress resources as normal.  

To get started with ingress traffic, see [HTTP application routing][aks-http-routing].

## Development tooling integration

Kubernetes has a rich ecosystem of development and management tools that work seamlessly with AKS. These tools include Helm and the Kubernetes extension for Visual Studio Code. 

Azure provides several tools that help streamline Kubernetes, such as DevOps Starter.  

### DevOps Starter

DevOps Starter provides a simple solution for bringing existing code and Git repositories into Azure. DevOps Starter automatically:
* Creates Azure resources (such as AKS); 
* Configures a release pipeline in Azure DevOps Services that includes a build pipeline for CI; 
* Sets up a release pipeline for CD; and, 
* Generates an Azure Application Insights resource for monitoring. 

For more information, see [DevOps Starter][azure-devops].

## Docker image support and private container registry

AKS supports the Docker image format. For private storage of your Docker images, you can integrate AKS with Azure Container Registry (ACR).

To create a private image store, see [Azure Container Registry][acr-docs].

## Kubernetes certification

AKS has been CNCF-certified as Kubernetes conformant.

## Regulatory compliance

AKS is compliant with SOC, ISO, PCI DSS, and HIPAA. For more information, see [Overview of Microsoft Azure compliance][compliance-doc].

## Next steps

Learn more about deploying and managing AKS with the Azure CLI Quickstart.

> [!div class="nextstepaction"]
> [Deploy an AKS Cluster using Azure CLI][aks-quickstart-cli]

<!-- LINKS - external -->
[kubectl-overview]: https://kubernetes.io/docs/user-guide/kubectl-overview/
[compliance-doc]: https://azure.microsoft.com/overview/trusted-cloud/compliance/

<!-- LINKS - internal -->
[acr-docs]: ../container-registry/container-registry-intro.md
[aks-aad]: ./azure-ad-integration-cli.md
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[aks-quickstart-template]: ./learn/quick-kubernetes-deploy-rm-template.md
[aks-gpu]: ./gpu-cluster.md
[aks-http-routing]: ./http-application-routing.md
[aks-networking]: ./concepts-network.md
[aks-scale]: ./tutorial-kubernetes-scale.md
[aks-upgrade]: ./upgrade-cluster.md
[azure-dev-spaces]: /previous-versions/azure/dev-spaces/
[azure-devops]: ../devops-project/overview.md
[azure-disk]: ./azure-disks-dynamic-pv.md
[azure-files]: ./azure-files-dynamic-pv.md
[container-health]: ../azure-monitor/containers/container-insights-overview.md
[aks-master-logs]: monitor-aks-reference.md#resource-logs
[aks-supported versions]: supported-kubernetes-versions.md
[concepts-clusters-workloads]: concepts-clusters-workloads.md
[kubernetes-rbac]: concepts-identity.md#kubernetes-rbac
[concepts-identity]: concepts-identity.md
[concepts-storage]: concepts-storage.md
[conf-com-node]: ../confidential-computing/confidential-nodes-aks-overview.md
