---
title: Frequently asked questions for the Azure Storage Discovery service | Microsoft Docs
description: Find answers for frequently asked questions about Azure Storage Discovery.
author: pthippeswamy
ms.author: shaas
ms.service: azure-storage-discovery
ms.topic: release-notes
ms.date: 08/01/2025
---
# Frequently Asked Questions (FAQs) for Azure Storage Discovery preview

In this article, learn about the frequently asked questions and the answers about Azure Storage Discovery preview.

## I can't find a subscription in the workspace root picker (resource tree) to add it to the workspace root.
- Verify you are in the correct Tenant and the subscription is selected.
- Navigate to Settings (right-hand corner on Portal) and "Directories and Subscriptions"
- Select the "All Subscription" drop-down to verify if the subscription is selected. If the subscription isn't selected here, it will not show up on the 'Add workspace root' flow.

## I created the workspace but can't see any data yet.
Once the Discovery workspace is created, it can take up to 24 hours for the data to show up on Reports.

## It's more than 24 hours since the workspace was created and I still can't see data on the reports.
- Verify discovery resource has a valid "Scope" defined.
- Verify the ARM tags specified in the "Scope" matches the tags present on the storage accounts that you want to capture insights on. Tag values are case-sensitive. Verify that the tags match exactly.
- Verify the subscription or resource group added as workspace roots have storage accounts present.
- If still no data is shown on the reports after 24 hours of creation, contact [Azure Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

## I see data on Capacity and Configuration report but not on other reports.
Activity, Security, and Consumption reports show insights only for Standard pricing plan and not for Free plan. Verify your workspace's pricing plan and upgrade if needed.

## Unable to add more than ten scopes in a workspace.
Discovery workspace has a default limit of ten scopes per workspace. Support team may be contacted with a request to increase this limit if needed. Provide the tenantID, SubscriptionID where you would want this limit to be increased.

## Unable to include more than 100 resources (Subscription or resource groups) as part of Discovery workspace root.
Discovery workspace has a default limit of 100 workspace roots per workspace. Support team may be contacted with a request to increase this limit if needed. Provide the tenantID, SubscriptionID where you would want this limit to be increased.

## Unable to add more than five tags per scope in workspace.
Discovery workspace has a default limit of five ARM tags per scopes in each workspace. Support team may be contacted with a request to increase this limit if needed. Provide the tenantID, SubscriptionID where you would want this limit to be increased.

## What is the limit on number of Discovery workspaces per subscription?
Discovery has a limit of 10 workspaces allowed per subscription per region. Support team may be contacted with a request to increase this limit if needed. Provide the tenantID, SubscriptionID where you would want this limit to be increased.

## Changes to resources (like creation of new storage accounts or change in storage account configuration) aren't showing up on the Discovery reports.
It takes up to 24 hours for any change in the resources to be reflected in the Discovery reports.

## Aggregated data in Free and Standard pricing plan
Free pricing plan gets daily aggregates of data whereas Standard pricing plan gets hourly aggregates of data.

## Switching pricing plan for a workspace
If a workspace is downgraded from Standard pricing plan to Free, previously aggregated data be deleted and free plan will only get the default 15 days of historical data retained over 15 days. User must be careful while downgrading a workspace as the data once lost can't be recovered.

## Discovery reports aren't showing few storage accounts that are part of the workspace.
- Verify if the storage account was created less than 24 hours ago. Discovery reports take upto 24 hours to show any changes to the resources like adding new storage accounts or blobs.
- Verify if ARM tags are still intact on the storage accounts and they match to the tags configured in the workspace's scope.
- Ensure the storage account has blobs in it. Empty storage accounts don't show up on the discovery reports.