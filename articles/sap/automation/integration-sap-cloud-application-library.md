---
title: Integrate SAP Cloud Appliance Library with SAP Deployment Automation Framework
description: Learn how to integrate SAP Cloud Appliance Library with SAP Deployment Automation Framework.
author: nnoaman
ms.author: nadeennoaman
ms.reviewer: kimforss
ms.date: 10/24/2024
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
# Customer intent: "As an IT administrator, I want to integrate the SAP Cloud Appliance Library with the SAP Deployment Automation Framework, so that I can streamline the deployment and management of SAP solutions on Azure."
---
# Integrate SAP Cloud Appliance Library with SAP Deployment Automation Framework

The integration between SAP Deployment Automation Framework (SDAF) and [SAP Cloud Appliance Library (CAL)](https://cal.sap.com/catalog#/solutions) offers a seamless experience for customers who want to deploy infrastructure by using SDAF's guided deployment. You can use Azure Pipelines or the provided shell scripts for deployment.

## Introduction to SAP Cloud Appliance Library

[SAP Cloud Appliance Library](https://cal.sap.com/) is a cloud-based solution that simplifies the deployment and management of preconfigured SAP solutions on cloud platforms like Azure. SAP CAL offers a catalog of preconfigured SAP software solutions (for example, S/4 HANA and SAP Business Suite). You can deploy these solutions on your cloud of choice without needing to manually install or configure software.

## Overview of SDAF and SAP CAL integration

After the infrastructure setup, you can install SAP software by using the [SAP CAL API for installation](https://api.sap.com/api/Workloads/overview) directly from Azure DevOps.

The benefits of this integration include:

- Access to the latest S/4 HANA installation to ensure that you have the most up-to-date SAP software.
- The fastest installation experience with Azure and SAP CAL integration to streamline the deployment process.
- Elimination of the need to maintain a bill of materials file for the SAP installation, which simplifies the management and setup process.

This integration brings together the best of Azure infrastructure capabilities and SAP software deployment solutions. You gain a comprehensive and efficient approach to deploy SAP systems on Azure.

## Prerequisites

- Select one of the regions supported by SAP CAL (West Europe, East US, and East US 2) for the deployment.
- Use an [S-User role](https://help.sap.com/docs/help/3e7fe88850cf4ee39d151949a990d8ca/6a92e3ffb3ee43e59c1e394566b4c085.html). This role is required.
- Set up Azure DevOps for the deployment framework. For more information, see [Use SAP Deployment Automation Framework from Azure DevOps Services](configure-devops.md). 
- Use managed identities for the SDAF deployment.
- Set the parameter `enable_rbac_authorization_for_keyvault = true` in the Landscape `tfvars` file.
- Set the parameter `enable_sap_cal = true` in the System `tfvars` file.

## Register an application with Microsoft Entra and create a service principal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Register an application with Microsoft Entra with supported account types by using **Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant)**.

1. Assign roles to the application (Contributor and User Access administrator) for the subscription that you want.

1. Set up authentication with an application certificate or a secret. We recommend that you use a certificate. For more information:

    - Read about [Azure Key Vault certificates](/azure/key-vault/certificates/about-certificates).
    - Learn about [certificate creation methods](/azure/key-vault/certificates/create-certificate).
    - Create a certificate in Key Vault by using the [Azure portal](/azure/key-vault/certificates/quick-create-portal), the [Azure CLI](/azure/key-vault/certificates/quick-create-cli), or [Azure PowerShell](/azure/key-vault/certificates/quick-create-powershell).
    - See the article [Azure authentication with service principal](/azure/developer/java/sdk/identity-service-principal-auth).

1. Collect the following information for the next step: Subscription ID, Microsoft Entra tenant ID, application (client) ID, and client secret or certificate.

1. Go to **Authentication**, and under **Supported account types**, select **Any Microsoft Entra ID tenant - Multitenant**.

## Create an account in SAP CAL and enable API access

1. Go to the [CAL portal](https://cal.sap.com/catalog#/solutions) and sign in by using the S-User role.

1. [Create the CAL account](https://help.sap.com/docs/SAP_CLOUD_APPLIANCE_LIBRARY/43df7ec18b5241f7bf9a8c9de5ba3361/042bb15ad2324c3c9b7974dbde389640.html) with the cloud provider as **Microsoft Azure** and the authorization type as **Authorization with Application**.

1. Enter the subscription ID, the Microsoft Entra tenant ID, the application (client) ID, and the certificate or client secret to create the CAL account.

   :::image type="content" source="./media/sap-cal-integration/sap-cal-account.png" alt-text="Screenshot that shows how to create an SAP CAL account." lightbox="./media/sap-cal-integration/sap-cal-account.png":::

1. After the CAL account is created, edit the account to enable API access. For more information, see [Activating API Access](https://help.sap.com/docs/SAP_CLOUD_APPLIANCE_LIBRARY/43df7ec18b5241f7bf9a8c9de5ba3361/7c4da18a888d4dfe8fc594d0e18072a8.html?q=API%20enable).

   > [!NOTE]
   > You must activate the product from which you want to deploy a workload for the SAP Cloud Appliance Library account that will use this API. Then accept the Terms and Conditions for this product. For more information, see [Activating Solutions](https://help.sap.com/docs/SAP_CLOUD_APPLIANCE_LIBRARY/43df7ec18b5241f7bf9a8c9de5ba3361/90627702612e45709e696a258af51c76.html?q=API%20enable).

   :::image type="content" source="./media/sap-cal-integration/sap-cal-enable-api-access.png" alt-text="Screenshot that shows how to enable SAP CAL API access." lightbox="./media/sap-cal-integration/sap-cal-enable-api-access.png":::

1. After API access is enabled for the account, wait for a moment until the key vault is created. Then collect the key vault name for the next step.

   :::image type="content" source="./media/sap-cal-integration/sap-cal-key-vault-name.png" alt-text="Screenshot that shows how to copy the SAP CAL Azure Key Vault name." lightbox="./media/sap-cal-integration/sap-cal-key-vault-name.png":::

> [!IMPORTANT]
> This key vault stores the generated CAL endpoints and client secret that are used to obtain OAuth tokens.

## Step-by-step guide

Here's a step-by-step guide for installing SAP S/4 HANA with the SAP CAL Installation API integrated into SDAF:

1. Deploy infrastructure from SDAF:

    - See the instructions for infrastructure creation for an SAP system with SDAF by using managed identity in [Use SAP Deployment Automation Framework from Azure DevOps Services](/azure/sap/automation/configure-devops?tabs=linux).
    - Set the parameter `enable_rbac_authorization_for_keyvault = true` in the Landscape `tfvars` file.
    - Assign the Key Vault administrator role to the application for the SDAF workload zone key vault.
    - Add the SAP BTP outbound IP addresses for the Europe (Rot) region in the SDAF workload zone key vault. For more information, see [Regions and Hosts Available for the Neo Environment](https://help.sap.com/docs/btp/sap-btp-neo-environment/regions-and-hosts-available-for-neo-environment).
    - Set the parameter `enable_sap_cal = true` in the System `tfvars` file.

1. After the system deployment, update the *sap-parameters.yaml* file with the CAL key vault.

   :::image type="content" source="./media/sap-cal-integration/sap-cal-parameters.png" alt-text="Screenshot that shows the sap-parameters.yaml file." lightbox="./media/sap-cal-integration/sap-cal-parameters.png":::

1. Run the **SAP installation using SAP-CAL** pipeline:

    1. After you add the CAL key vault in `sap_parameters`, select the SAP CAL product name from the dropdown menu.

    1. Select **Run** to begin the installation process.

      :::image type="content" source="./media/sap-cal-integration/sap-cal-run-pipeline.png" alt-text="Screenshot that shows how to run the Azure DevOps SAP installation by using the SAP-CAL pipeline." lightbox="./media/sap-cal-integration/sap-cal-run-pipeline.png":::

## Track the installation

To track the installation and get detailed information about steps and any errors, go to the [CAL portal](https://cal.sap.com/catalog#/appliances).

## SAP Cloud Appliance Library API documentation

The CAL installation API documentation is available on the [SAP Business Accelerator Hub](https://api.sap.com/api/Workloads/path/createSystemExt).

## Workflow for SDAF: CAL API integration

The workflow/process diagram for the installation of S/4 HANA with the CAL API is available in the article on [software provisioning of S/4 HANA](https://caldocs.hana.ondemand.com/caldocs/help/External_to_CAL_infrastructure.pdf).

## Support

- For questions about the integration experience of SAP CAL and SDAF, contact <SDAFicm@microsoft.com>.
- For help on issues with installation, create a support request with SAP CAL on [Report an Issue Dashboard - SAP for Me](https://me.sap.com/createIssue/0).
  
  Raise the request for the component `BC-VCM-PSD` so that the request reaches the SAP CAL team.

## Related content

- [Get started with SAP Deployment Automation Framework](get-started.md)
- [Plan your deployment of the SAP automation framework](plan-deployment.md)
- [Configure Azure DevOps for the automation framework](configure-devops.md)
