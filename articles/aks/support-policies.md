---
title: Support policies for Azure Kubernetes Service (AKS)
description: Learn about Azure Kubernetes Service (AKS) support policies, shared responsibility, and features that are in preview (or alpha or beta).
services: container-service
author: jnoller
ms.topic: article
ms.date: 01/24/2020
ms.author: jenoller

#Customer intent: As a cluster operator or developer, I want to understand what AKS components I need to manage, what components are managed by Microsoft (including security patches), and networking and preview features.
---

# Support policies for Azure Kubernetes Service

This article provides details about technical support policies and limitations for Azure Kubernetes Service (AKS). The article also details worker node management, managed control plane components, third-party open-source components, and security or patch management.

## Service updates and releases

* For release information, see [AKS release notes](https://github.com/Azure/AKS/releases).
* For information on features in preview, see [AKS preview features and related projects](https://github.com/Azure/AKS/blob/master/previews.md).

## Managed features in AKS

Base infrastructure as a service (IaaS) cloud components, such as compute or networking components, give users access to low-level controls and customization options. By contrast, AKS provides a turnkey Kubernetes deployment that gives customers the common set of configurations and capabilities they need. AKS customers have limited customization, deployment, and other options. These customers don't need to worry about or manage Kubernetes clusters directly.

With AKS, the customer gets a fully managed *control plane*. The control plane contains all of the components and services the customer needs to operate and provide Kubernetes clusters to end users. All Kubernetes components are maintained and operated by Microsoft.

Microsoft manages and monitors the following components through the control pane:

* Kubelet or Kubernetes API servers
* Etcd or a compatible key-value store, providing Quality of Service (QoS), scalability, and runtime
* DNS services (for example, kube-dns or CoreDNS)
* Kubernetes proxy or networking

AKS isn't a completely managed cluster solution. Some components, such as worker nodes, have *shared responsibility*, where users must help maintain the AKS cluster. User input is required, for example, to apply a worker node operating system (OS) security patch.

The services are *managed* in the sense that Microsoft and the AKS team deploys, operates, and is responsible for service availability and functionality. Customers can't alter these managed components. Microsoft limits customization to ensure a consistent and scalable user experience. For a fully customizable solution, see [AKS Engine](https://github.com/Azure/aks-engine).

## Shared responsibility

When a cluster is created, the customer defines the Kubernetes worker nodes that AKS creates. Customer workloads are executed on these nodes. Customers own and can view or modify the worker nodes.

Because customer cluster nodes execute private code and store sensitive data, Microsoft Support can access them in only a limited way. Microsoft Support can't sign in to, execute commands in, or view logs for these nodes without express customer permission or assistance.

Because worker nodes are sensitive, Microsoft takes great care to limit their background management. In many cases, your workload will continue to run even if the Kubernetes master nodes, etcd, and other Microsoft-managed components fail. Carelessly modified worker nodes can cause losses of data and workloads and can render the cluster unsupportable.

## AKS support coverage

Microsoft provides technical support for the following:

* Connectivity to all Kubernetes components that the Kubernetes service provides and supports, such as the API server.
* Management, uptime, QoS, and operations of Kubernetes control plane services (Kubernetes master nodes, API server, etcd, and kube-dns, for example).
* Etcd. Support includes automated, transparent backups of all etcd data every 30 minutes for disaster planning and cluster state restoration. These backups aren't directly available to customers or users. They ensure data reliability and consistency.
* Any integration points in the Azure cloud provider driver for Kubernetes. These include integrations into other Azure services such as load balancers, persistent volumes, or networking (Kubernetes and Azure CNI).
* Questions or issues about customization of control plane components such as the Kubernetes API server, etcd, and kube-dns.
* Issues about networking, such as Azure CNI, kubenet, or other network access and functionality issues. Issues could include DNS resolution, packet loss, routing, and so on. Microsoft supports various networking scenarios:
  * Kubenet (basic) and advanced networking (Azure CNI) within the cluster and associated components
  * Connectivity to other Azure services and applications
  * Ingress controllers and ingress or load balancer configurations
  * Network performance and latency

Microsoft doesn't provide technical support for the following:

* Questions about how to use Kubernetes. For example, Microsoft Support doesn't provide advice on how to create custom ingress controllers, use application workloads, or apply third-party or open-source software packages or tools.
  > [!NOTE]
  > Microsoft Support can advise on AKS cluster functionality, customization, and tuning (for example, Kubernetes operations issues and procedures).
* Third-party open-source projects that aren't provided as part of the Kubernetes control plane or deployed with AKS clusters. These projects might include Istio, Helm, Envoy, or others.
  > [!NOTE]
  > Microsoft can provide best-effort support for third-party open-source projects such as Helm and Kured. Where the third-party open-source tool integrates with the Kubernetes Azure cloud provider or other AKS-specific bugs, Microsoft supports examples and applications from Microsoft documentation.
* Third-party closed-source software. This software can include security scanning tools and networking devices or software.
* Issues about multicloud or multivendor build-outs. For example, Microsoft doesn't support issues related to running a federated multipublic cloud vendor solution.
* Network customizations other than those listed in the [AKS documentation](https://docs.microsoft.com/azure/aks/).
  > [!NOTE]
  > Microsoft does support issues and bugs related to network security groups (NSGs). For example, Microsoft Support can answer questions about an NSG failure to update or an unexpected NSG or load balancer behavior.

## AKS support coverage for worker nodes

### Microsoft responsibilities for AKS worker nodes

Microsoft and customers share responsibility for Kubernetes worker nodes where:

* The base OS image has required additions (such as monitoring and networking agents).
* The worker nodes receive OS patches automatically.
* Issues with the Kubernetes control plane components that run on the worker nodes are automatically remediated. Components include the following:
  * Kube-proxy
  * Networking tunnels that provide communication paths to the Kubernetes master components
  * Kubelet
  * Docker or Moby daemon

> [!NOTE]
> On a worker node, if a control plane component is not operational, the AKS team might need to reboot individual components or the entire worker node. These reboot operations are automated and provide auto-remediation for common issues. These reboots occur only on the _node_ level and not the cluster unless there is an emergency maintenance or outage.

### Customer responsibilities for AKS worker nodes

Microsoft doesn't automatically reboot worker nodes to apply OS-level patches. Although OS patches are delivered to the worker nodes, the *customer* is responsible for rebooting the worker nodes to apply the changes. Shared libraries, daemons such as solid-state hybrid drive (SSHD), and other components at the level of the system or OS are automatically patched.

Customers are responsible for executing Kubernetes upgrades. They can execute upgrades through the Azure control panel or the Azure CLI. This applies for updates that contain security or functionality improvements to Kubernetes.

#### User customization of worker nodes
> [!NOTE]
> AKS worker nodes appear in the Azure portal as regular Azure IaaS resources. But these virtual machines are deployed into a custom Azure resource group (prefixed with MC\\*). It is possible to augment AKS worker nodes from their base configurations. For example, you can use Secure Shell (SSH) to change AKS worker nodes the way you change normal virtual machines. You cannot, however, change the base OS image. Any custom changes may not persist through an upgrade, scale, update or reboot. **However**, making changes *out of band and out of scope of the AKS API* leads to the AKS cluster becoming unsupported. Avoid changing worker nodes unless Microsoft Support directs you to make changes.

Issuing unsupported operations as defined above, such as out of band deallocation of all agent nodes, renders the cluster unsupported. AKS reserves the right to archive control planes that have been configured out of support guidelines for extended periods equal to and beyond 30 days. AKS maintains backups of cluster etcd metadata and can readily reallocate the cluster. This reallocation can be initiated by any PUT operation bringing the cluster back into support, such as an upgrade or scale to active agent nodes.

AKS manages the lifecycle and operations of worker nodes on behalf of customers - modifying the IaaS resources associated with the worker nodes is **not supported**. An example of an unsupported operation is customizing a node pool VM Scale Set by manually changing configurations on the VMSS through the VMSS portal or VMSS API.
 
For workload specific configurations or packages, AKS recommends using [Kubernetes daemonsets](https://kubernetes.io/docs/concepts/workloads/controllers/daemonset/).

Using Kubernetes privileged daemonsets and init containers enables customers to tune/modify or install 3rd party software on cluster worker nodes. Examples of such customizations include adding custom security scanning software or updating sysctl settings.

While this is a recommended path if the above requirements apply, AKS engineering and support can not assist in troubleshooting or diagnosis of broken/nonfunctional modifications or those that render the node unavailable due to a customer deployed daemonset.

> [!NOTE]
> AKS as a *managed service* has end goals such as removing responsibility for patches, updates, and log collection to make the service management more complete and hands-off. As the service's capacity for end-to-end management increases, future releases might omit some functions (for example, node rebooting and automatic patching).

### Security issues and patching

If a security flaw is found in one or more components of AKS, the AKS team will patch all affected clusters to mitigate the issue. Alternatively, the team will give users upgrade guidance.

For worker nodes that a security flaw affects, if a zero-downtime patch is available, the AKS team will apply that patch and notify users of the change.

When a security patch requires worker node reboots, Microsoft will notify customers of this requirement. The customer is responsible for rebooting or updating to get the cluster patch. If users don't apply the patches according to AKS guidance, their cluster will continue to be vulnerable to the security issue.

### Node maintenance and access

Worker nodes are a shared responsibility and are owned by customers. Because of this, customers have the ability to sign in to their worker nodes and make potentially harmful changes such as kernel updates and installing or removing packages.

If customers make destructive changes or cause control plane components to go offline or become nonfunctional, AKS will detect this failure and automatically restore the worker node to the previous working state.

Although customers can sign in to and change worker nodes, doing this is discouraged because changes can make a cluster unsupportable.

## Network ports, access, and NSGs

As a managed service, AKS has specific networking and connectivity requirements. These requirements are less flexible than requirements for normal IaaS components. In AKS, operations like customizing NSG rules, blocking a specific port (for example, using firewall rules that block outbound port 443), and whitelisting URLs can make your cluster unsupportable.

> [!NOTE]
> Currently, AKS doesn't allow you to completely lock down egress traffic from your cluster. To control the list of URLs and ports your cluster can use for outbound traffic see  [limit egress traffic](limit-egress-traffic.md).

## Unsupported alpha and beta Kubernetes features

AKS supports only stable features within the upstream Kubernetes project. Unless otherwise documented, AKS doesn't support alpha and beta features that are available in the upstream Kubernetes project.

In two scenarios, alpha or beta features might be rolled out before they're generally available:

* Customers have met with the AKS product, support, or engineering teams and have been asked to try these new features.
* These features have been [enabled by a feature flag](https://github.com/Azure/AKS/blob/master/previews.md). Customers must explicitly opt in to use these features.

## Preview features or feature flags

For features and functionality that require extended testing and user feedback, Microsoft releases new preview features or features behind a feature flag. Consider these features as prerelease or beta features.

Preview features or feature-flag features aren't meant for production. Ongoing changes in APIs and behavior, bug fixes, and other changes can result in unstable clusters and downtime.

Features in public preview are fall under 'best effort' support as these features are in preview and not meant for production and are supported by the AKS technical support teams during business hours only. For additional information please see:

* [Azure Support FAQ](https://azure.microsoft.com/support/faq/)

> [!NOTE]
> Preview features take effect at the Azure *subscription* level. Don't install preview features on a production subscription. On a production subscription, preview features can change default API behavior and affect regular operations.

## Upstream bugs and issues

Given the speed of development in the upstream Kubernetes project, bugs invariably arise. Some of these bugs can't be patched or worked around within the AKS system. Instead, bug fixes require larger patches to upstream projects (such as Kubernetes, node or worker operating systems, and kernels). For components that Microsoft owns (such as the Azure cloud provider), AKS and Azure personnel are committed to fixing issues upstream in the community.

When a technical support issue is root-caused by one or more upstream bugs, AKS support and engineering teams will:

* Identify and link the upstream bugs with any supporting details to help explain why this issue affects your cluster or workload. Customers receive links to the required repositories so they can watch the issues and see when a new release will provide fixes.
* Provide potential workarounds or mitigations. If the issue can be mitigated, a [known issue](https://github.com/Azure/AKS/issues?q=is%3Aissue+is%3Aopen+label%3Aknown-issue) will be filed in the AKS repository. The known-issue filing explains:
  * The issue, including links to upstream bugs.
  * The workaround and details about an upgrade or another persistence of the solution.
  * Rough timelines for the issue's inclusion, based on the upstream release cadence.
