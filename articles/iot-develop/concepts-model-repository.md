---
title: Understand the IoT Plug and Play device models repository | Microsoft Docs
description: As a solution developer or an IT professional, learn about the basic concepts of the device models repository for IoT Plug and Play devices.
author: rido-min
ms.author: rmpablos
ms.date: 11/17/2022
ms.topic: conceptual
ms.service: iot-develop
services: iot-develop
---

# Device models repository

The device models repository (DMR) enables device builders to manage and share IoT Plug and Play device models. The device models are JSON LD documents defined using the [Digital Twins Modeling Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/README.md).

The DMR defines a pattern to store DTDL interfaces in a folder structure based on the device twin model identifier (DTMI). You can locate an interface in the DMR by converting the DTMI to a relative path. For example, the `dtmi:com:example:Thermostat;1` DTMI translates to `/dtmi/com/example/thermostat-1.json` and can be obtained from the public base URL `devicemodels.azure.com` at the URL [https://devicemodels.azure.com/dtmi/com/example/thermostat-1.json](https://devicemodels.azure.com/dtmi/com/example/thermostat-1.json).

## Index, expanded and metadata

The DMR conventions include other artifacts for simplifying consumption of hosted models. These features are _optional_ for custom or private repositories.

- _Index_. All available DTMIs are exposed through an *index* composed by a sequence of json files, for example: [https://devicemodels.azure.com/index.page.2.json](https://devicemodels.azure.com/index.page.2.json)
- _Expanded_. A file with all the dependencies is available for each interface, for example: [https://devicemodels.azure.com/dtmi/com/example/temperaturecontroller-1.expanded.json](https://devicemodels.azure.com/dtmi/com/example/temperaturecontroller-1.expanded.json)
- _Metadata_. This file exposes key attributes of a repository and is refreshed periodically with the latest published models snapshot. It includes features that a repository implements such as whether the model index or expanded model files are available. You can access the DMR metadata at [https://devicemodels.azure.com/metadata.json](https://devicemodels.azure.com/metadata.json)

## Public device models repository

Microsoft hosts a public DMR with these characteristics:

- Curated models. Microsoft reviews and approves all available interfaces using a GitHub pull request (PR) validation workflow.
- Immutability.  After it's published, an interface can't be updated.
- Hyper-scale. Microsoft provides the required infrastructure to create a secure, scalable endpoint where you can publish and consume device models.

## Custom device models repository

Use the same DMR pattern to create a custom DMR in any storage medium, such as local file system or custom HTTP web server. You can retrieve device models from the custom DMR in the same way as from the public DMR by changing the base URL used to access the DMR.

> [!NOTE]
> Microsoft provides tools to validate device models in the public DMR. You can reuse these tools in custom repositories.

## Public models

The public device models stored in the DMR are available for everyone to consume and integrate in their applications. Public device models enable an open eco-system for device builders and solution developers to share and reuse their IoT Plug and Play device models.

See the [Publish a model](#publish-a-model) section to learn how to publish a model in the DMR and make it public.

Users can browse, search, and view public interfaces from the official [GitHub repository](https://github.com/Azure/iot-plugandplay-models).

All interfaces in the `dtmi` folders are also available from the public endpoint [https://devicemodels.azure.com](https://devicemodels.azure.com)

### Resolve models

To programmatically access these interfaces, you can use the `ModelsRepositoryClient` available in the NuGet package [Azure.IoT.ModelsRepository](https://www.nuget.org/packages/Azure.IoT.ModelsRepository). This client is configured by default to query the public DMR available at [devicemodels.azure.com](https://devicemodels.azure.com/) and can be configured to any custom repository.

The client accepts a `DTMI` as input and returns a dictionary with all required interfaces:

```cs
using Azure.IoT.ModelsRepository;

var client = new ModelsRepositoryClient();
ModelResult models = client.GetModel("dtmi:com:example:TemperatureController;1");
models.Content.Keys.ToList().ForEach(k => Console.WriteLine(k));
```

The expected output displays the `DTMI` of the three interfaces found in the dependency chain:

```txt
dtmi:com:example:TemperatureController;1
dtmi:com:example:Thermostat;1
dtmi:azure:DeviceManagement:DeviceInformation;1
```

The `ModelsRepositoryClient` can be configured to query a custom DMR -available through http(s)- and to specify the dependency resolution by using the `ModelDependencyResolution` flag:

- Disabled. Returns the specified interface only, without any dependency.
- Enabled. Returns all the interfaces in the dependency chain

> [!TIP]
> Custom repositories might not expose the `.expanded.json` file. When this file isn't available, the client will fallback to process each dependency locally.

The following sample code shows how to initialize the `ModelsRepositoryClient` by using a custom repository base URL, in this case using the `raw` URLs from the GitHub API without using the `expanded` form since it's not available in the `raw` endpoint. The `AzureEventSourceListener` is initialized to inspect the HTTP request performed by the client:

```cs
using AzureEventSourceListener listener = AzureEventSourceListener.CreateConsoleLogger();

var client = new ModelsRepositoryClient(
    new Uri("https://raw.githubusercontent.com/Azure/iot-plugandplay-models/main"));

ModelResult model = await client.GetModelAsync(
    "dtmi:com:example:TemperatureController;1", 
    dependencyResolution: ModelDependencyResolution.Enabled);

model.Content.Keys.ToList().ForEach(k => Console.WriteLine(k));
```

There are more samples available in the Azure SDK GitHub repository: [Azure.Iot.ModelsRepository/samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/modelsrepository/Azure.IoT.ModelsRepository/samples).

## Publish a model

> [!IMPORTANT]
> You must have a GitHub account to be able to submit models to the public DMR.

1. Fork the public GitHub repository: [https://github.com/Azure/iot-plugandplay-models](https://github.com/Azure/iot-plugandplay-models).
1. Clone the forked repository. Optionally create a new branch to keep your changes isolated from the `main` branch.
1. Add the new interfaces to the `dtmi` folder using the folder/filename convention. To learn more, see [Import a Model to the `dtmi/` folder](#import-a-model-to-the-dtmi-folder).
1. Validate the models locally using the `dmr-client` tool. To learn more, see [validate models](#validate-models).
1. Commit the changes locally and push to your fork.
1. From your fork, create a pull request that targets the `main` branch. See [Creating an issue or pull request](https://docs.github.com/free-pro-team@latest/desktop/contributing-and-collaborating-using-github-desktop/creating-an-issue-or-pull-request) docs.
1. Review the [pull request requirements](https://github.com/Azure/iot-plugandplay-models/blob/main/pr-reqs.md).

The pull request triggers a set of GitHub Actions that validate the submitted interfaces, and makes sure your pull request satisfies all the requirements.

Microsoft will respond to a pull request with all checks in three business days.

### `dmr-client` tools

The tools used to validate the models during the PR checks can also be used to add and validate the DTDL interfaces locally.

> [!NOTE]
> This tool requires the [.NET SDK](https://dotnet.microsoft.com/download) version 3.1 or greater.

### Install `dmr-client`

```cmd/sh
dotnet tool install --global Microsoft.IoT.ModelsRepository.CommandLine --version 1.0.0-beta.6
```

### Import a model to the `dtmi/` folder

If you have your model already stored in json files, you can use the `dmr-client import` command to add them to the `dtmi/` folder with the correct file names:

```cmd/sh
# from the local repo root folder
dmr-client import --model-file "MyThermostat.json"
```

> [!TIP]
> You can use the `--local-repo` argument to specify the local repository root folder.

### Validate models

You can validate your models with the `dmr-client validate` command:

```cmd/sh
dmr-client validate --model-file ./my/model/file.json
```

> [!NOTE]
> The validation uses the latest DTDL parser version to ensure all the interfaces are compatible with the DTDL language specification.

To validate external dependencies, they must exist in the local repository. To validate models, use the `--repo` option to specify a `local` or `remote` folder to resolve dependencies:

```cmd/sh
# from the repo root folder
dmr-client validate --model-file ./my/model/file.json --repo .
```

### Strict validation

The DMR includes extra [requirements](https://github.com/Azure/iot-plugandplay-models/blob/main/pr-reqs.md), use the `strict` flag to validate your model against them:

```cmd/sh
dmr-client validate --model-file ./my/model/file.json --repo . --strict true
```

Check the console output for any error messages.

### Export models

Models can be exported from a given repository (local or remote) to a single file using a JSON Array:

```cmd/sh
dmr-client export --dtmi "dtmi:com:example:TemperatureController;1" -o TemperatureController.expanded.json
```

### Create the repository `index`

The DMR can include an *index* with a list of all the DTMIs available at the time of publishing. This file can be split in to multiple files as described in the [DMR Tools Wiki](https://github.com/Azure/iot-plugandplay-models-tools/wiki/Model-Index).

To generate the index in a custom or private DMR, use the index command:

```cmd/sh
dmr-client index -r . -o index.json
```

> [!NOTE]
> The public DMR is configured to provide an updated index available at: https://devicemodels.azure.com/index.json

### Create *expanded* files

Expanded files can be generated using the command:

```cmd/sh
dmr-client expand -r .
```

## Next steps

The suggested next step is to review the [IoT Plug and Play architecture](concepts-architecture.md).
