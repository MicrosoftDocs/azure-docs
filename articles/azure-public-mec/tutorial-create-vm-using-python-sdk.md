---
title: Deployment of virtual machine on Azure public MEC using Python SDK #Required; page title is displayed in search results. Include the brand.
description: This article demonstrates how to use the Azure SDK management libraries in a Python script to create a resource group that contains a Linux virtual machine. #Required; article description that is displayed in search results. 
author: vsmsft #Required; your GitHub user alias, with correct capitalization.
ms.author: vivekshah #Required; microsoft alias of author; optional team alias.
ms.service: #Required; service per approved list. slug assigned by ACOM.
ms.topic: tutorial #Required; leave this attribute/value as-is.
ms.date: 02/15/2022 #Required; mm/dd/yyyy format.
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
---

# Tutorial: Deployment of virtual machine on Azure public MEC using Python SDK

This article will focus on using the Python SDK to deploy resources in Azure public multi-access compute (MEC). This article will provide python code to deploy a Virtual Machine in Azure public MEC.

## Prerequisites

Azure account with a whitelisted subscription, which allows you to deploy resources in Azure public MEC. If you don’t have an active whitelisted subscription, please contact [<service> Azure public MEC product team](http://aka.ms/azurepublicmec).

## 1. Set up your local development environment

Follow all the instructions on [<service> Configure your local Python dev environment for Azure](https://docs.microsoft.com/en-us/azure/developer/python/configure-local-development-environment?tabs=cmd).

Be sure to create a service principal for local development, and create and activate a virtual environment for this project.

## 2. Install the needed Azure library packages

1. Create a *requirements.txt* file that lists the management libraries used in this example:

```txt
azure-mgmt-resource
azure-mgmt-compute
azure-mgmt-network
azure-identity
azure-mgmt-extendedlocation==1.0.0b2
```

2. In your terminal or command prompt with the virtual environment activated, install the management libraries listed in *requirements.txt*:

```cmd
pip install -r requirements.txt
```

## 3. Write code to provision a virtual machine

Create a Python file named *provision_vm_edge.py* with the following code. It will deploy VM and its associated dependency in Azure Public MEC. The comments in the script explain the details. Please remember to populate the variables with appropriate values.

> [!NOTE]
> Each Azure public MEC site is associated to an Azure Region. Based on the Azure public MEC location where the resource needs to be deployed, select the appropriate region value for the resource group to be created. The mapping can be obtained [<service> here](http://aka.ms/azurepublicmec).

```Python
# Import the needed credential and management objects from the libraries.
from azure.identity import AzureCliCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.network import NetworkManagementClient
from azure.mgmt.compute import ComputeManagementClient
import os

print(f"Provisioning a virtual machine...some operations might take a minute or two.")

# Acquire a credential object using CLI-based authentication.
credential = AzureCliCredential()

# Retrieve subscription ID from environment variable.
subscription_id = os.environ["AZURE_SUBSCRIPTION_ID"]


# Step 1: Provision a resource group

# Obtain the management object for resources, using the credentials from the CLI login.
resource_client = ResourceManagementClient(credential, subscription_id)

# Constants we need in multiple places: the resource group name,the region and the public mec location
# in which we provision resources. Please populate the variables with appropriate values. 
RESOURCE_GROUP_NAME = "PythonAzureExample-VM-rg"
LOCATION = "<region>"
PUBLIC_MEC_LOCATION = "<edgezone id>"
USERNAME = "azureuser"
PASSWORD = "<password>"
# Provision the resource group.
rg_result = resource_client.resource_groups.create_or_update(RESOURCE_GROUP_NAME,
    {
        "location": LOCATION
    }
)


print(f"Provisioned resource group {rg_result.name} in the {rg_result.location} region")

# For details on the previous code, see Example: Provision a resource group
# at https://docs.microsoft.com/azure/developer/python/azure-sdk-example-resource-group


# Step 2: provision a virtual network

# A virtual machine requires a network interface client (NIC). A NIC requires
# a virtual network and subnet along with an IP address. Therefore we must provision
# these downstream components first, then provision the NIC, after which we
# can provision the VM.

# Network and IP address names
VNET_NAME = "python-example-vnet-edge"
SUBNET_NAME = "python-example-subnet-edge"
IP_NAME = "python-example-ip-edge"
IP_CONFIG_NAME = "python-example-ip-config-edge"
NIC_NAME = "python-example-nic-edge"

# Obtain the management object for networks
network_client = NetworkManagementClient(credential, subscription_id)

# Provision the virtual network and wait for completion
poller = network_client.virtual_networks.begin_create_or_update(RESOURCE_GROUP_NAME,
    VNET_NAME,
    {
        "location": LOCATION,
        "extendedLocation": {"type": "EdgeZone", "name": PUBLIC_MEC_LOCATION},
        "address_space": {
            "address_prefixes": ["10.1.0.0/16"]
        }
    }
)

vnet_result = poller.result()

print(f"Provisioned virtual network {vnet_result.name} with address prefixes {vnet_result.address_space.address_prefixes}")

# Step 3: Provision the subnet and wait for completion
poller = network_client.subnets.begin_create_or_update(RESOURCE_GROUP_NAME, 
    VNET_NAME, SUBNET_NAME,
    { "address_prefix": "10.1.0.0/24" }
)
subnet_result = poller.result()

print(f"Provisioned virtual subnet {subnet_result.name} with address prefix {subnet_result.address_prefix}")

# Step 4: Provision an IP address and wait for completion
# only standard public IP SKU is supported at EdgeZones
poller = network_client.public_ip_addresses.begin_create_or_update(RESOURCE_GROUP_NAME,
    IP_NAME,
    {
        "location": LOCATION,
        "extendedLocation": {"type": "EdgeZone", "name": PUBLIC_MEC_LOCATION},
        "sku": { "name": "Standard" },
        "public_ip_allocation_method": "Static",
        "public_ip_address_version" : "IPV4"
    }
)

ip_address_result = poller.result()

print(f"Provisioned public IP address {ip_address_result.name} with address {ip_address_result.ip_address}")

# Step 5: Provision the network interface client
poller = network_client.network_interfaces.begin_create_or_update(RESOURCE_GROUP_NAME,
    NIC_NAME, 
    {
        "location": LOCATION,
        "extendedLocation": {"type": "EdgeZone", "name": PUBLIC_MEC_LOCATION},
        "ip_configurations": [ {
            "name": IP_CONFIG_NAME,
            "subnet": { "id": subnet_result.id },
            "public_ip_address": {"id": ip_address_result.id }
        }]
    }
)

nic_result = poller.result()

print(f"Provisioned network interface client {nic_result.name}")

# Step 6: Provision the virtual machine

# Obtain the management object for virtual machines
compute_client = ComputeManagementClient(credential, subscription_id)

VM_NAME = "ExampleVM-edge"

print(f"Provisioning virtual machine {VM_NAME}; this operation might take a few minutes.")

# Provision the VM specifying only minimal arguments, which defaults to an Ubuntu 18.04 VM
# on a Standard DSv2-series with a public IP address and a default virtual network/subnet.

poller = compute_client.virtual_machines.begin_create_or_update(RESOURCE_GROUP_NAME, VM_NAME,
    {
        "location": LOCATION,
        "extendedLocation": {"type": "EdgeZone", "name": PUBLIC_MEC_LOCATION},
        "storage_profile": {
            "image_reference": {
                "publisher": 'Canonical',
                "offer": "UbuntuServer",
                "sku": "18.04-LTS",
                "version": "latest"
            }
        },
        "hardware_profile": {
            "vm_size": "Standard_DS2_v2"
        },
        "os_profile": {
            "computer_name": VM_NAME,
            "admin_username": USERNAME,
            "admin_password": PASSWORD
        },
        "network_profile": {
            "network_interfaces": [{
                "id": nic_result.id,
            }]
        }
    }
)

vm_result = poller.result()

print(f"Provisioned virtual machine {vm_result.name}")

```

## 4. Run the script

```cmd
python provision_vm_edge.py
```

It takes a few minutes to create the VM and supporting resources. The following example output shows the VM create operation was successful.

```txt
(.venv) C:\>python provision_vm_edge.py
Provisioning a virtual machine...some operations might take a minute or two.
Provisioned resource group PythonAzureExample-VM-rg in the <region> region
Provisioned virtual network python-example-vnet-edge with address prefixes ['10.1.0.0/16']
Provisioned virtual subnet python-example-subnet-edge with address prefix 10.1.0.0/24
Provisioned public IP address python-example-ip-edge with address <public ip>
Provisioned network interface client python-example-nic-edge
Provisioning virtual machine ExampleVM-edge; this operation might take a few minutes.
Provisioned virtual machine ExampleVM-edge
```

Note your own publicIpAddress in the output from python-example-ip-edge field. This address is used to access the VM in the next steps.

## 5. Creating Jump server in the associated region

To SSH into the Virtual Machine in the Azure public MEC, we recommend deploying a jump box in an Azure region where your resource group is deployed in step 4. You can follow the steps to [<service> create a Virtual Machine in a region](https://docs.microsoft.com/en-us/azure/developer/python/azure-sdk-example-virtual-machines?tabs=cmd).

Note your own publicIpAddress in the output from python-example-ip field. This address is used to access the VM in the next steps.

## 5. Accessing the VM’s

SSH to the Jump box Virtual Machine deployed in the region using the IP address noted in step 5.

```txt
ssh  azureuser@<python-example-ip>
```

From the jump box you can then SSH to the Virtual Machine created in the Azure public MEC using the IP address noted in step 4.

```txt
ssh  azureuser@<python-example-ip-edge>
```

> [!NOTE]
> Please make sure NSG are open to allow port 22 access to respective VM’s.

## 6. Clean up resources

When no longer needed, you can use the az group delete command to remove the resource group, VM, and all related resources.

```azurecli
az group delete --name PythonAzureExample-VM-rg
```
## References 

[<service> Usage patterns with the Azure libraries for Python](https://docs.microsoft.com/en-us/azure/developer/python/azure-sdk-library-usage-patterns?tabs=pip).