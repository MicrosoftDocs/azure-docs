---
title: Map hostnames to IP addresses for the Azure Operator Insights ingestion agent.
description: Configure the Azure Operator Insights ingestion agent to use fixed IP addresses instead of hostnames.
author: rcdun
ms.author: rdunstan
ms.reviewer: sergeyche
ms.service: operator-insights
ms.topic: how-to
ms.date: 02/29/2024

#CustomerIntent: As an admin in an operator network, I want to make the ingestion agent work without DNS, so that the ingestion agent can upload data to Azure Operator Insights.
---

# Map Microsoft hostnames to IP addresses for ingestion agents that can't resolve public hostnames

The Azure Operator Insights ingestion agent needs to resolve some Microsoft hostnames. If the VMs onto which you install the agent can't use DNS to resolve these hostnames, you need to add entries on each agent VM to map the hostnames to IP addresses.

This process assumes that you're connecting to Azure over ExpressRoute and are using Private Links and/or Service Endpoints. If you're connecting over public IP addressing, you **cannot** use this workaround. Your VMs must be able to resolve public hostnames. 

## Prerequisites

- Peer an Azure virtual network to your ingestion agent.
- [Create the Data Product that you want to use with this ingestion agent](data-product-create.md).
- [Set up authentication to Azure](set-up-ingestion-agent.md#set-up-authentication-to-azure) and [Prepare the VMs](set-up-ingestion-agent.md#prepare-the-vms) for the ingestion agent.

## Create service endpoints and private links

1. Create the following resources from a virtual network that is peered to your ingestion agents.
    - A Service Endpoint to Azure Storage.
    - A Private Link or Service Endpoint to the Key Vault created by your Data Product. The Key Vault is the same one that you found in [Grant permissions for the Data Product Key Vault](set-up-ingestion-agent.md#grant-permissions-for-the-data-product-key-vault) when you started setting up the ingestion agent.
1. Note the IP addresses of these two connections.

## Find URLs for your Data Product

1. Note the ingestion storage URL for your Data Product. You can find the ingestion storage URL on your Data Product overview page in the Azure portal, in the form `<account-name>.blob.core.windows.net`.
1. Note the URL of the Data Product Key Vault. This Key Vault is in a resource group named `<data-product-name>-HostedResources-<unique-id>`. On the Key Vault overview page, you want the 'Vault URI' field, which appears as `<vault-name>.vault.azure.net`.

## Look up a public IP address for login.microsoft.com

Use a DNS lookup tool to find a public IP address for `login.microsoftonline.com`. For example:

- On Windows:
    ```
    nslookup login.microsoftonline.com
    ```
- On Linux:
   ```
    dig login.microsoftonline.com
    ```

You can use any of the IP addresses.


## Configure the ingestion agent to map between the IP addresses and the hostnames

1. Add a line to */etc/hosts* on the VM linking the two values in the following format, for each of the storage and Key Vault.
    ```
    <Storage private IP>   <ingestion URL>
    <Key Vault private IP>  <Key Vault URL>
    ````
1. Add the public IP address for `login.microsoftonline.com` to */etc/hosts*.
    ```
    <Public IP>   login.microsoftonline.com
    ````

## Next step

> [!div class="nextstepaction"]
> [Continue setting up the ingestion agent](set-up-ingestion-agent.md#install-the-agent-software)
