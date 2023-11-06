---
title: Security recommendations
description: Implement the security recommendations to help fulfill your security obligations as stated in our shared responsibility model. Improve the security of your app.
author: msmbaldwin
manager: barbkess

ms.topic: conceptual
ms.date: 09/02/2021
ms.author: mbaldwin
ms.custom: "UpdateFrequency3, security-recommendations"

---

# Security recommendations for App Service

This article contains security recommendations for Azure App Service. Implementing these recommendations will help you fulfill your security obligations as described in our shared responsibility model and will improve the overall security for your Web App solutions. For more information on what Microsoft does to fulfill service provider responsibilities, read [Azure infrastructure security](../security/fundamentals/infrastructure.md).

## General

| Recommendation | Comments |
|-|-|
| Stay up to date | Use the latest versions of supported platforms, programming languages, protocols, and frameworks. |

## Identity and access management

| Recommendation | Comments |
|-|----|
| Disable anonymous access | Unless you need to support anonymous requests, disable anonymous access. For more information on Azure App Service authentication options, see [Authentication and authorization in Azure App Service](overview-authentication-authorization.md).|
| Require authentication | Whenever possible, use the App Service authentication module instead of writing code to handle authentication and authorization. See [Authentication and authorization in Azure App Service](overview-authentication-authorization.md). |
| Protect back-end resources with authenticated access | You can either use the user's identity or use an application identity to authenticate to a back-end resource. When you choose to use an application identity use a [managed identity](overview-managed-identity.md).
| Require client certificate authentication | Client certificate authentication improves security by only allowing connections from clients that can authenticate using certificates that you provide. |

## Data protection

| Recommendation | Comments |
|-|-|
| Redirect HTTP to HTTPs | By default, clients can connect to web apps by using both HTTP or HTTPS. We recommend redirecting HTTP to HTTPs because HTTPS uses the SSL/TLS protocol to provide a secure connection, which is both encrypted and authenticated. |
| Encrypt communication to Azure resources | When your app connects to Azure resources, such as [SQL Database](https://azure.microsoft.com/services/sql-database/) or [Azure Storage](../storage/index.yml), the connection stays in Azure. Since the connection goes through the shared networking in Azure, you should always encrypt all communication. |
| Require the latest TLS version possible | Since 2018 new Azure App Service apps use TLS 1.2. Newer versions of TLS include security improvements over older protocol versions. |
| Use FTPS | App Service supports both FTP and FTPS for deploying your files. Use FTPS instead of FTP when possible. When one or both of these protocols are not in use, you should [disable them](deploy-ftp.md#enforce-ftps). |
| Secure application data | Don't store application secrets, such as database credentials, API tokens, or private keys in your code or configuration files. The commonly accepted approach is to access them as [environment variables](https://wikipedia.org/wiki/Environment_variable) using the standard pattern in your language of choice. In Azure App Service, you can define environment variables through [app settings](./configure-common.md) and [connection strings](./configure-common.md). App settings and connection strings are stored encrypted in Azure. The app settings are decrypted only before being injected into your app's process memory when the app starts. The encryption keys are rotated regularly. Alternatively, you can integrate your Azure App Service app with [Azure Key Vault](../key-vault/index.yml) for advanced secrets management. By [accessing the Key Vault with a managed identity](../key-vault/general/tutorial-net-create-vault-azure-web-app.md), your App Service app can securely access the secrets you need. |
| **Secure application code** | Follow the steps to ensure the application code is secured. |
|  Static Content | When authoring a web application serving static content, ensure that only the intended files/folders are processed. A configuration/code which serves out all files may not be sure by default. Follow application runtime/framework’s best practices to secure the static content. |
| Hidden Folders | Ensure hidden folders like .git, bin, obj, objd, etc., doesn’t get accidentally included as part of deployment artifact. Take adequate steps to ensure deployment scripts only deploy required files and nothing more. |
| In-place deployments | Understand nuances of [in place deployment](https://github.com/projectkudu/kudu/wiki/Deploying-inplace-and-without-repository/#inplace-deployment) in local Git deployment. In-place deployment results in the creation and storage of the .git folder in the content root of the web application. Local Git deployment can activate in-place deployments automatically in some scenarios, even if in-place deployment isn't explicitly configured (for example, if the web app contains previously-deployed content when the local Git repository is initialized). Follow application runtime/framework’s best practices to secure the content. |

## Networking

| Recommendation | Comments |
|-|-|
| Use static IP restrictions | Azure App Service on Windows lets you define a list of IP addresses that are allowed to access your app. The allowed list can include individual IP addresses or a range of IP addresses defined by a subnet mask. For more information, see [Azure App Service Static IP Restrictions](app-service-ip-restrictions.md).  |
| Use the isolated pricing tier | Except for the isolated pricing tier, all tiers run your apps on the shared network infrastructure in Azure App Service. The isolated tier gives you complete network isolation by running your apps inside a dedicated [App Service environment](environment/intro.md). An App Service environment runs in your own instance of [Azure Virtual Network](../virtual-network/index.yml).|
| Use secure connections when accessing on-premises resources | You can use [Hybrid connections](app-service-hybrid-connections.md), [Virtual Network integration](./overview-vnet-integration.md), or [App Service environment's](environment/intro.md) to connect to on-premises resources. |
| Limit exposure to inbound network traffic | Network security groups allow you to restrict network access and control the number of exposed endpoints. For more information, see [How To Control Inbound Traffic to an App Service Environment](environment/app-service-app-service-environment-control-inbound-traffic.md). |
| Protect against DDoS attacks | For web workloads, we highly recommend utilizing [Azure DDoS protection](../ddos-protection/ddos-protection-overview.md) and a [web application firewall](../web-application-firewall/overview.md) to safeguard against emerging DDoS attacks. Another option is to deploy [Azure Front Door](../frontdoor/web-application-firewall.md) along with a web application firewall. Azure Front Door offers platform-level [protection against network-level DDoS attacks](../frontdoor/front-door-ddos.md). |

## Monitoring

| Recommendation | Comments |
|-|-|
|Use Microsoft Defender for Cloud's Microsoft Defender for App Service | [Microsoft Defender for App Service](../security-center/defender-for-app-service-introduction.md) is natively integrated with Azure App Service. Defender for Cloud assesses the resources covered by your App Service plan and generates security recommendations based on its findings. Use the detailed instructions in [these recommendations](../security-center/recommendations-reference.md#appservices-recommendations) to harden your App Service resources. Microsoft Defender for Cloud also provides threat protection and can detect a multitude of threats covering almost the complete list of MITRE ATT&CK tactics from pre-attack to command and control. For a full list of the Azure App Service alerts, see [Microsoft Defender for App Service alerts](../security-center/alerts-reference.md#alerts-azureappserv).|

## Next steps

Check with your application provider to see if there are additional security requirements.
