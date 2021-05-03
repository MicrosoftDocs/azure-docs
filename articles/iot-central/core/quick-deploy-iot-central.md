---
title: Quickstart - Create an Azure IoT Central application | Microsoft Docs
description: Quickstart - Create a new Azure IoT Central application. Create the application using either the free pricing plan or one of the standard pricing plans.
author: viv-liu
ms.author: viviali
ms.date: 12/28/2020
ms.topic: quickstart
ms.service: iot-central
services: iot-central
manager: corywink
---

# Quickstart - Create an Azure IoT Central application

This quickstart shows you how to create an Azure IoT Central application.

## Prerequisite 

 - An Azure account with an active subscription. Create an account for [free](https://aka.ms/createazuresubscription).
 - Your Azure subscription should have Contributor access

## Create an application

Navigate to the [Azure IoT Central Build](https://aka.ms/iotcentral) site. Then sign in with a Microsoft personal, work, or school account.

You can create a new application either from the list of industry-relevant IoT Central templates to help you get started quickly, or start from scratch using a **Custom app** template. In this quickstart, you use the **Custom application** template.

To create a new Azure IoT Central application from the **Custom application** template:

1. Navigate to the **Build** page:

    :::image type="content" source="media/quick-deploy-iot-central/iotcentralcreate-new-application.png" alt-text="Build your IoT application page":::

1. Choose **Custom app**

1. On the **New application** page, make sure that **Custom application** is selected under the **Application template**.

1. Azure IoT Central automatically suggests an **Application name** based on the application template you've selected. You can use this name or enter your own friendly application name.

1. Azure IoT Central also generates a unique **URL** prefix for you, based on the application name. You use this URL to access your application. Change this URL prefix to something more memorable if you'd like.

    :::image type="content" source="media/quick-deploy-iot-central/iotcentralcreate-custom.png" alt-text="Azure IoT Central Create an application page":::

    :::image type="content" source="media/quick-deploy-iot-central/iotcentralcreate-billinginfo.png" alt-text="Azure IoT Central billing info":::

    > [!Tip]
    > If you chose **Custom app** on the previous page, you will see an **Application template** dropdown. The dropdown might show other templates that have been made available to you by your organization.

1. Choose to create this application using the 7-day free trial pricing plan, or one of the standard pricing plans:

    - Applications you create using the *free* plan are free for seven days and support up to five devices. You can convert them to use a standard pricing plan at any time before they expire.
        > [!NOTE]
        > Applications created using the *free* plan do not require an Azure subscriptions, and therefore you won't find them listed in your Azure subscription on the Azure portal. You can only see and manage free apps from the IoT Central portal.          
    - Applications you create using a *standard* plan are billed on a per device basis, you can choose either **Standard 0**, **Standard 1**, or **Standard 2** pricing plan with the first two devices being free. Learn more about the free and standard pricing plans on the [Azure IoT Central pricing page](https://azure.microsoft.com/pricing/details/iot-central/). If you create an application using a standard pricing plan, you need to select your *Directory*, *Azure Subscription*, and *Location*:
        - *Directory* is the Azure Active Directory in which you create your application. An Azure Active Directory contains user identities, credentials, and other organizational information. If you don't have an Azure Active Directory, one is created for you when you create an Azure subscription.
        - An *Azure Subscription* enables you to create instances of Azure services. IoT Central provisions resources in your subscription. If you don't have an Azure subscription, you can create one for free on the [Azure sign-up page](https://aka.ms/createazuresubscription). After you create the Azure subscription, navigate back to the **New application** page. Your new subscription now appears in the **Azure Subscription** drop-down.
        - *Location* is the [geography](https://azure.microsoft.com/global-infrastructure/geographies/) where you'd like to create your application. Typically, you should choose the location that's physically closest to your devices to get optimal performance. Once you choose a location, you can't later move your application to a different location.

1. Review the Terms and Conditions, and select **Create** at the bottom of the page. After a few minutes, your IoT Central application will be ready to use:

    :::image type="content" source="media/quick-deploy-iot-central/iotcentral-application.png" alt-text="Azure IoT Central application":::

## Clean up resources

[!INCLUDE [iot-central-clean-up-resources](../../../includes/iot-central-clean-up-resources.md)]

## Next steps

In this quickstart, you created an IoT Central application. Here's the suggested next step to continue learning about IoT Central:

> [!div class="nextstepaction"]
> [Add a simulated device to your IoT Central application](./quick-create-simulated-device.md)

If you're a device developer and want to dive into some code, the suggested next step is to:
> [!div class="nextstepaction"]
> [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device.md)
