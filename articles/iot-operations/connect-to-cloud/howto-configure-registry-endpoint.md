---
title: Configure registry endpoints in Azure IoT Operations
description: Learn how to configure registry endpoints for container registries in Azure IoT Operations data flow graphs.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 12/17/2025
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure registry endpoints in Azure IoT Operations so that I can pull WASM modules and graph definitions from container registries.
---

# Configure registry endpoints

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

Data flow graphs use registry endpoints to pull WebAssembly (WASM) modules and graph definitions from container registries. You can configure the endpoint settings, authentication, and other settings to connect to Azure Container Registry (ACR) or other OCI-compatible registries.

## Prerequisites

- An instance of [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md), version 1.2 or later
- Access to a container registry, such as Azure Container Registry

## Registry endpoint overview

A registry endpoint defines the connection details and authentication method for accessing a container registry. Registry endpoints are used by:

- **Data flow graphs**: To pull WASM modules and graph definitions
- **Akri connectors**: To pull custom connector templates

Registry endpoints support authentication through:
- System-assigned managed identity
- User-assigned managed identity
- Artifact pull secrets (username and password)
- Anonymous access (for public registries)

## Create a registry endpoint

You can create a registry endpoint using Bicep or Kubernetes.

> [!IMPORTANT]
> Currently, there's a known issue when using registry endpoint resources with Akri connectors. For more information, see [Akri connectors don't work with registry endpoint resources](../troubleshoot/known-issues.md#akri-connectors-dont-work-with-registry-endpoint-resources).

<!-- 
# [Operations experience](#tab/portal)

1. In the [operations experience](https://iotoperations.azure.com/), select **Registry endpoints**.
1. Select **Create registry endpoint**.

    :::image type="content" source="media/howto-configure-registry-endpoint/create-registry-endpoint.png" alt-text="Screenshot using operations experience to create a registry endpoint.":::

1. Enter the following settings for the registry endpoint:

    | Setting | Description |
    |---------|-------------|
    | Name | A unique name for the registry endpoint. |
    | Host | The container registry hostname. For Azure Container Registry, use the format `<registry-name>.azurecr.io`. |
    | Authentication method | The method used for authentication. Choose from system-assigned managed identity, user-assigned managed identity, artifact pull secret, or anonymous. |

1. Select **Create** to provision the endpoint.

# [Azure CLI](#tab/cli)

Use the [az iot ops registry-endpoint create](/cli/azure/iot/ops/registry-endpoint#az-iot-ops-registry-endpoint-create) command to create a registry endpoint.

```azurecli
az iot ops registry-endpoint create --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <EndpointName> --host <RegistryHost> --auth-type <AuthType>
```

Here's an example command to create a registry endpoint for Azure Container Registry with system-assigned managed identity:

```azurecli
az iot ops registry-endpoint create --resource-group myResourceGroup --instance myAioInstance --name my-acr-endpoint --host myregistry.azurecr.io --auth-type SystemAssignedManagedIdentity
```
-->

# [Bicep](#tab/bicep)

Create a Bicep `.bicep` file with the following content:

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'
param registryEndpointName string = '<REGISTRY_ENDPOINT_NAME>'
param registryHost string = '<REGISTRY_HOST>' // For example, myregistry.azurecr.io

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource registryEndpoint 'Microsoft.IoTOperations/instances/registryEndpoints@2025-07-01-preview' = {
  parent: aioInstance
  name: registryEndpointName
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    host: registryHost
    authentication: {
      method: 'SystemAssignedManagedIdentity'
      systemAssignedManagedIdentitySettings: {
        audience: 'https://management.azure.com/'
      }
    }
  }
}
```

Deploy the Bicep file using Azure CLI:

```azurecli
az deployment group create --resource-group <RESOURCE_GROUP> --template-file <FILE>.bicep
```

# [Kubernetes (preview)](#tab/kubernetes)

Create a Kubernetes manifest `.yaml` file with the following content:

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: RegistryEndpoint
metadata:
  name: <REGISTRY_ENDPOINT_NAME>
  namespace: azure-iot-operations
spec:
  host: <REGISTRY_HOST>
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: https://management.azure.com/
```

Apply the manifest file to the Kubernetes cluster:

```bash
kubectl apply -f <FILE>.yaml
```

---

## Configuration options

This section describes the configuration options available for registry endpoints.

### Host

The `host` property specifies the container registry hostname. For Azure Container Registry, use the format `<registry-name>.azurecr.io`. The host property supports HTTPS URLs or just the hostname.

**Examples**:
- `myregistry.azurecr.io`
- `https://myregistry.azurecr.io`

**Pattern**: Must match the pattern `^(https:\/\/)?[a-zA-Z0-9\-]+\.azurecr\.io$` for Azure Container Registry.

### Authentication methods

Registry endpoints support several authentication methods to securely access container registries.

#### System-assigned managed identity

System-assigned managed identity uses the Azure IoT Operations instance's built-in identity to authenticate with the registry. This is the recommended approach for Azure Container Registry as it eliminates the need for managing credentials.

Before configuring the registry endpoint, ensure the Azure IoT Operations system-assigned managed identity has the necessary permissions:

1. In Azure portal, go to your Azure IoT Operations instance and select **Overview**.
1. Copy the name of the extension listed after **Azure IoT Operations Arc extension**. For example, *azure-iot-operations-xxxx7*.
1. Go to your container registry > **Access control (IAM)** > **Add role assignment**.
1. On the **Role** tab, select `AcrPull` role.
1. On the **Members** tab, for **Assign access to**, select **User, group, or service principal**, then select **+ Select members** and search for the Azure IoT Operations Arc extension name. Choose the extension and select **Select**.
1. Select **Review + assign** to complete the role assignment.

<!-- 
# [Operations experience](#tab/portal)

In the registry endpoint settings, select **System assigned managed identity** as the authentication method.

# [Azure CLI](#tab/cli)

```azurecli
az iot ops registry-endpoint create --resource-group myResourceGroup --instance myAioInstance --name my-acr-endpoint --host myregistry.azurecr.io --auth-type SystemAssignedManagedIdentity --audience https://management.azure.com/
```
-->

# [Bicep](#tab/bicep)

```bicep
authentication: {
  method: 'SystemAssignedManagedIdentity'
  systemAssignedManagedIdentitySettings: {
    audience: 'https://management.azure.com/'
    extensionName: null  // Optional: specific extension name
    tenantId: null       // Optional: specific tenant ID
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
authentication:
  method: SystemAssignedManagedIdentity
  systemAssignedManagedIdentitySettings:
    audience: https://management.azure.com/
    extensionName:  # Optional: specific extension name
    tenantId:       # Optional: specific tenant ID
```

---

**System-assigned managed identity settings**:

| Property | Description | Required | Type |
|----------|-------------|----------|------|
| `audience` | Audience of the service to authenticate against. | No | String |
| `extensionName` | Specific extension name to use. | No | String |
| `tenantId` | Tenant ID for authentication. | No | String |

The operator attempts to infer the audience from the endpoint if not provided. For Azure Container Registry, the audience is typically `https://management.azure.com/`.

#### User-assigned managed identity

User-assigned managed identity allows you to use a specific managed identity that you've created and configured with the necessary permissions.

Before configuring the registry endpoint, ensure the user-assigned managed identity has the `AcrPull` role on your container registry.

<!-- 
# [Operations experience](#tab/portal)

In the registry endpoint settings:
1. Select **User assigned managed identity** as the authentication method.
1. Enter the **Client ID** of your user-assigned managed identity.
1. Enter the **Tenant ID** where the managed identity is located.

# [Azure CLI](#tab/cli)

```azurecli
az iot ops registry-endpoint create --resource-group myResourceGroup --instance myAioInstance --name my-acr-endpoint --host myregistry.azurecr.io --auth-type UserAssignedManagedIdentity --client-id <CLIENT_ID> --tenant-id <TENANT_ID>
```
-->

# [Bicep](#tab/bicep)

```bicep
authentication: {
  method: 'UserAssignedManagedIdentity'
  userAssignedManagedIdentitySettings: {
    clientId: '<CLIENT_ID>'
    tenantId: '<TENANT_ID>'
    scope: null  // Optional: specific scope
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
authentication:
  method: UserAssignedManagedIdentity
  userAssignedManagedIdentitySettings:
    clientId: <CLIENT_ID>
    tenantId: <TENANT_ID>
    scope:  # Optional: specific scope
```

---

**User-assigned managed identity settings**:

| Property | Description | Required | Type |
|----------|-------------|----------|------|
| `clientId` | Client ID for the user-assigned managed identity. | Yes | String |
| `tenantId` | Tenant ID where the managed identity is located. | Yes | String |
| `scope` | Scope of the resource with `.default` suffix. | No | String |

The operator attempts to infer the scope from the endpoint if not provided.

#### Artifact pull secret

Artifact pull secrets lets you use username and password authentication for registries that don't support managed identity authentication.

First, create a Kubernetes secret containing the registry credentials:

```bash
kubectl create secret docker-registry my-registry-secret \
  --docker-server=myregistry.azurecr.io \
  --docker-username=<USERNAME> \
  --docker-password=<PASSWORD> \
  -n azure-iot-operations
```

<!-- 
# [Operations experience](#tab/portal)

> [!IMPORTANT]
> To use the operations experience web UI to manage secrets, Azure IoT Operations must first be enabled with secure settings by configuring an Azure Key Vault and enabling workload identities. To learn more, see [Enable secure settings in Azure IoT Operations deployment](../deploy-iot-ops/howto-enable-secure-settings.md).

In the registry endpoint settings:
1. Select **Artifact pull secret** as the authentication method.
1. Select or create a secret that contains the registry credentials.

# [Azure CLI](#tab/cli)

```azurecli
az iot ops registry-endpoint create --resource-group myResourceGroup --instance myAioInstance --name my-acr-endpoint --host myregistry.azurecr.io --auth-type ArtifactPullSecret --secret-name my-registry-secret
```
-->

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
authentication:
  method: ArtifactPullSecret
  artifactPullSecretSettings:
    secretRef: my-registry-secret
```

---

#### Anonymous authentication

Anonymous authentication is used for public registries that don't require authentication.

<!-- 
# [Operations experience](#tab/portal)

In the registry endpoint settings, select **Anonymous** as the authentication method.

# [Azure CLI](#tab/cli)

```azurecli
az iot ops registry-endpoint create --resource-group myResourceGroup --instance myAioInstance --name public-registry-endpoint --host registry.docker.io --auth-type Anonymous
```
-->

# [Bicep](#tab/bicep)

```bicep
authentication: {
  method: 'Anonymous'
  anonymousSettings: {}
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
authentication:
  method: Anonymous
  anonymousSettings: {}
```

---

## Azure Container Registry integration

Azure Container Registry (ACR) is the recommended container registry for Azure IoT Operations. ACR provides secure, private Docker container registries with integrated authentication through Microsoft Entra ID.

### Prerequisites for ACR

1. **Create an ACR instance**: If you don't have one, create an Azure Container Registry instance in your subscription.
1. **Configure permissions**: Ensure the Azure IoT Operations managed identity has `AcrPull` permissions on the registry.
1. **Push artifacts**: Upload your WASM modules and graph definitions to the registry using tools like ORAS CLI.

### ACR configuration example

Here's a complete example for configuring an ACR registry endpoint:

# [Bicep](#tab/bicep)

```bicep
param aioInstanceName string = 'my-aio-instance'
param customLocationName string = 'my-custom-location'
param acrName string = 'myregistry'

resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource acrRegistryEndpoint 'Microsoft.IoTOperations/instances/registryEndpoints@2025-07-01-preview' = {
  parent: aioInstance
  name: 'acr-endpoint'
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

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1beta1
kind: RegistryEndpoint
metadata:
  name: acr-endpoint
  namespace: azure-iot-operations
spec:
  host: myregistry.azurecr.io
  authentication:
    method: SystemAssignedManagedIdentity
    systemAssignedManagedIdentitySettings:
      audience: https://management.azure.com/
```

---

<!-- TODO: Check if supported -->

## Other container registries

Registry endpoints also support other OCI-compatible container registries such as:

- Docker Hub
- Harbor
- AWS Elastic Container Registry (ECR)
- Google Container Registry (GCR)

For these registries, you typically use artifact pull secrets for authentication, unless they support Azure managed identity.

## Next steps

- [Use WebAssembly (WASM) with data flow graphs](howto-dataflow-graph-wasm.md)
- [Configure data flow endpoints](howto-configure-dataflow-endpoint.md)
- [Configure data flow profiles](howto-configure-dataflow-profile.md)
