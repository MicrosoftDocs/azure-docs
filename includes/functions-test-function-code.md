## <a name="test"></a>Test the function

Use cURL to test the deployed function on a Mac or Linux computer or using Bash on Windows. Execute the following cURL command, replacing the `<app_name>` placeholder with the name of your function app. Append the query string `&name=<yourname>` to the URL.

```bash
curl http://<app_name>.azurewebsites.net/api/HttpTriggerJS1?name=<yourname>
```  

![Function response shown in a browser.](./media/functions-test-function-code/functions-azure-cli-function-test-curl.png)  

If you don't have cURL available in your command line, enter the same URL in the address of your web browser. Again, replace the `<app_name>` placeholder with the name of your function app, and append the query string `&name=<yourname>` to the URL and execute the request. 

    http://<app_name>.azurewebsites.net/api/HttpTriggerJS1?name=<yourname>
   
![Function response shown in a browser.](./media/functions-test-function-code/functions-azure-cli-function-test-browser.png)  
