---
title: Configure module build options
description: Learn how to use the module.json file to configure build and deployment options for a module 
author: PatAltimore

ms.author: patricka
ms.date: 03/11/2022
ms.topic: how-to
ms.service: iot-edge
services: iot-edge
---

# Configure IoT Edge module build options

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

The *module.json* file controls how modules are built and deployed. IoT Edge module Visual Studio
and Visual Studio Code projects include the *module.json* file. The file contains IoT Edge module
configuration details including the version and platform that is used when building an IoT Edge
module.

## *module.json* settings

The *module.json* file includes the following settings:

| Setting | Description |
|---|---|
| image.repository | The repository of the module. |
| image.tag.version | The version of the module. |
| image.tag.platforms | A list of supported platforms and their corresponding dockerfile. Each entry is a platform key and dockerfile pair `<platform key>:<dockerfile>`. |
| image.buildOptions | The build arguments used when running `docker build`. |
| image.contextPath | The context path used when running `docker build`. By default, it's the current folder of the *module.json* file. If your Docker build needs files not included in the current folder such as a reference to an external package or project, set the **contextPath** to the root path of all necessary files. Verify the files are copied in the dockerfile. |
| language | The programming language of the module. |

For example, the following *module.json* file is for a C# IoT Edge module:

```json
{
    "$schema-version": "0.0.1",
    "description": "",
    "image": {
        "repository": "localhost:5000/edgemodule",
        "tag": {
            "version": "0.0.1",
            "platforms": {
                "amd64": "./Dockerfile.amd64", 
                "amd64.debug": "./Dockerfile.amd64.debug",
                "arm32v7": "./Dockerfile.arm32v7",
                "arm32v7.debug": "./Dockerfile.arm32v7.debug",
                "arm64v8": "./Dockerfile.arm64v8",
                "arm64v8.debug": "./Dockerfile.arm64v8.debug",
                "windows-amd64": "./Dockerfile.windows-amd64"
            }
        },
        "buildOptions": ["--add-host=docker:10.180.0.1"],
        "contextPath": "./"
    },
    "language": "csharp"
}
```

Once the module is built, the final tag of the image is combined with both version and platform as
`<repository>:<version>-<platform key>`. For this example, the image tag for `amd64.debug` is
`localhost:5000/csharpmod:0.0.1-amd64.debug`.

## Next steps

[Understand the requirements and tools for developing IoT Edge modules](module-development.md)
