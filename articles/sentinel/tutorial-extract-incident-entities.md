---
title: Extract incident entities with non-native actions 
description: In this tutorial, you extract entity types with action types that aren't native to Microsoft Sentinel, and save these actions in a playbook to use for SOC automation.
author: limwainstein
ms.author: lwainstein
ms.topic: tutorial
ms.date: 02/28/2023

---
# Tutorial: Extract incident entities with non-native actions 

Entity mapping enriches alerts and incidents with information essential for any investigative processes and remedial actions that follow. 

Microsoft Sentinel playbooks include these native actions to extract entity info: 

- Accounts 
- DNS 
- File hashes 
- Hosts 
- IPs 
- URLs  

In addition to these actions, analytic rule entity mapping contains entity types that aren't native actions, like malware, process, registry key, mailbox, and more. In this tutorial, you learn how to work with non-native actions using different built-in actions to extract the relevant values.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a playbook with an incident trigger and run it manually on the incident.
> * Initialize an array variable.
> * Filter the required entity type from other entity types. 
> * Parse the results in a JSON file.
> * Create the values as dynamic content for future use.

## Prerequisites

To complete this tutorial, make sure you have:

- An Azure subscription. Create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.

- An Azure user with the following roles assigned on the following resources: 
    - [**Microsoft Sentinel Contributor**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) on the Log Analytics workspace where Microsoft Sentinel is deployed. 
    - [**Logic App Contributor**](../role-based-access-control/built-in-roles.md#logic-app-contributor), and **Owner** or equivalent, on whichever resource group will contain the playbook created in this tutorial.

- A (free) [VirusTotal account](https://www.virustotal.com/gui/my-apikey) will suffice for this tutorial. A production implementation requires a VirusTotal Premium account.

## Create a playbook with an incident trigger

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.
1. On the left, select **Automation**, and on the top left of the **Automation** page, select **Create** > **Playbook with incident trigger**.
1. In the **Create playbook** wizard, under **Basics**, select the subscription and resource group, and give the playbook a name. 
1. Select **Next: Connections >**.

    Under **Connections**, the **Microsoft Sentinel - Connect with managed identity** connection should be visible.

    :::image type="content" source="media/tutorial-extract-incident-entities/create-playbook.png" alt-text="Screenshot of creating a new playbook with an incident trigger.":::

1. Select **Next: Review and create >**.
1. Under **Review and create**, select **Create and continue to designer**.

    The Logic app designer opens a logic app with the name of your playbook.

    :::image type="content" source="media/tutorial-extract-incident-entities/logic-app-designer.png" alt-text="Screenshot of viewing the playbook in the Logic app designer.":::

## Initialize an Array variable

1. In the Logic app designer, under the step where you want to add a variable, select **New step**.
1. Under **Choose an operation**, in the search box, type *variables* as your filter. From the actions list, select **Initialize variable**.
1. Provide this information about your variable:

    - For the variable name, use *Entities*. 
    - For the type, select **Array**. 
    - For the value, start typing *entities* and select **Entities** under **Dynamic content**.

        :::image type="content" source="media/tutorial-extract-incident-entities/initialize-variable.png" alt-text="Screenshot of initializing an Array variable.":::  

## Select an existing incident

1. In Microsoft Sentinel, navigate to **Incidents** and select an incident on which you want to run the playbook. 
1. In the incident page on the right, select **Actions > Run playbook (Preview**).
1. Under **Playbooks**, next to the [playbook you created](#create-a-playbook-with-an-incident-trigger), select **Run**.

    When the playbook is triggered, a **Playbook is triggered successfully** message is visible on the top right.

1. Select **Runs**, and next to your playbook, select **View Run**.

    The **Logic app run** page is visible.

1. Under **Initialize variable**, the sample payload is visible under **Value**. Note the sample payload for later use.

    :::image type="content" source="media/tutorial-extract-incident-entities/sample-payload-new.png" alt-text="Screenshot of viewing the sample payload under the Value field." lightbox="media/tutorial-extract-incident-entities/sample-payload-new.png":::  

## Filter the required entity type from other entity types

1. Navigate back to the **Automation** page and select your playbook. 
1. Under the step where you want to add a variable, select **New step**.
1. Under **Choose an action**, in the search box, enter *filter array* as your filter. From the actions list, select **Data operations**.

    :::image type="content" source="media/tutorial-extract-incident-entities/filter-array-data-operations.png" alt-text="Screenshot of filtering an array and selecting data operations.":::  

1. Provide this information about your filter array: 

    1. Under **From** > **Dynamic content**, select the [**Entities** variable you initialized previously](#initialize-an-array-variable).
    1. Select the first **Choose a value** field (on the left), and select **Expression**. 
    1. Paste the value *item()?['kind']*, and select **OK**. 

        :::image type="content" source="media/tutorial-extract-incident-entities/filter-array-information.png" alt-text="Screenshot of filling in the filter array expression.":::

    1. Leave the **is equal to** value (do not modify it).
    1. In the second **Choose a value** field (on the right), type *Process*. This needs to be an exact match to the value in the system. 

        > [!NOTE]
        > This query is case-sensitive. Ensure that the `kind` value matches the value in the sample payload. See the sample payload from when you [create a playbook](#create-a-playbook-with-an-incident-trigger). 

        :::image type="content" source="media/tutorial-extract-incident-entities/filter-array-information-full.png" alt-text="Screenshot of filling in the filter array information.":::

## Parse the results to a JSON file

1. In your logic app, under the step where you want to add a variable, select **New step**.
1. Select **Data operations** > **Parse JSON**.

    :::image type="content" source="media/tutorial-extract-incident-entities/parse-json.png" alt-text="Screenshot of selecting the Parse JSON option under Data Operations.":::

1. Provide this information about your operation:

    1. Select **Content**, and under **Dynamic content** > **Filter array**, select **Body**. 

        :::image type="content" source="media/tutorial-extract-incident-entities/dynamic-content-new.png" alt-text="Screenshot of selecting Dynamic content under Content.":::

    1. Under **Schema**, paste a JSON schema so that you can extract values from an array. Copy the sample payload you generated when you [created the playbook](#create-a-playbook-with-an-incident-trigger). 
    
        :::image type="content" source="media/tutorial-extract-incident-entities/copy-sample-payload-new.png" alt-text="Screenshot of copying the sample payload." lightbox="media/tutorial-extract-incident-entities/copy-sample-payload-new.png":::

    1. Return to the playbook, and select **Use sample payload to generate schema**.  
    
        :::image type="content" source="media/tutorial-extract-incident-entities/use-sample-payload.png" alt-text="Screenshot of selecting Use sample payload to generate schema.":::

    1. Paste the payload. Add an opening square bracket (`[`) at the beginning of the schema and close them at the end of the schema `]`.
    
        :::image type="content" source="media/tutorial-extract-incident-entities/paste-sample-payload-first.png" alt-text="Screenshot of pasting the sample payload.":::

        :::image type="content" source="media/tutorial-extract-incident-entities/paste-sample-payload-second.png" alt-text="Screenshot of the second part of the pasted sample payload."::: 

    1. Select **Done**. 

## Use the new values as dynamic content for future use

You can now use the values you created as dynamic content for further actions. For example, if you want to send an email with process data, you can find the **Parse JSON** action under **Dynamic content**, if you didn't change the action name. 

:::image type="content" source="media/tutorial-extract-incident-entities/utilize-dynamic-content-new.png" alt-text="Screenshot of sending an email with process data.":::

## Ensure that your playbook is saved

Ensure that the playbook is saved, and you can now use your playbook for SOC operations. 

## Next steps

Advance to the next article to learn how to create and perform incident tasks in Microsoft Sentinel using playbooks.
> [!div class="nextstepaction"]
> [Create and perform incident tasks in Microsoft Sentinel using playbooks](create-tasks-playbook.md)