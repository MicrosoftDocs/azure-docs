---
title: Custom incident handlers in Azure SRE Agent (preview)
description: Learn To create a custom incident handler with specialized instructions for mitigating incidents.
author: craigshoemaker
ms.topic: conceptual
ms.date: 08/05/2025
ms.author: cshoe
ms.service: azure
---

# Custom incident handlers in Azure SRE Agent

A custom incident handler in Azure SRE Agent allows you to define how incidents are detected, reviewed, and mitigated within your environment. By configuring handlers, you can tailor the agent’s response to incidents, set autonomy levels, and provide custom instructions for incident management. You can choose between either semi-autonomous and fully autonomous operations, depending on your needs.

When you create a handler, you first define the settings, and then generate an execution plan. Once the plan is generated, you can review and edit the plan before creating the handler.

The following procedure demonstrates how to create a handler using the management platform of your choice.

## Create a new handler

1. Open your SRE Agent in the Azure portal.

1. Select **Settings**.

1. Select **Incident platform**.

1. On the *Incident platform* window, select the platform you want to manage your incident.

1. Select **Save**.

    > [!NOTE]
    > Once connected, the top tab strip now includes an *Incident management* tab.

1. Select the **Incident management** tab.

1. Select **New incident handler** to open the handler configuration window.

1. To configure your handler, set the following values:

    | Property | Value | Note |
    |---|---|---|
    | Incident handler  name | Enter a unique name for your handler. | |
    | Incident type | Select the types of incidents you want this handler to manage. | If you're using Azure Monitor, the only option available is *All incident types*.  |
    | Impacted service | Select the services you want to monitor. | If you're using Azure Monitor, the only available option is *All impacted services*. |
    | Priority | Select the priority of incidents you want to manage. | If you're using Azure Monitor, the only available option is *All priorities*. |
    | Title contains | Enter a string that filters incident titles. | |

    > [!NOTE]
    > If you'd like more control over defining the incident types, services impacted, and priorities, consider using PagerDuty or ServiceNow as your incident management platform.

1. Under *Autonomy level*, select either *Review* or *Autonomous*.

    > [!NOTE]
    > Begin by setting your agent autonomy level to *Review*. Once you evaluate how the agent deals with incidents in different contexts, and your confidence level in the agent behavior is satisfactory, then you can change the level to *Autonomous*.

1. To add custom instructions, select the checkbox next to *Add custom instructions*.

    When you add custom instructions, you give the agent an opportunity to learn from existing incidents. You also can't provide an extra set of prompts that guide the agent with custom instructions in dealing with incidents.

1. Select **Next**.

1. On the *Choose incidents* window, select up to five incidents for the agent to learn from.

1. In the *Add custom instructions* section, enter prompts to guide the agent’s review and mitigation process.

    For more information, see the [example prompts](#example-custom-instruction-prompts) section.

1. Select **Generate** to generate the handler's execution plan.

1. Review the generated plan in the custom instructions box.

1. Under the *Tools* section, review the list of tools the agent uses.

    You can remove or add tools as needed.

1. Select **Save** to finalize and save your incident handler.

## Example custom instruction prompts

TODO

## Related content

- [Incident management](./incident-management.md)
