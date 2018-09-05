
## Register your application

There are multiple ways to create an application, please select one of them:

### Option 1: Register your application (Express mode)
Now you need to register your application in the *Microsoft Application Registration Portal*:

1.	Register your application via the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app?appType=singlePageApp&appTech=javascriptSpa&step=configure)
2.	Enter a name for your application and your email
3.	Make sure the option for *Guided Setup* is checked
4.	Follow the instructions to obtain the application ID and paste it into your code

### Option 2: Register your application (Advanced mode)

1. Go to the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app) to register an application
2. Enter a name for your application and your email 
3. Make sure the option for *Guided Setup* is unchecked
4.	Click `Add Platform`, then select `Web`
5. Add the `Redirect URL` that correspond to the application's URL based on your web server. See the sections below for instructions on how to set/ obtain the redirect URL in Visual Studio and Python.
6. Click *Save*

> #### Visual Studio instructions for obtaining redirect URL
> Follow the instructions to obtain your redirect URL:
> 1.	In *Solution Explorer*, select the project and look at the `Properties` window (if you don’t see a Properties window, press `F4`)
> 2.	Copy the value from `URL` to the clipboard:<br/> ![Project properties](media/active-directory-develop-guidedsetup-javascriptspa-configure/vs-project-properties-screenshot.png)<br />
> 3.	Switch back to the *Application Registration Portal* and paste the value as a `Redirect URL` and click 'Save'

<p/>

> #### Setting Redirect URL for Python
> For Python, you can set the web server port via command line. This guided setup uses the port 8080 for reference but feel free to use any other port available. In any case, follow the instructions below to set up a redirect URL in the application registration information:<br/>
> - Switch back to the *Application Registration Portal* and set `http://localhost:8080/` as a `Redirect URL`, or use `http://localhost:[port]/` if you are using a custom TCP port (where *[port]* is the custom TCP port number) and click 'Save'


#### Configure your JavaScript SPA

1.	Create a file named `msalconfig.js` containing the application registration information. If you are using Visual Studio, select the project (project root folder), right-click and select: `Add` > `New Item` > `JavaScript File`. Name it `msalconfig.js`
2.	Add the following code to your `msalconfig.js` file:

```javascript
var msalconfig = {
    clientID: "Enter_the_Application_Id_here",
    redirectUri: location.origin
};
```
<ol start="3">
<li>
Replace <code>Enter_the_Application_Id_here</code> with the Application Id you just registered 
</li>
</ol>
