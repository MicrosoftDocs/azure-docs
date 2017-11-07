---
title: How to use an Azure VM Managed Service Identity for sign-in and token acquisition
description: Step by step instructions for using an Azure VM MSI service principal for sign-in, and for acquiring an access token.
services: active-directory
documentationcenter: 
author: bryanla
manager: mbaldwin
editor: 

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/02/2017
ms.author: bryanla
---

# How to use an Azure VM Managed Service Identity (MSI) for sign-in and token acquisition 

[!INCLUDE[preview-notice](../../includes/active-directory-msi-preview-notice.md)]
A VM Managed Service Identity makes two important features available to client applications running on the VM:

1. An MSI [**service principal**](develop/active-directory-dev-glossary.md#service-principal-object), which is created upon enabling MSI on the VM. Traditionally, in order for a client application to be able to access secured resources, it must:  

   - be registered with Azure AD as a confidential/web client application - consented for use by a tenant's user(s)/admin
   - sign in under its service principal, using the client ID+secret credentials  

  With MSI, your client application no longer needs to do either, as it can sign in under the MSI service principal. 

2. An [**app-only access token**](develop/active-directory-dev-glossary.md#access-token), which is based on the VM's MSI service principal. As such, there is also no need for the client to authenticate under its own credentials, to obtain an access token. The token is issued for the MSI service principal, and is suitable for use as a bearer token in [service-to-service calls requiring client credentials](active-directory-protocols-oauth-service-to-service.md).

This article shows you various ways a client application can sign-in under an MSI service principal, and acquire an access token, both of which can be used in accessing other resources.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../includes/msi-qs-configure-prereqs.md)]

If you plan to use the Azure PowerShell or Azure CLI examples in this article, you have three options:
- Use [Azure Cloud Shell](../cloud-shell/overview.md) from the Azure portal.
- Use the embedded Azure Cloud Shell via the "Try It" button, located in the top right corner of code blocks.
- Install the latest version of [Azure PowerShell](https://www.powershellgallery.com/packages/AzureRM) or [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) if you prefer to use  a local command prompt. 

> [!IMPORTANT]
> - All sample code/script in this article assumes the client is running on an MSI-enabled Virtual Machine. Use the VM "Connect" feature in the Azure portal, to remotely connect to your VM. For details on enabling MSI on a VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](msi-qs-configure-portal-windows-vm.md), or one of the variant articles (using PowerShell, CLI, a template, or an Azure SDK). 
> - To prevent errors in the sign-in examples, the VM's identity must be given "Reader" access to itself (at the VM scope or higher) to allow Azure Resource Manager operations on the VM. See [Assign a Managed Service Identity (MSI) access to a resource using the Azure portal](msi-howto-assign-access-portal.md) for details.

## Code examples

Scripting hosts such as Azure PowerShell and Azure CLI can use an MSI service principal for sign-in, instead of signing in with a user account. When using an MSI service principal, the host also takes care of acquiring an access token in the background, for making subsequent calls to access resources. This frees the script user from the need to handle token acquisition.

However, if you're writing your own client application, you'll need to write your own token acquisition logic.

The examples below show of variety of ways to do one or both functions:

| Sample | Sign-in | Token acquisition | Resource access |
| ------ | ------- | ----------------- | --------------- |
| [HTTP/REST](#httprest) | N | Y | N |
| [.NET C#](#net-c) | N | Y | N |
| [Azure CLI](#azure-cli) | Y | N | Y |
| [Azure PowerShell](#azure-powershell) | N | Y | Y |
| [Bash/CURL](#bashcurl) | N | Y | N |
| [Go](#go) | N | Y | N |
| [Java](#java) | N | Y | N |
| [PHP](#php) | N | Y | N |


### HTTP/REST 

A client application can use HTTP REST calls to acquire the MSI access token. This is similar to the Azure AD programming model, except the client uses a localhost endpoint on the virtual machine (vs and Azure AD endpoint).

Sample request:

```
GET http://localhost:50342/oauth2/token?resource=https%3A%2F%2Fmanagement.azure.com%2F HTTP/1.1
Metadata: true
```

| Element | Description |
| ------- | ----------- |
| `GET` | The HTTP verb, indicating you want to retrieve data from the endpoint. In this case, an OAuth access token. | 
| `http://localhost:50342/oauth2/token` | The MSI endpoint, where 50342 is the default port and is configurable. |
| `resource` | A query string parameter, indicating the App ID URI of the target resource. It also appears in the `aud` (audience) claim of the issued token. This example requests a token to access Azure Resource Manager, which has an App ID URI of https://management.azure.com/. |
| `Metadata` | An HTTP request header field, required by MSI as a mitigation against Server Side Request Forgery (SSRF) attack. This value must be set to "true", in all lower case.

Sample response:

```
HTTP/1.1 200 OK
Content-Type: application/json
{
  "access_token": "eyJ0eXAi...",
  "refresh_token": "",
  "expires_in": "3599",
  "expires_on": "1506484173",
  "not_before": "1506480273",
  "resource": "https://management.azure.com/",
  "token_type": "Bearer"
}
```

| Element | Description |
| ------- | ----------- |
| `access_token` | The requested access token. When calling a REST API, the token is embedded in the `Authorization` request header field as a "bearer" token, allowing the API to authenticate the caller. | 
| `refresh_token` | Not used by MSI. |
| `expires_in` | The number of seconds the access token continues to be valid, before expiring, from time of issuance. Time of issuance can be found in the token's `iat` claim. |
| `expires_on` | The timespan when the access token expires. The date is represented as the number of seconds from "1970-01-01T0:0:0Z UTC"  (corresponds to the token's `exp` claim). |
| `not_before` | The timespan when the access token takes effect, and can be accepted. The date is represented as the number of seconds from "1970-01-01T0:0:0Z UTC" (corresponds to the token's `nbf` claim). |
| `resource` | The resource the access token was requested for, which matches the `resource` query string parameter of the request. |
| `token_type` | The type of token, which is a "Bearer" access token, which means the resource can give access to the bearer of this token. |

### .NET C#

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Web.Script.Serialization; 

// Build request to acquire MSI token
HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://localhost:50342/oauth2/token?resource=https://management.azure.com/");
request.Headers["Metadata"] = "true";
request.Method = "GET";

try
{
    // Call /token endpoint
    HttpWebResponse response = (HttpWebResponse)request.GetResponse();

    // Pipe response Stream to a StreamReader, and extract access token
    StreamReader streamResponse = new StreamReader(response.GetResponseStream()); 
    string stringResponse = streamResponse.ReadToEnd();
    JavaScriptSerializer j = new JavaScriptSerializer();
    Dictionary<string, string> list = (Dictionary<string, string>) j.Deserialize(stringResponse, typeof(Dictionary<string, string>));
    string accessToken = list["access_token"];
}
catch (Exception e)
{
    string errorText = String.Format("{0} \n\n{1}", e.Message, e.InnerException != null ? e.InnerException.Message : "Acquire token failed");
}

```

### Azure CLI

The following script demonstrates how to:

- sign in to Azure AD under the VM's MSI service principal
- use the MSI service principal to make an Azure Resource Manager call, to obtain the ID of the service principal

```azurecli-interactive
az login --msi
spID=$(az resource list -n <VM-NAME> --query [*].identity.principalId --out tsv)
echo The MSI service principal ID is $spID
```

### Azure PowerShell

The following script demonstrates how to:

1. Acquire an MSI access token for an Azure VM.
2. Use the access token to sign in to Azure AD, under the application ID of the corresponding MSI service principal. Be sure to substitute the MSI service principal's application ID for `<APP-ID>` in the script. 

   > [!NOTE]
   > Use the following if you need to obtain the application ID, substituting the name of your virtual machine for `<VM-NAME>`. This can be done from any computer:
   > ```azurepowershell-interactive
   > # Install the Azure AD PS cmdlets if necessary
   > Install-Module AzureAD
   > # Sign in using an account from the AAD tenant associated with the Azure subscription of your VM
   > Connect-AzureAD 
   > # Copy the appId property returned from the following, substituting the name of your VM for VM-NAME
   > Get-AzureADServicePrincipal -Filter "displayName eq '<VM-NAME>'" 
   > ```  
3. Use the MSI service principal to make an Azure Resource Manager call, to obtain the ID of the service principal. Be sure to substitute your resource group and virtual machine name for `<RESOURCE-GROUP>` and `<VM-NAME>` respectively.

```azurepowershell-interactive
# Get an access token for the MSI
$response = Invoke-WebRequest -Uri http://localhost:50342/oauth2/token `
                              -Method GET -Body @{resource="https://management.azure.com/"} -Headers @{Metadata="true"}
$content =$response.Content | ConvertFrom-Json
$access_token = $content.access_token
echo "The MSI access token is $access_token"

# Use the access token to sign in under the MSI service principal
Login-AzureRmAccount -AccessToken $access_token -AccountId "<APP-ID>"

# The MSI service principal is now signed in for this session.
# Next, a call to Azure Resource Manager is made to get the service principal ID for the VM's MSI. 
$vmInfo = Get-AzureRMVM -ResourceGroupName <RESOURCE-GROUP> -Name <VM-NAME>
$spID = $vmInfo.Identity.PrincipalId
echo "The MSI service principal ID is $spID"
```

### Bash/CURL

```bash
response=$(curl http://localhost:50342/oauth2/token --data "resource=https://management.azure.com/" -H Metadata:true -s)
access_token=$(echo $response | python -c 'import sys, json; print (json.load(sys.stdin)["access_token"])')
echo The MSI access token is $access_token
```

### Go

package main

import (
  "fmt"
  "io/ioutil"
  "net/http"
  "encoding/json"
)

type responseJson struct {
  Access_token string
  Refresh_token string
  Expires_in string
  Expires_on string
  Not_before string
  Resource string
  Token_type string
}

func main() {

    // Create HTTP request client and call MSI /token endpoint
    msi_endpoint := "http://localhost:50342/oauth2/token?resource=https://management.azure.com/"
    client := &http.Client{}
    req, err := http.NewRequest("GET", msi_endpoint, nil)
    req.Header.Add("Metadata", "true")
    resp, err := client.Do(req)

    // Pull out response body
    responseBytes,err := ioutil.ReadAll(resp.Body)
    resp.Body.Close()
    if err != nil {
      fmt.Println("Error:", err)
    }

    // Unmarshall response body into struct
    var r responseJson
    errUnmarshal :=json.Unmarshal(responseBytes, &r)
    if errUnmarshal != nil {
      fmt.Println("Error:", errUnmarshal)
    }

    // Print HTTP response, unmarshalled response body, and marshalled response body elements to console
    fmt.Println("Response status:", resp.Status)
    fmt.Println("access_token: ", r.Access_token)
    fmt.Println("refresh_token: ", r.Refresh_token)
    fmt.Println("expires_in: ", r.Expires_in)
    fmt.Println("expires_on: ", r.Expires_on)
    fmt.Println("not_before: ", r.Not_before)
    fmt.Println("resource: ", r.Resource)
    fmt.Println("token_type: ", r.Token_type)
}

### Java

### PHP




========================================== OLD ============================================================

[!INCLUDE[preview-notice](../../includes/active-directory-msi-preview-notice.md)]
After you've enabled MSI on an Azure VM, you can use the MSI for sign-in and to request an access token. This article shows you various ways to use an MSI [service principal](develop/active-directory-dev-glossary.md#service-principal-object) for sign-in, and acquire an [app-only access token](develop/active-directory-dev-glossary.md#access-token) to access other resources, including:

- Silent/unattended sign-in from PowerShell or Azure CLI
- Token acquisition for various clients, including .NET, PowerShell, Bash/CURL, REST
- Sign-in using an Azure SDK, including .NET, Java, Node.js, Python, Ruby

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../includes/msi-qs-configure-prereqs.md)]

If you plan to use the PowerShell examples in this article, be sure to install [Azure PowerShell version 4.3.1](https://www.powershellgallery.com/packages/AzureRM) or greater. If you plan to use the Azure CLI examples in this article, you have three options:
- Use [Azure Cloud Shell](../cloud-shell/overview.md) from the Azure portal.
- Use the embedded Azure Cloud Shell via the "Try It" button, located in the top right corner of Azure CLI code blocks.
- [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.13 or later) if you prefer to use CLI in a local command prompt. 


> [!IMPORTANT]
> - All sample code/script in this article assumes the client is running on an MSI-enabled Virtual Machine. For details on enabling MSI on a VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](msi-qs-configure-portal-windows-vm.md), or one of the variant articles (using PowerShell, CLI, a template, or an Azure SDK). 
> - To prevent authorization errors (403/AuthorizationFailed) in the code/script examples, the VM's identity must be given "Reader" access at the VM scope to allow Azure Resource Manager operations on the VM. See [Assign a Managed Service Identity (MSI) access to a resource using the Azure portal](msi-howto-assign-access-portal.md) for details.
> - Before proceeding to one of the following sections, use the VM "Connect" feature in the Azure portal, to remotely connect to your MSI-enabled VM.

## How to sign in from PowerShell or CLI using MSI

Previously, running a script under its own identity meant:
- registering it as a confidential/web client application with Azure AD
- signing in using the application's client ID/secret credentials

With MSI, your script client no longer needs to register with Azure AD nor provide credentials. In the examples below, we show how to use a VM's MSI service principal for sign-in.

### Azure PowerShell

The following script demonstrates how to:

- acquire an MSI access token for an Azure VM
- use the access token to sign in to Azure AD under the corresponding MSI service principal
- use the MSI service principal to make an Azure Resource Manager call, to obtain the ID of the service principal

```azurepowershell-interactive
# Get an access token from MSI
$response = Invoke-WebRequest -Uri http://localhost:50342/oauth2/token `
                              -Method GET -Body @{resource="https://management.azure.com/"} -Headers @{Metadata="true"}
$content =$response.Content | ConvertFrom-Json
$access_token = $content.access_token

# Use the access token to sign in under the MSI service principal
Login-AzureRmAccount -AccessToken $access_token -AccountId <APP-ID>

# The MSI service principal is now signed in for this session.
# Next, a call to Azure Resource Manager is made to get VM info for the VM's MSI, including its service principal ID. 
$vmInfo = Get-AzureRMVM -ResourceGroupName <RESOURCE-GROUP> -Name <VM-NAME>
$spID = $vmInfo.Identity.PrincipalId
echo "The MSI service principal ID is $spID"
```
   
### Azure CLI

The following script demonstrates how to:

- sign in to Azure AD under the VM's MSI service principal
- use the MSI service principal to make an Azure Resource Manager call, to obtain the ID of the service principal

```azurecli-interactive
az login --msi
spID=$(az resource list -n <VM-NAME> --query [*].identity.principalId --out tsv)
echo The MSI service principal ID is $spID
```

## How to acquire an access token from MSI

Using MSI, your client application/script no longer needs to register with Azure AD, nor present its client ID and secret to obtain an access token. Your client can simply ask the local MSI endpoint for an access token, without presenting application credentials. The app-only access token is issued for the MSI service principal, suitable for use as a bearer token in [service-to-service calls requiring client credentials](active-directory-protocols-oauth-service-to-service.md).

In the examples below, we show how to use a VM's MSI for token acquisition.

### .NET

> [!IMPORTANT]
> The Azure AD Authentication Library (ADAL) is not integrated with MSI. To obtain an access token using MSI, make a request to the local MSI endpoint in a VM. For more information, see [MSI FAQs and known issues](msi-known-issues.md#frequently-asked-questions-faqs).

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Web.Script.Serialization; 

// Build request to acquire MSI token
HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://localhost:50342/oauth2/token?resource=https://management.azure.com/");
request.Headers["Metadata"] = "true";
request.Method = "GET";

try
{
    // Call /token endpoint
    HttpWebResponse response = (HttpWebResponse)request.GetResponse();

    // Pipe response Stream to a StreamReader, and extract access token
    StreamReader streamResponse = new StreamReader(response.GetResponseStream()); 
    string stringResponse = streamResponse.ReadToEnd();
    JavaScriptSerializer j = new JavaScriptSerializer();
    Dictionary<string, string> list = (Dictionary<string, string>) j.Deserialize(stringResponse, typeof(Dictionary<string, string>));
    string accessToken = list["access_token"];
}
catch (Exception e)
{
    string errorText = String.Format("{0} \n\n{1}", e.Message, e.InnerException != null ? e.InnerException.Message : "Acquire token failed");
}

```

### <a name="azure-powershell-token"></a>Azure PowerShell

```powershell
# Get an access token from MSI
$response = Invoke-WebRequest -Uri http://localhost:50342/oauth2/token `
                              -Method GET -Body @{resource="https://management.azure.com/"} -Headers @{Metadata="true"}
$content =$response.Content | ConvertFrom-Json
$access_token = $content.access_token
echo "The MSI access token is $access_token"
```

### Bash/CURL

```bash
response=$(curl http://localhost:50342/oauth2/token --data "resource=https://management.azure.com/" -H Metadata:true -s)
access_token=$(echo $response | python -c 'import sys, json; print (json.load(sys.stdin)["access_token"])')
echo The MSI access token is $access_token
```

### REST

Sample request:

```
GET http://localhost:50342/oauth2/token?resource=https%3A%2F%2Fmanagement.azure.com%2F HTTP/1.1
Metadata: true
```

| Element | Description |
| ------- | ----------- |
| `GET` | The HTTP verb, indicating you want to retrieve data from the endpoint. In this case, an OAuth access token. | 
| `http://localhost:50342/oauth2/token` | The MSI endpoint, where 50342 is the default port and is configurable. |
| `resource` | A query string parameter, indicating the App ID URI of the target resource. It also appears in the `aud` (audience) claim of the issued token. This example requests a token to access Azure Resource Manager, which has an App ID URI of https://management.azure.com/. |
| `Metadata` | An HTTP request header field, required by MSI as a mitigation against Server Side Request Forgery (SSRF) attack. This value must be set to "true", in all lower case.

Sample response:

```
HTTP/1.1 200 OK
Content-Type: application/json
{
  "access_token": "eyJ0eXAi...",
  "refresh_token": "",
  "expires_in": "3599",
  "expires_on": "1506484173",
  "not_before": "1506480273",
  "resource": "https://management.azure.com/",
  "token_type": "Bearer"
}
```

| Element | Description |
| ------- | ----------- |
| `access_token` | The requested access token. When calling a REST API, the token is embedded in the `Authorization` request header field as a "bearer" token, allowing the API to authenticate the caller. | 
| `refresh_token` | Not used by MSI. |
| `expires_in` | The number of seconds the access token continues to be valid, before expiring, from time of issuance. Time of issuance can be found in the token's `iat` claim. |
| `expires_on` | The timespan when the access token expires. The date is represented as the number of seconds from "1970-01-01T0:0:0Z UTC"  (corresponds to the token's `exp` claim). |
| `not_before` | The timespan when the access token takes effect, and can be accepted. The date is represented as the number of seconds from "1970-01-01T0:0:0Z UTC" (corresponds to the token's `nbf` claim). |
| `resource` | The resource the access token was requested for, which matches the `resource` query string parameter of the request. |
| `token_type` | The type of token, which is a "Bearer" access token, which means the resource can give access to the bearer of this token. |

## How to use MSI with Azure SDK libraries

Azure supports multiple programming platforms through a series of [Azure SDKs](https://azure.microsoft.com/downloads). Several of them have been updated to support sign-in using an MSI, and provide corresponding samples to demonstrate usage. This list is updated as additional support is added:

| SDK | Sample |
| --- | ------ | 
| .NET | [Deploy an ARM template from a Windows VM using Managed Service Identity](https://github.com/Azure-Samples/windowsvm-msi-arm-dotnet) |
| .NET Core | [Call Azure services from a Linux VM using Managed Service Identity](https://github.com/Azure-Samples/linuxvm-msi-keyvault-arm-dotnet/) |
| Node.js| [Manage resources using Managed Service Identity](https://azure.microsoft.com/resources/samples/resources-node-manage-resources-with-msi/) |
| Python | [Use MSI to authenticate simply from inside a VM](https://azure.microsoft.com/resources/samples/resource-manager-python-manage-resources-with-msi/) |
| Ruby   | [Manage resources from an MSI-enabled VM](https://azure.microsoft.com/resources/samples/resources-ruby-manage-resources-with-msi/) | 

## Additional information

### Token expiration

The local MSI subsystem caches tokens. Therefore, you can call it as often as you like, and an on-the-wire call to Azure AD results only if:
- a cache miss occurs due to no token in the cache
- the token is expired

If you cache the token in your code, you should be prepared to handle scenarios where the resource indicates that the token is expired.

### Resource IDs for Azure services

See [Azure services that support Azure AD authentication](msi-overview.md#azure-services-that-support-azure-ad-authentication) for a list of services that support MSI, and their respective resource IDs.

## Troubleshooting

### Sign-in or token acquisition fails

Verify that the MSI has been enabled correctly. Go back to the Azure VM in the [Azure portal](https://portal.azure.com) and:

- Look at the "Configuration" page and ensure MSI enabled = "Yes."
- Look at the "Extensions" page and ensure the MSI extension deployed successfully.

If either is incorrect, you may need to redeploy the MSI on your resource again, or troubleshoot the deployment failure.

### HTTP request error responses

- *bad_request_102: Required metadata header not specified*

  Either the `Metadata` request header field is missing from your request, or is formatted incorrectly. The value must be specified as `true`, in all lower case. See the "Sample request" in the [preceding REST section](#rest) for an example.

- *unknown: Failed to retrieve token from the Active directory. For details see logs in \<file path\>*

  Verify that your HTTP GET request URI is formatted correctly, particularly the resource URI specified in the query string. See the "Sample request" in the [preceding REST section](#rest) for an example, or [Azure services that support Azure AD authentication](msi-overview.md#azure-services-that-support-azure-ad-authentication) for a list of services and their respective resource IDs.

- *unknown_source: Unknown Source \<URI\>*

  Verify that your HTTP GET request URI is formatted correctly. The `scheme:host/resource-path` portion must be specified as `http://localhost:50342/oauth2/token`. See the "Sample request" in the [preceding REST section](#rest) for an example.

## Related content

- For an overview of MSI, see [Managed Service Identity overview](msi-overview.md).
- To enable MSI on an Azure VM, see [Configure an Azure VM Managed Service Identity (MSI) using PowerShell](msi-qs-configure-powershell-windows-vm.md).

Use the following comments section to provide feedback and help us refine and shape our content.

