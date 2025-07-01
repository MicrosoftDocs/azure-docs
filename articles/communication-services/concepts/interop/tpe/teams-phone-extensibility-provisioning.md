---
title: Teams Phone extensibility provisioning
titleSuffix: An Azure Communication Services article
description: This article describes how to provision for Teams Phone extensibility.
author: vac0224
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.date: 05/22/2025
ms.topic: conceptual
ms.author: henikaraa
ms.custom: public_preview
services: azure-communication-services
---

# Provisioning and authorization

[!INCLUDE [public-preview-notice.md](../../../includes/public-preview-include-document.md)]

## Provisioning

A Teams resource account (RA) must include an association to the Contact Center as a Service (CCaaS) Azure Communication Services Resource. The RA provisioning process to a CCaaS app follows a similar process used today to assign an RA to MS Teams Call Queues and Auto Attendants. For more information, see [Manage Resource Accounts](/microsoftteams/manage-resource-accounts).

To provision the RA for the CCaaS service the Teams Admin uses a cmdlet to create (or change) the RA using the CCaaS AppID. For more information, see the article on GitHub [Register calling bot](https://microsoftgraph.github.io/microsoft-graph-comms-samples/docs/articles/calls/register-calling-bot.html).

The Teams admin then assigns the Azure Communication Services Resource ID used by the CCaaS
service to the RA. The CCaaS admin provides these IDs to the Teams admin. Once the RA is assigned the CCaaS app can retrieve the Azure Communication Services Resource IDs from MS Graph, including their Display Name and Phone number. The RA assignment also provides access consent for the RA.

:::image type="content" source="./media/teams-phone-extensibility-provisioning-call-flow.png" alt-text="Diagram shows the Provisioning flow from Resource Account through number acquisition and number assignment to finish provisioning."  lightbox="./media/teams-phone-extensibility-provisioning-call-flow.png":::

## Authorization

### Custom Teams Client Authorization for Teams Persona

The CCaaS and Microsoft 365 administrators must authorize the use of Teams Phone in the contact center for both the agent (custom Teams client for Teams Persona) and server-side experiences. The custom Teams client authorization is a one-time process for the CCaaS client app (Calling
SDK).

We use a custom Teams endpoint client built using Azure Communication Services Client SDK. The process to authorize the custom client is defined here and there is no difference for this
release. For more information, see [Manage Teams Identity](../../../quickstarts/manage-teams-identity.md).

### Server Authorization

After the Teams admin creates one or more Teams Resource Accounts, the CCaaS administrators must authorize the CCaaS Service to receive Teams calls. Authorization is a one-time process for
the CCaaS server app (Call Automation SDK). The CCaaS administrator initiates the consent process in their CCaaS Administration Portal.

The administrator needs to set up / enable Teams calls (Contoso implementation specific) to their CCaaS service. This setup initiates a backend process by the CCaaS service and uses a new Microsoft Graph API to fetch the Teams Resource Accounts and presents them to the CCaaS
admin user. The CCaaS admin selects a Teams Resource Account. Then the CCaaS Admin function triggers a new Azure Communication Services Consent API to link the Teams Resource Account with the Azure Communication Services Resource ID.

### Custom Teams Client Authorization for CCaaS Persona

When a CCaaS decides to use CCaaS Persona, the CCaaS and Microsoft 365 administrators must also authorize the use of Teams Phone in the contact center for this custom client. The custom client authorization is a one-time process for the CCaaS client app (Calling SDK).

The process starts with a Microsoft 365 Admin installing a Microsoft Entra ID app. Once the app is installed, the CCaaS developer creates their own Microsoft Entra App and then grant permissions to the app created by the Microsoft 365 Admin to the CCaaS app.

The CCaaS developer then consumes a new consent API to provide consent to either the Teams Tenant, Teams authorized user, or a Microsoft Entra group. The implementor needs to choose which is best for their customer and organization based on policy. Once the admin provides consent, the CCaaS developer can then develop the runtime flows to exchange a Microsoft Entra token for an Access token and use the Access token in the Azure Communication Services client SDK to
instantiate a calling agent to make and receive call.

## Next steps

- [Teams Phone System extensibility quickstart](../../../quickstarts/tpe/teams-phone-extensibility-quickstart.md)
- [Cost and connectivity options](teams-phone-extensibility-connectivity-cost.md)

## Related articles

- [Teams Phone extensibility overview](./teams-phone-extensibility-overview.md)
- [Teams Phone extensibility capabilities](./teams-phone-extensibility-capabilities.md)
- [Teams Phone extensibility FAQ](./teams-phone-extensibility-faq.md)
- [Teams Phone extensibility troubleshooting](./teams-phone-extensibility-troubleshooting.md)
