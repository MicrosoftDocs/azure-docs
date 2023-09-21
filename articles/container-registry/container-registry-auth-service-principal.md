---
title: Authenticate with service principal
description: Provide access to images in your private container registry by using an Azure Active Directory service principal.
ms.topic: article
ms.custom: devx-track-azurecli
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
---

# Azure Container Registry authentication with service principals

You can use an Azure Active Directory (Azure AD) service principal to provide push, pull, or other access to your container registry. By using a service principal, you can provide access to "headless" services and applications.

## What is a service principal?

Azure AD [*service principals*](../active-directory/develop/app-objects-and-service-principals.md) provide access to Azure resources within your subscription. You can think of a service principal as a user identity for a service, where "service" is any application, service, or platform that needs to access the resources. You can configure a service principal with access rights scoped only to those resources you specify. Then, configure your application or service to use the service principal's credentials to access those resources.

In the context of Azure Container Registry, you can create an Azure AD service principal with pull, push and pull, or other permissions to your private registry in Azure. For a complete list, see [Azure Container Registry roles and permissions](container-registry-roles.md).

## Why use a service principal?

By using an Azure AD service principal, you can provide scoped access to your private container registry. Create different service principals for each of your applications or services, each with tailored access rights to your registry. And, because you can avoid sharing credentials between services and applications, you can rotate credentials or revoke access for only the service principal (and thus the application) you choose.

For example, configure your web application to use a service principal that provides it with image `pull` access only, while your build system uses a service principal that provides it with both `push` and `pull` access. If development of your application changes hands, you can rotate its service principal credentials without affecting the build system.

## When to use a service principal

You should use a service principal to provide registry access in **headless scenarios**. That is, an application, service, or script that must push or pull container images in an automated or otherwise unattended manner. For example:

* *Pull*: Deploy containers from a registry to orchestration systems including Kubernetes, DC/OS, and Docker Swarm. You can also pull from container registries to related Azure services such as [Azure Container Instances](container-registry-auth-aci.md), [App Service](../app-service/index.yml), [Batch](../batch/index.yml), [Service Fabric](../service-fabric/index.yml), and others.

    > [!TIP]
    > A service principal is recommended in several [Kubernetes scenarios](authenticate-kubernetes-options.md) to pull images from an Azure container registry. With Azure Kubernetes Service (AKS), you can also use an automated mechanism to authenticate with a target registry by enabling the cluster's [managed identity](../aks/cluster-container-registry-integration.md).
  * *Push*: Build container images and push them to a registry using continuous integration and deployment solutions like Azure Pipelines or Jenkins.

For individual access to a registry, such as when you manually pull a container image to your development workstation, we recommend using your own [Azure AD identity](container-registry-authentication.md#individual-login-with-azure-ad) instead for registry access (for example, with [az acr login][az-acr-login]).

[!INCLUDE [container-registry-service-principal](../../includes/container-registry-service-principal.md)]

### Sample scripts

You can find the preceding sample scripts for Azure CLI on GitHub, as well as versions for Azure PowerShell:

* [Azure CLI][acr-scripts-cli]
* [Azure PowerShell][acr-scripts-psh]

## Authenticate with the service principal

Once you have a service principal that you've granted access to your container registry, you can configure its credentials for access to "headless" services and applications, or enter them using the `docker login` command. Use the following values:

* **Username** - service principal's **application (client) ID**
* **Password** - service principal's **password (client secret)**

The **Username** value has the format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

> [!TIP]
> You can regenerate the password (client secret) of a service principal by running the [az ad sp credential reset](/cli/azure/ad/sp/credential#az-ad-sp-credential-reset) command.
>

### Use credentials with Azure services

You can use service principal credentials from any Azure service that authenticates with an Azure container registry.  Use service principal credentials in place of the registry's admin credentials for a variety of scenarios.

For example, use the credentials to pull an image from an Azure container registry to [Azure Container Instances](container-registry-auth-aci.md).

### Use with docker login

You can run `docker login` using a service principal. In the following example, the service principal application ID is passed in the environment variable `$SP_APP_ID`, and the password in the variable `$SP_PASSWD`. For recommended practices to manage Docker credentials, see the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command reference.

```bash
# Log in to Docker with service principal credentials
docker login myregistry.azurecr.io --username $SP_APP_ID --password $SP_PASSWD
```

Once logged in, Docker caches the credentials.

### Use with certificate

If you've added a certificate to your service principal, you can sign in to the Azure CLI with certificate-based authentication, and then use the [az acr login][az-acr-login] command to access a registry. Using a certificate as a secret instead of a password provides additional security when you use the CLI.

A self-signed certificate can be created when you [create a service principal](/cli/azure/create-an-azure-service-principal-azure-cli). Or, add one or more certificates to an existing service principal. For example, if you use one of the scripts in this article to create or update a service principal with rights to pull or push images from a registry, add a certificate using the [az ad sp credential reset][az-ad-sp-credential-reset] command.

To use the service principal with certificate to [sign in to the Azure CLI](/cli/azure/authenticate-azure-cli#sign-in-with-a-service-principal), the certificate must be in PEM format and include the private key. If your certificate isn't in the required format, use a tool such as `openssl` to convert it. When you run [az login][az-login] to sign into the CLI using the service principal, also provide the service principal's application ID and the Active Directory tenant ID. The following example shows these values as environment variables:

```azurecli
az login --service-principal --username $SP_APP_ID --tenant $SP_TENANT_ID  --password /path/to/cert/pem/file
```

Then, run [az acr login][az-acr-login] to authenticate with the registry:

```azurecli
az acr login --name myregistry
```

The CLI uses the token created when you ran `az login` to authenticate your session with the registry.

## Create service principal for cross-tenant scenarios

A service principal can also be used in Azure scenarios that require pulling images from a container registry in one Azure Active Directory (tenant) to a service or app in another. For example, an organization might run an app in Tenant A that needs to pull an image from a shared container registry in Tenant B.

To create a service principal that can authenticate with a container registry in a cross-tenant scenario:

* Create a [multitenant app](../active-directory/develop/single-and-multi-tenant-apps.md) (service principal) in Tenant A
* Provision the app in Tenant B
* Grant the service principal permissions to pull from the registry in Tenant B
* Update the service or app in Tenant A to authenticate using the new service principal

For example steps, see [Pull images from a container registry to an AKS cluster in a different AD tenant](authenticate-aks-cross-tenant.md).

## Service principal renewal

The service principal is created with one-year validity. You have options to extend the validity further than one year, or can provide expiry date of your choice using the [`az ad sp credential reset`](/cli/azure/ad/sp/credential#az-ad-sp-credential-reset) command.

## Next steps

* See the [authentication overview](container-registry-authentication.md) for other scenarios to authenticate with an Azure container registry.

* For an example of using an Azure key vault to store and retrieve service principal credentials for a container registry, see the tutorial to [build and deploy a container image using ACR Tasks](container-registry-tutorial-quick-task.md).

<!-- LINKS - External -->
[acr-scripts-cli]: https://github.com/Azure/azure-docs-cli-python-samples/tree/master/container-registry/create-registry/create-registry-service-principal-assign-role.sh
[acr-scripts-psh]: https://github.com/Azure/azure-docs-powershell-samples/tree/master/container-registry

<!-- LINKS - Internal -->
[az-acr-login]: /cli/azure/acr#az_acr_login
[az-login]: /cli/azure/reference-index#az_login
[az-ad-sp-credential-reset]: /cli/azure/ad/sp/credential#az_ad_sp_credential_reset
