<properties
   pageTitle="Azure Architecture Reference - IaaS: Implementing a secure hybrid network architecture with federated identities in Azure | Microsoft Azure"
   description="How to implement a secure hybrid network architecture with Active Directory Federation Service authorization in Azure."
   services="guidance,vpn-gateway,expressroute,load-balancer,virtual-network,active-directory"
   documentationCenter="na"
   authors="telmosampaio"
   manager="roshar"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="07/29/2016"
   ms.author="telmos"/>

# Implementing a secure hybrid network architecture with federated identities in Azure

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for implementing a secure hybrid network that extends your on-premises network to Azure, but that also uses [Active Directory Federation Services (AD FS)][active-directory-federation-services] to perform federated authentication and authorizations for components running in the cloud. This architecture extends the structure described by [Implementing a secure hybrid network architecture with Active Directory identities in Azure][implementing-active-directory].

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.

AD FS can run on-premises, but in a hybrid scenario where elements of an application are located in Azure it can be more efficient to implement this functionality in the cloud. Typical use cases for this architecture include:

- Hybrid applications where workloads run partly on-premises and partly in Azure.

- Solutions that utilize federated authorization involving access to external web applications hosted by partner organizations.

	If an application running in your Azure VNet requires access to a web application hosted by a partner organization, you can use AD FS to implement federation. AD FS uses AD DS to authenticate the identity of the process or user making the request. AD FS can then pass pertinent information (called *claims*) about the authenticated identity to the federation server in the partner organization. These claims are wrapped up in a security token. The resource partner federation server can validate this token, and then pass the claims made to the web application. The web application can determine whether to authorize the request based on its own business rules. This scenario requires that the partner organization trusts the authentication performed by your AD FS/AD DS services.

	This use case includes single sign-on (SSO) scenarios. The identity of a process can be verified once by using AD DS, and the resulting Kerberos token is cached with the process. The Kerberos token can be used by AD FS to guarantee the authenticity of a request, and the claims associated with the identity can be established and provided to multiple external web applications without the need to repeat authentication.

- Systems that expose web applications to partner organizations.

	Federation can also operate in the other direction. Code running inside a partner organization may be able to invoke a web application hosted as part of your system in Azure. In this case, the federation server in the partner organization is responsible for handling authentication, and passes a token containing claims about the authenticated identity to AD FS. AD FS validates this token, and then passes the claims to the web application which can make the decision to authorize the request. For this scenario your AD FS service must trust the authentication performed by the partner organization.

- Systems that support access from web browsers running outside of the organizational firewall.

	Some organizations provide controlled exposure to web applications from external, registered users. These users connect using a web browser. In this case, there is no partner AD FS to perform authentication, so the system must use AD DS to verify the credentials of these users. This process can involve multi-factor authentication.

- Systems that enable users to access to web applications by connecting from authorized external devices such as remote computers, notebooks, and other mobile devices.

	This mechanism enables seamless second factor authentication, persistent single sign-on, and conditional access to consumers that require access to company resources. This solution requires that you enable the Device Registration Service (DRS) on your federation server . For more information, see [Join to Workplace from Any Device for SSO and Seamless Second Factor Authentication Across Company Applications][DRS].

For more information about how AD FS works, see [Active Directory Federation Services Overview][active-directory-federation-services-overview].

## Architecture diagram

The following diagram highlights the important components in this architecture (*click to zoom in*). For more information about the greyed-out elements, read [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture], [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access], and [Implementing a secure hybrid network architecture with Active Directory identities in Azure][implementing-active-directory]:

[![0]][0]

>[AZURE.NOTE] This diagram depicts the following use cases:
>
>- Application code running in Azure accessing a web application hosted by an external partner (Partner A).
>
>- Application code running inside a partner organization (Partner B) access a web application hosted inside your Azure VNet.
>
>- An external, registered user (with credentials stored inside AD DS) accessing a web application hosted inside your Azure VNet.
>
>- A user connecting to your VNet by using an authorized device and running a web application hosted inside you Azure VNet.
>
>Not all of these use cases could be relevant in your own scenario.
>
>Additionally, this architecture focusses on passive federation, where the federation servers make the decisions concerning how and when to authenticate; the user is expected to provide logon information when an application starts running. This is the mechanism most commonly used by web browsers and involves a protocol that redirects the browser to a site where the user can provide their credentials. AD FS also supports active federation whereby an application takes on responsibility for supplying credentials without further user interaction.

- **AD DS Servers.** These are domain controllers running as VMs in the cloud. These servers can provide authentication of local identities within the domain.

- **Active Directory subnet.** The AD DS servers are bounded in a separate subnet. NSG rules help to protect the AD DS servers and can provide a firewall against traffic from unexpected sources.

	For more information about configuring UDRs and the NVAs, see [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture].

- **AD FS servers.** The AD FS servers provide federated authorization and authentication. They perform the following tasks:

	- They use AD DS to authenticate requests made by the application running in the cloud. The partner web application is configured as a *relying partner* of AD FS. The configuration information includes the claims that the partner web application expects.  AD DS can include attributes for the identities that it authenticates (such as the email address, location, etc), and AD FS can take this information and transform in into the claims expected by the relying party before sending these claims (encoded as a security token) to the partner federation server. In this role, the AD FS servers are referred to as *account partners* because they submit access requests on behalf of authenticated accounts. The complete flow of control for this use case is as follows:
	
		1. A corporate user in your organization attempts to access a web application owned by partner A.

		2. If the corporate user is not yet authenticated, she is redirected to the federation server of partner A.

		3. The federation server in partner A provides a Home Realm Discovery (HDR) mechanism, and the corporate user can select the account federation server (AD FS within the organization's Azure VNet).
		
			>[AZURE.NOTE] A user might be redirected based on the domain specified as part of her user principal name (UPN). For example, if the user's UPN is *fred@treyresearch.com* then the federation server at partner A could be configured to redirect the user to *treyresearch.com* to perform authentication. This scenario is not considered further in this guidance.

		4. The user is redirected back to the account federation server, where she is authenticated.

		5. The account federation server retrieves the user's claims from the AD database and passes them back to the user's process.

		6. The user's process process wraps the claims inside a Security Assertion Markup Language (SAML) token which it encodes and sends to the federation server on Partner A.

		7. Partner A authenticates the token to verify that it is valid, transforms the claims it contains (if appropriate) and sends the verified claims back to the user's process as another SAML token.

		8. The user's process SAML token containing the authenticated claims to the web application on partner A, which can perform any necessary authorization.

	- They can receive security tokens containing claims made by a partner federation server on behalf of a partner application. AD FS can verify that these tokens are valid before passing the claims to web application running in Azure. The corporate web application (in Azure) can use these claims to authorize requests (the claims can correspond to attributes held in AD DS for the authenticated identity). In this scenario, the corporate web application is the relying party, and it is the responsibility of the partner federation server to issue claims that will be understood by the corporate web application. The AD FS servers are referred to as *resource partners* because they provide access to resources. The flow of control is:

		1. A user within a partner organization (Partner B) attempts to access the corporate web application running in your organization's Azure VNet.

		2. If the partner user is not yet authenticated, she is redirected to your organization's federation server inside the VNet (AD FS).

		3. HDR in AD FS enables the user to select the federation server in partner B, or she may be redirected to another site for authentication based on her UPN (this case is not considered further here).

		4. The partner user authenticates using the account federation server at partner B.

		5. The account federation server at partner B retrieves the user's claims and passes them back to the user's process.

		6. The user's process creates a SAML token with these claims which it sends to the AD FS in your organization's VNet.

		7. Your organization's ADFS authenticates the token to verify that it is valid, transforms the claims it contains (if appropriate) and sends the verified claims back to the user's process as another SAML token.

		8. The user's process SAML token containing the authenticated claims to the web application in your organization, which can perform any necessary authorization.

	- They can authenticate (via AD DS and the [Active Directory Device Registration Service][ADDRS]) and authorize incoming requests external users running a web browser or device that needs access to your corporate web applications. 

	The AD FS servers are configured as a farm, accessed through an an Azure load balancer. This structure helps to improve availability and scalability. Also, note that the AD FS servers are not exposed directly to the Internet, rather all Internet traffic is filtered through AD FS web application proxy servers and a DMZ.

- **Active Directory Federation Services subnet.** The AD FS servers can be contained within their own subnet, with NSG rules acting as a basic firewall.

- **Partner A.** A resource partner organization that which owns or manages external web applications. A federation service (which could be AD FS, but does not have to be) at the resource partner site receives requests in the form of a security token containing authenticated claims from the account partner (AD FS running in Azure in this example). If a security token is valid, the claims are passed to the external web application for authorization.

- **Parter B.** Another partner organization that runs a web application that requests access to the web application running in Azure. The federation server at Partner B authenticates requests locally, and submits security tokens containing claims to AD FS running in Azure. AD FS in Azure validates the security tokens, and if they are valid it can pass the claims to the web application running in Azure to authorize them. 

- **AD FS web application proxy (WAP) servers.** These computers act as AD FS servers for incoming requests from partner organizations (such as Partner B) and external devices. The WAP servers act as a filter, protecting the AD FS servers from direct access from the public Internet. As with the AD FS servers, deploying the WAP servers in a farm with load balancing gives you greater availability and scalability than deploying a collection of stand-alone servers.

	>[AZURE.NOTE] You can also configure a VPN tunnel using Azure Gateway to provide direct access to AD FS for trusted partners. Requests received from these partners do not pass through the WAP servers.

## Recommendations

This section summarizes recommendations for implementing AD FS running in Azure, covering:

- VM recommendations.

- Networking recommendations.

- Load balancer recommendations.

- AD FS installation recommendations.

- Trust recommendations.

>[AZURE.NOTE] For detailed information about installing WAP servers, see [Install and Configure the Web Application Proxy Server][install_and_configure_the_web_application_proxy_server]

### VM recommendations

Create VMs with sufficient resources to handle the expected volume of traffic. Use the size of the machines hosting AD FS on premises as a starting point. Monitor the resource utilization; you can resize the VMs and scale down if they are too large.

### Networking recommendations

Using the Azure portal, configure the network interface for each of the VMs hosting AD FS and WAP servers with static private IP addresses.

[AZURE.NOTE] Do not give the AD FS VMs public IP addresses. See [Security considerations][security-considerations] for more details.

Also, use the Azure portal to set the IP address of the preferred and secondary DNS servers for the network interfaces for each AD FS and WAP VM to reference the AD DS VMs (which should be running DNS). This step is necessary to enable each VM to join the domain.

### Load balancer recommendations

Configure the load balancers for the AD FS VMs and WAP VMs as follows:

- Only pass traffic appearing on port 443 (HTTPS) to the AD FS/WAP servers.

- Give the load balancer a static IP address.

- Create a health probe using the TCP protocol rather than HTTPS. You can ping port 443 to verify that an AD FS server is functioning.

	>[AZURE.NOTE] AD FS servers use the Server Name Indication (SNI) protocol, so attempting to probe using an HTTPS endpoint from the load balancer will fail.

- Using the *DNS Manager* console on a VM running the DNS for the domain, add an *A* record for the AD FS load balancer. 

	Specify the IP address of the load balancer, and give it a name in the domain (such as adfs.contoso.com). This is the name by which clients and the WAP servers will access the AD FS server farm.

### AD FS installation recommendations

>[AZURE.NOTE] The PDC for the domain must be running and accessible from the AD FS VMs to install AD FS.

Perform the following tasks before configuring the first AD FS server in the farm:

1. Obtain a publicly trusted certificate for performing server authentication. The *subject name* must contain the name by which clients access the federation service. This can be the DNS name registered for the load balancer, for example, *adfs.contoso.com* (avoid using wildcard names such as **.contoso.com*, for security reasons). You should use the same certificate on all AD FS server VMs. You can purchase a certificate from a trusted certification authority, but if your organization uses Active Directory Certificate Services you can create your own. 

	The *subject alternative name* is used by the DRS to enable access from external devices. This should be of the form enterpriseregistration.contoso.com.

	For more information, see [Obtain and Configure an SSL Certificate for AD FS][adfs_certificates].

2. On the domain controller, use the following PowerShell command to generate a new root key for the Key Distribution Service. Set the effective time to be the current time minus 10 hours (this configuration reduces the delay that can occur in distributing and synchronizing keys across the domain). This step is necessary to support creating the group service account that will be used to run the AD FS service:

	```powershell
	Add-KdsRootKey -EffectiveTime (Get-Date).AddHours(-10)
	```

3. Add each AD FS server VM to the domain.

Install *Active Directory Federation Services* by using the *Add Roles and Features* wizard in Server Manager. The article [Deploying a Federation Server Farm][Deploying_a_federation_server_farm] provides detailed instructions for installing and configuring AD FS.

### Trust recommendations

Establish federation trust between your AD FS installation, and the federation servers of any partners. Configure any claims filtering and mapping required:

- On each account federation server, add a relying party trust for each partner federation server hosting web applications that users in the account federation server domain need to access.

- On each resource partner federation server hosting the web applications, configure claims-provider trust for your organization. This enables the resource partner federation servers to trust the claims that your account federation server provides.

- On each resource partner federation server, configure the federation server to pass claims on to the web application.

	For more information see [Establishing Federation Trust][establishing-federation-trust].

	>[AZURE.NOTE] If you are configuring your AD FS server in Azure to federate with a partner hosting a web application (partner A in the architecture diagram shown earlier), then your AD FS server is the account server, and the partner federation server is the resource server.
	>
	>If you wish to enable users in a partner organization (partner B) to access your to web applications, then the partner federation server is the account server and your AD FS server is the resource server.

Publish your organization's web applications and make them available to external partners by using preauthentication through the WAP servers. For more information, see [Publish Applications using AD FS Preauthentication][publish_applications_using_AD_FS_preauthentication]

## Availability considerations

Create different availability sets for the AD FS and WAP servers. Ensure that there are at least two servers in each set. 

*AD FS availability notes?*

*WAP server availability notes?*

*Using SQL Server rather than WID?*

## Security considerations

AD FS is heavily dependent on the HTTPS protocol, so make sure that the NSG rules for the subnet containing the web tier VMs permit HTTPS requests. These requests can originate from the on-premises network, the subnets containing the web tier, business tier, data tier, private DMZ, and public DMZ, as well as the subnet containing the AD FS servers.

Prevent direct exposure of the AD FS servers to the Internet. AD FS are domain-joined computers that have full authorization to grant security tokens. If an AD FS server is compromised, a malicious user has the ability to issue full access tokens to all web applications and to federation servers that are protected by AD FS. If your system must handle requests from external users not necessarily connecting from trusted partner sites, use WAP servers to handle these requests. Do not domain-join these WAP servers. For more information, see [Where to Place a Federation Server Proxy][where-to-place-an-fs-proxy].

Place AD FS servers and WAP servers in separate subnets with their own firewalls. You can use NSG rules to define a simple firewall. If you require more comprehensive protection you can implement an additional security perimeter around servers by using a pair of subnets and NVAs, as described by the document [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access]. Note that all firewalls should allow traffic on port 443 (HTTPS).

Do not join the WAP servers to the domain in the cloud.

## Scalability considerations

Use a farm configuration for the AD FS servers and WAP servers. This enables you to scale out by adding more servers to each farm. The following recommendations, adapted from the document [Plan your AD FS deployment][plan-your-adfs-deployment], give a starting point for sizing the farms:

- If you have fewer than 1000 users, do not create dedicated AD FS servers, but instead install AD FS on each of the AD DS servers in the cloud (make sure that you have at least two AD DS servers, to maintain availability). Create a single WAP server.

- If you have between 1000 and 15000 users, create two dedicated AD FS servers and two dedicated WAP servers.

- If you have between 15000 and 60000 users, create between three and five dedicated AD FS servers, and at least two dedicated WAP servers.

These figures assume you are using quad-core VMs (D3_V2 Standard, or better) to host the servers in Azure.

Note that if you are using the Windows Internal Database to store AD FS configuration data, you are limited to eight AD FS servers in the farm. If you anticipate needing more, then use SQL Server. For further information, see [The Role of the AD FS Configuration Database][adfs-configuration-database].

## Management considerations

*TBC*

## Monitoring considerations

*TBC*

## Solution components

<!-- The following text is boilerplate, and should be used in all RA docs -->

A sample solution script, [Deploy-ReferenceArchitecture.ps1][solution-script], is available that you can use to implement the architecture that follows the recommendations described in this article. This script utilizes [Azure Resource Manager (ARM)][ARM-Templates] templates. The templates are available as a set of fundamental building blocks, each of which performs a specific action such as creating a VNet or configuring an NSG. The purpose of the script is to orchestrate template deployment.

The templates are parameterized, with the parameters held in separate JSON files. You can modify the parameters in these files to configure the deployment to meet your own requirements. You do not need to amend the templates themselves. Note that you must not change the schemas of the objects in the parameter files.

When you edit the templates, create objects that follow the naming conventions described in [Recommended Naming Conventions for Azure Resources][naming conventions].

<!-- End of boilerplate -->

*Specifics for template to be added here when BBs are available*

## Deployment

*THIS SECTION TO BE UPDATED WHEN BBs ARE AVAILABLE*

The solution assumes the following prerequisites:

- You have an existing on-premises infrastructure already configured with a VPN appliance.

- You have an existing Azure subscription in which you can create resource groups.

- You have downloaded and installed the most recent build of Azure Powershell. See [here][azure-powershell-download] for instructions.

To run the script that deploys the solution:

1. Move to a convenient folder on your local computer and create the following two subfolders:

	- Scripts

	- Templates

2. Download the [Deploy-ReferenceArchitecture.ps1][solution-script] file to the Scripts folder

3. Download the [vpn-gateway-vpn-connection-settings.parameters.json][gateway-parameters] file to Templates folder:

4. Edit the Deploy-ReferenceArchitecture.ps1 file in the Scripts folder, and change the following line to specify the resource group that should be created or used to hold the resources created by the script:

	```powershell
	$resourceGroupName = "hybrid-dev-rg"
	```
5. Edit the vpn-gateway-vpn-connection-settings.parameters.json file in the Templates folder to set the parameters for the VNet, virtual network gateway, and connection, as described in the Solution Components section above.

6. Open an Azure PowerShell window, move to the Scripts folder, and run the following command:

	```powershell
	.\Deploy-ReferenceArchitecture.ps1 <subscription id> <location>
	```

	Replace `<subscription id>` with your Azure subscription ID.

	For `<location>`, specify an Azure region, such as `eastus` or `westus`.

7. When the script has completed, *Add Verification Steps*

## Next steps

<!-- links -->

[implementing-active-directory]: ./guidance-iaas-ra-secure-vnet-ad.md
[resource-manager-overview]: ../resource-group-overview.md
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
[azure-powershell-download]: https://azure.microsoft.com/documentation/articles/powershell-install-configure/
[0]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure1.png "Secure hybrid network architecture with Active Directory"
