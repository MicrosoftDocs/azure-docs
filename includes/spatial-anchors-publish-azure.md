---
author: ramonarguelles
ms.service: spatial-anchors
ms.topic: include
ms.date: 1/30/2019
ms.author: rgarcia
---
### Open the publish wizard

1. In **Solution Explorer**, right-click the **SharingService** project, and then select **Publish**.

   The Publish Wizard starts. 

1. Select **App Service** > **Publish** to open the **Create App Service** pane.

### Sign in to Azure

1. Sign in to the Azure portal.

1. On the **Create App Service** pane, select **Add an account**, and then sign in to your Azure subscription. If you're already signed in, select the account you want from the drop-down list.

   > [!NOTE]
   > If you're already signed in, don't select **Create** yet.
   >

### Create a resource group

[!INCLUDE [resource group intro text](resource-group.md)]

1. Next to **Resource Group**, select **New**.

1. Name the resource group **myResourceGroup**, and then select **OK**.

### Create an App Service plan

[!INCLUDE [app-service-plan](app-service-plan.md)]

1. Next to **Hosting Plan**, select **New**.

1. On the **Configure Hosting Plan** pane, use these settings:

    | Setting | Suggested value | Description |
    |-|-|-|
    |App Service plan| MySharingServicePlan | Name of the App Service plan |
    | Location | West US | The datacenter where the web app is hosted |
    | Size | Free | The [pricing tier](https://azure.microsoft.com/pricing/details/app-service/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) that determines hosting features |

1. Select **OK**.

### Create and publish the web app

1. In **App Name**, enter a unique app name. Valid characters are a-z, 0-9, and dashes (-), or accept the automatically generated unique name. The URL of the web app is `https://<app_name>.azurewebsites.net`, where `<app_name>` is your app name.

1. Select **Create** to start creating the Azure resources.

After the wizard finishes, it publishes the ASP.NET Core web app to Azure and then opens the app in your default browser.

![Screenshot of a published ASP.NET web app in Azure.](./media/spatial-anchors-azure/web-app-running-live.png)

The app name you used in this section is used as the URL prefix in the format `https://<app_name>.azurewebsites.net`. Copy this URL to a text editor for later use.
