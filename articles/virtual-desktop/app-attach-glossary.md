---
title: Windows Virtual Desktop MSIX app attach glossary - Azure
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

## Repackage

Repackaging takes a non-MSIX application and converts it into MSIX using the MSIX Packaging Tool (MPT). For more information, see [MSIX Packaging Tool overview](/windows/msix/packaging-tool/tool-overview).

## Expand an MSIX package

Expanding an MSIX package is a multi-step process. Expansion takes the MSIX file and puts its content into a VHD(x) or CIM file. 

To expand an MSIX package:

1. Get an MSIX package (MSIX file).
2. Rename the MSIX file to a .zip file.
3. Unzip the resulting .zip file in a folder.
4. Create a VHD that's the same size as the folder.
5. Mount the VHD.
6. Initialize a disk.
7. Create a partition.
8. Format the partition.
9. Copy the unzipped content into the VHD.
10. Use the MSIXMGR tool to apply ACLs on the content of the VHD.
11. Unmount the VHD(x) or [CIM](#cim).

## Upload an MSIX package 

Uploading an MSIX package involves uploading the VHD(x) or [CIM](#cim) that contains an expanded MSIX package to the MSIX share.

In Windows Virtual Desktop, uploads happen once per MSIX share. Once you upload a package, all host pools in the same subscription can reference it.

## Add an MSIX package

In Windows Virtual Desktop, adding an MSIX package links it to a host pool.

## Publish an MSIX package 

In Windows Virtual Desktop, a published MSIX package must be assigned to an Active Directory Domain Service (AD DS) or Azure Active Directory (Azure AD) user or user group.

## Staging

Staging involves two things:

- Mounting the VHD(x) or [CIM](#cim) to the VM.
- Notifying the OS that the MSIX package is available for registration.

## Registration

Registration makes a staged MSIX package available for your users. Registering is on a per-user basis. If you haven't explicitly registered an app for that specific user, they won't be able to run the app.

There are two types of registration: regular and delayed.

### Regular registration

In regular registration, each application assigned to a user is fully registered. Registration happens during the time the user signs in to the session, which might impact the time it takes for them to start using Windows Virtual Desktop.

### Delayed registration

In delayed registration, each application assigned to the user is only partially registered. Partial registration means that the Start menu tile and double-click file associations are registered. Registration happens while the user signs in to their session, so it has minimal impact on the time it takes to start using Windows Virtual Desktop. Registration completes only when the user runs the application in the MSIX package.

Delayed registration is currently the default configuration for MSIX app attach.

## Deregistration

Deregistration removes a registered but non-running MSIX package for a user. Deregistration happens while the user signs out of their session. During deregistration, MSIX app attach pushes application data specific to the user to the local user profile.

## Destage

Destaging notifies the OS that an MSIX package or application that currently isn't running and isn't staged for any user can be unmounted. This removes all reference to it in the OS.

## CIM

.CIM is a new file extension associated with Composite Image Files System (CimFS). Mounting and unmounting CIM files is faster that VHD files. CIM also consumes less CPU and memory than VHD.

A CIM file is a file with a .CIM extension that contains metadata and at least six additional files that contain actual data. The files within the CIM file don't have extensions. The following table is a list of example files you'd find inside a CIM:

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

## Next steps

If you want to learn more about MSIX app attach, check out our [overview](what-is-app-attach.md) and [FAQ](app-attach-faq.md). Otherwise, get started with [Set up app attach](app-attach.md).
