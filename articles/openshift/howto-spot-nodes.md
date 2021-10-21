---
title: Use Azure Spot Virtual Machines in an Azure Red Hat OpenShift (ARO) cluster
description: Discover how to utilize Azure Spot Virtual Machines in Azure Red Hat OpenShift (ARO)
author: nilsanderselde
ms.author: suvetriv
ms.service: azure-redhat-openshift
keywords: spot, nodes, aro, deploy, openshift, red hat
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 10/21/2021
ms.custom: template-how-to #Required; leave this attribute/value as-is.
---

# Use Azure Spot Virtual Machines in an Azure Red Hat OpenShift (ARO) cluster

This article provides the necessary details that allow you to configure your Azure Red Hat OpenShift cluster (ARO) to use Azure Spot Virtual Machines.

## Before you begin

This article assumes you've already created a new cluster or have an existing cluster with latest updates applied. If you need an ARO cluster, see the [ARO quickstart](tutorial-create-cluster.md) for a public cluster, or the [private cluster tutorial](howto-create-private-cluster-4x.md) for a private cluster. The steps to configure your cluster to use Spot VMs are the same for both private and public clusters.

It is also assumed you have an understanding of [how Spot VMs work](../virtual-machines/spot-vms.md).


## Adding Spot VMs

The use of Spot VMs is specified by adding the `spotVMOptions` field within the template spec of a MachineSet.

To create a Spot MachineSet in ARO, the easiest way is to use an existing worker MachineSet as a template. The benefit of this is that you only need to change a few fields rather than starting from scratch.

The YAML fields you need to change when creating a Spot MachineSet based on a worker MachineSet are:

```yaml
* `metadata.name`
* `spec.selector.matchLabels.machine.openshift.io/cluster-api-machineset`
* `spec.template.metadata.labels.machine.openshift.io/cluster-api-machineset`
* `spec.template.spec.providerSpec.value.spotVMOptions` (add this field, set it to `{}`)
```

An abridged example of Spot MachineSet YAML is below. It highlights the key changes you need to make when basing a new Spot MachineSet on an existing worker MachineSet, including some additional information for context. (It does not represent an entire, functional MachineSet; many fields have been omitted below.)

```yaml
apiVersion: machine.openshift.io/v1beta1
kind: MachineSet
metadata:
  name: aro-cluster-abcd1-spot-eastus
spec:
  replicas: 2
  selector:
    matchLabels:
      machine.openshift.io/cluster-api-cluster: aro-cluster-abcd1
      machine.openshift.io/cluster-api-machineset: aro-cluster-abcd1-spot-eastus
  template:
    metadata:
        machine.openshift.io/cluster-api-machineset: aro-cluster-abcd1-spot-eastus
    spec:
      providerSpec:
        value:
          spotVMOptions: {}
      taints:
        - effect: NoExecute
          key: spot
          value: 'true'
	image:
            offer: aro4
            publisher: azureopenshift
            resourceID: ''
            sku: aro_47
            version: 47.83.20210522
```

Once you've created the MachineSet successfully, you will see as many machines created as you specified. First the machines are provisioned, and then they are provisioned as a node. Once they are provisioned as a node, pods can be scheduled on them.

## Scheduling interruptible workloads

It's recommended to add a taint to the Spot nodes to prevent noninterruptible nodes from being scheduled on them, and to add tolerations of this taint to any pods that you want scheduled on them. You can taint the nodes via the MachineSet spec.

For example, you can add the following YAML to `spec.template.spec`:

```
     taints:
        - effect: NoExecute
          key: spot
          value: 'true'
```

This would prevent pods from being scheduled on the resultant node unless they had a toleration for `spot='true'` taint, and it would evict any pods lacking that toleration.

To learn more about applying taints and tolerations, please read [Controlling pod placement using node taints](https://docs.openshift.com/container-platform/4.7/nodes/scheduling/nodes-scheduler-taints-tolerations.html).

## Quota

Machines may go into a failed state due to quota issues if the quota for the machine type you are using is too low for a brief moment, even if it should eventually be enough (e.g. one node is still deleting when another is being created). Because of this, it's recommended to set quota for the machine type you'll be using for Spot instances to be slightly higher than should be needed (maybe by 2*n, where n is the number of cores used by a machine). This overhead would avoid having to remedy failed machines, which, though relatively simple, is still manual intervention. (See Troubleshooting section below).

## Node Readiness

As is explained in the Spot VM documentation linked above, VMs go into Deallocated provisioning state when they are no longer available, or no longer available at the maximum price specified.

This will manifest itself in OpenShift as Not Ready nodes. The machines will remain healthy, in Phase "Provisioned as node".

They will return to being Ready once the VMs are available again

## Troubleshooting

### Node stuck in Not Ready state, underlying VM deallocated

If a node is stuck for a long period of time in Not Ready state after its VM was deallocated, you can try deleting it, or deleting its corresponding OpenShift machine object.

### Spot Machine stuck in Failed state

If a machine (OpenShift object) that uses a Spot VM is stuck in a Failed state, try deleting it manually. If it cannot be deleted due to a 403 because the VM no longer exists, then edit the machine and remove the finalizers.

## Support

Due to the dynamic nature of SPOT workers, issues with SPOT workers must be raised through a support case.
