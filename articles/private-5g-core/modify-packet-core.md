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

Each Azure Private 5G Core Preview site contains a packet core instance, which is a cloud-native implementation of the 3GPP standards-defined 5G Next Generation Core (5G NGC or 5GC). In this how-to guide, you'll learn how to modify a packet core instance using the Azure portal; this includes modifying the packet core and access network configuration. You'll also learn how to modify the data network attached to the packet core instance.

## Prerequisites

- If you want to make changes to the packet core configuration or access network, refer to [Collect packet core configuration values](collect-required-information-for-a-site.md#collect-packet-core-configuration-values) and [Collect access network values](collect-required-information-for-a-site.md#collect-access-network-values) to collect the new values and make sure they're in the correct format.

    > [!NOTE]
    > You can't update a packet core instance's **Technology type** or **Version** field.
    >
    > - To change the technology type, [recreate the site](create-a-site.md).
    > - To change the version, [upgrade the packet core instance](upgrade-packet-core-azure-portal.md).

- If you want to make changes to the attached data network, refer to [Collect data network values](collect-required-information-for-a-site.md#collect-data-network-values) to collect the new values and make sure they're in the correct format.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## Modify the packet core instance

To modify the packet core and/or access network configuration:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

3. In the **Resource** menu, select **Sites**.
4. Select the site containing the packet core instance you want to modify.
5. Under the **Network function** heading, select the name of the **Packet Core Control Plane** resource shown next to **Packet Core**.

    :::image type="content" source="media/packet-core-field.png" alt-text="Screenshot of the Azure portal showing the Packet Core field.":::

6. Select **Modify packet core**.

    :::image type="content" source="media/modify-packet-core/modify-packet-core-configuration.png" alt-text="Screenshot of the Azure portal showing the Modify packet core option.":::

7. In the **Configuration** tab, fill out the fields with any new values.
  
   - Use the information you collected in [Collect packet core configuration values](collect-required-information-for-a-site.md#collect-packet-core-configuration-values) for the **Custom ARC location** configuration value.
   - Use the information you collected in [Collect access network values](collect-required-information-for-a-site.md#collect-access-network-values) for the configuration values under **Access network**.

    :::image type="content" source="media/modify-packet-core/modify-packet-core-configuration-tab.png" alt-text="Screenshot of the Azure portal showing the Modify packet core Configuration tab.":::

### Submit and verify changes

1. Select **Modify**.
2. Azure will now redeploy the packet core instance with the new configuration. The Azure portal will display the following confirmation screen when this deployment is complete.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a packet core instance.":::

3. Select **Go to resource group**. Navigate to the **Packet Core Control Plane** resource as described in [Modify the packet core instance](#modify-the-packet-core-instance). Check that the fields under **Configuration** and **Access network** contain the updated information.

## Next steps

Use Log Analytics or the packet core dashboards to confirm your packet core instance is operating normally after you modify it.

- [Monitor Azure Private 5G Core with Log Analytics](monitor-private-5g-core-with-log-analytics.md)
- [Packet core dashboards](packet-core-dashboards.md)
