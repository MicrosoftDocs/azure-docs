---
# Mandatory fields.
title: How to use Azure Digital Twins CLI
titleSuffix: Azure Digital Twins
description: See how to use Azure Digital Twins CLI
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

## Table of Contents

- [Setup and Getting Started](#setup-and-getting-started)
- [ADT CLI Command Guide](#adt-cli-command-guide)
  - [ADT Instance](#adt-instance-management)
  - [ADT Endpoints](#adt-endpoints-configuration)
  - [ADT RBAC](#adt-rbac)
  - [ADT Routes](#adt-routes)

## Setup and Getting Started

> Note: There is nothing preventing you from installing this extension in cloud shell. For private preview, simply upload the .whl package to your cloud shell environment, then follow the instructions starting from `Add ADT enabled extension`. For public-preview the install step is simply: `az extension add --name azure-iot`.

1. **Azure CLI**

   - [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)

1. **Azure IoT CLI Extension**:

   - Download the [latest snapshot](../CLI/azure_iot-0.0.1.dev6-py2.py3-none-any.whl) of the ADT enabled IoT CLI extension (a .whl file)
   - Install the extension

     - :exclamation: Remove previously installed IoT CLI extension:
        > There should be only 1 azure-iot extension installed. azure-iot and azure-cli-iot-ext should not coexist.
        - Legacy alias
            `az extension remove --name azure-cli-iot-ext`
        - Modern alias
            `az extension remove --name azure-iot`

     - Add ADT enabled extension:

        `az extension add -y --source azure_iot-0.0.1.dev6-py2.py3-none-any.whl`

     - Verify installation of **azure-iot** version **0.0.1.dev6**:

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

   - The ADT commands will now be available
     - Use `az dt -h` to review the top-level commands.
     - All commands have help descriptions and examples. Append --help or -h to the end of a command or command group to expand on details.

1. **CLI Authentication**
   - Authenticate with the Azure CLI via `az login`.
   - Ensure the proper subscription is set via `az account set -s [sub Id]`
        - List subscriptions with `az account list`

## ADT CLI Command Guide

### ADT Instance Management

#### Command Group: `az dt`

> In order to use ADT you need to create an ADT instance!

#### az dt create

Examples

- Create an ADT instance in the default location

  `az dt create -n mydtinstance -g MyResourceGroup`

- Create an ADT instance in a specific location with tags

  `az dt create -n mydtinstance -g MyResourceGroup --location westcentralus --tags "a=b;c=d"`

#### az dt show

Examples

- Show details of an ADT instance

  `az dt show -n mydtinstance`

- Show an ADT instance and project certain properties.

  `az dt show -n mydtinstance --query "{Endpoint:hostName, Location:location}"`

#### az dt list

Examples

- List all ADT instances in the current subscription.

  `az dt list`

- List all ADT instances in target resource group and output in table format.

  `az dt list -g MyResourceGroup --output table`

- List all ADT instances in subscription that meet a condition.

  `az dt list --query "[?contains(name, 'Production')]"`

- Count ADT instances that meet condition.

  `az dt list --query "length([?contains(name, 'Production')])"`

#### az dt delete

Examples

- Delete an arbitrary ADT instance

  `az dt delete -n mydtinstance`

### ADT Endpoints configuration

#### Command Group: `az dt endpoints`

> Configure egress endpoints of an ADT instance

#### az dt endpoints add

Examples

- Add EventGrid Topic endpoint (requires pre-created EG resource)

  `az dt endpoints add eventgrid --endpoint-name myeg_endpoint --eventgrid-resource-group myeg_resourcegroup --eventgrid-topic myeg_topic -n mydtinstance`

- Add ServiceBus Topic endpoint (requires pre-created SB resource)

  `az dt endpoints add servicebus --endpoint-name mysb_endpoint --servicebus-resource-group mysb_resourcegroup --servicebus-namespace mysb_namespace --servicebus-topic mysb_topic --servicebus-policy mysb_topicpolicy -n mydtinstance`

- Add EventHub endpoint (requires pre-created EH resource)

  `az dt endpoints add eventhub --endpoint-name myeh_endpoint --eventhub-resource-group myeh_resourcegroup --eventhub-namespace myeh_namespace --eventhub myeventhub --eventhub-policy myeh_policy -n mydtinstance`

#### az dt endpoints show

Examples

- Show a configured endpoint on an ADT instance

  `az dt endpoints show --endpoint-name myeh_endpoint -n mydtinstance`

#### az dt endpoints list

Examples

- List all configured endpoints on an ADT instance

  `az dt endpoints list -n mydtinstance`

#### az dt endpoints delete

Examples

- Delete a target endpoint on an ADT instance

  `az dt endpoints delete --endpoint-name myeh_endpoint -n mydtinstance`

### ADT RBAC

#### Command Group: `az dt rbac`

> Manage RBAC assignments for an ADT instance

#### az dt rbac assign-role

Examples

- Assign 'coolperson@microsoft.com' owner role for an ADT instance

  `az dt rbac assign-role --assignee 'coolperson@microsoft.com' --role owner -n mydtinstance`

- Assign 'kindacoolperson@microsoft.com' reader role for an ADT instance

  `az dt rbac assign-role --assignee 'kindacoolperson@microsoft.com' --role reader -n mydtinstance`

#### az dt rbac list-assignments

Examples

- List existing role assignments of an ADT instance

  `az dt rbac list-assignments -n mydtinstance`

#### az dt rbac remove-role

Examples

- Remove an existing role assignment from an ADT instance

  `az dt rbac remove-role --assignee 'notcoolperson@microsoft.com -n mydtinstance`

### ADT Routes

#### Command Group: `az dt routes`

> Manage and configure event routes. **Remember** you must assign yourself **admin** role prior to executing route commands!

#### az dt routes add

Examples

- Add an event route

  `az dt routes add -n mydtinstance --endpoint-name myeh_endpoint --route-name myeh_route`

#### az dt routes show

Examples

- Show an existing event route

  `az dt routes show --route-name myeh_route -n mydtinstance`

#### az dt routes list

Examples

- List all event routes on an ADT instance

  `az dt routes list -n mydtinstance`

#### az dt routes delete

Examples

- Delete a target event route from an ADT instance

  `az dt routes delete --route-name myeh_route -n mydtinstance`
