---
title: Relocate an Azure Application Gateway and Web Application Firewall to another region
description: This article shows you how to relocate an Azure Application Gateway and Web Application Firewall from the current region to another region. 
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 04/03/2024
ms.service: application-gateway
ms.topic: concept-article
ms.custom:
  - subject-relocation
# Customer intent: As an Azure Application Gateway Standard and Web Application Firewall v2 administrator, I want to move my vault to another region.
---

# Relocate Azure Application Gateway and Web Application Firewall (WAF) to another region

 This article covers the recommended approach, guidelines, and practices to relocate Application Gateway and WAF between Azure regions. 



>[!IMPORTANT]
>The redeployment steps in this document apply only to the application gateway itself and not the backend services to which the application gateway rules are routing traffic. 

## Prerequisites

- Verify that your Azure subscription allows you to create Application Gateway SKUs in the target region.

- Plan your relocation strategy with an understanding of all services that are required for your Application Gateway. For the services that are in scope of the relocation, you must select the appropriate relocation strategy.
    - Ensure that the Application Gateway subnet at the target location has enough address space to accommodate the number of instances required to serve your maximum expected traffic.

- For Application Gateway's deployment, you must consider and plan the setup of the following sub-resources:
    - Frontend configuration (Public/Private IP)
    - Backend Pool Resources (ex. VMs, Virtual Machine Scale Sets, Azure App Services)
    - Private Link
    - Certificates
    - Diagnostic Settings
    - Alert Notifications

 - Ensure that the Application Gateway subnet at the target location has enough address space to accommodate the number of instances required to serve your maximum expected traffic.


## Redeploy

To relocate Application Gateway and optional WAF, you must create a separate Application Gateway deployment with a new public IP address at the target location. Workloads are then migrated from the source Application Gateway setup to the new one.  Since you're changing the public IP address, changes to DNS configuration, virtual networks, and subnets are also required. 


If you only want to relocate in order to gain availability zones support, see [Migrate Application Gateway and WAF to availability zone support](../reliability/migrate-app-gateway-v2.md).

**To create a separate Application Gateway, WAF (optional) and IP address:**

1. Go to the [Azure portal](https://portal.azure.com).

1. If you use TLS termination for Key Vault, follow the [relocation procedure for Key Vault](./relocation-key-vault.md). Ensure that the Key Vault is in the same subscription as the relocated Application Gateway. You can create a new certificate or use the existing certificate for relocated Application Gateway.

1. Confirm that the virtual network is relocated *before* you relocate. To learn how to relocate your virtual network, see [Relocate Azure Virtual Network](./relocation-virtual-network.md).

1. Confirm that the backend pool server or service, such as VM, Virtual Machine Scale Sets, PaaS, is relocated *before* you relocate.

2. Create an Application Gateway and configure a new Frontend Public IP Address for the virtual network:
    - Without WAF:  [Create an application gateway](../application-gateway/quick-create-portal.md#create-an-application-gateway).
    - With WAF: [Create an application gateway with a Web Application Firewall](../web-application-firewall/ag/application-gateway-web-application-firewall-portal.md) 
    

1. If you have a WAF config or custom rules-only WAF Policy, [transition it to to a full WAF policy](../web-application-firewall/ag/migrate-policy.md).

1. If you use a zero-trust network (source region) for web applications with Azure Firewall and Application Gateway, follow the guidelines and strategies in [Zero-trust network for web applications with Azure Firewall and Application Gateway](/azure/architecture/example-scenario/gateway/application-gateway-before-azure-firewall).

1. Verify that the Application Gateway and WAF are working as intended.

1. Migrate your configuration to the new public IP address.
     1. Switch Public and Private endpoints in order to point to the new application gateway. 
     1. Migrate your DNS configuration to the new Public- and/or Private  IP address.
     1. Update endpoints in consumer applications/services. Consumer application/services updates are usually done by means of a properties change and redeployment. However, perform this method whenever a new hostname is used in respect to deployment in the old region.

1. Delete the source Application Gateway and WAF resources.

## Relocate certificates for Premium TLS Termination (Application Gateway v2)


The certificates for TLS termination can be supplied in two ways:

- *Upload.* Provide an TLS/SSL certificate by directly uploading it to your Application Gateway.

- *Key Vault reference.* Provide a reference to an existing Key Vault certificate when you create a HTTPS/TLS-enabled listener. For more information on downloading a certificate, see [Relocate Key Vault to another region](./relocation-key-vault.md). 

>[!WARNING]
 >References to Key Vaults in other Azure subscriptions are supported, but must be configured via ARM template, Azure PowerShell, CLI, Bicep, etc. Cross-subscription key vault configuration is not supported by Application Gateway via Azure portal.


Follow the documented procedure to enable [TLS termination with Key Vault certificates](/azure/application-gateway/key-vault-certs#configure-your-key-vault) for your relocated Application Gateway. 

