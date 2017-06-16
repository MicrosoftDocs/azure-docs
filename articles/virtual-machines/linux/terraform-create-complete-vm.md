---
title: Create Basic Infrastructure in Azure using Terraform | Microsoft Docs
description: Learn how to create Azure resources using Terraform
services: virtual-machines-linux
documentationcenter: virtual-machines
author: echuvyrov
manager: jtalkar
editor: na
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 06/14/2017
ms.author: echuvyrov
---

# Create Basic Infrastructure in Azure using Terraform
This article details the necessary steps to provision virtual machine, together with underlying infrastructure, into Azure. You will learn how to author Terraform scripts and how to visualize the changes before you make them in your cloud infrastructure. You will also learn how to create infrastructure in Azure using Terraform.

To get started, in your text editor of choice (Visual Studio Code/Sublime/Vim/etc), create a file called _terraform_azure101.tf_. The exact name of the file is not important, since terraform accepts the folder name as a parameter - all scripts in the folder get executed. Paste the following code in that new file:

~~~~
# Configure the Microsoft Azure Provider
# NOTE: if you defined these values as environment variables, you do not have to include this block
provider "azurerm" {
  subscription_id = "your_subscription_id_from_script_execution"
  client_id       = "your_client_id_from_script_execution"
  client_secret   = "your_client_secret_from_script_execution"
  tenant_id       = "your_tenant_id_from_script_execution"
}

# create a resource group 
resource "azurerm_resource_group" "helloterraform" {
    name = "terraformtest"
    location = "West US"
}
~~~~
In the "provider" section of the script, you tell Terraform to use an Azure provider to provision resources in the script. Refer to the [installing and configuring Terraform](terraform-install-configure.md) guide to get values for subscription_id, client_id, client_secret and tenant_id. Also note that if you have created environment variables for the values in this block, you do not need to include it. 

The "azure_rm_resource_group" resource instructs Terraform to create a new resource group. You will see more resource types available in Terraform below.

## Executing the Script
With the script saved, exit to the console/command line and type
```
terraform plan terraformscripts
```
In the above, we assume "terraformscripts" is the folder where the script was saved. We used the "plan" Terraform command, which looks at the resources defined in the scripts, compares them to the state information saved by Terraform and then outputs planned execution _without_ actually creating resources in Azure. 

You should see something like the following screen after you execute the command above

![Image of Terraform Plan](media/terraform/tf_plan2.png)

Everything looks correct, go ahead and provision this new resource group in Azure by executing 
```
terraform apply terraformscripts
```
If you look in the Azure portal now, you should see the new empty resource group called "terraformtest." In the section below, you will add a Virtual Machine and all the supporting infrastructure for that virtual machine to that resource group.

## Provisioning Ubuntu VM with Terraform
Let's extend Terraform script we've created above with details necessary to provision a virtual machine running Ubuntu. The list of resources that you will provision in the sections below are: network with a single subnet, a network interface card, a storage account with a storage container, a public IP and a virtual machine utilizing all the resources above. For a thorough documentation of each of the Azure Terraform resources, consult [Terraform documentation](https://www.terraform.io/docs/providers/azurerm/index.html).

The full version of the [provisioning script](#terraform101) is also provided for convenience.

### Extending the Terraform Script
Extend the script created above with the following resources. 
~~~~
# create a virtual network
resource "azurerm_virtual_network" "helloterraformnetwork" {
    name = "acctvn"
    address_space = ["10.0.0.0/16"]
    location = "West US"
    resource_group_name = "${azurerm_resource_group.helloterraform.name}"
}

# create subnet
resource "azurerm_subnet" "helloterraformsubnet" {
    name = "acctsub"
    resource_group_name = "${azurerm_resource_group.helloterraform.name}"
    virtual_network_name = "${azurerm_virtual_network.helloterraformnetwork.name}"
    address_prefix = "10.0.2.0/24"
}
~~~~
The script above creates a virtual network and a subnet within that virtual network. Note the reference to the resource group you have created already via the "${azurerm_resource_group.helloterraform.name}" both in the virtual network and subnet definition.

~~~~
# create public IP
resource "azurerm_public_ip" "helloterraformips" {
    name = "terraformtestip"
    location = "West US"
    resource_group_name = "${azurerm_resource_group.helloterraform.name}"
    public_ip_address_allocation = "dynamic"

    tags {
        environment = "TerraformDemo"
    }
}

# create network interface
resource "azurerm_network_interface" "helloterraformnic" {
    name = "tfni"
    location = "West US"
    resource_group_name = "${azurerm_resource_group.helloterraform.name}"

    ip_configuration {
        name = "testconfiguration1"
        subnet_id = "${azurerm_subnet.helloterraformsubnet.id}"
        private_ip_address_allocation = "static"
        private_ip_address = "10.0.2.5"
        public_ip_address_id = "${azurerm_public_ip.helloterraformips.id}"
    }
}
~~~~
Script snippets above create a public IP and a network interface that makes use of the public IP created. Note the references to subnet_id and public_ip_address_id. Terraform has built-in intelligence to understand that network interface has a dependency on the resources that need to be created before the creation of the network interface.

~~~~
# create storage account
resource "azurerm_storage_account" "helloterraformstorage" {
    name = "helloterraformstorage"
    resource_group_name = "${azurerm_resource_group.helloterraform.name}"
    location = "westus"
    account_type = "Standard_LRS"

    tags {
        environment = "staging"
    }
}

# create storage container
resource "azurerm_storage_container" "helloterraformstoragestoragecontainer" {
    name = "vhd"
    resource_group_name = "${azurerm_resource_group.helloterraform.name}"
    storage_account_name = "${azurerm_storage_account.helloterraformstorage.name}"
    container_access_type = "private"
    depends_on = ["azurerm_storage_account.helloterraformstorage"]
}
~~~~
Here, you created a storage account and defined a storage container within that storage account - this is where you store VHDs for the virtual machine about to be created.

~~~~
# create virtual machine
resource "azurerm_virtual_machine" "helloterraformvm" {
    name = "terraformvm"
    location = "West US"
    resource_group_name = "${azurerm_resource_group.helloterraform.name}"
    network_interface_ids = ["${azurerm_network_interface.helloterraformnic.id}"]
    vm_size = "Standard_A0"

    storage_image_reference {
        publisher = "Canonical"
        offer = "UbuntuServer"
        sku = "14.04.2-LTS"
        version = "latest"
    }

    storage_os_disk {
        name = "myosdisk"
        vhd_uri = "${azurerm_storage_account.helloterraformstorage.primary_blob_endpoint}${azurerm_storage_container.helloterraformstoragestoragecontainer.name}/myosdisk.vhd"
        caching = "ReadWrite"
        create_option = "FromImage"
    }

    os_profile {
        computer_name = "hostname"
        admin_username = "testadmin"
        admin_password = "Password1234!"
    }

    os_profile_linux_config {
        disable_password_authentication = false
    }

    tags {
        environment = "staging"
    }
}
~~~~
Finally, the snippet above creates a virtual machine that utilizes all the resources we have provisioned already: storage account and container for a virtual hard disk (VHD), network interface with public IP and subnet specified, as well as the resource group you have already created. Note the vm_size property, where the script specifies an Azure A0 SKU.

### Executing the Script
With the full script saved, exit to the console/command line and type
```
terraform apply terraformscripts
```
After some time, you should see the resources, including a virtual machine, appearing in the "terraformtest" resource group in the Azure portal.

## <a name="terraform101"></a>Complete Terraform Script

```
variable "resourcesname" {
  default = "helloterraform"
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  subscription_id = "XXX"
  client_id       = "XXX"
  client_secret   = "XXX"
  tenant_id       = "XXX"
}

# create a resource group if it doesn't exist
resource "azurerm_resource_group" "helloterraform" {
    name = "terraformtest"
    location = "West US"
}

# create virtual network
resource "azurerm_virtual_network" "helloterraformnetwork" {
    name = "tfvn"
    address_space = ["10.0.0.0/16"]
    location = "West US"
    resource_group_name = "${azurerm_resource_group.helloterraform.name}"
}

# create subnet
resource "azurerm_subnet" "helloterraformsubnet" {
    name = "tfsub"
    resource_group_name = "${azurerm_resource_group.helloterraform.name}"
    virtual_network_name = "${azurerm_virtual_network.helloterraformnetwork.name}"
    address_prefix = "10.0.2.0/24"
}


# create public IPs
resource "azurerm_public_ip" "helloterraformips" {
    name = "terraformtestip"
    location = "West US"
    resource_group_name = "${azurerm_resource_group.helloterraform.name}"
    public_ip_address_allocation = "dynamic"

    tags {
        environment = "TerraformDemo"
    }
}

# create network interface
resource "azurerm_network_interface" "helloterraformnic" {
    name = "tfni"
    location = "West US"
    resource_group_name = "${azurerm_resource_group.helloterraform.name}"

    ip_configuration {
        name = "testconfiguration1"
        subnet_id = "${azurerm_subnet.helloterraformsubnet.id}"
        private_ip_address_allocation = "static"
        private_ip_address = "10.0.2.5"
        public_ip_address_id = "${azurerm_public_ip.helloterraformips.id}"
    }
}

# create storage account
resource "azurerm_storage_account" "helloterraformstorage" {
    name = "helloterraformstorage"
    resource_group_name = "${azurerm_resource_group.helloterraform.name}"
    location = "westus"
    account_type = "Standard_LRS"

    tags {
        environment = "staging"
    }
}

# create storage container
resource "azurerm_storage_container" "helloterraformstoragestoragecontainer" {
    name = "vhd"
    resource_group_name = "${azurerm_resource_group.helloterraform.name}"
    storage_account_name = "${azurerm_storage_account.helloterraformstorage.name}"
    container_access_type = "private"
    depends_on = ["azurerm_storage_account.helloterraformstorage"]
}

# create virtual machine
resource "azurerm_virtual_machine" "helloterraformvm" {
    name = "terraformvm"
    location = "West US"
    resource_group_name = "${azurerm_resource_group.helloterraform.name}"
    network_interface_ids = ["${azurerm_network_interface.helloterraformnic.id}"]
    vm_size = "Standard_A0"

    storage_image_reference {
        publisher = "Canonical"
        offer = "UbuntuServer"
        sku = "14.04.2-LTS"
        version = "latest"
    }

    storage_os_disk {
        name = "myosdisk"
        vhd_uri = "${azurerm_storage_account.helloterraformstorage.primary_blob_endpoint}${azurerm_storage_container.helloterraformstoragestoragecontainer.name}/myosdisk.vhd"
        caching = "ReadWrite"
        create_option = "FromImage"
    }

    os_profile {
        computer_name = "hostname"
        admin_username = "testadmin"
        admin_password = "Password1234!"
    }

    os_profile_linux_config {
        disable_password_authentication = false
    }

    tags {
        environment = "staging"
    }
}
```

## Next steps
You have created basic infrastructure in Azure using Terraform. For more complex scenarios, including examples on using load balancers, VM Scale Sets, take a look at numerous [Terraform examples for Azure](https://github.com/hashicorp/terraform/tree/master/examples). [Terraform docs](https://www.terraform.io/docs/providers/azurerm/index.html) have a full up-to-date list of supported Azure providers.