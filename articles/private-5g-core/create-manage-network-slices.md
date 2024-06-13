---
title: Create and manage network slices - Azure portal
titleSuffix: Azure Private 5G Core
description: With this how-to guide, learn how to create, modify and delete network slices for Azure Private 5G Core through the Azure portal.  
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 09/30/2022
ms.custom: template-how-to
---

# Create and manage network slices - Azure portal

*Network slices* allow you to host multiple independent logical networks in the same Azure Private 5G Core deployment. Slices are assigned to SIM policies and static IP addresses, providing isolated end-to-end networks that can be customized for different bandwidth and latency requirements.

In this how-to guide, you'll learn how to view, create, modify, and delete network slices using the Azure portal. You can configure a slice/service type (SST) and slice differentiator (SD) for slices associated with SIMs that will be provisioned on a 5G site. If a SIM is provisioned on a 4G site, the slice associated with its SIM policy must contain an empty SD and a value of 1 for the SST.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
- Identify the name of the Mobile Network resource corresponding to your private mobile network.
- If you're creating a new slice, collect the information listed in [Collect the required information for a network slice](collect-required-information-for-private-mobile-network.md#collect-the-required-information-for-a-network-slice). If the slice will be used by 4G UEs, you don't need to collect SST and SD values.
- If you're making changes to a slice, refer to [Collect the required information for a network slice](collect-required-information-for-private-mobile-network.md#collect-the-required-information-for-a-network-slice) to collect the required values and make sure they're in the correct format.
- Navigate to your **Packet Core Control Plane** resource and make sure that the **Packet core installation state** field contains **Succeeded**. This to avoid errors when managing your network slices by ensuring no other processes are running. If you just finished running a process, it may take a few minutes for the **Packet core installation state** field to update.

## View existing network slices

You can view your existing network slices in the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network to which you want to add a slice.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the **Resource** menu, select **Slices** to see a list of existing network slices.

    :::image type="content" source="media/create-manage-network-slices/network-slices-list.png" alt-text="Screenshot of the Azure portal showing a list of network slices. The Slices resource menu option is highlighted." :::

## Create a network slice

To provision a new network slice:

1. Navigate to the list of network slices in your private mobile network, as described in [View existing network slices](#view-existing-network-slices).
2. Select **Create**.

    :::image type="content" source="media/create-manage-network-slices/network-slices-create.png" alt-text="Screenshot of the Azure portal showing the Create slice option." :::

3. Use the information you collected in [Collect the required information for a network slice](collect-required-information-for-private-mobile-network.md#collect-the-required-information-for-a-network-slice) to fill in the fields under **Create Slice**.

    :::image type="content" source="media/create-manage-network-slices/create-network-slice.png" alt-text="Screenshot of the Azure portal showing the Create slice screen." :::

4. Select **Create**.
5. Wait while the Azure portal deploys the new network slice. You'll see a confirmation screen when the deployment is complete.
6. Navigate to the list of network slices, as described in [View existing network slices](#view-existing-network-slices).
7. Select **Refresh**.

    :::image type="content" source="media/create-manage-network-slices/network-slices-refresh.png" alt-text="Screenshot of the Azure portal showing the Refresh slices option." :::

8. Confirm that the new slice exists and shows the expected configuration.

## Modify a network slice

To make changes to an existing network slice:

1. Navigate to the list of network slices in your private mobile network, as described in [View existing network slices](#view-existing-network-slices).
2. Select the checkbox next to the slice you're interested in and select **Modify the selected slice**.

    :::image type="content" source="media/create-manage-network-slices/modify-network-slice-selection.png" alt-text="Screenshot of the Azure portal showing the Modify the selected slice option." :::

3. Use the information you collected in [Collect the required information for a network slice](collect-required-information-for-private-mobile-network.md#collect-the-required-information-for-a-network-slice) to fill in the fields under **Modify Slice** with any new values.

    :::image type="content" source="media/create-manage-network-slices/modify-network-slice.png" alt-text="Screenshot of the Azure portal showing the Modify slice screen." :::

4. Select **Modify**.
5. Wait while the Azure portal redeploys the network slice with the new configuration. You'll see a confirmation screen when the deployment is complete.
6. Navigate to the list of network slices, as described in [View existing network slices](#view-existing-network-slices).
7. Select **Refresh**.

    :::image type="content" source="media/create-manage-network-slices/network-slices-refresh.png" alt-text="Screenshot of the Azure portal showing the Refresh slices option." :::

8. Confirm that your slice shows the updated configuration.

## Delete a network slice

You can delete network slices through the Azure portal. A slice can't be deleted if it's associated with a SIM policy or a static IP address. If you have a 4G site deployed in your mobile network, you can't delete the slice configured with SST value of 1 and empty SD.

To delete a network slice:

1. Navigate to the list of network slices in your private mobile network, as described in [View existing network slices](#view-existing-network-slices).
1. Select the checkbox next to each slice you want to delete.
1. Select **Delete**.

    :::image type="content" source="media/create-manage-network-slices/delete-network-slice-selection.png" alt-text="Screenshot of the Azure portal showing the Delete slice option." :::

1. Select **Delete** to confirm you want to delete the slice(s).

## Next steps

- See [Collect the required information for a site](collect-required-information-for-a-site.md) for the information you need to collect to provision a site.
- See [Policy control](policy-control.md) to learn more about designing the policy control configuration for your private mobile network.
