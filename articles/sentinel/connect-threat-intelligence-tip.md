---
title: Connect your threat intelligence platform
titleSuffix: Microsoft Sentinel
description: Learn how to connect your threat intelligence platform (TIP) or custom feed to Microsoft Sentinel and send threat indicators.
author: austinmccollum
ms.topic: how-to
ms.date: 3/14/2024
ms.author: austinmc
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security admin, I want to integrate my threat intelligence platform with Microsoft Sentinel to ingest threat intelligence, generating alerts and incidents so that I can centralize and enhance threat detection and response.

---

# Connect your threat intelligence platform to Microsoft Sentinel

> [!NOTE]
> This data connector is on a path for deprecation. More information will be published on the precise timeline. Use the new Threat Intelligence Upload Indicators API data connector for new solutions going forward.
> For more information, see [Connect your threat intelligence platform to Microsoft Sentinel with the Upload Indicators API](connect-threat-intelligence-upload-api.md).

Many organizations use threat intelligence platform (TIP) solutions to aggregate threat indicator feeds from various sources. From the aggregated feed, the data is curated to apply to security solutions such as network devices, EDR/XDR solutions, or security information and event management (SIEM) solutions such as Microsoft Sentinel. By using the TIP data connector, you can use these solutions to import threat indicators into Microsoft Sentinel. 

Because the TIP data connector works with the [Microsoft Graph Security tiIndicators API](/graph/api/resources/tiindicator) to accomplish this process, you can use the connector to send indicators to Microsoft Sentinel (and to other Microsoft security solutions like Defender XDR) from any other custom TIP that can communicate with that API.

:::image type="content" source="media/connect-threat-intelligence-tip/threat-intel-import-path.png" alt-text="Screenshot that shows the threat intelligence import path.":::

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

Learn more about [threat intelligence](understand-threat-intelligence.md) in Microsoft Sentinel, and specifically about the [TIP products](threat-intelligence-integration.md#integrated-threat-intelligence-platform-products) that you can integrate with Microsoft Sentinel.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Prerequisites

- To install, update, and delete standalone content or solutions in the **Content hub**, you need the Microsoft Sentinel Contributor role at the resource group level.
- To grant permissions to your TIP product or any other custom application that uses direct integration with the Microsoft Graph TI Indicators API, you must have the Security Administrator Microsoft Entra role or the equivalent permissions.
- To store your threat indicators, you must have read and write permissions to the Microsoft Sentinel workspace.

## Instructions

To import threat indicators to Microsoft Sentinel from your integrated TIP or custom threat intelligence solution, follow these steps:

1. Obtain an application ID and client secret from Microsoft Entra ID.
1. Input this information into your TIP solution or custom application.
1. Enable the TIP data connector in Microsoft Sentinel.

<a name='sign-up-for-an-application-id-and-client-secret-from-your-azure-active-directory'></a>

## Sign up for an application ID and client secret from Microsoft Entra ID

Whether you're working with a TIP or a custom solution, the tiIndicators API requires some basic information to allow you to connect your feed to it and send it threat indicators. The three pieces of information you need are:

- Application (client) ID
- Directory (tenant) ID
- Client secret

You can get this information from Microsoft Entra ID through app registration, which includes the following three steps:

- Register an app with Microsoft Entra ID.
- Specify the permissions required by the app to connect to the Microsoft Graph tiIndicators API and send threat indicators.
- Get consent from your organization to grant these permissions to this application.

<a name='register-an-application-with-azure-active-directory'></a>

#### Register an application with Microsoft Entra ID

1. In the Azure portal, go to **Microsoft Entra ID**.
1. On the menu, select **App Registrations**, and then select **New registration**.
1. Choose a name for your application registration, select **Single tenant**, and then select **Register**.

    :::image type="content" source="media/connect-threat-intelligence-tip/threat-intel-register-application.png" alt-text="Screenshot that shows registering an application.":::

1. On the screen that opens, copy the **Application (client) ID** and **Directory (tenant) ID** values. You need these two pieces of information later to configure your TIP or custom solution to send threat indicators to Microsoft Sentinel. The third piece of information you need, the client secret, comes later.

#### Specify the permissions required by the application

1. Go back to the main page of **Microsoft Entra ID**.

1. On the menu, select **App Registrations**, and then select your newly registered app.

1. On the menu, select **API Permissions** > **Add a permission**.

1. On the **Select an API** page, select the **Microsoft Graph** API. Then choose from a list of Microsoft Graph permissions.

1. At the prompt **What type of permissions does your application require?**, select **Application permissions**. This permission is the type used by applications that authenticate with app ID and app secrets (API keys).

1. Select **ThreatIndicators.ReadWrite.OwnedBy**, and then select **Add permissions** to add this permission to your app's list of permissions.

    :::image type="content" source="media/connect-threat-intelligence-tip/threat-intel-api-permissions-1.png" alt-text="Screenshot that shows specifying permissions.":::

#### Get consent from your organization to grant these permissions

1. To grant consent, a privileged role is required. For more information, see [Grant tenant-wide admin consent to an application](/entra/identity/enterprise-apps/grant-admin-consent?pivots=portal).

    :::image type="content" source="media/connect-threat-intelligence-tip/threat-intel-api-permissions-2.png" alt-text="Screenshot that shows granting consent.":::

1. After consent is granted to your app, you should see a green check mark under **Status**.

After your app is registered and permissions are granted, you need to get a client secret for your app.

1. Go back to the main page of **Microsoft Entra ID**.

1. On the menu, select **App Registrations**, and then select your newly registered app.

1. On the menu, select **Certificates & secrets**. Then select **New client secret** to receive a secret (API key) for your app.

    :::image type="content" source="media/connect-threat-intelligence-tip/threat-intel-client-secret.png" alt-text="Screenshot that shows getting a client secret.":::

1. Select **Add**, and then copy the client secret.

    > [!IMPORTANT]
    > You must copy the client secret before you leave this screen. You can't retrieve this secret again if you go away from this page. You need this value when you configure your TIP or custom solution.

## Input this information into your TIP solution or custom application

You now have all three pieces of information you need to configure your TIP or custom solution to send threat indicators to Microsoft Sentinel:

- Application (client) ID
- Directory (tenant) ID
- Client secret

Enter these values in the configuration of your integrated TIP or custom solution where required.

1. For the target product, specify **Azure Sentinel**. (Specifying **Microsoft Sentinel** results in an error.)

1. For the action, specify **alert**.

After the configuration is finished, threat indicators are sent from your TIP or custom solution, through the Microsoft Graph tiIndicators API, targeted at Microsoft Sentinel.

## Enable the TIP data connector in Microsoft Sentinel

The last step in the integration process is to enable the TIP data connector in Microsoft Sentinel. Enabling the connector is what allows Microsoft Sentinel to receive the threat indicators sent from your TIP or custom solution. These indicators are available to all Microsoft Sentinel workspaces for your organization. To enable the TIP data connector for each workspace, follow these steps:

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Content management**, select **Content hub**. <br>For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Content management** > **Content hub**.

1. Find and select the **Threat Intelligence** solution.

1. Select the :::image type="icon" source="media/connect-mdti-data-connector/install-update-button.png"::: **Install/Update** button.

   For more information about how to manage the solution components, see [Discover and deploy out-of-the-box content](sentinel-solutions-deploy.md).

1. To configure the TIP data connector, select **Configuration** > **Data connectors**.

1. Find and select the **Threat Intelligence Platforms** data connector, and then select **Open connector page**.

    :::image type="content" source="media/connect-threat-intelligence-tip/tip-data-connector-config.png" alt-text="Screenshot that shows the Data connectors page with the Threat Intelligence Platforms data connector listed." lightbox="media/connect-threat-intelligence-tip/tip-data-connector-config.png":::

1. Because you already finished the app registration and configured your TIP or custom solution to send threat indicators, the only step left is to select **Connect**.

Within a few minutes, threat indicators should begin flowing into this Microsoft Sentinel workspace. You can find the new indicators on the **Threat intelligence** pane, which you can access from the Microsoft Sentinel menu.

## Related content

In this article, you learned how to connect your TIP to Microsoft Sentinel. To learn more about Microsoft Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
