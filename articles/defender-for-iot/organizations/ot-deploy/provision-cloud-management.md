---
title: Provision OT sensors for cloud management
description: Learn how to ensure that your OT sensor can connect to Azure by accessing a list of required endpoints to define in your firewalls rules.
ms.topic: how-to
ms.date: 03/20/2023
---

# Provision sensors for cloud management

This article is one in a series of articles describing the [deployment path](ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT, and describes how to ensure that your firewall rules allow connectivity to Azure from your OT sensors.

:::image type="content" source="../media/deployment-paths/progress-network-level-deployment.png" alt-text="Diagram of a progress bar with Site networking setup highlighted." border="false" lightbox="../media/deployment-paths/progress-network-level-deployment.png":::

If you're working with air-gapped environment and locally-managed sensors, you can skip this step.

## Prerequisites

To perform the steps described in this article, you need access to the Azure portal as a [Security Reader](../../../role-based-access-control/built-in-roles.md#security-reader), [Security Admin](../../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../../role-based-access-control/built-in-roles.md#owner) user.

This step is performed by your connectivity teams.

## Allow connectivity to Azure

This section describes how to download a list of required endpoints to define in firewall rules, ensuring that your OT sensors can connect to Azure.

This procedure is also used to configure [direct connections](../architecture-connections.md#direct-connections) to Azure. If you're planning to use a proxy configuration instead, you'll [configure proxy settings](../connect-sensors.md) after installing and activating your sensor.

For more information, see [Methods for connecting sensors to Azure](../architecture-connections.md).

**To download required endpoint details**:

1. On the Azure portal, go to Defender for IoT > **Sites and sensors**.

1. Select **More actions** > **Download endpoint details**.

Configure your firewall rules so that your sensor can access the cloud on port 443, to each of the listed endpoints in the downloaded list.

> [!IMPORTANT]
> Azure public IP addresses are updated weekly. If you must define firewall rules based on IP addresses, make sure to download the new [JSON file](https://www.microsoft.com/download/details.aspx?id=56519) each week and make the required changes on your site to correctly identify services running in Azure.
>

## Next steps

> [!div class="step-by-step"]
> [« Configure traffic mirroring](../traffic-mirroring/traffic-mirroring-overview.md)

> [!div class="step-by-step"]
> [Install OT monitoring software on OT sensors »](install-software-ot-sensor.md)
