---
title: Troubleshoot a KubernetesCluster with a node in NotReady,Scheduling Disabled state
description: Learn what to do when you see a KubernetesCluster node in the state "NotReady,Scheduling Disabled" after a BareMetalMachine has been uncordoned
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 06/25/2025
ms.author: jeremyhouser
author: jeremyhouser
---
# Troubleshoot a KubernetesCluster with a node in NotReady,Scheduling Disabled state

The purpose of this guide is to show how to troubleshoot a kubernetes cluster when some of it's nodes fail to uncordon, remaining in `Ready,SchedulingDisabled`

## Prerequisites

- Ability to run kubectl commands against the KubernetesCluster
- Familiarity with the capabilities referenced in this article by reviewing the [Baremetalmachine actions](howto-baremetal-functions.md).

## Typical Cause

During a runtime upgrade, before the BareMetalMachine is shutdown for reimaging, the machine lifecycle controller will cordon and attempt to drain the VirtualMachine resources which underpin the KubernetesCluster Nodes scheduled to that BareMetalMachine. Once the BareMetalMachine has been brought back up, the expectation is that VirtualMachines running on the host will reboot, reschedule to the BareMetalMachine, and then uncordon and become `Ready`. A race condition may occur in which the MachineLifecycleController fails to find the virt-launcher pods responsible for scheduling VirtualMachines to appropriate BareMetalMachines as they themselves have not yet been scheduled. Our hypothesis is that the virt-launcher's associated OS image pulling job has not yet completed when the MachineLifecycleController examines these virt-launcher pods during the uncordon action execution. This problem should appear only during uncordon actions, infrequently on small clusters but frequently for large clusters, as multiple concurrent image pulls will result in longer scheduling times.

## Procedure

This procedure may be performed at any time after the issue occurs to quickly resolve the fallout of the race condition. 

1. Use kubectl to list the nodes using the wide flag. Observe the node in **Ready,SchedulingDisabled** status.
    ~~~bash
    $ kubectl get nodes -o wide
    NAME                                          STATUS                      ROLES           AGE    VERSION    INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                    KERNEL-VERSION    CONTAINER-RUNTIME
    example-naks-control-plane-tgmw8              Ready,SchedulingDisabled    control-plane   2d6h   v1.30.12   10.4.32.10    <none>        Microsoft Azure Linux 3.0   6.6.85.1-2.azl3   containerd://2.0.0
    example-naks-agentpool1-md-s8vp4-xp98x        Ready,SchedulingDisabled    <none>          2d6h   v1.30.12   10.4.32.11    <none>        CBL-Mariner/Linux           6.6.85.1-2.azl3   containerd://2.0.0
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
    example-naks-agentpool1-md-s8vp4-xp98x        Ready   <none>          2d6h   v1.30.12   10.4.32.11    <none>        CBL-Mariner/Linux           6.6.85.1-2.azl3   containerd://2.0.0
    ~~~

If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).