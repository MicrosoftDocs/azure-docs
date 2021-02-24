---
title: Complete disaster recovery of virtual machines
description: This article shows how to complete disaster recovery of virtual machines by using Azure VMware Solution
ms.topic: how-to
ms.date: 09/22/2020
---

# Complete disaster recovery of virtual machines using Azure VMware Solution

This article contains the process to complete disaster recovery of your virtual machines (VMs) with VMware HCX solution and using an Azure VMware Solution private cloud as the recovery or target site.

VMware HCX provides various operations that provide fine control and granularity in replication policies. Available Operations include:

- **Reverse** – After a disaster has occurred. Reverse helps make Site B the source site and Site A, where the protected VM now lives.

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

1. Log into **vSphere Client** on the source site and access **HCX plugin**.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/hcx-vsphere.png" alt-text="HCX option in vSphere" border="true":::

1. Enter the **Disaster Recovery** area and select **PROTECT VMS**.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/protect-virtual-machine.png" alt-text="select protect vms" border="true" lightbox="./media/disaster-recovery-virtual-machines/protect-virtual-machine.png":::

1. Select the Source and the Remote sites. The Remote site in this case should be the Azure VMware Solution private cloud.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/protect-virtual-machines.png" alt-text="protect VMs window" border="true":::

1. If needed, select the **Default replication** options:

   - **Enable Compression:** Recommended for low throughput scenarios.

   - **Enable Quiescence:** Pauses the VM to ensure a consistent copy is synced to the remote site.

   - **Destination Storage:** Remote datastore for the protected VMs, and in an Azure VMware Solution private cloud, which should be the vSAN datastore.

   - **Compute Container:** Remote vSphere Cluster or Resource Pool.

   - **Destination Folder:** Remote destination folder, which is optional, and if no folder is selected, the VMs are placed directly under the selected cluster.

   - **RPO:** Synchronization interval between the source VM and the protected VM. It can be anywhere from 5 minutes to 24 hours.

   - **Snapshot interval:** Interval between snapshots.

   - **Number of Snapshots:** Total number of snapshots within the configured snapshot interval.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/protect-virtual-machine-options.png" alt-text="protect VMs options" border="true" lightbox="./media/disaster-recovery-virtual-machines/protect-virtual-machine-options.png":::

1. Select one or more VMs from the list and configure the replication options as needed.

   By default, the VMs inherit the Global Settings Policy configured in the Default replication options. For each network interface in the selected VM, configure the remote **Network Port Group** and select **Finish** to start the protection process.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/network-interface-options.png" alt-text="network interface options" border="true" lightbox="./media/disaster-recovery-virtual-machines/network-interface-options.png":::

1. Monitor the process for each of the selected VMs in the same disaster recovery area.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/protect-monitor-progress.png" alt-text="monitor progress of protection" border="true" lightbox="./media/disaster-recovery-virtual-machines/protect-monitor-progress.png":::

1. After the VM has been protected, you can view the different snapshots in the **Snapshots** tab.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/list-of-snapshots.png" alt-text="list of snapshots" border="true" lightbox="./media/disaster-recovery-virtual-machines/list-of-snapshots.png":::

   The yellow triangle means the snapshots and the virtual machines haven't been tested in a Test Recovery operation.

   There are key differences between a VM that is powered off and one powered on. The image shows the syncing process for a powered-on VM. It starts the syncing process until it finishes the first snapshot, which is a full copy of the VM, and then completes the next ones in the configured interval. It syncs a copy for a powered off VM, and then the VM appears as inactive, and protection operation shows as completed.  When the VM is powered on, it starts the syncing process to the remote site.

## Complete a test recover of VMs

1. Log into **vSphere Client** on the remote site, which is the Azure VMware Solution private cloud. 
1. Within the **HCX plugin**, in the Disaster Recovery area, select the vertical ellipses on any VM to display the operations menu and then select **Test Recover VM**.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/test-recover-virtual-machine.png" alt-text="Select Test Recover VM" border="true":::

1. Select the options for the test and the snapshot you want to use to test different states of the VM.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/choose-snapshot.png" alt-text="choose a snapshot and select test" border="true":::

1. After selecting **Test**, the recovery operation begins.

1. When finished, you can check the new VM in the Azure VMware Solution private cloud vCenter.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/verify-test-recovery.png" alt-text="check recovery operation" border="true" lightbox="./media/disaster-recovery-virtual-machines/verify-test-recovery.png":::

1. After testing has been done on the VM or any application running on it, do a cleanup to delete the test instance.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/cleanup-test-instance.png" alt-text="cleanup test instance" border="true" lightbox="./media/disaster-recovery-virtual-machines/cleanup-test-instance.png":::

## Recover VMs

1. Log into **vSphere Client** on the remote site, which is the Azure VMware Solution private cloud, and access the **HCX plugin**.

   For the recovery scenario, a group of VMs used for this example.

1. Select the VM to be recovered from the list, open the **ACTIONS** menu, and select **Recover VMs**.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/recover-virtual-machines.png" alt-text="recover VMs" border="true":::

1. Configure the recovery options for each instance and select **Recover** to start the recovery operation.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/recover-virtual-machines-confirm.png" alt-text="recover VMs confirmation" border="true":::

1. After the recovery operation is completed, the new VMs appear in the remote vCenter Server inventory.

## Complete a reverse replication on VMs

1. Log into **vSphere Client** on your Azure VMware Solution private cloud, and access **HCX plugin**.
   
   >[!NOTE]
   > Ensure the original VMs on the source site are powered off before you start the reverse replication. The operation fails if the VMs aren't powered off.

1. From the list, select the VMs to be replicated back to the source site, open the **ACTIONS** menu, and select **Reverse**. 
1. Select **Reverse** to start the replication.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/reverse-operation-virtual-machines.png" alt-text="Select reverse action under protect operations" border="true":::

1. Monitor on the details section of each VM.

   :::image type="content" source="./media/disaster-recovery-virtual-machines/review-reverse-operation.png" alt-text="review the results of reverse action" border="true" lightbox="./media/disaster-recovery-virtual-machines/review-reverse-operation.png":::

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

An example of a recover operation payload in JSON is shown below.

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
