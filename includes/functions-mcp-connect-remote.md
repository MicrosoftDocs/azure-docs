---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/21/2026
ms.author: glenga
---

Your MCP server is now running in Azure. The project template includes a `remote-mcp-function` entry in `.vscode/mcp.json` that's already configured to connect to your remote server. Because built-in MCP authorization is enabled by default, Visual Studio Code handles the OAuth sign-in flow automatically when you connect.

1. Get the function app name from your deployment by running this command in the terminal:

    ```console
    azd env get-value AZURE_FUNCTION_NAME
    ```

1. In `.vscode/mcp.json`, select **Start** above the `remote-mcp-function` configuration.

1. When prompted, enter the function app name from the previous step.

1. Visual Studio Code prompts you to sign in with Microsoft Entra. Follow the authentication prompts to authorize access to your remote MCP server.
