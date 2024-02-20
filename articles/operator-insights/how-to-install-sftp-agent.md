---
title: Create and configure SFTP Ingestion Agents for Azure Operator Insights
description: Learn how to create and configure SFTP Ingestion Agents for Azure Operator Insights 
author: rcdun
ms.author: rdunstan
ms.reviewer: rathishr
ms.service: operator-insights
ms.topic: how-to #Required; leave this attribute/value as-is
ms.date: 12/06/2023
---

# Create and configure SFTP Ingestion Agents for Azure Operator Insights

An SFTP Ingestion Agent is a software package that is installed onto a Linux Virtual Machine (VM) owned and managed by you. The agent pulls files from an SFTP server, and forwards them to Azure Operator Insights Data Products.

For more background, see [SFTP Ingestion Agent overview](sftp-agent-overview.md).

## Prerequisites

- You must deploy an Azure Operator Insights Data Product.
- You must have an SFTP server containing the files to be uploaded to the Azure Operator Insights Data Product. This SFTP server must be accessible from the VM where you install the agent.
- You must choose the number of agents and VMs on which to install the agents, using the guidance in the following section.

### Choosing agents and VMs

An agent collects files from _file sources_ that you configure on it. File sources include the details of the SFTP server, the files to collect from it and how to manage those files.

You must choose how to set up your agents, file sources and VMs using the following rules:
- File sources must not overlap, meaning that they must not collect the same files from the same servers.
- You must configure each file source on exactly one agent. If you configure a file source on multiple agents, Azure Operator Insights receives duplicate data.
- Each agent can have multiple file sources.
- Each agent must run on a separate VM.
- The number of agents and therefore VMs also depends on:
    - The scale and redundancy characteristics of your deployment.
    - The number and size of the files, and how frequently the files are copied.

As a guide, this table documents the throughput that the recommended specification on a standard D4s_v3 Azure VM can achieve.

| File count | File size (KiB) | Time (seconds) | Throughput (Mbps) |
|------------|-----------------|----------------|-------------------|
| 64         | 16,384          | 6              | 1,350             |
| 1,024      | 1,024           | 10             | 910               |
| 16,384     | 64              | 80             | 100               |
| 65,536     | 16              | 300            | 25                |

For example, if you need to collect from two file sources, you could:

- Deploy one VM with one agent that collects from both file sources.
- Deploy two VMs, each with one agent. Each agent (and therefore each VM) collects from one file source.

Each VM running the agent must meet the following specifications.

| Resource | Requirements                                                        |
|----------|---------------------------------------------------------------------|
| OS       | Red Hat Enterprise Linux 8.6 or later, or Oracle Linux 8.8 or later |
| vCPUs    | Minimum 4, recommended 8                                            |
| Memory   | Minimum 32 GB                                                       |
| Disk     | 30 GB                                                               |
| Network  | Connectivity to the SFTP server and to Azure                        |
| Software | systemd, logrotate and zip installed                                |
| Other    | SSH or alternative access to run shell commands                     |
| DNS      | (Preferable) Ability to resolve public DNS. If not, you need to perform extra steps to resolve Azure locations. See [VMs without public DNS: Map Azure host names to IP addresses.](#vms-without-public-dns-map-azure-host-names-to-ip-addresses). |

### VM security recommendations

The VM used for the SFTP agent should be set up following best practice for security. For example:

- Networking - Only allow network traffic on the ports that are required to run the agent and maintain the VM.
- OS version - Keep the OS version up-to-date to avoid known vulnerabilities.
- Access - Limit access to the VM to a minimal set of users, and set up audit logging for their actions. For the SFTP agent, we recommend that the following are restricted:
  - Admin access to the VM (for example, to stop/start/install the SFTP agent software)
  - Access to the directory where the logs are stored *(/var/log/az-sftp-uploader/)*
  - Access to the certificate and private key for the service principal that you create during this procedure
  - Access to the directory for secrets that you create on the VM during this procedure.
  
## Download the RPM for the agent

Download the RPM for the SFTP agent using the details you received as part of the [Azure Operator Insights onboarding process](overview.md#how-do-i-get-access-to-azure-operator-insights) or from [https://go.microsoft.com/fwlink/?linkid=2254734](https://go.microsoft.com/fwlink/?linkid=2254734).

## Set up authentication to Azure

You must have a service principal with a certificate credential that can access the Azure Key Vault created by the Data Product to retrieve storage credentials. Each agent must also have a copy of a valid certificate and private key for the service principal stored on this virtual machine.

### Create a service principal

> [!IMPORTANT]
> You might need a Microsoft Entra tenant administrator in your organization to perform this setup for you.

1. Create or obtain a Microsoft Entra ID service principal. Follow the instructions detailed in [Create a Microsoft Entra app and service principal in the portal](/entra/identity-platform/howto-create-service-principal-portal). Leave the **Redirect URI** field empty.
1. Note the Application (client) ID, and your Microsoft Entra Directory (tenant) ID (these IDs are UUIDs of the form xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, where each character is a hexadecimal digit).

### Prepare certificates

The ingestion agent only supports certificate-based authentication for service principals. It's up to you whether you use the same certificate and key for each VM, or use a unique certificate and key for each.  Using a certificate per VM provides better security and has a smaller impact if a key is leaked or the certificate expires. However, this method adds a higher maintainability and operational complexity.

1. Obtain a certificate. We strongly recommend using trusted certificate(s) from a certificate authority.
2. Add the certificate(s) as credential(s) to your service principal, following [Create a Microsoft Entra app and service principal in the portal](/entra/identity-platform/howto-create-service-principal-portal).
3. We **strongly recommend** additionally storing the certificates in a secure location such as Azure Key vault.  Doing so allows you to configure expiry alerting and gives you time to regenerate new certificates and apply them to your ingestion agents before they expire.  Once a certificate expires, the agent  is unable to authenticate to Azure and no longer uploads data.  For details of this approach see [Renew your Azure Key Vault certificates Azure portal](../key-vault/certificates/overview-renew-certificate.md).
    - You need the 'Key Vault Certificates Officer' role on the Azure Key Vault in order to add the certificate to the Key Vault. See [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md) for details of how to assign roles in Azure.

4. Ensure the certificate(s) are available in pkcs12 format, with no passphrase protecting them. On Linux, you can convert a certificate and key from PEM format using openssl:

    `openssl pkcs12 -nodes -export -in <pem-certificate-filename> -inkey <pem-key-filename> -out <pkcs12-certificate-filename>`

   > [!IMPORTANT]
   > The pkcs12 file must not be protected with a passphrase. When OpenSSL prompts you for an export password, press <kbd>Enter</kbd> to supply an empty passphrase.

5. Validate your pkcs12 file. This displays information about the pkcs12 file including the certificate and private key:

    `openssl pkcs12 -nodes -in <pkcs12-certificate-filename> -info`

6. Ensure the pkcs12 file is base64 encoded. On Linux, you can base64 encode a pkcs12-formatted certificate by using the command:

    `base64 -w 0 <pkcs12-certificate-filename> > <base64-encoded-pkcs12-certificate-filename>`

### Grant permissions for the Data Product Key Vault

1. Find the Azure Key Vault that holds the storage credentials for the input storage account. This Key Vault is in a resource group named *\<data-product-name\>-HostedResources-\<unique-id\>*.
1. Grant your service principal the 'Key Vault Secrets User' role on this Key Vault.  You need Owner level permissions on your Azure subscription.  See [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md) for details of how to assign roles in Azure.
1. Note the name of the Key Vault.

## Prepare the VMs

Repeat these steps for each VM onto which you want to install the agent:

1. Ensure you have an SSH session open to the VM, and that you have `sudo` permissions.
2. Create a directory to use for storing secrets for the agent. Note the path of this directory. This is the _secrets directory_ and it's the directory where you'll add secrets for connecting to the SFTP server.
3. Verify that the VM has the following ports open:
    - Port 443/TCP outbound to Azure
    - Port 22/TCP outbound to the SFTP server
  
    These ports must be open both in cloud network security groups and in any firewall running on the VM itself (such as firewalld or iptables).
4. Install systemd, logrotate and zip on the VM, if not already present. For example, `sudo dnf install systemd logrotate zip`.
5. Obtain the ingestion agent RPM and copy it to the VM.
6. Copy the pkcs12-formatted base64-encoded certificate (created in the [Prepare certificates](#prepare-certificates) step) to the VM, in a location accessible to the ingestion agent. 
7. Ensure the SFTP server's public SSH key is listed on the VM's global known_hosts file located at `/etc/ssh/ssh_known_hosts`.

> [!TIP]
> Use the Linux command `ssh-keyscan` to add a server's SSH public key to a VM's `known_hosts` file manually. For example, `ssh-keyscan -H <server-ip> | sudo tee -a /etc/ssh/ssh_known_hosts`.

## Configure the connection between the SFTP server and VM

Follow these steps on the SFTP server:

1. Ensure port 22/TCP to the VM is open.
1. Create a new user, or determine an existing user on the SFTP server that the ingestion agent will use to connect to the SFTP server.
1. Determine the authentication method that the ingestion agent will use to connect to the SFTP server. The agent supports two methods:
    - Password authentication
    - SSH key authentication
1. Create a file to store the secret value (password or SSH key) in the secrets directory on the agent VM, which you created in the [Prepare the VMs](#prepare-the-vms) step.
   - The file must not have a file extension.
   - Choose an appropriate name for the secret file, and note it for later.  This name is referenced in the agent configuration.
   - The secret file must contain only the secret value (password or SSH key), with no extra whitespace.
1. If you're using an SSH key that has a passphrase to authenticate, use the same method to create a separate secret file that contains the passphrase.
1. Configure the SFTP server to remove files after a period of time (a _retention period_). Ensure the retention period is long enough that the agent should have processed the files before the SFTP server deletes them. The example configuration file contains configuration for checking for new files every five minutes.

> [!IMPORTANT]
> Your SFTP server must remove files after a suitable retention period so that it does not run out of disk space. The SFTP ingestion agent does not remove files automatically.
>
> A shorter retention time reduces disk usage, increases the speed of the agent and reduces the risk of duplicate uploads. However, a shorter retention period increases the risk that data is lost if data cannot be retrieved by the agent or uploaded to Azure Operator Insights.

## VMs without public DNS: Map Azure host names to IP addresses

**If your agent VMs have access to public DNS, skip this step and continue to [Install and configure agent software](#install-and-configure-agent-software).**

If your agent VMs don't have access to public DNS, then you need to add entries on each agent VM to map the Azure host names to IP addresses.

This process assumes that you're connecting to Azure over ExpressRoute and are using Private Links and/or Service Endpoints. If you're connecting over public IP addressing,  you **cannot** use this workaround and must use public DNS.

1. Create the following resources from a virtual network that is peered to your ingestion agents:
    - A Service Endpoint to Azure Storage
    - A Private Link or Service Endpoint to the Key Vault created by your Data Product.  The Key Vault is the same one you found in [Grant permissions for the Data Product Key Vault](#grant-permissions-for-the-data-product-key-vault).
1. Note the IP addresses of these two connections.
1. Note the ingestion URL for your Data Product.  You can find the ingestion URL on your Data Product overview page in the Azure portal, in the form *\<account name\>.blob.core.windows.net*.
1. Note the URL of the Data Product Key Vault.  The URL appears as *\<vault name\>.vault.azure.net*.
1. Add a line to */etc/hosts* on the VM linking the two values in this format, for each of the storage and Key Vault:
    ```
    <Storage private IP>   <ingestion URL>
    <Key Vault private IP>  <Key Vault URL>
    ````
1. Add the public IP address of the URL *login.microsoftonline.com* to */etc/hosts*. You can use any of the public addresses resolved by DNS clients.
    ```
    <Public IP>   login.microsoftonline.com
    ````

## Install and configure agent software

Repeat these steps for each VM onto which you want to install the agent:

1. In an SSH session, change to the directory where the RPM was copied.
1. Install the RPM:  `sudo dnf install ./*.rpm`.  Answer 'y' when prompted.  If there are any missing dependencies, the RPM won't be installed.
1. Change to the configuration directory: `cd /etc/az-sftp-uploader`
1. Make a copy of the default configuration file:  `sudo cp example_config.yaml config.yaml`
1. Edit the *config.yaml* file and fill out the fields. Start by filling out the parameters that don't depend on the type of Data Product.  Many parameters are set to default values and don't need to be changed.  The full reference for each parameter is described in [SFTP Ingestion Agents configuration reference](sftp-agent-configuration.md). The following parameters must be set:

    1. **site\_id** should be changed to a unique identifier for your on-premises site – for example, the name of the city or state for this site.  This name becomes searchable metadata in Operator Insights for all data ingested by this agent. Reserved URL characters must be percent-encoded.
    1. For the secret provider with name `data_product_keyvault`, set the following fields:
        1. **provider.vault\_name** must be the name of the Key Vault for your Data Product. You identified this name in [Grant permissions for the Data Product Key Vault](#grant-permissions-for-the-data-product-key-vault).  
        1. **provider.auth** must be filled out with:

            1. **tenant\_id** as your Microsoft Entra ID tenant.

            2. **identity\_name** as the application ID of the service principal that you created in [Create a service principal](#create-a-service-principal).

            3. **cert\_path** as the file path of the base64-encoded pcks12 certificate in the secrets directory folder, for the service principal to authenticate with.
    1. For the secret provider with name `local_file_system`, set the following fields:

        1. **provider.auth.secrets_directory** the absolute path to the secrets directory on the agent VM, which was created in the [Prepare the VMs](#prepare-the-vms) step.
    

    1. **file_sources** a list of file source details, which specifies the configured SFTP server and configures which files should be uploaded, where they should be uploaded, and how often. Multiple file sources can be specified but only a single source is required. Must be filled out with the  following values:

        1. **source_id** a unique identifier for the file source. Any URL reserved characters in source_id must be percent-encoded.

        1. **source.sftp** must be filled out with:

            1. **host** the hostname or IP address of the SFTP server.

            1. **base\_path** the path to a folder on the SFTP server that files will be uploaded to Azure Operator Insights from.

            1. **known\_hosts\_file** the path on the VM to the global known_hosts file, located at `/etc/ssh/ssh_known_hosts`. This file should contain the public SSH keys of the SFTP host server as outlined in [Prepare the VMs](#prepare-the-vms). 

            1. **user** the name of the user on the SFTP server that the agent should use to connect.

            1. **auth** must be filled according to the authentication method that you chose in [Configure the connection between the SFTP server and VM](#configure-the-connection-between-the-sftp-server-and-vm). The required fields depend on which authentication type is specified:

                - Password:

                    1. **type** set to `password`

                    1. **secret\_name** is the name of the file containing the password in the `secrets_directory` folder.

                - SSH key:

                    1. **type** set to `ssh_key`

                    1. **key\_secret** is the name of the file containing the SSH key in the `secrets_directory` folder.

                    1. **passphrase\_secret\_name** is the name of the file containing the passphrase for the SSH key in the `secrets_directory` folder. If the SSH key doesn't have a passphrase, don't include this field.

   
2. Continue to edit *config.yaml* to set the parameters that depend on the type of Data Product that you're using.
For the **Monitoring - Affirmed MCC** Data Product, set the following parameters in each file source block in **file_sources**:

    1. **source.settling_time_secs** set to `60`
    2. **source.schedule** set to  `0 */5 * * * * *` so that the agent checks for new files in the file source every 5 minutes
    3. **sink.container\_name** set to `pmstats`

> [!TIP]
> The agent supports additional optional configuration for the following:
> - Specifying a pattern of files in the `base_path` folder which will be uploaded (by default all files in the folder are uploaded)
> - Specifying a pattern of files in the `base_path` folder which should not be uploaded
> - A time and date before which files in the `base_path` folder will not be uploaded
> - How often the SFTP agent uploads files (the value provided in the example configuration file corresponds to every hour)
> - A settling time, which is a time period after a file is last modified that the agent will wait before it is uploaded (the value provided in the example configuration file is 5 minutes)
>
> For more information about these configuration options, see [SFTP Ingestion Agents configuration reference](sftp-agent-configuration.md).

## Start the agent software

1. Start the agent: `sudo systemctl start az-sftp-uploader`

2. Check that the agent is running: `sudo systemctl status az-sftp-uploader`

    1. If you see any status other than `active (running)`, look at the logs as described in [Monitor and troubleshoot SFTP Ingestion Agents for Azure Operator Insights](troubleshoot-sftp-agent.md) to understand the error.  It's likely that some configuration is incorrect.

    2. Once you resolve the issue,  attempt to start the agent again.

    3. If issues persist, raise a support ticket.

3. Once the agent is running, ensure it starts automatically after reboots: `sudo systemctl enable az-sftp-uploader.service`

4. Save a copy of the delivered RPM – you need it to reinstall or to back out any future upgrades.

## Related content

[Manage SFTP Ingestion Agents for Azure Operator Insights](how-to-manage-sftp-agent.md)

[Monitor and troubleshoot SFTP Ingestion Agents for Azure Operator Insights](troubleshoot-sftp-agent.md)
