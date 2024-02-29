---
ms.service: azure-kubernetes-service
ms.topic: include
ms.date: 02/21/2024
---

> [!IMPORTANT]
> Certain Azure security policies cause conflicts when used to sign in with `azd auth login`. As a workaround, you can perform a curl request to the localhost url you were redirected to after you logged in.

The workaround requires the Azure CLI for authentication. If you don't have it or aren't using GitHub Codespaces, install the [Azure CLI][install-azure-cli].

1. Inside a terminal, login with Azure CLI
    ```azurecli-interactive
    az login --scope https://graph.microsoft.com/.default
    ```
1. Copy the "localhost" URL from the failed redirect
1. In a new terminal window,  type `curl` and paste your url
1. If it works, code for a webpage saying "You have logged into Microsoft Azure!" appears

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="60;url=https://docs.microsoft.com/cli/azure/">
    <title>Login successfully</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        code {
            font-family: Consolas, 'Liberation Mono', Menlo, Courier, monospace;
            display: inline-block;
            background-color: rgb(242, 242, 242);
            padding: 12px 16px;
            margin: 8px 0px;
        }
    </style>
</head>
<body>
    <h3>You have logged into Microsoft Azure!</h3>
    <p>You can close this window, or we will redirect you to the <a href="https://docs.microsoft.com/cli/azure/">Azure CLI documentation</a> in 1 minute.</p>
    <h3>Announcements</h3>
    <p>[Windows only] Azure CLI is collecting feedback on using the <a href="https://learn.microsoft.com/windows/uwp/security/web-account-manager">Web Account Manager</a> (WAM) broker for the login experience.</p>
    <p>You may opt-in to use WAM by running the following commands:</p>
    <code>
        az config set core.allow_broker=true<br>
        az account clear<br>
        az login
    </code>
</body>
</html>
```

5. Close the new terminal and open the old terminal
6. Copy and note down which subscription_id you want to use
7. Paste in the subscription_ID to the command `az account set -n {sub}`

[install-azure-cli]: /cli/azure/install-azure-cli