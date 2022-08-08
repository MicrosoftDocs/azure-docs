---
title: Add custom functionality to the Azure API Management developer portal
titleSuffix: Azure API Management
description: How to customize the API Management developer portal with custom functionality such as custom widgets.
author: dlepow
ms.author: danlep
ms.date: 08/08/2022
ms.service: api-management
ms.topic: how-to
---

# Extend the developer portal with custom features

This article explains three ways to add functionality such as custom widgets to your API Management [developer portal](api-management-howto-developer-portal.md). For example, you might want to integrate your developer portal with a custom support system and need to add a custom control.

The following table summarizes three options, with links to more detail.


|Method   |Description  |
|---------|---------|
|[Custom HTML code widget](#use-custom-html-code-widget)     | - Easy way for API publishers to add custom logic for basic use cases<br/><br/>- Copy and paste widget HTML code into a form and developer portal renders in an iframe<br/><br/>- No code management features in portal        |
|[Create and upload custom widget](#create-and-upload-custom-widgets)     | - Developer solution for more advanced widget use cases<br/><br/>- Requires local implementation in React, Vue, or plain TypeScript<br/><br/>- Widget scaffold provided to help developers create widget and upload to developer portal<br/><br/>- Supports workflows for source control, versioning, and code reuse<br/><br/>        |
|[Self-host developer portal]()     | - Legacy extensibility option to customize source code of the entire portal core<br/><br/> - Gives complete flexibility for customizing portal experience<br/><br/>- Customer responsible for managing complete code lifecycle: fork code base, develop, deploy, host, patch, and upgrade       |


## Use Custom HTML code widget

The managed developer portal includes a **Custom HTML code** widget that enables you to insert HTML code for small portal customizations. For example, use custom HTML to embed a video or to add a form. The portal renders the custom widget in an inline frame (iframe). 
  
1. In the administrative interface for the developer portal, go to the page or section where you want to insert the widget. 
1. Select the grey "plus" (**+**) icon that appears when you hover the pointer over the page.
1. In the **Add widget** window, select **Custom HTML code**.
    
    :::image type="content" source="media/developer-portal-extend-custom-functionality/add-custom-html-code-widget.png" alt-text="Screenshot that shows how to add a widget for custom HTML code in the developer portal.":::
1. Select the "pencil" icon to customize the widget.
1. Enter a **Width** and **Height** (in pixels) for the widget.
1. To inherit styles from the developer portal (recommended), select **Apply developer portal styling**.
    > [!NOTE]
    > If this setting isn't selected, the embedded elements will be plain HTML controls, without the styles of the developer portal.
   
    :::image type="content" source="media/developer-portal-extend-custom-functionality/configure-html-custom-code.png" alt-text="Screenshot that shows how to configure HTML custom code in the developer portal.":::
1. Replace the sample **HTML code** with your custom content.
1. When configuration is complete, close the window.
1. Save your changes, and [republish the portal](api-management-howto-developer-portal-customize.md#publish).

> [!NOTE]
> Microsoft does not support the HTML code you add in the Custom HTML Code widget.

## Create and upload custom widget

### Prerequisites 
 
* Active [eveloper portal](api-management-howto-developer-portal.md) 
* Install [Node.JS runtime](https://nodejs.org/en/) locally 
* Basic knowledge of programming and web development

### Create widget

1. In the administrative interface for the developer portal, select **Custom widgets**.
1. Select **Create new custom widget**. 
1. Enter a widget name and choose a **Technology**. For more information, see [Widget templates](#widget-templates), later in this article.
1. Select **Create widget** 
1. Open a terminal, navigate to the location where you want to save the widget, and execute the following command to download the code scaffold:

    ```
    npx @azure...
    ```   
1. Navigate to the newly created folder containing the widget's code scaffold. 

    ```
    cd <name-of-widget>
    ``` 

1. Open the folder in the code editor of choice, such as VS Code. 

1. Install the dependencies and start the project: 

    ```
    npm install 
    npm start
    ```

    Your browser should open a new tab with your developer portal connected to your widget in development mode.  

    > [!NOTE]
    > If the tab doesn't open, go to your API Management service in the Azure portal and open developer portal in editor mode (as a user). Add `/?MS_APIM_CW_localhost_port=3000` to the URL, amd make sure the development server started. To do that, check output on the console where you started the server in the previous step. It should dispaly the port the server is running on (for example, `http://127.0.0.1:3001`). 
    > 

1. Implement the code of the widget and test it locally. The code of the widget is located in the `src` folder. The widget code is in the following subfolders: 

    * **`app`** - Code for the widget part that visitors of published developer portal see and interact with 
    * **`editor`** - Code for the widget part that you use in the administrative interface of the developer portal to edit widget settings 

    The `values.ts` file contains the default values and types of the widget's custom properties (*screenshot of custom properties in the admin panel*). Custom properties let you adjust values in the custom widget's instance from the administrative user interface of the developer portal, without changing the code or redeploying the custom widget. This object needs to be passed to some of the widgets' helper functions. 

### Deploy the custom widget to the developer portal

1. Specify the following values in the `deploy.js` file located in the root of your project: 

    * `resourceId` - Resource ID of your API Management service, in the following format: `subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ApiManagement/service/<api-management service-name>` 

    * `managementApiEndpoint` - Azure management API endpoint (depends on your environment, most likely `management.azure.com`) 

    * `apiVersion` - Optional, use to override the default management API version 

1. Run the following command:

    ```dotnetcli
    npm run deploy
    ```

    If prompted, sign in to your Azure account. 

The custom widget is now deployed to your developer portal and can be managed and used from there.
 

### Widget templates 

We provide templates for the following technologies you can use for the widget: 

* **TypeScript** (pure implementation without any framework) 
* **React** 
* **Vue** 

All templates are based on the TypeScript programming language. 

The React template contains prepared custom hooks in `hooks.ts` file and established providers for sharing context though the component tree with dedicated `useSecrets`, `useValues`, and `useEditorValues` hooks. 

### Implement a custom widget with another framework 

If you'd like to implement your widget using another JavaScript UI framework and libraries, you can do so but need to set up the project yourself with the following guidelines:

* In most cases, you should start from the TypeScript template. 
* Install any dependencies you want as in any other npm project. 
* If your framework of choice isn't compatible with [Vite build tool](https://vitejs.dev/), you'll need to configure it so that it outputs compiled files into the `./dist` folder. Optionally, redefine where the compiled files are located by providing a relative path as the fourth argument for the `deployNodeJs` function.
* For local development, the `config.msapim.json` file must be accessible at the URL `localhost:<port>/config.msapim.json` when the server is running. 

### `@azure/api-management-custom-widgets-tools` package 

This package contains a set of tools to help you develop your custom widget and provides features like communication between the developer portal and your widget. 

#### `@azure/api-management-custom-widgets-tools/getValues` 

Function that returns JSON object containing all the values you've set in the widget editor combined with default values, passed as an argument. 

```JavaScript
Import {getValues} from "@azure/api-management-custom-widgets-tools/getValues" 
import {valuesDefault} from "./values" 
const values = getValues(valuesDefault) 
``` 

It's intended to be used in the runtime (`app`) part of your widget. 

#### `@azure/api-management-custom-widgets-tools/getEditorValues` 

Function that works the same way as `getValues`, but returns only values you've set in the editor. 

It's intended to be used in the editor of your widget but works even in runtime. 

#### `@azure/api-management-custom-widgets-tools/buildOnChange` 

This function is intended to be used only in the widget editor. It returns a function to update the widget values. 

```JavaScript
const onChange = buildOnChange() 
onChange({fieldKey: 'newValue'}) 
``` 

This function takes one parameter: a JSON object with updated values. 

#### `@azure/api-management-custom-widgets-tools/askForSecrets` 

This function returns a JavaScript promise, which after resolution returns JSON object of data needed to communicate with backend. `token` is needed for authentication. `userId` is needed to query user-specific resources. Those values might be undefined in case the portal is viewed by an anonymous user. The `Secrets` object also contains `managementApiUrl`, which is the URL of your portal's backend, and `apiVersion`, which is the apiVersion currently used by the developer portal. 

> [!WARNING]
> Manage and use the token carefully. Anyone who has it can access data in your API Management service. 


#### `@azure/api-management-custom-widgets-tools/deployNodeJs` 

This function deploys your widget to your blob storage. In all templates it's already preconfigured in the `deploy.js` file.  

It accepts three arguments:  

* `serviceInformation` – Information about your Azure service: 

    *  `resourceId` - Resource ID of your API Management service, in the following format: `subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ApiManagement/service/<api-management service-name>` 

    * `managementApiEndpoint` - Azure management API endpoint (depends on your environment, most likely `management.azure.com`) 

* ID of your widget – Name of your widget in "PC-friendly" format (Latin alphanumeric lowercase characters and dashes, `Contoso widget` becomes `contoso-widget`). You can find it in the `package.json` under `name` key. 

* `fallbackConfigPath` – Path for the local `config.msapim.json` file, for example, `./static/config.msapim.json` 

#### `@azure/api-management-custom-widgets-tools/getWidgetData` 

This function is used internally in templates. In the majority of implementations you should not need it otherwise. 

This function returns all data passed to your custom widget from the developer portal. It contains additional pieces of data which might be useful in debugging or in more advanced scenarios. This API is expected to change with potential breaking changes. It returns a JSON object that contains the following keys: 

* `values` - All the values you've set in the editor, the same object that is returned by  `getEditorData` 

* `environment` - Current runtime environment the widget is running in 

* `origin` -  Location origin of the Developer Portal 

* `instanceId` - ID of this instance of the widget 

### Add or remove input fields 

You can further customize every instance of your custom widget through the developer portal editor. By default, four input fields are defined but you can add or remove as many as you need to. 

To add a new input field:  

1. In the file `src/values.ts`,  add to the `Values` type the name of the field and type of the data it will save. 
1. In the same same file, add a default value for it. 

Navigate to the “editor.html” or “editor/index” file (exact location depends on the framework you've chosen) and duplicate an existing input or add new one yourself. 

Make sure the input field reports changed value to the onChange function, which you can get from buildOnChange (link to `@azure/api-management-custom-widgets-tools/buildOnChange` section) 

## Next steps


Learn more about the developer portal:

- [Azure API Management developer portal overview](api-management-howto-developer-portal.md)

- [Contribute widgets](developer-portal-widget-contribution-guidelines.md) - we welcome and encourage community contributions.

- See [Use community widgets](developer-portal-use-community-widgets.md) to learn how to use widgets contributed by the community.
