---
title: VM network troubleshooter (Preview) overview
titleSuffix: Azure Network Watcher
description: Learn about VM network troubleshooter in Azure Network Watcher and how it can help you detect blocked ports.
author: halkazwini
ms.author: halkazwini
ms.service: azure-network-watcher
ms.topic: concept-article
ms.date: 05/07/2025
ms.custom:
  - build-2025
---

# VM network troubleshooter (Preview) overview

> [!IMPORTANT]
> The VM network troubleshooter is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Blocked ports on Virtual Machines (VMs) are one of the most common connectivity issues faced by Azure customers. The VM Network Troubleshooter helps customers quickly check if commonly used ports are blocked on their Azure virtual machine.


## What ports are checked by the VM network troubleshooter?

The VM network troubleshooter checks for the following ports:
 - Port 80 (HTTP)
 - Port 443 (HTTPS)
 - Port 3389 (RDP)


## How can customers access the VM network troubleshooter? 

Customers can access the VM network troubleshooter from the Monitor tab on the VM Overview blade. With a single click, customers can start the troubleshooter and check if the ports for RDP, HTTP, and HTTPs are blocked. 

:::image type="content" source="./media/vm-network-troubleshooter/vm-network-troubleshooter.gif" alt-text="Video of customers navigating to the VM network troubleshooter from the VM Overview blade in the Azure portal.":::


## How does the VM network troubleshooter work? 

The VM network troubleshooter is built on top of the NSG diagnostics tool. The troubleshooter simulates traffic to the VM for common ports. It returns whether the flow is allowed or denied with detailed information about the security rule allowing or denying the flow.
Customers can clickthrough from the results to the NSG rules and edit them as needed. 

## Next step

To check for other ports, customers can use the NSG diagnostics tool

> [!div class="nextstepaction"]
> [NSG Diagnostics overview](nsg-diagnostics-overview.md)
