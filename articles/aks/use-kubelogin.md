---
title: Using Kubelogin with Azure Kubernetes Service (AKS)
description: Learn about using Kubelogin to enable authentication with Azure Active Directory authentication with Azure Kubernetes Service (AKS) 
ms.topic: article
ms.date: 09/06/2023

---

# Get kubelet logs from Azure Kubernetes Service (AKS) cluster nodes

Kubelogin is a client-go credential [plugin][client-go-cred-plugin] that implements Azure Active Directory (Azure AD) authentication. Azure AD integrated clusters using a Kubernetes version newer than version 1.24 automatically use the `kubelogin` format.

## Login modes

Most of the interaction with `kubelogin is specific to the `convert-kubeconfig` subcommand which uses the input kubeconfig specified in --kubeconfig or `KUBECONFIG` environment variable to convert to the final kubeconfig in exec format based on specified login mode.

In this section, the login modes are explained in detail.

### How login works

The login modes that `kubelogin` implements are AAD OAuth 2.0 token grant flows. Throughout `kubelogin` subcommands, you see below common flags. In general, these flags are already setup when you get the kubeconfig from AKS.

* **--tenant-id**: Azure AD tenant ID
* **--client-id**: The application ID of the public client application. This client app is only used in device code, web browser interactive, and ropc login modes.
* **--server-id**: The application ID of the web app, or resource server. The token should be issued to this resource.

### Using device code

This is the default login mode in `convert-kubeconfig` subcommand. The `-l devicecode` is optional. This login prompts the device code for user to login from a browser.

Before `kubelogin` and Exec plugin were introduced, the Azure authentication mode in `kubectl` only supported device code flow. It used an old library that produces the token with `audience` claim that has the `spn:` prefix, which is not compatible with [AKS-managed Azure AD][aks-managed-azure-active-directory] using [on-behalf-of][oauth-on-behalf-of] (OBO) flow. When running `convert-kubeconfig` subcommand, `kubelogin` removes the `spn:` (prefix in audience claim). If it’s desired to keep the old behavior, add `--legacy`.

If you are using `kubeconfig` from legacy Azure AD cluster, `kubelogin` automatically adds the `--legacy` flag.

In this login mode, the access token and refresh token are cached in the `${HOME}/.kube/cache/kubelogin` directory. This path can be overriden specifying the `--token-cache-dir` parameter.

If your Azure AD integrated cluster uses Kubernetes version 1.24 or earlier, you need to manually convert the kubeconfig format by running the following commands.

```azurecli
export KUBECONFIG=/path/to/kubeconfig
kubelogin convert-kubeconfig
kubectl get nodes

# clean up cached token
kubelogin remove-tokens
```

> [!NOTE]
> Device code login mode doesn’t work when Conditional Access policy is configured on Azure AD tenant. Use the [web browser interactive mode][web-browser-interactive-mode] instead.

### Using the Azure CLI

This login mode uses the already logged-in context performed by the Azure CLI to get the access token. The token is issued in the same Azure AD tenant as with `az login`.

`kubelogin` doesn't cache any token since it’s already managed by thje Azure CLI.

> [!NOTE]
> This login mode only works with AKS-managed Azure AD.

```azurecli
az login

export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l azurecli

kubectl get nodes
```

When the Azure CLI’s config directory is outside the $`{HOME}` directory, the parameter `--azure-config-dir` should be specified in `convert-kubeconfig` subcommand. It generates the `kubeconfig` with environment variable configured. The same thing can also be achieved by setting environment variable `AZURE_CONFIG_DIR` to this directory while running `kubectl` command.

### Using interactive Web browser

<!-- LINKS - internal -->
[aks-managed-azure-active-directory]: managed-azure-ad.md
[oauth-on-behalf-of]: ../active-directory/develop/v2-oauth2-on-behalf-of-flow.md
[web-browser-interactive-mode]: #using-nteractive-web-browser


<!-- LINKS - external -->
[client-go-cred-plugin]: https://kubernetes.io/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins