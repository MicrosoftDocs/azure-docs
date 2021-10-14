---
title: Configuring the automation framework for new and existing deployments
description: How to configure the SAP deployment automation framework for both new and existing scenarios.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Configuring for new and existing deployments

You can use the [SAP Deployment Automation Framework](automation-deployment-framework.md) in both new and existing deployment scenarios. 

In new deployment scenarios, the automation framework doesn't use existing Azure infrastructure. The deployment process creates the virtual networks, subnets, key vaults, and more.

In existing deployment scenarios, the automation framework uses existing Azure infrastructure. For example, the deployment uses existing virtual networks.
## New example scenarios

The following are examples of new deployment scenarios that create new resources.

> [!IMPORTANT]
> Modify all example configurations as necessary for your scenario.
### New scenario with deployer

In this scenario, the automation framework creates all Azure components, and uses the [deployer](automation-deployment-framework.md#deployment-components). This example deployment contains:

- Two environments the West Europe Azure region
  - Management (`MGMT`)
  - Development (`DEV`)
- A deployer
- SAP Library
- SAP system (`SID X00`) with:
  - Two application servers
  - A highly available (HA) central services instance
  - A web dispatcher with a single node HANA backend using SUSE 12 SP5

To test this scenario: 

1. Clone the [SAP Deployment Automation Framework](https://github.com/Azure/sap-hana/) repository. 
1. Copy the sample files to your root folder for parameter files as follows:

    ```azurecli
    cd ~/Azure_SAP_Automated_Deployment
    mkdir -p WORKSPACES/DEPLOYER
    cp sap-hana/deploy/samples/WORKSPACES/DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE WORKSPACES/DEPLOYER/. -r
    
    mkdir -p WORKSPACES/LIBRARY
    cp sap-hana/deploy/samples/WORKSPACES/LIBRARY/MGMT-WEEU-SAP_LIBRARY WORKSPACES/LIBRARY/. -r
    
    mkdir -p WORKSPACES/LANDSCAPE
    cp sap-hana/deploy/samples/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE WORKSPACES/LANDSCAPE/. -r
    
    mkdir -p WORKSPACES/SYSTEM
    cp sap-hana/deploy/samples/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X00 WORKSPACES/SYSTEM/. -r
    cd WORKSPACES
    ```
    
1. Prepare the region by installing the deployer and library. Run either the Bash or PowerShell command. Be sure to replace the sample values with your service principal's information.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES

    $DEPLOYMENT_REPO_PATH/scripts/prepare_region.sh
    --deployer_parameter_file DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE/MGMT-WEEU-DEP00-INFRASTRUCTURE.json \
    --library_parameter_file LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.json
    --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
    --spn_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy \
    --spn_secret ************************ \
    --tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz \
    --auto-approve
    ```

    ```powershell
    New-SAPAutomationRegion 
        -DeployerParameterfile .\DEPLOYER\MGMT-EUS2-DEP01-INFRASTRUCTURE\MGMT-EUS2-DEP01-INFRASTRUCTURE.json 
        -LibraryParameterfile .\LIBRARY\MGMT-EUS2-SAP_LIBRARY\MGMT-EUS2-SAP_LIBRARY.json 
        -Subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 
        -SPN_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy 
        -SPN_password  ************************ 
        -Tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz 
        -Silent             
    ```

1. Deploy the SAP system. Run either the Bash or PowerShell command.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X00

    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/installer.sh --parameterfile DEV-WEEU-SAP01-X00.json --type sap_system --auto-approve
    ```

    ```powershell
    cd \Azure_SAP_Automated_Deployment\WORKSPACES\SYSTEM\DEV-WEEU-SAP01-X00

    New-SAPSystem --parameterfile .\DEV-WEEU-SAP01-X00.json 
        -Type sap_system
    ```

### New scenario without deployer

In this scenario, the automation framework creates all Azure components, but doesn't use the [deployer](automation-deployment-framework.md#deployment-components). This example deployment contains:

- Two environments in the North Europe Azure region
  - Management (`MGMT`)
  - Development (`DEV`)
- SAP Library
- SAP system (`SID X00`) with:
  - Two application servers
  - A highly available (HA) central services instance
  - A web dispatcher with a single node HANA backend using Red Hat 7.7

To test this scenario:

1. Clone the [SAP Deployment Automation Framework](https://github.com/Azure/sap-hana/) repository. 
1. Copy the sample files to your root folder for parameter files as follows:

    ```bash
    cd ~/Azure_SAP_Automated_Deployment
    
    mkdir -p WORKSPACES/LIBRARY
    cp sap-hana/deploy/samples/WORKSPACES/LIBRARY/MGMT-NOEU-SAP_LIBRARY WORKSPACES/LIBRARY/. -r
    
    mkdir -p WORKSPACES/LANDSCAPE
    cp sap-hana/deploy/samples/WORKSPACES/LANDSCAPE/DEV-NOEU-SAP02-INFRASTRUCTURE WORKSPACES/LANDSCAPE/. -r
    
    mkdir -p WORKSPACES/SYSTEM
    cp sap-hana/deploy/samples/WORKSPACES/SYSTEM/DEV-NOEU-SAP02-X02 WORKSPACES/SYSTEM/. -r
    cd WORKSPACES
    ```

1. Open the parameter file in an editor.
1. Edit the parameter `kv_spn_id`, which defines the Service Principal Name (SPN) identifier. Replace the sample values with your service principal's information.

    ```json
    {
    	"key_vault": {
    		"kv_spn_id": "ARM-identifier"
    	}
    }
    ```

1. Edit the parameter `deployer`, which sets whether you're using a deployer. Set the value of `use` to `false`, so the automation framework doesn't use any information from the deployer state file.

    ```json
    {
    	"deployer": {
    		"use": false
    	}
    }
    ```

1. Save your changes to the parameter file.
1. Open the SAP Library folder for the management environment as follows.

    ```bash
     cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LIBRARY/MGMT-NOEU-SAP_LIBRARY
    ```

1. Add the resource identifier for the key vault that contains your Service Principal details. Run either the Bash or PowerShell command. Note the value of `remote_state_storage_account_name` in the output.

    ```bash
    $DEPLOYMENT_REPO_PATH/deploy/scripts/install_library.sh --parameterfile MGMT-NOEU-SAP_LIBRARY.json 
    ```

    ```powershell
    New-SAPLibrary --parameterfile .\MGMT-NOEU-SAP_LIBRARY.json 
    ```

1. Migrate the Terraform state file to Azure. Run either the Bash or PowerShell command. Provide the value of `remote_state_storage_account_name` as needed.

    ```bash
    $DEPLOYMENT_REPO_PATH/deploy/scripts/installer.sh --parameterfile MGMT-NOEU-SAP_LIBRARY.json --type sap_library
    ```

    ```powershell
    New-SAPSystem --parameterfile .\MGMT-WUS2-SAP_LIBRARY.json -Type sap_library -StorageAccountName mgmtwus2tfstate###   
    ```

1. Open the landscape folder for the management environment as follows.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/DEV-NOEU-SAP02-INFRASTRUCTURE
    ```

1. Add the resource identifier for the key vault that contains your Service Principal details. Run either the Bash or PowerShell command.

    ```bash
    $DEPLOYMENT_REPO_PATH/deploy/scripts/install_workloadzone.sh --parameterfile DEV-NOEU-SAP02-INFRASTRUCTURE.json \
    --state_subscription wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww \
    --storageaccountname mgmtweeutfstate### \
    --vault MGMTWEEUDEP00user### \
    --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
    --spn_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy \
    --spn_secret ************************ \
    --tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz 
    ```

    ```powershell
    New-SAPWorkloadZone --parameterfile .\DEV-NOEU-SAP02-INFRASTRUCTURE.json 
      -State_subscription wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww 
      -Vault MGMTWEEUDEP00user###
      -StorageAccountName mgmtweeutfstate 
      -Subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 
      -SPN_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy 
      -SPN_password ************************ 
      -Tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz 
    ```

1. Open the SAP system folder as follows.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/DEV-NOEU-SAP02-X02
    ```

1. Install the SAP system. Run either the Bash or PowerShell command.

    ```bash
     ${DEPLOYMENT_REPO_PATH}/deploy/scripts/installer.sh --parameterfile DEV-NOEU-SAP02-X02.json --type sap_system --auto-approve
    ```

    ```powershell
    New-SAPSystem --parameterfile .\DEV-NOEU-SAP02-X02.json 
            -Type sap_system
    ```

## Existing example scenarios

The following are example existing scenarios that use existing Azure resources.

> [!IMPORTANT]
> Modify all example configurations as necessary for your scenario.

### existing scenario with deployer

In this scenario, the automation framework uses existing Azure components, and uses the [deployer](automation-deployment-framework.md#deployment-components). These existing components include resource groups, storage accounts, virtual networks, subnets, and network security groups. This example deployment contains:

- Two environments in the East US 2 region
  - Management (`MGMT`)
  - Quality assurance (QA, `QA`)
- A deployer
- The SAP Library
- An SAP system (`SID X01`) with:
  - Two application servers
  - An HA central services instance
  - A web dispatcher using a Microsoft SQL server backend running Windows Server 2016

1. Clone the [SAP Deployment Automation Framework](https://github.com/Azure/sap-hana/) repository. 
1. Copy the sample files to your root folder for parameter files as follows:

    ```bash
    cd ~/Azure_SAP_Automated_Deployment
    mkdir -p WORKSPACES/DEPLOYER
    cp sap-hana/deploy/samples/WORKSPACES/DEPLOYER/MGMT-EUS2-DEP01-INFRASTRUCTURE WORKSPACES/DEPLOYER/. -r
    
    mkdir -p WORKSPACES/LIBRARY
    cp sap-hana/deploy/samples/WORKSPACES/LIBRARY/MGMT-EUS2-SAP_LIBRARY WORKSPACES/LIBRARY/. -r
    
    mkdir -p WORKSPACES/LANDSCAPE
    cp sap-hana/deploy/samples/WORKSPACES/LANDSCAPE/QA-EUS2-SAP03-INFRASTRUCTURE WORKSPACES/LANDSCAPE/. -r
    
    mkdir -p WORKSPACES/SYSTEM
    cp sap-hana/deploy/samples/WORKSPACES/SYSTEM/QA-EUS2-SAP03-X01 WORKSPACES/SYSTEM/. -r
    cd WORKSPACES
    ```

1. Open the workspaces folder as follows.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES
    ```

1. Prepare the region by installing the deployer and SAP Library. Run either the Bash or PowerShell command. Be sure to replace the sample credentials with your service principal's information.

    ```bash
     $DEPLOYMENT_REPO_PATH/scripts/prepare_region.sh
      --deployer_parameter_file DEPLOYER/MGMT-EUS2-DEP01-INFRASTRUCTURE/MGMT-EUS2-DEP01-INFRASTRUCTURE.json \
      --library_parameter_file LIBRARY/MGMT-EUS2-SAP_LIBRARY/MGMT-EUS2-SAP_LIBRARY.json
      --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
      --spn_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy \
      --spn_secret ************************ \
      --tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz \
      --auto-approve
    ```

    ```powershell
    New-SAPAutomationRegion 
        -DeployerParameterfile .\DEPLOYER\MGMT-EUS2-DEP01-INFRASTRUCTURE\MGMT-EUS2-DEP01-INFRASTRUCTURE.json 
        -LibraryParameterfile .\LIBRARY\MGMT-EUS2-SAP_LIBRARY\MGMT-EUS2-SAP_LIBRARY.json 
        -Subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 
        -SPN_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy 
        -SPN_password  ************************ 
        -Tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz 
        -Silent      
    ```

1. Open the workload zone folder for the QA environment as follows.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/QA-EUS2-SAP03-INFRASTRUCTURE
    ```

1. Deploy the workload zone. Run either the Bash or PowerShell script. Be sure to replace the sample credentials with your service principal's information

    ```bash
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/install_workloadzone.sh --parameterfile QA-EUS2-SAP03-INFRASTRUCTURE.json \
    --deployer_environment MGMT
    --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
    --spn_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy \
    --spn_secret ************************ \
    --tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz \
    --auto-approve
    ```

    ```powershell
    New-SAPWorkloadZone --parameterfile .\QA-EUS2-SAP03-INFRASTRUCTURE.json 
      -DeployerEnvironment MGMT
      -Subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 
      -SPN_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy 
      -SPN_password ************************ 
      -Tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz 
    ```

1. Open the SAP system folder for the QA environment as follows.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/QA-EUS2-SAP03-X01
    ```

1. Deploy the SAP system for the QA environment. Run either the Bash or PowerShell command.

    ```bash
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/installer.sh --parameterfile QA-EUS2-SAP03-X01.json --type sap_system --auto-approve
    ```

    ```powershell
    New-SAPSystem --parameterfile .\QA-EUS2-SAP03-X01.json 
            -Type sap_system
    ```

### Existing scenario without deployer

In this scenario, the automation framework uses existing Azure components, but doesn't use the [deployer](automation-deployment-framework.md#deployment-components). This example deployment contains:

- Two environments in the West US 2 region
  - Management (`MGMT`)
  - Production (`PROD`)
- The SAP Library
- A workload
- An SAP system (`SID X03`) with:
  - Two application servers
  - An HA central services instance
  - A web dispatcher using a single node HANA backend running SUSE 12 SP5
- A second SAP system (`SID X04`) with:
  - Two application servers
  - An HA central services instance
  - A web dispatcher using a single node HANA backend running SUSE 12 SP5 that uses a custom disk configuration

1. Clone the [SAP Deployment Automation Framework](https://github.com/Azure/sap-hana/) repository. 
1. Open your parameter file.
1. Edit the parameter `kv_spn_id` to define which Service Principal you're using to deploy the workload zone. Be sure to replace the sample value with your SPN identifier.

    ```json
    {
    	"key_vault": {
    		"kv_spn_id": "ARM-Resource-Identifier"
    	}
    }
    ```

1. Edit the parameter `deployer`, which defines whether you're using a deployer. Set the value of `use` to `false`, so the automation framework doesn't use any information from the deployer state file.

    ```json
    {
    	"deployer": {
    		"use": false
    	}
    }
    ```

1. Save your changes.
1. Open the SAP Library folder as follows.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LIBRARY/MGMT-WUS2-SAP_LIBRARY
    ```

1. Deploy the library. Run either the Bash or PowerShell command. Note the value of `remote_state_storage_account_name` in the output.

    ```bash
    $DEPLOYMENT_REPO_PATH/deploy/scripts/install_library.sh --parameterfile MGMT-WUS2-SAP_LIBRARY.json 
    ```
    
    ```powershell
    New-SAPLibrary --parameterfile .\MGMT-WUS2-SAP_LIBRARY.json 
    ```

1. Migrate the Terraform state file to Azure. Run either the Bash or PowerShell command. Use the value of `remote_state_storage_account_name` as needed.

    ```bash
    $DEPLOYMENT_REPO_PATH/deploy/scripts/installer.sh --parameterfile MGMT-WUS2-SAP_LIBRARY.json --type sap_library
    ```

    ```powershell
    New-SAPSystem --parameterfile .\MGMT-WUS2-SAP_LIBRARY.json -Type sap_library -StorageAccountName mgmtwus2tfstate###   
    ```

1. Open the folder for the production workload zone as follows.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/PROD-WUS2-SAP04-INFRASTRUCTURE
    ```

1. Deploy the workload zone for the production environment. Run either the Bash or PowerShell command. Be sure to replace the sample values with the information for your key vault that contains the Service Principal credentials.

    ```bash
    $DEPLOYMENT_REPO_PATH/deploy/scripts/install_workloadzone.sh --parameterfile PROD-WUS2-SAP04-INFRASTRUCTURE.json \
         --state_subscription wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww \
         --storageaccountname mgmteus2tfstate### \
         --vault MGMTEUS2DEP02user### \
         --subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx \
         --spn_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy \
         --spn_secret ************************ \
         --tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz 
    ```

    ```powershell
    New-SAPWorkloadZone --parameterfile .\PROD-WUS2-SAP04-INFRASTRUCTURE.json 
            -State_subscription wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww 
            -Vault MGMTEUS2DEP02user### \
            -StorageAccountName mgmteus2tfstate 
            -Subscription xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx 
            -SPN_id yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy 
            -SPN_password ************************ 
            -Tenant_id zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz 
    ```

1. Open the SAP system folder as follows.

    ```bash
    cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/PROD-WUS2-SAP04-X03
    ```

1. Deploy the SAP system. Run either the Bash or PowerShell command.

```bash
 ${DEPLOYMENT_REPO_PATH}/deploy/scripts/installer.sh --parameterfile PROD-WUS2-SAP04-X03.json --type sap_system --auto-approve
```

```powershell
New-SAPSystem --parameterfile .\PROD-WUS2-SAP04-X03.json 
        -Type sap_system
```

1. For an explanation of this deployment's custom disk configuration, see the following section on [custom disk sizing in existing scenarios](#existing-scenario-with-custom-disk-sizing)

### existing scenario with custom disk sizing

This scenario is an extension of the [previous existing scenario that doesn't use a deployer](#existing-scenario-without-deployer).

1. Follow all steps for the [existing scenario without a deployer](#existing-scenario-without-deployer).
1. Open the folder that contains the custom disk sizing configuration file as follows.

```bash
cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/PROD-WUS2-SAP04-X04/X04-Disk_sizes.json
```

1. Open the custom disk sizing configuration file, `PROD-WUS2-SAP04-X04/X04-Disk_sizes.json`, in an editor.
1. Edit the database node `db` for the system. Set the `database.size` attribute to the same disk size as the deployment. For example:

    ```json
    {
    	"db": {
    		"X04": {
    			"databases": {
    				"size": "X04"
    			}
    		}
    	}
    }
    ```

1. Deploy the SAP system using the updated parameter file. Run either the Bash or PowerShell command.

    ```bash
    ${DEPLOYMENT_REPO_PATH}/deploy/scripts/installer.sh --parameterfile PROD-WUS2-SAP04-X04.json --type sap_system --auto-approve
    ```
    
    ```powershell
    New-SAPSystem --parameterfile .\PROD-WUS2-SAP04-X04.json 
            -Type sap_system
    ```

## Next steps

> [!div class="nextstepaction"]
> [About manual deployments with automation framework](automation-manual-deployment.md)
