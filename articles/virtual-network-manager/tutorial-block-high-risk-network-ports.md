---
title: 'Tutorial: Secure high-risk network ports with Security Admin Rules in Azure Virtual Network Manager.'
description: #Required; In this article, you will deploy Security admin rules to block high-risk security ports with Azure Virtual Network Manager.
author: mbender-ms
ms.author: mbender
ms.service: virtual-network-manager
ms.topic: tutorial #Required; leave this attribute/value as-is.
ms.date: #Required; mm/dd/yyyy format.
ms.custom: template-tutorial #Required; leave this attribute/value as-is.
#Customer intent: As a network administrator responsible responsible for network governance, I want secure my network traffic across multiple VNets in a flexible and scalable manner so that I can reduce administrative overhead and improve my security posture.
---


# Tutorial : Block high-risk network ports with SecurityAdmin Rules in Azure Virtual Network Manager.

<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.
-->

In this article, you will learn to secure network traffic to high risk network ports using Azure Virtual Network Manager and Security Admin Rules. You'll walk through the creation of an Azure Virtual Network Manager instance, group your vnets with network groups, and create & deploy security admin configurations for your organization. You'll deploy an general block rule for high risk ports. Then you'll create an exception for managing a specific application's vnet. This is will allow you to manage access to the application vnets using network security groups. Deploying this configuration provides you a flexible and scalabable management framework for securing your network traffic across your all Azure virtual networks.

> [!IMPORTANT]
> Azure Virtual Network Manager is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create multiple virtual networks
> * Create an Azure Virtual Network Manager instance
> * Create network groups
> * Create security configuration blocking and allowing traffic for specific network groups
> * Deploy security admin configurations
> * Verify configurations were applied.

:::image type="content" source="media/how-to-block-high-risk-ports/sec-admin-rules-scenario.png" alt-text="This diagram describes the scenario for the how-to. It includes virtual networks, network groups, and admin security policies.":::

## Prerequisites

- An Azure account with an active subscription. [Create an account for free]
  (https://azure.microsoft.com/free/?WT.mc_id=A261C142F). -->
- <!-- prerequisite 2 -->
- <!-- prerequisite n -->

<!-- 5. H2s
Required. Give each H2 a heading that sets expectations for the content that follows. 
Follow the H2 headings with a sentence about how the section contributes to the whole.
-->
## Deploy Virtual Network environment
This procedure walks you through creating three virtual networks. One will be in the West US region and the other two will be in the East US region.
-prod-vnet-east-1
-prod-vnet-west-1
-app-vnet-east-1
-app-vnet-west-1
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Create a Virtual Network Manager
This procedure walks you through creating a virtual network manager.
<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Create a Network Group
In this procedure, you create a network group, AllNetworkGroup that contains all of the virtual networks to be protected.

1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Create a Security Admin Configuration
This procedure walks you through creating a security admin configuration that blocks SSH traffic to all virtual networks using the AllNetworkGroup network group., 

1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Deploy a Security Admin Configuration
Once a security admin configuration is created, it needs to be deploy in order to take effect. Now, you will walk through deploying a security admin configuration blocking SSH traffic to all of your virtual networks in the East US and West US regions.

1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Create a Network Group for Application
With all ssh traffic block, you need to create an exception for SSH traffic to virtual networks that contain your application. This will allow the application team to use SSH for management of the application. 
You will create a network group specifically for the application team’s virtual networks: app-vnet-east-1 and app-vnet-west-1. This will allow you later add security admin rules that pertain only to these virtual networks, and allow them to handle SSH traffic through their own NSGs.

1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Create a Security Admin Rule Collection for Application 1
In this procedure, you walk through creating a security admin rule collection and security admin rule for ApplicationNetworkGroup that allows SSH traffic to your application virtual networks.


1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Re-deploy the Security Admin Configuration
We’re at the final step, which is to redeploy OurSecurityConfig since we’ve modified this configuration by adding a rule collection.

1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Verify 


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

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps button](contribute-how-to-mvc-tutorial.md)

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->
