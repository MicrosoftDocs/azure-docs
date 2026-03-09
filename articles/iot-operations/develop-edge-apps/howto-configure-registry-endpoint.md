---
title: Configure registry endpoints in Azure IoT Operations
description: Learn how to configure registry endpoints for container registries in Azure IoT Operations data flow graphs.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 02/20/2026
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure registry endpoints in Azure IoT Operations so that I can pull custom connectors, WASM modules, and graph definitions from container registries for use in data flow graphs and connectors.
---

# Configure registry endpoints

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

Data flow graphs and the HTTP/REST connector use registry endpoints to pull WebAssembly (WASM) modules and graph definitions from container registries. Azure IoT Operations pulls any custom connector templates you develop from container registries. You can configure the endpoint settings, authentication, and other settings to connect to Azure Container Registry (ACR) or other OCI-compatible registries such as:

- Docker Hub
- GitHub Container Registry (ghcr.io)
- Harbor
- AWS Elastic Container Registry
- Google Container Registry

## Prerequisites

- An instance of [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md), version 1.2 or later.
- Access to a container registry, such as ACR.

## Create a registry endpoint

A registry endpoint defines the connection to your container registry. Data flow graphs use registry endpoints to pull WASM modules and graph definitions. Azure IoT Operations uses registry endpoints to pull custom connector templates. After you create a registry endpoint:

- You can use any graphs you [pushed to your container registry](howto-deploy-wasm-graph-definitions.md#push-modules-to-your-registry) in the operations experience in data flow graphs.
- You can use any [custom connectors you pushed](howto-build-akri-connectors-vscode.md#publish-a-connector-image) to your container registry in the operations experience to create device inbound endpoints.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to your Azure IoT Operations instance.

1. Under **Components**, select **Registry endpoints**.

    :::image type="content" source="media/howto-configure-registry-endpoint/registry-endpoints-portal.png" alt-text="Screenshot of the Azure portal showing the Registry endpoints page under Components for an Azure IoT Operations instance." lightbox="media/howto-configure-registry-endpoint/registry-endpoints-portal.png":::

1. Select **+ Create a registry endpoint**.

1. Enter the following settings:

    | Setting | Description |
    |---------|-------------|
    | **Registry endpoint name** | A unique name for the registry endpoint. |
    | **Hostname** | The hostname of the container registry. For ACR, use the format `<registry-name>.azurecr.io`. For MCR, use `mcr.microsoft.com`. For details about the hostname format, see [Host](#host). |
    | **Authentication** | The authentication method. Choose from: [Anonymous](#anonymous-authentication), [Artifact secret](#artifact-pull-secret), [System managed identity](#system-assigned-managed-identity), or [User managed identity](#user-assigned-managed-identity). |

    > [!NOTE]
    > The Azure portal currently only accepts hostnames in the format `<your-registry-name>.azurecr.io` or `mcr.microsoft.com`. To use other registries like GitHub Container Registry (ghcr.io) or Docker Hub, use Bicep or Kubernetes to create the registry endpoint instead.

    :::image type="content" source="media/howto-configure-registry-endpoint/select-authentication.png" alt-text="Screenshot of the registry endpoint creation form showing name, host, and authentication options." lightbox="media/howto-configure-registry-endpoint/select-authentication.png":::

1. Configure the authentication settings for your selected method. For information about each method, see [Authentication methods](#authentication-methods).

1. Select **Create**.

# [Bicep](#tab/bicep)

Create a Bicep `.bicep` file with the following content. This example uses system-assigned managed identity authentication with ACR:

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param registryEndpointName string = '<REGISTRY_ENDPOINT_NAME>'
param acrName string = '<YOUR_ACR_NAME>'

resource aioInstance 'Microsoft.IoTOperations/instances@2025-10-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource registryEndpoint 'Microsoft.IoTOperations/instances/registryEndpoints@2025-10-01-preview' = {
  parent: aioInstance
  name: registryEndpointName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    host: '${acrName}.azurecr.io'
    authentication: {
      method: 'SystemAssignedManagedIdentity'
      systemAssignedManagedIdentitySettings: {
        audience: 'https://management.azure.com/'
      }
    }
  }
}
```

Deploy the Bicep file by using Azure CLI:

```azurecli
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

For other authentication methods, see [Authentication methods](#authentication-methods). To use a public registry like ghcr.io, see [Use a public registry](#use-a-public-registry).

# [Kubernetes (preview)](#tab/kubernetes)

Create a Kubernetes manifest `.yaml` file with the following content. This example uses system-assigned managed identity authentication with ACR:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: RegistryEndpoint
metadata:
  name: <REGISTRY_ENDPOINT_NAME>
  namespace: azure-iot-operations
spec:
  host: <YOUR_ACR_NAME>.azurecr.io
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: https://management.azure.com/
```

Apply the manifest file to the Kubernetes cluster:

```bash
kubectl apply -f <FILE>.yaml
```

For other authentication methods, see [Authentication methods](#authentication-methods). To use a public registry like ghcr.io, see [Use a public registry](#use-a-public-registry).

---

> [!NOTE]
> You can reuse registry endpoints across multiple data flow graphs and other Azure IoT Operations components, like Akri connectors.

## Configuration options

### Host

The `host` property specifies the container registry hostname and optional path prefix. For ACR, use the format `<registry-name>.azurecr.io`.

> [!IMPORTANT]
> The `host` field must include the full path prefix that matches your artifact references. For example, if your artifacts are at `ghcr.io/azure-samples/explore-iot-operations/temperature:1.0.0`, set `host` to `ghcr.io/azure-samples/explore-iot-operations` (not just `ghcr.io`). The runtime matches the host as a prefix against the artifact reference. If the host doesn't match, you see "No valid registry endpoint configuration found" in the WASM graph controller logs.

**Examples**:

- `myregistry.azurecr.io` (Azure Container Registry)
- `mcr.microsoft.com` (Microsoft Container Registry)
- `ghcr.io/azure-samples/explore-iot-operations` (GitHub Container Registry with path)
- `docker.io/myorg` (Docker Hub)

### Authentication methods

Registry endpoints support several authentication methods. The method you choose depends on your container registry and security requirements.

#### System-assigned managed identity

System-assigned managed identity uses the Azure IoT Operations instance's built-in identity to authenticate with the registry. Use this approach for ACR, because it eliminates the need for managing credentials.

Before configuring the registry endpoint, ensure the Azure IoT Operations system-assigned managed identity has the necessary permissions:

1. In Azure portal, go to your Azure IoT Operations instance and select **Overview**.
1. Copy the name of the extension listed after **Azure IoT Operations Arc extension**. For example, *azure-iot-operations-xxxx7*.
1. Go to your container registry > **Access control (IAM)** > **Add role assignment**.
1. On the **Role** tab, select `AcrPull` role.
1. On the **Members** tab, for **Assign access to**, select **User, group, or service principal**, then select **+ Select members** and search for the Azure IoT Operations Arc extension name. Choose the extension and select **Select**.
1. Select **Review + assign** to complete the role assignment.

# [Azure portal](#tab/portal)

In the Azure portal, select **System managed identity** as the authentication method when creating the registry endpoint.

:::image type="content" source="media/howto-configure-registry-endpoint/system-managed-identity.png" alt-text="Screenshot of the completed system managed identity authentication configuration for registry endpoint." lightbox="media/howto-configure-registry-endpoint/system-managed-identity.png":::

# [Bicep](#tab/bicep)

```bicep
authentication: {
  method: 'SystemAssignedManagedIdentity'
  systemAssignedManagedIdentitySettings: {
    audience: 'https://management.azure.com/'
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
spec:
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: https://management.azure.com/
```

---

| Property | Description | Required |
|----------|-------------|----------|
| `audience` | Audience of the service to authenticate against. | No |
| `extensionName` | Specific extension name to use. | No |
| `tenantId` | Tenant ID for authentication. | No |

The operator attempts to infer the audience from the endpoint if you don't provide it. For ACR, the audience is typically `https://management.azure.com/`.

#### User-assigned managed identity

User-assigned managed identity allows you to use a specific managed identity that you create and configure with the necessary permissions. Before configuring the registry endpoint, ensure the user-assigned managed identity has the `AcrPull` role on your container registry.

# [Azure portal](#tab/portal)

In the Azure portal, select **User managed identity** as the authentication method and enter the client ID and tenant ID.

> [!NOTE]
> The client and tenant IDs are required to enable user managed identity.

:::image type="content" source="media/howto-configure-registry-endpoint/user-managed-identity.png" alt-text="Screenshot of the completed user managed identity authentication configuration for registry endpoint." lightbox="media/howto-configure-registry-endpoint/user-managed-identity.png":::

# [Bicep](#tab/bicep)

```bicep
authentication: {
  method: 'UserAssignedManagedIdentity'
  userAssignedManagedIdentitySettings: {
    clientId: '<CLIENT_ID>'
    tenantId: '<TENANT_ID>'
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
spec:
  authentication:
    method: UserAssignedManagedIdentity
    userAssignedManagedIdentitySettings:
      clientId: <CLIENT_ID>
      tenantId: <TENANT_ID>
```

---

| Property | Description | Required |
|----------|-------------|----------|
| `clientId` | Client ID for the user-assigned managed identity. | Yes |
| `tenantId` | Tenant ID where the managed identity is located. | Yes |
| `scope` | Scope of the resource with `.default` suffix. | No |

The operator attempts to infer the scope from the endpoint if you don't provide it.

#### Artifact pull secret

Artifact pull secrets let you use username and password authentication for registries that don't support managed identity authentication.

First, create a Kubernetes secret that contains the registry credentials:

```bash
kubectl create secret docker-registry my-registry-secret \
  --docker-server=myregistry.azurecr.io \
  --docker-username=<USERNAME> \
  --docker-password=<PASSWORD> \
  -n azure-iot-operations
```

# [Azure portal](#tab/portal)

In the Azure portal, select **Artifact secret** as the authentication method. You can select existing secrets from Azure Key Vault or create new ones.

:::image type="content" source="media/howto-configure-registry-endpoint/secrets.png" alt-text="Screenshot of the Azure Key Vault secret selection interface for artifact secrets." lightbox="media/howto-configure-registry-endpoint/secrets.png":::

To create new secrets and store them in Azure Key Vault:

:::image type="content" source="media/howto-configure-registry-endpoint/secret-form.png" alt-text="Screenshot of the create new secret form in Azure Key Vault for artifact secrets." lightbox="media/howto-configure-registry-endpoint/secret-form.png":::

# [Bicep](#tab/bicep)

```bicep
authentication: {
  method: 'ArtifactPullSecret'
  artifactPullSecretSettings: {
    secretRef: 'my-registry-secret'
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
spec:
  authentication:
    method: ArtifactPullSecret
    artifactPullSecretSettings:
      secretRef: my-registry-secret
```

---

#### Anonymous authentication

Anonymous authentication is used for public registries that don't require credentials.

# [Azure portal](#tab/portal)

In the Azure portal, select **Anonymous** as the authentication method.

:::image type="content" source="media/howto-configure-registry-endpoint/authentication-anonymous.png" alt-text="Screenshot of the completed anonymous authentication configuration for registry endpoint." lightbox="media/howto-configure-registry-endpoint/authentication-anonymous.png":::

# [Bicep](#tab/bicep)

```bicep
authentication: {
  method: 'Anonymous'
  anonymousSettings: {}
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
spec:
  authentication:
    method: Anonymous
    anonymousSettings: {}
```

---

## Azure Container Registry integration

ACR is the recommended container registry for Azure IoT Operations. ACR provides secure, private Docker container registries with integrated authentication through Microsoft Entra ID.

### Prerequisites for ACR

1. **Create an ACR instance**: If you don't have one, create an ACR instance in your subscription.
1. **Configure permissions**: Ensure the Azure IoT Operations managed identity has `AcrPull` permissions on the registry.
1. **Push artifacts**: Upload your WASM modules and graph definitions to the registry using tools like ORAS CLI.

## Use a public registry

You can configure a registry endpoint to point directly at a public OCI-compatible registry. This approach lets you use prebuilt WASM modules and graph definitions without setting up your own private registry, which is ideal for getting started quickly or for evaluation.

> [!NOTE]
> The Azure portal currently only supports ACR and MCR hostnames when creating registry endpoints. To configure a registry endpoint for a public registry like ghcr.io, use Bicep or Kubernetes instead.

For example, the Azure IoT Operations sample WASM modules and graph definitions are published at `ghcr.io/azure-samples/explore-iot-operations`. You can create a registry endpoint that points directly to this public registry by using anonymous authentication.

# [Azure portal](#tab/portal)

The Azure portal doesn't currently support creating registry endpoints for public registries other than MCR. Use the Bicep or Kubernetes tab instead.

# [Bicep](#tab/bicep)

```bicep
resource publicRegistryEndpoint 'Microsoft.IoTOperations/instances/registryEndpoints@2025-10-01-preview' = {
  parent: aioInstance
  name: 'public-ghcr'
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    host: 'ghcr.io/azure-samples/explore-iot-operations'
    authentication: {
      method: 'Anonymous'
      anonymousSettings: {}
    }
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: RegistryEndpoint
metadata:
  name: public-ghcr
  namespace: azure-iot-operations
spec:
  host: ghcr.io/azure-samples/explore-iot-operations
  authentication:
    method: Anonymous
    anonymousSettings: {}
```

---

After you create this registry endpoint, you can reference it in your data flow graph as `registryEndpointRef: public-ghcr`. No ORAS pull/push steps are needed because the runtime pulls the artifacts directly from the public registry.

> [!NOTE]
> Public registries don't require authentication, but they may have rate limits. For production workloads, consider using a private registry like Azure Container Registry.

## Other container registries

Registry endpoints support any OCI-compatible container registry, including Docker Hub, GitHub Container Registry (ghcr.io), Harbor, AWS Elastic Container Registry (ECR), and Google Container Registry (GCR). For public registries, use [anonymous authentication](#anonymous-authentication). For private registries, use [artifact pull secrets](#artifact-pull-secret) or managed identity authentication as appropriate.

## Next steps

- [Use WebAssembly (WASM) with data flow graphs](../connect-to-cloud/howto-dataflow-graph-wasm.md)
- [Configure data flow endpoints](../connect-to-cloud/howto-configure-dataflow-endpoint.md)
- [Configure data flow profiles](../connect-to-cloud/howto-configure-dataflow-profile.md)
