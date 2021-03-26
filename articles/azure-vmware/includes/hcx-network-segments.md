---
title: VMware HCX network segments
description: There are four networks needed for VMware HCX.
ms.topic: include
ms.date: 03/13/2021
---

<!-- Used in avs-production-ready-deployment.md and tutorial-deploy-vmware-hcx.md -->

There are varying ways to configure VMware HCX network segments on-premises. The following outlines a simple configuration that supports a pilot or small production use case.  When designing for hundreds or thousands of workloads, this configuration may need to change, depending on the needs of the migration.  

In preparation for the VMware HCX deployment to support the pilot or small production use case, identify the following:

- **Management network:** When deploying VMware HCX on-premises, you'll need to define a management network.  Typically, it's the same management network used by your on-premises VMware cluster.  At a minimum, identify **two** IPs on this network segment for VMware HCX. You might need larger numbers, depending on the scale of your deployment beyond the pilot or small use case.

> [!NOTE]
   > The recommended method is to create a /26 network because you can use up to 10 service meshes and 60 network extenders (-1 per service mesh). You can stretch **eight** networks per network extender by using Azure VMware Solution private clouds.
   >
   
- **vMotion network:** When deploying VMware HCX on-premises, you'll need to define a vMotion network.  Typically, it's the same network used for vMotion by your on-premises VMware cluster.  At a minimum, identify **two** IPs on this network segment for VMware HCX. You might need larger numbers, depending on the scale of your deployment beyond the pilot or small use case.

   The vMotion network must be exposed on a distributed virtual switch or vSwitch0. If it's not, modify the environment to accommodate.

   > [!NOTE]
   > Many VMware environments use non-routed network segments for vMotion, which poses no problems.

- **Uplink network:** When deploying VMware HCX on-premises, you'll need to define an Uplink network. Use the management network defined as your uplink network.
   
- **Replication network:** When deploying VMware HCX on-premises, you'll need to define a replication network. Use the management network defined as your replication network.  If the on-premises cluster hosts use a dedicated Replication VMkernel network, reserve **two** IP addresses in this network segment and use the Replication VMkernel network for the replication network.
