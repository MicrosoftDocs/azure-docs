---
title: 'Quickstart: Create a Node.js Web App'
description: Deploy your first Node.js Hello World app to Azure App Service in minutes.
ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a
author: msangapu-msft
ms.author: msangapu
ms.topic: quickstart
ms.date: 11/18/2025
ms.devlang: javascript
zone_pivot_groups: app-service-vscode-cli-portal
ai-usage: ai-assisted
ms.service: azure-app-service
ms.custom:
  - mvc
  - devcenter
  - devdivchpfy22
  - devx-track-js
  - ai-video-demo
  - sfi-image-nochange
---

# Deploy a Node.js web app in Azure

In this quickstart, you learn how to create and deploy your first Node.js ([Express](https://www.expressjs.com)) web app to [Azure App Service](overview.md). App Service supports various versions of Node.js on both Linux and Windows.

The Azure CLI steps in this quickstart use the paid Premium v3 tier. The Visual Studio Code and Azure portal steps show how to use the Free tier.

This video shows you how to deploy a Node.js web app in Azure.
> [!VIDEO c66346dd-9fde-4cef-b135-47d3051d5db5]

The steps in the video are also described in the following sections.

## Set up your initial environment

:::zone target="docs" pivot="development-environment-vscode"

- Have an Azure account with an active subscription. If you don't have one, you can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Install [Node.js LTS](https://nodejs.org). Run the command `node --version` to verify that Node.js is installed.
- Install [Visual Studio Code](https://code.visualstudio.com).
- Install the [Azure App Service extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azureappservice) for Visual Studio Code.
 <!-- - <a href="https://git-scm.com/" target="_blank">Install Git</a> -->

::: zone-end

:::zone target="docs" pivot="development-environment-cli"

- Have an Azure account with an active subscription. If you don't have one, you can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Install [Node.js LTS](https://nodejs.org). Run the command `node --version` to verify that Node.js is installed.
- Install [Azure CLI](/cli/azure/install-azure-cli), which you can use to run commands in a shell to create and configure Azure resources.

::: zone-end

:::zone target="docs" pivot="development-environment-azure-portal"

- Have an Azure account with an active subscription. If you don't have one, you can [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Install [Node.js LTS](https://nodejs.org). Run the command `node --version` to verify that Node.js is installed.
- Have an FTP client, such as [FileZilla](https://filezilla-project.org), to transfer files to App Service.

::: zone-end

## Create your Node.js application

In this step, you create a basic Node.js application and ensure it runs on your computer.

> [!TIP]
> If you already completed the [Node.js tutorial](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial), you can skip ahead to [Deploy to Azure](#deploy-to-azure).

1. Create a Node.js application by using the [express application generator](https://expressjs.com/en/starter/generator), which is installed by default with Node.js and npm. 

    ```bash
    npx express-generator myExpressApp --view ejs
    ```

    If this is the first time you've installed the generator, npx asks you to agree to the installation.

1. Change to the application's directory and install the npm packages.

    ```bash
    cd myExpressApp && npm install
    ```

1. Update dependencies to the most secure version.

    ```bash
    npm audit fix --force
    ```

1. Start the development server with debug information.

    ```bash
    DEBUG=myexpressapp:* npm start
    ```

1. In a browser, navigate to `http://localhost:3000`. You should see something like this:

    :::image type="content" source="media/quickstart-nodejs/express.png" alt-text="Screenshot of an Express application running in a browser.":::

:::zone target="docs" pivot="development-environment-vscode"
> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=create-app)
::: zone-end

## Deploy to Azure

Before you continue, ensure that you have all the prerequisites installed and configured.

> [!NOTE]
> For your Node.js application to run in Azure, it needs to listen on the port provided by the `PORT` environment variable. In your generated Express app, this environment variable is already used in the startup script *bin/www*. (Search for `process.env.PORT`.)
>

:::zone target="docs" pivot="development-environment-vscode"

#### Sign in to Azure

1. In the terminal, ensure you're in the *myExpressApp* directory, and then start Visual Studio Code with the following command:

    ```bash
    code .
    ```

1. In Visual Studio Code, in the [Activity Bar](https://code.visualstudio.com/docs/getstarted/userinterface), select the Azure logo.

1. Ensure that you're signed in with your Azure account.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=getting-started)

#### Configure the App Service app and deploy code

# [Deploy to Linux](#tab/linux)

1. Right-click **App Services** and select **Create new Web App**. A Linux container is used by default. 
1. Type a globally unique name for your web app and select **Enter**. The name must be unique across all of Azure and use only alphanumeric characters (`A-Z`, `a-z`, and `0-9`) and hyphens (`-`).
1. In **Select a runtime stack**, select the Node.js version you want. **Node 24 LTS** is recommended.
1. In **Select a pricing tier**, select **Free (F1)** and wait for the resources to be created in Azure.
1. In the popup **Always deploy the workspace "myExpressApp" to \<app-name>"**, select **Yes**. Doing so ensures that, as long as you're in the same workspace, Visual Studio Code deploys to the same App Service app each time.

    While Visual Studio Code creates the Azure resources and deploys the code, it shows [progress notifications](https://code.visualstudio.com/api/references/extension-guidelines#notifications).

1. After deployment is complete, select **Browse Website** in the notification popup. The browser should display the Express default page.

# [Deploy to Windows](#tab/windows)

1. Under **Resources**, in the subscription that you want to use, right-click **App Services**, and then select **Create New Web App... (Advanced)**.
1. Select the location that you want to serve your app from. For example, **West Europe**.
1. Select **Secure unique default hostname**.
1. Select **Create a new resource group**, and then enter a name for the resource group, such as *AppServiceQS-rg*.
1. Type a globally unique name for your web app and then select **Enter**. The name must be unique across all of Azure and use only alphanumeric characters (`A-Z`, `a-z`, and `0-9`) and hyphens (`-`).
1. Select the Node.js version you want. **Node 24 LTS** is recommended.
1. Select **Windows** for the operating system.
1. Select **Create new App Service plan**, enter a name for the plan (such as *AppServiceQS-plan*), and then select **F1 Free** for the pricing tier.
1. For **Select an Application Insights resource for your app**, select **Skip for now**. Wait for the resources to be created in Azure.
1. In the popup **Always deploy the workspace "myExpressApp" to \<app-name>"**, select **Yes**. Doing so ensures that, as long as you're in the same workspace, Visual Studio Code deploys to the same App Service app each time.

    While Visual Studio Code creates the Azure resources and deploys the code, it shows [progress notifications](https://code.visualstudio.com/api/references/extension-guidelines#notifications).

    > [!NOTE]
    > After deployment is complete, your Azure app doesn't run yet because your project root doesn't have a *web.config* file. Follow the remaining steps to generate it automatically. For more information, see **You do not have permission to view this directory or page** in [Configure a Node.js](configure-language-nodejs.md?view=platform-windows&preserve-view=true).

1. In **Resources** in Visual Studio Code, expand the node for the new app, right-click **Application Settings**, and select **Add New Setting**:

    :::image type="content" source="media/quickstart-nodejs/add-setting.png" alt-text="Screenshot of the Add New Setting command.":::

1. Enter `SCM_DO_BUILD_DURING_DEPLOYMENT` for the setting key.

1. Enter *true* for the setting value.

    This app setting enables build automation at deploy time, which automatically detects the start script and generates the *web.config* file with it.

1. In the **App Service** explorer, select the **Deploy to Web App** icon again, and confirm by selecting **Deploy** again.

1. Wait for deployment to complete, and then select **Browse Website** in the notification popup. The browser should display the Express default page.

-----

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=deploy-app)

::: zone-end

:::zone target="docs" pivot="development-environment-cli"

In the terminal, ensure you're in the *myExpressApp* directory. Replace `<app-name>` with a globally unique name, then create the resource group, App Service plan, and app. Set `SCM_DO_BUILD_DURING_DEPLOYMENT` so App Service installs the dependencies and builds the app when you deploy the source archive.

# [Deploy to Linux](#tab/linux)

```azurecli
az group create --name myResourceGroup --location eastus
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku P0v3 --is-linux
az webapp create --name <app-name> --resource-group myResourceGroup --plan myAppServicePlan --runtime "NODE:24-lts"
az webapp config appsettings set --name <app-name> --resource-group myResourceGroup --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

# [Deploy to Windows](#tab/windows)

```azurecli
az group create --name myResourceGroup --location eastus
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku P0v3
az webapp create --name <app-name> --resource-group myResourceGroup --plan myAppServicePlan --runtime "NODE:24LTS"
az webapp config appsettings set --name <app-name> --resource-group myResourceGroup --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

-----

- If the `az` command isn't recognized, ensure you have the Azure CLI installed as described in [Set up your initial environment](#set-up-your-initial-environment).
- Replace `<app-name>` with a name that's unique across all of Azure (valid characters are `a-z`, `0-9`, and `-`).
- The `--sku P0v3` argument selects the paid Premium v3 pricing tier. Replace `eastus` with your preferred region; list available regions with [`az account list-locations`](/cli/azure/account#az-account-list-locations).
- `--is-linux` selects a Linux plan. Omit it for a Windows plan, as shown in the Windows tab.

Create a ZIP archive of the files in *myExpressApp*, not the enclosing directory. On Linux or macOS, run `zip -r ../app.zip . -x '*/node_modules/*' '*/.git/*' '*/.env*'` from *myExpressApp*. On Windows, run `Compress-Archive -Path (Get-ChildItem -Force -Name | Where-Object { $_ -notin @('node_modules', '.git') -and $_ -notlike '.env*' }) -DestinationPath ..\app.zip` in PowerShell from *myExpressApp*. Then deploy the archive:

```azurecli
az webapp deploy --resource-group myResourceGroup --name <app-name> --src-path ../app.zip --type zip
```

Browse to `https://<app-name>.azurewebsites.net` to see the app.

::: zone-end

:::zone target="docs" pivot="development-environment-azure-portal"

### Create Azure resources

1. Sign in to the [Azure portal](https://portal.azure.com).

1. To start creating a Node.js app, browse to [https://portal.azure.com/#create/Microsoft.WebSite](https://portal.azure.com/#create/Microsoft.WebSite).

1. In the **Basics** tab, under **Project Details**, ensure the correct subscription is selected and then select **Create new** to create a resource group. Type *myResourceGroup* for the name.

    :::image type="content" source="./media/quickstart-nodejs/project-details.png" alt-text="Screenshot of the Project Details section showing where you select the Azure subscription and the resource group for the web app.":::

1. Under **Instance details**, type a globally unique name for your web app and select **Code**. Select **Node 24 LTS** in **Runtime stack**, an **Operating System**, and a **Region** you want to serve your app from.

    :::image type="content" source="./media/quickstart-nodejs/instance-details.png" alt-text="Screenshot of the Instance Details section.":::

1. Under **Pricing plans**, select **Create new** to create an App Service plan. Type **myAppServicePlan** for the name. To change to the Free tier, select **Free F1** in the **Pricing plan** list. 

    :::image type="content" source="./media/quickstart-nodejs/app-service-plan-details.png" alt-text="Screenshot of the App Service Plan section.":::

1. Select the **Review + create** button at the bottom of the page.

    :::image type="content" source="./media/quickstart-nodejs/review-create.png" alt-text="Screenshot showing the Review and create button at the bottom of the page":::

1. After validation runs, select the **Create** button at the bottom of the page.

1. After deployment is complete, select **Go to resource**.

    :::image type="content" source="./media/quickstart-nodejs/next-steps.png" alt-text="Screenshot showing the Go to resource button.":::

### Get FTPS credentials

Azure App Service supports [two types of credentials](deploy-configure-credentials.md) for FTP/S deployment. These credentials aren't the same as your Azure subscription credentials. In this section, you get the application-scope credentials to use with your FTP client.

1. From the App Service app page, select **Deployment Center** under **Deployment** in the sidebar menu, and then select the **FTPS Credentials** tab.

    :::image type="content" source="./media/quickstart-nodejs/ftps-deployment-credentials.png" alt-text="Screenshot that shows the FTPS deployment credentials tab.":::

1. Open your FTP client and navigate to your *myExpressApp* folder.

1. From the **FTPS credentials** tab, copy the **FTPS endpoint**, **Username**, and **Password** into your FTP client.

    :::image type="content" source="./media/quickstart-nodejs/filezilla-ftps-connection.png" alt-text="Screenshot of the FTPS connection details.":::

1. Select **Connect** in your FTP client.
 
### Deploy files with FTPS

1. Copy all files and directories files to the [/site/wwwroot directory](https://github.com/projectkudu/kudu/wiki/File-structure-on-azure) in Azure.

    :::image type="content" source="./media/quickstart-nodejs/filezilla-deploy-files.png" alt-text="Screenshot of the WWW root directory.":::

1. Browse to your app's URL to verify the app is running properly.

::: zone-end

## Redeploy updates

You can deploy changes to this app by making edits in Visual Studio Code, saving your files, and then redeploying to your Azure app. For example:

1. From the sample project, open *views/index.ejs* and change

    ```html
    <p>Welcome to <%= title %></p>
    ```

    to

    ```html
    <p>Welcome to Azure</p>
    ```

:::zone target="docs" pivot="development-environment-vscode"

2. In the **App Service** explorer, select the **Deploy to Web App** icon again, and confirm by selecting **Deploy** again.

1. Wait for deployment to complete, then select **Browse Website** in the notification popup. You should see that the `Welcome to Express` message was changed to `Welcome to Azure`.

::: zone-end

:::zone target="docs" pivot="development-environment-cli"

2. Save your changes, re-create *../app.zip* from the app files as described in [Deploy to Azure](#deploy-to-azure), and redeploy:

    ```azurecli
    az webapp deploy --resource-group myResourceGroup --name <app-name> --src-path ../app.zip --type zip
    ```

    Replace `<app-name>` with the name you used when you created the web app.

1. Once deployment is complete, refresh the webpage. You should see that the `Welcome to Express` message was changed to `Welcome to Azure`.

::: zone-end

:::zone target="docs" pivot="development-environment-azure-portal"

2. Save your changes, then redeploy the app using your FTP client.

1. Once deployment is complete, refresh the webpage. You should see that the `Welcome to Express` message was changed to `Welcome to Azure`.

::: zone-end

## Stream logs

:::zone target="docs" pivot="development-environment-vscode"

You can stream log output (calls to `console.log()`) from the Azure app directly in the Visual Studio Code output window.

1. In **Resources** in Visual Studio Code, right-click the app node and then select **Start Streaming Logs**.

    :::image type="content" source="media/quickstart-nodejs/view-logs.png" alt-text="Screenshot of the option to Start Streaming Logs.":::

1. If asked to restart the app, select **Yes**. Once the app is restarted, the Visual Studio Code output window opens with a connection to the log stream.

1. After a few seconds, the output window shows a message indicating that you're connected to the log-streaming service. You can generate more output activity by refreshing the page in the browser.

    ```output
    Connecting to log stream...
    2020-03-04T19:29:44  Welcome, you are now connected to log-streaming service. The default timeout is 2 hours.
    Change the timeout with the App Setting SCM_LOGSTREAM_TIMEOUT (in seconds).
    ```

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=tailing-logs)

::: zone-end

:::zone target="docs" pivot="development-environment-cli"

You can access the console logs generated from inside the app and the container in which it runs. Logs include any output generated by calls to `console.log()`.

To stream logs, run the [az webapp log tail](/cli/azure/webapp/log#az-webapp-log-tail) command:

- Enable logging first: on Linux, run `az webapp log config --resource-group myResourceGroup --name <app-name> --docker-container-logging filesystem`; on Windows, run `az webapp log config --resource-group myResourceGroup --name <app-name> --application-logging filesystem`.

```azurecli
az webapp log tail --resource-group myResourceGroup --name <app-name>
```

Replace `<app-name>` with the name you used when you created the web app.

Refresh the app in the browser to generate console logs, which include messages describing HTTP requests to the app. If no output appears immediately, try again in 30 seconds.

To stop log streaming at any time, select **Ctrl**+**C** in the terminal.

::: zone-end

:::zone target="docs" pivot="development-environment-azure-portal"

You can access the console logs generated from inside the app and the container in which it runs. You can stream log output (calls to `console.log()`) from the Node.js app directly in the Azure portal.

1. In the same **App Service** page for your app, use the sidebar menu to scroll to the **Monitoring** section and select **Log stream**.

    :::image type="content" source="./media/quickstart-nodejs/log-stream.png" alt-text="Screenshot of Log stream in Azure App service.":::

1. After a few seconds, the output window shows a message indicating that you're connected to the log-streaming service. You can generate more output activity by refreshing the page in the browser.

    ```output
    Connecting...
    2021-10-26T21:04:14  Welcome, you are now connected to log-streaming service.
    Starting Log Tail -n 10 of existing logs ----
    /appsvctmp/volatile/logs/runtime/81b1b83b27ea1c3d598a1cdec28c71c4074ce66c735d0be57f15a8d07cb3178e.log
    2021-10-26T21:04:08.614384810Z: [INFO]
    2021-10-26T21:04:08.614393710Z: [INFO]  # Enter the source directory to make sure the script runs where the user expects
    2021-10-26T21:04:08.614399010Z: [INFO]  cd "/home/site/wwwroot"
    2021-10-26T21:04:08.614403210Z: [INFO]
    2021-10-26T21:04:08.614407110Z: [INFO]  export NODE_PATH=/usr/local/lib/node_modules:$NODE_PATH
    2021-10-26T21:04:08.614411210Z: [INFO]  if [ -z "$PORT" ]; then
    2021-10-26T21:04:08.614415310Z: [INFO]          export PORT=8080
    2021-10-26T21:04:08.614419610Z: [INFO]  fi
    2021-10-26T21:04:08.614423411Z: [INFO]
    2021-10-26T21:04:08.614427211Z: [INFO]  node /opt/startup/default-static-site.js
    Ending Log Tail of existing logs ---
    ```

::: zone-end

## Clean up resources

:::zone target="docs" pivot="development-environment-vscode"

In the preceding steps, you created Azure resources in a resource group. The steps in this quickstart put all the resources in this resource group. To clean up, you just need to remove the resource group.

1. In the Azure extension of Visual Studio Code, in the **Group By** list, select **Group by Resource Group**.

1. In the **Resources** list, expand the subscription, right-click the resource group you created earlier, and then select **Delete Resource Group**.

    :::image type="content" source="media/quickstart-nodejs/clean-up.png" alt-text="Screenshot of the Visual Studio Code navigation to delete a resource that contains App Service resources.":::

1. When prompted, confirm your deletion by entering the name of the resource group you're deleting. After you confirm, the resource group is deleted, and you see a [notification](https://code.visualstudio.com/api/references/extension-guidelines#notifications) when it's done.

> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=clean-up)

::: zone-end

:::zone target="docs" pivot="development-environment-cli"

In the preceding CLI steps, you created Azure resources in *myResourceGroup*.

If you don't expect to need these resources in the future, delete the resource group by running the following command:

```azurecli
az group delete --name myResourceGroup --no-wait
```

The `--no-wait` argument allows the command to return before the operation is complete.

::: zone-end

:::zone target="docs" pivot="development-environment-azure-portal"

You can delete the resource group, App service, and all related resources when they're no longer needed.

1. From your App Service *overview* page, select the *resource group* you created in the [Create Azure resources](#create-azure-resources) step.

    :::image type="content" source="./media/quickstart-nodejs/resource-group.png" alt-text="Screenshot of resource group in App Service overview page.":::

1. From the *resource group* page, select **Delete resource group**. Confirm the name of the resource group to finish deleting the resources.

    :::image type="content" source="./media/quickstart-nodejs/delete-resource-group.png" alt-text="Screenshot of Delete resource group.":::

::: zone-end

## Related content

Congratulations, you've successfully completed this quickstart!

> [!div class="nextstepaction"]
> [Deploy a Node.js + MongoDB web app to Azure](tutorial-nodejs-mongodb-app.md)

> [!div class="nextstepaction"]
> [Configure a Node.js app](configure-language-nodejs.md)

> [!div class="nextstepaction"]
> [Use a custom domain and a managed certificate to secure your app](tutorial-secure-domain-certificate.md)

Check out the other Azure extensions.

* [Azure Cosmos DB](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-cosmosdb)
* [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
* [Docker Extension Pack](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker)
* [Azure CLI Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli)
* [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)

Or get them all by installing the [Node Pack for Azure](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) extension pack.
