---
title: Exit codes info for Azure Spring Apps | Microsoft Docs
description: Troubleshooting guide with exit codes for Azure Spring Apps
author: KarlErickson
ms.service: spring-apps
ms.topic: troubleshooting
ms.date: 08/10/2022
ms.author: kunsun
---

# Troubleshoot common Azure Spring Apps issues

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article provides instructions for troubleshooting Azure Spring Apps development issues or running issues.

### My application exited with an error code

When you create a deployment unsuccessfully, maybe you get some exit codes. When you keep running an app, it may also exit with some codes.

The exit codes indicate the termination reasons of the application. Some common codes are as belows:

* 0 - The application exited because it ran to completion, please replace it with a server application that runs constantly.
  Azure apps deployed should offer services continuously. When your app exited with 0, it indicated that your application don't run constantly. Please check your logs and source code.

* 1 - The application exited with a non-zero exit code, please debug the code and related services, then deploy the application again.
  
  Some possible problems are as follows:
  * Wrong configurations of spring boot
  
    For example : You need a parameter of {spring.db.url} to connect to the database, but it's not found in your yaml configuration file.

  * Disconnected from third service
  
    For example : You need to connect to redis service, but the service is not worked or reachable.
  
  * Insufficient authorities to third service

    For example : You need to connect to azure key vault to import certificates in you application, but your app don't have the authority to access it.

  * 137 - The application exited because it requested resources that the hosting platform failed to provide, please update JVM parameters to restrict resource usage, or scale up application resources.
  
    Common problems are as follows:
    * If the app is a java app, please check the parameters of java virtual machine(Jvm), it maybe exceeds the memory limitation of your app.
      For example : You configure 10GB for the -Xmx parameter of Jvm options, but the memory of app is up to 5GB. You should decrease the Xmx value 
        or increase the memory of app and make sure the value of Xmx is lower or equal to the memory limitation of app.
      This is called container out of memory(Container OOM).
      For solving this problem, you can refer this article(https://review.docs.microsoft.com/en-us/azure/spring-apps/how-to-fix-app-restart-issues-caused-by-out-of-memory?branch=pr-en-us-197651).
  
    * 143 - The application exited because it failed to respond to health checking. It was caused by the out of memory error or some other errors.
 
      Common problems are as follows:
      * Usually your application maybe exited with the out of memory error(Jvm OOM).
      For solving this problem, you can refer this article(https://review.docs.microsoft.com/en-us/azure/spring-apps/how-to-fix-app-restart-issues-caused-by-out-of-memory?branch=pr-en-us-197651).
    
      For more info about the log, please check the application log (see https://aka.ms/azure-spring-cloud-doc-log).
