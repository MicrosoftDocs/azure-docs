---
title: How to configure VMware Spring Cloud Gateway with the Azure Spring Apps Enterprise plan
description: Shows you how to configure VMware Spring Cloud Gateway with the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: xiading
ms.service: spring-apps
ms.topic: how-to
ms.date: 11/04/2022
ms.custom: devx-track-java, devx-track-extended-java, event-tier1-build-2022, devx-track-azurecli
---

# Configure VMware Spring Cloud Gateway

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article shows you how to configure Spring Cloud Gateway for VMware Tanzu with the Azure Spring Apps Enterprise plan.

[VMware Spring Cloud Gateway](https://docs.vmware.com/en/VMware-Spring-Cloud-Gateway-for-Kubernetes/index.html) is a commercial VMware Tanzu component based on the open-source Spring Cloud Gateway project. Spring Cloud Gateway for Tanzu handles the cross-cutting concerns for API development teams, such as single sign-on (SSO), access control, rate-limiting, resiliency, security, and more. You can accelerate API delivery using modern cloud native patterns using your choice of programming language for API development.

A Spring Cloud Gateway instance routes traffic according to rules. Both *scale in/out* and *up/down* are supported to meet a dynamic traffic load.

VMware Spring Cloud Gateway includes the following features:

- Dynamic routing configuration, independent of individual applications, that you can apply and change without recompiling.
- Commercial API route filters for transporting authorized JSON Web Token (JWT) claims to application services.
- Client certificate authorization.
- Rate-limiting approaches.
- Circuit breaker configuration.
- Support for accessing application services via HTTP Basic Authentication credentials.

To integrate with API portal for VMware Tanzu, VMware Spring Cloud Gateway automatically generates OpenAPI version 3 documentation after any route configuration additions or changes. For more information, see [Use API portal for VMware Tanzu®](./how-to-use-enterprise-api-portal.md).

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan service instance with VMware Spring Cloud Gateway enabled. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).

  > [!NOTE]
  > You must enable VMware Spring Cloud Gateway when you provision your Azure Spring Apps service instance. You can't enable VMware Spring Cloud Gateway after provisioning.

- Azure CLI version 2.0.67 or later. For more information, see [How to install the Azure CLI](/cli/azure/install-azure-cli).

## Enable/disable Spring Cloud Gateway after service creation

You can enable and disable Spring Cloud Gateway after service creation using the Azure portal or Azure CLI. Before disabling Spring Cloud Gateway, you're required to unassign its endpoint and remove all route configs.

### [Azure portal](#tab/Azure-portal)

Use the following steps to enable or disable Spring Cloud Gateway using the Azure portal:

1. Navigate to your service resource, and then select **Spring Cloud Gateway**.
1. Select **Manage**.
1. Select or unselect the **Enable Spring Cloud Gateway**, and then select **Save**.
1. You can now view the state of Spring Cloud Gateway on the **Spring Cloud Gateway** page.

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-manage-restart.png" alt-text="Screenshot of the Azure portal showing the Spring Cloud Gateway page." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-manage-restart.png":::

### [Azure CLI](#tab/Azure-CLI)

Use the following Azure CLI commands to enable or disable Spring Cloud Gateway:

```azurecli
az spring spring-cloud-gateway create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name>
```

```azurecli
az spring spring-cloud-gateway delete \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name>
```

---

## Restart Spring Cloud Gateway

After the restart action, gateway instances are rolling restarted.

### [Azure portal](#tab/Azure-portal)

Use the following steps to restart Spring Cloud Gateway using the Azure portal:

1. Navigate to your service resource, and then select **Spring Cloud Gateway**.
1. Select **Restart**.
1. Select **OK** to confirm the restart.

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-restart.png" alt-text="Screenshot of the Azure portal showing the Spring Cloud Gateway page with the Restart gateway dialog box." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-restart.png":::

### [Azure CLI](#tab/Azure-CLI)

Use the following Azure CLI command to restart the gateway:

```azurecli
az spring spring-cloud-gateway restart \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name>
```

---

## Configure Spring Cloud Gateway

This section describes how to assign a public endpoint to Spring Cloud Gateway and configure its properties.

#### [Azure portal](#tab/Azure-portal)

To assign an endpoint in the Azure portal, use the following steps:

1. Open your Azure Spring Apps instance.
1. Select **Spring Cloud Gateway** in the navigation pane, and then select **Overview**.
1. Set **Assign endpoint** to **Yes**.

After a few minutes, **URL** shows the configured endpoint URL. Save the URL to use later.

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-overview.png" alt-text="Screenshot of the Azure portal showing the Spring Cloud Gateway overview page with Assign endpoint highlighted." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-overview.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to assign the endpoint.

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --assign-endpoint true
```

---

## Configure VMware Spring Cloud Gateway metadata

You can configure VMware Spring Cloud Gateway metadata, which automatically generates OpenAPI version 3 documentation, to display route groups in API portal for VMware Tanzu. For more information, see [Use API portal for VMware Tanzu](./how-to-use-enterprise-api-portal.md).

The following table describes the available metadata options:

| Property      | Description                                                                                                                                                                                                                                                                 |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| title         | A title that describes the context of the APIs available on the Gateway instance. The default value is `Spring Cloud Gateway for K8S`.                                                                                                                                          |
| description   | A detailed description of the APIs available on the Gateway instance. The default value is `Generated OpenAPI 3 document that describes the API routes configured for '[Gateway instance name]' Spring Cloud Gateway instance deployed under '[namespace]' namespace.*.` |
| documentation | The location of API documentation that's available on the Gateway instance.                                                                                                                                                                                          |
| version       | The version of APIs available on this Gateway instance. The default value is `unspecified`.                                                                                                                                                                                 |
| serverUrl     | The base URL to access APIs on the Gateway instance.                                                                                                                                                                                            |

> [!NOTE]
> The `serverUrl` property is mandatory if you want to integrate with [API portal](./how-to-use-enterprise-api-portal.md).

You can use the Azure portal and the Azure CLI to edit metadata properties.

#### [Azure portal](#tab/Azure-portal)

To edit metadata in the Azure portal, use the following steps:

1. Open your Azure Spring Apps instance.
1. Select **Spring Cloud Gateway** in the navigation pane, and then select **Configuration**.
1. Specify values for the properties listed for **API**.
1. Select **Save**.

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-configuration.png" alt-text="Screenshot of Azure portal showing the Spring Cloud Gateway configuration page for an Azure Spring Apps instance, with the API section highlighted." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-configuration.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to configure VMware Spring Cloud Gateway metadata properties. You need the endpoint URL obtained from the [Configure Spring Cloud Gateway](#configure-spring-cloud-gateway) section.

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

## Configure single sign-on (SSO)

VMware Spring Cloud Gateway supports authentication and authorization using single sign-on (SSO) with an OpenID identity provider, which supports the OpenID Connect Discovery protocol.

| Property       | Required? | Description                                                                                                                                                                                                                                                                                                          |
|----------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `issuerUri`    | Yes       | The URI that is asserted as its Issuer Identifier. For example, if the `issuer-uri` is `https://example.com`, then an OpenID Provider Configuration Request is made to `https://example.com/.well-known/openid-configuration`. The result is expected to be an OpenID Provider Configuration Response. |
| `clientId`     | Yes       | The OpenID Connect client ID provided by your identity provider.                                                                                                                                                                                                                                                                   |
| `clientSecret` | Yes       | The OpenID Connect client secret provided by your identity provider.                                                                                                                                                                                                                                                               |
| `scope`        | Yes       | A list of scopes to include in JWT identity tokens. This list should be based on the scopes allowed by your identity provider.                                                                                                                                                                                       |

To set up SSO with Azure AD, see [How to set up single sign-on with Azure Active Directory for Spring Cloud Gateway and API portal](./how-to-set-up-sso-with-azure-ad.md).

You can use the Azure portal and the Azure CLI to edit SSO properties.

#### [Azure portal](#tab/Azure-portal)

To edit SSO properties in the Azure portal, use the following steps:

1. Open your Azure Spring Apps instance.
1. Select **Spring Cloud Gateway** in the navigation pane, and then select **Configuration**.
1. Specify values for the properties listed for **SSO**.
1. Select **Save**.

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-sso-configuration.png" alt-text="Screenshot of Azure portal showing the Spring Cloud Gateway configuration page for an Azure Spring Apps instance, with the Single Sign On section highlighted." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-sso-configuration.png":::

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to configure SSO properties for VMware Spring Cloud Gateway.

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

> [!NOTE]
> VMware Spring Cloud Gateway supports only the authorization servers that support OpenID Connect Discovery protocol. Also, be sure to configure the external authorization server to allow redirects back to the gateway. Refer to your authorization server's documentation and add `https://<gateway-external-url>/login/oauth2/code/sso` to the list of allowed redirect URIs.
>
> If you configure the wrong SSO property, such as the wrong password, you should remove the entire SSO property and re-add the correct configuration.
>
> After configuring SSO, remember to set `ssoEnabled: true` for the Spring Cloud Gateway routes.

## Configure single sign-on (SSO) logout

VMware Spring Cloud Gateway service instances provide a default API endpoint to log out of the current SSO session. The path to this endpoint is `/scg-logout`. The logout results in one of the following outcomes, depending on how you call the logout endpoint:

- Logout of session and redirect to the identity provider (IdP) logout.
- Logout the service instance session.

### Logout of IdP and SSO session

If you send a `GET` request to the `/scg-logout` endpoint, then the endpoint sends a `302` redirect response to the IdP logout URL. To get the endpoint to return the user back to a path on the gateway service instance, add a redirect parameter to the `GET` request with the `/scg-logout` endpoint. For example, `${server-url}/scg-logout?redirect=/home`.

The following steps describe an example of how to implement the function in your microservices:

1. Get a route config to route the logout request to your application. For example, see the Animal Rescue UI pages route config in the [animal-rescue](https://github.com/Azure-Samples/animal-rescue/blob/0e343a27f44cc4a4bfbf699280476b0517854d7b/frontend/azure/api-route-config.json#L32) repository on GitHub.

1. Add whatever logout logic you need to the application. At the end, you need to a `GET` request to the gateway's `/scg-logout` endpoint as shown in the `return` value for the `getActionButton` method in the [animal-rescue](https://github.com/Azure-Samples/animal-rescue/blob/0e343a27f44cc4a4bfbf699280476b0517854d7b/frontend/src/App.js#L84) repository.

> [!NOTE]
> The value of the redirect parameter must be a valid path on the gateway service instance. You can't redirect to an external URL.

### Log out just the SSO session

If you send the `GET` request to the `/scg-logout` endpoint using a `XMLHttpRequest` (XHR), then the `302` redirect could be swallowed and not handled in the response handler. In this case, the user would only be logged out of the SSO session on the gateway service instance and would still have a valid IdP session. The behavior typically seen is that if the user attempts to log in again, they're automatically sent back to the gateway as authenticated from IdP.

You need to have a route configuration to route the logout request to your application, as shown in the following example. This code makes a gateway-only logout SSO session.

```java
const req = new XMLHttpRequest();
req.open("GET", "/scg-logout);
req.send();
```

## Configure cross-origin resource sharing (CORS)

Cross-origin resource sharing (CORS) allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served. The available CORS configuration options are described in the following table.

| Property                | Description                                                                |
|-------------------------|----------------------------------------------------------------------------|
| `allowedOrigins`        | Allowed origins to make cross-site requests.                               |
| `allowedOriginPatterns` | Allowed origin patterns to make cross-site requests.                       |
| `allowedMethods`        | Allowed HTTP methods on cross-site requests.                               |
| `allowedHeaders`        | Allowed headers in cross-site request.                                     |
| `maxAge`                | How long, in seconds, clients cache the response from a preflight request. |
| `allowCredentials`      | Whether user credentials are supported on cross-site requests.             |
| `exposedHeaders`        | HTTP response headers to expose for cross-site requests.                   |

> [!NOTE]
> Be sure you have the correct CORS configuration if you want to integrate with API portal. For more information, see the [Configure Spring Cloud Gateway](#configure-spring-cloud-gateway) section.

## Use service scaling

You can customize resource allocation for Spring Cloud Gateway instances, including vCpu, memory, and instance count.

> [!NOTE]
> For high availability, a single replica is not recommended.

The following table describes the default resource usage.

| Component name                               | Instance count | vCPU per instance | Memory per instance |
|----------------------------------------------|----------------|-------------------|---------------------|
| VMware Spring Cloud Gateway                  | 2              | 1 core            | 2Gi                 |
| VMware Spring Cloud Gateway operator         | 2              | 1 core            | 2Gi                 |

## Configure TLS between gateway and applications

To enhance security and protect sensitive information from interception by unauthorized parties, you can enable Transport Layer Security (TLS) between Spring Cloud Gateway and your applications. This section explains how to configure TLS between a gateway and applications.

Before configuring TLS, you need to have a TLS-enabled application and a TLS certificate. To prepare a TLS certificate, generate a certificate from a trusted certificate authority (CA). The certificate verifies the identity of the server and establishes a secure connection.

After you have a TLS-enabled application running in Azure Spring Apps, upload the certificate to Azure Spring Apps. For more information, see the [Import a certificate](how-to-use-tls-certificate.md#import-a-certificate) section of [Use TLS/SSL certificates in your application in Azure Spring Apps](how-to-use-tls-certificate.md).

With the certificate updated to Azure Spring Apps, you can now configure the TLS certificate for the gateway and enable certificate verification. You can configure the certification in the Azure portal or by using the Azure CLI.

#### [Azure portal](#tab/Azure-portal)

Use the following steps to configure the certificate in the Azure portal:

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** in the navigation pane.
1. On the **Spring Cloud Gateway** page, select **Certificate management**.
1. Select **Enable cert verification**.
1. Select the TLS certificate in **Certificates**.
1. Select **Save**.

Updating the configuration can take a few minutes. You should get a notification when the configuration is complete.

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to enable or disable certificate verification using the Azure CLI. Be sure to replace the *`<value>`* placeholder with *true* to enable or *false* to disable verification.

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --enable-cert-verify <value> \
    --certificate-names <certificate-name-in-Azure-Spring-Apps>
```

---

### Prepare the route configuration

You must specify the protocol as HTTPS in the route configuration. The following JSON object instructs the gateway to use the HTTPS protocol for all traffic between the gateway and the app.

1. Create a file named *test-tls-route.json* with the following content.

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

As certificates expire, you need to rotate certificates in Spring Cloud Gateway by using the following steps:

1. Generate new certificates from a trusted CA.
1. Import the certificates into Azure Spring Apps. For more information, see the [Import a certificate](how-to-use-tls-certificate.md#import-a-certificate) section of [Use TLS/SSL certificates in your application in Azure Spring Apps](how-to-use-tls-certificate.md).
1. Synchronize the certificates, using the Azure portal or the Azure CLI.

The gateway restarts accordingly to ensure that the gateway uses the new certificate for all connections.

#### [Azure portal](#tab/Azure-portal)

Use the following steps to synchronize certificates.

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** in the navigation pane.
1. On the **Spring Cloud Gateway** page, select **Restart**, and then confirm the operation.

#### [Azure CLI](#tab/Azure-CLI) 

Use the following restart command to synchronize a certificate for Spring Cloud Gateway.

```azurecli
az spring gateway restart \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name>
```

---

### Set up autoscale settings for VMware Spring Cloud Gateway in Azure CLI

You can set autoscale modes using the Azure CLI. The following commands create an autoscale setting and an autoscale rule.

- Use the following command to create an autoscale setting:

  ```azurecli
  az monitor autoscale create \
      --resource-group <resource-group-name> \
      --name <autoscale-setting-name> \
      --resource /subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.AppPlatform/Spring/<service-instance-name>/gateways/default \
      --min-count 1 \
      --max-count 5 \
      --count 1
  ```

- Use the following command to create an autoscale rule:

  ```azurecli
  az monitor autoscale rule create \
      --resource-group <resource-group-name> \
      --autoscale-name <autoscale-setting-name> \
      --scale out 1 \
      --cooldown 1 \
      --condition "GatewayHttpServerRequestsSecondsCount > 100 avg 1m"
  ```

For information on the available metrics, see the [User metrics options](./concept-metrics.md#user-metrics-options) section of [Metrics for Azure Spring Apps](./concept-metrics.md).

---

## Configure environment variables

The Azure Spring Apps service manages and tunes Spring Cloud Gateway. Except for the use cases that configure application performance monitoring and the log level, you don't normally need to configure it with environment variables. But if you do have requirements that you can't fulfill by other configurations described in this article, you can try to configure the environment variables shown in the [Common application properties](https://cloud.spring.io/spring-cloud-gateway/reference/html/appendix.html#common-application-properties) list. Be sure to verify your configuration in your test environment before applying it to your production environment.

#### [Azure portal](#tab/Azure-portal)

To configure environment variables in the Azure portal, use the following steps:

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** in the navigation pane, and then select **Configuration**.
1. Fill in the key-value pairs for the environment variables in the **Properties** or **Secrets** sections. You can include variables with sensitive information in the **Secrets** section.
1. When you've provided all the configurations, select **Save** to save your changes.

#### [Azure CLI](#tab/Azure-CLI)

Use the following command to configure environment variables using the Azure CLI. You can include variables with sensitive information by using the `--secrets` parameter.

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --properties <key=value> \
    --secrets <key=value>
```

---

> [!NOTE]
> When the environment variables are updated, Spring Cloud Gateway is restarted.

### Configure application performance monitoring

To monitor Spring Cloud Gateway, you can configure application performance monitoring (APM). The following table lists the five types of APM Java agents provided by Spring Cloud Gateway and their required environment variables.

| Java Agent           | Required environment variables                                                                                                                                                                                                                                                                       |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Application Insights | `APPLICATIONINSIGHTS_CONNECTION_STRING`                                                                                                                                                                                                                                                              |
| Dynatrace            | `DT_TENANT`<br>`DT_TENANTTOKEN`<br>`DT_CONNECTION_POINT`                                                                                                                                                                                                                                             |
| New Relic            | `NEW_RELIC_LICENSE_KEY`<br>`NEW_RELIC_APP_NAME`                                                                                                                                                                                                                                                      |
| AppDynamics          | `APPDYNAMICS_AGENT_APPLICATION_NAME`<br>`APPDYNAMICS_AGENT_TIER_NAME`<br>`APPDYNAMICS_AGENT_NODE_NAME`<br> `APPDYNAMICS_AGENT_ACCOUNT_NAME`<br>`APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY`<br>`APPDYNAMICS_CONTROLLER_HOST_NAME`<br>`APPDYNAMICS_CONTROLLER_SSL_ENABLED`<br>`APPDYNAMICS_CONTROLLER_PORT` |
| ElasticAPM           | `ELASTIC_APM_SERVICE_NAME`<br>`ELASTIC_APM_APPLICATION_PACKAGES`<br>`ELASTIC_APM_SERVER_URL`                                                                                                                                                                                                         |

For other supported environment variables, see the following sources:

- [Application Insights public document](../azure-monitor/app/app-insights-overview.md?tabs=net)
- [Dynatrace Environment Variables](https://www.dynatrace.com/support/help/setup-and-configuration/setup-on-cloud-platforms/microsoft-azure-services/azure-integrations/azure-spring#envvar)
- [New Relic Environment Variables](https://docs.newrelic.com/docs/apm/agents/java-agent/configuration/java-agent-configuration-config-file/#Environment_Variables)
- [AppDynamics Environment Variables](https://docs.appdynamics.com/21.11/en/application-monitoring/install-app-server-agents/java-agent/monitor-azure-spring-cloud-with-java-agent#MonitorAzureSpringCloudwithJavaAgent-ConfigureUsingtheEnvironmentVariablesorSystemProperties)
- [Elastic Environment Variables](https://www.elastic.co/guide/en/apm/agent/java/master/configuration.html).

#### Manage APM in Spring Cloud Gateway

You can use the Azure portal or the Azure CLI to set up application performance monitoring (APM) in Spring Cloud Gateway. You can also specify the types of APM Java agents to use and the corresponding APM environment variables they support.

##### [Azure portal](#tab/Azure-portal)

Use the following steps to set up APM using the Azure portal:

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** in the navigation page and then select **Configuration**.
1. Choose the APM type in the **APM** list to monitor a gateway.
1. Fill in the key-value pairs for the APM environment variables in the **Properties** or **Secrets** sections. You can put variables with sensitive information in **Secrets**.
1. When you've provided all the configurations, select **Save** to save your changes.

Updating the configuration can take a few minutes. You should get a notification when the configuration is complete.

##### [Azure CLI](#tab/Azure-CLI)

Use the following command to set up APM using Azure CLI:

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --apm-types <APM-type> \
    --properties <key=value> \
    --secrets <key=value>
```

The allowed values for `--apm-types` are `ApplicationInsights`, `AppDynamics`, `Dynatrace`, `NewRelic`, and `ElasticAPM`. The following command shows the usage using Application Insights as an example.

```azurecli
az spring gateway update \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --apm-types ApplicationInsights \
    --properties APPLICATIONINSIGHTS_CONNECTION_STRING=<your-Application-Insights-connection-string> APPLICATIONINSIGHTS_SAMPLE_RATE=10
```

You can also put environment variables in the `--secrets` parameter instead of `--properties`, which makes the environment variable more secure in network transmission and data storage in the backend.

---

> [!NOTE]
> Azure Spring Apps upgrades the APM agent and deployed apps with the same cadence to keep compatibility of agents between Spring Cloud Gateway and Spring apps.
>
> By default, Azure Spring Apps prints the logs of the APM Java agent to `STDOUT`. These logs are included with the Spring Cloud Gateway logs. You can check the version of the APM agent used in the logs. You can query these logs in Log Analytics to troubleshoot.
> To make the APM agents work correctly, increase the CPU and memory of Spring Cloud Gateway.

### Configure log levels

You can configure the log levels of Spring Cloud Gateway in the following ways to get more details or to reduce logs:

- The default log level for Spring Cloud Gateway is `INFO`.
- You can set log levels to `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`, `OFF`.
- You can turn off logs by setting log levels to `OFF`.
- When log levels are set to `WARN`, `ERROR`, `OFF`, you may be required to adjust it to `INFO` when requesting support from the Azure Spring Apps team. This change causes a restart of Spring Cloud Gateway.
- When log levels are set to `TRACE` or `DEBUG`, it may affect the performance of Spring Cloud Gateway. Try avoid these settings in your production environment.
- You can set log levels for the `root` logger or specific loggers like `io.pivotal.spring.cloud.gateway`.

The following loggers may contain valuable troubleshooting information at the `TRACE` and `DEBUG` levels:

| Logger                                       | Description                                          |
|----------------------------------------------|------------------------------------------------------|
| `io.pivotal.spring.cloud.gateway`            | Filters and predicates, including custom extensions. |
| `org.springframework.cloud.gateway`          | API gateway.                                         |
| `org.springframework.http.server.reactive`   | HTTP server interactions.                            |
| `org.springframework.web.reactive`           | API gateway reactive flows.                          |
| `org.springframework.boot.autoconfigure.web` | API gateway autoconfiguration.                       |
| `org.springframework.security.web`           | Authentication and Authorization information.        |
| `reactor.netty`                              | Reactor Netty.                                       |

To get environment variable keys, add the `logging.level.` prefix, and then set the log level by configuring environment `logging.level.{loggerName}={logLevel}`. Examples with Azure portal and Azure CLI:

#### [Azure portal](#tab/Azure-portal)

To configure log levels in the Azure portal, use the following steps:

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** in the navigation pane, and then select **Configuration**.
1. Fill in the key-value pairs for the log level environment variables in the **Properties** or **Secrets** sections. If the log level is sensitive information in your case, you can include it using the **Secrets** section.
1. When you've provided all the configurations, select **Save** to save your changes.

:::image type="content" source="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-log-level-environment-variables.png" alt-text="Screenshot of the Azure portal showing the Spring Cloud Gateway environment variables to configure log levels." lightbox="media/how-to-configure-enterprise-spring-cloud-gateway/gateway-log-level-environment-variables.png":::

#### [Azure CLI](#tab/Azure-CLI)

For a general CLI command for specifying environment variables, see the [Configure environment variables](#configure-environment-variables) section. The following example shows you how to configure log levels using the Azure CLI:

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

## Configure addon configuration

The addon configuration feature enables you to customize certain properties of Spring Cloud Gateway using a JSON format string. The feature is useful when you need to configure properties that aren't exposed through the REST API.

The addon configuration is a JSON object with key-value pairs representing the desired configuration. The following example shows the structure of the JSON format:

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

The following list shows the supported addon configurations for the addon key names and value types. This list is subject to change as we upgrade the Spring Cloud Gateway version.

- Single sign-on (SSO) configuration
  - Key name: `sso`
  - Value type: Object
  - Properties:
    - `RolesAttributeName` (String): Specifies the name of the attribute that contains the roles associated with the single sign-on session.
    - `InactiveSessionExpirationInMinutes` (Integer): Specifies the expiration time in minutes for inactive single sign-on sessions. A value of *0* means never expire.
  - Example:
  
    ```json
    {
        "sso": {
            "rolesAttributeName": "roles",
            "inactiveSessionExpirationInMinutes": 1
        }
    }
    ```

- Metadata configuration
  - Key name: `api`
  - Value type: Object
  - Properties
    - `groupId` (String): A unique identifier for the group of APIs available on the Gateway instance. The value can only contain lowercase letters and numbers.
  - Example:

    ```json
    {
        "api": {
            "groupId": "id1"
        }
    }
    ```

Use the following steps to update the addon configuration.

### [Azure portal](#tab/Azure-portal)

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** in the navigation pane, and then select **Configuration**.
1. Specify the JSON value for **Addon Configs**.
1. Select **Save**.

### [Azure CLI](#tab/Azure-CLI) 

1. Prepare the addon configs JSON file *\<file-name-of-addon-configs-json\>.json* with the following content:

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

1. Use the following command to update the addon configs for Spring Cloud Gateway:

   ```azurecli
   az spring gateway update \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --addon-configs-file <file-name-of-addon-configs-json>.json
   ```

---

## Next steps

- [How to Use Spring Cloud Gateway](how-to-use-enterprise-spring-cloud-gateway.md)
