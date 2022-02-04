---
title: Create an additional site
titlesuffix: Azure Private 5G Core Preview
description: This how-to guide shows how to create an additional site in your private mobile network. 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/27/2022
ms.custom: template-how-to 
---

# Create an additional site - Azure Private 5G Core Preview

Azure Private 5G Core private mobile networks include one or more sites. Each site represents a physical enterprise location (for example, Contoso Corporation's Chicago factory) containing an Azure Stack Edge device that hosts a packet core instance. You may want to add new sites to your private mobile network over time. In this how-to guide, you'll learn how to create an additional site in your private mobile network.

## Prerequisites

- Complete steps 3 - 11 of [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md) for the Azure Stack Edge Pro device in your new site.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- Collect all of the information in the following sections for your new site:

    - [Collect site resource values](collect-required-information-for-private-mobile-network.md#collect-site-resource-values)
    - [Collect access network values](collect-required-information-for-private-mobile-network.md#collect-access-network-values)
    - [Collect data network values](collect-required-information-for-private-mobile-network.md#collect-data-network-values)

## Create the site resource

In this step, you'll create the site resource representing the physical enterprise location of your Azure Stack Edge device, which will host the packet core instance.

1. Sign in to the Azure portal at [https://aka.ms/AP5GCPortal](https://aka.ms/AP5GCPortal).
1. Search for and select the Mobile Network resource representing the private mobile network to which you want to add a site.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. On the **Get started** tab, select **Create sites**.

    :::image type="content" source="media/create-sites-button.png" alt-text="Screenshot of the Azure portal showing the Get started tab, with the Create sites button highlighted.":::

1. Use the information you collected in [Collect site resource values](collect-required-information-for-private-mobile-network.md#collect-site-resource-values) to fill out the fields on the **Basics** configuration tab, and then select **Next : Packet core >**.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-site-basics-tab.png" alt-text="Screenshot of the Azure portal showing the Basics configuration tab for a site resource.":::

1. You'll now see the **Packet core** configuration tab.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-site-packet-core-tab.png" alt-text="Screenshot of the Azure portal showing the Packet core configuration tab for a site resource.":::

1. In the **Packet core** section, ensure **Technology type** is set to *5G*, and then leave the **Version** and **Custom location** fields blank unless you've been instructed to do otherwise by your support representative.
1. Use the information you collected in [Collect access network values](collect-required-information-for-private-mobile-network.md#collect-access-network-values) to fill out the fields in the **Access network** section. Note the following:

    - Use the same value for both the **N2 subnet** and **N3 subnet** fields.
    - Use the same value for both the **N2 gateway** and **N3 gateway** fields.

1. Use the information you collected in [Collect data network values](collect-required-information-for-private-mobile-network.md#collect-data-network-values) to fill out the fields in the **Attached data networks** section. Note that you can only connect the packet core instance to a single data network.
1. Select **Review + create**.
1. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-site-validation.png" alt-text="Screenshot of the Azure portal showing successful validation of configuration values for a site resource.":::

    If the validation fails, you'll see an error message and the configuration tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once your configuration has been validated, you can select **Create** to create the site. The Azure portal will display the following confirmation screen when the site has been created.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a site.":::

1. Select **Go to resource group**, and confirm that it contains the following new resources:

    - A **mobile network site** resource representing the site as a whole.
    - A **packet core control plane** resource representing the control plane function of the packet core instance in the site.
    - A **packet core data plane** resource representing the data plane function of the packet core instance in the site.
    - An **attached data network** resource representing the site's view of the data network.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/site-and-related-resources.png" alt-text="Screenshot of the Azure portal showing a resource group containing a site and its related resources." lightbox="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/site-and-related-resources.png":::

1. Once you've confirmed this, keep the resource group displayed in the Azure portal and move to the next step.

## Verify that your Azure Stack Edge Pro cluster resources have been created and that the connection is active

1. Search for and select the resource group you created when commissioning the AKS-HCI cluster. 
1. Check the contents of the resource group to confirm it contains **Custom Location** and **Kubernetes - Azure Arc** resources. 
1. Make a note of the name of the **Custom location** resource. You'll need this in the next step.
1. Select the **Kubernetes - Azure Arc** resource and confirm that the **Status** field is set to **Connected**.

    :::image type="content" source="media/kubernetes-azure-arc-resource.png" alt-text="Screenshot of the Azure portal showing the Status field on a Kubernetes - Azure Arc resource." lightbox="media/kubernetes-azure-arc-resource.png":::

## Configure the custom location

1. In the Azure portal, search for and select the **Mobile network** resource corresponding to your private mobile network.
1. In the resource menu, select **Sites**.
1. Select the **Mobile network site** resource matching the site in which the packet core instance is located.

    :::image type="content" source="media/select-site.png" alt-text="Screenshot of the Azure portal showing the available sites in the private mobile network." lightbox="media/select-site.png":::

1. Select **Configure a custom location**.

    :::image type="content" source="media/configure-a-custom-location.png" alt-text="Screenshot of the Azure portal showing the Configure a custom location option.":::

1. On the **Configuration** tab, select the **Custom location** resource you identified in [Verify that your Azure Stack Edge Pro cluster resources have been created and that the connection is active](#verify-that-your-azure-stack-edge-pro-cluster-resources-have-been-created-and-that-the-connection-is-active) from the **Custom ARC location** drop-down menu. Ensure you select the correct resource, as this can't be reversed once you've applied it.
1. Select **Apply**.
1. Return to the **Mobile network site** resource and confirm that the **Edge custom location** field is now displaying the correct **Custom location** resource.

    :::image type="content" source="media/configured-custom-location.png" alt-text="Screenshot of the Azure portal showing a correctly configured custom location on a site.":::

## Next steps

- [Learn more about designing the policy control configuration for your private mobile network](policy-control.md)
