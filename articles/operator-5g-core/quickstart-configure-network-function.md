---
title: Configure a network function in Azure Operator 5G Core
description: Learn the high-level process for configuring a network function.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.topic: quickstart #required; leave this attribute/value as-is
ms.date: 02/22/2024

---

# Quickstart: Configure a network function in Azure Operator 5G Core

Azure Operator 5G Core supports  direct configuration of the first party packet core network functions deployed on Azure and Nexus by:

   - enabling SSH access to port 22 of network configuration management pods directly. 
   - enabling configuration of network functions through CLI or by NETCONF to port 830, or by RESTCONF to port 443. 
   
Note that many concurrent configuration user sessions are supported. 

## Additional information

For more information, see the documentation for the [Configuration Manager](https://manuals.metaswitch.com/UC/4.3.0/UnityCloud_Overview/Content/Microservices/Shared/Microservices/Config_Manager.htm  ).

> [!NOTE]
> The linked content is available only to customers with a current Affirmed Networks support agreement. To access the content, you must have  Affirmed Networks login credentials. If you need assistance, please speak to the Affirmed Networks Support Team.

## Next step

Learn how to configure a specific network function in [Tutorial: Configure Network Functions](tutorial-configure-network-function.md).