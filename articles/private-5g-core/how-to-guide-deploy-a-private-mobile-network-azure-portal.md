---
title: Deploy a private mobile network
titlesuffix: Azure Private 5G Core Preview
description: This how-to guide shows how to deploy a private mobile network through Azure Private 5G Core Preview using the Azure portal 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/03/2022
ms.custom: template-how-to
---

# Deploy a private mobile network through Azure Private 5G Core Preview - Azure portal

Azure Private 5G Core Preview is an Azure cloud service for deploying and managing *private mobile networks* for enterprises. Private mobile networks provide high performance, low latency, and secure connectivity for 5G Internet of Things (IoT) devices on an enterprise's premises. In this how-to guide, you'll use the Azure portal to deploy a private mobile network to match your enterprise's requirements.

You'll create the following resources as part of this how-to guide:

- The Mobile Network resource representing your private mobile network as a whole.
- The site resource representing the physical enterprise location of your Azure Stack Edge device, which will host the packet core instance.
- (Optionally) SIM resources representing the physical SIMs or eSIMs that will be served by the private mobile network.


## Prerequisites

- Complete all of the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor or Owner role at the subscription scope.
- Collect all of the information listed in [Collect the required information to deploy a private mobile network - Azure portal](collect-required-information-for-private-mobile-network.md).
- If you decided when collecting the information in [Collect the required information to deploy a private mobile network - Azure portal](collect-required-information-for-private-mobile-network.md) that you wanted to provision SIMs using a JSON file as part of deploying your private mobile network, you must have prepared this file and made it available on the machine you'll use to access the Azure portal. For more information on the file format, see [Provision SIM resources through the Azure portal using a JSON file](collect-required-information-for-private-mobile-network.md#provision-sim-resources-through-the-azure-portal-using-a-json-file).
- Retrieve the name of the resource group you created as part of commissioning the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster on your Azure Stack Edge Pro device. You did this as part of the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).

## Create the Mobile Network and (optionally) SIM resources
In this step, you'll create the Mobile Network resource representing your private mobile network as a whole. You can also provision one or more SIMs.

1. Sign in to the Azure portal at [https://aka.ms/AP5GCPortal](https://aka.ms/AP5GCPortal).
1. In the **Search** bar, type *mobile networks* and then select the **Mobile Networks** service from the results that appear.

    :::image type="content" source="media/mobile-networks-search.png" alt-text="Screenshot of the Azure portal showing a search for the Mobile Networks service." lightbox="media/mobile-networks-search.png":::

1. On the **Mobile Networks** page, select **Create**.

    :::image type="content" source="media/create-button-mobile-networks.png" alt-text="Screenshot of the Azure portal showing the Create button on the Mobile Networks page.":::

1. Use the information you collected in [Collect private mobile network resource values](collect-required-information-for-private-mobile-network.md#collect-private-mobile-network-resource-values) to fill out the fields on the **Basics** configuration tab. Once you've done this, select **Next : SIMs >**.

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

1. Once you've confirmed that the correct resources are displayed, select the name of the **Mobile Network** resource and move to the next step.

## Create the site resource

In this step, you'll create the **Mobile Network Site** resource representing the physical enterprise location of your Azure Stack Edge device, which will host the packet core instance.

1. On the **Get started** tab, select **Create sites**.

    :::image type="content" source="media/create-sites-button.png" alt-text="Screenshot of the Azure portal showing the Get started tab, with the Create sites button highlighted.":::

1. Use the information you collected in [Collect site resource values](collect-required-information-for-private-mobile-network.md#collect-site-resource-values) to fill out the fields on the **Basics** configuration tab, and then select **Next : Packet core >**.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-site-basics-tab.png" alt-text="Screenshot of the Azure portal showing the Basics configuration tab for a site resource.":::

1. You'll now see the **Packet core** configuration tab.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-site-packet-core-tab.png" alt-text="Screenshot of the Azure portal showing the Packet core configuration tab for a site resource.":::

1. In the **Packet core** section, ensure **Technology type** is set to *5G*. Leave the **Version** and **Custom location** fields blank unless you've been told to do otherwise by your support representative.
1. Use the information you collected in [Collect access network values](collect-required-information-for-private-mobile-network.md#collect-access-network-values) to fill out the fields in the **Access network** section. Note the following:

    - You must use the same value for both the **N2 subnet** and **N3 subnet** fields.
    - You must use the same value for both the **N2 gateway** and **N3 gateway** fields.

1. Use the information you collected in [Collect data network values](collect-required-information-for-private-mobile-network.md#collect-data-network-values) to fill out the fields in the **Attached data networks** section. Note that you can only connect the packet core instance to a single data network.
1. Select **Review + create**.
1. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-site-validation.png" alt-text="Screenshot of the Azure portal showing successful validation of configuration values for a site resource.":::

    If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once your configuration has been validated, you can select **Create** to create the site. The Azure portal will display the following confirmation screen when the site has been created.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a site.":::

1. Select **Go to resource group**, and confirm that it contains the following new resources:

    - A **Mobile Network Site** resource representing the site as a whole.
    - A **Packet Core Control Plane** resource representing the control plane function of the packet core instance in the site.
    - A **Packet Core Data Plane** resource representing the data plane function of the packet core instance in the site.
    - An **Attached Data Network** resource representing the site's view of the data network.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/site-and-related-resources.png" alt-text="Screenshot of the Azure portal showing a resource group containing a site and its related resources." lightbox="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/site-and-related-resources.png":::

1. Once you've confirmed this, keep the resource group displayed in the Azure portal and move to the next step.

## Verify that your Azure Stack Edge Pro cluster resources have been created and that the connection is active

1. Search for and select the **Resource group** you created when commissioning the AKS-HCI cluster.
1. Check the contents of the resource group to confirm that it contains **Custom Location** and **Kubernetes - Azure Arc** resources. 
1. Make a note of the name of the **Custom location** resource. You'll need this in the next step.
1. Select the **Kubernetes - Azure Arc** resource and confirm that the **Status** field is set to **Connected**.

    :::image type="content" source="media/kubernetes-azure-arc-resource.png" alt-text="Screenshot of the Azure portal showing the Status field on a Kubernetes - Azure Arc resource." lightbox="media/kubernetes-azure-arc-resource.png":::

## Configure the custom location

1. In the Azure portal, search for and select the **Mobile Network** resource corresponding to your private mobile network.
1. In the **Resource** menu, select **Sites**.
1. Select the **Mobile Network Site** resource corresponding to the site in which the packet core instance is located.

    :::image type="content" source="media/select-site.png" alt-text="Screenshot of the Azure portal showing the available sites in the private mobile network." lightbox="media/select-site.png":::

1. Select **Configure a custom location**.

    :::image type="content" source="media/configure-a-custom-location.png" alt-text="Screenshot of the Azure portal showing the Configure a custom location option.":::

1. On the **Configuration** tab, select the **Custom location** resource you identified in [Verify that your Azure Stack Edge Pro cluster resources have been created and that the connection is active](#verify-that-your-azure-stack-edge-pro-cluster-resources-have-been-created-and-that-the-connection-is-active) from the **Custom ARC location** drop-down menu. You must ensure that you select the correct resource, as this can't be reversed once you've applied it.
1. Select **Apply**.
1. Return to the **Mobile Network Site** resource and confirm that the **Edge custom location** field is now displaying the correct **Custom location** resource.

    :::image type="content" source="media/configured-custom-location.png" alt-text="Screenshot of the Azure portal showing a correctly configured custom location on a site.":::

## Next steps

- [Learn more about designing the policy control configuration for your private mobile network](policy-control.md)
