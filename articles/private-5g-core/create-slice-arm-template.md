---
title: Create a slice - ARM template
titleSuffix: Azure Private 5G Core
description: This how-to guide shows how to create a slice in your private mobile network using an Azure Resource Manager (ARM) template. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 09/30/2022
ms.custom: template-how-to, devx-track-arm-template
---

# Create a slice using an ARM template

*Network slices* allow you to host multiple independent logical networks in the same Azure Private 5G Core deployment. Slices are assigned to SIM policies and static IP addresses, providing isolated end-to-end networks that can be customized for different bandwidth and latency requirements.

In this how-to guide, you'll learn how to create a slice in your private mobile network using an Azure Resource Manager template (ARM template). You can configure a slice/service type (SST) and slice differentiator (SD) for slices associated with SIMs that will be provisioned on a 5G site. If a SIM is provisioned on a 4G site, the slice associated with its SIM policy must contain an empty SD and a value of 1 for the SST.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-create-new-slice%2Fazuredeploy.json)

## Prerequisites

- Identify the name of the Mobile Network resource corresponding to your private mobile network.
- Collect the information in [Collect the required information for a network slice](collect-required-information-for-private-mobile-network.md#collect-the-required-information-for-a-network-slice). If the slice will be used by 4G UEs, you don't need to collect SST and SD values.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- Navigate to your **Packet Core Control Plane** resource and make sure that the **Packet core installation state** field contains **Succeeded**. This to avoid errors when managing your network slices by ensuring no other processes are running. If you just finished running a process, it may take a few minutes for the **Packet core installation state** field to update.

## Review the template

The template used in this how-to guide is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/mobilenetwork-create-new-slice).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.mobilenetwork/mobilenetwork-create-new-slice/azuredeploy.json":::

The following Azure resource is defined in the template.

- [**Microsoft.MobileNetwork/mobileNetworks/slices**](/azure/templates/microsoft.mobilenetwork/mobilenetworks/slices): a resource representing a network slice.

## Deploy the template

1. Select the following link to sign in to Azure and open the template.

    [![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-create-new-slice%2Fazuredeploy.json)
 

2. Select or enter the following values, using the information you retrieved in [Prerequisites](#prerequisites).

    | Field | Value |
    |--|--|
    | **Subscription** | Select the Azure subscription you used to create your private mobile network. |
    | **Resource group** | Select the resource group containing the mobile network resource representing your private mobile network. |
    | **Region** | Select the region in which you deployed the private mobile network. |
    | **Location** | Enter the [code name](region-code-names.md) of the region in which you deployed the private mobile network. |
    | **Existing Mobile Network Name** | Enter the name of the Mobile Network resource representing your private mobile network. |
    | **Slice Name** | Enter the name of the network slice. |
    | **Sst** | Enter the slice/service type (SST) value. If the slice will be used by 4G UEs, enter a value of 1. |
    | **Sd** | Enter the slice differentiator (SD) value. If the slice will be used by 4G UEs, leave this field blank. |

3. Select **Review + create**.
4. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

    If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

5. Once your configuration has been validated, you can select **Create** to create the slice. The Azure portal will display a confirmation screen when the slice has been created.

## Review deployed resources

1. On the confirmation screen, select **Go to resource group**.

    :::image type="content" source="media/template-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing a deployment confirmation for the ARM template.":::

1. Confirm that the resource group contains a new **Slice** resource representing the network slice.

## Next steps

- See [Collect the required information for a site](collect-required-information-for-a-site.md) for the information you need to collect to provision a site.
- See [Policy control](policy-control.md) to learn more about designing the policy control configuration for your private mobile network.
