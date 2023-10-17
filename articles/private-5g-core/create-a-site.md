---
title: Create a site - Azure portal
titleSuffix: Azure Private 5G Core
description: This how-to guide shows how to create a site in your private mobile network. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/27/2022
ms.custom: template-how-to 
zone_pivot_groups: ase-pro-version
---

# Create a site using the Azure portal

Azure Private 5G Core private mobile networks include one or more *sites*. Each site represents a physical enterprise location (for example, Contoso Corporation's Chicago factory) containing an Azure Stack Edge device that hosts a packet core instance. In this how-to guide, you'll learn how to create a site in your private mobile network using the Azure portal.

## Prerequisites

- Carry out the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md) for your new site.
- Collect all of the information in [Collect the required information for a site](collect-required-information-for-a-site.md).
- Refer to the release notes for the current version of packet core, and whether it's supported by the version your Azure Stack Edge (ASE) is currently running. If your ASE version is incompatible with the latest packet core, [update your Azure Stack Edge Pro GPU](../databox-online/azure-stack-edge-gpu-install-update.md).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- If the new site will support 4G user equipment (UEs), you must have [created a network slice](create-manage-network-slices.md#create-a-network-slice) with slice/service type (SST) value of 1 and an empty slice differentiator (SD).

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

    - Use the information you collected in [Collect packet core configuration values](collect-required-information-for-a-site.md#collect-packet-core-configuration-values) to fill out the **Technology type**, **Azure Stack Edge device**, and **Custom location** fields.
    - Select the recommended packet core version in the **Version** field.

        > [!NOTE]
        > If a warning appears about an incompatibility between the selected packet core version and the current Azure Stack Edge version, you'll need to update ASE first. Select **Upgrade ASE** from the warning prompt and follow the instructions in [Update your Azure Stack Edge Pro GPU](../databox-online/azure-stack-edge-gpu-install-update.md). Once you've finished updating your ASE, go back to the beginning of this step to create the site resource.

    - Ensure **AKS-HCI** is selected in the **Platform** field.
:::zone pivot="ase-pro-gpu"

7. Use the information you collected in [Collect access network values](collect-required-information-for-a-site.md#collect-access-network-values) to fill out the fields in the **Access network** section.
    > [!NOTE]
    > **ASE N2 virtual subnet** and **ASE N3 virtual subnet** (if this site will support 5G UEs) or **ASE S1-MME virtual subnet** and **ASE S1-U virtual subnet** (if this site will support 4G UEs) must match the corresponding virtual network names on port 5 on your Azure Stack Edge Pro GPU device.

8. In the **Attached data networks** section, select **Attach data network**. Choose whether you want to use an existing data network or create a new one, then use the information you collected in [Collect data network values](collect-required-information-for-a-site.md?pivots=ase-pro-gpu#collect-data-network-values) to fill out the fields. Note the following:
    - **ASE N6 virtual subnet** (if this site will support 5G UEs) or **ASE SGi virtual subnet** (if this site will support 4G UEs) must match the corresponding virtual network name on port 5 or 6 on your Azure Stack Edge Pro device.
    - If you decided not to configure a DNS server, clear the **Specify DNS addresses for UEs?** checkbox.
    - If you decided to keep NAPT disabled, ensure you configure your data network router with static routes to the UE IP pools via the appropriate user plane data IP address for the corresponding attached data network.

    :::image type="content" source="media/create-a-site/create-site-attach-data-network.png" alt-text="Screenshot of the Azure portal showing the Attach data network screen.":::

    Once you've finished filling out the fields, select **Attach**.
:::zone-end
:::zone pivot="ase-pro-2"

7. Use the information you collected in [Collect access network values](collect-required-information-for-a-site.md#collect-access-network-values) to fill out the fields in the **Access network** section.
    > [!NOTE]
    > **ASE N2 virtual subnet** and **ASE N3 virtual subnet** (if this site will support 5G UEs) or **ASE S1-MME virtual subnet** and **ASE S1-U virtual subnet** (if this site will support 4G UEs) must match the corresponding virtual network names on port 3 on your Azure Stack Edge Pro 2 device.

8. In the **Attached data networks** section, select **Attach data network**. Choose whether you want to use an existing data network or create a new one, then use the information you collected in [Collect data network values](collect-required-information-for-a-site.md?pivots=ase-pro-2#collect-data-network-values) to fill out the fields. Note the following:
    - **ASE N6 virtual subnet** (if this site will support 5G UEs) or **ASE SGi virtual subnet** (if this site will support 4G UEs) must match the corresponding virtual network name on port 3 or 4 on your Azure Stack Edge Pro device.
    - If you decided not to configure a DNS server, clear the **Specify DNS addresses for UEs?** checkbox.
    - If you decided to keep NAPT disabled, ensure you configure your data network router with static routes to the UE IP pools via the appropriate user plane data IP address for the corresponding attached data network.

    :::image type="content" source="media/create-a-site/create-site-attach-data-network.png" alt-text="Screenshot of the Azure portal showing the Attach data network screen.":::

    Once you've finished filling out the fields, select **Attach**.
:::zone-end

9. Repeat the previous step for each additional data network you want to configure.
10. If you decided you want to configure diagnostics packet collection or use a user assigned managed identity for HTTPS certificate for this site, select **Next : Identity >**.  
If you decided not to configure diagnostics packet collection or use a user assigned managed identity for HTTPS certificates for this site, you can skip this step.
    1. Select **+ Add** to configure a user assigned managed identity.
    1. In the **Select Managed Identity** side panel:
        - Select the **Subscription** from the dropdown.
        - Select the **Managed identity** from the dropdown.
11. If you decided you want to provide a custom HTTPS certificate in [Collect local monitoring values](collect-required-information-for-a-site.md#collect-local-monitoring-values), select **Next : Local access >**. If you decided not to provide a custom HTTPS certificate at this stage, you can skip this step.

    1. Under **Provide custom HTTPS certificate?**, select **Yes**.
    1. Use the information you collected in [Collect local monitoring values](collect-required-information-for-a-site.md#collect-local-monitoring-values) to select a certificate.
12. In the **Local access** section, set the fields as follows:

    :::image type="content" source="media/create-a-site/create-site-local-access-tab.png" alt-text="Screenshot of the Azure portal showing the Local access configuration tab for a site resource.":::
  
    - Under **Authentication type**, select the authentication method you decided to use in [Choose the authentication method for local monitoring tools](collect-required-information-for-a-site.md#choose-the-authentication-method-for-local-monitoring-tools).
    - Under **Provide custom HTTPS certificate?**, select **Yes** or **No** based on whether you decided to provide a custom HTTPS certificate in [Collect local monitoring values](collect-required-information-for-a-site.md#collect-local-monitoring-values). If you selected **Yes**, use the information you collected in [Collect local monitoring values](collect-required-information-for-a-site.md#collect-local-monitoring-values) to select a certificate.

13. Select **Review + create**.
14. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

    :::image type="content" source="media/create-a-site/create-site-validation.png" alt-text="Screenshot of the Azure portal showing successful validation of configuration values for a site resource.":::

    If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

15. Once your configuration has been validated, you can select **Create** to create the site. The Azure portal will display the following confirmation screen when the site has been created.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a site.":::

16. Select **Go to resource group**, and confirm that it contains the following new resources:

    - A **Mobile Network Site** resource representing the site as a whole.
    - A **Packet Core Control Plane** resource representing the control plane function of the packet core instance in the site.
    - A **Packet Core Data Plane** resource representing the data plane function of the packet core instance in the site.
    - One or more **Data Network** resources representing the data networks (if you chose to create new data networks).
    - One or more **Attached Data Network** resources providing configuration for the packet core instance's connection to the data networks.
  
    :::image type="content" source="media/create-a-site/site-related-resources.png" alt-text="Screenshot of the Azure portal showing a resource group containing a site and its related resources." lightbox="media/create-a-site/site-related-resources.png":::

17. If you want to assign additional packet cores to the site, for each new packet core resource see [Create additional Packet Core instances for a site  using the Azure portal](create-additional-packet-core.md).

## Next steps

If you decided to set up Microsoft Entra ID for local monitoring access, follow the steps in [Enable Microsoft Entra ID for local monitoring tools](enable-azure-active-directory.md).

If you haven't already done so, you should now design the policy control configuration for your private mobile network. This allows you to customize how your packet core instances apply quality of service (QoS) characteristics to traffic. You can also block or limit certain flows. See [Policy control](policy-control.md) to learn more about designing the policy control configuration for your private mobile network.
