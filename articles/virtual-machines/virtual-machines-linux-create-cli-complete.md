<properties
   pageTitle="Create a Linux VM from the ground up using the Azure CLI | Microsoft Azure"
   description="Create a Linux VM, Storage, Virtual Network & subnet, NIC, Public IP, Network Security Group all from the ground up using the Azure CLI."
   services="virtual-machines-linux"
   documentationCenter="virtual-machines"
   authors="vlivech"
   manager="squillace"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure"
   ms.date="02/10/2016"
   ms.author="v-livech"/>

# Create a Linux VM from the ground up using the Azure CLI


## Goal

- Deploy a Resource Group
- Deploy a Storage Account
- Deploy a Virtual Network & Subnet
- Configure a Network Security Group and inbound rules
- Assign a public IP to the NIC
- Assign the NSG to the NIC
- Deploy a Ubuntu 14.04 LTS VM

## Prerequisites

- Azure Account
  - [Get a free trial.](https://azure.microsoft.com/pricing/free-trial/) 
  - [Azure Portal](https://portal.azure.com)
- A JSON parsing tool: this example uses [jq](https://stedolan.github.io/jq/)


## Introduction

This article builds a deployment that is similar to a cloud service deployment with one Linux VM inside a VNetwork Subnet. It walks through the entire basic deployment imperatively, command by command, until you have a working, secure Linux VM to which you can connect from anywhere on the internet. 

Along the way, you'll understand the dependency hierarchy that the Resource Manager deployment model gives you and how much power it provides. Once you see how the system is built, you can rebuild the system much faster using more direct Azure CLI commands (see [this](virtual-machines-linux-quick-create-cli.md) for roughly the same deployment using the `azure vm quick-create` command), or you can move on to master how to design and automate entire network and application deployments and update them using [Azure Resource Manager templates](../resource-group-authoring-templates.md). Once you see how the parts of your deployment fit together, creating templates to automate them becomes easier.

Let's build a simple network with a VM useful to development and simple compute, and we'll explain it as we go. Then you'll be able to move on to more complex networks and deployments.

## Quick Commands

_The naming in this Quick Commands section has several examples that you would want to replace with your own settings, edit as needed._

```bash
# Create the Resource Group
azure group create TestRG westeurope

# Create the Storage Account
azure storage account create \  
--location westeurope \
--resource-group TestRG \
--type GRS \
computeteststore

# Verify the RG using the JSON parser
azure group show testrg --json | jq '.'

# Create the Virtual Network
azure network vnet create -g TestRG -n TestVNet -a 192.168.0.0/16 -l westeurope

# Verify the RG
azure group show testrg --json | jq '.'

# Create the Subnet
azure network vnet subnet create -g TestRG -e TestVNet -n FrontEnd -a 192.168.1.0/24

# Verify the VNet and Subnet
azure network vnet show testrg testvnet --json | jq '.'

# Create the NIC
azure network nic create -g TestRG -n TestNIC -l westeurope -a 192.168.1.101 -m TestVNet -k FrontEnd

# Verify the NIC
azure network nic show testrg testnic --json | jq '.'

# Create the NSG
azure network nsg create testrg testnsg westeurope

# Add an inbound rule for the NSG
azure network nsg rule create --protocol tcp --direction inbound --priority 1000  --destination-port-range 22 --access allow testrg testnsg testnsgrule

# Creat the Public facing NIC
azure network public-ip create -d testsubdomain testrg testpip westeurope

# Verify the NIC
azure network public-ip show testrg testpip --json | jq '.'

# Associate the Public IP to the NIC
azure network nic set --public-ip-name testpip testrg testnic

# Bind the NSG to the NIC
azure network nic set --network-security-group-name testnsg testrg testnic

# Create the Linux VM
azure vm create \            
    --resource-group testrg \
    --name testvm \
    --location westeurope \
    --os-type linux \
    --nic-name testnic \
    --vnet-name testvnet \
    --vnet-subnet-name FrontEnd \
    --storage-account-name computeteststore \
    --image-urn canonical:UbuntuServer:14.04.3-LTS:latest \
    --ssh-publickey-file ~/.ssh/id_rsa.pub \
    --admin-username ops
    
# Verify everything built
azure vm show testrg testvm 

```


## Detailed Walkthrough

### Create resource group and choose deployment locations 

Azure Resource Groups are logical deployment entities that contain configuration and other metadata to enable logical management of resource deployments.

    azure group create TestRG westeurope                        
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

### Create a storage account 

You're going to need storage accounts for your VM disks and for any addition data disks you want to add, among other scenarios. In short, you're always going to create storage accounts almost immediately after you create resource groups. 

Here we use the `azure storage account create` command, passing the location of the account, the resource group that will control it, and the type of storage support you would like.

    azure storage account create \  
    --location westeurope \
    --resource-group TestRG \
    --type GRS \
    computeteststore
    info:    Executing command storage account create
    + Creating storage account
    info:    storage account create command OK
    rasquill•~/workspace/keygen» azure group show testrg 
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
    
Let's use the [jq](https://stedolan.github.io/jq/) tool (you can use **jsawk** or any language library you prefer to parse the JSON) along with the `--json` Azure CLI option to examine our resource group using the `azure group show` command.

    azure group show testrg --json | jq '.'                                                                                        
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

To investigate the storage account using the CLI, you need to first set the account names and keys using a variation of the following command, replacing the name of this article's storage account with your own.

        AZURE_STORAGE_CONNECTION_STRING="$(azure storage account connectionstring show computeteststore --resource-group testrg --json | jq -r '.string')"

Then you'll be able to view your storage information easily:

        azure storage container list 
        info:    Executing command storage container list
        + Getting storage containers
        data:    Name  Public-Access  Last-Modified
        data:    ----  -------------  -----------------------------
        data:    vhds  Off            Sun, 27 Sep 2015 19:03:54 GMT
        info:    storage container list command OK

### Create your Virtual Network and subnet 

You're going to need to create an Azure Virtual Network and a subnet into which you can install your VM.

    azure network vnet create -g TestRG -n TestVNet -a 192.168.0.0/16 -l westeurope
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

Again, let's see how we're building our resources using the --json option of `azure group show` and **jq**. We now have a `storageAccounts` resource and a `virtualNetworks` resource.  

    azure group show testrg --json | jq '.'
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

Now let's create a subnet in the `TestVnet` virtual network into which the VM will be deployed. We use the `azure network vnet subnet create` command, along wth the resources we've already created: the `TestRG` resource group, the `TestVNet` virtual network, and we'll add the subnet name `FrontEnd` and the subnet address prefix `192.168.1.0/24`, as follows.

    azure network vnet subnet create -g TestRG -e TestVNet -n FrontEnd -a 192.168.1.0/24
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
  
As the subnet is logically inside the virtual network, we'll look for the subnet information with a slightly different command -- `azure network vnet show`, but still examining the JSON output using **jq**.

    azure network vnet show testrg testvnet --json | jq '.'
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

### Create a NIC to use with the Linux VM

Even NICs are programmatically available, as you may apply rules to their use and have more than one. 

        azure network nic create -g TestRG -n TestNIC -l westeurope -a 192.168.1.101 -m TestVNet -k FrontEnd
        info:    Executing command network nic create
        + Looking up the network interface "TestNIC"
        + Looking up the subnet "FrontEnd"
        + Creating network interface "TestNIC"
        + Looking up the network interface "TestNIC"
        data:    Id                              : /subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/TestNIC
        data:    Name                            : TestNIC
        data:    Type                            : Microsoft.Network/networkInterfaces
        data:    Location                        : westeurope
        data:    Provisioning state              : Succeeded
        data:    Enable IP forwarding            : false
        data:    IP configurations:
        data:      Name                          : NIC-config
        data:      Provisioning state            : Succeeded
        data:      Private IP address            : 192.168.1.101
        data:      Private IP Allocation Method  : Static
        data:      Subnet                        : /subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd
        data:
        info:    network nic create command OK

Because the NIC resource is associated with both a VM and a Network Security Group, you can see it as a top-level resource when you examine your `TestRG` resource group:

        azure group show testrg --json | jq '.'
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

You can see the details by examining the resource directly, using the `azure network nic show` command.

        azure network nic show testrg testnic --json | jq '.'
        {
        "ipConfigurations": [
            {
            "loadBalancerBackendAddressPools": [],
            "loadBalancerInboundNatRules": [],
            "privateIpAddress": "192.168.1.101",
            "privateIpAllocationMethod": "Static",
            "subnet": {
                "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd"
            },
            "provisioningState": "Succeeded",
            "name": "NIC-config",
            "etag": "W/\"4d29b1ca-0207-458c-b258-f298e6fc450f\"",
            "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/TestNIC/ipConfigurations/NIC-config"
            }
        ],
        "tags": {},
        "dnsSettings": {
            "appliedDnsServers": [],
            "dnsServers": []
        },
        "enableIPForwarding": false,
        "provisioningState": "Succeeded",
        "etag": "W/\"4d29b1ca-0207-458c-b258-f298e6fc450f\"",
        "id": "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/networkInterfaces/TestNIC",
        "name": "TestNIC",
        "location": "westeurope"
        }

### Create your Network Security Group and rules

Now we create your newtork security group (NSG) and the inbound rules that govern access to the NIC.

        azure network nsg create testrg testnsg westeurope

Let's add the inbound rule for the nsg to allow inbound connections on port 22 (to support SSH):

        azure network nsg rule create --protocol tcp --direction inbound --priority 1000  --destination-port-range 22 --access allow testrg testnsg testnsgrule

> [AZURE.NOTE] The inbound rule is a filter for inbound network connections. In this example, we will bind the NSG to the VMs virtual network interface card (nic), which means that any request to port 22 will be passed through to the nic on our VM. Because this is a rule about a network connection -- and not an endpoint as in classic deployments -- to open a port, you must leave the `--source-port-range` set to '\*' (the default value) in order to accept inbound requests from **any** requesting port, which are typically dynamic. 

### Create your Public IP address (PIP)

Now let's create your public IP address (PIP) that will enable you to connect to your VM from the internet using the `azure network public-ip create` command. Because the  default is a dynamic address, we create a named DNS entry in the **cloudapp.azure.com** domain by using the `-d testsubdomain` option. 

        azure network public-ip create -d testsubdomain testrg testpip westeurope
        info:    Executing command network public-ip create
        + Looking up the public ip "testpip"
        + Creating public ip address "testpip"
        + Looking up the public ip "testpip"
        data:    Id                              : /subscriptions/guid/resourceGroups/testrg/providers/Microsoft.Network/publicIPAddresses/testpip
        data:    Name                            : testpip
        data:    Type                            : Microsoft.Network/publicIPAddresses
        data:    Location                        : westeurope
        data:    Provisioning state              : Succeeded
        data:    Allocation method               : Dynamic
        data:    Idle timeout                    : 4
        data:    Domain name label               : testsubdomain
        data:    FQDN                            : testsubdomain.westeurope.cloudapp.azure.com
        info:    network public-ip create command OK

This is also a top-level resource, so you can see it with `azure group show`.

        azure group show testrg --json | jq '.'
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

And, as always, you can investigate more resource details, including the subdomain fully qualified domain name (FQDN) using the more complete `azure network public-ip show` command. Note that the public IP address resource has been allocated logically, but there is not yet a specific address assigned. For that, you're going to need a VM, which we have not yet created.

        azure network public-ip show testrg testpip --json | jq '.'
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

### Associate the public IP and the network security group to the NIC

        azure network nic set --public-ip-name testpip testrg testnic

Bind the NSG to the NIC: 

        azure network nic set --network-security-group-name testnsg testrg testnic

### Create your Linux VM

You've created the storage and network resources to support an internet accessible VM. Now let's create that VM, and secure it with an ssh key with no password. In this case, we're going to create an Ubuntu VM based on the most recent LTS. We'll locate that image information using `azure vm image list`, as described in [finding Azure VM images](virtual-machines-linux-cli-ps-findimage.md). We seleted an image using the command `azure vm image list westeurope canonical | grep LTS`, and in this case we'll use `canonical:UbuntuServer:14.04.3-LTS:14.04.201509080`, but for the last field we'll pass `latest` so that in the future we always get the most recent build (the string we use will be `canonical:UbuntuServer:14.04.3-LTS:latest`).

> [AZURE.NOTE] This next step is familiar to anyone who has already created an ssh rsa public and private key pair on Linux or Mac using **ssh-keygen -t rsa -b 2048**. If you do not have any certificate key pairs in your `~/.ssh` directory, you can either create them:
<br />
    1. automatically by using the `azure vm create --generate-ssh-keys` option
    2. manually using [the instructions to create them youself](virtual-machines-linux-ssh-from-linux.md)
<br />
Alternatively, you can use the `azure vm create --admin-username --admin-password` options to use the typically less secure username and password method of authenticating your ssh connections once the VM is created. 

We create the VM by bringing all of our resources and information together with the `azure vm create` command.

        azure vm create \            
        --resource-group testrg \
        --name testvm \
        --location westeurope \
        --os-type linux \
        --nic-name testnic \
        --vnet-name testvnet \
        --vnet-subnet-name FrontEnd \
        --storage-account-name computeteststore \
        --image-urn canonical:UbuntuServer:14.04.3-LTS:latest \
        --ssh-publickey-file ~/.ssh/id_rsa.pub \
        --admin-username ops
        info:    Executing command vm create
        + Looking up the VM "testvm"
        info:    Verifying the public key SSH file: /Users/user/.ssh/id_rsa.pub
        info:    Using the VM Size "Standard_A1"
        info:    The [OS, Data] Disk or image configuration requires storage account
        + Looking up the storage account computeteststore
        + Looking up the NIC "testnic"
        info:    Found an existing NIC "testnic"
        info:    Found an IP configuration with virtual network subnet id "/subscriptions/guid/resourceGroups/TestRG/providers/Microsoft.Network/virtualNetworks/TestVNet/subnets/FrontEnd" in the NIC "testnic"
        info:    This NIC IP configuration has a public ip already configured "/subscriptions/guid/resourcegroups/testrg/providers/microsoft.network/publicipaddresses/testpip", any public ip parameters if provided, will be ignored.
        + Creating VM "testvm"
        info:    vm create command OK

Immediately, you can connect to your vm using your default ssh keys.

        ssh ops@testsubdomain.westeurope.cloudapp.azure.com           
        The authenticity of host 'testsubdomain.westeurope.cloudapp.azure.com (XX.XXX.XX.XXX)' can't be established.
        RSA key fingerprint is b6:a4:7g:4b:cb:cd:76:87:63:2d:84:83:ac:12:2d:cd.
        Are you sure you want to continue connecting (yes/no)? yes
        Warning: Permanently added 'testsubdomain.westeurope.cloudapp.azure.com,XX.XXX.XX.XXX' (RSA) to the list of known hosts.
        Welcome to Ubuntu 14.04.3 LTS (GNU/Linux 3.19.0-28-generic x86_64)
        
        * Documentation:  https://help.ubuntu.com/
        
        System information as of Mon Sep 28 18:45:02 UTC 2015
        
        System load: 0.64              Memory usage: 5%   Processes:       81
        Usage of /:  45.3% of 1.94GB   Swap usage:   0%   Users logged in: 0
        
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
        
        ops@testvm:~$

And you can now use the `azure vm show testrg testvm` command to examine what you've created. At this point, you have a running Ubuntu VM in Azure that you can only log into with the ssh key pair that you have; passwords are disabled.

        azure vm show testrg testvm 
        info:    Executing command vm show
        + Looking up the VM "testvm"
        + Looking up the NIC "testnic"
        + Looking up the public ip "testpip"
        data:    Id                              :/subscriptions/guid/resourceGroups/testrg/providers/Microsoft.Compute/virtualMachines/testvm
        data:    ProvisioningState               :Succeeded
        data:    Name                            :testvm
        data:    Location                        :westeurope
        data:    FQDN                            :testsubdomain.westeurope.cloudapp.azure.com
        data:    Type                            :Microsoft.Compute/virtualMachines
        data:
        data:    Hardware Profile:
        data:      Size                          :Standard_A1
        data:
        data:    Storage Profile:
        data:      Image reference:
        data:        Publisher                   :canonical
        data:        Offer                       :UbuntuServer
        data:        Sku                         :14.04.3-LTS
        data:        Version                     :latest
        data:
        data:      OS Disk:
        data:        OSType                      :Linux
        data:        Name                        :cli4eecdddc349d6015-os-1443465824206
        data:        Caching                     :ReadWrite
        data:        CreateOption                :FromImage
        data:        Vhd:
        data:          Uri                       :https://computeteststore.blob.core.windows.net/vhds/cli4eecdddc349d6015-os-1443465824206.vhd
        data:
        data:    OS Profile:
        data:      Computer Name                 :testvm
        data:      User Name                     :ops
        data:      Linux Configuration:
        data:        Disable Password Auth       :true
        data:        SSH Public Keys:
        data:          Public Key #1:
        data:            Path                    :/home/ops/.ssh/authorized_keys
        data:            Key                     :MIIBrTCCAZigAwIBAgIBATALBgkqhkiG9w0BAQUwADAiGA8yMDE1MDkyODE4MzM0
        <snip>
        data:
        data:    Network Profile:
        data:      Network Interfaces:
        data:        Network Interface #1:
        data:          Id                        :/subscriptions/guid/resourceGroups/testrg/providers/Microsoft.Network/networkInterfaces/testnic
        data:          Primary                   :true
        data:          MAC Address               :00-0D-3A-21-8E-AE
        data:          Provisioning State        :Succeeded
        data:          Name                      :testnic
        data:          Location                  :westeurope
        data:            Private IP alloc-method :Dynamic
        data:            Private IP address      :192.168.1.101
        data:            Public IP address       :40.115.48.189
        data:            FQDN                    :testsubdomain.westeurope.cloudapp.azure.com
        data:
        data:    Diagnostics Instance View:
        info:    vm show command OK

### Next steps

Now you're ready to begin with multiple networking components and VMs. 
