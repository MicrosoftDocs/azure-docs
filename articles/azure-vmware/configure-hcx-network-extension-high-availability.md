---
title: Configure HCX network extension high availability
description: Learn how to configure HCX network extension high availability
ms.topic: how-to
ms.service: azure-vmware
ms.date: 10/26/2022
ms.custom: engagement-fy23
---

# HCX Network extension high availability (HA)

VMware HCX is an application mobility platform that's designed to simplify application migration, workload rebalancing, and business continuity across data centers and clouds. 

The HCX Network Extension service provides layer 2 connectivity between sites. Network Extension HA protects extended networks from a Network Extension appliance failure at either the source or remote site. 

HCX 4.3.0 or later allows network extension high availability. Network Extension HA operates in Active/Standby mode. In this article, you'll learn how to configure HCX network extension High Availability on Azure private cloud.

## Prerequisites

The Network Extension High Availability (HA) setup requires four Network Extension appliances, with two appliances at the source site and two appliances at the remote site. Together, these two pairs form the HA Group, which is the mechanism for managing Network Extension High Availability. Appliances on the same site require a similar configuration and must have access to the same set of resources.

- Network Extension HA requires an HCX Enterprise license.
- In the HCX Compute Profile, the Network Extension Appliance Limit is set to allow for the number of Network Extension appliances. The Azure VMware Solutions Limit is automatically set to unlimited. 
- In the HCX Service Mesh, the Network Extension Appliance Scale Out Appliance Count is set to provide enough appliances to support network extension objectives, including any Network Extension HA groups.

When you create a service mesh, set the appliance count to a minimum of two. For an existing service mesh, you can edit and adjust the appliance count to provide the required appliance count.

- The Network Extension appliances selected for HA activation must have no networks extended over them.
- Only Network Extension appliances upgraded to HCX 4.3.0 or later can be added to HA Groups.
- Learn more about the [Network Extension High Availability](https://docs.vmware.com/en/VMware-HCX/4.3/hcx-user-guide/GUID-E1353511-697A-44B0-82A0-852DB55F97D7.html?msclkid=1fcacda4c4dd11ecae41f8715a8d8ded) feature, prerequisites, considerations and limitations.

## Activate high availability (HA)

Use the following steps to activate HA, create HA groups, and view the HA roles and options available.

1. Sign in to HCX Manager UI in one of two ways:
    1. cloudadmin@vsphere.local. 
    1. HCX UI through vCenter HCX Plugin.
1. Navigate to **Infrastructure**, then **Interconnect**.
1. Select **Service Mesh**, then select **View Appliances**.
1. Select **Appliances** from the **Interconnect** tab options. 
    1. Check the network appliance that you want to make highly available and select **Activate High Availability**.

     :::image type="content" source="media/hcx/appliances-activate-high-availability.png" alt-text="screenshot of the appliances tab with a list of appliances you can choose from to activate high availability."lightbox="media/hcx/appliances-activate-high-availability.png":::

1. Confirm by selecting **Activate HA**.
    1. Activating HA initiates the process to create an HA group. The process automatically selects an HA partner from the available NE Appliances.
1. After the HA group is created, the **HA Roles** for the local and remote appliances display **Active** and **Standby**.

     :::image type="content" source="media/hcx/high-availability-group-active-standby-roles.png" alt-text="screenshot of the active and standby roles that are assigned to the local and remote appliances."lightbox="media/hcx/high-availability-group-active-standby-roles.png":::

1. Select **HA Management** from the **Interconnect** tab options to view the HA group details and the available options: **Manual failover, Deactivate, Redeploy, and Force Sync**.

    :::image type="content" source="media/hcx/high-availability-management-group-details-available-options.png" alt-text="screenshot of the high availability management tab with high availability group details and available options."lightbox="media/hcx/high-availability-management-group-details-available-options.png":::

## Extend network using network HA group

1. Locate **Services** in the left navigation and select **Network Extension**.
1. Select **Create a Network Extension**.
1. Choose the Network you want and select **Next**.
1. In **mandatory fields**, provide the gateway IP address in CIDR format, select the HA group under **Extension Appliances** (this was created in the previous step), and select **Submit** to extend the Network.
1. After the network is extended, under **Extension Appliance**, you can see the extension details and HA group.

    :::image type="content" source="media/hcx/extend-network-details-high-availability-group.png" alt-text="screenshot of the extension appliance details and high availability group."lightbox="media/hcx/extend-network-details-high-availability-group.png":::

1. To migrate virtual machines (VMs), navigate to **Services** and select **Migration**. 
    1. Select **Migrate** from the **Migration** window to start the workload mobility wizard.
1. In **Workload Mobility**, add and replace details as needed, then select **Validate**.
1. After validation completes, select **Go** to start the migration using Extended Network.

    :::image type="content" source="media/hcx/extend-network-migrate-process.png" alt-text="screenshot of the workload mobility page to edit details, validate them, and migrate using extended network."lightbox="media/hcx/extend-network-migrate-process.png":::

## Next steps

 Now that you've learned how to configure and extend HCX network extension high availability (HA), use the following resource to learn more about how to manage HCX network extension HA.

[Managing Network Extension High Availability](https://docs.vmware.com/en/VMware-HCX/4.3/hcx-user-guide/GUID-4A745694-5E32-4E87-92D2-AC1191170412.html)