<properties
   pageTitle="Azure Service Fabric on Linux | Microsoft Azure"
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
   ms.date="09/14/2016"
   ms.author="SubramaR"/>

# Service Fabric on Linux

Service Fabric is currently available as a limited preview on Linux, enabling you to build, deploy, and manage highly available, highly scalable applications in that environment just as you would on Windows. In addition, the high-level Service Fabric frameworks (Reliable Services and Reliable Actors) can now be built in Java.

> [AZURE.VIDEO service-fabric-linux-preview]

## Supported operating systems and programming languages

The limited preview supports the creation of one-box development clusters as well as multi-machine clusters in Azure running Ubuntu Server 16.04.

You can build [guest executable services](service-fabric-deploy-existing-app.md) with any language or framework. You can also use Java or C# to build services based on the Reliable Services and Reliable Actor frameworks, as well as orchestrate Docker containers.

>[AZURE.NOTE] Reliable Collections are not supported in Linux yet.

## Participate in the preview

The preview will be made publicly available on September 26 as announced [in this blog post](https://azure.microsoft.com/en-us/blog/service-fabric-on-linux-support-available-this-month/).

Please note that Service Fabric on Linux will be conceptually equivalent to what is available on Windows (except for OS specifics and programming language support), so most of our [existing documentation](http://aka.ms/servicefabricdocs) applies and will help you get familiar with the technology.

## Next steps

Get familiar with the [Reliable Actors](service-fabric-reliable-actors-introduction.md) and [Reliable Services](service-fabric-reliable-services-introduction.md) programming frameworks.
