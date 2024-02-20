1. Change to the configuration directory: `cd /etc/az-mcc-edr-uploader`
1. Make a copy of the default configuration file: `sudo cp example_config.yaml config.yaml`
1. Edit the *config.yaml* and fill out the fields. Most of them are set to default values and don't need to be changed.  The full reference for each parameter is described in [MCC EDR Ingestion Agents configuration reference](mcc-edr-agent-configuration.md). The following parameters must be set:

    1. **site\_id** should be changed to a unique identifier for your on-premises site – for example, the name of the city or state for this site.  This name becomes searchable metadata in Operator Insights for all EDRs from this agent. 
    1. **agent\_id** should be a unique identifier for this agent – for example, the VM hostname.

    1. For the secret provider with name `data_product_keyvault`, set the following fields:
        1. **provider.vault\_name** must be the name of the Key Vault for your Data Product. You identified this name in [Grant permissions for the Data Product Key Vault](#grant-permissions-for-the-data-product-key-vault).  
        1. **provider.auth** must be filled out with:

            1. **tenant\_id** as your Microsoft Entra ID tenant.

            2. **identity\_name** as the application ID of the service principal that you created in [Create a service principal](#create-a-service-principal).

            3. **cert\_path** as the file path of the base64-encoded pkcs12 certificate for the service principal to authenticate with.

    1. **sink.container\_name** *must be left as "edr".*

1. Start the agent: `sudo systemctl start az-mcc-edr-uploader`

1. Check that the agent is running: `sudo systemctl status az-mcc-edr-uploader`

    1. If you see any status other than `active (running)`, look at the logs as described in the [Monitor and troubleshoot MCC EDR Ingestion Agents for Azure Operator Insights](troubleshoot-mcc-edr-agent.md) article to understand the error.  It's likely that some configuration is incorrect.

    2. Once you resolve the issue,  attempt to start the agent again.

    3. If issues persist, raise a support ticket.

1. Once the agent is running, ensure it starts automatically after reboots: `sudo systemctl enable az-mcc-edr-uploader.service`

1. Save a copy of the delivered RPM – you need it to reinstall or to back out any future upgrades.

## Configure Affirmed MCCs

Once the agents are installed and running, configure the MCCs to send EDRs to them.

1. Follow the steps under "Generating SESSION, BEARER, FLOW, and HTTP Transaction EDRs" in the [Affirmed Networks Active Intelligent vProbe System Administration Guide](https://manuals.metaswitch.com/vProbe/latest/vProbe_System_Admin/Content/02%20AI-vProbe%20Configuration/Generating_SESSION__BEARER__FLOW__and_HTTP_Transac.htm) (only available to customers with Affirmed support), making the following changes:

    - Replace the IP addresses of the MSFs in MCC configuration with the IP addresses of the VMs running the ingestion agents.

    - Confirm that the following EDR server parameters are set:

        - port: 36001
        - encoding: protobuf
        - keep-alive: 2 seconds


