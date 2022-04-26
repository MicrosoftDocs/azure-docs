---
title: Deploy a private mobile network
titleSuffix: Azure Private 5G Core Preview
description: This how-to guide shows how to deploy a private mobile network through Azure Private 5G Core Preview using the Azure portal 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/03/2022
ms.custom: template-how-to
---

# Deploy a private mobile network through Azure Private 5G Core Preview - Azure portal

Private mobile networks provide high performance, low latency, and secure connectivity for 5G Internet of Things (IoT) devices. In this how-to guide, you'll use the Azure portal to deploy a private mobile network to match your enterprise's requirements.

You'll create the following resources as part of this how-to guide:

- The Mobile Network resource representing your private mobile network as a whole.
- (Optionally) SIM resources representing the physical SIMs or eSIMs that will be served by the private mobile network.

## Prerequisites

- Complete all of the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor or Owner role at the subscription scope.
- Collect all of the information listed in [Collect the required information to deploy a private mobile network - Azure portal](collect-required-information-for-private-mobile-network.md).
- If you decided when collecting the information in [Collect the required information to deploy a private mobile network - Azure portal](collect-required-information-for-private-mobile-network.md) that you wanted to provision SIMs using a JSON file as part of deploying your private mobile network, you must have prepared this file and made it available on the machine you'll use to access the Azure portal. For more information on the file format, see [Provision SIM resources through the Azure portal using a JSON file](collect-required-information-for-private-mobile-network.md#provision-sim-resources-through-the-azure-portal-using-a-json-file).

## Create the Mobile Network and (optionally) SIM resources
In this step, you'll create the Mobile Network resource representing your private mobile network as a whole. You can also provision one or more SIMs.

1. Sign in to the Azure portal at [https://aka.ms/AP5GCPortal](https://aka.ms/AP5GCPortal).
1. In the **Search** bar, type *mobile networks* and then select the **Mobile Networks** service from the results that appear.

    :::image type="content" source="media/mobile-networks-search.png" alt-text="Screenshot of the Azure portal showing a search for the Mobile Networks service." lightbox="media/mobile-networks-search.png":::

1. On the **Mobile Networks** page, select **Create**.

    :::image type="content" source="media/create-button-mobile-networks.png" alt-text="Screenshot of the Azure portal showing the Create button on the Mobile Networks page.":::

1. Use the information you collected in [Collect private mobile network resource values](collect-required-information-for-private-mobile-network.md#collect-mobile-network-resource-values) to fill out the fields on the **Basics** configuration tab. Once you've done this, select **Next : SIMs >**.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-private-mobile-network-basics-tab.png" alt-text="Screenshot of the Azure portal showing the Basics configuration tab.":::

1. On the **SIMs** configuration tab, select your chosen input method by selecting the appropriate option next to **How would you like to input the SIMs information?**. You can then input the information you collected in [Collect SIM values](collect-required-information-for-private-mobile-network.md#collect-sim-values).

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-private-mobile-network-sims-tab.png" alt-text="Screenshot of the Azure portal showing the SIMs configuration tab.":::

    - If you select **Upload JSON file**, the **Upload SIM profile configurations** field will appear. Use this field to upload your chosen JSON file.
    - If you select **Add manually**, a new set of fields will appear under **Enter SIM profile configurations**. Fill out the first row of these fields with the correct settings for the first SIM you want to provision. If you've got more SIMs you want to provision, add the settings for each of these SIMs to a new row.
    - If you decided that you don't want to provision any SIMs at this point, select **Add SIMs later**.

1. Once you've selected the input method and provided information for any SIMs you want to provision, select **Review + create**.
1. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-private-mobile-network-review-create-tab.png" alt-text="Screenshot of the Azure portal showing validated configuration for a private mobile network.":::

    If the validation fails, you'll see an error message and the configuration tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once the configuration has been validated, select **Create** to create the Mobile Network resource and any SIM resources.
1. The Azure portal will now deploy the resources into your chosen resource group. You'll see the following confirmation screen when your deployment is complete.

    :::image type="content" source="media/pmn-deployment-complete.png" alt-text="Screenshot of the Azure portal. It shows confirmation of the successful creation of a private mobile network.":::

    Select **Go to resource group**, and then check that your new resource group contains the correct **Mobile Network** resource, any **SIM** resources, and a default **Service** resource named **Allow-all-traffic**.

    :::image type="content" source="media/pmn-deployment-resource-group.png" alt-text="Screenshot of the Azure portal showing a resource group containing Mobile Network and Service resources.":::

## Next steps

You can either begin designing policy control to determine how your private mobile network will handle traffic, or you can start adding sites to your private mobile network.

- [Learn more about designing the policy control configuration for your private mobile network](policy-control.md)
- [Collect the required information for a site](collect-required-information-for-a-site.md)
