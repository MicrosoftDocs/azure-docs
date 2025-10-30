---
title: 'Common issues seen with Azure Virtual Network Manager'
description: Learn about common issues with Azure Virtual Network Manager and how to resolve them quickly. Find solutions and troubleshoot effectively.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: how-to
ms.date: 10/30/2025
ms.custom: template-concept
---

# Common issues seen with Azure Virtual Network Manager

This article describes common issues with Azure Virtual Network Manager and provides solutions to help you quickly troubleshoot and resolve them.

## Configuration changes aren't applied 

These are some common reasons why your configuration changes aren't applied:


### The configuration isn't applied to the regions where virtual networks are located

You need to check the regions where the virtual networks are located. The configuration is only applied to the regions where the virtual networks are located. If you have a virtual network in a region that isn't included in the configuration, the configuration isn't applied to that virtual network.

To resolve this issue, you need to add the region where the virtual network is located to the configuration. 

### Configuration isn't deployed

You need to deploy the configuration after the configuration is created or modified. The configuration is only applied to the virtual networks after the configuration is deployed.

To resolve this issue, you need to deploy the configuration after the configuration is created or modified.

### Configuration changes didn't have enough time to apply

You need to wait for the configuration changes to apply. The time it takes for the configuration changes to apply after you commit the configuration is around 15-20 minutes. When there's an update to your network group membership, it would take about 10 minutes for the changes to reflect.

### Updated configuration changes aren't reflected in Azure Virtual Network Manager

You need to deploy the new configuration after the configuration is modified. 

## Connectivity configuration isn't working as expected 

Here are common reasons why your connectivity configuration isn't working as expected:

### The virtual network peering creation fails

In a hub-and-spoke topology, if you enable the option to *use the hub as a gateway*, you need to have a gateway in the hub virtual network. Otherwise, the creation of the virtual network peering between the hub and the spoke virtual networks fails. 

### Members in the network group can't communicate with each other

If you want to have members in the network group communicate with each other across regions in a hub and spoke topology configuration, you need to enable the global mesh option.

## Resource group creation fails

When deploying network manager configurations with Azure Virtual Network Manager, the service creates a managed resource group to host Azure Virtual Network Manager-managed resources. In certain cases, this process can fail due to Azure policies.

### Why does resource group creation fail?

Policy restrictions can cause resource group creation to fail. If your subscription enforces policies requiring specific tags or other constraints, Azure Virtual Network Manager can't create the resource group automatically. For example, a policy that mandates a tag on every resource group blocks Azure Virtual Network Manager's resource group creation.

### How to resolve resource group creation failures

You have two options to resolve resource group creation failures:

#### Option 1: Update policy

1. Temporarily adjust the policy to allow Azure Virtual Network Manager to create the resource group.
1. After deployment, revert the policy if needed.

#### Option 2: Manual resource group creation

If policy changes aren't possible, you can manually create the resource group and recommit the Azure Virtual Network Manager configuration.

1. Create a resource group in the target subscription.
1. Use the required naming convention of `AVNM_Managed_ResourceGroup_<subscriptionId>` for resource group creation.
1. Apply all mandatory tags and settings to comply with your policies.
1. Recommit the Azure Virtual Network Manager configuration.

### Best practices for resource group creation

To avoid issues with resource group creation in Azure Virtual Network Manager, consider the following best practices:

- Review Azure policies before onboarding Azure Virtual Network Manager.
- Document internal tag requirements and ensure they align with Azure Virtual Network Manager's managed resource group process.
- Keep the naming convention consistent across all subscriptions.

## Mesh for High Scale Private Endpoints isn't working

In order to use High Scale Private Endpoints in a mesh topology, you need to enable the High Scale Private Endpoint feature for each virtual network in the configuration.

### How to identify inactive virtual networks for High Scale Private Endpoints

The portal interface highlights which virtual networks are inactive for High Scale Private Endpoints (as illustrated below with red arrows). This indication appears only when the High Scale Private Endpoint feature is switched on (shown below with the green arrow). 

For information on how to enable High Scale Private Endpoints, see [Enable high-scale connectivity in Azure Virtual Network Manager connected groups](concept-connectivity-configuration.md#enable-high-scale-connectivity-in-azure-virtual-network-manager-connected-groups).

## Next steps

- [Azure Virtual Network Manager overview](overview.md)
- [Azure Virtual Network Manager FAQ](faq.md)

