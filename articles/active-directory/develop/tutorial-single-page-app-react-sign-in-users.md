---
title: "Tutorial: Create components for sign in and sign out in a React single-page app"
description: Add sign in and sign out components to your React single-page app
services: active-directory
author: OwenRichards1

ms.service: active-directory
ms.subservice: develop
ms.author: owenrichards
ms.custom: devx-track-js
ms.topic: tutorial
ms.date: 09/26/2023
#Customer intent: As a React developer, I want to know how to use functional components to add sign in and sign out experiences in my React application.
---

# Tutorial: Create components for sign in and sign out in a React single page app

Functional components are the building blocks of React apps. This tutorial demonstrates how functional components can be used to build the sign in and sign out experience in a React single-page app (SPA). The `useMsal` hook is used to retrieve an access token to allow user sign-in.

In this tutorial:

> [!div class="checklist"]
>
> - Add components to the application
> - Create a way of displaying the user's profile information
> - Create a layout that displays the sign in and sign out experience
> - Add the sign in and sign out experiences

## Prerequisites

* Completion of the prerequisites and steps in [Tutorial: Prepare an application for authentication](tutorial-single-page-app-react-prepare-spa.md).

### Add the page layout component

1. Open *PageLayout.jsx* and add the following code to render the page layout. The [useIsAuthenticated](/javascript/api/@azure/msal-react) hook returns whether or not a user is currently signed-in.

   ```javascript
   /*
    * Copyright (c) Microsoft Corporation. All rights reserved.
    * Licensed under the MIT License.
    */

   import React from "react";
   import Navbar from "react-bootstrap/Navbar";

   import { useIsAuthenticated } from "@azure/msal-react";
   import { SignInButton } from "./SignInButton";
   import { SignOutButton } from "./SignOutButton";

   /**
    * Renders the navbar component with a sign in or sign out button depending on whether or not a user is authenticated
    * @param props
    */
   export const PageLayout = (props) => {
     const isAuthenticated = useIsAuthenticated();

     return (
       <>
         <Navbar bg="primary" variant="dark" className="navbarStyle">
           <a className="navbar-brand" href="/">
             Microsoft Identity Platform
           </a>
           <div className="collapse navbar-collapse justify-content-end">
             {isAuthenticated ? <SignOutButton /> : <SignInButton />}
           </div>
         </Navbar>
         <br />
         <br />
         <h5>
           <center>
             Welcome to the Microsoft Authentication Library For JavaScript -
             React SPA Tutorial
           </center>
         </h5>
         <br />
         <br />
         {props.children}
       </>
     );
   };
   ```

1. Save the file.

### Display profile information 

1. Open the *ProfileData.jsx* and add the following code, which creates a component that displays the user's profile information:

   ```javascript
   import React from "react";
   /**
    * Renders information about the user obtained from MS Graph 
    * @param props
    */
   export const ProfileData = (props) => {
     return (
       <div id="profile-div">
         <p>
           <strong>First Name: </strong> {props.graphData.givenName}
         </p>
         <p>
           <strong>Last Name: </strong> {props.graphData.surname}
         </p>
         <p>
           <strong>Email: </strong> {props.graphData.userPrincipalName}
         </p>
         <p>
           <strong>Id: </strong> {props.graphData.id}
         </p>
       </div>
     );
   };
   ```

1. Save the file.

### Adding the sign in experience

1. Open *SignInButton.jsx* and add the following code, which creates a button that signs in the user using either a pop-up or redirect.

   ```javascript 
   import React from "react";
   import { useMsal } from "@azure/msal-react";
   import { loginRequest } from "../authConfig";
   import DropdownButton from "react-bootstrap/DropdownButton";
   import Dropdown from "react-bootstrap/Dropdown";

   /**
    * Renders a drop down button with child buttons for logging in with a popup or redirect
    * Note the [useMsal] package 
    */

   export const SignInButton = () => {
     const { instance } = useMsal();

     const handleLogin = (loginType) => {
       if (loginType === "popup") {
         instance.loginPopup(loginRequest).catch((e) => {
           console.log(e);
         });
       } else if (loginType === "redirect") {
         instance.loginRedirect(loginRequest).catch((e) => {
           console.log(e);
         });
       }
     };
     return (
       <DropdownButton
         variant="secondary"
         className="ml-auto"
         drop="start"
         title="Sign In"
       >
         <Dropdown.Item as="button" onClick={() => handleLogin("popup")}>
           Sign in using Popup
         </Dropdown.Item>
         <Dropdown.Item as="button" onClick={() => handleLogin("redirect")}>
           Sign in using Redirect
         </Dropdown.Item>
       </DropdownButton>
     );
   };
   ```

1. Save the file.

### Adding the sign out experience

1. Open *SignOutButton.jsx* and add the following code, which creates a button that signs out the user using either a pop-up or redirect.

   ```javascript 
   import React from "react";
   import { useMsal } from "@azure/msal-react";
   import DropdownButton from "react-bootstrap/DropdownButton";
   import Dropdown from "react-bootstrap/Dropdown";

   /**
    * Renders a sign out button 
    */
   export const SignOutButton = () => {
     const { instance } = useMsal();

     const handleLogout = (logoutType) => {
       if (logoutType === "popup") {
         instance.logoutPopup({
           postLogoutRedirectUri: "/",
           mainWindowRedirectUri: "/",
         });
       } else if (logoutType === "redirect") {
         instance.logoutRedirect({
           postLogoutRedirectUri: "/",
         });
       }
     };

     return (
       <DropdownButton
         variant="secondary"
         className="ml-auto"
         drop="start"
         title="Sign Out"
       >
         <Dropdown.Item as="button" onClick={() => handleLogout("popup")}>
           Sign out using Popup
         </Dropdown.Item>
         <Dropdown.Item as="button" onClick={() => handleLogout("redirect")}>
           Sign out using Redirect
         </Dropdown.Item>
       </DropdownButton>
     );
   };
   ```

1. Save the file.

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Call an API from a React single-page app](tutorial-single-page-app-react-call-api.md)
