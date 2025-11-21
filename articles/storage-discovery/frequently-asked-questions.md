---
title: Frequently asked questions for the Azure Storage Discovery service | Microsoft Docs
description: Find answers for frequently asked questions about Azure Storage Discovery.
author: pthippeswamy
ms.author: pthippeswamy
ms.service: azure-storage-discovery
ms.topic: release-notes
ms.date: 10/09/2025
---
# Frequently Asked Questions (FAQs) for Azure Storage Discovery

In this article, learn about frequently asked questions and answers for the Azure Storage Discovery service.

<details>
<summary> Can I use Storage Discovery in EUAP regions?</summary>
Creating a Storage Discovery workspace in EUAP regions isn’t supported. However, if your workspace is created in a supported (non-EUAP) region, it will still show insights for storage accounts located in EUAP regions. To ensure full functionality and support, create your Storage Discovery workspace in a supported region outside EUAP.
</details>

<details>
<summary> I can't find a subscription in the workspace root picker (resource tree) to add it to the workspace root.</summary>

- Navigate to the [Azure portal](https://portal.azure.com).
- Verify you're logged into the portal with an account from the same tenant the subscription is located in.
- Navigate to Settings (top, right corner in the portal) and then select: "Directories and Subscriptions"
- Select the "All Subscription" drop-down to verify if the subscription is listed and selected. If the subscription isn't selected here, it doesn't show up on the 'Add workspace root' dialog.

</details>

<details>
<summary>I created the workspace but can't see any data yet.</summary>

Insights aggregation often completes within a few hours but can also take more than a day.

</details>

<details>
<summary>It's more than 24 hours since the workspace was created and I still can't see data on the reports.</summary>

- Verify discovery resource has a valid "Scope" defined.
- Verify the ARM tags specified in the "Scope" matches the tags present on the storage accounts that you want to capture insights on. Tag values are case-sensitive. Verify that the tags match exactly.
- Verify the subscription or resource group added as workspace roots have storage accounts present.
- If still no data is shown on the reports after 24 hours of creation, contact [Azure Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

</details>

<details>
<summary>I see data on Capacity and Configuration report but not on other reports.</summary>

Activity, Security, and Consumption reports show insights only for Standard pricing plan and not for Free plan. Verify your workspace's pricing plan and upgrade if needed.

</details>

<details>
<summary> I can't see insights for FNS accounts in the archive tier.</summary>

Insights such as capacity and activity for FNS storage accounts with the [default access tier](../storage/blobs/access-tiers-overview.md#default-account-access-tier-setting) set to [archive](../storage/blobs/access-tiers-overview.md#archive-access-tier) are currently not included in the Storage Discovery reports. An update is in progress to begin incorporating these insights. Once completed, insights for these storage accounts automatically appear in the reports and also are reflected in the monthly [Storage Discovery bill](pricing.md).

</details>

<details>
<summary>Unable to add more than 10 scopes in a workspace.</summary>

Discovery workspace has a default limit of 10 scopes per workspace. Support team may be contacted with a request to increase this limit if needed. Provide the tenantID, SubscriptionID where you would want this limit to be increased.

</details>

<details>
<summary>Unable to include more than 100 resources (Subscription or resource groups) as part of Discovery workspace root.</summary>

Discovery workspace has a default limit of 100 workspace roots per workspace. Support team may be contacted with a request to increase this limit if needed. Provide the tenantID, SubscriptionID where you would want this limit to be increased.

</details>

<details>
<summary>Unable to add more than five tags per scope in workspace.</summary>

Discovery workspace has a default limit of five ARM tags per scopes in each workspace. Support team may be contacted with a request to increase this limit if needed. Provide the tenantID, SubscriptionID where you would want this limit to be increased.

</details>

<details>
<summary>What are the resource limits of the Storage Discovery service?</summary>

- Maximum number of workspaces per subscription per region: 10
- Maximum number of workspace root entries: 100 (combination of subscription and resource group IDs)
- Maximum number of scopes in a workspace: 10
- Maximum number of tags a scope can filter on: 5

If you need any of these limits increased, open a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) and provide which limit and to what count you need that limit increased. Also include the tenant ID and the subscription ID. Our team reviews your request and may contact you with any remaining questions. 
To create Storage Discovery resources with higher limits, use alternative clients such as Azure CLI, PowerShell, SDK, or ARM templates. The Azure portal will continue to enforce default limits.

</details>

<details>
<summary>Changes to resources (like creation of new storage accounts or change in storage account configuration) aren't showing up on the Discovery reports.</summary>

Insights aggregation often completes within a few hours but can also take more than a day.

</details>

<details>
<summary>Switching the pricing plan for a workspace</summary>

> [!WARNING]
> If a workspace is downgraded from a paid pricing plan to the `Free` plan, historic insights for only the past 15 days are retained and all previously aggregated insights are permanently deleted. Historic data can't be recovered, even if you switch the workspace back to a paid plan.

</details>

<details>
<summary>I'm unable to create a new resource.</summary>

There are two common reasons why the creation of a workspace resource can fail.

- You might not have the necessary permissions to the resources you listed in the root configuration of your new workspace. The [deployment planning article](deployment-planning.md) has more details for required permissions.
- Discovery only allows a maximum of 10 workspaces per region per subscription. To identify if this limit affects you, review the error message with which your workspace creation failed. `You've reached the maximum number of allowed resources {maxResourcesPerRegion} for this subscription in the {workspace.Location} region. Current count of resources added: {currentCount}` If you need more workspaces, you can open a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) and provide the tenant ID and the subscription ID for which you need this deployment limit increased. Our team reviews your request and may contact you with any remaining questions. 

</details>

<details>
<summary>Discovery reports aren't showing few storage accounts that are part of the workspace.</summary>

- Verify if the storage account was created less than 24 hours ago. Insights aggregation for Discovery reports often completes within a few hours but can also take more than a day. Once aggregation completes, the changes to your storage resources begin to reflect in the Discovery reports.
- Verify if ARM tags are still intact on the storage accounts and they match to the tags configured in the workspace's scope.
- Ensure the storage account has blobs in it. Empty storage accounts don't show up on the discovery reports.

</details>

<details>
<summary>Trend charts on Capacity and Consumption report show sharp dips</summary>
Trend graphs in the Capacity and Consumption reports may occasionally display temporary dips. Common causes are actual changes in your resources and noise from the insights aggregation engine. When viewed over longer time periods or averaged throughout a day, these ripples typically don't distort the overall insight you're gaining from any given graph.
</details>
