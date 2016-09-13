<properties
   pageTitle="Running VMs for an N-tier architecture | Reference Architecture | Microsoft Azure"
   description="How to implement a multi-tier architecture on Azure, paying particular attention to availability, security, scalability, and manageability security."
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
   ms.date="08/26/2016"
   ms.author="mikewasson"/>

# Running VMs for an N-tier architecture on Azure

[AZURE.INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

This article outlines a set of proven practices for running virtual machines (VMs) for an application with an N-tier architecture.

There are variations of N-tier architectures. For the most part, the differences shouldn't matter for the purposes of these recommendations. This article assumes a typical 3-tier web app:

- **Web tier.** Handles incoming HTTP requests. Responses are returned through this tier.

- **Business tier.** Implements business processes and other functional logic for the system.

- **Database tier.** Provides persistent data storage.

> [AZURE.NOTE] Azure has two different deployment models: [Resource Manager][resource-manager-overview] and classic. This article uses Resource Manager, which Microsoft recommends for new deployments.

## Architecture diagram

The following diagram builds on the topology shown in [Running multiple VMs on Azure][multi-vm].

![[0]][0]

- **Availability Sets.** Create an [Availability Set][azure-availability-sets] for each tier, and provision at least two VMs in each tier. This approach is required to reach the availability [SLA][vm-sla] for VMs.

- **Subnets.** Create a separate subnet for each tier. Specify the address range and subnet mask using [CIDR] notation. 

- **Load balancers.** Use an [Internet-facing load balancer][load-balancer-external] to distribute incoming Internet traffic to the web tier, and an [internal load balancer][load-balancer-internal] to distribute network traffic from the web tier to the business tier.

- **Jumpbox**. A _jumpbox_, also called a [bastion host], is a VM on the network that administrators use to connect to the other VMs. The jumpbox has an NSG that allows remote traffic only from whitelisted public IP addresses. The NSG should permit remote desktop (RDP) traffic if the jumpbox is a Windows VM, or secure shell (SSH) requests if the jumpbox is a Linux VM.

- **Monitoring**. Monitoring software sush as [Nagios], [Zabbix], or [Icinga] can give you insight into response time, VM uptime, and the overall health of your system. Install the monitoring software on a VM that's placed in a separate management subnet.

- **NSGs**. Use [network security groups][nsg] (NSGs) to restrict network traffic within the VNet. For example, in the 3-tier architecture shown here, the database tier does not accept traffic from the web front end, only from the business tier and the management subnet.

- **Key Vault**. Use [Azure Key Vault][azure-key-vault] to manage encryption keys, for encrypting data at rest.

## Recommendations

### VNet / Subnets

- When you create the VNet, allocate enough address space for the subnets you will need. Specify the address range and subnet mask using [CIDR] notation. Use an address space that falls within the standard [private IP address blocks][private-ip-space], which are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.

- Don't pick an address range that overlaps with your on-premise network, in case you need to set up a gateway between the VNet and your on-premise network later. Once you create the VNet, you can't change the address range.

- Design subnets with functionality and security requirements in mind. All VMs within the same tier or role should go into the same subnet, which can be a security boundary. Specify the address space for the subnet in CIDR notation. For example, '10.0.0.0/24' creates a range of 256 IP addresses. (VMs can use 251 of these; five are reserved. For more information, see the [Virtual Network FAQ][vnet faq].) Make sure the address ranges don't overlap across subnets.

### Load balancers

- The external load balancer distributes Internet traffic to the web tier. Create a public IP address for this load balancer. Example:

    ```text
    azure network public-ip create --name pip1 --location westus --resource-group rg1
    azure network lb create --name lb1 --location --location westus --resource-group rg1
    azure network lb frontend-ip create --name lb1-frontend --lb-name lb1 --public-ip-name pip1 --resource-group rg1
    ```

    For more information, see [Get started creating an Internet facing load balancer using Azure CLI][load-balancer-external-cli]

- The internal load balancer distributes network traffic from the web tier to the business tier. To give this load balancer a private IP address, create a frontend IP configuration and associate it with the subnet for the business tier. Example:

    ```text
    azure network lb create --name lb2 --location --location westus --resource-group rg1
    azure network lb frontend-ip create --name lb2-frontend --lb-name lb2 --subnet-name subnet1
        --subnet-vnet-name vnet1 --resource-group rg1
    ```

    For more information, see [Get started creating an internal load balancer using the Azure CLI][load-balancer-internal-cli].

### Jumpbox

- Place the jumpbox in the same VNet as the other VMs, but in a separate management subnet.

- Create a [public IP address] for the jumpbox.

- Use a small VM size for the jumpbox, such as Standard A1.

- Configure the NSGs for the web tier, business tier, and database tier subnets to allow administrative (RDP/SSH) traffic to pass through from the management subnet.

- To secure the jumpbox, create an NSG and apply it to the jumpbox subnet. Add an NSG rule that allows RDP or SSH connections only from a whitelisted set of public IP addresses.

    The NSG can be attached either to the subnet or to the jumpbox NIC. In this case, we recommend attaching it to the NIC, so RDP/SSH traffic is permitted only to the jumpbox, even if you add other VMs to the same subnet.

## Availability considerations

- Put each tier or VM role into a separate availability set. Don't put VMs from different tiers into the same availability set. 

- At the database tier, having multiple VMs does not automatically translate into a highly available database. For a relational database, you will typically need to use replication and failover to achieve high availability. The business tier will connect to a primary database, and if that VM goes down, the application fails over to a secondary database, either manually or automatically.

> [AZURE.NOTE] For SQL Server, we recommend using [AlwaysOn Availability Groups][sql-alwayson]. 

## Security considerations

- Encrypt data at rest. Use [Azure Key Vault][azure-key-vault] to manage the database encryption keys. Key Vault can store encryption keys in hardware security modules (HSMs). For more information, see [Configure Azure Key Vault Integration for SQL Server on Azure VMs][sql-keyvault] It's also recommended to store application secrets, such as database connection strings, in Key Vault.

- Do not allow RDP/SSH access from the public Internet to the VMs that run the application workload. Instead, all RDP/SSH access to these VMs must come through the jumpbox. An administrator logs into the jumpbox, and then logs into the other VM from the jumpbox. The jumpbox allows RDP/SSH traffic from the Internet, but only from known, whitelisted IP addresses.

- Use NSG rules to restrict traffic between tiers. For example, in the 3-tier architecture shown above, the web tier does not communicate directly with the database tier. To enforce this, the database tier should block incoming traffic from the web tier subnet.  

  1. Create an NSG and associate it to the database tier subnet.

  1. Add a rule that denies all inbound traffic from the VNet. (Use the `VIRTUAL_NETWORK` tag in the rule.) 

  2. Add a rule with a higher priority that allows inbound traffic from the business tier subnet. This rule overrides the previous rule, and allows the business tier to talk to the database tier.

  3. Add a rule that allows inbound traffic from within the database tier subnet itself. This rule allows communication between VMs in the database tier, which is needed for database replication and failover.

  4. Add a rule that allows RDP/SSH traffic from the jumpbox subnet. This rule lets administrators connect to the database tier from the jumpbox.

  > [AZURE.NOTE] An NSG has [default rules][nsg-rules] that allow any inbound traffic from within the VNet. These rules can't be deleted, but you can override them by creating higher-priority rules.

## Scalability considerations

The load balancers distribute network traffic to the web and business tiers. Scale horizontally by adding new VM instances. Note that you can scale the web and business tiers independently, based on load. To reduce possible complications caused by the need to maintain client affinity, the VMs in the web tier should be stateless. The VMs hosting the business logic should also be stateless.

## Manageability considerations

Simplify management of the entire system by using centralized administration tools such as [Azure Automation][azure-administration], [Microsoft Operations Management Suite][operations-management-suite], [Chef][chef], or [Puppet][puppet]. These tools can consolidate diagnostic and health information captured from multiple VMs to provide an overall view of the system.

## Solution components

A sample solution script, [Deploy-ReferenceArchitecture.ps1][solution-script], is available that you can use to implement the architecture that follows the recommendations described in this article. This script utilizes [Resource Manager][arm-templates] templates. The templates are available as a set of fundamental building blocks, each of which performs a specific action such as creating a VNet or configuring an NSG. The purpose of the script is to orchestrate template deployment.

>[AZURE.NOTE] Deploy-ReferenceArchitecture.ps1 is a PowerShell script. If your operating system does not support PowerShell, a bash script called [deploy-reference-architecture.sh][solution-script-bash] is also available.

The templates are parameterized, with the parameters held in separate JSON files. You can modify the parameters in these files to configure the deployment to meet your own requirements. You do not need to amend the templates themselves. Note that you must not change the schemas of the objects in the parameter files.

When you edit the templates, create objects that follow the naming conventions described in [Recommended Naming Conventions for Azure Resources][naming conventions].

The script references the following parameter files to build the VMs and the surrounding infrastructure. Note that there are two versions of these files; one for Windows VMs and another for Linux (RedHat). The examples shown below depict the Windows versions. The Linux files are very similar except where described:

- **[virtualNetwork.parameters.json][vnet-parameters-windows]**. This file defines the VNet settings. The VNet contains separate subnets for the web, business, and database tiers, and a further subnet for hosting the VMs running management services. You can also specify the addresses of any DNS servers required. Note that subnet addresses must be contained within the address space of the VNet:

<!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-n-tier/parameters/windows/virtualNetwork.parameters.json#L4-L32 -->

```json
  "parameters": {
    "virtualNetworkSettings": {
      "value": {
        "name": "ra-vnet",
        "addressPrefixes": [
          "10.0.0.0/16"
        ],
        "subnets": [
          {
            "name": "app1-web-sn",
            "addressPrefix": "10.0.0.0/24"
          },
          {
            "name": "app1-biz-sn",
            "addressPrefix": "10.0.1.0/24"
          },
          {
            "name": "app1-data-sn",
            "addressPrefix": "10.0.2.0/24"
          },
          {
            "name": "app1-mgmt-sn",
            "addressPrefix": "10.0.3.0/24"
          }
        ],
        "dnsServers": [ ]
      }
    }
  }
```

- **[webTier.parameters.json][webtier-parameters-windows]**. This file defines the settings for the VMs in the web tier, including the [size of each VM][VM-sizes], the security credentials for the admin user, the disks to be created, the storage accounts to hold these disks. This file also contains the definition of an availability set for the VMs, and the load balancer configuration for distributing traffic across the VMs in this set.

<!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-n-tier/parameters/windows/webTier.parameters.json#L4-L103 -->

```json
  "parameters": {
    "loadBalancerSettings": {
      "value": {
        "name": "app1-web-lb",
        "frontendIPConfigurations": [
          {
            "name": "lb-fe-config1",
            "loadBalancerType": "public",
            "internalLoadBalancerSettings": {
              "privateIPAddress": "10.0.0.250",
              "subnetName": "app1-web-sn"
            }
          }
        ],
        "loadBalancingRules": [
          {
            "name": "lbr1",
            "frontendPort": 80,
            "backendPort": 80,
            "protocol": "Tcp",
            "backendPoolName": "lb-bep1",
            "frontendIPConfigurationName": "lb-fe-config1"
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
            "name": "lb-bep1",
            "nicIndex": 0
          }
        ],
        "inboundNatRules": [ ]
      }
    },
    "virtualMachinesSettings": {
      "value": {
        "namePrefix": "ra",
        "computerNamePrefix": "cn",
        "size": "Standard_DS1",
        "adminUsername": "testuser",
        "adminPassword": "AweS0me@PW",
        "osType": "windows",
        "osAuthenticationType": "password",
        "sshPublicKey": "",
        "nics": [
          {
            "isPublic": "false",
            "isPrimary": "true",
            "subnetName": "app1-web-sn",
            "privateIPAllocationMethod": "dynamic",
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
        "osDisk": {
          "caching": "ReadWrite"
        },
        "dataDisks": {
          "count": 1,
          "properties": {
            "diskSizeGB": 128,
            "caching": "None",
            "createOption": "Empty"
          }
        },
        "extensions": [ ],
        "availabilitySet": {
          "useExistingAvailabilitySet": "No",
          "name": "app1-web-as"
        },
        "extensions": [ ]
      }
    },
    "virtualNetworkSettings": {
      "value": {
        "name": "ra-vnet",
        "resourceGroup": "ra-ntier-vm-rg"
      }
    },
    "buildingBlockSettings": {
      "value": {
        "storageAccountsCount": 1,
        "vmCount": 3,
        "vmStartIndex": 1
      }
    }
  }
```

  The `virtualMachineSettings` section contains the configuration details for the VMs. The physical VM names and the logical computer names of the VMs are generated, based on the values specified for the `namePrefix` and `computerNamePrefix` parameters together with the `vmCount` parameter in the `buildingBlockSettings` section at the end of the file. (The `vmCount` parameter determines the number of VMs to build, and the `vmStartIndex` parameter indicates a starting point for numbering VMs.) The values shown above generate the suffixes 1, 2, and 3 which are appended to the names generated by the `namePrefix` and `computerNamePrefix`. Using the default values for these parameters (shown above), the physical names of the VMs that appear in the Azure portal will be ra-vm1, ra-vm2, and ra-vm3. The computer names of the VMs that appear on the virtual network will be cn1, cn2, and cn3.

  The `subnetName` parameter in the `nics` section specifies the subnet for the VMs. Similarly, the `name` parameter in the `virtualNetworkSettings` identifies the VNet to use. These should be the name of a subnet and VNet defined in the **virtualNetwork.parameters.json** file.

  You must specify an image in the `imageReference` section. The values shown above create a VM with the latest build of Windows Server 2012 R2 Datacenter. You can use the following Azure CLI command to obtain a list of all available Windows images in a region (the example uses the westus region):

  ```text
  azure vm image list westus MicrosoftWindowsServer WindowsServer
  ```

  The default configuration for building Linux VMs references Ubuntu Linux 14.04. The `imageReference` section looks like this:

<!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-n-tier/parameters/linux/webTier.parameters.json#L65-L70 -->

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

  >[AZURE.NOTE] The template does not install any web servers on the VMs in this tier. You can install a web server of your choice (IIS, Apache, etc) manually.

- **[businessTier.parameters.json][businesstier-parameters-windows]**. This file contains the settings for the load balancer and VMs in the business tier. The parameters are very similar to those used by the template for creating the web tier. Note that you must set the values in the `buildingBlockSettings` section at the end of the file to ensure that VM and computer names do not clash with those in the web tier. The default configuration (shown below) creates a set of 3 VMs starting with suffix 4. The default web tier configuration uses suffixes 1 through 3, but if you create more VMs in the web tier you should adjust the `vmStartIndex` in this file:

<!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-n-tier/parameters/windows/businessTier.parameters.json#L96-L102 -->

```json
  "buildingBlockSettings": {
    "value": {
      "storageAccountsCount": 1,
      "vmCount": 3,
      "vmStartIndex": 4
    }
  }
```

- **[dataTier.parameters.json][datatier-parameters-windows]**. This file contains the settings for the load balancer and VMs in the database tier. As before, the parameters are very similar to those used by the template for creating the web tier. Again, you must be careful to set the `vmStartIndex` value in the `buildingBlockSettings` section of this file to avoid clashes with VM and computer names in the other two tiers.

  >[AZURE.NOTE] The template does not install any database software on the VMs in this tier. You must perform this task manually.

- **[networkSecurityGroup.parameters.json][nsg-parameters-windows]**. This file contains the definitions of NSGs and NSG rules for each of the subnets. The `name` parameter in the `virtualNetworkSettings` block specifies the VNet to which the NSG is attached. The `subnets` parameter in each of the `networkSecurityGroupSettings` blocks identifies the subnets which apply the NSG rules in the VNet. These should be items defined in the **virtualNetwork.parameters.json** file.

  The security groups implement the following rules:

  - The business tier only permits traffic that arrives on port 80 from VMs in the web tier. All other traffic is blocked.

  - The database tier only permits traffic that arrives on port 80 from VMs in the business tier. All other traffic is blocked.

  - The web tier only permits traffic that arrives on port 80. These requests can originate from an external network or from VMs in any of the subnets in the VNet. All other traffic is blocked.

  - The management subnet permits a user to connect to a VMs in this tier through a remote desktop (RDP) connection. All other traffic is blocked.
    For security purposes, the web, business, and database tiers block RDP/SSH traffic by default, even from the management tier. You can temporarily create additional rules to open these ports to enable you to connect and install software on these tiers, but then you can disable them again afterwards. However, you should open any ports required by whatever tools you are using to monitor and manage the web, business, and database tiers from the management tier.

  >[AZURE.IMPORTANT] The NSG rules for the management tier are applied to the NIC for the jump box rather than the management subnet. The default name for this NIC, ra-vm9-nic1, assumes that you haven't changed the `namePrefix` value for the management tier VMs, and that you have not modified the number or starting index of the VMs in each tier (by default, the jump box will be given the suffix 9). If you have changed these parameters, then you must also modify the value of the NIC referenced by the management tier NSG rules accordingly, otherwise they may be applied to a NIC associated with a different VM.

<!-- source:  https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-n-tier/parameters/windows/networkSecurityGroups.parameters.json#L4-L162 -->

```json
  "parameters": {
    "virtualNetworkSettings": {
      "value": {
        "name": "ra-vnet",
        "resourceGroup": "ra-ntier-vm-rg"
      }
    },
    "networkSecurityGroupsSettings": {
      "value": [
        {
          "name": "app1-biz-nsg",
          "subnets": [
            "app1-biz-sn"
          ],
          "networkInterfaces": [
          ],
          "securityRules": [
            {
              "name": "allow-web-traffic",
              "description": "Allow traffic originating from web layer.",
              "protocol": "*",
              "sourcePortRange": "*",
              "destinationPortRange": "80",
              "sourceAddressPrefix": "10.0.0.0/24",
              "destinationAddressPrefix": "*",
              "access": "Allow",
              "priority": 100,
              "direction": "Inbound"
            },
            {
              "name": "deny-other-traffic",
              "description": "Deny all other traffic",
              "protocol": "*",
              "sourcePortRange": "*",
              "destinationPortRange": "*",
              "sourceAddressPrefix": "*",
              "destinationAddressPrefix": "*",
              "access": "Deny",
              "priority": 120,
              "direction": "Inbound"
            }
          ]
        },
        {
          "name": "app1-data-nsg",
          "subnets": [
            "app1-data-sn"
          ],
          "networkInterfaces": [
          ],
          "securityRules": [
            {
              "name": "allow-biz-traffic",
              "description": "Allow traffic originating from biz layer.",
              "protocol": "*",
              "sourcePortRange": "*",
              "destinationPortRange": "80",
              "sourceAddressPrefix": "10.0.1.0/24",
              "destinationAddressPrefix": "*",
              "access": "Allow",
              "priority": 100,
              "direction": "Inbound"
            },
            {
              "name": "deny-other-traffic",
              "description": "Deny all other traffic",
              "protocol": "*",
              "sourcePortRange": "*",
              "destinationPortRange": "*",
              "sourceAddressPrefix": "*",
              "destinationAddressPrefix": "*",
              "access": "Deny",
              "priority": 120,
              "direction": "Inbound"
            }
          ]
        },
        {
          "name": "app1-web-nsg",
          "subnets": [
            "app1-web-sn"
          ],
          "networkInterfaces": [
          ],
          "securityRules": [
            {
              "name": "allow-web-traffic-from-external",
              "description": "Allow web traffic originating externally.",
              "protocol": "*",
              "sourcePortRange": "*",
              "destinationPortRange": "80",
              "sourceAddressPrefix": "*",
              "destinationAddressPrefix": "*",
              "access": "Allow",
              "priority": 100,
              "direction": "Inbound"
            },
            {
              "name": "allow-web-traffic-from-vnet",
              "description": "Allow web traffic originating from vnet.",
              "protocol": "*",
              "sourcePortRange": "*",
              "destinationPortRange": "80",
              "sourceAddressPrefix": "10.0.0.0/16",
              "destinationAddressPrefix": "*",
              "access": "Allow",
              "priority": 110,
              "direction": "Inbound"
            },
            {
              "name": "deny-other-traffic",
              "description": "Deny all other traffic",
              "protocol": "*",
              "sourcePortRange": "*",
              "destinationPortRange": "*",
              "sourceAddressPrefix": "*",
              "destinationAddressPrefix": "*",
              "access": "Deny",
              "priority": 120,
              "direction": "Inbound"
            }
          ]
        },
        {
          "name": "app1-mgmt-nsg",
          "subnets": [ ],
          "networkInterfaces": [
            "ra-vm9-nic1"
          ],
          "securityRules": [
            {
              "name": "RDP",
              "description": "Allow RDP Subnet",
              "protocol": "tcp",
              "sourcePortRange": "*",
              "destinationPortRange": "3389",
              "sourceAddressPrefix": "*",
              "destinationAddressPrefix": "*",
              "access": "Allow",
              "priority": 100,
              "direction": "Inbound"
            },
            {
              "name": "deny-other-traffic",
              "description": "Deny all other traffic",
              "protocol": "*",
              "sourcePortRange": "*",
              "destinationPortRange": "*",
              "sourceAddressPrefix": "*",
              "destinationAddressPrefix": "*",
              "access": "Deny",
              "priority": 120,
              "direction": "Inbound"
            }
          ]
        }
      ]
    }
  }
```

  Note that the management tier security rule for the Linux implementation differs in that it opens port 22 to enable SSH connections rather than RDP:

<!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-n-tier/parameters/linux/networkSecurityGroups.parameters.json#L20-L45 -->

```json
"securityRules": [
  {
    "name": "allow-web-traffic",
    "description": "Allow traffic originating from web layer.",
    "protocol": "*",
    "sourcePortRange": "*",
    "destinationPortRange": "80",
    "sourceAddressPrefix": "10.0.0.0/24",
    "destinationAddressPrefix": "*",
    "access": "Allow",
    "priority": 100,
    "direction": "Inbound"
  },
  {
    "name": "deny-other-traffic",
    "description": "Deny all other traffic",
    "protocol": "*",
    "sourcePortRange": "*",
    "destinationPortRange": "*",
    "sourceAddressPrefix": "*",
    "destinationAddressPrefix": "*",
    "access": "Deny",
    "priority": 120,
    "direction": "Inbound"
  }
]
```

  You can open additional ports (or deny access through specific ports) by adding further items to the `securityRules` array for the appropriate subnet.

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

    - [webTierParameters.json][webtier-parameters-windows]

    - [businessTierParameters.json][businesstier-parameters-windows]

    - [dataTierParameters.json][datatier-parameters-windows]

4. If you are building a set of Linux VMs:

  1. In the Parameters folder, create another subfolder named Linux.

  2. Download the following files to Parameters/Linux folder:

    - [virtualNetwork.parameters.json][vnet-parameters-linux]

    - [networkSecurityGroup.parameters.json][nsg-parameters-linux]

    - [webTierParameters.json][webtier-parameters-linux]

    - [businessTierParameters.json][businesstier-parameters-linux]

    - [dataTierParameters.json][datatier-parameters-linux]

5. Edit the Deploy-ReferenceArchitecture.ps1 or deploy-reference-architecture.sh file in the Scripts folder, and change the following line to specify the resource group that should be created or used to hold the VM and resources created by the script:

    <!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-n-tier/Deploy-ReferenceArchitecture.ps1#L48 -->

    ```powershell
    # PowerShell
    $resourceGroupName = "ra-ntier-vm-rg"
    ```

    <!-- source: https://github.com/mspnp/reference-architectures/blob/master/guidance-compute-n-tier/deploy-reference-architecture.sh#L3 -->

    ```bash
    # bash
    RESOURCE_GROUP_NAME="ra-ntier-vm-rg"
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

- This article shows a basic N-tier architecture. For some additional considerations about reliability, see [Adding reliability to an N-tier architecture on Azure][n-tier].

<!-- links -->

[arm-templates]: https://azure.microsoft.com/documentation/articles/resource-group-authoring-templates/
[azure-administration]: ../automation/automation-intro.md
[azure-audit-logs]: ../resource-group-audit.md
[azure-availability-sets]: ../virtual-machines/virtual-machines-windows-manage-availability.md#configure-each-application-tier-into-separate-availability-sets
[azure-cli]: ../virtual-machines-command-line-tools.md
[azure-key-vault]: https://azure.microsoft.com/services/key-vault.md
[azure-load-balancer]: ../load-balancer/load-balancer-overview.md
[bastion host]: https://en.wikipedia.org/wiki/Bastion_host
[cidr]: https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing
[chef]: https://www.chef.io/solutions/azure/
[load-balancer-external]: ../load-balancer/load-balancer-internet-overview.md
[load-balancer-external-cli]: ../load-balancer/load-balancer-get-started-internet-arm-cli.md
[load-balancer-internal]: ../load-balancer/load-balancer-internal-overview.md
[load-balancer-internal-cli]: ../load-balancer/load-balancer-get-started-ilb-arm-cli.md
[multi-vm]: guidance-compute-multi-vm.md
[n-tier]: guidance-compute-n-tier-vm.md
[naming conventions]: guidance-naming-conventions.md
[nsg]: ../virtual-network/virtual-networks-nsg.md
[nsg-rules]: ../best-practices-resource-manager-security.md#network-security-groups
[operations-management-suite]: https://www.microsoft.com/en-us/server-cloud/operations-management-suite/overview.aspx
[private-ip-space]: https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
[public IP address]: ../virtual-network/virtual-network-ip-addresses-overview-arm.md
[puppet]: https://puppetlabs.com/blog/managing-azure-virtual-machines-puppet
[resource-manager-overview]: ../resource-group-overview.md
[sql-alwayson]: https://msdn.microsoft.com/en-us/library/hh510230.aspx
[sql-keyvault]: ../virtual-machines/virtual-machines-windows-ps-sql-keyvault.md
[vm-planned-maintenance]: ../virtual-machines/virtual-machines-windows-planned-maintenance.md
[vm-sla]: https://azure.microsoft.com/en-us/support/legal/sla/virtual-machines/v1_0/
[vnet faq]: ../virtual-network/virtual-networks-faq.md
[Nagios]: https://www.nagios.org/
[Zabbix]: http://www.zabbix.com/
[Icinga]: http://www.icinga.org/
[VM-sizes]: https://azure.microsoft.com/documentation/articles/virtual-machines-windows-sizes/
[solution-script]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/Deploy-ReferenceArchitecture.ps1
[solution-script-bash]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/deploy-reference-architecture.sh
[vnet-parameters-windows]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/windows/virtualNetwork.parameters.json
[vnet-parameters-linux]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/linux/virtualNetwork.parameters.json
[nsg-parameters-windows]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/windows/networkSecurityGroups.parameters.json
[nsg-parameters-linux]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/linux/networkSecurityGroups.parameters.json
[webtier-parameters-windows]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/windows/webTier.parameters.json
[webtier-parameters-linux]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/linux/webTier.parameters.json
[businesstier-parameters-windows]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/windows/businessTier.parameters.json
[businesstier-parameters-linux]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/linux/businessTier.parameters.json
[datatier-parameters-windows]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/windows/dataTier.parameters.json
[datatier-parameters-linux]: https://github.com/mspnp/reference-architectures/tree/master/guidance-compute-n-tier/parameters/linux/dataTier.parameters.json
[azure-powershell-download]: https://azure.microsoft.com/documentation/articles/powershell-install-configure/
[0]: ./media/blueprints/compute-n-tier.png "N-tier architecture using Microsoft Azure"