---
title: Integrating SAP Cloud Appliance Library with SAP Deployment Automation Framework
description: Learn how to integrate SAP Cloud Appliance Library with SAP Deployment Automation Framework.
author: nnoaman
ms.author: nadeennoaman
ms.reviewer: kimforss
ms.date: 10/24/2024
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
---
# Learn how to integrate SAP Cloud Appliance Library with the SAP Deployment Automation Framework

The integration between SAP Deployment Automation Framework (SDAF) and [SAP Cloud Appliance Library (CAL)](https://cal.sap.com/catalog#/solutions) offers a seamless experience for customers deploying infrastructure using SDAF's guided deployment, which can be done through Azure Pipelines or using the provided shell scripts.

## Introduction to SAP Cloud Appliance Library (CAL)

[SAP Cloud Appliance Library (CAL)](https://cal.sap.com/) is a cloud-based solution that simplifies the deployment and management of preconfigured SAP solutions on cloud platforms like Microsoft Azure. SAP CAL works by offering a catalog of preconfigured SAP software solutions (for example, S/4 HANA, SAP Business Suite), enabling customers to deploy these solutions on their cloud of choice without needing to manually install or configure software.

## Overview of SAP Deployment Automation Framework (SDAF) and SAP Cloud Appliance Library (CAL) Integration

Following the infrastructure setup, customers can install SAP software using the [SAP CAL API for installation](https://api.sap.com/api/Workloads/overview) directly from Azure DevOps.

The benefits of this integration include:

-   Access to the latest S/4 HANA installation, ensuring customers have the most up-to-date SAP software.

-   The fastest installation experience with Azure and SAP Cloud Appliance Library (CAL) integration, streamlining the deployment process.

-   Elimination of the need to maintain a Bill of Materials (BOM) file for Ansible, simplifying the management and setup process.

This integration brings together the best of Azure\'s infrastructure capabilities and SAP\'s software deployment solutions, providing a comprehensive and efficient approach to deploying SAP systems on Azure.

## Prerequisites

-   Select one of the supported regions by SAP CAL \[West Europe, East US, and East US 2\] for the deployment.

-   An [S-User](https://help.sap.com/docs/help/3e7fe88850cf4ee39d151949a990d8ca/6a92e3ffb3ee43e59c1e394566b4c085.html) is required.

-   Set up Azure DevOps for the deployment framework, [Azure DevOps for SAP Deployment Automation Framework](configure-devops.md).

-   Use Managed Identities for SDAF deployment.

-   Set parameter "enable_rbac_authorization_for_keyvault = true" in the Landscape tfvars file.

-   Set parameter "enable_sap_cal = true" in the System tfvars file.

## Register an application with Azure AD and create a service principal

1.   Sign in to Azure portal.

2.   Register an application with Azure AD with supported account types "Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant)"

3.   Assign roles to the application (Contributor and User Access Administrator) for the desired subscription.

4.  Set up authentication with application certificate (recommended) or secret.

    -   [About Azure Key Vault certificates](/azure/key-vault/certificates/about-certificates).

    -   [Certificate creation methods](/azure/key-vault/certificates/create-certificate).

    -   Create a certificate in Key Vault using [Portal](/azure/key-vault/certificates/quick-create-portal), [Azure CLI](/azure/key-vault/certificates/quick-create-cli), [Azure PowerShell](/azure/key-vault/certificates/quick-create-powershell).

    -   [Azure authentication with service principal](/azure/developer/java/sdk/identity-service-principal-auth)

5.   Collect the following information for the next step - Subscription ID, Microsoft Entra Tenant ID, Application (Client) ID, and Client Secret or Certificate.

6.   Navigate to "Authentication" and select "Any Microsoft Entra ID tenant--multitenant" in Supported account types.

## Create account in SAP CAL and enable API access

1.   Go to [CAL portal](https://cal.sap.com/catalog#/solutions) and log on using S-User.

2.   [Create CAL account](https://help.sap.com/docs/SAP_CLOUD_APPLIANCE_LIBRARY/43df7ec18b5241f7bf9a8c9de5ba3361/042bb15ad2324c3c9b7974dbde389640.html) with cloud provider as \"Microsoft Azure\" and Authorization Type as \"Authorization with Application\".

3.   Provide Subscription ID, Microsoft Entra Tenant ID, Application (Client) ID, and Certificate or Client Secret to create the CAL account.

:::image type="content" source="./media/sap-cal-integration/sap-cal-account.png" alt-text="Screenshot that shows how to create an SAP CAL account.":::

4.   Once the CAL account is created, edit the account to enable API access. [Learn More](https://help.sap.com/docs/SAP_CLOUD_APPLIANCE_LIBRARY/43df7ec18b5241f7bf9a8c9de5ba3361/7c4da18a888d4dfe8fc594d0e18072a8.html?q=API%20enable).

> [!NOTE]
> You have to activate the product from which you want to deploy a workload for the SAP Cloud Appliance Library account that will use this API and accept the Terms and Conditions for this product. For more information, see [Activating Solutions](https://help.sap.com/docs/SAP_CLOUD_APPLIANCE_LIBRARY/43df7ec18b5241f7bf9a8c9de5ba3361/90627702612e45709e696a258af51c76.html?q=API%20enable).

:::image type="content" source="./media/sap-cal-integration/sap-cal-enable-api-access.png" alt-text="Screenshot that shows how to enable SAP CAL API Access.":::

5.   Once API access is enabled for the account, wait for a moment until the Key Vault is created, then collect the Key Vault name for the next step.

:::image type="content" source="./media/sap-cal-integration/sap-cal-key-vault-name.png" alt-text="Screenshot that shows how to copy SAP CAL Azure Key Vault Name.":::

> [!IMPORTANT]
> This created Key Vault stores the generated CAL end points and client secret used for obtaining OAuth tokens.

## Step-by-step guide

Here\'s a step-by-step guide for installing SAP S/4 HANA with SAP CAL Installation API integrated into SDAF:

1.  Deploy Infrastructure from SDAF:

    -   Detailed instructions for Infrastructure creation for an SAP system with SDAF using Managed Identity (MSI) are [here](/azure/sap/automation/configure-devops?tabs=linux)

    -   Set parameter "enable_rbac_authorization_for_keyvault = true" in the Landscape tfvars file.

    -   Set parameter "enable_sap_cal = true" in the System tfvars file.

2.  After the system deployment, update sap-parameters.yaml file with the CAL Key Vault.

:::image type="content" source="./media/sap-cal-integration/sap-cal-parameters.png" alt-text="Screenshot that shows sap-parameters.yaml file.":::


3.  Run "SAP installation using SAP-CAL" pipeline:

    1.   After adding the CAL Key Vault in sap_parameters, select the SAP CAL Product Name from the drop-down menu

    1.   Press \'Run\' to begin the installation process.

:::image type="content" source="./media/sap-cal-integration/sap-cal-run-pipeline.png" alt-text="Screenshot that shows how to run Azure DevOps SAP installation using SAP-CAL Pipeline.":::

## Tracking the installation

You can go to the [[CAL portal]](https://cal.sap.com/catalog#/appliances) to track installation and get detailed information about steps and errors if any.


## SAP Cloud Appliance Library (CAL) API Documentation

The CAL installation API documentation is available [here](https://api.sap.com/api/Workloads/path/createSystemExt)

## Workflow for SDAF - CAL API integration 

The workflow/process diagram for the installation of S/4 HANA with CAL API is available [here](https://caldocs.hana.ondemand.com/caldocs/help/External_to_CAL_infrastructure.pdf).

## Support

-   For any questions about the integration experience of SAL CAL and
    SDAF, reach out to \'<SDAFicm@microsoft.com>\'.

-   For help on issues with the installation, you can create a support
    request with SAP CAL on [Report An Issue Dashboard - SAP for
    Me](https://me.sap.com/createIssue/0).

    -   Please raise the request for the component: \'BC-VCM-PSD\' in
        order for the request to reach the SAP CAL team.

## Next steps

> [!div class="nextstepaction"]
> - [Get started with the deployment automation framework](get-started.md)
> - [Plan for the automation framework](plan-deployment.md)
> - [Configure Azure DevOps for the automation framework](configure-devops.md)
