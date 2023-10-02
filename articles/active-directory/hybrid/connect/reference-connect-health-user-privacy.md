---
title: Microsoft Entra Connect Health and user privacy
description: Learn about user privacy and data collection with Microsoft Entra Connect Health.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.subservice: hybrid
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: reference
ms.date: 01/19/2023
ms.author: billmath
ms.collection: M365-identity-device-management
---

# User privacy and Microsoft Entra Connect Health

This article describes Microsoft Entra Connect Health and user privacy. For information about Microsoft Entra Connect and user privacy, see [User privacy and Microsoft Entra Connect](reference-connect-user-privacy.md).

[!INCLUDE [Privacy](../../../../includes/gdpr-intro-sentence.md)]

## User privacy classification

Microsoft Entra Connect Health falls into the *data processor* category of GDPR classification. As a data processor pipeline, the service provides data processing services to key partners and end consumers. Microsoft Entra Connect Health doesn't generate user data, and it has no independent control over what personal data is collected and how it's used. Data retrieval, aggregation, analysis, and reporting in Microsoft Entra Connect Health are based on existing on-premises data.

## Data retention policy

Microsoft Entra Connect Health doesn't generate reports, perform analytics, or provide insights beyond 30 days. Therefore, Microsoft Entra Connect Health doesn't store, process, or retain any data beyond 30 days. This design is compliant with the GDPR regulations, Microsoft privacy compliance regulations, and Microsoft Entra data retention policies.

Servers that have active **Health service data is not up to date** error alerts for more than 30 consecutive days suggest that no data has reached Connect Health during that time. These servers will be disabled and not shown in the Connect Health portal. To re-enable the servers, you must uninstall and [reinstall the health agent](how-to-connect-health-agent-install.md). This doesn't apply to *warnings* for the same alert type. Warnings indicate that partial data is missing from the server you're alerted for.

## Disable data collection and monitoring

You can use Microsoft Entra Connect Health to stop data collection for a specific monitored server or for an instance of a monitored service. For example, you can stop data collection for individual Active Directory Federation Services (AD FS) servers that are monitored by using Microsoft Entra Connect Health. You can also stop data collection for the entire AD FS instance that's being monitored by using Microsoft Entra Connect Health. If you choose to stop data collection for a specific monitored server, the server is deleted from the Microsoft Entra Connect Health portal after data collection is stopped.

> [!IMPORTANT]
> To delete monitored servers from Microsoft Entra Connect Health, you must have either Microsoft Entra Global Administrator account permissions or the Contributor role in Azure role-based access control.
>
> Removing a server or service instance from Microsoft Entra Connect Health is *not* a reversible action.

### What to expect

If you stop data collection and monitoring for an individual monitored server or an instance of a monitored service, you can expect the following results:

- When you delete an instance of a monitored service, the instance is removed from the Microsoft Entra Connect Health monitoring service list in the portal.
- When you delete a monitored server or an instance of a monitored service, the health agent *isn't* uninstalled or removed from your servers. Instead, the health agent is configured to not send data to Microsoft Entra Connect Health. You must manually uninstall the health agent on a server that previously was monitored.
- If you don't uninstall the health agent before you delete a monitored server or an instance of a monitored service, you might see error events related to the health agent on the server.
- All data that belongs to the instance of the monitored service is deleted per the Microsoft Azure Data Retention Policy.

### Disable data collection and monitoring for a monitored server

See [How to remove a server from Microsoft Entra Connect Health](how-to-connect-health-operations.md#delete-a-server-from-the-azure-ad-connect-health-service).

### Disable data collection and monitoring for an instance of a monitored service

See [How to remove a service instance from Microsoft Entra Connect Health](how-to-connect-health-operations.md#delete-a-service-instance-from-azure-ad-connect-health-service).

### Disable data collection and monitoring for all monitored services

Microsoft Entra Connect Health provides the option to stop data collection of *all* registered services in the tenant. We recommend careful consideration and full acknowledgment of all hybrid identity administrators before you take this action. After the process begins, the Microsoft Entra Connect Health service stops receiving, processing, and reporting any data for all of your services. Existing data in Microsoft Entra Connect Health service is retained for no more than 30 days.

If you want to stop data collection on a specific server, complete the steps to delete a specific server. To stop data collection for a tenant, complete the following steps to stop data collection and delete all services for the tenant:

1. In the main menu under **Configuration**, select **General Settings**.
1. In the command bar, select **Stop Data Collection**. Other options for configuring the tenant settings are disabled after the process starts.  

   :::image type="content" source="media/reference-connect-health-user-privacy/gdpr4.png" alt-text="Screenshot that shows the command to stop data collection in the portal.":::

1. Check the list of onboarded services that are affected by stopping data collections.
1. Enter the exact tenant name to enable the **Delete** button.
1. Select **Delete** to initiate the deletion of all services. Microsoft Entra Connect Health will stop receiving, processing, and reporting any data that's sent from your onboarded services. The entire process of might take up to 24 hours. *This step isn't reversible*.

When the process is finished, you won't see any registered services in Microsoft Entra Connect Health.

:::image type="content" source="media/reference-connect-health-user-privacy/gdpr5.png" alt-text="Screenshot that shows the message that appears after data collection is stopped.":::

## Re-enable data collection and monitoring

To re-enable monitoring in Microsoft Entra Connect Health for a previously deleted monitored service, you must uninstall and [reinstall the health agent](how-to-connect-health-agent-install.md) on all the servers.

### Re-enable data collection and monitoring for all monitored services

For tenants, data collection can be resumed in Microsoft Entra Connect Health. We recommend careful consideration and full acknowledgment of all global administrators before you take this action.

> [!IMPORTANT]
> The following steps are available beginning 24 hours after a disable action. After you enable data collection, the presented insight and monitoring data in Microsoft Entra Connect Health won't show any data that was collected before the disable action.

1. In the main menu under **Configuration**, select **General Settings**.
1. In the command bar, select **Enable Data Collection**.

   :::image type="content" source="media/reference-connect-health-user-privacy/gdpr6.png" alt-text="Screenshot that shows the Enable Data Collection command in the portal.":::

1. Enter the exact tenant name to activate the **Enable** button.
1. Select **Enable** to grant permissions for data collection in the Microsoft Entra Connect Health service. The change will be applied shortly.
1. Follow the [installation process](how-to-connect-health-agent-install.md) to reinstall the agent in the servers to be monitored. The services will be present in the portal.  

## Next steps

- Review the [Microsoft privacy policy in the Trust Center](https://www.microsoft.com/trust-center).
- Learn about [Microsoft Entra Connect and user privacy](reference-connect-user-privacy.md).
