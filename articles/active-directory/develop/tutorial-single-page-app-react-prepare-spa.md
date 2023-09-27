---
title: "Tutorial: Prepare an application for authentication"
description: Register a tenant application and configure it for a React SPA.
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.author: owenrichards
ms.topic: tutorial
ms.date: 09/25/2023
#Customer intent: As a React developer, I want to know how to create a new React project in an IDE and add authentication.
---

# Tutorial: Prepare a Single-page application for authentication

After registration is complete, a React project can be created using an integrated development environment (IDE). This tutorial demonstrates how to create a single-page React application using `npm` and create files needed for authentication and authorization.

In this tutorial:

> [!div class="checklist"]
> * Create a new React project
> * Configure the settings for the application
> * Install identity and bootstrap packages
> * Add authentication code to the application

## Prerequisites

* Completion of the prerequisites and steps in [Tutorial: Register an application](tutorial-single-page-app-react-register-app.md).
* Although any IDE that supports React applications can be used, the following Visual Studio IDEs are used for this tutorial. They can be downloaded from the [Downloads](https://visualstudio.microsoft.com/downloads) page. For macOS users, it's recommended to use Visual Studio Code.
  - Visual Studio 2022
  - Visual Studio Code
* [Node.js](https://nodejs.org/en/download/).

## Create a new React project

Use the following tabs to create a React project within the IDE.

### [Visual Studio](#tab/visual-studio)

1. Open Visual Studio, and then select **Create a new project**.
1. Search for and choose the **Standalone JavaScript React Project** template, and then select **Next**.
1. Enter a name for the project, such as *reactspalocal*.
1. Choose a location for the project or accept the default option, and then select **Next**.
1. In **Additional information**, select **Create**.
1. From the toolbar, select **Start Without Debugging** to launch the application. A web browser will open with the address `http://localhost:3000/` by default. The browser remains open and re-renders for every saved change.
1. Create additional folders and files to achieve the following folder structure:

    ```console
    ├─── public
    │   └─── index.html
    └───src
        ├─── components
        │   └─── PageLayout.jsx
        │   └─── ProfileData.jsx
        │   └─── SignInButton.jsx
        │   └─── SignOutButton.jsx
        └── App.css
        └── App.jsx
        └── authConfig.js
        └── graph.js
        └── index.css
        └── index.js
    ```


### [Visual Studio Code](#tab/visual-studio-code)

1. Open Visual Studio Code, select **File** > **Open Folder...**. Navigate to and select the location in which to create your project.
1. Open a new terminal by selecting **Terminal** > **New Terminal**.
1. Run the following commands to create a new React project with the name *reactspalocal*, change to the new directory and start the React project. A web browser will open with the address `http://localhost:3000/` by default. The browser remains open and re-renders for every saved change.

    ```powershell
    npx create-react-app reactspalocal
    cd reactspalocal
    npm start
    ```

1. Create additional folders and files to achieve the following folder structure:

    ```console
    ├─── public
    │   └─── index.html
    └───src
        ├─── components
        │   └─── PageLayout.jsx
        │   └─── ProfileData.jsx
        │   └─── SignInButton.jsx
        │   └─── SignOutButton.jsx
        └── App.css
        └── App.jsx
        └── authConfig.js
        └── graph.js
        └── index.css
        └── index.js
    ```
---

## Install identity and bootstrap packages

Identity related **npm** packages must be installed in the project to enable user  authentication. For project styling, **Bootstrap** will be used.

### [Visual Studio](#tab/visual-studio)

1. In the **Solution Explorer**, right-click the **npm** option and select **Install new npm packages**.
1. Search for **@azure/msal-browser**, then select **Install Package**. Repeat for **@azure/msal-react** and **@azure/msal-common**.
1. Search for and install **react-bootstrap**.
1. Select **Close**.

### [Visual Studio Code](#tab/visual-studio-code)

1. In the **Terminal** bar, select the **+** icon to create a new terminal. A separate terminal window will open with the previous node terminal continuing to run in the background.
1. Ensure that the correct directory is selected (*reactspalocal*) then enter the following into the terminal to install the relevant `msal` and `bootstrap` packages.

    ```powershell
    npm install @azure/msal-browser @azure/msal-react @azure/msal-common
    npm install react-bootstrap bootstrap
    ```
---

To learn more about these packages refer to the documentation in [msal-browser](/javascript/api/@azure/msal-browser), [msal-common](/javascript/api/@azure/msal-common), [msal-react](/javascript/api/@azure/msal-react).

## Creating the authentication configuration file

1. In the *src* folder, open *authConfig.js* and add the following code snippet:

   :::code language="javascript" source="~/ms-identity-docs-code-javascript/react-spa/src/authConfig.js" :::

1. Replace the following values with the values from the Microsoft Entra admin center.
    - `clientId` - The identifier of the application, also referred to as the client. Replace `Enter_the_Application_Id_Here` with the **Application (client) ID** value that was recorded earlier from the overview page of the registered application.
    - `authority` - This is composed of two parts:
        - The *Instance* is endpoint of the cloud provider. Check with the different available endpoints in [National clouds](authentication-national-cloud.md#azure-ad-authentication-endpoints).
        - The *Tenant ID* is the identifier of the tenant where the application is registered. Replace the `_Enter_the_Tenant_Info_Here` with the **Directory (tenant) ID** value that was recorded earlier from the overview page of the registered application.

1. Save the file.

## Modify *index.js* to include the authentication provider

All parts of the app that require authentication must be wrapped in the [`MsalProvider`](/javascript/api/@azure/msal-react/#@azure-msal-react-msalprovider) component. You instantiate a [PublicClientApplication](/javascript/api/@azure/msal-browser/publicclientapplication) then pass it to `MsalProvider`.

1. In the *src* folder, open *index.js* and replace the contents of the file with the following code snippet to use the `msal` packages and bootstrap styling:

    :::code language="javascript" source="~/ms-identity-docs-code-javascript/react-spa/src/index.js" :::

1. Save the file.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Create components for sign in and sign out in a React single-page app](tutorial-single-page-app-react-sign-in-users.md)
