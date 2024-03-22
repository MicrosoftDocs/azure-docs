---
title: "How to view and create alerts for a site"
description: "How to view and create alerts for a site"
author: kgremban
ms.author: kgremban
ms.service: azure-arc
#ms.subservice: site-manager
ms.topic: how-to #Don't change
ms.date: 02/16/2024

---

# How to view alert status for a Arc Site

This article will detail how to view alert status for a Arc Site, which reflects the status for the overall site and enables the ability to view the alert status for support resources as well. The status of a overall site is based upon the underlying resources.

## Prerequisites

* Azure Portal Access
* Internet Connectivity
* Subscription
* Resource Group or Subscription with at least 1 compatible resource type for Site that reflects and supports alert status
* A site created for the associated resource group or subscription

## Alert status colors and meanings

* If the color in the portal is red, this means "Critical"
* If the color in the portal is orange, this means "Error"
* If the color in the portal is yellow, this means "Warning"
* If the color in the portal is blue, this means "Info"
* If the color in the portal is purple, this means "Verbose"
* If the color in the portal is green, this means "Up to Date"

