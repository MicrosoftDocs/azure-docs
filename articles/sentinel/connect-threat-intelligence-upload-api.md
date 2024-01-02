---
title: Connect your threat intelligence platform with upload indicators API
titleSuffix: Microsoft Sentinel
description: Learn how to connect your threat intelligence platform (TIP) or custom feed using the upload indicators API to Microsoft Sentinel.
author: austinmccollum
ms.topic: how-to
ms.date: 07/10/2023
ms.author: austinmc
---

# Connect your threat intelligence platform to Microsoft Sentinel with the upload indicators API

Many organizations use threat intelligence platform (TIP) solutions to aggregate threat indicator feeds from various sources. From the aggregated feed, the data is curated to apply to security solutions such as network devices, EDR/XDR solutions, or SIEMs such as Microsoft Sentinel. The **Threat Intelligence Upload Indicators API** data connector allows you to use these solutions to import threat indicators into Microsoft Sentinel. 

This data connector uses the Sentinel upload indicators API to ingest threat intelligence indicators into Microsoft Sentinel.

:::image type="content" source="media/connect-threat-intelligence-upload-api/threat-intel-upload-api.png" alt-text="Threat intelligence import path":::

Learn more about [Threat Intelligence](understand-threat-intelligence.md) in Microsoft Sentinel.

> [!IMPORTANT]
> The Microsoft Sentinel upload indicators API and **Threat Intelligence Upload Indicators API** data connector are in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

**See also**: [Connect Microsoft Sentinel to STIX/TAXII threat intelligence feeds](connect-threat-intelligence-taxii.md)

## Prerequisites  
- In order to install, update and delete standalone content or solutions in content hub, you need the **Microsoft Sentinel Contributor** role at the resource group level.
- You must have read and write permissions to the Microsoft Sentinel workspace to store your threat indicators.
- You must be able to register a Microsoft Entra application. 
- The Microsoft Entra application must be granted the Microsoft Sentinel contributor role at the workspace level.

## Instructions
Follow these steps to import threat indicators to Microsoft Sentinel from your integrated TIP or custom threat intelligence solution:
1. Register a Microsoft Entra application and record its application ID.
1. Generate and record a client secret for your Microsoft Entra application.
1. Assign your Microsoft Entra application the Microsoft Sentinel contributor role or equivalent.
1. Enable the Threat Intelligence upload API data connector in Microsoft Sentinel.
1. Configure your TIP solution or custom application.

<a name='register-an-azure-ad-application'></a>

### Register a Microsoft Entra application

The [default user role permissions](../active-directory/fundamentals/users-default-permissions.md#restrict-member-users-default-permissions) allow users to create application registrations. If this setting has been switched to **No**, you'll need permission to manage applications in Microsoft Entra ID. Any of the following Microsoft Entra roles include the required permissions:
- Application administrator
- Application developer
- Cloud application administrator

For more information on registering your Microsoft Entra application, see [Register an application](../active-directory/develop/quickstart-register-app.md#register-an-application).

Once you've registered your application, record its Application (client) ID from the application's **Overview** tab.

### Generate and record client secret

Now that your application has been registered, generate and record a client secret.

:::image type="content" source="media/connect-threat-intelligence-upload-api/threat-intel-client-secret.png" alt-text="Screenshot showing client secret generation.":::

For more information on generating a client secret, see [Add a client secret](../active-directory/develop/quickstart-register-app.md#add-a-client-secret).

### Assign a role to the application
The upload indicators API ingests threat indicators at the workspace level and allows a least privilege role of Microsoft Sentinel contributor.

1. From the Azure portal, go to Log Analytics workspaces.
1. Select **Access control (IAM)**.
1. Select **Add** > **Add role assignment**.
1. In the **Role** tab, select the **Microsoft Sentinel Contributor** role > **Next**.
1. On the **Members** tab, select **Assign access to** > **User, group, or service principal**.
1. **Select members**. By default, Microsoft Entra applications aren't displayed in the available options. To find your application, search for it by name.
    :::image type="content" source="media/connect-threat-intelligence-upload-api/assign-role.png" alt-text="Screenshot showing the Microsoft Sentinel contributor role assigned to the application at the workspace level.":::

1. **Select** > **Review + assign**.  

For more information on assigning roles to applications, see [Assign a role to the application](../active-directory/develop/howto-create-service-principal-portal.md#assign-a-role-to-the-application).

### Enable the Threat Intelligence upload indicators API data connector in Microsoft Sentinel

Enable the **Threat Intelligence Upload Indicators API** data connector to allow Microsoft Sentinel to receive threat indicators sent from your TIP or custom solution. These indicators are available to the Microsoft Sentinel workspace you configure.

1. From the [Azure portal](https://portal.azure.com/), navigate to the **Microsoft Sentinel** service.
1. Choose the **workspace** where you want to import the threat indicators.
1. Select **Content hub** from the menu.
1. Find and select the **Threat Intelligence** solution using the list view.
1. Select the :::image type="icon" source="media/connect-threat-intelligence-tip/install-update-button.png"::: **Install/Update** button.

    For more information about how to manage the solution components, see [Discover and deploy out-of-the-box content](sentinel-solutions-deploy.md).

1. The data connector is now visible in **Data Connectors** page. Open the data connector page to find more information on configuring your application to this API.

    :::image type="content" source="media/connect-threat-intelligence-upload-api/upload-api-data-connector.png" alt-text="Screenshot displaying the data connectors page with the upload API data connector listed." lightbox="media/connect-threat-intelligence-upload-api/upload-api-data-connector.png":::

### Configure your TIP solution or custom application

The following configuration information required by the upload indicators API:
- Application (client) ID
- Client secret
- Microsoft Sentinel workspace ID

Enter these values in the configuration of your integrated TIP or custom solution where required.

1. Submit the indicators to the Microsoft Sentinel upload API. To learn more about the upload indicators API, see the reference document [Microsoft Sentinel upload indicators API](upload-indicators-api.md). 
1. Within a few minutes, threat indicators should begin flowing into your Microsoft Sentinel workspace. Find the new indicators in the **Threat intelligence** blade, accessible from the Microsoft Sentinel navigation menu.
1. The data connector status reflects the **Connected** status and the **Data received** graph is updated once indicators are submitted successfully. 

    :::image type="content" source="media/connect-threat-intelligence-upload-api/upload-api-data-connector-connected.png" alt-text="Screenshot showing upload indicators API data connector in the connected state." lightbox="media/connect-threat-intelligence-upload-api/upload-api-data-connector-connected.png":::

## Next steps

In this document, you learned how to connect your threat intelligence platform to Microsoft Sentinel. To learn more about using threat indicators in Microsoft Sentinel, see the following articles.

- [Understand threat intelligence](understand-threat-intelligence.md).
- [Work with threat indicators](work-with-threat-indicators.md) throughout the Microsoft Sentinel experience.
- Get started detecting threats with [built-in](detect-threats-built-in.md) or [custom](detect-threats-custom.md) analytics rules in Microsoft Sentinel.
