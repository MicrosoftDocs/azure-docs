---
title: Deploy disaster recovery using VMware HCX
description: Learn how to deploy disaster recovery of your virtual machines (VMs) with VMware HCX Disaster Recovery. Also learn how to use Azure VMware Solution as the recovery or target site.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 12/11/2023
ms.custom: engagement-fy23
---

# Deploy disaster recovery using VMware HCX

In this article, learn how to deploy disaster recovery of your virtual machines (VMs) with VMware HCX solution and use an Azure VMware Solution private cloud as the recovery or target site.

The diagram shows the deployment of VMware HCX from on-premises VMware vSphere to Azure VMware Solution private cloud disaster recovery scenario.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/hcx-disaster-recovery-scenario-1-diagram.png" alt-text="Diagram shows the VMware HCX manual disaster recovery solution in Azure VMware Solution with on-premises VMware vSphere." border="true" lightbox="./media/disaster-recovery-virtual-machines/hcx-disaster-recovery-scenario-1-diagram.png":::

>[!IMPORTANT]
>Although part of VMware HCX, VMware HCX Disaster Recovery (DR) is not recommended for large deployments. The disaster recovery orchestration is 100% manual, and Azure VMware Solution currently doesn't have runbooks or features to support manual VMware HCX DR failover. For enterprise-class disaster recovery, refer to VMware Site Recovery Manager (SRM) or VMware Business Continuity and Disaster Recovery (BCDR) solutions.

VMware HCX provides various operations for fine control and granularity in replication policies. Available Operations include:

- **Reverse** – After a disaster occurs, reverse helps make Site B the source site and Site A, where the protected VM now lives.

- **Pause** – Pause the current replication policy associated with the VM selected.

- **Resume** - Resume the current replication policy associated with the VM selected.

- **Remove** - Remove the current replication policy associated with the VM selected.

- **Sync Now** – Out of bound sync source VM to the protected VM.

This guide covers the following replication scenarios:

- Protect a VM or a group of VMs.

- Complete a Test Recover of a VM or a group of VMs.

- Recover a VM or a group of VMs.

- Reverse Protection of a VM or a group of VMs.

## Protect VMs

1. Sign in to **vSphere Client** on the source site and access **HCX plugin**.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/hcx-vsphere.png" alt-text="Screenshot shows the VMware HCX option in the vSphere Client." border="true":::

1. Enter the **Disaster Recovery** area and select **PROTECT VMS**.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/protect-virtual-machine.png" alt-text="Screenshot shows the Disaster Recovery dashboard in the vSphere Client." border="true" lightbox="./media/disaster-recovery-virtual-machines/protect-virtual-machine.png":::

1. Select the Source and the Remote sites. The Remote site in this case should be the Azure VMware Solution private cloud.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/protect-virtual-machines.png" alt-text="Screenshot shows the VMware HCX: Protected Virtual Machines window." border="true":::

1. If needed, select the **Default replication** options:

   - **Enable Compression:** Recommended for low throughput scenarios.

   - **Enable Quiescence:** Pauses the VM to ensure a consistent copy is synced to the remote site.

   - **Destination Storage:** Remote datastore for the protected VMs, and in an Azure VMware Solution private cloud, which can be a vSAN datastore or an [Azure NetApp Files datastore](attach-azure-netapp-files-to-azure-vmware-solution-hosts.md).

   - **Compute Container:** Remote vSphere Cluster or Resource Pool.

   - **Destination Folder:** Remote destination folder, which is optional, and if no folder is selected, the VMs are placed directly under the selected cluster.

   - **RPO:** Synchronization interval between the source VM and the protected VM. It can be anywhere from 5 minutes to 24 hours.

   - **Snapshot interval:** Interval between snapshots.

   - **Number of Snapshots:** Total number of snapshots within the configured snapshot interval.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/protect-virtual-machine-options.png" alt-text="Screenshot shows the Protect Virtual Machines replication options." border="true" lightbox="./media/disaster-recovery-virtual-machines/protect-virtual-machine-options.png":::

1. Select one or more VMs from the list and configure the replication options as needed.

   By default, the VMs inherit the Global Settings Policy configured in the Default replication options. For each network interface in the selected VM, configure the remote **Network Port Group** and select **Finish** to start the protection process.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/network-interface-options.png" alt-text="Screenshot shows the Protect Virtual Machines network interface options." border="true" lightbox="./media/disaster-recovery-virtual-machines/network-interface-options.png":::

1. Monitor the process for each of the selected VMs in the same disaster recovery area.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/protect-monitor-progress.png" alt-text="Screenshot shows the Protect Virtual Machines monitor progress of protection." border="true" lightbox="./media/disaster-recovery-virtual-machines/protect-monitor-progress.png":::

1. After the VM is protected, you can view the different snapshots in the **Snapshots** tab.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/list-of-snapshots.png" alt-text="Screenshot shows the Protect Virtual Machines list of snapshots." border="true" lightbox="./media/disaster-recovery-virtual-machines/list-of-snapshots.png":::

   The yellow triangle means the snapshots and the virtual machines weren't tested in a Test Recovery operation.

   There are key differences between a VM that is powered off and one powered on. The image shows the syncing process for a powered-on VM. It starts the syncing process until it finishes the first snapshot, which is a full copy of the VM, and then completes the next ones in the configured interval. It syncs a copy for a powered off VM, and then the VM appears as inactive, and protection operation shows as completed.  When the VM is powered on, it starts the syncing process to the remote site.

## Complete a test recover of VMs

1. Sign in to **vSphere Client** on the remote site, which is the Azure VMware Solution private cloud. 
1. Within the **HCX plugin**, in the Disaster Recovery area, select the vertical ellipses on any VM to display the operations menu and then select **Test Recover VM**.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/test-recover-virtual-machine.png" alt-text="Screenshot shows the Test Recovery VM menu option." border="true":::

1. Select the options for the test and the snapshot you want to use to test different states of the VM.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/choose-snapshot.png" alt-text="Screenshot shows the Replica Snapshot instance to test." border="true":::

1. After you select **Test**, the recovery operation begins.

1. When finished, you can check the new VM in the Azure VMware Solution private cloud vCenter Server.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/verify-test-recovery.png" alt-text="Screenshot shows the check recovery operation summary." border="true" lightbox="./media/disaster-recovery-virtual-machines/verify-test-recovery.png":::

1. After testing on the VM or any application running on it are finished, do a cleanup to delete the test instance.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/cleanup-test-instance.png" alt-text="Screenshot shows the cleanup test instance." border="true" lightbox="./media/disaster-recovery-virtual-machines/cleanup-test-instance.png":::

## Recover VMs

1. Sign in to **vSphere Client** on the remote site, which is the Azure VMware Solution private cloud, and access the **HCX plugin**.

   For the recovery scenario, a group of VMs used for this example.

1. Select the VM to be recovered from the list, open the **ACTIONS** menu, and select **Recover VMs**.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/recover-virtual-machines.png" alt-text="Screenshot shows the Recover VMs menu option." border="true":::

1. Configure the recovery options for each instance and select **Recover** to start the recovery operation.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/recover-virtual-machines-confirm.png" alt-text="Screenshot shows the confirmation for recovering VMs to target site." border="true":::

1. After the recovery operation is completed, the new VMs appear in the remote vCenter Server inventory.

## Complete a reverse replication on VMs

1. Sign in to **vSphere Client** on your Azure VMware Solution private cloud, and access **HCX plugin**.
   
   >[!NOTE]
   > Ensure the original VMs on the source site are powered off before you start the reverse replication. The operation fails if the VMs aren't powered off.

1. From the list, select the VMs to be replicated back to the source site, open the **ACTIONS** menu, and select **Reverse**. 
1. Select **Reverse** to start the replication.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/reverse-operation-virtual-machines.png" alt-text="Screenshot shows the Reverse menu option." border="true":::

1. Monitor on the details section of each VM.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/review-reverse-operation.png" alt-text="Screenshot shows the results of reverse action." border="true" lightbox="./media/disaster-recovery-virtual-machines/review-reverse-operation.png":::

## Disaster recovery plan automation

VMware HCX currently doesn't have a built-in mechanism to create and automate a disaster recovery plan. However, VMware HCX provides a set of REST APIs, including APIs for the Disaster Recovery operation. The API specification can be accessed within VMware HCX Manager in the URL.

These APIs cover the following operations in Disaster Recovery.

- Protect

- Recover

- Test Recover

- Planned Recover

- Reverse

- Query

- Test Cleanup

- Pause

- Resume

- Remove Protection

- Reconfigure

The following example shows a recover operation payload in JSON.

```json
[

    {

        "replicationId": "string",

        "needPowerOn": true,

        "instanceId": "string",

        "source": {

            "endpointType": "string",

            "endpointId": "string",

            "endpointName": "string",

            "resourceType": "string",

            "resourceId": "string",

            "resourceName": "string"

        },

        "destination": {

            "endpointType": "string",

            "endpointId": "string",

            "endpointName": "string",

            "resourceType": "string",

            "resourceId": "string",

            "resourceName": "string"

        },

        "placement": [

            {

                "containerType": "string",

                "containerId": "string"

            }

        ],

        "resourceId": "string",

        "forcePowerOff": true,

        "isTest": true,

        "forcePowerOffAfterTimeout": true,

        "isPlanned": true

    }

]
```

With these APIs, you can build a custom mechanism to automate a disaster recovery plan's creation and execution.
