---
title: Deploy a private mobile network - ARM template
titleSuffix: Azure Private 5G Core Preview
description: This how-to guide shows how to deploy a private mobile network through Azure Private 5G Core Preview using an Azure Resource Manager template. 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 03/16/2022
ms.custom: template-how-to
---

# Deploy a private mobile network through Azure Private 5G Core Preview - ARM template

Private mobile networks provide high performance, low latency, and secure connectivity for 5G Internet of Things (IoT) devices. In this how-to guide, you'll use an Azure Resource Manager template (ARM template) to deploy a private mobile network to match your enterprise's requirements.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-create-mobile-network%2Fazuredeploy.json)

## Prerequisites

- Complete all of the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor or Owner role at the subscription scope.
- Collect all of the information listed in [Collect the required information to deploy a private mobile network - Azure portal](collect-required-information-for-private-mobile-network.md).

## Review the template

<!--
Need to confirm whether the following link is correct.
-->

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/mobilenetwork-create-mobile-network).

:::code language="json" source="~/quickstart-templates/mobilenetwork-create-mobile-network/azuredeploy.json":::

Three Azure resources are defined in the template.

- [**Microsoft.MobileNetwork/mobileNetworks**](/azure/templates/microsoft.mobilenetwork/mobilenetworks): a resource representing the private mobile network as a whole.
- [**Microsoft.MobileNetwork/mobileNetworks/dataNetworks**](/azure/templates/microsoft.mobilenetwork/mobilenetworks/datanetworks): a resource representing a data network.
- [**Microsoft.MobileNetwork/mobileNetworks/slices**](/azure/templates/microsoft.mobilenetwork/mobilenetworks/slices): a resource representing a network slice.

## Deploy the template

1. Select the following link to sign in to Azure and open a template.

    [![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-create-mobile-network%2Fazuredeploy.json)


1. Select or enter the following values, using the information you retrieved in [Prerequisites](#prerequisites).

    - **Subscription:** select the Azure subscription you want to use to create your private mobile network.
    - **Resource group:** create a new resource group.
    - **Region:** select **East US**.
    - **Location:** leave this field unchanged.
    - **Mobile Network Name:** enter a name for the private mobile network.
    - **Mobile Country Code:** enter the mobile country code for the private mobile network.
    - **Mobile Network Code:** enter the mobile network code for the private mobile network.
    - **Slice Name:** leave this field unchanged.
    - **Data Network Name:** enter the name of the data network to which the private mobile network will connect. 

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-arm-template\mobile-network-arm-template-configuration-fields.png" alt-text="Screenshot of the Azure portal showing the configuration fields for the private mobile network ARM template":::

1. Select **Review + create**.
1. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation. 

    If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once your configuration has been validated, you can select **Create** to create the private mobile network. The Azure portal will display a confirmation screen when the private mobile network has been created.

## Review deployed resources

1. On the confirmation screen, select **Go to resource group**.

    :::image type="content" source="media/template-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing a deployment confirmation for the ARM template.":::

1. Confirm that the resource group contains the correct **Mobile Network**, **Slice** and **Data Network** resources.


    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-arm-template\mobile-network-resource-group.png" alt-text="Screenshot of the Azure portal showing a resource group containing newly provisioned SIMs.":::

## Next steps

You can either begin designing policy control to determine how your private mobile network will handle traffic, or you can start adding sites to your private mobile network.

- [Learn more about designing the policy control configuration for your private mobile network](policy-control.md)
- [Collect the required information for a site](collect-required-information-for-a-site.md)