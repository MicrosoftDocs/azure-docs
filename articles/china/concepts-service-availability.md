---
title: Service availability and roadmaps for Azure in China 
description: Learn about service availability and roadmaps for Azure in China, such as Azure in China CDN and Azure Stack.
ms.topic: concept-article
ms.date: 07/20/2020
---

# Service availability and roadmaps for Microsoft Azure operated by 21Vianet

Microsoft's goal for Azure in China is to match service availability in Azure. For service availability for Azure in China, see [Products available by China regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=all&regions=china-non-regional,china-east,china-east-2,china-east-3,china-north,china-north-2,china-north-3&rar=true). For minor differences in services, please see the details below.

## CDN in China

[Azure in China CDN](https://www.azure.cn/home/features/cdn/) focuses the scope in China, which public Azure doesn’t cover. It has CDN vendors from China.

The Smart Route in Azure in China CDN chooses the best CDN vendor for the customer’s content delivery per region.

For pricing details, see [Content Delivery Network (CDN)](https://www.azure.cn/pricing/details/cdn/).

## Free circuit for ExpressRoute in China

[Azure in China ExpressRoute](https://www.azure.cn/home/features/expressroute/) provides a free circuit on the following paired regions: China North - China North 2, and China East - China East 2. You can use China East 2 resources through ExpressRoute on East 1 for free. The network latency is minimal, similar to being within one region.

The ExpressRoute crossover of N1-E2, E1-N2 requires ExpressRoute Premium. You're charged for the crossover data transfer, the same as public Azure.

For pricing details, see [ExpressRoute](https://www.azure.cn/pricing/details/expressroute/).

## Azure Stack

[Azure Stack](https://www.azure.cn/overview/azure-stack/) software and functions combine with Microsoft Azure operated by 21Vianet to provide Chinese customers with a truly consistent hybrid cloud solution.

Azure Stack and Azure in China are both covered in one OSPA. You can purchase Azure Stack through 2 models: Consumption and Capacity. The Consumption model shares one Monetary Commitment pool in OSPA.

## Azure Hybrid Benefit (AHB)

Windows Server virtual machines [AHB](https://www.azure.cn/pricing/hybrid-benefit/) and Azure SQL Database AHB are supported.

Azure operated by 21Vianet is a physically separated instance of cloud services located in China. It's independently operated and transacted by Shanghai Blue Cloud Technology Co., Ltd. ("21Vianet"), a wholly owned subsidiary of Beijing 21Vianet Broadband Data Center Co., Ltd.

## AI + machine learning

This section outlines variations and considerations when using Azure Bot Service, Azure Machine Learning, and Azure AI services.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
|Azure Machine Learning| See [Azure Machine Learning feature availability across Azure in China cloud regions](/azure/machine-learning/reference-machine-learning-cloud-parity#azure-operated-by-21vianet). | |
| Azure AI Speech| See [Azure AI services: Azure in China - Speech service](/azure/ai-services/speech-service/sovereign-clouds?tabs=c-sharp.md#microsoft-azure-operated-by-21vianet)  ||
| Azure AI Speech|For feature variations and limitations, including API endpoints, see [Translator in sovereign clouds](/azure/ai-services/translator/sovereign-clouds?tabs=china).||

<a name='azure-ad-external-identities'></a>

## Microsoft Entra External ID

This section outlines variations and considerations when using Microsoft Entra External ID B2B collaboration.  

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Microsoft Entra External ID | For Microsoft Entra External ID B2B feature variations in Microsoft Azure for customers in China, see [Microsoft Entra B2B in national clouds](/entra/external-id/b2b-government-national-clouds) and [Microsoft cloud settings (Preview)](/entra/external-id/cross-cloud-settings).  ||

## Azure Entra B2C

This section outlines variations and considerations when using Azure Active Directory B2C services.

| Product | Unsupported, limited, and/or modified features |
|---------|--------|
| Azure Entra B2C | For Azure Entra B2C feature variations in Microsoft Azure for customers in China, see [Developer notes for Azure Entra B2C](https://docs.azure.cn/active-directory-b2c/custom-policy-developer-notes).  |

## Microsoft Authentication Library (MSAL)

This section outlines variations and considerations when using Microsoft Authentication Library (MSAL) services.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Microsoft Authentication Library (MSAL)  | For feature variations and limitations, see [National clouds and MSAL](https://docs.azure.cn/entra/identity-platform/msal-overview).  ||

## Networking

This section outlines variations and considerations when using Networking services.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Private Link| For Private Link services availability, see [Azure Private Link availability](/azure/private-link/availability).<br/>For Private DNS zone names, see [Azure Private Endpoint DNS configuration](/azure/private-link/private-endpoint-dns#government). ||

## Security

This section outlines variations and considerations when using Security services.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Microsoft Sentinel| For Microsoft Sentinel availability, see [Microsoft Sentinel availability](/azure/sentinel/feature-availability). ||

## Azure Arc-enabled Kubernetes

This section outlines variations and considerations when using Azure Arc-enabled Kubernetes.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| API Management | API Management on Arc-enabled Kubernetes isn't supported for Azure in China ||
| App service | App service on Arc-enabled Kubernetes isn't supported for Azure in China ||
| Azure Monitor container insights | Azure Monitor container insights on Arc-enabled Kubernetes isn't supported for Azure in China ||
| Container Apps | Container Apps on Arc-enabled Kubernetes isn't supported for Azure in China ||
| Dapr | Dapr extension for Arc-enabled Kubernetes isn't supported for Azure in China ||
| Event Grid | Event Grid on Arc-enabled Kubernetes isn't supported for Azure in China ||
| Machine Learning | Azure Machine Learning on Arc-enabled Kubernetes isn't supported for Azure in China ||
| Microsoft Defender for Cloud | Microsoft Defender for Cloud on Arc-enabled Kubernetes isn't supported for Azure in China ||
| Open Service Mesh | Open Service Mesh on Arc-enabled Kubernetes isn't supported for Azure in China ||

## Azure Container Apps

This section outlines variations and considerations when using Azure Container Apps services.

| Product | Unsupported, limited, and/or modified features | Notes |
|---------|--------|------------|
| Azure Monitor| The Azure Monitor integration isn't supported for Azure in China ||

## Azure Managed Grafana

| Product               | Unsupported, limited, and/or modified features                                                                                                            | Notes |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| Azure Managed Grafana | See [Azure Managed Grafana: Feature availability in sovereign clouds](/azure/managed-grafana/known-limitations#feature-availability-in-sovereign-clouds). |       |

## Azure China Commercial Marketplace operated by 21Vianet

To learn which commercial marketplace features are available in Azure China Commercial Marketplace operated by 21Vianet, as compared to the Azure global commercial marketplace, see [Feature availability for Azure China Commercial Marketplace operated by 21Vianet](/partner-center/marketplace/azure-in-china-feature-availability).

### Microsoft Cost Management + Billing

This section outlines variations and considerations when using Microsoft Cost Management + Billing features and APIs.

### Azure Retail Rates API for China

The [Azure Retail Prices API for China](/rest/api/cost-management/retail-prices/azure-retail-prices-china) article is applicable only to Azure in China and isn't available in Azure Global.

### Markup - China

The [Markup - China](/azure/cost-management-billing/manage/markup-china) article is applicable only to Azure operated by 21Vianet and isn't available in Azure Global.

## Azure in China Account Sign in

The table below lists ways to connect to your Azure account in Azure Global vs. Azure in China.

| Sign in description | Azure Global | Azure in China |
|--------------|-----------|------|
| Sign into Azure with an authenticated account for use with Azure Resource Manager| Connect-AzureAccount | Connect-AzureAccount -Environment AzureChinaCloud|
| Sign into Microsoft Entra ID with Microsoft Graph PowerShell | Connect-MgGraph | Connect-MgGraph -AzureEnvironment China|
| Sign into your Azure classic portal account | Add-AzureAccount | Add-AzureAccount -Environment AzureChinaCloud |

## Azure in China REST endpoints

The table below lists API endpoints in Azure Global vs. Azure in China for accessing and managing some of the more common services.

For IP ranges for Azure in China, download [Azure Datacenter IP Ranges in China](https://www.microsoft.com/download/details.aspx?id=57062).

| Service category | Azure Global | Azure in China |
|-|-|-|
| Azure (in general) | \*.windows.net | \*.chinacloudapi.cn |
| Microsoft Entra ID| `https://login.microsoftonline.com`| `https://login.chinacloudapi.cn` |
| Azure App Configuration | \*.azconfig.io | \*.azconfig.azure.cn |
| Azure compute | \*.cloudapp.net | \*.chinacloudapp.cn |
| Azure data  | `https://{location}.experiments.azureml.net`| `https://{location}.experiments.ml.azure`.cn |
| Azure storage | \*.blob.core.windows.net \*.queue.core.windows.net \*.table.core.windows.net  \*.dfs.core.windows.net | \*.blob.core.chinacloudapi.cn \*.queue.core.chinacloudapi.cn \*.table.core.chinacloudapi.cn   \*.dfs.core.chinacloudapi.cn|
| Azure management| `https://management.azure.com/` |`https://management.chinacloudapi.cn/` |
| Azure service management | `https://management.core.windows.net` | [https://management.core.chinacloudapi.cn](https://management.core.chinacloudapi.cn/) |
| Azure Resource Manager | `https://management.azure.com` | `https://management.chinacloudapi.cn` |
| Azure portal | [https://portal.azure.com](https://portal.azure.com/) | [https://portal.azure.cn](https://portal.azure.cn/) |
| SQL Database | \*.database.windows.net | \*.database.chinacloudapi.cn |
| SQL Azure DB management API | `https://management.database.windows.net` | `https://management.database.chinacloudapi.cn` |
| Azure Service Bus | \*.servicebus.windows.net | \*.servicebus.chinacloudapi.cn |
| Azure SignalR Service| \*.service.signalr.net | \*.signalr.azure.cn |
| Azure Time Series Insights | \*.timeseries.azure.com \*.insights.timeseries.azure.cn | \*.timeseries.azure.cn \*.insights.timeseries.azure.cn |
| Azure Access Control Service | \*.accesscontrol.windows.net | \*.accesscontrol.chinacloudapi.cn |
| Azure HDInsight | \*.azurehdinsight.net | \*.azurehdinsight.cn |
| SQL DB import/export service endpoint | |  1. China East `https://sh1prod-dacsvc.chinacloudapp.cn/dacwebservice.svc` <br>2. China North `https://bj1prod-dacsvc.chinacloudapp.cn/dacwebservice.svc` |
| MySQL PaaS | | \*.mysqldb.chinacloudapi.cn |
| Azure Service Fabric cluster | \*.cloudapp.azure.com | \*.chinaeast.chinacloudapp.cn |
| Azure Spring Cloud| \*.azuremicroservices.io | \*.microservices.azure.cn |
| Microsoft Entra ID | \*.onmicrosoft.com | \*.partner.onmschina.cn |
| Microsoft Entra logon | [https://login.microsoftonline.com](https://login.windows.net/) | [https://login.partner.microsoftonline.cn](https://login.chinacloudapi.cn/) |
| Microsoft Graph | [https://graph.microsoft.com](https://graph.microsoft.com/) | [https://microsoftgraph.chinacloudapi.cn](https://microsoftgraph.chinacloudapi.cn/) |
| Azure AI services | `https://api.projectoxford.ai/face/v1.0` | `https://api.cognitive.azure.cn/face/v1.0` |
| Azure Bot Services | <\*.botframework.com> | <\*.botframework.azure.cn> |
| Azure Key Vault API | \*.vault.azure.net | \*.vault.azure.cn |
| Azure Container Apps Default Domain | \*.azurecontainerapps.io | No default domain is provided for external environment. The [custom domain](/azure/container-apps/custom-domains-certificates) is required.  |
| Azure Container Apps Event Stream Endpoint | `\<region\>.azurecontainerapps.dev` | `\<region\>.chinanorth3.azurecontainerapps-dev.cn``  |

## Remote Management

### Azure portal

You can sign in to the [Azure portal](https://portal.azure.cn/?l=en.en-us) to manage workloads in Azure operated by 21Vianet anywhere globally.

### Work with administrator roles

One account administrator role is created per Azure account, typically the person who signed up for or bought the Azure subscription. This role is authorized to use the [Account Center](https://account.windowsazure.cn/Home/Index/en-us) to perform management tasks.

To sign in, the account administrator uses the organization ID (Org ID) created when the subscription was purchased.

### Create a service administrator to manage the service deployment

One service administrator role is created per Azure account, and is authorized to manage services in the Azure portal. With a new subscription, the account administrator is also the service administrator.

### Create a co-administrator

Account administrators can create up to 199 co-administrator roles per subscription. This role has the same access privileges as the service administrator, but can't change the association of subscriptions to Azure directories.
