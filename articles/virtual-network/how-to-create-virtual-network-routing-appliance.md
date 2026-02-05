---
title: Create a Virtual Network Routing Appliance
titleSuffix: Azure Virtual Network
description: Create a virtual network routing appliance in Azure with ease. This guide covers registration, configuration, and troubleshooting for the public preview.
#customer intent: As a network administrator, I want to create a virtual network routing appliance in the Azure portal so that I can manage network traffic in a non-production environment.
author: asudbring
ms.author: allensu
ms.reviewer: allensu
ms.date: 02/04/2026
ms.topic: how-to
ms.service: azure-virtual-network
ms.custom: references_regions
---

# Create a virtual network routing appliance

This article explains how to register your subscription for the virtual network routing appliance public preview and create a virtual network routing appliance in the Azure portal. Use the public preview for testing, evaluation, and feedback. It doesn't support production workloads.

> [!IMPORTANT]
> Azure Virtual Network routing appliance is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

### Subscription and workload requirements

- Use a nonproduction Azure subscription for this public preview.  
- Your subscription must be enabled for the preview through AFEC registration and approval (see Section 2).

### Supported regions (public preview)

The virtual network routing appliance public preview is limited to the following regions:

- West US  
- East US  
- East Asia  
- North Europe  
- West Europe  
- East US 2  
- West Central US  
- UK South

## Register for the public preview (AFEC) and get approval

### Register your subscription by using Azure Feature Exposure Control (AFEC)

AFEC controls preview access to the virtual network routing appliance. The AFEC feature name for enabling the virtual network routing appliance preview is:  
- Microsoft.network/AllowVirtualNetworkAppliance

Register for the preview by activating the AFEC flag in the Azure portal.

### Approval process

After submitting your AFEC registration for Microsoft.network/AllowVirtualNetworkAppliance, complete the preview [sign-up form](https://forms.office.com/r/kqEKRr5mpB). The product team reviews and approves requests manually based on availability and capacity. During the public preview, creation requests might be denied if there's insufficient inventory or capacity in a region.

### Confirm your subscription is enabled

After Microsoft authorizes your subscription, verify the enablement by searching "Virtual network routing appliance" in the Azure portal search bar. If enabled, you see "Virtual network routing appliances" as a selectable service entry.

:::image type="content" source="media/create-virtual-network-routing-appliance/virtual-network-appliance-1.png" alt-text="Screenshot of the Azure portal search bar with Virtual network routing appliances highlighted.":::

:::image type="content" source="media/create-virtual-network-routing-appliance/virtual-network-appliance-2.png" alt-text="Screenshot of the Virtual network routing appliances service entry in the Azure portal.":::

## Create a resource group

1. Sign in to the [Azure Preview portal](https://preview.portal.azure.com).

1. In the search box at the top of the portal, enter **Resource group**. Select **Resource groups** in the search results.

1. Select **+ Create**. 

1. In **Create a resource group**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | Subscription | Select your subscription |
    | Resource group name | Enter **test-rg** |
    | Region | Select **(US) East US** |

1. Select **Review + create**.

1. Select **Create**.


## Create a virtual network

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

1. Select **+ Create**.

1. In **Create virtual network**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription |
    | Resource group | Select **test-rg** |
    |**Instance details** |  |
    | Virtual network name | Enter **vnet-1** |
    | Region | Select **(US) East US** |

1. Select **Next**.

1. Select **Next**. 

1. In **IP addresses**, select the **default** subnet.

1. In **Edit subnet**, in **Name** enter **VirtualNetworkApplianceSubnet**.

1. Select **Save**.

1. Select **Review + Create**. 

1. Select **Create**.

## Create a virtual network routing appliance

1. In the search box at the top of the portal, enter **Virtual network appliance**. Select **Virtual network appliances** in the search result.

1. Select **+ Create**.

1. In **Create a virtual network appliance**, enter or select the following information in the **Basics** tab:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription |
    | Resource group | Select **test-rg** |
    | **Instance details** |  |
    | Name | Enter **vnet-appliance** |
    | Region | Select **East US** |
    | Capacity | Select **50 Gpbs** |
    | Virtual Network | Select **vnet-1** |


1. Select **Review + create**.

1. Select **Create**.

The portal creates the Virtual Network routing appliance in a dedicated subnet named `VirtualNetworkApplianceSubnet`. If you create multiple appliance instances, you create them in the same dedicated subnet.

**Optional**: During creation, you can choose a network security group and route table for the virtual network appliance's dedicated subnet.

## Troubleshoot

### Creation fails because the subscription isn't enabled

If you see an error indicating your subscription isn't enabled or allowlisted, it typically means your AFEC registration isn't yet approved for `Microsoft.network/AllowVirtualNetworkAppliance`. Register via AFEC and wait for approval.

### Appliance isn't getting traffic as expected

- Verify NSGs and route tables attached to the appliance instance (or to the hosting subnet) match your intended routing and security configuration.  
- Use NSG flow logs (if enabled in your environment) to help validate connectivity and rule matches.
