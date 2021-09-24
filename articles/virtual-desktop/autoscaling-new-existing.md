---
title: Azure Virtual Desktop scaling plans for host pools
description: How to assign scaling plans to new or existing host pools in your deployment.
author: Heidilohr
ms.topic: how-to
ms.date: 09/21/2021
ms.author: helohr
manager: femila
---
## Enable scaling plans for existing and new host pools

> [!IMPORTANT]
> The autoscaling feature is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

You can enable scaling plans for any existing host pools in your deployment. When you apply your scaling plan to the host pool, the plan will also apply to all session hosts within that host pool. Scaling also automatically applies to any new session hosts you create in your assigned host pool.

If you disable a scaling plan, all assigned resources will remain in the scaling state they were in at the time you disabled it.

# Assign a scaling plan to an existing host pool

To assign a scaling plan to an existing host pool:

1. Open the [Azure portal](https://portal.azure.com).

2. Go to **Windows Virtual Desktop**.

3. Select **Host pools**, then go to **Scaling plan** and select **New**.

![](media/f68ee5b51396fdf60e4c7d7910848b9c.png)

![Graphical user interface, application Description automatically generated](media/f68ee5b51396fdf60e4c7d7910848b9c.png)

1. Select **Scaling plan** to assign a scaling plan to an unassigned host pool.

    ![](media/352ef2258c6a7cb862a7fec57dd881d6.png)

    - When you have enabled the scaling plan during deployment you have the option to disable the plan for the selected host pool here.

        ![Graphical user interface, text, application, email Description automatically generated](media/8e65d9913651538ee18b4d3b679b1305.png)

## Edit an existing scaling plan

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com/).

2. Go to **Azure Virtual Desktop**.

3. Select **Scaling plan**, then select the name of the scaling plan you want to edit. The settings window should open.

4. To edit the plan's display name, description, time zone, or exclusion tags, go to the **Properties** tab.

5. To assign host pools or edit schedules, go to the **Manage** tab.

## Next steps

- Review how to create a scaling plan at [Autoscaling for Azure Virtual Desktop session hosts](autoscaling-new-existing.md).
- Learn how to troubleshoot your scaling plan at [Enable diagnostics for your scaling plan](autoscaling-diagnostics.md).