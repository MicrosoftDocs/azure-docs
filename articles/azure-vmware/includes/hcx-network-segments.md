---
title: VMware HCX network segments
description: There are four networks needed for VMware HCX.
ms.topic: include
ms.date: 11/23/2020
---

<!-- Used in avs-production-ready-deployment.md and tutorial-deploy-vmware-hcx.md -->

Four networks are needed for VMware HCX:

- **Management network:** Typically, it's the same management network used on the vSphere cluster. At a minimum, identify two IPs on this network segment for VMware HCX. You might need larger numbers, depending on your deployment.

   > [!NOTE]
   > The method we recommend is creating a /26 network. On a /26 network, you can use up to 10 service meshes and 60 network extenders (-1 per service mesh). You can stretch eight networks per network extender by using Azure VMware Solution private clouds.
   >
   
- **vMotion network:** Typically, it's the same network used for vMotion on the vSphere cluster.  At a minimum, identify two IPs on this network segment for VMware HCX. You might need larger numbers, depending on your deployment.  

   The vMotion network must be exposed on a distributed virtual switch or vSwitch0. If it's not, modify the environment.

   > [!NOTE]
   > This network can be private (not routed).

- **Uplink network:** You want to create a new network for VMware HCX Uplink and extend it to your vSphere cluster via a port group. At a minimum, identify two IPs on this network segment for VMware HCX. You might need larger numbers, depending on your deployment.  

   > [!NOTE]
   > The method we recommend is creating a /26 network. On a /26 network, you can use up to 10 service meshes and 60 network extenders (-1 per service mesh). You can stretch eight networks per network extender by using Azure VMware Solution private clouds.
   >
   
- **Replication network:** This is optional. You want to create a new network for VMware HCX Replication and extend that network to your vSphere cluster via a port group. At a minimum, identify two IPs on this network segment for VMware HCX. You might need larger numbers, depending on your deployment.

   > [!NOTE]
   > This configuration is only possible when the on-premises cluster hosts use a dedicated Replication VMkernel network.  If your on-premises cluster does not have a dedicated Replication VMkernel network defined, there is no need to create this network.
