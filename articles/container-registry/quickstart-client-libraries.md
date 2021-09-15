---
title: Quickstart - Manage container registry content with client libraries
description: Use this quickstart to manage repositories, images, and artifacts using the Azure Container Registry client library
author: dlepow
ms.topic: quickstart
ms.date: 09/15/2021
ms.author: danlep
ms.custom:
zone_pivot_groups: programming-languages-set-ten       
---

# Quickstart: Use the Azure Container Registry client libraries

::: zone pivot="programming-language-csharp, programming-language-java, programming-language-javascript, programming-language-python"

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

See the [Azure Identity README][dotnet_identity] for more approaches to authenticating with `DefaultAzureCredential`, both locally and in deployment environments.  To connect to registries in non-public Azure clouds, see the [API reference][dotnet_docs].

For more information on using Azure AD with Azure Container Registry, see the [authentication overview](container-registry-authentication.md).

## Examples

Each sample assumes there is a `REGISTRY_ENDPOINT` environment variable set to a string containing the `https://` prefix and the name of the login server, for example "https://myregistry.azurecr.io".

The following samples use synchronous APIs. Asynchronous APIs are identical to their synchronous counterparts, but methods end with the standard .NET `Async` suffix and return a Task.

### List repositories

Iterate through the collection of repositories in the registry.

```C# Snippet:ContainerRegistry_Tests_Samples_CreateClient
// Get the service endpoint from the environment
Uri endpoint = new Uri(Environment.GetEnvironmentVariable("REGISTRY_ENDPOINT"));

// Create a new ContainerRegistryClient
ContainerRegistryClient client = new ContainerRegistryClient(endpoint, new DefaultAzureCredential(),
    new ContainerRegistryClientOptions()
    {
        Audience = ContainerRegistryAudience.AzureResourceManagerPublicCloud
    });

// Get the collection of repository names from the registry
Pageable<string> repositories = client.GetRepositoryNames();
foreach (string repository in repositories)
{
    Console.WriteLine(repository);
}
```

### Set artifact properties

```C# Snippet:ContainerRegistry_Tests_Samples_SetArtifactProperties
// Get the service endpoint from the environment
Uri endpoint = new Uri(Environment.GetEnvironmentVariable("REGISTRY_ENDPOINT"));

// Create a new ContainerRegistryClient and RegistryArtifact to access image operations
ContainerRegistryClient client = new ContainerRegistryClient(endpoint, new DefaultAzureCredential(),
    new ContainerRegistryClientOptions()
    {
        Audience = ContainerRegistryAudience.AzureResourceManagerPublicCloud
    });
RegistryArtifact image = client.GetArtifact("library/hello-world", "latest");

// Set permissions on the v1 image's "latest" tag
image.UpdateTagProperties("latest", new ArtifactTagProperties()
{
    CanWrite = false,
    CanDelete = false
});
```

### Delete images

```C# Snippet:ContainerRegistry_Tests_Samples_DeleteImage
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
Pageable<string> repositoryNames = client.GetRepositoryNames();
foreach (string repositoryName in repositoryNames)
{
    ContainerRepository repository = client.GetRepository(repositoryName);

    // Obtain the images ordered from newest to oldest
    Pageable<ArtifactManifestProperties> imageManifests =
        repository.GetManifestPropertiesCollection(orderBy: ArtifactManifestOrderBy.LastUpdatedOnDescending);

    // Delete images older than the first three.
    foreach (ArtifactManifestProperties imageManifest in imageManifests.Skip(3))
    {
        RegistryArtifact image = repository.GetArtifact(imageManifest.Digest);
        Console.WriteLine($"Deleting image with digest {imageManifest.Digest}.");
        Console.WriteLine($"   Deleting the following tags from the image: ");
        foreach (var tagName in imageManifest.Tags)
        {
            Console.WriteLine($"        {imageManifest.RepositoryName}:{tagName}");
            image.DeleteTag(tagName);
        }
        image.Delete();
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

- [LTS versions of Node.js](https://nodejs.org/about/releases/)
- Latest versions of Safari, Chrome, Edge, and Firefox.

See our [support policy](https://github.com/Azure/azure-sdk-for-js/blob/main/SUPPORT.md) for more details.

### Install the `@azure/container-registry` package

Install the Container Registry client library for JavaScript with `npm`:

```bash
npm install @azure/container-registry
```

### Browser support

#### JavaScript bundle

To use this client library in the browser, first you need to use a bundler. For details, refer to our [bundling documentation](https://aka.ms/AzureSDKBundling).

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

### List repositories

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

### Set artifact properties

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

### Delete images

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

account_url = "https://MYCONTAINERREGISTRY.azurecr.io"
client = ContainerRegistryClient(account_url, DefaultAzureCredential())
```

## Examples

Each sample assumes there is a `CONTAINERREGISTRY_ENDPOINT` environment variable set to a string containing the `https://` prefix and the name of the login server, for example "https://myregistry.azurecr.io".

### Delete three oldest tags in a repository

```python
class DeleteOperations(object):
    def __init__(self):
        load_dotenv(find_dotenv())
        self.account_url = os.environ["CONTAINERREGISTRY_ENDPOINT"]

    def delete_old_tags(self):
        from azure.containerregistry import ContainerRegistryClient, TagOrder
        from azure.identity import DefaultAzureCredential

        # [START list_repository_names]
        account_url = os.environ["CONTAINERREGISTRY_ENDPOINT"]
        credential = DefaultAzureCredential()
        client = ContainerRegistryClient(account_url, credential)

        for repository in client.list_repository_names():
            print(repository)
            # [END list_repository_names]

            # [START list_tag_properties]
            # Keep the three most recent tags, delete everything else
            tag_count = 0
            for tag in client.list_tag_properties(repository, order_by=TagOrder.LAST_UPDATE_TIME_DESCENDING):
                tag_count += 1
                if tag_count > 3:
                    client.delete_tag(repository, tag.name)
            # [END list_tag_properties]
        client.close()
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
