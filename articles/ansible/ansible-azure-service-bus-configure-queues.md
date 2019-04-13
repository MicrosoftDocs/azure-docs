---
title: Tutorial - Configure a queue in Azure Service Bus using Ansible | Microsoft Docs
description: Learn how to use Ansible to create an Azure Service Bus queue
keywords: ansible, azure, devops, bash, playbook, service bus, queue
ms.topic: tutorial
ms.service: ansible
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.date: 04/04/2019
---

# Tutorial: Configure a queue in Azure Service Bus using Ansible

[!INCLUDE [ansible-28-note.md](../../includes/ansible-28-note.md)]

[Azure Service Bus](/azure/service-bus-messaging/service-bus-messaging-overview) is an enterprise [integration](https://azure.microsoft.com/product-categories/integration/) message broker. Queues support asynchronous communications between applications. An app sends messages to a queue, which stores the messages. The receiving application then connects to and reads the messages from the queue.

In this tutorial, an Azure Service Bus queue is created using Ansible.

## Prerequisites

- [!INCLUDE [open-source-devops-prereqs-azure-sub.md](../../includes/open-source-devops-prereqs-azure-sub.md)]
- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]

## Create the service bus queue

The sample playbook code creates a resource group and a Service Bus namespace within the resource group. The code then creates a queue within the namespace.

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

Run the playbook using the **ansible-playbook** command:

```bash
ansible-playbook servicebus_queue.yml
```

## Create the SAS policy

A [Shared Access Signature (SAS)](/azure/storage/common/storage-dotnet-shared-access-signature-part-1) is a claims-based authorization mechanism using tokens. 

The sample playbook code creates two SAS policies for a Service Bus queue with different privileges.

Save the following playbook as `servicebus_queue_policy.yml`:

```yaml
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

Before running the playbook, make the following changes:
- The `rights` key represents the privilege a user has with the queue. Specify one of the following: `manage`, `listen`, `send` or `listen_send`.

Run the playbook using the **ansible-playbook** command:

```bash
ansible-playbook servicebus_queue_policy.yml
```

## Retrieve namespace information

The sample playbook code queries the namespace information

> [!Tip]
> The **show_sas_policies** field indicates whether to show the SAS policies under this namespace. This field is set to `False` by default to avoid additional network overhead.

```yaml
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

Save this playbook as *servicebus_namespace_info.yml*. To run this Ansible playbook, use the `ansible-playbook` command as follows:

```bash
ansible-playbook servicebus_namespace_info.yml
```

## Retrieve queue information

This section shows you how to query a queue's information. 

> [!Tip] 
> The **show_sas_policies** field indicates whether to show the SAS policies under this queue. This field is set to `False` to avoid additional network overhead by default.

```yaml
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

Save this playbook as *servicebus_queue_info.yml*. To run this Ansible playbook, use the `ansible-playbook` command as follows:

```bash
ansible-playbook servicebus_queue_info.yml
```

## Revoke the queue SAS policy

This playbook shows you how to delete a SAS policy for a queue.

```yaml
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

Save this playbook as *servicebus_queue_policy_delete.yml*. To run this Ansible playbook, use the `ansible-playbook` command as follows:

```bash
ansible-playbook servicebus_queue_policy_delete.yml
```

## Clean up resources

If you don't need these resources, you can delete them by running the following playbook.

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

Save the preceding playbook as **rg_delete.yml**. To run the playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook rg_delete.yml
```

## Next steps
> [!div class="nextstepaction"] 
> [Create an Azure Service Bus topic by using Ansible](https://docs.microsoft.com/azure/ansible/ansible-service-bus-create-topics)