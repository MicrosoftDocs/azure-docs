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
   ms.date="06/27/2016"
   ms.author="telmos"/>

# Implementing a secure hybrid network architecture with federated identities in Azure

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for implementing a secure hybrid network that extends your on-premises network to Azure, but that also uses [Active Directory Federation Services (AD FS)][active-directory-federation-services] to perform federated authentication and authorizations for components running in the cloud. This architecture extends the structure described by [Implementing a secure hybrid network architecture with Active Directory identities in Azure][implementing-active-directory].

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.

Applications running in Azure can use Active Directory Domain Services (AD DS) to authenticate and authorize identities co-located within the same security domain. If an application requires access to external resources managed by partner organizations, you can use AD FS to implement federation; AD running locally within Azure provides the authentication services, and AD FS passes the details of authenticated identities making requests to the partner organization which can determine whether to authorize these requests. 

Federation can also operate in the other direction; an application running inside a partner organization can request access to resources held as part of your system in Azure. In this case, the partner organization is responsible for handling authentication, and passes the details of the authenticated identity to AD FS which can make the decision to authorize a request. In order for these scenarios to work, the partner organization must trust your AD FS to provide it with authenticated identities, and your AD FS must likewise trust the authentication performed by the partner organization.

Finally, it is also possible to use AD FS in conjunction with AD DS to authenticate and authorize requests made from outside of the cloud application or partner organizations. For example, a web application running in the Internet may be able to request access. To support this scenario, you must configure AD FS and AD DS carefully to protect your resources from malicious traffic.

AD FS can run on-premises, but in a hybrid scenario where elements of an application are located in Azure it can be more efficient to replicate this functionality in the cloud. Typical use cases for this architecture include:

- Hybrid applications where workloads run partly on-premises and partly in Azure.

- Solutions that utilize federated authorization involving access to external resources managed by partner organizations.

- Systems that expose resources to partner organizations.

- Systems that enable requests from authorized external users that do not belong to partner organizations.

## Architecture diagram

The following diagram highlights the important components in this architecture (*click to zoom in*). For more information about the greyed-out elements, read [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture], [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access], and [Implementing a secure hybrid network architecture with Active Directory identities in Azure][implementing-active-directory]:

[![0]][0]

- **On-premises network.** The on-premises network includes local AD DS and AD FS servers that can perform authentication and authorization for components located on-premises.

- **AD DS Servers.** These are domain controllers running as VMs in the cloud. These servers can provide authentication of components running in the web tier, business tier, and data tier subnets. It can also authorize access to local resources that belong to the application and are managed by the system rather than by a partner organization.

- **Active Directory subnet.** The AD DS servers are bounded in a separate subnet. NSG rules help to protect the AD DS servers and can provide a firewall against traffic from unexpected sources.

- **Azure Gateway and AD synchronization.**. The Azure gateway provides a connection between the on-premises network and the Azure VNet. This can be a [VPN connection][azure-vpn-gateway] or [Azure ExpressRoute][azure-expressroute]. All synchronization requests between the AD FS servers in the cloud and on-premises pass through the gateway. User-defined routes (UDRs) handle routing for synchronization traffic which passes directly to the AD FS server in the cloud and does not pass through the NVAs.

	For more information about configuring UDRs and the NVAs, see [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture].

>[AZURE.NOTE] The following items are optional and only apply to solutions that comprise [claims-aware applications]. Note that the diagram depicts the relationships between components but is not intended to illustrate the flow of control. For more information, see [Active Directory Federation Services Overview][active-directory-federation-services-overview].

- **AD FS servers.** The AD FS servers handle federated authorization. They perform two tasks:

	1. They handle authorization requests from the application running in the cloud for resources managed by partner organizations. The AD FS server passes access requests (which have been authenticated by using the AD DS servers) to the resource partner which authorizes or denies access. The AD FS servers are referred to as *account partners* because they submit access requests on behalf of authenticated accounts.

	2. They authorize incoming requests from partner organizations that need access to resources held in the cloud. Note that the AD FS servers are not exposed directly to the outside world, rather all traffic is received through AD FS proxy servers and a DMZ.

	The AD FS servers are configured as a farm, prefixed by an Azure load balancer. This structure helps to improve availability and scalability.

- **Active Directory Federation Services subnet.** The AD DS servers can be contained within their own subnet, with NSG rules acting as a basic firewall.

- **AD FS DMZ inbound and outbound subnets, and NVAs.** These components provide a more substantial security perimeter, protecting the AD FS subnet from rogue traffic received through the AD FS proxy servers. The principle used is similar to that implemented for protecting the system from Internet traffic, described by the document  [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access].

- **Resource partner.** The resource partner is a trusted partner organization which owns or manages external resources. An authorization service (which could be AD FS, but does not have to be) at the resource partner site receives requests from an account partner and issues a security token which contains information about whether access has been authorized. This information is structured as a set of *claims*. If access has been granted, the application running in the cloud can use the resources requested. The application must include a token with each request proving that it has been previously authorized.

	>[AZURE.NOTE] There must be a trust relationship between the AD FS servers running in the cloud and the AD FS server running in the resource partner; the resource partner must trust the AD FS server of the account partner to provide valid, authenticated identities.

- **AD FS proxy servers.** These computers act as AD FS servers for incoming requests from partner organizations and external users. The AD FS proxy servers act as a filter, protecting the AD FS servers from direct access from the public Internet. As with the AD FS servers, deploying the proxy servers in a farm with load balancing gives you greater availability and scalability than deploying a collection of stand-alone servers.

	>[AZURE.NOTE] You can also configure a VPN tunnel using Azure Gateway to provide direct access to AD FS for trusted partners. Requests received from these partners do not pass through the AD FS proxy servers.

- **AD FS Proxy DMZ inbound and outbound subnets, and NVAs.** These components implement a security perimeter around the AD FS proxy subnet, helping to protect it from unauthorized Internet traffic.

## Recommendations

This section summarizes recommendations for implementing AD DS and AD FS running in the cloud, covering:

- Creating the VMs for hosting AD DS and AD FS.

- Configuring the network settings for the AD DS VMs.

- Options for implementing AD DS.

- Synchronizing the AD servers.

- Configuring the network settings for the AD FS VMs.

- Configuring the load balancer for the AD FS VMs.

- Installing and configuring AD FS.

- Configuring the network settings for the AD FS proxy VMs.

- Configuring the load balancer for the AD FS proxy VMs.

- Installing and configuring AD FS proxy servers.

### VM recommendations for hosting AD DS and AD FS ###

Create VMs with sufficient resources to handle the expected volume of traffic. Use the size of the machines hosting AD DS and AD FS on premises as a starting point. Monitor the resource utilization; you can resize the VMs and scale down if they are too large. For more information about sizing AD DS, see [Capacity Planning for Active Directory Domain Services][capacity-planning-for-adds]

### Network recommendations for AD DS VMs

Configure the network interface for each of the VMs hosting AD DS with static private IP addresses (10.0.4.4 in the example shown below). This configuration better supports DNS on each of the AD DS VMs. Do this by using the Azure portal:

[![1]][1]

> [AZURE.NOTE] Do not give the AD FD VMs public IP addresses. See [Security considerations][security-considerations] for more details.

Also, set the IP address of the primary DNS server for the network interface for each AD DS VM to reference the on-premises domain controller (10.2.0.4 in the following image). This step is required, otherwise the VM will not be able to locate the on-premises domain controller and will be unable to join the domain.

[![2]][2]

After changing these settings, restart the VM.

Note that the IP settings still appear to the VM to be dynamic, although the DHCP service provided by Azure will ensure that the same addresses are provided to the VM each time in starts. This can cause the system to generate some warnings about using dynamic IP addresses when installing DNS on the VM. You can safely ignore these warnings. 

> [AZURE.NOTE] You can also configure the IP settings within each VM by modifying the network adapter settings and setting the TCP/IP properties, as illustrated in the image below.
>
>[![3]][3]
>
> Be warned that if you misconfigure the network adapter in the VM, you may lose connectivity and not be able to reconnect; setting the IP address using the Azure portal is a lot more forgiving.

### AD DS recommendations ###

Install Active Directory Domain Services on the AD DS servers in the cloud by using the *Add Roles and Features* wizard in Server Manager:

[![4]][4]

After installation, click the *Notifications* flag in Server Manager and then click *Promote this server to a domain controller* to start the *Active Directory Domain Services Configuration Wizard*:

[![5]][5]

The following sections provide more information about the Domain Services configuration options.

#### Configuring the first AD DS server in the cloud ####

For the first AD DS server you can use any of the three available options highlighted in the following image:

[![6]][6]

- Select *Add a domain controller to an existing domain* to make the domain controller part of a domain already configured on-premises. AD DS will automatically replicate changes made in the on-premises domain controller to this server, and vice versa. Unless you have a specific security reason not to do so, this is the preferred option. The following steps summarize the important configuration selections when using this option:

	1. On the *Deployment Configuration* page of the wizard, specify the name of the domain to join (contoso.com in the image shown below), and click *Change* to provide the credentials of an administrative account that has authority to add controllers to the domain:

		[![7]][7]

	2. On the *Domain Controller Options* page, select the *Domain Name System (DNS) server* and *Global Catalog (GC)* capabilities, and provide a password to enable you to restore the AD DS directory on this VM if necessary:

		[![8]][8]

	3. If the *DNS Options* page displays a warning about being unable to create a delegation for the DNS server, consult with the operations staff about whether DNS delegation is required. This will only be necessary if access is required to the domain controller in the cloud from outside the domain (maybe from another domain in the on-premises network).

	4. On the *Additional Options* page, replicate from the on-premises domain controller:

		[![9]][9]

	5. On the *Path* page, unless you have good reason to do otherwise, select the default locations for the AD database, log files, and SYSVOL folder:

		[![10]][10]

	6. On the *Prerequisites Check* page, if you have configured the IP address and DNS settings using the Azure portal as recommended by the [Network configuration recommendations for AD DS VMs][ad_network_recommendations] section, you will receive a warning that the computer does not have a static IP address. You can safely ignore this warning, for the reasons described in the earlier section:

		[![11]][11]

	7. Allow the VM to restart when the wizard has finished. The VM should now be a domain controller. You can verify this by logging on to the VM once it has rebooted. Using the Active Directory Users and Computers management tool, browse to the directory (contoso.com), and click *Domain Controllers*. Your VM should be listed:

		[![12]][12]

		Note that the *Deployment Wizard* changes the DNS settings for the network adapter on the VM and adds the current computer as an alternate DNS server:

		[![13]][13]

		To enable you to manage the DNS settings from Azure, reset this option to *Obtain DNS server address automatically*, and then use the Azure portal to set the DNS servers for the network interface:

		[![14]][14]

		Restart the VM after making these changes.

- Select *Add a new domain to an existing forest* to create a new domain within a forest already created on-premises. Use this option if you need to implement different security or access policies on-premises and in the cloud. AD DS will not automatically replicate changes across domains, so you must perform this task manually. The wizard performs similar steps to the *Add a domain controller to an existing domain* option, with the following exceptions:

	- You specify the domain type (Child Domain or Tree Domain), together with the name of the existing parent domain (on-premises) and the name of the new domain to create:

		[![15]][15]

		>[AZURE.NOTE] A child domain forms an extension to the namespace of the parent domain. In the example shown in the image, the full name of the new child domain is cloud.contoso.com. A tree domain does not form part of the same namespace as the parent, and instead forms a separate standalone namespace.

	- You must also verify the NetBIOS name that will be assigned to the new domain. You should keep this as close to the directory name as possible, to avoid confusion:

		[![16]][16]

- Select *Add a new forest* if you need to maintain separation between the on-premises domain(s) and that used in the cloud. This could be for security purposes, or as the result of regulatory requirements in your territory. Again, AD DS will not replicate changes across forests, so you must perform this task manually. 

	The *Deployment Wizard* creates an entirely new and independent installation of Active Directory on your server. You are prompted for the root domain name of the new forest to create:

	[![17]][17]

	Most of the remaining steps are similar those performed by the previous two options.

For more information about the concepts surrounding Active Directory domains and forests, see [What Are Domains and Forests?][domain_and_forests].

#### Adding subsequent AD DS servers in the cloud ####

Add all subsequent AD DS servers in the cloud as domain controllers that are part of the same domain as the first. This approach will improve availability of the AD DS service. 

When you configure the additional domain controllers, note that you don't have to install DNS with each controller, although doing so can help to reduce the chances of a name resolution failure if one instance of DNS should become unavailable. If you choose not to install DNS, make sure that the DNS server settings for the network interface in the Azure portal reference valid DNS services in the domain. Ideally specify the address of one of the domain controllers in the cloud that is running DNS as the primary server, with the on-premises DNS server as the secondary, as shown in the previous section.

Spread the Active Directory replication load evenly. Don't synchronize all domain controllers with the same server. For example, synchronize with one of the other domain controllers in the cloud rather than the on-premises controller:

[![18]][18]

### Active Directory synchronization recommendations ###

Synchronization between domain controllers in the same domain is automatic, although there may a delay while changes are propagated. Therefore, if your domain controllers in the cloud are part of the same domain used in premises, you do not need to perform any additional configuration. However, you must ensure that synchronization traffic can flow freely between the AD DS servers in the cloud and on-premises:

- Add NSG rules to the AD DS subnet that permit incoming traffic from on-premises. For detailed information on the ports that AD DS utilizes, see [Active Directory and Active Directory Domain Services Port Requirements][ad-ds-ports].

- Add UDR rules to the gateway subnet that route requests arriving from the on-premises network directly to the AD DS server in the cloud, bypassing the NVAs.

If you have created a new domain or forest in the cloud, separate from that used on premises, you will have to perform synchronization manually. This task typically involves using [PowerShell with the Active Directory cmdlets][powershell-ad] to export data from one domain into a file, transporting the file to the new domain, and then using PowerShell to import the data.

> [AZURE.NOTE] It is not possible to simply copy the AD database files to a new server and use these files to run AD. This is for security reasons; the identifiers and other information held in an AD database are tied to a specific AD server. This helps to prevent spoofing of AD servers.

### Network recommendations for AD FS VMs ###

Using the Azure portal, configure the network interface for each of the VMs hosting AD FS with static private IP addresses.

[AZURE.NOTE] Do not give the AD FS VMs public IP addresses. See [Security considerations][security-considerations] for more details.

Also, use the Azure portal to set the IP address of the preferred and secondary DNS servers for the network interfaces for each AD FS VM to reference the DNS servers in the cloud. This step is necessary to enable each AD FS VM to join the domain.

### Load balancer recommendations for the AD FS VMs ###

The internal load balancer in the AD FS subnet provides access to the AD FS servers. Configure the load balancer as follows:

- Only pass traffic appearing on port 443 (HTTPS) to the AD FS servers.

- Give the load balancer with a static IP address:

	[![19]][19]

- *Health Probe - use federation metadata endpoint? - TBC*

Using the *DNS Manager* console on the instance of AD DS running DNS, add an *A* record for the load balancer to the domain. Specify the IP address of the load balancer, and give it a name in the domain (adfs.contoso.com in the image shown below). This is the name by which clients will access the AD FS server farm.

[![20]][20]

### AD FS recommendations ###

Perform the following tasks before configuring the first AD FS server in the farm:

1. Obtain a publicly trusted certificate for performing server authentication. The *subject name* and *subject alternative name* must contain the name by which clients access the federation service. This can be the DNS name registered for the load balancer, for example, adfs.contoso.com, or an appropriate wildcard such as *.contoso.com. You should use the same certificate on all AD FS server VMs. You can purchase a certificate from a trusted certification authority, but if your organization uses Active Directory Certificate Services you can create your own. For more information, see [Obtain and Configure an SSL Certificate for AD FS][adfs_certificates].

2. [Create and configure a dedicated service account][create_service_account_for_adfs_farm] for running the servers in the federation server farm. Perform this operation using the *Active Directory Users and Computers* console on one of the AD DS domain controllers (unless you have already joined the AD DS server to the domain). Make sure that the password policy for this service is set to *Password never expires*.

	[![21]][21]

	>[AZURE.NOTE] Do not use the Network Service account for the AD FS service because it can result in random failures as a result of Kerberos tickets not validating from one server to another.

3. On the domain controller, use the following PowerShell command to register the Service Principal Name (SPN) that will be used to access the server farm. Specify that the AD FS service will use the service account created in the previous step. For example:

	```powershell
	setspn -a host/adfs.contoso.com ADFSService
	```

	In this example, adfs.contoso.com is the DNS name of the load balancer in front of the AD FS servers, and ADFSService is the service account that will be used by the AD FS service. 

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

	- On the *Specify Service Account* page, select *Use an existing domain user account or group Managed Service Account*, and provide the account name of the dedicated service account and password, created earlier:

		[![27]][27]

	- On the *Specify Configuration Database* page, select *Create a database on this server using Windows Internal Database*:

		[![28]][28]

	- Proceed through the remaining pages, allow the installation to finish, and then run the following PowerShell command:

		```powershell
 		set-AdfsProperties -EnableIdPInitiatedSignonPage $true
		```

7. If this is not the first AD FS server VM in the AD FS server farm, perform the following steps:

	- On the *Welcome* page, select *Add federation server to a federation farm*:

		[![30]][30]

	- On the *Connect to Active Directory Domain Services*, specify an account with domain administrator privileges.

	- On the *Specify Farm* page, select *Specify the primary federation server in an existing farm using Windows Internal Database*, and enter the name of the first federation server in the farm (created earlier). Be sure to provide the name of the VM (myapp-adfs-vm1.contoso.com in the example below), and not the name of the farm (adfs.contoso.com):

		[![31]][31]

	- On the *Specify Certificate* page, import the certificate to use for authenticating the server. Note that all AD FS servers in the farm should use the same certificate.

	- On the *Specify Service Account* page, provide the account name of the dedicated service account and password, created earlier.

8. Verify that the AD FS server farm has been correctly installed as follows:

	- Using Internet Explorer on any VM in the cloud, browse to `https://<FQDN>/adfs/ls/IdpInitiatedSignon.aspx`, where <FQDN> is the DNS name assigned to the load balancer (adfs.contoso.com in the previous examples). The *Sign In* page should appear:

		[![32]][32]

	- Browse to browse to `https://<FQDN>/federationmetadata/2007-06/federationmetadata.xml`. Internet Explorer should display the federation metadata for the service:

		[![33]][33]

### Network recommendations for AD FS proxy VMs ###

The network configuration for the AD FS proxy VMs closely matches that of the AD FS VMs. Use the Azure portal to configure the network interface for each AD FS proxy VM as follows:

- Give each network interface a static private IP address.

	>[AZURE.NOTE] Do not give the AD FS proxy VMs public IP addresses. See [Security considerations][security-considerations] for more details.

-	Set the IP address of the preferred and secondary DNS servers for the network interfaces to reference the DNS servers in the cloud.

### Load balancer recommendations for the AD FS proxy VMs ###

Configure the load balancer for the AD FS proxy VMs follows:

- Only pass traffic appearing on port 443 (HTTPS) to the AD FS servers.

- Give the load balancer with a static IP address.

- *Health Probe - use federation metadata endpoint? - TBC*

### AD FS proxy server recommendations ###

>[AZURE.NOTE] **Do not join the AD FS proxy servers to the domain in the cloud.**

Perform the following tasks on each AD FS proxy server VM:

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

	>[AZURE.NOTE] These credentials are used to create the trust relationship between the proxy and the AD FS servers while the wizard is running. They are not stored or used again after the wizard has finished.

5. On the *AD FS Proxy Certificate* page, select the certificate that you imported in step 1 above:

	[![39]][39]

6. Proceed through the remaining pages, and allow the wizard to finish. When you close the wizard, the *Remote Access Management Console* should appear:

	[![40]][40]

7. If this is the first AD FS proxy, then perform the following steps to configure the connection to the AD FS server farm:

	- In the *Tasks* pane, click *Publish*. The *Publish New Application Wizard* should start:

		[![41]][41]

	- On the *Preauthentication* page, select *Pass-through*:

		[![42]][42]

	- On the *Publishing Settings* page, provide a name for the connection (such as `AD FS`), specify the URL of the AD FS server farm for the *External URL* field (the same value is copied to the *Backend server URL* field; don't change it), and select the same certificate that you used when configuring the AD FS proxy in step 5 above:

		[![43]][43]

		>[AZURE.NOTE] Do not select the ADFS ProxyTrust certificate.

	- On the *Confirmation* page, click *Publish*, wait for the application to be published, and then close the wizard. The connection to AD FS should be listed as a published web application in the *Remote Access management Console*:

		[![44]][44]

8. If this is not the first AD FS proxy, then verify that that AD FS proxy is listed as a member of the proxy cluster, and the AD FS web application appears in the list of published applications:

	[![45]][45]

9. *TBD - Check connectivity via LB*

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

Create different availability sets for the AD DS, AD FS, and AD FS proxy servers. Ensure that there are at least two servers in each set. 

The AD DS servers in the cloud should be domain controllers within the same domain. This will enable automatic replication between servers. The domain does not necessarily have to be the same as that used on-premises, or even part of the same forest.

*AD FS availability notes?*

*AD FS proxy server availability notes?*

*Using SQL Server rather than WID?*

## Security considerations

Prevent direct exposure of the AD DS and AD FS servers to the Internet. AD DS servers handle authentication and are therefore very sensitive items. AD FS are domain-joined servers that have full authorization to grant security tokens. If an AD FS server is compromised, a malicious user has the ability to issue full access tokens to all web applications and to federation servers that are protected by AD FS. If your system must handle requests from external users not necessarily connecting from trusted partner sites, use AD FS proxy servers to handle these requests. Do not domain-join these proxy servers. For more information, see [Where to Place a Federation Server Proxy][where-to-place-an-fs-proxy].

Place AD DS servers, AD FS servers, and AD FS proxy servers in separate subnets with their own firewalls. You can use NSG rules to define a simple firewall. If you require more comprehensive protection you can implement an additional security perimeter around servers by using a pair of subnets and NVAs, as described by the document [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access]. Note that all firewalls should allow traffic on port 443 (HTTPS).

## Scalability considerations

Use a farm configuration for the AD FS servers and AD FS proxy servers. This enables you to scale out by adding more servers to each farm. The following recommendations, adapted from the document [Plan your AD FS deployment][plan-your-adfs-deployment], give a starting point for sizing the farms:

- If you have fewer than 1000 users, do not create dedicated AD FS servers, but instead install AD FS on each of the AD DS servers in the cloud (make sure that you have at least two AD DS servers, to maintain availability). Create a single AD FS proxy server.

- If you have between 1000 and 15000 users, create two dedicated AD FS servers and two dedicated AD FS proxy servers.

- If you have between 15000 and 60000 users, create between three and five dedicated AD FS servers, and at least two dedicated AD FS proxy servers.

These figures assume you are using quad-core VMs (D3_V2 Standard, or better) to host the servers in Azure.

Note that if you are using the Windows Internal Database to store AD FS configuration data, you are limited to eight AD FS servers in the farm. If you anticipate needing more, then use SQL Server. For further information, see [The Role of the AD FS Configuration Database][adfs-configuration-database].

## Management considerations

Do not copy the VHD files of domain controllers instead of performing regular backups because restoring them can result in inconsistencies in state between domain controllers.

Shut down and restart a VM that runs the domain controller role in Azure within the guest operating system instead of using the Shut Down option in the Azure Portal. Using the Azure Portal to shut down a VM causes the VM to be deallocated. This action resets the VM-GenerationID, which is undesirable for a DC. When the VM-GenerationID is reset, the invocationID of the AD DS database is also reset, the RID pool is discarded, and SYSVOL is marked as non-authoritative.

*TBC*

## Monitoring considerations

*TBC*

<!-- links -->

[implementing-active-directory]: ./guidance-iaas-ra-secure-vnet-ad.md
[resource-manager-overview]: ../resource-group-overview.md

[0]: ./media/guidance-iaas-ra-secure-vnet-ad/figure1.png "Secure hybrid network architecture with Active Directory"
[19]: ./media/guidance-iaas-ra-secure-vnet-ad/figure20.png "Setting the IP address for the AD FS load balancer"
[20]: ./media/guidance-iaas-ra-secure-vnet-ad/figure21.png "Creating a DNS record and domain name for the AD FS load balancer"
[21]: ./media/guidance-iaas-ra-secure-vnet-ad/figure22.png "Creating the AD FS service account"
[22]: ./media/guidance-iaas-ra-secure-vnet-ad/figure23.png "Installing the Web Server role"
[23]: ./media/guidance-iaas-ra-secure-vnet-ad/figure24.png "Installing the Active Directory Federation Services role"
[24]: ./media/guidance-iaas-ra-secure-vnet-ad/figure25.png "Creating the first federation server in the AD FS farm"
[25]: ./media/guidance-iaas-ra-secure-vnet-ad/figure26.png "Specifying a domain administrator account for configuring AD FS"
[26]: ./media/guidance-iaas-ra-secure-vnet-ad/figure27.png "Specifying the SSL certificate and federation service display name"
[27]: ./media/guidance-iaas-ra-secure-vnet-ad/figure28.png "Specifying the dedicated account for the federation service"
[28]: ./media/guidance-iaas-ra-secure-vnet-ad/figure29.png "Specifying the configuration database for the federation service"
[29]: ./media/guidance-iaas-ra-secure-vnet-ad/figure30.png "Configuring the federation service"
[30]: ./media/guidance-iaas-ra-secure-vnet-ad/figure31.png "Adding the server to an existing federation server farm"
[31]: ./media/guidance-iaas-ra-secure-vnet-ad/figure32.png "Specifying the primary server in the federation server farm"
[32]: ./media/guidance-iaas-ra-secure-vnet-ad/figure33.png "The sign-in page generated by AD FS"
[33]: ./media/guidance-iaas-ra-secure-vnet-ad/figure34.png "The federation metadata generated by AD FS"
[34]: ./media/guidance-iaas-ra-secure-vnet-ad/figure35.png "Importing the authentication certificate into the Personal store in the Local machine account"
[35]: ./media/guidance-iaas-ra-secure-vnet-ad/figure36.png "Installing the Remote Access role"
[36]: ./media/guidance-iaas-ra-secure-vnet-ad/figure37.png "Selecting the Web Application Proxy role service"
[37]: ./media/guidance-iaas-ra-secure-vnet-ad/figure38.png "Starting the Web Application Proxy Wizard"
[38]: ./media/guidance-iaas-ra-secure-vnet-ad/figure39.png "Specifying the details for connecting to the the AD FS farm"
[39]: ./media/guidance-iaas-ra-secure-vnet-ad/figure40.png "Selecting the AD FS server authentication certificate"
[40]: ./media/guidance-iaas-ra-secure-vnet-ad/figure41.png "The Remote Access Management Console"
[41]: ./media/guidance-iaas-ra-secure-vnet-ad/figure42.png "The Publish New Application Wizard"
[42]: ./media/guidance-iaas-ra-secure-vnet-ad/figure43.png "Selecting the Pass-through preauthentication option"
[43]: ./media/guidance-iaas-ra-secure-vnet-ad/figure44.png "Specifying the publish settings"
[44]: ./media/guidance-iaas-ra-secure-vnet-ad/figure45.png "The Remote Access Management Console showing the AD FS web application"
[45]: ./media/guidance-iaas-ra-secure-vnet-ad/figure46.png "The Remote Access Management Console showing the cluster and the AD FS web application"




[guidance-vpn-gateway]: ./guidance-hybrid-network-vpn.md
[script]: #sample-solution-script
[implementing-a-multi-tier-architecture-on-Azure]: ./guidance-compute-3-tier-vm.md
[active-directory-domain-services]: https://technet.microsoft.com/library/dd448614.aspx
[active-directory-federation-services]: https://technet.microsoft.com/windowsserver/dd448613.aspx
[azure-active-directory]: ../active-directory-domain-services/active-directory-ds-overview.md
[azure-ad-connect]: ../active-directory/active-directory-aadconnect.md
[architecture]: #architecture_diagram
[security-considerations]: #security-considerations
[recommendations]: #recommendations
[azure-vpn-gateway]: https://azure.microsoft.com/documentation/articles/vpn-gateway-about-vpngateways/
[azure-expressroute]: https://azure.microsoft.com/documentation/articles/expressroute-introduction/
[claims-aware applications]: https://msdn.microsoft.com/en-us/library/windows/desktop/bb736227(v=vs.85).aspx
[active-directory-federation-services-overview]: https://technet.microsoft.com/en-us/library/hh831502(v=ws.11).aspx
[capacity-planning-for-adds]: http://social.technet.microsoft.com/wiki/contents/articles/14355.capacity-planning-for-active-directory-domain-services.aspx
[ad-ds-ports]: https://technet.microsoft.com/library/dd772723(v=ws.11).aspx
[where-to-place-an-fs-proxy]: https://technet.microsoft.com/library/dd807048(v=ws.11).aspx
[powershell-ad]: https://technet.microsoft.com/en-us/library/ee617195.aspx
[plan-your-adfs-deployment]: https://msdn.microsoft.com/library/azure/dn151324.aspx
[ad_network_recommendations]: #network_configuration_recommendations_for_AD_DS_VMs
[domain_and_forests]: https://technet.microsoft.com/library/cc759073(v=ws.10).aspx
[adfs_certificates]: https://technet.microsoft.com/library/dn781428(v=ws.11).aspx
[create_service_account_for_adfs_farm]: https://technet.microsoft.com/library/dd807078.aspx
[import_server_authentication_certificate]: https://technet.microsoft.com/library/dd807088.aspx
[adfs-configuration-database]: https://technet.microsoft.com/en-us/library/ee913581(v=ws.11).aspx


