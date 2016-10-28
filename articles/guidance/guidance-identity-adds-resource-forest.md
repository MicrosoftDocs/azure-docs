<properties
   pageTitle="Creating an Active Directory Domain Services (AD DS) resource forest in Azure | Microsoft Azure"
   description="How to create a trusted Active Directory domain in Azure."
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
   ms.date="10/27/2016"
   ms.author="telmos"/>

# Creating an Active Directory Domain Services (AD DS) resource forest in Azure

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes how to create an Active Directory domain in Azure that is separate from, but trusted by, domains in your on-premises forest.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.

Active Directory Domain Services (AD DS) is a distributed database service that stores identity information about users, devices, and other resources in a hierarchical structure. The top node the hierarchical structure is known as a forest. A forest contains domains, and domains contain other types of objects.

AD DS supports the creation of trust relationships between top level forest objects to provide interoperability between domains. That is, logons in one domain can be trusted in other domains to provide access to resources.

This reference architecture demonstrates how to create an AD DS forest in Azure with a one-way outgoing trust relationship with on-premises Azure. The forest in Azure contains a domain that does not exist on-premises, but due to the trust relationship, logons made against on-premises domains can be trusted for access to resources in the separate Azure domain.  

Typical use cases for this architecture include maintaining security separation for objects and identities held in the cloud, and migrating individual domains from on-premises to the cloud.

## Architecture diagram

The following diagram highlights the important components in this architecture. For more information about the grayed-out elements, read [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture] and [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access]:

[![0]][0]

- **On-premises network.** The on-premises network contains its own AD forest and domains.

- **AD Servers.** These are domain controllers implementing directory services (AD DS) running as VMs in the cloud. These servers host a forest containing one or more domains, separate from those located on-premises.

- **One-way trust relationship.** The example in the diagram shows a one-way trust from the domain in the cloud to the on-premises domain. This relationship enables on-premises users to access resources in the domain in the cloud, but not the other way around. It is possible to create a two-way trust if cloud users also require access to on-premises resources.

- **Active Directory subnet.** The AD DS servers are hosted in a separate subnet. NSG rules protect the AD DS servers and provide a firewall against traffic from unexpected sources.

- **Web tier subnet**, **Business tier subnet**, and **Data tier subnet**. These subnets host the servers and components that run applications in the cloud. For more information, see [Running VMs for an N-tier architecture on Azure][running-VMs-for-an-N-tier-architecture-on-Azure]. The resources and VMs in this subnet are contained within the cloud domain.

- **Azure Gateway**. The Azure gateway provides a connection between the on-premises network and the Azure VNet. This can be a [VPN connection][azure-vpn-gateway] or [Azure ExpressRoute][azure-expressroute]. For more information, see [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture].

## Recommendations

This section provides a list of recommendations based on the essential components required to implement the basic architecture. These recommendations cover:

- ADDS settings, and

- Trust relationship configuration.

You might have additional or differing requirements from those described here. You can use the items in this section as a starting point for considering how to customize the architecture for your own system.

### ADDS recommendations

For specific recommendations on implementing Active Directory in the cloud, refer to the document [Extending Active Directory to Azure][extending-ad-to-azure]. The article [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines][ad-azure-guidelines] contains additional detailed information.

### Trust recommendations

The on-premises domains are contained within a different forest from the domains in the cloud. To enable authentication of on-premises users in the cloud, the domains in the cloud must trust the logon domain in the on-premises forest. Similarly, if the cloud provides a logon domain for external users, it may be necessary for the on-premises forest to trust the cloud domain.

You can establish trusts at the forest level by [creating forest trusts][creating-forest-trusts], or at the domain level by [creating external trusts][creating-external-trusts]. A forest level trust creates a relationship between all domains in two forests. An external domain level trust only creates a relationship between two specified domains. You should only create external domain level trusts between domains in different forests.

Trusts can be unidirectional (one-way) or bidirectional (two-way):

- A one-way trust enables users in one domain or forest (known as the *incoming* domain or forest) to access the resources held in another (the *outgoing* domain or forest). 

- A two-way trust enables users in either domain or forest to access resources held in the other.

The following table summarizes trust configurations for some simple scenarios:

| Scenario | On-premises trust | Cloud trust |
|----------|-------------------|-------------|
| On-premises users require access to resources in the cloud, but not vice versa | One-way, incoming | One-way, outgoing |
| Users in the cloud require access to resources located on-premises, but not vice versa | One-way, outgoing | One-way, incoming |
| Users in the cloud and on-premises both requires access to resources held in the cloud and on-premises | Two-way, incoming and outgoing | Two-way, incoming and outgoing |

## Scalability considerations

AD is automatically scalable for domain controllers that are part of the same domain. Requests are distributed across all controllers within a domain. You can add another domain controller, and it synchronizes automatically with the domain. Do not configure a separate load balancer to direct traffic to controllers within the domain. Ensure that all domain controllers have sufficient memory and storage resources to handle the domain database. Make all domain controller VMs the same size.

## Availability considerations

Implement at least two domain controllers for each domain. This enables automatic replication between servers. Create an availability set for the VMs acting as AD servers handling each domain. Ensure that there are at least two servers in the set. 

Also, consider designating one or more servers in each domain as [standby operations masters][standby-operations-masters] in case connectivity to a server acting as an FSMO role fails.

## Management and monitoring considerations

For information about management and monitoring considerations, see the equivalent sections in [Extending Active Directory to Azure][extending-ad-to-azure]. 

For additional information, see [Monitoring Active Directory][monitoring_ad]. You can install tools such as [Microsoft Systems Center][microsoft_systems_center] on a monitoring server in the management subnet to help perform these tasks.

## Security considerations

Forest level trusts are transitive. If you establish a forest level trust between an on-premises forest and a forest in the cloud, this trust is extended to other new domains created in either forest. If you use domains to provide separation for security purposes, consider creating trusts at the domain level only. Domain level trusts are non-transitive.

For AD-specific security considerations, see the *Security considerations* section in [Extending Active Directory to Azure][extending-ad-to-azure].

## Solution deployment

The solution assumes the following prerequisites:

- You have an existing Azure subscription in which you can create resource groups.

- You have downloaded and installed the most recent build of Azure Powershell. See [here][azure-powershell-download] for instructions.

To run the script that deploys the solution:

1. Move to a convenient folder on your local computer and create the following subfolders:

	- Scripts

	- Scripts/Parameters

	- Scripts/Parameters/Onpremise

	- Scripts/Parameters/Azure

2. Download the [Deploy-ReferenceArchitecture.ps1][solution-script] file to the Scripts folder

3. Download the contents of the [parameters/onpremise][on-premises-folder] folder to the Scripts/Parameters/Onpremise folder:

4. Download the contents of the [parameters/azure][azure-folder] folder to the Scripts/Parameters/Azure folder.

5. Edit the Deploy-ReferenceArchitecture.ps1 file in the Scripts folder, and change the following lines to specify the resource groups that should be created or used to hold the resources created by the script:

	```powershell
	# Azure Onpremise Deployments
	$onpremiseNetworkResourceGroupName = "ra-adtrust-onpremise-rg"

	# Azure ADDS Deployments
	$azureNetworkResourceGroupName = "ra-adtrust-network-rg"
	$workloadResourceGroupName = "ra-adtrust-workload-rg"
	$securityResourceGroupName = "ra-adtrust-security-rg"
	$addsResourceGroupName = "ra-adtrust-adds-rg"
	```

6. Edit the parameter files in the Scripts/Parameters/Onpremise and Scripts/Parameters/Azure folders. Update the resource group references in these files to match the names of the resource groups assigned to the variables in the Deploy-ReferenceArchitecture.ps1 file. The following table shows which parameter files reference which resource group. The *ra-adfs-workload-rg*, *ra-adfs-security-rg*, *ra-adfs-adds-rg*, *ra-adfs-adfs-rg*, and *ra-adfs-proxy-rg* resource groups are only used in the PowerShell script and do not occur in the parameter files.

	|Resource Group|Parameter Files|
    |--------------|--------------|
    |ra-adtrust-onpremise-rg|parameters\onpremise\connection.parameters.json<br /> parameters\onpremise\virtualMachines-adds.parameters.json<br />parameters\onpremise\virtualNetwork-adds-dns.parameters.json<br />parameters\onpremise\virtualNetwork.parameters.json<br />parameters\onpremise\virtualNetworkGateway.parameters.json<br />parameters\azure\virtualNetworkGateway.parameters.json
    |ra-adtrust-network-rg|parameters\onpremise\connection.parameters.json<br />parameters\azure\dmz-private.parameters.json<br />parameters\azure\dmz-public.parameters.json<br />parameters\azure\loadBalancer-biz.parameters.json<br />parameters\azure\loadBalancer-data.parameters.json<br />parameters\azure\loadBalancer-web.parameters.json<br />parameters\azure\virtualMachines-adds.parameters.json<br />parameters\azure\virtualMachines-mgmt.parameters.json<br />parameters\azure\virtualNetwork-adds-dns.parameters.json<br />parameters\azure\virtualNetwork.parameters.json<br />parameters\azure\virtualNetworkGateway.parameters.json (*two occurrences*)

	Additionally, set the configuration for the on-premises and cloud components, as described in the [Solution Components][solution-components] section.

7. Open an Azure PowerShell window, move to the Scripts folder, and run the following command:

	```powershell
	.\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> <mode>
	```

	Replace `<subscription id>` with your Azure subscription ID.

	For `<location>`, specify an Azure region, such as `eastus` or `westus`.

	The `<mode>` parameter can have one of the following values:

	- `Onpremise`, to create the simulated on-premises environment.

	- `Infrastructure`, to create the VNet infrastructure and jump box in the cloud.

	- `CreateVpn`, to build Azure virtual network gateway and connect it to the on-premises network.

	- `AzureADDS`, to construct the VMs acting as ADDS servers, deploy Active Directory to these VMs, and create the domain in the cloud.

	- `WebTier`, which creates the web tier VMs and load balancer.

	- `Prepare`, which performs all the preceding tasks. **This is the recommended option if you are building an entirely new deployment and you don't have an existing on-premises infrastructure.**

	- `Workload` to create the business and data tier VMs and load balancers. These VMs are not included as part of the `Prepare` option.

	>[AZURE.NOTE] If you use the `Prepare` option, the script takes several hours to complete.

8.	If you are using the sample on-premises configuration:

	1. Connect to the jump box (*ra-adtrust-mgmt-vm1* in the *ra-adtrust-security-rg* resource group). Log in as *testuser* with password *AweS0me@PW*.

	2.  On the jump box open an RDP session on the first VM in the *contoso.com* domain (the on-premises domain). This VM has the IP address 192.168.0.4. The username is *contoso\testuser* with password *AweS0me@PW*.

	3. Download the [incoming-trust.ps1][incoming-trust] script and run it to create the incoming trust from the *treyresearch.com* domain.

9. If you are using your own on-premises infrastructure:

	1. Download the [incoming-trust.ps1][incoming-trust] script.

	2. Edit the script and replace the value of the `$TrustedDomainName` variable with the name of your own domain.

	3. Run the script.

10. From the jump-box, connect to the first VM in the *treyresearch.com* domain (the domain in the cloud). This VM has the IP address 10.0.4.4. The username is *treyresearch\testuser* with password *AweS0me@PW*.

11. Download the [outgoing-trust.ps1][outgoing-trust] script and run it to create the incoming trust from the *treyresearch.com* domain. If you are using your own on-premises machines, then edit the script first. Set the `$TrustedDomainName` variable to the name of your on-premises domain, and specify the IP addresses of the AD DS servers for this domain in the `$TrustedDomainDnsIpAddresses` variable.

12. On an on-premises machine, perform the steps outlined in the article [Verify a Trust][verify-a-trust] to determine whether the trust relationship has been configured correctly between the *contoso.com* and *treyresearch.com* domains. You may need to wait for a few minutes after completing the previous steps before the trust can be validated.

The remaining optional steps show how to determine whether the domain trust is working as expected. These steps require that you have access to a development computer with Visual Studio installed.

1.  From the Azure PowerShell window, run the following command to create the web tier if you have not set it up previously (by using the `Prepare` option):

	```powershell
	.\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> WebTier
	```

	This command creates the web tier and adds the VMs to the *treyresearch.com* domain.

2. Using Visual Studio on the development computer, create an ASP.NET Web application named *TreyResearchWebApp*. Use the .NET Framework 4.5.2.

3. Select the *MVC* template and change the authentication to *Windows Authentication*. Don't create an App Service in the cloud.

3. Build and run the application to test the authentication. Verify that your current Windows username appears in the menu bar at the top of the page, towards the right.

4. Close Internet Explorer.

5. In the *Solution Explorer* window, right-click the TreyResearchWebApp project, click *Publish*.

6. In the *Publish Web* window, click *Custom*. Create a custom profile named *TreyResearchWebApp*.

7. On the *Connection* page, set the *Publish method* to *File System* and specify a folder named *TreyResearchWebApp*, located in a convenient location on your development computer.

8. On the *Settings* page, set the *Configuration* to *Release*.

9. On the *Preview* page, click *Publish*.

10. Connect to each VM in the web tier in turn (via the jump box) and perform the following tasks. The IP addresses of the web tier VMs are 10.0.1.4, and 10.0.1.5. The username for both VMs is *treyresearch\testuser* with password *AweS0me@PW*:

	1. Copy the *TreyResearchWebApp* folder and its contents from the development computer to the *C:\inetpub* folder.

	2. Using the Internet Information Services (IIS) Manager console, navigate to *Sites\Default Web Site* on the computer.

	3. In the *Actions* pane, click *Basic Settings*, and change the physical path of the web site to *%SystemDrive%\inetpub\TreyResearchWebApp*.

	4. In the *Features View* pane, double-click *Authentication*. Verify that *Windows Authentication* is enabled and *Anonymous Authentication* is disabled.

11. from an on-premises machine, open Internet Explorer and browse to the web site at http://10.0.1.254 (this is the address of the web tier load balancer).

12. In the *Windows Security* dialog box, enter the credentials of a user in the on-premises domain. Specify a username that does not exist in the *treyresearch* domain. If you are using the simulated on-premises environment create a user in the *contoso* domain first and specify this user's credentials.

13. When the home page appears, verify that the correct domain and username appear in the menu bar at the top of the page, towards the right.

## Next steps

- Learn the best practices for [extending your on-premises ADDS domain to Azure][adds-extend-domain]

- Learn the best practices for [creating an ADFS infrastructure][adfs] in Azure.

<!-- links -->

[resource-manager-overview]: ../azure-resource-manager/resource-group-overview.md
[adfs]: ./guidance-identity-adfs.md
[adds-extend-domain]: ./guidance-identity-adds-extend-domain.md
[extending-ad-to-azure]: ./guidance-identity-adds-extend-domain.md
[implementing-aad]: ./guidance-identity-aad.md
[implementing-a-multi-tier-architecture-on-Azure]: ./guidance-compute-n-tier-vm.md
[implementing-a-secure-hybrid-network-architecture-with-internet-access]: ./guidance-iaas-ra-secure-vnet-dmz.md
[implementing-a-secure-hybrid-network-architecture]: ./guidance-iaas-ra-secure-vnet-hybrid.md
[implementing-a-hybrid-network-architecture-with-vpn]: ./guidance-hybrid-network-vpn.md
[running-VMs-for-an-N-tier-architecture-on-Azure]: ./guidance-compute-n-tier-vm.md
[azure-vpn-gateway]: https://azure.microsoft.com/documentation/articles/vpn-gateway-about-vpngateways/
[azure-expressroute]: https://azure.microsoft.com/documentation/articles/expressroute-introduction/
[ad-azure-guidelines]: https://msdn.microsoft.com/library/azure/jj156090.aspx
[standby-operations-masters]: https://technet.microsoft.com/library/cc794737(v=ws.10).aspx
[best_practices_ad_password_policy]: https://technet.microsoft.com/magazine/ff741764.aspx
[monitoring_ad]: https://msdn.microsoft.com/library/bb727046.aspx
[microsoft_systems_center]: https://www.microsoft.com/server-cloud/products/system-center-2016/
[creating-forest-trusts]: https://technet.microsoft.com/library/cc816810(v=ws.10).aspx
[creating-external-trusts]: https://technet.microsoft.com/library/cc816837(v=ws.10).aspx
[naming-conventions]: ./guidance-naming-conventions.md
[azure-powershell-download]: https://azure.microsoft.com/documentation/articles/powershell-install-configure/
[hybrid-azure-on-prem-vpn]: ./guidance-hybrid-network-vpn.md
[verify-a-trust]: https://technet.microsoft.com/library/cc753821.aspx
[netdom]: https://technet.microsoft.com/library/cc835085.aspx
[solution-script]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/Deploy-ReferenceArchitecture.ps1
[on-premises-folder]: https://github.com/mspnp/reference-architectures/tree/master/guidance-identity-adds-trust/parameters/onpremise
[on-premises-vnet-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/parameters/onpremise/virtualNetwork.parameters.json
[on-premises-virtualmachines-adds-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/parameters/onpremise/virtualMachines-adds.parameters.json
[on-premises-virtualnetworkgateway-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/parameters/onpremise/virtualNetworkGateway.parameters.json
[on-premises-connection-parameters]: https://github.com/mspnp/reference-architectures/blob/master/guidance-identity-adds-trust/parameters/onpremise/connection.parameters.json
[incoming-trust]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/extensions/incoming-trust.ps1
[outgoing-trust]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/extensions/outgoing-trust.ps1
[azure-folder]: https://github.com/mspnp/reference-architectures/tree/master/guidance-identity-adds-trust/parameters/azure
[vnet-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/parameters/azure/virtualNetwork.parameters.json
[virtualmachines-adds-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/parameters/azure/virtualMachines-adds.parameters.json
[add-adds-domain-controller-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/parameters/azure/add-adds-domain-controller.parameters.json
[virtualnetworkgateway-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/parameters/azure/virtualNetwork.parameters.json
[dmz-private-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/parameters/azure/dmz-private.parameters.json
[dmz-public-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/parameters/azure/dmz-public.parameters.json
[loadBalancer-web-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/parameters/azure/loadBalancer-web.parameters.json
[loadBalancer-biz-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/parameters/azure/loadBalancer-biz.parameters.json
[loadBalancer-data-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/parameters/azure/loadBalancer-data.parameters.json
[virtualMachines-mgmt-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/parameters/azure/virtualMachines-mgmt.parameters.json
[web-vm-domain-join-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adds-trust/parameters/azure/web-vm-domain-join.parameters.json
[solution-components]: [#solution_components]
[0]: ./media/guidance-identity-aad-resource-forest/figure1.png "Secure hybrid network architecture with separate AD domains"