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

Azure AD workload identity works especially well with the [Azure SDK](https://azure.microsoft.com/downloads/) and the [Microsoft Authentication Library](../active-directory/develop/msal-overview.md) (MSAL) if you are using [application registration](../active-directory/develop/application-model.md#register-an-application). Your workload can leverage any of these libraries to seamlessly authenticate and access Azure cloud resources.

This article reviews the different options available depending if you are planning to deploy a new AKS cluster, or migrate an existing cluster that is configured with a pod-managed identity.

## Before you begin

- Azure AD Workload Identity supports Kubernetes version 1.24 and higher.

- The Azure CLI version 2.32.0 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

- The `aks-preview` extension version 0.5.102 or later.

## How it works

In this security model, the AKS cluster becomes a token issuer, issuing tokens to Kubernetes service accounts. These service account tokens can be configured to be trusted on Azure AD applications. The workload can exchange a service account token projected to its volume for an Azure AD token using the Azure Identity client library or the Microsoft Authentication Library.

:::image type="content" source="media/security-workload-identity-migration/aks-workload-identity-model.png" alt-text="Diagram of the AKS workload identity security model.":::

The following table describes the required OIDC issuer endpoints for Azure AD Workload Identity:

|Endpoint |Description |
|---------|------------|
|`{IssuerURL}/.well-known/openid-configuration` |Also known as the OIDC discovery document. This contains the metadata about the issuer's configurations. |
|`{IssuerURL}/openid/v1/jwks` |This contains the public signing key(s) that AAD uses to verify the authenticity of the service account token. |

:::image type="content" source="media/security-workload-identity-migration/aks-workload-identity-oidc-authentication-model.png" alt-text="Diagram of the AKS workload identity OIDC authentication sequence.":::

## How to migrate to Workload Identity

You can configure Workload Identity on a cluster that is currently running pod-managed identity. You can use the same configuration you have for pod-managed identity today, you just need to annotate the service account within the namespace with the identity so that Workload Identity can inject the annotations into the pods. Depending on which Azure Identity client library the application is using with pod-managed identity today, you have two approaches to run that application in Workload Identity.

To help streamline and ease the migration process, we've developed a migration sidecar that converts the IDMS transactions your application makes over to [OpenID Connect](../active-directory/develop/v2-protocols-oidc.md) (OIDC). This isn't intended to be a long-term solution, but a way to get up and running quickly on Workload Identity. Running a sidecar within your application proxies the application IMDS transactions over to OIDC. The alternative approach is to migrate your SDK to [Azure Identity](../active-directory/develop/reference-v2-libraries.md) client library version 1.6 or later, which supports OIDC authentication.

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

## How setup a new AKS cluster with Workload Identity

1. Create an AKS cluster using the [az aks create][az-aks-create] command with the `--enable-oidc-issuer` parameter to use the OIDC Issuer. The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*:

    ```azurecli
    az aks create -n aks -g myResourceGroup --enable-oidc-issuer --enable-workload-identity
    ```

2. To get the OIDC Issuer URL, run the following command:

    ```azurecli
        az aks show --resource-group myResourceGroup --name myAKSCluster --query "oidcIssuerProfile.issuerUrl" -otsv
    ```