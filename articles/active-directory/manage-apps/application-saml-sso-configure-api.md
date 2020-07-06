---
title: Use Microsoft Graph APIs to configure SAML-based single sign-on
titleSuffix: Azure Active Directory
description: Need to set up SAML-based single sign-on for multiple instances of an application? Learn how to save time by using the Microsoft Graph APIs to automate the configuration of SAML-based single sign-on.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.date: 05/19/2020
ms.author: kenwith
ms.reviewer: luleon
---

# Automate SAML-based SSO app configuration with Microsoft Graph API

In this article, you'll learn how to create and configure an application from the Azure Active Directory (Azure AD) Gallery. This article uses AWS as an example but you can use the steps in this article for any SAML-based app in the Azure AD Gallery.

**Steps to use Microsoft Graph APIs to automate configuration of SAML-based single sign-on**

| Step  | Details  |
|---------|---------|
| [1. Create the gallery application](#step-1-create-the-gallery-application) | Sign in to the API client <br> Retrieve the gallery application <br> Create the gallery application|
| [2. Configure single sign-on](#step-2-configure-single-sign-on) | Retrieve app object ID and service principal object ID <br> Set single sign-on mode <br> Set basic SAML URLs such as identifier, reply URL, sign-on URL <br> Add app roles (Optional)|
| [3. Configure claims mapping](#step-3-configure-claims-mapping) | Create claims mapping policy <br> Assign claims mapping policy to service principal|
| [4. Configure signing certificate](#step-4-configure-signing-certificate) | Create a certificate <BR> Add a custom signing key <br> Activate the custom signing key|
| [5. Assign users](#step-5-assign-users) | Assign users and groups to the application
| [6. Configure the application side](#step-6-configure-the-application-side)| Get Azure AD SAML metadata

**List of all APIs used in the documentation**

Make sure you have the corresponding permissions to call the following APIs.

|Resource type |Method |
|---------|---------|
|[applicationTemplate](https://docs.microsoft.com/graph/api/resources/applicationtemplate?view=graph-rest-beta)|[List applicationTemplate](https://docs.microsoft.com/graph/api/applicationtemplate-list?view=graph-rest-beta&tabs=http) <br>[Instantiate applicationTemplate](https://docs.microsoft.com/graph/api/applicationtemplate-instantiate?view=graph-rest-beta&tabs=http)|
|[servicePrincipals](https://docs.microsoft.com/graph/api/resources/serviceprincipal?view=graph-rest-1.0)|[Update servicePrincipal](https://docs.microsoft.com/graph/api/serviceprincipal-update?view=graph-rest-1.0&tabs=http) <br> [Create appRoleAssignments](https://docs.microsoft.com/graph/api/serviceprincipal-post-approleassignments?view=graph-rest-1.0&tabs=http) <br> [Assign claimsMappingPolicies](https://docs.microsoft.com/graph/api/serviceprincipal-post-claimsmappingpolicies?view=graph-rest-beta&tabs=http)|
|[applications](https://docs.microsoft.com/graph/api/resources/application?view=graph-rest-1.0)|[Update application](https://docs.microsoft.com/graph/api/application-update?view=graph-rest-1.0&tabs=http)|
|[claimsMappingPolicy](https://docs.microsoft.com/graph/api/resources/claimsmappingpolicy?view=graph-rest-beta)| [Create claimsMappingPolicy](https://docs.microsoft.com/graph/api/claimsmappingpolicy-post-claimsmappingpolicies?view=graph-rest-beta&tabs=http)

>[!NOTE]
>The response objects shown in this article may be shortened for readability. All the properties will be returned from an actual call.

## Step 1: Create the gallery application

### Sign in to Microsoft Graph Explorer (recommended), Postman, or any other API client you use

1. Start [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)
2. Select **Sign-In with Microsoft** and sign in using an Azure AD global administrator or App Admin credentials.
3. Upon successful sign-in, you'll see the user account details in the left-hand pane.

### Retrieve the gallery application template identifier

Applications in the Azure AD application gallery each have an [application template](https://docs.microsoft.com/graph/api/applicationtemplate-list?view=graph-rest-beta&tabs=http) that describes the metadata for that application. Using this template, you can create an instance of the application and service principal in your tenant for management.

#### Request

<!-- {
  "blockType": "request",
  "name": "get_applicationtemplates"
}-->

```msgraph-interactive
GET https://graph.microsoft.com/beta/applicationTemplates
```

#### Response

<!-- {
  "blockType": "response",
  "truncated": true,
  "@odata.type": "microsoft.graph.applicationTemplate",
  "isCollection": true
} -->

```http
HTTP/1.1 200 OK
Content-type: application/json

{
  "value": [
  {
  	"id": "8b1025e4-1dd2-430b-a150-2ef79cd700f5",
        "displayName": "Amazon Web Services (AWS)",
        "homePageUrl": "http://aws.amazon.com/",
        "supportedSingleSignOnModes": [
             "password",
             "saml",
             "external"
         ],
         "supportedProvisioningTypes": [
             "sync"
         ],
         "logoUrl": "https://az495088.vo.msecnd.net/app-logo/aws_215.png",
         "categories": [
             "developerServices"
         ],
         "publisher": "Amazon",
         "description": null    
  
}
```

### Create the gallery application

Using the template ID that you retrieved for your application in the last step, [create an instance](https://docs.microsoft.com/graph/api/applicationtemplate-instantiate?view=graph-rest-beta&tabs=http) of the application and service principal in your tenant.

> [!NOTE] 
> You can use applicationTemplate API to instantiate [Non-Gallery apps](add-non-gallery-app.md). Use applicationTemplateId `8adf8e6e-67b2-4cf2-a259-e3dc5476c621`.
#### Request

<!-- {
  "blockType": "request",
  "name": "applicationtemplate_instantiate"
}-->

```msgraph-interactive
POST https://graph.microsoft.com/beta/applicationTemplates/8b1025e4-1dd2-430b-a150-2ef79cd700f5/instantiate
Content-type: application/json

{
  "displayName": "AWS Contoso"
}
```

#### Response


<!-- {
  "blockType": "response",
  "truncated": true,
  "@odata.type": "microsoft.graph.applicationServicePrincipal"
} -->

```http
HTTP/1.1 201 OK
Content-type: application/json


{
    "application": {
        "objectId": "cbc071a6-0fa5-4859-8g55-e983ef63df63",
        "appId": "92653dd4-aa3a-3323-80cf-e8cfefcc8d5d",
        "applicationTemplateId": "8b1025e4-1dd2-430b-a150-2ef79cd700f5",
        "displayName": "AWS Contoso",
        "homepage": "https://signin.aws.amazon.com/saml?metadata=aws|ISV9.1|primary|z",
        "replyUrls": [
            "https://signin.aws.amazon.com/saml"
        ],
        "logoutUrl": null,
        "samlMetadataUrl": null,
    },
    "servicePrincipal": {
        "objectId": "f47a6776-bca7-4f2e-bc6c-eec59d058e3e",
        "appDisplayName": "AWS Contoso",
        "applicationTemplateId": "8b1025e4-1dd2-430b-a150-2ef79cd700f5",
        "appRoleAssignmentRequired": true,
        "displayName": "My custom name",
        "homepage": "https://signin.aws.amazon.com/saml?metadata=aws|ISV9.1|primary|z",
        "replyUrls": [
            "https://signin.aws.amazon.com/saml"
        ],
        "servicePrincipalNames": [
            "93653dd4-aa3a-4323-80cf-e8cfefcc8d7d"
        ],
        "tags": [
            "WindowsAzureActiveDirectoryIntegratedApp"
        ],
    }
}
```

## Step 2: Configure single sign-on

### Retrieve app object ID and service principal object ID

Use the response from the previous call to retrieve and save the application object ID and service principal object ID.

```
"application": {
        "objectId": "cbc071a6-0fa5-4859-8g55-e983ef63df63"
}
"servicePrincipal": {
        "objectId": "f47a6776-bca7-4f2e-bc6c-eec59d058e3e"
}
```
### Set single sign-on mode

In this example, you'll set `saml` as the single sign-on mode in the [servicePrincipal resource type](https://docs.microsoft.com/graph/api/resources/serviceprincipal?view=graph-rest-1.0). Other SAML SSO properties that you can configure are: `notificationEmailAddresses`, `loginUrl`, and `samlSingleSignOnSettings.relayState`

#### Request

<!-- {
  "blockType": "request",
  "name": "servicePrincipals"
}-->

```msgraph-interactive
PATCH https://graph.microsoft.com/v1.0/servicePrincipals/f47a6776-bca7-4f2e-bc6c-eec59d058e3e
Content-type: servicePrincipal/json

{
    "preferredSingleSignOnMode": "saml"
}
```

#### Response

<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 204
```

### Set basic SAML URLs such as identifier, reply URL, sign-on URL

Set the identifier and reply URLs for AWS in the application object.

#### Request

<!-- {
  "blockType": "request",
  "name": "servicePrincipals"
}-->

```msgraph-interactive
PATCH https://graph.microsoft.com/v1.0/applications/cbc071a6-0fa5-4859-8g55-e983ef63df63
Content-type: applications/json

{
    "web": {
        "redirectUris": [
            "https://signin.aws.amazon.com/saml"
        ] 
    },
    "identifierUris": [
        "https://signin.aws.amazon.com/saml"
    ]    
}
```
#### Response

<!-- {
  "blockType": "response",
  "truncated": true,
} -->

```http
HTTP/1.1 204
```
### Add app roles (Optional)

If the application requires the role information in the token, add the definition of the roles in the application object. For AWS, you can [enable user provisioning](../app-provisioning/application-provisioning-configure-api.md) to fetch all the roles from that AWS account. 

For more information, read [Configure the role claim issued in the SAML token](../develop/active-directory-enterprise-app-role-management.md)

> [!NOTE] 
> When adding app roles, don't modify the default app roles msiam_access. 

#### Request

<!-- {
  "blockType": "request",
  "name": "servicePrincipals"
}-->

```msgraph-interactive
PATCH https://graph.microsoft.com/v1.0/serviceprincipals/f47a6776-bca7-4f2e-bc6c-eec59d058e3e
Content-type: serviceprincipals/json

{
"appRoles": [
        {
            "allowedMemberTypes": [
                "User"
            ],
            "description": "msiam_access",
            "displayName": "msiam_access",
            "id": "7dfd756e-8c27-4472-b2b7-38c17fc5de5e",
            "isEnabled": true,
            "origin": "Application",
            "value": null
        },
        {
            "allowedMemberTypes": [
                "User"
            ],
            "description": "Admin,WAAD",
            "displayName": "Admin,WAAD",
            "id": "454dc4c2-8176-498e-99df-8c4efcde41ef",
            "isEnabled": true,
            "value": "arn:aws:iam::212743507312:role/accountname-aws-admin,arn:aws:iam::212743507312:saml-provider/WAAD"
        },
        {
            "allowedMemberTypes": [
                "User"
            ],
            "description": "Finance,WAAD",
            "displayName": "Finance,WAAD",
            "id": "8642d5fa-18a3-4245-ab8c-a96000c1a217",
            "isEnabled": true,
            "value": "arn:aws:iam::212743507312:role/accountname-aws-finance,arn:aws:iam::212743507312:saml-provider/WAAD"
        }
    ]

}
```

#### Response

<!-- {
  "blockType": "response",
  "truncated": true,
} -->
```http
HTTP/1.1 204
```

## Step 3: Configure claims mapping

### Create claims mapping policy

In addition to the basic claims, configure the following claims for Azure AD to emit in the SAML token:

| Claim name | Source  |
|---------|---------|
| `https://aws.amazon.com/SAML/Attributes/Role` | assignedroles| 
| `https://aws.amazon.com/SAML/Attributes/RoleSessionName` | userprincipalname |
| `https://aws.amazon.com/SAML/Attributes/SessionDuration` | "900" |
| roles | assignedroles |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier` | userprincipalname |

For more information, see [Customize claims emitted in token](https://docs.microsoft.com/azure/active-directory/develop/active-directory-claims-mapping).

#### Request

<!-- {
  "blockType": "request",
  "name": "servicePrincipals"
}-->

```msgraph-interactive
POST https://graph.microsoft.com/v1.0/policies/claimsMappingPolicies
Content-type: claimsMappingPolicies/json

{
    "definition":[
            "{\"ClaimsMappingPolicy\": {
                \"Version\": 1,
                \"IncludeBasicClaimSet\": \"true\",
                \"ClaimsSchema\": [
                    {
                        \"Source\": \"user\",
                        \"ID\": \"assignedroles\",
                        \"SamlClaimType\": \"https://aws.amazon.com/SAML/Attributes/Role\"
                    },
                    {
                        \"Source\": \"user\",
                        \"ID\": \"userprincipalname\",
                        \"SamlClaimType\": \"https://aws.amazon.com/SAML/Attributes/RoleSessionName\"
                    },
                    {
                        \"Source\": \"user\",
                        \"ID\": \"900\",
                        \"SamlClaimType\": \"https://aws.amazon.com/SAML/Attributes/SessionDuration\"
                    },
                    {
                        \"Source\": \"user\",
                        \"ID\": \"assignedroles\",
                        \"SamlClaimType\": \"appRoles\"
                    },
                    {
                        \"Source\": \"user\",
                        \"ID\": \"userprincipalname\",
                        \"SamlClaimType\": \"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier\"
                    }
                ]
            }
        }"

    ],
    "displayName": "AWS Claims policy",
    "isOrganizationDefault": false
}
```

#### Response

<!-- {
  "blockType": "response",
  "truncated": true,
  "@odata.type": "microsoft.graph.claimsMappingPolicies",
  "isCollection": true
} -->

```http
HTTP/1.1 200 OK
Content-type: claimsMappingPolicies/json

{
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#policies/claimsMappingPolicies/$entity",
    "id": "6b33aa8e-51f3-41a6-a0fd-d660d276197a",
    "definition": [
        "{\"ClaimsMappingPolicy\": {\"Version\": 1,\"IncludeBasicClaimSet\": \"true\",\"ClaimsSchema\": [{\"Source\": \"user\",\"ID\": \"assignedroles\",\"SamlClaimType\":\"https://aws.amazon.com/SAML/Attributes/Role\"\r\n                    },{\"Source\": \"user\",\"ID\": \"userprincipalname\",\"SamlClaimType\": \"https://aws.amazon.com/SAML/Attributes/RoleSessionName\"},{\"Source\": \"user\",\"ID\": \"900\",\"SamlClaimType\": \"https://aws.amazon.com/SAML/Attributes/SessionDuration\"},{\"Source\": \"user\",\"ID\": \"assignedroles\",\"SamlClaimType\":\"appRoles\"},{\"Source\": \"user\",\"ID\": \"userprincipalname\",\"SamlClaimType\": \"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier\"}]}}"
    ],
    "displayName": "AWS Claims policy",
    "isOrganizationDefault": false
}
```

### Assign claims mapping policy to service principal

#### Request

<!-- {
  "blockType": "request",
  "name": "servicePrincipals"
}-->
```msgraph-interactive
POST https://graph.microsoft.com/beta/servicePrincipals/f47a6776-bca7-4f2e-bc6c-eec59d058e3e/claimsMappingPolicies/$ref

Content-type: claimsMappingPolicies/json

{
  "@odata.id":"https://graph.microsoft.com/v1.0/policies/claimsMappingPolicies/6b33aa8e-51f3-41a6-a0fd-d660d276197a"
}
```

#### Response

<!-- {
  "blockType": "response",
  "truncated": true,
} -->
```http
HTTP/1.1 204
```

## Step 4: Configure signing certificate

Using the [applicationTemplate](https://docs.microsoft.com/graph/api/resources/applicationtemplate?view=graph-rest-beta) API doesn't create a signing certificate by default. Create your custom signing cert and assign it to the application. 

### Create a custom signing certificate

To test, you can use the following PowerShell command to get a self-signed certificate. Use the best security practice from your company to create a signing certificate for production.

```powershell
Param(
    [Parameter(Mandatory=$true)]
    [string]$fqdn,
    [Parameter(Mandatory=$true)]
    [string]$pwd,
    [Parameter(Mandatory=$true)]
    [string]$location
) 

if (!$PSBoundParameters.ContainsKey('location'))
{
    $location = "."
} 

$cert = New-SelfSignedCertificate -certstorelocation cert:\currentuser\my -DnsName $fqdn
$pwdSecure = ConvertTo-SecureString -String $pwd -Force -AsPlainText
$path = 'cert:\currentuser\my\' + $cert.Thumbprint
$cerFile = $location + "\\" + $fqdn + ".cer"
$pfxFile = $location + "\\" + $fqdn + ".pfx" 

Export-PfxCertificate -cert $path -FilePath $pfxFile -Password $pwdSecure
Export-Certificate -cert $path -FilePath $cerFile
```

### Add a custom signing key

Add the following information to the service principal:

* Private key
* Password
* Public key 

Extract the private and public key Base64 encoded from the PFX file. To learn more about the properties, read [keyCredential resource type](https://docs.microsoft.com/graph/api/resources/keycredential?view=graph-rest-1.0).

Make sure that the keyId for the keyCredential used for "Sign" matches the keyId of the passwordCredential.

You can generate the `customkeyIdentifier` by getting the hash of the cert's thumbprint.

```csharp
  public string GetSha256FromThumbprint(string thumbprint)
  {
      var message = Encoding.ASCII.GetBytes(thumbprint);
      SHA256Managed hashString = new SHA256Managed();
      return Convert.ToBase64String(hashString.ComputeHash(message));
  }
```

#### Request

> [!NOTE]
> The "key" value in the keyCredentials property is shortened for readability. The value is base 64 encoded. For the private key the property `usage` is "Sign". For the public key the property `usage` is "Verify".

<!-- {
  "blockType": "request",
  "name": "servicePrincipals"
}-->
```msgraph-interactive
PATCH https://graph.microsoft.com/v1.0/servicePrincipals/f47a6776-bca7-4f2e-bc6c-eec59d058e3e

Content-type: servicePrincipals/json

{
    "keyCredentials":[
        {
            "customKeyIdentifier": "lY85bR8r6yWTW6jnciNEONwlVhDyiQjdVLgPDnkI5mA=",
            "endDateTime": "2021-04-22T22:10:13Z",
            "keyId": "4c266507-3e74-4b91-aeba-18a25b450f6e",
            "startDateTime": "2020-04-22T21:50:13Z",
            "type": "AsymmetricX509Cert",
            "usage": "Sign",
            "key":"MIIKIAIBAz.....HBgUrDgMCERE20nuTptI9MEFCh2Ih2jaaLZBZGeZBRFVNXeZmAAgIH0A==",
            "displayName": "CN=awsAPI"
        },
        {
            "customKeyIdentifier": "lY85bR8r6yWTW6jnciNEONwlVhDyiQjdVLgPDnkI5mA=",
            "endDateTime": "2021-04-22T22:10:13Z",
            "keyId": "e35a7d11-fef0-49ad-9f3e-aacbe0a42c42",
            "startDateTime": "2020-04-22T21:50:13Z",
            "type": "AsymmetricX509Cert",
            "usage": "Verify",
            "key": "MIIDJzCCAg+gAw......CTxQvJ/zN3bafeesMSueR83hlCSyg==",
            "displayName": "CN=awsAPI"
        }

    ],
    "passwordCredentials": [
        {
            "customKeyIdentifier": "lY85bR8r6yWTW6jnciNEONwlVhDyiQjdVLgPDnkI5mA=",
            "keyId": "4c266507-3e74-4b91-aeba-18a25b450f6e",
            "endDateTime": "2022-01-27T19:40:33Z",
            "startDateTime": "2020-04-20T19:40:33Z",
            "secretText": "61891f4ee44d"
        }
    ]
}
```

#### Response

<!-- {
  "blockType": "response",
  "truncated": true,
} -->
```http
HTTP/1.1 204
```

### Activate the custom signing key

You need to set the `preferredTokenSigningKeyThumbprint` property to the thumbprint of the certificate you want Azure AD to use to sign the SAML response. 

#### Request

<!-- {
  "blockType": "request",
  "name": "servicePrincipals"
}-->
```msgraph-interactive
PATCH https://graph.microsoft.com/v1.0/servicePrincipals/f47a6776-bca7-4f2e-bc6c-eec59d058e3e

Content-type: servicePrincipals/json

{
    "preferredTokenSigningKeyThumbprint": "AC09FEF18DDE6983EE2A164FBA3C4DD7518BD787"
}
```

#### Response

<!-- {
  "blockType": "response",
  "truncated": true,
} -->
```http
HTTP/1.1 204
```
## Step 5: Assign users

### Assign users and groups to the application

Assign the following user to the service principal and assign the AWS_Role1. 

| Name  | ID  |
|---------|---------|
| User ID (principalId) | 6cad4079-4e79-4a3f-9efb-ea30a14bdb26 |
| Type (principalType) | User |
| App role ID (appRoleId) | 454dc4c2-8176-498e-99df-8c4efcde41ef |
| servicePrincipalID (resourceId) | 515f62cb-d18a-4dca-bec3-bb0bf31deeea |

#### Request

<!-- {
  "blockType": "request",
  "name": "servicePrincipals"
}-->
```msgraph-interactive
POST https://graph.microsoft.com/v1.0/servicePrincipals/f47a6776-bca7-4f2e-bc6c-eec59d058e3e/appRoleAssignments

Content-type: appRoleAssignments/json

{
  "principalId": "6cad4079-4e79-4a3f-9efb-ea30a14bdb26",
  "principalType": "User",
  "appRoleId":"454dc4c2-8176-498e-99df-8c4efcde41ef",
  "resourceId":"515f62cb-d18a-4dca-bec3-bb0bf31deeea"
}
```
#### Response

<!-- {
  "blockType": "response",
  "truncated": true,
} -->
```http
HTTP/1.1 201 
Content-type: appRoleAssignments/json

{
    "id": "rq7hyzl4yECaNZleMrTpDV-OCe5TEl5Ao_o76XMrRFU",
    "creationTimestamp": "2020-04-23T17:38:13.2508567Z",
    "appRoleId": "454dc4c2-8176-498e-99df-8c4efcde41ef",
    "principalDisplayName": "User 1",
    "principalId": "6cad4079-4e79-4a3f-9efb-ea30a14bdb26",
    "principalType": "User",
    "resourceDisplayName": "AWS API Created",
    "resourceId": "515f62cb-d18a-4dca-bec3-bb0bf31deeea"
}
```

For more information, see [appRoleAssignment](https://docs.microsoft.com/graph/api/resources/approleassignment?view=graph-rest-1.0) resource type.

## Step 6: Configure the application side

### Get Azure AD SAML metadata

Use the following URL to get the Azure AD SAML metadata for the specific configured application. The metadata contains information such as the signing certificate, Azure AD entityID, and Azure AD SingleSignOnService, among others.

https://login.microsoftonline.com/{tenant-id}/federationmetadata/2007-06/federationmetadata.xml?appid={app-id}

## Next steps
- [Use Microsoft Graph APIs to configure user provisioning](../app-provisioning/application-provisioning-configure-api.md)
- [Use the AD FS application activity report to migrate applications to Azure AD](migrate-adfs-application-activity.md)
