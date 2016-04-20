<properties
   pageTitle="Creating an Azure project with Visual Studio | Microsoft Azure"
   description="Creating an Azure project with Visual Studio"
   services="visual-studio-online"
   documentationCenter="na"
   authors="TomArcher"
   manager="douge"
   editor="" />
<tags
   ms.service="multiple"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/19/2016"
   ms.author="tarcher" />

# Creating an Azure Project with Visual Studio

The Azure Tools for Visual Studio provide a template that lets you create a cloud service for Azure. The tools also help you configure, debug, and deploy the cloud service to Azure.

An Azure cloud service solution contains the following types of projects:

- **Azure project**

    The Azure project has associations to the role projects in the solution. It also includes the service definition and service configuration files. The service definition file defines the runtime settings for your application including what roles are required, endpoints, and virtual machine size. The service configuration file configures how many instances of a role are run and the values of the settings defined for a role. For more information about these settings, see [How to: Configure the Roles for an Azure Cloud Service with Visual Studio](vs-azure-tools-configure-roles-for-cloud-service.md).

- **Web role project**

    A worker role performs background processing. A worker role can communicate with storage services and with other Internet-based services. A worker role can have any number of HTTP, HTTPS, or TCP endpoints.

    - **ASP.NET Web Role**, for building an ASP.NET application with a web front end
    - **ASP.NET MVC5 Web Role**
    - **ASP.NET MVC4 Web Role**
    - **ASP.NET MVC3 Web Role**
    - **WCF Service Web Role**, for building a WCF service
    - **Silverlight Business Application Web Role** (requires Visual Studio 2012)

- **Cache Worker Role**

    A role that provides a dedicated cache to your application.

- **Worker Role with Service Bus Queue**

    A service bus queue that provides message queuing functionality to communicate with the worker process. For more information, see [How to Use Service Bus Queues](http://go.microsoft.com/fwlink/?LinkId=260560).

## To create an Azure cloud service project in Visual Studio

1. Start Microsoft Visual Studio as an administrator.

1. On the menu bar, choose **File**, **New**, **Project**.

1. In the **Project Types** pane, choose **Cloud** from the Visual C# or Visual Basic project template nodes.

1. In the **Templates** pane, choose  **Azure Cloud Service**.

1. Specify which version of the .NET Framework you want to use to develop your project.

1. Enter a name and location for your project and a name for the solution. Choose the **OK** button.

1. In the **New Azure Project** dialog box, choose the roles that you want to add, and choose the right arrow button to add them to your solution. You can add as many roles as you need.

1. To rename a role that you've added to your project, hover on the role in the **New Azure Project** dialog box, and choose the **Rename** icon to the right of the role. You can also rename a role within your solution after it has been added.
