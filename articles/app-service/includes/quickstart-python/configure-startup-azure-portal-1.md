---
author: JimacoMS4
ms.author: v-jibrannian
ms.topic: include
ms.date: 07/02/7024
---
First, you need to configure a startup command in Azure App Service. Navigate to page for the App Service instance in the Azure portal.<br>
<br>
1. Select **Configuraiton** under the **Setting** heading in the menu on the left side of the page.
1. Make sure the **General settings** tab is selected.
1. In the **Startup Command** field, enter *gunicorn -w 2 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 main:app*.
1. Select **Save** to save your changes.
1. Wait for the notification that the settings have been updated before proceeding.
