<properties
   pageTitle="Running multiple VMs | Reference Architecture | Microsoft Azure"
   description="How to run multiple VM instances on Azure for scalability, resiliency, manageability, and security."
   services=""
   documentationCenter="na"
   authors="MikeWasson"
   manager="christb"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/25/2016"
   ms.author="mwasson"/>

# Running multiple VMs on Azure for scalability and availability 

[AZURE.INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

This article outlines a set of proven practices for running multiple virtual machine (VM) instances, to improve availability and scalability.   

In this architecture, the workload is distributed across the VM instances. There is a single public IP address, and Internet traffic is distributed to the VMs using a load balancer. This architecture can be used for a single-tier app, such as a stateless web app or storage cluster. It is also a building block for N-tier applications. 

This article builds on [Running a Single VM on Azure][single vm]. The recommendations in that article also apply to this architecture.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This article uses Resource Manager, which Microsoft recommends for new deployments.

## Architecture diagram

![[0]][0]

The architecture has the following components:

- **Availability Set.** The [availability Set][availability set] contains the VMs and is necessary for supporting the [availability SLA for Azure VMs][vm-sla].

- **VNet**. Every VM in Azure is deployed into a virtual network (VNet), which is further divided into **subnets**.

- **Azure Load Balancer.** The [load balancer] distributes incoming Internet requests to the VM instances in an availability set. The load balancer includes some related resources:

    - **Public IP address.** A public IP address is needed for the load balancer to receive Internet traffic.

    - **Front-end configuration.** Associates the public IP address with the load balancer.

    - **Back-end address pool.** Contains the network interfaces (NICs) for the VMs that will receive the incoming traffic.

- **Load balancer rules** are used to distribute network traffic among all the VMs in the back-end address pool. 

- **NAT rules** are used to route traffic to a specific VM. For example, to enable remote desktop (RDP) to the VMs, create a separate NAT rule for each VM. 

- **Network interfaces (NICs)**. Each VM has a NIC to connect to the network.

- **Storage.** Storage accounts hold the VM images and other file-related resources, such as VM diagnostic data captured by Azure.

## Recommendations

### Availability set recommendations

You must create at least two VMs in the availability set to support the [availability SLA for Azure VMs][vm-sla]. Note that the Azure load balancer also requires that load-balanced VMs belong to the same availability set.

### Network recommendations

For this scenario, place all the VMs on the same subnet. Do not expose the VMs directly to the Internet, but instead give each VM a private IP address; clients connect by using the public IP address of the load balancer.

### Load balancer recommendations

Add all VMs in the availability set to the back-end address pool of the load balancer.

Define load balancer rules to direct network traffic to the VMs. For example, to enable HTTP traffic, create a rule that maps port 80 from the front-end configuration to port 80 on the back-end address pool. When the load balancer receives a request on port 80 of the public IP address, it will route the request to port 80 on one of the NICs in the back-end address pool.

Define NAT rules to route traffic to a specific VM. For example, to enable remote desktop (RDP) to the VMs, create a separate NAT rule for each VM. Each rule should map a distinct port number to port 3389, which is the default port for RDP. (For example, use port 50001 for "VM1", port 50002 for "VM2", and so on.) Assign the NAT rules to the NICs on the VMs.

### Storage account recommendations

Create separate Azure storage accounts for each VM to hold the VHDs, in order to avoid hitting the [IOPS limits][vm-disk-limits] for storage accounts. 

Create one storage account for diagnostic logs. This storage account can be shared by all the VMs.

## Scalability considerations

The load balancer takes incoming network requests and distributes them across the NICs in the back-end address pool. To scale horizontally, add more VM instances to the Availability Set (or deallocate VMs to scale down). 

For example, suppose you're running a web server. You would add a load balancer rule for port 80 and/or port 443 (for SSL). When a client sends an HTTP request, the load balancer picks a back-end IP address by using a [hashing algorithm][load balancer hashing] that includes the source IP address. In that way, client requests are distributed across all the VMs. 

> [AZURE.TIP] When you add a new VM to an Availability Set, make sure to create a NIC for the VM, and add the NIC to the back-end address pool on the load balancer. Otherwise, Internet traffic won't be routed to the new VM.

Each Azure Subscription has default limits in place, including a maximum number of VMs per region. You can increase the limit by filing a support request. For more information, see [Azure subscription and service limits, quotas, and constraints][subscription-limits].  

## Availability considerations

The Availability Set makes your app more resilient to both planned and unplanned maintenance events.

- _Planned maintenance_ occurs when Microsoft updates the underlying platform. Sometimes, that causes VMs to be restarted. Azure makes sure the VMs in an Availability Set are not restarted all at the same time, so at least one is kept running while others are restarting.

- _Unplanned maintenance_ happens if there is a hardware failure. Azure makes sure that VMs within an Availability Set are provisioned across more than one server rack. This helps to reduce the impact of hardware failures, network outages, power interruptions, and so on.

For more information, see [Manage the availability of virtual machines][availability set]. The following video also has a good overview of Availability Sets: [How Do I Configure an Availability Set to Scale VMs][availability set ch9]. 

> [AZURE.WARNING]  Make sure to configure the Availability Set when you provision the VM. Currently, there is no way to add a Resource Manager VM to an Availability Set after the VM is provisioned.

The load balancer uses [health probes] to monitor the availability of VM instances. If a probe cannot reach an instance within a timeout period, the load balancer stops sending traffic to that VM. However, the load balancer will continue to probe, and if the VM becomes available again, the load balancer resumes sending traffic to that VM.

Here are some recommendations on load balancer health probes:

- Probes can test either HTTP or TCP.  If your VMs run an HTTP server (IIS, nginx, Node.js app, etc), create an HTTP probe. Otherwise create a TCP probe.

- For an HTTP probe, specify the path to the HTTP endpoint. The probe checks for an HTTP 200 response from this path. Use a path that best represents the health of the VM instance. This can be the root path ("/"), or you might implement a specific health-monitoring endpoint that has some custom logic. The endpoint must allow anonymous HTTP requests.

- The probe is sent from a [known][health-probe-ip] IP address, 168.63.129.16. Make sure you don't block traffic to or from this IP in any firewall policies or network security group (NSG) rules.

- Use [health probe logs][health probe log] to view the status of the health probes. Enable logging in the Azure portal for each load balancer. Logs are written to Azure blob storage. The logs show how many VMs on the back-end are not receiving network traffic due to failed probe responses.

## Manageability considerations

With multiple VMs, it becomes important to automate processes, so they are reliable and repeatable. You can use [Azure Automation][azure-automation] to automate deployment, OS patching, and other tasks. Azure Automation is an automation service that runs on Azure, and is based on Windows PowerShell. Example automation scripts are available at the [Runbook Gallery] on TechNet.

## Security considerations

Virtual networks are a traffic isolation boundary in Azure. VMs in one VNet cannot communicate directly to VMs in a different VNet. VMs within the same VNet can communicate, unless you create [network security groups][nsg] (NSGs) to restrict traffic. For more information, see [Microsoft cloud services and network security][network-security].

For incoming Internet traffic, the load balancer rules define which traffic can reach the back end. However, load balancer rules don't support IP whitelisting, so if you want to whitelist certain public IP addresses, add an NSG to the subnet.

## Solution components

A sample solution script, [Deploy-ReferenceArchitecture.ps1][solution-script], is available that you can use to implement the architecture that follows the recommendations described in this article. This script utilizes [Resource Manager][ARM-Templates] templates. The templates are available as a set of fundamental building blocks, each of which performs a specific action such as creating a VNet or configuring an NSG. The purpose of the script is to orchestrate template deployment.

>[AZURE.NOTE] Deploy-ReferenceArchitecture.ps1 is a PowerShell script. If your operating system does not support PowerShell, a bash script called [deploy-reference-architecture.sh][solution-script-bash] is also available.

The templates are parameterized, with the parameters held in separate JSON files. You can modify the parameters in these files to configure the deployment to meet your own requirements. You do not need to amend the templates themselves. Note that you must not change the schemas of the objects in the parameter files.

When you edit the templates, create objects that follow the naming conventions described in [Recommended Naming Conventions for Azure Resources][naming conventions].

The script references the following parameter files to build the VMs and the surrounding infrastructure. Note that there are two versions of these files; one for Windows VMs and another for Linux (RedHat). The examples shown below depict the Windows versions. The Linux files are very similar except where described:

- **[virtualNetwork.parameters.json][vnet-parameters-windows]**. This file defines the VNet settings, such as the name, address space, subnets, and the addresses of any DNS servers required. Note that subnet addresses must be contained within the address space of the VNet.

    <!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-multi-vm/parameters/windows/virtualNetwork.parameters.json#L4-L21 -->
	```json
    "parameters": {
      "virtualNetworkSettings": {
        "value": {
          "name": "ra-multi-vm-vnet",
          "resourceGroup": "ra-multi-vm-rg",
          "addressPrefixes": [
            "10.0.0.0/16"
          ],
          "subnets": [
            {
              "name": "ra-multi-vm-sn",
              "addressPrefix": "10.0.0.0/24"
            }
          ],
          "dnsServers": [ ]
        }
      }
    }
	```

- **[networkSecurityGroup.parameters.json][nsg-parameters-windows]**. This file contains the definitions of NSGs and NSG rules. The `name` parameter in the `virtualNetworkSettings` block specifies the VNet to which the NSG is attached. The `subnets` parameter in the `networkSecurityGroupSettings` block identifies any subnets which apply the NSG rules in the VNet. These should be items defined in the **virtualNetwork.parameters.json** file.

    <!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-multi-vm/parameters/windows/networkSecurityGroups.parameters.json#L4-L47 -->
	```json
    "parameters": {
      "virtualNetworkSettings": {
        "value": {
          "name": "ra-multi-vm-vnet",
          "resourceGroup": "ra-multi-vm-rg"
        }
      },
      "networkSecurityGroupsSettings": {
        "value": [
          {
            "name": "ra-multi-vm-nsg",
            "subnets": [
              "ra-multi-vm-sn"
            ],
            "networkInterfaces": [
            ],
            "securityRules": [
              {
                "name": "default-allow-rdp",
                "direction": "Inbound",
                "priority": 100,
                "sourceAddressPrefix": "*",
                "destinationAddressPrefix": "*",
                "sourcePortRange": "*",
                "destinationPortRange": "3389",
                "access": "Allow",
                "protocol": "Tcp"
              },
              {
                "name": "default-allow-http",
                "protocol": "Tcp",
                "sourcePortRange": "*",
                "destinationPortRange": "80",
                "sourceAddressPrefix": "*",
                "destinationAddressPrefix": "*",
                "access": "Allow",
                "priority": 110,
                "direction": "Inbound"
              }
            ]
          }
        ]
      }
    }
	```

	Note that the default security rule shown in the example enables a user to connect to a Windows VM through a remote desktop (RDP) connection. The `securityRules` array for the Linux version of this file opens port 22 to enable SSH connections:

    <!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-multi-vm/parameters/linux/networkSecurityGroups.parameters.json#L20-L31 -->
	```json
	"securityRules": [
      {
        "name": "default-allow-ssh",
        "direction": "Inbound",
        "priority": 100,
        "sourceAddressPrefix": "*",
        "destinationAddressPrefix": "*",
        "sourcePortRange": "*",
        "destinationPortRange": "22",
        "access": "Allow",
        "protocol": "Tcp"
      },
	```

	You can open additional ports (or deny access through specific ports) by adding further items to the `securityRules` array. For example, if you wish to enable outside access to the HTTP service, you should add a rule that opens TCP port 80.

- **[loadBalancerParameters.json][loadbalancer-parameters-windows]**. This file defines the settings for the VMs, including the [size of each VM][VM-sizes], the security credentials for the admin user, the disks to be created, the storage accounts to hold these disks. This file also contains the definition of an availability set for the VMs, and the load balancer configuration for distributing traffic across the VMs in this set.

    <!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-multi-vm/parameters/windows/loadBalancer.parameters.json#L4-L127 -->
	```json
    "parameters": {
      "virtualMachinesSettings": {
        "value": {
          "namePrefix": "ra-multi",
          "computerNamePrefix": "cn",
          "size": "Standard_DS1_v2",
          "osType": "windows",
          "adminUsername": "testuser",
          "adminPassword": "AweS0me@PW",
          "sshPublicKey": "",
          "osAuthenticationType": "password",
          "nics": [
            {
              "isPublic": "false",
              "subnetName": "ra-multi-vm-sn",
              "privateIPAllocationMethod": "dynamic",
              "publicIPAllocationMethod": "dynamic",
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
          "extensions": [
            {
              "name": "iis-config-ext",
              "settingsConfigMapperUri": "https://raw.githubusercontent.com/mspnp/template-building-blocks/master/templates/resources/Microsoft.Compute/virtualMachines/extensions/vm-extension-passthrough-settings-mapper.json",
              "publisher": "Microsoft.Powershell",
              "type": "DSC",
              "typeHandlerVersion": "2.20",
              "autoUpgradeMinorVersion": true,
              "settingsConfig": {
                "modulesUrl": "https://raw.githubusercontent.com/mspnp/reference-architectures/master/guidance-compute-multi-vm/extensions/windows/iisaspnet.ps1.zip",
                "configurationFunction": "iisaspnet.ps1\\iisaspnet"
              }
            }
          ],
          "availabilitySet": {
            "useExistingAvailabilitySet": "No",
            "name": "ra-multi-vm-as"
          }
        }
      },
      "loadBalancerSettings": {
        "value": {
          "name": "ra-multi-vm-lb",
          "frontendIPConfigurations": [
            {
              "name": "ra-multi-vm-lb-fe-config1",
              "loadBalancerType": "public",
              "internalLoadBalancerSettings": {
                "privateIPAddress": "10.0.0.250",
                "subnetName": "ra-multi-vm-sn"
              }
            }
          ],
          "loadBalancingRules": [
            {
              "name": "lbr1",
              "frontendPort": 80,
              "backendPort": 80,
              "protocol": "Tcp",
              "backendPoolName": "ra-multi-vm-lb-bep1",
              "frontendIPConfigurationName": "ra-multi-vm-lb-fe-config1",
              "probeName": "lbp1"
            }
          ],
          "probes": [
            {
              "name": "lbp1",
              "port": 80,
              "protocol": "Http",
              "requestPath": "/"
            }
          ],
          "backendPools": [
            {
              "name": "ra-multi-vm-lb-bep1",
              "nicIndex": 0
            }
          ],
          "inboundNatRules": [
            {
              "namePrefix": "rdp",
              "frontendIPConfigurationName": "ra-multi-vm-lb-fe-config1",
              "startingFrontendPort": 50000,
              "backendPort": 3389,
              "natRuleType": "All",
              "protocol": "Tcp",
              "nicIndex": 0
            }
          ]
        }
      },
      "virtualNetworkSettings": {
        "value": {
          "name": "ra-multi-vm-vnet",
          "resourceGroup": "ra-multi-vm-rg"
        }
      },
      "buildingBlockSettings": {
        "value": {
          "storageAccountsCount": 1,
          "vmCount": 2,
          "vmStartIndex": 1
        }
      }
  }
	```

	Note that the physical VM names and the logical computer names of the VMs are generated, based on the values specified for the `namePrefix` and `computerNamePrefix` parameters. For example, using the default values for these parameters (shown above), the physical names of the VMs that appear in the Azure portal will be ra-multi-vm0 and ra-multi-vm1. The computer names of the VMs that appear on the virtual network will be cn0 and cn1.

	The `subnetName` parameter in the `nics` section specifies the subnet for the VM. Similarly, the `name` parameter in the `virtualNetworkSettings` identifies the VNet to use. These should be the name of a subnet and VNet defined in the **virtualNetwork.parameters.json** file.

	You must specify an image in the `imageReference` section. The values shown above create a VM with the latest build of Windows Server 2012 R2 Datacenter. You can use the following Azure CLI command to obtain a list of all available Windows images in a region (the example uses the westus region):

	```text
	azure vm image list westus MicrosoftWindowsServer WindowsServer
	```

	The default configuration for building Linux VMs references Ubuntu Linux 14.04. The `imageReference` section looks like this:

    <!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-multi-vm/parameters/linux/loadBalancer.parameters.json#L26-L31 -->
	```json
  "imageReference": {
      "publisher": "Canonical",
      "offer": "UbuntuServer",
      "sku": "14.04.5-LTS",
      "version": "latest"
  },
	```

	Note that in this case the `osType` parameter must be set to `linux`. If you want to base your VMs on a different build of Linux from a different vendor, you can use the `azure vm image list` command to view the available images.

	The `loadBalancerSettings` section specifies the configuration for the load balancer used to direct traffic to the VMs. The default configuration creates a public load balancer with an internal IP address of `10.0.0.250`. You can change this, but the address must fall within the address space of the specified subnet. The load balancer rules handle traffic appearing on TCP port 80 with a health probe referencing the same port. You can change these ports as appropriate, and you can add further load balancing rules if you need to open up different ports.

	>[AZURE.NOTE] The template does not install a web server on the VMs. You must perform this task manually after deploying the solution.

	The load balancer also implements NAT rules to support RDP or SSH access directly to a specific VM; port 50000 in the load balancer is mapped to the RDP or SSH port on the first VM, port 50001 is mapped to the RDP or SSH port on the second VM, and so on.

	The `vmCount` parameter in the `buildingBlockSettings` section determines the number of VMs to build.

## Solution deployment

The solution assumes the following prerequisites:

- You have an existing Azure subscription in which you can create resource groups.

- You have installed the [Azure Command-Line Interface][azure-cli].

- If you wish to use PowerShell, you have downloaded and installed the most recent build. See [here][azure-powershell-download] for instructions.

To run the script that deploys the solution:

1. Create a folder named `Scripts` that contains a subfolder named `Parameters`.

2. Download the [Deploy-ReferenceArchitecture.ps1][solution-script] PowerShell script or [deploy-reference-architecture.sh][solution-script-bash] bash script, as appropriate, to the Scripts folder.

3. If you are building a set of Windows VMs:

	1. In the Parameters folder, create another subfolder named Windows.

	2. Download the following files to Parameters/Windows folder:

		- [virtualNetwork.parameters.json][vnet-parameters-windows]

		- [networkSecurityGroup.parameters.json][nsg-parameters-windows]

		- [loadBalancerParameters.json][loadbalancer-parameters-windows]

4. If you are building a set of Linux VMs:

	1. In the Parameters folder, create another subfolder named Linux.

	2. Download the following files to Parameters/Linux folder:

		- [virtualNetwork.parameters.json][vnet-parameters-linux]

		- [networkSecurityGroup.parameters.json][nsg-parameters-linux]

		- [loadBalancerParameters.json][loadbalancer-parameters-linux]

5. Edit the Deploy-ReferenceArchitecture.ps1 or deploy-reference-architecture.sh file in the Scripts folder, and change the following line to specify the resource group that should be created or used to hold the VM and resources created by the script:

    <!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-multi-vm/Deploy-ReferenceArchitecture.ps1#L38 -->
	```powershell
	$resourceGroupName = "ra-multi-vm-rg"
	```

    <!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-multi-vm/deploy-reference-architecture.sh#L3 -->
	```bash
	RESOURCE_GROUP_NAME="ra-multi-vm-rg"
	```

6. Edit each of the JSON files in the Parameters/Windows or Parameters/Linux folder to set the parameters for the virtual network, NSG, VMs, and load balancer, as described in the Solution Components section above.

	>[AZURE.NOTE] Make sure that you set the `resourceGroup` value in the `virtualNetworkSettings` section in each of the parameter files to be the same as that you specified in the Deploy-ReferenceArchitecture.ps1 script file.

7. If you are using PowerShell, open an Azure PowerShell window, move to the Scripts folder, and run the following command:

	```powershell
	.\Deploy-ReferenceArchitecture.ps1 <subscription id> <location> <os-type>
	```

	Replace `<subscription id>` with your Azure subscription ID.

	For `<location>`, specify an Azure region, such as `eastus` or `westus`.

	Specify `windows` or `linux` for `<os-type>`

8. If you are using bash, open a bash shell command prompt, move to the Scripts folder, and run the following command:

	```bash
	azure login
	```

	Follow the instructions to log in to your Azure account. When you have connected, run the following command:

	```bash
	./deploy-reference-architecture.sh -s <subscription id> -l <location> -o <os-type>
	```

	Replace `<subscription id>` with your Azure subscription ID.

	For `<location>`, specify an Azure region, such as `eastus` or `westus`.

	Specify `windows` or `linux` for `<os-type>`

9. When the script has completed, use the Azure portal to verify that the network, NSG, VMs, and load balancer have been created successfully.

## Next steps

- Placing several VMs behind a load balancer is a building block for creating multi-tier architectures. For more information, see [Running VMs for an N-tier architecture on Azure][3-tier-blueprint].

<!-- Links -->
[3-tier-blueprint]: guidance-compute-3-tier-vm.md
[availability set]: ../virtual-machines/virtual-machines-windows-manage-availability.md
[availability set ch9]: https://channel9.msdn.com/Series/Microsoft-Azure-Fundamentals-Virtual-Machines/08
[azure-automation]: https://azure.microsoft.com/en-us/documentation/services/automation/
[azure-cli]: ../virtual-machines-command-line-tools.md
[bastion host]: https://en.wikipedia.org/wiki/Bastion_host
[health probe log]: ../load-balancer/load-balancer-monitor-log.md
[health probes]: ../load-balancer/load-balancer-overview.md#service-monitoring
[health-probe-ip]: ../virtual-network/virtual-networks-nsg.md#special-rules
[load balancer]: ../load-balancer/load-balancer-get-started-internet-arm-cli.md
[load balancer hashing]: ../load-balancer/load-balancer-overview.md#hash-based-distribution
[naming conventions]: guidance-naming-conventions.md
[network-security]: ../best-practices-network-security.md
[nsg]: ../virtual-network/virtual-networks-nsg.md
[resource-manager-overview]: ../resource-group-overview.md 
[Runbook Gallery]: ../automation/automation-runbook-gallery.md#runbooks-in-runbook-gallery
[single vm]: guidance-compute-single-vm.md
[subscription-limits]: ../azure-subscription-service-limits.md
[vm-disk-limits]: ../azure-subscription-service-limits.md#virtual-machine-disk-limits
[vm-sla]: https://azure.microsoft.com/en-us/support/legal/sla/virtual-machines/v1_0/
[ARM-Templates]: https://azure.microsoft.com/documentation/articles/resource-group-authoring-templates/
[VM-sizes]: https://azure.microsoft.com/documentation/articles/virtual-machines-windows-sizes/
[solution-script]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-multi-vm/Deploy-ReferenceArchitecture.ps1
[solution-script-bash]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-multi-vm/deploy-reference-architecture.sh
[vnet-parameters-windows]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-multi-vm/parameters/windows/virtualNetwork.parameters.json
[nsg-parameters-windows]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-multi-vm/parameters/windows/networkSecurityGroups.parameters.json
[loadbalancer-parameters-windows]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-multi-vm/parameters/windows/loadBalancer.parameters.json
[vnet-parameters-linux]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-multi-vm/parameters/linux/virtualNetwork.parameters.json
[nsg-parameters-linux]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-multi-vm/parameters/linux/networkSecurityGroups.parameters.json
[loadbalancer-parameters-linux]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-multi-vm/parameters/linux/loadBalancer.parameters.json
[azure-powershell-download]: https://azure.microsoft.com/documentation/articles/powershell-install-configure/
[azure-cli]: https://azure.microsoft.com/documentation/articles/xplat-cli-install/
[0]: ./media/blueprints/compute-multi-vm.png "Architecture of a multi-VM solution on Azure comprising an availability set with two VMs and a load balancer"
