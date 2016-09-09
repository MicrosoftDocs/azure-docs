<properties
   pageTitle="Debugging apps in a local Docker container | Microsoft Azure"
   description="Learn how to modify an app that is running in a local Docker container, refresh the container via Edit and Refresh and set debugging breakpoints"
   services="azure-container-service"
   documentationCenter="na"
   authors="allclark"
   manager="douge"
   editor="" />
<tags
   ms.service="multiple"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="multiple"
   ms.date="07/22/2016"
   ms.author="allclark" />

# Debugging apps in a local Docker container

## Overview
The Visual Studio Tools for Docker provides a consistent way to develop in a and validate your application locally in a Linux Docker container.
You don't have to restart the container each time you make a code change.
This article will illustrate how to use the "Edit and Refresh" feature to start an ASP.NET Core Web app in a local Docker container,
make any necessary changes, and then refresh the browser to see those changes.
It will also show you how to set breakpoints for debugging.

> [AZURE.NOTE] Windows Container support will be coming in a future release

## Prerequisites
The following tools need to be installed.

- [Visual Studio 2015 Update 2](https://go.microsoft.com/fwlink/?LinkId=691978)
- [Microsoft ASP .NET Core RC 2](http://go.microsoft.com/fwlink/?LinkId=798481)
- [Visual Studio 2015 Tools for Docker](https://aka.ms/DockerToolsForVS)

To run Docker containers locally, you'll need a local docker client.
You can use the released [Docker Toolbox](https://www.docker.com/products/overview#/docker_toolbox) which requires Hyper-V to be disabled,
or you can use [Docker for Windows Beta](https://beta.docker.com) which uses Hyper-V, and requires Windows 10.

If using Docker Toolbox, you'll need to [configure the Docker client](./vs-azure-tools-docker-setup.md)

## 1. Create a web app

[AZURE.INCLUDE [create-aspnet5-app](../includes/create-aspnet5-app.md)]

## 2. Add Docker support

[AZURE.INCLUDE [Add docker support](../includes/vs-azure-tools-docker-add-docker-support.md)]


## 3. Edit your code and refresh

To quickly iterate changes, you can start your application within a container, and continue to make changes, viewing them as you would with IIS Express.

1. Set the Solution Configuration to `Debug` and press **&lt;CTRL + F5>** to build your docker image and run it locally.

    Once the container image has been built and is running in a Docker container, Visual Studio will launch the Web app in your default browser.
    If you are using the Microsoft Edge browser or otherwise have errors, see [Troubleshooting](vs-azure-tools-docker-troubleshooting-docker-errors.md) section.

1. Go to the About page, which is where we're going to make our changes.

1. Return to Visual Studio and open `Views\Home\About.cshtml`.

1. Add the following HTML content to the end of the file and save the changes.

	```
	<h1>Hello from a Docker Container!</h1>
	```

1.	Viewing the output window, when the .NET build is completed and you see these lines, switch back to your browser and refresh the About page.

    ```
    Now listening on: http://*:80
    Application started. Press Ctrl+C to shut down
    ```

1.	Your changes have been applied!

## 4. Debug with breakpoints

Often, changes will need further inspection, leveraging the debugging features of Visual Studio.

1.	Return to Visual Studio and open `Controllers\HomeController.cs`

1.  Replace the contents of the About() method with the following:

	```
	string message = "Your application description page from wthin a Container";
	ViewData["Message"] = message;
    ````

1.  Set a breakpoint to the left of the `string message`... line.

1.  Hit **&lt;F5>** to start debugging.

1.  Navigate to the About page to hit your breakpoint.

1.  Switch to Visual Studio to view the breakpoint, and inspect the value of message.

	![][2]

##Summary

With [Visual Studio 2015 Tools for Docker](https://aka.ms/DockerToolsForVS), you can get the productivity of working locally,
with the production realism of developing within a Docker container.

## Troubleshooting

[Troubleshooting Visual Studio Docker Development](vs-azure-tools-docker-troubleshooting-docker-errors.md)

## More about Docker with Visual Studio, Windows, and Azure

- [Docker Tools for Visual Studio](http://aka.ms/dockertoolsforvs) - Developing your .NET Core code in a container
- [Docker Tools for Visual Studio Team Services](http://aka.ms/dockertoolsforvsts) - Build and Deploy docker containers
- [Docker Tools for Visual Studio Code](http://aka.ms/dockertoolsforvscode) - Language services for editing docker files, with more e2e scenarios coming
- [Windows Container Information](http://aka.ms/containers)- Windows Server and Nano Server information
- [Azure Container Service](https://azure.microsoft.com/services/container-service/) - [Azure Container Service Content](http://aka.ms/AzureContainerService)
-    For more examples of working with Docker, see [Working with Docker](https://github.com/Microsoft/HealthClinic.biz/wiki/Working-with-Docker) from the [HealthClinic.biz](https://github.com/Microsoft/HealthClinic.biz) 2015 Connect [demo](https://blogs.msdn.microsoft.com/visualstudio/2015/12/08/connectdemos-2015-healthclinic-biz/). For more quickstarts from the HealthClinic.biz demo, see [Azure Developer Tools Quickstarts](https://github.com/Microsoft/HealthClinic.biz/wiki/Azure-Developer-Tools-Quickstarts).

## Various Docker tools

[Some great docker tools (Steve Lasker's blog)](https://blogs.msdn.microsoft.com/stevelasker/2016/03/25/some-great-docker-tools/)

## Good articles

[Introduction to Microservices from NGINX](https://www.nginx.com/blog/introduction-to-microservices/)

## Presentations

- [Steve Lasker: VS Live Las Vegas 2016 - Docker e2e](https://github.com/SteveLasker/Presentations/blob/master/VSLive2016/Vegas/)
- [Introduction to ASP.NET Core @ build 2016 - Where You At Demo](https://channel9.msdn.com/Events/Build/2016/B810)
- [Developing .NET apps in containers, Channel 9](https://blogs.msdn.microsoft.com/stevelasker/2016/02/19/developing-asp-net-apps-in-docker-containers/)

[2]: ./media/vs-azure-tools-docker-edit-and-refresh/breakpoint.png
