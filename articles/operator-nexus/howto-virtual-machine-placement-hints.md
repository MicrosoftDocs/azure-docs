---
title: Understanding placement hints in Azure Operator Nexus virtual machine #Required; page title is displayed in search results. Include the brand.
description: Working with placement hints in Azure Operator Nexus virtual machine #Required; article description that is displayed in search results. 
author: dramasamy #Required; your GitHub user alias, with correct capitalization.
ms.author: dramasamy #Required; microsoft alias of author; optional team alias.
ms.service: azure-operator-nexus #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 07/28/2023 #Required; mm/dd/yyyy format.
ms.custom: template-how-to-pattern #Required; leave this attribute/value as-is.
---

# Working with placement hints in Azure Operator Nexus virtual machine

In this article, you learn how to use hints to guide the placement of virtual machines within the Azure Operator Nexus environment. These placement hints can be used to create affinity or anti-affinity between virtual machines, bare-metal machines, or racks. Use placement hints to ensure virtual machines are scheduled in the desired way within the Azure Operator Nexus environment.

Affinity rules allow you to specify that virtual machines should be hosted on the same physical machine or rack. Conversely, anti-affinity rules ensure that virtual machines are hosted on different physical machines or racks.

You can increase the overall resilience of your application by using anti-affinity rules to spread virtual machines across different failure domains (racks, physical machines, etc.). You can increase the cost efficiency of your application by using affinity rules to pack virtual machines onto fewer physical machines.

## Prerequisites

Before proceeding with this how-to guide, ensure you have completed all steps in the Azure Operator Nexus virtual machine [QuickStart guide](./quickstarts-tenant-workload-deployment.md).


## Placement hints configuration

This section explains the concept of placement hints and how each field in the API works, which is useful when setting up and managing virtual machines.

```json
{
 "hintType": "Affinity/AntiAffinity",
 "resourceId": "ARM ID of the virtual machine, bare-metal machine, or rack",
 "schedulingExecution": "Hard/Soft",
 "scope": "Rack/Machine"
}
```

### Hint type

The `hintType` argument is used in placement hints to specify whether the placement hint supports affinity or anti-affinity with the referenced resources.

The hintType argument has two possible values: `Affinity` or `AntiAffinity`.

* Affinity: If the hintType is set to Affinity, the placement hint is used to create an affinity rule between the VM and the referenced resources. As a result, the VM is scheduled on the specific bare-metal machine, rack, or close to the virtual machine instance as the referenced resource.
* AntiAffinity: If the hintType is set to AntiAffinity, the placement hint is used to create an anti-affinity rule between the VM and the referenced resources. As a result, the VM is scheduled on a different bare-metal machine, rack, or virtual machine instance from the referenced resource.

### Resource ID

The `resourceId` argument in placement hints specifies the target object against which the placement hints are checked. The target object can be any of the following.

* A Virtual Machine: If the target object is a virtual machine, the placement hint is checked against that specific virtual machine instance.
* A BareMetalMachine: If the target object is a bare-metal machine, the placement hint is checked against that specific bare-metal machine.
* A Rack: If the target object is a rack, the placement hint is checked against all the bare-metal machines running on that rack.

> [!IMPORTANT]
> The resourceId argument must be specified in the form of an ARM ID, and it must be a valid resource ID for the target object. If the resourceId is incorrect or invalid, the placement hint will not work correctly, and the VM scheduling may fail.

### Scope

The `scope` argument is used in placement hints to specify the scope of the virtual machine affinity or anti-affinity placement hint. The scope argument is only applicable when the `resourceId` argument targets a virtual machine.

The scope argument has two possible values: `Machine` or `Rack`.

* Machine: If the scope is set to Machine, the placement hint applies to the same bare-metal machine as the specified virtual machine. For example, if the placement hint specifies that the VM should be placed on the same bare-metal machine as specified VM, the scope would be set to Machine.
* Rack: If the scope is set to Rack, the placement hint applies to the rack that the specified virtual machine belongs to. For example, if the placement hint specifies that the VM should be placed on the same rack that the specified virtual machine is currently placed, the scope would be set to Rack.

> [!IMPORTANT]
> This argument can't be left blank.

### Scheduling execution

The `schedulingExecution` argument is used in placement hints to specify whether the placement hint is a hard or soft requirement during scheduling.

The schedulingExecution argument has two possible values: `Hard` or `Soft`.

* Hard: When the schedulingExecution is set to Hard, the placement hint is considered a strict requirement during scheduling. As a result, the scheduler only places the virtual machine on the specified resource specified in the placement hint. If there's no resource available that satisfies the hard requirement, the scheduling of the virtual machine fails.
* Soft: When the schedulingExecution is set to Soft, the placement hint is considered a preference during scheduling. As a result, the scheduler tries to place the virtual machine on the specified resource specified in the placement hint, but if it isn't possible, the scheduler can place the virtual machine on a different resource.

## Rack affinity and anti-affinity placement hints example

### Get the available rack IDs

1. Set the required variables.

    ```bash
    NEXUS_CLUSTER_NAME=<Operator Nexus cluster name>
    NEXUS_CLUSTER_RG=<Operator Nexus cluster resource group>
    NEXUS_CLUSTER_SUBSCRIPTION="$(az account show -o tsv --query id)"
    NEXUS_CLUSTER_MANAGED_RG="$(az networkcloud cluster show -n $NEXUS_CLUSTER_NAME -g $NEXUS_CLUSTER_RG --query managedResourceGroupConfiguration.name | tr -d '\"')"
    ```

2. Get the rack ID.

    ```azurecli
    az networkcloud rack list -g $NEXUS_CLUSTER_MANAGED_RG --subscription $NEXUS_CLUSTER_SUBSCRIPTION --query [].id
    ```

3. Sample output.

    ```bash
    $ az networkcloud rack list -g $NEXUS_CLUSTER_MANAGED_RG --subscription $NEXUS_CLUSTER_SUBSCRIPTION --query [].id    
    [
      "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/racks/<network-aggregation-rack>",
      "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/racks/<compute-rack-1>",
      "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/racks/<compute-rack-2>",
      "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/racks/<compute-rack-3>",
      "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/racks/<compute-rack-4>",
      "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/racks/<compute-rack-n>"
    ]
    ```

### Place virtual machine on a specific rack

In this example, we explore the concepts of soft and hard affinities, particularly about placing virtual machines on specific racks.

> [!NOTE]
> In this and the following examples, only variations of the `--placement-hints` argument are provided. For the actual creation of the VM with placement hints, you should add `--placement-hints` to the CLI illustrated in the VM [QuickStart guide](./quickstarts-tenant-workload-deployment.md).

#### Strict scheduling (rack affinity)

This placement hint uses the `Affinity` hintType to ensure that the virtual machine is only scheduled on the specified rack with the given rack ID. If the rack is unavailable or lacks capacity, the scheduling fails. This placement hint can be useful in situations where you want to ensure that certain virtual machines are placed on specific racks for performance, security, or other reasons.

```bash
--placement-hints '[{"hintType":"Affinity","resourceId":"/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/racks/<compute-rack-2>","schedulingExecution":"Hard","scope":"Rack"}]'
```

> [!NOTE]
> The current placement hint configuration with the Affinity hintType ensures that the virtual machine is scheduled exclusively on the specified rack with the provided rack ID. However, it's important to note that the rack affinity cannot be specified for more than one rack with `Hard` scheduling execution. This limitation may influence your deployment strategy, particularly if you are considering placing VMs on multiple racks and allowing the scheduler to select from them.

#### Preferred scheduling (rack affinity)

This placement hint utilizes the `Affinity` hintType to establish an affinity rule between the virtual machine and the designated rack. It also employs a `Soft` schedulingExecution to enable the VM to be placed on an alternative rack in case the specified rack isn't accessible or lacks capacity.

```bash
--placement-hints '[{"hintType":"Affinity","resourceId":"/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/racks/<compute-rack-2>","schedulingExecution":"Soft","scope":"Rack"}]'
```

### Prevent virtual machine from being placed on a specific rack

In this example, we explore the concepts of soft and hard anti-affinities, particularly about preventing virtual machines from being placed on specific racks.

#### Strict scheduling (rack anti-affinity)

This placement hint uses both the `AntiAffinity` hintType and `Hard` schedulingExecution to prevent the virtual machine from being scheduled on the specified rack identified by the rack ID. In this configuration, the scheduler strictly follows these placement hints. However, if the rack ID is incorrect or there's not enough capacity on other racks, the VM placement may fail due to the strict application of the `Hard` scheduling rule

```bash
--placement-hints '[{"hintType":"AntiAffinity","resourceId":"/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/racks/<compute-rack-2>","schedulingExecution":"Hard","scope":"Rack"}]'
```

#### Preferred scheduling (rack anti-affinity)

This placement hint uses the `AntiAffinity` hintType with the intention of avoiding a specific rack for the virtual machine's placement. However, it's important to note that despite this preference, the VM could still be placed on this undesired rack if other racks don't have enough capacity. This placement happens because the schedulingExecution is set to `Soft`, which allows for the VM to be accommodated on the initially avoided rack if other options aren't feasible.

```bash
--placement-hints '[{"hintType":"AntiAffinity","resourceId":"/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/racks/<compute-rack-2>","schedulingExecution":"Soft","scope":"Rack"}]'
```

## Bare-metal machine affinity and anti-affinity placement hints example

### Get the available bare-metal machine IDs

1. Set the required variables.

    ```bash
    NEXUS_CLUSTER_NAME=<Operator Nexus cluster name>
    NEXUS_CLUSTER_RG=<Operator Nexus cluster resource group>
    NEXUS_CLUSTER_SUBSCRIPTION="$(az account show -o tsv --query id)"
    NEXUS_CLUSTER_MANAGED_RG="$(az networkcloud cluster show -n $NEXUS_CLUSTER_NAME -g $NEXUS_CLUSTER_RG --query managedResourceGroupConfiguration.name | tr -d '\"')"
    ```

2. Get the rack ID.

    ```azurecli
    az networkcloud baremetalmachine list -g $NEXUS_CLUSTER_RG --subscription $NEXUS_CLUSTER_SUBSCRIPTION --query "sort_by([].{ID: id, RackID: rackId}, &RackID)"
    ```

3. Sample output.

    ```bash
    $ az networkcloud baremetalmachine list -g $NEXUS_CLUSTER_RG --subscription $NEXUS_CLUSTER_SUBSCRIPTION --query "sort_by([].{ID: id, RackID: rackId}, &RackID)"
    [
      {
        "ID": "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/bareMetalMachines/<machine-name>",
        "RackID": "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/racks/<compute-rack-1>"
      },
      {
        "ID": "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/bareMetalMachines/<machine-name>",
        "RackID": "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/racks/<compute-rack-2>"
      },
      {
        "ID": "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/bareMetalMachines/<machine-name>",
        "RackID": "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/racks/<compute-rack-3>"
      },
      {
        "ID": "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/bareMetalMachines/<machine-name>",
        "RackID": "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/racks/<compute-rack-4>"
      },
      {
        "ID": "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/bareMetalMachines/<machine-name>",
        "RackID": "/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/racks/<compute-rack-n>"
      }
    ]
    ```

### Place virtual machine on a specific bare-metal machine

In this example, we explore the concepts of soft and hard affinities, particularly about placing virtual machines on specific bare-metal machines.

#### Strict scheduling (bare-metal machine affinity)

This placement hint uses the `Affinity` hintType to ensure that the virtual machine is only scheduled on the specified bare-metal machine with the given bare-metal machine ID. If the bare-metal machine is unavailable or lacks capacity, the scheduling fails. This placement hint can be useful in situations where you want to ensure that certain virtual machines are placed on specific bare-metal machine for performance, security, or other reasons.

```bash
--placement-hints '[{"hintType":"Affinity","resourceId":"/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/bareMetalMachines/<machine-name>","schedulingExecution":"Hard","scope":"Machine"}]'
```

#### Preferred scheduling (bare-metal machine affinity)

This placement hint utilizes the `Affinity` hintType to establish an affinity rule between the virtual machine and the designated bare-metal machine. It also employs a `Soft` schedulingExecution to enable the VM to be placed on an alternative bare-metal machine in case the specified bare-metal machine isn't accessible or lacks capacity.

```bash
--placement-hints '[{"hintType":"Affinity","resourceId":"/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/bareMetalMachines/<machine-name>","schedulingExecution":"Soft","scope":"Machine"}]'
```

### Prevent virtual machine from being placed on a specific bare-metal machine

In this example, we explore the concepts of soft and hard anti-affinities, particularly about preventing virtual machines from being placed on specific bare-metal machines.

#### Strict scheduling (bare-metal machine anti-affinity)

This placement hint uses both the `AntiAffinity` hintType and `Hard` schedulingExecution to prevent the virtual machine from being scheduled on the specified bare-metal machine identified by the bare-metal machine ID. In this configuration, the scheduler strictly follows these placement hints. However, if the bare-metal machine ID is incorrect or there's not enough capacity on other bare-metal machines, the VM placement may fail due to the strict application of the `Hard` scheduling rule

```bash
--placement-hints '[{"hintType":"AntiAffinity","resourceId":"/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/bareMetalMachines/<machine-name>","schedulingExecution":"Hard","scope":"Machine"}]'
```

#### Preferred scheduling (bare-metal machine anti-affinity)

This placement hint uses the `AntiAffinity` hintType with the intention of avoiding a specific bare-metal machine for the virtual machine's placement. However, it's important to note that despite this preference, the VM could still be placed on this undesired bare-metal machine if other bare-metal machines don't have enough capacity. This placement happens because the schedulingExecution is set to `Soft`, which allows for the VM to be accommodated on the initially avoided bare-metal machine if other options aren't feasible.

```bash
--placement-hints '[{"hintType":"AntiAffinity","resourceId":"/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/bareMetalMachines/<machine-name>","schedulingExecution":"Soft","scope":"Machine"}]'
```

## VM to VM affinity and anti-affinity placement hints example

### Get the available virtual machine IDs

1. Set the required variables.

    ```bash
    RESOURCE_GROUP=<Target VM resource group>
    NEXUS_CLUSTER_SUBSCRIPTION="$(az account show -o tsv --query id)"
    ```

2. Get the virtual machine ID.

    ```azurecli
    az networkcloud virtualmachine list -g $RESOURCE_GROUP --subscription $NEXUS_CLUSTER_SUBSCRIPTION --query [].id
    ```

3. Sample output.

    ```bash
    $ az networkcloud virtualmachine list -g $RESOURCE_GROUP --subscription $NEXUS_CLUSTER_SUBSCRIPTION --query [].id
    [
      "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.NetworkCloud/virtualMachines/<vm-1>",
      "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.NetworkCloud/virtualMachines/<vm-2>",
      "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.NetworkCloud/virtualMachines/<vm-3>",
      "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.NetworkCloud/virtualMachines/<vm-n>"
    ]
    ```

### Place virtual machine near to a specific virtual machine

This section explores the placement of virtual machines near certain VMs, highlighting the important role of the `scope` parameter in placement hints configuration. The scheduler, through the defined scope, directs VM placements either on the same bare-metal machine or within the same rack as the referenced VM resourceId. It's important to note that while the examples provided here illustrate the `Hard` scheduling execution, you can use `Soft` scheduling as needed, based on your specific use case.

#### Place virtual machines on a same bare-metal machine (VM affinity)

In this example, by specifying `Affinity` as the hint type and `Machine` as the scope, the configuration results in virtual machine being placed on the same bare-metal machine as the VM identified by the given resource ID. As a result, the new VM shares the same bare-metal machine as the referenced VM, leading to potentially lower inter-VM latencies and enhanced performance.

```bash
--placement-hints '[{"hintType":"Affinity","resourceId":"/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.NetworkCloud/virtualMachines/<vm-1>","schedulingExecution":"Hard","scope":"Machine"}]'
```

#### Place virtual machines in a same rack (VM affinity)

In this example, the configuration with `Affinity` as the hint type and `Rack` as the scope, leads to the placement of virtual machines within the same rack as the VM identified by the given resource ID. As a result, the new VMs are placed in physical proximity to the reference VM, potentially reducing network latency and enhancing performance.

```bash
--placement-hints '[{"hintType":"Affinity","resourceId":"/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.NetworkCloud/virtualMachines/<vm-1>","schedulingExecution":"Hard","scope":"Rack"}]'
```

### Prevent virtual machines from being placed near to a specific virtual machine (VM anti-affinity)

In this section, the `AntiAffinity` hint type is used to prevent VMs from being placed close to certain other VMs. The `scope` parameter decides if this separation happens at the machine level or rack level. This configuration is useful when VMs need to be spread out across different hardware to avoid faults or performance issues.

#### Prevent virtual machines from being placed on a same bare-metal machine (VM anti-affinity)

In this example, when you set the scope to `Machine`, it prevents VMs from being placed on the same bare-metal machine. This approach boosts fault tolerance by reducing the risk of a single machine's failure affecting workload, hence increasing the overall robustness.

```bash
--placement-hints '[{"hintType":"AntiAffinity","resourceId":"/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/virtualMachines/<vm-2>","schedulingExecution":"Hard","scope":"Machine"}]'
```

#### Prevent virtual machines from being placed in a same rack (VM anti-affinity)

In this example, setting the scope to `Rack` ensures VMs aren't placed within the same rack. This configuration helps enhancing fault tolerance by ensuring a failure of a single rack doesn't affect the workload.

```bash
--placement-hints '[{"hintType":"AntiAffinity","resourceId":"/subscriptions/<subscription>/resourceGroups/<managed-resource-group>/providers/Microsoft.NetworkCloud/virtualMachines/<vm-2>","schedulingExecution":"Hard","scope":"Rack"}]'
```

## Next steps

While the examples provided in this article demonstrate some common use cases, the API can be used to implement a wide range of placement scenarios, making it a flexible and adaptable solution for managing virtual machine placement. Adjust the `scope`, `schedulingExecution`, and `hintType` parameters in different combinations to understand how they affect VM placements. Proper usage of placement hints can improve the availability and resilience of applications and services running in the Azure Operator Nexus instance.
