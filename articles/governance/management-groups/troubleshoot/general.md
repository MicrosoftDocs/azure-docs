---
title: Troubleshoot common errors
description: Learn how to troubleshoot issues with the various SDKs while working with management groups.
ms.date: 08/03/2021
ms.topic: troubleshooting
---
# Troubleshoot errors using management groups

When you create and work with management groups you might run into errors. This article describes
various general errors that might occur, and it suggests ways to resolve them.

## Finding error details

Most errors are the result of an issue while running a command with management groups. When a
command fails, the SDK provides details about the failure. This information indicates the issue so
that it can be fixed and a later command succeeds.

## General errors

### <a name="throttled"></a>Scenario: Response size too large

#### Issue

Customers with a large
[resource hierarchy](../overview.md#hierarchy-of-management-groups-and-subscriptions) may get the
following message when querying the
[Management Groups - Get](/rest/api/managementgroups/management-groups/get) REST API with a
combination of `$expand` and `$recurse` parameters:

```output
The response of the message was too large. Use another API or other workarounds. See https://aka.ms/mg/responsesize for more info.
```

#### Cause

The **Get management group** REST API doesn't return results if the payload is larger than 15 MB.
This REST API is intended to get details for a single management group.

#### Resolution

There are several methods of dealing with a response that is too large:

- Use the
  [Management Groups - Get Descendants](/rest/api/managementgroups/management-groups/get-descendants)
  REST API. This API supports pagination.
- If looking for a single management group, remove the `$expand` and `$recurse` parameters from the
  request to reduce the response size.

## Next steps

If you didn't see your problem or are unable to solve your issue, visit one of the following
channels for more support:

- Get answers from Azure experts through
  [Azure Forums](https://azure.microsoft.com/support/forums/).
- Connect with [@AzureSupport](https://twitter.com/azuresupport) - the official Microsoft Azure
  account for improving customer experience by connecting the Azure community to the right
  resources: answers, support, and experts.
- If you need more help, you can file an Azure support incident. Go to the
  [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
