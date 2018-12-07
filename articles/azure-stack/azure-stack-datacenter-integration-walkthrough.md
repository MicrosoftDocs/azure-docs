---
title: Azure Stack datacenter integration walkthrough | Microsoft Docs
description: Learn what to expect for a successfull on-site deployment of Azure Stack in your datacenter.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid: 
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/10/2018
ms.author: jeffgilb
ms.reviewer: asganesh
---
 
# Azure Stack Customer Journey

This document describes the customer experience of purchasing an Azure Stack Integrated solution through a successful on-site deployment by a solution provider engineer along with who owns what. This content will help set the expectation on what you, as a customer for Azure Stack, should expect to help ease your journey.

|     |Planning phase|Order process|Pre-deployment|Factory process|Hardware delivery|Onsite deployment|
|-----|-----|-----|-----|-----|-----|-----|
|Microsoft|Engage with partner and provide presale support and necessary tooling.|Prepare software licensing and contracts as needed.|Microsoft to provide the required tooling to help collect data center integration requirement and documentation to customer.|Provide the latest base line builds and tool chain updates on a monthly cadence.|N/A|Microsoft support engineers to help with any issues during deployment.|
|Partner|Recommend solution options based on customer requirements.<br><br>Propose POC if necessary.<br><br>Establish business relationship.<br><br>Decide on level of support.|Prepares necessary contracts with the customer.<br><br>Create customer PO.<br><br>Decide on delivery timeline.<br><br>Connect customer with Microsoft if necessary.|Provides the customer with necessary training and ensures that the customer understands all deployment prerequisites and data center integration options they’d plan for.<br><br>Assists the customer with validation steps to ensure the completeness and accuracy of the collected data.|Apply the last validated baseline build.<br><br>Apply the required Microsoft deployment tool kit.|Ship the hardware to customer site.|Deployment is handled by our partner onsite engineer.<br><br>Rack and stack.<br><br>HLH deployment.<br><br>Azure Stack deployment.<br><br>Hand off to customer.|
|Customer|Describes intended use cases and lays down requirements.|Determines the billing model, reviews and approves the contracts.|Completes the deployment worksheet, ensures all deployment prerequisites are met, and is ready for deployment.|N/A|Prepares data center and ensures all required power/cooling are in place along with all border connectivity and required datacenter integration requirement are in place.|Needs to be available to provide subscription credentials and support if there is question on the provided data.|
| | | | | | | |

As the customer of Azure Stack, you should anticipate following the phases as described in the table above:

## Planning Phase
This is where Microsoft and/or the Azure Stack solution partners will work with you to evaluate and understand your use case to see whether Azure Stack is the right solution for you:

They will help you decide on the following:

-   Is Azure Stack the right solution for your organization?

-   What size solution will you need?

-   What type of billing and licensing model work for your organization?

-   What are the power and cooling requirements?

    To ensure that the hardware solution will best fit your needs, the *Azure Stack Capacity Planner* is intended to aid in pre-purchase planning to determine appropriate capacity and configuration of Azure Stack hardware solutions. The Capacity Planner can be found [here](https://gallery.technet.microsoft.com/Azure-Stack-Capacity-24ccd822).

    Please note that the spreadsheet is *not* intended to be used as a substitute to your own investigation and analysis for hardware solutions that best suit your needs.

For more integration considerations, check [here](https://review.docs.microsoft.com/en-us/azure/azure-stack/azure-stack-datacenter-integration?branch=master).

## Order Process Phase
At this stage, many of your questions with regards to feasibility would have been answered. Now that you are ready to commit to purchase Azure Stack, and after signing all the required contracts and POs, you will be asked by your solution provider to provide the integration requirement for Azure Stack in your data center.

## Pre-deployment Phase
During this phase, you will need to decide on how you want to integrate Azure Stack into your data center. To ease this process, Microsoft in collaboration with the solution providers put together a requirement template to help you gather all the necessary information to plan an integrated system deployment within your environment.

To ensure the completion of the template, known as the Deployment Worksheet, [this link](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-datacenter-integration) will contain all necessary information that will aid you for your datacenter integration.

> [!IMPORTANT]
> During this stage it is important that you get all the pre-requisite information investigated, decided on and locked-on prior to ordering the solution. Please be aware that this step is time consuming and requires coordination and data gathering from multiple disciplines within your organization. You will be asked to determine the following:**

### Choosing an Azure Stack Connection Model and Identity Provider

    You can choose to deploy Azure Stack either connected to the internet (and to Azure) or disconnected. To get the most benefit from Azure Stack, including hybrid scenarios, you'd want to deploy connected to Azure. Choosing Active Directory Federation Services (AD FS) or Azure Active Directory (Azure AD) is a one-time decision that you must make at deployment time. *You can’t change this later without re-deploying the entire system. *

> [!NOTE]
> For more information on Azure Stack connection models, click [here](https://docs.microsoft.com/azure/azure-stack/azure-stack-connection-models).

### Choosing a Licensing Model

Your identity provider choice has no bearing on tenant virtual machines, the identity system, and accounts they use, whether they can join an Active Directory domain, etc.

Customers that are in a [*disconnected deployment*](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-disconnected-deployment) have only one option: capacity-based billing.

Customers that are in a [*connected* *deployment*](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-connected-deployment) have the option of both capacity-based billing and pay-as-you-use. Capacity based billing will require an Enterprise Agreement (EA) Azure Subscription for registration. This is needed for registration to be able to set up availability of items in the Marketplace through an Azure Subscription.

### Network integration

Network integration is crucial for deployment, operation, and management of Azure Stack systems. There are several considerations that go into ensuring the Azure Stack solution is resilient and has highly available physical infrastructure to support its operations.

> [!NOTE]
> For more information on Azure Stack network connectivity, click [here](https://docs.microsoft.com/azure/azure-stack/azure-stack-network).

### Firewall Integration

It is recommended that you use a firewall to help secure Azure Stack. Firewalls can help prevent DDOS attacks, intrusion detection, and content inspection. However, it should be noted that it can become a throughput bottleneck for Azure storage services.

> [!NOTE]
> For more information on Azure Stack firewall integration, click [here](https://docs.microsoft.com/azure/azure-stack/azure-stack-firewall).

### Certificate requirements

It is critical that all certificates are available prior to an onsite engineer arrives to your data center for deployment. Find a list of all required certificates needed to deploy Azure Stack [here](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-pki-certs).

Once all the pre-requisite information is gathered through the deployment worksheet, the solution provider will kick off a factory process to build and integrate parameters collected to ensure a successful integration of Azure Stack into your datacenter.

## H/W Delivery Phase
Your solution provider will work with you on scheduling when the solution will arrive to your facility. Once received and put in place, you will need to schedule time with the solution provider to have an engineer come on site to perform the Azure Stack deployment.

> [!NOTE]
> It is **crucial** that all the pre-requisite data is locked and available before the onsite* *engineer arrives to deploy the solution. *

-   *All certificates must be purchased and ready*

-   *Domain name must be decided on*

-   *All network integration parameters are locked and match with what you have shared with your solution provider*

> [!TIP]
> If any of this information has changed, make sure to communicate the change with the solution provider before you schedule the actual deployment.

## Onsite Deployment Phase
To deploy Azure Stack, an onsite engineer from your hardware solution provider will need to be present onsite to kick off and ensure a successful deployment. To ensure a seamless process, please ensure that all information provided through the deployment worksheet has not changed. The following is what you should expect from the onsite deployment experience:

The onsite engineer will check all the cabling and border connectivity to ensure the solution is properly put together and meets your requirement.

The deployment engineer, will also do the following:

-   Configure the solution HLH (Hardware Lifecycle Host)
-   Check to make sure all BMC, BIOS and Network settings are correct.
-   Make sure the firmware of all components is at the latest approved version by the solution
-   Start the deployment

> [!NOTE]
> A deployment procedure by the onsite engineer might take around one business week to complete.

##Post-Integration Phase
During this phase, there are steps that must be performed by the partner before being handed off to the customer. In post deployment, validation is important to ensuring the system is deployed and performing correctly. Actions that should be taken by the OEM Partner are:

-   [Run test-azurestack](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-diagnostic-test#run-validation-tool-to-test-system-readiness-before-installing-update-or-hotfix)

-   [Registration with Azure](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-registration)

-   [Marketplace Syndication](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-download-azure-marketplace-item#use-the-marketplace-syndication-tool-to-download-marketplace-items)

-   Backup Switch Configuration Files

-   Remove DVM

-   Prepare a customer summary for deployment

-   [Check updates to make sure the solution software is updated to the latest version](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-updates)

There are several steps that are required or optional depending on the installation type.

-   If deployment was completed using [ADFS](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-integrate-identity) then the Azure Stack stamp will need to be integrated with customers own ADFS.

> [!NOTE]
> This step is the responsibility of the customer, although the partner may optionally choose to offer services to do this.*

-   Integration with an existing monitoring system from the respective partner.

    -   [SCOM Integration](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-integrate-monitor) also supports fleet management capabilities.

    -   [Nagios Integration](https://docs.microsoft.com/en-us/azure/azure-stack/azure-stack-integrate-monitor#integrate-with-nagios)

## Overall Timeline

![](./media/azure-stack-datacenter-integration-walkthrough/image1.png)

## Support
Azure Stack enables an Azure consistent, integrated support experience that covers the full system lifecycle. To fully support Azure Stack system, customers need two support contracts— one with Microsoft (or their Cloud Solution Provider) for Azure services support and one with the hardware provider for system support. The integrated support experience provides coordinated escalation and resolution, so customers get a consistent support experience no matter whom they call first. For customers who already have Premier, Azure -Standard / ProDirect or Partner support with Microsoft, Azure Stack software support is included.

The integrated support experience makes use of a Case Exchange mechanism for bi-directional transfer of support cases and case updates between Microsoft and the Hardware partner. Microsoft Azure Stack will follow the Modern Lifecycle policy. The official Life Cycle support policy here - <https://support.microsoft.com/en-us/help/30881>

## Next steps
Learn more about [general datacenter integration considerations](.\azure-stack-datacenter-integration.md).