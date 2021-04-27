---
title: Azure security baseline for Azure Kubernetes Service
description: The Azure Kubernetes Service security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: container-service
ms.topic: conceptual
ms.date: 03/30/2021
ms.author: mbaldwin
ms.custom: subject-security-benchmark, devx-track-azurepowershell

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Kubernetes Service

This security baseline applies guidance from the [Azure Security Benchmark version1.0](../security/benchmarks/overview-v1.md) to Azure Kubernetes. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Kubernetes. **Controls** not applicable to Azure Kubernetes, or for which the responsibility is Microsoft's, have been excluded.

To see how Azure Kubernetes completely maps to the Azure Security Benchmark, see the [full Azure Kubernetes security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-control-network-security.md).*

### 1.1: Protect Azure resources within virtual networks

**Guidance**: By default, a network security group and route table are automatically created with the creation of a Microsoft Azure Kubernetes Service (AKS) cluster. AKS automatically modifies network security groups for appropriate traffic flow as services are created with load balancers, port mappings, or ingress routes. The network security group is automatically associated with the virtual NICs on customer nodes and the route table with the subnet on the virtual network. 

Use AKS network policies to limit network traffic by defining rules for ingress and egress traffic between Linux pods in a cluster based on choice of namespaces and label selectors. Network policy usage requires the Azure CNI plug-in with defined virtual network and subnets and can only be enabled at cluster creation. They cannot be deployed on an existing AKS cluster.

You can implement a private AKS cluster to ensure network traffic between your AKS API server and node pools remains only on the private network. The control plane or API server, resides in an AKS-managed Azure subscription and uses internal (RFC1918) IP addresses, while the customer's cluster or node pool is in their own subscription. The server and the cluster or node pool communicate with each other using the Azure Private Link service in the API server virtual network and a private endpoint that's exposed in the subnet of the customer's AKS cluster.  Alternatively, use a public endpoint for the AKS API server but restrict access with the AKS API Server's Authorized IP Ranges feature. 

- [Security concepts for applications and clusters in Azure Kubernetes Service (AKS)](concepts-security.md)

- [Secure traffic between pods using network policies in Azure Kubernetes Service (AKS)](use-network-policies.md)

- [Create a private Azure Kubernetes Service cluster](private-clusters.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ContainerService**:

[!INCLUDE [Resource Policy for Microsoft.ContainerService 1.1](../../includes/policy/standards/asb/rp-controls/microsoft.containerservice-1-1.md)]

### 1.2: Monitor and log the configuration and traffic of virtual networks, subnets, and NICs

**Guidance**: Use Security Center and follow its network protection recommendations to secure the network resources being used by your Azure Kubernetes Service (AKS) clusters. 

Enable network security group flow logs and send the logs to an Azure Storage account for auditing. You can also send the flow logs to a Log Analytics workspace and then use Traffic Analytics to provide insights into traffic patterns in your Azure cloud to visualize network activity, identify hot spots and security threats, understand traffic flow patterns, and pinpoint network misconfigurations.

- [Understand Network Security provided by Azure Security Center](../security-center/security-center-network-recommendations.md)

- [How to Enable network security flow logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)

- [How to Enable and use Traffic Analytics](../network-watcher/traffic-analytics.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.3: Protect critical web applications

**Guidance**: Use an Azure Application Gateway enabled Web Application Firewall (WAF) in front of an AKS cluster to provide an additional layer of security by filtering the incoming traffic to your web applications. Azure WAF uses a set of rules, provided by The Open Web Application Security Project (OWASP), for attacks, such as, cross site scripting or cookie poisoning against this traffic. 

Use an API gateway for authentication, authorization, throttling, caching, transformation, and monitoring for APIs used in your AKS environment. An API gateway serves as a front door to the microservices, decouples clients from your microservices, and decreases the complexity of your microservices by removing the burden of handling cross cutting concerns.

- [Understand best practices for network connectivity and security in AKS](operator-best-practices-network.md)

- [Application Gateway Ingress Controller ](../application-gateway/ingress-controller-overview.md)

- [Use Azure API Management with microservices deployed in Azure Kubernetes Service](../api-management/api-management-kubernetes.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.4: Deny communications with known malicious IP addresses

**Guidance**: Enable Microsoft Distributed Denial-of-service (DDoS) Standard protection on the virtual networks where Azure Kubernetes Service (AKS) components are deployed for protections against DDoS attacks.

Install the network policy engine and create Kubernetes network policies to control the flow of traffic between pods in AKS as, by default, all traffic is allowed between these pods. Network policy should only be used for Linux-based nodes and pods in AKS. Define rules that limit pod communication for improved security. 

Choose to allow or deny traffic based on settings such as assigned labels, namespace, or traffic port. The required network policies can be automatically applied as pods are dynamically created in an AKS cluster. 

- [Secure traffic between pods using network policies in Azure Kubernetes Service (AKS)](use-network-policies.md)

- [How to configure DDoS protection](../ddos-protection/manage-ddos-protection.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.5: Record network packets

**Guidance**: Use Network Watcher packet capture as required for investigating anomalous activity. 

Network Watcher is enabled automatically in your virtual network's region when you create or update a virtual network in your subscription. You can also create new instances of Network Watcher using PowerShell, the Azure CLI, the REST API, or the Azure Resource Manager Client method

- [How to enable Network Watcher](../network-watcher/network-watcher-create.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.6: Deploy network-based intrusion detection/intrusion prevention systems (IDS/IPS)

**Guidance**: Secure your Azure Kubernetes Service (AKS) cluster with an Azure Application Gateway enabled with a Web Application Firewall (WAF). 

If intrusion detection and/or prevention based on payload inspection or behavior analytics is not a requirement, an Azure Application Gateway with WAF can be used and configured in "detection mode" to log alerts and threats, or "prevention mode" to actively block detected intrusions and attacks.

- [Understand best practices for securing your AKS cluster with a WAF](https://docs.microsoft.com/azure/aks/operator-best-practices-network#secure-traffic-with-a-web-application-firewall-waf)

- [How to deploy Azure Application Gateway (Azure WAF)](../web-application-firewall/ag/application-gateway-web-application-firewall-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.8: Minimize complexity and administrative overhead of network security rules

**Guidance**: Use virtual network service tags to define network access controls on network security groups associated with Azure Kubernetes Service (AKS) instances. Service tags can be used in place of specific IP addresses when creating security rules to allow or deny the traffic for the corresponding service by specifying the service tag name. 

Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

Apply an Azure tag to node pools in your AKS cluster. They are different than the virtual network service tags, and are applied to each node within the node pool and persist through upgrades. 

- [Understand and using Service tags](../virtual-network/service-tags-overview.md)

- [Understand NSGs for AKS](support-policies.md)

- [Control egress traffic for cluster nodes in Azure Kubernetes Service (AKS)](limit-egress-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.9: Maintain standard security configurations for network devices

**Guidance**: Define and implement standard security configurations with Azure Policy for network resources associated with your Azure Kubernetes Service (AKS) clusters. 

Use Azure Policy aliases in the "Microsoft.ContainerService" and "Microsoft.Network" namespaces to create custom policies to audit or enforce the network configuration of your AKS clusters. 

Also, use built-in policy definitions related to AKS, such as:

- Authorized IP ranges should be defined on Kubernetes Services

- Enforce HTTPS ingress in Kubernetes cluster

- Ensure services listen only on allowed ports in Kubernetes cluster

Additional information is available at the referenced links.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Azure Policy samples for networking](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#network)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.10: Document traffic configuration rules

**Guidance**: Use tags for network security groups and other resources for traffic flow to and from Azure Kubernetes Service (AKS) clusters. Use the "Description" field for individual network security group rules to specify business need and/or duration, and so on, for any rules that allow traffic to/from a network.

Use any of the built-in Azure Policy tagging-related definitions, for example, "Require tag and its value" that ensure that all resources are created with tags and to receive notifications for existing untagged resources.

Choose to allow or deny specific network paths within the cluster based on namespaces and label selectors with network policies. Use these namespaces and labels as descriptors for traffic configuration rules. Use Azure PowerShell or Azure command-line interface (CLI) to look up or perform actions on resources based on their tags.

- [Azure Policy with CLI](/cli/azure/policy)

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [How to create an NSG with a Security Config](../virtual-network/tutorial-filter-network-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 1.11: Use automated tools to monitor network resource configurations and detect changes

**Guidance**: Use Azure Activity Log to monitor network resource configurations and detect changes for network resources related to Azure Kubernetes Service (AKS) clusters. 

Create alerts within Azure Monitor that will trigger when changes to critical network resources take place. Any entries from the AzureContainerService user in the activity logs are logged as platform actions. 

Use Azure Monitor logs to enable and query the logs from AKS the master components, kube-apiserver and kube-controller-manager. 
Create and manage the nodes that run the kubelet with container runtime and deploy their applications through the managed Kubernetes API server. 

- [How to view and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log#view-the-activity-log)

- [How to create alerts in Azure Monitor](/azure/azure-monitor/platform/alerts-activity-log)

- [Enable and review Kubernetes master node logs in Azure Kubernetes Service (AKS)](/azure/aks/view-master-logs)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Logging and Monitoring

*For more information, see the [Azure Security Benchmark: Logging and Monitoring](../security/benchmarks/security-control-logging-monitoring.md).*

### 2.1: Use approved time synchronization sources

**Guidance**: Azure Kubernetes Service (AKS) nodes use ntp.ubuntu.com for time synchronization, along with UDP port 123 and Network Time Protocol (NTP). 

Ensure NTP servers are accessible by the cluster nodes if using custom DNS servers. 

- [Understand NTP domain and port requirements for AKS cluster nodes](limit-egress-traffic.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 2.2: Configure central security log management

**Guidance**: Enable audit logs from Azure Kubernetes Services (AKS) master components, kube-apiserver and kube-controller-manager, which are provided as a managed service. 

- kube-auditaksService: The display name in audit log for the control plane operation (from the hcpService) 

- masterclient: The display name in audit log for MasterClientCertificate, the certificate you get from az aks get-credentials 

- nodeclient: The display name for ClientCertificate, which is used by agent nodes

Enable other audit logs such as kube-audit as well. 

Export these logs to Log Analytics or another storage platform. In Azure Monitor, use Log Analytics workspaces to query and perform analytics, and use Azure Storage accounts for long term and archival storage.

Enable and on-board this data to Azure Sentinel or a third-party SIEM based on your organizational business requirements.

- [Review the Log schema including log roles here](/azure/aks/view-master-logs)

- [Understand Azure Monitor for Containers](/azure/azure-monitor/insights/container-insights-overview)

- [How to enable Azure Monitor for Containers](/azure/azure-monitor/insights/container-insights-onboard)

- [Enable and review Kubernetes master node logs in Azure Kubernetes Service (AKS)](/azure/aks/view-master-logs)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.3: Enable audit logging for Azure resources

**Guidance**: Use Activity logs to monitor actions on Azure Kubernetes Service (AKS) resources to view all activity and their status. Determine what operations were taken on the resources in your subscription with activity logs: 

- who started the operation
- when the operation occurred
- the status of the operation
- the values of other properties that might help you research the operation

Retrieve information from the activity log through Azure PowerShell, the Azure Command Line Interface (CLI), the Azure REST API, or the Azure portal. 

Enable audit logs on AKS master components, such as: 

- kube-auditaksService: The display name in audit log for the control plane operation (from the hcpService) 

- masterclient: The display name in audit log for MasterClientCertificate, the certificate you get from az aks get-credentials 

- nodeclient: The display name for ClientCertificate, which is used by agent nodes

Turn on other audit logs such as kube-audit as well. 

- [How to enable and review Kubernetes master node logs in AKS](/azure/aks/view-master-logs)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.4: Collect security logs from operating systems

**Guidance**: Enable automatic installation of Log Analytics agents for collecting data from the AKS cluster nodes. Also, turn-on automatic provisioning of the Azure Log Analytics Monitoring Agent from Azure Security Center, as by default, automatic provisioning is off. The agent can also be installed manually. With automatic provisioning on, Security Center deploys the Log Analytics agent on all supported Azure VMs and any new ones that are created. 
Security center collects data from Azure Virtual Machines (VM), virtual machine scale sets, and IaaS containers, such as Kubernetes cluster nodes, to monitor for security vulnerabilities and threats. Data is collected using the Azure Log Analytics Agent, which reads various security-related configurations and event logs from the machine and copies the data to your workspace for analysis. 

Data collection is required to provide visibility into missing updates, misconfigured OS security settings, endpoint protection status, and health and threat detections.

- [How to enable automatic provisioning of the Log Analytics Agent](../security-center/security-center-enable-data-collection.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 2.5: Configure security log storage retention

**Guidance**: Onboard your Azure Kubernetes Service (AKS) instances to Azure Monitor and set the corresponding Azure Log Analytics workspace retention period according to your organization's compliance requirements. 

- [How to set log retention parameters for Log Analytics Workspaces](/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.6: Monitor and review Logs

**Guidance**: Onboard your Azure Kubernetes Service (AKS) instances to Azure Monitor and configure diagnostic settings for your cluster. 

Use Azure Monitor's Log Analytics workspace to review logs and perform queries on log data. Azure Monitor logs are enabled and managed in the Azure portal, or through CLI, and work with both Kubernetes role-based access control (Kubernetes RBAC), Azure RBAC, and non-RBAC enabled AKS clusters.

View the logs generated by AKS master components (kube-apiserver and kube-controllermanager) for troubleshooting your application and services. Enable and on-board data to Azure Sentinel or a third-party SIEM for centralized log management and monitoring.

- [How to enable and review Kubernetes master node logs in AKS](/azure/aks/view-master-logs)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

- [How to perform custom queries in Azure Monitor](/azure/azure-monitor/log-query/get-started-queries)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.7: Enable alerts for anomalous activities

**Guidance**: Use Azure Kubernetes Service (AKS) together with Security Center to gain deeper visibility into AKS nodes. 

Review Security Center alerts on threats and malicious activity detected at the host and at the cluster level. Security Center implements continuous analysis of raw security events occurring in an AKS cluster, such as network data, process creation, and the Kubernetes audit log. Determine if this activity is expected behavior or whether the application is misbehaving. Use metrics and logs in Azure Monitor to substantiate your findings. 

- [Understand Azure Kubernetes Services integration with Security Center](../security-center/defender-for-kubernetes-introduction.md)

- [How to enable Azure Security Center Standard Tier](../security-center/security-center-get-started.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.8: Centralize anti-malware logging

**Guidance**: Install and enable Microsoft Anti-malware for Azure to Azure Kubernetes Service (AKS) virtual machines and virtual machine scale set nodes. Review alerts in Security Center for remediation.

- [Microsoft Antimalware for Azure Cloud Services and Virtual Machines](../security/fundamentals/antimalware.md)

- [Security alerts reference guide](../security-center/alerts-reference.md)

- [Alerts for containers - Azure Kubernetes Service clusters](https://docs.microsoft.com/azure/security-center/alerts-reference#alerts-akscluster)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.9: Enable DNS query logging

**Guidance**: Azure Kubernetes Service (AKS) uses the CoreDNS project for cluster DNS management and resolution.

Enable DNS query logging by applying documented configuration in your coredns-custom ConfigMap. 

- [Customize CoreDNS with Azure Kubernetes Service](coredns-custom.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 2.10: Enable command-line audit logging

**Guidance**: Use kubectl, a command-line client, in Azure Kubernetes Service (AKS) to manage a Kubernetes cluster and get its logs from AKS node for troubleshooting purposes. Kubectl is already installed if you use Azure Cloud Shell. To install kubectl locally, use the 'Install-AzAksKubectl' cmdlet.

- [Quickstart - Deploy an Azure Kubernetes Service cluster using PowerShell](kubernetes-walkthrough-powershell.md)

- [Get kubelet logs from Azure Kubernetes Service (AKS) cluster nodes](kubelet-logs.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Identity and Access Control

*For more information, see the [Azure Security Benchmark: Identity and Access Control](../security/benchmarks/security-control-identity-access-control.md).*

### 3.1: Maintain an inventory of administrative accounts

**Guidance**: Azure Kubernetes Service (AKS) itself does not provide an identity management solution which stores regular user accounts and passwords. With Azure Active Directory (Azure AD) integration, you can grant users or groups access to Kubernetes resources within a namespace or across the cluster.

Perform ad hoc queries to discover accounts that are members of AKS administrative groups with the Azure AD PowerShell module

Use Azure CLI for operations like ‘Get access credentials for a managed Kubernetes cluster’ to assist in reconciling access on a regular basis. Implement this process to keep an updated inventory of the service accounts, which are another primary user type in AKS. Enforce Security Center's Identity and Access Management recommendations.

- [How to integrate AKS with Azure AD](azure-ad-integration-cli.md)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember)

- [How to monitor identity and access with Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.2: Change default passwords where applicable

**Guidance**: Azure Kubernetes Service (AKS) does not have the concept of common default passwords and does not provide an identity management solution where regular user accounts and passwords can be stored. With Azure Active Directory (Azure AD) integration, you can grant role-based access to AKS resources within a namespace or across the cluster. 

Perform ad hoc queries to discover accounts that are members of AKS administrative groups with the Azure AD PowerShell module

- [Understand access and identity options for AKS](concepts-identity.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.3: Use dedicated administrative accounts

**Guidance**: Integrate user authentication for your Azure Kubernetes Service (AKS) clusters with Azure Active Directory (Azure AD). Sign in to an AKS cluster using an Azure AD authentication token. Configure Kubernetes role-based access control (Kubernetes RBAC) for administrative access to Kubernetes configuration (kubeconfig) information and permissions, namespaces and cluster resources. 

Create policies and procedures around the use of dedicated administrative accounts. Implement Security Center Identity and Access Management recommendations.

- [How to monitor identity and access with Azure Security Center](../security-center/security-center-identity-access.md)

- [Control access to cluster resources](azure-ad-rbac.md)

- [Use Azure role-based access controls](control-kubeconfig-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.4: Use single sign-on (SSO) with Azure Active Directory

**Guidance**: Use single sign-on for Azure Kubernetes Service (AKS) with Azure Active Directory (Azure AD) integrated authentication for an AKS cluster.

- [How to view Kubernetes logs, events, and pod metrics in real-time](/azure/azure-monitor/insights/container-insights-livedata-overview)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.5: Use multi-factor authentication for all Azure Active Directory based access

**Guidance**: Integrate Authentication for Azure Kubernetes Service (AKS) with Azure Active Directory (Azure AD). 

Enable Azure AD multifactor authentication and follow Security Center's Identity and Access Management recommendations.

- [How to enable multifactor authentication in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

- [How to monitor identity and access within Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.6: Use dedicated machines (Privileged Access Workstations) for all administrative tasks

**Guidance**: Use a Privileged Access Workstation (PAW), with Multi-Factor Authentication (MFA), configured to log into your specified Azure Kubernetes Service (AKS) clusters and related resources.

- [Learn about Privileged Access Workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/)

- [How to enable Multi-Factor Authentication (MFA) in Azure](../active-directory/authentication/howto-mfa-getstarted.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.7: Log and alert on suspicious activities from administrative accounts

**Guidance**: Use Azure Active Directory (Azure AD) security reports with Azure AD-integrated authentication for Azure Kubernetes Service (AKS). Alerts can be generated when suspicious or unsafe activity occurs in the environment. Use Security Center to monitor identity and access activity.

- [How to identify Azure AD users flagged for risky activity](../active-directory/identity-protection/overview-identity-protection.md)

- [How to monitor users identity and access activity in Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.8: Manage Azure resources only from approved locations

**Guidance**: Use Conditional Access Named Locations to allow access to Azure Kubernetes Service (AKS) clusters from only specific logical groupings of IP address ranges or countries/regions. This requires integrated authentication for AKS with Azure Active Directory (Azure AD).

Limit the access to the AKS API server from a limited set of IP address ranges, as it receives requests to perform actions in the cluster to create resources or scale the number of nodes. 

- [Secure access to the API server using authorized IP address ranges in Azure Kubernetes Service (AKS)](api-server-authorized-ip-ranges.md)

- [How to configure Named Locations in Azure](../active-directory/reports-monitoring/quickstart-configure-named-locations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.9: Use Azure Active Directory

**Guidance**: Use Azure Active Directory (Azure AD) as the central authentication and authorization system for Azure Kubernetes Service (AKS). Azure AD protects data by using strong encryption for data at rest and in transit and salts, hashes, and securely stores user credentials.

Use the AKS built-in roles with Azure role-based access control (Azure RBAC) - Resource Policy Contributor and Owner, for policy assignment operations to your Kubernetes cluster

- [Azure Policy Overview](../governance/policy/overview.md)

- [How to integrate Azure AD with AKS](azure-ad-integration-cli.md)

- [Integrate AKS-managed Azure AD](managed-aad.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.10: Regularly review and reconcile user access

**Guidance**: Use Azure Active Directory (Azure AD) security reports with Azure AD-integrated authentication for Azure Kubernetes Service (AKS). Search Azure AD logs to help discover stale accounts. 

Perform Azure Identity Access Reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. Remediate Identity and Access recommendations from Security Center.

Be aware of roles used for support or troubleshooting purposes. For example, any cluster actions taken by Microsoft support (with user consent) are made under a built-in Kubernetes "edit" role of the name aks-support-rolebinding. AKS support is enabled with this role to edit cluster configuration and resources to troubleshoot and diagnose cluster issues. However, this role cannot modify permissions nor create roles or role bindings. This role access is only enabled under active support tickets with just-in-time (JIT) access.
 
- [Access and identity options for Azure Kubernetes Service (AKS)](concepts-identity.md)

- [How to use Azure Identity Access Reviews](../active-directory/governance/access-reviews-overview.md)

- [How to monitor user’s identity and access activity in Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.11: Monitor attempts to access deactivated credentials

**Guidance**: Integrate user authentication for Azure Kubernetes Service (AKS) with Azure Active Directory (Azure AD). Create Diagnostic Settings for Azure AD, sending the audit and sign-in logs to an Azure Log Analytics workspace. Configure desired Alerts (such as when a deactivated account attempts to log in) within an Azure Log Analytics workspace.
- [How to integrate Azure Activity Logs into Azure Monitor](../active-directory/reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md)

- [How to create, view, and manage log alerts using Azure Monitor](/azure/azure-monitor/platform/alerts-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 3.12: Alert on account login behavior deviation

**Guidance**: Integrate user authentication for Azure Kubernetes Service (AKS) with Azure Active Directory (Azure AD). Use Azure AD's Risk Detections and Identity Protection feature to configure automated responses to detected suspicious actions related to user identities. Ingest data into Azure Sentinel for further investigations based on business needs.

- [How to view Azure AD risky sign-ins](../active-directory/identity-protection/overview-identity-protection.md)

- [How to configure and enable Identity Protection risk policies](../active-directory/identity-protection/howto-identity-protection-configure-risk-policies.md)

- [How to onboard Azure Sentinel](../sentinel/quickstart-onboard.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-control-data-protection.md).*

### 4.1: Maintain an inventory of sensitive Information

**Guidance**: Use tags on resources related to Azure Kubernetes Service (AKS) deployments to assist in tracking Azure resources that store or process sensitive information.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

- [Update tags for managed clusters](/rest/api/aks/managedclusters/updatetags)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.2: Isolate systems storing or processing sensitive information

**Guidance**: Logically isolate teams and workloads in the same cluster with Azure Kubernetes Service (AKS) to provide the least number of privileges, scoped to the resources required by each team. 

Use the namespace in Kubernetes to create a logical isolation boundary. Consider implementing additional Kubernetes features for isolation and multi-tenancy, such as, scheduling, networking, authentication/authorization, and containers.

Implement separate subscriptions and/or management groups for development, test, and production environments. Separate AKS clusters with networking by deploying them to distinct virtual networks, which are tagged appropriately.

- [Learn about best practices for cluster isolation in AKS](operator-best-practices-cluster-isolation.md)

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [Understand best practices for network connectivity and security in AKS](operator-best-practices-network.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.3: Monitor and block unauthorized transfer of sensitive information

**Guidance**: Use a third-party solution from Azure Marketplace on network perimeters that monitors for unauthorized transfer of sensitive information and blocks such transfers while alerting information security professionals.

Microsoft manages the underlying platform and treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [List of required ports, addresses, and domain names for AKS functionality](limit-egress-traffic.md)

- [How to configure Diagnostic Settings for Azure Firewall](../firewall/firewall-diagnostics.md)

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.4: Encrypt all sensitive information in transit

**Guidance**: Create an HTTPS ingress controller and use your own TLS certificates (or optionally, Let's Encrypt) for your Azure Kubernetes Service (AKS) deployments. 

Kubernetes egress traffic is encrypted over HTTPS/TLS by default. Review any potentially un-encrypted egress traffic from your AKS instances for additional monitoring. This may include NTP traffic, DNS traffic, HTTP traffic for retrieving updates in some cases. 

- [How to create an HTTPS ingress controller on AKS and use your own TLS certificates](ingress-own-tls.md)

- [How to create an HTTPS ingress controller on AKS with Let's Encrypt](ingress-tls.md)

- [List of potential out-going ports and protocols used by AKS](limit-egress-traffic.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.5: Use an active discovery tool to identify sensitive data

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.
Microsoft manages the underlying platform and treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. 

To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.6: Use Azure RBAC to manage access to resources

**Guidance**: Use the Azure role-based access control (Azure RBAC) authorization system built on Azure Resource Manager to provide fine-grained access management of Azure resources.

Configure Azure Kubernetes Service (AKS) to use Azure Active Directory (Azure AD) for user authentication. Sign in to an AKS cluster using Azure AD authentication token using this configuration. 

Use the AKS built-in roles with Azure RBAC- Resource Policy Contributor and Owner, for policy assignment operations to your AKS cluster

- [How to control access to cluster resources using Azure RBAC and Azure AD Identities in AKS](azure-ad-rbac.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ContainerService**:

[!INCLUDE [Resource Policy for Microsoft.ContainerService 4.6](../../includes/policy/standards/asb/rp-controls/microsoft.containerservice-4-6.md)]

### 4.7: Use host-based data loss prevention to enforce access control

**Guidance**: Data identification, classification, and loss prevention features are not yet available for Azure Storage or compute resources. Implement third-party solution if required for compliance purposes.
Microsoft manages the underlying platform and treats all customer content as sensitive and goes to great lengths to guard against customer data loss and exposure. To ensure customer data within Azure remains secure, Microsoft has implemented and maintains a suite of robust data protection controls and capabilities.

- [Understand customer data protection in Azure](../security/fundamentals/protection-customer-data.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 4.8: Encrypt sensitive information at rest

**Guidance**: The two primary types of storage provided for volumes in Azure Kubernetes Service (AKS) are backed by Azure Disks or Azure Files. Both types of storage use Azure Storage Service Encryption (SSE), which encrypts data at rest to improve security. By default, data is encrypted with Microsoft-managed keys.

Encryption-at-rest using customer-managed keys is available for encrypting both the OS and data disks on AKS clusters for additional control over encryption keys. Customers own the responsibility for key management activities such as key backup and rotation. Disks cannot currently be encrypted using Azure Disk Encryption at the AKS node level.

- [Best practices for storage and backups in Azure Kubernetes Service (AKS)](operator-best-practices-storage.md)

- [Bring your own keys (BYOK) with Azure disks in Azure Kubernetes Service (AKS)](azure-disk-customer-managed-keys.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 4.9: Log and alert on changes to critical Azure resources

**Guidance**: Use Azure Monitor for containers to monitor the performance of container workloads deployed to managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS). 

Configure alerts for proactive notification or log creation when CPU and memory utilization on nodes or containers exceed defined thresholds, or when a health state change occurs in the cluster at the infrastructure or nodes health rollup. 

Use Azure Activity Log to monitor your AKS clusters and related resources at a high level. Integrate with Prometheus to view application and workload metrics it collects from nodes and Kubernetes using queries to create custom alerts, dashboards, and detailed perform detailed analysis.

- [Understand Azure Monitor for Containers](/azure/azure-monitor/insights/container-insights-overview)

- [How to enable Azure Monitor for containers](/azure/azure-monitor/insights/container-insights-onboard)

- [How to view and retrieve Azure Activity Log events](/azure/azure-monitor/platform/activity-log#view-the-activity-log)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Vulnerability Management

*For more information, see the [Azure Security Benchmark: Vulnerability Management](../security/benchmarks/security-control-vulnerability-management.md).*

### 5.1: Run automated vulnerability scanning tools

**Guidance**: Use Security Center to monitor your Azure Container Registry including Azure Kubernetes Service (AKS) instances for vulnerabilities. Enable the Container Registries bundle in Security Center to ensure that Security Center is ready to scan images that get pushed to the registry.

Get notified in the Security Center dashboard when issues are found after Security Center scans the image using Qualys. The Container Registries bundle feature provides deeper visibility into  vulnerabilities of the images used in Azure Resource Manager based registries. 

Use Security Center for actionable recommendations for every vulnerability. These recommendations include a severity classification and guidance for remediation. 

- [Best practices for container image management and security in Azure Kubernetes Service (AKS)](../security-center/defender-for-container-registries-introduction.md)

- [Understand best practices for container image management and security in AKS](operator-best-practices-container-image-management.md)

- [Understand container Registry integration with Azure Security Center](../security-center/defender-for-container-registries-introduction.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.2: Deploy automated operating system patch management solution

**Guidance**: Security updates are automatically applied to Linux nodes to protect customer's Azure Kubernetes Service (AKS) clusters. These updates include OS security fixes or kernel updates. 

Note that the process to keep Windows Server nodes up to date differs from nodes running Linux as windows server nodes don't receive daily updates. Instead, customers need to perform an upgrade on the Windows Server node pools in their AKS clusters which deploys new nodes with the latest base Window Server image and patches using Azure control panel or the Azure CLI. These updates contain security or functionality improvements to AKS.

- [Understand how updates are applied to AKS cluster nodes running Linux](node-updates-kured.md)

- [How to upgrade an AKS node pool for AKS clusters that use Windows Server nodes](https://docs.microsoft.com/azure/aks/use-multiple-node-pools#upgrade-a-node-pool)

- [Azure Kubernetes Service (AKS) node image upgrades](node-image-upgrade.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.3: Deploy an automated patch management solution for third-party software titles

**Guidance**: Implement a manual process to ensure Azure Kubernetes Service (AKS) cluster node's third-party applications remain patched for the duration of the cluster lifetime. This may require enabling automatic updates, monitoring the nodes, or performing periodic reboots.

**Responsibility**: Customer

**Azure Security Center monitoring**: The [Azure Security Benchmark](/azure/governance/policy/samples/azure-security-benchmark) is the default policy initiative for Security Center and is the foundation for [Security Center's recommendations](/azure/security-center/security-center-recommendations). The Azure Policy definitions related to this control are enabled automatically by Security Center. Alerts related to this control may require an [Azure Defender](/azure/security-center/azure-defender) plan for the related services.

**Azure Policy built-in definitions - Microsoft.ContainerService**:

[!INCLUDE [Resource Policy for Microsoft.ContainerService 5.3](../../includes/policy/standards/asb/rp-controls/microsoft.containerservice-5-3.md)]

### 5.4: Compare back-to-back vulnerability scans

**Guidance**: Export Security Center scan results at consistent intervals and compare the results to verify that vulnerabilities have been remediated.

Use the PowerShell cmdlet "Get-AzSecurityTask" to automate the retrieval of security tasks that Security Center recommends you to perform in order to strengthen your security posture and remediation vulnerability scan findings.

- [How to use PowerShell to view vulnerabilities discovered by Azure Security Center](/powershell/module/az.security/get-azsecuritytask)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 5.5: Use a risk-rating process to prioritize the remediation of discovered vulnerabilities

**Guidance**: Use the severity rating provided by Security Center to prioritize the remediation of vulnerabilities. 

Use Common Vulnerability Scoring System (CVSS) (or another scoring systems as provided by your scanning tool) if using a built-in vulnerability assessment tool (such as Qualys or Rapid7, offered by Azure).

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Inventory and Asset Management

*For more information, see the [Azure Security Benchmark: Inventory and Asset Management](../security/benchmarks/security-control-inventory-asset-management.md).*

### 6.1: Use automated asset discovery solution

**Guidance**: Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, and so on) within your subscriptions. Ensure that you have appropriate (read) permissions in your tenant and are able to enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager-based resources going forward.

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

- [How to view your Azure Subscriptions](/powershell/module/az.accounts/get-azsubscription)

- [Understand Azure RBAC](../role-based-access-control/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.2: Maintain asset metadata

**Guidance**: Apply tags to Azure resources with metadata to logically organize them into a taxonomy.

- [How to create and use tags](../azure-resource-manager/management/tag-resources.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.3: Delete unauthorized Azure resources

**Guidance**: Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. 

Apply taints, labels, or tags when creating an Azure Kubernetes Service (AKS) node pool. All nodes within that node pool will also inherit that taint, label, or tag.

Taints, labels or tags can be used to reconcile inventory on a regular basis and ensure unauthorized resources are deleted from subscriptions in a timely manner.

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [How to create and user Tags](../azure-resource-manager/management/tag-resources.md)

- [Managed Clusters - Update Tags](/rest/api/aks/managedclusters/updatetags)

- [Specify a taint, label, or tag for a node pool](https://docs.microsoft.com/azure/aks/use-multiple-node-pools#specify-a-taint-label-or-tag-for-a-node-pool)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.4: Define and maintain an inventory of approved Azure resources

**Guidance**: Define a list of approved Azure resources and approved software for compute resources based on organizational business needs.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.5: Monitor for unapproved Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:
-	Not allowed resource types 

-	Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscriptions. Ensure that all Azure resources present in the environment are approved based on organizational business requirements.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to create queries with Azure Graph](../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.6: Monitor for unapproved software applications within compute resources

**Guidance**: Use Azure Automation Change Tracking and Inventory features to find out software that is installed in your environment. 

Collect and view inventory for software, files, Linux daemons, Windows services, and Windows Registry keys on your computers and monitor for unapproved software applications. 

Track the configurations of your machines to aid in pinpointing operational issues across your environment and better understand the state of your machines.

- [How to enable Azure virtual machine Inventory](../automation/automation-tutorial-installed-software.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.7: Remove unapproved Azure resources and software applications

**Guidance**: Use Azure Automation Change Tracking and Inventory features to find out software that is installed in your environment. 

Collect and view inventory for software, files, Linux daemons, Windows services, and Windows Registry keys on your computers and monitor for unapproved software applications. 

Track the configurations of your machines to aid in pinpointing operational issues across your environment and better understand the state of your machines.

- [How to enable Azure virtual machine Inventory](../automation/automation-tutorial-installed-software.md)

- [How to use File Integrity Monitoring](../security-center/security-center-file-integrity-monitoring.md)

- [Understand Azure Change Tracking](../automation/change-tracking/overview.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.8: Use only approved applications

**Guidance**: Use Azure Automation Change Tracking and Inventory features to find out software that is installed in your environment. 

Collect and view inventory for software, files, Linux daemons, Windows services, and Windows Registry keys on your computers and monitor for unapproved software applications. 

Track the configurations of your machines to aid in pinpointing operational issues across your environment and better understand the state of your machines.

Enable Adaptive Application analysis in Security Center for applications which exist in your environment.

- [How to enable Azure virtual machine Inventory](../automation/automation-tutorial-installed-software.md)

- [How to use Azure Security Center Adaptive Application Controls](../security-center/security-center-adaptive-application.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.9: Use only approved Azure services

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in customer subscriptions using the following built-in policy definitions:

- Not allowed resource types

- Allowed resource types

Use Azure Resource Graph to query/discover resources within your subscriptions. Ensure that all Azure resources present in the environment are approved.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](https://docs.microsoft.com/azure/governance/policy/samples/built-in-policies#general)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.10: Maintain an inventory of approved software titles

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in your subscriptions using built-in policy definitions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.11: Limit users' ability to interact with Azure Resource Manager

**Guidance**: Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.
- [How to configure Conditional Access to block access to Azure Resource Manager](../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.12: Limit users' ability to execute scripts in compute resources

**Guidance**: Azure Kubernetes Service (AKS) itself doesn't provide an identity management solution where regular user accounts and passwords are stored. Instead, use Azure Active Directory (Azure AD) as the integrated identity solution for your AKS clusters.

Grant users or groups access to Kubernetes resources within a namespace or across the cluster using Azure AD integration.

Use the Azure AD PowerShell module to perform ad hoc queries to discover accounts that are members of your AKS administrative groups and use it to reconcile access on a regular basis. Use Azure CLI for operations such as ‘Get access credentials for a managed Kubernetes cluster. Implement Security Center Identity and Access Management recommendations.

- [Manage AKS with Azure CLI](/cli/azure/aks)

- [Understand AKS and Azure AD integration](concepts-identity.md)

- [How to integrate AKS with Azure AD](azure-ad-integration-cli.md)

- [How to get a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrole)

- [How to get members of a directory role in Azure AD with PowerShell](/powershell/module/azuread/get-azureaddirectoryrolemember)

- [How to monitor identity and access with Azure Security Center](../security-center/security-center-identity-access.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 6.13: Physically or logically segregate high risk applications

**Guidance**: Use Azure Kubernetes Service (AKS) features to logically isolate teams and workloads in the same cluster for the least number of privileges, scoped to the resources required by each team. 

Implement namespace in Kubernetes to create a logical isolation boundary. Use Azure Policy aliases in the "Microsoft.ContainerService" namespace to create custom policies to audit or enforce the configuration of your Azure Kubernetes Service (AKS) instances. 

Review and implement additional Kubernetes features and considerations for isolation and multi-tenancy to include the following: scheduling, networking, authentication/authorization, and containers. Also use separate subscriptions and management groups for development, test, and production. 
Separate AKS clusters with virtual networks, subnets which are tagged appropriately, and secured with a Web Application Firewall (WAF).

- [Learn about best practices for cluster isolation in AKS](operator-best-practices-cluster-isolation.md)

- [How to create additional Azure subscriptions](../cost-management-billing/manage/create-subscription.md)

- [How to create Management Groups](../governance/management-groups/create-management-group-portal.md)

- [Understand best practices for network connectivity and security in AKS](operator-best-practices-network.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Secure Configuration

*For more information, see the [Azure Security Benchmark: Secure Configuration](../security/benchmarks/security-control-secure-configuration.md).*

### 7.1: Establish secure configurations for all Azure resources

**Guidance**: Use Azure Policy aliases in the "Microsoft.ContainerService" namespace to create custom policies to audit or enforce the configuration of your Azure Kubernetes Service (AKS) instances. Use built-in Azure Policy definitions.

Examples of built-in policy definitions for AKS include:

- Enforce HTTPS ingress in Kubernetes cluster

- Authorized IP ranges should be defined on Kubernetes Services

- Role-based Access Control (RBAC) should be used on Kubernetes Services

- Ensure only allowed container images in Kubernetes cluster

Export a template of your AKS configuration in JavaScript Object Notation (JSON) with Azure Resource Manager. Review it periodically to ensure that these configurations meet the security requirements for your organization. Use the recommendations from Azure Security Center as a secure configuration baseline for your Azure resources. 

- [How to configure and manage AKS pod security policies](use-pod-security-policies.md)

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.2: Establish secure operating system configurations

**Guidance**: Azure Kubernetes Clusters (AKS) clusters are deployed on host virtual machines with a security optimized OS. The host OS has additional security hardening steps incorporated into it to reduce the surface area of attack and allows the deployment of containers in a secure fashion. 

Azure applies daily patches (including security patches) to AKS virtual machine hosts with some patches requiring a reboot. Customers are responsible for scheduling AKS Virtual Machine host reboots as per need. 

- [Security hardening for AKS agent node host OS](security-hardened-vm-host-image.md)

- [Understand security hardening in AKS virtual machine hosts](security-hardened-vm-host-image.md)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 7.3: Maintain secure Azure resource configurations

**Guidance**: Secure your Azure Kubernetes Service (AKS) cluster using pod security policies.  Limit what pods can be scheduled to improve the security of your cluster. 

Pods which request resources that are not allowed cannot run in the AKS cluster. 

Also use Azure Policy [deny] and [deploy if not exist] effects to enforce secure settings for the Azure resources related to your AKS deployments (such as Virtual Networks, Subnets, Azure Firewalls, Storage Accounts, and so on). 

Create custom Azure Policy definitions using aliases from the following namespaces: 

- Microsoft.ContainerService

- Microsoft.Network

Additional information is available at the referenced links.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [Understand Azure Policy Effects](../governance/policy/concepts/effects.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.4: Maintain secure operating system configurations

**Guidance**: Azure Kubernetes Service (AKS) clusters are deployed on host virtual machines with a security optimized OS. The host OS has additional security hardening steps incorporated into it to reduce the surface area of attack and allows the deployment of containers in a secure fashion. 

Refer to the list of Center for Internet Security (CIS) controls which are built into the host OS.  

- [Security hardening for AKS agent node host OS](security-hardened-vm-host-image.md)

- [Understand state configuration of AKS clusters](https://docs.microsoft.com/azure/aks/concepts-clusters-workloads#control-plane)

- [Understand security hardening in AKS virtual machine hosts](security-hardened-vm-host-image.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.5: Securely store configuration of Azure resources

**Guidance**: Use Azure Repos to securely store and manage your configurations if using custom Azure Policy definitions. Export a template of your Azure Kubernetes Service (AKS) configuration in JavaScript Object Notation (JSON) with Azure Resource Manager. Periodically review it to ensure that the configurations meet the security requirements for your organization.

Implement third-party solutions such as Terraform to create a configuration file that declares the resources for the Kubernetes cluster. You can harden your AKS deployment by Implement security best practices and store your configuration as code in a secured location.

- [Define a Kubernetes cluster](/azure/developer/terraform/create-k8s-cluster-with-tf-and-aks#define-a-kubernetes-cluster)

- [Security hardening for AKS agent node host OS](security-hardened-vm-host-image.md)

- [How to store code in Azure DevOps](/azure/devops/repos/git/gitworkflow)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.6: Securely store custom operating system images

**Guidance**: Not applicable to Azure Kubernetes Service (AKS). AKS provides a security optimized host Operating System (OS) by default. There is no current option to select an alternate or custom operating system.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.7: Deploy configuration management tools for Azure resources

**Guidance**: Use Azure Policy to put restrictions on the type of resources that can be created in subscriptions using built-in policy definitions as well as Azure Policy aliases in the "Microsoft.ContainerService" namespace. 

Create custom policies to audit, and enforce system configurations. Develop a process and pipeline for managing policy exceptions.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md)

- [How to use aliases](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#aliases)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.8: Deploy configuration management tools for operating systems

**Guidance**: Azure Kubernetes Service (AKS) clusters are deployed on host virtual machines with a security optimized OS. The host OS has additional security hardening steps incorporated into it to reduce the surface area of attack and allows the deployment of containers in a secure fashion. 

Refer to the list of Center for Internet Security (CIS) controls which are built into AKS hosts.  

- [Security hardening for AKS agent node host OS](security-hardened-vm-host-image.md)

- [Understand security hardening in AKS virtual machine hosts](security-hardened-vm-host-image.md)

- [Understand state configuration of AKS clusters](https://docs.microsoft.com/azure/aks/concepts-clusters-workloads#control-plane)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.9: Implement automated configuration monitoring for Azure resources

**Guidance**: Use Security Center to perform baseline scans for resources related to your Azure Kubernetes Service (AKS) deployments. Examples resources include but are not limited to the AKS cluster itself, the virtual network where the AKS cluster was deployed, the Azure Storage Account used to track Terraform state, or Azure Key Vault instances being used for the encryption keys for your AKS cluster's OS and data disks.

- [How to remediate recommendations in Azure Security Center](../security-center/security-center-remediate-recommendations.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.10: Implement automated configuration monitoring for operating systems

**Guidance**: Use Security Center container recommendations under the "Compute &amp; apps" section to perform baseline scans for your Azure Kubernetes Service (AKS) clusters. 

Get notified in the Security Center dashboard when configuration issues or vulnerabilities are found. This does require enabling the optional Container Registries bundle which allows Security Center to scan the image.  

- [Understand Azure Security Center container recommendations](../security-center/container-security.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.11: Manage Azure secrets securely

**Guidance**: Integrate Azure Key Vault with an Azure Kubernetes Service (AKS) cluster using a FlexVolume drive. Use Azure Key Vault to store and regularly rotate secrets such as credentials, storage account keys, or certificates. The FlexVolume driver lets the AKS cluster natively retrieve credentials from Key Vault and securely provide them only to the requesting pod. 
Use a pod managed identity to request access to Key Vault and retrieve the required credentials through the FlexVolume driver. Ensure Key Vault Soft Delete is enabled. 

Limit credential exposure by not defining credentials in your application code. 

Avoid the use of fixed or shared credentials. 

- [Security concepts for applications and clusters in Azure Kubernetes Service (AKS)](concepts-security.md)

- [How to use Key Vault with your AKS cluster](https://docs.microsoft.com/azure/aks/developer-best-practices-pod-security#limit-credential-exposure)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.12: Manage identities securely and automatically

**Guidance**: Do not define credentials in your application code as a security best practice. Use managed identities for Azure resources to let a pod authenticate itself against any service in Azure that supports it, including Azure Key Vault. The pod is assigned an Azure Identity to authenticate to Azure Active Directory (Azure AD) and receive a digital token which can be presented to other Azure services that check if the pod is authorized to access the service and perform the required actions.

Note that Pod managed identities are intended for use with Linux pods and container images only. Provision Azure Key Vault to store and retrieve digital keys and credentials. Keys such as the ones used to encrypt OS disks, AKS cluster data can be stored in Azure Key Vault.

Service principals can also be used in AKS clusters. However, clusters using service principals eventually may reach a state in which the service principal must be renewed to keep the cluster working. Managing service principals adds complexity, which is why it's easier to use managed identities instead. The same permission requirements apply for both service principals and managed identities.

- [Understand Managed Identities and Key Vault with Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/developer-best-practices-pod-security#limit-credential-exposure)

- [Azure AD Pod Identity](https://github.com/Azure/aad-pod-identity)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 7.13: Eliminate unintended credential exposure

**Guidance**: Implement Credential Scanner to identify credentials within code. Credential Scanner also encourages moving discovered credentials to more secure locations such as Azure Key Vault with recommendations.

Limit credential exposure by not defining credentials in your application code. and avoid the use of shared credentials. Azure Key Vault should be used to store and retrieve digital keys and credentials. Use managed identities for Azure resources to let your pod request access to other resources. 

- [How to setup Credential Scanner](https://secdevtools.azurewebsites.net/helpcredscan.html)

- [Developer best practices for pod security](developer-best-practices-pod-security.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Malware Defense

*For more information, see the [Azure Security Benchmark: Malware Defense](../security/benchmarks/security-control-malware-defense.md).*

### 8.1: Use centrally managed antimalware software

**Guidance**: AKS manages the lifecycle and operations of agent nodes on your behalf - modifying the IaaS resources associated with the agent nodes is not supported. However, for Linux nodes you may use daemon sets to install custom software like an anti-malware solution.

- [Security alerts reference guide](../security-center/alerts-reference.md)

- [Alerts for containers - Azure Kubernetes Service clusters](https://docs.microsoft.com/azure/security-center/alerts-reference#alerts-akscluster)

- [AKS shared responsibility and Daemon Sets](https://docs.microsoft.com/azure/aks/support-policies#shared-responsibility)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

### 8.2: Pre-scan files to be uploaded to non-compute Azure resources

**Guidance**: Pre-scan any files being uploaded to your AKS resources. Use Security Center's threat detection for data services to detect malware uploaded to storage accounts if using an Azure Storage Account as a data store or to track Terraform state for your AKS cluster. 

- [Understand Azure Security Center's Threat detection for data services](../security-center/azure-defender.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 8.3: Ensure antimalware software and signatures are updated

**Guidance**: AKS manages the lifecycle and operations of agent nodes on your behalf - modifying the IaaS resources associated with the agent nodes is not supported. However, for Linux nodes you may use daemon sets to install custom software like an anti-malware solution.

- [Security alerts reference guide](../security-center/alerts-reference.md)

- [Alerts for containers - Azure Kubernetes Service clusters](https://docs.microsoft.com/azure/security-center/alerts-reference#alerts-akscluster)

- [AKS shared responsibility and Daemon Sets](https://docs.microsoft.com/azure/aks/support-policies#shared-responsibility)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Data Recovery

*For more information, see the [Azure Security Benchmark: Data Recovery](../security/benchmarks/security-control-data-recovery.md).*

### 9.1: Ensure regular automated back ups

**Guidance**: Back up your data using an appropriate tool for your storage type such as Velero, which can back up persistent volumes along with additional cluster resources and configurations. Periodically, verify the integrity, and security, of those backups. 

Remove state from your applications prior to backup. In cases where this cannot be done, back up the data from persistent volumes and regularly test the restore operations to verify data integrity and the processes required.

- [Best practices for storage and backups in AKS](operator-best-practices-storage.md)

- [Best practices for business continuity and disaster recovery in AKS](operator-best-practices-multi-region.md)

- [Understand Azure Site Recovery](../site-recovery/site-recovery-overview.md)

- [How to setup Velero on Azure](https://github.com/vmware-tanzu/velero-plugin-for-microsoft-azure/blob/master/README.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.2: Perform complete system backups and backup any customer-managed keys

**Guidance**: Back up your data using an appropriate tool for your storage type such as Velero, which can back up persistent volumes along with additional cluster resources and configurations. 

Perform regular automated backups of Key Vault Certificates, Keys, Managed Storage Accounts, and Secrets, with PowerShell commands. 

- [How to backup Key Vault Certificates](/powershell/module/azurerm.keyvault/backup-azurekeyvaultcertificate)

- [How to backup Key Vault Keys](/powershell/module/azurerm.keyvault/backup-azurekeyvaultkey)

- [How to backup Key Vault Managed Storage Accounts](/powershell/module/az.keyvault/add-azkeyvaultmanagedstorageaccount)

- [How to backup Key Vault Secrets](/powershell/module/azurerm.keyvault/backup-azurekeyvaultsecret)

- [How to enable Azure Backup](/azure/backup/)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.3: Validate all backups including customer-managed keys

**Guidance**: Periodically perform data restoration of content within Velero Backup. If necessary, test restoring to an isolated virtual network.

Periodically perform data restoration of Key Vault Certificates, Keys, Managed Storage Accounts, and Secrets, with PowerShell commands.

- [How to restore Key Vault Certificates](/powershell/module/az.keyvault/restore-azkeyvaultcertificate)

- [How to restore Key Vault Keys](/powershell/module/az.keyvault/restore-azkeyvaultkey)

- [How to restore Key Vault Managed Storage Accounts](/powershell/module/az.keyvault/backup-azkeyvaultmanagedstorageaccount)

- [How to restore Key Vault Secrets](/powershell/module/az.keyvault/restore-azkeyvaultsecret)

- [How to recover files from Azure Virtual Machine backup](/azure/backup/backup-azure-restore-files-from-vm)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 9.4: Ensure protection of backups and customer-managed keys

**Guidance**: Back up your data using an appropriate tool for your storage type such as Velero, which can back up persistent volumes along with additional cluster resources and configurations. 

Enable Soft-Delete in Key Vault to protect keys against accidental or malicious deletion if Azure Key Vault is being used with for Azure Kubernetes Service (AKS) deployments.

- [Understand Azure Storage Service Encryption](../storage/common/storage-service-encryption.md)

- [How to enable Soft-Delete in Key Vault](https://docs.microsoft.com/azure/storage/blobs/soft-delete-blob-overview?tabs=azure-portal)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-control-incident-response.md).*

### 10.1: Create an incident response guide

**Guidance**: Build out an incident response guide for your organization. Ensure that there are written incident response plans that define all roles of personnel as well as phases of incident handling/management from detection to post-incident review.

- [How to configure Workflow Automations within Azure Security Center](../security-center/security-center-planning-and-operations-guide.md)

- [Guidance on building your own security incident response process](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [Microsoft Security Response Center's Anatomy of an Incident](https://msrc-blog.microsoft.com/2019/07/01/inside-the-msrc-building-your-own-security-incident-response-process/)

- [NIST's Computer Security Incident Handling Guide](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.2: Create an incident scoring and prioritization procedure

**Guidance**: Prioritize which alerts must be investigated first with Security Center assigned severity to alerts. The severity is based on how confident Security Center is in the finding or the analytics used to issue the alert as well as the confidence level that there was malicious intent behind the activity that led to the alert.
Clearly mark subscriptions (for example, production, non-production) and create a naming system to clearly identify and categorize Azure resources.

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.3: Test security response procedures

**Guidance**: Conduct exercises to test your systems’ incident response capabilities at a regular cadence. Identify weak points and gaps and revise incident response plans as needed.

- [Guide to Test, Training, and Exercise Programs for IT Plans and Capabilities](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-84.pdf)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.4: Provide security incident contact details and configure alert notifications for security incidents

**Guidance**: Security incident contact information will be used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that the customer's data has been accessed by an unlawful or unauthorized party. 

Review incidents, after the fact, to ensure that issues are resolved.

- [How to set the Azure Security Center Security Contact](../security-center/security-center-provide-security-contact-details.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.5: Incorporate security alerts into your incident response system

**Guidance**: Export Security Center alerts and recommendations using its Continuous Export feature. Continuous Export allows you to export alerts and recommendations either manually or in an ongoing, continuous fashion. 

Choose the Security Center data connector to stream the alerts to Azure Sentinel, as per need and based on organizational business requirements.

- [How to configure continuous export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

### 10.6: Automate the response to security alerts

**Guidance**: Use the Workflow Automation feature in Security Center to automatically trigger responses via "Logic Apps" on security alerts and recommendations.

- [How to configure Workflow Automation and Logic Apps](../security-center/workflow-automation.md)

**Responsibility**: Customer

**Azure Security Center monitoring**: None

## Penetration Tests and Red Team Exercises

*For more information, see the [Azure Security Benchmark: Penetration Tests and Red Team Exercises](../security/benchmarks/security-control-penetration-tests-red-team-exercises.md).*

### 11.1: Conduct regular penetration testing of your Azure resources and ensure remediation of all critical security findings

**Guidance**: Follow the Microsoft Rules of Engagement to ensure your Penetration Tests are not in violation of Microsoft policies. Additional information on Microsoft’s strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications, at the referenced links.

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1)

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Responsibility**: Shared

**Azure Security Center monitoring**: None

## Next steps

- See the [Azure Security Benchmark V2 overview](/azure/security/benchmarks/overview)
- Learn more about [Azure security baselines](/azure/security/benchmarks/security-baselines-overview)
