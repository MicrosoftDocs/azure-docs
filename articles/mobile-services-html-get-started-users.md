<properties 
	pageTitle="Get started with authentication (HTML 5) | Mobile Dev Center" 
	description="Learn how to use Mobile Services to authenticate users of your HTML app through a variety of identity providers, including Google, Facebook, Twitter, and Microsoft." 
	services="mobile-services" 
	documentationCenter="" 
	authors="ggailey777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="javascript" 
	ms.topic="article" 
	ms.date="02/15/2015" 
	ms.author="glenga"/>

# Add authentication to your Mobile Services app 

[AZURE.INCLUDE [mobile-services-selector-get-started-users](../includes/mobile-services-selector-get-started-users.md)]

This topic shows you how to authenticate users in Azure Mobile Services from your HTML app, including PhoneGap or Cordova apps.  In this tutorial, you add authentication to the quickstart project using an identity provider that is supported by Mobile Services. After being successfully authenticated and authorized by Mobile Services, the user ID value is displayed.  

This tutorial walks you through these basic steps to enable authentication in your app:

1. [Register your app for authentication and configure Mobile Services]
2. [Restrict table permissions to authenticated users]
3. [Add authentication to the app]

This tutorial is based on the Mobile Services quickstart. You must also first complete the tutorial [Get started with Mobile Services]. 

##<a name="register"></a>Register your app for authentication and configure Mobile Services

[AZURE.INCLUDE [mobile-services-register-authentication](../includes/mobile-services-register-authentication.md)] 

##<a name="permissions"></a>Restrict permissions to authenticated users

[AZURE.INCLUDE [mobile-services-restrict-permissions-javascript-backend](../includes/mobile-services-restrict-permissions-javascript-backend.md)] 


3. In the app directory, launch one of the following command files from the **server** subfolder.

	+ **launch-windows** (Windows computers) 
	+ **launch-mac.command** (Mac OS X computers)
	+ **launch-linux.sh** (Linux computers)

	>[AZURE.NOTE]On a Windows computer, type `R` when PowerShell asks you to confirm that you want to run the script. Your web browser might warn you to not run the script because it was downloaded from the internet. When this happens, you must request that the browser proceed to load the script.

	This starts a web server on your local computer to host the new app.

2. Open the URL <a href="http://localhost:8000/" target="_blank">http://localhost:8000/</a> in a web browser to start the app. 

	The data fails to load. This happens because the app attempts to access Mobile Services as an unauthenticated user, but the _TodoItem_ table now requires authentication.

3. (Optional) Open the script debugger for your web browser and reload the page. Verify that an access denied error occurs. 

Next, you will update the app to allow authentication before requesting resources from the mobile service.

##<a name="add-authentication"></a>Add authentication to the app

>[AZURE.NOTE]Because the login is performed in a popup, you should invoke the <strong>login</strong> method from a button's click event. Otherwise, many browsers will suppress the login window.

1. Open the project file index.html, locate the H1 element and under it add the following code snippet:

	    <div id="logged-in">
            You are logged in as <span id="login-name"></span>.
            <button id="log-out">Log out</button>
        </div>
        <div id="logged-out">
            You are not logged in.
            <button>Log in</button>
        </div>

	This enables you to login to Mobile Services from the page.

2. In the app.js file, locate the line of code at the very bottom of the file that calls to the refreshTodoItems function, and replace it with the following code: 
	
		function refreshAuthDisplay() {
			var isLoggedIn = client.currentUser !== null;
			$("#logged-in").toggle(isLoggedIn);
			$("#logged-out").toggle(!isLoggedIn);

			if (isLoggedIn) {
				$("#login-name").text(client.currentUser.userId);
				refreshTodoItems();
			}
		}

		function logIn() {
			client.login("facebook").then(refreshAuthDisplay, function(error){
				alert(error);
			});
		}

		function logOut() {
			client.logout();
			refreshAuthDisplay();
			$('#summary').html('<strong>You must login to access data.</strong>');
		}

		// On page init, fetch the data and set up event handlers
		$(function () {
			refreshAuthDisplay();
			$('#summary').html('<strong>You must login to access data.</strong>');		    
			$("#logged-out button").click(logIn);
			$("#logged-in button").click(logOut);
		});

    This creates a set of functions to handle the authentication process. The user is authenticated by using a Facebook login. If you are using an identity provider other than Facebook, change the value passed to the <strong>login</strong> method above to one of the following: <em>microsoftaccount</em>, <em>facebook</em>, <em>twitter</em>, <em>google</em>, or <em>aad</em>.

	>[AZURE.IMPORTANT]In a PhoneGap app, you must also add the following plugins to the project:
	><ul><li><code>phonegap plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git</code></li>
	><li><code>phonegap plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git</code></li></ul>

9. Go back to the browser where your app is running, and refresh the page. 

	   When you are successfully logged-in, the app should run without errors, and you should be able to query Mobile Services and make updates to data.

	>[AZURE.NOTE]When you use Internet Explorer, you may receive the error after login: <code>Cannot reach window opener. It may be on a different Internet Explorer zone</code>. This occurs because the pop-up runs in a different security zone (internet) from localhost (intranet). This only affects apps during development using localhost. As a workaround, open the <strong>Security</strong> tab of <strong>Internet Options</strong>, click <strong>Local Intranet</strong>, click <strong>Sites</strong>, and disable <strong>Automatically detect intranet network</strong>. Remember to change this setting back when you are done testing.

## <a name="next-steps"> </a>Next steps

In the next tutorial, [Authorize users with scripts], you will take the user ID value provided by Mobile Services based on an authenticated user and use it to filter the data returned by Mobile Services. Learn more about how to use Mobile Services with HTML/JavaScript in [Mobile Services HTML/JavaScript How-to Conceptual Reference]

<!-- Anchors. -->
[Register your app for authentication and configure Mobile Services]: #register
[Restrict table permissions to authenticated users]: #permissions
[Add authentication to the app]: #add-authentication
[Next Steps]:#next-steps

<!-- Images. -->

[4]: ./media/mobile-services-html-get-started-users/mobile-services-selection.png
[5]: ./media/mobile-services-html-get-started-users/mobile-service-uri.png
[13]: ./media/mobile-services-html-get-started-users/mobile-identity-tab.png
[14]: ./media/mobile-services-html-get-started-users/mobile-portal-data-tables.png
[15]: ./media/mobile-services-html-get-started-users/mobile-portal-change-table-perms.png

<!-- URLs. -->
[Get started with Mobile Services]: mobile-services-html-get-started.md
[Get started with data]: mobile-services-html-get-started-data.md
[Authorize users with scripts]: mobile-services-javascript-backend-service-side-authorization.md

[Azure Management Portal]: https://manage.windowsazure.com/
[Mobile Services HTML/JavaScript How-to Conceptual Reference]: /documentation/articles/mobile-services-html-how-to-use-client-library
