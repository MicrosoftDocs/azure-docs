---
title: Continuous delivery for cloud services with Visual Studio Online | Microsoft Docs
description: Learn how to set up continuous delivery for Azure cloud apps without saving diagnostics storage key to the service configuration files
services: cloud-services
documentationcenter: ''
author: cawa
manager: paulyuk
editor: ''

ms.assetid: 148b2959-c5db-4e4a-a7e9-fccb252e7e8a
ms.service: cloud-services
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 11/02/2016
ms.author: cawa
---
# Securely Save Cloud Services Diagnostics Storage Key and Setup Continuous Integration and Deployment to Azure using Visual Studio Online
 It is a common practice to open source projects nowadays. Saving application secrets in configuration files is no longer safe practice as security vulnerabilities are exposed from secrets being leaked from public source controls. Storing secret as plaintext in a file in a Continuous Integration pipeline is not secure either since build servers could be shared resources on the Cloud environment. This article explains how Visual Studio and Visual Studio Online mitigates the security concerns during development and Continuous Integration process.

## Remove Diagnostics Storage Key Secret in Project Configuration File
Cloud Services diagnostics extension requires Azure storage for saving diagnostics results. Formerly the storage connection string is specified in the Cloud Services configuration (.cscfg) files and could be checked in to source control. In the latest Azure SDK release we changed the behavior to only store a partial connection string with the key replaced by a token. The following steps describe how the new Cloud Services tooling works:

### 1. Open the Role designer
* Double click or right click on a Cloud Services role to open Role designer

![Open role designer][0]

### 2. Under diagnostics section, a new check box “Don’t remove storage key secret from project” is added
* If you are using the local storage emulator, this checkbox is disabled because there is no secret to manage for the local connection string, which is UseDevelopmentStorage=true.

![Local storage emulator connection string is not secret][1]

* If you are creating a new project, by default this checkbox is unchecked. This results in the storage key section of the selected storage connection string being replaced with a token. The value of the token will be found under the current user’s AppData Roaming folder, for example:
  C:\Users\contosouser\AppData\Roaming\Microsoft\CloudService

> Note that the user\AppData folder is Access Controlled by user sign-in and is considered a secure place to store development secrets.
> 
> 

![Storage key is saved under user profile folder][2]

### 3. Select a diagnostics storage account
* Select a storage account from the dialog launched by clicking the “…” button. Notice how the storage connection string generated will not have the storage account key.
* For example:
  DefaultEndpointsProtocol=https;AccountName=contosostorage;AccountKey=$(*clouddiagstrg.key*)

### 4.    Debugging the project
* F5 to start debugging in Visual Studio. Everything should work in the same way as before.
  ![Start debugging locally][3]

### 5. Publish project from Visual Studio
* Launch the publish dialog and proceed with sign-in instructions to publish the applicaion to Azure.

### 6. Additional information
> Note: The Settings panel in the role designer will stay as it is for now. If you want to use the secret management feature for diagnostics, go to the Configurations tab.
> 
> 

![Add settings][4]

> Note: If enabled, the Application Insights key will be stored as plain text. The key is only used for upload contents so no sensitive data will be at risk being compromised.
> 
> 

## Build and Publish a Cloud Services Project using Visual Studio online Task Templates
* The following steps illustrates how to setup Continuous Integration for Cloud Services project using Visual Studio online tasks:
  ### 1.    Obtain a VSO account
* [Create Visual Studio Online account][Create Visual Studio Online account] if you don’t have one already
* [Create team project][Create team project] in your Visual Studio online account

### 2.    Setup source control in Visual Studio
* Connect to a team project

![Connect to team project][5]

![Select team project to connect to][6]

* Add your project to source control

![Add project to source control][7]

![Map project to a source control folder][8]

* Check in your project from Team Explorer

![Check in project to source control][9]

### 3.    Configure Build process
* Browse to your team project and add a new build process Templates

![Add a new build][10]

* Select build task

![Add a build task][11]

![Select Visual Studio Build task template][12]

* Edit build task input. Please customize the build parameters according to your need

![Configure build task][13]

`/t:Publish /p:TargetProfile=$(targetProfile) /p:DebugType=None /p:SkipInvalidConfigurations=true /p:OutputPath=bin\ /p:PublishDir="$(build.artifactstagingdirectory)\\"`

* Configure build variables

![Configure build variables][14]

* Add a task to upload build drop

![Choose publish build drop task][15]

![Configure publish build drop task][16]

* Run the build

![Queue New Build][17]

![View build summary][18]

* if the build is successful you will see a result similar to below

![Build result][19]

### 4.    Configure Release process
* Create a new release

![Create new release][20]

* Select the Azure Cloud Services Deployment task

![Select Azure Cloud Services deployment task][21]

* As the storage account key is not checked in to source control, we need to specify the secret key for setting diagnostics extensions. Expand the **Advanced Options for Creating New Service** section and edit the **Diagnostics Storage Account Keys** parameter input. This input takes in multiple lines of key value pair in the format of **[RoleName]:$(StorageAccountKey)**

> Note: if your diagnostics storage account is under the same subscription as where you will publish the Cloud Services application, you don't have to enter the key in the deployment task input; the deployment will programmatically obtain the storage information from your subscription
> 
> 

![Configure Cloud Services deployment task][22]

* Use secret build variables to save storage Keys. To mask a variable as secret click on the lock icon on the right side of the Variables input

![Save storage keys in secret build variables][23]

* Create a release and deploy your project to Azure

![Create new release][24]

## Next steps
To learn more about setting diagnostics extensions for Azure Cloud Services, please see [Enable diagnostics in Azure Cloud Services using PowerShell][Enable diagnostics in Azure Cloud Services using PowerShell]

[Create Visual Studio Online account]:https://www.visualstudio.com/team-services/
[Create team project]: https://www.visualstudio.com/it-it/docs/setup-admin/team-services/connect-to-visual-studio-team-services
[Enable diagnostics in Azure Cloud Services using PowerShell]:https://azure.microsoft.com/en-us/documentation/articles/cloud-services-diagnostics-powershell/

[0]: ./media/cloud-services-vs-ci/vs-01.png
[1]: ./media/cloud-services-vs-ci/vs-02.png
[2]: ./media/cloud-services-vs-ci/file-01.png
[3]: ./media/cloud-services-vs-ci/vs-03.png
[4]: ./media/cloud-services-vs-ci/vs-04.png
[5]: ./media/cloud-services-vs-ci/vs-05.png
[6]: ./media/cloud-services-vs-ci/vs-06.png
[7]: ./media/cloud-services-vs-ci/vs-07.png
[8]: ./media/cloud-services-vs-ci/vs-08.png
[9]: ./media/cloud-services-vs-ci/vs-09.png
[10]: ./media/cloud-services-vs-ci/vso-01.png
[11]: ./media/cloud-services-vs-ci/vso-02.png
[12]: ./media/cloud-services-vs-ci/vso-03.png
[13]: ./media/cloud-services-vs-ci/vso-04.png
[14]: ./media/cloud-services-vs-ci/vso-05.png
[15]: ./media/cloud-services-vs-ci/vso-06.png
[16]: ./media/cloud-services-vs-ci/vso-07.png
[17]: ./media/cloud-services-vs-ci/vso-08.png
[18]: ./media/cloud-services-vs-ci/vso-09.png
[19]: ./media/cloud-services-vs-ci/vso-10.png
[20]: ./media/cloud-services-vs-ci/vso-11.png
[21]: ./media/cloud-services-vs-ci/vso-12.png
[22]: ./media/cloud-services-vs-ci/vso-13.png
[23]: ./media/cloud-services-vs-ci/vso-14.png
[24]: ./media/cloud-services-vs-ci/vso-15.png
