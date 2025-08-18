---
title: Troubleshoot a Kubernetes Cluster Node in NotReady,Scheduling Disabled after Runtime Upgrade
description: Learn what to do when your Kubernetes Cluster Node is in the state NotReady,Scheduling Disabled after a runtime upgrade.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 06/25/2025
ms.author: jeremyhouser
author: jeremyhouser-ms
---
# Troubleshoot a Kubernetes Cluster Node in NotReady,Scheduling Disabled state

The purpose of this guide is to troubleshoot a Kubernetes Cluster when 1 or more of its nodes fail to uncordon after a runtime upgrade. This guide is only applicable if that Node remains in the state `Ready,SchedulingDisabled`.

## Prerequisites

- Ability to run kubectl commands against the Kubernetes Cluster
- Familiarity with the capabilities referenced in this article by reviewing [how to connect to Kubernetes Clusters](howto-kubernetes-cluster-connect.md)

## Typical Cause

During a Nexus Cluster runtime upgrade on a Baremetal Machine hosting Tenant workloads, the system will cordon and drain Virtual Machine resources scheduled to that Baremetal Machine. It will then shut down the Baremetal Machine to complete the reimaging process. Once the Baremetal Machine completes the runtime upgrade and reboots, the expectation is that the system reschedules Virtual Machines to that Baremetal Machine. It would then uncordon the Virtual Machine, with the Kubernetes Cluster Node that Virtual Machine supports reflecting the appropriate state `Ready`.

However, a race condition may occur wherein the system fails to find Virtual Machines that should be scheduled to that Baremetal Machine. Each Virtual Machine is deployed using a virt-launcher pod. This race condition happens when the virt-launcher pod's image pull job isn't yet complete. Only after the image pull job is complete will the pod be schedulable to a Baremetal Machine. When the system examines these virt-launcher pods during the uncordon action execution, it can't find which Baremetal Machine the pod. Therefore the system skips uncordoning that Virtual Machine that that pod represents.

## Procedure

After Kubernetes Cluster Nodes are discovered in the `Ready,SchedulingDisabled` state, the following remediation may be engaged.

1. Use kubectl to list the nodes using the wide flag. Observe the node in **Ready,SchedulingDisabled** status.
    ~~~bash
    $ kubectl get nodes -o wide
    NAME                                          STATUS                      ROLES           AGE    VERSION    INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                    KERNEL-VERSION    CONTAINER-RUNTIME
    example-naks-control-plane-tgmw8              Ready,SchedulingDisabled    control-plane   2d6h   v1.30.12   10.4.32.10    <none>        Microsoft Azure Linux 3.0   6.6.85.1-2.azl3   containerd://2.0.0
    example-naks-agentpool1-md-s8vp4-xp98x        Ready,SchedulingDisabled    <none>          2d6h   v1.30.12   10.4.32.11    <none>        Microsoft Azure Linux 3.0   6.6.85.1-2.azl3   containerd://2.0.0
    ~~~

1. Issue the kubectl command to uncordon the Node in the undesired state.

    ~~~bash
    $ kubectl uncordon example-naks-agentpool1-md-s8vp4-xp98x
    node/example-naks-agentpool1-md-s8vp4-xp98x uncordoned
    ~~~

    Alternatively, as this issue is more common in larger scale deployments, it may be desirable to perform this action in bulk. In this case, issue the uncordon command as part of a loop to find and uncordon all affected Nodes.

    ~~~bash
    cordoned_nodes=$(kubectl get nodes -o wide --no-headers | awk '/SchedulingDisabled/ {print $1}')
    for node in $cordoned_nodes; do
        kubectl uncordon $node
    done
    ~~~


1. Use kubectl to list the nodes using the wide flag. Observe the node in **Ready** status.
    ~~~bash
    $ kubectl get nodes -o wide
    NAME                                          STATUS  ROLES           AGE    VERSION    INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                    KERNEL-VERSION    CONTAINER-RUNTIME
    example-naks-control-plane-tgmw8              Ready   control-plane   2d6h   v1.30.12   10.4.32.10    <none>        Microsoft Azure Linux 3.0   6.6.85.1-2.azl3   containerd://2.0.0
    example-naks-agentpool1-md-s8vp4-xp98x        Ready   <none>          2d6h   v1.30.12   10.4.32.11    <none>        Microsoft Azure Linux 3.0   6.6.85.1-2.azl3   containerd://2.0.0
    ~~~

If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).