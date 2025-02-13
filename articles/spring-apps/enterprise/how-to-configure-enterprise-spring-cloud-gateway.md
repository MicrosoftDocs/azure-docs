---
title: Configure VMware Spring Cloud Gateway
description: Learn how to configure VMware Spring Cloud Gateway with the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: xiading
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 12/01/2023
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
---

# Configure VMware Spring Cloud Gateway

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

This article shows you how to configure VMware Spring Cloud Gateway for VMware Tanzu with the Azure Spring Apps Enterprise plan.

[VMware Spring Cloud Gateway](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/index.html) is a commercial VMware Tanzu component based on the open-source Spring Cloud Gateway project. VMware Spring Cloud Gateway for Tanzu handles the cross-cutting concerns for API development teams, such as single sign-on (SSO), access control, rate limiting, resiliency, and security. You can accelerate API delivery by using modern cloud-native patterns in your choice of programming language for API development.

A VMware Spring Cloud Gateway instance routes traffic according to rules. It supports scaling *in/out* and *up/down* to meet a dynamic traffic load.

VMware Spring Cloud Gateway includes the following features:

- Dynamic routing configuration, independent of individual applications, that you can apply and change without recompiling
- Commercial API route filters for transporting authorized JSON Web Token (JWT) claims to application services
- Client certificate authorization
- Rate-limiting approaches
- Circuit breaker configuration
- Support for accessing application services via HTTP Basic Authentication credentials

To integrate with API portal for VMware Tanzu, VMware Spring Cloud Gateway automatically generates OpenAPI version 3 documentation after any additions or changes to route configuration. For more information, see [Use API portal for VMware Tanzu](./how-to-use-enterprise-api-portal.md).

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan service instance with VMware Spring Cloud Gateway enabled. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.0.67 or later. Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`.

## Enable or disable VMware Spring Cloud Gateway

You can enable or disable VMware Spring Cloud Gateway after creation of the service instance by using the Azure portal or the Azure CLI. Before you disable VMware Spring Cloud Gateway, you must unassign its endpoint and remove all route configurations.

### [Azure portal](#tab/Azure-portal)

Use the following steps to enable or disable VMware Spring Cloud Gateway by using the Azure portal:

1. Go to your service resource, and then select **Spring Cloud Gateway**.
1. Select **Manage**.
1. Select or clear the **Enable Spring Cloud Gateway** checkbox, and then select **Save**.

You can now view the state of the Spring Cloud Gateway on the **Spring Cloud Gateway** page.

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-manage-restart.png" alt-text="Screenshot of the Azure portal that shows the Spring Cloud Gateway page." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-manage-restart.png":::

### [Azure CLI](#tab/Azure-CLI)

Use the following Azure CLI commands to enable or disable VMware Spring Cloud Gateway:

```azurecli
az spring gateway create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name>
```

```azurecli
az spring gateway delete \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name>
```

---

## Restart VMware Spring Cloud Gateway

After you complete the restart action, VMware Spring Cloud Gateway instances are restarted on a rolling basis.

### [Azure portal](#tab/Azure-portal)

Use the following steps to restart VMware Spring Cloud Gateway by using the Azure portal:

1. Go to your service resource, and then select **Spring Cloud Gateway**.
1. Select **Restart**.
1. Select **OK** to confirm the restart.

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-restart.png" alt-text="Screenshot of the Azure portal that shows the Spring Cloud Gateway page with the confirmation message about restarting the gateway." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-restart.png":::

### [Azure CLI](#tab/Azure-CLI)

Use the following Azure CLI command to restart the gateway:

```azurecli
az spring gateway restart \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name>
```

---

## Assign a public endpoint to VMware Spring Cloud Gateway

This section describes how to assign a public endpoint to VMware Spring Cloud Gateway and configure its properties.

#### [Azure portal](#tab/Azure-portal)

To assign an endpoint in the Azure portal, use the following steps:

1. Open your Azure Spring Apps instance.
1. Select **Spring Cloud Gateway** on the navigation pane, and then select **Overview**.
1. Set **Assign endpoint** to **Yes**.

After a few minutes, **URL** shows the configured endpoint URL. Save the URL to use later.

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-overview.png" alt-text="Screenshot of the Azure portal that shows the Spring Cloud Gateway overview page with the toggle for assigning an endpoint." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-overview.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to assign the endpoint:

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --assign-endpoint true
```

---

## Configure VMware Spring Cloud Gateway metadata

VMware Spring Cloud Gateway metadata automatically generates OpenAPI version 3 documentation. You can configure VMware Spring Cloud Gateway metadata to display route groups in API portal for VMware Tanzu. For more information, see [Use API portal for VMware Tanzu](./how-to-use-enterprise-api-portal.md).

The following table describes the available metadata options:

| Property        | Description                                                                                                                                                                                                                                                                                  |
|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`         | A title that describes the context of the APIs available on the VMware Spring Cloud Gateway instance. The default value is `Spring Cloud Gateway for K8S`.                                                                                                                                   |
| `description`   | A detailed description of the APIs available on the VMware Spring Cloud Gateway instance. The default value is `Generated OpenAPI 3 document that describes the API routes configured for '[Gateway instance name]' Spring Cloud Gateway instance deployed under '[namespace]' namespace.*.` |
| `documentation` | The location of API documentation that's available on the VMware Spring Cloud Gateway instance.                                                                                                                                                                                              |
| `version`       | The version of APIs available on this VMware Spring Cloud Gateway instance. The default value is `unspecified`.                                                                                                                                                                              |
| `serverUrl`     | The base URL to access APIs on the VMware Spring Cloud Gateway instance. This property is mandatory if you want to integrate with the [API portal](./how-to-use-enterprise-api-portal.md).                                                                                                   |

You can use the Azure portal or the Azure CLI to edit metadata properties.

#### [Azure portal](#tab/Azure-portal)

To edit metadata in the Azure portal, use the following steps:

1. Open your Azure Spring Apps instance.
1. Select **Spring Cloud Gateway** on the navigation pane, and then select **Configuration**.
1. Specify values for the properties listed for **API**.
1. Select **Save**.

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-configuration.png" alt-text="Screenshot of the Azure portal that shows the Spring Cloud Gateway configuration tab with the API section highlighted." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-configuration.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to configure metadata properties for VMware Spring Cloud Gateway. You need the endpoint URL that you obtained when you completed the [Assign a public endpoint to VMware Spring Cloud Gateway](#assign-a-public-endpoint-to-vmware-spring-cloud-gateway) section.

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --api-description "<api-description>" \
    --api-title "<api-title>" \
    --api-version "v0.1" \
    --server-url "<gateway-endpoint-URL>" \
    --allowed-origins "*"
```

---

## Configure single sign-on

VMware Spring Cloud Gateway supports authentication and authorization through single sign-on (SSO) with an OpenID identity provider. The provider supports the OpenID Connect Discovery protocol. The following table describes the SSO properties:

| Property       | Required? | Description                                                                                                                                                                                                                                                                                  |
|----------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `issuerUri`    | Yes       | The URI that is asserted as its issuer identifier. For example, if `issuerUri` is `https://example.com`, an OpenID Provider Configuration Request is made to `https://example.com/.well-known/openid-configuration`. The result is expected to be an OpenID Provider Configuration Response. |
| `clientId`     | Yes       | The OpenID Connect client ID from your identity provider.                                                                                                                                                                                                                                    |
| `clientSecret` | Yes       | The OpenID Connect client secret from your identity provider.                                                                                                                                                                                                                                |
| `scope`        | Yes       | A list of scopes to include in JWT identity tokens. This list should be based on the scopes that your identity provider allows.                                                                                                                                                              |

To set up SSO with Microsoft Entra ID, see [Set up single sign-on using Microsoft Entra ID for Spring Cloud Gateway and API Portal](./how-to-set-up-sso-with-azure-ad.md).

You can use the Azure portal or the Azure CLI to edit SSO properties.

#### [Azure portal](#tab/Azure-portal)

To edit SSO properties in the Azure portal, use the following steps:

1. Open your Azure Spring Apps instance.
1. Select **Spring Cloud Gateway** on the navigation pane, and then select **Configuration**.
1. Specify values for the properties listed for **SSO**.
1. Select **Save**.

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-sso-configuration.png" alt-text="Screenshot of the Azure portal that shows the Spring Cloud Gateway configuration tab with the section for single sign-on highlighted." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-sso-configuration.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to configure SSO properties for VMware Spring Cloud Gateway:

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --client-id <client-id> \
    --client-secret <client-secret> \
    --issuer-uri <issuer-uri> \
    --scope <scope>
```

---

VMware Spring Cloud Gateway supports only the authorization servers that support the OpenID Connect Discovery protocol. Also, be sure to configure the external authorization server to allow redirects back to the gateway. Refer to your authorization server's documentation and add `https://<gateway-external-url>/login/oauth2/code/sso` to the list of allowed redirect URIs.

If you configure the wrong SSO property, such as the wrong password, you should remove the entire SSO property and then add the correct configuration.

After you configure SSO, remember to set `ssoEnabled: true` for the VMware Spring Cloud Gateway routes.

## Configure SSO logout

VMware Spring Cloud Gateway service instances provide a default API endpoint to log out of the current SSO session. The path to this endpoint is `/scg-logout`. The logout results in one of the following outcomes, depending on how you call the logout endpoint:

- Log out of the session and redirect to the identity provider (IdP) logout.
- Log out of the service instance session.

### Log out of the IdP and SSO session

If you send a `GET` request to the `/scg-logout` endpoint, the endpoint sends a `302` redirect response to the IdP logout URL. To get the endpoint to return the user to a path on the gateway service instance, add a redirect parameter to the `GET` request with the `/scg-logout` endpoint. For example, you can use `${server-url}/scg-logout?redirect=/home`.

The value of the redirect parameter must be a valid path on the VMware Spring Cloud Gateway service instance. You can't redirect to an external URL.

The following steps describe an example of how to implement the function in your microservices:

1. Get a route configuration to route the logout request to your application. For an example, see the route configuration in the [animal-rescue](https://github.com/Azure-Samples/animal-rescue/blob/0e343a27f44cc4a4bfbf699280476b0517854d7b/frontend/azure/api-route-config.json#L32) repository on GitHub.

1. Add whatever logout logic you need to the application. At the end, you need a `GET` request to the gateway's `/scg-logout` endpoint, as shown in the `return` value for the `getActionButton` method in the [animal-rescue](https://github.com/Azure-Samples/animal-rescue/blob/0e343a27f44cc4a4bfbf699280476b0517854d7b/frontend/src/App.js#L84) repository.

### Log out of just the SSO session

If you send the `GET` request to the `/scg-logout` endpoint by using `XMLHttpRequest`, the `302` redirect could be swallowed and not handled in the response handler. In this case, the user would only be logged out of the SSO session on the VMware Spring Cloud Gateway service instance. The user would still have a valid IdP session. Typically, if the user tries to log in again, they're automatically sent back to the gateway as authenticated from IdP.

You need to have a route configuration to route the logout request to your application, as shown in the following example. This code makes a gateway-only logout SSO session.

```javascript
const req = new XMLHttpRequest();
req.open("GET", "/scg-logout);
req.send();
```

## Configure cross-origin resource sharing

Cross-origin resource sharing (CORS) allows restricted resources on a webpage to be requested from another domain outside the domain from which the first resource was served. The following table describes the available CORS configuration options.

| Property                | Description                                                               |
|-------------------------|---------------------------------------------------------------------------|
| `allowedOrigins`        | Allowed origins to make cross-site requests                               |
| `allowedOriginPatterns` | Allowed origin patterns to make cross-site requests                       |
| `allowedMethods`        | Allowed HTTP methods on cross-site requests                               |
| `allowedHeaders`        | Allowed headers in cross-site requests                                    |
| `maxAge`                | How long, in seconds, clients cache the response from a preflight request |
| `allowCredentials`      | Whether user credentials are supported on cross-site requests             |
| `exposedHeaders`        | HTTP response headers to expose for cross-site requests                   |

Be sure that you have the correct CORS configuration if you want to integrate with the API portal. For more information, see the [Assign a public endpoint to VMware Spring Cloud Gateway](#assign-a-public-endpoint-to-vmware-spring-cloud-gateway) section.

## Use service scaling

You can customize resource allocation for VMware Spring Cloud Gateway instances, including vCPU, memory, and instance count.

For high availability, we don't recommend using a single replica.

The following table describes the default resource usage.

| Component name                               | Instance count | vCPU per instance | Memory per instance |
|----------------------------------------------|----------------|-------------------|---------------------|
| VMware Spring Cloud Gateway                  | 2              | 1 core            | 2 GiB               |
| VMware Spring Cloud Gateway operator         | 2              | 1 core            | 2 GiB               |

## Configure TLS between the gateway and applications

To enhance security and help protect sensitive information from interception by unauthorized parties, you can enable Transport Layer Security (TLS) between VMware Spring Cloud Gateway and your applications.

Before you configure TLS, you need to have a TLS-enabled application and a TLS certificate. To prepare a TLS certificate, generate a certificate from a trusted certificate authority (CA). The certificate verifies the identity of the server and establishes a secure connection.

After you have a TLS-enabled application running in Azure Spring Apps, upload the certificate to Azure Spring Apps. For more information, see the [Import a certificate](../basic-standard/how-to-use-tls-certificate.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json#import-a-certificate) section of [Use TLS/SSL certificates in your application in Azure Spring Apps](../basic-standard/how-to-use-tls-certificate.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

With the certificate updated to Azure Spring Apps, you can configure the TLS certificate for the gateway and enable certificate verification. You can configure the certificate in the Azure portal or by using the Azure CLI.

#### [Azure portal](#tab/Azure-portal)

Use the following steps to configure the certificate in the Azure portal:

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** on the navigation pane.
1. On the **Spring Cloud Gateway** page, select **Certificate management**.
1. Select **Enable cert verification**.
1. Select the TLS certificate in **Certificates**.
1. Select **Save**.

Updating the configuration can take a few minutes. You should get a notification when the configuration is complete.

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to enable or disable certificate verification by using the Azure CLI. Replace the `<value>` placeholder with `true` to enable or `false` to disable verification.

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --enable-cert-verify <value> \
    --certificate-names <certificate-name-in-Azure-Spring-Apps>
```

---

### Prepare the route configuration

You must specify the protocol as HTTPS in the route configuration. The following JSON object instructs VMware Spring Cloud Gateway to use the HTTPS protocol for all traffic between the gateway and the app.

1. Create a file named **test-tls-route.json** with the following content:

   ```json
   {
       "routes": [
         {
           "title": "Test TLS app",
           "predicates": [
             "Path=/path/to/your/app",
             "Method=GET"
           ]
         }
        ],
       "uri": "https://<app-custom-domain-name>"
   }
   ```

1. Use the following command to apply the rule to the application:

   ```azurecli
   az spring gateway route-config create \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --name test-tls-app \
       --routes-file test-tls-route.json
   ```

You can now test whether the application is TLS enabled with the endpoint of the gateway. For more information, see the [Configure routes](how-to-use-enterprise-spring-cloud-gateway.md#configure-routes) section of [Use Spring Cloud Gateway](how-to-use-enterprise-spring-cloud-gateway.md).

### Rotate certificates

As certificates expire, you need to rotate certificates in VMware Spring Cloud Gateway by using the following steps:

1. Generate new certificates from a trusted CA.
1. Import the certificates into Azure Spring Apps. For more information, see the [Import a certificate](../basic-standard/how-to-use-tls-certificate.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json#import-a-certificate) section of [Use TLS/SSL certificates in your application in Azure Spring Apps](../basic-standard/how-to-use-tls-certificate.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).
1. Synchronize the certificates by using the Azure portal or the Azure CLI.

VMware Spring Cloud Gateway restarts to ensure that the gateway uses the new certificate for all connections.

#### [Azure portal](#tab/Azure-portal)

Use the following steps to synchronize certificates:

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** on the navigation pane.
1. On the **Spring Cloud Gateway** page, select **Restart**, and then confirm the operation.

#### [Azure CLI](#tab/Azure-CLI) 

Use the following restart command to synchronize a certificate for VMware Spring Cloud Gateway:

```azurecli
az spring gateway restart \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name>
```

---

### Set up autoscale settings

You can set autoscale modes for VMware Spring Cloud Gateway.

#### [Azure portal](#tab/Azure-portal)

The following list shows the options available for Autoscale demand management:

* The **Manual scale** option maintains a fixed instance count. You can scale out to a maximum of 10 instances. This value changes the number of separate running instances of the Spring Cloud Gateway.
* The **Custom autoscale** option scales on any schedule, based on any metrics.

On the Azure portal, choose how you want to scale. The following screenshot shows the **Custom autoscale** option and mode settings:

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/custom-autoscale.png" alt-text="Screenshot of the Azure portal that shows the Autoscale setting page with the Custom autoscale option highlighted." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/custom-autoscale.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to create an autoscale setting:

```azurecli
az monitor autoscale create \
    --resource-group <resource-group-name> \
    --name <autoscale-setting-name> \
    --resource /subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.AppPlatform/Spring/<service-instance-name>/gateways/default \
    --min-count 1 \
    --max-count 5 \
    --count 1
```

Use the following command to create an autoscale rule:

```azurecli
az monitor autoscale rule create \
    --resource-group <resource-group-name> \
    --autoscale-name <autoscale-setting-name> \
    --scale out 1 \
    --cooldown 1 \
    --condition "GatewayHttpServerRequestsSecondsCount > 100 avg 1m"
```

---

For more information on the available metrics, see the [User metrics options](../basic-standard/concept-metrics.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json#user-metrics-options) section of [Metrics for Azure Spring Apps](../basic-standard/concept-metrics.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

## Configure the response cache

Response cache configuration provides a way to define an HTTP response cache that you can apply globally or at the route level.

### Enable the response cache globally

After you enable the response cache globally, the response cache is automatically enabled for all applicable routes.

#### [Azure portal](#tab/Azure-portal)

Use the following steps to enable the response cache globally:

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** on the navigation pane.
1. On the **Spring Cloud Gateway** page, select **Configuration**.
1. In the **Response Cache** section, select **Enable response cache** and then set **Scope** to **Instance**.
1. Set **Size** and **Time to live** for the response cache.
1. Select **Save**.

Use the following steps to disable the response cache:

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** on the navigation pane.
1. On the **Spring Cloud Gateway** page, select **Configuration**.
1. In the **Response Cache** section, clear **Enable response cache**.
1. Select **Save**.

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to enable the response cache globally:

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name>
    --enable-response-cache \
    --response-cache-scope Instance \
    --response-cache-size {Examples are 1GB, 100MB, 100KB} \
    --response-cache-ttl {Examples are 1h, 30m, 50s}
```

Use the following command to disable the response cache:

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --enable-response-cache false
```

---

### Enable the response cache at the route level

To enable the response cache for any route, use the `LocalResponseCache` filter. The following example shows you how to use the `LocalResponseCache` filter in the routing rule configuration:

```json
{
   "filters": [
      "<other-app-level-filter-of-route>",
   ],
   "routes": [
      {
        "predicates": [
            "Path=/api/**",
            "Method=GET"
         ],
         "filters": [
            "<other-filter-of-route>",
            "LocalResponseCache=3m, 1MB"
         ],
      }
   ]
}
```

For more information, see the [LocalResponseCache](./how-to-configure-enterprise-spring-cloud-gateway-filters.md#localresponsecache) section of [How to use VMware Spring Cloud Gateway route filters with the Azure Spring Apps Enterprise plan](./how-to-configure-enterprise-spring-cloud-gateway-filters.md) and [LocalResponseCache](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/2.2/scg-k8s/GUID-guides-filters-traffic-control.html#localresponsecache) in the VMware documentation.

Instead of configuring `size` and `timeToLive` for each `LocalResponseCache` filter individually, you can set these parameters at the Spring Cloud Gateway level. This option enables you to use the `LocalResponseCache` filter without specifying these values initially, while retaining the flexibility to override them later.

#### [Azure portal](#tab/Azure-portal)

Use the following steps to enable the response cache at the route level and set `size` and `timeToLive`:

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** on the navigation pane.
1. On the **Spring Cloud Gateway** page, select **Configuration**.
1. In the **Response Cache** section, select **Enable response cache** and then set **Scope** to **Route**.
1. Set **Size** and **Time to live** for the response cache.
1. Select **Save**.

Use the following steps to disable the response cache at the route level, which clears `size` and `timeToLive`:

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** on the navigation pane.
1. On the **Spring Cloud Gateway** page, select **Configuration**.
1. In the **Response Cache** section, clear **Enable response cache**.
1. Select **Save**.

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to enable the response cache at the route level and set `size` and `timeToLive`:

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --enable-response-cache \
    --response-cache-scope Route \
    --response-cache-size {Examples are 1GB, 100MB, 100KB} \
    --response-cache-ttl {Examples are 1h, 30m, 50s}
```

Use the following command to disable the response cache at the route level, which clears `size` and `timeToLive`:

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --enable-response-cache false
```

---

The following example shows you how to use the `LocalResponseCache` filter when `size` and `timeToLive` are set at the Spring Cloud Gateway level:

```json
{
   "filters": [
      "<other-app-level-filter-of-route>",
   ],
   "routes": [
      {
        "predicates": [
            "Path=/api/path1/**",
            "Method=GET"
         ],
         "filters": [
            "<other-filter-of-route>",
            "LocalResponseCache"
         ],
      },
      {
        "predicates": [
            "Path=/api/path2/**",
            "Method=GET"
         ],
         "filters": [
            "<other-filter-of-route>",
            "LocalResponseCache=3m, 1MB"
         ],
      }
   ]
}
```

## Configure environment variables

The Azure Spring Apps service manages and tunes VMware Spring Cloud Gateway. Except for the use cases that configure application performance monitoring (APM) and the log level, you don't normally need to configure VMware Spring Cloud Gateway with environment variables.

If you have requirements that you can't fulfill by other configurations described in this article, you can try to configure the environment variables shown in the [Common application properties](https://cloud.spring.io/spring-cloud-gateway/reference/html/appendix.html#common-application-properties) list. Be sure to verify your configuration in your test environment before applying it to your production environment.

#### [Azure portal](#tab/Azure-portal)

To configure environment variables in the Azure portal, use the following steps:

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** on the navigation pane, and then select **Configuration**.
1. Fill in the key/value pairs for the environment variables in the **Properties** and **Secrets** sections. You can include variables with sensitive information in the **Secrets** section.
1. Select **Save** to save your changes.

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to configure environment variables by using the Azure CLI. You can include variables with sensitive information by using the `--secrets` parameter.

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --properties <key=value> \
    --secrets <key=value>
```

---

After you update environment variables, VMware Spring Cloud Gateway restarts.

### Configure application performance monitoring

To monitor VMware Spring Cloud Gateway, you can configure APM. The following table lists the five types of APM Java agents that VMware Spring Cloud Gateway provides, along with their required environment variables.

| Java agent           | Required environment variables                                                                                                                                                                                                                                                                       |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Application Insights | `APPLICATIONINSIGHTS_CONNECTION_STRING`                                                                                                                                                                                                                                                              |
| Dynatrace            | `DT_TENANT`<br>`DT_TENANTTOKEN`<br>`DT_CONNECTION_POINT`                                                                                                                                                                                                                                             |
| New Relic            | `NEW_RELIC_LICENSE_KEY`<br>`NEW_RELIC_APP_NAME`                                                                                                                                                                                                                                                      |
| AppDynamics          | `APPDYNAMICS_AGENT_APPLICATION_NAME`<br>`APPDYNAMICS_AGENT_TIER_NAME`<br>`APPDYNAMICS_AGENT_NODE_NAME`<br> `APPDYNAMICS_AGENT_ACCOUNT_NAME`<br>`APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY`<br>`APPDYNAMICS_CONTROLLER_HOST_NAME`<br>`APPDYNAMICS_CONTROLLER_SSL_ENABLED`<br>`APPDYNAMICS_CONTROLLER_PORT` |
| Elastic APM          | `ELASTIC_APM_SERVICE_NAME`<br>`ELASTIC_APM_APPLICATION_PACKAGES`<br>`ELASTIC_APM_SERVER_URL`                                                                                                                                                                                                         |

For other supported environment variables, see the following sources:

- [Application Insights overview](/azure/azure-monitor/app/app-insights-overview?tabs=net)
- [Dynatrace environment variables](https://www.dynatrace.com/support/help/setup-and-configuration/setup-on-cloud-platforms/microsoft-azure-services/azure-integrations/azure-spring#envvar)
- [New Relic environment variables](https://docs.newrelic.com/docs/apm/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables)
- [AppDynamics environment variables](https://docs.appdynamics.com/appd/24.x/24.3/en/application-monitoring/install-app-server-agents/java-agent/monitor-azure-spring-cloud-with-java-agent#id-.MonitorAzureSpringCloudwithJavaAgentv24.3-ConfigureUsingtheEnvironmentVariablesorSystemProperties)
- [Elastic environment variables](https://www.elastic.co/guide/en/apm/agent/java/master/configuration.html)

#### Configure APM integration on the service instance level (recommended)

To enable APM monitoring in your VMware Spring Cloud Gateway, you can create APM configuration on the service instance level and bind it to Spring Cloud Gateway. In this way, you can conveniently configure the APM only once and bind the same APM to Spring Cloud Gateway and to your apps.

##### [Azure portal](#tab/Azure-portal)

Use the following steps to set up APM by using the Azure portal:

1. Configure APM on the service instance level with the APM name, type, and properties. For more information, see the [Manage APMs on the service instance level (recommended)](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md#manage-apms-on-the-service-instance-level-recommended) section of [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md).

   :::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/service-level-apm-configure.png" alt-text="Screenshot of Azure portal that shows the Azure Spring Apps APM editor page." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/service-level-apm-configure.png":::

1. Select **Spring Cloud Gateway** on the navigation pane, then select **APM**.

1. Choose the APM name in the **APM reference names** list. The list includes all the APM names configured in step 1.

1. Select **Save** to bind APM reference names to Spring Cloud Gateway. Your gateway restarts to enable APM monitoring.

##### [Azure CLI](#tab/Azure-CLI)

Use the following steps to set up APM in Spring Cloud Gateway by using the Azure CLI:

1. Configure APM on the service instance level with the APM name, type, and properties. For more information, see the [Manage APMs on the service instance level (recommended)](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md#manage-apms-on-the-service-instance-level-recommended) section of [How to configure APM integration and CA certificates](./how-to-enterprise-configure-apm-integration-and-ca-certificates.md).

1. Use the following command to update gateway with APM reference names:

   ```azurecli
   az spring gateway update \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --apms <APM-reference-name>
   ```

   The value for `--apms` is a space-separated list of APM reference names, which you created in step 1.

   > [!NOTE]
   > Spring Cloud Gateway is deprecating APM types. Use APM reference names to configure APM in a gateway.

---

#### Manage APM in VMware Spring Cloud Gateway (deprecated)

You can use the Azure portal or the Azure CLI to set up APM in VMware Spring Cloud Gateway. You can also specify the types of APM Java agents to use and the corresponding APM environment variables that they support.

##### [Azure portal](#tab/Azure-portal)

Use the following steps to set up APM by using the Azure portal:

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** on the navigation pane, and then select **Configuration**.
1. Choose the APM type in the **APM** list to monitor a gateway.
1. Fill in the key/value pairs for the APM environment variables in the **Properties** and **Secrets** sections. You can put variables with sensitive information in **Secrets**.
1. Select **Save** to save your changes.

Updating the configuration can take a few minutes. You should get a notification when the configuration is complete.

##### [Azure CLI](#tab/Azure-CLI)

Use the following command to set up APM by using the Azure CLI:

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --apm-types <APM-type> \
    --properties <key=value> \
    --secrets <key=value>
```

The allowed values for `--apm-types` are `ApplicationInsights`, `AppDynamics`, `Dynatrace`, `NewRelic`, and `ElasticAPM`. The following command shows the usage for Application Insights as an example:

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --apm-types ApplicationInsights \
    --properties APPLICATIONINSIGHTS_CONNECTION_STRING=<your-Application-Insights-connection-string> APPLICATIONINSIGHTS_SAMPLE_RATE=10
```

You can also put environment variables in the `--secrets` parameter instead of `--properties`. It makes the environment variable more secure in network transmission and data storage in the back end.

---

> [!NOTE]
> Azure Spring Apps upgrades the APM agent and deployed apps with the same cadence to keep compatibility of agents between VMware Spring Cloud Gateway and Azure Spring Apps.
>
> By default, Azure Spring Apps prints the logs of the APM Java agent to `STDOUT`. These logs are included with the VMware Spring Cloud Gateway logs. You can check the version of the APM agent used in the logs. You can query these logs in Log Analytics to troubleshoot.
>
> To make the APM agents work correctly, increase the CPU and memory of VMware Spring Cloud Gateway.

### Configure log levels

You can configure the log levels of VMware Spring Cloud Gateway in the following ways to get more details or to reduce logs:

- You can set log levels to `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, or `OFF`. The default log level for VMware Spring Cloud Gateway is `INFO`.
- You can turn off logs by setting log levels to `OFF`.
- When the log level is set to `WARN`, `ERROR`, or `OFF`, you might be required to adjust it to `INFO` when requesting support from the Azure Spring Apps team. This change causes a restart of VMware Spring Cloud Gateway.
- When the log level is set to `TRACE` or `DEBUG`, it might affect the performance of VMware Spring Cloud Gateway. Try avoid these settings in your production environment.
- You can set log levels for the `root` logger or for specific loggers like `io.pivotal.spring.cloud.gateway`.

The following loggers might contain valuable troubleshooting information at the `TRACE` and `DEBUG` levels:

| Logger                                       | Description                                         |
|----------------------------------------------|-----------------------------------------------------|
| `io.pivotal.spring.cloud.gateway`            | Filters and predicates, including custom extensions |
| `org.springframework.cloud.gateway`          | API gateway                                         |
| `org.springframework.http.server.reactive`   | HTTP server interactions                            |
| `org.springframework.web.reactive`           | API gateway reactive flows                          |
| `org.springframework.boot.autoconfigure.web` | API gateway autoconfiguration                       |
| `org.springframework.security.web`           | Authentication and authorization information        |
| `reactor.netty`                              | Reactor Netty                                       |

To get environment variable keys, add the `logging.level.` prefix, and then set the log level by configuring environment `logging.level.{loggerName}={logLevel}`. The following examples show the steps for the Azure portal and the Azure CLI.

#### [Azure portal](#tab/Azure-portal)

To configure log levels in the Azure portal, use the following steps:

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** on the navigation pane, and then select **Configuration**.
1. Fill in the key/value pairs for the log levels' environment variables in the **Properties** and **Secrets** sections. If the log level is sensitive information in your case, you can include it by using the **Secrets** section.
1. Select **Save** to save your changes.

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-log-level-environment-variables.png" alt-text="Screenshot of the Azure portal that shows the Spring Cloud Gateway environment variables to configure log levels." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-log-level-environment-variables.png":::

#### [Azure CLI](#tab/Azure-CLI)

For a general CLI command for specifying environment variables, see the [Configure environment variables](#configure-environment-variables) section. The following example shows you how to configure log levels by using the Azure CLI:

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --properties \
      logging.level.root=INFO \
      logging.level.io.pivotal.spring.cloud.gateway=DEBUG \
      logging.level.org.springframework.cloud.gateway=DEBUG \
      logging.level.org.springframework.boot.autoconfigure.web=TRACE \
      logging.level.org.springframework.security.web=ERROR
```

If the log level is sensitive information in your case, you can include it by using the `--secrets` parameter.

---

## Update add-on configuration

The add-on configuration feature enables you to customize certain properties of VMware Spring Cloud Gateway by using a JSON format string. The feature is useful when you need to configure properties that aren't exposed through the REST API.

The add-on configuration is a JSON object with key/value pairs that represent the desired configuration. The following example shows the structure of the JSON format:

```json
{
    "<addon-key-name>": {
        "<addon-key-name>": "<addon-value>"
        ...
    },
    "<addon-key-name>": "<addon-value>",
    ...
}
```

The following list shows the supported add-on configurations for the add-on key names and value types. This list is subject to change as we upgrade the VMware Spring Cloud Gateway version.

- SSO configuration:
  - Key name: `sso`
  - Value type: Object
  - Properties:
    - `RolesAttributeName` (String): Specifies the name of the attribute that contains the roles associated with the SSO session.
    - `InactiveSessionExpirationInMinutes` (Integer): Specifies the expiration time, in minutes, for inactive SSO sessions. A value of `0` means the session never expires.
  - Example:
  
    ```json
    {
        "sso": {
            "rolesAttributeName": "roles",
            "inactiveSessionExpirationInMinutes": 1
        }
    }
    ```

- Metadata configuration:
  - Key name: `api`
  - Value type: Object
  - Properties
    - `groupId` (String): A unique identifier for the group of APIs available on the VMware Spring Cloud Gateway instance. The value can contain only lowercase letters and numbers.
  - Example:

    ```json
    {
        "api": {
            "groupId": "id1"
        }
    }
    ```

- Pod configuration
  - Key name: `PodOverrides`, which is used to specify overrides for the default pod configuration.
  - Value type: Object
  - Properties
    - `Containers`: This array contains the configuration for individual containers within the pod. Only the container named `gateway` is supported currently.
      - `Name`: Specifies the name of the container. The container should be named `gateway`.
      - `Lifecycle`: `PreStop` is a lifecycle hook that's executed when a container is about to be terminated. This hook enables you to perform any necessary cleanup before the container stops.
    - `TerminationGracePeriodSeconds`: Specifies the amount of time Kubernetes waits for a pod to terminate gracefully before forcibly killing it.
  - Example:

    ```json
    {
        "PodOverrides": {
            "Containers": [
                {
                    "Name": "gateway",
                    "Lifecycle": {
                        "PreStop": {
                            "Exec": {
                                "Command": [
                                    "/bin/sh",
                                    "-c",
                                    "sleep 20"
                                ]
                            }
                        }
                    }
                }
            ],
            "TerminationGracePeriodSeconds": 120
        }
    }
    ```
    
    When a pod containing this container is being terminated, the `PreStop` hook executes the command `/bin/sh -c 'sleep 20'`, causing the container to sleep for 20 seconds. This pause gives the container some time to complete any ongoing tasks or cleanup before it actually stops.
    
    The `TerminationGracePeriodSeconds` setting provides a total of 120 seconds for the pod to terminate gracefully, including the time taken by any lifecycle hooks, such as `PreStop`.

Use the following steps to update the add-on configuration.

### [Azure portal](#tab/Azure-portal)

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** on the navigation pane, and then select **Configuration**.
1. Specify the JSON value for **Addon Configs**.
1. Select **Save**.

### [Azure CLI](#tab/Azure-CLI) 

1. Prepare the JSON file for add-on configurations (**\<file-name-of-addon-configs-json\>.json**) with the following content:

   ```json
   {
       "sso": {
           "rolesAttributeName": "roles",
           "inactiveSessionExpirationInMinutes": 1
       },
       "api": {
           "groupId": "id1"
       }
   }
   ```

1. Use the following command to update the add-on configurations for VMware Spring Cloud Gateway:

   ```azurecli
   az spring gateway update \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --addon-configs-file <file-name-of-addon-configs-json>.json
   ```

---

## Next steps

- [Use Spring Cloud Gateway](how-to-use-enterprise-spring-cloud-gateway.md)
