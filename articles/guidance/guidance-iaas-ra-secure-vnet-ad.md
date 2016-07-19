<properties
   pageTitle="Azure Architecture Reference - IaaS: Extending Active Directory to Azure | Microsoft Azure"
   description="How to implement a secure hybrid network architecture with Active Directory authorization in Azure."
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
   ms.date="07/19/2016"
   ms.author="telmos"/>

# Extending Active Directory to Azure

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for extending your Active Directory (AD) environment to Azure, to provide distributed authentication services by using [Active Directory Domain Services (AD DS)][active-directory-domain-services]. This architecture extends that described in the articles [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture] and [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access].

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.

You use AD DS to authenticate identities. These identities can belong to users, computers, applications, or other resources that form part of a security domain. You can host AD DS on-premises, but in a hybrid scenario where elements of an application are located in Azure it can be more efficient to replicate this functionality and the AD repository to the cloud. This approach can help  reduce the latency caused by sending authentication and local authorization requests from the cloud back to AD DS running on-premises. 

There are two ways to host your directory services in Azure:

1. You can use [Azure Active Directory (AAD)][azure-active-directory] to create a new AD domain in the cloud and link it to an on-premises AD domain. Then setup [Azure AD Connect][azure-ad-connect] on-promises to replicate identities held in the the on-premises repository to the cloud. Note that the directory in the cloud is **not** an extension of the on-premises system, rather it's a copy that contains the same identities. Changes made to these identities on-premises will be copied to the cloud, but changes made in the cloud **will not** be replicated back to the on-premises domain. For example, password resets must be performed on-premises and use Azure AD Connect to copy the change to the cloud. Also, note that the same instance of AAD can be linked to more than one instance of AD DS; AAD will contain the identities of each AD repository to which it is linked.

	AAD is useful for situations where the on-premises network and Azure virtual network hosting the cloud resources are not directly linked by using a VPN tunnel or ExpressRoute circuit. Although this solution is simple, it might not be suitable for systems where components could migrate across the on-premises/cloud boundary as this could require reconfiguration of AAD. Also, AAD only handles user authentication rather than computer authentication. Some applications and services, such as SQL Server, may require computer authentication in which case this solution is not appropriate.

2. You can deploy a VM running AD DS as a domain controller in Azure, extending your existing AD infrastructure from your on-premises datacenter. This approach is more common for scenarios where the on-premises network and Azure virtual network are connected by a VPN and/or ExpressRoute connection. This solution also supports bi-directional replication enabling you make changes in the cloud and on-premises, wherever it is most appropriate. Depending on your security requirements, the AD installation in the cloud can be:
	- part of the same domain as that held on-premises
	- a new domain within a shared forest
	- a separate forest

<!-- we might want to add info on how to choose from the three options above -->

This architecture focuses on solution 2, using the same AD DS domain in Azure and on-premises.

Typical use cases for this architecture include:

- Hybrid applications where workloads run partly on-premises and partly in Azure.

- Applications and services that perform authentication by using Active Directory.

## Architecture diagram

The following diagram highlights the important components in this architecture (*click to zoom in*). For more information about the grayed-out elements, read [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture] and [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access]:

[![0]][0]

- **On-premises network.** The on-premises network includes local AD servers that can perform authentication and authorization for components located on-premises.

- **AD Servers.** These are domain controllers implementing directory services (AD DS)running as VMs in the cloud. These servers can provide authentication of components running in your Azure virtual network.

- **Active Directory subnet.** The AD DS servers are hosted in a separate subnet. NSG rules protect the AD DS servers and can provide a firewall against traffic from unexpected sources.

- **Azure Gateway and AD synchronization.**. The Azure gateway provides a connection between the on-premises network and the Azure VNet. This can be a [VPN connection][azure-vpn-gateway] or [Azure ExpressRoute][azure-expressroute]. All synchronization requests between the AD servers in the cloud and on-premises pass through the gateway. User-defined routes (UDRs) handle routing for synchronization traffic which passes directly to the AD server in the cloud and does not pass through the existing network virtual appliances (NVAs) used in this scenario.

	For more information about configuring UDRs and the NVAs, see [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture].

## Recommendations

This section summarizes recommendations for implementing AD DS in Azure, covering:

- VM recommendations.

- Networking recommendations.

- Security recommendations. 

- Active Directory Site recommendations.

- Active Directory FSMO placement recommendations.

>[AZURE.NOTE] The document [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines][ad-azure-guidelines] contains more detailed information on many of these points.

### VM recommendations

Create VMs with sufficient resources to handle the expected volume of traffic. Use the size of the machines hosting AD DS on premises as a starting point. Monitor the resource utilization; you can resize the VMs and scale down if they are too large. For more information about sizing AD DS domain controllers, see [Capacity Planning for Active Directory Domain Services][capacity-planning-for-adds].

Create a separate virtual data disk for storing the database, logs, and SYSVOL for AD. Do not store these items on the same disk as the operating system. Note that by default, data disks that are attached to a VM use write-through caching. However, this form of caching can conflict with the requirements of AD DS. For this reason, set the *Host Cache Preference* setting on the data disk to *None*. For more information, see [Placement of the Windows Server AD DS database and SYSVOL][adds-data-disks].

Deploy at least two VMs running AD DS as domain controllers to your Azure virtual network for [availability](#Availability-considerations) reasons.

### Networking recommendations

Configure the network interface for each of the VMs hosting AD DS with static private IP addresses. This configuration better supports DNS on each of the AD VMs. For more information, see [How to set a static private IP address in the Azure portal][set-a-static-ip-address].

> [AZURE.NOTE] Do not give the AD DS VMs public IP addresses. See [Security considerations][security-considerations] for more details.

You must ensure that traffic can flow freely between the AD servers in the cloud and on-premises:

- Add NSG rules to the AD subnet that permit incoming traffic from on-premises. For detailed information on the ports that AD DS utilize, see [Active Directory and Active Directory Domain Services Port Requirements][ad-ds-ports].

- Make sure UDR tables do not route AD DS traffic through the NVAs used in this scenario. For your own deployments, depending on what NVAs you use, you may want to redirect that traffic.

### Security recommendations

AD DS servers handle authentication and are therefore very sensitive items. Prevent direct exposure of the AD DS servers to the Internet. Place AD DS servers in a separate subnet, with its own firewall. Ensure that the ports necessary to use AD DS for authentication and authorization, and for synchronzing servers remain open, but close all other ports. For more information, see [Active Directory and Active Directory Domain Services Port Requirements][ad-ds-ports]. The [Solution components][solution-components] section later in this document shows the NSG rules that the sample solution uses to open ports.

You can use NSG rules to create a simple firewall. If you require more comprehensive protection you can implement an additional security perimeter around servers by using a pair of subnets and NVAs, as described by the document [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access].

Use either BitLocker or Azure disk encryption to encrypt the disk hosting the AD DS database.

### Active Directory Site recommendations

You can use sites in AD DS to group together domain controllers that are connected by a fast link. Domain controllers in the same AD DS site replicate their directory changes automatically, and little configuration is necessary to handle the replication.

TO control replication traffic between Azure and your on-premises datacenter, it is recommended to add a separate AD DS site to represent the address space used by Azure. You can configure a site link between your on-premises AD DS sites and control cross-site replication more effectively.

You can also use site separation to apply different group policy objects (GPOs) to joined computers in Azure, and to take advantage of applications that are "site aware", such as System Center Configuration Manager.

### Active Directory FSMO placement recommendations

Flexible Single Master Operation (FSMO) servers are specialized domain controllers, reposnsible for data consistency across different settings in AD DS, listed below.

- **Schema Master**. This is a forest-wide role that maintains the structure of the schema used by AD DS.

- **Domain Naming Master**. This is a forest-wide role that manages information about domain names within the forest.

- **Primary Domain Controller (PDC)**. This is a domain-wide role. The PDC handles password updates and account lockouts. It is consulted by other DCs when service authentication requests have mismatched passwords. The PDC also handles Group Policy updates, and is the target DC for legacy applications and some admin tools that perform some writeable operations.

- **Relative ID (RID) Master**. RIDs are used to help uniquely identify objects within a directory. This server is responsible for generating a domain-wide pool of RIDs for use by all AD servers within the domain.

- **Infrastructure Role**. An object in one domain can reference an object in another domain. This domain-wide role is responsible for updating an object's SID and distinguished name in a cross-domain object reference. Note that a server implementing this role cannot also act as a Global Catalog (GC) server.

For more information, see [Active Directory FSMO roles in Windows][AD-FSMO-roles-in-windows].

For this scenario, we recommend you avoid deploying FSMO roles to the domain controllers in Azure. 

## Availability considerations

Create an availability set for the AD servers. Ensure that there are at least two servers in the set. The AD servers in the cloud should be domain controllers within the same domain. This will enable automatic replication between servers.

Also, consider designating servers as [standby operations masters][standby-operations-masters] in case connectivity to a server acting as an FSMO role fails.

## Security considerations

If all domain admin tasks are likely to be performed using the on-premises DCs, consider making DCs in the cloud read-only. A read-only DC only maintains a subset of users' credentials (enough to perform authentication locally) and can be configured to cache information only for specific users. Therefore, if a read-only DC is compromised, only the information for cached users will be affected, rather than the details of every account in the domain. For more information, see [Read-Only Domain Controllers][read-only-dc].

To help minimize the vulnerability of individual user accounts, and to deter attempts to break-in, follow best practice for setting and maintaining users' passwords in AD. For more information, see [Best Practices for Enforcing Password Policies][best_practices_ad_password_policy]. Also, be careful to which groups you assign users. For example, do not make ordinary users members of the Enterprise Admins group, Schema Admins group, and Domain Admins group.

## Scalability considerations

AD is automatically scalable for domain controllers that are part of the same domain. Requests are distributed across all controllers within a domain. You can add another domain controller, and it will synchronize automatically with the domain. Do not configure a separate load balancer to direct traffic to controllers within the domain. Ensure that all domain controllers have sufficient memory and storage resources to handle the domain database; ideally, make all domain controller VMs the same size.

## Management considerations

Do not copy the VHD files of domain controllers instead of performing regular backups because restoring them can result in inconsistencies in state between domain controllers.

Shut down and restart a VM that runs the domain controller role in Azure within the guest operating system instead of using the Shut Down option in the Azure Portal. Using the Azure Portal to shut down a VM causes the VM to be deallocated. This action resets the VM-GenerationID, which is undesirable for a domain controller. When the VM-GenerationID is reset, the invocationID of the AD repository is also reset, the RID pool is discarded, and SYSVOL is marked as non-authoritative.

## Monitoring considerations

Failing to monitor and maintain a network of AD servers can result in problems such as:

- **Logon failure**. Logon failure can occur throughout the domain or forest if a trust relationship or name resolution fails, or if a global catalog server cannot determine universal group membership.

- **Account lockout**. User and service accounts can become locked out if the primary domain controller is unavailable, or replication fails between several domain controllers.

- **Domain Controller failure**. If the drive containing the Ntds.dit file runs out of disk space, the domain controller can stop functioning.

- **Application failure**. Applications that are critical to your business, such as Microsoft Exchange or another e-mail application, can fail if address book queries into the directory fail.

- **Inconsistent directory data**. If replication fails for an extended period of time, duplicate objects can be created in the directory and might require extensive diagnosis and time to eliminate.

- **Account creation failure**. A domain controller is unable to create user or computer accounts if it exhausts its supply of relative IDs and the RID master is unavailable.

- **Security policy failure**. If the SYSVOL shared folder does not replicate properly, Group Policy objects and security policies are not properly applied to clients.

Monitor AD servers carefully, and be prepared to take corrective action quickly. Create a checklist of monitoring tasks to be performed at an appropriate interval. For example you could schedule the following critical tasks daily:

- Examine and resolve alerts reported by domain controllers, 

- Verify that all domain controllers can communicate and that replication is working.

- Ensure that SYSVOL remains shared.

- Rectify time-synchronization problems.

- Check for disk space on the physical drives used by AD.

You could perform other routine tasks less frequently. For example, you could review trust relationships and check for obsolete or broken trusts weekly, and verify that all domain controllers are running using the same service packs and hot fix patches monthly.

For more information, see [Monitoring Active Directory][monitoring_ad]. You can install tools such as [Microsoft Systems Center][microsoft_systems_center] on the monitoring server (see the [architecture diagram][architecture]) to help perform these tasks. 

## Solution components

The solution provided for this architecture creates a secure hybrid network as described by the documents [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture] and [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access], but with the addition of the following items:

- An Azure resource group named *basename*-dns-rg, where *basename* is a prefix you specify when deploying the solution.

- Two Azure VMs called *basename*-ad1-vm and *basename*-ad2-vm, created in the *basename*-dns-rg resource group. These VMs are configured as AD servers with Directory Services and DNS installed and configured.

- An NSG named *basename*-ad-nsg in the *basename*-ntwk-rg Azure resource group. This resource group is part of the infrastructure that constitute the secure hybrid network, but the new NSG is an addition that defines inbound security rules for the AD servers as shown in the following table:


	Priority|Name|Source|Destination|Service|Action|
	--------|----|------|-----------|-------|------|
	170|vnet-to-port53|10.0.0.0/16|Any|Custom(ANY/53)|Allow|
	180|vnet-to-port88|10.0.0.0/16|Any|Custom(ANY/88)|Allow|
	190|vnet-to-port135|10.0.0.0/16|Any|Custom(ANY/135)|Allow|
	200|vnet-to-port137-9|10.0.0.0/16|Any|Custom(ANY/137-139)|Allow|
	210|vnet-to-port389|10.0.0.0/16|Any|Custom(ANY/389)|Allow|
	220|vnet-to-port464|10.0.0.0/16|Any|Custom(ANY/464)|Allow|
	230|vnet-to-rpc-dynamic|10.0.0.0/16|Any|Custom(ANY/49152-65535)|Allow|
	240|onprem-ad-to-port53|192.168.0.0/24|Any|Custom(ANY/53)|Allow|
	250|onprem-ad-to-port88|192.168.0.0/24|Any|Custom(ANY/88)|Allow|
	260|onprem-ad-to-port135|192.168.0.0/24|Any|Custom(ANY/135)|Allow|
	270|onprem-ad-to-port389|192.168.0.0/24|Any|Custom(ANY/389)|Allow|
	280|onprem-ad-to-port464|192.168.0.0/24|Any|Custom(ANY/464)|Allow|
	290|mgmt-rdp-allow|10.0.0.128/25|Any|Custom(ANY/3389)|Allow|
	300|gateway-allow|10.0.255.224/27|Any|Custom(ANY/Any)|Allow|
	310|self-allow|10.0.255.192/27|Any|Custom(ANY/Any)|Allow|
	320|vnet-deny|Any|Any|Custom(ANY/Any)|Allow|

	AD DS uses ports 53, 89, 135, 389, and 464 to accept incoming replication and authentication traffic. In this table, the on-premises domain controller is in the address space 192.168.0.0/24 (your address space may vary - you specify this information as a parameter to the templates deployed by the solution.

	The NSG also defines the following outbound security rules which enable synchronization and authorization traffic to flow back to the on-premises network:

	Priority|Name|Source|Destination|Service|Action|
	--------|----|------|-----------|-------|------|
	100|out-port53|Any|192.168.0.0/24|Custom(ANY/53)|Allow|
	110|out-port88|Any|192.168.0.0/24|Custom(ANY/88)|Allow|
	120|out-port135|Any|192.168.0.0/24|Custom(ANY/135)|Allow|
	130|out-port389|Any|192.168.0.0/24|Custom(ANY/389)|Allow|
	140|out-port445|Any|192.168.0.0/24|Custom(ANY/445)|Allow|
	150|out-port464|Any|192.168.0.0/24|Custom(ANY/464)|Allow|
	160|out-rpc-dynamic|Any|192.168.0.0/24|Custom(ANY/49152-65535)|Allow|

The script provided with the solution also perform the following tasks:

- It adds the *basename*-ad1-vm and *basename*-ad2-vm servers as domain controllers to the domain. You can view these servers in the *Active Directory Users and Computers* console in the on-premises domain controller:

![[1]][1]

- It creates a new subnet (10.0.0.0/16) for an AD site named Azure-VNet-Ad-Site to the domain. This site contains the *basename*-ad1-vm and *basename*-ad2-vm servers. 

- It adds IP inter-site transport settings that configure the replication interval between the on-premises site and the domain controllers in the cloud. You can see the settings for the subnet, sites, and transport settings in the *Active Directory Sites and Servers* console in the on-premises domain controller:

![[2]][2]

## Deployment

The sample solution has the following prerequsites:

- You have already configured your on-premises domain, and that you have configured DNS, and installed Routing and Remote Access services to support a VPN connect to the Azure VPN gateway.


- You have installed the latest version of the Azure CLI. [Follow these instructions for details][cli-install].

- If you're deploying the solution from Windows, you must install a tool that provides a bash shell, such as [GitHub Desktop][github-desktop].

>[AZURE.NOTE] If you don't have access to an existing on-premises domain, you can create a test environment using the [onpremdeploy.sh][onpremdeploy] bash script. This script creates a network and VM in the cloud that simulates a very basic on-premises setup. Edit this script before running and set the following variables defined at the start of the file:
>
> - **BASE_NAME**. A user-defined prefix for the resource group and VM created by the script. This item should be **no longer than 5 characters** otherwise the script will attempt to generate a VM with an invalid name and fail.
> 
> - **SUBSCRIPTION**. Your Azure subscription ID. The resource group will be created in this suscription.
> 
> - **LOCATION**. The Azure location in which to create the resource group, such as *eastus* or *westus*.
> 
> - **ADMIN_USER_NAME**. The name to use for the administrator account in the VM.
> 
> - **ADMIN_PASSWORD**. The password for the administrator account.

Perform the following steps to build the sample solution:

1. download and edit the [azuredeploy.sh][azuredeploy] script and set the following parameters at the start of the file:

	- **BASE_NAME**. A user-defined prefix for the resource groups and VMs created by the script. As before, this item should be **no longer than 5 characters**.

	- **SUBSCRIPTION**. Your Azure subscription ID.

	- **OS_TYPE**. The operating system (*Windows* or *Linux*)to use for the web, business, and data access tier VMs. Note that all AD servers created by the script run Windows Server 2012, regardless of this setting.

	- **DOMAIN_NAME**. The name of the on-premises domain. Note that if you use the environment created by the onpremdeploy.sh script, this must be *contoso.com*.

	- **LOCATION**. The Azure location in which to create the resource groups.

	- **ADMIN_USER_NAME**. The name to use for the administrator accounts in the various VMs.

	- **ADMIN_PASSWORD**. The password for the administrator account.

	- **ON_PREMISES_PUBLIC_IP**. The public IP address of the on-premises VPN machine.

	- **ON_PREMISES_ADDRESS_SPACE**. The internal address space of the on-premises network. If you are using the environment created by the onpremdeploy.sh script, this must be 192.168.0.0/16.

	- **VPN_IPSEC_SHARED_KEY**. The IPSec shared key used for establishing the VPN connection between the on-premises network and the Azure VPN gateway.

	- **ON_PREMISES_DNS_SERVER_ADDRESS**. The IP address of the on-premises DNS server. If you are using the environment created by the onpremdeploy.sh script, this must be 192.168.0.4

	- **ON_PREMISES_DNS_SUBNET_PREFIX** The address prefix of the on-premises subnet. If you are using the environment created by the onpremdeploy.sh script, this must be 192.168.0.0/24.

	>[AZURE.NOTE] TO save resources and time, the script does not create the business or data access tiers. If you require these items, you can uncomment the following section in the azuredeploy.sh script:
	>
	>
	> ```
	> #### # create biz tier
	> #### TEMPLATE_URI=${URI_BASE}/ARMBuildingBlocks/Templates/bb-ilb-backend-http-https.json
	> #### SUBNET_NAME_PREFIX=${DEPLOYED_BIZ_SUBNET_NAME_PREFIX}
	> #### ILB_IP_ADDRESS=${BIZ_ILB_IP_ADDRESS}
	> #### NUMBER_VMS=${BIZ_NUMBER_VMS}
	> #### 
	> #### RESOURCE_GROUP=${BASE_NAME}-${SUBNET_NAME_PREFIX}-tier-rg
	> #### VM_NAME_PREFIX=${SUBNET_NAME_PREFIX}
	> #### VM_COMPUTER_NAME_PREFIX=${SUBNET_NAME_PREFIX}
	> #### VNET_RESOURCE_GROUP=${NTWK_RESOURCE_GROUP}
	> #### VNET_NAME=${DEPLOYED_VNET_NAME}
	> #### SUBNET_NAME=${DEPLOYED_BIZ_SUBNET_NAME}
	> #### PARAMETERS="{\"baseName\":{\"value\":\"${BASE_NAME}\"},\"vnetResourceGroup\":{\"value\":\"${VNET_RESOURCE_GROUP}\"},\"vnetName\":{\"value\":\"${VNET_NAME}\"},\"subnetName\":{\"value\":\"${SUBNET_NAME}\"},\"adminUsername\":{\"value\":\"${ADMIN_USER_NAME}\"},\"adminPassword\":{\"value\":\"${ADMIN_PASSWORD}\"},\"subnetNamePrefix\":{\"value\":\"${SUBNET_NAME_PREFIX}\"},\"ilbIpAddress\":{\"value\":\"${ILB_IP_ADDRESS}\"},\"osType\":{\"value\":\"${OS_TYPE}\"},\"numberVMs\":{\"value\":${NUMBER_VMS}},\"vmNamePrefix\":{\"value\":\"${VM_NAME_PREFIX}\"},\"vmComputerNamePrefix\":{\"value\":\"${VM_COMPUTER_NAME_PREFIX}\"}}"
	> #### 
	> #### echo
	> #### echo
	> #### echo azure group create --name ${RESOURCE_GROUP} --location ${LOCATION} --subscription ${SUBSCRIPTION}
	> ####      azure group create --name ${RESOURCE_GROUP} --location ${LOCATION} --subscription ${SUBSCRIPTION}
	> #### echo
	> #### echo
	> #### echo azure group deployment create --template-uri ${TEMPLATE_URI} -g ${RESOURCE_GROUP} -p ${PARAMETERS} --subscription ${SUBSCRIPTION}
	> ####      azure group deployment create --template-uri ${TEMPLATE_URI} -g ${RESOURCE_GROUP} -p ${PARAMETERS} --subscription ${SUBSCRIPTION}
	> #### 
	> #### # create db tier
	> #### TEMPLATE_URI=${URI_BASE}/ARMBuildingBlocks/Templates/bb-ilb-backend-http-https.json
	> #### SUBNET_NAME_PREFIX=${DEPLOYED_DB_SUBNET_NAME_PREFIX}
	> #### ILB_IP_ADDRESS=${DB_ILB_IP_ADDRESS}
	> #### NUMBER_VMS=${DB_NUMBER_VMS}
	> #### 
	> #### RESOURCE_GROUP=${BASE_NAME}-${SUBNET_NAME_PREFIX}-tier-rg
	> #### VM_NAME_PREFIX=${SUBNET_NAME_PREFIX}
	> #### VM_COMPUTER_NAME_PREFIX=${SUBNET_NAME_PREFIX}
	> #### VNET_RESOURCE_GROUP=${NTWK_RESOURCE_GROUP}
	> #### VNET_NAME=${DEPLOYED_VNET_NAME}
	> #### SUBNET_NAME=${DEPLOYED_DB_SUBNET_NAME}
	> #### PARAMETERS="{\"baseName\":{\"value\":\"${BASE_NAME}\"},\"vnetResourceGroup\":{\"value\":\"${VNET_RESOURCE_GROUP}\"},\"vnetName\":{\"value\":\"${VNET_NAME}\"},\"subnetName\":{\"value\":\"${SUBNET_NAME}\"},\"adminUsername\":{\"value\":\"${ADMIN_USER_NAME}\"},\"adminPassword\":{\"value\":\"${ADMIN_PASSWORD}\"},\"subnetNamePrefix\":{\"value\":\"${SUBNET_NAME_PREFIX}\"},\"ilbIpAddress\":{\"value\":\"${ILB_IP_ADDRESS}\"},\"osType\":{\"value\":\"${OS_TYPE}\"},\"numberVMs\":{\"value\":${NUMBER_VMS}},\"vmNamePrefix\":{\"value\":\"${VM_NAME_PREFIX}\"},\"vmComputerNamePrefix\":{\"value\":\"${VM_COMPUTER_NAME_PREFIX}\"}}"
	> #### 
	> #### echo
	> #### echo
	> #### echo azure group create --name ${RESOURCE_GROUP} --location ${LOCATION} --subscription ${SUBSCRIPTION}
	> ####      azure group create --name ${RESOURCE_GROUP} --location ${LOCATION} --subscription ${SUBSCRIPTION}
	> #### echo
	> #### echo
	> #### echo azure group deployment create --template-uri ${TEMPLATE_URI} -g ${RESOURCE_GROUP} -p ${PARAMETERS} --subscription ${SUBSCRIPTION}
	> ####      azure group deployment create --template-uri ${TEMPLATE_URI} -g ${RESOURCE_GROUP} -p ${PARAMETERS} --subscription ${SUBSCRIPTION}
	> ```

2. Open a bash shell prompt and move to the folder containing the azuredeploy.sh script.

3. Log in to your Azure account. In the bash shell, enter the following command:

	```
	azure login
	```

	Follow the instructions to connect to Azure.

4. Run the command `./azuredeploy.sh`, and then wait while the script creates the network infrastructure.

5. At the prompt *Please verify that the VNet has been created*, use the Azure portal to check that a resource group named *basename*-ntwk-rg has been created, and that it contains items similar to those shown in the following image:

	![[3]][3]

	>[AZURE.NOTE] In the examples shown, *basename* was set to *cloud* when the script was run.

	Click the *basename*-vnet VNet, click *Subnets*, and verify that the subnets shown below have been created:

	![[4]][4]

6. At the prompt in the bash shell window, press a key and wait while the web tier and load balancer are created.

7. At the prompt *Please verify that the Web tier has been created correctly*, use the Azure portal to check that a resource group called *basename*web-tier-rg has been created, and that it contains items similar to those shown below:

	![[5]][5]

8. At the prompt in the bash shell window, press a key and wait while the NVAs are created.

9. At the prompt *Please verify that the NVA has been created correctly*, use the Azure portal to check that a resource group called *basename*-mgmt-rg has been created with the following contents:

	![[6]][6]

10. At the prompt in the bash shell window, press a key and wait while the jumpbox is created.

11. At the prompt *Please verify that the jumpbox has been created correctly*, use the Azure portal to check that the following items have been added to the *basename*-mgmt-rg resource group:

	- An availability set called *basename*-jb-as.

	- A VM named *basename*-jb-vm.

	- A network interface called *basename*-jb-nic.

12. At the prompt in the bash shell window, press a key and wait while the Azure VPN gateway and connection are created. Note that this step can take up to 30 minutes to complete.

13. At the prompt *Please verify that the VPN gateway has been created correctly*, use the Azure portal to check that the following items have been added to the *basename*-ntwk-rg resource group:

	- A local network gateway called on-premises-lgw.
	
	- A virtual network gateway called *basename*-vpngw.

	- A gateway connection named *basename*-vnet-vpnconn. Note that the status of this connection might be *Not connected* if you have not yet configured the on-premises end of the connection; you will address this later.

14. At the prompt in the bash shell window, press a key and wait while the VMs and other resources for the DMZ are created.

15. At the prompt *Please verify that the DMZ has been created correctly*, use the Azure portal to check that a resource group called *basename*-dmz-rg has been created with the following contents:

	![[7]][7]

16. At the prompt in the bash shell window, press a key. The following prompts should appear:

	```text
	Manual Step...

	Please configure your on-premises network to connect to the Azure VNet

	Make sure that you can connect to the on-premises AD server from the Azure VMs
	```

	Log in to your on-premises computer that connects to the Azure gateway and configure the connection appropriately. Add static routes to the on-premises gateway device that directs requestsfor the 10.0.0.0/16 address range through the gateway to the VNet. The steps for doing this will vary according to how you are connecting. See [Implementing a Hybrid Network Architecture with Azure and On-premises VPN][implementing-a-hybrid-network-architecture-with-vpn] for more information.

	Note that you can find the public IP address of the Azure VPN gateway by using the Azure portal to examine the *basename*-vpngw gateway in the *basename*-ntwk-rg resource group:

	![[8]][8]

	You can determine whether the connection has been established correctly by looking at the status of the *basename*-vnet-vpnconn connection. It should be set to *Connected*.

	To test the connection, open a remote desktop connection to the jumpbox (10.0.0.254) from a machine located in your on-premises network.

17. At the prompt in the bash shell window, press a key. At the next prompt, *Press any key to update the VNet setting for the VNet to point to on-premises DNS*, press a key and wait while the DNS settings for the VNet are updated to the value you specified as the **ON_PREMISES_DNS_SERVER_ADDRESS** parameter in the azuredeploy.sh script.

18. At the prompt, *Please verify that the DNS server setting on the VNet has been updated*, use the Azure portal to examine the *DNS servers* setting of the *basename*-vnet VNet in the *basename*-ntwk-rg resource group. It should be set to *Custom DNS*, and the *Primary DNS server* should be the address of your on-premises DNS server:

	![[9]][9]

19. At the *Press any key to create the resource group for the AD servers* prompt in the bash shell window, press a key and wait while the resource group for holding the AD servers in the cloud is created.

20. At the *Press any key to create the VMs for the AD servers* prompt in the bash shell window, press a key and wait for the VMs to be created and added to the resource group.

21. When the *Press any key to join the VMs to the on-premises domain* appears, go to the Azure portal and verify that a group called *basename*-dns-rg has been created, and that it contains two VMS (*basename*-ad1-vm and *basename*-ad2-vm):

	![[10]][10]

22. In the *basename*-ntwk-rg resource group, check that an NSG has been created called *basename*-ad-nsg. Examine the inbound and outbound security rules for this NSG. They should match those listed in the tables in the [Solution components][solution-components] section.

23. At the prompt in the bash shell window, press a key and wait while the VMs are added to the on-premises domain.

24. At the *Please go to the on-premises AD server to verify that the computers have been added to the domains* prompt, connect to your on-premises computer and use the *Active Directory Users and Computers* console to check that both VMs have been added to the domain:

	![[11]][11]

25. At the prompt in the bash shell window, press a key and wait while the AD replication site is created in the domain.

26. At the *Please go to the on-premises AD server to verify that the replication site has been created* prompt, use the *Active Directory Sites and Services* console to to check that a replication site named *Azure-Vnet-Ad-Site* has been created successfully, together with an IP inter-site transport link called *AzureToOnpremLink*, and a subnet that references the VNet:

	![[12]][12]

27. At the prompt in the bash shell window, press a key and wait while the script installs Directory Services and DNS on each of the AD VMs.

28. When the prompt *Please login to each Azure AD server to verify that Directory Services has been configured successfully* appears, open a remote desktop connection from an on-premises machine to the jumpbox (*basename*-jb-vm), and then open another remote desktop connection from the jumpbox to the first AD server (*basename*-ad1-vm). Log in using the **DOMAIN_NAME**, **ADMIN_USER_NAME**, and **ADMIN_PASSWORD** that you specified in the azuredeploy.sh script. Using Server Manager, verify that the AD DS and DNS roles have both been added. Repeat this process for the second AD server (*basename*-ad2-vm).

29. At the prompt in the bash shell window, press a key. When the prompt *Press any key to set the Azure VNet DNS settings to point to the DNS in Azure* appears, press a key and allow the script to update the DNS settings for the VNet.

30. When the prompt *Please verify that the VNet DNS setting has been updated reference the Azure VM DNS servers* appears, using the Azure portal check the *DNS Servers* setting of the *basename*-vnet VNet in the *basename*-ntwk-rg resource group. The primary and secondary DNS servers should now reference the two AD VMs:

	![[13]][13]

31. Restart each of the AD VMs before continuing. This step is necessary to ensure that they each pick up the correct DNS settings from Azure. Wait until both VMs are running before continuing.

32. At the prompt in the bash shell window, press a key. At the next prompt, *Press any key to apply the gateway UDR to the gateway subnet (it might have been removed)*, press a key and allow the script to refresh the gateway UDR.

33. Verify that the script completes successfully.

<!-- links -->

[resource-manager-overview]: ../resource-group-overview.md
[guidance-vpn-gateway]: ./guidance-hybrid-network-vpn.md
[script]: #sample-solution-script
[implementing-a-multi-tier-architecture-on-Azure]: ./guidance-compute-3-tier-vm.md
[implementing-a-secure-hybrid-network-architecture-with-internet-access]: ./guidance-iaas-ra-secure-vnet-dmz.md
[implementing-a-secure-hybrid-network-architecture]: ./guidance-iaas-ra-secure-vnet-hybrid.md
[implementing-a-hybrid-network-architecture-with-vpn]: ./guidance-hybrid-network-vpn.md
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
[ad_network_recommendations]: #network_configuration_recommendations_for_AD_DS_VMs
[domain_and_forests]: https://technet.microsoft.com/library/cc759073(v=ws.10).aspx
[best_practices_ad_password_policy]: https://technet.microsoft.com/magazine/ff741764.aspx
[monitoring_ad]: https://msdn.microsoft.com/library/bb727046.aspx
[microsoft_systems_center]: https://www.microsoft.com/server-cloud/products/system-center-2016/
[cli-install]: https://azure.microsoft.com/documentation/articles/xplat-cli-install
[github-desktop]: https://desktop.github.com/
[sssd-and-active-directory]: https://help.ubuntu.com/lts/serverguide/sssd-ad.html
[set-a-static-ip-address]: https://azure.microsoft.com/documentation/articles/virtual-networks-static-private-ip-arm-pportal/
[ad-azure-guidelines]: https://msdn.microsoft.com/library/azure/jj156090.aspx
[adds-data-disks]: https://msdn.microsoft.com/library/azure/jj156090.aspx#BKMK_PlaceDB
[AD-FSMO-recommendations]: #active_directory_FSMO_placement_recommendations
[AD-FSMO-roles-in-windows]: https://support.microsoft.com/en-gb/kb/197132
[standby-operations-masters]: https://technet.microsoft.com/library/cc794737(v=ws.10).aspx
[transfer-FSMO-roles]: https://technet.microsoft.com/library/cc816946(v=ws.10).aspx
[view-fsmo-roles]: https://technet.microsoft.com/library/cc816893(v=ws.10).aspx
[read-only-dc]: https://technet.microsoft.com/library/cc732801(v=ws.10).aspx
[AD-sites-and-subnets]: https://blogs.technet.microsoft.com/canitpro/2015/03/03/step-by-step-setting-up-active-directory-sites-subnets-site-links/
[sites-overview]: https://technet.microsoft.com/library/cc782048(v=ws.10).aspx
[implementing-adfs]: ./guidance-iaas-ra-secure-vnet-adfs.md
[onpremdeploy]: https://github.com/mspnp/blueprints/blob/master/ARMBuildingBlocks/guidance-iaas-ra-ad-extension/onpremdeploy.sh
[azuredeploy]: https://github.com/mspnp/blueprints/blob/master/ARMBuildingBlocks/guidance-iaas-ra-ad-extension/azuredeploy.sh
[solution-components]: #solution_components

[0]: ./media/guidance-iaas-ra-secure-vnet-ad/figure1.png "Secure hybrid network architecture with Active Directory"
[1]: ./media/guidance-iaas-ra-secure-vnet-ad/figure2.png "The Active Directory Users and Computers console listing the two Azure VMs as servers"
[2]: ./media/guidance-iaas-ra-secure-vnet-ad/figure3.png "The Active Directory Sites and Services console showing the replication settings for the site in the cloud"
[3]: ./media/guidance-iaas-ra-secure-vnet-ad/figure4.png "The contents of the basename-ntwk-rg resource group"
[4]: ./media/guidance-iaas-ra-secure-vnet-ad/figure5.png "The subnets in the basename-vnet VNet"
[5]: ./media/guidance-iaas-ra-secure-vnet-ad/figure6.png "The items in the web tier"
[6]: ./media/guidance-iaas-ra-secure-vnet-ad/figure7.png "The NVAs in the basename-mgmt-rg resource group"
[7]: ./media/guidance-iaas-ra-secure-vnet-ad/figure8.png "The resources in the basename-dmz-rg resource group"
[8]: ./media/guidance-iaas-ra-secure-vnet-ad/figure9.png "Finding the public IP address of the Azure VPN gateway"
[9]: ./media/guidance-iaas-ra-secure-vnet-ad/figure10.png "The DNS server settings for the *basename*-vnet VNet"
[10]: ./media/guidance-iaas-ra-secure-vnet-ad/figure11.png "The *basename*-dns-rg resource group containing the AD server VMs"
[11]: ./media/guidance-iaas-ra-secure-vnet-ad/figure12.png "The Active Directory Users and Computers console listing the AD server VMs as members of the domain"
[12]: ./media/guidance-iaas-ra-secure-vnet-ad/figure13.png "The Active Directory Sites and Services console showing the replication site for the Azure AD servers"
[13]: ./media/guidance-iaas-ra-secure-vnet-ad/figure14.png "The DNS server settings for the basename-vnet VNet referencing the AD servers in the cloud"