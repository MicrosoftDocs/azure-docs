---
title: 'Quickstart: Deploy a Python FastAPI web app to Azure'
description: Get started with Azure App Service by deploying your first Python FastAPI app to Azure App Service.
ms.topic: quickstart
ms.date: 04/06/2022
author: ankur021188
ms.author: ankur021188
ms.devlang: python
ms.custom: devx-azure-cli, devx-azure-portal, devx-vscode-azure-extension, devdivchpfy22, vscode-azure-extension-update-completed, devx-track-azurecli
---

# Quickstart: Deploy a Python FastAPI web app to Azure App Service

In this quickstart, you'll deploy a Python FastAPI web app to [Azure App Service](./overview.md#app-service-on-linux). Azure App Service is a fully managed web hosting service that supports Python 3.7 and higher apps hosted in a Linux server environment.

To complete this quickstart, you need:
1. An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
1. <a href="https://www.python.org/downloads/" target="_blank">Python 3.9 or higher</a> installed locally.

>**Note**: This article contains current instructions on deploying a Python web app using Azure App Service. Python on Windows is no longer supported.

## 1 - Sample application

This quickstart can be completed using FastAPI. A sample application is provided to help you follow along with this quickstart. Download or clone the sample application to your local workstation.

```Console
git clone https://github.com/Azure-Samples/msdocs-python-fastapi-webapp-quickstart
```

---

To run the application locally:

1. Go to the application folder:

    ```Console
    cd msdocs-python-fastapi-webapp-quickstart
    ```

1. Create a virtual environment for the app:

    [!INCLUDE [Virtual environment setup](<./includes/quickstart-python/virtual-environment-setup.md>)]

1. Install the dependencies:

    ```Console
    pip install -r requirements.txt
    ```

1. Run the app:

    ```Console
    uvicorn main:app --reload
    ```
1. Browse to the sample application at `http://localhost:8000` in a web browser.

    :::image type="content" source="./media/quickstart-python/run-flask-app-localhost.png" alt-text="Screenshot of the FastAPI app running locally in a browser":::

Having issues? [Let us know](https://aka.ms/PythonAppServiceQuickstartFeedback).    

---

## 2 - Create a web app in Azure

To host your application in Azure, you need to create Azure App Service web app in Azure. You can create a web app using [Azure portal](https://portal.azure.com/), [VS Code](https://code.visualstudio.com/), [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack), or Azure CLI.

### [Azure CLI](#tab/azure-cli)

[!INCLUDE [Create CLI](<./includes/quickstart-python/create-app-cli.md>)]

### [VS Code](#tab/vscode-aztools)

To create Azure resources in VS Code, you must have the [Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack) installed and be signed into Azure from VS Code.

> [!div class="nextstepaction"]
> [Download Azure Tools extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-node-azure-pack)
In the application folder, open VS Code:
```Console
code .
```

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service-visual-studio-code-1.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service-visual-studio-code-1-240-px.png" alt-text="A Screenshot of the Azure Tools icon in the left toolbar of VS Code." lightbox="./media/quickstart-python/create-app-service-visual-studio-code-1.png"::: |
| [!INCLUDE [Create app service step 2](<./includes/quickstart-python/create-app-service-visual-studio-code-2.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service-visual-studio-code-2-240-px.png" alt-text="A screenshot of the App Service section of Azure Tools extension and the context menu used to create a new web app." lightbox="./media/quickstart-python/create-app-service-visual-studio-code-2.png"::: |
| [!INCLUDE [Create app service step 3](<./includes/quickstart-python/create-app-service-visual-studio-code-3.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service-visual-studio-code-4-240-px.png" alt-text="A screenshot of the dialog box in VS Code used to select Create a new Web App." lightbox="./media/quickstart-python/create-app-service-visual-studio-code-4.png"::: |
| [!INCLUDE [Create app service step 4](<./includes/quickstart-python/create-app-service-visual-studio-code-4.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service-visual-studio-code-5-240-px.png" alt-text="A screenshot of the dialog box in VS Code used to enter the globally unique name for the new web app." lightbox="./media/quickstart-python/create-app-service-visual-studio-code-5.png"::: |
| [!INCLUDE [Create app service step 5](<./includes/quickstart-python/create-app-service-visual-studio-code-5.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service-visual-studio-code-6-240-px.png" alt-text="A screenshot of the dialog box in VS Code used to select the runtime stack for the new web app." lightbox="./media/quickstart-python/create-app-service-visual-studio-code-6.png"::: |
| [!INCLUDE [Create app service step 6](<./includes/quickstart-python/create-app-service-visual-studio-code-6.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service-visual-studio-code-7-240-px.png" alt-text="A screenshot of the dialog box in VS Code used to a pricing tier for the new web app." lightbox="./media/quickstart-python/create-app-service-visual-studio-code-7.png"::: |
| [!INCLUDE [Create app service step 7](<./includes/quickstart-python/create-app-service-visual-studio-code-7.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service-visual-studio-code-7b-240-px.png" alt-text="A screenshot of the dialog box in VS Code used to start deploy to new web app." lightbox="./media/quickstart-python/create-app-service-visual-studio-code-7b.png"::: |
| [!INCLUDE [Create app service step 8](<./includes/quickstart-python/create-app-service-visual-studio-code-8.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service-visual-studio-code-7c-240-px.png" alt-text="A screenshot of the dialog box in VS Code used to select the folder to deploy as the new web app." lightbox="./media/quickstart-python/create-app-service-visual-studio-code-7c.png"::: |
| [!INCLUDE [Create app service step 9](<./includes/quickstart-python/create-app-service-visual-studio-code-9.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service-visual-studio-code-8-240-px.png" alt-text="A screenshot of a dialog box in VS Code asking if you want to update your workspace to run build commands." lightbox="./media/quickstart-python/create-app-service-visual-studio-code-8.png"::: |
| [!INCLUDE [Create app service step 10](<./includes/quickstart-python/create-app-service-visual-studio-code-10.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service-visual-studio-code-9-240-px.png" alt-text="A screenshot showing the confirmation dialog when the app code has been deployed to Azure." lightbox="./media/quickstart-python/create-app-service-visual-studio-code-9.png"::: |

### [Azure portal](#tab/azure-portal)

Sign in to the [Azure portal](https://portal.azure.com/) and follow these steps to create your Azure App Service resources.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service-azure-portal-1.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service-azure-portal-1-240px.png" alt-text="A screenshot of how to use the search box in the top tool bar to find App Services in Azure." lightbox="./media/quickstart-python/create-app-service-azure-portal-1.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service-azure-portal-2.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service-azure-portal-2-240px.png" alt-text="A screenshot of the location of the Create button on the App Services page in the Azure portal." lightbox="./media/quickstart-python/create-app-service-azure-portal-2.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service-azure-portal-3.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service-azure-portal-3-240px.png" alt-text="A screenshot of how to fill out the form to create a new App Service in the Azure portal." lightbox="./media/quickstart-python/create-app-service-azure-portal-3.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service-azure-portal-4.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service-azure-portal-4-240px.png" alt-text="A screenshot of how to select the basic app service plan in the Azure portal." lightbox="./media/quickstart-python/create-app-service-azure-portal-4.png"::: |
| [!INCLUDE [Create app service step 1](<./includes/quickstart-python/create-app-service-azure-portal-5.md>)] | :::image type="content" source="./media/quickstart-python/create-app-service-azure-portal-5-240px.png" alt-text="A screenshot of the location of the Review plus Create button in the Azure portal." lightbox="./media/quickstart-python/create-app-service-azure-portal-5.png"::: |

---

Having issues? [Let us know](https://aka.ms/PythonAppServiceQuickstartFeedback).

## 3 - Deploy your application code to Azure

Azure App service supports multiple methods to deploy your application code to Azure including support for GitHub Actions and all major CI/CD tools. This article focuses on how to deploy your code from your local workstation to Azure.

### [Deploy using VS Code](#tab/vscode-deploy)

[!INCLUDE [Deploy VS Code](<./includes/quickstart-python/deploy-visual-studio-code.md>)]

### [Deploy using Azure CLI](#tab/azure-cli-deploy)

[!INCLUDE [Deploy Azure CLI](<./includes/quickstart-python/deploy-cli.md>)]

### [Deploy using Local Git](#tab/local-git-deploy)

[!INCLUDE [Deploy Local Git](<./includes/quickstart-python/deploy-local-git.md>)]

### [Deploy using a ZIP file](#tab/zip-deploy)

[!INCLUDE [Deploy using ZIP file](<./includes/quickstart-python/deploy-zip-file.md>)]

---

Having issues? Refer first to the [Troubleshooting guide](./configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/PythonAppServiceQuickstartFeedback).

## 4 - Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`. If you see a default app page, wait a minute and refresh the browser.

The Python sample code is running a Linux container in App Service using a built-in image.

:::image type="content" source="./media/quickstart-python/run-app-azure.png" alt-text="Screenshot of the app running in Azure":::

**Congratulations!** You've deployed your Python FastAPI app to App Service.

Having issues? Refer first to the [Troubleshooting guide](./configure-language-python.md#troubleshooting), otherwise, [let us know](https://aka.ms/PythonAppServiceQuickstartFeedback).
