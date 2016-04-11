<properties
	pageTitle="Azure AD .NET Protocol Overview | Microsoft Azure"
	description="How to use HTTP messages to authorize access to web applications and web APIs in yoru tenant using Azure AD."
	services="active-directory"
	documentationCenter=".net"
	authors="priyamohanram"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="01/21/2016"
	ms.author="priyamo"/>

# Request an authorization code

The authorization code flow begins with the client directing the user to the `authorize` endpoint. In this request, the client indicates the permissions it needs to acquire from the user. You can get the OAuth 2.0 token endpoint from your application's page in Azure Management Portal, in the **View Endpoints** button in the bottom drawer.

```
// Line breaks for legibility only

https://login.microsoftonline.com/{tenant}/oauth2/authorize?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&response_type=code
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
&response_mode=query
&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read
&state=12345
```

For detailed description of the parameters, please see the [reference](active-directory-protocols-reference.md).

[AZURE.TIP] If the user is part of an organization, an administrator of the organization can consent or decline on the user's behalf, or permit the user to consent. The user is given the option to consent only when the administrator permits it.

At this point, the user will be asked to enter their credentials and consent to the permissions indicated in the `scope` query parameter. Once the user authenticates and grants consent, Azure AD sends a response to your app at the `redirect_uri` address in your request.

## Successful response

A successful response could look like this:
```
http://localhost:12345/?
code=AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrqqf_ZT_p5uEAEJJ_nZ3UmphWygRNy2C3jJ239gV_DBnZ2syeg95Ki-374WHUP-i3yIhv5i-7KU2CEoPXwURQp6IVYMw-DjAOzn7C3JCu5wpngXmbZKtJdWmiBzHpcO2aICJPu1KvJrDLDP20chJBXzVYJtkfjviLNNW7l7Y3ydcHDsBRKZc3GuMQanmcghXPyoDg41g8XbwPudVh7uCmUponBQpIhbuffFP_tbV8SNzsPoFz9CLpBCZagJVXeqWoYMPe2dSsPiLO9Alf_YIe5zpi-zY4C3aLw5g9at35eZTfNd0gBRpR5ojkMIcZZ6IgAA
&state=12345
&session_state=733ad279-b681-49c3-9215-951abf94d2c5
```

For detailed description of the parameters, please see the [reference](active-directory-protocols-reference.md).

If a state parameter was included in the request, the same value appears in the response. It's good practice for the application to verify that the state values in the request and response are identical.  
## Error response

Error responses may also be sent to the `redirect_uri` so that the application can handle them appropriately.

```
GET http://localhost:12345/?
error=access_denied
&error_description=the+user+canceled+the+authentication
```
For detailed description of the errors, please see the [reference](active-directory-protocols-reference.md).
