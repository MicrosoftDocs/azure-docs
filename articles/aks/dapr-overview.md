---
title: Dapr extension for Azure Kubernetes Service (AKS) overview
description: Learn more about using Dapr on your Azure Kubernetes Service (AKS) cluster to develop applications.
ms.author: nickoman
ms.topic: article
ms.date: 07/07/2023
---

# Dapr

[Distributed Application Runtime (Dapr)][dapr-docs] offers APIs that help you write and implement simple, portable, resilient, and secured microservices. Running as a sidecar process in tandem with your applications, Dapr APIs abstract away common complexities you may encounter when building distributed applications, such as:
- Service discovery
- Message broker integration
- Encryption
- Observability
- Secret management 

Dapr is incrementally adoptable. You can use any of the API building blocks as needed.

> [!NOTE]
> Alpha and beta components and [APIs](https://docs.dapr.io/operations/support/alpha-beta-apis/) are available, but not supported.
> 
> [Learn the support level Microsoft offers for each Dapr API and component.](#components-and-apis)


:::image type="content" source="./media/dapr-overview/dapr-building-blocks.png" alt-text="Diagram showing how many different code frameworks can interface with the various building blocks of Dapr via HTTP or gRPC." lightbox="./media/dapr-overview/dapr-building-blocks.png":::

## Capabilities and features

Dapr provides the following set of capabilities to help with your microservice development on AKS:

- Easy provisioning of Dapr on AKS through [cluster extensions][cluster-extensions].
- Portability enabled through HTTP and gRPC APIs which abstract underlying technologies choices
- Reliable, secure, and resilient service-to-service calls through HTTP and gRPC APIs
- Publish and subscribe messaging made easy with support for CloudEvent filtering and “at-least-once” semantics for message delivery
- Pluggable observability and monitoring through Open Telemetry API collector
- Works independent of language, while also offering language specific software development kits (SDKs)
- Integration with Visual Studio Code through the Dapr extension
- [More APIs for solving distributed application challenges][dapr-blocks]

## Currently supported

The Dapr extension is the only Microsoft-supported option for Dapr in AKS. 

### Issue handling

Extension operations, critical security fixes, and regressions are prioritized for immediate resolution.

For functional issues - for example, with Dapr APIs or components - Microsoft triages, mitigates, and works with the open source community to determine the best path for resolution. Issues may be resolved in a hotfix or future Dapr release, depending on priority, severity, and size of the issue. Once released in Dapr open source, fixes are then made available in the Dapr extension.

### Dapr versions

The Dapr extension support varies depending on how you manage the runtime. 

**Self-managed**  
For self-managed runtime, the Dapr extension supports:
- [The latest version of Dapr and two previous versions (N-2)][dapr-supported-version]
- Upgrading minor version incrementally (for example, 1.5 -> 1.6 -> 1.7) 

Self-managed runtime requires manual upgrade to remain in the support window. To upgrade Dapr via the extension, follow the [Update extension instance](deploy-extensions-az-cli.md#update-extension-instance) instructions.

**Auto-upgrade**  
Enabling auto-upgrade keeps your Dapr extension updated to the latest minor version. You may experience breaking changes between updates.

### Components and APIs

#### Managed APIs

The Dapr extension offers managed generally available and preview versions of Dapr APIs (building blocks) marked _stable_ in the open source project. 

- General Availability (GA): Indicates that the API is fully managed and supported for use in production environments. 
- Preview: Preview APIs are available for early testing and aren't recommended for production. Preview support is provided at best effort.

:::image type="content" source="media/dapr-overview/managed-dapr-building-blocks.png" alt-text="Diagram that shows managed Dapr APIs.":::

| Dapr API                                              | Status | Description                                                                                                                                                     |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |  
| [**Service-to-service invocation**][dapr-serviceinvo] | GA | Discover services and perform reliable, direct service-to-service calls with automatic mTLS authentication and encryption.(#limitations)                                     |
| [**State management**][dapr-statemgmt]                | GA | Provides state management capabilities for transactions and CRUD operations.                                                                                    |
| [**Pub/sub**][dapr-pubsub]                            | GA | Allows publisher and subscriber apps to intercommunicate via an intermediary message broker. You can also create [declarative subscriptions][dapr-subscriptions] to a topic using an external component JSON file.                                                          |
| [**Bindings**][dapr-bindings]                         | GA | Trigger your applications based on events                                                                                                                       |
| [**Actors**][dapr-actors]                             | GA | Dapr actors are message-driven, single-threaded, units of work designed to quickly scale. For example, in burst-heavy workload situations. |
| **Observability**               | GA | Send tracing information to an Application Insights backend.                                                                                                    |
| [**Secrets**][dapr-secrets]                           | GA | Access secrets from your application code or reference secure values in your Dapr components.                                                                   |
| [**Configuration**][dapr-config]                           | GA | Retrieve and subscribe to application configuration items for supported configuration stores.                                                                   |
| [**Workflow**][dapr-config]                           | Preview | Retrieve and subscribe to application configuration items for supported configuration stores.                                                                   |

#### Managed versus standard components

A subset of Dapr components is supported for the Dapr extension for AKS and Arc-enabled Kubernetes. Within that subset, Dapr components are broken into two support categories: _managed_ or _standard_. Components are organized into each category based on usage and quality. 

- [Managed components:](#managed-components) Fully managed, GA components providing the highest level of support.
- [Standard components:](#standard-components) Built-in components that are supported, but provide a lower service level agreement (SLA) guarantee.

##### Managed components

| API | Component | Type |
| --- | --------- | ------ |
| State management | Azure Blob Storage v1<br>Azure Table Storage<br>Microsoft SQL Server | `state.azure.blobstorage`<br>`state.azure.tablestorage`<br>`state.sqlserver` | 
| Publish & subscribe | Azure Service Bus Queues<br>Azure Service Bus Topics<br>Azure Event Hubs | `pubsub.azure.servicebus.queues`<br>`pubsub.azure.servicebus.topics`<br>`pubsub.azure.eventhubs` |
| Binding | Azure Storage Queues<br>Azure Service Bus Queues<br>Azure Blob Storage<br>Azure Event Hubs<br> | `bindings.azure.storagequeues`<br>`bindings.azure.servicebusqueues`<br>`bindings.azure.blobstorage`<br>`bindings.azure.eventhubs` |

##### Standard components

| API | Component | Type |
| --- | --------- | ------ |
| State management | Azure Cosmos DB<br>PostgreSQL<br>MySQL & MariaDB<br>Redis | `state.azure.cosmosdb`<br>`state.postgresql`<br>`state.mysql`<br>`state.redis` | 
| Publish & subscribe | Apache Kafka<br>Redis Streams | `pubsub.kafka`<br>`pubsub.redis` |
| Binding | Azure Event Grid<br>Azure Cosmos DB<br>Apache Kafka<br>PostgreSQL<br>Redis | `bindings.azure.eventgrid`<br>`bindings.azure.cosmosdb`<br>`bindings.kafka`<br>`bindings.postgresql`<br>`bindings.redis` |
| Configuration | PostgreSQL<br>Redis | `bindings.postgresql`<br>`bindings.redis` |

### Clouds/regions

Global Azure cloud is supported with Arc support on the following regions:

| Region | AKS support | Arc for Kubernetes support |
| ------ | ----------- | -------------------------- |
| `australiaeast` | :heavy_check_mark: | :heavy_check_mark: |
| `australiasoutheast` | :heavy_check_mark: | :x: |
| `brazilsouth` | :heavy_check_mark: | :x: |
| `canadacentral` | :heavy_check_mark: | :heavy_check_mark: |
| `canadaeast` | :heavy_check_mark: | :heavy_check_mark: |
| `centralindia` | :heavy_check_mark: | :heavy_check_mark: |
| `centralus` | :heavy_check_mark: | :heavy_check_mark: |
| `eastasia` | :heavy_check_mark: | :heavy_check_mark: |
| `eastus` | :heavy_check_mark: | :heavy_check_mark: |
| `eastus2` | :heavy_check_mark: | :heavy_check_mark: |
| `eastus2euap` | :x: | :heavy_check_mark: |
| `francecentral` | :heavy_check_mark: | :heavy_check_mark: |
| `francesouth` | :heavy_check_mark: | :x: |
| `germanywestcentral` | :heavy_check_mark: | :heavy_check_mark: |
| `japaneast` | :heavy_check_mark: | :heavy_check_mark: |
| `japanwest` | :heavy_check_mark: | :x: |
| `koreacentral` | :heavy_check_mark: | :heavy_check_mark: |
| `koreasouth` | :heavy_check_mark: | :x: |
| `northcentralus` | :heavy_check_mark: | :heavy_check_mark: |
| `northeurope` | :heavy_check_mark: | :heavy_check_mark: |
| `norwayeast` | :heavy_check_mark: | :x: |
| `southafricanorth` | :heavy_check_mark: | :x: |
| `southcentralus` | :heavy_check_mark: | :heavy_check_mark: |
| `southeastasia` | :heavy_check_mark: | :heavy_check_mark: |
| `southindia` | :heavy_check_mark: | :x: |
| `swedencentral` | :heavy_check_mark: | :heavy_check_mark: |
| `switzerlandnorth` | :heavy_check_mark: | :heavy_check_mark: |
| `uaenorth` | :heavy_check_mark: | :x: |
| `uksouth` | :heavy_check_mark: | :heavy_check_mark: |
| `ukwest` | :heavy_check_mark: | :x: |
| `westcentralus` | :heavy_check_mark: | :heavy_check_mark: |
| `westeurope` | :heavy_check_mark: | :heavy_check_mark: |
| `westus` | :heavy_check_mark: | :heavy_check_mark: |
| `westus2` | :heavy_check_mark: | :heavy_check_mark: |
| `westus3` | :heavy_check_mark: | :heavy_check_mark: |

## Frequently asked questions

### How do Dapr and Service meshes compare?

A: Where a service mesh is defined as a networking service mesh, Dapr isn't a service mesh. While Dapr and service meshes do offer some overlapping capabilities, a service mesh is focused on networking concerns, whereas Dapr is focused on providing building blocks that make it easier for developers to build applications as microservices. Dapr is developer-centric, while service meshes are infrastructure-centric.  

Some common capabilities that Dapr shares with service meshes include:

- Secure service-to-service communication with mTLS encryption
- Service-to-service metric collection
- Service-to-service distributed tracing
- Resiliency through retries

In addition, Dapr provides other application-level building blocks for state management, pub/sub messaging, actors, and more. However, Dapr doesn't provide capabilities for traffic behavior such as routing or traffic splitting. If your solution would benefit from the traffic splitting a service mesh provides, consider using [Open Service Mesh][osm-docs].  

For more information on Dapr and service meshes, and how they can be used together, visit the [Dapr documentation][dapr-docs].

### How does the Dapr secrets API compare to the Secrets Store CSI driver?

Both the Dapr secrets API and the managed Secrets Store CSI driver allow for the integration of secrets held in an external store, abstracting secret store technology from application code. The Secrets Store CSI driver mounts secrets held in Azure Key Vault as a CSI volume for consumption by an application. Dapr exposes secrets via a RESTful API that can be:
- Called by application code
- Configured with assorted secret stores 

The following table lists the capabilities of each offering:

| | Dapr secrets API | Secrets Store CSI driver |
| --- | --- | ---|
| **Supported secrets stores** | Local environment variables (for Development); Local file (for Development); Kubernetes Secrets; AWS Secrets Manager; Azure Key Vault secret store; Azure Key Vault with Managed Identities on Kubernetes; GCP Secret Manager; HashiCorp Vault | Azure Key Vault secret store|
| **Accessing secrets in application code** | Call the Dapr secrets API | Access the mounted volume or sync mounted content as a Kubernetes secret and set an environment variable |
| **Secret rotation** | New API calls obtain the updated secrets | Polls for secrets and updates the mount at a configurable interval |
| **Logging and metrics** | The Dapr sidecar generates logs, which can be configured with collectors such as Azure Monitor, emits metrics via Prometheus, and exposes an HTTP endpoint for health checks | Emits driver and Azure Key Vault provider metrics via Prometheus |

For more information on the secret management in Dapr, see the [secrets management building block overview][dapr-secrets].

For more information on the Secrets Store CSI driver and Azure Key Vault provider, see the [Secrets Store CSI driver overview][csi-secrets-store].

### How does the managed Dapr cluster extension compare to the open source Dapr offering?

The managed Dapr cluster extension is the easiest method to provision Dapr on an AKS cluster. With the extension, you're able to offload management of the Dapr runtime version by opting into automatic upgrades. Additionally, the extension installs Dapr with smart defaults (for example, provisioning the Dapr control plane in high availability mode).

When installing Dapr open source via helm or the Dapr CLI, runtime versions and configuration options are the responsibility of developers and cluster maintainers.  

Lastly, the Dapr extension is an extension of AKS, therefore you can expect the same support policy as other AKS features.

[Learn more about migrating from Dapr open source to the Dapr extension for AKS][dapr-migration].

<a name='how-can-i-authenticate-dapr-components-with-azure-ad-using-managed-identities'></a>

### How can I authenticate Dapr components with Microsoft Entra ID using managed identities?

- Learn how [Dapr components authenticate with Microsoft Entra ID][dapr-msi].
- Learn about [using managed identities with AKS][aks-msi].

### How can I switch to using the Dapr extension if I’ve already installed Dapr via a method, such as Helm?

Recommended guidance is to completely uninstall Dapr from the AKS cluster and reinstall it via the cluster extension.  

If you install Dapr through the AKS extension, our recommendation is to continue using the extension for future management of Dapr instead of the Dapr CLI. Combining the two tools can cause conflicts and result in undesired behavior.

## Next Steps

After learning about Dapr and some of the challenges it solves, try [Deploying an application with the Dapr cluster extension][dapr-quickstart].

<!-- Links Internal -->
[csi-secrets-store]: ./csi-secrets-store-driver.md
[osm-docs]: ./open-service-mesh-about.md
[cluster-extensions]: ./cluster-extensions.md
[dapr-quickstart]: ./quickstart-dapr.md
[dapr-migration]: ./dapr-migration.md
[aks-msi]: ./use-managed-identity.md

<!-- Links External -->
[dapr-docs]: https://docs.dapr.io/
[dapr-blocks]: https://docs.dapr.io/concepts/building-blocks-concept/
[dapr-msi]: https://docs.dapr.io/developing-applications/integrations/azure/azure-authentication
[dapr-pubsub]: https://docs.dapr.io/developing-applications/building-blocks/pubsub/pubsub-overview
[dapr-statemgmt]: https://docs.dapr.io/developing-applications/building-blocks/state-management/state-management-overview/
[dapr-serviceinvo]: https://docs.dapr.io/developing-applications/building-blocks/service-invocation/service-invocation-overview/
[dapr-bindings]: https://docs.dapr.io/developing-applications/building-blocks/bindings/bindings-overview/
[dapr-actors]: https://docs.dapr.io/developing-applications/building-blocks/actors/actors-overview/
[dapr-secrets]: https://docs.dapr.io/developing-applications/building-blocks/secrets/secrets-overview/
[dapr-config]: https://docs.dapr.io/developing-applications/building-blocks/configuration/
[dapr-subscriptions]: https://docs.dapr.io/developing-applications/building-blocks/pubsub/subscription-methods/#declarative-subscriptions