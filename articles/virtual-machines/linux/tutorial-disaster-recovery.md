---
title: Tutorial - Set up disaster recovery for Linux VMs with Azure Site Recovery
description: Learn how to set up disaster recovery for Linux VMs to a different Azure region, using the Azure Site Recovery service.
author: rayne-wiselman
ms.service: virtual-machines-linux
ms.subservice: recovery
ms.topic: tutorial
ms.date: 11/05/2020
ms.author: raynew
ms.custom: mvc
#Customer intent: As an Azure admin, I want to prepare for disaster recovery by replicating my Linux VMs to another Azure region.
---


# Tutorial: Set up disaster recovery for Linux virtual machines


This tutorial shows you how to set up disaster recovery for Azure VMs running Linux. In this article, learn how to:

> [!div class="checklist"]
> * Enable disaster recovery for a Linux VM
> * Run a disaster recovery drill
> * Stop replicating the VM after the drill

When you enable replication for a VM, the Site Recovery Mobility service extension installs on the VM, and registers it with [Azure Site Recovery](../../site-recovery/site-recovery-overview.md). During replication, VM disk writes are send to a cache storage account in the source region. Data is sent from there to the target region, and recovery points are generated from the data.  When you fail a VM over to another region during disaster recovery, a recovery point is used to restore the VM in the target region.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

1. Check that your Azure subscription allows you to create a VM in the target region. If you just created your free Azure account, you're the administrator of the subscription, and you have the permissions you need.
2. If you're not the subscription administrator, work with the administrator to assign you:
    - Either the Virtual Machine Contributor built-in role, or specific permissions to:
        - Create a VM in the selected virtual network.
        - Write to an Azure storage account.
        - Write to an Azure managed disk.
     - The Site Recovery Contributor built-in role, to manage Site Recovery operations in the vault. 
3. Check that the Linux VM is running a [supported operating system](../../site-recovery/azure-to-azure-support-matrix.md#linux).
4. If VM outbound connections use a URL-based proxy, make sure it can access these URLs. Using an authenticated proxy isn't supported.

    **Name** | **Public cloud** | **Government cloud** | **Details**
    --- | --- | --- | ---
    Storage | `*.blob.core.windows.net` | `*.blob.core.usgovcloudapi.net`| Write data from the VM to the cache storage account in the source region. 
    Azure AD  | `login.microsoftonline.com` | `login.microsoftonline.us`| Authorize and authenticate to Site Recovery service URLs. 
    Replication | `*.hypervrecoverymanager.windowsazure.com` | `*.hypervrecoverymanager.windowsazure.com`  |VM communication with the Site Recovery service. 
    Service Bus | `*.servicebus.windows.net` | `*.servicebus.usgovcloudapi.net` | VM writes to Site Recovery for monitoring and diagnostic data. 

4. If you're using network security groups (NSGs) to limit network traffic for VMs, create NSG rules that allow outbound connectivity (HTTPS 443) for the VM using these service tags (groups of IP addresses). Try out the rules on a test NSG first.

    **Tag** | **Allow** 
    --- | --- 
    Storage tag | Allows data to be written from the VM to the cache storage account.
    Azure AD tag | Allows access to all IP addresses that correspond to Azure AD.
    EventsHub tag | Allows access to Site Recovery monitoring.
    AzureSiteRecovery tag | Allows access to the Site Recovery service in any region.
    GuestAndHybridManagement | Use if you want to automatically upgrade the Site Recovery Mobility agent that's running on VMs enabled for replication.
5. Make sure VMs have the latest root certificates. On Linux VMs, follow the guidance provided by your Linux distributor, to get the latest trusted root certificates and certificate revocation list on the VM.

## Enable disaster recovery

1. In the Azure portal, open the VM properties page.
2. In **Operations**, select **Disaster recovery**.
3. In **Basics** > **Target region**, select the region to which you want to replicate the VM. The source and target regions must be in the same Azure Active Directory tenant.
4. Click **Review + Start replication**.

    :::image type="content" source="./media/tutorial-disaster-recovery/disaster-recovery.png" alt-text="Enable replication on the VM properties Disaster Recovery page.":::

5. In **Review + Start replication**, verify the settings:

    - **Target settings**. By default, Site Recovery mirrors the source settings to create target resources.
    - **Storage settings-Cache storage account**. Recovery uses a storage account in the source region. Source VM changes are cached in this account, before being replicated to the target location.
    - **Storage settings-Replica disk**. By default, Site Recovery creates replica managed disks in the target region that mirror source VM managed disks with the same storage type (standard or premium).
    - **Replication settings**. Shows the vault details, and indicates that recovery points created by Site Recovery are kept for 24 hours.
    - **Extension settings**. Indicates that Site Recovery will manage updates to the Site Recovery Mobility Service extension that's installed on VMs you replicate. The indicated Azure automation account manages the update process.

    :::image type="content" source="./media/tutorial-disaster-recovery/settings-summary.png" alt-text="Page showing summary of target and replication settings.":::

2. Select **Start replication**. Deployment starts, and Site Recovery starts creating target resources. You can monitor replication progress in the notifications.

    :::image type="content" source="./media/tutorial-disaster-recovery/notifications.png" alt-text="Notification for replication progress.":::

## Check VM status

After the replication job finishes, you can check the VM replication status.

1. Open the VM properties page.
2. In **Operations**, select **Disaster recovery**.
3. Expand the **Essentials** section to review defaults about the vault, replication policy, and target settings.
4. In **Health and status**, get information about replication state for the VM, the agent version, failover readiness, and the latest recovery points. 

    :::image type="content" source="./media/tutorial-disaster-recovery/essentials.png" alt-text="Essentials view for VM disaster recovery.":::

5. In **Infrastructure view**, get a visual overview of source and target VMs, managed disks, and the cache storage account.

    :::image type="content" source="./media/tutorial-disaster-recovery/infrastructure.png" alt-text="infrastructure visual map for VM disaster recovery.":::


## Run a drill

Run a drill to make sure disaster recovery works as expected. When you run a test failover, it creates a copy of the VM, with no impact on ongoing replication, or on your production environment.

1. In the VM disaster recovery page, select **Test failover**.
2. In **Test failover**, leave the default **Latest processed (low RPO)** setting for the recovery point.

   This option provides the lowest recovery point objective (RPO), and generally spins up the VM most quickly in the target region. It first processes all the data that has been sent to Site Recovery service, to create a recovery point for each VM, before failing over to it. This recovery point has all the data replicated to Site Recovery when the failover was triggered.

3. Select the virtual network in which the VM will be located after failover. 

     :::image type="content" source="./media/tutorial-disaster-recovery/test-failover-settings.png" alt-text="Page to set test failover options.":::

4. The test failover process begins. You can monitor the progress in notifications.

    :::image type="content" source="./media/tutorial-disaster-recovery/test-failover-notification.png" alt-text="Test failover notifications."::: 
    
   After the test failover completes, the VM is in the *Cleanup test failover pending* state on the **Essentials** page. 
  
## Clean up resources

The VM is automatically cleaned up by Site Recovery after the drill. 
 
1. To begin automatic cleanup, select **Cleanup test failover**.

    :::image type="content" source="./media/tutorial-disaster-recovery/start-cleanup.png" alt-text="Start cleanup on the Essentials page."::: 

6. In **Test failover cleanup**, type in any notes you want to record for the failover, and then select **Testing is complete. Delete test failover virtual machine**. Then select **OK**.

    :::image type="content" source="./media/tutorial-disaster-recovery/delete-test.png" alt-text="Page to record notes and delete test VM."::: 

7. The delete process begins. You can monitor progress in notifications.

    :::image type="content" source="./media/tutorial-disaster-recovery/delete-test-notification.png" alt-text="Notifications to monitor delete test VM."::: 


### Stop replicating the VM

After completing a disaster recovery drill, we suggest you continue to try out a full failover. If you don't want to do a full failover, you can disable replication. This does the following:

- Removes the VM from the Site Recovery list of replicated machines.
- Stops Site Recovery billing for the VM.
- Automatically cleans up source replication settings.

Stop replication as follows:

1. In the VM disaster recovery page, select **Disable Replication**.
2. In **Disable Replication**, select the reasons that you want to disable replication. Then select **OK**.

    :::image type="content" source="./media/tutorial-disaster-recovery/disable-replication.png" alt-text="Page to disable replication and provide a reason."::: 

    The Site Recovery extension installed on the VM during replication isn't removed automatically. If you disable replication for the VM, and you don't want to replicate it again at a later time, you can remove the Site Recovery extension manually, as follows: 

3. Go the the VM **Settings** > **Extensions**.
4. In the **Extensions** page, select each *Microsoft.Azure.RecoveryServices* entry for Linux.
5. In the  properties page for the extension, select **Uninstall**.


## Next steps

In this tutorial, you configured disaster recovery for an Azure VM, and ran a disaster recovery drill. Now, you can perform a full failover for the VM.

> [!div class="nextstepaction"]
> [Fail over a VM to another region](../../site-recovery/azure-to-azure-tutorial-dr-drill.md)
