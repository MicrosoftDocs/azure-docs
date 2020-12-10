---
title: Use community widgets
titleSuffix: Azure API Management
description: Learn about community widgets and how to inject and use them in your code. 
author: erikadoyle
ms.author: apimpm
ms.date: 11/30/2020
ms.service: api-management
ms.topic: how-to
---

# Use community widgets

All accepted community-contributed widgets are located in the `/community/widgets/` folder of the repository. You can use the widgets by injecting them into the self-hosted version of the portal. You can't load community widgets in the managed version of the portal. 

*Although we thoroughly inspect all the contributed widgets and their dependencies, we can’t guarantee it’s safe to load them. Use your own judgement whether to use a widget contributed by the community.
Refer to [our widget contribution guidelines](dev-portal-widget-contribution-guidelines.md#guidelines) to learn about our preventive measures.*

## Inject and use external widgets

1. Navigate to the widget's folder in the `/community/widgets` directory. Read the widget's description in the `readme.md` file.
1. Register the widget in portal's modules:

    1. `src/apim.design.module.ts` - a module that registers design-time dependencies.
    
        ```ts
        import { WidgetNameDesignModule } from "../community/widgets/<widget-name>/widget.design.module";
    
        ...
    
            injector.bindModule(new WidgetNameDesignModule());
        ```
    
    1. `src/apim.publish.module.ts` - publish-time dependencies.
    
        ```ts
        import { WidgetNamePublishModule } from "../community/widgets/<widget-name>/widget.publish.module";
    
        ...
    
            injector.bindModule(new WidgetNamePublishModule());
        ```
    
    1. `src/apim.runtime.module.ts` - run-time dependencies.
    
        ```ts
        import { WidgetNameRuntimeModule } from "../community/widgets/<widget-name>/widget.runtime.module";
    
        ...
    
            injector.bindModule(new WidgetNameRuntimeModule());
        ```

1. Copy the commands from the widget's `npm_dependencies` file (if present) and run them in the repository's top directory to install widget's dependencies.

1. Run `npm start`. You should be able to see the widget in the *Community* category in the widget selector.

    ![Widget selector](media/dev-portal/widget-selector.png)

## Next steps

- [Testing self-hosted portal](dev-portal-testing.md)