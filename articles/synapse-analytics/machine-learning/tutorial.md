---
title: 'Tutorial: what this tutorial does'
description: Description of what this tutorial accomplishes; include product name. (100-160 characters, including spaces)

services: synapse-analytics
ms.service: synapse-analytics 
ms.subservice: machine-learning
ms.topic: tutorial
ms.reviewer: jrasnick, garye

ms.date: 08/31/2020   # mm/dd/yyyy
author: garyericson   # Your GitHub account name 
ms.author: garye      # Your microsoft.com email alias
---

<!---Remove all the comments in this template before you sign-off or merge to master.--->

<!---Tutorials are scenario-based procedures for the top customer tasks identified in milestone one of the [Content + Learning content model](contribute-get-started-mvc.md).
You only use tutorials to show the single best procedure for completing an approved top 10 customer task.
--->

# Tutorial: <do something with X> 

***This is just a temporary placeholder/template. Delete before merging the release branch to master.***

*This is an edited version of the tutorial template, [Base template for tutorial articles](https://review.docs.microsoft.com/help/contribute/global-tutorial-template?branch=master), in the Contributor Guide.*

<!---Required:
Starts with "Tutorial: "
Make the first word following "Tutorial:" a verb.
--->

Introductory paragraph.

<!---Required:
Lead with a light intro that describes, in customer-friendly language, what the customer will learn, or do, or accomplish. Answer the fundamental “why would I want to do this?” question.
--->

In this tutorial, you learn how to:

> [!div class="checklist"]
> * All tutorials include a list summarizing the steps to completion
> * Each of these bullet points align to a key H2
> * Use these green checkboxes in a tutorial

<!---Required:
The outline of the tutorial should be included in the beginning and at the end of every tutorial. These will align to the **procedural** H2 headings for the activity. You do not need to include all H2 headings.
Leave out the prerequisites, clean-up resources, and next steps sections
--->

If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).

<!---Avoid notes, tips, and important boxes. Readers tend to skip over them. Better to put that info directly into the article text.--->

## Prerequisites

- First prerequisite
- Second prerequisite
- Third prerequisite

<!---If you need them, make Prerequisites your first H2 in a tutorial. If there’s something a customer needs to take care of before they start (for example, creating a VM) it’s OK to link to that content before they begin.
--->

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/)

## Procedure 1

<!--
Tutorials are prescriptive and guide the customer through an end-to-end procedure. Make sure to use specific naming for setting up accounts and configuring technology. 

Don't link off to other content - include whatever the customer needs to complete the scenario in the article. For example, if the customer needs to set permissions, include the permissions they need to set, and the specific settings in the tutorial procedure. Don't send the customer to another article to read about it.

In a break from tradition, do not link to reference topics in the procedural part of the tutorial when using cmdlets or code. Provide customers what they need to know in the tutorial to successfully complete the tutorial.

For portal-based procedures, minimize bullets and numbering.

For the CLI or PowerShell based procedures, don't use bullets or numbering.
--->

Include a sentence or two to explain only what is needed to complete the
procedure.

1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure
1. Step 4 of the procedure

   <!---Use screenshots but be judicious to maintain a reasonable length. Make sure screenshots align to the [current standards](https://review.docs.microsoft.com/help/contribute/contribute-how-to-create-screenshot?branch=master).

   If users access your product/service via a web browser the first screenshot should always include the full browser window in Chrome or Safari. This is to show users that the portal is browser-based - OS and browser agnostic.
   --->

## Procedure 2

Include a sentence or two to explain only what is needed to complete the procedure.

1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure

## Procedure 3

Include a sentence or two to explain only what is needed to complete the
procedure.

<!---Code requires specific formatting. Here are a few useful examples of commonly used code blocks. Make sure to use the interactive functionality where possible.

For the CLI or PowerShell based procedures, don't use bullets or numbering.
--->

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
New-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer -Image microsoft/iis:nanoserver -OsType Windows -IpAddressType Public
```


## Clean up resources

If you're not going to continue to use this application, delete <resources> with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete

<!---
To avoid any costs associated with following the tutorial procedure, a Clean up resources (H2) is required and should come just before Next steps (H2).
--->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> *link to next article*

<!---
Tutorials should always have a Next steps H2 that points to the next logical tutorial in a series, or, if there are no other tutorials, to some other cool thing the customer can do. A single link in the blue box format should direct the customer to the next article - and you can shorten the title in the boxes if the original one doesn’t fit.

Do not use a "More info section" or a "Resources section" or a "See also section". 
--->