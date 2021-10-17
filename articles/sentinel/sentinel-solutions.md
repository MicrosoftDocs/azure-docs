---
title: About Azure Sentinel content and solutions | Microsoft Docs
description: This article describes Azure Sentinel content and solutions, which customers can use to find data analysis tools packaged together with data connectors.
services: sentinel
cloud: na
documentationcenter: na
author: batamig
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 10/12/2021
ms.author: bagol
---
# About Azure Sentinel content and solutions

> [!IMPORTANT]
>
> The Azure Sentinel **Content hub** and solutions are currently in **PREVIEW**, as are all individual solution packages. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Sentinel *content* is Security Information and Event Management (SIEM) content that enables customers to ingest data, monitor, alert, hunt, investigate, respond, and connect with different products, platforms, and services in Azure Sentinel.

Content in Azure Sentinel includes any of the following types:

- [Data connectors](connect-data-sources.md) provide log ingestion from different sources into Azure Sentinel
- [Parsers](normalization-about-parsers.md) provide log formatting/transformation into [ASIM](normalization.md) formats, supporting usage across various Azure Sentinel content types and scenarios
- [Workbooks](get-visibility.md) provide monitoring, visualization, and interactivity with data in Azure Sentinel, highlighting meaningful insights for users
- [Analytic rules](detect-threats-built-in.md) provide alerts that point to relevant SOC actions via incidents
- [Hunting queries](hunting.md) are used by SOC teams to proactively hunt for threats in Azure Sentinel
- [Notebooks](notebooks.md) help SOC teams use advanced hunting features in Jupyter and Azure Notebooks
- [Watchlists](watchlists.md) support the ingestion of *specific* data for enhanced threat detection and reduced alert fatigue
- [Playbooks and Azure Logic Apps custom connectors](automate-responses-with-playbooks.md) provide the ability to run automated investigations, remediations, and response scenarios in Azure Sentinel

Azure Sentinel *solutions* are packages of Azure Sentinel content or Azure Sentinel API integrations, which fulfill an end-to-end product, domain, or industry vertical scenario in Azure Sentinel.

> [!TIP]
> You can either customize out-of-the-box content for your own needs, or you can create your own solution with content to share with others in the community. For more information, see the [Azure Sentinel Solutions Build Guide](https://aka.ms/sentinelsolutionsbuildguide) for solutions’ authoring and publishing.
>
## Discover and manage Azure Sentinel content

Use the Azure Sentinel **Content hub** to centrally discover and install out-of-the-box content.

The Azure Sentinel Content Hub provides in-product discoverability, single-step deployment, and enablement of end-to-end product, domain, and/or vertical out-of-the-box solutions and content in Azure Sentinel.

- In the **Content hub**, filter by [categories](#azure-sentinel-out-of-the-box-content-and-solution-categories) and other parameters to find the content that works best for your organization's needs. The **Content hub** also indicates the [support model](#azure-sentinel-out-of-the-box-content-and-solution-support-models) applied to each piece of content, as some content is maintained by Microsoft and others are maintained by partners or the community.

    Manage [updates for out-of-the-box content](sentinel-solutions-deploy.md#install-or-update-a-solution) via the Azure Sentinel **Content hub**, and for custom content via the **Repositories** page.

- Customize out-of-the-box content for your own needs, or create custom content, including analytics rules, hunting queries, notebooks, workbooks, and more. Manage your custom content directly in your Azure Sentinel workspace, via the [Azure Sentinel API](/rest/api/securityinsights/), or in your own source control repository, via the Azure Sentinel **Repositories** page.

### Why content hub and solutions?

Azure Sentinel *solutions* are packaged content or integrations that deliver end-to-end product value for one or more domain or vertical scenarios.

The solutions experience is powered by [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace) for solutions’ discoverability and deployment and by the [Microsoft Partner Center](/partner-center/overview) for solutions’ authoring and publishing."

Azure Sentinel solutions provide in-product discoverability, single-step deployment, and enablement of end-to-end product, domain, and/or vertical scenarios in Azure Sentinel. This experience is powered by  for solutions’ discoverability, deployment, and enablement, and by  for solutions’ authoring and publishing.

- **Packaged content** are collections of one or more pieces of Azure Sentinel content, such as data connectors, workbooks, analytics rules, playbooks, hunting queries, watchlists, parsers, and more.

- **Integrations** include services or tools built using Azure Sentinel or Azure Log Analytics APIs that support integrations between Azure and existing customer applications, or migrate data, queries, and more, from those applications into Azure Sentinel.

Solutions also provide the ability to install packages of content / multiple pieces of out-of-the-box content in a single step, where the content is often ready to use immediately. Providers and partners can use solutions to productize investments by delivering combined product, domain, or vertical value.

Use the Content hub to centrally discover and deploy solutions and out-of-the-box content in a scenario-driven manner.

For more information, see:

- [Centrally discover and deploy Azure Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md)
- [Azure Sentinel Content hub catalog](sentinel-solutions-catalog.md)

## Azure Sentinel out-of-the-box content and solution categories

Azure Sentinel out-of-the-box content can be applied with one or more of the following categories. In the **Content hub**, select the categories you want to view to change the content displayed.

### Domain categories

| Category name  | Description |
| ---------- | ----------------------- |
| **Application**  | Web, server-based, SaaS, database, communications, or productivity workload          |
| **Cloud Provider**  | Cloud service|
| **Compliance**   | Compliance product, services, and protocols  |
| **DevOps**       | Development operations tools and services    |
| **Identity**     | Identity service providers and integrations     |
| **Internet of Things (IoT)**    | IoT, OT devices and infrastructure, industrial control services                   |
| **IT Operations**| Products and services managing IT   |
| **Migration**    | Migration enablement products, services, and               |
| **Networking**   | Network products, services, and tools    |
| **Platform**     | Azure Sentinel generic or framework components, Cloud infrastructure and platform|
| **Security - Others**   | Other security products and services with no other clear category           |
| **Security - Threat Intelligence**  | Threat intelligence platforms, feeds, products and services        |
| **Security - Threat Protection**   | Threat protection, email protection, and XDR and endpoint protection products and services     |
| **Security – 0-day Vulnerability**   | Specialized solutions for 0-day vulnerability attacks like [Nobelium](/azure/security/fundamentals/recover-from-identity-compromise) |
| **Security – Automation (SOAR)**   | Security automations, SOAR (Security Operations and Automated Responses), security operations, and incident response products and services.   |
| **Security – Cloud Security** | CASB (Cloud Access Service Broker), CWPP (Cloud workload protection platforms), CSPM (Cloud security posture management and other Cloud Security products and services |
| **Security – Information Protection**   | Information protection and document protection products and services|
| **Security – Insider Threat**  | Insider threat and user and entity behavioral analytics (UEBA) for security products and services                |
| **Security – Network**    | Security network devices, firewall, NDR (network detection and response), NIDP (network intrusion and detection prevention) and network packet capture   |
| **Security – Vulnerability Management** | Vulnerability management products and  services                    |
| **Storage**      | File stores and file sharing products and services                 |
| **Training and Tutorials**  | Training, tutorials, and onboarding assets |
| **User Behavior (UEBA)**    | User behavior analytics products and services|

### Industry vertical categories

| Category name  | Description |
| ---------- | ----------------------- |
| **Aeronautics**  | Products, services, and content specific for the aeronautics industry |
| **Education**    | Products, services, and content specific for the education industry   |
| **Finance**      | Products, services, and content specific for the finance industry     |
| **Healthcare**   | Products, services, and content specific for the healthcare industry  |
| **Manufacturing** | Products, services, and content specific for the manufacturing industry |
| **Retail**       | Products, services, and content specific for the retail industry       |

## Azure Sentinel out-of-the-box content and solution support models

Both Microsoft and other organizations author Azure Sentinel out-of-the-box content and solutions. Each piece of out-of-the-box content or solution has one of the following support types:

- **Microsoft-supported**: Applies to:

    - Content/solutions where Microsoft is the data provider, where relevant, and author.
    - Some Microsoft-authored content/solutions for non-Microsoft data sources.

    Microsoft supports and maintains content/solutions in this support model in accordance with [Microsoft Azure Support Plans](https://azure.microsoft.com/support/options/#overview). Partners or the Community support content/solutions that are authored by any party other than Microsoft.

- **Partner-supported**: Applies to content/solutions authored by parties other than Microsoft.

    The partner company provides support or maintenance for these pieces of content/solutions. The partner company can be an Independent Software Vendor, a Managed Service Provider (MSP/MSSP), a Systems Integrator (SI), or any organization whose contact information is provided on the Azure Sentinel page for that content/solutions.

    For any issues with a partner-supported solution, contact the specified support contact.

- **Community-supported**: Applies to content/solutions authored by Microsoft or partner developers that don't have listed contacts for support and maintenance in Azure Sentinel.

    For questions or issues with these solutions, [file an issue](https://github.com/Azure/Azure-Sentinel/issues/new/choose) in the [Azure Sentinel GitHub community](https://aka.ms/threathunters).


## Next steps

After you've learned about Azure Sentinel content, start managing content and solutions in your Azure Sentinel workspace.

Discover and install solutions from the Azure Sentinel **Content hub**. For more information, see:

- [Centrally discover and deploy out-of-the-box content and solutions (Public preview)](sentinel-solutions-deploy.md)
- [Azure Sentinel content hub catalog](sentinel-solutions-catalog.md)
- [Azure Sentinel data connectors](connect-data-sources.md)
- [Find your Azure Sentinel data connector](data-connectors-reference.md)
