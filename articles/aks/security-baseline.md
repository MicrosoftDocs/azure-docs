---
title: Azure security baseline for Azure Kubernetes Service
description: The Azure Kubernetes Service security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: container-service
ms.topic: conceptual
ms.date: 08/04/2020
ms.author: mbaldwin
ms.custom: security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Kubernetes Service

The Azure Security Baseline for Azure Kubernetes Service contains recommendations that will help you improve the security posture of your deployment.

The baseline for this service is drawn from the [Azure Security Benchmark version 1.0](https://docs.microsoft.com/azure/security/benchmarks/overview), which provides recommendations on how you can secure your cloud solutions on Azure with our best practices guidance.

For more information, see [Azure Security Baselines overview](https://docs.microsoft.com/azure/security/benchmarks/security-baselines-overview).

>[!WARNING]
>This preview version of the article is for review only. **DO NOT MERGE INTO MASTER!**

## Network security

*For more information, see [Security control: Network security](/azure/security/benchmarks/security-control-network-security).*

### 1.1: Protect Azure resources within virtual networks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32877.).

**Guidance**: Azure Kubernetes Service (AKS) clusters can be deployed into existing Azure Virtual Network subnets for connectivity and security with on-premises networks. 
Kubernetes ingress controllers can be defined with private, internal IP addresses so services are only accessible over this internal network connection. As an example, AKS clusters in these Virtual Networks may have an Azure Site-to-Site VPN or Express Route connection back to your on-premises network.

Azure uses network security group (NSG) rules to filter the flow of traffic in virtual networks to define the source and destination IP ranges, ports, and protocols that are allowed or denied access to resources. 
Default rules are created to allow TLS traffic to the Kubernetes API server. AKS automatically modifies the NSG for traffic to flow appropriately as services are created with load balancers, port mappings, or ingress routes. 

Kubernetes network policies can be used for security and filtering of the network traffic for pods. AKS offers support for Kubernetes network policies to limit network traffic between pods in an AKS cluster. You can choose to allow or deny specific network paths within the cluster based on namespaces and label selectors with network policies.

In AKS, Each AKS cluster has its own single-tenanted, dedicated Kubernetes master to provide the API Server, Scheduler, etc.. The master components are part of the managed service provided by Microsoft. 

By default, the Kubernetes API server uses a public IP address and a fully qualified domain name (FQDN). Access can be limited to the API server endpoint using authorized IP ranges. You can also create a fully private cluster to limit API server access to your virtual network.

Nodes are deployed into a private virtual network subnet, with no public IP addresses assigned. For troubleshooting and management purposes, SSH is enabled by default. This SSH access is only available using the internal IP address.

The supported deployment scenarios in AKS use Kubnet and CNI plugin, along with Managed Virtual Network and  Bring you own (BYO) Virtual Network

By default, AKS clusters use kubenet with an Azure virtual network and subnet created for the customers. AKS kubenet, nodes get an IP address from the Azure virtual network subnet with network policies.

Every pod gets an IP address from the subnet and can be accessed directly with Azure Container Networking Interface (CNI). These IP addresses must be unique across your network space and planned in advance. Each node has a configuration parameter for the maximum number of pods that are supported. The equivalent number of IP addresses per node are then reserved up front for that node. This approach requires more planning, and often leads to IP address exhaustion or the need to rebuild clusters in a larger subnet as your application demands grow.

An NSG and route table are automatically created and are managed by the AKS control plane when you create an AKS cluster,. The NSG is automatically associated with the virtual NICs on your nodes. The route table is automatically associated with the virtual network subnet. Network security group rules and route tables are automatically updated as you create and expose services.

https://docs.microsoft.com/azure/aks/configure-kubenet#create-an-aks-cluster-in-the-virtual-network

https://docs.microsoft.com/azure/aks/configure-kubenet#bring-your-own-subnet-and-route-table-with-kubenet

With kubenet, a route table must exist on your cluster subnet(s). AKS supports bringing your own existing subnet and route table.

If your custom subnet does not contain a route table, AKS creates one for you and adds rules to it throughout the cluster lifecycle. If your custom subnet contains a route table when you create your cluster, AKS acknowledges the existing route table during cluster operations and adds/updates rules accordingly for cloud provider operations.

#NSG

AKS clusters are deployed on a virtual network with the cluster having outbound dependencies on services outside of that virtual network. The service has no inbound dependencies.

A network security group (NSG) filters traffic for VMs, such as the AKS nodes. As services are created, e.g.,, a Load Balancer, the Azure platform automatically configures any NSG rules that are needed. It is recommended to not manually configure NSG rules to filter traffic for pods in an AKS cluster. Azure platform create or update the appropriate rules after you define any required ports and forwarding as part of your Kubernetes Service manifests. 

By default, AKS clusters have unrestricted outbound (egress) internet access. This level of network access allows nodes and services you run to access external resources as needed. If you wish to restrict egress traffic, a limited number of ports and addresses must be accessible to maintain healthy cluster maintenance tasks.

The AKS outbound dependencies are almost entirely defined with FQDNs, which don't have static addresses behind them. The lack of static addresses means that NSGs can't be used to lock down the outbound traffic from an AKS cluster.

- [How to configure networking for your AKS instance](https://docs.microsoft.com/azure/aks/configure-azure-cni#configure-networking---portal)

- [Understand network security configurations for AKS](https://docs.microsoft.com/azure/aks/concepts-network#azure-virtual-networks)

- [Configure Azure CNI networking in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/configure-azure-cni)

- [Network concepts for applications in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/concepts-network)

- [Use Kubenet networking with your own IP address ranges in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/configure-kubenet)

- [Security concepts for applications and clusters in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/concepts-security)

Control egress traffic for cluster nodes in Azure Kubernetes Service (AKS) https://docs.microsoft.com/azure/aks/limit-egress-traffic

- [Secure traffic between pods using network policies in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/use-network-policies)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32878.).

**Guidance**: Use Azure Security Center and follow network protection recommendations to help secure the network resources being used by your Azure Kubernetes Service (AKS) clusters. 

For your AKS management virtual network/subnet, enable network security group (NSG) flow logs and send logs into an Azure Storage Account for traffic audit. 

You may also send NSG flow logs to an Azure Log Analytics workspace and use Traffic Analytics to provide insights into traffic flow in your Azure cloud. Some advantages of Azure Traffic Analytics are the ability to visualize network activity and identify hot spots, identify security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

- [How to Enable and use Traffic Analytics](https://docs.microsoft.com/azure/network-watcher/traffic-analytics)

- [Understand Network Security provided by Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-network-recommendations)

- [Understand best practices for network connectivity and security in AKS](https://docs.microsoft.com/azure/aks/operator-best-practices-network)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.3: Protect critical web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32879.).

**Guidance**: These more advanced network resources can also route traffic beyond just HTTP and HTTPS connections or basic SSL termination.

A web application firewall (WAF) provides an additional layer of security by filtering the incoming traffic. The Open Web Application Security Project (OWASP) provides a set of rules to watch for attacks like cross site scripting or cookie poisoning.

Most web applications that use HTTP or HTTPS should use Kubernetes ingress resources and controllers, which work at layer 7. Create an Application Gateway Ingress Controller (AGIC), a Kubernetes application, which makes it possible for Azure Kubernetes Service (AKS) customers to leverage Azure's native Application Gateway L7 load-balancer to expose cloud software to the Internet.

You can quickly deploy and operate a microservices-based architecture in the cloud with AKS and leverage Azure API Management (API Management) to publish your microservices as APIs for internal and external consumption. 

When publishing microservices as APIs for consumption, it can be a challenge to manage the communication between the microservices and the clients that consume them. There are concerns such as authentication, authorization, throttling, caching, transformation, and monitoring.  The API Gateway pattern addresses these concerns. An API gateway serves as a front door to the microservices, decouples clients from your microservices, adds an additional layer of security, and decreases the complexity of your microservices by removing the burden of handling cross cutting concerns.

Azure API Management is a turnkey solution to solve your API gateway needs. You can quickly create a consistent and modern gateway for your microservices and publish them as APIs.

- [Understand best practices for network connectivity and security in AKS](https://docs.microsoft.com/azure/aks/operator-best-practices-network)

- [Application Gateway Ingress Controller ](https://docs.microsoft.com/azure/application-gateway/ingress-controller-overview)

- [How to get started by creating an Application Gateway Ingress Controller](https://github.com/azure/application-gateway-kubernetes-ingress)

- [Use Azure API Management with microservices deployed in Azure Kubernetes Service](https://docs.microsoft.com/azure/api-management/api-management-kubernetes)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.4: Deny communications with known malicious IP addresses

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32880.).

**Guidance**: For protections from distributed denial-of-service (DDoS) attacks, enable DDoS Standard protection on the Virtual Network where your Azure Kubernetes Service (AKS) components are deployed.
Use network policies to allow or deny traffic to pods. By default, all traffic is allowed between pods within a cluster. For improved security, define rules that limit pod communication. Network policy is a Kubernetes feature that lets you control the traffic flow between pods. You can choose to allow or deny traffic based on settings such as assigned labels, namespace, or traffic port. 

The use of network policies gives a cloud-native way to control the flow of traffic. As pods are dynamically created in an AKS cluster, the required network policies can be automatically applied. Do not use Azure NSGs to control pod-to-pod traffic, use network policies instead.	

- [Secure traffic between pods using network policies in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/use-network-policies)

- [How to configure DDoS protection](https://docs.microsoft.com/azure/virtual-network/manage-ddos-protection)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.5: Record network packets

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32881.).

**Guidance**: Enable network security group (NSG) flog logs for the NSGs attached to your Azure Kubernetes Service (AKS) nodes as well as any NSGs attached to subnets being used to protect your AKS service components (such as the management virtual network your web application firewall (WAF) is deployed to). Record the NSG flow logs into an Azure Storage Account to generate flow records. 

If required for investigating anomalous activity, enable Network Watcher packet capture.

The netstat utility can introspect a wide variety of network stats, invoked with summary output. There are many useful fields depending on the issue. One useful field in the TCP section is "failed connection attempts". This may be an indication of SNAT port exhaustion or other issues making outbound connections. A high rate of retransmitted segments (also under the TCP section) may indicate issues with packet delivery.

- [How to Enable NSG Flow Logs](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-portal)

- [How to enable Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-create)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32882.).

**Guidance**: Secure your Azure Kubernetes Service (AKS) cluster with a Azure Application Gateway with web application firewall (WAF). 

If intrusion detection and/or prevention based on payload inspection or behavior analytics is not a requirement, Azure Application Gateway with WAF can be used and configured in "detection mode" to log alerts and threats, or "prevention mode" to actively block detected intrusions and attacks.

The Application Gateway Ingress Controller (AGIC) add-on allows AKS customers to leverage Azure's native Application Gateway level 7 load-balancer to expose cloud software to the Internet. AGIC monitors the Kubernetes cluster it is hosted on and continuously updates an Application Gateway, so that selected services are exposed to the Internet. 

The Ingress Controller runs in its own pod on the customer’s AKS. AGIC monitors a subset of Kubernetes Resources for changes. The state of the AKS cluster is translated to Application Gateway specific configuration and applied to the Azure Resource Manager (ARM).

- [Application Gateway ingress controller overview](https://docs.microsoft.com/azure/application-gateway/ingress-controller-overview)

- [Understand best practices for securing your AKS cluster with a WAF](https://docs.microsoft.com/azure/aks/operator-best-practices-network#secure-traffic-with-a-web-application-firewall-waf)

- [How to deploy Azure Application Gateway (Azure WAF)](https://docs.microsoft.com/azure/web-application-firewall/ag/application-gateway-web-application-firewall-portal)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.7: Manage traffic to web applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32883.).

**Guidance**: A web application firewall (WAF) provides an additional layer of security by filtering the incoming traffic and can be placed in front of an Azure Kubernetes Service (AKS) Cluster. The Open Web Application Security Project (OWASP) provides a set of rules used in the WAF to watch for attacks like cross site scripting or cookie poisoning.
Additionally, most web applications that use HTTP or HTTPS should use Kubernetes ingress resources and controllers, which work at layer 7. Create an Application Gateway Ingress Controller (AGIC), a Kubernetes application, which makes it possible for Azure Kubernetes Service (AKS) customers to leverage Azure's native Application Gateway L7 load-balancer to expose cloud software to the Internet.

On large web applications accessed via HTTPS, the TLS termination can be handled by the Ingress resource rather than within the application itself. 
To provide automatic TLS certification generation and configuration, you can configure the Ingress resource to use providers such as Let's Encrypt. 

AKS uses network security group rules as well to filter the flow of traffic in virtual networks, These rules define the source and destination IP ranges, ports, and protocols that are allowed or denied access to resources.
  

However, to ‘limit network traffic’ between pods in your cluster, AKS offers support for Kubernetes network policies. With network policies, you can choose to allow or deny specific network paths within the cluster based on namespaces and label selectors.

- [Understand best practices for network connectivity and security in AKS](https://docs.microsoft.com/azure/aks/operator-best-practices-network)

- [Application Gateway ingress controller overview](https://docs.microsoft.com/azure/application-gateway/ingress-controller-overview)

- [How to get started by creating an Application Gateway Ingress Controller](https://github.com/azure/application-gateway-kubernetes-ingress)

- [Secure traffic between pods using network policies in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/use-network-policies)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.8: Minimize complexity and administrative overhead of network security rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32884.).

**Guidance**: Use virtual network service tags to define network access controls on network security groups associated with your Azure Kubernetes Service (AKS) instances. 

You can use service tags in place of specific IP addresses when creating security rules within an Network Security Group (NSG). By specifying the service tag name (e.g., ApiManagement) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. 
Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

You can apply an Azure tag to node pools in your AKS cluster. Tags applied to a node pool are different than the virtual network service tags, and are applied to each node within the node pool and are persisted through upgrades. Tags are also applied to new nodes added to a node pool during scale-out operations. Adding a tag can help with tasks such as policy tracking or cost estimation.

FQDN tags can be applied to applications for ease of use in setting up application rules within an NSG. After setting the network rules, we can add an application rule using an FQDN tag, e.g.,  AzureKubernetesService that covers all needed FQDNs accessible through TCP port 443 and port 80.

- [Understand and using Service Tags](https://docs.microsoft.com/azure/virtual-network/service-tags-overview)

- [Understand NSGs for AKS](https://docs.microsoft.com/azure/aks/support-policies)

- [Control egress traffic for cluster nodes in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/limit-egress-traffic)

- [Secure traffic between pods using network policies in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/use-network-policies)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.9: Maintain standard security configurations for network devices

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32885.).

**Guidance**: Define and implement standard security configurations for network resources associated with your Azure Kubernetes Service (AKS) clusters with Azure Policy. 
Use Azure Policy aliases in the "Microsoft.ContainerService" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your AKS clusters. 

You may also make use of built-in policy definitions related to AKS, such as:

•	Authorized IP ranges should be defined on Kubernetes Services

•	Enforce HTTPS ingress in Kubernetes cluster

•	Ensure services listen only on allowed ports in Kubernetes cluster

Azure Policy extends Gatekeeper v3, an admission controller webhook for Open Policy Agent (OPA), to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner. Azure Policy makes it possible to manage and report on the compliance state of your Kubernetes clusters from one place. 

The add-on enacts the following functions:

•	Checks with Azure Policy service for policy assignments to the cluster.

•	Deploys policy definitions into the cluster as constraint template and constraint custom resources.

•	Reports auditing and compliance details back to Azure Policy service.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Azure Policy samples for networking](https://docs.microsoft.com/azure/governance/policy/samples/#network)

- [Understand Azure Policy for Kubernetes clusters (preview)](https://docs.microsoft.com/azure/governance/policy/concepts/policy-for-kubernetes)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.10: Document traffic configuration rules

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32886.).

**Guidance**: Use tags for network security groups (NSG) and other resources related to network security and traffic flow. For individual NSG rules, use the "Description" field to specify business need and/or duration (etc.) for any rules that allow traffic to/from a network.
Use any of the built-in Azure policy definitions related to tagging, such as "Require tag and its value" to ensure that all resources are created with Tags and to notify you of existing untagged resources.

The Network Policy feature in Kubernetes lets you define rules for ingress and egress traffic between pods in a cluster. With network policies, you can choose to allow or deny specific network paths within the cluster based on namespaces and label selectors. These namespaces and labels can be used as descriptors for traffic configuration rules.

FQDN tags can also be used for ease of use. After setting the network rules, we'll also add an application rule using an FQDN tag, e.g., AzureKubernetesService that covers all needed FQDNs accessible through TCP port 443 and port 80.

You may use Azure PowerShell or Azure command-line interface (CLI) to look-up or perform actions on resources based on their Tags.

- [Azure Policy with CLI](https://docs.microsoft.com/cli/azure/policy?view=azure-cli-latest)

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

- [How to create a Virtual Network](https://docs.microsoft.com/azure/virtual-network/quick-create-portal)

- [How to create an NSG with a Security Config](https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic)

- [Secure traffic between pods using network policies in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/use-network-policies)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 1.11: Use automated tools to monitor network resource configurations and detect changes

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32887.).

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to your Azure Kubernetes Service (AKS) clusters. Create alerts within Azure Monitor that will trigger when changes to critical network resources take place. It is important to note that the any entries from the AzureContainerService user in the activity logs are logged as platform actions. 
Within AKS, the master components, kube-apiserver and kube-controller-manager, are provided as a managed service. Customers create and manage the nodes that run the kubelet and container runtime and deploy their applications through the managed Kubernetes API server. Customers can use Azure Monitor logs to enable and query the logs from the Kubernetes master components.

- [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)

- [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

- [Enable and review Kubernetes master node logs in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/view-master-logs)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Logging and monitoring

*For more information, see [Security control: Logging and monitoring](/azure/security/benchmarks/security-control-logging-monitoring).*

### 2.1: Use approved time synchronization sources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32888.).

**Guidance**: Azure Kubernetes Service (AKS) nodes use ntp.ubuntu.com for time synchronization, along with UDP port 123 and Network Time Protocol (NTP). 

In case you’re using custom DNS servers, you must ensure they’re accessible by the cluster nodes.
- [Understand NTP domain and port requirements for AKS cluster nodes](https://docs.microsoft.com/azure/aks/limit-egress-traffic)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### 2.2: Configure central security log management

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32889.).

**Guidance**: Azure Kubernetes Services'(AKS) master components, kube-apiserver and kube-controller-manager are provided as a managed service. You have to create and manage the nodes that run the kubelet and container runtime, and deploy your applications through the managed Kubernetes API server. 

To help troubleshoot your application and services, you may need to view the logs generated by these master components. You can use Azure Monitor logs to query these logs.

- [To enable log collection for the Kubernetes master components in your AKS cluster, open the Azure portal in a web browser and complete the following steps](https://docs.microsoft.com/azure/aks/view-master-logs)

In the list of available logs, select the logs you wish to enable. Common logs include the kube-apiserver, kube-controller-manager, and kube-scheduler. 

You can enable additional logs, such as kube-audit and cluster-autoscaler.

- [Note that the Log schema including log roles are available for review here](https://docs.microsoft.com/azure/aks/view-master-logs)

- [Understand Azure Monitor for Containers](https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-overview)

- [How to enable Azure Monitor for Containers](https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-onboard)

- [Enable and review Kubernetes master node logs in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/view-master-logs)



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.3: Enable audit logging for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32890.).

**Guidance**: Configure Diagnostic Settings to enable log collection for the Kubernetes master components in your Azure Kubernetes Service (AKS) cluster.Azure Monitor logs works with both RBAC and non-RBAC enabled AKS clusters.

You can enable audit logs, such as 

•	kube-auditaksService: The display name in audit log for the control plane operation (from the hcpService) 

•	masterclient: The display name in audit log for MasterClientCertificate, the certificate you get from az aks get-credentials 

•	nodeclient: The display name for ClientCertificate, which is used by agent nodes

Other audit logs such as kube-audit can also be enabled.

Additionally, Azure Policy extends Gatekeeper v3, an admission controller webhook for Open Policy Agent (OPA), to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner. 

Azure Policy makes it possible to manage and report on the compliance state of your Kubernetes clusters from one place. The add-on enacts the following functions:

•	Checks with Azure Policy service for policy assignments to the cluster.

•	Deploys policy definitions into the cluster as constraint template and constraint custom resources. 

•	Reports auditing and compliance details back to Azure Policy service.

- [How to enable and review Kubernetes master node logs in AKS](https://docs.microsoft.com/azure/aks/view-master-logs)



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.4: Collect security logs from operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32891.).

**Guidance**: Enable automatic provisioning of the Azure Log Analytics Agent. Security center collects data from your Azure virtual machines (VMs), virtual machine scale sets, and IaaS containers (Kubernetes cluster nodes), to monitor for security vulnerabilities and threats. Data is collected using the Azure Log Analytics Agent, which reads various security-related configurations and event logs from the machine and copies the data to your workspace for analysis. 

Data collection is required to provide visibility into missing updates, misconfigured OS security settings, endpoint protection status, and health and threat detections.

- [How to enable automatic provisioning of the Log Analytics Agent](https://docs.microsoft.com/azure/security-center/security-center-enable-data-collection)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.5: Configure security log storage retention

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32892.).

**Guidance**: After onboarding your Azure Kubernetes Service (AKS) instances to Azure Monitor for containers, set the corresponding Azure Log Analytics workspace retention period according to your organization's compliance regulations.

- [How to set log retention parameters for Log Analytics Workspaces](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.6: Monitor and review Logs

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32893.).

**Guidance**: Onboard your Azure Kubernetes Service (AKS) instances to Azure Monitor for containers and configure diagnostic settings for your cluster. Use Azure Monitor's Log Analytics workspace to review logs and perform queries on log data. Azure Monitor logs are enabled and managed in the Azure portal, or through CLI, and work with both RBAC and non-RBAC enabled AKS clusters.

For troubleshooting your application and services, you may need to view the logs generated by these master components (kube-apiserver and kube-controllermanager).

Alternatively, you may enable and on-board data to Azure Sentinel or a third party SIEM for central log management and monitoring of these logs.

- [How to enable and review Kubernetes master node logs in AKS](https://docs.microsoft.com/azure/aks/view-master-logs)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)

- [How to perform custom queries in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/log-query/get-started-queries)



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 2.7: Enable alerts for anomalous activities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32894.).

**Guidance**: Use Azure Kubernetes Service (AKS) together with Azure Security Center's Standard Tier to gain deeper visibility into your AKS nodes.
Through continuous analysis of raw security events occurring in your AKS cluster, such as network data, process creation, and the Kubernetes audit log, Security Center alerts you to threats and malicious activity detected at the host and AKS cluster level.

Determine if this activity is expected behavior or whether the application is misbehaving. Use metrics and logs in Azure Monitor to substantiate your findings. 

Use "Failed" category for SNAT Connections metric for example. https://docs.microsoft.com/azure/load-balancer/load-balancer-monitor-log

- [Understand Azure Kubernetes Services integration with Security Center](https://docs.microsoft.com/azure/security-center/azure-kubernetes-service-integration)

- [How to enable Azure Security Center Standard Tier](https://docs.microsoft.com/azure/security-center/security-center-get-started)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 2.8: Centralize anti-malware logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32895.).

**Guidance**: Not applicable; it is recommended to review the Azure marketplace for a containerized 3rd party anti-malware solution to their cluster, based on business need.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.9: Enable DNS query logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32896.).

**Guidance**: Azure Kubernetes Service (AKS) uses the CoreDNS project for cluster DNS management and resolution with all 1.12.x and higher clusters. 

DNS query logging can be enabled by applying the following configuration in your coredns-custom ConfigMap:

apiVersion: v1

kind: ConfigMap

metadata:

name: coredns-custom

namespace: kube-system

data:

log.override: |

log

- [Customize CoreDNS with Azure Kubernetes Service](https://docs.microsoft.com/azure/aks/coredns-custom)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 2.10: Enable command-line audit logging

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32897.).

**Guidance**: Not applicable; Azure Kubernetes Service (AKS) nodes are managed and not generally accessible by customers.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Identity and access control

*For more information, see [Security control: Identity and access control](/azure/security/benchmarks/security-control-identity-access-control).*

### 3.1: Maintain an inventory of administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32898.).

**Guidance**: Kubernetes itself does not provide an identity management solution where regular user accounts and passwords are stored. Instead, external identity solutions can be integrated into Kubernetes. For AKS clusters, this integrated identity solution is Azure Active Directory. With Azure AD integration, you can grant users or groups access to Kubernetes resources within a namespace or across the cluster. 

You can also use the AAD PowerShell module to perform ad hoc queries to discover accounts that are members of your AKS administrative groups; reconcile access on a regular basis. You can use Azure CLI for operations such as ‘Get access credentials for a managed Kubernetes cluster’

You can use Azure CLI for operations such as ‘Get access credentials for a managed Kubernetes cluster’

Additionally, use Azure Security Center Identity and Access Management recommendations.

To avoid needing an Owner or Azure account administrator role, you can configure a service principal manually or use an existing service principal to authenticate ACR (Azure Container Resources) from AKS.

One of the primary user types in Kubernetes is a service account. A service account exists in, and is managed by, the Kubernetes API. The credentials for service accounts are stored as Kubernetes secrets, which allows them to be used by authorized pods to communicate with the API Server. Most API requests provide an authentication token for a service account or a normal user account.

- [Use Azure CLI for operations](https://docs.microsoft.com/cli/azure/aks?view=azure-cli-latest)

- [Understand AKS Azure Active Directory integration](https://docs.microsoft.com/azure/aks/concepts-identity)

- [How to integrate AKS with Azure Active Directory](https://docs.microsoft.com/azure/aks/azure-ad-integration)

- [Integrate AKS-managed Azure AD (Preview)](https://docs.microsoft.com/azure/aks/managed-aad)

- [How to get a directory role in AAD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

- [ How to monitor identity and access with Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.2: Change default passwords where applicable

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32899.).

**Guidance**: Kubernetes itself does not have the concept of common default passwords or provide an identity management solution where regular user accounts and passwords are stored. Instead, external identity solutions, such as Azure Active Directory can be integrated into Kubernetes. 

- [Understand access and identity options for AKS](https://docs.microsoft.com/azure/aks/concepts-identity)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.3: Use dedicated administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32900.).

**Guidance**: Integrate authentication for your Azure Kubernetes Service (AKS) clusters with Azure Active Directory. Create policies and procedures around the use of dedicated administrative accounts. Use Azure Security Center Identity and Access Management recommendations.

Azure Kubernetes Service (AKS) can be configured to use Azure Active Directory (AD) for user authentication. In this configuration, you sign in to an AKS cluster using an Azure AD authentication token. You can also configure Kubernetes role-based access control (RBAC) to limit access to cluster resources based a user's identity or group membership.

Use Azure AD group membership to control access to namespaces and cluster resources using Kubernetes RBAC in an AKS cluster

You can interact with Kubernetes clusters using the kubectl tool. The Azure CLI provides an easy way to get the access credentials and configuration information to connect to your AKS clusters using kubectl. To limit who can get that Kubernetes configuration (kubeconfig) information and to limit the permissions they then have, you can use Azure role-based access controls (RBAC).

- [Understand AKS Azure Active Directory integration](https://docs.microsoft.com/azure/aks/concepts-identity)

- [How to monitor identity and access with Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)

- [Control access to cluster resources](https://docs.microsoft.com/azure/aks/azure-ad-rbac)

- [Use Azure role-based access controls](https://docs.microsoft.com/azure/aks/control-kubeconfig-access)



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.4: Use single sign-on (SSO) with Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32901.).

**Guidance**: Use Single sign-on for Azure Kubernetes Service (AKS) as it supports Azure Active Directory authentication for an AKS cluster.

- [How to view Kubernetes logs, events, and pod metrics in real-time](https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-livedata-overview)


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32902.).

**Guidance**: Integrate Authentication for Azure Kubernetes Service (AKS) with Azure Active Directory (AAD). Enable AAD multi-factor authentication (MFA) and follow Azure Security Center Identity and Access Management recommendations.

- [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

How to monitor identity and access within Azure Security 

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32903.).

**Guidance**: Use PAWs (privileged access workstations) with multi-factor authentication (MFA) configured to log into and configure your Azure Kubernetes Service (AKS) clusters and related resources.
- [Learn about Privileged Access Workstations](https://docs.microsoft.com/windows-server/identity/securing-privileged-access/privileged-access-workstations)

- [How to enable MFA in Azure](https://docs.microsoft.com/azure/active-directory/authentication/howto-mfa-getstarted)

- [Control access to cluster resources using role-based access control and Azure Active Directory identities in Azure Kubernetes Service](https://docs.microsoft.com/azure/aks/azure-ad-rbac)

- [Use Azure role-based access controls to define access to the Kubernetes configuration file in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/control-kubeconfig-access)

- [Secure access to the API server using authorized IP address ranges in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/api-server-authorized-ip-ranges)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.7: Log and alert on suspicious activities from administrative accounts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32904.).

**Guidance**: If you have integrated authentication for Azure Kubernetes Service (AKS) with Azure Active Directory (AAD), use Azure Active Directory security reports for generation of logs and alerts when suspicious or unsafe activity occurs in the environment. Use Azure Security Center to monitor identity and access activity.

- [How to identify AAD users flagged for risky activity](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-user-at-risk)

- [How to monitor users identity and access activity in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.8: Manage Azure resources only from approved locations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32905.).

**Guidance**: Integrated authentication for Azure Kubernetes Service (AKS) with Azure Active Directory and use Conditional Access Named Locations to allow access from only specific logical groupings of IP address ranges or countries/regions.

In Kubernetes, the API server receives requests to perform actions in the cluster such as to create resources or scale the number of nodes. The API server is the central way to interact with and manage a cluster. 

To improve cluster security and minimize attacks, the API server should only be accessible from a limited set of IP address ranges.

- [Secure access to the API server using authorized IP address ranges in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/api-server-authorized-ip-ranges)

- [How to configure Named Locations in Azure](https://docs.microsoft.com/azure/active-directory/reports-monitoring/quickstart-configure-named-locations)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.9: Use Azure Active Directory

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32906.).

**Guidance**: Use Azure Active Directory (AAD) as the central authentication and authorization system and integrate Authentication for AKS with AAD. AAD protects data by using strong encryption for data at rest and in transit. AAD also salts, hashes, and securely stores user credentials.

To assign a policy definition to your Kubernetes cluster, you must be assigned the appropriate role-based access control (RBAC) policy assignment operations. The built-in RBAC roles Resource Policy Contributor and Owner have these operations.
https://docs.microsoft.com/azure/governance/policy/overview

For additional reference, AKS uses several managed identities for built-in services and add-ons. https://docs.microsoft.com/azure/aks/use-managed-identity#summary-of-managed-identities

- [How to create and configure an AAD instance](https://docs.microsoft.com/azure/active-directory-domain-services/tutorial-create-instance)

- [How to integrate Azure Active Directory with AKS](https://docs.microsoft.com/azure/aks/azure-ad-integration) 

- [Integrate AKS-managed Azure AD (Preview)](https://docs.microsoft.com/azure/aks/managed-aad)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.10: Regularly review and reconcile user access

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32907.).

**Guidance**: Integrate authentication for Azure Kubernetes Service (AKS) with Azure Active Directory (AAD) and use Azure AD logs to help discover stale accounts. In addition, you may use Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. Remediate Identity and Access recommendations from Azure Security Center.

Any cluster actions taken by Microsoft support are made with user consent under a built-in Kubernetes "edit" role of the name aks-support-rolebinding . With this role AKS support is enabled to edit cluster configuration and resources to troubleshoot and diagnose cluster issues, but the role can not modify permissions nor create roles or role bindings. 
Role access is only enabled under active support tickets with just-in-time (JIT) access.

 
- [Access and identity options for Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/concepts-identity)

- [Understand AAD Logs](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-audit-logs)

- [How to use Azure Identity Access Reviews](https://docs.microsoft.com/azure/active-directory/governance/access-reviews-overview)

- [How to monitor user’s identity and access activity in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 3.11: Monitor attempts to access deactivated credentials

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32908.).

**Guidance**: Integrate authentication for Azure Kubernetes Service (AKS) with Azure Active Directory. Create Diagnostic Settings for Azure Active Directory, sending the audit and sign-in logs to an Azure Log Analytics workspace. Configure desired Alerts (such as when a deceived account attempts to login) within Azure Log Analytics workspace.
- [How to integrate Azure Activity Logs into Azure Monitor](https://docs.microsoft.com/azure/active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics)

- [How to create, view, and manage log alerts using Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-log)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.12: Alert on account login behavior deviation

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32909.).

**Guidance**: Integrate authentication for Azure Active Directory with Azure Active Directory(AAD) and use AAD Risk Detections and Identity Protection feature to configure automated responses to detected suspicious actions related to user identities. 

Additionally, you can ingest data into Azure Sentinel for further investigation.

- [How to view AAD risky sign-ins](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-risky-sign-ins)

- [How to configure and enable Identity Protection risk policies](https://docs.microsoft.com/azure/active-directory/identity-protection/howto-identity-protection-configure-risk-policies)

- [How to onboard Azure Sentinel](https://docs.microsoft.com/azure/sentinel/quickstart-onboard)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 3.13: Provide Microsoft with access to relevant customer data during support scenarios

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32910.).

**Guidance**: Not available; Customer Lockbox is not yet supported for Azure Kubernetes Service (AKS).

- [List of Customer Lockbox supported services](https://docs.microsoft.com/azure/security/fundamentals/customer-lockbox-overview#supported-services-and-scenarios-in-general-availability)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data protection

*For more information, see [Security control: Data protection](/azure/security/benchmarks/security-control-data-protection).*

### 4.1: Maintain an inventory of sensitive Information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32911.).

**Guidance**: Use tags on resources related to your Azure Kubernetes Service (AKS) deployments to assist in tracking Azure resources that store or process sensitive information.

- [How to create and use Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

- [Managed Clusters - Update Tags](https://docs.microsoft.com/rest/api/aks/managedclusters/updatetags)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.2: Isolate systems storing or processing sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32912.).

**Guidance**: Azure Kubernetes Service (AKS) provides features that let you logically isolate teams and workloads in the same cluster. The goal should be to provide the least number of privileges, scoped to the resources each team needs. 

A namespace in Kubernetes creates a logical isolation boundary. Additional Kubernetes features and considerations for isolation and multi-tenancy include the following areas: scheduling, networking, authentication/authorization, and containers.

Additionally, you may implement separate subscriptions and/or management groups for development, test, and production. AKS clusters should be separated by virtual network/subnet, tagged appropriately, and secured within a Web Application Firewall.

- [Learn about best practices for cluster isolation in AKS](https://docs.microsoft.com/azure/aks/operator-best-practices-cluster-isolation)

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

- [Understand best practices for network connectivity and security in AKS](https://docs.microsoft.com/azure/aks/operator-best-practices-network)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.3: Monitor and block unauthorized transfer of sensitive information

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32913.).

**Guidance**: To increase the security of your Azure Kubernetes Service (AKS) cluster, restrict egress traffic to addresses, ports, and domain names that are required for your use case. 

AKS clusters are configured to pull base system container images from Microsoft Container Registry or Azure Container Registry. If you lock down the egress traffic, define specific ports and FQDNs to allow the AKS nodes to correctly communicate with required external services. Without these authorized ports and FQDNs, your AKS nodes can't communicate with the API server or install core components.
You can use Azure Firewall or a third-party firewall appliance to secure your egress traffic and define the required addresses, ports, and domain names. AKS does not automatically create these rules for you.

If using Azure Firewall, enable Diagnostic Settings to log rule matches. Use Azure Monitor Activity Log to detect changes to the Azure Firewall(s) being used to limit egress traffic on your AKS cluster(s).

For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. 

To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [List of required ports, addresses, and domain names for AKS functionality](https://docs.microsoft.com/azure/aks/limit-egress-traffic)

- [How to configure Diagnostic Settings for Azure Firewall](https://docs.microsoft.com/azure/firewall/tutorial-diagnostics)

- [How to create alerts in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-activity-log)

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Microsoft

### 4.4: Encrypt all sensitive information in transit

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32914.).

**Guidance**: Create an HTTPS ingress controller and use your own TLS certificates (or optionally, Let's Encrypt) for your Azure Kubernetes Service (AKS) deployments.

Kubernetes egress traffic (for example, communication with the API server or downloading core Kubernetes cluster components and node security updates) is encrypted by default over HTTPS/TLS.

Potentially un-encrypted egress traffic from your AKS instance may include NTP traffic, DNS traffic, and in some cases, HTTP traffic for retrieving updates.

- [How to create an HTTPS ingress controller on AKS and use your own TLS certificates](https://docs.microsoft.com/azure/aks/ingress-own-tls)

- [How to create an HTTPS ingress controller on AKS with Let's Encrypt](https://docs.microsoft.com/azure/aks/ingress-tls)

- [List of potential out-going ports and protocols used by AKS](https://docs.microsoft.com/azure/aks/limit-egress-traffic)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.5: Use an active discovery tool to identify sensitive data

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32915.).

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. 

To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.6: Use Azure RBAC to manage access to resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32916.).

**Guidance**: Azure Kubernetes Service (AKS) can be configured to use Azure Active Directory (AAD) for user authentication. In this configuration, you sign in to an AKS cluster using an AAD authentication token. 

You can configure Kubernetes RBAC to limit access to cluster resources based a user's identity or group membership.

- [How to control access to cluster resources using RBAC and Azure AD Identities in AKS](https://docs.microsoft.com/azure/aks/azure-ad-rbac)

Users can control k8s RBAC from Azure. Allowing IAM at scale for many clusters. Feature (pending availability) at https://aka.ms/aks/azure-rbac



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 4.7: Use host-based data loss prevention to enforce access control

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32917.).

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.
For the underlying platform which is managed by Microsoft, Microsoft treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](https://docs.microsoft.com/azure/security/fundamentals/protection-customer-data)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.8: Encrypt sensitive information at rest

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32918.).

**Guidance**: Azure Storage encrypts all data in a storage account at rest. By default, data is encrypted with Microsoft-managed keys. For additional control over encryption keys, you can supply customer-managed keys (BYOK) to use for encryption of both the OS and data disks for your Azure Kubernetes Service (AKS) clusters.

If using customer-managed keys, you are responsible for key management activities such as key backup and rotation.

- [Understand encryption-at-rest and BYOK with AKS](https://docs.microsoft.com/azure/aks/azure-disk-customer-managed-keys)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 4.9: Log and alert on changes to critical Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32919.).

**Guidance**: Azure Monitor for containers is a feature designed to monitor the performance of container workloads deployed to managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS). 

Configure alerts to proactively notify you or create logs when CPU and memory utilization on nodes or containers exceed your thresholds, or when a health state change occurs in the cluster at the infrastructure or nodes health rollup. Integrate with Prometheus to view application and workload metrics it collects from nodes and Kubernetes using queries to create custom alerts, dashboards, and detailed perform detailed analysis.

You may also use Azure Activity Log to monitor your AKS clusters and related resources at a high level. Create alerts within Azure Monitor that will trigger when changes to these resources takes place.

- [Understand Azure Monitor for Containers](https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-overview)

- [How to enable Azure Monitor for containers](https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-onboard)

- [How to view and retrieve Azure Activity Log events](https://docs.microsoft.com/azure/azure-monitor/platform/activity-log-view)



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Vulnerability management

*For more information, see [Security control: Vulnerability management](/azure/security/benchmarks/security-control-vulnerability-management).*

### 5.1: Run automated vulnerability scanning tools

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32920.).

**Guidance**: To monitor your Azure Container Registry (including Azure Kubernetes Service (AKS) instances) for vulnerabilities, ensure you have Azure Security Center Standard Tier enabled. 

Enable the optional Container Registries bundle. When a new image is pushed, Security Center scans the image using a scanner from the industry-leading vulnerability scanning vendor, Qualys. When issues are found, you’ll get notified in the Security Center dashboard. 

For every vulnerability, Security Center provides actionable recommendations, along with a severity classification, and guidance for how to remediate the issue.  or details of Security Center's recommendations, see the reference list of recommendations.

There is also Azure Container Registry integration with Security Center to help protect your images and registry from vulnerabilities.

If you're on Azure Security Center's standard tier, you can add the Container Registries bundle. This optional feature brings deeper visibility into the vulnerabilities of the images in your ARM-based registries. Enable or disable the bundle at the subscription level to cover all registries in a subscription. 

This feature is charged per image, as shown on the pricing page. Enabling the Container Registries bundle, ensures that Security Center is ready to scan images that get pushed to the registry.

- [Best practices for container image management and security in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/security-center/azure-container-registry-integration)

- [Understand best practices for container image management and security in AKS](https://docs.microsoft.com/azure/aks/operator-best-practices-container-image-management)

- [Understand container Registry integration with Azure Security Center](https://docs.microsoft.com/azure/security-center/azure-container-registry-integration)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.2: Deploy automated operating system patch management solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32921.).

**Guidance**: To protect your Azure Kubernetes Service (AKS) clusters, security updates are automatically applied to Linux nodes. These updates include OS security fixes or kernel updates. Some of these updates require a node reboot to complete the process. 

Note that AKS doesn't automatically reboot these Linux nodes to complete the update process.
The process to keep Windows Server nodes up to date differs from nodes running Linux. Windows Server nodes don't receive daily updates. Instead, you perform an AKS upgrade that deploys new nodes with the latest base Window Server image and patches. 

Microsoft doesn't automatically reboot worker nodes to apply OS-level patches. Although OS patches are delivered to the worker nodes, the customer is responsible for rebooting the worker nodes to apply the changes. 

Shared libraries, daemons such as solid-state hybrid drive (SSHD), and other components at the level of the system or OS are automatically patched.

Customers are responsible for executing Kubernetes upgrades. They can execute upgrades through the Azure control panel or the Azure CLI. This applies for updates that contain security or functionality improvements to Kubernetes.

- [Understand how updates are applied to AKS cluster nodes running Linux](https://docs.microsoft.com/azure/aks/node-updates-kured)

- [How to upgrade an AKS node pool for AKS clusters that use Windows Server nodes)](https://docs.microsoft.com/azure/aks/use-multiple-node-pools#upgrade-a-node-pool)

- [Preview - Azure Kubernetes Service (AKS) node image upgrades](https://docs.microsoft.com/azure/aks/node-image-upgrade)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.3: Deploy an automated patch management solution for third-party software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32922.).

**Guidance**: Implement a manual process to ensure Azure Kubernetes Service (AKS) cluster node's third-party applications remain patched for the duration of the cluster lifetime which may require enabling automatic updates, monitoring the nodes, or performing periodic reboots.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.4: Compare back-to-back vulnerability scans

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32923.).

**Guidance**: Export Azure Security Center scan results at consistent intervals and compare the results to verify that vulnerabilities have been remediated. 

Use the PowerShell cmdlet "Get-AzSecurityTask" to automate the retrieval of security tasks that Azure Security Center recommends you to do in order to strengthen your security posture and remediation vulnerability scan findings.

- [How to use PowerShell to view vulnerabilities discovered by Azure Security Center](https://docs.microsoft.com/powershell/module/az.security/get-azsecuritytask?view=azps-3.3.0)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32924.).

**Guidance**: Use the severity rating provided by Azure Security Center to prioritize the remediation of vulnerabilities. If using a built-in vulnerability assessment tool (such as Qualys or Rapid7, which are offered by Azure), use CVSS or whatever scoring systems is provided by your scanning tool.

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

## Inventory and asset management

*For more information, see [Security control: Inventory and asset management](/azure/security/benchmarks/security-control-inventory-asset-management).*

### 6.1: Use automated asset discovery solution

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32925.).

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, etc.) within your subscription(s). 

Ensure that you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager (ARM) resources going forward.

- [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)

- [How to view your Azure Subscriptions](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0)

- [Understand Azure RBAC](https://docs.microsoft.com/azure/role-based-access-control/overview)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.2: Maintain asset metadata

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32926.).

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

- [How to create and use tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.3: Delete unauthorized Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32927.).

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. 

When creating a node pool, you can add taints, labels, or tags to that node pool. When you add a taint, label, or tag, all nodes within that node pool also get that taint, label, or tag.

You can use taints, labels and/or tags to reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

- [How to create and user Tags](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags)

- [Managed Clusters - Update Tags](https://docs.microsoft.com/rest/api/aks/managedclusters/updatetags)

- [Specify a taint, label, or tag for a node pool](https://docs.microsoft.com/azure/aks/use-multiple-node-pools#specify-a-taint-label-or-tag-for-a-node-pool)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.4: Define and maintain an inventory of approved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32928.).

**Guidance**: It is recommended to define a list of approved Azure resources and approved software for compute resources.


**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.5: Monitor for unapproved Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32929.).

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:
-	Not allowed resource types 

-	Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscription(s). Ensure that all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to create queries with Azure Graph](https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.6: Monitor for unapproved software applications within compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32930.).

**Guidance**: You can use the Azure Automation Change Tracking and Inventory feature to find out what software is installed in your environment. You can collect and view inventory for software, files, Linux daemons, Windows services, and Windows Registry keys on your computers and monitor for unapproved software applications. 

Tracking the configurations of your machines can help you pinpoint operational issues across your environment and better understand the state of your machines.

- [How to enable Azure virtual machine Inventory](https://docs.microsoft.com/azure/automation/automation-tutorial-installed-software)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.7: Remove unapproved Azure resources and software applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32931.).

**Guidance**: You can use the Azure Automation Change Tracking and Inventory feature to find out what software is installed in your environment. 

You can collect and view inventory for software, files, Linux daemons, Windows services, and Windows Registry keys on your computers and monitor for unapproved software applications and remove unapproved Azure resources as well. 
Tracking the configurations of your machines can help you pinpoint operational issues across your environment and better understand the state of your machines.

- [How to use File Integrity Monitoring](https://docs.microsoft.com/azure/security-center/security-center-file-integrity-monitoring#using-file-integrity-monitoring)

- [Understand Azure Change Tracking](https://docs.microsoft.com/azure/automation/change-tracking)

- [How to enable Azure virtual machine inventory](https://docs.microsoft.com/azure/automation/automation-tutorial-installed-software)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.8: Use only approved applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32932.).

**Guidance**: You can use the Azure
Automation Change Tracking and Inventory feature to find out what software is
installed in your environment. You can collect and view inventory for software,
files, Linux daemons, Windows services, and Windows Registry keys on your
computers and monitor for unapproved software applications and remove
unapproved Azure resources as well. How
to use Azure Security Center Adaptive Application
- [Controls](https://docs.microsoft.com/azure/security-center/security-center-adaptive-application)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.9: Use only approved Azure services

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32933.).

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in your subscription(s) using built-in policy definitions.
Azure Policy extends Gatekeeper v3, an admission controller webhook for Open Policy Agent (OPA), to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner.

Azure Policy makes it possible to manage and report on the compliance state of your Kubernetes clusters from one place. The add-on enacts the following functions:

•	Checks with Azure Policy service for policy assignments to the cluster.

•	Deploys policy definitions into the cluster as constraint template and constraint custom resources.

•	Reports auditing and compliance details back to Azure Policy service.

- [Understand Azure Policy for Kubernetes clusters (preview)](https://docs.microsoft.com/azure/governance/policy/concepts/policy-for-kubernetes)

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.10: Maintain an inventory of approved software titles

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32934.).

**Guidance**: Use Azure policy to put restrictions on the type of resources that can be created in your subscription(s) using the following built-in policy definitions.

Azure Policy extends Gatekeeper v3, an admission controller webhook for Open Policy Agent (OPA), to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner. Azure Policy makes it possible to manage and report on the compliance state of your Kubernetes clusters from one place. 

The add-on enacts the following functions:

•	Checks with Azure Policy service for policy assignments to the cluster.

•	Deploys policy definitions into the cluster as constraint template and constraint custom resources.

•	Reports auditing and compliance details back to Azure Policy service.

- [Understand Azure Policy for Kubernetes clusters (preview)](https://docs.microsoft.com/azure/governance/policy/concepts/policy-for-kubernetes)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.11: Limit users' ability to interact with Azure Resource Manager

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32935.).

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager (ARM) by configuring "Block access" for the "Microsoft Azure Management" App.
- [How to configure Conditional Access to block access to ARM](https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 6.12: Limit users' ability to execute scripts in compute resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32936.).

**Guidance**: Azure Kubernetes Service (AKS) itself doesn't provide an identity management solution where regular user accounts and passwords are stored. Instead, use Azure Active Directory (AAD) as the integrated identity solution for your Azure Kubernetes Service (AKS) clusters. With Azure AD integration, you can grant users or groups access to Kubernetes resources within a namespace or across the cluster. 

Use the AAD PowerShell module to perform ad hoc queries to discover accounts that are members of your AKS administrative groups; reconcile access on a regular basis. 

Implement Azure Security Center Identity and Access Management recommendations.

You can use Azure CLI for operations such as ‘Get access credentials for a managed Kubernetes cluster’

- [Manage Azure Kubernetes Services with Azure CLI](https://docs.microsoft.com/cli/azure/aks?view=azure-cli-latest)

- [Understand AKS Azure Active Directory integration](https://docs.microsoft.com/azure/aks/concepts-identity)

- [How to integrate AKS with Azure Active Directory](https://docs.microsoft.com/azure/aks/azure-ad-integration)

- [Integrate AKS-managed Azure AD (Preview)](https://docs.microsoft.com/azure/aks/managed-aad)

- [How to get a directory role in AAD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrole?view=azureadps-2.0)

- [How to get members of a directory role in Azure AD with PowerShell](https://docs.microsoft.com/powershell/module/azuread/get-azureaddirectoryrolemember?view=azureadps-2.0)

- [How to monitor identity and access with Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-identity-access)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 6.13: Physically or logically segregate high risk applications

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32937.).

**Guidance**: Azure Kubernetes Service (AKS) provides features that let you logically isolate teams and workloads in the same cluster. The goal should be to provide the least number of privileges, scoped to the resources each team needs. 

A namespace in Kubernetes creates a logical isolation boundary. Additional Kubernetes features and considerations for isolation and multi-tenancy include the following areas: scheduling, networking, authentication/authorization, and containers.

Additionally, you may implement separate subscriptions and/or management groups for development, test, and production. AKS clusters should be separated by virtual network/subnet, tagged appropriately, and secured within a Web Application Firewall.

- [Learn about best practices for cluster isolation in AKS](https://docs.microsoft.com/azure/aks/operator-best-practices-cluster-isolation)

- [How to create additional Azure subscriptions](https://docs.microsoft.com/azure/billing/billing-create-subscription)

- [How to create Management Groups](https://docs.microsoft.com/azure/governance/management-groups/create)

- [Understand best practices for network connectivity and security in AKS](https://docs.microsoft.com/azure/aks/operator-best-practices-network)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Secure configuration

*For more information, see [Security control: Secure configuration](/azure/security/benchmarks/security-control-secure-configuration).*

### 7.1: Establish secure configurations for all Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32938.).

**Guidance**: You may use Azure Policy aliases in the "Microsoft.ContainerService" namespace to create custom policies to audit or enforce the configuration of your AKS instances. 

You may also use built-in policies. Examples of built-in policy definitions for AKS include:
•	Enforce HTTPS ingress in Kubernetes cluster

•	Authorized IP ranges should be defined on Kubernetes Services

•	Based Access Control (RBAC) should be used on Kubernetes Services

•	Ensure only allowed container images in Kubernetes cluster

Use Azure policy to put restrictions on the type of resources that can be created in your subscription(s) using built-in policy definitions.

Azure Policy extends Gatekeeper v3, an admission controller webhook for Open Policy Agent (OPA), to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner. Azure Policy makes it possible to manage and report on the compliance state of your Kubernetes clusters from one place. 

The add-on enacts the following functions:

•	Checks with Azure Policy service for policy assignments to the cluster.

•	Deploys policy definitions into the cluster as constraint template and constraint custom resources.

•	Reports auditing and compliance details back to Azure Policy service.

- [Understand Azure Policy for Kubernetes clusters (preview)](https://docs.microsoft.com/azure/governance/policy/concepts/policy-for-kubernetes)

- [How to configure and manage AKS pod security policies](https://docs.microsoft.com/azure/aks/use-pod-security-policies)

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.2: Establish secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32939.).

**Guidance**: Azure Kubernetes Service (AKS) is a secure service compliant with SOC, ISO, PCI DSS, and HIPAA standards. AKS clusters are deployed on host virtual machines, which run a security optimized OS. This host OS is currently based on an Ubuntu 16.04.LTS image with a set of additional security hardening steps applied (see Security hardening details). 

The goal of the security hardened host OS is to reduce the surface area of attack and allow the deployment of containers in a secure fashion.` 

AKS provides a security optimized host OS by default. There is no option to select an alternate operating system.
Azure applies daily patches (including security patches) to AKS virtual machine hosts. Some of these patches will require a reboot, while others will not. You are responsible for scheduling AKS VM host reboots as needed. For guidance on how to automate AKS patching see patching AKS nodes.

Security hardening for AKS agent node host OSAKS clusters are deployed on host virtual machines, which run a security optimized OS which is utilized for containers running on AKS. 

- [Security hardening for AKS agent node host OS](https://docs.microsoft.com/azure/aks/security-hardened-vm-host-image)

- [Understand security hardening in AKS virtual machine hosts](https://docs.microsoft.com/azure/aks/security-hardened-vm-host-image)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.3: Maintain secure Azure resource configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32940.).

**Guidance**: Secure your Azure Kubernetes Service (AKS) cluster using pod security policies. To improve the security of your cluster, you can limit what pods can be scheduled. Pods that request resources you don't allow can't run in the AKS cluster. You define this access using pod security policies.

In addition, you may use Azure policy [deny] and [deploy if not exist] to enforce secure settings for the Azure resources related to your AKS deployments (such as Virtual Networks, Subnets, Azure Firewalls, Storage Accounts, etc.). 

You may use Azure Policy Aliases from the following namespaces to create custom policies:

•	Microsoft.ContainerService

•	Microsoft.Network

Use Azure Policy aliases in the "Microsoft.ContainerService" namespace to create custom policies to audit or enforce the configuration of your AKS instances. 

Implement built-in policies. Examples of built-in policy definitions for AKS include:

•	Enforce HTTPS ingress in Kubernetes cluster

•	Authorized IP ranges should be defined on Kubernetes Services

•	Based Access Control (RBAC) should be used on Kubernetes Services

•	Ensure only allowed container images in Kubernetes cluster

Use Azure policy to put restrictions on the type of resources that can be created in your subscription(s) using the following built-in policy definitions.

Azure Policy extends Gatekeeper v3, an admission controller webhook for Open Policy Agent (OPA), to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner. Azure Policy makes it possible to manage and report on the compliance state of your Kubernetes clusters from one place. 

The add-on enacts the following functions:

•	Checks with Azure Policy service for policy assignments to the cluster.

•	Deploys policy definitions into the cluster as constraint template and constraint custom resources.

•	Reports auditing and compliance details back to Azure Policy service.

- [Understand Azure Policy for Kubernetes clusters (preview)](https://docs.microsoft.com/azure/governance/policy/concepts/policy-for-kubernetes)

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [Understand Azure Policy Effects](https://docs.microsoft.com/azure/governance/policy/concepts/effects)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.4: Maintain secure operating system configurations

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32941.).

**Guidance**: When you create an Azure Kubernetes Service (AKS) cluster, a control plane is automatically created and configured. This control plane is provided as a managed Azure resource abstracted from you (as the user). There's no cost for the control plane, only the nodes that are part of the AKS cluster. The managed control plane includes the 'etcd store', which is used to maintain the state of your Kubernetes cluster and configuration.

Having a managed control plane means that you don't need to configure components like a highly available etcd store, but it also means that you can't access the control plane directly. Upgrades to Kubernetes are orchestrated through the Azure CLI or Azure portal, which upgrades the control plane and then the nodes.

- [Understand state configuration of AKS clusters](https://docs.microsoft.com/azure/aks/concepts-clusters-workloads#control-plane)

- [Understand security hardening in AKS virtual machine hosts](https://docs.microsoft.com/azure/aks/security-hardened-vm-host-image)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.5: Securely store configuration of Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32942.).

**Guidance**: If using custom Azure policy definitions, utilize Azure DevOps/Repos to securely store and manage your code.

Security hardening for AKS agent node host OS

https://docs.microsoft.com/azure/aks/security-hardened-vm-host-image

- [How to store code in Azure DevOps](https://docs.microsoft.com/azure/devops/repos/git/gitworkflow?view=azure-devops)

- [Azure Repos Documentation](https://docs.microsoft.com/azure/devops/repos/index?view=azure-devops)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.6: Securely store custom operating system images

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32943.).

**Guidance**: Not available; Azure Kubernetes Service (AKS) provides a security optimized host OS by default. There is no current option to select an alternate (or custom) operating system.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.7: Deploy configuration management tools for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32944.).

**Guidance**: Use Azure policy [deny] and [deploy if not exist] to enforce secure settings for the Azure resources related to your Azure Kubernetes Service (AKS) deployments (such as virtual networks, subnets, Azure Firewalls, Azure Storage Accounts, etc.). 

You may use Azure Policy Aliases from the "Microsoft.ContainerService" namespace to create custom policies for your AKS deployments. You may also use built-in policies. 

Examples of built-in policy definitions include:

Enforce HTTPS ingress in Kubernetes cluster Authorized IP ranges should be defined on Kubernetes Services Based Access Control (RBAC) should be used on Kubernetes Services Ensure only allowed container images in Kubernetes cluster

Use Azure policy to put restrictions on the type of resources that can be created in your subscription(s) using built-in policy definitions.

Azure Policy extends Gatekeeper v3, an admission controller webhook for Open Policy Agent (OPA), to apply at-scale enforcements and safeguards on your clusters in a centralized, consistent manner. Azure Policy makes it possible to manage and report on the compliance state of your Kubernetes clusters from one place. 

The add-on enacts the following functions:

•	Checks with Azure Policy service for policy assignments to the cluster.

•	Deploys policy definitions into the cluster as constraint template and constraint custom resources.

•	Reports auditing and compliance details back to Azure Policy service.

- [Understand Azure Policy for Kubernetes clusters (preview)](https://docs.microsoft.com/azure/governance/policy/concepts/policy-for-kubernetes)

- [Understand Azure Policy for Kubernetes clusters (preview)](https://docs.microsoft.com/azure/governance/policy/concepts/policy-for-kubernetes)

- [How to configure and manage Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage)

- [How to create an Azure Blueprint](https://docs.microsoft.com/azure/governance/blueprints/create-blueprint-portal)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.8: Deploy configuration management tools for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32945.).

**Guidance**: When you create an Azure Kubernetes Service (AKS) cluster, a control plane is automatically created and configured. This control plane is provided as a managed Azure resource abstracted from you (as the user). There's no cost for the control plane, only the nodes that are part of the AKS cluster. The managed control plane includes the 'etcd store', which is used to maintain the state of your Kubernetes cluster and configuration.
Having a managed control plane means that you don't need to configure components like a highly available etcd store, but it also means that you can't access the control plane directly. Upgrades to Kubernetes are orchestrated through the Azure CLI or Azure portal, which upgrades the control plane and then the nodes.

- [Understand state configuration of AKS clusters](https://docs.microsoft.com/azure/aks/concepts-clusters-workloads#control-plane)

- [Understand security hardening in AKS virtual machine hosts](https://docs.microsoft.com/azure/aks/security-hardened-vm-host-image)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.9: Implement automated configuration monitoring for Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32946.).

**Guidance**: Use Azure Security Center Standard Tier to perform baseline scans for resources related to your Azure Kubernetes Service (AKS) deployments. 

These resources might include (but are not limited to) the AKS cluster itself, the virtual network your AKS cluster has been deployed to, an Azure Storage Account that you're using to track Terraform state, or Azure Key Vault instances being used for the encryption keys for your AKS cluster's OS and data disks.

- [How to remediate recommendations in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-remediate-recommendations)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 7.10: Implement automated configuration monitoring for operating systems

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32947.).

**Guidance**: Use Azure Security Center container recommendations under "Compute &amp; apps" to perform baseline scans for your Azure Kubernetes Service (AKS) clusters. To monitor your Azure Container Registry, ensure you're on Security Center's Standard Tier. 

Enable the optional Container Registries bundle. When a new image is pushed, Security Center scans the image. When configuration issues or vulnerabilities are found, you’ll be notified in the Security Center dashboard.

- [Understand Azure Security Center container recommendations](https://docs.microsoft.com/azure/security-center/security-center-container-recommendations)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.11: Manage Azure secrets securely

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32948.).

**Guidance**: With Azure Key Vault, you store and regularly rotate secrets such as credentials, storage account keys, or certificates. You can integrate Azure Key Vault with an Azure Kubernetes Service (AKS) cluster using a FlexVolume. The FlexVolume driver lets the AKS cluster natively retrieve credentials from Key Vault and securely provide them only to the requesting pod. Work with your cluster operator to deploy the Key Vault FlexVolume driver onto the AKS nodes. 

You can use a pod managed identity to request access to Key Vault and retrieve the credentials you need through the FlexVolume driver. Ensure Key Vault Soft Delete is enabled. 

Limit credential exposure by not defining credentials in your application code. Use managed identities for Azure resources to let your pod request access to other resources. A digital vault, such as Azure Key Vault, should also be used to store and retrieve digital keys and credentials. 

Pod managed identities is intended for use with Linux pods and container images only. (# any difference from above?)

To limit the risk of credentials being exposed in your application code, avoid the use of fixed or shared credentials. Credentials or keys shouldn't be included directly in your code. If these credentials are exposed, the application needs to be updated and redeployed. A better approach is to give pods their own identity and way to authenticate themselves, or automatically retrieve credentials from a digital vault.

A Kubernetes Secret is used to inject sensitive data into pods, such as access credentials or keys. You first create a Secret using the Kubernetes API. When you define your pod or deployment, a specific Secret can be requested. Secrets are only provided to nodes that have a scheduled pod that requires it, and the Secret is stored in tmpfs, not written to disk. When the last pod on a node that requires a Secret is deleted, the Secret is deleted from the node's tmpfs. Secrets are stored within a given namespace and can only be accessed by pods within the same namespace.

The use of Secrets reduces the sensitive information that is defined in the pod or service YAML manifest. Instead, you request the Secret stored in Kubernetes API Server as part of your YAML manifest. This approach only provides the specific pod access to the Secret. Please note: the raw secret manifest files contains the secret data in base64 format (see the official documentation for more details). Therefore, this file should be treated as sensitive information, and never committed to source control.

Kubernetes secrets are stored in etcd, a distributed key-value store. Etcd store is fully managed by AKS and data is encrypted at rest within the Azure platform.

- [Security concepts for applications and clusters in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/concepts-security)

- [How to use Key Vault with your AKS cluster](https://docs.microsoft.com/azure/aks/developer-best-practices-pod-security#limit-credential-exposure)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.12: Manage identities securely and automatically

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32949.).

**Guidance**: As a best practice, do not define credentials in your application code. 

Use managed identities for Azure resources to let your pod request access to other resources. A digital vault, such as Azure Key Vault, should also be used to store and retrieve digital keys and credentials. 

Pod managed identities is intended for use with Linux pods and container images only.

A managed identity for Azure resources lets a pod authenticate itself against any service in Azure that supports it, such as Azure Key Vault. The pod is assigned an Azure Identity that lets them authenticate to Azure Active Directory and receive a digital token. This digital token can be presented to other Azure services that check if the pod is authorized to access the service and perform the required actions. 

This approach means that no secrets are required for database connection strings, as an example.

Currently, an Azure Kubernetes Service (AKS) cluster (specifically, the Kubernetes cloud provider) requires an identity to create additional resources like load balancers and managed disks in Azure. This identity can be either a managed identity or a service principal. If you use a service principal, you must either provide one or AKS creates one on your behalf. If you use managed identity, this will be created for you by AKS automatically.

Clusters using service principals eventually reach a state in which the service principal must be renewed to keep the cluster working. Managing service principals adds complexity, which is why it's easier to use managed identities instead. The same permission requirements apply for both service principals and managed identities.

Managed identities are essentially a wrapper around service principals, and make their management simpler. Credential rotation for MI happens automatically every 46 days according to Azure Active Directory default. AKS uses both system-assigned and user-assigned managed identity types. These identities are currently immutable. To learn more, read about managed identities for Azure resources.

- [Understand Managed Identities and Key Vault with Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/developer-best-practices-pod-security#limit-credential-exposure)

- [Azure Active Directory Pod Identity](https://github.com/Azure/aad-pod-identity)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 7.13: Eliminate unintended credential exposure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32950.).

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner will also encourage moving discovered credentials to more secure locations such as Azure Key Vault.

Limit credential exposure by not defining credentials in your application code. Use managed identities for Azure resources to let your pod request access to other resources. A digital vault, such as Azure Key Vault, should also be used to store and retrieve digital keys and credentials. 

To limit the risk of credentials being exposed in your application code, avoid the use of fixed or shared credentials. Credentials or keys shouldn't be included directly in your code. If these credentials are exposed, the application needs to be updated and redeployed. A better approach is to give pods their own identity and way to authenticate themselves, or automatically retrieve credentials from a digital vault.

Best practice guidance - Don't define credentials in your application code. Use managed identities for Azure resources to let your pod request access to other resources. A digital vault, such as Azure Key Vault, should also be
used to store and retrieve digital keys and credentials. Pod managed identities is intended for use with Linux pods and container images only.

To limit the risk of credentials being exposed in your application code, avoid the use of fixed or shared credentials.

Credentials or keys shouldn't be included directly in your code. If these credentials are exposed, the application needs to be updated and redeployed. A better approach is to give pods their own identity and way to authenticate
themselves, or automatically retrieve credentials from a digital vault.

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

- [Developer best practices for pod security](https://docs.microsoft.com/azure/aks/developer-best-practices-pod-security)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Malware defense

*For more information, see [Security control: Malware defense](/azure/security/benchmarks/security-control-malware-defense).*

### 8.1: Use centrally managed antimalware software

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32951.).

**Guidance**: Not applicable; this recommendation is intended for platform resources.

- [How to deploy Microsoft Antimalware](https://docs.microsoft.com/azure/security/fundamentals/antimalware)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32952.).

**Guidance**: Microsoft Antimalware is enabled on the underlying host that supports Azure services (for example, Azure Kubernetes Service (AKS)), however, it does not run on your Linux compute resources. 

Pre-scan any files or applications being uploaded to your Linux compute or related resources.

If you're using an Azure Storage Account as a data store or to track Terraform state for your AKS cluster, you may use Azure Security Center's threat detection for data services to detect malware uploaded to storage accounts.

- [Understand Microsoft Antimalware for Azure Cloud Services and Virtual Machines](https://docs.microsoft.com/azure/security/fundamentals/antimalware)

- [Understand Azure Security Center's Threat detection for data services](https://docs.microsoft.com/azure/security-center/security-center-alerts-data-services)



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 8.3: Ensure antimalware software and signatures are updated

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32953.).

**Guidance**: If using Windows Server Azure Kubernetes Service (AKS) cluster nodes, Microsoft Antimalware will automatically install the latest signatures and engine updates by default. 

Follow recommendations in Azure Security Center: "Compute &amp; Apps" to ensure all endpoints are up to date with the latest signatures. For Linux, you must deploy your own anti-malware solution and ensure the engine and signatures remain up-to-date.

- [How to deploy Microsoft Antimalware for Azure Cloud Services and Virtual Machines](https://docs.microsoft.com/azure/security/fundamentals/antimalware)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Data recovery

*For more information, see [Security control: Data recovery](/azure/security/benchmarks/security-control-data-recovery).*

### 9.1: Ensure regular automated back ups

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32954.).

**Guidance**: As a best practice, back up your data using an appropriate tool for your storage type such as Azure Site Recovery. Verify the integrity, and security, of those backups. 

Azure Disks can use built-in snapshot technologies. You may need to look for your applications to flush writes to disk before you perform the snapshot operation. 

Velero can back up persistent volumes along with additional cluster resources and configurations. If you can't remove state from your applications, back up the data from persistent volumes and regularly test the restore operations to verify data integrity and the processes required.

If you use Azure Storage as your Azure Kubernetes Service (AKS) application data store, prepare and test how to migrate your storage from the primary region to the backup region. 

Your applications might use Azure Storage for their data. Because your applications are spread across multiple AKS clusters in different regions, you need to keep the storage synchronized.

- [Best practices for storage and backups in AKS](https://docs.microsoft.com/azure/aks/operator-best-practices-storage)

- [Best practices for business continuity and disaster recovery in AKS](https://docs.microsoft.com/azure/aks/operator-best-practices-multi-region)

- [Understand Azure Site Recovery](https://docs.microsoft.com/azure/site-recovery/site-recovery-overview)

- [How to setup Velero on Azure](https://github.com/vmware-tanzu/velero-plugin-for-microsoft-azure/blob/master/README.md)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 9.2: Perform complete system backups and backup any customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32955.).

**Guidance**: Enable Azure Backup and target your Azure Kubernetes Service (AKS) cluster VMs. Set the desired backup frequency and retention periods. 

If applicable, ensure regular automated backups of your Key Vault Certificates, Keys, Managed Storage Accounts, and Secrets, with the following PowerShell commands:
Backup-AzKeyVaultCertificate Backup-AzKeyVaultKey Backup-AzKeyVaultManagedStorageAccount Backup-AzKeyVaultSecret

Optionally, you may store your Key Vault backups within Azure Backup.

- [How to backup Key Vault Certificates](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultcertificate)

- [How to backup Key Vault Keys](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey)

- [How to backup Key Vault Managed Storage Accounts](https://docs.microsoft.com/powershell/module/az.keyvault/add-azkeyvaultmanagedstorageaccount)

- [How to backup Key Vault Secrets](https://docs.microsoft.com/powershell/module/azurerm.keyvault/backup-azurekeyvaultsecret)

- [How to enable Azure Backup](https://docs.microsoft.com/azure/backup)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 9.3: Validate all backups including customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32956.).

**Guidance**: Ensure ability to periodically perform data restoration of content within Veleor Backup. If necessary, test restore to an isolated virtual network.

Periodically perform data restoration of your Key Vault Certificates, Keys, Managed Storage Accounts, and Secrets, with the following PowerShell commands:

Restore-AzKeyVaultCertificate Restore-AzKeyVaultKey Restore-AzKeyVaultManagedStorageAccount Restore-AzKeyVaultSecret

- [How to restore Key Vault Certificates](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultcertificate?view=azurermps-6.13.0)

- [How to restore Key Vault Keys](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultkey?view=azurermps-6.13.0)

- [How to restore Key Vault Managed Storage Accounts](https://docs.microsoft.com/powershell/module/az.keyvault/backup-azkeyvaultmanagedstorageaccount)

- [How to restore Key Vault Secrets](https://docs.microsoft.com/powershell/module/azurerm.keyvault/restore-azurekeyvaultsecret?view=azurermps-6.13.0)

- [How to recover files from Azure Virtual Machine backup](https://docs.microsoft.com/azure/backup/backup-azure-restore-files-from-vm)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

### 9.4: Ensure protection of backups and customer-managed keys

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32957.).

**Guidance**: On the back end, Azure Backup uses Azure Storage Service Encryption, which protects data at rest.

If Azure Key Vault is being used with your Azure Kubernetes Service (AKS) deployment(s), enable Soft-Delete in Key Vault to protect keys against accidental or malicious deletion.

- [Understand Azure Storage Service Encryption](https://docs.microsoft.com/azure/storage/common/storage-service-encryption)

- [How to enable Soft-Delete in Key Vault](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete?tabs=azure-portal)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Not applicable

## Incident response

*For more information, see [Security control: Incident response](/azure/security/benchmarks/security-control-incident-response).*

### 10.1: Create an incident response guide

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32958.).

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-planning-and-operations-guide)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Customer may also leverage NIST's Computer Security Incident Handling Guide to aid in the creation of their own incident response plan](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.2: Create an incident scoring and prioritization procedure

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32959.).

**Guidance**: Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.
Additionally, clearly mark subscriptions (for ex. production, non-prod) and create a naming system to clearly identify and categorize Azure resources.



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.3: Test security response procedures

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32964.).

**Guidance**: Conduct exercises to test your systems’ incident response capabilities on a regular cadence. Identify weak points and gaps and revise plan as needed.

Refer to NIST's publication: Guide to Test, Training, and Exercise Programs for IT 
- [Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32960.).

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party. Review incidents after the fact to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](https://docs.microsoft.com/azure/security-center/security-center-provide-security-contact-details)



**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### 10.5: Incorporate security alerts into your incident response system

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32961.).

**Guidance**: Export your Azure Security Center alerts and recommendations using the Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. You may use the Azure Security Center data connector to stream the alerts Sentinel.

- [How to configure continuous export](https://docs.microsoft.com/azure/security-center/continuous-export)

- [How to stream alerts into Azure Sentinel](https://docs.microsoft.com/azure/sentinel/connect-azure-security-center)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### 10.6: Automate the response to security alerts

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32962.).

**Guidance**: Use the Workflow Automation feature in Azure Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

- [How to configure Workflow Automation and Logic Apps](https://docs.microsoft.com/azure/security-center/workflow-automation)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Penetration tests and red team exercises

*For more information, see [Security control: Penetration tests and red team exercises](/azure/security/benchmarks/security-control-penetration-tests-red-team-exercises).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

>[!NOTE]
> To revise the text in this section, update the [underlying Work Item](https://dev.azure.com/AzureSecurityControlsBenchmark/AzureSecurityControlsBenchmarkContent/_workitems/edit/32963.).

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies:
https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1

- [You can find more information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, here](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)



**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Next steps

- See the [Azure security benchmark](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
