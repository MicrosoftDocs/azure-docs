---
title: Container security architecture
description: Learn about the architecture of Microsoft Defender for Containers for each container platform
author: dcurwin
ms.author: dacurwin
ms.topic: overview
ms.date: 01/10/2024
---

# Defender for Containers architecture

Defender for Containers is designed differently for each Kubernetes environment whether they're running in:

- **Azure Kubernetes Service (AKS)** - Microsoft's managed service for developing, deploying, and managing containerized applications.

- **Amazon Elastic Kubernetes Service (EKS) in a connected Amazon Web Services (AWS) account** - Amazon's managed service for running Kubernetes on AWS without needing to install, operate, and maintain your own Kubernetes control plane or nodes.

- **Google Kubernetes Engine (GKE) in a connected Google Cloud Platform (GCP) project** - Google’s managed environment for deploying, managing, and scaling applications using GCP infrastructure.

- **An unmanaged Kubernetes distribution** (using Azure Arc-enabled Kubernetes) - Cloud Native Computing Foundation (CNCF) certified Kubernetes clusters hosted on-premises or on IaaS.

> [!NOTE]
> Defender for Containers support for Arc-enabled Kubernetes clusters (AWS EKS and GCP GKE) is a preview feature.

To protect your Kubernetes containers, Defender for Containers receives and analyzes:

- Audit logs and security events from the API server
- Cluster configuration information from the control plane
- Workload configuration from Azure Policy
- Security signals and events from the node level

To learn more about implementation details such as supported operating systems, feature availability, outbound proxy, see [Defender for Containers feature availability](supported-machines-endpoint-solutions-clouds-containers.md).

## Architecture for each Kubernetes environment

## [**Azure (AKS)**](#tab/defender-for-container-arch-aks)

### Architecture diagram of Defender for Cloud and AKS clusters

When Defender for Cloud protects a cluster hosted in Azure Kubernetes Service, the collection of audit log data is agentless and collected automatically through Azure infrastructure with no additional cost or configuration considerations. These are the required components in order to receive the full protection offered by Microsoft Defender for Containers:

- **Defender sensor**: The DaemonSet that is deployed on each node, collects signals from hosts using [eBPF technology](https://ebpf.io/), and provides runtime protection. The sensor is registered with a Log Analytics workspace, and used as a data pipeline. However, the audit log data isn't stored in the Log Analytics workspace. The Defender sensor is deployed as an AKS Security profile.
- **Azure Policy for Kubernetes**:  A pod that extends the open-source [Gatekeeper v3](https://github.com/open-policy-agent/gatekeeper) and registers as a web hook to Kubernetes admission control making it possible to apply at-scale enforcements, and safeguards on your clusters in a centralized, consistent manner. The Azure Policy for Kubernetes pod is deployed as an AKS add-on. It's only installed on one node in the cluster. For more information, see [Protect your Kubernetes workloads](kubernetes-workload-protections.md) and [Understand Azure Policy for Kubernetes clusters](../governance/policy/concepts/policy-for-kubernetes.md).

:::image type="content" source="./media/defender-for-containers/architecture-aks-cluster.png" alt-text="Diagram of high-level architecture of the interaction between Microsoft Defender for Containers, Azure Kubernetes Service, and Azure Policy." lightbox="./media/defender-for-containers/architecture-aks-cluster.png":::

### Defender sensor component details

| Pod Name | Namespace | Kind | Short Description | Capabilities | Resource limits | Egress Required |
|--|--|--|--|--|--|--|
| microsoft-defender-collector-ds-* | kube-system | [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) | A set of containers that focus on collecting inventory and security events from the Kubernetes environment. | SYS_ADMIN, <br>SYS_RESOURCE, <br>SYS_PTRACE | memory: 296Mi<br> <br> cpu: 360m | No |
| microsoft-defender-collector-misc-* | kube-system | [Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) | A set of containers that focus on collecting inventory and security events from the Kubernetes environment that aren't bounded to a specific node. | N/A | memory: 64Mi <br> <br>cpu: 60m | No |
| microsoft-defender-publisher-ds-* | kube-system | [DaemonSet](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/) | Publish the collected data to Microsoft Defender for Containers backend service where the data will be processed for and analyzed. | N/A | memory: 200Mi <br> <br> cpu: 60m | Https 443 <br> <br> Learn more about the [outbound access prerequisites](../aks/outbound-rules-control-egress.md#microsoft-defender-for-containers) |

\* Resource limits aren't configurable; Learn more about [Kubernetes resources limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/#resource-units-in-kubernetes).

### How does agentless discovery for Kubernetes in Azure work?

The discovery process is based on snapshots taken at intervals:

:::image type="content" source="media/concept-agentless-containers/diagram-permissions-architecture.png" alt-text="Diagram of the permissions architecture." lightbox="media/concept-agentless-containers/diagram-permissions-architecture.png":::

When you enable the agentless discovery for Kubernetes extension, the following process occurs:

- **Create**:
  - If the extension is enabled from Defender CSPM, Defender for Cloud creates an identity in customer environments called `CloudPosture/securityOperator/DefenderCSPMSecurityOperator`.
  - If the extension is enabled from Defender for Containers, Defender for Cloud creates an identity in customer environments called `CloudPosture/securityOperator/DefenderForContainersSecurityOperator`.
- **Assign**: Defender for Cloud assigns a built-in role called **Kubernetes Agentless Operator** to that identity on subscription scope. The role contains the following permissions:

  - AKS read (Microsoft.ContainerService/managedClusters/read)
  - AKS Trusted Access with the following permissions:
  - Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/write
  - Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/read
  - Microsoft.ContainerService/managedClusters/trustedAccessRoleBindings/delete

   Learn more about [AKS Trusted Access](../aks/trusted-access-feature.md).

- **Discover**: Using the system assigned identity, Defender for Cloud performs a discovery of the AKS clusters in your environment using API calls to the API server of AKS.
- **Bind**: Upon discovery of an AKS cluster, Defender for Cloud performs an AKS bind operation by creating a `ClusterRoleBinding` between the created identity and the Kubernetes `ClusterRole` *aks:trustedaccessrole:defender-containers:microsoft-defender-operator*. The `ClusterRole` is visible via API and gives Defender for Cloud data plane read permission inside the cluster.

## [**On-premises / IaaS (Arc)**](#tab/defender-for-container-arch-arc)

### Architecture diagram of Defender for Cloud and Arc-enabled Kubernetes clusters

These components are required in order to receive the full protection offered by Microsoft Defender for Containers:

- **[Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md)** - Azure Arc-enabled Kubernetes - An sensor based solution, installed on one node in the cluster, that connects your clusters to Defender for Cloud. Defender for Cloud is then able to deploy the following two agents as [Arc extensions](../azure-arc/kubernetes/extensions.md):

- **Defender sensor**: The DaemonSet that is deployed on each node, collects host signals using [eBPF technology](https://ebpf.io/) and Kubernetes audit logs, to provide runtime protection. The sensor is registered with a Log Analytics workspace, and used as a data pipeline. However, the audit log data isn't stored in the Log Analytics workspace. The Defender sensor is deployed as an Arc-enabled Kubernetes extension.

- **Azure Policy for Kubernetes**: A pod that extends the open-source [Gatekeeper v3](https://github.com/open-policy-agent/gatekeeper) and registers as a web hook to Kubernetes admission control making it possible to apply at-scale enforcements, and safeguards on your clusters in a centralized, consistent manner. The Azure Policy for Kubernetes pod is deployed as an Arc-enabled Kubernetes extension. It's only installed on one node in the cluster. For more information, see [Protect your Kubernetes workloads](kubernetes-workload-protections.md) and [Understand Azure Policy for Kubernetes clusters](../governance/policy/concepts/policy-for-kubernetes.md).

> [!NOTE]
> Defender for Containers support for Arc-enabled Kubernetes clusters is a preview feature.

:::image type="content" source="./media/defender-for-containers/architecture-arc-cluster.png" alt-text="Diagram of high-level architecture of the interaction between Microsoft Defender for Containers, Azure Kubernetes Service, Azure Arc-enabled Kubernetes, and Azure Policy." lightbox="./media/defender-for-containers/architecture-arc-cluster.png":::

## [**AWS (EKS)**](#tab/defender-for-container-arch-eks)

### Architecture diagram of Defender for Cloud and EKS clusters

When Defender for Cloud protects a cluster hosted in Elastic Kubernetes Service, the collection of audit log data is agentless. These are the required components in order to receive the full protection offered by Microsoft Defender for Containers:

- **[Kubernetes audit logs](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/)** – [AWS account’s CloudWatch](https://aws.amazon.com/cloudwatch/) enables, and collects audit log data through an agentless collector, and sends the collected information to the Microsoft Defender for Cloud backend for further analysis.
- **[Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md)** - Azure Arc-enabled Kubernetes - A sensor based solution, installed on one node in the cluster, that connects your clusters to Defender for Cloud. Defender for Cloud is then able to deploy the following two agents as [Arc extensions](../azure-arc/kubernetes/extensions.md):
- **Defender sensor**: The DaemonSet that is deployed on each node, collects signals from hosts using [eBPF technology](https://ebpf.io/), and provides runtime protection. The sensor is registered with a Log Analytics workspace, and used as a data pipeline. However, the audit log data isn't stored in the Log Analytics workspace. The Defender sensor is deployed as an Arc-enabled Kubernetes extension.
- **Azure Policy for Kubernetes**:  A pod that extends the open-source [Gatekeeper v3](https://github.com/open-policy-agent/gatekeeper) and registers as a web hook to Kubernetes admission control making it possible to apply at-scale enforcements, and safeguards on your clusters in a centralized, consistent manner. The Azure Policy for Kubernetes pod is deployed as an Arc-enabled Kubernetes extension. It's only installed on one node in the cluster. For more information, see [Protect your Kubernetes workloads](kubernetes-workload-protections.md) and [Understand Azure Policy for Kubernetes clusters](../governance/policy/concepts/policy-for-kubernetes.md).

> [!NOTE]
> Defender for Containers support for AWS EKS clusters is a preview feature.

:::image type="content" source="./media/defender-for-containers/architecture-eks-cluster.png" alt-text="Diagram of high-level architecture of the interaction between Microsoft Defender for Containers, Amazon Web Services' EKS clusters, Azure Arc-enabled Kubernetes, and Azure Policy." lightbox="./media/defender-for-containers/architecture-eks-cluster.png":::

### How does agentless discovery for Kubernetes in AWS work?

The discovery process is based on snapshots taken at intervals:

When you enable the agentless discovery for Kubernetes extension, the following process occurs:

- **Create**:
  - The Defender for Cloud role *MDCContainersAgentlessDiscoveryK8sRole* must be added to the *aws-auth ConfigMap* of the EKS clusters. The name can be customized.

- **Assign**: Defender for Cloud assigns the *MDCContainersAgentlessDiscoveryK8sRole* role the following permissions:

  - `eks:UpdateClusterConfig`
  - `eks:DescribeCluster`

- **Discover**: Using the system assigned identity, Defender for Cloud performs a discovery of the EKS clusters in your environment using API calls to the API server of EKS.

## [**GCP (GKE)**](#tab/defender-for-container-gke)

### Architecture diagram of Defender for Cloud and GKE clusters

When Defender for Cloud protects a cluster hosted in Google Kubernetes Engine, the collection of audit log data is agentless. These are the required components in order to receive the full protection offered by Microsoft Defender for Containers:

- **[Kubernetes audit logs](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/)** – [GCP Cloud Logging](https://cloud.google.com/logging/) enables, and collects audit log data through an agentless collector, and sends the collected information to the Microsoft Defender for Cloud backend for further analysis.

- **[Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md)** - Azure Arc-enabled Kubernetes - A sensor based solution, installed on one node in the cluster, that connects your clusters to Defender for Cloud. Defender for Cloud is then able to deploy the following two agents as [Arc extensions](../azure-arc/kubernetes/extensions.md):
- **Defender sensor**: The DaemonSet that is deployed on each node, collects signals from hosts using [eBPF technology](https://ebpf.io/), and provides runtime protection. The sensor is registered with a Log Analytics workspace, and used as a data pipeline. However, the audit log data isn't stored in the Log Analytics workspace. The Defender sensor is deployed as an Arc-enabled Kubernetes extension.
- **Azure Policy for Kubernetes**:  A pod that extends the open-source [Gatekeeper v3](https://github.com/open-policy-agent/gatekeeper) and registers as a web hook to Kubernetes admission control making it possible to apply at-scale enforcements, and safeguards on your clusters in a centralized, consistent manner. The Azure Policy for Kubernetes pod is deployed as an Arc-enabled Kubernetes extension. It only needs to be installed on one node in the cluster. For more information, see [Protect your Kubernetes workloads](kubernetes-workload-protections.md) and [Understand Azure Policy for Kubernetes clusters](../governance/policy/concepts/policy-for-kubernetes.md).

> [!NOTE]
> Defender for Containers support for GCP GKE clusters is a preview feature.

:::image type="content" source="./media/defender-for-containers/architecture-gke.png" alt-text="Diagram of high-level architecture of the interaction between Microsoft Defender for Containers, Google GKE clusters, Azure Arc-enabled Kubernetes, and Azure Policy." lightbox="./media/defender-for-containers/architecture-gke.png":::

### How does agentless discovery for Kubernetes in GCP work?

The discovery process is based on snapshots taken at intervals:

When you enable the agentless discovery for Kubernetes extension, the following process occurs:

- **Create**:
  - The service account *mdc-containers-k8s-operator* is created. The name can be customized.

- **Assign**: Defender for Cloud attaches the following roles to the service account *mdc-containers-k8s-operator*:

  - The custom role `MDCGkeClusterWriteRole`, which has the `container.clusters.update` permission
  - The built-in role `container.viewer`

- **Discover**: Using the system assigned identity, Defender for Cloud performs a discovery of the GKE clusters in your environment using API calls to the API server of GKE.

---

## Next steps

In this overview, you learned about the architecture of container security in Microsoft Defender for Cloud. To enable the plan, see:

> [!div class="nextstepaction"]
> [Enable Defender for Containers](defender-for-containers-enable.md)
