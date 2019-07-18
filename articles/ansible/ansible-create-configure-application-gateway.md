---
title: Tutorial - Manage web traffic with Azure Application Gateway using Ansible | Microsoft Docs
description: Learn how to use Ansible to create and configure an Azure Application Gateway to manage web traffic
keywords: ansible, azure, devops, bash, playbook, application gateway, load balancer, web traffic
ms.topic: tutorial
ms.service: ansible
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.date: 04/30/2019
---

# Tutorial: Manage web traffic with Azure Application Gateway using Ansible

[!INCLUDE [ansible-27-note.md](../../includes/ansible-27-note.md)]

[Azure Application Gateway](/azure/application-gateway/overview) is a web traffic load balancer that enables you to manage traffic to your web applications. Based on the source IP address and port, traditional load balancers route traffic to a destination IP address and port. Application Gateway gives you a finer level of control where traffic can be routed based on the URL. For example, you could define that if `images` is URL's path, traffic is routed to a specific set of servers (known as a pool) configured for images.

[!INCLUDE [ansible-tutorial-goals.md](../../includes/ansible-tutorial-goals.md)]

> [!div class="checklist"]
>
> * Set up a network
> * Create two Azure container instances with HTTPD images
> * Create an application gateway that works with the Azure container instances in the server pool

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-cloudshell-use-or-vm-creation2.md)]

## Create a resource group

The playbook code in this section creates an Azure resource group. A resource group is a logical container in which Azure resources are configured.  

Save the following playbook as `rg.yml`:

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    location: eastus 
  tasks:
    - name: Create a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        location: "{{ location }}"
```

Before running the playbook, see the following notes:

- The resource group name is `myResourceGroup`. This value is used throughout the tutorial.
- The resource group is created in the `eastus` location.

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook rg.yml
```

## Create network resources

The playbook code in this section creates a virtual network to enable the application gateway to communicate with other resources.

Save the following playbook as `vnet_create.yml`:

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    location: eastus 
    vnet_name: myVNet 
    subnet_name: myAGSubnet 
    publicip_name: myAGPublicIPAddress
    publicip_domain: mydomain
  tasks:
    - name: Create a virtual network
      azure_rm_virtualnetwork:
        name: "{{ vnet_name }}"
        resource_group: "{{ resource_group }}"
        address_prefixes_cidr:
            - 10.1.0.0/16
            - 172.100.0.0/16
        dns_servers:
            - 127.0.0.1
            - 127.0.0.2

    - name: Create a subnet
      azure_rm_subnet:
        name: "{{ subnet_name }}"
        virtual_network_name: "{{ vnet_name }}"
        resource_group: "{{ resource_group }}"
        address_prefix_cidr: 10.1.0.0/24

    - name: Create a public IP address
      azure_rm_publicipaddress:
        resource_group: "{{ resource_group }}" 
        allocation_method: Dynamic
        name: "{{ publicip_name }}"
        domain_name_label: "{{ publicip_domain }}"
```

Before running the playbook, see the following notes:

* The `vars` section contains the values that are used to create the network resources. 
* You'll need to change these values for your specific environment.

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook vnet_create.yml
```

## Create servers

The playbook code in this section creates two Azure container instances with HTTPD images to be used as web servers for the application gateway.  

Save the following playbook as `aci_create.yml`:

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    location: eastus 
    aci_1_name: myACI1
    aci_2_name: myACI2
  tasks:
    - name: Create a container with httpd image 
      azure_rm_containerinstance:
        resource_group: "{{ resource_group }}"
        name: "{{ aci_1_name }}"
        os_type: linux
        ip_address: public
        location: "{{ location }}"
        ports:
          - 80
        containers:
          - name: mycontainer
            image: httpd
            memory: 1.5
            ports:
              - 80

    - name: Create another container with httpd image 
      azure_rm_containerinstance:
        resource_group: "{{ resource_group }}"
        name: "{{ aci_2_name }}"
        os_type: linux
        ip_address: public
        location: "{{ location }}"
        ports:
          - 80
        containers:
          - name: mycontainer
            image: httpd
            memory: 1.5
            ports:
              - 80
```

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook aci_create.yml
```

## Create the application gateway

The playbook code in this section creates an application gateway named `myAppGateway`.  

Save the following playbook as `appgw_create.yml`:

```yml
- hosts: localhost
  connection: local
  vars:
    resource_group: myResourceGroup
    vnet_name: myVNet
    subnet_name: myAGSubnet
    location: eastus
    publicip_name: myAGPublicIPAddress
    appgw_name: myAppGateway
    aci_1_name: myACI1
    aci_2_name: myACI2
  tasks:
    - name: Get info of Subnet
      azure_rm_resource_facts:
        api_version: '2018-08-01'
        resource_group: "{{ resource_group }}"
        provider: network
        resource_type: virtualnetworks
        resource_name: "{{ vnet_name }}"
        subresource:
          - type: subnets
            name: "{{ subnet_name }}"
      register: subnet

    - name: Get info of backend server 2
      azure_rm_resource_facts:
        api_version: '2018-04-01'
        resource_group: "{{ resource_group }}"
        provider: containerinstance
        resource_type: containergroups
        resource_name: "{{ aci_1_name }}"
      register: aci_1_output
    - name: Get info of backend server 2
      azure_rm_resource_facts:
        api_version: '2018-04-01'
        resource_group: "{{ resource_group }}"
        provider: containerinstance
        resource_type: containergroups
        resource_name: "{{ aci_2_name }}"
      register: aci_2_output

    - name: Create instance of Application Gateway
      azure_rm_appgateway:
        resource_group: "{{ resource_group }}"
        name: "{{ appgw_name }}"
        sku:
          name: standard_small
          tier: standard
          capacity: 2
        gateway_ip_configurations:
          - subnet:
              id: "{{ subnet.response[0].id }}"
            name: appGatewayIP
        frontend_ip_configurations:
          - public_ip_address: "{{ publicip_name }}"
            name: appGatewayFrontendIP
        frontend_ports:
          - port: 80
            name: appGatewayFrontendPort
        backend_address_pools:
          - backend_addresses:
              - ip_address: "{{ aci_1_output.response[0].properties.ipAddress.ip }}"
              - ip_address: "{{ aci_2_output.response[0].properties.ipAddress.ip }}"
            name: appGatewayBackendPool
        backend_http_settings_collection:
          - port: 80
            protocol: http
            cookie_based_affinity: enabled
            name: appGatewayBackendHttpSettings
        http_listeners:
          - frontend_ip_configuration: appGatewayFrontendIP
            frontend_port: appGatewayFrontendPort
            name: appGatewayHttpListener
        request_routing_rules:
          - rule_type: Basic
            backend_address_pool: appGatewayBackendPool
            backend_http_settings: appGatewayBackendHttpSettings
            http_listener: appGatewayHttpListener
            name: rule1
```

Before running the playbook, see the following notes:

* `appGatewayIP` is defined in the `gateway_ip_configurations` block. A subnet reference is required for IP configuration of the gateway.
* `appGatewayBackendPool` is defined in the `backend_address_pools` block. An application gateway must have at least one back-end address pool.
* `appGatewayBackendHttpSettings` is defined in the `backend_http_settings_collection` block. It specifies that port 80 and an HTTP protocol are used for communication.
* `appGatewayHttpListener` is defined in the `backend_http_settings_collection` block. It's the default listener associated with appGatewayBackendPool.
* `appGatewayFrontendIP` is defined in the `frontend_ip_configurations` block. It assigns myAGPublicIPAddress to appGatewayHttpListener.
* `rule1` is defined in the `request_routing_rules` block. It's the default routing rule associated with appGatewayHttpListener.

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook appgw_create.yml
```

It might take several minutes for the application gateway to be created.

## Test the application gateway

1. In the [Create a resource group](#create-a-resource-group) section, you specify a location. Note its value.

1. In the [Create network resources](#create-network-resources) section, you specify the domain. Note its value.

1. For the test URL by replacing the following pattern with the location and domain: `http://<domain>.<location>.cloudapp.azure.com`.

1. Browse to the test URL.

1. If you see the following page, the application gateway is working as expected.

    ![Successful test of a working application gateway](media/ansible-application-gateway-configure/application-gateway.png)

## Clean up resources

When no longer needed, delete the resources created in this article. 

Save the following code as `cleanup.yml`:

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
  tasks:
    - name: Delete a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        state: absent
```

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook cleanup.yml
```

## Next steps

> [!div class="nextstepaction"]
> [Ansible on Azure](/azure/ansible/)