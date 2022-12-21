---
title: Trouble shoot the Azure Native New Relic Service
description: Learn about troubleshooting the Azure Native New Relic Service
ms.topic: conceptual

ms.date: 12/31/2022

---

# Troubleshoot Azure Native New Relic Service

This article describes how to contact support when working with Azure Native New Relic Service resource. Before contacting support, see Fix common errors.

To contact support regarding the Azure Native New Relic service, select **new support request** in the left pane of the resource. Select the link to go to the New Relic support website and raise a request.

## Contact support

![](media/new-relic-troubleshoot/image26.png)

## Fix common errors

This document contains information about troubleshooting your solutions that use New Relic.

### Purchase error

Purchase fails because a valid credit card is not connected to the Azure subscription, or a payment method is not associated with the subscription. Use a different Azure subscription. Or, add or update the credit card or payment method for the subscription. For more information, see [updating the credit and payment method.](/azure/cost-management-billing/manage/change-credit-card)

The EA subscription does not allow Marketplace purchases. Use a different subscription. Or check if your EA subscription is enabled for Marketplace purchase. For more information, see [Enable Marketplace purchases](/azure/cost-management-billing/manage/ea-azure-marketplace#enabling-azure-marketplace-purchases). If those options do not solve the problem, contact [New Relic support](https://support.newrelic.com/).

### Unable to create New Relic resource 

To set up the Azure Native New Relic service, you must have **Owner** access on the Azure subscription. Ensure that you have the appropriate access before starting the set up.

To find the New Relic offering in Azure and to setup, you must have registered the 'NewRelic.Observability' resource provider in your Azure subscription. Register the 'NewRelic.Observability' resource provider in your Azure subscription, either through the portal using the guidance [here](/azure/azure-resource-manager/management/resource-providers-and-types), or using command line with the following command: az provider register \--namespace NewRelic.Observability \--subscription \<subscription-id\>

### Logs not being emitted to New Relic

Only resource types listed in the list of [supported categories](/azure/azure-monitor/essentials/resource-logs-categories), will emit logs to New Relic through the integration. To verify whether the resource is emitting logs to New Relic, navigate to [Azure diagnostic setting](/azure/azure-monitor/platform/diagnostic-settings), for the specific resource and verify that there is a New Relic diagnostic setting.

### Install extension/ Uninstall extension on Virtual Machines inactive

Only virtual machines which currently do not have the New Relic agent installed should be selected together to install the extension. De-select any virtual machines with New Relic agent already installed, so that the 'Install Extension' button is active. '**Agent Status**' column in Virtual Machines blade will show the status 'Running' or 'Shutdown' for any virtual machines which already have New Relic agent installed.

Only virtual machines which currently have the New Relic agent installed should be selected together to uninstall the extension. De-select any virtual machines which do not have New Relic agent already installed, so that the 'Uninstall Extension' button is active. '**Agent Status**' column in Virtual Machines blade will show the status 'Not Installed' for any virtual machines which does not already have New Relic agent installed.

### Resource monitoring stopped working

Resource monitoring in New Relic is enabled through the ingest API key setup at the time of resource creation. Revoking the ingest API key from New Relic portal will disrupt logs and metrics monitoring for all resources including virtual machines and app services -- hence should NOT be done. If the API key is already revoked, kindly contact New Relic support.

In case your Azure subscription got suspended or deleted due to payment related issues, resource monitoring in New Relic will automatically stop. Use a different Azure subscription. Or, add or update the credit card or payment method for the subscription. For more information, see [updating the credit and payment method.](/azure/cost-management-billing/manage/change-credit-card)

## Next steps

- Learn about managing your instance of New Relic.
