---
title: Common causes of Cloud Service (classic) roles recycling | Microsoft Docs
description: A cloud service role that suddenly recycles can cause significant downtime. Here are some common issues that cause roles to be recycled, which may help you reduce downtime.
ms.topic: troubleshooting
ms.service: cloud-services
ms.date: 02/21/2023
author: hirenshah1
ms.author: hirshah
ms.reviewer: mimckitt
ms.custom: compute-evergreen
---

# Common issues that cause Azure Cloud Service (classic) roles to recycle

[!INCLUDE [Cloud Services (classic) deprecation announcement](includes/deprecation-announcement.md)]

This article discusses some of the common causes of deployment problems and provides troubleshooting tips to help you resolve these problems. An indication that a problem exists with an application is when the role instance fails to start, or it cycles between the initializing, busy, and stopping states.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Missing runtime dependencies
If a role in your application relies on any assembly that is not part of the .NET Framework or the Azure managed library, you must explicitly include that assembly in the application package. Keep in mind that other Microsoft frameworks are not available on Azure by default. If your role relies on such a framework, you must add those assemblies to the application package.

Before you build and package your application, verify the following:

* If using Visual studio, make sure the **Copy Local** property is set to **True** for each referenced assembly in your project that is not part of the Azure SDK or the .NET Framework.
* Make sure the web.config file does not reference any unused assemblies in the compilation element.
* The **Build Action** of every .cshtml file is set to **Content**. This ensures that the files will appear correctly in the package and enables other referenced files to appear in the package.

## Assembly targets wrong platform
Azure is a 64-bit environment. Therefore, .NET assemblies compiled for a 32-bit target won't work on Azure.

## Role throws unhandled exceptions while initializing or stopping
Any exceptions that are thrown by the methods of the [RoleEntryPoint] class, which includes the [OnStart], [OnStop], and [Run] methods, are unhandled exceptions. If an unhandled exception occurs in one of these methods, the role will recycle. If the role is recycling repeatedly, it may be throwing an unhandled exception each time it tries to start.

## Role returns from Run method
The [Run] method is intended to run indefinitely. If your code overrides the [Run] method, it should sleep indefinitely. If the [Run] method returns, the role recycles.

## Incorrect DiagnosticsConnectionString setting
If application uses Azure Diagnostics, your service configuration file must specify the `DiagnosticsConnectionString` configuration setting. This setting should specify an HTTPS connection to your storage account in Azure.

To ensure that your `DiagnosticsConnectionString` setting is correct before you deploy your application package to Azure, verify the following:  

* The `DiagnosticsConnectionString` setting points to a valid storage account in Azure.  
  By default, this setting points to the emulated storage account, so you must explicitly change this setting before you deploy your application package. If you do not change this setting, an exception is thrown when the role instance attempts to start the diagnostic monitor. This may cause the role instance to recycle indefinitely.
* The connection string is specified in the following [format](../storage/common/storage-configure-connection-string.md). (The protocol must be specified as HTTPS.) Replace *MyAccountName* with the name of your storage account, and *MyAccountKey* with your access key:    

```console
DefaultEndpointsProtocol=https;AccountName=MyAccountName;AccountKey=MyAccountKey
```

  If you are developing your application by using Azure Tools for Microsoft Visual Studio, you can use the property pages to set this value.

## Exported certificate does not include private key
To run a web role under TLS, you must ensure that your exported management certificate includes the private key. If you use the *Windows Certificate Manager* to export the certificate, be sure to select **Yes** for the **Export the private key** option. The certificate must be exported in the PFX format, which is the only format currently supported.

## Next steps
View more [troubleshooting articles](../index.yml?product=cloud-services&tag=top-support-issue) for cloud services.

View more role recycling scenarios at [Kevin Williamson's blog series](/archive/blogs/kwill/windows-azure-paas-compute-diagnostics-data).

[RoleEntryPoint]: /previous-versions/azure/reference/ee758619(v=azure.100)
[OnStart]: /previous-versions/azure/reference/ee772851(v=azure.100)
[OnStop]: /previous-versions/azure/reference/ee772844(v=azure.100)
[Run]: /previous-versions/azure/reference/ee772746(v=azure.100)