---
title: About Control Plane deployment for the SAP Deployment automation framework
description: Overview of the Control Plan deployment process within the SAP deployment automation framework on Azure.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 11/17/2021
ms.topic: how-to
ms.service: virtual-machines-sap
---

# Deploy the control plane

The control plane deployment for the [SAP deployment automation framework on Azure](automation-deployment-framework.md) consists of the following components:
 - Deployer
 - SAP library

:::image type="content" source="./media/automation-deployment-framework/control-plane.png" alt-text="Diagram Control Plane.":::

## Prepare the deployment credentials

The SAP Deployment Frameworks uses Service Principals when doing the deployment. You can create the Service Principal for the Control Plane deployment using the following steps using an account with permissions to create Service Principals:


```azurecli
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/<subscriptionID>" --name="<environment>-Deployment-Account"
  
```

> [!IMPORTANT]
> The name of the Service Principal must be unique.
>
> Record the output values from the command.
   > - appId
   > - password
   > - tenant

Assign the correct permissions to the Service Principal: 

```azurecli
az role assignment create --assignee <appId> --role "User Access Administrator"
```

## Deploy the control plane
   
The sample Deployer configuration file `MGMT-WEEU-DEP00-INFRASTRUCTURE.tfvars` is located in the `~/Azure_SAP_Automated_Deployment/WORKSPACES/DEPLOYER/MGMT-WEEU-DEP00-INFRASTRUCTURE` folder.

The sample SAP Library configuration file `MGMT-WEEU-SAP_LIBRARY.tfvars` is located in the `~/Azure_SAP_Automated_Deployment/WORKSPACES/LIBRARY/MGMT-WEEU-SAP_LIBRARY` folder.

Running the command below will create the Deployer, the SAP Library and add the Service Principal details to the deployment key vault.

# [Linux](#tab/linux)

You can copy the sample configuration files to start testing the deployment automation framework.

```bash
cd ~/Azure_SAP_Automated_Deployment

cp -R sap-automation/samples/WORKSPACES WORKSPACES

```

```bash
cd ~/Azure_SAP_Automated_Deployment/WORKSPACES

az logout
az login
export DEPLOYMENT_REPO_PATH=~/Azure_SAP_Automated_Deployment/sap-automation
export       subscriptionID=<subscriptionID>
export               spn_id=<appID>
export           spn_secret=<password>
export            tenant_id=<tenant>
export          region_code=WEEU

${DEPLOYMENT_REPO_PATH}/deploy/scripts/prepare_region.sh                                                                            \
        --deployer_parameter_file DEPLOYER/MGMT-${region_code}-DEP00-INFRASTRUCTURE/MGMT-${region_code}-DEP00-INFRASTRUCTURE.tfvars \
        --library_parameter_file LIBRARY/MGMT-${region_code}-SAP_LIBRARY/MGMT-${region_code}-SAP_LIBRARY.tfvars                     \
        --subscription $subscriptionID                                                                                              \
        --spn_id "${spn_id}"                                                                                                        \
        --spn_secret "${spn_secret}"                                                                                                \
        --tenant_id "${tenant_id}"
```

# [Windows](#tab/windows)

You can copy the sample configuration files to start testing the deployment automation framework.

```powershell

cd C:\Azure_SAP_Automated_Deployment

xcopy sap-automation\samples\WORKSPACES WORKSPACES

```



```powershell


$subscription="<subscriptionID>"
$appId="<appID>"
$spn_secret="<password>"
$tenant_id="<tenant>"

cd C:\Azure_SAP_Automated_Deployment\WORKSPACES

New-SAPAutomationRegion -DeployerParameterfile .\DEPLOYER\MGMT-WEEU-DEP00-INFRASTRUCTURE\MGMT-WEEU-DEP00-INFRASTRUCTURE.tfvars  -LibraryParameterfile .\LIBRARY\MGMT-WEEU-SAP_LIBRARY\MGMT-WEEU-SAP_LIBRARY.tfvars -Subscription $subscription -SPN_id $appId -SPN_password $spn_secret -Tenant_id $tenant_id
```
---


> [!NOTE]
> Be sure to replace the sample value `<subscriptionID>` with your subscription ID.
> Replace the `<spn_ID>`, `<password>`, `<tenant>` values with the output values of the SPN creation

## Next step

> [!div class="nextstepaction"]
> [Configure SAP Workload Zone](automation-deploy-workload-zone.md)


