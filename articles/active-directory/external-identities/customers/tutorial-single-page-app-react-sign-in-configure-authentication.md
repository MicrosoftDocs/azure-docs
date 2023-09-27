---
title: Tutorial - Handle authentication flows in a React single-page app
description: Learn how to configure authentication for a React single-page app (SPA) with your Microsoft Entra ID for customers tenant.
services: active-directory
author: garrodonnell
manager: CelesteDG

ms.author: godonnell
ms.service: active-directory
ms.subservice: ciam
ms.topic: tutorial
ms.date: 06/09/2023

#Customer intent: As a developer, I want to learn how to configure a React single-page app (SPA) to sign in and sign out users with my Microsoft Entra ID for customers tenant.
---

# Tutorial: Handle authentication flows in a React single-page app 

In the [previous article](./tutorial-single-page-app-react-sign-in-prepare-app.md), you created a React single-page app (SPA) and prepared it for authentication with your Microsoft Entra ID for customers tenant. In this article, you'll learn how to handle authentication flows in your app by adding components.

In this tutorial;

> [!div class="checklist"]
> * Add a *DataDisplay* component to the app
> * Add a *ProfileContent* component to the app
> * Add a *PageLayout* component to the app

## Prerequisites

* Completion of the prerequisites and steps in [Prepare an single-page app for authentication](./tutorial-single-page-app-react-sign-in-prepare-app.md).

## Add components to the application

Functional components are the building blocks of React apps, and are used to build the sign-in and sign-out experiences in your React SPA. 

### Add the DataDisplay component

1. Open *src/components/DataDisplay.jsx* and add the following code snippet

    ```jsx
    import { Table } from 'react-bootstrap';
    import { createClaimsTable } from '../utils/claimUtils';
    
    import '../styles/App.css';
    
    export const IdTokenData = (props) => {
        const tokenClaims = createClaimsTable(props.idTokenClaims);
    
        const tableRow = Object.keys(tokenClaims).map((key, index) => {
            return (
                <tr key={key}>
                    {tokenClaims[key].map((claimItem) => (
                        <td key={claimItem}>{claimItem}</td>
                    ))}
                </tr>
            );
        });
        return (
            <>
                <div className="data-area-div">
                    <p>
                        See below the claims in your <strong> ID token </strong>. For more information, visit:{' '}
                        <span>
                            <a href="https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token">
                                docs.microsoft.com
                            </a>
                        </span>
                    </p>
                    <div className="data-area-div">
                        <Table responsive striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Claim</th>
                                    <th>Value</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>{tableRow}</tbody>
                        </Table>
                    </div>
                </div>
            </>
        );
    };
    ```

1. Save the file.

### Add the NavigationBar component

1. Open *src/components/NavigationBar.jsx* and add the following code snippet

    ```jsx
    import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
    import { Navbar, Button } from 'react-bootstrap';
    import { loginRequest } from '../authConfig';
    
    export const NavigationBar = () => {
        const { instance } = useMsal();
        
        const handleLoginRedirect = () => {
            instance.loginRedirect(loginRequest).catch((error) => console.log(error));
        };
    
        const handleLogoutRedirect = () => {
            instance.logoutRedirect().catch((error) => console.log(error));
        };
    
        /**
         * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
         * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
         * only render their children if a user is authenticated or unauthenticated, respectively.
         */
        return (
            <>
                <Navbar bg="primary" variant="dark" className="navbarStyle">
                    <a className="navbar-brand" href="/">
                        Microsoft identity platform
                    </a>
                    <AuthenticatedTemplate>
                        <div className="collapse navbar-collapse justify-content-end">
                            <Button variant="warning" onClick={handleLogoutRedirect}>
                                Sign out
                            </Button>
                        </div>
                    </AuthenticatedTemplate>
                    <UnauthenticatedTemplate>
                        <div className="collapse navbar-collapse justify-content-end">
                            <Button onClick={handleLoginRedirect}>Sign in</Button>
                        </div>
                    </UnauthenticatedTemplate>
                </Navbar>
            </>
        );
    };
    ```

1. Save the file.

### Add the PageLayout component

1. Open *src/components/PageLayout.jsx* and add the following code snippet

    ```jsx
    import { AuthenticatedTemplate } from '@azure/msal-react';
    
    import { NavigationBar } from './NavigationBar.jsx';
    
    export const PageLayout = (props) => {
        /**
         * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
         * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
         * only render their children if a user is authenticated or unauthenticated, respectively.
         */
        return (
            <>
                <NavigationBar />
                <br />
                <h5>
                    <center>Welcome to the Microsoft Authentication Library For React Tutorial</center>
                </h5>
                <br />
                {props.children}
                <br />
                <AuthenticatedTemplate>
                    <footer>
                        <center>
                            How did we do?
                            <a
                                href="https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR_ivMYEeUKlEq8CxnMPgdNZUNDlUTTk2NVNYQkZSSjdaTk5KT1o4V1VVNS4u"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                {' '}
                                Share your experience!
                            </a>
                        </center>
                    </footer>
                </AuthenticatedTemplate>
            </>
        );
    }
    ```

1. Save the file.

## Next steps

> [!div class="nextstepaction"]
> [Sign in and sign out of the React SPA](./tutorial-single-page-app-react-sign-in-sign-out.md)
