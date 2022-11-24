---
title: Modify a packet core instance's local access configuration
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to modify a packet core instance's local access configuration using the Azure portal. 
author: b-branco
ms.author: biancabranco
ms.service: private-5g-core
ms.topic: how-to
ms.date: 11/24/2022
ms.custom: template-how-to
---

# Modify the local access configuration in a site

Access to the [distributed tracing](distributed-tracing.md) and [packet core dashboards](packet-core-dashboards.md) is secured by hypertext transfer protocol secure (HTTPS). The certificates used to secure these web applications can be self-signed or user-provided; we recommend the latter option for additional security of your deployment. 

In this how-to guide, you'll learn how to use the Azure portal to change the certificate used for securing access to a site's local monitoring tools.

## Prerequisites

- Refer to [Choose how to access local monitoring tools](collect-required-information-for-a-site.md#choose-how-to-access-local-monitoring-tools) to collect the required values and make sure they're in the correct format. If you want to use a custom HTTPS certificate for accessing your local monitoring tools, you'll need a certificate signed by a certificate authority (CA).
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.

## View the local access configuration

In this step, you'll navigate to the **Packet Core Control Plane** resource representing your packet core instance.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select the **Mobile Network** resource representing the private mobile network.

    :::image type="content" source="media/mobile-network-search.png" alt-text="Screenshot of the Azure portal. It shows the results of a search for a Mobile Network resource.":::

1. In the resource menu, select **Sites**.
1. Select the site containing the packet core instance you want to modify.
1. Under the **Network function** heading, select the name of the **Packet Core Control Plane** resource shown next to **Packet Core**.

    :::image type="content" source="media/packet-core-field.png" alt-text="Screenshot of the Azure portal showing the Packet Core field.":::

1. Check the fields under the **Local access** heading to view the current local access configuration and status.
<!-- TODO: screenshot -->

## Modify the local access configuration

1. Select **Modify local access**.
<!-- TODO: screenshot 
    :::image type="content" source="media/modify-packet-core/modify-local-access-configuration.png" alt-text="Screenshot of the Azure portal showing the Modify local access option.":::-->

1. Under **HTTPS certificate**, choose whether you want to provide a custom HTTPS certificate for accessing your local monitoring tools.
1. If you selected **Yes** for **Provide custom HTTPS certificate?**, use the information you collected in [Choose how to access local monitoring tools](collect-required-information-for-a-site.md#choose-how-to-access-local-monitoring-tools) to fill out the remaining fields.
    <!-- TODO: screenshot -->
1. Select **Next**. 
1. Azure will now validate the configuration values you've entered. You should see a message indicating that your values have passed validation.
1. Select **Create**.
1. Azure will now redeploy the packet core instance with the new configuration. The Azure portal will display a confirmation screen when this deployment is complete.
1. Select **Go to resource**. Check that the fields under **Local access** contain the updated certificate information and provisioned status.

## Next steps

- [Learn more about the distributed tracing web GUI](distributed-tracing.md)
- [Learn more about the packet core dashboards](packet-core-dashboards.md)
