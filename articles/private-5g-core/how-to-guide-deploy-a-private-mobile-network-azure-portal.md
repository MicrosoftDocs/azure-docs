---
title: Deploy a private mobile network - Azure portal
description: Learn how to deploy a private mobile network through Azure Private 5G Core Preview using the Azure portal 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/03/2021
ms.custom: template-how-to
---

# Deploy a private mobile network through Azure Private 5G Core Preview - Azure portal

Azure Private 5G Core Preview is an Azure cloud service for service providers and system integrators to securely deploy and manage private mobile networks for enterprises on Azure Arc-connected edge platforms such as an Azure Stack Edge device. In this how-to guide, you'll use the Azure portal to deploy a private mobile network to match your enterprise's requirements.

You'll create the following as part of this how-to guide.

- The Mobile Network resource representing your private mobile network as a whole.
- The Site resource representing the physical enterprise location of your Azure Stack Edge device, which will host the packet core instance.
- (Optionally) SIM resources representing the physical SIMs or eSIMs that will be served by the private mobile network.


## Prerequisites

- Complete all of the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
- Collect all of the information listed in [Collect the required information to deploy a private mobile network - Azure portal](collect-required-information-for-private-mobile-network.md).
- If you decided when collecting the information in [Collect the required information to deploy a private mobile network - Azure portal](collect-required-information-for-private-mobile-network.md) that you wanted to provision SIMs using a JSON file as part of deploying your private mobile network, you must have prepared this file and made it available on the machine you will use to access the Azure portal. You can find more information on the format of this file in [Provisioning SIM resources through the Azure portal using a JSON file](collect-required-information-for-private-mobile-network.md#provisioning-sim-resources-through-the-azure-portal-using-a-json-file) if necessary.
- Request a product key from your support representative.
- Decide on the Log Analytics workspace you want to use for the Kubernetes cluster. For more information on Log Analytics, see [Overview of Log Analytics in Azure Monitor](/azure/azure-monitor/logs/log-analytics-overview). You can choose from the following options.
  - A new Log Analytics workspace, which you will create as part of this procedure.
  - An existing Log Analytics workspace. If you select this option, you must know the resource ID of your chosen Log Analytics workspace. You can find this by navigating to the Log Analytics workspace in the Azure portal, selecting **Properties** from the left hand menu and then copying the value of the **Resource ID** field.
  - The default Log Analytics workspace for your subscription in the Azure region in which you are creating the resources for your private mobile network.

## Create the mobile network and (optionally) SIM resources
In this step, you will create the mobile network resource representing your private mobile network as a whole. You can also provision one or more SIMs.

1. Sign in to the Azure portal at [https://aka.ms/AP5GCPortal](https://aka.ms/AP5GCPortal).
1. In the Search bar, type *mobile networks* and then select the **Mobile Networks** service from the results that appear.

    :::image type="content" source="media/mobile-networks-search.png" alt-text="Screenshot of the Azure portal showing a search for the Mobile Networks service." lightbox="media/mobile-networks-search.png":::

1. On the Mobile Networks page, click **Create**.

    :::image type="content" source="media/create-button-mobile-networks.png" alt-text="Screenshot of the Azure portal showing the Create button on the Mobile Networks page.":::

1. Use the information you collected in [Collect private mobile network resource configuration values](collect-required-information-for-private-mobile-network.md#collect-private-mobile-network-resource-configuration-values) to fill out the fields on the **Basics** configuration tab. Once you have done this, select **Next : SIMs >**.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-private-mobile-network-basics-tab.png" alt-text="Screenshot of the Azure portal showing the Basics configuration tab.":::

1. On the SIMs configuration tab, select your chosen input method by selecting the appropriate radio button next to **How would you like to input the SIMs information?**. You can then input the information you collected in [Collect SIM resource values](collect-required-information-for-private-mobile-network.md#collect-sim-resource-configuration-values).

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-private-mobile-network-sims-tab.png" alt-text="Screenshot of the Azure portal showing the SIMs configuration tab.":::

    - If you select **Upload JSON file**, the **Upload SIM profile configurations** field will appear. Use this field to upload your chosen JSON file.
    - If you select **Add manually**, a new set of fields will appear under **Enter SIM profile configurations**. Fill out the first row of these fields with the correct settings for the first SIM you want to provision. If you have further SIMs you want to provision, add the settings for each of these SIMs to a new row.
    - If you decided that you do not want to provision any SIMs at this point, select **Add SIMs later**.

1. Once you have selected the appropriate radio button and provided information for any SIMs you want to provision, select **Review + create**.
1. Azure will now validate the configuration values you have entered. You should see a message indicating that your values have passed validation, as shown below.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-private-mobile-network-review-create-tab.png" alt-text="Screenshot of the Azure portal showing validated configuration for a private mobile network.":::

    If the validation fails, you will see an error message and the configuration tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once the configuration has been validated, select **Create** to create the private mobile network resource and any SIM resources.
1. The Azure portal will now deploy the resources into your chosen resource group. You will see the following confirmation screen when your deployment is complete.

    :::image type="content" source="media/pmn-deployment-complete.png" alt-text="Screenshot of the Azure portal. It shows confirmation of the successful creation of a private mobile network..":::

    Select **Go to resource group**, and then check that your new resource group contains the correct **Mobile Network** resource, any **SIM** resources, and a default **Service** resource named **Allow-all-traffic**.

    :::image type="content" source="media/pmn-deployment-resource-group.png" alt-text="Screenshot of the Azure portal showing a resource group containing Mobile Network and Service resources.":::

1. Once you have confirmed that the correct resources are displayed, select the name of the **Mobile Network** resource and move to the next step.

## Create the site resource

In this step, you will create the site resource representing the physical enterprise location of your Azure Stack Edge device, which will host the packet core instance.

1. On the **Get started** tab, select **Create sites**.

    :::image type="content" source="media/create-sites-button.png" alt-text="Screenshot of the Azure portal showing the Get started tab, with the Create sites button highlighted.":::

1. Use the information you collected in [Collect site resource configuration values](collect-required-information-for-private-mobile-network.md#collect-site-resource-configuration-values) to fill out the fields on the **Basics** configuration tab, and then select **Next : Packet core >**.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-site-basics-tab.png" alt-text="Screenshot of the Azure portal showing the Basics configuration tab for a site resource.":::

1. You will now see the **Packet core** configuration tab.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-site-packet-core-tab.png" alt-text="Screenshot of the Azure portal showing the Packet core configuration tab for a site resource.":::

1. In the **Packet core** section, ensure **Technology type** is set to *5G*, and then leave the **Version** and **Custom location** fields blank unless you have been instructed to do otherwise by your support representative.
1. Use the information you collected in [Collect access network configuration values](collect-required-information-for-private-mobile-network.md#collect-access-network-configuration-values) to fill out the fields in the **Access network** section. Note the following.

    - You must use the same value for both the **N2 subnet** and **N3 subnet** fields.
    - You must use the same value for both the **N2 gateway** and **N3 gateway** fields.

1. Use the information you collected in [Collect attached data network configuration values](collect-required-information-for-private-mobile-network.md#collect-attached-data-network-configuration-values) to fill out the fields in the **Attached data networks** section. Note that you can only connect the packet core instance to a single data network.
1. Select **Review + create**.
1. Azure will now validate the configuration values you have entered. You should see a message indicating that your values have passed validation, as shown below.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/create-site-validation.png" alt-text="Screenshot of the Azure portal showing successful validation of configuration values for a site resource.":::

    If the validation fails, you will see an error message and the configuration tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once your configuration has been validated, you can select **Create** to create the site. The Azure portal will display the following confirmation screen when the site has been created.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a site.":::

1. Click on **Go to resource group**, and confirm that it contains the following new resources.

    - A **mobile network site** resource representing the site as a whole.
    - A **packet core control plane** resource representing the control plane function of the packet core instance in the site.
    - A **packet core data plane** resource representing the data plane function of the packet core instance in the site.
    - An **attached data network** resource representing the site's view of the data network.

    :::image type="content" source="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/site-and-related-resources.png" alt-text="Screenshot of the Azure portal showing a resource group containing a site and its related resources." lightbox="media/how-to-guide-deploy-a-private-mobile-network-azure-portal/site-and-related-resources.png":::

1. Once you have confirmed this, keep the resource group displayed in the Azure portal and move to the next step.

## Verify that your Azure Stack Edge Pro cluster resources have been created and that the connection is active

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).
1. Search for and select the resource group created when commissioning the cluster. 
1. Check the contents of the resource group to confirm that it contains **Custom Location** and **Kubernetes - Azure Arc** resources. 
1. Make a note of the name of the **Custom location** resource. You will need this in the next step.
1. Select the **Kubernetes - Azure Arc** resource and confirm that the **Status** field is set to **Connected**.

    :::image type="content" source="media/kubernetes-azure-arc-resource.png" alt-text="Screenshot of the Azure portal showing the Status field on a Kubernetes - Azure Arc resource." lightbox="media/kubernetes-azure-arc-resource.png":::

## Configure the custom location

1. In the Azure portal, search for and select the **Mobile network** resource corresponding to your private mobile network.
1. In the resource menu, select **Sites**.
1. Select the **Mobile network site** resource corresponding to the site in which the packet core instance is located.

    :::image type="content" source="media/select-site.png" alt-text="Screenshot of the Azure portal showing the available sites in the private mobile network." lightbox="media/select-site.png":::

1. Select **Configure a custom location**.

    :::image type="content" source="media/configure-a-custom-location.png" alt-text="Screenshot of the Azure portal showing the Configure a custom location option.":::

1. On the **Configuration** tab, select the **Custom location** resource you identified in [Verify that the correct resources have been created and that the connection is active](#verify-that-the-correct-resources-have-been-created-and-that-the-connection-is-active) from the **Custom ARC location** drop down menu. You must ensure that you select the correct resource, as this cannot be reversed once you have applied it.
1. Select **Apply**.
1. Return to the **Mobile network site** resource and confirm that the **Edge custom location** field is now displaying the correct **Custom location** resource.

    :::image type="content" source="media/configured-custom-location.png" alt-text="Screenshot of the Azure portal showing a correctly configured custom location on a site.":::

## Next steps

- [Learn more about designing the policy control configuration for your private mobile network](policy-control.md)