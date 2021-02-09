---
title: HIPAA HITRUST 9.2 blueprint sample overview
description: Overview of the HIPAA HITRUST 9.2 blueprint sample. This blueprint sample helps customers assess specific HIPAA HITRUST 9.2 controls.
ms.date: 01/27/2021
ms.topic: sample
---
# HIPAA HITRUST 9.2 blueprint sample

The HIPAA HITRUST 9.2 blueprint sample provides governance guard-rails using
[Azure Policy](../../policy/overview.md) that help you assess specific HIPAA HITRUST 9.2
controls. This blueprint helps customers deploy a core set of policies for any Azure-deployed
architecture that must implement HIPAA HITRUST 9.2 controls.

## Control mapping

The [Azure Policy control mapping](../../policy/samples/hipaa-hitrust-9-2.md) provides details on
policy definitions included within this blueprint and how these policy definitions map to the
**compliance domains** and **controls** in HIPAA HITRUST 9.2. When assigned to an architecture,
resources are evaluated by Azure Policy for non-compliance with assigned policy definitions. For
more information, see [Azure Policy](../../policy/overview.md).

## Deploy

To deploy the Azure Blueprints HIPAA HITRUST 9.2 blueprint sample, the following steps must
be taken:

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

1. Find the **HIPAA HITRUST** blueprint sample under _Other Samples_ and select **Use
   this sample**.

1. Enter the _Basics_ of the blueprint sample:

   - **Blueprint name**: Provide a name for your copy of the HIPAA HITRUST 9.2 blueprint sample.
   - **Definition location**: Use the ellipsis and select the management group to save your copy of
     the sample to.

1. Select the _Artifacts_ tab at the top of the page or **Next: Artifacts** at the bottom of the
   page.

1. Review the list of artifacts that make up the blueprint sample. Many of the artifacts have
   parameters that we'll define later. Select **Save Draft** when you've finished reviewing the
   blueprint sample.

### Publish the sample copy

Your copy of the blueprint sample has now been created in your environment. It's created in
**Draft** mode and must be **Published** before it can be assigned and deployed. The copy of the
blueprint sample can be customized to your environment and needs, but that modification may move it
away from alignment with HIPAA HITRUST 9.2 controls.

1. Select **All services** in the left pane. Search for and select **Blueprints**.

1. Select the **Blueprint definitions** page on the left. Use the filters to find your copy of the
   blueprint sample and then select it.

1. Select **Publish blueprint** at the top of the page. In the new page on the right, provide a
   **Version** for your copy of the blueprint sample. This property is useful for if you make a
   modification later. Provide **Change notes** such as "First version published from the HIPAA
   HITRUST 9.2 blueprint sample." Then select **Publish** at the bottom of the page.

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
     parameters are [dynamic parameters](../concepts/parameters.md#dynamic-parameters) since they're
     defined during the assignment of the blueprint. For a full list or artifact parameters and
     their descriptions, see [Artifact parameters table](#artifact-parameters-table).

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

|Artifact name |Parameter name |Description |
|---|---|---|
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Access through Internet facing endpoint should be restricted |Enable or disable overly permissive inbound NSG rules monitoring |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Accounts: Guest account status |Specifies whether the local Guest account is disabled. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Adaptive Application Controls should be enabled on virtual machines |Enable or disable the monitoring of application whitelisting in Azure Security Center |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Allow simultaneous connections to the Internet or a Windows Domain |Specify whether to prevent computers from connecting to both a domain based network and a non-domain based network at the same time. A value of 0 allows simultaneous connections, and a value of 1 blocks them. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |API App should only be accessible over HTTPS V2 |Enable or disable the monitoring of the use of HTTPS in API App V2 |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Application names (supports wildcards) |A semicolon-separated list of the names of the applications that should be installed. e.g. 'Microsoft SQL Server 2014 (64-bit); Microsoft Visual Studio Code' or 'Microsoft SQL Server 2014*' (to match any application starting with 'Microsoft SQL Server 2014') |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Audit Process Termination |Specifies whether audit events are generated when a process has exited. Recommended for monitoring termination of critical processes. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Audit unrestricted network access to storage accounts |Enable or disable the monitoring of network access to storage account |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Audit: Shut down system immediately if unable to log security audits |Audits if the system will shut down when unable to log Security events. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Certificate thumbprints |A semicolon-separated list of certificate thumbprints that should exist under the Trusted Root certificate store (Cert:\LocalMachine\Root). e.g. THUMBPRINT1;THUMBPRINT2;THUMBPRINT3 |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Diagnostic logs in Batch accounts should be enabled |Enable or disable the monitoring of diagnostic logs in Batch accounts |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Diagnostic logs in Event Hub should be enabled |Enable or disable the monitoring of diagnostic logs in Event Hub accounts |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Diagnostic logs in Search services should be enabled |Enable or disable the monitoring of diagnostic logs in Azure Search service |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Diagnostic logs in Virtual Machine Scale Sets should be enabled |Enable or disable the monitoring of diagnostic logs in Service Fabric |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Disk encryption should be applied on virtual machines |Enable or disable the monitoring for VM disk encryption |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Enable insecure guest logons |Specifies whether the SMB client will allow insecure guest logons to an SMB server. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Just-In-Time network access control should be applied on virtual machines |Enable or disable the monitoring of network just In time access |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Management ports should be closed on your virtual machines |Enable or disable the monitoring of open management ports on Virtual Machines |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |MFA should be enabled accounts with write permissions on your subscription |Enable or disable the monitoring of MFA for accounts with write permissions in subscription |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |MFA should be enabled on accounts with owner permissions on your subscription |Enable or disable the monitoring of MFA for accounts with owner permissions in subscription |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Network access: Remotely accessible registry paths |Specifies which registry paths will be accessible over the network, regardless of the users or groups listed in the access control list (ACL) of the `winreg` registry key. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Network access: Remotely accessible registry paths and sub-paths |Specifies which registry paths and sub-paths will be accessible over the network, regardless of the users or groups listed in the access control list (ACL) of the `winreg` registry key. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Network access: Shares that can be accessed anonymously |Specifies which network shares can be accessed by anonymous users. The default configuration for this policy setting has little effect because all users have to be authenticated before they can access shared resources on the server. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Recovery console: Allow floppy copy and access to all drives and all folders |Specifies whether to make the Recovery Console SET command available, which allows setting of recovery console environment variables. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Remote debugging should be turned off for API App |Enable or disable the monitoring of remote debugging for API App |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Remote debugging should be turned off for Web Application |Enable or disable the monitoring of remote debugging for Web App |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Required retention (in days) for logs in Batch accounts |The required diagnostic logs retention period in days |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Required retention (in days) of logs in Azure Search service |The required diagnostic logs retention period in days |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Required retention (in days) of logs in Event Hub accounts |The required diagnostic logs retention period in days |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Resource Group Name for Storage Account (must exist) to deploy diagnostic settings for Network Security Groups |The resource group that the storage account will be created in. This resource group must already exist. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Role-Based Access Control (RBAC) should be used on Kubernetes Services |Enable or disable the monitoring of Kubernetes Services without RBAC enabled |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |SQL managed instance TDE protector should be encrypted with your own key |Enable or disable the monitoring of Transparent Data Encryption (TDE) with your own key support. TDE with your own key support provides increased transparency and control over the TDE Protector, increased security with an HSM-backed external service, and promotion of separation of duties. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |SQL server TDE protector should be encrypted with your own key |Enable or disable the monitoring of Transparent Data Encryption (TDE) with your own key support. TDE with your own key support provides increased transparency and control over the TDE Protector, increased security with an HSM-backed external service, and promotion of separation of duties. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Storage Account Prefix for Regional Storage Account to deploy diagnostic settings for Network Security Groups |This prefix will be combined with the network security group location to form the created storage account name. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |System updates on virtual machine scale sets should be installed |Enable or disable virtual machine scale sets reporting of system updates |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |System updates on virtual machine scale sets should be installed |Enable or disable virtual machine scale sets reporting of system updates |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Turn off multicast name resolution |Specifies whether LLMNR, a secondary name resolution protocol that transmits using multicast over a local subnet link on a single subnet, is enabled. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Virtual machines should be migrated to new Azure Resource Manager resources |Enable or disable the monitoring of classic compute VMs |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Vulnerabilities in security configuration on your virtual machine scale sets should be remediated |Enable or disable virtual machine scale sets OS vulnerabilities monitoring |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Vulnerabilities should be remediated by a Vulnerability Assessment solution |Enable or disable the detection of VM vulnerabilities by a vulnerability assessment solution |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Vulnerability assessment should be enabled on your SQL managed instances |Audit SQL managed instances which do not have recurring vulnerability assessment scans enabled. Vulnerability assessment can discover, track, and help you remediate potential database vulnerabilities. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall (Domain): Apply local firewall rules |Specifies whether local administrators are allowed to create local firewall rules that apply together with firewall rules configured by Group Policy for the Domain profile. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall (Domain): Behavior for outbound connections |Specifies the behavior for outbound connections for the Domain profile that do not match an outbound firewall rule. The default value of 0 means to allow connections, and a value of 1 means to block connections. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall (Domain): Behavior for outbound connections |Specifies the behavior for outbound connections for the Domain profile that do not match an outbound firewall rule. The default value of 0 means to allow connections, and a value of 1 means to block connections. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall (Domain): Display notifications |Specifies whether Windows Firewall with Advanced Security displays notifications to the user when a program is blocked from receiving inbound connections, for the Domain profile. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall (Domain): Use profile settings |Specifies whether Windows Firewall with Advanced Security uses the settings for the Domain profile to filter network traffic. If you select Off, Windows Firewall with Advanced Security will not use any of the firewall rules or connection security rules for this profile. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall (Private): Apply local connection security rules |Specifies whether local administrators are allowed to create connection security rules that apply together with connection security rules configured by Group Policy for the Private profile. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall (Private): Apply local firewall rules |Specifies whether local administrators are allowed to create local firewall rules that apply together with firewall rules configured by Group Policy for the Private profile. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall (Private): Behavior for outbound connections |Specifies the behavior for outbound connections for the Private profile that do not match an outbound firewall rule. The default value of 0 means to allow connections, and a value of 1 means to block connections. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall (Private): Display notifications |Specifies whether Windows Firewall with Advanced Security displays notifications to the user when a program is blocked from receiving inbound connections, for the Private profile. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall (Private): Use profile settings |Specifies whether Windows Firewall with Advanced Security uses the settings for the Private profile to filter network traffic. If you select Off, Windows Firewall with Advanced Security will not use any of the firewall rules or connection security rules for this profile. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall (Public): Apply local connection security rules |Specifies whether local administrators are allowed to create connection security rules that apply together with connection security rules configured by Group Policy for the Public profile. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall (Public): Apply local firewall rules |Specifies whether local administrators are allowed to create local firewall rules that apply together with firewall rules configured by Group Policy for the Public profile. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall (Public): Behavior for outbound connections |Specifies the behavior for outbound connections for the Public profile that do not match an outbound firewall rule. The default value of 0 means to allow connections, and a value of 1 means to block connections. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall (Public): Display notifications |Specifies whether Windows Firewall with Advanced Security displays notifications to the user when a program is blocked from receiving inbound connections, for the Public profile. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall (Public): Use profile settings |Specifies whether Windows Firewall with Advanced Security uses the settings for the Public profile to filter network traffic. If you select Off, Windows Firewall with Advanced Security will not use any of the firewall rules or connection security rules for this profile. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall: Domain: Allow unicast response |Specifies whether Windows Firewall with Advanced Security permits the local computer to receive unicast responses to its outgoing multicast or broadcast messages; for the Domain profile. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall: Private: Allow unicast response |Specifies whether Windows Firewall with Advanced Security permits the local computer to receive unicast responses to its outgoing multicast or broadcast messages; for the Private profile. |
|Audit HITRUST/HIPAA controls and deploy specific VM Extensions to support audit requirements |Windows Firewall: Public: Allow unicast response |Specifies whether Windows Firewall with Advanced Security permits the local computer to receive unicast responses to its outgoing multicast or broadcast messages; for the Public profile. |

## Next steps

Additional articles about blueprints and how to use them:

- Learn about the [blueprint lifecycle](../concepts/lifecycle.md).
- Understand how to use [static and dynamic parameters](../concepts/parameters.md).
- Learn to customize the [blueprint sequencing order](../concepts/sequencing-order.md).
- Find out how to make use of [blueprint resource locking](../concepts/resource-locking.md).
- Learn how to [update existing assignments](../how-to/update-existing-assignments.md).
