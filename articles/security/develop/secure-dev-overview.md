---
title: Secure development best practices on Microsoft Azure
description: Best practices to help you develop more secure code and deploy a more secure application in the cloud.
author: msmbaldwin
manager: rkarlin
ms.author: mbaldwin
ms.date: 09/29/2024
ms.topic: article
ms.service: security
ms.subservice: security-develop
services: azure

ms.assetid: 521180dc-2cc9-43f1-ae87-2701de7ca6b8
---

# Secure development best practices on Azure

This series of articles presents security activities and controls to consider when you develop applications for the cloud. The phases of the Microsoft Security Development Lifecycle (SDL) and security questions and concepts to consider during each phase of the lifecycle are covered. The goal is to help you define activities and Azure services that you can use in each phase of the lifecycle to design, develop, and deploy a more secure application.

The recommendations in the articles come from our experience with Azure security and from the experiences of our customers. You can use these articles as a reference for what you should consider during a specific phase of your development project, but we suggest that you also read through all of the articles from beginning to end at least once. Reading all articles introduces you to concepts that you might have missed in earlier phases of your project. Implementing these concepts before you release your product can help you build secure software, address security compliance requirements, and reduce development costs.

These articles are intended to be a resource for software designers, developers, and testers at all levels who build and deploy secure Azure applications.

## Overview

Security is one of the most important aspects of any application, and it's not a simple thing to get right. Fortunately, Azure provides many services that can help you secure your application in the cloud. These articles address activities and Azure services you can implement at each stage of your software development lifecycle to help you develop more secure code and deploy a more secure application in the cloud.

## Security development lifecycle

Following best practices for secure software development requires integrating security into each phase of the software development lifecycle, from requirement analysis to maintenance, regardless of the project methodology ([waterfall](https://en.wikipedia.org/wiki/Waterfall_model), [agile](https://en.wikipedia.org/wiki/Agile_software_development), or [DevOps](https://en.wikipedia.org/wiki/DevOps)). In the wake of high-profile data breaches and the exploitation of operational security flaws, more developers are understanding that security needs to be addressed throughout the development process.

The later you fix a problem in your development lifecycle, the more that fix costs you. Security issues are no exception. If you disregard security issues in the early phases of your software development, each phase that follows might inherit the vulnerabilities of the preceding phase. Your final product accumulates multiple security issues and the possibility of a breach. Building security into each phase of the development lifecycle helps you catch issues early, and it helps you reduce your development costs.

We follow the phases of the [Microsoft Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) (SDL) to introduce activities and Azure services that you can use to fulfill secure software development practices in each phase of the lifecycle.

The SDL phases are:

![Security Development Lifecycle](./media/secure-dev-overview/01-sdl-phase.png)

In these articles we group the SDL phases into design, develop, and deploy.

## Engage your organization's security team

Your organization might have a formal application security program that assists you with security activities from start to finish during the development lifecycle. If your organization has security and compliance teams, be sure to engage them before you begin developing your application. Ask them at each phase of the SDL whether there are any tasks you missed.

We understand that many readers might not have a security or compliance
team to engage. These articles can help guide you in the security questions and decisions you need to consider at each phase of the SDL.

## Resources

Use the following resources to learn more about developing secure
applications and to help secure your applications on Azure:

[Microsoft Security Development Lifecycle](https://www.microsoft.com/securityengineering/sdl/) (SDL) - The SDL is a software development process from Microsoft that helps developers build more secure software. It helps you address security compliance requirements while reducing development costs.

[Open Worldwide Application Security Project](https://www.owasp.org/) (OWASP) - OWASP is an online community that produces freely available articles, methodologies, documentation, tools, and technologies in the field of web application security.

[Microsoft identity platform](../../active-directory/develop/index.yml) - The Microsoft identity platform is an evolution of the Microsoft Entra identity service and developer platform. It's a full-featured platform that consists of an authentication service, open-source libraries, application registration and configuration, full developer documentation, code samples, and other developer content. The Microsoft identity platform supports industry-standard protocols like OAuth 2.0 and OpenID Connect.

[Azure security best practices and patterns](../fundamentals/best-practices-and-patterns.md) - A collection of security best practices to use when you design, deploy, and manage cloud solutions by using Azure. Guidance is intended to be a resource for IT pros. This might include designers, architects, developers, and testers who build and deploy secure Azure solutions.

[Security and Compliance Blueprints on Azure](../../governance/blueprints/samples/azure-security-benchmark-foundation/index.md) - Azure Security and Compliance Blueprints are resources that can help you build and launch cloud-powered applications that comply with stringent regulations and standards.

## Next steps

In the following articles, we recommend security controls and activities that can help you design, develop, and deploy secure applications.

* [Design secure applications](secure-design.md)
* [Develop secure applications](secure-develop.md)
* [Deploy secure applications](secure-deploy.md)
