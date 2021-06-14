---
title: About routing for Azure Network Functions Manager
description: Learn about routing configuration for Azure Network Functions Manager.
author: cherylmc

ms.service: vnf-manager
ms.topic: conceptual
ms.date: 05/12/2021
ms.author: cherylmc

---
# About routing configuration for NFM (Preview)

To ensure Azure Network Function Manager service properly deploys network functions on the appliance, you’ll need to set up and manage networking on **Azure Stack Edge Pro with GPU**.

## Routing

This section shows the recommended way to set up and manage routing. Check with the vendor for specific networking requirements and support of static/dynamic IP address assignment.

* Port 1 (1 GbE) of the physical appliance should be dedicated for local management/access of the appliance. This port will require open internet access.
* **Enable compute** must be set to **yes** on port 2 (1 GbE), port 3 (10 GbE/25 GbE) or port 4 (10 GbE/25 GbE) of the physical appliance. When you enable compute, a management virtual switch is created on your appliance on that network interface. This port will require open internet access and be able to reach external name servers in order to register with Azure.
* Port 5 of the physical appliance must be connected for Local Area Network or Access network. This is for connectivity to other internal network functions and external peers like eNodeBs.
* Port 6 of the physical device must be connected for WAN or Data network. This is for external corp/internet connectivity.

## Example

This example shows a setup with three distinct routing domains or subnets:

* Management subnet: 10.0.0.0/24
* LAN subnet: 10.100.60.0/24
* WAN subnet: 10.200.60.0/24

   :::image type="content" source="./media/settings/design.png" alt-text="Screenshot of design diagram." lightbox= "./media/settings/design.png":::

## Next steps

For more information about Network Functions Manager, see the [FAQ](faq.md).
