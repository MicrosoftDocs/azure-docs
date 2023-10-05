---
author: DavidCBerry13
ms.author: daberry
ms.topic: include
ms.date: 01/29/2022
---
Applications can be deployed to Azure by creating and uploading a ZIP file of the application code to Azure. ZIP files can be uploaded to Azure using the Azure CLI or an HTTP client like [cURL](https://curl.se/).

### Enable build automation

When deploying a ZIP file of your Python code, you need to set a flag to enable Azure build automation. The build automation will install any necessary requirements and package the application to run on Azure.

Build automation in Azure is enabled by setting the `SCM_DO_BUILD_DURING_DEPLOYMENT` app setting in either the Azure portal or Azure CLI.

##### [Azure portal](#tab/deploy-instructions-azportal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Enable build automation from Azure portal 1](<./deploy-zip-azure-portal-1.md>)] | :::image type="content" source="../../media/quickstart-python/deploy-zip-azure-portal-build-1-240px.png" alt-text="A screenshot showing the app settings for a web app and how to add a new setting in the Azure portal." lightbox="../../media/quickstart-python/deploy-zip-azure-portal-build-1.png"::: |
| [!INCLUDE [Enable build automation from Azure portal 2](<./deploy-zip-azure-portal-2.md>)] | :::image type="content" source="../../media/quickstart-python/deploy-zip-azure-portal-build-2-240px.png" alt-text="A screenshot showing the dialog box used to add an app setting in the Azure portal." lightbox="../../media/quickstart-python/deploy-zip-azure-portal-build-2.png"::: |
| [!INCLUDE [Enable build automation from Azure portal 3](<./deploy-zip-azure-portal-3.md>)] | :::image type="content" source="../../media/quickstart-python/deploy-zip-azure-portal-build-3-240px.png" alt-text="A screenshot showing the location of the save button." lightbox="../../media/quickstart-python/deploy-zip-azure-portal-build-3.png"::: |

##### [Azure CLI](#tab/deploy-instructions-azcli)

Use the [az webapp config appsettings set](/cli/azure/webapp/config/appsettings#az-webapp-config-appsettings-set) command to set the `SCM_DO_BUILD_DURING_DEPLOYMENT` setting to a value of `true`.

[!INCLUDE [Azure CLI build automation commands](<./deploy-zip-build-settings.md>)]

---

### Create a ZIP file of your application

Next, create a ZIP file of your application. You only need to include components of the application itself. You do not need to include any files or directories that start with a dot (`.`) such as `.venv`, `.gitignore`, `.github`, or `.vscode`.

#### [Windows](#tab/windows)

On Windows, use a program like 7-Zip to create a ZIP file needed to deploy the application.

:::image type="content" source="../../media/quickstart-python/deploy-zip-create-zip-windows-600px.png" alt-text="A screenshot showing files being zipped into a ZIP file using 7-Zip." lightbox="../../media/quickstart-python/deploy-zip-create-zip-windows.png":::

#### [macOS/Linux](#tab/mac-linux)

On macOS or Linux, you can use the built-in `zip` utility to create a ZIP file.

```bash
zip -r <file-name>.zip . -x '.??*'
```

---

### Upload the ZIP file to Azure

Once you have a ZIP file, the file can be uploaded to Azure using either Azure CLI or an HTTP client like Postman or cURL.

#### [Azure CLI](#tab/deploy-instructions-zip-azcli)

The [az webapp deploy](/cli/azure/webapp#az-webapp-deploy) command can be used to upload and deploy a zip file to Azure.

[!INCLUDE [Azure CLI deploy commands](<./deploy-zip-cli-commands.md>)]

#### [Postman](#tab/deploy-instructions-zip-postman)

To use [Postman](https://www.postman.com/downloads/) to upload your ZIP file to Azure, you will need the deployment username and password for your App Service. These credentials can be obtained from the Azure portal.

1. On the page for the web app, select **Deployment center** from the menu on the left side of the page.
1. Select the **FTPS credentials** tab.
1. The **Username** and **Password** are shown under the **Application scope** heading.  For zip file deployments, only use the part of the username after the `\` character that starts with a `$`, for example `$msdocs-python-webapp-quickstart-123`. These credentials will be needed when uploading your zip file with Postman.

:::image type="content" source="../../media/quickstart-python/deploy-zip-azure-portal-get-username-600px.png" alt-text="A screenshot showing the location of the deployment credentials in the Azure portal." lightbox="../../media/quickstart-python/deploy-zip-azure-portal-get-username.png":::

In Postman, upload your file using the following steps.

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Postman upload step 1](<./deploy-zip-postman-1.md>)] | :::image type="content" source="../../media/quickstart-python/deploy-zip-postman-1-240px.png" alt-text="A screenshot showing how to create a new POST request in Postman." lightbox="../../media/quickstart-python/deploy-zip-postman-1.png"::: |
| [!INCLUDE [Postman upload step 2](<./deploy-zip-postman-2.md>)] | :::image type="content" source="../../media/quickstart-python/deploy-zip-postman-2-240px.png" alt-text="A screenshot showing how to configure basic authorization for a POST request in Postman." lightbox="../../media/quickstart-python/deploy-zip-postman-2.png"::: |
| [!INCLUDE [Postman upload step 3](<./deploy-zip-postman-3.md>)] | :::image type="content" source="../../media/quickstart-python/deploy-zip-postman-3-240px.png" alt-text="A screenshot showing how to select a file for a POST request in Postman." lightbox="../../media/quickstart-python/deploy-zip-postman-3.png"::: |
| [!INCLUDE [Postman upload step 4](<./deploy-zip-postman-4.md>)] | :::image type="content" source="../../media/quickstart-python/deploy-zip-postman-4-240px.png" alt-text="A screenshot showing how to send a POST request in Postman." lightbox="../../media/quickstart-python/deploy-zip-postman-4.png"::: |

#### [cURL](#tab/deploy-instructions-zip-curl)

To use cURL to upload your ZIP file to Azure, you will need the deployment username and password for your App Service. These credentials can be obtained from the Azure portal.

1. On the page for the web app, select **Deployment center** from the menu on the left side of the page.
1. Select the **FTPS credentials** tab.
1. The **Username** and **Password** are shown under the **Application scope** heading.  For zip file deployments, only use the part of the username after the `\` character that starts with a `$`, for example `$msdocs-python-webapp-quickstart-123`. These credentials will be needed in the cURL command.

:::image type="content" source="../../media/quickstart-python/deploy-zip-azure-portal-get-username-600px.png" alt-text="A screenshot showing the location of the deployment credentials in the Azure portal." lightbox="../../media/quickstart-python/deploy-zip-azure-portal-get-username.png":::

Run the following `curl` command to upload your zip file to Azure and deploy your application.  The username is the deployment username obtained in step 3.  When this command is run, you will be prompted for the deployment password.

[!INCLUDE [cURL commands](<./deploy-zip-curl-commands.md>)]

Depending on your network bandwidth, files usually take between 10 and 30 seconds to upload to Azure.

---
