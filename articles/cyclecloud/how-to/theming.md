---
title: Theming
description: Learn about theming the Azure CycleCloud user interface. Understand how to create a theme, enable a theme, and modify the brand.
author: dpwatrous
ms.date: 07/01/2025
ms.author: dawatrou
---

# Theming the CycleCloud user interface

You can customize the CycleCloud theme to better match your organization's look and feel. To create a theme, you need some knowledge of [Cascading Style Sheets (CSS)](https://developer.mozilla.org/docs/Learn/CSS/Introduction_to_CSS/How_CSS_works).

## Creating a theme

To create your own theme, go to the _config/web_ directory of your installation and edit the _theme.css_ file. This file contains [CSS variables](https://developer.mozilla.org/docs/Web/CSS/Using_CSS_variables)
that you can change to customize colors, images, and other CSS properties.

Although you can use this file to override other CSS rules, we don't recommend it. Only the variables listed in _theme.css_ are supported across different versions.

You can also use the _config/web_ directory to serve content like images, which you can reference in your CSS. All files you put in this directory are served under the URL _static/config/web_.

For example, to change the logo to a custom image named _my-logo-icon.png_, first copy the image into _config/web_, and then add the following to _theme.css_:

```css
:root {
    --theme-header-logo-url: url("static/config/web/my-logo-icon.png");
}
```

## Enabling a theme

By default, theming is disabled. To enable your theme, sign in to the user
interface as a super user and go to the **Settings** page. Open the
**Theme** settings and toggle the **Custom Theme** checkbox to enable or
disable your theme. Refresh your web browser to view the changes.

You can also enable or disable theming from the command line. Run the following
commands in your installation directory.

To enable a theme:

```bash
./cycle_server theme enable
```

To disable a theme:

```bash
./cycle_server theme disable
```

## Modifying the brand

To change the brand (Azure CycleCloud) that appears in the header, sign in to
the user interface as a super user and go to the **Settings** page. Open
the **Theme** settings and modify the brand text. You must refresh your
web browser to view the new brand.
