---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Create an Azure IoT Central application | Microsoft Docs
description: As an adminstrator, how to create an Azure IoT Central application.
services: iot-central
ms.service: iot-central
author: tbhagwat3
ms.author: tanmayb
ms.date: 07/09/2018
ms.topic: conceptual
manager: peterpr
---

# Create your Azure IoT Central application

You create your Microsoft Azure IoT Central application from the [Create Application](https://apps.microsoftiotcentral.com/create) page. To create an Azure IoT Central application, you must complete all the fields on this page and then choose **Create**. You'll find has more information about each of the fields below.

![Create Application Page](media\howto-create-application\image1.png)

## Payment plan

You can create either a trial or a paid application. Learn more about trial and paid applications on [Azure IoT Central pricing page](https://azure.microsoft.com/pricing/details/iot-central/)..

## Application Name

The name of your application is displayed on the **Application Manager** page and within each Azure IoT Central application. You can choose any name for your Azure IoT Central application. Choose a name that makes sense to you and to others in your organization.

## Application URL

The application URL is the link to your application. You can save a bookmark to it in your browser or share it with others.

When you enter the name for your application, your application URL is auto-generated. If you prefer, you can choose a different URL for your application. Each Azure IoT Central URL must be unique within Azure IoT Central. You see an error message if the URL you choose has already been taken.

## Directory

Only in paid applications.

Choose an Azure Active Directory tenant to create a Azure IoT Central application. An Azure Active Directory tenant contains user identities, credentials, and other organizational information. Multiple Azure subscriptions can be associated with a single Azure Active Directory tenant.

If you don’t have an Azure Active Directory tenant, one is created for you when you create an Azure subscription.

To learn more, see [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/).

## Azure subscription

An Azure subscription enables you to create instances of Azure services. Azure IoT Central automatically finds all the Azure Subscriptions you have access to, and displays them in a dropdown on the **Create Application** page. Choose an Azure subscription to create a new Azure IoT Central Application.

If you don’t have an Azure subscription, you can create one on the [Azure sign-up page](https://aka.ms/createazuresubscription). After you create the Azure subscription, navigate back to the **Create Application** page. Your new subscription appears in the **Azure Subscription** drop-down.

To learn more, see [Azure subscriptions](https://docs.microsoft.com/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing).

## Region

Only in paid applications.

Choose the region where you’d like to create your Azure IoT Central Application. Typically, you should choose the region that is closest physically to your devices to get optimal performance.

To learn more, see [Azure regions](https://docs.microsoft.com/azure/guides/developer/azure-developer-guide#azure-regions).

You can see the regions in which Azure IoT Central is available on the [Products available by region](https://azure.microsoft.com/regions/services/) page.

> [!Note]
> Once you choose a region, you cannot later move your application to a different region.

## Application template

You can choose one of the available application templates for your new Azure IoT Central application. An application template can contain predefined items such as device templates and dashboards to help you get started.

| Application template | Description |
| -------------------- | ----------- |
| Custom application   | Creates an empty application for you to populate with your own device templates and devices. |
| Sample Contoso       | Creates an application that includes a device template for a simple connected device. Use this template to get started exploring Azure IoT Central. |
| Sample Devkits       | Creates an application with device templates ready for you to connect an MXChip or Raspberry Pi device. Use this template if you are a device developer experimenting with code on one of these devices. |

## Next steps

Now that you have learned how to create an Azure IoT Central application, here is the suggested next step:

> [!div class="nextstepaction"]
> [Administer your application](howto-administer.md)