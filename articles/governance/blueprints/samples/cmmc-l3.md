---
title: CMMC Level 3 blueprint sample
description: Overview of the CMMC Level 3 blueprint sample. This blueprint sample helps customers assess specific controls.
ms.date: 03/24/2021
ms.topic: sample
---
# CMMC Level 3 blueprint sample

The CMMC Level 3 blueprint sample provides governance guard-rails using
[Azure Policy](../../policy/overview.md) that help you assess specific
[Cybersecurity Maturity Model Certification (CMMC) framework](https://www.acq.osd.mil/cmmc/index.html)
controls. This blueprint helps customers deploy a core set of policies for any Azure-deployed
architecture that must implement controls for CMMC Level 3.

## Control mapping

The [Azure Policy control mapping](../../policy/samples/cmmc-l3.md) provides details on policy
definitions included within this blueprint and how these policy definitions map to the **controls**
in the CMMC framework. When assigned to an architecture, resources are evaluated by Azure Policy for
non-compliance with assigned policy definitions. For more information, see
[Azure Policy](../../policy/overview.md).

## Deploy

To deploy the Azure Blueprints CMMC Level 3 blueprint sample,
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

1. Find the **CMMC Level 3** blueprint sample under _Other
   Samples_ and select **Use this sample**.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the CMMC Level 3 blueprint
     sample.
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
away from alignment with CMMC Level 3 controls.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find your copy of the
   blueprint sample and then select it.

1. Select **Publish blueprint** at the top of the page. In the new page on the right, provide a
   **Version** for your copy of the blueprint sample. This property is useful for if you make a
   modification later. Provide **Change notes** such as "First version published from the CMMC Level
   3 blueprint sample." Then select **Publish** at the bottom of the page.

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
|CMMC Level 3|Policy Assignment|Include Arc-connected servers when evaluating guest configuration policies|By selecting 'true,' you agree to be charged monthly per Arc connected machine; for more information, visit https://aka.ms/policy-pricing|
|CMMC Level 3|Policy Assignment|List of users that must be excluded from Windows VM Administrators group|A semicolon-separated list of users that should be excluded in the Administrators local group; Ex: Administrator; myUser1; myUser2|
|CMMC Level 3|Policy Assignment|List of users that must be included in Windows VM Administrators group|A semicolon-separated list of users that should be included in the Administrators local group; Ex: Administrator; myUser1; myUser2|
|CMMC Level 3|Policy Assignment|Log Analytics workspace ID for VM agent reporting|ID (GUID) of the Log Analytics workspace where VMs agents should report|
|CMMC Level 3|Policy Assignment|Allowed elliptic curve names|The list of allowed curve names for elliptic curve cryptography certificates.|
|CMMC Level 3|Policy Assignment|Allowed key types|The list of allowed key types|
|CMMC Level 3|Policy Assignment|Allow host network usage for Kubernetes cluster pods|Set this value to true if pod is allowed to use host network otherwise false.|
|CMMC Level 3|Policy Assignment|Audit Authentication Policy Change|Specifies whether audit events are generated when changes are made to authentication policy. This setting is useful for tracking changes in domain-level and forest-level trust and privileges that are granted to user accounts or groups.|
|CMMC Level 3|Policy Assignment|Audit Authorization Policy Change|Specifies whether audit events are generated for assignment and removal of user rights in user right policies, changes in security token object permission, resource attributes changes and Central Access Policy changes for file system objects.|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure Backup should be enabled for Virtual Machines|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Cognitive Services accounts should restrict network access|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: SQL managed instances should use customer-managed keys to encrypt data at rest|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure API for FHIR should use a customer-managed key (CMK) to encrypt data at rest|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Web Application Firewall (WAF) should be enabled for Azure Front Door Service|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Public network access should be disabled for Cognitive Services accounts|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: CORS should not allow every resource to access your Function Apps|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Adaptive network hardening recommendations should be applied on internet facing virtual machines|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: There should be more than one owner assigned to your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Disk encryption should be applied on virtual machines|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Email notification to subscription owner for high severity alerts should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Key vault should have purge protection enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: SQL servers should use customer-managed keys to encrypt data at rest|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Remote debugging should be turned off for Function Apps|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure Defender for Key Vault should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Geo-redundant backup should be enabled for Azure Database for MariaDB|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: CORS should not allow every domain to access your API for FHIR|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Windows machines should meet requirements for 'Security Options - Network Security'|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Allowlist rules in your adaptive application control policy should be updated|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Web Application Firewall (WAF) should use the specified mode for Application Gateway|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Keys should have expiration dates set|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Transparent Data Encryption on SQL databases should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure Monitor log profile should collect logs for categories 'write,' 'delete,' and 'action'|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Vulnerability assessment should be enabled on SQL Managed Instance|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Ensure that 'PHP version' is the latest, if used as a part of the API app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Key vault should have soft delete enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: An Azure Active Directory administrator should be provisioned for SQL servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Only secure connections to your Azure Cache for Redis should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Infrastructure encryption should be enabled for Azure Database for PostgreSQL servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Endpoint protection solution should be installed on virtual machine scale sets|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure Defender for App Service should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Windows machines should meet requirements for 'System Audit Policies - Policy Change'|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Cognitive Services accounts should enable data encryption|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: SSH access from the Internet should be blocked|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Unattached disks should be encrypted|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure Defender for Storage should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Storage accounts should restrict network access|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: CORS should not allow every resource to access your API App|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Deploy Advanced Threat Protection on Storage Accounts|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Automation account variables should be encrypted|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Diagnostic logs in IoT Hub should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Infrastructure encryption should be enabled for Azure Database for MySQL servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: An activity log alert should exist for specific Security operations (Microsoft.Security/securitySolutions/delete)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Vulnerabilities in security configuration on your virtual machine scale sets should be remediated|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Windows machines should meet requirements for 'Security Options - Network Access'|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Secure transfer to storage accounts should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure Monitor should collect activity logs from all regions|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Web Application Firewall (WAF) should use the specified mode for Azure Front Door Service|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Storage accounts should have infrastructure encryption|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Adaptive application controls for defining safe applications should be enabled on your machines|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Geo-redundant backup should be enabled for Azure Database for PostgreSQL|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Windows machines should meet requirements for 'Security Options - User Account Control'|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Ensure that 'Java version' is the latest, if used as a part of the Web app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure Defender for servers should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: A maximum of 3 owners should be designated for your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Subscriptions should have a contact email address for security issues|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Storage account public access should be disallowed|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: A vulnerability assessment solution should be enabled on your virtual machines|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure Defender for Kubernetes should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Firewall should be enabled on Key Vault|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Web Application Firewall (WAF) should be enabled for Application Gateway|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: CORS should not allow every resource to access your Web Applications|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Audit Windows machines that allow re-use of the previous 24 passwords|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Container registries should be encrypted with a customer-managed key (CMK)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: External accounts with write permissions should be removed from your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Public network access should be disabled for PostgreSQL flexible servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Vulnerabilities in Azure Container Registry images should be remediated|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: External accounts with read permissions should be removed from your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Service Fabric clusters should have the ClusterProtectionLevel property set to EncryptAndSign|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure Defender for SQL servers on machines should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Cognitive Services accounts should enable data encryption with customer-managed key|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Deprecated accounts should be removed from your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Function App should only be accessible over HTTPS|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Email notification for high severity alerts should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Storage account should use customer-managed key for encryption|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Ensure that 'Python version' is the latest, if used as a part of the Web app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Ensure that 'Python version' is the latest, if used as a part of the Function app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Ensure that 'PHP version' is the latest, if used as a part of the WEB app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Ensure that 'Python version' is the latest, if used as a part of the API app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Keys should be the specified cryptographic type RSA or EC|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure subscriptions should have a log profile for Activity Log|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Both operating systems and data disks in Azure Kubernetes Service clusters should be encrypted by customer-managed keys|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure Defender for Azure SQL Database servers should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure Data Explorer encryption at rest should use a customer-managed key|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Keys using RSA cryptography should have a specified minimum key size|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Geo-redundant backup should be enabled for Azure Database for MySQL|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Kubernetes cluster pods should only use approved host network and port range|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: System updates should be installed on your machines|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Windows machines should meet requirements for 'System Audit Policies - Privilege Use'|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure Stream Analytics jobs should use customer-managed keys to encrypt data|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Ensure that 'Java version' is the latest, if used as a part of the API app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Ensure that 'HTTP Version' is the latest, if used to run the Web app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Latest TLS version should be used in your API App|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: MFA should be enabled accounts with write permissions on your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Ensure that 'HTTP Version' is the latest, if used to run the API app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Microsoft IaaSAntimalware extension should be deployed on Windows servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Ensure that 'Java version' is the latest, if used as a part of the Function app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: All network ports should be restricted on network security groups associated to your virtual machine|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Security Center standard pricing tier should be selected|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Audit Windows machines that do not restrict the minimum password length to 14 characters|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Audit usage of custom RBAC rules|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Web Application should only be accessible over HTTPS|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Auditing on SQL server should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: The Log Analytics agent should be installed on virtual machines|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: MFA should be enabled on accounts with owner permissions on your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Advanced data security should be enabled on your SQL servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Advanced data security should be enabled on SQL Managed Instance|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Role-Based Access Control (RBAC) should be used on Kubernetes Services|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Virtual machines should have the Guest Configuration extension|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Monitor missing Endpoint Protection in Azure Security Center|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Activity log should be retained for at least one year|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Management ports of virtual machines should be protected with just-in-time network access control|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Public network access should be disabled for PostgreSQL servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Deploy Advanced Threat Protection for Cosmos DB Accounts|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Diagnostic logs in App Services should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: API App should only be accessible over HTTPS|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: An activity log alert should exist for specific Administrative operations (Microsoft.ClassicNetwork/networkSecurityGroups/delete)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: An activity log alert should exist for specific Administrative operations (Microsoft.ClassicNetwork/networkSecurityGroups/securityRules/delete)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: An activity log alert should exist for specific Administrative operations (Microsoft.Network/networkSecurityGroups/delete)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: An activity log alert should exist for specific Administrative operations (Microsoft.Network/networkSecurityGroups/securityRules/delete)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: An activity log alert should exist for specific Administrative operations (Microsoft.Sql/servers/firewallRules/delete)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Non-internet-facing virtual machines should be protected with network security groups|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Audit Windows machines that do not have the password complexity setting enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure Defender for container registries should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure Data Box jobs should enable double encryption for data at rest on the device|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: System updates on virtual machine scale sets should be installed|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Microsoft Antimalware for Azure should be configured to automatically update protection signatures|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: An activity log alert should exist for specific Policy operations (Microsoft.Authorization/policyAssignments/delete)|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Public network access should be disabled for MySQL flexible servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Storage accounts should allow access from trusted Microsoft services|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Remote debugging should be turned off for Web Applications|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Certificates using RSA cryptography should have the specified minimum key size|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Container registries should not allow unrestricted network access|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Enforce SSL connection should be enabled for PostgreSQL database servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Guest Configuration extension should be deployed to Azure virtual machines with system assigned managed identity|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Long-term geo-redundant backup should be enabled for Azure SQL Databases|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Public network access should be disabled for MySQL servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Audit Windows machines that do not store passwords using reversible encryption|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Windows machines should meet requirements for 'User Rights Assignment'|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Vulnerabilities in security configuration on your machines should be remediated|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Ensure that 'HTTP Version' is the latest, if used to run the Function app|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: MFA should be enabled on accounts with read permissions on your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: RDP access from the Internet should be blocked|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Audit Linux machines that do not have the passwd file permissions set to 0644|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Subnets should be associated with a Network Security Group|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Enforce SSL connection should be enabled for MySQL database servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Vulnerabilities in container security configurations should be remediated|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Remote debugging should be turned off for API Apps|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Audit Linux machines that allow remote connections from accounts without passwords|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Deprecated accounts with owner permissions should be removed from your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Double encryption should be enabled on Azure Data Explorer|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Vulnerability assessment should be enabled on your SQL servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: The Log Analytics agent should be installed on Virtual Machine Scale Sets|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Latest TLS version should be used in your Web App|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Disk encryption should be enabled on Azure Data Explorer|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Internet-facing virtual machines should be protected with network security groups|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Audit Linux machines that have accounts without passwords|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Azure Synapse workspaces should use customer-managed keys to encrypt data at rest|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: External accounts with owner permissions should be removed from your subscription|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Latest TLS version should be used in your Function App|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Kubernetes Services should be upgraded to a non-vulnerable Kubernetes version|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: All Internet traffic should be routed via your deployed Azure Firewall|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Linux machines should meet requirements for the Azure security baseline|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Public network access should be disabled for MariaDB servers|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Vulnerabilities on your SQL databases should be remediated|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Effect for policy: Keys using elliptic curve cryptography should have the specified curve names|For more information about effects, visit [https://aka.ms/policyeffects](https://aka.ms/policyeffects)|
|CMMC Level 3|Policy Assignment|Namespaces excluded from evaluation of policy: Kubernetes cluster pods should only use approved host network and port range|List of Kubernetes namespaces to exclude from policy evaluation.|
|CMMC Level 3|Policy Assignment|Latest Java version for App Services|Latest supported Java version for App Services|
|CMMC Level 3|Policy Assignment|Latest Python version for Linux for App Services|Latest supported Python version for App Services|
|CMMC Level 3|Policy Assignment|Optional: List of VM images that have supported Linux OS to add to scope when auditing Log Analytics agent deployment|Example value: '/subscriptions/<subscriptionId>/resourceGroups/YourResourceGroup/providers/Microsoft.Compute/images/ContosoStdImage'|
|CMMC Level 3|Policy Assignment|Optional: List of VM images that have supported Windows OS to add to scope when auditing Log Analytics agent deployment|Example value: '/subscriptions/<subscriptionId>/resourceGroups/YourResourceGroup/providers/Microsoft.Compute/images/ContosoStdImage'|
|CMMC Level 3|Policy Assignment|List of regions where Network Watcher should be enabled|Audit if Network Watcher is not enabled for region(s).|
|CMMC Level 3|Policy Assignment|List of resource types that should have diagnostic logs enabled||
|CMMC Level 3|Policy Assignment|Maximum value in the allowable host port range that pods can use in the host network namespace|The maximum value in the allowable host port range that pods can use in the host network namespace.|
|CMMC Level 3|Policy Assignment|Minimum RSA key size for keys|The minimum key size for RSA keys.|
|CMMC Level 3|Policy Assignment|Minimum RSA key size certificates|The minimum key size for RSA certificates.|
|CMMC Level 3|Policy Assignment|Minimum TLS version for Windows web servers|Windows web servers with lower TLS versions will be assessed as non-compliant|
|CMMC Level 3|Policy Assignment|Minimum value in the allowable host port range that pods can use in the host network namespace|The minimum value in the allowable host port range that pods can use in the host network namespace.|
|CMMC Level 3|Policy Assignment|Mode Requirement|Mode required for all WAF policies|
|CMMC Level 3|Policy Assignment|Mode Requirement|Mode required for all WAF policies|
|CMMC Level 3|Policy Assignment|Allowed host paths for pod hostPath volumes to use|The host paths allowed for pod hostPath volumes to use. Provide an empty paths list to block all host paths.|
|CMMC Level 3|Policy Assignment|Network access: Remotely accessible registry paths|Specifies which registry paths will be accessible over the network, regardless of the users or groups listed in the access control list (ACL) of the `winreg` registry key.|
|CMMC Level 3|Policy Assignment|Network access: Remotely accessible registry paths and sub-paths|Specifies which registry paths and sub-paths will be accessible over the network, regardless of the users or groups listed in the access control list (ACL) of the `winreg` registry key.|
|CMMC Level 3|Policy Assignment|Network access: Shares that can be accessed anonymously|Specifies which network shares can be accessed by anonymous users. The default configuration for this policy setting has little effect because all users have to be authenticated before they can access shared resources on the server.|
|CMMC Level 3|Policy Assignment|Network Security: Configure encryption types allowed for Kerberos|Specifies the encryption types that Kerberos is allowed to use.|
|CMMC Level 3|Policy Assignment|Network security: LAN Manager authentication level|Specify which challenge-response authentication protocol is used for network logons. This choice affects the level of authentication protocol used by clients, the level of session security negotiated, and the level of authentication accepted by servers.|
|CMMC Level 3|Policy Assignment|Network security: LDAP client signing requirements|Specify the level of data signing that is requested on behalf of clients that issue LDAP BIND requests.|
|CMMC Level 3|Policy Assignment|Network security: Minimum session security for NTLM SSP based (including secure RPC) clients|Specifies which behaviors are allowed by clients for applications using the NTLM Security Support Provider (SSP). The SSP Interface (SSPI) is used by applications that need authentication services. See [https://docs.microsoft.com/windows/security/threat-protection/security-policy-settings/network-security-minimum-session-security-for-ntlm-ssp-based-including-secure-rpc-servers](https://docs.microsoft.com/windows/security/threat-protection/security-policy-settings/network-security-minimum-session-security-for-ntlm-ssp-based-including-secure-rpc-servers) for more information.|
|CMMC Level 3|Policy Assignment|Network security: Minimum session security for NTLM SSP based (including secure RPC) servers|Specifies which behaviors are allowed by servers for applications using the NTLM Security Support Provider (SSP). The SSP Interface (SSPI) is used by applications that need authentication services.|
|CMMC Level 3|Policy Assignment|Latest PHP version for App Services|Latest supported PHP version for App Services|
|CMMC Level 3|Policy Assignment|Required retention period (days) for IoT Hub diagnostic logs||
|CMMC Level 3|Policy Assignment|Name of the resource group for Network Watcher|Name of the resource group of NetworkWatcher, such as NetworkWatcherRG. This is the resource group where the Network Watchers are located.|
|CMMC Level 3|Policy Assignment|Required auditing setting for SQL servers||
|CMMC Level 3|Policy Assignment|Azure Data Box SKUs that support software-based double encryption|The list of Azure Data Box SKUs that support software-based double encryption|
|CMMC Level 3|Policy Assignment|UAC: Admin Approval Mode for the Built-in Administrator account|Specifies the behavior of Admin Approval Mode for the built-in Administrator account.|
|CMMC Level 3|Policy Assignment|UAC: Behavior of the elevation prompt for administrators in Admin Approval Mode|Specifies the behavior of the elevation prompt for administrators.|
|CMMC Level 3|Policy Assignment|UAC: Detect application installations and prompt for elevation|Specifies the behavior of application installation detection for the computer.|
|CMMC Level 3|Policy Assignment|UAC: Run all administrators in Admin Approval Mode|Specifies the behavior of all User Account Control (UAC) policy settings for the computer.|
|CMMC Level 3|Policy Assignment|User and groups that may force shutdown from a remote system|Specifies which users and groups are permitted to shut down the computer from a remote location on the network.|
|CMMC Level 3|Policy Assignment|Users and groups that are denied access to this computer from the network|Specifies which users or groups are explicitly prohibited from connecting to the computer across the network.|
|CMMC Level 3|Policy Assignment|Users and groups that are denied local logon|Specifies which users and groups are explicitly not permitted to log on to the computer.|
|CMMC Level 3|Policy Assignment|Users and groups that are denied logging on as a batch job|Specifies which users and groups are explicitly not permitted to log on to the computer as a batch job (i.e. scheduled task).|
|CMMC Level 3|Policy Assignment|Users and groups that are denied logging on as a service|Specifies which service accounts are explicitly not permitted to register a process as a service.|
|CMMC Level 3|Policy Assignment|Users and groups that are denied log on through Remote Desktop Services|Specifies which users and groups are explicitly not permitted to log on to the computer via Terminal Services/Remote Desktop Client.|
|CMMC Level 3|Policy Assignment|Users and groups that may restore files and directories|Specifies which users and groups are permitted to bypass file, directory, registry, and other persistent object permissions when restoring backed up files and directories.|
|CMMC Level 3|Policy Assignment|Users and groups that may shut down the system|Specifies which users and groups who are logged on locally to the computers in your environment are permitted to shut down the operating system with the Shut Down command.|
|CMMC Level 3|Policy Assignment|Users or groups that may log on locally|Specifies which remote users on the network are permitted to connect to the computer. This does not include Remote Desktop Connection.|
|CMMC Level 3|Policy Assignment|Users or groups that may back up files and directories|Specifies users and groups allowed to circumvent file and directory permissions to back up the system.|
|CMMC Level 3|Policy Assignment|Users or groups that may change the system time|Specifies which users and groups are permitted to change the time and date on the internal clock of the computer.|
|CMMC Level 3|Policy Assignment|Users or groups that may change the time zone|Specifies which users and groups are permitted to change the time zone of the computer.|
|CMMC Level 3|Policy Assignment|Users or groups that may create a token object|Specifies which users and groups are permitted to create an access token, which may provide elevated rights to access sensitive data.|
|CMMC Level 3|Policy Assignment|Users or groups that may log on locally|Specifies which users or groups can interactively log on to the computer. Users who attempt to log on via Remote Desktop Connection or IIS also require this user right.|
|CMMC Level 3|Policy Assignment|Remote Desktop Users|Users or groups that may log on through Remote Desktop Services|
|CMMC Level 3|Policy Assignment|Users or groups that may manage auditing and security log|Specifies users and groups permitted to change the auditing options for files and directories and clear the Security log.|
|CMMC Level 3|Policy Assignment|Users or groups that may take ownership of files or other objects|Specifies which users and groups are permitted to take ownership of files, folders, registry keys, processes, or threads. This user right bypasses any permissions that are in place to protect objects to give ownership to the specified user.|

## Next steps

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../concepts/resource-locking.md).
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md).