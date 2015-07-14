

<properties 
	pageTitle="Using Azure AD Connect declarative provisioning" 
	description="Learn how to use the Azure AD Connect declarative provisioning." 
	services="active-directory" 
	documentationCenter="" 
	authors="billmath" 
	manager="swadhwa" 
	editor="curtand"/>

<tags 
	ms.service="active-directory" 
	ms.workload="identity" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/28/2015" 
	ms.author="billmath"/>

# Azure AD Connect declarative provisioning


## Using declarative provisioning 
Declarative provisioning is "codeless" provisioning and can be setup and configured using the Synchronization Rules Editor.  The Editor can be used setup and create your own provisioning rules.

An essential part of Declarative Provisioning is the expression language used in attribute flows. The language used is a subset of Microsoft® Visual Basic® for Applications (VBA). This language is used in Microsoft Office and users with experience of VBScript will also recognize it. The Declarative Provisioning Expression Language is only using functions and is not a structured language; there are no methods or statements. Functions will instead be nested to express program flow.

For more information on the expression language see [Understanding Declarative Provisioning Expressions](https://msdn.microsoft.com/library/azure/dn801048.aspx) 