---
title: Provision new SIMs - ARM template
titleSuffix: Azure Private 5G Core
description: This how-to guide shows how to provision new SIMs using an Azure Resource Manager (ARM) template. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 03/21/2022
ms.custom: template-how-to, devx-track-arm-template
---

# Provision new SIMs for Azure Private 5G Core - ARM template

*SIM resources* represent physical SIMs or eSIMs used by user equipment (UEs) served by the private mobile network. In this how-to guide, you'll learn how to provision new SIMs for an existing private mobile network using an Azure Resource Manager template (ARM template).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-provision-proxy-sims%2Fazuredeploy.json)

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
- Identify the name of the Mobile Network resource corresponding to your private mobile network and the resource group containing it.
- Identify the Azure region in which you deployed your private mobile network.
- Choose a name for the new SIM group to which your SIMs will be added. 
- Identify the SIM policy you want to assign to the SIMs you're provisioning. You must have already created this SIM policy using the instructions in [Configure a SIM policy - Azure portal](configure-sim-policy-azure-portal.md). 

## Collect the required information for your SIMs

To begin, collect the values in the following table for each SIM you want to provision.

| Value |Parameter name |
|--|--|
| SIM name. The SIM name must only contain alphanumeric characters, dashes, and underscores. | `simName` |
| The Integrated Circuit Card Identification Number (ICCID). The ICCID identifies a specific physical SIM or eSIM, and includes information on the SIM's country/region and issuer. The ICCID is optional and is a unique numerical value between 19 and 20 digits in length, beginning with 89. | `integratedCircuitCardIdentifier` |
| The international mobile subscriber identity (IMSI). The IMSI is a unique number (usually 15 digits) identifying a device or user in a mobile network. | `internationalMobileSubscriberIdentity` |
| The Authentication Key (Ki). The Ki is a unique 128-bit value assigned to the SIM by an operator, and is used with the derived operator code (OPc) to authenticate a user. It must be a 32-character string, containing hexadecimal characters only. | `authenticationKey` |
| The derived operator code (OPc). The OPc is taken from the SIM's Ki and the network's operator code (OP). The packet core instance uses it to authenticate a user using a standards-based algorithm. The OPc must be a 32-character string, containing hexadecimal characters only. | `operatorKeyCode` |
| The type of device using this SIM. This value is an optional free-form string. You can use it as required to easily identify device types using the enterprise's private mobile network.  | `deviceType` |
| The SIM policy to assign to the SIM. This is optional, but your SIMs won't be able to use the private mobile network without an assigned SIM policy. | `simPolicyId` |

## Prepare one or more arrays for your SIMs

Use the information you collected in [Collect the required information for your SIMs](#collect-the-required-information-for-your-sims) to create one or more JSON arrays containing properties for up to 500 of the SIMs you want to provision. The following is an example of an array containing properties for two SIMs (`SIM1` and `SIM2`).

> [!IMPORTANT]
> Bulk SIM provisioning is limited to 500 SIMs. If you want to provision more that 500 SIMs, you must create multiple SIM arrays with no more than 500 SIMs in any one array and repeat the provisioning process for each SIM array.

Delete the `staticIpConfiguration` parameter for that SIM.

```json
[
 {
  "simName": "SIM1",
  "integratedCircuitCardIdentifier": "8912345678901234566",
  "internationalMobileSubscriberIdentity": "001019990010001",
  "authenticationKey": "00112233445566778899AABBCCDDEEFF",
  "operatorKeyCode": "63bfa50ee6523365ff14c1f45f88737d",
  "deviceType": "Cellphone",
  "simPolicyId": "/subscriptions/subid/resourceGroups/contoso-rg/providers/Microsoft.MobileNetwork/mobileNetworks/contoso-network/simPolicies/SimPolicy1",
  "staticIpConfiguration" :[
	{
	  "attachedDataNetworkId": "/subscriptions/subid/resourceGroups/contoso-rg/providers/Microsoft.MobileNetwork/packetCoreControlPlanes/site-1/packetCoreDataPlanes/site-1/attachedDataNetworks/adn1",
	  "sliceId": "/subscriptions/subid/resourceGroups/contoso-rg/providers/Microsoft.MobileNetwork/mobileNetworks/contoso-network/slices/slice-1",
	  "staticIpAddress": "10.132.124.54"
	},
    {
	  "attachedDataNetworkId": "/subscriptions/subid/resourceGroups/contoso-rg/providers/Microsoft.MobileNetwork/packetCoreControlPlanes/site-1/packetCoreDataPlanes/site-1/attachedDataNetworks/adn2",
	  "sliceId": "/subscriptions/subid/resourceGroups/contoso-rg/providers/Microsoft.MobileNetwork/mobileNetworks/contoso-network/slices/slice-1",
	  "staticIpAddress": "10.132.124.55"
	}
   ]
 },
 {
  "simName": "SIM2",
  "integratedCircuitCardIdentifier": "8922345678901234567",
  "internationalMobileSubscriberIdentity": "001019990010002",
  "authenticationKey": "11112233445566778899AABBCCDDEEFF",
  "operatorKeyCode": "63bfa50ee6523365ff14c1f45f88738d",
  "deviceType": "Sensor",
  "simPolicyId": "/subscriptions/subid/resourceGroups/contoso-rg/providers/Microsoft.MobileNetwork/mobileNetworks/contoso-network/simPolicies/SimPolicy2",
  "staticIpConfiguration" :[
	{
	  "attachedDataNetworkId": "/subscriptions/subid/resourceGroups/contoso-rg/providers/Microsoft.MobileNetwork/packetCoreControlPlanes/site-1/packetCoreDataPlanes/site-1/attachedDataNetworks/adn1",
	  "sliceId": "/subscriptions/subid/resourceGroups/contoso-rg/providers/Microsoft.MobileNetwork/mobileNetworks/contoso-network/slices/slice-1",
	  "staticIpAddress": "10.132.124.54"
	},
	{
	  "attachedDataNetworkId": "/subscriptions/subid/resourceGroups/contoso-rg/providers/Microsoft.MobileNetwork/packetCoreControlPlanes/site-1/packetCoreDataPlanes/site-1/attachedDataNetworks/adn2",
	  "sliceId": "/subscriptions/subid/resourceGroups/contoso-rg/providers/Microsoft.MobileNetwork/mobileNetworks/contoso-network/slices/slice-1",
	  "staticIpAddress": "10.132.124.55"
	}
   ]
 }
]
```

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/mobilenetwork-provision-proxy-sims).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.mobilenetwork/mobilenetwork-provision-proxy-sims/azuredeploy.json":::

The following Azure resources are defined in the template.

- [**Microsoft.MobileNetwork/simGroups**](/azure/templates/microsoft.mobilenetwork/simGroups): a resource representing a SIM group.
- [**Microsoft.MobileNetwork/simGroups/sims**](/azure/templates/microsoft.mobilenetwork/simGroups/sims): a resource representing a physical SIM or eSIM.

## Deploy the template

1. Select the following link to sign in to Azure and open a template.

    [![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-provision-proxy-sims%2Fazuredeploy.json)

1. Select or enter the following values, using the information you retrieved in [Prerequisites](#prerequisites).

    - **Subscription:** select the Azure subscription you used to create your private mobile network.
    - **Resource group:** select the resource group containing the Mobile Network resource representing your private mobile network.
    - **Region:** select the region in which you deployed the private mobile network.
    - **Location:** enter the [code name](region-code-names.md) of the region in which you deployed the private mobile network.
    - **Existing Mobile Network Name:** enter the name of the Mobile Network resource representing your private mobile network.
    - **Existing Sim Policy Name:** enter the name of the SIM policy you want to assign to the SIMs.
    - **Sim Group Name:** enter the name for the new SIM group.
    - **Sim Resources:** paste in one of the JSON arrays you prepared in [Prepare one or more arrays for your SIMs](#prepare-one-or-more-arrays-for-your-sims).

    :::image type="content" source="media/provision-sims-arm-template/sims-arm-template-configuration-fields.png" alt-text="Screenshot of the Azure portal showing the configuration fields for the SIMs ARM template.":::

2. Select **Review + create**.
3. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

     If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

4. Once your configuration has been validated, you can select **Create** to provision your SIMs. The Azure portal will display a confirmation screen when the SIMs have been provisioned.
5. If you are provisioning more than 500 SIMs, repeat this process for each of your JSON arrays.

## Review deployed resources

1. Select **Go to resource group**.

    :::image type="content" source="media/template-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing a deployment confirmation for the ARM template.":::

1. Confirm that the **SIM Group** resource has been created in the resource group.

    :::image type="content" source="media/provision-sims-arm-template/sims-resource-group.png" alt-text="Screenshot of the Azure portal showing a resource group containing a newly created SIM group.":::

1. Select the **SIM Group** resource and confirm that all of your SIMs have been provisioned correctly.

    :::image type="content" source="media/provision-sims-arm-template/sim-group-resource-inline.png" alt-text="Screenshot of the Azure portal showing a SIM group resource containing SIMs." lightbox="media/provision-sims-arm-template/sim-group-resource-enlarged.png":::

## Next steps

You can [Manage these SIMs](manage-existing-sims.md) using the Azure portal.