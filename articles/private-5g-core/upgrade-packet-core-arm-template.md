---
title: Upgrade a packet core instance - ARM template
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to upgrade a packet core instance using an Azure Resource Manager template (ARM template). 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 05/16/2022
ms.custom: template-how-to
---

# Upgrade the packet core instance in a site - ARM template

Each Azure Private 5G Core Preview site contains a packet core instance, which is a cloud-native implementation of the 3GPP standards-defined 5G Next Generation Core (5G NGC or 5GC). You'll need to periodically upgrade your packet core instances to get access to the latest Azure Private 5G Core features and maintain support for your private mobile network. In this how-to guide, you'll learn how to upgrade a packet core instance using an Azure Resource Manager template (ARM template).

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-update-packet-core-control-plane%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-update-packet-core-control-plane%2FcreateUiDefinition.json)

## Prerequisites

- Contact your Microsoft assigned trials engineer. They'll guide you through the upgrade process and provide you with the required information, including the amount of time you'll need to allow for the upgrade to complete and the new software version number.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- Identify the name of the site that hosts the packet core instance you want to upgrade.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/mobilenetwork-update-packet-core-control-plane). To view the template, see [azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.mobilenetwork/mobilenetwork-update-packet-core-control-plane/azuredeploy.json).

The template modifies the version of an existing [**Microsoft.MobileNetwork/packetCoreControlPlanes**](/azure/templates/microsoft.mobilenetwork/packetcorecontrolplanes) resource. This causes an uninstall and reinstall of the packet core with the new resource version - no other resources are modified during this process, unless you change the configuration of the new version. The resource provides configuration for the control plane network functions of the packet core instance, including IP configuration for the N2 interface.

## Deploy the template

1. Select the following link to sign in to Azure and open the template.

    [![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-update-packet-core-control-plane%2Fazuredeploy.json/createUIDefinitionUri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-update-packet-core-control-plane%2FcreateUiDefinition.json)

1. Select or enter the following values, using the information you retrieved in [Prerequisites](#prerequisites).

    - **Subscription:** select the Azure subscription you used to create your private mobile network.
    - **Resource group:** select the resource group containing the mobile network resource representing your private mobile network.
    - **Region:** select **East US**.
    - **Existing packet core:** select the name of the packet core instance you want to upgrade.
    - **Version:** enter the version to which you want to upgrade the packet core instance.

    :::image type="content" source="media/upgrade-packet-core-arm-template/upgrade-arm-template-configuration-fields.png" alt-text="Screenshot of the Azure portal showing the configuration fields for the upgrade ARM template.":::    

1. Select **Review + create**.
1. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

     If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once your configuration has been validated, you can select **Create** to upgrade the packet core instance. The Azure portal will display a confirmation screen when the packet core instance has been upgraded.

## Review deployed resources

1. Select **Go to resource group**.

    :::image type="content" source="media/template-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing a deployment confirmation for the ARM template.":::

1. Select the **Packet Core Control Plane** resource representing the control plane function of the packet core instance in the site.
1. Check the **Version** field under the **Configuration** heading to confirm that it displays the new software version. 

## Next steps
You should use Log Analytics or the packet core dashboards to confirm your packet core instance is operating normally after the upgrade.

- [Monitor Azure Private 5G Core with Log Analytics](monitor-private-5g-core-with-log-analytics.md)
- [Packet core dashboards](packet-core-dashboards.md)
