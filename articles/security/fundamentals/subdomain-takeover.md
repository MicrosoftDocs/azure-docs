---

title: Prevent subdomain takeovers with Azure DNS alias records and Azure App Service's custom domain verification
description: Learn how to avoid the common high-severity threat of subdomain takeover
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
ms.date: 06/23/2020
ms.author: memildin

---
# Prevent dangling DNS entries and avoid subdomain takeover

This article describes the common security threat of subdomain takeover and the steps you can take to mitigate against it.


## What is subdomain takeover?

Subdomain takeovers are a common, high-severity threat for organizations that regularly create, and delete many resources. A subdomain takeover can occur when you have a DNS record that points to a deprovisioned Azure resource. Such DNS records are also known as "dangling DNS" entries. CNAME records are especially vulnerable to this threat.

A common scenario for a subdomain takeover:

1. A website is created. 

    In this example, `app-contogreat-dev-001.azurewebsites.net`.

1. A CNAME entry is added to the DNS pointing to the website. 

    In this example, the following friendly name was created: `greatapp.contoso.com`.

1. After a few months, the site is no longer needed so it's deleted **without** deleting the corresponding DNS entry. 

    The CNAME DNS entry is now "dangling".

1. Almost immediately after the site is deleted, a threat actor discovers the missing site and creates their own website at `app-contogreat-dev-001.azurewebsites.net`.

    Now, the traffic intended for `greatapp.contoso.com` goes to the threat actor's Azure site, and the threat actor is in control of the content that is displayed. 

    The dangling DNS was exploited and Contoso's subdomain "GreatApp" has been a victim of subdomain takeover. 

![Subdomain takeover from a deprovisioned website](./media/subdomain-takeover/subdomain-takeover.png)



## The risks of subdomain takeover

When a DNS record points to a resource that isn't available, the record itself should have been removed from your DNS zone. If it hasn't been deleted, it's a “dangling DNS” record and creates the possibility for subdomain takeover.

Dangling DNS entries make it possible for threat actors to take control of the associated DNS name to host a malicious website or service. Malicious pages and services on an organization's subdomain can result in:

- **Loss of control over the content of the subdomain** - Negative press about your organization's inability to secure its content, as well as the brand damage and loss of trust.

- **Cookie harvesting from unsuspecting visitors** - It's common for web apps to expose session cookies to subdomains (*.contoso.com), consequently any subdomain can access them. Threat actors can use subdomain takeover to build an authentic looking page, trick unsuspecting users to visit it, and harvest their cookies (even secure cookies). A common misconception is that using SSL certificates protects your site, and your users' cookies, from a takeover. However, a threat actor can use the hijacked subdomain to apply for and receive a valid SSL certificate. This then grants them access to secure cookies and can further increase the perceived legitimacy of the malicious site.

- **Phishing campaigns** - Authentic-looking subdomains can be used in phishing campaigns. This is true for malicious sites and also for MX records that would allow the threat actor to receive emails addressed to a legitimate subdomain of a known-safe brand.

- **Further risks** - Malicious sites can be used to escalate into other classic attacks such as XSS, CSRF, CORS bypass, and more.



## Preventing dangling DNS entries

Ensuring that your organization has implemented processes to prevent dangling DNS entries and the resulting subdomain takeovers is a crucial part of your security program.

The preventative measures available to you today are listed below.


### Use Azure DNS alias records

By tightly coupling the lifecycle of a DNS record with an Azure resource, Azure DNS's [alias records](https://docs.microsoft.com/azure/dns/dns-alias#scenarios) can prevent dangling references. For example, consider a DNS record that's qualified as an alias record to point to a public IP address or a Traffic Manager profile. If you delete those underlying resources, the DNS alias record becomes an empty record set. It no longer references the deleted resource. It's important to note that there are limits to what you can protect with alias records. Today, the list is limited to:

- Azure Front Door
- Traffic Manager profiles
- Azure Content Delivery Network (CDN) endpoints
- Public IPs

If you have resources that can be protected from subdomain takeover with alias records, we recommend doing so despite the limited service offerings today.

[Learn more](https://docs.microsoft.com/azure/dns/dns-alias#capabilities) about the capabilities of Azure DNS's alias records.



### Use Azure App Service's custom domain verification

When creating DNS entries for Azure App Service, create an asuid.{subdomain} TXT record with the Domain Verification ID. When such a TXT record exists, no other Azure Subscription can validate the Custom Domain that is, take it over. 

These records don't prevent someone from creating the Azure App Service with the same name that's in your CNAME entry. Without the ability to prove ownership of the domain name, threat actors can't receive traffic or control the content.

[Learn more](https://docs.microsoft.com/Azure/app-service/app-service-web-tutorial-custom-domain) about how to map an existing custom DNS name to Azure App Service.



### Build and automate processes to mitigate the threat

It's often up to developers and operations teams to run cleanup processes to avoid dangling DNS threats. The practices below will help ensure your organization avoids suffering from this threat. 

- **Create procedures for prevention:**

    - Educate your application developers to reroute addresses whenever they delete resources.

    - Put "Remove DNS entry" on the list of required checks when decommissioning a service.

    - Put [delete locks](https://docs.microsoft.com/azure/azure-resource-manager/management/lock-resources) on any resources that have a custom DNS entry. A delete lock serves as an indicator that the mapping must be removed before the resource is deprovisioned. Measures like this can only work when combined with internal education programs.

- **Create procedures for discovery:**

    - Review your DNS records regularly to ensure that your subdomains are all mapped to Azure resources that:

        - **Exist** - Query your DNS zones for resources pointing to Azure subdomains such as *.azurewebsites.net or *.cloudapp.azure.com (see [this reference list](azure-domains.md)).
        - **You own** - Confirm that you own all resources that your DNS subdomains are targeting.

    - Maintain a service catalog of your Azure fully qualified domain name (FQDN) endpoints and the application owners. To build your service catalog, run the following Azure Resource Graph query with the parameters from the table below:
    
        >[!IMPORTANT]
        > **Permissions** - Run the query as a user with access to all of your Azure subscriptions. 
        >
        > **Limitations** - Azure Resource Graph has throttling and paging limits that you should consider if you have a large Azure environment. [Learn more](https://docs.microsoft.com/azure/governance/resource-graph/concepts/work-with-data) about working with large Azure resource data sets.  

        ```
        Search-AzGraph -Query "resources | where type == '[ResourceType]' | project tenantId, subscriptionId, type, resourceGroup, name, endpoint = [FQDNproperty]"
        ``` 
        
        For example, this query returns the resources from Azure App Service:

        ```
        Search-AzGraph -Query "resources | where type == 'microsoft.web/sites' | project tenantId, subscriptionId, type, resourceGroup, name, endpoint = properties.defaultHostName"
        ```
        
        You can also combine multiple resource types. This example query returns the resources from Azure App Service **and** Azure App Service - Slots:

        ```
        Search-AzGraph -Query "resources | where type in ('microsoft.web/sites', 'microsoft.web/sites/slots') | project tenantId, subscriptionId, type, resourceGroup, name, endpoint = properties.defaultHostName"
        ```

        |Resource name  |[ResourceType]  | [FQDNproperty]  |
        |---------|---------|---------|
        |Azure Front Door|microsoft.network/frontdoors|properties.cName|
        |Azure Blob Storage|microsoft.storage/storageaccounts|properties.primaryEndpoints.blob|
        |Azure CDN|microsoft.cdn/profiles/endpoints|properties.hostName|
        |Public IP addresses|microsoft.network/publicipaddresses|properties.dnsSettings.fqdn|
        |Azure Traffic Manager|microsoft.network/trafficmanagerprofiles|properties.dnsConfig.fqdn|
        |Azure Container Instance|microsoft.containerinstance/containergroups|properties.ipAddress.fqdn|
        |Azure API Management|microsoft.apimanagement/service|properties.hostnameConfigurations.hostName|
        |Azure App Service|microsoft.web/sites|properties.defaultHostName|
        |Azure App Service - Slots|microsoft.web/sites/slots|properties.defaultHostName|


- **Create procedures for remediation:**
    - When dangling DNS entries are found, your team needs to investigate whether any compromise has occurred.
    - Investigate why the address wasn't rerouted when the resource was decommissioned.
    - Delete the DNS record if it's no longer in use, or point it to the correct Azure resource (FQDN) owned by your organization.
 

## Next steps

To learn more about related services and Azure features you can use to defend against subdomain takeover, see the following pages.

- [Azure DNS supports using alias records for custom domains](https://docs.microsoft.com/azure/dns/dns-alias#prevent-dangling-dns-records)

- [Use the Domain Verification ID when adding Custom Domains in Azure App Service](https://docs.microsoft.com/azure/app-service/app-service-web-tutorial-custom-domain#get-domain-verification-id) 

-    [Quickstart: Run your first Resource Graph query using Azure PowerShell](https://docs.microsoft.com/azure/governance/resource-graph/first-query-powershell)