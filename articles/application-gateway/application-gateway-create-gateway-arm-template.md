
<properties 
   pageTitle="Create, start, or delete an Application Gateway using Azure Resource Manager | Microsoft Azure"
   description="This page provides instructions to create, configure, start, and delete an Azure Application Gateway using Azure Resource Manager"
   documentationCenter="na"
   services="application-gateway"
   authors="joaoma"
   manager="jdial"
   editor="tysonn"/>
<tags 
   ms.service="application-gateway"
   ms.devlang="na"
   ms.topic="hero-article" 
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services" 
   ms.date="09/17/2015"
   ms.author="joaoma"/>


# Create Application Gateway using ARM template

Application Gateway is load balancer layer 7. It provides failover, performance routing HTTP requests between different servers, whether they are on the cloud or on premise. Application gateway has the following application delivery features: HTTP load balancing, Cookie based session affinity, SSL offload. 

[AZURE.INCLUDE [azure-arm-classic-important-include](../../includes/azure-arm-classic-important-include.md)]This document will cover creating an Application Gateway using Azure Resource Manager. To use the classic version, go to [create an Application Gateway classic deployment using PowerShell](application-gateway-create-gateway.md).


This template creates an Application Gateway, Public IP address for the Application Gateway, and the Virtual Network in which Application Gateway is deployed. Also configures Application Gateway for Http Load balancing with Two back end servers. Note that you have to specify valid IP's  for back end servers.

##