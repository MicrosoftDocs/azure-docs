# Maps custom domains to Azure Spring Apps

**This article applies to:** ✔️ Standard consumption (Preview) ❌ Basic/Standard ❌ Enterprise

Domain Name Service (DNS) is a technique for storing network node names throughout a network. This articles maps a domain to your spring app, such as [www.contoso.com](https://www.contoso.com/), using a CNAME record. It secures the custom domain with a certificate and shows how to enforce Transport Layer Security (TLS), also known as Secure Sockets Layer (SSL).

# Prerequisites
* An application deployed to Azure Spring Apps (see Quickstart: Launch an existing application in Azure Spring Apps using the Azure portal, or use an existing app).
* A domain name with access to the DNS registry for domain provider such as GoDaddy.
* A certificate resource created under Azure Container App Environment (see [Add certificate in Container App](https://learn.microsoft.com/en-us/azure/container-apps/custom-domains-certificates))

 
# Add custom domain

## Create the CNAME record

* Go to your DNS provider and add a CNAME record to map your domain to the fqdn of your spring app. 
* Add an TXT record with then name asuid.{subdomain}, and the value of the TXT record is the custom domain verification id of your container app managed environment. You can find this value using: 

```azurecli
az containerapp env show \
--name <managed environment name> \
--resource-group <resource group> \
--query 'properties.customDomainConfiguration.customDomainVerificationId'
```

After you add the CNAME and TXT record, the DNS records page will resemble the following example:

| Name | Type | Value | 
| ----------- | ----------- | ----------- |
| {subdomain} | CNAME | testapp.agreeablewater-4c8480b3.eastus.azurecontainerapps.io |
| asuid.{subdomain} | A | 6K861CL04CATKUCFF604024064D57PB52F5DF7B67BC3033BA9808BDA8998U270 |

## Create the custom domain

You can bind custom domain for your Azure Spring App using the following Azure CLI command:

```azurecli
az spring app custom-domain bind \
--resource-group <resource group> \
--service <service name> \
--app <app name> \
--domain-name <your custom domain name> \
--certificate <name of your certificate under managed environment>
```