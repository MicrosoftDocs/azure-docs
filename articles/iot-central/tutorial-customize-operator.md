---
title: Customize the operator's views in Azure IoT Central | Microsoft Docs
description: As a builder, customize the operator's views in your Azure IoT Central application.
author: sandeeppujar
ms.author: sandeepu
ms.date: 04/16/2018
ms.topic: tutorial
ms.service: iot-central
services: iot-central
ms.custom: mvc
---

# Tutorial: Customize the Azure IoT Central operator's view

This tutorial shows you, as a builder, how to customize the operator's view of your application. When you make a change to the application as a builder, you can preview the operator's view in the Microsoft Azure IoT Central application.

In this tutorial, you customize the application to display relevant information about the connected air conditioner device to an operator. Your customizations enable the operator to manage the air conditioner devices connected to the application.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure your device dashboard
> * Configure your device settings layout
> * Configure your device properties layout
> * Preview the device as an operator
> * Configure your default home page
> * Preview the default home page as an operator

## Prerequisites

Before you begin, you should complete the two previous tutorials:

* [Define a new device type in your Azure IoT Central application](tutorial-define-device-type.md).
* [Configure rules and actions for your device](tutorial-configure-rules.md).

## Configure your device dashboard

As a builder, you can define what information displays on a device dashboard. In the [Define a new device type in your application](tutorial-define-device-type.md) tutorial, you added a line-chart and other information to the **Connected Air Conditioner-1** dashboard.

1. To edit the **Connected Air Conditioner** device template, choose **Explorer** on the left navigation menu:

    ![Explorer page](media/tutorial-customize-operator/explorer.png)

2. To start customizing your connected air conditioner device dashboard, select the **Connected Air Conditioner (1.0.0)** device template. Choose the **Connected Air Conditioner-1** device you created in the [Define a new device type in your application](tutorial-define-device-type.md) tutorial:

    ![Select the connected air conditioner device](media/tutorial-customize-operator/selectdevice.png)

    When inside a device, such as **Connected Air Conditioner-1**, you can select **Edit Template** to make a change to the underlying template. For more information, see [Create a new device template version](howto-version-devicetemplate.md).

3. To edit the dashboard, choose **Dashboard**, and select **Edit      Template**:

    ![Device template dashboard page](media/tutorial-customize-operator/dashboard.png)

4. To add a Key Performance Indicator (KPI) tile to the dashboard, choose **KPI**:

    ![Add KPI](media/tutorial-customize-operator/addkpi.png)

    To define the KPI, use the information in the following table:

    | Setting     | Value |
    | ----------- | ----- |
    | Name        | Maximum temperature |
    | Measurement | temperature |
    | Aggregation | Maximum |
    | Time range  | Past 1 week |

5. Choose **Save**. You can now see the KPI tile on the dashboard:

    ![KPI tile](media/tutorial-customize-operator/temperaturekpi.png)

6. To move or resize a tile on the dashboard, move the mouse pointer over the tile. You can drag the tile to a new location or resize it:

    ![Edit dashboard layout](media/tutorial-customize-operator/dashboardlayout.png)

7. Click **Done** when you are finished making changes.

## Configure your settings layout

As a builder, you can also configure the operator's view of the device settings. An operator uses the device settings page to configure a device. For example, an operator uses the settings page to set the target temperature for the connected air conditioner.

1. To edit the settings layout for your connected air conditioner, choose **Settings**, and select **Edit Template**:

    ![Settings page](media/tutorial-customize-operator/settings.png)

2. You can move and resize the settings tiles:

    ![Edit the settings layout](media/tutorial-customize-operator/settingslayout.png)

3. Click **Done** when you are finished making changes.

> [!NOTE]
> In **Edit Template** mode, you can't edit the values of the settings.

## Configure your properties layout

In addition to the dashboard and settings, you can also configure the operator's view of the device properties. An operator uses the device properties page to manage device metadata. For example, an operator uses the properties page to view a device serial number or update contact details for the manufacturer.

1. To edit the properties layout for your connected air conditioner, choose **Properties**, and select **Edit Template**:

    ![Properties page](media/tutorial-customize-operator/properties.png)

2. You can move and resize the properties fields:

    ![Edit the properties layout](media/tutorial-customize-operator/propertieslayout.png)

3. Click **Done** when you are finished making changes.

> [!NOTE]
> In **Edit Template** mode, you can't edit the values of the properties.

## Preview the connected air conditioner device as an operator

In **Edit Template** mode, you can customize the dashboard, settings, and properties pages for an operator. If you are not in **Edit Template** mode, you can view the application as an operator.

1. To view your connected air conditioner device as an operator, click **Done** to stop editing the template and return to the operator's view of the device.

2. To update the Location of this device, edit the value  in the Location tile and choose **Save**:

    ![Edit a property value](media/tutorial-customize-operator/editproperty.png)

3. To send a setting to your connected air conditioner, choose **Settings**, change a setting value in a tile, and choose **Update**:

    ![Send setting to device](media/tutorial-customize-operator/sendsetting.png)

    When the device acknowledges the new setting value, the setting shows as **synced** on the tile.

4. As an operator, you can view the device dashboard as configured by the builder:

    ![Operator's view of the device dashboard](media/tutorial-customize-operator/operatordashboard.png)

## Configure the default home page

When a builder or operator signs in to an Azure IoT Central application, they see a home page. As a builder, you can configure the content of this home page to include the most useful and relevant content for an operator.

1. To customize the default home page, navigate to the **Home** page and select **Edit**, on the top right of the page. Upon selecting **Edit**, a panel will slide out from the right with a list of objects you can add to your Homepage.

    ![Application Builder page](media/tutorial-customize-operator/builderhome.png)

2. To customize the home page, add tiles from the **Library**. Choose **Link**, and add details of your organization's web site. Then choose **Save**:

    ![Add link to home page](media/tutorial-customize-operator/addlink.png)

    > [!NOTE]
    > You can also add links to pages within your Azure IoT Central application. For example, you could add a link to a device dashboard or settings page.

3. Optionally, choose **Image** and upload an image to display on your home page. An image can have a URL to which you navigate when you click on it:

    ![Add image to home page](media/tutorial-customize-operator/addimage.png)

    To learn more, see [How to prepare and upload images to your Azure IoT Central application](howto-prepare-images.md).

## Preview the default home page as an operator

To preview the home page as an operator and no longer edit, select **Done** on the top right of the page

![Toggle Design Mode](media/tutorial-customize-operator/operatorviewhome.png)

You can click on the link and image tiles to navigate to the URLs you set as a builder.

## Next steps

In this tutorial, you learned how to customize the operator's view of the application.

<!-- Repeat task list from intro -->
> [!div class="nextstepaction"]
> * Configure your device dashboard
> * Configure your device settings layout
> * Configure your device properties layout
> * Preview the device as an operator
> * Configure your default home page
> * Preview the default home page as an operator

Now that you have learned how to customize the operator's view of the application, the suggested next steps are:

* [Monitor your devices (as an operator)](tutorial-monitor-devices.md)
* [Add a new device to your application (as an operator and device developer)](tutorial-add-device.md)
