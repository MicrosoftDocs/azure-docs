---
author: craigshoemaker
ms.author: cshoe
ms.service: azure-static-web-apps
ms.topic: include
ms.date: 07/02/2024
---

## Create a static web app on Azure

You can create a static web app using the Azure portal, [Azure CLI][az2], [Azure PowerShell][az4], or Visual Studio Code (with the [Azure Static Web Apps extension][az3]). This tutorial uses the Azure CLI.

1. Sign into the Azure CLI:

    ```bash
    az login
    ```

    By default, this command opens a browser to complete the process. The Azure CLI supports [various methods for signing in][az5] if this method doesn't work in your environment.

1. If you have multiple subscriptions, you might need to [select a subscription][az6]. You can view your current subscription using the following command:

    ```bash
    az account show
    ```

    To select a subscription, you can run the `az account set` command.

    ```bash
    az account set --subscription "<SUBSCRIPTION_NAME_OR_ID>"
    ```

1. Create a resource group.

    Resource groups are used to group Azure resources together.

    ```bash
    az group create -n swa-tutorial -l centralus --query "properties.provisioningState"
    ```

    The `-n` parameter refers to the site name, and the `-l` parameter is the  Azure location name. The command concludes with `--query "properties.provisioningState"` so the command only returns a success or error message.

1. Create a static web app in your newly created resource group.

    ```bash
    az staticwebapp create -n swa-demo-site -g swa-tutorial --query "defaultHostname"
    ```

    The `-n` parameter refers to the site name, and the `-g` parameter refers to the name of the Azure resource group. Make sure you specify the same resource group name as in the previous step. Your static web app is globally distributed, so the location isn't important to how you deploy your app.

    The command is configured to return the URL of your web app. You can copy the value from your terminal window to your browser to view your deployed web app.

[portal]: https://portal.azure.com/#browse/Microsoft.Web%2FStaticSites
[az2]: /cli/azure/staticwebapp
[az3]: https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps
[az4]: /powershell/module/az.websites
[az5]: /cli/azure/authenticate-azure-cli
[az6]: /cli/azure/manage-azure-subscriptions-azure-cli#get-subscription-information
