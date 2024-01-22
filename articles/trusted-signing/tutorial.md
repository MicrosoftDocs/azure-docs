---
title: Public Trust Signing tutorial #Required; page title displayed in search results. Include the word "tutorial". Include the brand.
description: Tutorial on getting started with Public Trust Signing in Trusted Signing #Required; article description that is displayed in search results. Include the word "tutorial".
author: microsoftshawarma #Required; your GitHub user alias, with correct capitalization.
ms.author: rakiasegev #Required; microsoft alias of author; optional team alias.
ms.service: azure-code-signing #Required; service per approved list. slug assigned by ACOM.
ms.topic: tutorial #Required; leave this attribute/value as-is.
ms.date: 01/18/2023 #Required; mm/dd/yyyy format.
---


# Tutorial: Public Trust Signing with Azure Code Signing

<!-- 2. Introductory paragraph ----------------------------------------------------------

Required: Lead with a light intro that describes, in customer-friendly language, what the 
customer will do. Answer the fundamental “why would I want to do this?” question. Keep it 
short.
Readers should have a clear idea of what they will do in this article after reading the 
introduction.
Include a sentence that says, "In this tutorial you will do X..."

-->

This article walks you through getting your account setup on Azure Code Signing and signing with Public Trust certificates. 

<!-- 3. Outline --------------------------------------------------------------------------

Required: Before your first H2, use the green checkmark format for the bullets that outline what 
you'll cover in the tutorial.

--->

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Setup an Azure Code Signing account
> * Assign RBAC for your account
> * Perform identity validation
> * Setup a certitficate profile
> * Install the necessary prerequistes for signing
> * Begin signing with Azure Code Signing

<!-- 5. Prerequisites --------------------------------------------------------------------

Optional: If there are prerequisites for the task covered by the tutorial, make **Prerequisites**
your first H2 in the guide. The prerequisites H2 is never numbered. Use clear and unambiguous
language and use a unordered list format. If there are specific versions of software a user needs,
call out those versions (for example: Visual Studio 2019 or later).

-->

## Prerequisites
[!div class="checklist"]
> * Azure tenant ID and subscription ID
> * Azure CLI installed
> * Install Signtool from Windows SDK (min version: 10.0.19041.0)
> * Install the .NET 6 Runtime
> * Install the Azure Code Signing Dlib Package
> * SignTool + Windows Build Tools NuGet

<!-- 6. Account sign in --------------------------------------------------------------------

Required: If you need to sign in to the portal to do the tutorial, this H2 and link are required.

-->

## Sign in to \<service/product/tool name\>

Sign in to the \<service portal url\>.
TODO: Add the link to sign in

<!-- 7. Task H2s ------------------------------------------------------------------------------

Required: Each major step in completing a task should be represented as an H2 in the article.
These steps should be numbered.
The procedure should be introduced with a brief sentence or two.
Multiple procedures should be organized in H2 level sections.
Procedure steps use ordered lists.

--
## 1 - [Doing the first thing]
TODO: Add introduction sentence(s)
[Include a sentence or two to explain only what is needed to complete the procedure.]
TODO: Add ordered list of procedure steps
1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure

## 2 - [Doing the second thing]
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