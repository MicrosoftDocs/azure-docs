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

If your deployment contains multiple sites, we recommend upgrading a single packet core instance first to ensure the upgrade is successful before upgrading the remaining instances.

## Prerequisites

- You must have a running packet core. Use Log Analytics or the packet core dashboards to confirm your packet core instance is operating normally.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## View the current packet core version

To check which version your packet core instance is currently running, and whether there's a newer version available:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the **Resource** menu, select **Sites**.
1. Select the site containing the packet core instance you're interested in.
1. Under the **Network function** heading, select the name of the **Packet Core Control Plane** resource shown next to **Packet Core**.

    :::image type="content" source="media/upgrade-packet-core-azure-portal/packet-core-field.png" alt-text="Screenshot of the Azure portal showing the Packet Core field.":::

1. Check the **Version** field under the **Configuration** heading to view the current software version. If there's a warning that you're running an unsupported version, we advise that you upgrade your packet core instance to a version that Microsoft currently supports.

    :::image type="content" source="media/upgrade-packet-core-azure-portal/packet-core-control-plane-overview.png" alt-text="Screenshot of the Azure portal showing the Packet Core Control Plane resource overview." lightbox="media/upgrade-packet-core-azure-portal/packet-core-control-plane-overview.png":::
    <!-- TODO: update screenshot with new upgrade warning UI -->

## Plan for your upgrade

We recommend upgrading your packet core instance during a maintenance window or a period of low traffic to minimize the impact of the upgrade on your service.

When planning for your upgrade, make sure you're allowing sufficient time for an upgrade and a possible rollback in the event of any issues. In addition, consider the following points for pre- and post-upgrade steps you may need to plan for when scheduling your maintenance window:

- Refer to the [release notes](azure-private-5g-core-release-notes-2210.md) for the current version of packet core and whether it's supported by the version your Azure Stack Edge (ASE) is currently running.
- If your ASE version is incompatible with the latest packet core, you'll need to upgrade ASE first. Refer to [Update your Azure Stack Edge Pro GPU](/azure/databox-online/azure-stack-edge-gpu-install-update) for the latest available version of ASE.
  - If you're currently running a packet core version that the ASE version you're upgrading to supports, you can upgrade ASE and packet core independently.
  - If you're currently running a packet core version that the ASE version you're upgrading to doesn't support, it's possible that packet core won't operate normally with the new ASE version. In this case, we recommend planning a maintenance window that allows you time to fully upgrade both ASE and packet core. Refer to [Update your Azure Stack Edge Pro GPU](/azure/databox-online/azure-stack-edge-gpu-install-update) for how long the ASE upgrade will take.
- Prepare a testing plan with any steps you'll need to follow to validate your deployment post-upgrade. This plan should include testing some registered devices and sessions, and you'll execute it as part of [Verify upgrade](#verify-upgrade).
- Review [Restore backed up deployment information](#restore-backed-up-deployment-information) and [Verify upgrade](#verify-upgrade) for the post-upgrade steps you'll need to follow to ensure your deployment is fully operational. Make sure your upgrade plan allows sufficient time for these steps.

## Upgrade the packet core instance

### Back up deployment information

The following list contains data that will get lost over a packet core upgrade. Back up any information you'd like to preserve; after the upgrade, you can use this information to reconfigure your packet core instance.

1. If you want to keep using the same credentials when signing in to [distributed tracing](distributed-tracing.md), save a copy of the current password to a secure location.
2. If you want to keep using the same credentials when signing in to the [packet core dashboards](packet-core-dashboards.md), save a copy of the current password to a secure location.
3. Any customizations made to the packet core dashboards won't be carried over the upgrade. Refer to [Exporting a dashboard](https://grafana.com/docs/grafana/v6.1/reference/export_import/#exporting-a-dashboard) in the Grafana documentation to save a backed-up copy of your dashboards.
4. Most UEs will automatically re-register and recreate any sessions after the upgrade completes. If you have any special devices that require manual operations to recover from a packet core outage, gather a list of these UEs and their recovery steps.

### Upgrade ASE

If you determined in [Plan for your upgrade](#plan-for-your-upgrade) that you need to upgrade your ASE, follow the steps in [Update your Azure Stack Edge Pro GPU](/azure/databox-online/azure-stack-edge-gpu-install-update).

### Upgrade packet core

1. Navigate to the **Packet Core Control Plane** resource that you're interested in upgrading as described in [View the current packet core version](#view-the-current-packet-core-version).
2. Make a note of your current packet core version. You'll need this information in case you encounter any issues and need to revert the upgrade.
3. Select **Upgrade version**.

    :::image type="content" source="media/upgrade-packet-core-azure-portal/upgrade-version.png" alt-text="Screenshot of the Azure portal showing the Upgrade version option.":::

4. From the **New version** dropdown list, select the packet core version you want to upgrade to.

    :::image type="content" source="media/upgrade-packet-core-azure-portal/upgrade-packet-core-version.png" alt-text="Screenshot of the Azure portal showing the New version field on the Upgrade packet core version screen. The recommended up-level version is selected.":::

    > [!NOTE]
    > If a warning appears about an incompatibility between the selected packet core version and the current Azure Stack Edge version, you'll need to upgrade ASE first. Select **Upgrade ASE** from the warning prompt and follow the instructions in [Update your Azure Stack Edge Pro GPU](/azure/databox-online/azure-stack-edge-gpu-install-update). Once you've finished updating your ASE, go back to the beginning of this step to upgrade packet core.

5. Select **Modify**.
6. Azure will now redeploy the packet core instance at the new software version. The Azure portal will display the following confirmation screen when this deployment is complete.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a packet core instance.":::

### Restore backed up deployment information

Reconfigure your deployment using the information you gathered in [Back up deployment information](#back-up-deployment-information).

1. Follow [Access the distributed tracing web GUI](distributed-tracing.md#access-the-distributed-tracing-web-gui) to restore access to distributed tracing.
2. Follow [Access the packet core dashboards](packet-core-dashboards.md#access-the-packet-core-dashboards) to restore access to your packet core dashboards.
3. If you backed up any packet core dashboards, follow [Importing a dashboard](https://grafana.com/docs/grafana/v6.1/reference/export_import/#importing-a-dashboard) in the Grafana documentation to restore them.
4. If you have UEs that require manual operations to recover from a packet core outage, follow their recovery steps.

### Verify upgrade

Once the upgrade completes, check if your deployment is operating normally.

1. Navigate to the **Packet Core Control Plane** resource as described in [View the current packet core version](#view-the-current-packet-core-version). Check the **Version** field under the **Configuration** heading to confirm that it displays the new software version.
2. Use [Log Analytics](monitor-private-5g-core-with-log-analytics.md) or the [packet core dashboards](packet-core-dashboards.md) to confirm your packet core instance is operating normally.
3. Execute the testing plan you prepared in [Plan for your upgrade](#plan-for-your-upgrade).

## Rollback

If you encountered issues after the upgrade, you can roll back the packet core instance to the previous version.

Note that any configuration you set while your packet core instance was running a newer version will be lost if you roll back to a version that doesn't support this configuration. Check the packet core release notes for information on when new features were introduced.

1. Ensure you have a backup of your deployment information. If you need to back up again, follow [Back up deployment information](#back-up-deployment-information).
2. Navigate to the **Packet Core Control Plane** resource that you want to roll back as described in [View the current packet core version](#view-the-current-packet-core-version).
3. Select **Upgrade version**.

    :::image type="content" source="media/upgrade-packet-core-azure-portal/upgrade-version.png" alt-text="Screenshot of the Azure portal showing the Upgrade version option.":::

4. From the **New version** dropdown list, select the packet core version you want to downgrade to. You collected this value in [Upgrade packet core](#upgrade-packet-core).

    :::image type="content" source="media/upgrade-packet-core-azure-portal/downgrade-packet-core-version.png" alt-text="Screenshot of the Azure portal showing the New version field on the Upgrade packet core version screen. A down-level version is selected.":::

5. Select **Modify**.
6. Azure will now redeploy the packet core instance at the new software version. The Azure portal will display the following confirmation screen when this deployment is complete.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a packet core instance.":::

7. Follow the steps in [Verify upgrade](#verify-upgrade) to check if the rollback was successful.

## Next steps

You've finished upgrading your packet core instance. You can now use Log Analytics or the packet core dashboards to monitor your deployment.

- [Monitor Azure Private 5G Core with Log Analytics](monitor-private-5g-core-with-log-analytics.md)
- [Packet core dashboards](packet-core-dashboards.md)
