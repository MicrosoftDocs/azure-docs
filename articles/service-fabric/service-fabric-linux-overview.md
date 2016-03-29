<properties
   pageTitle="Azure Service Fabric Limited Preview on Linux | Microsoft Azure"
   description="Service Fabric clusters support Linux and Java, which means you'll be able to deploy and host Service Fabric applications written in Java on Linux."
   services="service-fabric"
   documentationCenter=".net"
   authors="mani-ramaswamy"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="Java"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="03/29/2016"
   ms.author="SubramaR"/>

# Service Fabric limited preview on Linux

A successful platform must be cloud agnostic as well as operating system agnostic, giving customers the most choice and customization power. Recently we announced the availability of a limited preview of Service Fabric on Linux. A key benefit of Linux support is you have complete customization when you build an application (including OS specific dependencies) using Service Fabric.  In addition, you avoid being locked in a specific operating system. This also increases your potential to reach out to a broader set of customers since different customers can have varying requirements for the environments where they want to run your applications. For example, healthcare and financial industry customers may have different needs than an automaker or a travel business.

## Supported operating systems and programming languages

The limited preview will support the creation of one-box development clusters as well as multi-machine clusters in Azure running Ubuntu Server 15.10. In this preview Java is the only supported language for creating Service Fabric applications. Any existing application can run as a guest executable, however, the same as in a cluster created on Windows Server. Support for C# development is planned, along with support for other OS versions.

## Participate in the preview

If you are interested in being considered for participation in the limited preview program (there are only a limited number of seats available), please fill out the survey at [http://aka.ms/sflinux](http://aka.ms/sflinux).
