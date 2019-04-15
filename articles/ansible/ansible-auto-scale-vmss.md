---
title: Tutorial - Autoscale a virtual machine scale set in Azure using Ansible | Microsoft Docs
description: Learn how to use Ansible to scale a virtual machine scale set with autoscale in Azure
keywords: ansible, azure, devops, bash, playbook, scale, autoscale, virtual machine, virtual machine scale set, vmss
ms.topic: tutorial
ms.service: ansible
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.date: 04/04/2019
---

# Tutorial: Autoscale a virtual machine scale set in Azure using Ansible

[!INCLUDE [ansible-27-note.md](../../includes/ansible-27-note.md)]

[Azure virtual machine scale sets](/virtual-machine-scale-sets/overview) let you configure a group of identical, load balanced VMs. The number of VM instances can automatically change in response to demand or on a defined schedule. This feature is called [autoscale](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-autoscale-overview). Autoscale reduces the management overhead to monitor and optimize the performance of your application. Using Ansible, you can specify the autoscale rules that define the acceptable performance for a positive customer experience.

In this article, Ansible is used to create an autoscale setting and associate the setting with an existing virtual machine scale set.

## Prerequisites

- [!INCLUDE [open-source-devops-prereqs-azure-sub.md](../../includes/open-source-devops-prereqs-azure-sub.md)]
- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]
- An existing Azure virtual machine scale set. - If you don't have a one, [Create virtual machine scale sets in Azure using Ansible](/azure/ansible/ansible-create-configure-vmss).

## Autoscale based on a schedule

To enable autoscale on a scale set, you first define an autoscale profile. This profile defines the default, minimum, and maximum scale set capacity. These limits let you control cost by not continually creating VM instances, and balance acceptable performance with a minimum number of instances that remain in a scale-in event. 

Ansible allows you to scale your virtual machine scale sets on a specific date or recurring schedule.

The following playbook increases the number of VM instances to three at 10:00 every Monday:

```yml
---
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    vmss_name: myVMSS
    name: autoscalesetting
  tasks: 
    - name: Create autoscaling
      azure_rm_autoscale:
         resource_group: "{{ resource_group }}"
         name: "{{ name }}"
         target:
           namespace: "Microsoft.Compute"
           types: "virtualMachineScaleSets"
           name: "{{ vmss_name }}"
         enabled: true
         profiles:
         - count: '3'
           min_count: '3'
           max_count: '3'
           name: Auto created scale condition
           recurrence_timezone: Pacific Standard Time
           recurrence_frequency: Week
           recurrence_days:
              - Monday
           recurrence_mins:
              - '0'
           recurrence_hours:
              - '10'
```

Save this playbook as *vmss-auto-scale.yml*. To run the Ansible playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook vmss-auto-scale.yml
```

## Autoscale based on performance data

If your application demand increases, the load on the VM instances in your scale sets increases. If this increased load is consistent, rather than just a brief demand, you can configure autoscale rules to increase the number of VM instances in the scale set. When these VM instances are created and your applications are deployed, the scale set starts to distribute traffic to them through the load balancer. Ansible allows you to control what metrics to monitor, such as CPU usage, disk usage, and app-load time. You can scale in and scale out in virtual machine scale sets based on performance metric thresholds, by a recurring schedule, or by a particular date. 

The following playbook checks the CPU workload for the previous 10 minutes at 18:00 every Monday. 

Based on the CPU percentage metrics, the playbook does one of the following actions:

- Scales out the number of VM instances to four
- Scales in the number of VM instances to one

```yml
---
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    vmss_name: myVMSS
    name: autoscalesetting
  tasks:
  - name: Get facts of the resource group
    azure_rm_resourcegroup_facts:
      name: "{{ resource_group }}"
    register: rg

  - name: Get VMSS resource uri
    set_fact:
      vmss_id: "{{ rg.ansible_facts.azure_resourcegroups[0].id }}/providers/Microsoft.Compute/virtualMachineScaleSets/{{ vmss_name }}"
    
  - name: Create autoscaling
    azure_rm_autoscale:
      resource_group: "{{ resource_group }}"
      name: "{{ name }}"
      target: "{{ vmss_id }}"
      enabled: true
      profiles:
      - count: '1'
        max_count: '1'
        min_count: '1'
        name: 'This scale condition is executed when none of the other scale condition(s) match'
        recurrence_days:
          - Monday
        recurrence_frequency: Week
        recurrence_hours:
          - 18
        recurrence_mins:
          - 0
        recurrence_timezone: Pacific Standard Time
      - count: '1'
        min_count: '1'
        max_count: '4'
        name: Auto created scale condition
        recurrence_days:
          - Monday
        recurrence_frequency: Week
        recurrence_hours:
          - 18
        recurrence_mins:
          - 0
        recurrence_timezone: Pacific Standard Time
        rules:
          - cooldown: 5
            direction: Increase
            metric_name: Percentage CPU
            metric_resource_uri: "{{ vmss_id }}"
            operator: GreaterThan
            statistic: Average
            threshold: 70
            time_aggregation: Average
            time_grain: 1
            time_window: 10
            type: ChangeCount
            value: '1'
          - cooldown: 5
            direction: Decrease
            metric_name: Percentage CPU
            metric_resource_uri: "{{ vmss_id }}"
            operator: LessThan
            statistic: Average
            threshold: 30
            time_aggregation: Average
            time_grain: 1
            time_window: 10
            type: ChangeCount
            value: '1'
```

Save this playbook as *vmss-auto-scale-metrics.yml*. To run the Ansible playbook, use the **ansible-playbook** command as follows:

```bash
ansible-playbook vmss-auto-scale-metrics.yml
```

## Get information for existing autoscale settings

You can get any autoscale setting's detail via the *azure_rm_autoscale_facts* module with the playbook as follows:

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    name: autoscalesetting
  tasks: 
    - name: Retrieve autoscale settings information
      azure_rm_autoscale_facts:
        resource_group: "{{ resource_group }}"
        name: "{{ name }}"
      register: autoscale_query
    
    - debug:
        var: autoscale_query.autoscales[0]
```

## Disable autoscale settings

There are two ways to disable autoscale settings. One way is to change the `enabled` key from `true` to `false`. The second way - as shown in the following playbook is to delete the autoscale setting. 

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    name: autoscalesetting
  tasks: 
    - name: Delete autoscaling
      azure_rm_autoscale:
         resource_group: "{{ resource_group }}"
         name: "{{ name }}"
         state: absent
```

## Next steps

> [!div class="nextstepaction"] 
> [Ansible on Azure](/azure/ansible)