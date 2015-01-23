<properties pageTitle="Role Based Access Control in Mobile Services and Azure Active Directory (Windows Store) | Mobile Dev Center" description="Learn how to control access based on Azure Active Directory roles in your Windows Store application." documentationCenter="windows" authors="wesmc7777" manager="dwrede" editor="" services=""/>

<tags ms.service="mobile-services" ms.workload="mobile" ms.tgt_pltfrm="mobile-windows-store" ms.devlang="dotnet" ms.topic="article" ms.date="09/29/2014" ms.author="wesmc"/>

# Role Based Access Control in Mobile Services and Azure Active Directory

[WACOM.INCLUDE [mobile-services-selector-rbac](../includes/mobile-services-selector-rbac.md)]


Roles-based access control (RBAC) is the practice of assigning permissions to roles that your users can hold, nicely defining boundaries on what certain classes of users can and cannot do. This tutorial will walk you through how to add basic RBAC to Azure Mobile Services.

This tutorial will demonstrate role based access control, checking each user's membership to a Sales group defined in the Azure Active Directory (AAD). The access check will be done with JavaScript in the mobile service backend using the [Graph API] for Azure Active Directory. Only users who belong to the Sales role will be allowed to query the data.


>[AZURE.NOTE] The intent of this tutorial is to extend your knowledge of authentication to include authorization practices. It is expected that you first complete the [Get Started with Authentication] tutorial using the Azure Active Directory authentication provider. This tutorial continues to update the TodoItem application used in the [Get Started with Authentication] tutorial.

This tutorial walks you through the following steps:

1. [Create a Sales group with membership]
2. [Generate a key for the Integrated Application]
3. [Add a shared script that checks membership] 
4. [Add role based access checking to the database operations]
5. [Test client access]

This tutorial requires the following:

* Visual Studio 2013 running on Windows 8.1.
* Completion of the [Get Started with Authentication] tutorial using the Azure Active Directory authentication provider.
* Completion of the [Store Server Scripts] tutorial to be familiar with using a Git repository to store server scripts.
 


## <a name="create-group"></a>Create a Sales group with membership

[WACOM.INCLUDE [mobile-services-aad-rbac-create-sales-group](../includes/mobile-services-aad-rbac-create-sales-group.md)]


## <a name="generate-key"></a>Generate a key for the Integrated Application


During the [Get Started with Authentication] tutorial, you created a registration for the integrated application when you completed the [Register to use an Azure Active Directory Login] step. In this section you generate a key to be used when reading directory information with that integrated application's client ID. 

[WACOM.INCLUDE [mobile-services-generate-aad-app-registration-access-key](../includes/mobile-services-generate-aad-app-registration-access-key.md)]





## <a name="add-shared-script"></a>Add a shared script to the mobile service that checks membership

In this section you will use Git to deploy a shared script file named *rbac.js* to your mobile service. This shared script file will contain the functions that use the [Graph API] to check the group membership of the user. 

If you are not familiar with deploying scripts to your mobile service with Git, please review the [Store Server Scripts] tutorial before completing this section.

1. Create a new script file named *rbac.js* in the *./service/shared/* directory of the local repository for your mobile service.
2. Add the following script to the top of the file that defines the `getAADToken` function. Given the *tenant_domain*, integrated application *client id*, and application *key*, this function provides a Graph access token used for reading directory information.

    >[AZURE.NOTE] You should cache the token instead of creating a new one with each access check. Then refresh the cache when attempts to use the token result in a 401 Authentication_ExpiredToken response as noted in the [Graph API Error Reference]. This isn't demonstrated in the code below for simplicity sake but, it will alleviate extra network traffic against your Active Directory. 

        var appSettings = require('mobileservice-config').appSettings;
        var tenant_domain = appSettings.AAD_TENANT_DOMAIN;
        var clientID = appSettings.AAD_CLIENT_ID;
        var key = appSettings.AAD_CLIENT_KEY;
        exports.SalesGroup = appSettings.AAD_GROUP_ID;
         
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


3. Add the following code to *rbac.js* to define the `getGroupId` function. This function uses the access token to get the group id based on the group name used in a filter.
 
    >[AZURE.NOTE] This code looks up the Active Directory group by name. In many cases it may be a better practice to store the group id as a mobile service app setting and just use that group id. This is because the group name may change but, the id stays the same. However, with a group name change there is usually at least a change in the scope of the role that may also require an update to the mobile service code.   

        function getGroupId(groupname, accessToken, callback) {
            var req = require("request");
            var options = {
                url: "https://graph.windows.net/" + tenant_domain + "/groups" + 
                      "?$filter=displayName%20eq%20'" + groupname + "'" + 
	              "&api-version=2013-04-05" ,
                method: 'GET',
                headers: {
                    "Authorization": "Bearer " + accessToken,
                    "Content-Type": "application/json",
                }
            };
            req(options, function (err, resp, body) {
                if (err || resp.statusCode !== 200) callback(err, null);
                else callback(null, JSON.parse(body).value[0].objectId);
            });
        }


4. Add the following code to *rbac.js* to define the `isMemberOf` function that calls the [IsMemberOf] endpoint of the Graph REST API.

    This function is a thin wrapper around the [IsMemberOf] endpoint of the Graph REST API. It uses the Graph access token to check if the user's directory object id has membership in the group based on the group id.

        function isMemberOf(access_token, userObjectId, groupObjectId, callback) {
            var req = require("request");
            var options = {
                url: "https://graph.windows.net/" + tenant_domain + "/isMemberOf" + "?api-version=2013-04-05",
                method: 'POST',
                headers: {
                    "Authorization": "Bearer " + access_token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                "groupId": groupObjectId,
                "memberId": userObjectId
                })
            };
            req(options, function (err, resp, body) {
                if (err || resp.statusCode !== 200) callback(err, null);
                else callback(null, JSON.parse(body).value);
            });
        };

    

7. Add the following exported `checkGroupMembership` function to *rbac.js* .  

    This function wraps the use of the other script functions and is exported from the shared script to be called by other scripts to perform the actual access checks. Given the mobile service user object, and the group id, the script will retrieve the Azure Active Directory object id for the user's identity and verify membership to the group.

        exports.checkGroupMembership = function (user, groupName, callback) {
            user.getIdentities({
                success: function (identities) {
                    var objectId = identities.aad.oid;
                    getAADToken(function (err, access_token) {
                        if (err) callback(err);
		        else getGroupId(groupName, access_token, function (err, groupId) { 
                            if (err) callback(err);
                            else isMemberOf(access_token, objectId, groupId, function (err, isInGroup) {
       	                        if (err) errorHandler(err);
               	                else callback(null, isInGroup);
                            });
                        });
                    });
                },
                error: callback
            });
        }

8. Save your changes to *rbac.js*.

## <a name="add-access-checking"></a>Add role based access checking to the database operations


When you completed the [Get Started with Authentication] tutorial, you should have already set the table operations to require authentication as shown below.

![][3]

With each database operation requiring authentication, we can add scripts that use the user object for access checks.

The following steps demonstrate how to deploy role based access control using scripts to each table operation in your mobile service. A script, that uses the shared *rbac.js* script, is executed for each table operation.

1. Add a new script file named *todoitem.insert.js* to the *./service/table/* directory in the local Git repository for your mobile service. Paste the following script into that file.

        function insert(item, user, request) {
        
            var RBAC = require('../shared/rbac.js');
        
            RBAC.checkGroupMembership(user, "sales", function(err, isInGroup) {
                if (err) request.respond(err);
                else if (!isInGroup) request.respond(statusCodes.UNAUTHORIZED, null);
                else {
                    request.execute();
                }
            });
        }

2. Add a new script file named *todoitem.read.js* to the *./service/table/* directory in the local Git repository for your mobile service. Paste the following script into that file.

        function read(query, user, request) {
        
            var RBAC = require('../shared/rbac.js');
        
            RBAC.checkGroupMembership(user, "sales", function(err, isInGroup) {
                if (err) request.respond(err);
                else if (!isInGroup) request.respond(statusCodes.UNAUTHORIZED, null);
                else {
                    request.execute();
                }
            });
        }

3. Add a new script file named *todoitem.update.js* to the *./service/table/* directory in the local Git repository for your mobile service. Paste the following script into that file.

        function update(item, user, request) {
        
            var RBAC = require('../shared/rbac.js');
        
            RBAC.checkGroupMembership(user, "sales", function(err, isInGroup) {
                if (err) request.respond(err);
                else if (!isInGroup) request.respond(statusCodes.UNAUTHORIZED, null);
                else {
                    request.execute();
                }
            });
        }

4. Add a new script file named *todoitem.delete.js* to the *./service/table/* directory in the local Git repository for your mobile service. Paste the following script into that file.

        function del(id, user, request) {
        
            var RBAC = require('../shared/rbac.js');
        
            RBAC.checkGroupMembership(user, "sales", function(err, isInGroup) {
                if (err) request.respond(err);
                else if (!isInGroup) request.respond(statusCodes.UNAUTHORIZED, null);
                else {
                    request.execute();
                }
            });
        }

5. In the command-line interface to your Git repository, add tracking for the script files you added by executing the following command.

        git add .

6. In the command-line interface to your Git repository, commit the updates by executing the following command.

        git commit -m "Added role based access control to table operations"
  
7. In the command-line interface to your Git repository, deploy the updates to your local Git repository to the mobile service by executing the following command. This command assumes that you made the updates in the *master* branch.

        git push origin master

8. In the [Azure Management Portal] you should be able to navigate to the table operations for the mobile service and see the updates in place as shown below. 

    ![][4]

## <a name="test-client"></a>Test the client's access

[WACOM.INCLUDE [mobile-services-aad-rbac-test-app](../includes/mobile-services-aad-rbac-test-app.md)]





<!-- Anchors. -->
[Create a Sales group with membership]: #create-group
[Generate a key for the Integrated Application]: #generate-key
[Add a shared script that checks membership]: #add-shared-script
[Add role based access checking to the database operations]: #add-access-checking
[Test client access]: #test-client


<!-- Images -->
[0]: ./media/mobile-services-javascript-backend-windows-store-dotnet-aad-rbac/users.png
[1]: ./media/mobile-services-javascript-backend-windows-store-dotnet-aad-rbac/group-membership.png
[2]: ./media/mobile-services-javascript-backend-windows-store-dotnet-aad-rbac/sales-group.png
[3]: ./media/mobile-services-javascript-backend-windows-store-dotnet-aad-rbac/table-perms.png
[4]: ./media/mobile-services-javascript-backend-windows-store-dotnet-aad-rbac/insert-table-op-view.png
[5]: ./media/mobile-services-javascript-backend-windows-store-dotnet-aad-rbac/sales-group-id.png
[6]: ./media/mobile-services-javascript-backend-windows-store-dotnet-aad-rbac/client-id-and-key.png

<!-- URLs. -->
[Get Started with Authentication]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-users/
[How to Register with the Azure Active Directory]: /en-us/documentation/articles/mobile-services-how-to-register-active-directory-authentication/
[Azure Management Portal]: https://manage.windowsazure.com/
[Directory Sync Scenarios]: http://msdn.microsoft.com/library/azure/jj573653.aspx
[Store Server Scripts]: /en-us/documentation/articles/mobile-services-store-scripts-source-control/
[Register to use an Azure Active Directory Login]: /en-us/documentation/articles/mobile-services-how-to-register-active-directory-authentication/
[Graph API]: http://msdn.microsoft.com/library/azure/hh974478.aspx
[Graph API Error Reference]: http://msdn.microsoft.com/en-us/library/azure/hh974480.aspx
[IsMemberOf]: http://msdn.microsoft.com/en-us/library/azure/dn151601.aspx