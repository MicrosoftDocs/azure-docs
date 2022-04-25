---
title: Provision SIMs - ARM template
titleSuffix: Azure Private 5G Core Preview
description: This how-to guide shows how to provision SIMs using an Azure Resource Manager (ARM) template. 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 03/21/2022
ms.custom: template-how-to 
---

# Provision SIMs for Azure Private 5G Core Preview - ARM template

*SIM resources* represent physical SIMs or eSIMs used by user equipment (UEs) served by the private mobile network. In this how-to guide, you'll learn how to provision new SIMs for an existing private mobile network using an Azure Resource Manager template (ARM template).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-provision-sims%2Fazuredeploy.json)

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
- Identify the name of the Mobile Network resource corresponding to your private mobile network and the resource group containing it.

## Collect the required information for your SIMs

To begin, collect the values in the following table for each SIM you want to provision.

| Value |Parameter name |
|--|--|
| SIM name. The SIM name must only contain alphanumeric characters, dashes, and underscores. | `simName` |
| The Integrated Circuit Card Identification Number (ICCID). The ICCID identifies a specific physical SIM or eSIM, and includes information on the SIM's country and issuer. The ICCID is a unique numerical value between 19 and 20 digits in length, beginning with 89. | `integratedCircuitCardIdentifier` |
| The international mobile subscriber identity (IMSI). The IMSI is a unique number (usually 15 digits) identifying a device or user in a mobile network. | `internationalMobileSubscriberIdentity` |
| The Authentication Key (Ki). The Ki is a unique 128-bit value assigned to the SIM by an operator, and is used with the derived operator code (OPc) to authenticate a user. It must be a 32-character string, containing hexadecimal characters only. | `authenticationKey` |
| The derived operator code (OPc). The OPc is taken from the SIM's Ki and the network's operator code (OP). The packet core instance uses it to authenticate a user using a standards-based algorithm. The OPc must be a 32-character string, containing hexadecimal characters only. | `operatorKeyCode` |
| The type of device using this SIM. This value is an optional free-form string. You can use it as required to easily identify device types using the enterprise's private mobile network.  | `deviceType` |

## Prepare an array for your SIMs

Use the information you collected in [Collect the required information for your SIMs](#collect-the-required-information-for-your-sims) to create an array containing properties for each of the SIMs you want to provision. The following is an example of an array containing properties for two SIMs.

```json
[
 {
  "simName": "SIM1",
  "integratedCircuitCardIdentifier": "8912345678901234566",
  "internationalMobileSubscriberIdentity": "001019990010001",
  "authenticationKey": "00112233445566778899AABBCCDDEEFF",
  "operatorKeyCode": "63bfa50ee6523365ff14c1f45f88737d",
  "deviceType": "Cellphone"
 },
 {
  "simName": "SIM2",
  "simProfileName": "profile2",
  "integratedCircuitCardIdentifier": "8922345678901234567",
  "internationalMobileSubscriberIdentity": "001019990010002",
  "authenticationKey": "11112233445566778899AABBCCDDEEFF",
  "operatorKeyCode": "63bfa50ee6523365ff14c1f45f88738d",
  "deviceType": "Sensor"
 }
]
```

## Review the template

<!--
Need to confirm whether the following link is correct.
-->

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/mobilenetwork-provision-sims).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.mobilenetwork/mobilenetwork-provision-sims/azuredeploy.json":::

The template defines one or more [**Microsoft.MobileNetwork/sims**](/azure/templates/microsoft.mobilenetwork/sims) resources, each of which represents a physical SIM or eSIM.

## Deploy the template

1. Select the following link to sign in to Azure and open a template.

    [![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-provision-sims%2Fazuredeploy.json)

1. Select or enter the following values, using the information you retrieved in [Prerequisites](#prerequisites). <!-- We should also add a screenshot of a filled out set of parameters. -->

    - **Subscription:** select the Azure subscription you used to create your private mobile network.
    - **Resource group:** select the resource group containing the Mobile Network resource representing your private mobile network.
    - **Region:** select **East US**.
    - **Location:** leave this field unchanged.
    - **Existing Mobile Network Name:** enter the name of the Mobile Network resource representing your private mobile network.
    - **SIM resources:** paste in the array you prepared in [Prepare an array for your SIMs](#prepare-an-array-for-your-sims).

    :::image type="content" source="media/provision-sims-arm-template/sims-arm-template-configuration-fields.png" alt-text="Screenshot of the Azure portal showing the configuration fields for the SIMs ARM template.":::

1. Select **Review + create**.
1. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

     If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once your configuration has been validated, you can select **Create** to provision your SIMs. The Azure portal will display a confirmation screen when the SIMs have been provisioned.


## Review deployed resources

1. Select **Go to resource group**.

    :::image type="content" source="media/template-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing a deployment confirmation for the ARM template.":::

1. Confirm that your SIMs have been created in the resource group.

    :::image type="content" source="media/provision-sims-arm-template/sims-resource-group.png" alt-text="Screenshot of the Azure portal showing a resource group containing newly provisioned SIMs.":::

## Next steps

You'll need to assign a SIM policy to your SIMs to bring them into service.
<!-- we may want to update the template to include SIM policies, or update the link below to reference the ARM template procedure rather than the portal -->

- [Configure a SIM policy for Azure Private 5G Core Preview - Azure portal](configure-sim-policy-azure-portal.md)
- [Assign a SIM policy to a SIM](provision-sims-azure-portal.md#assign-sim-policies)
