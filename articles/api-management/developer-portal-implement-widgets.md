---
title: Implement widgets in the developer portal
titleSuffix: Azure API Management
description: Learn how to implement widgets that consume data from external APIs and display it on the API Management developer portal.
author: dlepow
ms.author: apimpm
ms.date: 04/15/2021
ms.service: api-management
ms.topic: how-to
---

# Implement widgets in the developer portal

In this tutorial, you implement a widget that consumes data from an external API and displays it on the API Management developer portal.

The widget will retrieve session descriptions from the sample [Conference API](https://conferenceapi.azurewebsites.net/?format=json). The session identifier will be set through a designated widget editor.

To help you in the development process, refer to the completed widget located in the `examples` folder of the API Management developer portal [GitHub repository](https://github.com/Azure/api-management-developer-portal/): `/examples/widgets/conference-session`.

:::image type="content" source="media/developer-portal-implement-widgets/widget-published.png" alt-text="Screenshot of published widget":::

## Prerequisites

* Set up a [local environment](developer-portal-self-host.md#step-1-set-up-local-environment) for the latest release of the developer portal.

* You should understand the [Paperbits widget anatomy](https://paperbits.io/wiki/widget-anatomy).


## Copy the scaffold

Use a `widget` scaffold from the `/scaffolds` folder as a starting point to build the new widget.

1. Copy the folder `/scaffolds/widget` to `/community/widgets`.
1. Rename the folder to `conference-session`.

## Rename exported module classes

Rename the exported module classes by replacing the `Widget` prefix with `ConferenceSession` in these files:

- `widget.design.module.ts`

- `widget.publish.module.ts`

- `widget.runtime.module.ts`
    
For example, in the `widget.design.module.ts` file, change `WidgetDesignModule` to `ConferenceSessionDesignModule`:
    
```typescript
export class WidgetDesignModule implements IInjectorModule {
```
to 
    
```typescript
export class ConferenceSessionDesignModule implements IInjectorModule {
```
    
   
## Register the widget

Register the widget's modules in the portal's root modules by adding the following lines in the respective files:

1. `src/apim.design.module.ts` - a module that registers design-time dependencies.

   ```typescript
   import { ConferenceSessionDesignModule } from "../community/widgets/conference-session/widget.design.module";
   
   ...
   injector.bindModule(new ConferenceSessionDesignModule());
   ```
1. `src/apim.publish.module.ts` - a module that registers publish-time dependencies.

   ```typescript
   import { ConferenceSessionPublishModule } from "../community/widgets/conference-session/widget.publish.module";

    ...

    injector.bindModule(new ConferenceSessionPublishModule());
    ```

1. `src/apim.runtime.module.ts` - runtime dependencies.

    ```typescript
    import { ConferenceSessionRuntimeModule } from "../community/widgets/conference-session/widget.runtime.module";

    ...

    injector.bindModule(new ConferenceSessionRuntimeModule());
    ```

## Place the widget in the portal

Now you're ready to plug in the duplicated scaffold and use it in developer portal.

1. Run the `npm start` command.

1. When the application loads, place the new widget on a page. You can find it under the name `Your widget` in the `Community` category in the widget selector.

    :::image type="content" source="media/developer-portal-implement-widgets/widget-selector.png" alt-text="Screenshot of widget selector":::

1. Save the page by pressing **Ctrl**+**S** (or **⌘**+**S** on macOS).

    > [!NOTE]
    > In design-time, you can still interact with the website by holding the **Ctrl** (or **⌘**) key.

## Add custom properties

For the widget to fetch session descriptions, it needs to be aware of the session identifier. Add the `Session ID` property to the respective interfaces and classes:

In order for the widget to fetch the session description, it needs to be aware of the session identifier. Add the session ID property to the respective interfaces and classes:

1. `widgetContract.ts` - data contract (data layer) defining how the widget configuration is persisted.

    ```typescript
    export interface WidgetContract extends Contract {
        sessionNumber: string;
    }
    ```

1. `widgetModel.ts` - model (business layer) - a primary representation of the widget in the system. It's updated by editors and rendered by the presentation layer.

    ```typescript
    export class WidgetModel {
        public sessionNumber: string;
    }
    ```

1. `ko/widgetViewModel.ts` - viewmodel (presentation layer) - a UI framework-specific object that developer portal renders with the HTML template.

    > [!NOTE]
    > You don't need to change anything in this file.

## Configure binders

Enable the flow of the `sessionNumber` from the data source to the widget presentation. Edit the `ModelBinder` and `ViewModelBinder` entities:

1. `widgetModelBinder.ts` helps to prepare the model using data described in the contract.

    ```typescript
    export class WidgetModelBinder implements IModelBinder<WidgetModel> {
        public async contractToModel(contract: WidgetContract): Promise<WidgetModel> {
            model.sessionNumber = contract.sessionNumber || "107"; // 107 is the default session id
            ...
        }
    
        public modelToContract(model: WidgetModel): Contract {
            const contract: WidgetContract = {
                sessionNumber: model.sessionNumber
                ...
            };
            ...
        }
    }
    ```

1. `ko/widgetViewModelBinder.ts` knows how developer portal needs to present the model (as a viewmodel) in a specific UI framework.

    ```typescript
    ...
    public async updateViewModel(model: WidgetModel, viewModel: WidgetViewModel): Promise<void> {
            viewModel.runtimeConfig(JSON.stringify({
                sessionNumber: model.sessionNumber
            }));
        }
    }
    ...
    ```

## Adjust design-time widget template

The components of each scope run independently. They have separate dependency injection containers, their own configuration, lifecycle, etc. They may even be powered by different UI frameworks (in this example it is Knockout JS).

From the design-time perspective, any runtime component is just an HTML tag with certain attributes and/or content. Configuration if necessary is passed with plain markup. In simple cases, like in this example, the parameter is passed in the attribute. If the configuration is more complex, you could use an identifier of the required setting(s) fetched by a designated configuration provider (for example, `ISettingsProvider`).

1. Update the `ko/widgetView.html` file:

    ```html
    <widget-runtime data-bind="attr: { params: runtimeConfig }"></widget-runtime>
    ```

    When developer portal runs the `attr` binding in *design-time* or *publish-time*, the resulting HTML is:

    ```html
    <widget-runtime params="{ sessionNumber: 107 }"></widget-runtime>
    ```

    Then, in runtime, `widget-runtime` component will read `sessionNumber` and use it in the initialization code (see below).

1. Update the `widgetHandlers.ts` file to assign the session ID on creation:

    ```typescript
    ...
    createModel: async () => {
        var model = new ConferenceSessionModel();
        model.sessionNumber = "107";
            return model;
        }
    ...
    ```

## Revise runtime view model

Runtime components are the code running in the website itself. For example, in the API Management developer portal, they are all the scripts behind dynamic components (for example, *API details*, *API console*), handling operations such as code sample generation, sending requests, etc.

Your runtime component's view model needs to have the following methods and properties:

- The `sessionNumber` property (marked with `Param` decorator) used as a component input parameter passed from outside (the markup generated in design-time; see the previous step).
- The `sessionDescription` property bound to the widget template (see `widget-runtime.html` later in this article).
- The `initialize` method (with `OnMounted` decorator) invoked after the widget is created and all its parameters are assigned. It's a good place to read the `sessionNumber` and invoke the API using the `HttpClient`. The `HttpClient` is a dependency injected by the IoC (Inversion of Control) container.

- First, developer portal creates the widget and assigns all its parameters. Then it invokes the `initialize` method.

    ```typescript
    ...
    import * as ko from "knockout";
    import { Component, RuntimeComponent, OnMounted, OnDestroyed, Param } from "@paperbits/common/ko/decorators";
    import { HttpClient, HttpRequest } from "@paperbits/common/http";
    ...

    export class WidgetRuntime {
        public readonly sessionDescription: ko.Observable<string>;

        constructor(private readonly httpClient: HttpClient) {
            ...
            this.sessionNumber = ko.observable();
            this.sessionDescription = ko.observable();
            ...
        }

        @Param()
        public readonly sessionNumber: ko.Observable<string>;

        @OnMounted()
        public async initialize(): Promise<void> {
            ...
            const sessionNumber = this.sessionNumber();

            const request: HttpRequest = {
                url: `https://conferenceapi.azurewebsites.net/session/${sessionNumber}`,
                method: "GET"
            };

            const response = await this.httpClient.send<string>(request);
            const sessionDescription = response.toText();
    
            this.sessionDescription(sessionDescription);
            ...
        }
        ...
    }
    ```

## Tweak the widget template

Update your widget to display the session description.

Use a paragraph tag and a `markdown` (or `text`) binding in the `ko/runtime/widget-runtime.html` file to render the description:

```html
<p data-bind="markdown: sessionDescription"></p>
```

## Add the widget editor

The widget is now configured to fetch the description of the session `107`. You specified `107` in the code as the default session. To check that you did everything right, run `npm start` and confirm that developer portal shows the description on the page.

Now, carry out these steps to allow the user to set up the session ID through a widget editor:

1. Update the `ko/widgetEditorViewModel.ts` file:

    ```typescript
    export class WidgetEditor implements WidgetEditor<WidgetModel> {
        public readonly sessionNumber: ko.Observable<string>;

        constructor() {
            this.sessionNumber = ko.observable();
        }

        @Param()
        public model: WidgetModel;

        @Event()
        public onChange: (model: WidgetModel) => void;

        @OnMounted()
        public async initialize(): Promise<void> {
            this.sessionNumber(this.model.sessionNumber);
            this.sessionNumber.subscribe(this.applyChanges);
        }

        private applyChanges(): void {
            this.model.sessionNumber = this.sessionNumber();
            this.onChange(this.model);
        }
    }
    ```

    The editor view model uses the same approach that you've seen previously, but there is a new property `onChange`, decorated with `@Event()`. It wires the callback to notify the listeners (in this case - a content editor) of changes to the model.

1. Update the `ko/widgetEditorView.html` file:

    ```html
    <input type="text" class="form-control" data-bind="textInput: sessionNumber" />
    ```

1. Run `npm start` again. You should be able to change `sessionNumber` in the widget editor. Change the ID to `108`, save the changes, and refresh the browser's tab. If you're experiencing problems, you may need to add the widget onto the page again.

    :::image type="content" source="media/developer-portal-implement-widgets/widget-editor.png" alt-text="Screenshot of widget editor":::

## Rename the widget

Change the widget name in the `constants.ts` file:

```typescript
...
export const widgetName = "conference-session";
export const widgetDisplayName = "Conference session";
...
```

> [!NOTE]
> If you're contributing the widget to the repository, the `widgetName` needs to be the same as its folder name and needs to be derived from the display name (lowercase and spaces replaced with dashes). The category should remain `Community`.

## Next steps


Learn more about the developer portal:

- [Azure API Management developer portal overview](api-management-howto-developer-portal.md)

- [Contribute widgets](developer-portal-widget-contribution-guidelines.md) - we welcome and encourage community contributions.

- See [Use community widgets](developer-portal-use-community-widgets.md) to learn how to use widgets contributed by the community.
