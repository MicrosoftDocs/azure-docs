<properties 
	pageTitle="Use the Mobile Services .NET Backend - Azure Mobile Services" 
	description="Learn the details of the .NET Backend programming model for Azure Mobile Services, including how to work with table data, APIs, authentication, and scheduled jobs" 
	services="mobile-services" 
	documentationCenter="" 
	authors="mattchenderson" 
	manager="dwrede" 
	editor="mollybos"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="11/11/2014" 
	ms.author="mahender"/>
# Use the Mobile Services .NET Backend

<div class="dev-center-tutorial-subselector"><a href="/en-us/documentation/articles/mobile-services-dotnet-backend-how-to-use/" title=".NET backend" class="current">.NET backend</a> | <a href="/en-us/documentation/articles/mobile-services-how-to-use-server-scripts/"  title="JavaScript backend">JavaScript backend</a></div>

This article provides detailed information about and examples of how to work with the .NET backend in Azure Mobile Services. This topic is divided into these sections:

+ [Introduction](#intro)
+ [Table operations](#table-scripts)

##<a name="intro"></a>Introduction

The Mobile Services .NET backend enables you to write rich backend business logic using [ASP.NET Web API](http://www.asp.net/web-api) and your favorite .NET language. Mobile Services exposes a small programming model surface as [NuGet packages](http://www.nuget.org/packages?q=%22mobile+services+.net+backend%22), which facilitate seamless access to your service from the cross-platform Mobile Services client SDKs for Windows, Android, iOS, etc. These APIs also ensures that adding authentication and push notification support is made as simple as possible. However, for the most part the programming model is based on Web API, and developers familiar with it should feel right at home. 

##<a name="table-scripts"></a>Table operations

The Mobile Services .NET baceknd provides a universal "table" abstraction, which represents a CRUD-based HTTP API for database storage. This abstration separates data storage concerns from your  business logic and enables your mobile service to expose different data stores in a consistent JSON-based wire format, that is readily understood by the cross-platform Mobile Services client SDKs. 

At the root of this programming model is the [**TableController<T>**](http://msdn.microsoft.com/library/dn643359.aspx) class, which is just a regular Web API [**ApiController**](http://msdn.microsoft.com/library/system.web.http.apicontroller.aspx), that is customized for a CRUD data access pattern. The **TableController** can use a variety of data stores, including SQL (through [Entity Framework](http://msdn.microsoft.com/data/ef.aspx)), [Azure Table Storage](http://azure.microsoft.com/documentation/services/storage/), [MongoDB](http://www.mongodb.org), or your own custom store.