## <a name="rest"></a>Deploy using REST APIs 
 
You can use the [deployment service REST APIs](https://github.com/projectkudu/kudu/wiki/REST-API) to deploy the .zip file to your app in Azure. For more information, see the [.zip push deployment reference topic](https://github.com/projectkudu/kudu/wiki/Deploying-from-a-zip-file). 

The following example uses the cURL tool to send a POST request that contains the .zip file in the message body. You can run curl from the terminal on a Mac or Linux computer or using Bash on Windows. Replace the `<zip_file_path>` placeholder with the path to the location of your project .zip file. Also replace `<app_name>` with the unique name of your app.

The deployment API requires you to authenticate using HTTP authentication with the deployment credentials of your app. Replace the `<deployment_user>` placeholder with the username of your deployment credentials. When promoted by cURL, type in the password. To learn how to set deployment credentials, see [Set and reset user-level credentials](../articles/app-service/app-service-deployment-credentials.md#userscope).   

```bash
curl POST -u <deployment_user> --data-binary @<zip_file_path> https://<app_name>.scm.azurewebsites.net/api/zipdeploy
```

This request triggers push deployment from the uploaded .zip file. 