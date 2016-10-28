<properties
   pageTitle="Azure Architecture Reference - IaaS: Creating a Active Directory resource forest in Azure | Microsoft Azure"
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
   ms.date="10/24/2016"
   ms.author="telmos"/>

# Creating a Active Directory Directory Services (ADDS) resource forest in Azure

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes how to create an Active Directory domain in Azure that is separate from, but trusted by, domains in your on-premises forest.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.

An organization that runs Active Directory (AD) on-premises might have a forest comprising many different domains. For example, you might create individual domains for various departments or suborganizations, or new domains might have been added as a result of acquisition or merger of other organizations. You can use domains to provide isolation between functional areas that must be kept separate, possibly for security reasons, but you can share information between domains by establishing trust relationships.

An organization that utilizes separate domains can take advantage of Azure by relocating one or more of these domains to the cloud. Alternatively, an organization might wish to keep all cloud resources logically distinct from those held on-premises, and store information about cloud resources in their own directory, in a domain also held in the cloud.

You can implement Active Directory in Azure in several different ways, as described in the articles [Extending Active Directory to Azure][extending-ad-to-azure] and [Implementing Azure Active Directory][implementing-aad]. This document focuses on one specific scenario: creating a domain in the cloud that is distinct from any domains held on-premises, but that can have a trust relationship with on-premises domains.

Typical use cases for this architecture include:

- Maintaining security separation for objects and identities held in the cloud.

- Migrating individual domains from on-premises to the cloud.

## Architecture diagram

The following diagram highlights the important components in this architecture (*click to zoom in*). For more information about the grayed-out elements, read [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture] and [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access]:

[![0]][0]

- **On-premises network.** The on-premises network contains its own AD forest and domains.

- **AD Servers.** These are domain controllers implementing directory services (AD DS) running as VMs in the cloud. These servers host a forest containing one or more domains, separate from those located on-premises.

- **One-way trust relationship.** The example in the diagram shows a one-way trust from the domain in the cloud to the on-premises domain. This relationship enables on-premises users to access resources in the domain in the cloud, but not the other way around. This is a common case. However, you can create a two-way trust if cloud users also require access to on-premises resources.

- **Active Directory subnet.** The AD DS servers are hosted in a separate subnet. NSG rules protect the AD DS servers and can provide a firewall against traffic from unexpected sources.

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

## Security considerations

Forest level trusts are transitive. If you establish a forest level trust between an on-premises forest and a forest in the cloud, this trust is extended to other new domains created in either forest. If you use domains to provide separation for security purposes, consider creating trusts at the domain level only. Domain level trusts are non-transitive.

For AD-specific security considerations, see the *Security considerations* section in [Extending Active Directory to Azure][extending-ad-to-azure].

## Availability considerations

Implement at least two domain controllers for each domain. This enables automatic replication between servers. Create an availability set for the VMs acting as AD servers handling each domain. Ensure that there are at least two servers in the set.

Also, consider designating one or more servers in each domain as [standby operations masters][standby-operations-masters] in case connectivity to a server acting as an FSMO role fails.

## Scalability considerations

AD is automatically scalable for domain controllers that are part of the same domain. Requests are distributed across all controllers within a domain. You can add another domain controller, and it synchronizes automatically with the domain. Do not configure a separate load balancer to direct traffic to controllers within the domain. Ensure that all domain controllers have sufficient memory and storage resources to handle the domain database. Make all domain controller VMs the same size.

## Management and monitoring considerations

For information about management and monitoring considerations, see the equivalent sections in [Extending Active Directory to Azure][extending-ad-to-azure].

For additional information, see [Monitoring Active Directory][monitoring_ad]. You can install tools such as [Microsoft Systems Center][microsoft_systems_center] on a monitoring server in the management subnet to help perform these tasks.

## <a name="solutioncomponents"/>Solution components</a>

A sample solution script, [Deploy-ReferenceArchitecture.ps1][solution-script], is available that you can use to implement the architecture that follows the recommendations described in this article. This script utilizes Azure Resource Manager templates. The templates are available as a set of fundamental building blocks, each of which performs a specific action such as creating a VNet or configuring an NSG. The purpose of the script is to orchestrate template deployment.

The templates are parameterized, with the parameters held in separate JSON files. You can modify the parameters in these files to configure the deployment to meet your own requirements. You do not need to amend the templates themselves. You must not change the schemas of the objects in the parameter files.

When you edit the templates, create objects that follow the naming conventions described in [Recommended Naming Conventions for Azure Resources][naming-conventions].

The sample solution creates and configures an environment in the cloud that implements a domain named *treyresearch.com*. This environment comprises the ADDS subnet and servers, DMZ, web tier, business tier, and data access tier components, VPN gateway, and management tier. The sample solution also includes an optional configuration for creating a simulated on-premises environment with its own domain, *contoso.com*. The solution includes scripts that establish a trust relationship across these domains that enables on-premises users to access objects in the *treyresearch.com* domain in the cloud.

The following sections describe the elements of the on-premises and cloud configurations.

### On-premises components

>[AZURE.NOTE] These components are not the main focus of the architecture described in this document, and are provided simply to give you an opportunity to test the cloud environment safely, rather than using a real production environment. For this reason, this section only summarizes the key parameter files. You can modify settings such as the IP addresses or the sizes of the VMs, but it is advisable to leave many of the other parameters unchanged.

This environment comprises an AD forest the *contoso.com* domain. The domain contains two ADDS servers with IP addresses 192.168.0.4 and 192.168.0.5. These two servers also run the DNS service. The local administrator account on both VMs is called `testuser` with password `AweS0me@PW`. Additionally, the configuration sets up a VPN gateway for connecting to the VNet in the cloud. You can modify the configuration by editing the following JSON files located in the [**parameters/onpremise**][on-premises-folder] folder:

- **[virtualNetwork.parameters.json][on-premises-vnet-parameters]**. This file defines the network address space for the on-premises environment.

- **[virtualMachines-adds.parameters.json][on-premises-virtualmachines-adds-parameters]**. This file contains the configuration for the on-premises VMs hosting ADDS services. By default, two *Standard-DS3-v2* VMs are created.

- **[virtualNetworkGateway.parameters.json][on-premises-virtualnetworkgateway-parameters]** and **[connection.parameters.json][on-premises-connection-parameters]**. These files hold the settings for the VPN connection to the Azure VPN gateway in the cloud, including the shared key to be used to protect traffic traversing the gateway.

The remaining files in the folder contain the configuration information used to create the on-premises domain (*contoso.com*) using this infrastructure. You use them to install ADDS, setup DNS, and create the on-premises forest.

The solution also uses the following script, named [incoming-trust.ps1][incoming-trust], which runs on a machine in the on-premises domain:

```Powershell
# Run the following powershell script in ra-adtrust-onpremise-ad-vm1 (ip 192.168.0.4)

$TrustedDomainName = "contoso.com"
#$TrustedDomainDnsIpAddresses = "192.168.0.4,192.168.0.5"

$TrustingDomainName = "treyresearch.com"
$TrustingDomainDnsIpAddresses = "10.0.4.4,10.0.4.5"

$ForwardIpAddress  = $TrustingDomainDnsIpAddresses
$ForwardDomainName = $TrustingDomainName

$IpAddresses = @()
foreach($address in $ForwardIpAddress.Split(',')){
    $IpAddresses += [IPAddress]$address.Trim()
}
Add-DnsServerConditionalForwarderZone -Name "$ForwardDomainName" -ReplicationScope "Domain" -MasterServers $IpAddresses

netdom trust $TrustingDomainName /d:$TrustedDomainName /add
```

This script adds the IP addresses of the AD DS servers in the cloud (see the next section) to the local DNS service, and then uses the [netdom][netdom] command to create an incoming one-way trust from the domain in the cloud (*treyresearch.com*).

### Cloud components

These components form the core of this architecture. They setup the infrastructure for the *treyresearch.com* domain and create the trust relationships with the on-premises *contoso.com* domain. The [**parameters/azure**][azure-folder] folder contains the following parameter files for configuring these components:

- **[virtualNetwork.parameters.json][vnet-parameters]**. This file defines structure of the VNet for the VMs and other components in the cloud. It includes settings, such as the name, address space, subnets, and the addresses of any DNS servers required. The DNS addresses shown in this example reference the IP addresses of the on-premises DNS servers, and also the default Azure DNS server. Modify these addresses to reference your own DNS setup if you are not using the sample on-premises environment:

	```json
	"virtualNetworkSettings": {
	  "value": {
	    "name": "ra-adtrust-vnet",
	    "resourceGroup": "ra-adtrust-network-rg",
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
	      }
	    ],
	    "dnsServers": [
	      "10.0.4.4",
	      "10.0.4.5",
	      "168.63.129.16"
	    ]
	  }
	}
	```

- **[virtualMachines-adds.parameters.json ][virtualmachines-adds-parameters]**. This file configures the VMs running ADDS in the cloud. The configuration consists of two VMs. Change the admin user name and password in the `virtualMachineSettings` section, and you can optionally modify the VM size to match the requirements of the domain:

	For more information, see [Extending Active Directory to Azure][extending-ad-to-azure].

	```json
	"virtualMachinesSettings": {
	  "value": {
	    "namePrefix": "ra-adtrust-ad",
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
	      "name": "ra-adtrust-as"
	    }
	  }
	},
	"virtualNetworkSettings": {
	  "value": {
	    "name": "ra-adtrust-vnet",
	    "resourceGroup": "ra-adtrust-network-rg"
	  }
	},
	"buildingBlockSettings": {
	  "value": {
	    "storageAccountsCount": 2,
	    "vmCount": 2,
	    "vmStartIndex": 1
	  }
	}
	```

- **[add-adds-domain-controller.parameters.json][add-adds-domain-controller-parameters]**. This file contains the settings for creating the *treyresearch.com* domain spanning the ADDS servers. It uses custom extensions that establish the domain and add the ADDS servers to it. Unless you create additional ADDS servers (in which case you should add them to the `vms` array), change their names from the default, or wish to create a domain with a different name you don't need to modify this file.

- **[virtualNetworkGateway.parameters.json][virtualnetworkgateway-parameters]**. This file contains the settings used to create the Azure VPN gateway in the cloud used to connect to the on-premises network. You should modify the `sharedKey` value in the `connectionsSettings` section to match that of the on-premises VPN device. For more information, see [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][hybrid-azure-on-prem-vpn].

- **[dmz-private.parameters.json][dmz-private-parameters]** and **[dmz-public.parameters.json ][dmz-public-parameters]**. These files configure the inbound (public) and outbound (private) sides of the VMs that comprise the DMZ, protecting the servers in the cloud. For more information about these elements and their configuration, see [Implementing a DMZ between Azure and the Internet][implementing-a-secure-hybrid-network-architecture-with-internet-access].

- **[loadBalancer-web.parameters.json][loadBalancer-web-parameters]**, **[loadBalancer-biz.parameters.json][loadBalancer-biz-parameters]**, and **[loadBalancer-data.parameters.json][loadBalancer-data-parameters]**. These parameters files contain the VM specifications for the web, business, and data access tiers, and configure load balancers for each tier. These are the VMs that host the web apps and databases, and perform the business workloads for the organization. The VMs in the web tier are added to the domain in the cloud by using the settings specified in the **[web-vm-domain-join.parameters.json][web-vm-domain-join-parameters]** file.

	Each file contains two sets of configuration parameters. The `virtualMachineSettings` section defines the VMs that host the ADFS service in the cloud. By default, the script creates two of these VMs in the same availability set. The following fragments show the relevant parts of the *loadBalancer-web.parameters.json* file:

	```json
    "virtualMachinesSettings": {
      "value": {
        "namePrefix": "ra-adtrust-web",
        "computerNamePrefix": "web",
        "size": "Standard_DS1_v2",
        "osType": "windows",
        "adminUsername": "testuser",
        "adminPassword": "AweS0me@PW",
        "osAuthenticationType": "password",
        "nics": [
          {
            "isPublic": "false",
            "subnetName": "web",
            "privateIPAllocationMethod": "Dynamic",
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
          "name": "ra-adtrust-web-vm-as"
        }
      }
    },
    ...
    "buildingBlockSettings": {
      "value": {
        "storageAccountsCount": 2,
        "vmCount": 2,
        "vmStartIndex": 1
      }
    }
	````
	You can modify the sizes and number of VMs in each tier according to your requirements.

	The `loadBalancerSettings` section provides the description of the load balancer for these VMs. The load balancer passes traffic that appears on port 80 (HTTP) and port 443 (HTTPS) to one or other of the VMs.

	>[AZURE.NOTE] The rule for port 80 uses a TCP connection rather than HTTP. This is because the installation of IIS on the web tier is configured to support Windows Authentication only. Anonymous Authentication is disabled. Attempting to *ping* port 80 over an HTTP connection fails with a 401 (Unauthorized) error, whereas using a TCP connection just detects whether the port is active:

	```json
    "loadBalancerSettings": {
      "value": {
        "name": "ra-adtrust-web-lb",
        "frontendIPConfigurations": [
          {
            "name": "ra-adtrust-web-lb-fe",
            "loadBalancerType": "internal",
            "internalLoadBalancerSettings": {
              "privateIPAddress": "10.0.1.254",
              "subnetName": "web"
            }
          }
        ],
        "backendPools": [
          {
            "name": "ra-adtrust-web-lb-bep",
            "nicIndex": 0
          }
        ],
        "loadBalancingRules": [
          {
            "name": "http-rule",
            "frontendPort": 80,
            "backendPort": 80,
            "protocol": "Tcp",
            "backendPoolName": "ra-adtrust-web-lb-bep",
            "frontendIPConfigurationName": "ra-adtrust-web-lb-fe",
            "probeName": "http-probe",
            "enableFloatingIP": false
          },
          {
            "name": "https-rule",
            "frontendPort": 443,
            "backendPort": 443,
            "protocol": "Tcp",
            "backendPoolName": "ra-adtrust-web-lb-bep",
            "frontendIPConfigurationName": "ra-adtrust-web-lb-fe",
            "probeName": "https-probe",
            "enableFloatingIP": false
          }
        ],
        "probes": [
          {
            "name": "http-probe",
            "port": 80,
            "protocol": "Tcp",
            "requestPath": null
          },
          {
            "name": "https-probe",
            "port": 443,
            "protocol": "Tcp",
            "requestPath": null
          }
        ],
        "inboundNatRules": [ ]
      }
    }
	```

- **[virtualMachines-mgmt.parameters.json][virtualMachines-mgmt-parameters]**. This file contains the configuration for the jump box/management VMs. It is only possible to gain logon and administrative access to the VMs in the web, business, and data tiers from the jump box. By default, the script creates a single *Standard_DS1_v2* VM, but you can modify this file to create bigger or additional VMs if the management workload is likely to be significant.

The configuration also uses the [outgoing-trust.ps1][outgoing-trust] script shown below to create a one-way outgoing trust with the *contoso.com* domain:

```powershell
# prerequiste:
# You need to first run incoming-trust.ps1 in ra-adtrust-onpremise-ad-vm1 (ip 192.168.0.4)
# Then,
# Run the following powershell script in ra-adtrust-ad-vm1 (ip 10.0.4.4)

$TrustedDomainName = "contoso.com"
$TrustedDomainDnsIpAddresses = "192.168.0.4,192.168.0.5"

#$TrustingDomainName = "treyresearch.com"
#$TrustingDomainDnsIpAddresses = "10.0.4.4,10.0.4.5"

$ForwardIpAddress  = $TrustedDomainDnsIpAddresses
$ForwardDomainName = $TrustedDomainName

$IpAddresses = @()
foreach($address in $ForwardIpAddress.Split(',')){
    $IpAddresses += [IPAddress]$address.Trim()
}
Add-DnsServerConditionalForwarderZone -Name "$ForwardDomainName" -ReplicationScope "Domain" -MasterServers $IpAddresses

#netdom trust $TrustingDomainName /d:$TrustedDomainName /add
```

This script is similar to the *incoming-trust.ps1* script described earlier. It adds the IP addresses of the on-premises AD DS servers to the local DNS service, and then uses the [netdom][netdom] command to create the outgoing trust relationship.

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

	Additionally, set the configuration for the on-premises and cloud components, as described in the [Solution Components][#solutioncomponents] section.

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
