---
title: Manage web traffic with Azure Application Gateway by using Ansible (preview)
description: Learn how to use Ansible to create and configure an Azure Application Gateway to manage web traffic
ms.service: ansible
keywords: ansible, azure, devops, bash, playbook, azure application gateway, load balancer, web traffic
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 09/20/2018
---

# Manage web traffic with Azure Application Gateway by using Ansible (preview)

[Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/) is a web traffic load balancer that enables you to manage traffic to your web applications.

Ansible helps automate the deployment and configuration of resources in your environment. This article shows you how to use Ansible to create an application gateway. It also teaches you how to use the gateway to manage traffic to two web servers that run in Azure container instances.

This tutorial shows you how to:

> [!div class="checklist"]
> * Set up the network
> * Create two Azure container instances with HTTPD images
> * Create an application gateway that works with the Azure container instances in the server pool

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]

> [!Note]
> Ansible 2.7 is required to run the following the sample playbooks in this tutorial. You can install Ansible 2.7 RC by running `sudo pip install ansible[azure]==2.7.0rc2`. After Ansible 2.7 is released, you won't need to specify the version.

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed.  

The following example creates a resource group named **myResourceGroup** in the **eastus** location.

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

Save this playbook as *rg.yml*. To run the playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook rg.yml
```

## Create network resources

First create a virtual network to enable the application gateway to communicate with other resources.

The following example creates a virtual network named **myVNet**, a subnet named **myAGSubnet**, and a public IP address named **myAGPublicIPAddress** with a domain named **mydomain**.

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

Save this playbook as *vnet_create.yml*. To run the playbook,  use the **ansible-playbook** command as follows:

```bash
ansible-playbook vnet_create.yml
```

## Create servers

The following example shows you how to create two Azure container instances with HTTPD images to be used as web servers for the application gateway.  

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

Save this playbook as *aci_create.yml*. To run the playbook,  use the **ansible-playbook** command as follows:

```bash
ansible-playbook aci_create.yml
```

## Create the application gateway

The following example creates an application gateway named **myAppGateway** with configurations for back end, front end, and HTTP.  

* **appGatewayIP** is defined in the **gateway_ip_configurations** block. A subnet reference is required for IP configuration of the gateway.
* **appGatewayBackendPool** is defined in the **backend_address_pools** block. An application gateway must have at least one back-end address pool.
* **appGatewayBackendHttpSettings** is defined in the **backend_http_settings_collection** block. It specifies that port 80 and an HTTP protocol is used for communication.
* **appGatewayHttpListener** is defined in the **backend_http_settings_collection** block. It's the default listener associated with appGatewayBackendPool.
* **appGatewayFrontendIP** is defined in the **frontend_ip_configurations** block. It assigns myAGPublicIPAddress to appGatewayHttpListener.
* **rule1** is defined in the **request_routing_rules** block. It's the default routing rule associated with appGatewayHttpListener.

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

Save this playbook as *appgw_create.yml*. To run the playbook,  use the **ansible-playbook** command as follows:

```bash
ansible-playbook appgw_create.yml
```

It might take several minutes for the application gateway to be created.

## Test the application gateway

In the sample playbook for network resources, you created the domain **mydomain** in **eastus**. Go to  `http://mydomain.eastus.cloudapp.azure.com` in your browser. If you see the following page, the application gateway is working as expected.

![Successful test of a working application gateway](media/ansible-create-configure-application-gateway/applicationgateway.PNG)

## Clean up resources

If you don't need these resources, you can delete them by running the following code. It deletes a resource group named **myResourceGroup**.

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

Save this playbook as *rg_delete*.yml. To run the playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook rg_delete.yml
```

## Next steps

> [!div class="nextstepaction"]
> [Ansible on Azure](https://docs.microsoft.com/azure/ansible/)
