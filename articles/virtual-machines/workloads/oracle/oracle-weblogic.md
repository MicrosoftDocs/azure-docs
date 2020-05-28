---
title: Oracle WebLogic Server Azure Applications | Microsoft Docs
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
---
# Oracle WebLogic Server Azure Applications

## Oracle WebLogic Server is a scalable, enterprise-ready Java EE application server.

Oracle WebLogic Server is the world’s first cloud native, enterprise Java platform application server for developing and deploying multi-tier distributed enterprise applications. Azure WebLogic Server offers enable you to embrace cloud computing by providing greater choice and flexibility for WebLogic migration including lift and shift of your Java EE applications to Azure Cloud with the smallest effort and biggest impact. The offers empower you to start your business applications quickly by automatically provisioning virtual network, storage and Linux resources, installing WebLogic Server, setting up security with a network security group, load balancing with Azure App Gateway, authentication with Azure Active Directory and easing database connectivity.

There are four offers available to meet different scenarios: single node without an admin server, single node with an admin server, cluster and dynamic cluster.  You should feel free to give them a try, the offers are available free of charge.

_These offers are Bring-Your-Own-License_. They assume you have already procured the appropriate licenses with Oracle and are properly licensed to run offers in Microsoft Azure.

_If you want to work closely on your migration scenarios with the engineering team developing these offers, just hit the [CONTACT ME](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/oracle.oraclelinux-wls-cluster?tab=Overview) button_ in the [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/oracle.oraclelinux-wls-cluster?tab=Overview). Program managers, architects and engineers will reach back out to you shortly and initiate collaboration!

### Oracle WebLogic Server Single Node

This offer provisions a single virtual machine and installs Oracle WebLogic Server on it. It does not create a domain or start the Administration Server. This is useful for scenarios with highly customized domain configuration.

### Oracle WebLogic Server with Admin Server

This offer provisions a single virtual machine and installs Oracle WebLogic Server on it. It creates a domain and starts up the Administration Server, which allows you to manage the domain.

### Oracle WebLogic Server Cluster

This offer creates a highly available cluster of Oracle WebLogic Server virtual machines. The Administration Server and all managed servers are started by default, which allow you to manage the domain.

### Oracle WebLogic Server Dynamic Cluster

This offer creates a highly available and scalable dynamic cluster of Oracle WebLogic Server virtual machines. The Administration Server and all managed servers are started by default, which allow you to manage the domain.

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
