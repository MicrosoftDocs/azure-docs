---
title: Configure a server to use a gateway for Azure Virtual Network datasources | Microsoft Docs
description: Learn how to configure a server to use a gateway for datasources on VNET.
services: analysis-services
documentationcenter: ''
author: minewiskan
manager: kfile
editor: ''
tags: ''

ms.assetid: 
ms.service: analysis-services
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: na
ms.date: 04/10/2018
ms.author: owend

---
# Configure server to use gateway for datasources on an Azure Virtual Network (VNET)

This article describes the **AlwaysUseGateway** server property for use when datasources are on an [Azure Virtual Network (VNET)](../virtual-network/virtual-networks-overview.md).

> [!NOTE]
> This property is effective only when an [On-premises data gateway](analysis-services-gateway.md) is installed and configured. The gateway can be also be on the VNET.


## Description
If your datasources are on an Azure virtual machine (VM) accessed through a VNET, your Azure Analysis Services server must be able to connect to those datasources just like they are an on-premises datasource. 

You can configure the AlwaysUseGateway server property to specify the server to access all data through an [On-premises gateway](analysis-services-gateway.md). 

This applies whether the source system is in the cloud or not. The gateway machine can be on the VNET and the data can be accessed successfully.

With the property set to true, Azure AS will access all source data only through the GW, so this depends on having a GW set up as described here. The computer the gateway is installed on can be in the VNET.

## Configure AlwaysUseGateway property

1. In SSMS > server > **Properties** > **General**, select **Show Advanced (All) Properties**.
2. In the **ASPaaS\AlwaysUseGateway**, select **true**.

    ![Always use gateway property](media/analysis-services-vnet-gateway/aas-ssms-always-property.png)


## See also
[Connecting to on-premises data sources](analysis-services-gateway.md)   
[Install and configure an on-premises data gateway](analysis-services-gateway-install.md)   

