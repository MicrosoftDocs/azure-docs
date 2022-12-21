---
title: Integrate Azure Key Vault with Azure Policy
description: Learn how to integrate Azure Key Vault with Azure Policy
author: msmbaldwin
ms.author: mbaldwin
ms.date: 03/31/2021
ms.service: key-vault
ms.subservice: general
ms.topic: how-to

---

# Integrate Azure Managed HSM with Azure Policy

[Azure Policy](../../governance/policy/index.yml) is a governance tool that gives users the ability to audit and manage their Azure environment at scale. Azure Policy provides the ability to place guardrails on Azure resources to ensure they are compliant with assigned policy rules. It allows users to perform audit, real-time enforcement, and remediation of their Azure environment. The results of audits performed by policy will be available to users in a compliance dashboard where they will be able to see a drill down of which resources and components are compliant and which are not.  For more information, see the [Overview of the Azure Policy service](../../governance/policy/overview.md).

Example Usage Scenarios:

- You currently don't have a solution to perform an audit across your organization, or you are conducting manual audits of your environment by asking individual teams within your organization to report their compliance. You are looking for a way to automate this task, perform audits in real time, and guarantee the accuracy of the audit.
- You want to enforce your company security policies and stop individuals from creating certain cryptographic keys, but you don't have an automated way to block their creation. 
- You want to relax some requirements for your test teams, but you want to maintain tight controls over your production environment. You need a simple automated way to separate enforcement of your resources.
- You want to be sure that you can roll-back enforcement of new policies in the event of a live-site issue. You need a one-click solution to turn off enforcement of the policy. 
- You are relying on a 3rd party solution for auditing your environment and you want to use an internal Microsoft offering.

## Types of policy effects and guidance

**Audit**: When the effect of a policy is set to audit, the policy will not cause any breaking changes to your environment. It will only alert you to components such as keys that do not comply with the policy definitions within a specified scope, by marking these components as non-compliant in the policy compliance dashboard. Audit is default if no policy effect is selected.

**Deny**: When the effect of a policy is set to deny, the policy will block the creation of new components such as weaker keys as well as block new versions of existing keys that do not comply with the policy definition. Existing non-compliant resources within a Managed HSM are not affected. The 'audit' capabilities will continue to operate.

# [Data plane policies](#tab/data-plane)

### Keys using elliptic curve cryptography should have the specified curve names 

If you use elliptic curve cryptography or ECC keys, you can customize an allowed list of curve names from the list below. The default option allows all the following curve names.

- P-256
- P-256K
- P-384
- P-521

### Keys should have expirations dates set

This policy audits all keys in your Managed HSMs and flags keys that do not have an expiration date set as non-compliant. You can also use this policy to block the creation of keys that do not have an expiration date set.

### Keys should have more than the specified number of days before expiration

If a key is too close to expiration, an organizational delay to rotate the key may result in an outage. Keys should be rotated at a specified number of days prior to expiration to provide sufficient time to react to a failure. This policy will audit keys that are too close to their expiration date and allows you to set this threshold in days. You can also use this policy to prevent the creation of new keys that are too close to their expiration date.

### Keys using RSA cryptography should have a specified minimum key size

Using RSA keys with smaller key sizes is not a secure design practice. You may be subject to audit and certification standards that mandate the use of a minimum key size. The following policy allows you to set a minimum key size requirement on your Managed HSM. You can audit keys that do not meet this minimum requirement. This policy can also be used to block the creation of new keys that do not meet the minimum key size requirement.

---

## Enabling and managing a Managed HSM policy through the Azure CLI

1. Register preview feature in your subscription.
   In the subscription that customer owns, run the following Azure CLI command line as Contributor or Owner role of the subscription,

        az feature register --namespace Microsoft.KeyVault --name MHSMGovernance
   
   If there is existing HSM pools in this subscription, update will be carried to these pools. Full enablement of the policy may take upto 30 mins.
   Reference: https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/preview-features?tabs=azure-cli 

2. Giving permission to scan daily.

    To check the compliance of the pool's inventory keys, customer need to assign "Managed HSM Crypto Auditor" role to "Azure Key Vault Managed HSM Key Governance Service"(App Id: a1b76039-a76c-499f-a2dd-846b4cc32627) so it can access key's metadata. Without the grant of permission, inventory keys are not going to be reported on Azure Policy compliance report, only new keys, updated keys, imported keys and rotated keys will be checked on compliance. To do this, a user who has role of "Managed HSM Administrator" to the Managed HSM needs to run the following Azure CLI commands:

On windows:
az ad sp show --id a1b76039-a76c-499f-a2dd-846b4cc32627 --query objectId
Copy the id printed, paste it in the following command:

az keyvault role assignment create --scope / --role "Managed HSM Crypto Auditor" --assignee-object-id "the id printed in previous command" --hsm-name <hsm name>

On Linux or Windows Subsystem of Linux:
spId=$(az ad sp show --id a1b76039-a76c-499f-a2dd-846b4cc32627 --query objectId|cut -d "\"" -f2)
echo $spId
az keyvault role assignment create --scope / --role "Managed HSM Crypto Auditor" --assignee-object-id $spId --hsm-name <hsm name>

3. Create policy assignments - define rules of audit and/or deny.

   Policy assignments have concrete values defined for policy definitions' parameters. In Azure Portal [https://portal.azure.com/?Microsoft_Azure_ManagedHSM_assettypeoptions=%7B%22ManagedHSM%22:%7B%22options%22:%22%22%7D%7D&Microsoft_Azure_ManagedHSM=true&feature.canmodifyextensions=true} (also in private preview), go to "Policy" blade, filter on the "Key Vault" category, find these 4 preview key governance policy definitions. Click on one of them, then click "Assign" button on top, fill in each field (If this is a denying policy assignment, better put good name about the policy, because when a request is denied, the policy assignment's name will appear in the error), click Next,
   Uncheck "Only show parameters that need input or review", and enter values for parameters of the policy definition. Skip the "Remediation", and create the assignment. The service will need up to 30 minutes to enforce "Deny" assignments.
   
[Preview]: Azure Key Vault Managed HSM keys should have an expiration date
[Preview]: Azure Key Vault Managed HSM keys using RSA cryptography should have a specified minimum key size
[Preview]: Azure Key Vault Managed HSM Keys should have more than the specified number of days before expiration
[Preview]: Azure Key Vault Managed HSM keys using elliptic curve cryptography should have the specified curve names

  You can also do this by Azure CLI, see document
  https://learn.microsoft.com/en-us/azure/governance/policy/assign-policy-azurecli 

4. Test your setup

    Try to update/create a key that violates the rule, if you have a policy assignment with effect "Deny", it will return 403 to your request.
    Review the scan result of inventory keys of auditing policy assignments. After 12 hours, check the Policy blade's Compliance menu, filter on the "Key Vault" category, and find your assignments. Click on each of them, to check the compliance result report.

## Troubleshooting
  
    If there is no compliance results of a pool after 1 day. Check if the role assignment has been done on step 2 successfully. Without Step 2, the key governance service won't be able to access key's metadata. "az keyvault role assignment list" cli command can verify whether the role has been assigned.


> [!NOTE]
> Azure Policy
> [Resource Provider modes](../../governance/policy/concepts/definition-structure.md#resource-provider-modes),
> such as those for Azure Key Vault, provide information about compliance on the
> [Component Compliance](../../governance/policy/how-to/get-compliance-data.md#component-compliance)
> page.

## Next Steps

- [Logging and frequently asked questions for Azure policy for key vault](../general/troubleshoot-azure-policy-for-key-vault.md)
- Learn more about the [Azure Policy service](../../governance/policy/overview.md)
- See Key Vault samples: [Key Vault built-in policy definitions](../../governance/policy/samples/built-in-policies.md#key-vault)
- Learn about [Microsoft cloud securiy benchmark on Key vault](/security/benchmark/azure/baselines/key-vault-security-baseline)
