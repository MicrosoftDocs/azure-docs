---
title: Connect to MSMQ from Standard Workflows
description: Send and receive Microsoft Message Queuing (MSMQ) messages from Standard workflows in Azure Logic Apps by using the built-in connector and MSMQ Broker.
author: shmv
ms.author: shmv
services: azure-logic-apps
ms.suite: integration
ms.topic: how-to
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 11/01/2026
# Customer intent: As an automation and integration developer, I want to connect Standard workflows to existing MSMQ queues so that I can modernize integration workloads without replacing MSMQ-dependent applications.
---

# Connect to Microsoft Message Queuing from Standard workflows in Azure Logic Apps

**Applies to: Azure Logic Apps (Standard)**

When your workflows need to work with Microsoft Message Queuing (MSMQ), use the **MSMQ** built-in connector in Azure Logic Apps Standard. The connector is available in public preview and lets you send messages to existing MSMQ queues or start a workflow when a message becomes available.

The connector helps you perform common messaging and integration tasks, such as:

- Send messages from a workflow to an MSMQ-based application.
- Process incoming MSMQ messages in a Standard workflow.
- Use transactional queues, dead-letter handling, and ordered processing.
- Migrate BizTalk Server orchestration and integration logic while retaining MSMQ-dependent applications.

For new applications where changing the messaging technology is practical, consider [Azure Service Bus](connectors-create-api-servicebus.md). For existing applications with MSMQ dependencies, this connector provides a bridge for incremental modernization.

## How the connector works

MSMQ is a Windows technology and can't run directly inside the Azure Logic Apps runtime. The connector communicates with a lightweight **MSMQ Broker service** that runs alongside MSMQ in a customer-managed Windows environment. The broker exposes connector operations and interacts locally with MSMQ.

For send scenarios, messages follow this path:

```text
Logic Apps Standard -> private network -> MSMQ Broker -> MSMQ queue
```

For receive scenarios, the broker monitors the queue and invokes the workflow callback:

```text
MSMQ queue -> MSMQ Broker -> Logic Apps callback -> workflow
```

You're responsible for maintaining the Windows environment that hosts the broker, including Windows maintenance, MSMQ configuration, queue management, networking, and security.

## Connector technical reference

| Logic app | Connector version | Requirements |
| --- | --- | --- |
| **Standard** | Built-in connector (public preview), which appears in the connector gallery under the **Built-in** filter. | A customer-managed Windows environment running MSMQ and the MSMQ Broker, with private network connectivity from the Standard logic app to the broker. |

### Built-in connector operations (preview)

The connector provides the following action and trigger:

| Name | Operation type | Description |
| --- | --- | --- |
| **Send message to MSMQ** | Action | Enqueues a message in an MSMQ queue. Supports a message body, an optional label, transactional settings, and dead-letter options. |
| **When a message is available in an MSMQ queue** | Trigger | Subscribes to a local private queue on the broker machine and starts a workflow when a message becomes available. Messages are processed individually, with at-least-once delivery. |

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- A Standard logic app resource and workflow. For more information, see [Create Standard workflows in Azure Logic Apps](../logic-apps/create-single-tenant-workflows-azure-portal.md).

- A Windows environment capable of running MSMQ and the MSMQ Broker service. You can use Windows Server 2019 or later for the broker environment.

- Administrative access to the Windows environment to install the broker.

- The MSMQ Broker installation script, [`Install-MsmqEnvironmentService.ps1`](https://github.com/Azure/logicapps/blob/master/scripts/MSMQ%20Broker/Install-MsmqEnvironmentService.ps1).

- MSMQ enabled on the Windows environment and one or more queues created for your application. The broker installer can install the required MSMQ Windows features. Create the queue before configuring the workflow.

- Private network connectivity between the Standard logic app and the MSMQ Broker, including a dedicated subnet for Logic Apps virtual network integration.

- Network security group (NSG), routing, DNS, Windows Firewall, and any corporate firewall rules that permit the required traffic.

For an Azure-hosted broker, use a private Windows virtual machine (VM) without publicly exposed administrative ports. Connect through Azure Bastion, VPN, or another private management path instead of exposing Remote Desktop Protocol (RDP) directly to the internet.

## Known issues and limitations

The public preview has the following limitations and considerations:

| Area | Limitation or consideration |
| --- | --- |
| Receive queues | The subscribed queue must be a local private queue on the machine running the MSMQ Broker. |
| Queue ownership | Use one workflow per receive queue. A second workflow attempting to subscribe to an already owned queue can be rejected. Avoid other competing MSMQ consumers because they might remove a message before the broker finishes processing it. |
| Delivery | Receive scenarios provide at-least-once delivery. Design workflows to be idempotent and handle possible duplicate delivery. |
| Batching | The receive trigger processes messages individually, not in batches. |
| Configuration changes | Changes to trigger configuration, connection details, or workflow callback information can require a logic app restart to register the updated broker subscription. |
| Message size | The MSMQ path is subject to the underlying MSMQ limit of approximately 4 MB, including messaging overhead. For larger payloads, consider storing the payload externally and sending a reference in the message. |
| Ordered processing | The broker waits for a successful workflow response before processing the next message. Every terminal workflow path must include the required response. Avoid long-running synchronous processing paths. |
| High availability and clusters | The broker must remain local to the active MSMQ resource. If MSMQ fails over but the broker remains on the previous node, failover isn't seamless. Validate the supported topology before using clustered or high-availability deployments for production-critical workloads. |

> [!IMPORTANT]
> The current public-preview security model relies on private network isolation for access to the broker endpoint. Don't expose the broker directly to the public internet. Restrict access to the network ranges that require it, primarily the Logic Apps integration subnet.

## Set up the MSMQ environment

### Prepare the Windows machine

Create or identify the Windows machine that hosts MSMQ and the broker. For an Azure deployment, follow these steps:

1. In the [Azure portal](https://portal.azure.com), create a Windows VM.

1. Place the VM in a virtual network that provides connectivity to your Standard logic app.

1. Under **Networking**, set **Public inbound ports** to **None** where possible, and create or select the virtual network and subnet for the VM.

1. After deployment, note the VM's private IP address or privately resolvable hostname.

1. Connect to the VM through Azure Bastion, VPN, or your organization's private management network.

### Install the MSMQ Broker

1. Download the [MSMQ Broker installation script](https://github.com/Azure/logicapps/blob/master/scripts/MSMQ%20Broker/Install-MsmqEnvironmentService.ps1), and copy `Install-MsmqEnvironmentService.ps1` to the Windows machine.

   
1. Open PowerShell as an administrator, change to the folder that contains the script, and run:

   ```powershell
   .\Install-MsmqEnvironmentService.ps1
   ```

   The installer checks MSMQ prerequisites, installs required MSMQ Windows features and broker runtime components, installs the broker package, and registers the broker as a Windows service. It also configures the required Windows Firewall rule, starts the service, and runs a health check.

   The default broker service port is **5050**.

1. At the end of a successful installation, verify that the installer health check reports the service as healthy.

1. In Windows services, confirm that both MSMQ and the MSMQ Broker service are running.

### Create the MSMQ queue

Create the queue before configuring your workflow:

1. On the Windows machine, open **Computer Management**.

1. Expand **Services and Applications** > **Message Queuing** > **Private Queues**.

1. Right-click **Private Queues**, and select **New** > **Private Queue**.

1. Enter the queue name. If your scenario requires transactions, create the queue as **transactional**.

For receive-trigger scenarios, create the private queue on the same machine that runs the broker.

## Configure private networking

Create a dedicated subnet for Logic Apps virtual network integration. Don't use the subnet that contains the broker VM.

1. In the Azure portal, open your Standard logic app resource.

1. Under **Settings**, select **Networking** > **VNet integration**.

1. Select **Add VNet integration**.

1. Select the virtual network that contains or connects to the broker environment.

1. Select the subnet dedicated to Logic Apps, and save the configuration.

1. Permit traffic from the Logic Apps integration subnet to the broker on its configured port, **5050** by default.

   Review NSGs, route tables, DNS, Windows Firewall, and corporate firewalls along the network path. Restrict inbound broker traffic to the network ranges that require access.

For more information, see [Secure traffic between Standard workflows and virtual networks](../logic-apps/secure-single-tenant-workflow-virtual-network-private-endpoint.md).

### Validate connectivity

Before creating the connector connection, open your logic app's Kudu console and test connectivity to the broker:

```console
tcpping BROKER-PRIVATE-IP 5050
```

Replace `BROKER-PRIVATE-IP` with the broker's private IP address. If you changed the broker port, replace `5050` with that port.

If the test fails, review the checks in [Troubleshoot connection and processing problems](#troubleshoot-connection-and-processing-problems).

## Create an MSMQ connection

1. In the Azure portal, open your Standard logic app resource and workflow in the designer.

1. Follow the generic steps to [add a trigger](../logic-apps/add-trigger-action-workflow.md#add-trigger) or [add an action](../logic-apps/add-trigger-action-workflow.md#add-action). Search for **MSMQ**, and select the built-in operation that you need.

1. In the connection information pane, enter the broker connection settings:

   | Setting | Description | Example |
   | --- | --- | --- |
   | **Server Name** | Private IP address or privately resolvable hostname of the machine running the MSMQ Broker. | `10.0.1.4` |
   | **Port** | Port used by the MSMQ Broker. The default is `5050`. | `5050` |
   | **Queue Name** | MSMQ queue that the workflow uses. For a local private queue, specify the queue name configured on the broker machine. | Your existing private queue name. |

1. Create the connection.

## Add a send action

To send a message, start with a workflow that already has a trigger. You can use any trigger that fits your scenario.

1. In the workflow designer, add the **Send message to MSMQ** action.

1. Select your MSMQ connection, or [create a connection](#create-an-msmq-connection).

1. Enter the message body and, optionally, a message label.

1. Configure transactional and dead-letter options as required.

   The **Is Transactional** value must match the target queue configuration. Enable the option for a transactional queue, and leave it disabled for a nontransactional queue. Configure dead-letter behavior for messages that can't be delivered successfully.

1. Add any other actions that your workflow needs. On the designer toolbar, select **Save**, and run the workflow.

1. In **Run history**, verify that the MSMQ action succeeded.

1. On the Windows machine, open the target MSMQ queue and confirm that the message arrived.

## Add a receive trigger

1. Create a Standard workflow, and open it in the designer.

1. Add the **When a message is available in an MSMQ queue** trigger.

1. Select your MSMQ connection, or [create a connection](#create-an-msmq-connection).

1. Configure the local private queue and the processing and failure behavior for your scenario.

1. Add the actions that process the message, and save the workflow.

When the workflow starts, the trigger creates a subscription with the broker. The broker monitors the queue and invokes the workflow callback when a message becomes available.

### Ordered versus concurrent processing

Choose the processing pattern that matches your application requirements:

| Processing pattern | Behavior |
| --- | --- |
| Ordered processing disabled | The broker can continue processing messages after the Logic Apps runtime accepts the workflow invocation. This behavior supports greater concurrency and throughput. |
| Ordered processing enabled | The broker processes messages sequentially and waits for the current workflow execution to return a successful response before processing the next message. |

When you enable ordered processing, ensure every terminal workflow path includes the required response so that the broker can determine whether processing succeeded. Avoid long-running synchronous processing paths.

### Design for at-least-once delivery

Under some failure and retry conditions, a message can be delivered more than once. Use the MSMQ message ID or a business transaction identifier as an idempotency key to prevent duplicate business operations.

For example, design your workflow to:

1. Receive the message and extract its unique identifier.
1. Check whether the transaction was already processed.
1. If the transaction was processed, safely ignore the duplicate.
1. Otherwise, process the transaction and persist the identifier.

This pattern is especially important for workflows that create orders, post financial transactions, modify inventory, or invoke downstream systems that aren't idempotent.

## Test the complete configuration

Before using the integration for business workloads, validate the complete connection path:

| Area | Validation |
| --- | --- |
| Broker | Confirm that MSMQ and the broker Windows service are running, the broker health endpoint responds successfully, and the required queue exists. Verify that the queue's transactional setting matches the workflow configuration. |
| Network | Confirm that virtual network integration is configured, the logic app can reach the broker on its configured port, NSGs and firewalls allow traffic, and DNS resolves the broker hostname if used. |
| Send | Run a workflow with **Send message to MSMQ** and confirm that the message appears in the expected queue. |
| Receive | Place a test message in the queue. Verify that the broker receives it, the workflow starts and completes successfully, and the message is settled according to the configured processing policy. |

For BizTalk Server modernization, also inventory queue types, transactional usage, message sizes, ordered-delivery requirements, dead-letter behavior, competing consumers, and clustering dependencies before migration.

## Troubleshoot connection and processing problems

When an MSMQ operation fails, review the workflow run history and the broker environment. The following table lists checks for common problems:

| Problem | Checks |
| --- | --- |
| The logic app can't reach the broker. | Verify virtual network integration, NSG rules, user-defined routes, Windows Firewall, corporate firewalls, and DNS resolution. Confirm that the broker service is running and listening on the expected port. |
| The broker installation or health check fails. | Verify MSMQ prerequisites and confirm that both MSMQ and the broker Windows service are running. |
| Sending to a transactional queue fails. | Make sure **Is Transactional** matches the target MSMQ queue configuration. |
| The receive subscription is rejected. | Confirm that the queue is a local private queue on the broker machine and that another workflow doesn't already own the queue. |
| Messages are removed before workflow processing finishes. | Check for competing MSMQ consumers, and avoid other consumers on a queue owned by the trigger. |
| Ordered processing doesn't advance to the next message. | Verify that every terminal workflow path returns the required successful response. Review long-running synchronous processing paths. |
| A changed trigger or connection uses an outdated subscription. | Restart the logic app if necessary to register the subscription with the latest trigger, connection, and callback information. |
| A message is processed more than once. | At-least-once delivery permits duplicates. Use an idempotency key and a persistent record of processed transactions. |

## Related content

- [Built-in connectors for Azure Logic Apps](built-in.md)
- [BizTalk Server migration overview](../logic-apps/biztalk-server-migration-overview.md)
- [Secure traffic between Standard workflows and virtual networks](../logic-apps/secure-single-tenant-workflow-virtual-network-private-endpoint.md)
- [Connect to Azure Service Bus from workflows](connectors-create-api-servicebus.md)
