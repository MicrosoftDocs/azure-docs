---
title: What is Oracle WebLogic Server on Azure?
description: Learn how to run Oracle WebLogic Server on Microsoft Azure.
services: virtual-machines-linux
documentationcenter: ''
author: edburns
manager: gwallace
tags: azure-resource-management

ms.assetid: 
ms.service: virtual-machines-windows

ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 05/11/2020
ms.author: edburns
#Customer intent: As an IT pro, I want to run get WebLogic running on Azure so that legacy Java code can run in the cloud.
---
# What is Oracle WebLogic Server on Azure?

This page describes solutions for running WebLogic Server (WLS) on Azure Virtual Machines.  These solutions are jointly developed by Oracle and Microsoft.

Oracle WebLogic Server is the world’s first cloud native, enterprise Java platform application server for developing and deploying multi-tier distributed enterprise applications. Azure WebLogic Server offers enable you to embrace cloud computing. You get greater choice and flexibility for WebLogic migration including lift and shift of your Java EE applications to Azure Cloud. WLS on Azure yields big impact with a small effort. The solutions empower you to start your line of business (LOB) applications quickly. Each offer automatically provisions virtual network, storage and Linux resources. With zero effort, WebLogic Server is installed. WLS on Azure sets up security with a network security group, load balancing with Azure App Gateway, authentication with Azure Active Directory and automatically connects to your existing database. The road map for the solutions include adding the ability to enable distributed logging as well as distributed caching via Oracle Coherence.

:::image type="content" source="media/oracle-weblogic/wls-on-azure.gif" alt-text="You can use the Azure portal to deploy WebLogic Server on Azure":::

There are four offers available to meet different scenarios: single node without an admin server, single node with an admin server, cluster, and dynamic cluster. Try the offers, they're available free of charge.

_These offers are Bring-Your-Own-License_. They assume you've already got the appropriate licenses with Oracle and are properly licensed to run offers in Microsoft Azure.

The offers support a range of operating system, Java and WebLogic versions such as WebLogic Server 14 and JDK 11 on Oracle Linux 7.6 through base images. These base images are also available on Azure on their own. The base images are suitable for customers that require very highly customized Azure deployments. The current set of base images are available [here](https://portal.azure.com/#blade/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/selectedMenuItemId/home/searchQuery/weblogic%20server%20base%20image).

_If you want to work closely on your migration scenarios with the engineering team developing these offers, select the [CONTACT ME](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/oracle.oraclelinux-wls-cluster?tab=Overview) button_ in the [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/oracle.oraclelinux-wls-cluster?tab=Overview). Program managers, architects, and engineers will reach back out to you shortly and start collaboration! The opportunity to collaborate on a migration scenario is completely free while the offers are under active development.

## Oracle WebLogic Server Single Node

This offer provisions a single virtual machine and installs WLS on it. It doesn't create a domain or start the Administration Server. Single node is useful for scenarios with highly customized domain configuration.

## Oracle WebLogic Server with Admin Server

This offer provisions a single virtual machine and installs WLS on it. It creates a domain and starts up the Administration Server, which allows you to manage the domain.

## Oracle WebLogic Server Cluster

This offer creates a highly available cluster of WLS virtual machines. The Administration Server and all managed servers are started by default, which allow you to manage the domain.

## Oracle WebLogic Server Dynamic Cluster

This offer creates a highly available and scalable dynamic cluster of WLS virtual machines. The Administration Server and all managed servers are started by default, which allow you to manage the domain.

## Next steps

Explore the offers in the Azure Marketplace.

> [!div class="nextstepaction"]
> [Oracle WebLogic Server Single Node](https://portal.azure.com/#create/oracle.20191001-arm-oraclelinux-wls20191001-arm-oraclelinux-wls)

> [!div class="nextstepaction"]
> [Oracle WebLogic Server with Admin Server](https://portal.azure.com/#create/oracle.20191009-arm-oraclelinux-wls-admin20191009-arm-oraclelinux-wls-admin)

> [!div class="nextstepaction"]
> [Oracle WebLogic Server Cluster](https://portal.azure.com/#create/oracle.20191007-arm-oraclelinux-wls-cluster20191007-arm-oraclelinux-wls-cluster)

> [!div class="nextstepaction"]
> [Oracle WebLogic Server Dynamic Cluster](https://portal.azure.com/#create/oracle.20191021-arm-oraclelinux-wls-dynamic-cluster20191021-arm-oraclelinux-wls-dynamic-cluster)
