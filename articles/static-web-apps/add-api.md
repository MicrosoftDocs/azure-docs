---
title: Add an API to Azure Static Web Apps with Azure Functions
description: Get started with Azure Static Web Apps by adding a Serverless API to your static web app using Azure Functions.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  how-to
ms.date: 08/29/2022
ms.author: cshoe
ms.custom:
---

# Add an API to Azure Static Web Apps with Azure Functions

You can add serverless APIs to Azure Static Web Apps that are powered by Azure Functions. This article demonstrates how to add and deploy an API to an Azure Static Web Apps site.

> [!NOTE]
> The functions provided by default in Static Web Apps are pre-configured to provide secure API endpoints and only support HTTP-triggered functions. See [API support with Azure Functions](apis-functions.md) for information on how they differ from standalone Azure Functions apps.

## Prerequisites

- Azure account with an active subscription.
  - If you don't have an account, you can [create one for free](https://azure.microsoft.com/free).
- [Visual Studio Code](https://code.visualstudio.com/)
- [Azure Static Web Apps extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) for Visual Studio Code
- [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code
- [Node.js](https://nodejs.org/download/) to run the frontend app and API

## Create the static web app

Before adding an API, create and deploy a frontend application to Azure Static Web Apps. Use an existing app that you've already deployed or create one by following the [Building your first static site with Azure Static Web Apps](getting-started.md) quickstart.

In Visual Studio Code, open the root of your app's repository. The folder structure contains the source for your frontend app and the Static Web Apps GitHub workflow in _.github/workflows_ folder.

```Files
├── .github
│   └── workflows
│       └── azure-static-web-apps-<DEFAULT_HOSTNAME>.yml
│
└── (folders and files from your static web app)
```

## Create the API

You create an Azure Functions project for your static web app's API. By default, the Static Web Apps Visual Studio Code extension creates the project in a folder named _api_ at the root of your repository.

1. Press <kbd>F1</kbd> to open the Command Palette.

1. Select **Azure Static Web Apps: Create HTTP Function...**. If you're prompted to install the Azure Functions extension, install it and rerun this command.

1. When prompted, enter the following values:

    | Prompt | Value |
    | --- | --- |
    | Select a language | **JavaScript** |
    | Select a programming model | **V3** |
    | Provide a function name | **message** |

    > [!TIP]
    > You can learn more about the differences between programming models in the [Azure Functions developer guide](/articles/azure-functions/functions-reference-node.md)
    
    An Azure Functions project is generated with an HTTP triggered function. Your app now has a project structure similar to the following example.

    ```Files
    ├── .github
    │   └── workflows
    │       └── azure-static-web-apps-<DEFAULT_HOSTNAME>.yml
    │
    ├── api
    │   ├── message
    │   │   ├── function.json
    │   │   └── index.js
    │   ├── host.json
    │   ├── local.settings.json
    │   └── package.json
    │
    └── (folders and files from your static web app)
    ```

1. Next, change the `message` function to return a message to the frontend. Update the function in _api/message/index.js_ with the following code.

    ```javascript
    module.exports = async function (context, req) {
        context.res.json({
            text: "Hello from the API"
        });
    };
    ```

> [!TIP]
> You can add more API functions by running the **Azure Static Web Apps: Create HTTP Function...** command again.

## Update the frontend app to call the API

Update your frontend app to call the API at `/api/message` and display the response message.

If you used the quickstarts to create the app, use the following instructions to apply the updates.

# [No Framework](#tab/vanilla-javascript)

Update the content of the _src/index.html_ file with the following code to fetch the text from the API function and display it on the screen.

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>Vanilla JavaScript App</title>
</head>

<body>
    <main>
    <h1>Vanilla JavaScript App</h1>
    <p>Loading content from the API: <b id="name">...</b></p>
    </main>

    <script>
    (async function() {
        const { text } = await( await fetch(`/api/message`)).json();
        document.querySelector('#name').textContent = text;
    }());
    </script>
</body>

</html>
```

# [Angular](#tab/angular)

1. Update the content of _src/app/app.module.ts_ with the following code to enable `HttpClient` in your app.

    ```typescript
    import { BrowserModule } from "@angular/platform-browser";
    import { NgModule } from "@angular/core";
    import { HttpClientModule } from '@angular/common/http';
    
    import { AppComponent } from "./app.component";
    
    @NgModule({
      declarations: [AppComponent],
      imports: [BrowserModule, HttpClientModule],
      bootstrap: [AppComponent]
    })
    export class AppModule {}
    ```

1. Update the content of _src/app/app.component.ts_ with the following code to fetch the text from the API function and display it on the screen.

    ```typescript
    import { HttpClient } from '@angular/common/http';
    import { Component } from '@angular/core';
    
    @Component({
      selector: 'app-root',
      template: `<div>{{message}}</div>`,
    })
    export class AppComponent {
      message = '';
    
      constructor(private http: HttpClient) {
        this.http.get('/api/message')
          .subscribe((resp: any) => this.message = resp.text);
      }
    }
    ```

# [React](#tab/react)

Update the content of _src/App.js_ with the following code to fetch the text from the API function and display it on the screen.

```javascript
import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    (async function () {
      const { text } = await( await fetch(`/api/message`)).json();
      setData(text);
    })();
  });

  return <div>{data}</div>;
}

export default App;
```

# [Vue](#tab/vue)

Update the content of _src/App.vue_ with the following code to fetch the text from the API function and display it on the screen.

```javascript
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      message: ""
    };
  },
  async mounted() {
    const { text } = await (await fetch("/api/message")).json();
    this.message = text;
  }
};
</script>
```

---

## Run the frontend and API locally

To run your frontend app and API together locally, Azure Static Web Apps provides a CLI that emulates the cloud environment. The CLI uses the Azure Functions Core Tools to run the API.

### Install command line tools

Ensure you have the necessary command line tools installed.

```bash
npm install -D @azure/static-web-apps-cli
```

### Build frontend app

If your app uses a framework, build the app to generate the output before running the Static Web Apps CLI.

# [No Framework](#tab/vanilla-javascript)

There's no need to build the app.

# [Angular](#tab/angular)

Install npm dependencies and build the app into the _dist/angular-basic_ folder.

```bash
npm install
npm run build --prod
```

# [React](#tab/react)

Install npm dependencies and build the app into the _build_ folder.

```bash
npm install
npm run build
```

# [Vue](#tab/vue)

Install npm dependencies and build the app into the _dist_ folder.

```bash
npm install
npm run build
```

---

### Start the CLI

Run the frontend app and API together by starting the app with the Static Web Apps CLI. Running the two parts of your application this way allows the CLI to serve your frontend's build output from a folder, and makes the API accessible to the running app.

1. In root of your repository, start the Static Web Apps CLI with the `start` command. Adjust the arguments if your app has a different folder structure.

    # [No Framework](#tab/vanilla-javascript)

    Pass the current folder (`src`) and the API folder (`api`) to the CLI.

    ```bash
    swa start src --api-location api
    ```

    # [Angular](#tab/angular)

    Pass the build output folder (`dist/angular-basic`) and the API folder (`api`) to the CLI.

    ```bash
    swa start dist/angular-basic --api-location api
    ```

    # [React](#tab/react)

    Pass the build output folder (`build`) and the API folder (`api`) to the CLI.

    ```bash
    swa start build --api-location api
    ```

    # [Vue](#tab/vue)

    Pass the build output folder (`dist`) and the API folder (`api`) to the CLI.

    ```bash
    swa start dist --api-location api
    ```

    ---

1. When the CLI processes start, access your app at `http://localhost:4280/`. Notice how the page calls the API and displays its output, `Hello from the API`.

1. To stop the CLI, type <kbd>Ctrl + C</kbd>.

## Add API location to workflow

Before you can deploy your app to Azure, update your repository's GitHub Actions workflow with the correct location of your API folder.

1. Open your workflow at _.github/workflows/azure-static-web-apps-\<DEFAULT-HOSTNAME>.yml_.

1. Search for the property `api_location` and set the value to `api`.
1. Save the file.

## Deploy changes

To publish changes to your static web app in Azure, commit and push your code to the remote GitHub repository.

1. Press <kbd>F1</kbd> to open the Command Palette.

1. Select the **Git: Commit All** command.

1. When prompted for a commit message, enter **feat: add API** and commit all changes to your local git repository.

1. Press <kbd>F1</kbd> to open the Command Palette.

1. Select the **Git: push** command.

    Your changes are pushed to the remote repository in GitHub, triggering the Static Web Apps GitHub Actions workflow to build and deploy your app.

1. Open your repository in GitHub to monitor the status of your workflow run.

1. When the workflow run completes, visit your static web app to view your changes.

## Next steps

> [!div class="nextstepaction"]
> [Configure app settings](./application-settings.md)
