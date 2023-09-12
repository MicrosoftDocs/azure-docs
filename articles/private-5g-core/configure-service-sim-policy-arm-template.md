---
title: Configure a service and SIM policy - ARM template
titleSuffix: Azure Private 5G Core
description: This how-to guide shows how to configure a service and SIM policy using an Azure Resource Manager (ARM) template. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 03/21/2022
ms.custom: template-how-to, devx-track-arm-template
---

# Configure a service and SIM policy using an ARM template

*Services* and *SIM policies* are the key components of Azure Private 5G Core's customizable policy control, which allows you to provide flexible traffic handling. You can determine exactly how your packet core instance applies quality of service (QoS) characteristics to service data flows (SDFs) to meet your deployment's needs. For more information, see [Policy control](policy-control.md). In this how-to guide, you'll learn how to use an Azure Resource Manager template (ARM template) to create a simple service and SIM policy.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-create-sim-policy%2Fazuredeploy.json)

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- Identify the name of the Mobile Network resource corresponding to your private mobile network and the resource group containing it.
- Identify the Azure region in which you deployed your private mobile network.
- Identify the name of the network slice you want to assign the SIM policy to.
- Identify the name of the data network to which you want to assign the new policy.
- The ARM template is populated with values to configure a default service and SIM policy that allows all traffic in both directions. 

    If you want to create a service and SIM policy for another purpose, use the information in [Collect the required information for a service](collect-required-information-for-service.md) and [Collect the required information for a SIM policy](collect-required-information-for-sim-policy.md) to design a service and SIM policy to meet your requirements. You'll enter these new values as part of deploying the ARM template.

## Review the template

The template used in this how-to guide is from [Azure Quickstart Templates](/samples/azure/azure-quickstart-templates/mobilenetwork-create-sim-policy).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.mobilenetwork/mobilenetwork-create-sim-policy/azuredeploy.json":::

Two Azure resources are defined in the template.

- [**Microsoft.MobileNetwork/mobileNetworks/services**](/azure/templates/microsoft.mobilenetwork/mobilenetworks/services): create a service.
- [**Microsoft.MobileNetwork/mobileNetworks/simPolicies**](/azure/templates/microsoft.mobilenetwork/mobilenetworks/simPolicies): create a SIM policy.

## Deploy the template

1. Select the following link to sign in to Azure and open a template.

    [![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-create-sim-policy%2Fazuredeploy.json)

1. Select or enter the following values, using the information you retrieved in [Prerequisites](#prerequisites).

    - **Subscription:** select the Azure subscription you used to create your private mobile network.
    - **Resource group:** select the resource group containing the Mobile Network resource representing your private mobile network.
    - **Region:** select the region in which you deployed the private mobile network.
    - **Location:** enter the [code name](region-code-names.md) of the region in which you deployed the private mobile network.
    - **Existing Mobile Network Name:** enter the name of the Mobile Network resource representing your private mobile network.
    - **Existing Slice Name:** enter the name of the Slice resource representing your network slice.
    - **Existing Data Network Name:** enter the name of the data network. This value must match the name you used when creating the data network.

1. If you want to use the default service and SIM policy, leave the remaining fields unchanged. Otherwise, fill out the remaining fields to match the service and SIM policy you want to configure, using the information you collected from [Collect the required information for a service](collect-required-information-for-service.md) and [Collect the required information for a SIM policy](collect-required-information-for-sim-policy.md).
1. Select **Review + create**.
1. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

     If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once your configuration has been validated, you can select **Create** to create the service and SIM policy. The Azure portal will display a confirmation screen when the deployment is complete.

## Review deployed resources

1. On the confirmation screen, select **Go to resource group**.

    :::image type="content" source="media/template-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing a deployment confirmation for the ARM template.":::

1. Confirm that your service and SIM policy have been created in the resource group.

    :::image type="content" source="media/configure-service-sim-policy-arm-template\service-and-sim-policy-resource-group.png" alt-text="Screenshot of the Azure portal showing a resource group containing newly provisioned SIMs.":::

## Next steps

You can now assign the SIM policy to your SIMs to bring them into service.

- [Assign a SIM policy to a SIM](manage-existing-sims.md#assign-sim-policies)
