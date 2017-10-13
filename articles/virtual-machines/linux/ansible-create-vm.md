---
title: Use Ansible to create a basic Linux VM in Azure | Microsoft Docs
description: Learn how to use Ansible to create and manage a basic Linux virtual machine in Azure
services: virtual-machines-linux
documentationcenter: virtual-machines
author: iainfoulds
manager: timlt
editor: na
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/25/2017
ms.author: iainfou
---

# Create a basic virtual machine in Azure with Ansible
Ansible allows you to automate the deployment and configuration of resources in your environment. You can use Ansible to manage your virtual machines (VMs) in Azure, the same as you would any other resource. This article shows you how to create a basic VM with Ansible. You can also learn how to [Create a complete VM environment with Ansible](ansible-create-complete-vm.md).


## Prerequisites
To manage Azure resources with Ansible, you need the following:

- Ansible and the Azure Python SDK modules installed on your host system.
    - Install Ansible on [Ubuntu 16.04 LTS](ansible-install-configure.md#ubuntu-1604-lts), [CentOS 7.3](ansible-install-configure.md#centos-73), and [SLES 12.2 SP2](ansible-install-configure.md#sles-122-sp2)
- Azure credentials, and Ansible configured to use them.
    - [Create Azure credentials and configure Ansible](ansible-install-configure.md#create-azure-credentials)
- Azure CLI version 2.0.4 or later. Run `az --version` to find the version. 
    - If you need to upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). You can also use [Cloud Shell](/azure/cloud-shell/quickstart) from your browser.


## Create supporting Azure resources
In this example, we create a runbook that deploys a VM into an existing infrastructure. First, create resource group with [az group create](/cli/azure/vm#create). The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli
az group create --name myResourceGroup --location eastus
```

Create a virtual network for your VM with [az network vnet create](/cli/azure/network/vnet#create). The following example creates a virtual network named *myVnet* and a subnet named *mySubnet*:

```azurecli
az network vnet create \
  --resource-group myResourceGroup \
  --name myVnet \
  --address-prefix 10.0.0.0/16 \
  --subnet-name mySubnet \
  --subnet-prefix 10.0.1.0/24
```


## Create and run Ansible playbook
Create an Ansible playbook named **azure_create_vm.yml** and paste the following contents. This example creates a single VM and configures SSH credentials. Enter your own public key data in the *key_data* pair as follows:

```yaml
- name: Create Azure VM
  hosts: localhost
  connection: local
  tasks:
  - name: Create VM
    azure_rm_virtualmachine:
      resource_group: myResourceGroup
      name: myVM
      vm_size: Standard_DS1_v2
      admin_username: azureuser
      ssh_password_enabled: false
      ssh_public_keys: 
        - path: /home/azureuser/.ssh/authorized_keys
          key_data: "ssh-rsa AAAAB3Nz{snip}hwhqT9h"
      image:
        offer: CentOS
        publisher: OpenLogic
        sku: '7.3'
        version: latest
```

To create the VM with Ansible, run the playbook as follows:

```bash
ansible-playbook azure_create_vm.yml
```

The output looks similar to the following example that shows the VM has been successfully created:

```bash
PLAY [Create Azure VM] ****************************************************

TASK [Gathering Facts] ****************************************************
ok: [localhost]

TASK [Create VM] **********************************************************
changed: [localhost]

PLAY RECAP ****************************************************************
localhost                  : ok=2    changed=1    unreachable=0    failed=0
```


## Next steps
This example creates a VM in an existing resource group and with a virtual network already deployed. For a more detailed example on how to use Ansible to create supporting resources such as a virtual network and Network Security Group rules, see [Create a complete VM environment with Ansible](ansible-create-complete-vm.md).