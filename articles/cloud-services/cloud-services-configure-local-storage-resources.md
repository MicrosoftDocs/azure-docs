<properties
pageTitle="Configure Local Storage Resources in Azure Cloud Services | Microsoft Azure"
description="Learn about configuring local storage resources in Azure Cloud Services"
services="cloud-services"
documentationCenter=""
authors="cristy"
manager="timlt"
editor=""/>
<tags
ms.service="cloud-services"
ms.workload="tbd"
ms.tgt_pltfrm="na"
ms.devlang="na"
ms.topic="article"
ms.date="06/11/2015"
ms.author="cristyg"/>

# Configure Local Storage Resources

A local storage resource is a reserved directory in the file system of the virtual machine in which an instance of a role is running. You can store information in your virtual machine instance so that code running in the instance can access the local storage resource when it needs to write to or read from a file. For example, a local storage resource can be used to cache data that may need to be accessed again while the service is running in Azure. You can also configure local storage resource to store files during startup. For more information on configuring local storage resources for startup, see [Using Local Storage to Store Files During Startup](https://msdn.microsoft.com/library/azure/hh974419.aspx)

A local storage resource is declared in the service definition file. You can declare any number of local storage resources for a role. Each local storage resource is reserved for every instance of that role. The minimum amount of disk space that you can allocate for a local storage resource is 1 MB. The maximum amount that you can allocate for any given local resource depends on the size of the virtual machine that is specified for the role. Each virtual machine size has a corresponding total storage allocation, and the total space allocated for all local storage resources declared for a role cannot exceed the maximum size allotted for that virtual machine size. For more information about the maximum amount of local disk space that is allotted for each virtual machine size, see [Configure Sizes for Cloud Services](https://msdn.microsoft.com/library/azure/ee814754.aspx).

> [AZURE.NOTE]
>
-   Be aware that it is the developer's responsibility to ensure that the amount of disk space that is requested for a local storage resource does not exceed the maximum amount allotted for a virtual machine. If you configure a local storage resource to be larger than the allowed maximum, an error will not occur until you attempt a write operation that exceeds the allowed maximum. In that case, the write operation will fail and an out of disk space error message will appear. The processing model for Azure is try/fail. If you receive an out of disk space error you can handle the error and clear some disk space. You can then retry the write operation.
-   You can specify that a local storage resource be preserved when an instance is recycled. However, data that is saved to the local file system of the virtual machine is not guaranteed to be durable. If your role requires durable data, it is recommended that you use a Azure drive to store file data. Azure drives are backed by the Azure Blob service, so they are guaranteed to be durable.  
>


## Adding a local storage resource

To declare a local storage resource within the service definition file, add the **LocalResources** element as a child of a **WebRole** element or the **WorkerRole** element. Then add a **LocalStorage** element to represent the resource. The **LocalStorage** element takes three attributes:

-   *name*
-   *sizeInMB*: Specifies the desired size for this local storage resource
-   *cleanOnRoleRecycle*: Specifies whether the local storage resource should be wiped clean when a role instance is recycled, or whether it should be persisted across the role life cycle. The default value is **true**.

The following service definition file shows two local storage resources that are declared for a web role:

	<?xml version="1.0" encoding="utf-8"?>
    <ServiceDefinition xmlns="http://schemas.microsoft.com/ServiceHosting/2008/10/ServiceDefinition" name="MyService">
      <WebRole name="MyService_WebRole" vmsize="Medium">
        <InputEndpoints>
          <InputEndpoint name="HttpIn" port="80" protocol="http" />
        </InputEndpoints>
        <ConfigurationSettings>
          <Setting name="SimpleConfigSetting" />
        </ConfigurationSettings>
        <LocalResources>
          <LocalStorage name="localStoreOne" sizeInMB="10" />
          <LocalStorage name="localStoreTwo" sizeInMB="10" cleanOnRoleRecycle="false" />
        </LocalResources>
      </WebRole>
    </ServiceDefinition>

For more information about the service definition file, see [Azure Service Definition Schema (.csdef File)](https://msdn.microsoft.com/library/azure/ee758711.aspx).

> [AZURE.NOTE] If you are using the Azure Tools for Microsoft Visual Studio, you can define a local storage resource within the **Properties** pages for the role. For more information, see [Configuring the Azure Application with Visual Studio](https://msdn.microsoft.com/library/ee405486.aspx).

## Accessing a local storage resource programmatically

To access the local storage resource, the application must retrieve the path from the [GetLocalResource](https://msdn.microsoft.com/library/azure/microsoft.windowsazure.serviceruntime.roleenvironment.getlocalresource.aspx) method. You can then use standard file read and write operations to read and write the contents of the local storage resource. For example, the following sample shows how to read the contents of a file called **MyTest.txt** from the local storage resource, and display it on the home page of an MVC 3 application:

    using Microsoft.WindowsAzure.ServiceRuntime;
    using System;
    using System.Text;
    using System.Web.Mvc;

    namespace StartupExercise.Controllers
    {
        public class HomeController : Controller
        {
            public ActionResult Index()
            {
                string SlsPath = RoleEnvironment.GetLocalResource("StartupLocalStorage").RootPath;

                string s = System.IO.File.ReadAllText(SlsPath + "\\MyTest.txt");

                ViewBag.Message = "Contents of MyTest.txt = " + s;

                return View();
            }
        }
    }

## Accessing a local storage resource at runtime

The Azure Managed Library provides classes for accessing the local storage resource from within code that is running in a role instance. The [RoleEnvironment.GetLocalResource](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleenvironment.getlocalresource.aspx) method returns a reference to a named [LocalResource](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.localresource.aspx) object.

Because the **LocalResource** object represents a directory, you can read from it and write to it by using the standard .NET file I/O classes. To determine the path to the local storage resource's directory, use the [LocalResource.RootPath](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.localresource.rootpath.aspx) property. This property returns the full path to the local storage resource, including the named resource directory. For example, if your service is running in the development environment, the local storage resource is defined within your local file system, and the **RootPath** property would return a value similar to the following:


    C:\Users\myaccount\AppData\Local\dftmp\s0\deployment(1)\res\deployment(1).MyService.MyService_WebRole.0\directory\localStoreOne\

When your service is deployed to Azure, the path to the local storage resource includes the deployment ID, and the **RootPath** property returns a value similar to the following:


    C:\Resources\directory\f335471d5a5845aaa4e66d0359e69066.MyService_WebRole.localStoreOne\

Code running in a role instance can access a local storage resource that is defined for that role from the time the instance comes online to the time it is taken offline.

## Next steps

- [Set Up a Cloud Service for Azure](https://msdn.microsoft.com/library/azure/hh124108.aspx)
