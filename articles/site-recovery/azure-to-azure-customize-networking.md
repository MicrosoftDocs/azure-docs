---
title: Customize networking configurations for failover VM  | Microsoft Docs
description: Provides an overview of customize networking configurations for failover VM  in the replication of Azure VMs using Azure Site Recovery.
services: site-recovery
author: rajani-janaki-ram
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 08/07/2019
ms.author: rajanaki

---
# Customize networking configurations of the target Azure VM

This article provides guidance on customizing networking configurations on the target Azure VM when you're replicating and recovering Azure VMs from one region to another, using [Azure Site Recovery](site-recovery-overview.md).

## Before you start

Learn how Site Recovery provides disaster recovery for [this scenario](azure-to-azure-architecture.md).

## Support networking resources

The following key resource configurations can be provided for the failover VM while replicating Azure VMs.

- [Internal Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-overview#what-is-standard-load-balancer)
- [Public IP](https://docs.microsoft.com/azure/virtual-network/virtual-network-ip-addresses-overview-arm#public-ip-addresses)
- [Network Security Group](https://docs.microsoft.com/azure/virtual-network/manage-network-security-group) both for the subnet and for the NIC

## Pre-requisites

- Ensure that you plan your recovery side configurations in advance.
- You need to create the networking resources in advance. Provide it as an input so that Azure Site Recovery service can honor these settings and ensure that the failover VM adheres to these settings.

## Steps to customize failover networking configurations

1. Navigate to **Replicated Items**. 
2. Click on the desired Azure VM.
3. Click on **Compute and Network**, and **Edit**. You will notice that the NIC configuration settings include the corresponding resources at the source. 

     ![customize](media/azure-to-azure-customize-networking/edit-networking-properties.png)

4. Click **Edit** near the NIC you want to configure. In the next blade that opens up, select the corresponding pre-created resources in the target.

    ![NIC-drilldown](media/azure-to-azure-customize-networking/nic-drilldown.png) 

5. Click **OK**.

Site Recovery will now honor these settings and ensure that the VM on failover is connected to the selected resource via the corresponding NIC.

## Troubleshooting

### Unable to view or select a resource

If you are unable to select or view a networking resource, please go through the following checks & conditions:

- The target field for a networking resource is only enabled if the source VM had a corresponding input. This is based on the principle that for a disaster recovery scenario, you would want either the exact or a scaled down version of your source.
- For each of the networking resources in question some filters are applied in the dropdown to ensure that the failover VM can attach itself to the resource selected and the failover reliability is maintained. These filters are based on the same networking conditions that would have been verified when you configured the source VM.

Internal load balancer validations:

1. Subscription and Region of LB and the target VM should be the same.
2. The virtual network associated with the Internal Load Balancer and that of the target VMshould be the same.
3. The target VM’s Public IP SKU and the Internal Loadbalancer's SKU should be the same.
4. If the target VM is configured to be placed in an availability zone, then check if the load balancer is zone redundant or part of any availability zone. (Basic SKU Load Balancers do not support zones and will not be shown in the drop-down in this case.)
5. Ensure that the Internal LoadBalancer has a pre-created backend pool and front-end configuration.


Public IP address:
    
1. Subscription and Region of Public IP and the target VM should be the same.
2. The target VM’s Public IP SKU and the Internal Loadbalancer's SKU should be the same.

Network security group:
1. Subscription and Region of Network security group and the target VM should be the same.


> [!WARNING]
> If the target VM is associated to an Availability Set, then you  need to associate the Public IP/Internal Load balancer of the same SKU as that of other VM's Public IP/Internal Load balancer in the Availability Set. Failure to do so could result in failover failure.
