---
title: Using Kubelogin with Azure Kubernetes Service (AKS)
description: Learn about using Kubelogin to enable authentication with Azure Active Directory authentication with Azure Kubernetes Service (AKS) 
ms.topic: article
ms.date: 11/27/2023

---

# Use Kubelogin with Azure Kubernetes Service (AKS)

Kubelogin is a client-go credential [plugin][client-go-cred-plugin] that implements Microsoft Entra ID authentication. Azure Kubernetes Service (AKS) clusters integrated with Microsoft Entra ID running Kubernetes versions 1.24 and higher automatically use the `kubelogin` format.

This article provides an overview of the different authentication methods and examples on how to use them.

## Limitations

* A maximum of 200 groups are included in the Microsoft Entra ID JWT. For more than 200 groups, consider using [Application Roles][entra-id-application-roles].
* Groups created in Microsoft Entra ID can only be included by their ObjectID and not by their display name. `sAMAccountName` is only available for groups synchronized from on-premises Active Directory.
* On AKS, service principal authentication method only works with managed Entra ID, not legacy Azure Active Directory.
* Device code authentication method doesn't work when Conditional Access policy is configured on a Microsoft Entra tenant. Use web browser interactive authentication instead.

## Authentication modes

Most of the interaction with `kubelogin` is specific to the `convert-kubeconfig` subcommand, which uses the input kubeconfig specified in `--kubeconfig` or `KUBECONFIG` environment variable to convert to the final kubeconfig in exec format based on the specified authentication mode.

In this section, the authentication modes are explained in detail.

### How authentication works

The authentication modes that `kubelogin` implements are Microsoft Entra ID OAuth 2.0 token grant flows. Throughout `kubelogin` subcommands, you see below common flags. In general, these flags are already set up when you get the kubeconfig from AKS.

* **--tenant-id**: Microsoft Entra ID tenant ID
* **--client-id**: The application ID of the public client application. This client app is only used in device code, web browser interactive, and ropc log in modes.
* **--server-id**: The application ID of the web app, or resource server. The token should be issued to this resource.

> [!NOTE]
> With each authentication method, the token isn't cached on the filesystem.

### Using device code

Device code is the default authentication mode in `convert-kubeconfig` subcommand. The `-l devicecode` is optional. This authentication method prompts the device code for user to sign in from a browser session.

Before `kubelogin` and Exec plugin were introduced, the Azure authentication mode in `kubectl` only supported device code flow. It used an old library that produces the token with `audience` claim that has the `spn:` prefix, which isn't compatible with [AKS-managed Entra ID][aks-managed-microsoft-entra-id] using [on-behalf-of][oauth-on-behalf-of] (OBO) flow. When you run the `convert-kubeconfig` subcommand, `kubelogin` removes the `spn:` (prefix in audience claim). If you require using the original functionality, add the `--legacy` argument.

If you're using `kubeconfig` from legacy Azure AD cluster, `kubelogin` automatically adds the `--legacy` flag.

In this sign in mode, the access token and refresh token are cached in the `${HOME}/.kube/cache/kubelogin` directory. This path can be overriden specifying the `--token-cache-dir` parameter.

If your Azure AD integrated cluster uses Kubernetes version 1.24 or earlier, you need to manually convert the kubeconfig format by running the following commands.

```bash
export KUBECONFIG=/path/to/kubeconfig
kubelogin convert-kubeconfig
kubectl get nodes

# clean up cached token
kubelogin remove-tokens
```

> [!NOTE]
> Device code sign in method doesn't work when Conditional Access policy is configured on Microsoft Entra tenant. Use the [web browser interactive mode][web-browser-interactive-mode] instead.

### Using the Azure CLI

Authenticating using the Azure CLI method uses the already signed in context performed by the Azure CLI to get the access token. The token is issued in the same Microsoft Entra tenant as with `az login`.

`kubelogin` doesn't cache any token since it's already managed by the Azure CLI.

> [!NOTE]
> This authentication method only works with AKS-managed Microsoft Entra ID.

```bash
az login

export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l azurecli

kubectl get nodes
```

When the Azure CLI's config directory is outside the $`{HOME}` directory, specify the parameter `--azure-config-dir` in `convert-kubeconfig` subcommand. It generates the `kubeconfig` with the environment variable configured. You can achieve the same configuration by setting the environment variable `AZURE_CONFIG_DIR` to this directory while running `kubectl` command.

### Interactive web browser

Interactive web browser authentication automatically opens a web browser to log in the user. Once authenticated, the browser redirects back to a local web server with the credentials. This authentication method complies with Conditional Access policy.

When you authenticate using this method, the access token is cached in the `${HOME}/.kube/cache/kubelogin` directory. This path can be overriden by specifying the `--token-cache-dir` parameter.

The following example shows how to use a bearer token with interactive flow.

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l interactive

kubectl get nodes
```

The following example shows how to use Proof-of-Possession (PoP) tokens with interactive flow.

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l interactive --pop-enabled --pop-claims "u=/ARM/ID/OF/CLUSTER"

kubectl get nodes
```

### Service principal

This authentication method uses a service principal to sign in. The credential may be provided using an environment variable or command-line argument. The supported credentials are password and pfx client certificate.

The following are limitations to consider before using this method:

* This only works with managed Microsoft Entra ID
* The service principal can be member of a maximum of [200 Microsoft Entra ID groups][microsoft-entra-group-membership].

The following examples show how to set up a client secret using an environment variable.

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l spn

export AAD_SERVICE_PRINCIPAL_CLIENT_ID=<spn client id>
export AAD_SERVICE_PRINCIPAL_CLIENT_SECRET=<spn secret>

kubectl get nodes
```

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l spn

export AZURE_CLIENT_ID=<spn client id>
export AZURE_CLIENT_SECRET=<spn secret>

kubectl get nodes
```

The following example shows how to set up a client secret in a command-line argument.

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l spn --client-id <spn client id> --client-secret <spn client secret>

kubectl get nodes
```

> [!WARNING]
> This method leaves the secret in the kubeconfig file.

The following examples show how to setup a client secret using a client certificate.

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l spn

export AAD_SERVICE_PRINCIPAL_CLIENT_ID=<spn client id>
export AAD_SERVICE_PRINCIPAL_CLIENT_CERTIFICATE=/path/to/cert.pfx
export AAD_SERVICE_PRINCIPAL_CLIENT_CERTIFICATE_PASSWORD=<pfx password>

kubectl get nodes
```

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l spn

export AZURE_CLIENT_ID=<spn client id>
export AZURE_CLIENT_CERTIFICATE_PATH=/path/to/cert.pfx
export AZURE_CLIENT_CERTIFICATE_PASSWORD=<pfx password>

kubectl get nodes
```

The following example shows how to set up a Proof-of-Possession (PoP) token using a client secret from environment variables.

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l spn --pop-enabled --pop-claims "u=/ARM/ID/OF/CLUSTER"

export AAD_SERVICE_PRINCIPAL_CLIENT_ID=<spn client id>
export AAD_SERVICE_PRINCIPAL_CLIENT_SECRET=<spn secret>

kubectl get nodes
```

### Managed identity

The [managed identity][managed-identity-overview] authentication method should be used for applications to use when connecting to resources that support Microsoft Entra authentication. For example, accessing Azure services such as Azure Virtual Machine, Azure Virtual Machine Scale Sets, Azure Cloud Shell, etc.

The following example shows how to use the default managed identity.

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l msi

kubectl get nodes
```

The following example shows how to use a managed identity with a specific identity.

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l msi --client-id <msi-client-id>

kubectl get nodes
```

### Workload identity

This authentication method uses Microsoft Entra ID federated identity credentials to authenticate to Kubernetes clusters with Microsoft Entra ID integration. It works by setting the environment variables:

* **AZURE_CLIENT_ID**: the Microsoft Entra ID application ID that is federated with workload identity
* **AZURE_TENANT_ID**: the Microsoft Entra ID tenant ID
* **AZURE_FEDERATED_TOKEN_FILE**: the file containing signed assertion of workload identity. For example, Kubernetes projected service account (jwt) token
* **AZURE_AUTHORITY_HOST**: the base URL of a Microsoft Entra ID authority. For example, `https://login.microsoftonline.com/`.

With [workload identity][workload-identity], it's possible to access Kubernetes clusters from CI/CD system such as GitHub, ArgoCD, etc. without storing Service Principal credentials in those external systems. To configure OIDC federation from GitHub, see the following [example][oidc-federation-github].

The following example shows how to use a workload identity.

```bash
export KUBECONFIG=/path/to/kubeconfig

kubelogin convert-kubeconfig -l workloadidentity

kubectl get nodes
```

## Using Kubelogin with AKS

AKS uses a pair of first party Azure AD applications. These application IDs are the same in all environments.

The AKS Microsoft Entra ID Server application ID used by the server side is: `6dae42f8-4368-4678-94ff-3960e28e3630`. The access token accessing AKS clusters need to be issued for this application. In most of kubelogin authentication modes, `--server-id` is a required parameter with `kubelogin get-token`.

The AKS Microsoft Entra ID client application ID used by kubelogin to perform public client authentication on behalf of the user is: `80faf920-1908-4b52-b5ef-a8e7bedfc67a`. The client application ID is used as part of device code and web browser interactive authentication methods.

<!-- LINKS - internal -->
[aks-managed-microsoft-entra-id]: managed-azure-ad.md
[oauth-on-behalf-of]: ../active-directory/develop/v2-oauth2-on-behalf-of-flow.md
[web-browser-interactive-mode]: #interactive-web-browser
[microsoft-entra-group-membership]: /entra/identity/hybrid/connect/how-to-connect-fed-group-claims
[managed-identity-overview]: /entra/identity/managed-identities-azure-resources/overview
[workload-identity]: /entra/workload-id/workload-identities-overview
[entra-id-application-roles]: /entra/external-id/customers/how-to-use-app-roles-customers

<!-- LINKS - external -->
[client-go-cred-plugin]: https://kubernetes.io/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins
[oidc-federation-github]: https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-azure