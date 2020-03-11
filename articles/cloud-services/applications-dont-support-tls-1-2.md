---
title: Troubleshooting issues caused by applications that don’t support TLS 1.2 | Microsoft Docs
description: Troubleshooting issues caused by applications that don’t support TLS 1.2
services: cloud-services
documentationcenter: ''
author: mimckitt
manager: vashan
editor: ''
tags: top-support-issue
ms.assetid: 
ms.service: cloud-services
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: 
ms.date: 01/17/2020
ms.author: tagore
---
 
# Troubleshooting applications that don’t support TLS 1.2
This article describes how to enable the older TLS protocols (TLS 1.0 and 1.1) as well as applying legacy cipher suites to support the additional protocols on the Windows Server 2019 cloud service web and worker roles. 

We understand that while we are taking steps to deprecate TLS 1.0 and TLS 1.1, our customers may need to support the older protocols and cipher suites until they can [plan](https://azure.microsoft.com/updates/azuretls12/) for their deprecation.  While we don't recommend re-enabling these legacy values, we are providing guidance to help customers. We encourage customers to evaluate the risk of regression before implementing the changes outlined in this article. 


> [!NOTE]
> Guest OS Family 6 releases enforces TLS 1.2 by disabling 1.0/1.1 ciphers. 


## Dropping support for TLS 1.0, TLS 1.1 and older cipher suites 
In support of our commitment to use best-in-class encryption, Microsoft announced plans to start migration away from TLS 1.0 and 1.1 in June of 2017.   Since that initial announcement, Microsoft announced our intent to disable Transport Layer Security (TLS) 1.0 and 1.1 by default in supported versions of Microsoft Edge and Internet Explorer 11 in the first half of 2020.  Similar announcements from Apple, Google, and Mozilla indicate the direction in which the industry is headed.   

## TLS configuration  
The Windows Server 2019 cloud server image is configured with TLS 1.0 and TLS 1.1 disabled at the registry level. This means applications deployed to this version of Windows AND using the Windows stack for TLS negotiation will not allow TLS 1.0 and TLS 1.1 communication.   

The server also comes with a limited set of cipher suites: 

```
    TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 
    TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 
    TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 
    TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 
    TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256 
    TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384 
    TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 
    TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 
```


## Step 1: Open your exsisting Azure Web Role project

> ![NOTE]
> The entireity of these steps and scripts can be found in the following [GitHub Repo](https://github.com/microsoft/azure-ssl-configure).

Open your own existing Azure Web Role project to begin this process

## Step 2: Add the startup scripts to your project

Add a new folder in your web role/worker role project called "Startup", copy [SSLConfigure.cmd](https://github.com/microsoft/azure-ssl-configure/blob/master/AzureCloudServiceSample/WebRoleSample/Startup/SSLConfigure.cmd) and [SSLConfigure.ps1](https://github.com/microsoft/azure-ssl-configure/blob/master/AzureCloudServiceSample/WebRoleSample/Startup/SSLConfigure.ps1) files into this folder, and add these files into your project.

To ensure the scripts are uploaded with every update pushed from Visual Studio, the setting *Copy to Output Directory* needs to be set to *Copy Always*

1) Under your WebRole, right-click on **SSLConfigure.cmd**
2) Select **Properties**
3) In the properties tab, change *Copy to Output Directory* to *Copy Always"*
4) Repeat the steps for **SSLConfigure.ps1**

## Step 3: Update the Service Definition file

Add these lines to your ServiceDefinition.csdef file in your Azure project, place it under the corresponding role element of your role project.

```
<WebRole>
...
  <Startup>
    <Task commandLine="Startup\SSLConfigure.cmd" executionContext="elevated" taskType="simple">
	    <Environment>
          <Variable name="ComputeEmulatorRunning">
            <RoleInstanceValue xpath="/RoleEnvironment/Deployment/@emulated" />
          </Variable>
        </Environment>
    </Task>
  </Startup>
</WebRole>
```

## Step 4: Update the publish profile

If you have an existing Azure Web Role deployed, the recommended AzureDeploymentReplacementMethod in your publish profile is "AutomaticUpgrade", instead of "DeleteAndCreate". If you don't have existing deployment, you can use DeleteAndCreate too.



## Step 5: Publish & Validate

Now that the above steps have been complete, publish the update to your existing Cloud Service. 

You can use [SSLLabs](https://www.ssllabs.com/) to validate the TLS status of your endpoints 

 
