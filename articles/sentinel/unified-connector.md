---
title: Unified Connectors Platform for Microsoft Sentinel
description: Learn about the Unified Connectors Platform that simplifies connector management across Microsoft security products including Microsoft Sentinel, Defender for Cloud, and Defender for Identity.
author: mberdugo
contributors:
ms.topic: concept-article
ms.date: 08/10/2025
ms.author: monaberdugo
ms.reviewer: Oded Weber
ms.custom: references_regions

#customer intent: As a Microsoft Defender for Identity user, I want to understand how unified connectors work so I can manage my integration connections more efficiently.
---

# Unified connectors overview

The Unified connectors platform enables you to connect once to an external product that provides value in multiple Microsoft security products. This platform simplifies the connector management experience across Microsoft security products.

Unified connectors provide the following benefits:

- Connect and collect the data once for use with multiple Microsoft security products
- Centralized Management
- Enhanced Security: Credentials stored once
- Cost Reduction: Reduced API calls and data duplication

## Unified services

The unified connectors platform provides unified services shared by all security products to allow consistent development and user experience. These services include:

### Unified collector service

Multiple Microsoft Security products often collect the same data from the same external source for different scenarios. For example, Okta Single Sign On system logs are collected every five minutes both by Microsoft Sentinel and Defender for Identity users. This duplication and inefficiency can cause customers to exceed their API rate limit due to the quotas imposed by Okta.

The unified collector is applied to two or more Microsoft Security products connecting to the same external source and having similar data collection needs. It collects the data once for all products as shown in the following diagram:

:::image type="content" source="./media/unified-connector/unified-connector-structure.png" alt-text="Diagram showing Okta data flowing into the unified collector and from there to Microsoft Sentinel, MDI, and Microsoft security exposure management.":::

### Consistent single management across all security products

Users can manage all their connectors in one place through the Unified Security Experience (USX) portal.

### One time authentication

When configuring a unified connector, you enter your credentials for the external product only once. Your credentials are stored and managed in a unified credentials service serving all applicable connections to this product. This enhances security of credentials management along with usability.

### Unified health service

All health issues are stored to a shared health table that is accessible to all users through [Advanced Hunting](/defender-xdr/advanced-hunting-microsoft-defender).

:::image type="content" source="./media/unified-connector/unified-health.png" alt-text="Screenshot of Okta connector with health information on the right side." lightbox="./media/unified-connector/unified-health-focus.png":::

### Integration with Microsoft data lake

The platform allows integration with data lake, including enabling data federation.

### Lifecycle management

Unified connectors are preinstalled with the latest version where possible, minimizing the need for manual updates.

## Supported products

The Unified Connectors Platform currently supports connectors serving the following Microsoft security products:

- Microsoft Sentinel
- Microsoft Defender for Identity

Currently, Defender for Cloud Apps and Microsoft Security Exposure Management aren't supported and these customers should continue using their current connectors.

## Supported connectors

Currently, the Unified Connectors Platform is available in preview for Okta single sign-on connectors shared by [Microsoft Sentinel](./unified-connector-integration.md) and [Microsoft Defender for Identity](/defender-for-identity/okta-integration).

## Data connectors gallery

The available unified connectors are shown in the [Data connectors Gallery](https://security.microsoft.com/sentinel/unified-connector) **Catalog** tab.

:::image type="content" source="./media/unified-connector/connectors-gallery.png" alt-text="Screenshot of catalog tab in connectors gallery.":::

You can see all the available unified connectors in this tab. There are also links to other product specific connectors galleries. The connectors column of the table shows you how many connector instances this connector currently has. The table also shows who supports the connector and who the provider is.

The **My Connectors** tab shows the connectors that are currently configured. The **Unified connectors** tab shows the unified connectors that are available to you, while the Microsoft Sentinel tab shows connectors that are available only to Sentinel as they appear in the content hub.

:::image type="content" source="./media/unified-connector/connector-info.png" alt-text="Screenshot of my connectors tab in connectors gallery.":::

Under the Unified connectors tab, you can select a connector to see and manage its health information.

Connector health information available in the **My Connectors** tab includes:

- **Name**: The name of the connector.
- **Status**: The status of the connector, such as *OK*, *Warning*, or *Error*.
- **Audit details**: Created and updated information.
- **Workspace**: The workspace to which the connector is connected.
- **Table**: The table that is used by the connector.
- **Last health messages**: The latest error messages.

The Sentinel tab shows the connectors that are available only to Sentinel as the appear in the content hub.

## Considerations and limitations

- Billing for Connectors data is managed separately for each individual Microsoft security product, in accordance with its use cases and benefits.
- The unified connectors feature isn't supported for tenants in the United Arab Emirates region.
- Unified connectors are the preferred way to create a connection. If you already have an Okta connector, you can disconnect it and install a unified connector so that you only collect the system logs once. We don't recommend having both a unified connector and a product specific connector for the same data source.
- Currently, for Sentinel, unified connectors aren't part of solutions and can't be discovered through content hub.
- Currently the unified connectors platform doesn't allow self-service development for third parties.
