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

To access Azure Virtual Enclaves, you need an Azure subscription. If you don't already have one, create a [free account](https://azure.microsoft.com/free/), and then sign in to the [Azure portal](https://portal.azure.com).

## Create community

1. Enter `Azure Virtual Enclaves` in the search.
2. Under `Services`, select `Azure Virtual Enclaves`. You're directed to the Azure Virtual Enclaves homepage.

    [ ![Screenshot showing the Azure portal homepage for Azure Virtual Enclaves with the Create a community button.](./media/azure-virtual-enclaves-homepage.png) ](./media/azure-virtual-enclaves-homepage.png#lightbox)

3. Select the `Create a community` button. The community deployment can take several minutes to complete.
4. Enter details for your community on the `Basics` tab:
   - `Subscription`: Select an Azure subscription.
   - `Resource group`: Create a new resource group or select an existing one.
   - `Community name`: Enter a community name, such as `My-Community`.
   - `Region`: Select the Azure region where the community is created.
   - `Community address space`: Enter the community IP address space, such as `10.0.0.0/16`.

    > [!NOTE]
    > `192.168.0.0/16` is reserved as the platform-managed enclave range. Don't create communities with any address space that overlaps or includes this range, such as `192.0.0.0/8` or `192.128.0.0/9`, because it creates conflicts with platform-managed enclave management IP ranges.

    ![Screenshot showing community creation basics inputs page.](./media/create-community-tab-1-basics.png)

5. Select `Next`. On the `Azure firewall` tab, decide if you want to use a different firewall type for your community Virtual WAN secure hubs.

6. Select `Next`. On the `Dedicated hubs` tab, create any dedicated hubs you need.

7. Select `Next`. On the `Approvals` tab, decide which [approval settings](./configure-approvals.md) to apply to your community and enclaves.

8. Select `Next`. On the `Policy management` tab, and customize your settings as needed.

    ![Screenshot of policy management page where a user can manage policies on a selection of Azure services.](./media/create-community-tab-2-policy-management.png)
    
    > [!NOTE]
    > For community governance, you can configure the following settings for each service:
    >
    > - `Enforcement`: Determines whether rules for a service are actively enforced.
    > - `Audit Only`: Monitors services without actively enforcing rules. Use audit-only mode to understand the effect of potential governance policies before enforcement.
    > - `Options`: Sets the service policy behavior:
    >   - `Allow`: The service is allowed.
    >   - `Deny`: The service isn't allowed.
    >   - `ExceptionOnly`: The service isn't allowed by default, but manual [policy exemptions](/azure/governance/policy/concepts/exemption-structure) can be made.

9. Select `Next`. On the `Monitoring` tab, and configure monitoring for your community.

10. Select `Next`. On the `Community administration` tab, select the users and groups that should receive Azure role assignments on the community managed resource group.

    ![Screenshot showing community administration input tab during community creation.](./media/create-community-tab-3-community-administration.png)

11. Select `Next`. On the `Maintenance mode` tab, choose whether maintenance mode is turned on after the community is created. Community maintenance mode allows changes to managed resources that are critical to the security of the community, making it easier to modify community resources quickly after community creation. [Learn more about maintenance mode](./maintenance-mode.md).

    ![Screenshot showing community create maintenance mode input page.](./media/create-community-tab-4-maintenance-mode.png)

12. Select `Next`, and then enter any [tags](/azure/azure-resource-manager/management/tag-resources) for your community.

13. Select `Next` and then `Review + create`, validate that the details for your enclave are correct, and then select `Create`.

    ![Screenshot showing created community on its overview page.](./media/tutorial-step-one-community-overview-page.png)

## References
- [What is a community?](./what-community.md)
- [Create an enclave](./create-enclave-portal.md)
- [Best practices](./best-practices.md)
