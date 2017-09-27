---
title: How to use an Azure Managed Service Identity for sign-in and token acquisition
description: Step by step instructions for using an MSI service principal for sign-in, and acquiring an access token.
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
ms.date: 09/25/2017
ms.author: bryanla
---

# How to use an Azure Managed Service Identity for sign-in and token acquisition 
[!INCLUDE[preview-notice](../../includes/active-directory-msi-preview-notice.md)]
After you've enabled MSI on an Azure resource, such as an Azure VM, you can use the MSI for sign-in and to request an access token. This article shows you various ways to use an MSI [service principal](develop/active-directory-dev-glossary.md#service-principal-object) for sign-in, and acquire an [app-only access token](develop/active-directory-dev-glossary.md#access-token) to access other resources.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../includes/msi-qs-configure-prereqs.md)]

If you plan to use the PowerShell examples in this article, be sure to install [Azure PowerShell version 4.3.1](https://www.powershellgallery.com/packages/AzureRM) or greater, if you haven't already.


> [!IMPORTANT]
> - All sample code/script in this article assumes the client is running on an MSI-enabled Virtual Machine. For details on enabling MSI on a VM, see [Configure a VM Managed Service Identity (MSI) using the Azure portal](msi-qs-configure-portal-windows-vm.md), or one of the variant articles (using PowerShell, CLI, or a template). 
> - To prevent authorization errors (403/AuthorizationFailed) in the code/script, the VM's identity must be given "Reader" access to the VM instance to perform some of the operations. See [Assign a Managed Service Identity (MSI) access to a resource using the Azure portal](msi-howto-assign-access-portal.md) for details.
> - Before proceeding to one of the following sections, use the VM "Connect" feature in the Azure portal, to remotely connect to your MSI-enabled VM.

## How to sign in using an MSI identity

In cases where a secure client application needs to sign in to Azure Active Directory (AD) under its own identity, MSI allows you to use an identity representing the host Azure resource instead. Previously, you would have been required to register the application with Azure AD, and authenticate using the client application's identity. 

In the examples below, we show how to use a VM's MSI service principal for sign-in.

### PowerShell

The following script demonstrates how to:

- acquire an MSI access token
- use the access token to sign in to Azure AD under the corresponding MSI service principal
- use the MSI service principal to make an Azure Resource Manager call, to obtain the ID of the service principal

```powershell
# Get an access token from MSI
$response = Invoke-WebRequest -Uri http://localhost:50342/oauth2/token `
                              -Method GET -Body @{resource="https://management.azure.com/"} -Headers @{Metadata="true"}
$content =$response.Content | ConvertFrom-Json
$access_token = $content.access_token
# Use the access token to sign in under the MSI service principal
Login-AzureRmAccount -AccessToken $access_token -AccountId “CLIENT”

# The MSI service principal is now signed in for this session.
# Next, a call to Azure Resource Manager is made to get the service principal ID for the VM's MSI. 
$spID = (Get-AzureRMVM -ResourceGroupName <RESOURCE-GROUP> -Name <VM-NAME>).identity.principalid
echo "The MSI service principal ID is $spID"
```
   
### Azure CLI

The following script demonstrates how to:

- sign in to Azure AD under the corresponding MSI service principal
- use the MSI service principal to make an Azure Resource Manager call, to obtain the ID of the service principal

```azurecli-interactive
az login --msi
spID=$(az resource list -n <VM-NAME> --query [*].identity.principalId --out tsv)
echo The MSI service principal ID is $spID
```

## How to acquire an access token from MSI

Instead of acquiring an app-only access token from Azure AD, an MSI-enabled Azure resource provides the OAuth endpoint for client applications. The endpoint allows the client to obtain an access token under the identity provided by the MSI, rather than the client's application identity. 

In the examples below, we show how to use a VM's MSI for token acquisition.

### Get a token using .NET

> [!IMPORTANT]
> MSI and Azure AD are not integrated. Therefore, the Azure AD Authentication Libraries (ADAL) cannot be used for MSI token acquisition. For more details, see [MSI known issues](msi-known-issues.md).

```csharp
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

### Get a token using PowerShell

```powershell
# Get an access token from MSI
$response = Invoke-WebRequest -Uri http://localhost:50342/oauth2/token `
                              -Method GET -Body @{resource="https://management.azure.com/"} -Headers @{Metadata="true"}
$content =$response.Content | ConvertFrom-Json
$access_token = $content.access_token
echo "The MSI access token is $access_token"
```

### Get a token using CURL

```bash
response=$(curl http://localhost:50342/oauth2/token --data "resource=https://management.azure.com/" -H Metadata:true -s)
access_token=$(echo $response | python -c 'import sys, json; print (json.load(sys.stdin)["access_token"])')
echo The MSI access token is $access_token
```

### Get a token using REST

TBD (simlar to https://docs.microsoft.com/azure/app-service/app-service-managed-service-identity#using-the-rest-protocol)

## How to use MSI with Azure SDK libraries

### .NET library

TBD

## Additional information

### Token expiration

TBD (do we recommend calling every time or caching? See Rashid's sample for catching the exception after timeout and retrying.)

### Resource IDs for Azure services

See the [Azure services that support Azure AD authentication](msi-overview.md#azure-services-that-support-azure-ad-authentication) topic for a list of services that support MSI, and their respective resource IDs.

## Troubleshooting

If the MSI for the resource does not show up in the list of available identities, verify that the MSI has been enabled correctly. In our case, we can go back to the Azure VM in the [Azure portal](https://portal.azure.com) and:

- Look at the "Configuration" page and ensure MSI enabled = "Yes."
- Look at the "Extensions" page and ensure the MSI extension deployed successfully.

If either is incorrect, you may need to redeploy the MSI on your resource again, or troubleshoot the deployment failure.

## Related content

- For an overview of MSI, see [Managed Service Identity overview](msi-overview.md).
- To enable MSI on an Azure VM, see [Configure an Azure VM Managed Service Identity (MSI) using PowerShell](msi-qs-configure-powershell-windows-vm.md).

Use the following comments section to provide feedback and help us refine and shape our content.

