---
ms.service: azure-policy
ms.topic: include
ms.date: 05/23/2025
ms.author: jasongroce
author: jasongroce
ms.custom:
  - generated
  - build-2025
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Key Vault should have firewall enabled or public network access disabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F55615ac9-af46-4a59-874e-391cc3dfb490) |Enable the key vault firewall so that the key vault is not accessible by default to any public IPs or disable public network access for your key vault so that it's not accessible over the public internet. Optionally, you can configure specific IP ranges to limit access to those networks. Learn more at: [https://docs.microsoft.com/azure/key-vault/general/network-security](/azure/key-vault/general/network-security) and [https://aka.ms/akvprivatelink](https://aka.ms/akvprivatelink) |Audit, Deny, Disabled |[3.3.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/FirewallEnabled_Audit.json) |
