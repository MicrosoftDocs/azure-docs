---
title: Troubleshoot a Kubernetes Cluster Node in NotReady,Scheduling Disabled after Runtime Upgrade
description: Learn what to do when you a Kubernetes Cluster Node is in the state NotReady,Scheduling Disabled after a runtime upgrade.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 06/25/2025
ms.author: jeremyhouser
author: jeremyhouser-ms
---
# Troubleshoot a Kubernetes Cluster Node in NotReady,Scheduling Disabled state

The purpose of this guide is to troubleshoot a Kubernetes Cluster when 1 or more of it's nodes fail to uncordon after a runtime upgrade. This guide is only applicable if that Node remains in the state `Ready,SchedulingDisabled`.

## Prerequisites

- Ability to run kubectl commands against the KubernetesCluster
- Familiarity with the capabilities referenced in this article by reviewing the [Baremetalmachine actions](howto-baremetal-functions.md)

## Typical Cause

After a runtime upgrade, before a Baremetal Machine is shutdown for reimaging, the machine lifecycle controller will cordon and attempt to drain Virtual Machine resources scheduled to that Baremetal Machine. Once the Baremetal Machine has resolved the reimaging process, the expectation is that Virtual Machines tied to that Baremetal Machine will reschedule to the Baremetal Machine, and then be uncordoned by the machine lifecycle controller, reflecting the appropriate state `Ready`.

However, a race condition may occur wherein the machine lifecycle controller will fail to find the virt-launcher pods responsible for deploying Virtual Machines. This is because the virt-launcher pod's image pull job is not yet complete. Only after the image pull job is complete will the pod be schedulable to a Baremetal Machine. When the machine lifecycle controller examines these virt-launcher pods during the uncordon action execution, it cannot find which Baremetal Machine the pod is tied to, and skips the pod and the Virtual Machine it represents.

This problem should only appear during uncordon actions initiated by the machine lifecycle controller after runtime upgrades. It should occur infrequently on small clusters but frequently for large clusters, as multiple concurrent image pulls will result in longer scheduling times.

## Procedure

After KubernetesCluster Nodes have been discovered in the `Ready,SchedulingDisabled` state, the following remediation may be engaged.

1. Use kubectl to list the nodes using the wide flag. Observe the node in **Ready,SchedulingDisabled** status.
    ~~~bash
    $ kubectl get nodes -o wide
    NAME                                          STATUS                      ROLES           AGE    VERSION    INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                    KERNEL-VERSION    CONTAINER-RUNTIME
    example-naks-control-plane-tgmw8              Ready,SchedulingDisabled    control-plane   2d6h   v1.30.12   10.4.32.10    <none>        Microsoft Azure Linux 3.0   6.6.85.1-2.azl3   containerd://2.0.0
    example-naks-agentpool1-md-s8vp4-xp98x        Ready,SchedulingDisabled    <none>          2d6h   v1.30.12   10.4.32.11    <none>        Microsoft Azure Linux 3.0   6.6.85.1-2.azl3   containerd://2.0.0
    ~~~

1. Issue the kubectl command to uncordon the Node in the undesired state.

    ~~~bash
    $ kubectl uncordon example-naks-control-plane-tgmw8
    node/example-naks-agentpool1-md-s8vp4-xp98x uncordoned
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