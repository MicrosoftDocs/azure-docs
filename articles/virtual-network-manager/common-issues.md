---
title: "Common issues seen with Azure Virtual Network Manager"
ms.reviewer: mbender
description: Learn how to troubleshoot Azure Virtual Network Manager issues, including resolving configuration delays, connectivity errors, and resource group creation failures.
#customer intent: As a network engineer, I want to resolve connectivity configuration issues in Azure Virtual Network Manager so that my network group members can communicate effectively.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 11/05/2025
ms.custom: template-concept
---

# Common issues with Microsoft Azure Virtual Network Manager (AVNM)

This article describes common issues with AVNM and provides solutions to help you quickly troubleshoot and resolve them.

## Configuration changes aren't applied 

These issues can prevent your configuration changes from being applied:


### The configuration isn't applied to the regions where virtual networks are located

You need to check the regions where the virtual networks are located. The configuration is only applied to the regions where the virtual networks are located. If you have a Microsoft Azure Virtual Network (Virtual Network) in a region that isn't included in the configuration, the configuration isn't applied to that Azure Virtual Network.

To resolve this issue, add the region where the virtual network is located to the configuration. 

### Configuration isn't deployed

You need to deploy the configuration after you create or modify it. The configuration is only applied to the virtual networks after you deploy it.

To resolve this issue, deploy the configuration after you create or modify it.

### Configuration changes didn't have enough time to apply

You need to wait for the configuration changes to apply. The time it takes for the configuration changes to apply after you commit the configuration is around 15-20 minutes. When there's an update to your network group membership, it takes about 10 minutes for the changes to reflect.

### Updated configuration changes aren't reflected in AVNM

You need to deploy the new configuration after you modify the configuration. 

## Connectivity configuration isn't working as expected 

Here are common reasons why your connectivity configuration isn't working as expected:

### The virtual network peering creation fails

In a hub-and-spoke topology, if you enable the option to *use the hub as a gateway*, you need to have a gateway in the hub Virtual Network. Otherwise, the creation of the virtual network peering between the hub and the spoke virtual networks fails. 

### Members in the network group can't communicate with each other

If you want members in the network group to communicate with each other across regions in a hub and spoke topology configuration, you need to enable the global Mesh option.

## Resource group creation fails

When you deploy network manager configurations with AVNM, the service creates a managed resource group to host AVNM-managed resources. In certain cases, Microsoft Azure policies can cause this process to fail.

### Why does resource group creation fail?

Policy restrictions can cause resource group creation to fail. If your subscription enforces policies requiring specific tags or other constraints, AVNM can't create the resource group automatically. For example, a policy that mandates a tag on every resource group blocks AVNM's resource group creation.

### How to resolve resource group creation failures

You have two options to resolve resource group creation failures:

#### Option 1: Update policy

1. Temporarily adjust the policy to allow AVNM to create the resource group.
1. After deployment, revert the policy if needed.

#### Option 2: Manual resource group creation

If policy changes aren't possible, you can manually create the resource group and recommit the AVNM configuration.

1. Create a resource group in the target subscription.
1. Use the required naming convention of `AVNM_Managed_ResourceGroup_<subscriptionId>` for resource group creation.
1. Apply all mandatory tags and settings to comply with your policies.
1. Recommit the AVNM configuration.

### Best practices for resource group creation

To avoid issues with resource group creation in AVNM, consider the following best practices:

- Review Microsoft Azure policies before onboarding AVNM.
- Document internal tag requirements and ensure they align with AVNM's managed resource group process.
- Keep the naming convention consistent across all subscriptions.

## High scale private endpoints aren't working

To use high scale private endpoints in a mesh topology, you need to enable the high scale private endpoint feature for each Virtual Network in the configuration.

### How to identify inactive virtual networks for high scale private endpoints

The portal interface highlights which virtual networks are inactive for high scale private endpoints. This indication appears only when the high scale private endpoint feature is enabled.

:::image type="content" source="media/common-issues/verify-high-scale-private-endpoints.png" alt-text="Screenshot of enablement of high scale endpoints in network manager.":::

For information on how to enable high scale private endpoints, see [Enable high-scale connectivity in Azure Virtual Network Manager connected groups](concept-connectivity-configuration.md#enable-high-scale-connectivity-in-azure-virtual-network-manager-connected-groups).

## Next steps

- [Azure Virtual Network Manager overview](overview.md)
- [Azure Virtual Network Manager FAQ](faq.md)
