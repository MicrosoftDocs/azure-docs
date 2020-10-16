---
title: Understand concepts of the Device Model Repository | Microsoft Docs
description: As a solution developer or an IT professional, learn about the basic concepts of the Device Model Repository.
author: rido-min
ms.author: rmpablos
ms.date: 09/30/2020
ms.topic: conceptual
ms.service: iot-pnp
services: iot-pnp
---

# Device model repository

The device model repository (DMR) enables device builders to manage and share IoT Plug and Play device models. The device models are JSON LD documents defined using the [Digital Twins Modeling Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md).

The DMR defines a pattern to store DTDL interfaces in a folder structure based on the device twin model identifier (DTMI). You can locate an interface in the DMR by converting the DTMI to a relative path. For example, the `dtmi:com:example:Thermostat;1` DTMI translates to `/dtmi/com/example/thermostat-1.json`.

## Public device model repository

Microsoft hosts a public DMR with these characteristics:

- Curated models. Microsoft reviews and approves all available interfaces using an open GitHub PR validation workflow.
- Immutability.  After it's published, an interface can't be updated.
- Hyper-scale. Microsoft provides all the required infrastructure to create a secure and highly scalable endpoint.

## Custom device model repository

You can use the same DMR pattern in any storage medium, such as local file system or custom HTTP web servers, to create a custom DMR. You can retrieve models from the custom DMR in the same way as from the public DMR simply by changing the base URL used to access the DMR.

> [!NOTE]
> The tools used to validate the models in the public DMR can be reused in custom repositories.

## Public models

The public digital twin models stored in the model repository are available to everyone to consume and integrate in their applications. Public models enable an open eco-system for device builders and solution developers to share and reuse their IoT Plug and Play device models.

Refer to the [Publish a model](#publish-a-model) section for instructions on how to publish a model in the model repository to make it public.

Users can browse, search, and view public interfaces from the official [GitHub repository](https://github.com/Azure/iot-plugandplay-models).

All interfaces in the `dtmi` folders are also available from the public endpoint [https://devicemodels.azure.com](https://devicemodels.azure.com)

### Resolve models

To programmatically access these interfaces, you need to convert a dtmi to a relative path that you can use to query the public endpoint. The following code sample shows you how to do this:

To convert a DTMI to an absolute path we use the `DtmiToPath` function, with `IsValidDtmi`:

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

1. Fork the public GitHub repo: [https://github.com/Azure/iot-plugandplay-models](https://github.com/Azure/iot-plugandplay-models).
1. Clone the forked repo. Optionally create a new branch to keep your changes isolated from the `main` branch.
1. Add the new interfaces to the `dtmi` folder using the folder/filename convention. See the [add-model](#add-model) tool.
1. Validate the models locally using the [scripts to validate changes](#validate-files) section.
1. Commit the changes locally and push to your fork.
1. From your fork, create a PR that targets the `main` branch. See [Creating an issue or pull request](https://docs.github.com/free-pro-team@latest/desktop/contributing-and-collaborating-using-github-desktop/creating-an-issue-or-pull-request) docs.
1. Review the [PR requirements](https://github.com/Azure/iot-plugandplay-models/blob/main/pr-reqs.md).

The PR triggers a series of GitHub actions that will validate the new submitted interfaces, and make sure your PR satisfies all the checks.

Microsoft will respond to a PR with all checks in three business days.

### add-model

The following steps show you how the add-model.js script helps you add a new interface. This script requires Node.js to run:

1. From a command prompt, navigate to the local git repo
1. Run `npm install`
1. Run `npm run add-model <path-to-file-to-add>`

Watch the console output for any error messages.

### Local validation

You can run the same validation checks locally before submitting the PR to help diagnosing issues in advance.

#### validate-files

`npm run validate-files <file1.json> <file2.json>` checks the file path matches the expected folder and file names.

#### validate-ids

`npm run validate-ids <file1.json> <file2.json>` checks that all IDs defined in the document use the same root as the main ID.

#### validate-deps

`npm run validate-deps <file1.json> <file2.json>` checks all the dependencies are available in the `dtmi` folder.

#### validate-models

You can run the [DTDL Validation Sample](https://github.com/Azure-Samples/DTDL-Validator) to validate your models locally.

## Next steps

The suggested next step is to review the [IoT Plug and Play architecture](concepts-architecture.md).
