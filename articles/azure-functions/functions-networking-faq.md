---
title: Frequently Asked Questions about Networking in Azure Functions
description: Answers to some of the most common questions and scenarios for networking with Azure Functions.
services: functions
author: alexkarcher-msft
manager: jeconnoc
ms.service: azure-functions
ms.topic: troubleshooting
ms.date: 4/11/2019
ms.author: alkarche, glenga

---
# Frequently asked questions about networking in Azure Functions

Below is a list of frequently asked networking questions. For a more comprehensive overview, read the [Functions networking options document](functions-networking-options.md)

## How do I set a static IP in Functions?

Deploying a function in an App Service Environment (ASE) is currently the only way to have a static inbound and outbound IP for your function. For details on using an ASE, start with the article here: [Creating and using an ILB ASE](../app-service/environment/create-ilb-ase.md).

## How do I restrict internet access to my Function?

You can restrict internet access in a number of ways, listed below.

* [IP Restrictions](../app-service/app-service-ip-restrictions.md): restrict inbound traffic to your function app by IP range.
* Remove all HTTP triggers. For some applications, it is sufficient to simply avoid HTTP triggers and use any other event source to trigger your function.

The most important consideration when doing so is to keep in mind that the Azure portal editor requires direct access to your running Function to use. Any code changes through the Azure portal will require the device you're using to browse the portal to have its IP whitelisted. You can still, however, use anything under the platform features tab with network restrictions in place.

## How do I restrict my function app to a VNET?

The only way to totally restrict a Function such that all traffic flows through a VNET is to use an internally load balanced (ILB) App Service Environment (ASE). This option deploys your site on dedicated infrastructure inside a VNET and sends all triggers and traffic through the VNET. For details on using an ASE, start with the article here: [Creating and using an ILB ASE](../app-service/environment/create-ilb-ase.md).

## How can I access resources in a VNET from a function app?

You can access resources in a VNET from a running function using VNET Integration. For more information, see [VNET integration](functions-networking-options.md#vnet-integration)

## How do I access resources protected by Service Endpoints?

Using the new VNET integration (currently in preview), you can access Service Endpoint secured resources from a running function. For more information, see [preview VNET integration](functions-networking-options.md#preview-vnet-integration).

## How can I trigger a Function from a resource in a VNET?

You can only trigger a function from a resource in a VNET by deploying your function app to an App Service Environment. For details on using an ASE, see [Creating and using an ILB ASE](../app-service/environment/create-ilb-ase.md).


## How can I deploy my function app in a VNET?

Deploying to an App Service Environment is the only way to create a function app that is wholly inside a VNET For details on using an ILB ASE, start with the article here: [Creating and using an ILB ASE](https://docs.microsoft.com/azure/app-service/environment/create-ilb-ase).

For scenarios where you only need one-way access to VNET resources, or less comprehensive network isolation, see the [Functions networking overview](functions-networking-options.md).

## Next Steps

To learn more about networking and Functions: 

* [Follow our getting started VNET integration tutorial](./functions-create-vnet.md)
* [Learn more about the networking options in functions here](./functions-networking-options.md)
* [Learn more about VNET integration with App Service / Functions here](../app-service/web-sites-integrate-with-vnet.md)
* [Learn more about VNETs in Azure](../virtual-network/virtual-networks-overview.md)
* [Enable more networking features and control with App Service Environments](../app-service/environment/intro.md)
