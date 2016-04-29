<properties
   pageTitle="Create a Linux VM from the ground up using the Azure CLI | Microsoft Azure"
   description="Create a Linux VM, Storage, Virtual Network & subnet, NIC, Public IP, Network Security Group all from the ground up using the Azure CLI."
   services="virtual-machines-linux"
   documentationCenter="virtual-machines"
   authors="iainfoulds"
   manager="squillace"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure"
   ms.date="04/29/2016"
   ms.author="iainfou"/>

# Create a Linux VM from the ground up using the Azure CLI

To create a Linux VM you will need [the Azure CLI](../xplat-cli-install.md) in resource manager mode (`azure config mode arm`) and a JSON parsing tool, we are using [jq](https://stedolan.github.io/jq/) for this document.

## Quick Commands

```bash
# Create the Resource Group
ahmet@fedora$ azure group create TestRG -l westeurope

# Verify the RG using the JSON parser
ahmet@fedora$ azure group show TestRG --json | jq '.'

# Create the Storage Account
ahmet@fedora$ azure storage account create -g TestRG -l westeurope --type GRS computeteststore

# Verify the storage using the JSON parser
ahmet@fedora$ azure storage account show -g TestRG computeteststore --json | jq '.'

# Create the Virtual Network
ahmet@fedora$ azure network vnet create -g TestRG -n TestVNet -a 192.168.0.0/16 -l westeurope

# Create the Subnet
ahmet@fedora$ azure network vnet subnet create -g TestRG -e TestVNet -n FrontEnd -a 192.168.1.0/24

# Verify the VNet and Subnet using the JSON parser
ahmet@fedora$ azure network vnet show TestRG TestVNet --json | jq '.'

# Create a public IP
ahmet@fedora$ azure network public-ip create -g TestRG -n TestLBPIP -l westeurope -d testlb -a static -i 4

# Create the load balancer
ahmet@fedora$ azure network lb create -g TestRG -n TestLB -l westeurope

# Create a front-end IP pool for the load balancer, and associate our public IP
ahmet@fedora$ azure network lb frontend-ip create -g TestRG -l TestLB -n TestFrontEndPool -i TestLBPIP

# Create our back-end IP pool for the load balancer
ahmet@fedora$ azure network lb address-pool create -g TestRG -l TestLB -n TestBackEndPool

# Create SSH inbound NAT rules for the load balancer
ahmet@fedora$ azure network lb inbound-nat-rule create -g TestRG -l TestLB -n VM1-SSH -p tcp -f 4222 -b 22
ahmet@fedora$ azure network lb inbound-nat-rule create -g TestRG -l TestLB -n VM2-SSH -p tcp -f 4223 -b 22

# Create our web inbound NAT rules for the load balancer
ahmet@fedora$ azure network lb rule create -g TestRG -l TestLB -n WebRule -p tcp -f 80 -b 80 \
     -t TestFrontEndPool -o TestBackEndPool

# Create our load balancer health probe
ahmet@fedora$ azure network lb probe create -g TestRG -l TestLB -n HealthProbe -p "http" -f healthprobe.aspx -i 15 -c 4

# Verify the load balancer, IP pools, and NAT rules using the JSON parser
ahmet@fedora$ azure network lb show -g TestRG -n TestLB --json | jq '.'

# Create the first NIC
ahmet@fedora$ ahmet@fedora$ azure network nic create -g TestRG -n LB-NIC1 -l westeurope --subnet-vnet-name TestVNet --subnet-name FrontEnd
    -d "/subscriptions/########-####-####-####-############/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/backendAddressPools/TestBackEndPool"
    -e "/subscriptions/########-####-####-####-############/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/inboundNatRules/VM1-SSH"

# Create the second NIC
ahmet@fedora$ azure network nic create -g TestRG -n LB-NIC2 -l westeurope --subnet-vnet-name TestVNet --subnet-name FrontEnd
    -d "/subscriptions/########-####-####-####-############/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/backendAddressPools/TestBackEndPool"
    -e "/subscriptions/########-####-####-####-############/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/inboundNatRules/VM2-SSH"

# Verify the NICs using the JSON parser
ahmet@fedora$ azure network nic show TestRG LB-NIC1 --json | jq '.'
ahmet@fedora$ azure network nic show TestRG LB-NIC2 --json | jq '.'

# Create the NSG
ahmet@fedora$ azure network nsg create -g TestRG -n TestNSG -l westeurope

# Add the inbound rules for the NSG
ahmet@fedora$ azure network nsg rule create --protocol tcp --direction inbound --priority 1000 \
    --destination-port-range 22 --access allow -g TestRG -a TestNSG -n SSHRule
ahmet@fedora$ azure network nsg rule create --protocol tcp --direction inbound --priority 1001 \
    --destination-port-range 80 --access allow -g TestRG -a TestNSG -n HTTPRule

# Verify the NSG and inbound rules using the JSON parser
ahmet@fedora$ azure network nsg show -g TestRG -n TestNSG --json | jq '.'

# Bind the NSG to the NICs
ahmet@fedora$ azure network nic set -g TestRG -n LB-NIC1 -o TestNSG
ahmet@fedora$ azure network nic set -g TestRG -n LB-NIC2 -o TestNSG

# Create the availability set
ahmet@fedora$ azure availset create -g TestRG -n TestAvailSet -l westeurope

# Create the first Linux VM
ahmet@fedora$ azure vm create \            
    --resource-group TestRG \
    --name TestVM1 \
    --location westeurope \
    --os-type linux \
    --availset-name TestAvailSet \
    --nic-name LB-NIC1 \
    --vnet-name TestVnet \
    --vnet-subnet-name FrontEnd \
    --storage-account-name computeteststore \
    --image-urn canonical:UbuntuServer:14.04.4-LTS:latest \
    --ssh-publickey-file ~/.ssh/id_rsa.pub \
    --admin-username ops

# Create the second Linux VM
ahmet@fedora$ azure vm create \            
    --resource-group TestRG \
    --name TestVM2 \
    --location westeurope \
    --os-type linux \
    --availset-name TestAvailSet \
    --nic-name LB-NIC2 \
    --vnet-name TestVnet \
    --vnet-subnet-name FrontEnd \
    --storage-account-name computeteststore \
    --image-urn canonical:UbuntuServer:14.04.4-LTS:latest \
    --ssh-publickey-file ~/.ssh/id_rsa.pub \
    --admin-username ops

# Verify everything built using the JSON parser
ahmet@fedora$ azure vm show -g TestRG -n TestVM1 --json | jq '.'
ahmet@fedora$ azure vm show -g TestRG -n TestVM2 --json | jq '.'

```

## Detailed Walkthrough

### Introduction

This article builds a deployment with two Linux VMs behind a load balancer. It walks through the entire basic deployment imperatively, command by command, until you have working, secure Linux VMs to which you can connect from anywhere on the internet.

Along the way, you'll understand the dependency hierarchy that the Resource Manager deployment model gives you and how much power it provides. Once you see how the system is built, you can rebuild the system much faster using more direct Azure CLI commands (see [this](virtual-machines-linux-quick-create-cli.md) for roughly the same deployment using the `azure vm quick-create` command), or you can move on to master how to design and automate entire network and application deployments and update them using [Azure Resource Manager templates](../resource-group-authoring-templates.md). Once you see how the parts of your deployment fit together, creating templates to automate them becomes easier.

Let's build a simple network and load balancer with a pair of VMs useful to development and simple compute, and we'll explain it as we go. Then you'll be able to move on to more complex networks and deployments.

## Create resource group and choose deployment locations

Azure Resource Groups are logical deployment entities that contain configuration and other metadata to enable logical management of resource deployments.

```
ahmet@fedora$ azure group create TestRG westeurope                        
info:    Executing command group create
+ Getting resource group TestRG
+ Creating resource group TestRG
info:    Created resource group TestRG
data:    Id:                  /subscriptions/<yoursub>/resourceGroups/TestRG
data:    Name:                TestRG
data:    Location:            westeurope
data:    Provisioning State:  Succeeded
data:    Tags: null
data:
info:    group create command OK
```

## Create a storage account

You're going to need storage accounts for your VM disks and for any additional data disks you want to add, among other scenarios. In short, you're always going to create storage accounts almost immediately after you create resource groups.

Here we use the `azure storage account create` command, passing the location of the account, the resource group that will control it, and the type of storage support you would like.

```
ahmet@fedora$ azure storage account create \  
--location westeurope \
--resource-group TestRG \
--type GRS \
computeteststore
info:    Executing command storage account create
+ Creating storage account
info:    storage account create command OK
ahmet•~/workspace/keygen» azure group show testrg
info:    Executing command group show
+ Listing resource groups
+ Listing resources for the group
data:    Id:                  /subscriptions/<guid>/resourceGroups/TestRG
data:    Name:                TestRG
data:    Location:            westeurope
data:    Provisioning State:  Succeeded
data:    Tags: null
data:    Resources:
data:
data:      Id      : /subscriptions/<guid>/resourceGroups/TestRG/providers/Microsoft.Storage/storageAccounts/computeteststore
data:      Name    : computeteststore
data:      Type    : storageAccounts
data:      Location: westeurope
data:      Tags    :
data:
data:    Permissions:
data:      Actions: *
data:      NotActions:
data:
info:    group show command OK
```

Let's use the [jq](https://stedolan.github.io/jq/) tool (you can use **jsawk** or any language library you prefer to parse the JSON) along with the `--json` Azure CLI option to examine our resource group using the `azure group show` command.

```
ahmet@fedora$ azure group show TestRG --json | jq '.'                                                                                        
{
  "tags": {},
  "id": "/subscriptions/<guid>/resourceGroups/TestRG",
  "name": "TestRG",
  "provisioningState": "Succeeded",
  "location": "westeurope",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "resources": [
    {
      "id": "/subscriptions/<guid>/resourceGroups/TestRG/providers/Microsoft.Storage/storageAccounts/computeteststore",
      "name": "computeteststore",
      "type": "storageAccounts",
      "location": "westeurope",
      "tags": null
    }
  ],
  "permissions": [
    {
      "actions": [
        "*"
      ],
      "notActions": []
    }
  ]
}
```

To investigate the storage account using the CLI, you need to first set the account names and keys using a variation of the following command, replacing the name of this article's storage account with your own.

```
AZURE_STORAGE_CONNECTION_STRING="$(azure storage account connectionstring show computeteststore --resource-group testrg --json | jq -r '.string')"
```

Then you'll be able to view your storage information easily:

```
ahmet@fedora$ azure storage container list
info:    Executing command storage container list
+ Getting storage containers
data:    Name  Public-Access  Last-Modified
data:    ----  -------------  -----------------------------
data:    vhds  Off            Sun, 27 Sep 2015 19:03:54 GMT
info:    storage container list command OK
```
## Create your Virtual Network and subnet

You're going to need to create an Azure Virtual Network and a subnet into which you can install your VMs.

```
ahmet@fedora$ azure network vnet create -g TestRG -n TestVNet -a 192.168.0.0/16 -l westeurope
info:    Executing command network vnet create
+ Looking up virtual network "TestVNet"
+ Creating virtual network "TestVNet"
+ Loading virtual network state
data:    Id                              : /subscriptions/<guid>/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet
data:    Name                            : TestVNet
data:    Type                            : Microsoft.Network/virtualNetworks
data:    Location                        : westeurope
data:    ProvisioningState               : Succeeded
data:    Address prefixes:
data:      192.168.0.0/16
info:    network vnet create command OK
```

Again, let's see how we're building our resources using the --json option of `azure group show` and **jq**. We now have a `storageAccounts` resource and a `virtualNetworks` resource.  

```
ahmet@fedora$ azure group show TestRG --json | jq '.'
{
  "tags": {},
  "id": "/subscriptions/<guid>/resourceGroups/TestRG",
  "name": "TestRG",
  "provisioningState": "Succeeded",
  "location": "westeurope",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "resources": [
    {
      "id": "/subscriptions/<guid>/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet",
      "name": "TestVNet",
      "type": "virtualNetworks",
      "location": "westeurope",
      "tags": null
    },
    {
      "id": "/subscriptions/<guid>/resourceGroups/TestRG/providers/Microsoft.Storage/storageAccounts/computeteststore",
      "name": "computeteststore",
      "type": "storageAccounts",
      "location": "westeurope",
      "tags": null
    }
  ],
  "permissions": [
    {
      "actions": [
        "*"
      ],
      "notActions": []
    }
  ]
}
```

Now let's create a subnet in the `TestVnet` virtual network into which the VMs will be deployed. We use the `azure network vnet subnet create` command, along with the resources we've already created: the `TestRG` resource group, the `TestVNet` virtual network, and we'll add the subnet name `FrontEnd` and the subnet address prefix `192.168.1.0/24`, as follows.

```
ahmet@fedora$ azure network vnet subnet create -g TestRG -e TestVNet -n FrontEnd -a 192.168.1.0/24
info:    Executing command network vnet subnet create
+ Looking up the subnet "FrontEnd"
+ Creating subnet "FrontEnd"
+ Looking up the subnet "FrontEnd"
data:    Id                              : /subscriptions/<guid>/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd
data:    Type                            : Microsoft.Network/virtualNetworks/subnets
data:    ProvisioningState               : Succeeded
data:    Name                            : FrontEnd
data:    Address prefix                  : 192.168.1.0/24
data:
info:    network vnet subnet create command OK
```

As the subnet is logically inside the virtual network, we'll look for the subnet information with a slightly different command -- `azure network vnet show`, but still examining the JSON output using **jq**.

```
ahmet@fedora$ azure network vnet show TestRG TestVNet --json | jq '.'
{
  "subnets": [
    {
      "ipConfigurations": [],
      "addressPrefix": "192.168.1.0/24",
      "provisioningState": "Succeeded",
      "name": "FrontEnd",
      "etag": "W/\"974f3e2c-028e-4b35-832b-a4b16ad25eb6\"",
      "id": "/subscriptions/<guid>/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd"
    }
  ],
  "tags": {},
  "addressSpace": {
    "addressPrefixes": [
      "192.168.0.0/16"
    ]
  },
  "dhcpOptions": {
    "dnsServers": []
  },
  "provisioningState": "Succeeded",
  "etag": "W/\"974f3e2c-028e-4b35-832b-a4b16ad25eb6\"",
  "id": "/subscriptions/<guid>/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet",
  "name": "TestVNet",
  "location": "westeurope"
}
```
## Create your Public IP address (PIP)

Now let's create your public IP address (PIP) that we'll assign to your load balancer and enable you to connect to your VMs from the internet using the `azure network public-ip create` command. Because the default is a dynamic address, we create a named DNS entry in the **cloudapp.azure.com** domain by using the `-d testsubdomain` option.

```
ahmet@fedora$ azure network public-ip create -d testsubdomain TestRG TestPIP westeurope
info:    Executing command network public-ip create
+ Looking up the public ip "TestPIP"
+ Creating public ip address "TestPIP"
+ Looking up the public ip "TestPIP"
data:    Id                              : /subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/publicIPAddresses/TestPIP
data:    Name                            : TestPIP
data:    Type                            : Microsoft.Network/publicIPAddresses
data:    Location                        : westeurope
data:    Provisioning state              : Succeeded
data:    Allocation method               : Dynamic
data:    Idle timeout                    : 4
data:    Domain name label               : testsubdomain
data:    FQDN                            : testsubdomain.westeurope.cloudapp.azure.com
info:    network public-ip create command OK
```

This is also a top-level resource, so you can see it with `azure group show`.

```
ahmet@fedora$ azure group show TestRG --json | jq '.'
{
"tags": {},
"id": "/subscriptions/guid/resourceGroups/TestRG",
"name": "TestRG",
"provisioningState": "Succeeded",
"location": "westeurope",
"properties": {
    "provisioningState": "Succeeded"
},
"resources": [
    {
    "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/TestNIC",
    "name": "TestNIC",
    "type": "networkInterfaces",
    "location": "westeurope",
    "tags": null
    },
    {
    "id": "/subscriptions/guid/resourceGroups/testrg/providers/Microsoft.Network/publicIPAddresses/testpip",
    "name": "testpip",
    "type": "publicIPAddresses",
    "location": "westeurope",
    "tags": null
    },
    {
    "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet",
    "name": "TestVNet",
    "type": "virtualNetworks",
    "location": "westeurope",
    "tags": null
    },
    {
    "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Storage/storageAccounts/computeteststore",
    "name": "computeteststore",
    "type": "storageAccounts",
    "location": "westeurope",
    "tags": null
    }
],
"permissions": [
    {
    "actions": [
        "*"
    ],
    "notActions": []
    }
]
}
```

And, as always, you can investigate more resource details, including the subdomain fully qualified domain name (FQDN) using the more complete `azure network public-ip show` command. Note that the public IP address resource has been allocated logically, but there is not yet a specific address assigned. For that, you're going to need a load balancer, which we have not yet created.

```
azure network public-ip show TestRG TestPIP --json | jq '.'
{
"tags": {},
"publicIpAllocationMethod": "Dynamic",
"dnsSettings": {
    "domainNameLabel": "testsubdomain",
    "fqdn": "testsubdomain.westeurope.cloudapp.azure.com"
},
"idleTimeoutInMinutes": 4,
"provisioningState": "Succeeded",
"etag": "W/\"c63154b3-1130-49b9-a887-877d74d5ebc5\"",
"id": "/subscriptions/guid/resourceGroups/testrg/providers/Microsoft.Network/publicIPAddresses/testpip",
"name": "testpip",
"location": "westeurope"
}
```

## Create your load balancer and IP pools
Creating a load balancer allows you to distribute traffic across multiple VMs, such as when running web applications. It also provides redundancy to your application by running multiple VMs that respond to users requests in the event of maintenance or heavy load.

We create our load balancer with:

```
ahmet@fedora$ azure network lb create -g TestRG -n TestLB -l westeurope
azure network lb create -g TestRG -n TestLB -l westeurope
info:    Executing command network lb create
+ Looking up the load balancer "TestLB"
+ Creating load balancer "TestLB"
data:    Id                              : /subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB
data:    Name                            : TestLB
data:    Type                            : Microsoft.Network/loadBalancers
data:    Location                        : westeurope
data:    Provisioning state              : Succeeded
info:    network lb create command OK
```
Our load balancer is pretty empty, so let's create some IP pools. We want to create two IP pools for our load balancer - one for our front-end, and one for our back-end. The front-end IP pool is what we'll have publicly visible and where we'll assign the PIP we created earlier. The back-end pool we'll then use for our VMs to connect to in order for the traffic to flow through the load balancer to them.

First, let's create our front-end IP pool:

```
ahmet@fedora$ azure network lb frontend-ip create -g TestRG -l TestLB -n TestFrontEndPool -i TestLBPIP
info:    Executing command network lb frontend-ip create
+ Looking up the load balancer "TestLB"
+ Looking up the public ip "TestLBPIP"
+ Updating load balancer "TestLB"
data:    Name                            : TestFrontEndPool
data:    Provisioning state              : Succeeded
data:    Private IP allocation method    : Dynamic
data:    Public IP address id            : /subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/publicIPAddresses/TestLBPIP
info:    network lb frontend-ip create command OK
```
Note how we used the `--public-ip-name` switch to pass in the TestLBPIP we created earlier. This assigns the public IP address to the load balancer so we can reach our VMs across the Internet.

Next, let's create our second IP pool, this time for our back-end traffic:

```
ahmet@fedora$ azure network lb address-pool create -g TestRG -l TestLB -n TestBackEndPool
info:    Executing command network lb address-pool create
+ Looking up the load balancer "TestLB"
+ Updating load balancer "TestLB"
data:    Name                            : TestBackEndPool
data:    Provisioning state              : Succeeded
info:    network lb address-pool create command OK
```

We can check how our load balancer is looking with `azure network lb show` and examining the JSON output:

```
ahmet@fedora$ azure network lb show TestRG TestLB --json | jq '.'
{
  "etag": "W/\"29c38649-77d6-43ff-ab8f-977536b0047c\"",
  "provisioningState": "Succeeded",
  "resourceGuid": "f1446acb-09ba-44d9-b8b6-849d9983dc09",
  "outboundNatRules": [],
  "inboundNatPools": [],
  "inboundNatRules": [],
  "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB",
  "name": "TestLB",
  "type": "Microsoft.Network/loadBalancers",
  "location": "westeurope",
  "frontendIPConfigurations": [
    {
      "etag": "W/\"29c38649-77d6-43ff-ab8f-977536b0047c\"",
      "name": "TestFrontEndPool",
      "provisioningState": "Succeeded",
      "publicIPAddress": {
        "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/publicIPAddresses/TestLBPIP"
      },
      "privateIPAllocationMethod": "Dynamic",
      "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/frontendIPConfigurations/TestFrontEndPool"
    }
  ],
  "backendAddressPools": [
    {
      "etag": "W/\"29c38649-77d6-43ff-ab8f-977536b0047c\"",
      "name": "TestBackEndPool",
      "provisioningState": "Succeeded",
      "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/backendAddressPools/TestBackEndPool"
    }
  ],
  "loadBalancingRules": [],
  "probes": []
}
```

## Create your load balancer NAT rules
To actually get traffic flowing through our load balancer, we need to create NAT rules that specify either inbound or outbound actions. You can specify the protocol in use, then map external ports to internal ports as desired. For our environment, let's create some rules that allow SSH through our load balancer to our VMs. We'll set up TCP ports 4222 and 4223 to direct to TCP port 22 on our VMs (which we'll create later):

```
ahmet@fedora$ azure network lb inbound-nat-rule create -g TestRG -l TestLB -n VM1-SSH -p tcp -f 4222 -b 22
info:    Executing command network lb inbound-nat-rule create
+ Looking up the load balancer "TestLB"
warn:    Using default enable floating ip: false
warn:    Using default idle timeout: 4
warn:    Using default frontend IP configuration "TestFrontEndPool"
+ Updating load balancer "TestLB"
data:    Name                            : VM1-SSH
data:    Provisioning state              : Succeeded
data:    Protocol                        : Tcp
data:    Frontend port                   : 4222
data:    Backend port                    : 22
data:    Enable floating IP              : false
data:    Idle timeout in minutes         : 4
data:    Frontend IP configuration id    : /subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/frontendIPConfigurations/TestFrontEndPool
info:    network lb inbound-nat-rule create command OK
```

Repeat the procedure for your second NAT rule for SSH:

```
ahmet@fedora$ azure network lb inbound-nat-rule create -g TestRG -l TestLB -n VM2-SSH -p tcp -f 4223 -b 22
```

Let's also go ahead and create a NAT rule for TCP port 80, hooking the rule up to our IP pools. Rather than hooking up the rule to our VMs individually means we can simply add or remove VMs from the IP pool and have the load balancer automatically adjust the flow of traffic:

```
ahmet@fedora$ azure network lb rule create -g TestRG -l TestLB -n WebRule -p tcp -f 80 -b 80 \
     -t TestFrontEndPool -o TestBackEndPool
info:    Executing command network lb rule create
+ Looking up the load balancer "TestLB"
warn:    Using default idle timeout: 4
warn:    Using default enable floating ip: false
warn:    Using default load distribution: Default
+ Updating load balancer "TestLB"
data:    Name                            : WebRule
data:    Provisioning state              : Succeeded
data:    Protocol                        : Tcp
data:    Frontend port                   : 80
data:    Backend port                    : 80
data:    Enable floating IP              : false
data:    Load distribution               : Default
data:    Idle timeout in minutes         : 4
data:    Frontend IP configuration id    : /subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/frontendIPConfigurations/TestFrontEndPool
data:    Backend address pool id         : /subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/backendAddressPools/TestBackEndPool
info:    network lb rule create command OK

```

## Create your load balancer health probe
A health probe will periodically check on the VMs that are behind our load balancer to make sure they're operating and responding to requests as defined. If not, they will be removed from operation to ensure that users aren't being directed to them. You can define custom checks for the health probe, along with intervals and timeout values. For more information on health probes, you can look read [Load Balancer probes](../load-balancer/load-balancer-custom-probe-overview.md).

```
ahmet@fedora$ azure network lb probe create -g TestRG -l TestLB -n HealthProbe -p "http" -f healthprobe.aspx -i 15 -c 4
info:    Executing command network lb probe create
warn:    Using default probe port: 80
+ Looking up the load balancer "TestLB"
+ Updating load balancer "TestLB"
data:    Name                            : HealthProbe
data:    Provisioning state              : Succeeded
data:    Protocol                        : Http
data:    Port                            : 80
data:    Interval in seconds             : 15
data:    Number of probes                : 4
info:    network lb probe create command OK
```

Here, we specified an interval of 15 seconds for our health checks, and we can miss a maximum of 4 probes (1 minute) before the load balancer is going to consider that host to no longer be functioning.

## Verify your load balancer
That's all of the load balancer configuration done. You created a load balancer, created a front-end IP pool and assigned a public IP to it, then created a back-end IP pool that VMs will be connected to. Next, you created NAT rules that will allow SSH to the VMs for management, along with a rule that allows TCP port 80 for our web app. Finally, to make sure that our users don't try to access a VM that is no longer functioning and serving content, you added a health probe to periodically check the VMs.

Let's review what your load balancer now looks like:

```
ahmet@fedora$ azure network lb show -g TestRG -n TestLB --json | jq '.'
{
  "etag": "W/\"62a7c8e7-859c-48d3-8e76-5e078c5e4a02\"",
  "provisioningState": "Succeeded",
  "resourceGuid": "f1446acb-09ba-44d9-b8b6-849d9983dc09",
  "outboundNatRules": [],
  "inboundNatPools": [],
  "inboundNatRules": [
    {
      "etag": "W/\"62a7c8e7-859c-48d3-8e76-5e078c5e4a02\"",
      "name": "VM1-SSH",
      "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/inboundNatRules/VM1-SSH",
      "frontendIPConfiguration": {
        "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/frontendIPConfigurations/TestFrontEndPool"
      },
      "protocol": "Tcp",
      "frontendPort": 4222,
      "backendPort": 22,
      "idleTimeoutInMinutes": 4,
      "enableFloatingIP": false,
      "provisioningState": "Succeeded"
    },
    {
      "etag": "W/\"62a7c8e7-859c-48d3-8e76-5e078c5e4a02\"",
      "name": "VM2-SSH",
      "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/inboundNatRules/VM2-SSH",
      "frontendIPConfiguration": {
        "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/frontendIPConfigurations/TestFrontEndPool"
      },
      "protocol": "Tcp",
      "frontendPort": 4223,
      "backendPort": 22,
      "idleTimeoutInMinutes": 4,
      "enableFloatingIP": false,
      "provisioningState": "Succeeded"
    }
  ],
  "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB",
  "name": "TestLB",
  "type": "Microsoft.Network/loadBalancers",
  "location": "westeurope",
  "frontendIPConfigurations": [
    {
      "etag": "W/\"62a7c8e7-859c-48d3-8e76-5e078c5e4a02\"",
      "name": "TestFrontEndPool",
      "provisioningState": "Succeeded",
      "publicIPAddress": {
        "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/publicIPAddresses/TestLBPIP"
      },
      "privateIPAllocationMethod": "Dynamic",
      "loadBalancingRules": [
        {
          "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/loadBalancingRules/WebRule"
        }
      ],
      "inboundNatRules": [
        {
          "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/inboundNatRules/VM1-SSH"
        },
        {
          "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/inboundNatRules/VM2-SSH"
        }
      ],
      "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/frontendIPConfigurations/TestFrontEndPool"
    }
  ],
  "backendAddressPools": [
    {
      "etag": "W/\"62a7c8e7-859c-48d3-8e76-5e078c5e4a02\"",
      "name": "TestBackEndPool",
      "provisioningState": "Succeeded",
      "loadBalancingRules": [
        {
          "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/loadBalancingRules/WebRule"
        }
      ],
      "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/backendAddressPools/TestBackEndPool"
    }
  ],
  "loadBalancingRules": [
    {
      "etag": "W/\"62a7c8e7-859c-48d3-8e76-5e078c5e4a02\"",
      "name": "WebRule",
      "provisioningState": "Succeeded",
      "enableFloatingIP": false,
      "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/loadBalancingRules/WebRule",
      "frontendIPConfiguration": {
        "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/frontendIPConfigurations/TestFrontEndPool"
      },
      "backendAddressPool": {
        "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/backendAddressPools/TestBackEndPool"
      },
      "protocol": "Tcp",
      "loadDistribution": "Default",
      "frontendPort": 80,
      "backendPort": 80,
      "idleTimeoutInMinutes": 4
    }
  ],
  "probes": [
    {
      "etag": "W/\"62a7c8e7-859c-48d3-8e76-5e078c5e4a02\"",
      "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/probes/HealthProbe",
      "protocol": "Http",
      "port": 80,
      "intervalInSeconds": 15,
      "numberOfProbes": 4,
      "requestPath": "healthprobe.aspx",
      "provisioningState": "Succeeded",
      "name": "HealthProbe"
    }
  ]
}

```

## Create a NIC to use with the Linux VM

Even NICs are programmatically available, as you may apply rules to their use and have more than one. Note that in the following `azure network nic create` command, you hook up our NIC to the load back-end IP pool and associated with our NAT rule to permit SSH traffic. To do this, you need to specify the subscription ID of your Azure subscription in place of `<GUID>`:

```
ahmet@fedora$ azure network nic create -g TestRG -n LB-NIC1 -l westeurope --subnet-vnet-name TestVNet --subnet-name FrontEnd -d "/subscriptions/<GUID>/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/backendAddressPools/TestBackEndPool" -e "/subscriptions/<GUID>/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/inboundNatRules/VM1-SSH"
info:    Executing command network nic create
+ Looking up the subnet "FrontEnd"
+ Looking up the network interface "LB-NIC1"
+ Creating network interface "LB-NIC1"
data:    Id                              : /subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/LB-NIC1
data:    Name                            : LB-NIC1
data:    Type                            : Microsoft.Network/networkInterfaces
data:    Location                        : westeurope
data:    Provisioning state              : Succeeded
data:    Enable IP forwarding            : false
data:    IP configurations:
data:      Name                          : Nic-IP-config
data:      Provisioning state            : Succeeded
data:      Private IP address            : 192.168.1.4
data:      Private IP allocation method  : Dynamic
data:      Subnet                        : /subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd
data:      Load balancer backend address pools:
data:        Id                          : /subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/backendAddressPools/TestBackEndPool
data:      Load balancer inbound NAT rules:
data:        Id                          : /subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/inboundNatRules/VM1-SSH
data:
info:    network nic create command OK

```

You can see the details by examining the resource directly, using the `azure network nic show` command.

```
ahmet@fedora$ azure network nic show TestRG LB-NIC1 --json | jq '.'
{
  "etag": "W/\"fc1eaaa1-ee55-45bd-b847-5a08c7f4264a\"",
  "provisioningState": "Succeeded",
  "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/LB-NIC1",
  "name": "LB-NIC1",
  "type": "Microsoft.Network/networkInterfaces",
  "location": "westeurope",
  "ipConfigurations": [
    {
      "etag": "W/\"fc1eaaa1-ee55-45bd-b847-5a08c7f4264a\"",
      "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/LB-NIC1/ipConfigurations/Nic-IP-config",
      "loadBalancerBackendAddressPools": [
        {
          "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/backendAddressPools/TestBackEndPool"
        }
      ],
      "loadBalancerInboundNatRules": [
        {
          "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/inboundNatRules/VM1-SSH"
        }
      ],
      "privateIPAddress": "192.168.1.4",
      "privateIPAllocationMethod": "Dynamic",
      "subnet": {
        "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd"
      },
      "provisioningState": "Succeeded",
      "name": "Nic-IP-config"
    }
  ],
  "dnsSettings": {
    "appliedDnsServers": [],
    "dnsServers": []
  },
  "enableIPForwarding": false,
  "resourceGuid": "a20258b8-6361-45f6-b1b4-27ffed28798c"
}

```

Let's go ahead and create the second NIC, hooking in to our back-end IP pool again, and this time the second of our NAT rules to permit SSH traffic:

```
ahmet@fedora$ azure network nic create -g TestRG -n LB-NIC2 -l westeurope --subnet-vnet-name TestVNet --subnet-name FrontEnd -d "/subscriptions/<GUID>/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/backendAddressPools/TestBackEndPool" -e "/subscriptions/<GUID>/resourceGroups/TestRG/providers/Microsoft.Network/loadBalancers/TestLB/inboundNatRules/VM2-SSH"
```

## Create your Network Security Group and rules

Now we create your network security group (NSG) and the inbound rules that govern access to the NIC.

```
ahmet@fedora$ azure network nsg create TestRG TestNSG westeurope
```

Let's add the inbound rule for the NSG to allow inbound connections on port 22 (to support SSH):

```
ahmet@fedora$ azure network nsg rule create --protocol tcp --direction inbound --priority 1000 \
    --destination-port-range 22 --access allow TestRG TestNSG SSHRule
ahmet@fedora$ azure network nsg rule create --protocol tcp --direction inbound --priority 1001 \
    --destination-port-range 80 --access allow -g TestRG -a TestNSG -n HTTPRule
```

> [AZURE.NOTE] The inbound rule is a filter for inbound network connections. In this example, we will bind the NSG to the VMs virtual network interface card (NIC), which means that any request to port 22 will be passed through to the NIC on our VM. Because this is a rule about a network connection -- and not an endpoint as in classic deployments -- to open a port, you must leave the `--source-port-range` set to '\*' (the default value) in order to accept inbound requests from **any** requesting port, which are typically dynamic.

## Bind to the NIC

Bind the NSG to the NICs:

```
ahmet@fedora$ azure network nic set -g TestRG -n LB-NIC1 -o TestNSG
ahmet@fedora$ azure network nic set -g TestRG -n LB-NIC2 -o TestNSG
```

## Create an availability set
Availability sets help spread your VMs across what are known as fault domains and upgrade domains. Let's create an availability set for your VMs:

```
ahmet@fedora$ azure availset create -g TestRG -n TestAvailSet -l westeurope
```

Fault domains define a grouping of virtual machines that share a common power source and network switch. By default, the virtual machines configured within your availability set are separated across up to three fault domains. The idea is that a hardware issue in one of these fault domains will not affect every VM that is running your app. Azure will automatically distribute VMs across the fault domains when placing them in to an availability set.

Upgrade domains indicate groups of virtual machines and underlying physical hardware that can be rebooted at the same time. The order of upgrade domains being rebooted may not proceed sequentially during planned maintenance, but only one upgrade will be rebooted at a time. Again, Azure will automatically distribute your VMs across upgrade domains when they are placed within an availability site.

You can read more about [managing the availability of VMs](./virtual-machines-linux-manage-availability.md)

## Create your Linux VMs

You've created the storage and network resources to support an internet accessible VMs. Now let's create that VMs, and secure them with an SSH key with no password. In this case, we're going to create an Ubuntu VM based on the most recent LTS. We'll locate that image information using `azure vm image list`, as described in [finding Azure VM images](virtual-machines-linux-cli-ps-findimage.md). We selected an image using the command `azure vm image list westeurope canonical | grep LTS`, and in this case we'll use `canonical:UbuntuServer:14.04.4-LTS:14.04.201604060`, but for the last field we'll pass `latest` so that in the future we always get the most recent build (the string we use will be `canonical:UbuntuServer:14.04.4-LTS:14.04.201604060`).

> [AZURE.NOTE] This next step is familiar to anyone who has already created an ssh rsa public and private key pair on Linux or Mac using **ssh-keygen -t rsa -b 2048**. If you do not have any certificate key pairs in your `~/.ssh` directory, you can either create them:
<br />
    1. automatically by using the `azure vm create --generate-ssh-keys` option
    2. manually using [the instructions to create them youself](virtual-machines-linux-ssh-from-linux.md)
<br />
Alternatively, you can use the `azure vm create --admin-username --admin-password` options to use the typically less secure username and password method of authenticating your ssh connections once the VM is created.

We create the VM by bringing all of our resources and information together with the `azure vm create` command.

```
ahmet@fedora$ azure vm create \            
    --resource-group TestRG \
    --name TestVM1 \
    --location westeurope \
    --os-type linux \
    --availset-name TestAvailSet \
    --nic-name LB-NIC1 \
    --vnet-name TestVnet \
    --vnet-subnet-name FrontEnd \
    --storage-account-name computeteststore \
    --image-urn canonical:UbuntuServer:14.04.4-LTS:latest \
    --ssh-publickey-file ~/.ssh/id_rsa.pub \
    --admin-username ops
info:    Executing command vm create
+ Looking up the VM "TestVM1"
info:    Verifying the public key SSH file: /home/ifoulds/.ssh/id_rsa.pub
info:    Using the VM Size "Standard_A1"
info:    The [OS, Data] Disk or image configuration requires storage account
+ Looking up the storage account computeteststore
+ Looking up the availability set "TestAvailSet"
info:    Found an Availability set "TestAvailSet"
+ Looking up the NIC "LB-NIC1"
info:    Found an existing NIC "LB-NIC1"
info:    Found an IP configuration with virtual network subnet id "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd" in the NIC "LB-NIC1"
info:    This is an NIC without publicIP configured
info:    The storage URI 'https://computeteststore.blob.core.windows.net/' will be used for boot diagnostics settings, and it can be overwritten by the parameter input of '--boot-diagnostics-storage-uri'.
info:    vm create command OK
```

Immediately, you can connect to your VM using your default SSH keys, making sure you specify the appropriate port since we're passing through the load balancer (for our first VM, we set up the NAT rule to forward port 4222 to our VM):

```
ahmet@fedora$  ssh ops@testlb.westeurope.cloudapp.azure.com -p 4222
The authenticity of host '[testlb.westeurope.cloudapp.azure.com]:4222 ([xx.xx.xx.xx]:4222)' can't be established.
ECDSA key fingerprint is 94:2d:d0:ce:6b:fb:7f:ad:5b:3c:78:93:75:82:12:f9.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '[testlb.westeurope.cloudapp.azure.com]:4222,[xx.xx.xx.xx]:4222' (ECDSA) to the list of known hosts.
Welcome to Ubuntu 14.04.4 LTS (GNU/Linux 3.19.0-58-generic x86_64)

 * Documentation:  https://help.ubuntu.com/

  System information as of Wed Apr 27 23:44:06 UTC 2016

  System load: 0.37              Memory usage: 5%   Processes:       81
  Usage of /:  37.3% of 1.94GB   Swap usage:   0%   Users logged in: 0

  Graph this data and manage this system at:
    https://landscape.canonical.com/

  Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud

0 packages can be updated.
0 updates are security updates.



The programs included with the Ubuntu system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Ubuntu comes with ABSOLUTELY NO WARRANTY, to the extent permitted by
applicable law.

ops@TestVM1:~$
```

Go ahead and create your second VM in the same manner:

```
azure vm create \            
    --resource-group TestRG \
    --name TestVM2 \
    --location westeurope \
    --os-type linux \
    --availset-name TestAvailSet \
    --nic-name LB-NIC2 \
    --vnet-name TestVnet \
    --vnet-subnet-name FrontEnd \
    --storage-account-name computeteststore \
    --image-urn canonical:UbuntuServer:14.04.4-LTS:latest \
    --ssh-publickey-file ~/.ssh/id_rsa.pub \
    --admin-username ops
 ```

And you can now use the `azure vm show testrg testvm` command to examine what you've created. At this point, you have your running Ubuntu VMs behind a load balancer in Azure that you can only log into with the SSH key pair that you have; passwords are disabled. You can install nginx or httpd and deploy a web app and see the traffic flow through the load balancer to both of the VMs.

```
ahmet@fedora$ azure vm show TestRG TestVM1
info:    Executing command vm show
+ Looking up the VM "TestVM1"
+ Looking up the NIC "LB-NIC1"
data:    Id                              :/subscriptions/8fa5cd83-7fbb-431a-af16-4a20dede8802/resourceGroups/testrg/providers/Microsoft.Compute/virtualMachines/TestVM1
data:    ProvisioningState               :Succeeded
data:    Name                            :TestVM1
data:    Location                        :westeurope
data:    Type                            :Microsoft.Compute/virtualMachines
data:
data:    Hardware Profile:
data:      Size                          :Standard_A1
data:
data:    Storage Profile:
data:      Image reference:
data:        Publisher                   :canonical
data:        Offer                       :UbuntuServer
data:        Sku                         :14.04.4-LTS
data:        Version                     :latest
data:
data:      OS Disk:
data:        OSType                      :Linux
data:        Name                        :cli1cca1d20a1dcf56c-os-1461800591317
data:        Caching                     :ReadWrite
data:        CreateOption                :FromImage
data:        Vhd:
data:          Uri                       :https://computeteststore.blob.core.windows.net/vhds/cli1cca1d20a1dcf56c-os-1461800591317.vhd
data:
data:    OS Profile:
data:      Computer Name                 :TestVM1
data:      User Name                     :ops
data:      Linux Configuration:
data:        Disable Password Auth       :true
data:
data:    Network Profile:
data:      Network Interfaces:
data:        Network Interface #1:
data:          Primary                   :true
data:          MAC Address               :00-0D-3A-20-F8-8B
data:          Provisioning State        :Succeeded
data:          Name                      :LB-NIC1
data:          Location                  :westeurope
data:
data:    AvailabilitySet:
data:      Id                            :/subscriptions/guid/resourceGroups/testrg/providers/Microsoft.Compute/availabilitySets/TESTAVAILSET
data:
data:    Diagnostics Profile:
data:      BootDiagnostics Enabled       :true
data:      BootDiagnostics StorageUri    :https://computeteststore.blob.core.windows.net/
data:
data:      Diagnostics Instance View:
info:    vm show command OK
```

## Next steps

Now you're ready to begin with multiple networking components and VMs.
