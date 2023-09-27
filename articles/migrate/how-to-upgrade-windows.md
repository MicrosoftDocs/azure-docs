---
title: Upgrade Windows Operating System
description: Learn how to upgrade Windows OS during migration.
author: AnuragMehrotra
ms.author: anuragm
ms.manager: vijain
ms.topic: how-to
ms.date: 09/15/2023
ms.custom: engagement-fy24
---

# Azure Migrate Windows Server upgrade (Preview)  

This article describes how to upgrade Windows Server OS while migrating to Azure. Azure Migrate OS upgrade allows you to move from an older operating system to a newer one while keeping your settings, server roles, and data intact. You can move your on-premises server to Azure with an upgraded OS version of Windows Server using Windows upgrade.

## Prerequisites 

- Ensure you have an existing Migrate project or [create](create-manage-projects.md) a project. 
- Ensure you have discovered the servers according to your [VMware](tutorial-discover-vmware.md), [Hyper-V](tutorial-discover-hyper-v.md), or [physical server](tutorial-discover-physical.md) environments and replicated the servers as described in [Migrate VMware VMs](tutorial-migrate-vmware.md#replicate-vms), [Migrate Hyper-V VMs](tutorial-migrate-hyper-v.md#migrate-vms), or [Migrate Physical servers](tutorial-migrate-physical-virtual-machines.md#migrate-vms) based on your environment. 
- Verify the operating system disk has enough [free space](/windows-server/get-started/hardware-requirements#storage-controller-and-disk-space-requirements) to perform the in-place upgrade. The minimum disk space requirement is 32 GB.   
- The upgrade feature only works for Windows Server Standard and Datacenter editions.
- The upgrade feature does not work for non en-US language servers. 
- This feature does not work for Windows Server with an evaluation license and needs a full license. If you have any server with an evaluation license, upgrade to full edition before starting migration to Azure.
- Disable antivirus and anti-spyware software and firewalls. These types of software can conflict with the upgrade process. Re-enable antivirus and anti-spyware software and firewalls after the upgrade is completed.  
- Ensure that your VM has the capability of adding another data disk as this feature requires the addition of an extra data disk temporarily for a seamless upgrade experience. 
- For Private Endpoint enabled Azure Migrate projects, follow [these](migrate-servers-to-azure-using-private-link.md?pivots=agentlessvmware#replicate-vms) steps before initiating any Test migration/Migration with OS upgrade.  


> [!NOTE]
> In case of OS upgrade failure, Azure Migrate may download the Windows SetupDiag for error details. Ensure the VM created in Azure post the migration has access to [SetupDiag](https://go.microsoft.com/fwlink/?linkid=870142). In case there is no access to SetupDiag, you may not be able to get detailed OS upgrade failure error codes but the upgrade can still proceed.

## Overview 

The Windows OS upgrade capability helps you move from an older operating system to a newer one while keeping your settings, server roles, and data intact. Since both upgrade and migration operations are completed at once, this reduces duplicate planning, downtime, and test efforts. The upgrade capability also reduces the risk, as customers can first test their OS upgrade in an isolated environment in Azure using test migration without any impact on their on-premises server.    

You can upgrade to up to two versions from the current version.   

**Source** | **Supported target versions**
--- | ---
Windows Server 2012 | Windows Server 2016 
Windows Server 2012 R2 | Windows Server 2016, Windows Server 2019 
Windows Server 2016  | Windows Server 2019, Windows Server 2022 
Windows Server 2019 | Windows Server 2022

## Upgrade Windows OS during test migration 

To upgrade Windows during the test migration, follow these steps:

1. Go to **Get started** > **Servers, databases and web apps**, select **Replicate**. 
   
   A Start Replication job begins. When the Start Replication job finishes successfully, the machines begin their initial replication to Azure. 

3. Select **Replicating servers** in **Migration and modernization** to monitor the replication status.

4. In **Migration goals** > **Servers, databases and webapps** > **Migration and modernization**, select **Replicated servers** under **Replications**.  

5. In the **Replicating machines** tab, right-click the VM to test and select **Test migrate**. 

   :::image type="content" source="./media/how-to-upgrade-windows/test-migration.png" alt-text="Screenshot displays the Test Migrate option.":::

6. Select the **Upgrade available** option. 

   :::image type="content" source="./media/how-to-upgrade-windows/upgrade-available-inline.png" alt-text="Screenshot with the Upgrade available option." lightbox="./media/how-to-upgrade-windows/upgrade-available-expanded.png":::

7. In the pane that appears, select the target OS version that you want to upgrade to and select **Apply**. 

   :::image type="content" source="./media/how-to-upgrade-windows/upgrade-available-options.png" alt-text="Screenshot with the available servers.":::

   The **Upgrade available** option changes to **Upgrade configured**.

7. Select **Test migration** to initiate the test migration followed by the OS upgrade. 

8. After the migration job is successful, view the migrated Azure VM in **Virtual Machines** in the Azure portal. The machine name has the suffix *-Test*.  

   You can now use this server with upgraded OS to complete any application testing. The original server continues running on-premises without any impact while you test the newly upgraded server in an isolated environment.   

9. After the test is done, right-click the Azure VM in **Replicating machines**, and select **Clean up test migration**. This deletes the test VM and any resources associated with it.  

## Upgrade Windows OS during migration

After you've verified that the test migration works as expected, you can migrate the on-premises machines. To upgrade Windows during the migration, follow these steps:

1. On the **Get started** page, in **Servers, databases and web apps**, select **Replicate**. A Start Replication job begins.    
2. In **Replicating machines**, right-click the VM and select **Migrate**.  

   :::image type="content" source="./media/how-to-upgrade-windows/migration.png" alt-text="Screenshot displays the Migrate option.":::

3. In **Migrate** > **Shut down virtual machines and perform a planned migration with no data loss**, select **Yes** > **OK**.  
   - By default, Azure Migrate shuts down the on-premises VM to ensure minimum data loss.  
   - If you don't want to shut down the VM, select No.  
4. Select the **Upgrade available** option. 

   :::image type="content" source="./media/how-to-upgrade-windows/migrate-upgrade-available-inline.png" alt-text="Screenshot with the Upgrade available option in the Migration screen." lightbox="./media/how-to-upgrade-windows/migrate-upgrade-available-expanded.png":::

5. In the pane that appears, select the target OS version that you want to upgrade to and select **Apply**. 

   :::image type="content" source="./media/how-to-upgrade-windows/migrate-upgrade-options.png" alt-text="Screenshot with the available servers in the Migrate screen.":::

   The **Upgrade available** option changes to **Upgrade configured**.

   :::image type="content" source="./media/how-to-upgrade-windows/migrate-upgrade-configured-inline.png" alt-text="Screenshot with the Upgrade configured option in the Migration screen." lightbox="./media/how-to-upgrade-windows/migrate-upgrade-configured-expanded.png"::: 


5. Select **Migrate** to start the migration and the upgrade.  

## Next steps 

Investigate the [cloud migration journey](/azure/architecture/cloud-adoption/getting-started/migrate) in the Azure Cloud Adoption Framework. 

 
