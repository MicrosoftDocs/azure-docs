---
title: "Tutorial: Publish a Hugo site to App Service Static Apps"
description: #Required; article description that is displayed in search results. 
services: #Required for articles that deal with a service; service slug assigned to your service by ACOM.
author: aaronpowell
ms.service: azure-functions
ms.topic:  tutorial
ms.date: 05/08/2020
ms.author: aapowell
---

<!--
Refer to the following guide for more details:
  https://review.docs.microsoft.com/en-us/help/contribute/contribute-how-to-mvc-tutorial?branch=master
-->

<!---Recommended: Removal all the comments in this template before you sign-off or merge to master.--->

# Tutorial: Publish a Hugo site to App Service Static Apps

<!---Required:
Starts with "Tutorial: "
Make the first word following "Tutorial:" a verb.
--->

Introductory paragraph.

<!---Required:
Lead with a light intro that describes, in customer-friendly language,
what the customer will learn, or do, or accomplish. Answer the
fundamental "why would I want to do this?" question.
--->

In this tutorial, you learn how to:

> [!div class="checklist"]
> * All tutorials include a list summarizing the steps to completion
> * Each of these bullet points align to a key H2
> * Use these green checkboxes in a tutorial
<!---Required:
The outline of the tutorial should be included in the beginning and at
the end of every tutorial. These will align to the **procedural** H2
headings for the activity. You do not need to include all H2 headings.
Leave out the prerequisites, clean-up resources and next steps--->

If you don't have a <service> subscription, create a free trial account...
<!--- Required, if a free trial account exists
Because tutorials are intended to help new customers use the product or
service to complete a top task, include a link to a free trial before the
first H2, if one exists. You can find listed examples in
[Write tutorials](contribute-how-to-mvc-tutorial.md)
--->

<!---Avoid notes, tips, and important boxes. Readers tend to skip over
them. Better to put that info directly into the article text.--->

## Prerequisites

- First prerequisite
- Second prerequisite
- Third prerequisite
<!---If you need them, make Prerequisites your first H2 in a tutorial. If
there's something a customer needs to take care of before they start (for
example, creating a VM) it's OK to link to that content before they
begin.--->

## Sign in to <service/product/tool name>

Sign in to the <service> portal.
<!---If you need to sign in to the portal to do the tutorial, this H2 and
link are required.--->

## Procedure 1

<!---Required:
Tutorials are prescriptive and guide the customer through an end-to-end
procedure. Make sure to use specific naming for setting up accounts and
configuring technology.
Don't link off to other content - include whatever the customer needs to
complete the scenario in the article. For example, if the customer needs
to set permissions, include the permissions they need to set, and the
specific settings in the tutorial procedure. Don't send the customer to
another article to read about it.
In a break from tradition, do not link to reference topics in the
procedural part of the tutorial when using cmdlets or code. Provide customers what they need to know in the tutorial to successfully complete
the tutorial.
For portal-based procedures, minimize bullets and numbering.
For the CLI or PowerShell based procedures, don't use bullets or
numbering.
--->

Include a sentence or two to explain only what is needed to complete the
procedure.

1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure
   
   <!---Use screenshots but be judicious to maintain a reasonable length. 
   Make sure screenshots align to the
   [current standards](https://review.docs.microsoft.com/help/contribute/contribute-how-to-create-screenshot?branch=master).
   If users access your product/service via a web browser the first 
   screenshot should always include the full browser window in Chrome or
   Safari. This is to show users that the portal is browser-based - OS 
   and browser agnostic.--->
1. Step 4 of the procedure

## Procedure 2

Include a sentence or two to explain only what is needed to complete the procedure.

1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure

## Procedure 3

Include a sentence or two to explain only what is needed to complete the
procedure.
<!---Code requires specific formatting. Here are a few useful examples of
commonly used code blocks. Make sure to use the interactive functionality
where possible.

For the CLI or PowerShell based procedures, don't use bullets or
numbering.
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

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete

<!---Required:
To avoid any costs associated with following the tutorial procedure, a
Clean up resources (H2) should come just before Next steps (H2)
--->

## Next steps

<!-- Uncomment this block and add the appropriate link

> [!div class="nextstepaction"]
> [Next steps button](contribute-get-started-mvc.md)

-->

<!--- Required:
Tutorials should always have a Next steps H2 that points to the next
logical tutorial in a series, or, if there are no other tutorials, to
some other cool thing the customer can do. A single link in the blue box
format should direct the customer to the next article - and you can
shorten the title in the boxes if the original one doesn't fit.
Do not use a "More info section" or a "Resources section" or a "See also
section". --->
