---
title: Migrate your application to use an Azure AD Workload Identity on Azure Kubernetes Service (AKS)
description: Learn how migrate your application to use an Azure Active Directory Workload Identity in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 09/07/2022
author: mgoedtel

---

# Migrate your application to use an Azure AD workload identity

Today with Azure Kubernetes Service (AKS), you can assign [managed identities at the pod-level](use-azure-ad-pod-identity.md). This pod-managed identity allows the hosted workload or application access to resources through Azure Active Directory (Azure AD). For example, a workload stores files in Azure Storage, and when it needs to access those files, the pod authenticates itself against the resource as an Azure managed identity. This authentication method has been replaced with [Azure Active Directory (Azure AD) workload identities](../active-directory/develop/workload-identities-overview.md), which integrates with the Kubernetes native capabilities to federate with any external identity providers. This approach is simpler to use and deploy, and overcomes several limitations in Azure AD pod identity:

- Removes the scale and performance issues that existed for identity assignment
- Supports Kubernetes clusters hosted in any cloud or on-premises
- Supports both Linux and Windows workloads
- Removes the need for Custom Resource Definitions and pods that intercept [Azure Instance Metadata Service](../virtual-machines/linux/instance-metadata-service.md) (IMDS) traffic
- Avoids the complicated and error-prone installation steps such as cluster role assignment from the previous iteration.

Azure AD workload identity works especially well with the [Azure SDK](https://azure.microsoft.com/downloads/) and the [Microsoft Authentication Library](../active-directory/develop/msal-overview.md) (MSAL) if you are using [application registration](../active-directory/develop/application-model.md#register-an-application). Your workload can use any of these libraries to seamlessly authenticate and access Azure cloud resources.

This article reviews the options available to help you plan your migration phases and project strategy.

## Before you begin

- Azure AD Workload Identity supports Kubernetes version 1.24 and higher.

- The Azure CLI version 2.32.0 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

- The `aks-preview` extension version 0.5.102 or later.

- [Azure Identity](../active-directory/develop/reference-v2-libraries.md) client library version 1.6 or later.

## How it works

In this security model, the AKS cluster acts as token issuer, Azure Active Directory uses OpenID Connect to discover public signing keys and verify the authenticity of the service account token before exchanging it for an Azure AD token. Your workload can exchange a service account token projected to its volume for an Azure AD token using the Azure Identity client library or the Microsoft Authentication Library.

:::image type="content" source="media/security-workload-identity-migration/aks-workload-identity-model.png" alt-text="Diagram of the AKS workload identity security model.":::

The following table describes the required OIDC issuer endpoints for Azure AD Workload Identity:

|Endpoint |Description |
|---------|------------|
|`{IssuerURL}/.well-known/openid-configuration` |Also known as the OIDC discovery document. This contains the metadata about the issuer's configurations. |
|`{IssuerURL}/openid/v1/jwks` |This contains the public signing key(s) that AAD uses to verify the authenticity of the service account token. |

The following diagram summarizes the authentication sequence using OpenID Connect.

:::image type="content" source="media/security-workload-identity-migration/aks-workload-identity-oidc-authentication-model.png" alt-text="Diagram of the AKS workload identity OIDC authentication sequence.":::

## Service account labels and annotations

Azure AD Workload Identity supports the following mappings related to a service account:

- One-to-one where a service account references an Azure AD object.
- Many-to-one where multiple service accounts references the same Azure AD object.
- One-to-many where a service account references multiple Azure AD objects by changing the client ID annotation.

> [!NOTE]
> If the service account annotations are updated, you need to restart the pod for the changes to take effect.

If you've used an Azure AD pod-identity, think of a service account as an Azure identity, except a service account is part of the core Kubernetes API, rather than a CRD. The following describe a list of available labels and annotations that can be used to configure the behavior when exchanging the service account token for an Azure AD access token.

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

## How to migrate to Workload Identity

You can configure Workload Identity on a cluster that is currently running pod-managed identity. You can use the same configuration you've implemented for pod-managed identity today, you just need to annotate the service account within the namespace with the identity. This enables Workload Identity to inject the annotations into the pods. Depending on which Azure Identity client library the application is using with pod-managed identity already, you have two approaches to run that application using a Workload Identity.

The following table summarizes our migration or deployment recommendations for Workload Identity.

|Scenario |Description |
|---------|------------|
| New or existing cluster deployment<br> running Azure Identity v1.6 | No migration steps are required. |
| New or existing cluster deployment<br> not running Azure Identity v1.6 | Update container image and deploy, or update using new image version, or use the migration sidecar. |

To help streamline and ease the migration process, we've developed a migration sidecar that converts the IDMS transactions your application makes over to [OpenID Connect](../active-directory/develop/v2-protocols-oidc.md) (OIDC). This isn't intended to be a long-term solution, but a way to get up and running quickly on Workload Identity. Running the migration sidecar within your application proxies the application IMDS transactions over to OIDC. The alternative approach is to upgrade to [Azure Identity](../active-directory/develop/reference-v2-libraries.md) client library version 1.6 or later, which supports OIDC authentication.

### Managed Identity with Workload Identity sidecar

```yml
apiVersion: v1
kind: Pod
metadata:
  name: httpbin-pod
  labels:
    app: httpbin
spec:
  serviceAccountName: workload-identity-sa
  initContainers:
  - name: init-networking
    image: mcr.microsoft.com/oss/azure/workload-identity/proxy-init:v0.13.0
    securityContext:
      capabilities:
        add:
        - NET_ADMIN
        drop:
        - ALL
      privileged: true
      runAsUser: 0
    env:
    - name: PROXY_PORT
      value: "8000"
  containers:
  - name: nginx
    image: nginx:alpine
    ports:
    - containerPort: 80
  - name: proxy
    image: mcr.microsoft.com/oss/azure/workload-identity/proxy:v0.13.0
    ports:
    - containerPort: 8000
```

## How set up a new AKS cluster with Workload Identity

If your application is already running [Azure Identity](../active-directory/develop/reference-v2-libraries.md) client library version 1.6 or later, you can follow the steps below to create a new cluster with Workload Identity enabled. You can then install your application. If you are not running the minimum supported SDK version, you can upgrade and then deploy, or deploy the migration sidecar.

### Deploy a new cluster with Workload Identity

1. Create an AKS cluster using the [az aks create][az-aks-create] command with the `--enable-oidc-issuer` parameter to use the OIDC Issuer. The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*:

    ```azurecli
    az aks create -n aks -g myResourceGroup --enable-oidc-issuer --enable-workload-identity
    ```

2. To get the OIDC Issuer URL, run the following command:

    ```azurecli
        az aks show --resource-group myResourceGroup --name myAKSCluster --query "oidcIssuerProfile.issuerUrl" -otsv
    ```