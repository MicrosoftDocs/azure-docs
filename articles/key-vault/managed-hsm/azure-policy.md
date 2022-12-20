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

- You want to improve the security posture of your company by implementing requirements around minimum key sizes and maximum validity periods of certificates in your company's key vaults but you don't know which teams will be compliant and which are not.
- You currently don't have a solution to perform an audit across your organization, or you are conducting manual audits of your environment by asking individual teams within your organization to report their compliance. You are looking for a way to automate this task, perform audits in real time, and guarantee the accuracy of the audit.
- You want to enforce your company security policies and stop individuals from creating self-signed certificates, but you don't have an automated way to block their creation. 
- You want to relax some requirements for your test teams, but you want to maintain tight controls over your production environment. You need a simple automated way to separate enforcement of your resources.
- You want to be sure that you can roll-back enforcement of new policies in the event of a live-site issue. You need a one-click solution to turn off enforcement of the policy. 
- You are relying on a 3rd party solution for auditing your environment and you want to use an internal Microsoft offering.

## Types of policy effects and guidance

**Audit**: When the effect of a policy is set to audit, the policy will not cause any breaking changes to your environment. It will only alert you to components such as certificates that do not comply with the policy definitions within a specified scope, by marking these components as non-compliant in the policy compliance dashboard. Audit is default if no policy effect is selected.

**Deny**: When the effect of a policy is set to deny, the policy will block the creation of new components such as certificates as well as block new versions of existing components that do not comply with the policy definition. Existing non-compliant resources within a key vault are not affected. The 'audit' capabilities will continue to operate.

## Available "Built-In" Policy Definitions

Key Vault has created a set of policies, which can be used to manage key vaults and its key, certificate, and secret objects. These policies are 'Built-In', which means they don't require you to write any custom JSON to enable them and they are available in the Azure portal for you to assign. You can still customize certain parameters to fit your organization's needs.

# [Data plane policies](#tab/data-plane)

### Keys using elliptic curve cryptography should have the specified curve names 

If you use elliptic curve cryptography or ECC keys, you can customize an allowed list of curve names from the list below. The default option allows all the following curve names.

- P-256
- P-256K
- P-384
- P-521

### Keys should have expirations dates set

This policy audits all keys in your key vaults and flags keys that do not have an expiration date set as non-compliant. You can also use this policy to block the creation of keys that do not have an expiration date set.

### Keys should have more than the specified number of days before expiration

If a key is too close to expiration, an organizational delay to rotate the key may result in an outage. Keys should be rotated at a specified number of days prior to expiration to provide sufficient time to react to a failure. This policy will audit keys that are too close to their expiration date and allows you to set this threshold in days. You can also use this policy to prevent the creation of new keys that are too close to their expiration date.

### Keys using RSA cryptography should have a specified minimum key size

Using RSA keys with smaller key sizes is not a secure design practice. You may be subject to audit and certification standards that mandate the use of a minimum key size. The following policy allows you to set a minimum key size requirement on your key vault. You can audit keys that do not meet this minimum requirement. This policy can also be used to block the creation of new keys that do not meet the minimum key size requirement.

# [Control plane policies](#tab/control-plane)

### Key Vault should use a virtual network service endpoint

This policy audits any Key Vault not configured to use a virtual network service endpoint.

### Resource logs in Key Vault should be enabled

Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes when a security incident occurs or when your network is compromised

### Key vaults should have purge protection enabled

Malicious deletion of a key vault can lead to permanent data loss. A malicious insider in your organization can potentially delete and purge key vaults. Purge protection protects you from insider attacks by enforcing a mandatory retention period for soft deleted key vaults. No one inside your organization or Microsoft will be able to purge your key vaults during the soft delete retention period.

---

## Example Scenario

You manage a key vault used by multiple teams that contains 100 certificates, and you want to make sure that none of the certificates in the key vault are valid for longer than 2 years.

1. You assign the **Certificates should have the specified maximum validity period** policy, specify that the maximum validity period of a certificate is 24 months, and set the effect of the policy to "audit".
1. You view the [compliance report on the Azure portal](#view-compliance-results), and discover that 20 certificates are non-compliant and valid for > 2 years, and the remaining certificates are compliant. 
1. You contact the owners of these certificates and communicate the new security requirement that certificates cannot be valid for longer than 2 years. Some teams respond and 15 of the certificates were renewed with a maximum validity period of 2 years or less. Other teams do not respond, and you still have 5 non-compliant certificates in your key vault.
1. You change the effect of the policy you assigned to "deny". The 5 non-compliant certificates are not revoked, and they continue to function. However, they cannot be renewed with a validity period that is greater than 2 years.

## Enabling and managing a Key Vault policy through the Azure portal

### Select a Policy Definition

1. Log in to the Azure portal. 
1. Search "Policy" in the Search Bar and Select **Policy**.

    ![Screenshot that shows the Search Bar.](../media/policy-img1.png)

1. In the Policy window, select **Definitions**.

    ![Screenshot that highlights the Definitions option.](../media/policy-img2.png)

1. In the Category Filter, Unselect **Select All** and select **Key Vault**.

    ![Screenshot that shows the Category Filter and the selected Key Vault category.](../media/policy-img3.png)

1. Now you should be able to see all the policies available for Public Preview, for Azure Key Vault. Make sure you have read and understood the policy guidance section above and select a policy you want to assign to a scope.  

    ![Screenshot that shows the policies that are available for Public Preview.](../media/policy-img4.png)

### Assign a Policy to a Scope 

1. Select a policy you wish to apply, in this example, the **Manage Certificate Validity Period** policy is shown. Click the assign button in the top-left corner.

    ![Screenshot that shows the Manage Certificate Validity Period policy.](../media/policy-img5.png)
  
1. Select the subscription where you want the policy to be applied. You can choose to restrict the scope to only a single resource group within a subscription. If you want to apply the policy to the entire subscription and exclude some resource groups, you can also configure an exclusion list. Set the policy enforcement selector to **Enabled** if you want the effect of the policy (audit or deny) to occur or **Disabled** to turn the effect (audit or deny) off. 

    ![Screenshot that shows where you can choose to restrict the scope to only a single resource group within a subscription.](../media/policy-img6.png)

1. Click on the parameters tab at the top of the screen in order to specify the maximum validity period in months that you want. If you need to input the parameters, you can uncheck 'Only show parameters that need input or review' option. Select **audit** or **deny** for the effect of the policy following the guidance in the sections above. Then select the review + create button. 

    ![Screenshot that shows the Parameters tab where you can specify the maximum validity period in months that you want.](../media/policy-img7.png)

### View Compliance Results

1. Go back to the Policy blade and select the compliance tab. Click on the policy assignment you wish to view compliance results for.

    ![Screenshot that shows the Compliance tab where you can select the policy assignment you want to view compliance results for.](../media/policy-img8.png)

1. From this page you can filter results by compliant or non-compliant vaults. Here you can see a list of non-compliant key vaults within the scope of the policy assignment. A vault is considered non-compliant if any of the components (certificates) in the vault are non-compliant. You can select an individual vault to view the individual non-compliant components (certificates). 


    ![Screenshot that shows a list of non-compliant key vaults within the scope of the policy assignment.](../media/policy-img9.png)

1. View the name of the components within a vault that are non-compliant


    ![Screenshot that shows where you can view the name of the components within a vault that are non-compliant.](../media/policy-img10.png)

1. If you need to check whether users are being denied the ability to create resources within key vault, you can click on the **Component Events (preview)** tab to view a summary of denied certificate operations with the requestor and timestamps of requests. 


    ![Overview of how Azure Key Vault works](../media/policy-img11.png)

## Feature Limitations

Assigning a policy with a "deny" effect may take up to 30 mins (average case) and 1 hour (worst case) to start denying the creation of non-compliant resources. The delay refers to following scenarios -
1.	A new policy is assigned
2.	An existing policy assignment is modified
3.	A new KeyVault (resource) is created in a scope with existing policies.

The policy evaluation of existing components in a vault may take up to 1 hour (average case) and 2 hours (worst case) before compliance results are viewable in the portal UI. 
If the compliance results show up as "Not Started" it may be due to the following reasons:
- The policy valuation has not completed yet. Initial evaluation latency can take up to 2 hours in the worst-case scenario. 
- There are no key vaults in the scope of the policy assignment.
- There are no key vaults with certificates within the scope of the policy assignment.




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
