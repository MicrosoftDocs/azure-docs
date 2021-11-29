---
title: Number Type concepts in Azure Communication Services
titleSuffix: An Azure Communication Services concept document
description: Learn about Number Type concepts.
author: sadas
manager: rcole
services: azure-communication-services

ms.author: sadas
ms.date: 11/28/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: numbers

---

# Number Types
Azure Communication Services offers three types of Numbers–Toll-Free, Local, and Short Codes.
-	**To send or receive an SMS**, choose a Toll-Free Number or a Short Code
-	**To make or receive phone calls**, choose a Toll-Free Number of a Local Number

The table below summarizes these number types with supported capabilities:

|Type |Example|Send SMS   | Receive SMS |Make Calls   |Receive Calls|Typical Use Case|Restrictions|
|:-------------|:-------------|:-------------:|:-------------:|:-------------:|:-------------:|:-------------|:-------------|
|Toll-Free|+1 (8AB) XYZ PQRS|X   	|X   	|X   	|X   	|Receive calls on IVR bots, Low-velocity SMS|SMS in US only|
|Local (Geographic)|+1 (ABC) XYZ PQRS|   	   	|   	|X   	|X   	|Georgaphy Specific Number|Calling Only|
|Short-Codes|+1 XXX-YYY|X   	|X   	|   	|   	|High-velocity SMS||
