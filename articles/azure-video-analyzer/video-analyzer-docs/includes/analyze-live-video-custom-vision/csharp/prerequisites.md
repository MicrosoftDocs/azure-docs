---
author: Juliako
ms.service: azure-video-analyzer
ms.topic: include
ms.date: 04/30/2021
ms.author: juliako
---

Prerequisites for this tutorial are:

- [Visual Studio Code](https://code.visualstudio.com/) on your development machine with the [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) and [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) extensions.

> [!TIP]
> You might be prompted to install Docker. Ignore this prompt.

- [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/thank-you/sdk-3.1.201-windows-x64-installer) on your development machine.
- [Detect motion and emit events](../../../detect-motion-emit-events-quickstart.md) quickstart
- Ensure you have:

  - [Set up Azure Resources](../../common-includes/azure-resources.md)
  - [Set up your development environment](../../common-includes/set-up-dev-environment.md)

> [!TIP]
> If you run into issues with Azure resources that get created, please view our **[troubleshooting guide](../../../troubleshoot.md)** to resolve some commonly encountered issues.

> [!Important]
> This Custom Vision module only supports **Intel x86 and amd64** architectures. Check the architecture of your edge device before continuing.

