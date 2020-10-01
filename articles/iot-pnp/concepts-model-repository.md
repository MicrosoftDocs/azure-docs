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

# Device Model Repository

The Device Model Repository (DMR) enables device builders to manage and share IoT Plug and Play device models. The device models are JSON LD documents defined using the [Digital Twins Modeling Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md). 

The DMR defines a pattern to store DTDL interfaces in a folder structure based on the model identifier or DTMI, as such any interface can be located by converting the DTMI to a relative path: `dtmi:com:example:Thermostat;1` can be translated to  `/dtmi/com/example/thermostat-1.json`.

## Public Device Model Repository

Microsoft is hosting a Public DRM with the next characteristics:

- Curated Models. Microsoft reviews and approves all interfaces available using an open GitHub PR validation workflow
- Inmutability.  Once published, interfaces cannot be updated
- Hyper-Scale. Microsoft provides all the required infraestructure to create a secure and highly scalabe endpoint

## Custom Device Model Repository

The same DRM pattern can be used in any storage medium such as local file system, or custom HTTP web servers to create a custom DMR. The techniques used to retrive models from custom DMR are the same as with the public repo by just changing the location (base URL) of the DMR.

> Note: The tools used to validate the models in the public DMR can be reused in custom repositories

## Public models

The public digital twin models stored in the model repository are available to everyone to consume and integrate in their application. Additionally, the public models make it possible for an open eco-system for device builders and solution developers to share and reuse their IoT Plug and Play device models.

Refer to the [Publish a Model](#publish-a-model) section for instructions on how to publish a model in the model repository to make it public.

Users can browser, search and view public interfaces from the official GitHub repository: [https://github.com/Azure/device-models](https://github.com/Azure/device-models). 

All interfaces available in the `dtmi` folders are also available from the public endpoint [https://devicemodels.azure.com](https://devicemodels.azure.com)

To access programmatically these interfaces we need to convert a dtmi to a relative path that can be used to query the public endpoint. The code below shows sample code to perform these tasks:

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

## Submit a model

> [!Important] You must have a GitHub account to be able to submit models to the public DMR.

1. Fork the public GitHub repo: [https://github.com/Azure/device-models](https://github.com/Azure/device-models)
1. Clone the forked repo (optionally create a new branch to keep your changes isolated from the `main` branch)
1. Add the new interfaces to the `dtmi` folder using the folder/filename convention. We provide the `add-model.js` script that will help you to check basic requirements and create the file in the right folder based on the interface Id. See the [Scripts to validate changes](#local-validation) section below to learn how to use this scripts.
1. Commit the changes locally and push to your fork
1. From your fork, create a PR targeting the `main` branch

The PR will trigger a series of GitHub actions that will validate the new submitted interfaces, make sure your PR satisfies all the checks. 

Microsoft will respond to a PR with all checks in 3 business days.

### Adding interfaces

To facilitate the addition of new interfaces you can use the `add-model.js` script (requires Node.js) by following the next steps:


1. From a command prompt navigate to the local git repo
1. Run `npm install`
1. Run `npm run add-model <path-to-file-to-add>`

The script will check that all dependencies are met, there are no unique Ids and then it will create the file in the required folder.


### Local Validation

You can run the same validation checks locally before submitting the PR to help diagnosing issues in advance. 

#### validate-files

`npm run validate-files <file1.json> <file2.json>` checks the file path matches the expected folder and file names.

#### validate-ids

`npm run validate-ids <file1.json> <file2.json>` checks that all IDs defined in the document use the same root as the main ID.

#### validate-deps

`npm run validate-deps <file1.json> <file2.json>` checks all the dependencies are available in the `dtmi` folder.

#### validate-models

Models can be validated with the `dmr-client` dotnet tool that can be installed with:

```bash
dotnet tool install -g dmr-client
```

To validate an interface resolving dependencies from the local `dtmi` folder:

```bash
dmr-client validate --model-file <file1.json> --registry /repos/device-models/dtmi
```


## Next steps

The suggested next step is to review the [IoT Plug and Play architecture](concepts-architecture.md).
