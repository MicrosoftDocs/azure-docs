---
title: Protect your applications with the App Service plan

description: Learn how to enable the App Service plan on your Azure subscription for Microsoft Defender for Cloud.
ms.topic: install-set-up-deploy
ms.date: 06/29/2023
---

# Protect your applications with Defender for App Service

Azure App Service is a fully managed platform for building and hosting your web apps and APIs. It provides management, monitoring, and operational insights to meet enterprise-grade performance, security, and compliance requirements. For more information, see [Azure App Service](https://azure.microsoft.com/services/app-service/).

**Microsoft Defender for App Service** uses the scale of the cloud to identify attacks targeting applications running over App Service. Attackers probe web applications to find and exploit weaknesses. Before being routed to specific environments, requests to applications running in Azure go through several gateways, where they're inspected and logged. The data is then used to identify exploits and attackers, and to learn new patterns that are used later.

When you enable Microsoft Defender for App Service, you immediately benefit from the following services offered by this Defender plan:

- **Secure** - Defender for App Service assesses the resources covered by your App Service plan and generates security recommendations based on its findings. Use the detailed instructions in these recommendations to harden your App Service resources.

- **Detect** - Defender for App Service detects a multitude of threats to your App Service resources by monitoring:
  - the VM instance in which your App Service is running, and its management interface
  - the requests and responses sent to and from your App Service apps
  - the underlying sandboxes and VMs
  - App Service internal logs - available thanks to the visibility that Azure has as a cloud provider

As a cloud-native solution, Defender for App Service can identify attack methodologies applying to multiple targets. For example, from a single host it would be difficult to identify a distributed attack from a small subset of IPs, crawling to similar endpoints on multiple hosts.

The log data and the infrastructure together can tell the story: from a new attack circulating in, the wild to compromises in customer machines. Therefore, even if Microsoft Defender for App Service is deployed after a web app has been exploited, it might be able to detect ongoing attacks.

You can learn more about Defender for Clouds pricing on [the pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/).

## Prerequisites

- You need a Microsoft Azure subscription. If you don't have an Azure subscription, you can [sign up for a free subscription](https://azure.microsoft.com/pricing/free-trial/).

- You must [enable Microsoft Defender for Cloud](get-started.md#enable-defender-for-cloud-on-your-azure-subscription) on your Azure subscription.

- You must have a supported App Service plan associated with dedicated machines. See the list of [supported plans](defender-for-app-service-introduction.md#availability).

## Enable the Defender for App Service plan

When you enable Defender for Cloud, you have the ability to add the Defender for App Service plan to your subscription to manage, monitor and gain operational insights to meet enterprise-grade performance, security, and compliance requirements for your machines.

**To enable Defender for App Service on your subscription**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Microsoft Defender for Cloud**.

1. In the Defender for Cloud menu, select **Environment settings**.

1. Select the relevant subscription.

1. On the Defender plans page, toggle the App Service plan to **On**.

    :::image type="content" source="media/tutorial-enable-app-service-plan/enable-app-service.png" alt-text="Screenshot that shows where on the Defender plans page to toggle the app service plan switch to on." lightbox="media/tutorial-enable-app-service-plan/enable-app-service.png":::

1. Select **Save**.

## Next steps

[Overview of Defender for App Service to protect your Azure App Service web apps and APIs](defender-for-app-service-introduction.md)
