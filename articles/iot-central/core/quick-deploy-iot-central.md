---
title: Create an Azure IoT Central application | Microsoft Docs
description: Create a new Azure IoT Central application. Create the application using either the free pricing plan or one of the standard pricing plans.
author: viv-liu
ms.author: viviali
ms.date: 02/12/2020
ms.topic: quickstart
ms.service: iot-central
services: iot-central
ms.custom: mvc
manager: corywink
---

# Create an Azure IoT Central application

This quickstart shows you how to create an Azure IoT Central application.

## Create an application

Navigate to the [Azure IoT Central Build](https://aka.ms/iotcentral) site. Then sign in with a Microsoft personal, work, or school account.

You create a new application either from the list of industry-relevant IoT Central templates to help you get started quickly, or start from scratch using a **Custom apps** template. In this quickstart, you use the **Custom application** template.

To create a new Azure IoT Central application from the **Custom application** template:

1. Navigate to the **Build** page:

    ![Build your IoT application page](media/quick-deploy-iot-central/iotcentralcreate-new-application.png)

1. Choose **Custom apps** and make sure that the **Custom application** template is selected.

1. Azure IoT Central automatically suggests an **application name** based on the application template you've selected. You can use this name or enter your own friendly application name.

1. Azure IoT Central also generates a unique **application URL** prefix for you, based on the application name. You use this URL to access your application. Change this URL prefix to something more memorable if you'd like.

    ![Azure IoT Central Create an application page](media/quick-deploy-iot-central/iotcentralcreate-custom.png)

    ![Azure IoT Central billing info](media/quick-deploy-iot-central/iotcentralcreate-billinginfo.png)

    > [!NOTE]
    > If you chose **Custom app** on the previous page, you see an **Application template** dropdown. From here you can switch between custom and legacy templates. You might also see other templates that have been made available for your organization.

1. Choose to create this application using the 7-day free trial pricing plan, or one of the standard pricing plans:

    - Applications you create using the *free* plan are free for seven days and support up to five devices. You can convert them to use a standard pricing plan at any time before they expire.
    - Applications you create using a *standard* plan are billed on a per device basis, you can choose either **Standard 1** or **Standard 2** pricing plan with the first two devices being free. Learn more about the free and standard pricing plans on the [Azure IoT Central pricing page](https://azure.microsoft.com/pricing/details/iot-central/). If you create an application using a standard pricing plan, you need to select your *Directory*, *Azure Subscription*, and *Location*:
        - *Directory* is the Azure Active Directory in which you create your application. An Azure Active Directory contains user identities, credentials, and other organizational information. If you don't have an Azure Active Directory, one is created for you when you create an Azure subscription.
        - An *Azure Subscription* enables you to create instances of Azure services. IoT Central provisions resources in your subscription. If you don't have an Azure subscription, you can create one for free on the [Azure sign-up page](https://aka.ms/createazuresubscription). After you create the Azure subscription, navigate back to the **New application** page. Your new subscription now appears in the **Azure Subscription** drop-down.
        - *Location* is the [geography](https://azure.microsoft.com/global-infrastructure/geographies/) where you'd like to create your application. Typically, you should choose the location that's physically closest to your devices to get optimal performance. Once you choose a location, you can't later move your application to a different location.

1. Review the Terms and Conditions, and select **Create** at the bottom of the page. After a few minutes, you IoT Central application is ready to use:

    ![Azure IoT Central application](media/quick-deploy-iot-central/iotcentral-application.png)

## Next steps

In this quickstart, you created an IoT Central application. Here's the suggested next step to continue learning about IoT Central:

> [!div class="nextstepaction"]
> [Add a simulated device to your IoT Central application](./quick-create-simulated-device.md)

If you're a device developer and want to dive into some code, the suggested next step is to:
> [!div class="nextstepaction"]
> [Create and connect a client application to your Azure IoT Central application](./tutorial-connect-device-nodejs.md)
