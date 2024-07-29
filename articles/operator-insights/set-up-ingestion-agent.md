---
title: Set up the Azure Operator Insights ingestion agent
description: Set up the ingestion agent for Azure Operator Insights by installing it and configuring it to upload data to Data Products.
author: rcdun
ms.author: rdunstan
ms.reviewer: sergeyche
ms.service: operator-insights
ms.topic: how-to
ms.date: 02/29/2024

#CustomerIntent: As a admin in an operator network, I want to upload data to Azure Operator Insights so that my organization can use Azure Operator Insights.
---

# Install the Azure Operator Insights ingestion agent and configure it to upload data

When you follow this article, you set up an Azure Operator Insights _ingestion agent_ on a virtual machine (VM) in your network and configure it to upload data to a Data Product. This ingestion agent supports uploading:

- Files stored on an SFTP server.
- Affirmed Mobile Content Cloud (MCC) Event Data Record (EDR) data streams.

For an overview of ingestion agents, see [Ingestion agent overview](ingestion-agent-overview.md).

## Prerequisites

From the documentation for your Data Product, obtain the:
- Specifications for the VM on which you plan to install the VM agent.
- Sample configuration for the ingestion agent.

## VM security recommendations

The VM used for the ingestion agent should be set up following best practice for security. We recommend the following actions:

### Networking

When using an Azure VM:

- Give the VM a private IP address.
- Configure a Network Security Group (NSG) to only allow network traffic on the ports that are required to run the agent and maintain the VM.
- Beyond this, network configuration depends on whether restricted access is set up on the Data Product (whether you're using service endpoints to access the Data product's input storage account). Some networking configuration might incur extra cost, such as an Azure virtual network between the VM and the Data Product's input storage account.
 
When using an on-premises VM:

- Configure a firewall to only allow network traffic on the ports that are required to run the agent and maintain the VM.

### Disk encryption

Ensure Azure disk encryption is enabled (this is the default when you create the VM).

### OS version

- Keep the OS version up-to-date to avoid known vulnerabilities.
- Configure the VM to periodically check for missing system updates.

### Access

Limit access to the VM to a minimal set of users. Configure audit logging on the VM - for example, using the Linux audit package - to record sign-in attempts and actions taken by logged-in users.

We recommend that you restrict the following types of access.
- Admin access to the VM (for example, to stop/start/install the ingestion agent).
- Access to the directory where the logs are stored: */var/log/az-aoi-ingestion/*.
- Access to the managed identity or certificate and private key for the service principal that you create during this procedure.
- Access to the directory for secrets that you create on the VM during this procedure.

### Microsoft Defender for Cloud

When using an Azure VM, also follow all recommendations from Microsoft Defender for Cloud. You can find these recommendations in the portal by navigating to the VM, then selecting Security.

## Set up authentication to Azure

The ingestion agent must be able to authenticate with the Azure Key Vault created by the Data Product to retrieve storage credentials. The method of authentication can either be:

- Service principal with certificate credential. If the ingestion agent is running outside of Azure, such as in an on-premises network, you must use this method. 
- Managed identity. If the ingestion agent is running on an Azure VM, we recommend this method. It doesn't require handling any credentials (unlike a service principal).

> [!IMPORTANT]
> You may need a Microsoft Entra tenant administrator in your organization to perform this setup for you.

### Use a managed identity for authentication

If the ingestion agent is running in Azure, we recommend managed identities. For more detailed information, see the [overview of managed identities](managed-identity.md#overview-of-managed-identities).

> [!NOTE]
> Ingestion agents on Azure VMs support both system-assigned and user-assigned managed identities. For multiple agents, a user-assigned managed identity is simpler because you can authorise the identity to the Data Product Key Vault for all VMs running the agent.

1. Create or obtain a user-assigned managed identity, by following the instructions in [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities). If you plan to use a system-assigned managed identity, don't create a user-assigned managed identity.
1. Follow the instructions in [Configure managed identities for Azure resources on a VM using the Azure portal](/entra/identity/managed-identities-azure-resources/qs-configure-portal-windows-vm) according to the type of managed identity being used.
1. Note the Object ID of the managed identity. The Object ID is a UUID of the form xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, where each character is a hexadecimal digit.

You can now [grant permissions for the Data Product Key Vault](#grant-permissions-for-the-data-product-key-vault).

### Use a service principal for authentication

If the ingestion agent is running outside of Azure, such as an on-premises network then you **cannot use managed identities** and must instead  authenticate to the Data Product Key Vault using a service principal with a certificate credential. Each agent must also have a copy of the certificate stored on the virtual machine.

#### Create a service principal

1. Create or obtain a Microsoft Entra ID service principal. Follow the instructions detailed in [Create a Microsoft Entra app and service principal in the portal](/entra/identity-platform/howto-create-service-principal-portal). Leave the **Redirect URI** field empty.
1. Note the Application (client) ID, and your Microsoft Entra Directory (tenant) ID (these IDs are UUIDs of the form xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, where each character is a hexadecimal digit).

#### Prepare certificates for the service principal

The ingestion agent only supports certificate credentials for service principals. It's up to you whether you use the same certificate and key for each VM, or use a unique certificate and key for each. Using a certificate per VM provides better security and has a smaller impact if a key is leaked or the certificate expires. However, this method adds a higher maintainability and operational complexity.

1. Obtain one or more certificates. We strongly recommend using trusted certificates from a certificate authority. Certificates can be generated from Azure Key Vault: see [Set and retrieve a certificate from Key Vault using Azure portal](../key-vault/certificates/quick-create-portal.md). Doing so allows you to configure expiry alerting and gives you time to regenerate new certificates and apply them to your ingestion agents before they expire. Once a certificate expires, the agent is unable to authenticate to Azure and no longer uploads data. For details of this approach see [Renew your Azure Key Vault certificates](../key-vault/certificates/overview-renew-certificate.md). If you choose to use Azure Key Vault then:
    - This Azure Key Vault must be a different instance to the Data Product Key Vault, either one you already control, or a new one.
    - You need the 'Key Vault Certificates Officer' role on this Azure Key Vault in order to add the certificate to the Key Vault. See [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml) for details of how to assign roles in Azure.
2. Add the certificate or certificates as credentials to your service principal, following [Create a Microsoft Entra app and service principal in the portal](/entra/identity-platform/howto-create-service-principal-portal).
3. Ensure the certificates are available in PKCS#12 (P12) format, with no passphrase protecting them. 
    - If the certificate is stored in an Azure Key Vault, download the certificate in the PFX format. PFX is identical to P12.
    - On Linux, you can convert a certificate and private key using OpenSSL. When prompted for an export password, press <kbd>Enter</kbd> to supply an empty passphrase. This can then be stored in an Azure Key Vault as outlined in step 1.
    ```
    openssl pkcs12 -nodes -export -in <certificate.pem> -inkey <key.pem> -out <certificate.p12>
    ```

> [!IMPORTANT]
> The P12 file must not be protected with a passphrase.

4. Validate your P12 file. This displays information about the P12 file including the certificate and private key.
    ```
    openssl pkcs12 -nodes -in <certificate.p12> -info
    ```

5. Ensure the P12 file is base64 encoded. On Linux, you can base64 encode a P12 certificate by using the `base64` command.
    ```
    base64 -w 0 <certificate.p12> > <base64-encoded-certificate.p12>
    ```

### Grant permissions for the Data Product Key Vault

1. Find the Azure Key Vault that holds the storage credentials for the input storage account. This Key Vault is in a resource group named *`<data-product-name>-HostedResources-<unique-id>`*.
1. Grant your service principal the 'Key Vault Secrets User' role on this Key Vault. You need Owner level permissions on your Azure subscription. See [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml) for details of how to assign roles in Azure.
1. Note the name of the Key Vault.

## Prepare the SFTP server

This section is only required for the SFTP pull source.

On the SFTP server:

1. Ensure port 22/TCP to the VM is open.
1. Create a new user, or determine an existing user on the SFTP server that the ingestion agent should use to connect to the SFTP server.
    - By default the ingestion agent searches every directory under the base path, so this user must be able to read all of them. Any directories that the user does not have permission to access must be excluded using the `exclude_pattern` configuration.
    > [!Note]
    > Implicitly excluding directories by not specifying them in the included pattern is not sufficient to stop the agent searching those directories. See [the configuration reference](ingestion-agent-configuration-reference.md) for more detail on excluding directories.
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
1. If you're using a service principal, copy the base64-encoded P12 certificate (created in the [Prepare certificates](#prepare-certificates-for-the-service-principal) step) to the VM, in a location accessible to the ingestion agent.
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

## Ensure that the VM can resolve Microsoft hostnames

Check that the VM can resolve public hostnames to IP addresses. For example, open an SSH session and use `dig login.microsoftonline.com` to check that the VM can resolve `login.microsoftonline.com` to an IP address.

If the VM can't use DNS to resolve public Microsoft hostnames to IP addresses, [map the required hostnames to IP addresses](map-hostnames-ip-addresses.md). Return to this procedure when you have finished the configuration.

## Install the agent software

The agent software package is hosted on the "Linux software repository for Microsoft products" at [https://packages.microsoft.com](https://packages.microsoft.com)

**The name of the ingestion agent package is `az-aoi-ingestion`.**

To download and install a package from the software repository, follow the relevant steps for your VM's Linux distribution in [
How to install Microsoft software packages using the Linux Repository](/linux/packages#how-to-install-microsoft-software-packages-using-the-linux-repository).

 For example, if you're installing on a VM running Red Hat Enterprise Linux (RHEL) 8, follow the instructions under the [Red Hat-based Linux distributions](/linux/packages#red-hat-based-linux-distributions) heading, substituting the following parameters:

- distribution:  `rhel`
- version: `8`
- package-name: `az-aoi-ingestion`

## Configure the agent software

The configuration you need is specific to the type of source and your Data Product. Ensure you have access to your Data Product's documentation to see the required values. For example:
- [Quality of Experience - Affirmed MCC Data Product - ingestion configuration](concept-mcc-data-product.md#required-ingestion-configuration)
- [Monitoring - Affirmed MCC Data Product - ingestion configuration](concept-monitoring-mcc-data-product.md#required-ingestion-configuration)

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
        - `vault_name` must be the name of the Key Vault for your Data Product. You identified this name in [Grant permissions for the Data Product Key Vault](#grant-permissions-for-the-data-product-key-vault).
        - Depending on the type of authentication you chose in [Set up authentication to Azure](#set-up-authentication-to-azure), set either `managed_identity` or `service_principal`.
            - For a managed identity: set `object_id` to the Object ID of the managed identity that you created in [Use a managed identity for authentication](#use-a-managed-identity-for-authentication).
            - For a service principal: set `tenant_id` to your Microsoft Entra ID tenant, `client_id` to the Application (client) ID of the service principal that you created in [Create a service principal](#create-a-service-principal), and `cert_path` to the file path of the base64-encoded P12 certificate on the VM.
    1. For the secret provider with type `file_system` and name `local_file_system`, set the following fields.
        - `secrets_directory` to the absolute path to the secrets directory on the agent VM, which was created in the [Prepare the VMs](#prepare-the-vms) step.
    
    You can add more secret providers (for example, if you want to upload to multiple Data Products) or change the names of the default secret providers.

    # [MCC EDR sources](#tab/edr)
    
    Configure a secret provider with type `key_vault` and name `data_product_keyvault`, setting the following fields.

    1. For the secret provider with type `key_vault` and name `data_product_keyvault`, set the following fields.
        - `vault_name` must be the name of the Key Vault for your Data Product. You identified this name in [Grant permissions for the Data Product Key Vault](#grant-permissions-for-the-data-product-key-vault).
        - Depending on the type of authentication you chose in [Set up authentication to Azure](#set-up-authentication-to-azure), set either `managed_identity` or `service_principal`.
            - For a managed identity: set `object_id` to the Object ID of the managed identity that you created in [Use a managed identity for authentication](#use-a-managed-identity-for-authentication).
            - For a service principal: set `tenant_id` to your Microsoft Entra ID tenant, `client_id` to the Application (client) ID of the service principal that you created in [Create a service principal](#create-a-service-principal), and `cert_path` to the file path of the base64-encoded P12 certificate on the VM.

    You can add more secret providers (for example, if you want to upload to multiple Data Products) or change the names of the default secret provider.

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
        - Depending on the method of authentication you chose in [Prepare the VMs](#prepare-the-vms), set either `password` or `private_key`.
            - For password authentication, set `secret_name` to the name of the file containing the password in the `secrets_directory` folder. 
            - For SSH key authentication, set `key_secret_name` to the name of the file containing the SSH key in the `secrets_directory` folder. If the private key is protected with a passphrase, set `passphrase_secret_name` to the name of the file containing the passphrase in the `secrets_directory` folder.
            - All secret files should have permissions of `600` (`rw-------`), and an owner of `az-aoi-ingestion` so only the ingestion agent and privileged users can read them.
            ```
            sudo chmod 600 <secrets_directory>/*
            sudo chown az-aoi-ingestion <secrets_directory>/*
            ```
        
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
        - In the `sas_token` section, set the `secret_provider` to the appropriate `key_vault` secret provider for the Data Product, or use the default `data_product_keyvault` if you used the default name earlier. Leave `secret_name` unchanged.
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

## [Optional] Configure log collection for access through Azure Monitor

If you're running the ingestion agent on an Azure VM or on an on-premises VM connected by Azure Arc, you can send ingestion agent logs to Azure Monitor using the Azure Monitor Agent. Using Azure Monitor to access logs can be simpler than accessing logs directly on the VM.

To collect ingestion agent logs, follow [the Azure Monitor documentation to install the Azure Monitor Agent and configure log collection](../azure-monitor/agents/data-collection-text-log.md).

- These docs use the Az PowerShell module to create a logs table. Follow the [Az PowerShell module install documentation](/powershell/azure/install-azure-powershell) first.
    - The `YourOptionalColumn` section from the sample `$tableParams` JSON is unnecessary for the ingestion agent, and can be removed.
- When adding a data source to your data collection rule, add a `Custom Text Logs` source type, with file pattern `/var/log/az-aoi-ingestion/stdout.log`.
- We also recommend following [the documentation to add a `Linux Syslog` Data source](../azure-monitor/agents/data-collection-syslog.md) to your data collection rule, to allow for auditing of all processes running on the VM.
- After adding the data collection rule, you can query the ingestion agent logs through the Log Analytics workspace. Use the following query to make them easier to work with:
  ```
  <CustomTableName>
  | extend RawData = replace_regex(RawData, '\\x1b\\[\\d{1,4}m', '')  // Remove any color tags
  | parse RawData with TimeGenerated: datetime '  ' Level ' ' Message  // Parse the log lines into the TimeGenerated, Level and Message columns for easy filtering
  | order by TimeGenerated desc
  ```
  > [!NOTE]
  > This query can't be used as a data source transform, because `replace_regex` isn't available in data source transforms.

### Sample logs
```
[2m2024-04-30T17:16:00.000544Z[0m [32m INFO[0m [1msftp_pull[0m[1m{[0m[3mpipeline_id[0m[2m=[0m"test-files"[1m}[0m[2m:[0m[1mexecute_run[0m[1m{[0m[3mstart_time[0m[2m=[0m"2024-04-30 17:16:00.000524 UTC"[1m}[0m[2m:[0m [2maz_ingestion_sftp_pull_source::sftp::source[0m[2m:[0m Starting run with 'last checkpoint' timestamp: None
[2m2024-04-30T17:16:00.000689Z[0m [32m INFO[0m [1msftp_pull[0m[1m{[0m[3mpipeline_id[0m[2m=[0m"test-files"[1m}[0m[2m:[0m[1mexecute_run[0m[1m{[0m[3mstart_time[0m[2m=[0m"2024-04-30 17:16:00.000524 UTC"[1m}[0m[2m:[0m [2maz_ingestion_sftp_pull_source::sftp::source[0m[2m:[0m Starting Completion Handler task
[2m2024-04-30T17:16:00.073495Z[0m [32m INFO[0m [1msftp_pull[0m[1m{[0m[3mpipeline_id[0m[2m=[0m"test-files"[1m}[0m[2m:[0m[1mexecute_run[0m[1m{[0m[3mstart_time[0m[2m=[0m"2024-04-30 17:16:00.000524 UTC"[1m}[0m[2m:[0m [2maz_ingestion_sftp_pull_source::sftp::sftp_file_tree_explorer[0m[2m:[0m Start traversing files with base path "/"
[2m2024-04-30T17:16:00.086427Z[0m [32m INFO[0m [1msftp_pull[0m[1m{[0m[3mpipeline_id[0m[2m=[0m"test-files"[1m}[0m[2m:[0m[1mexecute_run[0m[1m{[0m[3mstart_time[0m[2m=[0m"2024-04-30 17:16:00.000524 UTC"[1m}[0m[2m:[0m [2maz_ingestion_sftp_pull_source::sftp::sftp_file_tree_explorer[0m[2m:[0m Finished traversing files
[2m2024-04-30T17:16:00.086698Z[0m [32m INFO[0m [1msftp_pull[0m[1m{[0m[3mpipeline_id[0m[2m=[0m"test-files"[1m}[0m[2m:[0m[1mexecute_run[0m[1m{[0m[3mstart_time[0m[2m=[0m"2024-04-30 17:16:00.000524 UTC"[1m}[0m[2m:[0m [2maz_ingestion_sftp_pull_source::sftp::source[0m[2m:[0m File explorer task is complete, with result Ok(())
[2m2024-04-30T17:16:00.086874Z[0m [32m INFO[0m [1msftp_pull[0m[1m{[0m[3mpipeline_id[0m[2m=[0m"test-files"[1m}[0m[2m:[0m[1mexecute_run[0m[1m{[0m[3mstart_time[0m[2m=[0m"2024-04-30 17:16:00.000524 UTC"[1m}[0m[2m:[0m [2maz_ingestion_sftp_pull_source::sftp::source[0m[2m:[0m Send files to sink task is complete
[2m2024-04-30T17:16:00.087041Z[0m [32m INFO[0m [1msftp_pull[0m[1m{[0m[3mpipeline_id[0m[2m=[0m"test-files"[1m}[0m[2m:[0m[1mexecute_run[0m[1m{[0m[3mstart_time[0m[2m=[0m"2024-04-30 17:16:00.000524 UTC"[1m}[0m[2m:[0m [2maz_ingestion_sftp_pull_source::sftp::source[0m[2m:[0m Processed all completion notifications for run
[2m2024-04-30T17:16:00.087221Z[0m [32m INFO[0m [1msftp_pull[0m[1m{[0m[3mpipeline_id[0m[2m=[0m"test-files"[1m}[0m[2m:[0m[1mexecute_run[0m[1m{[0m[3mstart_time[0m[2m=[0m"2024-04-30 17:16:00.000524 UTC"[1m}[0m[2m:[0m [2maz_ingestion_sftp_pull_source::sftp::source[0m[2m:[0m Run complete with no retryable errors - updating last checkpoint timestamp
[2m2024-04-30T17:16:00.087351Z[0m [32m INFO[0m [1msftp_pull[0m[1m{[0m[3mpipeline_id[0m[2m=[0m"test-files"[1m}[0m[2m:[0m[1mexecute_run[0m[1m{[0m[3mstart_time[0m[2m=[0m"2024-04-30 17:16:00.000524 UTC"[1m}[0m[2m:[0m [2maz_ingestion_sftp_pull_source::sftp::source[0m[2m:[0m Run lasted 0 minutes and 0 seconds with result: RunStats { successful_uploads: 0, retryable_errors: 0, non_retryable_errors: 0, blob_already_exists: 0 }
[2m2024-04-30T17:16:00.087421Z[0m [32m INFO[0m [1msftp_pull[0m[1m{[0m[3mpipeline_id[0m[2m=[0m"test-files"[1m}[0m[2m:[0m[1mexecute_run[0m[1m{[0m[3mstart_time[0m[2m=[0m"2024-04-30 17:16:00.000524 UTC"[1m}[0m[2m:[0m [2maz_ingestion_sftp_pull_source::sftp::file[0m[2m:[0m Closing 1 active SFTP connections
[2m2024-04-30T17:16:00.087966Z[0m [32m INFO[0m [1msftp_pull[0m[1m{[0m[3mpipeline_id[0m[2m=[0m"test-files"[1m}[0m[2m:[0m[1mexecute_run[0m[1m{[0m[3mstart_time[0m[2m=[0m"2024-04-30 17:16:00.000524 UTC"[1m}[0m[2m:[0m [2maz_ingestion_common::scheduler[0m[2m:[0m Run completed successfully. Update the 'last checkpoint' time to 2024-04-30T17:15:30.000543200Z
[2m2024-04-30T17:16:00.088122Z[0m [32m INFO[0m [1msftp_pull[0m[1m{[0m[3mpipeline_id[0m[2m=[0m"test-files"[1m}[0m[2m:[0m [2maz_ingestion_common::scheduler[0m[2m:[0m Schedule next run at 2024-04-30T17:17:00Z
```

## Related content

Learn how to:

- [View data in dashboards](dashboards-use.md).
- [Query data](data-query.md).
- [Monitor and troubleshoot ingestion agents](monitor-troubleshoot-ingestion-agent.md).
- [Change configuration for ingestion agents](change-ingestion-agent-configuration.md).
- [Upgrade ingestion agents](upgrade-ingestion-agent.md).
- [Rotate secrets for ingestion agents](rotate-secrets-for-ingestion-agent.md).
