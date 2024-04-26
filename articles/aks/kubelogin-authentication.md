---
title: Use kubelogin to authenticate in Azure Kubernetes Service
description: Learn how to use the kubelogin plugin for all Microsoft Entra authentication methods in Azure Kubernetes Service (AKS). 
ms.topic: article
ms.subservice: aks-security
ms.custom:
ms.date: 11/28/2023
---

# Use kubelogin to authenticate users in Azure Kubernetes Service

The kubelogin plugin in Azure is a client-go credential [plugin][client-go-cred-plugin] that implements Microsoft Entra authentication. The kubelogin plugin offers features that aren't available in the kubectl command-line tool.

Azure Kubernetes Service (AKS) clusters that are integrated with Microsoft Entra ID and running Kubernetes version 1.24 or later automatically use the kubelogin format.

This article provides an overview and examples of how to use kubelogin for all [supported Microsoft Entra authentication methods][authentication-methods] in AKS.

## Limitations

* You can include a maximum of 200 groups in a Microsoft Entra JSON Web Token (JWT) claim. If you have more than 200 groups, consider using [application roles][entra-id-application-roles].
* Groups that are created in Microsoft Entra ID are included only by their **ObjectID** value, and not by their display name. The `sAMAccountName` command is available only for groups that are synchronized from on-premises Windows Server Active Directory.
* In AKS, the service principal authentication method works only with managed Microsoft Entra ID, and not with the earlier version Azure Active Directory.
* The device code authentication method doesn't work when a Microsoft Entra Conditional Access policy is set on a Microsoft Entra tenant. In that scenario, use web browser interactive authentication.

## How authentication works

For most interactions with kubelogin, you use the `convert-kubeconfig` subcommand. The subcommand uses the kubeconfig file that's specified in `--kubeconfig` or in the `KUBECONFIG` environment variable to convert the final kubeconfig file to exec format based on the specified authentication method.

The authentication methods that kubelogin implements are Microsoft Entra OAuth 2.0 token grant flows. The following parameter flags are common to use in kubelogin subcommands. In general, these flags are ready to use when you get the kubeconfig file from AKS.

* `--tenant-id`: The Microsoft Entra tenant ID.
* `--client-id`: The application ID of the public client application. This client app is used only in the device code, web browser interactive, and OAuth 2.0 Resource Owner Password Credentials (ROPC) (workflow identity) sign-in methods.
* `--server-id`: The application ID of the web app or resource server. The token is issued to this resource.

> [!NOTE]
> In each authentication method, the token is not cached on the file system.

## Authentication methods

The next sections describe supported authentication methods and how to use them:

* Device code
* Azure CLI
* Web browser interactive
* Service principal
* Managed identity
* Workload identity

### Device code

Device code is the default authentication method for the `convert-kubeconfig` subcommand. The `-l devicecode` parameter is optional. This authentication method prompts the device code for the user to sign in from a browser session.

Before the kubelogin and exec plugins were introduced, the Azure authentication method in kubectl supported only the device code flow. It used an earlier version of a library that produces a token that has the `audience` claim with an `spn:` prefix. It isn't compatible with [AKS managed Microsoft Entra ID][aks-managed-microsoft-entra-id], which uses an [on-behalf-of (OBO)][oauth-on-behalf-of] flow. When you run the `convert-kubeconfig` subcommand, kubelogin removes the `spn:` prefix from the audience claim.

If your requirements include using functionality from earlier versions, add the `--legacy` argument. If you're using the kubeconfig file in an earlier version Azure Active Directory cluster, kubelogin automatically adds the `--legacy` flag.

In this sign-in method, the access token and the refresh token are cached in the *${HOME}/.kube/cache/kubelogin* directory. To override this path, include the `--token-cache-dir` parameter.

If your AKS Microsoft Entra integrated cluster uses Kubernetes 1.24 or earlier, you must manually convert the kubeconfig file format by running the following commands:

```bash
export KUBECONFIG=/path/to/kubeconfig
kubelogin convert-kubeconfig
```

Run this kubectl command to get node information:

```bash
kubectl get nodes
```

To clean up cached tokens, run the following command:

```bash
kubelogin remove-tokens
```

> [!NOTE]
> The device code sign-in method doesn't work when a Conditional Access policy is configured on a Microsoft Entra tenant. In this scenario, use the [web browser interactive method][web-browser-interactive-method].

### Azure CLI

The Azure CLI authentication method uses the signed-in context that the Azure CLI establishes to get the access token. The token is issued in the same Microsoft Entra tenant as `az login`. kubelogin doesn't write tokens to the token cache file because they are already managed by the Azure CLI.

> [!NOTE]
> This authentication method works only with AKS managed Microsoft Entra ID.

The following example shows how to use the Azure CLI method to authenticate:

```bash
az login

export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l azurecli
```

Run this kubectl command to get node information:

```bash
kubectl get nodes
```

If the Azure CLI config directory is outside the *${HOME}* directory, use the `--azure-config-dir` parameter with the `convert-kubeconfig` subcommand. The command generates the kubeconfig file with the environment variable configured. You can get the same configuration by setting the `AZURE_CONFIG_DIR` environment variable to this directory when you run a kubectl command.

### Web browser interactive

The web browser interactive method of authentication automatically opens a web browser to sign in the user. After the user is authenticated, the browser redirects to the local web server by using the verified credentials. This authentication method complies with Conditional Access policy.

When you authenticate by using this method, the access token is cached in the *${HOME}/.kube/cache/kubelogin* directory. You can override this path by using the `--token-cache-dir` parameter.

#### Bearer token

The following example shows how to use a bearer token with the web browser interactive flow:

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l interactive
```

Run this kubectl command to get node information:

```bash
kubectl get nodes
```

#### Proof-of-Possession token

The following example shows how to use a Proof-of-Possession (PoP) token with the web browser interactive flow:

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l interactive --pop-enabled --pop-claims "u=/ARM/ID/OF/CLUSTER"
```

Run this kubectl command to get node information:

```bash
kubectl get nodes
```

### Service principal

This authentication method uses a service principal to sign in the user. You can provide the credential by setting an environment variable or by using the credential in a command-line argument. The supported credentials that you can use are a password or a Personal Information Exchange (PFX) client certificate.

Before you use this method, consider the following limitations:

* This method works only with managed Microsoft Entra ID.
* The service principal can be a member of a maximum of 200 [Microsoft Entra groups][microsoft-entra-group-membership].

#### Environment variables

The following example shows how to set up a client secret by using environment variables:

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l spn

export AAD_SERVICE_PRINCIPAL_CLIENT_ID=<Service Principal Name (SPN) client ID>
export AAD_SERVICE_PRINCIPAL_CLIENT_SECRET=<SPN secret>
```

Run this kubectl command to get node information:

```bash
kubectl get nodes
```

Then run this command:

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l spn

export AZURE_CLIENT_ID=<SPN client ID>
export AZURE_CLIENT_SECRET=<SPN secret>
```

Run this kubectl command to get node information:

```bash
kubectl get nodes
```

#### Command-line argument

The following example shows how to set up a client secret in a command-line argument:

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l spn --client-id <SPN client ID> --client-secret <SPN client secret>
```

Run this kubectl command to get node information:

```bash
kubectl get nodes
```

> [!WARNING]
> The command-line argument method stores the secret in the kubeconfig file.

#### Client certificate

The following example shows how to set up a client secret by using a client certificate:

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l spn

export AAD_SERVICE_PRINCIPAL_CLIENT_ID=<SPN client ID>
export AAD_SERVICE_PRINCIPAL_CLIENT_CERTIFICATE=/path/to/cert.pfx
export AAD_SERVICE_PRINCIPAL_CLIENT_CERTIFICATE_PASSWORD=<PFX password>
```

Run this kubectl command to get node information:

```bash
kubectl get nodes
```

Then run this command:

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l spn

export AZURE_CLIENT_ID=<SPN client ID>
export AZURE_CLIENT_CERTIFICATE_PATH=/path/to/cert.pfx
export AZURE_CLIENT_CERTIFICATE_PASSWORD=<PFX password>
```

Run this kubectl command to get node information:

```bash
kubectl get nodes
```

#### PoP token and environment variables

The following example shows how to set up a PoP token that uses a client secret that it gets from environment variables:

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l spn --pop-enabled --pop-claims "u=/ARM/ID/OF/CLUSTER"

export AAD_SERVICE_PRINCIPAL_CLIENT_ID=<SPN client ID>
export AAD_SERVICE_PRINCIPAL_CLIENT_SECRET=<SPN secret>
```

Run this kubectl command to get node information:

```bash
kubectl get nodes
```

### Managed identity

Use the [managed identity][managed-identity-overview] authentication method for applications that connect to resources that support Microsoft Entra authentication. Examples include accessing Azure resources like an Azure virtual machine, a virtual machine scale set, or Azure Cloud Shell.

#### Default managed identity

The following example shows how to use the default managed identity:

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l msi
```

Run this kubectl command to get node information:

```bash
kubectl get nodes
```

#### Specific identity

The following example shows how to use a managed identity with a specific identity:

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l msi --client-id <msi-client-id>
```

Run this kubectl command to get node information:

```bash
kubectl get nodes
```

### Workload identity

The workload identity authentication method uses identity credentials that are federated with Microsoft Entra to authenticate access to AKS clusters. The method uses Microsoft Entra integrated authentication. It works by setting the following environment variables:

* `AZURE_CLIENT_ID`: The Microsoft Entra application ID that is federated with the workload identity.
* `AZURE_TENANT_ID`: The Microsoft Entra tenant ID.
* `AZURE_FEDERATED_TOKEN_FILE`: The file that contains a signed assertion of the workload identity, like a Kubernetes projected service account (JWT) token.
* `AZURE_AUTHORITY_HOST`: The base URL of a Microsoft Entra authority. For example, `https://login.microsoftonline.com/`.

You can use a [workload identity][workload-identity] to access Kubernetes clusters from CI/CD systems like GitHub or ArgoCD without storing service principal credentials in the external systems. To configure OpenID Connect (OIDC) federation from GitHub, see the [OIDC federation example][oidc-federation-github].

The following example shows how to use a workload identity:

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l workloadidentity
```

Run this kubectl command to get node information:

```bash
kubectl get nodes
```

## How to use kubelogin with AKS

AKS uses a pair of first-party Microsoft Entra applications. These application IDs are the same in all environments.

The AKS Microsoft Entra server application ID that the server side uses is `6dae42f8-4368-4678-94ff-3960e28e3630`. The access token that accesses AKS clusters must be issued for this application. In most kubelogin authentication methods, you must use `--server-id` with `kubelogin get-token`.

The AKS Microsoft Entra client application ID that kubelogin uses to perform public client authentication on behalf of the user is `80faf920-1908-4b52-b5ef-a8e7bedfc67a`. The client application ID is used in device code and web browser interactive authentication methods.

## Related content

* Learn how to integrate AKS with Microsoft Entra ID in the [AKS managed Microsoft Entra ID integration][aks-managed-microsoft-entra-integration-guide] how-to article.
* To get started with managed identities in AKS, see [Use a managed identity in AKS][use-a-managed-identity-in-aks].
* To get started with workload identities in AKS, see [Use a workload identity in AKS][use-a-workload-identity-in-aks].

<!-- LINKS - internal -->
[authentication-methods]: #authentication-methods
[aks-managed-microsoft-entra-id]: managed-azure-ad.md
[oauth-on-behalf-of]: ../active-directory/develop/v2-oauth2-on-behalf-of-flow.md
[web-browser-interactive-method]: #web-browser-interactive
[microsoft-entra-group-membership]: /entra/identity/hybrid/connect/how-to-connect-fed-group-claims
[managed-identity-overview]: /entra/identity/managed-identities-azure-resources/overview
[workload-identity]: /entra/workload-id/workload-identities-overview
[entra-id-application-roles]: /entra/external-id/customers/how-to-use-app-roles-customers
[aks-managed-microsoft-entra-integration-guide]: managed-azure-ad.md
[use-a-managed-identity-in-aks]: use-managed-identity.md
[use-a-workload-identity-in-aks]: workload-identity-overview.md

<!-- LINKS - external -->
[client-go-cred-plugin]: https://kubernetes.io/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins
[oidc-federation-github]: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure
