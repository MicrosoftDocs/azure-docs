---
title: Hybrid connections in Azure App Service
description: Learn how to create and use hybrid connections in Azure App Service to access resources in disparate networks. 
author: seligj95
ms.assetid: 66774bde-13f5-45d0-9a70-4e9536a4f619
ms.topic: article
ms.date: 06/04/2025
ms.update-cycle: 1095-days
ms.author: jordanselig
ms.custom:
  - "UpdateFrequency3, fasttrack-edit"
  - build-2025
#customer intent: As an app developer, I want to understand the usage of Hybrid Connections to provide access to apps in Azure App Service.
---

# Azure App Service Hybrid Connections

Hybrid Connections is both a service in Azure and a feature in Azure App Service. As a service, it has uses and capabilities beyond the ones that are used in App Service. To learn more about Hybrid Connections and their usage outside App Service, see [Azure Relay Hybrid Connections][HCService].

Within App Service, Hybrid Connections can be used to access application resources in any network that can make outbound calls to Azure over port 443. Hybrid Connections provides access from your app to a TCP endpoint. It doesn't enable a new way to access your app. As used in App Service, each Hybrid Connection correlates to a single TCP host and port combination.

This feature enables your apps to access resources on any operating system, provided it's a TCP endpoint. The Hybrid Connections feature doesn't know or care what the application protocol is, or what you are accessing. It simply provides network access.

## How it works

Hybrid Connections requires a relay agent to be deployed where it can reach both the desired endpoint and Azure. The relay agent, Hybrid Connection Manager (HCM), calls out to Azure Relay over port 443. From the web app site, the App Service infrastructure also connects to Azure Relay on your application's behalf. Through the joined connections, your app is able to access the desired endpoint. The connection uses TLS 1.2 for security and shared access signature (SAS) keys for authentication and authorization.

:::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-connection-diagram.png" alt-text="Diagram of Hybrid Connection high-level flow." border="false":::

When your app makes a DNS request that matches a configured Hybrid Connection endpoint, the outbound TCP traffic is redirected through the Hybrid Connection.

> [!NOTE]
> This fact means that you should try to always use a DNS name for your Hybrid Connection. Some client software doesn't do a DNS lookup if the endpoint uses an IP address instead.

### App Service Hybrid Connection benefits

There are many benefits to the Hybrid Connections capability, including:

- Apps can access on-premises systems and services securely.
- The feature doesn't require an internet-accessible endpoint.
- It's quick and easy to set up. No gateways required.
- Each Hybrid Connection matches to a single host:port combination, which is helpful for security.
- It normally doesn't require firewall holes. The connections are all outbound over standard web ports.
- Because the feature is network level, it's agnostic to the language that your app uses and the technology that the endpoint uses.
- It can be used to provide access in multiple networks from a single app.
- Supported in GA for Windows apps and Linux apps. Hybrid Connections isn't supported for Windows custom containers.

### Things you can't do with Hybrid Connections

Things you can't do with Hybrid Connections include:

- Mount a drive.
- Use UDP.
- Access TCP-based services that use dynamic ports, such as FTP Passive Mode or Extended Passive Mode.
- Support LDAP, because it can require UDP.
- Support Active Directory, because you can't domain join an App Service worker.

## Add and Create Hybrid Connections in your app

To create a Hybrid Connection in the Azure portal:

1. In the [Azure portal], select your app. Select **Settings** > **Networking**.
1. Next to **Hybrid connections**, select the **Not configured** link. Here you can see the Hybrid Connections that are configured for your app.

    :::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-portal.png" alt-text="Screenshot of Hybrid Connection list where you can add and manage connections.":::

1. To add a new Hybrid Connection, select **Add hybrid connection**. You see a list of the Hybrid Connections that you already created. To add one or more of them to your app, select the ones you want, and then select **Add selected Hybrid Connection**.

    :::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-add-hybrid-connection.png" alt-text="Screenshot of Hybrid Connection page where you can add a connection.":::

If you want to create a new Hybrid Connection, select **Create new hybrid connection**. Specify the following values:

- Hybrid Connection name.
- Endpoint hostname.
- Endpoint port.
- Service Bus namespace you want to use.

:::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-create-hybrid-connection.png" alt-text="Screenshot of Create new hybrid connection dialog box.":::

Every Hybrid Connection is tied to a Service Bus namespace. Each Service Bus namespace is in an Azure region. To avoid network induced latency, use a Service Bus namespace in the same region as your app.

If you want to remove your Hybrid Connection from your app, right-click it and select **Disconnect**.

When a Hybrid Connection is added to your app, you can see details on it simply by selecting it.

:::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-properties.png" alt-text="Screenshot of Hybrid connections details.":::

### Create a Hybrid Connection in ARM/Bicep

To create a Hybrid Connection using an ARM/Bicep template, add the following resource to your existing template. You must include the `userMetadata` to have a valid Hybrid Connection. If you don't include the `userMetadata`, the Hybrid Connection doesn't work. If you create the Hybrid Connection in the Azure portal, this property is automatically filled in for you.

The `userMetadata` property should be a string representation of a JSON array in the format `[{/"key/": /"endpoint/", /"value/" : /"<HOST>:<PORT>/"}]`. For more information, see [Microsoft.Relay namespaces/hybridConnections](/azure/templates/microsoft.relay/namespaces/hybridconnections).

```bicep
resource hybridConnection 'Microsoft.Relay/namespaces/hybridConnections@2024-01-01' = {
  parent: relayNamespace
  name: hybridConnectionName
  properties: {
    requiresClientAuthorization: true
    userMetadata: '[{/"key/": /"endpoint/", /"value/" : /"<HOST>:<PORT>/"}]'
  }
}
```

### Create a Hybrid Connection in the Azure Relay portal

In addition to the portal experience from within your app, you can create Hybrid Connections from within the Azure Relay portal. For a Hybrid Connection to be used by App Service, it must:

- Require client authorization.
- Have a metadata item and named endpoint that contains a host:port combination as the value.

## Hybrid Connections and App Service plans

App Service Hybrid Connections are only available in Basic, Standard, Premium, and Isolated pricing SKUs. Hybrid Connections aren't available for function apps in Consumption plans. There are limits tied to the pricing plan.

| Pricing plan | Number of Hybrid Connections usable in the plan |
|:----|:----|
| Basic | 5 per plan |
| Standard | 25 per plan |
| Premium (v1-v3) | 220 per app |
| IsolatedV2 | 220 per app |

The App Service plan UI shows you how many Hybrid Connections are being used and by what apps.

:::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-app-service-plan-properties.png" alt-text="Screenshot of App Service plan properties.":::

To see details, select the Hybrid Connection. You can see all the information that you saw at the app view. You can also see how many other apps in the same plan are using that Hybrid Connection.

There's a limit on the number of Hybrid Connection endpoints that can be used in an App Service plan. Each Hybrid Connection used can be used across any number of apps in that plan. For example, a single Hybrid Connection that is used in five separate apps in an App Service plan counts as one Hybrid Connection.

### Pricing

In addition to there being an App Service plan SKU requirement, there's an extra cost to using Hybrid Connections. There's a charge for each listener that a Hybrid Connection uses. The listener is the Hybrid Connection Manager. If you had five Hybrid Connections supported by two Hybrid Connection Managers that would be 10 listeners. For more information, see [Service Bus pricing][sbpricing].

## Hybrid Connection Manager

The Hybrid Connections feature requires a relay agent in the network that hosts your Hybrid Connection endpoint. That relay agent is called the Hybrid Connection Manager (HCM). To download the Hybrid Connection Manager, follow the instructions for your client.

This tool runs on both Windows and Linux. On Windows, the Hybrid Connection Manager requires Windows Server 2012 and later. The Hybrid Connection Manager runs as a service and connects outbound to Azure Relay on port 443.

### Installation instructions

# [Windows](#tab/windows)

To install the Hybrid Connection Manager on Windows, download the MSI package and follow the installation instructions.

> [!div class="nextstepaction"]
> [Windows download](https://download.microsoft.com/download/HybridConnectionManager-Windows.msi)

> [!NOTE]
> Azure Relay relies on Web Sockets for connectivity. This capability is only available on Windows Server 2012 or later. Because of this requirement, the Hybrid Connection Manager isn't supported on systems earlier than Windows Server 2012.

# [Linux](#tab/linux)

To install the Hybrid Connection Manager on Linux, from your terminal running as administrator:

```bash
sudo apt update
sudo apt install tar gzip build-essential
sudo wget "https://download.microsoft.com/download/HybridConnectionManager-Linux.tar.gz"
sudo tar -xf HybridConnectionManager-Linux.tar.gz
cd HybridConnectionManager/
sudo chmod 755 setup.sh
sudo ./setup.sh
```

-----

To support the Hybrid Connections it's configured with, the Hybrid Connection Manager requires:

- TCP access to Azure over port 443.
- TCP access to the Hybrid Connection endpoint.
- The ability to do DNS look-ups on the endpoint host and the Service Bus namespace. In other words, the hostname in the Azure relay connection should be resolvable from the machine that hosts the Hybrid Connection Manager.

### Getting started with the Hybrid Connection Manager GUI

# [Windows](#tab/windows)

After you install the Hybrid Connection Manager, on Windows, search for *Hybrid Connection Manager GUI* in your search box. 

:::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-hcm.png" alt-text="Screenshot of Hybrid Connection Manager.":::

When you start the Hybrid Connection Manager GUI, the first thing you see is a table that lists all the Hybrid Connections that are configured with this instance of the Hybrid Connection Manager.

To add one or more Hybrid Connections to your Hybrid Connection Manager GUI:

1. Start the Hybrid Connection Manager GUI.
1. Select **+ New**.
1. Select **Select with Azure**.
1. Sign in with your Azure account to get your Hybrid Connections available with your subscriptions. The Hybrid Connection Manager doesn't continue to use your Azure account beyond this step.
1. Choose a subscription.
1. Select the Hybrid Connections that you want the Hybrid Connection Manager to relay.
1. Select **Create**.

You can now see the Hybrid Connections you added.

:::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-hcm-added.png" alt-text="Screenshot of the Hybrid Connection added to the Hybrid Connection Manager.":::

You can also select the configured Hybrid Connection to see details.

:::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-hcm-details.png" alt-text="Screenshot of Hybrid Connection Details.":::

# [Linux](#tab/linux)

The Hybrid Connection Manager GUI isn't supported on Linux. To use the Hybrid Connection Manager on Linux, see [Getting started with the Hybrid Connection Manager CLI](#getting-started-with-the-hybrid-connection-manager-cli).

-----

### Getting started with the Hybrid Connection Manager CLI

# [Windows](#tab/windows)

On Windows, you can use the Hybrid Connection Manager CLI by searching for and opening *Hybrid Connection Manager CLI*.

# [Linux](#tab/linux)

On Linux, once installed, you can run `hcm help` to confirm the Hybrid Connection Manager is installed and to see the available commands.

-----

To use the interactive mode with the Hybrid Connection Manager CLI, which allows you to view your Azure subscription and Hybrid Connection details, you need to install and sign-in to the Azure CLI. For installation instructions, see [How to install the Azure CLI][install-azure-cli] and select the appropriate option for your client. Once installed, run `az login` and follow the prompts to complete your sign-in.

When you start the Hybrid Connection Manager CLI, you can run `hcm list` to see the Hybrid Connections that are already added.

To add a Hybrid Connections to your Hybrid Connection Manager CLI:

1. Start the Hybrid Connection Manager CLI.
1. Run `hcm add` and wait for authentication to Azure to complete. If you haven't installed and logged into the Azure CLI, you need to complete this step first in order to use interactive mode. If you don't want to install the Azure CLI, follow the instructions for [manually adding a Hybrid Connection with the CLI](#manually-add-a-hybrid-connection).

    :::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-hcm-cli-add.png" alt-text="Screenshot of adding a Hybrid Connection with the CLI.":::

1. Choose a subscription. The Hybrid Connection Manager retrieves all of the Hybrid Connections in that subscription. This step can take up to one minute to complete.
1. Select the Hybrid Connection that you want the Hybrid Connection Manager to relay.

Run `hcm list` to see the Hybrid Connections you added.

You can also show the details of a specific Hybrid Connection with the `hcm show` command.

:::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-hcm-details-cli.png" alt-text="Screenshot of Hybrid Connection Details in CLI.":::

### Redundancy

Each Hybrid Connection Manager can support multiple Hybrid Connections. Multiple Hybrid Connection Managers can support any Hybrid Connection. The default behavior is to route traffic across the configured Hybrid Connection Managers for any given endpoint. If you want high availability on your Hybrid Connections from your network, run multiple Hybrid Connection Managers on separate machines. The load distribution algorithm used by the Relay service to distribute traffic to the Hybrid Connection Managers is random assignment.

### Manually add a Hybrid Connection

To enable someone outside your subscription to host a Hybrid Connection Manager instance for a given Hybrid Connection, share the gateway connection string for the Hybrid Connection with them. You can see the gateway connection string in the Hybrid Connection properties of your App Service in the [Azure portal]. The gateway connection string is in the format `Endpoint=sb://[NAMESPACE].servicebus.windows.net/;SharedAccessKeyName=defaultListener;SharedAccessKey=[KEY];EntityPath=[HYBRID-CONNECTION-NAME]`.

:::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-connection-string.png" alt-text="Screenshot of the Hybrid Connection gateway connection string in the Azure portal.":::

To use that string in the Hybrid Connection Manager GUI, select **+ New** and **Use Connection String** and paste in the gateway connection string.

:::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-manual.png" alt-text="Screenshot of the dialog box where you manually add a Hybrid Connection.":::

To use that string in the Hybrid Connection Manager CLI, run `hcm add` with either the connection string, or the Hybrid Connection resource details.

:::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-manual-cli.png" alt-text="Screenshot of the Hybrid Connection Manager CLI showing how to manually add a Hybrid Connection.":::

### Upgrade

# [Windows](#tab/windows)

There are periodic updates to the Hybrid Connection Manager to fix issues or provide improvements. When upgrades are released, a dialog box appears in the Hybrid Connection Manager GUI at startup. To check for available upgrades with the Hybrid Connection Manager CLI, run `hcm version`. Upgrades must be done using the MSI installer and can't be done using the CLI. Applying the upgrade applies the changes and restarts the Hybrid Connection Manager.

# [Linux](#tab/linux)

There are periodic updates to the Hybrid Connection Manager to fix issues or provide improvements. You don't receive an automatic notification when an upgrade is available. You should periodically run `hcm version` to check for available upgrades. Applying the upgrade applies the changes and restarts the Hybrid Connection Manager.

-----

## Adding a Hybrid Connection to your app programmatically

There's Azure CLI support for Hybrid Connections. The commands provided operate at both the app and the App Service plan level. The app level commands are:

```azurecli
az webapp hybrid-connection

Group
    az webapp hybrid-connection : Methods that list, add and remove hybrid-connections from webapps.
        This command group is in preview. It may be changed/removed in a future release.
Commands:
    add    : Add a hybrid-connection to a webapp.
    list   : List the hybrid-connections on a webapp.
    remove : Remove a hybrid-connection from a webapp.
```

The App Service plan commands enable you to set which key a given hybrid-connection uses. There are two keys set on each Hybrid Connection, a primary and a secondary. You can choose to use the primary or secondary key with the following commands. This option enables you to switch keys for when you want to periodically regenerate your keys.

```azurecli
az appservice hybrid-connection --help

Group
    az appservice hybrid-connection : A method that sets the key a hybrid-connection uses.
        This command group is in preview. It may be changed/removed in a future release.
Commands:
    set-key : Set the key that all apps in an appservice plan use to connect to the hybrid-
                connections in that appservice plan.
```

## Secure your Hybrid Connections

Any user who has sufficient permissions on an Azure Service Bus Relay can add an existing Hybrid Connection for that relay to other App Service web apps. To prevent others from reusing that same Hybrid Connection, lock down access to the Azure Service Bus Relay. This situation might happen when the target resource is a service that doesn't have any other security measures in place to prevent unauthorized access.

Anyone with `Reader` access to the Relay is able to *see* the Hybrid Connection if they attempt to add it to their Web App in the Azure portal. They can't *add* it because they lack the permissions to retrieve the connection string that is used to establish the relay connection. In order to add the Hybrid Connection, they must have the `listKeys` permission (`Microsoft.Relay/namespaces/hybridConnections/authorizationRules/listKeys/action`). The `Contributor` role or any other role that includes this permission on the Relay allows users to use the Hybrid Connection and add it to their own Web Apps.

## Manage your Hybrid Connections

If you need to change the endpoint host or port for a Hybrid Connection, use the following steps:

1. In the Hybrid Connection Manager, select the connection to see its details window. Then select **Remove**.
1. In the [Azure portal], select your app. Select **Settings** > **Networking**.
1. Next to **Hybrid connections**, select the **Configured** link.
1. In **Hybrid connections**, right-click the connection and select **Disconnect**.
1. Navigate to the Relay for the endpoint you need to update. In the navigation menu, under **Entities**, select **Hybrid Connections** under **Entities**.
1. Select the Hybrid Connection. In its navigation menu, under **Settings**, select **Properties**.
1. Make your changes and select **Save changes**.
1. Return to the **Hybrid Connections** settings for your App Service and add the Hybrid Connection again. Ensure the endpoint is updated as intended. If you don't see the Hybrid Connection in the list, refresh in 5-10 minutes.
1. Return to the Hybrid Connection Manager on the local machine and add the connection again.

## Troubleshooting

The status of **Connected** means that at least one Hybrid Connection Manager is configured with that Hybrid Connection, and is able to reach Azure. If the status for your Hybrid Connection doesn't say **Connected**, your Hybrid Connection isn't configured on any Hybrid Connection Manager that has access to Azure. When your Hybrid Connection Manager shows **Not Connected**, there are a few things to check:

- Does your host have outbound access to Azure on port 443? You can test from your Hybrid Connection Manager host using the PowerShell command `Test-NetConnection Destination -P Port`.
- Is your Hybrid Connection Manager potentially in a bad state? Try restarting the **Azure Hybrid Connection Manager Service** local service.
- Do you have conflicting software installed? Hybrid Connection Manager can't coexist with Biztalk Hybrid Connection Manager or Service Bus for Windows Server. When you install the Hybrid Connection Manager, you should remove any versions of these packages first.
- Do you have a firewall between your Hybrid Connection Manager host and Azure? If so, you need to allow outbound access to both the Service Bus endpoint URL *AND* the Service Bus gateways that service your Hybrid Connection.

  - You can find the Service Bus endpoint URL in the Hybrid Connection Manager GUI.

    :::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-service-bus-endpoint.png" alt-text="Screenshot of Hybrid Connection Service Bus endpoint.":::
  
  - You can also find the Service Bus endpoint URL in the Hybrid Connection Manager CLI.
  
    :::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-service-bus-endpoint-cli.png" alt-text="Screenshot of Hybrid Connection Service Bus endpoint in the CLI.":::

  - The Service Bus gateways are the resources that accept the request into the Hybrid Connection and pass it through the Azure Relay. You need to allowlist all of the gateways. The gateways are in the format: `G#-prod-[stamp]-sb.servicebus.windows.net` and `GV#-prod-[stamp]-sb.servicebus.windows.net`. The number sign, `#`, is a number between 0 and 127 and `stamp` is the name of the instance within your Azure data center where your Service Bus endpoint exists.

  - If you can use a wildcard, you can allowlist *\*.servicebus.windows.net*.
  - If you can't use a wildcard, you must allowlist all 256 of the gateways.

    You can find out the stamp using *nslookup* on the Service Bus endpoint URL.

    :::image type="content" source="media/app-service-hybrid-connections/hybrid-connections-stamp-name.png" alt-text="Screenshot of terminal showing where to find the stamp name for the Service Bus.":::

    In this example, the stamp is `sn3-010`. To allowlist the Service Bus gateways, you need the following entries:

    G0-prod-sn3-010-sb.servicebus.windows.net  
    G1-prod-sn3-010-sb.servicebus.windows.net  
    G2-prod-sn3-010-sb.servicebus.windows.net  
    G3-prod-sn3-010-sb.servicebus.windows.net  
    ...  
    G126-prod-sn3-010-sb.servicebus.windows.net  
    G127-prod-sn3-010-sb.servicebus.windows.net  
    GV0-prod-sn3-010-sb.servicebus.windows.net  
    GV1-prod-sn3-010-sb.servicebus.windows.net  
    GV2-prod-sn3-010-sb.servicebus.windows.net  
    GV3-prod-sn3-010-sb.servicebus.windows.net  
    ...  
    GV126-prod-sn3-010-sb.servicebus.windows.net  
    GV127-prod-sn3-010-sb.servicebus.windows.net

If your status says **Connected** but your app can't reach your endpoint then:

- Make sure you're using a DNS name in your Hybrid Connection. If you use an IP address, the required client DNS lookup might not happen. If the client running in your web app doesn't do a DNS lookup, then the Hybrid Connection doesn't work.
- Check that the DNS name used in your Hybrid Connection can resolve from the Hybrid Connection Manager host. Check the resolution using *nslookup EndpointDNSname* where EndpointDNSname is an exact match to what is used in your Hybrid Connection definition.
- Test access from your Hybrid Connection Manager host to your endpoint using the PowerShell command `Test-NetConnection EndpointDNSname -P Port`. If you can't reach the endpoint from your Hybrid Connection Manager host, check firewalls between the two hosts including any host-based firewalls on the destination host.
- If you're using App Service on Linux, make sure you're not using `localhost` as your endpoint host. Instead, use your machine name if you're trying to create a connection with a resource on your local machine.

In App Service, the *tcpping* command-line tool can be invoked from the Advanced Tools (Kudu) console. This tool can tell you if you have access to a TCP endpoint, but it doesn't tell you if you have access to a Hybrid Connection endpoint. When you use the tool in the console against a Hybrid Connection endpoint, you're only confirming that it uses a host:port combination.

If you have a command-line client for your endpoint, you can test connectivity from the app console. For example, you can test access to web server endpoints by using curl.

> [!NOTE]
> For questions and support specific to App Service Hybrid Connections and App Service Hybrid Connection Manager, contact [hcmsupport@service.microsoft.com](mailto:hcmsupport@service.microsoft.com).

<!--Links-->
[HCService]: /azure/service-bus-relay/relay-hybrid-connections-protocol/
[Azure portal]: https://portal.azure.com/
[sbpricing]: https://azure.microsoft.com/pricing/details/service-bus/
[install-azure-cli]: /cli/azure/install-azure-cli/
