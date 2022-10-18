---
title: Upgrade a packet core instance
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to upgrade a packet core instance using the Azure portal. 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 04/27/2022
ms.custom: template-how-to
---

# Upgrade the packet core instance in a site - Azure portal

Each Azure Private 5G Core Preview site contains a packet core instance, which is a cloud-native implementation of the 3GPP standards-defined 5G Next Generation Core (5G NGC or 5GC). You'll need to periodically upgrade your packet core instances to get access to the latest Azure Private 5G Core features and maintain support for your private mobile network. In this how-to guide, you'll learn how to upgrade a packet core instance using the Azure portal.

## Prerequisites

- Refer to the release notes for the current version of packet core, and whether it's supported by the version your Azure Stack Edge (ASE) is currently running. If your ASE version is incompatible with the latest packet core, [update your Azure Stack Edge Pro GPU](/azure/databox-online/azure-stack-edge-gpu-install-update).
- Use Log Analytics or the packet core dashboards to confirm your packet core instance is operating normally. <!-- Should we include this advice, so they have a healthy state to roll back to in case there are issues post-upgrade? -->
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## View the current packet core version

To check which version your packet core instance is currently running, and whether there is a newer version available:

1. Sign in to the Azure portal at [https://aka.ms/AP5GCNewPortal](https://aka.ms/AP5GCNewPortal).
1. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the **Resource** menu, select **Sites**.
1. Select the site containing the packet core instance you're interested in.
1. Under the **Network function** heading, select the name of the **Packet Core Control Plane** resource shown next to **Packet Core**.

    :::image type="content" source="media/upgrade-packet-core-azure-portal/packet-core-field.png" alt-text="Screenshot of the Azure portal showing the Packet Core field.":::

1. Check the **Version** field under the **Configuration** heading to view the current software version. If there's a warning that you're running an unsupported version, we advise that you upgrade your packet core instance to a version that Microsoft currently supports.

    :::image type="content" source="media/upgrade-packet-core-azure-portal/packet-core-control-plane-overview.png" alt-text="Screenshot of the Azure portal showing the Packet Core Control Plane resource overview." lightbox="media/upgrade-packet-core-azure-portal/packet-core-control-plane-overview.png":::
    <!-- TODO: update screenshot with new upgrade warning UI -->

## Upgrade the packet core instance

### Prepare your deployment for upgrade

<!-- TODO: add info on maintenance windows and upgrade planning, including information on amount of load running during upgrade and time required for upgrade. -->
We recommend upgrading your packet core instance during a maintenance window.

### Back up deployment information

<!-- TODO: add info on what data gets lost and how to back up -->

<!-- Should we have a Gather diagnostics section? -->

### Upgrade packet core

1. Navigate to the **Packet Core Control Plane** resource that you're interested in upgrading as described in [View the current packet core version](#view-the-current-packet-core-version).
2. Make a note of your current packet core version. You'll need this information in case you encounter any issues and need to revert the upgrade.
3. Select **Upgrade version**.

    :::image type="content" source="media/upgrade-packet-core-azure-portal/upgrade-version.png" alt-text="Screenshot of the Azure portal showing the Upgrade version option.":::

4. From the **New version** dropdown list, select the packet core version you want to upgrade to.

    :::image type="content" source="media/upgrade-packet-core-azure-portal/upgrade-packet-core-version.png" alt-text="Screenshot of the Azure portal showing the New version field on the Upgrade packet core version screen.":::

    > [!NOTE]
    > If a warning appears about an incompatibility between the selected packet core version and the current Azure Stack Edge version, you'll need to update ASE first. Select **Upgrade ASE** from the warning prompt and follow the instructions in [Update your Azure Stack Edge Pro GPU](/azure/databox-online/azure-stack-edge-gpu-install-update). Once you've finished updating your ASE, go back to the beginning of this step to upgrade packet core.

5. Select **Modify**.
6. Azure will now redeploy the packet core instance at the new software version. The Azure portal will display the following confirmation screen when this deployment is complete.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a packet core instance.":::

### Restore backed up deployment information
<!-- TODO -->

### Verify upgrade

1. Select **Go to resource group**, and then select the **Packet Core Control Plane** resource representing the control plane function of the packet core instance in the site.
1. Check the **Version** field under the **Configuration** heading to confirm that it displays the new software version.

## Rollback

If you encountered issues after the upgrade, you can roll back the packet core instance to the previous version.

Note that any configuration you set while your packet core instance was running a newer versions will be lost if you roll back to a version where this configuration is unsupported. Check the release notes for information on when new features were introduced.

1. Follow the steps in [Upgrade packet core](#upgrade-packet-core). When selecting the version you want to upgrade to, choose the previous packet core version you noted down earlier.
<!-- TODO: TBC how rollback will work -->

## Next steps

Use Log Analytics or the packet core dashboards to confirm your packet core instance is operating normally after the upgrade.

- [Monitor Azure Private 5G Core with Log Analytics](monitor-private-5g-core-with-log-analytics.md)
- [Packet core dashboards](packet-core-dashboards.md)
