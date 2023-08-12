---
title: Best practices for configuring an Elastic SAN Preview
description: Elastic SAN best practices
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: sample
ms.date: 10/12/2022
ms.author: rogarana
ms.custom: ignite-2022, devx-track-azurepowershell
---

# Elastic SAN Preview best practices

 This article provides some general guidance and best practices for Azure Elastic SAN configurations and other Azure resources used with Elastic SAN.

## Elastic SAN

Keeping your Azure virtual machine (VM) and Elastic SAN in the same zone and same region minimizes latency and helps ensure you get the best performance.

When deploying an elastic SAN, ensure you allocate enough base capacity so that all your applications and workloads can meet their performance needs. 

Elastic SAN uses VM network bandwidth, disk throughput limits on a VM do not apply. Choose a VM that can provide sufficient bandwidth for both production/VM-to-VM traffic and iSCSI traffic to attached Elastic SAN volume(s). 

iSCSI traffic isolation using a second vNIC - iSCSI traffic to Elastic SAN volumes cannot be redirected to a different vNIC on the VM due to lack of SendTargets support. Please redirect other production or VM to VM traffic to the secondary vNIC and use default (primary) vNIC for iSCSI throughput to attached Elastic SAN volumes. 

Enable “Accelerated Networking”. 


## MPIO

### Windows

### Linux

## iSCSI

### Windows

### Linux

