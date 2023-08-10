---
title: Tutorial - Add sign-in and sign-out to a Vanilla JavaScript single-page app (SPA) for a customer tenant
description: Learn how to configure a Vanilla JavaScript single-page app (SPA) to sign in and sign out users with your Azure Active Directory (AD) for customers tenant.
services: active-directory
author: OwenRichards1
manager: CelesteDG
ms.author: owenrichards
ms.service: active-directory
ms.subservice: ciam
ms.custom: devx-track-js
ms.topic: tutorial
ms.date: 05/25/2023
#Customer intent: As a developer, I want to learn how to configure Vanilla JavaScript single-page app (SPA) to sign in and sign out users with my Azure Active Directory (AD) for customers tenant.
---

# Tutorial: Add sign-in and sign-out to a vanilla JavaScript single-page app for a customer tenant

In the [previous article](how-to-single-page-app-vanillajs-configure-authentication.md), you edited the popup and redirection files that handle the sign-in page response. This tutorial demonstrates how to build a responsive user interface (UI) that contains a **Sign-In** and **Sign-Out** button and run the project to test the sign-in and sign-out functionality.

In this tutorial;

> [!div class="checklist"]
> * Add code to the *index.html* file to create the user interface
> * Add code to the *signout.html* file to create the sign-out page
> * Sign in and sign out of the application

## Prerequisites

* Completion of the prerequisites and steps in [Create components for authentication and authorization](how-to-single-page-app-vanillajs-configure-authentication.md).

## Add code to the *index.html* file

The main page of the SPA, *index.html*, is the first page that is loaded when the application is started. It's also the page that is loaded when the user selects the **Sign-Out** button. 

1. Open *public/index.html* and add the following code snippet:

   ```html
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
        <title>Microsoft identity platform</title>
        <link rel="SHORTCUT ICON" href="./favicon.svg" type="image/x-icon">
        <link rel="stylesheet" href="./styles.css">
        
        <!-- adding Bootstrap 5 for UI components  -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
    
        <!-- msal.min.js can be used in the place of msal-browser.js -->
        <script src="/msal-browser.min.js"></script>
    </head>
    
    <body>
        <nav class="navbar navbar-expand-sm navbar-dark bg-primary navbarStyle">
            <a class="navbar-brand" href="/">Microsoft identity platform</a>
            <div class="navbar-collapse justify-content-end">
                <button type="button" id="signIn" class="btn btn-secondary" onclick="signIn()">Sign-in</button>
                <button type="button" id="signOut" class="btn btn-success d-none" onclick="signOut()">Sign-out</button>
            </div>
        </nav>
        <br>
        <h5 id="title-div" class="card-header text-center">Vanilla JavaScript single-page application secured with MSAL.js
        </h5>
        <h5 id="welcome-div" class="card-header text-center d-none"></h5>
        <br>
        <div class="table-responsive-ms" id="table">
            <table id="table-div" class="table table-striped d-none">
                <thead id="table-head-div">
                    <tr>
                        <th>Claim Type</th>
                        <th>Value</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody id="table-body-div">
                </tbody>
            </table>
        </div>
        <!-- importing bootstrap.js and supporting js libraries -->
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
            integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous">
            </script>
        <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
            integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3"
            crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3"
            crossorigin="anonymous"></script>
            
        <!-- importing app scripts (load order is important) -->
        <script type="text/javascript" src="./authConfig.js"></script>
        <script type="text/javascript" src="./ui.js"></script>
        <script type="text/javascript" src="./claimUtils.js"></script>
        <!-- <script type="text/javascript" src="./authRedirect.js"></script> -->
        <!-- uncomment the above line and comment the line below if you would like to use the redirect flow -->
        <script type="text/javascript" src="./authPopup.js"></script>
    </body>
    
    </html>
    ```

1. Save the file.

## Add code to the *signout.html* file

1. Open *public/signout.html* and add the following code snippet:

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Azure AD | Vanilla JavaScript SPA</title>
        <link rel="SHORTCUT ICON" href="./favicon.svg" type="image/x-icon">
    
        <!-- adding Bootstrap 4 for UI components  -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    </head>
    <body>
        <div class="jumbotron" style="margin: 10%">
            <h1>Goodbye!</h1>
            <p>You have signed out and your cache has been cleared.</p>
            <a class="btn btn-primary" href="/" role="button">Take me back</a>
        </div>
    </body>
    </html>
    ```

1. Save the file.

## Add code to the *ui.js* file

When authorization has been configured, the user interface can be created to allow users to sign in and sign out when the project is run. To build the user interface (UI) for the application, [Bootstrap](https://getbootstrap.com/) is used to create a responsive UI that contains a **Sign-In** and **Sign-Out** button.

1. Open *public/ui.js* and add the following code snippet:

    ```javascript
    // Select DOM elements to work with
    const signInButton = document.getElementById('signIn');
    const signOutButton = document.getElementById('signOut');
    const titleDiv = document.getElementById('title-div');
    const welcomeDiv = document.getElementById('welcome-div');
    const tableDiv = document.getElementById('table-div');
    const tableBody = document.getElementById('table-body-div');
    
    function welcomeUser(username) {
        signInButton.classList.add('d-none');
        signOutButton.classList.remove('d-none');
        titleDiv.classList.add('d-none');
        welcomeDiv.classList.remove('d-none');
        welcomeDiv.innerHTML = `Welcome ${username}!`;
    };
    
    function updateTable(account) {
        tableDiv.classList.remove('d-none');
        
        const tokenClaims = createClaimsTable(account.idTokenClaims);
    
        Object.keys(tokenClaims).forEach((key) => {
            let row = tableBody.insertRow(0);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            cell1.innerHTML = tokenClaims[key][0];
            cell2.innerHTML = tokenClaims[key][1];
            cell3.innerHTML = tokenClaims[key][2];
        });
    };
    ```

1. Save the file.

## Add code to the *styles.css* file

1. Open *public/styles.css* and add the following code snippet:

    ```css
    .navbarStyle {
        padding: .5rem 1rem !important;
    }
    
    .table-responsive-ms {
        max-height: 39rem !important;
        padding-left: 10%;
        padding-right: 10%;
    }
    ```

1. Save the file.

## Run your project and sign in

Now that all the required code snippets have been added, the application can be called and tested in a web browser.

1. Open a new terminal and run the following command to start your express web server.
    ```powershell
    npm start
    ```
1. Open a new private browser, and enter the application URI into the browser, `http://localhost:3000/`.
1. Select **No account? Create one**, which starts the sign-up flow.
1. In the **Create account** window, enter the email address registered to your Azure Active Directory (AD) for customers tenant, which starts the sign-up flow as a user for your application.
1. After entering a one-time passcode from the customer tenant, enter a new password and more account details, this sign-up flow is completed.

    1. If a window appears prompting you to **Stay signed in**, choose either **Yes** or **No**.

1. The SPA will now display a button saying **Request Profile Information**. Select it to display profile data.

    :::image type="content" source="media/how-to-spa-vanillajs-sign-in-sign-in-out/display-vanillajs-welcome.png" alt-text="Screenshot of sign in into a vanilla JS SPA." lightbox="media/how-to-spa-vanillajs-sign-in-sign-in-out/display-vanillajs-welcome.png":::

## Sign out of the application

1. To sign out of the application, select **Sign out** in the navigation bar.
1. A window appears asking which account to sign out of.
1. Upon successful sign out, a final window appears advising you to close all browser windows.

## Next steps

- [Enable self-service password reset](./how-to-enable-password-reset-customers.md)
