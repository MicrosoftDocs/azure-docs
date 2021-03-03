---
title: 'Quickstart: Create a Node.js web app - windows'
description: Deploy your first Node.js Hello World to Azure App Service in minutes for the Windows Platform.
ms.assetid: 582bb3c2-164b-42f5-b081-95bfcb7a502a
ms.topic: quickstart
ms.date: 08/01/2020
ms.custom: mvc, devcenter, seodec18
ROBOTS: NOINDEX,NOFOLLOW
---

<!-- advanced for windows -->

## 3. Deploy to Azure App Service from Visual Studio Code

1. Open your application folder in Visual Studio Code.

    ```bash
    code .
    ```

1. In the **AZURE APP SERVICE** explorer, select **Sign in to Azure...** and follow the instructions. Once signed in, the explorer should show the name of your Azure subscription.

    ![Sign in to Azure](../media/quickstart-nodejs/sign-in.png)

    <details>
    <summary>Troubleshooting Azure sign-in</summary>
    
    If you see the error **"Cannot find subscription with name [subscription ID]"** when signing into Azure, it might be because you're behind a proxy and unable to reach the Azure API. Configure `HTTP_PROXY` and `HTTPS_PROXY` environment variables with your proxy information in your terminal using `export`.
    
    ```bash
    export HTTPS_PROXY=https://username:password@proxy:8080
    export HTTP_PROXY=http://username:password@proxy:8080
    ```

    [Report a problem](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=deploy-app)


1. In the **AZURE APP SERVICE** explorer, select the blue up arrow icon to deploy your app to Azure. 

    :::image type="content" source="../media/quickstart-nodejs/deploy.png" alt-text="Screenshot of the Azure App service in VS Code showing the blue arrow icon selected.":::

1. Choose the directory that you currently have open, `nodejs-docs-hello-world`.

1. Choose **Create new Web App... Advanced**, to deploy to App Service on Windows.

1. Type a globally unique <abbr title="Valid characters for an app name are 'a-z', '0-9', and '-'.">name</abbr> for your web app and press **Enter**. 
1. Select **Create a new resource group**, then enter a name for the resource group, such as `AppServiceQS-rg`.
1. Choose your **Node.js version**, LTS is recommended.

    The notification channel shows the Azure resources that are being created for your app.
1. Select **Windows** for the operating system.
1. Select **Create new App Service plan**, then enter a name for the plan (such as `AppServiceQS-plan`), then select **F1 Free** for the pricing tier.
1. Choose **Skip for now** when prompted about Application Insights.
1. Choose a region near you or near resources you wish to access.

1. Choose **Yes** when you're prompted to update your workspace so that later deployments will automatically target the same App Service Web App. 

    :::image type="content" source="../media/quickstart-nodejs/save-configuration.png" alt-text="Screenshot of the prompt to update your workspace with the yes button selected.":::

1. Right-click the node for the app service once more and select **Deploy to Web App**.

1. Right-click the node for the app service once more and select **Browse Website**.

    [Report a problem](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=deploy-app)

1. Once the deployment completes, select **Browse Website** in the prompt to view your freshly deployed web app.

<br/>
<details>
<summary><strong>Troubleshooting</strong></summary>

Check the following if you couldn't complete these steps:

* Be sure that your application is listening on the port provided by the PORT environment variable: `process.env.PORT`.

* If you see the error **"You do not have permission to view this directory or page."**, then the application probably failed to start correctly. Review the log output to find and fix the error. 

</details>

<br>

[Report a problem](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&prepare-your-environment)


<br/>
<hr/>
