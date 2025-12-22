---
title: Register a Microsoft Entra ID application for Open OnDemand authentication
description: How to register a Microsoft Entra ID application for Open OnDemand authentication
author: xpillons
ms.date: 07/01/2025
ms.author: padmalathas
---

# Register a Microsoft Entra ID application for Open OnDemand authentication
The Open OnDemand front end uses Open ID Connect (OIDC) for authentication. The OIDC provider is a Microsoft Entra ID application that you need to register. This application uses federated credentials with a user-assigned managed identity to avoid storing secrets in the Open OnDemand configuration. The following steps describe how to register a Microsoft Entra ID application for Open OnDemand authentication.

## Microsoft Entra ID application registration right after a successful deployment
When the deployment finishes, run the following commands from a Linux shell with Azure CLI installed to register and configure the Microsoft Entra ID application for authentication. The account you sign in to the CLI with must have the right permissions to register an application. If the active subscription isn't already set, make sure it's the subscription you used for the deployment.

> [!IMPORTANT]
> Run the following command from a Linux shell where Azure CLI is installed and authenticated with the Azure account designated for deployment. Azure Cloud Shell isn't supported for this scenario.
> [!NOTE]
> Make sure the command-line tool `jq` for JSON processing is installed on your system.

```bash
resource_group=<resource_group_name>
az deployment group create -g $resource_group --template-uri https://raw.githubusercontent.com/Azure/cyclecloud-slurm-workspace/refs/heads/main/bicep/ood/oodEntraApp.json --parameters "$(az deployment group show -g $resource_group -n pid-d5d2708b-a4ef-42c0-a89b-b8bd6dd6d29b-partnercenter --query properties.outputs | jq '.oodManualRegistration.value | with_entries(.value |= {value: .})')"
```

When you run the commands, verify that the application is registered and copy its client ID.
Make sure the redirect URI in Authentication is correct, federated credentials are set, `upn` is an optional claim in Token configuration, and API permissions are present.

## Update an existing Microsoft Entra ID application after a successful deployment
If you already registered a Microsoft Entra ID application, update the redirect URI with either the private IP or the FQDN of the Open OnDemand virtual machine.

Verify that both the `ccw` and `OpenOnDemand` clusters are running. Although there might be some temporary errors, both clusters should be ready within a few minutes. 
Add a new redirect URI, `https://\<ip\>/oidc`, in the Authentication settings of the application to complete the configuration.

:::image type="content" source="../../images/ccws/entra-id-redirect-uri.png" alt-text="Screenshot of Microsoft Entra ID redirect URI update.":::

## Register a Microsoft Entra ID application before a deployment
You can register a Microsoft Entra ID application before deploying a full environment and configure it later.

Create an `app.json` parameter file containing:
- **appName** : the name of the application to register,
- **fqdn**: the IP address or the Fully Qualified Domain Name (FQDN) of the Open OnDemand virtual machine (you can temporarily set this value because you can change it later),
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

Run the following commands to create a resource group and a user-assigned managed identity and to register the Microsoft Entra ID application.
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
