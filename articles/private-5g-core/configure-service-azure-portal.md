---
title: Configure a service - Azure portal
titleSuffix: Azure Private 5G Core
description: With this how-to guide, learn how to configure a service for Azure Private 5G Core through the Azure portal. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 01/16/2022
ms.custom: template-how-to
---

# Configure a service for Azure Private 5G Core - Azure portal

*Services* are representations of a particular set of QoS information that you want to offer to UEs. For example, you may want to configure a service that provides higher bandwidth limits for particular traffic. You can also use services to block particular traffic types or traffic from specific sources. 
For more information, see [Policy control](policy-control.md).

In this how-to guide, we'll configure a service using the Azure portal.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor or Owner role at the subscription scope.
- Identify the name of the Mobile Network resource corresponding to your private mobile network.
- Collect all the configuration values in [Collect the required information for a service](collect-required-information-for-service.md) for your chosen service.

## Configure basic settings for the service

In this step, you'll configure basic settings for your new service using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network for which you want to configure a service.
:::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::
1. In the **Resource** menu, select **Services**.

    :::image type="content" source="media/configure-service-azure-portal/services-resource-menu-option.png" alt-text="Screenshot of the Azure portal. It shows the Services option in the resource menu of a Mobile Network resource.":::

1. In the **Command** bar, select **Create**.

    :::image type="content" source="media/configure-service-azure-portal/create-command-bar-option.png" alt-text="Screenshot of the Azure portal. It shows the Create option in the command bar.":::

1. On the **Basics** configuration tab, use the information you collected in [Collect top-level setting values](collect-required-information-for-service.md#collect-top-level-setting-values) to fill out each of the fields.  
If you do not want to specify a QoS for this service, turn off the **Configured** toggle. If the toggle is off, the service will inherit the QoS of the parent SIM Policy.

    :::image type="content" source="media/configure-service-azure-portal/create-service-basics-tab.png" alt-text="Screenshot of the Azure portal showing the Basics configuration tab for a service.":::

## Configure data flow policy rules and data flow templates

Now we'll configure the data flow policy rules you want to use for this service. For each rule:

1. On the **Basics** configuration tab, select **Add policy rule**.

   :::image type="content" source="media/configure-service-azure-portal/add-policy-rule-button.png" alt-text="Screenshot of the Azure portal. It shows the Add policy rule button on the Basics configuration tab for a service.":::

1. In **Add policy rule** on the right, use the information you collected in [Data flow policy rule(s)](collect-required-information-for-service.md#data-flow-policy-rules) to fill out the **Rule name**, **Policy rule precedence**, and **Traffic control** fields.

    :::image type="content" source="media\configure-service-azure-portal\add-policy-rule.png" alt-text="Screenshot of the Azure portal showing the Add policy rule fields.":::

1. Do the following for one of the data flow templates you want to apply to this data flow policy rule:
    1. Select **Add data flow template**.
    1. Use the information you collected in [Collect data flow template values](collect-required-information-for-service.md#collect-data-flow-template-values) for your chosen template to fill out the fields in the pop-up.
    
        :::image type="content" source="media/configure-service-azure-portal/add-service-data-flow-template.png" alt-text="Screenshot of the Azure portal showing the Add data flow template pop-up.":::

    1. Select **Add**.
1. Repeat the previous step for any other data flow templates you want to apply to this data flow policy rule.
1. In **Add policy rule** on the right, select **Add**.

    :::image type="content" source="media/configure-service-azure-portal/finalize-policy-rule.png" alt-text="Screenshot of the Azure portal showing the Add button for a new data flow policy rule.":::

1. On the **Basics** configuration tab, confirm that your new rule appears under the **Traffic rules** section.

    :::image type="content" source="media/configure-service-azure-portal/service-with-rules.png" alt-text="Screenshot of the Azure portal. It shows a service with a data flow policy rule configured under the Traffic rules section.":::

1. Repeat this entire step for any other data flow policy rules you want to configure for this service.

## Create the service

We'll now create the service so it can be added to your policy control configuration.

1. On the **Basics** configuration tab, select **Review + create**.
1. You'll now see the **Review + Create** tab. Azure will attempt to validate the configuration values you've entered. If the configuration values are invalid, the **Create** button at the bottom of the **Review + Create** tab will be grayed out. You'll need to return to the **Basics** tab and correct any invalid configuration.
1. When the configuration is valid, the **Create** button will be blue. Select **Create** to create the service.

    :::image type="content" source="media/configure-service-azure-portal/service-review-and-create-tab.png" alt-text="Screenshot of the Azure portal showing the Create button on the Review and create tab for a service.":::

1. The Azure portal will display the following confirmation screen when the service has been created. Select **Go to resource** to see the new service resource.

    :::image type="content" source="media/configure-service-azure-portal/service-resource-deployment-confirmation.png" alt-text="Screenshot of the Azure portal showing the successful deployment of a service resource and the Go to resource button.":::

1. Confirm that the data flow policy rules and data flow templates listed at the bottom of the screen are configured as expected.
:::image type="content" source="media/configure-service-azure-portal/service-resource.png" alt-text="Screenshot of the Azure portal showing a service resource. The data flow policy rules and data flow templates are highlighted." lightbox="media/configure-service-azure-portal/service-resource.png":::

## Next steps

- [Create a SIM policy to which you can assign your new service](configure-sim-policy-azure-portal.md)
