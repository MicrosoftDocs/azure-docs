---
title: Configure HCX network extension high availability
description: Learn how to configure HCX network extension high availability
ms.topic: how-to
ms.date: 05/06/2022
---

# HCX Network extension high availability (HA)

VMware HCX is an application mobility platform that's designed to simplify application migration, workload re-balancing, and business continuity across data centers and clouds. 

The HCX Network Extension service provides layer 2 connectivity between sites. Network Extension HA protects extended networks from a Network Extension appliance failure at either the source or remote site. 

HCX 4.3.0 or newer allows network extension high availability. Network Extension HA operates in Active/Standby mode. In this article, you'll learn how to configure HCX network extension High Availability on Azure private cloud.

## Prerequisites

The Network Extension High Availability (HA) setup requires four Network Extension appliances, with two appliances at the source site and two appliances at the remote site. Together, these two pairs form the HA Group, which is the mechanism for managing Network Extension High Availability. Appliances on the same site require a similar configuration and must have access to the same set of resources.

- Network Extension HA requires an HCX Enterprise license.

- In the HCX Compute Profile, the Network Extension Appliance Limit is set to allow for the number of Network Extension appliances. The Azure VMware Solutions Limit is automatically set to unlimited. 

- In the HCX Service Mesh, the Network Extension Appliance Scale Out Appliance Count is set to provide enough appliances to support network extension objectives, including any Network Extension HA groups.

When you create a service mesh, set the appliance count to a minimum of two. For an existing service mesh, you can edit and adjust the appliance count to provide the required appliance count.

- The Network Extension appliances selected for HA activation must have no networks extended over them.

- Only Network Extension appliances upgraded to HCX 4.3.0 or newer can be added to HA Groups.

## Activate high availability (HA)

Use the following steps to activate HA, create HA groups, and view the HA roles and options available.

1.	Sign in to HCX Manager UI using either cloudadmin@vsphere.local or access HCX UI using vCenter HCX Plugin.
1. Navigate to **Infrastructure**, then **Interconnect**.
1. Select **Service Mesh**, then select **View Appliances**.
1. Select **Appliances** from the **Interconnect** tab options. Check the network appliance that you want to make highly available and select **Activate High Availability**.

     :::image type="content" source="media/hcx/appliances-activate-high-availability.png" alt-text="Image shows the appliances tab with a list of appliances you can choose from to activate high availability."lightbox="media/hcx/appliances-activate-high-availability.png":::

1. Confirm by selecting **Activate HA**.
    1. Activating HA initiates the process to create an HA group. The process automatically selects an HA partner from the available NE Appliances.
1. After the HA group is created, the **HA Roles** for the local and remote appliances display **Active** and **Standby**.

     :::image type="content" source="media/hcx/ha-group-active-standby-roles.png" alt-text="Image shows the active and standby roles that are assigned to the local and remote appliances."lightbox="media/hcx/ha-group-active-standby-roles.png":::

1. Select **HA Management** from the **Interconnect** tab options to view the HA group details and the available options: **Manual failover, Deactivate, Redeploy, and Force Sync**.

    :::image type="content" source="media/hcx/ha-management-group-details-available-options.png" alt-text="Image shows the ha management tab with ha group details and available options."lightbox="media/hcx/ha-management-group-details-available-options.png":::

## Extend network using network HA group

1. Locate **Services** in the left navigation and select **Network Extension**.
1. Select **Create a Network Extension**.
1. Choose the Network you want and select **Next**.
1. In **mandatory fields** provide the gateway IP address in CIDR format. 
1. Select HA group under Extension Appliances which was created in previous steps and then select on **Submit** to extend the Network.
1. Select the HA group located under **Extension Appliance** and select **Submit**.
1. After the network is extended, under **Extension Appliance**, you can see the extension details and HA group.

    :::image type="content" source="media/hcx/extend-network-details-ha-group.png" alt-text="Image shows the extension appliance details and HA group."lightbox="media/hcx/extend-network-details-ha-group.png":::

1. To migrate vms, navigate to **Services** and select **Migration** to start the workload mobility wizard.
1. 

 