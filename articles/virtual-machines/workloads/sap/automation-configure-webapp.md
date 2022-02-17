---
title: Configure a Deployer UX Web Application for SAP Deployment Automation Framework
description: Configure a web app as a part of the control plane to assist in creating and deploying SAP workload zones and systems on Azure.
author: wsheehan
ms.author: wsheehan
ms.reviewer: wsheehan
ms.date: 02/16/2021
ms.topic: conceptual
ms.service: virtual-machines-sap
---

# Configure the Control Plane UX Web Application

As a part of the SAP automation framework control plane, you can optionally create an interactive web application that will assist you in creating and deploying SAP workload zones and systems.

:::image type="content" source="./media/webapp/Webapp-front-page.png" alt-text="Web app front page":::

## Create an app registration 

If you would like to use the web app, you must first create an app registration for authentication purposes. Open the Azure cloud shell and execute the following commands:

# [Linux](#tab/linux)
Replace MGMT with your environment as necessary.
```bash
echo '[{"resourceAppId":"00000003-0000-0000-c000-000000000000","resourceAccess":[{"id":"e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"}]}]' >> manifest.json 

TF_VAR_app_registration_app_id=$(az ad app create --display-name MGMT-webapp-registration --available-to-other-tenants false --required-resource-access @manifest.json --query "appId" | tr -d '"')

echo $TF_VAR_app_registration_app_id

az ad app credential reset --id $TF_VAR_app_registration_app_id --append --query "password" 

rm manifest.json
```
# [Windows](#tab/windows)
Replace MGMT with your environment as necessary.
```powershell
Add-Content -Path manifest.json -Value '[{"resourceAppId":"00000003-0000-0000-c000-000000000000","resourceAccess":[{"id":"e1fe6dd8-ba31-4d61-89e7-88639da4683d","type":"Scope"}]}]'

$TF_VAR_app_registration_app_id=(az ad app create --display-name MGMT-webapp-registration --available-to-other-tenants false --required-resource-access ./manifest.json --query "appId").Replace('"',"")

echo $TF_VAR_app_registration_app_id

az ad app credential reset --id $TF_VAR_app_registration_app_id --append --query "password" 

rm ./manifest.json
```
---

## Deploy via Azure Devops (pipelines)

For instructions on setting up the web app using Azure Devops, see [Use SAP Deployment Automation Framework from Azure DevOps Services](https://review.docs.microsoft.com/en-us/azure/virtual-machines/workloads/sap/automation-configure-devops?branch=main)

## Deploy via Azure CLI (cloudshell)

For instructions on setting up the web app using the Azure CLI, see [Deploy the control plane](https://review.docs.microsoft.com/en-us/azure/virtual-machines/workloads/sap/automation-deploy-control-plane?branch=main&tabs=linux)

## Using the web app

The web app allow you to create SAP workload zones (landscapes) and systems. You can do so from scratch, with the ability to select existing Azure resources for certain parameters. Or, you can import an existing .tfvars file, and convert it to a landscape or system object. Depending on how you set up the web app, you can deploy these landscapes and systems directly (via ADO) or simply download a parameter file for use in the deployment.
