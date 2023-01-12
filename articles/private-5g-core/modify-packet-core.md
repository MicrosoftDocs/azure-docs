---
title: Modify a packet core instance
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to modify a packet core instance using the Azure portal. 
author: b-branco
ms.author: biancabranco
ms.service: private-5g-core
ms.topic: how-to
ms.date: 09/29/2022
ms.custom: template-how-to
---

# Modify the packet core instance in a site

Each Azure Private 5G Core Preview site contains a packet core instance, which is a cloud-native implementation of the 3GPP standards-defined 5G Next Generation Core (5G NGC or 5GC). In this how-to guide, you'll learn how to modify a packet core instance using the Azure portal; this includes modifying the packet core's custom location, connected Azure Stack Edge device, and access network configuration. You'll also learn how to add and modify the data networks attached to the packet core instance.

>[!IMPORTANT]
> If you have configured or will configure your packet core to have more than one attached data network, you'll need to modify it without a custom location to avoid issues with your data networks.
>
> 1. Follow this how-to guide to modify your packet core instance with the following changes:
>
>    1. In [Modify the packet core configuration](#modify-the-packet-core-configuration), make a note of the custom location value in the **Custom ARC location** field.
>    1. Set the **Custom ARC location** field to **None**.
>    1. In [Submit and verify changes](#submit-and-verify-changes), the packet core will be redeployed at an uninstalled state with the new configuration.
>
> 2. Follow this how-to guide again to set the **Custom ARC location** field to the custom location value you noted down.

If you want to modify a packet core instance's local access configuration, follow [Modify the local access configuration in a site](modify-local-access-configuration.md).

## Prerequisites

- If you want to make changes to the packet core configuration or access network, refer to [Collect packet core configuration values](collect-required-information-for-a-site.md#collect-packet-core-configuration-values) and [Collect access network values](collect-required-information-for-a-site.md#collect-access-network-values) to collect the new values and make sure they're in the correct format.

    > [!NOTE]
    > You can't update a packet core instance's **Technology type** or **Version** field.
    >
    > - To change the technology type, you'll need to [delete the site](delete-a-site.md) and [recreate it](create-a-site.md).
    > - To change the version, [upgrade the packet core instance](upgrade-packet-core-azure-portal.md).


- If you want to make changes to the attached data networks, refer to [Collect data network values](collect-required-information-for-a-site.md#collect-data-network-values) to collect the new values and make sure they're in the correct format.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## Select the packet core instance to modify

In this step, you'll navigate to the **Packet Core Control Plane** resource representing your packet core instance.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

3. In the **Resource** menu, select **Sites**.
4. Select the site containing the packet core instance you want to modify.
5. Under the **Network function** heading, select the name of the **Packet Core Control Plane** resource shown next to **Packet Core**.

    :::image type="content" source="media/packet-core-field.png" alt-text="Screenshot of the Azure portal showing the Packet Core field.":::

6. Select **Modify packet core**.

    :::image type="content" source="media/modify-packet-core/modify-packet-core-configuration.png" alt-text="Screenshot of the Azure portal showing the Modify packet core option.":::

7. Choose the next step:
   - If you want to make changes to the packet core configuration, access network values, or remove the custom location go to [Modify the packet core configuration](#modify-the-packet-core-configuration).
   - If you want to configure a new or existing data network and attach it to the packet core instance, go to [Attach a data network](#attach-a-data-network).
   - If you want to make changes to a data network that's already attached to the packet core instance, go to [Modify attached data network configuration](#modify-attached-data-network-configuration).

## Modify the packet core configuration

To modify the packet core and/or access network configuration:

1. If you haven't already, [select the packet core instance to modify](#select-the-packet-core-instance-to-modify).
2. In the **Configuration** tab, fill out the fields with any new values.
  
   - Use the information you collected in [Collect packet core configuration values](collect-required-information-for-a-site.md#collect-packet-core-configuration-values) for the top-level configuration values.
   - Use the information you collected in [Collect access network values](collect-required-information-for-a-site.md#collect-access-network-values) for the configuration values under **Access network**.

    :::image type="content" source="media/modify-packet-core/modify-packet-core-configuration-tab.png" alt-text="Screenshot of the Azure portal showing the Modify packet core Configuration tab.":::

3. Choose the next step:
   - If you've finished modifying the packet core instance, go to [Submit and verify changes](#submit-and-verify-changes).
   - If you want to configure a new or existing data network and attach it to the packet core instance, go to [Attach a data network](#attach-a-data-network).
   - If you want to make changes to a data network that's already attached to the packet core instance, go to [Modify attached data network configuration](#modify-attached-data-network-configuration).

## Attach a data network

To configure a new or existing data network and attach it to your packet core instance:

1. If you haven't already, [select the packet core instance to modify](#select-the-packet-core-instance-to-modify).
2. Select the **Data networks** tab.
3. Select **Attach data network**.

    :::image type="content" source="media/modify-packet-core/modify-packet-core-data-networks-attach.png" alt-text="Screenshot of the Azure portal showing the Modify packet core Data networks tab. The option to attach a data network is highlighted.":::

4. In the **Data network** field, choose an existing data network from the dropdown or select **Create new** to create a new one. Use the information you collected in [Collect data network values](collect-required-information-for-a-site.md#collect-data-network-values) to fill out the remaining fields.

    :::image type="content" source="media/modify-packet-core/modify-packet-core-attach-data-network.png" alt-text="Screenshot of the Azure portal showing the Attach data network screen.":::

5. Select **Attach**.
6. Repeat the steps above for each additional data network you want to configure.
7. Choose the next step:
   - If you've finished modifying the packet core instance, go to [Submit and verify changes](#submit-and-verify-changes).
   - If you want to make changes to a data network that's already attached to the packet core instance, go to [Modify attached data network configuration](#modify-attached-data-network-configuration).

## Modify attached data network configuration

To make changes to a data network attached to your packet core instance:

1. If you haven't already, [select the packet core instance to modify](#select-the-packet-core-instance-to-modify).
2. Select the **Data networks** tab.
3. Select the data network you want to modify.

    :::image type="content" source="media/modify-packet-core/modify-packet-core-data-networks-modify.png" alt-text="Screenshot of the Azure portal showing the Modify packet core Data networks tab. A data network is highlighted.":::

4. Use the information you collected in [Collect data network values](collect-required-information-for-a-site.md#collect-data-network-values) to fill out the fields in the **Modify attached data network** window.

    :::image type="content" source="media/modify-packet-core/modify-packet-core-modify-data-network.png" alt-text="Screenshot of the Azure portal showing the Modify attached data network screen.":::

5. Select **Modify**. You should see your changes under the **Data networks** tab.
6. Go to [Submit and verify changes](#submit-and-verify-changes).

## Submit and verify changes

1. Select **Modify**.
2. Azure will now redeploy the packet core instance with the new configuration. The Azure portal will display the following confirmation screen when this deployment is complete.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a packet core instance.":::

3. Navigate to the **Packet Core Control Plane** resource as described in [Select the packet core instance to modify](#select-the-packet-core-instance-to-modify).

    - If you made changes to the packet core configuration, check that the fields under **Connected ASE device**, **Custom ARC location** and **Access network** contain the updated information.
    - If you made changes to the attached data networks, check that the fields under **Data networks** contain the updated information.

## Next steps

Use Log Analytics or the packet core dashboards to confirm your packet core instance is operating normally after you modify it.

- [Monitor Azure Private 5G Core with Log Analytics](monitor-private-5g-core-with-log-analytics.md)
- [Packet core dashboards](packet-core-dashboards.md)
