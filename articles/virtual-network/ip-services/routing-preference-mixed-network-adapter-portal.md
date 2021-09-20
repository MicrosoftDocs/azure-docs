---
title: 'Tutorial: Configure both routing preference options for a virtual machine - Azure portal'
description: Use this tutorial to learn how to configure both routing preference options for a virtual machine using the Azure portal.
author: asudbring
ms.author: allensu
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: tutorial
ms.date: 09/20/2021
ms.custom: template-tutorial
---

# Tutorial: Configure both routing preference options for a virtual machine using the Azure portal

This article shows you how to configure both [routing preference](routing-preference-overview.md) options (Internet and Microsoft global network) for a virtual machine (VM). This is achieved using two virtual network interfaces, one network interface with a public IP routed via the Microsoft global network, and the other one with a public IP routed via an ISP network.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual machine with a public IP address with the **Microsoft network** routing preference.
> * Create a public IP address with the **Internet** routing preference.
> * Create a secondary network interface for the virtual machine.
> * Assign **Internet** routing preference IP to virtual machine secondary network interface.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a virtual machine

In this section, you'll create a virtual machine and public IP address. During the public IP address configuration, you'll select **Microsoft network** for routing preference.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the portal search box, enter **Virtual machine**. In the search results, select **Virtual machines**.

3. In **Virtual machines**, select **+ Create**, then **+ Virtual machine**.

4. In the **Basics** tab of **Create a virtual machine**, enter, or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **TutorVMMixRoutePref-rg**. Select **OK**. |
    | **Instance details** |   |
    | Virtual machine name | Enter **myVM**. |
    | Region | Select **(US) West US 2**. |
    | Availability options | Select **No infrastructure redundancy required**. |
    | Image | Select **Windows Server 2019 Datacenter - Gen2**. |
    | Azure Spot instance | Leave the default of unchecked. |
    | Size | Select a size. |
    | **Administrator account** |   |
    | Username | Enter a username. |
    | Password | Enter a password. |
    | Confirm password | Reenter password. |
    | **Inbound port rules** |
    | Public inbound ports | Select **Allow selected ports**. |
    | Select inbound ports | Leave the default of **RDP (3389)**. </br> _**Opening port 3389 from the internet is not recommended for production workloads**_. |

5. Select **Next: Disks** then **Next: Networking**, or select the **Networking** tab.

6. In the networking tab, enter or select the following information.

    | Setting | Value |
    | ------- | ----- |
    | **Network interface** |   |
    | Virtual network | Leave the default of **(new) TutorVMMixRoutePref-rg-vnet**. |
    | Subnet | Leave the default of **(new) default (10.1.0.0/24)**. |
    | Public IP | Select **Create new**. </br> In **Name**, enter **myPublicIP**. </br> Select **Standard** in **SKU**. </br> In **Routing preference**, select **Internet**. </br> Select **OK**. |

7. Select **Review + create**.

8. Select **Create**.

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
