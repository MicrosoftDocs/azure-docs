---
title: Create an OpenID Connect provider for your Azure Kubernetes Service (AKS) cluster
description: Learn how to configure the OpenID Connect (OIDC) provider for a cluster in Azure Kubernetes Service (AKS)
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 07/26/2023
---

# Create an OpenID Connect provider on Azure Kubernetes Service (AKS)

[OpenID Connect][open-id-connect-overview] (OIDC) extends the OAuth 2.0 authorization protocol for use as an additional authentication protocol issued by Microsoft Entra ID. You can use OIDC to enable single sign-on (SSO) between your OAuth-enabled applications, on your Azure Kubernetes Service (AKS) cluster, by using a security token called an ID token. With your AKS cluster, you can enable OpenID Connect (OIDC) Issuer, which allows Microsoft Entra ID or other cloud provider identity and access management platform, to discover the API server's public signing keys.

AKS rotates the key automatically and periodically. If you don't want to wait, you can rotate the key manually and immediately. The maximum lifetime of the token issued by the OIDC provider is one day.

> [!WARNING]
> Enable OIDC Issuer on existing cluster changes the current service account token issuer to a new value, which can cause down time and restarts the API server. If your application pods using a service token remain in a failed state after you enable the OIDC Issuer, we recommend you manually restart the pods.

In this article, you learn how to create, update, and manage the OIDC Issuer for your cluster.

> [!IMPORTANT]
> After enabling OIDC issuer on the cluster, it's not supported to disable it.

## Prerequisites

* The Azure CLI version 2.42.0 or higher. Run `az --version` to find your version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].
* AKS supports OIDC Issuer on version 1.22 and higher.

## Create an AKS cluster with OIDC Issuer

You can create an AKS cluster using the [az aks create][az-aks-create] command with the `--enable-oidc-issuer` parameter to use the OIDC Issuer. The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*:

```azurecli-interactive
az aks create -g myResourceGroup -n myAKSCluster --node-count 1 --enable-oidc-issuer
```

## Update an AKS cluster with OIDC Issuer

You can update an AKS cluster using the [az aks update][az-aks-update] command with the `--enable-oidc-issuer` parameter to use the OIDC Issuer. The following example updates a cluster named *myAKSCluster*:

```azurecli-interactive
az aks update -g myResourceGroup -n myAKSCluster --enable-oidc-issuer 
```

## Show the OIDC Issuer URL

To get the OIDC Issuer URL, run the [az aks show][az-aks-show] command. Replace the default values for the cluster name and the resource group name.

```azurecli-interactive
az aks show -n myAKScluster -g myResourceGroup --query "oidcIssuerProfile.issuerUrl" -otsv
```

By default, the Issuer is set to use the base URL `https://{region}.oic.prod-aks.azure.com`, where the value for `{region}` matches the location the AKS cluster is deployed in.

## Rotate the OIDC key

To rotate the OIDC key, run the [az aks oidc-issuer][az-aks-oidc-issuer] command. Replace the default values for the cluster name and the resource group name.

```azurecli-interactive
az aks oidc-issuer rotate-signing-keys -n myAKSCluster -g myResourceGroup
```

> [!IMPORTANT]
> Once you rotate the key, the old key (key1) expires after 24 hours. This means that both the old key (key1) and the new key (key2) are valid within the 24-hour period. If you want to invalidate the old key (key1) immediately, you need to rotate the OIDC key twice. Then key2 and key3 are valid, and key1 is invalid.

## Check the OIDC keys

### Get the OIDC Issuer URL

To get the OIDC Issuer URL, run the [az aks show][az-aks-show] command. Replace the default values for the cluster name and the resource group name.

```azurecli-interactive
az aks show -n myAKScluster -g myResourceGroup --query "oidcIssuerProfile.issuerUrl" -otsv
```

The output should resemble the following:

```output
https://eastus.oic.prod-aks.azure.com/00000000-0000-0000-0000-000000000000/00000000-0000-0000-0000-000000000000/
```

By default, the Issuer is set to use the base URL `https://{region}.oic.prod-aks.azure.com/{uuid}`, where the value for `{region}` matches the location the AKS cluster is deployed in. The value `{uuid}` represents the OIDC key.

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

During key rotation, there is one additional key present in the discovery document.

## Next steps

* See [configure creating a trust relationship between an app and an external identity provider](../active-directory/develop/workload-identity-federation-create-trust.md) to understand how a federated identity credential creates a trust relationship between an application on your cluster and an external identity provider.
* Review [Microsoft Entra Workload ID][azure-ad-workload-identity-overview] (preview). This authentication method integrates with the Kubernetes native capabilities to federate with any external identity providers on behalf of the application.
* See [Secure pod network traffic][secure-pod-network-traffic] to understand how to use the Network Policy engine and create Kubernetes network policies to control the flow of traffic between pods in AKS.

<!-- LINKS - external -->

<!-- LINKS - internal -->
[open-id-connect-overview]: ../active-directory/fundamentals/auth-oidc.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-aks-show]: /cli/azure/aks#az-aks-show
[az-aks-oidc-issuer]: /cli/azure/aks/oidc-issuer
[azure-ad-workload-identity-overview]: workload-identity-overview.md
[secure-pod-network-traffic]: use-network-policies.md
