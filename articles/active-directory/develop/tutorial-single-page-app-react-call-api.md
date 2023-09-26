---
title: "Tutorial: Call an API from a React single-page app"
description: Call an API from a React single-page app.
services: active-directory
author: OwenRichards1

ms.service: active-directory
ms.subservice: develop
ms.author: owenrichards
ms.topic: tutorial
ms.date: 09/25/2023
#Customer intent: As a React developer, I want to know how to create a user interface and access the Microsoft Graph API
---

# Tutorial: Call an API from a React single-page app

Before being able to interact with the single-page app (SPA), we need to initiate an API call to Microsoft Graph and create the user interface (UI) for the application. After this is added, we can sign in to the application and get profile data information from the Microsoft Graph API.

In this tutorial:

> [!div class="checklist"]
> * Create the API call to Microsoft Graph
> * Create a UI for the application
> * Import and use components in the application
> * Create a component that renders the user's profile information
> * Call the API from the application

## Prerequisites

* Completion of the prerequisites and steps in [Tutorial: Create components for sign in and sign out in a React single-page app](tutorial-single-page-app-react-sign-in-users.md).

## Create the API call to Microsoft Graph

To allow the SPA to request access to Microsoft Graph, a reference to the `graphConfig` object needs to be added. This contains the Graph REST API endpoint defined in *authConfig.js* file.

- In the *src* folder, open *graph.js* and replace the contents of the file with the following code snippet to request access to Microsoft Graph.

   :::code language="javascript" source="~/ms-identity-docs-code-javascript/react-spa/src/graph.js" :::

## Update imports to use components in the application

The following code snippet imports the UI components that were created previously to the application. It also imports the required components from the `@azure/msal-react` package. These components will be used to render the user interface and call the API.

- In the *src* folder, open *App.jsx* and replace the contents of the file with the following code snippet to request access.

   ```javascript
    import React, { useState } from 'react';
    
    import { PageLayout } from './components/PageLayout';
    import { loginRequest } from './authConfig';
    import { callMsGraph } from './graph';
    import { ProfileData } from './components/ProfileData';
    
    import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
    
    import './App.css';
    
    import Button from 'react-bootstrap/Button';
   ```

### Add the `ProfileContent` function

The `ProfileContent` function is used to render the user's profile information after the user has signed in. This function will be called when the user selects the **Request Profile Information** button.

- In the *App.jsx* file, add the following code below your imports:

    ```JavaScript
    /**
    * Renders information about the signed-in user or a button to retrieve data about the user
    */
    const ProfileContent = () => {
        const { instance, accounts } = useMsal();
        const [graphData, setGraphData] = useState(null);
            
        function RequestProfileData() {
            // Silently acquires an access token which is then attached to a request for MS Graph data
            instance
                .acquireTokenSilent({
                    ...loginRequest,
                    account: accounts[0],
                })
                .then((response) => {
                    callMsGraph(response.accessToken).then((response) => setGraphData(response));
                });
        }
            
        return (
            <>
                <h5 className="card-title">Welcome {accounts[0].name}</h5>
                <br/>
                {graphData ? (
                    <ProfileData graphData={graphData} />
                ) : (
                    <Button variant="secondary" onClick={RequestProfileData}>
                        Request Profile Information
                    </Button>
                )}
            </>
        );
    };
    ```

### Add the `MainContent` function

The `MainContent` function is used to render the user's profile information after the user has signed in. This function will be called when the user selects the **Request Profile Information** button.

- In the *App.jsx* file, replace the `App()` function with the following code:

    ```JavaScript
    /**
    * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
    */
    const MainContent = () => {
        return (
            <div className="App">
                <AuthenticatedTemplate>
                    <ProfileContent />
                </AuthenticatedTemplate>
            
                <UnauthenticatedTemplate>
                    <h5>
                        <center>
                            Please sign-in to see your profile information.
                        </center>
                    </h5>
                </UnauthenticatedTemplate>
            </div>
        );
    };
            
    export default function App() {
        return (
            <PageLayout>
                <center>
                    <MainContent />
                </center>
            </PageLayout>
        );
    }
    ```

## Call the Microsoft Graph API from the application

All the required code snippets have been added, so the application can now be called and tested in a web browser.

1. Navigate to the browser previously opened in [Tutorial: Prepare an application for authentication](./tutorial-single-page-app-react-prepare-spa.md). If your browser is closed, open a new window with the address `http://localhost:3000/`.

1. Select the **Sign In** button. For the purposes of this tutorial, choose the **Sign in using Popup** option.

    :::image type="content" source="./media/single-page-app-tutorial-04-call-api/sign-in-window.png" alt-text="Screenshot of React App sign-in window.":::

1. After the popup window appears with the sign-in options, select the account with which to sign-in.

    :::image type="content" source="./media/single-page-app-tutorial-04-call-api/pick-account.png" alt-text="Screenshot requesting user to choose Microsoft account to sign into.":::

1. A second window may appear indicating that a code will be sent to your email address. If this happens, select **Send code**. Open the email from the sender **Microsoft account team**, and enter the 7-digit single-use code. Once entered, select **Sign in**.

    :::image type="content" source="./media/single-page-app-tutorial-04-call-api/enter-code.png" alt-text="Screenshot prompting user to enter verification code to sign-in.":::

1. For **Stay signed in**, you can select either **No** or **Yes**.

    :::image type="content" source="./media/single-page-app-tutorial-04-call-api/stay-signed-in.png" alt-text="Screenshot prompting user to decide whether to stay signed in or not.":::

1. The app will now ask for permission to sign-in and access data. Select **Accept** to continue.

    :::image type="content" source="./media/single-page-app-tutorial-04-call-api/permissions-requested.png" alt-text="Screenshot prompting user to allow the application to access permissions.":::

1. The SPA will now display a button saying **Request Profile Information**. Select it to display the Microsoft Graph profile data acquired from the Microsoft Graph API.

    :::image type="content" source="./media/single-page-app-tutorial-04-call-api/display-api-call-results.png" alt-text="Screenshot of React App depicting the results of the API call.":::

## Next steps

Learn how to use the Microsoft identity platform by trying out the following tutorial series on how to build a web API.

> [!div class="nextstepaction"]
> [Tutorial: Register a web API with the Microsoft identity platform](web-api-tutorial-01-register-app.md)