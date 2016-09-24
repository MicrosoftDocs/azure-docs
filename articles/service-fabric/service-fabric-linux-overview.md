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

The preview will be made publicly available on September 26 as announced [in this blog post](https://azure.microsoft.com/blog/service-fabric-on-linux-support-available-this-month/). The preview of Service Fabric on Linux enables you to build, deploy, and manage highly available, highly scalable applications on Linux just as you would on Windows. In addition, the high-level Service Fabric frameworks (Reliable Services and Reliable Actors) are now available in Java on Linux.

> [AZURE.VIDEO service-fabric-linux-preview]

## Supported operating systems and programming languages

The limited preview supports the creation of one-box development clusters in addition to multi-machine clusters in Azure running Ubuntu Server 16.04.

You can build [guest executable services](service-fabric-deploy-existing-app.md) with any language or framework. You can also use Java or C# to build services based on the Reliable Services and Reliable Actor frameworks, in addition to orchestrating Docker containers.

>[AZURE.NOTE] Reliable Collections are not supported in Linux yet.

Service Fabric on Linux is conceptually equivalent to Service Fabric on Windows (except for OS specifics and programming language support). Thus, most of our [existing documentation](http://aka.ms/servicefabricdocs) applies in helping you get familiar with the technology.

## Next steps

Get familiar with the [Reliable Actors](service-fabric-reliable-actors-introduction.md) and [Reliable Services](service-fabric-reliable-services-introduction.md) programming frameworks.
