---
 title: include file
 description: include file
 services: virtual-machines
 author: mattmcinnes
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/10/2024
 ms.author: mattmcinnes
 ms.custom: include file
---

> [!IMPORTANT]
> Azure Virtual Machines - Hibernation is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Hibernation allows you to pause VMs that aren't being used and save on compute costs. It's an effective cost management feature for scenarios such as:
- Virtual desktops, dev/test servers, and other scenarios where the VMs don't need to run 24/7.
- Systems with long boot times due to memory intensive applications. These applications can be initialized on VMs and hibernated. These “prewarmed” VMs can then be quickly started when needed, with the applications already up and running in the desired state.