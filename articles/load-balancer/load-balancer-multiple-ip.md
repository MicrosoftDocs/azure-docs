---
title: 'Tutorial: Load balancing with multiple IP configurations - Azure portal'
titleSuffix: Azure Load Balancer
description: In this article, learn about load balancing across primary and secondary IP configurations using the Azure portal.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: tutorial
ms.date: 08/08/2021
ms.custom: template-tutorial
---

# Tutorial: Load balancing with multiple IP configurations using the Azure portal 

One of the ways to host multiple websites is to use multiple IP addresses associated with the network interface controller (NIC) of a virtual machine. Azure Load Balancer supports deployment of load-balancing to support the high availability of the websites.

The following diagram shows the resources used in this tutorial:

![Load balancer scenario](./media/load-balancer-multiple-ip/lb-multi-ip.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create and configure an Azure Load Balancer
> * Create two Windows server virtual machines
> * Create a secondary NIC and network configurations for each virtual machine
> * Create two Internet Information Server (IIS) websites on each virtual machine
> * Bind the websites to the network configurations
> * Test the load balancer

## Prerequisites

- An Azure account with an active subscription. [Create an account for free]
  (https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create load balancer
<!-- Introduction paragraph -->

1. Sign in to the [Azure portal](https://portal.azure.com).
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