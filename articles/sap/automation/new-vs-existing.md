---
title: Configure the automation framework for new and existing deployments
description: Learn how to configure SAP Deployment Automation Framework for both new and existing scenarios.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
---

# Configure new and existing deployments

You can use [SAP Deployment Automation Framework](deployment-framework.md) in both new and existing deployment scenarios.

In new deployment scenarios, the automation framework doesn't use existing Azure infrastructure. The deployment process creates the virtual networks, subnets, key vaults, and more.

In existing deployment scenarios, the automation framework uses existing Azure infrastructure. For example, the deployment uses existing virtual networks.

## New deployment scenarios

The following examples show new deployment scenarios that create new resources.

> [!IMPORTANT]
> Modify all example configurations as necessary for your scenario.

### New deployment

In this scenario, the automation framework creates all Azure components and uses the [deployer](deployment-framework.md#deployment-components). This example deployment contains:

- Two environments in the West Europe Azure region:
  - Management (`MGMT`) hosts the control plane.
  - Development (`DEV`) hosts the development environment.
- A deployer
- SAP library
- SAP system (`SID X00`) with:
  - Two application servers.
  - A highly available central services instance.
  - A web dispatcher with a single node HANA back end that uses SUSE 12 SP5.

| Component       | Parameter file location                                                       |
| --------------- | ----------------------------------------------------------------------------- |
| Deployer        | DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE/MGMT-WEEU-DEP00-INFRASTRUCTURE.tfvars |
| Library         | LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.tfvars                    |
| Workload zone   | LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE/DEV-WEEU-SAP01-INFRASTRUCTURE.tfvars  |
| System          | SYSTEM/DEV-WEEU-SAP01-X00/DEV-WEEU-SAP01-X00.tfvars                           |

To test this scenario:

Clone the [SAP Deployment Automation Framework](https://github.com/Azure/sap-automation/) repository and copy the sample files to your root folder for parameter files:

```bash
cd ~/Azure_SAP_Automated_Deployment
mkdir -p WORKSPACES/DEPLOYER
cp sap-automation/samples/WORKSPACES/DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE WORKSPACES/DEPLOYER/. -r

mkdir -p WORKSPACES/LIBRARY
cp sap-automation/samples/WORKSPACES/LIBRARY/MGMT-WEEU-SAP_LIBRARY WORKSPACES/LIBRARY/. -r

mkdir -p WORKSPACES/LANDSCAPE
cp sap-automation/samples/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE WORKSPACES/LANDSCAPE/. -r

mkdir -p WORKSPACES/SYSTEM
cp sap-automation/samples/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X00 WORKSPACES/SYSTEM/. -r
cd WORKSPACES
```

Prepare the control plane by installing the deployer and library. Be sure to replace the sample values with your service principal's information.

```bash
cd ~/Azure_SAP_Automated_Deployment/WORKSPACES

subscriptionID=<subscriptionID>
appId=<appID>
spn_secret=<password>
tenant_id=<tenant>

export DEPLOYMENT_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation/"
export ARM_SUBSCRIPTION_ID="${subscriptionID}"

$DEPLOYMENT_REPO_PATH/scripts/prepare_region.sh
    --deployer_parameter_file DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE/MGMT-WEEU-DEP00-INFRASTRUCTURE.tfvars \
    --library_parameter_file LIBRARY/MGMT-WEEU-SAP_LIBRARY/MGMT-WEEU-SAP_LIBRARY.tfvars                     \
    --subscription $subscriptionID                                                                          \
    --spn_id $appID                                                                                         \
    --spn_secret $spn_secret                                                                                \
    --tenant_id $tenant
    --auto-approve
```

You can also use PowerShell to do the deployment.

```powershell
Import-Module "SAPDeploymentUtilities.psd1"

$Subscription=<subscriptionID>
$SPN_id=<appID>
$SPN_password=<password>
$Tenant_id=<tenant>

New-SAPAutomationRegion -DeployerParameterfile .\DEPLOYER\MGMT-WEEU-DEP01-INFRASTRUCTURE\MGMT-WEEU-DEP01-INFRASTRUCTURE.tfvars 
-LibraryParameterfile .\LIBRARY\MGMT-WEEU-SAP_LIBRARY\MGMT-WEEU-SAP_LIBRARY.tfvars
-Subscription $Subscription
-SPN_id $SPN_id
-SPN_password $SPN_password
-Tenant_id $Tenant_id
```

Deploy the workload zone by running either the Bash or PowerShell script.

Be sure to replace the sample credentials with your service principal's information. You can use the same service principal credentials that you used in the control plane deployment. For production deployments, we recommend using different service principals per workload zone.

```bash

subscriptionID=<subscriptionID>
appId=<appID>
spn_secret=<password>
tenant_id=<tenant>

cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/DEV-WEEU-SAP01-INFRASTRUCTURE

${DEPLOYMENT_REPO_PATH}/deploy/scripts/install_workloadzone.sh \
    --parameterfile DEV-WEEU-SAP01-INFRASTRUCTURE.tfvars       \
    --deployer_environment 'MGMT'                              \           
    --subscription $subscriptionID                             \
    --spn_id $appID                                            \
    --spn_secret $spn_secret                                   \
    --tenant_id $tenant                                        \
    --auto-approve
```

```powershell

cd \Azure_SAP_Automated_Deployment\WORKSPACES\LANDSCAPE\DEV-WEEU-SAP01-INFRASTRUCTURE

$subscription="<subscriptionID>"
$appId="<appID>"
$spn_secret="<password>"
$tenant_id="<tenant>"

New-SAPWorkloadZone --parameterfile .\DEV-WEEU-SAP01-INFRASTRUCTURE.tfvars 
    -DeployerEnvironment MGMT
    -Subscription $subscription
    -SPN_id $appId
    -SPN_password $spn_secret
    -Tenant_id $tenant_id
```

Deploy the SAP system. Run either the Bash or PowerShell command.

```bash
cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/DEV-WEEU-SAP01-X00

${DEPLOYMENT_REPO_PATH}/deploy/scripts/installer.sh --parameterfile DEV-WEEU-SAP01-X00.tfvars --type sap_system --auto-approve
```

```powershell
Import-Module "SAPDeploymentUtilities.psd1"
cd \Azure_SAP_Automated_Deployment\WORKSPACES\SYSTEM\DEV-WEEU-SAP01-X00

New-SAPSystem --parameterfile .\DEV-WEEU-SAP01-X00.tfvars
        -Type sap_system
```

## Existing example scenarios

The following examples show existing scenarios that use existing Azure resources.

> [!IMPORTANT]
> Modify all example configurations as necessary for your scenario.
> Update all the `<arm_resource_id>` placeholders.

### Existing environment scenario

In this scenario, the automation framework uses existing Azure components and uses the [deployer](deployment-framework.md#deployment-components). These existing components include resource groups, storage accounts, virtual networks, subnets, and network security groups. This example deployment contains:

- Two environments in the East US 2 region
  - Management (`MGMT`) hosts the control plane.
  - Quality assurance (`QA`) hosts the SAP QA environment.
- A deployer
- The SAP library
- An SAP system (`SID X01`) with:
  - Two application servers.
  - An HA central services instance.
  - A database that uses a Microsoft SQL server back-end running Windows Server 2016.
  - A web dispatcher.

| Component       | Parameter file location                                                       |
| --------------- | ----------------------------------------------------------------------------- |
| Deployer        | DEPLOYER/MGMT-EUS2-DEP01-INFRASTRUCTURE/MGMT-EUS2-DEP01-INFRASTRUCTURE.tfvars |
| Library         | LIBRARY/MGMT-EUS2-SAP_LIBRARY/MGMT-EUS2-SAP_LIBRARY.tfvars                    |
| Workload zone   | LANDSCAPE/QA-EUS2-SAP03-INFRASTRUCTURE/QA-EUS2-SAP03-INFRASTRUCTURE.tfvars    |
| System          | SYSTEM/QA-EUS2-SAP03-X01/QA-EUS2-SAP03-X01.tfvars                             |

Copy the sample files to your root folder for parameter files:

```bash
cd ~/Azure_SAP_Automated_Deployment
mkdir -p WORKSPACES/DEPLOYER
cp sap-automation/samples/WORKSPACES/DEPLOYER/MGMT-EUS2-DEP01-INFRASTRUCTURE WORKSPACES/DEPLOYER/. -r
    
mkdir -p WORKSPACES/LIBRARY
cp sap-automation/samples/WORKSPACES/LIBRARY/MGMT-EUS2-SAP_LIBRARY WORKSPACES/LIBRARY/. -r
    
mkdir -p WORKSPACES/LANDSCAPE
cp sap-automation/samples/WORKSPACES/LANDSCAPE/QA-EUS2-SAP03-INFRASTRUCTURE WORKSPACES/LANDSCAPE/. -r
    
mkdir -p WORKSPACES/SYSTEM
cp sap-automation/samples/WORKSPACES/SYSTEM/QA-EUS2-SAP03-X01 WORKSPACES/SYSTEM/. -r
cd WORKSPACES
```

The sample `tfvars` file has `<azure_resource_id>` placeholders. You need to replace them with the actual Azure resource IDs for resource groups, virtual networks, and subnets.

Deploy the control plane by installing the deployer and SAP library. Run either the Bash or PowerShell command. Be sure to replace the sample credentials with your service principal's information.

```bash
cd ~/Azure_SAP_Automated_Deployment/WORKSPACES

subscriptionID=<subscriptionID>
appId=<appID>
spn_secret=<password>
tenant_id=<tenant>

export DEPLOYMENT_REPO_PATH="${HOME}/Azure_SAP_Automated_Deployment/sap-automation/"
export ARM_SUBSCRIPTION_ID="${subscriptionID}"

$DEPLOYMENT_REPO_PATH/scripts/prepare_region.sh
    --deployer_parameter_file DEPLOYER/MGMT-EUS2-DEP01-INFRASTRUCTURE/MGMT-EUS2-DEP01-INFRASTRUCTURE.tfvars  \
    --library_parameter_file LIBRARY/MGMT-EUS2-SAP_LIBRARY/MGMT-EUS2-SAP_LIBRARY.tfvars                      \                      
    --subscription $subscriptionID                                                                           \
    --spn_id $appID                                                                                          \
    --spn_secret $spn_secret                                                                                 \
    --tenant_id $tenant
    --auto-approve
```

```powershell

cd \Azure_SAP_Automated_Deployment\WORKSPACES


$subscription="<subscriptionID>"
$appId="<appID>"
$spn_secret="<password>"
$tenant_id="<tenant>"

New-SAPAutomationRegion 
    -DeployerParameterfile .\DEPLOYER\MGMT-EUS2-DEP01-INFRASTRUCTURE\MGMT-EUS2-DEP01-INFRASTRUCTURE.json 
    -LibraryParameterfile .\LIBRARY\MGMT-EUS2-SAP_LIBRARY\MGMT-EUS2-SAP_LIBRARY.json 
    -Subscription $subscription 
    -SPN_id $appId 
    -SPN_password $spn_secret 
    -Tenant_id $tenant_id
    -Silent      
```

Deploy the workload zone by running either the Bash or PowerShell script.

Be sure to replace the sample credentials with your service principal's information. You can use the same service principal credentials that you used in the control plane deployment. For production deployments, we recommend using different service principals per workload zone.

```bash

cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/LANDSCAPE/QA-EUS2-SAP03-INFRASTRUCTURE

subscriptionID=<subscriptionID>
appId=<appID>
spn_secret=<password>
tenant_id=<tenant>

${DEPLOYMENT_REPO_PATH}/deploy/scripts/install_workloadzone.sh \
    --parameterfile QA-EUS2-SAP03-INFRASTRUCTURE.tfvars        \
    --deployer_environment MGMT                                \           
    --subscription $subscriptionID                             \
    --spn_id $appID                                            \
    --spn_secret $spn_secret                                   \
    --tenant_id $tenant                                        \
    --auto-approve
```

```powershell

cd \Azure_SAP_Automated_Deployment\WORKSPACES\LANDSCAPE\QA-EUS2-SAP03-INFRASTRUCTURE

$subscription="<subscriptionID>"
$appId="<appID>"
$spn_secret="<password>"
$tenant_id="<tenant>"

New-SAPWorkloadZone --parameterfile .\QA-EUS2-SAP03-INFRASTRUCTURE.tfvars 
    -DeployerEnvironment MGMT
    -Subscription $subscription
    -SPN_id $appId
    -SPN_password $spn_secret
    -Tenant_id $tenant_id
```

Deploy the SAP system in the QA environment. Run either the Bash or PowerShell command.

```bash
cd ~/Azure_SAP_Automated_Deployment/WORKSPACES/SYSTEM/QA-EUS2-SAP03-X01

${DEPLOYMENT_REPO_PATH}/deploy/scripts/installer.sh --parameterfile QA-EUS2-SAP03-X01.tfvars --type sap_system --auto-approve
```

```powershell
cd \Azure_SAP_Automated_Deployment\WORKSPACES\SYSTEM\QA-EUS2-SAP03-X01

New-SAPSystem --parameterfile .\QA-EUS2-SAP03-tfvars.json -Type sap_system
```

## Next step

> [!div class="nextstepaction"]
> [Tutorial: Enterprise scale for SAP Deployment Automation Framework](tutorial.md)
