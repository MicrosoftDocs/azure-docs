---
title: Relocate Azure Recovery Vault and Site Recovery to another region
description: Learn how to relocate an Azure Recovery Vault and Site Recovery to a new region
services: site-recovery
author: ankitaduttaMSFT
ms.service: azure-site-recovery
ms.topic: how-to
ms.date: 06/25/2024
ms.author: ankitadutta
ms.custom:
  - subject-relocation
---

# Relocate Azure Recovery Vault and Site Recovery to another region


This article shows you how to relocate [Azure Recovery Vault and Site Recovery](../site-recovery/site-recovery-overview.md) when moving your workload to another region.


[!INCLUDE [Relocation reasons](includes/service-relocation-reason-include.md)]
 

One of the related resources you might want to relocate when you relocate your Azure VMs is your Recovery Services vault configuration. 

There's no first-class way to move an existing Recovery Services vault configuration from one region to another. This is because you configured your target region based on your source VM region. When you decide to change the source region, the previously existing configurations of the target region can't be reused and must be reset. This article defines the step-by-step process to reconfigure the disaster recovery setup and move it to a different region.


## Prerequisites

- Copy the details replication goal from the SourceRecovery Services vault.

- Copy the details replication policy from the Source Recovery Services vault with the critical details such as:

    - *RPO threshold* defines how often recovery points are created.
    - *Recovery point retention* specifies how longer each recovery point is retained.
    - *App-consistent snapshot frequency* specifies how often app-consistent snapshots are created.

- Copy internal resources or settings of Azure Resource Vault.
    - Network firewall reconfiguration
    - Alert Notification.
    - Move workbook if configured
    - Diagnostic settings reconfiguration

- List all Recovery Service Vault dependent resources. The most common dependencies are:
    - Azure Virtual Machine (VM)
    - Public IP address
    - Azure Virtual Network
    - Azure Recovery Service Vault

- Determine network bandwidth need vs. RPO assessment
    - Estimated network bandwidth that’s required for delta replication
    - Throughput that Site Recovery can get from on-premises to Azure
    - Number of VMs to batch, based on the estimated bandwidth to complete initial replication in a given amount of time
    - RPO that can be achieved for a given bandwidth
    - Impact on the desired RPO if lower bandwidth is provisioned

- As it's a relocation of Recovery service vault, you must cross check the permission requirement in the current VMware vCenter server/VMware vSphere ESXi host during profiling.

- Make sure that you remove and delete the Site Recovery configuration before you try to move the Azure VMs to a different region. 

  > [!NOTE]
  > If your new target region for the Azure VM is the same as the Site Recovery target region, you can use your existing replication configuration and move it. Follow the steps in [Move Azure IaaS VMs to another Azure region](../site-recovery/azure-to-azure-tutorial-migrate.md).

- Ensure that you're making an informed decision and that stakeholders are informed. Your VM won't be protected against disasters until the move of the VM is complete.


## Identify Azure Site Recovery dependencies

We recommend that you do this step before you proceed to the next one. It's easier to identify the relevant resources while the VMs are being replicated.

For each Azure VM that's being replicated, go to **Protected Items** > **Replicated Items** > **Properties** and identify the following resources:

- Target resource group
- Cache storage account
- Target storage account (in case of an unmanaged disk-based Azure VM) 
- Target network


## Disable the existing disaster recovery configuration

1. Go to the Recovery Services vault.
2. In **Protected Items** > **Replicated Items**, right-click the machine and select **Disable replication**.
3. Repeat this step for all the VMs that you want to move.

> [!NOTE]
> The mobility service won't be uninstalled from the protected servers. You must uninstall it manually. If you plan to protect the server again, you can skip uninstalling the mobility service.

## Delete the resources

1. Go to the Recovery Services vault.
2. Select **Delete**.
3. Delete all the other resources you [previously identified](#identify-azure-site-recovery-dependencies).
 
## Relocate Azure VMs to the new target region

Follow the steps in these articles based on your requirement to relocate Azure VMs to the target region:

- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
- [Move Azure VMs into Availability Zones](../site-recovery/move-azure-VMs-AVset-Azone.md)

## Set up Site Recovery based on the new source region for the VMs

Configure disaster recovery for the Azure VMs that were moved to the new region by following the steps in [Set up disaster recovery for Azure VMs](../site-recovery/azure-to-azure-tutorial-enable-replication.md).
