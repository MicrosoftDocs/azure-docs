---
title: Configure a SIM policy
titleSuffix: Azure Private 5G Core
description: With this how-to guide, learn how to configure a SIM policy for Azure Private 5G Core through the Azure portal. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 01/16/2022
ms.custom: template-how-to
---

# Configure a SIM policy for Azure Private 5G Core - Azure portal

*SIM policies* allow you to define different sets of policies and interoperability settings that can each be assigned to a group of SIMs. The SIM policy also defines the default Quality of Service settings for any services that use the policy. You'll need to assign a SIM policy to a SIM before the user equipment (UE) using that SIM can access the private mobile network. In this how-to-guide, you'll learn how to configure a SIM policy.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
- Identify the name of the Mobile Network resource corresponding to your private mobile network.
- Collect all the configuration values in [Collect the required information for a SIM policy](collect-required-information-for-sim-policy.md) for your chosen SIM policy.
- Decide whether you want to assign this SIM policy to any SIMs as part of configuring it. If you do, you must have already provisioned the SIMs (as described in [Provision SIMs - Azure portal](provision-sims-azure-portal.md)).

## Configure the SIM policy

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network for which you want to configure a SIM policy.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the **Resource** menu, select **SIM policies**.

    :::image type="content" source="media/configure-sim-policy-azure-portal/sim-policies-resource-menu-option.png" alt-text="Screenshot of the Azure portal. It shows the SIM policies option in the resource menu of a Mobile Network resource.":::

1. In the **Command** bar, select **Create**.
1. Fill out the fields under **Create a SIM policy** using the information you collected from [Collect top-level setting values](collect-required-information-for-sim-policy.md#collect-top-level-setting-values).

1. Select **Add a network scope**.

    :::image type="content" source="media/configure-sim-policy-azure-portal/sim-policy-basics-tab.png" alt-text="Screenshot of the Azure portal. It shows the basics tab for a SIM policy. The Add a network scope button is highlighted.":::

1. Under **Add a network scope** on the right, fill out each of the fields using the information you collected from [Collect information for the network scope](collect-required-information-for-sim-policy.md#collect-information-for-the-network-scope).  
SIM policies also define the default QoS settings for any services that use the policy. You can override the default SIM policy QoS settings on a per-service basis - see [Configure basic settings for the service](configure-service-azure-portal.md#configure-basic-settings-for-the-service).
1. Select **Add**.

    :::image type="content" source="media/configure-sim-policy-azure-portal/add-a-network-scope.png" alt-text="Screenshot of the Azure portal. It shows the Add a network scope screen. The Add button is highlighted.":::

1. Under the **Network scope** heading, confirm that your new network scope has the correct configuration.

    :::image type="content" source="media/configure-sim-policy-azure-portal/network-scope-configuration.png" alt-text="Screenshot of the Azure portal. It shows the Create a SIM policy screen. The Network scope section is highlighted.":::

1. If you want to assign this SIM policy to one or more existing provisioned SIMs, select **Next : Assign to SIMs**, and then select your chosen SIMs from the list that appears. You can choose to search this list based on any field, including SIM name, SIM group, and device type.

    :::image type="content" source="media/configure-sim-policy-azure-portal/assign-to-sims-tab.png" alt-text="Screenshot of the Azure portal. It shows the Assign to SIMs tab for a SIM policy.":::

1. Select **Next : Review + create**.
1. Confirm that the configuration for the SIM policy is correct. If the configuration isn't valid, you'll see an error message and the configuration tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

    Once your configuration has been validated, you can select the **Review + create** option to create your SIM policy.

    :::image type="content" source="media/configure-sim-policy-azure-portal/sim-policy-review-and-create-tab.png" alt-text="Screenshot of the Azure portal. It shows the Review and create tab for a SIM policy. The Review and create option is highlighted.":::

1. The Azure portal will display the following confirmation screen when the SIM policy has been created.

    :::image type="content" source="media/configure-sim-policy-azure-portal/sim-policy-deployment-confirmation.png" alt-text="Screenshot of the Azure portal. It shows confirmation of the successful deployment of a SIM policy.":::

1. Select **Go to resource group**. In the resource group that appears, select the **Mobile Network** resource representing your private mobile network. 
1. In the resource menu, select **SIM policies**.

    :::image type="content" source="media/configure-sim-policy-azure-portal/sim-policies-resource-menu-option.png" alt-text="Screenshot of the Azure portal. It shows the SIM policies option in the resource menu of a Mobile Network resource.":::

1. Select your new SIM policy from the list.

    :::image type="content" source="media/sim-policies-list.png" alt-text="Screenshot of the Azure portal. It shows a list of currently configured SIM policies for a private mobile network." lightbox="media/sim-policies-list.png":::

1. Check the configuration of your SIM policy to ensure it's correct. 

    :::image type="content" source="media/configure-sim-policy-azure-portal/sim-policy-resource.png" alt-text="Screenshot of the Azure portal showing a SIM policy resource." lightbox="media/configure-sim-policy-azure-portal/sim-policy-resource.png":::

## Next steps

- [Learn more about policy control](policy-control.md)
