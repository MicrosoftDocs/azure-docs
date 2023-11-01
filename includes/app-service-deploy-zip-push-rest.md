---
author: cephalin
ms.service: app-service
ms.topic: include
ms.date: 03/22/2022
ms.author: cephalin 
---
## <a name="rest"></a>Deploy ZIP file with REST APIs 

You can use the [deployment service REST APIs](https://github.com/projectkudu/kudu/wiki/REST-API) to deploy the .zip file to your app in Azure. To deploy, send a POST request to `https://<app_name>.scm.azurewebsites.net/api/zipdeploy`. The POST request must contain the .zip file in the message body. The deployment credentials for your app are provided in the request by using HTTP BASIC authentication. For more information, see the [.zip push deployment reference](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file). 

For the HTTP BASIC authentication, you need your App Service deployment credentials. To see how to set your deployment credentials, see [Set and reset user-level credentials](../articles/app-service/deploy-configure-credentials.md#userscope).

### With cURL

The following example uses the cURL tool to deploy a .zip file. Replace the placeholders `<deployment_user>`, `<zip_file_path>`, and `<app_name>`. When prompted by cURL, type in the password.

```bash
curl -X POST -u <deployment_user> --data-binary "@<zip_file_path>" https://<app_name>.scm.azurewebsites.net/api/zipdeploy
```

This request triggers push deployment from the uploaded .zip file. You can review the current and past deployments by using the `https://<app_name>.scm.azurewebsites.net/api/deployments` endpoint, as shown in the following cURL example. Again, replace `<app_name>` with the name of your app and `<deployment_user>` with the username of your deployment credentials.

```bash
curl -u <deployment_user> https://<app_name>.scm.azurewebsites.net/api/deployments
```

#### Asynchronous zip deployment

While deploying synchronously you may receive errors related to connection timeouts. Add `?isAsync=true` to the URL to deploy asynchronously. You will receive a response as soon as the zip file is uploaded with a `Location` header pointing to the pollable deployment status URL. When polling the URL provided in the `Location` header, you will receive a HTTP 202 (Accepted) response while the process is ongoing and a HTTP 200 (OK) response once the archive has been expanded and the deployment has completed successfully.

<a name='azure-ad-authentication'></a>

#### Microsoft Entra authentication

An alternative to using HTTP BASIC authentication for the zip deployment is to use a Microsoft Entra identity. Microsoft Entra identity may be needed if [HTTP BASIC authentication is disabled for the SCM site](../articles/app-service/deploy-configure-credentials.md#disable-basic-authentication).

A valid Microsoft Entra access token for the the user or service principal performing the deployment will be required. An access token can be retrieved using the Azure CLI's `az account get-access-token` command.  The access token will be used in the Authentication header of the HTTP POST request.

```bash
curl -X POST \
    --data-binary "@<zip_file_path>" \
    -H "Authorization: Bearer <access_token>" \
    "https://<app_name>.scm.azurewebsites.net/api/zipdeploy"
```

### With PowerShell

The following example uses [Publish-AzWebapp](/powershell/module/az.websites/publish-azwebapp) upload the .zip file. Replace the placeholders `<group-name>`, `<app-name>`, and `<zip-file-path>`.

```powershell
Publish-AzWebapp -ResourceGroupName <group-name> -Name <app-name> -ArchivePath <zip-file-path>
```

This request triggers push deployment from the uploaded .zip file. 

To review the current and past deployments, run the following commands. Again, replace the `<deployment-user>`, `<deployment-password>`, and `<app-name>` placeholders.

```bash
$username = "<deployment-user>"
$password = "<deployment-password>"
$apiUrl = "https://<app-name>.scm.azurewebsites.net/api/deployments"
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f $username, $password)))
$userAgent = "powershell/1.0"
Invoke-RestMethod -Uri $apiUrl -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -UserAgent $userAgent -Method GET
```
