---
title: About Azure Sentinel solutions | Microsoft Docs
description: This article describes the Azure Sentinel solutions experience, showing how customers can easily find data analysis tools packaged together with data connectors, and displays the packages currently available.
services: sentinel
cloud: na
documentationcenter: na
author: yelevin
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/05/2021
ms.author: yelevin
---
# About Azure Sentinel content and solutions

> [!IMPORTANT]
>
> The Azure Sentinel content hub and solutions is currently in **PREVIEW**, as are all individual solution packages. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Sentinel solutions provide in-product discoverability, single-step deployment, and enablement of end-to-end product, domain, and/or vertical scenarios in Azure Sentinel. This experience is powered by [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace) for solutions’ discoverability, deployment, and enablement, and by [Microsoft Partner Center](/partner-center/overview) for solutions’ authoring and publishing.

## What is Azure Sentinel content?

The Azure Sentinel **Content hub** provides access to the following types of Azure Sentinel content:

- **Data connectors**, some with accompanying **parsers**
- **Workbooks**
- **Analytics rules**
- **Hunting queries**
- **Notebooks**
- **Watchlists**
- **Playbooks**
- **Logic App Connectors**

You can either customize built-in content for your own needs, or you can create your own solution with content to share with others in the community. For more information, see the [Microsoft Partner Center](/partner-center/overview) for solutions’ authoring and publishing.

## Discover and manage Azure Sentinel solutions

The **Content hub** provides access to Azure Sentinel solutions, which are content packs that deliver value for a product, domain, or vertical within Azure Sentinel.

Use solutions to deploy packaged content in a single step, often ready to start immediately. Providers and partners can also create their own solutions to deliver combined product or domain vertical value and to productize investments.

Discover the solutions that will help support your organizations needs. For more information, see:

- [Discover and deploy Azure Sentinel solutions](sentinel-solutions-deploy.md)
- [Azure Sentinel Content hub catalog](sentinel-solutions-catalog.md)
- [Azure Sentinel data connectors](connect-data-sources.md)
- [Find your Azure Sentinel data connector](data-connectors-reference.md)


## Content categories

Azure Sentinel content can be applied with one or more of the following categories. In the **Content hub**, select the categories you want to view to change the content displayed.

### Domain categories

:::row:::
   :::column span="":::
      - Application
      - Cloud Provider
      - Compliance
      - Identity
      - IT Operations
   :::column-end:::
   :::column span="":::
      - Platform
      - Storage
      - Networking
      - User Behavior (UEBA)
   :::column-end:::
   :::column span="":::
      - Devops
      - Internet of Things (IoT)
      - Training and Tutorials
      - Migration
   :::column-end:::
:::row-end:::

### Security categories

:::row:::
   :::column span="":::
      - Security - Threat protection. Includes threat protection, email protection, XDR, and endpoint protection.
      - Security - Information protection
      - Security - Threat intelligence
      - Security - Network
      - Security - Vulnerability management
   :::column-end:::
   :::column span="":::
      - Security - Automation (SOAR)
      - Security - Insider Threat
      - Security - 0-day Vulnerability
      - Security - Cloud security
      - Security - Others
   :::column-end:::
:::row-end:::

### Industry vertical categories

- Healthcare
- Finance
- Retail
- Education
- Manufacturing
- Aeronautics

## Azure Sentinel solution support models

Both Microsoft and other organizations author Azure Sentinel solutions. Each solution has one of the following support types:

| Support type| Description|
|-------------|------------|
|**Microsoft-supported**|Applies to:<ul><li>Solutions where Microsoft is the data provider, where relevant, and author.</li><li>Some Microsoft-authored solutions for non-Microsoft data sources.</li></ul>Microsoft supports and maintains solutions in this category in accordance with [Microsoft Azure Support Plans](https://azure.microsoft.com/support/options/#overview).<br><br>Partners or the Community support solutions that are authored by any party other than Microsoft.|
|**Partner-supported**|Applies to solutions authored by parties other than Microsoft.<br><br>The partner company provides support or maintenance for these solutions. The partner company can be an Independent Software Vendor, a Managed Service Provider (MSP/MSSP), a Systems Integrator (SI), or any organization whose contact information is provided on the Azure Sentinel page for that solution.<br><br>For any issues with a partner-supported solution, contact the specified solution support contact.|
|**Community-supported**|Applies to solutions authored by Microsoft or partner developers that don't have listed contacts for solution support and maintenance on the specified solution page in Azure Sentinel.<br><br>For questions or issues with these solutions, you can [file an issue](https://github.com/Azure/Azure-Sentinel/issues/new/choose) in the [Azure Sentinel GitHub community](https://aka.ms/threathunters).|


## Next steps

After you've learned about Azure Sentinel content, start managing content and solutions in your Azure Sentinel workspace.

Discover and install solutions from the Azure Sentinel **Content hub**. For more information, see:

- [Discover and deploy Azure Sentinel solutions (Public preview)](sentinel-solutions-deploy.md)
- [Azure Sentinel content hub catalog](sentinel-solutions-catalog.md)
- [Azure Sentinel data connectors](connect-data-sources.md)
- [Find your Azure Sentinel data connector](data-connectors-reference.md)
