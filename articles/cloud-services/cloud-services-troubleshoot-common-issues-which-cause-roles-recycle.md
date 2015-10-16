<properties 
   pageTitle="Common causes of Cloud Service roles recycling | Microsoft Azure"
   description=""
   services="cloud-services"
   documentationCenter="A cloud service role that sudden recycles can cause significant downtime. Here are some common issues that cause roles to be recycled, which may help imporve downtime."
   authors="Thraka"
   manager="msmets"
   editor=""
   tags="top-support-issue"/>
<tags 
   ms.service="cloud-services"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="tbd"
   ms.date="10/14/2015"
   ms.author="jarrettr" />

# Common issues which cause roles to recycle

Provided are some of the common causes of deployment problems and troubleshooting tips to help you resolve these problems. An indication that a problem exists with an application is when the role instance fails to start, or it cycles between the **initializing**, **busy**, and **stopping** states.

## Contact Azure Customer Support

If you need more help at any point in this article, you can contact the Azure experts on [the MSDN Azure and the Stack Overflow forums](http://azure.microsoft.com/support/forums/).

Alternatively, you can also file an Azure support incident. Go to the [Azure Support site](http://azure.microsoft.com/support/options/) and click on **Get Support**. For information about using Azure Support, read the [Microsoft Azure Support FAQ](http://azure.microsoft.com/support/faq/).


## Missing runtime dependencies

If a role in your application relies on any assembly that is not part of the .NET Framework or the Azure managed library, you must explicitly include that assembly in the application package. Keep in mind that other Microsoft frameworks are not available on Azure by default. If your role relies on such a framework, you must add those assemblies to the application package.

Before you build and package your application, verify the following:

- If using Visual studio, make sure the **Copy Local** property is set to **True** for each referenced assembly in your project that is not part of the Azure SDK or the .NET Framework.

- Make sure the **web.config** file does not reference any unused assemblies in the **compilation** element.
 
- The **Build Action** of every .cshtml file is set to **Content**. This ensures that the files will appear correctly in the package and allows other referenced files to appear in the package.



## Assembly targets wrong platform

Azure is a 64-bit environment. Therefore, .NET assemblies compiled for a 32-bit target won't work on Azure.



## Role throws unhandled exceptions while initializing or stopping

Any exceptions that are thrown by the methods of the [RoleEntryPoint] class, which includes the [OnStart], [OnStop], and [Run], are unhandled exceptions. If an unhandled exception occurs in one of these methods, the role will recycle. If the role is recycling repeatedly, it may be throwing an unhandled exception each times it tries to start.


## Role returns from Run method

The [Run] method is intended to run indefinitely. If your code overrides the [Run] method, it should sleep indefinitely. If the [Run] method returns, the role recycles.




## Incorrect DiagnosticsConnectionString setting

If application uses Azure Diagnostics, then your service configuration file must specify the `DiagnosticsConnectionString` configuration setting. This setting should specify an HTTPS connection to your storage account in Azure.

To ensure that your `DiagnosticsConnectionString` setting is correct before you deploy your application package to Azure, verify the following:  

- The `DiagnosticsConnectionString` setting points to a valid storage account in Azure.  
  By default, this setting points to the emulated storage account, so you must explicitly change this setting before you deploy your application package. If you do not change this setting, an exception is thrown when the role instance attempts to start the diagnostic monitor. This may cause the role instance to recycle indefinitely.
  
- The connection string is specified in the following [format](storage-configure-connection-string.md) (the protocol must be specified as HTTPS). Replace *MyAccountName* with the name of your storage account, and *MyAccountKey* with your access key:    

        DefaultEndpointsProtocol=https;AccountName=MyAccountName;AccountKey=MyAccountKey

  If you are developing your application using the Azure Tools for Microsoft Visual Studio, you can use the [property pages](https://msdn.microsoft.com/library/ee405486) to set this value. 



## Exported certificate does not include private key

To run a web role under SSL, you must ensure that your exported management certificate includes the private key. If you use the *Windows Certificate Manager* to export the certificate, be sure to select the *Yes*, export the private key option. The certificate must be exported to the PFX format, which is the only format currently supported.



## Next steps

View more [troubleshooting articles](..\?tag=top-support-issue&service=cloud-services) for cloud services.




[RoleEntryPoint]: https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleentrypoint.aspx
[OnStart]: https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleentrypoint.onstart.aspx
[OnStop]: https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleentrypoint.onstop.aspx
[Run]: https://msdn.microsoft.com/library/microsoft.windowsazure.serviceruntime.roleentrypoint.run.aspx