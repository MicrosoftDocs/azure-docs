---
title: Get resource changes
description: Understand how to find when a resource was changed, get a list of the properties that changed, and evaluate the diffs.
ms.date: 05/20/2020
ms.topic: how-to
---
# Get resource changes

Resources get changed through the course of daily use, reconfiguration, and even redeployment.
Change can come from an individual or by an automated process. Most change is by design, but
sometimes it isn't. With the last 14 days of change history, Azure Resource Graph enables you to:

- Find when changes were detected on an Azure Resource Manager property
- For each resource change, see property change details
- See a full comparison of the resource before and after the detected change

Change detection and details are valuable for the following example scenarios:

- During incident management to understand _potentially_ related changes. Query for change events
  during a specific window of time and evaluate the change details.
- Keeping a Configuration Management Database, known as a CMDB, up-to-date. Instead of refreshing
  all resources and their full property sets on a scheduled frequency, only get what changed.
- Understanding what other properties may have been changed when a resource changed compliance
  state. Evaluation of these additional properties can provide insights into other properties that
  may need to be managed via an Azure Policy definition.

This article shows how to gather this information through Resource Graph's SDK. To see this
information in the Azure portal, see Azure Policy's
[Change history](../../policy/how-to/determine-non-compliance.md#change-history) or Azure Activity
Log [Change history](../../../azure-monitor/platform/activity-log-view.md#azure-portal). For details
about changes to your applications from the infrastructure layer all the way to application
deployment, see
[Use Application Change Analysis (preview)](../../../azure-monitor/app/change-analysis.md) in Azure
Monitor.

> [!NOTE]
> Change details in Resource Graph are for Resource Manager properties. For tracking changes inside
> a virtual machine, see Azure Automation's [Change tracking](../../../automation/automation-change-tracking.md)
> or Azure Policy's [Guest Configuration for VMs](../../policy/concepts/guest-configuration.md).

> [!IMPORTANT]
> Change history in Azure Resource Graph is in Public Preview.

## Find detected change events and view change details

The first step in seeing what changed on a resource is to find the change events related to that
resource within a window of time. Each change event also includes details about what changed on the
resource. This step is done through the **resourceChanges** REST endpoint.

The **resourceChanges** endpoint accepts the following parameters in the request body:

- **resourceId** \[required\]: The Azure resource to look for changes on.
- **interval** \[required\]: A property with _start_ and _end_ dates for when to check for a change
  event using the **Zulu Time Zone (Z)**.
- **fetchPropertyChanges** (optional): A boolean property that sets if the response object includes
  property changes.

Example request body:

```json
{
    "resourceId": "/subscriptions/{subscriptionId}/resourceGroups/MyResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount",
    "interval": {
        "start": "2019-09-28T00:00:00.000Z",
        "end": "2019-09-29T00:00:00.000Z"
    },
    "fetchPropertyChanges": true
}
```

With the above request body, the REST API URI for **resourceChanges** is:

```http
POST https://management.azure.com/providers/Microsoft.ResourceGraph/resourceChanges?api-version=2018-09-01-preview
```

The response looks similar to this example:

```json
{
	"changes": [
		{
			"changeId": "{\"beforeId\":\"3262e382-9f73-4866-a2e9-9d9dbee6a796\",\"beforeTime\":\"2019-09-28T00:45:35.012Z\",\"afterId\":\"6178968e-981e-4dac-ac37-340ee73eb577\",\"afterTime\":\"2019-09-28T00:52:53.371Z\"}",
			"beforeSnapshot": {
				"snapshotId": "3262e382-9f73-4866-a2e9-9d9dbee6a796",
				"timestamp": "2019-09-28T00:45:35.012Z"
			},
			"afterSnapshot": {
				"snapshotId": "6178968e-981e-4dac-ac37-340ee73eb577",
				"timestamp": "2019-09-28T00:52:53.371Z"
			},
			"changeType": "Create"
		},
		{
			"changeId": "{\"beforeId\":\"a00f5dac-86a1-4d86-a1c5-a9f7c8147b7c\",\"beforeTime\":\"2019-09-28T00:43:38.366Z\",\"afterId\":\"3262e382-9f73-4866-a2e9-9d9dbee6a796\",\"afterTime\":\"2019-09-28T00:45:35.012Z\"}",
			"beforeSnapshot": {
				"snapshotId": "a00f5dac-86a1-4d86-a1c5-a9f7c8147b7c",
				"timestamp": "2019-09-28T00:43:38.366Z"
			},
			"afterSnapshot": {
				"snapshotId": "3262e382-9f73-4866-a2e9-9d9dbee6a796",
				"timestamp": "2019-09-28T00:45:35.012Z"
			},
			"changeType": "Delete"
		},
		{
			"changeId": "{\"beforeId\":\"b37a90d1-7ebf-41cd-8766-eb95e7ee4f1c\",\"beforeTime\":\"2019-09-28T00:43:15.518Z\",\"afterId\":\"a00f5dac-86a1-4d86-a1c5-a9f7c8147b7c\",\"afterTime\":\"2019-09-28T00:43:38.366Z\"}",
			"beforeSnapshot": {
				"snapshotId": "b37a90d1-7ebf-41cd-8766-eb95e7ee4f1c",
				"timestamp": "2019-09-28T00:43:15.518Z"
			},
			"afterSnapshot": {
				"snapshotId": "a00f5dac-86a1-4d86-a1c5-a9f7c8147b7c",
				"timestamp": "2019-09-28T00:43:38.366Z"
			},
			"propertyChanges": [
				{
					"propertyName": "tags.org",
					"afterValue": "compute",
					"changeCategory": "User",
					"changeType": "Insert"
				},
				{
					"propertyName": "tags.team",
					"afterValue": "ARG",
					"changeCategory": "User",
					"changeType": "Insert"
				}
			],
			"changeType": "Update"
		},
		{
			"changeId": "{\"beforeId\":\"19d12ab1-6ac6-4cd7-a2fe-d453a8e5b268\",\"beforeTime\":\"2019-09-28T00:42:46.839Z\",\"afterId\":\"b37a90d1-7ebf-41cd-8766-eb95e7ee4f1c\",\"afterTime\":\"2019-09-28T00:43:15.518Z\"}",
			"beforeSnapshot": {
				"snapshotId": "19d12ab1-6ac6-4cd7-a2fe-d453a8e5b268",
				"timestamp": "2019-09-28T00:42:46.839Z"
			},
			"afterSnapshot": {
				"snapshotId": "b37a90d1-7ebf-41cd-8766-eb95e7ee4f1c",
				"timestamp": "2019-09-28T00:43:15.518Z"
			},
			"propertyChanges": [{
				"propertyName": "tags.cgtest",
				"afterValue": "hello",
				"changeCategory": "User",
				"changeType": "Insert"
			}],
			"changeType": "Update"
		}
	]
}
```

Each detected change event for the **resourceId** has the following properties:

- **changeId** - This value is unique to that resource. While the **changeId** string may sometimes
  contain other properties, it's only guaranteed to be unique.
- **beforeSnapshot** - Contains the **snapshotId** and **timestamp** of the resource snapshot that
  was taken before a change was detected.
- **afterSnapshot** - Contains the **snapshotId** and **timestamp** of the resource snapshot that
  was taken after a change was detected.
- **changeType** - Describes the type of change detected for the entire change record between the
  **beforeSnapshot** and **afterSnapshot**. Values are: _Create_, _Update_, and _Delete_. The
  **propertyChanges** property array is only included when **changeType** is _Update_.
- **propertyChanges** - This array of properties details all of the resource properties that were
  updated between the **beforeSnapshot** and the **afterSnapshot**:
  - **propertyName** - The name of the resource property that was altered.
  - **changeCategory** - Describes what made the change. Values are: _System_ and _User_.
  - **changeType** - Describes the type of change detected for the individual resource property.
    Values are: _Insert_, _Update_, _Remove_.
  - **beforeValue** - The value of the resource property in the **beforeSnapshot**. Isn't displayed
    when **changeType** is _Insert_.
  - **afterValue** - The value of the resource property in the **afterSnapshot**. Isn't displayed
    when **changeType** is _Remove_.

## Compare resource changes

With the **changeId** from the **resourceChanges** endpoint, the **resourceChangeDetails** REST
endpoint is then used to get the before and after snapshots of the resource that was changed.

The **resourceChangeDetails** endpoint requires two parameters in the request body:

- **resourceId**: The Azure resource to compare changes on.
- **changeId**: The unique change event for the **resourceId** gathered from **resourceChanges**.

Example request body:

```json
{
    "resourceId": "/subscriptions/{subscriptionId}/resourceGroups/MyResourceGroup/providers/Microsoft.Storage/storageAccounts/mystorageaccount",
    "changeId": "{\"beforeId\":\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\",\"beforeTime\":'2019-05-09T00:00:00.000Z\",\"afterId\":\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\",\"afterTime\":'2019-05-10T00:00:00.000Z\"}"
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

To compare the results, either use the **changes** property in **resourceChanges** or evaluate the
**content** portion of each snapshot in **resourceChangeDetails** to determine the difference. If
you compare the snapshots, the **timestamp** always shows as a difference despite being expected.

## Next steps

- See the language in use in [Starter queries](../samples/starter.md).
- See advanced uses in [Advanced queries](../samples/advanced.md).
- Learn more about how to [explore resources](../concepts/explore-resources.md).
- For guidance on working with queries at a high frequency, see [Guidance for throttled requests](../concepts/guidance-for-throttled-requests.md).
