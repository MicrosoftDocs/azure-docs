---
title: Tutorial - Call a web API protected by Azure AD B2C
description: Follow this tutorial to learn how to call a web API protected by Azure AD B2C from a node js web app. A web app acquires an access token and uses it to call a protected endpoint. The web app adds the access token as a bearer in the Authorization header, and the web API needs to validate it. 
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: tutorial
ms.date: 12/7/2021
ms.author: kengaderdus
ms.subservice: B2C
---

# Tutorial: Call a web API protected with Azure AD B2C

In this tutorial, you'll learn how to use an access token issues by Azure Active Directory B2C (Azure AD B2C) to call a web API protected by Azure AD B2C. In this setup, a web app, such as *webapp1*, and a web API, such as *webapi1*, are involved.. Users authenticate into the web app to acquire an access token, which they use to call a protected web API.

The app does the following:
- Authenticates users with Azure AD B2C.
- Acquires an access token with the required permissions (scopes) for the web API endpoint.
- Passes the access token as a bearer token in the authentication header of the HTTP request by using this format:
```http
Authorization: Bearer <token>
```

The web API does the following:
- Reads the bearer token from the authorization header in the HTTP request.
- Validates the token.
- Validates the permissions (scopes) in the token.
- Responds to the HTTP request. If the token isn't valid, the web API endpoints responds with `401 Unauthorized` HTTP error.

Follow the steps in this tutorial to:

> [!div class="checklist"]
> * Write code for a sample node API, *colorsapi*
> * Expose a public and a private endpoint in the node API
> * Protect the private endpoint with Azure AD B2C and validate requests to this endpoint
> * Test the API by calling it from a node web app 



## Prerequisites
- Complete the steps in [Tutorial: Sign in and sign out users with Azure AD B2C in a Node.js web app](tutorial-authenticate-nodejs-webapp-msal.md). The tutorial shows you how to configure scopes for a web API, grant permissions to a web app, and acquire an access token for calling a web API. The acquired access token is what we'll use to call a protected web API in this tutorial. 

## Create the web API

1. Create a folder to host your node application, such as `tutorial-colors-api`:
    1. In your terminal, change directory into your node app folder, such as `cd tutorial-colors-api`, and run `npm init -y`. This command creates a default package.json file for your Node.js project.
    1. In your terminal, run npm install express. This command installs the Express framework.
1. Create `index.js` and `.env` files to achieve the following project structure:

```
tutorial-colors-api/
├── index.js
└── package.json
└── .env
``` 
1. In your `.env` file, add the following code:

```
#api port number
HTTP_PORT=server-port
#client ID for the colors web api; also serves as the audience
CLIENT_ID=web-api-client-id
TENANT_NAME=tenant-name
ISSUER=https://tenant-name.b2clogin.com/tenant-id/v2.0/
POLICY_NAME=susi-flow
METADATA_DISCOVERY=.well-known/openid-configuration
METADATA_VERSION=v2.0
isB2C=true
validateIssuer=false
passReqToCallbackfalse=false
loggingLevel=info
```
Modify the values in the `.env` files as follows:
- `server-port`: The HTTP port on which your web API is running such as `4000`.
- `web-api-client-id`: The **Application (client) ID** of the web API you registered. This is different from the application for the web app.
- 


## Next steps
Learn how to:
- [Enable authentication in your own Android app](enable-authentication-android-app.md)
- [Configure authentication options in an Android app](enable-authentication-android-app-options.md)