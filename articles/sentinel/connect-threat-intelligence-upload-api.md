---
title: Connect your TIP with upload indicators API
titleSuffix: Microsoft Sentinel
description: Learn how to connect your threat intelligence platform or custom feed by using the Upload Indicators API to Microsoft Sentinel.
author: austinmccollum
ms.topic: how-to
ms.date: 3/14/2024
ms.author: austinmc
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security


#Customer intent: As a security admin, I want to connect my threat intelligence platform with Microsoft Sentinel using the appropriate API so that I can centralize and enhance threat detection and response capabilities.

---

# Connect your threat intelligence platform to Microsoft Sentinel with the Upload Indicators API

Many organizations use threat intelligence platform (TIP) solutions to aggregate threat indicator feeds from various sources. From the aggregated feed, the data is curated to apply to security solutions such as network devices, EDR/XDR solutions, or security information and event management (SIEM) solutions such as Microsoft Sentinel. By using the Threat Intelligence Upload Indicators API, you can use these solutions to import threat indicators into Microsoft Sentinel. 

The Upload Indicators API ingests threat intelligence indicators into Microsoft Sentinel without the need for the data connector. The data connector only mirrors the instructions for connecting to the API endpoint described in this article and the API reference document [Microsoft Sentinel Upload Indicators API](upload-indicators-api.md).

:::image type="content" source="media/connect-threat-intelligence-upload-api/threat-intel-upload-api.png" alt-text="Screenshot that shows the threat intelligence import path.":::

For more information about threat intelligence, see [Threat intelligence](understand-threat-intelligence.md).

> [!IMPORTANT]
> The Microsoft Sentinel Threat Intelligence Upload Indicators API is in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for more legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> [!INCLUDE [unified-soc-preview-without-alert](includes/unified-soc-preview-without-alert.md)]

For more information, see [Connect Microsoft Sentinel to STIX/TAXII threat intelligence feeds](connect-threat-intelligence-taxii.md).

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Prerequisites

- To install, update, and delete standalone content or solutions in the **Content hub**, you need the Microsoft Sentinel Contributor role at the resource group level. You don't need to install the data connector to use the API endpoint.
- You must have read and write permissions to the Microsoft Sentinel workspace to store your threat indicators.
- You must be able to register a Microsoft Entra application.
- Your Microsoft Entra application must be granted the Microsoft Sentinel Contributor role at the workspace level.

## Instructions

Follow these steps to import threat indicators to Microsoft Sentinel from your integrated TIP or custom threat intelligence solution:

1. Register a Microsoft Entra application, and then record its application ID.
1. Generate and record a client secret for your Microsoft Entra application.
1. Assign your Microsoft Entra application the Microsoft Sentinel Contributor role or the equivalent.
1. Configure your TIP solution or custom application.

<a name='register-an-azure-ad-application'></a>

## Register a Microsoft Entra application

The [default user role permissions](../active-directory/fundamentals/users-default-permissions.md#restrict-member-users-default-permissions) allow users to create application registrations. If this setting was switched to **No**, you need permission to manage applications in Microsoft Entra. Any of the following Microsoft Entra roles include the required permissions:

- Application administrator
- Application developer
- Cloud application administrator

For more information on registering your Microsoft Entra application, see [Register an application](../active-directory/develop/quickstart-register-app.md#register-an-application).

After you register your application, record its application (client) ID from the application's **Overview** tab.

## Generate and record a client secret

Now that your application is registered, generate and record a client secret.

:::image type="content" source="media/connect-threat-intelligence-upload-api/threat-intel-client-secret.png" alt-text="Screenshot that shows client secret generation.":::

For more information on generating a client secret, see [Add a client secret](../active-directory/develop/quickstart-register-app.md#add-a-client-secret).

## Assign a role to the application

The Upload Indicators API ingests threat indicators at the workspace level and allows a least-privilege role of Microsoft Sentinel Contributor.

1. From the Azure portal, go to **Log Analytics workspaces**.
1. Select **Access control (IAM)**.
1. Select **Add** > **Add role assignment**.
1. On the **Role** tab, select the **Microsoft Sentinel Contributor** role, and then select **Next**.
1. On the **Members** tab, select **Assign access to** > **User, group, or service principal**.
1. Select members. By default, Microsoft Entra applications aren't displayed in the available options. To find your application, search for it by name.

    :::image type="content" source="media/connect-threat-intelligence-upload-api/assign-role.png" alt-text="Screenshot that shows the Microsoft Sentinel Contributor role assigned to the application at the workspace level.":::

1. Select **Review + assign**.

For more information on assigning roles to applications, see [Assign a role to the application](../active-directory/develop/howto-create-service-principal-portal.md#assign-a-role-to-the-application).

## Install the Threat Intelligence Upload Indicators API data connector in Microsoft Sentinel (optional)

Install the Threat Intelligence Upload Indicators API data connector to see the API connection instructions from your Microsoft Sentinel workspace.

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), under **Content management**, select **Content hub**. <br>For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Content management** > **Content hub**.

1. Find and select the **Threat Intelligence** solution.

1. Select the :::image type="icon" source="media/connect-mdti-data-connector/install-update-button.png"::: **Install/Update** button.

   For more information about how to manage the solution components, see [Discover and deploy out-of-the-box content](sentinel-solutions-deploy.md).

1. The data connector is now visible in **Configuration** > **Data connectors**. Open the **Data connectors** page to find more information on how to configure your application with this API.

    :::image type="content" source="media/connect-threat-intelligence-upload-api/upload-api-data-connector.png" alt-text="Screenshot that shows the Data connectors page with the Upload Indicators API data connector listed." lightbox="media/connect-threat-intelligence-upload-api/upload-api-data-connector.png":::

## Configure your threat intelligence platform solution or custom application

The following configuration information is required by the Upload Indicators API:

- Application (client) ID
- Client secret
- Microsoft Sentinel workspace ID

Enter these values in the configuration of your integrated TIP or custom solution where required.

1. Submit the indicators to the Microsoft Sentinel Upload Indicators API. To learn more about the Upload Indicators API, see [Microsoft Sentinel Upload Indicators API](upload-indicators-api.md).
1. Within a few minutes, threat indicators should begin flowing into your Microsoft Sentinel workspace. Find the new indicators on the **Threat intelligence** pane, which is accessible from the Microsoft Sentinel menu.
1. The data connector status reflects the **Connected** status. The **Data received** graph is updated after indicators are submitted successfully.

    :::image type="content" source="media/connect-threat-intelligence-upload-api/upload-api-data-connector-connected.png" alt-text="Screenshot that shows the Upload Indicators API data connector in the Connected state." lightbox="media/connect-threat-intelligence-upload-api/upload-api-data-connector-connected.png":::

## Related content

In this article, you learned how to connect your TIP to Microsoft Sentinel. To learn more about using threat indicators in Microsoft Sentinel, see the following articles:

- [Understand threat intelligence](understand-threat-intelligence.md).
- [Work with threat indicators](work-with-threat-indicators.md) throughout the Microsoft Sentinel experience.
- Get started detecting threats with [built-in](detect-threats-built-in.md) or [custom](detect-threats-custom.md) analytics rules in Microsoft Sentinel.
