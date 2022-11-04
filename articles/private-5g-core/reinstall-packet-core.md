---
title: Reinstall a packet core instance
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to reinstall a packet core instance using the Azure portal. 
author: b-branco
ms.author: biancabranco
ms.service: private-5g-core
ms.topic: how-to
ms.date: 11/03/2022
ms.custom: template-how-to
---

# Reinstall the packet core instance in a site - Azure portal

Each Azure Private 5G Core Preview site contains a packet core instance, which is a cloud-native implementation of the 3GPP standards-defined 5G Next Generation Core (5G NGC or 5GC).

If you're experiencing issues with your deployment, reinstalling packet core may help return it to a good state. In this how-to guide, you'll learn how to reinstall a packet core instance using the Azure portal.

## Prerequisites

Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## Back up deployment information

The following list contains data that will get lost over a packet core reinstall. Back up any information you'd like to preserve; after the reinstall, you can use this information to reconfigure your packet core instance.

1. If you want to keep using the same credentials when signing in to [distributed tracing](distributed-tracing.md), save a copy of the current password to a secure location.
2. If you want to keep using the same credentials when signing in to the [packet core dashboards](packet-core-dashboards.md), save a copy of the current password to a secure location.
3. Any customizations made to the packet core dashboards won't be carried over the reinstall. Refer to [Exporting a dashboard](https://grafana.com/docs/grafana/v6.1/reference/export_import/#exporting-a-dashboard) in the Grafana documentation to save a backed-up copy of your dashboards.
4. Most UEs will automatically re-register and recreate any sessions after the reinstall completes. If you have any special devices that require manual operations to recover from a packet core outage, gather a list of these UEs and their recovery steps.

## Reinstall the packet core instance

To reinstall your packet core instance:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

3. In the resource menu, select **Sites**.
4. Select the site containing the packet core instance you're interested in.
5. Under the **Network function** heading, select the name of the **Packet Core Control Plane** resource shown next to **Packet Core**.

    :::image type="content" source="media/upgrade-packet-core-azure-portal/packet-core-field.png" alt-text="Screenshot of the Azure portal showing the Packet Core field.":::

6. Select **Reinstall packet core**.

<!-- TODO: add image
    :::image type="content" source="media/upgrade-packet-core-azure-portal/upgrade-version.png" alt-text="Screenshot of the Azure portal showing the Reinstall packet core option."::: -->

7. In the **Confirm reinstall** field, type *Yes*.

<!-- TODO: add image
    :::image type="content" source="media/upgrade-packet-core-azure-portal/upgrade-packet-core-version.png" alt-text="Screenshot of the Azure portal showing the Reinstall packet core screen."::: -->

8. Select **Reinstall**.
9. Azure will now uninstall the packet core instance and redeploy it with the same configuration. The Azure portal will display the following confirmation screen when this deployment is complete.

    :::image type="content" source="media/site-deployment-complete.png" alt-text="Screenshot of the Azure portal showing the confirmation of a successful deployment of a packet core instance.":::

## Restore backed up deployment information

Reconfigure your deployment using the information you gathered in [Back up deployment information](#back-up-deployment-information).

1. Follow [Access the distributed tracing web GUI](distributed-tracing.md#access-the-distributed-tracing-web-gui) to restore access to distributed tracing.
2. Follow [Access the packet core dashboards](packet-core-dashboards.md#access-the-packet-core-dashboards) to restore access to your packet core dashboards.
3. If you backed up any packet core dashboards, follow [Importing a dashboard](https://grafana.com/docs/grafana/v6.1/reference/export_import/#importing-a-dashboard) in the Grafana documentation to restore them.
4. If you have UEs that require manual operations to recover from a packet core outage, follow their recovery steps.

## Verify reinstall

Use [Log Analytics](monitor-private-5g-core-with-log-analytics.md) or the [packet core dashboards](packet-core-dashboards.md) to confirm your packet core instance is operating normally after the reinstall.
<!-- Advice if they're still experiencing issues? -->

## Next steps

You've finished reinstalling your packet core instance. You can now use Log Analytics or the packet core dashboards to monitor your deployment.

- [Monitor Azure Private 5G Core with Log Analytics](monitor-private-5g-core-with-log-analytics.md)
- [Packet core dashboards](packet-core-dashboards.md)
