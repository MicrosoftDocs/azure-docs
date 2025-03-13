---
title: Connect your TIP with the upload API (Preview)
titleSuffix: Microsoft Sentinel

description: Learn how to connect your threat intelligence platform (TIP) or custom feed using the upload API to Microsoft Sentinel.
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

# Connect your threat intelligence platform to Microsoft Sentinel with the upload API (Preview)

Many organizations use threat intelligence platform (TIP) solutions to aggregate threat intelligence feeds from various sources. From the aggregated feed, the data is curated to apply to security solutions such as network devices, EDR/XDR solutions, or security information and event management (SIEM) solutions such as Microsoft Sentinel. The industry standard for describing cyberthreat information is called, "Structured Threat Information Expression" or STIX. By using the upload API which supports STIX objects, you use a more expressive way to import threat intelligence into Microsoft Sentinel.

The upload API ingests threat intelligence into Microsoft Sentinel without the need for a data connector. This article describes what you need to connect. For more information on the API details, see the reference document [Microsoft Sentinel upload API](stix-objects-api.md).

:::image type="content" source="media/connect-threat-intelligence-upload-api/threat-intel-upload-api.png" alt-text="Screenshot that shows the threat intelligence import path.":::

For more information about threat intelligence, see [Threat intelligence](understand-threat-intelligence.md).

> [!IMPORTANT]
> The Microsoft Sentinel threat intelligence upload API is in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for more legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> [!INCLUDE [unified-soc-preview-without-alert](includes/unified-soc-preview-without-alert.md)]

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Prerequisites

- You must have read and write permissions to the Microsoft Sentinel workspace to store your threat intelligence STIX objects.
- You must be able to register a Microsoft Entra application.
- Your Microsoft Entra application must be granted the Microsoft Sentinel Contributor role at the workspace level.

## Instructions

Follow these steps to import threat intelligence STIX objects to Microsoft Sentinel from your integrated TIP or custom threat intelligence solution:

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

## Assign a role to the application

The upload API ingests threat intelligence objects at the workspace level and requires the role of Microsoft Sentinel Contributor.

1. From the Azure portal, go to **Log Analytics workspaces**.
1. Select **Access control (IAM)**.
1. Select **Add** > **Add role assignment**.
1. On the **Role** tab, select the **Microsoft Sentinel Contributor** role, and then select **Next**.
1. On the **Members** tab, select **Assign access to** > **User, group, or service principal**.
1. Select members. By default, Microsoft Entra applications aren't displayed in the available options. To find your application, search for it by name.

    :::image type="content" source="media/connect-threat-intelligence-upload-api/assign-role.png" alt-text="Screenshot that shows the Microsoft Sentinel Contributor role assigned to the application at the workspace level.":::

1. Select **Review + assign**.

For more information on assigning roles to applications, see [Assign a role to the application](../active-directory/develop/howto-create-service-principal-portal.md#assign-a-role-to-the-application).

## Configure your threat intelligence platform solution or custom application

The following configuration information is required by the upload API:

- Application (client) ID
- Microsoft Entra access token with [OAuth 2.0 authentication](../active-directory/fundamentals/auth-oauth2.md)
- Microsoft Sentinel workspace ID

Enter these values in the configuration of your integrated TIP or custom solution where required.

1. Submit the threat intelligence to the upload API. For more information, see [Microsoft Sentinel upload API](stix-objects-api.md).
1. Within a few minutes, threat intelligence objects should begin flowing into your Microsoft Sentinel workspace. Find the new STIX objects on the **Threat intelligence** page, which is accessible from the Microsoft Sentinel menu.

## Related content

In this article, you learned how to connect your TIP to Microsoft Sentinel. To learn more about using threat intelligence in Microsoft Sentinel, see the following articles:

- [Understand threat intelligence](understand-threat-intelligence.md).
- [Work with threat indicators](work-with-threat-indicators.md) throughout the Microsoft Sentinel experience.
- Get started detecting threats with [built-in](detect-threats-built-in.md) or [custom](detect-threats-custom.md) analytics rules in Microsoft Sentinel.
