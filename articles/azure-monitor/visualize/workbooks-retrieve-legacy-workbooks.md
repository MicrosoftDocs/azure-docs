---
title: Retrieve legacy and private workbooks
description: Learn how to retrieve deprecated legacy and private Azure workbooks.
services: azure-monitor
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 06/21/2023
author: AbbyMSFT
ms.author: abbyweisberg
---

# Retrieve legacy Application Insights workbooks

Private and legacy workbooks have been deprecated and aren't accessible from the Azure portal. If you're looking for the deprecated workbook that you forgot to convert before the deadline, you can use this process to retrieve the content of your old workbook and load it into a new workbook. This tool will only be available for a limited time.

Application Insights Workbooks, also known as "Legacy Workbooks", are stored as a different Azure resource type than all other Azure Workbooks. These different Azure resource types are now being merged one single standard type so that you can take advantage of all the existing and new functionality available in standard Azure Workbooks. For example:

* Converted legacy workbooks can be queried via Azure Resource Graph (ARG), and show up in other standard Azure views of resources in a resource group or subscription.
* Converted legacy workbooks can support top level ARM template features like other resource types, including, but not limited to:
    * Tags
    * Policies
    * Activity Log / Change Tracking
    * Resource locks
* Converted legacy workbooks can support [ARM templates](workbooks-automate.md). 
* Converted legacy workbooks can support the [BYOS](workbooks-bring-your-own-storage.md) feature.
* Converted legacy workbooks can be saved in region of your choice.

The legacy workbook deprecation doesn't change where you find your workbooks in the Azure portal. The legacy workbooks are still visible in the Workbooks section of Application Insights. The deprecation won't affect the content of your workbook. 

> [!NOTE]
>
> - After April 15 2021, you will not be able to save legacy workbooks.
> - Use `Save as` on a legacy workbook to create a standard Azure workbook.
> - Any new workbook you create will be a standard workbook.

## Why isn't there an automatic conversion?
- The write permissions for legacy workbooks are only based on Azure role based access control on the Application Insights resource itself. A user may not be allowed to create new workbooks in that resource group. If the workbooks were auto migrated, they could fail to be moved, or they could be created but then a user might not be able to delete them after the fact.
- Legacy workbooks support "My" (private) workbooks, which is no longer supported by Azure Workbooks. A migration would cause those private workbooks to become publicly visible to users with read access to that same resource group.
- Usage of links/group content loaded from saved Legacy workbooks would become broken. Authors will need to manually update these links to point to the new saved items.

For these reasons, we suggest that users manually migrate the workbooks they want to keep.
## Convert a legacy Application Insights workbook
1. Identify legacy workbooks. In the gallery view, legacy workbooks have a warning icon. When you open a legacy workbook, there's a banner. 

    :::image type="content" source="media/workbooks-retrieve-legacy-workbooks/workbooks-legacy-warning.png" alt-text="Screenshot of the warning symbol on a deprecated workbook.":::

    :::image type="content" source="media/workbooks-retrieve-legacy-workbooks/workbooks-legacy-banner.png" alt-text="Screenshot of the banner at the top of a deprecated workbook.":::

1. Convert the legacy workbooks. For any legacy workbook you want to keep after June 30 2021:

    1. Open the workbook, and then from the toolbar, select **Edit**, then **Save As**. 
    1. Enter the workbook name. 
    1. Select a subscription, resource group, and region where you have write access.
    1. If the Legacy Workbook uses links to other Legacy Workbooks, or loading workbook content in groups, those items will need to be updated to point to the newly saved workbook.
    1. After you have saved the workbook, you can delete the legacy Workbook, or update its contents to be a link to the newly saved workbook.

1. Verify permissions. For legacy workbooks, permissions were based on the Application Insights specific roles, like Application Insights Contributor. Verify that users of the new workbook have the appropriate standard Monitoring Reader/Contributor or Workbook Reader/Contributor roles so that they can see and create Workbooks in the appropriate resource groups.

For more information, see [access control](workbooks-overview.md#access-control).

After deprecation of the legacy workbooks, you'll still be able to retrieve the content of Legacy Workbooks for a limited time by using Azure CLI or PowerShell tools, to query `microsoft.insights/components/[name]/favorites` for the specific resource using `api-version=2015-05-01`. 
## Convert a private workbook

1. Open a new or empty workbook.
1. In the toolbar, select **Edit** and then navigate to the advanced editor.

    :::image type="content" source="media/workbooks-retrieve-legacy-workbooks/workbooks-retrieve-deprecated-advanced-editor.png" alt-text="Screenshot of the advanced editor used to retrieve deprecated workbooks.":::

1. Copy the [workbook json](#json-for-private-workbook-conversion) and paste it into your open advanced editor.
1. Select **Apply** at the top right.
1. Select the subscription and resource group and category of the workbook you'd like to retrieve. 
1. The grid at the bottom of this workbook lists all the private workbooks in the selected subscription or resource group.
1. Select one of the workbooks in the grid. Your workbook should look something like this:

    :::image type="content" source="media/workbooks-retrieve-legacy-workbooks/workbooks-retrieve-deprecated-private.png" alt-text="Screenshot of a deprecated private workbook converted to a standard workbook." lightbox="media//workbooks-retrieve-legacy-workbooks/workbooks-retrieve-deprecated-private.png":::

1. Select **Open Content as Workbook** at the bottom of the workbook.
1. A new workbook appears with the content of the old private workbook that you selected. Save the workbook as a standard workbook.
1. You have to re-create links to the deprecated workbook or its contents, including dashboard pins and URL links.
## Convert a favorites-based (legacy) workbook
 
1. Navigate to your Application Insights Resource > Workbooks gallery.
1. Open a new or empty workbook.
1. Select Edit in the toolbar and navigate to the advanced editor.

  :::image type="content" source="media/workbooks-retrieve-legacy-workbooks/workbooks-retrieve-deprecated-advanced-editor.png" alt-text="Screenshot of the advanced editor used to retrieve deprecated workbooks.":::

1. Copy the [workbook json](#json-for-private-workbook-conversion) and paste it into your open advanced editor.
1. Select **Apply**.
1. The grid at the bottom of this workbook lists all the legacy workbooks within the current AppInsights resource.
1. Select one of the workbooks in the grid. Your workbook should now look something like this:

    :::image type="content" source="media/workbooks-retrieve-legacy-workbooks/workbooks-retrieve-deprecated-legacy.png" alt-text="Screenshot of a deprecated legacy workbook converted to a standard workbook." lightbox="media/workbooks-retrieve-legacy-workbooks/workbooks-retrieve-deprecated-legacy.png":::

1. Select **Open Content as Workbook** at the bottom of the workbook.
1. A new workbook appears with the content of the old private workbook that you selected. Save the workbook as a standard workbook.
1. You have to re-create links to the deprecated workbook or its contents, including dashboard pins and URL links.

## JSON for legacy workbook conversion

```json
{
  "version": "Notebook/1.0",
  "items": [
    {
      "type": 9,
      "content": {
        "version": "KqlParameterItem/1.0",
        "parameters": [
          {
            "id": "876235fc-ef67-418d-87f5-69f496be171b",
            "version": "KqlParameterItem/1.0",
            "name": "resource",
            "type": 5,
            "typeSettings": {
              "additionalResourceOptions": [
                "value::1"
              ],
              "componentIdOnly": true
            },
            "timeContext": {
              "durationMs": 86400000
            },
            "defaultValue": "value::1"
          }
        ],
        "style": "pills",
        "queryType": 0,
        "resourceType": "microsoft.insights/components"
      },
      "conditionalVisibility": {
        "parameterName": "debug",
        "comparison": "isNotEqualTo"
      },
      "name": "resource selection"
    },
    {
      "type": 1,
      "content": {
        "json": "# Legacy (Favorites based) Workbook Conversion\r\n\r\nThis workbook shows favorite based (legacy) workbooks in this Application Insights resource: \r\n\r\n{resource:grid}\r\n\r\nThe grid below will show the favorite workbooks found, and allows you to copy the contents, or open them as a full Azure Workbook where they can be saved."
      },
      "name": "text - 5"
    },
    {
      "type": 3,
      "content": {
        "version": "KqlItem/1.0",
        "query": "{\"version\":\"ARMEndpoint/1.0\",\"data\":null,\"headers\":[],\"method\":\"GETARRAY\",\"path\":\"{resource}/favorites\",\"urlParams\":[{\"key\":\"api-version\",\"value\":\"2015-05-01\"},{\"key\":\"sourceType\",\"value\":\"notebook\"},{\"key\":\"canFetchContent\",\"value\":\"false\"}],\"batchDisabled\":false,\"transformers\":[{\"type\":\"jsonpath\",\"settings\":{\"columns\":[{\"path\":\"$.Name\",\"columnid\":\"name\"},{\"path\":\"$.FavoriteId\",\"columnid\":\"id\"},{\"path\":\"$.TimeModified\",\"columnid\":\"modified\",\"columnType\":\"datetime\"},{\"path\":\"$.FavoriteType\",\"columnid\":\"type\"}]}}]}",
        "size": 0,
        "title": "Legacy Workbooks (Select an item to see contents)",
        "noDataMessage": "No legacy workbooks found",
        "noDataMessageStyle": 3,
        "exportedParameters": [
          {
            "fieldName": "id",
            "parameterName": "favoriteId"
          },
          {
            "fieldName": "name",
            "parameterName": "name",
            "parameterType": 1
          }
        ],
        "queryType": 12,
        "gridSettings": {
          "rowLimit": 1000,
          "filter": true
        }
      },
      "name": "list favorites"
    },
    {
      "type": 9,
      "content": {
        "version": "KqlParameterItem/1.0",
        "parameters": [
          {
            "id": "8d78556d-a4f3-4868-bf06-9e0980246d31",
            "version": "KqlParameterItem/1.0",
            "name": "config",
            "type": 1,
            "query": "{\"version\":\"ARMEndpoint/1.0\",\"data\":null,\"headers\":[],\"method\":\"GET\",\"path\":\"{resource}/favorites/{favoriteId}\",\"urlParams\":[{\"key\":\"api-version\",\"value\":\"2015-05-01\"},{\"key\":\"sourceType\",\"value\":\"notebook\"},{\"key\":\"canFetchContent\",\"value\":\"true\"}],\"batchDisabled\":false,\"transformers\":[{\"type\":\"jsonpath\",\"settings\":{\"columns\":[{\"path\":\"$.Config\",\"columnid\":\"Content\"}]}}]}",
            "timeContext": {
              "durationMs": 86400000
            },
            "queryType": 12
          }
        ],
        "style": "pills",
        "queryType": 12
      },
      "conditionalVisibility": {
        "parameterName": "debug",
        "comparison": "isNotEqualTo"
      },
      "name": "turn response into param"
    },
    {
      "type": 11,
      "content": {
        "version": "LinkItem/1.0",
        "style": "list",
        "links": [
          {
            "id": "fc93ee9e-d5b2-41de-b74a-1fb62f0df49e",
            "linkTarget": "OpenBlade",
            "linkLabel": "Open Content as Workbook",
            "style": "primary",
            "bladeOpenContext": {
              "bladeName": "UsageNotebookBlade",
              "extensionName": "AppInsightsExtension",
              "bladeParameters": [
                {
                  "name": "ComponentId",
                  "source": "parameter",
                  "value": "resource"
                },
                {
                  "name": "NewNotebookData",
                  "source": "parameter",
                  "value": "config"
                }
              ]
            }
          }
        ]
      },
      "conditionalVisibility": {
        "parameterName": "config",
        "comparison": "isNotEqualTo"
      },
      "name": "links - 4"
    }
  ],
  "$schema": "https://github.com/Microsoft/Application-Insights-Workbooks/blob/master/schema/workbook.json"
}
```


## JSON for private workbook conversion

```json
{
  "version": "Notebook/1.0",
  "items": [
    {
      "type": 9,
      "content": {
        "version": "KqlParameterItem/1.0",
        "crossComponentResources": [
          "{Subscription}"
        ],
        "parameters": [
          {
            "id": "1f74ed9a-e3ed-498d-bd5b-f68f3836a117",
            "version": "KqlParameterItem/1.0",
            "name": "Subscription",
            "type": 6,
            "isRequired": true,
            "typeSettings": {
              "additionalResourceOptions": [
                "value::1"
              ],
              "includeAll": false,
              "showDefault": false
            }
          },
          {
            "id": "b616a3a3-4271-4208-b1a9-a92a78efed08",
            "version": "KqlParameterItem/1.0",
            "name": "ResourceGroup",
            "label": "Resource group",
            "type": 2,
            "isRequired": true,
            "query": "Resources\r\n| summarize by resourceGroup\r\n| order by resourceGroup asc\r\n| project id=resourceGroup, resourceGroup",
            "crossComponentResources": [
              "{Subscription}"
            ],
            "typeSettings": {
              "additionalResourceOptions": [
                "value::1"
              ],
              "showDefault": false
            },
            "queryType": 1,
            "resourceType": "microsoft.resourcegraph/resources"
          },
          {
            "id": "3872fc90-1467-4b01-81ef-d82d90665d72",
            "version": "KqlParameterItem/1.0",
            "name": "Category",
            "type": 2,
            "description": "Workbook Category",
            "isRequired": true,
            "typeSettings": {
              "additionalResourceOptions": [],
              "showDefault": false
            },
            "jsonData": "[\"workbook\",\"sentinel\",\"usage\",\"tsg\",\"usageMetrics\",\"workItems\",\"performance-websites\",\"performance-appinsights\",\"performance-documentdb\",\"performance-storage\",\"performance-storageclassic\",\"performance-vm\",\"performance-vmclassic\",\"performance-sqlserverdatabases\",\"performance-virtualnetwork\",\"performance-virtualmachinescalesets\",\"performance-computedisks\",\"performance-networkinterfaces\",\"performance-logicworkflows\",\"performance-appserviceplans\",\"performance-applicationgateway\",\"performance-runbooks\",\"performance-servicebusqueues\",\"performance-iothubs\",\"performance-networkroutetables\",\"performance-cognitiveserviceaccounts\",\"performance-containerservicemanagedclusters\",\"performance-servicefabricclusters\",\"performance-cacheredis\",\"performance-eventhubnamespaces\",\"performance-hdinsightclusters\",\"failure-websites\",\"failure-appinsights\",\"failure-documentdb\",\"failure-storage\",\"failure-storageclassic\",\"failure-vm\",\"failure-vmclassic\",\"failure-sqlserverdatabases\",\"failure-virtualnetwork\",\"failure-virtualmachinescalesets\",\"failure-computedisks\",\"failure-networkinterfaces\",\"failure-logicworkflows\",\"failure-appserviceplans\",\"failure-applicationgateway\",\"failure-runbooks\",\"failure-servicebusqueues\",\"failure-iothubs\",\"failure-networkroutetables\",\"failure-cognitiveserviceaccounts\",\"failure-containerservicemanagedclusters\",\"failure-servicefabricclusters\",\"failure-cacheredis\",\"failure-eventhubnamespaces\",\"failure-hdinsightclusters\",\"storage-insights\",\"cosmosdb-insights\",\"vm-insights\",\"container-insights\",\"keyvaults-insights\",\"backup-insights\",\"rediscache-insights\",\"servicebus-insights\",\"eventhub-insights\",\"workload-insights\",\"adxcluster-insights\",\"wvd-insights\",\"activitylog-insights\",\"hdicluster-insights\",\"laws-insights\",\"hci-insights\"]",
            "defaultValue": "workbook"
          }
        ],
        "queryType": 1,
        "resourceType": "microsoft.resourcegraph/resources"
      },
      "name": "resource selection"
    },
    {
      "type": 1,
      "content": {
        "json": "# Private Workbook Conversion\r\n\r\nThis workbook shows private workbooks within the current subscription / resource group: \r\n\r\n| Subscription | Resource Group | \r\n|--------------|----------------|\r\n|{Subscription}|{ResourceGroup} |\r\n\r\nThe grid below will show the private workbooks found, and allows you to copy the contents, or open them as a full Azure Workbook where they can be saved.\r\n\r\nUse the button below to load the selected private workbook content into a new workbook. From there you can save it as a new workbook."
      },
      "name": "text - 5"
    },
    {
      "type": 3,
      "content": {
        "version": "KqlItem/1.0",
        "query": "{\"version\":\"ARMEndpoint/1.0\",\"data\":null,\"headers\":[],\"method\":\"GETARRAY\",\"path\":\"/{Subscription}/resourceGroups/{ResourceGroup}/providers/microsoft.insights/myworkbooks\",\"urlParams\":[{\"key\":\"api-version\",\"value\":\"2020-10-20\"},{\"key\":\"category\",\"value\":\"{Category}\"}],\"batchDisabled\":false,\"transformers\":[{\"type\":\"jsonpath\",\"settings\":{\"tablePath\":\"$..[?(@.kind == \\\"user\\\")]\",\"columns\":[{\"path\":\"$.properties.displayName\",\"columnid\":\"name\"},{\"path\":\"$.name\",\"columnid\":\"id\"},{\"path\":\"$.kind\",\"columnid\":\"type\",\"columnType\":\"string\"},{\"path\":\"$.properties.timeModified\",\"columnid\":\"modified\",\"columnType\":\"datetime\"},{\"path\":\"$.properties.sourceId\",\"columnid\":\"resource\",\"columnType\":\"string\"}]}}]}",
        "size": 1,
        "title": "Private Workbooks",
        "noDataMessage": "No private workbooks found",
        "noDataMessageStyle": 3,
        "exportedParameters": [
          {
            "fieldName": "id",
            "parameterName": "id"
          },
          {
            "fieldName": "name",
            "parameterName": "name",
            "parameterType": 1
          },
          {
            "fieldName": "resource",
            "parameterName": "resource",
            "parameterType": 1
          }
        ],
        "queryType": 12,
        "gridSettings": {
          "formatters": [
            {
              "columnMatch": "resource",
              "formatter": 13,
              "formatOptions": {
                "linkTarget": null,
                "showIcon": true
              }
            }
          ],
          "rowLimit": 1000,
          "filter": true,
          "labelSettings": [
            {
              "columnId": "resource",
              "label": "Linked To"
            }
          ]
        },
        "sortBy": []
      },
      "name": "list private workbooks"
    },
    {
      "type": 9,
      "content": {
        "version": "KqlParameterItem/1.0",
        "parameters": [
          {
            "id": "8d78556d-a4f3-4868-bf06-9e0980246d31",
            "version": "KqlParameterItem/1.0",
            "name": "config",
            "type": 1,
            "query": "{\"version\":\"ARMEndpoint/1.0\",\"data\":null,\"headers\":[],\"method\":\"GET\",\"path\":\"{Subscription}/resourceGroups/{ResourceGroup}/providers/microsoft.insights/myworkbooks/{id}\",\"urlParams\":[{\"key\":\"api-version\",\"value\":\"2020-10-20\"},{\"key\":\"sourceType\",\"value\":\"notebook\"},{\"key\":\"canFetchContent\",\"value\":\"true\"}],\"batchDisabled\":false,\"transformers\":[{\"type\":\"jsonpath\",\"settings\":{\"columns\":[{\"path\":\"$..serializedData\",\"columnid\":\"Content\"}]}}]}",
            "timeContext": {
              "durationMs": 86400000
            },
            "queryType": 12
          }
        ],
        "style": "pills",
        "queryType": 12
      },
      "conditionalVisibility": {
        "parameterName": "debug",
        "comparison": "isNotEqualTo"
      },
      "name": "turn response into param"
    },
    {
      "type": 11,
      "content": {
        "version": "LinkItem/1.0",
        "style": "list",
        "links": [
          {
            "id": "fc93ee9e-d5b2-41de-b74a-1fb62f0df49e",
            "linkTarget": "OpenBlade",
            "linkLabel": "Open Content as Workbook",
            "style": "primary",
            "bladeOpenContext": {
              "bladeName": "UsageNotebookBlade",
              "extensionName": "AppInsightsExtension",
              "bladeParameters": [
                {
                  "name": "ComponentId",
                  "source": "parameter",
                  "value": "resource"
                },
                {
                  "name": "NewNotebookData",
                  "source": "parameter",
                  "value": "config"
                }
              ]
            }
          }
        ]
      },
      "conditionalVisibility": {
        "parameterName": "config",
        "comparison": "isNotEqualTo"
      },
      "name": "links - 4"
    }
  ],
  "$schema": "https://github.com/Microsoft/Application-Insights-Workbooks/blob/master/schema/workbook.json"
}
```