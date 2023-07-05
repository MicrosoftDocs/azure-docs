---
title: Use Azure Spot Virtual Machines in an Azure Red Hat OpenShift (ARO) cluster
description: Discover how to utilize Azure Spot Virtual Machines in Azure Red Hat OpenShift (ARO)
author: johnmarco
ms.author: johnmarc
ms.service: azure-redhat-openshift
keywords: spot, nodes, aro, deploy, openshift, red hat
ms.topic: how-to
ms.date: 10/21/2021
ms.custom: template-how-to, ignite-fall-2021
---

# Use Azure Spot Virtual Machines in an Azure Red Hat OpenShift (ARO) cluster

This article provides the necessary details that allow you to configure your Azure Red Hat OpenShift cluster (ARO) to use Azure Spot Virtual Machines.

Using Azure Spot Virtual Machines allows you to take advantage of our unused capacity at a significant cost savings. At any point in time when Azure needs the capacity back, the Azure infrastructure will evict Azure Spot Virtual Machines. For more information around Spot Instances, see [Spot Virtual Machines](../virtual-machines/spot-vms.md).

## Before you begin

Before getting started, ensure that you have an Azure Red Hat Openshift cluster deployed. If you need an ARO cluster, see the [ARO quickstart](tutorial-create-cluster.md) for a public cluster, or the [private cluster tutorial](howto-create-private-cluster-4x.md) for a private cluster. The steps to configure your cluster to use Spot VMs are the same for both private and public clusters.

An ARO cluster should always have at least three worker nodes that are non-Spot VMs, and three control nodes. An ARO cluster can't have any spot VM-based control nodes.

## Add Spot VMs

Machine management in Azure Red Hat Openshift is accomplished by using MachineSet. MachineSet resources are groups of machines. MachineSets are to machines as ReplicaSets are to pods. If you need more machines or must scale them down, you change the *Replicas* field on the machine set to meet your compute need. To learn more, check out our OpenShift [MachineSet documentation](https://docs.openshift.com/container-platform/4.8/machine_management/creating_machinesets/creating-machineset-azure.html)

The use of Spot VMs is specified by adding the `spotVMOptions` field within the template spec of a MachineSet.
To get this MachineSet created, we will:

1. Get a copy of a MachineSet running on your cluster.
2. Create a modified MachineSet configuration.
3. Deploy this MachineSet to your cluster

First, [connect to your OpenShift cluster using the CLI](tutorial-connect-cluster.md).

```azurecli-interactive
oc login $apiServer -u kubeadmin -p <kubeadmin password>
```

Next, you'll list the MachineSets on your cluster. A default cluster will have 3 MachineSets deployed: 
```azurecli-interactive
oc get machinesets -n openshift-machine-api
```

The following shows a sample output from this command: 
```
NAME                                    DESIRED   CURRENT   READY   AVAILABLE   AGE
aro-cluster-5t2dj-worker-eastus1   1         1         1       1           2d22h
aro-cluster-5t2dj-worker-eastus2   1         1         1       1           2d22h
aro-cluster-5t2dj-worker-eastus3   1         1         1       1           2d22h
```

Next, you'll describe the MachineSet deployed. Replace \<machineset\> with one of the MachineSets listed above and output it to a file.

```azurecli-interactive
oc get machineset <machineset> -n openshift-machine-api -o yaml > spotmachineset.yaml
```

You'll need to change the following parameters in the MachineSet:
- `metadata.name`
- `spec.selector.matchLabels.machine.openshift.io/cluster-api-machineset`
- `spec.template.metadata.labels.machine.openshift.io/cluster-api-machineset`
- `spec.template.spec.providerSpec.value.spotVMOptions` (Add this field, and set it to `{}`.)


Below is an abridged example of Spot MachineSet YAML that highlights the key changes you need to make when basing a new Spot MachineSet on an existing worker MachineSet, including some additional information for context. (The example doesn't represent an entire, functional MachineSet; many fields have been omitted below.)

```
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
```

Once the file is updated, apply it.

```azurecli-interactive
oc create -f spotmachineset.yaml
```

To validate that your MachineSet has been successfully created, run the following command:
```azurecli-interactive
oc get machinesets -n openshift-machine-api
```

Here's a sample output. Your Machineset is ready once you have machines in the "Ready" state.
```
  NAME                                    DESIRED   CURRENT   READY   AVAILABLE   AGE
aro-cluster-5t2dj-worker-eastus1           1         1         1       1           3d1h
aro-cluster-5t2dj-worker-eastus2           1         1         1       1           3d1h
aro-cluster-5t2dj-worker-eastus3           1         1         1       1           3d1h
spot                                       1         1         1       1           2m47s
```

## Schedule interruptible workloads

It's recommended to add a taint to the Spot nodes to prevent non-interruptible nodes from being scheduled on them, and to add tolerations of this taint to any pods you want scheduled on them. You can taint the nodes via the MachineSet spec.

For example, you can add the following YAML to `spec.template.spec`:

```
     taints:
        - effect: NoExecute
          key: spot
          value: 'true'
```

This prevents pods from being scheduled on the resultant node unless they had a toleration for `spot='true'` taint, and it would evict any pods lacking that toleration.

To learn more about applying taints and tolerations, read [Controlling pod placement using node taints](https://docs.openshift.com/container-platform/4.7/nodes/scheduling/nodes-scheduler-taints-tolerations.html).

## Quota

Machines may go into a failed state due to quota issues if the quota for the machine type you're using is too low for a brief moment, even if it should eventually be enough (for example, one node is still deleting when another is being created). Because of this, it's recommended to set quota for the machine type you'll be using for Spot instances to be slightly higher than should be needed (maybe by 2*n, where n is the number of cores used by a machine). This overhead would avoid having to remedy failed machines, which, though relatively simple, is still manual intervention.

## Node readiness

As is explained in the Spot VM documentation linked above, VMs go into Deallocated provisioning state when they're no longer available, or no longer available at the maximum price specified.

This will manifest itself in OpenShift as **Not Ready** nodes. The machines will remain healthy, in phase **Provisioned as node**.

They'll return to being **Ready** once the VMs are available again

## Troubleshooting

### Node stuck in Not Ready state, underlying VM deallocated

If a node is stuck for a long period of time in Not Ready state after its VM was deallocated, you can try deleting it, or deleting its corresponding OpenShift machine object.

### Spot Machine stuck in Failed state

If a machine (OpenShift object) that uses a Spot VM is stuck in a Failed state, try deleting it manually. If it can't be deleted due to a 403 because the VM no longer exists, then edit the machine and remove the finalizers.
