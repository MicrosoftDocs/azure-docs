---
title: Understand custom Akri connector development with Rust
description: Understand how a custom Akri connector for Azure IoT Operations works in Rust, using the runnable base connector sample to explain each responsibility.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-akri
ms.topic: concept-article
ms.date: 09/15/2026
ai-usage: ai-assisted
#CustomerIntent: As a Rust developer, I want to understand how a custom Akri connector works so that I can design my own connector for Azure IoT Operations.
---

# Understand custom Akri connector development with Rust

Akri connectors enable Azure IoT Operations to connect to and communicate with edge devices and assets. They act as protocol adapters that translate between device-specific communication protocols and the standardized Azure IoT Operations data model. The Azure IoT Operations SDKs repository includes a runnable base connector sample that demonstrates how a connector handles the [device inbound endpoint](../discover-manage-assets/concept-assets-devices.md#inbound-endpoints) and asset lifecycle.

This article explains the connector programming model through the runnable `base_connector_sample.rs` example in the [Azure/iot-operations-sdks](https://github.com/Azure/iot-operations-sdks) repository. The sample is a teaching example: it logs the device and asset information it receives and forwards fabricated sample data, whereas a real connector connects to devices and runs the operations that assets define. Use this article to build a mental model of what a connector does, what the sample deliberately leaves out, and which behaviors need a deployed environment.

If you're new to Akri connectors, start with [Develop custom connectors](overview-akri-connectors.md). For the device and asset model, see [What are Akri services?](../discover-manage-assets/overview-akri.md).

> [!NOTE]
> To follow along, open the pinned [`base_connector_sample.rs`](https://github.com/Azure/iot-operations-sdks/blob/rust/connector/v2.1.1/rust/azure_iot_operations_connector/examples/base_connector_sample.rs) file in GitHub, or clone the repository and open the file in a code editor. Keep the sample open as the following sections describe its structure and behavior.

## The runnable sample and its baseline

This article anchors every claim and code excerpt on the base connector sample at a single stable release, so the described behavior is consistent and reproducible:

| Component | Version |
|---|---|
| Connector | 2.1.1 |
| Services | 1.3 |
| Protocol | 1.0 |
| MQTT | 1.1 |

The baseline is the `rust/connector/v2.1.1` tag at commit `5d06dee92422cdd7cfc0b087aa5221e33034a67a`, and the example is [`base_connector_sample.rs`](https://github.com/Azure/iot-operations-sdks/blob/rust/connector/v2.1.1/rust/azure_iot_operations_connector/examples/base_connector_sample.rs). The connector crate targets Rust edition 2024 and requires Rust 1.88 or later.

The sample builds on the following crates. Use the sample's `Cargo.toml` at the pinned tag as the source of truth for exact dependency declarations:

| Crate | Role |
|---|---|
| `azure_iot_operations_connector` | Provides `BaseConnector`, the inbound endpoint and asset lifecycle clients, data operation clients, the `derived_json` schema helper, the readiness probe, the management action executor, and health reporting. |
| `azure_iot_operations_protocol` | Provides the application context that initializes the connector. |
| `azure_iot_operations_services` | Provides the Azure Device Registry models that the discovery client uses. |

> [!NOTE]
> Later SDK builds declare a preview connector release, `2.2.0-beta1`, with newer services, protocol, and MQTT versions. Don't rely on preview-only APIs or behavior when you target the stable 2.1.1 release. Use the sample at the pinned tag as your reference.

> [!IMPORTANT]
> The base connector sample is for illustration only and isn't a production connector. A production-quality connector must implement the requirements in the [Akri operator and connector contract](https://github.com/Azure/iot-operations-sdks/blob/main/doc/akri_connector/Akri%20operator%20and%20connector%20contract.md) document in the SDKs repository.

## Connector initialization

At startup, the sample assembles the objects that `BaseConnector` needs, then runs the connector session concurrently with its own resource-handling and discovery work:

```rust
// Create the connector artifacts from the deployment
let connector_artifacts = ConnectorArtifacts::new_from_deployment()?;

// Create an ApplicationContext
let application_context = ApplicationContextBuilder::default().build()?;

// Create options for the base connector
let base_connector_options = base_connector::OptionsBuilder::default()
    .readiness_probe(Box::new(exec_readiness_probe))
    .build()?;

// Create the BaseConnector
let base_connector = BaseConnector::new(
    application_context,
    connector_artifacts,
    base_connector_options,
)?;

// Create a device endpoint client creation observation
let device_creation_observation =
    base_connector.create_device_endpoint_client_create_observation()?;

// Create a discovery client
let adr_discovery_client = base_connector.discovery_client();
```

Each step maps to a connector responsibility:

- `ConnectorArtifacts::new_from_deployment` reads the deployment-supplied artifacts that identify and configure the connector.
- `ApplicationContextBuilder` builds the protocol application context that `BaseConnector` uses.
- A readiness probe signals whether the connector's MQTT session is connected to the Azure IoT Operations local MQTT broker. The sample uses an exec readiness probe and answers probe requests before it initializes.
- `BaseConnector::new` constructs the connector from the application context, the artifacts, and the options.
- The inbound endpoint creation observation is how the connector learns about new inbound endpoints.
- The discovery client lets the connector report devices that it discovers.

The sample then runs its device-handling loop and a discovery task concurrently with `base_connector.run()`, so the connector session and your resource handling make progress together. Keep this handling nonblocking so that the connector continues to receive lifecycle notifications while it processes data.

Because `ConnectorArtifacts::new_from_deployment` reads artifacts that the platform supplies, the built binary can't run outside a deployment. When you run it without those artifacts, it stops at `DeploymentArtifactError(EnvVarMissing("AZURE_EXTENSION_RESOURCEID"))`. End-to-end behavior requires Azure IoT Operations deployment artifacts and services, including the MQTT broker and Azure Device Registry.

## Device inbound endpoint and asset lifecycle notifications

`BaseConnector` owns the inbound endpoint and asset lifecycle. When Azure IoT Operations creates, updates, or deletes an inbound endpoint or an asset, `BaseConnector` surfaces that change as a notification. The sample spawns an independent handler for each inbound endpoint and each asset, so the connector processes many resources concurrently and never blocks the notification stream.

For an inbound endpoint, the handler reports device and inbound endpoint status, reports an initial health event, and then loops on notifications. An `Updated` notification revalidates configuration and refreshes status and health, a `Deleted` notification ends the handler, and a `Created` notification starts a handler for the new asset.

For an asset, the handler reports asset status and then routes each component that the asset creates to the handler that owns that component's lifecycle. The following excerpt shows how the sample routes a created data operation:

```rust
ClientNotification::Created(AssetComponentClient::DataOperation((
    data_operation_client,
    initial_status,
))) => {
    let data_operation_log_identifier = format!(
        "{asset_log_identifier}[{}]",
        data_operation_client
            .data_operation_ref()
            .data_operation_name
    );
    log::info!(
        "{data_operation_log_identifier} Data Operation Created: {data_operation_client:?}"
    );
    if let DataOperationKind::Dataset = data_operation_client.kind() {
        tokio::task::spawn(run_dataset(
            data_operation_log_identifier,
            data_operation_client,
            initial_status,
        ));
    } else {
        tokio::task::spawn(handle_unsupported_component(
            data_operation_log_identifier,
            format!("{:?}", data_operation_client.kind()),
            data_operation_client,
        ));
    }
}
```

This routing is the core of the sample's data-operation model: it handles the `Dataset` kind and treats every other data-operation kind as unsupported. In this SDK release, the other data-operation kinds are `Event` and `Stream`, which the sample routes to the unsupported-component handler. The sample handles a created management action in a separate branch that starts a management action handler.

## Configuration status

The connector reports configuration status for inbound endpoints, assets, and data operations so that Azure IoT Operations knows whether each resource is valid. The sample validates a resource's configuration and returns either success or a configuration error. For example, it accepts an asset only when the manufacturer is one it supports:

```rust
fn generate_asset_status(asset_client: &AssetClient) -> Result<(), AdrConfigError> {
    match asset_client.specification().manufacturer.as_deref() {
        Some("Contoso") | None => Ok(()),
        Some(m) => {
            log::warn!(
                "Asset '{}' not accepted. Manufacturer '{m}' not supported.",
                asset_client.asset_ref().name
            );
            Err(AdrConfigError {
                message: Some("asset manufacturer type is not supported".to_string()),
                ..Default::default()
            })
        }
    }
}
```

The sample validates an inbound endpoint the same way, accepting only the endpoint types it supports and returning an Azure Device Registry configuration error otherwise. It reports status through a "report if changed" pattern that reports status the first time and when a resource changes from valid to invalid, rather than on every notification. An invalid configuration prevents data operations from running until a later update makes the resource valid again.

## Runtime health

Alongside configuration status, the connector reports runtime health so that operators can see whether a resource is working. The sample reports health events with `RuntimeHealthEvent`, using `Available` when an operation succeeds and `Unavailable` with a message and a reason code when it fails. When a resource definition changes, the sample pauses reporting and refreshes the health version before it reports health against the new definition, so health reflects the current configuration.

## Datasets

A dataset is the data-operation kind that the sample handles. Its dataset handler reports the initial status, then runs a single biased `tokio::select!` loop that gives configuration notifications priority over data acquisition. On each notification, it updates validity and status. On a sampling timer, and only while the dataset is valid, it acquires data, reports a schema, and forwards the data.

> [!NOTE]
> This sample uses a sampling timer, but a connector doesn't have to. You can implement other data acquisition strategies as needed for your specific device and protocol.

The sample doesn't read from a real device. It calls `mock_received_data` to produce fabricated payloads on a timer, which lets you exercise the schema and forwarding paths without device connectivity. In your own connector, you replace this step with your protocol logic.

## Schema reporting

Before a connector forwards data, it registers a message schema so that receiving components can interpret the payload. The sample derives a schema from the data with `derived_json::create_schema`, then reports it with `report_message_schema_if_modified`. The callback compares the current schema and reference against locally cached values and reports a schema only when it's new or changed, which avoids redundant reports. For more information about the schema registry, see [Understand message schemas](../connect-to-cloud/concept-schema-registry.md).

> [!NOTE]
> This sample derives  the schema from the message. Your connector can implement a different strategy for schema generation or retrieval if needed.

## Data forwarding

The connector forwards each payload to Azure IoT Operations by using `forward_data` on the data operation client. Because the client corresponds to the specific data operation, the platform routes the forwarded data to the destination that the dataset configuration defines. The sample reports a health event after each attempt:

```rust
match data_operation_client.forward_data(sample_data).await {
    Ok(()) => {
        log::info!(
            "{log_identifier} data {count} forwarded"
        );
        count += 1;
        data_operation_reporter.report_health_event(RuntimeHealthEvent::Available);
    }
    Err(e) => {
        log::error!("{log_identifier} error forwarding data: {e}");
        data_operation_reporter.report_health_event(RuntimeHealthEvent::Unavailable {
            message: Some(format!("Failed to forward data to broker: {e}")),
            reason_code: Some("SampleConnectorDataForwardFailed".to_string()),
        });
    },
}
```

## Management actions

A management action is a request-and-response operation that Azure IoT Operations sends to a device or asset through the connector, such as a write, read, or call. When an asset creates a management action component, the sample starts a handler that processes update notifications and incoming requests without blocking either one. A simple strategy for the handler is to track the current executor and, when the platform sends an updated definition with a new executor, drain any requests queued against the previous executor with an error before adopting the new executor.

The sample completes each request with a response, but it doesn't perform real device work. It builds a placeholder response: a success response when the action is valid, or a structured application error when it isn't:

```rust
let response = if management_action_valid {
    // Here we would execute the management action request
    // For this example, we simply log it and respond that it succeeded
    ManagementActionResponseBuilder::default()
        .payload(vec![])
        .content_type("application/json".to_string())
        .cloud_event(None)
        .build().unwrap()
} else {
    // If the management action is not valid, we respond with an application error
    ManagementActionResponseBuilder::default()
        .application_error(ManagementActionApplicationError {
            application_error_code: "ManagementActionInvalidState".to_string(),
            application_error_payload: "The management action is in an invalid state and cannot process requests.".to_string(),
        })
        .payload(vec![])
        .content_type("application/json".to_string())
        .cloud_event(None)
        .build().unwrap()
};
```

> [!IMPORTANT]
> The connector should always respond, even if it can't execute so that it doesn't leave the invoker waiting through the entire timeout to learn that a success response isn't coming back.

The `cloud_event` field on the response carries an optional *CloudEvent*, which the sample leaves empty. In your own connector, you replace the placeholder with the code that runs the requested action against the device.

## What the sample demonstrates, omits, and requires
- **It handles datasets and management actions only.** The sample routes every non-dataset data operation to an unsupported-component handler that reports a configuration error. It has no event data-operation path. The word `event` in the sample refers to runtime health events and to the optional *CloudEvent* field on a management action response, not to a data operation that forwards events.
Use the base connector sample to understand the shape of a connector, but be aware of its boundaries:

- **It requires a deployed environment to run.** The connector reads deployment artifacts at startup and connects to Azure IoT Operations services. Without them, it stops at the missing `AZURE_EXTENSION_RESOURCEID` artifact.
- **It handles datasets only.** The sample routes every non-dataset data operation to an unsupported-component handler that reports a configuration error. It has no event data-operation path. The word "event" in the sample refers to runtime health events and to the optional *CloudEvent* field on a management action response, not to a data operation that forwards events.
- **Its data and discovery are fabricated.** The sample forwards mock data on a timer and registers a hard-coded discovered device. These stand in for the protocol and discovery logic that you provide.
- **Its management actions are placeholders.** The sample logs a request and returns a success or error response without acting on the device.

A production connector needs more than this teaching example shows, including readiness propagation, device and asset enablement checks, configuration validation, robust error handling and retry, secure credential handling, and real implementations of sampling, actions, and discovery. The [production scaffold](https://github.com/Azure/iot-operations-sdks/tree/rust/connector/v2.1.1/rust/sample_applications/sample_connector_scaffolding) provides a starting point for this additional work.

## Start from the production scaffold

When you move from learning to building, start your connector from the [production scaffold](https://github.com/Azure/iot-operations-sdks/tree/rust/connector/v2.1.1/rust/sample_applications/sample_connector_scaffolding) (`sample_connector_scaffolding`) rather than from the base sample. The base sample keeps its lifecycle deliberately simple so that each responsibility is easy to read. The scaffold targets the same stable connector release, but it's structured for production work: it wires up the readiness, enablement, and status behavior that a connector needs before you add protocol code, and it marks the code you must supply. It isn't a finished connector, so treat it as a stronger starting point rather than a drop-in solution.

The scaffold follows the same programming model that this article describes, and it adds several concerns that the base sample leaves out:

- **Readiness propagation.** The device handler owns a Tokio `watch` channel that tracks whether the [device inbound endpoint](../discover-manage-assets/concept-assets-devices.md#inbound-endpoints) is connected and ready. The asset handler passes the receiver to each dataset and management action handler, so a change in inbound endpoint readiness reaches every component that depends on it. The base sample doesn't propagate readiness this way.
- **Device and asset enablement.** Before it connects or samples, the scaffold checks the `enabled` flag on the inbound endpoint specification and on the asset specification. A disabled resource isn't a configuration error, so the scaffold marks the component as not ready and waits for an update instead of reporting a fault.
- **Dataset sampling gates.** The dataset handler acquires data only when its configuration is valid, its asset is enabled, and its inbound endpoint is ready. A biased `tokio::select!` loop gives configuration and readiness updates priority over the sampling timer, so the connector never samples against a stale or disabled definition.
- **Management action readiness and execution.** The management action handler combines the same signals into a single ready state. When the action isn't ready, it answers requests with an application error instead of running them, and it pauses health reporting until the action is ready again. When the action is ready, it dispatches on the action type: it handles `Read` and `Write` through a placeholder execution function and rejects `Call` as unsupported, which shows where to add real device work for each type. Like the base sample, it also drains requests that were queued against a previous executor when the definition changes.
- **Explicit customization points.** The scaffold marks every place you must supply connector-specific code with an `IMPLEMENT` comment and flags design decisions with `NOTE` comments. These points cover endpoint-type validation, connection logic, specification validation, sampling, action execution, and message schema reporting.

> [!IMPORTANT]
> The scaffold isn't production-ready as it stands. Its sampling and action-execution functions return mock data, and its `IMPLEMENT` comments mark code that you must write. Replace every mock and complete every `IMPLEMENT` point with your own protocol, validation, and error handling before you deploy.

### Production considerations

As you turn the scaffold into a connector, plan for the concerns that a production connector must handle. Treat each one as a design decision, and reuse the shared procedures in the next section rather than duplicating them:

- **Protocol isolation.** Confine device-specific protocol code to the sampling and action-execution functions so that lifecycle handling stays independent of any single protocol.
- **Reacting to configuration changes.** Revalidate a resource on every update notification and refresh health against the new definition, as the scaffold does when it calls `pause_and_refresh_health_version`.
- **Health and status reporting.** Report a configuration error only when a definition change is the sole way to fix the problem, and report transient problems, such as a connection timeout, as runtime health events. The scaffold's module documentation describes this split.
- **Schema management.** Report request and response message schemas when the definitions are known, and re-report them after any definition update. For more information, see [Understand message schemas](../connect-to-cloud/concept-schema-registry.md).
- **Error handling and retry.** Map device and protocol failures to clear reason codes, and decide which failures to retry, which to surface as health events, and which to report as configuration errors.
- **Testing, packaging, and deployment.** Build the connector image, publish it with its metadata, and test it against a deployed instance by using the shared procedures in the next section.

All custom connectors share the environment setup, image build and debug, connector metadata, registry configuration, and deployment testing tasks:

- Use the VS Code extension to scaffold a connector project, build its image, and test and debug it with a local development runtime. For more information, see [Build Akri connectors in VS Code](howto-build-akri-connectors-vscode.md).

All custom connectors share the environment setup, image build and debug, connector metadata, registry configuration, and deployment testing tasks:

- Use the VS Code extension to scaffold a connector project, build its image, and test and debug it with a local development runtime. For more information, see [Build Akri connectors in VS Code](howto-build-akri-connectors-vscode.md).
- To author `connector-metadata.json`, publish the connector image and metadata to a container registry, create a connector template instance, and test the connector with a device and asset, see [Build and deploy custom Akri connectors](howto-develop-akri-connectors.md).
- To configure a container registry endpoint on your Azure IoT Operations instance, see [Configure registry endpoints](howto-configure-registry-endpoint.md).

To deploy and test a connector, you need a deployed Azure IoT Operations instance:

[!INCLUDE [prereq-deployed-instance](../includes/prereq-deployed-instance.md)]

## Related content

- [Develop custom connectors](overview-akri-connectors.md)
- [Build and deploy custom Akri connectors](howto-develop-akri-connectors.md)
- [Build Akri connectors in VS Code](howto-build-akri-connectors-vscode.md)
- [What are Akri services?](../discover-manage-assets/overview-akri.md)
- [Understand message schemas](../connect-to-cloud/concept-schema-registry.md)
- [Akri operator and connector contract](https://github.com/Azure/iot-operations-sdks/blob/main/doc/akri_connector/Akri%20operator%20and%20connector%20contract.md)
