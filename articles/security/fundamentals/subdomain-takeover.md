---

title: Prevent dangling DNS entries and the resulting threat of subdomain takeover
description: Learn about how to avoid the common high-severity threat of subdomain takeover
services: security
author: memildin
manager: rkarlin

ms.assetid: 
ms.service: security
ms.subservice: security-fundamentals
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/15/2020
ms.author: memildin

---
# Prevent "dangling DNS" entries and avoid subdomain takeover

This article describes the common security threat of subdomain takeover, as well as things you can do to mitigate against it.


## What is subdomain takeover?

Subdomain takeovers are a common, high-severity threat for organizations that regularly create, and delete many resources. A subdomain takeover can occur when you have a stale DNS record that points to a deprovisioned Azure resource. Such DNS records are also known as "dangling DNS" entries. CNAME record types are especially vulnerable to this threat.

A common scenario for a subdomain takeover:

1. A website is created. 

    In this example, `wer123821432.azurewebsites.net`.

1. A CNAME entry is added to the DNS pointing to the website. 

    In this example, the following friendly name was created: `GreatApp.Contoso.com`

1. After a few months, the site is no longer needed so it is deleted. Cruciall, the CNAME DNS entry remains. 
It is now "dangling".

1. Almost immediately after the site is deleted, a threat actor discovers the missing site and creates their own website at `wer123821432.azurewebsites.net`.

    Now, the traffic intended for `GreatApp.Contoso.com` goes to the threat actor's Azure site. 

    The 'dangling DNS' was exploited, and Contoso's subdomain "GreatApp" has been taken over. 

![Subdomain takeover from a deprovisioned website](./media/subdomain-takeover/subdomain-takeover.png)



### The risks of dangling DNS records

When a DNS record points to a resource that isn't available, the record itself should have been removed from your DNS tables. If it hasn't been deleted, it's a “dangling DNS” record and presents a security risk.

The risk to the organization is that it enables a threat actor to take control of the associated DNS name to host a malicious website or service. This malicious website on the organization's subdomain can result in:

- Authentication bypass - As unsuspecting users are tricked into entering their credentials.
- Cookie extraction from unsuspecting visitors.
- CORS bypass.
- Authentic-looking subdomains can be used in phishing campaigns - This is true for malicious sites and also for MX records that would allow the threat actor to receive emails addressed to a legitimate subdomain of a known-safe brand.
- SSL certificate generation - It's possible to validate SSL certificate requests with a hijacked subdomain. A certificate can further increase the perceived legitimacy of the malicious site on the subdomain that has been taken over.
- Negative press reports about your organization's security issues.
- Loss of trust.



### Preventing dangling DNS entries

It's clear that when you find a dangling DNS, the easiest solution might to delete the DNS entry. However, deleting the entry isn't always the safest or correct approach.

However, your security program should include preventative measures such as those described below.

#### Use Azure DNS's alias records

By tightly coupling the life cycle of a DNS record with an Azure resource, Azure DNS's [alias records](https://docs.microsoft.com/azure/dns/dns-alias#scenarios) feature can prevent dangling references. For example, consider a DNS record that's qualified as an alias record to point to a public IP address or a Traffic Manager profile. If you delete those underlying resources, the DNS alias record becomes an empty record set. It no longer references the deleted resource. It's important to note that there are limits to what you can protect with alias records:

- Traffic Manager profiles
- Azure Content Delivery Network (CDN) endpoints
- Public IPs
- Other DNS records of the same type

Despite these limitations, if you have resources that *can* be protected from subdomain takeover with alias records, we recommend doing so.

[Learn more](https://docs.microsoft.com/azure/dns/dns-alias#capabilities) about the capabilities of Azure DNS's alias records.


#### Education and expanding internal development procedures

It's often up to developers and operations teams to perform cleanup processes to avoid dangling DNS threats. The practices below will help ensure your organization avoids suffering from this threat. 

- **Create procedures for prevention:**

    - Perform regular reviews of your DNS records to ensure that your subdomains are correctly mapped to Azure subdomains such as azurewebsites.net or cloudapp.azure.com (see [this reference list](azure-domains.md)) and ensuring all Azure mappings are in your service catalog

    - Educate your application developers to reroute addresses whenever they delete resources.

    - Put "removing DNS entries" on the list of checks performed when decommissioning a service.

    - Put [delete locks](https://docs.microsoft.com/azure/azure-resource-manager/management/lock-resources) on any resources that have a custom DNS entry. This should serve as an indicator that the mapping must be removed before the resource is deprovisioned. Measures like this can only work when combined with internal education programs.


- **Create procedures for discovery:**

    Threat actors are running subdomain enumeration tools in an automated fashion to find and exploit your dangling DNS entries.

    - One way to try to discover dangling DNS entries is to access your DNS provider and query everything that points to an Azure resource. This is time consuming and inefficient, but may be an effective way to perform discovery. 

    - Use automated tools to review your records. Many Azure customers are using PowerShell scripts for discovery of dangling DNS entries. Two of the benefits of PowerShell are that it has native support of Azure CLI and is extensible to cover other related environments.

    - Maintain a service catalog of your Azure fully qualified domain name (FQDN) endpoints and the application owners. As a user with access to all of your Azure subscriptions, use Azure Resource Graph queries to build this service catalog. 
    
    >[!IMPORTANT]
    > Azure Resource Graph has throttling and paging limits that you should consider if you have a large Azure environment. [Learn more](https://docs.microsoft.com/azure/governance/resource-graph/concepts/work-with-data) about working with large Azure resource data sets.  


    |Resource name  |Resource type  |FQDN property  |
    |---------|---------|---------|
    |Azure Frontdoor|microsoft.network/frontdoors|properties.cName|
    |Azure Blob Storage|microsoft.storage/storageaccounts|properties.primaryEndpoints.blob|
    |Public IP addresses|microsoft.network/publicipaddresses|properties.dnsSettings.fqdn|
    |...|...|...|

    Use these Azure Resource Graph queries with the above table to build your service catalog: 
    ```
    az graph query -q "resources | where type == 'microsoft.classiccompute/domainnames' | project tenantId, subscriptionId, type, resourceGroup, name, endpoint = properties.hostName | where isnotempty(endpoint)
    az graph query -q "resources | where type == 'microsoft.network/trafficmanagerprofiles' | project tenantId, subscriptionId, type, resourceGroup, name, endpoint = properties.dnsConfig.fqdn | where isnotempty(endpoint)
    az graph query -q "resources | where type == 'microsoft.network/publicipaddresses' | project tenantId, subscriptionId, type, resourceGroup, name, endpoint = properties.dnsSettings.fqdn | where isnotempty(endpoint)
    az graph query -q "resources | where type == 'microsoft.containerinstance/containergroups' | project tenantId, subscriptionId, type, resourceGroup, name, endpoint = properties.ipAddress.fqdn | where isnotempty(endpoint)
    az graph query -q "resources | where type == 'microsoft.network/frontdoors' | project tenantId, subscriptionId, type, resourceGroup, name, endpoint = properties.cName | where isnotempty(endpoint)
    az graph query -q "resources | where type == 'microsoft.storage/storageaccounts' and isnotempty(properties.customDomain) | project tenantId, subscriptionId, type, resourceGroup, name, endpoint = properties.primaryEndpoints.blob | where isnotempty(endpoint)
    az graph query -q "resources | where type == 'microsoft.cdn/profiles/endpoints' | project tenantId, subscriptionId, type, resourceGroup, name, endpoint = properties.hostName | where isnotempty(endpoint)
    az graph query -q "resources | where type == 'microsoft.apimanagement/service' | project tenantId, subscriptionId, type, resourceGroup, name, endpoint = properties.hostnameConfigurations.hostName | where isnotempty(endpoint)
    az graph query -q "resources | where type in ('microsoft.web/sites', 'microsoft.web/sites/slots') and properties.defaultHostName endswith 'azurewebsites.net' | project tenantId, subscriptionId, type,resourceGroup, name, endpoint = properties.defaultHostName | where isnotempty(endpoint)
    ```
    


- **Create procedures for remediation:**
    - When dangling DNS entries are found, your team needs to investigate whether any compromise has occurred.
    - Investigate why the address wasn't rerouted when the resource was decommissioned.
    - Delete the DNS record if it's no longer in use, or point it to the correct Azure resource (FQDN) owned by your organization.
 

## Next steps

To learn more about related services and Azure features you can use to defend against subdomain takeover, see the following pages.

- [Azure DNS supports using alias records for custom domains](https://docs.microsoft.com/azure/dns/dns-alias#prevent-dangling-dns-records)

- [Use the Domain Verification ID when adding Custom Domains in Azure App Service](https://docs.microsoft.com/azure/app-service/app-service-web-tutorial-custom-domain#get-domain-verification-id) 