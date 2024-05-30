---
title: Onboard with Oracle Database@Azure
description: Learn about onboarding your OracleOracle Database@Azure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: article
ms.date: 12/12/2023
ms.custom: engagement-fy23
ms.author: jacobjaygbay
---

# Onboard with Oracle Database@Azure 

In this article, you learn how to subscribe to the Oracle Database@Azure service in your Azure environment.

Before subscribing to Oracle Database@Azure, review the prerequisites in this documentation and contact [Oracle Sales](https://www.oracle.com/corporate/contact/) if Oracle hasn't created an Azure private offer for your organization.

## Prerequisites  
To use the Oracle Database@Azure, you need the following items:
-   An existing Azure subscription.
-   An Azure virtual network with a subnet delegated to the Oracle Database@Azure service `Oracle.Database/networkAttachments`.

If you don't have an Oracle Cloud (OCI) account, you can create one during your service deployment. If you do have an OCI account, you can use it with Oracle Database@Azure.

Optionally, you can create identity federation for your OCI account so that users can access the OCI tenancy using an Azure sign in. You must perform certain Oracle Database@Azure tasks related to Container Database (CDB) and Pluggable Database (PDB) management in the OCI console. If you choose not to federate your OCI tenancy with Azure's identity service, you must create OCI users using the OCI Identity and Access Management (IAM) service. 
For more information on creating identity federation using Azure's identity service, see [Identity Federation](https://docs.oracle.com/iaas/Content/multicloud/signup_guided_federation.htm) in the Oracle Multicloud documentation using Azure's identity service.

## Step 1: Purchase Oracle Database@Azure in the Azure portal 

1.  Sign in to your Azure account.
2.  Navigate to the Marketplace service in the Azure portal. See [What is Azure Marketplace?](/marketplace/azure-marketplace-overview) in the Azure documentation for more information on Azure Marketplace.

    Alternately, if you received an email from Azure with a link to your private offer, you can select the link to go to your offer in the Azure portal. Skip to step 4 if you selected a link to your offer and are viewing it in the Azure portal.

3.  In Azure Marketplace, under **Management**, select **Private Offer Management**.
4.  In the list of private offers, select the **View + accept** button in the row for the Oracle Database@Azure offer.
5.  Review the offer details, then accept and subscribe to the private offer. For more information on private offers in the Azure Marketplace, see [Private offers in Azure Marketplace](/marketplace/private-offers-in-azure-marketplace)

    To accept and subscribe to the private offer:

    1.  Review the terms and conditions by clicking the "terms and conditions" link on the private offer page under **Private Offer's attachments and addendum**.
    2.  Select the checkbox for **I have read the offer's terms and conditions** after reviewing the terms and conditions.
    3.  Select the **Accept Private Offer** button. After a few moments, your browser will redirect to the **Private Offer Management** page.
    4.  On the **Private Offer Management** page, the status of the private offer shows **Preparing for purchase**. After 10 to 15 minutes, the status updates to **Ready** and the **Purchase** button is enabled. Once the **Purchase** button is enabled, select it to continue. Your browser redirects to the **Create OracleSubscription** page.
6. On the **Create OracleSubscription** page, select the **Basics** tab under **Project details** if this tab isn't already selected.
7.  Use the **Subscription** selector to select your subscription if it isn't already selected.
8. In the Instance details section, enter "default" (with no quotation marks) in the Name field.Review the information in the following fields, which are configured for you:
     - **Name**: This field is automatically set to “default”.
     - **Region**: This field is automatically set to “Global”.
     - **Plan and Billing term**: The values in these fields are automatically set for your offer, and you don't need to set or change these values.

9. Select **Review + create** to continue.
10. On the **Review + create** tab, review the information about your service and the **Marketplace terms of use**, then select **Create**. The Azure portal redirects to the deployment details for the Oracle Database@Azure service. The deployment of the service takes a few minutes.
11. When the page displays the **Your deployment is complete** message, select the **Go to resource** button under **Next steps**. Your browser redirects to the deployment details page. The **Purchase status** for your private offer shows **Subscribed**.

## Step 2: Select your Oracle Cloud account

1. After completing your purchase of Oracle Database@Azure in the Azure portal, you need to choose an Oracle Cloud Infrastructure (OCI) account to use with your Oracle Database@Azure subscription service. You can choose to create a new account, or to use an existing account. Your OCI account is used for the provisioning and management of container databases (CDBs) and Pluggable databases (PDBs). Your OCI account also allows Oracle to provide infrastructure and software maintenance updates for your database service.
Oracle will send you an email about creating an OCI account and tenancy for your Azure service after you complete the creation of the service described in the previous step.

2. In the email you receive from Oracle, select either the **Create new cloud account** button or the **Add to existing cloud account** button, depending on whether you want to create a new OCI account for the service or link the service to an existing OCI account.

    - For new accounts, follow the instructions provided in [If you need to create a new cloud account](https://docs.oracle.com/iaas/Content/GSG/Tasks/buysubscription.htm#activate_order__new-account) in the Oracle Cloud documentation.
    - To link an existing account, follow the instructions provided in [If you already have an existing cloud account](https://docs.oracle.com/iaas/Content/GSG/Tasks/buysubscription.htm#activate_order__existing-account) in the Oracle Cloud documentation.

## Step 3 (optional): Create identity federation using Azure's identity service 

Optionally, you can use Microsoft Entra ID for federated identity and access management. To set up identity federation using Azure's identity service, follow the directions in the [Identity Federation](https://docs.oracle.com/iaas/Content/multicloud/signup_guided_federation.htm) article in the Oracle Multicloud documentation.

## Next steps

- [Overview - Oracle Database@Azure](database-overview.md)
- [Provision and manage Oracle Database@Azure](provision-oracle-database.md)
- [Oracle Database@Azure support information](oracle-database-support.md)
- [Network planning for Oracle Database@Azure](oracle-database-network-plan.md)
- [Groups and roles for Oracle Database@Azure](oracle-database-groups-roles.md)
