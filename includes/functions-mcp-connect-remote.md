---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/20/2026
ms.author: glenga
---

Your MCP server is now running in Azure. The project template includes a `remote-mcp-function` entry in `.vscode/mcp.json` that's already configured to connect to your remote server. When you start this server, VS Code prompts you for the function app name and system key needed to access the remote MCP endpoint.

1. Run this script that uses `azd` and the Azure CLI to print out both the function app name and the system key (`mcp_extension`) required to access the tools:

    ### [Linux/macOS](#tab/linux)

    ```bash
    eval $(azd env get-values --output dotenv)
    MCP_EXTENSION_KEY=$(az functionapp keys list --resource-group $AZURE_RESOURCE_GROUP \
        --name $AZURE_FUNCTION_NAME --query "systemKeys.mcp_extension" -o tsv)
    printf "Function app name: %s\n" "$SERVICE_API_NAME"
    printf "MCP Server key: %s\n" "$MCP_EXTENSION_KEY"
    ```

    ### [Windows](#tab/windows-cmd)

    ```powershell
    azd env get-values --output dotenv | ForEach-Object { 
        if ($_ -match "^([^=]+)=(.*)$") { 
            Set-Variable -Name $matches[1] -Value ($matches[2] -replace '"', '')
        } 
    }
    $MCP_EXTENSION_KEY = az functionapp keys list --resource-group $AZURE_RESOURCE_GROUP `
        --name $AZURE_FUNCTION_NAME --query "systemKeys.mcp_extension" -o tsv
    Write-Host "Function app name: $SERVICE_API_NAME"
    Write-Host "MCP Server key: $MCP_EXTENSION_KEY"
    ```

    ---

1. In `.vscode/mcp.json`, select **Start** above the `remote-mcp-function` configuration.

1. When prompted, enter the function app name and system key values from the previous step.
