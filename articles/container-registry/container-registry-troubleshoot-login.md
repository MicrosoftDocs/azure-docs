---
title: Troubleshoot login to registry
description: Symptoms, causes, and resolution of common problems when logging into an Azure container registry
ms.topic: article
ms.date: 07/31/2020
---

# Troubleshoot registry login

This article helps you troubleshoot common problems when logging into an Azure container registry. 

## Symptoms

* Unable to login to registry using `docker login`, `az acr login`, or both
* Unable to login to registry and you receive Docker error `unauthorized: authentication required`
* Unable to login to registry and you receive Azure CLI error `Could not connect to the registry login server`
* Unable to push or pull images and you receive Docker error `unauthorized: authentication required`
* Unable to access registry from Azure Kubernetes Service, Azure DevOps, or another Azure service
* Unable to access or view registry settings in Azure portal or manage registry using the Azure CLI

> [!NOTE]
> Some authentication or authorization errors can also occur if there are firewall or network configurations that prevent registry access. See [Troubleshoot network access to registry](container-registry-troubleshoot-access.md).

## Causes

* Docker isn't configured properly in your environment - [solution](#check-docker-configuration)
* The registry doesn't exist or the name is incorrect - [solution](#specify-correct-registry-name)
* The registry credentials aren't valid - [solution](#confirm-credentials-to-access-registry)
* The credentials aren't authorized for push, pull, or Azure Resource Manager operations - [solution](#confirm-credentials-are-authorized-to-access-registry)
* The credentials are expired - [solution](#check-that-credentials-arent-expired)

If you don't resolve your problem here, see [Next steps](#next-steps) for other options.

## Potential solutions

### Check Docker configuration

Most Azure Container Registry authentication flows require a local Docker installation. Confirm that the Docker CLI client and daemon (Docker Engine) are running in your environment. You need Docker client version 18.03 or later. 

Related links:

* [Authentication overview](container-registry-authentication.md#authentication-options)
* [Container registry FAQ](container-registry-faq.md)

### Specify correct registry name

* To login to the registry using `docker login`, specify the login server name of the registry. Ensure that you use only lowercase letters and the suffix `azurecr.io`:

  ```console
  `docker login myregistry.azurecr.io`
  ```

* To login to the registry using [az acr login](/cli/azure/acr#az-acr-login) with an enabled Azure Active Directory identity, first [sign into the Azure CLI](/cli/azure/authenticate-azure-cli), and then specify the Azure resource name of the registry as follows:

  ```azurecli
  az acr login --name myregistry
  ```

Related links:

* [az acr login succeeds but docker fails with error: unauthorized: authentication required](container-registry-faq.md#az-acr-login-succeeds-but-docker-fails-with-error-unauthorized-authentication-required )

### Confirm credentials to access registry

Check that the credentials you use for your scenario, or that were provided to you by a registry owner, are valid. Some possible issues:

* If using an Active Directory service principal, ensure you use the correct credentials:
  * User name - service principal application ID (also called *client ID*)
  * Password - service principal password (also called *client secret*)
* If using an Azure service such as Azure Kubernetes Service or Azure DevOps to access the registry, confirm the registry configuration for your service.
* If you ran `az acr login` with the `--expose-token` option, to enable registry login without using the Docker daemon, ensure that you authenticate with the username `00000000-0000-0000-0000-000000000000`.

Related links:

* [Authentication overview](container-registry-authentication.md#authentication-options)
* [Individual login with Azure AD](container-registry-authentication.md#individual-login-with-azure-ad)
* [Login with service principal](container-registry-auth-service-principal.md)
* [Login with managed identity](container-registry-authentication-managed-identity.md)
* [Login with repository-scoped token](container-registry-repository-scoped-permissions.md)
* [Login with admin account](container-registry-authentication.md#admin-account)
* [Azure AD authentication and authorization error codes](../active-directory/develop/reference-aadsts-error-codes.md)
* [az acr login](/cli/azure/acr#az-acr-login) reference

### Confirm credentials are authorized to access registry

Confirm the registry permissions that are associated with the credentials, such as the `AcrPull` RBAC role to pull images from the registry, or the `AcrPush` role to push images. 

Access to a registry in the portal or registry management using the Azure CLI requires at least the `Reader` role to perform Azure Resource Manager operations.

You or a registry owner must have sufficient privileges in the subscription to add or remove role assignments.

Related links:

* [RBAC roles and permissions - Azure Container Registry](container-registry-roles.md)
* [Login with repository-scoped token](container-registry-repository-scoped-permissions.md)
* [Add or remove Azure role assignments using the Azure portal](../role-based-access-control/role-assignments-portal.md)
* [Use the portal to create an Azure AD application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md)
* [Create a new application secret](../active-directory/develop/howto-create-service-principal-portal.md#create-a-new-application-secret)
* [Azure AD authentication and authorization codes](../active-directory/develop/reference-aadsts-error-codes.md)

### Check that credentials aren't expired

Tokens and Active Directory credentials may expire after defined periods, preventing registry access. To enable access, credentials might need to be reset or regenerated.

* If using an individual AD identity, a managed identity, or service principal for registry login, the AD token expires after 3 hours. Log in again to the registry.  
* If using an AD service principal with an expired client secret, a subscription owner or account administrator needs to reset credentials or generate a new service principal.
* If using a [repository-scoped token](container-registry-repository-scoped-permissions.md), a registry owner might need to reset a password or generate a new token.

Related links:

* [Reset service principal credentials](/cli/azure/ad/sp/credential#az-ad-sp-credential-reset)
* [Regenerate token passwords](container-registry-repository-scoped-permissions.md#regenerate-token-passwords)
* [Individual login with Azure AD](container-registry-authentication.md#individual-login-with-azure-ad)

## Further troubleshooting

If your permissions to registry resources allow, check the health of the registry environment or review registry logs.

Related links:

* [Check registry health](container-registry-check-health.md)
* [Logs for diagnostic evaluation and auditing](container-registry-diagnostics-audit-logs.md)
* [Container registry FAQ](container-registry-faq.md)

## Next steps

* Other registry troubleshooting topics include:
  * [Troubleshoot network access to registry](container-registry-troubleshoot-access.md)
  * [Troubleshoot registry performance](container-registry-troubleshoot-performance.md)
* [Community support](https://azure.microsoft.com/support/community/) options
* [Microsoft Q&A](https://docs.microsoft.com/answers/products/)
* [Open a support ticket](https://azure.microsoft.com/support/create-ticket/)


