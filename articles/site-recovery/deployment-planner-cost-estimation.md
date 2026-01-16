---
title: About Azure Site Recovery deployment planner
ms.reviewer: v-gajeronika
description: This guide outlines the features and capabilities of the Azure Site Recovery deployment planner.
services: site-recovery
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: concept-article
ms.date: 01/12/2026
ms.author: v-gajeronika
---

# About Azure Site Recovery deployment planner

This guide outlines the capabilities of the Azure Site Recovery deployment planner.

>[!Note]
>The current version of Deployment planner tool v2.5 provides cost estimation for virtual machines replicating to Managed Disks.

## Get virtual machine lists

You need a list of the VMs to be profiled. Use the GetVMList mode of the deployment planner tool to generate the list of VMs present on multiple Hyper-V hosts in a single command. For more information, see Get the VM list for profiling [Hyper-V VMs](hyper-v-deployment-planner-run.md#get-the-vm-list-for-profiling-hyper-v-vms) and [VMware VMs](site-recovery-vmware-deployment-planner-run.md#create-a-list-of-virtual-machines-to-profile).

## Profile VMs

In profiling mode, the deployment planner tool connects to each of the Hyper-V and VMware hosts to collect performance data about the VMs. For more information, see Profile [Hyper-V VMs](hyper-v-deployment-planner-run.md#profile-hyper-v-vms) and [VMware VMs](site-recovery-vmware-deployment-planner-run.md#start-profiling).

## Generate a cost report

The tool generates a macro-enabled Microsoft Excel file (XLSM file) as the report output. It summarizes all the deployment recommendations. For more information, see generate cost reports for [Hyper-V VMs](hyper-v-deployment-planner-run.md#generate-a-cost-report) and [VMware VMs](site-recovery-vmware-deployment-planner-run.md#generate-a-cost-report).

## Get throughput

To estimate the throughput that Azure Site Recovery can achieve from on-premises to Azure during replication, run the tool in GetThroughput mode. For more information, see get throughput for [Hyper-V VMs](hyper-v-deployment-planner-run.md#get-throughput) and [VMware VMs](site-recovery-vmware-deployment-planner-run.md#get-throughput).

## Analyze the Azure Site Recovery deployment planner report

The summary worksheet provides an overview of the profiled environment. For more information, see Azure Site Recovery Deployment Planner for a [Hyper-V to Azure scenario](hyper-v-deployment-planner-analyze-report.md) and [VMware to Azure scenario](site-recovery-vmware-deployment-planner-analyze-report.md).

## Analyze the cost estimation report

The Azure Site Recovery Deployment Planner Report provides the cost estimation summary in Recommendations ([Hyper-V](hyper-v-deployment-planner-analyze-report.md#recommendations) and [VMware](site-recovery-vmware-deployment-planner-analyze-report.md#recommendations)) sheets and detailed cost analysis in the Cost Estimation sheet. It has the detailed cost analysis per VM. 

For more information, see cost estimation report for [Hyper-V VMs](hyper-v-deployment-planner-cost-estimation.md) and [VMware VMs](site-recovery-vmware-deployment-planner-cost-estimation.md).

## Next steps

- Learn more about how to protect [Hyper-V VMs to Azure by using Site Recovery](hyper-v-azure-tutorial.md).
- Learn more about protecting [VMware virtual machines to Azure using Azure Site Recovery](./vmware-azure-tutorial.md).
