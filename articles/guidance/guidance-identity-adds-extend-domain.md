<properties
   pageTitle="Extending Active Directory Domain Services (AD DS) to Azure | Microsoft Azure"
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
   ms.date="10/27/2016"
   ms.author="telmos"/>

# Extending Active Directory Domain Services (AD DS) to Azure

[AZURE.INCLUDE [pnp-RA-branding](../../includes/guidance-pnp-header-include.md)]

This article describes best practices for extending your Active Directory (AD) environment to Azure to provide distributed authentication services using [Active Directory Domain Services (AD DS)][active-directory-domain-services]. This architecture extends that described in the articles [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture] and [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access].

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This reference architecture uses Resource Manager, which Microsoft recommends for new deployments.

AD DS is used to authenticate user, computer, application, or other identities that are included in a security domain. AD DS can be hosted on-premises, but if your application is a hybrid in which some parts are implemented in Azure it may be more efficient to replicate this functionality and the AD repository in the cloud. This can reduce the latency caused by sending authentication and local authorization requests from the cloud back to AD DS running on-premises. 

There are two ways to host your directory services in Azure:

1. You can use [Azure Active Directory (AAD)][azure-active-directory] to create a new AD domain in the cloud and link it to an on-premises AD domain. Then setup [Azure AD Connect][azure-ad-connect] on-premises to replicate the on-premises repository to Azure.

    > [AZURE.NOTE] Note that the directory in the cloud is a copy and not an extension of the on-premises system. Changes made to identities on-premises are copied to the cloud, but changes made in the cloud are not replicated back to the on-premises domain. For example, password resets must be performed on-premises and be copied to the cloud using Azure AD Connect. Also, note that the same instance of AAD can be linked to more than one instance of AD DS; AAD will contain the identities of each AD repository to which it is linked.

    AAD is useful for situations in which the on-premises network and Azure virtual network hosting the cloud resources are not directly linked by a VPN tunnel or ExpressRoute circuit. Although this solution is simple, it might not be suitable for systems where components could migrate across the on-premises/cloud boundary as this could require reconfiguration of AAD. Also, AAD only handles user authentication rather than computer authentication. Some applications and services, such as SQL Server, may require computer authentication in which case this solution is not appropriate.

2. An existing on-premises AD infrastructure can by extended by deploying a VM running AD DS as a domain controller in Azure. This architecture is commonly used in scenarios in which the on-premises network and Azure virtual network are connected by a VPN and/or ExpressRoute connection. This architecture also supports bi-directional replication and changes can be made either on-premises or in the cloud and both sources will be kept consistent. Depending on your security requirements, the AD installation in the cloud can be part of the same domain as that held on-premises, a new domain within a shared forest, or a separate forest.

This architecture focuses on extending an on-premises infrastructure by deploying an AD DS domain controller to Azure, with both using the same domain. Typical use cases for this architecture include hybrid applications in which functionality is distributed between on-premises and Azure, and applications and services that perform authentication using Active Directory.

## Architecture diagram

The following diagram highlights the important components in this architecture. 

> A Visio document that includes this architecture diagram is available for download at the [Microsoft download center][visio-download]. This diagram is on the <!-- TODO - add new visio-->.

[![0]][0]

- **On-premises network.** The on-premises network includes local AD servers that can perform authentication and authorization for components located on-premises.

- **AD Servers.** These are domain controllers implementing directory services (AD DS)running as VMs in the cloud. These servers can provide authentication of components running in your Azure virtual network.

- **Active Directory subnet.** The AD DS servers are hosted in a separate subnet. NSG rules protect the AD DS servers and provide a firewall against traffic from unexpected sources.

- **Azure Gateway and AD synchronization.**. The Azure gateway provides a connection between the on-premises network and the Azure VNet. This can be a [VPN connection][azure-vpn-gateway] or [Azure ExpressRoute][azure-expressroute]. All synchronization requests between the AD servers in the cloud and on-premises pass through the gateway. User-defined routes (UDRs) handle routing for synchronization traffic which passes directly to the AD server in the cloud and does not pass through the existing network virtual appliances (NVAs) used in this scenario.

For more information about configuring UDRs and the NVAs, see [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture]. For more information about the non-AD DS parts of the architecture, read [Implementing a secure hybrid network architecture in Azure][implementing-a-secure-hybrid-network-architecture] and [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access].

## Recommendations

This section summarizes recommendations for implementing AD DS in Azure, covering:

- VM recommendations.

- Networking recommendations.

- Security recommendations. 

- Active Directory Site recommendations.

- Active Directory FSMO placement recommendations.

>[AZURE.NOTE] The document [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines][ad-azure-guidelines] contains more detailed information on many of these points.

### VM recommendations

Determine your [VM size][vm-windows-sizes] requirements based on the expected volume of authentication requests. You can use the specifications of the machines hosting AD DS on premises as a starting point and match them with the Azure VM sizes. Once deployed, monitor the resource utilization and scale up or down based on the actual resource utilization on the VMs. For more information about sizing AD DS domain controllers, see [Capacity Planning for Active Directory Domain Services][capacity-planning-for-adds].

Create a separate virtual data disk for storing the database, logs, and SYSVOL for AD. Do not store these items on the same disk as the operating system. Note that by default, data disks that are attached to a VM use write-through caching. However, this form of caching can conflict with the requirements of AD DS. For this reason, set the *Host Cache Preference* setting on the data disk to *None*. For more information, see [Placement of the Windows Server AD DS database and SYSVOL][adds-data-disks].

Deploy at least two VMs running AD DS as domain controllers and add them to an [availability set][availability-set].

### Networking recommendations

Configure the VM NIC for each AD DS server with a static private IP address for full DNS support. For more information, see [How to set a static private IP address in the Azure portal][set-a-static-ip-address].

> [AZURE.NOTE] Do not configure the VM NIC for any AD DS with a public IP address. See [Security considerations][security-considerations] for more details.

The AD subnet NSG requires rules to permit incoming traffic from on-premises, and for detailed information on the ports used by AD DS see [Active Directory and Active Directory Domain Services Port Requirements][ad-ds-ports]. Also, ensure the UDR tables do not route AD DS traffic through the NVAs used in this architecture. 

### Active Directory Site recommendations

In AD DS, a site represents a physical location, network, or collection of devices. AD DS sites are used to manage AD DS database replication by grouping together AD DS objects that are located close to one another and are connected by a high speed network. AD DS includes logic to select the best strategy for replacating the AD DS database between sites.

We recommend that you create an AD DS site including the subnets defined for your application in Azure. Then, configure a site link between your on-premises AD DS sites, and AD DS will automatically perform the most efficent database replication possible. Note that this database replication requires little beyond the initial configuration.

### Active Directory Operations Masters recommendations

The Operations Masters role can be assigned to AD DS domain controllers to support consistency checking between instances of replicated AD DS databases. There are five Operations Master roles: schema master, domain naming master, relative identifier master, primary domain controller master emulator, and infrastructure master. Detailed information about these roles is available in the [Operations Masters documentation][ad-ds-operations-masters].

We recommend you do not assign Operations Masters roles to the domain controllers deployed in Azure.  

## Scalability considerations

AD DS is designed for scalability and does not require a specific architecture. You do not need to configure traditional scalability resources such as a load balancer or traffic controller to direct requests to AD DS domain controllers. The only scalability consideration is to ensure you configured your AD DS VMs with the correct size for your network load requirements, monitor the load on the VMs, and scale up or down as necessary.

## Availability considerations

As mentioned earlier, deploy your AD DS VMS into an [availability set][availability-set]. 
Also, consider designating one or more server as a [standby operations master][standby-operations-masters]. A standby operations master is an active copy of the operations master that can be used in place of the primary Operations Masters server during fail over.

## Manageability considerations

Do not substitute a simple remote copy operation on the domain controller VM VHD files for performing a regular AD DS backup. The AD DS database file on the VHD may or may not be in a consistent state when it's copied and restarting the database might not be possible.

Do not shut down a domain controller VM using Azure Portal. Instead, shut down and restart from the guest operating system. An Azure Portal shut down causes the VM causes to be deallocated, which resets both the VM-GenerationID and the invocationID of the AD repository. The discards the AD DS RID pool and marks SYSVOL as non-authoritative and may require reconfiguration of the domain controller.

### Monitoring considerations

Monitor the resources of the domain controller VMs as well as the AD DS Services and create a plan to quickly correct any problems. For more information, see [Monitoring Active Directory][monitoring_ad]. You can also install tools such as [Microsoft Systems Center][microsoft_systems_center] on the monitoring server (see the [architecture diagram][architecture]) to help perform these tasks. 

## Security considerations

AD DS servers provide authentication services and are an attractive target for attacks. To secure them, prevent direct internet connectivity by placing the AD DS servers in a separate subnet with an NSG acting as a firewall. Close all ports on the AD DS servers except those necessary for authentication, authorization, and server synchronization. For more information, see [Active Directory and Active Directory Domain Services Port Requirements][ad-ds-ports]. The [Solution components][solution-components] section in this document shows the NSG rules that the sample solution uses to open ports.

Consider implementing an additional security perimeter around servers with a pair of subnets and NVAs, as described by the document [Implementing a secure hybrid network architecture with Internet access in Azure][implementing-a-secure-hybrid-network-architecture-with-internet-access].

Use either BitLocker or Azure disk encryption to encrypt the disk hosting the AD DS database.

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

28. When the prompt *Please login to each Azure AD server to verify that Directory Services has been configured successfully* appears, open a remote desktop connection from an on-premises machine to the jumpbox (*basename*-jb-vm), and then open another remote desktop connection from the jumpbox to the first AD server (*basename*-ad1-vm). Log in using the `DOMAIN_NAME`, `ADMIN_USER_NAME`, and `ADMIN_PASSWORD` that you specified in the azuredeploy.sh script. Using Server Manager, verify that the AD DS and DNS roles have both been added. Repeat this process for the second AD server (*basename*-ad2-vm).

29. At the prompt in the bash shell window, press a key. When the prompt *Press any key to set the Azure VNet DNS settings to point to the DNS in Azure* appears, press a key and allow the script to update the DNS settings for the VNet.

30. When the prompt *Please verify that the VNet DNS setting has been updated reference the Azure VM DNS servers* appears, using the Azure portal check the *DNS Servers* setting of the *basename*-vnet VNet in the *basename*-ntwk-rg resource group. The primary and secondary DNS servers should now reference the two AD VMs:

	![[13]][13]

31. Restart each of the AD VMs before continuing. This step is necessary to ensure that they each pick up the correct DNS settings from Azure. Wait until both VMs are running before continuing.

32. At the prompt in the bash shell window, press a key. At the next prompt, *Press any key to apply the gateway UDR to the gateway subnet (it might have been removed)*, press a key and allow the script to refresh the gateway UDR.

33. Verify that the script completes successfully.

## Next steps

- Learn the best practices for [creating an ADDS resource forest][adds-resource-forest] in Azure.

- Learn the best practices for [creating an ADFS infrastructure][adfs] in Azure.

<!-- links -->
[ad-ds-operations-masters]: https://technet.microsoft.com/library/cc779716(v=ws.10).aspx
[availabilty-set]: ./virtual-machines/virtual-machines-windows-create-availability-set.md
[resource-manager-overview]: ../azure-resource-manager/resource-group-overview.md
[adfs]: ./guidance-identity-adfs.md
[guidance-vpn-gateway]: ./guidance-hybrid-network-vpn.md
[adds-resource-forest]: ./guidance-identity-adds-resource-forest.md
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
[standby-operations-masters]: https://technet.microsoft.com/library/cc794737(v=ws.10).aspx
[transfer-FSMO-roles]: https://technet.microsoft.com/library/cc816946(v=ws.10).aspx
[view-fsmo-roles]: https://technet.microsoft.com/library/cc816893(v=ws.10).aspx
[read-only-dc]: https://technet.microsoft.com/library/cc732801(v=ws.10).aspx
[AD-sites-and-subnets]: https://blogs.technet.microsoft.com/canitpro/2015/03/03/step-by-step-setting-up-active-directory-sites-subnets-site-links/
[sites-overview]: https://technet.microsoft.com/library/cc782048(v=ws.10).aspx
[implementing-adfs]: ./guidance-iaas-ra-secure-vnet-adfs.md
[onpremdeploy]: https://github.com/mspnp/blueprints/blob/master/ARMBuildingBlocks/guidance-iaas-ra-ad-extension/onpremdeploy.sh
[visio-download]: http://download.microsoft.com/download/1/5/6/1569703C-0A82-4A9C-8334-F13D0DF2F472/RAs.vsdx
[azuredeploy]: https://github.com/mspnp/blueprints/blob/master/ARMBuildingBlocks/guidance-iaas-ra-ad-extension/azuredeploy.sh
[solution-components]: #solution_components
[vm-windows-sizes]: ../virtual-machines/virtual-machines-windows-sizes.md

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