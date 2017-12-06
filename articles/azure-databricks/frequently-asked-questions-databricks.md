---
title: 'Azure Databricks: Common questions and help | Microsoft Docs'
description: Get answers to common questions and troubleshooting information about Azure Databricks.
services: azure-databricks
documentationcenter: ''
author: nitinme
manager: cgronlun
editor: cgronlun

ms.service: azure-databricks
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/17/2017
ms.author: nitinme

---
# Frequently asked questions about Azure Databricks

This article lists the top queries you might have related to Azure Databricks. It also lists some common problems you might have while using Databricks. For more information, see [What is Azure Databricks](what-is-azure-databricks.md). 

## Can I use my own keys for local encryption? 
In the current release, using your own keys from Azure Key Vault is not supported. 

## Can I use Azure virtual networks with Databricks?
A new virtual network is created as part of Databricks provisioning. In this release, you cannot use your own Azure virtual network.

## How do I access Azure Data Lake Store from a notebook? 

Follow these steps:
1. In Azure Active Directory (Azure AD), provision a service principal, and record its key.
2. Assign the necessary permissions to the service principal in Data Lake Store.
3. To access a file in Data Lake Store, use the service principal credentials in Notebook.

For more information, see [Use Data Lake Store with Azure Databricks](https://docs.azuredatabricks.net/spark/latest/data-sources/azure/azure-storage.html#azure-data-lake-store).

## Fix common problems

Here are a few problems you might encounter with Databricks.

### This subscription is not registered to use the namespace ‘Microsoft.Databricks’

#### Error message

"This subscription is not registered to use the namespace ‘Microsoft.Databricks’. See https://aka.ms/rps-not-found for how to register subscriptions. (Code: MissingSubscriptionRegistration)"

#### Solution

1. Go to the [Azure portal](https://portal.azure.com).
2. Select **Subscriptions**, the subscription you are using, and then **Resource providers**. 
3. In the list of resource providers, against **Microsoft.Databricks**, select **Register**. You must have the contributor or owner role on the subscription to register the resource provider.


### Your account {email} does not have the owner or contributor role on the Databricks workspace resource in the Azure portal

#### Error message

"Your account {email} does not have Owner or Contributor role on the Databricks workspace resource in the Azure portal. This error can also occur if you are a guest user in the tenant. Ask your administrator to grant you access or add you as a user directly in the Databricks workspace." 

#### Solution

The following are a couple of solutions to this issue:

* To initialize the tenant, you must be signed in as a regular user of the tenant, not as a guest user. You must also have a contributor role on the Databricks workspace resource. You can grant a user access from the **Access control (IAM)** tab within your Databricks workspace in the Azure portal.

* This error might also occur if your email domain name is assigned to multiple directories in Azure AD. To work around this issue, create a new user in the directory that contains the subscription with your Databricks workspace.

    a. In the Azure portal, go to Azure AD. Select **Users and Groups** > **Add a user**.

    b. Add a user with an `@<tenant_name>.onmicrosoft.com` email instead of `@<your_domain>` email. You can find this in **Custom Domains**, under Azure AD in the Azure portal.
    
    c. Grant this new user the **Contributor** role on the Databricks workspace resource.
    
    d. Sign in to the Azure portal with the new user, and find the Databricks workspace.
    
    e. Launch the Databricks workspace as this user.


### Your account {email} has not been registered in Databricks 

#### Solution

If you did not create the workspace, and you are added as a user, contact the person who created the workspace. Have that person add you by using the Azure Databricks Admin Console. For instructions, see [Adding and managing users](https://docs.azuredatabricks.net/administration-guide/admin-settings/users.html). If you created the workspace and still you get this error, try selecting **Initialize Workspace** again from the Azure portal.

### Cloud provider launch failure while setting up the cluster

#### Error message

"Cloud Provider Launch Failure: A cloud provider error was encountered while setting up the cluster. See the Databricks guide for more information. Azure error code: PublicIPCountLimitReached. Azure error message: Cannot create more than 60 public IP addresses for this subscription in this region."

#### Solution

Databricks clusters use one public IP address per node. If your subscription has already used all its public IPs, you should [request to increase the quota](https://docs.microsoft.com/en-us/azure/azure-supportability/resource-manager-core-quotas-request). Choose **Quota** as the **Issue Type**, and **Networking: ARM** as the **Quota Type**. In **Details**, request a Public IP Address quota increase. For example, if your limit is currently 60, and you want to create a 100-node cluster, request a limit increase to 160.

### A second type of cloud provider launch failure while setting up the cluster

#### Error message

"Cloud Provider Launch Failure: A cloud provider error was encountered while setting up the cluster. See the Databricks guide for more information.
Azure error code: MissingSubscriptionRegistration
Azure error message: The subscription is not registered to use namespace 'Microsoft.Compute'. See https://aka.ms/rps-not-found for how to register subscriptions."

#### Solution

1. Go to the [Azure portal](https://portal.azure.com).
2. Select **Subscriptions**, the subscription you are using, and then **Resource providers**. 
3. In the list of resource providers, against **Microsoft.Compute**, select **Register**. You must have the contributor or owner role on the subscription to register the resource provider.

For more detailed instructions, see [Resource providers and types](../azure-resource-manager/resource-manager-supported-services.md).

## Next steps

- [Quickstart: Get started with Azure Databricks](quickstart-create-databricks-workspace-portal.md)
- [What is Azure Databricks?](what-is-azure-databricks.md)

