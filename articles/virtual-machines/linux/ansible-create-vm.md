---
title: Use Ansible to create a Linux virtual machine in Azure
description: Learn how to Use Ansible to create a Linux virtual machine in Azure
ms.service: ansible
keywords: ansible, azure, devops, virtual machine
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: quickstart
ms.date: 08/22/2018
---

# Use Ansible to create a Linux virtual machine in Azure
Using a declarative language, Ansible allows you to automate the creation, configuration, and deployment of Azure resources via Ansible *playbooks*. Each section of this article shows you how each section of an Ansible playbook might look to create and configure different aspects of a Linux virtual machine. The [complete Ansible playbook](#complete-sample-ansible-playbook) is listed at the end of this article.

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)]

## Create a resource group
Ansible needs a resource group in which your resources are deployed. The following sample Ansible playbook section creates a resource group named `myResourceGroup` in the `eastus` location:

```yaml
- name: Create resource group
  azure_rm_resourcegroup:
    name: myResourceGroup
    location: eastus
```

## Create a virtual network
When you create an Azure virtual machine, you must create a [virtual network](/azure/virtual-network/virtual-networks-overview) or use an existing virtual network. You also need to decide how your virtual machines are intended to be accessed on the virtual network. The following sample Ansible playbook section creates a virtual network named `myVnet` in the `10.0.0.0/16` address space:

```yaml
- name: Create virtual network
  azure_rm_virtualnetwork:
    resource_group: myResourceGroup
    name: myVnet
    address_prefixes: "10.0.0.0/16"
```

All Azure resources deployed into a virtual network are deployed into a [subnet](/azure/virtual-network/virtual-network-manage-subnet) within a virtual network. 

The following sample Ansible playbook section creates a subnet named `mySubnet` in the `myVnet` virtual network:

```yaml
- name: Add subnet
  azure_rm_subnet:
    resource_group: myResourceGroup
    name: mySubnet
    address_prefix: "10.0.1.0/24"
    virtual_network: myVnet
```

## Create a public IP address
[Public IP addresses](/azure/virtual-network/virtual-network-ip-addresses-overview-arm) allow Internet resources to communicate inbound to Azure resources. Public IP addresses also enable Azure resources to communicate outbound to Internet and public-facing Azure services with an IP address assigned to the resource. The address is dedicated to the resource, until it is unassigned by you. If a public IP address is not assigned to a resource, the resource can still communicate outbound to the Internet, but Azure dynamically assigns an available IP address that is not dedicated to the resource. 

The following sample Ansible playbook section creates a public IP address named `myPublicIP`:

```yaml
- name: Create public IP address
  azure_rm_publicipaddress:
    resource_group: myResourceGroup
    allocation_method: Static
    name: myPublicIP
```

## Create a network security group
A [network security group](/azure/virtual-network/security-overview) enables you to filter network traffic to and from Azure resources in an Azure virtual network. A network security group contains security rules that allow or deny inbound network traffic to, or outbound network traffic from, several types of Azure resources. 

The following sample Ansible playbook section creates a network security group named `myNetworkSecurityGroup` and defines a rule to allow SSH traffic on TCP port 22:

```yaml
- name: Create Network Security Group that allows SSH
  azure_rm_securitygroup:
    resource_group: myResourceGroup
    name: myNetworkSecurityGroup
    rules:
      - name: SSH
        protocol: Tcp
        destination_port_range: 22
        access: Allow
        priority: 1001
        direction: Inbound
```


## Create a virtual network interface card
A virtual network interface card connects your virtual machine to a given virtual network, public IP address, and network security group. 

The following section in a sample Ansible playbook section creates a virtual network interface card named `myNIC` connected to the virtual networking resources you have created:

```yaml
- name: Create virtual network inteface card
  azure_rm_networkinterface:
    resource_group: myResourceGroup
    name: myNIC
    virtual_network: myVnet
    subnet: mySubnet
    public_ip_name: myPublicIP
    security_group: myNetworkSecurityGroup
```

## Create a virtual machine
The final step is to create a virtual machine that uses all the resources you've created in the previous sections of this article. 

The sample Ansible playbook section presented in this section creates a virtual machine named `myVM` and attaches the virtual network interface card named `myNIC`. Replace the &lt;your-key-data> placeholder with your own complete public key data.

```yaml
- name: Create VM
  azure_rm_virtualmachine:
    resource_group: myResourceGroup
    name: myVM
    vm_size: Standard_DS1_v2
    admin_username: azureuser
    ssh_password_enabled: false
    ssh_public_keys:
      - path: /home/azureuser/.ssh/authorized_keys
        key_data: <your-key-data>
    network_interfaces: myNIC
    image:
      offer: CentOS
      publisher: OpenLogic
      sku: '7.5'
      version: latest
```

## Complete sample Ansible playbook

This section lists the entire sample Ansible playbook that you've built up over the course of this article. 

```yaml
- name: Create Azure VM
  hosts: localhost
  connection: local
  tasks:
  - name: Create resource group
    azure_rm_resourcegroup:
      name: myResourceGroup
      location: eastus
  - name: Create virtual network
    azure_rm_virtualnetwork:
      resource_group: myResourceGroup
      name: myVnet
      address_prefixes: "10.0.0.0/16"
  - name: Add subnet
    azure_rm_subnet:
      resource_group: myResourceGroup
      name: mySubnet
      address_prefix: "10.0.1.0/24"
      virtual_network: myVnet
  - name: Create public IP address
    azure_rm_publicipaddress:
      resource_group: myResourceGroup
      allocation_method: Static
      name: myPublicIP
    register: output_ip_address
  - name: Dump public IP for VM which will be created
    debug:
      msg: "The public IP is {{ output_ip_address.state.ip_address }}."
  - name: Create Network Security Group that allows SSH
    azure_rm_securitygroup:
      resource_group: myResourceGroup
      name: myNetworkSecurityGroup
      rules:
        - name: SSH
          protocol: Tcp
          destination_port_range: 22
          access: Allow
          priority: 1001
          direction: Inbound
  - name: Create virtual network inteface card
    azure_rm_networkinterface:
      resource_group: myResourceGroup
      name: myNIC
      virtual_network: myVnet
      subnet: mySubnet
      public_ip_name: myPublicIP
      security_group: myNetworkSecurityGroup
  - name: Create VM
    azure_rm_virtualmachine:
      resource_group: myResourceGroup
      name: myVM
      vm_size: Standard_DS1_v2
      admin_username: azureuser
      ssh_password_enabled: false
      ssh_public_keys:
        - path: /home/azureuser/.ssh/authorized_keys
          key_data: <your-key-data>
      network_interfaces: myNIC
      image:
        offer: CentOS
        publisher: OpenLogic
        sku: '7.5'
        version: latest
```

## Run the sample Ansible playbook

This section walks you through running the sample Ansible playbook presented in this article.

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040).

1. Open [Cloud Shell](/azure/cloud-shell/overview).

1. Create a file (to contain your playbook) named `azure_create_complete_vm.yml`, and open it in the VI editor, as follows:

  ```azurecli-interactive
  vi azure_create_complete_vm.yml
  ```

1. Enter insert mode by selecting the **I** key.

1. Paste the [complete sample Ansible playbook](#complete-sample-ansible-playbook) into the editor.

1. Exit insert mode by selecting the **Esc** key.

1. Save the file and exit the vi editor by entering the following command:

    ```bash
    :wq
    ```

1. Run the sample Ansible playbook.

  ```bash
  ansible-playbook azure_create_complete_vm.yml
  ```

1. The output looks similar to the following where you can see that a virtual machine has been successfully created:

  ```bash
  PLAY [Create Azure VM] ****************************************************

  TASK [Gathering Facts] ****************************************************
  ok: [localhost]

  TASK [Create resource group] *********************************************
  changed: [localhost]

  TASK [Create virtual network] *********************************************
  changed: [localhost]

  TASK [Add subnet] *********************************************************
  changed: [localhost]

  TASK [Create public IP address] *******************************************
  changed: [localhost]

  TASK [Dump public IP for VM which will be created] ********************************************************************
  ok: [localhost] => {
      "msg": "The public IP is <ip-address>."
  }

  TASK [Create Network Security Group that allows SSH] **********************
  changed: [localhost]

  TASK [Create virtual network inteface card] *******************************
  changed: [localhost]

  TASK [Create VM] **********************************************************
  changed: [localhost]

  PLAY RECAP ****************************************************************
  localhost                  : ok=8    changed=7    unreachable=0    failed=0
  ```

1. The SSH command is used to access your Linux VM. Replace the &lt;ip-address> placeholder with the IP address from the previous step.

  ```bash
  ssh azureuser@<ip-address>
  ```

## Next steps
> [!div class="nextstepaction"] 
> [Use Ansible to manage a Linux virtual machine in Azure](./ansible-manage-linux-vm.md)
