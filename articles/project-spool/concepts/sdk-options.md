---
title: SDK Options
description: TODO
author: mikben
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/18/2020
ms.topic: conceptual
ms.service: azure-project-spool

---

# SDK Options

Azure Communication Services (ACS) capabilities are conceptually organized into 7 areas, which align to packaged assembles and API namespaces where appropriate for the language. Some areas have fully open-sourced SDKs and can be directly accessed over the network. These open-source SDKs can be found in the Azure SDK GitHub repository. The Calling APIs use proprietary network interfaces and require packaged libraries built by the ACS team.

Assembly    | Protocols| Namespaces| Capabilities
----|----|---|---|
Azure Resource Manager | REST    | Azure.ResourceManager.Communication  |Control plane, Provision ACS resources
Common|    REST    |Azure.Communication.Common|Bases types for other areas, APIs for telemetry, creating rooms, token management
Configuration|REST|Azure.Communication.Configuration|   Manage phone numbers, rooms, etc.
Chat |    REST |Azure.Communication.Chat| Leverage threaded rich text chat.
SMS |     REST | Azure.Communication.SMS|    Send and receive SMS messages.
Calling |     Proprietary transport |Azure.Communication.Calling | Leverage voice, video, screen-sharing, and other real-time data communication capabilities. 
Network Traversal    | REST, RFC 5389 STUN, RFC 5766 TURN | Azure.Communication.Networking | Create STUN and TURN servers and access their traversal capabilities  

Current availability guidance and timelines for individual SDK packages are collated below. During the private preview these timelines will change signficiantly as we incorporate customer feedback and balance engineering priorities.

Area|  .NET | Python|Java | Swift or Obj-C | Java (Android)|JavaScript|Other|
-|-|-|-|-|-|-|-|
ARM  |July |    July    |September |   -  |-|September|GO - July, Azure CLI - July
Common     |**Available Now**    |July  |September| July| July| **Available Now**   |-
Configuration  | **Available Now**  |   September |  September| -|    -|    **Available Now**  | CLI|-
Chat   |September | -  |September |September    |September    |**Available Now**     |-
SMS     |**Available Now**     | -  |September |September    |September    |**Available Now**   |-
Calling   |**Available Now**  | -  |- |**Obj-C Available Now**     |**Available Now**    |**Available Now**     |
Network Traversal | - |-|-|-|-|-|-|

ACS publishes built libraries in an appropriate public repository. 

Language | Optimized for…| Packaging
-|-|-|
Azure CLI|    Command line management on both Windows and Linux    | pypi, Azure cloud shell
.NET | Cross-platform | NuGet
Python | Windows & Linux Servers |    Pypi
Java (J2EE)    | JVM on Windows or Linux Servers |    Maven
Swift |    iOS client applications    | CocoaPods
Java (Android) |    Android client applications    | Maven
JavaScript |    Browser client applications and Node |    Npm

## Details of .NET Support

With the exception of Calling, all ACS packages target .NET Standard 2.0 which supports the platforms listed below.

Support via .NET Framework 4.6.1
-    Windows 10, 8.1, 8 and 7
-    Windows Server 2012 R2, 2012 and 2008 R2 SP1

Support via .NET Core 2.0:
-    Windows 10 (1607+), 7 SP1+, 8.1
-    Windows Server 2008 R2 SP1+
-    Max OS X 10.12+
-    Linux multiple versions/distributions
-    UWP 10.0.16299 (RS3) September 2017
-    Unity 2018.1
-    Mono 5.4
-    Xamarin iOS 10.14
-    Xamarin Mac 3.8

The Calling library has tuned platform specific code for voice and video that requires multiple targeted .NET libraries:

|Target|Schedule|
|-|-|
|Windows Presentation Framework | TBD|
|WinForms |TBD|
|UWP - Hololens|TBD|
|UWP - Desktop|TBD|
|iOS Xamarin|TBD|
|Android Xamarin|TBD|

