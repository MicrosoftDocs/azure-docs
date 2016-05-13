<properties
   pageTitle="Resiliency technical guidance index | Microsoft Azure"
   description="Index of technical content on understanding and designing resilient, highly available, fault tolerant applications as well as planning for disaster recovery and business continuity"
   services=""
   documentationCenter="na"
   authors="adamglick"
   manager="hongfeig"
   editor=""/>

<tags
   ms.service="resiliency"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/13/2016"
   ms.author="patw;jroth;aglick"/>

#Azure Resiliency Technical Guidance - Index

##Introduction

Meeting high availability and disaster recovery requirements requires two types of knowledge: 1) detailed technical understanding of a cloud platform’s capabilities and 2) how to properly architect a distributed service. This paper covers the former - the capabilities and limitations of the Azure platform with respect to Resiliency (sometimes refered to as Business Continuity). While it also touches on architecture and design patterns that is not the focus. The reader should consult the material in the other Additional Resources section for design guidance.

The information is organized into the following sections:
##[Recovery from local failures](./resiliency-technical-guidance-local-failures.md)
Physical hardware (for example drives, servers, and network devices) can all fail and resources can be exhausted when load spikes. This section describes the capabilities Azure provides to maintain high availability under these conditions.

##[Recovery from loss of an Azure region](./resiliency-technical-guidance-recovery-loss-azure-region.md)
Widespread failures are rare but possible. Entire regions can become isolated due to network failures, or be physically damaged due to natural disasters. This section explains how to use Azure’s capabilities to create applications that span geographically diverse regions.

##[Recovery from on-premises to Azure](./resiliency-technical-guidance-recovery-on-premises-azure.md)
The cloud significantly alters the economics of disaster recovery, making it possible for organizations to use Azure to establish a second site for recovery. This can be done at a fraction of the cost of building and maintaining a secondary datacenter. This section explains the capabilities Azure provides for extending an on premises datacenter to the cloud.

##[Recovery from data corruption or accidental deletion](./resiliency-technical-guidance-recovery-data-corruption.md)
Applications can have bugs which corrupt data and operators can incorrectly delete important data. This section explains what Azure provides for backing up data and restoring to a previous point it time.

##[Additional Resources](./resiliency-technical-guidance-additional-resources.md)
Other useful resources covering resiliency, availability and disaster recovery in Azure.
