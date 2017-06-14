---
title: Azure RemoteApp Troubleshooting - Application launch and connection failures  | Microsoft Docs
description: Learn how to troubleshoot issues with starting and connecting to applications in Azure RemoteApp.
services: remoteapp
documentationcenter: ''
author: ericorman
manager: mbaldwin

ms.assetid: e5cf7171-d1c2-4053-a38b-5af7821305e1
ms.service: remoteapp
ms.workload: compute
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/26/2017
ms.author: mbaldwin

---
# Troubleshoot Azure RemoteApp - Application launch and connection failures
> [!IMPORTANT]
> Azure RemoteApp is being discontinued on August 31, 2017. Read the [announcement](https://go.microsoft.com/fwlink/?linkid=821148) for details.
> 
> 

Applications hosted in Azure RemoteApp can fail to launch for a few different reasons. This article describes various reasons and error messages users might receive when trying to launch applications. It also talks about connection failures. (But this article does not describe issues when signing into the Azure RemoteApp client.)  

Read on for information about common error messages due to app launch and connection failures.

## We're getting you set up... Try again in 10 minutes.
This error means Azure RemoteApp is scaling up to meet the capacity need of your users. In the background more Azure RemoteApp VM instances are being created to handle the capacity needs of your users. Typically this takes around five minutes but can take up to 10 minutes. Sometimes, this doesn't happen fast enough and resources are needed immediately. For example a 9 AM scenario where many users need to use your app in Azure RemoteAppn at the same time. If this happens to you we can enable **capacity mode** on the back end. To do this open an Azure Support ticket. Be certain to include your subscription ID in the request.  

![We are getting you set up](./media/remoteapp-apptrouble/ra-apptrouble1.png)

## Could not auto-reconnect to your applications, please re-launch your application
This error message is often seen if you were using Azure RemoteApp and then put your PC to sleep longer than 4 hours and then woke your PC up and the Azure RemoteApp client attempt to auto reconnect and timeout was exceeded.  Instruct users to navigate back to the application and attempt to open it from the Azure RemoteApp client.

![Could not auto-reconnect to your applications](./media/remoteapp-apptrouble/ra-apptrouble2.png) 

## Problems with the temp profile
This error occurs when your user profile (User Profile Disk) failed to mount and the user received a temporary profile.  Administrators should navigate to the collection in the Azure portal and then go to the **Sessions** tab and attempt to **Log Off** the user. This will force a full log off of the user session - then have the user attempt to launch an app again. If that fails contact Azure support.

## Azure RemoteApp has stopped working
This error message means the Azure RemoteApp client is having an issue and needs to be restarted. Instruct users to close: select **Close program** and then launch the Azure RemoteApp client again.  If the issue continues open and Azure Support ticket.

![Azure RemoteApp has stopped working](./media/remoteapp-apptrouble/ra-apptrouble3.png)  

## An error occurred while Remote Desktop Connection was accessing this resource. Retry the connection or contact your system administrator
This is a generic error message - contact Azure support so we can investigate. 

![Generic Azure RemoteApp message](./media/remoteapp-apptrouble/ra-apptrouble4.png) 

