---
title: Use community widgets in developer portal
titleSuffix: Azure API Management
description: Learn about community widgets for the API Management developer portal and how to inject and use them in your code. 
author: dlepow
ms.author: apimpm
ms.date: 03/25/2021
ms.service: api-management
ms.topic: how-to
---

# Use community widgets in the developer portal

All developers place their community-contributed widgets in the `/community/widgets/` folder of the API Management developer portal [GitHub repository](https://github.com/Azure/api-management-developer-portal). Each has been accepted by the developer portal team. You can use the widgets by injecting them into your [self-hosted version](developer-portal-self-host.md) of the portal. The managed version of the developer portal doesn't currently support community widgets.

> [!NOTE]
> The developer portal team thoroughly inspects contributed widgets and their dependencies. However, the team can’t guarantee it’s safe to load the widgets. Use your own judgment when deciding to use a widget contributed by the community. Refer to our [widget contribution guidelines](developer-portal-widget-contribution-guidelines.md#contribution-guidelines) to learn about our preventive measures.

## Inject and use external widgets

1. Set up a [local environment](developer-portal-self-host.md#step-1-set-up-local-environment) for the latest release of the developer portal.

1. Go to the widget's folder in the `/community/widgets` directory. Read the widget's description in the `readme.md` file.

1. Register the widget in the portal's modules:

    1. `src/apim.design.module.ts` - a module that registers design-time dependencies.
    
        ```typescript
        import { WidgetNameDesignModule } from "../community/widgets/<widget-name>/widget.design.module";
    
        ...
    
            injector.bindModule(new WidgetNameDesignModule());
        ```
    
    1. `src/apim.publish.module.ts` - a module that registers publish-time dependencies.
    
        ```typescript
        import { WidgetNamePublishModule } from "../community/widgets/<widget-name>/widget.publish.module";
    
        ...
    
            injector.bindModule(new WidgetNamePublishModule());
        ```
    
    1. `src/apim.runtime.module.ts` - a module that registers run-time dependencies.
    
        ```typescript
        import { WidgetNameRuntimeModule } from "../community/widgets/<widget-name>/widget.runtime.module";
    
        ...
    
            injector.bindModule(new WidgetNameRuntimeModule());
        ```

1. Check if the widget has an `npm_dependencies` file.

1. If so, copy the commands from the file and run them in the repository's top directory.

    Doing so will install the widget's dependencies.

1. Run `npm start`.

You can see the widget in the **Community** category in the widget selector.

:::image type="content" source="media/developer-portal-use-community-widgets/widget-selector.png" alt-text="Screenshot of widget selector":::


## Next steps


Learn more about the developer portal:

- [Azure API Management developer portal overview](api-management-howto-developer-portal.md)

- [Contribute widgets](developer-portal-widget-contribution-guidelines.md)
