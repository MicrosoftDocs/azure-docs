---
title: Unified Connectors Platform for Microsoft Security Solutions
description: Learn about the Unified Connectors Platform that simplifies connector management across Microsoft security products including Microsoft Sentinel, Defender for Cloud, and Defender for Identity.
author: mberdugo
contributors:
ms.topic: concept-article
ms.date: 07/10/2025
ms.author: monaberdugo
ms.reviewer: 

#customer intent: As a Microsoft Defender for Identity user, I want to understand how unified connectors work so I can manage my integration connections more efficiently.
---

# Unified Connectors Overview

The Unified connectors platform enables you to connect to several different Microsoft security products using a single connector. This platform simplifies the connector management experience across Microsoft security products.

Unified connectors provide the following benefits:

- Reduced Development Overhead and Time-to-Market
- Enhanced Customer Experience
- Connect only once
- Centralized Management
- Enhanced Security
- Cost Reduction
- Streamlined Development for non-Microsoft Connectors
- Unified Response and Remediation Actions

## Unified services

The unified connectors platform provides unified services shared by all security products to allow consistent development and user experience. These services include:

### One time collection

Different products collect the same data from the same source for different scenarios. For example, Okta Single Sign On system logs are collected every five minutes both by Microsoft Sentinel and Defender for Identity users. This duplication and inefficient and can cause customers to exceed their API rate limit due to the quotas imposed by Okta.

The unified connector unifies two or more products that have similar collection rules and collects the data once for all products as illustrated in the following diagram:

:::image type="content" source="./media/unified-connector/unified-connector-structure.png" alt-text="Diagram showing Okta data flowing into the unified collector and from there to Sentinel, MDI, and Microsoft security exposure management.":::

### Consistent Single Management across all security products

Users can manage all their connectors in one place through the Unified Security Experience (USX) portal and unified (Graph) API.

### One time authentication

The platform provides a unified credentials service to store credentials for all connectors, enhancing security and usability.

### Unified health service

The platform includes a unified health service that provides status, volume graphs, and notifications for all connectors. All health issues are stored to a shared health table that is accessible to all users through [Advanced Hunting](/defender-xdr/advanced-hunting-microsoft-defender).

:::image type="content" source="./media/unified-connector/unified-health.png" alt-text="Screenshot of Okta connector with health information on the right side.":::

### Unified development and testing processes

The platform allows consistent self-service development experience for all connectors’ developers, including Microsoft Teams, partners, ISVs, and end users.

The API and the UI are designed to allow flexibility and agility for partners. For example, one partner might develop connectors for one product and another partner can extend that connector to send data to a different product etc.

The unified platform also includes a shared testing lab to allow testing scale and functionality once for all products.

### Integration with Microsoft data lake

The platform allows integration with data lake, including enabling data federation.

### Lifecycle management

Unified connectors are pre-installed with the latest version eliminating the need for manual updates. XDR customers can still discover connections through the content hub.

## Supported Products

The Unified Connectors Platform is currently available for the following Microsoft security products:

- Microsoft Sentinel
- Microsoft Defender for Identity

Currently, Defender for Cloud Apps and Microsoft Security Exposure Management aren't supported and these customers should continue using their old connectors.

## Supported Connectors

Currently, the Unified Connectors Platform is available in preview for [Okta Single Sign-On connectors](/defender-xdr/okta-integration.md) shared by Microsoft Sentinel, Microsoft Defender for Identity and Microsoft Security Exposure Management.

## Data connectors gallery

The available unified connectors are shown in the [Data connectors Gallery](https://security.microsoft.com/sentinel/unified-connector) **Catalog** tab.

:::image type="content" source="./media/unified-connector/connectors-gallery.png" alt-text="Screenshot of catalog tab in connectors gallery.":::

Here you can see all the available unified connectors. There are also links to the product specific connectors. The connectors column of the table indicates how many. The connectors column of the table shows you how many connector instances this connector currently has. The table also shows who supports the connector and who the provider is.

The **My Connectors** tab shows the connectors that are currently configured. The **Unified connectors** tab shows the unified connectors that are available to you. You can select a connector to see its health information and manage it.

:::image type="content" source="./media/unified-connector/connector-info.png" alt-text="Screenshot of my connectors tab in connectors gallery.":::

Connector health information available in the **My Connectors** tab includes:

- **Name**: The name of the connector.
- **Status**: The status of the connector, such as *OK*, *Warning*, or *Error*.
- **Audit details**: Created and updated information.
- **Workspace**: The workspace to which the connector is connected.
- **Table**: The table that is used by the connector.
- **Last health messages**: The latest error messages.

The Sentinel tab shows the connectors that are available only to Sentinel as the appear in the content hub.

## Considerations and limitations

- The unified connectors scope doesn't include unified data flow. Once the data is collected and sent to the event hub of each product, each product is responsible for storing the data and providing its unique security value on top of the data.
- The unified connectors scope doesn't include billing. Each individual product is responsible for how its users are charged

## Related content

[Integrate Microsoft Sentinel with unified connectors](./integrate-unified-connector.md)
