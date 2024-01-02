---
title: Connect your threat intelligence platform to Microsoft Sentinel | Microsoft Docs
description: Learn how to connect your threat intelligence platform (TIP) or custom feed to Microsoft Sentinel and send threat indicators.
author: yelevin
ms.topic: how-to
ms.date: 11/09/2021
ms.author: yelevin
ms.custom: ignite-fall-2021
---

# Connect your threat intelligence platform to Microsoft Sentinel

>[!NOTE]
> This data connector is on a path for deprecation. More details will be published on the precise timeline. Use the new threat intelligence upload indicators API data connector for new solutions going forward.
>

For more information, see [Connect your threat intelligence platform to Microsoft Sentinel with the upload indicators API](connect-threat-intelligence-upload-api.md).

Many organizations use threat intelligence platform (TIP) solutions to aggregate threat indicator feeds from various sources. From the aggregated feed, the data is curated to apply to security solutions such as network devices, EDR/XDR solutions, or SIEMs such as Microsoft Sentinel. The **Threat Intelligence Platforms data connector** allows you to use these solutions to import threat indicators into Microsoft Sentinel. 

Because the TIP data connector works with the [Microsoft Graph Security tiIndicators API](/graph/api/resources/tiindicator) to accomplish this, you can use the connector to send indicators to Microsoft Sentinel (and to other Microsoft security solutions like Microsoft Defender XDR) from any other custom threat intelligence platform that can communicate with that API.

:::image type="content" source="media/connect-threat-intelligence-tip/threat-intel-import-path.png" alt-text="Threat intelligence import path":::

Learn more about [Threat Intelligence](understand-threat-intelligence.md) in Microsoft Sentinel, and specifically about the [threat intelligence platform products](threat-intelligence-integration.md#integrated-threat-intelligence-platform-products) that can be integrated with Microsoft Sentinel.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Prerequisites  

- In order to install, update and delete standalone content or solutions in content hub, you need the **Microsoft Sentinel Contributor** role at the resource group level.
- You must have either the **Global administrator** or **Security administrator** Microsoft Entra roles in order to grant permissions to your TIP product or to any other custom application that uses direct integration with the Microsoft Graph Security tiIndicators API.
- You must have read and write permissions to the Microsoft Sentinel workspace to store your threat indicators.

## Instructions

Follow these steps to import threat indicators to Microsoft Sentinel from your integrated TIP or custom threat intelligence solution:
1.	Obtain an Application ID and Client Secret from your Microsoft Entra ID
2.	Input this information into your TIP solution or custom application
3.	Enable the Threat Intelligence Platforms data connector in Microsoft Sentinel

<a name='sign-up-for-an-application-id-and-client-secret-from-your-azure-active-directory'></a>

### Sign up for an Application ID and Client secret from your Microsoft Entra ID

Whether you are working with a TIP or with a custom solution, the tiIndicators API requires some basic information to allow you to connect your feed to it and send it threat indicators. The three pieces of information you need are:

- Application (client) ID
- Directory (tenant) ID
- Client secret

You can get this information from your Microsoft Entra ID through a process called **App Registration** which includes the following three steps:

- Register an app with Microsoft Entra ID
- Specify the permissions required by the app to connect to the Microsoft Graph tiIndicators API and send threat indicators
- Get consent from your organization to grant these permissions to this application.

<a name='register-an-application-with-azure-active-directory'></a>

#### Register an application with Microsoft Entra ID

1. From the Azure portal, navigate to the **Microsoft Entra ID** service.
1. Select **App Registrations** from the menu and select **New registration**.
1. Choose a name for your application registration, select the **Single tenant** radio button, and select **Register**. 

    :::image type="content" source="media/connect-threat-intelligence-tip/threat-intel-register-application.png" alt-text="Register an application":::

1. From the resulting screen, copy the **Application (client) ID** and **Directory (tenant) ID** values. These are the first two pieces of information you’ll need later to configure your TIP or custom solution to send threat indicators to Microsoft Sentinel. The third, the **Client secret**, comes later.

#### Specify the permissions required by the application

1. Go back to the main page of the **Microsoft Entra ID** service.

1. Select **App Registrations** from the menu and select your newly registered app.

1. Select **API Permissions** from the menu and select the **Add a permission** button.

1. On the **Select an API** page, select the **Microsoft Graph** API and then choose from a list of Microsoft Graph permissions.

1. At the prompt "What type of permissions does your application require?" select **Application permissions**. This is the type of permissions used by applications authenticating with App ID and App Secrets (API Keys).

1. Select **ThreatIndicators.ReadWrite.OwnedBy** and select **Add permissions** to add this permission to your app’s list of permissions.

    :::image type="content" source="media/connect-threat-intelligence-tip/threat-intel-api-permissions-1.png" alt-text="Specify permissions":::

#### Get consent from your organization to grant these permissions

1. To get consent, you need a Microsoft Entra Global Administrator to select the **Grant admin consent for your tenant** button on your app’s **API permissions** page. If you do not have the Global Administrator role on your account, this button will not be available, and you will need to ask a Global Administrator from your organization to perform this step. 

    :::image type="content" source="media/connect-threat-intelligence-tip/threat-intel-api-permissions-2.png" alt-text="Grant consent":::

1. Once consent has been granted to your app, you should see a green check mark under **Status**.

Now that your app has been registered and permissions have been granted, you can get the last thing on your list - a client secret for your app.

1. Go back to the main page of the **Microsoft Entra ID** service.

1. Select **App Registrations** from the menu and select your newly registered app.

1. Select **Certificates & secrets** from the menu and select the **New client secret** button to receive a secret (API key) for your app.

    :::image type="content" source="media/connect-threat-intelligence-tip/threat-intel-client-secret.png" alt-text="Get client secret":::

1. Select the **Add** button and **copy the client secret**.

    > [!IMPORTANT]
    > You must copy the **client secret** before leaving this screen. You cannot retrieve this secret again if you navigate away from this page. You will need this value when you configure your TIP or custom solution.

### Input this information into your TIP solution or custom application

You now have all three pieces of information you need to configure your TIP or custom solution to send threat indicators to Microsoft Sentinel.

- Application (client) ID
- Directory (tenant) ID
- Client secret

1. Enter these values in the configuration of your integrated TIP or custom solution where required.

1. For the target product, specify **Azure Sentinel**.  (Specifying "Microsoft Sentinel" will result in an error.)

1. For the action, specify **alert**.

Once this configuration is complete, threat indicators will be sent from your TIP or custom solution, through the **Microsoft Graph tiIndicators API**, targeted at Microsoft Sentinel.

### Enable the Threat Intelligence Platforms data connector in Microsoft Sentinel

The last step in the integration process is to enable the **Threat Intelligence Platforms data connector** in Microsoft Sentinel. Enabling the connector is what allows Microsoft Sentinel to receive the threat indicators sent from your TIP or custom solution. These indicators will be available to all Microsoft Sentinel workspaces for your organization. Follow these steps to enable the Threat Intelligence Platforms data connector for each workspace:

1. From the [Azure portal](https://portal.azure.com/), navigate to the **Microsoft Sentinel** service.

1. Choose the **workspace** to which you want to import the threat indicators sent from your TIP or custom solution.

1. Select **Content hub** from the menu.

1. Find and select the **Threat Intelligence** solution using the list view.

1. Select the :::image type="icon" source="media/connect-threat-intelligence-tip/install-update-button.png"::: **Install/Update** button.

    For more information about how to manage the solution components, see [Discover and deploy out-of-the-box content](sentinel-solutions-deploy.md).

1. To configure the TIP data connector, select the **Data connectors** menu. 

1. Find and select the **Threat Intelligence Platforms** data connector > **Open connector page** button.

    :::image type="content" source="media/connect-threat-intelligence-tip/tip-data-connector-config.png" alt-text="Screenshot displaying the data connectors page with the TIP data connector listed." lightbox="media/connect-threat-intelligence-tip/tip-data-connector-config.png":::

1. As you’ve already completed the app registration and configured your TIP or custom solution to send threat indicators, the only step left is to select the **Connect** button.

Within a few minutes, threat indicators should begin flowing into this Microsoft Sentinel workspace. You can find the new indicators in the **Threat intelligence** blade, accessible from the Microsoft Sentinel navigation menu.

## Next steps

In this document, you learned how to connect your threat intelligence platform to Microsoft Sentinel. To learn more about Microsoft Sentinel, see the following articles.

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
