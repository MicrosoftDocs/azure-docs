---
title: Migrate your application to use an Azure AD workload identities (preview) on Azure Kubernetes Service (AKS)
description: Learn how migrate your application to use an Azure Active Directory workload identity (preview) in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 09/13/2022
author: mgoedtel

---

# Migrate your application to use an Azure AD workload identity (preview)

Today with Azure Kubernetes Service (AKS), you can assign [managed identities at the pod-level][use-azure-ad-pod-identity], which has been a preview feature. This pod-managed identity allows the hosted workload or application access to resources through Azure Active Directory (Azure AD). For example, a workload stores files in Azure Storage, and when it needs to access those files, the pod authenticates itself against the resource as an Azure managed identity. This authentication method has been replaced with [Azure Active Directory (Azure AD) workload identities][azure-ad-workload-identity], which integrates with the Kubernetes native capabilities to federate with any external identity providers. This approach is simpler to use and deploy, and overcomes several limitations in Azure AD pod-managed identity:

- Removes the scale and performance issues that existed for identity assignment
- Supports Kubernetes clusters hosted in any cloud or on-premises
- Supports both Linux and Windows workloads
- Removes the need for Custom Resource Definitions and pods that intercept [Azure Instance Metadata Service][azure-instance-metadata-service] (IMDS) traffic
- Avoids the complicated and error-prone installation steps such as cluster role assignment from the previous iteration.

Azure AD Workload Identity works especially well with the [Azure SDK][azure-sdk-download] and the [Microsoft Authentication Library][microsoft-authentication-library] (MSAL) if you are using [application registration][azure-ad-application-registration]. Your workload can use any of these libraries to seamlessly authenticate and access Azure cloud resources.

This article reviews the options available to help you plan your migration phases and project strategy.

## Before you begin

- Kubernetes supports Azure AD workload identities on version 1.24 and higher.

- The Azure CLI version 2.32.0 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

- The `aks-preview` extension version 0.5.102 or later.

- [Azure Identity][azure-identity-libraries] client library version 1.6 or later.

## Limitations

- You can only have 20 federated identities.
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

If you've used an Azure AD pod-identity, think of a service account as an Azure Identity, except a service account is part of the core Kubernetes API, rather than a CRD. The following describe a list of available labels and annotations that can be used to configure the behavior when exchanging the service account token for an Azure AD access token.

### Service account labels

|Label |Description |Recommended value |Required |
|------|------------|------------------|---------|
|`azure.workload.identity/use` |Represents the service account<br> is to be used for workload identity. |true |Yes |

### Service account annotations

|Annotation |Description |Default |
|-----------|------------|--------|
|`azure.workload.identity/client-id` |Represents the Azure AD application<br> client ID to be used with the pod. ||
|`azure.workload.identity/tenant-id` |Represents the Azure tenant ID where the<br> Azure AD application is registered. |AZURE_TENANT_ID environment variable extracted<br> from `azure-wi-webhook-config` ConfigMap.|
|`azure.workload.identity/service-account-token-expiration` |Represents the `expirationSeconds` field for the<br> projected service account token. It is an optional field that you configure to prevent downtime<br> caused by errors during service account token refresh. Kubernetes service account token expiry are not correlated with Azure AD tokens. Azure AD tokens expire in 24 hours after they are issued. |3600<br> Supported range is 3600-86400.|

### Pod annotations

|Annotation |Description |Default |
|-----------|------------|--------|
|`azure.workload.identity/service-account-token-expiration` |Represents the `expirationSeconds` field for the projected service account token. It's an optional field that you configure to prevent any downtime caused by errors during service account token refresh. Kubernetes service account token expiry are not correlated with Azure AD tokens. Azure AD tokens expire in 24 hours after they are issued. <sup>1</sup> |3600<br> Supported range is 3600-86400. |
|`azure.workload.identity/skip-containers` |Represents a semi-colon-separated list of containers to skip adding projected service account token volume. For example `container1;container2`. |By default, the projected service account token volume is added to all containers if the service account is labeled with `azure.workload.identity/use: true`. |
|`azure.workload.identity/inject-proxy-sidecar` |Injects a proxy init container and proxy sidecar into the pod. The proxy sidecar is used to intercept token requests to IMDS and acquire an Azure AD token on behalf of the user with federated identity credential. |true |
|`azure.workload.idenityt/proxy-sidecar-port` |Represents the port of the proxy sidecar. |8080 |

 <sup>1</sup> Takes precedence if the service account is also annotated.

## How to migrate to workload identity

You can configure workload identity on a cluster that is currently running pod-managed identity. You can use the same configuration you've implemented for pod-managed identity today, you just need to annotate the service account within the namespace with the identity. This enables workload identity to inject the annotations into the pods. Depending on which Azure Identity client library the application is using with pod-managed identity already, you have two approaches to run that application using a workload identity.

To help streamline and ease the migration process, we've developed a migration sidecar that converts the IDMS transactions your application makes over to [OpenID Connect][openid-connect-overview] (OIDC). This isn't intended to be a long-term solution, but a way to get up and running quickly on workload identity. Running the migration sidecar within your application proxies the application IMDS transactions over to OIDC. The alternative approach is to upgrade to [Azure Identity][azure-identity-libraries] client library version 1.6 or later, which supports OIDC authentication.

The following table summarizes our migration or deployment recommendations for workload identity.

|Scenario |Description |
|---------|------------|
| New or existing cluster deployment<br> running Azure Identity v1.6 | No migration steps are required.<br><br> Sample deployment resources:<br><br> <ul><li> [Deploy and configure workload identity on a new cluster][deploy-configure-workload-identity-new-cluster]</ul></li> <ul><li>[Quickstart: Use a workload identity with an application on AKS][quickstart-use-workload-identity] |
| New or existing cluster deployment<br> not running Azure Identity v1.6 | Update container image and deploy, or update using new image version, or use the [migration sidecar][deploy-migration-sidecar]. |

## Upgrade cluster to use workload identity

## Next steps

<!-- EXTERNAL LINKS -->
[azure-sdk-download]: https://azure.microsoft.com/downloads/

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
[quickstart-use-workload-identity]: ./learn/quick-kubernetes-workload-identity.md
[deploy-migration-sidecar]: workload-identity-migration-sidecar.md