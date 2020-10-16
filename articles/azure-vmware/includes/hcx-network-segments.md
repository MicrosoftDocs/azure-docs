---
title: VMware HCX network segments
description: There are four networks needed for VMware HCX.
ms.topic: include
ms.date: 09/28/2020
---

<!-- Used in avs-production-ready-deployment.md and tutorial-deploy-vmware-hcx.md -->

There are four networks needed for VMware HCX:

- **Management Network:** Typically, it's the same management network used on the vSphere cluster.  At a minimum, identify two IPs on this network segment for VMware HCX (larger numbers may be needed depending on your deployment).

- **vMotion Network:** Typically, it's the same network used for vMotion on the vSphere cluster.  At a minimum, identify two IPs on this network segment for VMware HCX (larger numbers may be needed depending on your deployment).  

   The vMotion network must be exposed on a distributed virtual switch or vSwitch0. If it's not, modify the environment.

   > [!NOTE]
   > If this network is not routed (private), that is OK.

- **Uplink Network:** You want to create a new network for VMware HCX Uplink and extend it to your vSphere cluster via a port group.  At a minimum, identify two IPs on this network segment for VMware HCX (larger numbers may be needed depending on your deployment).  

   > [!NOTE]
   > The recommended method is to create a /29 network, but any network size will do.

- **Replication Network:** You want to create a new network for VMware HCX Replication and extend that network to your vSphere cluster via a port group.  At a minimum, identify two IPs on this network segment for VMware HCX (larger numbers may be needed depending on your deployment).

   > [!NOTE]
   > The recommended method is to create a /29 network, but any network size will do.