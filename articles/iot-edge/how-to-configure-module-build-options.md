---
title: Configure module build options
description: Learn how to use the module.json file to configure build and deployment options for an IoT Edge module
author: PatAltimore

ms.author: patricka
ms.date: 06/05/2025
ms.topic: how-to
ms.service: azure-iot-edge
services: iot-edge
---

# Configure IoT Edge module build options

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

The *module.json* file controls how modules are built and deployed. IoT Edge module projects in Visual Studio and Visual Studio Code include the *module.json* file. This file has configuration details for the IoT Edge module, like the version and platform used when building the module.

## *module.json* settings

The *module.json* file has these settings:

| Setting | Description |
|---|---|
| image.repository | The module repository. |
| image.tag.version | The module version. |
| image.tag.platforms | A list of supported platforms and their corresponding dockerfile. Each entry is a platform key and dockerfile pair `<platform key>:<dockerfile>`. |
| image.buildOptions | Build arguments used when running `docker build`. |
| image.contextPath | The context path used when running `docker build`. By default, it's the current folder of the *module.json* file. If your Docker build needs files not included in the current folder, like a reference to an external package or project, set **contextPath** to the root path of all necessary files. Verify the files are copied in the dockerfile. |
| language | The module programming language. |

For example, this *module.json* file is for a C# IoT Edge module:

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

After you build the module, the final image tag combines the version and platform as `<repository>:<version>-<platform key>`. For this example, the image tag for `amd64.debug` is `localhost:5000/csharpmod:0.0.1-amd64.debug`.

## Next steps

[Understand the requirements and tools for developing IoT Edge modules](module-development.md)
