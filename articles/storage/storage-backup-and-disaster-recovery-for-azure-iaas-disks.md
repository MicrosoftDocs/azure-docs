---
  title: Backup and Disaster Recovery for Azure IaaS Disks | Microsoft Docs
  description: In this article, we will explain how to plan for Backup and Disaster Recovery (DR) of IaaS virtual machines (VMs) and Disks in Azure. This document covers both Managed and Unmanaged Disks
  services: storage
  cloud: Azure
  documentationcenter: na
  author: luywang
  manager: kavithag

  ms.assetid:
  ms.service: storage
  ms.workload: storage
  ms.tgt_pltfrm: na
  ms.devlang: na
  ms.topic: article
  ms.date: 07/13/2017
  ms.author: luywang

---
# Backup and Disaster Recovery for Azure IaaS Disks

In this article, we will explain how to plan for Backup and Disaster Recovery (DR) of IaaS virtual machines (VMs) and Disks in Azure. This document covers both Managed and Unmanaged Disks.

We’ll first talk about the built-in fault tolerance capabilities in the Azure platform which help guard against local failures. We’ll then discuss the disaster scenarios not fully covered by the built-in capabilities, which is the main topic addressed by this document. We’ll also show several examples of workload scenarios where different Backup and DR considerations may apply. We’ll then review possible solutions for DR of IaaS Disks. 

## Introduction

The Azure platform uses various methods for redundancy and fault tolerance to help protect customers from localized hardware failures that can occur. Local failures may include problems with an Azure storage server machine that stores part of the data for a virtual disk or failures of an SSD or HDD on that server. Such isolated hardware component failures can happen during normal operations and the platform is designed to be resilient to these failures. Major disasters can result in failures or inaccessibility of a large numbers of storage servers or a whole datacenter. While your VMs and disks are normally protected from localized failures, additional steps are necessary to protect your workload from region-wide catastrophic failures (such as a major disaster) that can affect your VM and disks.

In addition to the possibility of platform failures, problems with the customer application or data can occur. For example, a new version of your application may inadvertently make a breaking change to the data. In that case, you may want to revert the application and the data to a prior version containing the last known good state. This requires maintaining regular backups.

For regional disaster recovery, you must backup your IaaS VM disks to a different region. 

Before we look at Backup and DR options, let’s recap a few methods available for handling localized failures.

## Azure IaaS Resiliency

*Resiliency* refers to the tolerance for normal failures that occur in hardware components. Resiliency is the ability to recover from failures and continue to function. It's not about avoiding failures, but responding to failures in a way that avoids downtime or data loss. The goal of resiliency is to return the application to a fully functioning state following a failure. Azure Virtual Machines and Disks are designed to be resilient to common hardware faults. Let us look at how the Azure IaaS platform provides this resiliency.

A virtual machine consists mainly of two parts: (1) A compute server, and (2) the persistent disks. Both affect the fault tolerance of a virtual machine.

If the Azure compute host server that houses your VM experiences a hardware failure (which is rare), Azure is designed to automatically restore the VM on another server. If this happens, you will experience a reboot, and the VM will be back up after some time. Azure automatically detects such hardware failures and executes recoveries to help ensure the customer VM will be available as soon as possible.

Regarding IaaS disks, durability of data is critical for the persistent storage platform. Azure customers have important business applications running on IaaS and they depend on the persistence of the data. Azure designs protection for these IaaS disks with three redundant copies of data stored locally, providing high durability against local failures. If one of the hardware components that holds your disk fails, your VM is not impacted because there are two additional copies to support disk requests. It works fine even if two different hardware components supporting a disk fail at the same time (which would be very rare). To help ensure we always maintain three replicas, the Azure Storage service automatically spawns a new copy of data in the background if one of the three copies becomes unavailable. Therefore, it should not be necessary to use RAID with Azure disks for fault tolerance. A simple RAID 0 configuration should be sufficient for striping the disks if necessary to create larger volumes.

Because of this architecture, **Azure has consistently delivered enterprise-grade durability for IaaS disks, with an industry-leading ZERO % [Annualized Failure Rate](https://en.wikipedia.org/wiki/Annualized_failure_rate).**

Localized hardware faults on the compute host or in the storage platform can sometimes result in temporary unavailability for the VM which is covered by the [Azure SLA](https://azure.microsoft.com/en-us/support/legal/sla/virtual-machines/) for VM Availability. Azure also provides an industry-leading SLA for single VM instances that use Premium Storage disks.

To safeguard application workloads from downtime due to the temporary unavailability of a disk or VM, customers can leverage [Availability Sets](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/manage-availability). Two or more virtual machines in an availability set provides redundancy for the application. Azure then creates these VMs and disks in separate fault domains with different power, network, and server components. Thus, localized hardware failures typically do not affect multiple VMs in the set at the same time, providing high availability for your application. It is considered a good practice to use availability sets when high availability is required. For more information, see the Disaster Recovery aspects detailed below.

## Backup and Disaster Recovery

