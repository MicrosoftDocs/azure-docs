---
title: 'Tutorial: Add Azure Load Balancer to an existing virtual machine scale set - Azure portal'
description: In this tutorial, learn how to add a load balancer to existing virtual machine scale set using the Azure portal. 
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: tutorial
ms.date: 4/21/2021
ms.custom: template-tutorial
---

# Tutorial: Add Azure Load Balancer to an existing virtual machine scale set using the Azure portal

The need may arise when an Azure Load Balancer isn't associated with a virtual machine scale set. 

You may have an existing virtual machine scale set deployed with an Azure Load Balancer that requires updating.

The Azure portal can be used to add or update an Azure Load Balancer associated with a virtual machine scale set.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a NAT gateway for outbound connectivity
> * Create a virtual machine scale set without a load balancer
> * Add a new load balancer to virtual machine scale set

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)

## Create virtual machine scale set

In this section you'll create a virtual machine scale sets without a load balancer. Later in this tutorial, you'll add a load balancer to this scale set in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **Virtual machine scale**.

3. In the search results, select **Virtual machine scale sets**.

4. Select **+ Add**.

5. In the **Basics** tab of **Create a virtual machine scale set**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **TutorLBVMSS-rg** in **Name**. </br> Select **OK**. |
    | **Scale set details** |   |
    | Virtual machine scale set name | Enter **myVMScaleSet**. |
    | Region | Select **(US) West US 2**. |
    | Availability zone | Leave the default of **None**. |
    | **Orchestration** |   |
    | Orchestration mode | Leave the default of **Uniform: optimized for large scale stateless workloads with identical instances**. |
    | **Instance details** |   |
    | Image | Select **Windows Server 2019 Datacenter - Gen1**. |
    | Azure Spot Instance | Leave the default of the box unchecked. |
    | Size | Select a size. |
    | **Administrator account** |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Confirm password. |

6. Select the **Networking** tab.






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
