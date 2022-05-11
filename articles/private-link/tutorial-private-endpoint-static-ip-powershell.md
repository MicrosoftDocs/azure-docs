---
title: 'Tutorial: Create a private endpoint with a static IP address - PowerShell'
titleSuffix: Azure Private Link
description: Learn how to create a private endpoint for an Azure service with a static private IP address.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: tutorial
ms.date: 05/12/2022
ms.custom: template-tutorial
---

# Tutorial: Create a private endpoint with a static IP address using PowerShell

 A private endpoint IP address is allocated by DHCP in your virtual network by default. In this tutorial, you'll create a private endpoint with a static IP address.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network and bastion host for testing the private endpoint
> * Create an Azure Webapp
> * Create an Azure Private Endpoint with a static IP address for the Azure Webapp
> * Test the private endpoint connection

## Prerequisites

- An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 5.4.1 or later. To find the installed version, run `Get-Module -ListAvailable Az`. If you need to upgrade, see [Install the Azure PowerShell module](/powershell/azure/install-Az-ps). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## [Section 1 heading]
<!-- Introduction paragraph -->

1. Sign in to the [<service> portal](url).
1. <!-- Step 2 -->
1. <!-- Step n -->

## [Section 2 heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## [Section n heading]
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

<!-- 6. Clean up resources
Required. If resources were created during the tutorial. If no resources were created, 
state that there are no resources to clean up in this section.
-->

## Clean up resources

If you're not going to continue to use this application, delete
<resources> with the following steps:

1. From the left-hand menu...
1. ...click Delete, type...and then click Delete

<!-- 7. Next steps
Required: A single link in the blue box format. Point to the next logical tutorial 
in a series, or, if there are no other tutorials, to some other cool thing the 
customer can do. 
-->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-tutorial.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
