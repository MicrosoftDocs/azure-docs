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

# SDKs Options

There are many ways to program with Azure Communication Services, and four common scenarios with corresponding examples are listed below to help you get started: 
- Person to person video calling through client applications, such as an iOS app or Web Page.
- Person to person audio accessing the public switched telephone network (PSTN) via client applications, such as an iOS app or Web Page.
- Person to person text communication (Chat) via client applications, such as an iOS app or Web Page.
- A web service communicating with a person through SMS.

ACS capabilities are conceptually organized into 7 areas, which align to API namespaces where appropriate for the language. Some areas have fully open-sourced SDKs and can be directly accessed over the network. These open-source SDKs can be found in the Azure SDK GitHub repository. The Calling APIs use proprietary network interfaces and require packaged libraries built by the ACS team. 

Area    | Protocols| Capabilities 
----|----|---|
ARM | REST    | Control plane, Provision ACS resources
Core|    REST    |Bases types for other areas, APIs for telemetry, creating rooms, token management 
Management|REST|    Phone numbers, Rooms, Users, etc. 
Calling |     Proprietary transport | Create and connect to system-to-person or person-to-person voice, video, screen-sharing, and other real-time data communication.
Chat |    REST |    Create and connect to system-to-person or person-to-person text interactions.
SMS |     REST |    Create and connect to system-to-person or person-to-person SMS interactions.
Network Traversal    | REST, RFC 5389 STUN, RFC 5766 TURN |    Create STUN and TURN servers and access their traversal capabilities  

ACS provides SDKs for 8 languages, and where applicable publishes built libraries for those languages in an appropriate public repository. 
 
Language |    Optimized for…    | Packaging 
|-|-|-|
Azure CLI|    Command line management on both Windows and Linux    | pypi, Azure cloud shell 
.NET | Cross-platform | NuGet
Python | Windows & Linux Servers |    Pypi
Java (J2EE)    | JVM on Windows or Linux Servers |    Maven
Swift |    iOS client applications    | CocoaPods
Java (Android) |    Android client applications    | Maven
JavaScript |    Browser client applications and Node |    Npm

There are more than 30 individual SDK packages collated below.

Area    | Code Available on GitHub?    | .NET | Python | Java | Swift | Java (Android) |    JavaScript |    Go & more
|-|-|-|-|-|-|-|-|-|
ARM    | Yes |    Yes    |Yes |    -    |-|    -    |Yes|    Yes
Core    |Yes |    Yes    | Yes |    Yes|    Yes|    Yes|    Yes|    -
Management    |Yes    |Yes    |Yes    |Yes|    -|    -|    Yes |-
Calling     |- |Yes    | -    |-|    Yes |Yes |    Yes|    -
Chat |    Yes    |Yes    |Yes    |Yes    |Yes    |Yes    |Yes    |-
SMS     |Yes    |Yes    |Yes    |Yes    |Yes    |Yes    |Yes    |-
Network Traversal |    Yes| Yes    |- |Yes | Yes    |Yes    |Yes    |-

## Details of .NET Support

With the exception of Calling, all ACS packages  target .NET Standard 2.0 which supports the platforms listed below. 
-    .NET Framework 4.6.1
-    Windows 10, 8.1, 8 and 7
-    Windows Server 2012 R2, 2012 and 2008 R2 SP1
-    .NET Core 2.0 which supports:
-    Windows 10 (1607+), 7 SP1+, 8.1
-    Windows Server 2008 R2 SP1+
-    Max OS X 10.12+
-    Linux multiple versions/distributions
-    UWP 10.0.16299 (RS3) September 2017 
-    Unity 2018.1
-    Mono 5.4
-    Xamarin iOS 10.14
-    Xamarin Mac 3.8

The Calling library has tuned platform specific code for voice and video that requires multiple targeted .NET libraires:
- Calling for .NET Core 5.0
- Calling for .NET TBD TBD
