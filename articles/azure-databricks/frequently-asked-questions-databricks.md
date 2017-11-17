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
# Azure Databricks Preview: Common questions and help

This article lists the top queries you might have relate to Azure Databricks. It also lists some common issues you might run into while using Azure Databricks. For more information on Azure Databricks, see [What is Azure Databricks?](what-is-azure-databricks.md) 

## Common questions

This section lists the common questions related to Azure Databricks.

### Can I use my own keys for local encryption? 
In the current release, using your own keys from Azure Keyvault is not supported. 

### Can I use Azure VNETs with Azure Databricks?
A new VNET is created as part of Azure Databricks provisioning. As part of this release, you cannot use your own Azure VNET.

### How do I access Azure Data Lake Store from a notebook? 

1. In Azure Active Directory, provision a Service Principal and record its key.
2. Assign the necessary permissions to the Service Principal in Azure Data Lake Store.
3. To access a file in Azure Data Lake Store, use the Service Principal credentials in notebook.

For more information, see [Use Data Lake Store with Azure Databricks](https://docs.azuredatabricks.net/spark/latest/data-sources/azure/azure-storage.html#azure-data-lake-store).

## Troubleshooting

This section describes how to troubleshoot common issues with Azure Databricks.

### Issue: This subscription is not registered to use the namespace ‘Microsoft.Databricks’

**Error message**

This subscription is not registered to use the namespace ‘Microsoft.Databricks’. See https://aka.ms/rps-not-found for how to register subscriptions. (Code: MissingSubscriptionRegistration)

**Solution**

1. Go to [Azure portal](https://portal.azure.com).
2. Click **Subscriptions**,  the subscription you are using, and then click **Resource providers**. 
3. In the list of resource providers, against **Microsoft.Databricks**, click **Register**. You must have Contributor or Owner role on the subscription to register the resource provider.


### Issue: Your account {email} does not have Owner or Contributor role on the Databricks workspace resource in the Azure portal.

**Error message**

Your account {email} does not have Owner or Contributor role on the Databricks workspace resource in the Azure portal. This error can also occur if you are a guest user in the tenant. Ask your administrator to grant you access or add you as A user directly in the Databricks workspace. 

**Solution**

Following are a couple of solutions to this issue:

* To initialize the tenant, you must be logged in as a regular user of the tenant, not a guest user. You must also have Contributor role on the Databricks workspace resource. You can grant a user access from the **Access control (IAM)** tab within your Azure Databricks workspace in the Azure portal.

* This error may also occur if your email domain name is assigned to multiple Active Directories. To work around this issue, create a new user in the Active Directory containing the subscription with your Databricks workspace.
    a. In the Azure portal, go to Azure Active Directory, click **Users and Groups**, click **Add a user**.
    b. Add a user with an `@<tenant_name>.onmicrosoft.com` email instead of @<your_domain> email. You can find the <tenant_name>.onmicrosoft.com associated with your Active Directory in the **Custom Domains** under Azure Active Directory in the Azure portal.
    c. Grant this new user **Contributor** role on the Databricks workspace resource.
    d. Log in to the Azure portal with the new user and find the Databricks workspace.
    e. Launch the Databricks workspace as this user.


### Issue: Your account {email} has not been registered in Databricks 

**Solution**

If you did not create the workspace and you are added as a user of the workspace, contact the person that created the workspace to add you using the Azure Databricks Admin Console. For instructions, see [Adding and managing users](https://docs.azuredatabricks.net/administration-guide/admin-settings/users.html). If you created the workspace and still you get this error, try clicking “Initialize Workspace” again from the Azure portal.

### Issue: Cloud Provider Launch Failure (PublicIPCountLimitReached): A cloud provider error was encountered while setting up the cluster

**Error message**

Cloud Provider Launch Failure: A cloud provider error was encountered while setting up the cluster. See the Databricks guide for more information. Azure error code: PublicIPCountLimitReached. Azure error message: Cannot create more than 60 public IP addresses for this subscription in this region.

**Solution**

Azure Databricks clusters use one public IP Address per node. If your subscription has already used all its public IPs, you should [request to increase the quota](https://docs.microsoft.com/en-us/azure/azure-supportability/resource-manager-core-quotas-request). Choose **Quota** as the **Issue Type**, **Networking: ARM** as the **Quota Type**, and request a Public IP Address quota increase in **Details**. For example, if your limit is currently 60 and you want to create a 100 node cluster, request a limit increase to 160.

### Issue: Cloud Provider Launch Failure (MissingSubscriptionRegistration): A cloud provider error was encountered while setting up the cluster

**Error message**

Cloud Provider Launch Failure: A cloud provider error was encountered while setting up the cluster. See the Databricks guide for more information.
Azure error code: MissingSubscriptionRegistration
Azure error message: The subscription is not registered to use namespace 'Microsoft.Compute'. See https://aka.ms/rps-not-found for how to register subscriptions

**Solution**

1. Go to [Azure portal](https://portal.azure.com).
2. Click **Subscriptions**,  the subscription you are using, and then click **Resource providers**. 
3. In the list of resource providers, against **Microsoft.Compute**, click **Register**. You must have Contributor or Owner role on the subscription to register the resource provider.

See [Resource providers and types](../azure-resource-manager/resource-manager-supported-services.md) for more detailed instructions.

## Next steps
For step-by-step instructions to create a data factory of version 2, see the following tutorials:

- [Quickstart: Get started with Azure Databricks](quickstart-create-databricks-workspace-portal.md)
- [What is Azure Databricks?](what-is-azure-databricks.md)

