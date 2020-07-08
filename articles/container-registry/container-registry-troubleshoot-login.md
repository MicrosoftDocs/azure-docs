---
title: Troubleshoot login to registry
description: Symptoms, causes, and resolution of common problems when logging into an Azure container registry
ms.topic: article
ms.date: 07/07/2020
---

# Troubleshoot registry login

This article helps you troubleshoot common problems when logging into an Azure container registry. Symptoms can include:

* Unable to login to registry using `docker login`, `az acr login`, or both
* Unable to login to registry and you receive Docker error `unauthorized: authentication required`
* Unable to login to registry and you receive Azure CLI error `Could not connect to the registry login server`
* Unable to push or pull images and you receive Docker error `unauthorized: authentication required`
* Unable to push or pull images and you receive  Azure CLI error `Could not connect to the registry login server`
* Unable to access registry from Azure Kubernetes Service, Azure DevOps, or another Azure service

## Causes

* The registry doesn't exist or the name is incorrect - [solution](#specify-correct-registry-name)
* The registry credentials aren't valid - [solution](#confirm-credentials-to-access-registry)
* The credentials aren't authorized for push or pull operations - [solution](#confirm-credentials-are-authorized-to-access-registry)
* The credentials are expired - [solution](#check-that-credentials-aren't-expired)

If you don't resolve your problem here, see [Next steps](#next-steps) for other options.

## Potential solutions

### Specify correct registry name

* To login to the registry using `docker login`, specify the login server name of the registry. Ensure that you use only lowercase letters and the suffix `azurecr.io`. Example: `myregistry.azurecr.io`
* To login to the registry using [az acr login](/cli/azure/acr#az-acr-login) with an enabled Azure Active Directory identity, first [sign into the Azure CLI](/cli/azure/authenticate-azure-cli), and then specify the Azure resource name of the registry as follows:

  ```azurecli
  az acr login --name myregistry
  ```

Related links:

* [az acr login succeeds but docker fails with error: unauthorized: authentication required](container-registry-faq.md#az-acr-login-succeeds-but-docker-fails-with-error-unauthorized-authentication-required )

### Confirm credentials to access registry

Check the credentials you created for your scenario, or that were provided to you by a registry owner. If using an Active Directory service principal, the registry credentials are:

* User name - service principal application ID (also called *client ID*)
* Password - service principal password (also called *client secret*)

If using an Azure service such as Azure Kubernetes Service or Azure DevOps to access the registry, confirm the registry configuration for your service.

Related links:

* [Authentication overview](container-registry-authentication.md#authentication-overview)
* [Individual login with Azure AD](container-registry-authentication.md#individual-login-with-azure-ad)
* [Login with service principal](container-registry-auth-service-principal.md)
* [Login with managed identity](container-registry-authentication-managed-identity.md)
* [Login with repository-scoped token](container-registry-repository-scoped-permissions.md)
* [Login with admin account](container-registry-authentication.md#admin-account)

### Confirm credentials are authorized to access registry

Confirm the registry permissions that are associated with the credentials, such as the `AcrPull` RBAC role to pull images from the registry, or the `AcrPush` role to push images. You or a registry owner must have sufficient privileges in the subscription to add or remove role assignments.

Related links:

* [RBAC roles and permissions - Azure Container Registry](container-registry-roles.md)
* [Login with repository-scoped token](container-registry-repository-scoped-permissions.md)
* [Add or remove Azure role assignments using the Azure portal](../role-based-access-control/role-assignments-portal.md)
* [Use the portal to create an Azure AD application and service principal that can access resources](../active-directory/develop/howto-create-service-principal-portal.md)
* [Create a new application secret](../active-directory/develop/howto-create-service-principal-portal.md#create-a-new-application-secret)
* [Azure AD authentication and authorization codes](../active-directory/develop/reference-aadsts-error-codes.md)

### Check that credentials aren't expired

Tokens and Active Directory credentials may expire after defined periods, preventing registry access. To enable access, you or a registry owner might need to reset or regenerate credentials.

Related links:

* [Reset service principal credentials](/cli/azure/ad/sp/credential#az-ad-sp-credential-reset)
* [Regenerate token passwords](container-registry-repository-scoped-permissions.md#regenerate-token-passwords)
* [Individual login with Azure AD](container-registry-authentication.md#individual-login-with-azure-ad)

## Further troubleshooting

If permissions to registry resources allow, check the health of the registry environment or review registry logs.

Related links:

* [Check registry health](container-registry-check-health.md)
* [Logs for diagnostic evaluation and auditing](container-registry-diagnostics-audit-logs.md)
* [Container registry FAQ](container-registry-faq.md)

## Next steps

* Other registry troubleshooting topics include:
  * Troubleshoot network access and connectivity [add link when available]
  * Troubleshoot registry performance [add link when available]
* [Community support](https://azure.microsoft.com/support/community/) options
* [Microsoft Q&A](https://docs.microsoft.com/answers/products/)
* [Open a support ticket](https://azure.microsoft.com/support/create-ticket/)


