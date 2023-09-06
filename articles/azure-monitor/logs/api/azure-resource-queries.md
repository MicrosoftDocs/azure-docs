---
title: Querying logs for Azure resources
description: In Log Analytics, queries typically execute in the context of a workspace. A workspace may contain data for many resources, making it difficult to isolate data for a particular resource.
ms.date: 12/07/2021
author: guywi-ms
ms.author: guywild
ms.topic: article
---
# Querying logs for Azure resources

In Azure Monitor Log Analytics, queries typically execute in the context of a workspace. A workspace may contain data for many resources, making it difficult to isolate data for a particular resource. Resources may additionally send data to multiple workspaces. To simplify this experience, the REST API permits querying Azure resources directly for their logs.

## Response format

Azure resource queries produce the [same response shape](response-format.md) as queries targeting a Log Analytics workspace.

## URL format

Consider an Azure resource with a fully qualified identifier:

```
    /subscriptions/<sid>/resourceGroups/<rg>/providers/<providerName>/<resourceType>/<resourceName>
```

A query for this resource's logs against the direct API endpoint would go to the following URL:

```
    https://api.loganalytics.azure.com/v1/subscriptions/<sid>/resourceGroups/<rg>/providers/<providerName>/<resourceType>/<resourceName>/query
```

A query to the same resource via ARM would use the following URL:

```
    https://management.azure.com/subscriptions/<sid>/resourceGroups/<rg>/providers/<providerName>/<resourceType>/<resourceName>/providers/microsoft.insights/logs?api-version=2018-03-01-preview
```

Essentially, this URL is the fully qualified Azure resource plus the extension provider: `/providers/microsoft.insights/logs`.

## Table access and RBAC

The `microsoft.insights` resource provider exposes a new set of operations for controlling access to logs at the table level. These operations have the following format for a table named `tableName`.

```
    microsoft.insights/logs/<tableName>/read 
```

This permission can be added to roles using the ‘actions’ property to allow specified tables and the ‘notActions’ property to disallow specified tables.

## Workspace access control

Today, Azure resource queries look over Log Analytics workspaces as possible data sources. However, administrators may have locked down access to the workspace via RBAC roles. By default, the API only returns results from workspaces the user has permissions to access.

Workspace administrators may want to utilize Azure resource queries without breaking existing RBAC, creating a scenario where a user may have access to read the logs for an Azure resource, but may not have permission to query the workspace containing those logs. Workspace administrators resource, to view logs via a boolean property on the workspace. This allows users to access the logs pertaining to the target Azure resource in a particular workspace, so long as the user has access to read the logs for the target Azure resource. 

This is the action for scoping access to Tables at the workspace level:

```
    microsoft.operationalinsights/workspaces/query/<tableName>/read 
```

## Error responses

Below is a brief listing of common failure scenarios when querying Azure resources along with a description of symptomatic behavior.

### Azure resource does not exist

```
    HTTP/1.1 404 Not Found 
    { 
        "error": { 
            "message": "The resource /subscriptions/7fd50ca7-1e78-4144-ab9c-0ec2faafa046/resourcegroups/test-rg/providers/microsoft.storage/storageaccounts/exampleResource was not found", 
            "code": "ResourceNotFoundError" 
        }
    }
```
### No access to resource

```
    HTTP/1.1 403 Forbidden 
    { 
        "error": { 
            "message": "The provided credentials have insufficient access to  perform the requested operation", 
            "code": "InsufficientAccessError", 
            "innererror": { 
                "code": "AuthorizationFailedError",
                "message": "User '92eba38a-70da-42b0-ab83-ffe82cce658f' does not have access to read logs for this resource" 
        } 
    }
```

### No logs from resource, or no permission to workspace containing those logs

Depending on the precise combination of data and permissions, the response will either contain a 200 with no resulting data or will throw a syntax error (4xx error).

## Partial access

There are some scenarios where a user may have partial permissions to access a particular resource's logs. When a user is missing either:

  - Access to the workspace containing logs for the Azure resource
  - Access to the tables reference in the query

They will see a normal response, with data sources the user does not have permissions to access silently filtered out. To see information about a user's access to an Azure resource, the underlying Log Analytics workspaces, and to specific tables, include the header `Prefer: include-permissions=true` with requests. This will cause the response JSON to include a section like the following:

```
    { 
        "permissions": { 
            "resources": [ 
                { 
                    "resourceId": "/subscriptions/<id>/resourceGroups<id>/providers/Microsoft.Compute/virtualMachines/VM1", 
                    "dataSources": [ 
                        "/subscriptions/<id>/resourceGroups<id>/providers/Microsoft.OperationalInsights/workspaces/WS1" 
                    ] 
                }, 
                { 
                    "resourceId": "/subscriptions/<id>/resourceGroups<id>/providers/Microsoft.Compute/virtualMachines/VM2", 
                    "denyTables": [ 
                        "SecurityEvent", 
                        "SecurityBaseline" 
                    ], 
                    "dataSources": [ 
                        "/subscriptions/<id>/resourceGroups<id>/providers/Microsoft.OperationalInsights/workspaces/WS2",
                        "/subscriptions/<id>/resourceGroups<id>/providers/Microsoft.OperationalInsights/workspaces/WS3" 
                    ] 
                } 
            ], 
            "dataSources": [ 
                { 
                    "resourceId": "/subscriptions/<id>/resourceGroups<id>/providers/Microsoft.OperationalInsights/workspaces/WS1", 
                    "denyTables": [ 
                        "Tables.Custom" 
                    ] 
                }, 
                { 
                    "resourceId": "/subscriptions/<id>/resourceGroups<id>/providers/Microsoft.OperationalInsights/workspaces/WS2" 
                } 
            ] 
        } 
    } 
```

The `resources` payload describes an attempt to query two VMs. VM1 sends data to workspace WS1, while VM2 sends data to two workspaces: WS2 and WS3. Additionally, the user does not have permission to query the `SecurityEvent` or `SecurityBaseline` tables for the resource.

The `dataSources` payload filters the results further by describing which workspaces the user can query. Here the user does not have permissions to query WS3, and an additional table filtered out of WS1.

To clearly state what data such a query would return:

  - Logs for VM1 in WS1, excluding Tables.Custom from the workspace.
  - Logs for VM2, excluding SecurityEvent and SecurityBaseline, in WS2.