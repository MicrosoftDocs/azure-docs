---
title: Use a tool to author and validate DTDL models | Microsoft Docs
description: Install the DTDL editor for Visual Studio Code or Visual Studio 2019 and use it to author IoT Plug and Play models.
author: dominicbetts
ms.author: dobett
ms.date: 09/14/2020
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp

# As a solution builder, I want to use a DTDL editor to author and validate DTDL model files to use in my IoT Plug and Play solution.
---

# Install and use the DTDL authoring tools

[Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/dtdlv2.md) models are JSON files. You can use an extension for Visual Studio code or Visual Studio 2019 to author and validate these model files.

## Install and use the VS Code extension

The DTDL extension for VS Code adds the following DTDL authoring features:

- DTDL v2 syntax validation.
- Intellisense, including autocomplete, to help you with the language syntax.
- The ability to create interfaces from the command palette.

To install the DTDL extension, go to [DTDL editor for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.vscode-dtdl). You can also search for **DTDL** in the Extensions view in VS Code.

When you've installed the extension, use it to help you author DTDL model files in VS code:

- The extension provides syntax validation in DTDL model files, highlighting errors as shown on the following screenshot:

    :::image type="content" source="media/howto-use-dtdl-authoring-tools/model-validation.png" alt-text="Model validation in VS Code":::

- Use intellisense and autocomplete when you're editing DTDL models:

    :::image type="content" source="media/howto-use-dtdl-authoring-tools/model-intellisense.png" alt-text="Use intellisense for DTDL models in VS Code":::

- Create a new DTDL interface. The following command creates a JSON file with a new interface. The interface includes example telemetry, property, and command definitions.

## Install and use the Visual Studio extension

The DTDL extension for Visual Studio 2019 adds the following DTDL authoring features:

- DTDL v2 syntax validation.
- Intellisense, including autocomplete, to help you with the language syntax.

To install the DTDL extension, go to [DTDL Language Support for VS 2019](https://marketplace.visualstudio.com/items?itemName=vsc-iot.vs16dtdllanguagesupport). You can also search for **DTDL** in **Manage Extensions** in Visual Studio.

When you've installed the extension, use it to help you author DTDL model files in Visual Studio:

- The extension provides syntax validation in DTDL model files, highlighting errors as shown on the following screenshot:

    :::image type="content" source="media/howto-use-dtdl-authoring-tools/model-validation-2.png" alt-text="Model validation in Visual Studio":::

- Use intellisense and autocomplete when you're editing DTDL models:

    :::image type="content" source="media/howto-use-dtdl-authoring-tools/model-intellisense-2.png" alt-text="Use intellisense for DTDL models in Visual Studio":::

## Next steps

In this how-to article, you've learned how to use the DTDL extensions for Visual Studio Code and Visual Studio 2019 to author and validate DTDL model files. A suggested next step is to learn how to use the [Azure IoT explorer with your models and devices](./howto-use-iot-explorer.md).
