---
title: Use Azurite emulator for local Azure Storage development
description: The Azurite open-source emulator provides a free local environment for testing your Azure storage applications.
author: pauljewellmsft
ms.author: pauljewell
ms.date: 07/11/2023
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Use the Azurite emulator for local Azure Storage development

The Azurite open-source emulator provides a free local environment for testing your Azure Blob, Queue Storage, and Table Storage applications. When you're satisfied with how your application is working locally, switch to using an Azure Storage account in the cloud. The emulator provides cross-platform support on Windows, Linux, and macOS.

Azurite supersedes the [Azure Storage Emulator](storage-use-emulator.md), and continues to be updated to support the latest versions of Azure Storage APIs.

There are several different ways to install and run Azurite on your local system. Select any of these tabs.

## Install Azurite

### [Visual Studio](#tab/visual-studio)

Azurite is automatically available with [Visual Studio 2022](https://visualstudio.microsoft.com/vs/). The Azurite executable is updated as part of Visual Studio new version releases. If you're running an earlier version of Visual Studio, you can install Azurite by using either Node Package Manager, DockerHub, or by cloning the Azurite GitHub repository. 

### [Visual Studio Code](#tab/visual-studio-code)

Within Visual Studio Code, select the **EXTENSIONS** pane and search for *Azurite* in the **EXTENSIONS:MARKETPLACE**.

![Visual Studio Code extensions marketplace](media/storage-use-azurite/azurite-vs-code-extension.png)

You can also navigate to [Visual Studio Code extension market](https://marketplace.visualstudio.com/items?itemName=Azurite.azurite) in your browser. Select the **Install** button to open Visual Studio Code and go directly to the Azurite extension page.

To configure Azurite within Visual Studio Code, select the extensions pane. Select the **Manage** (gear) icon for **Azurite**. Select **Extension Settings**.

![Azurites configure extension settings](media/storage-use-azurite/azurite-configure-extension-settings.png)

The following settings are supported:

   - **azurite.blobHost** - The Blob service listening endpoint. The default setting is 127.0.0.1.
   - **azurite.blobPort** - The Blob service listening port. The default port is 10000.
   - **azurite.queueHost** - The Queue service listening endpoint. The default setting is 127.0.0.1.
   - **azurite.queuePort** - The Queue service listening port. The default port is 10001.
   - **azurite.tableHost** - The Table service listening endpoint, by default setting is 127.0.0.1.
   - **azurite.tablePort** - The Table service listening port, by default 10002.
   - **azurite.cert** - Path to a locally trusted PEM or PFX certificate file path to enable HTTPS mode.
   - **azurite.debug** - Output the debug log to the Azurite channel. The default value is **false**.
   - **azurite.key** - Path to a locally trusted PEM key file, required when 
   - **azurite.location** - The workspace location path. The default is the Visual Studio Code working folder.
   - **azurite.loose** - Enable loose mode, which ignores unsupported headers and parameters.
   - **azurite.oauth** - Optional OAuth level.
   - **azurite.pwd** - Password for PFX file. Required when **Azurite: Cert** points to a PFX file.

   - **azurite.silent** - Silent mode disables the access log. The default value is **false**.
   - **azurite.skipApiVersionCheck** - Skip the request API version check. The default value is **false**.
   - **azurite.disableProductStyleUrl** Force the parsing of the storage account name from request Uri path, instead of from request Uri host.


### [npm](#tab/npm)

This installation method requires that you have [Node.js version 8.0 or later](https://nodejs.org) installed. Node Package Manager (npm) is the package management tool included with every Node.js installation. After installing Node.js, execute the following `npm` command to install Azurite.

```console
npm install -g azurite
```

### [Docker Hub](#tab/docker-hub)

Use [DockerHub](https://hub.docker.com/) to pull the [latest Azurite image](https://hub.docker.com/_/microsoft-azure-storage-azurite) by using the following command:

```console
docker pull mcr.microsoft.com/azure-storage/azurite
```

### [GitHub](#tab/github)

This installation method requires that you have [Git](https://git-scm.com/) and [Node.js version 8.0 or later](https://nodejs.org) installed. Clone the [GitHub repository](https://github.com/azure/azurite) for the Azurite project by using the following console command.

```console
git clone https://github.com/Azure/Azurite.git
```

After cloning the source code, execute following commands from the root of the cloned repo to build and install Azurite.

```console
npm install
npm run build
npm install -g
```

---

## Run Azurite

### [Visual Studio](#tab/visual-studio)

To use Azurite with most project types in Visual Studio, you first need to run the Azurite executable. Once the executable is running, Azurite listens for connection requests from the application. To learn more, see [Running Azurite from the command line](#running-azurite-from-the-command-line).

For **Azure Functions** projects and **ASP.NET** projects, you can choose to configure the project to start Azurite automatically. This configuration is done during the project setup. While this project configuration starts Azurite automatically, Visual Studio doesn't expose detailed Azurite configuration options. To customize detailed Azurite configuration options, [run the Azurite executable](#running-azurite-from-the-command-line) before launching Visual Studio.

To learn more about configuring **Azure Functions** projects and **ASP.NET** projects to start Azurite automatically, see the following guidance:

- [Running Azurite from an Azure Functions project](#running-azurite-from-an-azure-functions-project)
- [Running Azurite from an ASP.NET project](#running-azurite-from-an-aspnet-project)

#### Azurite executable file location

The following table shows the location of the Azurite executable for different versions of Visual Studio running on a Windows machine:

| Visual Studio version | Azurite executable location |
| --- | --- |
| Visual Studio Community 2022 | `C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\Extensions\Microsoft\Azure Storage Emulator` |
| Visual Studio Professional 2022 | `C:\Program Files\Microsoft Visual Studio\2022\Professional\Common7\IDE\Extensions\Microsoft\Azure Storage Emulator` |
| Visual Studio Enterprise 2022 | `C:\Program Files\Microsoft Visual Studio\2022\Enterprise\Common7\IDE\Extensions\Microsoft\Azure Storage Emulator` | 

#### Running Azurite from the command line

You can find the Azurite executable file in the extensions folder of your Visual Studio installation, as detailed in the [Azurite executable file location table](#azurite-executable-file-location).

Navigate to the appropriate location and start `azurite.exe`. After you run the executable file, Azurite listens for connections. 

> [!div class="mx-imgBorder"]
> ![Azurite command-line output](media/storage-use-azurite/azurite-command-line-output-vs.png)

To learn more about available command line options to configure Azurite, see [Command line options](#command-line-options).

#### Running Azurite from an Azure Functions project

In Visual Studio 2022, create an **Azure Functions** project. While setting the project options, mark the box labeled **Use Azurite for runtime storage account**.

:::image type="content" source="./media/storage-use-azurite/azurite-azure-functions.png" alt-text="A screenshot showing how to set Azurite to be the runtime storage account for an Azure Functions project." lightbox="media/storage-use-azurite/azurite-azure-functions.png":::

After you create the project, Azurite starts automatically. The location of the Azurite executable file is detailed in the [Azurite executable file location table](#azurite-executable-file-location). The output looks similar to the following screenshot:

:::image type="content" source="./media/storage-use-azurite/azurite-azure-functions-output.png" alt-text="A screenshot showing output after setting Azurite to be the runtime storage account for an Azure Functions project." lightbox="media/storage-use-azurite/azurite-azure-functions-output.png":::

This configuration option can be changed later by modifying the project's **Connected Services** dependencies.

#### Running Azurite from an ASP.NET project

In Visual Studio 2022, create an **ASP.NET Core Web App** project. Then, open the **Connected Services** dialog box, select **Add a service dependency**, and then select **Storage Azurite emulator**.

:::image type="content" source="./media/storage-use-azurite/azurite-aspnet-connect.png" alt-text="A screenshot showing how to add Azurite as a dependency to an ASP.NET project." lightbox="media/storage-use-azurite/azurite-aspnet-connect.png":::

In the **Configure Storage Azurite emulator** dialog box, set the **Connection string name** field to `StorageConnectionString`, and then select **Finish**.

:::image type="content" source="./media/storage-use-azurite/azurite-aspnet-connection-string.png" alt-text="A screenshot showing how to configure a connection string to use Azurite with an ASP.NET project." lightbox="media/storage-use-azurite/azurite-aspnet-connection-string.png":::

When the configuration completes, select **Close**, and the Azurite emulator starts automatically. The location of the Azurite executable file is detailed in the [Azurite executable file location table](#azurite-executable-file-location). The output looks similar to the following screenshot:

:::image type="content" source="./media/storage-use-azurite/azurite-aspnet-output.png" alt-text="A screenshot showing output after connecting an ASP.NET project to the Azurite emulator." lightbox="media/storage-use-azurite/azurite-aspnet-output.png":::

This configuration option can be changed later by modifying the project's **Connected Services** dependencies.

### [Visual Studio Code](#tab/visual-studio-code)

> [!NOTE]
> Azurite cannot be run from the command line if you only installed the Visual Studio Code extension. Instead, use the Visual Studio Code command palette.

The extension supports the following Visual Studio Code commands. To open the command palette, press F1 in Visual Studio Code.

   - **Azurite: Clean** - Reset all Azurite services persistency data
   - **Azurite: Clean Blob Service** - Clean blob service
   - **Azurite: Clean Queue Service** - Clean queue service
   - **Azurite: Clean Table Service** - Clean table service
   - **Azurite: Close** - Close all Azurite services
   - **Azurite: Close Blob Service** - Close blob service
   - **Azurite: Close Queue Service** - Close queue service
   - **Azurite: Close Table Service** - Close table service
   - **Azurite: Start** - Start all Azurite services
   - **Azurite: Start Blob Service** - Start blob service
   - **Azurite: Start Queue Service** - Start queue service
   - **Azurite: Start Table Service** - Start table service

### [npm](#tab/npm)

Launch Azurite by issuing the following command:

```console
azurite --silent --location c:\azurite --debug c:\azurite\debug.log
```

This command tells Azurite to store all data in a particular directory, *c:\azurite*. If the `--location` option is omitted, it uses the current working directory.

### [Docker Hub](#tab/docker-hub)

**Run the Azurite Docker image**:

The following command runs the Azurite Docker image. The `-p 10000:10000` parameter redirects requests from host machine's port 10000 to the Docker instance.

```console
docker run -p 10000:10000 -p 10001:10001 -p 10002:10002 \
    mcr.microsoft.com/azure-storage/azurite
```

**Specify the workspace location**:

In the following example, the `-v c:/azurite:/data` parameter specifies *c:/azurite* as the Azurite persisted data location. The directory, *c:/azurite*, must be created before running the Docker command.

```console
docker run -p 10000:10000 -p 10001:10001 -p 10002:10002 \
    -v c:/azurite:/data mcr.microsoft.com/azure-storage/azurite
```

**Run just the blob service**

```console
docker run -p 10000:10000 mcr.microsoft.com/azure-storage/azurite \
    azurite-blob --blobHost 0.0.0.0 --blobPort 10000
```

For more information about configuring Azurite at start-up, see [Command-line options](#command-line-options).

### [GitHub](#tab/github)

To get started immediately with the command line, create a directory called *c:\azurite*, then launch Azurite by issuing the following command:

```console
azurite --silent --location c:\azurite --debug c:\azurite\debug.log
```

This command tells Azurite to store all data in a particular directory, *c:\azurite*. If the `--location` option is omitted, it uses the current working directory.

---

## Command-line options

This section details the command line switches available when launching Azurite.

### Help

**Optional** - Get command-line help by using the `-h` or `--help` switch.

```console
azurite -h
azurite --help
```

### Blob listening host

**Optional** - By default, Azurite listens to 127.0.0.1 as the local server. Use the `--blobHost` switch to set the address to your requirements.

Accept requests on the local machine only:

```console
azurite --blobHost 127.0.0.1
```

Allow remote requests:

```console
azurite --blobHost 0.0.0.0
```

> [!CAUTION]
> Allowing remote requests may make your system vulnerable to external attacks.

### Blob listening port configuration

**Optional** - By default, Azurite listens for the Blob service on port 10000. Use the `--blobPort` switch to specify the listening port that you require.

> [!NOTE]
> After using a customized port, you need to update the connection string or corresponding configuration in your Azure Storage tools or SDKs.

Customize the Blob service listening port:

```console
azurite --blobPort 8888
```

Let the system auto select an available port:

```console
azurite --blobPort 0
```

The port in use is displayed during Azurite startup.

### Queue listening host

**Optional** - By default, Azurite listens to 127.0.0.1 as the local server. Use the `--queueHost` switch to set the address to your requirements.

Accept requests on the local machine only:

```console
azurite --queueHost 127.0.0.1
```

Allow remote requests:

```console
azurite --queueHost 0.0.0.0
```

> [!CAUTION]
> Allowing remote requests may make your system vulnerable to external attacks.

### Queue listening port configuration

**Optional** - By default, Azurite listens for the Queue service on port 10001. Use the `--queuePort` switch to specify the listening port that you require.

> [!NOTE]
> After using a customized port, you need to update the connection string or corresponding configuration in your Azure Storage tools or SDKs.

Customize the Queue service listening port:

```console
azurite --queuePort 8888
```

Let the system auto select an available port:

```console
azurite --queuePort 0
```

The port in use is displayed during Azurite startup.

### Table listening host

**Optional** - By default, Azurite listens to 127.0.0.1 as the local server. Use the `--tableHost` switch to set the address to your requirements.

Accept requests on the local machine only:

```console
azurite --tableHost 127.0.0.1
```

Allow remote requests:

```console
azurite --tableHost 0.0.0.0
```

> [!CAUTION]
> Allowing remote requests may make your system vulnerable to external attacks.

### Table listening port configuration

**Optional** - By default, Azurite listens for the Table service on port 10002. Use the `--tablePort` switch to specify the listening port that you require.

> [!NOTE]
> After using a customized port, you need to update the connection string or corresponding configuration in your Azure Storage tools or SDKs.

Customize the Table service listening port:

```console
azurite --tablePort 11111
```

Let the system auto select an available port:

```console
azurite --tablePort 0
```

The port in use is displayed during Azurite startup.

### Workspace path

**Optional** - Azurite stores data to the local disk during execution. Use the `-l` or `--location` switch to specify a path as the workspace location. By default, the current process working directory is used. Note the lowercase 'l'.

```console
azurite -l c:\azurite
azurite --location c:\azurite
```

### Access log

**Optional** - By default, the access log is displayed in the console window. Disable the display of the access log by using the `-s` or `--silent` switch.

```console
azurite -s
azurite --silent
```


### Debug log

**Optional** - The debug log includes detailed information on every request and exception stack trace. Enable the debug log by providing a valid local file path to the `-d` or `--debug` switch.

```console
azurite -d path/debug.log
azurite --debug path/debug.log
```

### Loose mode

**Optional** - By default, Azurite applies strict mode to block unsupported request headers and parameters. Disable strict mode by using the `-L` or `--loose` switch. Note the capital 'L'.

```console
azurite -L
azurite --loose
```


### Version

**Optional** - Display the installed Azurite version number by using the `-v` or `--version` switch.

```console
azurite -v
azurite --version
```

### Certificate configuration (HTTPS)

**Optional** - By default, Azurite uses the HTTP protocol. Enable HTTPS mode by providing a path to a Privacy Enhanced Mail (.pem) or [Personal Information Exchange (.pfx)](/windows-hardware/drivers/install/personal-information-exchange---pfx--files) certificate file to the `--cert` switch.

When `--cert` is provided for a PEM file, you must provide a corresponding `--key` switch.

```console
azurite --cert path/server.pem --key path/key.pem
```

When `--cert` is provided for a PFX file, you must provide a corresponding `--pwd` switch.

```console
azurite --cert path/server.pfx --pwd pfxpassword
```

For detailed information on creating PEM and PFX files, see [HTTPS Setup](https://github.com/Azure/Azurite/blob/master/README.md#https-setup).

### OAuth configuration

**Optional** - Enable OAuth authentication for Azurite by using the `--oauth` switch.

```console
azurite --oauth basic --cert path/server.pem --key path/key.pem
```

> [!NOTE]
> OAuth requires an HTTPS endpoint. Make sure HTTPS is enabled by providing `--cert` switch along with the `--oauth` switch.

Azurite supports basic authentication by specifying the `basic` parameter to the `--oauth` switch. Azurite performs basic authentication, like validating the incoming bearer token, checking the issuer, audience, and expiry. Azurite doesn't check the token signature or permissions. To learn more about authorization, see [Authorization for tools and SDKs](#authorization-for-tools-and-sdks).

### Skip API Version Check

**Optional** - When starting up, Azurite checks that the requested API version is valid. The following command skips the API version check:

```console
azurite --skipApiVersionCheck
```

### Disable Production Style Url

**Optional**. When using the fully qualified domain name instead of the IP in request Uri host, by default Azurite parses the storage account name from request Uri host. You can force the parsing of the storage account name from request Uri path by using `--disableProductStyleUrl`:

```cmd
azurite --disableProductStyleUrl
```

## Authorization for tools and SDKs

Connect to Azurite from Azure Storage SDKs or tools, like [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/), by using any authentication strategy. Authentication is required. Azurite supports authorization with OAuth, Shared Key, and shared access signatures (SAS). Azurite also supports anonymous access to public containers.

If you're using the Azure SDKs, start Azurite with the `--oauth basic and --cert --key/--pwd` options. To learn more about using Azurite with the Azure SDKs, see [Azure SDKs](#azure-sdks).

### Well-known storage account and key

Azurite accepts the same well-known account and key used by the legacy Azure Storage Emulator.

- Account name: `devstoreaccount1`
- Account key: `Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==`

### Custom storage accounts and keys

Azurite supports custom storage account names and keys by setting the `AZURITE_ACCOUNTS` environment variable in the following format: `account1:key1[:key2];account2:key1[:key2];...`. 

For example, use a custom storage account that has one key:

```cmd
set AZURITE_ACCOUNTS="account1:key1"
```

```bash
export AZURITE_ACCOUNTS="account1:key1"
```

> [!NOTE]
> The account keys must be a base64 encoded string.

Or use multiple storage accounts with two keys each:

```cmd
set AZURITE_ACCOUNTS="account1:key1:key2;account2:key1:key2"
```

```bash
export AZURITE_ACCOUNTS="account1:key1:key2;account2:key1:key2"
```

Azurite refreshes custom account names and keys from the environment variable every minute by default. With this feature, you can dynamically rotate the account key, or add new storage accounts without restarting Azurite.

> [!NOTE]
> The default `devstoreaccount1` storage account is disabled when you set custom storage accounts.

The account keys must be a base64 encoded string.

### Connection strings

The easiest way to connect to Azurite from your application is to configure a connection string in your application's configuration file that references the shortcut *UseDevelopmentStorage=true*. Here's an example of a connection string in an *app.config* file:

```xml
<appSettings>
  <add key="StorageConnectionString" value="UseDevelopmentStorage=true" />
</appSettings>
```

#### HTTP connection strings

You can pass the following connection strings to the [Azure SDKs](https://aka.ms/azsdk) or tools, like Azure CLI 2.0 or Storage Explorer.

The full connection string is:

`DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;`

To connect to the blob service only, the connection string is:

`DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;`

To connect to the queue service only, the connection string is:

`DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;`

To connect to the table service only, the connection string is:

`DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;`

#### HTTPS connection strings

The full HTTPS connection string is:

`DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=https://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=https://127.0.0.1:10001/devstoreaccount1;TableEndpoint=https://127.0.0.1:10002/devstoreaccount1;`

To use the blob service only, the HTTPS connection string is:

`DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=https://127.0.0.1:10000/devstoreaccount1;`

To use the queue service only, the HTTPS connection string is:

`DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;QueueEndpoint=https://127.0.0.1:10001/devstoreaccount1;`

To use the table service only, the HTTPS connection string is:

`DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=https://127.0.0.1:10002/devstoreaccount1;`

If you used `dotnet dev-certs` to generate your self-signed certificate, use the following connection string.

`DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=https://localhost:10000/devstoreaccount1;QueueEndpoint=https://localhost:10001/devstoreaccount1;TableEndpoint=https://localhost:10002/devstoreaccount1;`

Update the connection string when using [custom storage accounts and keys](#custom-storage-accounts-and-keys).

For more information, see [Configure Azure Storage connection strings](storage-configure-connection-string.md).

### Azure SDKs

To use Azurite with the [Azure SDKs](https://aka.ms/azsdk), use OAuth and HTTPS options:

```console
azurite --oauth basic --cert certname.pem --key certname-key.pem
```

#### Azure Blob Storage

To interact with Blob Storage resources, you can instantiate a `BlobContainerClient`, `BlobServiceClient`, or `BlobClient`. 

The following examples show how to authorize a `BlobContainerClient` object using three different authorization mechanisms: [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential), connection string, and shared key. `DefaultAzureCredential` provides a Bearer token-based authentication mechanism, and uses a chain of credential types used for authentication. Once authenticated, this credential provides the OAuth token as part of client instantiation. To learn more, see the [DefaultAzureCredential class reference](/dotnet/api/azure.identity.defaultazurecredential).

```csharp
// With container URL and DefaultAzureCredential
var client = new BlobContainerClient(
    new Uri("https://127.0.0.1:10000/devstoreaccount1/container-name"), new DefaultAzureCredential()
  );

// With connection string
var client = new BlobContainerClient(
    "DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=https://127.0.0.1:10000/devstoreaccount1;", "container-name"
  );

// With account name and key
var client = new BlobContainerClient(
    new Uri("https://127.0.0.1:10000/devstoreaccount1/container-name"),
    new StorageSharedKeyCredential("devstoreaccount1", "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==")
  );
```

#### Azure Queue Storage

To interact with Queue Storage resources, you can instantiate a `QueueClient` or `QueueServiceClient`. 

The following examples show how to create and authorize a `QueueClient` object using three different authorization mechanisms: [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential), connection string, and shared key. `DefaultAzureCredential` provides a Bearer token-based authentication mechanism, and uses a chain of credential types used for authentication. Once authenticated, this credential provides the OAuth token as part of client instantiation. To learn more, see the [DefaultAzureCredential class reference](/dotnet/api/azure.identity.defaultazurecredential).

```csharp
// With queue URL and DefaultAzureCredential
var client = new QueueClient(
    new Uri("https://127.0.0.1:10001/devstoreaccount1/queue-name"), new DefaultAzureCredential()
  );

// With connection string
var client = new QueueClient(
    "DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;QueueEndpoint=https://127.0.0.1:10001/devstoreaccount1;", "queue-name"
  );

// With account name and key
var client = new QueueClient(
    new Uri("https://127.0.0.1:10001/devstoreaccount1/queue-name"),
    new StorageSharedKeyCredential("devstoreaccount1", "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==")
  );
```

#### Azure Table Storage

To interact with Table Storage resources, you can instantiate a `TableClient` or `TableServiceClient`. 

The following examples show how to create and authorize a `TableClient` object using three different authorization mechanisms: [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential), connection string, and shared key. `DefaultAzureCredential` provides a Bearer token-based authentication mechanism, and uses a chain of credential types used for authentication. Once authenticated, this credential provides the OAuth token as part of client instantiation. To learn more, see the [DefaultAzureCredential class reference](/dotnet/api/azure.identity.defaultazurecredential).

```csharp
// With table URL and DefaultAzureCredential
var client = new Client(
    new Uri("https://127.0.0.1:10002/devstoreaccount1/table-name"), new DefaultAzureCredential()
  );

// With connection string
var client = new TableClient(
    "DefaultEndpointsProtocol=https;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;TableEndpoint=https://127.0.0.1:10002/devstoreaccount1;", "table-name"
  );

// With account name and key
var client = new TableClient(
    new Uri("https://127.0.0.1:10002/devstoreaccount1/table-name"),
    new StorageSharedKeyCredential("devstoreaccount1", "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==")
  );
```

### Microsoft Azure Storage Explorer

You can use Storage Explorer to view the data stored in Azurite.

#### Connect to Azurite using HTTP

In Storage Explorer, connect to Azurite by following these steps:

 1. Select the **Manage Accounts** icon
 1. Select **Add an account**
 1. Select **Attach to a local emulator**
 1. Select **Next**
 1. Edit the **Display name** field to a name of your choice
 1. Select **Next** again
 1. Select **Connect**

#### Connect to Azurite using HTTPS

By default, Storage Explorer doesn't open an HTTPS endpoint that uses a self-signed certificate. If you're running Azurite with HTTPS, you're likely using a self-signed certificate. In Storage Explorer, import SSL certificates via the **Edit** -> **SSL Certificates** -> **Import Certificates** dialog.

##### Import Certificate to Storage Explorer

1. Find the certificate on your local machine.
1. In Storage Explorer, go to **Edit** -> **SSL Certificates** -> **Import Certificates** and import your certificate.

If you don't import a certificate, you get an error:

`unable to verify the first certificate` or `self signed certificate in chain`

##### Add Azurite via HTTPS connection string

Follow these steps to add Azurite HTTPS to Storage Explorer:

1. Select **Toggle Explorer**
1. Select **Local & Attached**
1. Right-click on **Storage Accounts** and select **Connect to Azure Storage**.
1. Select **Use a connection string**
1. Select **Next**.
1. Enter a value in the **Display name** field.
1. Enter the [HTTPS connection string](#https-connection-strings) from the previous section of this document
1. Select **Next**
1. Select **Connect**

## Workspace structure

The following files and folders may be created in the workspace location when initializing Azurite.

- `__blobstorage__` - Directory containing Azurite blob service persisted binary data
- `__queuestorage__` - Directory containing Azurite queue service persisted binary data
- `__tablestorage__` - Directory containing Azurite table service persisted binary data
- `__azurite_db_blob__.json` - Azurite blob service metadata file
- `__azurite_db_blob_extent__.json` - Azurite blob service extent metadata file
- `__azurite_db_queue__.json` - Azurite queue service metadata file
- `__azurite_db_queue_extent__.json` - Azurite queue service extent metadata file
- `__azurite_db_table__.json` - Azurite table service metadata file
- `__azurite_db_table_extent__.json` - Azurite table service extent metadata file

To clean up Azurite, delete above files and folders and restart the emulator.

## Differences between Azurite and Azure Storage

There are functional differences between a local instance of Azurite and an Azure Storage account in the cloud.

### Endpoint and connection URL

The service endpoints for Azurite are different from the endpoints of an Azure Storage account. The local computer doesn't do domain name resolution, requiring Azurite endpoints to be local addresses.

When you address a resource in an Azure Storage account, the account name is part of the URI host name. The resource being addressed is part of the URI path:

`<http|https>://<account-name>.<service-name>.core.windows.net/<resource-path>`

The following URI is a valid address for a blob in an Azure Storage account:

`https://myaccount.blob.core.windows.net/mycontainer/myblob.txt`


#### IP-style URL

Since the local computer doesn't resolve domain names, the account name is part of the URI path instead of the host name. Use the following URI format for a resource in Azurite:

`http://<local-machine-address>:<port>/<account-name>/<resource-path>`

The following address might be used for accessing a blob in Azurite:

`http://127.0.0.1:10000/myaccount/mycontainer/myblob.txt`

#### Production-style URL

Optionally, you could modify your hosts file to access an account with _production-style_ URL.

First, add one or more lines to your hosts file. For example:

```
127.0.0.1 account1.blob.localhost
127.0.0.1 account1.queue.localhost
127.0.0.1 account1.table.localhost
```

Next, set environment variables to enable customized storage accounts and keys:

```
set AZURITE_ACCOUNTS="account1:key1:key2"
```

You could add more accounts. See the [Custom storage accounts and keys](#custom-storage-accounts-and-keys) section of this article.

Start Azurite and use a customized connection string to access your account. In the following example, the connection string assumes that the default ports are used. 

```
DefaultEndpointsProtocol=http;AccountName=account1;AccountKey=key1;BlobEndpoint=http://account1.blob.localhost:10000;QueueEndpoint=http://account1.queue.localhost:10001;TableEndpoint=http://account1.table.localhost:10002;
```

Don't access default account in this way with Azure Storage Explorer. There's a bug that Storage Explorer is always adding account name in URL path, causing failures.

By default, when using Azurite with a production-style URL, the account name should be the host name in fully qualified domain name such as "http://devstoreaccount1.blob.localhost:10000/container". To use production-style URL with account name in the URL path such as "http://foo.bar.com:10000/devstoreaccount1/container", make sure to use the `--disableProductStyleUrl` parameter when you start Azurite.

If you use `host.docker.internal` as request Uri host (For example: `http://host.docker.internal:10000/devstoreaccount1/container`), Azurite gets the account name from the request Uri path. This behavior is true regardless of whether you use the `--disableProductStyleUrl` parameter when you start Azurite. 

### Scaling and performance

Azurite doesn't support large numbers of connected clients. There's no performance guarantee. Azurite is intended for development and testing purposes.

### Error handling

Azurite is aligned with Azure Storage error handling logic, but there are differences. For example, error messages may be different, while error status codes align.

### RA-GRS

Azurite supports read-access geo-redundant replication (RA-GRS). For storage resources, access the secondary location by appending `-secondary` to the account name. For example, the following address might be used for accessing a blob using the read-only secondary in Azurite:

`http://127.0.0.1:10000/devstoreaccount1-secondary/mycontainer/myblob.txt`

### Table support

Support for tables in Azurite is currently in preview. For more information, see the [Azurite V3 Table](https://github.com/Azure/Azurite/wiki/Azurite-V3-Table) project.

Support for durable functions requires tables.

> [!IMPORTANT]
>
> Azurite support for Table Storage is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Azurite is open-source

Contributions and suggestions for Azurite are welcome. Go to the Azurite [GitHub project](https://github.com/Azure/Azurite/projects) page or [GitHub issues](https://github.com/Azure/Azurite/issues) for milestones and work items we're tracking for upcoming features and bug fixes. Detailed work items are also tracked in GitHub.

## Next steps

- [Use the Azure Storage Emulator for development and testing](storage-use-emulator.md) documents the legacy Azure Storage Emulator, which is being superseded by Azurite.
- [Configure Azure Storage connection strings](storage-configure-connection-string.md) explains how to assemble a valid Azure Storage connection string.
