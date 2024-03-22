---
title: 'Tutorial: Deploy a virtual machine in Azure public MEC using the Python SDK'
description: This tutorial demonstrates how to use Azure SDK management libraries in a Python script to create a resource group in Azure public multi-access edge compute (MEC) that contains a Linux virtual machine.
author: moushumig
ms.author: moghosal
ms.service: public-multi-access-edge-compute-mec
ms.topic: tutorial
ms.date: 11/22/2022
ms.custom: template-tutorial, devx-track-python, devx-track-azurecli
---

# Tutorial: Deploy a virtual machine in Azure public MEC using the Python SDK

In this tutorial, you use Python SDK to deploy resources in Azure public multi-access edge compute (MEC). The tutorial provides Python code to deploy a virtual machine (VM) and its dependencies in Azure public MEC.

For information about Python SDKs, see [Azure libraries for Python usage patterns](/azure/developer/python/sdk/azure-sdk-library-usage-patterns).

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Install the required Azure library packages
> - Provision a virtual machine
> - Run the script in your development environment
> - Create a jump server in the associated region
> - Access the VMs

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Add an allowlisted subscription to your Azure account, which allows you to deploy resources in Azure public MEC. If you don't have an active allowed subscription, contact the [Azure public MEC product team](https://aka.ms/azurepublicmec).

- Set up Python in your local development environment by following the instructions at [Configure your local Python dev environment for Azure](/azure/developer/python/configure-local-development-environment?tabs=cmd). Ensure you create a service principal for local development, and create and activate a virtual environment for this tutorial project.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Install the required Azure library packages

1. Create a file named *requirements.txt* that lists the management libraries used in this example.

   ```txt
   azure-mgmt-resource
   azure-mgmt-compute
   azure-mgmt-network
   azure-identity
   azure-mgmt-extendedlocation==1.0.0b2
   ```

1. Open a command prompt with the virtual environment activated and install the management libraries listed in requirements.txt.

   ```bash
   pip install -r requirements.txt
   ```

## Provision a virtual machine

1. Create a Python file named *provision_vm_edge.py* and populate it with the following Python script. The script deploys VM and its associated dependency in Azure public MEC. The comments in the script explain the details.

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
   
   # Constants we need in multiple places: the resource group name, the region and the public mec location
   # in which we provision resources. Populate the variables with appropriate values. 
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

   # For details on the previous code, see Example: Use the Azure libraries to provision a resource group
   # at https://learn.microsoft.com/azure/developer/python/azure-sdk-example-resource-group

   # Step 2: Provision a virtual network

   # A virtual machine requires a network interface client (NIC). A NIC requires
   # a virtual network and subnet along with an IP address. Therefore, we must provision
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
   # Only the standard public IP SKU is supported at EdgeZones
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

1. Before you run the script, populate these variables used in the step 1 section of the script:

   | Variable name | Description |
   | ------------- | -------------------- |
   | LOCATION | Azure region associated with the Azure public MEC location |
   | PUBLIC_MEC_LOCATION | Azure public MEC location identifier/edgezone ID |
   | PASSWORD | Password to use to sign in to the VM |

   > [!NOTE]
   > Each Azure public MEC site is associated with an Azure region. Based on the Azure public MEC location where the resource needs to be deployed, select the appropriate region value for the resource group to be created. For more information, see [Key concepts for Azure public MEC](key-concepts.md).

## Run the script in your development environment

1. Run the Python script you copied from the previous section.

   ```python
   python provision_vm_edge.py
   ```

1. Wait a few minutes for the VM and supporting resources to be created.

   The following example output shows the VM create operation was successful.

   ```output
   (.venv) C:\Users >python provision_vm_edge.py
   Provisioning a virtual machine...some operations might take a minute or two.
   Provisioned resource group PythonAzureExample-VM-rg in the <region> region
   Provisioned virtual network python-example-vnet-edge with address prefixes ['10.1.0.0/16']
   Provisioned virtual subnet python-example-subnet-edge with address prefix 10.1.0.0/24
   Provisioned public IP address python-example-ip-edge with address <public ip>
   Provisioned network interface client python-example-nic-edge
   Provisioning virtual machine ExampleVM-edge; this operation might take a few minutes.
   Provisioned virtual machine ExampleVM-edge
   ```

1. In the output from the python-example-ip-edge field, note your own publicIpAddress. Use this address to access the VM in the next section.

## Create a jump server in the associated region

To use SSH to connect to the VM in the Azure public MEC, the best method is to deploy a jump box in an Azure region where your resource group was deployed in the previous section.

1. Follow the steps in [Use the Azure libraries to provision a virtual machine](/azure/developer/python/sdk/examples/azure-sdk-example-virtual-machines).

1. Note your own publicIpAddress in the output from the python-example-ip field of the jump server VM. Use this address to access the VM in the next section.

## Access the VMs

1. Use SSH to connect to the jump box VM you deployed in the region with its IP address you noted previously.

   ```bash
   ssh  azureuser@<python-example-ip>
   ```

1. From the jump box, use SSH to connect to the VM you created in the Azure public MEC with its IP address you noted previously.

   ```bash
   ssh azureuser@<python-example-ip-edge>
   ```

1. Ensure the Azure network security groups allow port 22 access to the VMs you create.

## Clean up resources

In this tutorial, you created a VM in Azure public MEC by using the Python SDK. If you don't expect to need these resources in the future, use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, scale set, and all related resources. Using the `--yes` parameter deletes the resources without a confirmation prompt.

```azurecli
az group delete --name PythonAzureExample-VM-rg --yes
```

## Next steps

For questions about Azure public MEC, contact the product team:

> [!div class="nextstepaction"]
> [Azure public MEC product team](https://aka.ms/azurepublicmec)
