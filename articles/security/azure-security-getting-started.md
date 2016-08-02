<properties
   pageTitle="Getting started with Microsoft Azure security | Microsoft Azure"
   description="This article provides an overview of Microsoft Azure Security capabilities and general considerations for organizations that are migrating their assets to a cloud provider."
   services="security"
   documentationCenter="na"
   authors="YuriDio"
   manager="swadhwa"
   editor="TomSh"/>

<tags
   ms.service="security"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/19/2016"
   ms.author="yuridio"/>

#Getting started with Microsoft Azure security

When you build or migrate IT assets to a cloud provider, you are relying on that organization’s abilities to protect the applications and data you entrust to their services and the security controls they provide you to control the security of your cloud-based assets.

Azure’s infrastructure is designed from the facility to applications for hosting millions of customers simultaneously, and providing a trustworthy foundation upon which businesses’ can meet their security needs. In addition, Azure provides you with a wide array of configurable security options and the ability to control them so that you can customize security to meet the unique requirements for your deployments.

In this overview article on Azure security, we’ll look at:

-   Azure services and features you can use to help secure your services and data within Azure

-   How Microsoft secures the Azure infrastructure to help protect your data and applications

##Identity and access management


Controlling access to IT infrastructure, data, and applications is critical. In Microsoft Azure, these capabilities are delivered by services such as Azure Active Directory, Azure Storage, and support for numerous standards and APIs.

[Azure Active Directory](../active-directory/active-directory-whatis.md) (Azure AD) is an identity repository and engine that provides authentication, authorization, and access control for an organization's users, groups, and objects. Azure AD also offers developers an effective way to integrate identity management in their applications. Industry standard protocols such as [SAML 2.0](https://en.wikipedia.org/wiki/SAML_2.0), [WS-Federation](https://msdn.microsoft.com/library/bb498017.aspx), and [OpenID Connect](http://openid.net/connect/) makes sign-in possible on a variety of platforms such as .NET, Java, Node.js, and PHP.

The REST-based Graph API enables developers to read and write to the directory from any platform. Through support for [OAuth 2.0](http://oauth.net/2/), developers can build mobile and web applications that integrate with Microsoft and third party web APIs, and build their own secure web APIs. Open source client libraries are available for .Net, Windows Store, iOS and Android with additional libraries under development.

### How Azure enables identity and access management

Azure AD can be used as a standalone cloud directory for your organization or as an integrated solution with your existing on-premises Active Directory. Some integration features include directory sync and single sign-on (SSO). These extend the reach of your existing on-premises identities into the cloud and improve the admin and end user experience.

Some other capabilities for identity and access management include:

-   Azure AD enables [SSO](https://azure.microsoft.com/documentation/videos/overview-of-single-sign-on/) to SaaS applications, regardless of where they are hosted. Some applications are federated with Azure AD, and others use password SSO. Federated applications can also support user provisioning and password vaulting.

-   Access to data in [Azure Storage](https://azure.microsoft.com/services/storage/) is controlled via authentication. Each Storage Account has a primary key ([Storage Account Key](https://msdn.microsoft.com/library/azure/ee460785.aspx), or SAK) and secondary secret key (the Shared Access Signature or SAS).

-   Azure AD provides Identity as a Service through federation (using [Active Directory Federation Services](../active-directory/fundamentals-identity.md), synchronization, and replication with on-premises directories.

-   [Azure Multi-Factor Authentication (MFA)](../multi-factor-authentication/multi-factor-authentication.md) is the multi-factor authentication service that requires users to also verify sign-ins using a mobile app, phone call or text message. It is available to use with Azure AD, to secure on-premises resources with the Azure MFA Server, and with custom applications and directories using the SDK.

-   [Azure AD Domain Services](https://azure.microsoft.com/services/active-directory-ds/) lets you join Azure virtual machines to a domain without the need to deploy domain controllers. Users can sign in to these virtual machines using their corporate Active Directory credentials and administer domain-joined virtual machines using Group Policy to enforce security baselines on all of your Azure virtual machines.

-   [Azure Active Directory B2C](https://azure.microsoft.com/services/active-directory-b2c/) provides you a highly available, global, identity management service for consumer-facing applications that scales to hundreds of millions of identities. It can be integrated across mobile and web platforms. Your consumers can log on to all your applications through customizable experiences by using their existing social accounts or by creating new credentials.

##Data access control and encryption

Microsoft employs the principles of Separation of Duties and [Least Privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege) throughout Azure operations. Access to data by Azure support personnel requires your explicit permission and is granted on a “just-in-time” basis that is logged and audited, then revoked after completion of the engagement.

In addition, Azure provides multiple capabilities for protecting data in-transit and at-rest, including encryption for data, files, applications, services, communications, and drives. You have the option to encrypt information before placing it in Azure, as well as storing keys in your on-premises datacenters.

![Microsoft Antimalware in Azure](./media/azure-security-getting-started/sec-azgsfig1.PNG)

### Azure encryption technologies

You can gather details on administrative access to your subscription environment by using [Azure AD Reporting](../active-directory/active-directory-reporting-audit-events.md). You have the option to configure [BitLocker Drive Encryption](https://technet.microsoft.com/library/cc732774.aspx) on VHDs containing sensitive information in Azure.

Other capabilities in Azure that will assist you to keep your data secure include:

-   Application developers can build encryption into the applications they deploy in Azure using the Windows [CryptoAPI](https://msdn.microsoft.com/library/ms867086.aspx) and .NET Framework.

- Client side encryption for Microsoft blob storage enable you to completely control the keys.  The storage service never sees the keys and is incapable of decrypting the data.

-   [Azure RMS](https://technet.microsoft.com/library/jj585026.aspx) (with the [RMS SDK](https://msdn.microsoft.com/library/dn758244.aspx) provides file and data-level encryption and data leak prevention through policy-based access management.

-   Azure supports [table-level and column-level encryption (TDE/CLE)](http://blogs.msdn.com/b/sqlsecurity/archive/2015/05/12/recommendations-for-using-cell-level-encryption-in-azure-sql-database.aspx) in SQL Server Virtual Machines, and supports third-party on-premises key management servers in customers’ datacenters.

-   Storage Account Keys, Shared Access Signatures, management certificates, and other keys are unique to each Azure tenant.

-   Azure [StorSimple](http://www.microsoft.com/server-cloud/products/storsimple/overview.aspx) hybrid storage encrypts data via a 128-bit public / private key pair prior to uploading it to Azure Storage.

-   Azure supports and uses numerous encryption mechanisms, including SSL/TLS, IPsec, and AES, depending on the data types and containers and transports.

##Virtualization

The Azure platform uses a virtualized environment. User instances operate as standalone virtual machines that do not have access to a physical host server and this isolation is enforced using physical [processor (ring-0/ring-3) privilege levels](https://en.wikipedia.org/wiki/Protection_ring).

Ring 0 is the most privileged and 3 is the least. The guest OS runs in a lesser-privileged Ring 1 and applications in the last privileged Ring 3. This virtualization of physical resources leads to a clear separation between guest OS and hypervisor, resulting in additional security separation between the two.

Azure’s Hypervisor acts like a micro-kernel and passes all hardware access requests from guest VMs to the host for processing using a shared-memory interface called VMBus. This prevents users from obtaining raw read/write/execute access to the system and mitigates the risk of sharing system resources.

![Microsoft Antimalware in Azure](./media/azure-security-getting-started/sec-azgsfig2.PNG)

### How Azure implements virtualization

Azure uses a hypervisor firewall (packet filter), which is implemented in the hypervisor and configured by a fabric controller agent. This helps protect tenants from unauthorized access. By default, when a VM is created, all traffic is blocked and then the fabric controller agent configures the packet filter to add *rules and exceptions* to allow authorized traffic.

There are two categories of rules that are programmed here:

-   **Machine Configuration or Infrastructure Rules**: By default, all communication is blocked. There are exceptions to allow a VM to send and receive DHCP and DNS traffic. VMs can also send traffic to the “public” internet and send traffic to other VMs within the cluster and OS Activation server. The VMs’ allowed list of outgoing destinations does not include Azure router subnets, Azure management back end, and other Microsoft properties.

-   **Role Configuration File**: This defines the inbound ACLs based on the tenants’ service model. For example, if a tenant has a Web front-end on port 80 on a certain VM, then Azure opens TCP port 80 to all IPs if you’re configuring an endpoint in the [Azure Service Management](../resource-manager-deployment-model.md) model. If the VM has a backend or worker role running, then we open the worker role only to the VM within the same tenant.

##Isolation

Maintaining separation to prevent unauthorized and unintentional transfer of information between deployments in a shared multi-tenant architecture is another important cloud security requirement.

Azure implements [network access control](https://azure.microsoft.com/blog/network-isolation-options-for-machines-in-windows-azure-virtual-networks/) and segregation through VLAN isolation, ACLs, load balancers and IP filters. External traffic inbound to your virtual machine(s) is restricted to ports and protocols you define. Network filtering is implemented to prevent spoofed traffic and restricts incoming and outgoing traffic to trusted platform components. Traffic flow policies are implemented on boundary protection devices that deny traffic by default.

![Microsoft Antimalware in Azure](./media/azure-security-getting-started/sec-azgsfig3.PNG)

Network Address Translation (NAT) is used to separate internal network traffic from external traffic. Internal traffic is not externally routable. [Virtual IP addresses](http://blogs.msdn.com/b/cloud_solution_architect/archive/2014/11/08/vips-dips-and-pips-in-microsoft-azure.aspx) that are externally routable are translated into [internal Dynamic IP](http://blogs.msdn.com/b/cloud_solution_architect/archive/2014/11/08/vips-dips-and-pips-in-microsoft-azure.aspx) addresses that are only routable within Azure.

External traffic to Azure virtual machines is firewalled via Access Control Lists (ACLs) on routers, load balancers, and Layer 3 switches. Only specific known protocols are permitted. ACLs are in place to limit traffic originating from guest VMs to other VLANs used for management. In addition, traffic filtered via IP filters on the host OS, further limit the traffic on both data link and network layers.

### How Azure implements isolation

The Azure Fabric Controller is responsible for allocating infrastructure resources to tenant workloads, and manages unidirectional communications from the host to VMs. The Azure hypervisor enforces memory and process separation between VMs, and securely routes network traffic to guest OS tenants. Azure also implements isolation for tenants, storage and virtual networks:

-   Each Azure AD tenant is logically isolated using security boundaries.

-   Azure Storage Accounts are unique to each subscription, and access must be authenticated using a Storage Account Key.

-   Virtual Networks are logically isolated through a combination of unique private IP addresses, firewalls, and IP ACLs. Load balancers route traffic to the appropriate tenants based on endpoint definitions.

##Virtual Network and firewall

The [distributed and virtual networks](http://download.microsoft.com/download/4/3/9/43902EC9-410E-4875-8800-0788BE146A3D/Windows%20Azure%20Network%20Security%20Whitepaper%20-%20FINAL.docx) in Azure help ensure that your private network traffic is logically isolated from traffic on other Azure Virtual Networks.

![Microsoft Antimalware in Azure](./media/azure-security-getting-started/sec-azgsfig4.PNG)

Your subscription can contain multiple isolated private networks (and include firewall, load-balancing, and network address translation).

Azure provides three primary levels of network segregation in each Azure cluster to logically segregate traffic. [Virtual Local Area Networks](https://azure.microsoft.com/services/virtual-network/) (VLANs) are used to separate customer traffic from the rest of the Azure network. Access to the Azure network from outside the cluster is restricted through load balancers.

Network traffic to and from VMs must pass through the hypervisor virtual switch. The IP filter component in the Root OS isolates the root VM from the guest VMs and the guest VMs from one another. It performs filtering of traffic to restrict communication between tenant's nodes and the public Internet (based on customer's service configuration), segregating them from other tenants.

The IP filter helps prevent guest VMs from:

- Generating spoofed traffic

- Receiving traffic not addressed to them

- Directing traffic to protected infrastructure endpoints

- Sending or receiving inappropriate broadcast traffic

You can place your virtual machines onto [Azure Virtual Networks](https://azure.microsoft.com/documentation/services/virtual-network/). These virtual networks are similar to the networks you configure in on-premises environments, where they are typically associated with a virtual switch. Virtual machines connected to the same Azure Virtual Network can communicate with one another without additional configuration. You also have the option to configure different subnets within your Azure Virtual Network.

You can use the following Azure Virtual Network technologies to help secure communications on your Azure Virtual Network:

-   [**Network Security Groups (NSG)**](../virtual-network/virtual-networks-nsg.md). You can use an NSG to control traffic to one or more virtual machine (VM) instances in your virtual network. An NSG contains access control rules that allow or deny traffic based on traffic direction, protocol, source address and port, and destination address and port.

-   [**User Defined Routing**](../virtual-network/virtual-networks-udr-overview.md). You can control the routing of packets through a virtual appliance by creating user defined routes that specify the next hop for packets flowing to a specific subnet to go a your virtual network security appliance.

-   [**IP forwarding**](../virtual-network/virtual-networks-udr-overview.md). A virtual network security appliance must be able to receive incoming traffic that is not addressed to itself. To allow a VM to receive traffic addressed to other destinations, you enable IP Forwarding for the VM.

-   [**Forced tunneling**](../vpn-gateway/vpn-gateway-about-forced-tunneling.md). Forced tunneling lets you redirect or "force" all Internet-bound traffic generated by your virtual machines in an Azure Virtual back to your on-premises location via a site-to-site VPN tunnel for inspection and auditing

-   [**Endpoint** ACLs](../virtual-machines/virtual-machines-windows-classic-setup-endpoints.md). You can control which machines are allowed inbound connections from the Internet to a virtual machine on your Azure Virtual Network by defining endpoint ACLs.

-   [**Partner network security solutions**](https://azure.microsoft.com/marketplace/). There are a number of partner network security solution that you can access from the Azure Marketplace.

### How Azure implements virtual networks and firewall

Azure implements packet-filtering firewalls on all host and guest VMs by default. Windows OS images from the Azure Gallery also have Windows Firewall enabled by default. Load balancers at the perimeter of Azure’s public facing networks control communications based on IP ACLs managed by customer administrators.

If Azure moves a customer’s data as part of normal operations or during a disaster, it does so over private, encrypted communications channels. Other capabilities leveraged by Azure to use in virtual networks and firewall are:

-   **Native Host Firewall**: Azure fabric and storage run on a native OS which has no hypervisor and hence the windows firewall is configured with the above two sets of rules. Storage runs native to optimize performance.

-   **Host Firewall**: The host firewall is to protect the host operating system which runs the hypervisor. The rules are programmed to allow only the fabric controller and jump boxes to talk to the host OS on a specific port. The other exceptions are to allow DHCP response and DNS Replies. Azure uses a machine configuration file which it has the template of firewall rules for the host OS. The host itself is protected from external attack by a Windows firewall configured to only permit communication from known, authenticated sources.

-   **Guest Firewall**: Replicates the rules in the VM Switch packet filter but programmed in different software (i.e. the Windows Firewall piece of the guest OS). The guest VM firewall can be configured to restrict communications to or from the guest VM, even if the communication is permitted by configurations at the host IP Filter. For example, you may choose to use the guest VM firewall to restrict communication between two of your VNets that have been configured to connect to one another.

-   **Storage Firewall (FW)**: The firewall on the storage front-end filters traffic to be only on ports 80/443 and other necessary utility ports. The firewall on the storage back-end restricts communications to only come from storage front-end servers.

-   **Virtual Network Gateway**: [Azure Virtual Network Gateways](../vpn-gateway/virtual-networks-configure-vnet-to-vnet-connection.md) serve as the cross premises gateways connecting your workloads in Azure Virtual Network to your on premises sites. It is required to connect to on premises sites through [IPsec site-to-site VPN tunnels](../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md), or through [ExpressRoute](../expressroute/expressroute-introduction.md) circuits. For IPsec/IKE VPN tunnels, the gateways perform IKE handshakes, and establish the IPsec S2S VPN tunnels between the Virtual Networks and on premises sites. Virtual Network Gateways also terminate [point-to-site VPNs](../vpn-gateway/vpn-gateway-point-to-site-create.md).

##Secure Remote Access

Data stored in the cloud must have sufficient safeguards enabled to prevent exploits and maintain confidentiality and integrity while in-transit. This includes network controls that tie in with an organization’s policy-based, auditable identity and access management mechanisms.

Built-in cryptographic technology enables you to encrypt communications within and between deployments, between Azure regions, and from Azure to on-premises datacenters. Administrator access to virtual machines through [remote desktop sessions](../virtual-machines/virtual-machines-windows-classic-connect-logon.md), [remote Windows PowerShell](http://blogs.technet.com/b/heyscriptingguy/archive/2013/09/07/weekend-scripter-remoting-the-cloud-with-windows-azure-and-powershell.aspx), and the Azure Management Portal is always encrypted.

To securely extend your on-premises datacenter to the cloud, Azure provides both [site-to-site VPN](../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md) and [point-to-site VPN](../vpn-gateway/vpn-gateway-point-to-site-create.md), as well as dedicated links with [ExpressRoute](../expressroute/expressroute-introduction.md) (connections to Azure Virtual Networks over VPN are encrypted).

### How Azure implements secure remote access

Connections to Azure Portal must always be authenticated and they require SSL/TLS. You can configure management certificates to enable secure management. Industry standard secure protocols such as [SSTP](https://technet.microsoft.com/magazine/2007.06.cableguy.aspx) and [IPsec](https://en.wikipedia.org/wiki/IPsec) are fully supported.

[Azure ExpressRoute](../expressroute/expressroute-introduction.md) lets you create private connections between Azure datacenters and infrastructure that’s on your premises or in a co-location environment. ExpressRoute connections do not go over the public Internet. They offer more reliability, faster speeds, lower latencies and higher security than typical Internet-based links. In some cases, using ExpressRoute connections to transfer data between on-premises and Azure can also yield significant cost benefits.

##Logging and monitoring

Azure provides authenticated logging of security-relevant events that generate an audit trail, and is engineered to be resistant to tampering. This includes system information, such as security event logs in Azure infrastructure VMs and Azure AD. Security event monitoring includes collecting events such as changes in DHCP or DNS server IP addresses, attempted access to ports, protocols or IP addresses that are blocked by design, changes in security policy or firewall settings, account or group creation, unexpected processes or driver installation.

![Microsoft Antimalware in Azure](./media/azure-security-getting-started/sec-azgsfig5.PNG)

Audit logs recording privileged user access and activities, authorized and unauthorized access attempts, system exceptions, and information security events are retained for a set period of time. The retention of your logs is at your discretion because you configure log collection and retention to your own requirements.

### How Azure implements logging and monitoring

Azure deploys Management Agents (MA) and Azure Security Monitor (ASM) agents to each compute, storage, or fabric node under management whether they are native or virtual. Each Management Agent is configured to authenticate to a service team storage account with a certificate obtained from the Azure certificate store and forward pre-configured diagnostic and event data to the storage account. These agents are not deployed to customers’ virtual machines.

Azure administrators access logs through a web portal for authenticated and controlled access to the logs. An administrator can parse, filter, correlate, and analyze logs. The Azure service team storage accounts for logs are protected from direct administrator access to help prevent against log tampering.

Microsoft collects logs from network devices using the Syslog protocol and from host servers using Microsoft Audit Collection Services (ACS). These logs are placed into a log database from which alerts are generated for suspicious events directly to a Microsoft administrator. The administrator can access and analyze these logs.

[Azure Diagnostics](https://msdn.microsoft.com/library/azure/gg433048.aspx) is a feature of Azure that enables you to collect diagnostic data from an application running in Azure. This is diagnostic data for debugging and troubleshooting, measuring performance, monitoring resource usage, traffic analysis, and capacity planning, and auditing. After the diagnostic data is collected, it can be transferred to an Azure storage account for persistence. Transfers can either be scheduled or on-demand.

##Threat Mitigation

In addition to isolation, encryption, and filtering, Azure employs a number of threat mitigation mechanisms and processes to protect infrastructure and services. These include internal controls and technologies used to detect and remediate advanced threats such as DDoS, privilege escalation, and the [OWASP Top-10](https://www.owasp.org/index.php/Category:OWASP_Top_Ten_Project).

The security controls and risk management processes Microsoft has in place to secure its cloud infrastructure reduce the risk of security incidents. But, in the event an incident occurs, the Security Incident Management (SIM) team within the Microsoft Online Security Services & Compliance (OSSC) team is ready 24 x 7 to respond.

### How Azure implements threat mitigation

Azure has security controls in place to implement threat mitigation and also to assist customers mitigate potential threats in their environments. The list below summarizes the threat mitigation capabilities offered by Azure:

-   [Azure Anti-Malware](../security/azure-security-antimalware.md) is enabled by default on all infrastructure servers. You can optionally enable it within your own VMs.

-   Microsoft maintains continuous monitoring across servers, networks, and applications to detect threats and prevent exploits. Automated alerts notify administrators of anomalous behaviors, allowing them to take corrective action on both internal and external threats.

-   You have the option to deploy 3rd-party security solutions within your subscriptions, such as web application firewalls from [Barracuda](https://techlib.barracuda.com/ng54/deployonazure).

-   Microsoft’s approach to penetration-testing includes “[Red-Teaming](http://download.microsoft.com/download/C/1/9/C1990DBA-502F-4C2A-848D-392B93D9B9C3/Microsoft_Enterprise_Cloud_Red_Teaming.pdf)”, which involves Microsoft security professionals attacking (non-customer) live production systems in Azure to test defenses against real-world, advanced persistent threats.

-   Integrated deployment systems manage the distribution and installation of security patches across the Azure platform.

##Next Steps

[Azure Trust Center](https://azure.microsoft.com/support/trust-center/)

[Azure Security Team Blog](http://blogs.msdn.com/b/azuresecurity/)

[Microsoft Security Response Center](https://technet.microsoft.com/library/dn440717.aspx)

[Active Directory Blog](http://blogs.technet.com/b/ad/)
