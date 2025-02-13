---
title: Deploy and configure Enterprise CA certificates for Azure Firewall Premium
description: Learn how to deploy and configure Enterprise CA certificates for Azure Firewall Premium.
author: duau
ms.service: azure-firewall
services: firewall
ms.topic: how-to
ms.date: 02/03/2022
ms.author: duau
---

# Deploy and configure Enterprise CA certificates for Azure Firewall


Azure Firewall Premium includes a TLS inspection feature, which requires a certificate authentication chain. For production deployments, you should use an Enterprise PKI to generate the certificates that you use with Azure Firewall Premium. Use this article to create and manage an Intermediate CA certificate for Azure Firewall Premium.

For more information about certificates used by Azure Firewall Premium, see [Azure Firewall Premium certificates](premium-certificates.md).

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

To use an Enterprise CA to generate a certificate to use with Azure Firewall Premium, you must have the following resources: 

- an Active Directory Forest 
- an Active Directory Certification Services Root CA with Web Enrollment enabled 
- an Azure Firewall Premium with Premium tier Firewall Policy 
- an [Azure Key Vault](premium-certificates.md#azure-key-vault) 
- a Managed Identity with Read permissions to **Certificates and Secrets** defined in the Key Vault Access Policy 

## Create a new Subordinate Certificate Template

1. Run `certtmpl.msc` to open the Certificate Template Console.
2. Find the **Subordinate Certification Authority** template in the console.
3. Right-click on the **Subordinate Certification Authority** template and select **Duplicate Template**.
4. In the **Properties of New Template** window, go to the **Compatibility** tab and set the appropriate compatibility settings or leave them as default.
5. Go to the **General** tab, set the **Template Display Name** (for example: `My Subordinate CA`), and adjust the validity period if necessary. Optionally, select the **Publish certificate in Active Directory** checkbox.
6. In the **Settings** tab, ensure the required users and groups have read and `enroll` permissions.
7. Navigate to the **Extensions** tab, select **Key Usage**, and select **Edit**.
   - Ensure that the **Digital signature**, **Certificate signing**, and **CRL signing** checkboxes are selected.
   - Select the **Make this extension critical** checkbox and select **OK**.
   
   :::image type="content" source="media/premium-deploy-certificates-enterprise-ca/certificate-template-key-usage-extension.png" alt-text="Screenshot of certificate template key usage extensions.":::
8. Select **OK** to save the new certificate template.
9. Ensure the new template is enabled so it can be used to issue certificates.

## Request and export a certificate

1. Access the web enrollment site on the Root CA, usually `https://<servername>/certsrv` and select **Request a Certificate**.
1. Select **Advanced Certificate Request**.
1. Select **Create and Submit a Request to this CA**.
1. Fill out the form using the Subordinate Certification Authority template created in the previous section.
   :::image type="content" source="media/premium-deploy-certificates-enterprise-ca/advanced-certificate-request.png" alt-text="Screenshot of advanced certificate request":::
1. Submit the request and install the certificate.
1. Assuming this request is made from a Windows Server using Internet Explorer, open **Internet Options**.
1. Navigate to the **Content** tab and select **Certificates**.

1. Select the certificate that was just issued and then select **Export**.

1. Select **Next** to begin the wizard. Select **Yes, export the private key**, and then select **Next**.

1. .pfx file format is selected by default. Uncheck **Include all certificates in the certification path if possible**. If you export the entire certificate chain, the import process to Azure Firewall will fail.

1. Assign and confirm a password to protect the key, and then select **Next**.

1. Choose a file name and export location and then select **Next**.

1. Select **Finish** and move the exported certificate to a secure location.

## Add the certificate to a Firewall Policy

1. In the Azure portal, navigate to the Certificates page of your Key Vault, and select **Generate/Import**.

1. Select **Import** as the method of creation, name the certificate, select the exported .pfx file, enter the password, and then select **Create**.

1. Navigate to the **TLS Inspection** page of your Firewall policy and select your Managed identity, Key Vault, and certificate.

1. Select **Save**.

## Validate TLS inspection

1. Create an Application Rule using TLS inspection to the destination URL or FQDN of your choice.  For example: `*bing.com`.

1. From a domain-joined machine within the Source range of the rule, navigate to your Destination and select the lock symbol next to the address bar in your browser. The certificate should show that it was issued by your Enterprise CA rather than a public CA.
   :::image type="content" source="media/premium-deploy-certificates-enterprise-ca/browser-certificate.png" alt-text="Screenshot showing the browser certificate":::
1. Show the certificate to display more details, including the certificate path.
   :::image type="content" source="media/premium-deploy-certificates-enterprise-ca/certificate-details.png" alt-text="certificate details":::
1. In Log Analytics, run the following KQL query to return all requests that have been subject to TLS Inspection:
   ```
   AzureDiagnostics 
   | where ResourceType == "AZUREFIREWALLS" 
   | where Category == "AzureFirewallApplicationRule" 
   | where msg_s contains "Url:" 
   | sort by TimeGenerated desc
   ```
   The result shows the full URL of inspected traffic:
   :::image type="content" source="media/premium-deploy-certificates-enterprise-ca/kql-query.png" alt-text="KQL query":::

## Next steps

- [Azure Firewall Premium in the Azure portal](premium-portal.md)
- [Building a POC for TLS inspection in Azure Firewall](https://techcommunity.microsoft.com/t5/azure-network-security-blog/building-a-poc-for-tls-inspection-in-azure-firewall/ba-p/3676723)

