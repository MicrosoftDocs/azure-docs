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

    :::image type="content" source="media/tutorial-enrich-ip-info/filter-playbook-template-list.png" alt-text="Screenshot of list of playbook templates to be filtered by tags." lightbox="media/tutorial-enrich-ip-info/filter-playbook-template-list.png":::

1. Select the **IP Enrichment - Virus Total report** template, and select **Create playbook** from the details pane.

    :::image type="content" source="media/tutorial-enrich-ip-info/select-playbook-template.png" alt-text="Screenshot of selecting a playbook template from which to create a playbook." lightbox="media/tutorial-enrich-ip-info/select-playbook-template.png":::

1. The **Create playbook** wizard will open. In the **Basics** tab:
    1. Select your **Subscription**, **Resource group**, and **Region** from their respective drop-down lists.

    1. Edit the **Playbook name** by adding to the end of the suggested name "*Get-VirusTotalIPReport*". (This way you'll be able to tell which original template this playbook came from, while still ensuring that it has a unique name in case you want to create another playbook from this same template.) Let's call it "*Get-VirusTotalIPReport-Tutorial-1*".

    1. Let's leave the last two checkboxes unmarked as they are, as we don't need these services in this case:
        - Enable diagnostics logs in Log Analytics
        - Associate with integration service environment

        :::image type="content" source="media/tutorial-enrich-ip-info/playbook-basics-tab.png" alt-text="Screenshot of the Basics tab from the playbook creation wizard.":::

    1. Select **Next : Connections >**.

1. In the **Connections** tab, you'll see all the connections that this playbook needs to make to other services, and the authentication method that will be used if the connection has already been made in an existing Logic App workflow in the same resource group.

    1. Leave the **Microsoft Sentinel** connection as is (it should say "*Connect with managed identity*").

    2. If any connections say "*New connection will be configured*," you will be prompted to do this at the next stage of the tutorial. Or, if you already have connections to these resources, select the expander arrow to the left of the connection and choose an existing connection from the expanded list. For this exercise we'll leave it as is.

        :::image type="content" source="media/tutorial-enrich-ip-info/playbook-connections-tab-alt1.png" alt-text="Screenshot of the Connections tab of the playbook creation wizard.":::

        :::image type="content" source="media/tutorial-enrich-ip-info/playbook-connections-tab-alt2.png" alt-text="Screenshot of the Connections tab of the playbook creation wizard.":::

    1. Select **Next : Review and create >**.

1. In the **Review and create** tab, review all the information you've entered as it's displayed here, and select **Create and continue to designer**.

    :::image type="content" source="media/tutorial-enrich-ip-info/playbook-review-tab.png" alt-text="Screenshot of the Review and create tab from the playbook creation wizard.":::

## 2 - Modify and approve the playbook for your environment
TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure

## 3 - [Doing the next thing]
TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure

## [N - Doing the last thing]
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
\<resources\> with the following steps:

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