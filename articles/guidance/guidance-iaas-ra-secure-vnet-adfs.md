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
   ms.date="07/27/2016"
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

- Creating the VMs for hosting AD FS.

- Configuring the network settings for the AD FS VMs.

- Configuring the load balancer for the AD FS VMs.

- Installing and configuring AD FS.

- Configuring the network settings for the AD FS proxy VMs.

- Configuring the load balancer for the WAP VMs.

- Installing and configuring WAP servers.

- Configuring trust for relying parties.

- Modifying the network security settings for the web tier subnet.

### VM recommendations for hosting AD DS and AD FS

Create VMs with sufficient resources to handle the expected volume of traffic. Use the size of the machines hosting AD FS on premises as a starting point. Monitor the resource utilization; you can resize the VMs and scale down if they are too large.

### Network recommendations for AD FS VMs

Using the Azure portal, configure the network interface for each of the VMs hosting AD FS with static private IP addresses.

[AZURE.NOTE] Do not give the AD FS VMs public IP addresses. See [Security considerations][security-considerations] for more details.

Also, use the Azure portal to set the IP address of the preferred and secondary DNS servers for the network interfaces for each AD FS VM to reference the AD DS VMs (which should be running DNS). This step is necessary to enable each AD FS VM to join the domain.

### Load balancer recommendations for the AD FS VMs

The internal load balancer in the AD FS subnet provides access to the AD FS servers. Configure the load balancer as follows:

- Only pass traffic appearing on port 443 (HTTPS) to the AD FS servers.

- Give the load balancer a static IP address:

	[![19]][19]

- Create a health probe using the TCP protocol rather than HTTPS. You can ping port 443 to verify that an AD FS server is functioning.

	>[AZURE.NOTE] AD FS servers use the Server Name Indication (SNI) protocol, so attempting to probe using an HTTPS endpoint from the load balancer will fail.

Using the *DNS Manager* console on the instance of AD DS running DNS, add an *A* record for the load balancer to the domain. Specify the IP address of the load balancer, and give it a name in the domain (adfs.contoso.com in the image shown below). This is the name by which clients and the WAP servers will access the AD FS server farm.

[![20]][20]

### AD FS recommendations

>[AZURE.NOTE] The PDC for the domain must be running and accessible from the AD FS VMs to install AD FS.

Perform the following tasks before configuring the first AD FS server in the farm:

1. Obtain a publicly trusted certificate for performing server authentication. The *subject name* must contain the name by which clients access the federation service. This can be the DNS name registered for the load balancer, for example, *adfs.contoso.com* (avoid using wildcard names such as **.contoso.com*, for security purposes). You should use the same certificate on all AD FS server VMs. You can purchase a certificate from a trusted certification authority, but if your organization uses Active Directory Certificate Services you can create your own. 

	The *subject alternative name* is used by the DRS to enable access from external devices. This should be of the form enterpriseregistration.contoso.com.

	For more information, see [Obtain and Configure an SSL Certificate for AD FS][adfs_certificates].

2. On the domain controller, use the following PowerShell command to generate a new root key for the Key Distribution Service. Set the effective time to be the current time minus 10 hours (this configuration reduces the delay that can occur in distributing and synchronizing keys across the domain). This step is necessary to support creating the group service account that will be used to run the AD FS service:

	```powershell
	Add-KdsRootKey -EffectiveTime (Get-Date).AddHours(-10)
	```

On each AD FS server VM, perform the following tasks:

1. Using the Azure portal, set the *Primary DNS Server* address for the network interface for the VM to the IP address of a DNS server in the domain.

2. Restart the VM.

3. Connect to the VM and join it to the domain in the cloud. Allow the VM to restart again.

4. Install *Active Directory Federation Services* by using the *Add Roles and Features* wizard in Server Manager:

	[![23]][23]

5. After installation, click the *Notifications* flag in Server Manager and then click *Configure the federation service on this server* to start the *Active Directory Federation Services Configuration Wizard*:

	[![29]][29]

6. If this the first AD FS server VM in the AD FS server farm, perform the following steps:

	- On the *Welcome* page, select *Create the first federation server in a federation farm*:

		[![24]][24]

	- On the *Connect to Active Directory Domain Services*, specify an account with domain administrator privileges:

		[![25]][25]

	- On the *Specify Service Properties* page, import the certificate to use for authenticating the server, and enter the full name of the AD FS service (the DNS name of the load balancer) and a display name for the federation service:

		[![26]][26]

	- On the *Specify Service Account* page, select *Create a Group Managed Service Account*, and provide a name for the new service account (such as `adfsservice`):
	
		[![27]][27]

	- On the *Specify Configuration Database* page, select *Create a database on this server using Windows Internal Database*:

		[![28]][28]

	- Proceed through the remaining pages, allow the installation to finish, and then restart the VM.

7. If this is not the first AD FS server VM in the AD FS server farm, perform the following steps:

	- On the *Welcome* page, select *Add federation server to a federation farm*:

		[![30]][30]

	- On the *Connect to Active Directory Domain Services*, specify an account with domain administrator privileges.

	- On the *Specify Farm* page, select *Specify the primary federation server in an existing farm using Windows Internal Database*, and enter the name of the first federation server in the farm (created earlier). Be sure to provide the name of the VM (*myapp-adfs-vm1.contoso.com* in the example below), and not the name of the farm (*adfs.contoso.com*):

		[![31]][31]

	- On the *Specify Certificate* page, import the certificate to use for authenticating the server. Note that all AD FS servers in the farm should use the same certificate.

	- On the *Specify Service Account* page, provide the account name of the service account and password, created when you set up the first server in the farm (*adfsservice* in the earlier example).

	- When the installation has finished, restart the VM.

8. Verify that the AD FS server farm has been correctly installed as follows:

	- Using Internet Explorer on any VM in the domain, browse to `https://<FQDN>/adfs/ls/IdpInitiatedSignon.htm`, where `<FQDN>` is the DNS name assigned to the load balancer (adfs.contoso.com in the previous examples). The *Sign In* page should appear:

		[![32]][32]

	- Browse to browse to `https://<FQDN>/federationmetadata/2007-06/federationmetadata.xml`. Internet Explorer should display the federation metadata for the service:

		[![33]][33]

### Network recommendations for WAP VMs

The network configuration for the WAP VMs closely matches that of the AD FS VMs. Use the Azure portal to configure the network interface for each WAP VM as follows:

- Give each network interface a static private IP address.

	>[AZURE.NOTE] Do not give the WAP VMs public IP addresses. See [Security considerations][security-considerations] for more details.

-	Set the IP address of the preferred and secondary DNS servers for the network interfaces to reference the AD DS VMs.

### Load balancer recommendations for the WAP VMs

Configure the load balancer for the WAP VMs follows:

- Only pass traffic appearing on port 443 (HTTPS) to the AD FS servers.

- Give the load balancer with a static IP address.

- As with the AD FS servers, create a health probe that pings port 443 using the TCP protocol rather than HTTPS.

### WAP server recommendations

>[AZURE.NOTE] **Do not join the WAP servers to the domain in the cloud.**

Perform the following tasks on each WAP server VM:

1. Import a certificate to use for authenticating the server. Store this certificate in the *Personal* store of the *Local Machine* account:

	[![34]][34]

	Note that all AD FS proxies should use the  same certificate as that installed on the AD FS computers.

2. Install the *Remote Access* role by using the *Add Roles and Features* wizard in Server Manager: 

	[![35]][35]

	Select the *Web Application Proxy* role service when prompted:

	[![36]][36]

3. When the installation has finished, click the *Notifications* flag in Server Manager and then click *Open the Web Application Proxy Wizard*:

	[![37]][37]

4. On the *Federation Server* page of the wizard, enter the DNS name of the load balancer in front of the AD FS servers (adfs.contoso.com in this example), and provide the credentials of a domain administrator account for the domain in which the AD FS servers are running:

	[![38]][38]

	>[AZURE.NOTE] These credentials are used to create the trust relationship between the WAP and the AD FS servers while the wizard is running. They are not stored or used again after the wizard has finished.

5. On the *AD FS Proxy Certificate* page, select the certificate that you imported in step 1 above:

	[![39]][39]

6. Proceed through the remaining pages, and allow the wizard to finish. When you close the wizard, the *Remote Access Management Console* should appear:

	[![40]][40]

7. If this is the first WAP server, then perform the following steps to configure the connection to the AD FS server farm:

	- In the *Tasks* pane, click *Publish*. The *Publish New Application Wizard* should start:

		[![41]][41]

	- On the *Preauthentication* page, select *Pass-through*:

		[![42]][42]

	- On the *Publishing Settings* page, provide a name for the connection (such as `AD FS`), specify the URL of the AD FS server farm for the *External URL* field (the same value is copied to the *Backend server URL* field; don't change it), and select the same certificate that you used when configuring the WAP server in step 5 above:

		[![43]][43]

		>[AZURE.NOTE] Do not select the ADFS ProxyTrust certificate.

	- On the *Confirmation* page, click *Publish*, wait for the application to be published, and then close the wizard. The connection to AD FS should be listed as a published web application in the *Remote Access management Console*:

		[![44]][44]

8. If this is not the first WAP server, then verify that that WAP server is listed as a member of the WAP cluster, and the AD FS web application appears in the list of published applications:

	[![45]][45]

9. *TBD - Check connectivity via LB*

### Recommendations for configuring trust for relying parties

An external relying party hosting a web application accessed from within the Azure VNet must trust the federation server (AD FS) in the VNet. In this case, AD FS in Azure is acting as an *account partner*.

Similarly, if a web application inside the Azure VNet is a relying party accessed by an external partner, the AD FS servers in Azure must trust the federation server of the external partner. In this situation, AD FS in Azure is performing the role of the *resource partner*.

>[AZURE.NOTE] A federation server can be both an account partner for some scenarios, and a resource partner for others. You may need to follow both sets of steps below to configure AD FS in this situation:

Perform the following steps if AD FS in Azure is acting as the account partner:

**THIS PROCEDURE TO BE VERIFIED AND TIDIED UP**
1. On the DNS server of the environment of the ADFS account federation server add a A host entry pointing to the Load balancer or the WEB application public IP address of the resource server. This because ADFS is isolated and needs to resolve the name of the WAP application proxy of partner to an IP address. Once it resolves that IP address and it sees it is an external address it will forward the request to its own WAP.
2. On the account federation server open ADFS management and right click on Add Relying Party Trusts and click start. Enter the federation metadata of resource adfs and click next for example https://pnpadfs.patternspractices.net/FederationMetadata/2007-06/FederationMetadata.xml
3. Enter display name of the account adfs
4. Select next all the way to the next steps
5. At the end you will have two options: one to edit authorization rules to accept or reject requests with claims containing values. For example only accept claims with sufix contoso.com or any other rules, to issue transformation rules


Perform the following steps if AD FS in Azure is acting as the resource partner:

**THIS PROCEDURE TO BE VERIFIED AND TIDIED UP**
1. On the DNS server of the environment of the ADFS resource federation server add a A host entry pointing to the Load balancer or the WEB application public IP address of the account federation server. This because ADFS is isolated and needs to resolve the name of the WAP application proxy of partner to an IP address. Once it resolves that IP address and it sees it is an external address it will forward the request to its own WAP.
2. On the resource federation server open ADFS management and right click on Add Claims Provider Trusts and click start. Enter the federation metadata of account adfs and click next for example https://pnpadfs.patternspractices.com/FederationMetadata/2007-06/FederationMetadata.xml
3. Enter display name of the account adfs
4. Select next all the way to the next steps
5. At the end you will have two options: one to edit authorization rules to accept or reject requests with claims containing values. For example only accept claims with sufix contoso.com or any other rules, to issue transformation rules

For more information see [Establishing Federation Trust][establishing-federation-trust].

### Network security recommendations for the web tier subnet

AD FS is heavily dependent on the HTTPS protocol, so make sure that the NSG rules for the subnet containing the web tier VMs permit HTTPS requests. These requests can originate from the on-premises network, the subnets containing the web tier, business tier, data tier, private DMZ, and public DMZ, as well as the subnet containing the AD FS servers.

## Solution components


## Deploying the sample solution

*This section TBC*

The solution assumes the following prerequisites:

- You have an existing on-premises infrastructure, including a VPN server that can support IPSec connections.

- You have installed the latest version of the Azure CLI. [Follow these instructions for details][cli-install].

- If you're deploying the solution from Windows, you must install a tool that provides a bash shell, such as [GitHub Desktop][github-desktop].

To run the script that deploys the solution:

1. Download the [azuredeploy.sh][azuredeploy-script] script to your local computer.

2. ...

9. Open a bash shell and move to the folder containing the azuredeploy.sh script.

10. Log in to your Azure account. In the bash shell enter the following command:

	```cli
    azure login
	```

	Follow the instructions to connect to Azure.

11. Run the following command to set your current subscription to the value specified in step 4 above. Replace *nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn* with the subscription ID:

	```cli
	azure account set nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn
	```

12. Run the command `./azuredeploy.sh`.

13. Verify that the script completes successfully. You can simply re-run the script if an error occurs.

14. Browse to the Azure portal and verify that the following resource groups have been created:

	- **... .**

### Customizing the solution

*TBD*


## Availability considerations

Create different availability sets for the AD FS and WAP servers. Ensure that there are at least two servers in each set. 

*AD FS availability notes?*

*WAP server availability notes?*

*Using SQL Server rather than WID?*

## Security considerations

Prevent direct exposure of the AD FS servers to the Internet. AD FS are domain-joined computers that have full authorization to grant security tokens. If an AD FS server is compromised, a malicious user has the ability to issue full access tokens to all web applications and to federation servers that are protected by AD FS. If your system must handle requests from external users not necessarily connecting from trusted partner sites, use WAP servers to handle these requests. Do not domain-join these WAP servers. For more information, see [Where to Place a Federation Server Proxy][where-to-place-an-fs-proxy].

Place AD FS servers and WAP servers in separate subnets with their own firewalls. You can use NSG rules to define a simple firewall. If you require more comprehensive protection you can implement an additional security perimeter around servers by using a pair of subnets and NVAs, as described by the document [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access]. Note that all firewalls should allow traffic on port 443 (HTTPS).

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



[cli-install]: https://azure.microsoft.com/documentation/articles/xplat-cli-install
[github-desktop]: https://desktop.github.com/


[0]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure1.png "Secure hybrid network architecture with Active Directory"
[19]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure20.png "Setting the IP address for the AD FS load balancer"
[20]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure21.png "Creating a DNS record and domain name for the AD FS load balancer"
[21]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure22.png "Creating the AD FS service account"
[22]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure23.png "Installing the Web Server role"
[23]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure24.png "Installing the Active Directory Federation Services role"
[24]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure25.png "Creating the first federation server in the AD FS farm"
[25]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure26.png "Specifying a domain administrator account for configuring AD FS"
[26]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure27.png "Specifying the SSL certificate and federation service display name"
[27]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure28.png "Specifying the dedicated account for the federation service"
[28]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure29.png "Specifying the configuration database for the federation service"
[29]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure30.png "Configuring the federation service"
[30]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure31.png "Adding the server to an existing federation server farm"
[31]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure32.png "Specifying the primary server in the federation server farm"
[32]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure33.png "The sign-in page generated by AD FS"
[33]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure34.png "The federation metadata generated by AD FS"
[34]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure35.png "Importing the authentication certificate into the Personal store in the Local machine account"
[35]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure36.png "Installing the Remote Access role"
[36]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure37.png "Selecting the Web Application Proxy role service"
[37]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure38.png "Starting the Web Application Proxy Wizard"
[38]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure39.png "Specifying the details for connecting to the the AD FS farm"
[39]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure40.png "Selecting the AD FS server authentication certificate"
[40]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure41.png "The Remote Access Management Console"
[41]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure42.png "The Publish New Application Wizard"
[42]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure43.png "Selecting the Pass-through preauthentication option"
[43]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure44.png "Specifying the publish settings"
[44]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure45.png "The Remote Access Management Console showing the AD FS web application"
[45]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure46.png "The Remote Access Management Console showing the cluster and the AD FS web application"
