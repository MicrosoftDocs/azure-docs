<properties
	pageTitle="How to work with the .NET backend server SDK for Mobile Apps | Azure App Service"
	description="Learn how to work with the .NET backend server SDK for Azure App Service Mobile Apps."
	services="app-service\mobile"
	documentationCenter=""
	authors="ggailey777" 
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-multiple"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="08/03/2015"
	ms.author="glenga"/>

# Work with the .NET backend server SDK for Azure Mobile Apps 

This topic shows you how to use the .NET backend server SDK in key Azure App Service Mobile Apps scenarios.

## How to: Define a table controller



## How to: Define a custom API controller

You define a custom API controller by applying the Microsoft.Azure.Mobile.Server.Config.MobileAppControllerAttribute to the controller class that inherits from API controller, as in the following example:

	using System;
	using System.Collections.Generic;
	using System.Web.Http;
	using Microsoft.Azure.Mobile.Server.Config;
	namespace todolistService.Controllers
	{
	    [MobileAppController] 
	    public class TestController : ApiController
	       {
	              //...
	       }
	}

## How to: Add authentication to a server project

## How to: Add push notifications to a server project

## How to: Publishing the server project

### Visual Studio publishing

### Git publishing