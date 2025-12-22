---
title: App Service Managed Certificate (ASMC) Changes – July 28, 2025
description: Learn about the upcoming changes to App Service Managed Certificates due to DigiCert's validation platform update and how to mitigate impact.
author: yutanglin16
ms.author: yutlin
ms.service: azure-app-service
ms.topic: conceptual
ms.date: 07/28/2025
#customer intent: As an Azure App Service administrator, I want to understand upcoming changes to managed certificates so that I can ensure my applications remain secure and compliant.
---

# App Service Managed Certificate Changes – July 2025 and November 2025 Updates
This article summarizes updates to App Service Managed Certificates (ASMC) introduced in July 2025 and November 2025. With the November 2025 update, ASMC now remains supported even if the site is not publicly accessible, provided all other requirements are met. Details on requirements, exceptions, and validation steps are included below.

## November 2025 update
Starting November 2025, App Service now allows DigiCert's requests to the `https://<hostname>/.well-known/pki-validation/fileauth.txt` endpoint, even if the site blocks public access. When DigiCert tries to reach the validation endpoint, [App Service front ends](/archive/msdn-magazine/2017/february/azure-inside-the-azure-app-service-architecture#front-end) present the token, and the request terminates at the front end layer. DigiCert's request does not reach the [workers](/archive/msdn-magazine/2017/february/azure-inside-the-azure-app-service-architecture#web-workers) running the application.

This behavior is now the default for ASMC issuance for initial certificate creation and renewals. Customers do not need to specifically allow DigiCert's IP addresses.

### Exceptions and Unsupported Scenarios
This update addresses most scenarios that restrict public access, including App Service Authentication, disabling public access, IP restrictions, private endpoints, and client certificates. However, a public DNS record is still required. For example, sites using a private endpoint with a custom domain on a private DNS cannot validate domain ownership and obtain a certificate.

Even with all validations now relying on HTTP token validation and DigiCert requests being allowed through, certain configurations are still not supported for ASMC:
- Sites configured as "Nested" or "External" endpoints behind Traffic Manager. Only "Azure" endpoints are supported.
- Certificates requested for domains ending in *.trafficmanager.net are not supported.

### Testing 
Customers can easily test whether their site’s configuration or set-up supports ASMC by attempting to create one for their site. If the initial request succeeds, renewals should also work, provided all requirements are met and the site is not listed in an unsupported scenario.

## July 2025 update
Starting July 28, 2025, Azure App Service Managed Certificates (ASMC) are subject to new issuance and renewal requirements due to DigiCert’s migration to a new validation platform. This change is driven by industry-wide compliance with Multi-Perspective Issuance Corroboration (MPIC).

For a detailed explanation of the underlying changes at DigiCert, refer to [changes to the managed Transport Layer Security (TLS) feature](../security/fundamentals/managed-tls-changes.md).

**Validation method update**: ASMC now uses HTTP Token validation for both apex and subdomains. Previously, subdomains were validated using CNAME records, which did not require public access. With HTTP Token, DigiCert must reach `https://<hostname>/.well-known/pki-validation/fileauth.txt` endpoint on your app to verify domain ownership.

App Service automatically places the required token at the correct path for validation. This process applies to both initial certificate issuance and renewals, meaning:

- The customer experience for requesting an ASMC or proving domain ownership remains unchanged.
- All API and CLI request payloads for ASMC creation or renewal are unaffected.
- No customer action is needed to place or manage the token.

> [!IMPORTANT]
> While App Service continues to handle token placement automatically during renewals, DigiCert must still reach the validation endpoint on your app. Public access is still required at the time of renewal. If your app is not publicly accessible, renewal fails even if the token is correctly placed.

## Impacted scenarios as of November 2025

You can't create or renew ASMCs if your:
- Site is an Azure Traffic Manager "nested" or "external" endpoint:
   - Only "Azure Endpoints" on Traffic Manager is supported for certificate creation and renewal.
   - "Nested endpoints" and "External endpoints" is not supported.
- Certificate issued to _*.trafficmanager.net_ domains:
   - Certificates for _*.trafficmanager.net_ domains is not supported for creation or renewal.

Existing certificates remain valid until expiration (up to six months), but will not renew automatically if your configuration is unsupported.

> [!NOTE]
> In addition to the new changes, all existing ASMC requirements still apply. Refer to [App Service Managed Certificate documentation](configure-ssl-certificate.md#create-a-free-managed-certificate) for more information.

## Identify impacted resources as of November 2025
You can use [Azure Resource Graph (ARG)](https://portal.azure.com/?feature.customPortal=false#view/HubsExtension/ArgQueryBlade) queries to help identify resources that may be affected under each scenario. These queries are provided as a starting point and may not capture every configuration. Review your environment for any unique setups or custom configurations. 

### Scenario 1: Site is an Azure Traffic Manager "nested" or "external" endpoint
If your App Service uses custom domains routed through **Azure Traffic Manager**, you may be impacted if your profile includes **external** or **nested endpoints**. These endpoint types are not supported for certificate issuance or renewal under the new validation.

To help identify affected Traffic Manager profiles across your subscriptions, we recommend using [this PowerShell script](https://github.com/nimccoll/NonAzureTrafficManagerEndpoints) developed by the Microsoft team. It scans for profiles with non-Azure endpoints and outputs a list of potentially impacted resources.

> [!NOTE]
> You need at least Reader access to all subscriptions to run the script successfully.
> 

To run the script:
1. Download the [PowerShell script from GitHub](https://github.com/nimccoll/NonAzureTrafficManagerEndpoints).
1. Open PowerShell and navigate to the script location.
1. Run the script.
   ```
   .\TrafficManagerNonAzureEndpoints.ps1
   ```

### Scenario 2: Certificate issued to _*.trafficmanager.net_ domains
This ARG query helps you identify App Service Managed Certificates (ASMC) that were issued to _*.trafficmanager.net domains_. In addition, it also checks whether any web apps are currently using those certificates for custom domain SSL bindings. You can copy this query, paste it into [ARG Explorer](https://portal.azure.com/?feature.customPortal=false#view/HubsExtension/ArgQueryBlade), and then click "Run query" to view the results for your environment. 

```kql
// ARG Query: Identify App Service Managed Certificates (ASMC) issued to *.trafficmanager.net domains 
// Also checks if any web apps are currently using those certificates for custom domain SSL bindings 
resources 
| where type == "microsoft.web/certificates" 
// Extract the certificate thumbprint and canonicalName (ASMCs have a canonicalName property) 
| extend  
    certThumbprint = tostring(properties.thumbprint), 
    canonicalName = tostring(properties.canonicalName) // Only ASMC uses the "canonicalName" property 
// Filter for certificates issued to *.trafficmanager.net domains 
| where canonicalName endswith "trafficmanager.net" 
// Select key certificate properties for output 
| project certName = name, certId = id, certResourceGroup = tostring(properties.resourceGroup), certExpiration = properties.expirationDate, certThumbprint, canonicalName 
// Join with web apps to see if any are using these certificates for SSL bindings 
| join kind=leftouter ( 
    resources 
    | where type == "microsoft.web/sites" 
    // Expand the list of SSL bindings for each site 
    | mv-expand hostNameSslState = properties.hostNameSslStates 
    | extend  
        hostName = tostring(hostNameSslState.name), 
        thumbprint = tostring(hostNameSslState.thumbprint) 
    // Only consider bindings for *.trafficmanager.net custom domains with a certificate bound 
    | where tolower(hostName) endswith "trafficmanager.net" and isnotempty(thumbprint) 
    // Select key site properties for output 
    | project siteName = name, siteId = id, siteResourceGroup = resourceGroup, thumbprint 
) on $left.certThumbprint == $right.thumbprint 
// Final output: ASMCs for *.trafficmanager.net domains and any web apps using them 
| project certName, certId, certResourceGroup, certExpiration, canonicalName, siteName, siteId, siteResourceGroup
```

## Mitigation guidance as of November 2025

### Scenario 1: Site is an Azure Traffic Manager "nested" or "external" endpoint

Only "Azure Endpoints" are supported. "Nested" and "External" endpoints are not supported for ASMC validation.

**Recommended mitigation:**

- Switch to Azure Endpoints or use a custom domain secured with a custom certificate.
- For guidance on using App Service as an Azure Traffic Manager endpoint, refer to [App Service and Traffic Manager Profiles](web-sites-traffic-manager.md#app-service-and-traffic-manager-profiles).


### Scenario 2: Certificate issued to _*.trafficmanager.net_ domains

Certificates for `*.trafficmanager.net` domains are not supported. If your app relies on this domain and uses ASMC, you need to remove that dependency and secure your app using a custom domain and certificate.

**Recommended steps:**

1. **Add a custom domain to the site**  
   You can configure a custom domain that points to your `trafficmanager.net` endpoint and secure it with your own certificate.
   
    - If the custom domain is not yet live or does not currently serve traffic, refer to [set up custom domain name for your app](app-service-web-tutorial-custom-domain.md).
    - If the domain is already active and serving traffic, refer to [migrate an active domain](manage-custom-dns-migrate-domain.md).

   > [!IMPORTANT]  
   > If the site restricts public access, do not use ASMC to secure the custom domain. This scenario is impacted by the validation change and will result in certificate issuance or renewal failure.

3. **Acquire a certificate for the custom domain**  
   You may use any certificate provider that meets your security and operational requirements. The certificate should be compatible with Azure App Service and ideally stored in Azure Key Vault for easier management.

4. **Add the certificate to the site**  
   > [!TIP]  
   > Make sure to [authorized App Service to read the certificates from Key vault](configure-ssl-certificate.md#authorize-app-service-to-read-from-the-vault). Use the specific identity listed in the documentation—not the Managed Identity of the site.
   - [REST API: Import KV certificate to site](/rest/api/appservice/certificates/create-or-update)
   - [CLI: Import KV certificate to site](/cli/azure/webapp/config/ssl#az-webapp-config-ssl-import)

5. **Create a custom domain binding**

   - [REST API: Create hostname binding](/rest/api/appservice/web-apps/create-or-update-host-name-binding)
   - [CLI: Update Create hostname binding](/cli/azure/webapp/config/ssl#az-webapp-config-ssl-bind)

6. **Remove other dependencies on ASMC**

   - **Custom domain TLS/SSL bindings**  
     Determine whether ASMCs are actively used for TLS/SSL bindings in your web app's custom domain configuration. If so, follow the steps above to replace the certificate and update the binding.

   - **Certificate used in application code**  
     Certificates may be used in application code for tasks such as authentication. If your app uses the `WEBSITE_LOAD_CERTIFICATES` setting to load ASMCs, update your code to use the new certificate instead.

7. **Delete ASMC resources**  
   After confirming that your environment or services no longer depend on ASMC, delete the ASMCs associated with your site.  
   Deleting ASMCs helps prevent accidental reuse, which could result in service downtime when the certificate fails to renew.

   - [REST API: Delete Certificate](/rest/api/appservice/certificates/delete)
   - [CLI: Delete certificate](/cli/azure/webapp/config/ssl#az-webapp-config-ssl-delete)


## Frequently asked questions (FAQ)

**Why is public access now required?**  
Previously, public access was required so DigiCert could reach the validation file at `https://<hostname>/.well-known/pki-validation/fileauth.txt` during certificate issuance and renewal.

[November 2025 update](#november-2025-update): Public access is no longer required for ASMC issuance. App Service now intercepts DigiCert’s validation requests at the front-end layer and presents the token without exposing your app. This behavior is the default for both initial certificate creation and renewals. Prerequisites such as correct DNS configuration still apply.

**What if I allowlist DigiCert IP addresses?**  
You no longer need to allowlist DigiCert IP addresses. The [November 2025 update](#november-2025-update) ensures DigiCert’s requests never reach your app’s workers. The front-end handles validation securely, so IP allowlisting is unnecessary.

**Can I still use CNAME records?**  
Yes, you can still use CNAME records for domain name system (DNS) routing and for verifying domain ownership.

**Are certificates for \*.azurewebsites.net impacted?**  
No, these changes do not apply to the *.azurewebsites.net certificates. ASMC is only issued to customer’s custom domain and not the default hostname.


## Other resources

- [Important Changes to App Service Managed Certificates – Tech Community Blog](https://techcommunity.microsoft.com/blog/appsonazureblog/important-changes-to-app-service-managed-certificates-is-your-certificate-affect/4435193)
