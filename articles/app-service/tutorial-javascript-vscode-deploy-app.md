---
title: Azure App Service with Visual Studio Code - deploy your app
description: Node.js Deployment to Azure App Services with Visual Studio Code
author: KarlErickson
ms.author: karler
ms.date: 05/17/2019
ms.topic: quickstart
ms.service: app-service
ms.devlang: javascript
---
# Deploy the Website

In this step, you deploy your Node.js website using VS Code and the Azure App Service extension. This tutorial uses the most basic deployment model where your app is zipped and deployed to an Azure Web App on Linux.

## Deploy using Azure App Service

In the **AZURE APP SERVICE** explorer, click the blue up arrow icon to deploy your app to Azure.

![Deploy to Web App](./media/tutorial-javascript-vscode/deploy.png)

> [!TIP]
> You can also deploy from the **Command Palette** (CTRL + SHIFT + P) by typing 'deploy to web app' and running the **Azure App Service: Deploy to Web App** command.

1. Choose **Create New Web App**.

2. Type a globally unique name for your Web App and press ENTER. Valid characters for an app name are 'a-z', '0-9', and '-'.

3. Choose a location in a [region](https://azure.microsoft.com/en-us/regions/) near you or near other services you may need to access.

4. Choose your **Node.js version**, LTS is recommended.

    The notification channel shows the Azure resources that are being created for your app.

5. Choose the directory that you currently have open, `myExpressApp`.

  Click **Yes** when prompted to update your configuration to run `npm install` on the target server. Your app is then deployed.

  ![Configured deployment](./media/tutorial-javascript-vscode/server-build.png)

When the deployment starts, you're prompted to update your workspace so that later deployments will automatically target the same App Service Web App. Choose **Yes** to ensure your changes are deployed to the correct app.

![Configured deployment](./media/tutorial-javascript-vscode/save-configuration.png)

> [!TIP]
> Be sure that your application is listening on the port provided by the PORT environment variable: `process.env.PORT`.

## Browse the website

Once the deployment completes, click **Browse Website** in the prompt to view your freshly deployed website.

## Troubleshooting

If you see the error **"You do not have permission to view this directory or page."**, then the application probably failed to start correctly. Head to the next step and view the log output to find and fix the error. If you aren't able to fix it, contact us by clicking the **I ran into an issue** button below. We're happy to help!

## Updating the website

You can deploy changes to this app by using the same process and choosing the existing app rather than creating a new one.

## Next steps

> [!div class="nextstepaction"]
> [My site is on Azure](./tutorial-javascript-vscode-tail-logs.md)
> [!div class="nextstepaction"]
> [I ran into an issue](https://www.research.net/r/PWZWZ52?tutorial=node-deployment-azure-app-service&step=deploy-app)

