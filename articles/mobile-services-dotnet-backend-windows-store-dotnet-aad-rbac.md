
<properties linkid="develop-mobile-tutorials-dotnet-rbac-with-aad" urlDisplayName="Role Based Access Control with Azure Active Directory" pageTitle="Role Based Access Control in Mobile Services and Azure Active Directory (Windows Store) | Mobile Dev Center" metaKeywords="" description="Learn how to control access based on Azure Active Directory roles in your Windows Store application." metaCanonical="" disqusComments="1" umbracoNaviHide="1" documentationCenter="Mobile" title="Role Based Access Control in Mobile Services and Azure Active Directory" authors="wesmc" />

# Role Based Access Control in Mobile Services and Azure Active Directory

<div class="dev-center-tutorial-selector sublanding">
    <a href="/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-aad-rbac/" title="Windows Store C#" class="current">Windows Store C#</a>
</div>

<div class="dev-center-tutorial-subselector">
	<a href="/en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-aad-rbac/" title=".NET backend" class="current">.NET backend</a> | 
	<a href="/en-us/documentation/articles/mobile-services-javascript-backend-windows-store-dotnet-aad-rbac/" title="JavaScript backend">JavaScript backend</a>
</div>


Roles-based access control (RBAC) is the practice of assigning permissions to roles that your users can hold, nicely defining boundaries on what certain classes of users can and cannot do. This tutorial will walk you through how to add basic RBAC to Azure Mobile Services.

This tutorial will demonstrate role based access control checking each user's membership to a Sales group defined in the Azure Active Directory (AAD). The access check will be done with .NET mobile service backend using the [Graph API] for Azure Active Directory.


>[WACOM.NOTE] The intent of this tutorial is to extend your knowledge of authentication to include authorization practices. It is expected that you first complete the [Get Started with Authentication] tutorial using the Azure Active Directory authentication provider. This tutorial continues to update the TodoItem application used in the [Get Started with Authentication] tutorial.

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

In this section you add two new users to your directory along with the new Sales group. One of the users will be granted membership to the sales group. The other user will not be granted membership to the group. 

### Create the users


1. In the [Azure Management Portal] navigate to the directory that you previously configured for authentication when you completed the [Get Started with Authentication] tutorial.
2. Click **Users** at the top of the page. Then click the **Add User** button at the bottom. 
3. Complete the new user dialogs creating to create a user named **Bob**. Note the temporary password for the user. 
4. Create another user named **Dave**. Note the temporary password for the user.
5. The new users should look similar to what is shown below.

    ![][0]    


### Create the Sales group


1. On the directory page, click **Groups** at the top of the page. Then click the **Add Group** button at the bottom. 
2. Enter **Sales** for the name of the group and press the complete button on the dialog to create the group. 

    ![][2]

### Add user membership to the Sales group.


1. Click **Groups** at the top of the directory page. Then click the **Sales** group to go to the sales group page. 
2. On the Sales group page, click **Add Members**. Add the user named **Bob** to the sales group. The user named **Dave** should not be a member of the group.

    ![][1]

3. On the Sales group page, click **Configure**, then copy the **Object ID** for the sales group. Note this value as you will use this to replace `<YOUR-SALES-GROUP-ID>` in a shared script later.

    ![][5]


## <a name="generate-key"></a>Generate a key for the Integrated Application


During the [Get Started with Authentication] tutorial, you created a registration for the integrated application when you completed the [Register to use an Azure Active Directory Login] step. In this section you generate a key to be used when reading directory information with that integrated application's client ID. 

1. Click **Applications** tab on your directory page in the [Azure Management Portal].
  
2. Click your integrated application registration.

3. Click **Configure** on the application page and scroll down the the **keys** section of the page. 
4. Click **1 year** duration for a new key. Then click **Save** and the portal will display your new key value.
5. Copy the **Client ID** and **Key** shown after you save. You will use these values later to replace the `<YOUR-CLIENT-ID>` and `<YOUR-SECRET-KEY>` placeholders in a shared script later. Note that the key value will only be shown to you a single time after you have saved. 

    ![][6]


## <a name="add-shared-script"></a>Add a shared script to the mobile service that checks membership

In this section you will use Git to deploy a shared script file named *rbac.js* to your mobile service. This shared script file will contain the functions that use the [Graph API] to check the group membership of the user. 

If you are not familiar with deploying scripts to your mobile service with Git, please review the [Store Server Scripts] tutorial before completing this section.

1. Create a new script file named *rbac.js* in the *./service/shared/* directory of the local repository for your mobile service.
2. Add the following script to the top of the file that defines the `getAADToken` function.

        var tenant_domain = "<YOUR-TENANT-DOMAIN>";
        var clientID = "<YOUR-CLIENT-ID>";
        var key = "<YOUR-SECRET-KEY>";
        exports.SalesGroup = "<YOUR-SALES-GROUP-ID>";

 
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

3. In the *rbac.js* script, Replace `<YOUR-TENANT-DOMAIN>` with your tenant domain name in your directory. This will be similar to *mydomain.onmicrosoft.com*. You can see the domain name on the users page of your directory.


4. In the *rbac.js* script, Replace `<YOUR-CLIENT-ID>` and `<YOUR-SECRET-KEY>` with the values you noted in the [Generate a key for the Integrated Application] section.

5. In the *rbac.js* script, Replace `<YOUR-SALES-GROUP-ID>` with the group ID you noted in the [Create a Sales group with membership] section.
    

6. Add the following code to *rbac.js* to define the `isMemberOf` function that calls the [IsMemberOf] endpoint of the Graph REST API.

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

    This function is a thin wrapper around the [IsMemberOf] endpoint of the Graph REST API. It uses the Graph access token to check if the user's directory object ID is part of the group based on the group ID.

7. Add the exported `checkGroupMembership` function.  **ToDo: The token should be cached in this snippet, no need to retrieve it each time**.

        exports.checkGroupMembership = function (user, groupID, callback) {
            user.getIdentities({
                success: function (identities) {
                    var objectId = identities.aad.oid;
                    getAADToken(function (err, access_token) {
                        if (err) callback(err);
                        else isMemberOf(access_token, objectId, groupID, function (err, isInGroup) {
                            if (err) errorHandler(err);
                            else callback(null, isInGroup);
                        });
                    });
                },
                error: callback
            });
        }

    This function wraps the use of the other script functions and is exported from the shared script to be called by other scripts to perform the actual access checks. Given the mobile service user object, and the group id, the script will retrieve the Azure Active Directory object id for the user's identity and verify membership to the group.

## <a name="add-access-checking"></a>Add role based access checking to the database operations


When you completed the [Get Started with Authentication] tutorial, you should have already set the table operations to require authentication as shown below.

![][3]

With each database operation requiring authentication, we can add scripts that use the user object for access checks.

The following steps demonstrate how to deploy role based access control using scripts to each table operation in your mobile service. A script, that uses the shared *rbac.js* script, is executed for each table operation.

1. Add a new script file named *todoitem.insert.js* to the *./service/table/* directory in the local Git repository for your mobile service. Paste the following script into that file.

        function insert(item, user, request) {
        
            var RBAC = require('../shared/rbac.js');
        
            RBAC.checkGroupMembership(user, RBAC.SalesGroup, function(err, isInGroup) {
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
        
            RBAC.checkGroupMembership(user, RBAC.SalesGroup, function(err, isInGroup) {
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
        
            RBAC.checkGroupMembership(user, RBAC.SalesGroup, function(err, isInGroup) {
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
        
            RBAC.checkGroupMembership(user, RBAC.SalesGroup, function(err, isInGroup) {
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

1. In Visual Studio,run the client app and attempt to authenticate with the user account we created named Dave. 

    ![][7]

2. Dave doesn't have membership to the Sales group. So the role based access check will denied access to the table operations. Close the client app.

    ![][8]

3. In Visual Studio, run the client app again. This time authenticate with the user account we created named Bob.

    ![][9]

4. Bob does have membership to the Sales group. So the role based access check will allow access to the table operations.

    ![][10]




<!-- Anchors. -->
[Create a Sales group with membership]: #create-group
[Generate a key for the Integrated Application]: #generate-key
[Add a shared script that checks membership]: #add-shared-script
[Add role based access checking to the database operations]: #add-access-checking
[Test client access]: #test-client


<!-- Images -->
[0]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-aad-rbac/users.png
[1]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-aad-rbac/group-membership.png
[2]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-aad-rbac/sales-group.png
[3]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-aad-rbac/table-perms.png
[4]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-aad-rbac/insert-table-op-view.png
[5]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-aad-rbac/sales-group-id.png
[6]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-aad-rbac/client-id-and-key.png
[7]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-aad-rbac/dave-login.png
[8]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-aad-rbac/unauthorized.png
[9]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-aad-rbac/bob-login.png
[10]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-aad-rbac/success.png

<!-- URLs. -->
[Get Started with Authentication]: /en-us/documentation/articles/mobile-services-windows-store-dotnet-get-started-users/
[How to Register with the Azure Active Directory]: /en-us/documentation/articles/mobile-services-how-to-register-active-directory-authentication/
[Azure Management Portal]: https://manage.windowsazure.com/
[Directory Sync Scenarios]: http://msdn.microsoft.com/library/azure/jj573653.aspx
[Store Server Scripts]: /en-us/documentation/articles/mobile-services-store-scripts-source-control/
[Register to use an Azure Active Directory Login]: /en-us/documentation/articles/mobile-services-how-to-register-active-directory-authentication/
[Graph API]: http://msdn.microsoft.com/library/azure/hh974478.aspx
[IsMemberOf]: http://msdn.microsoft.com/en-us/library/azure/dn151601.aspx