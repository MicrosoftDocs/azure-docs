---
title: Use Ansible to manage a Linux VM in Azure | Microsoft Docs
description: Learn how to use Ansible to manage a Linux virtual machine environment in Azure
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: na
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 08/10/2018
ms.author: cynthn
---

# Manage a Linux virtual machine environment in Azure with Ansible
Ansible allows you to automate the deployment and configuration of resources in your environment. You can use Ansible to manage your virtual machines (VMs) in Azure, the same as you would any other resource. This article shows you how to manage (e.g. start or stop) a Linux virtual machine. If you don't have a Linux virtual machine yet, you can also learn how to [Create a VM with Ansible](ansible-create-vm.md).

## Prerequisites
To manage Azure resources with Ansible, you need the following:

- Ansible and the Azure Python SDK modules installed on your host system.
    - Install Ansible on [CentOS 7.4](ansible-install-configure.md#centos-74), [Ubuntu 16.04 LTS](ansible-install-configure.md#ubuntu-1604-lts), and [SLES 12 SP2](ansible-install-configure.md#sles-12-sp2)
    - You can also use the [Azure Cloud Shell](/azure/cloud-shell/quickstart) from your web browser. It pre-installed Ansible. 
- Azure credentials, and Ansible configured to use them.
    - [Create Azure credentials and configure Ansible](ansible-install-configure.md#create-azure-credentials)

## Stop created virtual machine
Ansible allows you to stop virtual machines which are in running state. The following playbook deallocates(stops) a running virtual machine.

```yaml
- name: Stop Azure VM
  hosts: localhost
  connection: local
  tasks:
  - name: Deallocate the virtual machine
    azure_rm_virtualmachine:
        resource_group: myResourceGroup
        name: myVM
        allocated: no 
```

To stop the running virtual machine with Ansible, save the preceding playbook as `azure_vm_stop.yml` and run it as follows:

```bash
ansible-playbook azure_vm_stop.yml
```

The output looks similar to the following example that shows the virtual machine has been successfully stopped:

```bash
PLAY [Stop Azure VM] ********************************************************

TASK [Gathering Facts] ******************************************************
ok: [localhost]

TASK [Deallocate the Virtual Machine] ***************************************
changed: [localhost]

PLAY RECAP ******************************************************************
localhost                  : ok=2    changed=1    unreachable=0    failed=0
```

## Start the stopped virtual machine

Ansible allows you to start the deallocated(stopped) virtual machine. The following playbook starts a stopped virtual machine.

```yaml
- name: Start Azure VM
  hosts: localhost
  connection: local
  tasks:
  - name: Start the virtual machine
    azure_rm_virtualmachine:
        resource_group: myResourceGroup
        name: myVM
```
To start the stopped virtual machine with Ansible, save the preceding playbook as `azure_vm_start.yml` and run it as follows:

```bash
ansible-playbook azure_vm_start.yml
```

The output looks similar to the following example that shows the virtual machine has been successfully started:

```bash
PLAY [Stop Azure VM] ********************************************************

TASK [Gathering Facts] ******************************************************
ok: [localhost]

TASK [Start the Virtual Machine] ********************************************
changed: [localhost]

PLAY RECAP ******************************************************************
localhost                  : ok=2    changed=1    unreachable=0    failed=0
```

## Next steps
This example starts or stops a Linux virtual machine. For how to create a virtual machine which permists SSH, see [Create a VM](ansible-create-vm.md). And if you want to use Ansible inventory to identify and tag your virtual machine and install software package on the tagged virtual machine, see [Use Ansible to manage your Azure dynamic inventories](../../ansible/ansible-manage-azure-dynamic-inventories.md).
