---
title: Connect virtual networks with virtual network peering using Ansible
description: Learn how to use Ansible to connect virtual networks with virtual network peering using Ansible
ms.service: azure
keywords: ansible, azure, devops, bash, playbook, networking, peering
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 04/04/2019
---

# Manage Azure Virtual Network Peering using Ansible

[!INCLUDE [Ansible 2.8 note](../../includes/ansible-28-note.md)]

[Virtual network peering](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-peering-overview) allows you to seamlessly connect two Azure virtual networks. Once peered, the two virtual networks appear as one for connectivity purposes. 

Similar to how traffic is routed between virtual machines in the same virtual network through private IP addresses, traffic between virtual machines in the peered virtual networks is routed through the Microsoft backbone infrastructure. As a result, VMs in different virtual networks can communicate with each other.

Ansible enables you to automate the deployment and configuration of resources in your environment. This article walks you through how to connect virtual networks to each other with Azure virtual network peering using Ansible.

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]

> [!Note]
> Ansible 2.8 is required to run the [sample playbook](https://github.com/Azure-Samples/ansible-playbooks/blob/master/vnet_peering.yml) in this tutorial.

## Create two resource groups

A resource group is a logical container in which Azure resources are deployed and managed.

The first two tasks in the sample Ansible playbook create two resource groups.

```yaml
  - name: Create a resource group
    azure_rm_resourcegroup:
      name: "{{ resource_group }}"
      location: "{{ location }}"
  - name: Create secondary resource group
    azure_rm_resourcegroup:
      name: "{{ resource_group_secondary }}"
      location: "{{ location }}"
```

## Create first virtual network and add a subnet in first resource group

The next tasks create virtual network 1 in the first resource group and add a subnet

```yml
  - name: Create first virtual network
    azure_rm_virtualnetwork:
      resource_group: "{{ resource_group }}"
      name: "{{ vnet_name1 }}"
      address_prefixes: "10.0.0.0/16"
  - name: Add subnet
    azure_rm_subnet:
      resource_group: "{{ resource_group }}"
      name: "{{ vnet_name1 }}"
      address_prefix: "10.0.0.0/24"
      virtual_network: "{{ vnet_name1 }}"
```

## Create second virtual network and add a subnet in the second resource group

We need to do the same for the second resource group. The next tasks create the virtual network 2 and add a subnet:

```yml
  - name: Ceate second virtual network
    azure_rm_virtualnetwork:
      resource_group: "{{ resource_group_secondary }}"
      name: "{{ vnet_name2 }}"
      address_prefixes: "10.1.0.0/16"
  - name: Add subnet
    azure_rm_subnet:
      resource_group: "{{ resource_group }}"
      name: "{{ vnet_name2 }}"
      address_prefix: "10.1.0.0/24"
      virtual_network: "{{ vnet_name2 }}"
```

## Peer these two virtual networks

The next tasks establish peering between these two virtual network IDs.

```yml
  - name: Initial vnet peering
    azure_rm_virtualnetworkpeering:
      resource_group: "{{ resource_group }}"
      name: "{{ peering_name }}"
      virtual_network: "{{ vnet_name1 }}"
      remote_virtual_network:
        resource_group: "{{ resource_group_secondary }}"
        name: "{{ vnet_name2 }}"
      allow_virtual_network_access: true
      allow_forwarded_traffic: true

  - name: Connect vnet peering
    azure_rm_virtualnetworkpeering:
      resource_group: "{{ resource_group_secondary }}"
      name: "{{ peering_name }}"
      virtual_network: "{{ vnet_name2 }}"
      remote_virtual_network:
        resource_group: "{{ resource_group }}"
        name: "{{ vnet_name1 }}"
      allow_virtual_network_access: true
      allow_forwarded_traffic: true
```

## Delete the VNet peering

To delete the Virtual Network peering, run the task:

```yaml
  - name: Delete vnet peering
    azure_rm_virtualnetworkpeering:
      resource_group: "{{ resource_group }}"
      name: "{{ peering_name }}"
      virtual_network: "{{ vnet_name1 }}"
```

## Complete sample Ansible playbook

Here is the complete playbook you have built over the course of this article.

```yml
- hosts: localhost
  tasks:
    - name: Prepare random postfix
      set_fact:
        rpfx: "{{ 1000 | random }}"
      run_once: yes

- name: Connect virtual networks with virtual network peering
  hosts: localhost
  connection: local
  vars:
    resource_group: "{{ resource_group_name }}"
    resource_group_secondary: "{{ resource_group_name }}2"
    vnet_name1: "myVnet{{ rpfx }}"
    vnet_name2: "myVnet{{ rpfx }}2"
    peering_name: peer1
    location: eastus2
  tasks:
  - name: Create a resource group
    azure_rm_resourcegroup:
      name: "{{ resource_group }}"
      location: "{{ location }}"
  - name: Create secondary resource group
    azure_rm_resourcegroup:
      name: "{{ resource_group_secondary }}"
      location: "{{ location }}"
  - name: Create first virtual network
    azure_rm_virtualnetwork:
      resource_group: "{{ resource_group }}"
      name: "{{ vnet_name1 }}"
      address_prefixes: "10.0.0.0/16"
  - name: Add subnet
    azure_rm_subnet:
      resource_group: "{{ resource_group }}"
      name: "{{ vnet_name1 }}"
      address_prefix: "10.0.0.0/24"
      virtual_network: "{{ vnet_name1 }}"
  - name: Ceate second virtual network
    azure_rm_virtualnetwork:
      resource_group: "{{ resource_group_secondary }}"
      name: "{{ vnet_name2 }}"
      address_prefixes: "10.1.0.0/16"
  - name: Add subnet
    azure_rm_subnet:
      resource_group: "{{ resource_group }}"
      name: "{{ vnet_name2 }}"
      address_prefix: "10.1.0.0/24"
      virtual_network: "{{ vnet_name2 }}"
  - name: Initial vnet peering
    azure_rm_virtualnetworkpeering:
      resource_group: "{{ resource_group }}"
      name: "{{ peering_name }}"
      virtual_network: "{{ vnet_name1 }}"
      remote_virtual_network:
        resource_group: "{{ resource_group_secondary }}"
        name: "{{ vnet_name2 }}"
      allow_virtual_network_access: true
      allow_forwarded_traffic: true

  - name: Connect vnet peering
    azure_rm_virtualnetworkpeering:
      resource_group: "{{ resource_group_secondary }}"
      name: "{{ peering_name }}"
      virtual_network: "{{ vnet_name2 }}"
      remote_virtual_network:
        resource_group: "{{ resource_group }}"
        name: "{{ vnet_name1 }}"
      allow_virtual_network_access: true
      allow_forwarded_traffic: true

  - name: Delete vnet peering
    azure_rm_virtualnetworkpeering:
      resource_group: "{{ resource_group }}"
      name: "{{ peering_name }}"
      virtual_network: "{{ vnet_name1 }}"
      state: absent
```

You can also get the complete playbook from [here](https://github.com/Azure-Samples/ansible-playbooks/blob/master/vnet_peering.yml).

> [!Tip]
> If get the playbook from GitHub and are using Ansible version < 2.8, you need to un-comment the role reference and install the role azure.azure_preview_modules using ansible-galaxy. For more information, refer to [this](https://galaxy.ansible.com/Azure/azure_preview_modules).  

Make sure you replace **{{ resource_group_name }}** in the ```vars``` section with the name of your resource group.

Save this playbook as *vnet_peering.yml*.

To run the Ansible playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook vnet_peering.yml
```

The output looks similar to the following where you see the VNet peering has been successfully set up and then deleted.

```Output
PLAY [localhost] ***********************************************************************

TASK [Gathering Facts] *****************************************************************
ok: [localhost]

TASK [Prepare random postfix] **********************************************************
ok: [localhost]

PLAY [Connect virtual networks with virtual network peering] ***************************

TASK [Gathering Facts] *****************************************************************
ok: [localhost]

TASK [Create a resource group] *********************************************************
changed: [localhost]

TASK [Create secondary resource group] *************************************************
changed: [localhost]

TASK [Create first virtual network] ****************************************************
changed: [localhost]

TASK [Add subnet] *************************************************************************************
changed: [localhost]

TASK [Ceate second virtual network] *******************************************************************
changed: [localhost]

TASK [Add subnet] *************************************************************************************
changed: [localhost]

TASK [Initial vnet peering] ***************************************************************************
changed: [localhost]

TASK [Connect vnet peering] ***************************************************************************
changed: [localhost]

TASK [Delete vnet peering] ****************************************************************************
changed: [localhost]

PLAY RECAP ********************************************************************************************
localhost                  : ok=12   changed=9    unreachable=0    failed=0    skipped=0   rescued=0    ignored=0
```

## Clean up resources

If you don't need these resources, you can delete them by running the following playbook. Replace the placeholder **{{ resource_group_name }}** with your resource group name.

```bash
- hosts: localhost
  vars:
    resource_group: "{{ resource_group_name }}"
    resource_group_secondary: "{{ resource_group_name }}2"
  tasks:
    - name: Delete a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        force_delete_nonempty: yes
        state: absent

    - name: Delete a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group_secondary }}"
        force_delete_nonempty: yes
        state: absent
```

Save this playbook as *cleanup.yml*.

To run the Ansible playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook cleanup.yml
```

## Next steps

> [!div class="nextstepaction"] 
> [Ansible on Azure](https://docs.microsoft.com/azure/ansible/)
