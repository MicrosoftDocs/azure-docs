---
title: Create a site - Azure portal
titleSuffix: Azure Private 5G Core Preview
description: This how-to guide shows how to create a site in your private mobile network. 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/27/2022
ms.custom: template-how-to 
---

# Create a site using the Azure portal

Azure Private 5G Core Preview private mobile networks include one or more *sites*. Each site represents a physical enterprise location (for example, Contoso Corporation's Chicago factory) containing an Azure Stack Edge device that hosts a packet core instance. In this how-to guide, you'll learn how to create a site in your private mobile network using the Azure portal.

## Prerequisites

- Carry out the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md) for your new site.
- Collect all of the information in [Collect the required information for a site](collect-required-information-for-a-site.md).
- Refer to the release notes for the current version of packet core, and whether it's supported by the version your Azure Stack Edge (ASE) is currently running. If your ASE version is incompatible with the latest packet core, [update your Azure Stack Edge Pro GPU](/azure/databox-online/azure-stack-edge-gpu-install-update).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## Create the mobile network site resource

In this step, you'll create the mobile network site resource representing the physical enterprise location of your Azure Stack Edge device, which will host the packet core instance.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network to which you want to add a site.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a mobile network resource.":::

1. On the **Get started** tab, select **Create sites**.

    :::image type="content" source="media/create-sites-button.png" alt-text="Screenshot of the Azure portal showing the Get started tab, with the Create sites button highlighted.":::

1. Use the information you collected in [Collect site resource values](collect-required-information-for-a-site.md#collect-mobile-network-site-resource-values) to fill out the fields on the **Basics** configuration tab, and then select **Next : Packet core >**.

    :::image type="content" source="media/create-a-site/create-site-basics-tab.png" alt-text="Screenshot of the Azure portal showing the Basics configuration tab for a site resource.":::

1. You'll now see the **Packet core** configuration tab.

    :::image type="content" source="media/create-a-site/create-site-packet-core-tab.png" alt-text="Screenshot of the Azure portal showing the Packet core configuration tab for a site resource.":::

1. In the **Packet core** section, set the fields as follows:

    >[!IMPORTANT]
    > If you're configuring your packet core to have more than one attached data network, leave the **Custom location** field blank. You'll configure this field at the end of this procedure.

    - Use the information you collected in [Collect packet core configuration values](collect-required-information-for-a-site.md#collect-packet-core-configuration-values) to fill out the **Technology type**, **Azure Stack Edge device**, and **Custom location** fields.
    - Select the recommended packet core version in the **Version** field.

    > [!NOTE]
    > If a warning appears about an incompatibility between the selected packet core version and the current Azure Stack Edge version, you'll need to update ASE first. Select **Upgrade ASE** from the warning prompt and follow the instructions in [Update your Azure Stack Edge Pro GPU](/azure/databox-online/azure-stack-edge-gpu-install-update). Once you've finished updating your ASE, go back to the beginning of this step to create the site resource.

    - Ensure **AKS-HCI** is selected in the **Platform** field.

1. Use the information you collected in [Collect access network values](collect-required-information-for-a-site.md#collect-access-network-values) to fill out the fields in the **Access network** section. Note:

    - **ASE N2 virtual subnet** and **ASE N3 virtual subnet** (if this site will support 5G UEs) or **ASE S1-MME virtual subnet** and **ASE S1-U virtual subnet** (if this site will support 4G UEs) must match the corresponding virtual network names on port 5 on your Azure Stack Edge Pro device.

1. In the **Attached data networks** section, select **Attach data network**. Choose whether you want to use an existing data network or create a new one, then use the information you collected in [Collect data network values](collect-required-information-for-a-site.md#collect-data-network-values) to fill out the fields. Note the following:
    - **ASE N6 virtual subnet** (if this site will support 5G UEs) or **ASE SGi virtual subnet** (if this site will support 4G UEs) must match the corresponding virtual network name on port 6 on your Azure Stack Edge Pro device.
    - If you decided not to configure a DNS server, clear the **Specify DNS addresses for UEs?** checkbox.

    :::image type="content" source="media/create-a-site/create-site-attach-data-network.png" alt-text="Screenshot of the Azure portal showing the Attach data network screen.":::

    Once you've finished filling out the fields, select **Attach**.

1. Repeat the previous step for each additional data network you want to configure.
1. If you decided you want to provide a custom HTTPS certificate in [Collect local monitoring values](collect-required-information-for-a-site.md#collect-local-monitoring-values), select **Next : Local access >**. If you decided not to provide a custom HTTPS certificate at this stage, you can skip this step.
    
    1. Under **Provide custom HTTPS certificate?**, select **Yes**.
    1. Use the information you collected in [Collect local monitoring values](collect-required-information-for-a-site.md#collect-local-monitoring-values) to select a certificate.

    :::image type="content" source="media/create-a-site/create-site-local-access-tab.png" alt-text="Screenshot of the Azure portal showing the Local access configuration tab for a site resource.":::

1. Select **Review + create**.
1. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

    :::image type="content" source="media/create-a-site/create-site-validation.png" alt-text="Screenshot of the Azure portal showing successful validation of configuration values for a site resource.":::

    If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

1. Once your configuration has been validated, you can select **Create** to create the site. The Azure portal will display the following confirmation screen when the site has been created.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a site.":::

1. Select **Go to resource group**, and confirm that it contains the following new resources:

    - A **Mobile Network Site** resource representing the site as a whole.
    - A **Packet Core Control Plane** resource representing the control plane function of the packet core instance in the site.
    - A **Packet Core Data Plane** resource representing the data plane function of the packet core instance in the site.
    - One or more **Data Network** resources representing the data networks (if you chose to create new data networks).
    - One or more **Attached Data Network** resources providing configuration for the packet core instance's connection to the data networks.
  
    :::image type="content" source="media/create-a-site/site-related-resources.png" alt-text="Screenshot of the Azure portal showing a resource group containing a site and its related resources." lightbox="media/create-a-site/site-related-resources.png":::

15. If you have not yet set the **Custom location** field, set it now. From the resource group overview, select the **Packet Core Control Plane** resource and select **Configure a custom location**. Use the information you collected in [Collect packet core configuration values](collect-required-information-for-a-site.md#collect-packet-core-configuration-values) to fill out the **Custom location** field and select **Modify**.

## Next steps

If you haven't already done so, you should now design the policy control configuration for your private mobile network. This allows you to customize how your packet core instances apply quality of service (QoS) characteristics to traffic. You can also block or limit certain flows.

- [Learn more about designing the policy control configuration for your private mobile network](policy-control.md)
