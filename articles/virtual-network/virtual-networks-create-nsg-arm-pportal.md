---
title: Create a network security group - Azure portal | Microsoft Docs
description: Learn how to create and deploy network security groups using the Azure portal.
services: virtual-network
documentationcenter: na
author: jimdial
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 5bc8fc2e-1e81-40e2-8231-0484cd5605cb
ms.service: virtual-network
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 02/04/2016
ms.author: jdial
ms.custom: H1Hack27Feb2017

---
# Create a network security group using the Azure portal

[!INCLUDE [virtual-networks-create-nsg-intro-include](../../includes/virtual-networks-create-nsg-intro-include.md)]

[!INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)]

This article covers the Resource Manager deployment model. You can also [create NSGs in the classic deployment model](virtual-networks-create-nsg-classic-ps.md).

[!INCLUDE [virtual-networks-create-nsg-scenario-include](../../includes/virtual-networks-create-nsg-scenario-include.md)]


## Create the NSG-FrontEnd NSG
To create the **NSG-FrontEnd** NSG as shown in the scenario, complete the following steps:

1. From a browser, navigate to https://portal.azure.com and, if necessary, sign in with your Azure account.
2. Select **+ Create a resource >** > **Network Security Groups**.
   
    ![Azure portal - NSGs](./media/virtual-networks-create-nsg-arm-pportal/figure11.png)
3. Under **Network security groups**, select **Add**.
   
    ![Azure portal - NSGs](./media/virtual-networks-create-nsg-arm-pportal/figure12.png)
4. Under **Create network security group**, create an NSG named *NSG-FrontEnd* in the *RG-NSG* resource group, and then select **Create**.
   
    ![Azure portal - NSGs](./media/virtual-networks-create-nsg-arm-pportal/figure13.png)

## Create rules in an existing NSG
To create rules in an existing NSG from the Azure portal, complete the following steps:

1. Select **All Services**, then search for **Network security groups**. When **Network security groups** appear, select it.
2. In the list of NSGs, select **NSG-FrontEnd** > **Inbound security rules**
   
    ![Azure portal - NSG-FrontEnd](./media/virtual-networks-create-nsg-arm-pportal/figure2.png)
3. In the list of **Inbound security rules**, select **Add**.
   
    ![Azure portal - Add rule](./media/virtual-networks-create-nsg-arm-pportal/figure3.png)
4. Under **Add inbound security rule**, create a rule named *web-rule* with priority of *200* allowing access via *TCP* to port *80* to any VM from any source, and then select **OK**. Notice that most of these settings are default values already.
   
    ![Azure portal - Rule settings](./media/virtual-networks-create-nsg-arm-pportal/figure4.png)
5. After a few seconds, you see the new rule in the NSG.
   
    ![Azure portal - New rule](./media/virtual-networks-create-nsg-arm-pportal/figure5.png)
6. Repeat steps  to 6 to create an inbound rule named *rdp-rule* with a priority of *250* allowing access via *TCP* to port *3389* to any VM from any source.

## Associate the NSG to the FrontEnd subnet

1. Select **All services >**, enter **Resource groups**, select **Resource groups** when it appears, then select **RG-NSG**.
2. Under **RG-NSG**, select **...** > **TestVNet**.
   
    ![Azure portal - TestVNet](./media/virtual-networks-create-nsg-arm-pportal/figure14.png)
3. Under **Settings**, select **Subnets** > **FrontEnd** > **Network security group** > **NSG-FrontEnd**.
   
    ![Azure portal - Subnet settings](./media/virtual-networks-create-nsg-arm-pportal/figure15.png)
4. In the **FrontEnd** blade, select **Save**.
   
    ![Azure portal - Subnet settings](./media/virtual-networks-create-nsg-arm-pportal/figure16.png)

## Create the NSG-BackEnd NSG
To create the **NSG-BackEnd** NSG and associate it to the **BackEnd** subnet, complete the following steps:

1. To create an NSG named *NSG-BackEnd*, repeat the steps in [Create the NSG-FrontEnd NSG](#Create-the-NSG-FrontEnd-NSG).
2. To create the **inbound** rules in the table that follows, repeat the steps in [Create rules in an existing NSG](#Create-rules-in-an-existing-NSG).
   
   | Inbound rule | Outbound rule |
   | --- | --- |
   | ![Azure portal - inbound rule](./media/virtual-networks-create-nsg-arm-pportal/figure17.png) |![Azure portal - outbound rule](./media/virtual-networks-create-nsg-arm-pportal/figure18.png) |
3. To associate the **NSG-Backend** NSG to the **BackEnd** subnet, repeat the steps in [Associate the NSG to the FrontEnd subnet](#Associate-the-NSG-to-the-FrontEnd-subnet).

## Next Steps
* Learn how to [manage existing NSGs](manage-network-security-group.md)
* [Enable logging](virtual-network-nsg-manage-log.md) for NSGs.