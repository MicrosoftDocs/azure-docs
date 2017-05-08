---
title: 'Create and modify an ExpressRoute circuit: Azure portal | Microsoft Docs'
description: This article describes how to create, provision, verify, update, delete, and deprovision an ExpressRoute circuit.
documentationcenter: na
services: expressroute
author: cherylmc
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 68d59d59-ed4d-482f-9cbc-534ebb090613
ms.service: expressroute
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/07/2017
ms.author: cherylmc;ganesr

---
# Create and modify an ExpressRoute circuit
> [!div class="op_single_selector"]
> * [Resource Manager - Azure Portal](expressroute-howto-circuit-portal-resource-manager.md)
> * [Resource Manager - PowerShell](expressroute-howto-circuit-arm.md)
> * [Video - Azure Portal](http://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-create-an-expressroute-circuit)
> 
>

This article describes how to create an Azure ExpressRoute circuit by using the Azure portal and the Azure Resource Manager deployment model. The following steps also show you how to check the status of the circuit, update it, or delete and deprovision it.


## Before you begin
* Review the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before you begin configuration.
* Ensure that you have access to the [Azure portal](https://portal.azure.com).
* Ensure that you have permissions to create new networking resources. Contact your account administrator if you do not have the right permissions.
* You can [view a video](http://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-create-an-expressroute-circuit) before beginning in order to better understand the steps.

## Create and provision an ExpressRoute circuit
### 1. Sign in to the Azure portal
From a browser, navigate to the [Azure portal](http://portal.azure.com) and sign in with your Azure account.

### 2. Create a new ExpressRoute circuit
> [!IMPORTANT]
> Your ExpressRoute circuit will be billed from the moment a service key is issued. Ensure that you perform this operation when the connectivity provider is ready to provision the circuit.
> 
> 

1. You can create an ExpressRoute circuit by selecting the option to create a new resource. Click **New** > **Networking** > **ExpressRoute**, as shown in the following image:
   
    ![Create an ExpressRoute circuit](./media/expressroute-howto-circuit-portal-resource-manager/createcircuit1.png)
2. After you click **ExpressRoute**, you'll see the **Create ExpressRoute circuit** blade. When you're filling in the values on this blade, make sure that you specify the correct SKU tier and data metering.
   
   * **Tier** determines whether an ExpressRoute standard or an ExpressRoute premium add-on is enabled. You can specify **Standard** to get the standard SKU or **Premium** for the premium add-on.
   * **Data metering** determines the billing type. You can specify **Metered** for a metered data plan and **Unlimited** for an unlimited data plan. Note that you can change the billing type from **Metered** to **Unlimited**, but you can't change the type from **Unlimited** to **Metered**.
     
     ![Configure the SKU tier and data metering](./media/expressroute-howto-circuit-portal-resource-manager/createcircuit2.png)

> [!IMPORTANT]
> Please be aware that the Peering Location indicates the [physical location](expressroute-locations.md) where you are peering with Microsoft. This is **not** linked to "Location" property, which refers to the geography where the Azure Network Resource Provider is located. While they are not related, it is a good practice to choose a Network Resource Provider geographically close to the Peering Location of the circuit. 
> 
> 

### 3. View the circuits and properties
**View all the circuits**

You can view all the circuits that you created by selecting **All resources** on the left-side menu.

![View circuits](./media/expressroute-howto-circuit-portal-resource-manager/listresource.png)

**View the properties**

    You can view the properties of the circuit by selecting it. On this blade, note the service key for the circuit. You must copy the circuit key for your circuit and pass it down to the service provider to complete the provisioning process. The circuit key is specific to your circuit.

![View properties](./media/expressroute-howto-circuit-portal-resource-manager/listproperties1.png)

### 4. Send the service key to your connectivity provider for provisioning
On this blade, **Provider status** provides information on the current state of provisioning on the service-provider side. **Circuit status** provides the state on the Microsoft side. For more information about circuit provisioning states, see the [Workflows](expressroute-workflows.md#expressroute-circuit-provisioning-states) article.

When you create a new ExpressRoute circuit, the circuit will be in the following state:

Provider status: Not provisioned<BR>
Circuit status: Enabled

![Initiate provisioning process](./media/expressroute-howto-circuit-portal-resource-manager/viewstatus.png)

The circuit will change to the following state when the connectivity provider is in the process of enabling it for you:

Provider status: Provisioning<BR>
Circuit status: Enabled

For you to be able to use an ExpressRoute circuit, it must be in the following state:

Provider status: Provisioned<BR>
Circuit status: Enabled

### 5. Periodically check the status and the state of the circuit key
You can view the properties of the circuit that you're interested in by selecting it. Check the **Provider status** and ensure that it has moved to **Provisioned** before you continue.

![Circuit and provider status](./media/expressroute-howto-circuit-portal-resource-manager/viewstatusprovisioned.png)

### 6. Create your routing configuration
For step-by-step instructions, refer to the [ExpressRoute circuit routing configuration](expressroute-howto-routing-portal-resource-manager.md) article to create and modify circuit peerings.

> [!IMPORTANT]
> These instructions only apply to circuits that are created with service providers that offer layer 2 connectivity services. If you're using a service provider that offers managed layer 3 services (typically an IP VPN, like MPLS), your connectivity provider will configure and manage routing for you.
> 
> 

### 7. Link a virtual network to an ExpressRoute circuit
Next, link a virtual network to your ExpressRoute circuit. Use the [Linking virtual networks to ExpressRoute circuits](expressroute-howto-linkvnet-arm.md) article when you work with the Resource Manager deployment model.

## Getting the status of an ExpressRoute circuit
You can view the status of a circuit by selecting it. 

![Status of an ExpressRoute circuit](./media/expressroute-howto-circuit-portal-resource-manager/listproperties1.png)

## Modifying an ExpressRoute circuit
You can modify certain properties of an ExpressRoute circuit without impacting connectivity.

You can do the following with no downtime:

* Enable or disable an ExpressRoute premium add-on for your ExpressRoute circuit.
* Increase the bandwidth of your ExpressRoute circuit provided there is capacity available on the port. Note that downgrading the bandwidth of a circuit is not supported. 
* Change the metering plan from Metered Data to Unlimited Data. Note that changing the metering plan from Unlimited Data to Metered Data is not supported.
* You can enable and disable *Allow Classic Operations*.

For more information on limits and limitations, refer to the [ExpressRoute FAQ](expressroute-faqs.md).

To modify an ExpressRoute circuit, click on the **Configuration** as shown in the figure below.

![Modify circuit](./media/expressroute-howto-circuit-portal-resource-manager/modifycircuit.png)

You can modify the bandwidth, SKU, billing model and allow classic operations within the configuration blade.

> [!IMPORTANT]
> You may have to recreate the ExpressRoute circuit if there is inadequate capacity on the existing port. You cannot upgrade the circuit if there is no additional capacity available at that location.
>
> You cannot reduce the bandwidth of an ExpressRoute circuit without disruption. Downgrading bandwidth requires you to deprovision the ExpressRoute circuit and then reprovision a new ExpressRoute circuit.
> 
> Disable premium add-on operation can fail if you're using resources that are greater than what is permitted for the standard circuit.
> 
> 

## Deprovisioning and deleting an ExpressRoute circuit
You can delete your ExpressRoute circuit by selecting the **delete** icon. Note the following:

* You must unlink all virtual networks from the ExpressRoute circuit. If this operation fails, check whether any virtual networks are linked to the circuit.
* If the ExpressRoute circuit service provider provisioning state is **Provisioning** or **Provisioned** you must work with your service provider to deprovision the circuit on their side. We will continue to reserve resources and bill you until the service provider completes deprovisioning the circuit and notifies us.
* If the service provider has deprovisioned the circuit (the service provider provisioning state is set to **Not provisioned**) you can then delete the circuit. This will stop billing for the circuit

## Next steps
After you create your circuit, make sure that you do the following:

* [Create and modify routing for your ExpressRoute circuit](expressroute-howto-routing-portal-resource-manager.md)
* [Link your virtual network to your ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)

