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

- Filled the [Logic App prerequisites](/logic-apps/logic-apps-create-variables-store-values#prerequisites). 

## Create a playbook with an incident trigger

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.
1. On the left, select **Automation**, and on the top left of the **Automation** page, select **Create** > **Playbook with incident trigger**.
1. In the **Create playbook** wizard, under **Basics**, select the subscription and resource group, and give the playbook a name. 
1. Select **Next: Connections >**.

    Under **Connections**, the **Microsoft Sentinel - Connect with managed identity** connection should be visible.

    TBD - screenshot

1. Select **Next: Review and create >**.
1. Under **Review and create**, select **Create and continue to designer**.

    The Logic app designer opens a logic app with the name of your playbook.

## Initialize an Array variable

1. In the Logic app designer, under the step where you want to add a variable, select **New step**.
1. Under **Choose an operation**, in the search box, enter *variables* as your filter. From the actions list, select **Initialize variable**.
1. Provide this information about your variable:

    - For the variable name, use *Entities*. 
    - For the type, select **Array**. 
    - For the value, start typing *entities* and select **Entities** under **Dynamic content**.

    TBD - SCREENSHOT  

## Select an existing incident

1. In Microsoft Sentinel, navigate to **Incidents** and select an incident on which you want to run the playbook. 
1. In the incident page on the right, select **Actions > Run playbook (Preview**).
1. Under **Playbooks**, next to the [playbook you created](#create-a-playbook-with-an-incident-trigger), select **Run**.

    When the playbook is triggered, a **Playbook is triggered successfully** message is visible on the top right.

    TBD - screenshot

1. Select **Runs**, and next to your playbook, select **View Run**.

    The **Logic app run** page is visible.

1. Under **Initialize variable**, the schema is visible under **Show raw inputs**. Note the sample payload for later use.

## Filter the required entity type from other entity types

1. Navigate back to the **Automation** page and select your playbook. 
1. Under the step where you want to add a variable, select **New step**.
1. Under **Choose an action**, in the search box, enter *filter array* as your filter. From the actions list, select **Data operations**.

    TBD - SCREENSHOT

1. Provide this information about your filter array: 

    1. Under **From** > **Dynamic content**, select the [**Entities** variable you initialized previously](#initialize-an-array-variable).
    1. Select the first **Choose a value** field (on the left), and select **Expression**. 
    1. Paste the value *item()?['kind']*, and select **OK**. 

        TBD - SCREENSHOT

    1. Leave the **is equal to** value (do not modify it).
    1. In the second **Choose a value** field (on the right), type *Process*. This needs to be an exact match to the value in the system. 

        > [!NOTE]
        > This query is case-sensitive. Ensure that the `kind` value matches the value in the sample payload. See the sample payload from when you [create a playbook](#create-a-playbook-with-an-incident-trigger). 

        TBD - SCREENSHOT

## Parse the results to a JSON file

1. In your logic app, under the step where you want to add a variable, select **New step**.
1. Select **Data operations** > **Parse JSON**.
    TBD - SCREENSHOT
1. Provide this information about your operation:
    1. Select **Content**, and under **Dynamic content** > **Filter array**, select **Body**. 

    TBD - SCREENSHOT

    1. Under **Schema**, paste a JSON schema so that you can extract values from an array. Use the sample payload you generated when you [created the playbook](#create-a-playbook-with-an-incident-trigger).  

        TBD - SCREENSHOT

    1. Copy the sample payload, return to the playbook, select **Use sample payload to generate scheme**, and paste the payload. 
    1. Add an opening square bracket (`[`) at the beginning of the schema and close them at the end of the schema `]`.
    1. Select **Done**. 

        TBD - SCREENSHOT

        TBD - SCREENSHOT

        TBD - SCREENSHOT

        TBD - SCREENSHOT

## Use the new values as dynamic content for future use

You can now use the values you created as dynamic content for further actions. For example, if you want to send an email with process data, you can find the **Parse JSON** action under **Dynamic content**, if you didn't change the action name. 

TBD - SCREENSHOT

## Ensure that your playbook is saved

Ensure that the playbook is saved, and you can now use your playbook for SOC operations. 

## Next steps

Advance to the next article to learn how to create and perform incident tasks in Microsoft Sentinel using playbooks.
> [!div class="nextstepaction"]
> [Next steps button](create-tasks-playbook.md)