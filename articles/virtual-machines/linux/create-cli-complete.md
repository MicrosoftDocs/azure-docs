---
title: Create a Linux environment with the Azure CLI 2.0 | Microsoft Docs
description: Create storage, a Linux VM, a virtual network and subnet, a load balancer, an NIC, a public IP, and a network security group, all from the ground up by using the Azure CLI 2.0.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: iainfoulds
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 4ba4060b-ce95-4747-a735-1d7c68597a1a
ms.service: virtual-machines-linux
ms.devlang: azurecli
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 03/07/2017
ms.author: iainfou

---
# Create a complete Linux environment with the Azure CLI 2.0
In this article, we build a simple network with a load balancer and a pair of VMs that are useful for development and simple computing. We walk through the process command by command, until you have two working, secure Linux VMs to which you can connect from anywhere on the Internet. Then you can move on to more complex networks and environments. This article details how to build the environment with the Azure CLI 2.0. You can also perform these steps with the [Azure CLI 1.0](create-cli-complete-nodejs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

Along the way, you learn about the dependency hierarchy that the Resource Manager deployment model gives you, and about how much power it provides. After you see how the system is built, you can rebuild it much more quickly by using [Azure Resource Manager templates](../../resource-group-authoring-templates.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). Also, after you learn how the parts of your environment fit together, creating templates to automate them becomes easier.

The environment contains:

* Two VMs inside an availability set.
* A load balancer with a load-balancing rule on port 80.
* Network security group (NSG) rules to protect your VM from unwanted traffic.

![Basic environment overview](./media/create-cli-complete/environment_overview.png)

## Quick commands
If you need to quickly accomplish the task, the following section details the base commands to upload a VM to Azure. More detailed information and context for each step can be found in the rest of the document, starting [here](#detailed-walkthrough).

In the following examples, replace example parameter names with your own values. Example parameter names include `myResourceGroup`, `mystorageaccount`, and `myVM`.

To create this custom environment, you need the latest [Azure CLI 2.0](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/#login).

First, create the resource group with [az group create](/cli/azure/group#create). The following example creates a resource group named `myResourceGroup` in the `westeurope` location:

```azurecli
az group create --name myResourceGroup --location westeurope
```

This next step is optional. The default action when you create a VM with the Azure CLI 2.0 is to use Azure Managed Disks. For more information about Azure Managed Disks, see [Azure Managed Disks overview](../../storage/storage-managed-disks-overview.md). If you instead wish to use unmanaged disks, you need to create a storage account with [az storage account create](/cli/azure/storage/account#create). The following example creates a storage account named `mystorageaccount`. (The storage account name must be unique, so provide your own unique name.)

```azurecli
az storage account create --resource-group myResourceGroup --location westeurope \
  --name mystorageaccount --kind Storage --sku Standard_LRS
```

Create the virtual network with [az network vnet create](/cli/azure/network/vnet#create). The following example creates a virtual network named `myVnet` and subnet named `mySubnet`:

```azurecli
az network vnet create --resource-group myResourceGroup --location westeurope --name myVnet \
  --address-prefix 192.168.0.0/16 --subnet-name mySubnet --subnet-prefix 192.168.1.0/24
```

Create a public IP with [az network public-ip create](/cli/azure/network/public-ip#create). The following example creates a public IP named `myPublicIP` with the DNS name of `mypublicdns`. (The DNS name must be unique, so provide your own unique name.)

```azurecli
az network public-ip create --resource-group myResourceGroup --location westeurope \
  --name myPublicIP --dns-name mypublicdns --allocation-method static --idle-timeout 4
```

Create the load balancer with [az network lb create](/cli/azure/network/lb#create). The following example:

- creates a load balancer named `myLoadBalancer`
- associates the public IP `myPublicIP`
- creates a front-end IP pool named `mySubnetPool`
- creates a back-end IP pool named `myBackEndPool`

```azurecli
az network lb create --resource-group myResourceGroup --location westeurope \
  --name myLoadBalancer --public-ip-address myPublicIP \
  --frontend-ip-name myFrontEndPool --backend-pool-name myBackEndPool
```

Create SSH inbound network address translation (NAT) rules for the load balancer with [az network lb inbound-nat-rule create](/cli/azure/network/lb/inbound-nat-rule#create). The following example creates two load balancer rules, `myLoadBalancerRuleSSH1` and `myLoadBalancerRuleSSH2`:

```azurecli
az network lb inbound-nat-rule create --resource-group myResourceGroup \
  --lb-name myLoadBalancer --name myLoadBalancerRuleSSH1 --protocol tcp \
  --frontend-port 4222 --backend-port 22 --frontend-ip-name myFrontEndPool
az network lb inbound-nat-rule create --resource-group myResourceGroup \
  --lb-name myLoadBalancer --name myLoadBalancerRuleSSH2 --protocol tcp \
  --frontend-port 4223 --backend-port 22 --frontend-ip-name myFrontEndPool
```

Create the load balancer health probe with [az network lb probe create](/cli/azure/network/lb/probe#create). The following example creates a TCP probe named `myHealthProbe`:

```azurecli
az network lb probe create --resource-group myResourceGroup --lb-name myLoadBalancer \
  --name myHealthProbe --protocol tcp --port 80 --interval 15 --threshold 4
```

Create the web inbound NAT rules for the load balancer with [az network lb rule create](/cli/azure/network/lb/rule#create). The following example creates a load balancer rule named `myLoadBalancerRuleWeb` and associates it with the `myHealthProbe` probe:

```azurecli
az network lb rule create --resource-group myResourceGroup --lb-name myLoadBalancer \
  --name myLoadBalancerRuleWeb --protocol tcp --frontend-port 80 --backend-port 80 \
  --frontend-ip-name myFrontEndPool --backend-pool-name myBackEndPool \
  --probe-name myHealthProbe
```

Verify the load balancer, IP pools, and NAT rules with [az network lb show](/cli/azure/network/lb#show):

```azurecli
az network lb show --resource-group myResourceGroup --name myLoadBalancer
```

Create the network security group with [az network nsg create](/cli/azure/network/nsg#create). The following example creates a network security group named `myNetworkSecurityGroup`:

```azurecli
az network nsg create --resource-group myResourceGroup --location westeurope \
  --name myNetworkSecurityGroup
```

Add two inbound rules for the network security group with [az network nsg rule create](/cli/azure/network/nsg/rule#create). The following example creates two rules, `myNetworkSecurityGroupRuleSSH` and `myNetworkSecurityGroupRuleHTTP`:

```azurecli
az network nsg rule create --resource-group myResourceGroup \
  --nsg-name myNetworkSecurityGroup --name myNetworkSecurityGroupRuleSSH \
  --protocol tcp --direction inbound --priority 1000 --source-address-prefix '*' \
  --source-port-range '*' --destination-address-prefix '*' --destination-port-range 22 \
  --access allow
az network nsg rule create --resource-group myResourceGroup \
  --nsg-name myNetworkSecurityGroup --name myNetworkSecurityGroupRuleHTTP \
  --protocol tcp --direction inbound --priority 1001 --source-address-prefix '*' \
  --source-port-range '*' --destination-address-prefix '*' --destination-port-range 80 \
  --access allow
```

Create the first network interface card (NIC) with [az network nic create](/cli/azure/network/nic#create). The following example creates a NIC named `myNic1` and attaches it to the load balancer `myLoadBalancer` and appropriate pools, and also attaches it to the `myNetworkSecurityGroup`:

```azurecli
az network nic create --resource-group myResourceGroup --location westeurope --name myNic1 \
  --vnet-name myVnet --subnet mySubnet --network-security-group myNetworkSecurityGroup \
  --lb-name myLoadBalancer --lb-address-pools myBackEndPool \
  --lb-inbound-nat-rules myLoadBalancerRuleSSH1
```

Create the second NIC, again with **az network nic create**. The following example creates a NIC named `myNic2`:

```azurecli
az network nic create --resource-group myResourceGroup --location westeurope --name myNic2 \
  --vnet-name myVnet --subnet mySubnet --network-security-group myNetworkSecurityGroup \
  --lb-name myLoadBalancer --lb-address-pools myBackEndPool \
  --lb-inbound-nat-rules myLoadBalancerRuleSSH2
```

Create the availability set with [az vm availability-set create](/cli/azure/vm/availability-set#create). The following example creates an availability set named `myAvailabilitySet`:

```azurecli
az vm availability-set create --resource-group myResourceGroup --location westeurope \
  --name myAvailabilitySet \
  --platform-fault-domain-count 3 --platform-update-domain-count 2
```

Create the first Linux VM with [az vm create](/cli/azure/vm#create). The following example creates a VM named `myVM1` using Azure Managed Disks. If you wish to use unmanaged disks, see the additional note below.

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM1 \
    --location westeurope \
    --availability-set myAvailabilitySet \
    --nics myNic1 \
    --image UbuntuLTS \
    --ssh-key-value ~/.ssh/id_rsa.pub \
    --admin-username azureuser
```

If you use Azure Managed Disks, skip this step. If you wish to use unmanaged disks and you created a storage account in the previous steps, you need to add some additional parameters to the proceeding command. Add the following additional parameters to the proceeding command to create the unmanaged disks in the storage account named `mystorageaccount`: 

```azurecli
  --use-unmanaged-disk \
  --storage-account mystorageaccount
```

Create the second Linux VM, again with **az vm create**. The following example creates a VM named `myVM2`:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM2 \
    --location westeurope \
    --availability-set myAvailabilitySet \
    --nics myNic2 \
    --image UbuntuLTS \
    --ssh-key-value ~/.ssh/id_rsa.pub \
    --admin-username azureuser
```

Again, if you do not use the default Azure Managed Disks, add the following additional parameters to the proceeding command to create the unmanaged disks in the storage account named `mystorageaccount`:

```azurecli
  --use-unmanaged-disk \
  --storage-account mystorageaccount
``` 

Verify that everything that was built correctly with [az vm show](/cli/azure/vm#show):

```azurecli
az vm show --resource-group myResourceGroup --name myVM1
az vm show --resource-group myResourceGroup --name myVM2
```

Export your new environment to a template with [az group export](/cli/azure/group#export) to quickly re-create new instances:

```azurecli
az group export --name myResourceGroup > myResourceGroup.json
```

## Detailed walkthrough
The detailed steps that follow explain what each command is doing as you build out your environment. These concepts are helpful when you build your own custom environments for development or production.

Make sure that you have installed the latest [Azure CLI 2.0](/cli/azure/install-az-cli2) and logged to an Azure account in with [az login](/cli/azure/#login).

In the following examples, replace example parameter names with your own values. Example parameter names include `myResourceGroup`, `mystorageaccount`, and `myVM`.

## Create resource groups and choose deployment locations
Azure resource groups are logical deployment entities that contain configuration information and metadata to enable the logical management of resource deployments. Create the resource group with [az group create](/cli/azure/group#create). The following example creates a resource group named `myResourceGroup` in the `westeurope` location:

```azurecli
az group create --name myResourceGroup --location westeurope
```

By default, the output is in JSON (JavaScript Object Notation). To output as a list or table, for example, use [az configure --output](/cli/azure/#configure). You can also add `--output` to any command for a one time change in output format. The following example shows the JSON output from the **az group create** command:

```json                       
{
  "id": "/subscriptions/guid/resourceGroups/myResourceGroup",
  "location": "westeurope",
  "name": "myResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

## Create a storage account
This next step is optional. The default action when you create a VM with the Azure CLI 2.0 is to use Azure Managed Disks. These disks are handled by the Azure platform and do not require any preparation or location to store them. For more information about Azure Managed Disks, see [Azure Managed Disks overview](../../storage/storage-managed-disks-overview.md). Skip to [Create a virtual network and subnet](#create-a-virtual-network-and-subnet) if you wish to use Azure Managed Disks. 

If you wish to use unmanaged disks, you need to create a storage account for your VM disks and for any additional data disks that you want to add.

Here we use [az storage account create](/cli/azure/storage/account#create), and pass the location of the account, the resource group that controls it, and the type of storage support you want. The following example creates a storage account named `mystorageaccount`:

```azurecli
az storage account create --resource-group myResourceGroup --location westeurope \
  --name mystorageaccount --kind Storage --sku Standard_LRS
```

Output:

```json
{
  "accessTier": null,
  "creationTime": "2016-12-07T17:59:50.090092+00:00",
  "customDomain": null,
  "encryption": null,
  "id": "/subscriptions/guid/resourceGroups/myresourcegroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount",
  "kind": "Storage",
  "lastGeoFailoverTime": null,
  "location": "westeurope",
  "name": "mystorageaccount",
  "primaryEndpoints": {
    "blob": "https://mystorageaccount.blob.core.windows.net/",
    "file": "https://mystorageaccount.file.core.windows.net/",
    "queue": "https://mystorageaccount.queue.core.windows.net/",
    "table": "https://mystorageaccount.table.core.windows.net/"
  },
  "primaryLocation": "westeurope",
  "provisioningState": "Succeeded",
  "resourceGroup": "myresourcegroup",
  "secondaryEndpoints": null,
  "secondaryLocation": null,
  "sku": {
    "name": "Standard_LRS",
    "tier": "Standard"
  },
  "statusOfPrimary": "Available",
  "statusOfSecondary": null,
  "tags": {},
  "type": "Microsoft.Storage/storageAccounts"
}
```

To investigate the storage account by using the CLI, you first need to set the account names and keys. Use [az storage account show-connection-string](/cli/azure/storage/account#show-connection-string). Replace the name of the storage account in the following example with a name that you choose:

```bash
export AZURE_STORAGE_CONNECTION_STRING="$(az storage account show-connection-string --resource-group myResourceGroup --name mystorageaccount --query connectionString)"
```

Then you can view your storage information with [az storage container list](/cli/azure/storage/container#list):

```azurecli
az storage container list
```

Output:

```azurecli
[
  {
    "metadata": null,
    "name": "vhds",
    "properties": {
      "etag": "\"0x8D41F912D472F94\"",
      "lastModified": "2016-12-08T17:39:35+00:00",
      "lease": {
        "duration": null,
        "state": null,
        "status": null
      },
      "leaseDuration": "infinite",
      "leaseState": "leased",
      "leaseStatus": "locked"
    }
  }
]
```

## Create a virtual network and subnet
Next you're going to need to create a virtual network running in Azure and a subnet in which you can create your VMs. The following example uses [az network vnet create](/cli/azure/network/vnet#create) to create a virtual network named `myVnet` with the `192.168.0.0/16` address prefix, and a subnet named `mySubnet` with the subnet address prefix of `192.168.1.0/24`:

```azurecli
az network vnet create --resource-group myResourceGroup --location westeurope \
  --name myVnet --address-prefix 192.168.0.0/16 \
  --subnet-name mySubnet --subnet-prefix 192.168.1.0/24
```

Output shows the subnet as logically created inside the virtual network:

```json
{
  "addressSpace": {
    "addressPrefixes": [
      "192.168.0.0/16"
    ]
  },
  "dhcpOptions": {
    "dnsServers": []
  },
  "etag": "W/\"e95496fc-f417-426e-a4d8-c9e4d27fc2ee\"",
  "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet",
  "location": "westeurope",
  "name": "myVnet",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "resourceGuid": "ed62fd03-e9de-430b-84df-8a3b87cacdbb",
  "subnets": [
    {
      "addressPrefix": "192.168.1.0/24",
      "etag": "W/\"e95496fc-f417-426e-a4d8-c9e4d27fc2ee\"",
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet",
      "ipConfigurations": null,
      "name": "mySubnet",
      "networkSecurityGroup": null,
      "provisioningState": "Succeeded",
      "resourceGroup": "myResourceGroup",
      "resourceNavigationLinks": null,
      "routeTable": null
    }
  ],
  "tags": {},
  "type": "Microsoft.Network/virtualNetworks",
  "virtualNetworkPeerings": null
}
```


## Create a public IP address
Now let's create the public IP address (PIP) that we assign to your load balancer. It enables you to connect to your VMs from the Internet by using the [az network public-ip create](/cli/azure/network/public-ip#create) command. Because the default address is dynamic, we create a named DNS entry in the **cloudapp.azure.com** domain by using the `--domain-name-label` option. The following example creates a public IP named `myPublicIP` with the DNS name of `mypublicdns`. Because the DNS name must be unique, you provide your own unique DNS name:

```azurecli
az network public-ip create --resource-group myResourceGroup --location westeurope \
  --name myPublicIP --dns-name mypublicdns --allocation-method static --idle-timeout 4
```

Output:

```json
{
  "publicIp": {
    "dnsSettings": {
      "domainNameLabel": "mypublicdns",
      "fqdn": "mypublicdns.westeurope.cloudapp.azure.com",
      "reverseFqdn": ""
    },
    "idleTimeoutInMinutes": 4,
    "ipAddress": "52.174.48.109",
    "provisioningState": "Succeeded",
    "publicIPAllocationMethod": "Static",
    "resourceGuid": "78218510-ea54-42d7-b2c2-44773fc14af5"
  }
}
```

The public IP address resource has been allocated logically, but a specific address has not yet been assigned. To obtain an IP address, you're going to need a load balancer, which we have not yet created.

## Create a load balancer and IP pools
When you create a load balancer, it enables you to distribute traffic across multiple VMs. It also provides redundancy to your application by running multiple VMs that respond to user requests in the event of maintenance or heavy loads. The following example uses [az network lb create](/cli/azure/network/lb#create) to create a load balancer named `myLoadBalancer`, a front-end IP pool named `myFrontEndPool`, and hooks up the `myPublicIP` resource:

```azurecli
az network lb create --resource-group myResourceGroup --location westeurope \
  --name myLoadBalancer --public-ip-address myPublicIP --frontend-ip-name myFrontEndPool
```

Output:

```json
{
  "loadBalancer": {
    "backendAddressPools": [
      {
        "etag": "W/\"7a05df7a-5ee2-4581-b411-4b6f048ab291\"",
        "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/backendAddressPools/myLoadBalancerbepool",
        "name": "myLoadBalancerbepool",
        "properties": {
          "provisioningState": "Succeeded"
        },
        "resourceGroup": "myResourceGroup"
      }
    ],
    "frontendIPConfigurations": [
      {
        "etag": "W/\"7a05df7a-5ee2-4581-b411-4b6f048ab291\"",
        "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/frontendIPConfigurations/myFrontEndPool",
        "name": "myFrontEndPool",
        "properties": {
          "privateIPAllocationMethod": "Dynamic",
          "provisioningState": "Succeeded",
          "publicIPAddress": {
            "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/publicIPAddresses/myPublicIP",
            "resourceGroup": "myResourceGroup"
          }
        },
        "resourceGroup": "myResourceGroup"
      }
    ],
    "inboundNatPools": [],
    "inboundNatRules": [],
    "loadBalancingRules": [],
    "outboundNatRules": [],
    "probes": [],
    "provisioningState": "Succeeded",
    "resourceGuid": "f4879d84-5ae8-4e06-8b9b-1419baa875d9"
  }
}
```

Note how we used the `--public-ip-address` switch to pass in the `myPublicIP` that we created earlier. Assigning the public IP address to the load balancer allows you to reach your VMs across the Internet.

We use a back-end pool as a location for our VMs to connect to. That way, the traffic can flow through the load balancer to the VMs. Let's create the IP pool for our back-end traffic with [az network lb address-pool create](/cli/azure/network/lb/address-pool#create). The following example creates a back-end pool named `myBackEndPool`:

```azurecli
az network lb address-pool create --resource-group myResourceGroup \
  --lb-name myLoadBalancer --name myBackEndPool
```

Snipped output:

```json
  "backendAddressPools": [
    {
      "backendIpConfigurations": null,
      "etag": "W/\"a61814bc-ce4c-4fb2-9d6a-5b1949078345\"",
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/backendAddressPools/myLoadBalancerbepool",
      "loadBalancingRules": null,
      "name": "myLoadBalancerbepool",
      "outboundNatRule": null,
      "provisioningState": "Succeeded",
      "resourceGroup": "myResourceGroup"
    },
    {
      "backendIpConfigurations": null,
      "etag": "W/\"a61814bc-ce4c-4fb2-9d6a-5b1949078345\"",
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/backendAddressPools/myBackEndPool",
      "loadBalancingRules": null,
      "name": "myBackEndPool",
      "outboundNatRule": null,
      "provisioningState": "Succeeded",
      "resourceGroup": "myResourceGroup"
    }
  ],
  "etag": "W/\"a61814bc-ce4c-4fb2-9d6a-5b1949078345\"",
```


## Create load balancer NAT rules
To get traffic flowing through our load balancer, we need to create network address translation (NAT) rules that specify either inbound or outbound actions. You can specify the protocol to use, then map external ports to internal ports as desired. For our environment, let's create some rules that allow SSH through our load balancer to our VMs with [az network lb inbound-nat-rule create](/cli/azure/network/lb/inbound-nat-rule#create). We set up TCP ports 4222 and 4223 to direct to TCP port 22 on our VMs (which we create later). The following example creates a rule named `myLoadBalancerRuleSSH1` to map TCP port 4222 to port 22:

```azurecli
az network lb inbound-nat-rule create --resource-group myResourceGroup \
  --lb-name myLoadBalancer --name myLoadBalancerRuleSSH1 --protocol tcp \
  --frontend-port 4222 --backend-port 22 --frontend-ip-name myFrontEndPool
```

Output:

```json
{
  "backendIpConfiguration": null,
  "backendPort": 22,
  "enableFloatingIp": false,
  "etag": "W/\"72843cf8-b5fb-4655-9ac8-9cbbbbf1205a\"",
  "frontendIpConfiguration": {
    "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/frontendIPConfigurations/myFrontEndPool",
    "resourceGroup": "myResourceGroup"
  },
  "frontendPort": 4222,
  "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/inboundNatRules/myLoadBalancerRuleSSH1",
  "idleTimeoutInMinutes": 4,
  "name": "myLoadBalancerRuleSSH1",
  "protocol": "Tcp",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup"
}
```

Repeat the procedure for your second NAT rule for SSH. The following example creates a rule named `myLoadBalancerRuleSSH2` to map TCP port 4223 to port 22:

```azurecli
az network lb inbound-nat-rule create --resource-group myResourceGroup \
  --lb-name myLoadBalancer --name myLoadBalancerRuleSSH2 --protocol tcp \
  --frontend-port 4223 --backend-port 22 --frontend-ip-name myFrontEndPool
```

## Create a load balancer health probe
A health probe periodically checks on the VMs that are behind our load balancer to make sure they're operating and responding to requests as defined. If not, they're removed from operation to ensure that users aren't being directed to them. You can define custom checks for the health probe, along with intervals and timeout values. For more information about health probes, see [Load Balancer probes](../../load-balancer/load-balancer-custom-probe-overview.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). The following example uses [az network lb probe create](/cli/azure/network/lb/probe#create) to create a TCP health probed named `myHealthProbe`:

```azurecli
az network lb probe create --resource-group myResourceGroup --lb-name myLoadBalancer \
  --name myHealthProbe --protocol tcp --port 80 --interval 15 --threshold 4
```

Output:

```json
{
  "etag": "W/\"757018f6-b70a-4651-b717-48b511d82ba0\"",
  "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/probes/myHealthProbe",
  "intervalInSeconds": 15,
  "loadBalancingRules": null,
  "name": "myHealthProbe",
  "numberOfProbes": 4,
  "port": 80,
  "protocol": "Tcp",
  "provisioningState": "Succeeded",
  "requestPath": null,
  "resourceGroup": "myResourceGroup"
}
```

Here, we specified an interval of 15 seconds for our health checks. We can miss a maximum of four probes (one minute) before the load balancer considers that the host is no longer functioning.

Let's also go ahead and create a NAT rule for TCP port 80 for web traffic, hooking the rule up to our IP pools. If we hook up the rule to an IP pool, instead of hooking up the rule to our VMs individually, we can add or remove VMs from the IP pool. The load balancer automatically adjusts the flow of traffic. The following example uses [az network lb rule create](/cli/azure/network/lb/rule#create) to create a rule named `myLoadBalancerRuleWeb` to map TCP port 80 to port 80, and hooks up the health probe named `myHealthProbe`:

```azurecli
az network lb rule create --resource-group myResourceGroup --lb-name myLoadBalancer \
  --name myLoadBalancerRuleWeb --protocol tcp --frontend-port 80 --backend-port 80 \
  --frontend-ip-name myFrontEndPool --backend-pool-name myBackEndPool \
  --probe-name myHealthProbe
```

Output:

```json
{
  "backendAddressPool": {
    "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/backendAddressPools/myBackEndPool",
    "resourceGroup": "myResourceGroup"
  },
  "backendPort": 80,
  "enableFloatingIp": false,
  "etag": "W/\"f0d77680-bf42-4d11-bfab-5d2c541bee56\"",
  "frontendIpConfiguration": {
    "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/frontendIPConfigurations/myFrontEndPool",
    "resourceGroup": "myResourceGroup"
  },
  "frontendPort": 80,
  "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/loadBalancingRules/myLoadBalancerRuleWeb",
  "idleTimeoutInMinutes": 4,
  "loadDistribution": "Default",
  "name": "myLoadBalancerRuleWeb",
  "probe": {
    "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/probes/myHealthProbe",
    "resourceGroup": "myResourceGroup"
  },
  "protocol": "Tcp",
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup"
}
```

## Verify the load balancer
Now the load balancer configuration is done. Here are the steps you took:

1. You created a load balancer.
2. You created a front-end IP pool and assigned a public IP to it.
3. You created a back-end IP pool that VMs can connect to.
4. You created NAT rules that allow SSH to the VMs for management, along with a rule that allows TCP port 80 for our web app.
5. You added a health probe to periodically check the VMs. This health probe ensures that users don't try to access a VM that is no longer functioning or serving content.

Let's review what your load balancer looks like now with [az network lb show](/cli/azure/network/lb#show) :

```azurecli
az network lb show --resource-group myResourceGroup --name myLoadBalancer
```

Output:

```json
{
  "backendAddressPools": [
    {
      "backendIpConfigurations": null,
      "etag": "W/\"a0e313a1-6de1-48be-aeb6-df57188d708c\"",
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/backendAddressPools/myLoadBalancerbepool",
      "loadBalancingRules": null,
      "name": "myLoadBalancerbepool",
      "outboundNatRule": null,
      "provisioningState": "Succeeded",
      "resourceGroup": "myResourceGroup"
    },
    {
      "backendIpConfigurations": null,
      "etag": "W/\"a0e313a1-6de1-48be-aeb6-df57188d708c\"",
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/backendAddressPools/myBackEndPool",
      "loadBalancingRules": null,
      "name": "myBackEndPool",
      "outboundNatRule": null,
      "provisioningState": "Succeeded",
      "resourceGroup": "myResourceGroup"
    }
  ],
  "etag": "W/\"a0e313a1-6de1-48be-aeb6-df57188d708c\"",
  "frontendIpConfigurations": [
    {
      "etag": "W/\"a0e313a1-6de1-48be-aeb6-df57188d708c\"",
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/frontendIPConfigurations/LoadBalancerFrontEnd",
      "inboundNatPools": null,
      "inboundNatRules": null,
      "loadBalancingRules": null,
      "name": "LoadBalancerFrontEnd",
      "outboundNatRules": null,
      "privateIpAddress": null,
      "privateIpAllocationMethod": "Dynamic",
      "provisioningState": "Succeeded",
      "publicIpAddress": {
        "dnsSettings": null,
        "etag": null,
        "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/publicIPAddresses/PublicIPmyLoadBalancer",
        "idleTimeoutInMinutes": null,
        "ipAddress": null,
        "ipConfiguration": null,
        "location": null,
        "name": null,
        "provisioningState": null,
        "publicIpAddressVersion": null,
        "publicIpAllocationMethod": null,
        "resourceGroup": "myResourceGroup",
        "resourceGuid": null,
        "tags": null,
        "type": null
      },
      "resourceGroup": "myResourceGroup",
      "subnet": null
    },
    {
      "etag": "W/\"a0e313a1-6de1-48be-aeb6-df57188d708c\"",
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/frontendIPConfigurations/myFrontEndPool",
      "inboundNatPools": null,
      "inboundNatRules": null,
      "loadBalancingRules": null,
      "name": "myFrontEndPool",
      "outboundNatRules": null,
      "privateIpAddress": null,
      "privateIpAllocationMethod": "Dynamic",
      "provisioningState": "Succeeded",
      "publicIpAddress": {
        "dnsSettings": null,
        "etag": null,
        "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/publicIPAddresses/myPublicIP",
        "idleTimeoutInMinutes": null,
        "ipAddress": null,
        "ipConfiguration": null,
        "location": null,
        "name": null,
        "provisioningState": null,
        "publicIpAddressVersion": null,
        "publicIpAllocationMethod": null,
        "resourceGroup": "myResourceGroup",
        "resourceGuid": null,
        "tags": null,
        "type": null
      },
      "resourceGroup": "myResourceGroup",
      "subnet": null
    }
  ],
  "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer",
  "inboundNatPools": [],
  "inboundNatRules": [],
  "loadBalancingRules": [],
  "location": "westeurope",
  "name": "myLoadBalancer",
  "outboundNatRules": [],
  "probes": [],
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "resourceGuid": "b5815801-b53d-4c22-aafc-2a9064f90f3c",
  "tags": {},
  "type": "Microsoft.Network/loadBalancers"
}
```

## Create a network security group and rules
Now we create a network security group and the inbound rules that govern access to the NIC. A network security group can be applied to a NIC or subnet. You define rules to control the flow of traffic in and out of your VMs. The following example uses [az network nsg create](/cli/azure/network/nsg#create) to create a network security group named `myNetworkSecurityGroup`:

```azurecli
az network nsg create --resource-group myResourceGroup --location westeurope \
  --name myNetworkSecurityGroup
```

Let's add the inbound rule for the NSG with [az network nsg rule create](/cli/azure/network/nsg/rule#create) to allow inbound connections on port 22 (to support SSH). The following example creates a rule named `myNetworkSecurityGroupRuleSSH` to allow TCP on port 22:

```azurecli
az network nsg rule create --resource-group myResourceGroup \
  --nsg-name myNetworkSecurityGroup --name myNetworkSecurityGroupRuleSSH \
  --protocol tcp --direction inbound --priority 1000 \
  --source-address-prefix '*' --source-port-range '*' \
  --destination-address-prefix '*' --destination-port-range 22 --access allow
```

Now let's add the inbound rule for the NSG to allow inbound connections on port 80 (to support web traffic). The following example creates a rule named `myNetworkSecurityGroupRuleHTTP` to allow TCP on port 80:

```azurecli
az network nsg rule create --resource-group myResourceGroup \
  --nsg-name myNetworkSecurityGroup --name myNetworkSecurityGroupRuleHTTP \
  --protocol tcp --direction inbound --priority 1001 \
  --source-address-prefix '*' --source-port-range '*' \
  --destination-address-prefix '*' --destination-port-range 80 --access allow
```

> [!NOTE]
> The inbound rule is a filter for inbound network connections. In this example, we bind the NSG to the VMs virtual NIC, which means that any request to port 22 is passed through to the NIC on our VM. This inbound rule is about a network connection, and not about an endpoint, which is what it would be about in classic deployments. To open a port, you must leave the `--source-port-range` set to '\*' (the default value) to accept inbound requests from **any** requesting port. Ports are typically dynamic.

Examine the network security group and rules with [az network nsg show](/cli/azure/network/nsg#show):

```azurecli
az network nsg show --resource-group myResourceGroup --name myNetworkSecurityGroup
```

Output:

```json
{
  "defaultSecurityRules": [
    {
      "access": "Allow",
      "description": "Allow inbound traffic from all VMs in VNET",
      "destinationAddressPrefix": "VirtualNetwork",
      "destinationPortRange": "*",
      "direction": "Inbound",
      "etag": "W/\"2b656589-f332-4ba4-92f3-afb3be5c192c\"",
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNetworkSecurityGroup/defaultSecurityRules/AllowVnetInBound",
      "name": "AllowVnetInBound",
      "priority": 65000,
      "protocol": "*",
      "provisioningState": "Succeeded",
      "resourceGroup": "myResourceGroup",
      "sourceAddressPrefix": "VirtualNetwork",
      "sourcePortRange": "*"
    },
    {
      "access": "Allow",
      "description": "Allow inbound traffic from azure load balancer",
      "destinationAddressPrefix": "*",
      "destinationPortRange": "*",
      "direction": "Inbound",
      "etag": "W/\"2b656589-f332-4ba4-92f3-afb3be5c192c\"",
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNetworkSecurityGroup/defaultSecurityRules/AllowAzureLoadBalancerInBound",
      "name": "AllowAzureLoadBalancerInBound",
      "priority": 65001,
      "protocol": "*",
      "provisioningState": "Succeeded",
      "resourceGroup": "myResourceGroup",
      "sourceAddressPrefix": "AzureLoadBalancer",
      "sourcePortRange": "*"
    },
    {
      "access": "Deny",
      "description": "Deny all inbound traffic",
      "destinationAddressPrefix": "*",
      "destinationPortRange": "*",
      "direction": "Inbound",
      "etag": "W/\"2b656589-f332-4ba4-92f3-afb3be5c192c\"",
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNetworkSecurityGroup/defaultSecurityRules/DenyAllInBound",
      "name": "DenyAllInBound",
      "priority": 65500,
      "protocol": "*",
      "provisioningState": "Succeeded",
      "resourceGroup": "myResourceGroup",
      "sourceAddressPrefix": "*",
      "sourcePortRange": "*"
    },
    {
      "access": "Allow",
      "description": "Allow outbound traffic from all VMs to all VMs in VNET",
      "destinationAddressPrefix": "VirtualNetwork",
      "destinationPortRange": "*",
      "direction": "Outbound",
      "etag": "W/\"2b656589-f332-4ba4-92f3-afb3be5c192c\"",
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNetworkSecurityGroup/defaultSecurityRules/AllowVnetOutBound",
      "name": "AllowVnetOutBound",
      "priority": 65000,
      "protocol": "*",
      "provisioningState": "Succeeded",
      "resourceGroup": "myResourceGroup",
      "sourceAddressPrefix": "VirtualNetwork",
      "sourcePortRange": "*"
    },
    {
      "access": "Allow",
      "description": "Allow outbound traffic from all VMs to Internet",
      "destinationAddressPrefix": "Internet",
      "destinationPortRange": "*",
      "direction": "Outbound",
      "etag": "W/\"2b656589-f332-4ba4-92f3-afb3be5c192c\"",
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNetworkSecurityGroup/defaultSecurityRules/AllowInternetOutBound",
      "name": "AllowInternetOutBound",
      "priority": 65001,
      "protocol": "*",
      "provisioningState": "Succeeded",
      "resourceGroup": "myResourceGroup",
      "sourceAddressPrefix": "*",
      "sourcePortRange": "*"
    },
    {
      "access": "Deny",
      "description": "Deny all outbound traffic",
      "destinationAddressPrefix": "*",
      "destinationPortRange": "*",
      "direction": "Outbound",
      "etag": "W/\"2b656589-f332-4ba4-92f3-afb3be5c192c\"",
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNetworkSecurityGroup/defaultSecurityRules/DenyAllOutBound",
      "name": "DenyAllOutBound",
      "priority": 65500,
      "protocol": "*",
      "provisioningState": "Succeeded",
      "resourceGroup": "myResourceGroup",
      "sourceAddressPrefix": "*",
      "sourcePortRange": "*"
    }
  ],
  "etag": "W/\"2b656589-f332-4ba4-92f3-afb3be5c192c\"",
  "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNetworkSecurityGroup",
  "location": "westeurope",
  "name": "myNetworkSecurityGroup",
  "networkInterfaces": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "myResourceGroup",
  "resourceGuid": "79c2c293-ee3e-4616-bf9c-4741ff1f708a",
  "securityRules": [
    {
      "access": "Allow",
      "description": null,
      "destinationAddressPrefix": "*",
      "destinationPortRange": "22",
      "direction": "Inbound",
      "etag": "W/\"2b656589-f332-4ba4-92f3-afb3be5c192c\"",
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNetworkSecurityGroup/securityRules/myNetworkSecurityGroupRuleSSH",
      "name": "myNetworkSecurityGroupRuleSSH",
      "priority": 1000,
      "protocol": "tcp",
      "provisioningState": "Succeeded",
      "resourceGroup": "myResourceGroup",
      "sourceAddressPrefix": "*",
      "sourcePortRange": "*"
    },
    {
      "access": "Allow",
      "description": null,
      "destinationAddressPrefix": "*",
      "destinationPortRange": "80",
      "direction": "Inbound",
      "etag": "W/\"2b656589-f332-4ba4-92f3-afb3be5c192c\"",
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNetworkSecurityGroup/securityRules/myNetworkSecurityGroupRuleHTTP",
      "name": "myNetworkSecurityGroupRuleHTTP",
      "priority": 1001,
      "protocol": "tcp",
      "provisioningState": "Succeeded",
      "resourceGroup": "myResourceGroup",
      "sourceAddressPrefix": "*",
      "sourcePortRange": "*"
    }
  ],
  "subnets": null,
  "tags": {},
  "type": "Microsoft.Network/networkSecurityGroups"
}
```

## Create an NIC to use with the Linux VM
NICs are programmatically available because you can apply rules to their use. You can also have more than one. In the following [az network nic create](https://docs.microsoft.com/en-us/cli/azure/network/nic#create) command, you hook up the NIC to the load back-end IP pool and associate it with the NAT rule to permit SSH traffic and network security group.

The following example creates a NIC named `myNic1`:

```azurecli
az network nic create --resource-group myResourceGroup --location westeurope --name myNic1 \
  --vnet-name myVnet --subnet mySubnet --network-security-group myNetworkSecurityGroup \
  --lb-name myLoadBalancer --lb-address-pools myBackEndPool \
  --lb-inbound-nat-rules myLoadBalancerRuleSSH1
```

Output:

```json
{
  "newNIC": {
    "dnsSettings": {
      "appliedDnsServers": [],
      "dnsServers": []
    },
    "enableIPForwarding": false,
    "ipConfigurations": [
      {
        "etag": "W/\"a76b5c0d-14e1-4a99-afd4-5cd8ac0465ca\"",
        "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkInterfaces/myNic1/ipConfigurations/ipconfig1",
        "name": "ipconfig1",
        "properties": {
          "loadBalancerBackendAddressPools": [
            {
              "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/backendAddressPools/myBackEndPool",
              "resourceGroup": "myResourceGroup"
            }
          ],
          "loadBalancerInboundNatRules": [
            {
              "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/loadBalancers/myLoadBalancer/inboundNatRules/myLoadBalancerRuleSSH1",
              "resourceGroup": "myResourceGroup"
            }
          ],
          "primary": true,
          "privateIPAddress": "192.168.1.4",
          "privateIPAllocationMethod": "Dynamic",
          "provisioningState": "Succeeded",
          "subnet": {
            "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet",
            "resourceGroup": "myResourceGroup"
          }
        },
        "resourceGroup": "myResourceGroup"
      }
    ],
    "networkSecurityGroup": {
      "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Network/networkSecurityGroups/myNetworkSecurityGroup",
      "resourceGroup": "myResourceGroup"
    },
    "provisioningState": "Succeeded",
    "resourceGuid": "838977cb-cf4b-4c4a-9a32-0ddec7dc818b"
  }
}
```

Now we create the second NIC, hooking in to our back-end IP pool again. This time the second NAT rule permits SSH traffic. The following example creates a NIC named `myNic2`:

```azurecli
az network nic create --resource-group myResourceGroup --location westeurope --name myNic2 \
  --vnet-name myVnet --subnet mySubnet --network-security-group myNetworkSecurityGroup \
  --lb-name myLoadBalancer --lb-address-pools myBackEndPool \
  --lb-inbound-nat-rules myLoadBalancerRuleSSH2
```


## Create an availability set
Availability sets help spread your VMs across fault domains and upgrade domains. Let's create an availability set for your VMs with [az vm availability-set create](/cli/azure/vm/availability-set#create). The following example creates an availability set named `myAvailabilitySet`:

```azurecli
az vm availability-set create --resource-group myResourceGroup --location westeurope \
  --name myAvailabilitySet \
  --platform-fault-domain-count 3 --platform-update-domain-count 2
```

Fault domains define a grouping of virtual machines that share a common power source and network switch. By default, the virtual machines that are configured within your availability set are separated across up to three fault domains. The idea is that a hardware issue in one of these fault domains does not affect every VM that is running your app. Azure automatically distributes VMs across the fault domains when placing them in an availability set.

Upgrade domains indicate groups of virtual machines and underlying physical hardware that can be rebooted at the same time. The order in which upgrade domains are rebooted might not be sequential during planned maintenance, but only one upgrade is rebooted at a time. Again, Azure automatically distributes your VMs across upgrade domains when placing them in an availability site.

Read more about [managing the availability of VMs](manage-availability.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).


## Create the Linux VMs
You've created the network resources to support Internet-accessible VMs. Now let's create those VMs and secure them with an SSH key that doesn't have a password. In this case, we're going to create an Ubuntu VM based on the most recent LTS. We locate that image information by using [az vm image list](/cli/azure/vm/image#list), as described in [finding Azure VM images](cli-ps-findimage.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

We also specify an SSH key to use for authentication. If you do not have any SSH keys, you can create them by using [these instructions](mac-create-ssh-keys.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). Alternatively, you can use the `--admin-password` method to authenticate your SSH connections after the VM is created. This method is typically less secure.

We create the VM by bringing all our resources and information together with the [az vm create](/cli/azure/vm#create) command. The following example creates a VM named `myVM1` using Azure Managed Disks. If you wish to use unmanaged disks, see the additional note below.

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM1 \
    --location westeurope \
    --availability-set myAvailabilitySet \
    --nics myNic1 \
    --image UbuntuLTS \
    --ssh-key-value ~/.ssh/id_rsa.pub \
    --admin-username azureuser
```

If you use Azure Managed Disks, skip this step. If you wish to use unmanaged disks and you created a storage account in the previous steps, you need to add some additional parameters to the proceeding command. Add the following additional parameters to the proceeding command to create the unmanaged disks in the storage account named `mystorageaccount`: 

```azurecli
  --use-unmanaged-disk \
  --storage-account mystorageaccount
```

Output:

```json
{
  "fqdn": "",
  "id": "/subscriptions/guid/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM1",
  "macAddress": "",
  "privateIpAddress": "",
  "publicIpAddress": "",
  "resourceGroup": "myResourceGroup"
}
```

You can connect to your VM immediately by using your default SSH keys. Make sure that you specify the appropriate port since we're passing through the load balancer. (For our first VM, we set up the NAT rule to forward port 4222 to our VM.)

```bash
ssh ops@mypublicdns.westeurope.cloudapp.azure.com -p 4222 -i ~/.ssh/id_rsa.pub
```

Output:

```bash
The authenticity of host '[mypublicdns.westeurope.cloudapp.azure.com]:4222 ([xx.xx.xx.xx]:4222)' can't be established.
ECDSA key fingerprint is 94:2d:d0:ce:6b:fb:7f:ad:5b:3c:78:93:75:82:12:f9.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '[mypublicdns.westeurope.cloudapp.azure.com]:4222,[xx.xx.xx.xx]:4222' (ECDSA) to the list of known hosts.
Welcome to Ubuntu 16.04.1 LTS (GNU/Linux 4.4.0-34-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud

0 packages can be updated.
0 updates are security updates.

ops@myVM1:~$
```

Go ahead and create your second VM in the same manner:

```azurecli
az vm create \
    --resource-group myResourceGroup \
    --name myVM2 \
    --location westeurope \
    --availability-set myAvailabilitySet \
    --nics myNic2 \
    --image UbuntuLTS \
    --ssh-key-value ~/.ssh/id_rsa.pub \
    --admin-username azureuser
```

Again, if you do not use the default Azure Managed Disks, add the following additional parameters to the proceeding command to create the unmanaged disks in the storage account named `mystorageaccount`:

```azurecli
  --use-unmanaged-disk \
  --storage-account mystorageaccount
``` 

At this point, you're running your Ubuntu VMs behind a load balancer in Azure that you can sign into only with your SSH key pair (because passwords are disabled). You can install nginx or httpd, deploy a web app, and see the traffic flow through the load balancer to both of the VMs.


## Export the environment as a template
Now that you have built out this environment, what if you want to create an additional development environment with the same parameters, or a production environment that matches it? Resource Manager uses JSON templates that define all the parameters for your environment. You build out entire environments by referencing this JSON template. You can [build JSON templates manually](../../resource-group-authoring-templates.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) or export an existing environment to create the JSON template for you. Use [az group export](/cli/azure/group#export) to export your resource group as follows:

```azurecli
az group export --name myResourceGroup > myResourceGroup.json
```

This command creates the `myResourceGroup.json` file in your current working directory. When you create an environment from this template, you are prompted for all the resource names, including the names for the load balancer, network interfaces, or VMs. You can populate these names in your template file by adding the `--include-parameter-default-value` parameter to the **az group export** command that was shown earlier. Edit your JSON template to specify the resource names, or [create a parameters.json file](../../resource-group-authoring-templates.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) that specifies the resource names.

To create an environment from your template, use [az group deployment create](/cli/azure/group/deployment#create) as follows:

```azurecli
az group deployment create --resource-group myNewResourceGroup \
  --template-file myResourceGroup.json
```

You might want to read [more about how to deploy from templates](../../resource-group-template-deploy-cli.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). Learn about how to incrementally update environments, use the parameters file, and access templates from a single storage location.

## Next steps
Now you're ready to begin working with multiple networking components and VMs. You can use this sample environment to build out your application by using the core components introduced here.
