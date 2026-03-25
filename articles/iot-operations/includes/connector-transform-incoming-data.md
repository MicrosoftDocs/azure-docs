---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 03/06/2026
ms.author: dobett
---

To transform the incoming data by using a WASM module and graph, complete the following steps:

1. Develop a WASM module to perform the custom transformation. For more information, see [Develop WebAssembly (WASM) modules and graph definitions](../develop-edge-apps/howto-develop-wasm-modules.md) or [Build WASM modules for data flows in VS Code](../develop-edge-apps/howto-build-wasm-modules-vscode.md).

1. Configure your transformation graph. For more information, see [Configure WebAssembly (WASM) graph definitions](../develop-edge-apps/howto-configure-wasm-graph-definitions.md).

1. Deploy both the module and graph to your container registry. For more information, see [Deploy WebAssembly (WASM) modules and graph definitions](../develop-edge-apps/howto-deploy-wasm-graph-definitions.md).

1. Set up authentication and connection details so Azure IoT Operations can access the container registry.

1. Configure your asset's dataset with the URL of the deployed WASM graph in the **Transform** field:

    :::image type="content" source="media/connector-transform-incoming-data/configure-transform.png" alt-text="Screenshot that shows how to add a WASM transform to a dataset." lightbox="media/connector-transform-incoming-data/configure-transform.png":::

A data transformation in the connector only requires a [single map operator](../develop-edge-apps/howto-develop-wasm-modules.md#quickstart-build-deploy-and-verify-a-wasm-module), but WASM graphs are fully supported with the following restrictions:

- The graph must have a single `source` node and a single `sink` node.
- The graph must consume and emit the `DataModel::Message` datatype.
- The graph must be stateless. Currently, this restriction means that accumulate operators aren't supported.
