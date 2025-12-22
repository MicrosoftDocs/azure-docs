---
title: Install and run the Azurite emulator for Azure Storage
description: The Azurite open-source emulator provides a free local environment to help accelerate development and testing of your Azure storage applications.
author: stevenmatthew
ms.author: shaas
ms.date: 06/24/2025
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, ai-video-demo
ai-usage: ai-assisted
# Customer intent: "As a developer, I want to use the Azurite emulator for local Azure Storage development, so that I can test my Blob, Queue, and Table Storage applications in a free and controlled environment before deployment."
---

# Install and run Azurite emulator

Using the Azurite emulator allows developers to fast-track cloud-based application and tool development without the need for internet connectivity. 

This article provides instructions for installing and running Azurite, as well as configuring it for local development. For more information about using Azurite, see [Use the Azurite emulator for local Azure Storage development](storage-use-azurite.md).

Azurite supersedes the [Azure Storage Emulator](storage-use-emulator.md), and continues to be updated to support the latest versions of Azure Storage APIs.

## Install Azurite

Azurite can be installed and run using various methods, including npm, Docker, and Visual Studio Code. This video shows you how to install and run the Azurite emulator.
> [!VIDEO c3badd75-fddb-4f6c-b27d-bab2700c79f1]

The steps in the video are also described in the following sections. Select any of these tabs to view specific instructions relevant to your environment.

### [Visual Studio](#tab/visual-studio)

Azurite is automatically available with [Visual Studio 2022](https://visualstudio.microsoft.com/vs/). The Azurite executable is updated as part of new Visual Studio version releases. If you're running an earlier version of Visual Studio, you can install Azurite by using either Node Package Manager (npm), DockerHub, or by cloning the Azurite GitHub repository. 

### [Visual Studio Code](#tab/visual-studio-code)

In Visual Studio Code, select the **Extensions** icon and search for **Azurite**. Select the **Install** button to install the Azurite extension.

:::image type="content" source="./media/storage-use-azurite/azurite-vs-code-extension.png" alt-text="A screenshot showing how to search for and install the Azurite extension in Visual Studio Code.":::

You can also navigate to [Visual Studio Code extension market](https://marketplace.visualstudio.com/items?itemName=Azurite.azurite) in your browser. Select the **Install** button to open Visual Studio Code and go directly to the Azurite extension page.

#### Configure Azurite extension settings

To configure Azurite settings within Visual Studio Code, select the **Extensions** icon. Select the **Manage** gear button for the **Azurite** entry. Select **Extension Settings**.

:::image type="content" source="./media/storage-use-azurite/azurite-configure-extension-settings-sml.png" alt-text="A screenshot showing how to modify the Azurite extension settings." lightbox="media/storage-use-azurite/azurite-configure-extension-settings.png":::

The following settings are supported:


| Setting   | Description  | Default setting  |
|-----------|--------------|------------------|
| **azurite.blobHost** | The Blob service listening endpoint. | *127.0.0.1* |
| **azurite.blobPort** | The Blob service listening port. | *10000* |
| **azurite.queueHost** | The Queue service listening endpoint. | *127.0.0.1* |
| **azurite.queuePort** | The Queue service listening port. | *10001* |
| **azurite.tableHost** | The Table service listening endpoint. | *127.0.0.1* |
| **azurite.tablePort** | The Table service listening port. | *10002* |
| **azurite.cert** | Path to a locally trusted PEM or PFX certificate file path to enable HTTPS mode. |  |
| **azurite.debug** | Output the debug log to the Azurite channel. | *false* |
| **azurite.key** | Path to a locally trusted PEM key file, required when **Azurite: Cert** points to a PEM file. |  |
| **azurite.location** | The workspace location path. | Visual Studio Code working folder |
| **azurite.loose** | Enable loose mode, which ignores unsupported headers and parameters. | *false* |
| **azurite.oauth** | Optional OAuth level. | None |
| **azurite.pwd** | Password for PFX file. Required when **Azurite: Cert** points to a PFX file. |  |
| **azurite.silent** | Silent mode disables the access log. | *false* |
| **azurite.skipApiVersionCheck** | Skip the request API version check. | *false* |
| **azurite.disableProductStyleUrl** | Force the parsing of the storage account name from request Uri path, instead of from request Uri host. | *false* |
| **azurite.inMemoryPersistence** | Disable persisting any data to disk and only store data in-memory. | *false* |
| **azurite.extentMemoryLimit** | The in-memory extent store (for blob and queue content) limit in megabytes. | *50% of the total memory on the host machine* |
| **azurite.disableTelemetry** | Disable telemetry data collection for the current Azurite execution. | *false* |

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

Select any of the following tabs to view specific instructions relevant to your environment.

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
> :::image type="content" source="media/storage-use-azurite/azurite-command-line-output-visual-studio-sml.png" alt-text="Screen capture of Azurite command-line output." lightbox="media/storage-use-azurite/azurite-command-line-output-visual-studio.png":::

To learn more about available command line options to configure Azurite, see [Command line options](#command-line-options).

#### Running Azurite from an Azure Functions project

In Visual Studio 2022, create an **Azure Functions** project. While setting the project options, mark the box labeled **Use Azurite for runtime storage account**.

:::image type="content" source="./media/storage-use-azurite/azurite-azure-functions-sml.png" alt-text="A screenshot showing how to set Azurite to be the runtime storage account for an Azure Functions project." lightbox="media/storage-use-azurite/azurite-azure-functions.png":::

After you create the project, Azurite starts automatically. The location of the Azurite executable file is detailed in the [Azurite executable file location table](#azurite-executable-file-location). The output looks similar to the following screenshot:

:::image type="content" source="./media/storage-use-azurite/azurite-azure-functions-output-sml.png" alt-text="A screenshot showing output after setting Azurite to be the runtime storage account for an Azure Functions project." lightbox="media/storage-use-azurite/azurite-azure-functions-output.png":::

This configuration option can be changed later by modifying the project's **Connected Services** dependencies.

#### Running Azurite from an ASP.NET project

In Visual Studio 2022, create an **ASP.NET Core Web App** project. Then, open the **Connected Services** dialog box, select **Add a service dependency**, and then select **Storage Azurite emulator**.

:::image type="content" source="./media/storage-use-azurite/azurite-aspnet-connect-sml.png" alt-text="A screenshot showing how to add Azurite as a dependency to an ASP.NET project." lightbox="media/storage-use-azurite/azurite-aspnet-connect.png":::

In the **Configure Storage Azurite emulator** dialog box, set the **Connection string name** field to `StorageConnectionString`, and then select **Finish**.

:::image type="content" source="./media/storage-use-azurite/azurite-aspnet-connection-string-sml.png" alt-text="A screenshot showing how to configure a connection string to use Azurite with an ASP.NET project." lightbox="media/storage-use-azurite/azurite-aspnet-connection-string.png":::

When the configuration completes, select **Close**, and the Azurite emulator starts automatically. The location of the Azurite executable file is detailed in the [Azurite executable file location table](#azurite-executable-file-location). The output looks similar to the following screenshot:

:::image type="content" source="./media/storage-use-azurite/azurite-aspnet-output.png" alt-text="A screenshot showing output after connecting an ASP.NET project to the Azurite emulator." lightbox="media/storage-use-azurite/azurite-aspnet-output.png":::

This configuration option can be changed later by modifying the project's **Connected Services** dependencies.

### [Visual Studio Code](#tab/visual-studio-code)

> [!NOTE]
> Azurite can't be run from the command line if you only installed the Visual Studio Code extension. Instead, use the Visual Studio Code command palette to run commands. Configuration settings are detailed at [Configure Azurite extension settings](#configure-azurite-extension-settings).

The Azurite extension supports the following Visual Studio Code commands. To open the command palette, press **F1** in Visual Studio Code.

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

## Command line options

This section details the command line switches available when launching Azurite.

### Help

**Optional** - Get command-line help by using the `-h` or `--help` switch.

```console
azurite -h
azurite --help
```

### Listening host

#### [Blob Storage](#tab/blob-storage)

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
> Allowing remote requests might make your system vulnerable to external attacks.

#### [Queue Storage](#tab/queue-storage)

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
> Allowing remote requests might make your system vulnerable to external attacks.

#### [Table Storage](#tab/table-storage)

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
> Allowing remote requests might make your system vulnerable to external attacks.

---

### Listening port configuration

#### [Blob Storage](#tab/blob-storage)

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

#### [Queue Storage](#tab/queue-storage)

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

#### [Table Storage](#tab/table-storage)

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

---

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

**Optional** - By default, Azurite uses the HTTP protocol. You can enable HTTPS mode by providing a path to a Privacy Enhanced Mail (.pem) or [Personal Information Exchange (.pfx)](/windows-hardware/drivers/install/personal-information-exchange---pfx--files) certificate file to the `--cert` switch. HTTPS is required to connect to Azurite using [OAuth authentication](#oauth-configuration).

When `--cert` is provided for a PEM file, you must provide a corresponding `--key` switch.

```console
azurite --cert path/server.pem --key path/key.pem
```

When `--cert` is provided for a PFX file, you must provide a corresponding `--pwd` switch.

```console
azurite --cert path/server.pfx --pwd pfxpassword
```

#### HTTPS setup

For detailed information on generating PEM and PFX files, see [HTTPS Setup](https://github.com/Azure/Azurite/blob/master/README.md#https-setup).

### OAuth configuration

**Optional** - Enable OAuth authentication for Azurite by using the `--oauth` switch.

```console
azurite --oauth basic --cert path/server.pem --key path/key.pem
```

> [!NOTE]
> OAuth requires an HTTPS endpoint. Make sure HTTPS is enabled by providing `--cert` switch along with the `--oauth` switch.

Azurite supports basic authentication by specifying the `basic` parameter to the `--oauth` switch. Azurite performs basic authentication, like validating the incoming bearer token, checking the issuer, audience, and expiry. Azurite doesn't check the token signature or permissions. To learn more about authorization, see [Connect to Azurite with SDKs and tools](storage-connect-azurite.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json).

### Skip API version check

**Optional** - When starting up, Azurite checks that the requested API version is valid. The following command skips the API version check:

```console
azurite --skipApiVersionCheck
```

### Disable production-style URL

**Optional**. When you use the fully qualified domain name instead of the IP in request Uri host, Azurite parses the storage account name from request URI host by default. You can force the parsing of the storage account name from request URI path by using `--disableProductStyleUrl`:

```cmd
azurite --disableProductStyleUrl
```

### In-memory persistence

**Optional**. By default, blob and queue metadata is persisted to disk and content is persisted to extent files. Table storage persists all data to disk. You can disable persisting any data to disk and only store data in-memory. In the in-memory persistence scenario, if the Azurite process is terminated, all data is lost. The default persistence behavior can be overridden using the following option:

```cmd
azurite --inMemoryPersistence
```

This setting is rejected when the SQL-based metadata implementation is enabled (via `AZURITE_DB`), or when the `--location` option is specified.

### Extent memory limit

**Optional**. By default, the in-memory extent store (for blob and queue content) is limited to 50% of the total memory on the host machine. The total is evaluated using `os.totalmem()`. This limit can be overridden using the following option:

```
azurite --extentMemoryLimit <megabytes>
```

There's no restriction on the value specified for this option. However, virtual memory might be used if the limit exceeds the amount of available physical memory as provided by the operating system. A high limit might eventually lead to out of memory errors or reduced performance. This option is rejected when `--inMemoryPersistence` isn't specified.

To learn more, see [Use in-memory storage](https://github.com/Azure/Azurite#use-in-memory-storage).

### Disable telemetry collection

**Optional**. By default, Azurite collects telemetry data to help improve the product. Use the `--disableTelemetry` option to disable telemetry data collection for the current Azurite execution, like following command:

```console
azurite --disableTelemetry
```

## Next steps

- [Connect to Azurite with SDKs and tools](storage-connect-azurite.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json) explains how to connect to Azurite using various Azure Storage SDKs and tools.
- [Configure Azure Storage connection strings](storage-configure-connection-string.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json) explains how to assemble a valid Azure Storage connection string.
- [Use Azurite to run automated tests](../blobs/use-azurite-to-run-automated-tests.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json) describes how to write automated tests using the Azurite storage emulator.
- [Use the Azure Storage Emulator for development and testing](storage-use-emulator.md?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json) documents the legacy Azure Storage Emulator, which is superseded by Azurite.
