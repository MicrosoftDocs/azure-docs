---
title: Manage web traffic with Azure Application Gateway using Ansible (Preview)
description: Learn how to use Ansible create and configure an Azure Application Gateway to manage web traffic
ms.service: ansible
keywords: ansible, azure, devops, bash, playbook, azure application gateway, load balancer, web traffic
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 09/20/2018
---

# Manage web traffic with Azure Application Gateway using Ansible (Preview)
[Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/) is a web traffic load balancer that enables you to manage traffic to your web applications. 

Ansible allows you to automate the deployment and configuration of resources in your environment. This article shows you how to use Ansible to create an Azure Application Gateway and use it manage traffic of two web servers running in Azure container instances. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up the network
> * Create two Azure container instances with httpd image
> * Create an application gateway with above Azure container instances in the backend pool


## Prerequisites
- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]

> [!Note]
> Ansible 2.7 is required to run the following the sample playbooks in this tutorial. You could install Ansible 2.7 RC version by running `sudo pip install ansible[azure]==2.7.0rc2`. Ansible 2.7 will be released on Oct of 2018. After that, you need not specify the version here because the default version will be 2.7. 

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

Save above playbook as *rg.yml*. To run the playbook,  use the **ansible-playbook** command as follows:
```bash
ansible-playbook rg.yml
```

## Create network resources 
You need to create a virtual network for the application gateway to be able to communicate with other resources. 

The following example creates a virtual network named **myVNet**, a subnet named **myAGSubnet**,  and a public IP address named **myAGPublicIPAddress** with domain named **mydomain**. 

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

Save above playbook as *vnet_create.yml*. To run the playbook,  use the **ansible-playbook** command as follows:
```bash
ansible-playbook vnet_create.yml
```

## Create backend servers
In this example, you create two Azure container instances with httpd images to be used as backend servers for the application gateway.  

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

Save above playbook as *aci_create.yml*. To run the playbook,  use the **ansible-playbook** command as follows:
```bash
ansible-playbook aci_create.yml
```

## Create the application gateway

Now let us create an applicate gateway. The following example creates an applicate gateway named **myAppGateway** with backend, frontend, and http configuration.  

> [!div class="checklist"]
> * **appGatewayIP** defined in **gateway_ip_configurations** block - Subnet reference is required for ip configuration of the gateway. 
> * **appGatewayBackendPool** defined in **backend_address_pools** block - An application gateway must have at least one backend address pool. 
> * **appGatewayBackendHttpSettings** defined in **backend_http_settings_collection** block - Specifies that port 80 and an HTTP protocol is used for communication. 
> * **appGatewayHttpListener** defined in **backend_http_settings_collection** block - The default listener associated with appGatewayBackendPool. 
> * **appGatewayFrontendIP** defined in **frontend_ip_configurations** block - Assigns myAGPublicIPAddress to appGatewayHttpListener. 
> * **rule1** defined in **request_routing_rules** block - The default routing rule that is associated with appGatewayHttpListener. 

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

Save above playbook as *appgw_create.yml*. To run the playbook,  use the **ansible-playbook** command as follows:
```bash
ansible-playbook appgw_create.yml
```

It may take several minutes for the application gateway to be created. 

## Test the application gateway

In above sample playbook for network resources, the domain named **mydomain** was created in **eastus**. Now you could navigate to the browser, type `http://mydomain.eastus.cloudapp.azure.com`, and you should see following page confirming that the Application Gateway is working as expected.

![Access Application Gateway](media/ansible-create-configure-application-gateway/applicationgateway.PNG)

## Clean up resources

If you don't need these resources, you can delete them by running below example. It deletes a resource group named **myResourceGroup**. 

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

Save above playbook as *rg_delete*.yml. To run the playbook,  use the **ansible-playbook** command as follows:
```bash
ansible-playbook rg_delete.yml
```

## Next steps
> [!div class="nextstepaction"] 
> [Ansible on Azure](https://docs.microsoft.com/azure/ansible/)
