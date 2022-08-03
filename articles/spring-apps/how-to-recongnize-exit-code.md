---
title: Exit codes info for Azure Spring Apps | Microsoft Docs
description: Troubleshooting guide with exit codes for Azure Spring Apps
author: kunsun
ms.service: spring-cloud
ms.topic: troubleshooting
ms.date: 07/07/2021
ms.author: kunsun
---

# Troubleshoot common Azure Spring Apps issues

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article provides instructions for troubleshooting Azure Spring Apps development issues or running issues.

### My application exited with an error code

When you create a deployment unsuccessfully and maybe you get some exit codes. When you keep running an app, it may also exit with some codes.

The exit codes indicate the termination reasons of the application. The detail info are as belows:

* 0 - The application exited because it has run to completion, please replace it with a server application that runs constantly.
  
  Azure apps deployed should offer services continuously. When your app exited with 0, it indicated that your application don't run constantly. Please check your logs and source code.

* 1 - The application exited with a non-zero exit code, please debug the code and related services, then redeploy the application.
  
  Common problems are as follows:
  * Wrong configurations of spring boot.
  * Disconnect from db.
  * Insufficient authorities.

* 137 - The application exited because it has requested resources that the hosting platform failed to provide, please update JVM parameters to restrict resource usage, or scale up application resources.
  
  Common problems are as follows:
  * If the app is a java app, please check the quota of jvm params, it maybe exceed the limitation of your app.
  
* 143 - The application exited because it failed to respond to health probing, please make sure the application listens to some port, configure the port for health probing on the hosting platform, or turn off health probing.

  Common problems are as follows:
  * Usuallly your application maybe exit with OOM, please check detail logs in your app.  
  * Check whether your appication supplies a port to be checked by azure platform.
