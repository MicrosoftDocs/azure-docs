---
title: 'Tutorial: Create a private endpoint DNS infrastructure with Azure Private Resolver for an on-premises workload'
titleSuffix: Azure Private Link
description: Learn how to deploy a private endpoint with an Azure Private resolver for an on-premises workload.
author: asudbring
ms.author: allensu
ms.service: private-link
ms.topic: tutorial
ms.date: 12/01/2022
ms.custom: template-tutorial
---

# Tutorial: Create a private endpoint DNS infrastructure with Azure Private Resolver for an on-premises workload

When an Azure Private Endpoint is created it uses Azure Private DNS Zones for name resolution by default. For on-premises workloads to access the endpoint, a forwarder to a virtual machine in Azure hosting DNS or on-premises DNS records for the private endpoint were required. Azure Private Resolver alleviates the need to deploy a VM in Azure for DNS or manage the private endpoint DNS records on a on-premises DNS server.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an Azure Virtual Network for the cloud network and a simulated on-premises network with virtual network peering.
> * Create a Azure Web App to simulate a cloud resource.
> * Create an Azure Private Endpoint for the web app in the Azure Virtual Network.
> * Create an Azure Private Resolver in the cloud network.
> * Create an Azure Virtual Machine in the simulated on-premises network to test the DNS resolution to the web app.

> [!NOTE]
> An Azure Virtual Network with peering is used to simulate a on-premises network for the purposes of this tutorial. In a production scenario, an **Express Route** or **site to site VPN** is required to connect to the Azure Virtual Network to access the private endpoint. 
>
> The simulated network is configured with the Azure Private Resolver as the virtual network's DNS server. In a production scenario, the on-premises resources will use a local DNS server for name resolution. A conditional forwarder to the Azure Private Resolver is used on the on-premises DNS server to resolve the private endpoint DNS records. Refer to your DNS provider for more information about configuring conditional forwarders. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free]
  (https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create virtual networks

A virtual network for the Azure Web App and simulated on-premises network is used for the resources in the tutorial. You'll create two virtual networks and peer them to simulate an Express Route or VPN connection between on-premises and Azure.

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
