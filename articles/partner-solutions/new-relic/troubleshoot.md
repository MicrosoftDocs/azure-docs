---
title: Troubleshoot Azure Native New Relic Service
description: Learn about troubleshooting Azure Native New Relic Service.
ms.topic: conceptual

ms.date: 01/16/2023

---

# Troubleshoot Azure Native New Relic Service

This article describes how to fix common problems when you're working with Azure Native New Relic Service resources.

## Marketplace purchase errors

[!INCLUDE [marketplace-purchase-errors](../includes/marketplace-purchase-errors.md)]

## Can't create a New Relic resource

To set up Azure Native New Relic Service, you must have owner access on the Azure subscription. Ensure that you have the appropriate access before you start the setup.

To find the New Relic offering on Azure and set up the service, you must first register the `NewRelic.Observability` resource provider in your Azure subscription. To register the resource provider by using the Azure portal, follow the guidance in [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).
To register the resource provider from a command line, enter `az provider register --namespace NewRelic.Observability --subscription <subscription-id>`.

## Logs aren't being sent to New Relic

Only resource types in [supported categories](/azure/azure-monitor/essentials/resource-logs-categories) send logs to New Relic through the integration. To check whether the resource is set up to send logs to New Relic, go to the [Azure diagnostic settings](/azure/azure-monitor/platform/diagnostic-settings) for that resource. Then, check that there's a New Relic diagnostic setting.

## Can't install or uninstall an extension on a virtual machine

Only virtual machines without the New Relic agent installed should be selected together to install the extension. Deselect any virtual machines that already have the New Relic agent installed, so that **Install Extension** is active. The **Agent Status** column shows the status **Running** or **Shutdown** for any virtual machines that already have the New Relic agent installed.

Only virtual machines that currently have the New Relic agent installed should be selected together to uninstall the extension. Deselect any virtual machines that don't already have the New Relic agent installed, so that **Uninstall Extension** is active. The **Agent Status** column shows the status **Not Installed** for any virtual machines that don't already have the New Relic agent installed.

## Resource monitoring stopped working

Resource monitoring in New Relic is enabled through the *ingest API key*, which you set up at the time of resource creation. Revoking the ingest API key from the New Relic portal disrupts monitoring of logs and metrics for all resources, including virtual machines and app services. You shouldn't revoke the ingest API key. If the API key is already revoked, contact New Relic support.

If your Azure subscription is suspended or deleted because of payment-related issues, resource monitoring in New Relic automatically stops. Use a different Azure subscription. Or, add or update the credit card or payment method for the subscription. For more information, see [Add, update, or delete a payment method](../../cost-management-billing/manage/change-credit-card.md).

New Relic manages the APIs for creating and managing resources, and for the storage and processing of customer telemetry data. The New Relic APIs might be on or outside Azure. If your Azure subscription and resource are working correctly but the New Relic portal shows problems with monitoring data, contact New Relic support.

## Diagnostic settings are active even after disabling the New Relic resource or applying necessary tag rules

If logs are being emitted and diagnostic settings remain active on monitored resources even after the New Relic resource is disabled or tag rules were modified to exclude certain resources, it's likely that there's a delete lock applied to the resources or the resource group containing the resource. This lock prevents the cleanup of the diagnostic settings, and hence, logs continue to be forwarded for those resources. To fix the issue, remove the delete lock from the resource or the resource group. If the lock is removed after the New Relic resource is deleted, the diagnostic settings have to be cleaned up manually to stop log forwarding.

[!INCLUDE [diagnostic-settings](../includes/diagnostic-settings.md)]

## Logs are being forwarded even after the Azure Native New Relic resource is deleted

If logs are being emitted even after the Azure Native New Relic resource is deleted, it could be because there is a resource lock present on one of the Azure resources being monitored. It will take 24 hours for the log forwarding to stop for the resources where the resource lock is present. 

## Any updates made to the tag rules within the Azure Native New Relic resource doesn't change the log flow immediately 

It takes an hour for any modification of the tag rules to reflect in the log flow. For example, if a new resource is added in tag rules, it would take an hour for the log forwarding to start for that particular resource  