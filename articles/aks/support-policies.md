---
title: Azure Kubernetes Service (AKS) support policies
description: Learn about Azure Kubernetes Service (AKS) support policies, shared responsibility, Preview/Alpha/Beta features.
services: container-service
author: jnoller

ms.service: container-service
ms.topic: article
ms.date: 04/01/2019
ms.author: jenoller

#Customer intent: As a cluster operator or developer, I want to understand what components for AKS I need to manage, and those managed by Microsoft including security patches, networking and preview features.
---

# Azure Kubernetes Service (AKS) support policies

This article provides details around AKS technical support policies, limitations, and details including worker node management, managed control plane components, third-party open-source components, and security / patch management.

## Service updates & releases

* For release info, see the [AKS Release Notes][1]
* For features in public preview, see [AKS Preview Features and Related Projects][2]

## What is 'managed'

Unlike base IaaS cloud components such as compute or networking, which expose low-level controls and customization options for users to leverage, the AKS service provides a turn-key Kubernetes deployment that represents the common set of configurations and capabilities required for Kubernetes. Customers who use this service have a limited number of customizations, deployment, and other options. This also means that customers do not need to worry or manage the Kubernetes cluster(s) directly.

With AKS, the customer gets a fully managed **control plane** – where the control plane contains all components and services required to operate and provide Kubernetes clusters to end users. All Kubernetes components are maintained and operated by Microsoft.

With the managed **control plane** the following components are managed and monitored by Microsoft:

* Kubelet / Kubernetes API server(s)
* Etcd or a compatible Key/Value store – including quality of service, scalability, and runtime
* DNS services (for example, kube-dns / CoreDNS)
* Kubernetes Proxy/networking

AKS is not a 100% managed **cluster** solution. Certain components (such as worker nodes) have certain **shared responsibilities** cases where actions to maintain the AKS cluster require user interaction. For example, worker node OS security patch application.

 **Managed**, means that Microsoft and the AKS team deploys, operates, and is responsible for the availability and functionality of these services. **Customers cannot alter these components**. Customization is limited to ensure a consistent and scalable user experience. For a fully customizable solution, see [AKS-Engine](https://github.com/Azure/aks-engine).

> [!NOTE]
> It's important to understand that Azure Kubernetes Service worker nodes appear in the Azure Portal as regular Azure IaaS Resources, although these Virtual Machines are deployed into a custom Azure Resource Group (prefixed with MC\\*). A user might alter them, SSH into them just like normal virtual machines (you cannot, however, change the base OS image, and changes might not persist through an update or reboot), and you can attach other Azure resource to them, or otherwise modify them. **However, doing this of out of band management and customization means that the AKS cluster itself can become unsupportable. Avoid worker node alteration unless directed by Microsoft Support.**

## What is shared responsibility

At cluster creation time, AKS creates a number of Kubernetes worker nodes defined by the customer. These nodes, as noted are where customer workloads are executed. Customers own and can view or modify these worker nodes.

Because these nodes are executing private code and store sensitive data, Microsoft support has **limited access** to all Customer cluster nodes. Microsoft support cannot log into, execute commands, or view logs for these nodes without express customer permission and/or assistance to execute debugging commands as directed by the support team.

Due to the sensitive nature of these worker nodes, Microsoft takes great care to limit the 'behind the scenes' management of these nodes. Even if the Kubernetes master nodes, etcd, and other components fail (managed by Microsoft) your workload will continue to run in many cases. If worker nodes are modified without care, it can result in data and/or workload loss, and render the cluster unsupportable.

## Azure Kubernetes Service Support coverage

**Microsoft provides technical support for the following:**

* Connectivity to all Kubernetes components provided and supported by the Kubernetes service (such as the API server)
* Management, Uptime, QoS and operations of Kubernetes control plane services (Kubernetes Master nodes, API Server, etcd, kube-dns for example.
* Etcd support includes automated, transparent backups of all etcd data every 30 minutes for disaster planning and cluster state restoration. These backups are not available directly to customers/users and are used to ensure data reliability and consistency
* Any integration points in the Azure Cloud Provider driver for Kubernetes such as integrations to other Azure services such as Load balancers, Persistent Volumes, Networking (Kubernetes and Azure CNI)
* Questions or issues around customization of control plane components such as the Kubernetes API server, etcd, and kube-dns.
* Issues about networking topics, such as Azure CNI, Kubenet, or other network access and functionality issues (DNS resolution, packet loss, routing, and so on).
  * Networking scenarios supported include Kubenet (Basic) and Advanced Networking (Azure CNI) within the cluster and associated components, connectivity to other Azure services and applications. Additionally, ingress controllers and ingress/load balancer configuration, network performance and latency are supported by Microsoft.

**Microsoft does not provide technical support for the following:**

* Advisory/"How-To" use Kubernetes questions, for example how to create custom ingress controllers, application workload questions, and third-party/OSS packages or tools are out of scope.
  * Advisory tickets for AKS cluster functionality, customization, tuning – e.g Kubernetes operations issues/how-tos are within scope.
* Third-party open-source projects not provided as part of the Kubernetes control plane or deployed with AKS clusters, such as Istio, Helm, Envoy, and others.
  * For third-party open-source projects, such as Helm and Kured, best effort support is provided for examples and applications provided in Microsoft documentation and where that third-party open-source tool integrates with the Kubernetes Azure cloud provider or other AKS-specific bugs.
* Third-party closed-source software – this can include security scanning tools, networking devices or software.
* Issues about "multi-cloud" or multi-vendor build-outs are not supported, for example running a Federated multi public cloud vendor solution is not supported.
* Specific network customizations, other than those documented in the official [AKS documentation][3].
  > [!NOTE]
  > Issues and bugs around Network Security Groups is supported. For example, support can answer questions around NSGs failing to update, or unexpected NSG or Load Balancer behavior.

## Azure Kubernetes Service Support coverage (Worker Nodes)

### Microsoft responsibilities for Azure Kubernetes Service worker nodes

As noted in the `shared responsibility` section, Kubernetes worker nodes fall into a joint-responsibility model, where:

* Provides the base operating system image with required additions (such as monitoring and networking agents)
* Automatic delivery of operating system patches to the worker nodes
* Automatic remediation of issues with Kubernetes control plane components running on the worker nodes, such as:
  * kube-proxy
  * networking tunnels that provide communication paths to the Kubernetes master components
  * kubelet
  * docker/moby daemon

> [!NOTE]
> If a control plane component is non-operational on a worker node, the AKS team may need to reboot the entire worker node to resolve the issue. This is done on behalf of a user and not performed unless a customer escalation is made (due to access to the customers active workload and data). Whenever possible AKS personnel will work to make any required reboot non-application impacting.

### Customer responsibilities for Azure Kubernetes Service worker nodes

**Microsoft does not:**

- Automatically Reboot worker nodes for OS level patches to take effect **(Currently, see below)**

Operating system patches are delivered to the worker nodes, however it is the **customer's responsibility** to reboot the worker nodes for the changes to take effect. This auto-patching includes shared libraries, daemons such as SSHD, and other system/OS level components.

For Kubernetes upgrades, **customers are responsible for the execution of the upgrade** via the Azure Control panel, or the Azure CLI. This applies for updates containing security or functionality improvements to Kubernetes.

> [!NOTE]
> As AKS is a `managed service` our end goals of the service include removing responsibility for patches, updates, log collection and more to make it a more completely managed and hands-off service. These items (node rebooting, auto-patching) may be removed in future releases as our capabilities to do end to end management increase.

### Security issues and patching

In some cases (such as CVEs), a security flaw may be found in one or more of the components of the AKS service. In such scenarios, AKS will patch all impacted clusters to mitigate the issue if possible, or provide upgrade guidance to users.

For worker nodes impacted by such a security hole, if a zero-downtime patch of the issue is available, the AKS team will apply that fix and notify users of the change.

If a security patch requires worker node reboots, Microsoft will notify customer of this requirement and the customer is responsible to execute the reboot or update to get the patch for their cluster. If users do not apply the patches per AKS guidance, their cluster will continue to be vulnerable to the issue(s).

### Node maintenance and access

Because worker nodes are a shared responsibility and under the ownership of customers, customers can log into these workers and perform potentially harmful changes, such as kernel updates, removing packages and installing new packages.

If customers perform destructive actions, or actions that trigger control plane components to go offline or otherwise become non-functional, the AKS service will detect this failure and perform autoremediation to restore the worker node to the previous working state.

Although customers can log into and alter worker nodes, it is *discouraged* because this can make your cluster unsupportable.

## Network ports, access, and Network Security Groups

As a managed service, AKS has specific networking and connectivity requirements. These requirements are less flexible than normal IaaS components. Unlike other IaaS components, certain operations (such as the customization of Network Security Group rules, specific port blocking, URL whitelisting, and so on) can render your cluster unsupportable (for example, firewall rules blocking outbound port 443).

> [!NOTE]
> Completely locking down egress (for example, explicit domain/port whitelisting) from your cluster is not a supported AKS scenario at this time. The list of URLs and Ports is subject to change without warning and can be provided by Azure Support via a ticket. The provided list is only for customers who are willing to accept that *the availability of your cluster could be affected at any time.*

## Alpha/Beta Kubernetes features (not supported)

AKS only supports stable features within the upstream Kubernetes project. Alpha/Beta features available in upstream Kubernetes are not supported unless otherwise communicated and documented.

There are two cases where Alpha or Beta features may be rolled out prior to GA:

* Customers have met with the AKS product, support, or engineering teams and have been explicitly asked to try these new features.
* These features have been [enabled via a Feature Flag][2] (explicit opt-in)

## Preview features / feature Flags

For features and functionality that require extended testing, community and user feedback, Microsoft will release new preview features, or features behind a feature flag. These features should be considered pre-release / Beta, and are exposed to give users a chance to try out these new features.

However, these preview / feature flag features are not meant for production use – APIs, behavior change, bug fixes, and other changes can be made that can result in unstable clusters and downtime. Support for these features is limited to bug/issue reporting. Do not enable these features on production systems or subscriptions.

> [!NOTE]
> Enabling preview features takes effect at the Azure **subscription** level. Do not install preview features on production subscription as it can change default API behavior impacting regular operations.

## Upstream bugs and issues

Given the speed of development in the upstream Kubernetes project, there are invariably bugs that cannot be patched or worked-around within the AKS system, and instead require larger patches to upstream projects (such as Kubernetes, Node/Worker OSes and Kernels). For components we own (such as the Azure Cloud Provider), AKS/Azure personnel are committed to fixing the issue upstream in the community.

For cases where a technical support issue is root-caused to one or more upstream bugs, AKS support and engineering will do the following items:

* Identify and link the upstream bugs with any supporting details as to why this impacts your cluster and/or workload. Customers will be provided with links to the required repos/issues to watch the issues and see when a new Kubernetes/other release will include the fix(es)
* Potential work-arounds or mitigations: In some cases it may be possible to work around the issue – in this case, a "[known-issue](https://github.com/Azure/AKS/issues?q=is%3Aissue+is%3Aopen+label%3Aknown-issue)" will be filed on the AKS repository that explains:
  * The issue, and link to upstream bugs
  * The workaround, and details around upgrade/other persistence of the solution
  * Rough timelines for inclusion based on the upstream release cadence

[1]: https://github.com/Azure/AKS/releases
[2]: https://github.com/Azure/AKS/blob/master/previews.md
[3]: https://docs.microsoft.com/azure/aks/
