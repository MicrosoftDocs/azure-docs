---
title: Microsoft Sentinel Content and Solutions Overview
description: Discover Microsoft Sentinel content and solutions, including data connectors and analysis tools, to enhance your security operations. Learn more today.
author: batamig
ms.topic: conceptual
ms.date: 05/27/2025
ms.author: bagol
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal


#Customer intent: As a security operations center (SOC) analyst, I want to understand the types of SIEM content and solutions available so that I can determine whether Microsoft Sentinel meets my organization's requirements.

---

# Microsoft Sentinel out-of-the-box content overview

Microsoft Sentinel content includes Security Information and Event Management (SIEM) solution components that help you ingest data, monitor, alert, and respond to security threats. This article explains the types of content and solutions in Microsoft Sentinel and how they help your security operations.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Supported content

Content is available in the Microsoft Sentinel **Content hub**, and includes the following types:


| Content type | Description |
|--------------|-------------|
| **[Analytics rules](detect-threats-built-in.md)** | Create alerts that point to relevant SOC actions through incidents. |
| **[Data connectors](connect-data-sources.md)** | Ingest logs from different sources into Microsoft Sentinel. |
| **[Hunting queries](hunting.md)** | Help SOC teams proactively hunt for threats in Microsoft Sentinel. |
| **[Parsers](normalization-about-parsers.md)** | Format and transform logs into [Advanced Security Information Model (ASIM)](normalization.md) formats for use across different content types and scenarios. |
| **[Playbooks and Azure Logic Apps custom connectors](automate-responses-with-playbooks.md)** | Automate investigation, remediation, and response scenarios in Microsoft Sentinel. |
| **[Watchlists](watchlists.md)** | Ingest specific data for better threat detection and less alert fatigue. |
| **[Workbooks](get-visibility.md)** | Monitor, visualize, and interact with data in Microsoft Sentinel to see meaningful insights. |

The **Content hub** delivers these content types as *solutions* and *standalone* items. *Solutions* are packages of Microsoft Sentinel content or Microsoft Sentinel API integrations that support an end-to-end product, domain, or industry vertical scenario in Microsoft Sentinel.

Customize out-of-the-box (OOTB) content for your needs, or create your own solution to share with others in the community. For more information, see the [Microsoft Sentinel Solutions Build Guide](https://aka.ms/sentinelsolutionsbuildguide) for authoring and publishing solutions.


## Discover and manage content in Microsoft Sentinel

Use the Microsoft Sentinel **Content hub** to centrally find and install out-of-the-box (OOTB) content.

The Microsoft Sentinel **Content hub** lets you find content in the product, deploy it in a single step, and enable end-to-end product, domain, or vertical OOTB solutions and content in Microsoft Sentinel.

- Filter by [categories](#categories-for-microsoft-sentinel-out-of-the-box-content-and-solutions) and other parameters, or use text search, to find the content that works best for your organization.

   The **Content hub** also shows the [support model](#support-models-for-microsoft-sentinel-out-of-the-box-content-and-solutions) for each piece of content. Some content is maintained by Microsoft, and others are maintained by partners or the community.

- Manage updates for out-of-the-box content in the **Content hub**. For custom content, manage updates from the **Repositories** page. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

- Customize out-of-the-box content for your needs, or create custom content, including analytics rules, hunting queries, workbooks, and more.

  Manage your custom content directly in your Microsoft Sentinel workspace by using the Microsoft Sentinel API or from your source control repository. For more information, see [Microsoft Sentinel API](/rest/api/securityinsights/) and [Deploy custom content from your repository](ci-cd.md).

### Why use Microsoft Sentinel solutions?

Microsoft Sentinel solutions are packaged integrations that deliver end-to-end product value for one or more domain or vertical scenario in the **Content hub**.

The solutions experience, powered by [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace), helps you find and deploy the content you want. For more information about authoring and publishing solutions in the Azure Marketplace, see the [Microsoft Sentinel Solutions Build Guide](https://aka.ms/sentinelsolutionsbuildguide).

- **Packaged content** is a collection of one or more components of [Microsoft Sentinel content](#supported-content).

- **Integrations** include services or tools built using Microsoft Sentinel or Azure Log Analytics APIs that support integrations between Azure and existing customer applications, or move data, queries, and more from those applications into Microsoft Sentinel.

Use solutions to install packages of out-of-the-box (OOTB) content in a single step. The content is often ready to use immediately. Providers and partners use Sentinel solutions to add value to their customers' investments by delivering combined product, domain, or vertical value.

Use the **Content hub** to centrally find and deploy solutions and OOTB content based on your scenario.

For more information, see:

- [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md)
- Microsoft Sentinel solutions catalog in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?filters=solution-templates&page=1&search=sentinel)
- [Microsoft Sentinel catalog](sentinel-solutions-catalog.md)

## Categories for Microsoft Sentinel out-of-the-box content and solutions

Microsoft Sentinel out-of-the-box content fits into one or more of these categories. In the **Content hub**, select the categories you want to view to change the content shown. You find community-delivered items in the **Content hub** as standalone content or solutions.

### Domain categories

| Category name                           | Description          |
| --------------------------------------- | ------------------------------------ |
| **Application**                         | Web, server-based, SaaS, database, communications, or productivity service                  |
| **Cloud Provider**                      | Cloud service                                   |
| **Cloud Security**                      | Cloud security service |
| **Compliance**                          | Compliance product, services, and protocols     |
| **DevOps**                              | Development operations tools and services       |
| **Identity**                            | Identity service providers and integrations     |
| **Internet of Things (IoT)**            | IoT, operational technology (OT) devices, and infrastructure, industrial control services                                                                                |
| **IT Operations**                       | Products and services managing IT               |
| **Migration**                           | Migration enablement products and services      |
| **Networking**                          | Network products, services, and tools           |
| **Platform**                            | Microsoft Sentinel generic or framework components, Cloud infrastructure, and platform                                                                                   |
| **Security**                            | General security products |
| **Security - 0-day Vulnerability**      | Specialized solutions for zero-day vulnerability attacks                                   |
| **Security - Automation (SOAR)**        | Security automations, SOAR (Security Operations and Automated Responses), security operations, and incident response products and services.                              |
| **Security - Cloud Security**           | CASB (Cloud Access Service Broker), CWPP (cloud workload protection platforms), CSPM (cloud security posture management), and other cloud security products and services |
| **Security - Information Protection**   | Information protection and document protection products and services     |
| **Security - Insider Threat**           | Insider threat and user and entity behavioral analytics (UEBA) for security products and services     |
| **Security - Network**                  | Security network devices, firewall, NDR (network detection and response), NIDP (network intrusion and detection prevention), and network packet capture                  |
| **Security - Others**                   | Other security products and services with no other clear category                 |
| **Security - Threat Intelligence**      | Threat intelligence platforms, feeds, products, and services                     |
| **Security - Threat Protection**        | Threat protection, email protection, extended detection and response (XDR), and endpoint protection products and services                                                |
| **Security - Vulnerability Management** | Vulnerability management products and  services |
| **Storage**                             | File stores and file sharing products and services  |
| **Training and Tutorials**              | Training, tutorials, and onboarding assets      |
| **User Behavior (UEBA)**                | User behavior analytics products and services   |


### Industry vertical categories

| Category name  | Description |
| ---------- | ----------------------- |
| **Aeronautics**  | Products, services, and content specific for the aeronautics industry |
| **Education**    | Products, services, and content specific for the education industry   |
| **Finance**      | Products, services, and content specific for the finance industry     |
| **Healthcare**   | Products, services, and content specific for the healthcare industry  |
| **Manufacturing** | Products, services, and content specific for the manufacturing industry |
| **Retail**       | Products, services, and content specific for the retail industry       |
| **Software** | Products, services, and content specific for the software industry|


## Support models for Microsoft Sentinel out-of-the-box content and solutions

Microsoft and other organizations author Microsoft Sentinel out-of-the-box content and solutions. Each piece of out-of-the-box content or solution has one of the following support types:

| Support model  | Description |
| ---------- | ----------------------- |
| **Microsoft-supported**| Applies to: <br>- Content or solutions where Microsoft is the data provider, where relevant, and author. <br> - Some Microsoft-authored content or solutions for non-Microsoft data sources. <br><br>    Microsoft supports and maintains content or solutions in this support model in accordance with [Microsoft Azure Support Plans](https://azure.microsoft.com/support/options/#overview). <br>Partners or the community support content or solutions authored by any party other than Microsoft.|
|**Partner-supported** | Applies to content or solutions authored by parties other than Microsoft.  <br><br>   The partner company provides support or maintenance for these pieces of content or solutions. The partner company can be an independent software vendor, a managed service provider (MSP or MSSP), a systems integrator (SI), or any organization whose contact information is provided on the Microsoft Sentinel page for the selected content or solutions.<br><br>    For any issues with a partner-supported solution, contact the specified support contact.|
|**Community-supported** |Applies to content or solutions authored by Microsoft or partner developers without listed contacts for support and maintenance in Microsoft Sentinel.<br><br>    For questions or issues with these solutions, [file an issue](https://github.com/Azure/Azure-Sentinel/issues/new/choose) in the [Microsoft Sentinel GitHub community](https://aka.ms/threathunters).|

## Content sources for Microsoft Sentinel content and solutions

Each piece of content or solution has one of the following content sources:

|Content source  |Description  |
|---------|---------|
|**Solution**  |Solutions deployed by the **Content hub** that support lifecycle management.         |
|**Standalone** |Standalone content deployed by the **Content hub** that is automatically kept up to date. |
|**Custom**  |Content or solutions you customize in your workspace.         |
|**Repositories**   |Content or solutions from a repository connected to your workspace.      |

## Next steps

Discover and install solutions and standalone content from the **Content hub** in your Microsoft Sentinel workspace.

For more information, see

- [Centrally discover and deploy out-of-the-box content and solutions](sentinel-solutions-deploy.md)
- Microsoft Sentinel solutions catalog in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?filters=solution-templates&page=1&search=sentinel)
- [Microsoft Sentinel catalog](sentinel-solutions-catalog.md)
- [Microsoft Sentinel data connectors](connect-data-sources.md)
- [Find your Microsoft Sentinel data connector](data-connectors-reference.md)
