---
title: Use Ansible to manage a Linux virtual machine in Azure
description: Learn how to use Ansible to manage a Linux virtual machine in Azure
services: ansible
keywords: ansible, azure, devops, bash, cloudshell, playbook, bash
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.date: 08/20/2018
ms.topic: quickstart
---

# Use Ansible to manage a Linux virtual machine in Azure
Ansible allows you to automate the deployment and configuration of resources in your environment. You can use Ansible to manage your Azure virtual machines as you do any other resource. This article shows you how to use an Ansible playbook to start and stop a Linux virtual machine. 

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

- **Configure Azure Cloud Shell** --OR-- **Install and configure Ansible on a Linux virtual machine**

  **Configure Azure Cloud Shell**

  1. **Configure Azure Cloud Shell** - If you are new to Azure Cloud Shell, the article, [Quickstart for Bash in Azure Cloud Shell](/azure/cloud-shell/quickstart), illustrates how to start and configure Cloud Shell. 

  1. **Linux virtual machine** - If you don't have access to a Linux virtual machine, you can [create a virtual machine with Ansible](ansible-create-vm.md).

  **--OR--**

  **Install and configure Ansible on a Linux virtual machine**

  1. **Install Ansible** - Install Ansible on one of the following Linux platforms: [CentOS 7.4](/azure/virtual-machines/linux/ansible-install-configure.md#centos-74), [Ubuntu 16.04 LTS](/azure/virtual-machines/linux/ansible-install-configure.md#ubuntu-1604-lts), or [SLES 12 SP2](/azure/virtual-machines/linux/ansible-install-configure.md#sles-12-sp2)

  1. **Configure Ansible** - [Create Azure credentials and configure Ansible](/azure/virtual-machines/linux/ansible-install-configure.md#create-azure-credentials)

## Use Ansible to deallocate (stop) an Azure virtual machine
This section illustrates how to use Ansible to deallocate (stop) an Azure virtual machine

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Open [Cloud Shell](/azure/cloud-shell/overview).

1. Create a file (to contain your playbook) named `azure_vm_stop.yml`, and open it in the VI editor, as follows:

  ```azurecli-interactive
  vi azure_vm_stop.yml
  ```

1. Enter insert mode by selecting the **I** key.

1. Paste the following sample code into the editor:

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

1. Exit insert mode by selecting the **Esc** key.

1. Save the file and exit the vi editor by entering the following command:

    ```bash
    :wq
    ```

1. Run the sample Ansible playbook.

  ```bash
  ansible-playbook azure_vm_stop.yml
  ```

1. The output looks similar to the following example that shows the virtual machine has been successfully deallocated (stopped):

    ```bash
    PLAY [Stop Azure VM] ********************************************************

    TASK [Gathering Facts] ******************************************************
    ok: [localhost]

    TASK [Deallocate the Virtual Machine] ***************************************
    changed: [localhost]

    PLAY RECAP ******************************************************************
    localhost                  : ok=2    changed=1    unreachable=0    failed=0
    ```

## Use Ansible to start a deallocated (stopped) Azure virtual machine
This section illustrates how to use Ansible to start a deallocated (stopped) Azure virtual machine

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Open [Cloud Shell](/azure/cloud-shell/overview).

1. Create a file (to contain your playbook) named `azure_vm_start.yml`, and open it in the VI editor, as follows:

  ```azurecli-interactive
  vi azure_vm_start.yml
  ```

1. Enter insert mode by selecting the **I** key.

1. Paste the following sample code into the editor:

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

1. Exit insert mode by selecting the **Esc** key.

1. Save the file and exit the vi editor by entering the following command:

    ```bash
    :wq
    ```

1. Run the sample Ansible playbook.

  ```bash
  ansible-playbook azure_vm_start.yml
  ```

1. The output looks similar to the following example that shows the virtual machine has been successfully started:

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
> [!div class="nextstepaction"] 
> [Use Ansible to manage your Azure dynamic inventories](../../ansible/ansible-manage-azure-dynamic-inventories.md)