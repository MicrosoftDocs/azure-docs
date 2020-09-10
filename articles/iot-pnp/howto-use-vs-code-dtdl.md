---
title: Use the DTDL extension for Visual Studio Code to author models | Microsoft Docs
description: Install the DTDL editor for Visual Studio Code and use it to author IoT Plug and Play models.
author: dominicbetts
ms.author: dobett
ms.date: 09/08/2020
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp

# As a solution builder, I want to use the the DTDL editor for Visual Studio Code to author and validate DTDL model files to use in my IoT Plug and Play solution.
---

# Install and use the DTDL extension for Visual Studio Code

The DTDL extension adds support to VS Code for authoring [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md) models. The extension adds the following features to VS Code:

- DTDL v2 syntax validation.
- Intellisense, including autocomplete, to help you with the language syntax.
- The ability to create interfaces from the command palette.

> [!TIP]
> There's also an extension the provides validation and intellisense for Visual Studio 2009. To learn more, see [DTDL Language Support for VS 2019](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vs16dtdllanguagesupport).

## Install the DTDL extension

To install the DTDL extension, go to [DTDL editor for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-dtdl). You can also search for **DTDL** in the Extensions view in VS Code.

## Use the DTDL extension

When you've installed the extension, use it to help you author DTDL model files in VS code:

- The extension provides syntax validation in markdown files, highlighting errors as shown on the following screenshot:

    :::image type="content" source="media/howto-use-vs-code-dtdl/model-validation.png" alt-text="Model validation in VS Code":::

- Use intellisense and autocomplete when you're editing DTDL models:

    :::image type="content" source="media/howto-use-vs-code-dtdl/model-intellisense.png" alt-text="Use intellisense for DTDL models in VS Code":::

- Create a new DTDL interface. The following command creates a JSON file with a new interface. The interface includes example telemetry, property, and command definitions:

    :::image type="content" source="media/howto-use-vs-code-dtdl/model-add-interface.png" alt-text="Create a new DTDL interface in VS Code":::

## Next steps

In this how-to article, you've learned how to use the DTDL editor for Visual Studio Code to author and validate DTDL model files. A suggested next step is to learn how to use the [Azure IoT explorer with your models and devices](./howto-use-iot-explorer.md).
