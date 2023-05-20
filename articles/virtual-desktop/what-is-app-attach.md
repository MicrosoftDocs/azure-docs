---
title: Azure Virtual Desktop MSIX app attach overview - Azure
description: What is MSIX app attach? Find out in this article.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 02/08/2023
ms.author: helohr
manager: femila
---
# What is MSIX app attach?

MSIX is a packaging format that offers many features aimed to improve packaging experience for all Windows apps. To learn more about MSIX, see the [MSIX overview](/windows/msix/overview).

MSIX app attach is a way to deliver MSIX applications to both physical and virtual machines. However, MSIX app attach is different from regular MSIX because it's made especially for supported products, such as Azure Virtual Desktop. This article will describe what MSIX app attach is and what it can do for you.

## What does MSIX app attach do?

In an Azure Virtual Desktop deployment, MSIX app attach delivers apps to session hosts within [MSIX containers](/windows/msix/msix-container). These containers separate user data, the OS, and apps, increasing security and ensuring easier troubleshooting if something goes wrong. App attach removes the need for repackaging apps when delivering applications dynamically, which increases the speed of deployments and reduces the time it takes for users to sign in to their remote sessions. This rapid delivery reduces operational overhead and costs for your organization.

MSIX app attach allows you to dynamically attach apps from an MSIX package to a user session. The MSIX package system separates apps from the operating system, making it easier to build images for virtual machines. MSIX packages also give you greater control over which apps your users can access in their virtual machines. You can even separate apps from the custom image and make them available them to users later.

## Terminology

The following table lists the components that make up MSIX app attach.

| Term | Definition |
|---|---|
| MSIX container | A lightweight app container. All apps within the container are isolated using file system and registry virtualization. For more information, see [MSIX container](/windows/msix/msix-container). |
| MSIX application | An application stored within an MSIX container. The application and all its child processes run inside of the container. |
| MSIX package | The .MSIX file that the container and its applications are stored inside. |
| MSIX share | A network share that holds expanded MSIX packages. MSIX shares must support SMB 3 or later, and be accessible to VMs in the host pool system account. MSIX packages get staged from the share without having to move application files ot the system drive. |
| MSIX image | A VHD, VHDx, or CIM file that contains one or more MSIX packaged applications. Each application is delivered in the MSIX image using the MSIXMGR tool. |

## Phases of MSIX app attach

In order to use MSIX packages, you must stage and register them. After you're finished using the packages, you destage and deregister them. For more detailed information about each stage and how to perform them, see [Test and troubleshoot MSIX packages with MSIX app attach](app-attach.md).

>[!NOTE]
>All MSIX application packages include a certificate. You're responsible for making sure the certificates for MSIX applications are trusted in your environment.

## Staging

Staging involves two things:

- Mounting the VHD(x) or [CIM](#cim) to the VM.
- Notifying the OS that the MSIX package is available for registration.

## Registration

Registration makes a staged MSIX package available for your users. Registering is on a per-user basis. If you haven't explicitly registered an app for that specific user, they won't be able to run the app.

There are two types of registration: regular and delayed.

### Regular registration

In regular registration, each application assigned to a user is fully registered. Registration happens during the time the user signs in to the session, which might impact the time it takes for them to start using Azure Virtual Desktop.

### Delayed registration

In delayed registration, each application assigned to the user is only partially registered. Partial registration means that the Start menu tile and double-click file associations are registered. Registration happens while the user signs in to their session, so it has minimal impact on the time it takes to start using Azure Virtual Desktop. Registration completes only when the user runs the application in the MSIX package.

Delayed registration is currently the default configuration for MSIX app attach.

## CIM

.CIM is a new file extension associated with Composite Image Files System (CimFS). Mounting and unmounting CIM files is faster that VHD files. CIM also consumes less CPU and memory than VHD.

A CIM file is a file with a .CIM extension that contains metadata and at least two additional files that contain actual data. The files within the CIM file don't have extensions. The following table is a list of example files you'd find inside a CIM:

| File name | Extension | Size |
|-----------|-----------|------|
| VSC | CIM | 1 KB |
| objectid_b5742e0b-1b98-40b3-94a6-9cb96f497e56_0 | NA | 27 KB |
| objectid_b5742e0b-1b98-40b3-94a6-9cb96f497e56_1 | NA | 20 KB |
| objectid_b5742e0b-1b98-40b3-94a6-9cb96f497e56_2 | NA | 42 KB |
| region_b5742e0b-1b98-40b3-94a6-9cb96f497e56_0 | NA | 428 KB |
| region_b5742e0b-1b98-40b3-94a6-9cb96f497e56_1 | NA | 217 KB |
| region_b5742e0b-1b98-40b3-94a6-9cb96f497e56_2 | NA | 264,132 KB |

The following table is a performance comparison between VHD and CimFS. These numbers were the result of a test run with five hundred 300 MB files in each format run on a DSv4 machine.

|  Specs                          | VHD                    | CimFS   |
|---------------------------------|--------------------------|-----------|
| Average mount time     | 356 ms                     | 255 ms      |
| Average unmount time   | 1615 ms                    | 36 ms       |
| Memory consumption | 6% (of 8 GB)                      | 2% (of 8 GB)       |
| CPU (count spike)          | Maxed out multiple times | No impact |

## Traditional app layering compared to MSIX app attach

The following table compares key feature of MSIX app attach and app layering.

| Feature | Traditional app layering  | MSIX app attach  |
|-----|-----------------------------|--------------------|
| Format               | Different app layering technologies require different proprietary formats. | Works with the native MSIX packaging format.        |
| Repackaging overhead | Proprietary formats require sequencing and repackaging per update.         | Apps published as MSIX don't require repackaging. However, if the MSIX package isn't available, repackaging overhead still applies. |
| Ecosystem            | N/A (for example, vendors don't ship App-V)  | MSIX is Microsoft's mainstream technology that key ISV partners and in-house apps like Office are adopting. You can use MSIX on both virtual desktops and physical Windows computers. |
| Infrastructure       | Additional infrastructure required (servers, clients, and so on) | Storage only   |
| Administration       | Requires maintenance and update   | Simplifies app updates |
| User experience      | Impacts user sign-in time. Boundary exists between OS state, app state, and user data.  | Delivered apps are indistinguishable from locally installed applications. |

## Next steps

If you want to learn more about MSIX app attach, check out our [glossary](app-attach-glossary.md) and [FAQ](app-attach-faq.yml). Otherwise, get started with [Set up MSIX app attach with the Azure portal](app-attach-azure-portal.md).
