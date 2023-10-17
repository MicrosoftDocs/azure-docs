---
title: Use a Microsoft Entra Workload ID on Azure Kubernetes Service (AKS)
description: Learn about Microsoft Entra Workload ID for Azure Kubernetes Service (AKS) and how to migrate your application to authenticate using this identity.  
ms.topic: article
ms.custom: build-2023
ms.date: 09/13/2023
---

# Use Microsoft Entra Workload ID with Azure Kubernetes Service (AKS)

Workloads deployed on an Azure Kubernetes Services (AKS) cluster require Microsoft Entra application credentials or managed identities to access Microsoft Entra protected resources, such as Azure Key Vault and Microsoft Graph. Microsoft Entra Workload ID integrates with the capabilities native to Kubernetes to federate with external identity providers.

[Microsoft Entra Workload ID][azure-ad-workload-identity] uses [Service Account Token Volume Projection][service-account-token-volume-projection] enabling pods to use a Kubernetes identity (that is, a service account). A Kubernetes token is issued and [OIDC federation][oidc-federation] enables Kubernetes applications to access Azure resources securely with Microsoft Entra ID based on annotated service accounts.

Microsoft Entra Workload ID works especially well with the [Azure Identity client libraries](#azure-identity-client-libraries) and the [Microsoft Authentication Library][microsoft-authentication-library] (MSAL) collection if you're using [application registration][azure-ad-application-registration]. Your workload can use any of these libraries to seamlessly authenticate and access Azure cloud resources.

This article helps you understand this new authentication feature, and reviews the options available to plan your project strategy and potential migration from Microsoft Entra pod-managed identity.

## Dependencies

- AKS supports Microsoft Entra Workload ID on version 1.22 and higher.
- The Azure CLI version 2.47.0 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Azure Identity client libraries

In the Azure Identity client libraries, choose one of the following approaches:

- Use `DefaultAzureCredential`, which attempts to use the `WorkloadIdentityCredential`.
- Create a `ChainedTokenCredential` instance that includes `WorkloadIdentityCredential`.
- Use `WorkloadIdentityCredential` directly.

The following table provides the **minimum** package version required for each language ecosystem's client library.

| Ecosystem | Library                                                                                                          | Minimum version |
|-----------|------------------------------------------------------------------------------------------------------------------|-----------------|
| .NET      | [Azure.Identity](/dotnet/api/overview/azure/identity-readme)                                                     | 1.9.0           |
| C++       | [azure-identity-cpp](https://github.com/Azure/azure-sdk-for-cpp/blob/main/sdk/identity/azure-identity/README.md) | 1.6.0-beta.2    |
| Go        | [azidentity](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity)                                | 1.3.0           |
| Java      | [azure-identity](/java/api/overview/azure/identity-readme)                                                       | 1.9.0           |
| Node.js   | [@azure/identity](/javascript/api/overview/azure/identity-readme)                                                | 3.2.0           |
| Python    | [azure-identity](/python/api/overview/azure/identity-readme)                                                     | 1.13.0          |

In the following code samples, `DefaultAzureCredential` is used. This credential type uses the environment variables injected by the Azure Workload Identity mutating webhook to authenticate with Azure Key Vault.

## [.NET](#tab/dotnet)

```csharp
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

string keyVaultUrl = Environment.GetEnvironmentVariable("KEYVAULT_URL");
string secretName = Environment.GetEnvironmentVariable("SECRET_NAME");

var client = new SecretClient(
    new Uri(keyVaultUrl),
    new DefaultAzureCredential());

KeyVaultSecret secret = await client.GetSecretAsync(secretName);
```

## [C++](#tab/cpp)

```cpp
#include <cstdlib>
#include <azure/identity.hpp>
#include <azure/keyvault/secrets/secret_client.hpp>

using namespace Azure::Identity;
using namespace Azure::Security::KeyVault::Secrets;

int main()
{
  const char* keyVaultUrl = std::getenv("KEYVAULT_URL");
  const char* secretName = std::getenv("SECRET_NAME");
  auto credential = std::make_shared<DefaultAzureCredential>();

  SecretClient client(keyVaultUrl, credential);
  Secret secret = client.GetSecret(secretName).Value;

  return 0;
}
```

## [Go](#tab/go)

```go
package main

import (
	"context"
	"os"

	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/security/keyvault/azsecrets"
    "k8s.io/klog/v2"
)

func main() {
	keyVaultUrl := os.Getenv("KEYVAULT_URL")
	secretName := os.Getenv("SECRET_NAME")

	credential, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		klog.Fatal(err)
	}

	client, err := azsecrets.NewClient(keyVaultUrl, credential, nil)
	if err != nil {
		klog.Fatal(err)
	}

	secret, err := client.GetSecret(context.Background(), secretName, "", nil)
	if err != nil {
		klog.ErrorS(err, "failed to get secret", "keyvault", keyVaultUrl, "secretName", secretName)
		os.Exit(1)
	}
}
```

## [Java](#tab/java)

```java
import java.util.Map;

import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;
import com.azure.security.keyvault.secrets.models.KeyVaultSecret;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.identity.DefaultAzureCredential;

public class App {
    public static void main(String[] args) {
        Map<String, String> env = System.getenv();
        String keyVaultUrl = env.get("KEYVAULT_URL");
        String secretName = env.get("SECRET_NAME");

        SecretClient client = new SecretClientBuilder()
                .vaultUrl(keyVaultUrl)
                .credential(new DefaultAzureCredentialBuilder().build())
                .buildClient();
        KeyVaultSecret secret = client.getSecret(secretName);
    }
}
```

## [Node.js](#tab/javascript)

```nodejs
import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

const main = async () => {
    const keyVaultUrl = process.env["KEYVAULT_URL"];
    const secretName = process.env["SECRET_NAME"];

    const credential = new DefaultAzureCredential();
    const client = new SecretClient(keyVaultUrl, credential);

    const secret = await client.getSecret(secretName);
}

main().catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
});
```

## [Python](#tab/python)

```python
import os

from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

def main():
    keyvault_url = os.getenv('KEYVAULT_URL', '')
    secret_name = os.getenv('SECRET_NAME', '')

    client = SecretClient(vault_url=keyvault_url, credential=DefaultAzureCredential())
    secret = client.get_secret(secret_name)

if __name__ == '__main__':
    main()
```

---

## Microsoft Authentication Library (MSAL)

The following client libraries are the **minimum** version required.

| Ecosystem | Library | Image | Example | Has Windows |
|-----------|-----------|----------|----------|----------|
| .NET | [Microsoft Authentication Library-for-dotnet](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) | `ghcr.io/azure/azure-workload-identity/msal-net:latest` | [Link](https://github.com/Azure/azure-workload-identity/tree/main/examples/msal-net/akvdotnet) | Yes |
| Go | [Microsoft Authentication Library-for-go](https://github.com/AzureAD/microsoft-authentication-library-for-go) | `ghcr.io/azure/azure-workload-identity/msal-go:latest` | [Link](https://github.com/Azure/azure-workload-identity/tree/main/examples/msal-go) | Yes |
| Java | [Microsoft Authentication Library-for-java](https://github.com/AzureAD/microsoft-authentication-library-for-java) | `ghcr.io/azure/azure-workload-identity/msal-java:latest` | [Link](https://github.com/Azure/azure-workload-identity/tree/main/examples/msal-java) | No |
| JavaScript | [Microsoft Authentication Library-for-js](https://github.com/AzureAD/microsoft-authentication-library-for-js) | `ghcr.io/azure/azure-workload-identity/msal-node:latest` | [Link](https://github.com/Azure/azure-workload-identity/tree/main/examples/msal-node) | No |
| Python | [Microsoft Authentication Library-for-python](https://github.com/AzureAD/microsoft-authentication-library-for-python) | `ghcr.io/azure/azure-workload-identity/msal-python:latest` | [Link](https://github.com/Azure/azure-workload-identity/tree/main/examples/msal-python) | No |

## Limitations

- You can only have [20 federated identity credentials][general-federated-identity-credential-considerations] per managed identity.
- It takes a few seconds for the federated identity credential to be propagated after being initially added.
- [Virtual nodes][aks-virtual-nodes] add on, based on the open source project [Virtual Kubelet][virtual-kubelet], isn't supported.
- Creation of federated identity credentials is not supported on user-assigned managed identities in these [regions.][unsupported-regions-user-assigned-managed-identities]

## How it works

In this security model, the AKS cluster acts as token issuer, Microsoft Entra ID uses OpenID Connect to discover public signing keys and verify the authenticity of the service account token before exchanging it for a Microsoft Entra token. Your workload can exchange a service account token projected to its volume for a Microsoft Entra token using the Azure Identity client library or the Microsoft Authentication Library.

:::image type="content" source="media/workload-identity-overview/aks-workload-identity-model.png" alt-text="Diagram of the AKS workload identity security model.":::

The following table describes the required OIDC issuer endpoints for Microsoft Entra Workload ID:

|Endpoint |Description |
|---------|------------|
|`{IssuerURL}/.well-known/openid-configuration` |Also known as the OIDC discovery document. This contains the metadata about the issuer's configurations. |
|`{IssuerURL}/openid/v1/jwks` |This contains the public signing key(s) that Microsoft Entra ID uses to verify the authenticity of the service account token. |

The following diagram summarizes the authentication sequence using OpenID Connect.

:::image type="content" source="media/workload-identity-overview/aks-workload-identity-oidc-authentication-model.png" alt-text="Diagram of the AKS workload identity OIDC authentication sequence.":::

### Webhook Certificate Auto Rotation

Similar to other webhook addons, the certificate is rotated by cluster certificate [auto rotation][auto-rotation] operation.

## Service account labels and annotations

Microsoft Entra Workload ID supports the following mappings related to a service account:

- One-to-one where a service account references a Microsoft Entra object.
- Many-to-one where multiple service accounts references the same Microsoft Entra object.
- One-to-many where a service account references multiple Microsoft Entra objects by changing the client ID annotation. For more information, see [How to federate multiple identities with a Kubernetes service account][multiple-identities].

> [!NOTE]
> If the service account annotations are updated, you need to restart the pod for the changes to take effect.

If you've used [Microsoft Entra pod-managed identity][use-azure-ad-pod-identity], think of a service account as an Azure Identity, except a service account is part of the core Kubernetes API, rather than a [Custom Resource Definition][custom-resource-definition] (CRD). The following describes a list of available labels and annotations that can be used to configure the behavior when exchanging the service account token for a Microsoft Entra access token.

### Service account annotations

All annotations are optional. If the annotation isn't specified, the default value will be used.

|Annotation |Description |Default |
|-----------|------------|--------|
|`azure.workload.identity/client-id` |Represents the Microsoft Entra application<br> client ID to be used with the pod. ||
|`azure.workload.identity/tenant-id` |Represents the Azure tenant ID where the<br> Microsoft Entra application is registered. |AZURE_TENANT_ID environment variable extracted<br> from `azure-wi-webhook-config` ConfigMap.|
|`azure.workload.identity/service-account-token-expiration` |Represents the `expirationSeconds` field for the<br> projected service account token. It's an optional field that you configure to prevent downtime<br> caused by errors during service account token refresh. Kubernetes service account token expiry isn't correlated with Microsoft Entra tokens. Microsoft Entra tokens expire in 24 hours after they're issued. |3600<br> Supported range is 3600-86400.|

### Pod labels

> [!NOTE]
> For applications using workload identity, it's required to add the label `azure.workload.identity/use: "true"` to the pod spec for AKS to move workload identity to a *Fail Close* scenario to provide a consistent and reliable behavior for pods that need to use workload identity. Otherwise the pods fail after their restarted.

|Label |Description |Recommended value |Required |
|------|------------|------------------|---------|
|`azure.workload.identity/use` | This label is required in the pod template spec. Only pods with this label are mutated by the azure-workload-identity mutating admission webhook to inject the Azure specific environment variables and the projected service account token volume. |true |Yes |

### Pod annotations

All annotations are optional. If the annotation isn't specified, the default value will be used.

|Annotation |Description |Default |
|-----------|------------|--------|
|`azure.workload.identity/service-account-token-expiration` |Represents the `expirationSeconds` field for the projected service account token. It's an optional field that you configure to prevent any downtime caused by errors during service account token refresh. Kubernetes service account token expiry isn't correlated with Microsoft Entra tokens. Microsoft Entra tokens expire in 24 hours after they're issued. <sup>1</sup> |3600<br> Supported range is 3600-86400. |
|`azure.workload.identity/skip-containers` |Represents a semi-colon-separated list of containers to skip adding projected service account token volume. For example, `container1;container2`. |By default, the projected service account token volume is added to all containers if the service account is labeled with `azure.workload.identity/use: true`. |
|`azure.workload.identity/inject-proxy-sidecar` |Injects a proxy init container and proxy sidecar into the pod. The proxy sidecar is used to intercept token requests to IMDS and acquire a Microsoft Entra token on behalf of the user with federated identity credential. |true |
|`azure.workload.identity/proxy-sidecar-port` |Represents the port of the proxy sidecar. |8000 |

 <sup>1</sup> Takes precedence if the service account is also annotated.

## How to migrate to workload identity

On a cluster that is already running a pod-managed identity, you can configure it to use workload identity one of two ways. The first option allows you to use the same configuration you've implemented for pod-managed identity today. You just need to annotate the service account within the namespace with the identity, and it enables workload identity to inject the annotations into the pods.

The second option is to rewrite your application to use the latest version of the Azure Identity client library.

To help streamline and ease the migration process, we've developed a migration sidecar that converts the IMDS transactions your application makes over to [OpenID Connect][openid-connect-overview] (OIDC). The migration sidecar isn't intended to be a long-term solution, but a way to get up and running quickly on workload identity. Running the migration sidecar within your application proxies the application IMDS transactions over to OIDC. The alternative approach is to upgrade to a supported version of the [Azure Identity][azure-identity-libraries] client library, which supports OIDC authentication.

The following table summarizes our migration or deployment recommendations for workload identity.

|Scenario |Description |
|---------|------------|
| New or existing cluster deployment [runs a supported version][azure-identity-libraries] of Azure Identity client library | No migration steps are required.<br> Sample deployment resources:<br> - [Deploy and configure workload identity on a new cluster][deploy-configure-workload-identity-new-cluster]<br> - [Tutorial: Use a workload identity with an application on AKS][tutorial-use-workload-identity] |
| New or existing cluster deployment runs an unsupported version of Azure Identity client library| Update container image to use a supported version of the Azure Identity SDK, or use the [migration sidecar][workload-identity-migration-sidecar]. |

## Next steps

* To learn how to set up your pod to authenticate using a workload identity as a migration option, see [Modernize application authentication with workload identity][workload-identity-migration-sidecar].
* See the tutorial [Use a workload identity with an application on Azure Kubernetes Service (AKS)][tutorial-use-workload-identity], which helps you deploy an Azure Kubernetes Service cluster and configure a sample application to use a workload identity.

<!-- EXTERNAL LINKS -->
[custom-resource-definition]: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
[service-account-token-volume-projection]: https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection
[oidc-federation]: https://kubernetes.io/docs/reference/access-authn-authz/authentication/#openid-connect-tokens
[multiple-identities]: https://azure.github.io/azure-workload-identity/docs/faq.html#how-to-federate-multiple-identities-with-a-kubernetes-service-account
[virtual-kubelet]: https://virtual-kubelet.io/docs/

<!-- INTERNAL LINKS -->
[use-azure-ad-pod-identity]: use-azure-ad-pod-identity.md
[azure-ad-workload-identity]: ../active-directory/develop/workload-identities-overview.md
[microsoft-authentication-library]: ../active-directory/develop/msal-overview.md
[azure-ad-application-registration]: ../active-directory/develop/application-model.md#register-an-application
[install-azure-cli]: /cli/azure/install-azure-cli
[azure-identity-libraries]: ../active-directory/develop/reference-v2-libraries.md
[openid-connect-overview]: ../active-directory/develop/v2-protocols-oidc.md
[deploy-configure-workload-identity-new-cluster]: workload-identity-deploy-cluster.md
[tutorial-use-workload-identity]: ./learn/tutorial-kubernetes-workload-identity.md
[workload-identity-migration-sidecar]: workload-identity-migrate-from-pod-identity.md
[auto-rotation]: certificate-rotation.md#certificate-auto-rotation
[aks-virtual-nodes]: virtual-nodes.md
[unsupported-regions-user-assigned-managed-identities]: ../active-directory/workload-identities/workload-identity-federation-considerations.md#unsupported-regions-user-assigned-managed-identities
[general-federated-identity-credential-considerations]: ../active-directory/workload-identities/workload-identity-federation-considerations.md#general-federated-identity-credential-considerations
