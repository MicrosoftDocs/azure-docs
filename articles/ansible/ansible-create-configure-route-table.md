---
title: Create, change, or delete an Azure route table using Ansible
description: Learn how to use Ansible to create, change or delete a route table using Ansible
ms.service: azure
keywords: ansible, azure, devops, bash, playbook, networking, route, route table
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 12/17/2018
---

# Create, change, or delete an Azure route table using Ansible
Azure automatically routes traffic between Azure subnets, virtual networks, and on-premises networks. If you want to change any of default routing on Azure, you do so by creating a [route table](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview).

Ansible enables you to automate the deployment and configuration of resources in your environment. This article shows you how to create, change or delete an Azure route table, and attach the route table to a subnet as well. 

## Prerequisites
- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]

> [!Note]
> Ansible 2.7 is required to run the following sample playbooks in this tutorial.

## Create a route table
This section presents a sample Ansible playbook that creates a route table. There is a limit to how many route tables you can create per Azure location and subscription. For details, see [Azure limits](https://docs.microsoft.com/azure/azure-subscription-service-limits?toc=%2fazure%2fvirtual-network%2ftoc.json#azure-resource-manager-virtual-networking-limits). 

```yml
- hosts: localhost
  vars:
    route_table_name: myRouteTable
    resource_group: myResourceGroup
  tasks:
    - name: Create a route table
      azure_rm_routetable:
        name: "{{ route_table_name }}"
        resource_group: "{{ resource_group }}"
```

Save this playbook as `route_table_create.yml`. To run the playbook,  use the **ansible-playbook** command as follows:

```bash
ansible-playbook route_table_create.yml
```

## Associate a route table to a subnet
A subnet can have zero or one route table associated to it. A route table can be associated to zero or multiple subnets. Since route tables are not associated to virtual networks, you must associate a route table to each subnet you want the route table associated to. All traffic leaving the subnet is routed based on routes you've created within route tables, [default routes](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview#default), and routes propagated from an on-premises network, if the virtual network is connected to an Azure virtual network gateway (ExpressRoute, or VPN, if using BGP with a VPN gateway). You can only associate a route table to subnets in virtual networks that exist in the same Azure location and subscription as the route table.

This section presents a sample Ansible playbook that creates a virtual network and a subnet, then associates a route table to the subnet.

```yml
- hosts: localhost
  vars:
    subnet_name: mySubnet
    virtual_network_name: myVirtualNetwork 
    route_table_name: myRouteTable
    resource_group: myResourceGroup
  tasks:
    - name: Create virtual network
      azure_rm_virtualnetwork:
        name: "{{ virtual_network_name }}"
        resource_group: "{{ resource_group }}"
        address_prefixes_cidr:
        - 10.1.0.0/16
        - 172.100.0.0/16
        dns_servers:
        - 127.0.0.1
        - 127.0.0.3
    - name: Create a subnet with route table
      azure_rm_subnet:
        name: "{{ subnet_name }}"
        virtual_network_name: "{{ virtual_network_name }}"
        resource_group: "{{ resource_group }}"
        address_prefix_cidr: "10.1.0.0/24"
        route_table: "{ route_table_name }"
```

Save this playbook as `route_table_associate.yml`. To run the Ansible playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook route_table_associate.yml
```

## Dissociate a route table from a subnet
When you dissociate a route table from a subnet, you just need to set the `route_table` in a subnet to `None`. Below is a sample ansible playbook. 

```yml
- hosts: localhost
  vars:
    subnet_name: mySubnet
    virtual_network_name: myVirtualNetwork 
    resource_group: myResourceGroup
  tasks:
    - name: Dissociate a route table
      azure_rm_subnet:
        name: "{{ subnet_name }}"
        virtual_network_name: "{{ virtual_network_name }}"
        resource_group: "{{ resource_group }}"
        address_prefix_cidr: "10.1.0.0/24"
```

Save this playbook as `route_table_dissociate.yml`. To run the Ansible playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook route_table_dissociate.yml
```

## Create a route
This section presents a sample Ansible playbook that creates a route under the route table. It defines  `virtual_network_gateway` as `next_hop_type` and `10.1.0.0/16` as `address_prefix`. The prefix cannot be duplicated in more than one route within the route table, though the prefix can be within another prefix. To learn more about how Azure selects routes and a detailed description of all next hop types, see [Routing overview](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview).

```yml
- hosts: localhost
  vars:
    route_name: myRoute
    route_table_name: myRouteTable
    resource_group: myResourceGroup
  tasks:
    - name: Create route
      azure_rm_route:
        name: "{{ route_name }}"
        resource_group: "{{ resource_group }}"
        next_hop_type: virtual_network_gateway
        address_prefix: "10.1.0.0/16"
        route_table_name: "{{ route_table_name }}"
```
Save this playbook as `route_create.yml`. To run the Ansible playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook route_create.yml
```

## Delete a route
This section presents a sample Ansible playbook that deletes a route from a route table.

```yml
- hosts: localhost
  vars:
    route_name: myRoute
    route_table_name: myRouteTable
    resource_group: myResourceGroup
  tasks:
    - name: Remove route
      azure_rm_route:
        name: "{{ route_name }}"
        resource_group: "{{ resource_group }}"
        route_table_name: "{{ route_table_name }}"
        state: absent
```

Save this playbook as `route_delete.yml`. To run the Ansible playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook route_delete.yml
```

## Get information of a route table
You can view details of a route_table through Ansible module named `azure_rm_routetable_facts`. The facts module will return the information of the route table with all routes attached to it.
Below is a sample ansible playbook. 

```yml
- hosts: localhost
  vars:
    route_table_name: myRouteTable
    resource_group: myResourceGroup
  tasks: 
    - name: Get route table information
      azure_rm_routetable_facts:
         resource_group: "{{ resource_group }}"
         name: "{{ route_table_name }}"
      register: query
    
    - debug:
         var: query.route_tables[0]
```

Save this playbook as `route_table_facts.yml`. To run the Ansible playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook route_table_facts.yml
```

## Delete a route table
If a route table is associated to any subnets, it cannot be deleted. [Dissociate](#dissociate-a-route-table-from-a-subnet) a route table from all subnets before attempting to delete it.

You can delete the route table together with all routes. Below is a sample ansible playbook. 

```yml
- hosts: localhost
  vars:
    route_table_name: myRouteTable
    resource_group: myResourceGroup
  tasks:
    - name: Create a route table
      azure_rm_routetable:
        name: "{{ route_table_name }}"
        resource_group: "{{ resource_group }}"
        state: absent
```

Save this playbook as `route_table_delete.yml`. To run the Ansible playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook route_table_delete.yml
```

## Next steps
> [!div class="nextstepaction"] 
> [Ansible on Azure](https://docs.microsoft.com/azure/ansible/)
