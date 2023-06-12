---
title: Troubleshoot cluster baremetalmachine with three Rs for Azure Operator Nexus
description: Troubleshoot cluster baremetalmachine with three Rs for Azure Operator Nexus
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 06/12/2023
author: JAC0BSMITH
ms.author: jacobsmith
---

# Troubleshooting Server Issues

This article describes how you can troubleshoot server issues using the restart, reimage and replace on Operator Nexus Bare Metal Machines (BMM). You may need to take these actions on your server for maintenance reasons, which causes a brief disruption to this specific BMM, as the server performs the operation. 
The time required to complete each of these actions is relatively similar, with reboot being the fastest and replace taking slightly longer. All three actions are simple and efficient methods for troubleshooting.

## Prerequisites

- Familiarize yourself with the capabilities referenced in this article by reviewing the [Bare Metal Machine Actions](howto-baremetal-functions.md)
- Get the name of the resource group for the BMM
- Get the name of the bare metal machine  that requires a lifecycle management operation

## Identifying the corrective action

When troubleshooting a BMM for failures and determining the best corrective action, it’s important to understand the options available. Rebooting or reimaging a BMM server can be an efficient and effective way to fix problems or simply restore the software to a known-good place. This article provides direction on the best practices to be followed for each of the three Rs.

It's important to have a systematic approach when troubleshooting technical issues. One effective method is to start with the simplest and least invasive solution and work your way up to more complex and drastic measures, if necessary.

The first step in troubleshooting is often to try rebooting the device or system. Rebooting can help to clear any temporary glitches or errors that may be causing the issue. If rebooting doesn't solve the problem, the next step may be to try reimaging the device or system.

If reimaging doesn't solve the problem, the final step may be to replace the faulty hardware component. Replace can be a more drastic measure, but it may be necessary if the issue is related to a hardware malfunction.
It's important to note that these troubleshooting methods may not always be effective, and there may be other factors at play that require a different approach.

### Troubleshooting with Reboot action

Rebooting a BMM is a process of restarting the server through a simple API call. This action can be useful for troubleshooting issues when tenant VMs on the host aren't responsive or otherwise stuck.

The reboot typically is the starting point for mitigating a problem.

### Troubleshooting with Reimage action

Reimaging a BMM is a process used to redeploy the image on the OS disk, without impact to the Tenant data. This action executes the steps to rejoin the cluster with the same identifiers. Reimage action can be useful for troubleshooting issues by restoring the OS to a known-good working state. Common causes that can be resolved through reimage include recovery due to doubt of host integrity, suspected and/or confirmed security compromise, “break-glass” write activity performed. 

Reimage action is the recommended best practice for lowest operational risk to ensure the integrity of the BMM.

### Troubleshooting with Replace action

Servers contain many physical components that can fail over time. It's important to understand which physical repairs require a BMM replace action, do not require replace and which are recommended but not required. A hardware validation process is invoked to ensure the integrity of the physical host in advance of deploying the OS image. Like the reimage action, the Tenant data isn't modified during replace activity.

As a best practice, the BMM should be cordoned and shut down in advance of physical repair.
When performing the following physical repairs, a replace action isn't required, as the BMM host will continue to function normally after the repair.  

- Hot swappable power supply 

When performing the following physical repairs, a replace action is recommended but not necessary to bring the BMM back into service:

- CPU 
- DIMM
- Fan
- Expansion board riser
- Transceiver
- Ethernet or fiber cable replacement

When performing the following physical repairs, a replace action is required to bring the BMM back into service:

- Backplane 
- System board
- SSD disk
- PERC/RAID adapter
- Mellanox NIC 
- Broadcom embedded NIC

### Summary

In conclusion, rebooting, reimaging, and replacing are three effective troubleshooting methods that can be used to address technical issues. However, it's important to have a systematic approach and to consider other factors before attempting any drastic measures.

If you still have further questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
