---
title: Custom incident handlers in Azure SRE Agent (preview)
description: Learn To create a custom incident handler with specialized instructions for mitigating incidents.
author: craigshoemaker
ms.topic: conceptual
ms.date: 08/04/2025
ms.author: cshoe
ms.service: azure
---

# Custom incident handlers in Azure SRE Agent

A custom incident handler in Azure SRE Agent allows you to define how incidents are detected, reviewed, and mitigated within your environment. By configuring handlers, you can tailor the agent’s response to incidents, set autonomy levels, and provide custom instructions for incident management. You can choose between either semi-autonomous and fully autonomous operations, depending on your needs.

## Create a new handler

1. Open the Azure portal.

1. In the search bar, enter **Azure SRE Agent**.

1. From the results, select **Azure SRE Agent**.

1. Locate your agent in the list and from the *Agent name* column.

1. Select the agent by name that you want to create custom handler.

1. From the navigation bar, select **Settings**.

1. Select **Incident Platform**.

1. On the *Incident platform* screen, select the incident platform you want to integrate with (for example, Azure Monitor).

1. Select **Save**.

    > [!NOTE]
    > Information the user should notice even if skimmingOnce connected, the top tab strip now includes an *Incident management* tab. Select Incident Management.

1. Select New Incident Handler.

1. On the configuration screen, set the following values:

    | Property | Value | Note |
    |---|---|---|
    | Incident handler  name | Enter a unique name. | |
    | Incident type | Select **All incident types**. | |
    | Impacted service | Select **All impacted services**. | |
    | Priority | Select **All priorities**. | |
    | Title contains | Enter a string that filters relevant incident titles. | |

1. Under *Autonomy level*, select **Review**.

    > [!NOTE]
    > Begin by setting your agent autonomy level to *Review*. Once you evaluate how the agent deals with incidents in different contexts, and your confidence level in the agent behavior is satisfactory, then you can change the level to *Autonomous*.

1. To add custom instructions, select the checkbox next to *Add custom instructions*.

    When you add custom instructions, you give the agent an opportunity to learn from existing incidents. You also can't provide an extra set of prompts that guide the agent with custom instructions in dealing with incidents.

1. Select **Next**.

1. On the *Choose incidents* window, select up to five incidents for the agent to learn from.

1. In the *Add custom instructions* section, enter prompts to guide the agent’s review and mitigation process.

1. Select **Generate** to generate the handler and execution plan.

1. Review the generated execution plan in the custom instructions box.

1. Under the *Tools* section, review the list of tools the agent uses.

    You can remove or add tools as needed.

1. Select **Save** to finalize and save your incident handler.

## Related content

- [Incident management](./incident-management.md)
