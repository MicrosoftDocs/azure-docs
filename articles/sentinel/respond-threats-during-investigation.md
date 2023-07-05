---
title: Respond to threat actors while investigating or threat hunting in Microsoft Sentinel
description: This article shows you how to take response actions against threat actors on the spot, during the course of an incident investigation or threat hunt, without pivoting or context switching out of the investigation or hunt. You accomplish this using playbooks based on the new entity trigger.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 01/17/2023
---

# Respond to threat actors while investigating or threat hunting in Microsoft Sentinel

This article shows you how to take response actions against threat actors on the spot, during the course of an incident investigation or threat hunt, without pivoting or context switching out of the investigation or hunt. You accomplish this using playbooks based on the new entity trigger.

The entity trigger currently supports the following entity types:
- [Account](entities-reference.md#user-account)
- [Host](entities-reference.md#host)
- [IP](entities-reference.md#ip-address)
- [URL](entities-reference.md#url)
- [DNS](entities-reference.md#domain-name)
- [FileHash](entities-reference.md#file-hash)

> [!IMPORTANT]
>
> The **entity trigger** is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Run playbooks with the entity trigger

When you're investigating an incident, and you determine that a given entity - a user account, a host, an IP address, a file, and so on - represents a threat, you can take immediate remediation actions on that threat by running a playbook on-demand. You can do likewise if you encounter suspicious entities while proactively hunting for threats outside the context of incidents.

1. Select the entity in whichever context you encounter it, and choose the appropriate means to run a playbook, as follows:
    - In the **Entities** widget on the **Overview tab** of an incident in the [new incident details page](investigate-incidents.md#explore-the-incidents-entities) (now in Preview), or in its [**Entities tab**](investigate-incidents.md#entities-tab), choose an entity from the list, select the three dots next to the entity, and select **Run playbook (Preview)** from the pop-up menu.

        :::image type="content" source="media/respond-threats-during-investigation/incident-details-overview.png" alt-text="Screenshot of incident details page.":::

        :::image type="content" source="media/respond-threats-during-investigation/entities-tab.png" alt-text="Screenshot of entities tab on incident details page.":::

    - In the **Entities** tab of an incident, choose the entity from the list and select the **Run playbook (Preview)** link at the end of its line in the list.

        :::image type="content" source="media/respond-threats-during-investigation/incident-details-page.png" alt-text="Screenshot of selecting entity from incident details page to run a playbook on it.":::

    - From the **Investigation graph**, select an entity and select the **Run playbook (Preview)** button in the entity side panel.

        :::image type="content" source="media/respond-threats-during-investigation/investigation-graph.png" alt-text="Screenshot of selecting an entity from the investigation graph to run a playbook on it.":::

    - From the **Entity behavior** page, select an entity. From the resulting entity page, select the **Run playbook (Preview)** button in the left-hand panel.

        :::image type="content" source="media/respond-threats-during-investigation/entity-behavior-page.png" alt-text="Screenshot of selecting an entity from the entity behavior page to run a playbook on it.":::

        :::image type="content" source="media/respond-threats-during-investigation/entity-page.png" alt-text="Screenshot of the selected entity page to run a playbook on an entity.":::

1. These will all open the **Run playbook on *\<entity type>*** panel.    

    :::image type="content" source="media/respond-threats-during-investigation/run-playbook-on-entity.png" alt-text="Screenshot of Run playbook on entity panel.":::

    In any of these panels, you'll see two tabs: **Playbooks** and **Runs**.

1. In the **Playbooks** tab, you'll see a list of all the playbooks that you have access to and that use the **Microsoft Sentinel Entity** trigger for that entity type (in this case, user accounts). Select the **Run** button for the playbook you want to run it immediately.

   > [!NOTE]
   > If you don't see the playbook you want to run in the list, it means Microsoft Sentinel doesn't have permissions to run playbooks in that resource group ([learn more](tutorial-respond-threats-playbook.md#explicit-permissions)). To grant those permissions, select **Settings** from the main menu, choose the **Settings** tab, expand the **Playbook permissions** expander, and select **Configure permissions**. In the **Manage permissions** panel that opens up, mark the check boxes of the resource groups containing the playbooks you want to run, and select **Apply**.

1. You can audit the activity of your entity-trigger playbooks in the **Runs** tab. You'll see a list of all the times any playbook has been run on the entity you selected. It might take a few seconds for any just-completed run to appear in this list. Selecting a specific run will open the full run log in Azure Logic Apps.


## Next steps

In this article, you learned how to run playbooks manually to remediate threats from entities while in the middle of investigating an incident or hunting for threats.

- Learn more about [investigating incidents](investigate-incidents.md) in Microsoft Sentinel.
- Learn how to [proactively hunt for threats](hunting.md) using Microsoft Sentinel.
- Learn more about [entities](entities.md) in Microsoft Sentinel.
- Learn more about [playbooks](automate-responses-with-playbooks.md) in Microsoft Sentinel.
