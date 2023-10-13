---
title: Introduction to Azure Kubernetes Service
description: Learn the features and benefits of Azure Kubernetes Service to deploy and manage container-based applications in Azure.
ms.topic: overview
ms.custom: build-2023
ms.date: 05/02/2023
---

# What is Azure Kubernetes Service?

Azure Kubernetes Service (AKS) simplifies deploying a managed Kubernetes cluster in Azure by offloading the operational overhead to Azure. As a hosted Kubernetes service, Azure handles critical tasks, like health monitoring and maintenance. When you create an AKS cluster, a control plane is automatically created and configured. This control plane is provided at no cost as a managed Azure resource abstracted from the user. You only pay for and manage the nodes attached to the AKS cluster.

You can create an AKS cluster using:

* [Azure CLI][aks-quickstart-cli]
* [Azure PowerShell][aks-quickstart-powershell]
* [Azure portal][aks-quickstart-portal]
* Template-driven deployment options, like [Azure Resource Manager templates][aks-quickstart-template], [Bicep](../azure-resource-manager/bicep/overview.md), and Terraform.

When you deploy an AKS cluster, you specify the number and size of the nodes, and AKS deploys and configures the Kubernetes control plane and nodes. [Advanced networking][aks-networking], [Microsoft Entra integration][aad], [monitoring][aks-monitor], and other features can be configured during the deployment process.

For more information on Kubernetes basics, see [Kubernetes core concepts for AKS][concepts-clusters-workloads].

[!INCLUDE [azure-lighthouse-supported-service](../../includes/azure-lighthouse-supported-service.md)]

> [!NOTE]
> AKS also supports Windows Server containers.

## Access, security, and monitoring

For improved security and management, you can integrate with [Microsoft Entra ID][aad] to:

* Use Kubernetes role-based access control (Kubernetes RBAC).
* Monitor the health of your cluster and resources.

### Identity and security management

#### Kubernetes RBAC

To limit access to cluster resources, AKS supports [Kubernetes RBAC][kubernetes-rbac]. Kubernetes RBAC controls access and permissions to Kubernetes resources and namespaces.  

<a name='azure-ad'></a>

#### Microsoft Entra ID

You can configure an AKS cluster to integrate with Microsoft Entra ID. With Microsoft Entra integration, you can set up Kubernetes access based on existing identity and group membership. Your existing Microsoft Entra users and groups can be provided with an integrated sign-on experience and access to AKS resources.  

For more information on identity, see [Access and identity options for AKS][concepts-identity].

To secure your AKS clusters, see [Integrate Microsoft Entra ID with AKS][aks-aad].

### Integrated logging and monitoring

[Container Insights][container-insights] is a feature in [Azure Monitor][azure-monitor-overview] that monitors the health and performance of managed Kubernetes clusters hosted on AKS and provides interactive views and workbooks that analyze collected data for a variety of monitoring scenarios. It captures platform metrics and resource logs from containers, nodes, and controllers within your AKS clusters and deployed applications that are available in Kubernetes through the Metrics API.

Container Insights has native integration with AKS, like collecting critical metrics and logs, alerting on identified issues, and providing visualization with workbooks or integration with Grafana. It can also collect Prometheus metrics and send them to [Azure Monitor managed service for Prometheus][azure-monitor-managed-prometheus], and all together deliver end-to-end observability.

Logs from the AKS control plane components are collected separately in Azure as resource logs and sent to different locations, such as [Azure Monitor Logs][azure-monitor-logs]. For more information, see [Resource logs](monitor-aks-reference.md#resource-logs).

## Clusters and nodes

AKS nodes run on Azure virtual machines (VMs). With AKS nodes, you can connect storage to nodes and pods, upgrade cluster components, and use GPUs. AKS supports Kubernetes clusters that run multiple node pools to support mixed operating systems and Windows Server containers.  

For more information about Kubernetes cluster, node, and node pool capabilities, see [Kubernetes core concepts for AKS][concepts-clusters-workloads].

### Cluster node and pod scaling

As demand for resources change, the number of cluster nodes or pods that run your services automatically scales up or down. You can adjust both the horizontal pod autoscaler or the cluster autoscaler to adjust to demands and only run necessary resources.

For more information, see [Scale an AKS cluster][aks-scale].

### Cluster node upgrades

AKS offers multiple Kubernetes versions. As new versions become available in AKS, you can upgrade your cluster using the Azure portal, Azure CLI, or Azure PowerShell. During the upgrade process, nodes are carefully cordoned and drained to minimize disruption to running applications.  

To learn more about lifecycle versions, see [Supported Kubernetes versions in AKS][aks-supported versions]. For steps on how to upgrade, see [Upgrade an AKS cluster][aks-upgrade].

### GPU-enabled nodes

AKS supports the creation of GPU-enabled node pools. Azure currently provides single or multiple GPU-enabled VMs. GPU-enabled VMs are designed for compute-intensive, graphics-intensive, and visualization workloads.

For more information, see [Using GPUs on AKS][aks-gpu].

### Confidential computing nodes (public preview)

AKS supports the creation of Intel SGX-based, confidential computing node pools (DCSv2 VMs). Confidential computing nodes allow containers to run in a hardware-based, trusted execution environment (enclaves). Isolation between containers, combined with code integrity through attestation, can help with your defense-in-depth container security strategy. Confidential computing nodes support both confidential containers (existing Docker apps) and enclave-aware containers.

For more information, see [Confidential computing nodes on AKS][conf-com-node].

### Azure Linux nodes

The Azure Linux container host for AKS is an open-source Linux distribution created by Microsoft, and it’s available as a container host on Azure Kubernetes Service (AKS). The Azure Linux container host for AKS provides reliability and consistency from cloud to edge across the AKS, AKS-HCI, and Arc products. You can deploy Azure Linux node pools in a new cluster, add Azure Linux node pools to your existing Ubuntu clusters, or migrate your Ubuntu nodes to Azure Linux nodes.

For more information, see [Use the Azure Linux container host for AKS](use-azure-linux.md).

### Storage volume support

To support application workloads, you can mount static or dynamic storage volumes for persistent data. Depending on the number of connected pods expected to share the storage volumes, you can use storage backed by:

* [Azure Disks][azure-disk] for single pod access
* [Azure Files][azure-files] for multiple, concurrent pod access.

For more information, see [Storage options for applications in AKS][concepts-storage].

## Virtual networks and ingress

An AKS cluster can be deployed into an existing virtual network. In this configuration, every pod in the cluster is assigned an IP address in the virtual network and can directly communicate with other pods in the cluster and other nodes in the virtual network.

Pods can also connect to other services in a peered virtual network and on-premises networks over ExpressRoute or site-to-site (S2S) VPN connections.  

For more information, see the [Network concepts for applications in AKS][aks-networking].

### Ingress with HTTP application routing

The HTTP application routing add-on helps you easily access applications deployed to your AKS cluster. When enabled, the HTTP application routing solution configures an ingress controller in your AKS cluster.  

As applications are deployed, publicly accessible DNS names are auto-configured. The HTTP application routing sets up a DNS zone and integrates it with the AKS cluster. You can then deploy Kubernetes ingress resources as normal.  

To get started with Ingress traffic, see [HTTP application routing][aks-http-routing].

## Development tooling integration

Kubernetes has a rich ecosystem of development and management tools that work seamlessly with AKS. These tools include [Helm][helm] and the [Kubernetes extension for Visual Studio Code][k8s-extension].

Azure provides several tools that help streamline Kubernetes.  

## Docker image support and private container registry

AKS supports the Docker image format. For private storage of your Docker images, you can integrate AKS with Azure Container Registry (ACR).

To create a private image store, see [Azure Container Registry][acr-docs].

## Kubernetes certification

AKS has been [CNCF-certified][cncf-cert] as Kubernetes conformant.

## Regulatory compliance

AKS is compliant with SOC, ISO, PCI DSS, and HIPAA. For more information, see [Overview of Microsoft Azure compliance][compliance-doc].

## Next steps

Learn more about deploying and managing AKS.

> [!div class="nextstepaction"]
> [Cluster operator and developer best practices to build and manage applications on AKS][aks-best-practices]

<!-- LINKS - external -->
[compliance-doc]: https://azure.microsoft.com/overview/trusted-cloud/compliance/
[cncf-cert]: https://www.cncf.io/certification/software-conformance/
[k8s-extension]: https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools

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
[azure-devops]: ../devops-project/overview.md
[azure-disk]: ./azure-disk-csi.md
[azure-files]: ./azure-files-csi.md
[aks-master-logs]: monitor-aks-reference.md#resource-logs
[aks-supported versions]: supported-kubernetes-versions.md
[concepts-clusters-workloads]: concepts-clusters-workloads.md
[kubernetes-rbac]: concepts-identity.md#kubernetes-rbac
[concepts-identity]: concepts-identity.md
[concepts-storage]: concepts-storage.md
[conf-com-node]: ../confidential-computing/confidential-nodes-aks-overview.md
[aad]: managed-azure-ad.md
[aks-monitor]: monitor-aks.md
[azure-monitor-overview]: ../azure-monitor/overview.md
[container-insights]: ../azure-monitor/containers/container-insights-overview.md
[azure-monitor-managed-prometheus]: ../azure-monitor/essentials/prometheus-metrics-overview.md
[collect-resource-logs]: monitor-aks.md#resource-logs
[azure-monitor-logs]: ../azure-monitor/logs/data-platform-logs.md
[helm]: quickstart-helm.md
[aks-best-practices]: best-practices.md
