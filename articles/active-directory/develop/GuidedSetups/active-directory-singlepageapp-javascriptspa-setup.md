
## Setting up your Web Server or Project

> Prefer to download this sample's Visual Studio project instead? [Download a project](https://github.com/Azure-Samples/active-directory-javascript-graphapi-v2/archive/master.zip) and skip to the [Configuration step](#create-an-application-express) to configure the code sample before executing.

## Pre-requisites
A local web server such as [http-server](https://www.npmjs.com/package/http-server/), [Node.js](https://nodejs.org/en/download/), [.NET Core](https://www.microsoft.com/net/core), or IIS Express integration with [Visual Studio 2017](https://www.visualstudio.com/downloads/) is required to run this guided setup. 

Instructions in this guide are based on Visual Studio 2017, but feel free to use any other development environment or HTML/JavaScript editor.


## Create your project (Visual Studio only)

If you are using Visual Studio and are creating a new project, follow the steps below to create a new Visual Studio solution:
1.	In Visual Studio:  `File` > `New` > `Project`
2.	Under `Visual C#\Web`, select `ASP.NET Web Application (.NET Framework)`
3.	Name your application and click *OK*
4.	Under `New ASP.NET Web Application`, select `Empty`


## Create your single page application’s UI
1.	Create an index.html file for your JavaScript SPA. If you are using Visual Studio, select the project (project root folder), right click and select: `Add` > `New Item` > `HTML page` and name it index.html
2.	Add the following code to your page:
```html
<!DOCTYPE html>
<html>
    <head>
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
        <title>JavaScript SPA Guided Setup</title>
    </head>
    <body style="margin: 40px">
        <button id="callGraphButton" type="button" class="btn btn-primary" onclick="callGraphAPI()">Call Microsoft Graph API</button>
        <div id="errorMessage" class="text-danger"></div>
        <div class="hidden">
            <h3>Graph API Call Response</h3>
            <pre class="well" id="graphResponse"></pre>
        </div>
        <div class="hidden">
            <h3>Access Token</h3>
            <pre class="well" id="accessToken"></pre>
        </div>
        <div class="hidden">
            <h3>ID Token Claims</h3>
            <pre class="well" id="userInfo"></pre>
        </div>
        <button id="signOutButton" type="button" class="btn btn-primary hidden" onclick="signOut()">Sign out</button>

        <script src="//secure.aadcdn.microsoftonline-p.com/lib/0.1.1/js/msal.min.js"></script>
        <script type="text/javascript" src="msalconfig.js"></script>
    
        <!-- The 'bluebird' and 'fetch' references below are required if you need to run this application on Internet Explorer -->
        <script src="//cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js"></script>
    </body>
</html>
````
