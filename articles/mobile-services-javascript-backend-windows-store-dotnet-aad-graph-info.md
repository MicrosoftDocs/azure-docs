<properties 
	pageTitle="Accessing Azure Active Directory Graph Information (Windows Store) | Mobile Dev Center" 
	description="Learn how to access Azure Active Directory information using the Graph API in your Windows Store application." 
	documentationCenter="windows" 
	authors="wesmc7777" 
	manager="dwrede" 
	editor="" 
	services="mobile-services"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="multiple" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/23/2015" 
	ms.author="wesmc"/>

# Accessing Azure Active Directory Graph Information


[AZURE.INCLUDE [mobile-services-selector-aad-graph](../includes/mobile-services-selector-aad-graph.md)]
##Overview

Like the other identity providers offered with Mobile Services, the Azure Active Directory (AAD) provider also supports a rich Graph API which can be used for programmatic access to the directory. In this tutorial you update the ToDoList app to personalize the authenticated user’s app experience returning additional user information you retrieve from the directory using the [Graph REST API].

For more information on the Azure AD Graph API, see the [Azure Active Directory Graph Team Blog]. 

>[AZURE.NOTE] The intent of this tutorial is to extend your knowledge of authentication with the Azure Active Directory. It is expected that you have completed the [Add Authentication to your app] tutorial using the Azure Active Directory authentication provider. This tutorial continues to update the TodoItem application used in the [Add Authentication to your app] tutorial.



##Prerequisites 

Before you start this tutorial, you must have already completed these Mobile Services tutorials:

+ [Add Authentication to your app]<br/>Adds a login requirement to the TodoList sample app.

+ [Custom API Tutorial]<br/>Demonstrates how to call a custom API. 



##Generate an access key for the App registration in AAD


During the [Add Authentication to your app] tutorial, you created a registration for the integrated application when you completed the [Register to use an Azure Active Directory Login] step. In this section you generate a key to be used when reading directory information with that integrated application's client ID. 

[AZURE.INCLUDE [mobile-services-generate-aad-app-registration-access-key](../includes/mobile-services-generate-aad-app-registration-access-key.md)]



##Create a GetUserInfo custom API

In this section, you will create the GetUserInfo custom API that will use the [Graph REST API] to retrieve additional information about the user from the AAD.

If you've never used custom APIs with Mobile Services, you should consider reviewing the [Custom API Tutorial] before completing this section.

1. In the [Azure Management Portal], create the new GetUserInfo custom API for your mobile service and set permissions for the get method to **Only Authenticated Users**.

    ![][0]

2. Open the script editor for the new GetUserInfo API and that the following variables to the top of the script.

        var appSettings = require('mobileservice-config').appSettings;
        var tenant_domain = appSettings.AAD_TENANT_DOMAIN;
        var clientID = appSettings.AAD_CLIENT_ID;
        var key = appSettings.AAD_CLIENT_KEY;



3. Add the following definition for the `getAADToken` function.

        function getAADToken(callback) {
            var req = require("request");
            var options = {
                url: "https://login.windows.net/" + tenant_domain + "/oauth2/token?api-version=1.0",
                method: 'POST',
                form: {
                    grant_type: "client_credentials",
                    resource: "https://graph.windows.net",
                    client_id: clientID,
                    client_secret: key
                }
            };
            req(options, function (err, resp, body) {
                if (err || resp.statusCode !== 200) callback(err, null);
                else callback(null, JSON.parse(body).access_token);
            });
        }

    Given the *tenant_domain*, integrated application *client id*, and application *key*, this function provides a Graph access token used for reading directory information.

4. Add the following `getUser` function which uses the Graph API to return the user's information.

        function getUser(access_token, objectId, callback) {
            var req = require("request");
            var options = {
                url: "https://graph.windows.net/" + tenant_domain + "/users/" + objectId + "?api-version=1.0",
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + access_token
                }
            };
            req(options, function (err, resp, body) {
                if (err || resp.statusCode !== 200) callback(err, null);
                else callback(null, JSON.parse(body));
            });
        };

    This function is a thin wrapper around the [Get User] endpoint of the Graph REST API. It uses the Graph access token to get the user information using the user's object ID.

5. Update the exported `get` method as follows to return user information using the other functions.

        exports.get = function (request, response) {
            if (request.user.level == 'anonymous') {
                response.send(statusCodes.UNAUTHORIZED, null);
                return;
            }
            var errorHandler = function (err) {
                console.log(err);
                response.send(statusCodes.INTERNAL_SERVER_ERROR, err);
            };
            request.user.getIdentities({
                success: function (identities) {
                    var objectId = identities.aad.oid;
                    getAADToken(function (err, access_token) {
                        if (err) errorHandler(err);
                        else getUser(access_token, objectId, function (err, user_info) {
                            if (err) errorHandler(err);
                            else {
                                console.log('GetUserInfo: ' + JSON.stringify(user_info, null, 4));
                                response.send(statusCodes.OK, user_info);
                              }
                            });
                    });
                },
                error: errorHandler
            });
        };


##Update the app to use GetUserInfo


In this section you will update the `AuthenticateAsync` method you implemented in the [Get Started with Authentication] tutorial to call the custom API and return additional information about the user from the AAD. 

[AZURE.INCLUDE [mobile-services-aad-graph-info-update-app](../includes/mobile-services-aad-graph-info-update-app.md)]


 


##Test the app

[AZURE.INCLUDE [mobile-services-aad-graph-info-test-app](../includes/mobile-services-aad-graph-info-test-app.md)]




##Next steps

In the next tutorial, [Role based access control with the AAD in Mobile Services], you will use role based access control with the Azure Active Directory (AAD) to check group membership before allowing access. 



<!-- Images -->
[0]: ./media/mobile-services-javascript-backend-windows-store-dotnet-aad-graph-info/create-getuserinfo.png


<!-- URLs. -->
[Add Authentication to your app]: mobile-services-windows-store-dotnet-get-started-users.md
[How to Register with the Azure Active Directory]: mobile-services-how-to-register-active-directory-authentication.md
[Azure Management Portal]: https://manage.windowsazure.com/
[Custom API Tutorial]: mobile-services-windows-store-dotnet-call-custom-api.md
[Store Server Scripts]: mobile-services-store-scripts-source-control.md
[Register to use an Azure Active Directory Login]: mobile-services-how-to-register-active-directory-authentication.md
[Graph API]: http://msdn.microsoft.com/library/azure/hh974478.aspx
[Graph REST API]: http://msdn.microsoft.com/library/azure/hh974478.aspx
[Get User]: http://msdn.microsoft.com/library/azure/dn151678.aspx
[Role based access control with the AAD in Mobile Services]: mobile-services-javascript-backend-windows-store-dotnet-aad-rbac.md
[Azure Active Directory Graph Team Blog]: http://go.microsoft.com/fwlink/?LinkId=510536