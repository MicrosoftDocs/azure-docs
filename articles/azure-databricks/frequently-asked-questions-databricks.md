---
title: 'Azure Databricks: Common questions and help'
description: Get answers to common questions and troubleshooting information about Azure Databricks.
services: azure-databricks
author: mamccrea 
ms.author: mamccrea
ms.reviewer: jasonh
ms.service: azure-databricks
ms.workload: big-data
ms.topic: conceptual
ms.date: 10/25/2018
---
# Frequently asked questions about Azure Databricks

This article lists the top questions you might have related to Azure Databricks. It also lists some common problems you might have while using Databricks. For more information, see [What is Azure Databricks](what-is-azure-databricks.md). 

## Can I use Azure Key Vault to store keys/secrets to be used in Azure Databricks?
Yes. You can use Azure Key Vault to store keys/secrets for use with Azure Databricks. For more information, see [Azure Key Vault-backed scopes](/azure/databricks/security/secrets/secret-scopes).


## Can I use Azure Virtual Networks with Databricks?
Yes. You can use an Azure Virtual Network (VNET) with Azure Databricks. For more information, see [Deploying Azure Databricks in your Azure Virtual Network](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject).

## How do I access Azure Data Lake Storage from a notebook? 

Follow these steps:
1. In Azure Active Directory (Azure AD), provision a service principal, and record its key.
1. Assign the necessary permissions to the service principal in Data Lake Storage.
1. To access a file in Data Lake Storage, use the service principal credentials in Notebook.

For more information, see [Use Azure Data Lake Storage with Azure Databricks](/azure/databricks/data/data-sources/azure/azure-datalake).

## Fix common problems

Here are a few problems you might encounter with Databricks.

### Issue: This subscription is not registered to use the namespace 'Microsoft.Databricks'

#### Error message

"This subscription is not registered to use the namespace 'Microsoft.Databricks'. See https://aka.ms/rps-not-found for how to register subscriptions. (Code: MissingSubscriptionRegistration)"

#### Solution

1. Go to the [Azure portal](https://portal.azure.com).
1. Select **Subscriptions**, the subscription you are using, and then **Resource providers**. 
1. In the list of resource providers, against **Microsoft.Databricks**, select **Register**. You must have the contributor or owner role on the subscription to register the resource provider.


### Issue: Your account {email} does not have the owner or contributor role on the Databricks workspace resource in the Azure portal

#### Error message

"Your account {email} does not have Owner or Contributor role on the Databricks workspace resource in the Azure portal. This error can also occur if you are a guest user in the tenant. Ask your administrator to grant you access or add you as a user directly in the Databricks workspace." 

#### Solution

The following are a couple of solutions to this issue:

* To initialize the tenant, you must be signed in as a regular user of the tenant, not as a guest user. You must also have a contributor role on the Databricks workspace resource. You can grant a user access from the **Access control (IAM)** tab within your Databricks workspace in the Azure portal.

* This error might also occur if your email domain name is assigned to multiple directories in Azure AD. To work around this issue, create a new user in the directory that contains the subscription with your Databricks workspace.

    a. In the Azure portal, go to Azure AD. Select **Users and Groups** > **Add a user**.

    b. Add a user with an `@<tenant_name>.onmicrosoft.com` email instead of `@<your_domain>` email. You can find this option in **Custom Domains**, under Azure AD in the Azure portal.
    
    c. Grant this new user the **Contributor** role on the Databricks workspace resource.
    
    d. Sign in to the Azure portal with the new user, and find the Databricks workspace.
    
    e. Launch the Databricks workspace as this user.


### Issue: Your account {email} has not been registered in Databricks 

#### Solution

If you did not create the workspace, and you are added as a user, contact the person who created the workspace. Have that person add you by using the Azure Databricks Admin Console. For instructions, see [Adding and managing users](/azure/databricks/administration-guide/users-groups/users). If you created the workspace and still you get this error, try selecting **Initialize Workspace** again from the Azure portal.

### Issue: Cloud provider launch failure while setting up the cluster (PublicIPCountLimitReached)

#### Error message

"Cloud Provider Launch Failure: A cloud provider error was encountered while setting up the cluster. For more information, see the Databricks guide. Azure error code: PublicIPCountLimitReached. Azure error message: Cannot create more than 10 public IP addresses for this subscription in this region."

#### Background

Databricks clusters use one public IP address per node (including the driver node). Azure subscriptions have [public IP address limits](/azure/azure-resource-manager/management/azure-subscription-service-limits#publicip-address) per region. Thus, cluster creation and scale-up operations may fail if they would cause the number of public IP addresses allocated to that subscription in that region to exceed the limit. This limit also includes public IP addresses allocated for non-Databricks usage, such as custom user-defined VMs.

In general, clusters only consume public IP addresses while they are active. However, `PublicIPCountLimitReached` errors may continue to occur for a short period of time even after other clusters are terminated. This is because Databricks temporarily caches Azure resources when a cluster is terminated. Resource caching is by design, since it significantly reduces the latency of cluster startup and autoscaling in many common scenarios.

#### Solution

If your subscription has already reached its public IP address limit for a given region, then you should do one or the other of the following.

- Create new clusters in a different Databricks workspace. The other workspace must be located in a region in which you have not reached your subscription's public IP address limit.
- [Request to increase your public IP address limit](https://docs.microsoft.com/azure/azure-portal/supportability/resource-manager-core-quotas-request). Choose **Quota** as the **Issue Type**, and **Networking: ARM** as the **Quota Type**. In **Details**, request a Public IP Address quota increase. For example, if your limit is currently 60, and you want to create a 100-node cluster, request a limit increase to 160.

### Issue: A second type of cloud provider launch failure while setting up the cluster (MissingSubscriptionRegistration)

#### Error message

"Cloud Provider Launch Failure: A cloud provider error was encountered while setting up the cluster. For more information, see the Databricks guide.
Azure error code: MissingSubscriptionRegistration
Azure error message: The subscription is not registered to use namespace 'Microsoft.Compute'. See https://aka.ms/rps-not-found for how to register subscriptions."

#### Solution

1. Go to the [Azure portal](https://portal.azure.com).
1. Select **Subscriptions**, the subscription you are using, and then **Resource providers**. 
1. In the list of resource providers, against **Microsoft.Compute**, select **Register**. You must have the contributor or owner role on the subscription to register the resource provider.

For more detailed instructions, see [Resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

### Issue: Azure Databricks needs permissions to access resources in your organization that only an admin can grant.

#### Background

Azure Databricks is integrated with Azure Active Directory. You can set permissions within Azure Databricks (for example, on notebooks or clusters) by specifying users from Azure AD. For Azure Databricks to be able to list the names of the users from your Azure AD, it requires read permission to that information and consent to be given. If the consent is not already available, you see the error.

#### Solution

Log in as a global administrator to the Azure portal. For Azure Active Directory, go to the **User Settings** tab and make sure **Users can consent to apps accessing company data on their behalf** is set to **Yes**.

## Next steps

- [Quickstart: Get started with Azure Databricks](quickstart-create-databricks-workspace-portal.md)
- [What is Azure Databricks?](what-is-azure-databricks.md)
