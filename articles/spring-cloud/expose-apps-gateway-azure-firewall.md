---
title:  "Expose applications to the Internet using Application Gateway and Azure Firewall"
description: How to expose applications to Internet using Application Gateway and Azure Firewall
author: karlerickson
ms.author: karler
ms.service: spring-cloud
ms.topic: how-to
ms.date: 10/07/2021
ms.custom: devx-track-java
---

# Expose applications to the Internet using Application Gateway and Azure Firewall

This document explains how to expose applications to the Internet using Application Gateway and Azure Firewall. When an Azure Spring Cloud service instance is deployed in your virtual network, applications on the service instance are only accessible in the private network. To make the applications accessible on the Internet, you need to integrate with **Azure Application Gateway** and, optionally, with **Azure Firewall**.

## Prerequisites

- [Azure CLI version 2.0.4 or later](/cli/azure/install-azure-cli).
- An Azure Spring Cloud service deployed in a virtual network with an application accessible over the private network using the default ".private.azuremicroservices.io" domain suffix.  See: [Deploy in Azure Virtual Network](./how-to-deploy-in-azure-virtual-network.md)
- a custom domain to be used to access the application with
- a certificate, stored in Key Vault, which matches the custom domain to be used to establish the HTTPS listener.  See: [Add a certificate to Key Vault](../key-vault/quick-create-cli.md#add-a-certificate-to-key-vault)

## Configuring Application Gateway for Azure Spring Cloud

In order to get the best experience using Application Gateway to expose Azure Spring Cloud hosted applications residing in a virtual network, it is recommended that the domain name as seen by the browser is the same as the host name which Application Gateway uses to direct traffic to the Azure Spring Cloud backend. If the domain exposed by Application Gateway is different from the domain accepted by Azure Spring Cloud, cookies and generated redirect url's can be broken for example.

To configure Application Gateway in front of Azure Spring Cloud:

- [deploy Azure Spring Cloud in a virtual network](./how-to-deploy-in-azure-virtual-network.md)
- acquire a certificate for your domain of choice and [store that in Key Vault](../key-vault/quick-create-cli.md#add-a-certificate-to-key-vault)
- [configure a custom domain and corresponding certificate](./tutorial-custom-domain.md) from Key Vault on an app deployed onto Azure Spring Cloud
- deploy Application Gateway in a virtual network:
  - using Azure Spring Cloud in the backend pool, referenced by the domain suffixed with "private.azuremicroservices.io"
  - with an https listener using the same certificate from Key Vault
  - configured with http settings which use the custom domain name configured on Azure Spring Cloud instead of the domain suffixed with "private.azuremicroservices.io"
- configure your public DNS to point to Application Gateway

## Define variables

Define variables for the resource group and virtual network you created as directed in [Deploy Azure Spring Cloud in Azure virtual network (VNet injection)](./how-to-deploy-in-azure-virtual-network.md). Customize the values based on your real environment.  When you define SPRING_APP_PRIVATE_FQDN, remove 'https' from the uri.

```bash
SUBSCRIPTION='subscription-id'
RESOURCE_GROUP='my-resource-group'
LOCATION='eastus'
SPRING_APP_PRIVATE_FQDN='my-azure-spring-cloud-hello-vnet.private.azuremicroservices.io'
VIRTUAL_NETWORK_NAME='azure-spring-cloud-vnet'
APPLICATION_GATEWAY_SUBNET_NAME='app-gw-subnet'
APPLICATION_GATEWAY_SUBNET_CIDR='10.1.2.0/24'
```

## Sign in to Azure

Sign in to the Azure CLI and choose your active subscription.

```azurecli
az login
az account set --subscription ${SUBSCRIPTION}
```

## Configure the public domain name on Azure Spring Cloud

Traffic will enter the application deployed on Azure Spring Cloud using the public domain name.  To configure your application to listen to this host name and do so over HTTPS, add a custom domain to the Spring Cloud app:

```azurecli
APPNAME='name-of-app-in-azure-spring-cloud'
KV_NAME='name-of-key-vault'
KV_RG='resource-group-name-of-key-vault'
CERT_NAME_IN_ASC='name-of-cert-in-azure-spring-cloud'
CERT_NAME_IN_KV='name-of-cert-with-intermediaries-in-key-vault'
DOMAIN_NAME=myapp.mydomain.com

# provide permissions to ASC to read the certificate from Key Vault:
VAULTURI=$(az keyvault show -n $KV_NAME -g $KV_RG --query properties.vaultUri -o tsv)
az keyvault set-policy -g $KV_RG -n $KV_NAME  --object-id 938df8e2-2b9d-40b1-940c-c75c33494239 --certificate-permissions get list --secret-permissions get list

# add custom domain name and configure TLS using the certificate:
az spring-cloud certificate add --name $CERT_NAME_IN_ASC --resource-group $RESOURCE_GROUP --vault-certificate-name $CERT_NAME_IN_KV --vault-uri $VAULTURI
az spring-cloud app custom-domain bind --domain-name $DOMAIN_NAME --certificate $CERT_NAME_IN_ASC --app $APPNAME
```

## Create network resources

The **Azure Application Gateway** to be created will join the same virtual network as--or peered virtual network to--the Azure Spring Cloud service instance. First create a new subnet for the Application Gateway in the virtual network using `az network vnet subnet create`, and also create a Public IP address as the Frontend of the Application Gateway using `az network public-ip create`.

```azurecli
APPLICATION_GATEWAY_PUBLIC_IP_NAME='app-gw-public-ip'
az network vnet subnet create \
    --name ${APPLICATION_GATEWAY_SUBNET_NAME} \
    --resource-group ${RESOURCE_GROUP} \
    --vnet-name ${VIRTUAL_NETWORK_NAME} \
    --address-prefix ${APPLICATION_GATEWAY_SUBNET_CIDR}
az network public-ip create \
    --resource-group ${RESOURCE_GROUP} \
    --location ${LOCATION} \
    --name ${APPLICATION_GATEWAY_PUBLIC_IP_NAME} \
    --allocation-method Static \
    --sku Standard
```

## Create a Managed Identity for Application Gateway

Application Gateway will need to be able to access Key Vault to read the certificate.  To do so, it will use a User-assigned [Managed Identity](../active-directory/managed-identities-azure-resources/overview.md).  Create the Managed Identity as follows:

```azurecli
APPGW_IDENTITY_NAME='name-for-appgw-managed-identity'
az identity create -g ${RESOURCE_GROUP} -n $APPGW_IDENTITY_NAME
```

Then fetch the objectId for the Managed Identity as it will be used later on to give rights to access the certificate in Key Vault:

```azurecli
APPGW_IDENTITY_CLIENTID=$(az identity show -g $RESOURCE_GROUP -n $APPGW_IDENTITY_NAME -o tsv --query clientId)
APPGW_IDENTITY_OID=$(az ad sp show --id $APPGW_IDENTITY_CLIENTID --query objectId --out tsv)
```

## Set Policy on Key Vault

Configure Key Vault so that the Managed Identity for Application Gateway is allowed to access the certificate stored in Key Vault:

```azurecli
az keyvault set-policy --name $KV_NAME -g $KV_RG --object-id $APPGW_IDENTITY_OID --secret-permissions get list --certificate-permissions get list
```

## Create Application Gateway

Create an application gateway using `az network application-gateway create` and specify your application's private fully qualified domain name (FQDN) as servers in the backend pool.  Make sure to use the user-assigned Managed Identity and to point to the certificate in Key Vault using the certificate's Secret Id.  Then update the HTTP setting using `az network application-gateway http-settings update` to use the public host name.

```azurecli
APPGW_NAME='name-for-application-gateway'

KEYVAULT_SECRET_ID_FOR_CERT=$(az keyvault certificate show --name $CERT_NAME_IN_KV --vault-name $KV_NAME --query sid -o tsv)

az network application-gateway create \
    --name $APPGW_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --capacity 2 \
    --sku Standard_v2 \
    --frontend-port 443 \
    --http-settings-cookie-based-affinity Disabled \
    --http-settings-port 443 \
    --http-settings-protocol Https \
    --public-ip-address $APPLICATION_GATEWAY_PUBLIC_IP_NAME \
    --vnet-name $VIRTUAL_NETWORK_NAME \
    --subnet $APPLICATION_GATEWAY_SUBNET_NAME \
    --servers $SPRING_APP_PRIVATE_FQDN \
    --key-vault-secret-id $KEYVAULT_SECRET_ID_FOR_CERT \
    --identity $APPGW_IDENTITY_NAME
```

Update the HTTP settings to use the public domain name as the hostname instead of the domain suffixed with ".private.azuremicroservices.io" to send traffic to Azure Spring Cloud with.

```azurecli

az network application-gateway http-settings update \
    --gateway-name $APPGW_NAME \
    --resource-group $RESOURCE_GROUP \
    --host-name-from-backend-pool false \
    --host-name $DOMAIN_NAME \
    --name appGatewayBackendHttpSettings
```

It can take up to 30 minutes for Azure to create the application gateway. After it's created, check the backend health using `az network application-gateway show-backend-health`.  This examines whether the application gateway reaches your application through its private FQDN.

```azurecli
az network application-gateway show-backend-health \
    --name ${APPGW_NAME} \
    --resource-group ${RESOURCE_GROUP}
```

The output indicates the healthy status of backend pool.

```output
{
  "backendAddressPools": [
    {
      "backendHttpSettingsCollection": [
        {
          "servers": [
            {
              "address": "my-azure-spring-cloud-hello-vnet.private.azuremicroservices.io",
              "health": "Healthy",
              "healthProbeLog": "Success. Received 200 status code",
              "ipConfiguration": null
            }
          ]
        }
      ]
    }
  ]
}
```

## Configure DNS and access the application

Now configure the public DNS to point to Application Gateway using a CNAME or A-record.  The public address for Application Gateway can be found as follows:

```azurecli
az network public-ip show \
    --resource-group ${RESOURCE_GROUP} \
    --name ${APPLICATION_GATEWAY_PUBLIC_IP_NAME} \
    --query [ipAddress] \
    --output tsv
```

As of now the application can be accessed using the public domain name.

## See also

- [Troubleshooting Azure Spring Cloud in VNET](./troubleshooting-vnet.md)
- [Customer Responsibilities for Running Azure Spring Cloud in VNET](./vnet-customer-responsibilities.md)
