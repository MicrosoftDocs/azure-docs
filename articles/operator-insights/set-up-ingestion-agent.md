---
title: Set up the Azure Operator Insights ingestion agent
description: Set up the ingestion agent for Azure Operator Insights by installing it and configuring it to upload data to data products.
author: rcdun
ms.author: rdunstan
ms.reviewer: sergeyche
ms.service: operator-insights
ms.topic: how-to
ms.date: 02/29/2024

#CustomerIntent: As a admin in an operator network, I want to upload data to Azure Operator Insights so that my organization can use Azure Operator Insights.
---

# Install the Azure Operator Insights ingestion agent and configure it to upload data

When you follow this article, you set up an Azure Operator Insights _ingestion agent_ on a virtual machine (VM) in your network and configure it to upload data to a data product. This ingestion agent supports uploading:

- Files stored on an SFTP server.
- Affirmed Mobile Content Cloud (MCC) Event Data Record (EDR) data streams.

For an overview of ingestion agents, see [Ingestion agent overview](ingestion-agent-overview.md).

## Prerequisites

From the documentation for your data product, obtain the:
- Specifications for the VM on which you plan to install the VM agent.
- Sample configuration for the ingestion agent.

## VM security recommendations

The VM used for the ingestion agent should be set up following best practice for security. For example:

- Networking - Only allow network traffic on the ports that are required to run the agent and maintain the VM.
- OS version - Keep the OS version up-to-date to avoid known vulnerabilities.
- Access - Limit access to the VM to a minimal set of users, and set up audit logging for their actions. We recommend that you restrict the following.
  - Admin access to the VM (for example, to stop/start/install the ingestion agent).
  - Access to the directory where the logs are stored: */var/log/az-aoi-ingestion/*.
  - Access to the certificate and private key for the service principal that you create during this procedure.
  - Access to the directory for secrets that you create on the VM during this procedure.

## Download the RPM for the agent

Download the RPM for the ingestion agent using the details you received as part of the [Azure Operator Insights onboarding process](overview.md#how-do-i-get-access-to-azure-operator-insights) or from [https://go.microsoft.com/fwlink/?linkid=2260508](https://go.microsoft.com/fwlink/?linkid=2260508).

Links to the current and previous releases of the agents are available below the heading of each [release note](ingestion-agent-release-notes.md). If you're looking for an agent version that's more than 6 months old, check out the [release notes archive](ingestion-agent-release-notes-archive.md).

## Set up authentication to Azure

You must have a service principal with a certificate credential that can access the Azure Key Vault created by the Data Product to retrieve storage credentials. Each agent must also have a copy of a valid certificate and private key for the service principal stored on this virtual machine.

### Create a service principal

> [!IMPORTANT]
> You may need a Microsoft Entra tenant administrator in your organization to perform this setup for you.

1. Create or obtain a Microsoft Entra ID service principal. Follow the instructions detailed in [Create a Microsoft Entra app and service principal in the portal](/entra/identity-platform/howto-create-service-principal-portal). Leave the **Redirect URI** field empty.
1. Note the Application (client) ID, and your Microsoft Entra Directory (tenant) ID (these IDs are UUIDs of the form xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, where each character is a hexadecimal digit).

### Prepare certificates

The ingestion agent only supports certificate-based authentication for service principals. It's up to you whether you use the same certificate and key for each VM, or use a unique certificate and key for each. Using a certificate per VM provides better security and has a smaller impact if a key is leaked or the certificate expires. However, this method adds a higher maintainability and operational complexity.

1. Obtain one or more certificates. We strongly recommend using trusted certificates from a certificate authority.
2. Add the certificate or certificates as credentials to your service principal, following [Create a Microsoft Entra app and service principal in the portal](/entra/identity-platform/howto-create-service-principal-portal).
3. We **strongly recommend** additionally storing the certificates in a secure location such as Azure Key Vault. Doing so allows you to configure expiry alerting and gives you time to regenerate new certificates and apply them to your ingestion agents before they expire. Once a certificate expires, the agent is unable to authenticate to Azure and no longer uploads data. For details of this approach see [Renew your Azure Key Vault certificates](../key-vault/certificates/overview-renew-certificate.md). If you choose to use Azure Key Vault then:
    - This Azure Key Vault must be a different instance, either one you already control, or a new one. You can't use the Data Product's Azure Key Vault.
    - You need the 'Key Vault Certificates Officer' role on this Azure Key Vault in order to add the certificate to the Key Vault. See [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md) for details of how to assign roles in Azure.

4. Ensure the certificates are available in pkcs12 format, with no passphrase protecting them. On Linux, you can convert a certificate and key from PEM format using openssl.
    ```
    openssl pkcs12 -nodes -export -in <pem-certificate-filename> -inkey <pem-key-filename> -out <pkcs12-certificate-filename>
    ```

> [!IMPORTANT]
> The pkcs12 file must not be protected with a passphrase. When OpenSSL prompts you for an export password, press <kbd>Enter</kbd> to supply an empty passphrase.

5. Validate your pkcs12 file. This displays information about the pkcs12 file including the certificate and private key.
    ```
    openssl pkcs12 -nodes -in <pkcs12-certificate-filename> -info
    ```

6. Ensure the pkcs12 file is base64 encoded. On Linux, you can base64 encode a pkcs12-formatted certificate by using the `base64` command.
    ```
    base64 -w 0 <pkcs12-certificate-filename> > <base64-encoded-pkcs12-certificate-filename>
    ```

### Grant permissions for the Data Product Key Vault

1. Find the Azure Key Vault that holds the storage credentials for the input storage account. This Key Vault is in a resource group named *`<data-product-name>-HostedResources-<unique-id>`*.
1. Grant your service principal the 'Key Vault Secrets User' role on this Key Vault. You need Owner level permissions on your Azure subscription. See [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md) for details of how to assign roles in Azure.
1. Note the name of the Key Vault.

## Prepare the SFTP server

This section is only required for the SFTP pull source.

On the SFTP server:

1. Ensure port 22/TCP to the VM is open.
1. Create a new user, or determine an existing user on the SFTP server that the ingestion agent should use to connect to the SFTP server.
1. Determine the authentication method that the ingestion agent should use to connect to the SFTP server. The agent supports:
    - Password authentication
    - SSH key authentication
1. Configure the SFTP server to remove files after a period of time (a _retention period_). Ensure the retention period is long enough that the agent should process the files before the SFTP server deletes them. The example configuration file contains configuration for checking for new files every five minutes.

> [!IMPORTANT]
> Your SFTP server must remove files after a suitable retention period so that it does not run out of disk space. The ingestion agent does not remove files automatically.
>
> A shorter retention time reduces disk usage, increases the speed of the agent and reduces the risk of duplicate uploads. However, a shorter retention period increases the risk that data is lost if data cannot be retrieved by the agent or uploaded to Azure Operator Insights.

## Prepare the VMs

Repeat these steps for each VM onto which you want to install the agent.

1. Ensure you have an SSH session open to the VM, and that you have `sudo` permissions.
1. Install systemd, logrotate, and zip on the VM, if not already present. For example:
    ```
    sudo dnf install systemd logrotate zip
    ```
1. Obtain the ingestion agent RPM and copy it to the VM.
1. Copy the pkcs12-formatted base64-encoded certificate (created in the [Prepare certificates](#prepare-certificates) step) to the VM, in a location accessible to the ingestion agent.
1. Configure the agent VM based on the type of ingestion source.

    # [SFTP sources](#tab/sftp)

    1. Verify that the VM has the following ports open. These ports must be open both in cloud network security groups and in any firewall running on the VM itself (such as firewalld or iptables).
        - Port 443/TCP outbound to Azure
        - Port 22/TCP outbound to the SFTP server
    1. Create a directory to use for storing secrets for the agent. We call this directory the _secrets directory_. Note its path.
    1. Create a file in the secrets directory containing password or private SSH key for the SFTP server.
       - The file must not have a file extension.
       - Choose an appropriate name for this file, and note it for later. This name is referenced in the agent configuration.
       - The file must contain only the secret value (password or SSH key), with no extra whitespace.
    1. If you're using an SSH key that has a passphrase to authenticate, use the same method to create a separate file that contains the passphrase.
    1. Ensure the SFTP server's public SSH key is listed on the VM's global known_hosts file located at */etc/ssh/ssh_known_hosts*.

    > [!TIP]
    > Use the Linux command `ssh-keyscan` to add a server's SSH public key to a VM's *known_hosts* file manually. For example, `ssh-keyscan -H <server-ip> | sudo tee -a /etc/ssh/ssh_known_hosts`.

    # [MCC EDR sources](#tab/edr)

    Verify that the VM has the following ports open. These ports must be open both in cloud network security groups and in any firewall running on the VM itself (such as firewalld or iptables).
    - Port 36001/TCP inbound from the MCCs
    - Port 443/TCP outbound to Azure

    You can configure the inbound rule with:
    ```
    sudo firewall-cmd --permanent --new-service=mcc-connection 
    sudo firewall-cmd --permanent --service=mcc-connection --add-port=36001/tcp 
    sudo firewall-cmd --add-service=mcc-connection --permanent 
    sudo firewall-cmd --reload
    ```

    ---

## Ensure that VM can resolve Microsoft hostnames

Check that the VM can resolve public hostnames to IP addresses. For example, open an SSH session and use `dig login.microsoftonline.com` to check that the VM can resolve `login.microsoftonline.com` to an IP address.

If the VM can't use DNS to resolve public Microsoft hostnames to IP addresses, [map the required hostnames to IP addresses](map-hostnames-ip-addresses.md). Return to this procedure when you have finished the configuration.

## Install the agent software

Repeat these steps for each VM onto which you want to install the agent:

1. In an SSH session, change to the directory where the RPM was copied.
1. Install the RPM.
    ```
    sudo dnf install ./*.rpm
    ```
    Answer `y` when prompted. If there are any missing dependencies, the RPM won't be installed.

## Configure the agent software

The configuration you need is specific to the type of source and your Data Product. Ensure you have access to your Data Product's documentation to see the required values. For example:
- [Quality of Experience - Affirmed MCC Data Product - required agent configuration](concept-mcc-data-product.md#required-agent-configuration)
- [Monitoring - Affirmed MCC Data Product - required agent configuration](concept-monitoring-mcc-data-product.md#required-agent-configuration)

1. Connect to the VM over SSH.
1. Change to the configuration directory.
    ```
    cd /etc/az-aoi-ingestion
    ```
1. Make a copy of the default configuration file.
    ```
    sudo cp example_config.yaml config.yaml
    ```
1. Set the `agent_id` field to a unique identifier for the agent instance – for example `london-sftp-1`. This name becomes searchable metadata in Operator Insights for all data ingested by this agent. Reserved URL characters must be percent-encoded.
1. Configure the `secret_providers` section.
    # [SFTP sources](#tab/sftp)

    SFTP sources require two types of secret providers.

    -  A secret provider of type `key_vault`, which contains details required to connect to the Data Product's Azure Key Vault and allow connection to the Data Product's input storage account.
    -  A secret provider of type `file_system`, which specifies a directory on the VM for storing credentials for connecting to an SFTP server.
    
    1. For the secret provider with type `key_vault` and name `data_product_keyvault`, set the following fields.
        - `provider.vault_name` must be the name of the Key Vault for your Data Product. You identified this name in [Grant permissions for the Data Product Key Vault](#grant-permissions-for-the-data-product-key-vault).  
        - `provider.auth`, containing:
            - `tenant_id`: your Microsoft Entra ID tenant.
            - `identity_name`: the application ID of the service principal that you created in [Create a service principal](#create-a-service-principal).
            - `cert_path`: the file path of the base64-encoded pcks12 certificate for the service principal to authenticate with. This can be any path on the agent VM.

    1. For the secret provider with type `file_system` and name `local_file_system`, set the following fields.
        - `provider.auth.secrets_directory`: the absolute path to the secrets directory on the agent VM, which was created in the [Prepare the VMs](#prepare-the-vms) step.
    
    You can add more secret providers (for example, if you want to upload to multiple data products) or change the names of the default secret providers.

    # [MCC EDR sources](#tab/edr)
    
    Configure a secret provider with type `key_vault` and name `data_product_keyvault`, setting the following fields.

    1. `provider.vault_name`: the name of the Key Vault for your Data Product. You identified this name in [Grant permissions for the Data Product Key Vault](#grant-permissions-for-the-data-product-key-vault).  
    1. `provider.auth`, containing:
        - `tenant_id`: your Microsoft Entra ID tenant.
        - `identity_name`: the application ID of the service principal that you created in [Create a service principal](#create-a-service-principal).
        - `cert_path`: the file path of the base64-encoded pcks12 certificate for the service principal to authenticate with. This can be any path on the agent VM.

    You can add more secret providers (for example, if you want to upload to multiple data products) or change the names of the default secret provider.

    ---
1. Configure the `pipelines` section using the example configuration and your Data Product's documentation. Each `pipeline` has three configuration sections.
    - `id`. The ID identifies the pipeline and must not be the same as any other pipeline ID for this ingestion agent. Any URL reserved characters must be percent-encoded. Refer to your Data Product's documentation for any recommendations.
    - `source`. Source configuration controls which files are ingested. You can configure multiple sources.

        # [SFTP sources](#tab/sftp)

        Delete all pipelines in the example except the `contoso-logs` example, which contains `sftp_pull` source configuration.

        Update the example to meet your requirements. The following fields are required for each source.

        - `host`: the hostname or IP address of the SFTP server.
        - `filtering.base_path`: the path to a folder on the SFTP server that files will be uploaded to Azure Operator Insights from.
        - `known_hosts_file`: the path on the VM to the global known_hosts file, located at `/etc/ssh/ssh_known_hosts`. This file should contain the public SSH keys of the SFTP host server as outlined in [Prepare the VMs](#prepare-the-vms). 
        - `user`: the name of the user on the SFTP server that the agent should use to connect.
        - In `auth`, the `type` (`password` or `key`) you chose in [Prepare the VMs](#prepare-the-vms). For password authentication, set `secret_name` to the name of the file containing the password in the `secrets_directory` folder. For SSH key authentication, set `key_secret` to the name of the file containing the SSH key in the `secrets_directory` folder. If the key is protected with a passphrase, set `passphrase_secret_name`.
        
        For required or recommended values for other fields, refer to the documentation for your Data Product.

        > [!TIP]
        > The agent supports additional optional configuration for the following:
        > - Specifying a pattern of files in the `base_path` folder which will be uploaded (by default all files in the folder are uploaded).
        > - Specifying a pattern of files in the `base_path` folder which should not be uploaded.
        > - A time and date before which files in the `base_path` folder will not be uploaded.
        > - How often the ingestion agent uploads files (the value provided in the example configuration file corresponds to every hour).
        > - A settling time, which is a time period after a file is last modified that the agent will wait before it is uploaded (the value provided in the example configuration file is 5 minutes).
        >
        > For more information about these configuration options, see [Configuration reference for Azure Operator Insights ingestion agent](ingestion-agent-configuration-reference.md).

        # [MCC EDR sources](#tab/edr)

        Delete all pipelines in the example except `mcc_edrs`. Most of the fields in `mcc_edrs` are set to default values. You can leave them unchanged unless you need a specific value.

        ---
    - `sink`. Sink configuration controls uploading data to the Data Product's input storage account.
        - In the `auth` section, set the `secret_provider` to the appropriate `key_vault` secret provider for the Data Product, or use the default `data_product_keyvault` if you used the default name earlier. Leave `type` and `secret_name` unchanged.
        - Refer to your Data Product's documentation for information on required values for other parameters.
            > [!IMPORTANT]
            > The `container_name` field must be set exactly as specified by your Data Product's documentation.

## Start the agent software

1. Start the agent.
    ```
    sudo systemctl start az-aoi-ingestion
    ```
1. Check that the agent is running.
    ```
    sudo systemctl status az-aoi-ingestion
    ```
    1. If you see any status other than `active (running)`, look at the logs as described in [Monitor and troubleshoot ingestion agents for Azure Operator Insights](monitor-troubleshoot-ingestion-agent.md) to understand the error. It's likely that some configuration is incorrect.
    1. Once you resolve the issue,  attempt to start the agent again.
    1. If issues persist, raise a support ticket.
1. Once the agent is running, ensure it starts automatically after reboot.
    ```    
    sudo systemctl enable az-aoi-ingestion.service
    ```
1. Save a copy of the delivered RPM – you need it to reinstall or to back out any future upgrades.

## Related content

Learn how to:

- [View data in dashboards](dashboards-use.md).
- [Query data](data-query.md).
- [Monitor and troubleshoot ingestion agents](monitor-troubleshoot-ingestion-agent.md).
- [Change configuration for ingestion agents](change-ingestion-agent-configuration.md).
- [Upgrade ingestion agents](upgrade-ingestion-agent.md).
- [Rotate secrets for ingestion agents](rotate-secrets-for-ingestion-agent.md).
