---
title: "Use a custom NuGet feed"
services: azure-dev-spaces
author: "zr-msft"
ms.author: "zarhoads"
ms.date: "07/17/2019"
ms.topic: "conceptual"
description: "Use a custom NuGet feed to access and use NuGet packages in an Azure Dev Space."
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers"
manager: gwallace
---
# Use a custom NuGet feed with Azure Dev Spaces

A NuGet feed provides a convenient way to include package sources in a project. Azure Dev Spaces needs to access this feed in order for dependencies to be properly installed in the Docker container.

## Set up a NuGet feed

Add a [package reference](https://docs.microsoft.com/nuget/consume-packages/package-references-in-project-files) for your dependency in the `*.csproj` file under the `PackageReference` node. For example:

```xml
<ItemGroup>
    <!-- ... -->
    <PackageReference Include="Contoso.Utility.UsefulStuff" Version="3.6.0" />
    <!-- ... -->
</ItemGroup>
```

Create a [NuGet.Config](https://docs.microsoft.com/nuget/reference/nuget-config-file) file in the project folder and set the `packageSources` and `packageSourceCredentials` sections for your NuGet feed. The `packageSources` section contains your feed url, which must be accessible from your AKS cluster. The `packageSourceCredentials` are the credentials for accessing the feed. For example:

```xml
<packageSources>
    <add key="Contoso" value="https://contoso.com/packages/" />
</packageSources>

<packageSourceCredentials>
    <Contoso>
        <add key="Username" value="user@contoso.com" />
        <add key="ClearTextPassword" value="33f!!lloppa" />
    </Contoso>
</packageSourceCredentials>
```

Update your Dockerfiles to copy the `NuGet.Config` file to the image. For example:

```console
COPY ["<project folder>/NuGet.Config", "./NuGet.Config"]
```

> [!TIP]
> On Windows, `NuGet.Config`, `Nuget.Config`, and `nuget.config` all works as valid file names. On Linux, only `NuGet.Config` is a valid file name for this file. Since Azure Dev Spaces uses Docker and Linux, this file must be named `NuGet.Config`. You can fix the naming manually or by running `dotnet restore --configfile nuget.config`.


If you are using Git, you should not have the credentials for your NuGet feed in version control. Add `NuGet.Config` to the `.gitignore` for your project so that the `NuGet.Config` file is not added to version control. Azure Dev Spaces will needs this file during the container image build process, but by default, it respects the rules defined in `.gitignore` and `.dockerignore` during synchronization. To change the default and allow Azure Dev Spaces to synchronize the `NuGet.Config` file, update the `azds.yaml` file:

```yaml
build:
useGitIgnore: true
ignore:
- "!NuGet.Config"
```

If you are not using Git, you can skip this step.

The next time you run `azds up` or hit `F5` in Visual Studio Code or Visual Studio, Azure Dev Spaces will synchronize the `NuGet.Config` file use it to install package dependencies.

## Next steps

Learn more about [NuGet and how it works](https://docs.microsoft.com/nuget/what-is-nuget).