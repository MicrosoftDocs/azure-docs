---
title: Create and manage Integration Runtimes
description: This article explains the steps to create and manage Integration Runtimes in Azure Purview.
author: linda33wj
ms.author: jingwang
ms.service: purview
ms.subservice: purview-data-map
ms.topic: how-to
ms.date: 10/22/2021
---

# Create and manage a self-hosted integration runtime

This article describes how to create and manage a self-hosted integration runtime (SHIR) that let's you scan data sources in Azure Purview.

> [!NOTE]
> The Azure Purview Integration Runtime cannot be shared with an Azure Synapse Analytics or Azure Data Factory Integration Runtime on the same machine. It needs to be installed on a separated machine.

## Prerequisites

- The supported versions of Windows are:
  - Windows 8.1
  - Windows 10
  - Windows Server 2012
  - Windows Server 2012 R2
  - Windows Server 2016
  - Windows Server 2019

Installation of the self-hosted integration runtime on a domain controller isn't supported.

- Self-hosted integration runtime requires a 64-bit Operating System with .NET Framework 4.7.2 or above. See [.NET Framework System Requirements](/dotnet/framework/get-started/system-requirements) for details.
- The recommended minimum configuration for the self-hosted integration runtime machine is a 2-GHz processor with 4 cores, 8 GB of RAM, and 80 GB of available hard drive space. For the details of system requirements, see [Download](https://www.microsoft.com/download/details.aspx?id=39717).
- If the host machine hibernates, the self-hosted integration runtime doesn't respond to data requests. Configure an appropriate power plan on the computer before you install the self-hosted integration runtime. If the machine is configured to hibernate, the self-hosted integration runtime installer prompts with a message.
- You must be an administrator on the machine to successfully install and configure the self-hosted integration runtime.
- Scan runs happen with a specific frequency per the schedule you've set up. Processor and RAM usage on the machine follows the same pattern with peak and idle times. Resource usage also depends heavily on the amount of data that is scanned. When multiple scan jobs are in progress, you see resource usage go up during peak times.
- Tasks might fail during extraction of data in Parquet, ORC, or Avro formats.

> [!IMPORTANT]
> If you will use the Self-Hosted Integration runtime to scan Parquet files, you need to install the **64-bit JRE 8 (Java Runtime Environment) or OpenJDK** on your IR machine. Check our [Java Runtime Environment section at the bottom of the page](#java-runtime-environment-installation) for an installation guide.

## Setting up a self-hosted integration runtime

To create and set up a self-hosted integration runtime, use the following procedures.

## Create a self-hosted integration runtime

1. On the home page of the [Azure Purview Studio](https://web.purview.azure.com/resource/), select **Data Map** from the left navigation pane.

2. Under **Sources and scanning** on the left pane, select **Integration runtimes**, and then select **+ New**.

   :::image type="content" source="media/manage-integration-runtimes/select-integration-runtimes.png" alt-text="Select on IR.":::

3. On the **Integration runtime setup** page, select **Self-Hosted** to create a Self-Hosted IR, and then select **Continue**.

   :::image type="content" source="media/manage-integration-runtimes/select-self-hosted-ir.png" alt-text="Create new SHIR.":::

4. Enter a name for your IR, and select Create.

5. On the **Integration Runtime settings** page, follow the steps under the **Manual setup** section. You will have to download the integration runtime from the download site onto a VM or machine where you intend to run it.

   :::image type="content" source="media/manage-integration-runtimes/integration-runtime-settings.png" alt-text="get key":::

   - Copy and paste the authentication key.

   - Download the self-hosted integration runtime from [Microsoft Integration Runtime](https://www.microsoft.com/download/details.aspx?id=39717) on a local Windows machine. Run the installer. Self-hosted integration runtime versions such as 5.4.7803.1 and 5.6.7795.1 are supported. 

   - On the **Register Integration Runtime (Self-hosted)** page, paste one of the two keys you saved earlier, and select **Register**.

     :::image type="content" source="media/manage-integration-runtimes/register-integration-runtime.png" alt-text="input key.":::

   - On the **New Integration Runtime (Self-hosted) Node** page, select **Finish**.

6. After the Self-hosted integration runtime is registered successfully, you see the following window:

   :::image type="content" source="media/manage-integration-runtimes/successfully-registered.png" alt-text="successfully registered.":::

### Configure proxy server settings

If you select the **Use system proxy** option for the HTTP proxy, the self-hosted integration runtime uses the proxy settings in diahost.exe.config and diawp.exe.config. When these files specify no proxy, the self-hosted integration runtime connects to the cloud service directly without going through a proxy. The following procedure provides instructions for updating the diahost.exe.config file:

1. In File Explorer, make a safe copy of C:\Program Files\Microsoft Integration Runtime\5.0\Shared\diahost.exe.config as a backup of the original file.
1. Open Notepad running as administrator.
1. In Notepad, open the text file C:\Program Files\Microsoft Integration Runtime\5.0\Shared\diahost.exe.config.
1. Find the default **system.net** tag as shown in the following code:

    ```xml
    <system.net>
        <defaultProxy useDefaultCredentials="true" />
    </system.net>
    ```

      You can then add proxy server details as shown in the following example and include Azure Purview, data sources and other relevant services endpoints in the bypass list:

    ```xml
    <system.net>
      <defaultProxy>
        <bypasslist>
    <add address="scaneastus2test.blob.core.windows.net" />
          <add address="scaneastus2test.queue.core.windows.net" />
          <add address="Atlas-abcd1234-1234-abcd-abcd-1234567890ab.servicebus.windows.net" />
          <add address="contosopurview1.purview.azure.com" />
          <add address="contososqlsrv1.database.windows.net" />
    <add address="contosoadls1.dfs.core.windows.net" />
    <add address="contosoakv1.vault.azure.net" />
    <add address="contosoblob11.blob.core.windows.net" />
        </bypasslist>
        <proxy proxyaddress="http://10.1.0.1:3128" bypassonlocal="True" />
      </defaultProxy>
    </system.net>
    ```
    The proxy tag allows additional properties to specify required settings like `scriptLocation`. See [\<proxy\> Element (Network Settings)](/dotnet/framework/configure-apps/file-schema/network/proxy-element-network-settings) for syntax.

    ```xml
    <proxy autoDetect="true|false|unspecified" bypassonlocal="true|false|unspecified" proxyaddress="uriString" scriptLocation="uriString" usesystemdefault="true|false|unspecified "/>
    ```

1. Save the configuration file in its original location. Then restart the self-hosted integration runtime host service, which picks up the changes.

   To restart the service, use the services applet from Control Panel. Or from Integration Runtime Configuration Manager, select the **Stop Service** button, and then select **Start Service**.

   If the service doesn't start, you likely added incorrect XML tag syntax in the application configuration file that you edited.

> [!IMPORTANT]
> Don't forget to update both diahost.exe.config and diawp.exe.config.

You also need to make sure that Microsoft Azure is in your company's allowlist. You can download the list of valid Azure IP addresses. IP Ranges for each cloud, broken down by region and by the tagged services in that cloud are now available on MS Download: 
   - Public: https://www.microsoft.com/download/details.aspx?id=56519

### Possible symptoms for issues related to the firewall and proxy server

If you see error messages like the following ones, the likely reason is improper configuration of the firewall or proxy server. Such configuration prevents the self-hosted integration runtime from connecting to Azure managed storage accounts or data sources. To ensure that your firewall and proxy server are properly configured, refer to the previous section.

- When you try to register the self-hosted integration runtime, you receive the following error message: "Failed to register this Integration Runtime node! Confirm that the Authentication key is valid and the integration service host service is running on this machine."
- When you open Integration Runtime Configuration Manager, you see a status of **Disconnected** or **Connecting**. When you view Windows event logs, under **Event Viewer** > **Application and Services Logs** > **Microsoft Integration Runtime**, you see error messages like this one:

  ```output
  Unable to connect to the remote server
  A component of Integration Runtime has become unresponsive and restarts automatically. Component name: Integration Runtime (Self-hosted).
  ```

## Networking requirements

Your self-hosted integration runtime machine will need to connect to several resources to work correctly:

* The sources you want to scan using the self-hosted integration runtime.
* Any Azure Key Vault used to store credentials for the Azure Purview resource.
* The managed Storage account and Event Hub resources created by Azure Purview.

The managed Storage and Event Hub resources can be found in your subscription under a resource group containing the name of your Azure Purview resource. Azure Purview uses these resources to ingest the results of the scan, among many other things, so the self-hosted integration runtime will need to be able to connect directly with these resources.

Here are the domains and ports that will need to be allowed through corporate and machine firewalls.

> [!NOTE]
> For domains listed with '\<managed Azure Purview storage account>', you will add the name of the managed storage account associated with your Azure Purview resource. You can find this resource in the Portal. Search your Resource Groups for a group named: managed-rg-\<your Azure Purview Resource name>. For example: managed-rg-contosoPurview. You will use the name of the storage account in this resource group.
> 
> For domains listed with '\<managed Event Hub resource>', you will add the name of the managed Event Hub associated with your Azure Purview resource. You can find this in the same Resource Group as the managed storage account.

| Domain names                  | Outbound ports | Description                              |
| ----------------------------- | -------------- | ---------------------------------------- |
| `*.servicebus.windows.net` | 443            | Global infrastructure Azure Purview uses to run its scans. Wildcard required as there is no dedicated resource. |
| `<managed Event Hub resource>.servicebus.windows.net` | 443            | Azure Purview uses this to connect with the associated service bus. It will be covered by allowing the above domain, but if you are using Private Endpoints, you will need to test access to this single domain.|
| `*.frontend.clouddatahub.net` | 443            | Global infrastructure Azure Purview uses to run its scans. Wildcard required as there is no dedicated resource. |
| `<managed Azure Purview storage account>.core.windows.net`          | 443            | Used by the self-hosted integration runtime to connect to the managed Azure storage account.|
| `<managed Azure Purview storage account>.queue.core.windows.net` | 443            | Queues used by purview to run the scan process. |
| `*.login.windows.net`          | 443            | Sign in to Azure Active Directory.|
| `*.login.microsoftonline.com` | 443            | Sign in to Azure Active Directory. |
| `download.microsoft.com` | 443           | Optional for SHIR updates. |

Based on your sources, you may also need to allow the domains of other Azure or external sources. A few examples are provided below, as well as the Azure Key Vault domain, if you are connecting to any credentials stored in the Key Vault.

| Domain names                  | Outbound ports | Description                              |
| ----------------------------- | -------------- | ---------------------------------------- |
| `<storage account>.core.windows.net`          | 443            | Optional, to connect to an Azure Storage account. |
| `*.database.windows.net`      | 1433           | Optional, to connect to Azure SQL Database or Azure Synapse Analytics. |
| `*.azuredatalakestore.net`<br>`login.microsoftonline.com/<tenant>/oauth2/token`    | 443            | Optional, to connect to Azure Data Lake Store Gen 1. |
| `<datastoragename>.dfs.core.windows.net`    | 443            | Optional, to connect to Azure Data Lake Store Gen 2. |
| `<your Key Vault Name>.vault.azure.net` | 443           | Required if any credentials are stored in Azure Key Vault. |
| Various Domains | Dependant          | Domains for any other sources the SHIR will connect to. |
  
> [!IMPORTANT]
> In most environments, you will also need to confirm that your DNS is correctly configured. To confirm you can use **nslookup** from your SHIR machine to check connectivity to each of the above domains. Each nslookup should return the IP of the resource. If you are using [Private Endpoints](catalog-private-link.md), the private IP should be returned and not the Public IP. If no IP is returned, or if when using Private Endpoints the public IP is returned, you will need to address your DNS/VNET association, or your Private Endpoint/VNET peering.

## Manage a self-hosted integration runtime

You can edit a self-hosted integration runtime by navigating to **Integration runtimes** in the **Management center**, selecting the IR and then selecting edit. You can now update the description, copy the key, or regenerate new keys.

:::image type="content" source="media/manage-integration-runtimes/edit-integration-runtime.png" alt-text="edit IR.":::

:::image type="content" source="media/manage-integration-runtimes/edit-integration-runtime-settings.png" alt-text="edit IR details.":::

You can delete a self-hosted integration runtime by navigating to **Integration runtimes** in the Management center, selecting the IR and then selecting **Delete**. Once an IR is deleted, any ongoing scans relying on it will fail.

## Java Runtime Environment Installation

If you will be scanning Parquet files using the Self-Hosted Integration runtime with Azure Purview, you will need to install either the Java Runtime Environment or OpenJDK on your self-hosted IR machine.

When scanning Parquet files using the Self-hosted IR, the service locates the Java runtime by firstly checking the registry *`(SOFTWARE\JavaSoft\Java Runtime Environment\{Current Version}\JavaHome)`* for JRE, if not found, secondly checking system variable *`JAVA_HOME`* for OpenJDK.

- **To use JRE**: The 64-bit IR requires 64-bit JRE. You can find it from [here](https://go.microsoft.com/fwlink/?LinkId=808605).
- **To use OpenJDK**: It's supported since IR version 3.13. Package the jvm.dll with all other required assemblies of OpenJDK into Self-hosted IR machine, and set system environment variable JAVA_HOME accordingly.

## Proxy server considerations

If your corporate network environment uses a proxy server to access the internet, configure the self-hosted integration runtime to use appropriate proxy settings. You can set the proxy during the initial registration phase or after it is being registered.

:::image type="content" source="media/manage-integration-runtimes/self-hosted-proxy.png" alt-text="Specify the proxy":::

When configured, the self-hosted integration runtime uses the proxy server to connect to the cloud service's source and destination (which use the HTTP or HTTPS protocol). This is why you select **Change link** during initial setup.

:::image type="content" source="media/manage-integration-runtimes/set-http-proxy.png" alt-text="Set the proxy":::

There are three configuration options:

- **Do not use proxy**: The self-hosted integration runtime doesn't explicitly use any proxy to connect to cloud services.
- **Use system proxy**: The self-hosted integration runtime uses the proxy setting that is configured in diahost.exe.config and diawp.exe.config. If these files specify no proxy configuration, the self-hosted integration runtime connects to the cloud service directly without going through a proxy.
- **Use custom proxy**: Configure the HTTP proxy setting to use for the self-hosted integration runtime, instead of using configurations in diahost.exe.config and diawp.exe.config. **Address** and **Port** values are required. **User Name** and **Password** values are optional, depending on your proxy's authentication setting. All settings are encrypted with Windows DPAPI on the self-hosted integration runtime and stored locally on the machine.

> [!IMPORTANT]
> Currently, **custom proxy** is not supported in Azure Purview. 

The integration runtime host service restarts automatically after you save the updated proxy settings.

After you register the self-hosted integration runtime, if you want to view or update proxy settings, use Microsoft Integration Runtime Configuration Manager.

1. Open **Microsoft Integration Runtime Configuration Manager**.
3. Under **HTTP Proxy**, select the **Change** link to open the **Set HTTP Proxy** dialog box.
4. Select **Next**. You then see a warning that asks for your permission to save the proxy setting and restart the integration runtime host service.

You can use the configuration manager tool to view and update the HTTP proxy.

> [!NOTE]
> If you set up a proxy server with NTLM authentication, the integration runtime host service runs under the domain account. If you later change the password for the domain account, remember to update the configuration settings for the service and restart the service. Because of this requirement, we suggest that you access the proxy server by using a dedicated domain account that doesn't require you to update the password frequently.

If using system proxy, configure the outbound [network rules](#networking-requirements) from self-hosted integration runtime virtual machine to required endpoints. 

## Installation best practices

You can install the self-hosted integration runtime by downloading a Managed Identity setup package from [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=39717).

- Configure a power plan on the host machine for the self-hosted integration runtime so that the machine doesn't hibernate. If the host machine hibernates, the self-hosted integration runtime goes offline.
- Regularly back up the credentials associated with the self-hosted integration runtime.

## Next steps

- [How scans detect deleted assets](concept-scans-and-ingestion.md#how-scans-detect-deleted-assets)

- [Use private endpoints with Azure Purview](catalog-private-link.md)
