---
title: Register a Microsoft Entra ID application for Open OnDemand authentication
description: How to register a Microsoft Entra ID application for Open OnDemand authentication
author: xpillons
ms.date: 05/27/2025
ms.author: padmalathas
---

# Register a Microsoft Entra ID application for Open OnDemand authentication
The Open OnDemand front end use Open ID Connect (OIDC) for authentication. The OIDC provider is a Microsoft Entra ID application that you need to register which uses Federated credentials with a User-Assigned Managed Identity to avoid storing secrets in the Open OnDemand configuration. The following steps describe how to register a Microsoft Entra ID application for Open OnDemand authentication.

## Microsoft Entra ID application registration right after a successful deployment
After the deployment is finished, it's necessary to execute the following commands from a Linux shell with Azure CLI installed to register and configure the Microsoft Entra ID application for authentication. The account logged into the CLI must have the appropriate permissions to register an application and its active subscription must be the one used for the deployment if it isn't already set.

> [!NOTE]
> Make sure you have `jq` utility installed on your system.

```bash
resource_group=<resource_group_name>
az deployment group create -g $resource_group --template-uri https://raw.githubusercontent.com/Azure/cyclecloud-slurm-workspace/refs/heads/main/bicep/ood/oodEntraApp.json --parameters "$(az deployment group show -g $resource_group -n pid-d5d2708b-a4ef-42c0-a89b-b8bd6dd6d29b-partnercenter --query properties.outputs | jq '.oodManualRegistration.value | with_entries(.value |= {value: .})')"
```

Once executed, check that the application is indeed registered and copy its client ID. 
Ensure the redirect URI in Authentication is correct, federated credentials are set, `upn` is an optional claim in Token configuration, and API permissions are present.

## Update an existing Microsoft Entra ID application after a successful deployment
Update the redirect URI with either the private IP or the FQDN of the Open OnDemand virtual machine if a Microsoft Entra ID application is already registered.

Verify that both the `ccw` and `OpenOnDemand` clusters are started. Although there may be some temporary errors, both clusters should be ready within a few minutes. 
Complete the configuration of the registered application by adding a new redirect URI, 'https://\<ip\>/oidc', in the Authentication settings of the application as illustrated below.

:::image type="content" source="../../images/ccws/entra-id-redirect-uri.png" alt-text="Screenshot of Microsoft Entra ID redirect URI update.":::

## Register a Microsoft Entra ID application before a deployment
It's possible to register a Microsoft Entra ID application before the deployment of a full environment and configure it afterwards. 

Create an  app.json parameter file containing:
- **appName** : the name of the application to be registered,
- **fqdn**: the IP address or the Fully Qualified Domain Name (FQDN) of the Open OnDemand virtual machine (may be temporarily set as it can be modified later),
- **umiName**: the name of the user-assigned managed identity to create for the federated identity credentials assigned to the Open OnDemand virtual machine.

```json
{
  "appName": {
    "value": ""
  },
  "fqdn": {
    "value": ""
  },
  "umiName": {
    "value": ""
  }
}
```

Execute the below commands to create a resource group and a user-assigned managed identity and to register the Microsoft Entra ID application.
```bash
resource_group=<the_resource_group_you_deployed_in>
location=<location>
az group create -l $location -n $resource_group
az identity create --name $(jq -r '.umiName.value' app.json) --resource-group $resource_group --location $location
az deployment group create -g $resource_group --template-uri https://raw.githubusercontent.com/Azure/cyclecloud-slurm-workspace/refs/heads/main/bicep/ood/oodEntraApp.json --parameters @app.json
```

## Resources
* [Configure Open OnDemand with CycleCloud](./configure-open-ondemand.md)
* [Add users for Open OnDemand](./open-ondemand-add-users.md)
