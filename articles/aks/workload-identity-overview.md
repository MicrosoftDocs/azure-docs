---
title: Use an Azure AD workload identities (preview) on Azure Kubernetes Service (AKS)
description: Learn about Azure Active Directory workload identity (preview) for Azure Kubernetes Service (AKS) and how to migrate your application to authenticate using this identity.  
ms.topic: article
ms.date: 03/14/2023

---

# Use Azure AD workload identity (preview) with Azure Kubernetes Service (AKS)

Today with Azure Kubernetes Service (AKS), you can assign [managed identities at the pod-level][use-azure-ad-pod-identity], which has been a preview feature. This pod-managed identity allows the hosted workload or application access to resources through Azure Active Directory (Azure AD). For example, a workload stores files in Azure Storage, and when it needs to access those files, the pod authenticates itself against the resource as an Azure managed identity. This authentication method has been replaced with [Azure Active Directory (Azure AD) workload identities][azure-ad-workload-identity] (preview), which integrate with the Kubernetes native capabilities to federate with any external identity providers. This approach is simpler to use and deploy, and overcomes several limitations in Azure AD pod-managed identity:

- Removes the scale and performance issues that existed for identity assignment
- Supports Kubernetes clusters hosted in any cloud or on-premises
- Supports both Linux and Windows workloads
- Removes the need for Custom Resource Definitions and pods that intercept [Azure Instance Metadata Service][azure-instance-metadata-service] (IMDS) traffic
- Avoids the complicated and error-prone installation steps such as cluster role assignment from the previous iteration

Azure AD workload identity works especially well with the Azure Identity client library using the [Azure SDK][azure-sdk-download] and the [Microsoft Authentication Library][microsoft-authentication-library] (MSAL) if you're using [application registration][azure-ad-application-registration]. Your workload can use any of these libraries to seamlessly authenticate and access Azure cloud resources.

This article helps you understand this new authentication feature, and reviews the options available to plan your migration phases and project strategy.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Dependencies

- AKS supports Azure AD workload identities on version 1.22 and higher.

- The Azure CLI version 2.40.0 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

- The `aks-preview` extension version 0.5.102 or later.

- The following are the minimum versions of the [Azure Identity][azure-identity-libraries] client library supported:

    * [.NET][dotnet-azure-identity-client-library] 1.5.0
    * [Java][java-azure-identity-client-library] 1.4.0
    * [JavaScript][javascript-azure-identity-client-library] 2.0.0
    * [Python][python-azure-identity-client-library] 1.7.0

## Limitations

- You can only have 20 federated identity credentials per managed identity.
- It takes a few seconds for the federated identity credential to be propagated after being initially added.

## How it works

In this security model, the AKS cluster acts as token issuer, Azure Active Directory uses OpenID Connect to discover public signing keys and verify the authenticity of the service account token before exchanging it for an Azure AD token. Your workload can exchange a service account token projected to its volume for an Azure AD token using the Azure Identity client library or the Microsoft Authentication Library.

:::image type="content" source="media/workload-identity-overview/aks-workload-identity-model.png" alt-text="Diagram of the AKS workload identity security model.":::

The following table describes the required OIDC issuer endpoints for Azure AD workload identity:

|Endpoint |Description |
|---------|------------|
|`{IssuerURL}/.well-known/openid-configuration` |Also known as the OIDC discovery document. This contains the metadata about the issuer's configurations. |
|`{IssuerURL}/openid/v1/jwks` |This contains the public signing key(s) that Azure AD uses to verify the authenticity of the service account token. |

The following diagram summarizes the authentication sequence using OpenID Connect.

:::image type="content" source="media/workload-identity-overview/aks-workload-identity-oidc-authentication-model.png" alt-text="Diagram of the AKS workload identity OIDC authentication sequence.":::

## Service account labels and annotations

Azure AD workload identity supports the following mappings related to a service account:

- One-to-one where a service account references an Azure AD object.
- Many-to-one where multiple service accounts references the same Azure AD object.
- One-to-many where a service account references multiple Azure AD objects by changing the client ID annotation.

> [!NOTE]
> If the service account annotations are updated, you need to restart the pod for the changes to take effect.

If you've used [Azure AD pod-managed identity][use-azure-ad-pod-identity], think of a service account as an Azure Identity, except a service account is part of the core Kubernetes API, rather than a [Custom Resource Definition][custom-resource-definition] (CRD). The following describes a list of available labels and annotations that can be used to configure the behavior when exchanging the service account token for an Azure AD access token.

### Service account labels

|Label |Description |Recommended value |Required |
|------|------------|------------------|---------|
|`azure.workload.identity/use` |Represents the service account<br> is to be used for workload identity. |true |Yes |

### Service account annotations

|Annotation |Description |Default |
|-----------|------------|--------|
|`azure.workload.identity/client-id` |Represents the Azure AD application<br> client ID to be used with the pod. ||
|`azure.workload.identity/tenant-id` |Represents the Azure tenant ID where the<br> Azure AD application is registered. |AZURE_TENANT_ID environment variable extracted<br> from `azure-wi-webhook-config` ConfigMap.|
|`azure.workload.identity/service-account-token-expiration` |Represents the `expirationSeconds` field for the<br> projected service account token. It's an optional field that you configure to prevent downtime<br> caused by errors during service account token refresh. Kubernetes service account token expiry isn't correlated with Azure AD tokens. Azure AD tokens expire in 24 hours after they're issued. |3600<br> Supported range is 3600-86400.|

### Pod labels

> [!NOTE]
> For applications using Workload Identity it is now required to add the label 'azure.workload.identity/use: "true"' pod label in order for AKS to move Workload Identity to a "Fail Close" scenario before GA to provide a consistent and reliable behavior for pods that need to use workload identity. 

|Label |Description |Recommended value |Required |
|------|------------|------------------|---------|
|`azure.workload.identity/use` | Represents the pod is to be used for workload identity. |true |Yes |

### Pod annotations

|Annotation |Description |Default |
|-----------|------------|--------|
|`azure.workload.identity/use` |Represents the service account<br> is to be used for workload identity. |  |
|`azure.workload.identity/service-account-token-expiration` |Represents the `expirationSeconds` field for the projected service account token. It's an optional field that you configure to prevent any downtime caused by errors during service account token refresh. Kubernetes service account token expiry isn't correlated with Azure AD tokens. Azure AD tokens expire in 24 hours after they're issued. <sup>1</sup> |3600<br> Supported range is 3600-86400. |
|`azure.workload.identity/skip-containers` |Represents a semi-colon-separated list of containers to skip adding projected service account token volume. For example `container1;container2`. |By default, the projected service account token volume is added to all containers if the service account is labeled with `azure.workload.identity/use: true`. |
|`azure.workload.identity/inject-proxy-sidecar` |Injects a proxy init container and proxy sidecar into the pod. The proxy sidecar is used to intercept token requests to IMDS and acquire an Azure AD token on behalf of the user with federated identity credential. |true |
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
[azure-sdk-download]: https://azure.microsoft.com/downloads/
[custom-resource-definition]: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/

<!-- INTERNAL LINKS -->
[use-azure-ad-pod-identity]: use-azure-ad-pod-identity.md
[azure-ad-workload-identity]: ../active-directory/develop/workload-identities-overview.md
[azure-instance-metadata-service]: ../virtual-machines/linux/instance-metadata-service.md
[microsoft-authentication-library]: ../active-directory/develop/msal-overview.md
[azure-ad-application-registration]: ../active-directory/develop/application-model.md#register-an-application
[install-azure-cli]: /cli/azure/install-azure-cli
[azure-identity-libraries]: ../active-directory/develop/reference-v2-libraries.md
[openid-connect-overview]: ../active-directory/develop/v2-protocols-oidc.md
[deploy-configure-workload-identity-new-cluster]: workload-identity-deploy-cluster.md
[tutorial-use-workload-identity]: ./learn/tutorial-kubernetes-workload-identity.md
[workload-identity-migration-sidecar]: workload-identity-migrate-from-pod-identity.md
[dotnet-azure-identity-client-library]: /dotnet/api/overview/azure/identity-readme
[java-azure-identity-client-library]: /java/api/overview/azure/identity-readme
[javascript-azure-identity-client-library]: /javascript/api/overview/azure/identity-readme
[python-azure-identity-client-library]: /python/api/overview/azure/identity-readme
