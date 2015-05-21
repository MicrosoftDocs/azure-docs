<properties 
   pageTitle="Common Issues Which Cause Roles to Recycle"
   description=""
   services="cloud-services"
   documentationCenter=""
   authors="Thraka"
   manager="timlt"
   editor=""/>
<tags 
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd"
   ms.date="05/12/2015"
   ms.author="adegeo" />

## Overview

This section lists some of the common causes of deployment problems, and offers troubleshooting tips to help you resolve the problems. An indication that a problem exists with an application is when the role instance fails to start, or it cycles between the initializing, busy, and stopping states.

### Missing Runtime Dependencies

If a role in your application relies on any assembly that is not part of the .NET Framework or the Azure managed library, you must explicitly include that assembly in the application package. Keep in mind that other Microsoft frameworks are not available on Azure by default. If your role relies on such a framework, you must add those assemblies to the application package.

Before you build and package your application, verify the following:

- The **Copy Local** property is set to **True** for each referenced assembly in your project that is not part of the Azure SDK or the .NET Framework, if you are using Visual Studio. If you are not using Visual Studio, you must specify the locations for referenced assemblies when you call CSPack. For more information about using CSPack, see [CSPack Command-Line Tool](https://msdn.microsoft.com/library/gg432988).

- The web.config file does not reference any unused assemblies in the **compilation** element, and all references point to assemblies that are either part of the .NET Framework or the Azure SDK, or that have their **Copy Local** property set to **True** in Visual Studio, or that are included in the application package by running CSPack.

- The **Build Action** of every .cshtml file is set to **Content**. This ensures that the files will appear correctly in the package and allows other referenced files to appear in the package.

### Assembly Targets Wrong Platform

Azure is a 64-bit environment. Therefore, .NET assemblies compiled for a 32-bit target won't work on Azure.

### Role Throws Unhandled Exceptions While Initializing or Stopping

Any exceptions that are thrown by the methods of the [RoleEntryPoint](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleentrypoint.aspx) class, which includes the [OnStart](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleentrypoint.onstart.aspx), [OnStop](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleentrypoint.onstop.aspx), and [Run](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleentrypoint.run.aspx), are unhandled exceptions. If an unhandled exception occurs in one of these methods, the role will recycle. If the role is recycling repeatedly, it may be throwing an unhandled exception each times it tries to start.

### Role Returns from Run Method

The [Run](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleentrypoint.run.aspx) method is intended to run indefinitely. If your code overrides the [Run](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleentrypoint.run.aspx) method, it should sleep indefinitely. If the [Run](https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleentrypoint.run.aspx) method returns, the role recycles.

### Incorrect DiagnosticsConnectionString Setting

If application uses Azure Diagnostics, then your service configuration file must specify the DiagnosticsConnectionString configuration setting. This setting should specify an HTTPS connection to your storage account in Azure.

To ensure that your DiagnosticsConnectionString setting is correct before you deploy your application package to Azure, verify the following:  

- The DiagnosticsConnectionString setting points to a valid storage account in Azure. By default, this setting points to the emulated storage account, so you must explicitly change this setting before you deploy your application package. If you do not change this setting, an exception is thrown when the role instance attempts to start the diagnostic monitor. This may cause the role instance to recycle indefinitely.  
- The connection string is specified in the following format (the protocol must be specified as HTTPS). Replace MyAccountName with the name of your storage account, and MyAccountKey with your access key:    

		DefaultEndpointsProtocol=https;AccountName=MyAccountName;AccountKey=MyAccountKey
For more information about using connection strings, see [Configuring Azure Connection Strings](https://msdn.microsoft.com/library/ee758697).

If you are developing your application using the Azure Tools for Microsoft Visual Studio, you can use the property pages to set this value. For more information about using Visual Studio to set the configuration values, see [Configuring an Azure Project](https://msdn.microsoft.com/library/ee405486).

### Exported Certificate Does Not Include Private Key

To run a web role under SSL, you must ensure that your exported management certificate includes the private key. If you use the Windows Certificate Manager to export the certificate, be sure to select the Yes, export the private key option. The certificate must be exported to the PFX format, which is the only format currently supported.

### See Also

[Troubleshooting and Debugging in Azure Cloud Services](https://msdn.microsoft.com/library/gg465380)

