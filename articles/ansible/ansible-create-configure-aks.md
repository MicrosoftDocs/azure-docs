---
title: Create and configure Azure Kubernetes Service clusters in Azure using Ansible
description: Learn how to use Ansible to create and manage an Azure Kubernetes Service cluster in Azure
ms.service: ansible
keywords: ansible, azure, devops, bash, cloudshell, playbook, aks, container, Kubernetes
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 08/23/2018
---

# Create and configure Azure Kubernetes Service clusters in Azure using Ansible
Ansible allows you to automate the deployment and configuration of resources in your environment. You can use Ansible to manage your Azure Kubernetes Service (AKS). This article shows you how to use Ansible to create and configure an Azure Kubernetes Service cluster.

## Prerequisites
- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- **Azure service principal** - When [creating the service principal](/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest#create-the-service-principal), note the following values: **appId**, **displayName**, **password**, and **tenant**.

- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]

> [!Note]
> Ansible 2.6 is required to run the following the sample playbooks in this tutorial. 

## Create a managed AKS cluster
The following sample Ansible playbook creates a resource group, and an AKS cluster that resides in the resource group:

  ```yaml
  - name: Create Azure Kubernetes Service
    hosts: localhost
    connection: local
    vars:
      resource_group: myResourceGroup
      location: eastus
      aks_name: myAKSCluster
      username: azureuser
      ssh_key: "your_ssh_key"
      client_id: "your_client_id"
      client_secret: "your_client_secret"
    tasks:
    - name: Create resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        location: "{{ location }}"
    - name: Create a managed Azure Container Services (AKS) cluster
      azure_rm_aks:
        name: "{{ aks_name }}"
        location: "{{ location }}"
        resource_group: "{{ resource_group }}"
        dns_prefix: "{{ aks_name }}"
        linux_profile:
          admin_username: "{{ username }}"
          ssh_key: "{{ ssh_key }}"
        service_principal:
          client_id: "{{ client_id }}"
          client_secret: "{{ client_secret }}"
        agent_pool_profiles:
          - name: default
            count: 2
            vm_size: Standard_D2_v2
        tags:
          Environment: Production
  ```

The following bullets help to explain the preceding Ansible playbook code:
- The first section within **tasks** defines a resource group named **myResourceGroup** within the **eastus** location. 
- The second section within **tasks** defines an AKS cluster named **myAKSCluster** within the **myResourceGroup** resource group. 

To create the AKS cluster with Ansible, save the preceding sample playbook as `azure_create_aks.yml`, and run the playbook with the following command:

  ```bash
  ansible-playbook azure_create_aks.yml
  ```

The output from the **ansible-playbook* command looks similar to the following showing that the AKS cluster has been successfully created:

  ```bash
  PLAY [Create AKS] ****************************************************************************************

  TASK [Gathering Facts] ********************************************************************************************
  ok: [localhost]

  TASK [Create resource group] **************************************************************************************
  changed: [localhost]

  TASK [Create a Azure Container Services (AKS) cluster] ***************************************************
  changed: [localhost]

  PLAY RECAP *********************************************************************************************************
  localhost                  : ok=3    changed=2    unreachable=0    failed=0
  ```

## Scale AKS nodes

The sample playbook in the previous section defines two nodes. If you need fewer or more container workloads on your cluster, you can easily adjust the number of nodes. The sample playbook in this section increases the number of nodes from two nodes to three. Modifying the node count is done by changing the **count** value in the **agent_pool_profiles** block. 

Enter your own `ssh_key`, `client_id`, and `client_secret` in the **service_principal** block:

```yaml
- name: Scale AKS cluster
  hosts: localhost
  connection: local
  vars:
    resource_group: myResourceGroup
    location: eastus
    aks_name: myAKSCluster
    username: azureuser
    ssh_key: "your_ssh_key"
    client_id: "your_client_id"
    client_secret: "your_client_secret"
  tasks:
  - name: Scaling an existed AKS cluster
    azure_rm_aks:
        name: "{{ aks_name }}"    
        location: "{{ location }}"
        resource_group: "{{ resource_group }}" 
        dns_prefix: "{{ aks_name }}" 
        linux_profile:
          admin_username: "{{ username }}"
          ssh_key: "{{ ssh_key }}"
        service_principal:
          client_id: "{{ client_id }}"
          client_secret: "{{ client_secret }}"
        agent_pool_profiles:
          - name: default
            count: 3
            vm_size: Standard_D2_v2
```

To scale the Azure Kubernetes Service cluster with Ansible, save the preceding playbook as *azure_configure_aks.yml*, and run the playbook as follows:

  ```bash
  ansible-playbook azure_configure_aks.yml
  ```

The following output shows that the AKS cluster has been successfully created:

  ```bash
  PLAY [Scale AKS cluster] ***************************************************************

  TASK [Gathering Facts] ******************************************************************
  ok: [localhost]

  TASK [Scaling an existed AKS cluster] **************************************************
  changed: [localhost]

  PLAY RECAP ******************************************************************************
  localhost                  : ok=2    changed=1    unreachable=0    failed=0
  ```
## Delete a managed AKS cluster

The following sample Ansible playbook section illustrates how to delete an AKS cluster:

  ```yaml
  - name: Delete a managed Azure Container Services (AKS) cluster
    hosts: localhost
    connection: local
    vars:
      resource_group: myResourceGroup
      aks_name: myAKSCluster
    tasks:
    - name: 
      azure_rm_aks:
        name: "{{ aks_name }}"
        resource_group: "{{ resource_group }}"
        state: absent
   ```

To delete the Azure Kubernetes Service cluster with Ansible, save the preceding playbook as *azure_delete_aks.yml*, and run the playbook as follows:

  ```bash
  ansible-playbook azure_delete_aks.yml
  ```

The following output shows that the AKS cluster has been successfully deleted:
  ```bash
PLAY [Delete a managed Azure Container Services (AKS) cluster] ****************************

TASK [Gathering Facts] ********************************************************************
ok: [localhost]

TASK [azure_rm_aks] *********************************************************************

PLAY RECAP *********************************************************************
localhost                  : ok=2    changed=1    unreachable=0    failed=0
  ```
  
## Next steps
> [!div class="nextstepaction"] 
> [Tutorial: Scale application in Azure Kubernetes Service (AKS)](https://docs.microsoft.com/azure/aks/tutorial-kubernetes-scale)
