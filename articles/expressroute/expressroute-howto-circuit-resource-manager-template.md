---
title: 'Azure ExpressRoute Template: Create an ExpressRoute circuit'
description: Create, provision, delete, and deprovision an ExpressRoute circuit.
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: article
ms.date: 11/13/2019
ms.author: cherylmc
ms.reviewer: ganesr

---

# Create an ExpressRoute circuit by using Azure Resource Manager template

> [!div class="op_single_selector"]
> * [Azure portal](expressroute-howto-circuit-portal-resource-manager.md)
> * [PowerShell](expressroute-howto-circuit-arm.md)
> * [Azure CLI](howto-circuit-cli.md)
> * [Azure Resource Manager template](expressroute-howto-circuit-resource-manager-template.md)
> * [Video - Azure portal](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-create-an-expressroute-circuit)
> * [PowerShell (classic)](expressroute-howto-circuit-classic.md)
>

Learn how to create an ExpressRoute circuit by deploying an Azure Resource Manager template by using Azure PowerShell. For more information on developing Resource Manager templates, see [Resource Manager documentation](/azure/azure-resource-manager/) and the [template reference](/azure/templates/microsoft.network/expressroutecircuits).

## Before you begin

* Review the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before you begin configuration.
* Ensure that you have permissions to create new networking resources. Contact your account administrator if you do not have the right permissions.
* You can [view a video](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-create-an-expressroute-circuit) before beginning in order to better understand the steps.

## <a name="create"></a>Create and provision an ExpressRoute circuit

[Azure Quickstart templates](https://azure.microsoft.com/resources/templates/) has a good collection of Resource Manager template. You use one of the [existing templates](https://azure.microsoft.com/resources/templates/101-expressroute-circuit-create/) to create an ExpressRoute circuit.

[!code-json[create-azure-expressroute-circuit](~/quickstart-templates/101-expressroute-circuit-create/azuredeploy.json)]

To see more related templates, select [here](https://azure.microsoft.com/resources/templates/?term=expressroute).

To create an ExpressRoute Circuit by deploying a template:

1. Select **Try it** from the following code block, and then follow the instructions to sign in to the Azure Cloud shell.

    ```azurepowershell-interactive
    $circuitName = Read-Host -Prompt "Enter a circuit name"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    $resourceGroupName = "${circuitName}rg"
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-expressroute-circuit-create/azuredeploy.json"

    $serviceProviderName = "Equinix"
    $peeringLocation = "Silicon Valley"
    $bandwidthInMbps = 500
    $sku_tier = "Premium"
    $sku_family = "MeteredData"

    New-AzResourceGroup -Name $resourceGroupName -Location $location
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri -circuitName $circuitName -serviceProviderName $serviceProviderName -peeringLocation $peeringLocation -bandwidthInMbps $bandwidthInMbps -sku_tier $sku_tier -sku_family $sku_family

    Write-Host "Press [ENTER] to continue ..."
    ```

   * **SKU tier** determines whether an ExpressRoute circuit is [Local](expressroute-faqs.md#expressroute-local), Standard or [Premium](expressroute-faqs.md#expressroute-premium). You can specify *Local*, *Standard* or *Premium*.
   * **SKU family** determines the billing type. You can specify *Metereddata* for a metered data plan and *Unlimiteddata* for an unlimited data plan. You can change the billing type from *Metereddata* to *Unlimiteddata*, but you can't change the type from *Unlimiteddata* to *Metereddata*. A *Local* circuit is *Unlimiteddata* only.
   * **Peering Location** is the physical location where you are peering with Microsoft.

     > [!IMPORTANT]
     > The Peering Location indicates the [physical location](expressroute-locations.md) where you are peering with Microsoft. This is **not** linked to "Location" property, which refers to the geography where the Azure Network Resource Provider is located. While they are not related, it is a good practice to choose a Network Resource Provider geographically close to the Peering Location of the circuit.

    The resource group name is the service bus namespace name with **rg** appended.

2. Select **Copy** to copy the PowerShell script.
3. Right-click the shell console, and then select **Paste**.

It takes a few moments to create an event hub.

Azure PowerShell is used to deploy the template in this tutorial. For other template deployment methods, see:

* [By using the Azure portal](../azure-resource-manager/templates/deploy-portal.md).
* [By using Azure CLI](../azure-resource-manager/templates/deploy-cli.md).
* [By using REST API](../azure-resource-manager/templates/deploy-rest.md).

## <a name="delete"></a>Deprovisioning and deleting an ExpressRoute circuit

You can delete your ExpressRoute circuit by selecting the **delete** icon. Note the following information:

* You must unlink all virtual networks from the ExpressRoute circuit. If this operation fails, check whether any virtual networks are linked to the circuit.
* If the ExpressRoute circuit service provider provisioning state is **Provisioning** or **Provisioned** you must work with your service provider to deprovision the circuit on their side. We continue to reserve resources and bill you until the service provider completes deprovisioning the circuit and notifies us.
* If the service provider has deprovisioned the circuit (the service provider provisioning state is set to **Not provisioned**), you can delete the circuit. This stops billing for the circuit.

You can delete your ExpressRoute circuit by running the following PowerShell command:

```azurepowershell-interactive
$circuitName = Read-Host -Prompt "Enter the same circuit name that you used earlier"
$resourceGroupName = "${circuitName}rg"

Remove-AzExpressRouteCircuit -ResourceGroupName $resourceGroupName -Name $circuitName
```

## Next steps

After you create your circuit, continue with the following next steps:

* [Create and modify routing for your ExpressRoute circuit](expressroute-howto-routing-portal-resource-manager.md)
* [Link your virtual network to your ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
