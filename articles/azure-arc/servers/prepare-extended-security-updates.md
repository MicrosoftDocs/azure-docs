---
title: How to prepare to deliver Extended Security Updates for Windows Server 2012 through Azure Arc
description: Learn how to prepare to deliver Extended Security Updates for Windows Server 2012 through Azure Arc.
ms.date: 09/27/2023
ms.topic: conceptual
---

# Prepare to deliver Extended Security Updates for Windows Server 2012

With Windows Server 2012 and Windows Server 2012 R2 reaching end of support on October 10, 2023, Azure Arc-enabled servers lets you enroll your existing Windows Server 2012/2012 R2 machines in [Extended Security Updates (ESUs)](/windows-server/get-started/extended-security-updates-overview). Affording both cost flexibility and an enhanced delivery experience, Azure Arc better positions you to migrate to Azure.

The purpose of this article is to help you understand the benefits and how to prepare to use Arc-enabled servers to enable delivery of ESUs.

## Key benefits

Delivering ESUs to your Windows Server 2012/2012 R2 machines provides the following key benefits:

- **Pay-as-you-go:** Flexibility to sign up for a monthly subscription service with the ability to migrate mid-year.

- **Azure billed:** You can draw down from your existing [Microsoft Azure Consumption Commitment](/marketplace/azure-consumption-commitment-benefit) (MACC) and analyze your costs using [Azure Cost Management and Billing](../../cost-management-billing/cost-management-billing-overview.md).

- **Built-in inventory:** The coverage and enrollment status of Windows Server 2012/2012 R2 ESUs on eligible Arc-enabled servers are identified in the Azure portal, highlighting gaps and status changes.

- **Keyless delivery:** The enrollment of ESUs on Azure Arc-enabled Windows Server 2012/2012 R2 machines won't require the acquisition or activation of keys.

## Access to Azure services

For Azure Arc-enabled servers enrolled in WS2012 ESUs enabled by Azure Arc, free access is provided to these Azure services from October 10, 2023:

* [Azure Update Manager](../../update-center/overview.md) - Unified management and governance of update compliance that includes not only Azure and hybrid machines, but also ESU update compliance for all your Windows Server 2012/2012 R2 machines.
* [Azure Automation Change Tracking and Inventory](/azure/automation/change-tracking/overview?tabs=python-2) - Track changes in virtual machines hosted in Azure, on-premises, and other cloud environments.
* [Azure Policy Guest Configuration](/azure/cloud-adoption-framework/manage/azure-server-management/guest-configuration-policy) - Audit the configuration settings in a virtual machine. Guest configuration supports Azure VMs natively and non-Azure physical and virtual servers through Azure Arc-enabled servers.

Other Azure services through Azure Arc-enabled servers are available as well, with offerings such as:

* [Microsoft Defender for Cloud](../../defender-for-cloud/defender-for-cloud-introduction.md) - As part of the cloud security posture management (CSPM) pillar, it provides server protections through [Microsoft Defender for Servers](../../defender-for-cloud/plan-defender-for-servers.md) to help protect you from various cyber threats and vulnerabilities.
* [Microsoft Sentinel](scenario-onboard-azure-sentinel.md) - Collect security-related events and correlate them with other data sources.

    >[!NOTE]
    >Activation of ESU is planned for the third quarter of 2023. Using Azure services such as Azure Update Manager (preview) and Azure Policy to support managing ESU-eligible Windows Server 2012/2012 R2 machines are also planned for the third quarter.

## Prepare delivery of ESUs

To prepare for this new offer, you need to plan and prepare to onboard your machines to Azure Arc-enabled servers through the installation of the [Azure Connected Machine agent](agent-overview.md) (version 1.34 or higher) and establishing a connection to Azure.

- **Deployment options:** There are several at-scale onboarding options for Azure Arc-enabled servers, including running a [Custom Task Sequence](onboard-configuration-manager-custom-task.md) through Configuration Manager and deploying a [Scheduled Task through Group Policy](onboard-group-policy-powershell.md).

- **Networking:** Connectivity options include public endpoint, proxy server, and private link or Azure Express Route. Review the [networking prerequisites](network-requirements.md) to prepare their non-Azure environment for deployment to Azure Arc.

We recommend you deploy your machines to Azure Arc in preparation for when the related Azure services deliver supported functionality to manage ESU. Once these machines are onboarded to Azure Arc-enabled servers, you'll have visibility into their ESU coverage and enroll through the Azure portal or using Azure Policy one month before Windows Server 2012 end of support. Billing for this service starts from October 2023, after Windows Server 2012 end of support.

> [!NOTE]
> In order to purchase ESUs, you must have Software Assurance through Volume Licensing Programs such as an Enterprise Agreement (EA), Enterprise Agreement Subscription (EAS), Enrollment for Education Solutions (EES), or Server and Cloud Enrollment (SCE). Alternatively, if your Windows Server 2012/2012 R2 machines are licensed through SPLA or with a Server Subscription, Software Assurance is not required to purchase ESUs.
> 
## Next steps

* Find out more about [planning for Windows Server and SQL Server end of support](https://www.microsoft.com/en-us/windows-server/extended-security-updates) and [getting Extended Security Updates](/windows-server/get-started/extended-security-updates-deploy).

* Learn about best practices and design patterns through the [Azure Arc landing zone accelerator for hybrid and multicloud](/azure/cloud-adoption-framework/scenarios/hybrid/arc-enabled-servers/eslz-identity-and-access-management).
* Learn more about [Arc-enabled servers](overview.md) and how they work with Azure through the Azure Connected Machine agent.
* Explore options for [onboarding your machines](plan-at-scale-deployment.md) to Azure Arc-enabled servers.
