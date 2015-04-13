<properties 
   pageTitle="FabSrv Programming Model Overview" 
   description="FabSrv " 
   services="service-fabric" 
   documentationCenter=".net" 
   authors="masnider" 
   manager="timlt" 
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="required" 
   ms.date="03/17/2015"
   ms.author="masnider@microsoft.com"/>

# FabSrv Programming Model Overview

The FabSrv programming model is one of the top level programming models available for Service Fabric, available alongside the FabAct programming model. 

## Introduction

FabSrv prevents a simplified programming model that provides a common model for writing new services, specifically:

1. A pluggable communication model - use the transport of your choice, like HTTP WebAPI, WebSockets, Custom TCP protocols, etc.

2. A simplified model for running your own code - compared to lower level Service Fabric abstractions the FabSrv model looks much like programming models that people are used: your code has a well defined entry point and easily managed lifecycle


## When to Use


## Service Lifecycle
 
## Expected Performance, Density, and Scale

## Next Steps
