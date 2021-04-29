---
title: Troubleshoot login to registry
description: Symptoms, causes, and resolution of common problems when logging into an Azure container registry
ms.topic: article
ms.date: 08/11/2020
---

# Troubleshoot registry login

This article helps you troubleshoot problems you might encounter when logging into an Azure container registry. 

## Symptoms

May include one or more of the following:

* Unable to login to registry using `docker login`, `az acr login`, or both
* Unable to login to registry and you receive error `unauthorized: authentication required` or `unauthorized: Application not registered with AAD`
* Unable to login to registry and you receive Azure CLI error `Could not connect to the registry login server`
* Unable to push or pull images and you receive Docker error `unauthorized: authentication required`
* Unable to access registry from Azure Kubernetes Service, Azure DevOps, or another Azure service
* Unable to access registry and you receive error `Error response from daemon: login attempt failed with status: 403 Forbidden` - See [Troubleshoot network issues with registry](container-registry-troubleshoot-access.md)
* Unable to access or view registry settings in Azure portal or manage registry using the Azure CLI

## Causes

* Docker isn't configured properly in your environment - [solution](#check-docker-configuration)
* The registry doesn't exist or the name is incorrect - [solution](#specify-correct-registry-name)
* The registry credentials aren't valid - [solution](#confirm-credentials-to-access-registry)
* The credentials aren't authorized for push, pull, or Azure Resource Manager operations - [solution](#confirm-credentials-are-authorized-to-access-registry)
* The credentials are expired - [solution](#check-that-credentials-arent-expired)

## Further diagnosis 

Run the [az acr check-health](/cli/azure/acr#az_acr_check_health) command to get more information about the health of the registry environment and optionally access to a target registry. For example, diagnose Docker configuration errors or Azure Active Directory login problems. 

See [Check the health of an Azure container registry](container-registry-check-health.md) for command examples. If errors are reported, review the [error reference](container-registry-health-error-reference.md) and the following sections for recommended solutions.

If you're experiencing problems using the registry wih Azure Kubernetes Service, run the [az aks check-acr](/cli/azure/aks#az_aks_check_acr) command to validate that the registry is accessible from the AKS cluster.

> [!NOTE]
> Some authentication or authorization errors can also occur if there are firewall or network configurations that prevent registry access. See [Troubleshoot network issues with registry](container-registry-troubleshoot-access.md).

## Potential solutions

### Check Docker configuration

Most Azure Container Registry authentication flows require a local Docker installation so you can authenticate with your registry for operations such as pushing and pulling images. Confirm that the Docker CLI client and daemon (Docker Engine) are running in your environment. You need Docker client version 18.03 or later.

Related links:

* [Authentication overview](container-registry-authentication.md#authentication-options)
* [Container registry FAQ](container-registry-faq.md)

### Specify correct registry name

When using `docker login`, provide the full login server name of the registry, such as *myregistry.azurecr.io*. Ensure that you use only lowercase letters. Example:

```console
docker login myregistry.azurecr.io
```

When using [az acr login](/cli/azure/acr#az_acr_login) with an Azure Active Directory identity, first [sign into the Azure CLI](/cli/azure/authenticate-azure-cli), and then specify the Azure resource name of the registry. The resource name is the name provided when the registry was created, such as *myregistry* (without a domain suffix). Example:

```azurecli
az acr login --name myregistry
```

Related links:

* [az acr login succeeds but docker fails with error: unauthorized: authentication required](container-registry-faq.md#az-acr-login-succeeds-but-docker-fails-with-error-unauthorized-authentication-required)

### Confirm credentials to access registry

Check the validity of the credentials you use for your scenario, or were provided to you by a registry owner. Some possible issues:

* If using an Active Directory service principal, ensure you use the correct credentials in the Active Directory tenant:
  * User name - service principal application ID (also called *client ID*)
  * Password - service principal password (also called *client secret*)
* If using an Azure service such as Azure Kubernetes Service or Azure DevOps to access the registry, confirm the registry configuration for your service. 
* If you ran `az acr login` with the `--expose-token` option, which enables registry login without using the Docker daemon, ensure that you authenticate with the username `00000000-0000-0000-0000-000000000000`.
* If your registry is configured for [anonymous pull access](container-registry-faq.md#how-do-i-enable-anonymous-pull-access), existing Docker credentials stored from a previous Docker login can prevent anonymous access. Run `docker logout` before attempting an anonymous pull operation on the registry.

Related links:

* [Authentication overview](container-registry-authentication.md#authentication-options)
* [Individual login with Azure AD](container-registry-authentication.md#individual-login-with-azure-ad)
* [Login with service principal](container-registry-auth-service-principal.md)
* [Login with managed identity](container-registry-authentication-managed-identity.md)
* [Login with repository-scoped token](container-registry-repository-scoped-permissions.md)
* [Login with admin account](container-registry-authentication.md#admin-account)
* [Azure AD authentication and authorization error codes](../active-directory/develop/reference-aadsts-error-codes.md)
* [az acr login](/cli/azure/acr#az_acr_login) reference

### Confirm credentials are authorized to access registry

Confirm the registry permissions that are associated with the credentials, such as the `AcrPull` Azure role to pull images from the registry, or the `AcrPush` role to push images. 

Access to a registry in the portal or registry management using the Azure CLI requires at least the `Reader` role or equivalent permissions to perform Azure Resource Manager operations.

If your permissions recently changed to allow registry access though the portal, you might need to try an incognito or private session in your browser to avoid any stale browser cache or cookies.

You or a registry owner must have sufficient privileges in the subscription to add or remove role assignments.

Related links:

* [Azure roles and permissions - Azure Container Registry](container-registry-roles.md)
* [Login with repository-scoped token](container-registry-repository-scoped-permissions.md)
* [Add or remove Azure role assignments using the Azure portal](../role-based-access-control/role-assignments-portal.md)
* [Use the portal to create an Azure AD application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md)
* [Create a new application secret](../active-directory/develop/howto-create-service-principal-portal.md#option-2-create-a-new-application-secret)
* [Azure AD authentication and authorization codes](../active-directory/develop/reference-aadsts-error-codes.md)

### Check that credentials aren't expired

Tokens and Active Directory credentials may expire after defined periods, preventing registry access. To enable access, credentials might need to be reset or regenerated.

* If using an individual AD identity, a managed identity, or service principal for registry login, the AD token expires after 3 hours. Log in again to the registry.  
* If using an AD service principal with an expired client secret, a subscription owner or account administrator needs to reset credentials or generate a new service principal.
* If using a [repository-scoped token](container-registry-repository-scoped-permissions.md), a registry owner might need to reset a password or generate a new token.

Related links:

* [Reset service principal credentials](/cli/azure/ad/sp/credential#az_ad_sp_credential_reset)
* [Regenerate token passwords](container-registry-repository-scoped-permissions.md#regenerate-token-passwords)
* [Individual login with Azure AD](container-registry-authentication.md#individual-login-with-azure-ad)

## Advanced troubleshooting

If [collection of resource logs](container-registry-diagnostics-audit-logs.md) is enabled in the registry, review the ContainterRegistryLoginEvents log. This log stores authentication events and status, including the incoming identity and IP address. Query the log for [registry authentication failures](container-registry-diagnostics-audit-logs.md#registry-authentication-failures). 

Related links:

* [Logs for diagnostic evaluation and auditing](container-registry-diagnostics-audit-logs.md)
* [Container registry FAQ](container-registry-faq.md)
* [Best practices for Azure Container Registry](container-registry-best-practices.md)

## Next steps

If you don't resolve your problem here, see the following options.

* Other registry troubleshooting topics include:
  * [Troubleshoot network issues with registry](container-registry-troubleshoot-access.md)
  * [Troubleshoot registry performance](container-registry-troubleshoot-performance.md)
* [Community support](https://azure.microsoft.com/support/community/) options
* [Microsoft Q&A](/answers/products/)
* [Open a support ticket](https://azure.microsoft.com/support/create-ticket/) - based on information you provide, a quick diagnostic might be run for authentication failures in your registry