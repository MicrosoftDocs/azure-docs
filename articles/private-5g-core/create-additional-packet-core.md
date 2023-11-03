---
title: Create additional Packet Core instances for a site - Azure portal
titleSuffix: Azure Private 5G Core
description: This how-to guide shows how to create additional packet core instances for a site in your private mobile network. 
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: how-to
ms.date: 03/21/2023
ms.custom: template-how-to 
zone_pivot_groups: ase-pro-version
---

# Create additional Packet Core instances for a site  using the Azure portal

Azure Private 5G Core private mobile networks include one or more sites. Once deployed, each site can have multiple packet core instances for redundancy. In this how-to guide, you'll learn how to add additional packet core instances to a site in your private mobile network using the Azure portal.

## Prerequisites

- You must already have a site deployed in your private mobile network.
- Collect all of the information in [Collect required information for a site](collect-required-information-for-a-site.md) that you used for the site.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## Create the packet core instance

In this step, you'll create an additional packet core instance for a site in your private mobile network.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network containing the site that you want to add a packet core instance to.
1. Select the **Sites** blade on the resource menu.
1. Select the **Site** resource that you want to add a packet core instance to.
1. Select **Add packet core**.
1. Specify a **Packet core name** and select **Next : Packet core >**.
1. You'll now see the **Packet core** configuration tab.
1. In the **Packet core** section, set the fields as follows:

    - Use the information you collected in [Collect packet core configuration values](collect-required-information-for-a-site.md#collect-packet-core-configuration-values) to fill out the **Technology type**, **Azure Stack Edge device**, and **Custom location** fields.
    - Select the recommended packet core version in the **Version** field.

        > [!NOTE]
        > If a warning appears about an incompatibility between the selected packet core version and the current Azure Stack Edge version, you'll need to update ASE first. Select **Upgrade ASE** from the warning prompt and follow the instructions in [Update your Azure Stack Edge Pro GPU](../databox-online/azure-stack-edge-gpu-install-update.md). Once you've finished updating your ASE, go back to the beginning of this step to create the packet core resource.

    - Ensure **AKS-HCI** is selected in the **Platform** field.
:::zone pivot="ase-pro-gpu"

9. Use the information you collected in [Collect access network values](collect-required-information-for-a-site.md#collect-access-network-values) for the site to fill out the fields in the **Access network** section.
    > [!NOTE]
    > **ASE N2 virtual subnet** and **ASE N3 virtual subnet** (if this site supports 5G UEs) or **ASE S1-MME virtual subnet** and **ASE S1-U virtual subnet** (if this site supports 4G UEs) must match the corresponding virtual network names on port 5 on your Azure Stack Edge Pro GPU device.
:::zone-end
:::zone pivot="ase-pro-2"

9. Use the information you collected in [Collect access network values](collect-required-information-for-a-site.md#collect-access-network-values) for the site to fill out the fields in the **Access network** section.
    > [!NOTE]
    > **ASE N2 virtual subnet** and **ASE N3 virtual subnet** (if this site supports 5G UEs) or **ASE S1-MME virtual subnet** and **ASE S1-U virtual subnet** (if this site supports 4G UEs) must match the corresponding virtual network names on port 3 on your Azure Stack Edge Pro 2 device.
:::zone-end

10. In the **Attached data networks** section, select **Attach data network**. Select the existing data network you used for the site then use the information you collected in [Collect data network values](collect-required-information-for-a-site.md#collect-data-network-values) to fill out the fields. Note the following:
    - **ASE N6 virtual subnet** (if this site supports 5G UEs) or **ASE SGi virtual subnet** (if this site supports 4G UEs) must match the corresponding virtual network name on port 6 on your Azure Stack Edge Pro device.
    - If you decided not to configure a DNS server, clear the **Specify DNS addresses for UEs?** checkbox.
    - If you decided to keep NAPT disabled, ensure you configure your data network router with static routes to the UE IP pools via the appropriate user plane data IP address for the corresponding attached data network.

    Once you've finished filling out the fields, select **Attach**.

11. Repeat the previous step for each additional data network configured on the site.
12. If you decided to configure diagnostics packet collection or use a user assigned managed identity for HTTPS certificate for this site, select **Next : Identity >**.  
If you decided not to configure diagnostics packet collection or use a user assigned managed identity for HTTPS certificates for this site, you can skip this step.
    1. Select **+ Add** to configure a user assigned managed identity.
    1. In the **Select Managed Identity** side panel:
        - Select the **Subscription** from the dropdown.
        - Select the **Managed identity** from the dropdown.
13. If you decided you want to provide a custom HTTPS certificate in [Collect local monitoring values](collect-required-information-for-a-site.md#collect-local-monitoring-values), select **Next : Local access >**. If you decided not to provide a custom HTTPS certificate for monitoring this site, you can skip this step.
    1. Under **Provide custom HTTPS certificate?**, select **Yes**.
    1. Use the information you collected in [Collect local monitoring values](collect-required-information-for-a-site.md#collect-local-monitoring-values) to select a certificate.
14. In the **Local access** section, set the fields as follows:
    - Under **Authentication type**, select the authentication method you decided to use in [Choose the authentication method for local monitoring tools](collect-required-information-for-a-site.md#choose-the-authentication-method-for-local-monitoring-tools).
    - Under **Provide custom HTTPS certificate?**, select **Yes** or **No** based on whether you decided to provide a custom HTTPS certificate in [Collect local monitoring values](collect-required-information-for-a-site.md#collect-local-monitoring-values). If you selected **Yes**, use the information you collected in [Collect local monitoring values](collect-required-information-for-a-site.md#collect-local-monitoring-values) to select a certificate.

15. Select **Review + create**.
16. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.

    If the validation fails, you'll see an error message and the **Configuration** tab(s) containing the invalid configuration will be flagged with red dots. Select the flagged tab(s) and use the error messages to correct invalid configuration before returning to the **Review + create** tab.

17. Once your configuration has been validated, you can select **Create** to create the packet core instance. The Azure portal will display a confirmation screen when the packet core instance has been created.

18. Return to the **Site** overview, and confirm that it contains the new packet core instance.

## Next steps

If you decided to set up Microsoft Entra ID for local monitoring access, follow the steps in [Enable Microsoft Entra ID for local monitoring tools](enable-azure-active-directory.md).

If you haven't already done so, you should now design the policy control configuration for your private mobile network. This allows you to customize how your packet core instances apply quality of service (QoS) characteristics to traffic. You can also block or limit certain flows. See [Policy control](policy-control.md) to learn more about designing the policy control configuration for your private mobile network.
