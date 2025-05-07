---
title: Deploy Australian Government ISM PROTECTED blueprint sample
description: Deploy steps for the Australian Government ISM PROTECTED blueprint sample including blueprint artifact parameter details.
ms.date: 09/07/2023
ms.topic: sample
---
# Deploy the Australian Government ISM PROTECTED blueprint sample

[!INCLUDE [Blueprints deprecation note](../../../../../includes/blueprints-deprecation-note.md)]

To deploy the Azure Blueprints ISM PROTECTED blueprint sample, the following steps must be taken:

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

1. Find the **ISM PROTECTED** blueprint sample under _Other Samples_ and select **Use this sample**.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the ISM PROTECTED blueprint sample.
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
away from alignment with ISM PROTECTED controls.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find your copy of the
   blueprint sample and then select it.

1. Select **Publish blueprint** at the top of the page. In the new page on the right, provide a
   **Version** for your copy of the blueprint sample. This property is useful for if you make a
   modification later. Provide **Change notes** such as "First version published from the ISM
   PROTECTED blueprint sample." Then select **Publish** at the bottom of the page.

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
     - **Location**: Select a region for the managed identity to be created in. Azure Blueprints uses
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
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Log Analytics workspace ID that VMs should be configured for|This is the ID (GUID) of the Log Analytics workspace that the VMs should be configured for.|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|List of resource types that should have diagnostic logs enabled|List of resource types to audit if diagnostic log setting is not enabled. Acceptable values can be found at [Azure Monitor resource logs categories](/azure/azure-monitor/essentials/resource-logs-categories#supported-log-categories-per-resource-type).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|List of users that should be excluded from Windows VM Administrators group|A semicolon-separated list of members that should be excluded in the Administrators local group. Ex: Administrator; myUser1; myUser2|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|List of users that should be included in Windows VM Administrators group|A semicolon-separated list of members that should be included in the Administrators local group. Ex: Administrator; myUser1; myUser2|
|\[Preview\]: Deploy Log Analytics Agent for Linux VM Scale Sets (VMSS)|Policy assignment|Log Analytics workspace for Linux VM Scale Sets (VMSS)|If this workspace is outside of the scope of the assignment you must manually grant 'Log Analytics Contributor' permissions (or similar) to the policy assignment's principal ID.|
|\[Preview\]: Deploy Log Analytics Agent for Linux VM Scale Sets (VMSS)|Policy assignment|Optional: List of VM images that have supported Linux OS to add to scope|An empty array may be used to indicate no optional parameters: \[\]|
|\[Preview\]: Deploy Log Analytics Agent for Linux VMs|Policy assignment|Log Analytics workspace for Linux VMs|If this workspace is outside of the scope of the assignment you must manually grant 'Log Analytics Contributor' permissions (or similar) to the policy assignment's principal ID.|
|\[Preview\]: Deploy Log Analytics Agent for Linux VMs|Policy assignment|Optional: List of VM images that have supported Linux OS to add to scope|An empty array may be used to indicate no optional parameters: \[\]|
|\[Preview\]: Deploy Log Analytics Agent for Windows VM Scale Sets (VMSS)|Policy assignment|Log Analytics workspace for Windows VM Scale Sets (VMSS)|If this workspace is outside of the scope of the assignment you must manually grant 'Log Analytics Contributor' permissions (or similar) to the policy assignment's principal ID.|
|\[Preview\]: Deploy Log Analytics Agent for Windows VM Scale Sets (VMSS)|Policy assignment|Optional: List of VM images that have supported Windows OS to add to scope|An empty array may be used to indicate no optional parameters: \[\]|
|\[Preview\]: Deploy Log Analytics Agent for Windows VMs|Policy assignment|Log Analytics workspace for Windows VMs|If this workspace is outside of the scope of the assignment you must manually grant 'Log Analytics Contributor' permissions (or similar) to the policy assignment's principal ID.|
|\[Preview\]: Deploy Log Analytics Agent for Windows VMs|Policy assignment|Optional: List of VM images that have supported Windows OS to add to scope|An empty array may be used to indicate no optional parameters: \[\]|
|Deploy Advanced Threat Protection on Storage Accounts|Policy assignment|Effect|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|Deploy Auditing on SQL servers|Policy assignment|The value in days of the retention period (0 indicates unlimited retention) |Retention days (optional, 180 days if unspecified) |
|Deploy Auditing on SQL servers|Policy assignment|Resource group name for storage account for SQL server auditing|Auditing writes database events to an audit log in your Azure Storage account (a storage account will be created in each region where a SQL Server is created that will be shared by all servers in that region). Important - for proper operation of Auditing do not delete or rename the resource group or the storage accounts.|
|Deploy diagnostic settings for Network Security Groups|Policy assignment|Storage account prefix for network security group diagnostics|This prefix will be combined with the network security group location to form the created storage account name.|
|Deploy diagnostic settings for Network Security Groups|Policy assignment|Resource group name for storage account for network security group diagnostics (must exist) |The resource group that the storage account will be created in. This resource group must already exist.|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Allowed locations for resources and resource groups|List of Azure locations that your organization can specify when deploying resources. This provided value is also used by the 'Allowed locations' policy within the policy initiative.|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Vulnerability assessment should be enabled on your SQL managed instances|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Vulnerability assessment should be enabled on your SQL servers|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Vulnerability assessment should be enabled on Virtual Machines|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Geo-redundant storage should be enabled for Storage Accounts|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Geo-redundant backup should be enabled for Azure Database for MariaDB|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Geo-redundant backup should be enabled for Azure Database for MySQL|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Geo-redundant backup should be enabled for Azure Database for PostgreSQL|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Network Security Group rules for internet facing virtual machines should be hardened|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Web Application should only be accessible over HTTPS|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Function App should only be accessible over HTTPS|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|External accounts with write permissions should be removed from your subscription|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|External accounts with read permissions should be removed from your subscription|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|External accounts with owner permissions should be removed from your subscription|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Deprecated accounts with owner permissions should be removed from your subscription|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Deprecated accounts should be removed from your subscription|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|CORS shouldn't allow every resource to access your Web Application|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|System updates on virtual machine scale sets should be installed|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|MFA should be enabled on accounts with read permissions on your subscription|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|MFA should be enabled on accounts with owner permissions on your subscription|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|MFA should be enabled on accounts with write permissions on your subscription|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Long-term geo-redundant backup should be enabled for Azure SQL Databases|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|List of users excluded from Windows VM Administrators group|A semicolon-separated list of members that should be excluded in the Administrators local group. Ex: Administrator; myUser1; myUser2|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Log Analytics Workspace Id that VMs should be configured for|This is the ID (GUID) of the Log Analytics workspace that the VMs should be configured for.|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Adaptive Network Hardening recommendations should be applied on internet facing virtual machines|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|There should be more than one owner assigned to your subscription|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Disk encryption should be applied on virtual machines| Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Remote debugging should be turned off for Function App|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Transparent Data Encryption on SQL databases should be enabled| Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Vulnerability assessment should be enabled on your SQL managed instances|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|An Azure Active Directory administrator should be provisioned for SQL servers|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Only secure connections to your Redis Cache should be enabled|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Endpoint protection solution should be installed on virtual machine scale sets |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Optional: List of VM images that have supported Windows OS to add to scope|An empty array may be used to indicate no optional parameters: []
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Optional: List of VM images that have supported Linux OS to add to scope |An empty array may be used to indicate no optional parameters: []|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Audit unrestricted network access to storage accounts|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Vulnerabilities in security configuration on your virtual machine scale sets should be remediated|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Secure transfer to storage accounts should be enabled  |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Adaptive Application Controls should be enabled on virtual machines|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|A maximum of 3 owners should be designated for your subscription|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|[Preview] Vulnerability Assessment should be enabled on Virtual Machines  |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|CORS should not allow every resource to access your Web Application|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|External accounts with write permissions should be removed from your subscription | 	Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Deprecated accounts should be removed from your subscription |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Function App should only be accessible over HTTPS v2  |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Vulnerabilities should be remediated by a Vulnerability Assessment solution  |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Azure subscriptions should have a log profile for Activity Log  |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|List of resource types that should have diagnostic logs enabled|List of resource types to audit if diagnostic log setting is not enabled. Acceptable values can be found at [Azure Monitor resource logs categories](/azure/azure-monitor/essentials/resource-logs-categories#supported-log-categories-per-resource-type).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|System updates should be installed on your machines|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Latest TLS version should be used for App Service|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|MFA should be enabled accounts with write permissions on your subscription|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Microsoft IaaSAntimalware extension should be deployed on Windows servers|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md). |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Web Application should only be accessible over HTTPS v2  |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md). |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|DDoS Protection should be enabled  |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md). |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|MFA should be enabled on accounts with owner permissions on your subscription |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Advanced data security should be enabled on your SQL servers |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Advanced data security should be enabled on your SQL managed instances |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Monitor missing endpoint protection in Azure Security Center  |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Just-in-time network access control should be applied on virtual machines |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Service Fabric clusters should only use Azure Active Directory for client authentication |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|App Service should only be accessible over HTTPS v2 |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|System updates on virtual machine scale sets should be installed  |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Remote debugging should be turned off for Web Application|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Vulnerabilities in security configuration on your machines should be remediated  |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md).|
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|MFA should be enabled on accounts with read permissions on your subscription  |Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md). |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Enforce password history  | Specifies limits on password reuse - how many times a new password must be created for a user account before the password can be repeated. |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Maximum password age  | Specifies the maximum number of days that may elapse before a user account password must be changed. The format of the value is two integers separated by a comma, denoting an inclusive range. |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Minimum password age | 	Specifies the minimum number of days that must elapse before a user account password can be changed. |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Minimum password length  | Specifies the minimum number of characters that a user account password may contain. |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Password must meet complexity requirements|Specifies whether a user account password must be complex. If required, a complex password must not contain part of user's account name or full name; be at least 6 characters long; contain a mix of uppercase, lowercase, number, and non-alphabetic characters. |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Vulnerabilities in container security configurations should be remediated|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md). |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Remote debugging should be turned off for App Service|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md). |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Deprecated accounts with owner permissions should be removed from your subscription|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md). |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Vulnerability assessment should be enabled on your SQL servers|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md). |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Latest TLS version should be used in your Web App|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md). |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Internet-facing virtual machines should be protected with Network Security Groups|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md). |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|External accounts with owner permissions should be removed from your subscription|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md). |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Latest TLS version should be used in your Function App|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md). |
|\[Preview\]: Audit Australian Government ISM PROTECTED controls and deploy specific VM Extensions to support audit requirements|Policy assignment|Vulnerabilities on your SQL databases should be remediated|Information about policy effects can be found at [Understand Azure Policy Effects](../../../policy/concepts/effects.md). |

## Next steps

Now that you've reviewed the steps to deploy the Australian Government ISM PROTECTED blueprint
sample, visit the following articles to learn about the blueprint and control mapping:

> [!div class="nextstepaction"]
> [ISM PROTECTED blueprint - Overview](./index.md)
> [ISM PROTECTED blueprint - Control mapping](./control-mapping.md)

Addition articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../../concepts/resource-locking.md).
- Learn how to [update existing assignments](../../how-to/update-existing-assignments.md).
