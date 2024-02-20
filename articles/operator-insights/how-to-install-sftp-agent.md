1. Change to the configuration directory: `cd /etc/az-aoi-ingestion`
1. Make a copy of the default configuration file: `sudo cp example_config.yaml config.yaml`
1. Edit the *config.yaml* file and fill out the fields. Start by filling out the parameters that don't depend on the type of Data Product. Many parameters are set to default values and don't need to be changed. The full reference for each parameter is described in [Configuration reference for Azure Operator Insights ingestion agent](ingestion-agent-configuration-reference.md). The following parameters must be set:

    1. **agent\_id** should be changed to a unique identifier for your on-premises site – for example, the name of the city or state for this site.  This name becomes searchable metadata in Operator Insights for all data ingested by this agent. Reserved URL characters must be percent-encoded.
    1. For the secret provider with name `data_product_keyvault`, set the following fields:
        1. **provider.vault\_name** must be the name of the Key Vault for your Data Product. You identified this name in [Grant permissions for the Data Product Key Vault](#grant-permissions-for-the-data-product-key-vault).  
        1. **provider.auth** must be filled out with:

            1. **tenant\_id** as your Microsoft Entra ID tenant.

            2. **identity\_name** as the application ID of the service principal that you created in [Create a service principal](#create-a-service-principal).

            3. **cert\_path** as the file path of the base64-encoded pcks12 certificate in the secrets directory folder, for the service principal to authenticate with.
    1. For the secret provider with name `local_file_system`, set the following fields:

        1. **provider.auth.secrets_directory** the absolute path to the secrets directory on the agent VM, which was created in the [Prepare the VMs](#prepare-the-vms) step.
    

    1. **file_sources** a list of file source details, which specifies the configured SFTP server and configures which files should be uploaded, where they should be uploaded, and how often. Multiple file sources can be specified but only a single source is required. Must be filled out with the following values:

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

    1. **source.settling_time** set to `60s`
    2. **source.schedule** set to  `0 */5 * * * * *` so that the agent checks for new files in the file source every 5 minutes
    3. **sink.container\_name** set to `pmstats`

> [!TIP]
> The agent supports additional optional configuration for the following:
> - Specifying a pattern of files in the `base_path` folder which will be uploaded (by default all files in the folder are uploaded)
> - Specifying a pattern of files in the `base_path` folder which should not be uploaded
> - A time and date before which files in the `base_path` folder will not be uploaded
> - How often the ingestion agent uploads files (the value provided in the example configuration file corresponds to every hour)
> - A settling time, which is a time period after a file is last modified that the agent will wait before it is uploaded (the value provided in the example configuration file is 5 minutes)
>
> For more information about these configuration options, see [Configuration reference for Azure Operator Insights ingestion agent](ingestion-agent-configuration-reference.md.

