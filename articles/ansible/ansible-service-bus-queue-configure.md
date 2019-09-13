---
title: Tutorial - Configure queues in Azure Service Bus using Ansible | Microsoft Docs
description: Learn how to use Ansible to create an Azure Service Bus queue
keywords: ansible, azure, devops, bash, playbook, service bus, queue
ms.topic: tutorial
ms.service: ansible
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.date: 04/30/2019
---

# Tutorial: Configure queues in Azure Service Bus using Ansible

[!INCLUDE [ansible-28-note.md](../../includes/ansible-28-note.md)]

[!INCLUDE [open-source-devops-intro-servicebus.md](../../includes/open-source-devops-intro-servicebus.md)]

[!INCLUDE [ansible-tutorial-goals.md](../../includes/ansible-tutorial-goals.md)]

> [!div class="checklist"]
>
> * Create a queue
> * Create a SAS plicy
> * Retrieve namespace information
> * Retrieve queue information
> * Revoke the queue SAS policy

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-cloudshell-use-or-vm-creation2.md)]

## Create the Service Bus queue

The sample playbook code creates the following resources:
- Azure resource group
- Service Bus namespace within the resource group
- Service Bus queue with the namespace

Save the following playbook as `servicebus_queue.yml`:

```yml
---
- hosts: localhost
  vars:
      resource_group: servicebustest
      location: eastus
      namespace: servicebustestns
      queue: servicebustestqueue
  tasks:
    - name: Ensure resource group exist
      azure_rm_resourcegroup:
          name: "{{ resource_group }}"
          location: "{{ location }}"
    - name: Create a namespace
      azure_rm_servicebus:
          name: "{{ namespace }}"
          resource_group: "{{ resource_group }}"
    - name: Create a queue
      azure_rm_servicebusqueue:
          name: "{{ queue }}"
          namespace: "{{ namespace }}"
          resource_group: "{{ resource_group }}"
      register: queue
    - debug:
          var: queue
```

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook servicebus_queue.yml
```

## Create the SAS policy

A [Shared Access Signature (SAS)](/azure/storage/common/storage-dotnet-shared-access-signature-part-1) is a claims-based authorization mechanism using tokens. 

The sample playbook code creates two SAS policies for a Service Bus queue with different privileges.

Save the following playbook as `servicebus_queue_policy.yml`:

```yml
---
- hosts: localhost
  vars:
      resource_group: servicebustest
      namespace: servicebustestns
      queue: servicebustestqueue
  tasks:
    - name: Create a policy with send and listen priviledge
      azure_rm_servicebussaspolicy:
          name: "{{ queue }}-policy"
          queue: "{{ queue }}"
          namespace: "{{ namespace }}"
          resource_group: "{{ resource_group }}"
          rights: listen_send
      register: policy
    - debug:
          var: policy
```

Before running the playbook, see the following notes:
- The `rights` value represents the privilege a user has with the queue. Specify one of the following values: `manage`, `listen`, `send`, or `listen_send`.

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook servicebus_queue_policy.yml
```

## Retrieve namespace information

The sample playbook code queries the namespace information.

Save the following playbook as `servicebus_namespace_info.yml`:

```yml
---
- hosts: localhost
  vars:
      resource_group: servicebustest
      namespace: servicebustestns
  tasks:
    - name: Get a namespace's information
      azure_rm_servicebus_facts:
          type: namespace
          name: "{{ namespace }}"
          resource_group: "{{ resource_group }}"
          show_sas_policies: yes
      register: ns
    - debug:
          var: ns
```

Before running the playbook, see the following notes:
- The `show_sas_policies` value indicates whether to show the SAS policies under the specified namespace. By default, the value is `False` to avoid additional network overhead.

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook servicebus_namespace_info.yml
```

## Retrieve queue information

The sample playbook code queries queue information. 

Save the following playbook as `servicebus_queue_info.yml`:

```yml
---
- hosts: localhost
  vars:
      resource_group: servicebustest
      namespace: servicebustestns
      queue: servicebustestqueue
  tasks:
    - name: Get a queue's information
      azure_rm_servicebus_facts:
          type: queue
          name: "{{ queue }}"
          namespace: "{{ namespace }}"
          resource_group: "{{ resource_group }}"
          show_sas_policies: yes
      register: queue
    - debug:
          var: queue
```

Before running the playbook, see the following notes:
- The `show_sas_policies` value indicates whether to show the SAS policies under the specified queue. By default, this value is set to `False` to avoid additional network overhead.

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook servicebus_queue_info.yml
```

## Revoke the queue SAS policy

The sample playbook code deletes a queue SAS policy.

Save the following playbook as `servicebus_queue_policy_delete.yml`:

```yml
---
- hosts: localhost
  vars:
      resource_group: servicebustest
      namespace: servicebustestns
      queue: servicebustestqueue
  tasks:
    - name: Create a policy with send and listen priviledge
      azure_rm_servicebussaspolicy:
          name: "{{ queue }}-policy"
          queue: "{{ queue }}"
          namespace: "{{ namespace }}"
          resource_group: "{{ resource_group }}"
          state: absent
```

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook servicebus_queue_policy_delete.yml
```

## Clean up resources

When no longer needed, delete the resources created in this article. 

Save the following code as `cleanup.yml`:

```yml
---
- hosts: localhost
  vars:
      resource_group: servicebustest
      namespace: servicebustestns
      queue: servicebustestqueue
  tasks:
    - name: Delete queue
      azure_rm_servicebusqueue:
          name: "{{ queue }}"
          resource_group: "{{ resource_group }}"
          namespace: "{{ namespace }}"
          state: absent
    - name: Delete namespace
      azure_rm_servicebus:
          name: "{{ namespace }}"
          resource_group: "{{ resource_group }}"
          state: absent
    - name: Delete resource group
      azure_rm_resourcegroup:
          name: "{{ resource_group }}"
          state: absent
          force_delete_nonempty: yes
```

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook cleanup.yml
```

## Next steps
> [!div class="nextstepaction"] 
> [Tutorial: Configure a topic in Azure Service Bus using Ansible](ansible-service-bus-topic-configure.md)