---
title: About Azure IoT Operations CLI
# titleSuffix: Azure IoT Operations
description: Learn about the Azure IoT Operations CLI.
author: PatAltimore
ms.author: patricka
ms.topic: reference
ms.date: 11/10/2023

#CustomerIntent: As an IT admin or operator, I want to learn about the Azure IoT Operations CLI so that I can manage my IoT deployments.
---

# Azure IoT Operations CLI

The Azure IoT Operations command-line interface (CLI) is a set of commands used to create and manage Azure IoT resources.

Use the `az iot ops --help` for up to date help on the available commands.

## az iot ops init

This command is used for the deployment orchestration of Azure IoT Operations.

> [!IMPORTANT]
> *aziot ops init* requires an active login to Azure to avoid requiring multi-factor authentication for provisioning and configuring Azure services.
>
> Run `az login` and follow the prompts for standard interactive login. Verify the correct subscription is set by running `az account set --subscription '<sub Id>'`.

You can choose what aspects run:

- `--kv-id` **enables** `KeyVault CSI driver` workflows.
- `--mq-insecure` **enables** a listener bound to port 1883 with no authN or authZ. The broker encryptInternalTraffic setting is set to false. **Use for non-production workloads only.**.
- `--no-tls` **disables** TLS workflows.
- `--no-deploy` **disables** Azure IoT Operations service deployment workflows.
- `--no-block` returns immediately after starting the Azure IoT Operations deployment workflow.

### init examples

This example has the minimum input parameters for a complete deployment.

```bash
az iot ops init --cluster <cluster name> -g <resource group> --kv-id <Key Vault resource ID>
```

You can combine other commands. In this example, you create a KeyVault and pass the ID to `init`.

```bash
az iot ops init --cluster <cluster name> -g <resource group> --kv-id $(az keyvault create -n mykeyvault -g myrg -o tsv --query id)
```

You can use an existing app ID and a flag to include a simulated PLC server as part of the deployment. Including the app ID prevents `init` from creating an app registration.

```bash
az iot ops init --cluster <cluster name> -g <resource group> --kv-id <Key Vault resource ID> --sp-app-id <app registration GUID> --simulate-plc
```

To skip deployment and focus only on the Azure Key Vault Container Storage Interface driver and TLS config workflows, use `--no-deploy`. This parameter can be useful when you want to deploy from a different tool such as the Azure portal.

```bash
az iot ops init --cluster <cluster name> -g <resource group> --kv-id <Key Vault resource ID> --sp-app-id <app registration GUID> --no-deploy
```

To only deploy Azure IoT Operations on an existing cluster, omit `--kv-id` and include `--no-tls`.

```bash
az iot ops init --cluster <cluster name> -g <resource group> --no-tls
```

Use `--no-block` to avoid waiting for the deployment to finish before continuing.

```bash
az iot ops init --cluster <cluster name> -g <resource group> --kv-id <Key Vault resource ID> --sp-app-id <app registration GUID> --no-block
```

## az iot ops check

Evaluate IoT Operations service deployment for health, configuration, and usability. Your `kubeconfig` is used to access the cluster.

The following services are supported: `mq`, `dataprocessor`, `lnm` (partial). You can specify a service using `--ops-service <moniker>` where the default moniker is `mq` or Azure IoT MQ.

By default, the command shows a summary view of the selected service. For more detail use `--detail-level [0,1,2]`.

- Detail level `0` is **default** and shows a summary view.
- Detail level `1` is a **detailed view** showing comprehensive information.
- Detail level `2` is **verbose** showing all available information.

You're also able to filter by the *kind* of resources using `--resources`. For example, `--resource broker brokerlistener`.

### check examples

This example uses the minimum parameters and checks `mq` health.

```bash
az iot ops check
```

Use the `--svc` parameter to check the `dataprocessor` health and configuration.

```bash
az iot ops check --svc dataprocessor --detail-level 1.
```

Same as prior example, except the results are restrained to the `pipeline` resource.

```bash
az iot ops check --svc dataprocessor --detail-level 1 --resources pipeline
```

## az iot ops support create-bundle

Creating a support bundle captures the state of your Azure IoT Operations deployment.

For a list of supported service API versions, use `--help`.

The following elements are captured and stored in a compressed `.zip` archive:

- Custom resources
- Kubernetes deployed resources
- Pod logs both current and previous if available.
- Namespace events
- Cluster nodes

`mq` specific elements:

- Raw Prometheus endpoint metrics output.

### create-bundle examples

This example uses the minimum parameters. It auto detects IoT Operations APIs and builds a suitable bundle. The bundle is created in the current working directory.

```bash
az iot ops support create-bundle
```

Constrain data capture on a specific service `opcua` and specify a custom output directory `~/aio`.

```bash
az iot ops support create-bundle --ops-service opcua --bundle-dir ~/aio
```

Constrain data capture on a specific service `mq` and specify a custom log age of `3600` seconds.

```
az iot ops support create-bundle --ops-service mq --log-age 3600
```

## az iot ops mq stats

This command supports the dual purpose of fetching Prometheus metrics as well *otel* traces using the *protobuf API*. It integrates with *dmqtt* diagnostics service.

### mq stats examples

Fetch key performance indicators from the Prometheus metrics endpoint.

```bash
az iot ops mq stats
```

Fetch key performance indicators from the Prometheus metrics endpoint with a dynamic display that refreshes periodically.

```bash
az iot ops mq stats --watch
```

Return the raw output of the metrics endpoint with minimal processing.

```bash
az iot ops mq stats --raw
```

Fetch all available traces. This example produces a `.zip` with both `Otel` and Grafana `tempo` file formats.

```bash
az iot ops mq stats --trace-dir .
```

Fetch specific trace IDs in hex format. In this example, the trace ID is `4e84000155a98627cdac7de46f53055d`. Only the `Otel` format is shown.

```
az iot ops mq stats --trace-ids 4e84000155a98627cdac7de46f53055d
```

## az iot ops mq get-password-hash

Generates a *PBKDF2* hash of a passphrase applying *PBKDF2-HMAC-SHA512*. A 128-bit salt is used from `os.urandom`.

You can choose the following parameter options:

- `--phrase` or `-p`: The passphrase to hash.
- `--iterations` or `-i`: Hash iterations. The default is `210000`.

### mq get-password-hash examples

Generate a hash of the passphrase `mypassphrase` with the default number of iterations.

```bash
az iot ops mq get-password-hash -p mypassphrase
```

## az iot ops asset

In Azure IoT Operations, a key task is to manage the assets that are part of your solution.

An asset in Azure IoT Operations is a logical entity called an asset instance that you create to represent a real asset. An Azure IoT Operations asset can emit telemetry, and can have properties (writable data points), and commands (executable data points) that describe its behavior and characteristics.

### az iot ops asset create

Create an asset associated to the cluster via custom location.

```bash
az iot ops asset create --name {asset_name} -g {resource_group} --custom-location {custom_location} --endpoint {endpoint} --data data_source={data_source}
```

Create an asset by cluster name. In this form, the asset can be created in different resource group compared to the cluster.

```bash
az iot ops asset create --name {asset_name} -g {resource_group} --cluster {cluster} --cluster-resource-group {cluster_resource_group} --endpoint {endpoint} --event event_notifier={event_notifier}
```

### az iot ops asset query

Query assets using Azure Resource Graph.

```bash
az iot ops asset query
```

### az iot ops asset list

List subscription assets.

```bash
az iot ops asset list
```

### az iot ops asset show

Show a specific asset.

```bash
az iot ops asset show --name {asset_name} -g {resource_group}
```

### az iot ops asset delete

Delete an asset.

```bash
az iot ops asset delete --name {asset_name} -g {resource_group}
```

### az iot ops asset data-point add

Add an asset data point.

```bash
az iot ops asset data-point add --name {datapoint_name} --asset {asset_name} -g {resource_group} --data-source {data_source} --capability-id {capability_id} --observability-mode {observability_mode} --queue-size {queue_size} --sampling-interval {sampling_interval}
```

### az iot ops asset event add

Add an asset event.

```bash
az iot ops asset event add --name {event_name} --asset {asset_name} -g {resource_group} --event-notifier {event_notifier} --capability-id {capability_id} --observability-mode {observability_mode} --queue-size {queue_size} --sampling-interval {sampling_interval}
```
