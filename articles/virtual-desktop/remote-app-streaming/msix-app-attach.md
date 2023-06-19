---
title: Azure Virtual Desktop deploy application MSIX app attach - Azure
description: How to deploy apps with MSIX app attach for Azure Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 07/14/2021
ms.author: helohr
manager: femila
---

# Deploy apps with MSIX app attach

This article is a basic outline of how to publish an application in Azure Virtual Desktop with the MSIX app attach feature. In this article, we'll also give you links to resources that can give you more in-depth explanations and instructions.

## What is MSIX app attach?

MSIX app attach is an application layering solution that lets you deliver applications to active user sessions in Azure Virtual Desktop. The MSIX package system separates apps from the operating system, making it easier to build images for virtual machines. MSIX packages also give you greater control over which apps your users can access in their virtual machines. You can even separate apps from the master image and give them to users later.

To learn more, see [What is MSIX app attach?](../what-is-app-attach.md).

## Requirements

You'll need the following things to use MSIX app attach in Azure Virtual Desktop:

- An MSIX-packaged application
- An MSIX image made from the expanded MSIX application
- An MSIX share, which is the network location where you store MSIX images
- At least one healthy and active session host in the host pool you'll use
- If your MSIX packaged application has a private certificate, that certificate must be available on all session hosts in the host pool
- Azure Virtual Desktop configuration for MSIX app attach (user assignment, association of MSIX application with application group, adding MSIX image to host pool)

## Create an MSIX package from an existing installer

To start using MSIX app attach, you'll need to put your application inside of an MSIX package. Some apps already come in the MSIX format, but if you're using a legacy installer like MSI, ClickOnce, and so on, you'll need to convert the app into the MSIX package format. Learn how to convert your existing apps into MSIX format at our [MSIX overview article](/windows/msix/packaging-tool/create-an-msix-overview).

## Test the application fidelity of your packaged app 

After you've repackaged your application as an MSIX package, you need to make sure your application fidelity is high. App fidelity is the application's behavior and performance before and after repackaging. An app package with high app fidelity has similar performance before and after.

If you find that your app fidelity decreases after repackaging, your organization must test the app to make sure its performance meets user standards. If not, you may have to update your app to prevent the issue or try repackaging again.

## Create an MSIX image

Next, you'll need to create an MSIX image from your packaged app. An MSIX image is what happens when you expand an MSIX app package and store the resulting app in a VHD(X) or CIM storage. To learn how to create an MSIX image, see [Create an MSIX image](../app-attach-msixmgr.md#create-an-msix-image).

## Configure an MSIX file share

Next, you'll need to set up an MSIX network share to store MSIX images. Once configured, your session hosts will use the MSIX share to attach MSIX packages to active user sessions, delivering apps to your users. Learn how to set up an MSIX share at [Set up a file share for MSIX app attach](../app-attach-file-share.md).

## Configure MSIX app attach for Azure Virtual Desktop host pool

After you've uploaded an MSIX image to the MSIX share, you'll need to open up the Azure portal and configure the host pool you're going to use to accept MSIX app attach. Learn how to configure your host pool at [Set up MSIX app attach with the Azure portal](../app-attach-azure-portal.md).
