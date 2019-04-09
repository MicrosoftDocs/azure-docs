---
title: Tutorial - Configure Azure CNI networking in Azure Kubernetes Service (AKS) using Ansible
description: Learn how to use Ansible to configure kubenet networking in Azure Kubernetes Service (AKS) cluster
ms.service: ansible
keywords: ansible, azure, devops, bash, cloudshell, playbook, aks, container, Kubernetes
author: TomArcherMsft
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 04/04/2019
---

# Tutorial: Configure Azure CNI networking in Azure Kubernetes Service (AKS) using Ansible

In Azure Kubernetes Service(AKS), you can deploy a cluster that uses one of the following two network models:

- [**Kubenet networking**](https://docs.microsoft.com/en-us/azure/aks/configure-kubenet) - the network resources are typically created and configured as the AKS cluster is deployed.
- [**Azure Container Networking Interface (CNI) networking**](https://docs.microsoft.com/en-us/azure/aks/configure-azure-cni) - the AKS cluster is connected to existing virtual network resources and configurations.

Refer to [Network concepts for applications in Azure Kubernetes Sevrice (AKS)](https://docs.microsoft.com/en-us/azure/aks/concepts-network) for core concepts that provide networking to your applications in AKS.

This article shows you how to use Ansible to create an AKS cluster and configure Azure CNI (advanced) networking.

## Prerequisites

- [!INCLUDE [open-source-devops-prereqs-azure-sub.md](../../includes/open-source-devops-prereqs-azure-sub.md)]
- [!INCLUDE [open-source-devops-create-sp.md](../../includes/open-source-devops-create-sp.md)]
- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]

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

This section creates an AKS cluster with the virtual network. Save these tasks to *aks.yml*.

Before creation, we use `azure_rm_aks_version` module to find the supported version.

> [!Tip]
> - The `vnet_subnet_id` is the subnet we create in previous section.
> - This task loads `ssh_key` from `~/.ssh/id_rsa.pub`. You can change it to RSA public key in the single-line format - starting with "ssh-rsa" (without the quotes).
> - `client_id` and `client_secret` are loaded from `~/.azure/credentials` where is the default credential file for Ansible. You can set these as your own service principal or load these from environment:
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
          network_plugin: azure
          docker_bridge_cidr: 172.17.0.1/16
          dns_service_ip: 10.2.0.10
          service_cidr: 10.2.0.0/24
  register: aks
```

## Combine tasks

Here is the complete playbook that calls all the preceding tasks. Save this playbook as *aks-azure-cni.yml*. You can replace **aksansibletest**, **aksansibletest**, **eastus** in the **vars** section with your own resource group name, AKS name and location respectively.

```yml
---
- hosts: localhost
  vars:
      resource_group: aksansibletest
      name: aksansibletest
      location: eastus
  tasks:
     - name: Ensure resource group exists
       azure_rm_resourcegroup:
           name: "{{ resource_group }}"
           location: "{{ location }}"

     - name: Create vnet
       include_tasks: vnet.yml

     - name: Create AKS
       vars:
           vnet_subnet_id: "{{ subnet.state.id }}"
       include_tasks: aks.yml

     - name: Show AKS cluster detail
       debug:
           var: aks
```

Save the playbook, with all other task files in the same folder. To run this playbook, use command `ansible-playbook` as follow:

```bash
ansible-playbook aks-azure-cni.yml
```

After running the playbook, output similar to the following shows the progress and results:

```Output
PLAY [localhost] ***************************************************************

TASK [Gathering Facts] *********************************************************
ok: [localhost]

TASK [Ensure resource group exists] ********************************************
changed: [localhost]

TASK [Create vnet] *************************************************************
included: /home/devops/aks-cni/vnet.yml for localhost

TASK [Create vnet] *************************************************************
changed: [localhost]

TASK [Create subnet] ***********************************************************
changed: [localhost]

TASK [Create AKS] **************************************************************
included: /home/devops/aks-cni/aks.yml for localhost

TASK [List supported kubernetes version from Azure] ****************************
 [WARNING]: Azure API profile latest does not define an entry for
ContainerServiceClient

ok: [localhost]

TASK [Create AKS cluster with vnet] ********************************************
changed: [localhost]

TASK [Show AKS cluster detail] *************************************************
ok: [localhost] => {
    "aks": {
        "aad_profile": {},
        "addon": {},
        "agent_pool_profiles": [
            {
                "count": 3,
                "name": "nodepool1",
                "os_disk_size_gb": 100,
                "os_type": "Linux",
                "storage_profile": "ManagedDisks",
                "vm_size": "Standard_D2_v2",
                "vnet_subnet_id": "/subscriptions/BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB/resourceGroups/aksansibletest/providers/Microsoft.Network/virtualNetworks/aksansibletest/subnets/aksansibletest"
            }
        ],
        "changed": true,
        "dns_prefix": "aksansibletest",
        "enable_rbac": false,
        "failed": false,
        "fqdn": "aksansibletest-0272707d.hcp.eastus.azmk8s.io",
        "id": "/subscriptions/BBBBBBBB-BBBB-BBBB-BBBB-BBBBBBBBBBBB/resourcegroups/aksansibletest/providers/Microsoft.ContainerService/managedClusters/aksansibletest",
        "kube_config": "..."
        },
        "location": "eastus",
        "name": "aksansibletest",
        "network_profile": {
            "dns_service_ip": "10.2.0.10",
            "docker_bridge_cidr": "172.17.0.1/16",
            "network_plugin": "azure",
            "network_policy": null,
            "pod_cidr": null,
            "service_cidr": "10.2.0.0/24"
        },
        "node_resource_group": "MC_aksansibletest_aksansibletest_eastus",
        "provisioning_state": "Succeeded",
        "service_principal_profile": {
            "client_id": "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"
        },
        "tags": null,
        "type": "Microsoft.ContainerService/ManagedClusters",
        "warnings": [
            "Azure API profile latest does not define an entry for ContainerServiceClient",
            "Azure API profile latest does not define an entry for ContainerServiceClient"
        ]
    }
}

PLAY RECAP *********************************************************************
localhost                  : ok=9    changed=4    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

## Clean up resources

When no longer needed, delete the resources created in this article. 

Save the following code as `cleanup.yml`:

```yml
---
- hosts: localhost
  vars:
      resource_group: **{{ resource_group_name }}**
  tasks:
      - name: Clean up resource group
        azure_rm_resourcegroup:
            name: "{{ resource_group }}"
            state: absent
            force: yes
```

In the **vars** section, replace the **{{ resource_group_name }}** placeholder with the name of your resource group.

Run the playbook using the **ansible-playbook** command:

```bash
ansible-playbook cleanup.yml
```

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Configure Azure Active Directory in Azure Kubernetes Service (AKS) using Ansible](./ansible-aks-configure-rbac.md)