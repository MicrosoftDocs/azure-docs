---
title: 'Tutorial: Write an app to connect to Azure API for FHIR endpoint'
description: This tutorial shows how to write application that connects to Azure API for FHIR endpoint using Azure AD OAuth2 token.
services: healthcare-apis
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: tutorial
ms.reviewer: dseven
ms.author: matjazl
author: matjazl
ms.date: 10/13/2019
---

# Tutorial: Write a sample application that uses Azure AD OAuth2 token to access Azure API for FHIR endpoint

After we have setup the environment, created a service endpoint and Azure AD application registration, we are ready to write our first sample application.

Select the option that's suitable to your development environment:
* To run the project with a web server by using Node.js. To open the files, use an editor such as Visual Studio Code.
* (Optional) To run the project with the IIS server just use index.html.


Sample application has two parts: 
* Obtaining access token for the service from Azure AD, 
* Using the token to call Azure API for FHIR and obtaining the list of patients.



## Create a skeleton of our web app

We will use a Node.js express app to serve a index.html page that contains JS code that authenticates to Azure AD and obtains the token for the Azure API for FHIR endpoint and then list the patients in a nice table format.

Index.js should look something like this

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

and corresponding package.json

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

Skeleton of index.html should look like this

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

## Obtain access token for the service

This step of the process is part of normal Azure AD authentication flow. There are many samples in Azure AD documentation library. 
Here we will use a sample JS code to authenticate to Azure AD and obtain the token for our App.

first we configure MSAL library and Azure AD configuration. 

> [!NOTE]
> In a real world scenario, store the initialization information in a separate file. Don't hard-code the information.

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

Now we add a method that we will call when the user clicks the sign-in button. We will call the MSAL library to obtain the token for our APP and later pass it to the FHIR server calling API to list all the patients.

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

The last step is to call the FHIR server and pass the token in the Authorization header 

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

If you are using Node.js:

1. To start the server, run the following command from the project directory:

    ```bash
        npm install
        node server.js
    ```

2. Open a web browser and go to http://localhost:30662/.
3. Select Sign In to start the sign-in, and then call Azure API for FHIR.

After you sign in, you should see all the patient resources listed.
