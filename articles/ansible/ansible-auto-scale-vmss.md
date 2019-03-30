---
title: Automatically scale a virtual machine scale set in Azure using Ansible
description: Learn how to use Ansible to scale a virtual machine scale set with autoscale in Azure
ms.service: azure
keywords: ansible, azure, devops, bash, playbook, scale, autoscale, virtual machine, virtual machine scale set, vmss
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 12/10/2018
---

# Automatically scale a virtual machine scale set in Azure using Ansible
Ansible allows you to automate the deployment and configuration of resources in your environment. You can use Ansible to manage your virtual machine scale set (VMSS) in Azure, the same as you would manage any other Azure resource. 

When you create a scale set, you define the number of VM instances that you wish to run. As your application demand changes, you can automatically increase or decrease the number of VM instances. The ability to autoscale lets you keep up with customer demand or respond to application performance changes throughout the lifecycle of your app. In this article, you will create an autoscale setting and associate it to an existing virtual machine scale set. In the autoscale setting, you can configure a rule to scale out or scale in as you want.

## Prerequisites
- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation1.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation1.md)] [!INCLUDE [ansible-prereqs-for-cloudshell-use-or-vm-creation2.md](../../includes/ansible-prereqs-for-cloudshell-use-or-vm-creation2.md)]
- An existing Azure virtual machine scale set. - If you don't have a one, [Create virtual machine scale sets in Azure using Ansible](https://docs.microsoft.com/azure/ansible/ansible-create-configure-vmss).

> [!Note]
> Ansible 2.7 is required to run the following the sample playbooks in this tutorial. 

## Auto scale based on a schedule   
To enable autoscale on a scale set, you first define an autoscale profile. This profile defines the default, minimum, and maximum scale set capacity. These limits let you control cost by not continually creating VM instances, and balance acceptable performance with a minimum number of instances that remain in a scale-in event. 

You can scale in and scale out in Virtual Machine Scale Sets by a recurring schedule, or by a particular date. This section presents a sample Ansible playbook that creates an autoscale setting that increases the number of VM instances to three in your scale sets on 10:00 of every Monday, Pacific Time zone. 

```yml
---
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    vmss_name: myVMSS
    name: autoscalesetting
  tasks: 
    - name: Create auto scaling
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

## Auto scale based on performance data
If your application demand increases, the load on the VM instances in your scale sets increases. If this increased load is consistent, rather than just a brief demand, you can configure autoscale rules to increase the number of VM instances in the scale set. When these VM instances are created and your applications are deployed, the scale set starts to distribute traffic to them through the load balancer. You control what metrics to monitor, such as CPU or disk, how long the application load must meet a given threshold, and how many VM instances to add to the scale set.

You can scale in and scale out in Virtual Machine Scale Sets based on performance metric thresholds, by a recurring schedule, or by a particular date. This section presents a sample Ansible playbook that checks the workload in the past 10 minutes on 18:00 of every Monday, Pacific timezone, and scales out the number of VM instances in your scale sets to four or scales in to one instance according to the CPU percentage metrics. 

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
    
  - name: Create auto scaling
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
    - name: Retrieve auto scale settings information
      azure_rm_autoscale_facts:
        resource_group: "{{ resource_group }}"
        name: "{{ name }}"
      register: autoscale_query
    
    - debug:
        var: autoscale_query.autoscales[0]
```

## Disable the autoscale settings
You can disable the autoscale setting by changing `enabled: true` to `enabled: false`, or deleting the autoscale settings with the playbook as follows:

```yml
- hosts: localhost
  vars:
    resource_group: myResourceGroup
    name: autoscalesetting
  tasks: 
    - name: Delete auto scaling
      azure_rm_autoscale:
         resource_group: "{{ resource_group }}"
         name: "{{ name }}"
         state: absent
```

## Next steps
> [!div class="nextstepaction"] 
> [Ansible sample playbook for virtual machine scale sets](https://github.com/Azure-Samples/ansible-playbooks/tree/master/vmss)