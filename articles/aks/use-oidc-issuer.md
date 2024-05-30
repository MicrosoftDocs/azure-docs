---
title: Create an OpenID Connect provider for your AKS cluster
description: Learn how to configure the OpenID Connect (OIDC) provider for a cluster in Azure Kubernetes Service (AKS).
author: tamram

ms.author: tamram
ms.topic: article
ms.subservice: aks-security
ms.custom: devx-track-azurecli
ms.date: 05/13/2024
---

# Create an OpenID Connect provider on Azure Kubernetes Service (AKS)

[OpenID Connect][open-id-connect-overview] (OIDC) extends the OAuth 2.0 authorization protocol for use as another authentication protocol issued by Microsoft Entra ID. You can use OIDC to enable single sign-on (SSO) between OAuth-enabled applications on your Azure Kubernetes Service (AKS) cluster by using a security token called an ID token. With your AKS cluster, you can enable the OpenID Connect (OIDC) issuer, which allows Microsoft Entra ID, or another cloud provider's identity and access management platform, to discover the API server's public signing keys.

AKS rotates the key automatically and periodically. If you don't want to wait, you can rotate the key manually and immediately. The maximum lifetime of the token issued by the OIDC provider is one day.

> [!WARNING]
> Enabling the OIDC issuer on an existing cluster changes the current service account token issuer to a new value, which can cause down time as it restarts the API server. If your application pods using a service token remain in a failed state after you enable the OIDC issuer, we recommend you manually restart the pods.

In this article, you learn how to create, update, and manage the OIDC issuer for your cluster.

> [!IMPORTANT]
> After you enable the OIDC issuer on the cluster, disabling it is not supported.
> 
> The token needs to be refreshed periodically. If you use the [SDK][sdk], the rotation is automatic. Otherwise, you need to refresh the token manually every 24 hours.

## Prerequisites

* The Azure CLI version 2.42.0 or higher. Run `az --version` to find your version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].
* AKS supports the OIDC issuer on version 1.22 and higher.

## Create an AKS cluster with the OIDC issuer

You can create an AKS cluster using the [az aks create][az-aks-create] command with the `--enable-oidc-issuer` parameter to enable the OIDC issuer. The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*:

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --node-count 1 --enable-oidc-issuer
```

## Update an AKS cluster with OIDC issuer

You can update an AKS cluster using the [az aks update][az-aks-update] command with the `--enable-oidc-issuer` parameter to enable the OIDC issuer. The following example updates a cluster named *myAKSCluster*:

```azurecli-interactive
az aks update --resource-group myResourceGroup --name myAKSCluster --enable-oidc-issuer 
```

## Show the OIDC issuer URL

To get the OIDC issuer URL, run the [az aks show][az-aks-show] command. Replace the default values for the cluster name and the resource group name.

```azurecli-interactive
az aks show --name myAKScluster --resource-group myResourceGroup --query "oidcIssuerProfile.issuerUrl" -o tsv
```

By default, the issuer is set to use the base URL `https://{region}.oic.prod-aks.azure.com`, where the value for `{region}` matches the location the AKS cluster is deployed in.

## Rotate the OIDC key

To rotate the OIDC key, run the [az aks oidc-issuer][az-aks-oidc-issuer] command. Replace the default values for the cluster name and the resource group name.

```azurecli-interactive
az aks oidc-issuer rotate-signing-keys --name myAKSCluster --resource-group myResourceGroup
```

> [!IMPORTANT]
> Once you rotate the key, the old key (key1) expires after 24 hours. Both the old key (key1) and the new key (key2) are valid within the 24-hour period after rotation. If you want to invalidate the old key (key1) immediately, you must rotate the OIDC key twice and restart the pods using projected service account tokens. With this process, key2 and key3 are valid, and key1 is invalid.

## Check the OIDC keys

### Get the OIDC issuer URL

To get the OIDC issuer URL, run the [az aks show][az-aks-show] command. Replace the default values for the cluster name and the resource group name.

```azurecli-interactive
az aks show --name myAKScluster --resource-group myResourceGroup --query "oidcIssuerProfile.issuerUrl" -o tsv
```

The output should resemble the following:

```output
https://eastus.oic.prod-aks.azure.com/00000000-0000-0000-0000-000000000000/11111111-1111-1111-1111-111111111111/
```

By default, the issuer is set to use the base URL `https://{region}.oic.prod-aks.azure.com/{tenant_id}/{uuid}`, where the value for `{region}` matches the location the AKS cluster is deployed in. The value `{uuid}` represents the OIDC key, which is a randomly generated guid for each cluster that is immutable.

### Get the discovery document

To get the discovery document, copy the URL `https://(OIDC issuer URL).well-known/openid-configuration` and open it in browser.

The output should resemble the following:

```output
{
  "issuer": "https://eastus.oic.prod-aks.azure.com/00000000-0000-0000-0000-000000000000/00000000-0000-0000-0000-000000000000/",
  "jwks_uri": "https://eastus.oic.prod-aks.azure.com/00000000-0000-0000-0000-000000000000/00000000-0000-0000-0000-000000000000/openid/v1/jwks",
  "response_types_supported": [
    "id_token"
  ],
  "subject_types_supported": [
    "public"
  ],
  "id_token_signing_alg_values_supported": [
    "RS256"
  ]
}
```

### Get the JWK Set document

To get the JWK Set document, copy the `jwks_uri` from the discovery document and past it in your browser's address bar.

The output should resemble the following:

```output
{
  "keys": [
    {
      "use": "sig",
      "kty": "RSA",
      "kid": "xxx",
      "alg": "RS256",
      "n": "xxxx",
      "e": "AQAB"
    },
    {
      "use": "sig",
      "kty": "RSA",
      "kid": "xxx",
      "alg": "RS256",
      "n": "xxxx",
      "e": "AQAB"
    }
  ]
}
```

During key rotation, there's one other key present in the discovery document.

## Next steps

* See [configure creating a trust relationship between an app and an external identity provider](../active-directory/develop/workload-identity-federation-create-trust.md) to understand how a federated identity credential creates a trust relationship between an application on your cluster and an external identity provider.
* Review [Microsoft Entra Workload ID][azure-ad-workload-identity-overview] (preview). This authentication method integrates with the Kubernetes native capabilities to federate with any external identity providers on behalf of the application.
* See [Secure pod network traffic][secure-pod-network-traffic] to understand how to use the Network Policy engine and create Kubernetes network policies to control the flow of traffic between pods in AKS.

<!-- LINKS - external -->

<!-- LINKS - internal -->
[open-id-connect-overview]: ../active-directory/fundamentals/auth-oidc.md
[sdk]: workload-identity-overview.md#azure-identity-client-libraries
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-aks-oidc-issuer]: /cli/azure/aks/oidc-issuer
[azure-ad-workload-identity-overview]: workload-identity-overview.md
[secure-pod-network-traffic]: use-network-policies.md
