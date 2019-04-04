---
title: Configure kubenet networking in Azure Kubernetes Service (AKS) using Ansible
description: Learn how to use Ansible to configure kubenet networking in Azure Kubernetes Service(AKS) cluster
ms.service: azure
keywords: ansible, azure, devops, bash, cloudshell, playbook, aks, container, Kubernetes
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
---

# Configure kubenet networking in Azure Kubernetes Service (AKS) using Ansible

In Azure Kubernetes Service(AKS), you can deploy a cluster that uses one of the following two network models:

- [**Kubenet networking**](https://docs.microsoft.com/en-us/azure/aks/configure-kubenet) - the network resources are typically created and configured as the AKS cluster is deployed.
- [**Azure Container Networking Interface (CNI) networking**](https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni) - the AKS cluster is connected to existing virtual network resources and configurations.

Refer to [Network concepts for applications in Azure Kubernetes Sevrice (AKS)](https://docs.microsoft.com/en-us/azure/aks/concepts-network) for core concepts that provide networking to your applications in AKS.

This article shows you how to use Ansible to create an AKS cluster and configure kubenet (basic) networking.

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- **Azure service principal** - When [creating the service principal](/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest), note the following values: **appId**, **displayName**, **password**, and **tenant**.

- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]

> [!Note]
> Ansible 2.8 is required to run the following the sample playbooks in this tutorial.

## Create a virtual network and subnet

The first section contains two tasks to create a virtual network, and add a subnet to it. Save these tasks as *vnet.yml*.

```yml
- name: Create vnet
  azure_rm_virtualnetwork:
      resource_group: "{{ resource_group }}"
      name: "{{ name }}"
      address_prefixes_cidr:
          - 10.0.0.0/8

- name: Create subnet
  azure_rm_subnet:
      resource_group: "{{ resource_group }}"
      name: "{{ name }}"
      address_prefix_cidr: 10.240.0.0/16
      virtual_network_name: "{{ name }}"
  register: subnet
```

## Create an AKS cluster in the virtual network

This section shows you how to create an AKS cluster with the virtual network. Save these tasks to *aks.yml*.

Before creation, we use `azure_rm_aks_version` module to find the supported version.

> [!Tip]
> - The `vnet_subnet_id` is the subnet we create in previous section.
> - The `network_profile` defines the properties for kubenet network plugin.
>   - The `service_cidr` is used to assign internal services in the AKS cluster an IP address. This IP address range should be an address space that isn't in use elsewhere in your network environment. This includes any on-premises network ranges if you connect, or plan to connect, your Azure virtual networks using Express Route or a Site-to-Site VPN connections.
>   - The `dns_service_ip` address is the .10 address of your service IP address range.
>   - The `pod_cidr` should be a large address space that isn't in use elsewhere in your network environment. This includes any on-premises network ranges if you connect, or plan to connect, your Azure virtual networks using Express Route or a Site-to-Site VPN connection.
>   - This address range must be large enough to accommodate the number of nodes that you expect to scale up to. You can't change this address range once the cluster is deployed if you need more addresses for additional nodes.<br/>
>     The pod IP address range is used to assign a /24 address space to each node in the cluster. In the following example, the `pod_cidr` of 192.168.0.0/16 assigns the first node 192.168.0.0/24, the second node 192.168.1.0/24, and the third node 192.168.2.0/24.<br/>
>     As the cluster scales or upgrades, the Azure platform continues to assign a pod IP address range to each new node.
> - This task loads `ssh_key` from `~/.ssh/id_rsa.pub`. You can change it to RSA public key in the single-line format - starting with "ssh-rsa" (without the quotes).
> - `client_id` and `client_secret` are loaded from `~/.azure/credentials`, the default credential file for Ansible. You can set these as your own service principal or load these from environment:
>
>    ```yml
>    client_id: "{{ lookup('env', 'AZURE_CLIENT_ID') }}"
>    client_secret: "{{ lookup('env', 'AZURE_SECRET') }}"
>    ```

```yml
- name: List supported kubernetes version from Azure
  azure_rm_aks_version:
      location: "{{ location }}"
  register: versions

- name: Create AKS cluster with vnet
  azure_rm_aks:
      resource_group: "{{ resource_group }}"
      name: "{{ name }}"
      dns_prefix: "{{ name }}"
      kubernetes_version: "{{ versions.azure_aks_versions[-1] }}"
      agent_pool_profiles:
        - count: 3
          name: nodepool1
          vm_size: Standard_D2_v2
          vnet_subnet_id: "{{ vnet_subnet_id }}"
      linux_profile:
          admin_username: azureuser
          ssh_key: "{{ lookup('file', '~/.ssh/id_rsa.pub') }}"
      service_principal:
          client_id: "{{ lookup('ini', 'client_id section=default file=~/.azure/credentials') }}"
          client_secret: "{{ lookup('ini', 'secret section=default file=~/.azure/credentials') }}"
      network_profile:
          network_plugin: kubenet
          pod_cidr: 192.168.0.0/16
          docker_bridge_cidr: 172.17.0.1/16
          dns_service_ip: 10.0.0.10
          service_cidr: 10.0.0.0/16
  register: aks
```

## Associate network resources with the node subnet

When you create an AKS cluster, a network security group and route table are created. These network resources are managed by the AKS control plane and updated as you create and expose services. Associate the network security group and route table with your virtual network subnet as follows. Save these tasks in *associate.yml*.

> - The `node_resource_group` is the resource group name where to put AKS nodes.
> - The `vnet_subnet_id` is the subnet created in previous section.

```yml
- name: Get route table
  azure_rm_routetable_facts:
      resource_group: "{{ node_resource_group }}"
  register: routetable

- name: Get network security group
  azure_rm_securitygroup_facts:
      resource_group: "{{ node_resource_group }}"
  register: nsg

- name: Parse subnet id
  set_fact:
      subnet_name: "{{ vnet_subnet_id | regex_search(subnet_regex, '\\1') }}"
      subnet_rg: "{{ vnet_subnet_id | regex_search(rg_regex, '\\1') }}"
      subnet_vn: "{{ vnet_subnet_id | regex_search(vn_regex, '\\1') }}"
  vars:
      subnet_regex: '/subnets/(.+)'
      rg_regex: '/resourceGroups/(.+?)/'
      vn_regex: '/virtualNetworks/(.+?)/'

- name: Associate network resources with the node subnet
  azure_rm_subnet:
      name: "{{ subnet_name[0] }}"
      resource_group: "{{  subnet_rg[0] }}"
      virtual_network_name: "{{ subnet_vn[0] }}"
      security_group: "{{ nsg.ansible_facts.azure_securitygroups[0].id }}"
      route_table: "{{ routetable.route_tables[0].id }}"
```

## Combine tasks together

Here is the complete playbook that calls all the preceding tasks. Save this playbook as *aks-kubenet.yml*. You can replace **aksansibletest**, **aksansibletest**, **eastus** in the ```vars``` section with your own resource group name, AKS name and location respectively.

```yml
---
- hosts: localhost
  vars:
      resource_group: aksansibletest
      name: aksansibletest
      location: eastus
  tasks:
     - name: Ensure resource group exist
       azure_rm_resourcegroup:
           name: "{{ resource_group }}"
           location: "{{ location }}"

     - name: Create vnet
       include_tasks: vnet.yml

     - name: Create AKS
       vars:
           vnet_subnet_id: "{{ subnet.state.id }}"
       include_tasks: aks.yml

     - name: Associate network resources with the node subnet
       vars:
           vnet_subnet_id: "{{ subnet.state.id }}"
           node_resource_group: "{{ aks.node_resource_group }}"
       include_tasks: associate.yml

     - name: Get details of the AKS
       azure_rm_aks_facts:
           name: "{{ name }}"
           resource_group: "{{ resource_group }}"
           show_kubeconfig: user
       register: output

     - name: Show AKS cluster detail
       debug:
           var: output.aks[0]
```

Make sure the playbook and all other task files are saved in the same folder. To run this playbook, use command `ansible-playbook` as follow:

```bash
ansible-playbook aks-kubenet.yml
```

After running the playbook, output similar to the following example shows the progress and results:

```Output
PLAY [localhost] ***************************************************************

TASK [Gathering Facts] *********************************************************
ok: [localhost]

TASK [Ensure resource group exist] *********************************************
ok: [localhost]

TASK [Create vnet] *************************************************************
included: /home/devops/aks-kubenet/vnet.yml for localhost

TASK [Create vnet] *************************************************************
ok: [localhost]

TASK [Create subnet] ***********************************************************
ok: [localhost]

TASK [Create AKS] **************************************************************
included: /home/devops/aks-kubenet/aks.yml for localhost

TASK [List supported kubernetes version from Azure] ****************************
 [WARNING]: Azure API profile latest does not define an entry for
ContainerServiceClient

ok: [localhost]

TASK [Create AKS cluster with vnet] ********************************************
changed: [localhost]

TASK [Associate network resources with the node subnet] ************************
included: /home/devops/aks-kubenet/associate.yml for localhost

TASK [Get route table] *********************************************************
ok: [localhost]

TASK [Get network security group] **********************************************
ok: [localhost]

TASK [Parse subnet id] *********************************************************
ok: [localhost]

TASK [Associate network resources with the node subnet] ************************
changed: [localhost]

TASK [Get details of the AKS] **************************************************
ok: [localhost]

TASK [Show AKS cluster detail] *************************************************
ok: [localhost] => {
    "output.aks[0]": {
        "id": /subscriptions/BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB/resourcegroups/aksansibletest/providers/Microsoft.ContainerService/managedClusters/aksansibletest",
        "kube_config": "apiVersion: ...",
        "location": "eastus",
        "name": "aksansibletest",
        "properties": {
            "agentPoolProfiles": [
                {
                    "count": 3,
                    "maxPods": 110,
                    "name": "nodepool1",
                    "osDiskSizeGB": 100,
                    "osType": "Linux",
                    "storageProfile": "ManagedDisks",
                    "vmSize": "Standard_D2_v2",
                    "vnetSubnetID": "/subscriptions/BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB/resourceGroups/aksansibletest/providers/Microsoft.Network/virtualNetworks/aksansibletest/subnets/aksansibletest"
                }
            ],
            "dnsPrefix": "aksansibletest",
            "enableRBAC": false,
            "fqdn": "aksansibletest-cda2b56c.hcp.eastus.azmk8s.io",
            "kubernetesVersion": "1.12.6",
            "linuxProfile": {
                "adminUsername": "azureuser",
                "ssh": {
                    "publicKeys": [
                        {
                            "keyData": "ssh-rsa ..."
                        }
                    ]
                }
            },
            "networkProfile": {
                "dnsServiceIP": "10.0.0.10",
                "dockerBridgeCidr": "172.17.0.1/16",
                "networkPlugin": "kubenet",
                "podCidr": "192.168.0.0/16",
                "serviceCidr": "10.0.0.0/16"
            },
            "nodeResourceGroup": "MC_aksansibletest_pcaksansibletest_eastus",
            "provisioningState": "Succeeded",
            "servicePrincipalProfile": {
                "clientId": "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"
            }
        },
        "type": "Microsoft.ContainerService/ManagedClusters"
    }
}

PLAY RECAP *********************************************************************
localhost                  : ok=15   changed=2    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

## Clean up

Remove these resources by deleting the resource group. Here we are deleting the resource group **aksansibletest**.

```yml
---
- hosts: localhost
  vars:
      resource_group: aksansibletest
  tasks:
      - name: Clean up resource group
        azure_rm_resourcegroup:
            name: "{{ resource_group }}"
            state: absent
            force: yes
```

Save this playbook to `clean.yml`, and run with command `ansible-playbook`:

```bash
ansible-playbook clean.yml
```

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Configure Azure CNI networking in Azure Kubernetes Service (AKS) using Ansible](https://docs.microsoft.com/azure/ansible/ansible-aks-configure-CNI-networking)