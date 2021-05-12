---
title: Add an API to Azure Static Web Apps with Azure Functions
description: Get started with Azure Static Web Apps by adding a Serverless API to your static web app using Azure Functions.
services: static-web-apps
author: manekinekko
ms.service: static-web-apps
ms.topic:  how-to
ms.date: 05/12/2021
ms.author: wachegha
ms.custom: devx-track-js
---

# Add an API to Azure Static Web Apps Preview with Azure Functions

You can add serverless APIs to Azure Static Web Apps via integration with Azure Functions. This article demonstrates how to add and deploy an API to an Azure Static Web Apps site.

> [!NOTE]
> There are some differences between Static Web Apps managed functions and regular Azure Functions apps. See [API support with Azure Functions](apis.md) for more information.

## Prerequisites

- Azure account with an active subscription.
  - If you don't have an account, you can [create one for free](https://azure.microsoft.com/free).
- [Visual Studio Code](https://code.visualstudio.com/)
- [Azure Static Web Apps extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) for Visual Studio Code
- [Node.js](https://nodejs.org/download/) to run the frontend app and API

## Create the static web app

Before adding an API, create and deploy a frontend application to Azure Static Web Apps. Use an existing app that you have deployed or create one by following the [Building your first static site with Azure Static Web Apps](getting-started.md) quickstart.

In VS Code, open the root of the repository containing your app. It should contain the source for your frontend app and the Static Web Apps GitHub workflow in `.github/workflows`.

```files
├── .github
│   ├── workflows
│   │   ├── azure-static-web-apps-<default-hostname>.yml
├── (folders and files from your static web app)
```

## Create the API

You create an Azure Functions projects for your static web app's API. By default, the Static Web Apps VS Code extension creates the project in a folder named `api` at the root of your repository.

1. Press <kbd>F1</kbd> to open the Command Palette.

1. Select **Azure Static Web Apps: Create HTTP Function...**.
    > [!NOTE]
    > If you're prompted to install the Azure Functions extension, install it and re-run this command.

1. When prompted, enter the following values:

    | Prompt | Value | Description |
    | --- | --- | --- |
    | Select a language | JavaScript | |
    | Provide a function name | message | |

    An Azure Functions project is generated with an HTTP triggered function. Your app now has a project structure similar to the following example.

    ```files
    ├── .github
    │   ├── workflows
    │   │   ├── azure-static-web-apps-<default-hostname>.yml
    ├── api
    │   ├── GetMessage
    │   │   ├── function.json
    │   │   ├── index.js
    │   ├── host.json
    │   ├── local.settings.json
    │   ├── package.json
    ├── (folders and files from your static web app)
    ```

1. Next, you'll change the `message` function to return a message to the frontend. Update the function in _api/message/index.js_ with the following code.

    ```javascript
    module.exports = async function (context, req) {
        context.res = {
            body: {
            text: "Hello from the API"
            }
        };
    };
    ```

## Update the frontend app to call the API

Because the function you created is called `message`, it will be accessible at `/api/message`. Update your frontend app to call this API.

If you used the quickstarts to create the app, use the following instructions to apply the updates.

# [No Framework](#tab/vanilla-javascript)

Update the content of the _index.html_ file with the following code to fetch the text from the API function and display it on the screen:

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
        let { text } = await( await fetch(`/api/message`)).json();
        document.querySelector('#name').textContent = text;
    }())
    </script>
</body>

</html>
```

# [Angular](#tab/angular)

1. Update the content of _src/app/app.module.ts_ with the following code to enable `HttpClient` in your app:

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

1. Update the content of _src/app/app.component.ts_ with the following code to fetch the text from the API function and display it on the screen:

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

Update the content of _src/App.js_ with the following code to fetch the text from the API function and display it on the screen:

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

Update the content of _src/App.vue_ with the following code to fetch the text from the API function and display it on the screen:

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

To run your frontend app and API together locally, Azure Static Web Apps provides a CLI that emulates the cloud environment. The CLI leverages the Azure Functions Core Tools to run the API.

### Install command line tools

Ensure you have the command line tools installed.

1. Install Azure Static Web Apps CLI.
    ```bash
    npm install -g @azure/static-web-apps-cli
    ```

1. Install Azure Functions Core Tools V3.
    ```bash
    npm install -g azure-functions-core-tools@3
    ```

### Start the Static Web Apps emulator

Test the frontend app and API together by starting an emulator using the Static Web Apps CLI. The emulator serves your frontend's build output from a folder.

1. If your app uses a framework, such as React, build the app to generate the output before running the emulator.

    # [No Framework](#tab/vanilla-javascript)

    There is no need to build the app.

    # [Angular](#tab/angular)

    Build the app into the _dist/angular-basic_ folder.

    ```bash
    npm run build --prod
    ```

    # [React](#tab/react)

    Build the app into the _build_ folder.

    ```bash
    npm run build
    ```

    # [Vue](#tab/vue)

    Build the app into the _dist_ folder.

    ```bash
    npm run build
    ```

    ---

1. In root of your repository, start the emulator using the Static Web Apps CLI's `start` command. Pass the build output folder and the API folder in the `--api` argument.

    # [No Framework](#tab/vanilla-javascript)

    ```bash
    swa start . --api api
    ```

    # [Angular](#tab/angular)

    ```bash
    swa start dist/angular-basic --api api
    ```

    # [React](#tab/react)

    ```bash
    swa start build --api api
    ```

    # [Vue](#tab/vue)

    ```bash
    swa start dist --api api
    ```

    ---

1. When the emulator is started, access your app at `http://localhost:4280/`. The page calls the API and displays its output, `Hello from the API`.

1. To stop the emulator, type <kbd>Ctrl-C</kbd>.

## Add API location to workflow

Before you can deploy your app to Azure, update your repository's GitHub Actions workflow with the correct location of your API folder.

1. Open your workflow at _.github/workflows/azure-static-web-apps-\<default-host-name>.yml_.

1. Update the `Azure/static-web-apps-deploy` action's `api_location` property to `api` and save the file.

## Deploy changes to Static Web Apps

To publish changes to your static web app in Azure, commit and push your code to the remote GitHub repository.

1. Press <kbd>F1</kbd> to open the Command Palette.

1. Select the **Git: Commit All** command.

1. When prompted for a commit message, enter `add API` to commit all changes to your local Git repository.

1. Press <kbd>F1</kbd> to open the Command Palette.

1. Select the **Git: push** command.

    Your changes are pushed to the remote repository in GitHub, triggering the Static Web Apps GitHub Actions workflow to build and deploy your app.

1. Open your repository in GitHub to monitor the status of your workflow run.

1. When the workflow run is complete, visit your static web app to view your changes.

## Next steps

> [!div class="nextstepaction"]
> [Configure app settings](./application-settings.md)
