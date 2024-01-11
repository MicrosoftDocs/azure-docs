---
title: Quickstart Trusted Signing #Required; page title displayed in search results. Include the word "quickstart". Include the brand.
description: Quickstart onboarding to Trusted Signing to sign your files #Required; article description that is displayed in search results. Include the word "quickstart".
author: microsoftshawarma #Required; your GitHub user alias, with correct capitalization.
ms.author: rakiasegev #Required; microsoft alias of author; optional team alias.
ms.service: azure-code-signing #Required; service per approved list. service slug assigned to your service by ACOM.
ms.topic: quickstart #Required; leave this attribute/value as-is.
ms.date: 01/05/2024 #Required; mm/dd/yyyy format.
---


# Quickstart: Onboarding to Trusted Signing

<!-- 2. Introductory paragraph ----------------------------------------------------------

Required: In the opening sentence, focus on the job or task to be completed, emphasizing
general industry terms (such as "serverless," which are better for SEO) more than
Microsoft-branded terms or acronyms (such as "Azure Functions" or "ACR"). That is, try
to include terms people typically search for and avoid using *only* Microsoft terms.

After the opening sentence, summarize the steps taken in the article to answer "what is this
article about?" Then include a brief statement of cost, if applicable.

Example: 
Get started with Azure Functions by using command-line tools to create a function that responds 
to HTTP requests. After testing the code locally, you deploy it to the serverless environment 
of Azure Functions. Completing this quickstart incurs a small cost of a few USD cents or less 
in your Azure account.

-->

Trusted Signing is a service with an intuitive experience for developers and IT professionals. It supports both public and private trust signing scenarios and includes a timestamping service that is publicly trusted in Windows. We currently support public trust, private trust, VBS enclave, and test trust signing. Completing this quickstart guides gives you an overview of the service and onboarding steps!

<!-- - Avoid links, which are generally invitations for the reader to leave the article and
not complete the experience of the quickstart. The exception are links to alternate versions
of the same content (e.g. when you have a VS Code-oriented article and a CLI-oriented article). Those
links help get the reader to the right article, rather than being a distraction. If you feel that there are
other important concepts needing links, make reviewing a particular article a prerequisite. Otherwise, rely
on the line of standard links (see below).

- Avoid any indication of the time it takes to complete the quickstart, because there's already
the "x minutes to read" at the top and making a second suggestion can be contradictory. (The standard line is probably misleading, but that's a matter for site design.)

- Avoid a bullet list of steps or other details in the quickstart: the H2's shown on the right
of the docs page already fulfill this purpose.

- Avoid screenshots or diagrams: the opening sentence should be sufficient to explain the result,
and other diagrams count as conceptual material that is best in a linked overview.

--->

<!-- Optional standard links: if there are suitable links, you can include a single line
of applicable links for companion content at the end of the introduction. Don't use the line
if there's only a single link. In general, these links are more important for SDK-based quickstarts. -->

Trusted Signing overview | Reference documentation | Sample source code

<!-- 5. Prerequisites --------------------------------------------------------------------

Optional: Make Prerequisites the first H2 after the H1. Omit any preliminary text to the list.

Include this heading even if there aren't any prerequisites, in which case just use the text: "None"
(not bulleted). The reason for this is to maintain consistency across services, which trains readers
to always look in the same place.

When there are prerequisites, list each as *items*, not instructions to minimize the verbiage.
For example, use "Python 3.6" instead of "Install Python 3.6". If the prerequisite is something
to install, link to the applicable and specific installer or download. Selecting the item/link is then the
action to fulfill the prerequisite. Use an action word only if necessary to make the meaning clear.
Don't use links to conceptual information about a prerequisite; only use links for installers.

Do not bold items, because listing items alone fulfills that same purpose.

List prerequisites in the following order:
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
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

-->

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure tenant ID
- Second prerequisite
- Third prerequisite
- ...
- (Any specific service-specific key - if specific actions are required, either link to an article that explains those steps, or make acquisition of a key one of the steps in the quickstart.)

<!-- 6. Account sign in --------------------------------------------------------------------

Required: If you need to sign in to the portal to do the quickstart, this H2 and link are required.

-->

## Sign in to <service/product/tool name>
TODO: add your instructions

<!-- If signing in requires more than one step, then use this section. If it's just a single
step, include that step in the first section that requires it.

-->

<!-- 7. Open Azure Cloud Shell---------------------------------------------------------------------
If you want to refer to using the Cloud Shell, place the instructions after the
Prerequisites to keep the prerequisites as the first H2.

However, only include the Cloud Shell if ALL commands can be run in the cloud shell.

--->


## Open Azure Cloud Shell
TODO: add your instructions

<!-- 7. Task H2s ------------------------------------------------------------------------------

Required:
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

## Task 1
TODO: Include a sentence or two to explain only what is needed to complete the
procedure.

1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure
1. Step 4 of the procedure

## Task 2

TODO: Include a sentence or two to explain only what is needed to complete the procedure.

1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure

## Task 3

TODO: Include a sentence or two to explain only what is needed to complete the procedure.

<!-- 7. Code blocks ------------------------------------------------------------------------------

Optional: Code requires specific formatting. Here are a few useful examples of
commonly used code blocks. Make sure to use the interactive functionality where
possible.
For the CLI or PowerShell based procedures, don't use bullets or numbering.

Here is an example of a code block for Java:

```java
cluster = Cluster.build(new File("src/remote.yaml")).create();
...
client = cluster.connect();
```

or a code block for Azure CLI:

```azurecli 
az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter --admin-username azureuser --admin-password myPassword12
```
or a code block for Azure PowerShell:

```azurepowershell
New-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer -Image mcr.microsoft.com/windows/servercore/iis:nanoserver -OsType Windows -IpAddressType Public
```

<!-- Use the -interactive CLI/PowerShell code fences ONLY if all such commands can be marked that way,
otherwise the reader might run some in the interactive in which case the state isn't determinate. 

--->

<!-- 8. Clean up resources ------------------------------------------------------------------------

Required: To avoid any costs associated with following the quickstart procedure, a
Clean up resources (H2) should come just before Next steps (H2)

If there is a follow-on quickstart that uses the same resources, make that option clear
so that a reader doesn't need to recreate those resources. 

-->

## Clean up resources

If you're not going to continue to use this application, delete resources with the following steps


<!-- 9. Next steps ------------------------------------------------------------------------

Required: Quickstarts should always have a Next steps H2 that points to the next logical
quickstart in a series, or, if there are no other quickstarts, to some other
cool thing the customer can do. A single link in the blue box format should
direct the customer to the next article - and you can shorten the title in the
boxes if the original one doesn’t fit. 

Do not use a "More info section" or a "Resources section" or a "See also section". 

--->
