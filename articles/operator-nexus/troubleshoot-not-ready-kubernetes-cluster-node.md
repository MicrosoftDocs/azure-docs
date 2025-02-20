---
title: Troubleshoot KubernetesCluster with a node in NotReady
description: Learn what to do when you see a node in NotReady in your kubernetesCluster.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 02/19/2025
ms.author: jessegler
author: jessegler
---
# Troubleshoot a KubernetesCluster with a node in NotReady state

Follow this troubleshooting guide if you see a kubernetesCluster with a node in **NotReady**.

## Prerequisites

- Ability to run kubectl commands against the KubernetesCluster
- Familiarity with the capabilities referenced in this article by reviewing the [Baremetalmachine actions](howto-baremetal-functions.md).

## Cause

- After Baremetalmachine restart or Cluster runtime upgrade, a node may enter the **NotReady** status. 
- Tainting, cordoning, or powering off a Baremetalmachine causes nodes running on that Baremetalmachine to become **NotReady**. If possible, remove the taint, uncordon, or power on the Baremetalmachine. If not possible, the following the procedure below may allow the node to reschedule to a different Baremetalmachine.

## Procedure

Delete the node by following the instructions below. This will allow the Cluster to attempt to reschedule and restart the node.


1. Use kubectl to list the nodes using the wide flag. Observe the node in **NotReady** status.

    ~~~bash
    $ kubectl get nodes -owide
    NAME                                                 STATUS     ROLES           AGE    VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE            KERNEL-VERSION     CONTAINER-RUNTIME
    mytest-naks1-3b466a17-agentpool1-md-6bg5h-7qt2b   Ready      <none>          6d3h   v1.27.3   10.4.74.30    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-agentpool1-md-6bg5h-dqmzw   Ready      <none>          6d3h   v1.27.3   10.4.74.31    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-agentpool1-md-6bg5h-lkhhq   NotReady   <none>          6d3h   v1.27.3   10.4.74.29    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-control-plane-6q7ns         Ready      control-plane   6d3h   v1.27.3   10.4.74.14    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-control-plane-8qqvz         Ready      control-plane   6d3h   v1.27.3   10.4.74.28    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-control-plane-g42mh         Ready      control-plane   6d3h   v1.27.3   10.4.74.32    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    ~~~                                                                                                   

1. Issue the kubectl command to delete the node.

    ~~~bash
    $ kubectl delete node mytest-naks1-3b466a17-agentpool1-md-6bg5h-lkhhq
    node "mytest-naks1-3b466a17-agentpool1-md-6bg5h-lkhhq" deleted
    ~~~

1. List the nodes again and see that the node is gone.

    ~~~bash
    $ kubectl get nodes -owide
    NAME                                                 STATUS   ROLES           AGE    VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE            KERNEL-VERSION     CONTAINER-RUNTIME
    mytest-naks1-3b466a17-agentpool1-md-6bg5h-7qt2b   Ready    <none>          6d3h   v1.27.3   10.4.74.30    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-agentpool1-md-6bg5h-dqmzw   Ready    <none>          6d3h   v1.27.3   10.4.74.31    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-control-plane-6q7ns         Ready    control-plane   6d3h   v1.27.3   10.4.74.14    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-control-plane-8qqvz         Ready    control-plane   6d3h   v1.27.3   10.4.74.28    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-control-plane-g42mh         Ready    control-plane   6d3h   v1.27.3   10.4.74.32    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    ~~~

1. Wait 5-15 minutes for the node to be replaced. See that its returned with a new name. It will show **NotReady** as it comes up.

    ~~~bash
    $ kubectl get nodes -owide
    NAME                                                 STATUS     ROLES           AGE    VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE            KERNEL-VERSION     CONTAINER-RUNTIME
    mytest-naks1-3b466a17-agentpool1-md-6bg5h-7qt2b   Ready      <none>          6d3h   v1.27.3   10.4.74.30    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-agentpool1-md-6bg5h-dqmzw   Ready      <none>          6d3h   v1.27.3   10.4.74.31    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-agentpool1-md-6bg5h-nxkks   NotReady   <none>          42s    v1.27.3   10.4.74.12    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-control-plane-6q7ns         Ready      control-plane   6d3h   v1.27.3   10.4.74.14    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-control-plane-8qqvz         Ready      control-plane   6d3h   v1.27.3   10.4.74.28    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-control-plane-g42mh         Ready      control-plane   6d3h   v1.27.3   10.4.74.32    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    ~~~

1. Wait a bit longer and the **NotReady** node becomes **Ready**.

    ~~~bash
    $ kubectl get nodes -owide
    NAME                                                 STATUS   ROLES           AGE    VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE            KERNEL-VERSION     CONTAINER-RUNTIME
    mytest-naks1-3b466a17-agentpool1-md-6bg5h-7qt2b   Ready    <none>          6d3h   v1.27.3   10.4.74.30    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-agentpool1-md-6bg5h-dqmzw   Ready    <none>          6d3h   v1.27.3   10.4.74.31    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26 
    mytest-naks1-3b466a17-agentpool1-md-6bg5h-nxkks   Ready    <none>          97s    v1.27.3   10.4.74.12    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-control-plane-6q7ns         Ready    control-plane   6d3h   v1.27.3   10.4.74.14    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-control-plane-8qqvz         Ready    control-plane   6d3h   v1.27.3   10.4.74.28    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    mytest-naks1-3b466a17-control-plane-g42mh         Ready    control-plane   6d3h   v1.27.3   10.4.74.32    <none>        CBL-Mariner/Linux   5.15.153.1-2.cm2   containerd://1.6.26
    ~~~

If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).
