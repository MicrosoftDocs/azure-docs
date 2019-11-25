---
title: Write an app to connect to an Azure API for FHIR endpoint
description: This tutorial shows how to write an application that connects to an Azure API for FHIR endpoint by using an Azure AD OAuth2 token.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: dseven
ms.author: matjazl
author: matjazl
ms.date: 10/13/2019
---

# Write an application to connect to an Azure API for FHIR endpoint

In previous tutorials, you have set up your environment, created a service endpoint, and created an Azure Active Directory (Azure AD) application registration. In this tutorial, you will write your first sample application.

Select the option that's suitable to your development environment:
* You want to run the project with a web server by using Node.js. To open the files, use an editor such as Visual Studio Code.
* (Optional) You want to run the project with an IIS server. For this, you just use index.html.


The sample application has two parts: 
* Obtaining the access token for the service from Azure AD. 
* Using the token to call the Azure API for Fast Healthcare Interoperability Resources (FHIR), and obtaining the list of patients.

## Create a skeleton of your web app

We will use a Node.js express app to serve an index.html page that contains JS code. The app authenticates to Azure AD, and obtains the token for the Azure API for FHIR endpoint. Then it lists the patients in a table format.

Index.js should look something like this:

``` javascript
var express = require('express');
var app = express();

var port = 30662;
app.use(express.static('JavaScriptSPA'));
app.get('*', function(req,res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port);
console.log('Listening on port ' + port + '...');
```

The corresponding package.json should look like this:

``` json
{
  "name": "tutorial",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "express": "^4.17.1"
  }
}

```

The skeleton of index.html should look like this:

``` javascript
<!DOCTYPE html>
<html>
<head>
    <title>FHIR Patient browser sample app</title>
    <script src="https://secure.aadcdn.microsoftonline-p.com/lib/1.0.0/js/msal.js"></script>
</head>
<body>
    <div class="container">
        <div class="leftContainer">
            <p id="WelcomeMessage">Welcome to the FHIR Patient browsing sample Application</p>
            <button id="SignIn" onclick="signIn()">Sign In</button>
        </div>
        <div class="patientTable">
        </div>
    </div>
    <script>
        // here we insert our code for the app
    </script>
</body>
</html>
```

## Obtain an access token for the service

This step of the process is part of the normal Azure AD authentication flow. There are many samples in Azure AD documentation library. Here, we will use a sample JS code to authenticate to Azure AD and obtain the token for our application.

First, configure the MSAL library and Azure AD configuration. 

> [!IMPORTANT]
> In a real scenario, store the initialization information in a separate file. Don't hard-code the information.

```javascript
        var msalConfig = {
        auth: {
            clientId: '<copy your Application ID here>',
            authority: "https://login.microsoftonline.com/<Tenant ID>"
        },
        cache: {
            cacheLocation: "localStorage",
            storeAuthStateInCookie: true
        }
    }
    var FHIRConfig = {
        FHIRendpoint: "<FHIR Server Endpoint>"
    }
    var requestObj = {
        scopes: ["https://azurehealthcareapis.com/user_impersonation"]
    }

    var myMSALObj = new Msal.UserAgentApplication(msalConfig);
    myMSALObj.handleRedirectCallback(authRedirectCallBack);

    function authRedirectCallBack(error, response) {
        if (error) {
            console.log(error);
        } else {
            if (response.tokenType === "access_token") {
                callFHIRServer(FHIRConfig.FHIRendpoint + '/Patient','GET', null, response.accessToken, FHIRCallback);
            }
        } else {
            console.log("token type is:" + response.tokenType);
        }
    }
```

Now, add a method that you'll call when the user selects the sign-in button. We'll call the MSAL library to obtain the token for our application, and later pass it to the FHIR server calling API to list all the patients.

``` javascript
    function signIn() {
        myMSALObj.loginPopup(requestObj).then(function (loginResponse) {
            showWelcomeMessage();
            acquireTokenPopupAndCallFHIRServer();
        }).catch(function(error) {
            console.log(error);
        })
    }

    function showWelcomeMessage() {
        var divWelcome = document.getElementById('WelcomeMessage');
        divWelcome.innerHTML = "Welcome " + myMSALObj.getAccount().userName + " to FHIR Patient Browsing App";
        var loginbutton = document.getElementById('SignIn');
        loginbutton.innerHTML = 'Sign Out';
        loginbutton.setAttribute('onclick', 'signOut()')
    }

    function signOut() {
        myMSALObj.logout();
    }

    function acquireTokenPopupAndCallFHIRServer() {
        myMSALObj.acquireTokenSilent(requestObj).then(function (tokenResponse) {
            callFHIRServer(FHIRConfig.FHIRendpoint + '/Patient','GET',null, tokenResponse.accessToken, FHIRCallback);
        }).catch(function (error) {
            console.log(error);
            if (requiresInteraction(error.errorCode)) {
                myMSALObj.acquireTokenPopup(requestObj).then(function (tokenResponse) {
                    callFHIRServer(FHIRConfig.FHIRendpoint + '/Patient','GET',null, tokenResponse.accessToken, FHIRCallback);
                }).catch(function(error) {
                    console.log(error);
                })
            }
        });
    }
```

The last step is to call the FHIR server, and pass the token in the authorization header: 

``` javascript

    function callFHIRServer(theUrl, method, message, accessToken, callBack) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200)
                callBack(JSON.parse(this.responseText));
        }
        xmlHttp.open(method, theUrl, true);
        xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlHttp.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xmlHttp.send(message);
    }

    function FHIRCallback(data) {
        document.getElementById("json").innerHTML = JSON.stringify(data, null, 2);
    }
```

## Start the project

If you're using Node.js:

1. To start the server, run the following command from the project directory:

    ```bash
        npm install
        node server.js
    ```

2. Open a web browser and go to http://localhost:30662/.
3. Select **Sign In** to start the sign-in, and then call the Azure API for FHIR.

After you sign in, you should see all the patient resources listed.

## Next steps

In this tutorial, you've connected to an endpoint. As a next step, you may want to interact directly with the FHIR server as you continue to build out this application. You can learn more details about this in the Access Azure API for FHIR with Postman tutorial
 
>[!div class="nextstepaction"]
>[Access Azure API for FHIR with Postman](access-fhir-postman-tutorial.md)
