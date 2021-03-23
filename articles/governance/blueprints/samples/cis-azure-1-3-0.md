---
title: CIS Microsoft Azure Foundations Benchmark v1.3.0 blueprint sample
description: Overview of the CIS Microsoft Azure Foundations Benchmark v1.3.0 blueprint sample. This blueprint sample helps customers assess specific controls.
ms.date: 03/11/2021
ms.topic: sample
---
# CIS Microsoft Azure Foundations Benchmark v1.3.0 blueprint sample

The CIS Microsoft Azure Foundations Benchmark v1.3.0 blueprint sample provides governance
guard-rails using [Azure Policy](../../policy/overview.md) that help you assess specific CIS
Microsoft Azure Foundations Benchmark v1.3.0 recommendations. This blueprint helps customers deploy
a core set of policies for any Azure-deployed architecture that must implement CIS Microsoft Azure
Foundations Benchmark v1.3.0 recommendations.

## Recommendation mapping

The [Azure Policy recommendation mapping](../../policy/samples/cis-azure-1-3-0.md) provides details
on policy definitions included within this blueprint and how these policy definitions map to the
**recommendations** in CIS Microsoft Azure Foundations Benchmark v1.3.0. When assigned to an
architecture, resources are evaluated by Azure Policy for non-compliance with assigned policy
definitions. For more information, see [Azure Policy](../../policy/overview.md).

## Deploy

To deploy the Azure Blueprints CIS Microsoft Azure Foundations Benchmark v1.3.0 blueprint sample,
the following steps must be taken:

> [!div class="checklist"]
> - Create a new blueprint from the sample
> - Mark your copy of the sample as **Published**
> - Assign your copy of the blueprint to an existing subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free)
before you begin.

### Create blueprint from sample

First, implement the blueprint sample by creating a new blueprint in your environment using the
sample as a starter.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. From the **Getting started** page on the left, select the **Create** button under _Create a
   blueprint_.

1. Find the **CIS Microsoft Azure Foundations Benchmark v1.3.0** blueprint sample under _Other
   Samples_ and select **Use this sample**.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the CIS Microsoft Azure Foundations
     Benchmark blueprint sample.
   - **Definition location**: Use the ellipsis and select the management group to save your copy of
     the sample to.

1. Select the _Artifacts_ tab at the top of the page or **Next: Artifacts** at the bottom of the
   page.

1. Review the list of artifacts that are included in the blueprint sample. Many of the artifacts
   have parameters that we'll define later. Select **Save Draft** when you've finished reviewing the
   blueprint sample.

### Publish the sample copy

Your copy of the blueprint sample has now been created in your environment. It's created in
**Draft** mode and must be **Published** before it can be assigned and deployed. The copy of the
blueprint sample can be customized to your environment and needs, but that modification may move it
away from alignment with CIS Microsoft Azure Foundations Benchmark v1.3.0 recommendations.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find your copy of the
   blueprint sample and then select it.

1. Select **Publish blueprint** at the top of the page. In the new page on the right, provide a
   **Version** for your copy of the blueprint sample. This property is useful for if you make a
   modification later. Provide **Change notes** such as "First version published from the CIS
   Microsoft Azure Foundations Benchmark blueprint sample." Then select **Publish** at the bottom of
   the page.

### Assign the sample copy

Once the copy of the blueprint sample has been successfully **Published**, it can be assigned to a
subscription within the management group it was saved to. This step is where parameters are provided
to make each deployment of the copy of the blueprint sample unique.

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
       [managed identities for Azure resources](../../../active-directory/managed-identities-azure-resources/overview.md).
     - **Blueprint definition version**: Pick a **Published** version of your copy of the blueprint
       sample.

   - Lock Assignment

     Select the blueprint lock setting for your environment. For more information, see
     [blueprints resource locking](../concepts/resource-locking.md).

   - Managed Identity

     Leave the default _system assigned_ managed identity option.

   - Artifact parameters

     The parameters defined in this section apply to the artifact under which it's defined. These
     parameters are [dynamic parameters](../concepts/parameters.md#dynamic-parameters) since
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

### Artifact parameters table

The following table provides a list of the blueprint artifact parameters:

|Artifact name|Artifact type|Parameter name|Description|
|-|-|-|-|
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|List of virtual machine extensions that are approved for use|A semicolon-separated list of virtual machine extensions; to see a complete list of extensions, use the Azure PowerShell command Get-AzVMExtensionImage|
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: SQL managed instances should use customer-managed keys to encrypt data at rest|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Diagnostic logs in Azure Data Lake Store should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Disk encryption should be applied on virtual machines|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Key vault should have purge protection enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Ensure API app has 'Client Certificates (Incoming client certificates)' set to 'On'|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: SQL servers should use customer-managed keys to encrypt data at rest|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Managed identity should be used in your Function App|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Azure Defender for Key Vault should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Custom subscription owner roles should not exist|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Keys should have expiration dates set|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Transparent Data Encryption on SQL databases should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Vulnerability assessment should be enabled on SQL Managed Instance|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Ensure that 'PHP version' is the latest, if used as a part of the API app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: An Azure Active Directory administrator should be provisioned for SQL servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Azure Defender for App Service should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Storage accounts should restrict network access using virtual network rules|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Managed identity should be used in your Web App|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: SSH access from the Internet should be blocked|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Unattached disks should be encrypted|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Azure Defender for Storage should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Storage accounts should restrict network access|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Diagnostic logs in Logic Apps should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Diagnostic logs in IoT Hub should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: FTPS only should be required in your Function App|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: An activity log alert should exist for specific Security operations (Microsoft.Security/securitySolutions/delete)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: An activity log alert should exist for specific Security operations (Microsoft.Security/securitySolutions/write)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Secure transfer to storage accounts should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Diagnostic logs in Batch accounts should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Auto provisioning of the Log Analytics agent should be enabled on your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Ensure that 'Java version' is the latest, if used as a part of the Web app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: FTPS should be required in your Web App|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Azure Defender for servers should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Subscriptions should have a contact email address for security issues|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Storage account public access should be disallowed|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Azure Defender for Kubernetes should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Connection throttling should be enabled for PostgreSQL database servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Ensure WEB app has 'Client Certificates (Incoming client certificates)' set to 'On'|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: External accounts with write permissions should be removed from your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: External accounts with read permissions should be removed from your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Azure Defender for SQL servers on machines should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Email notification for high severity alerts should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Storage account should use customer-managed key for encryption|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Ensure that 'Python version' is the latest, if used as a part of the Web app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Ensure that 'Python version' is the latest, if used as a part of the Function app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Ensure that 'PHP version' is the latest, if used as a part of the WEB app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Ensure that 'Python version' is the latest, if used as a part of the API app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Diagnostic logs in Virtual Machine Scale Sets should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Azure Defender for Azure SQL Database servers should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Diagnostic logs in Event Hub should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: System updates should be installed on your machines|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Ensure that 'Java version' is the latest, if used as a part of the API app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: SQL servers should be configured with 90 days auditing retention or higher.|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Ensure that 'HTTP Version' is the latest, if used to run the Web app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Latest TLS version should be used in your API App|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: MFA should be enabled accounts with write permissions on your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Authentication should be enabled on your web app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Secrets should have expiration dates set|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Ensure that 'HTTP Version' is the latest, if used to run the API app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: FTPS only should be required in your API App|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Ensure that 'Java version' is the latest, if used as a part of the Function app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Web Application should only be accessible over HTTPS|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Auditing on SQL server should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: MFA should be enabled on accounts with owner permissions on your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Advanced data security should be enabled on your SQL servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Advanced data security should be enabled on SQL Managed Instance|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Role-Based Access Control (RBAC) should be used on Kubernetes Services|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Monitor missing Endpoint Protection in Azure Security Center|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Diagnostic logs in Search services should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Diagnostic logs in App Services should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: An activity log alert should exist for specific Administrative operations (Microsoft.Network/networkSecurityGroups/delete)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: An activity log alert should exist for specific Administrative operations (Microsoft.Network/networkSecurityGroups/securityRules/delete)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: An activity log alert should exist for specific Administrative operations (Microsoft.Network/networkSecurityGroups/securityRules/write)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: An activity log alert should exist for specific Administrative operations (Microsoft.Network/networkSecurityGroups/write)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: An activity log alert should exist for specific Administrative operations (Microsoft.Sql/servers/firewallRules/delete)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: An activity log alert should exist for specific Administrative operations (Microsoft.Sql/servers/firewallRules/write)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Only approved VM extensions should be installed|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Azure Defender for container registries should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Managed identity should be used in your API App|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Authentication should be enabled on your API app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: An activity log alert should exist for specific Policy operations (Microsoft.Authorization/policyAssignments/delete)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: An activity log alert should exist for specific Policy operations (Microsoft.Authorization/policyAssignments/write)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Authentication should be enabled on your Function app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Diagnostic logs in Data Lake Analytics should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Storage accounts should allow access from trusted Microsoft services|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Diagnostic logs in Key Vault should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Enforce SSL connection should be enabled for PostgreSQL database servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Ensure that 'HTTP Version' is the latest, if used to run the Function app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: MFA should be enabled on accounts with read permissions on your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: RDP access from the Internet should be blocked|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Enforce SSL connection should be enabled for MySQL database servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Ensure Function app has 'Client Certificates (Incoming client certificates)' set to 'On'|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Log checkpoints should be enabled for PostgreSQL database servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Log connections should be enabled for PostgreSQL database servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Disconnections should be logged for PostgreSQL database servers.|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Vulnerability assessment should be enabled on your SQL servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Latest TLS version should be used in your Web App|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: External accounts with owner permissions should be removed from your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Diagnostic logs in Service Bus should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Diagnostic logs in Azure Stream Analytics should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Latest TLS version should be used in your Function App|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Effect for policy: Storage account containing the container with activity logs must be encrypted with BYOK|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Include AKS clusters when auditing if virtual machine scale set diagnostic logs are enabled||
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Latest Java version for App Services|Latest supported Java version for App Services|
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Latest Python version for Linux for App Services|Latest supported Python version for App Services|
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|List of regions where Network Watcher should be enabled|To see a complete list of regions, run the PowerShell command Get-AzLocation|
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Latest PHP version for App Services|Latest supported PHP version for App Services|
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Required retention period (days) for resource logs|For more information about resource logs, visit [https://aka.ms/resourcelogs](https://aka.ms/resourcelogs) |
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Name of the resource group for Network Watcher|Name of the resource group where Network Watchers are located|
|CIS Microsoft Azure Foundations Benchmark v1.3.0|Policy Assignment|Required auditing setting for SQL servers||

## Next steps

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../concepts/resource-locking.md).
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md).