---
author: Juliako
ms.service: azure-video-analyzer
ms.topic: include
ms.date: 04/30/2021
ms.author: juliako
---

Prerequisites for this tutorial are:


* An Azure account that includes an active subscription. [Create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) for free if you don't already have one.

    > [!NOTE]    
    > You will need an Azure subscription where you have access to both [Contributor](../../../../../role-based-access-control/built-in-roles.md#contributor) role, and [User Access Administrator](../../../../../role-based-access-control/built-in-roles.md#user-access-administrator) role. If you do not have the right permissions, please reach out to your account administrator to grant you those permissions.
* [Visual Studio Code](https://code.visualstudio.com/), with the following extensions:
    * [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)
    
    > [!TIP]
    > When installing Azure IoT Tools, you might be prompted to install Docker. Feel free to ignore the prompt.    
    * [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1). 

> [!Important]
> This Custom Vision module only supports **Intel x86 and amd64** architectures. Check the architecture of your edge device before continuing.

## Set up Azure resources

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)

[!INCLUDE [resources](../../common-includes/azure-resources.md)]
