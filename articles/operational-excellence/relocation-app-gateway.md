---
title: Relocate an Azure Application Gateway and Web Application Firewall to another region
description: This article shows you how to relocate an Azure Application Gateway and Web Application Firewall from the current region to another region. 
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 03/26/2024
ms.service: application-gateway
ms.topic: concept
ms.custom:
  - subject-relocation
# Customer intent: As an Azure Application Gateway Standard and Web Application Firewall v2 administrator, I want to move my vault to another region.
---

# Relocate Azure Application Gateway and Web Application Firewall (WAF) to another region

 This article covers the recommended approach, guidelines, and practices to relocate Application Gateway and WAF between Azure regions.

:::image type="content" source="media/relocation/app-gateway/application-gateway-relocation-pattern.png" alt-text="Diagram showing the relocation process of Application Gateway and WAF from one region to another.":::


## Prerequisites

- Verify that your Azure subscription allows you to create Application Gateway with WAF in the target region.

- Create a dependency map with all the Azure services used by the Application Gateway. For the services that are in scope of the relocation, you must [select the appropriate relocation strategy](overview-relocation.md).


- Capture the below list of internal resources/setting of Application Gateway:
    - Frontend configuration (Public/Private IP)
    - Alert Notifications
    - Backend Pool Resources (ex. VMs, VMSS, Azure App Services)
    - WAF
    - Diagnostic Settings

## Redeploy

Since an Application Gateway is a type of load balancer there isn’t any data migration for relocation. The simplest way to relocation an Azure Application Gateway is to create another instance and redeploy your backend resources. Every object and dependency should be scripted out independently and properly reviewed. 

>[!IMPORTANT]
>The redeployment steps in this document apply only to the application gateway itself and not the backend services to which the application gateway rules are routing traffic. 

There are two options for Application Gateway deployment. 

## Redeployment option 1: Create a separate Application Gateway and IP address

This option requires you to create a separate Application Gateway deployment, using a new public IP address. Workloads are then migrated from the non-zone aware Application Gateway setup to the new one. 

Since you're changing the public IP address, changes to DNS configuration are required. This option also requires some changes to virtual networks and subnets.

Use this option to:

- Minimize downtime. If DNS records are updated to the new environment, clients will establish new connections to the new gateway with no interruption.
- Allow for extensive testing or even a blue/green scenario.

To create a separate Application Gateway, WAF (optional) and IP address:

1. Go to the [Azure portal](https://portal.azure.com).
2. Follow the steps in [Create an application gateway](../application-gateway/quick-create-portal.md#create-an-application-gateway) or [Create an application gateway with a Web Application Firewall](../web-application-firewall/ag/application-gateway-web-application-firewall-portal.md) to create a new Application Gateway v2 or Application Gateway v2 + WAF v2, respectively. You can reuse your existing Virtual Network or create a new one, but you must create a new frontend Public IP address.
3. Verify that the Application Gateway and WAF are working as intended.
4. Migrate your DNS configuration to the new public IP address.
5. Delete the old Application Gateway and WAF resources.

## Redeployment option 2: Delete and redeploy Application Gateway

This option doesn't require you to reconfigure your virtual network and subnets. If the public IP address for the Application Gateway is already configured for the desired end state zone awareness, you can choose to delete and redeploy the Application Gateway, and leave the Public IP address unchanged.

Use this option to:

- Avoid changing IP address, subnet, and DNS configurations.
- Move workloads that are not sensitive to downtime.

To delete the Application Gateway and WAF and redeploy:

1. Go to the [Azure portal](https://portal.azure.com). 
2. Select **All resources**, and then select the resource group that contains the Application Gateway.
3. Select the Application Gateway resource and then select **Delete**. Type **yes** to confirm deletion, and then select **Delete**.
4. Follow the steps in [Create an application gateway](../application-gateway/quick-create-portal.md#create-an-application-gateway) or [Create an application gateway with a Web Application Firewall](../web-application-firewall/ag/application-gateway-web-application-firewall-portal.md) to create a new Application Gateway v2 or Application Gateway v2 + WAF v2, respectively, using the same Virtual Network, subnets, and Public IP address that you used previously.

## Certificate Relocation for Premium TLS Inspection
This section needs to be considered if Application gateway has integration with Key Vault for server certificates that are attached to HTTPS-enabled listeners Application Gateway offers two models for TLS termination:

Application Gateway offers two models for TLS termination:

- Provide TLS/SSL certificates attached to the listener. This model is the traditional way to pass TLS/SSL certificates to Application Gateway for TLS termination.
- Provide a reference to an existing Key Vault certificate or secret when you create a HTTPS-enabled listener.

!WARNING: Azure Application Gateway currently supports only Key Vault accounts in the same subscription as the Application Gateway resource. Choosing a key vault under a different subscription than your Application Gateway will result in a failure.

Details on which certificates Azure Application uses, and how to deploy, are reported in this article: [Supported Certificates](https://docs.microsoft.com/en-us/azure/application-gateway/key-vault-certs#supported-certificates)

This support is limited to the v2 SKU of Application Gateway. For TLS termination, Application Gateway only supports certificates in Personal Information Exchange (PFX) format. You can either import an existing certificate or create a new one in your key vault. To avoid any failures, ensure that the certificate’s status is set to Enabled in Key Vault.

Instructions on how to export an existing certificate from a source AKV are reported here. [Export Certficates from Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/certificates/how-to-export-certificate?tabs=azure-cli) Downloading as certificate means getting the public portion. If you want both the private key and public metadata, then you can download it as secret. Once exported, the certificate in PFX format can be imported in the target AKV.

As of March 15, 2021, Key Vault recognizes Application Gateway as a trusted service by leveraging User Managed Identities for authentication to Azure Key Vault.

![AppGateway](./ag-kv.png)

### Key Vault Managed Identity
![ag-kv](https://github.com/MicrosoftDocs/azure-docs-pr/assets/7080358/13762e21-52cb-4569-8e34-35db9d115f8c)
![ag-kv](https://github.com/MicrosoftDocs/azure-docs-pr/assets/7080358/f876f274-58ac-44f9-aac2-7c4b658cff4e)


You would need to design access policies to a new user-assigned managed identity with your key vault.

When you’re using a restricted key vault, use the following steps in this documentation to configure Application Gateway to use firewalls and virtual networks: [Configure your Key Vault](https://docs.microsoft.com/en-us/azure/application-gateway/key-vault-certs#configure-your-key-vault)

