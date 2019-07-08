---
title: Tutorial - Configure Azure route tables using Ansible | Microsoft Docs
description: Learn how to create, change, and delete Azure route tables using Ansible
keywords: ansible, azure, devops, bash, playbook, networking, route, route table
ms.topic: tutorial
ms.service: ansible
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.date: 04/30/2019
---

# Tutorial: Configure Azure route tables using Ansible

[!INCLUDE [ansible-27-note.md](../../includes/ansible-28-note.md)]

Azure automatically routes traffic between Azure subnets, virtual networks, and on-premises networks. If you need more control over your environment's routing, you can create a [route table](/azure/virtual-network/virtual-networks-udr-overview). 

[!INCLUDE [ansible-tutorial-goals.md](../../includes/ansible-tutorial-goals.md)]

> [!div class="checklist"]
>
> Create a route table
> Create a virtual network and subnet
> Associate a route table with a subnet
> Disassociate a route table from a subnet
> Create and delete routes
> Query a route table
> Delete a route table

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-cloudshell-use-or-vm-creation2.md)]

## Create a route table

The playbook code in this section creates a route table. For information on route-table limits, see [Azure limits](/azure/azure-subscription-service-limits#azure-resource-manager-virtual-networking-limits). 

Save the following playbook as `route_table_create.yml`:

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

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook route_table_create.yml
```

## Associate a route table to a subnet

The playbook code in this section:

* Creates a virtual network
* Creates a subnet within the virtual network
* Associates a route table to the subnet

Route tables aren't associated to virtual networks. Rather, route tables are associated with the subnet of a virtual network.

The virtual network and route table must coexist in the same Azure location and subscription.

Subnets and route tables have a one-to-many relationship. A subnet can be defined with no associated route table or one route table. Route tables can be associated with none, one, or many subnets. 

Traffic from the subnet is routed based on:

- routes defined within route tables
- [default routes](/azure/virtual-network/virtual-networks-udr-overview#default)
- routes propagated from an on-premises network

The virtual network must be connected to an Azure virtual network gateway. The gateway can be ExpressRoute, or VPN if using BGP with a VPN gateway.

Save the following playbook as `route_table_associate.yml`:

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

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook route_table_associate.yml
```

## Dissociate a route table from a subnet

The playbook code in this section dissociates a route table from a subnet.

When dissociating a route table from a subnet, set the `route_table` for the subnet to `None`. 

Save the following playbook as `route_table_dissociate.yml`:

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

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook route_table_dissociate.yml
```

## Create a route

The playbook code in this section a route within a route table. 

Save the following playbook as `route_create.yml`:

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

Before running the playbook, see the following notes:

* `virtual_network_gateway` is defined as `next_hop_type`. For more information about how Azure selects routes, see [Routing overview](/azure/virtual-network/virtual-networks-udr-overview).
* `address_prefix` is defined as `10.1.0.0/16`. The prefix can't be duplicated within the route table.

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook route_create.yml
```

## Delete a route

The playbook code in this section deletes a route from a route table.

Save the following playbook as `route_delete.yml`:

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

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook route_delete.yml
```

## Get route table information

The playbook code in this section uses the Ansible module `azure_rm_routetable_facts` to retrieve route table information.

Save the following playbook as `route_table_facts.yml`:

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

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook route_table_facts.yml
```

## Delete a route table

The playbook code in this section a route table.

When a route table is deleted, all of its routes are also deleted.

A route table can't be deleted if it's associated with a subnet. [Dissociate the route table from any subnets](#dissociate-a-route-table-from-a-subnet) before attempting to delete the route table. 

Save the following playbook as `route_table_delete.yml`:

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

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook route_table_delete.yml
```

## Next steps
> [!div class="nextstepaction"] 
> [Ansible on Azure](/azure/ansible/)