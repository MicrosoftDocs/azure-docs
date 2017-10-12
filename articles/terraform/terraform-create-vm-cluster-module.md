---
title: Use Terraform modules to create a VM cluster on Azure
description: Learn how to use Terraform modules to create a Windows virtual machine cluster in Azure
services: virtual-machines-windows
documentationcenter: virtual-machines
author: 
manager: 
editor: na
tags: azure-resource-manager
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 10/12/2017
ms.author: 
---

# Create a VM cluster with Terraform using the Module Registry

This article walks you through creating a small VM cluster with Terraform using the Azure `compute` module found in the [Terraform Registry](https://registry.terraform.io/modules/Azure/compute/azurerm/1.0.2). In this tutorial you learn how to: 

> [!div class="checklist"]
> * Set up authentication with Azure
> * Create the Terraform template
> * Visualize the changes with plan
> * Apply the configuration to create the VM cluster

For more on Terraform, see the [Terraform documentation](https://www.terraform.io/docs/index.html).

## Set up authentication with Azure

 Review [Install Terraform and configure access to Azure](/azure/virtual-machines/linux/terraform-install-configure) and use the service principal values to populate a new file `azureProviderAndCreds.tf` in an empty directory.

> [!TIP]
> You don't need to perform this step if you [create environment variables](/azure/virtual-machines/linux/terraform-install-configure#set-environment-variables) for these values or run this tutorial in the [Azure Cloud Shell](/azure/cloud-shell/overview).

```tf
variable subscription_id {}
variable tenant_id {}
variable client_id {}
variable client_secret {}

provider "azurerm" {
    subscription_id = "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    tenant_id = "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    client_id = "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    client_secret = "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

## Create the template

Create a new Terraform template named `main.tf` with the following code:

```tf
module mycompute {
    source = "Azure/compute/azurerm"
    resource_group_name = "myResourceGroup"
    location = "East US 2"
    admin_password = "ComplxP@assw0rd!"
    vm_os_simple = "WindowsServer"
    remote_port = "3389"
    nb_instances = 2
    vnet_subnet_id = "${module.network.vnet_subnets[0]}"
}

module "network" {
    source = "Azure/network/azurerm"
    location = "East US 2"
    resource_group_name = "myResourceGroup"
}

output "vm_public_name" {
    value = "${module.mycompute.public_ip_dns_name}"
}

output = "vm_public_ip" {
    value = "${module.mycompute.public_ip_address}"
}

output "vm_private_ips" {
    value = "${module.mycompute.network_interface_private_ip}"
}
```

Run `terraform init` in your configuration directory. You should see output similar to this, with version >=0.10.6 of Terraform:

![Terraform Init](media/terraformInitWithModules.png)

You will see the lines showing the downloads when there is a module you haven't referenced yet or an updated module.

## Visualize the changes with plan

Run `terraform plan` to preview the virtual machine compute infrastructure that will be created with the template.

![Terraform Plan](media/terraformPlanVmsWithModules.png)


## Create the virtual machines with apply

Run `terraform apply` to provision the VMs on Azure:

![Terraform Apply](media/terraformApplyVmsWithModules.png)

## Next steps

- Browse the list of [Azure Terraform modules](https://registry.terraform.io/modules/Azure)
- Create a [virtual machine scale set with Terraform](terraform-create-vm-scaleset-network-disks-hcl)