---
title: Create an IoT Central application
description: How to create an IoT Central application by using the Azure IoT Central site, the Azure portal, or a command-line environment.
services: iot-central
ms.service: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 07/14/2023
ms.topic: how-to
---

# Create an IoT Central application

You have several ways to create an IoT Central application. You can use one of the GUI-based methods if you prefer a manual approach, or one of the CLI or programmatic methods if you want to automate the process.

Whichever approach you choose, the configuration options are the same, and the process typically takes less than a minute to complete.

[!INCLUDE [Warning About Access Required](../../../includes/iot-central-warning-contribitorrequireaccess.md)]

To learn how to manage IoT Central application by using the IoT Central REST API, see [Use the REST API to create and manage IoT Central applications.](../core/howto-manage-iot-central-with-rest-api.md)

## Options

This section describes the available options when you create an IoT Central application. Depending on the method you choose, you might need to supply the options on a form or as command-line parameters:

### Pricing plans

The *standard* plans:

- You should have at least **Contributor** access in your Azure subscription. If you created the subscription yourself, you're automatically an administrator with sufficient access. To learn more, see [What is Azure role-based access control?](../../role-based-access-control/overview.md).
- Let you create and manage IoT Central applications using any of the available methods.
- Let you connect as many devices as you need. You're billed by device. To learn more, see [Azure IoT Central pricing](https://azure.microsoft.com/pricing/details/iot-central/).
- Can be upgraded or downgraded to other standard plans.

The following table summarizes the differences between the three standard plans:

| Plan name | Free devices | Messages/month | Use case |
| --------- | ------------ | -------------- | -------- |
| S0        | 2            | 400            | A few messages per day |
| S1        | 2            | 5,000          | A few messages per hour |
| S2        | 2            | 30,000         | Messages every few minutes |

### Application name

The _application name_ you choose appears in the title bar on every page in your IoT Central application.

The _subdomain_ you choose uniquely identifies your application. The subdomain is part of the URL you use to access the application. The URL for an IoT Central application looks like `https://yoursubdomain.azureiotcentral.com`.

### Application template ID

The application template you choose determines the initial contents of your application, such as dashboards and device templates. The template ID For a custom application, use `iotc-pnp-preview` as the template ID.

### Billing information

If you choose one of the standard plans, you need to provide billing information:

- The Azure subscription you're using.
- The directory that contains the subscription you're using.
- The location to host your application. IoT Central uses Azure regions as locations: Australia East, Canada Central, Central US, East US, East US 2, Japan East, North Europe, South Central US, Southeast Asia, UK South, West Europe, and West US.

## Azure portal

The easiest way to get started creating IoT Central applications is in the [Azure portal](https://portal.azure.com/#create/Microsoft.IoTCentral).

[!INCLUDE [Warning About Access Required](../../../includes/iot-central-warning-contribitorrequireaccess.md)]

Enter the following information:

| Field | Description |
| ----- | ----------- |
| Subscription | The Azure subscription you want to use. |
| Resource group | The resource group you want to use.  You can create a new resource group or use an existing one. |
| Resource name | A valid Azure resource name. |
| Application URL | The URL subdomain for your application. The URL for an IoT Central application looks like `https://yoursubdomain.azureiotcentral.com`. |
| Template | The application template you want to use. For a blank application template, select **Custom application**.|
| Region | The Azure region you want to use. |
| Pricing plan | The pricing plan you want to use. |

:::image type="content" source="media/howto-create-iot-central-application/create-app-portal.png" alt-text="Screenshot that shows the create application experience in the Azure portal.":::

Select **Review + create**, Then select **Create** to create the application.

When the app is ready, you can navigate to it from the Azure portal:

:::image type="content" source="media/howto-create-iot-central-application/view-app-portal.png" alt-text="Screenshot that shows the IoT Central application resource in the Azure portal. The application URL is highlighted.":::

To list all the IoT Central apps you've created, navigate to [IoT Central Applications](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.IoTCentral%2FIoTApps).

To list all the IoT Central applications you have access to, navigate to [IoT Central Applications](https://apps.azureiotcentral.com/myapps).

## Copy an application

You can create a copy of any application, minus any device instances, device data history, and user data. The copy uses a standard pricing plan that you'll be billed for.

Navigate to **Application > Management** and select **Copy**. In the dialog box, enter the details for the new application. Then select **Copy** to confirm that you want to continue. To learn more about the fields in the form, see [Options](#options).

:::image type="content" source="media/howto-create-iot-central-application/app-copy.png" alt-text="Screenshot that shows the copy application settings page." lightbox="media/howto-create-iot-central-application/app-copy.png":::

After the application copy operation succeeds, you can navigate to the new application using the link.

Copying an application also copies the definition of rules and email action. Some actions, such as Flow and Logic Apps, are tied to specific rules by the rule ID. When a rule is copied to a different application, it gets its own rule ID. In this case, users must create a new action and then associate the new rule with it. In general, it's a good idea to check the rules and actions to make sure they're up-to-date in the new application.

> [!WARNING]
> If a dashboard includes tiles that display information about specific devices, then those tiles show **The requested resource was not found** in the new application. You must reconfigure these tiles to display information about devices in your new application.

## Create and use a custom application template

When you create an Azure IoT Central application, you choose from the built-in sample templates. You can also create your own application templates from existing IoT Central applications. You can then use your own application templates when you create new applications.

When you create an application template, it includes the following items from your existing application:

- The default application dashboard, including the dashboard layout and all the tiles you've defined.
- Device templates, including measurements, settings, properties, commands, and dashboard.
- Rules. All rule definitions are included. However actions, except for email actions, aren't included.
- Device groups, including their queries.

> [!WARNING]
> If a dashboard includes tiles that display information about specific devices, then those tiles show **The requested resource was not found** in the new application. You must reconfigure these tiles to display information about devices in your new application.

When you create an application template, it doesn't include the following items:

- Devices
- Users
- Continuous data export definitions

Add these items manually to any applications created from an application template.

To create an application template from an existing IoT Central application:

1. Go to the **Application** section in your application.
1. Select **Template Export**.
1. On the **Template Export** page, enter a name and description for your template.
1. Select the **Export** button to create the application template. You can now copy the **Shareable Link** that enables someone to create a new application from the template:

:::image type="content" source="media/howto-create-iot-central-application/create-template.png" alt-text="Screenshot that shows export an application template." lightbox="media/howto-create-iot-central-application/create-template.png":::

### Use an application template

To use an application template to create a new IoT Central application, you need a previously created **Shareable Link**. Paste the **Shareable Link** into your browser's address bar. The **Create an application** page displays with your custom application template selected.

Select your pricing plan and fill out the other fields on the form. Then select **Create** to create a new IoT Central application from the application template.

### Manage application templates

On the **Application Template Export** page, you can delete or update the application template.

If you delete an application template, you can no longer use the previously generated shareable link to create new applications.

To update your application template, change the template name or description on the **Application Template Export** page. Then select the **Export** button again. This action generates a new **Shareable link** and invalidates any previous **Shareable link** URL.

## Other approaches

You can also use the following approaches to create an IoT Central application:

- [Create an IoT Central application using the command line](howto-manage-iot-central-from-cli.md#create-an-application)
- [Create an IoT Central application programmatically](/samples/azure-samples/azure-iot-central-arm-sdk-samples/azure-iot-central-arm-sdk-samples/)

## Next steps

Now that you've learned how to manage Azure IoT Central applications from Azure CLI, here's the suggested next step:

> [!div class="nextstepaction"]
> [Administer your application](howto-administer.md)
