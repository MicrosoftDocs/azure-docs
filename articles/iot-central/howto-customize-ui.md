---
title: Customize the Azure IoT Central UI | Microsoft Docs
description: How to customize the theme and help links for your Azure IoT central application
author: dominicbetts
ms.author: dobett
ms.date: 04/25/2019
ms.topic: conceptual
ms.service: iot-central
services: iot-central
manager: philmea

# As an administrator, I want to customize the themes and help links within Central so that my company’s brand is represented within the app. 

---

# Customize the Azure IoT Central UI 

*This article applies to administrators.*

IoT Central lets you customize the UI of your application by applying custom themes and modifying the help links to point to your own custom help resources. The following screenshot shows a page using the standard theme:

![Standard IoT Central theme](./media/howto-customize-ui/standard-ui.png)

The following screenshot shows a page using a custom screenshot with the customized UI elements highlighted:

![Custom IoT Central theme](./media/howto-customize-ui/themed-ui.png)

## Create theme

To create a custom theme, navigate to the **Customize your application** page in the **Administration** section:

![IoT Central themes](./media/howto-customize-ui/themes.png)

On this page, you can customize the following aspects of your application:

### Application logo

A PNG image, no larger than 1 MB, with a transparent background. This logo displays to the left on the IoT Central application title bar.

If your logo image includes the name of your application, you can hide the application name text. For more information, see [Manage application settings](./howto-administer.md#manage-application-settings).

### Browser icon (favicon)

A PNG image, no larger than 32 x 32 pixels, with a transparent background. A web browser can use this image in the address bar, history, bookmarks, and browser tab.

### Browser colors

You can change the color of the page header and the color used for accenting buttons and other highlights. Use a six character hex color value in the format `##ff6347`. For more information about **HEX Value** color notation, see [HTML Colors](https://www.w3schools.com/html/html_colors.asp).

> [!NOTE]
> You can always revert back to the default options on the **Customize your application** page.

### Changes for operators

If an administrator creates a custom theme, then operators and other users of your application can no longer choose a theme in **Settings**.

## Replace help links

To provide custom help information to your operators and other users, you can modify the links on the application **Help** menu.

To modify the help links, navigate to the **Customize help** page in the **Administration** section:

![Customize IoT Central help links](./media/howto-customize-ui/help-links.png)

You can also add new entries to the help menu and remove default entries:

![Customized IoT Central help](./media/howto-customize-ui/custom-help.png)

> [!NOTE]
> You can always revert back to the default help links on the **Customize help** page.

## Next steps

Now that you've learned how to customize the UI in your IoT Central application, here are some suggested next steps:

- [Administer your application](./howto-administer.md)
- [Configure the application dashboard](./howto-configure-homepage.md)