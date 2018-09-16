## <a name="rest"></a>Deploy ZIP file with REST APIs 

You can use the [deployment service REST APIs](https://github.com/projectkudu/kudu/wiki/REST-API) to deploy the .zip file to your app in Azure. To deploy, send a POST request to https://<app_name>.scm.azurewebsites.net/api/zipdeploy. The POST request must contain the .zip file in the message body. The deployment credentials for your app are provided in the request by using HTTP BASIC authentication. For more information, see the [.zip push deployment reference](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file). 

For the HTTP BASIC authentication, you need your App Service deployment credentials. To see how to set your deployment credentials, see [Set and reset user-level credentials](../articles/app-service/app-service-deployment-credentials.md#userscope).

### With cURL

The following example uses the cURL tool to deploy a .zip file. Replace the placeholders `<username>`, `<password>`, `<zip_file_path>`, and `<app_name>`. When prompted by cURL, type in the password.

```bash
curl -X POST -u <deployment_user> --data-binary @"<zip_file_path>" https://<app_name>.scm.azurewebsites.net/api/zipdeploy
```

This request triggers push deployment from the uploaded .zip file. You can review the current and past deployments by using the `https://<app_name>.scm.azurewebsites.net/api/deployments` endpoint, as shown in the following cURL example. Again, replace `<app_name>` with the name of your app and `<deployment_user>` with the username of your deployment credentials.

```bash
curl -u <deployment_user> https://<app_name>.scm.azurewebsites.net/api/deployments
```

### With PowerShell

The following example uses [Invoke-RestMethod](/powershell/module/microsoft.powershell.utility/invoke-restmethod) to send a request that contains the .zip file. Replace the placeholders `<deployment_user>`, `<deployment_password>`, `<zip_file_path>`, and `<app_name>`.

```PowerShell
#PowerShell
$username = "<deployment_user>"
$password = "<deployment_password>"
$filePath = "<zip_file_path>"
$apiUrl = "https://<app_name>.scm.azurewebsites.net/api/zipdeploy"
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(("{0}:{1}" -f $username, $password)))
$userAgent = "powershell/1.0"
Invoke-RestMethod -Uri $apiUrl -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -UserAgent $userAgent -Method POST -InFile $filePath -ContentType "multipart/form-data"
```

This request triggers push deployment from the uploaded .zip file. To review the current and past deployments, run the following commands. Again, replace the `<app_name>` placeholder.

```bash
$apiUrl = "https://<app_name>.scm.azurewebsites.net/api/deployments"
Invoke-RestMethod -Uri $apiUrl -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -UserAgent $userAgent -Method GET
```
