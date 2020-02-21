---
title: Quickstart browsing data in the Synapse workspace 
description: Browse the data in an Azure Synapse Analytics workspace by following the steps in this guide. 
services: sql-data-warehouse #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: malvenko 
ms.service: sql-data-warehouse #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: quickstart
ms.subservice: design #Required will update once these are established.
ms.date: 1/15/2020
ms.author: josels
ms.reviewer: jrasnick
Customer intent: As a data engineer/scientist, I want to see what data is available in my workspace to either load more, transform, or analyze it and get insights on my data.
---

<!---Recommended: Remove all the comments in this template before you sign-off or merge to master.--->

<!---quickstarts are fundamental day-1 instructions for helping new customers use a subscription to quickly try out a specific product/service.

The entire activity is a short set of steps that provides an initial experience.

You only use quickstarts when you can get the service, technology, or functionality into the hands of new customers in less than 10 minutes.
--->

# Quickstart: Browse the data in a Synapse Analytics workspace

<!---Required:
Starts with "Quickstart: " and is ideally two lines or less when rendered on a 1920x1080 screen.
Make the first word following "Quickstart:" a verb, which is to say, an action.
The "X" part should identify both the technology or service involved (e.g. App Service,
Cosmos DB, etc.) and the language or framework, if applicable (.NET Core, Python, JavaScript,
Java, etc.); the language or framework shouldn't appear in parentheses.
--->

In this quickstart, you will learn how to browse the data available in your synapse workspace using the Azure Synapse Studio.
<!-- In the opening sentence, focus on the job or task to be completed, emphasizing.
general industry terms (such as "serverless," which are better for SEO) more than
Microsoft-branded terms or acronyms (such as "Azure Functions" or "ACR"). That is, try
to include terms people typically search for and avoid using *only* Microsoft terms. -->


<!--After the opening sentence, provide a light introduction that describes,
again in customer-friendly language, what the customer will learn in the process of
accomplishing the stated goal. Answer the fundamental "why would I want to do this?" question.

Avoid the following elements whenever possible:
- Avoid callouts (note, important, tip, etc.) because readers tend to skip over them.
Important callouts like preview status or version caveats can be included under prerequisites.

- Avoid links, which are generally invitations for the reader to leave the article and
not complete the experience of the quickstart. If you feel that there are important concepts,
make reviewing a particular article a prerequisite. Otherwise, rely on the line of standard links (see below).

- Avoid any indication of the time it takes to complete the quickstart, because there's already
the "x minutes to read" at the top and making a second suggestion can be contradictory.

- Avoid a bullet list of steps or other details in the quickstart: the H2's shown on the right
of the docs page already fulfill this purpose.

- Avoid screenshots or diagrams: the opening sentence should be sufficient to explain the result,
and other diagrams count as conceptual material that is best in a linked overview.
--->

<!-- Optional standard links: if there are suitable links, you can include a single line
of applicable links for companion content at the end of the introduction. Don't use the line
if there's only a single link. -->

(Service name) overview | Reference documentation | Sample source code

<!-- NOTE: the Azure subscription line is moved to Prerequisites. -->

## Prerequisites

<!-- Make Prerequisites the first H2 after the H1. Omit any preliminary text to the list.-->

- (Optional: Completion of a previous quickstart if the current one depends on it. Use the language "Completion of (title)" where (title) is the link.
- Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- First prerequisite
- Second prerequisite
- Third prerequisite
- ...
- (Any specific service-specific key - if specific actions are required, either link to an article that explains those steps, or make acquisition of a key one of the steps in the quickstart.)

<!-- Include this heading even if there aren't any prerequisites, in which case just use the text: "None" (not bulleted). The reason for this is to maintain consistency across services, which trains
readers to always look in the same place.-->

<!-- When there are pre-reqs, list each as *items*, not instructions to minimize the verbiage.
For example, use "Python 3.6" instead of "Install Python 3.6". If the prerequisite is something
to install, link to the applicable installer or download. Selecting the item/link is then the
action to fulfill the prerequisite. Use an action word only if necessary to make the meaning clear.
Don't use links to conceptual information about a prereq; only use links for installers.

Do not bold items, because listing items alone fulfills that same purpose.

List prerequisites in the following order:
- Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Language runtimes (Python, Node, .NET, etc.)
- Packages (from pip, npm, nuget, etc.)
- Tools (like VS Code IF REQUIRED. Don't include tools like pip if they're
  automatically installed with another tool or language runtime, like Python. Don't include
  optional tools like text editors--include them only if the quickstart demonstrates them.)
- Sample code
- Specialized hardware
- Other preparatory work, such as creating a VM (OK to link to another article)
- Azure keys
- Service-specific keys

The reason for placing runtimes and tools first is that it might take time to install
them, and it's best to get a user started sooner than later.

If you feel like your quickstart has a lot of prerequisites, the quickstart may be the
wrong content type - a tutorial or how-to guide may be the better option. Remember that
quickstarts should be something a reader can complete in 10 minutes or less.

--->

## Sign in to <service/product/tool name>

<!---<Sign in to the [<service> portal](url).--->

<!---If you need to sign in to the Azure portal to complete the quickstart, this H2
and link are required. If you use the Cloud Shell or the az login command elsewhere,
however, this step can be omitted. --->

## Open Azure Cloud Shell

<!-- If you want to refer to using the Cloud Shell, place the instructions after the
Prerequisites to keep the prerequs as the first H2.-->

## Procedure 1

<!---Required:
Quickstarts are prescriptive and guide the customer through an end-to-end procedure.
Make sure to use specific naming for setting up accounts and configuring technology.

Avoid linking off to other content - include whatever the customer needs to complete the
scenario in the article. For example, if the customer needs to set permissions, include the
permissions they need to set, and the specific settings in the quickstart procedure. Don't
send the customer to another article to read about it.

In a break from tradition, do not link to reference topics in the procedural part of the
quickstart when using cmdlets or code. Provide customers what they need to know in the quickstart
to successfully complete the quickstart.

For portal-based procedures, minimize bullets and numbering.

For the CLI or PowerShell based procedures, don't use bullets or numbering.

Be mindful of the number of H2/procedures in the Quickstart. 3-5 procedural steps are about right.
Once you've staged the article, look at the right-hand "In this article" section on the docs page;
if there are more than 8 total, consider restructuring the article.
--->

Include a sentence or two to explain only what is needed to complete the
procedure.

1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure
    <!---![Browser](media/contribute-how-to-mvc-quickstart/browser.png)--->
   <!---Use screenshots but be judicious to maintain a reasonable length. Make
    sure screenshots align to the
    [current standards](https://review.docs.microsoft.com/help/contribute/contribute-how-to-create-screenshot?branch=master).

   If users access your product/service via a web browser the first screenshot
   should always include the full browser window in Chrome or Safari. This is
   to show users that the portal is browser-based - OS and browser agnostic.--->
1. Step 4 of the procedure

## Procedure 2

Include a sentence or two to explain only what is needed to complete the procedure.

1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure

## Procedure 3

Include a sentence or two to explain only what is needed to complete the procedure.
<!---Code requires specific formatting. Here are a few useful examples of
commonly used code blocks. Make sure to use the interactive functionality where
possible.
For the CLI or PowerShell based procedures, don't use bullets or numbering.--->

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

If you're not going to continue to use this application, delete <resources>
with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete

<!---Required:
To avoid any costs associated with following the quickstart procedure, a
Clean up resources (H2) should come just before Next steps (H2).

If there is a follow-on quickstart that uses the same resources, make that option clear
so that a reader doesn't need to recreate those resources.
--->

## Next steps

Advance to the next article to learn how to create...

<!--- Required:
Quickstarts should always have a Next steps H2 that points to the next logical
quickstart in a series, or, if there are no other quickstarts, to some other
cool thing the customer can do. A single link in the blue box format should
direct the customer to the next article - and you can shorten the title in the
boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also section". --->