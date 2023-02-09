---
title: Deploy a cross-region load balancer with Azure Resource Manager templates | Microsoft Docs
description: Deploy a cross-region load balancer with Azure Resource Manager templates
author: mbender-ms
ms.author: mbender
ms.service: load-balancer
ms.topic: tutorial 
ms.date: 02/17/2023
ms.custom: template-tutorial
#Customer intent: As a administrator, I want to deploy a cross-region load balancer for global high availability of my application or service.
---

# Tutorial: Deploy a cross-region load balancer with Azure Resource Manager templates

A cross-region load balancer ensures a service is available globally across multiple Azure regions. If one region fails, the traffic is routed to the next closest healthy regional load balancer.  

Using an ARM template takes fewer steps comparing to other deployment methods.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * All tutorials include a list summarizing the steps to completion
> * Each of these bullet points align to a key H2
> * Use these green checkboxes in a tutorial

## Prerequisites

-  An Azure account with an active subscription. [Create an account for free]
  (https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Access to Azure Portal 
- An Azure Resource Group 
- An Azure Virtual Network and Subnet configured  

## Review the template
In this section, you will review the template and the parameters that are used to deploy the cross-region load balancer. When you create a standard load balancer, you must also create a new standard public IP address that is configured as the frontend for the standard load balancer. Also, the Load balancers and public IP SKUs must match. In our case, we will create two standard public IP addresses, one for the regional level load balancer and another for the cross-region load balancer.  

1. Sign in to the [<service> portal](url).
1. <!-- Step 2 -->
1. <!-- Step n -->

## Deploy the template
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Verify the deployment
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->


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

In this tutorial, you:
- Created a cross region load balancer\
- Created a regional load balancer
- Created 3 virtual machines and linked them to the regional load balancer
- Configured the cross-region load balancer to work with the regional load balancer
- Tested the cross-region load balancer. 

Learn more about cross-region load balancer.  
Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-tutorial.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
