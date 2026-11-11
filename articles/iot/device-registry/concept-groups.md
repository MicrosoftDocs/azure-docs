---
title: Groups Concepts (Preview)
titleSuffix: Azure Device Registry
description: Learn how Azure Device Registry groups use query-defined, cached membership to organize IoT Hub-connected devices for fleet-scale targeting.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot
ms.topic: overview
ms.date: 11/10/2026
ai-usage: ai-assisted
#Customer intent: As an IoT solution architect, I want to understand how Azure Device Registry groups define and refresh device membership so that I can target devices reliably with jobs and software updates.
---

# Groups concepts (preview)

A *group* in Azure Device Registry (ADR) is a query-defined set of homogeneous resources that you use to target fleet-scale operations, such as [software updates](concept-software-updates.md). In the current preview, a group targets IoT Hub-connected devices. Instead of managing individual resources, you define a filter once and reuse the resulting group wherever you need to act on that set of resources.

[!INCLUDE [Relationships between groups, jobs, and software updates](includes/groups-jobs-software-updates.md)]

> [!IMPORTANT]
> Azure Device Registry groups are currently in preview.

## Service applicability

| Feature | Azure IoT Operations | Azure IoT Hub |
|---|---|---|
| Groups | Not supported in this preview | Preview |

In this preview, groups support *IoT Hub-connected devices* in an Azure Device Registry namespace.

## Query-defined membership

You create a group by defining a filter against supported resource properties, such as manufacturer or software revision. In the preview, the only supported Azure resource type is `RegistryDevice`. Azure Device Registry evaluates the filter within the namespace and populates the group with every matching resource.

A group filter can contain up to 255 characters. Use `*` to include all devices in the ADR namespace, or a `WHERE` clause to select matching devices. Don't include `SELECT` or `FROM`.

For `RegistryDevice` groups, use query-language property names in the filter. For example:

```text
WHERE manufacturer = 'Fabrikam' AND model = 'VX900'
```

For properties that support `IN` or `NIN`, provide values in an array. For example:

```text
WHERE name IN ['sensor-01', 'sensor-02']
```

A device can belong to more than one group at the same time. For example, a device might match both a "firmware version 2.1" group and a "building 12" group. Membership isn't exclusive, so you can compose groups around different operational needs without duplicating devices.

### RegistryDevice supported properties and operators

The following table shows the supported properties and operators for `RegistryDevice` filter queries:

| User terminology   | Property path       | Literal type | Operators                                                |
| ------------------ | ------------------- | ------------ | -------------------------------------------------------- |
| namespace UUID     | `namespaceUuid`     | string       | `=`, `!=`, `<>`                                          |
| name               | `name`              | string       | `=`, `!=`, `<>`, `IN`, `NIN`                             |
| resource type      | `resourceType`      | string       | `=`, `!=`, `<>`                                          |
| location           | `location`          | string       | `=`, `!=`, `<>`, `IN`, `NIN`                             |
| device UUID        | `uuid`              | string       | `=`, `!=`, `<>`, `IN`, `NIN`                             |
| provisioning state | `provisioningState` | string       | `=`, `!=`, `<>`, `IN`, `NIN`                             |
| external device ID | `externalDeviceId`  | string       | `=`, `!=`, `<>`, `IN`, `NIN`                             |
| enabled, disabled  | `enabled`           | string enum  | `=`, `!=`, `<>`; values are `'Enabled'` and `'Disabled'` |
| manufacturer       | `manufacturer`      | string       | `=`, `!=`, `<>`                                          |
| model              | `model`             | string       | `=`, `!=`, `<>`                                          |
| software revision  | `softwareRevision`  | string       | `=`, `!=`, `<>`                                          |
| tag key            | `tags.<key>`        | string       | `=`, `!=`, `<>`; maximum path depth is 4                 |

### RegistryDevice supported update properties and operators

The following table shows the supported properties and operators for `RegistryDevice` filter queries within the `attributes.update` scope:

| Property path                                               | Literal type | Operators                                |
| ----------------------------------------------------------- | ------------ | ---------------------------------------- |
| `attributes.update.deviceClassId`                           | string       | `=`, `!=`, `<>`, `IN`, `NIN`             |
| `attributes.update.installedUpdateId.provider`              | string       | `=`, `!=`, `<>`, `IN`, `NIN`             |
| `attributes.update.installedUpdateId.name`                  | string       | `=`, `!=`, `<>`, `IN`, `NIN`             |
| `attributes.update.installedUpdateId.version`               | string       | `=`, `!=`, `<>`, `IN`, `NIN`             |
| `attributes.update.latestUpdateJobInfo.state`               | string       | `=`, `!=`, `<>`, `IN`, `NIN`             |
| `attributes.update.latestUpdateJobInfo.updateId.provider`   | string       | `=`, `!=`, `<>`, `IN`, `NIN`             |
| `attributes.update.latestUpdateJobInfo.updateId.name`       | string       | `=`, `!=`, `<>`, `IN`, `NIN`             |
| `attributes.update.latestUpdateJobInfo.updateId.version`    | string       | `=`, `!=`, `<>`, `IN`, `NIN`             |
| `attributes.update.agentInfo.compatibilityProperties.<key>` | string       | `=`, `!=`, `<>`; maximum path depth is 5 |
| `attributes.update.agentInfo.agentProfile`                  | integer      | `=`, `!=`, `<>`, `IN`, `NIN`             |

You can combine conditions with `AND`, `OR`, `NOT`, parentheses, and comparisons to `null`. Scalar functions such as `STARTSWITH`, `CONTAINS`, `IS_NULL`, and `IS_DEFINED`, field-to-field comparisons, and arbitrary `properties.*` or `attributes.*` paths aren't supported.

## Cached membership and refresh

Group membership is calculated and cached at refresh time&mdash;it isn't evaluated in real time. When you create a group, or when you refresh an existing one, Azure Device Registry re-evaluates the filter and updates the cached member list.

You trigger a group refresh through the `RefreshMembers` operation. Refresh is asynchronous, and the group's `membershipState` can be `Creating`, `RefreshingMembers`, `Ready`, or `FailedToResolveMembers`. Wait for `Ready` before using the newly resolved membership.

Because membership is cached, a group's member list can be stale between refreshes. If a resource's properties change, or a new resource starts matching the filter, that change isn't reflected in a manual-refresh group's member list until the next refresh completes. The service enforces a minimum one-hour interval between manual refreshes.

## Immutable filters and lifecycle

You can edit a group's display name and description. The resource name and query filter are fixed at creation. To target a different set of devices, create or clone a group with a new filter.

Deleting a group removes only the group; its member devices remain. You can't delete a group while it has active or scheduled job runs. Wait for those runs to finish or remove them before deleting the group.

## Manage groups through the REST API

Manage groups programmatically with the [Groups REST API](/rest/api/deviceregistry/groups), using `api-version=2026-11-02-preview`.

`ListMembers` returns each member's ARM resource ID in `members[].id`. Use `CountMembers` to get the group's member count. For paging, see [Limits and preview restrictions](#limits-and-preview-restrictions).

## Manage groups in the Azure portal (preview)

In the ADR namespace navigation, under Fleet, select Groups (preview). The list shows each group's name, member count, description, provisioning state, and last-updated time.

:::image type="content" source="media/groups/groups-list.png" alt-text="Screenshot of the Groups list with sample group names, member counts, and group-management commands." lightbox="media/groups/groups-list.png":::

Select a group to open its Overview page. Expand Essentials to see its display name, description, member count, and last-updated time. Select Definition to open the Group definition pane and view the read-only query filter. Use this filter to confirm which devices the group targets.

The member list previews up to 10 devices and shows the total member count. For example, a group with 50 members shows "Previewing 10 of 50 members." The preview includes device status, manufacturer, model, provisioning state, and last-updated time. Treat it as a spot check, not a complete listing of a large group.

From the groups list or the group detail view, you can take the following actions:

- **Create** a group from the list view by providing a required name, an optional description, and a query filter.
- **Clone** an existing group from the list or detail view. Cloning is the practical way to start from a group's definition when you need adjusted membership criteria, because you can't edit the original filter.
- **Edit** a group's display name and description from the detail view. The resource name and query filter don't change.
- **Refresh** a group's cached membership from the detail view, subject to the refresh limits described in [Cached membership and refresh](#cached-membership-and-refresh). Refresh on the groups list reloads the list; it doesn't recalculate membership.
- **Delete** a group from the list or detail view. You confirm the deletion by entering the group name.

When you create a group, enter its membership criteria on the **Query filter** step.

:::image type="content" source="media/groups/groups-query-filter.png" alt-text="Screenshot of the Query filter step with a filter that selects Fabrikam devices with model VX900." lightbox="media/groups/groups-query-filter.png":::

## Relationship to jobs and software updates

Groups define which devices to target; [jobs](concept-jobs.md) define the operation to run. In this preview, a group can be the target of one software update job. To create a different software update job for the same group, delete the existing job first.

Onboarding update jobs target an ADR namespace directly, not a group. For more information, see [Jobs concepts (preview)](concept-jobs.md#supported-job-types).

### Group-targeted reports

The preview REST API also uses groups as targets for software update reports:

- `GroupBestUpdatesComplianceReport` describes the best available updates and update compliance for devices in the group.
- `GroupInstallableUpdatesReport` lists installable updates and the devices they target.

Request a report with the namespace's [`generateReport`](/rest/api/deviceregistry/namespaces/generate-report) operation, specifying the report type and target group. Retrieve the result with [`getLatestReport`](/rest/api/deviceregistry/namespaces/get-latest-report).

## Limits and preview restrictions

The following limits currently apply to groups:

- Up to 100 groups per ADR namespace.
- A minimum one-hour interval between manual refreshes.
- `ListMembers` returns up to 1,000 members per page, with no filtering or sorting in this preview. Set `pageSize` to request a smaller page and pass the returned `skipToken` in the next request to continue listing members.

## Related content

- [Jobs concepts (preview)](concept-jobs.md)
- [Software updates concepts (preview)](concept-software-updates.md)
- [Groups REST API reference](/rest/api/deviceregistry/groups)
