---
title: Reference table for all data security recommendations in Microsoft Defender for Cloud
description: This article lists all Microsoft Defender for Cloud data security recommendations that help you harden and protect your resources.
author: dcurwin
ms.service: defender-for-cloud
ms.topic: reference
ms.date: 03/13/2024
ms.author: dacurwin
ms.custom: generated
ai-usage: ai-assisted
---

# Data security recommendations

This article lists all the data security recommendations you might see in Microsoft Defender for Cloud.

The recommendations that appear in your environment are based on the resources that you're protecting and on your customized configuration.

To learn about actions that you can take in response to these recommendations, see [Remediate recommendations in Defender for Cloud](implement-security-recommendations.md).


> [!TIP]
> If a recommendation description says *No related policy*, usually it's because that recommendation is dependent on a different recommendation.
>
> For example, the recommendation *Endpoint protection health failures should be remediated* relies on the recommendation that checks whether an endpoint protection solution is installed (*Endpoint protection solution should be installed*). The underlying recommendation *does* have a policy.
> Limiting policies to only foundational recommendations simplifies policy management.




## Azure data recommendations

### [Azure Cosmos DB should disable public network access](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/334a182c-7c2c-41bc-ae1e-55327891ab50)

**Description**: Disabling public network access improves security by ensuring that your Cosmos DB account isn't exposed on the public internet. Creating private endpoints can limit exposure of your Cosmos DB account. [Learn more](../cosmos-db/how-to-configure-private-endpoints.md#blocking-public-network-access-during-account-creation).
(Related policy: [Azure Cosmos DB should disable public network access](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f797b37f7-06b8-444c-b1ad-fc62867f335a)).

**Severity**: Medium

### [(Enable if required) Azure Cosmos DB accounts should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/814df446-7128-eff0-9177-fa52ac035b74)

**Description**: Recommendations to use customer-managed keys for encryption of data at rest are not assessed by default, but are available to enable for applicable scenarios. Data is encrypted automatically using platform-managed keys, so the use of customer-managed keys should only be applied when obligated by compliance or restrictive policy requirements.
To enable this recommendation, navigate to your Security Policy for the applicable scope, and update the *Effect* parameter for the corresponding policy to audit or enforce the use of customer-managed keys. Learn more in [Manage security policies](tutorial-security-policy.md).
Use customer-managed keys to manage the encryption at rest of your Azure Cosmos DB. By default, the data is encrypted at rest with service-managed keys, but customer-managed keys (CMK) are commonly required to meet regulatory compliance standards. CMKs enable the data to be encrypted with an Azure Key Vault key created and owned by you. You have full control and responsibility for the key lifecycle, including rotation and management. Learn more about CMK encryption at <https://aka.ms/cosmosdb-cmk>.
(Related policy: [Azure Cosmos DB accounts should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f1f905d99-2ab7-462c-a6b0-f709acca6c8f)).

**Severity**: Low





### [(Enable if required) Azure Machine Learning workspaces should be encrypted with a customer-managed key (CMK)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/bbd14f11-6228-4588-82a4-517b8d77b23f)

**Description**: Recommendations to use customer-managed keys for encryption of data at rest are not assessed by default, but are available to enable for applicable scenarios. Data is encrypted automatically using platform-managed keys, so the use of customer-managed keys should only be applied when obligated by compliance or restrictive policy requirements.
To enable this recommendation, navigate to your Security Policy for the applicable scope, and update the *Effect* parameter for the corresponding policy to audit or enforce the use of customer-managed keys. Learn more in [Manage security policies](tutorial-security-policy.md).
Manage encryption at rest of your Azure Machine Learning workspace data with customer-managed keys (CMK). By default, customer data is encrypted with service-managed keys, but CMKs are commonly required to meet regulatory compliance standards. CMKs enable the data to be encrypted with an Azure Key Vault key created and owned by you. You have full control and responsibility for the key lifecycle, including rotation and management. Learn more about CMK encryption at <https://aka.ms/azureml-workspaces-cmk>.
(Related policy: [Azure Machine Learning workspaces should be encrypted with a customer-managed key (CMK)](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fba769a63-b8cc-4b2d-abf6-ac33c7204be8)).

**Severity**: Low


### [Azure SQL Database should be running TLS version 1.2 or newer](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/8e9a37b9-2828-4c8f-a24e-7b0ab0e89c78)

**Description**: Setting TLS version to 1.2 or newer improves security by ensuring your Azure SQL Database can only be accessed from clients using TLS 1.2 or newer. Using versions of TLS less than 1.2 is not recommended since they have well documented security vulnerabilities.
(Related policy: [Azure SQL Database should be running TLS version 1.2 or newer](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f32e6bbec-16b6-44c2-be37-c5b672d103cf)).

**Severity**: Medium

### [Azure SQL Managed Instances should disable public network access](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/a2624c52-2937-400c-af9d-3bf2d97382bf)

**Description**: Disabling public network access (public endpoint) on Azure SQL Managed Instances improves security by ensuring that they can only be accessed from inside their virtual networks or via Private Endpoints. Learn more about [public network access](https://aka.ms/mi-public-endpoint).
(Related policy: [Azure SQL Managed Instances should disable public network access](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f9dfea752-dd46-4766-aed1-c355fa93fb91)).

**Severity**: Medium

### [Cosmos DB accounts should use private link](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/80dc29d6-9887-4071-a66c-e763376c2de3)

**Description**: Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. When private endpoints are mapped to your Cosmos DB account, data leakage risks are reduced. Learn more about [private links](../cosmos-db/how-to-configure-private-endpoints.md).
(Related policy: [Cosmos DB accounts should use private link](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f58440f8a-10c5-4151-bdce-dfbaad4a20b7)).

**Severity**: Medium


### [(Enable if required) MySQL servers should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6b51b7f7-cbed-75bf-8a02-43384bf47562)

**Description**: Recommendations to use customer-managed keys for encryption of data at rest are not assessed by default, but are available to enable for applicable scenarios. Data is encrypted automatically using platform-managed keys, so the use of customer-managed keys should only be applied when obligated by compliance or restrictive policy requirements.
To enable this recommendation, navigate to your Security Policy for the applicable scope, and update the *Effect* parameter for the corresponding policy to audit or enforce the use of customer-managed keys. Learn more in [Manage security policies](tutorial-security-policy.md).
Use customer-managed keys to manage the encryption at rest of your MySQL servers. By default, the data is encrypted at rest with service-managed keys, but customer-managed keys (CMK) are commonly required to meet regulatory compliance standards. CMKs enable the data to be encrypted with an Azure Key Vault key created and owned by you. You have full control and responsibility for the key lifecycle, including rotation and management.
(Related policy: [Bring your own key data protection should be enabled for MySQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f83cef61d-dbd1-4b20-a4fc-5fbc7da10833)).

**Severity**: Low

### [(Enable if required) PostgreSQL servers should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/19d45f8f-245c-852e-dbf9-d4aab4758b1f)

**Description**: Recommendations to use customer-managed keys for encryption of data at rest are not assessed by default, but are available to enable for applicable scenarios. Data is encrypted automatically using platform-managed keys, so the use of customer-managed keys should only be applied when obligated by compliance or restrictive policy requirements.
To enable this recommendation, navigate to your Security Policy for the applicable scope, and update the *Effect* parameter for the corresponding policy to audit or enforce the use of customer-managed keys. Learn more in [Manage security policies](tutorial-security-policy.md).
Use customer-managed keys to manage the encryption at rest of your PostgreSQL servers. By default, the data is encrypted at rest with service-managed keys, but customer-managed keys (CMK) are commonly required to meet regulatory compliance standards. CMKs enable the data to be encrypted with an Azure Key Vault key created and owned by you. You have full control and responsibility for the key lifecycle, including rotation and management.
(Related policy: [Bring your own key data protection should be enabled for PostgreSQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f18adea5e-f416-4d0f-8aa8-d24321e3e274)).

**Severity**: Low

### [(Enable if required) SQL managed instances should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/06ac6ef4-1e66-1334-5418-6e79ab444ce0)

**Description**: Recommendations to use customer-managed keys for encryption of data at rest are not assessed by default, but are available to enable for applicable scenarios. Data is encrypted automatically using platform-managed keys, so the use of customer-managed keys should only be applied when obligated by compliance or restrictive policy requirements.
To enable this recommendation, navigate to your Security Policy for the applicable scope, and update the *Effect* parameter for the corresponding policy to audit or enforce the use of customer-managed keys. Learn more in [Manage security policies](tutorial-security-policy.md).
Implementing Transparent Data Encryption (TDE) with your own key provides you with increased transparency and control over the TDE Protector, increased security with an HSM-backed external service, and promotion of separation of duties. This recommendation applies to organizations with a related compliance requirement.
(Related policy: [SQL managed instances should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f048248b0-55cd-46da-b1ff-39efd52db260)).

**Severity**: Low

### [(Enable if required) SQL servers should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1a93e945-3675-aef6-075d-c661498e1046)

**Description**: Recommendations to use customer-managed keys for encryption of data at rest are not assessed by default, but are available to enable for applicable scenarios. Data is encrypted automatically using platform-managed keys, so the use of customer-managed keys should only be applied when obligated by compliance or restrictive policy requirements.
To enable this recommendation, navigate to your Security Policy for the applicable scope, and update the *Effect* parameter for the corresponding policy to audit or enforce the use of customer-managed keys. Learn more in [Manage security policies](tutorial-security-policy.md).
Implementing Transparent Data Encryption (TDE) with your own key provides increased transparency and control over the TDE Protector, increased security with an HSM-backed external service, and promotion of separation of duties. This recommendation applies to organizations with a related compliance requirement.
(Related policy: [SQL servers should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f0d134df8-db83-46fb-ad72-fe0c9428c8dd)).

**Severity**: Low

### [(Enable if required) Storage accounts should use customer-managed key (CMK) for encryption](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ca98bba7-719e-48ee-e193-0b76766cdb07)

**Description**: Recommendations to use customer-managed keys for encryption of data at rest are not assessed by default, but are available to enable for applicable scenarios. Data is encrypted automatically using platform-managed keys, so the use of customer-managed keys should only be applied when obligated by compliance or restrictive policy requirements.
To enable this recommendation, navigate to your Security Policy for the applicable scope, and update the *Effect* parameter for the corresponding policy to audit or enforce the use of customer-managed keys. Learn more in [Manage security policies](tutorial-security-policy.md).
Secure your storage account with greater flexibility using customer-managed keys (CMKs). When you specify a CMK, that key is used to protect and control access to the key that encrypts your data. Using CMKs provides additional capabilities to control rotation of the key encryption key or cryptographically erase data.
(Related policy: [Storage accounts should use customer-managed key (CMK) for encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f6fac406b-40ca-413b-bf8e-0bf964659c25)).

**Severity**: Low

### [All advanced threat protection types should be enabled in SQL managed instance advanced data security settings](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ebe970fe-9c27-4dd7-a165-1e943d565e10)

**Description**: It is recommended to enable all advanced threat protection types on your SQL managed instances. Enabling all types protects against SQL injection, database vulnerabilities, and any other anomalous activities.
(No related policy)

**Severity**: Medium

### [All advanced threat protection types should be enabled in SQL server advanced data security settings](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f7010359-8d21-4598-a9f2-c3e81a17141e)

**Description**: It is recommended to enable all advanced threat protection types on your SQL servers. Enabling all types protects against SQL injection, database vulnerabilities, and any other anomalous activities.
(No related policy)

**Severity**: Medium

### [API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/74e7dcff-317f-9635-41d2-ead5019acc99)

**Description**: Azure Virtual Network deployment provides enhanced security, isolation, and allows you to place your API Management service in a non-internet routable network that you control access to. These networks can then be connected to your on-premises networks using various VPN technologies, which enable access to your backend services within the network and/or on-premises. The developer portal and API gateway can be configured to be accessible either from the Internet or only within the virtual network.
(Related policy: [API Management services should use a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fef619a2c-cc4d-4d03-b2ba-8c94a834d85b)).

**Severity**: Medium

### [App Configuration should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8318c3a1-fcac-2e1d-9582-50912e5578e5)

**Description**: Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The private link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to your app configuration instances instead of the entire service, you'll also be protected against data leakage risks. Learn more at: <https://aka.ms/appconfig/private-endpoint>.
(Related policy: [App Configuration should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fca610c1d-041c-4332-9d88-7ed3094967c7)).

**Severity**: Medium

### [Audit retention for SQL servers should be set to at least 90 days](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/620671b8-6661-273a-38ac-4574967750ec)

**Description**: Audit SQL servers configured with an auditing retention period of less than 90 days.
(Related policy: [SQL servers should be configured with 90 days auditing retention or higher.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f89099bee-89e0-4b26-a5f4-165451757743))

**Severity**: Low

### [Auditing on SQL server should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/94208a8b-16e8-4e5b-abbd-4e81c9d02bee)

**Description**: Enable auditing on your SQL Server to track database activities across all databases on the server and save them in an audit log.
(Related policy: [Auditing on SQL server should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fa6fb4358-5bf4-4ad7-ba82-2cd2f41ce5e9)).

**Severity**: Low

### [Auto provisioning of the Log Analytics agent should be enabled on subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/af849052-4299-0692-acc0-bffcbe9e440c)

**Description**: To monitor for security vulnerabilities and threats, Microsoft Defender for Cloud collects data from your Azure virtual machines. Data is collected by the Log Analytics agent, formerly known as the Microsoft Monitoring Agent (MMA), which reads various security-related configurations and event logs from the machine and copies the data to your Log Analytics workspace for analysis. We recommend enabling auto provisioning to automatically deploy the agent to all supported Azure VMs and any new ones that are created.
(Related policy: [Auto provisioning of the Log Analytics agent should be enabled on your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f475aae12-b88a-4572-8b36-9b712b2b3a17)).

**Severity**: Low

### [Azure Cache for Redis should reside within a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/be264018-593c-1162-bd5e-b74a39396652)

**Description**: Azure Virtual Network (VNet) deployment provides enhanced security and isolation for your Azure Cache for Redis, as well as subnets, access control policies, and other features to further restrict access. When an Azure Cache for Redis instance is configured with a VNet, it is not publicly addressable and can only be accessed from virtual machines and applications within the VNet.
(Related policy: [Azure Cache for Redis should reside within a virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f7d092e0a-7acd-40d2-a975-dca21cae48c4)).

**Severity**: Medium

### [Azure Database for MySQL should have an Azure Active Directory administrator provisioned](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/8af8a87b-7aa6-4c83-b22b-36801896177b/)

**Description**: Provision an Azure AD administrator for your Azure Database for MySQL to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services
(Related policy: [An Azure Active Directory administrator should be provisioned for MySQL servers](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f146412e9-005c-472b-9e48-c87b72ac229e)).

**Severity**: Medium

### [Azure Database for PostgreSQL should have an Azure Active Directory administrator provisioned](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/b20d1b00-11a8-4ce7-b477-4ea6e147c345)

**Description**: Provision an Azure AD administrator for your Azure Database for PostgreSQL to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services  
(Related policy: [An Azure Active Directory administrator should be provisioned for PostgreSQL servers](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fb4dec045-250a-48c2-b5cc-e0c4eec8b5b4)).

**Severity**: Medium

### [Azure Cosmos DB accounts should have firewall rules](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/276b1952-c364-852b-11e5-657f0fa34dc6)

**Description**: Firewall rules should be defined on your Azure Cosmos DB accounts to prevent traffic from unauthorized sources. Accounts that have at least one IP rule defined with the virtual network filter enabled are deemed compliant. Accounts disabling public access are also deemed compliant.
(Related policy: [Azure Cosmos DB accounts should have firewall rules](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f862e97cf-49fc-4a5c-9de4-40d4e2e7c8eb)).

**Severity**: Medium

### [Azure Event Grid domains should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/bef092f5-bea7-3df3-1ee8-4376dd9c111e)

**Description**: Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The private link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to your Event Grid domains instead of the entire service, you'll also be protected against data leakage risks. Learn more at: <https://aka.ms/privateendpoints>.
(Related policy: [Azure Event Grid domains should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f9830b652-8523-49cc-b1b3-e17dce1127ca)).

**Severity**: Medium

### [Azure Event Grid topics should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/bdac9c7b-b9b8-f572-0450-f161c430861c)

**Description**: Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The private link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to your topics instead of the entire service, you'll also be protected against data leakage risks. Learn more at: <https://aka.ms/privateendpoints>.
(Related policy: [Azure Event Grid topics should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f4b90e17e-8448-49db-875e-bd83fb6f804f)).

**Severity**: Medium

### [Azure Machine Learning workspaces should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/692343df-7e70-b082-7b0e-67f97146cea3)

**Description**: Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The private link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to your Azure Machine Learning workspaces instead of the entire service, you'll also be protected against data leakage risks. Learn more at: <https://aka.ms/azureml-workspaces-privatelink>.
(Related policy: [Azure Machine Learning workspaces should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f40cec1dd-a100-4920-b15b-3024fe8901ab)).

**Severity**: Medium

### [Azure SignalR Service should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/b6f84d18-0137-3176-6aa1-f4d9ac95155c)

**Description**: Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The private link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to your  SignalR resources instead of the entire service, you'll also be protected against data leakage risks. Learn more at: <https://aka.ms/asrs/privatelink>.
(Related policy: [Azure SignalR Service should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f53503636-bcc9-4748-9663-5348217f160f)).

**Severity**: Medium

### [Azure Spring Cloud should use network injection](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4c768356-5ad2-e3cc-c799-252b27d3865a)

**Description**: Azure Spring Cloud instances should use virtual network injection for the following purposes: 1. Isolate Azure Spring Cloud from Internet. 2. Enable Azure Spring Cloud to interact with systems in either on premises data centers or Azure service in other virtual networks. 3. Empower customers to control inbound and outbound network communications for Azure Spring Cloud.
(Related policy: [Azure Spring Cloud should use network injection](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2faf35e2a4-ef96-44e7-a9ae-853dd97032c4)).

**Severity**: Medium

### [SQL servers should have an Azure Active Directory administrator provisioned](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f0553104-cfdb-65e6-759c-002812e38500)

**Description**: Provision an Azure AD administrator for your SQL server to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services.
(Related policy: [An Azure Active Directory administrator should be provisioned for SQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f1f314764-cb73-4fc9-b863-8eca98ac36e9)).

**Severity**: High

### [Azure Synapse Workspace authentication mode should be Azure Active Directory Only](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/3320d1ac-0ebe-41ab-b96c-96fb91214c5c)

**Description**: Azure Synapse Workspace authentication mode should be Azure Active Directory Only
 Azure Active Directory only authentication methods improves security by ensuring that Synapse Workspaces exclusively require Azure AD identities for authentication. [Learn more](https://aka.ms/Synapse).
(Related policy: [Synapse Workspaces should use only Azure Active Directory identities for authentication](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f2158ddbe-fefa-408e-b43f-d4faef8ff3b8)).

**Severity**: Medium

### [Code repositories should have code scanning findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c68a8c2a-6ed4-454b-9e37-4b7654f2165f)

**Description**: Defender for DevOps has found vulnerabilities in code repositories. To improve the security posture of the repositories, it is highly recommended to remediate these vulnerabilities.
(No related policy)

**Severity**: Medium

### [Code repositories should have Dependabot scanning findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/822425e3-827f-4f35-bc33-33749257f851)

**Description**: Defender for DevOps has found vulnerabilities in code repositories. To improve the security posture of the repositories, it is highly recommended to remediate these vulnerabilities.
(No related policy)

**Severity**: Medium

### [Code repositories should have infrastructure as code scanning findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/2ebc815f-7bc7-4573-994d-e1cc46fb4a35)

**Description**: Defender for DevOps has found infrastructure as code security configuration issues in repositories. The issues shown below have been detected in template files. To improve the security posture of the related cloud resources, it is highly recommended to remediate these issues.
(No related policy)

**Severity**: Medium

### [Code repositories should have secret scanning findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4e07c7d0-e06c-47d7-a4a9-8c7b748d1b27)

**Description**: Defender for DevOps has found a secret in code repositories. This should be remediated immediately to prevent a security breach. Secrets found in repositories can be leaked or discovered by adversaries, leading to compromise of an application or service. For Azure DevOps, the Microsoft Security DevOps CredScan tool only scans builds on which it has been configured to run. Therefore, results might not reflect the complete status of secrets in your repositories.
(No related policy)

**Severity**: High

### [Cognitive Services accounts should enable data encryption](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/cdcf4f71-60d3-540b-91e3-aa19792da364)

**Description**: This policy audits any Cognitive Services accounts that are not using data encryption. For each account with storage, you should enable data encryption with either customer managed or Microsoft managed key.
(Related policy: [Cognitive Services accounts should enable data encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f2bdd0062-9d75-436e-89df-487dd8e4b3c7)).

**Severity**: Low

### [Cognitive Services accounts should use customer owned storage or enable data encryption](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/aa395469-1687-78a7-bf76-f4614ef72977)

**Description**: This policy audits any Cognitive Services account not using customer owned storage nor data encryption. For each Cognitive Services account with storage, use either customer owned storage or enable data encryption. Aligns with Microsoft Cloud Security Benchmark.
(Related policy: [Cognitive Services accounts should use customer owned storage or enable data encryption.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f11566b39-f7f7-4b82-ab06-68d8700eb0a4))

**Severity**: Low

### [Diagnostic logs in Azure Data Lake Store should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ad5bbaeb-7632-5edf-f1c2-752075831ce8)

**Description**: Enable logs and retain them for up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.
(Related policy: [Diagnostic logs in Azure Data Lake Store should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f057ef27e-665e-4328-8ea3-04b3122bd9fb)).

**Severity**: Low

### [Diagnostic logs in Data Lake Analytics should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c6dad669-efd7-cd72-61c5-289935607791)

**Description**: Enable logs and retain them for up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.
(Related policy: [Diagnostic logs in Data Lake Analytics should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fc95c74d9-38fe-4f0d-af86-0c7d626a315c)).

**Severity**: Low

### [Email notification for high severity alerts should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/3869fbd7-5d90-84e4-37bd-d9a7f4ce9a24)

**Description**: To ensure the relevant people in your organization are notified when there is a potential security breach in one of your subscriptions, enable email notifications for high severity alerts in Defender for Cloud.
(Related policy: [Email notification for high severity alerts should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f6e2593d9-add6-4083-9c9b-4b7d2188c899)).

**Severity**: Low

### [Email notification to subscription owner for high severity alerts should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9f97e78d-88ee-a48d-abe2-5ef12954e7ea)

**Description**: To ensure your subscription owners are notified when there is a potential security breach in their subscription, set email notifications to subscription owners for high severity alerts in Defender for Cloud.
(Related policy: [Email notification to subscription owner for high severity alerts should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f0b15565f-aa9e-48ba-8619-45960f2c314d)).

**Severity**: Medium

### [Enforce SSL connection should be enabled for MySQL database servers](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1f6d29f6-4edb-ea39-042b-de8f123ddd39)

**Description**: Azure Database for MySQL supports connecting your Azure Database for MySQL server to client applications using Secure Sockets Layer (SSL).
Enforcing SSL connections between your database server and your client applications helps protect against 'man in the middle' attacks by encrypting the data stream between the server and your application.
This configuration enforces that SSL is always enabled for accessing your database server.
(Related policy: [Enforce SSL connection should be enabled for MySQL database servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fe802a67a-daf5-4436-9ea6-f6d821dd0c5d)).

**Severity**: Medium

### [Enforce SSL connection should be enabled for PostgreSQL database servers](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1fde2073-a488-17e9-9534-5a3b23379b4b)

**Description**: Azure Database for PostgreSQL supports connecting your Azure Database for PostgreSQL server to client applications using Secure Sockets Layer (SSL).
Enforcing SSL connections between your database server and your client applications helps protect against 'man in the middle' attacks by encrypting the data stream between the server and your application.
This configuration enforces that SSL is always enabled for accessing your database server.
(Related policy: [Enforce SSL connection should be enabled for PostgreSQL database servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fd158790f-bfb0-486c-8631-2dc6b4e8e6af)).

**Severity**: Medium

### [Function apps should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/afd071f0-ebaa-422b-bb2f-8a772a31db75)

**Description**: Runtime vulnerability scanning for functions scans your function apps for security vulnerabilities and exposes detailed findings. Resolving the vulnerabilities can greatly improve your serverless applications security posture and protect them from attacks.
(No related policy)

**Severity**: High

### [Geo-redundant backup should be enabled for Azure Database for MariaDB](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/2ce368b5-7882-89fd-6645-885b071a2409)

**Description**: Azure Database for MariaDB allows you to choose the redundancy option for your database server.
It can be set to a geo-redundant backup storage in which the data is not only stored within the region in which your server is hosted, but is also replicated to a paired region to provide recovery options in case of a region failure.
Configuring geo-redundant storage for backup is only allowed when creating a server.
(Related policy: [Geo-redundant backup should be enabled for Azure Database for MariaDB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f0ec47710-77ff-4a3d-9181-6aa50af424d0)).

**Severity**: Low

### [Geo-redundant backup should be enabled for Azure Database for MySQL](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8ad68a2f-c6b1-97b5-41b5-174359a33688)

**Description**: Azure Database for MySQL allows you to choose the redundancy option for your database server.
It can be set to a geo-redundant backup storage in which the data is not only stored within the region in which your server is hosted, but is also replicated to a paired region to provide recovery options in case of a region failure.
Configuring geo-redundant storage for backup is only allowed when creating a server.
(Related policy: [Geo-redundant backup should be enabled for Azure Database for MySQL](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f82339799-d096-41ae-8538-b108becf0970)).

**Severity**: Low

### [Geo-redundant backup should be enabled for Azure Database for PostgreSQL](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/95592ab0-ddc8-660d-67f3-6df1fadfe7ec)

**Description**: Azure Database for PostgreSQL allows you to choose the redundancy option for your database server.
It can be set to a geo-redundant backup storage in which the data is not only stored within the region in which your server is hosted, but is also replicated to a paired region to provide recovery options in case of a region failure.
Configuring geo-redundant storage for backup is only allowed when creating a server.
(Related policy: [Geo-redundant backup should be enabled for Azure Database for PostgreSQL](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f48af4db5-9b8b-401c-8e74-076be876a430)).

**Severity**: Low

### [GitHub repositories should have Code scanning enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6672df26-ff2e-4282-83c3-e2f20571bd11)

**Description**: GitHub uses code scanning to analyze code in order to find security vulnerabilities and errors in code. Code scanning can be used to find, triage, and prioritize fixes for existing problems in your code. Code scanning can also prevent developers from introducing new problems. Scans can be scheduled for specific days and times, or scans can be triggered when a specific event occurs in the repository, such as a push. If code scanning finds a potential vulnerability or error in code, GitHub displays an alert in the repository.   A vulnerability is a problem in a project's code that could be exploited to damage the confidentiality, integrity, or availability of the project.
(No related policy)

**Severity**: Medium

### [GitHub repositories should have Dependabot scanning enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/92643c1f-1a95-4b68-bbd2-5117f92d6e35)

**Description**: GitHub sends Dependabot alerts when it detects vulnerabilities in code dependencies that affect repositories. A vulnerability is a problem in a project's code that could be exploited to damage the confidentiality, integrity, or availability of the project or other projects that use its code. Vulnerabilities vary in type, severity, and method of attack. When code depends on a package that has a security vulnerability, this vulnerable dependency can cause a range of problems.
(No related policy)

**Severity**: Medium

### [GitHub repositories should have Secret scanning enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1a600c61-6443-4ab4-bd28-7a6b6fb4691d)

**Description**: GitHub scans repositories for known types of secrets, to prevent fraudulent use of secrets that were accidentally committed to repositories. Secret scanning will scan the entire Git history on all branches present in the GitHub repository for any secrets. Examples of secrets are tokens and private keys that a service provider can issue for authentication. If a secret is checked into a repository, anyone who has read access to the repository can use the secret to access the external service with those privileges. Secrets should be stored in a dedicated, secure location outside the repository for the project.
(No related policy)

**Severity**: High

### [Microsoft Defender for Azure SQL Database servers should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/58d72d9d-0310-4792-9a3b-6dd111093cdb)

**Description**: Microsoft Defender for SQL is a unified package that provides advanced SQL security capabilities.
It includes functionality for surfacing and mitigating potential database vulnerabilities, detecting anomalous activities that could indicate a threat to your database, and discovering and classifying sensitive data.

Protections from this plan are charged as shown on the [Defender plans](https://aka.ms/pricing-security-center) page. If you don't have any Azure SQL Database servers in this subscription, you won't be charged. If you later create Azure SQL Database servers on this subscription, they'll automatically be protected and charges will begin. Learn about the [pricing details per region](https://aka.ms/pricing-security-center).

Learn more in [Introduction to Microsoft Defender for SQL](defender-for-sql-introduction.md).
(Related policy: [Azure Defender for Azure SQL Database servers should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fmicrosoft.authorization%2fpolicyDefinitions%2f7fe3b40f-802b-4cdd-8bd4-fd799c948cc2)).

**Severity**: High

### [Microsoft Defender for DNS should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/aae10e53-8403-3576-5d97-3b00f97332b2)

**Description**: Microsoft Defender for DNS provides an additional layer of protection for your cloud resources by continuously monitoring all DNS queries from your Azure resources. Defender for DNS alerts you about suspicious activity at the DNS layer. Learn more in [Introduction to Microsoft Defender for DNS](defender-for-dns-introduction.md). Enabling this Defender plan results in charges. Learn about the pricing details per region on Defender for Cloud's pricing page: [Defender for Cloud Pricing](https://azure.microsoft.com/services/defender-for-cloud/#pricing).
(No related policy)

**Severity**: High

### [Microsoft Defender for open-source relational databases should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/b6a28450-dd5d-4ba4-8806-245e20ef6632)

**Description**: Microsoft Defender for open-source relational databases detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. Learn more in [Introduction to Microsoft Defender for open-source relational databases](defender-for-databases-introduction.md).

Enabling this plan will result in charges for protecting your open-source relational databases. If you don't have any open-source relational databases in this subscription, no charges will be incurred. If you create any open-source relational databases on this subscription in the future, they will automatically be protected and charges will begin at that time.
(No related policy)

**Severity**: High

### [Microsoft Defender for Resource Manager should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f0fb2a7e-16d5-849f-be57-86db712e9bd0)

**Description**: Microsoft Defender for Resource Manager automatically monitors the resource management operations in your organization. Defender for Cloud detects threats and alerts you about suspicious activity. Learn more in [Introduction to Microsoft Defender for Resource Manager](defender-for-resource-manager-introduction.md). Enabling this Defender plan results in charges. Learn about the pricing details per region on Defender for Cloud's pricing page: [Defender for Cloud Pricing](https://azure.microsoft.com/services/defender-for-cloud/#pricing).
(No related policy)

**Severity**: High

### [Microsoft Defender for SQL on machines should be enabled on workspaces](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e9c320f1-03a0-4d2b-9a37-84b3bdc2e281)

**Description**: Microsoft Defender for servers brings threat detection and advanced defenses for your Windows and Linux machines.
With this Defender plan enabled on your subscriptions but not on your workspaces, you're paying for the full capability of Microsoft Defender for servers but missing out on some of the benefits.
When you enable Microsoft Defender for servers on a workspace, all machines reporting to that workspace will be billed for Microsoft Defender for servers - even if they're in subscriptions without Defender plans enabled. Unless you also enable Microsoft Defender for servers on the subscription, those machines won't be able to take advantage of just-in-time VM access, adaptive application controls, and network detections for Azure resources.
Learn more in [Introduction to Microsoft Defender for servers](defender-for-servers-introduction.md).
(No related policy)

**Severity**: Medium

### [Microsoft Defender for SQL servers on machines should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6ac66a74-761f-4a59-928a-d373eea3f028)

**Description**: Microsoft Defender for SQL is a unified package that provides advanced SQL security capabilities.
It includes functionality for surfacing and mitigating potential database vulnerabilities, detecting anomalous activities that could indicate a threat to your database, and discovering and classifying sensitive data.

Remediating this recommendation will result in charges for protecting your SQL servers on machines. If you don't have any SQL servers on machines in this subscription, no charges will be incurred.
If you create any SQL servers on machines on this subscription in the future, they will automatically be protected and charges will begin at that time.
[Learn more about Microsoft Defender for SQL servers on machines.](/azure/azure-sql/database/advanced-data-security)
(Related policy: [Azure Defender for SQL servers on machines should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fmicrosoft.authorization%2fpolicyDefinitions%2f6581d072-105e-4418-827f-bd446d56421b)).

**Severity**: High

### [Microsoft Defender for SQL should be enabled for unprotected Azure SQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/400a6682-992c-4726-9549-629fbc3b988f)

**Description**: Microsoft Defender for SQL is a unified package that provides advanced SQL security capabilities. It surfaces and mitigates potential database vulnerabilities, and detects anomalous activities that could indicate a threat to your database. Microsoft Defender for SQL is billed as shown on [pricing details per region](https://aka.ms/pricing-security-center).
(Related policy: [Advanced data security should be enabled on your SQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fmicrosoft.authorization%2fpolicydefinitions%2fabfb4388-5bf4-4ad7-ba82-2cd2f41ceae9)).

**Severity**: High

### [Microsoft Defender for SQL should be enabled for unprotected SQL Managed Instances](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ff6dbca8-d93c-49fc-92af-dc25da7faccd)

**Description**: Microsoft Defender for SQL is a unified package that provides advanced SQL security capabilities. It surfaces and mitigates potential database vulnerabilities, and detects anomalous activities that could indicate a threat to your database. Microsoft Defender for SQL is billed as shown on [pricing details per region](https://aka.ms/pricing-security-center).
(Related policy: [Advanced data security should be enabled on SQL Managed Instance](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fabfb7388-5bf4-4ad7-ba99-2cd2f41cebb9)).

**Severity**: High

### [Microsoft Defender for Storage should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1be22853-8ed1-4005-9907-ddad64cb1417)

**Description**: Microsoft Defender for storage detects unusual and potentially harmful attempts to access or exploit storage accounts.

Protections from this plan are charged as shown on the **Defender plans** page. If you don't have any Azure Storage accounts in this subscription, you won't be charged. If you later create Azure Storage accounts on this subscription, they'll automatically be protected and charges will begin. Learn about the [pricing details per region](https://aka.ms/pricing-security-center).
Learn more in [Introduction to Microsoft Defender for Storage](defender-for-storage-introduction.md).
(Related policy: [Azure Defender for Storage should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fmicrosoft.authorization%2fpolicyDefinitions%2f308fbb08-4ab8-4e67-9b29-592e93fb94fa)).

**Severity**: High

### [Network Watcher should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f1f2f7dc-7bd5-18bf-c403-cbbdb7ec3d68)

**Description**: Network Watcher is a regional service that enables you to monitor and diagnose conditions at a network scenario level in, to, and from Azure. Scenario level monitoring enables you to diagnose problems at an end-to-end network level view. Network diagnostic and visualization tools available with Network Watcher help you understand, diagnose, and gain insights to your network in Azure.
(Related policy: [Network Watcher should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fb6e2945c-0b7b-40f5-9233-7a5323b5cdc6)).

**Severity**: Low

### [Private endpoint connections on Azure SQL Database should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/75396512-3323-9be4-059d-32ecb113c3de)

**Description**: Private endpoint connections enforce secure communication by enabling private connectivity to Azure SQL Database.
(Related policy: [Private endpoint connections on Azure SQL Database should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f7698e800-9299-47a6-b3b6-5a0fee576eed)).

**Severity**: Medium

### [Private endpoint should be enabled for MariaDB servers](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ca9b93fe-6f1f-676c-2f31-d20f88fdbe56)

**Description**: Private endpoint connections enforce secure communication by enabling private connectivity to Azure Database for MariaDB.
Configure a private endpoint connection to enable access to traffic coming only from known networks and prevent access from all other IP addresses, including within Azure.
(Related policy: [Private endpoint should be enabled for MariaDB servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f0a1302fb-a631-4106-9753-f3d494733990)).

**Severity**: Medium

### [Private endpoint should be enabled for MySQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/cec4922b-1eb3-cb74-660b-ffad9b9ac642)

**Description**: Private endpoint connections enforce secure communication by enabling private connectivity to Azure Database for MySQL.
Configure a private endpoint connection to enable access to traffic coming only from known networks and prevent access from all other IP addresses, including within Azure.
(Related policy: [Private endpoint should be enabled for MySQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f7595c971-233d-4bcf-bd18-596129188c49)).

**Severity**: Medium

### [Private endpoint should be enabled for PostgreSQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c5b83aed-f53d-5201-8ffb-1f9938de410a)

**Description**: Private endpoint connections enforce secure communication by enabling private connectivity to Azure Database for PostgreSQL.
Configure a private endpoint connection to enable access to traffic coming only from known networks and prevent access from all other IP addresses, including within Azure.
(Related policy: [Private endpoint should be enabled for PostgreSQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f0564d078-92f5-4f97-8398-b9f58a51f70b)).

**Severity**: Medium

### [Public network access on Azure SQL Database should be disabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/22e93e92-4a31-b4cd-d640-3ef908430aa6)

**Description**: Disabling the public network access property improves security by ensuring your Azure SQL Database can only be accessed from a private endpoint. This configuration denies all logins that match IP or virtual network based firewall rules.
(Related policy: [Public network access on Azure SQL Database should be disabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f1b8ca024-1d5c-4dec-8995-b1a932b41780)).

**Severity**: Medium

### [Public network access should be disabled for Cognitive Services accounts](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/684a5b6d-a270-61ce-306e-5cea400dc3a7)

**Description**: This policy audits any Cognitive Services account in your environment with public network access enabled. Public network access should be disabled so that only connections from private endpoints are allowed.
(Related policy: [Public network access should be disabled for Cognitive Services accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f0725b4dd-7e76-479c-a735-68e7ee23d5ca)).

**Severity**: Medium

### [Public network access should be disabled for MariaDB servers](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ab153e43-2fb5-0670-2117-70340851ea9b)

**Description**: Disable the public network access property to improve security and ensure your Azure Database for MariaDB can only be accessed from a private endpoint. This configuration strictly disables access from any public address space outside of Azure IP range, and denies all logins that match IP or virtual network-based firewall rules.
(Related policy: [Public network access should be disabled for MariaDB servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2ffdccbe47-f3e3-4213-ad5d-ea459b2fa077)).

**Severity**: Medium

### [Public network access should be disabled for MySQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d5d090f1-7d5c-9b38-7344-0ede8343276d)

**Description**: Disable the public network access property to improve security and ensure your Azure Database for MySQL can only be accessed from a private endpoint. This configuration strictly disables access from any public address space outside of Azure IP range, and denies all logins that match IP or virtual network-based firewall rules.
(Related policy: [Public network access should be disabled for MySQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fd9844e8a-1437-4aeb-a32c-0c992f056095)).

**Severity**: Medium

### [Public network access should be disabled for PostgreSQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/b34f9fe7-80cd-6fb3-2c5b-951993746ca8)

**Description**: Disable the public network access property to improve security and ensure your Azure Database for PostgreSQL can only be accessed from a private endpoint. This configuration disables access from any public address space outside of Azure IP range, and denies all logins that match IP or virtual network-based firewall rules.
(Related policy: [Public network access should be disabled for PostgreSQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fb52376f7-9612-48a1-81cd-1ffe4b61032c)).

**Severity**: Medium

### [Redis Cache should allow access only via SSL](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/35b25be2-d08a-e340-45ed-f08a95d804fc)

**Description**: Enable only connections via SSL to Redis Cache. Use of secure connections ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking.
(Related policy: [Only secure connections to your Azure Cache for Redis should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f22bee202-a82f-4305-9a2a-6d7f44d4dedb)).

**Severity**: High

### [SQL databases should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/82e20e14-edc5-4373-bfc4-f13121257c37)

**Description**: SQL Vulnerability assessment scans your database for security vulnerabilities, and exposes any deviations from best practices such as misconfigurations, excessive permissions, and unprotected sensitive data. Resolving the vulnerabilities found can greatly improve your database security posture. [Learn more](https://aka.ms/SQL-Vulnerability-Assessment/)
(Related policy: [Vulnerabilities on your SQL databases should be remediated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fmicrosoft.authorization%2fpolicydefinitions%2ffeedbf84-6b99-488c-acc2-71c829aa5ffc)).

**Severity**: High

### [SQL managed instances should have vulnerability assessment configured](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c42fc28d-1703-45fc-aaa5-39797f570513)

**Description**: Vulnerability assessment can discover, track, and help you remediate potential database vulnerabilities.
(Related policy: [Vulnerability assessment should be enabled on SQL Managed Instance](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f1b7aa243-30e4-4c9e-bca8-d0d3022b634a)).

**Severity**: High

### [SQL servers on machines should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f97aa83c-9b63-4f9a-99f6-b22c4398f936)

**Description**: SQL Vulnerability assessment scans your database for security vulnerabilities, and exposes any deviations from best practices such as misconfigurations, excessive permissions, and unprotected sensitive data. Resolving the vulnerabilities found can greatly improve your database security posture. [Learn more](https://aka.ms/explore-vulnerability-assessment-reports/)
(Related policy: [Vulnerabilities on your SQL servers on machine should be remediated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fmicrosoft.authorization%2fpolicydefinitions%2f6ba6d016-e7c3-4842-b8f2-4992ebc0d72d)).

**Severity**: High

### [SQL servers should have an Azure Active Directory administrator provisioned](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f0553104-cfdb-65e6-759c-002812e38500)

**Description**: Provision an Azure AD administrator for your SQL server to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services.
(Related policy: [An Azure Active Directory administrator should be provisioned for SQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f1f314764-cb73-4fc9-b863-8eca98ac36e9)).

**Severity**: High

### [SQL servers should have vulnerability assessment configured](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1db4f204-cb5a-4c9c-9254-7556403ce51c)

**Description**: Vulnerability assessment can discover, track, and help you remediate potential database vulnerabilities.
(Related policy: [Vulnerability assessment should be enabled on your SQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fef2a8f2a-b3d9-49cd-a8a8-9a3aaaf647d9)).

**Severity**: High

### [Storage account should use a private link connection](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/cdc78c07-02b0-4af0-1cb2-cb7c672a8b0a)

**Description**: Private links enforce secure communication, by providing private connectivity to the storage account
(Related policy: [Storage account should use a private link connection](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f6edd7eda-6dd8-40f7-810d-67160c639cd9)).

**Severity**: Medium

### [Storage accounts should be migrated to new Azure Resource Manager resources](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/47bb383c-8e25-95f0-c2aa-437add1d87d3)

**Description**: To benefit from new capabilities in Azure Resource Manager, you can migrate existing deployments from the Classic deployment model. Resource Manager enables security enhancements such as: stronger access control (RBAC), better auditing, ARM-based deployment and governance, access to managed identities, access to key vault for secrets, Azure AD-based authentication, and support for tags and resource groups for easier security management. [Learn more](../virtual-machines/windows/migration-classic-resource-manager-overview.md)
(Related policy: [Storage accounts should be migrated to new Azure Resource Manager resources](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f37e0d2fe-28a5-43d6-a273-67d37d1f5606)).

**Severity**: Low

### [Storage accounts should prevent shared key access](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/3b363842-30f5-4056-980d-3a40fa5de8b3)

**Description**: Audit requirement of Azure Active Directory (Azure AD) to authorize requests for your storage account. By default, requests can be authorized with either Azure Active Directory credentials, or by using the account access key for Shared Key authorization. Of these two types of authorization, Azure AD provides superior security and ease of use over shared Key, and is recommended by Microsoft.
(Related policy: [policy](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%8c6a50c6-9ffd-4ae7-986f-5fa6111f9a54))

**Severity**: Medium

### [Storage accounts should restrict network access using virtual network rules](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ad4f3ff1-30eb-5042-16ed-27198f640b8d)

**Description**: Protect your storage accounts from potential threats using virtual network rules as a preferred method instead of IP-based filtering. Disabling IP-based filtering prevents public IPs from accessing your storage accounts.
(Related policy: [Storage accounts should restrict network access using virtual network rules](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f2a1a9cdf-e04d-429a-8416-3bfb72a1b26f)).

**Severity**: Medium

### [Subscriptions should have a contact email address for security issues](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/77758c9d-8a56-5f54-6ff7-69a762ca6004)

**Description**: To ensure the relevant people in your organization are notified when there is a potential security breach in one of your subscriptions, set a security contact to receive email notifications from Defender for Cloud.
(Related policy: [Subscriptions should have a contact email address for security issues](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f4f4f78b8-e367-4b10-a341-d9a4ad5cf1c7))

**Severity**: Low

### [Transparent Data Encryption on SQL databases should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/651967bf-044e-4bde-8376-3e08e0600105)

**Description**: Enable transparent data encryption to protect data-at-rest and meet compliance requirements
(Related policy: [Transparent Data Encryption on SQL databases should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f17k78e20-9358-41c9-923c-fb736d382a12)).

**Severity**: Low

### [VM Image Builder templates should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f6b0e473-eb23-c3be-fe61-2ae3e8309530)

**Description**: Audit VM Image Builder templates that do not have a virtual network configured. When a virtual network is not configured, a public IP is created and used instead, which might directly expose resources to the internet and increase the potential attack surface.
(Related policy: [VM Image Builder templates should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f2154edb9-244f-4741-9970-660785bccdaa)).

**Severity**: Medium

### [Web Application Firewall (WAF) should be enabled for Application Gateway](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/efe75f01-6fff-5d9d-08e6-092b98d3fb3f)

**Description**: Deploy Azure Web Application Firewall (WAF) in front of public facing web applications for additional inspection of incoming traffic. Web Application Firewall (WAF) provides centralized protection of your web applications from common exploits and vulnerabilities such as SQL injections, Cross-Site Scripting, local and remote file executions. You can also restrict access to your web applications by countries/regions, IP address ranges, and other http(s) parameters via custom rules.
(Related policy: [Web Application Firewall (WAF) should be enabled for Application Gateway](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f564feb30-bf6a-4854-b4bb-0d2d2d1e6c66)).

**Severity**: Low

### [Web Application Firewall (WAF) should be enabled for Azure Front Door Service service](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0c02a769-03f1-c4d7-85a5-db5dca505c49)

**Description**: Deploy Azure Web Application Firewall (WAF) in front of public facing web applications for additional inspection of incoming traffic. Web Application Firewall (WAF) provides centralized protection of your web applications from common exploits and vulnerabilities such as SQL injections, Cross-Site Scripting, local and remote file executions. You can also restrict access to your web applications by countries/regions, IP address ranges, and other http(s) parameters via custom rules.
(Related policy: [Web Application Firewall (WAF) should be enabled for Azure Front Door Service?service](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f055aa869-bc98-4af8-bafc-23f1ab6ffe2c))

**Severity**: Low


## AWS data recommendations

### [Amazon Aurora clusters should have backtracking enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d0ef47dc-95aa-4765-a075-72c07df8acff)

**Description**: This control checks whether Amazon Aurora clusters have backtracking enabled.
Backups help you to recover more quickly from a security incident. They also strengthen the resilience of your systems. Aurora backtracking reduces the time to recover a database to a point in time. It doesn't require a database restore to do so.
For more information about backtracking in Aurora, see [Backtracking an Aurora DB cluster](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/AuroraMySQL.Managing.Backtrack.html) in the Amazon Aurora User Guide.

**Severity**: Medium

### [Amazon EBS snapshots shouldn't be publicly restorable](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/02e8de17-1a01-45cb-b906-6d07a78f4b3c)

**Description**: Amazon EBS snapshots shouldn't be publicly restorable by everyone unless explicitly allowed, to avoid accidental exposure of data. Additionally, permission to change Amazon EBS configurations should be restricted to authorized AWS accounts only.

**Severity**: High

### [Amazon ECS task definitions should have secure networking modes and user definitions](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0dc124a8-2a69-47c5-a4e1-678d725a33ab)

**Description**: This control checks whether an active Amazon ECS task definition that has host networking mode also has privileged or user container definitions.
 The control fails for task definitions that have host network mode and container definitions where privileged=false or is empty and user=root or is empty.
If a task definition has elevated privileges, it is because the customer specifically opted in to that configuration.
 This control checks for unexpected privilege escalation when a task definition has host networking enabled but the customer didn't opt in to elevated privileges.

**Severity**: High

### [Amazon Elasticsearch Service domains should encrypt data sent between nodes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9b63a099-6c0c-4354-848b-17de1f3c8ae3)

**Description**: This control checks whether Amazon ES domains have node-to-node encryption enabled. HTTPS (TLS) can be used to help prevent potential attackers from eavesdropping on or manipulating network traffic using person-in-the-middle or similar attacks. Only encrypted connections over HTTPS (TLS) should be allowed. Enabling node-to-node encryption for Amazon ES domains ensures that intra-cluster communications are encrypted in transit. There can be a performance penalty associated with this configuration. You should be aware of and test the performance trade-off before enabling this option.

**Severity**: Medium

### [Amazon Elasticsearch Service domains should have encryption at rest enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/cf747c91-14f3-4b30-aafe-eb12c18fd030)

**Description**: It's important to enable encryptions rest of Amazon ES domains to protect sensitive data

**Severity**: Medium

### [Amazon RDS database should be encrypted using customer managed key](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9137f5de-aac8-4cee-a22f-8d81f19be67f)

**Description**: This check identifies RDS databases that are encrypted with default KMS keys and not with customer managed keys. As a leading practice, use customer managed keys to encrypt the data on your RDS databases and maintain control of your keys and data on sensitive workloads.

**Severity**: Medium

### [Amazon RDS instance should be configured with automatic backup settings](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/894259c2-c1d5-47dc-b5c6-b242d5c76fdf)

**Description**: This check identifies RDS instances, which aren't set with the automatic backup setting. If Automatic Backup is set, RDS creates a storage volume snapshot of your DB instance, backing up the entire DB instance and not just individual databases, which provide for point-in-time recovery. The automatic backup happens during the specified backup window time and keeps the backups for a limited period of time as defined in the retention period. It's recommended to set automatic backups for your critical RDS servers that help in the data restoration process.

**Severity**: Medium

### [Amazon Redshift clusters should have audit logging enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e2a0ec17-447b-44b6-8646-c0b5584b6b0a)

**Description**: This control checks whether an Amazon Redshift cluster has audit logging enabled.
Amazon Redshift audit logging provides additional information about connections and user activities in your cluster. This data can be stored and secured in Amazon S3 and can be helpful in security audits and investigations. For more information, see [Database audit logging](https://docs.aws.amazon.com/redshift/latest/mgmt/db-auditing.html) in the *Amazon Redshift Cluster Management Guide*.

**Severity**: Medium

### [Amazon Redshift clusters should have automatic snapshots enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/7a152832-6600-49d1-89be-82e474190e13)

**Description**: This control checks whether Amazon Redshift clusters have automated snapshots enabled. It also checks whether the snapshot retention period is greater than or equal to seven.
Backups help you to recover more quickly from a security incident. They strengthen the resilience of your systems. Amazon Redshift takes periodic snapshots by default. This control checks whether automatic snapshots are enabled and retained for at least seven days. For more information about Amazon Redshift automated snapshots, see [Automated snapshots](https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-snapshots.html#about-automated-snapshots) in the *Amazon Redshift Cluster Management Guide*.

**Severity**: Medium

### [Amazon Redshift clusters should prohibit public access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/7f5ac036-11e1-4cda-89b5-a115b9ae4f72)

**Description**: We recommend Amazon Redshift clusters to avoid public accessibility by evaluating the 'publiclyAccessible' field in the cluster configuration item.

**Severity**: High

### [Amazon Redshift should have automatic upgrades to major versions enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/176f9062-64d0-4edd-bb0f-915012a6ef16)

**Description**: This control checks whether automatic major version upgrades are enabled for the Amazon Redshift cluster.
Enabling automatic major version upgrades ensures that the latest major version updates to Amazon Redshift clusters are installed during the maintenance window.
 These updates might include security patches and bug fixes. Keeping up to date with patch installation is an important step in securing systems.

**Severity**: Medium

### [Amazon SQS queues should be encrypted at rest](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/340a07a1-7d68-4562-ac25-df77c214fe13)

**Description**: This control checks whether Amazon SQS queues are encrypted at rest.
Server-side encryption (SSE) allows you to transmit sensitive data in encrypted queues. To protect the content of messages in queues, SSE uses keys managed in AWS KMS.
For more information, see [Encryption at rest](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-server-side-encryption.html) in the Amazon Simple Queue Service Developer Guide.

**Severity**: Medium

### [An RDS event notifications subscription should be configured for critical cluster events](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/65659c22-6588-405b-b118-614c2b4ead5b)

**Description**: This control checks whether an Amazon RDS event subscription exists that has notifications enabled for the following source type:
 Event category key-value pairs. DBCluster: [Maintenance and failure].
 RDS event notifications use Amazon SNS to make you aware of changes in the availability or configuration of your RDS resources. These notifications allow for rapid response.
For more information about RDS event notifications, see [Using Amazon RDS event notification](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.html) in the Amazon RDS User Guide.

**Severity**: Low

### [An RDS event notifications subscription should be configured for critical database instance events](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ff4f3ab3-8ed7-4b4f-a721-4c3b66a59140)

**Description**: This control checks whether an Amazon RDS event subscription exists with notifications enabled for the following source type:
 Event category key-value pairs. ```DBInstance```: [Maintenance, configuration change and failure].
RDS event notifications use Amazon SNS to make you aware of changes in the availability or configuration of your RDS resources. These notifications allow for rapid response.
For more information about RDS event notifications, see [Using Amazon RDS event notification](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.html) in the Amazon RDS User Guide.

**Severity**: Low

### [An RDS event notifications subscription should be configured for critical database parameter group events](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c6f24bb0-b696-451c-a26e-0cc9ea8e97e3)

**Description**: This control checks whether an Amazon RDS event subscription exists with notifications enabled for the following source type:
 Event category key-value pairs. DBParameterGroup: ["configuration","change"].
 RDS event notifications use Amazon SNS to make you aware of changes in the availability or configuration of your RDS resources. These notifications allow for rapid response.
For more information about RDS event notifications, see [Using Amazon RDS event notification](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.html) in the Amazon RDS User Guide.

**Severity**: Low

### [An RDS event notifications subscription should be configured for critical database security group events](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ab5c51fb-ecdb-46de-b8df-c28ae46ce5bc)

**Description**: This control checks whether an Amazon RDS event subscription exists with notifications enabled for the following source type: Event category key-value pairs.DBSecurityGroup: [Configuration, change, failure].
 RDS event notifications use Amazon SNS to make you aware of changes in the availability or configuration of your RDS resources. These notifications allow for a rapid response.
For more information about RDS event notifications, see [Using Amazon RDS event notification](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.html) in the Amazon RDS User Guide.

**Severity**: Low

### [API Gateway REST and WebSocket API logging should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/2cac0072-6f56-46f0-9518-ddec3660ee56)

**Description**: This control checks whether all stages of an Amazon API Gateway REST or WebSocket API have logging enabled.
 The control fails if logging isn't enabled for all methods of a stage or if logging Level is neither ERROR nor INFO.
 API Gateway REST or WebSocket API stages should have relevant logs enabled. API Gateway REST and WebSocket API execution logging provides detailed records of requests made to API Gateway REST and WebSocket API stages.
 The stages include API integration backend responses, Lambda authorizer responses, and the requestId for AWS integration endpoints.

**Severity**: Medium

### [API Gateway REST API cache data should be encrypted at rest](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1a0ce4e0-b61e-4ec7-ab65-aeaff3893bd3)

**Description**: This control checks whether all methods in API Gateway REST API stages that have cache enabled are encrypted. The control fails if any method in an API Gateway REST API stage is configured to cache and the cache isn't encrypted.
 Encrypting data at rest reduces the risk of data stored on disk being accessed by a user not authenticated to AWS. It adds another set of access controls to limit unauthorized users ability access the data. For example, API permissions are required to decrypt the data before it can be read.
 API Gateway REST API caches should be encrypted at rest for an added layer of security.

**Severity**: Medium

### [API Gateway REST API stages should be configured to use SSL certificates for backend authentication](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ec268d38-c94b-4df3-8b4e-5248fcaaf3fc)

**Description**: This control checks whether Amazon API Gateway REST API stages have SSL certificates configured.
 Backend systems use these certificates to authenticate that incoming requests are from API Gateway.
 API Gateway REST API stages should be configured with SSL certificates to allow backend systems to authenticate that requests originate from API Gateway.

**Severity**: Medium

### [API Gateway REST API stages should have AWS X-Ray tracing enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/5cbaff4f-f8d5-49fe-9fdc-63c4507ac670)

**Description**: This control checks whether AWS X-Ray active tracing is enabled for your Amazon API Gateway REST API stages.
 X-Ray active tracing enables a more rapid response to performance changes in the underlying infrastructure. Changes in performance could result in a lack of availability of the API.
 X-Ray active tracing provides real-time metrics of user requests that flow through your API Gateway REST API operations and connected services.

**Severity**: Low

### [API Gateway should be associated with an AWS WAF web ACL](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d69eb8b0-79ba-4963-a683-a96a8ea787e2)

**Description**: This control checks whether an API Gateway stage uses an AWS WAF web access control list (ACL).
 This control fails if an AWS WAF web ACL isn't attached to a REST API Gateway stage.
 AWS WAF is a web application firewall that helps protect web applications and APIs from attacks. It enables you to configure an ACL, which is a set of rules that allow, block, or count web requests based on customizable web security rules and conditions that you define.
 Ensure that your API Gateway stage is associated with an AWS WAF web ACL to help protect it from malicious attacks.

**Severity**: Medium

### [Application and Classic Load Balancers logging should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4ba5c359-495f-4ba6-9897-7fdbc0aed675)

**Description**: This control checks whether the Application Load Balancer and the Classic Load Balancer have logging enabled. The control fails if `access_logs.s3.enabled` is false.
Elastic Load Balancing provides access logs that capture detailed information about requests sent to your load balancer. Each log contains information such as the time the request was received, the client's IP address, latencies, request paths, and server responses. You can use access logs to analyze traffic patterns and to troubleshoot issues.
To learn more, see [Access logs for your Classic Load Balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/access-log-collection.html) in User Guide for Classic Load Balancers.

**Severity**: Medium

### [Attached EBS volumes should be encrypted at-rest](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0bde343a-0681-4ee2-883a-027cc1e655b8)

**Description**: This control checks whether the EBS volumes that are in an attached state are encrypted. To pass this check, EBS volumes must be in use and encrypted. If the EBS volume isn't attached, then it isn't subject to this check.
For an added layer of security of your sensitive data in EBS volumes, you should enable EBS encryption at rest. Amazon EBS encryption offers a straightforward encryption solution for your EBS resources that doesn't require you to build, maintain, and secure your own key management infrastructure. It uses AWS KMS customer master keys (CMK) when creating encrypted volumes and snapshots.
To learn more about Amazon EBS encryption, see [Amazon EBS encryption](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html) in the Amazon EC2 User Guide for Linux Instances.

**Severity**: Medium

### [AWS Database Migration Service replication instances shouldn't be public](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/132a70b8-ffda-457a-b7a3-e6f2e01fc0af)

**Description**: To protect your replicated instances from threats. A private replication instance should have a private IP address that you can't access outside of the replication network.
 A replication instance should have a private IP address when the source and target databases are in the same network, and the network is connected to the replication instance's VPC using a VPN, AWS Direct Connect, or VPC peering.
 You should also ensure that access to your AWS DMS instance configuration is limited to only authorized users.
 To do this, restrict users' IAM permissions to modify AWS DMS settings and resources.

**Severity**: High

### [Classic Load Balancer listeners should be configured with HTTPS or TLS termination](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/773667f7-6511-4aec-ae9c-e3286c56a254)

**Description**: This control checks whether your Classic Load Balancer listeners are configured with HTTPS or TLS protocol for front-end (client to load balancer) connections. The control is applicable if a Classic Load Balancer has listeners. If your Classic Load Balancer doesn't have a listener configured, then the control doesn't report any findings.
The control passes if the Classic Load Balancer listeners are configured with TLS or HTTPS for front-end connections.
The control fails if the listener isn't configured with TLS or HTTPS for front-end connections.
Before you start to use a load balancer, you must add one or more listeners. A listener is a process that uses the configured protocol and port to check for connection requests. Listeners can support both HTTP and HTTPS/TLS protocols. You should always use an HTTPS or TLS listener, so that the load balancer does the work of encryption and decryption in transit.

**Severity**: Medium

### [Classic Load Balancers should have connection draining enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/dd60e31e-073a-42b6-9b23-db7ca86fd5e0)

**Description**: This control checks whether Classic Load Balancers have connection draining enabled.
Enabling connection draining on Classic Load Balancers ensures that the load balancer stops sending requests to instances that are deregistering or unhealthy. It keeps the existing connections open. This is useful for instances in Auto Scaling groups, to ensure that connections aren't severed abruptly.

**Severity**: Medium

### [CloudFront distributions should have AWS WAF enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0e0d5964-2895-45b1-b646-fcded8d567be)

**Description**: This control checks whether CloudFront distributions are associated with either AWS WAF or AWS WAFv2 web ACLs. The control fails if the distribution isn't associated with a web ACL.
AWS WAF is a web application firewall that helps protect web applications and APIs from attacks. It allows you to configure a set of rules, called a web access control list (web ACL), that allow, block, or count web requests based on customizable web security rules and conditions that you define. Ensure your CloudFront distribution is associated with an AWS WAF web ACL to help protect it from malicious attacks.

**Severity**: Medium

### [CloudFront distributions should have logging enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/88114970-36db-42b3-9549-20608b1ab8ad)

**Description**: This control checks whether server access logging is enabled on CloudFront distributions. The control fails if access logging isn't enabled for a distribution.
 CloudFront access logs provide detailed information about every user request that CloudFront receives. Each log contains information such as the date and time the request was received, the IP address of the viewer that made the request, the source of the request, and the port number of the request from the viewer.
These logs are useful for applications such as security and access audits and forensics investigation. For more information on how to analyze access logs, see Querying Amazon CloudFront logs in the Amazon Athena User Guide.

**Severity**: Medium

### [CloudFront distributions should require encryption in transit](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a67adff8-625f-4891-9f61-43f837d18ad2)

**Description**: This control checks whether an Amazon CloudFront distribution requires viewers to use HTTPS directly or whether it uses redirection. The control fails if ViewerProtocolPolicy is set to allow-all for defaultCacheBehavior or for cacheBehaviors.
HTTPS (TLS) can be used to help prevent potential attackers from using person-in-the-middle or similar attacks to eavesdrop on or manipulate network traffic. Only encrypted connections over HTTPS (TLS) should be allowed. Encrypting data in transit can affect performance. You should test your application with this feature to understand the performance profile and the impact of TLS.

**Severity**: Medium

### [CloudTrail logs should be encrypted at rest using KMS CMKs](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/190f732b-c68e-4816-9961-aba074272627)

**Description**: We recommended configuring CloudTrail to use SSE-KMS.
Configuring CloudTrail to use SSE-KMS provides more confidentiality controls on log data as a given user must have S3 read permission on the corresponding log bucket and must be granted decrypt permission by the CMK policy.

**Severity**: Medium

### [Connections to Amazon Redshift clusters should be encrypted in transit](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/036bb56b-c442-4352-bb4c-5bd0353ad314)

**Description**: This control checks whether connections to Amazon Redshift clusters are required to use encryption in transit. The check fails if the Amazon Redshift cluster parameter require_SSL isn't set to *1*.
TLS can be used to help prevent potential attackers from using person-in-the-middle or similar attacks to eavesdrop on or manipulate network traffic. Only encrypted connections over TLS should be allowed. Encrypting data in transit can affect performance. You should test your application with this feature to understand the performance profile and the impact of TLS.

**Severity**: Medium

### [Connections to Elasticsearch domains should be encrypted using TLS 1.2](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/effb5011-f8db-45ac-b981-b5bdfd7beb88)

**Description**: This control checks whether connections to Elasticsearch domains are required to use TLS 1.2. The check fails if the Elasticsearch domain TLSSecurityPolicy isn't Policy-Min-TLS-1-2-2019-07.
HTTPS (TLS) can be used to help prevent potential attackers from using person-in-the-middle or similar attacks to eavesdrop on or manipulate network traffic. Only encrypted connections over HTTPS (TLS) should be allowed. Encrypting data in transit can affect performance. You should test your application with this feature to understand the performance profile and the impact of TLS. TLS 1.2 provides several security enhancements over previous versions of TLS.

**Severity**: Medium

### [DynamoDB tables should have point-in-time recovery enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/cc873508-40c1-41b6-8507-8a431d74f831)

**Description**: This control checks whether point-in-time recovery (PITR) is enabled for an Amazon DynamoDB table.
 Backups help you to recover more quickly from a security incident. They also strengthen the resilience of your systems. DynamoDB point-in-time recovery automates backups for DynamoDB tables. It reduces the time to recover from accidental delete or write operations.
 DynamoDB tables that have PITR enabled can be restored to any point in time in the last 35 days.

**Severity**: Medium

### [EBS default encryption should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/56406d4c-87b4-4aeb-b1cc-7f6312d78e0a)

**Description**: This control checks whether account-level encryption is enabled by default for Amazon Elastic Block Store(Amazon EBS).
 The control fails if the account level encryption isn't enabled.
When encryption is enabled for your account, Amazon EBS volumes and snapshot copies are encrypted at rest. This adds another layer of protection for your data.
For more information, see [Encryption by default](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#encryption-by-default) in the Amazon EC2 User Guide for Linux Instances.

The following instance types don't support encryption: R1, C1, and M1.

**Severity**: Medium

### [Elastic Beanstalk environments should have enhanced health reporting enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4170067b-345d-47ed-ab4a-c6b6046881f1)

**Description**: This control checks whether enhanced health reporting is enabled for your AWS Elastic Beanstalk environments.
Elastic Beanstalk enhanced health reporting enables a more rapid response to changes in the health of the underlying infrastructure. These changes could result in a lack of availability of the application.
Elastic Beanstalk enhanced health reporting provides a status descriptor to gauge the severity of the identified issues and identify possible causes to investigate. The Elastic Beanstalk health agent, included in supported Amazon Machine Images (AMIs), evaluates logs and metrics of environment EC2 instances.

**Severity**: Low

### [Elastic Beanstalk managed platform updates should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/820f6c6e-f73f-432c-8c60-cae1794ea150)

**Description**: This control checks whether managed platform updates are enabled for the Elastic Beanstalk environment.
Enabling managed platform updates ensures that the latest available platform fixes, updates, and features for the environment are installed. Keeping up to date with patch installation is an important step in securing systems.

**Severity**: High

### [Elastic Load Balancer shouldn't have ACM certificate expired or expiring in 90 days.](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a5e0d700-3de1-469a-96d2-6536d9a92604)

**Description**: This check identifies Elastic Load Balancers (ELB) which are using ACM certificates expired or expiring in 90 days. AWS Certificate Manager (ACM) is the preferred tool to provision, manage, and deploy your server certificates. With ACM. You can request a certificate or deploy an existing ACM or external certificate to AWS resources. As a best practice, it's recommended to reimport expiring/expired certificates while preserving the ELB associations of the original certificate.

**Severity**: High

### [Elasticsearch domain error logging to CloudWatch Logs should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f48af569-2e67-464b-9a62-b8df0f85bc5e)

**Description**: This control checks whether Elasticsearch domains are configured to send error logs to CloudWatch Logs.
You should enable error logs for Elasticsearch domains and send those logs to CloudWatch Logs for retention and response. Domain error logs can assist with security and access audits, and can help to diagnose availability issues.

**Severity**: Medium

### [Elasticsearch domains should be configured with at least three dedicated master nodes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/b4b9a67c-c315-4f9b-b06b-04867a453aab)

**Description**: This control checks whether Elasticsearch domains are configured with at least three dedicated master nodes. This control fails if the domain doesn't use dedicated master nodes. This control passes if Elasticsearch domains have five dedicated master nodes. However, using more than three master nodes might be unnecessary to mitigate the availability risk, and will result in more cost.
An Elasticsearch domain requires at least three dedicated master nodes for high availability and fault-tolerance. Dedicated master node resources can be strained during data node blue/green deployments because there are more nodes to manage. Deploying an Elasticsearch domain with at least three dedicated master nodes ensures sufficient master node resource capacity and cluster operations if a node fails.

**Severity**: Medium

### [Elasticsearch domains should have at least three data nodes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/994cbcb3-43d4-419d-b5c4-9adc558f3ca2)

**Description**: This control checks whether Elasticsearch domains are configured with at least three data nodes and zoneAwarenessEnabled is true.
An Elasticsearch domain requires at least three data nodes for high availability and fault-tolerance. Deploying an Elasticsearch domain with at least three data nodes ensures cluster operations if a node fails.

**Severity**: Medium

### [Elasticsearch domains should have audit logging enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/12ebb4cd-34b6-4c3a-bee9-7e35f4f6caff)

**Description**: This control checks whether Elasticsearch domains have audit logging enabled. This control fails if an Elasticsearch domain doesn't have audit logging enabled.
Audit logs are highly customizable. They allow you to track user activity on your Elasticsearch clusters, including authentication successes and failures, requests to OpenSearch, index changes, and incoming search queries.

**Severity**: Medium

### [Enhanced monitoring should be configured for RDS DB instances and clusters](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/93e5a579-dd2f-4a56-b827-ebbfe7376b16)

**Description**: This control checks whether enhanced monitoring is enabled for your RDS DB instances.
In Amazon RDS, Enhanced Monitoring enables a more rapid response to performance changes in underlying infrastructure. These performance changes could result in a lack of availability of the data. Enhanced Monitoring provides real-time metrics of the operating system that your RDS DB instance runs on. An agent is installed on the instance. The agent can obtain metrics more accurately than is possible from the hypervisor layer.
Enhanced Monitoring metrics are useful when you want to see how different processes or threads on a DB instance use the CPU. For more information, see [Enhanced Monitoring](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.html) in the *Amazon RDS User Guide*.

**Severity**: Low

### [Ensure rotation for customer created CMKs is enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/66748314-d51c-4d9c-b789-eebef29a7039)

**Description**: AWS Key Management Service (KMS) allows customers to rotate the backing key, which is key material stored within the KMS that is tied to the key ID of the Customer Created customer master key (CMK).
 It's the backing key that is used to perform cryptographic operations such as encryption and decryption.
 Automated key rotation currently retains all prior backing keys so that decryption of encrypted data can take place transparently. It's recommended that CMK key rotation be enabled.
 Rotating encryption keys helps reduce the potential impact of a compromised key as data encrypted with a new key can't be accessed with a previous key that might have been exposed.

**Severity**: Medium

### [Ensure S3 bucket access logging is enabled on the CloudTrail S3 bucket](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/759e80dc-92c2-4afd-afa3-c01294999363)

**Description**: S3 Bucket Access Logging generates a log that contains access records Ensure S3 bucket access logging is enabled on the CloudTrail S3 bucket for each request made to your S3 bucket.
 An access log record contains details about the request, such as the request type, the resources specified in the request worked, and the time and date the request was processed.
It's recommended that bucket access logging be enabled on the CloudTrail S3 bucket.
By enabling S3 bucket logging on target S3 buckets, it's possible to capture all events, which might affect objects within target buckets. Configuring logs to be placed in a separate bucket allows access to log information, which can be useful in security and incident response workflows.

**Severity**: Low

### [Ensure the S3 bucket used to store CloudTrail logs isn't publicly accessible](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a41f2846-4a59-44e9-89bb-1f62d4b03a85)

**Description**: CloudTrail logs a record of every API call made in your AWS account. These log files are stored in an S3 bucket.
 It's recommended that the bucket policy, or access control list (ACL), applied to the S3 bucket that CloudTrail logs to prevent public access to the CloudTrail logs.
Allowing public access to CloudTrail log content might aid an adversary in identifying weaknesses in the affected account's use or configuration.

**Severity**: High

### [IAM shouldn't have expired SSL/TLS certificates](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/03a8f33c-b01c-4dfc-b627-f98114715ae0)

**Description**: This check identifies expired SSL/TLS certificates. To enable HTTPS connections to your website or application in AWS, you need an SSL/TLS server certificate. You can use ACM or IAM to store and deploy server certificates. Removing expired SSL/TLS certificates eliminates the risk that an invalid certificate will be deployed accidentally to a resource such as AWS Elastic Load Balancer (ELB), which can damage the credibility of the application/website behind the ELB. This check generates alerts if there are any expired SSL/TLS certificates stored in AWS IAM. As a best practice, it's recommended to delete expired certificates.

**Severity**: High

### [Imported ACM certificates should be renewed after a specified time period](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/0e68b4d8-1a5e-47fc-a3eb-b3542fea43f1)

**Description**: This control checks whether ACM certificates in your account are marked for expiration within 30 days. It checks both imported certificates and certificates provided by AWS Certificate Manager.
ACM can automatically renew certificates that use DNS validation. For certificates that use email validation, you must respond to a domain validation email.
 ACM also doesn't automatically renew certificates that you import. You must renew imported certificates manually.
For more information about managed renewal for ACM certificates, see [Managed renewal for ACM certificates](https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html) in the AWS Certificate Manager User Guide.

**Severity**: Medium

### [Over-provisioned identities in accounts should be investigated to reduce the Permission Creep Index (PCI)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/2482620f-f324-4add-af68-2e01e27485e9)

**Description**: Over-provisioned identities in accounts should be investigated to reduce the Permission Creep Index (PCI) and to safeguard your infrastructure. Reduce the PCI by removing the unused high risk permission assignments. High PCI reflects risk associated with the identities with permissions that exceed their normal or required usage.

**Severity**: Medium

### [RDS automatic minor version upgrades should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d352afac-cebc-4e02-b474-7ef402fb1d65)

**Description**: This control checks whether automatic minor version upgrades are enabled for the RDS database instance.
Enabling automatic minor version upgrades ensures that the latest minor version updates to the relational database management system (RDBMS) are installed. These upgrades might include security patches and bug fixes. Keeping up to date with patch installation is an important step in securing systems.

**Severity**: High

### [RDS cluster snapshots and database snapshots should be encrypted at rest](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4f4fbc5e-0b10-4208-b52f-1f47f1c73b6a)

**Description**: This control checks whether RDS DB snapshots are encrypted.
This control is intended for RDS DB instances. However, it can also generate findings for snapshots of Aurora DB instances, Neptune DB instances, and Amazon DocumentDB clusters. If these findings aren't useful, then you can suppress them.
Encrypting data at rest reduces the risk that an unauthenticated user gets access to data that is stored on disk. Data in RDS snapshots should be encrypted at rest for an added layer of security.

**Severity**: Medium

### [RDS clusters should have deletion protection enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9e769650-868c-46f5-b8c0-1a8ba12a4c92)

**Description**: This control checks whether RDS clusters have deletion protection enabled.
This control is intended for RDS DB instances. However, it can also generate findings for Aurora DB instances, Neptune DB instances, and Amazon DocumentDB clusters. If these findings aren't useful, then you can suppress them.
Enabling cluster deletion protection is another layer of protection against accidental database deletion or deletion by an unauthorized entity.
When deletion protection is enabled, an RDS cluster can't be deleted. Before a deletion request can succeed, deletion protection must be disabled.

**Severity**: Low

### [RDS DB clusters should be configured for multiple Availability Zones](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/cdf441dd-0ab7-4ef2-a643-de12725e5d5d)

**Description**: RDS DB clusters should be configured for multiple the data that is stored.
 Deployment to multiple Availability Zones allows for automate Availability Zones to ensure availability of ed failover in the event of an Availability Zone availability issue and during regular RDS maintenance events.

**Severity**: Medium

### [RDS DB clusters should be configured to copy tags to snapshots](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/b9ed02d0-afca-4bed-838d-70bf31ecf19a)

**Description**: Identification and inventory of your IT assets is a crucial aspect of governance and security.
 You need to have visibility of all your RDS DB clusters so that you can assess their security posture and act on potential areas of weakness.
 Snapshots should be tagged in the same way as their parent RDS database clusters.
 Enabling this setting ensures that snapshots inherit the tags of their parent database clusters.

**Severity**: Low

### [RDS DB instances should be configured to copy tags to snapshots](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fcd891e5-c6a2-41ce-bca6-f49ec582f3ce)

**Description**: This control checks whether RDS DB instances are configured to copy all tags to snapshots when the snapshots are created.
Identification and inventory of your IT assets is a crucial aspect of governance and security.
 You need to have visibility of all your RDS DB instances so that you can assess their security posture and take action on potential areas of weakness.
 Snapshots should be tagged in the same way as their parent RDS database instances. Enabling this setting ensures that snapshots inherit the tags of their parent database instances.

**Severity**: Low

### [RDS DB instances should be configured with multiple Availability Zones](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/70ebbd01-cd79-4bc8-ae85-49f47ccdd5ad)

**Description**: This control checks whether high availability is enabled for your RDS DB instances.
 RDS DB instances should be configured for multiple Availability Zones (AZs). This ensures the availability of the data stored. Multi-AZ deployments allow for automated failover if there's an issue with Availability Zone availability and during regular RDS maintenance.

**Severity**: Medium

### [RDS DB instances should have deletion protection enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8e1f7933-faa9-4379-a9bd-697740dedac8)

**Description**: This control checks whether your RDS DB instances that use one of the listed database engines have deletion protection enabled.
Enabling instance deletion protection is another layer of protection against accidental database deletion or deletion by an unauthorized entity.
While deletion protection is enabled, an RDS DB instance can't be deleted. Before a deletion request can succeed, deletion protection must be disabled.

**Severity**: Low

### [RDS DB instances should have encryption at rest enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/bfa7d2aa-f362-11eb-9a03-0242ac130003)

**Description**: This control checks whether storage encryption is enabled for your Amazon RDS DB instances.
This control is intended for RDS DB instances. However, it can also generate findings for Aurora DB instances, Neptune DB instances, and Amazon DocumentDB clusters. If these findings aren't useful, then you can suppress them.
 For an added layer of security for your sensitive data in RDS DB instances, you should configure your RDS DB instances to be encrypted at rest. To encrypt your RDS DB instances and snapshots at rest, enable the encryption option for your RDS DB instances. Data that is encrypted at rest includes the underlying storage for DB instances, its automated backups, read replicas, and snapshots.
RDS encrypted DB instances use the open standard AES-256 encryption algorithm to encrypt your data on the server that hosts your RDS DB instances. After your data is encrypted, Amazon RDS handles authentication of access and decryption of your data transparently with a minimal impact on performance. You don't need to modify your database client applications to use encryption.
Amazon RDS encryption is currently available for all database engines and storage types. Amazon RDS encryption is available for most DB instance classes. To learn about DB instance classes that don't support Amazon RDS encryption, see [Encrypting Amazon RDS resources](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.Encryption.html) in the *Amazon RDS User Guide*.

**Severity**: Medium

### [RDS DB Instances should prohibit public access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/72f3b7f1-76b8-4cf5-8da5-4ba5745b512c)

**Description**: We recommend that you also ensure that access to your RDS instance's configuration is limited to authorized users only, by restricting users' IAM permissions to modify RDS instances' settings and resources.

**Severity**: High

### [RDS snapshots should prohibit public access](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f64521fc-a9f1-4d43-b667-8d94b4a202af)

**Description**: We recommend only allowing authorized principals to access the snapshot and change Amazon RDS configuration.

**Severity**: High

### [Remove unused Secrets Manager secrets](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/bfa82db5-c112-44f0-89e6-a9adfb9a4028)

**Description**: This control checks whether your secrets have been accessed within a specified number of days. The default value is 90 days. If a secret wasn't accessed within the defined number of days, this control fails.
Deleting unused secrets is as important as rotating secrets. Unused secrets can be abused by their former users, who no longer need access to these secrets. Also, as more users get access to a secret, someone might have mishandled and leaked it to an unauthorized entity, which increases the risk of abuse. Deleting unused secrets helps revoke secret access from users who no longer need it. It also helps to reduce the cost of using Secrets Manager. Therefore, it's essential to routinely delete unused secrets.

**Severity**: Medium

### [S3 buckets should have cross-region replication enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/35713036-bd12-4646-9b92-4c56a761a710)

**Description**: Enabling S3 cross-region replication ensures that multiple versions of the data are available in different distinct Regions.
 This allows you to protect your S3 bucket against DDoS attacks and data corruption events.

**Severity**: Low

### [S3 buckets should have server-side encryption enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/3cb793ab-20d3-4677-9723-024c8fed0c23)

**Description**: Enable server-side encryption to protect data in your S3 buckets.
 Encrypting the data can prevent access to sensitive data in the event of a data breach.

**Severity**: Medium

### [Secrets Manager secrets configured with automatic rotation should rotate successfully](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/bec42e2d-956b-4940-a37d-7c1b1e8c525f)

**Description**: This control checks whether an AWS Secrets Manager secret rotated successfully based on the rotation schedule. The control fails if **RotationOccurringAsScheduled** is **false**. The control doesn't evaluate secrets that don't have rotation configured.
Secrets Manager helps you improve the security posture of your organization. Secrets include database credentials, passwords, and third-party API keys. You can use Secrets Manager to store secrets centrally, encrypt secrets automatically, control access to secrets, and rotate secrets safely and automatically.
Secrets Manager can rotate secrets. You can use rotation to replace long-term secrets with short-term ones. Rotating your secrets limits how long an unauthorized user can use a compromised secret. For this reason, you should rotate your secrets frequently.
In addition to configuring secrets to rotate automatically, you should ensure that those secrets rotate successfully based on the rotation schedule.
To learn more about rotation, see [Rotating your AWS Secrets Manager secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html) in the AWS Secrets Manager User Guide.

**Severity**: Medium

### [Secrets Manager secrets should be rotated within a specified number of days](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/323f0eb4-ea19-4b55-83e9-d104009616b4)

**Description**: This control checks whether your secrets have been rotated at least once within 90 days.
Rotating secrets can help you to reduce the risk of an unauthorized use of your secrets in your AWS account. Examples include database credentials, passwords, third-party API keys, and even arbitrary text. If you don't change your secrets for a long period of time, the secrets are more likely to be compromised.
As more users get access to a secret, it can become more likely that someone mishandled and leaked it to an unauthorized entity. Secrets can be leaked through logs and cache data. They can be shared for debugging purposes and not changed or revoked once the debugging completes. For all these reasons, secrets should be rotated frequently.
You can configure your secrets for automatic rotation in AWS Secrets Manager. With automatic rotation, you can replace long-term secrets with short-term ones, significantly reducing the risk of compromise.
Security Hub recommends that you enable rotation for your Secrets Manager secrets. To learn more about rotation, see [Rotating your AWS Secrets Manager secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html) in the AWS Secrets Manager User Guide.

**Severity**: Medium

### [SNS topics should be encrypted at rest using AWS KMS](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/90917e06-2781-4857-9d74-9043c6475d03)

**Description**: This control checks whether an SNS topic is encrypted at rest using AWS KMS.
Encrypting data at rest reduces the risk of data stored on disk being accessed by a user not authenticated to AWS. It also adds another set of access controls to limit the ability of unauthorized users to access the data.
For example, API permissions are required to decrypt the data before it can be read. SNS topics should be [encrypted at-rest](https://docs.aws.amazon.com/sns/latest/dg/sns-server-side-encryption.html) for an added layer of security. For more information, see Encryption at rest in the Amazon Simple Notification Service Developer Guide.

**Severity**: Medium

### [VPC flow logging should be enabled in all VPCs](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/3428e584-0fa6-48c0-817e-6d689d7bb879)

**Description**: VPC Flow Logs provide visibility into network traffic that passes through the VPC and can be used to detect anomalous traffic or insight during security events.

**Severity**: Medium




## GCP data recommendations

### [Ensure '3625 (trace flag)' database flag for Cloud SQL SQL Server instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/631246fb-7192-4709-a0b3-b83e65e6b550)

**Description**: It's recommended to set "3625 (trace flag)" database flag for Cloud SQL SQL Server instance to "off."
 Trace flags are frequently used to diagnose performance issues or to debug stored procedures or complex computer systems, but they might also be recommended by Microsoft Support to address behavior that is negatively impacting a specific workload.
 All documented trace flags and those recommended by Microsoft Support are fully supported in a production environment when used as directed.
 "3625(trace log)" Limits the amount of information returned to users who aren't members of the sysadmin fixed server role, by masking the parameters of some error messages using '******.'
 This can help prevent disclosure of sensitive information. Hence this is recommended to disable this flag.
 This recommendation is applicable to SQL Server database instances.

**Severity**: Medium

### [Ensure 'external scripts enabled' database flag for Cloud SQL SQL Server instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/98b8908a-18b9-46ea-8c52-3f8db1da996f)

**Description**: It's recommended to set "external scripts enabled" database flag for Cloud SQL SQL Server instance to off.
 "external scripts enabled" enable the execution of scripts with certain remote language extensions.
 This property is OFF by default.
 When Advanced Analytics Services is installed, setup can optionally set this property to true.
 As the "External Scripts Enabled" feature allows scripts external to SQL such as files located in an R library to be executed, which could adversely affect the security of the system, hence this should be disabled.
 This recommendation is applicable to SQL Server database instances.

**Severity**: High

### [Ensure 'remote access' database flag for Cloud SQL SQL Server instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/dddbbe7d-7e32-47d8-b319-39cbb70b8f88)

**Description**: It's recommended to set "remote access" database flag for Cloud SQL SQL Server instance to "off."
 The "remote access" option controls the execution of stored procedures from local or remote servers on which instances of SQL Server are running.
 This default value for this option is 1.
 This grants permission to run local stored procedures from remote servers or remote stored procedures from the local server.
 To prevent local stored procedures from being run from a remote server or remote stored procedures from being run on the local server, this must be disabled.
 The Remote Access option controls the execution of local stored procedures on remote servers or remote stored procedures on local server.
 'Remote access' functionality can be abused to launch a Denial-of-Service (DoS) attack on remote servers by off-loading query processing to a target, hence this should be disabled.
 This recommendation is applicable to SQL Server database instances.

**Severity**: High

### [Ensure 'skip_show_database' database flag for Cloud SQL Mysql instance is set to 'on'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9e5b33de-bcfa-4044-93ce-4937bf8f0bbd)

**Description**: It's recommended to set "skip_show_database" database flag for Cloud SQL Mysql instance to "on."
 'skip_show_database' database flag prevents people from using the SHOW DATABASES statement if they don't have the SHOW DATABASES privilege.
 This can improve security if you have concerns about users being able to see databases belonging to other users.
 Its effect depends on the SHOW DATABASES privilege: If the variable value is ON, the SHOW DATABASES statement is permitted only to users who have the SHOW DATABASES privilege, and the statement displays all database names.
 If the value is OFF, SHOW DATABASES is permitted to all users, but displays the names of only those databases for which the user has the SHOW DATABASES or other privilege.
 This recommendation is applicable to Mysql database instances.

**Severity**: Low

### [Ensure that a Default Customer-managed encryption key (CMEK) is specified for all BigQuery Data Sets](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f024ea22-7e48-4b3b-a824-d61794c14bb4)

**Description**: BigQuery by default encrypts the data as rest by employing Envelope Encryption using Google managed cryptographic keys.
 The data is encrypted using the data encryption keys and data encryption keys themselves are further encrypted using key encryption keys.
This is seamless and does not require any additional input from the user.
However, if you want to have greater control, Customer-managed encryption keys (CMEK) can be used as encryption key management solution for BigQuery Data Sets.
BigQuery by default encrypts the data as rest by employing Envelope Encryption using Google managed cryptographic keys.
 This is seamless and doesn't require any additional input from the user.
For greater control over the encryption, customer-managed encryption keys (CMEK) can be used as encryption key management solution for BigQuery Data Sets.
 Setting a Default Customer-managed encryption key (CMEK) for a data set ensure any tables created in future will use the specified CMEK if none other is provided.

Google doesn't store your keys on its servers and can't access your protected data unless you provide the key.

This also means that if you forget or lose your key, there's no way for Google to recover the key or to recover any data encrypted with the lost key.

**Severity**: Medium

### [Ensure that all BigQuery Tables are encrypted with Customer-managed encryption key (CMEK)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/f4cfc689-cac8-4f45-8355-652dcda3ec55)

**Description**: BigQuery by default encrypts the data as rest by employing Envelope Encryption using Google managed cryptographic keys.
 The data is encrypted using the data encryption keys and data encryption keys themselves are further encrypted using key encryption keys.
 This is seamless and does not require any additional input from the user.
 However, if you want to have greater control, Customer-managed encryption keys (CMEK) can be used as encryption key management solution for BigQuery Data Sets.
 If CMEK is used, the CMEK is used to encrypt the data encryption keys instead of using google-managed encryption keys.
BigQuery by default encrypts the data as rest by employing Envelope Encryption using Google managed cryptographic keys.
This is seamless and doesn't require any additional input from the user.
For greater control over the encryption, customer-managed encryption keys (CMEK) can be used as encryption key management solution for BigQuery tables.
The CMEK is used to encrypt the data encryption keys instead of using google-managed encryption keys.
 BigQuery stores the table and CMEK association and the encryption/decryption is done automatically.
Applying the Default Customer-managed keys on BigQuery data sets ensures that all the new tables created in the future will be encrypted using CMEK but existing tables need to be updated to use CMEK individually.

Google doesn't store your keys on its servers and can't access your protected data unless you provide the key.
 This also means that if you forget or lose your key, there's no way for Google to recover the key or to recover any data encrypted with the lost key.

**Severity**: Medium

### [Ensure that BigQuery datasets are not anonymously or publicly accessible](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/dab1eea3-7693-4da3-af1b-2f73832655fa)

**Description**: It's recommended that the IAM policy on BigQuery datasets doesn't allow anonymous and/or public access.
  Granting permissions to allUsers or allAuthenticatedUsers allows anyone to access the dataset.
Such access might not be desirable if sensitive data is being stored in the dataset.
 Therefore, ensure that anonymous and/or public access to a dataset isn't allowed.

**Severity**: High

### [Ensure that Cloud SQL database instances are configured with automated backups](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/afaac6e6-6240-48a2-9f62-4e257b851311)

**Description**: It's recommended to have all SQL database instances set to enable automated backups.
 Backups provide a way to restore a Cloud SQL instance to recover lost data or recover from a problem with that instance.
 Automated backups need to be set for any instance that contains data that should be protected from loss or damage.
 This recommendation is applicable for SQL Server, PostgreSql, MySql generation 1, and MySql generation 2 instances.

**Severity**: High

### [Ensure that Cloud SQL database instances are not opened to the world](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/de78ebca-1ec6-4872-8061-8fcfb27752fc)

**Description**: Database Server should accept connections only from trusted Network(s)/IP(s) and restrict access from the world.
 To minimize attack surface on a Database server instance, only trusted/known and required IP(s) should be approved to connect to it.
 An authorized network shouldn't have IPs/networks configured to 0.0.0.0/0, which will allow access to the instance from anywhere in the world. Note that authorized networks apply only to instances with public IPs.

**Severity**: High

### [Ensure that Cloud SQL database instances do not have public IPs](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1658239d-caf7-471d-83c5-2e4c44afdcff)

**Description**: It's recommended to configure Second Generation Sql instance to use private IPs instead of public IPs.
 To lower the organization's attack surface, Cloud SQL databases shouldn't have public IPs.
 Private IPs provide improved network security and lower latency for your application.

**Severity**: High

### [Ensure that Cloud Storage bucket is not anonymously or publicly accessible](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d8305d96-2aa5-458d-92b7-f8418f5f3328)

**Description**: It's recommended that IAM policy on Cloud Storage bucket doesn't allows anonymous or public access.
Allowing anonymous or public access grants permissions to anyone to access bucket content.
 Such access might not be desired if you're storing any sensitive data.
 Hence, ensure that anonymous or public access to a bucket isn't allowed.

**Severity**: High

### [Ensure that Cloud Storage buckets have uniform bucket-level access enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/64b5cdbc-0633-49af-b63d-a9dc90560196)

**Description**: It's recommended that uniform bucket-level access is enabled on Cloud Storage buckets.
 It's recommended to use uniform bucket-level access to unify and simplify how you grant access to your Cloud Storage resources.
 Cloud Storage offers two systems for granting users permission to access your buckets and objects:
 Cloud Identity and Access Management (Cloud IAM) and Access Control Lists (ACLs).  
 These systems act in parallel - in order for a user to access a Cloud Storage resource, only one of the systems needs to grant the user permission.
 Cloud IAM is used throughout Google Cloud and allows you to grant a variety of permissions at the bucket and project levels.
 ACLs are used only by Cloud Storage and have limited permission options, but they allow you to grant permissions on a per-object basis.

 In order to support a uniform permissioning system, Cloud Storage has uniform bucket-level access.
 Using this feature disables ACLs for all Cloud Storage resources:
 access to Cloud Storage resources then is granted exclusively through Cloud IAM.
 Enabling uniform bucket-level access guarantees that if a Storage bucket isn't publicly accessible,
no object in the bucket is publicly accessible either.

**Severity**: Medium

### [Ensure that Compute instances have Confidential Computing enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/171e9492-73a7-43de-adce-6bd0a3cf6045)

**Description**: Google Cloud encrypts data at-rest and in-transit, but customer data must be decrypted for processing. Confidential Computing is a breakthrough technology that encrypts data in-use-while it's being processed.
 Confidential Computing environments keep data encrypted in memory and elsewhere outside the central processing unit (CPU).
Confidential VMs leverage the Secure Encrypted Virtualization (SEV) feature of AMD EPYC CPUs.
 Customer data will stay encrypted while it's used, indexed, queried, or trained on.
 Encryption keys are generated in hardware, per VM, and not exportable. Thanks to built-in hardware optimizations of both performance and security, there's no significant performance penalty to Confidential Computing workloads.
Confidential Computing enables customers' sensitive code and other data encrypted in memory during processing. Google doesn't have access to the encryption keys.
Confidential VM can help alleviate concerns about risk related to either dependency on Google infrastructure or Google insiders' access to customer data in the clear.

**Severity**: High

### [Ensure that retention policies on log buckets are configured using Bucket Lock](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/07ca1398-d477-400a-a9fc-4cfc78f723f9)

**Description**: Enabling retention policies on log buckets will protect logs stored in cloud storage buckets from being overwritten or accidentally deleted.
 It's recommended to set up retention policies and configure Bucket Lock on all storage buckets that are used as log sinks.
 Logs can be exported by creating one or more sinks that include a log filter and a destination. As Stackdriver Logging receives new log entries, they're compared against each sink.
 If a log entry matches a sink's filter, then a copy of the log entry is written to the destination.
 Sinks can be configured to export logs in storage buckets.
 It's recommended to configure a data retention policy for these cloud storage buckets and to lock the data retention policy; thus permanently preventing the policy from being reduced or removed.
 This way, if the system is ever compromised by an attacker or a malicious insider who wants to cover their tracks, the activity logs are definitely preserved for forensics and security investigations.

**Severity**: Low

### [Ensure that the Cloud SQL database instance requires all incoming connections to use SSL](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/13872d43-aac6-4018-9c89-507b8fe9be54)

**Description**: It's recommended to enforce all incoming connections to SQL database instance to use SSL.
 SQL database connections if successfully trapped (MITM); can reveal sensitive data like credentials, database queries, query outputs etc.
 For security, it's recommended to always use SSL encryption when connecting to your instance.
 This recommendation is applicable for Postgresql, MySql generation 1, and MySql generation 2 instances.

**Severity**: High

### [Ensure that the 'contained database authentication' database flag for Cloud SQL on the SQL Server instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/658ce98f-ecf1-4c14-967f-3c4faf130fbf)

**Description**: It's recommended to set "contained database authentication" database flag for Cloud SQL on the SQL Server instance is set to "off."
 A contained database includes all database settings and metadata required to define the database and has no configuration dependencies on the instance of the Database Engine where the database is installed.
 Users can connect to the database without authenticating a login at the Database Engine level.
 Isolating the database from the Database Engine makes it possible to easily move the database to another instance of SQL Server.
 Contained databases have some unique threats that should be understood and mitigated by SQL Server Database Engine administrators.
 Most of the threats are related to the USER WITH PASSWORD authentication process, which moves the authentication boundary from the Database Engine level to the database level, hence this is recommended to disable this flag.
 This recommendation is applicable to SQL Server database instances.

**Severity**: Medium

### [Ensure that the 'cross db ownership chaining' database flag for Cloud SQL SQL Server instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/26973a34-79a6-46a0-874f-358c8c00af05)

**Description**: It's recommended to set "cross db ownership chaining" database flag for Cloud SQL SQL Server instance to "off."
 Use the "cross db ownership" for chaining option to configure cross-database ownership chaining for an instance of Microsoft SQL Server.
 This server option allows you to control cross-database ownership chaining at the database level or to allow cross-database ownership chaining for all databases.
 Enabling "cross db ownership" isn't recommended unless all of the databases hosted by the instance of SQL Server must participate in cross-database ownership chaining and you're aware of the security implications of this setting.
 This recommendation is applicable to SQL Server database instances.

**Severity**: Medium

### [Ensure that the 'local_infile' database flag for a Cloud SQL Mysql instance is set to 'off'](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/633a87f4-bd71-45ce-9eca-c6bb8cbe8b21)

**Description**: It's recommended to set the local_infile database flag for a Cloud SQL MySQL instance to off.
The local_infile flag controls the server-side LOCAL capability for LOAD DATA statements. Depending on the local_infile setting, the server refuses or permits local data loading by clients that have LOCAL enabled on the client side.
To explicitly cause the server to refuse LOAD DATA LOCAL statements (regardless of how client programs and libraries are configured at build time or runtime), start ```mysqld``` with local_infile disabled. local_infile can also be set at runtime.
Due to security issues associated with the local_infile flag, it's recommended to disable it. This recommendation is applicable to MySQL database instances.

**Severity**: Medium

### [Ensure that the log metric filter and alerts exist for Cloud Storage IAM permission changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/2e14266c-76ea-4479-915e-4edaae7d78ec)

**Description**: It's recommended that a metric filter and alarm be established for Cloud Storage Bucket IAM changes.
Monitoring changes to cloud storage bucket permissions might reduce the time needed to detect and correct permissions on sensitive cloud storage buckets and objects inside the bucket.

**Severity**: Low

### [Ensure that the log metric filter and alerts exist for SQL instance configuration changes](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9dce022e-f7f9-4725-8a63-c0d4a868b4d3)

**Description**: It's recommended that a metric filter and alarm be established for SQL instance configuration changes.
Monitoring changes to SQL instance configuration changes might reduce the time needed to detect and correct misconfigurations done on the SQL server.
Below are a few of the configurable options that might impact the security posture of an SQL instance:

- Enable auto backups and high availability: Misconfiguration might adversely impact business continuity, disaster recovery, and high availability
- Authorize networks: Misconfiguration might increase exposure to untrusted networks

**Severity**: Low

### [Ensure that there are only GCP-managed service account keys for each service account](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/6991b2e9-ae9e-4e99-acb6-037c4b575215)

**Description**: User managed service accounts shouldn't have user-managed keys.
 Anyone who has access to the keys will be able to access resources through the service account. GCP-managed keys are used by Cloud Platform services such as App Engine and Compute Engine. These keys can't be downloaded. Google will keep the keys and automatically rotate them on an approximately weekly basis.
 User-managed keys are created, downloadable, and managed by users. They expire 10 years from creation.
For user-managed keys, the user has to take ownership of key management activities, which include:

- Key storage
- Key distribution
- Key revocation
- Key rotation
- Key protection from unauthorized users
- Key recovery

Even with key owner precautions, keys can be easily leaked by less than optimum common development practices like checking keys into the source code or leaving them in the Downloads directory, or accidentally leaving them on support blogs/channels. It's recommended to prevent user-managed service account keys.

**Severity**: Low

### [Ensure 'user connections' database flag for Cloud SQL SQL Server instance is set as appropriate](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/91f55b07-083c-4ec5-a2be-4b52bbc2e2df)

**Description**: It's recommended to set "user connections" database flag for Cloud SQL SQL Server instance according to organization-defined value.
 The "user connections" option specifies the maximum number of simultaneous user connections that are allowed on an instance of SQL Server.
 The actual number of user connections allowed also depends on the version of SQL Server that you're using, and also the limits of your application or applications and hardware.
 SQL Server allows a maximum of 32,767 user connections.
 Because user connections are a dynamic (self-configuring) option, SQL Server adjusts the maximum number of user connections automatically as needed, up to the maximum value allowable.
 For example, if only 10 users are logged in, 10 user connection objects are allocated.
 In most cases, you don't have to change the value for this option.
 The default is 0, which means that the maximum (32,767) user connections are allowed.
 This recommendation is applicable to SQL Server database instances.

**Severity**: Low

### [Ensure 'user options' database flag for Cloud SQL SQL Server instance is not configured](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fab1e680-86f0-4616-bee9-1b7394e49ade)

**Description**: It's recommended that, "user options" database flag for Cloud SQL SQL Server instance shouldn't be configured.
 The "user options" option specifies global defaults for all users.
 A list of default query processing options is established for the duration of a user's work session.
 The user options setting allows you to change the default values of the SET options (if the server's default settings aren't appropriate).
 A user can override these defaults by using the SET statement.
 You can configure user options dynamically for new logins.
 After you change the setting of user options, new login sessions use the new setting; current login sessions aren't affected.
 This recommendation is applicable to SQL Server database instances.

**Severity**: Low

### [Logging for GKE clusters should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/fa160a2c-e976-41cb-acff-1e1e3f1ed032)

**Description**: This recommendation evaluates whether the loggingService property of a cluster contains the location Cloud Logging should use to write logs.

**Severity**: High

### [Object versioning should be enabled on storage buckets where sinks are configured](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e836b239-c7dc-476a-9a85-829b565cbc59)

**Description**: This recommendation evaluates whether the enabled field in the bucket's versioning property is set to true.

**Severity**: High

### [Over-provisioned identities in projects should be investigated to reduce the Permission Creep Index (PCI)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a6cd9b98-3b29-4213-b880-43f0b0897b83)

**Description**: Over-provisioned identities in projects should be investigated to reduce the Permission Creep Index (PCI) and to safeguard your infrastructure. Reduce the PCI by removing the unused high risk permission assignments. High PCI reflects risk associated with the identities with permissions that exceed their normal or required usage.

**Severity**: Medium

### [Projects that have cryptographic keys should not have users with Owner permissions](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/986fe72e-466a-462d-a06e-c77b439c53c0)

**Description**: This recommendation evaluates the IAM allow policy in project metadata for principals assigned roles/Owner.

**Severity**: Medium

### [Storage buckets used as a log sink should not be publicly accessible](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/76261631-76ea-4bd4-b064-34a619be1de0)

**Description**: This recommendation evaluates the IAM policy of a bucket for the principals allUsers or allAuthenticatedUsers, which grant public access.

**Severity**: High

## Related content

- [Learn about security recommendations](security-policy-concept.md)
- [Review security recommendations](review-security-recommendations.md)
