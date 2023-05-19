---
title: Azure Virtual Desktop MSIX app attach glossary - Azure
description: A glossary of MSIX app attach terms and concepts.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/17/2020
ms.author: helohr
manager: femila
---
# MSIX app attach glossary

This article is a list of definitions for key terms and concepts related to MSIX app attach.

## MSIX container

An MSIX container is where MSIX apps are run. To learn more, see [MSIX containers](/windows/msix/msix-container).

## MSIX application 

An application stored in an .MSIX file.

## MSIX package 

An MSIX package is an MSIX file or application.

## MSIX share

An MSIX share is a network share that holds expanded MSIX packages. MSIX shares must support SMB 3 or later. The shares must also be accessible to the Virtual Machines (VM) in the host pool system account. MSIX packages get staged from the MSIX share without having to move application files to the system drive. 

## MSIX image

An MSIX image is a VHD, VHDx, or CIM file that contains one or more MSIX packaged applications. Each application is delivered in the MSIX image using the MSIXMGR tool.





## Upload an MSIX package 

Uploading an MSIX package involves uploading the VHD(x) or [CIM](#cim) that contains an expanded MSIX package to the MSIX share.

In Azure Virtual Desktop, uploads happen once per MSIX share. Once you upload a package, all host pools in the same subscription can reference it.



## Deregistration

Deregistration removes a registered but non-running MSIX package for a user. Deregistration happens while the user signs out of their session. During deregistration, MSIX app attach pushes application data specific to the user to the local user profile.

## Destage

Destaging notifies the OS that an MSIX package or application that currently isn't running and isn't staged for any user can be unmounted. This removes all reference to it in the OS.



## Next steps

If you want to learn more about MSIX app attach, check out our [overview](what-is-app-attach.md) and [FAQ](app-attach-faq.yml). Otherwise, get started with [Set up app attach](app-attach.md).
