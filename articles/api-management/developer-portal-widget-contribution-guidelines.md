---
title: How to contribute widgets for developer portal
titleSuffix: Azure API Management
description: Learn about recommended guidelines to follow when you contribute a widget to the API Management developer portal repository.
author: dlepow
ms.author: apimpm
ms.date: 03/25/2021
ms.service: api-management
ms.topic: how-to
---

# How to contribute widgets to the API Management developer portal

If you'd like to contribute a widget to the API Management developer portal [GitHub repository](https://github.com/Azure/api-management-developer-portal), follow this three-step process:

1. Fork the repository.

1. Implement the widget.

1. Open a pull request to include your widget in the official repository.

Your widget will inherit the repository's license. It will be available for [opt-in installation](developer-portal-use-community-widgets.md) in the self-hosted version of the portal. The developer portal team may decide to also include it in the managed version of the portal.

Refer to the [widget implementation](developer-portal-implement-widgets.md) tutorial for an example of how to develop your own widget.

## Contribution guidelines

This guidance is intended to ensure the safety and privacy of our customers and the visitors to their portals. Follow these guidelines to ensure your contribution is accepted:

1. Place your widget in the `community/widgets/<your-widget-name>` folder.

1. Your widget's name must be lowercase and alphanumeric with dashes separating the words. For example, `my-new-widget`.

1. The folder must contain a screenshot of your widget in a published portal.

1. The folder must contain a `readme.md` file, which follows the template from the `/scaffolds/widget/readme.md` file.

1. The folder can contain an `npm_dependencies` file with npm commands to install or manage the widget's dependencies.

    Explicitly specify the version of every dependency. For example:  

    ```console
    npm install azure-storage@2.10.3 axios@0.19.1
    ```

    Your widget should require minimal dependencies. Every dependency will be carefully inspected by the reviewers. In particular, the core logic of your widget should be open-sourced in your widget's folder. Don't wrap it in an npm package.

1. Changes to any files outside your widget's folder aren't allowed as part of a widget contribution. That includes, but isn't limited to, the `/package.json` file.

1. Injecting tracking scripts or sending customer-authored data to custom services isn't allowed.

    > [!NOTE]
    > You can only collect customer-authored data through the `Logger` interface.

## Next steps

- For more information about contributions, see the API Management developer portal [GitHub repository](https://github.com/Azure/api-management-developer-portal/).

- See [Implement widgets](developer-portal-implement-widgets.md) to learn how to develop your own widget, step by step.

- See [Use community widgets](developer-portal-use-community-widgets.md) to learn how to use widgets contributed by the community.