---
title: Configure CORS in the Azure portal for Azure Container Apps
description: Learn how to configure your static web app to allow cross origin resource sharing (CORS) for Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 04/21/2023
ms.author: cshoe
zone_pivot_groups: container-apps-portal-or-cli
---

# Configure cross-origin resource sharing (CORS) for Azure Container Apps

By default, requests made through the browser to a domain that doesn't match the page's origin domain are blocked. To avoid this restriction for services deployed to Container Apps, you can enable [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS).

This article shows you how to enable and configure CORS in your container app.

As you enable CORS, you can configure the following settings:

::: zone pivot="azure-portal"

| Setting | Explanation |
|---|---|
| Allow credentials | Indicates whether to return the [`Access-Control-Allow-Credentials`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials) header. |
| Max age | Configures the [`Access-Control-Max-Age`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Max-Age) response header to indicate how long (in seconds) the results of a CORS pre-flight request can be cached. |
| Allowed origins | List of the origins allowed for cross-origin requests (for example, `https://www.contoso.com`). Controls the [`Access-Control-Allow-Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) response header. Use `*` to allow all. |
| Allowed methods | List of HTTP request methods allowed in cross-origin requests. Controls the [`Access-Control-Allow-Methods`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) response header. Use `*` to allow all. |
| Allowed headers | List of the headers allowed in cross-origin requests. Controls the [`Access-Control-Allow-Headers`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) response header. Use `*` to allow all. |
| Expose headers | By default, not all response headers are exposed to client-side JavaScript code in a cross-origin request. Exposed headers are extra headers servers can include in a response. Controls the [`Access-Control-Expose-Headers`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) response header. Use `*` to expose all. |

::: zone-end

::: zone pivot="azure-cli"

| Property | Explanation | Type |
|---|---|---|
| `allowCredentials` | Indicates whether to return the [`Access-Control-Allow-Credentials`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials) header. | boolean |
| `maxAge` | Configures the [`Access-Control-Max-Age`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Max-Age) response header to indicate how long (in seconds) the results of a CORS pre-flight request can be cached. | integer |
| `allowedOrigins` | List of the origins allowed for cross-origin requests (for example, `https://www.contoso.com`). Controls the [`Access-Control-Allow-Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) response header. Use `*` to allow all. | array of strings |
|  `allowedMethods` | List of HTTP request methods allowed in cross-origin requests. Controls the [`Access-Control-Allow-Methods`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) response header. Use `*` to allow all. | array of strings |
| `allowedHeaders` | List of the headers allowed in cross-origin requests. Controls the [`Access-Control-Allow-Headers`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) response header. Use `*` to allow all. | array of strings |
| `exposeHeaders` | By default, not all response headers are exposed to client-side JavaScript code in a cross-origin request. Exposed headers are extra headers servers can include in a response. Controls the [`Access-Control-Expose-Headers`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) response header. Use `*` to expose all. | array of strings |

::: zone-end

For more information, see the Web Hypertext Application Technology Working Group (WHATWG) reference on valid [HTTP responses from a fetch request](https://fetch.spec.whatwg.org/#http-responses).

## Enable and configure CORS

::: zone pivot="azure-portal"

1. Go to your container app in the Azure portal.

1. Under the settings menu, select *CORS*.

    :::image type="content" source="media/cors/azure-container-apps-enable-cors.png" alt-text="Screenshot showing how to enable CORS in the Azure portal.":::

With CORS enabled you can add, edit, and delete values for *Allowed Origins*, *Allowed Methods*, *Allowed Headers*, and *Expose Headers*.

To allow any acceptable values for methods, headers, or origins, enter `*` as the value.

::: zone-end

::: zone pivot="azure-cli"

> [!NOTE]
> Updates to configuration settings via the command line overwrites your current settings. Make sure to incorporate your current settings into any new CORS values you want to set to ensure your configuration remains consistent.

# [ARM template](#tab/arm)

The following code represents the form your CORS settings take  in an ARM template when configuring your container app.

```json
{ 
  ... 
  "properties": { 
      ... 
      "configuration": { 
         ... 
          "ingress": { 
              ... 
              "corsPolicy": { 
                "allowCredentials": true,
                "maxAge": 5000,
                "allowedOrigins": ["https://example.com"], 
                "allowedMethods": ["GET","POST"], 
                "allowedHeaders": [], 
                "exposeHeaders": []
              } 
          } 
      } 
  } 
}
```

# [YAML](#tab/yaml)

The following code represents the form your CORS settings take when configuring your container app.

```yaml
...
properties: 
  configuration: 
    ingress: 
    corsPolicy:
      allowCredentials: true
      maxAge: 5000
      allowedOrigins:
        - "https://example.com"
      allowedMethods:
        - "GET"
        - "POST"
      allowedHeaders: []
      exposeHeaders: []
```

After adding values specific to your configuration, you can use `az containerapp ingress cors update` to set the CORS configuration for your container app.

Before you run the following command, replace placeholders surrounded by `<>` with your values.

```azurecli
az containerapp ingress cors update --name <APP_NAME> --resource-group <RESOURCE_GROUP> –yaml <YAML_FILE_NAME>
```

---

::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Configure ingress](ingress.md)
