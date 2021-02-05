---
title: What is Azure single sign-on (SSO)?
description: Learn how single sign-on (SSO) works with Azure Active Directory. Use SSO so users don't need to remember passwords for every application. Also use SSO to simplify the administration of account management.
services: active-directory
author: kenwith
manager: daveba
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: overview
ms.date: 12/03/2019
ms.author: kenwith
ms.reviewer: arvindh, japere
ms.custom: contperf-fy21q1
---

# What is single sign-on (SSO)?

Single sign-on means a user doesn't have to sign in to every application they use. The user logs in once and that credential is used for other apps too.

If you're an end user, you likely don't care much about SSO details. You just want to use the apps that make you productive without having to type your password so much. You can find your apps at: https://myapps.microsoft.com.
 
If you're an administrator, or IT professional, then read on to learn more about SSO and how it's implemented in Azure.

## Single sign-on basics
Single sign-on provides a giant leap forward in how users sign in and use applications. Single sign-on based authentication systems are often called "modern authentication". Modern authentication and single sign-on fall into a category of computing called Identity and Access Management (IAM). To understand what makes single sign-on possible, check out this video.

Authentication fundamentals: The basics | Azure Active Directory

> [!VIDEO https://www.youtube.com/embed/fbSVgC8nGz4]

## Single sign-on with web applications
Web applications are incredibly popular. Web apps are hosted by various companies and made available as a service. Some popular examples of web apps include Microsoft 365, GitHub, and Salesforce, and there are thousands of others. People access web apps using a web browser on their computer. Single sign-on makes it possible for people to navigate between the various web apps without having to sign in multiple times.

To learn about how single sign-on works with web apps, check out these two videos.

Authentication fundamentals: Web applications | Azure Active Directory

> [!VIDEO https://www.youtube.com/embed/tCNcG1lcCHY]

Authentication fundamentals: Web single sign-on | Azure Active Directory

> [!VIDEO https://www.youtube.com/embed/51B-jSOBF8U]

## Cloud versus on-premises hosted apps
How you implement single sign-on depends on where the app is hosted. Hosting matters because of the way network traffic is routed to access the app. If an app is hosted and accessed over your local network, called an on-premises app, then there is no need for users to access the Internet to use the app. If the app is hosted somewhere else, called a cloud hosted app, then users will need to access the Internet in order to use the app.

> [!TIP]
> Cloud hosted apps are also called Software as a Service (SaaS) apps. 

Single sign-on for cloud hosted apps are straightforward. You let the identity provider know it's being used for the app. And then you configure the app to trust the identity provider. To learn how to use Azure AD as an identity provider for an app, see the [Quickstart Series on Application Management](add-application-portal.md).

> [!TIP]
> The terms cloud and Internet are often used interchangeable. The reason for this has to do with network diagrams. It is common to denote large computer networks with a cloud shape on a diagram because it is not feasible to draw every component. The Internet is the most well-known network and thus it is easy to use the terms interchangeably. However, any computer network can be coined a cloud.

You can also use single sign-on for on-premises based apps. The technology to make on-premises SSO happen is called Application Proxy. To learn more about it, see [Single sign-on options](sso-options.md).

## Multiple identity providers
When you set up single sign-on to work between multiple identity providers, it's called federation. To learn how federation works, check out this video.

Authentication fundamentals: Federation | Azure Active Directory

> [!VIDEO https://www.youtube.com/embed/CjarTgjKcX8]


## Next steps
* [Quickstart Series on Application Management](view-applications-portal.md)
* [Single sign-on options](sso-options.md)
