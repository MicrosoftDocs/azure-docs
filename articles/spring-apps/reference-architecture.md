---
ms.date: 05/31/2022
ms.topic: reference-architecture
author: KarlErickson
title: Azure Spring Apps reference architecture
ms.author: akaleshian
ms.service: spring-apps
ms.custom: event-tier1-build-2022, devx-track-java
description: This reference architecture is a foundation using a typical enterprise hub and spoke design for the use of Azure Spring Apps.
---

# Azure Spring Apps reference architecture

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard ✔️ Enterprise

This reference architecture is a foundation using a typical enterprise hub and spoke design for the use of Azure Spring Apps. In the design, Azure Spring Apps is deployed in a single spoke that's dependent on shared services hosted in the hub. The architecture is built with components to achieve the tenets in the [Microsoft Azure Well-Architected Framework][16].

There are two flavors of Azure Spring Apps: Standard plan and Enterprise plan.

The Azure Spring Apps Standard plan is composed of the Spring Cloud Config Server, the Spring Cloud Service Registry, and the kpack build service.

The Azure Spring Apps Enterprise plan is composed of the VMware Tanzu® Build Service™, Application Configuration Service for VMware Tanzu®, VMware Tanzu® Service Registry, Spring Cloud Gateway for VMware Tanzu®, and API portal for VMware Tanzu®.

For an implementation of this architecture, see the [Azure Spring Apps Reference Architecture][10] on GitHub.

Deployment options for this architecture include Azure Resource Manager (ARM), Terraform, Azure CLI, and Bicep. The artifacts in this repository provide a foundation that you can customize for your environment. You can group resources such as Azure Firewall or Application Gateway into different resource groups or subscriptions. This grouping helps keep different functions separate, such as IT infrastructure, security, business application teams, and so on.

## Planning the address space

Azure Spring Apps requires two dedicated subnets:

* Service runtime
* Spring Boot applications

Each of these subnets requires a dedicated Azure Spring Apps cluster. Multiple clusters can't share the same subnets. The minimum size of each subnet is /28. The number of application instances that Azure Spring Apps can support varies based on the size of the subnet. You can find the detailed virtual network requirements in the [Virtual network requirements][11] section of [Deploy Azure Spring Apps in a virtual network][17].

> [!WARNING]
> The selected subnet size can't overlap with the existing virtual network address space, and shouldn't overlap with any peered or on-premises subnet address ranges.

## Use cases

Typical uses for this architecture include:

* Private applications: Internal applications deployed in hybrid cloud environments
* Public applications: Externally facing applications

These use cases are similar except for their security and network traffic rules. This architecture is designed to support the nuances of each.

## Private applications

The following list describes the infrastructure requirements for private applications. These requirements are typical in highly regulated environments.

* A subnet must only have one instance of Azure Spring Apps.
* Adherence to at least one Security Benchmark should be enforced.
* Application host Domain Name Service (DNS) records should be stored in Azure Private DNS.
* Azure service dependencies should communicate through Service Endpoints or Private Link.
* Data at rest should be encrypted.
* Data in transit should be encrypted.
* DevOps deployment pipelines can be used (for example, Azure DevOps) and require network connectivity to Azure Spring Apps.
* Egress traffic should travel through a central Network Virtual Appliance (NVA) (for example, Azure Firewall).
* If [Azure Spring Apps Config Server][8] is used to load config properties from a repository, the repository must be private.
* Microsoft's Zero Trust security approach requires secrets, certificates, and credentials to be stored in a secure vault. The recommended service is Azure Key Vault.
* Name resolution of hosts on-premises and in the Cloud should be bidirectional.
* No direct egress to the public Internet except for control plane traffic.
* Resource Groups managed by the Azure Spring Apps deployment must not be modified.
* Subnets managed by the Azure Spring Apps deployment must not be modified.

The following list shows the components that make up the design:

* On-premises network
  * Domain Name Service (DNS)
  * Gateway
* Hub subscription
  * Application Gateway Subnet
  * Azure Firewall Subnet
  * Shared Services Subnet
* Connected subscription
  * Azure Bastion Subnet
  * Virtual Network Peer

The following list describes the Azure services in this reference architecture:

* [Azure Key Vault][2]: a hardware-backed credential management service that has tight integration with Microsoft identity services and compute resources.

* [Azure Monitor][3]: an all-encompassing suite of monitoring services for applications that deploy both in Azure and on-premises.

* [Azure Pipelines][5]: a fully featured Continuous Integration / Continuous Development (CI/CD) service that can automatically deploy updated Spring Boot apps to Azure Spring Apps.

* [Microsoft Defender for Cloud][4]: a unified security management and threat protection system for workloads across on-premises, multiple clouds, and Azure.

* [Azure Spring Apps][1]: a managed service that's designed and optimized specifically for Java-based Spring Boot applications and .NET-based [Steeltoe][9] applications.

The following diagrams represent a well-architected hub and spoke design that addresses the above requirements:

### [Standard plan](#tab/azure-spring-standard)

:::image type="content" source="media/reference-architecture/architecture-private-standard.png" alt-text="Diagram showing the reference architecture for private applications using the Azure Spring Apps Standard plan." lightbox="media/reference-architecture/architecture-private-standard.png" border="false":::

### [Enterprise plan](#tab/azure-spring-enterprise)

:::image type="content" source="media/reference-architecture/architecture-private-enterprise.png" alt-text="Diagram showing the reference architecture for private applications using the Azure Spring Apps Enterprise plan." lightbox="media/reference-architecture/architecture-private-enterprise.png" border="false":::

---

## Public applications

The following list describes the infrastructure requirements for public applications. These requirements are typical in highly regulated environments.

* A subnet must only have one instance of Azure Spring Apps.
* Adherence to at least one Security Benchmark should be enforced.
* Application host Domain Name Service (DNS) records should be stored in Azure Private DNS.
* Azure DDoS Protection should be enabled.
* Azure service dependencies should communicate through Service Endpoints or Private Link.
* Data at rest should be encrypted.
* Data in transit should be encrypted.
* DevOps deployment pipelines can be used (for example, Azure DevOps) and require network connectivity to Azure Spring Apps.
* Egress traffic should travel through a central Network Virtual Appliance (NVA) (for example, Azure Firewall).
* Ingress traffic should be managed by at least Application Gateway or Azure Front Door.
* Internet routable addresses should be stored in Azure Public DNS.
* Microsoft's Zero Trust security approach requires secrets, certificates, and credentials to be stored in a secure vault. The recommended service is Azure Key Vault.
* Name resolution of hosts on-premises and in the Cloud should be bidirectional.
* No direct egress to the public Internet except for control plane traffic.
* Resource Groups managed by the Azure Spring Apps deployment must not be modified.
* Subnets managed by the Azure Spring Apps deployment must not be modified.

The following list shows the components that make up the design:

* On-premises network
  * Domain Name Service (DNS)
  * Gateway
* Hub subscription
  * Application Gateway Subnet
  * Azure Firewall Subnet
  * Shared Services Subnet
* Connected subscription
  * Azure Bastion Subnet
  * Virtual Network Peer

The following list describes the Azure services in this reference architecture:

* [Azure Application Firewall][7]: a feature of Azure Application Gateway that provides centralized protection of applications from common exploits and vulnerabilities.

* [Azure Application Gateway][6]: a load balancer responsible for application traffic with Transport Layer Security (TLS) offload operating at layer 7.

* [Azure Key Vault][2]: a hardware-backed credential management service that has tight integration with Microsoft identity services and compute resources.

* [Azure Monitor][3]: an all-encompassing suite of monitoring services for applications that deploy both in Azure and on-premises.

* [Azure Pipelines][5]: a fully featured Continuous Integration / Continuous Development (CI/CD) service that can automatically deploy updated Spring Boot apps to Azure Spring Apps.

* [Microsoft Defender for Cloud][4]: a unified security management and threat protection system for workloads across on-premises, multiple clouds, and Azure.

* [Azure Spring Apps][1]: a managed service that's designed and optimized specifically for Java-based Spring Boot applications and .NET-based [Steeltoe][9] applications.

The following diagrams represent a well-architected hub and spoke design that addresses the above requirements. Only the hub-virtual-network communicates with the internet:

### [Standard plan](#tab/azure-spring-standard)

:::image type="content" source="media/reference-architecture/architecture-public-standard.png" alt-text="Diagram showing the reference architecture for public applications using the Azure Spring Apps Standard plan." lightbox="media/reference-architecture/architecture-public-standard.png" border="false":::

### [Enterprise plan](#tab/azure-spring-enterprise)

:::image type="content" source="media/reference-architecture/architecture-public-enterprise.png" alt-text="Diagram showing the reference architecture for public applications using the Azure Spring Apps Enterprise plan." lightbox="media/reference-architecture/architecture-public-enterprise.png" border="false":::

---

## Azure Spring Apps on-premises connectivity

Applications in Azure Spring Apps can communicate to various Azure, on-premises, and external resources. By using the hub and spoke design, applications can route traffic externally or to the on-premises network using Express Route or Site-to-Site Virtual Private Network (VPN).

## Azure Well-Architected Framework considerations

The [Azure Well-Architected Framework][16] is a set of guiding tenets to follow in establishing a strong infrastructure foundation. The framework contains the following categories: cost optimization, operational excellence, performance efficiency, reliability, and security.

### Cost optimization

Because of the nature of distributed system design, infrastructure sprawl is a reality. This reality results in unexpected and uncontrollable costs. Azure Spring Apps is built using components that scale so that it can meet demand and optimize cost. The core of this architecture is the Azure Kubernetes Service (AKS). The service is designed to reduce the complexity and operational overhead of managing Kubernetes, which includes efficiencies in the operational cost of the cluster.

You can deploy different applications and application types to a single instance of Azure Spring Apps. The service supports autoscaling of applications triggered by metrics or schedules that can improve utilization and cost efficiency.

You can also use Application Insights and Azure Monitor to lower operational cost. With the visibility provided by the comprehensive logging solution, you can implement automation to scale the components of the system in real time. You can also analyze log data to reveal inefficiencies in the application code that you can address to improve the overall cost and performance of the system.

### Operational excellence

Azure Spring Apps addresses multiple aspects of operational excellence. You can combine these aspects to ensure that the service runs efficiently in production environments, as described in the following list:

* You can use Azure Pipelines to ensure that deployments are reliable and consistent while helping you avoid human error.
* You can use Azure Monitor and Application Insights to store log and telemetry data.
  You can assess collected log and metric data to ensure the health and performance of your applications. Application Performance Monitoring (APM) is fully integrated into the service through a Java agent. This agent provides visibility into all the deployed applications and dependencies without requiring extra code. For more information, see the blog post [Effortlessly monitor applications and dependencies in Azure Spring Apps][15].
* You can use Microsoft Defender for Cloud to ensure that applications maintain security by providing a platform to analyze and assess the data provided.
* The service supports various deployment patterns. For more information, see [Set up a staging environment in Azure Spring Apps][14].

### Reliability

Azure Spring Apps is built on AKS. While AKS provides a level of resiliency through clustering, this reference architecture goes even further by incorporating services and architectural considerations to increase availability of the application if there's component failure.

By building on top of a well-defined hub and spoke design, the foundation of this architecture ensures that you can deploy it to multiple regions. For the private application use case, the architecture uses Azure Private DNS to ensure continued availability during a geographic failure. For the public application use case, Azure Front Door and Azure Application Gateway ensure availability.

### Security

The security of this architecture is addressed by its adherence to industry-defined controls and benchmarks. In this context, "control" means a concise and well-defined best practice, such as "Employ the least privilege principle when implementing information system access. IAM-05" The controls in this architecture are from the [Cloud Control Matrix][19] (CCM) by the [Cloud Security Alliance][18] (CSA) and the [Microsoft Azure Foundations Benchmark][20] (MAFB) by the [Center for Internet Security][21] (CIS). In the applied controls, the focus is on the primary security design principles of governance, networking, and application security. It is your responsibility to handle the design principles of Identity, Access Management, and Storage as they relate to your target infrastructure.

#### Governance

The primary aspect of governance that this architecture addresses is segregation through the isolation of network resources. In the CCM, DCS-08 recommends ingress and egress control for the datacenter. To satisfy the control, the architecture uses a hub and spoke design using Network Security Groups (NSGs) to filter east-west traffic between resources. The architecture also filters traffic between central services in the hub and resources in the spoke. The architecture uses an instance of Azure Firewall to manage traffic between the internet and the resources within the architecture.

The following list shows the control that addresses datacenter security in this reference:

| CSA CCM Control ID | CSA CCM Control Domain                         |
|:-------------------|:-----------------------------------------------|
| DCS-08             | Datacenter Security Unauthorized Persons Entry |

#### Network

The network design supporting this architecture is derived from the traditional hub and spoke model. This decision ensures that network isolation is a foundational construct. CCM control IVS-06 recommends that traffic between networks and virtual machines are restricted and monitored between trusted and untrusted environments. This architecture adopts the control by implementation of the NSGs for east-west traffic (within the "data center"), and the Azure Firewall for north-south traffic (outside of the "data center"). CCM control IPY-04 recommends that the infrastructure should use secure network protocols for the exchange of data between services. The Azure services supporting this architecture all use standard secure protocols such as TLS for HTTP and SQL.

The following list shows the CCM controls that address network security in this reference:

| CSA CCM Control ID | CSA CCM Control Domain |
| :----------------- | :----------------------|
| IPY-04             | Network Protocols      |
| IVS-06             | Network Security       |

The network implementation is further secured by defining controls from the MAFB. The controls ensure that traffic into the environment is restricted from the public Internet.

The following list shows the CIS controls that address network security in this reference:

| CIS Control ID | CIS Control Description                                        |
|:---------------|:---------------------------------------------------------------|
| 6.2            | Ensure that SSH access is restricted from the internet.        |
| 6.3            | Ensure no SQL Databases allow ingress 0.0.0.0/0 (ANY IP).      |
| 6.5            | Ensure that Network Watcher is 'Enabled'.                      |
| 6.6            | Ensure that ingress using UDP is restricted from the internet. |

Azure Spring Apps requires management traffic to egress from Azure when deployed in a secured environment. You must allow the network and application rules listed in [Customer responsibilities for running Azure Spring Apps in a virtual network](./vnet-customer-responsibilities.md).

#### Application security

This design principle covers the fundamental components of identity, data protection, key management, and application configuration. By design, an application deployed in Azure Spring Apps runs with least privilege required to function. The set of authorization controls is directly related to data protection when using the service. Key management strengthens this layered application security approach.

The following list shows the CCM controls that address key management in this reference:

| CSA CCM Control ID | CSA CCM Control Domain                                  |
|:-------------------|:--------------------------------------------------------|
| EKM-01             | Encryption and Key Management Entitlement               |
| EKM-02             | Encryption and Key Management Key Generation            |
| EKM-03             | Encryption and Key Management Sensitive Data Protection |
| EKM-04             | Encryption and Key Management Storage and Access        |

From the CCM, EKM-02, and EKM-03 recommend policies and procedures to manage keys and to use encryption protocols to protect sensitive data. EKM-01 recommends that all cryptographic keys have identifiable owners so that they can be managed. EKM-04 recommends the use of standard algorithms.

The following list shows the CIS controls that address key management in this reference:

| CIS Control ID | CIS Control Description                                |
|:---------------|:-------------------------------------------------------|
| 8.1            | Ensure that the expiration date is set on all keys.    |
| 8.2            | Ensure that the expiration date is set on all secrets. |
| 8.4            | Ensure the key vault is recoverable.                   |

The CIS controls 8.1 and 8.2 recommend that expiration dates are set for credentials to ensure that rotation is enforced. CIS control 8.4 ensures that the contents of the key vault can be restored to maintain business continuity.

The aspects of application security set a foundation for the use of this reference architecture to support a Spring workload in Azure.

## Next steps

Explore this reference architecture through the ARM, Terraform, and Azure CLI deployments available in the [Azure Spring Apps Reference Architecture][10] repository.

<!-- Reference links in article -->
[1]: ./index.yml
[2]: ../key-vault/index.yml
[3]: ../azure-monitor/index.yml
[4]: ../security-center/index.yml
[5]: /azure/devops/pipelines/
[6]: ../application-gateway/index.yml
[7]: ../web-application-firewall/index.yml
[8]: ./how-to-config-server.md
[9]: https://steeltoe.io/
[10]: https://github.com/Azure/azure-spring-apps-landing-zone-accelerator/tree/reference-architecture
[11]: ./how-to-deploy-in-azure-virtual-network.md#virtual-network-requirements
[12]: ./vnet-customer-responsibilities.md#azure-spring-apps-network-requirements
[13]: ./vnet-customer-responsibilities.md#azure-spring-apps-fqdn-requirements--application-rules
[14]: ./how-to-staging-environment.md
[15]: https://devblogs.microsoft.com/java/monitor-applications-and-dependencies-in-azure-spring-cloud/
[16]: /azure/architecture/framework/
[17]: ./how-to-deploy-in-azure-virtual-network.md#virtual-network-requirements
[18]: https://cloudsecurityalliance.org/
[19]: https://cloudsecurityalliance.org/research/working-groups/cloud-controls-matrix
[20]: /azure/security/benchmarks/v2-cis-benchmark
[21]: https://www.cisecurity.org/
