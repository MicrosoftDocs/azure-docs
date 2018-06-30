---
title: Use Ansible to create and configure VMSS in Azure | Microsoft Docs
description: Learn how to use Ansible to create and configure a Virtual Machine Scale Set in Azure
ms.service: ansible
keywords: ansible, azure, devops, bash, playbook
author: kyliel
manager: 
editor: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.date: 06/30/2018
ms.author: kyliel
---

# Create and Configure Virtual Machine Scale Set (VMSS) in Azure with Ansible
Ansible allows you to automate the deployment and configuration of resources in your environment. You can use Ansible to manage your virtual machine scale set (VMSS) in Azure, the same as you would manage any other resource. This article shows you how to create a VMSS and scale out the VMSS with Ansible. 

## Prerequisites
To manage Azure resources with Ansible, you need the following:

- Azure subscription
    - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- Azure credentials, and Ansible configured to use them.
    - [Create Azure credentials and configure Ansible](ansible-install-configure.md#create-azure-credentials)
- Ansible and the Azure Python SDK modules installed on your host system.
    - Install Ansible on [CentOS 7.4](ansible-install-configure.md#centos-74), [Ubuntu 16.04 LTS](ansible-install-configure.md#ubuntu-1604-lts), and [SLES 12 SP2](ansible-install-configure.md#sles-12-sp2)

**Note**: Ansible 2.6 is requried to run the following sample playbook for VMSS. 


## Create a VMSS
The following section in an Ansible playbook creates 
- a resource group where all of your resources will be deployed;
- a virtual network in the 10.0.0.0/16 address space;
- a subnet in above virtual network;
- a public IP address to access resources across the Internet;
- a NSG which controls the flow of network traffic in and out of your VMSS;
- a load balancer which distributes traffic across a set of defined VMs using load balancer rules;
- a virtual machine scale set (VMSS) which uses all resources created. 

Enter your own password in admin_password as follows:

```yaml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    vmss_name: myVMSS
    location: eastus
    admin_username: azureuser
    admin_password: xxxxxxxxx
  tasks:
    - name: Create a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        location: "{{ location }}"
    - name: Create virtual network
      azure_rm_virtualnetwork:
        resource_group: "{{ resource_group }}"
        name: "{{ vmss_name }}"
        address_prefixes: "10.0.0.0/16"
    - name: Add subnet
      azure_rm_subnet:
        resource_group: "{{ resource_group }}"
        name: "{{ vmss_name }}"
        address_prefix: "10.0.1.0/24"
        virtual_network: "{{ vmss_name }}"
    - name: Create public IP address
      azure_rm_publicipaddress:
        resource_group: "{{ resource_group }}"
        allocation_method: Static
        name: "{{ vmss_name }}"
    - name: Create Network Security Group that allows SSH
      azure_rm_securitygroup:
        resource_group: "{{ resource_group }}"
        name: "{{ vmss_name }}"
        rules:
          - name: SSH
            protocol: Tcp
            destination_port_range: 22
            access: Allow
            priority: 1001
            direction: Inbound

    - name: Create a load balancer
      azure_rm_loadbalancer:
        name: "{{ vmss_name }}lb"
        location: "{{ location }}"
        resource_group: "{{ resource_group }}"
        public_ip: "{{ vmss_name }}"
        probe_protocol: Tcp
        probe_port: 8080
        probe_interval: 10
        probe_fail_count: 3
        protocol: Tcp
        load_distribution: Default
        frontend_port: 80
        backend_port: 8080
        idle_timeout: 4
        natpool_frontend_port_start: 50000
        natpool_frontend_port_end: 50040
        natpool_backend_port: 22
        natpool_protocol: Tcp

    - name: Create VMSS
      azure_rm_virtualmachine_scaleset:
        resource_group: "{{ resource_group }}"
        name: "{{ vmss_name }}"
        vm_size: Standard_DS1_v2
        admin_username: "{{ admin_username }}"
        admin_password: "{{ admin_password }}"
        ssh_password_enabled: true
        capacity: 2
        virtual_network_name: "{{ vmss_name }}"
        subnet_name: "{{ vmss_name }}"
        upgrade_policy: Manual
        tier: Standard
        managed_disk_type: Standard_LRS
        os_disk_caching: ReadWrite
        image:
          offer: UbuntuServer
          publisher: Canonical
          sku: 16.04-LTS
          version: latest
        load_balancer: "{{ vmss_name }}lb"
        data_disks:
          - lun: 0
            disk_size_gb: 20
            managed_disk_type: Standard_LRS
            caching: ReadOnly
          - lun: 1
            disk_size_gb: 30
            managed_disk_type: Standard_LRS
            caching: ReadOnly
```

To create the complete VMSS environment with Ansible, save above playbook as vmss-create.yml or direclty get the sample playbook [here](https://github.com/Azure-Samples/ansible-playbooks/blob/master/vmss/vmss-create.yml). Then run it as follows:

```bash
ansible-playbook vmss-create.yml
```

The output looks similar to the following example that shows the VMSS has been successfully created:

```bash
PLAY [localhost] ***********************************************************

TASK [Gathering Facts] *****************************************************
ok: [localhost]

TASK [Create a resource group] ****************************************************************************
changed: [localhost]

TASK [Create virtual network] ****************************************************************************
changed: [localhost]

TASK [Add subnet] **********************************************************
changed: [localhost]

TASK [Create public IP address] ****************************************************************************
changed: [localhost]

TASK [Create Network Security Group that allows SSH] ****************************************************************************
changed: [localhost]

TASK [Create a load balancer] ****************************************************************************
changed: [localhost]

TASK [Create VMSS] *********************************************************
changed: [localhost]

PLAY RECAP *****************************************************************
localhost                  : ok=8    changed=7    unreachable=0    failed=0

```

## Scale out VMSS
The created VMSS has 2 instances. If you go to the Azure portal and navigate to the VMSS you just created, you will see "Standard_DS1_v2 (2 instances)". You also could check it through Azure CLI in [Azure Cloud Shell](https://shell.azure.com/) by running below command line:

```azurecli-interactive
az vmss show -n myVMSS -g myResourceGroup --query '{"capacity":sku.capacity}' 
```

Then you will see below output:
```bash
{
  "capacity": 2,
}
```

Now let's scale it out from 2 instances to 3 instances. The following section in an Ansible playbook gets facts of created VMSS according to the names of resource group and VMSS, and changes its capacity from 2 to 3. 

```yaml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    vmss_name: myVMSS
  tasks: 
    - name: Get scaleset info
      azure_rm_virtualmachine_scaleset_facts:
        resource_group: "{{ resource_group }}"
        name: "{{ vmss_name }}"
        format: curated
      register: output_scaleset

    - name: Dump scaleset info
      debug:
        var: output_scaleset

    - name: Modify scaleset (change the capacity to 3)
      set_fact:
        body: "{{ output_scaleset.ansible_facts.azure_vmss[0] | combine({'capacity': 3}, recursive=True) }}"

    - name: Update something in that VMSS
      azure_rm_virtualmachine_scaleset: "{{ body }}"
```

To scale out the VMSS you created, save above playbook as vmss-scale-out.yml or direclty get the sample playbook [here](https://github.com/Azure-Samples/ansible-playbooks/blob/master/vmss/vmss-scale-out.yml)). Then run it as follows:

```bash
ansible-playbook vmss-scale-out.yml
```

The output looks similar to the following example that shows the VMSS has been successfully scaled out:

```bash
PLAY [localhost] **********************************************************

TASK [Gathering Facts] ****************************************************
ok: [localhost]

TASK [Get scaleset info] ***************************************************************************
ok: [localhost]

TASK [Dump scaleset info] ***************************************************************************
ok: [localhost] => {
    "output_scaleset": {
        "ansible_facts": {
            "azure_vmss": [
                {
                    ......
                }
            ]
        },
        "changed": false,
        "failed": false
    }
}

TASK [Modify scaleset (set upgradePolicy to Automatic and capacity to 3)] ***************************************************************************
ok: [localhost]

TASK [Update something in that VMSS] ***************************************************************************
changed: [localhost]

PLAY RECAP ****************************************************************
localhost                  : ok=5    changed=1    unreachable=0    failed=0
```

Now if you go to the Azure portal and navigate to the VMSS you just configured, you will see "Standard_DS1_v2 (3 instances)". You also could check it through Azure CLI in [Azure Cloud Shell](https://shell.azure.com/) by running below command line:

```azurecli-interactive
az vmss show -n myVMSS -g myResourceGroup --query '{"capacity":sku.capacity}' 
```

Now you could see 3 instances. 
```bash
{
  "capacity": 3,
}
```

## Next steps
This article shows you how to create a VMSS and scale out the VMSS with Ansible. If you want to learn how to configure the environment of a VMSS and install an application on the VMSS, see [Install application on VMSS](ansible-deploy-app-vmss.md). 

For the complete playbook, see [Ansible sample playbook for VMSS](https://github.com/Azure-Samples/ansible-playbooks/tree/master/vmss).
