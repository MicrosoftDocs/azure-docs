---
title: 'Quickstart: Create Python app on Linux - Azure App Service'
description: Deploy your first Python hello world app in Azure App Service on Linux in minutes.
services: app-service\web
documentationcenter: ''
author: cephalin
manager: gwallace
editor: ''

ms.assetid: 
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.topic: quickstart
ms.date: 08/23/2019
ms.author: cephalin
ms.custom: seo-python-october2019

experimental: false
experiment_id: 1e304dc9-5add-4b
---
# Quickstart: Create a Python app in Azure App Service on Linux

In this quickstart, you deploy a simple Python app to [App Service on Linux](app-service-linux-intro.md), Azure's highly scalable, self-patching web hosting service. You use the local [Azure command-line interface (CLI)](/cli/azure/install-azure-cli)) on a Mac, Linux, or Windows computer.

## Prerequisites

- An Azure subscription. If you don't have one already, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- <a href="https://www.python.org/downloads/" target="_blank">Python 3.7</a>
- <a href="https://git-scm.com/downloads" target="_blank">Git</a>

## Download the sample locally

In a terminal window, run the following commands to clone the sample application to your local computer, and go to the folder with the sample code.

```bash
git clone https://github.com/Azure-Samples/python-docs-hello-world
cd python-docs-hello-world
```

The repository contains an *application.py* file, which tells App Service that the code contains a Flask app. For more information, see [Container startup process and customizations](how-to-configure-python.md).

## Run the app locally

In a terminal window, use the commands below to install the required dependencies and launch the built-in development server. 

# [bash](#tab/bash)

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
FLASK_APP=application.py flask run
```

# [PowerShell](#tab/powershell)

```powershell
py -3 -m venv env
env\scripts\activate
pip install -r requirements.txt
Set-Item Env:FLASK_APP ".\application.py"
flask run
```

# [Cmd](#tab/cmd)

```cmd
py -3 -m venv env
env\scripts\activate
pip install -r requirements.txt
SET FLASK_APP=application.py
flask run
```

---

Open a web browser, and go to the sample app at `http://localhost:5000/`. The app displays the message **Hello World!**.

![Run a sample Python app locally](./media/quickstart-python/run-hello-world-sample-python-app-in-browser.png)

In your terminal window, press **Ctrl**+**C** to exit the web server.

## Create a web app

In the folder that contains the sample code, run the following `az webapp up` command, replacing  `<app-name>` with a globally unique app name (*valid characters are `a-z`, `0-9`, and `-`*).

# [Bash](#tab/bash)

```bash
cd python-docs-hello-world

az webapp up -n <app-name>
```

# [PowerShell](#tab/powershell)

```powershell
cd python-docs-hello-world

az webapp up -n <app-name>
```

# [Cmd](#tab/cmd)

```cmd
cd python-docs-hello-world

az webapp up -n <app-name>
```

---

This command may take a few minutes complete run. While running, it displays information similar to the following example:

```output
The behavior of this command has been altered by the following extension: webapp
Creating Resource group 'appsvc_rg_Linux_CentralUS' ...
Resource group creation complete
Creating App service plan 'appsvc_asp_Linux_CentralUS' ...
App service plan creation complete
Creating app '<app-name>' ....
Webapp creation complete
Creating zip with contents of dir /home/username/quickstart/python-docs-hello-world ...
Preparing to deploy contents to app.
All done.
{
  "app_url": "https:/<app-name>.azurewebsites.net",
  "location": "Central US",
  "name": "<app-name>",
  "os": "Linux",
  "resourcegroup": "appsvc_rg_Linux_CentralUS ",
  "serverfarm": "appsvc_asp_Linux_CentralUS",
  "sku": "BASIC",
  "src_path": "/home/username/quickstart/python-docs-hello-world ",
  "version_detected": "-",
  "version_to_create": "python|3.7"
}
```

[!INCLUDE [AZ Webapp Up Note](../../../includes/app-service-web-az-webapp-up-note.md)]

## Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`.

The Python sample code is running in App Service on Linux with a built-in container image.

![Run a sample Python app in Azure](./media/quickstart-python/run-hello-world-sample-python-app-in-browser.png)

**Congratulations!** You've deployed your first Python app to App Service on Linux.

## Update locally and redeploy the code

In your favorite code editor, open *application.py* and change the `return` statement to match the following line:

```python
return "Hello Azure!"
```

Save your changes and exit the editor. 

Redeploy the app using the following [`az webapp up`](/cli/azure/webapp#az-webapp-up) command, using the name of your app in place of `<app-name>`.

# [Bash](#tab/bash)

```bash
az webapp up -n <app-name>
```

# [PowerShell](#tab/powershell)

```powershell
az webapp up -n <app-name>
```

# [Cmd](#tab/cmd)

```cmd
az webapp up -n <app-name>
```

---

Once deployment has completed, switch back to the browser window open to `http://<app-name>.azurewebsites.net` and refresh the page, which should display the modified message:

![Run an updated sample Python app in Azure](./media/quickstart-python/run-updated-hello-world-sample-python-app-in-browser.png)

## Manage your new Azure app

You manage the app you created in the <a href="https://portal.azure.com" target="_blank">Azure portal</a>. 

From the left menu, select **App Services**, and then select the name of your Azure app.

![Navigate to your Python app in App Services in the Azure portal](./media/quickstart-python/navigate-to-app-in-app-services-in-the-azure-portal.png)

Your app's Overview page appears where you can perform basic management tasks like browse, stop, start, restart, and delete.

![Manage your Python app in the Overview page in the Azure portal](./media/quickstart-python/manage-an-app-in-app-services-in-the-azure-portal.png)

The left menu provides different pages for configuring your app. 

[!INCLUDE [cli-samples-clean-up](../../../includes/cli-samples-clean-up.md)]

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Python (Django) web app with PostgreSQL](tutorial-python-postgresql-app.md)

> [!div class="nextstepaction"]
> [Configure Python app](how-to-configure-python.md)

> [!div class="nextstepaction"]
> [Tutorial: Run Python app in custom container](tutorial-custom-docker-image.md)
