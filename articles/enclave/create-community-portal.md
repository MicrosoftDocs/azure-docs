---
title: Create a community
description: Create a community.
author: jadean-msft
ms.author: jadean
ai-usage: ai-assisted
ms.topic: how-to
ms.date: 06/10/2026
---

# Create a community in the Azure portal

[Communities](./what-community.md) are isolated hub networks that securely and logically group multiple enclaves for governance, management, and security. A community owner can enable connectivity to other communities or on-premises networks through transit hubs or endpoints.

## Prerequisites

To access Azure Enclave, you need an Azure subscription. If you don't already have one, create a [free account](https://azure.microsoft.com/free/), and then sign in to the [Azure portal](https://portal.azure.com).

## Create community

1. Enter `Azure Enclave` in the search.
1. Under `Services`, select `Azure Enclave`. You're directed to the Azure Enclave homepage.

   :::image type="content" source="./media/azure-enclave-homepage.png#lightbox" alt-text="Screenshot showing the Azure portal homepage for Azure Enclave with the Create a community button." border="True" lightbox="./media/azure-enclave-homepage.png#lightbox":::

1. Select the `Create a community` button. The community deployment can take several minutes to complete.
1. Enter details for your community on the `Basics` tab:
   - `Subscription`: Select an Azure subscription.
   - `Resource group`: Create a new resource group or select an existing one.
   - `Community name`: Enter a community name, such as `My-Community`.
   - `Region`: Select the Azure region where the community is created.
   - `Community address space`: Enter the community IP address space, such as `10.0.0.0/16`.

   > [!NOTE]
   > `192.168.0.0/16` is reserved as the platform-managed enclave range. Don't create communities with any address space that overlaps or includes this range, such as `192.0.0.0/8` or `192.128.0.0/9`, because it creates conflicts with platform-managed enclave management IP ranges.

   :::image type="content" source="./media/create-community-tab-1-basics.png" alt-text="Screenshot showing the community basics settings page during community creation in the portal." border="True" lightbox="./media/create-community-tab-1-basics.png":::

1. Select `Next`. On the `Azure firewall` tab, decide if you want to use a different firewall type for your community Virtual WAN secure hubs.

   :::image type="content" source="./media/create-community-tab-2-firewall.png" alt-text="Screenshot showing the community firewall settings page during community creation in the portal." border="True" lightbox="./media/create-community-tab-2-firewall.png":::

1. Select `Next`. On the `Dedicated hubs` tab, create any dedicated hubs you need.

   :::image type="content" source="./media/create-community-tab-3-dedicated-hub.png" alt-text="Screenshot showing the community dedicated hub settings page during community creation in the portal." border="True" lightbox="./media/create-community-tab-3-dedicated-hub.png":::

1. Select `Next`. On the `Approvals` tab, decide which [approval settings](./configure-approvals.md) to apply to your community and enclaves.

   :::image type="content" source="./media/create-community-tab-4-approvals.png" alt-text="Screenshot showing the community approvals settings page during community creation in the portal." border="True" lightbox="./media/create-community-tab-4-approvals.png":::

1. Select `Next`. On the `Policy management` tab, and customize your settings as needed.

   :::image type="content" source="./media/create-community-tab-5-policy-management.png" alt-text="Screenshot showing the community policy management settings page during community creation in the portal." border="True" lightbox="./media/create-community-tab-5-policy-management.png":::
    
   > [!NOTE]
   > For community governance, you can configure the following settings for each service:
   >
   > - `Enforcement`: Determines whether rules for a service are actively enforced.
   > - `Audit Only`: Monitors services without actively enforcing rules. Use audit-only mode to understand the effect of potential governance policies before enforcement.
   > - `Options`: Sets the service policy behavior:
   >   - `Allow`: The service is allowed.
   >   - `Deny`: The service isn't allowed.
   >   - `ExceptionOnly`: The service isn't allowed by default, but manual [policy exemptions](/azure/governance/policy/concepts/exemption-structure) can be made.

1. Select `Next`. On the `Monitoring` tab, and configure monitoring for your community.

   :::image type="content" source="./media/create-community-tab-6-monitor.png" alt-text="Screenshot showing the community monitoring settings page during community creation in the portal." border="True" lightbox="./media/create-community-tab-6-monitor.png":::

1. Select `Next`. On the `Community administration` tab, select the users and groups that should receive Azure role assignments on the community managed resource group.

   :::image type="content" source="./media/create-community-tab-7-community-administration.png" alt-text="Screenshot showing the community administration settings page during community creation in the portal." border="True" lightbox="./media/create-community-tab-7-community-administration.png":::

1. Select `Next`. On the `Maintenance mode` tab, choose whether maintenance mode is turned on after the community is created. Community maintenance mode allows changes to managed resources that are critical to the security of the community, making it easier to modify community resources quickly after community creation. [Learn more about maintenance mode](./maintenance-mode.md).

   :::image type="content" source="./media/create-community-tab-8-maintenance-mode.png" alt-text="Screenshot showing the community maintenance mode settings page during community creation in the portal." border="True" lightbox="./media/create-community-tab-8-maintenance-mode.png":::

1. Select `Next`, and then enter any [tags](/azure/azure-resource-manager/management/tag-resources) for your community.

1. Select `Next` and then `Review + create`, validate that the details for your enclave are correct, and then select `Create`.

   :::image type="content" source="./media/tutorial-step-one-community-overview-page.png" alt-text="Screenshot showing created community on its overview page." border="True" lightbox="./media/tutorial-step-one-community-overview-page.png":::

## References
- [What is a community?](./what-community.md)
- [Create an enclave](./create-enclave-portal.md)
- [Best practices](./best-practices.md)
