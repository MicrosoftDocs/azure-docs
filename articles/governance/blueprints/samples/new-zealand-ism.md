---
title: New Zealand ISM Restricted blueprint sample
description: Overview of the New Zealand ISM Restricted blueprint sample. This blueprint sample helps customers assess specific controls.
ms.date: 09/07/2023
ms.topic: sample
---
# New Zealand ISM Restricted blueprint sample

[!INCLUDE [Blueprints deprecation note](../../../../includes/blueprints-deprecation-note.md)]

The New Zealand ISM Restricted blueprint sample provides governance guardrails using
[Azure Policy](../../policy/overview.md) that help you assess specific
[New Zealand Information Security Manual](https://www.nzism.gcsb.govt.nz/) controls. This blueprint
helps customers deploy a core set of policies for any Azure-deployed architecture that must
implement controls for New Zealand ISM Restricted.

## Control mapping

The [Azure Policy control mapping](../../policy/samples/new-zealand-ism.md) provides details
on policy definitions included within this blueprint and how these policy definitions map to the
**controls** in the New Zealand Information Security Manual. When assigned to an architecture,
resources are evaluated by Azure Policy for non-compliance with assigned policy definitions. For
more information, see [Azure Policy](../../policy/overview.md).

## Deploy

To deploy the Azure Blueprints New Zealand ISM Restricted blueprint sample,
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

1. Find the **New Zealand ISM Restricted** blueprint sample under _Other
   Samples_ and select **Use this sample**.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the New Zealand ISM Restricted blueprint
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
away from alignment with New Zealand ISM Restricted controls.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find your copy of the
   blueprint sample and then select it.

1. Select **Publish blueprint** at the top of the page. In the new page on the right, provide a
   **Version** for your copy of the blueprint sample. This property is useful for if you make a
   modification later. Provide **Change notes** such as "First version published from the New
   Zealand ISM Restricted blueprint sample." Then select **Publish** at the bottom of the page.

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
     - **Location**: Select a region for the managed identity to be created in. Azure Blueprints uses
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
|New Zealand ISM Restricted|Policy Assignment|List of users that must be included in Windows VM Administrators group|A semicolon-separated list of users that should be included in the Administrators local group; Ex: Administrator; myUser1; myUser2|
|New Zealand ISM Restricted|Policy Assignment|List of users that must be excluded from Windows VM Administrators group|A semicolon-separated list of users that should be excluded in the Administrators local group; Ex: Administrator; myUser1; myUser2|
|New Zealand ISM Restricted|Policy Assignment|List of users that Windows VM Administrators group must only include|A semicolon-separated list of all the expected members of the Administrators local group; Ex: Administrator; myUser1; myUser2|
|New Zealand ISM Restricted|Policy Assignment|Log Analytics workspace ID for VM agent reporting|ID (GUID) of the Log Analytics workspace where VMs agents should report|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Web Application Firewall (WAF) should be enabled for Azure Front Door Service|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Adaptive network hardening recommendations should be applied on internet facing virtual machines|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: There should be more than one owner assigned to your subscription|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Disk encryption should be applied on virtual machines|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Remote debugging should be turned off for Function Apps|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Web Application Firewall (WAF) should use the specified mode for Application Gateway|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|WAF mode requirement for Application Gateway|The Prevention or Detection mode must be enabled on the Application Gateway service|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Transparent Data Encryption on SQL databases should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Vulnerability assessment should be enabled on SQL Managed Instance|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Optional: List of custom VM images that have supported Windows OS to add to scope additional to the images in the gallery for policy: Deploy - Configure Dependency agent to be enabled on Windows virtual machines|For more information on Guest Configuration, visit [https://aka.ms/gcpol](../../machine-configuration/overview.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: An Azure Active Directory administrator should be provisioned for SQL servers|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Only secure connections to your Azure Cache for Redis should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Endpoint protection solution should be installed on virtual machine scale sets|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Include Arc-connected servers when evaluating policy: Audit Windows machines missing any of specified members in the Administrators group|By selecting 'true', you agree to be charged monthly per Arc connected machine|
|New Zealand ISM Restricted|Policy Assignment|Optional: List of custom VM images that have supported Windows OS to add to scope additional to the images in the gallery for policy: [Preview]: Log Analytics Agent should be enabled for listed virtual machine images|For more information on Guest Configuration, visit [https://aka.ms/gcpol](../../machine-configuration/overview.md)|
|New Zealand ISM Restricted|Policy Assignment|Optional: List of custom VM images that have supported Linux OS to add to scope additional to the images in the gallery for policy: [Preview]: Log Analytics Agent should be enabled for listed virtual machine images|For more information on Guest Configuration, visit [https://aka.ms/gcpol](../../machine-configuration/overview.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Storage accounts should restrict network access|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Optional: List of custom VM images that have supported Windows OS to add to scope additional to the images in the gallery for policy: Deploy - Configure Dependency agent to be enabled on Windows virtual machine scale sets|For more information on Guest Configuration, visit [https://aka.ms/gcpol](../../machine-configuration/overview.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Vulnerabilities in security configuration on your virtual machine scale sets should be remediated|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Include Arc-connected servers when evaluating policy: Audit Windows machines that have extra accounts in the Administrators group|By selecting 'true', you agree to be charged monthly per Arc connected machine|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Secure transfer to storage accounts should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Web Application Firewall (WAF) should use the specified mode for Azure Front Door Service|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|WAF mode requirement for Azure Front Door Service|The Prevention or Detection mode must be enabled on the Azure Front Door service|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Adaptive application controls for defining safe applications should be enabled on your machines|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: A maximum of 3 owners should be designated for your subscription|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: [Preview]: Storage account public access should be disallowed|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: A vulnerability assessment solution should be enabled on your virtual machines|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Web Application Firewall (WAF) should be enabled for Application Gateway|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: CORS should not allow every resource to access your Web Applications|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Include Arc-connected servers when evaluating policy: Audit Windows web servers that are not using secure communication protocols|By selecting 'true', you agree to be charged monthly per Arc connected machine|
|New Zealand ISM Restricted|Policy Assignment|Minimum TLS version for Windows web servers|Windows web servers with lower TLS versions will be assessed as non-compliant|
|New Zealand ISM Restricted|Policy Assignment|Optional: List of custom VM images that have supported Linux OS to add to scope additional to the images in the gallery for policy: Log Analytics agent should be enabled in virtual machine scale sets for listed virtual machine images|For more information on Guest Configuration, visit [https://aka.ms/gcpol](../../machine-configuration/overview.md)|
|New Zealand ISM Restricted|Policy Assignment|Optional: List of custom VM images that have supported Windows OS to add to scope additional to the images in the gallery for policy: Log Analytics agent should be enabled in virtual machine scale sets for listed virtual machine images|For more information on Guest Configuration, visit [https://aka.ms/gcpol](../../machine-configuration/overview.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: External accounts with write permissions should be removed from your subscription|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Include Arc-connected servers when evaluating policy: Audit Windows machines that have the specified members in the Administrators group|By selecting 'true', you agree to be charged monthly per Arc connected machine|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Deprecated accounts should be removed from your subscription|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Function App should only be accessible over HTTPS|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Azure subscriptions should have a log profile for Activity Log|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|List of resource types that should have diagnostic logs enabled||
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: System updates should be installed on your machines|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Latest TLS version should be used in your API App|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: MFA should be enabled accounts with write permissions on your subscription|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Microsoft IaaSAntimalware extension should be deployed on Windows servers|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Web Application should only be accessible over HTTPS|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Azure DDoS Protection should be enabled|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: MFA should be enabled on accounts with owner permissions on your subscription|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Advanced data security should be enabled on your SQL servers|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Advanced data security should be enabled on SQL Managed Instance|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Monitor missing Endpoint Protection in Azure Security Center|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Activity log should be retained for at least one year|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Management ports of virtual machines should be protected with just-in-time network access control|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Service Fabric clusters should only use Azure Active Directory for client authentication|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: API App should only be accessible over HTTPS|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Audit Windows machines on which Windows Defender Exploit Guard is not enabled|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Include Arc-connected servers when evaluating policy: Audit Windows machines on which Windows Defender Exploit Guard is not enabled|By selecting 'true', you agree to be charged monthly per Arc connected machine|
|New Zealand ISM Restricted|Policy Assignment|Compliance state to report for Windows machines on which Windows Defender Exploit Guard is not available|Windows Defender Exploit Guard is only available starting with Windows 10/Windows Server with update 1709. Setting this value to 'Non-Compliant' shows machines with older versions on which Windows Defender Exploit Guard is not available (such as Windows Server 2012 R2) as non-compliant. Setting this value to 'Compliant' shows these machines as compliant.|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: System updates on virtual machine scale sets should be installed|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Remote debugging should be turned off for Web Applications|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Vulnerabilities in security configuration on your machines should be remediated|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: MFA should be enabled on accounts with read permissions on your subscription|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Vulnerabilities in container security configurations should be remediated|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Remote debugging should be turned off for API Apps|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Audit Linux machines that allow remote connections from accounts without passwords|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Include Arc-connected servers when evaluating policy: Audit Linux machines that allow remote connections from accounts without passwords|By selecting 'true', you agree to be charged monthly per Arc connected machine|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Deprecated accounts with owner permissions should be removed from your subscription|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Vulnerability assessment should be enabled on your SQL servers|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Latest TLS version should be used in your Web App|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Windows machines should meet requirements for 'Security Settings - Account Policies'|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Enforce password history for Windows VM local accounts|Specifies limits on password reuse - how many times a new password must be created for a user account before the password can be repeated|
|New Zealand ISM Restricted|Policy Assignment|Include Arc-connected servers when evaluating policy: Windows machines should meet requirements for 'Security Settings - Account Policies'|By selecting 'true', you agree to be charged monthly per Arc connected machine|
|New Zealand ISM Restricted|Policy Assignment|Maximum password age for Windows VM local accounts|Specifies the maximum number of days that may elapse before a user account password must be changed; the format of the value is two integers separated by a comma, denoting an inclusive range|
|New Zealand ISM Restricted|Policy Assignment|Minimum password age for Windows VM local accounts|Specifies the minimum number of days that must elapse before a user account password can be changed|
|New Zealand ISM Restricted|Policy Assignment|Minimum password length for Windows VM local accounts|Specifies the minimum number of characters that a user account password may contain|
|New Zealand ISM Restricted|Policy Assignment|Password must meet complexity requirements for Windows VM local accounts|Specifies whether a user account password must be complex; if required, a complex password must not contain part of the user's account name or full name; be at least 6 characters long; contain a mix of uppercase, lowercase, number, and non-alphabetic characters|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Internet-facing virtual machines should be protected with network security groups|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Audit Linux machines that have accounts without passwords|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Include Arc-connected servers when evaluating policy: Audit Linux machines that have accounts without passwords|By selecting 'true', you agree to be charged monthly per Arc connected machine|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: External accounts with owner permissions should be removed from your subscription|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Latest TLS version should be used in your Function App|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: [Preview]: All Internet traffic should be routed via your deployed Azure Firewall|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|
|New Zealand ISM Restricted|Policy Assignment|Effect for policy: Vulnerabilities on your SQL databases should be remediated|For more information about effects, visit [https://aka.ms/policyeffects](../../policy/concepts/effects.md)|

## Next steps

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../concepts/resource-locking.md).
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md).
