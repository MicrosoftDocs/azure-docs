---
title: Tutorial - Configure a cluster in Azure HDInsight using Ansible | Microsoft Docs
description: Learn how to use Ansible to create and resize an Azure HDInsight
keywords: ansible, azure, devops, bash, playbook, apache hadoop, hdinsight
ms.topic: tutorial
ms.service: ansible
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.date: 04/30/2019
---

# Tutorial: Configure a cluster in Azure HDInsight using Ansible

[!INCLUDE [ansible-28-note.md](../../includes/ansible-28-note.md)]

[Azure HDInsight](/azure/hdinsight/) is a Hadoop-based analytics service for processing data. HDInsight is an ETL (extract, transform, load) tool used to work with big data - either structured or unstructured. HDInsight supports several [cluster types](/azure/hdinsight/hadoop/apache-hadoop-introduction#cluster-types-in-hdinsight) where each type supports a different set of components. 

[!INCLUDE [ansible-tutorial-goals.md](../../includes/ansible-tutorial-goals.md)]

> [!div class="checklist"]
>
> * Create a storage account for HDInsight
> * Configure a [HDInsight Spark cluster](/azure/hdinsight/spark/apache-spark-overview).
> * Resize a cluster
> * Delete a cluster

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-cloudshell-use-or-vm-creation2.md)] 

## Create a random postfix

The playbook code in this section creates a random postfix to use as part of the Azure HDInsight cluster name.

```yml
- hosts: localhost
  vars:
    resource_group: "{{ resource_group_name }}"  
  tasks:
    - name: Prepare random prefix
      set_fact:
        rpfx: "{{ resource_group | hash('md5') | truncate(7, True, '') }}{{ 1000 | random }}"
      run_once: yes
```

## Create resource group

An Azure resource group is a logical container in which Azure resources are deployed and managed.

The playbook code in this section creates a resource group.


```yml
  tasks:
    - name: Create a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        location: "{{ location }}"
```

## Create a storage account and retrieve key

An Azure storage account is used as the default storage for the HDInsight cluster. 

The playbook code in this section retrieves the key used to access the storage account.

```yml
- name: Create storage account
  azure_rm_storageaccount:
      resource_group: "{{ resource_group }}"
      name: "{{ storage_account_name }}"
      account_type: Standard_LRS
      location: eastus2

- name: Get storage account keys
  azure_rm_resource:
    api_version: '2018-07-01'
    method: POST
    resource_group: "{{ resource_group }}"
    provider: storage
    resource_type: storageaccounts
    resource_name: "{{ storage_account_name }}"
    subresource:
      - type: listkeys
  register: storage_output

- debug:
    var: storage_output
```

## Create an HDInsight Spark cluster

The playbook code in this section creates the Azure HDInsight cluster.

```yml
- name: Create instance of Cluster
  azure_rm_hdinsightcluster:
    resource_group: "{{ resource_group }}"
    name: "{{ cluster_name }}"
    location: eastus2
    cluster_version: 3.6
    os_type: linux
    tier: standard
    cluster_definition:
      kind: spark
      gateway_rest_username: http-user
      gateway_rest_password: MuABCPassword!!@123
    storage_accounts:
      - name: "{{ storage_account_name }}.blob.core.windows.net"
        is_default: yes
        container: "{{ cluster_name }}"
        key: "{{ storage_output['response']['keys'][0]['value'] }}"
    compute_profile_roles:
      - name: headnode
        target_instance_count: 1
        vm_size: Standard_D3
        linux_profile:
          username: sshuser
          password: MuABCPassword!!@123
      - name: workernode
        target_instance_count: 1
        vm_size: Standard_D3
        linux_profile:
          username: sshuser
          password: MuABCPassword!!@123
      - name: zookeepernode
        target_instance_count: 3
        vm_size: Medium
        linux_profile:
          username: sshuser
          password: MuABCPassword!!@123
```

The instance creation can take several minutes to complete.

## Resize the cluster

After cluster creation, the only setting you can change is the number of worker nodes. 

The playbook code in this section increments the number of worker nodes by updating `target_instance_count` within `workernode`.

```yml
- name: Resize cluster
  azure_rm_hdinsightcluster:
    resource_group: "{{ resource_group }}"
    name: "{{ cluster_name }}"
    location: eastus2
    cluster_version: 3.6
    os_type: linux
    tier: standard
    cluster_definition:
      kind: spark
      gateway_rest_username: http-user
      gateway_rest_password: MuABCPassword!!@123
    storage_accounts:
      - name: "{{ storage_account_name }}.blob.core.windows.net"
        is_default: yes
        container: "{{ cluster_name }}"
        key: "{{ storage_output['response']['keys'][0]['value'] }}"
    compute_profile_roles:
      - name: headnode
        target_instance_count: 1
        vm_size: Standard_D3
        linux_profile:
          username: sshuser
          password: MuABCPassword!!@123
      - name: workernode
        target_instance_count: 2
        vm_size: Standard_D3
        linux_profile:
          username: sshuser
          password: MuABCPassword!!@123
      - name: zookeepernode
        target_instance_count: 3
        vm_size: Medium
        linux_profile:
          username: sshuser
          password: MuABCPassword!!@123
    tags:
      aaa: bbb
  register: output
```

## Delete the cluster instance

Billing for HDInsight clusters is prorated per minute. 

The playbook code in this section deletes the cluster.

```yml
- name: Delete instance of Cluster
  azure_rm_hdinsightcluster:
    resource_group: "{{ resource_group }}"
    name: "{{ cluster_name }}"
    state: absent
```

## Get the sample playbook

There are two ways to get the complete sample playbook:
- [Download the playbook](https://github.com/Azure-Samples/ansible-playbooks/blob/master/hdinsight_create.yml) and save it to `hdinsight_create.yml`.
- Create a new file named `hdinsight_create.yml` and copy into it the following contents:

```yml
---
- hosts: localhost
  vars:
    resource_group: "{{ resource_group_name }}"
  tasks:
    - name: Prepare random prefix
      set_fact:
        rpfx: "{{ resource_group | hash('md5') | truncate(7, True, '') }}{{ 1000 | random }}"
      run_once: yes

- hosts: localhost
  #roles:
  #  - azure.azure_preview_modules
  vars:
    resource_group: "{{ resource_group_name }}"
    location: eastus2
    vnet_name: myVirtualNetwork
    subnet_name: mySubnet
    cluster_name: mycluster{{ rpfx }}
    storage_account_name: mystorage{{ rpfx }}

  tasks:
    - name: Create a resource group
      azure_rm_resourcegroup:
        name: "{{ resource_group }}"
        location: "{{ location }}"

    - name: Create storage account
      azure_rm_storageaccount:
        resource_group: "{{ resource_group }}"
        name: "{{ storage_account_name }}"
        account_type: Standard_LRS
        location: "{{ location }}"

    - name: Get storage account keys
      azure_rm_resource:
        api_version: '2018-07-01'
        method: POST
        resource_group: "{{ resource_group }}"
        provider: storage
        resource_type: storageaccounts
        resource_name: "{{ storage_account_name }}"
        subresource:
          - type: listkeys
      register: storage_output
    - debug:
        var: storage_output

    - name: Create instance of Cluster
      azure_rm_hdinsightcluster:
        resource_group: "{{ resource_group }}"
        name: "{{ cluster_name }}"
        location: "{{ location }}"
        cluster_version: 3.6
        os_type: linux
        tier: standard
        cluster_definition:
          kind: spark
          gateway_rest_username: http-user
          gateway_rest_password: MuABCPassword!!@123 
        storage_accounts:
          - name: "{{ storage_account_name }}.blob.core.windows.net" 
            is_default: yes
            container: "{{ cluster_name }}"
            key: "{{ storage_output['response']['keys'][0]['value'] }}"
        compute_profile_roles:
          - name: headnode
            target_instance_count: 1
            vm_size: Standard_D3
            linux_profile:
              username: sshuser
              password: MuABCPassword!!@123
          - name: workernode
            target_instance_count: 1
            vm_size: Standard_D3
            linux_profile:
              username: sshuser
              password: MuABCPassword!!@123
          - name: zookeepernode
            target_instance_count: 3
            vm_size: Medium
            linux_profile:
              username: sshuser
              password: MuABCPassword!!@123

    - name: Resize cluster
      azure_rm_hdinsightcluster:
        resource_group: "{{ resource_group }}"
        name: "{{ cluster_name }}"
        location: "{{ location }}"
        cluster_version: 3.6
        os_type: linux
        tier: standard
        cluster_definition:
          kind: spark
          gateway_rest_username: http-user
          gateway_rest_password: MuABCPassword!!@123 
        storage_accounts:
          - name: "{{ storage_account_name }}.blob.core.windows.net"
            is_default: yes
            container: "{{ cluster_name }}"
            key: "{{ storage_output['response']['keys'][0]['value'] }}"
        compute_profile_roles:
          - name: headnode
            target_instance_count: 1
            vm_size: Standard_D3
            linux_profile:
              username: sshuser
              password: MuABCPassword!!@123
          - name: workernode
            target_instance_count: 2
            vm_size: Standard_D3
            linux_profile:
              username: sshuser
              password: MuABCPassword!!@123
          - name: zookeepernode
            target_instance_count: 3
            vm_size: Medium
            linux_profile:
              username: sshuser
              password: MuABCPassword!!@123
        tags:
          aaa: bbb
      register: output
    - debug:
        var: output

    - name: Assert the state has changed
      assert:
        that:
          - output.changed

    - name: Delete instance of Cluster
      azure_rm_hdinsightcluster:
        resource_group: "{{ resource_group }}"
        name: "{{ cluster_name }}"
        state: absent
```

## Run the sample playbook

In this section, run the playbook to test various features shown in this article.

Before running the playbook, make the following changes:
- In the `vars` section, replace the `{{ resource_group_name }}` placeholder with the name of your resource group.

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook hdinsight.yml
```

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
        force_delete_nonempty: yes
        state: absent
```

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook cleanup.yml
```

## Next steps

> [!div class="nextstepaction"] 
> [Ansible on Azure](/azure/ansible/)