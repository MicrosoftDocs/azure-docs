---
title: Relocate an Azure Application Gateway and Web Application Firewall to another region
description: This article shows you how to relocate an Azure Application Gateway and Web Application Firewall from the current region to another region. 
author: anaharris-ms
ms.author: anaharris
ms.reviewer: anaharris
ms.date: 04/03/2024
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

### Redeploy option 1: Create a separate Application Gateway and IP address

With this option, you create a separate Application Gateway deployment with a new public IP address at the target location. Workloads are then migrated from the old Application Gateway set up to the new one. 

Since you're changing the public IP address, changes to DNS configuration are required. This option also requires some changes to virtual networks and subnets.

Use this option to:

- Minimize downtime. If DNS records are updated to the new environment, clients can establish new connections to the new gateway with no interruption.
- Allow for extensive testing or even a blue/green scenario.


>[!NOTE]
>Ensure that the Application Gateway subnet has enough address space to accommodate the number of instances required to serve your maximum expected traffic.

**To create a separate Application Gateway, WAF (optional) and IP address:**

1. Go to the [Azure portal](https://portal.azure.com).

1. If you use TLS termination for Key Vault, follow the [relocation procedure for Key Vault](./relocation-key-vault.md). Ensure that the Key Vault is in the same subscription as the relocated Application Gateway. You can create a new certificate or use the existing certificate for relocated Application Gateway.

1. Confirm that the virtual network is relocated *before* you relocate. To learn how to relocate your virtual network, see [Relocate Azure Virtual Network](./relocation-virtual-network.md).

2. Create an Application Gateway and configure a new Frontend Public IP Address for the virtual network:
    - Without WAF:  [Create an application gateway](../application-gateway/quick-create-portal.md#create-an-application-gateway).
    - With WAF: [Create an application gateway with a Web Application Firewall](../web-application-firewall/ag/application-gateway-web-application-firewall-portal.md) 
    

1. If you have a WAF config or custom rules-only WAF Policy, [transition it to to a full WAF policy](../web-application-firewall/ag/migrate-policy.md).

1. If you use a zero-trust network (source region) for web applications with Azure Firewall and Application Gateway, follow the guidelines and strategies in [Zero-trust network for web applications with Azure Firewall and Application Gatewayl](/azure/architecture/example-scenario/gateway/application-gateway-before-azure-firewall).

1. Verify that the Application Gateway and WAF are working as intended.

1. Migrate your configuration to the new public IP address.
     1. Switch Public and Private endpoints in order to point to the new application gateway. 
     1. Migrate your DNS configuration to the new Public- and/or Private  IP address.
     1. Update endpoints in consumer applications/services. While, consumer application/services updates are usually done by means of a properties change and re-deployment, use this manual method whenever a new hostname is used in respect to deployment in the source region.

1. Delete the old Application Gateway and WAF resources.

### Redeploy option 2: Delete and redeploy Application Gateway

This option doesn't require you to reconfigure your virtual network and subnets. If the public IP address for the Application Gateway is already configured for the desired end state zone awareness, you can choose to delete and redeploy the Application Gateway, and leave the Public IP address unchanged.

Use this option to:

- Avoid changing IP address, subnet, and DNS configurations.
- Move workloads that are not sensitive to downtime.

**To delete the Application Gateway and WAF and redeploy:**

1. Go to the [Azure portal](https://portal.azure.com). 

2. Select **All resources**, and then select the resource group that contains the Application Gateway.

3. Select the Application Gateway resource and then select **Delete**. Type **yes** to confirm deletion, and then select **Delete**.

4. Follow the steps in [Create an application gateway](../application-gateway/quick-create-portal.md#create-an-application-gateway) or [Create an application gateway with a Web Application Firewall](../web-application-firewall/ag/application-gateway-web-application-firewall-portal.md) to create a new Application Gateway v2 or Application Gateway v2 + WAF v2, respectively, using the same Virtual Network, subnets, and Public IP address that you used previously.

### Relocate certificates for Premium TLS Termination (Application Gateway v2)


Application Gateway v2 offers two models for TLS termination:

- *Attachment.* Provide an TLS/SSL certificate that's attached to the listener. The attachment model is the traditional way to pass TLS/SSL certificates to Application Gateway for TLS termination.

- *Reference.* Provide a reference to an existing Key Vault certificate or secret when you create a HTTPS-enabled listener. For more information on downloading a certificate, see [Relocate Key Vault to another region](./relocation-key-vault.md). When referencing a Key Vault certificate, consider:

    - As of March 15, 2021, Key Vault recognizes Application Gateway as a trusted service by leveraging User Managed Identities for authentication to Azure Key Vault.
    
    - Application Gateway v2 currently supports only Key Vault accounts in the same subscription as the Application Gateway v2 resource. Choosing a key vault under a different subscription than your Application Gateway v2 results in a failure.
    - You must design access policies to a new user-assigned managed identity with your key vault. For more more detailed information, see [TLS termination with Key Vault certificates](/azure/application-gateway/key-vault-certs#configure-your-key-vault) for your relocated Application Gateway. 

