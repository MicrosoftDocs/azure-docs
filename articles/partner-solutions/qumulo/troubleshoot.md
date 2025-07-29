---
title: Troubleshoot Azure Native Qumulo 
description: This article provides information about troubleshooting Azure Native Qumulo Scalable File Service.

ms.topic: troubleshooting-general
ms.date: 02/09/2025
ms.custom:
  - ignite-2023
---

# Troubleshoot Azure Native Qumulo 

This article describes how to fix common problems when you're working with Azure Native Qumulo Scalable File Service.

## Purchase errors

[!INCLUDE [marketplace-purchase-errors](../includes/marketplace-purchase-errors.md)]

## You can't create a resource

To set up Azure Native Qumulo Scalable File Service integration, you must have **Owner** or **Contributor** access on the Azure subscription. Ensure that you have the proper access on both the subnet resource group and the Qumulo service resource group before you start the setup.

For successful creation of a Qumulo service, custom role-based access control (RBAC) roles need to have the following permissions in the subnet and Qumulo service resource groups:

  - Qumulo.Storage/\*

  - Microsoft.Network/virtualNetworks/subnets/join/action

## Related content

- [What is Azure Native Qumulo?](overview.md)
