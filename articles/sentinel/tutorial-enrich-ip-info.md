---
title: Tutorial - Use automation to check and record IP address reputation in incident
description: In this tutorial, learn how to use Microsoft Sentinel automation rules and playbooks to automatically check any IP addresses in any of your incidents against an external threat intelligence source and record each result in the relevant incident or incidents.
author: yelevin
ms.author: yelevin
ms.topic: tutorial
ms.date: 12/05/2022
---

# Tutorial: Use automation to check and record IP address reputation in incident

One of the first things you'll want to do when trying to assess the severity of an incident is to check any IP addresses in it for their reputation scores - if they're known as safe or malicious, or anything in between. Having a way to do this automatically can save you a lot of time and effort.

In this tutorial, you learn how to use Microsoft Sentinel automation rules and playbooks to automatically check any IP addresses in any of your incidents against an external threat intelligence source and record each result in the relevant incident or incidents.

When you complete this tutorial, you'll be able to:

> [!div class="checklist"]
> * Create a playbook from a template
> * Modify and approve the playbook for your environment
> * Create an automation rule
> * Invoke the playbook from your automation rule


## Prerequisites
To complete this tutorial, make sure you have:

- An Azure subscription. Create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.

- A Log Analytics workspace with the Microsoft Sentinel solution deployed on it.

- A (free) [VirusTotal account](https://www.virustotal.com/gui/my-apikey) will suffice for this tutorial. A production implementation requires a VirusTotal Premium account.

## Sign in to the Azure portal and Microsoft Sentinel

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the Search bar, search for and select **Microsoft Sentinel**.

1. Search for and select your workspace from the list of available Microsoft Sentinel workspaces.

1. On the **Microsoft Sentinel | Overview** page, select **Automation** from the navigation menu, under **Configuration**.

<!-- 7. Task H2s ------------------------------------------------------------------------------

Required: Each major step in completing a task should be represented as an H2 in the article.
These steps should be numbered.
The procedure should be introduced with a brief sentence or two.
Multiple procedures should be organized in H2 level sections.
Procedure steps use ordered lists.
-->

## 1 - Create a playbook from a template

Microsoft Sentinel includes ready-made, out-of-the-box playbook templates that you can customize and use to automate a large number of basic SecOps objectives and scenarios. Let's find one to enrich the IP address information in our incidents.

1. From the **Automation** page, select the **Playbook templates (Preview)** tab.

1. Filter the list of templates by tag:
    1. Select the **Tags** filter toggle at the top of the list (to the right of the **Search** field).

    1. Clear the **Select all** checkbox, then mark the **Enrichment** checkbox. Select **OK**.

    :::image type="content" source="media/tutorial-enrich-ip-info/1-filter-playbook-template-list.png" alt-text="Screenshot of list of playbook templates to be filtered by tags." lightbox="media/tutorial-enrich-ip-info/1-filter-playbook-template-list.png":::

1. Select the **IP Enrichment - Virus Total report** template, and select **Create playbook** from the details pane.

    :::image type="content" source="media/tutorial-enrich-ip-info/2-select-playbook-template.png" alt-text="Screenshot of selecting a playbook template from which to create a playbook." lightbox="media/tutorial-enrich-ip-info/2-select-playbook-template.png":::

1. The **Create playbook** wizard will open. In the **Basics** tab:
    1. Select your **Subscription**, **Resource group**, and **Region** from their respective drop-down lists.

    1. Edit the **Playbook name** by adding to the end of the suggested name "*Get-VirusTotalIPReport*". (This way you'll be able to tell which original template this playbook came from, while still ensuring that it has a unique name in case you want to create another playbook from this same template.) Let's call it "*Get-VirusTotalIPReport-Tutorial-1*".

    1. Let's leave the last two checkboxes unmarked as they are, as we don't need these services in this case:
        - Enable diagnostics logs in Log Analytics
        - Associate with integration service environment

        :::image type="content" source="media/tutorial-enrich-ip-info/3-playbook-basics-tab.png" alt-text="Screenshot of the Basics tab from the playbook creation wizard.":::

    1. Select **Next : Connections >**.

1. In the **Connections** tab, you'll see all the connections that this playbook needs to make to other services, and the authentication method that will be used if the connection has already been made in an existing Logic App workflow in the same resource group.

    1. Leave the **Microsoft Sentinel** connection as is (it should say "*Connect with managed identity*").

    2. If any connections say "*New connection will be configured*," you will be prompted to do this at the next stage of the tutorial. Or, if you already have connections to these resources, select the expander arrow to the left of the connection and choose an existing connection from the expanded list. For this exercise we'll leave it as is.

        :::image type="content" source="media/tutorial-enrich-ip-info/4b-playbook-connections-tab.png" alt-text="Screenshot of the Connections tab of the playbook creation wizard.":::

    1. Select **Next : Review and create >**.

1. In the **Review and create** tab, review all the information you've entered as it's displayed here, and select **Create and continue to designer**.

    :::image type="content" source="media/tutorial-enrich-ip-info/5-playbook-review-tab.png" alt-text="Screenshot of the Review and create tab from the playbook creation wizard.":::

## 2 - Modify and approve the playbook for your environment

As the playbook is deployed, you'll see a quick series of notifications of its progress. Then the **Logic app designer** will open with your playbook displayed. We'll go through each of the actions in the playbook to make sure it's suitable for our environment, making changes as necessary.

:::image type="content" source="media/tutorial-enrich-ip-info/6-playbook-logic-app-designer.png" alt-text="Screenshot of playbook open in logic app designer window." lightbox="media/tutorial-enrich-ip-info/6-playbook-logic-app-designer.png":::

1. The first step is the incident trigger which sets the incident as the input schema for the playbook.

1. The second step is the extraction of the list of IP address entities in the incident, to be used by the next step.

1. The third step introduces a computation: For each IP address discovered in the incident, the playbook will take the actions defined inside the **For each** frame. Select the **For each** action to open it.

    :::image type="content" source="media/tutorial-enrich-ip-info/7a-for-each-loop.png" alt-text="Screenshot of for-each loop statement action in logic app designer.":::

    1. If you already have an existing connection to Virus Total, skip this step. If you don't, you should see an orange warning triangle on an action labeled **Connections** instead of the **Get an IP report (Preview)** action. Select it to open it and enter the connection parameters from your Virus Total account, then select **Create**.

        :::image type="content" source="media/tutorial-enrich-ip-info/8-virus-total-connection.png" alt-text="Screenshot shows how to enter API key and other connection details for Virus Total.":::

    1. Now you'll see the **Get an IP report (Preview)** action properly. (If you already had a Virus Total account, you'll already be at this stage.)

        :::image type="content" source="media/tutorial-enrich-ip-info/9-get-ip-report-action.png" alt-text="Screenshot shows the action to submit an IP address to Virus Total to receive a report about it.":::

1. The next action is a **Condition** that determines the rest of the playbook's actions based on the outcome of the IP address report. It analyzes the **Reputation** score given to the IP address in the report. A score higher than 0 indicates the address is harmless; a score lower than 0 indicates it's malicious.

    :::image type="content" source="media/tutorial-enrich-ip-info/10-reputation-condition.png" alt-text="Screenshot of condition action in logic app designer.":::

    Whether the condition is true or false, we want to send the data in the report to a table in Log Analytics so it can be queried and analyzed, and add a comment to the incident.

    :::image type="content" source="media/tutorial-enrich-ip-info/11-condition-true-false-actions.png" alt-text="Screenshot showing true and false scenarios for defined condition." lightbox="media/tutorial-enrich-ip-info/condition-true-false-actions.png":::

1. Inside both the **True** and **False** frames is an identical action: send data to a Log Analytics table. 

    - The **JSON Request Body** field contains the dynamic content item representing the data in the Virus Total report. 
    - The **Custom Log Name** field contains the name of the Log Analytics table into which the data will be placed. 
    - Finally, the **Time-generated-field** field indicates the value to be placed in the timestamp field in the destination table. It's populated by a function that returns the current time (the time of the execution of this action) in UTC format.

1. Following the send data action in both the **True** and **False** frames is another near-identical action: add a comment to the open incident.

    - The **Incident ARM id** field contains the ID of the open incident.
    - The **Incident comment message** field contains a rich-text message of your choosing, that can incorporate dynamic content elements from any available object. It's pre-populated in this template by a message indicating the IP address being checked is most likely harmless (in the **True** frame) or malicious (in the **False** frame).

1. If you made any changes in the design, including adding or changing connection credentials, select **Save** at the top of the **Logic app designer** window.

## 3 - Create an automation rule

Now, to actually run this playbook, you'll need to create an automation rule that will run when incidents are created and invoke the playbook.

1. From the **Automation** page, select **+ Create** from the top banner. From the drop-down menu, select **Automation rule**.

    :::image type="content" source="media/tutorial-enrich-ip-info/12-add-automation-rule.png" alt-text="Screenshot of creating an automation rule from the Automation page.":::

1. In the **Create new automation rule** panel, give a name to the rule.

    Under **Conditions**, select **+ Add** and **Condition (And)**.

    :::image type="content" source="media/tutorial-enrich-ip-info/13-create-automation-rule-name.png" alt-text="Screenshot of creating an automation rule, naming it, and adding a condition.":::

1. Select **IP Address** from the property drop-down on the left. Select **Contains** from the operator drop-down.

    :::image type="content" source="media/tutorial-enrich-ip-info/14-create-automation-rule-condition.png" alt-text="Screenshot of adding a condition to an automation rule.":::

## 4 - Invoke the playbook from your automation rule
TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure


<!---Code requires specific formatting. Here are a few useful examples of
commonly used code blocks. Make sure to use the interactive functionality
where possible.

For the CLI or PowerShell based procedures, don't use bullets or
numbering.

Here is an example of a code block for Java:

```java
cluster = Cluster.build(new File("src/remote.yaml")).create();
...
client = cluster.connect();
```

or a code block for Azure CLI:

```azurecli-interactive 
az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter --admin-username azureuser --admin-password myPassword12
```

or a code block for Azure PowerShell:

```azurepowershell-interactive
New-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer -Image mcr.microsoft.com/windows/servercore/iis:nanoserver -OsType Windows -IpAddressType Public
```
-->

<!-- 8. Clean up resources ------------------------------------------------------------------------

Required: To avoid any costs associated with following the tutorial procedure, a
Clean up resources (H2) should come just before Next steps (H2)

-->

## Clean up resources

If you're not going to continue to use this application, delete
the playbook and automation rule you created with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete

TODO: Add steps for cleaning up the resources created in this tutorial.

<!-- 9. Next steps ------------------------------------------------------------------------

Required: Provide at least one next step and no more than three. Include some context so the 
customer can determine why they would click the link.
Add a context sentence for the following links.
-->

## Next steps
TODO: Add your next step link(s)

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->