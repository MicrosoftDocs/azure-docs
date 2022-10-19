---
# Mandatory fields.
title: Certify bundled or indirectly connected devices
titleSuffix: Azure Certified
description: Learn how to submit a bundled or indirectly connected device for Azure Certified Device certification. See how to configure dependencies and components.
author: cbroad
ms.author: cbroad # Microsoft employees only
ms.date: 06/07/2022
ms.topic: how-to
ms.service: certification
ms.custom: kr2b-contr-experiment

# Optional fields. Don't forget to remove # if you need a field.
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Device bundles and indirectly connected devices

Many devices interact with Azure indirectly. Some communicate through another device, such as a gateway. Others connect through software as a service (SaaS) or platform as a service (PaaS) offerings.

The [submission portal](https://certify.azure.com/) and [device catalog](https://devicecatalog.azure.com) offer support for indirectly connected devices:

- By listing dependencies in the portal, you can specify that your device needs another device or service to connect to Azure.
- By adding components, you can indicate that your device is part of a bundle.

This functionality gives indirectly connected devices access to the Azure Certified Device program.

Depending on your product line and the services that you offer or use, your situation might require a combination of dependencies and bundling. The Azure Edge Certification Portal provides a way for you to list dependencies and additional components.

:::image type="content" source="./media/indirect-connected-device/picture-1.png" alt-text="Screenshot of the Azure Edge Certification Portal. On the Create a certify project page, the Dependencies tab is open.":::

## Sensors and indirect devices

Many sensors require a device to connect to Azure. In addition, you might have multiple compatible devices that work with the sensor. **To accommodate these scenarios, certify the devices before you certify the sensor that passes information through them.**

The following matrix provides some examples of submission combinations:

:::image type="content" source="./media/indirect-connected-device/picture-2.png" alt-text="Sensor and gateway icons and a table that lists submissions. The table ordering shows that gateways are submitted before sensors that depend on them.":::

To certify a sensor that requires a separate device:

1. Go to the [Azure Certified Device portal](https://certify.azure.com) to certify the device and publish it to the Azure Certified Device catalog. If you have multiple, compatible pass-through devices, as in the earlier example, submit them separately for certification and catalog publication.

1. With the sensor connected through the device, submit the sensor for certification. In the **Dependencies** tab of the **Device details** section, set the following values:

   - **Dependency type**: Select **Hardware gateway**.
   - **Dependency URL**: Enter the URL of the device in the device catalog.
   - **Used during testing**: Select **Yes**.
   - **Customer-facing comments**: Enter any comments that you'd like to provide to a user who sees the product description in the device catalog. For example, you might enter **Series 100 devices are required for sensors to connect to Azure**.

1. If you'd like to add more devices as optional for this device:

   1. Select **Add additional dependency**.
   1. Enter **Dependency type** and **Dependency URL** values.
   1. For **Used during testing**, select **No**.
   1. For **Customer-facing comments**, enter a comment that informs your customers that other devices are available as alternatives to the device that was used during testing.

:::image type="content" source="./media/indirect-connected-device/picture-3.png" alt-text="Screenshot of the Dependencies tab in the portal. The Dependency type, Dependency U R L, and Used during testing fields are called out.":::

## PaaS and SaaS offerings

As part of your product portfolio, you might certify a device that requires services from your company or third-party companies. To add this type of dependency:

1. Go to the [Azure Certified Device portal](https://certify.azure.com) and start the submission process for your device.

1. In the **Dependencies** tab, enter the following values:

   - **Dependency type**: Select **Software service**.
   - **Service name**: Enter the name of your product.
   - **Dependency URL**: Enter the URL of a product page that describes the service.
   - **Customer-facing comments**: Enter any comments that you'd like to provide to a user who sees the product description in the Azure Certified Device catalog.

1. If you have other software, services, or hardware dependencies that you'd like to add as optional for this device, select **Add additional dependency** and enter the required information.

:::image type="content" source="./media/indirect-connected-device/picture-4.png" alt-text="Screenshot of the Dependencies tab in the portal. The Dependency type, Service name, and Dependency U R L fields are called out.":::

## Bundled products

With bundled product listings, a device is successfully certified in the Azure Certified Device program with other components. The device and the components are then sold together under one product listing.

The following matrix provides some examples of bundled products. You can submit a device that includes extra components such as a temperature sensor and a camera sensor, as in submission example 1. You can also submit a touch sensor that includes a pass-through device, as in submission example 2. 

:::image type="content" source="./media/indirect-connected-device/picture-5.png" alt-text="Sensor and gateway icons and a table that lists submissions and their bundled components. Sensors and gateways are listed as devices and components.":::

Use the component feature to add multiple components to your listing. Format the product listing image to indicate that your product comes with other components. If your bundle requires additional services for certification, identify those services through service dependencies.

For a more detailed description of how to use the component functionality in the Azure Certified Device portal, see [Add components on the portal](./how-to-using-the-components-feature.md).

If a device is a pass-through device with a separate sensor in the same product, create one component to reflect the pass-through device, and another component to reflect the sensor. As the following screenshot shows, you can add components to your project in the **Product details** tab of the **Device details** section:

:::image type="content" source="./media/indirect-connected-device/picture-6.png" alt-text="Screenshot of the Device details page. The Product details tab is open, and the Add a component button is called out.":::

Configure the pass-through device first. For **Component type**, select **Customer Ready Product**. Enter the other values, as relevant for your product. The following screenshot provides an example:

:::image type="content" source="./media/indirect-connected-device/picture-7.png" alt-text="Screenshot that shows input fields. The General tab is open. For Component type, Customer Ready Product is selected.":::

For the sensor, add a second component. For **Component type**, select **Peripheral**. For **Attachment method**, select **Discrete**. The following screenshot provides an example:

:::image type="content" source="./media/indirect-connected-device/picture-8.png" alt-text="Screenshot that shows input fields. The General tab is open. For Component type, Peripheral is selected. For Attachment method, Discrete is selected.":::

After you've created the sensor component, enter its information. Then go to the **Sensors** tab and enter detailed sensor information, as the following screenshot shows.

:::image type="content" source="./media/indirect-connected-device/picture-9.png" alt-text="Screenshot that shows the Sensors tab. Values are visible in the Supported sensor type, Included with device, and Sensor details fields.":::

Complete the rest of your project's details, and then submit your device for certification as usual.
