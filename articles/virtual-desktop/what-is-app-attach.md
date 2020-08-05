---
title: Windows Virtual Desktop MSIX app attach - Azure
description: What is MSIX app attach? Find out in this article.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/04/2020
ms.author: helohr
manager: lizross
---
# What is MSIX app attach?

MSIX is a new packaging format that offers many features aimed to improve packaging experience for all Windows app. to learn more about MSIX, see [the MSIX overview](/windows/msix/overview).

MSIX app attach is a way to deliver MSIX applications to both physical and virtual machines.

## Comparing MSIX and MSIX app attach

MSIX and MSIX app attach are two different technologies. The two technologies are related and complement each other; however, they are not interchangeable. This section discusses the relation between MSIX and MSIX app attach.

## Application delivery options in Windows Virtual Desktop

You can deliver apps in Windows Virtual Desktop through one of the following methods:

-   Application are put in a master image

-   Central management using tools like SCCM or Intune

-   Dynamic app provisioning (AppV, VMWare AppVolumes, Citrix AppLayering)

-   Custom tools or scripts using Microsoft and a third-party tool

## MSIX app attach goals

These are the goals MSIX app attach is meeting:

-   Create separation between user’s data, OS, and applications state by using [MSIX containers](/windows/msix/msix-container).

-   As MSIX adoption grows remove the need for repackaging when delivering applications dynamically

-   Minimal impact on user logon times

-   Reduce infrastructure requirements and cost

-   MSIX app attach must be applicable outside of VDI/SBC

## Traditional app layering compared to MSIX app attach

The table below compares key feature of MSIX app attach and app layering.

|     | *Traditional app layering*  | *MSIX app attach*  |
|-----|-----------------------------|--------------------|
| **Format**               | Different app layering technologies require different proprietary formats. | Works with the native MSIX packaging format.        |
| **Repackaging overhead** | Proprietary formats require sequencing and repackaging per update.         | Apps published as MSIX do not require repackaging\*.  |
| **Ecosystem**            | N/A (e.g. no vendor ships App-V)  | MSIX is MSFT’s mainstream technology which is getting adopted by key ISV partners and in-house apps (e.g. Office). MSIX can be used across virtual desktops or physical Windows end points. |
| **Infrastructure**       | Additional infrastructure required (servers, clients, etc.) | Storage only   |
| **Administration**       | Requires maintenance and update   | Simplifies app updates |
| **User experience**      | Impacts logon time. Boundary exists between OS state/app state/user data.  | Apps delivered via MSIX app attach are indistinguishable from locally installed applications. |

*\*Note: if MSIX package is not available repackaging overhead applies*

### MSIX app attach diagram 

Below is a diagram showing user establishing a connection through Windows Virtual Desktop to host pool configured with FSLogix and MSIX app attach.

![A picture containing screenshot Description automatically generated](media/bbc4d9488f1408cbf1a02807089077cd.png)

1.  User authenticates against Azure AD and obtains Windows Virtual Desktop feed

2.  RD Broker working with RD Gateway, and RD agent orchestrate a connection to a VM

3.  VM initiates creation of user session and FSLogix “brings” the user profile

4.  RD Agent is notified what MSIX packages must be registered for the user

5.  RD Agent registers MSIX packages

6.  Session establishment is completed, and user can interact with any of the MSIX packages.

## MSIX term dictionary

This section covers key terms and concepts.

### MSIX container

All MSIX applications run in a lightweight container. More information [here](/windows/msix/msix-container).

### MSIX application 

An application stored in .MSIX file.

### MSIX package 

See MSIX application. This is the preferred term for refencing a .MSIX file/application.

### MSIX share

This is a network share that supports SMB 3 or greater from where expanded MSIX packages are stored. From this MSIX share applications get staged without having to move application files to system drive.

### Repackage

Taking a non-MSIX application and converting it to MSIX via the MSIX Packaging Tool (MPT). More information [here](/windows/msix/packaging-tool/tool-overview).

### Expand

Expanding MSIX package is a multi-step process. It takes the .MSIX file and put its content into a VHD(x) or CIM file. Below are the steps of expanding an MSIX package:

1.  Obtain a MSIX package (.MSIX file)

2.  Rename the .MSIX file to .Zip

3.  Unzip the resulting file to a folder

4.  Create a VHD with size equal to the size of the folder

5.  Mount the VHD

6.  Initialize a disk

7.  Create partition

8.  Format the partition

9.  Copy the unzipped content into the VHD

10. Use MSIXMGR to apply ACLs on the content of the VHD. More information on applying ACLs [here](../../../../Downloads/msixmgr.exe%20-Unpack%20-packagePath%20%3cpackage%3e.msix%20-destination%20%22f:/%3cname%20of%20folder%20you%20created%20earlier%3e%22%20-applyacls).

11. Unmount the VHD(x)/CIM

### Upload an MSIX package 

This is the process of uploading VHD(x)/CIM containing an expanded MSIX package to the MSIX share.

In the context of Windows Virtual Desktop upload is performed once per MSIX share and then multiple host pools in the same subscription can reference the uploaded package.

### Publish an MSIX package

In the context of Windows Virtual Desktop publishing a MSIX package is the process of linking it to a remote app or desktop.

### Assign an MSIX package 

In the context of Windows Virtual Desktop after a MSIX package has been published it must be assigned to an AD DS/Azure AD user or user group.

### Staging

In the context of MSIX app attach staging is:

-   Mounting the VHD(x)/CIM to the VM

-   Notify the OS that the MSIX package is available for registration

### Registration

Registration is the process of making a staged MSIX package available to the user. Registering is done per user. If an application has not been explicitly registered for that user, he/she will not be able to interact (run) the application.

There are two types of registration, regular and delayed.

#### Regular registration

When regular registration is configured, each application assigned to the user is fully registered. This happens during session log on which may lead to impact on session log on time.

#### Delayed registration

When delayed registration is configured, each application assigned to the user is partially registered. Partially registered means that start menu tile and double click file associations are registered. This happening during session log on has minimal impact on session log on time. The rest of the registration is completed if and only when the user starts the MSIX packaged application.

By default, delay register is used with MSIX app attach. However, we are planning to make this configurable by the IT professional.

### Deregister

Deregister is the process of removing a registered but non-running MSIX package for a user. This happens at user logging off. During deregistration application data specific to the user is pushed to the local user profile.

### Destage

Destaging is the process of notifying the OS that a MSIX package/application that is currently not running and not staged for any user can be unmounted and all reference in the OS to it removed.

### CIM

.CIM is a new file extension associated with Composite Image Files System (CimFS). Mounting and unmounting of CIM files is faster that VHD files. CIM further consumes less CPU and memory. TBD

|                                 | *VHD*                    | *CimFS*   |
|---------------------------------|--------------------------|-----------|
| **Average mount time (ms)**     | 356                      | 255       |
| **Average unmount time (ms)**   | 1615                     | 36        |
| **Memory consumption (of 8GB)** | 6%                       | 2%        |
| **CPU (count spike)**           | Maxed out multiple times | No impact |

\*Test was run with 500 files each with size of 300 MB on a DSv4 machine.

