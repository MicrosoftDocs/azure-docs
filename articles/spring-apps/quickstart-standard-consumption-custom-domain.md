---
title: Quickstart - Map a custom domain to Azure Spring Apps with the Standard consumption and dedicated plan
description: Learn how to map a web domain to apps in Azure Spring Apps.
author: KarlErickson
ms.author: haojianzhong
ms.service: spring-apps
ms.topic: quickstart
ms.date: 06/21/2023
ms.custom: devx-track-java
---

# Quickstart: Map a custom domain to Azure Spring Apps with the Standard consumption and dedicated plan

**This article applies to:** ✔️ Standard consumption and dedicated (Preview) ❌ Basic/Standard ❌ Enterprise

 This article shows you how to map a custom web site domain, such as `https://www.contoso.com`, to your app in Azure Spring Apps. This mapping is accomplished by using a `CNAME` record that the Domain Name Service (DNS) uses to store node names throughout the network.

The mapping secures the custom domain with a certificate and enforces Transport Layer Security (TLS), also known as the Secure Sockets Layer (SSL).

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli)
- An Azure Spring Apps Standard consumption and dedicated plan service instance. For more information, see [Quickstart: Provision an Azure Spring Apps Standard consumption and dedicated plan service instance](quickstart-provision-standard-consumption-service-instance.md).
- A Spring app deployed to Azure Spring Apps. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps](quickstart-deploy-apps.md).
- A domain name registered in the DNS registry as provided by a web hosting or domain provider.
- A certificate resource created under an Azure Container Apps environment. For more information, see [Add certificate in Container App](../container-apps/custom-domains-certificates.md).

## Map a custom domain

To map the custom domain, you create the CNAME record and then use the Azure CLI to bind the domain to an app in Azure Spring Apps.

First, use the following steps to create the `CNAME` record:

1. Contact your DNS provider to request a `CNAME` record to map your domain to the Full Qualified Domain Name (FQDN) of your Spring app.

1. Add a `TXT` record with the name `asuid.{subdomain}` with the value being the verification ID of your Azure Container Apps environment. You can obtain this value by using the following command.

   ```azurecli
   az containerapp env show \
       --resource-group <resource-group-name> \
       --name <Azure-Container-Apps-environment-name> \
       --query 'properties.customDomainConfiguration.customDomainVerificationId'
   ```

   After you add the `CNAME` and `TXT` record, the DNS records page will resemble the following table.

   | Name                | Type    | Value                                                              |
   |---------------------|---------|--------------------------------------------------------------------|
   | `{subdomain}`       | `CNAME` | `testapp.agreeablewater-4c8480b3.eastus.azurecontainerapps.io`     |
   | `asuid.{subdomain}` | `A`     | `6K861CL04CATKUCFF604024064D57PB52F5DF7B67BC3033BA9808BDA8998U270` |

1. Next, bind the custom domain to your app by using the following command.

   ```azurecli
   az spring app custom-domain bind \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --app <app-name> \
       --domain-name <your-custom-domain-name> \
       --certificate <name-of-your-certificate-under-Azure-Container-Apps-environment>
   ```

## Clean up resources

Be sure to delete the resources you created in this article when you no longer need them. To delete the resources, just delete the resource group that contains them. You can delete the resource group using the Azure portal. Alternatively, to delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

> [!div class="nextstepaction"]
> [Analyze logs and metrics in the Azure Spring Apps Standard consumption and dedicated plan](./quickstart-analyze-logs-and-metrics-standard-consumption.md)
