<properties
	pageTitle="Build and deploy a Java API app in Azure App Service"
	description="Learn how to create a Java API app package and deploy it to Azure App Service."
	services="app-service\api"
	documentationCenter="java"
	authors="pkefal"
	manager="mohisri",
	editor="jimbe"/>

<tags
	ms.service="app-service-api"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="java"
	ms.topic="get-started-article"
	ms.date="08/11/2015"
	ms.author="pakefali"/>

# Build and deploy a Java API app in Azure App Service

> [AZURE.SELECTOR]
- [.NET - Visual Studio 2015](app-service-dotnet-create-api-app.md)
- [.NET - Visual Studio Code](app-service-create-aspnet-api-app-using-vscode.md)
- [Node.js](app-service-api-nodejs-api-app.md)
- [Java](app-service-api-java-api-app.md)

This tutorial shows how to create a Java application and deploy it to Azure App Service API Apps using [Git](http://git-scm.com). The instructions in this tutorial can be followed on any operating system that is capable of running Java. This tutorial is also using [Gradle](https://gradle.org) to enable build automation and package dependency resolution for the Java application. Lastly, [RESTEasy](http://resteasy.jboss.org/) is used to create the RESTful Service, fully implementing the [JaxRS](https://jax-rs-spec.java.net/) specification.

Here is a screenshot of the completed application:

![][sample-api-app-page]

## Create an API app in the Azure Portal

> [AZURE.NOTE] To complete this tutorial, you need a Microsoft Azure account. If you don't have an account, you can [activate your MSDN subscriber benefits](/pricing/member-offers/msdn-benefits-details/) or [sign up for a free trial](/pricing/free-trial/).
 You can also try for free [App Service App Samples](http://tryappservice.azure.com).

1. Log in to the [Azure preview portal](https://portal.azure.com).

2. Click **NEW** at the bottom left of the portal.

3. Click **Web + Mobile > API App**.

	![][portal-quick-create]

4. Enter a value for **Name**, such as JavaAPIApp.

5. Select an App Service plan or create a new one. If you create a new plan, select the pricing tier, location, and other options.

	![][portal-create-api]

6. Click **Create**.

	![][api-app-blade]

	If you left the **Add to Startboard** check box selected, the portal automatically opens the blade for your API app after it's created. If you cleared the checkbox, click **Notifications** on the portal home page to see the API app creation status, and click the notification to go to the blade for the new API app.

7. Click **Settings > Application Settings**.

9. Set the Access level to **Public (anonymous)**.

11. Click **Save**.

	![][set-api-app-access-level]

## Enable Git publishing for the new API app

[Git](http://git-scm.com) is a distributed version control system that you can use to deploy your Azure Website. You'll store the code you write for your API app in a local Git repository, and you'll deploy your code to Azure by pushing to a remote repository. This method of deployment is a feature of App Service web apps that you can use in an API app because API apps are based on web apps: an API app in Azure App Service is a web app with additional features for hosting web services.  

In the portal you manage the features specific to API apps in the **API App** blade, and you manage the features that are shared with web apps in the **API App Host** blade. So in this section you go to the **API App Host** blade to configure the Git deployment feature.

1. In the API App blade, click **API App host**.

	![][api-app-host]

2. Find the **Deployment** section of the **API App** blade and click **Set up continuous deployment**. You may need to scroll down to see this part of the blade.

	![][deployment-part]

3. Click **Choose Source > Local Git Repository**.

5. Click **OK**.

	![][setup-git-publishing]

6. If you have have not previously set up deployment credentials for publishing an API app or other App Service app, set them up now:

	* Click **Set deployment credentials**.

	* Create a user name and password.

	* Click **Save**.

	![][deployment-credentials]

1. In the **API App Host** blade, click **Settings > Properties**. The URL of the remote Git repository that you'll deploy to is shown under "GIT URL".

2. Copy the URL for use later in the tutorial.

	![][git-url]

## Enable Java runtime on the new API App

For the API App to successfully host an Java app, we have to enable the Java runtime and choose an application server. The portal provides an easy way to do this. We're going to enable Java 7 and Jetty to host our application.

1. In the API App blade, click **API App host**.

	![][api-app-host]

2. Click **Settings > Application settings**. There, enable Java and select Jetty as the application server. Click **Save**

	![][api-app-enable-java]

This will **enable the Java runtime** on your API App and create a **webapps/** folder in your site's root. This folder will contain all the .war files of your applications.

## Download and inspect code for a Java API app

In this section, you'll download and take a look at the code provided as part of the JavaAPIApp sample.

1. Download the code in [this GitHub repository](http://go.microsoft.com/fwlink/?LinkId=571009). You can either clone the repository or click **Download Zip** to download it as a .zip file. If you download the .zip file, unzip it in your local disk.

2. Navigate to the folder were you unzipped the sample and navigate to the `build\libs\` folder.

	![][api-app-folder-browse]

3. Open the **apiapp.json** file in a text editor and inspect the contents.

	![][apiapp-json]

	Azure App Service has two prerequisites in order to recognize a Java application as an API App:

	+ A file named *apiapp.json* has to be present in the root directory of the application.
	+ A Swagger 2.0 metadata endpoint has to be exposed by the application. The URL of this endpoint is specified in the *apiapp.json* file.

	Notice the **apiDefinition** property. The path for this URL is relative to your API's URL and it points to the Swagger 2.0 endpoint. Azure App Service uses this property to discover the definition of your API and enable many of the App Service API app capabilities.

4. Navigate to `src\main\java\com\microsoft\trysamples\javaapiapp`, open the **App.java** file and inspect the code.

	![][app-java]

	The code uses the Swagger package for JaxRS to create the Swagger 2.0 endpoint.

		beanConfig.setVersion("1.0.0");
		beanConfig.setBasePath("/JavaAPIApp/api");
		beanConfig.setHost(websitehostname);
		beanConfig.setResourcePackage("com.microsoft.trysamples.javaapiapp");
		beanConfig.setSchemes(new String[]{"http", "https"});
		beanConfig.setScan(true);

	The `setVersion` method sets the API version in metadata served by Swagger.

	The `setBasePath` method sets the base path which Swagger uses to generate the metadata. This URL is relative to the base path of your API app.

	The `setHost` method sets the host on which the API is listening. In this case we're using the `websitehostname` variable which we've assigned a few lines before to dynamically set to `localhost` when running locally or the API app hostname when the application is running in Azure App Service.

	The `setResourcePackage` method sets the package which Swagger will scan and include in the Swagger.json file, containing the API metadata.

	The `setSchemes` method defines the schemes supported.

	The `setScan` method makes Swagger generate the app documentation.

	There are more methods available that customize the output of Swagger when using RESTEasy and they can be found at Swagger's [Wiki page](https://github.com/swagger-api/swagger-core/wiki/Swagger-Core-RESTEasy-2.X-Project-Setup-1.5#using-swaggers-beanconfig)

	> [AZURE.NOTE] The Swagger metadata file can be accessed at `/JavaAPIApp/api/swagger.json`.

## Run the API app code locally

In this section you run the application locally to verify it works prior to deployment.

1. Navigate to the folder were you downloaded the sample.

2. Open a command line prompt and enter the following command:

		gradlew.bat

3. When the command finishes, enter the following command:

		gradlew.bat jettyRunWar

	The command line window output shows:

		17:25:49 INFO  JavaAPIApp runs at:
		17:25:49 INFO    http://localhost:8080/JavaAPIApp

5. Navigate your browser to `http://localhost:8080/JavaAPIApp/`

	You see the following page

	![][sample-api-app-page]

6. To view the Swagger.json file, navigate to `http://localhost:8080/JavaAPIApp/api/Swagger.json`.

## Publish your API app code to Azure App Service

In this section you create a local Git repository and push from that repository to Azure in order to deploy your sample application to the API app running in Azure App Service.

1. If Git is not installed, install it from [the Git download page](http://git-scm.com/download).

1. From the command line, change directories to the sample application directory, then `build\libs` and enter the following commands to initialize a local Git repository.

		git init


2. Enter the following commands to add files to the repository:

		git add .
		git commit -m "Initial commit of the API App"

3. Create a remote reference for pushing updates to the web app (API app host) you created previously, using the Git URL that you copied earlier:

		git remote add azure [URL for remote repository]

4. Push your changes to Azure by entering the following command:

		git push azure master

	You are prompted for the password you created earlier.

	The output from this command ends with a message that deployment is successful:

		remote: Deployment successful.
		To https://user@testsite.scm.azurewebsites.net/testsite.git
	 	* [new branch]      master -> master

## View the API definition in the Azure portal

Now that you have deployed an API to your API app, you can see the API definition in the Azure portal. You'll begin by restarting the *gateway*, which enables Azure to recognize that an API app's API definition has changed. The gateway is a web app that handles API administration and authorization for the API apps in a resource group.

6. In the Azure portal, go to the **API App** blade for the API app that you created earlier, and click the **Gateway** link.

	![][click-gateway]

7. In the **Gateway** blade, click **Restart**. You can now close this blade.

	![][restart-gateway]

8. In the **API App** blade, click **API Definition**.

	![][api-definition-click]

	The **API Definition** blade shows one Get method.

	![][api-definition-blade]

## Run the sample application in Azure

In the Azure portal, go to the **API App Host** blade for your API app, and click **Browse** .

![][browse-api-app-page]

The browser displays the home page that you saw earlier when you ran the sample app locally.  

## Next steps

You've deployed a Java web application that uses an API app backend to Azure. For more information about using Java in Azure, see the [Java Developer Center](/develop/java/).

You can try this sample API App at [TryApp Service](http://tryappservice.azure.com)

[portal-quick-create]: ./media/app-service-api-java-api-app/portal-quick-create.png
[portal-create-api]: ./media/app-service-api-java-api-app/portal-create-api.png
[api-app-blade]: ./media/app-service-api-java-api-app/api-app-blade.png
[api-app-folder-browse]: ./media/app-service-api-java-api-app/api-app-folder-browse.png
[api-app-host]: ./media/app-service-api-java-api-app/api-app-host.png
[deployment-part]: ./media/app-service-api-java-api-app/continuous-deployment.png
[set-api-app-access-level]: ./media/app-service-api-java-api-app/set-api-app-access.png
[setup-git-publishing]: ./media/app-service-api-java-api-app/local-git-repo.png
[deployment-credentials]: ./media/app-service-api-java-api-app/deployment-credentials.png
[git-url]: ./media/app-service-api-java-api-app/git-url.png
[apiapp-json]: ./media/app-service-api-java-api-app/apiapp-json.png
[app-java]: ./media/app-service-api-java-api-app/app-java.png
[sample-api-app-page]: ./media/app-service-api-java-api-app/sample-api-app-page.png
[browse-api-app-page]: ./media/app-service-api-java-api-app/browse-api-app-page.png
[api-app-enable-java]:./media/app-service-api-java-api-app/api-app-enable-java.png
[click-gateway]:./media/app-service-api-java-api-app/clickgateway.png
[restart-gateway]:./media/app-service-api-java-api-app/gatewayrestart.png
[api-definition-click]:./media/app-service-api-java-api-app/apidef.png
[api-definition-blade]:./media/app-service-api-java-api-app/apidefblade.png
 