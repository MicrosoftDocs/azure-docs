---
title: Debug WASM modules in VS Code
description: Learn how to debug WebAssembly (WASM) modules locally by using breakpoints and the integrated debugger in Visual Studio Code.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 03/30/2026
ms.service: azure-iot-operations
ai-usage: ai-assisted

# CustomerIntent: As a developer, I want to debug WASM modules locally in VS Code so that I can troubleshoot issues and validate my module logic before deploying to production.
---

# Debug WASM modules in VS Code

You can debug WASM modules locally by using breakpoints and the integrated debugger in Visual Studio Code. This article shows how to set up and use the debugger with the Azure IoT Operations local development environment.

Before you complete the steps in this article, set up your local development environment and build and run a graph application locally. For more information, see [Build WASM modules for data flows](howto-build-wasm-modules.md).

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)
- [Azure IoT Operations Data Flow extension](https://marketplace.visualstudio.com/items?itemName=ms-azureiotoperations.azure-iot-operations-data-flow-vscode) for VS Code.
- [CodeLLDB extension](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb) for VS Code to enable debugging of WASM modules
- Docker
- Docker images as described in [Build WASM modules for data flows](howto-build-wasm-modules.md#prerequisites)

Run the [Use schema registry with WASM modules](howto-wasm-schema-registry.md) example to set up the sample workspace.

## Set up debugging

1. Open the file `operators/filter/src/lib.rs` in the `schema-registry-scenario` workspace.

1. Locate the `filter` function and set a breakpoint by clicking in the margin next to the line number or by pressing `F9`.

    ```rust
    fn filter(input: DataModel) -> Result<bool, Error> {
        let DataModel::Message(message) = input else {
            return Err(Error {message: "Unexpected input type.".to_string()});
        };
        // ... rest of function
    }
    ```

## Build for debugging

1. Press `Ctrl+Shift+P` to open the command palette and search for **Azure IoT Operations: Build All Data Flow Operators**.

1. Select **debug** as the build mode. Wait for the build to complete.

## Run with debugging enabled

Press `Ctrl+Shift+P` to open the command palette and search for **Azure IoT Operations: Start Development Environment**. Select **debug** as the run mode.

1. Press `Ctrl+Shift+P` and search for **Azure IoT Operations: Run Application Graph**.

1. Select the `lldb-debug.graph.dataflow.yaml` graph file.

1. Select **debug** as the run mode.

1. Select the `data` folder in your VS Code workspace for your input data. The DevX container launches to run the graph with the sample input.

1. After the DevX container launches, you see the host-app container start with an `lldb-server` for debugging.

## Debug the WASM module

1. The execution automatically stops at the breakpoint you set in the `filter` function.

1. Use the VS Code debugging interface to:
   - Inspect variable values in the **Variables** panel.
   - Step through code using `F10` or `F11`.
   - View the call stack in the **Call Stack** panel.
   - Add watches for specific variables or expressions.

1. Continue execution by pressing `F5` or selecting the **Continue** button.

1. The debugger stops at the breakpoint for each message being processed, letting you inspect the data flow.

## Debugging tips

- Use the **Debug Console** to evaluate expressions and inspect runtime state.
- Set conditional breakpoints by right-clicking on a breakpoint and adding conditions.
- Use `F9` to toggle breakpoints on and off without removing them.
- The **Variables** panel shows the current state of local variables and function parameters.

This debugging capability enables you to troubleshoot issues, understand data flow, and validate your WASM module logic before deploying to production.

## Related content

- [Build WASM modules for data flows](howto-build-wasm-modules.md)
- [Test WASM modules](howto-test-wasm-modules.md)
- [Create stateful WASM graphs with the state store](howto-wasm-state-store.md)
- [Use schema registry with WASM modules](howto-wasm-schema-registry.md)
- [Understand WebAssembly (WASM) modules and graph definitions for data flow graphs](concepts-wasm-modules.md)
