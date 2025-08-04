---
title: App Service Managed Certificate (ASMC) Changes – July 28, 2025
description: Learn about the upcoming changes to App Service Managed Certificates due to DigiCert's validation platform update and how to mitigate impact.
author: yutanglin16
ms.author: yutlin
ms.service: azure-app-service
ms.topic: conceptual
ms.date: 07/28/2025
---

# App Service Managed Certificate (ASMC) changes – July 28, 2025

Starting July 28, 2025, Azure App Service Managed Certificates (ASMC) are subject to new issuance and renewal requirements due to DigiCert’s migration to a new validation platform. This change is driven by industry-wide compliance with Multi-Perspective Issuance Corroboration (MPIC).

For a detailed explanation of the underlying changes at DigiCert, refer to [changes to the managed Transport Layer Security (TLS) feature](../security/fundamentals/managed-tls-changes.md).

## What’s changing

- **Validation method update**: ASMC now uses HTTP Token validation for both apex and subdomains. Previously, subdomains were validated using CNAME records, which did not require public access. With HTTP Token, DigiCert must reach a specific endpoint on your app to verify domain ownership.

  App Service automatically places the required token at the correct path for validation. This process applies to both initial certificate issuance and renewals, meaning:

  - The customer experience for requesting an ASMC or proving domain ownership remains unchanged.
  - All API and CLI request payloads for ASMC creation or renewal are unaffected.
  - No customer action is needed to place or manage the token.

  > [!IMPORTANT]
  > While App Service continues to handle token placement automatically during renewals, DigiCert must still reach the validation endpoint on your app. Public access is still required at the time of renewal. If your app is not publicly accessible, renewal fails even if the token is correctly placed.

## Impacted scenarios

You can't create or renew ASMCs if:
- Your app is not publicly accessible.
- You use Azure Traffic Manager with nested or external endpoints.
- You rely on `*.trafficmanager.net` domains.

Existing certificates remain valid until expiration (up to 6 months), but will not renew automatically if your configuration is unsupported.

## Mitigation guidance

### Scenario 1: Site is not publicly accessible

Apps that are not accessible from the public internet will not be able to create or renew ASMCs. This includes restrictions via private endpoints, firewalls, IP restrictions, client certificates, authentication gateways, or custom access policies.

We recognize that making applications publicly accessible may conflict with customer security policies or introduce risk. The recommended mitigation is to replace ASMC with a custom certificate and update the TLS/SSL binding for your custom domain.

**Recommended steps:**

1. **Acquire a certificate for your custom domain**  
   You may use any certificate provider that meets your security and operational requirements. The certificate should be compatible with Azure App Service and ideally stored in Azure Key Vault for easier management.

2. **Add the certificate to the site**  
   After acquiring a certificate for your custom domain, you need to upload it to your App Service app and configure it for use. After acquiring a certificate for your custom domain, you need to upload it to your App Service app and configure it for use.
   > [!TIP]  
   > Make sure to [authorized App Service to read the certificates from Key vault](configure-ssl-certificate.md#authorize-app-service-to-read-from-the-vault). Use the specific identity listed in the documentation and not the Managed Identity of the site.
   - [REST API: Import KV certificate to site](/rest/api/appservice/certificates/create-or-update)
   - [CLI: Import KV certificate to site](/cli/azure/webapp/config/ssl#az-webapp-config-ssl-import)

4. **Update the custom domain binding**  
   > [!IMPORTANT]  
   > **To avoid any service downtime, do not delete the TLS/SSL binding**. You can update the binding with the new certificate thumbprint or name that was added to the web app without deleting the current binding.

   - [REST API: Update hostname binding](/rest/api/appservice/web-apps/create-or-update-host-name-binding)
   - [CLI: Update hostname binding](/cli/azure/webapp/config/ssl#az-webapp-config-ssl-bind)

5. **Remove other dependencies on ASMC**

   - **Custom domain TLS/SSL bindings**  
     Determine whether ASMCs are actively used for TLS/SSL bindings in your web app's custom domain configuration. If so, follow the steps above to replace the certificate and update the binding.

   - **Certificate used in application code**  
     Certificates may be used in application code for tasks such as authentication. If your app uses the `WEBSITE_LOAD_CERTIFICATES` setting to load ASMCs, update your code to use the new certificate instead.

6. **Delete ASMC resources**  
   After confirming that your environment or services no longer depend on ASMC, delete the ASMCs associated with your site.  
   Deleting ASMCs helps prevent accidental reuse, which could result in service downtime when the certificate fails to renew.

   - [REST API: Delete Certificate](/rest/api/appservice/certificates/delete)
   - [CLI: Delete certificate](/cli/azure/webapp/config/ssl#az-webapp-config-ssl-delete)

**Temporary mitigation: DigiCert IP allowlisting**  
Some customers may choose to allowlist [DigiCert’s domain validation IPs](https://knowledge.digicert.com/alerts/ip-address-domain-validation) as a short-term workaround. This can help buy time to move away from using ASMC for websites that aren’t publicly accessible, especially given the short notice of the change.
> [!NOTE]
> Allowlisting DigiCert's IP isn’t an official or supported long-term solution. Microsoft’s stance remains that **public access is required** to avoid potential service disruptions. Consider the following:
>
> - DigiCert manages its own IPs and may change them without notice.
> - Microsoft doesn’t control DigiCert’s infrastructure and can’t guarantee the documentation stay up to date.
> - Microsoft doesn’t provide alerts if DigiCert updates its IPs.
> - Use this approach at your own risk.

For guidance on configuring access restrictions, refer to [set up Azure App Service access restrictions](app-service-ip-restrictions.md).


### Scenario 2: Azure Traffic Manager with nested or external endpoints

Only “Azure Endpoints” are supported. “Nested” and “External” endpoints are not supported for ASMC validation.

**Recommended mitigation:**

- Switch to Azure Endpoints or use a custom domain secured with a custom certificate.
- For guidance on using App Service as an Azure Traffic Manager endpoint, refer to [App Service and Traffic Manager Profiles](web-sites-traffic-manager.md#app-service-and-traffic-manager-profiles).


### Scenario 3: Use of trafficmanager.net domains

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
Due to MPIC compliance, App Service is migrating to Http Token validation for all ASMC creation and renewal requests. DigiCert must verify domain ownership by reaching a specific endpoint on your app. A successful validation with Http token is only possible if the app is publicly accessible. 

**Can I still use CNAME records?**  
Yes, you can still use CNAME records for domain name system (DNS) routing and for verifying domain ownership.

**What if I allowlist DigiCert IP addresses?**  
Allowlisting DigiCert’s domain validation IPs may work as a temporary workaround. However, Microsoft cannot guarantee that these IPs won’t change. DigiCert may update them without notice, and Microsoft does not maintain documentation for these IPs. Customers are responsible for monitoring and maintaining this configuration.

**Are certificates for \*.azurewebsites.net impacted?**  
No, these changes do not apply to the *.azurewebsites.net certificates. ASMC is only issued to customer’s custom domain and not the default hostname.


## Other resources

- [Important Changes to App Service Managed Certificates – Tech Community Blog](https://techcommunity.microsoft.com/blog/appsonazureblog/important-changes-to-app-service-managed-certificates-is-your-certificate-affect/4435193)
