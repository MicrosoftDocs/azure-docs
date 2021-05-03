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
- [Set up your development environment](../../common-includes/set-up-dev-environment.md)
- If you haven't complete the [Detect motion and emit events](../../../detect-motion-emit-events-quickstart.md) quickstart, be sure to [set up Azure resources](#set-up-azure-resources).    

> [!Important]
> This Custom Vision module only supports **Intel x86 and amd64** architectures. Check the architecture of your edge device before continuing.

## Set up Azure resources

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)

[!INCLUDE [resources](../../common-includes/azure-resources.md)]
