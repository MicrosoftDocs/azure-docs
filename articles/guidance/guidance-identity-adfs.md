---
title: Implementing Active Directory Federation Services (AD FS) in Azure | Microsoft Docs
description: How to implement a secure hybrid network architecture with Active Directory Federation Service authorization in Azure.
services: guidance,vpn-gateway,expressroute,load-balancer,virtual-network,active-directory
documentationcenter: na
author: telmosampaio
manager: christb
editor: ''
tags: azure-resource-manager

ms.assetid: 18525321-1926-4447-9db2-cadbdd4c1ab9
ms.service: guidance
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/28/2016
ms.author: telmos

---
# Implementing Active Directory Federation Services (AD FS) in Azure 

[!INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes how to implement a secure hybrid network that extends your on-premises network to Azure and uses [Active Directory Federation Services (AD FS)][active-directory-federation-services] to perform federated authentication and authorization for components running in Azure. This architecture extends the implementation described in [Extending Active Directory to Azure][implementing-active-directory].

> [!NOTE]
> Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.
> 
> 

AD FS can be hosted on-premises, but if your application is a hybrid in which some parts are implemented in Azure, it may be more efficient to replicate AD FS in the cloud. Typical uses for this architecture include:

* Hybrid applications where workloads run partly on-premises and partly in Azure.
* Solutions that use federated authorization to expose web applications to partner organizations.
* Systems that support access from web browsers running outside of the organizational firewall.
* Systems that enable users to access to web applications by connecting from authorized external devices such as remote computers, notebooks, and other mobile devices. 

For more information about how AD FS works, see [Active Directory Federation Services Overview][active-directory-federation-services-overview]. Also, the article [AD FS deployment in Azure][adfs-intro] contains a detailed step-by-step introduction to implementation.

This reference architecture focuses on *passive federation*, in which the federation servers decide how and when to authenticate a user. The user provides sign in information when the application is started. This mechanism is most commonly used by web browsers and involves a protocol that redirects the browser to a site where the user authenticates. AD FS also supports *active federation*, where an application takes on responsibility for supplying credentials without further user interaction, but that scenario is outside the scope of this architecture.

## Architecture diagram

The following diagram highlights the important components in this architecture. 

The diagram shows the following scenarios:

* Application code from a partner organization accesses a web application hosted inside your Azure VNet.
* An external, registered user with credentials stored inside Active Directory Domain Services (DS) accesses a web application hosted inside your Azure VNet.
* A user connected to your VNet using an authorized device executes a web application hosted inside your Azure VNet.

> A Visio document that includes this architecture diagram is available for download from the [Microsoft download center][visio-download]. This diagram is on the "Identity - ADFS" page.
> 
> 

![[0]][0]

* **AD DS subnet**. The AD DS servers are contained in their own subnet with network security group (NSG) rules acting as a firewall.

* **AD DS servers**. Domain controllers running as VMs in Azure. These servers provide authentication of local identities within the domain.

* **AD FS subnet**. The AD FS servers are located within their own subnet with NSG rules acting as a firewall.

* **AD FS servers**. The AD FS servers provide federated authorization and authentication. In this architecture, they perform the following tasks:
  
  * Receiving security tokens containing claims made by a partner federation server on behalf of a partner user. AD FS verifies that the tokens are valid before passing the claims to the web application running in Azure to authorize requests. 
  
    The web application running in Azure is the *relying party*. The partner federation server must issue claims that are understood by the web application. The partner federation servers are referred to as *account partners*, because they submit access requests on behalf of authenticated accounts in the partner organization. The AD FS servers are called *resource partners* because they provide access to resources (the web application).

  * Authenticating and authorizing incoming requests from external users running a web browser or device that needs access to web applications, by using AD DS and the [Active Directory Device Registration Service][ADDRS].
    
  The AD FS servers are configured as a farm accessed through an Azure load balancer. This implementation improves availability and scalability. The AD FS servers are not exposed directly to the Internet. All Internet traffic is filtered through AD FS web application proxy servers and a DMZ (also referred to as a perimeter network).

* **AD FS proxy subnet**. The AD FS proxy servers can be contained within their own subnet, with NSG rules providing protection. The servers in this subnet are exposed to the Internet through a set of network virtual appliances that provide a firewall between your Azure virtual network and the Internet.

* **AD FS web application proxy (WAP) servers**. These VMs act as AD FS servers for incoming requests from partner organizations and external devices. The WAP servers act as a filter, shielding the AD FS servers from direct access from the Internet. As with the AD FS servers, deploying the WAP servers in a farm with load balancing gives you greater availability and scalability than deploying a collection of stand-alone servers.
  
  > [!NOTE]
  > For detailed information about installing WAP servers, see [Install and Configure the Web Application Proxy Server][install_and_configure_the_web_application_proxy_server]
  > 
  > 

* **Partner organization**. A partner organization running a web application that requests access to a web application running in Azure. The federation server at the partner organization authenticates requests locally, and submits security tokens containing claims to AD FS running in Azure. AD FS in Azure validates the security tokens, and if valid can pass the claims to the web application running in Azure to authorize them.
  
  > [!NOTE]
  > You can also configure a VPN tunnel using Azure gateway to provide direct access to AD FS for trusted partners. Requests received from these partners do not pass through the WAP servers.
  > 
  > 

For more information about the parts of the architecture that are not related to AD FS, see the following:
- [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture]
- [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access]
- [Implementing a secure hybrid network architecture with Active Directory identities in Azure][implementing-active-directory].


## Recommendations

The following recommendations apply for most scenarios. Follow these recommendations unless you have a specific requirement that overrides them. 

### VM recommendations

Create VMs with sufficient resources to handle the expected volume of traffic. Use the size of the existing machines hosting AD FS on premises as a starting point. Monitor the resource utilization. You can resize the VMs and scale down if they are too large.

Follow the recommendations listed in [Running a Windows VM on Azure][vm-recommendations].

### Networking recommendations

Configure the network interface for each of the VMs hosting AD FS and WAP servers with static private IP addresses.

Do not give the AD FS VMs public IP addresses. For more information, see the Security considerations section.

Set the IP address of the preferred and secondary domain name service (DNS) servers for the network interfaces for each AD FS and WAP VM to reference the Active Directory DS VMs. The Active Directory DS VMS should be running DNS. This step is necessary to enable each VM to join the domain.

### AD FS availability 

Create an AD FS farm with at least two servers to increase availability of the service. Use different storage accounts for each AD FS VM in the farm. This approach helps to ensure that a failure in a single storage account does not make the entire farm inaccessible.

Create separate Azure availability sets for the AD FS and WAP VMs. Ensure that there are at least two VMs in each set. Each availability set must have at least two update domains and two fault domains.

Configure the load balancers for the AD FS VMs and WAP VMs as follows:

* Use an Azure load balancer to provide external access to the WAP VMs, and an internal load balancer to distribute the load across the AD FS servers in the farm.
* Only pass traffic appearing on port 443 (HTTPS) to the AD FS/WAP servers.
* Give the load balancer a static IP address.
* Create a health probe using the TCP protocol rather than HTTPS. You can ping port 443 to verify that an AD FS server is functioning.
  
  > [!NOTE]
  > AD FS servers use the Server Name Indication (SNI) protocol, so attempting to probe using an HTTPS endpoint from the load balancer fails.
  > 
  > 
* Add a DNS *A* record to the domain for the AD FS load balancer. Specify the IP address of the load balancer, and give it a name in the domain (such as adfs.contoso.com). This is the name clients and the WAP servers use to access the AD FS server farm.

### AD FS security 

Prevent direct exposure of the AD FS servers to the Internet. AD FS servers are domain-joined computers that have full authorization to grant security tokens. If a server is compromised, a malicious user can issue full access tokens to all web applications and to all federation servers that are protected by AD FS. If your system must handle requests from external users not connecting from trusted partner sites, use WAP servers to handle these requests. For more information, see [Where to Place a Federation Server Proxy][where-to-place-an-fs-proxy].

Place AD FS servers and WAP servers in separate subnets with their own firewalls. You can use NSG rules to define firewall rules. If you require more comprehensive protection you can implement an additional security perimeter around servers by using a pair of subnets and network virtual appliances (NVAs), as described in the document [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access]. All firewalls should allow traffic on port 443 (HTTPS).

Restrict direct sign in access to the AD FS and WAP servers. Only DevOps staff should be able to connect.

Do not join the WAP servers to the domain.

### AD FS installation 

The article [Deploying a Federation Server Farm][Deploying_a_federation_server_farm] provides detailed instructions for installing and configuring AD FS. Perform the following tasks before configuring the first AD FS server in the farm:

1. Obtain a publicly trusted certificate for performing server authentication. The *subject name* must contain the name clients use to access the federation service. This can be the DNS name registered for the load balancer, for example, *adfs.contoso.com* (avoid using wildcard names such as **.contoso.com*, for security reasons). Use the same certificate on all AD FS server VMs. You can purchase a certificate from a trusted certification authority, but if your organization uses Active Directory Certificate Services you can create your own. 
   
    The *subject alternative name* is used by the device registration service (DRS) to enable access from external devices. This should be of the form *enterpriseregistration.contoso.com*.
   
    For more information, see [Obtain and Configure a Secure Sockets Layer (SSL) Certificate for AD FS][adfs_certificates].

2. On the domain controller, generate a new root key for the Key Distribution Service. Set the effective time to the current time minus 10 hours (this configuration reduces the delay that can occur in distributing and synchronizing keys across the domain). This step is necessary to support creating the group service account that is used to run the AD FS service. The following PowerShell command shows an example of how to do this:
   
    ```powershell
    Add-KdsRootKey -EffectiveTime (Get-Date).AddHours(-10)
    ```

3. Add each AD FS server VM to the domain.

> [!NOTE]
> To install AD FS, the domain controller running the primary domain controller (PDC) emulator flexible single master operation (FSMO) role for the domain must be running and accessible from the AD FS VMs. <<RBC: Is there a way to make this less repetitive?>>
> 
> 

### AD FS trust 

Establish federation trust between your AD FS installation, and the federation servers of any partner organizations. Configure any claims filtering and mapping required. 

* DevOps staff at each partner organization must add a relying party trust for the web applications accessible through your AD FS servers.
* DevOps staff in your organization must configure claims-provider trust to enable your AD FS servers to trust the claims that partner organizations provide.
* DevOps staff in your organization must also configure AD FS to pass claims on to your organization's web applications.
  
For more information, see [Establishing Federation Trust][establishing-federation-trust].

Publish your organization's web applications and make them available to external partners by using preauthentication through the WAP servers. For more information, see [Publish Applications using AD FS Preauthentication][publish_applications_using_AD_FS_preauthentication]

AD FS supports token transformation and augmentation. Azure Active Directory does not provide this feature. With AD FS, when you set up the trust relationships, you can:

* Configure claim transformations for authorization rules. For example, you can map group security from a representation used by a non-Microsoft partner organization to something that that Active Directory DS can authorize in your organization.
* Transform claims from one format to another. For example, you can map from SAML 2.0 to SAML 1.1 if your application only supports SAML 1.1 claims.

### AD FS monitoring 

The [Microsoft System Center Management Pack for Active Directory Federation Services 2012 R2][oms-adfs-pack] provides both proactive and reactive monitoring of your AD FS deployment for the federation server. This management pack monitors:

* Events that the AD FS service records in its event logs.
* The performance data that the AD FS performance counters collect. 
* The overall health of the AD FS system and web applications (relying parties), and provides alerts for critical issues and warnings. 

## Scalability considerations

The following considerations, summarized from the article [Plan your AD FS deployment][plan-your-adfs-deployment], give a starting point for sizing AD FS farms:

* If you have fewer than 1000 users, do not create dedicated servers, but instead install AD FS on each of the Active Directory DS servers in the cloud. Make sure that you have at least two Active Directory DS servers to maintain availability. Create a single WAP server.
* If you have between 1000 and 15000 users, create two dedicated AD FS servers and two dedicated WAP servers.
* If you have between 15000 and 60000 users, create between three and five dedicated AD FS servers and at least two dedicated WAP servers.

These considerations assume that you are using dual quad-core VM (Standard D4_v2, or better) sizes in Azure.

If you are using the Windows Internal Database to store AD FS configuration data, you are limited to eight AD FS servers in the farm. If you anticipate that you will need more in the future, use SQL Server. For more information, see [The Role of the AD FS Configuration Database][adfs-configuration-database].

## Availability considerations

You can use either SQL Server or the Windows Internal Database to hold AD FS configuration information. The Windows Internal Database provides basic redundancy. Changes are written directly to only one of the AD FS databases in the AD FS cluster, while the other servers use pull replication to keep their databases up to date. Using SQL Server can provide full database redundancy and high availability using failover clustering or mirroring.

## Manageability considerations

DevOps staff should be prepared to perform the following tasks:

* Managing the federation servers, including managing the AD FS farm, managing trust policy on the federation servers, and managing the certificates used by the federation services.
* Managing the WAP servers including managing the WAP farm and certificates.
* Managing web applications including configuring relying parties, authentication methods, and claims mappings.
* Backing up AD FS components.

## Security considerations

AD FS utilizes the HTTPS protocol, so make sure that the NSG rules for the subnet containing the web tier VMs permit HTTPS requests. These requests can originate from the on-premises network, the subnets containing the web tier, business tier, data tier, private DMZ, public DMZ, and the subnet containing the AD FS servers.

Consider using a set of network virtual appliances that logs detailed information on traffic traversing the edge of your virtual network for auditing purposes.

## Solution deployment

A solution is available on [Github][github] to deploy this reference architecture. You will need the latest version of the [Azure CLI][azure-cli] to run the Powershell script that deploys the solution. To deploy the reference architecture, follow these steps:

1. Download or clone the solution folder from [Github][github] to your local machine.

2. Open the Azure CLI and navigate to the local solution folder.

3. Run the following command:
   
    ```powershell
    .\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> <mode>
    ```
   
    Replace `<subscription id>` with your Azure subscription ID.
   
    For `<location>`, specify an Azure region, such as `eastus` or `westus`.
   
    The `<mode>` parameter controls the granularity of the deployment, and can be one of the following values:
   
   * `Onpremise`: Deploys a simulated on-premises environment. You can use this deployment to test and experiment if you do not have an existing on-premises network, or if you want to test this reference architecture without changing the configuration of your existing on-premises network.
   * `Infrastructure`: deploys the VNet infrastructure and jump box.
   * `CreateVpn`: deploys an Azure virtual network gateway and connects it to the simulated on-premises network.
   * `AzureADDS`: deploys the VMs acting as ACtive Directory DS servers, deploys Active Directory to these VMs, and creates the domain in Azure.
   * `AdfsVm`: deploys the AD FS VMs and joins them to the domain in Azure.
   * `PublicDMZ`: deploys the public DMZ in Azure.
   * `ProxyVm`: deploys the AD FS proxy VMs and joins them to the domain in Azure.
   * `Prepare`: deploys all of the preceding deployments. **This is the recommended option if you are building an entirely new deployment and you don't have an existing on-premises infrastructure.** 
   * `Workload`: optionally deploys web, business, and data tier VMs and supporting network. Not included in the `Prepare` deployment mode.
   * `PrivateDMZ`: optionally deploys the private DMZ in Azure in front of the `Workload` VMs deployed above. Not included in the `Prepare` deployment mode.

4. Wait for the deployment to complete. If you used the `Prepare` option, the deployment takes several hours to complete, and finishes with the message `Preparation is completed. Please install certificate to all AD FS and proxy VMs.`

5. Restart the jump box (*ra-adfs-mgmt-vm1* in the *ra-adfs-security-rg* group) to allow its DNS settings to take effect.

6. [Obtain an SSL Certificate for AD FS][adfs_certificates] and install this certificate on the AD FS VMs. Note that you can connect to them through the jump box. The IP addresses are *10.0.5.4* and *10.0.5.5*. The default username is *contoso\testuser* with password *AweSome@PW*.
   
   > [!NOTE]
   > The comments in the Deploy-ReferenceArchitecture.ps1 script at this point provides detailed instructions for creating a self-signed test certificate and authority using the `makecert` command. However, perform these steps as a **test** only and do not use the certificates generated by makecert in a production environment.
   > 
   > 

7. Run the following PowerShell command to deploy the AD FS server farm:
   
    ```powershell
    .\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> Adfs
    ``` 

8. On the jump box, browse to *https://adfs.contoso.com/adfs/ls/idpinitiatedsignon.htm* to test the AD FS installation (you may receive a certificate warning that you can ignore for this test). Verify that the Contoso Corporation sign-in page appears. Sign in as *contoso\testuser* with password *AweS0me@PW*.

9. Install the SSL certificate on the AD FS proxy VMs. The IP addresses are *10.0.6.4* and *10.0.6.5*.

10. Run the following PowerShell command to deploy the first AD FS proxy server:
   
    ```powershell
    .\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> Proxy1
    ```

11. Follow the instructions displayed by the script to test the installation of the first proxy server.

12. Run the following PowerShell command to deploy the second proxy server:
    
    ```powershell
    .\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> Proxy2
    ```

13. Follow the instructions displayed by the script to test the complete proxy configuration.

## Next steps

* Learn about [Azure Active Directory][aad].
* Learn about [Azure Active Directory B2C][aadb2c].

<!-- links -->
[azure-cli]: ../azure-resource-manager/xplat-cli-azure-resource-manager.md
[vm-recommendations]: ./guidance-compute-single-vm.md
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
[Deploying_a_federation_server_farm]:  https://azure.microsoft.com/en-us/documentation/articles/active-directory-aadconnect-azure-adfs/
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
[github]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/Deploy-ReferenceArchitecture.ps1
[adfs_certificates]: https://technet.microsoft.com/library/dn781428(v=ws.11).aspx
[0]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure1.png "Secure hybrid network architecture with Active Directory"