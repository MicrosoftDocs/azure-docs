Most of the time authentication errors result from incorrect or inconsistent configuration settings. Here are some specific suggestions for things to check.

* Make sure that you didn't miss the **Save** button anywhere. This is often easy to do, and the result is that you'll be looking at the correct values on a portal page but they haven't actually been saved in the Azure environment or Azure AD application.
* For settings configured in the **Application Settings** blade of the Azure portal, make sure that the correct API app or web app was selected when the settings were entered.  Also make sure that the settings were entered as **App settings** and not **Connection strings**, as the format of the two sections is similar.
* For authentication to a JavaScript front end, download the manifest again to verify that `oauth2AllowImplicitFlow` was successfully changed to `true`.
* Verify that you used HTTPS wherever you configured URLs:

	* In project code
	* In CORS
	* In Azure environment App settings for each API app and web app
	* In Azure AD application settings.
	
	Note that if you copy an API app's URL from the portal, it often has `http://` and you have to manually change it to `https://`.

* Make sure that any code changes were successfully deployed. For example, in a multiple-project solution it's possible to change a project's code and accidentally choose one of the others when you intend to deploy the change.
* Make sure that you are going to HTTPS URLs in your browser, not HTTP URLs. By default, Visual Studio creates publish profiles with HTTP URLs, and that's what opens in the browser after you deploy a project.
* For authentication to a JavaScript front end, make sure that CORS is correctly configured on the API app that the JavaScript code calls. If in doubt about whether the problem is CORS-related, try "*" as the allowed origin URL. 
* For a JavaScript front end, open your browser's Developer Tools Console tab to get more error information, and examine HTTP requests on the Network. However, Console error messages may be misleading. If you get a message indicating a CORS error, the real issue may be authentication. You can check if this is the case by running the app with authentication temporarily temporarily disabled.
* For a .NET API app, make sure you are getting as much information in error messages as possible by setting [customErrors mode to Off](../app-service-web/web-sites-dotnet-troubleshoot-visual-studio.md#remoteview).
* For a .NET API app, start a [remote debugging session](../app-service-web/web-sites-dotnet-troubleshoot-visual-studio.md#remotedebug), and examine the values of the variables that are passed to code that uses ADAL to acquire a bearer token, or code that checks claims against the expected service principal ID. Note that your code can pick up configuration values from many different sources, so it's possible to find surprises this way. For example, if you mistype `ida:ClientId` as `ida:ClientID` when configuring Azure App Service environment settings, the code might get the `ida:ClientId` value that it's looking for from the Web.config file, ignoring the Azure App Service setting. 
* If things don't work in a normal Internet Explorer window, an existing log-in may be interfering; try InPrivate and try Chrome or Firefox.
