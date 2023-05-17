---
title: Tutorial - Automatically check and record IP address reputation in incident in Microsoft Sentinel
description: In this tutorial, learn how to use Microsoft Sentinel automation rules and playbooks to automatically check IP addresses in your incidents against a threat intelligence source and record each result in its relevant incident.
author: yelevin
ms.author: yelevin
ms.topic: tutorial
ms.date: 12/05/2022
---

# Tutorial: Automatically check and record IP address reputation information in incidents

One quick and easy way to assess the severity of an incident is to see if any IP addresses in it are known to be sources of malicious activity. Having a way to do this automatically can save you a lot of time and effort.

In this tutorial, you'll learn how to use Microsoft Sentinel automation rules and playbooks to automatically check IP addresses in your incidents against a threat intelligence source and record each result in its relevant incident.

When you complete this tutorial, you'll be able to:

> [!div class="checklist"]
> * Create a playbook from a template
> * Configure and authorize the playbook's connections to other resources
> * Create an automation rule to invoke the playbook
> * See the results of your automated process


## Prerequisites
To complete this tutorial, make sure you have:

- An Azure subscription. Create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.

- A Log Analytics workspace with the Microsoft Sentinel solution deployed on it and data being ingested into it.

- An Azure user with the following roles assigned on the following resources: 
    - [**Microsoft Sentinel Contributor**](../role-based-access-control/built-in-roles.md#microsoft-sentinel-contributor) on the Log Analytics workspace where Microsoft Sentinel is deployed. 
    - [**Logic App Contributor**](../role-based-access-control/built-in-roles.md#logic-app-contributor), and **Owner** or equivalent, on whichever resource group will contain the playbook created in this tutorial.

- A (free) [VirusTotal account](https://www.virustotal.com/gui/my-apikey) will suffice for this tutorial. A production implementation requires a VirusTotal Premium account.

## Sign in to the Azure portal and Microsoft Sentinel

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the Search bar, search for and select **Microsoft Sentinel**.

1. Search for and select your workspace from the list of available Microsoft Sentinel workspaces.

1. On the **Microsoft Sentinel | Overview** page, select **Automation** from the navigation menu, under **Configuration**.

## Create a playbook from a template

Microsoft Sentinel includes ready-made, out-of-the-box playbook templates that you can customize and use to automate a large number of basic SecOps objectives and scenarios. Let's find one to enrich the IP address information in our incidents.

1. From the **Automation** page, select the **Playbook templates (Preview)** tab.

1. Filter the list of templates by tag:
    1. Select the **Tags** filter toggle at the top of the list (to the right of the **Search** field).

    1. Clear the **Select all** checkbox, then mark the **Enrichment** checkbox. Select **OK**.

    :::image type="content" source="media/tutorial-enrich-ip-information/1-filter-playbook-template-list.png" alt-text="Screenshot of list of playbook templates to be filtered by tags." lightbox="media/tutorial-enrich-ip-information/1-filter-playbook-template-list.png":::

1. Select the **IP Enrichment - Virus Total report** template, and select **Create playbook** from the details pane.

    :::image type="content" source="media/tutorial-enrich-ip-information/2-select-playbook-template.png" alt-text="Screenshot of selecting a playbook template from which to create a playbook." lightbox="media/tutorial-enrich-ip-information/2-select-playbook-template.png":::

1. The **Create playbook** wizard will open. In the **Basics** tab:
    1. Select your **Subscription**, **Resource group**, and **Region** from their respective drop-down lists.

    1. Edit the **Playbook name** by adding to the end of the suggested name "*Get-VirusTotalIPReport*". (This way you'll be able to tell which original template this playbook came from, while still ensuring that it has a unique name in case you want to create another playbook from this same template.) Let's call it "*Get-VirusTotalIPReport-Tutorial-1*".

    1. Let's leave the last two checkboxes unmarked as they are, as we don't need these services in this case:
        - Enable diagnostics logs in Log Analytics
        - Associate with integration service environment

        :::image type="content" source="media/tutorial-enrich-ip-information/3-playbook-basics-tab.png" alt-text="Screenshot of the Basics tab from the playbook creation wizard.":::

    1. Select **Next : Connections >**.

1. In the **Connections** tab, you'll see all the connections that this playbook needs to make to other services, and the authentication method that will be used if the connection has already been made in an existing Logic App workflow in the same resource group.

    1. Leave the **Microsoft Sentinel** connection as is (it should say "*Connect with managed identity*").

    2. If any connections say "*New connection will be configured*," you will be prompted to do so at the next stage of the tutorial. Or, if you already have connections to these resources, select the expander arrow to the left of the connection and choose an existing connection from the expanded list. For this exercise, we'll leave it as is.

        :::image type="content" source="media/tutorial-enrich-ip-information/4-playbook-connections-tab.png" alt-text="Screenshot of the Connections tab of the playbook creation wizard.":::

    1. Select **Next : Review and create >**.

1. In the **Review and create** tab, review all the information you've entered as it's displayed here, and select **Create and continue to designer**.

    :::image type="content" source="media/tutorial-enrich-ip-information/5-playbook-review-tab.png" alt-text="Screenshot of the Review and create tab from the playbook creation wizard.":::

    As the playbook is deployed, you'll see a quick series of notifications of its progress. Then the **Logic app designer** will open with your playbook displayed. We still need to authorize the logic app's connections to the resources it interacts with so that the playbook can run. Then we'll review each of the actions in the playbook to make sure they're suitable for our environment, making changes if necessary.

    :::image type="content" source="media/tutorial-enrich-ip-information/6-playbook-logic-app-designer.png" alt-text="Screenshot of playbook open in logic app designer window." lightbox="media/tutorial-enrich-ip-information/6-playbook-logic-app-designer.png":::

## Authorize logic app connections

Recall that when we created the playbook from the template, we were told that the Azure Log Analytics Data Collector and Virus Total connections would be configured later. 

:::image type="content" source="media/tutorial-enrich-ip-information/7-authorize-connectors.png" alt-text="Screenshot of review information from playbook creation wizard.":::

Here's where we do that.

### Authorize Virus Total connection

1. Select the **For each** action to expand it and review its contents (the actions that will be performed for each IP address).

    :::image type="content" source="media/tutorial-enrich-ip-information/8-for-each-loop.png" alt-text="Screenshot of for-each loop statement action in logic app designer.":::

1. The first action item you see is labeled **Connections** and has an orange warning triangle. 

    (If instead, that first action is labeled **Get an IP report (Preview)**, that means you already have an existing connection to Virus Total and you can go to the [next step](#next-step-condition).)

    1. Select the **Connections** action to open it. 
    1. Select the icon in the **Invalid** column for the displayed connection.

        :::image type="content" source="media/tutorial-enrich-ip-information/9-virus-total-invalid.png" alt-text="Screenshot of invalid Virus Total connection configuration.":::

        You'll be prompted for connection information.

        :::image type="content" source="media/tutorial-enrich-ip-information/10-virus-total-connection.png" alt-text="Screenshot shows how to enter API key and other connection details for Virus Total.":::

    1. Enter "*Virus Total*" as the **Connection name**. 

    1. For **x-api_key**, copy and paste the API key from your Virus Total account.

    1. Select **Update**.

    1. <a name="next-step-condition"></a>Now you'll see the **Get an IP report (Preview)** action properly. (If you already had a Virus Total account, you'll already be at this stage.)

        :::image type="content" source="media/tutorial-enrich-ip-information/11-get-ip-report-action.png" alt-text="Screenshot shows the action to submit an IP address to Virus Total to receive a report about it.":::

### Authorize Log Analytics connection

The next action is a **Condition** that determines the rest of the for-each loop's actions based on the outcome of the IP address report. It analyzes the **Reputation** score given to the IP address in the report. A score higher than 0 indicates the address is harmless; a score lower than 0 indicates it's malicious.

:::image type="content" source="media/tutorial-enrich-ip-information/12-reputation-condition.png" alt-text="Screenshot of condition action in logic app designer.":::

Whether the condition is true or false, we want to send the data in the report to a table in Log Analytics so it can be queried and analyzed, and add a comment to the incident.

But as you'll see, we have more invalid connections we need to authorize. 

:::image type="content" source="media/tutorial-enrich-ip-information/13-condition-true-false-actions.png" alt-text="Screenshot showing true and false scenarios for defined condition." lightbox="media/tutorial-enrich-ip-information/13-condition-true-false-actions.png":::

1. Select the **Connections** action in the **True** frame.

1. Select the icon in the **Invalid** column for the displayed connection.

    :::image type="content" source="media/tutorial-enrich-ip-information/14-log-analytics-invalid.png" alt-text="Screenshot of invalid Log Analytics connection configuration.":::

    You'll be prompted for connection information.

    :::image type="content" source="media/tutorial-enrich-ip-information/15-log-analytics-connection.png" alt-text="Screenshot shows how to enter Workspace ID and key and other connection details for Log Analytics.":::

1. Enter "*Log Analytics*" as the **Connection name**. 

1. For **Workspace Key** and **Workspace ID**, copy and paste the key and ID from your Log Analytics workspace settings. They can be found in the **Agents management** page, inside the **Log Analytics agent instructions** expander.

1. Select **Update**.

1. <a name="next-step-send-data"></a>Now you'll see the **Send data** action properly. (If you already had a Log Analytics connection from Logic Apps, you'll already be at this stage.)

    :::image type="content" source="media/tutorial-enrich-ip-information/16-send-data.png" alt-text="Screenshot shows the action to send a Virus Total report record to a table in Log Analytics.":::

1. Now select the **Connections** action in the **False** frame. This action uses the same connection as the one in the True frame.

1. Verify the connection called **Log Analytics** is marked, and select **Cancel**. This ensures that the action will now be displayed properly in the playbook.

    :::image type="content" source="media/tutorial-enrich-ip-information/17-log-analytics-invalid-2.png" alt-text="Screenshot of second invalid Log Analytics connection configuration.":::

    Now you'll see your entire playbook, properly configured.

1. **Very important!** Don't forget to select **Save** at the top of the **Logic app designer** window. After you see notification messages that your playbook was saved successfully, you'll see your playbook listed in the *Active playbooks** tab in the **Automation** page.

## Create an automation rule

Now, to actually run this playbook, you'll need to create an automation rule that will run when incidents are created and invoke the playbook.

1. From the **Automation** page, select **+ Create** from the top banner. From the drop-down menu, select **Automation rule**.

    :::image type="content" source="media/tutorial-enrich-ip-information/19-add-automation-rule.png" alt-text="Screenshot of creating an automation rule from the Automation page.":::

1. In the **Create new automation rule** panel, name the rule "*Tutorial: Enrich IP info*".

    :::image type="content" source="media/tutorial-enrich-ip-information/20-create-automation-rule-name.png" alt-text="Screenshot of creating an automation rule, naming it, and adding a condition.":::

1. Under **Conditions**, select **+ Add** and **Condition (And)**.

    :::image type="content" source="media/tutorial-enrich-ip-information/21-automation-rule-add-condition.png" alt-text="Screenshot of adding a condition to an automation rule.":::

1. Select **IP Address** from the property drop-down on the left. Select **Contains** from the operator drop-down, and leave the value field blank. This effectively means that the rule will apply to incidents that have an IP address field that contains anything.

    We don't want to stop any analytics rules from being covered by this automation, but we don't want the automation to be triggered unnecessarily either, so we're going to limit the coverage to incidents that contain IP address entities.

    :::image type="content" source="media/tutorial-enrich-ip-information/22-automation-rule-condition.png" alt-text="Screenshot of defining a condition to add to an automation rule.":::

1. Under **Actions**, select **Run playbook** from the drop-down.

1. Select the new drop-down that appears.

    :::image type="content" source="media/tutorial-enrich-ip-information/23-add-run-playbook-action.png" alt-text="Screenshot showing how to select your playbook from the list of playbooks - part 1.":::

    You'll see a list of all the playbooks in your subscription. The grayed-out ones are those you don't have access to. In the **Search playbooks** text box, begin typing the name - or any part of the name - of the playbook we created above. The list of playbooks will be dynamically filtered with each letter you type. 

    :::image type="content" source="media/tutorial-enrich-ip-information/24-search-playbooks.png" alt-text="Screenshot showing how to select your playbook from the list of playbooks - part 2.":::

    When you see your playbook in the list, select it.

    :::image type="content" source="media/tutorial-enrich-ip-information/25-select-playbook.png" alt-text="Screenshot showing how to select your playbook from the list of playbooks - part 3.":::

    If the playbook is grayed out, select the **Manage playbook permissions** link (in the fine-print paragraph below where you selected a playbook - see the screenshot above). In the panel that opens up, select the resource group containing the playbook from the list of available resource groups, then select **Apply**.

1. Select **+ Add action** again. Now, from the new action drop-down that appears, select **Add tags.**

1. Select **+ Add tag**. Enter "*Tutorial-Enriched IP addresses*" as the tag text and select **OK**.

    :::image type="content" source="media/tutorial-enrich-ip-information/26-automation-rule-tags.png" alt-text="Screenshot showing how to add a tag to an automation rule.":::

1. Leave the remaining settings as they are, and select **Apply**.

## Verify successful automation

1. In the **Incidents** page, enter the tag text *Tutorial-Enriched IP addresses* into the **Search** bar and hit the Enter key to filter the list for incidents with that tag applied. These are the incidents that our automation rule ran on.

1. Open any one or more of these incidents and see if there are comments about the IP addresses there. The presence of these comments indicates that the playbook ran on the incident.

## Clean up resources

If you're not going to continue to use this automation scenario, delete the playbook and automation rule you created with the following steps:

1. In the **Automation** page, select the **Active playbooks** tab.

1. Enter the name (or part of the name) of the playbook you created in the **Search** bar.  
    (If it doesn't show up, make sure any filters are set to **Select all**.)

1. Mark the check box next to your playbook in the list, and select **Delete** from the top banner.  
    (If you don't want to delete it, you can select **Disable** instead.)

1. Select the **Automation rules** tab.

1. Enter the name (or part of the name) of the automation rule you created in the **Search** bar.  
    (If it doesn't show up, make sure any filters are set to **Select all**.)

1. Mark the check box next to your automation rule in the list, and select **Delete** from the top banner.  
    (If you don't want to delete it, you can select **Disable** instead.)

## Next steps

Now that you've learned how to automate a basic incident enrichment scenario, learn more about automation and other scenarios you can use it in.

- See more examples of [using playbooks together with automation rules](tutorial-respond-threats-playbook.md).
- Take a deeper dive into [adding actions to playbooks](playbook-triggers-actions.md).
- Explore some [basic automation scenarios](automate-incident-handling-with-automation-rules.md) that don't require playbooks.
