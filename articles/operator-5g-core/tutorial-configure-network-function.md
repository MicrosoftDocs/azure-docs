---
title: Configure network functions in Azure Operator 5G Core
description: This tutorial outlines the process to configure a network function in Azure Operator 5G Core.
author: HollyCl
ms.author: HollyCl
ms.service: private-5g-core
ms.topic: tutorial #required; leave this attribute/value as-is
ms.date: 01/08/2024

#CustomerIntent: As a < type of user >, I want < what? > so that < why? > .
---

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.

This template provides the basic structure of a Tutorial - General article pattern. See the
[instructions - Tutorial](../level4/article-tutorial.md) in the pattern library.

You can provide feedback about this template at: https://aka.ms/patterns-feedback

Tutorial is an article pattern that leads a user through a common scenario showing them how a product or service can address their needs.

You only use tutorials to show the single best procedure for completing a top customer task.

-->

<!-- 1. H1 -----------------------------------------------------------------------------

Required: Use a "Tutorial: <verb> * <noun>" format for your H1. Pick an H1 that clearly conveys the scenario the user will complete.

For example: "Tutorial: Create a Node.js and Express app in Visual Studio".

* Include only a single H1 in the article.
* If the Tutorial is part of a numbered series, don't include the number in the H1.
* Don't start with a gerund.
* Don't add "Tutorial:" to the H1 of any article that's not a Tutorial.

-->

# Tutorial: \<verb\> * \<noun\>
TODO: Add your heading

<!-- 2. Introductory paragraph ----------------------------------------------------------

Required: Lead with a light intro that describes, in customer-friendly language, what common scenario the 
customer will accomplish in the Tutorial. Answer the fundamental “why would I want to do this?” question. Keep it short.

Readers should have a clear idea of what they will do in this article after reading the introduction.

* Introduction immediately follows the H1 text.
* Introduction section should be between 1-3 paragraphs.
* Don’t link away from the article to other content.
* Don't use a bulleted list of article H2 sections.

Example: Azure Monitor alerts proactively notify you when important conditions are found in your monitoring data. Metric alert rules create an alert when a metric value from an Azure resource exceeds a threshold.

-->

TODO: Add your introductory paragraph

<!---Avoid notes, tips, and important boxes. Readers tend to skip over them. Better to put that info directly into the article text.

-->

<!-- 3. Outline
------------------------------------------------------------------------------

Required: Before your first H2, use the green checkmark format for the bullets that outline what you'll cover in the Tutorial.

-->

TODO Add your outline

In this tutorial, you learn how to:

> [!div class="checklist"]
> * [All tutorials include a list summarizing the steps to completion]
> * [Each of these bullet points align to a key H2]
> * [Use these green checkboxes in a tutorial]

<!-- 4. Free account links 
----------------------------------------------------------------

Required, if a free trial account exists Because Tutorials are intended to help new customers use the product or service to complete a top task, include a link to a free trial before the first H2. You can find listed examples in the  [tutorials pattern](article-tutorial.md)
-->

If you don’t have a \<service\> subscription, create a free trial account...
TODO: Add the free account information if it exists

<!-- 5. Prerequisites --------------------------------------------------------------------

Make Prerequisites the first H2 after the H1. 

The prerequisites H2 is never numbered.

Provide a bulleted list of items that the user needs to complete the scenario. Omit any preliminary text to the list.

If there aren't any prerequisites, list "None" in plain text, not as a bulleted item.

If the prerequisite is something to install, link to the applicable and specific installer or download.

List each as an _item_, not instructions, to minimize the verbiage. For example, use "Python 3.6" instead of "Install Python 3.6". Include an action word only if necessary to make the meaning clear.

If there are specific versions of software a user needs, call out those versions (for example: Visual Studio 2019 or later).

-->

## Prerequisites

- (Include as needed) Accounts
- (Include as needed) Completion of a previous Tutorial
- (Include as needed) Language runtimes
- (Include as needed) Packages
- (Include as needed) Tools
- (Include as needed) Sample code
- (Include as needed) Specialized hardware
- (Include as needed) Other preparatory work
- (Include as needed) Service keys

<!-- 6. Account sign in --------------------------------------------------------------------

Required: If you need to sign in to the portal to do the Tutorial, this H2 and link are required.

-->

## Sign in to \<service/product/tool name\>
TODO: add your instructions

<!-- If signing in requires more than one step, then use this section. If it's just a single
step, include that step in the first section that requires it.

-->

<!-- 7. Task H2s ------------------------------------------------------------------------------

Required: Tutorials are prescriptive and guide the customer through an end-to-end scenario. Make sure to use specific naming for setting up accounts and configuring technology.

Multiple procedures should be organized in H2 level sections. A section contains a major grouping of steps that help users complete a scenario. Each section is represented as an H2 in the article.

Avoid linking off to other content - include whatever the customer needs to complete the scenario in the article. For example, if the customer needs to set permissions, include the permissions they need to set, and the specific settings in the Tutorial procedure. Don't
send the customer to another article to read about it.

In a break from tradition, do not link to reference topics in the Tutorial when using cmdlets or code. Provide customers what they need to know in the Tutorial to successfully complete the Tutorial.

For portal-based procedures, minimize bullets and numbering.

For the CLI or PowerShell based procedures, don't use bullets or numbering.

* Each H2 should be a major step in the scenario.
* Phrase each H2 title as "<verb> * <noun>" to describe what they'll do in the step.
* Don't start with a gerund.
* Don't number the H2s.
* Begin each H2 with a brief explanation for context.
* Provide a ordered list of procedural steps.
* Provide a code block, diagram, or screenshot if appropriate
* An image, code block, or other graphical element comes after numbered step it illustrates.
* If necessary, optional groups of steps can be added into a section.
* If necessary, alternative groups of steps can be added into a section.

-->

## "\<verb\> * \<noun\>" 1
TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Step 1
1. Step 2
1. Step 3

## "\<verb\> * \<noun\>" 2
TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Step 1
1. Step 2
1. Step 3

## "\<verb\> * \<noun\>" 3
TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Step 1
1. Step 2
1. Step 3

## "\<verb\> * \<noun\>" 4
TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Step 1
1. Step 2
1. Step 3


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

Required: To avoid any costs associated with following the tutorial procedure, a Clean up resources (H2) should come just before Next step or Related content (H2)

If there is a follow-on Tutorial that uses the same resources, make that option clear so that a reader doesn't need to recreate those resources. 

-->

<!-- Use this exact H2 -->
## Clean up resources

If you're not going to continue to use this application, delete the resources with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete

<!-- 9. Next step/Related content ------------------------------------------------------------------------ 

Optional: You have two options for manually curated links in this pattern: Next step and Related content. You don't have to use either, but don't use both.
  - For Next step, provide one link to the next step in a sequence. Use the blue box format
  - For Related content provide 1-3 links. Include some context so the customer can determine why they would click the link. Add a context sentence for the following links.

-->

## Next step

TODO: Add your next step link(s)

> [!div class="nextstepaction"]
>
<!-- OR -->

## Related content

TODO: Add your next step link(s)

- 

<!--
Remove all the comments in this template before you sign-off or merge to the main branch.
-->
