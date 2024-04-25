---
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  include
ms.date: 04/25/2024
ms.author: cshoe
---

Next.js applications that use server-side rendering require a dedicated Azure App Service as the deployment destination for the backend of the application. Once you have this hosting plan, you can link your static web app to the App Service plan.

When you link the backend resource to your Next.js app, server-side requests are served from the backend server.

Use the following steps to link your App Service plan to your static web app: 

1. Create an Azure App Service under the **S1** plan.

1. Go to your static web app in the Azure portal.

1. In the *Settings* section, select **APIs**.

1. Append the following text to the end of the URL in your browser's location:

    ```text
    exp.AzurePortal_enable-nextjs=true
    ```

    Once you complete these steps, you can link your static web app to your App Service plan using this screen.
