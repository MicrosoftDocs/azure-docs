---
title: Create and configure MCC EDR Ingestion Agents
description: Learn how to create and configure MCC EDR Ingestion Agents for Azure Operator Insights 
author: rcdun
ms.author: rdunstan
ms.service: operator-insights
ms.topic: how-to #Required; leave this attribute/value as-is
ms.date: 10/31/2023
---

# Create and configure MCC EDR Ingestion Agents for Azure Operator Insights

The MCC EDR agent is a software package that is installed onto a Linux Virtual Machine (VM) owned and managed by you. The agent receives EDRs from an Affirmed MCC, and forwards them to Azure Operator Insights.  

## Prerequisites

- You must have an Affirmed Networks MCC deployment that generates EDRs.
- You must have an Azure Operator Insights MCC Data product deployment.
- You must provide VMs with the following specifications to run the agent:
  - OS - Red Hat Enterprise Linux 8.6 or later
  - Minimum hardware - 4 vCPU,  8-GB RAM, 30-GB disk
  - Network - connectivity from MCCs and to Azure
  - Software - systemd, logrotate and zip installed
  - SSH or alternative access to run shell commands
  - (Preferable) Ability to resolve public DNS.  If not, you need to perform extra steps to resolve Azure locations. Refer to [Running without public DNS](#running-without-public-dns) for instructions.

The number of VMs needed depends on the scale and redundancy characteristics of your deployment. Each agent instance must run on its own VM. Talk to the Affirmed Support Team to determine your requirements.

## Deploy the agent on your VMs

To deploy the agent on your VMs, follow the procedures outlined in the following sections.

### Acquire the agent RPM

A link to download the MCC EDR agent RPM is provided as part of the Azure Operator Insights onboarding process. See [How do I get access to Azure Operator Insights?](/articles/operator-insights/overview.md#how-do-i-get-access-to-azure-operator-insights) for details.

### Authentication

You must have a service principal with a certificate credential that can access the Azure Key Vault created by the Data Product to retrieve storage credentials. Each agent must also have a copy of a valid certificate and private key for the service principal stored on this virtual machine.

#### Create a service principal

> [!IMPORTANT]
> You may need a Microsoft Entra tenant administrator in your organization to perform this setup for you.

1. Create or obtain a Microsoft Entra ID service principal. Follow the instructions detailed in [Create a Microsoft Entra app and service principal in the portal](/entra/identity-platform/howto-create-service-principal-portal).
1. Note the Application (client) ID, and your Microsoft Entra Directory (tenant) ID (these IDs are UUIDs of the form xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, where each character is a hexadecimal digit).

#### Prepare certificates

It's up to you whether you use the same certificate and key for each VM, or use a unique certificate and key for each.  Using a certificate per VM provides better security and has a smaller impact if a key is leaked or the certificate expires. However, this method adds a higher maintainability and operational complexity.

1. Obtain a certificate. We strongly recommend using trusted certificate(s) from a certificate authority.
1. Add the certificate(s) as credential(s) to your service principal, following [Create a Microsoft Entra app and service principal in the portal](/entra/identity-platform/howto-create-service-principal-portal).
1. We **strongly recommend** additionally storing the certificates in a secure location such as Azure Key Vault.  Doing so allows you to configure expiry alerting and gives you time to regenerate new certificates and apply them to your ingestion agents before they expire.  Once a certificate has expired, the agent is unable to authenticate to Azure and no longer uploads data.  For details of this approach see [Renew your Azure Key Vault certificates](../key-vault/certificates/overview-renew-certificate.md).
    - You'll need the 'Key Vault Certificates Officer' role on the Azure Key Vault in order to add the certificate to the Key Vault. See [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md) for details of how to assign roles in Azure.

1. Ensure the certificate(s) are available in pkcs12 format, with no passphrase protecting them. On Linux, you can convert a certificate and key from PEM format using openssl:

    `openssl pkcs12 -nodes -export -in $certificate\_pem\_filename -inkey $key\_pem\_filename -out $pkcs12\_filename`

5. Ensure the certificate(s) are base64 encoded. On Linux, you can based64 encode a pkcs12-formatted certificate by using the command:

    `base64 -w 0 $pkcs12\_filename &gt; $base64filename`

#### Grant permissions for the Data Product Key Vault

1. Find the Azure Key Vault that holds the storage credentials for the input storage account. This Key Vault is in a resource group named *\<data-product-name\>-HostedResources-\<unique-id\>*.
1. Grant your service principal the 'Key Vault Secrets User' role on this Key Vault.  You need Owner level permissions on your Azure subscription.  See [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md) for details of how to assign roles in Azure.
1. Note the name of the Key Vault.

### Prepare the VMs

Repeat these steps for each VM onto which you want to install the agent:

1. Ensure you have an SSH session open to the VM, and that you have `sudo` permissions.
1. Verify that the VM has the following ports open:
    - Port 36001/TCP inbound from the MCCs
    - Port 443/TCP outbound to Azure
    
    These ports must be open both in cloud network security groups and in any firewall running on the VM itself (such as firewalld or iptables).
1. Install systemd, logrotate and zip on the VM, if not already present.
1. Obtain the ingestion agent RPM and copy it to the VM.
1. Copy the pkcs12-formatted base64-encoded certificate (created in the [Prepare certificates](#prepare-certificates) step) to an accessible location on the VM (such as /etc/az-mcc-edr-uploader).

#### Running without public DNS

**If your agent VMs have access to public DNS, then you can skip this step and continue to [Install and configure agent software](#install-and-configure-agent-software).**

If your agent VMs don't have access to public DNS, then you need to add entries on each agent VM to map the Azure host names to IP addresses.

This process assumes that you're connecting to Azure over ExpressRoute and are using Private Links and/or Service Endpoints. If you're connecting over public IP addressing, you **cannot** use this workaround and must use public DNS.

Create the following resources from a virtual network that is peered to your ingestion agents:

- A Service Endpoint to Azure Storage
- A Private Link or Service Endpoint to the Key Vault created by your Data Product. The Key Vault is the same one you found in [Grant permissions for the Data Product Key Vault](#grant-permissions-for-the-data-product-key-vault).

Steps:

1. Note the IP addresses of these two connections.
2. Note the ingestion URL for your Data Product.  You can find the ingestion URL on your Data Product overview page in the Azure portal, in the form *\<account name\>.blob.core.windows.net*.
3. Note the URL of the Data Product Key Vault.  The URL appears as *\<vault name\>.vault.azure.net*
4. Add a line to */etc/hosts* on the VM linking the two values in this format, for each of the storage and Key Vault:

    *\<Storage private IP\>*   *\<ingestion URL\>*

    *\<Key Vault private IP\>*  *\<Key Vault URL\>*


### Install agent software

Repeat these steps for each VM onto which you want to install the agent:

1. In an SSH session, change to the directory where the RPM was copied.
1. Install the RPM:  `sudo dnf install /*.rpm`.  Answer 'y' when prompted.  If there are any missing dependencies, the RPM isn't installed.
1. Change to the configuration directory: `cd /etc/az-mcc-edr-uploader`
1. Make a copy of the default configuration file:  `sudo cp example_config.yaml config.yaml`
1. Edit the *config.yaml* and fill out the fields.  Most of them are set to default values and don't need to be changed.  The full reference for each parameter is described in [MCC EDR Ingestion Agents configuration reference](mcc-edr-agent-configuration.md). The following parameters must be set:

    1. **site\_id** should be changed to a unique identifier for your on-premises site – for example, the name of the city or state for this site.  This name becomes searchable metadata in Operator Insights for all EDRs from this agent. 
    1. **agent\_id** should be a unique identifier for this agent – for example, the VM hostname.

    1. For the secret provider with name `data_product_keyvault`, set the following fields:
        1. **provider.vault\_name** must be the name of the Key Vault for your Data Product. You identified this name in [Grant permissions for the Data Product Key Vault](#grant-permissions-for-the-data-product-key-vault).  
        1. **provider.auth** must be filled out with:

            1. **tenant\_id** as your Microsoft Entra ID tenant.

            2. **identity\_name** as the application ID of the service principle that you created in [Create a service principle](#create-a-service-principal).

            3. **cert\_path** as the path on disk to the location of the base64-encoded certificate and private key for the service principal to authenticate with.

    1. **sink.container\_name** *must be left as "edr".*

1. Start the agent: `sudo systemctl start az-mcc-edr-uploader`

1. Check that the agent is running: `sudo systemctl status az-mcc-edr-uploader`

    1. If you see any status other than "active (running)", look at the logs as described in the [Monitor and troubleshoot MCC EDR Ingestion Agents for Azure Operator Insights](troubleshoot-mcc-edr-agent.md) article to understand the error.  It's likely that some configuration is incorrect.

    2. Once you resolve the issue,  attempt to start the agent again.

    3. If issues persist, raise a support ticket.

1. Once the agent is running, ensure it will automatically start on a reboot: `sudo systemctl enable az-mcc-edr-uploader.service`

1. Save a copy of the delivered RPM – you'll need it to reinstall or to back out any future upgrades.

### Configure affirmed MCCs

Once the agents are installed and running, configure the MCCs to send EDRs to them.

1. Follow the steps under "Generating SESSION, BEARER, FLOW, and HTTP Transaction EDRs" in the [Affirmed Networks Active Intelligent vProbe System Administration Guide](https://manuals.metaswitch.com/vProbe/13.1/vProbe_System_Admin/Content/02%20AI-vProbe%20Configuration/Generating_SESSION__BEARER__FLOW__and_HTTP_Transac.htm) (1), making the following changes:

    - Replace the IP addresses of the MSFs in MCC configuration with the IP addresses of the VMs running the ingestion agents.

    - Confirm that the following EDR server parameters are set:

        - port: 36001
        - encoding: protobuf
        - keep-alive: 2 seconds

## Important considerations

### Security

The VM used for the MCC EDR agent should be set up following best practice for security. For example:

- Networking - Only allow network traffic on the ports that are required to run the agent and maintain the VM.

- OS version - Keep the OS version up-to-date to avoid known vulnerabilities.

- Access - Limit access to the VM to a minimal set of users, and set up audit logging for their actions. For the MCC EDR agent, we recommend that the following are restricted:

  - Admin access to the VM (for example, to stop/start/install the MCC EDR software)

  - Access to the directory where the logs are stored *(/var/log/az-mcc-edr-uploader/)*

  - Access to the certificate and private key for the service principal

### Deploying for fault tolerance

The MCC EDR agent is designed to be highly reliable and resilient to low levels of network disruption. If an unexpected error occurs, the agent restarts and provides service again as soon as it's running.

The agent doesn't buffer data, so if a persistent error or extended connectivity problems occur, EDRs are dropped.

For additional fault tolerance, you can deploy multiple instances of the MCC EDR agent and configure the MCC to switch to a different instance if the original instance becomes unresponsive, or to share EDR traffic across a pool of agents. For more information, refer to the [Affirmed Networks Active Intelligent vProbe System Administration Guide](https://manuals.metaswitch.com/vProbe/13.1/vProbe_System_Admin/Content/02%20AI-vProbe%20Configuration/Generating_SESSION__BEARER__FLOW__and_HTTP_Transac.htm)(2) or speak to the Affirmed Networks Support Team.

## Related content

[Manage MCC EDR Ingestion Agents for Azure Operator Insights](how-to-manage-mcc-edr-agent.md)

[Monitor and troubleshoot MCC EDR Ingestion Agents for Azure Operator Insights](troubleshoot-mcc-edr-agent.md)

[1] Only accessible for customers with Affirmed Support

[2] Only accessible for customers with Affirmed support
