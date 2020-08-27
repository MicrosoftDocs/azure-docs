---
title: DoD Impact Level 5 blueprint sample
description: Deploy steps for the DoD Impact Level 5 blueprint sample including blueprint artifact parameter details.
ms.date: 06/30/2020
ms.topic: sample
---
# Deploy the DoD Impact Level 5 blueprint sample

To deploy the Azure Blueprints Department of Defense Impact Level 5 (DoD IL5) blueprint sample, the following steps must be taken:

> [!div class="checklist"]
> - Create a new blueprint from the sample
> - Mark your copy of the sample as **Published**
> - Assign your copy of the blueprint to an existing subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free)
before you begin.

## Create blueprint from sample

First, implement the blueprint sample by creating a new blueprint in your environment using the
sample as a starter.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. From the **Getting started** page on the left, select the **Create** button under _Create a
   blueprint_.

1. Find the **DoD Impact Level 5** blueprint sample under _Other Samples_ and select **Use this sample**.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the DoD Impact Level 5 blueprint sample.
   - **Definition location**: Use the ellipsis and select the management group to save your copy of
     the sample to.

1. Select the _Artifacts_ tab at the top of the page or **Next: Artifacts** at the bottom of the
   page.

1. Review the list of artifacts that make up the blueprint sample. Many of the artifacts have
   parameters that we'll define later. Select **Save Draft** when you've finished reviewing the
   blueprint sample.

## Publish the sample copy

Your copy of the blueprint sample has now been created in your environment. It's created in
**Draft** mode and must be **Published** before it can be assigned and deployed. The copy of the
blueprint sample can be customized to your environment and needs, but that modification may move it
away from alignment with DoD Impact Level 5 controls.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find your copy of the
   blueprint sample and then select it.

1. Select **Publish blueprint** at the top of the page. In the new page on the right, provide a
   **Version** for your copy of the blueprint sample. This property is useful for if you make a
   modification later. Provide **Change notes** such as "First version published from the DoD
   IL5 blueprint sample." Then select **Publish** at the bottom of the page.

## Assign the sample copy

Once the copy of the blueprint sample has been successfully **Published**, it can be assigned to a
subscription within the management group it was saved to. This step is where parameters are
provided to make each deployment of the copy of the blueprint sample unique.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find your copy of the
   blueprint sample and then select it.

1. Select **Assign blueprint** at the top of the blueprint definition page.

1. Provide the parameter values for the blueprint assignment:

   - Basics

     - **Subscriptions**: Select one or more of the subscriptions that are in the management group
       you saved your copy of the blueprint sample to. If you select more than one subscription, an
       assignment will be created for each using the parameters entered.
     - **Assignment name**: The name is pre-populated for you based on the name of the blueprint.
       Change as needed or leave as is.
     - **Location**: Select a region for the managed identity to be created in. Azure Blueprint uses
       this managed identity to deploy all artifacts in the assigned blueprint. To learn more, see
       [managed identities for Azure resources](../../../../active-directory/managed-identities-azure-resources/overview.md).
     - **Blueprint definition version**: Pick a **Published** version of your copy of the blueprint
       sample.

   - Lock Assignment

     Select the blueprint lock setting for your environment. For more information, see
     [blueprints resource locking](../../concepts/resource-locking.md).

   - Managed Identity

     Leave the default _system assigned_ managed identity option.

   - Artifact parameters

     The parameters defined in this section apply to the artifact under which it's defined. These
     parameters are [dynamic parameters](../../concepts/parameters.md#dynamic-parameters) since
     they're defined during the assignment of the blueprint. For a full list or artifact parameters
     and their descriptions, see [Artifact parameters table](#artifact-parameters-table).

1. Once all parameters have been entered, select **Assign** at the bottom of the page. The blueprint
   assignment is created and artifact deployment begins. Deployment takes roughly an hour. To check
   on the status of deployment, open the blueprint assignment.

> [!WARNING]
> The Azure Blueprints service and the built-in blueprint samples are **free of cost**. Azure
> resources are [priced by product](https://azure.microsoft.com/pricing/). Use the
> [pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate the cost of
> running resources deployed by this blueprint sample.

## Artifact parameters table

The following table provides a list of the blueprint artifact parameters:

|Artifact name|Artifact type|Parameter name|Description|
|-|-|-|-|
|DoD Impact Level 5|Policy Assignment|List of users that must be included in Windows VM Administrators group|A semicolon-separated list of users that should be included in the Administrators local group; Ex: Administrator; myUser1; myUser2|
|DoD Impact Level 5|Policy Assignment|List of users excluded from Windows VM Administrators group|A semicolon-separated list of users that should be excluded in the Administrators local group; Ex: Administrator; myUser1; myUser2|
|DoD Impact Level 5|Policy Assignment|List of resource types that should have diagnostic logs enabled||
|DoD Impact Level 5|Policy Assignment|Log Analytics workspace ID for VM agent reporting|ID (GUID) of the Log Analytics workspace where VMs agents should report|
|DoD Impact Level 5|Policy Assignment|List of regions where Network Watcher should be enabled|To see a complete list of regions use Get-AzLocation,|
|DoD Impact Level 5|Policy Assignment|Minimum TLS version for Windows web servers|The minimum TLS protocol version that should be enabled on Windows web servers|
|DoD Impact Level 5|Policy Assignment|Latest PHP version|Latest supported PHP version for App Services|
|DoD Impact Level 5|Policy Assignment|Latest Java version|Latest supported Java version for App Services|
|DoD Impact Level 5|Policy Assignment|Latest Windows Python version|Latest supported Python version for App Services|
|DoD Impact Level 5|Policy Assignment|Latest Linux Python version|Latest supported Python version for App Services|
|DoD Impact Level 5|Policy Assignment|Optional: List of Windows VM images that support Log Analytics agent to add to audit scope|A semicolon-separated list of images; Ex: /subscriptions/<subscriptionId>/resourceGroups/YourResourceGroup/providers/Microsoft.Compute/images/ContosoStdImage|
|DoD Impact Level 5|Policy Assignment|Optional: List of Linux VM images that support Log Analytics agent to add to audit scope|A semicolon-separated list of images; Ex: /subscriptions/<subscriptionId>/resourceGroups/YourResourceGroup/providers/Microsoft.Compute/images/ContosoStdImage|
|DoD Impact Level 5|Policy Assignment|Effect for policy: There should be more than one owner assigned to your subscription|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Disk encryption should be applied on virtual machines|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Email notification to subscription owner for high severity alerts should be enabled|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Remote debugging should be turned off for Function Apps|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Ensure that '.NET Framework' version is the latest, if used as a part of the Function App|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Transparent Data Encryption on SQL databases should be enabled|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Vulnerability assessment should be enabled on your SQL managed instances|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Ensure that 'PHP version' is the latest, if used as a part of the Api app|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: An Azure Active Directory administrator should be provisioned for SQL servers|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Only secure connections to your Redis Cache should be enabled|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Endpoint protection solution should be installed on virtual machine scale sets|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Audit unrestricted network access to storage accounts|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Advanced data security settings for SQL managed instance should contain an email address to receive security alerts|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Vulnerabilities in security configuration on your virtual machine scale sets should be remediated|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Secure transfer to storage accounts should be enabled|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Adaptive Application Controls should be enabled on virtual machines|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Geo-redundant backup should be enabled for Azure Database for PostgreSQL|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Ensure that 'Java version' is the latest, if used as a part of the Web app|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: A maximum of 3 owners should be designated for your subscription|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: A security contact email address should be provided for your subscription|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: CORS should not allow every resource to access your Web Applications|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: External accounts with write permissions should be removed from your subscription|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: External accounts with read permissions should be removed from your subscription|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Deprecated accounts should be removed from your subscription|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Function App should only be accessible over HTTPS|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Ensure that 'Python version' is the latest, if used as a part of the Web app|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Ensure that 'Python version' is the latest, if used as a part of the Function app|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Ensure that 'PHP version' is the latest, if used as a part of the WEB app|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Ensure that 'Python version' is the latest, if used as a part of the Api app|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Vulnerabilities should be remediated by a Vulnerability Assessment solution|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Geo-redundant backup should be enabled for Azure Database for MySQL|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Ensure that '.NET Framework' version is the latest, if used as a part of the Web app|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: System updates should be installed on your machines|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Ensure that 'Java version' is the latest, if used as a part of the Api app|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Ensure that 'HTTP Version' is the latest, if used to run the Web app|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Latest TLS version should be used in your API App|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: MFA should be enabled accounts with write permissions on your subscription|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Advanced data security settings for SQL server should contain an email address to receive security alerts|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Ensure that 'HTTP Version' is the latest, if used to run the Api app|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Microsoft IaaSAntimalware extension should be deployed on Windows servers|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Ensure that 'Java version' is the latest, if used as a part of the Function app|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Access through Internet facing endpoint should be restricted|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Security Center standard pricing tier should be selected|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Audit usage of custom RBAC rules|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Web Application should only be accessible over HTTPS|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Auditing on SQL server should be enabled|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: The Log Analytics agent should be installed on virtual machines|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: DDoS Protection Standard should be enabled|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: MFA should be enabled on accounts with owner permissions on your subscription|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Ensure that 'PHP version' is the latest, if used as a part of the Function app|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Advanced data security should be enabled on your SQL servers|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Advanced data security should be enabled on your SQL managed instances|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Email notifications to admins and subscription owners should be enabled in SQL managed instance advanced data security settings|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Monitor missing Endpoint Protection in Azure Security Center|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Just-In-Time network access control should be applied on virtual machines|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: A security contact phone number should be provided for your subscription|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Service Fabric clusters should only use Azure Active Directory for client authentication|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: API App should only be accessible over HTTPS|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Advanced Threat Protection types should be set to 'All' in SQL managed instance Advanced Data Security settings|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Geo-redundant storage should be enabled for Storage Accounts|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Ensure that '.NET Framework' version is the latest, if used as a part of the API app|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: System updates on virtual machine scale sets should be installed|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Email notifications to admins and subscription owners should be enabled in SQL server advanced data security settings|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Remote debugging should be turned off for Web Applications|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Long-term geo-redundant backup should be enabled for Azure SQL Databases|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Vulnerabilities in security configuration on your machines should be remediated|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Ensure that 'HTTP Version' is the latest, if used to run the Function app|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: MFA should be enabled on accounts with read permissions on your subscription|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Advanced Threat Protection types should be set to 'All' in SQL server Advanced Data Security settings|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Vulnerabilities in container security configurations should be remediated|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Remote debugging should be turned off for API Apps|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Deprecated accounts with owner permissions should be removed from your subscription|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Vulnerability assessment should be enabled on your SQL servers|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: The Log Analytics agent should be installed on Virtual Machine Scale Sets|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Latest TLS version should be used in your Web App|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: External accounts with owner permissions should be removed from your subscription|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Latest TLS version should be used in your Function App|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: [Preview]: Kubernetes Services should be upgraded to a non-vulnerable Kubernetes version|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|
|DoD Impact Level 5|Policy Assignment|Effect for policy: Vulnerabilities on your SQL databases should be remediated|Azure Policy effect for this policy; for more information about effects, visit https://aka.ms/policyeffects|

## Next steps

Now that you've reviewed the steps to deploy the DoD Impact Level 5 blueprint sample, visit the following
articles to learn about the blueprint and control mapping:

> [!div class="nextstepaction"]
> [DoD Impact Level 5 blueprint - Overview](./index.md)
> [DoD Impact Level 5 blueprint - Control mapping](./control-mapping.md)

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).