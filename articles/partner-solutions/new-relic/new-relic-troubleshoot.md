---
title: Troubleshoot Azure Native New Relic Service
description: Learn about troubleshooting Azure Native New Relic Service.
ms.topic: conceptual

ms.date: 01/16/2023

---

# Troubleshoot Azure Native New Relic Service

This article describes how to fix common problems when you're working with Azure Native New Relic Service resources.

Try the troubleshooting information in this article first. If that doesn't work, contact New Relic support:

1. In the Azure portal, go to the resource.
1. On the left pane, under **Support + troubleshooting**, select **New Support Request**.
1. Select the link to go to the [New Relic support website](https://support.newrelic.com/) and raise a request.

:::image type="content" source="media/new-relic-troubleshoot/new-relic-support.png" alt-text="Screenshot that shows the pane for a New Relic support request.":::

## Fix common errors

[!INCLUDE [marketplace-purchase-errors](../includes/marketplace-purchase-errors.md)]

### You can't create a New Relic resource

To set up Azure Native New Relic Service, you must have owner access on the Azure subscription. Ensure that you have the appropriate access before you start the setup.

To find the New Relic offering on Azure and set up the service, you must first register the `NewRelic.Observability` resource provider in your Azure subscription. To register the resource provider by using the Azure portal, follow the guidance in [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).
To register the resource provider from a command line, enter `az provider register --namespace NewRelic.Observability --subscription <subscription-id>`.

### Logs aren't being sent to New Relic

Only resource types in [supported categories](../../azure-monitor/essentials/resource-logs-categories.md) send logs to New Relic through the integration. To check whether the resource is set up to send logs to New Relic, go to the [Azure diagnostic settings](/azure/azure-monitor/platform/diagnostic-settings) for that resource. Then, verify that there's a New Relic diagnostic setting.

### You can't install or uninstall an extension on a virtual machine

Only virtual machines without the New Relic agent installed should be selected together to install the extension. Deselect any virtual machines that already have the New Relic agent installed, so that **Install Extension** is active. The **Agent Status** column shows the status **Running** or **Shutdown** for any virtual machines that already have the New Relic agent installed.

Only virtual machines that currently have the New Relic agent installed should be selected together to uninstall the extension. Deselect any virtual machines that don't already have the New Relic agent installed, so that **Uninstall Extension** is active. The **Agent Status** column shows the status **Not Installed** for any virtual machines that don't already have the New Relic agent installed.

### Resource monitoring stopped working

Resource monitoring in New Relic is enabled through the *ingest API key*, which you set up at the time of resource creation. Revoking the ingest API key from the New Relic portal disrupts monitoring of logs and metrics for all resources, including virtual machines and app services. You shouldn't* revoke the ingest API key. If the API key is already revoked, contact New Relic support.

If your Azure subscription is suspended or deleted because of payment-related issues, resource monitoring in New Relic automatically stops. Use a different Azure subscription. Or, add or update the credit card or payment method for the subscription. For more information, see [Add, update, or delete a payment method](../../cost-management-billing/manage/change-credit-card.md).

New Relic manages the APIs for creating and managing resources, and for the storage and processing of customer telemetry data. The New Relic APIs might be on or outside Azure. If your Azure subscription and resource are working correctly but the New Relic portal shows problems with monitoring data, contact New Relic support.

## Next steps

- [Manage Azure Native New Relic Service](new-relic-how-to-manage.md)
- Get started with Azure Native New Relic Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/NewRelic.Observability%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/newrelicinc1635200720692.newrelic_liftr_payg?tab=Overview)
