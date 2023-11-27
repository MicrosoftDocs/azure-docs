---
title: Onboarding with Oracle Database@Azure
description: Learn about onboarding your OracleOracle Database@Azure.
author: jjaygbay1
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.date: 04/11/2023
ms.author: jacobjaygbay
---

# Onboarding with Oracle Database@Azure 

In this article, you learn about how to subscribe and onboard to the Oracle Database@Azure service in your Azure environment.

Before subscribing to Oracle Database@Azure, review the following prerequisites and contact [Oracle Sales](https://www.oracle.com/corporate/contact/) if Oracle hasn't already created an Azure private offer for your organization.

## Prerequisites for Oracle Database@Azure
To use the Oracle Database@Azure service, you need the following:
-   An existing Azure account
-   An Azure virtual network with a subnet delegated to the Oracle Database@Azure service (`Oracle.Database/networkAttachments`)
-   An  (OCI) tenancy, which you can create during the service deployment

Optionally, you can create identity federation for your OCI tenancy so that users can access the OCI tenancy using an Azure sign in. Certain Oracle Database@Azure tasks related to Container Database (CDB) and Pluggable Database (PDB) management must be performed in the OCI console. If you choose not to federate your OCI tenancy with Azure's identity service, you must create OCI users using the OCI  service. See [Identity Federation](https://docs.oracle.com/iaas/Content/multicloud/signup_guided_federation.htm) in the Oracle Multicloud documentation for information on creating identity federation using Azure's identity service.

## Step 1: Purchase Oracle Database@Azure in the Azure portal 

1.  Sign in to your Azure account.
2.  Navigate to the Marketplace service in the Azure portal. See [What is Azure Marketplace?](https://learn.microsoft.com/marketplace/azure-marketplace-overview) in the Azure documentation for more information on Azure Marketplace.

    Alternately, if you received an email from Azure with a link to your private offer, you can select the link to go to your offer in the Azure portal. Skip to step 4 in this article if you have clicked a link to your offer and are viewing it in the Azure portal.

3.  In Azure Marketplace, under **Management**, select **Private Offer Management**.
4.  In the list of private offers, select the **View Offer** button in the row for the Oracle Database@Azure offer.
5.  Review the offer details, then accept and subscribe to the private offer. For more information on private offers in the Azure Marketplace, see [Private offers in Azure Marketplace](https://learn.microsoft.com/marketplace/private-offers-in-azure-marketplace)

    To accept and subscribe to the private offer:

    1.  In the list of private offers, under **Product name**, select the link on the name of your Oracle Database@Azure offer.
    2.  On the Oracle Database offer details dialog, select the **Plans + pricing** and **Usage information + Support** tabs to review the offer details.
    3.  Select **Subscribe** to subscribe to the offer.
    4.  Select the **Usage information + Support** tab, review the information about your purchase, then select **Purchase**. The Azure portal redirects to the **Create Oracle Purchase** page
6.  On the purchase page, select the **Basics** tab under **Project details**.
7.  Use the **Subscription** selector to select your subscription if it isn't already selected.
8.  In the **Instance details** section, provide a **Name** for your Oracle Database@Azure instance, then use the **Plan** selector to choose your plan. The **Region** field is set to "Global", which applies to the subscription resource and not to the physical infrastructure resources you provision after onboarding.
9.  Select **Next** to continue.
10. On the **Review + create** tab, review the information about your service and the **Marketplace terms of use**, then select **Create**. The Azure portal redirects to the deployment details for the Oracle Database@Azure service.
11. On the deployment details, select the link for your Oracle Database@Azure purchase. The **Oracle Purchases** list view is displayed.
12. In the list of Oracle purchases, select the name of the Oracle Database@Azure instance to review the details of the purchase. This resource represents only the purchase of the Oracle Database@Azure subscription, and is separate from the Azure resources you create later during the provisioning of Oracle Database infrastructure.

## Step 2: Link Oracle Database@Azure to an Oracle Cloud account 

1.  After completing your purchase of Oracle Database@Azure in the Azure portal, you need to link an Oracle Cloud (OCI) account to your service. Your OCI account is used for the provisioning and management of container databases (CDBs) and pluggable databases (PDBs). Your OCI account also allows Oracle to provide infrastructure and software maintenance updates for your database service.

    Oracle will send you an email about creating an OCI account and tenancy for your Azure service after you complete the creation of the service described in the previous step.

2.  In the email you receive from Oracle, select the **Create new cloud account** button or follow the provided link to create an OCI account. Your browser opens OCI's **New Cloud Account Information** page so that you can create an OCI account for your Oracle Database service in Azure.

3.  Enter user information for the account (provide the information for the user who will administer the Oracle Database service in the Azure environment). Enter the administrator's **First Name**, **Last Name**, **Email**, and **Password**. In the **Confirm Password** field, reenter the same password you entered in the Password field.
4.  Enter a name for your OCI tenancy in the **Tenancy Name** field.
5.  Select an OCI **Home Region**. We recommend selecting the OCI region closest to the Azure region hosting the Oracle Database@Azure infrastructure. Only OCI regions that support Oracle Database@Azure are displayed in the **Home Region** drop-down selector. You can't change the home region after creating the OCI tenancy.

6.  Select **Create Tenancy** to create your OCI account.

For more information, see [Activate Your Order from Your Welcome Email](https://docs.oracle.com/iaas/Content/GSG/Tasks/buysubscription.htm#activate_order) in the Oracle Cloud documentation.

