---
title: Theming
description: Learn about theming the Azure CycleCloud user interface. Understand how to create a theme, enable a theme, and modify the brand.
author: dpwatrous
ms.date: 02/21/2020
ms.author: dawatrou
---

# Theming the CycleCloud User Interface

CycleCloud's theme may be customized to better match your organization's look and feel. In order to create a theme, some knowledge of [Cascading Style Sheets (CSS)](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/How_CSS_works) is required.

## Creating a Theme

To create your own theme, browse to the _config/web_ directory of your
installation and edit the file _theme.css_. This file contains [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables)
which may be modified to customize colors, images, and other CSS properties.

While it is possible to override other CSS rules using this file, it is not
recommended. Only the variables listed in _theme.css_ will be supported across
different versions.

The directory _config/web_ may also be used to serve content such as images, which
may be referenced in your CSS. All files placed in this directory will be served
under the URL _static/config/web_.

For example, to change the logo to a custom image _my-logo-icon.png_, first
copy the image into _config/web_, then add the following to _theme.css_:

```css
:root {
    --theme-header-logo-url: url("static/config/web/my-logo-icon.png");
}
```

## Enabling a Theme

By default, theming is disabled. To enable your theme, log in to the user
interface as a super user and navigate to the **Settings** page. Open the
**Theme** settings and toggle the **Custom Theme** checkbox to enable or
disable your theme. Refresh your web browser to view the changes.

You may also enable/disable theming from the command line. Run the following
commands in your installation directory.

To enable a theme:

```bash
./cycle_server theme enable
```

To disable a theme:

```bash
./cycle_server theme disable
```

## Modifying the Brand

To change the brand (Azure CycleCloud) that appears in the header, log in to
the user interface as a super user and navigate to the **Settings** page. Open
the **Theme** settings and modify the brand text. Note that you must refresh your
web browser to view the new brand.
