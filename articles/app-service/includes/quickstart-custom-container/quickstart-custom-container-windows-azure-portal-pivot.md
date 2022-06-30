[Azure App Service](../../overview.md) provides pre-defined application stacks on Windows like ASP.NET or Node.js, running on IIS. However, the pre-configured application stacks [lock down the operating system and prevent low-level access](../../operating-system-functionality.md). Custom Windows containers don't have these restrictions, and let developers fully customize the containers and give containerized applications full access to Windows functionality. 

This quickstart shows you how to deploy an ASP.NET app in a Windows image from Docker Hub to App Service.

To complete this quickstart, you need:

* An [Azure account](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-docker-extension&mktingSource=vscode-tutorial-docker-extension)

## 1 - Deploy to Azure

### Sign in to Azure portal

Sign in to the Azure portal at https://portal.azure.com.


### Create Azure resources

1. Type **app services** in the search. Under **Services**, select **App Services**.

     :::image type="content" source="../../media/quickstart-custom-container/portal-search.png?text=Azure portal search details" alt-text="Screenshot of searching for 'app services' in the Azure portal.":::

1. In the **App Services** page, select **+ Create**.

1. In the **Basics** tab, under **Project details**, ensure the correct subscription is selected and then select to **Create new** resource group. Type *myResourceGroup* for the name.

    :::image type="content" source="../../media/quickstart-custom-container/project-details.png" alt-text="Screenshot of the Project details section showing where you select the Azure subscription and the resource group for the web app.":::

1. Under **Instance details**, type a globally unique name for your web app and select **Docker Container**. Select *Windows* for the **Operating System**. Select a **Region** you want to serve your app from.

    :::image type="content" source="../../media/quickstart-custom-container/instance-details-windows.png" alt-text="Screenshot of the Instance details section where you provide a name for the virtual machine and select its region, image and size.":::

1. Under **App Service Plan**, select **Create new** App Service Plan. Type *myAppServicePlan* for the name. To change to the Free tier, select **Change size**, select the **Dev/Test** tab, select **P1v3**, and select the **Apply** button at the bottom of the page.

    :::image type="content" source="../../media/quickstart-custom-container/app-service-plan-details-windows.png" alt-text="Screenshot of the Administrator account section where you provide the administrator username and password.":::

1. Select the **Next: Docker >** button at the bottom of the page.

1. In the **Docker** tab, select *Docker Hub* for the **Image Source**. Under **Docker hub options**, set the **Access Type** to *Public*. Set **Image and tag** to *mcr.microsoft.com/dotnet/samples:aspnetapp*.

    :::image type="content" source="../../media/quickstart-custom-container/docker-hub-options-windows.png" alt-text="Screenshot showing the Docker hub options.":::

1. Select the **Review + create** button at the bottom of the page.

    :::image type="content" source="../../media/quickstart-custom-container/review-create.png" alt-text="Screenshot showing the Review and create button at the bottom of the page.":::

1. After validation runs, select the **Create** button at the bottom of the page.

1. After deployment is complete, select **Go to resource**.

    :::image type="content" source="../../media/quickstart-custom-container/next-steps.png" alt-text="Screenshot showing the next step of going to the resource.":::


##  2 - Browse to the app

1. Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`.

    :::image type="content" source="../../media/quickstart-custom-container/sample-windows-custom-container-not-ready-yet.png" alt-text="Screenshot of the Windows App Service with messaging that containers without a port exposed will run in background mode.":::

Notice that the message shows **The containers without a port exposed will run in background mode.**. This indicates that if the container deployed successfully, it does not have a port exposed. When this Docker image is deployed to Azure App Service, `dotnet publish` is executed for publishing the application, but an environment variable may be missing.

## 3 - Expose port 80

We need to expose port 80 - the HTTP port - so that the container can show our application. We can do this using the [ASPNETCORE_URLS environment variable](/aspnet/core/fundamentals/host/web-host#server-urls).

1. Navigate to your App Service in the Azure portal.
   
1. Under the **Settings** section of the navigation, select **Configuration**. Ensure you are on the **Application settings** section.

    :::image type="content" source="../../media/quickstart-custom-container/azure-app-service-configuration-app-settings.png" alt-text="Screenshot showing the application settings for the custom container App Service. Configuration under the Settings menu is highlighted. The Application settings heading is also highlighted.":::

1. Add a new application setting by selecting **+ New application setting**. For the **Name**, enter *ASPNETCORE_URLS*. For the **Value**, enter `http://+:80`/.

    :::image type="content" source="../../media/quickstart-custom-container/azure-app-service-configuration-app-settings-new-application-setting.png" alt-text="Screenshot showing the application settings for the custom container App Service. The 'New application setting' button is highlighted.":::

1. Select **Save**.

## 4 - Browse the app with the port exposed

1. Browse to the deployed application in your web browser at the URL `http://<app-name>.azurewebsites.net`. You should now see the sample app.

    :::image type="content" source="../../media/quickstart-custom-container/browse-custom-container-windows.png" alt-text="Screenshot showing the deployed application.":::

## 5 - Clean up resources

[!INCLUDE [Clean-up Portal web app resources](../../../../includes/clean-up-section-portal-no-h.md)]


## Next steps

Congratulations, you've successfully completed this quickstart.

The App Service app pulls from the container registry every time it starts. If you rebuild your image, you just need to push it to your container registry, and the app pulls in the updated image when it restarts. To tell your app to pull in the updated image immediately, restart it.

> [!div class="nextstepaction"]
> [Configure custom container](../../configure-custom-container.md)

> [!div class="nextstepaction"]
> [Custom container tutorial](../../tutorial-custom-container.md)

> [!div class="nextstepaction"]
> [Multi-container app tutorial](../../tutorial-multi-container-app.md)
