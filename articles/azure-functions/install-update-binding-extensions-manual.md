---
title: Manually install or update Azure Functions binding extensions
description: Learn how to install or update Azure Functions binding extensions for deployed function apps.

ms.topic: reference
ms.date: 09/26/2018
---

# Manually install or update Azure Functions binding extensions from the portal

Starting with version 2.x, the Azure Functions runtime uses binding extensions to implement code for triggers and bindings. Binding extensions are provided in NuGet packages. To register an extension, you essentially install a package. When developing functions, the way that you install binding extensions depends on the development environment. For more information, see [Register binding extensions](./functions-bindings-register.md) in the triggers and bindings article.

Sometimes you need to manually install or update your binding extensions in the Azure portal. For example, you may need to update a registered binding to a newer version. You may also need to register a supported binding that can't be installed in the **Integrate** tab in the portal.

## Install a binding extension

Use the following steps to manually install or update extensions from the portal.

1. In the [Azure portal](https://portal.azure.com), locate your function app and select it. Choose the **Overview** tab and select **Stop**.  Stopping the function app unlocks files so that changes can be made.

1. Choose the **Platform features** tab and under **Development tools** select **Advanced Tools (Kudu)**. The Kudu endpoint (`https://<APP_NAME>.scm.azurewebsites.net/`) is opened in a new window.

1. In the Kudu window, select **Debug console** > **CMD**.  

1. In the command window, navigate to `D:\home\site\wwwroot` and choose the delete icon next to `bin` to delete the folder. Select **OK** to confirm the deletion.

1. Choose the edit icon next to the `extensions.csproj` file, which defines the binding extensions for the function app. The project file is opened in the online editor.

1. Make the required additions and updates of **PackageReference** items in the **ItemGroup**, then select **Save**. The current list of supported package versions can be found in the [What packages do I need?](https://github.com/Azure/azure-functions-host/wiki/Updating-your-function-app-extensions#what-nuget-packages-do-i-need) wiki article. All three Azure Storage bindings require the Microsoft.Azure.WebJobs.Extensions.Storage package.

1. From the `wwwroot` folder, run the following command to rebuild the referenced assemblies in the `bin` folder.

    ```cmd
    dotnet build extensions.csproj -o bin --no-incremental --packages D:\home\.nuget
    ```

1. Back in the **Overview** tab in the portal, choose **Start** to restart the function app.

## Next steps

> [!div class="nextstepaction"]
> [Learn more about Azure functions triggers and bindings](functions-triggers-bindings.md)
