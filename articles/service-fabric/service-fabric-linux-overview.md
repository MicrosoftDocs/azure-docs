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

Recently we announced the availability of a limited preview of Service Fabric on Linux. This gives you complete customization when building an application (including Operating System preferences and dependencies). The Operating System choice may also allow you broaden your customer base, since different customers can have varying requirements for the environments where applications are executed. For example, healthcare and financial industry customers may have different needs than an automaker or a travel business, including different Operating Systems.

## Supported operating systems and programming languages

The limited preview will support the creation of one-box development clusters as well as multi-machine clusters in Azure running Ubuntu Server 15.10. In this preview Java is the only supported language for creating Service Fabric applications. While any existing application can run as a [guest executable] (https://azure.microsoft.com/en-us/documentation/articles/service-fabric-deploy-existing-app/), Service Fabric applications using the provided Java APIs are best-placed to take advantage of all the features that the platform provides. Support for C# development is planned, along with support for other OS versions.

## Participate in the preview

If you are interested in being considered for participation in the limited preview program (there are only a limited number of seats available), please fill out the survey at [http://aka.ms/sflinuxsurvey](http://aka.ms/sflinuxsurvey). Since our offering on Linux is similar to the offering on Windows (except for OS specifics and Programming Language support), the public documentation at [http://aka.ms/servicefabric](http://aka.ms/servicefabric) and [http://aka.ms/servicefabricdocs](http://aka.ms/servicefabricdocs) will help you get familiar with the technology.

