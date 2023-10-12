---
title: Azure guidance for secure isolation
description: Customer guidance for Azure secure isolation across compute, networking, and storage.
author: stevevi
ms.author: stevevi
ms.service: azure-government
ms.topic: article
recommendations: false
ms.date: 07/14/2023
---

# Azure guidance for secure isolation
Microsoft Azure is a hyperscale public multi-tenant cloud services platform that provides you with access to a feature-rich environment incorporating the latest cloud innovations such as artificial intelligence, machine learning, IoT services, big-data analytics, intelligent edge, and many more to help you increase efficiency and unlock insights into your operations and performance.

A multi-tenant cloud platform implies that multiple customer applications and data are stored on the same physical hardware. Azure uses logical isolation to segregate your applications and data from other customers. This approach provides the scale and economic benefits of multi-tenant cloud services while rigorously helping prevent other customers from accessing your data or applications.

Azure addresses the perceived risk of resource sharing by providing a trustworthy foundation for assuring multi-tenant, cryptographically certain, logically isolated cloud services using a common set of principles:

1. User access controls with authentication and identity separation
2. Compute isolation for processing
3. Networking isolation including data encryption in transit
4. Storage isolation with data encryption at rest
5. Security assurance processes embedded in service design to correctly develop logically isolated services

Multi-tenancy in the public cloud improves efficiency by multiplexing resources among disparate customers at low cost; however, this approach introduces the perceived risk associated with resource sharing. Azure addresses this risk by providing a trustworthy foundation for isolated cloud services using a multi-layered approach depicted in Figure 1.

:::image type="content" source="./media/secure-isolation-fig1.png" alt-text="Azure isolation approaches" border="false":::
**Figure 1.**  Azure isolation approaches

A brief summary of isolation approaches is provided below.

- **User access controls with authentication and identity separation** – All data in Azure irrespective of the type or storage location is associated with a subscription. A cloud tenant can be viewed as a dedicated instance of Microsoft Entra ID that your organization receives and owns when you sign up for a Microsoft cloud service. The identity and access stack helps enforce isolation among subscriptions, including limiting access to resources within a subscription only to authorized users.
- **Compute isolation** – Azure provides you with both logical and physical compute isolation for processing. Logical isolation is implemented via:
   - *Hypervisor isolation* for services that provide cryptographically certain isolation by using separate virtual machines and using Azure Hypervisor isolation.
   - *Drawbridge isolation* inside a virtual machine (VM) for services that provide cryptographically certain isolation for workloads running on the same virtual machine by using isolation provided by [Drawbridge](https://www.microsoft.com/research/project/drawbridge/). These services provide small units of processing using customer code.
   - *User context-based isolation* for services that are composed solely of Microsoft-controlled code and customer code isn't allowed to run. </br>
   
   In addition to robust logical compute isolation available by design to all Azure tenants, if you desire physical compute isolation, you can use Azure Dedicated Host or isolated Virtual Machines, which are deployed on server hardware dedicated to a single customer.
- **Networking isolation** – Azure Virtual Network (VNet) helps ensure that your private network traffic is logically isolated from traffic belonging to other customers. Services can communicate using public IPs or private (VNet) IPs. Communication between your VMs remains private within a VNet. You can connect your VNets via [VNet peering](../virtual-network/virtual-network-peering-overview.md) or [VPN gateways](../vpn-gateway/vpn-gateway-about-vpngateways.md), depending on your connectivity options, including bandwidth, latency, and encryption requirements. You can use [network security groups](../virtual-network/network-security-groups-overview.md) (NSGs) to achieve network isolation and protect your Azure resources from the Internet while accessing Azure services that have public endpoints. You can use Virtual Network [service tags](../virtual-network/service-tags-overview.md) to define network access controls on [network security groups](../virtual-network/network-security-groups-overview.md#security-rules) or [Azure Firewall](../firewall/service-tags.md). A service tag represents a group of IP address prefixes from a given Azure service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change, thereby reducing the complexity of frequent updates to network security rules. Moreover, you can use [Private Link](../private-link/private-link-overview.md) to access Azure PaaS services over a private endpoint in your VNet, ensuring that traffic between your VNet and the service travels across the Microsoft global backbone network, which eliminates the need to expose the service to the public Internet. Finally, Azure provides you with options to encrypt data in transit, including [Transport Layer Security (TLS) end-to-end encryption](../application-gateway/ssl-overview.md) of network traffic with [TLS termination using Key Vault certificates](../application-gateway/key-vault-certs.md), [VPN encryption](../vpn-gateway/vpn-gateway-about-compliance-crypto.md) using IPsec, and Azure ExpressRoute encryption using [MACsec with customer-managed keys (CMK) support](../expressroute/expressroute-about-encryption.md#point-to-point-encryption-by-macsec-faq).
- **Storage isolation** – To ensure cryptographic certainty of logical data isolation, Azure Storage relies on data encryption at rest using advanced algorithms with multiple ciphers. This process relies on multiple encryption keys and services such as Azure Key Vault and Microsoft Entra ID to ensure secure key access and centralized key management. Azure Storage service encryption ensures that data is automatically encrypted before persisting it to Azure Storage and decrypted before retrieval. All data written to Azure Storage is [encrypted through FIPS 140 validated 256-bit AES encryption](../storage/common/storage-service-encryption.md#about-azure-storage-service-side-encryption) and you can use Key Vault for customer-managed keys (CMK). Azure Storage service encryption encrypts the page blobs that store Azure Virtual Machine disks. Moreover, Azure Disk encryption may optionally be used to encrypt Azure Windows and Linux IaaS Virtual Machine disks to increase storage isolation and assure cryptographic certainty of your data stored in Azure. This encryption includes managed disks.
- **Security assurance processes and practices** – Azure isolation assurance is further enforced by Microsoft’s internal use of the [Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) (SDL) and other strong security assurance processes to protect attack surfaces and mitigate threats. Microsoft has established industry-leading processes and tooling that provides high confidence in the Azure isolation guarantee.

In line with the [shared responsibility](../security/fundamentals/shared-responsibility.md) model in cloud computing, as you migrate workloads from your on-premises datacenter to the cloud, the delineation of responsibility between you and cloud service provider varies depending on the cloud service model. For example, with the Infrastructure as a Service (IaaS) model, Microsoft’s responsibility ends at the Hypervisor layer, and you're responsible for all layers above the virtualization layer, including maintaining the base operating system in guest VMs. You can use Azure isolation technologies to achieve the desired level of isolation for your applications and data deployed in the cloud.

Throughout this article, call-out boxes outline important considerations or actions considered to be part of your responsibility. For example, you can use Azure Key Vault to store your secrets, including encryption keys that remain under your control.

> [!NOTE]
> Use of Azure Key Vault for customer managed keys (CMK) is optional and represents your responsibility.
>
> *Extra resources:*
> - How to **[get started with Key Vault certificates](../key-vault/certificates/certificate-scenarios.md)**

This article provides technical guidance to address common security and isolation concerns pertinent to cloud adoption. It also explores design principles and technologies available in Azure to help you achieve your secure isolation objectives.

> [!TIP]
> For recommendations on how to improve the security of applications and data deployed on Azure, you should review the **[Azure Security Benchmark](/security/benchmark/azure/)** documentation.

## Identity-based isolation
[Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md) is an identity repository and cloud service that provides authentication, authorization, and access control for your users, groups, and objects. Microsoft Entra ID can be used as a standalone cloud directory or as an integrated solution with existing on-premises Active Directory to enable key enterprise features such as directory synchronization and single sign-on.

Each Azure [subscription](/azure/cloud-adoption-framework/decision-guides/subscriptions/) is associated with a Microsoft Entra tenant. Using [Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md), users, groups, and applications from that directory can be granted access to resources in the Azure subscription. For example, a storage account can be placed in a resource group to control access to that specific storage account using Microsoft Entra ID. Azure Storage defines a set of Azure built-in roles that encompass common permissions used to access blob or queue data. A request to Azure Storage can be authorized using either your Microsoft Entra account or the Storage Account Key. In this manner, only specific users can be given the ability to access data in Azure Storage.

### Zero Trust architecture
All data in Azure irrespective of the type or storage location is associated with a subscription. A cloud tenant can be viewed as a dedicated instance of Microsoft Entra ID that your organization receives and owns when you sign up for a Microsoft cloud service. Authentication to the Azure portal is performed through Microsoft Entra ID using an identity created either in Microsoft Entra ID or federated with an on-premises Active Directory. The identity and access stack helps enforce isolation among subscriptions, including limiting access to resources within a subscription only to authorized users. This access restriction is an overarching goal of the [Zero Trust model](https://aka.ms/Zero-Trust), which assumes that the network is compromised and requires a fundamental shift from the perimeter security model. When evaluating access requests, all requesting users, devices, and applications should be considered untrusted until their integrity can be validated in line with the Zero Trust [design principles](https://www.microsoft.com/security/blog/2020/04/30/zero-trust-deployment-guide-azure-active-directory/). Microsoft Entra ID provides the strong, adaptive, standards-based identity verification required in a Zero Trust framework.

> [!NOTE]
> Extra resources:
>
> - To learn how to implement Zero Trust architecture on Azure, see **[Zero Trust Guidance Center](/security/zero-trust/)**.
> - For definitions and general deployment models, see **[NIST SP 800-207](https://csrc.nist.gov/publications/detail/sp/800-207/final)** *Zero Trust Architecture*.

<a name='azure-active-directory'></a>

### Microsoft Entra ID
The separation of the accounts used to administer cloud applications is critical to achieving logical isolation. Account isolation in Azure is achieved using [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md)  and its capabilities to support granular [Azure role-based access control](../role-based-access-control/overview.md) (Azure RBAC). Each Azure account is associated with one Microsoft Entra tenant. Users, groups, and applications from that directory can manage resources in Azure. You can assign appropriate access rights using the Azure portal, Azure command-line tools, and Azure Management APIs. Each Microsoft Entra tenant is distinct and separate from other Azure ADs. A Microsoft Entra instance is logically isolated using security boundaries to prevent customer data and identity information from comingling, thereby ensuring that users and administrators of one Microsoft Entra ID can't access or compromise data in another Microsoft Entra instance, either maliciously or accidentally. Microsoft Entra ID runs physically isolated on dedicated servers that are logically isolated to a dedicated network segment and where host-level packet filtering and Windows Firewall services provide extra protections from untrusted traffic.

Microsoft Entra ID implements extensive **data protection features**, including tenant isolation and access control, data encryption in transit, secrets encryption and management, disk level encryption, advanced cryptographic algorithms used by various Microsoft Entra components, data operational considerations for insider access, and more. Detailed information is available from a whitepaper [Microsoft Entra Data Security Considerations](https://aka.ms/AADDataWhitePaper).

Tenant isolation in Microsoft Entra ID involves two primary elements:

- Preventing data leakage and access across tenants, which means that data belonging to Tenant A can't in any way be obtained by users in Tenant B without explicit authorization by Tenant A.
- Resource access isolation across tenants, which means that operations performed by Tenant A can't in any way impact access to resources for Tenant B.

As shown in Figure 2, access via Microsoft Entra ID requires user authentication through a Security Token Service (STS). The authorization system uses information on the user’s existence and enabled state through the Directory Services API and Azure RBAC to determine whether the requested access to the target Microsoft Entra instance is authorized for the user in the session. Aside from token-based authentication that is tied directly to the user, Microsoft Entra ID further supports logical isolation in Azure through:

- Microsoft Entra instances are discrete containers and there's no relationship between them.
- Microsoft Entra data is stored in partitions and each partition has a predetermined set of replicas that are considered the preferred primary replicas. Use of replicas provides high availability of Microsoft Entra services to support identity separation and logical isolation.
- Access isn't permitted across Microsoft Entra instances unless the Microsoft Entra instance administrator grants it through federation or provisioning of user accounts from other Microsoft Entra instances.
- Physical access to servers that comprise the Microsoft Entra service and direct access to Microsoft Entra ID’s back-end systems is [restricted to properly authorized Microsoft operational roles](./documentation-government-plan-security.md#restrictions-on-insider-access) using the Just-In-Time (JIT) privileged access management system.
- Microsoft Entra users have no access to physical assets or locations, and therefore it isn't possible for them to bypass the logical Azure RBAC policy checks.

:::image type="content" source="./media/secure-isolation-fig2.png" alt-text="Microsoft Entra logical tenant isolation":::
**Figure 2.**  Microsoft Entra logical tenant isolation

In summary, Azure’s approach to logical tenant isolation uses identity, managed through Microsoft Entra ID, as the first logical control boundary for providing tenant-level access to resources and authorization through Azure RBAC.

## Data encryption key management
Azure has extensive support to safeguard your data using [data encryption](../security/fundamentals/encryption-overview.md), including various encryption models:

- Server-side encryption that uses service-managed keys, customer-managed keys in Azure, or customer-managed keys on customer-controlled hardware.
- Client-side encryption that enables you to manage and store keys on premises or in another secure location.

Data encryption provides isolation assurances that are tied directly to encryption (cryptographic) key access. Since Azure uses strong ciphers for data encryption, only entities with access to cryptographic keys can have access to data. Deleting or revoking cryptographic keys renders the corresponding data inaccessible. More information about **data encryption in transit** is provided in *[Networking isolation](#networking-isolation)* section, whereas **data encryption at rest** is covered in *[Storage isolation](#storage-isolation)* section.

Azure enables you to enforce **[double encryption](../security/fundamentals/double-encryption.md)** for both data at rest and data in transit. With this model, two or more layers of encryption are enabled to protect against compromises of any layer of encryption.

### Azure Key Vault
Proper protection and management of cryptographic keys is essential for data security. **[Azure Key Vault](../key-vault/index.yml) is a cloud service for securely storing and managing secrets.** The Key Vault service supports two resource types that are described in the rest of this section:

- **Vault** supports software-protected and hardware security module (HSM)-protected secrets, keys, and certificates.
- **Managed HSM** supports only HSM-protected cryptographic keys.

**If you require extra security for your most sensitive customer data stored in Azure services, you can encrypt it using your own encryption keys you control in Key Vault.**

The Key Vault service provides an abstraction over the underlying HSMs. It provides a REST API to enable service use from cloud applications and authentication through [Microsoft Entra ID](../active-directory/fundamentals/active-directory-whatis.md) to allow you to centralize and customize authentication, disaster recovery, high availability, and elasticity. Key Vault supports [cryptographic keys](../key-vault/keys/about-keys.md) of various types, sizes, and curves, including RSA and Elliptic Curve keys. With managed HSMs, support is also available for AES symmetric keys.

With Key Vault, you can import or generate encryption keys in HSMs, ensuring that keys never leave the HSM protection boundary to support *bring your own key (BYOK)* scenarios, as shown in Figure 3.

:::image type="content" source="./media/secure-isolation-fig3.png" alt-text="Azure Key Vault support for bring your own key (BYOK)":::
**Figure 3.**  Azure Key Vault support for bring your own key (BYOK)

**Keys generated inside the Key Vault HSMs aren't exportable – there can be no clear-text version of the key outside the HSMs.** This binding is enforced by the underlying HSM. BYOK functionality is available with both [key vaults](../key-vault/keys/hsm-protected-keys.md) and [managed HSMs](../key-vault/managed-hsm/hsm-protected-keys-byok.md). Methods for transferring HSM-protected keys to Key Vault vary depending on the underlying HSM, as explained in online documentation.

> [!NOTE]
> Azure Key Vault is designed, deployed, and operated such that Microsoft and its agents are precluded from accessing, using or extracting any data stored in the service, including cryptographic keys. For more information, see [How does Azure Key Vault protect your keys?](../key-vault/managed-hsm/mhsm-control-data.md#how-does-azure-key-vault-managed-hsm-protect-your-keys)

Key Vault provides a robust solution for encryption key lifecycle management. Upon creation, every key vault or managed HSM is automatically associated with the Microsoft Entra tenant that owns the subscription. Anyone trying to manage or retrieve content from a key vault or managed HSM must be properly authenticated and authorized:

- Authentication establishes the identity of the caller (user or application).
- Authorization determines which operations the caller can perform, based on a combination of [Azure role-based access control](../role-based-access-control/overview.md) (Azure RBAC) and key vault access policy or managed HSM local RBAC.

Microsoft Entra ID enforces tenant isolation and implements robust measures to prevent access by unauthorized parties, as described previously in *[Microsoft Entra ID](#azure-active-directory)* section. Access to a key vault or managed HSM is controlled through two interfaces or planes – management plane and data plane – with both planes using Microsoft Entra ID for authentication.

- **Management plane** enables you to manage the key vault or managed HSM itself, for example, create and delete key vaults or managed HSMs, retrieve key vault or managed HSM properties, and update access policies. For authorization, the management plane uses Azure RBAC with both key vaults and managed HSMs.
- **Data plane** enables you to work with the data stored in your key vaults and managed HSMs, including adding, deleting, and modifying your data. For vaults, stored data can include keys, secrets, and certificates. For managed HSMs, stored data is limited to cryptographic keys only. For authorization, the data plane uses [Key Vault access policy](../key-vault/general/assign-access-policy-portal.md) and [Azure RBAC for data plane operations](../key-vault/general/rbac-guide.md) with key vaults, or [managed HSM local RBAC](../key-vault/managed-hsm/access-control.md) with managed HSMs.

When you create a key vault or managed HSM in an Azure subscription, it's automatically associated with the Microsoft Entra tenant of the subscription. All callers in both planes must register in this tenant and authenticate to access the [key vault](../key-vault/general/security-features.md) or [managed HSM](../key-vault/managed-hsm/access-control.md).

You control access permissions and can extract detailed activity logs from the Azure Key Vault service. Azure Key Vault logs the following information:

- All authenticated REST API requests, including failed requests
  -	Operations on the key vault such as creation, deletion, setting access policies, and so on.
  -	Operations on keys and secrets in the key vault, including a) creating, modifying, or deleting keys or secrets, and b) signing, verifying, encrypting keys, and so on.
- Unauthenticated requests such as requests that don't have a bearer token, are malformed or expired, or have an invalid token.

> [!NOTE]
> With Azure Key Vault, you can monitor how and when your key vaults and managed HSMs are accessed and by whom.
>
> *Extra resources:*
> - **[Configure monitoring and alerting for Azure Key Vault](../key-vault/general/alert.md)**
> - **[Enable logging for Azure Key Vault](../key-vault/general/logging.md)**
> - **[How to secure storage account for Azure Key Vault logs](../storage/blobs/security-recommendations.md)**

You can also use the [Azure Key Vault solution in Azure Monitor](../key-vault/key-vault-insights-overview.md) to review Key Vault logs. To use this solution, you need to enable logging of Key Vault diagnostics and direct the diagnostics to a Log Analytics workspace. With this solution, it isn't necessary to write logs to Azure Blob storage.

> [!NOTE]
> For a comprehensive list of Azure Key Vault security recommendations, see **[Azure security baseline for Key Vault](/security/benchmark/azure/baselines/key-vault-security-baseline)**.

#### Vault
**[Vaults](../key-vault/general/overview.md)** provide a multi-tenant, low-cost, easy to deploy, zone-resilient (where available), and highly available key management solution suitable for most common cloud application scenarios. Vaults can store and safeguard [secrets, keys, and certificates](../key-vault/general/about-keys-secrets-certificates.md). They can be either software-protected (standard tier) or HSM-protected (premium tier). For a comparison between the standard and premium tiers, see the [Azure Key Vault pricing page](https://azure.microsoft.com/pricing/details/key-vault/). Software-protected secrets, keys, and certificates are safeguarded by Azure, using industry-standard algorithms and key lengths. If you require extra assurances, you can choose to safeguard your secrets, keys, and certificates in vaults protected by multi-tenant HSMs. The corresponding HSMs are validated according to the [FIPS 140 standard](/azure/compliance/offerings/offering-fips-140-2), and have an overall Security Level 2 rating, which includes requirements for physical tamper evidence and role-based authentication.

Vaults enable support for [customer-managed keys](../security/fundamentals/encryption-models.md) (CMK) where you can control your own keys in HSMs, and use them to encrypt data at rest for [many Azure services](../security/fundamentals/encryption-models.md#supporting-services). As mentioned previously, you can [import or generate encryption keys](../key-vault/keys/hsm-protected-keys.md) in HSMs ensuring that keys never leave the HSM boundary to support *bring your own key (BYOK)* scenarios.

Key Vault can handle requesting and renewing certificates in vaults, including Transport Layer Security (TLS) certificates, enabling you to enroll and automatically renew certificates from supported public Certificate Authorities. Key Vault certificates support provides for the management of your X.509 certificates, which are built on top of keys and provide an automated renewal feature. Certificate owner can [create a certificate](../key-vault/certificates/create-certificate.md) through Azure Key Vault or by importing an existing certificate. Both self-signed and Certificate Authority generated certificates are supported. Moreover, the Key Vault certificate owner can implement secure storage and management of X.509 certificates without interaction with private keys.

When you create a key vault in a resource group, you can [manage access](../key-vault/general/security-features.md) by using Microsoft Entra ID, which enables you to grant access at a specific scope level by assigning the appropriate Azure roles. For example, to grant access to a user to manage key vaults, you can assign a predefined key vault Contributor role to the user at a specific scope, including subscription, resource group, or specific resource.

> [!IMPORTANT]
> You should control tightly who has Contributor role access to your key vaults. If a user has Contributor permissions to a key vault management plane, the user can gain access to the data plane by setting a key vault access policy.
>
> *Extra resources:*
> - How to **[secure access to a key vault](../key-vault/general/security-features.md)**.

#### Managed HSM
**[Managed HSM](../key-vault/managed-hsm/overview.md)** provides a single-tenant, fully managed, highly available, zone-resilient (where available) HSM as a service to store and manage your cryptographic keys. It's most suitable for applications and usage scenarios that handle high value keys. It also helps you meet the most stringent security, compliance, and regulatory requirements. Managed HSM uses [FIPS 140 Level 3 validated HSMs](/azure/compliance/offerings/offering-fips-140-2) to protect your cryptographic keys. Each managed HSM pool is an isolated single-tenant instance with its own [security domain](../key-vault/managed-hsm/security-domain.md) controlled by you and isolated cryptographically from instances belonging to other customers. Cryptographic isolation relies on [Intel Software Guard Extensions](https://software.intel.com/sgx) (SGX) technology that provides encrypted code and data to help ensure your control over cryptographic keys.

When a managed HSM is created, the requestor also provides a list of data plane administrators. Only these administrators are able to [access the managed HSM data plane](../key-vault/managed-hsm/access-control.md) to perform key operations and manage data plane role assignments (managed HSM local RBAC). The permission model for both the management and data planes uses the same syntax, but permissions are enforced at different levels, and role assignments use different scopes. Management plane Azure RBAC is enforced by Azure Resource Manager while data plane-managed HSM local RBAC is enforced by the managed HSM itself.

> [!IMPORTANT]
> Unlike with key vaults, granting your users management plane access to a managed HSM doesn't grant them any access to data plane to access keys or data plane role assignments managed HSM local RBAC. This isolation is implemented by design to prevent inadvertent expansion of privileges affecting access to keys stored in managed HSMs.

As mentioned previously, managed HSM supports [importing keys generated](../key-vault/managed-hsm/hsm-protected-keys-byok.md) in your on-premises HSMs, ensuring the keys never leave the HSM protection boundary, also known as *bring your own key (BYOK)* scenario. Managed HSM supports integration with Azure services such as [Azure Storage](../storage/common/customer-managed-keys-overview.md), [Azure SQL Database](/azure/azure-sql/database/transparent-data-encryption-byok-overview), [Azure Information Protection](/azure/information-protection/byok-price-restrictions), and others. For a more complete list of Azure services that work with Managed HSM, see [Data encryption models](../security/fundamentals/encryption-models.md#supporting-services).

Managed HSM enables you to use the established Azure Key Vault API and management interfaces. You can use the same application development and deployment patterns for all your applications irrespective of the key management solution: multi-tenant vault or single-tenant managed HSM.

## Compute isolation
Microsoft Azure compute platform is based on [machine virtualization](../security/fundamentals/isolation-choices.md). This approach means that your code – whether it’s deployed in a PaaS worker role or an IaaS virtual machine – executes in a virtual machine hosted by a Windows Server Hyper-V hypervisor. On each Azure physical server, also known as a node, there's a [Type 1 Hypervisor](https://en.wikipedia.org/wiki/Hypervisor) that runs directly over the hardware and divides the node into a variable number of Guest virtual machines (VMs), as shown in Figure 4. Each node has one special Host VM, also known as Root VM, which runs the Host OS – a customized and hardened version of the latest Windows Server, which is stripped down to reduce the attack surface and include only those components necessary to manage the node. Isolation of the Root VM from the Guest VMs and the Guest VMs from one another is a key concept in Azure security architecture that forms the basis of Azure [compute isolation](../security/fundamentals/isolation-choices.md#compute-isolation), as described in Microsoft online documentation.

:::image type="content" source="./media/secure-isolation-fig4.png" alt-text="Isolation of Hypervisor, Root VM, and Guest VMs":::
**Figure 4.**  Isolation of Hypervisor, Root VM, and Guest VMs

Physical servers hosting VMs are grouped into clusters, and they're independently managed by a scaled-out and redundant platform software component called the **[Fabric Controller](../security/fundamentals/isolation-choices.md#the-azure-fabric-controller)** (FC). Each FC manages the lifecycle of VMs running in its cluster, including provisioning and monitoring the health of the hardware under its control. For example, the FC is responsible for recreating VM instances on healthy servers when it determines that a server has failed. It also allocates infrastructure resources to tenant workloads, and it manages unidirectional communication from the Host to virtual machines. Dividing the compute infrastructure into clusters, isolates faults at the FC level and prevents certain classes of errors from affecting servers beyond the cluster in which they occur.

The FC is the brain of the Azure compute platform and the Host Agent is its proxy, integrating servers into the platform so that the FC can deploy, monitor, and manage the virtual machines used by you and Azure cloud services. The Hypervisor/Host OS pairing uses decades of Microsoft’s experience in operating system security, including security focused investments in [Microsoft Hyper-V](/windows-server/virtualization/hyper-v/hyper-v-technology-overview) to provide strong isolation of Guest VMs. Hypervisor isolation is discussed later in this section, including assurances for strongly defined security boundaries enforced by the Hypervisor, defense-in-depth exploits mitigations, and strong security assurance processes.

### Management network isolation
There are three Virtual Local Area Networks (VLANs) in each compute hardware cluster, as shown in Figure 5:

- Main VLAN interconnects untrusted customer nodes,
- Fabric Controller (FC) VLAN that contains trusted FCs and supporting systems, and
- Device VLAN that contains trusted network and other infrastructure devices.

Communication is permitted from the FC VLAN to the main VLAN but can't be initiated from the main VLAN to the FC VLAN. The bridge from the FC VLAN to the Main VLAN is used to reduce the overall complexity and improve reliability/resiliency of the network. The connection is secured in several ways to ensure that commands are trusted and successfully routed:

- Communication from an FC to a Fabric Agent (FA) is unidirectional and requires mutual authentication via certificates. The FA implements a TLS-protected service that only responds to requests from the FC. It can't initiate connections to the FC or other privileged internal nodes.
- The FC treats responses from the agent service as if they were untrusted. Communication with the agent is further restricted to a set of authorized IP addresses using firewall rules on each physical node, and routing rules at the border gateways.
- Throttling is used to ensure that customer VMs can't saturate the network and management commands from being routed.

Communication is also blocked from the main VLAN to the device VLAN. This way, even if a node running customer code is compromised, it can't attack nodes on either the FC or device VLANs.

These controls ensure that management console's access to the Hypervisor is always valid and available.

:::image type="content" source="./media/secure-isolation-fig5.png" alt-text="VLAN isolation":::
**Figure 5.**  VLAN isolation

The Hypervisor and the Host OS provide network packet filters, which help ensure that untrusted VMs can't generate spoofed traffic or receive traffic not addressed to them, direct traffic to protected infrastructure endpoints, or send/receive inappropriate broadcast traffic. By default, traffic is blocked when a VM is created, and then the FC agent configures the packet filter to add rules and exceptions to allow authorized traffic. More detailed information about network traffic isolation and separation of tenant traffic is provided in *[Networking isolation](#networking-isolation)* section.

### Management console and management plane
The Azure Management Console and Management Plane follow strict security architecture principles of least privilege to secure and isolate tenant processing:

- **Management Console (MC)** – The MC in Azure Cloud is composed of the Azure portal GUI and the Azure Resource Manager API layers. They both use user credentials to authenticate and authorize all operations.
- **Management Plane (MP)** – This layer performs the actual management actions and is composed of the Compute Resource Provider (CRP), Fabric Controller (FC), Fabric Agent (FA), and the underlying Hypervisor, which has its own Hypervisor Agent to service communication. These layers all use system contexts that are granted the least permissions needed to perform their operations.

The Azure FC allocates infrastructure resources to tenants and manages unidirectional communications from the Host OS to Guest VMs. The VM placement algorithm of the Azure FC is highly sophisticated and nearly impossible to predict. The FA resides in the Host OS and it manages tenant VMs. The collection of the Azure Hypervisor, Host OS and FA, and customer VMs constitute a compute node, as shown in Figure 4. FCs manage FAs although FCs exist outside of compute nodes – separate FCs exist to manage compute and storage clusters. If you update your application’s configuration file while running in the MC, the MC communicates through CRP with the FC, and the FC communicates with the FA.

CRP is the front-end service for Azure Compute, exposing consistent compute APIs through Azure Resource Manager, thereby enabling you to create and manage virtual machine resources and extensions via simple templates.

Communications among various components (for example, Azure Resource Manager to and from CRP, CRP to and from FC, FC to and from Hypervisor Agent) all operate on different communication channels with different identities and different permissions sets. This design follows common least-privilege models to ensure that a compromise of any single layer will prevent more actions. Separate communications channels ensure that communications can't bypass any layer in the chain. Figure 6 illustrates how the MC and MP securely communicate within the Azure cloud for Hypervisor interaction initiated by a user’s [OAuth 2.0 authentication to Microsoft Entra ID](../active-directory/develop/v2-oauth2-auth-code-flow.md).

:::image type="content" source="./media/secure-isolation-fig6.png" alt-text="Management Console and Management Plane interaction for secure management flow" border="false":::
**Figure 6.**  Management Console and Management Plane interaction for secure management flow

All management commands are authenticated via RSA signed certificate or JSON Web Token (JWT). Authentication and command channels are encrypted via Transport Layer Security (TLS) 1.2 as described in *[Data encryption in transit](#data-encryption-in-transit)* section. Server certificates are used to provide TLS connectivity to the authentication providers where a separate authorization mechanism is used, for example, Microsoft Entra ID or datacenter Security Token Service (dSTS). dSTS is a token provider like Microsoft Entra ID that is isolated to the Microsoft datacenter and used for service level communications.
 
Figure 6 illustrates the management flow corresponding to a user command to stop a virtual machine. The steps enumerated in Table 1 apply to other management commands in the same way and use the same encryption and authentication flow.

**Table 1.**  Management flow involving various MC and MP components

|Step|Description|Authentication|Encryption|
|----|-----------|--------------|----------|
|**1.**|User authenticates via Microsoft Entra ID by providing credentials and is issued a token.|User Credentials|TLS 1.2|
|**2.**|Browser presents token to Azure portal to authenticate user. Azure portal verifies token using token signature and valid signing keys.|JSON Web Token (Microsoft Entra ID)|TLS 1.2|
|**3.**|User issues &#8220;stop VM&#8221; request on Azure portal. Azure portal sends &#8220;stop VM&#8221; request to Azure Resource Manager and presents user’s token that was provided by Microsoft Entra ID. Azure Resource Manager verifies token using token signature and valid signing keys and that the user is authorized to perform the requested operation.|JSON Web Token (Microsoft Entra ID)|TLS 1.2|
|**4.**|Azure Resource Manager requests a token from dSTS server based on the client certificate that Azure Resource Manager has, enabling dSTS to grant a JSON Web Token with the correct identity and roles.|Client Certificate|TLS 1.2|
|**5.**|Azure Resource Manager sends request to CRP. Call is authenticated via OAuth using a JSON Web Token representing the Azure Resource Manager system identity from dSTS, thus transition from user to system context.|JSON Web Token (dSTS)|TLS 1.2|
|**6.**|CRP validates the request and determines which fabric controller can complete the request. CRP requests a certificate from dSTS based on its client certificate so that it can connect to the specific Fabric Controller (FC) that is the target of the command. Token will grant permissions only to that specific FC if CRP is allowed to communicate to that FC.|Client Certificate|TLS 1.2|
|**7.**|CRP then sends the request to the correct FC with the JSON Web Token that was created by dSTS.|JSON Web Token (dSTS)|TLS 1.2|
|**8.**|FC then validates the command is allowed and comes from a trusted source. Then it establishes a secure TLS connection to the correct Fabric Agent (FA) in the cluster that can execute the command by using a certificate that is unique to the target FA and the FC. Once the secure connection is established, the command is transmitted.|Mutual Certificate|TLS 1.2|
|**9.**|The FA again validates the command is allowed and comes from a trusted source. Once validated, the FA will establish a secure connection using mutual certificate authentication and issue the command to the Hypervisor Agent that is only accessible by the FA.|Mutual Certificate|TLS 1.2|
|**10.**|Hypervisor Agent on the host executes an internal call to stop the VM.|System Context|N.A.|

Commands generated through all steps of the process identified in this section and sent to the FC and FA on each node, are written to a local audit log, and distributed to multiple analytics systems for stream processing in order to monitor system health and track security events and patterns. Tracking includes events that were processed successfully and events that were invalid. Invalid requests are processed by the intrusion detection systems to detect anomalies.

### Logical isolation implementation options
Azure provides isolation of compute processing through a multi-layered approach, including:

- **Hypervisor isolation** for services that provide cryptographically certain isolation by using separate virtual machines and using Azure Hypervisor isolation. Examples: *App Service, Azure Container Instances, Azure Databricks, Azure Functions, Azure Kubernetes Service, Azure Machine Learning, Cloud Services, Data Factory, Service Fabric, Virtual Machines, Virtual Machine Scale Sets.*
- **Drawbridge isolation** inside a VM for services that provide cryptographically certain isolation to workloads running on the same virtual machine by using isolation provided by [Drawbridge](https://www.microsoft.com/research/project/drawbridge/). These services provide small units of processing using customer code. To provide security isolation, Drawbridge runs a user process together with a light-weight version of the Windows kernel (library OS) inside a *pico-process*. A pico-process is a secured process with no direct access to services or resources of the Host system. Examples: *Automation, Azure Database for MySQL, Azure Database for PostgreSQL, Azure SQL Database, Azure Stream Analytics.*
- **User context-based isolation** for services that are composed solely of Microsoft-controlled code and customer code isn't allowed to run. Examples: *API Management, Application Gateway, Microsoft Entra ID, Azure Backup, Azure Cache for Redis, Azure DNS, Azure Information Protection, Azure IoT Hub, Azure Key Vault, Azure portal, Azure Monitor (including Log Analytics), Microsoft Defender for Cloud, Azure Site Recovery, Container Registry, Content Delivery Network, Event Grid, Event Hubs, Load Balancer, Service Bus, Storage, Virtual Network, VPN Gateway, Traffic Manager.*

These logical isolation options are discussed in the rest of this section.

#### Hypervisor isolation
Hypervisor isolation in Azure is based on [Microsoft Hyper-V](/windows-server/virtualization/hyper-v/hyper-v-technology-overview) technology, which enables Azure Hypervisor-based isolation to benefit from decades of Microsoft experience in operating system security and investments in Hyper-V technology for virtual machine isolation. You can review independent third-party assessment reports about Hyper-V security functions, including the [National Information Assurance Partnership (NIAP) Common Criteria Evaluation and Validation Scheme (CCEVS) reports](https://www.niap-ccevs.org/Product/PCL.cfm?par303=Microsoft%20Corporation) such as the [report published in Feb-2021](https://www.niap-ccevs.org/Product/Compliant.cfm?PID=11087) that is discussed herein.

The Target of Evaluation (TOE) was composed of Microsoft Windows Server, Microsoft Windows 10 version 1909 (November 2019 Update), and Microsoft Windows Server 2019 (version 1809) Hyper-V (&#8220;Windows&#8221;). TOE enforces the following security policies as described in the report:

- **Security Audit** – Windows has the ability to collect audit data, review audit logs, protect audit logs from overflow, and restrict access to audit logs. Audit information generated by the system includes the date and time of the event, the user identity that caused the event to be generated, and other event-specific data. Authorized administrators can review, search, and sort audit records. Authorized administrators can also configure the audit system to include or exclude potentially auditable events to be audited based on many characteristics. In the context of this evaluation, the protection profile requirements cover generating audit events, authorized review of stored audit records, and providing secure storage for audit event entries.
- **Cryptographic Support** – Windows provides validated cryptographic functions that support encryption/decryption, cryptographic signatures, cryptographic hashing, and random number generation. Windows implements these functions in support of IPsec, TLS, and HTTPS protocol implementation. Windows also ensures that its Guest VMs have access to entropy data so that virtualized operating systems can ensure the implementation of strong cryptography.
- **User Data Protection** – Windows makes certain computing services available to Guest VMs but implements measures to ensure that access to these services is granted on an appropriate basis and that these interfaces don't result in unauthorized data leakage between Guest VMs and Windows or between multiple Guest VMs.
- **Identification and Authentication** – Windows offers several methods of user authentication, which includes X.509 certificates needed for trusted protocols. Windows implements password strength mechanisms and ensures that excessive failed authentication attempts using methods subject to brute force guessing (password, PIN) results in lockout behavior.
- **Security Management** – Windows includes several functions to manage security policies. Access to administrative functions is enforced through administrative roles. Windows also has the ability to support the separation of management and operational networks and to prohibit data sharing between Guest VMs.
- **Protection of the TOE Security Functions (TSF)** – Windows implements various self-protection mechanisms to ensure that it can't be used as a platform to gain unauthorized access to data stored on a Guest VM, that the integrity of both the TSF and its Guest VMs is maintained, and that Guest VMs are accessed solely through well-documented interfaces.
- **TOE Access** – In the context of this evaluation, Windows allows an authorized administrator to configure the system to display a logon banner before the logon dialog.
- **Trusted Path/Channels** – Windows implements IPsec, TLS, and HTTPS trusted channels and paths for remote administration, transfer of audit data to the operational environment, and separation of management and operational networks.

More information is available from the [third-party certification report](https://www.niap-ccevs.org/MMO/Product/st_vid11087-vr.pdf).

The critical Hypervisor isolation is provided through:

- Strongly defined security boundaries enforced by the Hypervisor
- Defense-in-depth exploits mitigations
- Strong security assurance processes

These technologies are described in the rest of this section. **They enable Azure Hypervisor to offer strong security assurances for tenant separation in a multi-tenant cloud.**

##### *Strongly defined security boundaries*
Your code executes in a Hypervisor VM and benefits from Hypervisor enforced security boundaries, as shown in Figure 7. Azure Hypervisor is based on [Microsoft Hyper-V](/virtualization/hyper-v-on-windows/reference/hyper-v-architecture) technology. It divides an Azure node into a variable number of Guest VMs that have separate address spaces where they can load an operating system (OS) and applications operating in parallel to the Host OS that executes in the Root partition of the node.

:::image type="content" source="./media/secure-isolation-fig7.png" alt-text="Compute isolation with Azure Hypervisor":::
**Figure 7.**  Compute isolation with Azure Hypervisor (see online [glossary of terms](/virtualization/hyper-v-on-windows/reference/hyper-v-architecture#glossary))

The Azure Hypervisor acts like a micro-kernel, passing all hardware access requests from Guest VMs using a Virtualization Service Client (VSC) to the Host OS for processing by using a shared-memory interface called VMBus. The Host OS proxies the hardware requests using a Virtualization Service Provider (VSP) that prevents users from obtaining raw read/write/execute access to the system and mitigates the risk of sharing system resources. The privileged Root partition, also known as Host OS, has direct access to the physical devices/peripherals on the system, for example, storage controllers, GPUs, networking adapters, and so on. The Host OS allows Guest partitions to share the use of these physical devices by exposing virtual devices to each Guest partition. So, an operating system executing in a Guest partition has access to virtualized peripheral devices that are provided by VSPs executing in the Root partition. These virtual device representations can take one of three forms:

- **Emulated devices** – The Host OS may expose a virtual device with an interface identical to what would be provided by a corresponding physical device. In this case, an operating system in a Guest partition would use the same device drivers as it does when running on a physical system. The Host OS would emulate the behavior of a physical device to the Guest partition.
- **Para-virtualized devices** – The Host OS may expose virtual devices with a virtualization-specific interface using the VMBus shared memory interface between the Host OS and the Guest. In this model, the Guest partition uses device drivers specifically designed to implement a virtualized interface. These para-virtualized devices are sometimes referred to as &#8220;synthetic&#8221; devices.
- **Hardware-accelerated devices** – The Host OS may expose actual hardware peripherals directly to the Guest partition. This model allows for high I/O performance in a Guest partition, as the Guest partition can directly access hardware device resources without going through the Host OS. [Azure Accelerated Networking](../virtual-network/accelerated-networking-overview.md) is an example of a hardware accelerated device. Isolation in this model is achieved using input-output memory management units (I/O MMUs) to provide address space and interrupt isolation for each partition.

Virtualization extensions in the Host CPU enable the Azure Hypervisor to enforce isolation between partitions. The following fundamental CPU capabilities provide the hardware building blocks for Hypervisor isolation:

- **Second-level address translation** – the Hypervisor controls what memory resources a partition is allowed to access by using second-level page tables provided by the CPU’s memory management unit (MMU). The CPU’s MMU uses second-level address translation under Hypervisor control to enforce protection on memory accesses performed by:
  - CPU when running under the context of a partition.
  - I/O devices that are being accessed directly by Guest partitions.
- **CPU context** – the Hypervisor uses virtualization extensions in the CPU to restrict privileges and CPU context that can be accessed while a Guest partition is running. The Hypervisor also uses these facilities to save and restore state when sharing CPUs between multiple partitions to ensure isolation of CPU state between the partitions.

The Azure Hypervisor makes extensive use of these processor facilities to provide isolation between partitions. The emergence of speculative side channel attacks has identified potential weaknesses in some of these processor isolation capabilities. In a multi-tenant architecture, any cross-VM attack across different tenants involves two steps: placing an adversary-controlled VM on the same Host as one of the victim VMs, and then breaching the logical isolation boundary to perform a side-channel attack. Azure provides protection from both threat vectors by using an advanced VM placement algorithm enforcing memory and process separation for logical isolation, and secure network traffic routing with cryptographic certainty at the Hypervisor. As discussed in section titled *[Exploitation of vulnerabilities in virtualization technologies](#exploitation-of-vulnerabilities-in-virtualization-technologies)* later in the article, the Azure Hypervisor has been architected to provide robust isolation directly within the hypervisor that helps mitigate many sophisticated side channel attacks.

The Azure Hypervisor defined security boundaries provide the base level isolation primitives for strong segmentation of code, data, and resources between potentially hostile multi-tenants on shared hardware. These isolation primitives are used to create multi-tenant resource isolation scenarios including:

- **Isolation of network traffic between potentially hostile guests** – Virtual Network (VNet) provides isolation of network traffic between tenants as part of its fundamental design, as described later in *[Separation of tenant network traffic](#separation-of-tenant-network-traffic)* section. VNet forms an isolation boundary where the VMs within a VNet can only communicate with each other. Any traffic destined to a VM from within the VNet or external senders without the proper policy configured will be dropped by the Host and not delivered to the VM.
- **Isolation for encryption keys and cryptographic material** – You can further augment the isolation capabilities with the use of [hardware security managers or specialized key storage](../security/fundamentals/encryption-overview.md), for example, storing encryption keys in FIPS 140 validated hardware security modules (HSMs) via [Azure Key Vault](../key-vault/general/overview.md).
- **Scheduling of system resources** – Azure design includes guaranteed availability and segmentation of compute, memory, storage, and both direct and para-virtualized device access.

The Azure Hypervisor meets the security objectives shown in Table 2.

**Table 2.**  Azure Hypervisor security objectives

|Objective|Source|
|---------|------|
|**Isolation**|The Azure Hypervisor security policy mandates no information transfer between VMs. This policy requires capabilities in the Virtual Machine Manager (VMM) and hardware for the isolation of memory, devices, networking, and managed resources such as persisted data.|
|**VMM integrity**|Integrity is a core security objective for virtualization systems. To achieve system integrity, the integrity of each Hypervisor component is established and maintained. This objective concerns only the integrity of the Hypervisor itself, not the integrity of the physical platform or software running inside VMs.|
|**Platform integrity**|The integrity of the Hypervisor depends on the integrity of the hardware and software on which it relies. Although the Hypervisor doesn't have direct control over the integrity of the platform, Azure relies on hardware and firmware mechanisms such as the [Cerberus](https://azure.microsoft.com/blog/microsoft-creates-industry-standards-for-datacenter-hardware-storage-and-security/) security microcontroller to [protect the underlying platform integrity](https://www.youtube.com/watch?v=oUvKEw8OchI), thereby preventing the VMM and Guests from running should platform integrity be compromised.|
|**Management access**|Management functions are exercised only by authorized administrators, connected over secure connections with a principle of least privilege enforced by fine grained role access control mechanism.|
|**Audit**|Azure provides audit capability to capture and protect system data so that it can later be inspected.|

##### *Defense-in-depth exploits mitigations*
To further mitigate the risk of a security compromise, Microsoft has invested in numerous defense-in-depth mitigations in Azure systems software, hardware, and firmware to provide strong real-world isolation guarantees to Azure customers. As mentioned previously, Azure Hypervisor isolation is based on [Microsoft Hyper-V](/virtualization/hyper-v-on-windows/reference/hyper-v-architecture) technology, which enables Azure Hypervisor to benefit from decades of Microsoft experience in operating system security and investments in Hyper-V technology for virtual machine isolation.

Listed below are some key design principles adopted by Microsoft to secure Hyper-V:

- Prevent design level issues from affecting the product
   - Every change going into Hyper-V is subject to design review.
- Eliminate common vulnerability classes with safer coding
   - Some components such as the VMSwitch use a formally proven protocol parser.
   - Many components use `gsl::span` instead of raw pointers, which eliminates the possibility of buffer overflows and/or out-of-bounds memory accesses. For more information, see the [Guidelines Support Library (GSL)](https://github.com/isocpp/CppCoreGuidelines/blob/master/docs/gsl-intro.md) documentation.
   - Many components use [smart pointers](/cpp/cpp/smart-pointers-modern-cpp) to eliminate the risk of [use-after-free](https://owasp.org/www-community/vulnerabilities/Using_freed_memory) bugs.
   - Most Hyper-V kernel-mode code uses a heap allocator that zeros on allocation to eliminate uninitialized memory bugs.
- Eliminate common vulnerability classes with compiler mitigations
   - All Hyper-V code is compiled with InitAll, which [eliminates uninitialized stack variables](https://msrc-blog.microsoft.com/2020/05/13/solving-uninitialized-stack-memory-on-windows/). This approach was implemented because many historical vulnerabilities in Hyper-V were caused by uninitialized stack variables.
   - All Hyper-V code is compiled with [stack canaries](https://en.wikipedia.org/wiki/Stack_buffer_overflow#Stack_canaries) to dramatically reduce the risk of stack overflow vulnerabilities.
- Find issues that make their way into the product
   - All Windows code has a set of static analysis rules run across it.
   - All Hyper-V code is code reviewed and fuzzed. For more information on fuzzing, see *[Security assurance processes and practices](#security-assurance-processes-and-practices)* section later in this article.
- Make exploitation of remaining vulnerabilities more difficult
   - The VM worker process has the following mitigations applied:
      - [Arbitrary Code Guard](https://blogs.windows.com/msedgedev/2017/02/23/mitigating-arbitrary-native-code-execution/) – Dynamically generated code can't be loaded in the VM Worker process.
      - [Code Integrity Guard](https://blogs.windows.com/msedgedev/2017/02/23/mitigating-arbitrary-native-code-execution/) – Only Microsoft signed code can be loaded in the VM Worker Process.
      - [Control Flow Guard (CFG)](/windows/win32/secbp/control-flow-guard) – Provides course grained control flow protection to indirect calls and jumps.
      - NoChildProcess – The worker process can't create child processes (useful for bypassing CFG).
      - NoLowImages / NoRemoteImages – The worker process can't load DLLs over the network or DLLs that were written to disk by a sandboxed process.
      - NoWin32k – The worker process can't communicate with Win32k, which makes sandbox escapes more difficult.
      - Heap randomization – Windows ships with one of the most secure heap implementations of any operating system.
      - [Address Space Layout Randomization (ASLR)](https://en.wikipedia.org/wiki/Address_space_layout_randomization) – Randomizes the layout of heaps, stacks, binaries, and other data structures in the address space to make exploitation less reliable.
      - [Data Execution Prevention (DEP/NX)](/windows/win32/win7appqual/dep-nx-protection) – Only pages of memory intended to contain code are executable.
   - The kernel has the following mitigations applied:
      - Heap randomization – Windows ships with one of the most secure heap implementations of any operating system.
      - [Address Space Layout Randomization (ASLR)](https://en.wikipedia.org/wiki/Address_space_layout_randomization) – Randomizes the layout of heaps, stacks, binaries, and other data structures in the address space to make exploitation less reliable.
      - [Data Execution Prevention (DEP/NX)](/windows/win32/win7appqual/dep-nx-protection) – Only pages of memory intended to contain code are executable.

Microsoft investments in Hyper-V security benefit Azure Hypervisor directly. The goal of defense-in-depth mitigations is to make weaponized exploitation of a vulnerability as expensive as possible for an attacker, limiting their impact and maximizing the window for detection. All exploit mitigations are evaluated for effectiveness by a thorough security review of the Azure Hypervisor attack surface using methods that adversaries may employ. Table 3 outlines some of the mitigations intended to protect the Hypervisor isolation boundaries and hardware host integrity.

**Table 3.** Azure Hypervisor defense-in-depth

|Mitigation|Security Impact|Mitigation Details|
|----------|---------------|------------------|
|**Control flow integrity**|Increases cost to perform control flow integrity attacks (for example, return oriented programming exploits)|[Control Flow Guard](https://www.blackhat.com/docs/us-16/materials/us-16-Weston-Windows-10-Mitigation-Improvements.pdf) (CFG) ensures indirect control flow transfers are instrumented at compile time and enforced by the kernel (user-mode) or secure kernel (kernel-mode), mitigating stack return vulnerabilities.|
|**User-mode code integrity**|Protects against malicious and unwanted binary execution in user mode|Address Space Layout Randomization (ASLR) forced on all binaries in host partition, all code compiled with SDL security checks (for example, `strict_gs`), [arbitrary code generation restrictions](https://blogs.windows.com/msedgedev/2017/02/23/mitigating-arbitrary-native-code-execution/) in place on host processes prevent injection of runtime-generated code.|
|**Hypervisor enforced user and kernel mode code integrity**|No code loaded into code pages marked for execution until authenticity of code is verified|[Virtualization-based Security](/windows-hardware/design/device-experiences/oem-vbs) (VBS) uses memory isolation to create a secure world to enforce policy and store sensitive code and secrets. With Hypervisor enforced Code Integrity (HVCI), the secure world is used to prevent unsigned code from being injected into the normal world kernel.|
|**Hardware root-of-trust with platform secure boot**|Ensures host only boots exact firmware and OS image required|Windows [secure boot](/windows-hardware/design/device-experiences/oem-secure-boot) validates that Azure Hypervisor infrastructure is only bootable in a known good configuration, aligned to Azure firmware, hardware, and kernel production versions.|
|**Reduced attack surface VMM**|Protects against escalation of privileges in VMM user functions|The Azure Hypervisor Virtual Machine Manager (VMM) contains both user and kernel mode components. User mode components are isolated to prevent break-out into kernel mode functions in addition to numerous layered mitigations.|

Moreover, Azure has adopted an assume-breach security strategy implemented via [Red Teaming](https://download.microsoft.com/download/C/1/9/C1990DBA-502F-4C2A-848D-392B93D9B9C3/Microsoft_Enterprise_Cloud_Red_Teaming.pdf). This approach relies on a dedicated team of security researchers and engineers who conduct continuous ongoing testing of Azure systems and operations using the same tactics, techniques, and procedures as real adversaries against live production infrastructure, without the foreknowledge of the Azure infrastructure and platform engineering or operations teams. This approach tests security detection and response capabilities and helps identify production vulnerabilities in Azure Hypervisor and other systems, including configuration errors, invalid assumptions, or other security issues in a controlled manner. Microsoft invests heavily in these innovative security measures for continuous Azure threat mitigation.

##### *Strong security assurance processes*
The attack surface in Hyper-V is [well understood](https://msrc-blog.microsoft.com/2018/12/10/first-steps-in-hyper-v-research/). It has been the subject of [ongoing research](https://msrc-blog.microsoft.com/2019/09/11/attacking-the-vm-worker-process/) and thorough security reviews. Microsoft has been transparent about the Hyper-V attack surface and underlying security architecture as demonstrated during a public [presentation at a Black Hat conference](https://github.com/Microsoft/MSRC-Security-Research/blob/master/presentations/2018_08_BlackHatUSA/A%20Dive%20in%20to%20Hyper-V%20Architecture%20and%20Vulnerabilities.pdf) in 2018. Microsoft stands behind the robustness and quality of Hyper-V isolation with a [$250,000 bug bounty program](https://www.microsoft.com/msrc/bounty-hyper-v) for critical Remote Code Execution (RCE), information disclosure, and Denial of Service (DOS) vulnerabilities reported in Hyper-V. By using the same Hyper-V technology in Windows Server and Azure cloud platform, the publicly available documentation and bug bounty program ensure that security improvements will accrue to all users of Microsoft products and services. Table 4 summarizes the key attack surface points from the Black Hat presentation.

**Table 4.**  Hyper-V attack surface details

|Attack surface area|Privileges granted if compromised|High-level components|
|------|------|------|
|**Hyper-V**|Hypervisor: full system compromise with the ability to compromise other Guests|- Hypercalls </br>- Intercept handling|
|**Host partition kernel-mode components**|System in kernel mode: full system compromise with the ability to compromise other Guests|- Virtual Infrastructure Driver (VID) intercept handling </br>- Kernel-mode client library </br>- Virtual Machine Bus (VMBus) channel messages </br>- Storage Virtualization Service Provider (VSP) </br>- Network VSP </br>- Virtual Hard Disk (VHD) parser </br>- Azure Networking Virtual Filtering Platform (VFP) and Virtual Network (VNet)|
|**Host partition user-mode components**|Worker process in user mode: limited compromise with ability to attack Host and elevate privileges|- Virtual devices (VDEVs)|

To protect these attack surfaces, Microsoft has established industry-leading processes and tooling that provide high confidence in the Azure isolation guarantee. As described in *[Security assurance processes and practices](#security-assurance-processes-and-practices)* section later in this article, the approach includes purpose-built fuzzing, penetration testing, security development lifecycle, mandatory security training, security reviews, security intrusion detection based on Guest – Host threat indicators, and automated build alerting of changes to the attack surface area. This mature multi-dimensional assurance process helps augment the isolation guarantees provided by the Azure Hypervisor by mitigating the risk of security vulnerabilities.

> [!NOTE]
> Azure has adopted an industry leading approach to ensure Hypervisor-based tenant separation that has been strengthened and improved over two decades of Microsoft investments in Hyper-V technology for virtual machine isolation. The outcome of this approach is a robust Hypervisor that helps ensure tenant separation via 1) strongly defined security boundaries, 2) defense-in-depth exploits mitigations, and 3) strong security assurances processes.

#### Drawbridge isolation
For services that provide small units of processing using customer code, requests from multiple tenants are executed within a single VM and isolated using Microsoft [Drawbridge](https://www.microsoft.com/research/project/drawbridge/) technology. To provide security isolation, Drawbridge runs a user process together with a lightweight version of the Windows kernel (Library OS) inside a *pico-process*. A pico-process is a lightweight, secure isolation container with minimal kernel API surface and no direct access to services or resources of the Host system. The only external calls the pico-process can make are to the Drawbridge Security Monitor through the Drawbridge Application Binary Interface (ABI), as shown in Figure 8.

:::image type="content" source="./media/secure-isolation-fig8.png" alt-text="Process isolation using Drawbridge":::
**Figure 8.**  Process isolation using Drawbridge

The Security Monitor is divided into a system device driver and a user-mode component. The ABI is the interface between the Library OS and the Host. The entire interface consists of a closed set of fewer than 50 stateless function calls:

- Down calls from the pico-process to the Host OS support abstractions such as threads, virtual memory, and I/O streams. 
- Up calls into the pico-process perform initialization, return exception information, and run in a new thread.

The semantics of the interface are fixed and support the general abstractions that applications require from any operating system. This design enables the Library OS and the Host to evolve separately.

The ABI is implemented within two components:

- The Platform Adaptation Layer (PAL) runs as part of the pico-process.
- The host implementation runs as part of the Host.

Pico-processes are grouped into isolation units called *sandboxes*. The sandbox defines the applications, file system, and external resources available to the pico-processes. When a process running inside a pico-process creates a new child process, it's run with its own Library OS in a separate pico-process inside the same sandbox. Each sandbox communicates to the Security Monitor, and isn't able to communicate with other sandboxes except via allowed I/O channels (sockets, named pipes, and so on), which need to be explicitly allowed by the configuration given the default opt-in approach depending on service needs. The outcome is that code running inside a pico-process can only access its own resources and can't directly attack the Host system or any colocated sandboxes. It's only able to affect objects inside its own sandbox.

When the pico-process needs system resources, it must call into the Drawbridge host to request them. The normal path for a virtual user process would be to call the Library OS to request resources and the Library OS would then call into the ABI. Unless the policy for resource allocation is set up in the driver itself, the Security Monitor would handle the ABI request by checking policy to see if the request is allowed and then servicing the request. This mechanism is used for all system primitives therefore ensuring that the code running in the pico-process can't abuse the resources from the Host machine.

In addition to being isolated inside sandboxes, pico-processes are also substantially isolated from each other. Each pico-process resides in its own virtual memory address space and runs its own copy of the Library OS with its own user-mode kernel. Each time a user process is launched in a Drawbridge sandbox, a fresh Library OS instance is booted. While this task is more time-consuming compared to launching a nonisolated process on Windows, it's substantially faster than booting a VM while accomplishing logical isolation.

A normal Windows process can call more than 1200 functions that result in access to the Windows kernel; however, the entire interface for a pico-process consists of fewer than 50 calls down to the Host. Most application requests for operating system services are handled by the Library OS within the address space of the pico-process. By providing a significantly smaller interface to the kernel, Drawbridge creates a more secure and isolated operating environment in which applications are much less vulnerable to changes in the Host system and incompatibilities introduced by new OS releases. More importantly, a Drawbridge pico-process is a strongly isolated container within which untrusted code from even the most malicious sources can be run without risk of compromising the Host system. The Host assumes that no code running within the pico-process can be trusted. The Host validates all requests from the pico-process with security checks.

Like a virtual machine, the pico-process is much easier to secure than a traditional OS interface because it's significantly smaller, stateless, and has fixed and easily described semantics. Another added benefit of the small ABI / driver syscall interface is the ability to audit / fuzz the driver code with little effort. For example, syscall fuzzers can fuzz the ABI with high coverage numbers in a relatively short amount of time.

#### User context-based isolation
In cases where an Azure service is composed of Microsoft-controlled code and customer code isn't allowed to run, the isolation is provided by a user context. These services accept only user configuration inputs and data for processing – arbitrary code isn't allowed. For these services, a user context is provided to establish the data that can be accessed and what Azure role-based access control (Azure RBAC) operations are allowed. This context is established by Microsoft Entra ID as described earlier in *[Identity-based isolation](#identity-based-isolation)* section. Once the user has been identified and authorized, the Azure service creates an application user context that is attached to the request as it moves through execution, providing assurance that user operations are separated and properly isolated.

### Physical isolation
In addition to robust logical compute isolation available by design to all Azure tenants, if you desire physical compute isolation you can use Azure Dedicated Host or Isolated Virtual Machines, which are both dedicated to a single customer.

> [!NOTE]
> Physical tenant isolation increases deployment cost and may not be required in most scenarios given the strong logical isolation assurances provided by Azure.

#### Azure Dedicated Host
[Azure Dedicated Host](../virtual-machines/dedicated-hosts.md) provides physical servers that can host one or more Azure VMs and are dedicated to one Azure subscription. You can provision dedicated hosts within a region, availability zone, and fault domain. You can then place [Windows](../virtual-machines/windows/overview.md), [Linux](../virtual-machines/linux/overview.md), and [SQL Server on Azure](/azure/azure-sql/virtual-machines/) VMs directly into provisioned hosts using whatever configuration best meets your needs. Dedicated Host provides hardware isolation at the physical server level, enabling you to place your Azure VMs on an isolated and dedicated physical server that runs only your organization’s workloads to meet corporate compliance requirements.

> [!NOTE]
> You can deploy a dedicated host using the **[Azure portal, Azure PowerShell, and Azure CLI](../virtual-machines/dedicated-hosts-how-to.md)**.

You can deploy both Windows and Linux virtual machines into dedicated hosts by selecting the server and CPU type, number of cores, and extra features. Dedicated Host enables control over platform maintenance events by allowing you to opt in to a maintenance window to reduce potential impact to your provisioned services. Most maintenance events have little to no impact on your VMs; however, if you're in a highly regulated industry or with a sensitive workload, you may want to have control over any potential maintenance impact.

Microsoft provides detailed customer guidance on **[Windows](../virtual-machines/windows/quick-create-portal.md)** and **[Linux](../virtual-machines/linux/quick-create-portal.md)** Azure Virtual Machine provisioning using the Azure portal, Azure PowerShell, and Azure CLI. Table 5 summarizes the available security guidance for your virtual machines provisioned in Azure.

**Table 5.**  Security guidance for Azure virtual machines

|VM|Security guidance|
|---|---|
|**Windows**|[Secure policies](../virtual-machines/security-policy.md) <br/>[Azure Disk Encryption](../virtual-machines/windows/disk-encryption-overview.md) <br/> [Built-in security controls](../virtual-machines/windows/security-baseline.md) <br/> [Security recommendations](../virtual-machines/security-recommendations.md)|
|**Linux**|[Secure policies](../virtual-machines/security-policy.md) <br/> [Azure Disk Encryption](../virtual-machines/linux/disk-encryption-overview.md) <br/> [Built-in security controls](../virtual-machines/linux/security-baseline.md) <br/> [Security recommendations](../virtual-machines/security-recommendations.md)|

#### Isolated Virtual Machines
Azure Compute offers virtual machine sizes that are [isolated to a specific hardware type](../virtual-machines/isolation.md) and dedicated to a single customer. These VM instances allow your workloads to be deployed on dedicated physical servers. Using Isolated VMs essentially guarantees that your VM will be the only one running on that specific server node. You can also choose to further subdivide the resources on these Isolated VMs by using [Azure support for nested Virtual Machines](/virtualization/hyper-v-on-windows/user-guide/nested-virtualization).

## Networking isolation
The logical isolation of tenant infrastructure in a public multi-tenant cloud is [fundamental to maintaining security](https://azure.microsoft.com/resources/azure-network-security/). The overarching principle for a virtualized solution is to allow only connections and communications that are necessary for that virtualized solution to operate, blocking all other ports and connections by default. Azure [Virtual Network](../virtual-network/virtual-networks-overview.md) (VNet) helps ensure that your private network traffic is logically isolated from traffic belonging to other customers. Virtual Machines (VMs) in one VNet can't communicate directly with VMs in a different VNet even if both VNets are created by the same customer. [Networking isolation](../security/fundamentals/isolation-choices.md#networking-isolation) ensures that communication between your VMs remains private within a VNet. You can connect your VNets via [VNet peering](../virtual-network/virtual-network-peering-overview.md) or [VPN gateways](../vpn-gateway/vpn-gateway-about-vpngateways.md), depending on your connectivity options, including bandwidth, latency, and encryption requirements.

This section describes how Azure provides isolation of network traffic among tenants and enforces that isolation with cryptographic certainty.

### Separation of tenant network traffic
Virtual networks (VNets) provide isolation of network traffic between tenants as part of their fundamental design. Your Azure subscription can contain multiple logically isolated private networks, and include firewall, load balancing, and network address translation. Each VNet is isolated from other VNets by default. Multiple deployments inside your subscription can be placed on the same VNet, and then communicate with each other through private IP addresses.

Network access to VMs is limited by packet filtering at the network edge, at load balancers, and at the Host OS level. Moreover, you can configure your host firewalls to further limit connectivity, specifying for each listening port whether connections are accepted from the Internet or only from role instances within the same cloud service or VNet.

Azure provides network isolation for each deployment and enforces the following rules:

- Traffic between VMs always traverses through trusted packet filters.
  -	Protocols such as Address Resolution Protocol (ARP), Dynamic Host Configuration Protocol (DHCP), and other OSI Layer-2 traffic from a VM are controlled using rate-limiting and anti-spoofing protection.
  -	VMs can't capture any traffic on the network that isn't intended for them.
- Your VMs can't send traffic to Azure private interfaces and infrastructure services, or to VMs belonging to other customers. Your VMs can only communicate with other VMs owned or controlled by you and with Azure infrastructure service endpoints meant for public communications.
- When you put a VM on a VNet, that VM gets its own address space that is invisible, and hence, not reachable from VMs outside of a deployment or VNet (unless configured to be visible via public IP addresses). Your environment is open only through the ports that you specify for public access; if the VM is defined to have a public IP address, then all ports are open for public access.

#### Packet flow and network path protection
Azure’s hyperscale network is designed to provide:

- Uniform high capacity between servers.
- Performance isolation between services, including customers.
- Ethernet Layer-2 semantics.

Azure uses several networking implementations to achieve these goals:

- Flat addressing to allow service instances to be placed anywhere in the network.
- Load balancing to spread traffic uniformly across network paths.
- End-system based address resolution to scale to large server pools, without introducing complexity to the network control plane.

These implementations give each service the illusion that all the servers assigned to it, and only those servers, are connected by a single noninterfering Ethernet switch – a Virtual Layer 2 (VL2) – and maintain this illusion even as the size of each service varies from one server to hundreds of thousands. This VL2 implementation achieves traffic performance isolation, ensuring that it isn't possible for the traffic of one service to be affected by the traffic of any other service, as if each service were connected by a separate physical switch.

This section explains how packets flow through the Azure network, and how the topology, routing design, and directory system combine to virtualize the underlying network fabric, creating the illusion that servers are connected to a large, noninterfering datacenter-wide Layer-2 switch.

The Azure network uses [two different IP-address families](/windows-server/networking/sdn/technologies/hyper-v-network-virtualization/hyperv-network-virtualization-technical-details-windows-server#packet-encapsulation): 

- **Customer address (CA)** is the customer defined/chosen VNet IP address, also referred to as Virtual IP (VIP). The network infrastructure operates using CAs, which are externally routable. All switches and interfaces are assigned CAs, and switches run an IP-based (Layer-3) link-state routing protocol that disseminates only these CAs. This design allows switches to obtain the complete switch-level topology, and forward packets encapsulated with CAs along shortest paths.
- **Provider address (PA)** is the Azure assigned internal fabric address that isn't visible to users and is also referred to as Dynamic IP (DIP). No traffic goes directly from the Internet to a server; all traffic from the Internet must go through a Software Load Balancer (SLB) and be encapsulated to protect the internal Azure address space by only routing packets to valid Azure internal IP addresses and ports. Network Address Translation (NAT) separates internal network traffic from external traffic. Internal traffic uses [RFC 1918](https://datatracker.ietf.org/doc/rfc1918/) address space or private address space – the provider addresses (PAs) – that isn't externally routable. The translation is performed at the SLBs. Customer addresses (CAs) that are externally routable are translated into internal provider addresses (PAs) that are only routable within Azure. These addresses remain unaltered no matter how their servers’ locations change due to virtual-machine migration or reprovisioning.

Each PA is associated with a CA, which is the identifier of the Top of Rack (ToR) switch to which the server is connected. VL2 uses a scalable, reliable directory system to store and maintain the mapping of PAs to CAs, and this mapping is created when servers are provisioned to a service and assigned PA addresses. An agent running in the network stack on every server, called the VL2 agent, invokes the directory system’s resolution service to learn the actual location of the destination and then tunnels the original packet there.

Azure assigns servers IP addresses that act as names alone, with no topological significance. Azure’s VL2 addressing scheme separates these server names (PAs) from their locations (CAs). The crux of offering Layer-2 semantics is having servers believe they share a single large IP subnet – that is, the entire PA space – with other servers in the same service, while eliminating the Address Resolution Protocol (ARP) and Dynamic Host Configuration Protocol (DHCP) scaling bottlenecks that plague large Ethernet deployments.

Figure 9 depicts a sample packet flow where sender S sends packets to destination D via a randomly chosen intermediate switch using IP-in-IP encapsulation. PAs are from 20/8, and CAs are from 10/8. H(ft) denotes a hash of the [5-tuple](https://www.techopedia.com/definition/28190/5-tuple), which is composed of source IP, source port, destination IP, destination port, and protocol type. The ToR translates the PA to the CA, sends to the Intermediate switch, which sends to the destination CA ToR switch, which translates to the destination PA.

:::image type="content" source="./media/secure-isolation-fig9.png" alt-text="Sample packet flow":::
**Figure 9.**  Sample packet flow

A server can't send packets to a PA if the directory service refuses to provide it with a CA through which it can route its packets, which means that the directory service enforces access control policies. Further, since the directory system knows which server is making the request when handling a lookup, it can **enforce fine-grained isolation policies**. For example, it can enforce a policy that only servers belonging to the same service can communicate with each other. 

#### Traffic flow patterns
To route traffic between servers, which use PA addresses, on an underlying network that knows routes for CA addresses, the VL2 agent on each server captures packets from the host, and encapsulates them with the CA address of the ToR switch of the destination. Once the packet arrives at the CA (that is, the destination ToR switch), the destination ToR switch decapsulates the packet and delivers it to the destination PA carried in the inner header. The packet is first delivered to one of the Intermediate switches, decapsulated by the switch, delivered to the ToR’s CA, decapsulated again, and finally sent to the destination. This approach is depicted in Figure 10 using two possible traffic patterns: 1) external traffic (orange line) traversing over Azure ExpressRoute or the Internet to a VNet, and 2) internal traffic (blue line) between two VNets. Both traffic flows follow a similar pattern to isolate and protect network traffic.

:::image type="content" source="./media/secure-isolation-fig10.png" alt-text="Separation of tenant network traffic using VNets":::
**Figure 10.**  Separation of tenant network traffic using VNets

**External traffic (orange line)** – For external traffic, Azure provides multiple layers of assurance to enforce isolation depending on traffic patterns. When you place a public IP on your VNet gateway, traffic from the public Internet or your on-premises network that is destined for that IP address will be routed to an Internet Edge Router. Alternatively, when you establish private peering over an ExpressRoute connection, it's connected with an Azure VNet via VNet Gateway. This set-up aligns connectivity from the physical circuit and makes the private IP address space from the on-premises location addressable. Azure then uses Border Gateway Protocol (BGP) to share routing details with the on-premises network to establish end-to-end connectivity. When communication begins with a resource within the VNet, the network traffic traverses as normal until it reaches a Microsoft ExpressRoute Edge (MSEE) Router. In both cases, VNets provide the means for Azure VMs to act as part of your on-premises network. A cryptographically protected [IPsec/IKE tunnel](../vpn-gateway/vpn-gateway-about-vpn-devices.md#ipsec) is established between Azure and your internal network (for example, via [Azure VPN Gateway](../vpn-gateway/tutorial-site-to-site-portal.md) or [Azure ExpressRoute Private Peering](../virtual-wan/vpn-over-expressroute.md)), enabling the VM to connect securely to your on-premises resources as though it was directly on that network.

At the Internet Edge Router or the MSEE Router, the packet is encapsulated using Generic Routing Encapsulation (GRE). This encapsulation uses a unique identifier specific to the VNet destination and the destination address, which is used to appropriately route the traffic to the identified VNet. Upon reaching the VNet Gateway, which is a special VNet used only to accept traffic from outside of an Azure VNet, the encapsulation is verified by the Azure network fabric to ensure: a) the endpoint receiving the packet is a match to the unique VNet ID used to route the data, and b) the destination address requested exists in this VNet. Once verified, the packet is routed as internal traffic from the VNet Gateway to the final requested destination address within the VNet. This approach ensures that traffic from external networks travels only to Azure VNet for which it's destined, enforcing isolation.

**Internal traffic (blue line)** – Internal traffic also uses GRE encapsulation/tunneling. When two resources in an Azure VNet attempt to establish communications between each other, the Azure network fabric reaches out to the Azure VNet routing directory service that is part of the Azure network fabric. The directory services use the customer address (CA) and the requested destination address to determine the provider address (PA). This information, including the VNet identifier, CA, and PA, is then used to encapsulate the traffic with GRE. The Azure network uses this information to properly route the encapsulated data to the appropriate Azure host using the PA. The encapsulation is reviewed by the Azure network fabric to confirm:

1. The PA is a match,
2. The CA is located at this PA, and
3. The VNet identifier is a match.

Once all three are verified, the encapsulation is removed and routed to the CA as normal traffic, for example, to a VM endpoint. This approach provides VNet isolation assurance based on correct traffic routing between cloud services.

Azure VNets implement several mechanisms to ensure secure traffic between tenants. These mechanisms align to existing industry standards and security practices, and prevent well-known attack vectors including:

- **Prevent IP address spoofing** – Whenever encapsulated traffic is transmitted by a VNet, the service reverifies the information on the receiving end of the transmission. The traffic is looked up and encapsulated independently at the start of the transmission, and reverified at the receiving endpoint to ensure the transmission was performed appropriately. This verification is done with an internal VNet feature called SpoofGuard, which verifies that the source and destination are valid and allowed to communicate, thereby preventing mismatches in expected encapsulation patterns that might otherwise permit spoofing. The GRE encapsulation processes prevent spoofing as any GRE encapsulation and encryption not done by the Azure network fabric is treated as dropped traffic.
- **Provide network segmentation across customers with overlapping network spaces** – Azure VNet’s implementation relies on established tunneling standards such as the GRE, which in turn allows the use of customer-specific unique identifiers (VNet IDs) throughout the cloud. The VNet identifiers are used as scoping identifiers. This approach ensures that you're always operating within your unique address space, overlapping address spaces between tenants and the Azure network fabric. Anything that hasn't been encapsulated with a valid VNet ID is blocked within the Azure network fabric. In the example described previously, any encapsulated traffic not performed by the Azure network fabric is discarded.
- **Prevent traffic from crossing between VNets** – Preventing traffic from crossing between VNets is done through the same mechanisms that handle address overlap and prevent spoofing. Traffic crossing between VNets is rendered infeasible by using unique VNet IDs established per tenant in combination with verification of all traffic at the source and destination. Users don't have access to the underlying transmission mechanisms that rely on these IDs to perform the encapsulation. Therefore, any attempt to encapsulate and simulate these mechanisms would lead to dropped traffic.

In addition to these key protections, all unexpected traffic originating from the Internet is dropped by default. Any packet entering the Azure network will first encounter an Edge router. Edge routers intentionally allow all inbound traffic into the Azure network except spoofed traffic. This basic traffic filtering protects the Azure network from known bad malicious traffic. Azure also implements DDoS protection at the network layer, collecting logs to throttle or block traffic based on real time and historical data analysis, and mitigates attacks on demand.

Moreover, the Azure network fabric blocks traffic from any IPs originating in the Azure network fabric space that are spoofed. The Azure network fabric uses GRE and Virtual Extensible LAN (VXLAN) to validate that all allowed traffic is Azure-controlled traffic and all non-Azure GRE traffic is blocked. By using GRE tunnels and VXLAN to segment traffic using customer unique keys, Azure meets [RFC 3809](https://datatracker.ietf.org/doc/rfc3809/) and [RFC 4110](https://datatracker.ietf.org/doc/rfc4110/). When using Azure VPN Gateway in combination with ExpressRoute, Azure meets [RFC 4111](https://datatracker.ietf.org/doc/rfc4111/) and [RFC 4364](https://datatracker.ietf.org/doc/rfc4364/). With a comprehensive approach for isolation encompassing external and internal network traffic, Azure VNets provide you with assurance that Azure successfully routes traffic between VNets, allows proper network segmentation for tenants with overlapping address spaces, and prevents IP address spoofing.

You're also able to use Azure services to further isolate and protect your resources. Using [network security groups](../virtual-network/manage-network-security-group.md) (NSGs), a feature of Azure Virtual Network, you can filter traffic by source and destination IP address, port, and protocol via multiple inbound and outbound security rules – essentially acting as a distributed virtual firewall and IP-based network access control list (ACL). You can apply an NSG to each NIC in a virtual machine, apply an NSG to the subnet that a NIC or another Azure resource is connected to, and directly to virtual machine scale set, allowing finer control over your infrastructure.

At the infrastructure layer, Azure implements a Hypervisor firewall to protect all tenants running within virtual machines on top of the Hypervisor from unauthorized access. This Hypervisor firewall is distributed as part of the NSG rules deployed to the Host, implemented in the Hypervisor, and configured by the Fabric Controller agent, as shown in Figure 4. The Host OS instances use the built-in Windows Firewall to implement fine-grained ACLs at a greater granularity than router ACLs – they're maintained by the same software that provisions tenants, so they're never out of date. The fine-grained ACLs are applied using the Machine Configuration File (MCF) to Windows Firewall.

At the top of the operating system stack is the Guest OS, which you use as your operating system. By default, this layer doesn't allow any inbound communication to cloud service or virtual network, essentially making it part of a private network. For PaaS Web and Worker roles, remote access isn't permitted by default. You can enable Remote Desktop Protocol (RDP) access as an explicit option. For IaaS VMs created using the Azure portal, RDP and remote PowerShell ports are opened by default; however, port numbers are assigned randomly. For IaaS VMs created via PowerShell, RDP and remote PowerShell ports must be opened explicitly. If the administrator chooses to keep the RDP and remote PowerShell ports open to the Internet, the account allowed to create RDP and PowerShell connections should be secured with a strong password. Even if ports are open, you can define ACLs on the public IPs for extra protection if desired.

### Service tags
You can use Virtual Network [service tags](../virtual-network/service-tags-overview.md) to achieve network isolation and protect your Azure resources from the Internet while accessing Azure services that have public endpoints. With service tags, you can define network access controls on [network security groups](../virtual-network/network-security-groups-overview.md#security-rules) or [Azure Firewall](../firewall/service-tags.md). A service tag represents a group of IP address prefixes from a given Azure service. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change, thereby reducing the complexity of frequent updates to network security rules.

> [!NOTE]
> You can create inbound/outbound network security group rules to deny traffic to/from the Internet and allow traffic to/from Azure. Service tags are available for many Azure services for use in network security group rules.
>
> *Extra resources:*
> - **[Available service tags for specific Azure services](../virtual-network/service-tags-overview.md#available-service-tags)**

### Azure Private Link
You can use [Private Link](../private-link/private-link-overview.md) to access Azure PaaS services and Azure-hosted customer/partner services over a [private endpoint](../private-link/private-endpoint-overview.md) in your VNet, ensuring that traffic between your VNet and the service travels across the Microsoft global backbone network. This approach eliminates the need to expose the service to the public Internet. You can also create your own [private link service](../private-link/private-link-service-overview.md) in your own VNet and deliver it to your customers.

Azure private endpoint is a network interface that connects you privately and securely to a service powered by Private Link. Private endpoint uses a private IP address from your VNet, effectively bringing the service into your VNet.

From the networking isolation standpoint, key benefits of Private Link include:

- You can connect your VNet to services in Azure without a public IP address at the source or destination. Private Link handles the connectivity between the service and its consumers over the Microsoft global backbone network.
- You can access services running in Azure from on-premises over Azure ExpressRoute private peering, VPN tunnels, and peered virtual networks using private endpoints. Private Link eliminates the need to set up public peering or traverse the Internet to reach the service.
- You can connect privately to services running in other Azure regions.

> [!NOTE]
> You can use the Azure portal to manage private endpoint connections on Azure PaaS resources. For customer/partner owned Private Link services, Azure Power Shell and Azure CLI are the preferred methods for managing private endpoint connections.
>
> *Extra resources:*
> - **[How to manage private endpoint connections on Azure PaaS resources](../private-link/manage-private-endpoint.md#manage-private-endpoint-connections-on-azure-paas-resources)**
> - **[How to manage private endpoint connections on customer/partner owned Private Link service](../private-link/manage-private-endpoint.md#manage-private-endpoint-connections-on-a-customerpartner-owned-private-link-service)**

### Data encryption in transit
Azure provides many options for [encrypting data in transit](../security/fundamentals/encryption-overview.md#encryption-of-data-in-transit). **Data encryption in transit isolates your network traffic from other traffic and helps protect data from interception**. Data in transit applies to scenarios involving data traveling between:

- Your end users and Azure service
- Your on-premises datacenter and Azure region
- Microsoft datacenters as part of expected Azure service operation

#### End user's connection to Azure service
**Transport Layer Security (TLS)** –  Azure uses the TLS protocol to help protect data when it's traveling between your end users and Azure services. Most of your end users will connect to Azure over the Internet, and the precise routing of network traffic will depend on the many network providers that contribute to Internet infrastructure. As stated in the Microsoft Products and Services [Data Protection Addendum](https://aka.ms/DPA) (DPA), Microsoft doesn't control or limit the regions from which you or your end users may access or move customer data.

> [!IMPORTANT]
> You can increase security by enabling encryption in transit. For example, you can use **[Application Gateway](../application-gateway/ssl-overview.md)** to configure **[end-to-end encryption](../application-gateway/application-gateway-end-to-end-ssl-powershell.md)** of network traffic and rely on **[Key Vault integration](../application-gateway/key-vault-certs.md)** for TLS termination.

Across Azure services, traffic to and from the service is [protected by TLS 1.2](https://azure.microsoft.com/updates/azuretls12/) using RSA-2048 for key exchange and AES-256 for data encryption. The corresponding crypto modules are FIPS 140 validated as part of the Microsoft [Windows FIPS validation program](/windows/security/threat-protection/fips-140-validation#modules-used-by-windows-server).

TLS provides strong authentication, message privacy, and integrity. [Perfect Forward Secrecy](https://en.wikipedia.org/wiki/Forward_secrecy) (PFS) protects connections between your client systems and Microsoft cloud services by generating a unique session key for every session you initiate. PFS protects past sessions against potential future key compromises. This combination makes it more difficult to intercept and access data in transit.

**In-transit encryption for VMs** –  Remote sessions to Windows and Linux VMs deployed in Azure can be conducted over protocols that ensure data encryption in transit. For example, the [Remote Desktop Protocol](/windows/win32/termserv/remote-desktop-protocol) (RDP) initiated from your client computer to Windows and Linux VMs enables TLS protection for data in transit. You can also use [Secure Shell](../virtual-machines/linux/ssh-from-windows.md) (SSH) to connect to Linux VMs running in Azure. SSH is an encrypted connection protocol available by default for remote management of Linux VMs hosted in Azure.

> [!IMPORTANT]
> You should review best practices for network security, including guidance for **[disabling RDP/SSH access to Virtual Machines](../security/fundamentals/network-best-practices.md#disable-rdpssh-access-to-virtual-machines)** from the Internet to mitigate brute force attacks to gain access to Azure Virtual Machines. Accessing VMs for remote management can then be accomplished via **[point-to-site VPN](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md)**, **[site-to-site VPN](../vpn-gateway/tutorial-site-to-site-portal.md)**, or **[Azure ExpressRoute](../expressroute/expressroute-howto-linkvnet-portal-resource-manager.md)**.

**Azure Storage transactions** –  When interacting with Azure Storage through the Azure portal, all transactions take place over HTTPS. Moreover, you can configure your storage accounts to accept requests only from secure connections by setting the &#8220;[secure transfer required](../storage/common/storage-require-secure-transfer.md)&#8221; property for the storage account. The &#8220;secure transfer required&#8221; option is enabled by default when creating a Storage account in the Azure portal.

[Azure Files](../storage/files/storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the industry-standard [Server Message Block](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview) (SMB) protocol. By default, all Azure storage accounts [have encryption in transit enabled](../storage/files/storage-files-planning.md#encryption-in-transit). Therefore, when mounting a share over SMB or accessing it through the Azure portal (or Azure PowerShell, Azure CLI, and Azure SDKs), Azure Files will only allow the connection if it's made with SMB 3.0+ with encryption or over HTTPS.

#### Datacenter connection to Azure region
**VPN encryption** – [Virtual Network](../virtual-network/virtual-networks-overview.md) (VNet) provides a means for Azure Virtual Machines (VMs) to act as part of your internal (on-premises) network. With VNet, you choose the address ranges of non-globally-routable IP addresses to be assigned to the VMs so that they won't collide with addresses you're using elsewhere. You have options to securely connect to a VNet from your on-premises infrastructure or remote locations.

- **Site-to-Site** (IPsec/IKE VPN tunnel) – A cryptographically protected &#8220;tunnel&#8221; is established between Azure and your internal network, allowing an Azure VM to connect to your back-end resources as though it was directly on that network. This type of connection requires a [VPN device](../vpn-gateway/vpn-gateway-vpn-faq.md#s2s) located on-premises that has an externally facing public IP address assigned to it. You can use Azure [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) to send encrypted traffic between your VNet and your on-premises infrastructure across the public Internet, for example, a [site-to-site VPN](../vpn-gateway/tutorial-site-to-site-portal.md) relies on IPsec for transport encryption. VPN Gateway supports many encryption algorithms that are FIPS 140 validated. Moreover, you can configure VPN Gateway to use [custom IPsec/IKE policy](../vpn-gateway/vpn-gateway-about-compliance-crypto.md) with specific cryptographic algorithms and key strengths instead of relying on the default Azure policies. IPsec encrypts data at the IP level (Network Layer 3).
- **Point-to-Site** (VPN over SSTP, OpenVPN, and IPsec) – A secure connection is established from your individual client computer to your VNet using Secure Socket Tunneling Protocol (SSTP), OpenVPN, or IPsec. As part of the [Point-to-Site VPN](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md) configuration, you need to install a certificate and a VPN client configuration package, which allow the client computer to connect to any VM within the VNet. [Point-to-Site VPN](../vpn-gateway/point-to-site-about.md) connections don't require a VPN device or a public facing IP address.

In addition to controlling the type of algorithm that is supported for VPN connections, Azure provides you with the ability to enforce that all traffic leaving a VNet may only be routed through a VNet Gateway (for example, Azure VPN Gateway). This enforcement allows you to ensure that traffic may not leave a VNet without being encrypted. A VPN Gateway can be used for [VNet-to-VNet](../vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) connections while also providing a secure tunnel with IPsec/IKE. Azure VPN uses [Pre-Shared Key (PSK) authentication](../vpn-gateway/vpn-gateway-vpn-faq.md#how-does-my-vpn-tunnel-get-authenticated) whereby Microsoft generates the PSK when the VPN tunnel is created. You can change the autogenerated PSK to your own.

**Azure ExpressRoute encryption** – [Azure ExpressRoute](../expressroute/expressroute-introduction.md) allows you to create private connections between Microsoft datacenters and your on-premises infrastructure or colocation facility. ExpressRoute connections don't go over the public Internet and offer lower latency and higher reliability than IPsec protected VPN connections. [ExpressRoute locations](../expressroute/expressroute-locations-providers.md) are the entry points to Microsoft’s global network backbone and they may or may not match the location of Azure regions. Once the network traffic enters the Microsoft backbone, it's guaranteed to traverse that private networking infrastructure instead of the public Internet. You can use ExpressRoute with several data [encryption options](../expressroute/expressroute-about-encryption.md), including [MACsec](https://1.ieee802.org/security/802-1ae/) that enable you to store [MACsec encryption keys in Azure Key Vault](../expressroute/expressroute-about-encryption.md#point-to-point-encryption-by-macsec-faq). MACsec encrypts data at the Media Access Control (MAC) level, that is, data link layer (Network Layer 2). Both AES-128 and AES-256 block ciphers are [supported for encryption](../expressroute/expressroute-about-encryption.md#which-cipher-suites-are-supported-for-encryption). You can use MACsec to encrypt the physical links between your network devices and Microsoft network devices when you connect to Microsoft via [ExpressRoute Direct](../expressroute/expressroute-erdirect-about.md). ExpressRoute Direct allows for direct fiber connections from your edge to the Microsoft Enterprise edge routers at the peering locations.

You can enable IPsec in addition to MACsec on your ExpressRoute Direct ports, as shown in Figure 11. Using VPN Gateway, you can set up an [IPsec tunnel over Microsoft Peering](../expressroute/site-to-site-vpn-over-microsoft-peering.md) of your ExpressRoute circuit between your on-premises network and your Azure VNet. MACsec secures the physical connection between your on-premises network and Microsoft. IPsec secures the end-to-end connection between your on-premises network and your VNets in Azure. MACsec and IPsec can be enabled independently.

:::image type="content" source="./media/secure-isolation-fig11.png" alt-text="VPN and ExpressRoute encryption for data in transit" border="false":::
**Figure 11.** VPN and ExpressRoute encryption for data in transit

#### Traffic across Microsoft global network backbone
Azure services such as Storage and SQL Database can be configured for geo-replication to help ensure durability and high availability especially for disaster recovery scenarios. Azure relies on [paired regions](../availability-zones/cross-region-replication-azure.md) to deliver [geo-redundant storage](../storage/common/storage-redundancy.md) (GRS) and paired regions are also recommended when configuring active [geo-replication](/azure/azure-sql/database/active-geo-replication-overview) for Azure SQL Database. Paired regions are located within the same geography; however, network traffic isn't guaranteed to always follow the same path from one Azure region to another. To provide the reliability needed for the Azure cloud, Microsoft has many physical networking paths with automatic routing around failures for optimal reliability.

Moreover, all Azure traffic traveling within a region or between regions is [encrypted by Microsoft using MACsec](../security/fundamentals/encryption-overview.md#data-link-layer-encryption-in-azure), which relies on AES-128 block cipher for encryption. This traffic stays entirely within the Microsoft [global network backbone](../networking/microsoft-global-network.md) and never enters the public Internet. The backbone is one of the largest in the world with more than 250,000 km of lit fiber optic and undersea cable systems.

> [!IMPORTANT]
> You should review Azure **[best practices for the protection of data in transit](../security/fundamentals/data-encryption-best-practices.md#protect-data-in-transit)** to help ensure that all data in transit is encrypted. For key Azure PaaS storage services (for example, Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse Analytics), data encryption in transit is **[enforced by default](/azure/azure-sql/database/security-overview#transport-layer-security-encryption-in-transit)**.

### Third-party network virtual appliances
Azure provides you with many features to help you achieve your security and isolation goals, including [Microsoft Defender for Cloud](../defender-for-cloud/defender-for-cloud-introduction.md), [Azure Monitor](../azure-monitor/overview.md), [Azure Firewall](../firewall/overview.md), [VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md), [network security groups](../virtual-network/network-security-groups-overview.md), [Application Gateway](../application-gateway/overview.md), [Azure DDoS Protection](../ddos-protection/ddos-protection-overview.md), [Network Watcher](../network-watcher/network-watcher-monitoring-overview.md), [Microsoft Sentinel](../sentinel/overview.md), and [Azure Policy](../governance/policy/overview.md). In addition to the built-in capabilities that Azure provides, you can use third-party [network virtual appliances](https://azure.microsoft.com/solutions/network-appliances/) to accommodate your specific network isolation requirements while at the same time applying existing in-house skills. Azure supports many appliances, including offerings from F5, Palo Alto Networks, Cisco, Check Point, Barracuda, Citrix, Fortinet, and many others. Network appliances support network functionality and services in the form of VMs in your virtual networks and deployments.

The cumulative effect of network isolation restrictions is that each cloud service acts as though it were on an isolated network where VMs within the cloud service can communicate with one another, identifying one another by their source IP addresses with confidence that no other parties can impersonate their peer VMs. They can also be configured to accept incoming connections from the Internet over specific ports and protocols and to ensure that all network traffic leaving your virtual networks is always encrypted.

> [!TIP]
> You should review published Azure networking documentation for guidance on how to use native security features to help protect your data.
>
> *Extra resources:*
> - **[Azure network security overview](../security/fundamentals/network-overview.md)**
> - **[Azure network security white paper](https://azure.microsoft.com/resources/azure-network-security/)**

## Storage isolation
Microsoft Azure separates your VM-based compute resources from storage as part of its [fundamental design](../security/fundamentals/isolation-choices.md#storage-isolation). The separation allows compute and storage to scale independently, making it easier to provide multi-tenancy and isolation. Therefore, Azure Storage runs on separate hardware with no network connectivity to Azure Compute except logically.

Each Azure [subscription](/azure/cloud-adoption-framework/decision-guides/subscriptions/) can have one or more storage accounts. Azure storage supports various [authentication options](/rest/api/storageservices/authorize-requests-to-azure-storage), including:

- **Shared symmetric keys** – Upon storage account creation, Azure generates two 512-bit storage account keys that control access to the storage account. You can rotate and regenerate these keys at any point thereafter without coordination with your applications. 
- **Microsoft Entra ID-based authentication** – Access to Azure Storage can be controlled by Microsoft Entra ID, which enforces tenant isolation and implements robust measures to prevent access by unauthorized parties, including Microsoft insiders. More information about Microsoft Entra tenant isolation is available from a white paper [Microsoft Entra Data Security Considerations](https://aka.ms/AADDataWhitePaper).
- **Shared access signatures (SAS)** – Shared access signatures or “presigned URLs” can be created from the shared symmetric keys. These URLs can be significantly limited in scope to reduce the available attack surface, but at the same time allow applications to grant storage access to another user, service, or device.
-	**User delegation SAS** – Delegated authentication is similar to SAS but is [based on Microsoft Entra tokens](/rest/api/storageservices/create-user-delegation-sas) rather than the shared symmetric keys. This approach allows a service that authenticates with Microsoft Entra ID to create a pre signed URL with limited scope and grant temporary access to another user, service, or device.
-	**Anonymous public read access** – You can allow a small portion of your storage to be publicly accessible without authentication or authorization. This capability can be disabled at the subscription level if you desire more stringent control.

Azure Storage provides storage for a wide variety of workloads, including:

-	Azure Virtual Machines (disk storage)
-	Big data analytics (HDFS for HDInsight, Azure Data Lake Storage) 
-	Storing application state, user data (Blob, Queue, Table storage) 
-	Long-term data storage (Azure Archive Storage) 
-	Network file shares in the cloud (File storage) 
-	Serving web pages on the Internet (static websites) 

While Azure Storage supports many different externally facing customer storage scenarios, internally, the physical storage for the above services is managed by a common set of APIs. To provide durability and availability, Azure Storage relies on data replication and data partitioning across storage resources that are shared among tenants. To ensure cryptographic certainty of logical data isolation, Azure Storage relies on data encryption at rest using advanced algorithms with multiple ciphers as described in this section.

### Data replication
Your data in an Azure Storage account is [always replicated](../storage/common/storage-redundancy.md) to help ensure durability and high availability. Azure Storage copies your data to protect it from transient hardware failures, network or power outages, and even massive natural disasters. You can typically choose to replicate your data within the same data center, across [availability zones within the same region](../availability-zones/az-overview.md), or across geographically separated regions. Specifically, when creating a storage account, you can select one of the following [redundancy options](../storage/common/storage-redundancy.md#summary-of-redundancy-options):

-	**Locally redundant storage (LRS)** replicates three copies (or the erasure coded equivalent, as described later) of your data within a single data center. A write request to an LRS storage account returns successfully only after the data is written to all three replicas. Each replica resides in separate fault and upgrade domains within a scale unit (set of storage racks within a data center).
-	**Zone-redundant storage (ZRS)** replicates your data synchronously across three storage clusters in a single [region](../availability-zones/az-overview.md#regions). Each storage cluster is physically separated from the others and is in its own [Availability Zone](../availability-zones/az-overview.md#availability-zones) (AZ). A write request to a ZRS storage account returns successfully only after the data is written to all replicas across the three clusters.
-	**Geo-redundant storage (GRS)** replicates your data to a [secondary (paired) region](../availability-zones/cross-region-replication-azure.md) that is hundreds of kilometers away from the primary region. GRS storage accounts are durable even during a complete regional outage or a disaster in which the primary region isn't recoverable. For a storage account with GRS or RA-GRS enabled, all data is first replicated with LRS. An update is first committed to the primary location and replicated using LRS. The update is then replicated asynchronously to the secondary region using GRS. When data is written to the secondary location, it's also replicated within that location using LRS.
-	**Read-access geo-redundant storage (RA-GRS)** is based on GRS. It provides read-only access to the data in the secondary location, in addition to geo-replication across two regions. With RA-GRS, you can read from the secondary region regardless of whether Microsoft initiates a failover from the primary to secondary region.
-	**Geo-zone-redundant storage (GZRS)** combines the high availability of ZRS with protection from regional outages as provided by GRS. Data in a GZRS storage account is replicated across three AZs in the primary region and also replicated to a secondary geographic region for protection from regional disasters. Each Azure region is paired with another region within the same geography, together making a [regional pair](../availability-zones/cross-region-replication-azure.md).
-	**Read-access geo-zone-redundant storage (RA-GZRS)** is based on GZRS. You can optionally enable read access to data in the secondary region with RA-GZRS if your applications need to be able to read data following a disaster in the primary region.

### High-level Azure Storage architecture
Azure Storage production systems consist of storage stamps and the location service (LS), as shown in Figure 12. A storage stamp is a cluster of racks of storage nodes, where each rack is built as a separate fault domain with redundant networking and power. The LS manages all the storage stamps and the account namespace across all stamps. It allocates accounts to storage stamps and manages them across the storage stamps for load balancing and disaster recovery. The LS itself is distributed across two geographic locations for its own disaster recovery ([Calder, et al., 2011](https://sigops.org/s/conferences/sosp/2011/current/2011-Cascais/printable/11-calder.pdf)).

:::image type="content" source="./media/secure-isolation-fig12.png" alt-text="High-level Azure Storage architecture":::
**Figure 12.**  High-level Azure Storage architecture (Source: [Calder, et al., 2011](https://sigops.org/s/conferences/sosp/2011/current/2011-Cascais/printable/11-calder.pdf))

There are three layers within a storage stamp: front-end, partition, and stream. These layers are described in the rest of this section.

#### Front-end layer
The front-end (FE) layer consists of a set of stateless servers that take the incoming requests, authenticate and authorize the requests, and then route them to a partition server in the Partition Layer. The FE layer knows what partition server to forward each request to, since each front-end server caches a partition map. The partition map keeps track of the partitions for the service being accessed and what partition server is controlling (serving) access to each partition in the system. The FE servers also stream large objects directly from the stream layer.

Transferring large volumes of data across the Internet is inherently unreliable. Using Azure block blobs service, you can upload and store large files efficiently by breaking up large files into smaller blocks of data. In this manner, block blobs allow partitioning of data into individual blocks for reliability of large uploads, as shown in Figure 13. Each block can be up to 100 MB in size with up to 50,000 blocks in the block blob. If a block fails to transmit correctly, only that particular block needs to be resent versus having to resend the entire file again. In addition, with a block blob, multiple blocks can be sent in parallel to decrease upload time.

:::image type="content" source="./media/secure-isolation-fig13.png" alt-text="Block blob partitioning of data into individual blocks":::
**Figure 13.**  Block blob partitioning of data into individual blocks

You can upload blocks in any order and determine their sequence in the final blocklist commitment step. You can also upload a new block to replace an existing uncommitted block of the same block ID.

#### Partition layer
The partition layer is responsible for:

- Managing higher-level data abstractions (Blob, Table, Queue),
- Providing a scalable object namespace,
- Providing transaction ordering and strong consistency for objects,
- Storing object data on top of the stream layer, and
- Caching object data to reduce disk I/O.

This layer also provides asynchronous geo-replication of data and is focused on replicating data across stamps. Inter-stamp replication is done in the background to keep a copy of the data in two locations for disaster recovery purposes.

Once a blob is ingested by the FE layer, the partition layer is responsible for tracking and storing where data is placed in the stream layer. Each storage tenant can have approximately 200 - 300 individual partition layer nodes, and each node is responsible for tracking and serving a partition of the data stored in that Storage tenant. The high throughput block blob (HTBB) feature enables data to be sharded within a single blob, which allows the workload for large blobs to be shared across multiple partition layer servers (Figure 14). Distributing the load among multiple partition layer servers greatly improves availability, throughput, and durability.

:::image type="content" source="./media/secure-isolation-fig14.png" alt-text="High throughput block blobs spread traffic and data across multiple partition servers and streams":::
**Figure 14.**  High throughput block blobs spread traffic and data across multiple partition servers and streams

#### Stream layer
The stream layer stores the bits on disk, and is responsible for distributing and replicating the data across many servers to keep data durable within a storage stamp. It acts as a distributed file system layer within a stamp. It handles files, called streams, which are ordered lists of data blocks called extents that are analogous to extents on physical hard drives. Large blob objects can be stored in multiple extents, potentially on multiple physical extent nodes (ENs). The data is stored in the stream layer, but it's accessible from the partition layer. Partition servers and stream servers are colocated on each storage node in a stamp.

The stream layer provides synchronous replication (intra-stamp) across different nodes in different fault domains to keep data durable within the stamp. It's responsible for creating the three local replicated copies of each extent. The stream layer manager makes sure that all three copies are distributed across different physical racks and nodes on different fault and upgrade domains so that copies are resilient to individual disk/node/rack failures and planned downtime due to upgrades.

**Erasure Coding** – Azure Storage uses a technique called [Erasure Coding](https://www.microsoft.com/research/wp-content/uploads/2016/02/LRC12-cheng20webpage.pdf), which allows for the reconstruction of data even if some of the data is missing due to disk failure. This approach is similar to the concept of RAID striping for individual disks where data is spread across multiple disks so that if a disk is lost, the missing data can be reconstructed using the parity bits from the data on the other disks. Erasure Coding splits an extent into equal data and parity fragments that are stored on separate ENs, as shown in Figure 15.

:::image type="content" source="./media/secure-isolation-fig15.png" alt-text="Erasure Coding further shards extent data across EN servers to protect against failure":::
**Figure 15.**  Erasure Coding further shards extent data across EN servers to protect against failure

All data blocks stored in stream extent nodes have a 64-bit cyclic redundancy check (CRC) and a header protected by a hash signature to provide extent node (EN) data integrity. The CRC and signature are checked before every disk write, disk read, and network receive. In addition, scrubber processes read all data at regular intervals verifying the CRC and looking for *bit rot*. If a bad extent is found a new copy of that extent is created to replace the bad extent.

Your data in Azure Storage relies on data encryption at rest to provide cryptographic certainty for logical data isolation. You can choose between Microsoft-managed encryption keys (also known as platform-managed encryption keys) or customer-managed encryption keys (CMK). The handling of data encryption and decryption is transparent to customers, as discussed in the next section.

### Data encryption at rest
Azure provides extensive options for [data encryption at rest](../security/fundamentals/encryption-atrest.md) to help you safeguard your data and meet your compliance needs when using both Microsoft-managed encryption keys and customer-managed encryption keys. For more information, see [data encryption models](../security/fundamentals/encryption-models.md). This process relies on multiple encryption keys and services such as Azure Key Vault and Microsoft Entra ID to ensure secure key access and centralized key management.

> [!NOTE]
> If you require extra security and isolation assurances for your most sensitive data stored in Azure services, you can encrypt it using your own encryption keys you control in Azure Key Vault.

In general, controlling key access and ensuring efficient bulk encryption and decryption of data is accomplished via the following types of encryption keys (as shown in Figure 16), although other encryption keys can be used as described in *[Storage service encryption](#storage-service-encryption)* section.

-	**Data Encryption Key (DEK)** is a symmetric AES-256 key that is used for bulk encryption and decryption of a partition or a block of data. The cryptographic modules are FIPS 140 validated as part of the [Windows FIPS validation program](/windows/security/threat-protection/fips-140-validation#modules-used-by-windows-server). Access to DEKs is needed by the resource provider or application instance that is responsible for encrypting and decrypting a specific block of data. A single resource may have many partitions and many DEKs. When a DEK is replaced with a new key, only the data in its associated block must be re-encrypted with the new key. The DEK is always stored encrypted by the Key Encryption Key (KEK).
-	**Key Encryption Key (KEK)** is an asymmetric RSA key that is optionally provided by you. This key encryption key is utilized to encrypt the Data Encryption Key (DEK) using Azure Key Vault or Managed HSM. As mentioned previously in *[Data encryption key management](#data-encryption-key-management)* section, Azure Key Vault can use FIPS 140 validated hardware security modules (HSMs) to safeguard encryption keys; Managed HSM always uses FIPS 140 validated hardware security modules. These keys aren't exportable and there can be no clear-text version of the KEK outside the HSMs – the binding is enforced by the underlying HSM. KEK is never exposed directly to the resource provider or other services. Access to KEK is controlled by permissions in Azure Key Vault and access to Azure Key Vault must be authenticated through Microsoft Entra ID. These permissions can be revoked to block access to this key and, by extension, the data that is encrypted using this key as the root of the key chain.

:::image type="content" source="./media/secure-isolation-fig16.png" alt-text="Data Encryption Keys are encrypted using your key stored in Azure Key Vault":::
**Figure 16.**  Data Encryption Keys are encrypted using your key stored in Azure Key Vault

Therefore, the encryption key hierarchy involves both DEK and KEK. DEK is encrypted with KEK and stored separately for efficient access by resource providers in bulk encryption and decryption operations. However, only an entity with access to the KEK can decrypt the DEK. The entity that has access to the KEK may be different than the entity that requires the DEK. Since the KEK is required to decrypt the DEK, the KEK is effectively a single point by which DEK can be deleted via deletion of the KEK.

Detailed information about various [data encryption models](../security/fundamentals/encryption-models.md) and specifics on key management for many Azure platform services is available in online documentation. Moreover, some Azure services provide other [encryption models](../security/fundamentals/encryption-overview.md#azure-encryption-models), including client-side encryption, to further encrypt their data using more granular controls. The rest of this section covers encryption implementation for key Azure storage scenarios such as Storage service encryption and disk encryption for IaaS Virtual Machines.

> [!TIP]
> You should review published Azure data encryption documentation for guidance on how to protect your data.
>
> *Extra resources:*
> - **[Encryption at rest overview](../security/fundamentals/encryption-atrest.md)**
> - **[Data encryption models](../security/fundamentals/encryption-models.md)**
> - **[Data encryption best practices](../security/fundamentals/data-encryption-best-practices.md)**

#### Storage service encryption
Azure [Storage service encryption](../storage/common/storage-service-encryption.md) for data at rest ensures that data is automatically encrypted before persisting it to Azure Storage and decrypted before retrieval. All data written to Azure Storage is encrypted through FIPS 140 validated 256-bit AES encryption, and the handling of encryption, decryption, and key management in Storage service encryption is transparent to customers. By default, Microsoft controls the encryption keys and is responsible for key rotation, usage, and access. Keys are stored securely and protected inside a Microsoft key store. This option provides you with the most convenience given that all Azure Storage services are supported.

However, you can also choose to manage encryption with your own keys by specifying:

-	[Customer-managed key](../storage/common/customer-managed-keys-overview.md) for managing Azure Storage encryption whereby the key is stored in Azure Key Vault. This option provides much flexibility for you to create, rotate, disable, and revoke access to customer-managed keys. You must use Azure Key Vault to store customer-managed keys. Both key vaults and managed HSMs are supported, as described previously in *[Azure Key Vault](#azure-key-vault)* section.
-	[Customer-provided key](../storage/blobs/encryption-customer-provided-keys.md) for encrypting and decrypting Blob storage only whereby the key can be stored in Azure Key Vault or in another key store on your premises to meet regulatory compliance requirements. Customer-provided keys enable you to pass an encryption key to Storage service using Blob APIs as part of read or write operations.

> [!NOTE]
> You can configure customer-managed keys (CMK) with Azure Key Vault using the **[Azure portal, Azure PowerShell, or Azure CLI](../storage/common/customer-managed-keys-configure-key-vault.md)**. You can **[use .NET to specify a customer-provided key](../storage/blobs/storage-blob-customer-provided-key.md)** on a request to Blob storage.

Storage service encryption is enabled by default for all new and existing storage accounts and it [can't be disabled](../storage/common/storage-service-encryption.md#about-azure-storage-service-side-encryption). As shown in Figure 17, the encryption process uses the following keys to help ensure cryptographic certainty of data isolation at rest:

-	*Data Encryption Key (DEK)* is a symmetric AES-256 key that is used for bulk encryption, and it's unique per storage account in Azure Storage. It's generated by the Azure Storage service as part of the storage account creation and is used derive a unique key for each block of data. The Storage Service always encrypts the DEK using either the Stamp Key or a Key Encryption Key if the customer has configured customer-managed key encryption.
-	*Key Encryption Key (KEK)* is an asymmetric RSA (2048 or greater) key managed by the customer and is used to encrypt the Data Encryption Key (DEK) using Azure Key Vault or Managed HSM. It's never exposed directly to the Azure Storage service or other services.
-	*Stamp Key (SK)* is a symmetric AES-256 key managed by Azure Storage. This key is used to protect the DEK when not using a customer-managed key.

These keys protect any data that is written to Azure Storage and provide cryptographic certainty for logical data isolation in Azure Storage. As mentioned previously, Azure Storage service encryption is enabled by default and it can't be disabled.

:::image type="content" source="./media/secure-isolation-fig17.png" alt-text="Encryption flow for Storage service encryption":::
**Figure 17.**  Encryption flow for Storage service encryption

Storage accounts are encrypted regardless of their performance tier (standard or premium) or deployment model (Azure Resource Manager or classic). All Azure Storage [redundancy options](../storage/common/storage-redundancy.md) support encryption and all copies of a storage account are encrypted. All Azure Storage resources are encrypted, including blobs, disks, files, queues, and tables. All object metadata is also encrypted.

Because data encryption is performed by the Storage service, server-side encryption with CMK enables you to use any operating system types and images for your VMs. For your Windows and Linux IaaS VMs, Azure also provides Azure Disk encryption that enables you to encrypt managed disks with CMK within the Guest VM or EncryptionAtHost that encrypts disk data right at the host, as described in the next sections. Azure Storage service encryption also offers [double encryption of disk data at rest](../virtual-machines/disks-enable-double-encryption-at-rest-portal.md).

#### Azure Disk encryption
Azure Storage service encryption encrypts the page blobs that store Azure Virtual Machine disks. Moreover, you may optionally use [Azure Disk encryption](../virtual-machines/disk-encryption-overview.md) to encrypt Azure [Windows](../virtual-machines/windows/disk-encryption-overview.md) and [Linux](../virtual-machines/linux/disk-encryption-overview.md) IaaS Virtual Machine disks to increase storage isolation and assure cryptographic certainty of your data stored in Azure. This encryption includes [managed disks](../virtual-machines/managed-disks-overview.md), as described later in this section. Azure disk encryption uses the industry standard [BitLocker](/windows/security/information-protection/bitlocker/bitlocker-overview) feature of Windows and the [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) feature of Linux to provide OS-based volume encryption that is integrated with Azure Key Vault.

Drive encryption through BitLocker and DM-Crypt is a data protection feature that integrates with the operating system and addresses the threats of data theft or exposure from lost, stolen, or inappropriately decommissioned computers. BitLocker and DM-Crypt provide the most protection when used with a Trusted Platform Module (TPM) version 1.2 or higher. The TPM is a microcontroller designed to secure hardware through integrated cryptographic keys – it's commonly preinstalled on newer computers. BitLocker and DM-Crypt can use this technology to protect the keys used to encrypt disk volumes and provide integrity to computer boot process.

For managed disks, Azure Disk encryption allows you to encrypt the OS and Data disks used by an IaaS virtual machine; however, Data can't be encrypted without first encrypting the OS volume. The solution relies on Azure Key Vault to help you control and manage the disk encryption keys in key vaults. You can supply your own encryption keys, which are safeguarded in Azure Key Vault to support *bring your own key (BYOK)* scenarios, as described previously in *[Data encryption key management](#data-encryption-key-management)* section.

Azure Disk encryption does not support Managed HSM or an on-premises key management service. Only key vaults managed by the Azure Key Vault service can be used to safeguard customer-managed encryption keys for Azure Disk encryption. See [Encryption at host](#encryption-at-host) for other options involving Managed HSM.

> [!NOTE]
> Detailed instructions are available for creating and configuring a key vault for Azure Disk encryption with both **[Windows](../virtual-machines/windows/disk-encryption-key-vault.md)** and **[Linux](../virtual-machines/linux/disk-encryption-key-vault.md)** VMs.

Azure Disk encryption relies on two encryption keys for implementation, as described previously:

-	*Data Encryption Key (DEK)* is a symmetric AES-256 key used to encrypt OS and Data volumes through BitLocker or DM-Crypt. DEK itself is encrypted and stored in an internal location close to the data.
-	*Key Encryption Key (KEK)* is an asymmetric RSA-2048 key used to encrypt the Data Encryption Keys. KEK is kept in Azure Key Vault under your control including granting access permissions through Microsoft Entra ID.

The DEK, encrypted with the KEK, is stored separately and only an entity with access to the KEK can decrypt the DEK. Access to the KEK is guarded by Azure Key Vault where you can choose to store your keys in [FIPS 140 validated hardware security modules](../key-vault/keys/hsm-protected-keys-byok.md).

For [Windows VMs](../virtual-machines/windows/disk-encryption-faq.yml), Azure Disk encryption selects the encryption method in BitLocker based on the version of Windows, for example, XTS-AES 256 bit for Windows Server 2012 or greater. These crypto modules are FIPS 140 validated as part of the Microsoft [Windows FIPS validation program](/windows/security/threat-protection/fips-140-validation#modules-used-by-windows-server). For [Linux VMs](../virtual-machines/linux/disk-encryption-faq.yml), Azure Disk encryption uses the decrypt default of aes-xts-plain64 with a 256-bit volume master key that is FIPS 140 validated as part of DM-Crypt validation obtained by suppliers of Linux IaaS VM images in Microsoft Azure Marketplace.

##### *Server-side encryption for managed disks*
[Azure managed disks](../virtual-machines/managed-disks-overview.md) are block-level storage volumes that are managed by Azure and used with Azure Windows and Linux virtual machines. They simplify disk management for Azure IaaS VMs by handling storage account management transparently for you. Azure managed disks automatically encrypt your data by default using [256-bit AES encryption](../virtual-machines/disk-encryption.md) that is FIPS 140 validated. For encryption key management, you have the following choices:

- [Platform-managed keys](../virtual-machines/disk-encryption.md#platform-managed-keys) is the default choice that provides transparent data encryption at rest for managed disks whereby keys are managed by Microsoft.
- [Customer-managed keys](../virtual-machines/disk-encryption.md#customer-managed-keys) enables you to have control over your own keys that can be imported into or generated inside Azure Key Vault or Managed HSM. This approach relies on two sets of keys as described previously: DEK and KEK. DEK encrypts the data using an AES-256 based encryption and is in turn encrypted by an RSA KEK that is stored in Azure Key Vault or Managed HSM.

Customer-managed keys (CMK) enable you to have [full control](../virtual-machines/disk-encryption.md#full-control-of-your-keys) over your encryption keys. You can grant access to managed disks in your Azure Key Vault so that your keys can be used for encrypting and decrypting the DEK. You can also disable your keys or revoke access to managed disks at any time. Finally, you have full audit control over key usage with Azure Key Vault monitoring to ensure that only managed disks or other authorized resources are accessing your encryption keys.

##### *Encryption at host*
Encryption at host works with server-side encryption to ensure data stored on the VM host is encrypted at rest and flows encrypted to the Storage service. The server hosting your VM encrypts your data with no performance impact or requirement for code running in your guest VM, and that encrypted data flows into Azure Storage using the keys configured for server-side encryption. For more information, see [Encryption at host - End-to-end encryption for your VM data](../virtual-machines/disk-encryption.md#encryption-at-host---end-to-end-encryption-for-your-vm-data). Encryption at host with CMK can use keys stored in Managed HSM or Key Vault, just like server-side encryption for managed disks.

You're [always in control of your customer data](https://www.microsoft.com/trust-center/privacy/data-management) in Azure. You can access, extract, and delete your customer data stored in Azure at will. When you terminate your Azure subscription, Microsoft takes the necessary steps to ensure that you continue to own your customer data. A common concern upon data deletion or subscription termination is whether another customer or Azure administrator can access your deleted data. The following sections explain how data deletion, retention, and destruction work in Azure.

### Data deletion
Storage is allocated sparsely, which means that when a virtual disk is created, disk space isn't allocated for its entire capacity. Instead, a table is created that maps addresses on the virtual disk to areas on the physical disk and that table is initially empty. The first time you write data on the virtual disk, space on the physical disk is allocated and a pointer to it is placed in the table. For more information, see [Azure data security – data cleansing and leakage](/archive/blogs/walterm/microsoft-azure-data-security-data-cleansing-and-leakage).

When you delete a blob or table entity, it will immediately get deleted from the index used to locate and access the data on the primary location, and then the deletion is done asynchronously at the geo-replicated copy of the data, if you provisioned [geo-redundant storage](../storage/common/storage-redundancy.md#geo-redundant-storage). At the primary location, you can immediately try to access the blob or entity, and you won’t find it in your index, since Azure provides strong consistency for the delete. So, you can verify directly that the data has been deleted.

In Azure Storage, all disk writes are sequential. This approach minimizes the amount of disk &#8220;seeks&#8221; but requires updating the pointers to objects every time they're written – new versions of pointers are also written sequentially. A side effect of this design is that it isn't possible to ensure that a secret on disk is gone by overwriting it with other data. The original data will remain on the disk and the new value will be written sequentially. Pointers will be updated such that there's no way to find the deleted value anymore. Once the disk is full, however, the system has to write new logs onto disk space that has been freed up by the deletion of old data. Instead of allocating log files directly from disk sectors, log files are created in a file system running NTFS. A background thread running on Azure Storage nodes frees up space by going through the oldest log file, copying blocks that are still referenced from that oldest log file to the current log file, and updating all pointers as it goes. It then deletes the oldest log file. Therefore, there are two categories of free disk space on the disk: (1) space that NTFS knows is free, where it allocates new log files from this pool; and (2) space within those log files that Azure Storage knows is free since there are no current pointers to it.

The sectors on the physical disk associated with the deleted data become immediately available for reuse and are overwritten when the corresponding storage block is reused for storing other data. The time to overwrite varies depending on disk utilization and activity. This process is consistent with the operation of a log-structured file system where all writes are written sequentially to disk. This process isn't deterministic and there's no guarantee when particular data will be gone from physical storage. **However, when exactly deleted data gets overwritten or the corresponding physical storage allocated to another customer is irrelevant for the key isolation assurance that no data can be recovered after deletion:**

- A customer can't read deleted data of another customer.
- If anyone tries to read a region on a virtual disk that they haven't yet written to, physical space won't have been allocated for that region and therefore only zeroes would be returned.

Customers aren't provided with direct access to the underlying physical storage. Since customer software only addresses virtual disks, there's no way for another customer to express a request to read from or write to a physical address that is allocated to you or a physical address that is free.

Conceptually, this rationale applies regardless of the software that keeps track of reads and writes. For [Azure SQL Database](../security/fundamentals/isolation-choices.md#sql-database-isolation), it's the SQL Database software that does this enforcement. For Azure Storage, it's the Azure Storage software. For nondurable drives of a VM, it's the VHD handling code of the Host OS. The mapping from virtual to physical address takes place outside of the customer VM.

Finally, as described in *[Data encryption at rest](#data-encryption-at-rest)* section and depicted in Figure 16, the encryption key hierarchy relies on the Key Encryption Key (KEK) which can be kept in Azure Key Vault under your control (that is, customer-managed key – CMK) and used to encrypt the Data Encryption Key (DEK), which in turns encrypts data at rest using AES-256 symmetric encryption. Data in Azure Storage is encrypted at rest by default and you can choose to have encryption keys under your own control. In this manner, you can also prevent access to your data stored in Azure. Moreover, since the KEK is required to decrypt the DEKs, the KEK is effectively a single point by which DEK can be deleted via deletion of the KEK.

### Data retention
During the term of your Azure subscription, you always have the ability to access, extract, and delete your data stored in Azure.

If your subscription expires or is terminated, Microsoft will preserve your customer data for a 90-day retention period to permit you to extract your data or renew your subscriptions. After this retention period, Microsoft will delete all your customer data within another 90 days, that is, your customer data will be permanently deleted 180 days after expiration or termination. Given the data retention procedure, you can control how long your data is stored by timing when you end the service with Microsoft. It's recommended that you don't terminate your service until you've extracted all data so that the initial 90-day retention period can act as a safety buffer should you later realize you missed something.

If you deleted an entire storage account by mistake, you should contact [Azure Support](https://azure.microsoft.com/support/options/) promptly for assistance with recovery. You can [create and manage support requests](../azure-portal/supportability/how-to-create-azure-support-request.md) in the Azure portal. A storage account deleted within a subscription is retained for two weeks to allow for recovery from accidental deletion, after which it's permanently deleted. However, when a storage object (for example, blob, file, queue, table) is itself deleted, the delete operation is immediate and irreversible. Unless you made a backup, deleted storage objects can't be recovered. For Blob storage, you can implement extra protection against accidental or erroneous modifications or deletions by enabling [soft delete](../storage/blobs/soft-delete-blob-overview.md). When [soft delete is enabled](../storage/blobs/soft-delete-blob-enable.md) for a storage account, blobs, blob versions, and snapshots in that storage account may be recovered after they're deleted, within a retention period that you specified. To avoid retention of data after storage account or subscription deletion, you can delete storage objects individually before deleting the storage account or subscription.

For accidental deletion involving Azure SQL Database, you should check backups that the service makes automatically and use point-in-time restore. For example, full database backup is done weekly, and differential database backups are done hourly. Also, individual services (such as Azure DevOps) can have their own policies for [accidental data deletion](/azure/devops/organizations/security/data-protection#mistakes-happen).

### Data destruction
If a disk drive used for storage suffers a hardware failure, it's securely [erased or destroyed](https://www.microsoft.com/trust-center/privacy/data-management) before decommissioning. The data on the drive is erased to ensure that the data can't be recovered by any means. When such devices are decommissioned, Microsoft follows the [NIST SP 800-88 R1](https://csrc.nist.gov/publications/detail/sp/800-88/rev-1/final) disposal process with data classification aligned to FIPS 199 Moderate. Magnetic, electronic, or optical media are purged or destroyed in accordance with the requirements established in NIST SP 800-88 R1 where the terms are defined as follows:

- **Purge** – &#8220;a media sanitization process that protects the confidentiality of information against a laboratory attack&#8221;, which involves &#8220;resources and knowledge to use nonstandard systems to conduct data recovery attempts on media outside their normal operating environment&#8221; using &#8220;signal processing equipment and specially trained personnel.&#8221; Note: For hard disk drives (including ATA, SCSI, SATA, SAS, and so on) a firmware-level secure-erase command (single-pass) is acceptable, or a software-level three-pass overwrite and verification (ones, zeros, random) of the entire physical media including recovery areas, if any. For solid state disks (SSD), a firmware-level secure-erase command is necessary.
- **Destroy** – &#8220;a variety of methods, including disintegration, incineration, pulverizing, shredding, and melting&#8221; after which the media &#8220;can't be reused as originally intended.&#8221;

Purge and Destroy operations must be performed using tools and processes approved by Microsoft Security. Records must be kept of the erasure and destruction of assets. Devices that fail to complete the Purge successfully must be degaussed (for magnetic media only) or destroyed.

In addition to technical implementation details that enable Azure compute, networking, and storage isolation, Microsoft has invested heavily in security assurance processes and practices to correctly develop logically isolated services and systems, as described in the next section.

## Security assurance processes and practices
Azure isolation assurances are further enforced by Microsoft’s internal use of the [Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) (SDL) and other strong security assurance processes to protect attack surfaces and mitigate threats. Microsoft has established industry-leading processes and tooling that provides high confidence in the Azure isolation guarantee.

-	**Security Development Lifecycle (SDL)** – The Microsoft SDL introduces security and privacy considerations throughout all phases of the development process, helping developers build highly secure software, address security compliance requirements, and reduce development costs. The guidance, best practices, [tools](https://www.microsoft.com/securityengineering/sdl/resources), and processes in the Microsoft SDL are [practices](https://www.microsoft.com/securityengineering/sdl/practices) used internally to build all Azure services and create more secure products and services. This process is also publicly documented to share Microsoft’s learnings with the broader industry and incorporate industry feedback to create a stronger security development process.
- **Tooling and processes** – All Azure code is subject to an extensive set of both static and dynamic analysis tools that identify potential vulnerabilities, ineffective security patterns, memory corruption, user privilege issues, and other critical security problems.
  - *Purpose built fuzzing* – A testing technique used to find security vulnerabilities in software products and services. It consists of repeatedly feeding modified, or fuzzed, data to software inputs to trigger hangs, exceptions, and crashes, which are fault conditions that could be used by an attacker to disrupt or take control of applications and services. The Microsoft SDL recommends [fuzzing](https://www.microsoft.com/research/blog/a-brief-introduction-to-fuzzing-and-why-its-an-important-tool-for-developers/) all attack surfaces of a software product, especially those surfaces that expose a data parser to untrusted data.
  - *Live-site penetration testing* – Microsoft conducts [ongoing live-site penetration testing](https://download.microsoft.com/download/C/1/9/C1990DBA-502F-4C2A-848D-392B93D9B9C3/Microsoft_Enterprise_Cloud_Red_Teaming.pdf) to improve cloud security controls and processes, as part of the Red Teaming program described later in this section. Penetration testing is a security analysis of a software system performed by skilled security professionals simulating the actions of a hacker. The objective of a penetration test is to uncover potential vulnerabilities resulting from coding errors, system configuration faults, or other operational deployment weaknesses. The tests are conducted against Azure infrastructure and platforms and Microsoft’s own tenants, applications, and data. Your tenants, applications, and data hosted in Azure are never targeted; however, you can conduct [your own penetration testing](../security/fundamentals/pen-testing.md) of your applications deployed in Azure.
  -	*Threat modeling* – A core element of the Microsoft SDL. It’s an engineering technique used to help identify threats, attacks, vulnerabilities, and countermeasures that could affect applications and services. [Threat modeling](../security/develop/threat-modeling-tool-getting-started.md) is part of the Azure routine development lifecycle.
  -	*Automated build alerting of changes to attack surface area* – [Attack Surface Analyzer](https://github.com/microsoft/attacksurfaceanalyzer) is a Microsoft-developed open-source security tool that analyzes the attack surface of a target system and reports on potential security vulnerabilities introduced during the installation of software or system misconfiguration. The core feature of Attack Surface Analyzer is the ability to &#8220;diff&#8221; an operating system's security configuration, before and after a software component is installed. This feature is important because most installation processes require elevated privileges, and once granted, they can lead to unintended system configuration changes.
-	**Mandatory security training** – The Microsoft Azure security training and awareness program requires all personnel responsible for Azure development and operations to take essential training and any extra training based on individual job requirements. These procedures provide a standard approach, tools, and techniques used to implement and sustain the awareness program. Microsoft has implemented a security awareness program called STRIKE that provides monthly e-mail communication to all Azure engineering personnel about security awareness and allows employees to register for in-person or online security awareness training. STRIKE offers a series of security training events throughout the year plus STRIKE Central, which is a centralized online resource for security awareness, training, documentation, and community engagement.
-	**Bug Bounty Program** – Microsoft strongly believes that close partnership with academic and industry researchers drives a higher level of security assurance for you and your data. Security researchers play an integral role in the Azure ecosystem by discovering vulnerabilities missed in the software development process. The [Microsoft Bug Bounty Program](https://www.microsoft.com/msrc/bounty) is designed to supplement and encourage research in relevant technologies (for example, encryption, spoofing, hypervisor isolation, elevation of privileges, and so on) to better protect Azure’s infrastructure and your data. As an example, for each critical vulnerability identified in the Azure Hypervisor, Microsoft compensates security researchers up to $250,000 – a significant amount to incentivize participation and vulnerability disclosure. The bounty range for [vulnerability reports on Azure services](https://www.microsoft.com/msrc/bounty-microsoft-azure) is up to $60,000.
-	**Red Team activities** – Microsoft uses [Red Teaming](https://download.microsoft.com/download/C/1/9/C1990DBA-502F-4C2A-848D-392B93D9B9C3/Microsoft_Enterprise_Cloud_Red_Teaming.pdf), a form of live site penetration testing against Microsoft-managed infrastructure, services, and applications. Microsoft simulates real-world breaches, continuously monitors security, and practices security incident response to test and improve Azure security. Red Teaming is predicated on the Assume Breach security strategy and executed by two core groups: Red Team (attackers) and Blue Team (defenders). The approach is designed to test Azure systems and operations using the same tactics, techniques, and procedures as real adversaries against live production infrastructure, without the foreknowledge of the infrastructure and platform Engineering or Operations teams. This approach tests security detection and response capabilities, and helps identify production vulnerabilities, configuration errors, invalid assumptions, or other security issues in a controlled manner. Every Red Team breach is followed by full disclosure between the Red Team and Blue Team to identify gaps, address findings, and significantly improve breach response.

If you're accustomed to a traditional on-premises data center deployment, you would typically conduct a risk assessment to gauge your threat exposure and formulate mitigating measures when migrating to the cloud. In many of these instances, security considerations for traditional on-premises deployment tend to be well understood whereas the corresponding cloud options tend to be new. The next section is intended to help you with this comparison.

## Logical isolation considerations
A multi-tenant cloud platform implies that multiple customer applications and data are stored on the same physical hardware. Azure uses [logical isolation](../security/fundamentals/isolation-choices.md) to segregate your applications and data from other customers. This approach provides the scale and economic benefits of multi-tenant cloud services while rigorously helping enforce controls designed to keep other customers from accessing your data or applications. If you're migrating from traditional on-premises physically isolated infrastructure to the cloud, this section addresses concerns that may be of interest to you.

### Physical versus logical security considerations
Table 6 provides a summary of key security considerations for physically isolated on-premises deployments (bare metal) versus logically isolated cloud-based deployments (Azure). It’s useful to review these considerations prior to examining risks identified to be specific to shared cloud environments.

**Table 6.**  Key security considerations for physical versus logical isolation

|Security consideration|On-premises|Azure|
|---|---|---|
|**Firewalls, networking**|- Physical network enforcement (switches, and so on) </br>- Physical host-based firewall can be manipulated by compromised application </br>- two layers of enforcement|- Physical network enforcement (switches, and so on) </br>- Hyper-V host virtual network switch enforcement can't be changed from inside VM </br>- VM host-based firewall can be manipulated by compromised application </br>- three layers of enforcement|
|**Attack surface area**|- Large hardware attack surface exposed to complex workloads, enables firmware based advanced persistent threat (APT)|- Hardware not directly exposed to VM, no potential for APT to persist in firmware from VM </br>- Small software-based Hyper-V attack surface area with low historical bug counts exposed to VM|
|**Side channel attacks**|- Side channel attacks may be a factor, although reduced vs. shared hardware|- Side channel attacks assume control over VM placement across applications; may not be practical in large cloud service|
|**Patching**|- Varied effective patching policy applied across host systems </br>- Highly varied/fragile updating for hardware and firmware|- Uniform patching policy applied across host and VMs|
|**Security analytics**|- Security analytics dependent on host-based security solutions, which assume host/security software hasn't been compromised|- Outside VM (hypervisor based) forensics/snapshot capability allows assessment of potentially compromised workloads|
|**Security policy**|- Security policy verification (patch scanning, vulnerability scanning, and so on) subject to tampering by compromised host </br>- Inconsistent security policy applied across customer entities|- Outside VM verification of security policies </br>- Possible to enforce uniform security policies across customer entities|
|**Logging and monitoring**|- Varied logging and security analytics solutions|- Common Azure platform logging and security analytics solutions </br>- Most existing on-premises / varied logging and security analytics solutions also work|
|**Malicious insider**|- Persistent threat caused by system admins having elevated access rights typically for duration of employment|- Greatly reduced threat because admins have no default access rights|

Listed below are key risks that are unique to shared cloud environments that may need to be addressed when accommodating sensitive data and workloads.

### Exploitation of vulnerabilities in virtualization technologies
Compared to traditional on-premises hosted systems, Azure provides a greatly **reduced attack surface** by using a locked-down Windows Server core for the Host OS layered over the Hypervisor. Moreover, by default, guest PaaS VMs don't have any user accounts to accept incoming remote connections and the default Windows administrator account is disabled. Your software in PaaS VMs is restricted by default to running under a low-privilege account, which helps protect your service from attacks by its own end users. You can modify these permissions, and you can also choose to configure your VMs to allow remote administrative access.

PaaS VMs offer more advanced **protection against persistent malware** infections than traditional physical server solutions, which if compromised by an attacker can be difficult to clean, even after the vulnerability is corrected. The attacker may have left behind modifications to the system that allow re-entry, and it's a challenge to find all such changes. In the extreme case, the system must be reimaged from scratch with all software reinstalled, sometimes resulting in the loss of application data. With PaaS VMs, reimaging is a routine part of operations, and it can help clean out intrusions that haven't even been detected. This approach makes it more difficult for a compromise to persist.

#### Side channel attacks
Microsoft has been at the forefront of mitigating **speculative execution side channel attacks** that exploit hardware vulnerabilities in modern processors that use hyper-threading. In many ways, these issues are similar to the Spectre (variant 2) side channel attack, which was disclosed in 2018. Multiple new speculative execution side channel issues were disclosed by both Intel and AMD in 2022. To address these vulnerabilities, Microsoft has developed and optimized Hyper-V **[HyperClear](/virtualization/community/team-blog/2018/20180814-hyper-v-hyperclear-mitigation-for-l1-terminal-fault)**, a comprehensive and high performing side channel vulnerability mitigation architecture. HyperClear relies on three main components to ensure strong inter-VM isolation:

- **Core scheduler** to avoid sharing of a CPU core’s private buffers and other resources.
- **Virtual-processor address space isolation** to avoid speculative access to another virtual machine’s memory or another virtual CPU core’s private state.
- **Sensitive data scrubbing** to avoid leaving private data anywhere in hypervisor memory other than within a virtual processor’s private address space so that this data can't be speculatively accessed in the future.

These protections have been deployed to Azure and are available in Windows Server 2016 and later supported releases.

> [!NOTE]
> The Hyper-V HyperClear architecture has proven to be a readily extensible design that helps provide strong isolation boundaries against a variety of speculative execution side channel attacks with negligible impact on performance.

When VMs belonging to different customers are running on the same physical server, it's the Hypervisor’s job to ensure that they can't learn anything important about what the other customer’s VMs are doing. Azure helps block unauthorized direct communication by design; however, there are subtle effects where one customer might be able to characterize the work being done by another customer. The most important of these effects are timing effects when different VMs are competing for the same resources. By carefully comparing operations counts on CPUs with elapsed time, a VM can learn something about what other VMs on the same server are doing. These exploits have received plenty of attention in the academic press where researchers have been seeking to learn more specific information about what's going on in a peer VM.

Of particular interest are efforts to learn the **cryptographic keys of a peer VM** by measuring the timing of certain memory accesses and inferring which cache lines the victim’s VM is reading and updating. Under controlled conditions with VMs using hyper-threading, successful attacks have been demonstrated against commercially available implementations of cryptographic algorithms. In addition to the previously mentioned Hyper-V HyperClear mitigation architecture that's in use by Azure, there are several extra mitigations in Azure that reduce the risk of such an attack:

- The standard Azure cryptographic libraries have been designed to resist such attacks by not having cache access patterns depend on the cryptographic keys being used.
- Azure uses an advanced VM host placement algorithm that is highly sophisticated and nearly impossible to predict, which helps reduce the chances of adversary-controlled VM being placed on the same host as the target VM.
- All Azure servers have at least eight physical cores and some have many more. Increasing the number of cores that share the load placed by various VMs adds noise to an already weak signal.
- You can provision VMs on hardware dedicated to a single customer by using [Azure Dedicated Host](../virtual-machines/dedicated-hosts.md) or [Isolated VMs](../virtual-machines/isolation.md), as described in *[Physical isolation](#physical-isolation)* section. However, physical tenant isolation increases deployment cost and may not be required in most scenarios given the strong logical isolation assurances provided by Azure.

Overall, PaaS – or any workload that autocreates VMs – contributes to churn in VM placement that leads to randomized VM allocation. Random placement of your VMs makes it much harder for attackers to get on the same host. In addition, host access is hardened with greatly reduced attack surface that makes these types of exploits difficult to sustain.

## Summary
A multi-tenant cloud platform implies that multiple customer applications and data are stored on the same physical hardware. Azure uses logical isolation to segregate your applications and data from other customers. This approach provides the scale and economic benefits of multi-tenant cloud services while rigorously helping prevent other customers from accessing your data or applications.

Azure addresses the perceived risk of resource sharing by providing a trustworthy foundation for assuring multi-tenant, cryptographically certain, logically isolated cloud services using a common set of principles:

- User access controls with authentication and identity separation that uses Microsoft Entra ID and Azure role-based access control (Azure RBAC).
- Compute isolation for processing, including both logical and physical compute isolation.
- Networking isolation including separation of network traffic and data encryption in transit.
- Storage isolation with data encryption at rest using advanced algorithms with multiple ciphers and encryption keys and provisions for customer-managed keys (CMK) under your control in Azure Key Vault.
- Security assurance processes embedded in service design to correctly develop logically isolated services, including Security Development Lifecycle (SDL) and other strong security assurance processes to protect attack surfaces and mitigate risks.

In line with the shared responsibility model in cloud computing, this article provides you with guidance for activities that are part of your responsibility. It also explores design principles and technologies available in Azure to help you achieve your secure isolation objectives.

## Next steps
Learn more about:

- [Azure security fundamentals documentation](../security/fundamentals/index.yml)
- [Azure infrastructure security](../security/fundamentals/infrastructure.md)
- [Azure platform integrity and security](../security/fundamentals/platform.md)
- [Azure Government overview](./documentation-government-welcome.md)
- [Azure Government security](./documentation-government-plan-security.md)
- [Azure Government compliance](./documentation-government-plan-compliance.md)
- [Azure and other Microsoft services compliance offerings](/azure/compliance/offerings/)
