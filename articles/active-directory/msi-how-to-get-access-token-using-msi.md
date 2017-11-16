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

1. An MSI [**service principal**](develop/active-directory-dev-glossary.md#service-principal-object), which is [created upon enabling MSI](msi-overview.md#how-does-it-work) on the VM. The service principal can then be given access to Azure resources, and used as an identity by client applications during sign-in and resource access. Traditionally, in order for a client to be able to access secured resources under its own identity, it must:  

   - be registered with Azure AD as a confidential/web client application, and consented for use by a tenant's user(s)/admin
   - sign in under its service principal, using the ID+secret credentials generated during registration (which are likely embedded in the client code)

  With MSI, your client application no longer needs to do either, as it can sign in under the MSI service principal. 

2. An [**app-only access token**](develop/active-directory-dev-glossary.md#access-token), which is issued for the MSI service principal and used for secured access to a given resource's API(s). As such, there is also no need for the client to authenticate and obtain an access token under its own service principal. The token is suitable for use as a bearer token in [service-to-service calls requiring client credentials](active-directory-protocols-oauth-service-to-service.md).

This article shows you various ways a client application can use the MSI service principal and/or access token, in order to access secured resources.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../includes/msi-qs-configure-prereqs.md)]

If you plan to use the Azure PowerShell or Azure CLI examples in this article, be sure to install the latest version of [Azure PowerShell](https://www.powershellgallery.com/packages/AzureRM) or [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli). 

> [!IMPORTANT]
> - All sample code/script in this article assumes the client is running on an MSI-enabled Virtual Machine. Use the VM "Connect" feature in the Azure portal, to remotely connect to your VM. For details on enabling MSI on a VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](msi-qs-configure-portal-windows-vm.md), or one of the variant articles (using PowerShell, CLI, a template, or an Azure SDK). 
> - To prevent errors in the sign-in examples, the VM's MSI must be given "Reader" access to itself (at the VM scope or higher) to allow Azure Resource Manager operations on
 the VM. See [Assign a Managed Service Identity (MSI) access to a resource using the Azure portal](msi-howto-assign-access-portal.md) for details.

## Code examples

As discussed previously, MSI offers a service principal and access token for resource access. The examples below show of variety of ways to do one or both functions, starting from concrete to more abstract methods:

|      Client type       |       Demonstration       |  
| ---------------------- | ------------------------- | 
| [HTTP/REST](#httprest) | Acquire token             | 
| <br>Language snippets: |                           |             
| [.NET C#](#net-c)      | Acquire token             |                 
| [Go](#go)              | Acquire token             |                                                          
| <br>SDKs and samples:  |                           |                   
| [.NET](https://github.com/Azure-Samples/windowsvm-msi-arm-dotnet) | Deploy an ARM template from a Windows VM using Managed Service Identity |
| [.NET Core](https://github.com/Azure-Samples/linuxvm-msi-keyvault-arm-dotnet/) | Call Azure services from a Linux VM using Managed Service Identity |  
| [Node.js](https://azure.microsoft.com/resources/samples/resources-node-manage-resources-with-msi/) | Manage resources using Managed Service Identity |   
| [Python](https://azure.microsoft.com/resources/samples/resource-manager-python-manage-resources-with-msi/) | Use MSI to authenticate simply from inside a VM |   
| [Ruby](https://azure.microsoft.com/resources/samples/resources-ruby-manage-resources-with-msi/) | Manage resources from an MSI-enabled VM |     
| <br>Scripting hosts / CLIs: |                      |           
| [Azure PowerShell](#azure-powershell) | Acquire token, Sign-in, Access Azure Resource Manager |               
| [Azure CLI](#azure-cli)| Sign-in, Access Azure Resource Manager |        
| [Bash/CURL](#bashcurl) | Acquire token             |                                     

### HTTP/REST 

REST provides a fundamental interface for acquiring an access token, accessible to any client application running on the VM that can make HTTP REST calls. This is similar to the Azure AD programming model, except the client uses a localhost endpoint on the virtual machine (vs and Azure AD endpoint).

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

The following script demonstrates how to acquire an MSI access token for an Azure VM:

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

For complete code samples, see:

- [Deploy an ARM template from a Windows VM using Managed Service Identity](https://github.com/Azure-Samples/windowsvm-msi-arm-dotnet) (.NET)
- [Call Azure services from a Linux VM using Managed Service Identity](https://github.com/Azure-Samples/linuxvm-msi-keyvault-arm-dotnet/) (.NET Core)

### Go

The following script demonstrates how to acquire an MSI access token for an Azure VM:

```
package main

import (
  "fmt"
  "io/ioutil"
  "net/http"
  "net/url"
  "encoding/json"
)

type responseJson struct {
  AccessToken string `json:"access_token"`
  RefreshToken string `json:"refresh_token"`
  ExpiresIn string `json:"expires_in"`
  ExpiresOn string `json:"expires_on"`
  NotBefore string `json:"not_before"`
  Resource string `json:"resource"`
  TokenType string `json:"token_type"`
}

func main() {
    
    // Create HTTP request for MSI token to access Azure Resource Manager
    var msi_endpoint *url.URL
    msi_endpoint, err := url.Parse("http://localhost:50342/oauth2/token")
    if err != nil {
      fmt.Println("Error creating URL: ", err)
      return 
    }
    msi_parameters := url.Values{}
    msi_parameters.Add("resource", "https://management.azure.com/")
    msi_endpoint.RawQuery = msi_parameters.Encode()
    req, err := http.NewRequest("GET", msi_endpoint.String(), nil)
    if err != nil {
      fmt.Println("Error creating HTTP request: ", err)
      return 
    }
    req.Header.Add("Metadata", "true")

    // Call MSI /token endpoint
    client := &http.Client{}
    resp, err := client.Do(req) 
    if err != nil{
      fmt.Println("Error calling token endpoint: ", err)
      return
    }

    // Pull out response body
    responseBytes,err := ioutil.ReadAll(resp.Body)
    defer resp.Body.Close()
    if err != nil {
      fmt.Println("Error reading response body : ", err)
      return
    }

    // Unmarshall response body into struct
    var r responseJson
    err = json.Unmarshal(responseBytes, &r)
    if err != nil {
      fmt.Println("Error unmarshalling the response:", err)
      return
    }

    // Print HTTP response and marshalled response body elements to console
    fmt.Println("Response status:", resp.Status)
    fmt.Println("access_token: ", r.AccessToken)
    fmt.Println("refresh_token: ", r.RefreshToken)
    fmt.Println("expires_in: ", r.ExpiresIn)
    fmt.Println("expires_on: ", r.ExpiresOn)
    fmt.Println("not_before: ", r.NotBefore)
    fmt.Println("resource: ", r.Resource)
    fmt.Println("token_type: ", r.TokenType)
}
```

### Node

For complete code samples, see:

- [Manage resources using Managed Service Identity](https://azure.microsoft.com/resources/samples/resources-node-manage-resources-with-msi/)

### Python

For complete code samples, see:

- [Use MSI to authenticate simply from inside a VM](https://azure.microsoft.com/resources/samples/resource-manager-python-manage-resources-with-msi/) 

### Ruby

For complete code samples, see:

- [Manage resources from an MSI-enabled VM](https://azure.microsoft.com/resources/samples/resources-ruby-manage-resources-with-msi/) 

### Azure CLI

The following script demonstrates how to:

1. Sign in to Azure AD under the VM's MSI service principal
2. Call Azure Resource Manager and get the VM's service principal ID. CLI takes care of managing token acquisition/use for you automatically. Be sure to substitute your virtual machine name for `<VM-NAME>`.

```azurecli
az login --msi
spID=$(az resource list -n <VM-NAME> --query [*].identity.principalId --out tsv)
echo The MSI service principal ID is $spID
```

### Azure PowerShell

The following script demonstrates how to:

1. Acquire an MSI access token for the VM.
2. Use the access token to call an Azure Resource Manager REST API and get information about the VM. Be sure to substitute your subscription ID, resource group name, and virtual machine name for `<SUBSCRIPTION-ID>`, `<RESOURCE-GROUP>`, and `<VM-NAME>`, respectively.
2. Use the access token to sign in to Azure AD, under the corresponding MSI service principal. 
3. Call an Azure Resource Manager cmdlet to get information about the VM. PowerShell takes care of managing token acquisition/use for you automatically.

```azurepowershell
# Get an access token for the MSI
$response = Invoke-WebRequest -Uri http://localhost:50342/oauth2/token `
                              -Method GET -Body @{resource="https://management.azure.com/"} -Headers @{Metadata="true"}
$content =$response.Content | ConvertFrom-Json
$access_token = $content.access_token
echo "The MSI access token is $access_token"

# Use the access token to get resource information for the VM
$vmInfoRest = (Invoke-WebRequest -Uri https://management.azure.com/subscriptions/<SUBSCRIPTION-ID>/resourceGroups/<RESOURCE-GROUP>/providers/Microsoft.Compute/virtualMachines/<VM-NAME>?api-version=2017-12-01 -Method GET -ContentType "application/json" -Headers @{ Authorization ="Bearer $access_token"}).content
echo "JSON returned from call to get VM info:"
echo $vmInfoRest

# Use the access token to sign in under the MSI service principal. -AccountID can be any string to identify the session.
Login-AzureRmAccount -AccessToken $access_token -AccountId "MSI@50342"

# Call Azure Resource Manager to get the service principal ID for the VM's MSI. 
$vmInfoPs = Get-AzureRMVM -ResourceGroupName <RESOURCE-GROUP> -Name <VM-NAME>
$spID = $vmInfoPs.Identity.PrincipalId
echo "The MSI service principal ID is $spID"
```

### Bash/CURL

The following script demonstrates how to acquire an MSI access token for an Azure VM:

```bash
response=$(curl http://localhost:50342/oauth2/token --data "resource=https://management.azure.com/" -H Metadata:true -s)
access_token=$(echo $response | python -c 'import sys, json; print (json.load(sys.stdin)["access_token"])')
echo The MSI access token is $access_token
```

## Additional information

### Token expiration

The local MSI subsystem caches tokens. Therefore, you can call it as often as you like, and an on-the-wire call to Azure AD results only if:
- a cache miss occurs due to no token in the cache
- the token is expired

If you cache the token in your code, you should be prepared to handle scenarios where the resource indicates that the token is expired.

### Resource IDs for Azure services

See [Azure services that support Azure AD authentication](msi-overview.md#azure-services-that-support-azure-ad-authentication) for a list of resources that support Azure AD and have been tested with MSI, and their respective resource IDs.

### HTTP error handling guidance

The MSI endpoint signals errors via the status code field of the HTTP response message header, as either 4xx or 5xx errors:

| Status Code | Error Reason | How To Handle |
| ----------- | ------------ | ------------- |
| 4xx Error in request. | One or more of the request parameters was incorrect. | Do not retry.  Examine the error details for more information.  4xx errors are design-time errors.|
| 5xx Transient error from service. | The MSI sub-system or Azure Active Directory returned a transient error. | It is safe to retry after waiting for at least 1 second.  If you retry too quickly or too often, Azure AD may return a rate limit error (429).|

If an error occurs, the corresponding HTTP response body contains JSON with the error details:

| Element | Description |
| ------- | ----------- |
| error   | Error identifier. |
| error_description | Verbose description of error. **Error descriptions can change at any time. Do not write code that branches based on values in the error description.**|

#### HTTP response reference

This section documents the possible error responses. A "200 OK" status is a successful response, and the access token is contained in the response body JSON, in the access_token element.

| Status code | Error | Error Description | Solution |
| ----------- | ----- | ----------------- | -------- |
| 400 Bad Request | invalid_resource | AADSTS50001: The application named *\<URI\>* was not found in the tenant named *\<TENANT-ID\>*. This can happen if the application has not been installed by the administrator of the tenant or consented to by any user in the tenant. You might have sent your authentication request to the wrong tenant.\ | (Linux only) |
| 400 Bad Request | bad_request_102 | Required metadata header not specified | Either the `Metadata` request header field is missing from your request, or is formatted incorrectly. The value must be specified as `true`, in all lower case. See the "Sample request" in the [preceding REST section](#rest) for an example.|
| 401 Unauthorized | unknown_source | Unknown Source *\<URI\>* | Verify that your HTTP GET request URI is formatted correctly. The `scheme:host/resource-path` portion must be specified as `http://localhost:50342/oauth2/token`. See the "Sample request" in the [preceding REST section](#rest) for an example.|
| TBD          | invalid_request | The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed. | TBD |
| TBD          | unauthorized_client | The client is not authorized to request an access token using this method. | Caused by a request that didn’t use local loopback to call the extension, or on a VM that doesn’t have an MSI configured correctly. |
| TBD          | access_denied | The resource owner or authorization server denied the request. | TBD |
| TBD          | unsupported_response_type | The authorization server does not support obtaining an access token using this method. | TBD |
| TBD          | invalid_scope | The requested scope is invalid, unknown, or malformed. | TBD |
| 500 Internal server error | unknown | Failed to retrieve token from the Active directory. For details see logs in *\<file path\>* | Verify that MSI has been enabled on the VM. See [Configure a VM Managed Service Identity (MSI) using the Azure portal](msi-qs-configure-portal-windows-vm.md) if you need assistance with VM configuration.<br><br>Also verify that your HTTP GET request URI is formatted correctly, particularly the resource URI specified in the query string. See the "Sample request" in the [preceding REST section](#rest) for an example, or [Azure services that support Azure AD authentication](msi-overview.md#azure-services-that-support-azure-ad-authentication) for a list of services and their respective resource IDs.

### PowerShell/CLI error handling guidance 

Responses such as the following may indicate that the VM's MSI has not been correctly configured:

- PowerShell: *Invoke-WebRequest : Unable to connect to the remote server*
- CLI: *MSI: Failed to retrieve a token from 'http://localhost:50342/oauth2/token' with an error of 'HTTPConnectionPool(host='localhost', port=50342)* 

If you receive one of these errors, return to the Azure VM in the [Azure portal](https://portal.azure.com) and:

- Go to the **Configuration** page and ensure "Managed service identity" is set to "Yes."
- Go to the **Extensions** page and ensure the MSI extension deployed successfully.

If either is incorrect, you may need to redeploy the MSI on your resource again, or troubleshoot the deployment failure. See [Configure a VM Managed Service Identity (MSI) using the Azure portal](msi-qs-configure-portal-windows-vm.md) if you need assistance with VM configuration.


## Related content

- For an overview of MSI, see [Managed Service Identity overview](msi-overview.md).
- To enable MSI on an Azure VM, see [Configure an Azure VM Managed Service Identity (MSI) using PowerShell](msi-qs-configure-powershell-windows-vm.md).

Use the following comments section to provide feedback and help us refine and shape our content.








