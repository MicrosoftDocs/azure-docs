---
title: Get resource changes
description: Understand how to find when a resource was changed and get a list of the properties that changed.
services: resource-graph
author: DCtheGeek
ms.author: dacoulte
ms.date: 05/10/2019
ms.topic: conceptual
ms.service: resource-graph
manager: carmonm
---
# Get resource changes

Resources get changed through the course of daily use, reconfiguration, and even redeployment.
Change can come from an individual or by an automated process. Most change is by design, but
sometimes it isn't. With the last 14 days of change history, Azure Resource Graph enables you to:

- Find when changes were detected on an Azure Resource Manager property.
- See what properties changed as part of that change event.

Change detection and details are valuable for the following example scenarios:

- During incident management to understand _potentially_ related changes. Query for change events
  during a specific window of time and evaluate the change details.
- Keeping a Configuration Management Database, known as a CMDB, up-to-date. Instead of refreshing
  all resources and their full property sets on a scheduled frequency, only get what changed.
- Understanding what other properties may have been changed when a resource changed compliance
  state. Evaluation of these additional properties can provide insights into other properties that
  may need to be managed via an Azure Policy definition.

This article shows how to gather this information through Resource Graph's SDK. To see this
information in the Azure portal, see Azure Policy's [Change history](../../policy/how-to/determine-non-compliance.md#change-history-preview)
or Azure Activity Log [Change history](../../../azure-monitor/platform/activity-log-view.md#azure-portal).

> [!NOTE]
> Change details in Resource Graph are for Resource Manager properties. For tracking changes inside
> a virtual machine, see Azure Automation's [Change tracking](../../../automation/automation-change-tracking.md)
> or Azure Policy's [Guest Configuration for VMs](../../policy/concepts/guest-configuration.md).

> [!IMPORTANT]
> Change history in Azure Resource Graph is in Public Preview.

## Find when changes were detected

The first step in seeing what changed on a resource is to find the change events related to that
resource within a window of time. This step is done through the **resourceChanges** REST endpoint.

The **resourceChanges** endpoint requires two parameters in the request body:

- **resourceId**: The Azure resource to look for changes on.
- **interval**: A property with _start_ and _end_ dates for when to check for a change event using
  the **Zulu Time Zone (Z)**.

Example request body:

```json
{
    "resourceId": "/subscriptions/{subscriptionId}/resourceGroups/MyResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount",
    "interval": {
        "start": "2019-03-28T00:00:00.000Z",
        "end": "2019-03-31T00:00:00.000Z"
    }
}
```

With the above request body, the REST API URI for **resourceChanges** is:

```http
POST https://management.azure.com/providers/Microsoft.ResourceGraph/resourceChanges?api-version=2018-09-01-preview
```

The response looks similar to this example:

```json
{
    "changes": [{
            "changeId": "{\"beforeId\":\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\",\"beforeTime\":'2019-05-09T00:00:00.000Z\",\"afterId\":\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\",\"beforeTime\":'2019-05-10T00:00:00.000Z\"}",
            "beforeSnapshot": {
                "timestamp": "2019-03-29T01:32:05.993Z"
            },
            "afterSnapshot": {
                "timestamp": "2019-03-29T01:54:24.42Z"
            }
        },
        {
            "changeId": "9dc352cb-b7c1-4198-9eda-e5e3ed66aec8",
            "beforeSnapshot": {
                "timestamp": "2019-03-28T10:30:19.68Z"
            },
            "afterSnapshot": {
                "timestamp": "2019-03-28T21:12:31.337Z"
            }
        }
    ]
}
```

Each detected change event for the **resourceId** has a **changeId** that is unique to that
resource. While the **changeId** string may sometimes contain other properties, it's only guaranteed
to be unique. The change record includes the times that the before and after snapshots were taken.
The change event occurred at some point in this window of time.

## See what properties changed

With the **changeId** from the **resourceChanges** endpoint, the **resourceChangeDetails** REST endpoint is then used to get specifics of the change event.

The **resourceChangeDetails** endpoint requires two parameters in the request body:

- **resourceId**: The Azure resource to look for changes on.
- **changeId**: The unique change event for the **resourceId** gathered from **resourceChanges**.

Example request body:

```json
{
    "resourceId": "/subscriptions/{subscriptionId}/resourceGroups/MyResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount",
    "changeId": "{\"beforeId\":\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\",\"beforeTime\":'2019-05-09T00:00:00.000Z\",\"afterId\":\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\",\"beforeTime\":'2019-05-10T00:00:00.000Z\"}"
}
```

With the above request body, the REST API URI for **resourceChangeDetails** is:

```http
POST https://management.azure.com/providers/Microsoft.ResourceGraph/resourceChangeDetails?api-version=2018-09-01-preview
```

The response looks similar to this example:

```json
{
    "changeId": "{\"beforeId\":\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\",\"beforeTime\":'2019-05-09T00:00:00.000Z\",\"afterId\":\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\",\"beforeTime\":'2019-05-10T00:00:00.000Z\"}",
    "beforeSnapshot": {
        "timestamp": "2019-03-29T01:32:05.993Z",
        "content": {
            "sku": {
                "name": "Standard_LRS",
                "tier": "Standard"
            },
            "kind": "Storage",
            "id": "/subscriptions/{subscriptionId}/resourceGroups/MyResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount",
            "name": "mystorageaccount",
            "type": "Microsoft.Storage/storageAccounts",
            "location": "westus",
            "tags": {},
            "properties": {
                "networkAcls": {
                    "bypass": "AzureServices",
                    "virtualNetworkRules": [],
                    "ipRules": [],
                    "defaultAction": "Allow"
                },
                "supportsHttpsTrafficOnly": false,
                "encryption": {
                    "services": {
                        "file": {
                            "enabled": true,
                            "lastEnabledTime": "2018-07-27T18:37:21.8333895Z"
                        },
                        "blob": {
                            "enabled": true,
                            "lastEnabledTime": "2018-07-27T18:37:21.8333895Z"
                        }
                    },
                    "keySource": "Microsoft.Storage"
                },
                "provisioningState": "Succeeded",
                "creationTime": "2018-07-27T18:37:21.7708872Z",
                "primaryEndpoints": {
                    "blob": "https://mystorageaccount.blob.core.windows.net/",
                    "queue": "https://mystorageaccount.queue.core.windows.net/",
                    "table": "https://mystorageaccount.table.core.windows.net/",
                    "file": "https://mystorageaccount.file.core.windows.net/"
                },
                "primaryLocation": "westus",
                "statusOfPrimary": "available"
            }
        }
    },
    "afterSnapshot": {
        "timestamp": "2019-03-29T01:54:24.42Z",
        "content": {
            "sku": {
                "name": "Standard_LRS",
                "tier": "Standard"
            },
            "kind": "Storage",
            "id": "/subscriptions/{subscriptionId}/resourceGroups/MyResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount",
            "name": "mystorageaccount",
            "type": "Microsoft.Storage/storageAccounts",
            "location": "westus",
            "tags": {},
            "properties": {
                "networkAcls": {
                    "bypass": "AzureServices",
                    "virtualNetworkRules": [],
                    "ipRules": [],
                    "defaultAction": "Allow"
                },
                "supportsHttpsTrafficOnly": true,
                "encryption": {
                    "services": {
                        "file": {
                            "enabled": true,
                            "lastEnabledTime": "2018-07-27T18:37:21.8333895Z"
                        },
                        "blob": {
                            "enabled": true,
                            "lastEnabledTime": "2018-07-27T18:37:21.8333895Z"
                        }
                    },
                    "keySource": "Microsoft.Storage"
                },
                "provisioningState": "Succeeded",
                "creationTime": "2018-07-27T18:37:21.7708872Z",
                "primaryEndpoints": {
                    "blob": "https://mystorageaccount.blob.core.windows.net/",
                    "queue": "https://mystorageaccount.queue.core.windows.net/",
                    "table": "https://mystorageaccount.table.core.windows.net/",
                    "file": "https://mystorageaccount.file.core.windows.net/"
                },
                "primaryLocation": "westus",
                "statusOfPrimary": "available"
            }
        }
    }
}
```

**beforeSnapshot** and **afterSnapshot** each give the time the snapshot was taken and the
properties at that time. The change happened at some point between these snapshots. Looking at the
example above, we can see that the property that changed was **supportsHttpsTrafficOnly**.

To compare the results programmatically, compare the **content** portion of each snapshot to
determine the difference. If you compare the entire snapshot, the **timestamp** always shows as a
difference despite being expected.

## Next steps

- See the language in use in [Starter queries](../samples/starter.md).
- See advanced uses in [Advanced queries](../samples/advanced.md).
- Learn to [explore resources](../concepts/explore-resources.md).