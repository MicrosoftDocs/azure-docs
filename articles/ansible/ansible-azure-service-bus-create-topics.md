---
title: Create an Azure Service Bus topic by using Ansible
description: Learn how to use Ansible to create an Azure Service Bus topic
ms.service: azure
keywords: ansible, azure, devops, bash, playbook, service bus, topics, subscriptions
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
---

# Create an Azure Service Bus topic by using Ansible

[Azure Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview) is a fully managed enterprise [integration](https://azure.microsoft.com/en-us/product-categories/integration/) message broker. You can use topics to send and receive messages. While a queue is often used for point-to-point communication, topics are useful in publish/subscribe scenarios.

This tutorial shows you how to create an Azure Service Bus topic and a subscription for the topic. It also shows you how to get the connection string using Ansible.

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]

> [!Note]
> Ansible 2.8 is required to run the following the sample playbooks in this tutorial. 

## Create an Azure Service Bus topic

The first sample Ansible playbook creates:

- a resource group
- a Service Bus namespace in this resource group
- a Service Bus topic under this namespace.

```yml
---
- hosts: localhost
  vars:
      resource_group: servicebustest
      location: eastus
      namespace: servicebustestns
      topic: servicebustesttopic
  tasks:
    - name: Ensure resource group exist
      azure_rm_resourcegroup:
          name: "{{ resource_group }}"
          location: "{{ location }}"
    - name: Create a namespace
      azure_rm_servicebus:
          name: "{{ namespace }}"
          resource_group: "{{ resource_group }}"
    - name: Create a topic
      azure_rm_servicebustopic:
          name: "{{ topic }}"
          namespace: "{{ namespace }}"
          resource_group: "{{ resource_group }}"
      register: topic
    - debug:
          var: topic
```

Save this playbook as *servicebus_topic.yml*. To run this Ansible playbook, use the `ansible-playbook` command as follows:

```bash
ansible-playbook servicebus_topic.yml
```

## Create a subscription

The second sample Ansible playbook creates a subscription under a Service Bus topic. Azure Service Bus Topics can have multiple, independent subscriptions. A subscriber to a topic can receive a copy of each message sent to that topic. Subscriptions are named entities, which are durably created but can optionally expire or auto-delete.

```yml
---
- hosts: localhost
  vars:
      resource_group: servicebustest
      location: eastus
      namespace: servicebustestns
      topic: servicebustesttopic
      subscription: servicebustestsubs
  tasks:
    - name: Create a subscription
      azure_rm_servicebustopicsubscription:
          name: "{{ subscription }}"
          topic: "{{ topic }}"
          namespace: "{{ namespace }}"
          resource_group: "{{ resource_group }}"
      register: subs
    - debug:
          var: subs
```

Save this playbook as *servicebus_subscription.yml*. To run this Ansible playbook, use the `ansible-playbook` command as follows:

```bash
ansible-playbook servicebus_subscription.yml
```

## Create a Shared Access Signatures(SAS) policy for the Service Bus topic

Shared Access Signatures(SAS) are a claims-based authorization mechanism using simple tokens. This section shows you how to create two SAS policies for a Service Bus topic with different privileges.

> [!Tip]
> The **rights** field represents the privilege a user have with the Service Bus topic. The value can be one of `manage`, `listen`, `send` or `listen_send`

```yaml
---
- hosts: localhost
  vars:
      resource_group: servicebustest
      namespace: servicebustestns
      topic: servicebustesttopic
  tasks:
    - name: Create a policy with send and listen privilege
      azure_rm_servicebussaspolicy:
          name: "{{ topic }}-{{ item }}"
          topic: "{{ topic }}"
          namespace: "{{ namespace }}"
          resource_group: "{{ resource_group }}"
          rights: "{{ item }}"
      with_items:
        - send
        - listen
      register: policy
    - debug:
          var: policy
```

Save this playbook as *servicebus_topic_policy.yml*. To run this Ansible playbook, use the `ansible-playbook` command as follows:

```bash
ansible-playbook servicebus_topic_policy.yml
```

## Retrieve information about a namespace

This section shows you how to query a namespace.

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

Save this playbook as *servicebus_info.yml*. To run this Ansible playbook, use the `ansible-playbook` command as follows:

```bash
ansible-playbook servicebus_info.yml
```

## Retrieve the information about a Service Bus topic or subscription

This playbook shows you how to:
- query a Service Bus topic's information
- list all subscription details under this Service Bus topic
 
> [!Tip] 
> The **show_sas_policies** field indicates whether to show the SAS policies under this queue. This field is set to `False` to avoid additional network overhead by default.

```yaml
---
- hosts: localhost
  vars:
      resource_group: servicebustest
      namespace: servicebustestns
      topic: servicebustesttopic
  tasks:
    - name: Get a topic's information
      azure_rm_servicebus_facts:
          type: topic
          name: "{{ topic }}"
          namespace: "{{ namespace }}"
          resource_group: "{{ resource_group }}"
          show_sas_policies: yes
      register: topic_fact
    - name: "List subscriptions under topic {{ topic }}"
      azure_rm_servicebus_facts:
          type: subscription
          topic: "{{ topic }}"
          namespace: "{{ namespace }}"
          resource_group: "{{ resource_group }}"
      register: subs_fact
    - debug:
          var: "{{ item }}"
      with_items:
        - topic_fact.servicebuses[0]
        - subs_fact.servicebuses
```

Save this playbook as *servicebus_list.yml*. To run this Ansible playbook, use the `ansible-playbook` command as follows:

```bash
ansible-playbook servicebus_list.yml
```

## Revoke a SAS policy for the Service Bus topic

Here's a playbook for deleting a SAS policy for a Service Bus topic.

```yaml
---
- hosts: localhost
  vars:
      resource_group: servicebustest
      namespace: servicebustestns
      topic: servicebustesttopic
  tasks:
    - name: Delete a policy
      azure_rm_servicebussaspolicy:
          name: "{{ topic }}-policy"
          topic: "{{ topic }}"
          namespace: "{{ namespace }}"
          resource_group: "{{ resource_group }}"
          state: absent
```

Save this playbook as *servicebus_topic_policy_delete.yml*. To run this Ansible playbook, use the `ansible-playbook` command as follows:

```bash
ansible-playbook servicebus_topic_policy_delete.yml
```

## Clean up

If you don't need these resources, you can delete them by running the following playbook.

```yml
---
- hosts: localhost
  vars:
      resource_group: servicebustest
      namespace: servicebustestns
      topic: servicebustesttopic
      subscription: servicebustestsubs
  tasks:
    - name: Delete subscription
      azure_rm_servicebustopicsubscription:
          name: "{{ subscription }}"
          topic: "{{ topic }}"
          resource_group: "{{ resource_group }}"
          namespace: "{{ namespace }}"
          state: absent
    - name: Delete topic
      azure_rm_servicebustopic:
          name: "{{ topic }}"
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
> [Ansible on Azure](https://docs.microsoft.com/azure/ansible/)