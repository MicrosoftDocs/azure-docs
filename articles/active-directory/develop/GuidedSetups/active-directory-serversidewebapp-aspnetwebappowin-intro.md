---
title: Implementing Microsoft Sign-in on ASP.NET Web Server - Intro
description: How to  implement Microsoft Sign-In on a Visual Studio ASP.NET solution with a traditional web browser based application using OpenID Connect standard. | Microsoft Azure
services: active-directory
documentationcenter: dev-center-name
author: andretms
manager: mbaldwin
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date:
ms.author: andret

---
## Before you get started

This guide demonstrates how to implement sign in with Microsoft using an ASP.NET MVC solution with a traditional web browser-based application using OpenID Connect. 

At the end of this guide, your application will be able to accept sign ins of personal accounts (including outlook.com, live.com, and others) as well as work and school accounts from any company or organization that has integrated with Azure Active Directory. 

> For this tutorial, we assume you’re using Visual Studio 2015 Update 3 or Visual Studio 2017.  Don’t have it?  [Download Visual Studio 2017 for free](https://www.visualstudio.com/downloads/)

## How this sample works

![How this sample works](media/active-directory-serversidewebapp-aspnetwebappowin-intro/aspnetbrowsergeneral.png)

This sample is based on the scenario where a browser accesses an ASP.NET web site, requesting a user to authenticate via a sign-in button. In this scenario, most of the work to render the web page occurs on the server side.

## Libraries

This guide uses the following libraries:

|Library|Description|
|---|---|
|[Microsoft.Owin.Security.OpenIdConnect](https://www.nuget.org/packages/Microsoft.Owin.Security.OpenIdConnect/)|Middleware that enables an application to use OpenIdConnect for authentication|
|[Microsoft.Owin.Security.Cookies](https://www.nuget.org/packages/Microsoft.Owin.Security.Cookies)|Middleware that enables an application to use cookie-based authentication|
|[Microsoft.Owin.Host.SystemWeb](https://www.nuget.org/packages/Microsoft.Owin.Host.SystemWeb)|OWIN server that enables OWIN-based applications to run on IIS using the ASP.NET request pipeline|

### What is Next

<!--
[Setup](active-directory-serversidewebapp-aspnetwebappowin-setup.md)
-->