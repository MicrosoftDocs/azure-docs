---
title: Support policies for Azure Kubernetes Service (AKS)
description: Learn about Azure Kubernetes Service (AKS) support policies, shared responsibility, and features that are in preview (or alpha or beta).
ms.topic: article
ms.date: 08/28/2023

#Customer intent: As a cluster operator or developer, I want to understand what AKS components I need to manage, what components are managed by Microsoft (including security patches), and networking and preview features.
---

# Support policies for Azure Kubernetes Service

This article describes technical support policies and limitations for Azure Kubernetes Service (AKS). It also details agent node management, managed control plane components, third-party open-source components, and security or patch management.

## Service updates and releases

* For release information, see [AKS release notes](https://github.com/Azure/AKS/releases).
* For information on preview features, see the [AKS roadmap](https://github.com/Azure/AKS/projects/1).

## Managed features in AKS

Base infrastructure as a service (IaaS) cloud components, such as compute or networking components, allow you access to low-level controls and customization options. By contrast, AKS provides a turnkey Kubernetes deployment that gives you a common set of configurations and capabilities you need for your cluster. As an AKS user, you have limited customization and deployment options. In exchange, you don't need to worry about or manage Kubernetes clusters directly.

With AKS, you get a fully managed *control plane*. The control plane contains all of the components and services you need to operate and deliver Kubernetes clusters to end users. Microsoft maintains and operates all Kubernetes components.

Microsoft manages and monitors the following components through the control plane:

* Kubelet or Kubernetes API servers
* Etcd or a compatible key-value store, providing Quality of Service (QoS), scalability, and runtime
* DNS services (for example, kube-dns or CoreDNS)
* Kubernetes proxy or networking, except when [BYOCNI](use-byo-cni.md) is used
* Any other [add-ons][add-ons] or system component running in the kube-system namespace.

AKS isn't a Platform-as-a-Service (PaaS) solution. Some components, such as agent nodes, have *shared responsibility*, where you must help maintain the AKS cluster. User input is required, for example, to apply an agent node operating system (OS) security patch.

The services are *managed* in the sense that Microsoft and the AKS team deploys, operates, and is responsible for service availability and functionality. Customers can't alter these managed components. Microsoft limits customization to ensure a consistent and scalable user experience.

## Shared responsibility

When a cluster is created, you define the Kubernetes agent nodes that AKS creates. Your workloads are executed on these nodes.

Because your agent nodes execute private code and store sensitive data, Microsoft Support can access them only in a limited way. Microsoft Support can't sign in to, execute commands in, or view logs for these nodes without your express permission or assistance.

Any modification made directly to the agent nodes using any one of the IaaS APIs renders the cluster unsupportable. Any modification applied to the agent nodes must be done using kubernetes-native mechanisms such as `Daemon Sets`.

Similarly, while you may add any metadata to the cluster and nodes, such as tags and labels, changing any of the system created metadata renders the cluster unsupported.

## AKS support coverage

Microsoft provides technical support for the following examples:

* Connectivity to all Kubernetes components that the Kubernetes service provides and supports, such as the API server.
* Management, uptime, QoS, and operations of Kubernetes control plane services (For example, Kubernetes control plane, API server, etcd, and coreDNS).
* Etcd data store. Support includes automated, transparent backups of all etcd data every 30 minutes for disaster planning and cluster state restoration. These backups aren't directly available to you or anyone else. They ensure data reliability and consistency. On-demand rollback or restore is not supported as a feature.
* Any integration points in the Azure cloud provider driver for Kubernetes. These include integrations into other Azure services such as load balancers, persistent volumes, or networking (Kubernetes and Azure CNI, except when [BYOCNI](use-byo-cni.md) is in use).
* Questions or issues about customization of control plane components such as the Kubernetes API server, etcd, and coreDNS.
* Issues about networking, such as Azure CNI, kubenet, or other network access and functionality issues, except when [BYOCNI](use-byo-cni.md) is in use. Issues could include DNS resolution, packet loss, routing, and so on. Microsoft supports various networking scenarios:
  * Kubenet and Azure CNI using managed VNETs or with custom (bring your own) subnets.
  * Connectivity to other Azure services and applications
  * Ingress controllers and ingress or load balancer configurations
  * Network performance and latency
  * [Network policies](use-network-policies.md#differences-between-azure-network-policy-manager-and-calico-network-policy-and-their-capabilities)

> [!NOTE]
> Any cluster actions taken by Microsoft/AKS are made with your consent under a built-in Kubernetes role `aks-service` and built-in role binding `aks-service-rolebinding`. This role enables AKS to troubleshoot and diagnose cluster issues, but can't modify permissions nor create roles or role bindings, or other high privilege actions. Role access is only enabled under active support tickets with just-in-time (JIT) access.

Microsoft doesn't provide technical support for the following scenarios:

* Questions about how to use Kubernetes. For example, Microsoft Support doesn't provide advice on how to create custom ingress controllers, use application workloads, or apply third-party or open-source software packages or tools.

  > [!NOTE]
  > Microsoft Support can advise on AKS cluster functionality, customization, and tuning (for example, Kubernetes operations issues and procedures).

* Third-party open-source projects that aren't provided as part of the Kubernetes control plane or deployed with AKS clusters. These projects might include Istio, Helm, Envoy, or others.

  > [!NOTE]
  > Microsoft can provide best-effort support for third-party open-source projects such as Helm. Where the third-party open-source tool integrates with the Kubernetes Azure cloud provider or other AKS-specific bugs, Microsoft supports examples and applications from Microsoft documentation.

* Third-party closed-source software. This software can include security scanning tools and networking devices or software.
* Network customizations other than the ones listed in the [AKS documentation](./index.yml).
* Custom or third-party CNI plugins used in [BYOCNI](use-byo-cni.md) mode.
* Stand-by and proactive scenarios. Microsoft Support provides reactive support to help solve active issues in a timely and professional manner. However, standby or proactive support to help you eliminate operational risks, increase availability, and optimize performance are not covered. [Eligible customers](https://www.microsoft.com/unifiedsupport) can contact their account team to get nominated for [Azure Event Management service](https://devblogs.microsoft.com/premier-developer/proactively-plan-for-your-critical-event-in-azure-with-enhanced-support-and-engineering-services/). It's a paid service delivered by Microsoft support engineers that includes a proactive solution risk assessment and coverage during the event.

## AKS support coverage for agent nodes

### Microsoft responsibilities for AKS agent nodes

Microsoft and you share responsibility for Kubernetes agent nodes where:

* The base OS image has required additions (such as monitoring and networking agents).
* The agent nodes receive OS patches automatically.
* Issues with the Kubernetes control plane components that run on the agent nodes are automatically remediated. These components include the below:
  * `Kube-proxy`
  * Networking tunnels that provide communication paths to the Kubernetes master components
  * `Kubelet`
  * `containerd`

> [!NOTE]
> If an agent node is not operational, AKS might restart individual components or the entire agent node. These restart operations are automated and provide auto-remediation for common issues. If you want to know more about the auto-remediation mechanisms, see [Node Auto-Repair](node-auto-repair.md)

### Customer responsibilities for AKS agent nodes

Microsoft provides patches and new images for your image nodes weekly, but doesn't automatically patch them by default. To keep your agent node OS and runtime components patched, you should keep a regular [node image upgrade](node-image-upgrade.md) schedule or automate it.

Similarly, AKS regularly releases new kubernetes patches and minor versions. These updates can contain security or functionality improvements to Kubernetes. You're responsible to keep your clusters' kubernetes version updated and according to the [AKS Kubernetes Support Version Policy](supported-kubernetes-versions.md).

#### User customization of agent nodes

> [!NOTE]
> AKS agent nodes appear in the Azure portal as standard Azure IaaS resources. However, these virtual machines are deployed into a custom Azure resource group (prefixed with MC_\*). You cannot change the base OS image or make any direct customizations to these nodes using the IaaS APIs or resources. Any custom changes that are not performed from the AKS API won't persist through an upgrade, scale, update or reboot. Also, any change to the nodes' extensions like the **CustomScriptExtension** can lead to unexpected behavior and should be prohibited.
> Avoid performing changes to the agent nodes unless Microsoft Support directs you to make changes.

AKS manages the lifecycle and operations of agent nodes on your behalf and modifying the IaaS resources associated with the agent nodes is **not supported**. An example of an unsupported operation is customizing a node pool virtual machine scale set by manually changing configurations in the Azure portal or from the API.

For workload-specific configurations or packages, AKS recommends using [Kubernetes `daemon sets`](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/).

Using Kubernetes privileged `daemon sets` and init containers enables you to tune/modify or install third party software on cluster agent nodes. Examples of such customizations include adding custom security scanning software or updating sysctl settings.

While this path is recommended if the above requirements apply, AKS engineering and support cannot help troubleshoot or diagnose modifications that render the node unavailable due to a custom deployed `daemon set`.

### Security issues and patching

If a security flaw is found in one or more of the managed components of AKS, the AKS team patches all affected clusters to mitigate the issue. Alternatively, the AKS team provides you with upgrade guidance.

For agent nodes affected by a security flaw, Microsoft notifies you with details on the impact and the steps to fix or mitigate the security issue.

### Node maintenance and access

Although you can sign in to and change agent nodes, doing this operation is discouraged because changes can make a cluster unsupportable.

## Network ports, access, and NSGs

You may only customize the NSGs on custom subnets. You may not customize NSGs on managed subnets or at the NIC level of the agent nodes. AKS has egress requirements to specific endpoints, to control egress and ensure the necessary connectivity, see [limit egress traffic](limit-egress-traffic.md). For ingress, the requirements are based on the applications you have deployed to cluster.

## Stopped, deallocated, and Not Ready nodes

If you do not need your AKS workloads to run continuously, you can [stop the AKS cluster](start-stop-cluster.md#stop-an-aks-cluster), which stops all nodepools and the control plane. You can start it again when needed. When you stop a cluster using the `az aks stop` command, the cluster state is preserved for up to 12 months. After 12 months, the cluster state and all of its resources are deleted.

Manually deallocating all cluster nodes from the IaaS APIs, the Azure CLI, or the Azure portal isn't supported to stop an AKS cluster or nodepool. The cluster will be considered out of support and stopped by AKS after 30 days. The clusters are then subject to the same 12 month preservation policy as a correctly stopped cluster.

Clusters with zero **Ready** nodes (or all **Not Ready**) and zero **Running** VMs will be stopped after 30 days.

AKS reserves the right to archive control planes that have been configured out of support guidelines for extended periods equal to and beyond 30 days. AKS maintains backups of cluster etcd metadata and can readily reallocate the cluster. This reallocation is initiated by any PUT operation bringing the cluster back into support, such as an upgrade or scale to active agent nodes.

All clusters in a suspended subscription will be stopped immediately and deleted after 90 days. All clusters in a deleted subscription will be deleted immediately. 

## Unsupported alpha and beta Kubernetes features

AKS only supports stable and beta features within the upstream Kubernetes project. Unless otherwise documented, AKS doesn't support any alpha feature that is available in the upstream Kubernetes project.

## Preview features or feature flags

For features and functionality that requires extended testing and user feedback, Microsoft releases new preview features or features behind a feature flag. Consider these features as prerelease or beta features.

Preview features or feature-flag features aren't meant for production. Ongoing changes in APIs and behavior, bug fixes, and other changes can result in unstable clusters and downtime.

Features in public preview fall under **best effort** support, as these features are in preview and are not meant for production. The AKS technical support teams provides support during business hours only. For more information, see [Azure Support FAQ](https://azure.microsoft.com/support/faq/).

## Upstream bugs and issues

Given the speed of development in the upstream Kubernetes project, bugs invariably arise. Some of these bugs can't be patched or worked around within the AKS system. Instead, bug fixes require larger patches to upstream projects (such as Kubernetes, node or agent operating systems, and kernel). For components that Microsoft owns (such as the Azure cloud provider), AKS and Azure personnel are committed to fixing issues upstream in the community.

When the root cause of a technical support issue is due to one or more upstream bugs, AKS support and engineering teams will:

* Identify and link the upstream bugs with any supporting details to help explain why this issue affects your cluster or workload. Customers receive links to the required repositories so they can watch the issues and see when a new release will provide fixes.
* Provide potential workarounds or mitigation. If the issue can be mitigated, a [known issue](https://github.com/Azure/AKS/issues?q=is%3Aissue+is%3Aopen+label%3Aknown-issue) is filed in the AKS repository. The known-issue filing explains:

  * The issue, including links to upstream bugs.
  * The workaround and details about an upgrade or another persistence of the solution.
  * Rough timelines for the issue's inclusion, based on the upstream release cadence.

[add-ons]: integrations.md#add-ons