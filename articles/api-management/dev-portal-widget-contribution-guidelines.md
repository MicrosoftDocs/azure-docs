---
title: Widget contribution guidelines
titleSuffix: Azure API Management
description: Learn about the guidelines you have to follow when you contribute a widget to the API Management developer portal repository.
author: erikadoyle
ms.author: apimpm
ms.date: 02/04/2021
ms.service: api-management
ms.topic: how-to
---

# Widget contribution guidelines

If you'd like to contribute a widget to the API Management developer portal repository, you need to follow a three-step process:

1. Fork the repository.
1. Implement the widget.
1. Open a pull request to include your widget in the official repository.

Your widget will inherit the repository's license. It will be available for [opt-in installation in the self-hosted version of the portal](dev-portal-use-community-widgets.md). The developer portal team may decide to also include it in the managed version of the portal.

Refer to [the widget implementation tutorial](dev-portal-implement-widgets.md) for an example of how to develop your own widget.

## Guidelines

The developer portal team put together this guidance. Its intent is to ensure the safety and privacy of our customers and the visitors to their portals. If your contribution doesn't follow these guidelines, it will be rejected:

1. Place your widget in the `community/widgets/<your-widget-name>` folder.
1. Your widget's name should be lowercase and alphanumeric with dashes separating the words. For example, `my-new-widget`.
1. The folder must contain a screenshot of your widget in a published portal.
1. The folder must contain a `readme.md` file, which follows the template from the `/scaffolds/widget/readme.md` file.
1. The folder can contain an `npm_dependencies` file with npm commands to install or manage widget's dependencies. You need to explicitly specify the version of every dependency. For example:  
`npm install azure-storage@2.10.3 axios@0.19.1`  
Your widget should require minimal dependencies. Every dependency will be carefully inspected by the reviewers. In particular, the core logic of your widget should be open-sourced in your widget's folder - not wrapped in an npm package.
1. Changes to any files outside of your widget's folder aren't allowed as part of a widget contribution, including but not limited to the `/package.json` file.
1. Injecting tracking scripts or sending customer-authored data to custom services isn't allowed. Customer-authored data can be collected only through the `Logger` interface.

Should you have any questions or comments, you can contact us at apimportalfeedback@microsoft.com.

We welcome your contributions!

## Next steps

[Implement widgets](dev-portal-implement-widgets.md) - learn how to develop your own widget, step by step.

[Use community widgets](dev-portal-use-community-widgets.md) - learn how to use widgets contributed by the community.