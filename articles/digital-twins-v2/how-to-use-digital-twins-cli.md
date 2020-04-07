---
# Mandatory fields.
title: Use the Azure Digital Twins CLI
titleSuffix: Azure Digital Twins
description: Learn how to get started with and use the Azure Digital Twins CLI
author: alinamstanciu
ms.author: alinast # Microsoft employees only
ms.date: 3/30/2020
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Azure Digital Twins CLI

Azure Digital Twins has a CLI that you can use to perform most major actions with the service, including:
* Managing an Azure Digital Twins instance
* Configuring endpoints
* Configuring role-based access control (RBAC)
* Managing routes

This guide provides the CLI commands for these tasks, and other information that you need to use this tool.

## Getting started

First, either open an instance of [Azure Cloud Shell](../cloud-shell/overview.md) or [install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

Next, in your chosen shell window, get the **Azure IoT CLI Extension** by following these steps:

1. Install the Azure Digital Twins-enabled IoT extension with this command:
    
  `az extension add --name azure-iot`

2. Verify your installation of **azure-iot** is version **0.0.1.dev6** with this command:

    `az extension list`

    You will see this output:

    ```json
    [
      {
        "extensionType": "whl",
        "name": "azure-iot",
        "version": "0.0.1.dev6"
      }
    ]
    ```

3. Authenticate within the shell
   * Use the command `az login` to authenticate
   * Ensure you have set the proper subscription for this session by running `az account set -s <subscription ID>`

>[!TIP]
> You can see a list of all of your subscriptions with `az account list`.

You can now use the Azure Digital Twins CLI commands. Here are some helpful tips that you can use with them going forward:
* Use `az dt -h` to review the top-level commands.
* *All commands have help descriptions and examples. Append `--help` or `-h` to the end of a command or command group to expand these details.

## Azure Digital Twins CLI Command Guide

The following sections describe the commands you can use with the Azure Digital Twins CLI.

### Manage an Azure Digital Twins instance

Command group: `az dt`

In order to use Azure Digital Twins, you need to create an Azure Digital Twins instance. The `az dt` commands can be used to create and manage the instance.

#### az dt create

Uses:

* Create an Azure Digital Twins instance in the default location

  `az dt create -n mydtinstance -g MyResourceGroup`

* Create an Azure Digital Twins instance in a specific location with tags

  `az dt create -n mydtinstance -g MyResourceGroup --location westcentralus --tags "a=b;c=d"`

#### az dt show

Uses:

* Show details of an Azure Digital Twins instance

  `az dt show -n mydtinstance`

* Show an Azure Digital Twins instance and project certain properties

  `az dt show -n mydtinstance --query "{Endpoint:hostName, Location:location}"`

#### az dt list

Uses:

* List all Azure Digital Twins instances in the current subscription

  `az dt list`

* List all Azure Digital Twins instances in target resource group, and output in table format

  `az dt list -g MyResourceGroup --output table`

* List all Azure Digital Twins instances in subscription that meet a certain condition

  `az dt list --query "[?contains(name, 'Production')]"`

* Count Azure Digital Twins instances that meet a certain condition

  `az dt list --query "length([?contains(name, 'Production')])"`

#### az dt delete

Uses:

* Delete an Azure Digital Twins instance

  `az dt delete -n mydtinstance`

### Configure endpoints

Command group: `az dt endpoints`

These commands are used to configure egress endpoints of an Azure Digital Twins instance.

#### az dt endpoints add

Uses:

* Add Event Grid topic endpoint (requires pre-created Event Grid resource)

  `az dt endpoints add eventgrid --endpoint-name myeg_endpoint --eventgrid-resource-group myeg_resourcegroup --eventgrid-topic myeg_topic -n mydtinstance`

* Add Service Bus topic endpoint (requires pre-created Service Bus resource)

  `az dt endpoints add servicebus --endpoint-name mysb_endpoint --servicebus-resource-group mysb_resourcegroup --servicebus-namespace mysb_namespace --servicebus-topic mysb_topic --servicebus-policy mysb_topicpolicy -n mydtinstance`

* Add Event Hub endpoint (requires pre-created Event Hub resource)

  `az dt endpoints add eventhub --endpoint-name myeh_endpoint --eventhub-resource-group myeh_resourcegroup --eventhub-namespace myeh_namespace --eventhub myeventhub --eventhub-policy myeh_policy -n mydtinstance`

#### az dt endpoints show

Uses:

* Show a configured endpoint on an Azure Digital Twins instance

  `az dt endpoints show --endpoint-name myeh_endpoint -n mydtinstance`

#### az dt endpoints list

Uses:

* List all configured endpoints on an Azure Digital Twins instance

  `az dt endpoints list -n mydtinstance`

#### az dt endpoints delete

Uses:

* Delete a target endpoint on an Azure Digital Twins instance

  `az dt endpoints delete --endpoint-name myeh_endpoint -n mydtinstance`

### Configure RBAC

Command group: `az dt rbac`

These commands are used to manage [RBAC](../role-based-access-control/overview.md) assignments for an Azure Digital Twins instance.

#### az dt rbac assign-role

Uses:

* Assign a user Owner role for an Azure Digital Twins instance

  `az dt rbac assign-role --assignee 'coolperson@microsoft.com' --role owner -n mydtinstance`

* Assign a user Reader role for an Azure Digital Twins instance

  `az dt rbac assign-role --assignee 'kindacoolperson@microsoft.com' --role reader -n mydtinstance`

#### az dt rbac list-assignments

Uses:

* List existing role assignments of an Azure Digital Twins instance

  `az dt rbac list-assignments -n mydtinstance`

#### az dt rbac remove-role

Uses:

* Remove an existing role assignment from an Azure Digital Twins instance

  `az dt rbac remove-role --assignee 'notcoolperson@microsoft.com -n mydtinstance`

### Manage Azure Digital Twins routes

Command group: `az dt routes`

These commands are used to manage and configure event routes. 

>[!IMPORTANT]
> You must assign yourself to the **Owner** role for the Azure Digital Twins instance before you can execute route commands.

#### az dt routes add

Uses:

* Add an event route

  `az dt routes add -n mydtinstance --endpoint-name myeh_endpoint --route-name myeh_route`

#### az dt routes show

Uses:

* Show an existing event route

  `az dt routes show --route-name myeh_route -n mydtinstance`

#### az dt routes list

Uses:

* List all event routes on an Azure Digital Twins instance

  `az dt routes list -n mydtinstance`

#### az dt routes delete

Uses:

* Delete a target event route from an Azure Digital Twins instance

  `az dt routes delete --route-name myeh_route -n mydtinstance`

## Next steps

See how to manage an Azure Digital Twins instance using APIs:
* [Use the Azure Digital Twins APIs](how-to-use-apis.md)