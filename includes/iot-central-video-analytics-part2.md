---
 title: include file
 description: include file
 services: iot-central
 author: dominicbetts
 ms.service: iot-central
 ms.topic: include
 ms.date: 10/06/2020
 ms.author: dobett
 ms.custom: include file
---

## Deploy and configure Azure Media Services

The solution uses an Azure Media Services account to store the object detection video clips made by the IoT Edge gateway device.

When you create the Media Services account:

- You need to provide an account name, an Azure subscription, a location, a resource group, and a storage account. Create a new storage account using the default settings while you're creating the Media Services account.

- Choose the **East US** region for the location.

- Create a new resource group called *lva-rg* in the **East US** region for the Media Services and storage accounts. When you finish the tutorials, it's easy to remove all the resources by deleting the *lva-rg* resource group.

Create the [Media Services account in the Azure portal](https://portal.azure.com/?r=1#create/Microsoft.MediaService).

> [!TIP]
> These tutorials use the **East US** region in all the examples. You can use your closest region if you prefer.

Make a note of your **Media Services** account name in the *scratchpad.txt* file.

When the deployment is complete, open a Cloud Shell and run the following command to retrieve the **Resource ID** for your media service account:

```azurecli
az resource list --resource-group lva-rg --resource-type microsoft.media/mediaservices --output table --query "[].{ResourceID:id}"
```

:::image type="content" source="media/iot-central-video-analytics-part2/get-resource-id.png" alt-text="Use Cloud Shell to get the resource ID":::

Make a note of the **Resource ID** in the *scratchpad.txt* file, you use this value later when you configure the IoT Edge module.

Next, configure an Azure Active Directory service principal for your Media Services resource. Select **API access** and then **Service principal authentication**. Create a new Azure Active Directory app with the same name as your Media Services resource, and create a secret with a description *IoT Edge Access*.

:::image type="content" source="./media/iot-central-video-analytics-part2/media-service-authentication.png" alt-text="Configure Azure A D app for Azure Media Services":::

When the secret is generated, scroll down to the **Copy your credentials to connect your service principal application** section. Then select **JSON**. You can copy all the credential information from here in one go. Make a note of this information in the *scratchpad.txt* file, you use it later when you configure the IoT Edge device.

> [!WARNING]
> This is your only chance to view and save the secret. If you lose it, you have to generate another secret.

## Create the Azure IoT Central application

In this section, you create a new Azure IoT Central application from a template. You use this application throughout the tutorial series to build a complete solution.

To create a new Azure IoT Central application:

1. Navigate to the [Azure IoT Central application manager](https://aka.ms/iotcentral) website.

1. Sign in with the credentials you use to access your Azure subscription.

1. To start creating a new Azure IoT Central application, select **New Application** on the **Build** page.

1. Select **Retail**. The retail page displays several retail application templates.

To create a new video analytics application:

1. Select the **Video analytics - object and motion detection** application template. This template includes device templates for the devices used in the tutorial. The template includes sample dashboards that operators can use to perform tasks such as monitoring and managing cameras.

1. Optionally, choose a friendly **Application name**. This application is based on a fictional retail store named Northwind Traders. The tutorial uses the **Application name** *Northwind Traders video analytics*.

    > [!NOTE]
    > If you use a friendly **Application name**, you must still use a unique value for the application **URL**.

1. If you have an Azure subscription, select your **Directory**, **Azure subscription**, and **United States** as the **Location**. If you don't have a subscription, you can enable **7-day free trial** and complete the required contact information. This tutorial uses three devices - two cameras and an IoT Edge device - so if you don't use the free trial you'll be billed for usage.

    For more information about directories, subscriptions, and locations, see the [Create an IoT Central application](../articles/iot-central/core/howto-create-iot-central-application.md).

1. Select **Create**.

    :::image type="content" source="./media/iot-central-video-analytics-part2/new-application.png" alt-text="Azure IoT Central Create Application page":::

### Retrieve the configuration data

Later in this tutorial when you configure the IoT Edge gateway, you need some configuration data from the IoT Central application. The IoT Edge device needs this information to register with, and connect to, the application.

In the **Administration** section, select **Your application** and make a note of the **Application URL** and the **Application ID** in the *scratchpad.txt* file:

:::image type="content" source="./media/iot-central-video-analytics-part2/administration.png" alt-text="Screenshot shows the Administration pane of a video analytics page with Application U R L and Application I D highlighted.":::

Select **API Tokens** and generate a new token called **LVAEdgeToken** for the **Operator** role:

:::image type="content" source="./media/iot-central-video-analytics-part2/token.png" alt-text="Generate Token":::

Make a note of the token in the *scratchpad.txt* file for later. After the dialog closes you can't view the token again.

In the **Administration** section, select **Device connection**, and then select **SAS-IoT-Devices**.

Make a note of the **Primary key** for devices in the *scratchpad.txt* file. You use this *primary group shared access signature token* later when you configure the IoT Edge device.
