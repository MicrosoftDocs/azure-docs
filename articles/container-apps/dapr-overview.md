---
title: Dapr integration with Azure Container Apps
description: Learn more about using Dapr on your Azure Container App service to develop applications.
ms.author: hannahhunter
author: hhunter-ms
ms.service: container-apps
ms.custom: event-tier1-build-2022, ignite-2022, build-2023
ms.topic: conceptual
ms.date: 11/27/2023
---

# Dapr integration with Azure Container Apps

The Distributed Application Runtime ([Dapr][dapr-concepts]) is a set of incrementally adoptable features that simplify the authoring of distributed, microservice-based applications. For example, Dapr provides capabilities for enabling application intercommunication, whether through messaging via pub/sub or reliable and secure service-to-service calls. Once Dapr is enabled for a container app, a secondary process is created alongside your application code that enables communication with Dapr via HTTP or gRPC.

Dapr's APIs are built on best practice industry standards, that:

- Seamlessly fit with your preferred language or framework
- Are incrementally adoptable; you can use one, several, or all dapr capabilities depending on your application's needs

Dapr is an open source, [Cloud Native Computing Foundation (CNCF)][dapr-cncf] project. The CNCF is part of the Linux Foundation and provides support, oversight, and direction for fast-growing, cloud native projects. As an alternative to deploying and managing the Dapr OSS project yourself, the Container Apps platform:

- Provides a managed and supported Dapr integration
- Handles Dapr version upgrades seamlessly
- Exposes a simplified Dapr interaction model to increase developer productivity

This guide provides insight into core Dapr concepts and details regarding the Dapr interaction model in Container Apps.

## Dapr APIs

:::image type="content" source="media/dapr-overview/azure-container-apps-dapr-building-blocks.png" alt-text="Diagram that shows Dapr APIs.":::

| Dapr API                                              | Description                                                                                                                                                     |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [**Service-to-service invocation**][dapr-serviceinvo] | Discover services and perform reliable, direct service-to-service calls with automatic mTLS authentication and encryption. [See known limitations for Dapr service invocation in Azure Container Apps.](#unsupported-dapr-capabilities)                                     |
| [**State management**][dapr-statemgmt]                | Provides state management capabilities for transactions and CRUD operations.                                                                                    |
| [**Pub/sub**][dapr-pubsub]                            | Allows publisher and subscriber container apps to intercommunicate via an intermediary message broker.                                                          |
| [**Bindings**][dapr-bindings]                         | Trigger your applications based on events                                                                                                                       |
| [**Actors**][dapr-actors]                             | Dapr actors are message-driven, single-threaded, units of work designed to quickly scale. For example, in burst-heavy workload situations. |
| [**Observability**](./observability.md)               | Send tracing information to an Application Insights backend.                                                                                                    |
| [**Secrets**][dapr-secrets]                           | Access secrets from your application code or reference secure values in your Dapr components.                                                                   |
| [**Configuration**][dapr-config]                           | Retrieve and subscribe to application configuration items for supported configuration stores.                                                                   |


> [!NOTE]
> The above table covers stable Dapr APIs. To learn more about using alpha APIs and features, [see the Dapr FAQ][dapr-faq].

## Dapr concepts overview

The following example based on the Pub/sub API is used to illustrate core concepts related to Dapr in Azure Container Apps.

:::image type="content" source="media/dapr-overview/dapr-in-aca.png" alt-text="Diagram demonstrating Dapr pub/sub and how it works in Container Apps.":::

| Label | Dapr settings                    | Description                                                                                                                                                                                                                                                                       |
| ----- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Container Apps with Dapr enabled | Dapr is enabled at the container app level by configuring a set of Dapr arguments. These values apply to all revisions of a given container app when running in multiple revisions mode.                                                                                           |
| 2     | Dapr                             | The fully managed Dapr APIs are exposed to each container app through a Dapr sidecar. The Dapr APIs can be invoked from your container app via HTTP or gRPC. The Dapr sidecar runs on HTTP port 3500 and gRPC port 50001.                                                         |
| 3     | Dapr component configuration     | Dapr uses a modular design where functionality is delivered as a component. Dapr components can be shared across multiple container apps. The Dapr app identifiers provided in the scopes array dictate which dapr-enabled container apps will load a given component at runtime. |

## Dapr enablement

You can configure Dapr using various [arguments and annotations][dapr-args] based on the runtime context. Azure Container Apps provides three channels through which you can configure Dapr:

- Container Apps CLI
- Infrastructure as Code (IaC) templates, as in Bicep or Azure Resource Manager (ARM) templates
- The Azure portal

The table below outlines the currently supported list of Dapr sidecar configurations in Container Apps:

| Container Apps CLI        | Template field            | Description                                                                                                                  |
| ------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `--enable-dapr`           | `dapr.enabled`            | Enables Dapr on the container app.                                                                                           |
| `--dapr-app-port`         | `dapr.appPort`            | The port your application is listening on which is used by Dapr for communicating to your application                   |
| `--dapr-app-protocol`     | `dapr.appProtocol`        | Tells Dapr which protocol your application is using. Valid options are `http` or `grpc`. Default is `http`.                  |
| `--dapr-app-id`           | `dapr.appId`              | A unique Dapr identifier for your container app used for service discovery, state encapsulation and the pub/sub consumer ID. |
| `--dapr-max-request-size` | `dapr.httpMaxRequestSize` | Set the max size of request body http and grpc servers to handle uploading of large files. Default is 4 MB.                    |
| `--dapr-read-buffer-size` | `dapr.httpReadBufferSize` | Set the max size of http header read buffer in to handle when sending multi-KB headers. The default 4 KB.                    |
| `--dapr-api-logging`      | `dapr.enableApiLogging`   | Enables viewing the API calls from your application to the Dapr sidecar.                                                     |
| `--dapr-log-level`        | `dapr.logLevel`           | Set the log level for the Dapr sidecar. Allowed values: debug, error, info, warn. Default is `info`.                         |

When using an IaC template, specify the following arguments in the `properties.configuration` section of the container app resource definition.

# [Bicep](#tab/bicep1)

```bicep
 dapr: {
   enabled: true
   appId: 'nodeapp'
   appProtocol: 'http'
   appPort: 3000
 }
```

# [ARM](#tab/arm1)

```json
  "dapr": {
    "enabled": true,
    "appId": "nodeapp",
    "appProcotol": "http",
    "appPort": 3000
  }
```

---

The above Dapr configuration values are considered application-scope changes. When you run a container app in multiple-revision mode, changes to these settings won't create a new revision. Instead, all existing revisions are restarted to ensure they're configured with the most up-to-date values.

## Dapr components

Dapr uses a modular design where functionality is delivered as a [component][dapr-component]. The use of Dapr components is optional and dictated exclusively by the needs of your application.

Dapr components in container apps are environment-level resources that:

- Can provide a pluggable abstraction model for connecting to supporting external services.
- Can be shared across container apps or scoped to specific container apps.
- Can use Dapr secrets to securely retrieve configuration metadata.

### Component schema

All Dapr OSS components conform to the following basic [schema][dapr-component-spec].

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: [COMPONENT-NAME]
  namespace: [COMPONENT-NAMESPACE]
spec:
  type: [COMPONENT-TYPE]
  version: v1
  initTimeout: [TIMEOUT-DURATION]
  ignoreErrors: [BOOLEAN]
  metadata:
    - name: [METADATA-NAME]
      value: [METADATA-VALUE]
```

In Container Apps, the above schema has been slightly simplified to support Dapr components and remove unnecessary fields, including `apiVersion`, `kind`, and redundant metadata and spec properties.

```yaml
componentType: [COMPONENT-TYPE]
version: v1
initTimeout: [TIMEOUT-DURATION]
ignoreErrors: [BOOLEAN]
metadata:
  - name: [METADATA-NAME]
    value: [METADATA-VALUE]
```

### Component scopes

By default, all Dapr-enabled container apps within the same environment load the full set of deployed components. To ensure components are loaded at runtime by only the appropriate container apps, application scopes should be used. In the example below, the component is only loaded by the two Dapr-enabled container apps with Dapr application IDs `APP-ID-1` and `APP-ID-2`:

> [!NOTE]
> Dapr component scopes correspond to the Dapr application ID of a container app, not the container app name.

```yaml
componentType: [COMPONENT-TYPE]
version: v1
initTimeout: [TIMEOUT-DURATION]
ignoreErrors: [BOOLEAN]
metadata:
  - name: [METADATA-NAME]
    value: [METADATA-VALUE]
scopes:
  - [APP-ID-1]
  - [APP-ID-2]
```

### Connecting to external services via Dapr

There are a few approaches supported in container apps to securely establish connections to external services for Dapr components.

1. Using Managed Identity
2. Using a Dapr Secret Store component reference
3. Using Platform-managed Kubernetes secrets

#### Using managed identity

For Azure-hosted services, Dapr can use the managed identity of the scoped container apps to authenticate to the backend service provider. When using managed identity, you don't need to include secret information in a component manifest. Using managed identity is preferred as it eliminates storage of sensitive input in components and doesn't require managing a secret store.

> [!NOTE]
> The `azureClientId` metadata field (the client ID of the managed identity) is **required** for any component authenticating with user-assigned managed identity.

#### Using a Dapr secret store component reference

When you create Dapr components for non-AD enabled services, certain metadata fields require sensitive input values. The recommended approach for retrieving these secrets is to reference an existing Dapr secret store component that securely accesses secret information.

Here are the steps to set up a reference:

1. Create a Dapr secret store component using the Container Apps schema. The component type for all supported Dapr secret stores begins with `secretstores.`.
1. Create extra components as needed which reference this Dapr secret store component to retrieve the sensitive metadata input.

When creating a secret store component in container apps, you can provide sensitive information in the metadata section in either of the following ways:

- For an **Azure Key Vault secret store**, use managed identity to establish the connection.
- For **non-Azure secret stores**, use platform-managed Kubernetes secrets that are defined directly as part of the component manifest.

The following component showcases the simplest possible secret store configuration. In this example, publisher and subscriber applications are configured to both have a system or user-assigned managed identity with appropriate permissions on the Azure Key Vault instance.

```yaml
componentType: secretstores.azure.keyvault
version: v1
metadata:
  - name: vaultName
    value: [your_keyvault_name]
  - name: azureEnvironment
    value: "AZUREPUBLICCLOUD"
  - name: azureClientId # Only required for authenticating user-assigned managed identity
    value: [your_managed_identity_client_id]
scopes:
  - publisher-app
  - subscriber-app
```

> [!NOTE]
> Kubernetes secrets, Local environment variables and Local file Dapr secret stores aren't supported in Container Apps. As an alternative for the upstream Dapr default Kubernetes secret store, container apps provides a platform-managed approach for creating and leveraging Kubernetes secrets.

#### Using Platform-managed Kubernetes secrets

This component configuration defines the sensitive value as a secret parameter that can be referenced from the metadata section. This approach can be used to connect to non-Azure services or in dev/test scenarios for quickly deploying components via the CLI without setting up a secret store or managed identity.

```yaml
componentType: secretstores.azure.keyvault
version: v1
metadata:
  - name: vaultName
    value: [your_keyvault_name]
  - name: azureEnvironment
    value: "AZUREPUBLICCLOUD"
  - name: azureTenantId
    value: "[your_tenant_id]"
  - name: azureClientId 
    value: "[your_client_id]"
  - name: azureClientSecret
    secretRef: azClientSecret
secrets:
  - name: azClientSecret
    value: "[your_client_secret]"
scopes:
  - publisher-app
  - subscriber-app
```

#### Referencing Dapr secret store components

Once you've created a Dapr secret store using one of the above approaches, you can reference that secret store from other Dapr components in the same environment. In the following example, the `secretStoreComponent` field is populated with the name of the secret store specified above, where the `sb-root-connectionstring` is stored.

```yaml
componentType: pubsub.azure.servicebus.queue
version: v1
secretStoreComponent: "my-secret-store"
metadata:
  - name: connectionString
    secretRef: sb-root-connectionstring
scopes:
  - publisher-app
  - subscriber-app
```

### Component examples

# [YAML](#tab/yaml)

To create a Dapr component via the Container Apps CLI, you can use a container apps YAML manifest. When configuring multiple components, you must create and apply a separate YAML file for each component.

```azurecli
az containerapp env dapr-component set --name ENVIRONMENT_NAME --resource-group RESOURCE_GROUP_NAME --dapr-component-name pubsub --yaml "./pubsub.yaml"
```

```yaml
# pubsub.yaml for Azure Service Bus component
componentType: pubsub.azure.servicebus.queue
version: v1
secretStoreComponent: "my-secret-store"
metadata:
  - name: connectionString
    secretRef: sb-root-connectionstring
scopes:
  - publisher-app
  - subscriber-app
```

# [Bicep](#tab/bicep)

This resource defines a Dapr component called `dapr-pubsub` via Bicep. The Dapr component is defined as a child resource of the Container Apps environment. To define multiple components, you can add a `daprComponent` resource for each.

```bicep
resource daprComponent 'daprComponents@2022-03-01' = {
  name: 'dapr-pubsub'
  properties: {
    componentType: 'pubsub.azure.servicebus.queue'
    version: 'v1'
    secretStoreComponent: 'my-secret-store'
    metadata: [
      {
        name: 'connectionString'
        secretRef: 'sb-root-connectionstring'
      }
    ]
    scopes: [
      'publisher-app'
      'subscriber-app'
    ]
  }
}
```

# [ARM](#tab/arm)

This resource defines a Dapr component called `dapr-pubsub` via ARM.

```json
{
  "resources": [
    {
      "type": "daprComponents",
      "name": "dapr-pubsub",
      "properties": {
        "componentType": "pubsub.azure.servicebus.queue",
        "version": "v1",
        "secretScoreComponent": "my-secret-store",
        "metadata": [
          {
            "name": "connectionString",
            "secretRef": "sb-root-connectionstring"
          }
        ],
        "scopes": ["publisher-app", "subscriber-app"]
      }
    }
  ]
}
```

---

## Limitations

### Unsupported Dapr capabilities

- **Custom configuration for Dapr Observability**: Instrument your environment with Application Insights to visualize distributed tracing.
- **Dapr Configuration spec**: Any capabilities that require use of the Dapr configuration spec.
- **Invoking non-Dapr services from Dapr as if they were Dapr-enabled**: Dapr's Service Invocation with Azure Container Apps is supported only between Dapr-enabled services.
- **Declarative pub/sub subscriptions**
- **Any Dapr sidecar annotations not listed above**
- **Alpha APIs and components**: Azure Container Apps doesn't guarantee the availability of Dapr alpha APIs and features. For more information, refer to the [Dapr FAQ][dapr-faq].

### Known limitations

- **Actor reminders**: Require a minReplicas of 1+ to ensure reminders is always active and fires correctly.
- **Jobs**: Dapr isn't supported for jobs.

## Next Steps

Now that you've learned about Dapr and some of the challenges it solves:

- [Learn how to initialize Dapr components in your container app environment.](./dapr-init.md)
- [Create an Azure Dapr component via the Azure Container Apps portal][dapr-component-connection]
- Try [Deploying a Dapr application to Azure Container Apps using the Azure CLI][dapr-quickstart] or [Azure Resource Manager][dapr-arm-quickstart].
- Walk through a tutorial [using GitHub Actions to automate changes for a multi-revision, Dapr-enabled container app][dapr-github-actions].
- Learn how to [perform event-driven work using Dapr bindings][dapr-bindings-tutorial].
- [Enable token authentication for Dapr requests.][dapr-token]
- [Scale your Dapr applications using KEDA scalers][dapr-keda]
- [Answer common questions about the Dapr integration with Azure Container Apps][dapr-faq]


<!-- Links Internal -->

[dapr-quickstart]: ./microservices-dapr.md
[dapr-arm-quickstart]: ./microservices-dapr-azure-resource-manager.md
[dapr-github-actions]: ./dapr-github-actions.md
[dapr-bindings-tutorial]: ./microservices-dapr-bindings.md
[dapr-token]: ./dapr-authentication-token.md
[dapr-component-connection]: ./dapr-component-connection.md
[dapr-keda]: ./dapr-keda-scaling.md
[dapr-faq]: ./faq.yml#dapr

<!-- Links External -->

[dapr-concepts]: https://docs.dapr.io/concepts/overview/
[dapr-pubsub]: https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-overview
[dapr-statemgmt]: https://docs.dapr.io/developing-applications/building-blocks/state-management/state-management-overview/
[dapr-serviceinvo]: https://docs.dapr.io/developing-applications/building-blocks/service-invocation/service-invocation-overview/
[dapr-bindings]: https://docs.dapr.io/developing-applications/building-blocks/bindings/bindings-overview/
[dapr-actors]: https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/
[dapr-secrets]: https://docs.dapr.io/developing-applications/building-blocks/secrets/secrets-overview/
[dapr-config]: https://docs.dapr.io/developing-applications/building-blocks/configuration/
[dapr-cncf]: https://www.cncf.io/projects/dapr/
[dapr-args]: https://docs.dapr.io/reference/arguments-annotations-overview/
[dapr-component]: https://docs.dapr.io/concepts/components-concept/
[dapr-component-spec]: https://docs.dapr.io/reference/resource-specs/
[dapr-release]: https://docs.dapr.io/operations/support/support-release-policy/#supported-versions
