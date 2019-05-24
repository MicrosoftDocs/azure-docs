To reference the Azure Functions 2.x default bindings, open the *host.json* file and update contents to match the following code.

```json
{
    "version": "2.0",
    "extensionBundle": {
        "id": "Microsoft.Azure.Functions.ExtensionBundle",
        "version": "[1.*, 2.0.0)"
    }
}
```