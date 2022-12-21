---
title: Troubleshoot the Azure Native New Relic Service
description: Learn about troubleshooting the Azure Native New Relic Service
ms.topic: conceptual

ms.date: 12/31/2022

---

# Troubleshoot Azure Native New Relic Service

This article describes how to contact support when working with Azure Native New Relic Service resource. Before contacting support, see [Fix common errors.](#fix-common-errors)


## Contact support
To contact support regarding the Azure Native New Relic service, select **New Support Request** in the left pane of the resource. Select the link to go to the New Relic support website and raise a request.

:::image type="content" source="media/new-relic-troubleshoot/new-relic-support.png" alt-text="Screenshot showing New Support Request selected in the Resource menu.":::

## Fix common errors

This document contains information about troubleshooting your solutions that use New Relic.

### Purchase error

Purchase fails because a valid credit card isn't connected to the Azure subscription, or a payment method isn't associated with the subscription. Use a different Azure subscription. Or, add or update the credit card or payment method for the subscription. For more information, see [updating the credit and payment method.](/azure/cost-management-billing/manage/change-credit-card)

The EA subscription doesn't allow Marketplace purchases. Use a different subscription. Or check if your EA subscription is enabled for Marketplace purchase. For more information, see [Enable Marketplace purchases](/azure/cost-management-billing/manage/ea-azure-marketplace#enabling-azure-marketplace-purchases). If those options don't solve the problem, contact [New Relic support](https://support.newrelic.com/).

### Unable to create New Relic resource 

To set up the Azure Native New Relic service, you must have **Owner** access on the Azure subscription. Ensure that you have the appropriate access before starting the setup.

To find the New Relic offering in Azure and to set up, you must have registered the 'NewRelic.Observability' resource provider in your Azure subscription. Register the 'NewRelic.Observability' resource provider in your Azure subscription, either through the portal using the guidance [here](/azure/azure-resource-manager/management/resource-providers-and-types), or using command line with the following command: az provider register \--namespace NewRelic.Observability \--subscription \<subscription-id\>

### Logs not being emitted to New Relic

Only resource types listed in the list of [supported categories](/azure/azure-monitor/essentials/resource-logs-categories), emit logs to New Relic through the integration. To verify whether the resource is emitting logs to New Relic, navigate to [Azure diagnostic setting](/azure/azure-monitor/platform/diagnostic-settings) for the specific resource and verify that there's a New Relic diagnostic setting.

### Install extension/ Uninstall extension on Virtual Machines inactive

Only virtual machines without the New Relic agent installed should be selected together to install the extension. De-select any virtual machines with New Relic agent installed already so that the **Install Extension** is active. The **Agent Status** column shows the status **Running** or **Shutdown** for any virtual machines that already have the New Relic agent installed.

Only virtual machines that currently have the New Relic agent installed should be selected together to uninstall the extension. De-select any virtual machines that don't have New Relic agent already installed so that **Uninstall Extension** is active. The **Agent Status** column shows the status **Not Installed** for any virtual machines that doesn't already have the New Relic agent installed.

### Resource monitoring stopped working

Resource monitoring in New Relic is enabled through the `ingest API key`, which was set-up at the time of resource creation. Revoking the `ingest API key` from New Relic portal disrupts logs and metrics monitoring for all resources including virtual machines and app services. You should NOT revoke the `ingest API key`. If the API key is already revoked, contact New Relic support.

In case your Azure subscription got suspended or deleted due to payment related issues, resource monitoring in New Relic automatically stops. Use a different Azure subscription. Or, add or update the credit card or payment method for the subscription. For more information, see [updating the credit and payment method.](/azure/cost-management-billing/manage/change-credit-card)

## Next steps

- [Manage the Azure Native New Relic Service](new-relic-how-to-manage.md)
