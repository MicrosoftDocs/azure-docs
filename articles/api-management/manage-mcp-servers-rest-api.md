---
title: Manage MCP Servers Programmatically in API Management
description: Learn how to create and manage MCP servers in Azure API Management by using the REST API, ARM templates, Bicep, the Azure CLI, and Terraform. 
ms.service: azure-api-management
ms.date: 06/23/2026
ms.topic: how-to
ai-usage: ai-assisted
ms.collection: ce-skilling-ai-copilot
---
# Manage MCP servers programmatically in API Management

In this article, you learn how to create and manage MCP servers in Azure API Management by using the REST API, ARM templates, Bicep, the Azure CLI, and Terraform. 

> [!IMPORTANT]
> The MCP server management features described in this article require API Management REST API version 2025-09-01-preview or later. Pin this version in every request. 

For background about MCP server capabilities, see [About MCP servers in Azure API Management](mcp-server-overview.md).

## Prerequisites

* Your identity needs permissions to read the API Management service and create or update APIs, API tools, API policies, and product API bindings. For Terraform, the identity also needs read access to the existing API Management service used by the `azurerm_api_management` data source.
* For Azure CLI:
    [!INCLUDE [azure-cli-prepare-your-environment-no-header](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

* For Azure PowerShell:
    [!INCLUDE [azure-powershell-requirements-no-header.md](~/reusable-content/ce-skilling/azure/includes/azure-powershell-requirements-no-header.md)]

* For Terraform:
  [Install and configure Terraform](/azure/developer/terraform/quickstart-configure)


## Resource model 

Azure Resource Manager represents MCP servers as follows: 

- **MCP server:** An API Management [API](/rest/api/apimanagement/api/create-or-update?view=rest-apimanagement-2025-09-01-preview) resource of [type](/rest/api/apimanagement/api/create-or-update?view=rest-apimanagement-2025-09-01-preview#apitype) `MCP`.

- **Passthrough server:** Points at an existing external MCP backend. The MCP server resource declares the backend URL and transport type (streamable HTTP or SSE). 

- **Tool:** An [API tool](/rest/api/apimanagement/api-tool/create-or-update?view=rest-apimanagement-2025-09-01-preview) sub-resource of an MCP server. You can safely manage tool resources from CI/CD. You can add, rename, or remove tools without recreating the MCP server. 

- **Policies:** As with regular APIs, attach [API policy](/rest/api/apimanagement/api-policy/create-or-update?view=rest-apimanagement-2025-09-01-preview) or [policy](/rest/api/apimanagement/policies/policy/create-or-update?view=rest-apimanagement-2025-09-01-preview) sub-resources to an MCP server. 

- **Products:** Product binding is a separate child relationship (`products/{productId}/apis/{mcpServerId}`), enabling independent deployment and multi-product binding.

## REST examples

For clarity, the following examples show abbreviated response bodies. For full response schemas, see the [API Management REST API reference](/rest/api/apimanagement/?view=rest-apimanagement-2025-09-01-preview).

Adding the `If-Match: *` header in the PUT and DELETE call examples makes the requests idempotent. This header applies whether or not the resource already exists, which is the recommended pattern for CI/CD pipelines.

### Before you begin

Set the following variables before running any example. All examples in this section reference these variables.

# [Bash](#tab/bash)

```bash
SUBSCRIPTION_ID="<your-subscription-id>"
RESOURCE_GROUP="<your-resource-group>"
APIM_NAME="<your-api-management-service-name>"
API_VERSION="2025-09-01-preview"
BASE_URL="https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.ApiManagement/service/${APIM_NAME}"
TOKEN=$(az account get-access-token --resource https://management.azure.com --query accessToken -o tsv)
```

# [PowerShell](#tab/powershell)

```powershell
$subscriptionId = "<your-subscription-id>"
$resourceGroup  = "<your-resource-group>"
$apimName       = "<your-apim-service-name>"
$apiVersion     = "2025-09-01-preview"
$baseUri        = "https://management.azure.com/subscriptions/$subscriptionId" +
                  "/resourceGroups/$resourceGroup" +
                  "/providers/Microsoft.ApiManagement/service/$apimName"
```

`Invoke-AzRestMethod` uses the current `Connect-AzAccount` session for authentication. No separate token step is needed.

---

### List MCP servers

Returns all APIs in the instance filtered to type `mcp`. Use the `$top` and `$skip` query parameters to page through large result sets.

Reference: [Api - List By Service](/rest/api/apimanagement/api/list-by-service?view=rest-apimanagement-2025-09-01-preview)

# [Bash](#tab/bash)

```bash
curl -sG "${BASE_URL}/apis" \
  --data-urlencode "api-version=${API_VERSION}" \
  --data-urlencode "\$filter=type eq 'mcp'" \
  -H "Authorization: Bearer ${TOKEN}"
```

# [PowerShell](#tab/powershell)

```powershell
$uri = "$baseUri/apis?api-version=$apiVersion&`$filter=type eq 'mcp'"
(Invoke-AzRestMethod -Method GET -Uri $uri).Content | ConvertFrom-Json
```

---

**Response (200 OK)**

```json
{
  "count": 1,
  "value": [
    {
      "id": "/subscriptions/.../apis/my-mcp-server",
      "name": "my-mcp-server",
      "type": "Microsoft.ApiManagement/service/apis",
      "properties": {
        "type": "mcp",
        "displayName": "My MCP Server",
        "path": "my-mcp",
        "protocols": [ "https" ]
      }
    }
  ]
}
```

**Common error:** `401 Unauthorized`. The bearer token is expired. Re-run the token acquisition command.

---

### Get a single MCP server

Reference: [Api - Get](/rest/api/apimanagement/api/get?view=rest-apimanagement-2025-09-01-preview)

# [Bash](#tab/bash)

```bash
MCP_SERVER_ID="my-mcp-server"

curl -s "${BASE_URL}/apis/${MCP_SERVER_ID}?api-version=${API_VERSION}" \
  -H "Authorization: Bearer ${TOKEN}"
```

# [PowerShell](#tab/powershell)

```powershell
$mcpServerId = "my-mcp-server"

$uri = "$baseUri/apis/$mcpServerId?api-version=$apiVersion"
(Invoke-AzRestMethod -Method GET -Uri $uri).Content | ConvertFrom-Json
```

---

**Response (200 OK)**

```json
{
  "id": "/subscriptions/.../apis/my-mcp-server",
  "name": "my-mcp-server",
  "type": "Microsoft.ApiManagement/service/apis",
  "properties": {
    "type": "mcp",
    "displayName": "My MCP Server",
    "path": "my-mcp",
    "protocols": [ "https" ],
    "serviceUrl": "https://api.contoso.com"
  }
}
```

**Common error:** `404 Not Found`. Confirm that `mcpServerId` matches the `name` field returned by the List operation.

---

### Create a REST API-backed MCP server

Creates the MCP server resource. After creation, add tools to it individually by using the [Add or update a tool](#add-or-update-a-tool) operation. Each tool references a specific operation in a backing REST API resource.

Reference: [Api - Create Or Update](/rest/api/apimanagement/api/create-or-update?view=rest-apimanagement-2025-09-01-preview)

# [Bash](#tab/bash)

```bash
MCP_SERVER_ID="my-mcp-server"

curl -s -X PUT \
  "${BASE_URL}/apis/${MCP_SERVER_ID}?api-version=${API_VERSION}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -H "If-Match: *" \
  -d '{
    "properties": {
      "type": "mcp",
      "path": "my-mcp",
      "displayName": "My MCP Server",
      "description": "MCP server backed by a REST API",
      "protocols": ["https"]
    }
  }'
```

# [PowerShell](#tab/powershell)

```powershell
$mcpServerId = "my-mcp-server"

$uri  = "$baseUri/apis/$mcpServerId?api-version=$apiVersion"
$body = @{
    properties = @{
        type        = "mcp"
        path        = "my-mcp"
        displayName = "My MCP Server"
        description = "MCP server backed by a REST API"
        protocols   = @("https")
    }
} | ConvertTo-Json -Depth 5

Invoke-AzRestMethod -Method PUT -Uri $uri -Payload $body `
    -Headers @{ "If-Match" = "*" }
```

---

**Response (201 Created)**

```json
{
  "id": "/subscriptions/.../apis/my-mcp-server",
  "name": "my-mcp-server",
  "type": "Microsoft.ApiManagement/service/apis",
  "properties": {
    "type": "mcp",
    "displayName": "My MCP Server",
    "path": "my-mcp",
    "protocols": ["https"],
    "provisioningState": "InProgress"
  }
}
```

> [!NOTE]
> `provisioningState: InProgress` is expected for async PUT operations. Poll the URL returned in the `Azure-AsyncOperation` response header to confirm completion.

**Common error:** `400 Bad Request`. Ensure `type` is `"mcp"` and `path` is unique within the service instance.

---

### Create a passthrough MCP server

A passthrough server forwards all MCP requests directly to an external MCP backend. Set `mcpProperties.transportType` to match the transport that your backend implements.

Before creating a passthrough server, confirm that the backend is reachable from the API Management gateway and implements the selected MCP transport at the endpoint paths you configure. If the backend requires authentication, configure the required credentials or headers by using API Management policies or backend configuration.

Reference: [Api - Create Or Update](/rest/api/apimanagement/api/create-or-update?view=rest-apimanagement-2025-09-01-preview)

#### Streamable HTTP transport

Use `streamable` for backends that implement the current MCP streamable HTTP transport specification. A single endpoint definition is required.

# [Bash](#tab/bash)

```bash
MCP_SERVER_ID="my-mcp-passthrough"

curl -s -X PUT \
  "${BASE_URL}/apis/${MCP_SERVER_ID}?api-version=${API_VERSION}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -H "If-Match: *" \
  -d '{
    "properties": {
      "type": "mcp",
      "path": "my-mcp-passthrough",
      "displayName": "My Passthrough MCP Server",
      "description": "Passthrough MCP server using streamable HTTP transport",
      "protocols": ["https"],
      "serviceUrl": "https://mcp-backend.contoso.com",
      "mcpProperties": {
        "transportType": "streamable",
        "endpoints": [
          { "name": "message", "uriTemplate": "/mcp" }
        ]
      }
    }
  }'
```

# [PowerShell](#tab/powershell)

```powershell
$mcpServerId = "my-mcp-passthrough"

$uri  = "$baseUri/apis/$mcpServerId?api-version=$apiVersion"
$body = @{
    properties = @{
        type          = "mcp"
        path          = "my-mcp-passthrough"
        displayName   = "My Passthrough MCP Server"
        description   = "Passthrough MCP server using streamable HTTP transport"
        protocols     = @("https")
        serviceUrl    = "https://mcp-backend.contoso.com"
        mcpProperties = @{
            transportType = "streamable"
            endpoints     = @(
                @{ name = "message"; uriTemplate = "/mcp" }
            )
        }
    }
} | ConvertTo-Json -Depth 10

Invoke-AzRestMethod -Method PUT -Uri $uri -Payload $body `
    -Headers @{ "If-Match" = "*" }
```

---

**Response (201 Created)**

```json
{
  "id": "/subscriptions/.../apis/my-mcp-passthrough",
  "name": "my-mcp-passthrough",
  "type": "Microsoft.ApiManagement/service/apis",
  "properties": {
    "type": "mcp",
    "displayName": "My Passthrough MCP Server",
    "path": "my-mcp-passthrough",
    "protocols": ["https"],
    "serviceUrl": "https://mcp-backend.contoso.com",
    "provisioningState": "InProgress",
    "mcpProperties": {
      "transportType": "streamable",
      "endpoints": [ { "name": "message", "uriTemplate": "/mcp" } ]
    }
  }
}
```

#### SSE transport

Use `sse` for backends that implement the HTTP+SSE (Server-Sent Events) transport. Define two endpoints: one for the SSE event stream and one for the message channel.

# [Bash](#tab/bash)

```bash
MCP_SERVER_ID="my-mcp-sse"

curl -s -X PUT \
  "${BASE_URL}/apis/${MCP_SERVER_ID}?api-version=${API_VERSION}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -H "If-Match: *" \
  -d '{
    "properties": {
      "type": "mcp",
      "path": "my-mcp-sse",
      "displayName": "My SSE MCP Server",
      "description": "Passthrough MCP server using SSE transport",
      "protocols": ["https"],
      "serviceUrl": "https://mcp-backend.contoso.com",
      "mcpProperties": {
        "transportType": "sse",
        "endpoints": [
          { "name": "sse",     "uriTemplate": "/sse" },
          { "name": "message", "uriTemplate": "/messages" }
        ]
      }
    }
  }'
```

# [PowerShell](#tab/powershell)

```powershell
$mcpServerId = "my-mcp-sse"

$uri  = "$baseUri/apis/$mcpServerId?api-version=$apiVersion"
$body = @{
    properties = @{
        type          = "mcp"
        path          = "my-mcp-sse"
        displayName   = "My SSE MCP Server"
        description   = "Passthrough MCP server using SSE transport"
        protocols     = @("https")
        serviceUrl    = "https://mcp-backend.contoso.com"
        mcpProperties = @{
            transportType = "sse"
            endpoints     = @(
                @{ name = "sse";     uriTemplate = "/sse" },
                @{ name = "message"; uriTemplate = "/messages" }
            )
        }
    }
} | ConvertTo-Json -Depth 10

Invoke-AzRestMethod -Method PUT -Uri $uri -Payload $body `
    -Headers @{ "If-Match" = "*" }
```

---

**Common errors:**
- `400 Bad Request`. Invalid `mcpProperties`. Verify `transportType` is `streamable` or `sse`, and every `uriTemplate` starts with `/`.
- `400 Bad Request`. SSE transport requires exactly two endpoints (`sse` and `message`). Streamable transport requires one (`message`).

---

### Add or update a tool

Adds a new tool to a REST API-backed MCP server, or updates an existing one. The `operationId` field links the tool to a specific operation in a backing REST API resource. You can add, update, or remove tools independently without recreating the parent server.

Reference: [Api Tool - Create Or Update](/rest/api/apimanagement/api-tool/create-or-update?view=rest-apimanagement-2025-09-01-preview)

# [Bash](#tab/bash)

```bash
MCP_SERVER_ID="my-mcp-server"
TOOL_ID="listOrders"
BACKING_API_ID="orders-api"
BACKING_OP_ID="list-orders"
OP_ID="/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.ApiManagement/service/${APIM_NAME}/apis/${BACKING_API_ID}/operations/${BACKING_OP_ID}"

curl -s -X PUT \
  "${BASE_URL}/apis/${MCP_SERVER_ID}/tools/${TOOL_ID}?api-version=${API_VERSION}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -H "If-Match: *" \
  --data-raw "{
    \"properties\": {
      \"displayName\": \"listOrders\",
      \"description\": \"List all orders for a customer\",
      \"operationId\": \"${OP_ID}\"
    }
  }"
```

# [PowerShell](#tab/powershell)

```powershell
$mcpServerId  = "my-mcp-server"
$toolId       = "listOrders"
$backingApiId = "orders-api"
$backingOpId  = "list-orders"

$uri         = "$baseUri/apis/$mcpServerId/tools/$toolId?api-version=$apiVersion"
$operationId = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroup" +
               "/providers/Microsoft.ApiManagement/service/$apimName" +
               "/apis/$backingApiId/operations/$backingOpId"
$body = @{
    properties = @{
        displayName = $toolId
        description = "List all orders for a customer"
        operationId = $operationId
    }
} | ConvertTo-Json -Depth 5

Invoke-AzRestMethod -Method PUT -Uri $uri -Payload $body `
    -Headers @{ "If-Match" = "*" }
```

---

**Response (201 Created)**

```json
{
  "id": "/subscriptions/.../apis/my-mcp-server/tools/listOrders",
  "name": "listOrders",
  "type": "Microsoft.ApiManagement/service/apis/tools",
  "properties": {
    "displayName": "listOrders",
    "description": "List all orders for a customer",
    "operationId": "/subscriptions/.../apis/orders-api/operations/list-orders"
  }
}
```

**Common errors:**
- `400 Bad Request`. The `operationId` path is malformed or the referenced operation doesn't exist.
- `404 Not Found`. The parent MCP server doesn't exist. Create the server before adding tools.

---

### Delete a tool

Removes a tool from an MCP server. Delete tools before deleting the backing REST API operations they reference; otherwise, the delete fails with a dependency error.

Reference: [Api Tool - Delete](/rest/api/apimanagement/api-tool/delete?view=rest-apimanagement-2025-09-01-preview)

# [Bash](#tab/bash)

```bash
MCP_SERVER_ID="my-mcp-server"
TOOL_ID="listOrders"

curl -s -X DELETE \
  "${BASE_URL}/apis/${MCP_SERVER_ID}/tools/${TOOL_ID}?api-version=${API_VERSION}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "If-Match: *"
```

# [PowerShell](#tab/powershell)

```powershell
$mcpServerId = "my-mcp-server"
$toolId      = "listOrders"

$uri = "$baseUri/apis/$mcpServerId/tools/$toolId?api-version=$apiVersion"
Invoke-AzRestMethod -Method DELETE -Uri $uri `
    -Headers @{ "If-Match" = "*" }
```

---

**Response:** `200 OK` on success.

**Common error:** `412 Precondition Failed` — `If-Match` is required for deletions. Use `If-Match: *` to match any ETag.

---

### Apply a policy at MCP scope

Creates or replaces the policy document attached to an MCP server. The server evaluates policies at this scope for every tool invocation. The `rawxml` format accepts unencoded policy XML.

Reference: [Api Policy - Create Or Update](/rest/api/apimanagement/api-policy/create-or-update?view=rest-apimanagement-2025-09-01-preview)

# [Bash](#tab/bash)

```bash
MCP_SERVER_ID="my-mcp-server"
POLICY='<policies><inbound><base /><rate-limit calls="100" renewal-period="60" /></inbound><backend><forward-request /></backend><outbound><base /></outbound></policies>'

curl -s -X PUT \
  "${BASE_URL}/apis/${MCP_SERVER_ID}/policies/policy?api-version=${API_VERSION}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -H "If-Match: *" \
  --data-raw "{\"properties\":{\"format\":\"rawxml\",\"value\":\"${POLICY}\"}}"
```

# [PowerShell](#tab/powershell)

```powershell
$mcpServerId = "my-mcp-server"

$uri    = "$baseUri/apis/$mcpServerId/policies/policy?api-version=$apiVersion"
$policy = '<policies><inbound><base /><rate-limit calls="100" renewal-period="60" /></inbound>' +
          '<backend><forward-request /></backend>' +
          '<outbound><base /></outbound></policies>'
$body   = @{
    properties = @{
        format = "rawxml"
        value  = $policy
    }
} | ConvertTo-Json

Invoke-AzRestMethod -Method PUT -Uri $uri -Payload $body `
    -Headers @{ "If-Match" = "*" }
```

---

**Response (200 OK)**

```json
{
  "id": "/subscriptions/.../apis/my-mcp-server/policies/policy",
  "name": "policy",
  "type": "Microsoft.ApiManagement/service/apis/policies",
  "properties": {
    "value": "<policies>...</policies>"
  }
}
```

**Common error:** `400 Bad Request`. Malformed policy XML. Validate the document before sending.

---

### Bind an MCP server to a product

Associates the MCP server with a product, so subscribers of that product can call the server's tools. The request has no body.

When you bind the MCP server to a product, you make it available through that product, but clients still need access according to the product's configuration. If the product requires subscriptions, the client must use a valid subscription key for that product. 

Reference: [Product Api - Create Or Update](/rest/api/apimanagement/product-api/create-or-update?view=rest-apimanagement-2025-09-01-preview)

# [Bash](#tab/bash)

```bash
MCP_SERVER_ID="my-mcp-server"
PRODUCT_ID="my-product"

curl -s -X PUT \
  "${BASE_URL}/products/${PRODUCT_ID}/apis/${MCP_SERVER_ID}?api-version=${API_VERSION}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Length: 0"
```

# [PowerShell](#tab/powershell)

```powershell
$mcpServerId = "my-mcp-server"
$productId   = "my-product"

$uri = "$baseUri/products/$productId/apis/$mcpServerId?api-version=$apiVersion"
Invoke-AzRestMethod -Method PUT -Uri $uri
```

---

**Response:** `201 Created` with the MCP server's API contract in the body.

**Common error:** `404 Not Found`. Verify that both `productId` and `mcpServerId` exist before creating the binding.

---

### Delete an MCP server

Deletes an MCP server and all its tool and policy sub-resources. Before deleting the server, remove any tools that reference operations in backing APIs; otherwise, you can't delete those operations while the tool reference exists.

Reference: [Api - Delete](/rest/api/apimanagement/api/delete?view=rest-apimanagement-2025-09-01-preview)

# [Bash](#tab/bash)

```bash
MCP_SERVER_ID="my-mcp-server"

curl -s -X DELETE \
  "${BASE_URL}/apis/${MCP_SERVER_ID}?api-version=${API_VERSION}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "If-Match: *"
```

# [PowerShell](#tab/powershell)

```powershell
$mcpServerId = "my-mcp-server"

$uri = "$baseUri/apis/$mcpServerId?api-version=$apiVersion"
Invoke-AzRestMethod -Method DELETE -Uri $uri `
    -Headers @{ "If-Match" = "*" }
```

---

**Response:** `200 OK` on success.

**Common error:** `412 Precondition Failed`. `If-Match` is required for deletions. Use `If-Match: *` to bypass ETag checking.

## ARM and Bicep templates

The following templates deploy a complete MCP server configuration in a single deployment. Each template assumes an existing API Management service instance and uses a parameter table so you can reuse the same file across environments by changing only the parameter values.

### REST API-backed MCP server

These templates create an MCP server, define one tool that maps to an operation in an existing backing REST API, attach a rate-limit policy at the server scope, and bind the server to an existing product. You can do all these tasks in a single deployment.

**Prerequisites:** an existing API Management service, a REST API (`backingApiId`) with at least one operation (`backingOperationId`), and an existing product (`productId`).

| Parameter | Required | Default | Description |
|---|---|---|---|
| `serviceName` | Yes | — | Name of the existing API Management service instance. |
| `mcpServerId` | No | `orders-mcp` | Resource name for the new MCP server. Must be unique within the service. |
| `backingApiId` | Yes | — | Resource name of the existing REST API that backs this MCP server. |
| `backingOperationId` | Yes | — | Resource name of the operation to expose as a tool. |
| `toolId` | No | `sampleTool` | Resource name and display name of the MCP tool to create. |
| `productId` | No | `starter` | Resource name of the existing product to bind the server to. |

# [Bicep](#tab/bicep)

```bicep
@description('Name of the existing API Management service instance.')
param serviceName string

@description('Resource name for the new MCP server.')
param mcpServerId string = 'orders-mcp'

@description('Resource name of the existing REST API that backs this MCP server.')
param backingApiId string

@description('Resource name of the operation in the backing REST API to expose as a tool.')
param backingOperationId string

@description('Resource name and display name of the MCP tool to create.')
param toolId string = 'sampleTool'

@description('Resource name of the existing product to bind the MCP server to.')
param productId string = 'starter'

resource apimService 'Microsoft.ApiManagement/service@2025-09-01-preview' existing = {
  name: serviceName
}

resource mcpServer 'Microsoft.ApiManagement/service/apis@2025-09-01-preview' = {
  parent: apimService
  name: mcpServerId
  properties: {
    type: 'mcp'
    displayName: 'Orders MCP Server'
    description: 'MCP server backed by the Orders REST API'
    path: mcpServerId
    protocols: [ 'https' ]
    subscriptionRequired: true
  }
}

resource mcpTool 'Microsoft.ApiManagement/service/apis/tools@2025-09-01-preview' = {
  parent: mcpServer
  name: toolId
  properties: {
    displayName: toolId
    description: 'MCP tool backed by an API operation'
    operationId: resourceId(
      'Microsoft.ApiManagement/service/apis/operations',
      serviceName, backingApiId, backingOperationId
    )
  }
}

resource mcpPolicy 'Microsoft.ApiManagement/service/apis/policies@2025-09-01-preview' = {
  parent: mcpServer
  name: 'policy'
  properties: {
    format: 'rawxml'
    value: '''<policies>
  <inbound>
    <base />
    <rate-limit calls="100" renewal-period="60" />
  </inbound>
  <backend>
    <forward-request />
  </backend>
  <outbound>
    <base />
  </outbound>
</policies>'''
  }
}

resource product 'Microsoft.ApiManagement/service/products@2025-09-01-preview' existing = {
  parent: apimService
  name: productId
}

resource productBinding 'Microsoft.ApiManagement/service/products/apis@2025-09-01-preview' = {
  parent: product
  name: mcpServerId
  dependsOn: [ mcpServer ]
}
```

# [ARM template](#tab/arm-template)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "serviceName": {
      "type": "string",
      "metadata": { "description": "Name of the existing API Management service instance." }
    },
    "mcpServerId": {
      "type": "string",
      "defaultValue": "orders-mcp",
      "metadata": { "description": "Resource name for the new MCP server." }
    },
    "backingApiId": {
      "type": "string",
      "metadata": { "description": "Resource name of the existing REST API that backs this MCP server." }
    },
    "backingOperationId": {
      "type": "string",
      "metadata": { "description": "Resource name of the operation in the backing REST API to expose as a tool." }
    },
    "toolId": {
      "type": "string",
      "defaultValue": "sampleTool",
      "metadata": { "description": "Resource name and display name of the MCP tool to create." }
    },
    "productId": {
      "type": "string",
      "defaultValue": "starter",
      "metadata": { "description": "Resource name of the existing product to bind the server to." }
    }
  },
  "resources": [
    {
      "type": "Microsoft.ApiManagement/service/apis",
      "apiVersion": "2025-09-01-preview",
      "name": "[concat(parameters('serviceName'), '/', parameters('mcpServerId'))]",
      "properties": {
        "type": "mcp",
        "displayName": "Orders MCP Server",
        "description": "MCP server backed by the Orders REST API",
        "path": "[parameters('mcpServerId')]",
        "protocols": [ "https" ],
        "subscriptionRequired": true
      }
    },
    {
      "type": "Microsoft.ApiManagement/service/apis/tools",
      "apiVersion": "2025-09-01-preview",
      "name": "[concat(parameters('serviceName'), '/', parameters('mcpServerId'), '/', parameters('toolId'))]",
      "dependsOn": [
        "[resourceId('Microsoft.ApiManagement/service/apis', parameters('serviceName'), parameters('mcpServerId'))]"
      ],
      "properties": {
        "displayName": "[parameters('toolId')]",
        "description": "MCP tool backed by an API operation",
        "operationId": "[resourceId('Microsoft.ApiManagement/service/apis/operations', parameters('serviceName'), parameters('backingApiId'), parameters('backingOperationId'))]"
      }
    },
    {
      "type": "Microsoft.ApiManagement/service/apis/policies",
      "apiVersion": "2025-09-01-preview",
      "name": "[concat(parameters('serviceName'), '/', parameters('mcpServerId'), '/policy')]",
      "dependsOn": [
        "[resourceId('Microsoft.ApiManagement/service/apis', parameters('serviceName'), parameters('mcpServerId'))]"
      ],
      "properties": {
        "format": "rawxml",
        "value": "<policies>\n  <inbound>\n    <base />\n    <rate-limit calls=\"100\" renewal-period=\"60\" />\n  </inbound>\n  <backend>\n    <forward-request />\n  </backend>\n  <outbound>\n    <base />\n  </outbound>\n</policies>"
      }
    },
    {
      "type": "Microsoft.ApiManagement/service/products/apis",
      "apiVersion": "2025-09-01-preview",
      "name": "[concat(parameters('serviceName'), '/', parameters('productId'), '/', parameters('mcpServerId'))]",
      "dependsOn": [
        "[resourceId('Microsoft.ApiManagement/service/apis', parameters('serviceName'), parameters('mcpServerId'))]"
      ]
    }
  ]
}
```

---

To deploy:

```azurecli
# Use orders-mcp.json if you're deploying the ARM template.
az deployment group create \
  --resource-group <resource-group> \
  --template-file orders-mcp.bicep \
  --parameters serviceName=<api-management-name> \
               backingApiId=orders-api \
               backingOperationId=get-orders \
               toolId=getOrders
```

### Passthrough MCP server

These templates create a passthrough MCP server that uses the streamable HTTP transport. The server scope has a rate-limit policy, and the server binds to an existing product. The templates don't define any tool sub-resources. The external backend determines the tool surface.

> [!NOTE]
> The following templates use `transportType: streamable`, which implements the current MCP streamable HTTP specification. To use SSE transport instead, set `transportType` to `sse` and replace the `endpoints` array with two entries: `{ "name": "sse", "uriTemplate": "/sse" }` and `{ "name": "message", "uriTemplate": "/messages" }`. In Bicep, use the same values with single-quoted strings.

**Prerequisites:** an existing API Management service, a reachable MCP backend URL (`backendUrl`) that implements the selected transport and endpoint paths, and an existing product (`productId`).

| Parameter | Required | Default | Description |
|---|---|---|---|
| `serviceName` | Yes | — | Name of the existing API Management service instance. |
| `mcpServerId` | No | `external-mcp` | Resource name for the new MCP server. Must be unique within the service. |
| `backendUrl` | Yes | — | Absolute URL of the external MCP backend. |
| `productId` | No | `starter` | Resource name of the existing product to bind the server to. |

# [Bicep](#tab/bicep)

```bicep
@description('Name of the existing API Management service instance.')
param serviceName string

@description('Resource name for the new MCP server.')
param mcpServerId string = 'external-mcp'

@description('Absolute URL of the external MCP backend.')
param backendUrl string

@description('Resource name of the existing product to bind the MCP server to.')
param productId string = 'starter'

resource apimService 'Microsoft.ApiManagement/service@2025-09-01-preview' existing = {
  name: serviceName
}

resource mcpServer 'Microsoft.ApiManagement/service/apis@2025-09-01-preview' = {
  parent: apimService
  name: mcpServerId
  properties: {
    type: 'mcp'
    displayName: 'External MCP Server'
    description: 'Passthrough MCP server using streamable HTTP transport'
    path: mcpServerId
    protocols: [ 'https' ]
    serviceUrl: backendUrl
    subscriptionRequired: true
    mcpProperties: {
      transportType: 'streamable'
      endpoints: [
        {
          name: 'message'
          uriTemplate: '/mcp'
        }
      ]
    }
  }
}

resource mcpPolicy 'Microsoft.ApiManagement/service/apis/policies@2025-09-01-preview' = {
  parent: mcpServer
  name: 'policy'
  properties: {
    format: 'rawxml'
    value: '''<policies>
  <inbound>
    <base />
    <rate-limit calls="100" renewal-period="60" />
  </inbound>
  <backend>
    <forward-request />
  </backend>
  <outbound>
    <base />
  </outbound>
</policies>'''
  }
}

resource product 'Microsoft.ApiManagement/service/products@2025-09-01-preview' existing = {
  parent: apimService
  name: productId
}

resource productBinding 'Microsoft.ApiManagement/service/products/apis@2025-09-01-preview' = {
  parent: product
  name: mcpServerId
  dependsOn: [ mcpServer ]
}
```

# [ARM template](#tab/arm-template)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "serviceName": {
      "type": "string",
      "metadata": { "description": "Name of the existing API Management service instance." }
    },
    "mcpServerId": {
      "type": "string",
      "defaultValue": "external-mcp",
      "metadata": { "description": "Resource name for the new MCP server." }
    },
    "backendUrl": {
      "type": "string",
      "metadata": { "description": "Absolute URL of the external MCP backend." }
    },
    "productId": {
      "type": "string",
      "defaultValue": "starter",
      "metadata": { "description": "Resource name of the existing product to bind the server to." }
    }
  },
  "resources": [
    {
      "type": "Microsoft.ApiManagement/service/apis",
      "apiVersion": "2025-09-01-preview",
      "name": "[concat(parameters('serviceName'), '/', parameters('mcpServerId'))]",
      "properties": {
        "type": "mcp",
        "displayName": "External MCP Server",
        "description": "Passthrough MCP server using streamable HTTP transport",
        "path": "[parameters('mcpServerId')]",
        "protocols": [ "https" ],
        "serviceUrl": "[parameters('backendUrl')]",
        "subscriptionRequired": true,
        "mcpProperties": {
          "transportType": "streamable",
          "endpoints": [
            {
              "name": "message",
              "uriTemplate": "/mcp"
            }
          ]
        }
      }
    },
    {
      "type": "Microsoft.ApiManagement/service/apis/policies",
      "apiVersion": "2025-09-01-preview", 
      "name": "[concat(parameters('serviceName'), '/', parameters('mcpServerId'), '/policy')]",
      "dependsOn": [
        "[resourceId('Microsoft.ApiManagement/service/apis', parameters('serviceName'), parameters('mcpServerId'))]"
      ],
      "properties": {
        "format": "rawxml",
        "value": "<policies>\n  <inbound>\n    <base />\n    <rate-limit calls=\"100\" renewal-period=\"60\" />\n  </inbound>\n  <backend>\n    <forward-request />\n  </backend>\n  <outbound>\n    <base />\n  </outbound>\n</policies>"
      }
    },
    {
      "type": "Microsoft.ApiManagement/service/products/apis",
      "apiVersion": "2025-09-01-preview",
      "name": "[concat(parameters('serviceName'), '/', parameters('productId'), '/', parameters('mcpServerId'))]",
      "dependsOn": [
        "[resourceId('Microsoft.ApiManagement/service/apis', parameters('serviceName'), parameters('mcpServerId'))]"
      ]
    }
  ]
}
```

---

To deploy:

```azurecli
# Use external-mcp.json if you're deploying the ARM template.
az deployment group create \
  --resource-group <resource-group> \
  --template-file external-mcp.bicep \
  --parameters serviceName=<api-management-name> \
               backendUrl=https://mcp-backend.contoso.com
```



## Azure CLI

Currently, you can use `az rest` to call the REST API directly. The following script creates a passthrough MCP server, attaches a rate-limit policy, and binds it to a product. This process covers the same scenario as the Bicep template in the previous section.

Set variables, and then run the four `az rest` calls in order.

> [!NOTE]
> `az rest` uses the credential from your current `az login` session. You don't need a separate authentication step.

```azurecli
# Variables. Edit these for your environment
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
RESOURCE_GROUP="<your-resource-group>"
APIM_NAME="<your-apim-service-name>"
MCP_SERVER_ID="external-mcp"
BACKEND_URL="https://mcp-backend.contoso.com"
PRODUCT_ID="starter"
API_VERSION="2025-09-01-preview"

BASE="https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.ApiManagement/service/${APIM_NAME}"

# 1. Create the passthrough MCP server

az rest --method PUT \
  --uri "${BASE}/apis/${MCP_SERVER_ID}?api-version=${API_VERSION}" \
  --headers "If-Match=*" \
  --body '{
    "properties": {
      "type": "mcp",
      "displayName": "External MCP Server",
      "description": "Passthrough MCP server using streamable HTTP transport",
      "path": "external-mcp",
      "protocols": ["https"],
      "serviceUrl": "'"${BACKEND_URL}"'",
      "subscriptionRequired": true,
      "mcpProperties": {
        "transportType": "streamable",
        "endpoints": [
          { "name": "message", "uriTemplate": "/mcp" }
        ]
      }
    }
  }'

# 2. Attach a rate-limit policy at the server scope

az rest --method PUT \
  --uri "${BASE}/apis/${MCP_SERVER_ID}/policies/policy?api-version=${API_VERSION}" \
  --headers "If-Match=*" \
  --body '{
    "properties": {
      "format": "rawxml",
      "value": "<policies><inbound><base /><rate-limit calls=\"100\" renewal-period=\"60\" /></inbound><backend><forward-request /></backend><outbound><base /></outbound></policies>"
    }
  }'


# 3. Bind the server to a product

az rest --method PUT \
  --uri "${BASE}/products/${PRODUCT_ID}/apis/${MCP_SERVER_ID}?api-version=${API_VERSION}"
```

Each step is idempotent. Re-running the script updates the resource in place. To verify the server was created, run the following command:

```azurecli
az rest --method GET \
  --uri "${BASE}/apis/${MCP_SERVER_ID}?api-version=${API_VERSION}"
```

## Terraform

The AzureRM Terraform provider doesn't yet have native resources for MCP servers. Currently, you can use the [`azapi_resource`](https://registry.terraform.io/providers/Azure/azapi/latest/docs/resources/resource) resource type from the [AzAPI provider](https://registry.terraform.io/providers/Azure/azapi/latest), which lets you manage any Azure resource type against any API version. The following example mirrors the passthrough MCP server Bicep template.

**Prerequisites:** an existing API Management service, a reachable MCP backend URL, and an existing product. Add the AzAPI provider to your `terraform` block if it isn't already present.

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.0"
    }
    azapi = {
      source  = "Azure/azapi"
      version = ">= 1.13"
    }
  }
}

provider "azurerm" {
  features {}
}

provider "azapi" {}
```

### Variables

```hcl
variable "resource_group_name" {
  description = "Name of the resource group containing the API Management service."
  type        = string
}

variable "service_name" {
  description = "Name of the existing API Management service instance."
  type        = string
}

variable "mcp_server_id" {
  description = "Resource name for the new MCP server."
  type        = string
  default     = "external-mcp"
}

variable "backend_url" {
  description = "Absolute URL of the external MCP backend."
  type        = string
}

variable "product_id" {
  description = "Resource name of the existing product to bind the server to."
  type        = string
  default     = "starter"
}
```

### Resources

```hcl
# Reference the existing API Management service
data "azurerm_api_management" "apim" {
  name                = var.service_name
  resource_group_name = var.resource_group_name
}

# 1. Create the passthrough MCP server
resource "azapi_resource" "mcp_server" {
  type      = "Microsoft.ApiManagement/service/apis@2025-09-01-preview"
  name      = var.mcp_server_id
  parent_id = data.azurerm_api_management.apim.id

  body = {
    properties = {
      type                = "mcp"
      displayName         = "External MCP Server"
      description         = "Passthrough MCP server using streamable HTTP transport"
      path                = var.mcp_server_id
      protocols           = ["https"]
      serviceUrl          = var.backend_url
      subscriptionRequired = true
      mcpProperties = {
        transportType = "streamable"
        endpoints = [
          {
            name        = "message"
            uriTemplate = "/mcp"
          }
        ]
      }
    }
  }
}

# 2. Attach a rate-limit policy at the server scope
resource "azapi_resource" "mcp_policy" {
  type      = "Microsoft.ApiManagement/service/apis/policies@2025-09-01-preview"
  name      = "policy"
  parent_id = azapi_resource.mcp_server.id

  body = {
    properties = {
      format = "rawxml"
      value  = "<policies><inbound><base /><rate-limit calls=\"100\" renewal-period=\"60\" /></inbound><backend><forward-request /></backend><outbound><base /></outbound></policies>"
    }
  }

  depends_on = [azapi_resource.mcp_server]
}

# 3. Bind the server to a product
resource "azapi_resource" "product_binding" {
  type      = "Microsoft.ApiManagement/service/products/apis@2025-09-01-preview"
  name      = var.mcp_server_id
  parent_id = "${data.azurerm_api_management.apim.id}/products/${var.product_id}"

  body = {}

  depends_on = [azapi_resource.mcp_server]
}
```

To deploy:

> [!NOTE]
> `azapi_resource` uses the AzAPI provider's authentication, which reads from the same `az login` credential as the Azure CLI. You don't need to configure separate authentication when running locally.

```bash
terraform init
terraform apply \
  -var="resource_group_name=<resource-group>" \
  -var="service_name=<api-management-name>" \
  -var="backend_url=https://mcp-backend.contoso.com"
```

## CI/CD patterns 

- Idempotent upserts: Send PUT requests with `If-Match: "*"` so the same template applies whether or not the resource already exists. 

- Promote configurations across environments: Treat MCP server definitions and tool lists as source-controlled artifacts. Parameterize only environment-specific values, such as instance name and backend URL. 

- Generate the tool list from your API spec: Drive the tools sub-resource from your source OpenAPI file so the tool surface stays in sync with the backing API as it evolves. 

- Delete in the right order: Remove MCP tool references before deleting the backing APIs or operations they point to. Otherwise, the delete fails on a foreign-key check. 

## Related content 

- [About MCP servers in API Management](mcp-server-overview.md)
- API Management [REST API reference](/rest/api/apimanagement/)
- [Secure access to MCP servers](secure-mcp-servers.md)