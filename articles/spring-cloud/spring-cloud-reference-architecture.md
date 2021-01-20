---
ms.date: 01/19/2021
ms.topic: reference-architecture
author: kriation
title: Azure Spring Cloud Reference Architecture
ms.author: akaleshian
ms.service: azure
ms.subservice: spring-cloud
description: This architecture reference is a foundation leveraging a typical enterprise hub and spoke enterprise design for the use of Azure Spring Cloud.
---

# Azure Spring Cloud Reference Architecture

This architecture reference is a foundation leveraging a typical enterprise hub and spoke enterprise design for the use of Azure Spring Cloud. In the design, Spring Cloud is deployed in a single spoke which is dependent on shared services hosted in the hub. The architecture is built with components to achieve the tenants in the Well-Architected framework. There two typical uses of this architecture are for internal web applications deployed in hybrid cloud environments and externally facing web applications. These use cases are similar except for their security and network traffic rules. This architecture is designed to support the nuances of each.

### Private Web Applications
The architecture for private web applications builds on the traditional hub and spoke design. This ensures that the application components are segregated from the shared services hub. The infrastructure requirements for a private web application are the following:

* No direct egress to the public Internet except for control plane traffic
* Egress traffic must traverse a central Network Virtual Appliance (NVA) (e.g., Azure Firewall)
* Data at rest must be encrypted
* Data in transit must be encrypted
* Azure DevOps self-hosted build agents must be used
* Secrets and Credentials must be stored in Azure Key Vault
* Application host DNS records must be stored in Azure Private DNS
* Name resolution of hosts on-premise and in the Cloud must be bidirectional
* Adherence to at least one Security Benchmark must be enforced
* Azure service dependencies must communicate through Service Endpoints or Private Link
* Resource Groups managed by the Azure Spring Cloud deployment must not be modified
* Subnets managed by the Azure Spring Cloud deployment must not be modified
* A subnet must only have one instance of Azure Spring Cloud

The components that make up the design are the following:

* On-Premises Network
    * Domain Name Service (DNS)
    * Gateway
* Hub Subscription
    * Azure Firewall Subnet
    * Application Gateway Subnet
    * Shared Services Subnet
* Connected Subscription
    * Virtual Network Peer
    * Azure Bastion Subnet

The Azure services that are used in this reference architecture are the following:

* [Azure Spring Cloud][1]
: provides a managed service that's designed and optimized specifically for Spring microservices that are written in Java

* [Azure Key Vault][2]
: a hardware-backed credential management service that has tight integration with Microsoft identity services and compute resources

* [Azure Monitor][3]
: an all-encompassing suite of monitoring services for applications that deploy both in Azure and on-premises

* [Azure Security Center][4]
: a unified security management and threat protection system for workloads across on-premises, multiple clouds, and Azure

* [Azure Pipelines][5]
: a fully featured Continuous Integration/Continuous Development (CI/CD) service that can automatically deploy updated Springboot apps to Azure Spring Cloud

The following diagram represents a well-architected hub and spoke design that addresses the above requirements.
![Reference architecture diagram for private web applications](./media/spring-cloud-reference-architecture/architecture-private.png)

### Public Web Applications
The architecture for public web applications builds on the traditional hub and spoke design. This ensures that the application components are segregated from the shared services hub. The infrastructure requirements for a public web application are the following:

* Ingress traffic must be managed by at least Application Gateway or Azure Front Door
* Azure DDoS Protection standard must be enabled
* No direct egress to the public Internet except for control plane traffic
* Egress traffic must traverse a central Network Virtual Appliance (NVA) (e.g., Azure Firewall)
* Data at rest must be encrypted
* Data in transit must be encrypted
* Azure DevOps self-hosted build agents must be used
* Secrets and Credentials must be stored in Azure Key Vault
* Application host DNS records must be stored in Azure Private DNS
* Internet routable addresses must be stored in Azure Public DNS
* Name resolution of hosts on-premise and in the Cloud must be bidirectional
* Adherence to at least one Security Benchmark must be enforced
* Azure service dependencies must communicate through Service Endpoints or Private Link
* Resource Groups managed by the Azure Spring Cloud deployment must not be modified
* Subnets managed by the Azure Spring Cloud deployment must not be modified
* A subnet must only have one instance of Azure Spring Cloud

The components that make up the design are the following:

* On-Premises Network
    * Domain Name Service (DNS)
    * Gateway
* Hub Subscription
    * Azure Firewall Subnet
    * Application Gateway Subnet
    * Shared Services Subnet
* Connected Subscription
    * Virtual Network Peer
    * Azure Bastion Subnet

The Azure services that are used in this reference architecture are the following:

* [Azure Spring Cloud][1]
: provides a managed service that's designed and optimized specifically for Spring microservices that are written in Java

* [Azure Key Vault][2]
: a hardware-backed credential management service that has tight integration with Microsoft identity services and compute resources

* [Azure Monitor][3]
: an all-encompassing suite of monitoring services for applications that deploy both in Azure and on-premises

* [Azure Security Center][4]
: a unified security management and threat protection system for workloads across on-premises, multiple clouds, and Azure

* [Azure Pipelines][5]
: a fully featured Continuous Integration/Continuous Development (CI/CD) service that can automatically deploy updated Springboot apps to Azure Spring Cloud

* [Azure Application Gateway][6]
: a web traffic load balancer with TLS offloading which operates at layer 7 for managing traffic to backend service hosts

* [Azure Web Application Firewall][7]
: a feature of Azure Application Gateway that provides centralized protection of a web applications from common exploits and vulnerabilities

The following diagram represents a well-architected hub and spoke design that addresses the above requirements.
![Reference architecture diagram for public web applications](./media/spring-cloud-reference-architecture/architecture-public.png)

## Well-Architected Framework Considerations
### Cost Optimization
By the nature of distributed system design, infrastructure sprawl is a reality. The result is unexpected costs that cannot be controlled. To temper this result, Azure Spring Cloud is built using components that are scalable by design to ensure that the system is properly sized at any point in time to meet demand. The core of this architecture is the Azure Kubernetes Service (AKS). The service is designed to reduce the complexity and operational overhead of managing Kubernetes which includes efficiencies in the operational cost of the cluster.

An additional aspect to address operational cost of the architecture is in the implementation of Application Insights and Azure Monitor by design. With the visibility provided by the comprehensive logging solution, automation can be implemented to scale the components of the system in real-time. In addition, analysis of the log data can reveal inefficiencies in the application code that can be addressed to improve the overall cost and performance of the system.

### Operational Excellence
### Performance Efficiency
### Reliability
Azure Spring Cloud is designed with Azure Kubernetes as a foundational component. While AKS provides a level of resiliency through clustering, this reference architecture incorporates services and architectural considerations to increase availability of the application due to a component failure.

By building on top of a well defined hub and spoke design, the foundation of this architecture ensures that it can be deployed to multiple regions. For the private application use case, Azure Private DNS is used to ensure continued availability in the event of a geographic failure. Similarly, for the public application use case, a combination of Azure Front Door and Azure Application Gateway provides protection from the same ensuring increased availability.

### Security
As one of the guiding tenants of the Azure Well-Architected Framework, security of this architecture was addressed by adhering to industry defined controls and benchmarks. The controls used in this architecture are from the Cloud Control Matrix (CCM) by the Cloud Security Alliance and the Microsoft Azure Foundations Benchmark (MAFB) by the Center for Internet Security. The primary security design principles of governance, networking, and application security were the focus of the applied controls. The design principles of Identity and Access Management and Storage are the responsibility of the reader as it relates to their target infrastructure.

#### Governance
The primary aspect of governance that this architecture addresses is segregation through isolation of network resources. In the CCM, DCS-08 recommends ingress and egress control for the datacenter. To satisfy the control, the architecture leverages a hub and spoke design using Network Security Groups (NSGs) to filter east-west traffic between resources, as well as traffic between central services in the hub and resources in the spoke. In addition, north-south traffic, particularly the flow between the Internet and the resources within the architecture, is managed through an instance of Azure Firewall.

| CSA CCM Control ID | CSA CCM Control Domain |
| :----------------- | :----------------------|
| DCS-08 | Datacenter Security Unauthorized Persons Entry |


#### Network
The network design supporting this architecture is derived from the traditional hub and spoke model. This decision ensures that network isolation is a foundational construct. CCM control IVS-06 recommends that traffic between networks and virtual machines are restricted and monitored between trusted and untrusted environments. This architecture adopts the control by implementation of the NSGs for east-west traffic, and the Azure Firewall for north-south traffic. CCM control IPY-04 recommends that the infrastructure should use secure network protocols for the exchange of data between services. The Azure services supporting this architecture all use standard secure protocols such as TLS for HTTP and SQL.

| CSA CCM Control ID | CSA CCM Control Domain |
| :----------------- | :----------------------|
| IPY-04 | Interoperability & Portability Standardized Network Protocols |
| IVS-06 | Infrastructure & Virtualization SecurityNetwork Security |

The network implementation is further secured by defining controls from the MAFB. The controls address restricting SSH from the Internet (6.2), restricting SQL database ingress from any 0.0.0.0/0 IP (6.3), ensuring that Network Watcher is enabled (6.5), and restricting UDP services from the Internet (6.6). The network egress rules implemented in this reference architecture are defined in the [Appendix](#appendix).

| CIS Control ID | CIS Control Description |
| :------------- | :---------------------- |
| 6.2 | Ensure that SSH access is restricted from the internet |
| 6.3 | Ensure no SQL Databases allow ingress 0.0.0.0/0 (ANY IP) |
| 6.5 | Ensure that Network Watcher is 'Enabled' |
| 6.6 | Ensure that UDP Services are restricted from the Internet |

#### Application Security
This design principal is comprised of fundamental components which are identity, data protection, key management, and application configuration. For this reference architecture, the focus is on key management where identity, data protection, and application configuration are the responsibility of the reader as it relates to their target infrastructure, and application.

The controls that address key management in this reference from the CCM are the following:
| CSA CCM Control ID | CSA CCM Control Domain |
| :----------------- | :--------------------- |
| EKM-01 | Encryption and Key Management Entitlement |
| EKM-02 | Encryption and Key Management Key Generation |
| EKM-03 | Encryption and Key Management Sensitive Data Protection |
| EKM-04 | Encryption and Key Management Storage and Access |

From the CCM, EKM-02, and EKM-03 specifically address the need for policies and procedures to govern cryptographic keys and the use of encryption protocols to protect sensitive data. EKM-01 recommends that all cryptographic keys have identifiable owners so that they can be managed. EKM-04 recommends the use of standard algorithms.

| CIS Control ID | CIS Control Description |
| :------------- | :---------------------- |
| 8.1 | Ensure that the expiration date is set on all keys |
| 8.2 | Ensure that the expiration date is set on all secrets |
| 8.4 | Ensure the key vault is recoverable |
| 8.5 | Enable the role-based access control within Azure Kubernetes Service |

The CIS controls 8.1 and 8.2 recommend that expiration dates are set for credentials to ensure that rotation is enforced. CIS control 8.4 ensures that the contents of the key vault can be restored to maintain business continuity. CIS control 8.5 ensures that the permissions provided to the cluster are using least privilege.

## Appendix

### Egress Rules

| Service Tag/FQDN | Port | Use |
| :--------------- | :--- | :-- |
| AzureCloud | TCP:443 | Azure Spring Cloud Service Management |
| AzureCloud | UDP:1194 | Azure Kubernetes Cluster Management |
| AzureCloud | TCP:9000 | Azure Kubernetes Cluster Management |
| Azure Container Registry (*.azure.io) | TCP:443 | Azure Container Registry |
| Azure Storage ( *.file.core.windows.net) | TCP:445 | Azure File Storage |
| ntp.ubuntu.com | UDP:123 | NTP synchronization for Linux nodes |
| *.azmk8s.io | TCP:443 | Azure Kubernetes Cluster Management |
| mcr.microsoft.com | TCP:443 | Microsoft Container Registry (MCR) |
| *.cdn.mscr.io | TCP:443 | MCR storage backed by Azure Content Delivery Network (CDN) |
| *.data.mcr.microsoft.com | TCP:443 | MCR storage backed by Azure CDN |
| management.azure.com | TCP:443 | Azure Kubernetes Cluster Management |
| login.microsoftonline.com | TCP:443 | Azure Active Directory authentication |
| packages.microsoft.com | TCP:443 | Microsoft Packages Repository |
| acs-mirror.azureedge.net | TCP:443 | Repository containing binaries for Kubenet and Azure Container Networking Interface (CNI) |

<!-- Reference links in article -->
[1]: /azure/spring-cloud/
[2]: /azure/key-vault/
[3]: /azure/azure-monitor/
[4]: /azure/security-center/
[5]: /azure/devops/pipelines/
[6]: /azure/application-gateway/
[7]: /azure/web-application-firewall/
