---
title: Configure registry endpoints in Azure IoT Operations
description: Learn how to configure registry endpoints for container registries in Azure IoT Operations data flow graphs.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-operations
ms.topic: how-to
ms.date: 12/16/2025
ai-usage: ai-assisted

#CustomerIntent: As an operator, I want to understand how to configure registry endpoints in Azure IoT Operations so that I can pull custom connectors, WASM modules, and graph definitions from container registries for use in data flow graphs and connectors.
---

# Configure registry endpoints

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

Data flow graphs and the HTTP/REST connector use registry endpoints to pull WebAssembly (WASM) modules and graph definitions from container registries. Azure IoT Operations pulls any custom connector templates you develop from container registries. You can configure the endpoint settings, authentication, and other settings to connect to Azure Container Registry (ACR) or other OCI-compatible registries such as:

- Docker Hub
- Harbor
- AWS Elastic Container Registry
- Google Container Registry

The examples in this article show how to configure a registry endpoint using ACR.

## Prerequisites

- An instance of [Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md), version 1.2 or later.
- Access to a container registry, such as ACR.

## Registry endpoint overview

A registry endpoint defines the connection details and authentication method for accessing a container registry. Registry endpoints are used by:

- **Data flow graphs**: To pull WASM modules and graph definitions for custom processing
- **HTTP/REST connector**: To pull WASM modules and graph definitions for custom processing
- **Akri connectors**: To pull custom connector templates

Registry endpoints support authentication through:
- System-assigned managed identity
- User-assigned managed identity
- Artifact pull secrets (username and password)
- Anonymous access (for public registries)

## Create a registry endpoint

A registry endpoint defines the connection to your container registry. Data flow graphs use registry endpoints to pull WASM modules and graph definitions from container registries. Azure IoT Operations uses registry endpoints to pull custom connector templates from container registries. You can create a registry endpoint using the Azure portal, Azure CLI, Bicep, or Kubernetes. After you create a registry endpoint:

- You can use any graphs you [pushed to your container registry](howto-deploy-wasm-graph-definitions.md#push-modules-to-your-registry) in the operations experience in data flow graphs.
- You can use any [custom connectors you pushed](howto-build-akri-connectors-vscode.md#publish-a-connector-image) to your container registry in the operations experience to create device inbound endpoints.

# [Azure portal](#tab/portal)

Use the Azure portal to create registry endpoints. The portal experience prompts you to specify and provide host details of an ACR, and optionally provide credentials. Before you begin, make sure you have the following information:

- Registry endpoint name.
- A host name for the ACR.
- Four types of authentication are supported:
  - Anonymous
  - System managed identity
  - User managed identity
  - Artifact secret

To create a registry endpoint in the Azure portal, follow these steps.

### Create registry endpoints with anonymous authentication

Create a new registry endpoint by specifying the host details of an ACR. Enable anonymous access for public image retrieval, and store the configuration for reuse. First, select the type of authentication you want to use. In this example, use anonymous authentication:

:::image type="content" source="media/howto-configure-registry-endpoint/select-authentication.png" alt-text="Screenshot of the select authentication form." lightbox="media/howto-configure-registry-endpoint/select-authentication.png":::

:::image type="content" source="media/howto-configure-registry-endpoint/authentication-anonymous.png" alt-text="Screenshot of the completed anonymous authentication configuration for registry endpoint." lightbox="media/howto-configure-registry-endpoint/authentication-anonymous.png":::

### Create registry endpoints with system managed identity authentication

Create a new registry endpoint by specifying the host details of an ACR. Authenticate by using a system-assigned managed identity for secure access, and store the configuration for reuse.

:::image type="content" source="media/howto-configure-registry-endpoint/system-managed-identity.png" alt-text="Screenshot of the completed system managed identity authentication configuration for registry endpoint." lightbox="media/howto-configure-registry-endpoint/system-managed-identity.png":::

### Create registry endpoints with user managed identity

Create a new registry endpoint by specifying the host details of an ACR. Authenticate by using a user-assigned managed identity for secure access. Store the configuration for reuse.

> [!NOTE]
> The client and tenant IDs are required to enable user managed identity. 

:::image type="content" source="media/howto-configure-registry-endpoint/user-managed-identity.png" alt-text="Screenshot of the completed user managed identity authentication configuration for registry endpoint." lightbox="media/howto-configure-registry-endpoint/user-managed-identity.png":::

### Create registry endpoints with artifact secrets

Use artifact secrets to authenticate with private container registries like ACR, Docker Hub, or MCR when pulling container images. Secrets are essential when the registry requires credentials and the image isn't publicly accessible. This scenario enables you to manage data flow graphs across Azure IoT Operations and the operations experience. You can set up artifact secrets from Microsoft Azure Key Vault by selecting existing secrets.

Create a new registry endpoint by specifying the host details of an ACR. Authenticate by using artifact secrets for secure access and store the configuration for reuse:

:::image type="content" source="media/howto-configure-registry-endpoint/secrets.png" alt-text="Screenshot of the Azure Key Vault secret selection interface for artifact secrets." lightbox="media/howto-configure-registry-endpoint/secrets.png":::

Set up artifact secrets from Azure Key Vault by creating new secrets and storing them in Azure Key Vault:

:::image type="content" source="media/howto-configure-registry-endpoint/secret-form.png" alt-text="Screenshot of the create new secret form in Azure Key Vault for artifact secrets." lightbox="media/howto-configure-registry-endpoint/secret-form.png":::

# [Bicep](#tab/bicep)

Create a Bicep `.bicep` file with the following content:

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

# [Kubernetes](#tab/kubernetes)

Create a Kubernetes manifest `.yaml` file with the following content:

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

> [!NOTE]
> You can reuse registry endpoints across multiple data flow graphs and other Azure IoT Operations components, like Akri connectors.

---

## Configuration options

This section describes the configuration options available for registry endpoints.

### Host

The `host` property specifies the container registry hostname. For ACR, use the format `<registry-name>.azurecr.io`. The host property supports HTTPS URLs or just the hostname.

**Examples**:
- `myregistry.azurecr.io`
- `https://myregistry.azurecr.io`

**Pattern**: Must match the pattern `^(https:\/\/)?[a-zA-Z0-9\-]+\.azurecr\.io$` for ACR.

### Authentication methods

Registry endpoints support several authentication methods to securely access container registries.

#### System-assigned managed identity

System-assigned managed identity uses the Azure IoT Operations instance's built-in identity to authenticate with the registry. Use this approach for ACR as it eliminates the need for managing credentials.

Before configuring the registry endpoint, ensure the Azure IoT Operations system-assigned managed identity has the necessary permissions:

1. In Azure portal, go to your Azure IoT Operations instance and select **Overview**.
1. Copy the name of the extension listed after **Azure IoT Operations Arc extension**. For example, *azure-iot-operations-xxxx7*.
1. Go to your container registry > **Access control (IAM)** > **Add role assignment**.
1. On the **Role** tab, select `AcrPull` role.
1. On the **Members** tab, for **Assign access to**, select **User, group, or service principal**, then select **+ Select members** and search for the Azure IoT Operations Arc extension name. Choose the extension and select **Select**.
1. Select **Review + assign** to complete the role assignment.


The following snippet shows how to configure system-assigned managed identity authentication in the Bicep file that configures the registry endpoint:

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

**System-assigned managed identity settings**:

| Property | Description | Required | Type |
|----------|-------------|----------|------|
| `audience` | Audience of the service to authenticate against. | No | String |
| `extensionName` | Specific extension name to use. | No | String |
| `tenantId` | Tenant ID for authentication. | No | String |

The operator attempts to infer the audience from the endpoint if you don't provide it. For ACR, the audience is typically `https://management.azure.com/`.

#### User-assigned managed identity

User-assigned managed identity allows you to use a specific managed identity that you create and configure with the necessary permissions.

Before configuring the registry endpoint, ensure the user-assigned managed identity has the `AcrPull` role on your container registry.

The following snippet shows how to configure user-assigned managed identity authentication in the Bicep file that configures the registry endpoint:

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

**User-assigned managed identity settings**:

| Property | Description | Required | Type |
|----------|-------------|----------|------|
| `clientId` | Client ID for the user-assigned managed identity. | Yes | String |
| `tenantId` | Tenant ID where the managed identity is located. | Yes | String |
| `scope` | Scope of the resource with `.default` suffix. | No | String |

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

The following snippet shows how to configure artifact pull secret authentication in the Bicep file that configures the registry endpoint:

```bicep
authentication: {
  method: 'ArtifactPullSecret'
  artifactPullSecretSettings: {
    secretRef: 'my-registry-secret'
  }
}
```

#### Anonymous authentication

Anonymous authentication is used for public registries that don't require authentication.

The following snippet shows how to configure anonymous authentication in the Bicep file that configures the registry endpoint:

```bicep
authentication: {
  method: 'Anonymous'
  anonymousSettings: {}
}
```

## Azure Container Registry integration

ACR is the recommended container registry for Azure IoT Operations. ACR provides secure, private Docker container registries with integrated authentication through Microsoft Entra ID (Entra ID).

### Prerequisites for ACR

1. **Create an ACR instance**: If you don't have one, create an ACR instance in your subscription.
1. **Configure permissions**: Ensure the Azure IoT Operations managed identity has `AcrPull` permissions on the registry.
1. **Push artifacts**: Upload your WASM modules and graph definitions to the registry using tools like ORAS CLI.

## Other container registries

Registry endpoints also support other OCI-compatible container registries such as:

- Docker Hub
- Harbor
- AWS Elastic Container Registry (ECR)
- Google Container Registry (GCR)

For these registries, you typically use artifact pull secrets for authentication, unless they support Azure managed identity.

## Next steps

- [Use WebAssembly (WASM) with data flow graphs](../connect-to-cloud/howto-dataflow-graph-wasm.md)
- [Configure data flow endpoints](../connect-to-cloud/howto-configure-dataflow-endpoint.md)
- [Configure data flow profiles](../connect-to-cloud/howto-configure-dataflow-profile.md)
