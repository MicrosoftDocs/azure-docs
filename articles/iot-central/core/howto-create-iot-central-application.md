---
title: Create an IoT Central application | Microsoft Docs
description: This article describes the options to create an IoT Central application including from the Azure IoT Central site, the Azure portal, and from a command-line environment.
services: iot-central
ms.service: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 05/11/2021
ms.topic: how-to
---

# Create an IoT Central application

You have several ways to create an IoT Central application. You can use one of the GUI-based methods if you prefer a manual approach, or one of the CLI or programmatic methods if you want to automate the process.

Whichever approach you choose, the configuration options are the same, and the process typically takes less than a minute to complete.

[!INCLUDE [Warning About Access Required](../../../includes/iot-central-warning-contribitorrequireaccess.md)]

## Options

This section describes the available options when you create an IoT Central application. Depending on the method you choose, you might need to supply the options on a form or as command-line parameters:

### Pricing plans

The *free* plan lets you create an IoT Central application to try for seven days. The free plan:

- Doesn't require an Azure subscription.
- Can only be created and managed on the [Azure IoT Central](https://aka.ms/iotcentral) site.
- Lets you connect up to five devices.
- Can be upgraded to a standard plan if you want to keep your application.

The *standard* plans:

- Do require an Azure subscription. You should have at least **Contributor** access in your Azure subscription. If you created the subscription yourself, you're automatically an administrator with sufficient access. To learn more, see [What is Azure role-based access control?](../../role-based-access-control/overview.md).
- Let you create and manage IoT Central applications using any of the available methods.
- Let you connect as many devices as you need. You're billed by device. To learn more, see [Azure IoT Central pricing](https://azure.microsoft.com/pricing/details/iot-central/).
- Cannot be downgraded to a free plan, but can be upgraded or downgraded to other standard plans.

The following table summarizes the differences between the three standard plans:

| Plan name | Free devices | Messages/month | Use case |
| --------- | ------------ | -------------- | -------- |
| S0        | 2            | 400            | A few messages per day |
| S1        | 2            | 5,000          | A few messages per hour |
| S2        | 2            | 30,000         | Messages every few minutes |

To learn more, see [Manage your bill in an IoT Central application](howto-view-bill.md).

### Application name

The _application name_ you choose appears in the title bar on every page in your IoT Central application. It also appears on your application's tile on the **My apps** page on the [Azure IoT Central](https://aka.ms/iotcentral) site.

The _subdomain_ you choose uniquely identifies your application. The subdomain is part of the URL you use to access the application. The URL for an IoT Central application looks like `https://yoursubdomain.azureiotcentral.com`.

### Application template ID

The application template you choose determines the initial contents of your application, such as dashboards and device templates. The template ID For a custom application, use `iotc-pnp-preview` as the template ID.

To learn more about custom and industry-focused application templates, see [What are application templates?](concepts-app-templates.md).

### Billing information

If you choose one of the standard plans, you need to provide billing information:

- The Azure subscription you're using.
- The directory that contains the subscription you're using.
- The location to host your application. IoT Central uses Azure geographies as locations: United States, Europe, Asia Pacific, Australia, United Kingdom, or Japan.

## Azure IoT Central site

The easiest way to get started creating IoT Central applications is on the [Azure IoT Central](https://aka.ms/iotcentral) site.

The [Build](https://apps.azureiotcentral.com/build) lets you select the application template you want to use:

:::image type="content" source="media/howto-create-iot-central-application/choose-template.png" alt-text="Screenshot of build page that lets you choose an application template.":::

If you select **Create app**, you can provide the necessary information to create an application from the template:

:::image type="content" source="media/howto-create-iot-central-application/create-application.png" alt-text="Screenshot showing create application page for IoT Central.":::

The **My apps** page lists all the IoT Central applications you have access to. The list includes applications you created and applications that you've been granted access to.

> [!TIP]
> All the applications you create using a standard pricing plan on the Azure IoT Central site use the **IOTC** resource group in your subscription. The approaches decribed in the following section let you choose a resource group to use.

## Other approaches

You can also use the following approaches to create an IoT Central application:

- [Create an IoT Central application from the Azure portal](howto-manage-iot-central-from-portal.md#create-iot-central-applications)
- [Create an IoT Central application using the Azure CLI](howto-manage-iot-central-from-cli.md#create-an-application)
- [Create an IoT Central application using PowerShell](howto-manage-iot-central-from-powershell.md#create-an-application)
- [Create an IoT Central application programmatically](howto-manage-iot-central-programmatically.md)

## Next steps

Now that you've learned how to manage Azure IoT Central applications from Azure CLI, here's the suggested next step:

> [!div class="nextstepaction"]
> [Administer your application](howto-administer.md)
