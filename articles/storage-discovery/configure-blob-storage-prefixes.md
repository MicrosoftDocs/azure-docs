---
title: Configure Blob prefixes for analysis
titleSuffix: Azure Storage Discovery
description: Learn how to add, edit, and delete workspace-level Blob Storage prefixes for analysis in Azure Storage Discovery.
author: pthippeswamy
ms.service: azure-storage-discovery
ms.topic: how-to
ms.date: 09/24/2026
ms.author: pthippeswamy
---

# Configure Blob prefixes for analysis

Prefixes are workspace-level Blob Storage configurations that apply across all scopes in the workspace. They aren't specific to the **Capacity details** feature. Use prefixes to define analysis targets within Blob Storage containers when account-level or container-level aggregation isn't granular enough for your investigation.

> [!NOTE]
> Advanced capacity insights are available only in select Azure regions during preview, and coverage can be partial within a listed region. For current coverage, see [Regional availability for advanced capacity insights](deployment-planning.md#regional-availability-for-advanced-capacity-insights).

Prefixes use the same exact, case-sensitive string-prefix matching semantics as Azure Blob Storage. They define aggregation targets; Storage Discovery doesn't create folders or reorganize blobs.

## Prerequisites

Before you configure prefixes, ensure that:

- The Storage Discovery workspace uses the **Standard** pricing plan.
- You have the **Contributor** or **Owner** role on the Storage Discovery workspace.

You can observe up to 100 prefixes in a Discovery workspace. Since prefixes are essentially a free-form portion of the blob name, ensure you copy them exactly as they're used in your storage accounts.

## Understand prefix format and matching

A configured prefix identifies three logical parts:

| Part | Description |
|---|---|
| Storage account | The storage account that contains the data. |
| Container | The blob container to analyze. |
| Prefix | The exact string prefix used to match blobs in the container. |

The combined value can be represented as:

```text
<storage-account>/<container>/<folder-or-subfolder>
```

Examples include:

```text
account1/container1/folder1/
account2/container4/
account5/container
account2/container/folder/subfolder2/something.txt
```

Apply these rules when you define a prefix:

- Keep the combined configured value between 1 and 1,024 characters.
- Start the prefix with a letter or number.
- Preserve the capitalization used in blob names.
- Escape reserved URL characters correctly.
- Don't use wildcard, regular-expression, contains, or fuzzy-matching syntax.
- Characters such as `*` and `?` are treated as literal characters, not wildcards.

> [!TIP]
> Add a trailing slash when you intend to target a folder-like path. For example, `reports/` avoids the broader matches that a prefix such as `reports` might return.

## Add prefixes when you create a workspace

1. Begin creating a Storage Discovery workspace as described in [Create a Storage Discovery workspace](create-workspace.md).
1. Select the **Standard** pricing plan.
1. Open the prefix configuration step.
1. Select a storage account and container, and then enter the prefix.
1. Add any other prefixes that you need, up to the workspace limit.
1. Complete workspace creation, including the access checks for the workspace roots.

Prefixes are optional. You can create the workspace without configuring one.

## Add a prefix to an existing workspace

1. Open the Storage Discovery workspace in the Azure portal.
1. Open the workspace prefix-management experience.
1. Add a prefix.
1. Select the storage account and container.
1. Enter the prefix string.
1. Resolve any syntax validation errors.
1. Save the prefix.

New prefix aggregations can take up to 48 hours to appear in the **Capacity details** report.

## Edit a prefix

1. Open the prefix management experience for the workspace.
1. Select the prefix that you want to change.
1. Edit the storage account, container, or prefix string as supported by the portal.
1. Resolve any syntax validation errors.
1. Review the warning, and then save the change.

Changes can take up to 48 hours to affect aggregation results. During this period, insights for the changed prefix might not be available.

## Delete a prefix

1. Open the prefix management experience for the workspace.
1. Select the prefix that you want to remove.
1. Select the delete action.
1. Review the warning, and then confirm the deletion.

It can take up to 48 hours for the aggregation change to take effect. Storage Discovery doesn't produce new aggregations for a deleted prefix, and the deleted prefix is no longer available for new report analysis.

## Analyze a configured prefix

To get prefix-level advanced capacity insights, [enable **Capacity details**](create-workspace.md#enable-advanced-capacity-insights) after creating the workspace. When data is available:

1. Open the Storage Discovery workspace.
1. Select **Reports** > **Capacity details**.
1. Use the **Prefix** filter to select a configured prefix.
1. Review the charts for the selected prefix.
1. Select **View resources** where available to investigate prefix-level results.

You can use prefix-level aggregations to analyze supported metadata such as capacity, object count, access tier, object age, modification time, last access time, retention, and storage composition.

## Understand validation behavior

The portal validates prefix syntax when you create or edit a prefix. Correct errors such as an invalid format or a value that exceeds supported naming limits before you save.

Storage Discovery doesn't continuously validate a prefix after it's saved. If the associated account, container, or blob path changes, the prefix can stop returning data. Review the prefix configuration if a previously populated prefix no longer produces insights.

## Behavior when advanced capacity insights are disabled

If you disable **Capacity details** or change the workspace to the Free plan:

- Configured prefixes are retained.
- Prefix aggregation stops.
- No new prefix-level advanced capacity insights are produced.

If you enable advanced capacity insights again, the saved prefixes can be used when aggregation resumes. You must complete the advanced capacity access checks again.

## Next steps

- [Analyze Blob capacity details](analyze-blob-capacity-details.md)
- [Enable advanced capacity insights](create-workspace.md#enable-advanced-capacity-insights)
- [Manage Azure resources by using the Azure portal](../azure-resource-manager/management/manage-resources-portal.md)
