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

1.	Sign in to HCX Manager UI using either cloudadmin@vsphere.local or access HCX UI using vCenter HCX Plugin.
1. Navigate to **Infrastructure**, then **Interconnect**.
1. Select **Service Mesh**, then select **View Appliances**.
    
    :::image type="content" source="media/hcx/interconnect-service-mesh-view-appliances.png" alt-text="Image shows step to select service mesh and the View Appliances option."lightbox="media/hcx/interconnect-service-mesh-view-appliances.png":::  

1. Select **Network Extension Appliance**, then select **Activate High Availability**.
1. Confirm by choosing **Activate HA**.
    1. Activating HA initiates the process to create an HA group. The process automatically selects an HA partner from the available NE Appliances.
1. After the HA group is created, the Active and Standby roles for the local and remote appliances display on the HA Management page.