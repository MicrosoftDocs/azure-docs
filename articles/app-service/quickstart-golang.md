---
title: 'Quickstart: Create a Go web app'
description: Deploy your first Go (GoLang) Hello World to Azure App Service in minutes.
ms.topic: quickstart
ms.date: 10/13/2022
ms.devlang: go
ms.author: msangapu
author: msangapu-msft
---

# Deploy a Go web app to Azure App Service

> [!IMPORTANT]
> Go on App Service on Linux is _experimental_.
>

In this quickstart, you'll deploy a Go web app to Azure App Service. Azure App Service is a fully managed web hosting service that supports Go 1.19 and higher apps hosted in a Linux server environment.

To complete this quickstart, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs).
- [Go 1.19](https://go.dev/dl/) or higher installed locally.

## 1 - Sample application

First, create a folder for your project.

Go to the terminal window, change into the folder you created and run `go mod init <ModuleName>`. The ModuleName could just be the folder name at this point.

The `go mod init` command creates a go.mod file to track your code's dependencies. So far, the file includes only the name of your module and the Go version your code supports. But as you add dependencies, the go.mod file will list the versions your code depends on.

Create a file called main.go. We'll be doing most of our coding here.

```go
package main
import (
    "fmt"
    "net/http"
)
func main() {
    http.HandleFunc("/", HelloServer)
    http.ListenAndServe(":8080", nil)
}
func HelloServer(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, %s!", r.URL.Path[1:])
}
```

This program uses the `net.http` package to handle all requests to the web root with the HelloServer function. The call to `http.ListenAndServe` tells the server to listen on the TCP network address `:8080`.

Using a terminal, go to your project’s directory and run `go run main.go`. Now open a browser window and type the URL `http://localhost:8080/world`. You should see the message `Hello, world!`.

## 2 - Create a web app in Azure

To host your application in Azure, you need to create Azure App Service web app in Azure. You can create a web app using the Azure CLI.

Azure CLI commands can be run on a computer with the [Azure CLI installed](/cli/azure/install-azure-cli).

Azure CLI has a command `az webapp up` that will create the necessary resources and deploy your application in a single step.

If necessary, log in to Azure using [az login](/cli/azure/authenticate-azure-cli).

```azurecli
az login
```

Create the webapp and other resources, then deploy your code to Azure using [az webapp up](/cli/azure/webapp#az-webapp-up).

```azurecli
az webapp up --runtime GO:1.19 --os linux --sku B1
```

* The `--runtime` parameter specifies what version of Go your app is running. This example uses Go 1.18. To list all available runtimes, use the command `az webapp list-runtimes --os linux --output table`.
* The `--sku` parameter defines the size (CPU, memory) and cost of the app service plan. This example uses the B1 (Basic) service plan, which will incur a small cost in your Azure subscription. For a full list of App Service plans, view the [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/linux/) page.
* You can optionally specify a name with the argument `--name <app-name>`. If you don't provide one, then a name will be automatically generated.
* You can optionally include the argument `--location <location-name>` where `<location_name>` is an available Azure region. You can retrieve a list of allowable regions for your Azure account by running the [`az account list-locations`](/cli/azure/appservice#az-appservice-list-locations) command.

The command may take a few minutes to complete. While the command is running, it provides messages about creating the resource group, the App Service plan, and the app resource, configuring logging, and doing ZIP deployment. It then gives the message, "You can launch the app at http://&lt;app-name&gt;.azurewebsites.net", which is the app's URL on Azure.

<pre>
The webapp '&lt;app-name>' doesn't exist
Creating Resource group '&lt;group-name>' ...
Resource group creation complete
Creating AppServicePlan '&lt;app-service-plan-name>' ...
Creating webapp '&lt;app-name>' ...
Creating zip with contents of dir /home/tulika/myGoApp ...
Getting scm site credentials for zip deployment
Starting zip deployment. This operation can take a while to complete ...
Deployment endpoint responded with status code 202
You can launch the app at http://&lt;app-name>.azurewebsites.net
{
  "URL": "http://&lt;app-name>.azurewebsites.net",
  "appserviceplan": "&lt;app-service-plan-name>",
  "location": "centralus",
  "name": "&lt;app-name>",
  "os": "&lt;os-type>",
  "resourcegroup": "&lt;group-name>",
  "runtime_version": "go|1.19",
  "runtime_version_detected": "0.0",
  "sku": "FREE",
  "src_path": "&lt;your-folder-location>"
}
</pre>

[!include [az webapp up command note](../../includes/app-service-web-az-webapp-up-note.md)]

## 3 - Browse to the app

Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`. If you see a default app page, wait a minute and refresh the browser.

The Go sample code is running a Linux container in App Service using a built-in image.

**Congratulations!** You've deployed your Go app to App Service.

## 4 - Clean up resources

When no longer needed, you can use the [az group delete](/cli/azure/group#az-group-delete) command to remove the resource group, and all related resources:

```azurecli-interactive
az group delete --resource-group <resource-group-name>
```
## Next steps

> [!div class="nextstepaction"]
> [Configure an App Service app](./configure-common.md)

> [!div class="nextstepaction"]
> [Tutorial: Deploy from Azure Container Registry](./tutorial-custom-container.md)

> [!div class="nextstepaction"]
> [Secure with custom domain and certificate](tutorial-secure-domain-certificate.md)
