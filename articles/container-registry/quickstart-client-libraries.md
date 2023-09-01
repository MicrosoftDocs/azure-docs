---
title: Quickstart - Manage container registry content with client libraries
description: Use this quickstart to manage repositories, images, and artifacts using the Azure Container Registry client libraries
ms.topic: quickstart
author: tejaswikolli-web
ms.author: tejaswikolli
ms.date: 10/11/2022
zone_pivot_groups: programming-languages-set-fivedevlangs
ms.custom: mode-api, devx-track-azurecli, devx-track-extended-java, devx-track-js, devx-track-python, devx-track-go
ms.devlang: azurecli
---

# Quickstart: Use the Azure Container Registry client libraries

::: zone pivot="programming-language-csharp, programming-language-java, programming-language-javascript, programming-language-python, programming-language-go"

Use this article to get started with the client library for Azure Container Registry. Follow these steps to try out example code for data-plane operations on images and artifacts.

Use the client library for Azure Container Registry to:

* List images or artifacts in a registry
* Obtain metadata for images and artifacts, repositories, and tags
* Set read/write/delete properties on registry items
* Delete images and artifacts, repositories, and tags

Azure Container Registry also has a management library for control-plane operations including registry creation and updates. 

## Prerequisites

* You need an [Azure subscription](https://azure.microsoft.com/free/) and an Azure container registry to use this library.

    To create a new Azure container registry, you can use the [Azure portal](container-registry-get-started-portal.md), [Azure PowerShell](container-registry-get-started-powershell.md), or the [Azure CLI](container-registry-get-started-azure-cli.md). Here's an example using the Azure CLI:

    ```azurecli
    az acr create --name MyContainerRegistry --resource-group MyResourceGroup \
        --location westus --sku Basic
    ```

* Push one or more container images to your registry. For steps, see [Push your first image to your Azure container registry using the Docker CLI](container-registry-get-started-docker-cli.md).

## Key concepts

* An Azure container registry stores *container images* and [OCI artifacts](container-registry-oci-artifacts.md). 
* An image or artifact consists of a *manifest* and *layers*. 
* A manifest describes the layers that make up the image or artifact. It is uniquely identified by its *digest*. 
* An image or artifact can also be *tagged* to give it a human-readable alias. An image or artifact can have zero or more tags associated with it, and each tag uniquely identifies the image. 
* A collection of images or artifacts that share the same name, but have different tags, is a *repository*.

For more information, see [About registries, repositories, and artifacts](container-registry-concepts.md).

::: zone-end

::: zone pivot="programming-language-csharp"

## Get started

[Source code][dotnet_source] | [Package (NuGet)][dotnet_package] | [API reference][dotnet_docs] | [Samples][dotnet_samples]

To develop .NET application code that can connect to an Azure Container Registry instance, you will need the `Azure.Containers.ContainerRegistry` library.

### Install the package

Install the Azure Container Registry client library for .NET with [NuGet][nuget]:

```Powershell
dotnet add package Azure.Containers.ContainerRegistry --prerelease
```

## Authenticate the client

For your application to connect to your registry, you'll need to create a `ContainerRegistryClient` that can authenticate with it. Use the [Azure Identity library][dotnet_identity] to add Azure Active Directory support for authenticating Azure SDK clients with their corresponding Azure services.  

When you're developing and debugging your application locally, you can use your own user to authenticate with your registry. One way to accomplish this is to [authenticate your user with the Azure CLI](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/identity/Azure.Identity#authenticating-via-the-azure-cli) and run your application from this environment. If your application is using a client that has been constructed to authenticate with `DefaultAzureCredential`, it will correctly authenticate with the registry at the specified endpoint.  

```C#
// Create a ContainerRegistryClient that will authenticate to your registry through Azure Active Directory
Uri endpoint = new Uri("https://myregistry.azurecr.io");
ContainerRegistryClient client = new ContainerRegistryClient(endpoint, new DefaultAzureCredential(),
    new ContainerRegistryClientOptions()
    {
        Audience = ContainerRegistryAudience.AzureResourceManagerPublicCloud
    });
```

See the [Azure Identity README][dotnet_identity] for more approaches to authenticating with `DefaultAzureCredential`, both locally and in deployment environments. To connect to registries in non-public Azure clouds, see the [API reference][dotnet_docs].

For more information on using Azure AD with Azure Container Registry, see the [authentication overview](container-registry-authentication.md).

## Examples

Each sample assumes there is a `REGISTRY_ENDPOINT` environment variable set to a string containing the `https://` prefix and the name of the login server, for example "https://myregistry.azurecr.io".

The following samples use asynchronous APIs that return a task. Synchronous APIs are also available.

### List repositories asynchronously

Iterate through the collection of repositories in the registry.

```C# Snippet:ContainerRegistry_Tests_Samples_CreateClientAsync
// Get the service endpoint from the environment
Uri endpoint = new Uri(Environment.GetEnvironmentVariable("REGISTRY_ENDPOINT"));

// Create a new ContainerRegistryClient
ContainerRegistryClient client = new ContainerRegistryClient(endpoint, new DefaultAzureCredential(),
    new ContainerRegistryClientOptions()
    {
        Audience = ContainerRegistryAudience.AzureResourceManagerPublicCloud
    });

// Get the collection of repository names from the registry
AsyncPageable<string> repositories = client.GetRepositoryNamesAsync();
await foreach (string repository in repositories)
{
    Console.WriteLine(repository);
}
```

### Set artifact properties asynchronously

```C# Snippet:ContainerRegistry_Tests_Samples_CreateClientAsync
// Get the service endpoint from the environment
Uri endpoint = new Uri(Environment.GetEnvironmentVariable("REGISTRY_ENDPOINT"));

// Create a new ContainerRegistryClient
ContainerRegistryClient client = new ContainerRegistryClient(endpoint, new DefaultAzureCredential(),
    new ContainerRegistryClientOptions()
    {
        Audience = ContainerRegistryAudience.AzureResourceManagerPublicCloud
    });

// Get the collection of repository names from the registry
AsyncPageable<string> repositories = client.GetRepositoryNamesAsync();
await foreach (string repository in repositories)
{
    Console.WriteLine(repository);
}
```

### Delete images asynchronously

```C# Snippet:ContainerRegistry_Tests_Samples_DeleteImageAsync
using System.Linq;
using Azure.Containers.ContainerRegistry;
using Azure.Identity;

// Get the service endpoint from the environment
Uri endpoint = new Uri(Environment.GetEnvironmentVariable("REGISTRY_ENDPOINT"));

// Create a new ContainerRegistryClient
ContainerRegistryClient client = new ContainerRegistryClient(endpoint, new DefaultAzureCredential(),
    new ContainerRegistryClientOptions()
    {
        Audience = ContainerRegistryAudience.AzureResourceManagerPublicCloud
    });

// Iterate through repositories
AsyncPageable<string> repositoryNames = client.GetRepositoryNamesAsync();
await foreach (string repositoryName in repositoryNames)
{
    ContainerRepository repository = client.GetRepository(repositoryName);

    // Obtain the images ordered from newest to oldest
    AsyncPageable<ArtifactManifestProperties> imageManifests =
        repository.GetManifestPropertiesCollectionAsync(orderBy: ArtifactManifestOrderBy.LastUpdatedOnDescending);

    // Delete images older than the first three.
    await foreach (ArtifactManifestProperties imageManifest in imageManifests.Skip(3))
    {
        RegistryArtifact image = repository.GetArtifact(imageManifest.Digest);
        Console.WriteLine($"Deleting image with digest {imageManifest.Digest}.");
        Console.WriteLine($"   Deleting the following tags from the image: ");
        foreach (var tagName in imageManifest.Tags)
        {
            Console.WriteLine($"        {imageManifest.RepositoryName}:{tagName}");
            await image.DeleteTagAsync(tagName);
        }
        await image.DeleteAsync();
    }
}
```

::: zone-end

::: zone pivot="programming-language-java"

## Get started

[Source code][java_source] | [Package (Maven)][java_package] | [API reference][java_docs] | [Samples][java_samples]

### Currently supported environments

* [Java Development Kit (JDK)][jdk_link], version 8 or later.

### Include the package

[//]: # ({x-version-update-start;com.azure:azure-containers-containerregistry;current})
```xml
<dependency>
  <groupId>com.azure</groupId>
  <artifactId>azure-containers-containerregistry</artifactId>
  <version>1.0.0-beta.3</version>
</dependency>
```
[//]: # ({x-version-update-end})

## Authenticate the client

The [Azure Identity library][java_identity] provides Azure Active Directory support for authentication.

The following samples assume you have a registry endpoint string containing the  `https://` prefix and the name of the login server, for example "https://myregistry.azurecr.io".

<!-- embedme ./src/samples/java/com/azure/containers/containerregistry/ReadmeSamples.java#L31-L35 -->
```Java
DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();
ContainerRegistryClient client = new ContainerRegistryClientBuilder()
    .endpoint(endpoint)
    .credential(credential)
    .buildClient();
```

<!-- embedme ./src/samples/java/com/azure/containers/containerregistry/ReadmeSamples.java#L39-L43 -->
```Java
DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();
ContainerRegistryAsyncClient client = new ContainerRegistryClientBuilder()
    .endpoint(endpoint)
    .credential(credential)
    .buildAsyncClient();
```

For more information on using Azure AD with Azure Container Registry, see the [authentication overview](container-registry-authentication.md).

## Examples

Each sample assumes there is a registry endpoint string containing the `https://` prefix and the name of the login server, for example "https://myregistry.azurecr.io".

### List repository names

Iterate through the collection of repositories in the registry.

<!-- embedme ./src/samples/java/com/azure/containers/containerregistry/ReadmeSamples.java#L47-L53 -->
```Java
DefaultAzureCredential credential = new DefaultAzureCredentialBuilder().build();
ContainerRegistryClient client = new ContainerRegistryClientBuilder()
    .endpoint(endpoint)
    .credential(credential)
    .buildClient();

client.listRepositoryNames().forEach(repository -> System.out.println(repository));
```

### Set artifact properties

<!-- embedme ./src/samples/java/com/azure/containers/containerregistry/ReadmeSamples.java#L119-L132 -->
```Java
TokenCredential defaultCredential = new DefaultAzureCredentialBuilder().build();

ContainerRegistryClient client = new ContainerRegistryClientBuilder()
    .endpoint(endpoint)
    .credential(defaultCredential)
    .buildClient();

RegistryArtifact image = client.getArtifact(repositoryName, digest);

image.updateTagProperties(
    tag,
    new ArtifactTagProperties()
        .setWriteEnabled(false)
        .setDeleteEnabled(false));
```

### Delete images

<!-- embedme ./src/samples/java/com/azure/containers/containerregistry/ReadmeSamples.java#L85-L113 -->
```Java
TokenCredential defaultCredential = new DefaultAzureCredentialBuilder().build();

ContainerRegistryClient client = new ContainerRegistryClientBuilder()
    .endpoint(endpoint)
    .credential(defaultCredential)
    .buildClient();

final int imagesCountToKeep = 3;
for (String repositoryName : client.listRepositoryNames()) {
    final ContainerRepository repository = client.getRepository(repositoryName);

    // Obtain the images ordered from newest to oldest
    PagedIterable<ArtifactManifestProperties> imageManifests =
        repository.listManifestProperties(
            ArtifactManifestOrderBy.LAST_UPDATED_ON_DESCENDING,
            Context.NONE);

    imageManifests.stream().skip(imagesCountToKeep)
        .forEach(imageManifest -> {
            System.out.printf(String.format("Deleting image with digest %s.%n", imageManifest.getDigest()));
            System.out.printf("    This image has the following tags: ");

            for (String tagName : imageManifest.getTags()) {
                System.out.printf("        %s:%s", imageManifest.getRepositoryName(), tagName);
            }

            repository.getArtifact(imageManifest.getDigest()).delete();
        });
}
```

::: zone-end

::: zone pivot="programming-language-javascript"

## Get started

[Source code][javascript_source] | [Package (npm)][javascript_package] | [API reference][javascript_docs] | [Samples][javascript_samples]

### Currently supported environments

- [LTS versions of Node.js](https://github.com/nodejs/release#release-schedule)

See our [support policy](https://github.com/Azure/azure-sdk-for-js/blob/main/SUPPORT.md) for more details.

### Install the `@azure/container-registry` package

Install the Container Registry client library for JavaScript with `npm`:

```bash
npm install @azure/container-registry
```

## Authenticate the client

The [Azure Identity library][javascript_identity] provides Azure Active Directory support for authentication.

```javascript
const { ContainerRegistryClient } = require("@azure/container-registry");
const { DefaultAzureCredential } = require("@azure/identity");

const endpoint = process.env.CONTAINER_REGISTRY_ENDPOINT;
// Create a ContainerRegistryClient that will authenticate through Active Directory
const client = new ContainerRegistryClient(endpoint, new DefaultAzureCredential());
```

For more information on using Azure AD with Azure Container Registry, see the [authentication overview](container-registry-authentication.md).

## Examples

Each sample assumes there is a `CONTAINER_REGISTRY_ENDPOINT` environment variable set to a string containing the `https://` prefix and the name of the login server, for example "https://myregistry.azurecr.io".

### List repositories asynchronously

Iterate through the collection of repositories in the registry.

```javascript
const { ContainerRegistryClient } = require("@azure/container-registry");
const { DefaultAzureCredential } = require("@azure/identity");

async function main() {
  // endpoint should be in the form of "https://myregistryname.azurecr.io"
  // where "myregistryname" is the actual name of your registry
  const endpoint = process.env.CONTAINER_REGISTRY_ENDPOINT || "<endpoint>";
  const client = new ContainerRegistryClient(endpoint, new DefaultAzureCredential());

  console.log("Listing repositories");
  const iterator = client.listRepositoryNames();
  for await (const repository of iterator) {
    console.log(`  repository: ${repository}`);
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
```

### Set artifact properties asynchronously

```javascript
const { ContainerRegistryClient } = require("@azure/container-registry");
const { DefaultAzureCredential } = require("@azure/identity");

async function main() {
  // Get the service endpoint from the environment
  const endpoint = process.env.CONTAINER_REGISTRY_ENDPOINT || "<endpoint>";

  // Create a new ContainerRegistryClient and RegistryArtifact to access image operations
  const client = new ContainerRegistryClient(endpoint, new DefaultAzureCredential());
  const image = client.getArtifact("library/hello-world", "v1");

  // Set permissions on the image's "latest" tag
  await image.updateTagProperties("latest", { canWrite: false, canDelete: false });
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
```

### Delete images asynchronously

```javascript
const { ContainerRegistryClient } = require("@azure/container-registry");
const { DefaultAzureCredential } = require("@azure/identity");

async function main() {
  // Get the service endpoint from the environment
  const endpoint = process.env.CONTAINER_REGISTRY_ENDPOINT || "<endpoint>";
  // Create a new ContainerRegistryClient
  const client = new ContainerRegistryClient(endpoint, new DefaultAzureCredential());

  // Iterate through repositories
  const repositoryNames = client.listRepositoryNames();
  for await (const repositoryName of repositoryNames) {
    const repository = client.getRepository(repositoryName);
    // Obtain the images ordered from newest to oldest by passing the `orderBy` option
    const imageManifests = repository.listManifestProperties({
      orderBy: "LastUpdatedOnDescending"
    });
    const imagesToKeep = 3;
    let imageCount = 0;
    // Delete images older than the first three.
    for await (const manifest of imageManifests) {
      imageCount++;
      if (imageCount > imagesToKeep) {
        const image = repository.getArtifact(manifest.digest);
        console.log(`Deleting image with digest ${manifest.digest}`);
        console.log(`  Deleting the following tags from the image:`);
        for (const tagName of manifest.tags) {
          console.log(`    ${manifest.repositoryName}:${tagName}`);
          image.deleteTag(tagName);
        }
        await image.delete();
      }
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
```

::: zone-end

::: zone pivot="programming-language-python"

## Get started

[Source code][python_source] | [Package (Pypi)][python_package] | [API reference][python_docs] | [Samples][python_samples]

### Install the package

Install the Azure Container Registry client library for Python with [pip][pip_link]:

```bash
pip install --pre azure-containerregistry
```

## Authenticate the client

The [Azure Identity library][python_identity] provides Azure Active Directory support for authentication. The `DefaultAzureCredential` assumes the `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, and `AZURE_CLIENT_SECRET` environment variables are set. For more information, see [Azure Identity environment variables](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/identity/azure-identity#environment-variables).

```python
# Create a ContainerRegistryClient that will authenticate through Active Directory
from azure.containerregistry import ContainerRegistryClient
from azure.identity import DefaultAzureCredential

account_url = "https://mycontainerregistry.azurecr.io"
client = ContainerRegistryClient(account_url, DefaultAzureCredential())
```

## Examples

Each sample assumes there is a `CONTAINERREGISTRY_ENDPOINT` environment variable set to a string containing the `https://` prefix and the name of the login server, for example "https://myregistry.azurecr.io".

### List tags asynchronously

This sample assumes the registry has a repository `hello-world`.

```python
import asyncio
from dotenv import find_dotenv, load_dotenv
import os

from azure.containerregistry.aio import ContainerRegistryClient
from azure.identity.aio import DefaultAzureCredential


class ListTagsAsync(object):
    def __init__(self):
        load_dotenv(find_dotenv())

    async def list_tags(self):
        # Create a new ContainerRegistryClient      
        audience = "https://management.azure.com"
        account_url = os.environ["CONTAINERREGISTRY_ENDPOINT"]
        credential = DefaultAzureCredential()
        client = ContainerRegistryClient(account_url, credential, audience=audience)

        manifest = await client.get_manifest_properties("library/hello-world", "latest")
        print(manifest.repository_name + ": ")
        for tag in manifest.tags:
            print(tag + "\n")
```

### Set artifact properties asynchronously

This sample assumes the registry has a repository `hello-world` with image tagged `v1`.

```python
import asyncio
from dotenv import find_dotenv, load_dotenv
import os

from azure.containerregistry.aio import ContainerRegistryClient
from azure.identity.aio import DefaultAzureCredential


class SetImagePropertiesAsync(object):
    def __init__(self):
        load_dotenv(find_dotenv())

    async def set_image_properties(self):
        # Create a new ContainerRegistryClient
        account_url = os.environ["CONTAINERREGISTRY_ENDPOINT"]
        audience = "https://management.azure.com"
        credential = DefaultAzureCredential()
        client = ContainerRegistryClient(account_url, credential, audience=audience)

        # [START update_manifest_properties]
        # Set permissions on the v1 image's "latest" tag
        await client.update_manifest_properties(
            "library/hello-world",
            "latest",
            can_write=False,
            can_delete=False
        )
        # [END update_manifest_properties]
        # After this update, if someone were to push an update to "myacr.azurecr.io\hello-world:v1", it would fail.
        # It's worth noting that if this image also had another tag, such as "latest", and that tag did not have
        # permissions set to prevent reads or deletes, the image could still be overwritten. For example,
        # if someone were to push an update to "myacr.azurecr.io\hello-world:latest"
        # (which references the same image), it would succeed.
```

### Delete images asynchronously

```python
import asyncio
from dotenv import find_dotenv, load_dotenv
import os

from azure.containerregistry import ManifestOrder
from azure.containerregistry.aio import ContainerRegistryClient
from azure.identity.aio import DefaultAzureCredential


class DeleteImagesAsync(object):
    def __init__(self):
        load_dotenv(find_dotenv())

    async def delete_images(self):
        # [START list_repository_names]   
        audience = "https://management.azure.com"
        account_url = os.environ["CONTAINERREGISTRY_ENDPOINT"]
        credential = DefaultAzureCredential()
        client = ContainerRegistryClient(account_url, credential, audience=audience)

        async with client:
            async for repository in client.list_repository_names():
                print(repository)
                # [END list_repository_names]

                # [START list_manifest_properties]
                # Keep the three most recent images, delete everything else
                manifest_count = 0
                async for manifest in client.list_manifest_properties(repository, order_by=ManifestOrder.LAST_UPDATE_TIME_DESCENDING):
                    manifest_count += 1
                    if manifest_count > 3:
                        await client.delete_manifest(repository, manifest.digest)
                # [END list_manifest_properties]
```

::: zone-end

::: zone pivot="programming-language-go"

## Get started

[Source code][go_source] | [Package (pkg.go.dev)][go_package] | [REST API reference][go_docs]

### Install the package

Install the Azure Container Registry client library for Go with `go get`:

```bash
go get github.com/Azure/azure-sdk-for-go/sdk/containers/azcontainerregistry
```

## Authenticate the client

When you're developing and debugging your application locally, you can use [azidentity.NewDefaultAzureCredential](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity#NewDefaultAzureCredential) to authenticate. We recommend using a [managed identity](/azure/active-directory/managed-identities-azure-resources/overview) in a production environment. 

```go
import (
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/containers/azcontainerregistry"
	"log"
)

func main() {
	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("failed to obtain a credential: %v", err)
	}

	client, err := azcontainerregistry.NewClient("https://myregistry.azurecr.io", cred, nil)
	if err != nil {
		log.Fatalf("failed to create client: %v", err)
	}
}
```
See the [azidentity](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/azidentity) documentation for more information about other authentication approaches.

## Examples

Each sample assumes the container registry endpoint URL is "https://myregistry.azurecr.io".

### List tags

This sample assumes the registry has a repository `hello-world`.

```go
import (
	"context"
	"fmt"
	"github.com/Azure/azure-sdk-for-go/sdk/containers/azcontainerregistry"
	"log"
)

func Example_listTagsWithAnonymousAccess() {
	client, err := azcontainerregistry.NewClient("https://myregistry.azurecr.io", nil, nil)
	if err != nil {
		log.Fatalf("failed to create client: %v", err)
	}
	ctx := context.Background()
	pager := client.NewListTagsPager("library/hello-world", nil)
	for pager.More() {
		page, err := pager.NextPage(ctx)
		if err != nil {
			log.Fatalf("failed to advance page: %v", err)
		}
		for _, v := range page.Tags {
			fmt.Printf("tag: %s\n", *v.Name)
		}
	}
}
```

### Set artifact properties

This sample assumes the registry has a repository `hello-world` with image tagged `latest`.

```go
package azcontainerregistry_test

import (
	"context"
	"fmt"
	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/containers/azcontainerregistry"
	"log"
)

func Example_setArtifactProperties() {
	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("failed to obtain a credential: %v", err)
	}
	client, err := azcontainerregistry.NewClient("https://myregistry.azurecr.io", cred, nil)
	if err != nil {
		log.Fatalf("failed to create client: %v", err)
	}
	ctx := context.Background()
	res, err := client.UpdateTagProperties(ctx, "library/hello-world", "latest", &azcontainerregistry.ClientUpdateTagPropertiesOptions{
		Value: &azcontainerregistry.TagWriteableProperties{
			CanWrite:  to.Ptr(false),
			CanDelete: to.Ptr(false),
		}})
	if err != nil {
		log.Fatalf("failed to finish the request: %v", err)
	}
	fmt.Printf("repository library/hello-world - tag latest: 'CanWrite' property: %t, 'CanDelete' property: %t\n", *res.Tag.ChangeableAttributes.CanWrite, *res.Tag.ChangeableAttributes.CanDelete)
}
```

### Delete images

```go
package azcontainerregistry_test

import (
	"context"
	"fmt"
	"github.com/Azure/azure-sdk-for-go/sdk/azcore/to"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/Azure/azure-sdk-for-go/sdk/containers/azcontainerregistry"
	"log"
)

func Example_deleteImages() {
	cred, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("failed to obtain a credential: %v", err)
	}
	client, err := azcontainerregistry.NewClient("https://myregistry.azurecr.io", cred, nil)
	if err != nil {
		log.Fatalf("failed to create client: %v", err)
	}
	ctx := context.Background()
	repositoryPager := client.NewListRepositoriesPager(nil)
	for repositoryPager.More() {
		repositoryPage, err := repositoryPager.NextPage(ctx)
		if err != nil {
			log.Fatalf("failed to advance repository page: %v", err)
		}
		for _, r := range repositoryPage.Repositories.Names {
			manifestPager := client.NewListManifestsPager(*r, &azcontainerregistry.ClientListManifestsOptions{
				OrderBy: to.Ptr(azcontainerregistry.ArtifactManifestOrderByLastUpdatedOnDescending),
			})
			for manifestPager.More() {
				manifestPage, err := manifestPager.NextPage(ctx)
				if err != nil {
					log.Fatalf("failed to advance manifest page: %v", err)
				}
				imagesToKeep := 3
				for i, m := range manifestPage.Manifests.Attributes {
					if i >= imagesToKeep {
						for _, t := range m.Tags {
							fmt.Printf("delete tag from image: %s", *t)
							_, err := client.DeleteTag(ctx, *r, *t, nil)
							if err != nil {
								log.Fatalf("failed to delete tag: %v", err)
							}
						}
						_, err := client.DeleteManifest(ctx, *r, *m.Digest, nil)
						if err != nil {
							log.Fatalf("failed to delete manifest: %v", err)
						}
						fmt.Printf("delete image with digest: %s", *m.Digest)
					}
				}
			}
		}
	}
}
```

::: zone-end

## Clean up resources

If you want to clean up and remove an Azure container registry, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

* [Portal](container-registry-get-started-portal.md#clean-up-resources)
* [Azure CLI](container-registry-get-started-azure-cli.md#clean-up-resources)

## Next steps

In this quickstart, you learned about using the Azure Container Registry client library to perform operations on images and artifacts in your container registry.

* For more information, see the API reference documentation:

    * [.NET][dotnet_docs]
    * [Java][java_docs]
    * [JavaScript][javascript_docs]
    * [Python][python_docs]

* Learn about the Azure Container Registry [REST API][rest_docs].

[dotnet_source]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/containerregistry/Azure.Containers.ContainerRegistry/src
[dotnet_package]: https://www.nuget.org/packages/Azure.Containers.ContainerRegistry/
[dotnet_samples]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/containerregistry/Azure.Containers.ContainerRegistry/samples
[dotnet_docs]: /dotnet/api/azure.containers.containerregistry
[rest_docs]: /rest/api/containerregistry/
[product_docs]:  container-registry-intro.md
[nuget]: https://www.nuget.org/
[dotnet_identity]: https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/identity/Azure.Identity/README.md
[javascript_identity]: https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/identity/identity/README.md
[javascript_source]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/containerregistry/container-registry/src
[javascript_package]: https://www.npmjs.com/package/@azure/container-registry
[javascript_docs]: /javascript/api/overview/azure/container-registry-readme
[jdk_link]: /java/azure/jdk/
[javascript_samples]: https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/containerregistry/container-registry/samples
[java_source]: https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/containerregistry/azure-containers-containerregistry/src
[java_package]: https://search.maven.org/artifact/com.azure/azure-containers-containerregistry
[java_docs]: /java/api/overview/azure/containers-containerregistry-readme
[java_identity]: https://github.com/Azure/azure-sdk-for-java/blob/master/sdk/identity/azure-identity/README.md
[java_samples]: https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/containerregistry/azure-containers-containerregistry/src/samples/
[python_package]: https://pypi.org/project/azure-containerregistry/
[python_docs]: /python/api/overview/azure/containerregistry-readme
[python_samples]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/containerregistry/azure-containerregistry/samples
[pip_link]: https://pypi.org
[python_identity]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/identity/azure-identity
[python_source]: https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/containerregistry/azure-containerregistry
[go_source]: https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/containers/azcontainerregistry
[go_package]: https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/containers/azcontainerregistry
[go_docs]: /rest/api/containerregistry/
