---
# Mandatory fields.
title: Use the Azure Digital Twins CLI
titleSuffix: Azure Digital Twins
description: See how to get started with and use the Azure Digital Twins CLI.
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

# Use the Azure Digital Twins CLI

In addition to managing your Azure Digital Twins instance in the Azure portal, Azure Digital Twins has a **command-line interface (CLI)** that you can use to perform most major actions with the service, including:
* Managing an Azure Digital Twins instance
* Configuring endpoints
* Managing [routes](concepts-route-events.md)
* Configuring [security](concepts-security.md) via role-based access control (RBAC)

This article provides the CLI commands for these tasks, and other information that you need to use this tool.

You can also view the reference documentation for these commands as part of the [az iot command set](https://docs.microsoft.com/cli/azure/ext/azure-iot/iot?view=azure-cli-latest).

## Getting started with the CLI

First, either open an instance of [Azure Cloud Shell](../cloud-shell/overview.md) or [install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

Next, in your chosen shell window, get the **Azure IoT CLI Extension** by following these steps:

1. Install the Azure Digital Twins-enabled IoT extension with this command: `az extension add --name azure-iot`
    [!INCLUDE [iot-hub-cli-version-info.md](../../includes/iot-hub-cli-version-info.md)]

2. Verify your installation of **azure-iot** is version **0.0.1.dev8** with this command:

    `az extension list`

    You will see this output:

    ```json
    [
      {
        "extensionType": "whl",
        "name": "azure-iot",
        "version": "0.0.1.dev8"
      }
    ]
    ```

3. Authenticate within the shell
   * Use the command `az login` to authenticate
   * Ensure you have set the proper subscription for this session by running `az account set -s <subscription-ID>`

>[!TIP]
> You can see a list of all of your subscriptions with `az account list`.

You can now use the Azure Digital Twins CLI commands. Here are some helpful tips that you can use with them going forward:
* Use `az dt -h` to review the top-level commands.
* All commands have help descriptions and examples. Append `--help` or `-h` to the end of a command or command group to expand these details.

## Azure Digital Twins CLI command guide

The following sections describe the commands you can use with the Azure Digital Twins CLI.

### Manage an Azure Digital Twins instance

Command group: `az dt`

In order to use Azure Digital Twins, you need to create an Azure Digital Twins instance. The `az dt` commands can be used to create and manage the instance.

#### az dt create

Uses:

* Create an Azure Digital Twins instance in the default location

  `az dt create -n <Azure-Digital-Twins-instance-name> -g <resource-group>`

* Create an Azure Digital Twins instance in a specific location with tags

  `az dt create -n <Azure-Digital-Twins-instance-name> -g <resource-group> --location westcentralus --tags "a=b;c=d"`

#### az dt show

Uses:

* Show details of an Azure Digital Twins instance

  `az dt show -n <Azure-Digital-Twins-instance-name>`

* Show an Azure Digital Twins instance and project certain properties

  `az dt show -n <Azure-Digital-Twins-instance-name> --query "{Endpoint:hostName, Location:location}"`

#### az dt list

Uses:

* List all Azure Digital Twins instances in the current subscription

  `az dt list`

* List all Azure Digital Twins instances in target resource group, and output in table format

  `az dt list -g <resource-group> --output table`

* List all Azure Digital Twins instances in subscription that meet a certain condition

  `az dt list --query "[?contains(name, 'Production')]"`

* Count Azure Digital Twins instances that meet a certain condition

  `az dt list --query "length([?contains(name, 'Production')])"`

#### az dt delete

Uses:

* Delete an Azure Digital Twins instance

  `az dt delete -n <Azure-Digital-Twins-instance-name>`

### Configure endpoints

Command group: `az dt endpoint`

These commands are used to configure egress endpoints of an Azure Digital Twins instance.

#### az dt endpoint create

Uses:

* Add event grid topic endpoint (requires pre-created Event Grid resource)

  `az dt endpoint create eventgrid --endpoint-name <Event-Grid-endpoint> --eventgrid-resource-group <Event-Grid-resource-group> --eventgrid-topic <Event-Grid-topic> -n <Azure-Digital-Twins-instance-name>`

* Add Service Bus topic endpoint (requires pre-created Service Bus resource)

  `az dt endpoint create servicebus --endpoint-name <Service-Bus-endpoint> --servicebus-resource-group <Service-Bus-resource-group> --servicebus-namespace <Service-Bus-namespace> --servicebus-topic <Service-Bus-topic> --servicebus-policy <Service-Bus-topic-policy> -n <Azure-Digital-Twins-instance-name>`

* Add Event Hub endpoint (requires pre-created Event Hub resource)

  `az dt endpoint create eventhub --endpoint-name <Event-Hub-endpoint> --eventhub-resource-group <Event-Hub-resource-group> --eventhub-namespace <Event-Hub-namespace> --eventhub <Event-Hub-name> --eventhub-policy <Event-Hub-policy> -n <Azure-Digital-Twins-instance-name>`

#### az dt endpoint show

Uses:

* Show a configured endpoint on an Azure Digital Twins instance

  `az dt endpoint show --endpoint-name <Event-Hub-endpoint> -n <Azure-Digital-Twins-instance-name>`

#### az dt endpoint list

Uses:

* List all configured endpoints on an Azure Digital Twins instance

  `az dt endpoint list -n <Azure-Digital-Twins-instance-name>`

#### az dt endpoint delete

Uses:

* Delete a target endpoint on an Azure Digital Twins instance

  `az dt endpoint delete --endpoint-name <Event-Hub-endpoint> -n <Azure-Digital-Twins-instance-name>`

### Manage routes

Command group: `az dt route`

These commands are used to manage and configure event routes. 

>[!IMPORTANT]
> You must assign yourself to the **Owner** role for the Azure Digital Twins instance before you can execute route commands.

#### az dt route create

Uses:

* Add an event route (without filter)

  `az dt route create -n <Azure-Digital-Twins-instance> --endpoint-name <endpoint-name> --route-name <route-name>`

* Add an event route with filter

  `az dt route create -n <Azure-Digital-Twins-instance> --endpoint-name <endpoint-name> --route-name <route-name> --filter "type = 'Microsoft.DigitalTwins.Twin.Create'"`

#### az dt route show

Uses:

* Show an existing event route

  `az dt route show --route-name <route-name> -n <Azure-Digital-Twins-instance-name>`

#### az dt route list

Uses:

* List all event routes on an Azure Digital Twins instance

  `az dt route list -n <Azure-Digital-Twins-instance-name>`

#### az dt route delete

Uses:

* Delete a target event route from an Azure Digital Twins instance

  `az dt route delete --route-name <route-name> -n <Azure-Digital-Twins-instance-name>`

### Manage models

Command Group: `az dt model` 

These commands are used to manage Azure Digital Twins instance model operations. This command group requires the client principal to have admin privileges.

#### az dt model create

Uses:

* Add models to an Azure Digital Twins instance

  `az dt model create -n <Azure-Digital-Twins-instance-name> --models <file-path-or-inline-json>`

* Add models to an ADT instance from a directory (recursive)

  `az dt model create -n <Azure-Digital-Twins-instance-name> --from-directory <path-to-model-directory>`

#### az dt model list

Uses:

* List model metadata

  `az dt model list -n <Azure-Digital-Twins-instance-name>`

* List model definitions

  `az dt model list -n <Azure-Digital-Twins-instance-name> --definition`

* List dependencies of particular pre-existing model(s). Use a space to separate multiple DTMI model IDs.

  `az dt model list -n <Azure-Digital-Twins-instance-name> --dependencies-for <model-ID-0> <model-ID-1>`

#### az dt model show

Uses:

* Show model metadata

  `az dt model show -n <Azure-Digital-Twins-instance-name> --dtmi <model-ID>`

* Show model definition

  `az dt model show -n <Azure-Digital-Twins-instance-name> --dtmi <model-ID> --definition`

#### az dt model update

Uses:

Update the decommisioned status of a model (to true)

  `az dt model update -n <Azure-Digital-Twins-instance-name> --dtmi <model-ID> --decommission`

### Manage twins

Command Group: `az dt twin`

These commands are used to manage and configure the digital twins of an Azure Digital Twins instance. This command group requires the client principal to have admin privileges.

#### az dt twin query

Uses:

* Get all digital twins

  `az dt twin query -n <Azure-Digital-Twins-instance-name> -q "select * from digitaltwins"`

#### az dt twin create

Uses:

* Create a twin from an existing (previously-created) model

  `az dt twin create -n <Azure-Digital-Twins-instance-name> --dtmi <model-ID> --twin-id <twin-ID>`

* Create a twin from an existing (previously-created) model. Instantiate with property values.

  `az dt twin create -n <Azure-Digital-Twins-instance-name> --dtmi <model-ID> --twin-id <twin-ID> --properties '"manufacturer": "Microsoft"}'`

#### az dt twin show

Uses:

* Show an existing twin in an Azure Digital Twins instance

  `az dt twin show -n <Azure-Digital-Twins-instance-name> --twin-id <twin-ID>`

#### az dt twin update

Uses:

* Update a twin with a JSON-patch (example patch)

  `az dt twin update -n <Azure-Digital-Twins-instance-name> --twin-id <twin-ID> --json-patch '{"op":"replace", "path":"/Temperature", "value": 20.5}'`

* Update a twin with a JSON-patch defined in file

  `az dt twin update -n <Azure-Digital-Twins-instance-name> --twin-id <twin-ID> --json-patch <path-to-patch-file>`

#### az dt twin delete

Uses:

* Delete a twin by ID

  `az dt twin delete -n <Azure-Digital-Twins-instance-name> --twin-id <twin-ID>`

### Manage relationships

Command Group: `az dt twin edge`

These commands are used to manage and configure the relationships (or edges) of an Azure Digital Twins instance. This command group requires the client principal to have admin privileges.

#### az dt twin edge create

Uses:

* Create a relationship between source and target twins

  `az dt twin edge create -n <Azure-Digital-Twins-instance-name> --edge-id <relationship-ID> --relationship contains --source <source-twin-ID> --target <target-twin-ID>`

* Create a relationship between source and target twins. Provide relationship instance properties.

  `az dt twin edge create -n <Azure-Digital-Twins-instance-name> --edge-id <relationship-ID> --relationship contains --source <source-twin-ID> --target <target-twin-ID> --properties '{"ownershipUser": "me", "ownershipDepartment": "Computer Science"}'`

#### az dt twin edge show

Uses:

* Show a relationship between source and target twins

  `az dt twin edge show -n <Azure-Digital-Twins-instance-name> --twin-id <twin-ID> --edge-id <relationship-ID> --relationship <relationship-name>`

#### az dt twin edge list

Uses:

* List outgoing relationships of a twin

  `az dt twin edge list -n <Azure-Digital-Twins-instance-name> --twin-id <twin-ID>`

* List outgoing relationships of a twin and filter on relationship *contains*

  `az dt twin edge list -n <Azure-Digital-Twins-instance-name> --twin-id <twin-ID> --relationship contains`

* List incoming relationships to a twin.

  `az dt twin edge list -n <Azure-Digital-Twins-instance-name> --twin-id <twin-ID> --incoming-edges`

* List incoming relationships to a twin and filter on relationship *contains*

  `az dt twin edge list -n <Azure-Digital-Twins-instance-name> --twin-id <twin-ID> --relationship contains --incoming-edges`

#### az dt twin edge update

Uses:

* Update a twin relationship with a JSON patch

  `az dt twin edge update -n <Azure-Digital-Twins-instance-name> --twin-id <twin-ID> --edge-id <relationship-ID> --relationship contains --json-patch '[{}, {}]'`

* Update a twin relationship with a JSON patch defined in a file.

  `az dt twin edge update -n <Azure-Digital-Twins-instance-name> --twin-id <twin-ID> --edge-id <relationship-ID> --relationship contains --json-patch <path-to-patch-file>`

#### az dt twin edge delete

Uses:

* Delete a relationship between source and target twins

  `az dt twin edge delete -n <Azure-Digital-Twins-instance-name> --twin-id <twin-ID> --edge-id <relationship-ID> --relationship <relationship-name>`

### Configure RBAC

Command group: `az dt rbac`

These commands are used to manage [RBAC](../role-based-access-control/overview.md) assignments for an Azure Digital Twins instance.

#### az dt rbac assign-role

Uses:

* Assign a user the Owner role for an Azure Digital Twins instance

  `az dt rbac assign-role --assignee '<owner-user-email>' --role owner -n <Azure-Digital-Twins-instance-name>`

* Assign a user the Reader role for an Azure Digital Twins instance

  `az dt rbac assign-role --assignee '<reader-user-email>' --role reader -n <Azure-Digital-Twins-instance-name>`

#### az dt rbac list-assignments

Uses:

* List existing role assignments of an Azure Digital Twins instance

  `az dt rbac list-assignments -n <Azure-Digital-Twins-instance-name>`

#### az dt rbac remove-role

Uses:

* Remove an existing role assignment from an Azure Digital Twins instance

  `az dt rbac remove-role --assignee '<remove-user-email>' -n <Azure-Digital-Twins-instance-name>`

## Next steps

See how to manage an Azure Digital Twins instance using APIs:
* [How-to: Use the Azure Digital Twins APIs and SDKs](how-to-use-apis-sdks.md)
