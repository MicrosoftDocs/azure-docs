---
title: Understand concepts of the device models repository | Microsoft Docs
description: As a solution developer or an IT professional, learn about the basic concepts of the device models repository.
author: rido-min
ms.author: rmpablos
ms.date: 11/17/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# Device models repository

The device models repository (DMR) enables device builders to manage and share IoT Plug and Play device models. The device models are JSON LD documents defined using the [Digital Twins Modeling Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md).

The DMR defines a pattern to store DTDL interfaces in a folder structure based on the device twin model identifier (DTMI). You can locate an interface in the DMR by converting the DTMI to a relative path. For example, the `dtmi:com:example:Thermostat;1` DTMI translates to `/dtmi/com/example/thermostat-1.json`.

## Public device models repository

Microsoft hosts a public DMR with these characteristics:

- Curated models. Microsoft reviews and approves all available interfaces using a GitHub pull request (PR) validation workflow.
- Immutability.  After it's published, an interface can't be updated.
- Hyper-scale. Microsoft provides the required infrastructure to create a secure, scalable endpoint where you can publish and consume device models.

## Custom device models repository

Use the same DMR pattern to create a custom DMR in any storage medium, such as local file system or custom HTTP web servers. You can retrieve device models from the custom DMR in the same way as from the public DMR by changing the base URL used to access the DMR.

> [!NOTE]
> Microsoft provides tools to validate device models in the public DMR. You can reuse these tools in custom repositories.

## Public models

The public device models stored in the models repository are available for everyone to consume and integrate in their applications. Public device models enable an open eco-system for device builders and solution developers to share and reuse their IoT Plug and Play device models.

Refer to the [Publish a model](#publish-a-model) section for instructions on how to publish a model in the models repository to make it public.

Users can browse, search, and view public interfaces from the official [GitHub repository](https://github.com/Azure/iot-plugandplay-models).

All interfaces in the `dtmi` folders are also available from the public endpoint [https://devicemodels.azure.com](https://devicemodels.azure.com)

### Resolve models

To programmatically access these interfaces, you need to convert a DTMI to a relative path that you can use to query the public endpoint.

To convert a DTMI to an absolute path, use the `DtmiToPath` function with `IsValidDtmi`:

```cs
static string DtmiToPath(string dtmi)
{
    if (!IsValidDtmi(dtmi))
    {
        return null;
    }
    // dtmi:com:example:Thermostat;1 -> dtmi/com/example/thermostat-1.json
    return $"/{dtmi.ToLowerInvariant().Replace(":", "/").Replace(";", "-")}.json";
}

static bool IsValidDtmi(string dtmi)
{
    // Regex defined at https://github.com/Azure/digital-twin-model-identifier#validation-regular-expressions
    Regex rx = new Regex(@"^dtmi:[A-Za-z](?:[A-Za-z0-9_]*[A-Za-z0-9])?(?::[A-Za-z](?:[A-Za-z0-9_]*[A-Za-z0-9])?)*;[1-9][0-9]{0,8}$");
    return rx.IsMatch(dtmi);
}
```

With the resulting path and the base URL for the repository we can obtain the interface:

```cs
const string _repositoryEndpoint = "https://devicemodels.azure.com";

string dtmiPath = DtmiToPath(dtmi.ToString());
string fullyQualifiedPath = $"{_repositoryEndpoint}{dtmiPath}";
string modelContent = await _httpClient.GetStringAsync(fullyQualifiedPath);
```

## Publish a model

> [!Important]
> You must have a GitHub account to be able to submit models to the public DMR.

1. Fork the public GitHub repository: [https://github.com/Azure/iot-plugandplay-models](https://github.com/Azure/iot-plugandplay-models).
1. Clone the forked repository. Optionally create a new branch to keep your changes isolated from the `main` branch.
1. Add the new interfaces to the `dtmi` folder using the folder/filename convention. To learn more, see [Import a Model to the `dtmi/` folder](#import-a-model-to-the-dtmi-folder).
1. Validate the models locally using the `dmr-client` tool. To learn more, see [validate models](#validate-models).
1. Commit the changes locally and push to your fork.
1. From your fork, create a pull request that targets the `main` branch. See [Creating an issue or pull request](https://docs.github.com/free-pro-team@latest/desktop/contributing-and-collaborating-using-github-desktop/creating-an-issue-or-pull-request) docs.
1. Review the [pull request requirements](https://github.com/Azure/iot-plugandplay-models/blob/main/pr-reqs.md).

The pull request triggers a set of GitHub actions that validate the submitted interfaces, and makes sure your pull request satisfies all the requirements.

Microsoft will respond to a pull request with all checks in three business days.

### `dmr-client` tools

The tools used to validate the models during the PR checks can also be used to add and validate the DTDL interfaces locally.

> [!NOTE]
> This tool requires the [.NET SDK](https://dotnet.microsoft.com/download) version 3.1 or greater.

### Install `dmr-client`

```bash
curl -L https://aka.ms/install-dmr-client-linux | bash
```

```powershell
iwr https://aka.ms/install-dmr-client-windows -UseBasicParsing | iex
```

### Import a model to the `dtmi/` folder

If you have your model already stored in json files, you can use the `dmr-client import` command to add them to the `dtmi/` folder with the correct file names:

```bash
# from the local repo root folder
dmr-client import --model-file "MyThermostat.json"
```

> [!TIP]
> You can use the `--local-repo` argument to specify the local repository root folder.

### Validate models

You can validate your models with the `dmr-client validate` command:

```bash
dmr-client validate --model-file ./my/model/file.json
```

> [!NOTE]
> The validation uses the latest DTDL parser version to ensure all the interfaces are compatible with the DTDL language specification.

To validate external dependencies, they must exist in the local repository. To validate models, use the `--repo` option to specify a `local` or `remote` folder to resolve dependencies:

```bash
# from the repo root folder
dmr-client validate --model-file ./my/model/file.json --repo .
```

### Strict validation

The DMR includes additional [requirements](https://github.com/Azure/iot-plugandplay-models/blob/main/pr-reqs.md), use the `stict` flag to validate your model against them:

```bash
dmr-client validate --model-file ./my/model/file.json --repo . --strict true
```

Check the console output for any error messages.

### Export models

Models can be exported from a given repository (local or remote) to a single file using a JSON Array:

```bash
dmr-client export --dtmi "dtmi:com:example:TemperatureController;1" -o TemperatureController.expanded.json
```

## Next steps

The suggested next step is to review the [IoT Plug and Play architecture](concepts-architecture.md).
