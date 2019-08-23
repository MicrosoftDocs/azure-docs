---
title: Tutorial - Configure topics in Azure Service Bus using Ansible | Microsoft Docs
description: Learn how to use Ansible to create an Azure Service Bus topic
keywords: ansible, azure, devops, bash, playbook, service bus, topics, subscriptions
ms.topic: tutorial
ms.service: ansible
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.date: 04/30/2019
---

# Tutorial: Configure topics in Azure Service Bus using Ansible

[!INCLUDE [ansible-28-note.md](../../includes/ansible-28-note.md)]

[!INCLUDE [open-source-devops-intro-servicebus.md](../../includes/open-source-devops-intro-servicebus.md)]

[!INCLUDE [ansible-tutorial-goals.md](../../includes/ansible-tutorial-goals.md)]

> [!div class="checklist"]
>
> * Create a topic
> * Create a subscription
> * Create a SAS policy
> * Retrieve namespace information
> * Retrieve topic and subscription information
> * Revoke a SAS policy

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-subscription.md](../../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [ansible-prereqs-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-cloudshell-use-or-vm-creation2.md)]

## Create the Service Bus topic

The sample playbook code creates the following resources:
- Azure resource group
- Service Bus namespace within the resource group
- Service Bus topic with the namespace

Save the following playbook as `servicebus_topic.yml`:

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

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook servicebus_topic.yml
```

## Create the subscription

The sample playbook code creates the subscription under a Service Bus topic. Azure Service Bus topics can have multiple subscriptions. A subscriber to a topic can receives a copy of each message sent to the topic. Subscriptions are named entities, which are durably created, but can optionally expire.

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

Save the following playbook as `servicebus_subscription.yml`:

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook servicebus_subscription.yml
```

## Create the SAS policy

A [Shared Access Signature (SAS)](/azure/storage/common/storage-dotnet-shared-access-signature-part-1) is a claims-based authorization mechanism using tokens. 

The sample playbook code creates two SAS policies for a Service Bus queue with different privileges.

Save the following playbook as `servicebus_topic_policy.yml`:

```yml
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

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook servicebus_topic_policy.yml
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

## Retrieve topic and subscription information

The sample playbook code queries for the following information:
- Service Bus topic information
- List of subscription details for the topic
 
Save the following playbook as `servicebus_list.yml`:

```yml
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

Before running the playbook, see the following notes:
- The `show_sas_policies` value indicates whether to show the SAS policies under the specified queue. By default, this value is set to `False` to avoid additional network overhead.

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook servicebus_list.yml
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

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook servicebus_topic_policy_delete.yml
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

Run the playbook using the `ansible-playbook` command:

```bash
ansible-playbook cleanup.yml
```

## Next steps
> [!div class="nextstepaction"] 
> [Ansible on Azure](/azure/ansible/)