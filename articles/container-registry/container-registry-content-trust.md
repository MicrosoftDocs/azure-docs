---
title: Content trust in Azure Container Registry
description: Learn how to pushed signed images to your Azure container registry.
services: container-registry
author: mmacy
manager: jeconnoc

ms.service: container-registry
ms.topic: quickstart
ms.date: 08/04/2018
ms.author: marsma
---
# Content trust in Azure Container Registry

Important to any distributed system designed with security in mind is verifying both the *source* and the *integrity* of data entering the system. Consumers of the data need to be able to verify both the publisher (source) of the data, as well the ensure it's not been modified after it was published (integrity). Azure Container Registry supports both by implementing Docker's [content trust][docker-content-trust] model, and this article gets you started.

> [!IMPORTANT]
> This feature is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use][terms-of-use]. Some aspects of this feature may change prior to general availability (GA).

## How content trust works

As an image publisher, content trust allows you to **sign** the images you push to your registry. Consumers of your images (people or systems pulling images from your registry) can configure their clients to pull *only* signed images. When an image consumer pulls a signed image, their Docker client verifies the integrity of the image. In this model, consumers are assured that the signed images in your registry were indeed published by you, and that they've not been modified since being published.

### Trusted images

Content trust works with the **tags** in a repository. Image repositories can contain images with both signed and unsigned tags. For example, you might sign only the `myimage:stable` and `myimage:latest` images, but not `myimage:dev`.

### Signing keys

Content trust is managed through the use of a set of cryptographic signing keys. These keys, discussed further in [Push a trusted image](#push-a-trusted-image), are associated with a specific repository in a registry. There are several types of signing keys that Docker clients and your registry use in managing trust for the tags in a repository. When you enable content trust and integrate it into your container publishing and consumption pipeline, you must manage these keys carefully. For more details, see [Manage keys for content trust][docker-manage-keys] in the Docker documentation.

> [!TIP]
> This was a very high-level overview of Docker's content trust model. For an in-depth discussion of content trust, see [Content trust in Docker][docker-content-trust].

## Enable content trust

There are three steps required for using content trust in an Azure container registry:

1. Enable content trust on the registry
1. Enable content trust on clients
1. Grant users or service principals permission to push signed images

## Enable registry content trust

Your first step is to enable content trust at the registry level. Once you enable content trust, clients (users or services) can push signed images to your registry. Enabling content trust on your registry does not restrict registry usage only to consumers with content trust enabled. Consumers without content trust enabled can continue to use your registry as normal, and can pull both signed and unsigned images. Consumers who've enabled content trust in their clients, however, will be able to see *only* signed images in your registry.

To enable content trust for your registry, first navigate to the registry in the Azure portal. Under **POLICIES**, select **Content Trust (Preview)** > **Enabled**.

![Enabling content trust for a registry in the Azure portal][content-trust-01-portal]

## Enable client content trust

To work with trusted images, both image publishers and consumers need to enable content trust in their clients. As a publisher, you can sign the images you push to a content trust-enabled registry. As a consumer, enabling content trust limits your view of a registry to signed images only. Content trust is disabled by default, but you can enable it per command or per shell session.

To enable content trust for a shell session, set the `DOCKER_CONTENT_TRUST` environment variable to **1**. For example, in the Bash shell:

```bash
# Enable content trust for shell session
export DOCKER_CONTENT_TRUST=1
```

If instead you'd like to enable or disable content trust for a single command, several Docker commands support the `--disable-content-trust` argument. To enable content trust for a single command:

```bash
# Enable content trust for single command
docker build --disable-content-trust=false -t myacr.azurecr.io/myimage:v1 .
```

If you've enabled content trust for your shell session and want to disable it for a single command:

```bash
# Disable content trust for single command
docker build --disable-content-trust -t myacr.azurecr.io/myimage:v1 .
```

## Grant image signing permissions

Only the users or systems you've granted permission can push trusted images to your registry. To grant trusted image push permission to a user (or a system using a service principal), grant their Azure Active Directory

### Azure portal

Navigate to your registry in the Azure portal, then select **Access Control (IAM)** > **Add**. Under **Add permissions**, select `AcrImageSigner` under **Role**, then **Select** one or more users or service principals, then **Save**.

In this example, two entities have been assigned the `AcrImageSigner` role: a service principal named "service-principal," and a user named "Azure User."

![Enabling content trust for a registry in the Azure portal][content-trust-02-portal]

### Azure CLI

Grant signing permissions to user:

```bash
# Grant signing permissions to user
REGISTRY=myregistry
USER=$(az account show --query user.name --output tsv)
REGISTRY_ID=$(az acr show --name $REGISTRY --query id --output tsv)

az role assignment create --scope $REGISTRY_ID --role AcrImageSigner --assignee $USER
```

Grant signing permissions to service principal:

```azurecli
az role assignment create --scope resource_id --role AcrImageSigner --assignee 00000000-0000-0000-0000-000000000000
```

## Push a trusted image

To push trusted images and enable image signing, you need to grant yourself or a service principle the `AcrImageSigner`, role in addition to the `Owner` and `Contributor` roles.

## Pull a trusted image

Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu imperdiet diam, in fermentum justo. Mauris interdum bibendum erat, non accumsan quam dictum nec. In congue consequat massa vel pretium. Praesent ullamcorper egestas est, eu hendrerit quam ornare eget. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

## Next steps

The Docker documentation for content trust and

<!-- IMAGES> -->
[content-trust-01-portal]: ./media/container-registry-content-trust/content-trust-01-portal.png
[content-trust-02-portal]: ./media/container-registry-content-trust/content-trust-02-portal.png

<!-- LINKS - external -->
[docker-content-trust]: https://docs.docker.com/engine/security/trust/content_trust
[docker-manage-keys]: https://docs.docker.com/engine/security/trust/trust_key_mng/
[docker-push]: https://docs.docker.com/engine/reference/commandline/push/
[docker-tag]: https://docs.docker.com/engine/reference/commandline/tag/
[terms-of-use]: https://azure.microsoft.com/support/legal/preview-supplemental-terms/

<!-- LINKS - internal -->
[azure-cli]: /cli/azure/install-azure-cli
