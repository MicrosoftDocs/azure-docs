---
title: Dapr extension for Azure Kubernetes Service (AKS) overview
description: Learn more about using Dapr on your Azure Kubernetes Service (AKS) cluster to develop applications.
ms.author: nickoman
ms.topic: article
ms.date: 07/07/2023
ms.custom: event-tier1-build-2022
---

# Dapr

[Distributed Application Runtime (Dapr)][dapr-docs] offers APIs that help you write and implement simple, portable, resilient, and secured microservices. Running as a sidecar process in tandem with your applications, Dapr APIs abstract away common complexities you may encounter when building distributed applications, such as:
- Service discovery
- Message broker integration
- Encryption
- Observability
- Secret management 

Dapr is incrementally adoptable. You can use any of the API building blocks as needed.

:::image type="content" source="./media/dapr-overview/dapr-building-blocks.png" alt-text="Diagram showing how many different code frameworks can interface with the various building blocks of Dapr via HTTP or gRPC." lightbox="./media/dapr-overview/dapr-building-blocks.png":::

## Capabilities and features

Dapr provides the following set of capabilities to help with your microservice development on AKS:

- Easy provisioning of Dapr on AKS through [cluster extensions][cluster-extensions].
- Portability enabled through HTTP and gRPC APIs which abstract underlying technologies choices
- Reliable, secure, and resilient service-to-service calls through HTTP and gRPC APIs
- Publish and subscribe messaging made easy with support for CloudEvent filtering and “at-least-once” semantics for message delivery
- Pluggable observability and monitoring through Open Telemetry API collector
- Works independent of language, while also offering language specific SDKs
- Integration with VS Code through the Dapr extension
- [More APIs for solving distributed application challenges][dapr-blocks]

## Frequently asked questions

### How do Dapr and Service meshes compare?

A: Where a service mesh is defined as a networking service mesh, Dapr is not a service mesh. While Dapr and service meshes do offer some overlapping capabilities, a service mesh is focused on networking concerns, whereas Dapr is focused on providing building blocks that make it easier for developers to build applications as microservices. Dapr is developer-centric, while service meshes are infrastructure-centric.  

Some common capabilities that Dapr shares with service meshes include:

- Secure service-to-service communication with mTLS encryption
- Service-to-service metric collection
- Service-to-service distributed tracing
- Resiliency through retries

In addition, Dapr provides other application-level building blocks for state management, pub/sub messaging, actors, and more. However, Dapr does not provide capabilities for traffic behavior such as routing or traffic splitting. If your solution would benefit from the traffic splitting a service mesh provides, consider using [Open Service Mesh][osm-docs].  

For more information on Dapr and service meshes, and how they can be used together, visit the [Dapr documentation][dapr-docs].

### How does the Dapr secrets API compare to the Secrets Store CSI driver?

Both the Dapr secrets API and the managed Secrets Store CSI driver allow for the integration of secrets held in an external store, abstracting secret store technology from application code. The Secrets Store CSI driver mounts secrets held in Azure Key Vault as a CSI volume for consumption by an application. Dapr exposes secrets via a RESTful API that can be called by application code and can be configured with assorted secret stores. The following table lists the capabilities of each offering:

| | Dapr secrets API | Secrets Store CSI driver |
| --- | --- | ---|
| **Supported secrets stores** | Local environment variables (for Development); Local file (for Development); Kubernetes Secrets; AWS Secrets Manager; Azure Key Vault secret store; Azure Key Vault with Managed Identities on Kubernetes; GCP Secret Manager; HashiCorp Vault | Azure Key Vault secret store|
| **Accessing secrets in application code** | Call the Dapr secrets API | Access the mounted volume or sync mounted content as a Kubernetes secret and set an environment variable |
| **Secret rotation** | New API calls obtain the updated secrets | Polls for secrets and updates the mount at a configurable interval |
| **Logging and metrics** | The Dapr sidecar generates logs, which can be configured with collectors such as Azure Monitor, emits metrics via Prometheus, and exposes an HTTP endpoint for health checks | Emits driver and Azure Key Vault provider metrics via Prometheus |

For more information on the secret management in Dapr, see the [secrets management building block overview][dapr-secrets-block].

For more information on the Secrets Store CSI driver and Azure Key Vault provider, see the [Secrets Store CSI driver overview][csi-secrets-store].

### How does the managed Dapr cluster extension compare to the open source Dapr offering?

The managed Dapr cluster extension is the easiest method to provision Dapr on an AKS cluster. With the extension, you're able to offload management of the Dapr runtime version by opting into automatic upgrades. Additionally, the extension installs Dapr with smart defaults (for example, provisioning the Dapr control plane in high availability mode).

When installing Dapr OSS via helm or the Dapr CLI, runtime versions and configuration options are the responsibility of developers and cluster maintainers.  

Lastly, the Dapr extension is an extension of AKS, therefore you can expect the same support policy as other AKS features.

[Learn more about migrating from Dapr OSS to the Dapr extension for AKS][dapr-migration].

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
[dapr-secrets-block]: https://docs.dapr.io/developing-applications/building-blocks/secrets/secrets-overview/
[dapr-msi]: https://docs.dapr.io/developing-applications/integrations/azure/azure-authentication
