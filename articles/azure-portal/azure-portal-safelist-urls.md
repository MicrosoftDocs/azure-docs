---
title: Allow the Azure portal URLs on your firewall or proxy server
description: To optimize connectivity between your network and the Azure portal and its services, we recommend you add these URLs to your allowlist.
ms.date: 10/12/2022
ms.topic: conceptual
---

# Allow the Azure portal URLs on your firewall or proxy server

To optimize connectivity between your network and the Azure portal and its services, you may want to add specific Azure portal URLs to your allowlist. Doing so can improve performance and connectivity between your local- or wide-area network and the Azure cloud.

Network administrators often deploy proxy servers, firewalls, or other devices, which can help secure and give control over how users access the internet. Rules designed to protect users can sometimes block or slow down legitimate business-related internet traffic. This traffic includes communications between you and Azure over the URLs listed here.

> [!TIP]
> For help diagnosing issues with network connections to these domains, check https://portal.azure.com/selfhelp.

You can use [service tags](../virtual-network/service-tags-overview.md) to define network access controls on [network security groups](../virtual-network/network-security-groups-overview.md), [Azure Firewall](../firewall/service-tags.md), and user-defined routes. Use service tags in place of fully qualified domain names (FQDNs) or specific IP addresses when you create security rules and routes.

## Azure portal URLs for proxy bypass

The URL endpoints to allow for the Azure portal are specific to the Azure cloud where your organization is deployed. To allow network traffic to these endpoints to bypass restrictions, select your cloud, then add the list of URLs to your proxy server or firewall. We do not recommend adding any additional portal-related URLs aside from those listed here, although you may want to add URLs related to other Microsoft products and services. Depending on which services you use, you may not need to include all of these URLs in your allowlist.

### [Public Cloud](#tab/public-cloud)

> [!TIP]
> The service tags required to access the Azure portal (including authentication and resource listing) are **AzureActiveDirectory**, **AzureResourceManager**, and **AzureFrontDoor.Frontend**. Access to other services may require additional permissions, as described below.  
> However, there is a possibility that unnecessary communication other than communication to access the portal may also be allowed. If granular control is required, FQDN-based access control such as Azure Firewall is required.

#### Azure portal authentication

```
*.login.microsoftonline.com
*.aadcdn.msftauth.net
*.aadcdn.msftauthimages.net
*.aadcdn.msauthimages.net
*.logincdn.msftauth.net
*.login.live.com
*.msauth.net
*.aadcdn.microsoftonline-p.com
*.microsoftonline-p.com
```

#### Azure portal framework

```
*.portal.azure.com
*.hosting.portal.azure.net
*.reactblade.portal.azure.net
*.management.azure.com
*.ext.azure.com
*.graph.windows.net
*.graph.microsoft.com
```

#### Account data

```
*.account.microsoft.com
*.bmx.azure.com
*.subscriptionrp.trafficmanager.net
*.signup.azure.com
```
 
#### General Azure services and documentation

```
aka.ms (Microsoft short URL)
*.asazure.windows.net (Analysis Services)
*.azconfig.io (AzConfig Service)
*.aad.azure.com (Azure AD)
*.aadconnecthealth.azure.com (Azure AD)
ad.azure.com (Azure AD)
adf.azure.com (Azure Data Factory)
api.aadrm.com (Azure AD)
api.loganalytics.io (Log Analytics Service)
*.applicationinsights.azure.com (Application Insights Service)
appservice.azure.com (Azure App Services)
*.arc.azure.net (Azure Arc)
asazure.windows.net (Analysis Services)
bastion.azure.com (Azure Bastion Service)
batch.azure.com (Azure Batch Service)
catalogapi.azure.com (Azure Marketplace)
changeanalysis.azure.com (Change Analysis)
cognitiveservices.azure.com (Cognitive Services)
config.office.com (Microsoft Office)
cosmos.azure.com (Azure Cosmos DB)
*.database.windows.net (SQL Server)
datalake.azure.net (Azure Data Lake Service)
dev.azure.com (Azure DevOps)
dev.azuresynapse.net (Azure Synapse)
digitaltwins.azure.net (Azure Digital Twins)
learn.microsoft.com (Azure documentation)
elm.iga.azure.com  (Azure AD)
eventhubs.azure.net (Azure Event Hubs)
functions.azure.com (Azure Functions)
gallery.azure.com (Azure Marketplace)
go.microsoft.com (Microsoft documentation placeholder)
help.kusto.windows.net (Azure Kusto Cluster Help)
identitygovernance.azure.com (Azure AD)
iga.azure.com (Azure AD)
informationprotection.azure.com (Azure AD)
kusto.windows.net (Azure Kusto Clusters)
learn.microsoft.com (Azure documentation)
logic.azure.com (Logic Apps)
marketplacedataprovider.azure.com (Azure Marketplace)
marketplaceemail.azure.com (Azure Marketplace)
media.azure.net (Azure Media Services)
monitor.azure.com (Azure Monitor Service)
mspim.azure.com (Azure AD)
network.azure.com (Azure Network)
purview.azure.com (Azure Purview)
quantum.azure.com (Azure Quantum Service)
rest.media.azure.net (Azure Media Services)
search.azure.com (Azure Search)
servicebus.azure.net (Azure Service Bus)
servicebus.windows.net (Azure Service Bus)
shell.azure.com (Azure Command Shell)
sphere.azure.net (Azure Sphere)
azure.status.microsoft (Azure Status)
storage.azure.com (Azure Storage)
storage.azure.net (Azure Storage)
vault.azure.net (Azure Key Vault Service)
```

### [U.S. Government Cloud](#tab/us-government-cloud)

```
*.applicationinsights.us
*.azure.us
*.loganalytics.us
*.microsoft.us
*.microsoftonline.us
*.msauth.net
*.usgovcloudapi.net
*.usgovtrafficmanager.net
*.windowsazure.us
graph.microsoftazure.us
```

### [Azure China Cloud](#tab/azure-china-cloud)

```
aadcdn.msauth.cn
aadcdn.msftauth.cn
login.live.com
*.azure.cn
*.microsoft.cn
*.microsoftonline.cn
*.chinacloudapi.cn
*.trafficmanager.cn
*.windowsazure.cn
```

---

> [!NOTE]
> Traffic to these endpoints uses standard TCP ports for HTTP (80) and HTTPS (443).
