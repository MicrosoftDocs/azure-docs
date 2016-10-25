<properties
   pageTitle="Implementing ADFS in Azure | Microsoft Azure"
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
   ms.date="10/13/2016"
   ms.author="telmos"/>

# Implementing Active Directory Federation Services (ADFS) in Azure

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for implementing a secure hybrid network that extends your on-premises network to Azure, and that uses [Active Directory Federation Services (ADFS)][active-directory-federation-services] to perform federated authentication and authorization for components running in the cloud. This architecture extends the structure described by [Extending Active Directory to Azure][implementing-active-directory].

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.

ADFS can run on-premises, but in a hybrid scenario where applications are located in Azure it can be more efficient to implement this functionality in the cloud. Typical use cases for this architecture include:

- Hybrid applications where workloads run partly on-premises and partly in Azure.

- Solutions that utilize federated authorization to expose web applications to partner organizations.

- Systems that support access from web browsers running outside of the organizational firewall.

- Systems that enable users to access to web applications by connecting from authorized external devices such as remote computers, notebooks, and other mobile devices. 

For more information about how ADFS works, see [Active Directory Federation Services Overview][active-directory-federation-services-overview]. Additionally, the article [ADFS deployment in Azure][adfs-intro] contains a detailed step-by-step introduction to implementing ADFS in Azure.

## Architecture diagram

The following diagram highlights the important components in this architecture (*click to zoom in*). For more information about any element not related to ADFS, read [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture], [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access], and [Implementing a secure hybrid network architecture with Active Directory identities in Azure][implementing-active-directory]:

[![0]][0]

>[AZURE.NOTE] This diagram depicts the following use cases:
>
>- Application code running inside a partner organization accesses a web application hosted inside your Azure VNet.
>
>- An external, registered user (with credentials stored inside ADDS) accessing a web application hosted inside your Azure VNet.
>
>- A user connecting to your VNet by using an authorized device and running a web application hosted inside your Azure VNet.
>
>Additionally, this architecture focuses on passive federation, where the federation servers decide how and when to authenticate a user. The user is expected to provide sign in information when an application starts running. This is the mechanism most commonly used by web browsers and involves a protocol that redirects the browser to a site where the user can provide their credentials. ADFS also supports active federation whereby an application takes on responsibility for supplying credentials without further user interaction, but this case is outside the scope of this architecture.

- **ADDS subnet.** The ADDS servers are contained within their own subnet. NSG rules help to protect the ADDS servers and can provide a firewall against traffic from unexpected sources.

- **ADDS Servers.** These are domain controllers running as VMs in the cloud. These servers can provide authentication of local identities within the domain.

- **ADFS subnet.** The ADFS servers can be located within their own subnet, with NSG rules acting as a firewall.

- **ADFS servers.** The ADFS servers provide federated authorization and authentication. In this architecture, they perform the following tasks:

	- They can receive security tokens containing claims made by a partner federation server on behalf of a partner user. ADFS can verify that these tokens are valid before passing the claims to web application running in Azure. The corporate web application (in Azure) can use these claims to authorize requests. In this scenario, the corporate web application is the *relying party*, and it is the responsibility of the partner federation server to issue claims that are understood by the corporate web application. The partner federation servers are referred to as *account partners* because they submit access requests on behalf of authenticated accounts in the partner organization. The ADFS servers are called *resource partners* because they provide access to resources (web applications, in this case).

	- They can authenticate (via ADDS and the [Active Directory Device Registration Service][ADDRS]) and authorize incoming requests from external users running a web browser or device that needs access to your corporate web applications. 

	The ADFS servers are configured as a farm, accessed through an Azure load balancer. This structure helps to improve availability and scalability. Also, note that the ADFS servers are not exposed directly to the Internet, rather all Internet traffic is filtered through ADFS web application proxy servers and a DMZ.

- **ADFS proxy subnet.** The ADFS proxy servers can be contained within their own subnet, with NSG rules providing protection. The servers in this subnet are exposed to the Internet through a set of network virtual appliances that provide a firewall between your Azure virtual network and the Internet.

- **ADFS web application proxy (WAP) servers.** These computers act as ADFS servers for incoming requests from partner organizations and external devices. The WAP servers act as a filter, shielding the ADFS servers from direct access from the public Internet. As with the ADFS servers, deploying the WAP servers in a farm with load balancing gives you greater availability and scalability than deploying a collection of stand-alone servers.

	>[AZURE.NOTE] For detailed information about installing WAP servers, see [Install and Configure the Web Application Proxy Server][install_and_configure_the_web_application_proxy_server]

- **Partner organization.** This is an example partner organization, which runs a web application that requests access to the web application running in Azure. The federation server at the partner organization authenticates requests locally, and submits security tokens containing claims to ADFS running in Azure. ADFS in Azure validates the security tokens, and if they are valid it can pass the claims to the web application running in Azure to authorize them.

	>[AZURE.NOTE] You can also configure a VPN tunnel using Azure Gateway to provide direct access to ADFS for trusted partners. Requests received from these partners do not pass through the WAP servers.

## Recommendations

This section summarizes recommendations for implementing ADFS in Azure, covering:

- VM recommendations.

- Networking recommendations.

- Availability recommendations.

- Security recommendations.

- ADFS installation recommendations.

- ADFS Trust recommendations.

### VM recommendations

Create VMs with sufficient resources to handle the expected volume of traffic. Use the size of the existing machines hosting ADFS on premises as a starting point. Monitor the resource utilization. You can resize the VMs and scale down if they are too large.

Follow the recommendations listed in [Running a Windows VM on Azure][vm-recommendations].

### Networking recommendations

Configure the network interface for each of the VMs hosting ADFS and WAP servers with static private IP addresses.

Do not give the ADFS VMs public IP addresses. For more information, see [Security considerations][security-considerations].

Set the IP address of the preferred and secondary DNS servers for the network interfaces for each ADFS and WAP VM to reference the ADDS VMs (which should be running DNS). This step is necessary to enable each VM to join the domain.

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

- Add a DNS *A* record to the domain for the ADFS load balancer. 

	Specify the IP address of the load balancer, and give it a name in the domain (such as adfs.contoso.com). This is the name by which clients and the WAP servers access the ADFS server farm.

### Security recommendations

Prevent direct exposure of the ADFS servers to the Internet. ADFS servers are domain-joined computers that have full authorization to grant security tokens. If an ADFS server is compromised, a malicious user can issue full access tokens to all web applications and to federation servers that are protected by ADFS. If your system must handle requests from external users not necessarily connecting from trusted partner sites, use WAP servers to handle these requests. For more information, see [Where to Place a Federation Server Proxy][where-to-place-an-fs-proxy].

Place ADFS servers and WAP servers in separate subnets with their own firewalls. You can use NSG rules to define firewall rules. If you require more comprehensive protection you can implement an additional security perimeter around servers by using a pair of subnets and NVAs, as described by the document [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access]. Note that all firewalls should allow traffic on port 443 (HTTPS).

Restrict direct login access to the ADFS and WAP servers. Only DevOps staff should be able to connect.

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

## Availability considerations

You can use either SQL Server or the Windows Internal Database (WID) to hold ADFS configuration information. WID provides basic redundancy. Changes are written directly to only one of the ADFS databases in the ADFS cluster, while the other servers use pull replication to keep their databases up to date. Using SQL Server can provide full database redundancy and high availability using failover clustering or mirroring.

## Security considerations

ADFS utilizes the HTTPS protocol, so make sure that the NSG rules for the subnet containing the web tier VMs permit HTTPS requests. These requests can originate from the on-premises network, the subnets containing the web tier, business tier, data tier, private DMZ, public DMZ, and the subnet containing the ADFS servers.

Consider using a set of network virtual appliances that logs detailed information on traffic traversing the edge of your virtual network for auditing purposes.

## Scalability considerations

The following considerations, summarized from the document [Plan your ADFS deployment][plan-your-adfs-deployment], give a starting point for sizing ADFS farms:

- If you have fewer than 1000 users, do not create dedicated ADFS servers, but instead install ADFS on each of the ADDS servers in the cloud (make sure that you have at least two ADDS servers, to maintain availability). Create a single WAP server.

- If you have between 1000 and 15000 users, create two dedicated ADFS servers and two dedicated WAP servers.

- If you have between 15000 and 60000 users, create between three and five dedicated ADFS servers, and at least two dedicated WAP servers.

These figures assume you are using dual quad-core VMs (Standard D4_v2, or better) to host the servers in Azure.

Note that if you are using the Windows Internal Database to store ADFS configuration data, you are limited to eight ADFS servers in the farm. If you anticipate needing more, then use SQL Server. For more information, see [The Role of the ADFS Configuration Database][adfs-configuration-database].

## Management considerations

DevOps staff should be prepared to perform the following tasks:

- Managing the federation servers (managing the ADFS farm, managing trust policy on the federation servers, and managing the certificates used by the federation services).

- Managing the WAP servers (managing the WAP farm, managing the WAP certificates).

- Managing web applications (configuring relying parties, authentication methods, and claims mappings).

- Backing up ADFS components.

## Monitoring considerations

The [Microsoft System Center Management Pack for Active Directory Federation Services 2012 R2][oms-adfs-pack] provides both proactive and reactive monitoring of your ADFS deployment for the federation server. This management pack monitors:

- Events that the ADFS service records in the ADFS event logs.

- The performance data that the ADFS performance counters collect. 

- The overall health of the ADFS system and web applications (relying parties), and provides alerts for critical issues and warnings.

## Solution components

A sample solution script, [Deploy-ReferenceArchitecture.ps1][solution-script], is available that you can use to implement the architecture that follows the recommendations described in this article. This script utilizes Azure Resource Manager templates. The templates are available as a set of fundamental building blocks, each of which performs a specific action such as creating a VNet or configuring an NSG. The purpose of the script is to orchestrate template deployment.

The templates are parameterized, with the parameters held in separate JSON files. You can modify the parameters in these files to configure the deployment to meet your own requirements. You do not need to amend the templates themselves. Note that you must not change the schemas of the objects in the parameter files.

When you edit the templates, create objects that follow the naming conventions described in [Recommended Naming Conventions for Azure Resources][naming-conventions].

The sample solution creates and configures the environment in the cloud comprising the ADDS subnet and servers, the ADFS subnet and servers, ADFS proxy subnet and servers, DMZ, web tier, business tier, and data access tier components, VPN gateway, and management tier. The sample solution also includes an optional configuration for creating a simulated on-premises environment.

The following sections describe the elements of the on-premises and cloud configurations.

### On-premises components

>[AZURE.NOTE] These components are not the main focus of the architecture described in this document, and are provided simply to give you an opportunity to test the cloud environment safely, rather than using a real production environment. For this reason, this section only summarizes the key parameter files. You can modify settings such as the IP addresses or the sizes of the VMs, but it is advisable to leave many of the other parameters unchanged.

This environment comprises an AD forest for a domain named contoso.com. The domain contains two ADDS servers with IP addresses 192.168.0.4 and 192.168.0.5. These two servers also run the DNS service. The local administrator account on both VMs is called `testuser` with password `AweS0me@PW`. Additionally, the configuration sets up a VPN gateway for connecting to the VNet in the cloud. You can modify the configuration by editing the following JSON files located in the [**parameters/onpremise**][on-premises-folder] folder:

- **[virtualNetwork.parameters.json][on-premises-vnet-parameters]**. This file defines the network address space for the on-premises environment.

- **[virtualMachines-adds.parameters.json][on-premises-virtualmachines-adds-parameters]**. This file contains the configuration for the on-premises VMs hosting ADDS services. By default, two *Standard-DS3-v2* VMs are created.

- **[virtualNetworkGateway.parameters.json][on-premises-virtualnetworkgateway-parameters]** and **[connection.parameters.json][on-premises-connection-parameters]**. These files hold the settings for the VPN connection to the Azure VPN gateway in the cloud, including the shared key to be used to protect traffic traversing the gateway.

The remaining files in the folder contain the configuration information used to create the on-premises domain using this infrastructure. You use them to install ADDS, setup DNS, create a forest, and configure the replication sites for the forest.

### Cloud components

These components form the core of this architecture. The [**parameters/azure**][azure-folder] folder contains the following parameter files for configuring these components:

- **[virtualNetwork.parameters.json][vnet-parameters]**. This file defines structure of the VNet for the VMs and other components in the cloud. It includes settings, such as the name, address space, subnets, and the addresses of any DNS servers required. Note that the DNS addresses shown in this example reference the IP addresses of the on-premises DNS servers, and also the default Azure DNS server. Modify these addresses to reference your own DNS setup if you are not using the sample on-premises environment:

	```json
	{
		"virtualNetworkSettings": {
			"value": {
				"name": "ra-adfs-vnet",
				"resourceGroup": "ra-adfs-network-rg",
				"addressPrefixes": [
					"10.0.0.0/16"
				],
				"subnets": [
					{
						"name": "dmz-private-in",
						"addressPrefix": "10.0.0.0/27"
					},
					{
						"name": "dmz-private-out",
						"addressPrefix": "10.0.0.32/27"
					},
					{
						"name": "dmz-public-in",
						"addressPrefix": "10.0.0.64/27"
					},
					{
						"name": "dmz-public-out",
						"addressPrefix": "10.0.0.96/27"
					},
					{
						"name": "mgmt",
						"addressPrefix": "10.0.0.128/25"
					},
					{
						"name": "GatewaySubnet",
						"addressPrefix": "10.0.255.224/27"
					},
					{
						"name": "web",
						"addressPrefix": "10.0.1.0/24"
					},
					{
						"name": "biz",
						"addressPrefix": "10.0.2.0/24"
					},
					{
						"name": "data",
						"addressPrefix": "10.0.3.0/24"
					},
					{
						"name": "adds",
						"addressPrefix": "10.0.4.0/27"
					},
					{
						"name": "adfs",
						"addressPrefix": "10.0.5.0/27"
					},
					{
						"name": "proxy",
						"addressPrefix": "10.0.6.0/27"
					}
				],
				"dnsServers": [
					"192.168.0.4",
					"192.168.0.5",
					"168.63.129.16"
				]
			}
		}
	}
	```

- **[virtualMachines-adds.parameters.json ][virtualmachines-adds-parameters]**. This file configures the VMs running ADDS in the cloud. The configuration consists of two VMs. You should change the admin user name and password in the `virtualMachineSettings` section, and you can optionally modify the VM size to match the requirements of the domain:

	For more information, see [Extending Active Directory to Azure][extending-ad-to-azure].

	```json
			"virtualMachinesSettings": {
				"value": {
					"namePrefix": "ra-adfs-ad",
					"computerNamePrefix": "aad",
					"size": "Standard_DS3_v2",
					"osType": "Windows",
					"adminUsername": "testuser",
					"adminPassword": "AweS0me@PW",
					"osAuthenticationType": "password",
					"nics": [
						{
							"isPublic": "false",
							"subnetName": "adds",
							"privateIPAllocationMethod": "Static",
							"startingIPAddress": "10.0.4.4",
							"enableIPForwarding": false,
							"dnsServers": [
							],
							"isPrimary": "true"
						}
					],
					"imageReference": {
						"publisher": "MicrosoftWindowsServer",
						"offer": "WindowsServer",
						"sku": "2012-R2-Datacenter",
						"version": "latest"
					},
					"dataDisks": {
						"count": 1,
						"properties": {
							"diskSizeGB": 127,
							"caching": "None",
							"createOption": "Empty"
						}
					},
					"osDisk": {
						"caching": "ReadWrite"
					},
					"extensions": [
					],
					"availabilitySet": {
						"useExistingAvailabilitySet": "No",
						"name": "ra-adfs-as"
					}
				}
			},
			"virtualNetworkSettings": {
				"value": {
					"name": "ra-adfs-vnet",
					"resourceGroup": "ra-adfs-network-rg"
				}
			},
			"buildingBlockSettings": {
				"value": {
					"storageAccountsCount": 2,
					"vmCount": 2,
					"vmStartIndex": 1
				}
			}
		}
	```

- **[add-adds-domain-controller.parameters.json][add-adds-domain-controller-parameters]**. This file contains the settings for creating the CONTOSO domain spanning the ADDS servers. It uses custom extensions that establish the domain and add the ADDS servers to it. Unless you create additional ADDS servers (in which case you should add them to the `vms` array), change their names from the default, or wish to create a domain with a different name you don't need to modify this file.

- **[loadBalancer-adfs.parameters.json ][loadbalancer-adfs-parameters]** The file contains two sets of configuration parameters. The `virtualMachineSettings` section defines the VMs that host the ADFS service in the cloud. By default, the script creates two of these VMs in the same availability set:

	```json
		"virtualMachinesSettings": {
			"value": {
				"namePrefix": "ra-adfs-adfs",
				"computerNamePrefix": "adfs",
				"size": "Standard_DS1_v2",
				"osType": "windows",
				"adminUsername": "testuser",
				"adminPassword": "AweS0me@PW",
				"osAuthenticationType": "password",
				"nics": [
					{
						"isPublic": "false",
						"subnetName": "adfs",
						"privateIPAllocationMethod": "Static",
						"startingIPAddress": "10.0.5.4",
						"isPrimary": "true",
						"enableIPForwarding": false,
						"dnsServers": [ ]
					}
				],
				"imageReference": {
					"publisher": "MicrosoftWindowsServer",
					"offer": "WindowsServer",
					"sku": "2012-R2-Datacenter",
					"version": "latest"
				},
				"dataDisks": {
					"count": 1,
					"properties": {
						"diskSizeGB": 128,
						"caching": "None",
						"createOption": "Empty"
					}
				},
				"osDisk": {
					"caching": "ReadWrite"
				},
				"extensions": [ ],
				"availabilitySet": {
					"useExistingAvailabilitySet": "No",
					"name": "ra-adfs-adfs-vm-as"
				}
			}
		}
		...
		"buildingBlockSettings": {
			"value": {
				"storageAccountsCount": 2,
				"vmCount": 2,
				"vmStartIndex": 1
			}
		}
	```

	The `loadBalancerSettings` section provides the description of the load balancer for these VMs. The load balancer passes traffic that appears on port 443 (HTTPS) to one or other of the VMs:

	```json
		"loadBalancerSettings": {
			"value": {
				"name": "ra-adfs-adfs-lb",
				"frontendIPConfigurations": [
					{
						"name": "ra-adfs-adfs-lb-fe",
						"loadBalancerType": "internal",
						"internalLoadBalancerSettings": {
							"privateIPAddress": "10.0.5.30",
							"subnetName": "adfs"
						}
					}
				],
				"backendPools": [
					{
						"name": "ra-adfs-adfs-lb-bep",
						"nicIndex": 0
					}
				],
				"loadBalancingRules": [
					{
						"name": "https-rule",
						"frontendPort": 443,
						"backendPort": 443,
						"protocol": "Tcp",
						"backendPoolName": "ra-adfs-adfs-lb-bep",
						"frontendIPConfigurationName": "ra-adfs-adfs-lb-fe",
						"probeName": "https-probe",
						"enableFloatingIP": false
					}
				],
				"probes": [
					{
						"name": "https-probe",
						"port": 443,
						"protocol": "Tcp",
						"requestPath": null
					}
				],
				"inboundNatRules": [ ]
			}
		},
		"virtualNetworkSettings": {
			"value": {
				"name": "ra-adfs-vnet",
				"resourceGroup": "johns-adfs-network-rg"
			}
		}
	```

- **[adfs-farm-domain-join.parameters.json ][adfs-farm-domain-join-parameters]**. This file contains the settings used to add the ADFS servers to the CONTOSO domain. You only need to modify this file if you have created additional ADFS servers (update the `vms` array in this case), or you have changed the domain name.

- **[gmsa.parameters.json][gmsa-parameters]**, **[adfs-farm-first.parameters.json][adfs-farm-first-parameters]**, and **[adfs-farm-rest.parameters.json][adfs-farm-rest-parameters]**. The script uses the settings in these files to create the ADFS server farm. 

	The *gmsa.parameters.json* file contains the settings for the group managed service account used by the ADFS service. You can modify this file if you wish to change the name of the account or the domain.

	The *adfs-farm-first.parameters.json* file holds the information needed to create the ADFS server farm and add the first server. If you have changed the domain or name of the group managed service account, you should update this file.

	The *adfs-farm-rest.parameters.json* file is used to add the remaining ADFS servers to the farm. Again, if you have changed the domain or name of the group managed service account, you should update this file. Update the `vms` array if you have created additional ADFS servers.

- **[loadBalancer-adfsproxy.parameters.json][loadBalancer-adfsproxy-parameters]**. This file is similar in structure and content to the *loadBalancer-adfs.parameters.json* file. It contains the data for building the ADFS proxy servers and load balancer.

- **[adfsproxy-farm-first.parameters.json][adfsproxy-farm-first-parameters]**, and **[adfsproxy-farm-rest.parameters.json][adfsproxy-farm-rest-parameters]**. The script uses the settings in these files to create the ADFS proxy server farm. 

- **[virtualNetworkGateway.parameters.json][virtualnetworkgateway-parameters]**. This file contains the settings used to create the Azure VPN gateway in the cloud used to connect to the on-premises network. You should modify the `sharedKey` value in the `connectionsSettings` section to match that of the on-premises VPN device. For more information, see [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][hybrid-azure-on-prem-vpn].

- **[dmz-private.parameters.json][dmz-private-parameters]** and **[dmz-public.parameters.json ][dmz-public-parameters]**. These files configure the inbound (public) and outbound (private) sides of the VMs that comprise the DMZ, protecting the servers in the cloud. For more information about these elements and their configuration, see [Implementing a DMZ between Azure and the Internet][implementing-a-secure-hybrid-network-architecture-with-internet-access].

- **[loadBalancer-web.parameters-json][loadBalancer-web-parameters]**, **[loadBalancer-biz.parameters-json][loadBalancer-biz-parameters]**, and **[loadBalancer-data.parameters-json][loadBalancer-data-parameters]**. These parameters files contain the VM specifications for the web, business, and data access tiers, and configure load balancers for each tier. These are the VMs that host the web apps and databases, and perform the business workloads for the organization. You can modify the sizes and number of VMs in each tier according to your requirements.

- **[virtualMachines-mgmt.parameters.json][virtualMachines-mgmt-parameters]**. This file contains the configuration for the jump box/management VMs. It is only possible to gain logon and administrative access to the VMs in the web, business, and data tiers from the jump box. By default, the script creates a single *Standard_DS1_v2* VM, but you can modify this file to create bigger or additional VMs if the management workload is likely to be significant.

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
		$onpremiseNetworkResourceGroupName = "ra-adfs-onpremise-rg"
		
		# Azure ADDS Deployments
		$azureNetworkResourceGroupName = "ra-adfs-network-rg"
		$workloadResourceGroupName = "ra-adfs-workload-rg"
		$securityResourceGroupName = "ra-adfs-security-rg"
		$addsResourceGroupName = "ra-adfs-adds-rg"
		$adfsResourceGroupName = "ra-adfs-adfs-rg"
		$adfsproxyResourceGroupName = "ra-adfs-proxy-rg"
	```

6. Edit the parameter files in the Scripts/Parameters/Onpremise and Scripts/Parameters/Azure folders. Update the resource group references in these files to match the names of the resource groups assigned to the variables in the Deploy-ReferenceArchitecture.ps1 file. The following table shows which parameter files reference which resource group. Note that the *ra-adfs-workload-rg*, *ra-adfs-security-rg*, *ra-adfs-adds-rg*, *ra-adfs-adfs-rg*, and *ra-adfs-proxy-rg* groups are only used in the PowerShell script and do not occur in the parameter files.

	|Resource Group|Parameter File(s)|
    |--------------|--------------|
    |ra-adfs-onpremise-rg|parameters\onpremise\connection.parameters.json<br /> parameters\onpremise\virtualMachines-adds.parameters.json<br />parameters\onpremise\virtualNetwork-adds-dns.parameters.json<br />parameters\onpremise\virtualNetwork.parameters.json<br />parameters\onpremise\virtualNetworkGateway.parameters.json<br />parameters\azure\virtualNetworkGateway.parameters.json
    |ra-adfs-network-rg|parameters\onpremise\connection.parameters.json<br />parameters\azure\dmz-private.parameters.json<br />parameters\azure\dmz-public.parameters.json<br />parameters\azure\loadBalancer-adfs.parameters.json<br />parameters\azure\loadBalancer-adfsproxy.parameters.json<br />parameters\azure\loadBalancer-biz.parameters.json<br />parameters\azure\loadBalancer-data.parameters.json<br />parameters\azure\loadBalancer-web.parameters.json<br />parameters\azure\virtualMachines-adds.parameters.json<br />parameters\azure\virtualMachines-mgmt.parameters.json<br />parameters\azure\virtualNetwork-with-onpremise-and-azure-dns.parameters.json<br />parameters\azure\virtualNetwork.parameters.json<br />parameters\azure\virtualNetworkGateway.parameters.json (*two occurrences*)

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

	- `AdfsVm` to create the ADFS VMs and join them to the domain in the cloud.

	- `ProxyVm` to build the ADFS proxy VMs and join them to the domain in the cloud.

	- `Prepare`, which performs all the above tasks. **This is the recommended option if you are building an entirely new deployment and you don't have an existing on-premises infrastructure.**

	>[AZURE.NOTE] You can also run the script with a `<mode>` parameter of `Workload` to create the web, business, and data tier VMs and network. This setup is not included as part of the `Prepare` mode.

	If you use the `Prepare` option, the script takes several hours to complete, and finishes with the message *Preparation is completed. Please install certificate to all ADFS and proxy VMs.*

8.	Restart the jump box (*ra-adfs-mgmt-vm1* in the *ra-adfs-security-rg* group) to allow its DNS settings to take effect.

9.	[Obtain an SSL Certificate for ADFS][adfs_certificates] and install this certificate on the ADFS VMs. Note that you can connect to the ADFS VMs through the jump box. The IP addresses are *10.0.5.4* and *10.0.5.5*. The default username is *contoso\testuser* with password *AweSome@PW*.

	>[AZURE.NOTE] The comments in the Deploy-ReferenceArchitecture.ps1 script at this point provide detailed instructions for creating a self-signed test certificate and authority using the `makecert` command. However, do not use the certificates generated by makecert in a production environment.

10. Run the following Powershell command to configure the ADFS server farm:

	```powershell
	.\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> Adfs
	```

11. On the jump box, browse to *https://adfs.contoso.com/adfs/ls/idpinitiatedsignon.htm* to test the ADFS installation (you may receive a certificate warning, which you can ignore for this test). Verify that the Contoso Corporation sign-in page appears. Sign in as *contoso\testuser* with password *AweS0me@PW*.

12. Install the SSL certificate on the ADFS proxy VMs. The IP addresses are *10.0.6.4* and *10.0.6.5*.

13. Run the following Powershell command to configure the first ADFS proxy server:

	```powershell
	.\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> Proxy1
	```

14. Follow the instructions displayed by the script to test the installation of the first ADFS proxy server.

15. Run the following Powershell command to configure the second first ADFS proxy server:

	```powershell
	.\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> Proxy2
	```

16. Follow the instructions displayed by the script to test the complete ADFS proxy configuration.

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
[solution-script]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/Deploy-ReferenceArchitecture.ps1
[on-premises-folder]: https://github.com/mspnp/reference-architectures/tree/master/guidance-identity-adfs/parameters/onpremise
[on-premises-vnet-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/onpremise/virtualNetwork.parameters.json
[on-premises-virtualmachines-adds-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/onpremise/virtualMachines-adds.parameters.json
[on-premises-virtualnetworkgateway-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/onpremise/virtualNetworkGateway.parameters.json
[on-premises-connection-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/onpremise/connection.parameters.json
[azure-folder]: https://github.com/mspnp/reference-architectures/tree/master/guidance-identity-adfs/parameters/azure
[vnet-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/virtualNetwork.parameters.json
[dmz-private-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/dmz-private.parameters.json
[dmz-public-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/dmz-public.parameters.json
[virtualnetworkgateway-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/virtualNetworkGateway.parameters.json
[hybrid-azure-on-prem-vpn]: ./guidance-hybrid-network-vpn.md
[virtualmachines-adds-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/virtualMachines-adds.parameters.json
[extending-ad-to-azure]: ./guidance-identity-adds-extend-domain.md
[loadbalancer-adfs-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/loadBalancer-adfs.parameters.json
[add-adds-domain-controller-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/add-adds-domain-controller.parameters.json
[gmsa-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/gmsa.parameters.json
[adfs-farm-first-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/adfs-farm-first.parameters.json
[adfs-farm-rest-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/adfs-farm-rest.parameters.json
[adfs-farm-domain-join-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/adfs-farm-domain-join.parameters.json
[loadBalancer-web-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/loadBalancer-web.parameters.json
[loadBalancer-biz-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/loadBalancer-biz.parameters.json
[loadBalancer-data-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/loadBalancer-data.parameters.json
[virtualMachines-mgmt-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/virtualMachines-mgmt.parameters.json
[loadBalancer-adfsproxy-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/loadBalancer-adfsproxy.parameters.json
[adfsproxy-farm-first-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/adfsproxy-farm-first.parameters.json
[adfsproxy-farm-rest-parameters]: https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-identity-adfs/parameters/azure/adfsproxy-farm-rest.parameters.json
[0]: ./media/guidance-iaas-ra-secure-vnet-adfs/figure1.png "Secure hybrid network architecture with Active Directory"
