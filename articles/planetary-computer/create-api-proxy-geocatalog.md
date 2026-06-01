---
title: Create an API proxy for a GeoCatalog using Azure API Management
description: Learn how to use Azure API Management to create an API proxy for a Microsoft Planetary Computer Pro GeoCatalog to enable anonymous access and collection-level access control.
author: aloverro
ms.author: adamloverro
ms.service: planetary-computer-pro
ms.topic: how-to #Don't change
ms.date: 03/27/2026

#customer intent: As a GeoCatalog administrator, I want to create an API proxy for my GeoCatalog using Azure API Management so that I can enable anonymous access and restrict which collections are visible to external callers.
---

# Create an API proxy for a GeoCatalog using Azure API Management

This article guides you through setting up [Azure API Management](/azure/api-management/api-management-key-concepts) (APIM) as an API proxy in front of a Microsoft Planetary Computer Pro GeoCatalog. With this configuration you can:

- **Enable anonymous access**: callers don't need their own Microsoft Entra credentials. APIM authenticates to the GeoCatalog on their behalf using a managed identity.
- **Non-Entra Authentication**: callers can support non-Entra based authentication methods. APIM authenticates to GeoCatalog on their behalf using a managed identity.
- **Enforce collection-level access control**: restrict which Spatiotemporal Access Catalog (STAC) collections are visible through the proxy, even though GeoCatalogs don't natively support collection-level role-based access control (RBAC).

The following diagram illustrates the architecture before and after adding the APIM proxy:

**Before** Every caller authenticates directly to the GeoCatalog:

```
caller ──(Entra token)──► GeoCatalog
```

**After** APIM sits between callers and the GeoCatalog, handling authentication and access control:

```
caller ──(anonymous / APIM Subscription Keys)──► APIM ──(managed identity token)──► GeoCatalog
```

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An existing [GeoCatalog resource](./deploy-geocatalog-resource.md).
- An [Azure API Management instance](/azure/api-management/get-started-create-service-instance-cli).
- A [user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities) assigned to the APIM instance with a role assignment of **GeoCatalog Reader** over the GeoCatalog resource. See [Manage access](./manage-access.md) for role assignment instructions.


## Assign the managed identity to APIM

Before APIM can authenticate to your GeoCatalog, you need to associate the user-assigned managed identity with the APIM instance.

1. In the [Azure portal](https://portal.azure.com), navigate to your API Management instance.
1. Select **Identity** from the left sidebar.
1. Select the **User assigned** tab.
1. Select **Add**, then choose the user-assigned managed identity that has the **GeoCatalog Reader** role on your GeoCatalog.
1. Select **Add** to confirm.

## Create the API in APIM

Define a new API in APIM that proxies requests to your GeoCatalog backend.

1. In your APIM instance, select **APIs** from the left sidebar.
1. Select **+ Add API** > **HTTP**.
1. Configure the API with the following settings:

    | Setting | Value |
    |---------|-------|
    | **Display name** | A descriptive name (for example, `GeoCatalog API`) |
    | **Web service URL** | Your GeoCatalog endpoint (for example, `https://<name>.<id>.<region>.geocatalog.spatio.azure.com`) |
    | **URL scheme** | HTTPS |
    | **API URL suffix** | Leave empty (root path) |
    | **Subscription required** | **No**, for Anonymous access; **Yes**, for Subscription Key based access |

1. Select **Create**.

## Define API operations

Add the following operations to match the GeoCatalog API surface. The wildcard (`/*`) operations forward all matching requests to the backend. The explicit collection operations enable you to apply collection-specific policies later for access control.

| Display name | Method | URL template |
|-------------|--------|-------------|
| GET | GET | `/*` |
| Get collection items | GET | `/stac/collections/{collection_id}/items` |
| Get single collection | GET | `/stac/collections/{collection_id}` |
| Get collection sub-resources | GET | `/stac/collections/{collection_id}/*` |
| POST | POST | `/*` |

To add each operation:

1. Select the API you created.
1. Select **+ Add operation**.
1. Enter the **Display name**, **Method**, and **URL template** from the preceding table.
1. Select **Save**.

## Configure the API-level policy

The API-level policy handles authentication and URL rewriting for the entire API. This policy acquires a token from the user-assigned managed identity and attaches it to every request forwarded to the GeoCatalog backend.

1. Select the API you created, then select **All operations**.
1. In the **Inbound processing** section, select the **</>** (code editor) icon.
1. Replace the policy content with the following policy:

```xml
<policies>
    <inbound>
        <base />
        <authentication-managed-identity
            resource="https://geocatalog.spatio.azure.com"
            client-id="<managed-identity-client-id>" />
        <set-header name="Accept-Encoding"
            exists-action="delete" />
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
        <find-and-replace
            from="https://<name>.<id>.<region>.geocatalog.spatio.azure.com"
            to="https://<apim-name>.azure-api.net" />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
```

Replace the following placeholders:

| Placeholder | Value |
|-------------|-------|
| `<managed-identity-client-id>` | The client ID of the user-assigned managed identity assigned to APIM |
| `<name>.<id>.<region>` | Your GeoCatalog endpoint components |
| `<apim-name>` | The name of your APIM instance |

The following table describes each policy element:

| Policy element | Purpose |
|----------------|---------|
| `authentication-managed-identity` | Acquires a token for the `https://geocatalog.spatio.azure.com` audience using the specified managed identity and attaches it to the outgoing request. |
| `set-header` (delete `Accept-Encoding`) | Removes the `Accept-Encoding` header from inbound requests. See [Why strip Accept-Encoding](#why-strip-accept-encoding). |
| `find-and-replace` | Rewrites the GeoCatalog backend URL in response bodies to the APIM gateway URL. Without this rewrite, STAC links (`self`, `root`, `parent`, and so on) expose the backend URL to callers. |

### Why strip Accept-Encoding

Clients like Python `requests` and `httpx` send `Accept-Encoding: gzip, deflate` by default. When the backend receives this header, it returns a compressed response. APIM outbound policies such as `find-and-replace` operate on the raw response body and can't decompress it, so they silently do nothing. Stripping the header forces the backend to return an uncompressed response that outbound policies can process.

> [!NOTE]
> `curl` and `wget` don't send `Accept-Encoding` by default. This means outbound policies appear to work correctly when you test with those tools. The inconsistency only surfaces with clients that request compression.

## Enforce collection-level access control

By default, a GeoCatalog exposes all its collections to any authenticated caller. To restrict which collections are visible through APIM, apply operation-level policies that block broad STAC discovery and enforce an allow-list.

### Define the allowed collections

Create a named value in APIM to store the list of permitted collection IDs:

1. In your APIM instance, select **Named values** from the left sidebar.
1. Select **+ Add**.
1. Set the **Name** to `allowed-collections`.
1. Set the **Value** to a comma-separated list of permitted collection IDs (for example, `sentinel-2-l2a,landsat-8-c2-l2`).
1. Select **Save**.

### Block the landing page and collections list

Block the routes that reveal every collection in the catalog. Add the following operations and attach a policy that returns `404` immediately:

| Display name | Method | URL template |
|-------------|--------|-------------|
| Block root | GET | `/` |
| Block collections | GET | `/stac/collections` |

Apply the following operation-level policy to both operations:

```xml
<policies>
    <inbound>
        <base />
        <return-response>
            <set-status code="404" reason="Not Found" />
        </return-response>
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
```

### Enforce allowed collections on STAC search

The STAC `/stac/search` endpoint accepts a `collections` parameter - as a query string on GET or in the JSON body on POST. Without guardrails, a caller could search across every collection in the catalog. The following policies validate that only collections from the allowed set are requested.

Add two operations:

| Display name | Method | URL template |
|-------------|--------|-------------|
| GET search | GET | `/stac/search` |
| POST search | POST | `/stac/search` |

#### GET /stac/search policy

This policy validates the `collections` query parameter. Each comma-separated value must be in the allowed set. Requests without a `collections` parameter are rejected with `403 Forbidden`.

Apply the following policy to the **GET search** operation:

```xml
<policies>
    <inbound>
        <base />
        <set-variable name="allowedCsv"
            value="{{allowed-collections}}" />
        <choose>
            <when condition='@{
                var allowed = ((string)context
                    .Variables["allowedCsv"])
                    .Trim().ToLower();
                var raw = context.Request.Url.Query
                    .GetValueOrDefault("collections", "");
                if (string.IsNullOrWhiteSpace(raw)) {
                    return true;
                }
                foreach (var c in raw.ToLower().Split(
                    new [] { "," },
                    StringSplitOptions.RemoveEmptyEntries))
                {
                    if (!c.Trim().Equals(allowed)) {
                        return true;
                    }
                }
                return false;
            }'>
                <return-response>
                    <set-status code="403"
                        reason="Forbidden" />
                    <set-body>
                        Collection not allowed.
                    </set-body>
                </return-response>
            </when>
        </choose>
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
```

> [!NOTE]
> APIM policy expressions run in a restricted C# environment. Use `condition='@{...}'` (single-quoted attribute) so double-quotes work inside the expression. Avoid generic type parameters (for example, `GetValueOrDefault<string>`) and LINQ lambdas - use explicit casts and `foreach` loops instead.

#### POST /stac/search policy

This policy parses the JSON body and validates the `collections` array. Requests without a `collections` parameter are rejected with `403 Forbidden`.

Apply the following policy to the **POST search** operation:

```xml
<policies>
    <inbound>
        <base />
        <set-variable name="allowedCsv"
            value="{{allowed-collections}}" />
        <set-variable name="requestBody"
            value="@(context.Request.Body
                .As&lt;string&gt;(
                    preserveContent: true))" />
        <choose>
            <when condition='@{
                var allowed = ((string)context
                    .Variables["allowedCsv"])
                    .Trim().ToLower();
                var body = (string)context
                    .Variables["requestBody"];
                var json = Newtonsoft.Json.Linq
                    .JObject.Parse(body);
                var arr = json["collections"]
                    as Newtonsoft.Json.Linq.JArray;
                if (arr == null || arr.Count == 0) {
                    return true;
                }
                foreach (var token in arr) {
                    if (!token.ToString().Trim()
                        .ToLower().Equals(allowed))
                    {
                        return true;
                    }
                }
                return false;
            }'>
                <return-response>
                    <set-status code="403"
                        reason="Forbidden" />
                    <set-body>
                        Collection not allowed.
                    </set-body>
                </return-response>
            </when>
        </choose>
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
```

### Enforce allowed collections on collection endpoints

Without explicit operations, requests like `GET /stac/collections/sentinel-2-l2a` or `GET /stac/collections/sentinel-2-l2a/items` fall through to the `GET /*` wildcard and reach the backend without any collection-level check. Apply the path-parameter policy that validates `collection_id` against `{{allowed-collections}}` to the following operations you created in [Define API operations](#define-api-operations):

| Display name | Method | URL template |
|-------------|--------|-------------|
| Get single collection | GET | `/stac/collections/{collection_id}` |
| Get collection sub-resources | GET | `/stac/collections/{collection_id}/*` |
| Get collection items | GET | `/stac/collections/{collection_id}/items` |

Apply the following policy to all three operations:

```xml
<policies>
    <inbound>
        <base />
        <set-variable name="allowedCsv"
            value="{{allowed-collections}}" />
        <choose>
            <when condition='@{
                var allowed = ((string)context
                    .Variables["allowedCsv"])
                    .Trim().ToLower();
                var collectionId = (string)context
                    .Request.MatchedParameters[
                        "collection_id"];
                return !collectionId.Trim()
                    .ToLower().Equals(allowed);
            }'>
                <return-response>
                    <set-status code="403"
                        reason="Forbidden" />
                    <set-body>
                        Collection not allowed.
                    </set-body>
                </return-response>
            </when>
        </choose>
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
```

### Enforce allowed collections on SAS token routes

The GeoCatalog SAS API lets callers generate storage tokens and sign asset HREFs. Without restrictions, a caller could obtain tokens for any collection. The following policies ensure that only allowed collections can be accessed.

Add the following operations:

| Display name | Method | URL template |
|-------------|--------|-------------|
| GET SAS token | GET | `/sas/token/{collection_id}` |
| Block SAS sign | GET | `/sas/sign` |

Apply the `404` blocking policy (same as the [root and collections block](#block-the-landing-page-and-collections-list)) to the **Block SAS sign** operation. Callers should use `/sas/token/{collection_id}` to obtain collection-level SAS tokens instead.

Apply the following policy to the **GET SAS token** operation:

```xml
<policies>
    <inbound>
        <base />
        <set-variable name="allowedCsv"
            value="{{allowed-collections}}" />
        <choose>
            <when condition='@{
                var allowed = ((string)context
                    .Variables["allowedCsv"])
                    .Trim().ToLower();
                var collectionId = (string)context
                    .Request.MatchedParameters[
                        "collection_id"];
                return !collectionId.Trim()
                    .ToLower().Equals(allowed);
            }'>
                <return-response>
                    <set-status code="403"
                        reason="Forbidden" />
                    <set-body>
                        Collection not allowed.
                    </set-body>
                </return-response>
            </when>
        </choose>
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
```

### Enforce allowed collections on data routes

The `/data/mosaic/` endpoints provide tile rendering, bounding-box crops, and search registration. Two policy groups are needed:

1. **Register search** - validate the `collections` array in the JSON body.
2. **All other collection routes** - validate the `collectionId` path parameter.

Add the following operations:

| Display name | Method | URL template |
|-------------|--------|-------------|
| POST register search | POST | `/data/mosaic/register` |
| GET data collection | GET | `/data/mosaic/collections/{collectionId}/*` |

#### POST /data/mosaic/register policy

This policy validates the `collections` array in the JSON body against the allowed set. Requests without a `collections` parameter are rejected.

```xml
<policies>
    <inbound>
        <base />
        <set-variable name="allowedCsv"
            value="{{allowed-collections}}" />
        <set-variable name="requestBody"
            value="@(context.Request.Body
                .As&lt;string&gt;(
                    preserveContent: true))" />
        <choose>
            <when condition='@{
                var allowed = ((string)context
                    .Variables["allowedCsv"])
                    .Trim().ToLower();
                var body = (string)context
                    .Variables["requestBody"];
                var json = Newtonsoft.Json.Linq
                    .JObject.Parse(body);
                var arr = json["collections"]
                    as Newtonsoft.Json.Linq.JArray;
                if (arr == null || arr.Count == 0) {
                    return true;
                }
                foreach (var token in arr) {
                    if (!token.ToString().Trim()
                        .ToLower().Equals(allowed))
                    {
                        return true;
                    }
                }
                return false;
            }'>
                <return-response>
                    <set-status code="403"
                        reason="Forbidden" />
                    <set-body>
                        Collection not allowed.
                    </set-body>
                </return-response>
            </when>
        </choose>
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
```

#### GET /data/mosaic/collections/{collectionId}/* policy

This policy validates the `collectionId` path parameter against the allowed set. Apply this policy to both the **GET data collection** operations.

```xml
<policies>
    <inbound>
        <base />
        <set-variable name="allowedCsv"
            value="{{allowed-collections}}" />
        <choose>
            <when condition='@{
                var allowed = ((string)context
                    .Variables["allowedCsv"])
                    .Trim().ToLower();
                var collectionId = (string)context
                    .Request.MatchedParameters[
                        "collectionId"];
                return !collectionId.Trim()
                    .ToLower().Equals(allowed);
            }'>
                <return-response>
                    <set-status code="403"
                        reason="Forbidden" />
                    <set-body>
                        Collection not allowed.
                    </set-body>
                </return-response>
            </when>
        </choose>
    </inbound>
    <backend>
        <base />
    </backend>
    <outbound>
        <base />
    </outbound>
    <on-error>
        <base />
    </on-error>
</policies>
```

## Frequently asked questions

### How do I update the allowed collections list?

Edit the `allowed-collections` named value in the APIM instance. No policy changes are needed.

### What happens if a caller omits the collections parameter?

The request is rejected with `403 Forbidden`. Callers must always specify which collections they want to search.

## Related content

- [Azure API Management documentation](/azure/api-management/)
- [API Management policies reference](/azure/api-management/api-management-policies)
- [Manage access for Microsoft Planetary Computer Pro](./manage-access.md)
- [Configure application authentication for Microsoft Planetary Computer Pro](./application-authentication.md)
- [Assign a user-assigned managed identity to a GeoCatalog](./assign-managed-identity-geocatalog-resource.md)
