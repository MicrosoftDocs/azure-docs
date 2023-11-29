---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 11/21/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Preview\]: Enable system-assigned identity to SQL VM](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7148a409-0d59-4baa-925b-b3aae486a14e) |Enable system-assigned identity at scale to SQL virtual machines. You need to assign this policy at subscription level. Assign at resource group level will not work as expected. |DeployIfNotExists, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL%20Server/SQLIaaS_EnableSAIOnSQLVM_DeployIfNotExists.json) |
|[Configure Arc-enabled Servers with SQL Server extension installed to enable or disable SQL best practices assessment.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff36de009-cacb-47b3-b936-9c4c9120d064) |Enable or disable SQL best practices assessment on the SQL server instances on your Arc-enabled servers to evaluate best practices. Learn more at [https://aka.ms/azureArcBestPracticesAssessment](https://aka.ms/azureArcBestPracticesAssessment). |DeployIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL%20Server/ArcEnabledSQLServer_EnableBestPracticesAssessment.json) |
|[Subscribe eligible Arc-enabled SQL Servers instances to Extended Security Updates.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff692cc79-76fb-4c61-8861-467e454ac6f8) |Subscribe eligible Arc-enabled SQL Servers instances with License Type set to Paid or PAYG to Extended Security Updates. More on extended security updates [https://go.microsoft.com/fwlink/?linkid=2239401](https://go.microsoft.com/fwlink/?linkid=2239401). |DeployIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL%20Server/ArcEnabledSQLServer_SubscribeESU_DINE.json) |
