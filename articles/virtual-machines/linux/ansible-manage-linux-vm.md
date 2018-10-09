---
title: Use Ansible to manage a Linux virtual machine in Azure
description: Learn how to use Ansible to manage a Linux virtual machine in Azure
ms.service: ansible
keywords: ansible, azure, devops, bash, cloudshell, playbook, bash
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: quickstart
ms.date: 09/27/2018
---

# Use Ansible to manage a Linux virtual machine in Azure
Ansible allows you to automate the deployment and configuration of resources in your environment. You can use Ansible to manage your Azure virtual machines as you do any other resource. This article shows you how to use an Ansible playbook to start and stop a Linux virtual machine. 

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]

## Use Ansible to deallocate (stop) an Azure virtual machine
This section illustrates how to use Ansible to deallocate (stop) an Azure virtual machine

1.  Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1.  Open [Cloud Shell](/azure/cloud-shell/overview).

1.  Create a file (to contain your playbook) named `azure-vm-stop.yml`, and open it in the VI editor, as follows:

    ```azurecli-interactive
    vi azure-vm-stop.yml
    ```

1.  Enter insert mode by selecting the **I** key.

1.  Paste the following sample code into the editor:

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

1.  Exit insert mode by selecting the **Esc** key.

1.  Save the file and exit the vi editor by entering the following command:

    ```bash
    :wq
    ```

1.  Run the sample Ansible playbook.

    ```bash
    ansible-playbook azure-vm-stop.yml
    ```

1.  The output looks similar to the following example that shows the virtual machine has been successfully deallocated (stopped):

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

1.  Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1.  Open [Cloud Shell](/azure/cloud-shell/overview).

1.  Create a file (to contain your playbook) named `azure-vm-start.yml`, and open it in the VI editor, as follows:

    ```azurecli-interactive
    vi azure-vm-start.yml
    ```

1.  Enter insert mode by selecting the **I** key.

1.  Paste the following sample code into the editor:

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

1.  Exit insert mode by selecting the **Esc** key.

1.  Save the file and exit the vi editor by entering the following command:

    ```bash
    :wq
    ```

1.  Run the sample Ansible playbook.

    ```bash
    ansible-playbook azure-vm-start.yml
    ```

1.  The output looks similar to the following example that shows the virtual machine has been successfully started:

    ```bash
    PLAY [Start Azure VM] ********************************************************

    TASK [Gathering Facts] ******************************************************
    ok: [localhost]

    TASK [Start the Virtual Machine] ********************************************
    changed: [localhost]

    PLAY RECAP ******************************************************************
    localhost                  : ok=2    changed=1    unreachable=0    failed=0
    ```

## Next steps
> [!div class="nextstepaction"] 
> [Use Ansible to manage your Azure dynamic inventories](/articles/ansible/ansible-manage-azure-dynamic-inventories)