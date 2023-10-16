---
title: Reference table for all recommendations 
description: This article lists Microsoft Defender for Cloud's security recommendations that help you harden and protect your resources.
author: dcurwin
ms.service: defender-for-cloud
ms.topic: reference
ms.date: 09/27/2023
ms.author: dacurwin
ms.custom: generated
---
# Security recommendations - a reference guide

This article lists the recommendations you might see in Microsoft Defender for Cloud. The recommendations
shown in your environment depend on the resources you're protecting and your customized
configuration.

Recommendations in Defender for Cloud are based on the [Microsoft cloud security benchmark](/security/benchmark/azure/introduction).
the Microsoft cloud security benchmark is the Microsoft-authored set of guidelines for security
and compliance best practices based on common compliance frameworks. This widely respected benchmark
builds on the controls from the [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/azure/)
and the [National Institute of Standards and Technology (NIST)](https://www.nist.gov/) with a focus on
cloud-centric security.

To learn about how to respond to these recommendations, see
[Remediate recommendations in Defender for Cloud](implement-security-recommendations.md).

Your secure score is based on the number of security recommendations you've completed. To
decide which recommendations to resolve first, look at the severity of each one and its potential
impact on your secure score.

> [!TIP]
> If a recommendation's description says "No related policy", it's usually because that
> recommendation is dependent on a different recommendation and _its_ policy. For example, the
> recommendation "Endpoint protection health failures should be remediated...", relies on the
> recommendation that checks whether an endpoint protection solution is even _installed_ ("Endpoint
> protection solution should be installed..."). The underlying recommendation _does_ have a policy.
> Limiting the policies to only the foundational recommendation simplifies policy management.

## <a name='recs-appservices'></a>AppServices recommendations

[!INCLUDE [asc-recs-appservices](../../includes/asc-recs-appservices.md)]

## <a name='recs-compute'></a>Compute recommendations

[!INCLUDE [asc-recs-compute](../../includes/asc-recs-compute.md)]

## <a name='recs-container'></a>Container recommendations

[!INCLUDE [asc-recs-container](../../includes/asc-recs-container.md)]

## <a name='recs-data'></a>Data recommendations

[!INCLUDE [asc-recs-data](../../includes/asc-recs-data.md)]

## <a name='recs-identityandaccess'></a>IdentityAndAccess recommendations

[!INCLUDE [asc-recs-identityandaccess](../../includes/asc-recs-identityandaccess.md)]

## <a name='recs-iot'></a>IoT recommendations

[!INCLUDE [asc-recs-iot](../../includes/asc-recs-iot.md)]

## <a name='recs-networking'></a>Networking recommendations

[!INCLUDE [asc-recs-networking](../../includes/asc-recs-networking.md)]

## API recommendations

|Recommendation|Description & related policy|Severity|
|----|----|----|
|(Preview) Microsoft Defender for APIs should be enabled|Enable the Defender for APIs plan to discover and protect API resources against attacks and security misconfigurations. [Learn more](defender-for-apis-deploy.md)|High|
(Preview) Azure API Management APIs should be onboarded to Defender for APIs. | Onboarding APIs to Defender for APIs requires compute and memory utilization on the Azure API Management service. Monitor performance of your Azure API Management service while onboarding APIs, and scale out your Azure API Management resources as needed.|High|
(Preview) API endpoints that are unused should be disabled and removed from the Azure API Management service|As a security best practice, API endpoints that haven't received traffic for 30 days are considered unused, and should be removed from the Azure API Management service. Keeping unused API endpoints might pose a security risk. These might be APIs that should have been deprecated from the Azure API Management service, but have accidentally been left active. Such APIs typically do not receive the most up-to-date security coverage.|Low|
(Preview) API endpoints in Azure API Management should be authenticated|API endpoints published within Azure API Management should enforce authentication to help minimize security risk. Authentication mechanisms are sometimes implemented incorrectly or are missing. This allows attackers to exploit implementation flaws and to access data. For APIs published in Azure API Management, this recommendation assesses the execution of authentication via the Subscription Keys, JWT, and Client Certificate configured within Azure API Management. If none of these authentication mechanisms are executed during the API call, the API will receive this recommendation.|High

## API management recommendations

|Recommendation|Description & related policy|Severity|
|----|----|----|
|(Preview) API Management subscriptions should not be scoped to all APIs|API Management subscriptions should be scoped to a product or an individual API instead of all APIs, which could result in excessive data exposure.|Medium|
(Preview) API Management calls to API backends should not bypass certificate thumbprint or name validation| API Management should validate the backend server certificate for all API calls. Enable SSL certificate thumbprint and name validation to improve the API security.|Medium|
(Preview) API Management direct management endpoint should not be enabled|The direct management REST API in Azure API Management bypasses Azure Resource Manager role-based access control, authorization, and throttling mechanisms, thus increasing the vulnerability of your service.|Low|
(Preview) API Management APIs should use only encrypted protocols|APIs should be available only through encrypted protocols, like HTTPS or WSS. Avoid using unsecured protocols, such as HTTP or WS to ensure security of data in transit.|High
(Preview) API Management secret named values should be stored in Azure Key Vault|Named values are a collection of name and value pairs in each API Management service. Secret values can be stored either as encrypted text in API Management (custom secrets) or by referencing secrets in Azure Key Vault. Reference secret named values from Azure Key Vault to improve security of API Management and secrets. Azure Key Vault supports granular access management and secret rotation policies.|Medium
(Preview) API Management should disable public network access to the service configuration endpoints|To improve the security of API Management services, restrict connectivity to service configuration endpoints, like direct access management API, Git configuration management endpoint, or self-hosted gateways configuration endpoint.| Medium
(Preview) API Management minimum API version should be set to 2019-12-01 or higher|To prevent service secrets from being shared with read-only users, the minimum API version should be set to 2019-12-01 or higher.|Medium
(Preview) API Management calls to API backends should be authenticated|Calls from API Management to backends should use some form of authentication, whether via certificates or credentials. Does not apply to Service Fabric backends.|Medium

## AI recommendations

| Recommendation                                               | Description & related policy                                 | Severity |
| ------------------------------------------------------------ | ------------------------------------------------------------ | -------- |
| Resource logs in Azure Machine Learning Workspaces should be enabled (Preview) | Resource logs enable recreating activity trails to use for investigation purposes when a security incident occurs or when your network is compromised. | Medium   |
| Azure Machine Learning Workspaces should disable public network access (Preview) | Disabling public network access improves security by ensuring that the Machine Learning Workspaces aren't exposed on the public internet. You can control exposure of your workspaces by creating private endpoints instead. For more information, see [Configure a private endpoint for an Azure Machine Learning workspace](/azure/machine-learning/how-to-configure-private-link). | Medium   |
| Azure Machine Learning Computes should be in a virtual network (Preview) | Azure Virtual Networks provide enhanced security and isolation for your Azure Machine Learning Compute Clusters and Instances, as well as subnets, access control policies, and other features to further restrict access. When a compute is configured with a virtual network, it is not publicly addressable and can only be accessed from virtual machines and applications within the virtual network. | Medium   |
| Azure Machine Learning Computes should have local authentication methods disabled (Preview) | Disabling local authentication methods improves security by ensuring that Machine Learning Computes require Azure Active Directory identities exclusively for authentication. For more information, see [Azure Policy Regulatory Compliance controls for Azure Machine Learning](/azure/machine-learning/security-controls-policy). | Medium   |
| Azure Machine Learning compute instances should be recreated to get the latest software updates (Preview) | Ensure Azure Machine Learning compute instances run on the latest available operating system. Security is improved and vulnerabilities reduced by running with the latest security patches. For more information, see [Vulnerability management for Azure Machine Learning](/azure/machine-learning/concept-vulnerability-management#compute-instance). | Medium   |
| Resource logs in Azure Databricks Workspaces should be enabled (Preview) | Resource logs enable recreating activity trails to use for investigation purposes when a security incident occurs or when your network is compromised. | Medium   |
| Azure Databricks Workspaces should disable public network access (Preview) | Disabling public network access improves security by ensuring that the resource isn't exposed on the public internet. You can control exposure of your resources by creating private endpoints instead. For more information, see [Enable Azure Private Link](/azure/databricks/administration-guide/cloud-configurations/azure/private-link). | Medium   |
| Azure Databricks Clusters should disable public IP (Preview) | Disabling public IP of clusters in Azure Databricks Workspaces improves security by ensuring that the clusters aren't exposed on the public internet. For more information, see [Secure cluster connectivity](/azure/databricks/security/network/secure-cluster-connectivity). | Medium   |
| Azure Databricks Workspaces should be in a virtual network (Preview) | Azure Virtual Networks provide enhanced security and isolation for your Azure Databricks Workspaces, as well as subnets, access control policies, and other features to further restrict access. For more information, see [Deploy Azure Databricks in your Azure virtual network](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject). | Medium   |
| Azure Databricks Workspaces should use private link (Preview) | Azure Private Link lets you connect your virtual networks to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to Azure Databricks workspaces, you can reduce data leakage risks. For more information, see [Create the workspace and private endpoints in the Azure portal UI](/azure/databricks/administration-guide/cloud-configurations/azure/private-link-standard#create-the-workspace-and-private-endpoints-in-the-azure-portal-ui). | Medium   |

## Deprecated recommendations

|Recommendation|Description & related policy|Severity|
|----|----|----|
|Access to App Services should be restricted|Restrict access to your App Services by changing the networking configuration, to deny inbound traffic from ranges that are too broad.<br>(Related policy: [Preview]: Access to App Services should be restricted)|High|
|The rules for web applications on IaaS NSGs should be hardened|Harden the network security group (NSG) of your virtual machines that are running web applications, with NSG rules that are overly permissive with regard to web application ports.<br>(Related policy: The NSGs rules for web applications on IaaS should be hardened)|High|
|Pod Security Policies should be defined to reduce the attack vector by removing unnecessary application privileges (Preview)|Define Pod Security Policies to reduce the attack vector by removing unnecessary application privileges. It is recommended to configure pod security policies so pods can only access resources which they are allowed to access.<br>(Related policy: [Preview]: Pod Security Policies should be defined on Kubernetes Services)|Medium|
|Install Azure Security Center for IoT security module to get more visibility into your IoT devices|Install Azure Security Center for IoT security module to get more visibility into your IoT devices.|Low|
|Your machines should be restarted to apply system updates|Restart your machines to apply the system updates and secure the machine from vulnerabilities. (Related policy: System updates should be installed on your machines)|Medium|
|Monitoring agent should be installed on your machines|This action installs a monitoring agent on the selected virtual machines. Select a workspace for the agent to report to. (No related policy)|High|
|Java should be updated to the latest version for web apps|Periodically, newer versions are released for Java software either due to security flaws or to include additional functionality.<br>Using the latest Java version for web apps is recommended to benefit from security fixes, if any, and/or new functionalities of the latest version.<br />(Related policy: Ensure that 'Java version' is the latest, if used as a part of the Web app) |Medium |
|Python should be updated to the latest version for function apps |Periodically, newer versions are released for Python software either due to security flaws or to include additional functionality.<br>Using the latest Python version for function apps is recommended to benefit from security fixes, if any, and/or new functionalities of the latest version.<br />(Related policy: Ensure that 'Python version' is the latest, if used as a part of the Function app) |Medium |
|Python should be updated to the latest version for web apps |Periodically, newer versions are released for Python software either due to security flaws or to include additional functionality.<br>Using the latest Python version for web apps is recommended to benefit from security fixes, if any, and/or new functionalities of the latest version.<br />(Related policy: Ensure that 'Python version' is the latest, if used as a part of the Web app) |Medium |
|Java should be updated to the latest version for function apps |Periodically, newer versions are released for Java software either due to security flaws or to include additional functionality.<br>Using the latest Java version for function apps is recommended to benefit from security fixes, if any, and/or new functionalities of the latest version.<br />(Related policy: Ensure that 'Java version' is the latest, if used as a part of the Function app) |Medium |
|PHP should be updated to the latest version for web apps |Periodically, newer versions are released for PHP software either due to security flaws or to include additional functionality.<br>Using the latest PHP version for web apps is recommended to benefit from security fixes, if any, and/or new functionalities of the latest version.<br />(Related policy: Ensure that 'PHP version' is the latest, if used as a part of the WEB app) |Medium |
||||

## Next steps

To learn more about recommendations, see the following:

- [What are security policies, initiatives, and recommendations?](security-policy-concept.md)
- [Review your security recommendations](review-security-recommendations.md)
