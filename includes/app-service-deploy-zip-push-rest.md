## <a name="rest"></a>Deploy by using REST APIs 
 
You can use the [deployment service REST APIs](https://github.com/projectkudu/kudu/wiki/REST-API) to deploy the .zip file to your app in Azure. Just send a POST request to https://<app_name>.scm.azurewebsites.net/api/zipdeploy. The POST request must contain the .zip file in the message body. The deployment credentials for your app are provided in the request by using HTTP BASIC authentication. For more information, see the [.zip push deployment reference](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file). 

The following example uses the cURL tool to send a request that contains the .zip file. You can run cURL from the terminal on a Mac or Linux computer or by using Bash on Windows. Replace the `<zip_file_path>` placeholder with the path to the location of your project .zip file. Also replace `<app_name>` with the unique name of your app.

Replace the `<deployment_user>` placeholder with the username of your deployment credentials. When prompted by cURL, type in the password. To learn how to set deployment credentials for your app, see [Set and reset user-level credentials](../articles/app-service/app-service-deployment-credentials.md#userscope).   

```bash
curl -X POST -u <deployment_user> --data-binary @"<zip_file_path>" https://<app_name>.scm.azurewebsites.net/api/zipdeploy
```

This request triggers push deployment from the uploaded .zip file. You can review the current and past deployments by using the https://<app_name>.scm.azurewebsites.net/api/deployments endpoint, as shown in the following cURL example. Again, replace `<app_name>` with the name of your app and `<deployment_user>` with the username of your deployment credentials.

```bash
curl -u <deployment_user> https://<app_name>.scm.azurewebsites.net/api/deployments
```