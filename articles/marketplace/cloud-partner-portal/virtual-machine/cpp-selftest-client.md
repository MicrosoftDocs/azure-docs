---
title: Self-test client to pre-validate a virtual machine | Azure Marketplace 
description: How to create a self-test client for pre-validating a virtual machine image for the Azure Marketplace.
services: Azure, Marketplace, Cloud Partner Portal, Virtual Machine
author: dan-wesley
ms.service: marketplace
ms.topic: conceptual
ms.date: 01/23/2018
ms.author: pabutler
---

# Create a self-test client to pre-validate an Azure virtual machine image

Use this article as a guide for creating a client service that consumes the self-test API. You can use the self-test API to pre-validate a virtual machine (VM) to ensure it meets the latest Azure Marketplace publishing requirements. This client service enables you to test a VM before you submit your offer for Microsoft certification.

## Development and testing overview

As part of the self-test process, you’ll create a local client that connects to Azure Marketplace to validate a VM running in your Azure Subscription. The VM can be running the Windows or Linux operating system.

The local client runs a script that authenticates with the self-test API, sends connection information, and receives test results.

The high-level steps for creating a self-test client are:

1. Choose the Azure Active Directory (AD) tenant for your application.
2. Register the client app.
3. Create a token for the client Azure AD app.
4. Pass the token to the self-test API.

After you create the client, you can test it against your VM.

### Self-test client authorization

The following diagram shows how authorization works for service to service calls using client credentials (shared secret or certificate.)

![Client authorization process](./media/stclient-dev-process.png)

## The self-test client API

The self-test API contains a single endpoint that supports only the POST method.  It has the following structure.

```
Uri:             https://isvapp.azurewebsites.net/selftest-vm
Method:          Post
Request Header:  Content-Type: “application/json”
Authorization:   “Bearer xxxx-xxxx-xxxx-xxxxx”
Request body:    The Request body parameters should use the following JSON format:
                 {
                   "DNSName":"XXXX.westus.cloudapp.azure.com",
                   "User":"XXX",
                   "Password":"XXX@1234567",
                   "OS":"XXX",
                   "PortNo":"22",
                   "CompanyName":"ABCD",
                 }
```

The following table describes the API fields.


|      Field         |    Description    |
|  ---------------   |  ---------------  |
|  Authorization     |  The  “Bearer xxxx-xxxx-xxxx-xxxxx” string contains the Azure Active Directory (AD) client token, which can be created by using PowerShell.          |
|  DNSName           |  DNS Name of the VM to test    |
|  User              |  User name for signing into the VM         |
|  Password          |  Password for signing into the VM          |
|  OS                |  Operating system of the VM: either `Linux` or `Windows`          |
|  PortNo            |  Open port number for connecting to the VM. The port number is typically `22` for Linux and `5986` for Windows.          |
|  |  |

## Consuming the API

You can consume the self-test API using PowerShell or cURL.

### Use PowerShell to consume the API on the Linux OS

To call the API in PowerShell, follow these steps:

1. Use the `Invoke-WebRequest` command to call the API.
2. The method is Post and content type is JSON, as shown in the following code example and screen capture.
3. Specify the body parameters in JSON format.

The following code example shows a PowerShell call to the API.

```powershell
$accesstoken = “Get token for your Client AAD App”
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Authorization", "Bearer $accesstoken")
$Body = @{
    "DNSName" = "XXXX.westus.cloudapp.azure.com"
    "User" = "XXX"
    "Password" = "XXX@123456"
    "OS" = "Linux"
    "PortNo" = "22"
    "CompanyName" = "ABCD"

} | ConvertTo-Json
$res = Invoke-WebRequest -Method "Post" -Uri $uri -Body $Body -ContentType "application/json" –Headers $headers;
$Content = $res | ConvertFrom-Json
```
The following screen capture shows an example for calling the API in PowerShell.

![Call API with PowerShell for Linux OS](./media/stclient-call-api-ps-linuxvm.png)

Using the previous example, you can retrieve the JSON and parse it to get the following details:

```powershell
$testresult = ConvertFrom-Json –InputObject (ConvertFrom-Json –InputObject $res)

  Write-Host "OSName: $($testresult.OSName)"
  Write-Host "OSVersion: $($testresult.OSVersion)"
  Write-Host "Overall Test Result: $($testresult.TestResult)"

For ($i=0; $i -lt $testresult.Tests.Length; $i++)
{
    Write-Host "TestID: $($testresult.Tests[$i].TestID)"
    Write-Host "TestCaseName: $($testresult.Tests[$i].TestCaseName)"
    Write-Host "Description: $($testresult.Tests[$i].Description)"
    Write-Host "Result: $($testresult.Tests[$i].Result)"
    Write-Host "ActualValue: $($testresult.Tests[$i].ActualValue)"
}
```

The following screen capture, which shows `$res.Content`, gives you the details of your test results in JSON format.

![JSON results from PowerShell call to Linux](./media/stclient-pslinux-rescontent-json.png)

The following screen capture shows an example of JSON test results viewed in an online JSON viewer
(for example, [Code Beautify](https://codebeautify.org/jsonviewer) or [JSON Viewer](https://jsonformatter.org/json-viewer)).

![JSON results from PowerShell call to Linux VM](./media/stclient-consume-api-pslinux-json.png)

### Use PowerShell to consume the API on the Windows OS

To call the API in PowerShell, follow these steps:

1. Use the `Invoke-WebRequest` command to call the API.
2. The method is Post and content type is JSON, as shown in the following code example and screen capture.
3. Create the Body parameters in JSON format.

The following code example shows a PowerShell call to the API.

```powershell
$accesstoken = “Get token for your Client AAD App”
$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Authorization", "Bearer $accesstoken")
$Body = @{
    "DNSName" = "XXXX.westus.cloudapp.azure.com"
    "User" = "XXX"
    "Password" = "XXX@123456"
    "OS" = "Windows"
    "PortNo" = "5986"
    "CompanyName" = "ABCD"

} | ConvertTo-Json
$res = Invoke-WebRequest -Method "Post" -Uri $uri -Body $Body -ContentType "application/json" –Headers $headers;
$Content = $res | ConvertFrom-Json
```

The following screen capture shows an example for calling the API in PowerShell.

![Call API with PowerShell for Windows VM](./media/stclient-call-api-ps-windowsvm.png)

Using the previous example, you can retrieve the JSON and parse it to get the following details:

```powershell
$testresult = ConvertFrom-Json –InputObject (ConvertFrom-Json –InputObject $res)

  Write-Host "OSName: $($testresult.OSName)"
  Write-Host "OSVersion: $($testresult.OSVersion)"
  Write-Host "Overall Test Result: $($testresult.TestResult)"

For ($i=0; $i -lt $testresult.Tests.Length; $i++)
{
    Write-Host "TestID: $($testresult.Tests[$i].TestID)"
    Write-Host "TestCaseName: $($testresult.Tests[$i].TestCaseName)"
    Write-Host "Description: $($testresult.Tests[$i].Description)"
    Write-Host "Result: $($testresult.Tests[$i].Result)"
    Write-Host "ActualValue: $($testresult.Tests[$i].ActualValue)"
}
```

The following screen capture, which shows `$res.Content`, gives you the details of your test results in JSON format.

![JSON results from PowerShell call to Windows](./media/stclient-pswindows-rescontent-json.png)

The following screen capture shows test results viewed in an online JSON viewer.
(for example, [Code Beautify](https://codebeautify.org/jsonviewer), [JSON Viewer](https://jsonformatter.org/json-viewer))

![JSON results from PowerShell call to Windows VM](./media/stclient-consume-api-pswindows-json.png)

### Use cURL to consume the API on the Linux OS

To call the API with cURL, follow these steps:

1. Use the curl command to call the API.
2. The method is Post and content type is JSON, as shown in the following code snippet.

```
CURL POST -H "Content-Type:application/json"
-H "Authorization: Bearer XXXXXX-Token-XXXXXXXX”
https://isvapp.azurewebsites.net/selftest-vm
-d '{ "DNSName":"XXXX.westus.cloudapp.azure.com", "User":"XXX", "Password":"XXXX@123456", "OS":"Linux", "PortNo":"22", "CompanyName":"ABCD"}'
```

The following screen shows an example of using curl to call the API.

![Call API using curl command](./media/stclient-consume-api-curl.png)

The following screen capture shows the JSON results from the curl call.

![JSON results from curl call](./media/stclient-consume-api-curl-json.png)


## Choose the Azure AD tenant for the app

Use the following steps to choose the Azure AD tenant where you want to create your application.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. On the top menu bar, select your account and under the Directory list, choose the Active Directory tenant where you want to register your application. Or, select the **Directory + Subscription** icon to see the Global subscription filter. The following screen capture shows an example of this filter.

   ![Select the subscription filter](./media/stclient-subscription-filter.png)

3. On the left-hand navigation bar, select **All services** and then select **Azure Active Directory**.

   In the following steps, you may need the tenant name (or directory name) or the tenant ID (or directory ID).

   **To get tenant information:**

   In **Azure Active Directory Overview**, search for “Properties” and then select **Properties**. Using the following screen capture as an example:

   - **Name** - The tenant name or directory name
   - **Directory ID** - The tenant ID or directory ID or use the scroll bar to find Properties.

   ![Azure Active Directory properties page](./media/stclient-aad-properties.png)

## Register the client app

Use the following steps to register the client app.

1. On the left-hand navigation bar, select **All services** and then select **App registrations**.
2. Under **App registrations**, select **+ New application registration**.
3. Under **Create**, provide the information required for the following fields:

   - **Name** – Enter a friendly name for the app. For example, “SelfTestClient”.
   - **Application type** – Select **Web App/API**
   - **Sign-on URL** – Type "https:\//isvapp.azurewebsites.net/selftest-vm"

4. Select **Create**.
5. Under **App registrations** or **Registered app**, copy the **Application ID**.

   ![Get the application ID](./media/stclient-app-id.png)

6. In the registered app toolbar, select **Settings**.
7. Select **Required permissions** to configure permissions for your application.
8. Under **Required permissions**, select **+ Add**.
9. Under **Add API access**, pick **Select an API**.
10. Under **Select an API**, type “Windows Azure classic deployment model” to search for the API.
11. In the search results, pick **Windows Azure classic deployment model** and then click **Select**.

    ![Configure multi-tenant for app](./media/stclient-select-api.png)

12. Under **Add API access**, pick **Select permissions**.
13. Select **Access “Windows Azure Service Management API”**.

    ![Enable API access for app](./media/stclient-enable-api-access.png)

14. Click **Select**.
15. Select **Done**.
16. Under **Settings**, select **Properties**.
17. Under **Properties**, scroll down to **Multi-tenanted**. Select **Yes**.

    ![Configure multi-tenant for app](./media/stclient-yes-multitenant.png)

18. Select **Save**.
19. Under **Settings**, select **Keys**.
20. Create a secret key by selecting the Key **DESCRIPTION** textbox. Configure the following fields:

    - Type in a key name. For example, “selftestclient”
    - On the **EXPIRES** dropdown list, select “In 1 year”.
    - Select **Save** to generate the key.
    - Under **VALUE**, copy the key.

      >[!Important]
      >You won’t be able to see the key value after you exit the **Keys** form.

    ![Key value form](./media/stclient-create-key.png)

## Create the token for the client app

You can use any of the following programs to create and get a token using the OAuth REST API:

- Postman
- cURL in Linux
- C&#35;
- PowerShell

### To create and get a token using Postman

 To ask Auth0 for tokens for any of your authorized applications, perform a POST operation to the [https://login.microsoftonline.com/common/oauth2/token](https://login.microsoftonline.com/common/oauth2/token) endpoint with a payload in the following format:

```
Method Type : POST
Base Url: https://login.microsoftonline.com/common/oauth2/token
```

Pass the following parameters in Request body:

```
Body Content-Type: x-www-form-urlencoded
client_id: XXX (Paste your Application ID of Web App/API Type client AD App)
grant_type: client_credentials
client_secret: XXX (Paste your Secret Key of Web App/API Type client AD App)
resource: https://management.core.windows.net
```

Pass the following parameters in Request header:

```
Content-Type: application/x-www-form-urlencoded
```

The following screen capture shows an example of using Postman to get a token.

![Get token with Postman](./media/stclient-postman-get-token.png)

### To create and get a token using cURL in Linux

To ask Auth0 for tokens for any of your authorized applications, perform a POST operation to the [https://login.microsoftonline.com/common/oauth2/token](https://login.microsoftonline.com/common/oauth2/token) endpoint with a payload in the following format:

```
Request:

curl --request POST \
                --url 'https://login.microsoftonline.com/common/oauth2/token' \
                --header "Content-Type:application/x-www-form-urlencoded" \
                --data "grant_type=client_credentials&client_id=XXXXX-XXXX-XXXX-XXXXXXX&client_secret=XXXXXXXXX&resource=https://management.core.windows.net"

Response:

{"token":"UClCUUKxUlkdbhE1cHLz3kyjbIZYVh9eB34A5Q21Y3FPqKGSJs","expires":"2014-02-17 18:46:08"}
```

The following screen capture shows an example of using the curl command to get a token.

![Get token with curl command](./media/stclient-curl-get-token.png)

### To create and get a token using C&#35;

To ask Auth0 for tokens for any of your authorized applications, perform a POST operation to the https:\//soamtenant.auth0.com/oauth/token endpoint with a payload in the following format:

```csharp
string clientId = "Your Application Id";
string clientSecret = "Your Application Secret";
string audience = "https://management.core.windows.net";
string authority = String.Format(System.Globalization.CultureInfo.InvariantCulture, "https://login.microsoftonline.com/common/oauth2/token");
string grantType = "client_credentials";
var client = new RestClient(authority);
var request = new RestRequest(Method.POST);
       request.AddHeader("content-type", "application/x-www-form- urlencoded");

string requestBody = "grant_type=" + grantType + "&" + "client_id=" +   clientId + "&" + "client_secret=" + clientSecret + "&" + "resource=" +  audience;

request.AddParameter("application/x-www-form-urlencoded", requestBody,  ParameterType.RequestBody);

IRestResponse response = client.Execute(request);
var content = response.Content;
var token = JObject.Parse(content)["access_token"];
```

### To create and get a token using PowerShell

To ask Auth0 for tokens for any of your authorized applications, perform a POST operation to the https:\//soamtenant.auth0.com/oauth/token endpoint with a payload in the following format:

```powershell
$clientId = "Application Id of AD Client APP";
$clientSecret = "Secret Key of AD Client APP “
$audience = "https://management.core.windows.net";
$authority = "https://login.microsoftonline.com/common/oauth2/token"
$grantType = "client_credentials";

$requestBody = "grant_type=" + $grantType + "&" + "client_id=" +  $clientId   + "&" + "client_secret=" + $clientSecret + "&" + "resource=" + $audience;

$headers = New-Object  "System.Collections.Generic.Dictionary[[String],[String]]"
             $headers.Add("ContentType", "application/x-www-form-urlencoded")
resp = Invoke-WebRequest -Method Post -Uri $authority -Headers $headers -ContentType 'application/x-www-form-urlencoded' -Body $requestBody

$token = $resp.Content | ConvertFrom-Json
$token.AccessToken
```

## Pass the client app token to the API

Pass the token to the self-test API using the following code in the authorization header:

```powershell
$redirectUri = ‘https://isvapp.azurewebsites.net/selftest-vm’
$accesstoken = ‘place your token here’

$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Authorization", "Bearer $accesstoken")
$Body =
@{
      'DNSName'="XXXX.cloudapp.azure.com";
      'User'="XXX";
      'Password'="XXXX@12345";
      'OS'="Linux";
      'PortNo'="22"
  } | ConvertTo-Json

$result=Invoke-WebRequest -Method Post -Uri $redirectUri -Headers $headers -ContentType 'application/json' -Body $Body
$result
Write-Output 'Test Results:'
$result.Content
```

## Test your self-test client

To test the client, follow these steps:

1. Deploy the VM you want to test.
2. Call the self-test API using your client app token for authorization.
3. Get the test results in JSON format.

### Test result examples

The following snippets show test results in JSON format.

**Test results for a Windows VM:**

```json
{
  "SchemaVersion": 1,
  "AppCertificationCategory": "Microsoft Single VM Certification",
  "ProviderID": "050DE427-2A99-46D4-817C-5354D3BF2AE8",
  "OSName": "Microsoft Windows Server 2016 Datacenter",
  "OSVersion": "10.0.14393",
  "CreatedDate": "06/01/2018 07:48:04",
  "TestResult": "Pass",
  "APIVersion": "1.1",
  "Tests": [
    {
      "Tes tID": "1.1.4",
      "TestCaseName": "OS Architecture",
      "Description": "Azure supports 64bit Operating System Only.",
      "Result": "Passed",
      "ActualValue": "64 Bit",
      "Re quiredValue": "OS Should be 64 bit"
    },
    {
      "TestID": "1.1.5",
      "TestCaseName": "User account dependency",
      "Description": "Application execution should not have de pendency on administrator account.",
      "Result": "Passed",
      "ActualValue": "isv",
      "RequiredValue": "Logged in user should not be an administrator"
    },
    {
      "TestID": " 1.1.6",
      "TestCaseName": "Failover Cluster",
      "Description": "Windows Server Failover Clustering feature is not yet supported, Application should not have dependency on this feature.",
      "Result": "Passed",
      "ActualValue": "Disabled",
      "RequiredValue": "Failover Clustering feature is disabled"
    },
```

**Test results for a Linux VM:**

```json
{
  "SchemaVersion": 1,
  "AppCertificationCategory": "Microsoft Single VM Certification",
  "ProviderID": "050DE427-2A99-46D4-817C-5354D3BF2AE8",
  "OSName": "Ubuntu  16.04",
  "OSVersion": "16.04",
  "CreatedDate": "06/01/2018 07:04:24",
  "TestResult": "Pass",
  "APIVersion": "1.1",
  "Tests": [
    {
      "TestID": "48",
      "TestCaseName": "Bash Hi story",
      "Description": "Bash history files should be cleared before creating the VM image.",
      "Result": "Passed",
      "ActualValue": "No file Exist",
      "RequiredVal ue": "1024"
    },
    {
      "TestID": "39",
      "TestCaseName": "Linux Agent Version",
      "Description": "Azure Linux Agent 2.2.10 and above should be installed. ",
      "Result": "Pas sed",
      "ActualValue": "2.2.20",
      "RequiredValue": "2.2.10"
    },
    {
      "TestID": "40",
      "TestCaseName": "Required Kernel Parameters",
      "Description": "Verifies the following  kernel parameters are set console=ttyS0, earlyprintk=ttyS0, rootdelay=300",
      "Result": "Passed",
      "ActualValue": "Matched Parameter: console=ttyS0,earlypri ntk=ttyS0,rootdelay=300",
      "RequiredValue": "console=ttyS0#earlyprintk=ttyS0#rootdelay=300"
    },
```

## Next steps

After you've successfully tested your Azure virtual machine, you can [Publish the offer](./cpp-publish-offer.md).
