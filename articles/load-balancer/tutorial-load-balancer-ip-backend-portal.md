---
title: 'Tutorial: Create a public load balancer with an IP based backend - Azure Portal'
titleSuffix: Azure Load Balancer
description: In this tutorial, learn how to create a public Azure Load Balancer with an IP based backend pool.
author: asudbring
ms.author: allensu
ms.service: load-balancer
ms.topic: tutorial
ms.date: 3/26/2021
ms.custom: template-tutorial
---

<!--
Outline:  
Create Vnet (Change Bastion to /27)
Create LB
Create Backend Pool
    Choose Vnet
    Choose IP Based
    Create health probe
    Create LB rule
Create VMs
Install IIS
Cleanup
-->

# Tutorial: Create a public load balancer with an IP based backend using the Azure portal

In this tutorial, you'll learn how to create a public Azure Load Balancer with an IP based backend pool. A traditional deployment of Azure Load Balancer uses the network interface configuration of the virtual machines for the backend pool. With a IP based backend the virtual machines are added to the backend pool by IP address.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a virtual network
> * Create a NAT gateway for outbound connectivity
> * Create an Azure Load Balancer
> * Create an IP based backend pool
> * Create two virtual machines
> * Test the load balancer
## Prerequisites

- An Azure account with an active subscription. [Create an account for free]
  (https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
## Create a virtual network

In this section, you'll create a virtual network for the load balancer, NAT gateway, and virtual machines.

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