---
title: Use the Azurite open-source emulator for blob storage development and testing (preview)
description: The Azurite open-source emulator (preview) provides a free local environment for testing your Azure Blob storage applications.
services: storage
author: mhopkins-msft

ms.service: storage
ms.topic: article
ms.date: 06/12/2019
ms.author: mhopkins
ms.subservice: common
---

# Use the Azurite open-source emulator for blob storage development and testing (preview)

The Azurite version 3 open-source emulator (preview) provides a free local environment for testing your Azure Blob storage applications. When you're satisfied with how your application is working, switch to using an Azure Storage account in the cloud. The emulator provides cross-platform support on Windows, Linux, and MacOS. Azurite v3 supports APIs implemented by the Azure Blob service.

## Install Azurite

There are four different ways to get Azurite installed on your local system:

  1. [Install by using NPM](#install-azurite-by-using-npm)
  1. [Install the Azurite Docker image](#install-the-azurite-docker-image)
  1. [Install the Azurite Visual Studio Code extension](#install-the-azurite-visual-studio-code-extension)
  1. [Clone the Azurite GitHub repository](#clone-the-azurite-github-repository)

Select the method below that works best for you.

### Install Azurite by using NPM

This installation method requires that you have [Node.js version 8.0 or later](https://nodejs.org) installed. **npm** is the package management tool included with every Node.js installation. After installing Node.js, execute the following **npm** command to install Azurite.

```console
npm install -g azurite
```

### Install the Azurite Docker image

Use [DockerHub](https://hub.docker.com/) to install the latest Azurite image with the following command:

```console
docker pull mcr.microsoft.com/azure-storage/azurite
```

<!-- Move all this into a new section on running Azurite using the various platforms -->
**Run the Azurite Docker image**:

The following command runs the Azurite Docker image:

```console
docker run -p 10000:10000 mcr.microsoft.com/azure-storage/azurite
```

The `-p 10000:10000` parameter redirects requests from host machine's port 10000 to the Docker instance.

**Specify the workspace location**:

```console
docker run -p 10000:10000 -v c:/azurite:/data mcr.microsoft.com/azure-storage/azurite
```

The `-v c:/azurite:/data` parameter specifies `c:/azurite` as the Azurite persisted data location.

**Set all Azurite parameters**:

```console
docker run -p 8888:8888 -v c:/azurite:/workspace mcr.microsoft.com/azure-storage/azurite azurite -l /workspace -d /workspace/debug.log --blobPort 8888 --blobHost 0.0.0.0
```

The `-p 8888:8888` parameter redirects requests from host machine's port 8888 to the Docker instance. For more information about command line parameters, see [Command-line syntax](command-line-syntax).

### Install the Azurite Visual Studio Code extension

Search for Azurite in the **EXTENSIONS:MARKETPLACE** inside Visual Studio Code.

Alternatively, install the Azurite extension from the [VS Code extension market](https://marketplace.visualstudio.com/items?itemName=Azurite.azurite).

### Clone the Azurite GitHub repository

This installation method requires that you have [Git](https://git-scm.com/) installed. You'll also want to have a [GitHub account](https://github.com).

Clone the GitHub repository for the project by using the following console command.

```console
git clone https://github.com/Azure/Azurite.git
```

After cloning the source code, execute following commands from the root of the cloned repo to install Azurite.

```console
npm install
npm run build
npm install -g
```

## Command-line syntax

```console
azurite [--blobHost <IP address>] [--blobPort <port address>] [-l | --location <workspace path>] [-s | --silent] [-d | --debug <log file path>]
```

The **-l** switch is a shortcut for **--location**, **-s** is a shortcut for **--silent**, and **-d** is a shortcut for **--debug**.

### Supported command-line options

This section details the command line switches available when launching Azurite. All command-line switches are optional.

#### Listening host

**Optional** By default, Azurite will listen to 127.0.0.1 as the local server. Use the **--blobHost** switch to set the address to your requirements.

Accept requests on the local machine only:

```console
azurite --blobHost 127.0.0.1
```

Allow remote requests (may be unsafe):

```console
azurite --blobHost 0.0.0.0
```

#### Listening port configuration

**Optional** By default, Azurite will listen for the Blob service on port 10000. Use the **--blobPort** switch to specify the listening port that you require.

> [!WARNING]
> After using a customized port, you need to update the connection string or corresponding configuration in your Azure Storage tools or SDKs.

Customize the Blob service listening port:

```console
azurite --blobPort 8888
```

Let the system auto select an available port:

```console
azurite --blobPort 0
```

> [!NOTE]
> The port in use is displayed during Azurite startup.

#### Workspace path

**Optional** Azurite stores data to the local disk during execution. Use the **--location** switch to specify a path as the workspace location. By default, the current process working directory will be used.

```console
azurite -l c:\azurite
```

```console
azurite --location c:\azurite
```

#### Access log

**Optional** By default, the access log is displayed in the console window. Disable the display of the access log by using the **--silent** switch.

```console
azurite -s
```

```console
azurite --silent
```

#### Debug log

**Optional** The debug log includes detailed information on every request and exception stack trace. Enable the debug log by providing a valid local file path to the **--debug** switch.

```console
azurite -d path/debug.log
```

```console
azurite --debug path/debug.log
```

## Run Azurite

Start Azurite by using the following command:

```console
azurite --silent --location c:\azurite --debug c:\azurite\debug.log
```

This command tells Azurite to store all data in a particular directory, **c:\azurite**. If the **--location** option is omitted, it will use the current working directory.

## Authentication for tools and SDKs

You may use any Azure Storage SDKs or tools, like [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/), to connect Azurite with any authentication strategy. Authentication is required. Azurite supports SharedKey, account Shared Access Signature (SAS), Service SAS, and Public Container Access authentications.

### Default Storage Account

Azurite provides support for a General Storage Account v2 and associated features by default.

* Account name: `devstoreaccount1`
* Account key: `Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==`

> [!NOTE]
> In addition to SharedKey authentication, Azurite supports account and service SAS authentication. Anonymous access is also available when a container is set to allow public access.

### Connection string

Typically, you can pass the following connection strings to SDKs or tools. Using the Blob service as an example, the full connection string is:

```
DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;
```

The easiest way to connect to Azurite from your application is to configure a connection string in your application's configuration file that references the shortcut *UseDevelopmentStorage=true*. Here's an example of a connection string in an *app.config* file:

```xml
<appSettings>
  <add key="StorageConnectionString" value="UseDevelopmentStorage=true" />
</appSettings>
```

### Storage Explorer

In Azure Storage Explorer, connect to Azurite by clicking the **Add Account** icon, then select **Attach to a local emulator** and click **Connect**.

## Differences between Azurite and Azure Storage

Because it runs as a local instance, there are functional differences between Azurite and an Azure Storage account in the cloud.

### Storage accounts

Azurite supports a default account as General Storage Account v2 and provides features.

* Account name: `devstoreaccount1`
* Account key: `Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==`

### Endpoint and connection URL

The service endpoints for Azurite are different from the endpoints of an Azure Storage account. The local computer doesn't do domain name resolution, requiring Azurite endpoints to be local addresses.

When you address a resource in an Azure Storage account, use the following scheme. The account name is part of the URI host name. The resource being addressed is part of the URI path:

`<http|https>://<account-name>.<service-name>.core.windows.net/<resource-path>`

As an example, the following URI is a valid address for a blob in an Azure Storage account:

`https://myaccount.blob.core.windows.net/mycontainer/myblob.txt`

Since the local computer doesn't do domain name resolution, the account name is part of the URI path instead of the host name. Use the following URI format for a resource in Azurite:

`http://<local-machine-address>:<port>/<account-name>/<resource-path>`

The following address might be used for accessing a blob in Azurite:

`http://127.0.0.1:10000/myaccount/mycontainer/myblob.txt`

### Scaling and performance

Azurite doesn't scale to support many concurrent clients. There's no performance guarantee. Performance depends highly on the environment in which Azurite is deployed. Azurite is intended for development and testing purposes.

### Error handling

We've tried to align Azurite with Azure Storage error handling logic, but there are differences. For example, error messages may be different, while error status codes will align.

### API version strategy

We strive to make Azurite compatible with Azure Storage APIs:

* An Azurite instance has a baseline Azure Storage API version.
  * A Swagger definition with the same API version will be used to generate protocol layer APIs and interfaces.
  * Azurite should implement all the possible features provided in this API version.
* If an incoming request has the same API version Azurite provides, Azurite should handle the request with parity to Azure Storage.
* If an incoming request has a higher API version than Azurite, Azurite will return a **VersionNotSupportedByEmulator** error (HTTP status code 400 - Bad Request).
* If an incoming request has a lower API version header, the emulator attempts to handle the request with the Azurite baseline API version behavior.
* Azurite will return the API version in the response header as the baseline API version

### RA-GRS

Azurite supports read-access geo-redundant replication (RA-GRS). For storage resources, access the secondary location by appending **-secondary** to the account name. For example, the following address might be used for accessing a blob using the read-only secondary in Azurite:

`http://127.0.0.1:10000/devstoreaccount1-secondary/mycontainer/myblob.txt`

## Azurite is open-source

Contributions and suggestions for Azurite are welcome. Go to the Azurite [GitHub project](https://github.com/Azure/Azurite/projects) page or [GitHub issues](https://github.com/Azure/Azurite/issues) for milestones and work items we're tracking for upcoming features and bug fixes. Detailed work items are also tracked in GitHub.

See the [Contribution](https://github.com/Azure/Azurite/blob/master/CONTRIBUTION.md) file for ways to participate. You can also open GitHub issues voting for any missing features in Azurite.

Most contributions require you to agree to a Contributor License Agreement (CLA). A CLA declares that you have the right to, and actually do, grant us the rights to use your contribution. For details, see [Microsoft Contributor License Agreement](https://cla.microsoft.com).

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide a CLA. The bot will add a label or comment to the pull request. Follow the instructions provided by the bot. You'll only need to provide a CLA once across all our repos.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information, see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with additional questions or comments.

## Next steps

* [Azure Storage samples using .NET](../storage-samples-dotnet.md) contains links to several code samples you can use when developing your application.
