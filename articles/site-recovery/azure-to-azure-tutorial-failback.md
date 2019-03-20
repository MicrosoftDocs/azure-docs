---
title: Fail back Azure IaaS VMs replicated to a secondary Azure region for disaster recovery with the Azure Site Recovery service.
description: Learn how to fail back Azure VMs with the Azure Site Recovery service.
services: site-recovery
author: sideeksh
manager: rochakm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 03/07/2019
ms.author: sideeksh
ms.custom: mvc
---

# Fail back Azure VMs between Azure regions

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your disaster recovery strategy by managing and orchestrating replication, failover, and fail back of on-premises machines, and Azure virtual machines (VMs).

This tutorial describes how to fail back a single Azure VM. After you've failed over, you fail back to the primary region when it's available. In this tutorial, you learn how to:

> [!div class="checklist"]
> 
> * Fail back the secondary VM
> * Re-protect the primary VM back to the secondary region
> 
> [!NOTE]
> 
> This tutorial is intended to guide the user through the steps to failover to a target region and back with minimum customization; in case you want to learn more about the various aspects associated with failover, including networking considerations, automation or troubleshooting, refer to the documents under 'How To' for Azure VMs.

## Prerequisites

> * Make sure that the VM is in the Failover committed state, and check that the primary region is available, and you're able to create and access new resources in it.
> * Make sure that re-protection is enabled.

## Fail back to the primary region

After VMs are re-protected, you can fail back to the primary region as and when you want to.

1. Go to your Recovery Services Vault. Click on Replicated Items and select the VM that has been re-protected.

2. You should see the following. Note that it is similar to the blade for test failover and failover from the primary region.
![Failback to primary](./media/site-recovery-azure-to-azure-failback/azure-to-azure-failback.png)

3. Click on Test Failover to perform a test failover back to your primary region. Choose the Recovery Point and Virtual Network for the test failover and select OK. You can see the test VM created in the primary region which you can access and inspect.

4. Once Test Failover is satisfactory, you can click on Cleanup test failover to clean up resources created in the source region for the test failover.

5. In Replicated items, select the VM that you want to failover > Failover.

6. In Failover, select a Recovery Point to failover to. You can use one of the following options:
    1. Latest (default): This option processes all the data in the Site Recovery service and provides the lowest Recovery Point Objective (RPO)
    2. Latest processed: This option reverts the virtual machine to the latest recovery point that has been processed by Site Recovery service
    3. Custom: Use this option to failover to a particular recovery point. This option is useful for performing a test failover

7. Select Shut down machine before beginning failover if you want Site Recovery to attempt to do a shutdown of source virtual machines before triggering the failover. Failover continues even if shutdown fails. Note that Site Recovery does not clean up source after failover.

8. Follow the failover progress on the Jobs page

9. After the failover, validate the virtual machine by logging in to it. If you want to go another recovery point for the virtual machine, then you can use Change recovery point option.

10. Once you are satisfied with the failed over virtual machine, you can Commit the failover. Committing deletes all the recovery points available with the service. The Change recovery point option is no longer available.

![VM at primary and secondary regions](./media/site-recovery-azure-to-azure-failback/azure-to-azure-failback-vm-view.png)

If you see the preceding screenshot, "ContosoWin2016" VM failed over from Central US to East US and failed back from East US to Central US.

Please note that the DR VMs will remain in the shutdown de-allocated state. This behavior is by design because Azure Site Recovery saves the information of the virtual machine, which may be useful in failover for the primary to the secondary region later. You aren't charged for the de-allocated virtual machines, so it should be kept as it is.

> [!NOTE]
> See the ["how to" section](https://docs.microsoft.com/azure/site-recovery/azure-to-azure-how-to-reprotect#what-happens-during-reprotection) for more details about the re-protection work flow and what happens during re-protection.
