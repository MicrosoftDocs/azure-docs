---
title: Deploy and configure the container hosting the SAP data connector agent via the UI
description: This article shows you how to use the UI to deploy the container that hosts the SAP data connector agent. You do this to ingest SAP data into Microsoft Sentinel, as part of the Microsoft Sentinel Solution for SAP.
author: MSFTandrelom
ms.author: andrelom
ms.topic: how-to
ms.date: 04/12/2022
---

# Deploy and configure the container hosting the SAP data connector agent (via UI)

This article shows you how to deploy the container that hosts the SAP data connector agent. You do this to ingest SAP data into Microsoft Sentinel, as part of the Microsoft Sentinel Solution for SAP.

This article shows you how to deploy the container and create SAP systems via the UI. Alternatively, you can [deploy the data connector agent manually](deploy-data-connector-agent-container-manual.md), via managed identity, a registered application, a configuration file, or directly on the VM. 

## Deployment milestones

Deployment of the Microsoft Sentinel Solution for SAP is divided into the following sections

1. [Deployment overview](deployment-overview.md)

1. [Deployment prerequisites](prerequisites-for-deploying-sap-continuous-threat-monitoring.md)

1. [Prepare SAP environment](preparing-sap.md)

1. **Deploy data connector agent (*You are here*)**

1. [Deploy SAP security content](deploy-sap-security-content.md)

1. [Configure Microsoft Sentinel Solution for SAP](deployment-solution-configuration.md)

1. Optional deployment steps
   - [Configure auditing](configure-audit.md)
   - [Configure SAP data connector to use SNC](configure-snc.md)


## Data connector agent deployment overview

For the Microsoft Sentinel Solution for SAP to operate correctly, you must first get your SAP data into Microsoft Sentinel. To accomplish this, you need to deploy the solution's SAP data connector agent.

The data connector agent runs as a container on a Linux virtual machine (VM). This VM can be hosted either in Azure, in a third-party cloud, or on-premises. We recommend that you install and configure this container using a *kickstart* script; however, you can choose to [deploy the container manually](deploy-data-connector-agent-container-manual.md?tabs=deploy-manually#deploy-the-data-connector-agent-container).

The agent connects to your SAP system to pull logs and other data from it, then sends those logs to your Microsoft Sentinel workspace. To do this, the agent has to authenticate to your SAP system - that's why you created a user and a role for the agent in your SAP system in the previous step. 

Your SAP authentication infrastructure, and where you deploy your VM, will determine how and where your agent configuration information, including your SAP authentication secrets, is stored. These are the options, in descending order of preference:

- An Azure Key Vault, accessed through an Azure **system-assigned managed identity**
- An Azure Key Vault, accessed through an Azure AD **registered-application service principal**
- A plaintext **configuration file**

If your **SAP authentication** infrastructure is based on **SNC**, using **X.509 certificates**, your only option is to use a configuration file. Select the [**Configuration file** tab below](deploy-data-connector-agent-container-manual.md?tabs=config-file#deploy-the-data-connector-agent-container) for the instructions to deploy your agent container.

If you're not using SNC, then your SAP configuration and authentication secrets can and should be stored in an [**Azure Key Vault**](../../key-vault/general/authentication.md). How you access your key vault depends on where your VM is deployed:

- **A container on an Azure VM** can use an Azure [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to seamlessly access Azure Key Vault. Select the [**Managed identity** tab below](deploy-data-connector-agent-container-manual.md?tabs=managed-identity#deploy-the-data-connector-agent-container) for the instructions to deploy your agent container using managed identity.

    In the event that a system-assigned managed identity can't be used, the container can also authenticate to Azure Key Vault using an [Azure AD registered-application service principal](../../active-directory/develop/app-objects-and-service-principals.md), or, as a last resort, a configuration file.

- **A container on an on-premises VM**, or **a VM in a third-party cloud environment**, can't use Azure managed identity, but can authenticate to Azure Key Vault using an [Azure AD registered-application service principal](../../active-directory/develop/app-objects-and-service-principals.md). Select the [**Registered application** tab below](deploy-data-connector-agent-container-manual.md?tabs=registered-application#deploy-the-data-connector-agent-container) for the instructions to deploy your agent container.

    If for some reason a registered-application service principal can't be used, you can use a configuration file, though this is not preferred.

## Deploy the data connector agent container via the UI


## Next steps

Once the connector is deployed, proceed to deploy Microsoft Sentinel Solution for SAP content:
> [!div class="nextstepaction"]
> [Deploy SAP security content](deploy-sap-security-content.md)
