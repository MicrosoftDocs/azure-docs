<properties
   pageTitle="Implementing Active Directory Federation Services (ADFS) in Azure | Microsoft Azure"
   description="How to implement a secure hybrid network architecture with Active Directory Federation Service authorization in Azure."
   services="guidance,vpn-gateway,expressroute,load-balancer,virtual-network,active-directory"
   documentationCenter="na"
   authors="telmosampaio"
   manager="christb"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="10/31/2016"
   ms.author="telmos"/>

# Implementing Active Directory Federation Services (ADFS) in Azure

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for implementing a secure hybrid network that extends your on-premises network to Azure. The secure hybrid network uses [Active Directory Federation Services (ADFS)][active-directory-federation-services] to perform federated authentication and authorization for components running in the cloud. This architecture extends the implementation described in [Extending Active Directory to Azure][implementing-active-directory].

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.

ADFS can be hosted on-premises, but if your application is a hybrid in which some parts are implemented in Azure it may be more efficient to replicate ADFS in the cloud. Typical use cases for this architecture include:

- Hybrid applications where workloads run partly on-premises and partly in Azure.

- Solutions that utilize federated authorization to expose web applications to partner organizations.

- Systems that support access from web browsers running outside of the organizational firewall.

- Systems that enable users to access to web applications by connecting from authorized external devices such as remote computers, notebooks, and other mobile devices. 

For more information ADFS, see [Active Directory Federation Services Overview][active-directory-federation-services-overview]. Additionally, the article [ADFS deployment in Azure][adfs-intro] contains a detailed step-by-step introduction to implementing ADFS in Azure.

## Architecture diagram

The following diagram demonstrates the reference architecture discussed in this document. This document focuses on the scenario of implementing a secure hybrid network using ADFS for federated authentication. For more information about the other elements in the diagram not related to ADFS, see [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture], [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access], and [Implementing a secure hybrid network architecture with Active Directory identities in Azure][implementing-active-directory].

> A Visio document that includes this architecture diagram is available for download at the [Microsoft download center][visio-download]. This diagram is on the "Identity - ADFS" page.

[![0]][0]

>[AZURE.NOTE] This diagram depicts the following use cases:
>
>- Application code from a partner organization accesses a web application hosted inside your Azure VNet.
>
>- An external, registered user with credentials stored inside ADDS accesses a web application hosted inside your Azure VNet.
>
>- A user connected to your VNet using an authorized device executes a web application hosted inside your Azure VNet.
>
>Additionally, this reference architecture focuses on passive federation in which the federation servers decide how and when to authenticate a user. The user is expected to provide sign in information when the application is started. This mechanism is most commonly used by web browsers and involves a protocol that redirects the browser to a site where the user authenticates. ADFS also supports active federation whereby an application takes on responsibility for supplying credentials without further user interaction, but this case is outside the scope of this architecture.

- **ADDS subnet.** The ADDS servers are contained within their own subnet with NSG rules acting as a firewall.

- **ADDS Servers.** These are domain controllers running as VMs in the cloud. These servers provide authentication of local identities within the domain.

- **ADFS subnet.** The ADFS servers are located within their own subnet with NSG rules acting as a firewall.

- **ADFS servers.** The ADFS servers provide federated authorization and authentication. In this architecture, they perform the following tasks:

    - Receiving security tokens containing claims made by a partner federation server on behalf of a partner user. ADFS verifies that the tokens are valid before passing the claims to the corporate web application running in Azure to authorize requests. In this scenario, the corporate web application is the *relying party*, and it is the responsibility of the partner federation server to issue claims that are understood by the corporate web application. The partner federation servers are referred to as *account partners* because they submit access requests on behalf of authenticated accounts in the partner organization. The ADFS servers are called *resource partners* because they provide access to resources (web applications, in this case).

    - Authenticating and authorizing incoming requests from external users running a web browser or device that needs access to your corporate web applications using ADDS and the [Active Directory Device Registration Service][ADDRS]).

    The ADFS servers are configured as a farm accessed through an Azure load balancer. This implementation improves availability and scalability. Note that the ADFS servers are not exposed directly to the Internet. All Internet traffic is filtered through ADFS web application proxy servers and a DMZ.

- **ADFS proxy subnet.** The ADFS proxy servers can be contained within their own subnet, with NSG rules providing protection. The servers in this subnet are exposed to the Internet through a set of network virtual appliances that provide a firewall between your Azure virtual network and the Internet.

- **ADFS web application proxy (WAP) servers.** These computers act as ADFS servers for incoming requests from partner organizations and external devices. The WAP servers act as a filter, shielding the ADFS servers from direct access from the public Internet. As with the ADFS servers, deploying the WAP servers in a farm with load balancing gives you greater availability and scalability than deploying a collection of stand-alone servers.

	>[AZURE.NOTE] For detailed information about installing WAP servers, see [Install and Configure the Web Application Proxy Server][install_and_configure_the_web_application_proxy_server]

- **Partner organization.** This is an example partner organization, which runs a web application that requests access to the web application running in Azure. The federation server at the partner organization authenticates requests locally, and submits security tokens containing claims to ADFS running in Azure. ADFS in Azure validates the security tokens, and if they are valid it can pass the claims to the web application running in Azure to authorize them.

	>[AZURE.NOTE] You can also configure a VPN tunnel using Azure Gateway to provide direct access to ADFS for trusted partners. Requests received from these partners do not pass through the WAP servers.

## Recommendations

Azure offers many different resources and resource types, so this reference architecture can be provisioned many different ways. We have provided an Azure Resource Manager template to install the reference architecture that follows these recommendations. If you choose to create your own reference architecture follow these recommendations unless you have a specific requirement that a recommendation does not fit.

### VM recommendations

Create VMs with sufficient resources to handle the expected volume of traffic. Use the size of the existing machines hosting ADFS on premises as a starting point. Monitor the resource utilization. You can resize the VMs and scale down if they are too large.

Follow the recommendations listed in [Running a Windows VM on Azure][vm-recommendations].

### Networking recommendations

Configure the network interface for each of the VMs hosting ADFS and WAP servers with static private IP addresses.

Do not give the ADFS VMs public IP addresses. For more information, see [Security considerations][security-considerations].

Set the IP address of the preferred and secondary DNS servers for the network interfaces for each ADFS and WAP VM to reference the ADDS VMs. The ADDS VMS should be running DNS. This step is necessary to enable each VM to join the domain.

### Availability recommendations

Create an ADFS farm with at least two servers to increase availability of the ADFS service.

Use different storage accounts for each ADFS VM in the farm. This approach helps to ensure that a failure in a single storage account does not make the entire farm inaccessible.

Create separate Azure availability sets for the ADFS and WAP VMs. Ensure that there are at least two VMs in each set. Each availability set must have at least two update domains and two fault domains.

Configure the load balancers for the ADFS VMs and WAP VMs as follows:

- Use an Azure load balancer to provide external access to the WAP VMs, and an internal load balancer to distribute the load across the ADFS servers in the ADFS farm.

- Only pass traffic appearing on port 443 (HTTPS) to the ADFS/WAP servers.

- Give the load balancer a static IP address.

- Create a health probe using the TCP protocol rather than HTTPS. You can ping port 443 to verify that an ADFS server is functioning.

    >[AZURE.NOTE] ADFS servers use the Server Name Indication (SNI) protocol, so attempting to probe using an HTTPS endpoint from the load balancer fails.

- Add a DNS *A* record to the domain for the ADFS load balancer. Specify the IP address of the load balancer, and give it a name in the domain (such as adfs.contoso.com). This is the name clients and the WAP servers use to access the ADFS server farm.

### Security recommendations

Prevent direct exposure of the ADFS servers to the Internet. ADFS servers are domain-joined computers that have full authorization to grant security tokens. If an ADFS server is compromised, a malicious user can issue full access tokens to all web applications and to all federation servers that are protected by ADFS. If your system must handle requests from external users not connecting from trusted partner sites, use WAP servers to handle these requests. For more information, see [Where to Place a Federation Server Proxy][where-to-place-an-fs-proxy].

Place ADFS servers and WAP servers in separate subnets with their own firewalls. You can use NSG rules to define firewall rules. If you require more comprehensive protection you can implement an additional security perimeter around servers by using a pair of subnets and NVAs, as described by the document [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access]. Note that all firewalls should allow traffic on port 443 (HTTPS).

Restrict direct sign in access to the ADFS and WAP servers. Only DevOps staff should be able to connect.

Do not join the WAP servers to the domain.

### ADFS installation recommendations

The article [Deploying a Federation Server Farm][Deploying_a_federation_server_farm] provides detailed instructions for installing and configuring ADFS. Perform the following tasks before configuring the first ADFS server in the farm:

1. Obtain a publicly trusted certificate for performing server authentication. The *subject name* must contain the name by which clients access the federation service. This can be the DNS name registered for the load balancer, for example, *adfs.contoso.com* (avoid using wildcard names such as **.contoso.com*, for security reasons). Use the same certificate on all ADFS server VMs. You can purchase a certificate from a trusted certification authority, but if your organization uses Active Directory Certificate Services you can create your own. 

    The *subject alternative name* is used by the DRS to enable access from external devices. This should be of the form *enterpriseregistration.contoso.com*.

    For more information, see [Obtain and Configure an SSL Certificate for ADFS][adfs_certificates].

2. On the domain controller, generate a new root key for the Key Distribution Service. Set the effective time to be the current time minus 10 hours (this configuration reduces the delay that can occur in distributing and synchronizing keys across the domain). This step is necessary to support creating the group service account that are used to run the ADFS service. The following Powershell command shows an example of how to do this:

    ```powershell
    Add-KdsRootKey -EffectiveTime (Get-Date).AddHours(-10)
    ```

3. Add each ADFS server VM to the domain.

>[AZURE.NOTE] To install ADFS, the domain controller running the PDC emulator FSMO role for the domain must be running and accessible from the ADFS VMs.

### ADFS Trust recommendations

Establish federation trust between your ADFS installation, and the federation servers of any partner organizations. Configure any claims filtering and mapping required. This process requires:

- DevOps staff **at each partner organization** to add a relying party trust for the web applications accessible through your ADFS servers.

- DevOps staff **in your organization** to configure claims-provider trust to enable your ADFS servers to trust the claims that partner organizations provide.

- DevOps staff **in your organization** to configure ADFS to pass claims on to your organization's web applications.

	For more information, see [Establishing Federation Trust][establishing-federation-trust].

Publish your organization's web applications and make them available to external partners by using preauthentication through the WAP servers. For more information, see [Publish Applications using ADFS Preauthentication][publish_applications_using_AD_FS_preauthentication]

Note that ADFS supports token transformation and augmentation. Azure Active Directory does not provide this feature. With ADFS, when you set up the trust relationships, you can:

- Configure claim transformations for authorization rules. For example, you can map group security from a representation used by a non-Microsoft partner organization to something that that ADDS can authorize in your organization.

- Transform claims from one format to another. For example, you can map from SAML 2.0 to SAML 1.1 if your application only supports SAML 1.1 claims.

### Monitoring recommendations

The [Microsoft System Center Management Pack for Active Directory Federation Services 2012 R2][oms-adfs-pack] provides both proactive and reactive monitoring of your ADFS deployment for the federation server. This management pack monitors:

- Events that the ADFS service records in the ADFS event logs.

- The performance data that the ADFS performance counters collect. 

- The overall health of the ADFS system and web applications (relying parties), and provides alerts for critical issues and warnings. 

## Scalability considerations

The following considerations, summarized from the document [Plan your ADFS deployment][plan-your-adfs-deployment], give a starting point for sizing ADFS farms:

- If you have fewer than 1000 users, do not create dedicated ADFS servers, but instead install ADFS on each of the ADDS servers in the cloud. Make sure that you have at least two ADDS servers to maintain availability. Create a single WAP server.

- If you have between 1000 and 15000 users, create two dedicated ADFS servers and two dedicated WAP servers.

- If you have between 15000 and 60000 users, create between three and five dedicated ADFS servers and at least two dedicated WAP servers.

These considerations assume that you are using dual quad-core VM (Standard D4_v2, or better) sizes in Azure.

Note that if you are using the Windows Internal Database to store ADFS configuration data, you are limited to eight ADFS servers in the farm. If you anticipate that you will need more in the future, use SQL Server. For more information, see [The Role of the ADFS Configuration Database][adfs-configuration-database].

## Availability considerations

You can use either SQL Server or the Windows Internal Database (WID) to hold ADFS configuration information. WID provides basic redundancy. Changes are written directly to only one of the ADFS databases in the ADFS cluster, while the other servers use pull replication to keep their databases up to date. Using SQL Server can provide full database redundancy and high availability using failover clustering or mirroring.

## Management considerations

DevOps staff should be prepared to perform the following tasks:

- Managing the federation servers, including managing the ADFS farm, managing trust policy on the federation servers, and managing the certificates used by the federation services.

- Managing the WAP servers including managing the WAP farm, managing the WAP certificates.

- Managing web applications including configuring relying parties, authentication methods, and claims mappings.

- Backing up ADFS components.

## Security considerations

ADFS utilizes the HTTPS protocol, so make sure that the NSG rules for the subnet containing the web tier VMs permit HTTPS requests. These requests can originate from the on-premises network, the subnets containing the web tier, business tier, data tier, private DMZ, public DMZ, and the subnet containing the ADFS servers.

Consider using a set of network virtual appliances that logs detailed information on traffic traversing the edge of your virtual network for auditing purposes.

## Solution deployment

## Next steps

- [Azure Active Directory][aad].

- [Azure Active Directory B2C][aadb2c].

<!-- links -->

[vm-recommendations]: ./guidance-compute-single-vm.md#Recommendations
[naming-conventions]: ./guidance-naming-conventions.md
[implementing-active-directory]: ./guidance-identity-adds-extend-domain.md
[resource-manager-overview]: ../azure-resource-manager/resource-group-overview.md
[implementing-a-secure-hybrid-network-architecture]: ./guidance-iaas-ra-secure-vnet-hybrid.md
[implementing-a-secure-hybrid-network-architecture-with-internet-access]: ./guidance-iaas-ra-secure-vnet-dmz.md
[DRS]: https://technet.microsoft.com/library/dn280945.aspx
[where-to-place-an-fs-proxy]: https://technet.microsoft.com/library/dd807048.aspx
[ADDRS]: https://technet.microsoft.com/library/dn486831.aspx
[plan-your-adfs-deployment]: https://msdn.microsoft.com/library/azure/dn151324.aspx
[ad_network_recommendations]: #network_configuration_recommendations_for_AD_DS_VMs
[domain_and_forests]: https://technet.microsoft.com/library/cc759073(v=ws.10).aspx
[adfs_certificates]: https://technet.microsoft.com/library/dn781428(v=ws.11).aspx
[create_service_account_for_adfs_farm]: https://technet.microsoft.com/library/dd807078.aspx
[import_server_authentication_certificate]: https://technet.microsoft.com/library/dd807088.aspx
[adfs-configuration-database]: https://technet.microsoft.com/en-us/library/ee913581(v=ws.11).aspx
[active-directory-federation-services]: https://technet.microsoft.com/windowsserver/dd448613.aspx
[security-considerations]: #security-considerations
[recommendations]: #recommendations
[claims-aware applications]: https://msdn.microsoft.com/en-us/library/windows/desktop/bb736227(v=vs.85).aspx
[active-directory-federation-services-overview]: https://technet.microsoft.com/en-us/library/hh831502(v=ws.11).aspx
[establishing-federation-trust]: https://blogs.msdn.microsoft.com/alextch/2011/06/27/establishing-federation-trust/
[Deploying_a_federation_server_farm]: https://technet.microsoft.com/library/dn486775.aspx
[install_and_configure_the_web_application_proxy_server]: https://technet.microsoft.com/library/dn383662.aspx
[publish_applications_using_AD_FS_preauthentication]: https://technet.microsoft.com/library/dn383640.aspx
[managing-adfs-components]: https://technet.microsoft.com/library/cc759026.aspx
[oms-adfs-pack]: https://www.microsoft.com/download/details.aspx?id=41184
[azure-powershell-download]: https://azure.microsoft.com/documentation/articles/powershell-install-configure/
[aad]: https://azure.microsoft.com/documentation/services/active-directory/
[aadb2c]: https://azure.microsoft.com/documentation/services/active-directory-b2c/
[adfs-intro]: ../active-directory/active-directory-aadconnect-azure-adfs.md
[hybrid-azure-on-prem-vpn]: ./guidance-hybrid-network-vpn.md
[extending-ad-to-azure]: ./guidance-identity-adds-extend-domain.md
[visio-download]: http://download.microsoft.com/download/1/5/6/1569703C-0A82-4A9C-8334-F13D0DF2F472/RAs.vsdx
[0]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure1.png "Secure hybrid network architecture with Active Directory"
