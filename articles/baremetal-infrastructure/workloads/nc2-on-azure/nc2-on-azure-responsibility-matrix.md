---
title: NC2 on Azure responsibility matrix
author: jjaygbay1
ms.author: jacobjaygbay
description: Defines who's responsible for what for NC2 on Azure.
ms.topic: conceptual
ms.subservice: baremetal-nutanix
ms.custom: engagement-fy23
ms.date: 06/07/2024
---

# NC2 on Azure responsibility matrix

On-premises Nutanix environments require the Nutanix customer to support all the hardware and software for running the platform. For NC2 on Azure, Microsoft maintains the hardware for the customer.
The following table color-codes areas of management, where:

* Microsoft NC2 team = blue
* Nutanix = purple
* Customer = gray

:::image type="content" source="media/nc2-on-azure-responsibility-matrix.png" alt-text="A diagram showing the support responsibilities for Microsoft and partners.":::

Microsoft manages the Azure BareMetal specialized compute hardware and its data and control plane platform for underlay network. Microsoft supports if the customers plan to bring their existing Azure Subscription, VNet, vWAN, etc.

Nutanix covers the life-cycle management of Nutanix software (MCM, Prism Central/Element, etc.) and their licenses.

**Monitoring and remediation**

Microsoft NC2 team continuously monitors the health of the underlay and BareMetal infrastructure. If MS NC2 detects a failure, it takes action to repair the failed services.