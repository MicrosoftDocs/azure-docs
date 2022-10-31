---
title: Customize Azure AD tenant app claims (PowerShell)
description: Learn how to customize claims emitted in tokens for an application in a specific Azure Active Directory tenant.
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.custom: aaddev, ignite-2022
ms.workload: identity
ms.topic: how-to
ms.date: 06/16/2021
ms.author: davidmu
ms.reviewer: ludwignick
---

# Customize claims emitted in tokens for a specific app in a tenant

A claim is information that an identity provider states about a user inside the token they issue for that user. Claims customization is used by tenant admins to customize the claims emitted in tokens for a specific application in their tenant. You can use claims-mapping policies to:

- select which claims are included in tokens.
- create claim types that do not already exist.
- choose or change the source of data emitted in specific claims.

Claims customization supports configuring claim-mapping policies for the WS-Fed, SAML, OAuth, and OpenID Connect protocols.

> [!NOTE]
> This feature replaces and supersedes the [claims customization](active-directory-saml-claims-customization.md) offered through the Azure portal. On the same application, if you customize claims using the portal in addition to the Microsoft Graph/PowerShell method detailed in this document, tokens issued for that application will ignore the configuration in the portal. Configurations made through the methods detailed in this document will not be reflected in the portal.

In this article, we walk through a few common scenarios that can help you understand how to use the [claims-mapping policy type](reference-claims-mapping-policy-type.md).

## Get started

In the following examples, you create, update, link, and delete policies for service principals. Claims-mapping policies can only be assigned to service principal objects. If you are new to Azure AD, we recommend that you [learn about how to get an Azure AD tenant](quickstart-create-new-tenant.md) before you proceed with these examples.

When creating a claims-mapping policy, you can also emit a claim from a directory extension attribute in tokens. Use *ExtensionID* for the extension attribute instead of *ID* in the `ClaimsSchema` element.  For more info on extension attributes, see [Using directory extension attributes](active-directory-schema-extensions.md).

> [!NOTE]
> The [Azure AD PowerShell Module public preview release](https://www.powershellgallery.com/packages/AzureADPreview) is required to configure claims-mapping policies. The PowerShell module is in preview, while the claims mapping and token creation runtime in Azure is generally available. Updates to the preview PowerShell module could require you to update or change your configuration scripts. 

To get started, do the following steps:

1. Download the latest [Azure AD PowerShell Module public preview release](https://www.powershellgallery.com/packages/AzureADPreview).
1. Run the [Connect-AzureAD](/powershell/module/azuread/connect-azuread?view=azureadps-2.0-preview&preserve-view=true) command to sign in to your Azure AD admin account. Run this command each time you start a new session.

   ``` powershell
   Connect-AzureAD -Confirm
   ```
1. To see all policies that have been created in your organization, run the following command. We recommend that you run this command after most operations in the following scenarios, to check that your policies are being created as expected.

   ``` powershell
   Get-AzureADPolicy
   ```

Next, create a claims mapping policy and assign it to a service principal.  See these examples for common scenarios:
- [Omit the basic claims from tokens](#omit-the-basic-claims-from-tokens)
- [Include the EmployeeID and TenantCountry as claims in tokens](#include-the-employeeid-and-tenantcountry-as-claims-in-tokens)
- [Use a claims transformation in tokens](#use-a-claims-transformation-in-tokens)

After creating a claims mapping policy, configure your application to acknowledge that tokens will contain customized claims.  For more information, read [security considerations](#security-considerations).

## Omit the basic claims from tokens

In this example, you create a policy that removes the [basic claim set](reference-claims-mapping-policy-type.md#claim-sets) from tokens issued to linked service principals.

1. Create a claims-mapping policy. This policy, linked to specific service principals, removes the basic claim set from tokens.
   1. To create the policy, run this command:

      ``` powershell
      New-AzureADPolicy -Definition @('{"ClaimsMappingPolicy":{"Version":1,"IncludeBasicClaimSet":"false"}}') -DisplayName "OmitBasicClaims" -Type "ClaimsMappingPolicy"
      ```
   2. To see your new policy, and to get the policy ObjectId, run the following command:

      ``` powershell
      Get-AzureADPolicy
      ```
1. Assign the policy to your service principal. You also need to get the ObjectId of your service principal.
   1. To see all your organization's service principals, you can [query the Microsoft Graph API](/graph/traverse-the-graph). Or, in [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer), sign in to your Azure AD account.
   2. When you have the ObjectId of your service principal, run the following command:

      ``` powershell
      Add-AzureADServicePrincipalPolicy -Id <ObjectId of the ServicePrincipal> -RefObjectId <ObjectId of the Policy>
      ```

## Include the EmployeeID and TenantCountry as claims in tokens

In this example, you create a policy that adds the EmployeeID and TenantCountry to tokens issued to linked service principals. The EmployeeID is emitted as the name claim type in both SAML tokens and JWTs. The TenantCountry is emitted as the country/region claim type in both SAML tokens and JWTs. In this example, we continue to include the basic claims set in the tokens.

1. Create a claims-mapping policy. This policy, linked to specific service principals, adds the EmployeeID and TenantCountry claims to tokens.
   1. To create the policy, run the following command:

      ``` powershell
      New-AzureADPolicy -Definition @('{"ClaimsMappingPolicy":{"Version":1,"IncludeBasicClaimSet":"true", "ClaimsSchema": [{"Source":"user","ID":"employeeid","SamlClaimType":"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/employeeid","JwtClaimType":"employeeid"},{"Source":"company","ID":"tenantcountry","SamlClaimType":"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country","JwtClaimType":"country"}]}}') -DisplayName "ExtraClaimsExample" -Type "ClaimsMappingPolicy"
      ```

      > [!WARNING]
      > When you define a claims mapping policy for a directory extension attribute, use the `ExtensionID` property instead of the `ID` property within the body of the `ClaimsSchema` array.

   2. To see your new policy, and to get the policy ObjectId, run the following command:

      ``` powershell
      Get-AzureADPolicy
      ```
1. Assign the policy to your service principal. You also need to get the ObjectId of your service principal.
   1. To see all your organization's service principals, you can [query the Microsoft Graph API](/graph/traverse-the-graph). Or, in [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer), sign in to your Azure AD account.
   2. When you have the ObjectId of your service principal, run the following command:

      ``` powershell
      Add-AzureADServicePrincipalPolicy -Id <ObjectId of the ServicePrincipal> -RefObjectId <ObjectId of the Policy>
      ```

## Use a claims transformation in tokens

In this example, you create a policy that emits a custom claim "JoinedData" to JWTs issued to linked service principals. This claim contains a value created by joining the data stored in the extensionattribute1 attribute on the user object with ".sandbox". In this example, we exclude the basic claims set in the tokens.

1. Create a claims-mapping policy. This policy, linked to specific service principals, adds the EmployeeID and TenantCountry claims to tokens.
   1. To create the policy, run the following command:

      ``` powershell
      New-AzureADPolicy -Definition @('{"ClaimsMappingPolicy":{"Version":1,"IncludeBasicClaimSet":"true", "ClaimsSchema":[{"Source":"user","ID":"extensionattribute1"},{"Source":"transformation","ID":"DataJoin","TransformationId":"JoinTheData","JwtClaimType":"JoinedData"}],"ClaimsTransformations":[{"ID":"JoinTheData","TransformationMethod":"Join","InputClaims":[{"ClaimTypeReferenceId":"extensionattribute1","TransformationClaimType":"string1"}], "InputParameters": [{"ID":"string2","Value":"sandbox"},{"ID":"separator","Value":"."}],"OutputClaims":[{"ClaimTypeReferenceId":"DataJoin","TransformationClaimType":"outputClaim"}]}]}}') -DisplayName "TransformClaimsExample" -Type "ClaimsMappingPolicy"
      ```

   2. To see your new policy, and to get the policy ObjectId, run the following command:

      ``` powershell
      Get-AzureADPolicy
      ```
1. Assign the policy to your service principal. You also need to get the ObjectId of your service principal.
   1. To see all your organization's service principals, you can [query the Microsoft Graph API](/graph/traverse-the-graph). Or, in [Microsoft Graph Explorer](https://developer.microsoft.com/graph/graph-explorer), sign in to your Azure AD account.
   2. When you have the ObjectId of your service principal, run the following command:

      ``` powershell
      Add-AzureADServicePrincipalPolicy -Id <ObjectId of the ServicePrincipal> -RefObjectId <ObjectId of the Policy>
      ```

## Security considerations

Applications that receive tokens rely on the fact that the claim values are authoritatively issued by Azure AD and cannot be tampered with. However, when you modify the token contents through claims-mapping policies, these assumptions may no longer be correct. Applications must explicitly acknowledge that tokens have been modified by the creator of the claims-mapping policy to protect themselves from claims-mapping policies created by malicious actors. This can be done in one the following ways:

- [Configure a custom signing key](#configure-a-custom-signing-key)
- Or, [update the application manifest](#update-the-application-manifest) to accept mapped claims.
 
Without this, Azure AD will return an [`AADSTS50146` error code](reference-aadsts-error-codes.md#aadsts-error-codes).

### Configure a custom signing key

For multi-tenant apps, a custom signing key should be used.  Do not set `acceptMappedClaims` in the app manifest. If set up an app in the Azure portal, you get an app registration object and a service principal in your tenant.  That app is using the Azure global sign-in key, which cannot be used for customizing claims in tokens.  To get custom claims in tokens, create a custom sign-in key from a certificate and add it to service principal.  For testing purposes, you can use a self-signed certificate. After configuring the custom signing key, your application code needs to [validate the token signing key](#validate-token-signing-key).

Add the following information to the service principal:

- Private key (as a [key credential](/graph/api/resources/keycredential))
- Password (as a [password credential](/graph/api/resources/passwordcredential))
- Public key (as a [key credential](/graph/api/resources/keycredential))

Extract the private and public key base-64 encoded from the PFX file export of your certificate. Make sure that the `keyId` for the `keyCredential` used for "Sign" matches the `keyId` of the `passwordCredential`. You can generate the `customkeyIdentifier` by getting the hash of the cert's thumbprint.

#### Request

The following shows the format of the HTTP PATCH request to add a custom signing key to a service principal.  The "key" value in the `keyCredentials` property is shortened for readability. The value is base-64 encoded. For the private key, the property usage is "Sign". For the public key, the property usage is "Verify".

```
PATCH https://graph.microsoft.com/v1.0/servicePrincipals/f47a6776-bca7-4f2e-bc6c-eec59d058e3e

Content-type: servicePrincipals/json
Authorization: Bearer {token}

{
    "keyCredentials":[
        {
            "customKeyIdentifier": "lY85bR8r6yWTW6jnciNEONwlVhDyiQjdVLgPDnkI5mA=",
            "endDateTime": "2021-04-22T22:10:13Z",
            "keyId": "4c266507-3e74-4b91-aeba-18a25b450f6e",
            "startDateTime": "2020-04-22T21:50:13Z",
            "type": "X509CertAndPassword",
            "usage": "Sign",
            "key":"MIIKIAIBAz.....HBgUrDgMCERE20nuTptI9MEFCh2Ih2jaaLZBZGeZBRFVNXeZmAAgIH0A==",
            "displayName": "CN=contoso"
        },
        {
            "customKeyIdentifier": "lY85bR8r6yWTW6jnciNEONwlVhDyiQjdVLgPDnkI5mA=",
            "endDateTime": "2021-04-22T22:10:13Z",
            "keyId": "e35a7d11-fef0-49ad-9f3e-aacbe0a42c42",
            "startDateTime": "2020-04-22T21:50:13Z",
            "type": "AsymmetricX509Cert",
            "usage": "Verify",
            "key": "MIIDJzCCAg+gAw......CTxQvJ/zN3bafeesMSueR83hlCSyg==",
            "displayName": "CN=contoso"
        }

    ],
    "passwordCredentials": [
        {
            "customKeyIdentifier": "lY85bR8r6yWTW6jnciNEONwlVhDyiQjdVLgPDnkI5mA=",
            "keyId": "4c266507-3e74-4b91-aeba-18a25b450f6e",
            "endDateTime": "2022-01-27T19:40:33Z",
            "startDateTime": "2020-04-20T19:40:33Z",
            "secretText": "mypassword"
        }
    ]
}
```

#### Configure a custom signing key using PowerShell

Use PowerShell to [instantiate an MSAL Public Client Application](msal-net-initializing-client-applications.md#initializing-a-public-client-application-from-code) and use the [Authorization Code Grant](v2-oauth2-auth-code-flow.md) flow to obtain a delegated permission access token for Microsoft Graph. Use the access token to call Microsoft Graph and configure a custom signing key for the service principal. After configuring the custom signing key, your application code needs to [validate the token signing key](#validate-token-signing-key).

To run this script you need:
1. The object ID of your application's service principal, found in the **Overview** blade of your application's entry in [Enterprise Applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps/menuId/) in the Azure portal.
2. An app registration to sign in a user and get an access token to call Microsoft Graph. Get the application (client) ID of this app in the **Overview** blade of the application's entry in [App registrations](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) in the Azure portal. The app registration should have the following configuration:
    - A redirect URI of "http://localhost" listed in the **Mobile and desktop applications** platform configuration
    - In **API permissions**, Microsoft Graph delegated permissions **Application.ReadWrite.All** and **User.Read** (make sure you grant Admin consent to these permissions)
3. A user who logs in to get the Microsoft Graph access token. The user should be one of the following Azure AD administrative roles (required to update the service principal):
    - Cloud Application Administrator
    - Application Administrator
    - Global Administrator
4. A certificate to configure as a custom signing key for our application. You can either create a self-signed certificate or obtain one from your trusted certificate authority. The following certificate components are used in the script:
    - public key (typically a .cer file)
    - private key in PKCS#12 format (in .pfx file)
    - password for the private key (pfx file)

> [!IMPORTANT]
> The private key must be in PKCS#12 format since Azure AD does not support other format types. Using the wrong format can result in the error "Invalid certificate: Key value is invalid certificate" when using Microsoft Graph to PATCH the service principal with a `keyCredentials` containing the certificate info.

```powershell

$fqdn="fourthcoffeetest.onmicrosoft.com" # this is used for the 'issued to' and 'issued by' field of the certificate
$pwd="mypassword" # password for exporting the certificate private key
$location="C:\\temp" # path to folder where both the pfx and cer file will be written to

# Create a self-signed cert
$cert = New-SelfSignedCertificate -certstorelocation cert:\currentuser\my -DnsName $fqdn
$pwdSecure = ConvertTo-SecureString -String $pwd -Force -AsPlainText
$path = 'cert:\currentuser\my\' + $cert.Thumbprint
$cerFile = $location + "\\" + $fqdn + ".cer"
$pfxFile = $location + "\\" + $fqdn + ".pfx"
 
# Export the public and private keys
Export-PfxCertificate -cert $path -FilePath $pfxFile -Password $pwdSecure
Export-Certificate -cert $path -FilePath $cerFile

$ClientID = "<app-id>"
$loginURL       = "https://login.microsoftonline.com"
$tenantdomain   = "fourthcoffeetest.onmicrosoft.com"
$redirectURL = "http://localhost" # this reply URL is needed for PowerShell Core 
[string[]] $Scopes = "https://graph.microsoft.com/.default"
$pfxpath = $pfxFile # path to pfx file
$cerpath = $cerFile # path to cer file
$SPOID = "<service-principal-id>"
$graphuri = "https://graph.microsoft.com/v1.0/serviceprincipals/$SPOID"
$password = $pwd  # password for the pfx file
 
 
# choose the correct folder name for MSAL based on PowerShell version 5.1 (.Net) or PowerShell Core (.Net Core)
 
if ($PSVersionTable.PSVersion.Major -gt 5)
    { 
        $core = $true
        $foldername =  "netcoreapp2.1"
    }
else
    { 
        $core = $false
        $foldername = "net45"
    }
 
# Load the MSAL/microsoft.identity/client assembly -- needed once per PowerShell session
[System.Reflection.Assembly]::LoadFrom((Get-ChildItem C:/Users/<username>/.nuget/packages/microsoft.identity.client/4.32.1/lib/$foldername/Microsoft.Identity.Client.dll).fullname) | out-null
  
$global:app = $null
  
$ClientApplicationBuilder = [Microsoft.Identity.Client.PublicClientApplicationBuilder]::Create($ClientID)
[void]$ClientApplicationBuilder.WithAuthority($("$loginURL/$tenantdomain"))
[void]$ClientApplicationBuilder.WithRedirectUri($redirectURL)
 
$global:app = $ClientApplicationBuilder.Build()
  
Function Get-GraphAccessTokenFromMSAL {
    [Microsoft.Identity.Client.AuthenticationResult] $authResult  = $null
    $AquireTokenParameters = $global:app.AcquireTokenInteractive($Scopes)
    [IntPtr] $ParentWindow = [System.Diagnostics.Process]::GetCurrentProcess().MainWindowHandle
    if ($ParentWindow)
    {
        [void]$AquireTokenParameters.WithParentActivityOrWindow($ParentWindow)
    }
    try {
        $authResult = $AquireTokenParameters.ExecuteAsync().GetAwaiter().GetResult()
    }
    catch {
        $ErrorMessage = $_.Exception.Message
        Write-Host $ErrorMessage
    }
     
    return $authResult
}
  
$myvar = Get-GraphAccessTokenFromMSAL
if ($myvar)
{
    $GraphAccessToken = $myvar.AccessToken
    Write-Host "Access Token: " $myvar.AccessToken
    #$GraphAccessToken = "eyJ0eXAiOiJKV1QiL ... iPxstltKQ"
    
 
    #  this is for PowerShell Core
    $Secure_String_Pwd = ConvertTo-SecureString $password -AsPlainText -Force
 
    # reading certificate files and creating Certificate Object
    if ($core)
    {
        $pfx_cert = get-content $pfxpath -AsByteStream -Raw
        $cer_cert = get-content $cerpath -AsByteStream -Raw
        $cert = Get-PfxCertificate -FilePath $pfxpath -Password $Secure_String_Pwd
    }
    else
    {
        $pfx_cert = get-content $pfxpath -Encoding Byte
        $cer_cert = get-content $cerpath -Encoding Byte
        # Write-Host "Enter password for the pfx file..."
        # calling Get-PfxCertificate in PowerShell 5.1 prompts for password
        # $cert = Get-PfxCertificate -FilePath $pfxpath
        $cert = [System.Security.Cryptography.X509Certificates.X509Certificate2]::new($pfxpath, $password)
    }
 
    # base 64 encode the private key and public key
    $base64pfx = [System.Convert]::ToBase64String($pfx_cert)
    $base64cer = [System.Convert]::ToBase64String($cer_cert)
 
    # getting id for the keyCredential object
    $guid1 = New-Guid
    $guid2 = New-Guid
 
    # get the custom key identifier from the certificate thumbprint:
    $hasher = [System.Security.Cryptography.HashAlgorithm]::Create('sha256')
    $hash = $hasher.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($cert.Thumbprint))
    $customKeyIdentifier = [System.Convert]::ToBase64String($hash)
 
    # get end date and start date for our keycredentials
    $endDateTime = ($cert.NotAfter).ToUniversalTime().ToString( "yyyy-MM-ddTHH:mm:ssZ" )
    $startDateTime = ($cert.NotBefore).ToUniversalTime().ToString( "yyyy-MM-ddTHH:mm:ssZ" )
 
    # building our json payload
    $object = [ordered]@{    
    keyCredentials = @(       
         [ordered]@{            
            customKeyIdentifier = $customKeyIdentifier
            endDateTime = $endDateTime
            keyId = $guid1
            startDateTime = $startDateTime 
            type = "X509CertAndPassword"
            usage = "Sign"
            key = $base64pfx
            displayName = "CN=fourthcoffeetest" 
        },
        [ordered]@{            
            customKeyIdentifier = $customKeyIdentifier
            endDateTime = $endDateTime
            keyId = $guid2
            startDateTime = $startDateTime 
            type = "AsymmetricX509Cert"
            usage = "Verify"
            key = $base64cer
            displayName = "CN=fourthcoffeetest"   
        }
        )  
    passwordCredentials = @(
        [ordered]@{
            customKeyIdentifier = $customKeyIdentifier
            keyId = $guid1           
            endDateTime = $endDateTime
            startDateTime = $startDateTime
            secretText = $password
        }
    )
    }
 
    $json = $object | ConvertTo-Json -Depth 99
    Write-Host "JSON Payload:"
    Write-Output $json
 
    # Request Header
    $Header = @{}
    $Header.Add("Authorization","Bearer $($GraphAccessToken)")
    $Header.Add("Content-Type","application/json")
 
    try 
    {
        Invoke-RestMethod -Uri $graphuri -Method "PATCH" -Headers $Header -Body $json
    } 
    catch 
    {
        # Dig into the exception to get the Response details.
        # Note that value__ is not a typo.
        Write-Host "StatusCode:" $_.Exception.Response.StatusCode.value__ 
        Write-Host "StatusDescription:" $_.Exception.Response.StatusDescription
    }
 
    Write-Host "Complete Request"
}
else
{
    Write-Host "Fail to get Access Token"
}
```

#### Validate token signing key
Apps that have claims mapping enabled must validate their token signing keys by appending `appid={client_id}` to their [OpenID Connect metadata requests](v2-protocols-oidc.md#fetch-the-openid-configuration-document). Below is the format of the OpenID Connect metadata document you should use:

```
https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration?appid={client-id}
```

### Update the application manifest

For single tenant apps, you can set the `acceptMappedClaims` property to `true` in the [application manifest](reference-app-manifest.md).  As documented on the [apiApplication resource type](/graph/api/resources/apiapplication#properties), this allows an application to use claims mapping without specifying a custom signing key. 

> [!WARNING]
> Do not set `acceptMappedClaims` property to `true` for multi-tenant apps, which can allow malicious actors to create claims-mapping policies for your app.

This does require the requested token audience to use a verified domain name of your Azure AD tenant, which means you should ensure to set the `Application ID URI` (represented by the `identifierUris` in the application manifest) for example to `https://contoso.com/my-api` or (simply using the default tenant name) `https://contoso.onmicrosoft.com/my-api`.

If you're not using a verified domain, Azure AD will return an `AADSTS501461` error code with message *"AcceptMappedClaims is only supported for a token audience matching the application GUID or an audience within the tenant's verified domains. Either change the resource identifier, or use an application-specific signing key."*

## Next steps

- Read the [claims-mapping policy type](reference-claims-mapping-policy-type.md) reference article to learn more.
- To learn how to customize claims issued in the SAML token through the Azure portal, see [How to: Customize claims issued in the SAML token for enterprise applications](active-directory-saml-claims-customization.md)
- To learn more about extension attributes, see [Using directory extension attributes in claims](active-directory-schema-extensions.md).
