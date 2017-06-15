---
title: Setup emulator express to debug Cloud Services applications in Visual Studio | Microsoft Docs
description: Explains how to install the C++ redistributable to enable Emulator Express in Visual Studio
services: cloud-services
documentationcenter: ''
author: cawa
manager: paulyuk
editor: ''

ms.assetid: 22b20f7a-23f4-4f7f-b536-3bf1e01adcd1
ms.service: cloud-services
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 11/02/2016
ms.author: cawa
---
# Use Emulator Express to debug Cloud Services application in VS 2017
This article explains how to use Emulator Express to debug Cloud Services applications in VS 2017.

## Background context
Emulator Express is used by default for debugging Cloud Services Web and Worker roles in Visual Studio. This setting is specified in the Cloud Services project properties page.

![Open project properties][0]

![Emulator express is selected as default][1]

The [Visual C++ Redistributable][Visual C++ Redistributable] for Visual Studio is required by Emulator express. Currently it is not installed with the Azure workload. Upon F5 gesture to debug a Cloud Services applications, Visual Studio would prompt to install this component and proceed with debugging.

![Prompt for install C++ Redistributable][2]

Click Yes to install C++ Redistributable.

![Install C++ Redistributable][3]

Press F5 again to launch debugging sessions.

![Start debugging][4]

![Debugging successful][5]

> Note: Installing Visual C++ Redistributable is a onetime effort. If you were upgrading from an older version of Azure SDK and have installed Emulator Express, then you won’t encounter this problem.
> 
> 

## Manual workaround
You can also install the [Visual C++ Redistributable][Visual C++ Redistributable] manually and same effect will be applied as how Visual Studio installed it on your system.

[vcredist_x86.exe][vcredist_x86.exe]

[vcredist_x64.exe][vcredist_x64.exe]

## Next Steps
Learn more about using Azure Computer Emulator to debug your Cloud Services applications in Visual Studio:
[Using Emulator Express to run and debug a cloud service on a local machine][Using Emulator Express to run and debug a cloud service on a local machine]

[Visual C++ Redistributable]:https://www.microsoft.com/en-us/download/details.aspx?id=30679
[vcredist_x86.exe]:https://download.microsoft.com/download/1/6/B/16B06F60-3B20-4FF2-B699-5E9B7962F9AE/VSU_4/vcredist_x86.exe
[vcredist_x64.exe]:https://download.microsoft.com/download/1/6/B/16B06F60-3B20-4FF2-B699-5E9B7962F9AE/VSU_4/vcredist_x64.exe
[Using Emulator Express to run and debug a cloud service on a local machine]:https://azure.microsoft.com/en-us/documentation/articles/vs-azure-tools-emulator-express-debug-run/

[0]: ./media/cloud-services-emulator-express-fix/vs-05.png
[1]: ./media/cloud-services-emulator-express-fix/vs-06.png
[2]: ./media/cloud-services-emulator-express-fix/vs-01.png
[3]: ./media/cloud-services-emulator-express-fix/vs-02.png
[4]: ./media/cloud-services-emulator-express-fix/vs-03.png
[5]: ./media/cloud-services-emulator-express-fix/vs-04.png
