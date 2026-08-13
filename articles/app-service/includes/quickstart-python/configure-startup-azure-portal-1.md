---
author: msangapu-msft
ms.author: msangapu
ms.topic: include
ms.date: 07/27/2026
ms.service: azure-app-service
---
If you're using **Python 3.13 or earlier**, configure the startup command in Azure App Service. Go to the App Service instance in the Azure portal.<br>
<br>
1. Select **Configuration** under the **Settings** heading in the menu on the left side of the page.
1. Make sure the **General settings** tab is selected.
1. In the **Startup Command** field, enter *gunicorn -w 2 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 main:app*.
1. Select **Save** to save your changes.
1. Wait for the notification that the settings are updated before proceeding.

If you're using **Python 3.14 or later**, no startup command is required.
